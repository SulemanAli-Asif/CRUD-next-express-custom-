import passport from "passport";

export const authenticate = passport.authenticate("session", { session: true });
