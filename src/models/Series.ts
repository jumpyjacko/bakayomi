import { DirEntry } from '@tauri-apps/plugin-fs';
import { Volume } from './Volume';

export interface Series {
    title: string;
    cover: Blob | undefined; // # TODO: don't
    handle: FileSystemDirectoryHandle | DirEntry[];
    volumes: Volume[] | undefined; // # TODO: don't
};
