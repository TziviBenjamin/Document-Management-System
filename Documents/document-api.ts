import { NextFunction, Request, Response, Router } from "express";
import DocumentService from "./document-service";


export default class DocumentsApi {
    public router: Router;

    constructor(private documentService: DocumentService) {
        this.router = Router();
        this.setRoutes();
    }

    private setRoutes() {
        this.router.post("/", this.createDocument.bind(this));
        this.router.get("/", this.getAllDocuments.bind(this));
        this.router.put("/:id", this.updateDocument.bind(this));
        this.router.get("/:id", this.getDocumentById.bind(this));
        this.router.delete("/:id", this.deleteDocument.bind(this));
        this.router.get("/:id/pdf", this.downloadDocument.bind(this));
    }

    private async createDocument(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.header("x-user-id");
            if (!userId) {
                const err = new Error("Missing user id");
                (err as any).statusCode = 401;
                throw err;
            }
            const created = await this.documentService.createDocument(req.body, userId);

            if (!created) {
                const err = new Error("Document was not created");
                (err as any).statusCode = 400;
                throw err;
            }
            res.status(201).json(created);
        }
        catch (err) { next(err); }
    }


    private async getAllDocuments(req: Request, res: Response, next: NextFunction) {
        try {
            const filters = {
                pathPrefix: typeof req.query.pathPrefix === "string" ? req.query.pathPrefix : undefined,
                sortBy: typeof req.query.sortBy === "string" ? req.query.sortBy : undefined,
                author: typeof req.query.author === "string" ? req.query.author : undefined
            };

            const documents = await this.documentService.getAllDocuments(filters);

            res.status(200).json(documents);
        } catch (err) { next(err); }
    }


    private async getDocumentById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const document = await this.documentService.getDocumentById(id);

            if (!document) {
                const err = new Error("Document was not found");
                (err as any).statusCode = 404;
                throw err;
            }
            res.send(document);
        } catch (err) {
            next(err);
        }
    }


    private async updateDocument(req: Request, res: Response,next: NextFunction) {
        try{
        const userId = req.header("x-user-id")!;
        if (req.params.id !== req.body.id) {
            const err = new Error("Document ID mismatch");
                (err as any).statusCode = 400;
                throw err;
        }
        const updated = await this.documentService.updateDocument(req.body, userId);
        if (!updated) {
            const err = new Error("Document was not updated");
                (err as any).statusCode = 400;
                throw err;
        }

        res.status(200).json(updated);} catch (err) {next(err);}
    }


    private async deleteDocument(req: Request, res: Response,next: NextFunction) {
        try{
        const userId = req.header("x-user-id");
        if (!userId) {
            const err = new Error("Missing user id");
                (err as any).statusCode = 401;
                throw err;
        }
        const deleted = await this.documentService.deleteDocument(req.params.id, userId);
        if (!deleted) {
            const err = new Error("Document was not found");
                (err as any).statusCode = 404;
                throw err;
        }
        return res.status(200).json(deleted);} catch (err) {next(err);
    }}



    private async downloadDocument(req: Request, res: Response,next: NextFunction) {
        try{
        const id = req.params.id;
        if (!id) {
            const err = new Error("Document ID is required");
                (err as any).statusCode = 400;
                throw err;
        }

        const doc = await this.documentService.getDocumentById(id);
        if (!doc) {
            const err = new Error("Document not found");
                (err as any).statusCode = 404;
                throw err;
        }

        const pdf = await this.documentService.downloadDocument(id);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=${doc.title}.pdf`);

        pdf.pipe(res);} catch (err) {next(err);

    }
}}
