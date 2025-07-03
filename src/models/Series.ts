import { Cover } from './Cover';
import { Volume } from './Volume';

export interface Series {
    title: string;
    alt_titles?: string[];
    authors?: string[];
    description?: string;
    status?: string;
    original_lang?: string;
    type?: string;
    
    extension_id?: string;
    external_link?: string;

    mal_rating?: number;
    al_rating?: number;

    al_id?: number;
    
    volumes: Volume[];
    covers: Cover[];
    banner?: string;
}
