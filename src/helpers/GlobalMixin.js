/*global settings*/
/*eslint no-undef: "error"*/

import i18n from "@/i18n";
import store from "@/store";

export default {
  data(){
    return{
      current_page : ""
    }
  },
  methods: {
    consoleLog(msg, params = []) {
      if (process.env.NODE_ENV !== "production") {
        let consoleText = msg;
        if (params.length) {
          consoleText += `, ${params.join(", ")}`;
        }
        console.log(consoleText);
      }
    },
    // This is for the standard app key format.
    // By default, the value of 'i18n.locale' is set in the 'i18n.js' file using the 'defaultLocale' key from the 'index.html' file.
    generateKey(
      key,
      isLocale = true,
      isAppUserId = true,
      locale = i18n.locale
    ) {
      let innerKey = isLocale ? `${key}_${locale}` : `${key}`;
      if (!settings.country) {
        let appId = store.state.appId ? store.state.appId : "",
          appUserId = store.state.appUserId ? store.state.appUserId : "";
        if (appId && appUserId) {
          innerKey = isAppUserId
            ? `${appUserId}_${appId}_${innerKey}`
            : `${appId}_${innerKey}`;
        } else {
          this.showLocalStorageError();
          return;
        }
      }
      return innerKey;
    },
    /**
     * In the case of 'Sandbox' instance, this is used to show the missing app ID error popup.
     */
     showLocalStorageError(loader = "showLoader") {
      this.$swal({
        title: i18n.t('oops'),
        text: "We lost app ID. Please login again."
      });
      this[loader] = false;
    },
    genericAlert(title = null, text = null) {
      let alertObj = {};
      if (title) {
        alertObj.title = title;
      }
      if (text) {
        alertObj.text = text;
      }
      this.$swal(alertObj);
    }
  },
}
