import express, { type Application, type Request, type Response } from 'express';
import { logger } from './middleware/logger';
import globalErrorHandler from './middleware/globalErrorHandler';
import { authRoute } from './modules/auth/auth.route';
import { issueRoute } from './modules/issue/issue.route';
import cors from 'cors';

const app: Application = express();

const allowedOrigins = [
    // `http://localhost:5000`,
    "https://devpulse-api-blush.vercel.app"
];

app.use(express.json())
app.use(logger)
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}))

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Welcome to DevPulse API"
    });
});

app.use("/api/auth", authRoute)
app.use("/api/issues", issueRoute)

app.use(globalErrorHandler)

export default app;