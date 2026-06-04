
export interface newDocument {
  "id"?: string,
  "author"?: string,
  "path": string,
  "title": string,
  "content": string,
  "createdAt"?: Date,
  "lastUpdatedAt"?: string,
  "lastUpdatedBy"?: String
}

export interface DocumentDetails {
  "id": string,
  "author": string,
  "path": string,
  "title": string
}
