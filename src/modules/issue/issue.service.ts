import { pool } from "../../db";
import type { PayloadUser } from "../../types";
import AppError from "../../utils/customError";
import type { CIssue, IIssue, IIssueQueryParams, IIssueWithReporter, UIssue } from "./issue.interface";

const createIssueIntoDB = async (payload: CIssue, id: number) => {

    const { title, description, type } = payload

    if (description.length < 20) {
        throw new Error("Description characters must be equal or greater than 20")
    }

    const result = await pool.query(`
        INSERT INTO issues(title,description,type,reporter_id)
        VALUES($1,$2,$3,$4)
        RETURNING *
        `, [title, description, type, id])

    return result
}

const getAllIssuesFromDB = async (queryParams: IIssueQueryParams) => {

    const { sort = "newest", type, status } = queryParams;

    let query = `SELECT * FROM issues`;
    const values: string[] = [];
    const conditions: string[] = [];

    // filter by type
    if (type) {
        values.push(type);
        conditions.push(`type = $${values.length}`);
    }

    // filter by status
    if (status) {
        values.push(status);
        conditions.push(`status = $${values.length}`);
    }

    // add WHERE if filters exist
    if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(" AND ");
    }
    // sort
    if (sort === "oldest") {
        query += ` ORDER BY created_at ASC`;
    } else {
        query += ` ORDER BY created_at DESC`;
    }

    // get issues
    const issuesResult = await pool.query(query, values);
    const issues = issuesResult.rows;

    // get reporter ids
    const reporterIds = [
        ...new Set(issues.map(issue => issue.reporter_id))
    ];

    const reportersResult = await pool.query(
        `SELECT id, name, role FROM users 
        WHERE id = ANY($1)
        `, [reporterIds]);

    const reporters = reportersResult.rows;

    // attach reporter data
    const formattedIssues: IIssueWithReporter[] = issues.map(issue => {

        // get reporters
        const reporter = reporters.find(
            user => user.id === issue.reporter_id
        );

        return {
            id: issue.id,
            title: issue.title,
            description: issue.description,
            type: issue.type,
            status: issue.status,
            reporter: reporter || null,
            created_at: issue.created_at,
            updated_at: issue.updated_at,
        };
    });

    if (formattedIssues.length === 1) {
        return formattedIssues[0];
    }

    return formattedIssues;

};

const getSingleIssueFromDB = async (id: string) => {
    const singleIssue = await pool.query(`
        SELECT * FROM issues
        WHERE id = $1
        `, [id])

    if (singleIssue.rows.length === 0) {
        return null;
    }

    const {
        reporter_id,
        created_at,
        updated_at,
        ...issueWithoutReportedId
    } = singleIssue.rows[0];

    const reportersResult = await pool.query(
        `SELECT id, name, role FROM users 
        WHERE id = $1`,
        [reporter_id]
    );

    const issueWithReporter = {
        ...issueWithoutReportedId,
        reporter: reportersResult.rows[0] || null,
        created_at,
        updated_at
    }

    return issueWithReporter
}

const updateIssueFromDB = async (payload: UIssue, id: string, user: PayloadUser) => {

    const { title, description, type, status = "in_progress" } = payload;

    const issueResult = await pool.query(
        `SELECT * FROM issues WHERE id = $1`,
        [id]
    );

    if (issueResult.rows.length === 0) {
        throw new AppError("Issue not found", 404);
    }

    const issue: IIssue = issueResult.rows[0];

    if (user.role === "maintainer") {

        if (issue.status === "resolved") {
            throw new AppError("This issue is already resolved", 409)
        }

        const result = await pool.query(
            `
        UPDATE issues
        SET title = COALESCE($1, title),
            description = COALESCE($2, description),
            type = COALESCE($3, type),
            status = COALESCE($4, status),
            updated_at = NOW()
        WHERE id = $5
        RETURNING *
        `,
            [title, description, type, status, id]
        );
        return result.rows[0]
    }

    if (user.role === "contributor") {
        const isOwner = issue.reporter_id === user.id
        const isOpen = issue.status === "open";

        if (!isOwner) {
            throw new AppError("Contributor can only update their own issues", 403);
        }

        if (!isOpen) {
            throw new AppError("Contributor can only update open issues", 403);
        }

        const result = await pool.query(
            `
        UPDATE issues
        SET title = COALESCE($1, title),
            description = COALESCE($2, description),
            type = COALESCE($3, type),
            updated_at = NOW()
        WHERE id = $4
        RETURNING *
        `,
            [title, description, type, id]
        );
        return result.rows[0]

    }

    throw new AppError("Unauthorized role", 403);

};

export const issueService = {
    createIssueIntoDB,
    getAllIssuesFromDB,
    getSingleIssueFromDB,
    updateIssueFromDB,
}