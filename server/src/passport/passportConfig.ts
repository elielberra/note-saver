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
import { generateLog } from "../logging/utils";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME!;

async function checkIfUserIsAlreadyRegistered(username: UserT["username"]) {
  const user = await getUserByField("username", username);
  return user ? true : false;
}

export function initializePassport() {
  passport.use(
    "local-signup",
    new LocalStrategy({ usernameField: "username" }, async (username, password, done) => {
      try {
        if (await checkIfUserIsAlreadyRegistered(username)) {
          generateLog({
            logLevel: "error",
            logMessage: ALREADY_REGISTERED_USER,
            service: "server"
          });
          return done(ALREADY_REGISTERED_USER, false);
        }
        const hashedPassword = await hashPassword(password);
        const insertedId = await createUser(username, hashedPassword);
        const newUser: UserT = {
          userId: insertedId,
          username,
          password: hashedPassword
        };
        return done(null, newUser);
      } catch (error) {
        generateLog({
          logLevel: "error",
          logMessage: "Error while attempting to sign up a user",
          service: "server",
          error
        });
        return done(error as Error);
      }
    })
  );
  passport.use(
    "local-signin",
    new LocalStrategy({ usernameField: "username" }, async (username, password, done) => {
      try {
        const user = await getUserByField("username", username);
        if (!user) {
          generateLog({
            logLevel: "error",
            logMessage: USER_NOT_FOUND,
            service: "server"
          });
          return done(USER_NOT_FOUND, false);
        }
        const isPasswordValid = await checkIfPasswordIsValid(password, user.password);
        if (!isPasswordValid) {
          generateLog({
            logLevel: "error",
            logMessage: PASSWORD_NOT_VALID,
            service: "server"
          });
          return done(PASSWORD_NOT_VALID, false);
        }
        done(null, user);
      } catch (error) {
        generateLog({
          logLevel: "error",
          logMessage: "Error while attempting to sign in user",
          service: "server",
          error: error
        });
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
        const errorMessage = "No user found with that Id. Error deserializing user";
        generateLog({
          logLevel: "error",
          logMessage: errorMessage,
          service: "server"
        });
        done(errorMessage, false);
      }
    } catch (error) {
      generateLog({
        logLevel: "error",
        logMessage: "Error while attepmting to deserialize user",
        service: "server",
        error: error
      });
      done(error, false);
    }
  });
}

export function authenticationCallback(
  error: AuthErrors,
  user: UserT | false,
  req: Request<object, object, AuthPostBody>,
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
      expiresIn: JWT_EXPIRATION_TIME
    });
    return res.status(200).json({
      username: user.username,
      authToken
    } as SuccessfulAuthResponse);
  } catch (error) {
    generateLog({
      logLevel: "error",
      logMessage: "Error while creating a JWT",
      service: "server",
      error: error
    });
    return res.status(500).json({
      message: `Internal Server error while attempting to ${authAction} a user`
    } as UnsuccessfulAuthResponse);
  }
}
