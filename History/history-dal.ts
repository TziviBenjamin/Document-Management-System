
import { Collection } from "mongodb";
import DBConn from "../utils/db-conn";
import { HistoryWithId, NewHistory } from "./models";


const HISTORYS_COLLECTION_NAME = "history";
export default class HistoryDal {
    private historyCollection: Collection<History>
    constructor(dbConn: DBConn) {
        this.historyCollection = dbConn.getDocument().collection(HISTORYS_COLLECTION_NAME);
    }

    async clearHistory(): Promise<void> {
        const res = await this.historyCollection.deleteMany({});
        if (!res.deletedCount) {
            throw new Error(`No history records found to delete`);
        }
    }
    async getHistory(filters: any, sort: any, page: number, pageSize: number): Promise<Array<HistoryWithId>> {
        const history: Array<HistoryWithId> =
            await this.historyCollection
                .find(filters)
                .sort(sort)
                .skip(page && pageSize ? (page - 1) * pageSize : 0)
                .toArray();

        history.forEach(o => delete o._id);

        return history;
    }

}