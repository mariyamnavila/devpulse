import type { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { issueService } from "./issue.service";

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
            status: 500,
            message: error instanceof Error ? error.message : "Failed to create issue",
            errors: error,
        })
    }
}

export const issueController = {
    createIssue
}