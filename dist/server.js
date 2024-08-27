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
const prisma_session_store_1 = require("@quixo3/prisma-session-store");
const passport_config_1 = require("./passport-config/passport-config");
const authenticated_1 = require("./middleware/authenticated");
const express_session_1 = __importDefault(require("express-session"));
const prisma = new client_1.PrismaClient();
const controller_1 = require("./controller/controller");
const sessionStore = new prisma_session_store_1.PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000, //ms
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
});
const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = (0, next_1.default)({ dev });
const handle = app.getRequestHandler();
const server = (0, express_1.default)();
server.use((0, express_session_1.default)({
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
}));
server.use(passport_1.default.initialize());
passport_1.default.use(passport_config_1.localStrategy);
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
server.use(passport_1.default.session());
server.use("/server", routes_1.default);
server.use((0, cookie_parser_1.default)());
server.get("/auth/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
server.get("/auth/google/callback", passport_1.default.authenticate("google", { session: false }), controller_1.googleLogin);
server.get("/check", (req, res) => {
    res.send("Hello");
});
routes_1.default.get("/profile", authenticated_1.authenticate, async (req, res) => {
    var _a;
    const user = await prisma.user.findUnique({ where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id } });
    if (!user)
        return res.sendStatus(404); // User not found
    res.json(user);
});
server.all("*", (req, res) => {
    const parsedUrl = (0, url_1.parse)(req.url, true);
    handle(req, res, parsedUrl);
});
app.prepare().then(() => {
    server.listen(port, () => {
        console.log(` > Server listening at http://localhost:${port} as ${dev ? "development" : process.env.NODE_ENV}`);
    });
});
