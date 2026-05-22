import type { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { issueService } from "./issue.service";
import type { IIssueQueryParams, IIssueWithReporter } from "./issue.interface";
import type { PayloadUser } from "../../types";
import AppError from "../../utils/customError";

const createIssue = async (req: Request, res: Response) => {
    try {
        const id = req.user?.id as number;
        // console.log("controller", req);
        const result = await issueService.createIssueIntoDB(req.body, id)
        // console.log(object);

        if (result.rows.length === 0) {
            return sendResponse(res, {
                success: false,
                status: 500,
                message: "Failed to create issue"
            })
        }

        sendResponse(res, {
            success: true,
            status: 200,
            message: "Issue created successfully",
            data: result.rows[0]
        })

    } catch (error) {
        sendResponse(res, {
            success: false,
            status: error instanceof AppError ? error.status : 500,
            message: error instanceof Error ? error.message : "Failed to create issue",
            errors: error,
        })
    }
}

const getIssues = async (req: Request, res: Response) => {
    try {

        const result = await issueService.getAllIssuesFromDB(req.query as IIssueQueryParams) as IIssueWithReporter | IIssueWithReporter[];

        sendResponse(res, {
            success: true,
            status: 200,
            data: result
        })
    } catch (error) {
        sendResponse(res, {
            success: false,
            status: error instanceof AppError ? error.status : 500,
            message: error instanceof Error ? error.message : "Failed to get all issues",
            errors: error,
        })
    }
}

const getSingleIssue = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await issueService.getSingleIssueFromDB(id as string)

        if (!result) {
            return sendResponse(res, {
                success: false,
                status: 404,
                message: "Issue not found",
                data: {}
            });
        }

        sendResponse(res, {
            success: true,
            status: 200,
            data: result
        })

    } catch (error) {
        sendResponse(res, {
            success: false,
            status: error instanceof AppError ? error.status : 500,
            message: error instanceof Error ? error.message : "Failed to get Single issue",
            errors: error,
        })
    }
}

const updateIssue = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const result = await issueService.updateIssueFromDB(req.body, id as string, user as PayloadUser)

        sendResponse(res, {
            success: true,
            status: 200,
            message: "Issue updated successfully",
            data: result
        })
    } catch (error) {
        sendResponse(res, {
            success: false,
            status: error instanceof AppError ? error.status : 500,
            message: error instanceof Error ? error.message : "Failed to update issue",
            errors: error,
        })
    }
}

export const issueController = {
    createIssue,
    getIssues,
    getSingleIssue,
    updateIssue,
}