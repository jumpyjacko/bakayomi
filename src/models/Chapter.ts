import { DirEntry } from "@tauri-apps/plugin-fs";

export interface Chapter {
    title: string;
    page_count: number;
    pages: FileSystemFileHandle[] | DirEntry[];
}
