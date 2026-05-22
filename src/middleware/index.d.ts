import type { PayloadUser } from "../types";


declare global {
    namespace Express {
        interface Request {
            user?: PayloadUser
        }
    }
}