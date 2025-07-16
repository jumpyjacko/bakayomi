export interface Chapter {
    title: string;
    downloaded: boolean;
    
    external_link?: string;
    language?: string;
    
    handle?: FileSystemDirectoryHandle | string;
}
