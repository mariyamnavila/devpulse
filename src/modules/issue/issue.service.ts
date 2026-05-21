import { pool } from "../../db";
import type { IIssue } from "./issue.interface";

const createIssueIntoDB = async (payload: IIssue, id: number) => {

    const { title, description, type } = payload

    if (description.length < 20) {
        throw new Error("Description characters must be equal or greater than 20")
    }

    const result = pool.query(`
        InSERT INTO issues(title,description,type,reporter_id)
        VALUES($1,$2,$3,$4)
        RETURNING *
        `, [title, description, type, id])

    return result
}

export const issueService = {
    createIssueIntoDB,
}