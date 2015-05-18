 export interface DialogContent {
    Title: string;
    Body: string;
    Type: ContentType;
}

export enum ContentType {
    Error,
    Warning,
    Success
}
