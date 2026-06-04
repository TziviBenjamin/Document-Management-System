import DocumentsApi from "./Documents/document-api";
import DocumentDal from "./Documents/document-dal";
import DocumentService from "./Documents/document-service";
import HistoryApi from "./History/history-api";
import HistoryDal from "./History/history-dal";
import HistoryService from "./History/history-service";
import ErrorMiddleware from "./meaddlwares/error-middleware";
import DBConn from "./utils/db-conn";
import express, { Express } from "express";


const HOST = "127.0.0.1";
const PORT = 5000;


export default class App {
    private app: Express;
    private dbConn!: DBConn;

    constructor() {
        this.app = express();
    }

    async init() {
        this.dbConn = new DBConn();
        await this.dbConn.init();

        const documentDal = new DocumentDal(this.dbConn);
        const documentService = new DocumentService(documentDal);
        const documentsApi = new DocumentsApi(documentService);

        const historyDal = new HistoryDal(this.dbConn);
        const historyService = new HistoryService(historyDal);
        const historyApi = new HistoryApi(historyService);
        this.setRoutes(documentsApi,historyApi);
        
    }

    private setRoutes(documentsApi: DocumentsApi,historyApi:HistoryApi) {
        this.app.use(express.json());
        this.app.use("/api/documents", documentsApi.router);
        this.app.use("/api/history", historyApi.router);

        this.app.use((ErrorMiddleware.handleError));
        
        this.app.listen(PORT, HOST, () => {
            console.log(`Listening on: http://${HOST}:${PORT}`);

        });
    }

    async terminate() {
        if (this.dbConn) {
            await this.dbConn.terminate();
        }
    }
}
