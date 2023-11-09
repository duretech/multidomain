/*eslint no-undef: "error"*/
import Vue from "vue";
import VueI18n from "vue-i18n";
import service from "@/service";
import moment from "moment";
import store from "@/store";
import merge from "lodash/merge";
Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: store.getters.getLocalLang || "en", // by default set the locale
  fallbackLocale: store.getters.getLocalLang || "en", // fallback locale
  silentTranslationWarn: process.env.NODE_ENV === "production" ? true : false, // disable the warnings
});
export default i18n;

let loadedLanguages = []; //To hold which languages are loaded

export function initI18n() {
  //Get the default language from Datastore on first load, even before mounting the Vue main instance.
  return loadLanguage(store.getters.getLocalLang).then(() => i18n);
}

/**
 * @author Ravindra Bagul
 * @description set the application language.
 * @param lang - language
 * @returns the set language
 */
function setI18nLanguage(lang) {
  i18n.locale = lang; //Set the i18n locale
  moment.locale(lang); //Set the moment locale
  document.querySelector("html").setAttribute("lang", lang);
  return lang;
}

/**
 * @author Ravindra Bagul
 * @description Fetch translations.json datastore file
 * and merge with translations.js file store at `@/locale/translations.js` path.
 * @param lang - language
 * @returns the set language
 */
export function loadLanguage(lang = "en") {
  // If the language was already loaded
  store.commit("setLoading", true);
  if (lang && loadedLanguages.includes(lang)) {
    store.commit("setLoading", false);
    return Promise.resolve(setI18nLanguage(lang));
  }
  // If the language hasn't been loaded yet
  // Fetch the translations from the static file
  return import(
    /* webpackChunkName: "lang-translations" */ `@/locale/translations.js`
  ).then(async (res) => {
    // Check if translation file is present in the Datastore
    return await service
      .getSavedConfig({ tableKey: "translations", isDefault: true })
      .then((data) => {
        // If translation file is present in Datastore, then merge the file with the static file
        let mergedTranslations = merge(res.default, data.data);
        Object.keys(mergedTranslations).forEach((l) => {
          i18n.setLocaleMessage(l, mergedTranslations[l]);
          loadedLanguages.push(l);
        });
        store.commit("setLoading", false);
        return setI18nLanguage(lang);
      })
      .catch(() => {
        console.log(
          "Translations not found in Datastore, loading from static file..."
        );
        // If the language translation is not present in the Datastore, set the translations from local static file
        //   i18n.setLocaleMessage(lang, res.default);
        Object.keys(res.default).forEach((l) => {
          i18n.setLocaleMessage(l, res.default[l]);
          loadedLanguages.push(l);
        });
        // loadedLanguages.push(lang);
        store.commit("setLoading", false);
        return setI18nLanguage(lang);
      });
  });
}
