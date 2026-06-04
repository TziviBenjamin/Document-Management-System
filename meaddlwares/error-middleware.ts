import { NextFunction ,Request, Response} from "express";

export interface AuthRequest extends Request {
    userId?: string;
}

export default class ErrorMiddleware {
    static handleError(err: any, req: AuthRequest, res: Response, next: NextFunction) { 
        console.error("Error occurred:");
        console.error("Time:", new Date().toISOString());
        console.error("Method:", req.method);
        console.error("URL:", req.originalUrl);
        console.error("User ID:", req["userId"]);
        console.error("Message:", err.message);
        console.error("Stack:", err.stack);

        const statusCode = err.statusCode || 500;
        const message = statusCode<500 ? err.message : "Internal Server Error";
        res.status(statusCode).json({ message: message }); 
}}