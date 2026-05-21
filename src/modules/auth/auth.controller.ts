import type { Request, Response } from "express";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";

const registerUser = async (req: Request, res: Response) => {
    try {
        const user = await authService.registerUserIntoDB(req.body);

        if (!user) {
            return sendResponse(res, {
                success: false,
                status: 500,
                message: "Failed to register user",
            })
        }

        sendResponse(res, {
            success: true,
            status: 201,
            message: "User registered successfully",
            data: user.rows[0]
        })
    } catch (error) {
        sendResponse(res, {
            success: false,
            status: 500,
            message: error instanceof Error ? error.message : "Failed to register user",
            errors: error,
        })
    }
}

export const authController = {
    registerUser
};