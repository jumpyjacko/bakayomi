export interface Chapter {
    title: string;
    page_count: number;
    pages: FileSystemFileHandle[] | string[];
}
