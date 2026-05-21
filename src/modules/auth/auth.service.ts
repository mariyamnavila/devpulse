import { pool } from "../../db";
import type { RUser } from "../../types";
import bcrypt from 'bcrypt';

const registerUserIntoDB = async (payload: RUser & { password: string }) => {
    const { name, email, password, role } = payload;
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(`
        INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, COALESCE($4, 'contributor'))
        RETURNING *
    `, [name, email, hashedPassword, role]);

    delete result.rows[0].password;
    return result;
};

export const authService = {
    registerUserIntoDB
};