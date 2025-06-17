import { Series } from "./Series";

export interface Library {
    count: number,
    series: Promise<Series[]>,
}
