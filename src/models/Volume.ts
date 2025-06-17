import { Chapter } from "./Chapter";

export interface Volume {
    title: string;
    chapter_count: number;
    chapters: Chapter[];
}
