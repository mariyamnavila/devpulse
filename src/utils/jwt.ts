import config from "../config";
import type { RUser } from "../types";
import jwt, { type JwtPayload } from 'jsonwebtoken';

export const signToken = (payload: RUser) => {
    const accessToken = jwt.sign(payload, config.jwt_secret, {
        expiresIn: "2d"
    })

    return { accessToken }
}
