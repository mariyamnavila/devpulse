import type { RUser } from "../types";


declare global {
    namespace Express {
        interface Request {
            user?: RUser & { id: number }
        }
    }
}