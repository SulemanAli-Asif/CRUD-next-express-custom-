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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = (0, next_1.default)({ dev });
const handle = app.getRequestHandler();
const server = (0, express_1.default)();
server.use(express_1.default.json());
server.use(express_1.default.urlencoded({ extended: true }));
server.use("/api", routes_1.default);
server.use((0, cookie_parser_1.default)());
routes_1.default.get("/profile", async (req, res) => {
    var _a;
    const user = await prisma.user.findUnique({ where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id } });
    if (!user)
        return res.sendStatus(404);
    res.json(user);
});
server.all("*", (req, res) => {
    const parsedUrl = (0, url_1.parse)(req.url, true);
    return handle(req, res, parsedUrl);
});
app.prepare().then(() => {
    server.listen(port, () => {
        console.log(` > Server listening at http://localhost:${port} as ${dev ? "development" : process.env.NODE_ENV}`);
    });
});
