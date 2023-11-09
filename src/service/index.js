/*eslint no-undef: "error"*/
import axios from "axios";
import store from "@/store.js";
//For Production
let header = {};
// For development.
if (process.env.NODE_ENV !== "production") {
  header = {
    "Cache-Control": "no-cache",
    Authorization: process.env.VUE_APP_BASIC_AUTH, //get the basic auth from .env.local file
  };
}

/**
 * @author Ravindra Bagul
 * @description Good To Know
 * ! store.getters.getBaseURL => is coming from the sessionStorage
 * ! All the url's are dynamically created
 * @param null
 * @returns null
 */
class DataService {
  constructor() {}
  /**
   * @author Ravindra Bagul
   * @description Get the data from DHIS
   * @param indID - semicolon [;] separated list of indicators/data elements Id's
   * @param level - array of organization levels of the selected location and 1 level below
   * @param location - selected location ID
   * @param period - semicolon [;] separated list of periods
   * @param ngoValue - NGO ID [specific to the Nepal]
   * @param ageGroupValue - Age Group ID  [specific to the Nepal]
   * @param msiGroupValue - MSI Group ID  [specific to the Nepal]
   * @param ougroup - Organization Group ID  [specific to the Nepal]
   * @param signal - axios signal id, to cancel the API call
   * @returns response object
   */
  getIndicatorData(
    indID = "",
    level = [],
    location = null,
    period = 2018,
    ngoValue = null,
    ageGroupValue = null,
    msiGroupValue = null,
    ougroup = null,
    signal = null
  ) {
    var ou = "";
    // console.log(ougroup)
    if (ougroup != null && ougroup != undefined && ougroup != "") {
      ou = "OU_GROUP-" + ougroup + ";" + location;
    } else {
      if (level.length > 1) {
        ou = "LEVEL-" + level[0] + ";LEVEL-" + level[1] + ";" + location;
      } else {
        ou = "LEVEL-" + level[0] + ";" + location;
      }
    }

    let url = null;

    // console.log("in service", ngoValue, ageGroupValue)
    if (ngoValue && ageGroupValue) {
      // Only for Nepal
      // if(ngoValue !== 'All' && ageGroupValue === 'All') {
      //   url = `${store.getters.getBaseURL}/api/analytics.json?dimension=dx:` + indID + `&dimension=` + ngoValue + `&dimension=pe:` + period + `&dimension=ou:` + ou + `&displayProperty=NAME&skipMeta=false&includeNumDen=false`
      // } else if(ngoValue === 'All' && ageGroupValue !== 'All') {
      //   url = `${store.getters.getBaseURL}/api/analytics.json?dimension=dx:` + indID + `&dimension=` + ageGroupValue + `&dimension=pe:` + period + `&dimension=ou:` + ou + `&displayProperty=NAME&skipMeta=false&includeNumDen=false`
      // } else if(ngoValue !== 'All' && ageGroupValue !== 'All') {
      //
      // } else {
      //   url = `${store.getters.getBaseURL}/api/analytics.json?dimension=dx:` + indID + `&dimension=pe:` + period + `&dimension=ou:` + ou + `&displayProperty=NAME&skipMeta=false&includeNumDen=false`
      // }
      if (msiGroupValue)
        url =
          `${store.getters.getBaseURL}/api/analytics.json?dimension=dx:` +
          indID +
          `&dimension=` +
          ngoValue +
          `&dimension=` +
          ageGroupValue +
          `&dimension=` +
          msiGroupValue +
          `&dimension=pe:` +
          period +
          `&dimension=ou:` +
          ou +
          `&displayProperty=NAME&skipMeta=false&includeNumDen=false`;
      else {
        url =
          `${store.getters.getBaseURL}/api/analytics.json?dimension=dx:` +
          indID +
          `&dimension=` +
          ngoValue +
          `&dimension=` +
          ageGroupValue +
          `&dimension=pe:` +
          period +
          `&dimension=ou:` +
          ou +
          `&displayProperty=NAME&skipMeta=false&includeNumDen=false`;
      }
    } else {
      // Normal case
      url =
        `${store.getters.getBaseURL}/api/analytics.json?dimension=dx:` +
        indID +
        `&dimension=pe:` +
        period +
        `&dimension=ou:` +
        ou +
        `&displayProperty=NAME&skipMeta=false&includeNumDen=false`;
    }

    return axios
      .get(url, {
        headers: header,
        signal,
      })
      .then((response) => {
        return response;
      });
  }
  /**
   * @author Ravindra Bagul
   * @description Get the data used in Analytical Dashboard module
   * @param indID - semicolon [;] separated list of indicators/data elements Id's
   * @param location - selected organization ID
   * @param period - semicolon [;] separated list of periods
   * @returns response object
   */
  getAnalyticalIndicatorData(
    indID = "",
    location = null,
    period = 2018,
    skipMeta = false,
    skipData = false
  ) {
    let url =
      `${store.getters.getBaseURL}/api/analytics.json?dimension=dx:` +
      indID +
      `&dimension=pe:` +
      period +
      `&dimension=ou:` +
      location +
      `&displayProperty=NAME&skipMeta=` +
      skipMeta +
      `&skipData=` +
      skipData +
      `&includeNumDen=false`;

    return axios
      .get(url, {
        headers: header,
      })
      .then((response) => {
        return response;
      });
  }
  /**
   * @author Ravindra Bagul
   * @description Fetch all the configuration files key stored in the datastore.
   * @param isAudit - when passed 'true', we are referring to the audit datastore
   * @param namespace - datastore namespace name
   * @param isDefault - Boolean flag to take default namespace
   * @returns response object
   */
  getAllKeys({
    namespace = "",
    isUses = false,
    isAudit = false,
    isDefault = false,
  }) {
    let tableName = store.getters.getNamespace;
    if (namespace) {
      tableName = `${store.getters.getAppSettings.tableName}_${namespace}`;
    }
    if (isDefault) {
      tableName = store.getters.getAppSettings.tableName;
    }
    if (isUses) {
      tableName = `${store.getters.getAppSettings.tableName}_uses`;
    }
    if (isAudit) {
      tableName = `${tableName}_audit`;
    }
    return axios({
      method: "get",
      url: `${store.getters.getBaseURL}/api/dataStore/${tableName}`,
      headers: header,
    });
  }
  /**
   * @author Ravindra Bagul
   * @description Save the configuration file in the datastore.
   * @param data - configuration object
   * @param tableKey - configuration file name
   * @param namespace - datastore namespace name
   * @param isUses - flag to use the Uses Analytics datastore namespace
   * @param isAudit - when passed 'true', we are referring to the audit datastore
   * @param isDefault - Boolean flag to take default namespace
   * @returns response object
   */
  saveConfig({
    data,
    tableKey,
    namespace = "",
    isUses = false,
    isAudit = false,
    isDefault = false,
  }) {
    let tableName = store.getters.getNamespace;
    if (namespace) {
      tableName = `${store.getters.getAppSettings.tableName}_${namespace}`;
    }
    if (isDefault) {
      tableName = store.getters.getAppSettings.tableName;
    }
    if (isUses) {
      tableName = `${store.getters.getAppSettings.tableName}_uses`;
    }
    if (isAudit) {
      tableName = `${tableName}_audit`;
    }
    return axios({
      method: "post",
      url: `${store.getters.getBaseURL}/api/dataStore/${tableName}/${tableKey}`,
      headers: header,
      data: data,
    });
  }
  /**
   * @author Ravindra Bagul
   * @description Update the configuration file in the datastore.
   * @param data - configuration object
   * @param tableKey - configuration file name
   * @param namespace - datastore namespace name
   * @param isUses - flag to use the Uses Analytics datastore namespace
   * @param isAudit - when passed 'true', we are referring to the audit datastore
   * @param isDefault - Boolean flag to take default namespace
   * @returns response object
   */
  updateConfig({
    data,
    tableKey,
    namespace = "",
    isUses = false,
    isAudit = false,
    isDefault = false,
  }) {
    let tableName = store.getters.getNamespace;
    if (namespace) {
      tableName = `${store.getters.getAppSettings.tableName}_${namespace}`;
    }
    if (isDefault) {
      tableName = store.getters.getAppSettings.tableName;
    }
    if (isUses) {
      tableName = `${store.getters.getAppSettings.tableName}_uses`;
    }
    if (isAudit) {
      tableName = `${tableName}_audit`;
    }
    return axios({
      method: "put",
      url: `${store.getters.getBaseURL}/api/dataStore/${tableName}/${tableKey}`,
      headers: header,
      data: data,
    });
  }
  /**
   * @author Ravindra Bagul
   * @description Get the stored configuration file from the datastore.
   * @param tableKey - configuration file name
   * @param namespace - datastore namespace name
   * @param isUses - flag to use the Uses Analytics datastore namespace
   * @param isAudit - when passed 'true', we are referring to the audit datastore
   * @param isDefault - Boolean flag to take default namespace
   * @returns response object
   */
  getSavedConfig({
    tableKey,
    namespace = "",
    isUses = false,
    isAudit = false,
    isDefault = false,
  }) {
    let tableName = store.getters.getNamespace;
    if (namespace) {
      tableName = `${store.getters.getAppSettings.tableName}_${namespace}`;
    }
    if (isDefault) {
      tableName = store.getters.getAppSettings.tableName;
    }
    if (isUses) {
      tableName = `${store.getters.getAppSettings.tableName}_uses`;
    }
    if (isAudit) {
      tableName = `${tableName}_audit`;
    }
    return axios({
      method: "get",
      url: `${store.getters.getBaseURL}/api/dataStore/${tableName}/${tableKey}`,
      headers: header,
    });
  }
  /**
   * @author Ravindra Bagul
   * @description Delete the configuration file from the datastore.
   * @param tableKey - configuration file name
   * @param namespace - datastore namespace name
   * @param isUses - flag to use the Uses Analytics datastore namespace
   * @param isAudit - when passed 'true', we are referring to the audit datastore
   * @param isDefault - Boolean flag to take default namespace
   * @returns response object
   */
  deleteSavedConfig({
    tableKey,
    namespace = "",
    isUses = false,
    isAudit = false,
    isDefault = false,
  }) {
    let tableName = store.getters.getNamespace;
    if (namespace) {
      tableName = `${store.getters.getAppSettings.tableName}_${namespace}`;
    }
    if (isDefault) {
      tableName = store.getters.getAppSettings.tableName;
    }
    if (isUses) {
      tableName = `${store.getters.getAppSettings.tableName}_uses`;
    }
    if (isAudit) {
      tableName = `${tableName}_audit`;
    }
    return axios({
      method: "delete",
      url: `${store.getters.getBaseURL}/api/dataStore/${tableName}/${tableKey}`,
      headers: header,
    });
  }
  /**
   * @author Ravindra Bagul
   * @description Get the list of Indicators.
   * @param signal - axios signal id, to cancel the API call
   * @returns response object
   */
  getIndicators(signal) {
    return axios({
      method: "get",
      // url: `${store.getters.getBaseURL}/api/programIndicators.json`,
      url: `${store.getters.getBaseURL}/api/indicators.json?paging=false`,
      headers: header,
      signal,
    });
  }
  /**
   * @author Ravindra Bagul
   * @description Get the list of Data Elements.
   * @param signal - axios signal id, to cancel the API call
   * @returns response object
   */
  getDataElements(signal) {
    return axios({
      method: "get",
      url: `${store.getters.getBaseURL}/api/dataElements.json?paging=false`,
      // url: `${store.getters.getBaseURL}/api/dataElements.json?fields=id,displayName,categoryCombo%5bid,categoryOptionCombos%5bid%5d%5d&paging=false`,
      // url: `${store.getters.getBaseURL}/api/dataElements.json?fields=id,displayName,formName,description,categoryCombo[id,displayName,categoryOptionCombos[id,displayName]]&paging=false`,
      headers: header,
      signal,
    });
  }
  /**
   * @author Ravindra Bagul
   * @description Get the list of Data Sets.
   * @param null
   * @returns response object
   */
  getDataSets() {
    return axios({
      method: "get",
      // url: `${store.getters.getBaseURL}/api/programIndicators.json`,
      url: `${store.getters.getBaseURL}/api/dataSets.json?paging=false`,
      headers: header,
    });
  }
  /**
   * @author Ravindra Bagul
   * @description Get the categoryCombo based on Data Element.
   * @param de - Data Element ID
   * @returns response object
   */
  getCategoryCombo(de) {
    return axios({
      method: "get",
      url: `${store.getters.getBaseURL}/api/dataElements/${de}.json?fields=id,displayName,categoryCombo[id,displayName,categoryOptionCombos[id,displayName]]&paging=false`,
      headers: header,
    });
  }
  /**
   * @author Ravindra Bagul
   * @description Get the categoryOptionCombo from DHIS2.
   * @param null
   * @returns response object
   */
  getAllCategoryOptionCombo() {
    return axios({
      method: "get",
      url: `${store.getters.getBaseURL}/api/categoryOptionCombos.json?paging=false`,
      headers: header,
    });
  }
  /**
   * @author Ravindra Bagul
   * @description Get the list of Organizations.
   * @param null
   * @returns response object
   */
  getOrganisation() {
    return axios({
      method: "get",
      url: `${store.getters.getBaseURL}/api/organisationUnits.json?fields=displayName,id,name,level,parent[id, name]&paging=false`,
      headers: header,
    });
  }
  /**
   * @author Ravindra Bagul
   * @description Get the organization unit levels.
   * @param null
   * @returns response object
   */
  getOrgLevels() {
    return axios({
      method: "get",
      url: `${store.getters.getBaseURL}/api/organisationUnitLevels.json?fields=level&paging=false`,
      headers: header,
    });
  }
  /**
   * @author Ravindra Bagul
   * @description Get the organization unit levels.
   * @param null
   * @returns response object
   */
  getOrganisationUnitLevels() {
    // url: `${store.getters.getBaseURL}/api/organisationUnitLevels.json?fields=id,displayName~rename(name),level&paging=false`,
    return axios({
      method: "get",
      url: `${store.getters.getBaseURL}/api/filledOrganisationUnitLevels`,
      headers: header,
    });
  }
  /**
   * @author Ravindra Bagul
   * @description Get the list of Child Organization.
   * @param uid - parent organization ID
   * @returns response object
   */
  getChildOrganisation(uid) {
    return axios({
      method: "get",
      url: `${store.getters.getBaseURL}/api/organisationUnits/${uid}/children.json?fields=id,displayName,name,level,parent[id, name]`,
      headers: header,
    });
  }
  /**
   * @author Ravindra Bagul
   * @description Get the details of the Organization.
   * @param uid - organization ID
   * @param child - flag to include/exclude the children
   * @returns response object
   */
  getIndividualOrganisation(uid, child = false, parent = false) {
    let fields = "id,name,displayName";
    if (child) {
      fields = `${fields},children[id, name, displayName]`;
    }
    if (parent) {
      fields = `${fields},parent[id, name, displayName]`;
    }
    return axios({
      method: "get",
      url: `${store.getters.getBaseURL}/api/organisationUnits/${uid}?fields=${fields}`,
      headers: header,
    });
  }
  /**
   * @author Ravindra Bagul
   * @description Get the details of the logged in user.
   * @param null
   * @returns response object
   */
  getLoggedInUser() {
    return axios({
      method: "get",
      url: `${store.getters.getBaseURL}/api/me.json?fields=id,firstName,surname,userCredentials[id,username,userRoles[id,name]],dataViewOrganisationUnits[level,id,name]`,
      headers: header,
    });
  }
  /**
   * @author Ravindra Bagul
   * @description Get the list of users.
   * @param null
   * @returns response object
   */
  getUsersList() {
    let url = `${store.getters.getBaseURL}/api/users.json?fields=id,name~rename(label),userCredentials[id,username,userRoles[id,name]]&paging=false&order=firstName%3Aasc%2Csurname%3Aasc`;
    return axios({
      method: "get",
      url,
      headers: header,
    });
  }
  /**
   * @author Ravindra Bagul
   * @description Get the list organizations with children.
   * @param uid - organisation ID
   * @param level - organisation level
   * @param signal - axios signal id, to cancel the API call
   * @returns response object
   */
  getOrganisationChildren(uid, level, signal) {
    //let orgLevel = 8;
    let url = `${store.getters.getBaseURL}/api/organisationUnits/${uid}.json?fields=id,displayName,level,parent[id, name],children[id,displayName,level,parent[id, name]]`;
    // for (let i = level; i <= orgLevel; i++) {
    // 	url += ",children[id,displayName,level"; // Create nested URL
    // }
    // for (let i = level; i <= orgLevel; i++) {
    // 	url += "]";
    // }
    //console.log(url)
    return axios(
      {
        method: "get",
        url,
        headers: header,
      },
      { signal: signal }
    );
  }
  /**
   * @author Ravindra Bagul
   * @description Get the list of data source groups based on the type.
   * @param type - data source type
   * @returns response object
   */
  getDataSourceGroups(type) {
    let url = null;
    if (type === "Indicators") {
      url = `indicatorGroups.json?fields=id,displayName~rename(name)&paging=false`;
    }
    if (type === "Data Elements") {
      url = `dataElementGroups.json?fields=id,displayName~rename(name)&paging=false`;
    }
    if (type === "Data Sets") {
      url = `dataSets.json?fields=dimensionItem~rename(id),displayName~rename(name)&paging=false`;
    }
    if (type === "Event Data Items" || type === "Program Indicators") {
      url = `programs.json?fields=id,displayName~rename(name)&paging=false`;
    }

    return axios({
      method: "get",
      url: `${store.getters.getBaseURL}/api/${url}`,
      headers: header,
    });
  }
  /**
   * @author Ravindra Bagul
   * @description Get the list of data source groups based on the type.
   * @param type - data source type
   * @param page - current page number
   * @returns response object
   */
  getDataSourceGroupsNew(type, page = 1) {
    let url = null;
    if (type === "indicators") {
      url = `indicatorGroups.json?fields=id,displayName~rename(name)&paging=false`;
    }
    if (type === "dataElements") {
      url = `dataElementGroups.json?fields=id,displayName~rename(name)&paging=false`;
    }
    if (type === "dataSets") {
      url = `dataSets.json?fields=dimensionItem~rename(id),displayName~rename(name)&paging=true&page=${page}&pageSize=50`;
    }
    if (type === "eventDataItems" || type === "programIndicators") {
      url = `programs.json?fields=id,displayName~rename(name)&paging=false`;
    }

    return axios({
      method: "get",
      url: `${store.getters.getBaseURL}/api/${url}`,
      headers: header,
    });
  }
  /**
   * @author Ravindra Bagul
   * @description Get the list of data sources based on the type and data source group id.
   * @param type - data source type
   * @param id - data source group id
   * @param page - current page number
   * @returns response object
   */
  getFilteredDataNew(type, id, page = 1) {
    let url = null;
    if (type === "indicators") {
      url =
        id === "All"
          ? `indicators.json?fields=dimensionItem~rename(id),displayName~rename(name)&paging=false`
          : `indicators.json?fields=dimensionItem~rename(id),displayName~rename(name)&filter=indicatorGroups.id:eq:${id}&paging=true&page=${page}&pageSize=50`;
    }
    if (type === "dataElements") {
      url =
        id === "All"
          ? `dataElements.json?fields=dimensionItem~rename(id),displayName~rename(name)&paging=false`
          : `dataElements.json?fields=dimensionItem~rename(id),displayName~rename(name)&filter=domainType:eq:AGGREGATE&filter=dataElementGroups.id:eq:${id}&paging=true&page=${page}&pageSize=50`;
    }
    if (type === "eventDataItems") {
      url = `programDataElements.json?program=${id}&fields=dimensionItem~rename(id),name,valueType&paging=true&page=${page}&pageSize=50`;
    }
    if (type === "programIndicators") {
      url = `programs.json?filter=id:eq:${id}&fields=programIndicators%5BdimensionItem~rename(id),displayName~rename(name)%5D&paging=true&page=${page}&pageSize=50`;
    }

    return axios({
      method: "get",
      url: `${store.getters.getBaseURL}/api/${url}`,
      headers: header,
    });
  }
  /**
   * @author Ravindra Bagul
   * @description Get the data from DHIS. Used for the Interactive Analysis module.
   * @param dimensions - can be organisation/period/data source
   * @param filters - can be organisation/period/data source, optional
   * @returns response object
   */
  getInteractiveData(dimensions, filters) {
    // console.log(dimensions)
    // console.log(filters)
    let dimension = "",
      filter = "";
    dimensions.forEach((dim, i) => {
      dimension += i === 0 ? `dimension=${dim}` : `&dimension=${dim}`;
    });
    if (filters.length > 0) {
      filters.forEach((filt) => {
        filter += `&filter=${filt}`;
      });
    }

    let url = null;
    if (filter) {
      url = `${store.getters.getBaseURL}/api/analytics.json?${dimension}${filter}&displayProperty=NAME&skipMeta=false&includeNumDen=false`;
    } else {
      url = `${store.getters.getBaseURL}/api/analytics.json?${dimension}&displayProperty=NAME&skipMeta=false&includeNumDen=true`;
    }

    return axios
      .get(url, {
        headers: header,
      })
      .then((response) => {
        return response;
      });
  }
  /**
   * @author Ravindra Bagul
   * @description Get the list of facilities.
   * @param id - facility dimension id
   * @returns response object
   */
  getFacilityTypes(id) {
    return axios({
      method: "get",
      url: `${store.getters.getBaseURL}/api/dimensions/${id}/items.json?fields=id,displayName~rename(name)&_dc=1571812835337&page=1&pageSize=50`,
      headers: header,
    });
  }
  /**
   * @author Ravindra Bagul
   * @description Get the list of dimensions available in DHIS.
   * @param null
   * @returns response object
   */
  getDimensions() {
    return axios({
      method: "get",
      url: `${store.getters.getBaseURL}/api/dimensions.json?fields=id,displayName~rename(name),dimensionType&paging=false`,
      headers: header,
    });
  }
  /**
   * @author Ravindra Bagul
   * @description Get the GeoJson of Organizations Unit.
   * @param locationID - organisation id
   * @param level - organisation level
   * @returns response object
   */
  getGeoJson(locationID, level) {
    //console.log(`${store.getters.getBaseURL}/api/organisationUnits.geojson?parent=` + locationID + `&level=` + level)
    return axios({
      method: "get",
      url:
        `${store.getters.getBaseURL}/api/organisationUnits.geojson?parent=` +
        locationID +
        `&level=` +
        level,
      //url: `${store.getters.getBaseURL}/api/geoFeatures.json?ou=ou:` + locationID + `;LEVEL-` + levelId + '&displayProperty=NAME',
      headers: header,
    });
  }
  /**
   * @author Ravindra Bagul
   * @description Apply theme based on the 'defaultColorTheme' stored in the store
   * @param null
   * @returns null
   */
  applyTheme() {
    let theme = store.getters.getTheme || "grey";
    document.body.setAttribute("data-theme", theme);
  }
  /**
   * @author Ravindra Bagul
   * @description Logout from DHIS.
   * @param null
   * @returns response object
   */
  logOut() {
    return axios({
      method: "get",
      url: `${sessionStorage.getItem(
        "baseURL"
      )}dhis-web-commons-security/logout.action`,
      headers: header,
    });
  }
  /**
   * @author Ravindra Bagul
   * @description Create dummy chart in the DHIS. Chart id is used to store the comments for the chart.
   * @param name - unique chart name
   * @returns response object
   */
  createDHISChart(name) {
    let payload = {
      columns: [
        {
          dimension: "dx",
          items: [
            {
              id: "PggNwT09D3U",
            },
          ],
        },
      ],
      rows: [
        {
          dimension: "pe",
          items: [
            {
              id: "2018",
            },
          ],
        },
      ],
      filters: [
        {
          dimension: "ou",
          items: [
            {
              id: "HfVjCurKxh2",
            },
          ],
        },
      ],
      name: name,
      title: null,
      description: "",
      prototype: {},
      type: "COLUMN",
      percentStackedValues: false,
      cumulativeValues: false,
      hideEmptyRowItems: "NONE",
      regressionType: "NONE",
      completedOnly: false,
      targetLineValue: null,
      baseLineValue: null,
      sortOrder: 0,
      aggregationType: "DEFAULT",
      rangeAxisMaxValue: null,
      rangeAxisMinValue: null,
      rangeAxisSteps: null,
      rangeAxisDecimals: null,
      noSpaceBetweenColumns: false,
      hideLegend: false,
      hideTitle: false,
      hideSubtitle: false,
      subtitle: null,
      reportParams: {},
      showData: true,
      targetLineLabel: null,
      baseLineLabel: null,
      domainAxisLabel: null,
      rangeAxisLabel: null,
    };
    let endPoint =
      store.getters.getAppSettings.commentSchema.toLowerCase() === "old"
        ? "charts"
        : "visualizations";
    return axios({
      method: "post",
      url: `${store.getters.getBaseURL}/api/${endPoint}`,
      headers: header,
      data: payload,
    });
  }
  /**
   * @author Ravindra Bagul
   * @description Check for the API. We see API endpoint changes for DHIS2 version >= 2.37
   * @param endPoint - API endPoint
   * @returns response object
   */
  checkAPI(endPoint) {
    return axios({
      method: "get",
      url: `${store.getters.getBaseURL}/api/${endPoint}`,
      headers: header,
    });
  }
  /**
   * @author Ravindra Bagul
   * @description Get the stored comments from the DHIS.
   * @param cid - chart id
   * @returns response object
   */
  getComments(cid) {
    let endPoint =
      store.getters.getAppSettings.commentSchema.toLowerCase() === "old"
        ? "charts"
        : "visualizations";
    return axios({
      method: "get",
      url: `${store.getters.getBaseURL}/api/${endPoint}/${cid}.json?fields=interpretations%5B*,user%5Bid,displayName,userCredentials%5Busername%5D%5D,likedBy%5Bid,displayName%5D,comments%5Bid,lastUpdated,text,user%5Bid,displayName#/`,
      headers: header,
    });
  }
  /**
   * @author Ravindra Bagul
   * @description Add comments to the DHIS.
   * @param cid - chart id
   * @param commentText - comment text
   * @returns response object
   */
  addComments(cid, commentText) {
    let endPoint =
      store.getters.getAppSettings.commentSchema.toLowerCase() === "old"
        ? "chart"
        : "visualization";
    return axios({
      method: "post",
      url: `${store.getters.getBaseURL}/api/interpretations/${endPoint}/${cid}`,
      headers: {
        ...header,
        "Content-Type": "text/plain",
      },
      data: commentText,
    });
  }
  /**
   * @author Ravindra Bagul
   * @description Get allowed location id, level id & sub level id based on the logged in user permissions.
   * @param null
   * @returns response object
   */
  getAllowedLocation() {
    // Default values are coming from the 'applicationModule' config file. We need to compare what is the allowed organisation level for the logged in user.
    // If user has permission below the organisation level [levelID] set in the 'applicationModule' config file, then we need to load the application with the organisation allowed to the user under the 'dataViewOrganisationUnits' array which we will get in the 'me.json' API response [See getLoggedInUser()], else the application will load with the organisation set in the 'applicationModule' config file.
    let isFromDefault = store.getters.getIsMultiProgram ? true : false;
    let appData = store.getters.getApplicationModule(isFromDefault);
    let uData = store.getters.getUserDetails,
      uLevel = uData?.dataViewOrganisationUnits?.[0]?.level || 0;
    let locationID = appData.defaultLocationID[0],
      levelID = appData.defaultLevelID,
      subLevelID = appData.subLevelID;
    console.log("uLevel", uLevel);
    if (uLevel && uLevel > appData.defaultLevelID) {
      locationID = uData.dataViewOrganisationUnits[0].id;
      levelID = uData.dataViewOrganisationUnits[0].level;
      subLevelID = uData.dataViewOrganisationUnits[0].level * 1 + 1;
    }
    return { locationID, levelID, subLevelID };
  }
  /**
   * @author Ravindra Bagul
   * @description Get flat array list of the organizations.
   * @param array - Nested organisation list
   * @returns response object
   */
  flattenLocationList(array) {
    var result = [];
    array.forEach((a) => {
      result.push(a);
      if (Array.isArray(a.children)) {
        let children = a.children.map((c) => ({
          ...c,
          parentID: a.id,
        }));
        result = result.concat(this.flattenLocationList(children));
      }
    });
    return result;
  }
  /**
   * @author Ravindra Bagul
   * @description Update the key's. Required for the vue-treeselect dropdown.
   * @param obj - organisation object
   * @param addLevelID - flag to add the level id with location id
   * @returns response object
   */
  renameKeys(obj, addLevelID = true) {
    const findChildren = Object.keys(obj);
    if (!findChildren.includes("children")) {
      // console.log("findChildren", findChildren.includes("children"));
      obj["children"] = null;
    }
    // console.log("obj", obj)
    const keyValues = Object.keys(obj)
      .map((key) => {
        let newKey = null;

        if (key === "displayName") {
          newKey = "label";
        } else {
          newKey = key;
        }
        if (key === "children") {
          obj[key] =
            obj[key]
              ?.map((obj) => this.renameKeys(obj, addLevelID))
              .sort((a, b) =>
                a.label > b.label ? 1 : a.label < b.label ? -1 : 0
              ) || null;
        }
        return {
          [newKey]:
            key === "id" && addLevelID
              ? obj.level + "/" + obj.id
              : key === "id" && !addLevelID
              ? obj.id.split("/").length > 1
                ? obj.id.split("/")[1]
                : obj.id.split("/")[0]
              : obj[key],
        };
      })
      .sort((a, b) =>
        a.displayName > b.displayName
          ? 1
          : a.displayName < b.displayName
          ? -1
          : 0
      );
    return Object.assign({}, ...keyValues);
  }
  /**
   * @author Ashvini/Keshav
   * @description Create data element in DHIS2.
   * @param deData - data element
   * @returns response object
   */
  createDE(deData) {
    return axios({
      method: "post",
      url: `${store.getters.getBaseURL}/api/dataElements`,
      headers: header,
      data: deData,
    });
  }
  /**
   * @author Ashvini/Keshav
   * @description Update data element in DHIS2.
   * @param deData - data element
   * @returns response object
   */
  updateDE(deData) {
    return axios({
      method: "post",
      url: `${store.getters.getBaseURL}/api/schemas/dataElement`,
      headers: header,
      data: deData,
    });
  }
  /**
   * @author Ashvini/Keshav
   * @description Get category combo for selected data element
   * @param nm - data element
   * @returns response object
   */
  getdefaultCategoryCombo(nm) {
    return axios({
      method: "get",
      url: `${store.getters.getBaseURL}/api/categoryCombos.json?filter=name:eq:${nm}&paging=false`,
      headers: header,
    });
  }
  /**
   * @author Ashvini/Keshav
   * @description Get organization units with parent
   * @param null
   * @returns response object
   */
  getOrganisationWithParent() {
    return axios({
      method: "get",
      url: `${store.getters.getBaseURL}/api/organisationUnits.json?fields=id,name,level,parent[id, name]&paging=false`,
      headers: header,
    });
  }
  /**
   * @author Ashvini/Keshav
   * @description Upload json.
   * @param jDat - json data
   * @returns response object
   */
  uploadJson(jDat) {
    return axios.post(
      `${store.getters.getBaseURL}/api/dataValueSets.json?async=true&dryRun=false&strategy=NEW_AND_UPDATES&preheatCache=false&skipAudit=false&dataElementIdScheme=UID&orgUnitIdScheme=UID&idScheme=UID&skipExistingCheck=false&format=json`,
      jDat,
      {
        headers: header,
      }
    );
  }
  /**
   * @author Ashvini/Keshav
   * @description Show import task
   * @param upId - id
   * @returns response object
   */
  showTask(upId) {
    return axios({
      method: "get",
      url: `${store.getters.getBaseURL}/api/system/tasks/DATAVALUE_IMPORT/${upId}`,
      headers: header,
    });
  }
  /**
   * @author Ashvini/Keshav
   * @description Show task summary.
   * @param upId - id
   * @returns response object
   */
  showTaskSumm(upId) {
    return axios({
      method: "get",
      url: `${store.getters.getBaseURL}/api/system/taskSummaries/DATAVALUE_IMPORT/${upId}`,
      headers: header,
    });
  }
  /**
   * @author Ashvini/Keshav
   * @description Get category option combo for the data element.
   * @param nm - data element
   * @returns response object
   */
  getCategoryOptionCombo(nm) {
    return axios({
      method: "get",
      url: `${store.getters.getBaseURL}/api/categoryOptionCombos.json?filter=name:eq:${nm}&paging=false`,
      headers: header,
    });
  }
  // /**
  //  * @author Ashvini
  //  * @description Get logo
  //  * @param null
  //  * @returns response object
  //  */
  // getLogoUrl() {
  //   return axios({
  //     method: "get",
  //     url: `${store.getters.getBaseURL}/api/37/staticContent/logo_banner`,
  //     headers: header,
  //   });
  // }
}

export default new DataService();
