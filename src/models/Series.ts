import { DirEntry } from '@tauri-apps/plugin-fs';

export interface Series {
    title: string;
    handle: FileSystemDirectoryHandle | DirEntry[];
};
