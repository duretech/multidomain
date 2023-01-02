/*global settings*/
/*eslint no-undef: "error"*/
import axios from "axios";
import store from "@/store.js";

//For Production
let header = {};
//https://play.dhis2.org/2.33.6/api/31/userSettings/keyDbLocale -> POST to change dblocaleKey
// For development. Select appropriate basic auth based on the baseURL in the 'index.html' file
if (process.env.NODE_ENV !== "production") {
  header = {
    "Cache-Control": "no-cache",
    // Authorization: 'Basic YWRtaW46RFdAUEBzJDByZEAyMDE4' //AFp admin user
    // Authorization: 'Basic YWJjMTUwN0BtYWlsaW5hdG9yLmNvbTpTZWNyZXRAMTIz' //Sandbox Nepal user abc1507@mailinator.com
    // Authorization: 'Basic YWRtaW46ZGlzdHJpY3Q=' //Sandbox Nepal user admin/district (can be used for kenyaog)
    // Authorization: "Basic RHVyZTpUZWNobm9sb2d5QDEyMw==", //hiskenya Dure admin user
    // Authorization: 'Basic YXZlbmlyYXBwYWRtaW5rYWJ1bDE6QXZlbmlyYXBwYWRtbmthYnVsQDU1NTY=' //AFp admin Kabul user
    Authorization: "Basic YWRtaW46VHJhaW5pbmdAZGhpczI=", //avenirtrainin/harmonia admin user
    // Authorization: "Basic TmlnZXJpYVVzZXI6TmlnZXJpYVVzZXJAMTIz", //avenirtrainin/harmonia non-admin NigeriaUser/NigeriaUser@123 user
    // Authorization: 'Basic YWRtaW46ZHJjQWRtQDEyMw==' //drc admin user
    // Authorization: 'Basic RGVlcGFua2FuX1NhdGlqYTohQGQyMUtAbg==' //https://snisrdc.com admin user
    // Authorization: 'cmF2aUBtYWlsaW5hdG9yLmNvbTpTZWNyZXRAMTIzNDU=' //vizibuzz ravi@mailinator.com user
    // Authorization: 'Basic YWRtaW5pc3RyYXRvcjpTZWNyZXRAMTIz' //vizibuzz or FPSS administrator (India) user
    // Authorization: 'Basic QXNzYW11c2VyOkFzc2FtdXNlckAxMjM=' //vizibuzz or FPSS asam (India) user
    //  Authorization: 'Basic YWRtaW46Vml6aWJ1enpAMjAyMA==' //vizibuzz or FPSS admin user
    // Authorization: 'Basic YXZlbmlydGVtcGFwcHVzZXIwMTpBdmVuaXJhcHB1c3JANTQ1Ng==' //AFp non admin user
    // Authorization: 'Basic YXZlbmlyYXBwYWRtaW4xOkF2ZW5pcmFwcGFkbW5ANTQ1Nw==' //uatkenya avenirappadmin1 user
    // Authorization: 'Basic YXZlbmlydGVzdHVzZXIxOkF2ZW5pcnRlc3RANTIzNg==' //AFG
    // Authorization: 'Basic YWJjMTBAbWFpbGluYXRvci5jb206U2VjcmV0QDEyMw==' //Sandbox
    // Authorization: 'Basic c2FuZGJveGFwcGNvbmZ1c2VyMTpTYW5kYm94YXBwY29uZkAyODc5'//
    //Authorization: 'Basic ZnBkYXNoYm9hcmR0cmFpbmluZzpUcmFpbmluZ0AwOTg=' //avenirtrainin/harmonia fpdashboardtraining/Training@098 user
    // Authorization: 'Basic YWRtaW46ZGlzdHJpY3Q=' //sandbox admin intraaenir abs5@mailinator.com
    // Authorization: 'Basic YWRtaW46U2VjcmV0QDEyMw==' //zimbabwe admin/Secret@123 user
    // Authorization: "Basic dHJhY2syMDpQQCQkdzByZDI=", //Nigeria track20/P@$$w0rd2 Non-admin user
  };
}

class Dataservice {
  constructor() {}

  /**
   * Common Get call
   * @param 1) url = API url 2) inputObj = payload for the API
   * @return response object or error
   */
  RestGetCall(url, inputObj) {
    return axios
      .get(`${store.state.baseURL}` + url, {
        headers: header,
        params: inputObj,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error.response;
      });
  }
  /**
   * Good To Know
   * 1) sessionStorage.getItem('baseURL') => is comming from the sessionStorage
   * 2) settings.apiURL => is coming from the index.html file
   * 3) All the url's are dynamically created
   */
  /**
   * Get UserRoles from datastore, create key value object from reponse
   * @return user roles object
   */
  getUserRoles() {
    let url = `${store.state.baseURL}/${settings.apiURL}/userRoles.json`;
    let roleObj = {};
    return axios
      .get(url, {
        headers: header,
      })
      .then((response) => {
        for (let x in response.data.userRoles) {
          roleObj[response.data.userRoles[x].id] =
            response.data.userRoles[x].displayName;
        }
        return roleObj;
      });
  }
  /**
   * Get logged in user details
   * @return response object
   */
  getUserCredentials() {
    let url = `${store.state.baseURL}/${settings.apiURL}/me.json?fields=id,firstName,surname,userCredentials[id,username,userRoles[id,name]],settings,dataViewOrganisationUnits`;
    return axios
      .get(url, {
        headers: header,
      })
      .then((response) => {
        return response.data;
      });
  }
  /**
   * Get the data from DHIS
   * @param 1) indID = semicolor [;] separated list of indicators/data elements Id's
   * 2) level = array of orgnisation levels of the selected location and 1 level below
   * 3) location = selected location ID
   * 4) period = semicolor [;] separated list of periods
   * 5) ngoValue = NGO ID [specific to the Nepal]
   * 6) ageGroupValue = Age Group ID  [specific to the Nepal]
   * 7) msiGroupValue = MSI Group ID  [specific to the Nepal]
   * 8) ougroup = Organisation Group ID  [specific to the Nepal]
   * @return response object
   */
  getIndicatorData(
    indID = "",
    level = [],
    location = null,
    period = 2018,
    ngoValue = null,
    ageGroupValue = null,
    msiGroupValue = null,
    ougroup
  ) {
    var ou = "";
    // console.log(ougroup)
    if (ougroup != undefined && ougroup != "") {
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
      //   url = `${sessionStorage.getItem('baseURL')}/${settings.apiURL}/analytics.json?dimension=dx:` + indID + `&dimension=` + ngoValue + `&dimension=pe:` + period + `&dimension=ou:` + ou + `&displayProperty=NAME&skipMeta=false&includeNumDen=false`
      // } else if(ngoValue === 'All' && ageGroupValue !== 'All') {
      //   url = `${sessionStorage.getItem('baseURL')}/${settings.apiURL}/analytics.json?dimension=dx:` + indID + `&dimension=` + ageGroupValue + `&dimension=pe:` + period + `&dimension=ou:` + ou + `&displayProperty=NAME&skipMeta=false&includeNumDen=false`
      // } else if(ngoValue !== 'All' && ageGroupValue !== 'All') {
      //
      // } else {
      //   url = `${sessionStorage.getItem('baseURL')}/${settings.apiURL}/analytics.json?dimension=dx:` + indID + `&dimension=pe:` + period + `&dimension=ou:` + ou + `&displayProperty=NAME&skipMeta=false&includeNumDen=false`
      // }
      if (msiGroupValue)
        url =
          `${store.state.baseURL}/${settings.apiURL}/analytics.json?dimension=dx:` +
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
          `${store.state.baseURL}/${settings.apiURL}/analytics.json?dimension=dx:` +
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
        `${store.state.baseURL}/${settings.apiURL}/analytics.json?dimension=dx:` +
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
      })
      .then((response) => {
        return response;
      });
  }
  /**
   * Get the data based on the play button clicked in Map Visualization module
   * @param 1) indID = semicolor [;] separated list of indicators/data elements Id's
   * 2) period = semicolor [;] separated list of periods
   * 3) ou = selected organisation ID
   * @return response object
   */
  getPlayButtonData(indID, period, ou) {
    let url = (url =
      `${store.state.baseURL}/${settings.apiURL}/analytics.json?dimension=dx:` +
      indID +
      `&dimension=pe:` +
      period +
      `&dimension=ou:LEVEL-` +
      ou +
      `&displayProperty=NAME&skipMeta=false&includeNumDen=false`);
    return axios
      .get(url, {
        headers: header,
      })
      .then((response) => {
        // this.playButtonData = response.data.rows;
        return response.data.rows; // Promise.resolve(true);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
  /**
   * Get the data used in Analytical Dashboard module
   * @param 1) indID = semicolor [;] separated list of indicators/data elements Id's
   * 2) location = selected organisation ID
   * 3) period = semicolor [;] separated list of periods
   * @return response object
   */
  getAnalyticalIndicatorData(indID = "", location = null, period = 2018) {
    let url =
      `${store.state.baseURL}/${settings.apiURL}/analytics.json?dimension=dx:` +
      indID +
      `&dimension=pe:` +
      period +
      `&dimension=ou:` +
      location +
      `&displayProperty=NAME&skipMeta=false&includeNumDen=false`;

    return axios
      .get(url, {
        headers: header,
      })
      .then((response) => {
        return response;
      });
  }
  /**
   * Fetch all the configuration files key stored in the datastore.
   * @param 1) isAudit = when passed 'true', we are referring to the audit datastore
   * @return response object
   */
  getAllKeys(isAudit = false, namespace = "", isDynamicModule = false) {
    let tableName = namespace
      ? `${store.getters.getNamespace}_${namespace}`
      : isDynamicModule
      ? settings.tableName
      : store.getters.getNamespace;
    if (isAudit) {
      tableName = `${tableName}_audit`;
    }
    return axios({
      method: "get",
      url: `${store.state.baseURL}/${settings.apiURL}/dataStore/${tableName}`,
      headers: header,
    });
  }
  /**
   * Save the configuration file in the datastore.
   * @param 1) configData = configuration object
   * 2) key_in_table = configuration file name
   * 3) isAudit = when passed 'true', we are referring to the audit datastore
   * @return response object
   */
  saveConfig(
    configData,
    key_in_table,
    isAudit = false,
    namespace = "",
    isDynamicModule = false
  ) {
    let tableName = namespace
      ? `${store.getters.getNamespace}_${namespace}`
      : isDynamicModule
      ? settings.tableName
      : store.getters.getNamespace;
    if (isAudit) {
      tableName = `${tableName}_audit`;
    }
    return axios({
      method: "post",
      url: `${store.state.baseURL}/${settings.apiURL}/dataStore/${tableName}/${key_in_table}`,
      headers: header,
      data: configData,
    });
  }
  /**
   * Update the configuration file in the datastore.
   * @param 1) configData = configuration object
   * 2) key_in_table = configuration file name
   * 3) isAudit = when passed 'true', we are referring to the audit datastore
   * @return response object
   */
  updateConfig(
    configData,
    key_in_table,
    isAudit = false,
    namespace = "",
    isDynamicModule = false
  ) {
    let tableName = namespace
      ? `${store.getters.getNamespace}_${namespace}`
      : isDynamicModule
      ? settings.tableName
      : store.getters.getNamespace;
    if (isAudit) {
      tableName = `${tableName}_audit`;
    }
    return axios({
      method: "put",
      url: `${store.state.baseURL}/${settings.apiURL}/dataStore/${tableName}/${key_in_table}`,
      headers: header,
      data: configData,
    });
  }
  /**
   * Get the stored configuration file from the datastore.
   * @param 1) key_in_table = configuration file name
   * 2) isAudit = when passed 'true', we are referring to the audit datastore
   * @return response object
   */
  getSavedConfig(
    key_in_table,
    isAudit = false,
    namespace = "",
    isDynamicModule = false
  ) {
    let tableName = namespace
      ? `${store.getters.getNamespace}_${namespace}`
      : isDynamicModule
      ? settings.tableName
      : store.getters.getNamespace;
    if (isAudit) {
      tableName = `${tableName}_audit`;
    }
    return axios({
      method: "get",
      url: `${store.state.baseURL}/${settings.apiURL}/dataStore/${tableName}/${key_in_table}`,
      headers: header,
    });
  }
  /**
   * Delete the configuration file from the datastore.
   * @param 1) key_in_table = configuration file name
   * @return response object
   */
  deleteSavedConfig(key_in_table, namespace = "", isDynamicModule = false) {
    let tableName = namespace
      ? `${store.getters.getNamespace}_${namespace}`
      : isDynamicModule
      ? settings.tableName
      : store.getters.getNamespace;
    if (isAudit) {
      tableName = `${tableName}_audit`;
    }
    return axios({
      method: "delete",
      url: `${store.state.baseURL}/${settings.apiURL}/dataStore/${tableName}/${key_in_table}`,
      headers: header,
    });
  }
  /**
   * Get the list of Indicators.
   * @return response object
   */
  getIndicators(signal) {
    return axios({
      method: "get",
      // url: `${sessionStorage.getItem('baseURL')}/${settings.apiURL}/programIndicators.json`,
      url: `${store.state.baseURL}/${settings.apiURL}/indicators.json?paging=false`,
      headers: header,
      signal,
    });
  }
  /**
   * Get the list of Data Elements.
   * @return response object
   */
  getDataElements(signal) {
    return axios({
      method: "get",
      // url: `${sessionStorage.getItem('baseURL')}/${settings.apiURL}/dataElements.json?paging=false`,
      // url: `${sessionStorage.getItem('baseURL')}/${settings.apiURL}/dataElements.json?fields=id,displayName,categoryCombo%5bid,categoryOptionCombos%5bid%5d%5d&paging=false`,
      url: `${store.state.baseURL}/${settings.apiURL}/dataElements.json?fields=id,displayName,formName,description,categoryCombo[id,displayName,categoryOptionCombos[id,displayName]]&paging=false`,
      headers: header,
      signal,
    });
  }
  /**
   * Get the list of Data Sets.
   * @return response object
   */
  getDataSets() {
    return axios({
      method: "get",
      // url: `${sessionStorage.getItem('baseURL')}/${settings.apiURL}/programIndicators.json`,
      url: `${store.state.baseURL}/${settings.apiURL}/dataSets.json?paging=false`,
      headers: header,
    });
  }
  /**
   * Get the categoryCombo based on Data Element.
   * @param 1) de = Data Element ID
   * @return response object
   */
  getCategoryCombo(de) {
    return axios({
      method: "get",
      url: `${store.state.baseURL}/${settings.apiURL}/dataElements/${de}.json?fields=id,displayName,categoryCombo[id,displayName,categoryOptionCombos[id,displayName]]&paging=false`,
      headers: header,
    });
  }
  getAllCategoryOptionCombo() {
    return axios({
      method: "get",
      url: `${store.state.baseURL}/${settings.apiURL}/categoryOptionCombos.json?paging=false`,
      headers: header,
    });
  }
  /**
   * Get the list of Organisations.
   * @return response object
   */
  getOrganisation() {
    return axios({
      method: "get",
      url: `${store.state.baseURL}/${settings.apiURL}/organisationUnits.json?fields=id,name,level&paging=false`,
      headers: header,
    });
  }
  getOrgLevels() {
    return axios({
      method: "get",
      url: `${store.state.baseURL}/${settings.apiURL}/organisationUnitLevels.json?fields=level&paging=false`,
      headers: header,
    });
  }
  /**
   * Get the levels of Organisations.
   * @return response object
   */
  getOrganisationUnitLevels() {
    // url: `${store.state.baseURL}/${settings.apiURL}/organisationUnitLevels.json?fields=id,displayName~rename(name),level&paging=false`,
    return axios({
      method: "get",
      url: `${store.state.baseURL}/${settings.apiURL}/filledOrganisationUnitLevels`,
      headers: header,
    });
  }
  /**
   * Get the list of Child Organisation.
   * @param 1) uid = parent organisation ID
   * @return response object
   */
  getChildOrganisation(uid) {
    return axios({
      method: "get",
      url: `${store.state.baseURL}/${settings.apiURL}/organisationUnits/${uid}/children.json?fields=id,displayName,name,level`,
      headers: header,
    });
  }
  /**
   * Get the details of the Organisation.
   * @param 1) uid = organisation ID
   * @return response object
   */
  getIndividualOrganisation(uid, child = false) {
    let fields = "id,name,displayName";
    if (child) {
      fields = `${fields},children[id, name, displayName]`;
    }
    return axios({
      method: "get",
      url: `${store.state.baseURL}/${settings.apiURL}/organisationUnits/${uid}?fields=${fields}`,
      headers: header,
    });
  }
  /**
   * Get the details of the logged in user.
   * @return response object
   */
  getLoggedInUser() {
    return axios({
      method: "get",
      url: `${store.state.baseURL}/${settings.apiURL}/me.json?fields=id,firstName,surname,userCredentials[id,username,userRoles[id,name]],dataViewOrganisationUnits[level,id]`,
      headers: header,
    });
  }
  /**
   * Get the list of users.
   * @param 1) activePage = page number
   * @return response object
   */
  // getUsersList(activePage) {
  getUsersList() {
    let url = `${store.state.baseURL}/${settings.apiURL}/users.json?fields=id,name~rename(label),userCredentials[id,username,userRoles[id,name]]&paging=false&order=firstName%3Aasc%2Csurname%3Aasc`;
    return axios({
      method: "get",
      url,
      headers: header,
    });
  }
  /**
   * Get the list organisations with childrens.
   * @param 1) uid = organisation ID
   * 2) level = organisation level
   * @return response object
   */
  getOrganisationChildren(uid, level, cancel) {
    let orgLevel = 8;
    let url = `${store.state.baseURL}/${settings.apiURL}/organisationUnits/${uid}.json?fields=id,displayName,level,children[id,displayName,level]`;
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
      { signal: cancel }
    );
  }
  /**
   * Get the list of data source groups based on the type.
   * @param 1) type = data source type
   * @return response object
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
      url: `${store.state.baseURL}/${settings.apiURL}/${url}`,
      headers: header,
    });
  }
  /**
   * Get the list of data source groups based on the type.
   * @param 1) type = data source type
   * @return response object
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
      url: `${store.state.baseURL}/${settings.apiURL}/${url}`,
      headers: header,
    });
  }
  /**
   * Get the list of data sources based on the type.
   * @param 1) type = data source type
   * @return response object
   */
  getAllDataSource(type) {
    let url = null;
    if (type === "Indicators") {
      url = `indicators.json?fields=dimensionItem~rename(id),displayName~rename(name)&paging=false`;
    }
    if (type === "Data Elements") {
      url = `dataElements.json?fields=dimensionItem~rename(id),displayName~rename(name)&filter=domainType:eq:AGGREGATE&paging=false`;
    }
    if (type === "Event Data Items") {
      url = ``;
    }
    if (type === "Program Indicators") {
      url = ``;
    }

    return axios({
      method: "get",
      url: `${store.state.baseURL}/${settings.apiURL}/${url}`,
      headers: header,
    });
  }
  /**
   * Get the list of data sources based on the type and data source group id.
   * @param 1) type = data source type
   * 2) id = data source group id
   * @return response object
   */
  getFilteredData(type, id) {
    let url = null;
    if (type === "Indicators") {
      url =
        id === "All"
          ? `indicators.json?fields=dimensionItem~rename(id),displayName~rename(name)&paging=false`
          : `indicators.json?fields=dimensionItem~rename(id),displayName~rename(name)&filter=indicatorGroups.id:eq:${id}&paging=false`;
    }
    if (type === "Data Elements") {
      url =
        id === "All"
          ? `dataElements.json?fields=dimensionItem~rename(id),displayName~rename(name)&paging=false`
          : `dataElements.json?fields=dimensionItem~rename(id),displayName~rename(name)&filter=domainType:eq:AGGREGATE&filter=dataElementGroups.id:eq:${id}&paging=false`;
    }
    if (type === "Event Data Items") {
      url = `programDataElements.json?program=${id}&fields=dimensionItem~rename(id),name,valueType&paging=false`;
    }
    if (type === "Program Indicators") {
      url = `programs.json?filter=id:eq:${id}&fields=programIndicators%5BdimensionItem~rename(id),displayName~rename(name)%5D&paging=false`;
    }

    return axios({
      method: "get",
      url: `${store.state.baseURL}/${settings.apiURL}/${url}`,
      headers: header,
    });
  }
  /**
   * Get the list of data sources based on the type and data source group id.
   * @param 1) type = data source type
   * 2) id = data source group id
   * @return response object
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
      url: `${store.state.baseURL}/${settings.apiURL}/${url}`,
      headers: header,
    });
  }
  /**
   * Get the data from DHIS. Used for the Interactive Analysis module.
   * @param 1) dimensions = can be organisation/period/data source
   * 2) filters = can be organisation/period/data source, optional
   * @return response object
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
      url = `${store.state.baseURL}/${settings.apiURL}/analytics.json?${dimension}${filter}&displayProperty=NAME&skipMeta=false&includeNumDen=false`;
    } else {
      url = `${store.state.baseURL}/${settings.apiURL}/analytics.json?${dimension}&displayProperty=NAME&skipMeta=false&includeNumDen=true`;
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
   * Get the list of facilities.
   * @param 1) id = facility dimension id
   * @return response object
   */
  getFacilityTypes(id) {
    return axios({
      method: "get",
      url: `${store.state.baseURL}/${settings.apiURL}/dimensions/${id}/items.json?fields=id,displayName~rename(name)&_dc=1571812835337&page=1&pageSize=50`,
      headers: header,
    });
  }
  /**
   * Get the list of dimensions available in DHIS.
   * @return response object
   */
  getDimensions() {
    return axios({
      method: "get",
      url: `${store.state.baseURL}/${settings.apiURL}/dimensions.json?fields=id,displayName~rename(name),dimensionType&paging=false`,
      headers: header,
    });
  }
  /**
   * Get the GeoJson of Organisations Unit.
   * @param 1) locationID = organisation id
   * 2) level = organisation level
   * @return response object
   */
  getGeoJson(locationID, level) {
    //console.log(`${sessionStorage.getItem('baseURL')}/${settings.apiURL}/organisationUnits.geojson?parent=` + locationID + `&level=` + level)
    return axios({
      method: "get",
      url:
        `${store.state.baseURL}/${settings.apiURL}/organisationUnits.geojson?parent=` +
        locationID +
        `&level=` +
        level,
      //url: `${sessionStorage.getItem('baseURL')}/${settings.apiURL}/geoFeatures.json?ou=ou:` + locationID + `;LEVEL-` + levelId + '&displayProperty=NAME',
      headers: header,
    });
  }
  /**
   * Get the GeoJson of Organisations Unit.
   * @param 1) locationID = organisation id
   * 2) level = organisation level
   * @return response object
   */
  getNewOrganisationUnitGeoJson(locationID, level) {
    //console.log(`${sessionStorage.getItem('baseURL')}/${settings.apiURL}/organisationUnits.geojson?parent=` + locationID + `&level=` + level)
    return axios({
      method: "get",
      //url: `${sessionStorage.getItem('baseURL')}/${settings.apiURL}/organisationUnits.geojson?parent=` + locationID + `&level=` + level,
      url:
        `${store.state.baseURL}/${settings.apiURL}/geoFeatures.json?ou=ou:` +
        locationID +
        `;LEVEL-` +
        level +
        "&displayProperty=NAME",
      headers: header,
    });
  }
  /**
   * Get the parent organisation.
   * @param 1) uid = organisation id
   * @return response object
   */
  getParentLocation(uid) {
    return axios({
      method: "get",
      url: `${store.state.baseURL}/${settings.apiURL}/organisationUnits/${uid}.json?includeAncestors=true&fields=id,name,parent[id,name]`,
      headers: header,
    });
  }
  /**
   * Get the District groups. [India specific]
   * @return response object
   */
  getDistrictGroups() {
    return axios({
      method: "get",
      url: `${store.state.baseURL}/${settings.apiURL}/sqlViews/xwDmq7nWz0P/data?paging=false`,
      headers: header,
    });
  }
  /**
   * Apply theme based on the 'defaultColorTheme' stored in the store
   */
  applyTheme() {
    if (store.state.defaultColorTheme) {
      this.theme(store.state.defaultColorTheme);
    } else {
      this.theme();
    }
  }
  /**
   * Apply theme. Adds class name to the parent div.
   * @param 1) color = color hex code
   */
  theme(color = "") {
    let theme = "newBlack-theme";
    if (color === "#2b2b2b") {
      theme = "black-theme";
    } else if (color === "#212832") {
      theme = "newBlack-theme";
    } else if (color === "#006600") {
      theme = "green-theme";
    } else if (color === "#25984b") {
      theme = "newGreen-theme";
    } else if (color === "#e5e5e5") {
      theme = "white-theme";
    } else {
      theme = "newBlack-theme";
    }
    store.commit("setCurrentTheme", theme);
  }
  /**
   * Logout from DHIS.
   * @return response object
   */
  logOut() {
    return axios({
      method: "get",
      url: `${sessionStorage.getItem(
        "baseURL"
      )}/dhis-web-commons-security/logout.action`,
      headers: header,
    });
  }
  /**
   * Create dummy chart in the DHIS. Chart id is used to store the comments for the chart.
   * @param 1) name = unique chart name
   * @return response object
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
    return axios({
      method: "post",
      url: `${store.state.baseURL}/${settings.apiURL}/charts`,
      headers: header,
      data: payload,
    });
  }
  /**
   * Get the stored comments from the DHIS.
   * @param 1) cid = chart id
   * @return response object
   */
  getComments(cid) {
    return axios({
      method: "get",
      url: `${store.state.baseURL}/${settings.apiURL}/charts/${cid}.json?fields=interpretations%5B*,user%5Bid,displayName,userCredentials%5Busername%5D%5D,likedBy%5Bid,displayName%5D,comments%5Bid,lastUpdated,text,user%5Bid,displayName#/`,
      headers: header,
    });
  }
  /**
   * Add comments to the DHIS.
   * @param 1) cid = chart id
   * 2) commentText = comment text
   * @return response object
   */
  addComments(cid, commentText) {
    return axios({
      method: "post",
      url: `${store.state.baseURL}/${settings.apiURL}/interpretations/chart/${cid}`,
      headers: {
        ...header,
        "Content-Type": "text/plain",
      },
      data: commentText,
    });
  }
  /**
   * Get organisation unit groups.
   * @return response object
   */
  getOrganisationGroups() {
    let url = `${store.state.baseURL}/${settings.apiURL}/organisationUnitGroups.json?filter=name:ne:default&fields=displayName%2CshortName%2Cid%2ClastUpdated%2Ccreated%2CdisplayDescription%2Ccode%2CpublicAccess%2Caccess%2Chref%2Clevel%2CdisplayName%2CpublicAccess%2ClastUpdated%2C&order=displayName%3AASC`;
    return axios
      .get(url, {
        headers: header,
      })
      .then((response) => {
        return response;
      });
  }
  /**
   * Add organisation unit group.
   * @param 1) orgData = organisation group data
   * @return response object
   */
  addOrganisationGroup(orgData) {
    return axios({
      method: "post",
      url: `${store.state.baseURL}/${settings.apiURL}/organisationUnitGroups`,
      headers: header,
      data: orgData,
    });
  }
  /**
   * Delete organisation unit group.
   * @param 1) id = organisation group id
   * @return response object
   */
  deleteOrganisationGroup(id) {
    return axios({
      method: "delete",
      url: `${store.state.baseURL}/${settings.apiURL}/organisationUnitGroups/${id}`,
      headers: header,
    });
  }
  /**
   * Get organisation unit group details.
   * @param 1) id = organisation group id
   * @return response object
   */
  getIndOrganisationGroup(id) {
    let url = `${store.state.baseURL}/${settings.apiURL}/organisationUnitGroups/${id}.json`;
    return axios
      .get(url, {
        headers: header,
      })
      .then((response) => {
        return response;
      });
  }
  /**
   * Update organisation unit group details.
   * @param 1) id = organisation group id
   * 2) orgData = organisation group updated data
   * @return response object
   */
  updateOrganisationGroup(id, orgData) {
    return axios({
      method: "put",
      url: `${store.state.baseURL}/${settings.apiURL}/organisationUnitGroups/${id}?mergeMode=REPLACE`,
      headers: header,
      data: orgData,
    });
  }
  /**
   * Get allowed location id, level id & sub level id based on the logged in user permissions.
   * @return response object
   */
  getAllowedLocation() {
    // Default values are coming from the 'applicationModule' config file. We need to compare what is the allowed organisation level for the logged in user.
    // If user has permission below the organisation level [levelID] set in the 'applicationModule' config file, then we need to load the application with the organisation allowed to the user under the 'dataViewOrganisationUnits' array which we will get in the 'me.json' API response [See getLoggedInUser()], else the application will load with the organisation set in the 'applicationModule' config file.

    let appData = store.getters.getApplicationModule(true);
    let locationID = appData.defaultLocationID[0],
      levelID = appData.defaultLevelID,
      subLevelID = appData.subLevelID;
    if (
      store.getters.getUserDetails.dataViewOrganisationUnits[0].level >
      appData.defaultLevelID
    ) {
      locationID = store.getters.getUserDetails.dataViewOrganisationUnits[0].id;
      levelID = store.getters.getUserDetails.dataViewOrganisationUnits[0].level;
      subLevelID =
        store.getters.getUserDetails.dataViewOrganisationUnits[0].level * 1 + 1;
    }
    return { locationID, levelID, subLevelID };
  }
  /**
   * Get flat array list of the organisations.
   * @param 1) array = Neseted organisation list
   * @return response object
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
   * Update the key's. Required for the vue-treeselect dropdown.
   * @param 1) obj = organisation object
   * @return response object
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
   * Get the organisation.
   * @param 1) level = organisation level
   * @return response object
   */
  getOpenOrganisation(level) {
    return axios({
      method: "get",
      url:
        `${store.state.baseURL}/${settings.apiURL}/organisationUnits.json?filter=name:ne:default&filter=level:eq:` +
        level +
        `&fields=displayName%2CshortName%2Cid%2Clevel%2CopeningDate%2CclosedDate%2Cparent[id,name]%2C&paging=false`,
      headers: header,
    });
  }
  /**
   * Get the organisation childrens.
   * @param 1) uid = organisation id
   * 2) level = organisation level
   * @return response object
   */
  getOrganisationChildrenwithGroup(uid, level) {
    let orgLevel = 8;
    let url = `${store.state.baseURL}/${settings.apiURL}/organisationUnits/${uid}.json?fields=id,displayName,level,children[organisationUnitGroups[id,name],id,displayName,level`;
    for (let i = level; i <= orgLevel; i++) {
      url += ",children[organisationUnitGroups[id,name],id,displayName,level";
    }
    for (let i = level; i <= orgLevel; i++) {
      url += "]";
    }
    //console.log(url)
    return axios({
      method: "get",
      url,
      headers: header,
    });
  }
  /**
   * Get the list of Indicators.
   * @return response object
   */
  getIndicators() {
    return axios({
      method: "get",
      url: `${store.state.baseURL}/${settings.apiURL}/indicators.json?paging=false`,
      headers: header,
    });
  }
  /**
   * Get the list of Data Elements.
   * @return response object
   */
  getDataElements() {
    return axios({
      method: "get",
      url: `${store.state.baseURL}/${settings.apiURL}/dataElements.json?fields=id,displayName,formName,description,categoryCombo%5Bid,displayName,categoryOptionCombos%5Bid,displayName%5D%5D&paging=false`,
      headers: header,
    });
  }
  /**
   * Get the list of Data Sets.
   * @return response object
   */
  getDataSets() {
    return axios({
      method: "get",
      url: `${store.state.baseURL}/${settings.apiURL}/dataSets.json?paging=false`,
      headers: header,
    });
  }
  createDE(deData) {
    return axios({
      method: "post",
      url: `${store.state.baseURL}/${settings.apiURL}/dataElements`,
      headers: header,
      data: deData,
    });
  }
  updateDE(deData) {
    return axios({
      method: "post",
      url: `${store.state.baseURL}/${settings.apiURL}/schemas/dataElement`,
      headers: header,
      data: deData,
    });
  }
  getdefaultCategoryCombo(nm) {
    return axios({
      method: "get",
      url: `${store.state.baseURL}/${settings.apiURL}/categoryCombos.json?filter=name:eq:${nm}&paging=false`,
      headers: header,
    });
  }
  getOrganisationWithParent() {
    return axios({
      method: "get",
      url: `${store.state.baseURL}/${settings.apiURL}/organisationUnits.json?fields=id,name,level,parent&paging=false`,
      headers: header,
    });
  }
  uploadJson(jDat) {
    return axios.post(
      `${store.state.baseURL}/${settings.apiURL}/dataValueSets.json?async=true&dryRun=false&strategy=NEW_AND_UPDATES&preheatCache=false&skipAudit=false&dataElementIdScheme=UID&orgUnitIdScheme=UID&idScheme=UID&skipExistingCheck=false&format=json`,
      jDat,
      {
        headers: header,
      }
    );
  }
  showTask(upId) {
    return axios({
      method: "get",
      url: `${store.state.baseURL}/${settings.apiURL}/system/tasks/DATAVALUE_IMPORT/${upId}`,
      headers: header,
    });
  }
  showTaskSumm(upId) {
    return axios({
      method: "get",
      url: `${store.state.baseURL}/${settings.apiURL}/system/taskSummaries/DATAVALUE_IMPORT/${upId}`,
      headers: header,
    });
  }
  getCategoryOptionCombo(nm) {
    return axios({
      method: "get",
      url: `${store.state.baseURL}/${settings.apiURL}/categoryOptionCombos.json?filter=name:eq:${nm}&paging=false`,
      headers: header,
    });
  }
}

export default new Dataservice();
