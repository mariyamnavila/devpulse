import express, { type Application, type Request, type Response } from 'express';
import { logger } from './middleware/logger';
import globalErrorHandler from './middleware/globalErrorHandler';
import { authRoute } from './modules/auth/auth.route';

const app: Application = express();

app.use(express.json())
app.use(logger)

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Welcome to DevPulse API"
    });
});

app.use("/api/auth", authRoute)

app.use(globalErrorHandler)

export default app;