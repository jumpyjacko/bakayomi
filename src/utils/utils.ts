import i18next from "i18next";

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

export function convertAniListStatus(status: string | undefined): string {
    switch (status) {
        case "FINISHED":
            return i18next.t("statusFinished");
        case "RELEASING":
            return i18next.t("statusReleasing");
        case "CANCELLED":
            return i18next.t("statusCancelled");
        case "HIATUS":
            return i18next.t("statusHiatus");
        case "NOT_YET_RELEASED":
            return i18next.t("statusNotReleased");
        default:
            return "?";
    }
}

export function convertLngToType(lng: string | undefined): string {
    switch (lng) {
        case "JP":
            return i18next.t("japaneseComic");
        case "CN":
            return i18next.t("chineseComic");
        case "KR":
            return i18next.t("koreanComic");
        default:
            return i18next.t("nativeComic");
    }
}
