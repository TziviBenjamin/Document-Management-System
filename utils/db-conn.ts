import { Db, MongoClient } from "mongodb";

const DB_URL = "mongodb+srv://Tzivi:0534198122@cluster0.uwuiqml.mongodb.net/?appName=Cluster0"
const DOCUMENT_DB_NAME = "Project"

export default class DBConn {
    private connection!: MongoClient;

    constructor() { }

    async init() {
        this.connection = await MongoClient.connect(DB_URL);
    }

    getDocument(): Db {
        return this.connection.db(DOCUMENT_DB_NAME);
    }

    async terminate() {
        await this.connection.close();
    }

}
