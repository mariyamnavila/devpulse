import type { Request, Response } from "express";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { signToken } from "../../utils/jwt";

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

const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // validate user
        const user = await authService.ValidateUser(email, password)
        if (!user) {
            return sendResponse(res, {
                status: 401,
                success: false,
                message: "Invalid email or password"
            })

        }

        // signToken
        const { accessToken } = signToken(user)

        const result = {
            token: accessToken,
            user: user,
        }

        sendResponse(res, {
            status: 200,
            success: true,
            message: "Login successful",
            data: result,
        })

    } catch (error) {
        sendResponse(res, {
            success: false,
            status: 500,
            message: error instanceof Error ? error.message : "Failed to login user",
            errors: error,
        })
    }
}

export const authController = {
    registerUser,
    loginUser,
};