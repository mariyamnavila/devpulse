import type { NextFunction, Request, Response } from "express";
import config from "../config";

const globalErrorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({
        success: false,
        message: err instanceof Error ? err.message : "Internal Server Error",
        errors: config.node_env === "development" && err instanceof Error ? err.stack : undefined,
    });
    next();
}

export default globalErrorHandler;