import mergeWith from 'lodash/mergeWith'
import add from 'lodash/add'
import {translateDate} from "@/components/Common/commonFunctions";

export default{
    getTotalData:(data,p_conf,p_cyp,p_isCom, defaultLocationID, locale, periodType, moment, defaultDataOption)=>{
        let aCategories = [],
            aPe = data.metaData.dimensions.pe;

        aPe.forEach(p => {
            if(data.metaData.items[p]){
              let formattedPeriod = translateDate({rawDate: p, periodType: periodType});
              aCategories.push(formattedPeriod);
            }
        });
        /* indices */
        let valueIndex = 0,ouIndex = 0,peIndex = 0,dxIndex = 0,oFinalData = {},
            aSeries = [],oAggregateSeries = {},oDrillDownSeries = {},aSeriesNumbers = [],
            oDevSeries = {},aTableData = [];
        data.headers.forEach((h, i) => {
            if (h.name === 'value') {
                valueIndex = i
            }

            if (h.name === 'ou') {
                ouIndex = i
            }

            if (h.name === 'dx') {
                dxIndex = i
            }

            if (h.name === 'pe') {
                peIndex = i
            }
        });
        data.rows.forEach((r, i) => {
          if(r[ouIndex] === defaultLocationID){
            let nFact = p_isCom && defaultDataOption === 'CYP' ? p_cyp[r[dxIndex]] || 1 : 1;
            if(!oFinalData[r[dxIndex]]){
                oFinalData[r[dxIndex]] = {};
            }
            oFinalData[r[dxIndex]][r[peIndex]] =  (oFinalData[r[dxIndex]][r[peIndex]] || 0) + r[valueIndex] * 1 * nFact;
          }
        });
        // console.log(oFinalData)
        // console.log("p_conf", p_conf)
        let oMethodData = {};
        for(let j in oFinalData){
            let nLen = p_conf.length,sProp = '';
            for(let k = 0; k < nLen;k++){
                if(p_conf[k].de.indexOf(j) > -1){
                    sProp = p_conf[k].name;
                    break;
                }
            }
            if(sProp){
              if(oMethodData[sProp]) {
                oMethodData[sProp] = mergeWith({}, oMethodData[sProp], oFinalData[j], add);
              } else {
                oMethodData[sProp] = oFinalData[j];
              }
            }
        }
        // console.log("oMethodData", oMethodData)

        p_conf.forEach((method, i) => {
          let name = Array.isArray(method.name) ? method.name[0] : method.name
            if(oMethodData[name]) {
              let oMet = {name:name,id:name,data:[], visible: true},
                  oSer = {name:name,id:name,data:[], visible: true};
              aPe.forEach((p,ind) => {
                let sMonth = translateDate({rawDate: p, periodType: periodType});
                  oMet.data.push(oMethodData[name][p]||0);
                  oSer.data.push({name:sMonth, pe:p, y:oMethodData[name][p]||0});

                  if(!oDevSeries[sMonth]){
                      oDevSeries[sMonth] = [];
                  }
                  oDevSeries[sMonth].push({val:oMethodData[name][p] || 0,name:name});
              });


              aSeriesNumbers.push(oMet);
              aSeries.push(oSer);
            }
        });

        return {
            categories:aCategories,
            seriesNum:aSeriesNumbers,
            series:aSeries,
            devSeries:oDevSeries,
        }
    },
    getTotalRegionalData:(data,p_conf,p_cyp,p_isCom, defaultLocationID, locale, periodType, moment)=>{
      // console.log(data)
      // console.log(p_conf)
      // console.log(p_cyp)
      // console.log(p_isCom)
      let aCategories = [],
          aPe = data.metaData.dimensions.pe;

      aPe.forEach(p => {
          if(data.metaData.items[p]){
            let formattedPeriod = translateDate({rawDate: p, periodType: periodType});
              aCategories.push(formattedPeriod);
          }
      });
      /* indices */
      let valueIndex = 0,ouIndex = 0,peIndex = 0,dxIndex = 0,oFinalData = {},
          oSeries = {},oAggregateSeries = {},oDrillDownSeries = {},oSeriesNumbers = {},
          oDevSeries = {},aTableData = [];
      data.headers.forEach((h, i) => {
          if (h.name === 'value') {
              valueIndex = i
          }

          if (h.name === 'ou') {
              ouIndex = i
          }

          if (h.name === 'dx') {
              dxIndex = i
          }

          if (h.name === 'pe') {
              peIndex = i
          }
      });
      p_conf.forEach((item, i) => {
        let innerData = {}
        data.rows.forEach((r, i) => {
          if(item.de.includes(r[dxIndex])){
            let nFact = p_isCom ? p_cyp[r[dxIndex]] || 1 : 1;
            if(!innerData[r[ouIndex]]){
              innerData[r[ouIndex]] = {}
            }
            innerData[r[ouIndex]][r[peIndex]] =  (innerData[r[ouIndex]][r[peIndex]] || 0) + r[valueIndex] * 1 * nFact;
          }
        });
        oFinalData[item.name] = innerData
      });

      // console.log(oFinalData)
      let oRegionData = {};
      Object.keys(oFinalData).forEach((method, i) => {
        let regionsData = {}
        Object.keys(oFinalData[method]).forEach((region, j) => {
          if(region !== defaultLocationID){
            let regionName = data.metaData.items[region].name
            regionsData[regionName] = oFinalData[method][region]
          }
        });
        oRegionData[method] = regionsData
      });
      // console.log(oRegionData)
      Object.keys(oRegionData).forEach((method, i) => {
        let aSeriesNumbersInner = [], aSeriesInner = []
        let oDevSeriesInner = {}
        Object.keys(oRegionData[method]).forEach((region, j) => {
          let oMet = {name:region,data:[], visible: true},
              oSer = {name:region,data:[], visible: true};
          aPe.forEach((p,ind) => {
            let sMonth = translateDate({rawDate: p, periodType: periodType});
              oMet.data.push(oRegionData[method][region][p]||0);
              oSer.data.push({name:sMonth,pe:p,y:oRegionData[method][region][p]||0});

              if(!oDevSeriesInner[sMonth]){
                  oDevSeriesInner[sMonth] = [];
              }
              oDevSeriesInner[sMonth].push({val:oRegionData[method][region][p] || 0,name:region});
          });

          aSeriesNumbersInner.push(oMet);
          aSeriesInner.push(oSer);
        });
        oDevSeries[method] = oDevSeriesInner
        oSeriesNumbers[method] = aSeriesNumbersInner
        oSeries[method] = aSeriesInner
      });

      return {
          categories:aCategories,
          seriesNum:oSeriesNumbers,
          series:oSeries,
          devSeries:oDevSeries,
      }
    }
}
