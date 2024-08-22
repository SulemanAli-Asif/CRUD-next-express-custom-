import { parse } from "url";
import next from "next";
import express from "express";
import router from "./routes/routes";
import cookieParser from "cookie-parser";
import passport from "passport";
import { PrismaClient } from "@prisma/client";
import {
  googleStrategy,
  localStrategy,
  jwtStrategy,
} from "./passport-config/passport-config";

const prisma = new PrismaClient();

interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
}
const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();

passport.use(localStrategy);
passport.use(jwtStrategy);
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

server.get("/check", (req, res) => {
  res.send("Hello");
});

server.all("*", (req, res) => {
  const parsedUrl = parse(req.url, true);
  console.log("API route hit:", req.path);
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