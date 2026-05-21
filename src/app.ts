import express, { type Application, type Request, type Response } from 'express';
import { logger } from './middleware/logger';
import globalErrorHandler from './middleware/globalErrorHandler';

export const app: Application = express();

app.use(express.json())
app.use(logger)

app.get('/', (req: Request, res: Response) => {
    res.json({ success: true, message: "Welcome to DevPulse API" });
});

app.use(globalErrorHandler)