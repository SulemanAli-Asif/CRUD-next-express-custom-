import { parse } from "url";
import next, { NextApiRequest, NextApiResponse } from "next";
import express from "express";
import router from "./routes/routes";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
// import handler from "./app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();
const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use("/api", router);
server.use(cookieParser());

// server.get("/api/check", (_req, res) => {
//   res.send("Hello");
// });

// server.use("/api/auth", (req, res) => {
//   return handler(req, res);
// });

// server.use("/api/auth", async (req, res) => {
//   return handle(req, res);
// });

// server.use("/providers", async (req, res) => {
//   return handle(req, res);
// });

// server.use("/api/auth/signin", async (req, res) => {
//   return handle(req, res);
// });

router.get("/profile", async (req: any, res: any) => {
  const user = await prisma.user.findUnique({ where: { id: req.user?.id } });
  if (!user) return res.sendStatus(404);
  res.json(user);
});

server.all("*", (req, res) => {
  const parsedUrl = parse(req.url, true);
  return handle(req, res, parsedUrl);
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
