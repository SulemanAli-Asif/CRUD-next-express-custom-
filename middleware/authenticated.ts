import { Request, Response, NextFunction } from "express";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("User authenticated: ", req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};
