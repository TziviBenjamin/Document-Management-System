import { ObjectId } from "mongodb";

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete"
}

export interface HistoryWithId extends History {
    _id?: ObjectId;
}

export interface NewHistory {
  "user": string,
  "documentId": string,
  "documentPath": string,
  "documentAuthor": string,
  "timestamp": Date,
  "operationType": OperationType
}