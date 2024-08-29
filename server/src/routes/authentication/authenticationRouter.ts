import express, { Request, Response } from "express";
import { AuthErrors, AuthPostBody, IsAuthenticatedResponse, UserT } from "../../types/types";
import passport from "passport";
import { hasUsernameAndPassword, isAuthenticated } from "../../middlewares";
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
  (req: Request<{}, {}, AuthPostBody>, res: Response) => {
    passport.authenticate("local-signin", (error: AuthErrors, user: UserT | false) =>
      authenticationCallback(error, user, req, res, "signin")
    )(req as Request, res as Response);
  }
);

authenticationRouter.post("/signout", (req: Request, res: Response) => {
  req.logout((error) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "Internal server error while attempting to login a user" });
    }
    res.sendStatus(200);
  });
});

authenticationRouter.get("/isauthenticated", isAuthenticated, async (req: Request, res: Response) => {
  res
    .status(200)
    .json({ isAuthenticated: true, username: req.user!.username } as IsAuthenticatedResponse);
});

export default authenticationRouter;
