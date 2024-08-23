import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserById, getUserByUsermame } from "../dao";
import { QueryConfig, QueryResult } from "pg";
import { hashPassword, runQuery } from "../dao/utils";
import { PASSWORD_NOT_VALID, USER_NOT_FOUND, UserT } from "../types/types";
import { checkIfPasswordIsValid } from "../routes/utils";

async function checkIfUserIsAlreadyRegistered(username: UserT["username"]) {
  const user = await getUserByUsermame(username);
  return user ? true : false;
}

export function initializePassport() {
  passport.use(
    "local-signup",
    new LocalStrategy({ usernameField: "username" }, async (username, password, done) => {
      try {
        if (await checkIfUserIsAlreadyRegistered(username))
          return done("AlreadyRegisteredUser", false);
        const hashedPassword = await hashPassword(password);
        // TODO: Move to DAO
        const query: QueryConfig = {
          text: `INSERT INTO ${process.env.DB_USERS_TABLE} (username, password) VALUES($1, $2) RETURNING id`,
          values: [username, hashedPassword]
        };
        const result: QueryResult<{ id: number }> = await runQuery(query);
        const insertedId = result.rows[0].id;
        const newUser: UserT = {
          userId: insertedId,
          username,
          password: hashedPassword
        };
        return done(null, newUser);
      } catch (error) {
        if (error instanceof Error) {
          return done(error);
        }
      }
    })
  );
  passport.use(
    "local-signin",
    new LocalStrategy({ usernameField: "username" }, async (username, password, done) => {
      try {
        const user = await getUserByUsermame(username);
        if (!user) return done(USER_NOT_FOUND, false);
        const isPasswordValid = await checkIfPasswordIsValid(password, user.password);
        if (!isPasswordValid) return done(PASSWORD_NOT_VALID, false);
        done(null, user);
      } catch (error) {
        if (error instanceof Error) {
          return done(error);
        }
      }
    })
  );
  passport.serializeUser((user, done) => {
    done(null, (user as UserT).userId);
  });
  passport.deserializeUser(async (userId: UserT["userId"], done) => {
    try {
      const user = await getUserById(userId);
      if (user) {
        done(null, user);
      } else {
        done("No user found with that Id. Error deseralizing user", false);
      }
    } catch (error) {
      console.error("Error while attepmting to deserialize user", error);
      done(error, false);
    }
  });
}
