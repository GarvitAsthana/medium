"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogSchema = exports.createBlogSchema = exports.signinSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
    name: zod_1.z.string().optional()
});
exports.signinSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
});
exports.createBlogSchema = zod_1.z.object({
    title: zod_1.z.string(),
    content: zod_1.z.string()
});
exports.updateBlogSchema = zod_1.z.object({
    title: zod_1.z.string(),
    content: zod_1.z.string(),
    id: zod_1.z.string().uuid()
});
