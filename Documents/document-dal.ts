import { WithId, Collection, ObjectId } from "mongodb";
import DBConn from "../utils/db-conn";
import { DocumentDetails, newDocument } from "./models";

const DOCUMENTS_COLLECTION_NAME = "documents";

export default class DocumentDal {
    private documentsCollection: Collection<newDocument>
    constructor(dbConn: DBConn) {
        this.documentsCollection = dbConn.getDocument().collection(DOCUMENTS_COLLECTION_NAME);
    }

    async createDocument(document: newDocument): Promise<void> {
        const exists = await this.documentsCollection.findOne({ id: document.id });
        if (exists) {
            throw new Error(`Document with id ${document.id} already exists`);
        }
        await this.documentsCollection.insertOne(document);
    }

    async getAllDocuments(filters: any, sort: any) {
        let documents = this.documentsCollection.find(filters);
        if (sort && Object.keys(sort).length > 0) {
            documents = documents.sort(sort);
        }
        return documents.toArray();
    }

    async getDocumentById(id: string): Promise<newDocument> {
        const document = await this.documentsCollection.findOne({ id });
        if (!document) {
            throw new Error(`Document with id ${id} not found`);
        }
        return document;
    }

    async updateDocument(document: newDocument): Promise<void> {
        const result = await this.documentsCollection.updateOne({ id: document.id }, { $set: document });
        if (!result.matchedCount) {
            throw new Error(`Document with id ${document.id} not found`);
        }
    }

    async deleteDocument(id: string): Promise<DocumentDetails | null> {
        const doc = await this.documentsCollection.findOneAndDelete({ id });

        if (!doc) return null;

        return {
            id: String(doc.id),
            author: String(doc.author),
            path: doc.path,
            title: doc.title
        };
    }
}