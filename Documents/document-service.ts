import { PassThrough } from "stream";
import DocumentDal from "./document-dal";
import { DocumentDetails, newDocument } from "./models";
import PDFDocument from "pdfkit";

export default class DocumentService {
    constructor(private documentDal: DocumentDal) { }

    async createDocument(document: newDocument, userId: string): Promise<DocumentDetails> {
        let documentDetails: DocumentDetails;

        const id = String(Math.ceil(Math.random() * 100000));

        document.id = id;
        document.author = userId;
        document.createdAt = new Date();
        document.lastUpdatedAt = new Date().toISOString();
        document.lastUpdatedBy = userId;

        documentDetails = {
            id: document.id,
            author: document.author,
            path: document.path,
            title: document.title
        };
        await this.documentDal.createDocument(document);
        return documentDetails;
    }

    async getAllDocuments(filters: any) {
        const mongoFilter: any = {};
        const sort: any = {};

        if (filters.pathPrefix) {
            mongoFilter.path = { $regex: `^${filters.pathPrefix}` };
        }
        if (filters.author) {
            mongoFilter.author = filters.author;
        }
        if (filters.sortBy) {
            if (filters.sortBy.startsWith("-")) {
                sort[filters.sortBy.substring(1)] = -1;
            } else {
                sort[filters.sortBy] = 1;
            }
        }

        const documents = await this.documentDal.getAllDocuments(mongoFilter, sort);

        return documents.map(doc => ({
            id: doc._id.toString(),
            author: doc.author,
            path: doc.path,
            title: doc.title
        }));
    }


    async getDocumentById(id: string): Promise<newDocument> {
        let document: newDocument;
        document = await this.documentDal.getDocumentById(id);
        return document;
    }


    async updateDocument(document: newDocument, userId: string): Promise<DocumentDetails> {
        let documentDetails: DocumentDetails;
        document.lastUpdatedAt = new Date().toISOString();
        document.lastUpdatedBy = userId;
        documentDetails = {
            id: String(document.id),
            author: String(document.author),
            path: document.path,
            title: document.title
        };
        await this.documentDal.updateDocument(document);
        return documentDetails;
    }

    async deleteDocument(id: string, userId: string): Promise<DocumentDetails | null> {
        const document = await this.documentDal.deleteDocument(id);
        if (!document) {
            const err: any = new Error("Document not found");
            err.statusCode = 404;
            throw err;
        }
        if (document.author !== userId) {
            const err: any = new Error("User not allowed to delete this document");
            err.statusCode = 403;
            throw err
        }
        return {
            id: document.id,
            author: document.author,
            path: document.path,
            title: document.title
        };
    }
    async downloadDocument(id: string): Promise<NodeJS.ReadableStream> {
        const doc = await this.getDocumentById(id);
        if (!doc) {
            const err: any = new Error("Document not found");
            err.statusCode = 404;
            throw err
        }

        const stream = new PassThrough();
        const pdf = new PDFDocument();
        pdf.pipe(stream);

        pdf.fontSize(20).text(doc.title);
        pdf.moveDown();
        pdf.fontSize(12).text(doc.content);
        pdf.end();

        return stream;
    }

}