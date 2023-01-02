/*global settings*/
/*eslint no-undef: "error"*/
import Vue from "vue";
import VueI18n from "vue-i18n";
import service from "@/service";
import moment from "moment";
import store from "@/store";
import merge from "lodash/merge";
Vue.use(VueI18n);

const i18n = new VueI18n({
	locale: settings.defaultLocale, // by default set the locale from the 'index.html' file
	fallbackLocale: settings.defaultLocale, // fallback locale
	silentTranslationWarn: process.env.NODE_ENV === "production" ? true : false, // disable the warnings
});
export default i18n;

let loadedLanguages = []; //To hold which languages are loaded

export function initI18n() {
	//Get the default language from Datastore on first load, even before mounting the Vue main instance.
	return loadLanguage(settings.defaultLocale).then(() => i18n);
}

function setI18nLanguage(lang) {
	i18n.locale = lang; //Set the i18n locale
	moment.locale(lang); //Set the moment locale
	document.querySelector('html').setAttribute('lang', lang)
	return lang;
}

export function loadLanguage(lang) {
	// If the language was already loaded
	store.state.loading = true;
	if (loadedLanguages.includes(lang)) {
		store.state.loading = false;
		return Promise.resolve(setI18nLanguage(lang));
	}
	// If the language hasn't been loaded yet
	// Fetch the translations from the static file
	return import(
		/* webpackChunkName: "lang-[request]" */ `@/locale/${lang}.js`
	).then(async (res) => {
		// Check if translation file is present in the Datastore
		return await service
			.getSavedConfig(`translations_${lang}`)
			.then((data) => {
				// If translation file is present in Datastore, then merge the file with the static file
				let mergedTranslations = merge(res.default, data.data);
				i18n.setLocaleMessage(lang, mergedTranslations);
				loadedLanguages.push(lang);
				store.state.loading = false;
				return setI18nLanguage(lang);
			})
			.catch(() => {
				console.log(
					"Translations not found in Datastore, loading from static file..."
				);
				// If the language translation is not present in the Datastore, set the translations from local static file
				i18n.setLocaleMessage(lang, res.default);
				loadedLanguages.push(lang);
				store.state.loading = false;
				return setI18nLanguage(lang);
			});
	});
}
