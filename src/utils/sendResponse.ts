import type { Response } from "express";

interface IError {
    message: string;
    details?: string;
}
interface IResponse<T> {
    success: boolean,
    status: number,
    message: string,
    data?: T,
    error?: IError
}


export const sendResponse = <T>(res: Response, data: IResponse<T>) => {

    const { success, status: statusCode, message, data: result, error } = data

    res.status(statusCode).json({
        success,
        message,
        data: result,
        error,
    })
}