import { Cover } from './Cover';
import { Volume } from './Volume';

export interface Series {
    title: string;
    alt_titles?: string[];
    author?: string;
    description?: string;
    original_lang: string;
    
    extension_id?: string;
    external_link?: string;

    mal_rating?: number;
    al_rating?: number;

    al_id?: number;
    
    volumes: Volume[];
    covers: Cover[];
    banner?: string;
}
