/*global settings*/
/*eslint no-undef: "error"*/

import i18n from "@/i18n";
import store from "@/store";

export default {
  data() {
    return {};
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
      isLocale = false,
      isAppUserId = true,
      locale = i18n.locale
    ) {
      let innerKey = isLocale ? `${key}_${locale}` : `${key}`;
      if (
        Object.keys(store.getters.getAppSettings).length !== 0 &&
        !store.getters.getAppSettings.country
      ) {
        let appId = store.getters.getAppId ? store.getters.getAppId : "",
          appUserId = store.getters.getAppUserId ? store.getters.getAppUserId : "";
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
      this.sweetAlert({
        title: i18n.t("oops"),
        text: i18n.t("noAppID"),
      });
      this[loader] = false;
    },
    sweetAlert({
      title = null,
      text = null,
      html = null,
      confirmButtonText = null,
      cancelButtonText = null,
      showCancelButton = false,
      reverseButtons = false,
    }) {
      let alertObj = {
        confirmButtonText: confirmButtonText || this.$i18n.t("ok"),
        cancelButtonText: cancelButtonText || this.$i18n.t("cancelbtn"),
      };
      if (showCancelButton) {
        alertObj.showCancelButton = showCancelButton;
      }
      if (reverseButtons) {
        alertObj.reverseButtons = reverseButtons;
      }
      if (title) {
        alertObj.title = title;
      }
      if (text) {
        alertObj.text = text;
      }
      if (html) {
        alertObj.html = html;
      }
      this.$swal(alertObj);
    },
  },
  beforeRouteLeave: function (to, from, next) {
    if (this.$tours["myTour"]) {
      this.$tours["myTour"].skip();
    }
    next();
  },
};
