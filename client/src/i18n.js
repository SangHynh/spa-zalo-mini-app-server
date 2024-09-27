import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector"; // Để tự động phát hiện ngôn ngữ của người dùng
import enTranslation from "./locales/en.json";
import viTranslation from "./locales/vi.json";

i18n
  .use(LanguageDetector) // Tự động phát hiện ngôn ngữ
  .use(initReactI18next) // Kết nối i18next với React
  .init({
    resources: {
      en: { translation: enTranslation },
      vi: { translation: viTranslation },
    },
    fallbackLng: "en", // Ngôn ngữ mặc định nếu không phát hiện được
    interpolation: {
      escapeValue: false, // React đã tự động escape XSS
    },
  });

export default i18n;
