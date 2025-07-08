/* Fisher-Yates (Knuth) Shuffle */
export function shuffleArray<T>(array: T[]) {
    let currentIndex = array.length;

    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}

export function convertAniListStatus(status: string): string {
    switch (status) {
        case "FINISHED":
            return "Publishing Finished";
        case "RELEASING":
            return "Currently Publishing";
        case "CANCELLED":
            return "Cancelled";
        case "HIATUS":
            return "On Hiatus";
        case "NOT_YET_RELEASED":
            return "Not Released";
        default:
            return "?";
    }
}
