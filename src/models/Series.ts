import { Volume } from './Volume';

export interface Series {
    title: string;
    cover_index?: number; // NOTE: refers to a volume's cover to use as series cover
    extension_id?: string;
    external_link?: string;
    volumes: Volume[];
}
