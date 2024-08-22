"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const next_1 = __importDefault(require("next"));
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes/routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const client_1 = require("@prisma/client");
const passport_config_1 = require("./passport-config/passport-config");
const prisma = new client_1.PrismaClient();
const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = (0, next_1.default)({ dev });
const handle = app.getRequestHandler();
const server = (0, express_1.default)();
passport_1.default.use(passport_config_1.localStrategy);
passport_1.default.use(passport_config_1.jwtStrategy);
passport_1.default.use(passport_config_1.googleStrategy);
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
});
server.use(express_1.default.json());
server.use(express_1.default.urlencoded({ extended: true }));
server.use(passport_1.default.initialize());
server.use("/server", routes_1.default);
server.use((0, cookie_parser_1.default)());
server.get("/check", (req, res) => {
    res.send("Hello");
});
server.all("*", (req, res) => {
    const parsedUrl = (0, url_1.parse)(req.url, true);
    console.log("API route hit:", req.path);
    handle(req, res, parsedUrl);
});
app.prepare().then(() => {
    server.listen(port, () => {
        console.log(` > Server listening at http://localhost:${port} as ${dev ? "development" : process.env.NODE_ENV}`);
    });
});
