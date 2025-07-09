import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import I18NextHttpBackend from "i18next-http-backend";

await i18next
    .use(I18NextHttpBackend)
    .use(LanguageDetector)
    .init({
        fallbackLng: "en",
        detection: {
              order: ['localStorage', 'navigator'],
              caches: [],
        },
        debug: true,
        ns: ["common", "home_v", "series_v"],
        defaultNS: "common",
        backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json"
        }
    });

export default i18next;
