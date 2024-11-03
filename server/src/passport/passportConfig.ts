import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { createUser, getUserByField } from "../dao";
import { hashPassword } from "../dao/utils";
import {
  ALREADY_REGISTERED_USER,
  AuthErrors,
  AuthPostBody,
  AuthTokenUserInfo,
  PASSWORD_NOT_VALID,
  SuccessfulAuthResponse,
  UnsuccessfulAuthResponse,
  USER_NOT_FOUND,
  UserT
} from "../types/types";
import { checkIfPasswordIsValid } from "../routes/utils";

const JWT_SECRET = process.env.JWT_SECRET!;

async function checkIfUserIsAlreadyRegistered(username: UserT["username"]) {
  const user = await getUserByField("username", username);
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
        const insertedId = await createUser(username, hashedPassword);
        const newUser: UserT = {
          userId: insertedId,
          username,
          password: hashedPassword
        };
        return done(null, newUser);
      } catch (error) {
        return done(error as Error);
      }
    })
  );
  passport.use(
    "local-signin",
    new LocalStrategy({ usernameField: "username" }, async (username, password, done) => {
      try {
        const user = await getUserByField("username", username);
        if (!user) return done(USER_NOT_FOUND, false);
        const isPasswordValid = await checkIfPasswordIsValid(password, user.password);
        if (!isPasswordValid) return done(PASSWORD_NOT_VALID, false);
        done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    })
  );
  passport.serializeUser((user, done) => {
    done(null, (user as UserT).userId);
  });
  passport.deserializeUser(async (userId: UserT["userId"], done) => {
    try {
      const user = await getUserByField("id", userId);
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

export function authenticationCallback(
  error: AuthErrors,
  user: UserT | false,
  req: Request<{}, {}, AuthPostBody>,
  res: Response,
  authAction: "signup" | "signin"
) {
  if (authAction === "signup" && error === ALREADY_REGISTERED_USER) {
    return res.status(409).json({ message: "User already registered" } as UnsuccessfulAuthResponse);
  } else if (
    authAction === "signin" &&
    (error === USER_NOT_FOUND || error === PASSWORD_NOT_VALID)
  ) {
    return res.status(401).json({ message: "Wrong credentials" } as UnsuccessfulAuthResponse);
  }
  if (error || !user) {
    return res.status(500).json({
      message: `Internal Server error while attempting to ${authAction} a user`
    } as UnsuccessfulAuthResponse);
  }

  try {
    const authTokenUserInfo: AuthTokenUserInfo = { userId: user.userId, username: user.username };
    const authToken = jwt.sign(authTokenUserInfo, JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION_TIME!
    });
    return res.status(200).json({
      username: user.username,
      authToken
    } as SuccessfulAuthResponse);
  } catch (error) {
    console.error("Error creating JWT", error);
    return res.status(500).json({
      message: `Internal Server error while attempting to ${authAction} a user`
    } as UnsuccessfulAuthResponse);
  }
}
