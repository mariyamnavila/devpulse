import { pool } from "../../db";
import type { IUser, RUser } from "../../types";
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

const ValidateUser = async (email: string, password: string) => {
    const result = await pool.query(`
        SELECT * FROM users 
        WHERE email = $1
        `, [email])

    if (result.rows.length === 0) {
        return null
    }

    const { password: userPassword, ...user } = result.rows[0] as IUser;

    const isValid = await bcrypt.compare(password, userPassword)

    return isValid ? user : null
}

export const authService = {
    registerUserIntoDB,
    ValidateUser,
};