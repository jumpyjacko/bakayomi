export interface Chapter {
    title: string;
    page_count: number;
    downloaded: boolean;
    external_link?: string;
    handle?: FileSystemDirectoryHandle | string;
}
