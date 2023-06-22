<template>
  <div :class="{ 'd2-header': isHeader }">
    <!-- DHIS2 header component -->
    <D2Header v-if="isHeader && appSettings" />
    <!-- Common loader component -->
    <Loader v-if="$store.state.loading" />
    <template v-if="appSettings">
      <!-- Sidebar component -->
      <sidebar
        @getMenu="getMenu"
        :flagData="flagData"
        :configData="configData"
        :configDataFP="configDataFP"
      ></sidebar>
      <!-- Content components. Lazy loaded using routes -->
      <router-view
        @flag="flag"
        :key="computedDOM"
        :sideMenu="sideMenu"
        @langChange="langChange"
        :preFetchData="preFetchData"
        @activateTour="activateTour"
        @getConfigData="getConfigData"
        @getConfigDataFP="getConfigDataFP"
      ></router-view>
      <!-- Tour component -->
      <v-tour
        name="myTour"
        :steps="steps"
        :options="{ highlight: true }"
      ></v-tour>
    </template>
    <!-- Upload config popup -->
    <UploadConfig
      :uploadConfig="uploadConfig"
      @uploadSuccess="uploadSuccess"
      @hideModal="uploadConfig = false"
    />
  </div>
</template>
<script>
import service from "@/service";
import Highcharts from "highcharts";
import { loadLanguage } from "@/i18n";
import { setOptions, bootstrap } from "vue-gtag";
import PreFetchDataMixin from "@/helpers/PreFetchDataMixin";

export default {
  /**
   * @author Ravindra Bagul
   * @description Component name.
   * TODO https://v2.vuejs.org/v2/guide/components-registration.html#Component-Names
   * @param null
   * @returns null
   */
  name: "App",
  /**
   * @author Ravindra Bagul
   * @description Special attention on mixin files.
   * You may come across a situation where a data variable, components registration, watcher,
   * computed property, methods, created & mounted like life cycle methods etc.
   * are not found in this component. Such options might be coming from the mixin file.
   * TODO https://v2.vuejs.org/v2/guide/mixins.html?redirect=true
   * @param null
   * @returns null
   */
  mixins: [PreFetchDataMixin],
  /**
   * @author Ravindra Bagul
   * @description Local/Dynamic/lazy component registration.
   * TODO https://v2.vuejs.org/v2/guide/components-registration.html
   * TODO https://v2.vuejs.org/v2/guide/components-dynamic-async.html
   * @param null
   * @returns null
   */
  components: {
    UploadConfig: () =>
      import(
        /*webpackChunkName: 'UploadConfig'*/ "@/components/config/UploadConfig"
      ), //lazy loading components,
  },
  /**
   * @author Ravindra Bagul
   * @description When a Vue instance is created, it adds all the properties found
   * in its data object to Vue’s reactivity system.
   * TODO https://v2.vuejs.org/v2/guide/instance.html#Data-and-Methods
   * @param null
   * @returns null
   */
  data() {
    return {
      steps: [],
      appTour: {},
      flagData: {},
      sideMenu: [],
      preFetchData: {},
      langChangeDOM: 0,
      configData: null,
      appSettings: null,
      configDataFP: null,
      uploadConfig: false,
    };
  },
  /**
   * @author Ravindra Bagul
   * @description For any complex logic, you should use a computed property.
   * Computed property auto calculates on dependency change.
   * Computed property also supports getters and setters.
   * TODO https://v2.vuejs.org/v2/guide/computed.html#Computed-Properties
   * @param null
   * @returns null
   */
  computed: {
    computedDOM() {
      return `${this.$route.path}-${this.langChangeDOM}`;
    },
    isHeader() {
      return this.$store.getters.getAppSettings.isAppHub;
    },
    currentTheme() {
      return this.$store.state.defaultColorTheme;
    },
  },
  /**
   * @author Ravindra Bagul
   * @description This is most useful when you want to perform asynchronous or
   * expensive operations in response to changing data.
   * TODO https://v2.vuejs.org/v2/guide/computed.html#Watchers
   * @param null
   * @returns null
   */
  watch: {
    currentTheme(newValue) {
      if (newValue) {
        service.applyTheme();
      }
    },
  },
  /**
   * @author Ravindra Bagul
   * @description Complex computation and data flow handled using method functions.
   * TODO https://v2.vuejs.org/v2/guide/events.html
   * TODO https://v2.vuejs.org/v2/guide/events.html#Method-Event-Handlers
   * @param null
   * @returns null
   */
  methods: {
    /**
     * @author Ravindra Bagul
     * @description Change application language.
     * @param lang - pass the language
     * @returns null
     */
    async langChange(lang) {
      await loadLanguage(lang);
      this.setGlobalOptions();
      this.langChangeDOM++;
    },
    /**
     * @author Ravindra Bagul
     * @description Set default options for Highcharts.
     * * This method is called after language change to update the global values
     * * of noData & drillUpText fields as per translations.
     * @param null
     * @returns null
     */
    setGlobalOptions() {
      Highcharts.setOptions({
        lang: {
          thousandsSep: ",",
          noData: this.$i18n.t("no_data_to_display"),
          drillUpText: this.$i18n.t("backTo") + " {series.name}",
        },
      });
    },
    /**
     * @author Ravindra Bagul
     * @description Activate the tour guide.
     * @param null
     * @returns null
     */
    activateTour() {
      if (
        this.appTour[this.$route.name] &&
        this.appTour[this.$route.name][this.$i18n.locale]
      ) {
        this.steps = this.appTour[this.$route.name][this.$i18n.locale];
        this.$nextTick(() => {
          this.$tours["myTour"].start();
        });
      } else {
        this.sweetAlert({
          title: this.$i18n.t("oops"),
          text: this.$i18n.t("noTour"),
        });
      }
    },
    /**
     * @author Ravindra Bagul
     * @description Emitted method.
     * * Used to generate the EMU monthly & annual sidebar navigation options.
     * @param null
     * @returns null
     */
    getConfigDataFP(data) {
      this.configDataFP = data;
    },
    /**
     * @author Ravindra Bagul
     * @description Emitted method.
     * * Used to generate the sidebar navigation options.
     * @param null
     * @returns null
     */
    getConfigData(data) {
      this.configData = data;
    },
    /**
     * @author Ravindra Bagul
     * @description Emitted method.
     * * Used to send the generated sidebar navigation options to the components.
     * @param null
     * @returns null
     */
    getMenu(menu) {
      this.sideMenu = menu;
    },
    /**
     * @author Ravindra Bagul
     * @description Emitted method.
     * * Used to send the flag details generated using analytical dashboard to the sidebar component.
     * @param null
     * @returns null
     */
    flag(flagDetails) {
      this.flagData = JSON.parse(JSON.stringify(flagDetails)); //TODO https://v2.vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats
    },
    /**
     * @author Ravindra Bagul
     * @description Get tour data from appTour.json datastore file.
     * @param null
     * @returns null
     */
    getTour() {
      let key = this.generateKey("appTour");
      service
        .getSavedConfig(key)
        .then((response) => {
          this.appTour = response.data;
        })
        .catch(() => {
          console.log("Tour data not found...");
        });
    },
    /**
     * @author Ravindra Bagul
     * @description Set google analytics options after fetching the data from appSettings.json datastore file.
     * @param ga - Google analytics measurement id
     * @returns null
     */
    enablePlugin(ga) {
      console.log("ga", ga);
      setOptions({
        config: { id: ga },
        appName: "Multidomain", // appName to capture screenview event
        pageTrackerScreenviewEnabled: true, // By default captures page route, this allows to capture the page title
      });

      bootstrap().then((gtag) => {
        // all done!
        console.log("gtag", gtag);
      });
    },
    /**
     * @author Ravindra Bagul
     * @description Get the app settings from the appSettings.json datastore file.
     * *Using in project cache.
     * @param null
     * @returns null
     */
    async getAppSettings() {
      //If data is not available in store, then get the data from the datastore files
      if (Object.keys(this.$store.getters.getAppSettings).length === 0) {
        let key = this.generateKey("appSettings");
        service
          .getSavedConfig(key)
          .then(async (response) => {
            this.$store.commit("setAppSettings", response.data); //Set app settings in store
            this.$store.commit("setLocalLang", response.data.defaultLocale); //Set default locale in store
            //Set start of financial year list in store.
            //This is used in Toolbar to show appropriate period type
            this.$store.commit("setFinancialYear", response.data.financialYear);
            //Once appSettings fetched, set and fetch other required data
            this.getData({
              ga: response.data.ga,
              locale: response.data.defaultLocale,
              appSettings: response.data,
            });
          })
          .catch(async (res) => {
            //* if appSettings not found, set default language [en = English]
            await this.langChange();
            this.$store.commit("setLoading", false);
            //* Show option to upload the appSetting.json file
            if (res.message.includes("404")) {
              this.$swal({
                title: this.$i18n.t("appSettingError"),
                confirmButtonText: this.$i18n.t("upload"),
              }).then((result) => {
                if (result.isConfirmed) {
                  this.uploadConfig = true;
                }
              });
            } else {
              this.sweetAlert({ title: this.$i18n.t("appSettingError") });
            }
          });
      } else {
        //If data available in store, then use store data
        this.getData({
          ga: this.$store.getters.getAppSettings.ga,
          locale: this.$store.getters.getLocalLang,
          appSettings: this.$store.getters.getAppSettings,
        });
      }
    },
    /**
     * @author Ravindra Bagul
     * @description After fetching appSettings file, use this function to get other common data.
     * * All the huge data required in the application can be called here. Using fetchData() mixin method.
     * @param { ga, locale, appSettings } - Google Analytics measurement id, Default application language,
     * Default appSettings respectively.
     * @returns null
     */
    async getData({ ga, locale, appSettings }) {
      this.getTour(); //* Get tour data
      this.enablePlugin(ga); //* Set google analytics options
      this.fetchData(); //* prefetch huge data, coming from mixin
      try {
        await this.langChange(locale); //set default language set in appSettings
      } catch (err) {
        console.log("Error in setting language...");
      }
      this.appSettings = appSettings;
      this.$store.commit("setLoading", false);
    },
    /**
     * @author Ravindra Bagul
     * @description Set the base font size.
     * @param null
     * @returns null
     */
    setFont() {
      let fontSize = 16;
      document.getElementById("mainHTML").style.fontSize = `${fontSize}px`;
      this.$store.commit("setBaseFontSize", fontSize);
      this.$store.commit("setDefaultFontSize", fontSize);
    },
    /**
     * @author Ravindra Bagul
     * @description Set the base url from manifest file available in project root directory.
     * @param null
     * @returns null
     */
    getBaseURLFromManifest() {
      fetch("./manifest.webapp")
        .then((response) => response.json())
        .then((json) => {
          this.$store.commit("setBaseURL", json.activities.dhis.href); //Save the baseURL in the store
          this.$store.commit("setAppVersion", json.version); //Save the application version
          this.$nextTick(() => {
            this.getAppSettings(); //Get app settings
          });
        })
        .catch(() => {
          this.$store.commit("setLoading", false);
          this.sweetAlert({ title: this.$i18n.t("manifestError") }); //show error in case manifest file not found
        });
    },
    /**
     * @author Ravindra Bagul
     * @description Set base URL for the application.
     * @param null
     * @returns null
     */
    setData() {
      this.$store.commit("setLoading", true); //Set loading true
      this.setFont(); //Set base font
      //* Check environment mode
      if (process.env.NODE_ENV !== "production") {
        //In development mode, set the base url from the .env.local file into the store
        this.$store.commit("setBaseURL", process.env.VUE_APP_BASEURL);
        this.getAppSettings(); //Get app settings
      } else {
        //In production mode, get the base url from manifest file
        this.getBaseURLFromManifest();
      }
    },
    /**
     * @author Ravindra Bagul
     * @description Get appSettings.json datastore file after uploading it at the time of application deployment.
     * @param null
     * @returns null
     */
    uploadSuccess() {
      this.uploadConfig = false;
      this.getAppSettings();
    },
  },
  /**
   * @author Ravindra Bagul
   * @description The created hook can be used to run code after an instance is created.
   * TODO https://v2.vuejs.org/v2/guide/instance.html#Instance-Lifecycle-Hooks
   * @param null
   * @returns null
   */
  created() {
    this.setData();
  },
};
</script>
