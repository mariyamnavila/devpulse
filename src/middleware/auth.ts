import type { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import { verifyToken } from "../utils/jwt";
import { pool } from "../db";
import type { Role } from "../types";

export const auth = (...roles: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {

        const token = req.headers.authorization

        if (!token) {
            return sendResponse(res, {
                status: 401,
                success: false,
                message: "Token not found",
            })
        }

        const payload = verifyToken(token)

        if (!payload) {
            return sendResponse(res, {
                status: 401,
                success: false,
                message: "Invalid token"
            })
        }

        const userData = await pool.query(`
            SELECT * FROM users
            WHERE email=$1
            `, [payload.email])

        const user = userData.rows[0];

        if (userData.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found",
            })
        }

        if (roles.length && !roles.includes(user.role)) {
            res.status(403).json({
                success: false,
                message: "Forbidden!!, this role have no access"
            })
        }

        req.user = user;

        next()
    }
} 