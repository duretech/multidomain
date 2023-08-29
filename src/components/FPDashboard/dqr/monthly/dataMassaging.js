import i18n from "../../../../i18n";

const oMethods = {
  longTerm: ["sterilization", "iud", "implant"],
  shortTerm: [
    "injectable",
    "pill",
    "condom",
    "other modern methods",
    "emergency contraception",
  ],
};
const getSlope = (p_obj, _n) => {
  let oFinal = {};
  for (let i in p_obj) {
    let nProd =
      (_n * p_obj[i].sumxY - p_obj[i].sumX * p_obj[i].sumY) /
      (_n * p_obj[i].sumXsq - p_obj[i].sumXofsq);
    oFinal[i] = nProd;
  }
  return oFinal;
};
const getSlopeOperands = (p_data) => {
  let _nSumX = 0,
    _nSumxY = 0,
    _nSumY = 0,
    _nSumXsq = 0;
  for (let m in p_data) {
    _nSumX += m * 1;
    _nSumY += p_data[m];
    _nSumxY += m * p_data[m];
    _nSumXsq += m * m;
  }
  return {
    sumX: _nSumX,
    sumxY: _nSumxY,
    sumY: _nSumY,
    sumXsq: _nSumXsq,
    sumXofsq: _nSumXsq * _nSumXsq,
  };
};
export default {
  /**
   * This function is to get formated data as per charts
   * Usage: `getFormatedData(p_data, p_global)`
   * @param 'p_data, p_global' p_data is data of indivisual tab, p_global is global config.
   * @return {Object} oData
   */
  getFormatedData: (p_data) => {
    let oData = {
        chartArr: [],
      },
      i,
      aChart = p_data.chartData,
      nLen = aChart.length,
      oTotalCyp = null,
      methodSeq = [],
      mainmethodSeq = [];
    loop1: for (i = 0; i < nLen; i++) {
      if (!aChart[i].indicator.subIndicator) {
        oTotalCyp = aChart[i].indicator;
        continue loop1;
      }
      let oOptions = {
          color: aChart[i].indicator.color,
          name:
            typeof aChart[i].indicator.static_name == "object"
              ? aChart[i].indicator.static_name[i18n.locale]
              : aChart[i].indicator.static_name,
          trans_name:
            typeof aChart[i].indicator.name == "object"
              ? aChart[i].indicator.name[i18n.locale]
              : aChart[i].indicator.name,
          source: aChart[i].indicator.source,
        },
        j,
        aDataElems = [],
        aSubInd = aChart[i].indicator.subIndicator,
        njLen = aSubInd.length,
        oCyp = {};
      //console.log(aSubInd)
      let statName =
        typeof aChart[i].indicator.static_name == "object"
          ? aChart[i].indicator.static_name[i18n.locale]
          : aChart[i].indicator.static_name;
      for (j = 0; j < njLen; j++) {
        if (statName != "Total CYP") {
          let meName =
            typeof aSubInd[j].name == "object"
              ? aSubInd[j].name[i18n.locale]
                ? aSubInd[j].name[i18n.locale]
                : aSubInd[j].name[0]
              : aSubInd[j].name;
          methodSeq.push(meName);
        }
        let oDe = {
          name:
            typeof aSubInd[j].static_name == "object"
              ? aSubInd[j].static_name[i18n.locale]
                ? aSubInd[j].static_name[i18n.locale]
                : aSubInd[j].static_name[0]
              : aSubInd[j].static_name,
          trans_name:
            typeof aSubInd[j].name == "object"
              ? aSubInd[j].name[i18n.locale]
                ? aSubInd[j].name[i18n.locale]
                : aSubInd[j].name[0]
              : aSubInd[j].name,
          displayName: [],
          de: [],
          color: aSubInd[j].color,
          scaling: aSubInd[j].scalingFactor,
          subName: Array.isArray(aSubInd[j].static_name)
            ? aSubInd[j].static_name[i18n.locale]
              ? aSubInd[j].static_name[i18n.locale]
              : aSubInd[j].static_name[0]
            : aSubInd[j].static_name,
        }; /* ,oSelectedDE = aSubInd[j].selectedDE */

        /* commented old */
        /* if(!oSelectedDE.length){
                    continue loop1;
                } */
        /*  */
        let mName =
          typeof aSubInd[j].name == "object"
            ? aSubInd[j].static_name[i18n.locale]
              ? aSubInd[j].static_name[i18n.locale]
              : aSubInd[j].static_name[0]
            : aSubInd[j].static_name;
        oCyp[mName] = aSubInd[j].cyp;
        oDe.de = aSubInd[j].de;
        oDe.selectedDE = aSubInd[j].selectedDE;
        /* commented for modified api calls */
        /*
                for(let k in oSelectedDE){
                    oDe.displayName.push(oSelectedDE[k].displayName);
                    oDe.de.push(oSelectedDE[k].id);
                } */
        if (oDe.selectedDE.length) {
          aDataElems.push(oDe);
        }
      }
      if (statName != "Total CYP") {
        let mName =
          typeof aChart[i].indicator.name == "object"
            ? aChart[i].indicator.name[i18n.locale]
              ? aChart[i].indicator.name[i18n.locale]
              : aChart[i].indicator.name[0]
            : aChart[i].indicator.name;
        mainmethodSeq.push(mName);
      }
      if (!aDataElems.length) {
        continue loop1;
      }
      //console.log(aDataElems)
      oOptions.dataElems = aDataElems;
      oOptions.cyp = oCyp;
      oData.chartArr.push(oOptions);
    }
    //console.log(methodSeq, "from DM================");
    return {
      data: oData,
      totalCYP: oTotalCyp,
      methodSeq: methodSeq,
      mainmethodSeq: mainmethodSeq,
    };
  },
  /**
   * This function is to get formated data as per charts
   * Usage: `getYearFormated(p_start)`
   * @param 'p_start' start year in global config
   * @return {Array} return array of years starting from p_start
   */
  getYearFormated: (p_start, p_end) => {
    //console.log(p_start, p_end)
    let sCurYear = p_end * 1,
      nStartYear = p_start * 1,
      aYear = [nStartYear];
    while (nStartYear < sCurYear) {
      aYear.push(++nStartYear);
    }
    //   aYear.sort(() => Math.random() - 0.5);
    return aYear.join(";");
  },
  /**
   * This function is to get formated data as per charts
   * Usage: `getChartFormatedData(p_response,p_data,oTarget)`
   * @param {p_response,p_data,oTarget}
   * @return {Object} formated data to be used in calculations
   */
  getChartFormatedData: (p_response, p_data, oTarget, mnt) => {
    //console.log(p_data)
    if (p_response != undefined && mnt.length) {
      let i,
        nLen = mnt.length,
        sName = p_data.trans_name + "/" + p_data.subName;
      //sName = p_data.name;
      for (i = 0; i < nLen; i++) {
        let sYear = mnt[i];
        let dataFound = p_response.rows.filter((obj) => obj[1] == sYear);
        if (!oTarget[sYear]) oTarget[sYear] = {};
        if (!oTarget[sYear][sName]) oTarget[sYear][sName] = 0;
        dataFound.forEach((obj) => {
          oTarget[sYear][sName] =
            (oTarget[sYear][sName] || 0) + (obj ? obj[3] * 1 : 0);
        });
      }
    }
    return oTarget;
  },
  /**
   * This function is to get formated data as per charts
   * Usage: `getFinalChartData(p_data,p_config)`
   * @param {p_data => year wise data,p_config => chart config containing type, color etc.}
   * @return {Object} formated data to be used in HighCharts
   */
  getFinalChartData: (p_data, p_config) => {
    let aCharts = p_data.charts,
      aCats = [],
      oSeries = {},
      aData = [],
      oColor = {};
    for (let i in aCharts) {
      aCats.push(i);
      let nTemp = 0;
      for (let j in aCharts[i]) {
        if (!oSeries[j]) {
          oSeries[j] = [];
        }
        oSeries[j].push(aCharts[i][j]);
        if (!oColor[j]) {
          oColor[j] = p_data.dataElems[nTemp].color;
          nTemp++;
        }
      }
    }
    for (let k in oSeries) {
      let oTemp = {
        name: k,
        data: oSeries[k],
        color: oColor[k],
      };
      aData.push(oTemp);
    }
    return {
      categories: aCats,
      data: aData,
      title: p_data.name,
      source: p_data.source,
      ...p_config,
    };
  },
  /**
   * This function is to calculate total CYP chart
   * Usage: `getTotalCYP(p_charts)`
   * @param {p_charts = > object containing overall data of all the input charts of perticular type}
   * @return {Object} formated data to calculate
   */
  getTotalCYP: (p_charts) => {
    //console.log(p_charts)
    let i,
      nLen = p_charts.length,
      oData = {};
    for (i = 0; i < nLen; i++) {
      let oCharts = p_charts[i].charts,
        oCyp = p_charts[i].cyp,
        sName = p_charts[i].name;
      // for(let j in oCharts){
      //     for(let k in oCharts[j]){
      //         if(!oData[sName]){
      //             oData[sName] = {}
      //         }
      //         oData[sName][j] = (oData[sName][j] || 0) + oCharts[j][k] *  oCyp[k];
      //     }
      // }

      for (let j in oCharts) {
        for (let k in oCharts[j]) {
          let newKey = k.split("/");
          if (!oData[newKey[1]]) {
            oData[newKey[1]] = {};
          }

          oData[newKey[1]][j] =
            (oData[newKey[1]][j] || 0) + oCharts[j][k] * oCyp[newKey[1]];
        }
      }
    }
    return oData;
  },
  /**
   * This function is to calculate total CYP chart
   * Usage: `getFinalTotalCYP(p_data,p_config,oConfig)`
   * @param {p_data => total cyp data,p_config => global config,oConfig => total cyp config}
   * @return {Object} formated data to be used in HighCharts
   */
  getFinalTotalCYP: (p_data, p_config, oConfig) => {
    let aCats = [],
      aSeries = [{ name: oConfig.name, data: [], color: oConfig.color }];
    for (let i in p_data) {
      aCats.push(i);
      aSeries[0].data.push(p_data[i].toFixed(2) * 1);
    }
    return {
      categories: aCats,
      data: aSeries,
      title: oConfig.name,
      ...oConfig,
      ...p_config,
    };
  },
  /**
   *
   *
   */
  calculateCA: (p_arr, p_adjF) => {
    let i,
      nLen = p_arr.length,
      oCA = {},
      oCYP = {};
    for (i = 0; i < nLen; i++) {
      let oChart = p_arr[i].charts,
        sName = p_arr[i].name.toLowerCase(),
        otempCyp = p_arr[i].cyp;
      for (let j in oChart) {
        for (let k in oChart[j]) {
          if (!oCA[sName + "__" + k]) {
            oCA[sName + "__" + k] = {};
          }
          oCA[sName + "__" + k][j] = (oChart[j][k] * 100) / (p_adjF[k] * 1);
        }
      }
      /* cyp calculation */
      for (let j in otempCyp) {
        oCYP[j] = otempCyp[j];
      }
      /*  */
    }
    return {
      data: oCA,
      cyp: oCYP,
    };
  },
  calculateBU: (p_step, p_cont) => {
    let i,
      oBU = {};
    for (i in p_step) {
      let aSplit = i.split("__"),
        sMethod = aSplit[0],
        sSubM = aSplit[1],
        sYear = Object.keys(p_step[i])[0];
      if (!oBU[i]) {
        oBU[i] = {};
      }
      if (oMethods.longTerm.indexOf(sMethod) > -1 && p_cont[sSubM]) {
        let nIndex = 0;
        for (let j in p_step[i]) {
          let nCont = p_cont[sSubM][nIndex] ? p_cont[sSubM][nIndex] : 0;
          // oBU[i][j] = p_step[i][sYear] * nCont;
          oBU[i][j] = p_step[i][j] * nCont;
          nIndex++;
        }
      } else {
        for (let j in p_step[i]) {
          oBU[i][j] = p_step[i][j];
        }
      }
    }

    return oBU;
  },
  calculateAdjustedVals: (
    p_BU,
    p_CA,
    p_repoRate,
    p_cypFactors,
    p_sumCR,
    p_cont
  ) => {
    let oAdustedVals = {},
      oCR = {};
    for (let x in p_cont) {
      oCR[x] = [];
      for (let z in p_cont[x]) {
        oCR[x].push(p_cont[x][z]);
      }
    }

    for (let i in p_BU) {
      let aSplit = i.split("__"),
        sMethod = aSplit[0],
        sSubM = aSplit[1];
      if (!oAdustedVals[i]) {
        oAdustedVals[i] = {};
      }
      if (oMethods.shortTerm.indexOf(sMethod) > -1) {
        for (let j in p_BU[i]) {
          if (p_repoRate[j] < 60) {
            oAdustedVals[i][j] = 0;
          } else {
            oAdustedVals[i][j] = p_BU[i][j] * p_cypFactors[sSubM];
          }
        }
      } else {
        /* let aYears = Object.keys(p_BU[i]),
                    aCR = Object.keys(p_cont[sSubM]),nCount = 0; */

        /* for(let j in p_BU[i]){ 
                    let k,sVal = p_BU[i][j],nAddition = 0;
                    for(k = nCount; k > 0 ; k--){
                        nAddition += p_CA[i][aYears[k]] * p_cont[sSubM][aCR[nCount - k]];
                    }
                    nCount++;
                    oAdustedVals[i][j] = sVal + nAddition;
                } */

        /* for(let j in p_CA[i]){ 
                    let nContibuationFact = p_cont[sSubM][nCount] ? p_cont[sSubM][nCount] : 0;
                    oAdustedVals[i][j] = p_CA[i][j] * nContibuationFact;
                    nCount++;
                } */
        /*  */

        let nCounter = 0,
          aYears = Object.keys(p_CA[i]);
        for (let j in p_CA[i]) {
          let nSum = 0,
            k = 0,
            l = nCounter;
          oAdustedVals[i][j] = p_CA[i][j] * (oCR[sSubM][k] ? oCR[sSubM][k] : 0);
          while (l > 0) {
            k++;
            let sYr = aYears[l - 1];
            nSum += p_CA[i][sYr] * (oCR[sSubM][k] ? oCR[sSubM][k] : 0);
            l--;
          }
          oAdustedVals[i][j] += nSum;
          /* if(l > 0){
                        let sYr = aYears[l - 1];
                        // nSum = p_CA[i][sYr] + p_CA[i][j] * (oCR[sSubM][nCounter] ? oCR[sSubM][nCounter] : 0);
                        nSum = oAdustedVals[i][sYr] + p_CA[i][j];
                        oAdustedVals[i][j] = nSum;
                    } */
          nCounter++;
        }
        /*  */
      }
    }
    return oAdustedVals;
  },
  getSumOfCont: (p_obj) => {
    let oFinal = {};
    for (let i in p_obj) {
      oFinal[i] = [];
      let nSum = 0,
        aMethods = [],
        aFinalMthodVals = [];
      for (let j in p_obj[i]) {
        nSum += p_obj[i][j];
        aMethods.push(p_obj[i][j]);
      }
      // if(i == 'Male Condom'){
      //     console.log(nSum)
      // }
      let nLen = aMethods.length,
        k;
      aFinalMthodVals.push(nSum);
      for (k = 0; k < nLen - 1; k++) {
        nSum -= aMethods[k];
        aFinalMthodVals.push(nSum);
      }
      oFinal[i] = aFinalMthodVals;
    }
    return oFinal;
  },
  getFinalOutPutChart: (p_data) => {
    let oFinal = {},
      aCats = [];
    for (let i in p_data) {
      let aSplit = i.split("__"),
        sMethod = aSplit[0],
        sSubM = aSplit[1],
        bIsSter = sMethod === "sterilization",
        sSterProp = `${sMethod} ${sSubM}`;

      if (bIsSter) {
        if (!oFinal[sSterProp]) {
          oFinal[sSterProp] = {};
        }
      } else {
        if (!oFinal[sMethod]) {
          oFinal[sMethod] = {};
        }
      }

      for (let j in p_data[i]) {
        if (aCats.indexOf(j) === -1) {
          aCats.push(j);
        }
        if (bIsSter) {
          oFinal[sSterProp][j] = (oFinal[sSterProp][j] || 0) + p_data[i][j];
        } else {
          oFinal[sMethod][j] = (oFinal[sMethod][j] || 0) + p_data[i][j];
        }
      }
    }
    /*  */
    let nCats = aCats.length,
      aFinalData = [];
    /*  */
    for (let k in oFinal) {
      let oTemp = { name: k, data: [] };
      for (let l = 0; l < nCats; l++) {
        let nVal = oFinal[k][aCats[l]];
        if (nVal) {
          oTemp.data.push(nVal.toFixed(1) * 1);
        } else {
          oTemp.data.push(0);
        }
      }
      aFinalData.push(oTemp);
    }

    return {
      categories: aCats,
      data: aFinalData,
    };
  },
  getComparingEstimateModernUsers: (p_data) => {
    let oFinal = {},
      aCats = [],
      aMethodMixCats = [];
    for (let i in p_data) {
      let aSplit = i.split("__"),
        sMethod = aSplit[0],
        sSubM = aSplit[1],
        bIsSter = sMethod === "sterilization",
        sSterProp = `${sMethod} ${sSubM}`;

      if (bIsSter && aCats.indexOf(sSterProp) === -1) {
        aCats.push(sSterProp);
        aMethodMixCats.push(sSubM.toLocaleLowerCase());
      } else if (aCats.indexOf(sMethod) === -1) {
        aCats.push(sMethod);
        aMethodMixCats.push(sMethod.toLocaleLowerCase());
      }

      for (let j in p_data[i]) {
        if (!oFinal[j]) {
          oFinal[j] = {};
        }
        if (bIsSter) {
          oFinal[j][sSterProp] = (oFinal[j][sSterProp] || 0) + p_data[i][j];
        } else {
          oFinal[j][sMethod] = (oFinal[j][sMethod] || 0) + p_data[i][j];
        }
      }
    }
    /*  */
    let oFinalData = {},
      nTypes = aCats.length;
    for (let k in oFinal) {
      oFinalData[k] = {};
      let aTemp = [];
      for (let l = 0; l < nTypes; l++) {
        let oTemp = { name: aCats[l], data: [] },
          nVal = oFinal[k][aCats[l]];
        if (nVal) {
          oTemp.data.push(nVal.toFixed(1) * 1);
        } else {
          oTemp.data.push(0);
        }
        aTemp.push(oTemp);
      }
      oFinalData[k] = aTemp;
    }
    return {
      cats: aCats,
      data: oFinalData,
      methodMixCats: aMethodMixCats,
    };
  },
  getMethodMixComparision: (p_data) => {
    let i,
      oChartData = {};
    for (i in p_data) {
      oChartData[i] = {};
      let j,
        nLen = p_data[i].length,
        aArr = p_data[i],
        aTemparr = [],
        nSum = 0;
      for (j = 0; j < nLen; j++) {
        let oSlice = {
          name: aArr[j].name,
          y: aArr[j].data[0],
        };
        nSum += aArr[j].data[0];
        aTemparr.push(oSlice);
      }
      oChartData[i].data = aTemparr;
      oChartData[i].sum = nSum;
    }
    /*  */
    let oFinalData = {};
    for (let k in oChartData) {
      let nTotal = oChartData[k].sum,
        aTempArr = oChartData[k].data,
        l,
        nkLen = aTempArr.length;
      for (l = 0; l < nkLen; l++) {
        aTempArr[l].y = (aTempArr[l].y / nTotal) * 100;
      }
      oFinalData[k] = aTempArr;
    }
    return oFinalData;
  },
  getMethodMixPie: (p_data) => {
    let aFinalData = [];
    for (let i in p_data) {
      aFinalData.push({
        name: i,
        y: p_data[i],
      });
    }
    return aFinalData;
  },
  getUserTrendsByMethods: (
    p_cat,
    p_DHS,
    p_UNPD,
    p_data,
    p_pop,
    p_bAllWomwn
  ) => {
    let i,
      nLen = p_cat.length,
      oFinal = { unpd: [], dhs: [], emuCondms: [], emunoncondoms: [] },
      oCategories = {
        unpd: p_bAllWomwn ? "mCPR(AWRA):UNPD" : "mCPR(MWRA):UNPD",
        dhs: p_bAllWomwn ? "mCPR(AWRA):DHS" : "mCPR(MWRA):DHS",
        emuCondms: "EMU: Commodities inc. Condoms",
        emunoncondoms: "EMU: Commodities ex. Condoms",
      },
      oYearlyData = p_data.data,
      j;
    for (i = 0; i < nLen; i++) {
      let sYear = p_cat[i],
        j,
        nUnpd = p_UNPD[sYear] ? p_UNPD[sYear] : 0,
        nDhs = p_DHS[sYear] ? p_DHS[sYear] : 0;
      oFinal.unpd.push(nUnpd);
      oFinal.dhs.push(nDhs);
      /*  */
      if (!oYearlyData[sYear]) {
        oFinal.emuCondms.push(0);
        oFinal.emunoncondoms.push(0);
      } else {
        let nSumCon = 0,
          nSumnonCon = 0;
        for (j in oYearlyData[sYear]) {
          nSumCon += oYearlyData[sYear][j].data[0];
          if (oYearlyData[sYear][j].name !== "condom") {
            nSumnonCon += oYearlyData[sYear][j].data[0];
          }
        }
        let nTemp1 = nSumCon ? (nSumCon / p_pop[sYear]) * 100 : 0,
          nTemp2 = nSumnonCon ? (nSumnonCon / p_pop[sYear]) * 100 : 0;
        oFinal.emuCondms.push(nTemp1.toFixed(1) * 1);
        oFinal.emunoncondoms.push(nTemp2.toFixed(1) * 1);
      }
    }
    /*  */
    let f,
      aData = [];
    /*  */
    for (f in oFinal) {
      let oTemp = { name: oCategories[f], data: oFinal[f] };
      aData.push(oTemp);
    }
    return {
      categories: p_cat,
      data: aData,
    };
  },
  getComparingSlopesData: ({ categories, data }) => {
    let _n = categories.length,
      i,
      nLen = data.length,
      oData = {};
    for (i = 0; i < nLen; i++) {
      let aArr = data[i].data,
        nSumX = 0,
        nSumxY = 0,
        nSumXsq = 0,
        nSumY = 0,
        sName = data[i].name;
      /*  */
      for (let j = 0; j < _n; j++) {
        nSumxY += categories[j] * aArr[j];
        nSumXsq += aArr[j] * aArr[j];
        nSumX += aArr[j];
        nSumY += categories[j] * 1;
      }

      oData[sName] = {
        sumX: nSumX,
        sumxY: nSumxY,
        sumY: nSumY,
        sumXsq: nSumXsq,
        sumXofsq: nSumXsq * nSumXsq,
      };
    }
    let oRet = getSlope(oData, _n),
      _data = [],
      _i = 0,
      _count = 0,
      nProps = Object.keys(oRet).length;
    for (let j in oRet) {
      let oTemp = { name: j, data: [] };

      for (_i = 0; _i < nProps; _i++) {
        oTemp.data.push(_i === _count ? oRet[j] : 0);
      }
      _count++;
      _data.push(oTemp);
    }
    return {
      categories: Object.keys(oRet),
      data: _data,
    };
  },
  getEMUOPCompChart: (p_data, p_isIncl) => {
    let oProps = {
      commoditiesToClients: "EMU :Commodities to clients",
      commoditiesToFacilities: "EMU :Commodities to facilitlity",
      fp_users: "EMU :FP users",
      fp_visits: "EMU :FP visits",
    };
    let aCats,
      i,
      aMcprData = [],
      bMcpr = true,
      oTabsComp = {};
    for (i in p_data) {
      if (!p_data[i].data) {
        continue;
      }
      if (!aCats) {
        aCats = p_data[i].categories;
      }
      let j,
        aData = p_data[i].data,
        nLen = aData ? aData.length : 0;
      if (bMcpr) {
        for (j = 0; j < nLen; j++) {
          if (aMcprData.length < 2) {
            aMcprData.push(aData[j]);
          }
        }
      }
      if (!oTabsComp[i]) {
        oTabsComp[i] = [];
      }
      aData[2].name = oProps[i];
      aData[3].name = oProps[i];
      oTabsComp[i].push(aData[2]);
      oTabsComp[i].push(aData[3]);
      bMcpr = false;
    }
    let aEmus = [];
    for (let x in oTabsComp) {
      let oVal = p_isIncl ? oTabsComp[x][0] : oTabsComp[x][1];
      aEmus.push(oVal);
    }
    return {
      data: [...aMcprData, ...aEmus],
      categories: aCats ? aCats : [],
    };
  },
  getComparisionofEmuMcpr: (p_data, p_isIncl, p_MICS, p_PMS, p_bAllWomwn) => {
    let oStoreData = {
        [p_bAllWomwn ? "mCPR (AWRA): MICS" : "mCPR (MWRA): MICS"]:
          getSlopeOperands(p_MICS),
        [p_bAllWomwn ? "mCPR (AWRA): PMA" : "mCPR (MWRA): PMA"]:
          getSlopeOperands(p_PMS),
      },
      nYears = Object.keys(p_PMS).length,
      oStoreSlope = getSlope(oStoreData, nYears);
    /*  */
    let oData = {},
      sUnpdprop = p_bAllWomwn ? "mCPR(AWRA):UNPD" : "mCPR(MWRA):UNPD",
      sDhsprop = p_bAllWomwn ? "mCPR(AWRA):DHS" : "mCPR(MWRA):DHS",
      oGlobalSlopes = { [sUnpdprop]: undefined, [sDhsprop]: undefined },
      oCats = {
        commoditiesToClients: "EMU : Commodities to Clients",
        commoditiesToFacilities: "EMU : Commodities to Facilities",
        fp_users: "EMU : FP Visits",
        fp_visits: "EMU : FP Users",
      };
    for (let i in p_data) {
      if (!p_data[i].data) {
        continue;
      }
      let aData = p_data[i].data;
      oData[i] = {};
      if (oGlobalSlopes[sUnpdprop] === undefined) {
        oGlobalSlopes[sUnpdprop] = aData[0].data[0];
      }
      if (oGlobalSlopes[sDhsprop] === undefined) {
        oGlobalSlopes[sDhsprop] = aData[1].data[1];
      }
      oData[i]["EMU: Commodities inc. Condoms"] = aData[2].data[2];
      oData[i]["EMU: Commodities ex. Condoms"] = aData[3].data[3];
    }
    /*  */
    for (let j in oData) {
      oGlobalSlopes[oCats[j]] = p_isIncl
        ? oData[j]["EMU: Commodities inc. Condoms"]
        : oData[j]["EMU: Commodities ex. Condoms"];
    }
    oGlobalSlopes = { ...oGlobalSlopes, ...oStoreSlope };
    let aCategories = Object.keys(oGlobalSlopes),
      aFinalData = [],
      nProps = aCategories.length,
      _nCount = 0;
    for (let k in oGlobalSlopes) {
      let oTemp = { name: k, data: [] };
      for (let x = 0; x < nProps; x++) {
        oTemp.data.push(x === _nCount ? oGlobalSlopes[k] : 0);
      }
      _nCount++;
      aFinalData.push(oTemp);
    }
    /*  */
    return {
      categories: aCategories,
      data: aFinalData,
    };
  },
  getComparisionofUsersByMethods: (p_data, p_year) => {
    let aCats = ["User by Methods(Survey)"],
      oProps = {
        commoditiesToClients: { name: "Commodities to clients", index: 1 },
        commoditiesToFacilities: {
          name: "Commodities to facilitlity",
          index: 2,
        },
        fp_users: { name: "FP users", index: 3 },
        fp_visits: { name: "FP visits", index: 4 },
      },
      aFinalData = [],
      aFinalCats = [],
      oRef = {};
    for (let c in p_data) {
      let aTemp = p_data[c].cats ? p_data[c].cats : [];
      if (aTemp.length > aFinalCats.length) {
        aFinalCats = aTemp;
      }
    }
    /*  */

    for (let y = 0; y < aFinalCats.length; y++) {
      let oTemp = { name: aFinalCats[y], data: [0, 0, 0, 0, 0] };
      aFinalData.push(oTemp);
      oRef[aFinalCats[y]] = y;
    }

    /*  */
    for (let i in p_data) {
      if (!p_data[i].data) {
        continue;
      }
      let oData = p_data[i].data[p_year] ? p_data[i].data[p_year] : [],
        nLenth = oData.length,
        j,
        nInd = oProps[i].index;
      aCats.push(oProps[i].name);

      for (j = 0; j < nLenth; j++) {
        let sName = oData[j].name,
          nOrder = oRef[sName];
        aFinalData[nOrder].data[nInd] = oData[j].data[0];
        aFinalData[nOrder].data[0] = oData[j].data[1];
      }
    }
    return {
      categories: aCats,
      data: aFinalData,
    };
  },
  drawEMUUserbyMethods: (p_data) => {
    let aFinalCats = [],
      aFinalMethods = [],
      aCats = [],
      oFinalObj = {},
      oProps = {
        commoditiesToClients: { name: "Commodities to clients", index: 0 },
        commoditiesToFacilities: {
          name: "Commodities to facilitlity",
          index: 1,
        },
        fp_users: { name: "FP users", index: 2 },
        fp_visits: { name: "FP visits", index: 3 },
      };
    for (let i in p_data) {
      aCats.push(oProps[i].name);
      let aTemp = p_data[i] ? p_data[i].categories : [],
        aTempData = p_data[i] ? p_data[i].data : [];
      if (!aTempData) {
        continue;
      }
      if (aTemp.length > aFinalCats.length) {
        aFinalCats = aTemp;
      }
      if (aTempData.length > aFinalMethods.length) {
        aFinalMethods = aTempData.map((ele, ind) => {
          return ele.name;
        });
      }
    }

    for (let y = 0; y < aFinalMethods.length; y++) {
      oFinalObj[aFinalMethods[y]] = {
        categories: aFinalCats,
        data: aCats.map((ele, ind) => {
          return {
            name: ele,
            data: aFinalCats.map(() => {
              return 0;
            }),
          };
        }),
      };
    }

    for (let k in p_data) {
      if (!p_data[k].data) {
        continue;
      }
      let aOgData = p_data[k].data,
        nLen = aOgData.length,
        l,
        nIndex = oProps[k].index;
      for (l = 0; l < nLen; l++) {
        let sName = aOgData[l].name;

        if (oFinalObj[sName]) {
          oFinalObj[sName].data[nIndex].data = p_data[k].data[l].data;
        }
      }
    }
    return oFinalObj;
  },
  getTableFormatedData: (p_data, p_cats) => {
    let oMethods = {},
      aData = p_data.data,
      aMethodCats = p_data.cats,
      i,
      nLen = aData.length,
      nCatLen = p_cats.length;
    for (i = 0; i < nLen; i++) {
      let { name, data } = aData[i],
        j;
      oMethods[name] = {};
      for (j = 0; j < nCatLen; j++) {
        let sYear = p_cats[j],
          nIndex = aMethodCats.indexOf(sYear);
        oMethods[name][sYear] = nIndex !== -1 ? data[nIndex] : 0;
      }
    }

    return oMethods;
  },
  getFormatedBackGroundData: (p_data, p_Keys, p_year, p_bAllWomwn) => {
    let oNewKeys = {},
      oFinalbg = {},
      nYear = p_year.length,
      aRows = p_data.rows,
      r,
      nRows = aRows.length,
      oItem = p_data.metaData.items,
      oMethodMixProps = p_bAllWomwn
        ? {
            "avenir_mcmm_injectable AVENIR WRA": "Injectable",
            "avenir_mcmm_condom_m_f AVENIR WRA": "Condom",
            "avenir_mcmm_other_modern_method AVENIR WRA":
              "Other Modern Methods",
            "avenir_mcmm_implant AVENIR WRA": "Implant",
            "avenir_mcmm_sterilization_male AVENIR WRA": "Vasectomy (M)",
            "avenir_mcmm_lam AVENIR WRA": "LAM",
            "avenir_mcmm_sterilization_female AVENIR WRA": "Tubal Ligation (F)",
            "avenir_mcmm_oc_pills AVENIR WRA": "OC Pills",
            "avenir_mcmm_iud AVENIR WRA": "IUD",
          }
        : {
            "avenir_mcmm_injectable AVENIR MWRA": "Injectable",
            "avenir_mcmm_condom_m_f AVENIR MWRA": "Condom",
            "avenir_mcmm_other_modern_method AVENIR MWRA":
              "Other Modern Methods",
            "avenir_mcmm_implant AVENIR MWRA": "Implant",
            "avenir_mcmm_sterilization_male AVENIR MWRA": "Vasectomy (M)",
            "avenir_mcmm_lam AVENIR MWRA": "LAM",
            "avenir_mcmm_sterilization_female AVENIR MWRA":
              "Tubal Ligation (F)",
            "avenir_mcmm_oc_pills AVENIR MWRA": "OC Pills",
            "avenir_mcmm_iud AVENIR MWRA": "IUD",
          },
      oMethodMix = {};
    for (let k in p_Keys) {
      let aTemp = p_Keys[k],
        j,
        nLen = aTemp.length,
        sName = k;
      for (j = 0; j < nLen; j++) {
        oNewKeys[aTemp[j]] = sName;
      }
      if (k === "Most Recent Method Mix") {
        for (let l = 0; l < nYear; l++) {
          let sYear = p_year[l];
          oMethodMix[sYear] = {};
          for (let m in oMethodMixProps) {
            let sDisplayName = oMethodMixProps[m];
            oMethodMix[sYear][sDisplayName] = 0;
          }
        }
      } else {
        oFinalbg[k] = {};
        for (let l = 0; l < nYear; l++) {
          let sYear = p_year[l];
          oFinalbg[k][sYear] = 0;
        }
      }
    }
    /*  */
    for (r = 0; r < nRows; r++) {
      let sYr = aRows[r][1],
        nVal = aRows[r][3],
        sdes = aRows[r][0],
        sProp = oNewKeys[sdes];
      if (oNewKeys[sdes] === "Most Recent Method Mix") {
        let sNameDe = oItem[sdes].name,
          sRealMMName = oMethodMixProps[sNameDe];
        oMethodMix[sYr][sRealMMName] = nVal * 1;
      } else if (oFinalbg[sProp] && oFinalbg[sProp][sYr] !== undefined) {
        oFinalbg[sProp][sYr] = nVal * 1;
      }
    }
    /*  */
    let y,
      nRecent = nYear - 1,
      oMostRecentMM = oMethodMix[nRecent] ? oMethodMix[nRecent] : {},
      bMM = false;
    for (y = nRecent; y >= 0; y--) {
      let sRecentYr = p_year[y],
        oRecent = oMethodMix[sRecentYr];
      if (oRecent) {
        for (let z in oRecent) {
          if (oRecent[z]) {
            bMM = true;
            break;
          }
        }
        if (bMM) {
          oMostRecentMM = oRecent;
          break;
        }
      }
    }
    /*  */
    return {
      final: oFinalbg,
      methodMix: oMostRecentMM,
    };
  },
};
