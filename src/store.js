/*global settings*/
import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);
import LZString from "lz-string";

const defaultState = {
  // Default state values
  appId: "",
  baseURL: null,
  appUserId: "",
  activeTab: "",
  appVersion: "",
  loading: false,
  isAdmin: false,
  mdLayout: null,
  emuColors: null,
  orgLevels: null,
  loadingText: "",
  appSettings: {},
  localLang: false,
  baseFontSize: 16,
  dataStoreKeys: {},
  globalFactors: {},
  methodTable: null,
  userDetails: null,
  locationList: null,
  financialYear: null,
  isClearCache: false,
  defaultFontSize: 16,
  userPermissions: {},
  isMultiProgram: true,
  loggedInUserId: null,
  applicationModule: {},
  defaultViewType: "grid",
  defaultColorTheme: null,
  namespace: settings.tableName || "multi_program",
};

export default new Vuex.Store({
  // 'createPersistedState' is the plugin which persist the state even after page refresh
  plugins: [
    createPersistedState({
      key: "Multidomain",
      storage: window.sessionStorage, // By default, storage is localStorage, we can change storage to sessionStorage
    }),
  ],
  state: { ...defaultState },
  mutations: {
    // Mutation functions to change the state value
    setAppId(state, payload) {
      state.appId = payload;
    },
    setBaseURL(state, payload) {
      state.baseURL = payload;
    },
    setNamespace(state, payload) {
      state.namespace = payload;
    },
    setAppUserId(state, payload) {
      state.appUserId = payload;
    },
    setActiveTab(state, payload) {
      state.activeTab = payload;
    },
    setAppVersion(state, payload) {
      state.appVersion = payload ? `v${payload}` : "";
    },
    setLoading(state, payload) {
      state.loading = payload;
      state.loadingText = "";
    },
    setIsAdmin(state, payload) {
      state.isAdmin = payload;
    },
    setMDLayout(state, payload) {
      state.mdLayout = payload;
    },
    setLoadingText(state, payload) {
      state.loadingText = payload;
    },
    setAppSettings(state, payload) {
      state.appSettings = payload;
    },
    setLocalLang(state, payload) {
      state.localLang = payload;
    },
    setEMUColors(state, payload) {
      state.emuColors = payload;
    },
    setOrgLevels(state, payload) {
      state.orgLevels =
        process.env.NODE_ENV !== "production"
          ? payload
          : LZString.compressToUTF16(JSON.stringify(payload));
    },
    setBaseFontSize(state, payload) {
      state.baseFontSize = payload;
    },
    setDataStoreKeys(state, payload) {
      let payloadData =
        process.env.NODE_ENV !== "production"
          ? payload
          : LZString.compressToUTF16(JSON.stringify(payload));
      Vue.set(state.dataStoreKeys, state.namespace, payloadData);
    },
    setGlobalFactors(state, { payload, namespace = "" }) {
      let n = namespace !== "" ? `_${namespace}` : "";
      let key = `${state.namespace}${n}`;
      let payloadData =
        process.env.NODE_ENV !== "production"
          ? payload
          : LZString.compressToUTF16(JSON.stringify(payload));
      Vue.set(state.globalFactors, key, payloadData);
    },
    setEMUMethodTable(state, payload) {
      state.methodTable = payload;
    },
    setUserDetails(state, payload) {
      state.userDetails =
        process.env.NODE_ENV !== "production"
          ? payload
          : LZString.compressToUTF16(JSON.stringify(payload));
    },
    setLocationList(state, payload) {
      state.locationList =
        process.env.NODE_ENV !== "production"
          ? payload
          : LZString.compressToUTF16(JSON.stringify(payload));
    },
    setFinancialYear(state, payload) {
      state.financialYear = payload;
    },
    setIsClearCache(state, payload) {
      state.isClearCache = payload;
    },
    setDefaultFontSize(state, payload) {
      state.defaultFontSize = payload;
    },
    setUserPermissions(state, payload) {
      state.userPermissions =
        process.env.NODE_ENV !== "production"
          ? payload
          : LZString.compressToUTF16(JSON.stringify(payload));
    },
    setIsMultiProgram(state, payload) {
      state.isMultiProgram = payload;
    },
    setLoggedInUserId(state, payload) {
      state.loggedInUserId = payload;
    },
    setApplicationModule(state, payload) {
      let payloadData =
        process.env.NODE_ENV !== "production"
          ? payload
          : LZString.compressToUTF16(JSON.stringify(payload));
      Vue.set(state.applicationModule, state.namespace, payloadData);
    },
    setViewType(state, payload) {
      state.defaultViewType = payload;
    },
    setTheme(state, payload) {
      state.defaultColorTheme = payload;
    },
    //Keep at last only, any new mutation should be before this
    setStoreValues(state) {
      // Merge rather than replace so we don't lose observers
      // https://github.com/vuejs/vuex/issues/1118
      Object.assign(state, {
        ...state,
        dataStoreKeys: {},
        globalFactors: {},
        userPermissions: {},
        locationList: null,
        applicationModule: {},
      });
    },
  },
  getters: {
    // Getters functions to get the state value
    getAppId(state) {
      return state.appId;
    },
    getBaseURL(state) {
      return state.baseURL;
    },
    getNamespace(state) {
      return state.namespace;
    },
    getAppUserId(state) {
      return state.appUserId;
    },
    getActiveTab(state) {
      return state.activeTab;
    },
    getAppVersion(state) {
      return state.appVersion;
    },
    getLoading(state) {
      return state.loading;
    },
    getIsAdmin(state) {
      return state.isAdmin;
    },
    getMDLayout(state) {
      return state.mdLayout;
    },
    getLoadingText(state) {
      return state.loadingText;
    },
    getAppSettings(state) {
      return state.appSettings;
    },
    getLocalLang(state) {
      return state.localLang;
    },
    getEMUColors(state) {
      return state.emuColors;
    },
    getOrgLevels(state) {
      return state.orgLevels
        ? process.env.NODE_ENV !== "production"
          ? state.orgLevels
          : JSON.parse(LZString.decompressFromUTF16(state.orgLevels))
        : null;
    },
    getBaseFontSize(state) {
      return state.baseFontSize;
    },
    getDataStoreKeys(state) {
      return state.dataStoreKeys[state.namespace]
        ? process.env.NODE_ENV !== "production"
          ? state.dataStoreKeys[state.namespace]
          : JSON.parse(
              LZString.decompressFromUTF16(state.dataStoreKeys[state.namespace])
            )
        : {};
    },
    getGlobalFactors:
      (state) =>
      (namespace = "") => {
        let n = namespace !== "" ? `_${namespace}` : "";
        let key = `${state.namespace}${n}`;
        return state.globalFactors[key]
          ? process.env.NODE_ENV !== "production"
            ? state.globalFactors[key]
            : JSON.parse(LZString.decompressFromUTF16(state.globalFactors[key]))
          : {};
      },
    getEMUMethodTable(state) {
      return state.methodTable;
    },
    getUserDetails(state) {
      return state.userDetails
        ? process.env.NODE_ENV !== "production"
          ? state.userDetails
          : JSON.parse(LZString.decompressFromUTF16(state.userDetails))
        : null;
    },
    getLocationList(state) {
      return state.locationList
        ? process.env.NODE_ENV !== "production"
          ? state.locationList
          : JSON.parse(LZString.decompressFromUTF16(state.locationList))
        : null;
    },
    getFinancialYear(state) {
      return state.financialYear;
    },
    getIsClearCache(state) {
      return state.isClearCache;
    },
    getDefaultFontSize(state) {
      return state.defaultFontSize;
    },
    getUserPermissions(state) {
      return Object.keys(state.userPermissions).length
        ? process.env.NODE_ENV !== "production"
          ? state.userPermissions
          : JSON.parse(LZString.decompressFromUTF16(state.userPermissions))
        : {};
    },
    getIsMultiProgram(state) {
      return state.isMultiProgram;
    },
    getLoggedInUserId(state) {
      return state.loggedInUserId;
    },
    getApplicationModule:
      (state) =>
      (isFromDefault = false) => {
        let key = isFromDefault ? state.appSettings.tableName : state.namespace;
        return state.applicationModule[key]
          ? process.env.NODE_ENV !== "production"
            ? state.applicationModule[key]
            : JSON.parse(
                LZString.decompressFromUTF16(state.applicationModule[key])
              )
          : {};
      },
    getViewType(state) {
      return state.defaultViewType;
    },
    getTheme(state) {
      return state.defaultColorTheme;
    },
  },
  actions: {},
});
