import type { Response } from "express";

interface IResponse<T> {
    success: boolean,
    status: number,
    message?: string,
    data?: T,
    errors?: unknown
}


export const sendResponse = <T>(res: Response, data: IResponse<T>) => {

    const { success, status: statusCode, message, data: result, errors } = data

    res.status(statusCode).json({
        success,
        message,
        data: result,
        errors,
    })
}