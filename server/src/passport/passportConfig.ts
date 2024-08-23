import passport from "passport";
import { IVerifyOptions, Strategy as LocalStrategy } from "passport-local";
import { getUserById, getUserByName } from "../dao";
import { QueryConfig, QueryResult } from "pg";
import { hashPassword, runQuery } from "../dao/utils";
import { AuthErrors, DoneWithErrorsT, UserT } from "../types/types";

async function checkIfUserIsAlreadyRegistered(username: UserT["username"]) {
  const userRows = await getUserByName(username);
  const userIsAlreadyRegistered = userRows.length > 0 ? true : false;
  return userIsAlreadyRegistered;
}

export function initializePassport() {
  passport.use(
    "local-signup",
    new LocalStrategy(
      { usernameField: "username" },
      async (username, password, done) => {
        try {
          if (await checkIfUserIsAlreadyRegistered(username))
            return done("AlreadyRegisteredUser", false);
          const hashedPassword = await hashPassword(password);
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
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, (user as UserT).userId);
  });
  passport.deserializeUser(async (userId: UserT["userId"], done) => {
    try {
      const userArr = await getUserById(userId);
      if (userArr.length === 1) {
        const user = userArr[0];
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
