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
  moduleName: "",
  appUserId: "",
  activeTab: "",
  appVersion: "",
  loading: false,
  isAdmin: false,
  emuColors: null,
  orgLevels: null,
  loadingText: "",
  appSettings: {},
  localLang: false,
  periodData: null,
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
  defaultColorTheme: null,
  periodDX: null,
  isMonthlyEMUSet: true,
  isPeriodChange: false,
  isAnnualEMUSet: true,
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
      state.isAdmin =
        process.env.NODE_ENV !== "production"
          ? payload
          : LZString.compressToUTF16(JSON.stringify(payload));
    },
    setLoadingText(state, payload) {
      state.loadingText = payload;
    },
    setAppSettings(state, payload) {
      state.appSettings =
        process.env.NODE_ENV !== "production"
          ? payload
          : LZString.compressToUTF16(JSON.stringify(payload));
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
      state.isMultiProgram =
        process.env.NODE_ENV !== "production"
          ? payload
          : LZString.compressToUTF16(JSON.stringify(payload));
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
    setTheme(state, payload) {
      state.defaultColorTheme = payload;
    },
    setPeriodData(state, payload) {
      state.periodData =
        process.env.NODE_ENV !== "production"
          ? payload
          : LZString.compressToUTF16(JSON.stringify(payload));
    },
    setPeriodDX(state, payload) {
      state.periodDX = payload;
    },
    setIsMonthlyEMUSet(state, payload) {
      state.isMonthlyEMUSet = payload;
    },
    setIsPeriodChange(state, payload) {
      state.isPeriodChange = payload;
    },
    setIsAnnualEMUSet(state, payload) {
      state.isAnnualEMUSet = payload;
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
    setModuleName(state, payload) {
      state.moduleName = payload;
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
      return process.env.NODE_ENV !== "production"
        ? state.isAdmin
        : JSON.parse(LZString.decompressFromUTF16(state.isAdmin));
    },
    getLoadingText(state) {
      return state.loadingText;
    },
    getAppSettings(state) {
      return Object.keys(state.appSettings).length
        ? process.env.NODE_ENV !== "production"
          ? state.appSettings
          : JSON.parse(LZString.decompressFromUTF16(state.appSettings))
        : {};
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
    getDataStoreKeys:
      (state, getters) =>
      (namespace = "") => {
        let key =
          namespace !== ""
            ? `${getters.getAppSettings.tableName}_${namespace}`
            : state.namespace;
        return state.dataStoreKeys[key]
          ? process.env.NODE_ENV !== "production"
            ? state.dataStoreKeys[key]
            : JSON.parse(LZString.decompressFromUTF16(state.dataStoreKeys[key]))
          : {};
      },
    getGlobalFactors:
      (state, getters) =>
      (namespace = "", isFromDefault = false) => {
        let n =
          namespace !== ""
            ? `${getters.getAppSettings.tableName}_${namespace}`
            : state.namespace;
        let key = isFromDefault ? getters.getAppSettings.tableName : n;

        return state.globalFactors[key]
          ? process.env.NODE_ENV !== "production"
            ? state.globalFactors[key]
            : JSON.parse(LZString.decompressFromUTF16(state.globalFactors[key]))
          : {};
      },
    getPeriodData(state) {
      return state.periodData
        ? process.env.NODE_ENV !== "production"
          ? state.periodData
          : JSON.parse(LZString.decompressFromUTF16(state.periodData))
        : null;
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
      return process.env.NODE_ENV !== "production"
        ? state.isMultiProgram
        : JSON.parse(LZString.decompressFromUTF16(state.isMultiProgram));
    },
    getLoggedInUserId(state) {
      return state.loggedInUserId;
    },
    getApplicationModule:
      (state, getters) =>
      (isFromDefault = false) => {
        let m = !isFromDefault
          ? getters.getAppSettings.modulesList.length == 1
            ? getters.getAppSettings.modulesList[0]
            : null
          : null;
        let key = isFromDefault
          ? getters.getAppSettings.tableName
          : m
          ? `${getters.getAppSettings.tableName}_${m}-dashboard`
          : state.namespace;

        return state.applicationModule[key]
          ? process.env.NODE_ENV !== "production"
            ? state.applicationModule[key]
            : JSON.parse(
                LZString.decompressFromUTF16(state.applicationModule[key])
              )
          : {};
      },
    getTheme(state) {
      return state.defaultColorTheme;
    },
    getPeriodDX(state) {
      return state.periodDX;
    },
    getIsMonthlyEMUSet(state) {
      return state.isMonthlyEMUSet;
    },
    getIsPeriodChange(state) {
      return state.isPeriodChange;
    },
    getIsAnnualEMUSet(state) {
      return state.isAnnualEMUSet;
    },
    getModuleName(state) {
      return state.moduleName;
    },
  },
  actions: {},
});
