import { parse } from "url";
import next from "next";
import express from "express";
import router from "./routes/routes";
import cookieParser from "cookie-parser";
import passport from "passport";
import { PrismaClient } from "@prisma/client";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import {
  googleStrategy,
  localStrategy,
} from "./passport-config/passport-config";
import { authenticate } from "./middleware/authenticated";
import { Sequelize } from "sequelize";
import SequelizeStore from "connect-session-sequelize";
import session from "express-session";

const prisma = new PrismaClient();

import { googleLogin } from "./controller/controller";

const sessionStore = new PrismaSessionStore(prisma, {
  checkPeriod: 2 * 60 * 1000, //ms
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined,
});

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();

server.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);
server.use(passport.initialize());

passport.use(localStrategy);
passport.use(googleStrategy);
passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done: any) => {
  const user = await prisma.user.findUnique({ where: { id } });
  done(null, user);
});

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(passport.initialize());

server.use("/server", router);
server.use(cookieParser());

server.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
server.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  googleLogin
);

server.get("/check", (req, res) => {
  res.send("Hello");
});

router.get("/profile", authenticate, async (req: any, res: any) => {
  const user = await prisma.user.findUnique({ where: { id: req.user?.id } });
  if (!user) return res.sendStatus(404); // User not found
  res.json(user);
});

server.all("*", (req, res) => {
  const parsedUrl = parse(req.url, true);
  handle(req, res, parsedUrl);
});

app.prepare().then(() => {
  server.listen(port, () => {
    console.log(
      ` > Server listening at http://localhost:${port} as ${
        dev ? "development" : process.env.NODE_ENV
      }`
    );
  });
});
