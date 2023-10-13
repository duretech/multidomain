import i18n from "@/i18n.js";

export default {
  /**
   * This function is to get formated data as per charts
   * Usage: `getFormatedData(p_data, p_global)`
   * @param 'p_data, p_global' p_data is data of indivisual tab, p_global is global config.
   * @return {Object} oData
   */
  getFormatedData: (p_data, p_global, startingYear, cyp, continuation) => {
    let finalMethodArr = [];
    let oData = {
        // type:p_data.chartOptions.chart.type.toLowerCase(),
        type: "column",
        // title:p_data.chartOptions.title.title,
        // visible:p_data.chartOptions.title.visible,
        // xTitle:p_data.chartOptions.xAxis.title.text,
        // yTitle:p_data.chartOptions.yAxis.title.text,
        // title:"",

        // xTitle:"",
        // yTitle:"",
        startingYear: startingYear,
        locationId: p_global.defaultLocationID[0],
        chartArr: [],
      },
      i,
      aChart = p_data.chartData,
      nLen = aChart.length,
      oTotalCyp = null,
      emuColors = {},
      methodSeq = [],
      tableMethodSeq = [];

    loop1: for (i = 0; i < nLen; i++) {
      let statName =
        typeof aChart[i].indicator.static_name == "object"
          ? aChart[i].indicator.static_name[i18n.locale]
          : aChart[i].indicator.static_name;
      let indName =
        typeof aChart[i].indicator.name == "object"
          ? aChart[i].indicator.name[i18n.locale]
          : aChart[i].indicator.name;
      if (statName === "Total CYP" || !aChart[i].indicator.subIndicator) {
        oTotalCyp = aChart[i].indicator;

        continue loop1;
      }

      emuColors[indName.split("/")[0]] = aChart[i].indicator.chartOptions.color;
      let oOptions = {
          // color:aChart[i].indicator.color,
          title: aChart[i].indicator.chartOptions.title.title,
          color: aChart[i].indicator.chartOptions.color,
          name: indName + "/" + statName,
          trans_name: indName,
          static_name: statName,
          xTitle:
            typeof aChart[i].indicator.chartOptions.xAxis.title.text == "object"
              ? aChart[i].indicator.chartOptions.xAxis.title.text[i18n.locale]
              : aChart[i].indicator.chartOptions.xAxis.title.text,
          yTitle:
            typeof aChart[i].indicator.chartOptions.yAxis.title.text == "object"
              ? aChart[i].indicator.chartOptions.yAxis.title.text[i18n.locale]
              : aChart[i].indicator.chartOptions.yAxis.title.text,
          // visible:aChart[i].indicator.visible,
          methodType: aChart[i].indicator.methodType,
          disable: aChart[i].indicator.disableChart,
          visible: true,
          chartInfo:
            typeof aChart[i].indicator.chartInfo == "object"
              ? aChart[i].indicator.chartInfo[i18n.locale]
              : aChart[i].indicator.chartInfo,
          cID: aChart[i].indicator.cid,
          // source:aChart[i].indicator.source
          source: aChart[i].indicator.chartOptions.chartDataSource.text,
        },
        j,
        aDataElems = [],
        aSubInd = aChart[i].indicator.subIndicator,
        njLen = aSubInd.length,
        oCyp = {};
      for (j = 0; j < njLen; j++) {
        let subIndNameAct =
          typeof aSubInd[j].name == "object"
            ? aSubInd[j].name[i18n.locale]
            : aSubInd[j].name;
        emuColors[subIndNameAct] = aSubInd[j].color;
        let statName =
          typeof aChart[i].indicator.static_name == "object"
            ? aChart[i].indicator.static_name[i18n.locale]
            : aChart[i].indicator.static_name;

        if (statName === "Sterilization") {
          methodSeq.push(subIndNameAct);
          finalMethodArr.push(subIndNameAct);
        }
        //submethodtype from global settings ....added by ashvini for sub methods
        let subIndName = Array.isArray(aSubInd[j].static_name)
          ? aSubInd[j].static_name[i18n.locale]
          : aSubInd[j].static_name;
        let oDe = {
          name: subIndNameAct + "/" + subIndName,
          trans_name: subIndNameAct,
          static_name: subIndName,
          displayName: [],
          de: [],
          selectedDE: [],
          color: aSubInd[j].color,
          scaling: aSubInd[j].scalingFactor,
          subMethodType: continuation[subIndName]?.type || null,
        };
        // ,oSelectedDE = aSubInd[j].selectedDE ;

        // commented old /
        /* if(!oSelectedDE.length){
                    continue loop1;
                } */
        // /
        oCyp[subIndNameAct + "/" + subIndName] = cyp[subIndName];
        oDe.de = aSubInd[j].de;
        oDe.selectedDE = aSubInd[j].selectedDE;
        // commented for modified api calls /
        /*
                for(let k in oSelectedDE){
                    oDe.displayName.push(oSelectedDE[k].displayName);
                    oDe.de.push(oSelectedDE[k].id);
                } */
        if (oDe.selectedDE.length) {
          aDataElems.push(oDe);
        }
        tableMethodSeq.push(
          indName + "/" + statName + "__" + subIndNameAct + "/" + subIndName
        );
      }
      if (statName != "Sterilization") {
        methodSeq.push(indName);
        finalMethodArr.push(indName);
      }

      if (!aDataElems.length) {
        continue loop1;
      }
      oOptions.dataElems = aDataElems;
      oOptions.cyp = oCyp;
      oData.chartArr.push(oOptions);
    }
    localStorage.setItem("emuColors", JSON.stringify(emuColors));
    return {
      data: oData,
      totalCYP: oTotalCyp,
      methodSeq: methodSeq,
      tableMethodSeq: tableMethodSeq,
      emuColors: emuColors,
      finalMethodArr: finalMethodArr,
    };
  },
  /**
   * This function is to get formated data as per charts
   * Usage: `getYearFormated(p_start)`
   * @param 'p_start' start year in global config
   * @return {Array} return array of years starting from p_start
   */
  getYearFormated: (p_start, p_end) => {
    let sCurYear = p_end * 1,
      nStartYear = p_start * 1,
      aYear = [nStartYear];
    while (nStartYear < sCurYear) {
      aYear.push(++nStartYear);
    }
    return aYear.join(";");
  },
  /**
   * This function is to get formated data as per charts
   * Usage: `getChartFormatedData(p_response,p_data,oTarget)`
   * @param {p_response,p_data,oTarget}
   * @return {Object} formated data to be used in calculations
   */
  getChartFormatedData: (p_response, p_data, oTarget, yearString) => {
    let yearArray = yearString.split(";");
    let i,
      nLen = p_response.length,
      sName = p_data.name;
    for (let yrInd = 0; yrInd < yearArray.length; yrInd++) {
      let year = yearArray[yrInd];
      if (!oTarget[year]) {
        oTarget[year] = {};
      }
      if (!oTarget[year][sName]) oTarget[year][sName] = 0;
      for (i = 0; i < nLen; i++) {
        let sYear = p_response[i][1];
        if (year == sYear) {
          oTarget[year][sName] =
            (oTarget[year][sName] || 0) + p_response[i][3] * 1;
        }
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
      keyValueData = {},
      oColor = {},
      newTableData = [],
      newFields = [];
    /**Added by ashvini */
    for (let i in aCharts) {
      aCats.push(i);
    }
    for (let i in aCharts) {
      //aCats.push(i);
      for (let j in aCharts[i]) {
        if (!keyValueData[j]) keyValueData[j] = {};
        keyValueData[j][i] = aCharts[i][j];
      }
    }
    /**Added by ashvini */
    for (let cat in keyValueData) {
      if (!oSeries[cat]) {
        oSeries[cat] = [];
      }
      let yearWiseObject = keyValueData[cat];
      for (let i in aCats) {
        let yr = aCats[i];
        oSeries[cat].push(yearWiseObject[yr] ? yearWiseObject[yr] : null);
        if (!oColor[cat]) {
          let filteredObj = p_data.dataElems.find((obj) => {
            if (obj.static_name == cat.split("/")[1]) return obj;
          });
          oColor[cat] = filteredObj.color;
        }
      }
    }

    newFields.push({ key: i18n.t("period"), sortable: true });
    aCats.forEach((key, i) => {
      let row = {};
      row[i18n.t("period")] = key;
      for (let k in oSeries) {
        if (newFields.indexOf(k) == -1) {
          newFields.push(k.split("/")[0]);
        }
        let val = oSeries[k][i] ? oSeries[k][i].toLocaleString() : null;

        row[k.split("/")[0]] = val;
      }
      newTableData.push(row);
    });

    for (let k in oSeries) {
      let oTemp = {
        name: k.split("/")[0],
        data: oSeries[k],
        color: oColor[k],
        mainColor: p_data.color,
        mainName: p_data.name,
      };
      aData.push(oTemp);
      /*  */
      let oRow = { Method: k };
      oSeries[k].forEach((ele, index) => {
        oRow[aCats[index]] = ele;
      });
      /*  */
    }
    return {
      categories: aCats,
      data: aData,
      title: p_data.name.split("/")[0],
      tableData: newTableData,
      fields: newFields,
      visible: p_data.visible,
      source: p_data.source,
      disableChart: p_data.disable,
      chartInfo: p_data.chartInfo,
      cid: p_data.cID,
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
    let i,
      nLen = p_charts.length,
      oData = {};
    for (i = 0; i < nLen; i++) {
      let oCharts = p_charts[i].charts,
        oCyp = p_charts[i].cyp;
      for (let j in oCharts) {
        for (let k in oCharts[j]) {
          oData[j] = (oData[j] || 0) + oCharts[j][k] * oCyp[k];
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
    let newName =
      oConfig != null
        ? typeof oConfig.name == "object"
          ? oConfig.name[i18n.locale]
          : oConfig.name
        : "Total CYP";
    let newColor = oConfig != null ? oConfig.chartOptions.color : "";
    let aCats = [],
      aSeries = [{ name: newName, data: [], color: newColor }],
      aTableData = [],
      aFileds = [{ key: i18n.t("period"), sortable: true }, "Total CYP"],
      oRow = { Method: "Total CYP" },
      newTableData = [];
    for (let i in p_data) {
      aCats.push(i);
      // aSeries[0].data.push(p_data[i].toFixed(2) * 1);
      aSeries[0].data.push(Math.round(p_data[i]));
      //aFileds.push({key:i});
      oRow[i] = p_data[i].toFixed(2);
    }
    aTableData.push(oRow);

    Object.keys(aTableData[0]).forEach((y) => {
      if (y != "Method") {
        let period = i18n.t("period");
        newTableData.push({
          [period]: y,
          "Total CYP": Number(Math.round(aTableData[0][y])),
        });
      }
    });
    return {
      categories: aCats,
      data: aSeries[0].data.length ? aSeries : [],
      tableData: newTableData,
      fields: aFileds,
      title: newName,
      visible: true,
      ...oConfig,
      ...p_config,
    };
  },
  /**
   * Short term method calculation
   *
   */
  calculateSTMNotAdjusted: (p_arr, p_repo, p_adjF, byPassRepoRate) => {
    let i,
      nLen = p_arr.length,
      oAdjusted = {},
      oNotAdjusted = {},
      oCYP = {};
    for (i = 0; i < nLen; i++) {
      let oChart = p_arr[i].charts,
        // sName = p_arr[i].name.toLowerCase(),
        sName = p_arr[i].name,
        otempCyp = p_arr[i].cyp,
        //bIsShortTerm = oMethods.shortTerm.indexOf(sName.toLowerCase()) > -1
        bIsShortTerm = p_arr[i].methodType;

      if (bIsShortTerm == "Short Term") {
        oNotAdjusted[sName] = {};
        oAdjusted[sName] = {};

        for (let j in oChart) {
          oNotAdjusted[sName][j] = {};
          oAdjusted[sName][j] = {};
          for (let k in oChart[j]) {
            oNotAdjusted[sName][j][k] = oChart[j][k];
            oAdjusted[sName][j][k] = oChart[j][k];
            if (
              byPassRepoRate == true ||
              (byPassRepoRate == false && p_repo != null && p_repo[j] > 60)
            ) {
              // oChart[j][k] = oChart[j][k] * otempCyp[k]
              oNotAdjusted[sName][j][k] = oChart[j][k] * otempCyp[k];
              oNotAdjusted[sName][j][k] =
                oNotAdjusted[sName][j][k].toFixed(3) * 1;
              let adF = p_adjF[k.split("/")[1]] ? p_adjF[k.split("/")[1]] : 1;
              oAdjusted[sName][j][k] = oNotAdjusted[sName][j][k] * adF;
              oAdjusted[sName][j][k] = oAdjusted[sName][j][k].toFixed(3) * 1;
            } else {
              oNotAdjusted[sName][j][k] = null;
              oAdjusted[sName][j][k] = null;
            }
          }
        }
      }

      /* cyp calculation */
      for (let j in otempCyp) {
        oCYP[j] = otempCyp[j];
      }
      /*  */
    }
    return {
      adjusted: oAdjusted,
      nonAdjusted: oNotAdjusted,
      cyp: oCYP,
    };
  },
  /**
   * This function is to get formated data for background indicators
   * Usage: `calculateNewBU:(p_arr,p_cont, p_repo, p_adjF, prevCont)`
   * @param 'p_arr'as input data, 'p_cont' calculated continuation rate data, p_repo as reporting rate,p_adjF as adjustment factor data and prevCont as continuation data from admin
   * @return {object} return object of {adjusted, nonAdjusted} gives adjusted and not adjusted user for long term methods
   *
   */
  calculateNewBU: (p_arr, p_cont, p_repo, p_adjF, prevCont, byPassRepoRate) => {
    let i,
      nLen = p_arr.length,
      oBU = {},
      scalling = {},
      oPArr = {},
      aYears = [];
    for (i = 0; i < nLen; i++) {
      let oChart = p_arr[i].charts,
        sName = p_arr[i].name,
        bIsLongTerm = p_arr[i].methodType;
      oPArr[sName] = oChart;
      //if(bIsLongTerm == "Long Term"){

      if (oChart) {
        let sFirstYear = Object.keys(oChart)[0];

        Object.keys(oChart).forEach((j, m) => {
          if (aYears.indexOf(j) == -1) {
            aYears.push(j);
          }
          p_arr[i].dataElems.forEach((s) => {
            if (s.subMethodType == "Long Term") {
              if (!oBU[sName]) oBU[sName] = {};
              if (!oBU[sName][j]) oBU[sName][j] = {};
              //scalling[sName][j] ={}
              for (let k in oChart[j]) {
                if (s.name == k) {
                  if (!scalling[k]) scalling[k] = {};
                  let nCont = p_cont[k.split("/")[1]][m]
                    ? p_cont[k.split("/")[1]][m]
                    : 0;
                  let oVal = oChart[sFirstYear][k] ? oChart[sFirstYear][k] : 0;
                  let ar = [0, 1, 0.5];
                  let scl = 1;
                  if (ar.includes(s.scaling)) scl = s.scaling;
                  oBU[sName][j][k] = oVal * nCont * scl;
                  oBU[sName][j][k] = oBU[sName][j][k].toFixed(3) * 1;
                  scalling[k]["scaling"] = scl;
                }
              }
            }
          });
        });
      }
      //}
    }
    let oNonAdjusted = {},
      oAdjusted = {};
    for (let method in oBU) {
      let nCounter = 0,
        tempM = "";
      oNonAdjusted[method] = {};
      oAdjusted[method] = {};
      for (let j in oBU[method]) {
        let index = Object.keys(oBU[method]).indexOf(j);
        oNonAdjusted[method][j] = {};
        oAdjusted[method][j] = {};
        let subMC = 0;
        for (let sSubM in oBU[method][j]) {
          if (sSubM != "scaling") {
            let l = nCounter;
            let m = 0,
              nSum = 0;
            let buVal = oBU[method][j][sSubM] ? oBU[method][j][sSubM] : 0;
            let paVal =
              oPArr[method][aYears[0]] && oPArr[method][aYears[0]][sSubM]
                ? oPArr[method][aYears[0]][sSubM]
                : 0;
            if (sSubM != tempM && index == 0) {
              subMC = 0;
              oNonAdjusted[method][j][sSubM] =
                buVal + paVal * prevCont[sSubM.split("/")[1]][subMC];
            } else {
              oNonAdjusted[method][j][sSubM] =
                buVal + paVal * prevCont[sSubM.split("/")[1]][l];
              while (l > 0) {
                let sYr = aYears[l];
                if (sYr == undefined) {
                  break;
                }
                let paTempVal = oPArr[method][sYr][sSubM]
                  ? oPArr[method][sYr][sSubM]
                  : 0;
                nSum +=
                  paTempVal *
                  (prevCont[sSubM.split("/")[1]][m]
                    ? prevCont[sSubM.split("/")[1]][m]
                    : 0);
                l--;
                m++;
                //nCounter--;
              }
            }

            oNonAdjusted[method][j][sSubM] += nSum;
            //oNonAdjusted[method][j][sSubM] = Math.round(oNonAdjusted[method][j][sSubM]);
            oNonAdjusted[method][j][sSubM] =
              oNonAdjusted[method][j][sSubM].toFixed(3) * 1;
            if (byPassRepoRate == false && p_repo && p_repo[j] < 60) {
              oNonAdjusted[method][j][sSubM] = 0;
            }
            let adjustmentFact = p_adjF[sSubM.split("/")[1]]
              ? p_adjF[sSubM.split("/")[1]]
              : p_adjF[sSubM.split("/")[0]]
              ? p_adjF[sSubM.split("/")[0]]
              : 1;

            oAdjusted[method][j][sSubM] =
              oNonAdjusted[method][j][sSubM] * adjustmentFact;
            oAdjusted[method][j][sSubM] =
              oAdjusted[method][j][sSubM].toFixed(3) * 1;
            subMC++;
            tempM = sSubM;
          }
        }
        nCounter++;
      }
    }
    return {
      scalling: scalling,
      baseline: oBU,
      adjusted: oAdjusted,
      nonAdjusted: oNonAdjusted,
    };
  },
  calculateNewAdjustedVals: (p_AdjtVal) => {
    let finalAdjusted = {};
    if (p_AdjtVal && Object.keys(p_AdjtVal).length > 0) {
      Object.keys(p_AdjtVal).forEach((method) => {
        Object.keys(p_AdjtVal[method]).forEach((year) => {
          Object.keys(p_AdjtVal[method][year]).forEach((subM) => {
            if (!finalAdjusted[method + "__" + subM]) {
              finalAdjusted[method + "__" + subM] = {};
            }
            finalAdjusted[method + "__" + subM][year] =
              p_AdjtVal[method][year][subM];
          });
        });
      });
    }
    return finalAdjusted;
  },

  getSumOfCont: (p_obj) => {
    let oFinal = {};
    for (let i in p_obj) {
      oFinal[i] = [];
      let nSum = 0,
        aMethods = [],
        aFinalMthodVals = [],
        aContinuation = p_obj[i].continuation;
      for (let j in aContinuation) {
        if (j > 0) {
          nSum += aContinuation[j] * 1;
          aMethods.push(aContinuation[j] * 1);
        }
      }
      let nLen = aMethods.length,
        k;
      aFinalMthodVals.push(nSum.toFixed(3) * 1);
      for (k = 0; k < nLen - 1; k++) {
        nSum -= aMethods[k];
        aFinalMthodVals.push(nSum.toFixed(3) * 1);
      }
      oFinal[i] = aFinalMthodVals;
    }
    return oFinal;
  },
  getUserTrendsData: (p_tab, finalMethodArr, sYearArray, adjustedObject) => {
    let emuColors = JSON.parse(localStorage.getItem("emuColors"));
    let mainObject = {
      categories: sYearArray,
      data: [],
      tableData: [],
    };
    for (let methodInd in finalMethodArr) {
      let method = finalMethodArr[methodInd];
      let tempObj = { name: method, data: [], color: emuColors[method] };
      for (let yearInd in sYearArray) {
        let year = sYearArray[yearInd];
        let val =
          adjustedObject[method] && adjustedObject[method][year]
            ? adjustedObject[method][year]
            : null;
        tempObj.data.push(val);
      }
      mainObject.data.push(tempObj);
    }
    //for tablearray
    for (let yearInd in sYearArray) {
      let year = sYearArray[yearInd];
      let tRow = {};
      tRow[i18n.t("period")] = year;
      for (let methodInd in finalMethodArr) {
        let method = finalMethodArr[methodInd];
        let val =
          adjustedObject[method] && adjustedObject[method][year]
            ? adjustedObject[method][year]
            : null;
        tRow[method] = val;
      }
      mainObject.tableData.push(tRow);
    }
    return mainObject;
  },

  getFinaladjNonAdjData: (p_tab, allMethodsAdjusted) => {
    let oSSTOEMUCOLORS = localStorage.getItem("SSTOEMUCOLORS"),
      oTabColors = {};
    if (oSSTOEMUCOLORS) {
      oSSTOEMUCOLORS = JSON.parse(oSSTOEMUCOLORS);
      oTabColors = oSSTOEMUCOLORS[p_tab] ? oSSTOEMUCOLORS[p_tab] : {};
    }
    let methodValObject = {};
    Object.keys(allMethodsAdjusted).forEach((subObj) => {
      let TableRow = {};
      let adjustedObject = allMethodsAdjusted[subObj];
      Object.keys(adjustedObject).forEach((method) => {
        if (method.split("/")[1].toLocaleLowerCase() === "sterilization") {
          let separtedData = {};
          Object.keys(adjustedObject[method]).forEach((year) => {
            let subObject = adjustedObject[method][year];
            Object.keys(subObject).forEach((submethod) => {
              if (!separtedData[submethod]) {
                separtedData[submethod] = {};
              }
              TableRow[submethod.split("/")[0]] = {};
              separtedData[submethod][year] = subObject[submethod];
            });
          });
          Object.keys(separtedData).forEach((submethod) => {
            for (let yr in separtedData[submethod]) {
              TableRow[submethod.split("/")[0]][yr] =
                separtedData[submethod][yr].toFixed(0) * 1;
            }
          });
        } else {
          TableRow[method.split("/")[0]] = {};
          Object.keys(adjustedObject[method]).forEach((year) => {
            let subObject = adjustedObject[method][year];
            let sum = 0;
            for (let val in subObject) {
              sum = sum + subObject[val];
            }
            TableRow[method.split("/")[0]][year] = sum.toFixed(0) * 1;
          });
        }
      });
      methodValObject[subObj] = TableRow;
    });
    return methodValObject;
  },
  getadjNonAdjLineChart: (
    sYearArray,
    finalMethodArr,
    adjNonAdjData,
    surveyData,
    staticColors = []
  ) => {
    let allData = {
      nonAdjusted: adjNonAdjData.nonAdjusted,
      adjusted: adjNonAdjData.adjusted,
      surveyData: surveyData,
    };
    let mainObject = {
      categories: sYearArray,
      data: [],
      tableData: [],
    };
    let categories = {
      nonAdjusted: i18n.t("user_by_methods_service_unadjusted"),
      adjusted: i18n.t("user_by_methods_service_adjusted"),
      surveyData: i18n.t("user_by_methods_survey"),
    };
    let ind = 0;
    for (let type in allData) {
      let tempObj = {
        name: categories[type],
        data: [],
        color: staticColors[categories[type]],
      };
      ind++;
      for (let yrInd in sYearArray) {
        let year = sYearArray[yrInd];
        let sum = 0;
        for (let methodInd in finalMethodArr) {
          let method = finalMethodArr[methodInd];
          let val =
            allData[type][method] && allData[type][method][year]
              ? allData[type][method][year]
              : 0;
          sum = sum + val * 1;
        }
        tempObj.data.push(sum);
      }
      mainObject.data.push(tempObj);
    }
    for (let yrInd in sYearArray) {
      let year = sYearArray[yrInd];
      let tableRow = {};
      tableRow[i18n.t("period")] = year;
      for (let type in allData) {
        let sum = 0;
        for (let method in allData[type]) {
          let val = allData[type][method][year]
            ? allData[type][method][year]
            : 0;
          sum = sum + val * 1;
        }
        tableRow[categories[type]] = sum;
      }
      mainObject.tableData.push(tableRow);
    }
    return mainObject;
  },
  getadjNonAdjBarChart: (
    endYear,
    sYearArray,
    finalMethodArr,
    adjNonAdjData,
    surveyData
  ) => {
    let emuColors = JSON.parse(localStorage.getItem("emuColors"));
    //need to do as for stack as it shows reversed order of methods
    //finalMethodArr = finalMethodArr.reverse();
    let reversedArray = JSON.parse(JSON.stringify(finalMethodArr)).reverse();
    let allData = {
      nonAdjusted: adjNonAdjData.nonAdjusted,
      adjusted: adjNonAdjData.adjusted,
      surveyData: surveyData,
    };
    let mainObject = {
      categories: [
        i18n.t("user_by_methods_service_unadjusted"),
        i18n.t("user_by_methods_service_adjusted"),
        i18n.t("user_by_methods_survey"),
      ],
      data: [],
      tableData: [],
    };
    for (let yrInd in sYearArray) {
      let year = sYearArray[yrInd];
      if (year == endYear) {
        for (let methodInd in reversedArray) {
          let method = reversedArray[methodInd];
          let tablerow = {};
          let tempObj = { name: method, data: [], color: emuColors[method] };
          let surveyVal = allData["surveyData"][method][year];
          let nonAdjustmentVal =
            allData["nonAdjusted"][method] &&
            allData["nonAdjusted"][method][year]
              ? allData["nonAdjusted"][method][year]
              : null;
          let adjustmentVal =
            allData["adjusted"][method] && allData["adjusted"][method][year]
              ? allData["adjusted"][method][year]
              : null;
          tempObj.data.push(nonAdjustmentVal, adjustmentVal, surveyVal);
          mainObject.data.push(tempObj);

          tablerow[i18n.t("method")] = method;
          tablerow[i18n.t("user_by_methods_service_unadjusted")] =
            nonAdjustmentVal;
          tablerow[i18n.t("user_by_methods_service_adjusted")] = adjustmentVal;
          tablerow[i18n.t("user_by_methods_survey")] = surveyVal;
          mainObject.tableData.push(tablerow);
        }
      }
    }
    mainObject.tableData = mainObject.tableData.reverse();
    return mainObject;
  },
  getSurveyWiseData: (
    sYearArray,
    finalMethodArr,
    unpdData,
    oMethodMix,
    oPopulation
  ) => {
    let mainObj = {};
    for (let mind in finalMethodArr) {
      let methd = finalMethodArr[mind];
      mainObj[methd] = {};
      for (let yrInd in sYearArray) {
        let year = sYearArray[yrInd];
        let methodVal = oMethodMix[methd] ? oMethodMix[methd] : 0;
        let calcVal =
          (methodVal / 100) * (unpdData[year] / 100) * oPopulation[year];
        mainObj[methd][year] = calcVal.toFixed(0) * 1;
      }
    }
    return mainObj;
  },
  combinedComparisonEstimate: (
    endYear,
    finalMethodArr,
    sYearArray,
    methodWiseObject,
    surveyData
  ) => {
    let mainObj = {};
    mainObj.data = [];
    mainObj.tableData = [];
    let methodArr = JSON.parse(JSON.stringify(finalMethodArr));
    finalMethodArr = methodArr.reverse(); //need to do as for stack as it shows reversed order of methods
    let emuColors = JSON.parse(localStorage.getItem("emuColors"));
    for (let yrInd in sYearArray) {
      let year = sYearArray[yrInd];
      if (year == endYear) {
        mainObj.data = [];
        mainObj.tableData = [];
        mainObj.categories = [
          i18n.t("user_by_methods_service"),
          i18n.t("user_by_methods_survey"),
        ];
        for (let methodInd in finalMethodArr) {
          let method = finalMethodArr[methodInd];
          let tempObj = { name: method, data: [], color: emuColors[method] };
          tempObj.data.push(
            methodWiseObject[method] && methodWiseObject[method][year]
              ? methodWiseObject[method][year]
              : null
          );
          tempObj.data.push(
            surveyData[method] && surveyData[method][year]
              ? surveyData[method][year]
              : null
          );
          mainObj.data.push(tempObj);
          let tablerow = {};
          (tablerow[i18n.t("method")] = method),
            (tablerow[i18n.t("user_by_methods_service")] =
              methodWiseObject[method] && methodWiseObject[method][year]
                ? methodWiseObject[method][year]
                : null);
          tablerow[i18n.t("user_by_methods_survey")] =
            surveyData[method] && surveyData[method][year]
              ? surveyData[method][year]
              : null;
          mainObj.tableData.push(tablerow);
        }
      }
    }
    mainObj.tableData = mainObj.tableData.reverse();
    return mainObj;
  },
  comarisonEstimateColumnChart: (
    endYear,
    finalMethodArr,
    sYearArray,
    methodWiseObject,
    surveyData,
    staticColors = []
  ) => {
    let mainObj = {};
    mainObj.data = [];
    mainObj.categories = [];
    mainObj.tableData = [];
    mainObj.fields = [];
    mainObj.fields.push(i18n.t("type"));
    let atypes = [
      i18n.t("user_by_methods_service"),
      i18n.t("user_by_methods_survey"),
    ];
    for (let yrInd in sYearArray) {
      let year = sYearArray[yrInd];
      if (year == endYear) {
        atypes.forEach((val, ind) => {
          let tObj = { name: val, data: [], color: staticColors[val] };
          let tablerow = {};
          tablerow[i18n.t("type")] = val;
          let dataObject = ind == 0 ? methodWiseObject : surveyData;
          for (let mthInd in finalMethodArr) {
            let mth = finalMethodArr[mthInd];
            if (mainObj.categories.indexOf(mth) == -1) {
              mainObj.categories.push(mth);
              mainObj.fields.push(mth);
            }
            tObj.data.push(
              dataObject[mth] && dataObject[mth][year]
                ? dataObject[mth][year]
                : null
            );
            tablerow[mth] =
              dataObject[mth] && dataObject[mth][year]
                ? dataObject[mth][year]
                : null;
          }
          mainObj.data.push(tObj);
          mainObj.tableData.push(tablerow);
        });
      }
    }
    return mainObj;
  },
  getMethodMixServicePie: (
    currentYear,
    finalMethodArr,
    sYearArray,
    methodWiseAdjObject,
    omethodMix
  ) => {
    let emuColors = JSON.parse(localStorage.getItem("emuColors"));
    let mainObject = {
      data: [],
      //  categories:[]
    };
    let methodMix = {
      data: [],
      // categories:[]
    };
    let tableData = [],
      aFields = [
        i18n.t("method"),
        i18n.t("estimated_modern"),
        i18n.t("contraceptive_modern"),
      ];
    let total = 0;
    let methodMixTotal = 0;
    for (let yearInd in sYearArray) {
      let year = sYearArray[yearInd];
      if (year == currentYear) {
        for (let methInd in finalMethodArr) {
          let method = finalMethodArr[methInd];
          let val =
            methodWiseAdjObject[method] && methodWiseAdjObject[method][year]
              ? methodWiseAdjObject[method][year]
              : null;
          total = total + val;
          let mVal = omethodMix[method] ? omethodMix[method] : null;
          methodMixTotal = methodMixTotal + mVal;
        }
        for (let methInd in finalMethodArr) {
          let tRow = {};
          let method = finalMethodArr[methInd];
          tRow[i18n.t("method")] = method;

          let val =
            methodWiseAdjObject[method] && methodWiseAdjObject[method][year]
              ? methodWiseAdjObject[method][year]
              : null;
          let perVal = (val / total) * 100;
          let mVal = omethodMix[method] ? omethodMix[method] : null;
          let perMVal = (mVal / methodMixTotal) * 100;
          let tempObj = {
            name: method,
            y: perVal.toFixed(2) * 1,
            color: emuColors[method],
          };
          if (tempObj.y) mainObject.data.push(tempObj);
          let tempMethodObj = {
            name: method,
            y: perMVal.toFixed(2) * 1,
            color: emuColors[method],
          };
          if (tempMethodObj.y) methodMix.data.push(tempMethodObj);
          tRow[i18n.t("estimated_modern")] = perVal.toFixed(2) * 1;
          tRow[i18n.t("contraceptive_modern")] = perMVal.toFixed(2) * 1;
          tableData.push(tRow);
        }
      }
    }
    return {
      estiMethod: mainObject,
      methodMix: methodMix,
      tableData: tableData,
      aFields: aFields,
    };
  },
  getUserTrendsDatafromSurvey: (
    sYearArray,
    unpdData,
    dhsData,
    pmaData,
    p_bAllWomwn,
    bgColor,
    unpdtext
  ) => {
    let allData = {};
    (allData[unpdtext] = unpdData),
      (allData["dhs"] = dhsData),
      (allData["pma"] = pmaData);
    let mainObject = {
      data: [],
      tableData: [],
    };
    let testArray = {
      unpd: p_bAllWomwn ? i18n.t("mCPR_AW_UNPD") : i18n.t("mCPR_MW_UNPD"),
      dhs: p_bAllWomwn ? i18n.t("mCPR_AW_DHS") : i18n.t("mCPR_MW_DHS"),
      pma: p_bAllWomwn ? i18n.t("mCPR_AW_PMA") : i18n.t("mCPR_MW_PMA"),
      fpet: p_bAllWomwn ? i18n.t("mCPR_AW_FPET") : i18n.t("mCPR_AW_FPET"),
    };

    for (let type in allData) {
      let ind = 0;
      let surveyType = type.toLowerCase();
      let tempObj = {
        name: testArray[surveyType],
        data: [],
        keyVal: {},
        color: bgColor[type.toUpperCase()],
      };
      ind++;
      let checkIfEmpty = null;
      let sData = allData[surveyType];
      for (let yearInd in sYearArray) {
        let year = sYearArray[yearInd];
        // tRow[testArray[type]]=sData[year]
        //tempObj.data.push({name:year,y:sData[year]})
        tempObj.data.push(sData[year] ? sData[year] : null);
        if (checkIfEmpty == null)
          checkIfEmpty = sData[year] && sData[year] != 0 ? sData[year] : null;
        tempObj.keyVal[year] = sData[year] ? sData[year] : null;
      }
      if (checkIfEmpty != null) mainObject.data.push(tempObj);
    }
    return mainObject;
  },
  getemuComparisonData: (
    bgSureyData,
    outputData,
    filter,
    staticColors = []
  ) => {
    let oProps = {
      commoditiesToClients: i18n.t("emu_output_5"),
      commoditiesToFacilities: i18n.t("emu_output_6"),
      fp_users: i18n.t("emu_output_8"),
      fp_visits: i18n.t("emu_output_7"),
    };
    let actTypes = {
      commoditiesToClients: i18n.t("commodities_to_clients"),
      commoditiesToFacilities: i18n.t("commodities_to_facility"),
      fp_users: i18n.t("fp_users"),
      fp_visits: i18n.t("fp_visits"),
    };
    let mainObject = {
      data: [],
      categories: [],
      tableData: [],
    };
    mainObject.data = bgSureyData.data ? bgSureyData.data : [];

    for (let type in oProps) {
      let emuData = outputData ? outputData[type] : null;
      let emuFilter = filter[type];
      if (emuData) {
        mainObject.categories =
          emuData && emuData.categories ? emuData.categories : [];
        let reqEmuData =
          emuData && emuData.data
            ? emuData.data.filter((obj) => obj.name.includes(i18n.t("EMU")))
            : [];
        let actType = actTypes[type];
        let tempObj = {
          name: oProps[type],
          data: [],
          keyVal: {},
          color: staticColors[actType][emuFilter],
        };
        if (reqEmuData.length == 2) {
          tempObj.data =
            emuFilter == "inc" ? reqEmuData[0].data : reqEmuData[1].data;
          tempObj.keyVal =
            emuFilter == "inc" ? reqEmuData[0].keyVal : reqEmuData[1].keyVal;
        }
        mainObject.data.push(tempObj);
      }
    }

    return mainObject;
  },
  getuserTrendsbyEmu: (
    sYearArray,
    methodWiseAdjObject,
    oPopulation,
    finalObj,
    contName,
    staticColors = []
  ) => {
    if (finalObj && finalObj.data) {
      finalObj.categories = sYearArray;
    } else {
      let finalObj = {};
      finalObj.data = [];
      finalObj.categories = sYearArray;
      finalObj.tableData = [];
    }
    let totalObj = {};
    for (let yearInd in sYearArray) {
      let year = sYearArray[yearInd];
      let total = 0;
      let totalExCondom = 0;
      totalObj[year] = {};
      for (let method in methodWiseAdjObject) {
        if (method.toLowerCase() == i18n.t("condom").toLowerCase()) {
          let nVal =
            methodWiseAdjObject[method] && methodWiseAdjObject[method][year]
              ? methodWiseAdjObject[method][year]
              : 0;
          total = total + nVal * 1;
        } else {
          let nVal =
            methodWiseAdjObject[method] && methodWiseAdjObject[method][year]
              ? methodWiseAdjObject[method][year]
              : 0;
          totalExCondom = totalExCondom + nVal * 1;
          total = total + nVal * 1;
        }
      }
      totalObj[year] = { incCondm: total, exCondom: totalExCondom };
    }
    let tempObjInc = {
      name: i18n.t("EMU") + ": " + contName + " " + i18n.t("includeCondoms"),
      data: [],
      keyVal: {},
      color: staticColors[contName]["inc"],
    };
    let tempObjEx = {
      name: i18n.t("EMU") + ": " + contName + " " + i18n.t("excludeCondoms"),
      data: [],
      keyVal: {},
      color: staticColors[contName]["exc"],
    };
    for (let yearInd in sYearArray) {
      let year = sYearArray[yearInd];
      let incCondomVal =
        (oPopulation[year]
          ? (totalObj[year] && totalObj[year]["incCondm"]
              ? totalObj[year]["incCondm"]
              : 0) / (oPopulation[year] ? oPopulation[year] : 0)
          : 0) * 100;
      let exCondomVal =
        (oPopulation[year]
          ? (totalObj[year] && totalObj[year]["exCondom"]
              ? totalObj[year]["exCondom"]
              : 0) / (oPopulation[year] ? oPopulation[year] : 0)
          : 0) * 100;
      tempObjInc.data.push(incCondomVal.toFixed(2) * 1);
      tempObjEx.data.push(exCondomVal.toFixed(2) * 1);
      tempObjInc.keyVal[year] = incCondomVal.toFixed(2) * 1;
      tempObjEx.keyVal[year] = exCondomVal.toFixed(2) * 1;
    }

    finalObj.data.push(tempObjInc, tempObjEx);
    for (let yearInd in sYearArray) {
      let year = sYearArray[yearInd];
      let tRow = {};
      tRow[i18n.t("period")] = year;
      finalObj.data.forEach((obj) => {
        tRow[obj["name"]] = obj["data"][yearInd];
      });
      finalObj.tableData.push(tRow);
    }
    return finalObj;
  },
  getSlopData: (userTrendsbyEmu) => {
    let data = userTrendsbyEmu.data;
    let mainObject = {
      data: [],
      categories: [],
      tableData: [],
      inserData: [],
    };
    data.forEach((obj) => {
      let tRow = {};
      mainObject["categories"].push(obj["name"]);
      tRow[i18n.t("method")] = obj["name"];
      let useData = obj["keyVal"];
      let sumX = 0,
        sumY = 0,
        sumXY = 0,
        sumXsq = 0;
      let n = 0;
      Object.keys(useData).forEach((year) => {
        if (useData[year] != "") {
          let val = useData[year];
          if (val) {
            sumX += year * 1;
            sumY += (val / 100) * 1;
            sumXY += year * (val / 100) * 1;
            sumXsq += year * 1 * (year * 1);
            n++;
          }
        }
      });
      let slopNum = n * sumXY - sumX * sumY ? n * sumXY - sumX * sumY : 0;
      let slopeDenm = n * sumXsq - sumX * sumX ? n * sumXsq - sumX * sumX : 0;
      let slope = 0;
      if (slopeDenm != 0) slope = ((slopNum / slopeDenm) * 100).toFixed(3);
      tRow[i18n.t("value")] = slope;
      mainObject.inserData.push({
        name: obj["name"],
        slope: slope,
        color: obj["color"],
      });
      mainObject.tableData.push(tRow);
    });
    mainObject.categories.forEach((name) => {
      let tempObj = { name: name, data: [], color: "" };
      mainObject.inserData.forEach((oj, ind) => {
        if (oj.name == name) {
          tempObj.color = oj.color;
          tempObj.data[ind] = oj.slope * 1;
        } else {
          tempObj.data[ind] = 0;
        }
      });
      mainObject.data.push(tempObj);
    });
    return mainObject;
  },
  getMethodMixPie: (p_data) => {
    let p_color = JSON.parse(localStorage.getItem("emuColors"));
    let aFinalData = [];
    // method_seq.forEach(method =>{
    for (let i in p_data) {
      let oTemp = {};

      //    if(method && p_data[method] != undefined){
      if (i != undefined && i && p_data[i] != undefined) {
        oTemp = { name: i, y: p_data[i] };
        if (p_color && p_color[i]) {
          oTemp.color = p_color[i];
        }
        // }
        aFinalData.push(oTemp);
      }
    }
    // })

    return aFinalData;
  },
  emuOutputCompByMethod: (
    curentYear,
    sYearArray,
    userTrendsData,
    surveyData,
    finalMethodArr,
    defaultEMU
  ) => {
    let mainObj = {
      categories: [],
      data: [],
      tableData: [],
    };
    let oProps = {
      commoditiesToClients: i18n.t("commodities_to_clients"),
      commoditiesToFacilities: i18n.t("commodities_to_facility"),
      fp_users: i18n.t("fp_users"),
      fp_visits: i18n.t("fp_visits"),
    };
    let emuColors = JSON.parse(localStorage.getItem("emuColors"));
    let finalEmu = "";
    for (let tp in oProps) {
      if (oProps[tp] == defaultEMU) {
        finalEmu = tp;
      }
    }
    let methodArr = finalMethodArr[finalEmu];
    for (let methodind in methodArr) {
      let method = methodArr[methodind];
      let tempObj = { name: method, data: [], color: emuColors[method] };
      let tableRow = {};
      tableRow[i18n.t("method")] = method;
      let index = 0;
      for (let type in oProps) {
        let userData = userTrendsData[type];
        let sData = surveyData[type];
        if (sData && index == 0) {
          if (!mainObj.categories.includes(i18n.t("user_by_methods_survey"))) {
            mainObj.categories.push(i18n.t("user_by_methods_survey"));
          }
          for (let yrInd in sYearArray) {
            let year = sYearArray[yrInd];
            if (year == curentYear) {
              tempObj.data.push(
                sData && sData[method] && sData[method][year]
                  ? sData[method][year]
                  : null
              );
              tableRow[i18n.t("user_by_methods_survey")] =
                sData && sData[method] && sData[method][year]
                  ? sData[method][year]
                  : null;
            }
          }
          index++;
        }
        if (userData) {
          if (!mainObj.categories.includes(oProps[type]))
            mainObj.categories.push(oProps[type]);
          for (let yrInd in sYearArray) {
            let year = sYearArray[yrInd];
            if (year == curentYear) {
              let val =
                userData && userData[method] && userData[method][year]
                  ? userData[method][year]
                  : null;
              tempObj.data.push(val);
              tableRow[oProps[type]] = val;
            }
          }
        }
      }
      mainObj.tableData.push(tableRow);
      mainObj.data.push(tempObj);
    }
    return mainObj;
  },
  emuOutputUserByMethod: (
    sYearArray,
    userTrendsData,
    finalMethodArr,
    defaultEMU,
    filter,
    staticColors = []
  ) => {
    let mainObject = {};
    let oProps = {
      commoditiesToClients: i18n.t("commodities_to_clients"),
      commoditiesToFacilities: i18n.t("commodities_to_facility"),
      fp_users: i18n.t("fp_users"),
      fp_visits: i18n.t("fp_visits"),
    };
    let finalEmu = "";
    for (let tp in oProps) {
      if (oProps[tp] == defaultEMU) {
        finalEmu = tp;
      }
    }
    let fMethd = finalMethodArr[finalEmu];
    for (let methodInd in fMethd) {
      let method = fMethd[methodInd];
      mainObject[method] = {
        categories: sYearArray,
        data: [],
        tableData: [],
      };
      for (let type in oProps) {
        let methodData = userTrendsData[type];
        if (methodData) {
          let fil = filter[type] ? filter[type] : "inc";
          let tempObj = {
            name: oProps[type],
            data: [],
            color: staticColors[oProps[type]][fil],
          };
          for (let yearInd in sYearArray) {
            let year = sYearArray[yearInd];
            let val =
              methodData && methodData[method] && methodData[method][year]
                ? methodData[method][year]
                : null;
            tempObj.data.push(val);
          }
          mainObject[method].data.push(tempObj);
        }
      }
      for (let yearInd in sYearArray) {
        let year = sYearArray[yearInd];
        let tRow = {};
        tRow[i18n.t("period")] = year;
        for (let type in oProps) {
          if (userTrendsData[type]) {
            tRow[oProps[type]] =
              userTrendsData[type] &&
              userTrendsData[type][method] &&
              userTrendsData[type][method][year]
                ? userTrendsData[type][method][year]
                : null;
          }
        }
        mainObject[method].tableData.push(tRow);
      }
    }
    return mainObject;
  },
  /**
   * This function is to get formated data for background indicators
   * Usage: `getFormatedBackGroundData(p_data,p_Keys,p_year)`
   * @param 'p_data'as background data api response, 'p_Keys' as background data DE'S, p_year as year array
   * @return {Array} return array of bgData,methodmix and recentyear
   *
   */
  /**Note: Future develepment need to combine logic of both finalmethodmix and finalBG */
  getFormatedBackGroundData: (p_data, p_Keys, p_year) => {
    /***Added by ashvini */
    let finalBG = {},
      finalMethodMix = {},
      methodMixYear = "";
    Object.keys(p_Keys).forEach((methodName) => {
      if (p_Keys[methodName].length) {
        let methodDE = p_Keys[methodName];
        if (p_Keys[methodName].length > 1) {
          //for Most Recent Method Mix
          let methdArr = p_Keys[methodName];
          methdArr.forEach((mKeys) => {
            let methodMixId, dispName;
            if (mKeys.split("/").length == 2) {
              (methodMixId = mKeys.split("/")[0]),
                (dispName = mKeys.split("/")[1]);
            } else {
              (methodMixId = mKeys), (dispName = mKeys);
            }
            finalMethodMix[dispName] = 0;
            let dataRows = p_data.rows;
            for (let index = p_year.length - 1; index >= 0; index--) {
              let eachYear = p_year[index];
              let iFound = false;
              iFound = dataRows.find((rowArray) => {
                if (rowArray[0] == methodMixId && rowArray[1] == eachYear) {
                  if (methodMixYear == "") methodMixYear = eachYear;
                  if (methodMixYear == eachYear) {
                    finalMethodMix[dispName] =
                      (rowArray[3] * 1).toFixed(3) * 1
                        ? (rowArray[3] * 1).toFixed(3) * 1
                        : 0;
                    return true;
                  }
                }
              });

              // if(iFound)
              // return true;
            }
          });
        } else {
          //for other methods like popumlation,fpet
          let dataRows = p_data.rows;
          let statName, dispName;
          if (methodDE.length > 0)
            if (methodDE[0].split("/").length == 2) {
              (statName = methodDE[0].split("/")[0]),
                (dispName = methodDE[0].split("/")[1]);
            } else {
              (statName = methodDE[0]), (dispName = methodDE[0]);
            }

          finalBG[dispName] = {};

          for (let index = 0; index < p_year.length; index++) {
            let eachYear = p_year[index];
            let iFound = false;
            iFound = dataRows.find((rowArray) => {
              if (rowArray[0] == statName && rowArray[1] == eachYear) {
                finalBG[dispName][eachYear] = (rowArray[3] * 1).toFixed(3) * 1;
                return true;
              }
            });
            if (!iFound) finalBG[dispName][eachYear] = 0;
          }
        }
      }
    });
    return {
      final: finalBG,
      methodMix: finalMethodMix,
      recentYear: methodMixYear,
    };

    //******END */
  },
  saveChartColors: (p_data, p_tab) => {
    let i,
      nLen = p_data.length,
      oFinalColors = {};
    for (i = 0; i < nLen; i++) {
      let aData = p_data[i].data;
      if (Array.isArray(aData)) {
        let j,
          nCol = aData.length;
        for (j = 0; j < nCol; j++) {
          let sName = aData[j].name,
            sColor = aData[j].color;
          if (
            aData[j].mainName &&
            aData[j].mainName.split("/")[1] == "Sterilization"
          ) {
            sColor = aData[j].color;
          } else {
            sColor = aData[j].mainColor;
          }
          if (sColor) {
            oFinalColors[sName] = sColor;
          }
        }
      }
    }

    /*  */
    let oSSTOEMUCOLORS = localStorage.getItem("SSTOEMUCOLORS");
    if (!oSSTOEMUCOLORS) {
      oSSTOEMUCOLORS = { [p_tab]: oFinalColors };
    } else {
      oSSTOEMUCOLORS = JSON.parse(oSSTOEMUCOLORS);
      oSSTOEMUCOLORS[p_tab] = oFinalColors;
    }
    localStorage.setItem("SSTOEMUCOLORS", JSON.stringify(oSSTOEMUCOLORS));
  },
  getComputedContFact: (p_cont) => {
    for (let i in p_cont) {
      for (let j in p_cont[i]) {
        let nScalingFactor =
            p_cont[i][j].scalingFactor === undefined
              ? 1
              : p_cont[i][j].scalingFactor * 1,
          oContinuation = p_cont[i][j].continuation,
          nLen = Object.keys(oContinuation).length,
          oFinal = {};
        //Till 9 - 10 years for all the methods except sterilzation(based on cyp factors)
        //for(let k = 0; k < nLen - 1; k++){
        for (let k = 0; k < nLen - 2; k++) {
          oFinal[k] =
            (
              ((oContinuation[k] * 1 + oContinuation[k + 1] * 1) / 2) *
              nScalingFactor
            ).toFixed(3) * 1;
          //oFinal[k] = (((oContinuation[k] * 1 + oContinuation[k + 1] * 1) / 2) * nScalingFactor)
        }
        p_cont[i][j].continuation = oFinal;
      }
    }
    return p_cont;
  },
  getTableFormatedData: (newData, methodSeq) => {
    let oMethods = {};
    for (let methodind in Object.keys(newData)) {
      let method = Object.keys(newData)[methodind];
      methodSeq.forEach((methodName) => {
        if (methodName == method) {
          let methodname = method.split("__")[0].split("/")[0],
            sSubMethod = method.split("__")[1].split("/")[0];
          if (!oMethods[methodname]) oMethods[methodname] = {};
          oMethods[methodname][sSubMethod] = {};
          let aCats = Object.keys(newData[method]);
          for (let j in aCats) {
            let yr = aCats[j];
            let val =
              newData[method][yr] &&
              newData[method][yr] &&
              newData[method][yr] != 0
                ? newData[method][yr]
                : null;
            oMethods[methodname][sSubMethod][yr] = val;
          }
        }
      });
    }

    return oMethods;
  },
};
