import { DirEntry } from '@tauri-apps/plugin-fs';
import { Volume } from './Volume';

export interface Series {
    title: string;
    cover: Blob;
    handle: FileSystemDirectoryHandle | DirEntry[];
    volumes: Volume[];
}
