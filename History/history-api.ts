import { NextFunction, Request, Response, Router } from "express";
import HistoryService from "./history-service";
const DEFULT_PAGE = 1;
const DEFULT_PAGE_SIZE = 10;
export default class HistoryApi {

    public router: Router;
    constructor(private historyService: HistoryService) {
        this.router = Router();
        this.setRouts();
    }
    private setRouts() {
        this.router.delete('/', this.clearHistory.bind(this));
        this.router.get('/', this.getHistory.bind(this));
    }
    private async clearHistory(req: Request, res: Response,next:NextFunction) {
        try{
        const deleted = await this.historyService.clearHistory();
        if (!deleted) {
            res.status(400).send({ message: "History was not cleared" });
        }
        return res.status(200).end();} catch (err) {next(err);}
    }



    private async getHistory(req: Request, res: Response,next:NextFunction) {
        try{
        const page = typeof req.query.page === "string" ? parseInt(req.query.page) : DEFULT_PAGE;
        const pageSize = typeof req.query.pageSize === "string" ? parseInt(req.query.pageSize) : DEFULT_PAGE_SIZE;
        const filters = {
            pathPrefix: typeof req.query.pathPrefix === "string" ? req.query.pathPrefix : undefined,
            user: typeof req.query.user === "string" ? req.query.user : undefined,
            documentId: typeof req.query.documentId === "string" ? req.query.documentId : undefined,
            documentAuthor: typeof req.query.documentAuthor === "string" ? req.query.documentAuthor : undefined,
            operationType: typeof req.query.operationType === "string" ? req.query.operationType : undefined,
            sortBy: typeof req.query.sortBy === "string" ? req.query.sortBy : undefined,
        };
        const history = await this.historyService.getHistory(filters, page , pageSize);
        res.status(200).json(history);} catch (err) {next(err);

    }
}}
