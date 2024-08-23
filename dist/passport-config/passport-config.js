"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleStrategy = exports.jwtStrategy = exports.localStrategy = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_jwt_1 = require("passport-jwt");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
exports.localStrategy = new passport_local_1.Strategy({ usernameField: "email" }, async (email, password, done) => {
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
            ? await bcrypt_1.default.compare(password, user.password)
            : false;
        if (!isMatch) {
            return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
});
// JWT Strategy
const options = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};
exports.jwtStrategy = new passport_jwt_1.Strategy(options, async (payload, done) => {
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (user) {
        return done(null, user);
    }
    else {
        return done(null, false);
    }
});
// Google OAuth Strategy
exports.googleStrategy = new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
    var _a, _b;
    try {
        const email = (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
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
    }
    catch (error) {
        console.error("Error during Google authentication:", error);
        return done(error, false);
    }
});
exports.default = passport_1.default;
