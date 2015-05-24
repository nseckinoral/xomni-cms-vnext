export interface DialogContent {
    Title: string;
    Body: string;
    Type: ContentType;
    DataContext: any;
    Click: Action<any>;
}

export interface Action<T> {
    (item: T): void;
}

export enum ContentType {
    Error,
    Warning,
    Success
}
