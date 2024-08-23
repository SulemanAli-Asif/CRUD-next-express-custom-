import { parse } from "url";
import next from "next";
import express from "express";
import router from "./routes/routes";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use("/server", router);
server.use(cookieParser());

server.get("/check", (req, res) => {
  res.send("Hello");
});

router.get("/profile", async (req: any, res: any) => {
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
