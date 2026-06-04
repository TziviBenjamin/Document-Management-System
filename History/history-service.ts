import HistoryDal from "./history-dal";
import { HistoryWithId, NewHistory } from "./models";

export default class HistoryService {
    constructor(private historyDal: HistoryDal) { }
    async clearHistory(): Promise<boolean> {
            await this.historyDal.clearHistory();
            return true;
    }



    async getHistory(filters: any, page: number, pageSize: number): Promise<Array<HistoryWithId>> {
        
        const mongoFilter: any = {};
        const sort: any = filters.sortBy ? { [filters.sortBy]: -1 } : { timestamp: -1 };


        if (filters.pathPrefix) {
            mongoFilter.path = { $regex: `^${filters.pathPrefix}` };
        }
        if (filters.user) {
            mongoFilter.user = filters.user;
        }
        if (filters.documentId) {
            mongoFilter.documentId = filters.documentId;
        }
        if (filters.documentAuthor) {
            mongoFilter.documentAuthor = filters.documentAuthor;
        }
        if (filters.operationType) {
            mongoFilter.operationType = filters.operationType;
        }

        return await this.historyDal.getHistory(mongoFilter, sort, page, pageSize);

    }


}
