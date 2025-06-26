import { Volume } from './Volume';

export interface Series {
    title: string;
    alt_titles?: string[];
    cover_uri: string;
    extension_id?: string;
    external_link?: string;
    author?: string;
    description?: string;
    volumes: Volume[];
}
