import isUndefined from 'lodash/isUndefined'
import keys from 'lodash/keys'
import has from 'lodash/has'
import get from 'lodash/get'
import entries from 'lodash/entries'
import isEqual from 'lodash/isEqual'
import isObjectLike from 'lodash/isObjectLike'
import service from '../../service'
import store from '../../store.js'
import i18n from '../../i18n.js'
import moment from 'moment';
import Vue from 'vue'

const mergeChanges = (savedData, configChanges) => {
  let sData = savedData
  let savedKeys = Object.keys(sData)
  let updatedKeys = Object.keys(configChanges)
  let common = updatedKeys.filter(e => savedKeys.includes(e))
  let notCommon = updatedKeys.filter(e => !savedKeys.includes(e))
  if(common.length) {
    common.forEach(n => {
        let savedCommon = sData[n]
        let updatedCommon = configChanges[n][0]
        if(savedCommon.length > 1) {
          let filteredCommon = savedCommon.sort((a, b) => a.timestamp > b.timestamp ? 1 : a.timestamp < b.timestamp ? -1 : 0)
          filteredCommon.shift()
          filteredCommon.push(updatedCommon)
          sData[n] = filteredCommon
        } else {
          savedCommon.push(updatedCommon)
          sData[n] = savedCommon
        }
    })
  }
  if(notCommon.length) {
    notCommon.forEach(n => sData[n] = configChanges[n])
  }
  return sData;
}
const showLocalStorageError= ()=> {
  Vue.swal({
    title: "Oops...",
    text: "We lost app ID.",
    type: "error"
  })
}
export default {
  configAudit: (originalConfig, updatedConfig) => {
    // console.log("originalConfig",originalConfig)
    // console.log("updatedConfig",updatedConfig)
    const changes = {};
    const date = new Date().getTime();

    const buildPath = (path, obj, key) => isUndefined(path) ? key : `${path}.${key}`;

    const walk = (originalConfig, updatedConfig, path) => {
        for (const key of keys(originalConfig)) {
            const currentPath = buildPath(path, originalConfig, key);
            if (!has(updatedConfig, key)) {
                changes[currentPath] = [{from: get(originalConfig, key), to: '', timestamp: date}];
            }
        }

        for (const [key, to] of entries(updatedConfig)) {
            const currentPath = buildPath(path, updatedConfig, key);
            if (!has(originalConfig, key)) {
                changes[currentPath] = [{from: '', to, timestamp: date}];
            } else {
                const from = get(originalConfig, key);
                if (!isEqual(from, to)) {
                    if (isObjectLike(to) && isObjectLike(from)) {
                        walk(from, to, currentPath);
                    } else {
                        changes[currentPath] = [{from, to, timestamp: date}];
                    }
                }
            }
        }
    };

    walk(originalConfig, updatedConfig);

    return changes;
  },
  processAudit: (processType, key, configChanges, type = null, subType = null) => {
    Vue.swal({
      text: i18n.t('processingAudit'),
      showConfirmButton: false,
      timer: 2000
    }).then(() => {
      store.commit('setLoading', true)
      let allKeys = service.getAllKeys(true);
      allKeys.then(keys => {
        if (keys.data.includes(key)) {
          let saveConfig = service.getSavedConfig(key, true);
          saveConfig.then(res => {
            let configData = res.data;
            if(processType === 'process1') {
              if (configData[store.state.loggedInUserId]) {
                let savedData = configData[store.state.loggedInUserId]
                let updatedData = mergeChanges(savedData, configChanges)
                configData[store.state.loggedInUserId] = updatedData
              } else {
                configData[store.state.loggedInUserId] = configChanges
              }
            }

            if(processType === 'process2') {
              if (configData[type]) {
                if(configData[type][subType]) {
                  if (configData[type][subType][store.state.loggedInUserId]) {
                    let savedData = configData[type][subType][store.state.loggedInUserId]
                    let updatedData = mergeChanges(savedData, configChanges)
                    configData[type][subType][store.state.loggedInUserId] = updatedData
                  } else {
                    configData[type][subType][store.state.loggedInUserId] = configChanges
                  }
                } else {
                  configData[type][subType] = {
                    [store.state.loggedInUserId] : configChanges
                  }
                }
              } else {
                configData[type] = {
                  [subType]: {
                    [store.state.loggedInUserId] : configChanges
                  }
                }
              }
            }
            //Specifically for Ministerial Dashboard summary
            if(processType === 'process3') {
              if (configData[type]) {
                if (configData[type][store.state.loggedInUserId]) {
                  let savedData = configData[type][store.state.loggedInUserId]
                  let updatedData = mergeChanges(savedData, configChanges)
                  configData[type][store.state.loggedInUserId] = updatedData
                } else {
                  configData[type][store.state.loggedInUserId] = configChanges
                }
              } else {
                configData[type] = {
                    [store.state.loggedInUserId] : configChanges
                }
              }
            }

            let response = service.updateConfig(configData, key, true)
            response.then(response => {
              if (response.data.status === "OK") {
                Vue.swal({
                  title: i18n.t('auditSuccess')
                })
                store.commit('setLoading', false)
              } else {
                Vue.swal({
                  title: i18n.t('error'),
                  text: `${response.data.message}`
                })
                store.commit('setLoading', false)
                return;
              }
            }).catch(error => {
              Vue.swal({
                title: i18n.t('error')
              })
              store.commit('setLoading', false)
              return;
            })
          })
        } else {
          let data = null
          if(processType === 'process1') {
            data = {
              [store.state.loggedInUserId] : configChanges
            }
          }

          if(processType === 'process2') {
            data = {
              [type]: {
                [subType]: {
                  [store.state.loggedInUserId] : configChanges
                }
              }
            }
          }

          let response = service.saveConfig(data, key, true)
          response.then(response => {
            store.commit('setLoading', false)
            Vue.swal({
              title: i18n.t('auditSuccess')
            })
          })
        }
      }).catch(() => {
        let data = null
        if(processType === 'process1') {
          data = {
            [store.state.loggedInUserId] : configChanges
          }
        }

        if(processType === 'process2') {
          data = {
            [type]: {
              [subType]: {
                [store.state.loggedInUserId] : configChanges
              }
            }
          }
        }

        let response = service.saveConfig(data, key, true)
        response.then(response => {
          store.commit('setLoading', false)
          Vue.swal({
            title: i18n.t('auditSuccess')
          })
        })
      })
    })
  },
  downloadLogs: async (tabName) => {
    let fileName = `${tabName}_${moment().format('MMMM Do YYYY, h:mm:ss')}`
    let moduleName = [];
    switch(tabName) {
      case 'gf':
        moduleName.push('globalFactors')
        break;
      case 'md':
        moduleName.push('ministrialModule')
        break;
      case 'ad':
        moduleName.push('adGeographicalModule', 'adProgramModule', 'adBarrierModule', 'adAnchorMapModule')
        break;
      case 'dqr':
        moduleName.push('dqrModule')
        break;
      case 'map':
        moduleName.push('mapVisualization')
        break;
      default:
        moduleName.push('applicationModule')
    }
    // console.log("moduleName", moduleName)
    let allLogData = [];
    let allKeys = []
    await service.getAllKeys(true).then(keys => {
      // console.log("keys", keys)
      allKeys = keys.data
    });
    // console.log("allKeys", allKeys)
    let allDataKeys = [];
    moduleName.forEach(modName => {
      let locale = i18n.locale, key = `${modName}_${locale}`
      if (!settings.country) {
      let appId = store.state.appId ? store.state.appId : "", appUserId = store.state.appUserId ? store.state.appUserId : ""
        if(appId && appUserId) {
          key = `${appUserId}_${appId}_${modName}_${locale}`
        } else {
          showLocalStorageError()
          return;
        }
      }
      if (allKeys.includes(key)) {
        allDataKeys.push(key);
      }
    });
    // console.log("allDataKeys", allDataKeys)
    if(allDataKeys.length) {
      allDataKeys.forEach(dataKey => {
        let saveConfig = service.getSavedConfig(dataKey, true);
        saveConfig.then(res => {
          let configData = res.data;
          allLogData.push(JSON.stringify(configData));
          if(allLogData.length == allDataKeys.length){
            const blob = new Blob([allLogData], {type: 'text/plain'})
            const e = document.createEvent('MouseEvents'),
            a = document.createElement('a');
            a.download = fileName+".json";
            a.href = window.URL.createObjectURL(blob);
            a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
            e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
            store.state.loading = false
          }
        }).catch(() => {
          Vue.swal({
            title: i18n.t('oops'),
            text: i18n.t('somethingwentwrong')
          })
          store.state.loading = false
        })
      })
    } else {
      Vue.swal({
        title: i18n.t('oops'),
        text: i18n.t('no_data_to_display')
      })
      store.state.loading = false
    }
  }
}
