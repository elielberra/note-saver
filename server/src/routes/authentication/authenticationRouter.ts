import express, { Request, Response } from "express";
import { AuthErrors, AuthPostBody, IsAuthenticatedResponse, UserT } from "../../types/types";
import passport from "passport";
import { hasUsernameAndPassword, verifyJWT } from "../../middlewares";
import { authenticationCallback } from "../../passport/passportConfig";

const authenticationRouter = express.Router();

authenticationRouter.post("/signup", hasUsernameAndPassword, (req: Request, res: Response) => {
  passport.authenticate("local-signup", (error: AuthErrors, user: UserT | false) =>
    authenticationCallback(error, user, req, res, "signup")
  )(req as Request, res as Response);
});

authenticationRouter.post(
  "/signin",
  hasUsernameAndPassword,
  (req: Request<object, object, AuthPostBody>, res: Response) => {
    passport.authenticate("local-signin", (error: AuthErrors, user: UserT | false) =>
      authenticationCallback(error, user, req, res, "signin")
    )(req as Request, res as Response);
  }
);

authenticationRouter.get("/isauthenticated", verifyJWT, async (req: Request, res: Response) => {
  res
    .status(200)
    .json({ isAuthenticated: true, username: req.user!.username } as IsAuthenticatedResponse);
});

export default authenticationRouter;
