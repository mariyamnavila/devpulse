import { pool } from "../../db";
import type { IIssue, IIssueQueryParams, IIssueWithReporter } from "./issue.interface";

const createIssueIntoDB = async (payload: IIssue, id: number) => {

    const { title, description, type } = payload

    if (description.length < 20) {
        throw new Error("Description characters must be equal or greater than 20")
    }

    const result = await pool.query(`
        InSERT INTO issues(title,description,type,reporter_id)
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

export const issueService = {
    createIssueIntoDB,
    getAllIssuesFromDB,
    getSingleIssueFromDB,
}