import { Cover } from './Cover';
import { Volume } from './Volume';

export interface Series {
    title: string;
    alt_titles?: string[];
    staff: string[];
    description?: string;
    status?: string;
    original_lang?: string;

    start_year?: number;
    end_year?: number;
    
    extension_id?: string;
    external_link?: string;
    al_link?: string;

    mal_rating?: number;
    al_rating?: number;
    al_popularity?: number;

    al_id?: number;
    mal_id?: number;
    
    chapter_count?: number;
    volumes?: Volume[];
    covers: Cover[];
    banner?: string;
}
