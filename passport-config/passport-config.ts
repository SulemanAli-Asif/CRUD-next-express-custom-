import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const localStrategy = new LocalStrategy(
  { usernameField: "email" },
  async (email: string, password: string, done: any) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) {
        return done(null, false, { message: "User not found" });
      }
      const isMatch = user.password
        ? await bcrypt.compare(password, user.password)
        : false;
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET!,
};

export const jwtStrategy = new JwtStrategy(
  options,
  async (payload: any, done: any) => {
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  }
);

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "/auth/google/callback",
  },
  async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error("Email not found in profile"), false);
      }

      let user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            googleId: profile.id,
            email,
            name: profile.displayName,
          },
        });
      }

      return done(null, user);
    } catch (error) {
      console.error("Error during Google authentication:", error);
      return done(error, false);
    }
  }
);

export default passport;
