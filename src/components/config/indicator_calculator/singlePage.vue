<template>
  <div class="hide"></div>
</template>
<script>
import service from "@/service";
import StaticColorMixin from "@/helpers/StaticColorMixin";
import { compress, decompress, trimUndefinedRecursively } from "compress-json"; //https://www.npmjs.com/package/compress-json
// import {
//   getFormatedData,
//   getFinalChartData,
//   getFinalTotalCYP,
//   getTotalCYP,
//   getYearFormated,
//   getFormatedBackGroundData,
//   getComputedContFact,
//   getYearFormatedMonthly,
//   calculateSTMNotAdjusted,
//   getSumOfCont,
//   calculateNewBU,
//   getFinaladjNonAdjData,
//   getuserTrendsbyEmuForSlope,
//   getuserTrendsbyEmu,
//   getSumOfContMonthly,
//   getFpSourceVals,
//   getChartFormatedData,
//   getChartFormatedDataMonthly,
//   getUserTrendsData,
//   getUserTrendsDatafromSurvey,
//   getSurveyWiseData,
//   combinedComparisonEstimate,
//   comarisonEstimateColumnChart,
//   getadjNonAdjLineChart,
//   getadjNonAdjBarChart,
//   getMethodMixServicePie,
//   getSlopData,
//   getemuComparisonData,
//   emuOutputCompByMethod,
//   emuOutputUserByMethod,
// } from "./DataMassaging.js";
import dataM from "./DataMassaging.js";

export default {
  props: [
    "startP",
    "dqrConfig",
    "globeData",
    "loc",
    "deList",
    "defaultType",
    "dataElementList",
    "categoryOptionID",
    "methodCatId",
    "finalCount",
  ],
  mixins: [StaticColorMixin],
  data() {
    return {
      excludeAF: null,
      filter: {
        Commodities_Client: "inc",
        Commodities_Facilities: "inc",
        Users: "inc",
        Visits: "inc",
      },
      finalAnnualSavedCharts: {},
      annaulEMUChartsUpdated: false,
      monthlyEMUChartsSaved: false,
      mainmethodSeq: [],
      tableMethodSeq: [],
      monthlyMethodSeq: [],
      sYearArray: [],
      totalCyp: null,
      finalMethodArr: [],
      methodSeq: [],
      annualInputChartData: [],
      defaultLevelID: "",
      start: this.startP,
      annualStart: false,
      monthlyStart: false,
      locName: null,
      disableChart: null,
      popYear: "",
      sYear: "",
      userAdjustedDE: null,
      userUnadjustedDE: null,
      cocId: null,
      allCatOpt: null,
      startYear: null,
      endYear: null,
      sectorReporting: null,
      adjustmentData: null,
      adjNonAdjCalcData: null,
      repoRate: null,
      adjFlag: false,
      bgData: null,
      bgDataFound: false,
      gConfig: null,
      isGlobalConfig: false,
      bRequestFlag: false,
      annualEMU: null,
      deProcess: false,
      DataElementIDinc: null,
      DataElementIDex: null,
      DataElementIDUserAdj: null,
      DataElementIDUserUnAdj: null,
      deNameInc: "",
      deNameEx: "",
      deName: "",
      ////for monthly
      startYearM: null,
      //eslint-disable-next-line
      endYearM: null,
      sYearMonthly: "",
      population: null,
      monthlyPopulation: null,
      backgroundData: null,
      continuation: null,
      bRequestFlagMonthly: false,
      globalChartConfig: null,
      scaling: null,
      isChartConfigUpdated: false,
      users: null,
      newUsers: null,
      histUsers: null,
      monthlyEMU: null,
      DataElementID: null,
      totalEMUByMethod: null,
      totalEMUByMethodDEID: null,
      totalEMUByMethodDEName: null,
    };
  },
  watch: {
    annaulEMUChartsUpdated(newVal) {
      if (
        this.adjNonAdjCalcData &&
        this.annualEMU &&
        newVal === true &&
        this.monthlyEMUChartsSaved === true &&
        this.monthlyEMU &&
        Object.keys(this.monthlyEMU).length > 0
      ) {
        this.deProcess = true;
      }
    },
    monthlyEMUChartsSaved(newVal) {
      if (
        this.adjNonAdjCalcData &&
        this.annualEMU &&
        newVal === true &&
        this.annaulEMUChartsUpdated === true &&
        this.monthlyEMU &&
        Object.keys(this.monthlyEMU).length > 0
      ) {
        this.deProcess = true;
      }
    },
    startP(newVal) {
      this.start = newVal;
    },
    deProcess(newVal) {
      if (newVal) {
        this.fetchData();
      }
    },
    bRequestFlag(newVal) {
      if (newVal && (this.repoRate || this.disableChart)) {
        this.getInputChartsData();
        this.getOutComAdjustment(); //annual method
      }
    },
    bRequestFlagMonthly(newVal) {
      if (newVal === true && this.scaling && this.chartConfigUpdated === true) {
        this.getFinalChartsdata(); //monthly method
      }
    },
    monthlyStart(newval) {
      if (
        newval &&
        this.loc &&
        this.defaultType &&
        this.globeData &&
        this.dqrConfig &&
        !this.continuation
      ) {
        let configData = this.dqrConfig,
          defaultType = this.defaultType;
        let sStartYear = configData.emu_monthly[defaultType]["initialYear"];
        let populationYear =
          configData.emu_monthly.Background_Data.SSDataRecentYear * 1 + 1;
        this.startYearM = sStartYear;
        let curr_date = this.$moment().format("YYYY-MM");
        let months = configData["emu_monthly"][defaultType]["backTrackingMonth"]
          ? configData["emu_monthly"][defaultType]["backTrackingMonth"]
          : 1;
        let lYear = this.$moment(curr_date, "YYYY-MM")
          .subtract(months, "months")
          .format("YYYY");
        let lastYearMonth = this.$moment(curr_date, "YYYY-MM")
          .subtract(months, "months")
          .format("YYYYMM");
        this.endYearM = lYear;
        let startDate = this.$moment(sStartYear, "YYYY"),
          endDate = this.$moment(lYear).add(1, "year"),
          monthsArr = [];
        while (
          startDate.isBefore(this.$moment(lastYearMonth).add(1, "months"))
        ) {
          monthsArr.push(startDate.format("YYYYMM"));
          startDate.add(1, "month");
        }

        let sYearMonthly = monthsArr.join(";");
        this.sYearMonthly = sYearMonthly;
        this.monthContinuation(this.globeData, sStartYear, lYear, defaultType);
        this.getPopulationData(
          configData,
          this.loc,
          sStartYear,
          populationYear
        );
      }
    },

    annualStart(newVal) {
      if (this.annualStart && this.dqrConfig && this.globeData) {
        let configData = this.dqrConfig;
        let stYear = configData["emu"][this.defaultType]["initialYear"];
        let curr_date = this.$moment().format("YYYY-MM");
        let months = configData["emu"][this.defaultType]["backTrackingMonth"]
          ? configData["emu"][this.defaultType]["backTrackingMonth"]
          : 1;
        let lYear = this.$moment(curr_date, "YYYY-MM")
          .subtract(months, "months")
          .format("YYYY");
        this.startYear = stYear;
        this.endYear = lYear;
        let yrStr = dataM.getYearFormated(stYear, lYear);

        let bgLastYear =
          configData["emu"]["Background_Data"]["SSDataRecentYear"];
        let popYearStr = dataM.getYearFormated(stYear, bgLastYear * 1 + 1);
        console.log("population year", popYearStr);
        this.popYear = popYearStr;
        this.sYear = yrStr;
        let startDate = this.$moment(stYear, "YYYY"),
          endDate = this.$moment(lYear).add(1, "year"),
          monthsArr = [];
        let lastYearMonth = this.$moment(curr_date, "YYYY-MM")
          .subtract(months, "months")
          .format("YYYYMM");
        this.endYearM = lYear;
        while (
          startDate.isBefore(this.$moment(lastYearMonth).add(1, "months"))
        ) {
          monthsArr.push(startDate.format("YYYYMM"));
          startDate.add(1, "month");
        }

        let sYearMonthly = monthsArr.join(";");
        this.sYearMonthly = sYearMonthly;
        //calling annual basic functions
        if (this.sYear && this.loc && this.defaultType) {
          this.getCatOptCombo();
          this.getAllCatOptCombo();
          if (!this.disableChart) {
            this.getReportingRate(
              this.loc,
              this.dqrConfig,
              this.sYear,
              this.defaultType
            );
          }
          this.getAnnualSectorReporting(this.loc);
        }
      }
    },
    start(newVal) {
      if (this.startP) this.start = this.startP;
      if (newVal) this.setValues();
    },
  },
  methods: {
    saveJson(noalert = true) {
      //this.$store.commit("setLoading", true);
      let key = this.generateKey("dqrModule");
      service
        .updateConfig(this.dqrConfig, key, false, "fp-dashboard")
        .then((resp) => {
          if (resp.data.status === "OK") {
            //this.$store.commit("setLoading", false);
            if (noalert)
              this.sweetAlert({
                title: "Data updated successfully.",
              });
          }
        })
        .catch((err) => {
          service
            .saveConfig(this.dqrConfig, key, false, "fp-dashboard")
            .then((resp) => {
              if (resp.data.status === "OK") {
                // this.$store.commit("setLoading", false);
                if (noalert)
                  this.sweetAlert({
                    title: "Data saved successfully.",
                  });
              }
            })
            .catch((er) => {
              // this.$store.commit("setLoading", false);
              if (noalert)
                this.sweetAlert({
                  title: "Something went wrong. Please try again later.",
                });
            });
        });
    },
    async getDE(deList, dataEleName, catcomboid) {
      let isExistDEArAdj = deList.filter((obj) => {
        return obj["displayName"] === dataEleName;
      });
      if (isExistDEArAdj.length) {
        let actDEID = isExistDEArAdj[0]["id"];
        // setActDEIDInc(actDEID);
        return actDEID;
      } else {
        await service.getOrgLevels().then((orgResp) => {
          if (orgResp.data && orgResp.data.organisationUnitLevels.length) {
            let orgLevels = [];
            orgResp.data.organisationUnitLevels.forEach((oj) => {
              if (!orgLevels.includes(oj.level)) orgLevels.push(oj.level);
            });
            let createJson = {
              aggregationType: "SUM",
              domainType: "AGGREGATE",
              valueType: "NUMBER",
              name: dataEleName,
              shortName: dataEleName,
              categoryCombo: { id: catcomboid },
              legendSets: [],
              aggregationLevels: orgLevels,
            };
            service
              .createDE(createJson)
              .then((resp) => {
                if (
                  resp.data.status === "OK" &&
                  resp.data.httpStatus === "Created"
                ) {
                  let actDEID = resp.data.response["uid"];
                  return actDEID;
                }
              })
              .catch((res) => {
                return null;
              });
          }
        });
      }
    },
    async uploadFile() {
      let selectedLoc = this.loc;
      let finalIncJson = {
        dataValues: [],
      };
      let monthlyEMUbyMethod = this.totalEMUByMethod;
      Object.keys(monthlyEMUbyMethod).forEach((method) => {
        let innerObj = monthlyEMUbyMethod[method];
        Object.keys(innerObj).forEach((year) => {
          let val = innerObj[year];
          if (year !== "name" && year !== "subname") {
            //  Object.keys(actObj).forEach((subMethod) => {
            let singleCat = this.allCatOpt.filter(
              (obj) => obj.displayName === method
            );
            if (singleCat.length > 0) {
              let innerObj = {
                dataElement: this.totalEMUByMethodDEID,
                period: year,
                orgUnit: selectedLoc.split("/")[1],
                categoryOptionCombo: singleCat[0]["id"], //"HllvX50cXC0"
                attributeOptionCombo: singleCat[0]["id"],
                value: val,
              };
              finalIncJson["dataValues"].push(innerObj);
            } else {
              console.log(
                "data not uploaded for method " +
                  subM +
                  " as Category Option Combo not craeted"
              );
            }

            // });
          }
        });
      });

      let adjNonAdjCalcData = this.adjNonAdjCalcData,
        annualEMU = this.annualEMU,
        monthlyEMU = this.monthlyEMU;

      Object.keys(adjNonAdjCalcData.adjusted).forEach((method) => {
        let innerObj = adjNonAdjCalcData.adjusted[method];
        Object.keys(innerObj).forEach((year) => {
          let actObj = innerObj[year];
          Object.keys(actObj).forEach((subMethod) => {
            let subM = subMethod.split("/")[1];
            let val = actObj[subMethod];
            let singleCat = this.allCatOpt.filter(
              (obj) => obj.displayName === subM
            );
            if (singleCat.length > 0) {
              let innerObj = {
                dataElement: this.DataElementIDUserAdj,
                period: year,
                orgUnit: selectedLoc.split("/")[1],
                categoryOptionCombo: singleCat[0]["id"], //"HllvX50cXC0"
                attributeOptionCombo: singleCat[0]["id"],
                value: val,
              };
              finalIncJson["dataValues"].push(innerObj);
            } else {
              console.log(
                "data not uploaded for method " +
                  subM +
                  " as Category Option Combo not craeted"
              );
            }
          });
        });
      });
      Object.keys(adjNonAdjCalcData.nonAdjusted).forEach((method) => {
        let innerObj = adjNonAdjCalcData.nonAdjusted[method];
        Object.keys(innerObj).forEach((year) => {
          let actObj = innerObj[year];
          Object.keys(actObj).forEach((subMethod) => {
            let subM = subMethod.split("/")[1];
            let val = actObj[subMethod];
            let singleCat = this.allCatOpt.filter(
              (obj) => obj.displayName === subM
            );
            if (singleCat.length > 0) {
              let innerObj = {
                dataElement: this.DataElementIDUserUnAdj,
                period: year,
                orgUnit: selectedLoc.split("/")[1],
                categoryOptionCombo: singleCat[0]["id"], //"HllvX50cXC0"
                attributeOptionCombo: singleCat[0]["id"],
                value: val,
              };
              finalIncJson["dataValues"].push(innerObj);
            } else {
              console.log(
                "data not uploaded for method " +
                  subM +
                  " as Category Option Combo not craeted"
              );
            }
          });
        });
      });
      Object.keys(annualEMU["incCondom"]["data"]).forEach((period) => {
        let value = annualEMU["incCondom"]["data"][period];
        let innerObj = {
          dataElement: this.DataElementIDinc,
          period: period,
          orgUnit: selectedLoc.split("/")[1],
          categoryOptionCombo: this.cocId, //"HllvX50cXC0"
          attributeOptionCombo: this.cocId,
          value: value,
        };
        finalIncJson["dataValues"].push(innerObj);
      });
      console.log(annualEMU, "annualEMU");
      Object.keys(annualEMU["exCondom"]["data"]).forEach((period) => {
        let value = annualEMU["exCondom"]["data"][period];
        let innerObj = {
          dataElement: this.DataElementIDex,
          period: period,
          orgUnit: selectedLoc.split("/")[1],
          categoryOptionCombo: this.cocId,
          attributeOptionCombo: this.cocId,
          value: value,
        };
        finalIncJson["dataValues"].push(innerObj);
      });
      console.log(monthlyEMU, "monthlyEMU");

      Object.keys(monthlyEMU).forEach((period) => {
        if (period !== "name" && period !== "subname") {
          let value = monthlyEMU[period];
          let innerObj = {
            dataElement: this.DataElementID,
            period: period,
            orgUnit: selectedLoc.split("/")[1],
            categoryOptionCombo: this.cocId,
            attributeOptionCombo: this.cocId,
            value: String(value),
          };
          finalIncJson["dataValues"].push(innerObj);
        }
      });
      await service
        .uploadJson(finalIncJson)
        .then((resp) => {
          if (resp && resp.data && resp.data.status === "OK") {
            return resp;
          } else {
            this.stopProcessing(
              selectedLoc,
              "JSON File not imported Successfully",
              this.defaultType
            );
          }
        })
        .then((resp) => {
          let uploadID = resp.data.response["id"];
          service
            .showTask(uploadID)
            .then((tResp) => {
              return tResp;
            })
            .then(() => {
              service.showTaskSumm(uploadID).then((taskResp) => {
                if (
                  taskResp &&
                  taskResp.data &&
                  taskResp.data.status === "SUCCESS"
                ) {
                  this.stopProcessing(selectedLoc, "", this.defaultType);
                  // swal.fire({
                  //   title: "Include condom Data imported successfully into Data element",
                  //   icon: "success",
                  // }).then(() => {
                  //   //handleClose()
                  // });
                } else {
                  this.stopProcessing(selectedLoc, "", this.defaultType);
                  // swal.fire({
                  //   title: "Include condom Data not imported successfully. Please try again later.",
                  //   icon: "success",
                  // }).then(() => {
                  //   //handleClose()
                  // });
                }
              });
            });
        })
        .catch((err) => {
          //console.log(err);
        });
    },
    async fetchData() {
      if (
        this.deList &&
        this.deNameInc &&
        this.deNameEx &&
        this.deName &&
        this.userAdjustedDE &&
        this.userUnadjustedDE
      ) {
        //for useradjusted
        let annualDEArr = [],
          monthlyDEArr = [];

        if (this.methodCatId) {
          this.totalEMUByMethodDEID = await this.getDE(
            this.deList,
            this.totalEMUByMethodDEName,
            this.methodCatId
          );
          monthlyDEArr.push({
            name: this.totalEMUByMethodDEName,
            DEID: this.totalEMUByMethodDEID,
            type: "Monthly EMU Method Wise",
          });
          this.DataElementIDUserAdj = await this.getDE(
            this.deList,
            this.userAdjustedDE,
            this.methodCatId
          );
          annualDEArr.push({
            name: this.userAdjustedDE,
            DEID: this.DataElementIDUserAdj,
            type: "Adjusted Data Element",
          });

          this.DataElementIDUserUnAdj = await this.getDE(
            this.deList,
            this.userUnadjustedDE,
            this.methodCatId
          );
          annualDEArr.push({
            name: this.userUnadjustedDE,
            DEID: this.DataElementIDUserUnAdj,
            type: "Unadjusted Data Element",
          });
        }
        if (!this.methodCatId) {
          console.log("Category combo not created for methods in DHIS2");
        }
        this.DataElementIDinc = await this.getDE(
          this.deList,
          this.deNameInc,
          this.categoryOptionID
        );
        annualDEArr.push({
          name: this.deNameInc,
          DEID: this.DataElementIDinc,
          type: "EMU - Include Condom",
        });
        this.DataElementIDex = await this.getDE(
          this.deList,
          this.deNameEx,
          this.categoryOptionID
        );
        annualDEArr.push({
          name: this.deNameEx,
          DEID: this.DataElementIDex,
          type: "EMU - Exclude Condom",
        });
        this.DataElementID = await this.getDE(
          this.deList,
          this.deName,
          this.categoryOptionID
        );
        monthlyDEArr.push({
          name: this.deName,
          DEID: this.DataElementID,
          type: "Monthly EMU",
        });
        this.dqrConfig.emu[this.defaultType]["annualDE"] = annualDEArr;
        this.dqrConfig.emu[this.defaultType]["monthlyDE"] = monthlyDEArr;

        if (this.DataElementIDinc && this.DataElementIDex && this.DataElementID)
          this.uploadFile();
        else {
          console.log("Data not uploaded into DHIS 2");
          this.stopProcessing(
            this.loc,
            "EMU Data not uploaded into DHIS 2 as data element not created",
            this.defaultType
          );
        }
      }
    },
    monthContinuation(globData, startYearM) {
      let type = this.defaultType;
      let oContTrend = {},
        oMonthContinuation = {};
      let cat = type;
      oContTrend[cat] = {};
      oMonthContinuation[cat] = {};
      Object.keys(globData.continuation[cat]).forEach((key) => {
        let oContVal = {};
        let len = Object.keys(
          globData.continuation[cat][key]["continuation"]
        ).length;
        for (let i = 0; i < len; i++) {
          var last =
            i !== len - 1
              ? globData.continuation[cat][key]["continuation"][i + 1]
              : 0;
          let value =
            (globData.continuation[cat][key]["continuation"][i] - last) / 12;
          oContVal[i] = value;
        }
        oContTrend[cat][key] = oContVal;
      });
      Object.keys(globData.continuation[cat]).forEach((key) => {
        let j = 0;
        let conObj = {},
          count;
        let nStart = startYearM * 1,
          nEnd = nStart + 11,
          bisShortTerm =
            globData.continuation[cat][key]["type"] === "Short Term",
          nCount = 0;
        for (let i = nStart; i < nEnd; i++) {
          for (let month = 1; month <= 12; month++) {
            if (month === 1 && !bisShortTerm) {
              count = globData.continuation[cat][key]["continuation"][j] * 1;
              if (
                i === nEnd - 1 &&
                (key === "Tubal Ligation (F)" || key === "Vasectomy (M)")
              ) {
                count = 0;
              }
            } else {
              if (!bisShortTerm) {
                count =
                  month === 1
                    ? globData.continuation[cat][key]["continuation"][j] * 1
                    : count - oContTrend[cat][key][j];
                if (
                  count !== 1 &&
                  (key === "Tubal Ligation (F)" || key === "Vasectomy (M)")
                ) {
                  count = 0;
                } else if (i === nEnd - 1 && month === 12) {
                  count = 0;
                }
              } else if (nCount < 12 && bisShortTerm) {
                count =
                  globData.continuation[cat][key]["continuation"][nCount] * 1;
              } else {
                count = 0;
              }
            }
            month < 10
              ? (conObj[i + "0" + month] = count.toFixed(3) * 1)
              : (conObj[i + "" + month] = count.toFixed(3) * 1);
            nCount++;
          }
          j++;
        }
        oMonthContinuation[cat][key] = conObj;
      });
      this.continuation = oMonthContinuation;
    },
    async getPopulationData(configData, loc, startYearM, endYearM) {
      let selectedLoc = loc;
      let locationID = selectedLoc.split("/")[1];

      let categoryData = configData.emu_monthly;

      let allYear = dataM.getYearFormatedMonthly(startYearM, endYearM * 1 + 1);
      let aBackgorundIndicators = categoryData["Background_Data"][
        "backgroundIndicators"
      ]
        ? categoryData["Background_Data"]["backgroundIndicators"]
        : [];
      let aSelectedDEs = [],
        sSelectedDEs = "";
      aBackgorundIndicators[0].subIndicators.forEach((ind) => {
        ind.selectedDE.forEach((de) => {
          aSelectedDEs.push(de.id);
        });
      });
      sSelectedDEs = aSelectedDEs.join(";");

      let fromDataStore = categoryData["Background_Data"]["bgDataSource"]
        ? categoryData["Background_Data"]["bgDataSource"]
        : "Datastore";
      let innerDataStore = categoryData["Background_Data"][
        "backgroundIndicators"
      ][0]["bgDataSource"]
        ? categoryData["Background_Data"]["backgroundIndicators"][0][
            "bgDataSource"
          ]
        : fromDataStore;
      if (innerDataStore === "Datastore") {
        let levelid = selectedLoc.split("/")[0];
        let popType = categoryData["Background_Data"]["FPWomenPopulation"]
          ? categoryData["Background_Data"]["FPWomenPopulation"]
          : "MWRA";
        popType = popType.toLowerCase();
        let key = `population_${popType}_${levelid}`;

        let popObj = {};
        if (!this.population) {
          await service
            .getSavedConfig(key, false, "fp-dashboard")
            .then(async (popResp) => {
              let popResponse =
                popResp && typeof popResp.data.rows === "string"
                  ? {
                      ...popResp.data,
                      rows: decompress(JSON.parse(popResp.data.rows)),
                    }
                  : popResp.data;

              let newpopResponse = popResponse.rows.filter(
                (arr) => arr[2] === locationID
              );
              newpopResponse.forEach((data) => {
                popObj[data[1]] = data[3] * 1;
              });
              console.log(popResponse, newpopResponse);

              this.population = popObj;
            })
            .catch((res) => {});
        } else {
          popObj = this.population;
        }
        console.log(popObj, "popObj");
        let oPopulation = {};
        // Object.keys(popObj).forEach((key) => {
        let oContVal = {};
        let len = Object.keys(popObj).length;
        let keys = Object.keys(popObj);
        for (let i = 0; i < len; i++) {
          var last = i !== len - 1 ? popObj[keys[i + 1]] : 0;
          if (last !== 0) {
            let value = (popObj[keys[i]] - last) / 12;
            oContVal[keys[i]] = 0 - value;
          }
        }
        oPopulation = oContVal;
        // });
        let oMonthPopulation = {};
        Object.keys(popObj).forEach((key) => {
          var count;
          if (oPopulation[key]) {
            for (let month = 1; month <= 12; month++) {
              if (month === 1) {
                count = popObj[key];
              } else {
                count = count + (oPopulation[key] ? oPopulation[key] : 0);
              }
              month < 10
                ? (oMonthPopulation[key + "0" + month] = Math.round(count))
                : (oMonthPopulation[key + "" + month] = Math.round(count));
            }
          }
        });
        this.monthlyPopulation = oMonthPopulation;
      } else {
        let popObj = {};

        if (!this.population) {
          await service
            .getAnalyticalIndicatorData(
              sSelectedDEs,
              selectedLoc.split("/")[1],
              allYear
            )
            .then((response) => {
              if (response.data.rows.length) {
                response.data.rows.forEach((data) => {
                  popObj[data[1]] = data[3] * 1;
                });
              } else {
              }
            })
            .catch((res) => {
              // this.showAlert();
              // this.bShowLoader = false;
            });
        } else {
          popObj = this.population;
        }
        let oPopulation = {};
        // Object.keys(popObj).forEach((key) => {
        let oContVal = {};
        let len = Object.keys(popObj).length;
        let keys = Object.keys(popObj);
        for (let i = 0; i < len; i++) {
          var last = i !== len - 1 ? popObj[keys[i + 1]] : "NA";
          if (last !== "NA") {
            let value = (popObj[keys[i]] - last) / 12;
            oContVal[keys[i]] = 0 - value;
          }
        }
        oPopulation = oContVal;
        // });

        let oMonthPopulation = {};
        Object.keys(popObj).forEach((key) => {
          var count;
          if (oPopulation[key] != null) {
            for (let month = 1; month <= 12; month++) {
              if (month === 1) {
                count = popObj[key];
              } else {
                count = count + (oPopulation[key] ? oPopulation[key] : 0);
              }
              month < 10
                ? (oMonthPopulation[key + "0" + month] = Math.round(count))
                : (oMonthPopulation[key + "" + month] = Math.round(count));
            }
          }
        });
        this.monthlyPopulation = oMonthPopulation;
      }

      if (this.monthlyPopulation && this.population) {
        console.log(
          this.monthlyPopulation,
          this.population,
          "this.monthlyPopulation && this.population"
        );
        this.getMonthlyBackgrounData();
        this.generateFormatedData();
      }
    },
    async getMonthlyBackgrounData() {
      let selectedLoc = this.loc;
      let categoryData = this.dqrConfig;
      let fromDataStore = categoryData.emu_monthly.Background_Data[
        "bgDataSource"
      ]
        ? categoryData.emu_monthly.Background_Data["bgDataSource"]
        : false;
      let backData =
          categoryData.emu_monthly.Background_Data.fpSourceIndicators,
        sLocId = selectedLoc.split("/")[1];

      let sYear = this.sYearMonthly;
      let oData = {};

      if (fromDataStore === "Datastore") {
        let levelid = selectedLoc.split("/")[0];
        // let popType = categoryData.emu_monthly.Background_Data["FPWomenPopulation"]?categoryData.emu_monthly.Background_Data["FPWomenPopulation"]:"MWRA";
        //popType = popType.toLowerCase();
        let key = `prevalence_${levelid}`;
        //for India
        // if (!settings.country) {
        //   let appId = this.$store.state.appId ? this.$store.state.appId : "",
        //     appUserId = this.$store.state.appUserId
        //       ? this.$store.state.appUserId
        //       : "";
        //   if (appId && appUserId) {
        //     key = `prevalence_${levelid}`;
        //   } else {
        //     this.showLocalStorageError();
        //     return;
        //   }
        // }
        await service
          .getSavedConfig(key, false, "fp-dashboard")
          .then(async (backResp) => {
            let backResponse =
              backResp && typeof backResp.data.rows === "string"
                ? {
                    ...backResp.data,
                    rows: decompress(JSON.parse(backResp.data.rows)),
                  }
                : backResp.data;
            backData.forEach((key) => {
              //nNumber++;

              key["subIndicators"].forEach((de) => {
                let sKey =
                  typeof de.static_name == "object"
                    ? de.static_name[this.$i18n.locale]
                    : de.static_name;

                if (!oData[sKey]) {
                  oData[sKey] = {};
                }
                let ids = [],
                  dName = {};

                Object.keys(de["selectedDatastoreDE"]).forEach((sde) => {
                  ids.push(de["selectedDatastoreDE"][sde]["id"]);
                  dName[de["selectedDatastoreDE"][sde]["id"]] =
                    typeof de["selectedDatastoreDE"][sde][
                      "static_displayName"
                    ] == "object"
                      ? de["selectedDatastoreDE"][sde]["static_displayName"][
                          this.$i18n.locale
                        ]
                      : de["selectedDatastoreDE"][sde]["static_displayName"];
                });
                if (ids.length) {
                  Object.keys(dName).forEach((name) => {
                    let statName = dName[name];
                    let findInData = backResponse.rows.filter((obj) => {
                      if (obj[0] === name && obj[2] === sLocId) return obj;
                      else return null;
                    });
                    if (findInData && findInData.length) {
                      let firstYear = findInData[0][1] * 1;
                      findInData.forEach((obj) => {
                        let year = obj[1] * 1;
                        if (year >= firstYear) {
                          firstYear = year;
                          oData[sKey][statName] = oData[sKey][statName] || {
                            name: key.static_name,
                            vals: {},
                          };
                          oData[sKey][statName]["vals"][obj[1]] =
                            (oData[sKey][statName]["vals"][obj[1]] || 0) +
                            obj[3] * 1;
                        }
                      });
                    }
                  });
                }
              });
            });
            //this.backgroundData = oData
            this.backgroundData = oData;
          })
          .catch((res) => {
            //console.log(res);
            //this.showAlert();
            //this.bShowLoader = false;
          });
      } else {
        backData.forEach((key) => {
          key["subIndicators"].forEach(async (de) => {
            let sKey =
              de.static_name == "object"
                ? de.static_name[this.$i18n.locale]
                : de.static_name;

            if (!oData[sKey]) {
              oData[sKey] = {};
            }
            let ids = [],
              dName = [];

            Object.keys(de["selectedDE"]).forEach((sde) => {
              ids.push(de["selectedDE"][sde]["id"]);
              //updatedName is replaced with static_displayName on 27 march 2023
              dName.push({
                [de["selectedDE"][sde]["id"]]:
                  typeof de["selectedDE"][sde]["static_displayName"] == "object"
                    ? de["selectedDE"][sde]["static_displayName"][
                        this.$i18n.locale
                      ]
                    : de["selectedDE"][sde]["static_displayName"],
              });
            });
            let sdes = ids.join(";");
            if (ids.length) {
              await service
                .getAnalyticalIndicatorData(sdes, sLocId, sYear)
                .then((response) => {
                  Object.keys(dName).forEach((d) => {
                    response.data.rows.forEach((row) => {
                      let oRow = dName[d][row[0]];
                      if (oRow) {
                        let sRowName = oRow;
                        oData[sKey][sRowName] = oData[sKey][sRowName] || {
                          name: key.static_name,
                          vals: {},
                        };
                        oData[sKey][sRowName]["vals"][row[1]] =
                          (oData[sKey][sRowName]["vals"][row[1]] || 0) +
                          row[3] * 1;
                      }
                    });
                  });
                })
                .catch((res) => {});
            }
          });
        });
        this.backgroundData = oData;
      }
    },
    generateFormatedData() {
      let { levelID } = service.getAllowedLocation();

      //let locationID = locationID;
      this.defaultLevelID = levelID;
      let type = this.defaultType;
      let selectedLoc = this.loc;
      let oRet = dataM.getFormatedData(
        this.dqrConfig.emu[type],
        this.$store.getters.getApplicationModule(
          this.$store.getters.getIsMultiProgram
        ),
        this.startYear,

        this.bgData.cyp[type],
        this.bgData.continuation[type]
      );
      let globalConfig = oRet.data;
      console.log(globalConfig, "globalConfig");
      this.totalCyp = oRet.totalCYP;
      this.finalMethodArr = oRet.finalMethodArr;
      this.methodSeq = oRet.methodSeq;
      this.mainmethodSeq = oRet.mainmethodSeq;
      this.tableMethodSeq = oRet.tableMethodSeq;
      this.monthlyMethodSeq = oRet.monthlyMethodSeq;
      this.$store.commit("setEMUColors", oRet.emuColors);

      this.gConfig = globalConfig;
      if (globalConfig.chartArr.length) {
        this.isGlobalConfig = true;
        if (this.isGlobalConfig === true && this.gConfig)
          this.getAllDataelemsData(this.gConfig);
      }
    },
    getInputChartsData() {
      let aChartArr = this.gConfig.chartArr,
        i,
        nLen = aChartArr.length,
        aFinalCharts = [],
        ochartConfig = {
          type: this.gConfig.type,
          xTitle: this.gConfig.xTitle || "",
          yTitle: this.gConfig.yTitle || "",
          //visible:this.globalConfig.visible,
        };

      for (i = 0; i < nLen; i++) {
        aFinalCharts.push(dataM.getFinalChartData(aChartArr[i], ochartConfig));
      }

      aFinalCharts.push(
        dataM.getFinalTotalCYP(
          dataM.getTotalCYP(aChartArr),
          ochartConfig,
          this.totalCyp
        )
      );

      this.annualInputChartData = aFinalCharts;
      trimUndefinedRecursively(this.annualInputChartData);
      this.finalAnnualSavedCharts["inputCharts"] = [];
      this.finalAnnualSavedCharts["inputCharts"] = JSON.stringify(
        compress(this.annualInputChartData)
      );
    },
    async getAllDataelemsData() {
      let selectedLoc = this.loc;
      let gConfig = this.gConfig;

      let newPeriodStr = this.sYear.concat(";", this.sYearMonthly);

      let i,
        aChart = gConfig.chartArr,
        ncLen = aChart.length,
        sLocId = selectedLoc.split("/")[1],
        nFlag1 = 0,
        nFlag2 = 0,
        noDataCount = 0;
      let showAlert = false;
      let alertSt = "";
      let scallingOj = {};
      // this.getReportingRate(sLocId, sYear);
      for (i = 0; i < ncLen; i++) {
        let dataEle = aChart[i].dataElems;
        let j;
        for (j in dataEle) {
          scallingOj[dataEle[j].trans_name] = dataEle[j].scaling;

          if (dataEle[j].selectedDE.length) nFlag1++;
        }
      }
      for (i = 0; i < ncLen; i++) {
        let j,
          aDe = aChart[i].dataElems;
        for (j in aDe) {
          // let sdes = aDe[j].de.join(";"),
          let sdes = [],
            nI = i,
            nJ = j;
          aDe[j].selectedDE.forEach((obj) => {
            sdes.push(obj.id);
          });
          if (!aDe[j].selectedDE.length) {
            continue;
          }
          nFlag2++;
          let subinpName = aDe[j].name;
          await service
            .getAnalyticalIndicatorData(sdes.join(";"), sLocId, newPeriodStr)
            .then(async (response) => {
              if (
                response !== undefined &&
                response.data &&
                response.data.rows.length
              ) {
                if (!aChart[nI].charts) {
                  aChart[nI].charts = {};
                }
                if (!aChart[nI].monthlyCharts) {
                  aChart[nI].monthlyCharts = {};
                }
                if (!aChart[nI].scaling) {
                  aChart[nI].scaling = {};
                }

                aChart[nI].charts = dataM.getChartFormatedData(
                  response.data.rows,
                  aChart[nI].dataElems[nJ],
                  aChart[nI].charts,
                  this.sYear
                );
                aChart[nI].monthlyCharts = dataM.getChartFormatedDataMonthly(
                  response.data,
                  aChart[nI].dataElems[nJ],
                  aChart[nI].monthlyCharts,
                  this.sYearMonthly
                );
              } else {
                noDataCount++;
                showAlert = true;
                console.log("No data for " + subinpName);
                alertSt += subinpName + " <br/>";
              }
            })
            .catch((res) => {
              console.log(res);
              // this.showAlert();
            });
        }
      }
      console.log(
        "final annual chartArr ==============",
        JSON.parse(JSON.stringify(this.gConfig)),
        JSON.parse(JSON.stringify(gConfig))
      );

      if (nFlag1 === nFlag2 && nFlag1 !== 0) {
        this.bRequestFlag = true;
        this.scaling = scallingOj;
        this.chartConfigUpdated = true;
        this.bRequestFlagMonthly = true;

        //setStatus("Input data fetched.")
        showAlert = false;

        //   this.bshowLoader=false;
      }
      if (nFlag1 === noDataCount) {
        console.log(
          "location" + selectedLoc + " Error NO Data found for -" + alertSt
        );
        this.stopProcessing(selectedLoc, "No data found", this.defaultType);
      }
    },
    getOtherChartDeatils(emutype, obj, index, type) {
      let chartConfigObj =
        emutype === "Output"
          ? this.dqrConfig["emu"][emutype]
          : this.dqrConfig[emutype][this.defaultType];
      obj.title =
        typeof chartConfigObj["derivedCharts"][index]["chartOptions"][
          "chartName"
        ] == "object"
          ? chartConfigObj["derivedCharts"][index]["chartOptions"]["chartName"][
              this.$i18n.locale
            ]
          : chartConfigObj["derivedCharts"][index]["chartOptions"]["chartName"];
      obj.source = "";
      obj.xTitle =
        typeof chartConfigObj["derivedCharts"][index]["chartOptions"]["xAxis"][
          "text"
        ] == "object"
          ? chartConfigObj["derivedCharts"][index]["chartOptions"]["xAxis"][
              "text"
            ][this.$i18n.locale]
          : chartConfigObj["derivedCharts"][index]["chartOptions"]["xAxis"][
              "text"
            ];
      obj.yTitle =
        typeof chartConfigObj["derivedCharts"][index]["chartOptions"]["yAxis"][
          "text"
        ] == "object"
          ? chartConfigObj["derivedCharts"][index]["chartOptions"]["yAxis"][
              "text"
            ][this.$i18n.locale]
          : chartConfigObj["derivedCharts"][index]["chartOptions"]["yAxis"][
              "text"
            ];
      obj.disable =
        chartConfigObj["derivedCharts"][index]["chartOptions"]["disableChart"];
      obj.cid = chartConfigObj["derivedCharts"][index]["chartOptions"]["cid"];
      obj.chartInfo =
        typeof chartConfigObj["derivedCharts"][index]["chartOptions"][
          "chartInfo"
        ] == "object"
          ? chartConfigObj["derivedCharts"][index]["chartOptions"]["chartInfo"][
              this.$i18n.locale
            ]
          : chartConfigObj["derivedCharts"][index]["chartOptions"]["chartInfo"];

      obj.reportChartType = type === "stacked" ? "column_stack" : type;
      obj.type = type;
      return obj;
    },
    getOutComAdjustment() {
      let chartObj = [],
        outputChartObj = {};
      let type = this.defaultType,
        bgData = this.bgData;
      this.sYearArray = this.sYear.split(";");

      let allMethodsAdjusted = { adjusted: {}, nonAdjusted: {} };

      let oAdjustmentFactors =
        bgData.adjustmentFactorTypeWise[type] || bgData.adjustmentFactor;
      let oSTMAdjusment = dataM.calculateSTMNotAdjusted(
        this.gConfig.chartArr,
        this.repoRate,
        oAdjustmentFactors,
        this.disableChart
      );
      console.log(
        this.defaultType,
        "Short term methods calculation",
        oSTMAdjusment
      );
      let aSumOfCont = dataM.getSumOfCont(bgData.continuation[type]);
      let continuation = {};
      Object.keys(bgData.continuation[type]).forEach((cont) => {
        continuation[cont] = [];
        Object.keys(bgData.continuation[type][cont]["continuation"]).forEach(
          (val) => {
            continuation[cont].push(
              bgData.continuation[type][cont]["continuation"][val]
            );
          }
        );
      });

      let newBaseLineUsers = dataM.calculateNewBU(
        this.gConfig.chartArr,
        aSumOfCont,
        this.repoRate,
        oAdjustmentFactors,
        continuation,
        this.disableChart
      );

      allMethodsAdjusted.adjusted = Object.assign(
        oSTMAdjusment.adjusted,
        newBaseLineUsers.adjusted
      );
      allMethodsAdjusted.nonAdjusted = Object.assign(
        oSTMAdjusment.nonAdjusted,
        newBaseLineUsers.nonAdjusted
      );
      console.log("allMethodsAdjusted", allMethodsAdjusted);
      this.adjNonAdjCalcData = allMethodsAdjusted;

      let adjNonAdjData = dataM.getFinaladjNonAdjData(allMethodsAdjusted);
      console.log("adjNonAdjData", adjNonAdjData);
      let methodWiseAdjObject = adjNonAdjData.adjusted;
      let userTrendsbyEmu = dataM.getuserTrendsbyEmu(
        this.sYear,
        methodWiseAdjObject,
        bgData.population
      );
      this.annualEMU = userTrendsbyEmu;

      // Outputchart craetion start
      let oUserTrends = dataM.getUserTrendsData(
        this.tabName,
        this.finalMethodArr,
        this.sYearArray,
        methodWiseAdjObject
      );
      let outPutTrendsChart = this.getOtherChartDeatils(
        "emu",
        oUserTrends,
        0,
        ""
      );
      let newData = [];
      oUserTrends.data.forEach((m) => {
        this.methodSeq.forEach((v, i) => {
          if (m["name"] == v) {
            newData[i] = m;
          }
        });
      });

      oUserTrends.data = newData.filter(function (el) {
        return el != null && el != "";
      });
      outPutTrendsChart = oUserTrends;
      outputChartObj["outPutTrendsChart"] = outPutTrendsChart;

      // if (this.getData) {
      //   this.getData(
      //     this.tabName,
      //     this.outPutTrendsChart,
      //     "userTrendsBymethods",
      //     this.filter
      //   );
      // }

      let unpdData = {},
        unpdtext = "fpet";
      if (this.defaultLevelID == this.loc.split("/")[0]) {
        unpdData = this.bgData.FPET;
        unpdtext = "fpet";
      } else {
        unpdData = this.bgData.FPET;
        unpdtext = "fpet";
      }
      let oMethodMix = this.bgData.methodMix,
        oPopulation = this.bgData.population;

      let surveyData = dataM.getSurveyWiseData(
        this.sYearArray,
        this.finalMethodArr,
        unpdData,
        oMethodMix,
        oPopulation
      );
      outputChartObj["surveyData"] = surveyData;
      // outputChartObj["filter"] = this.filter;
      outputChartObj["finalMethodArr"] = this.finalMethodArr;
      // if (this.getData) {
      //   this.getData(this.tabName, surveyData, "surveyData", this.filter);
      // }
      // if (this.getData) {
      //   this.getData(
      //     this.tabName,
      //     this.finalMethodArr,
      //     "finalMethodArr",
      //     this.filter
      //   );
      // }

      //comparison estimate chart calculation
      let combinedComparisonEstimateChart = dataM.combinedComparisonEstimate(
        this.endYear,
        [...this.finalMethodArr],
        this.sYearArray,
        methodWiseAdjObject,
        surveyData
      );
      let comparisionEstimateData = this.getOtherChartDeatils(
        "emu",
        combinedComparisonEstimateChart,
        1,
        "bar"
      );
      outputChartObj["comparisionEstimateData"] = comparisionEstimateData;

      //Column chart for comparison estimate chart
      let MordernUsersByMethodsData = dataM.comarisonEstimateColumnChart(
        this.endYear,
        this.finalMethodArr,
        this.sYearArray,
        methodWiseAdjObject,
        surveyData,
        this.staticColors
      );
      MordernUsersByMethodsData = this.getOtherChartDeatils(
        "emu",
        MordernUsersByMethodsData,
        2,
        "column"
      );
      outputChartObj["MordernUsersByMethodsData"] = MordernUsersByMethodsData;

      let adjNonAdjLineChart = dataM.getadjNonAdjLineChart(
        this.sYearArray,
        this.finalMethodArr,
        adjNonAdjData,
        surveyData,
        this.staticColors
      );
      let lineAdNonAdChartData = this.getOtherChartDeatils(
        "emu",
        adjNonAdjLineChart,
        8,
        "line"
      );
      outputChartObj["lineAdNonAdChartData"] = lineAdNonAdChartData;

      let adjNonAdjBarChart = dataM.getadjNonAdjBarChart(
        this.endYear,
        this.sYearArray,
        [...this.finalMethodArr],
        adjNonAdjData,
        surveyData
      );
      let adNonadChartData = this.getOtherChartDeatils(
        "emu",
        adjNonAdjBarChart,
        9,
        "bar"
      );
      outputChartObj["adNonadChartData"] = adNonadChartData;

      let methodMixService = dataM.getMethodMixServicePie(
        this.endYear,
        this.finalMethodArr,
        this.sYearArray,
        methodWiseAdjObject,
        this.bgData.methodMix
      );
      let MixComparisionData = this.getPieChart(methodMixService);
      outputChartObj["MixComparisionData"] = MixComparisionData;

      let dhsData = this.bgData.DHS ? this.bgData.DHS : {};
      let pmaData = this.bgData.PMA ? this.bgData.PMA : {};
      let bAllWomen =
        this.dqrConfig.emu["Background_Data"]["FPWomenPopulation"] === "WRA";
      let userTrendsByMethodSurvey = dataM.getUserTrendsDatafromSurvey(
        this.sYearArray,
        unpdData,
        dhsData,
        pmaData,
        bAllWomen,
        this.bgData["bgIndColor"],
        unpdtext
      );
      let aSource = {
        Commodities_Client: this.$i18n.t("commodities_to_clients"),
        Visits: this.$i18n.t("fp_visits"),
        Commodities_Facilities: this.$i18n.t("commodities_to_facility"),
        User: this.$i18n.t("fp_users"),
      };
      userTrendsbyEmu = dataM.getuserTrendsbyEmuForSlope(
        this.sYearArray,
        methodWiseAdjObject,
        oPopulation,
        userTrendsByMethodSurvey,
        aSource[this.defaultType],
        this.staticColors
      );
      let userTrendsByMethod = this.getOtherChartDeatils(
        "emu",
        userTrendsbyEmu,
        4,
        "line"
      );
      outputChartObj["userTrendsByMethod"] = userTrendsByMethod;

      let slopeData = dataM.getSlopData(userTrendsbyEmu);
      let comparisionSlope = this.getOtherChartDeatils(
        "emu",
        slopeData,
        5,
        "bar"
      );
      outputChartObj["comparisionSlope"] = comparisionSlope;
      outputChartObj["methodWiseAdjObject"] = methodWiseAdjObject;
      outputChartObj["userTrendsbyEmu"] = userTrendsbyEmu;
      outputChartObj["allMethodsAdjusted"] = allMethodsAdjusted;

      chartObj.push(outputChartObj);
      trimUndefinedRecursively(outputChartObj);
      this.finalAnnualSavedCharts["outputCharts"] = {};
      this.finalAnnualSavedCharts["outputCharts"] = JSON.stringify(
        compress(outputChartObj)
      );
      let key = this.generateKey(`annualCharts_${this.$i18n.locale}`);
      this.saveAnnualCharts(key);
      // Outputchart craetion end
    },
    async saveAnnualCharts(dataStoreKey) {
      //"annualCharts_en"
      setTimeout(function () {
        console.log("Hello World");
      }, 1000);

      await service
        .getSavedConfig(dataStoreKey, false, "fp-dashboard")
        .then((resp) => {
          if (resp && resp.data) {
            let annualCharts = resp.data;
            if (!annualCharts[this.loc.split("/")[1]])
              annualCharts[this.loc.split("/")[1]] = {};
            if (!annualCharts[this.loc.split("/")[1]][this.defaultType])
              annualCharts[this.loc.split("/")[1]][this.defaultType] = {};
            annualCharts[this.loc.split("/")[1]][this.defaultType] =
              this.finalAnnualSavedCharts;

            service
              .updateConfig(annualCharts, dataStoreKey, false, "fp-dashboard")
              .then((resp) => {
                if (resp.data.status === "OK") {
                  console.log(
                    JSON.stringify(JSON.parse(this.finalCount[this.loc])),
                    this.loc,
                    this.finalCount[this.loc] ===
                      this.dqrConfig.emu.Background_Data.defaultDataType.length,
                    dataStoreKey == "annualCharts"
                  );
                  if (
                    this.finalCount[this.loc] ===
                      this.dqrConfig.emu.Background_Data.defaultDataType
                        .length &&
                    dataStoreKey == `annualCharts_${this.$i18n.locale}`
                  ) {
                    this.saveFinalAnnualEMU(annualCharts);
                  } else {
                    this.annaulEMUChartsUpdated = true;
                  }
                }
              })
              .catch((er) => {
                service
                  .saveConfig(annualCharts, dataStoreKey, false, "fp-dashboard")
                  .then((resp) => {
                    if (resp.data.status === "OK") {
                      if (
                        this.finalCount[this.loc] ===
                          this.dqrConfig.emu.Background_Data.defaultDataType
                            .length &&
                        key == "outputCharts" &&
                        dataStoreKey == "annualCharts"
                      ) {
                        this.saveFinalAnnualEMU(annualCharts);
                      } else {
                        this.annaulEMUChartsUpdated = true;
                      }
                    }
                  });
              });
          }
        })
        .catch(async (err) => {
          console.log("in outer catch", err);
          let annualCharts = {};
          if (!annualCharts[this.loc.split("/")[1]])
            annualCharts[this.loc.split("/")[1]] = {};
          if (!annualCharts[this.loc.split("/")[1]][this.defaultType])
            annualCharts[this.loc.split("/")[1]][this.defaultType] = {};
          annualCharts[this.loc.split("/")[1]][this.defaultType] =
            this.finalAnnualSavedCharts;
          service
            .saveConfig(annualCharts, dataStoreKey, false, "fp-dashboard")
            .then((resp) => {
              if (resp.data.status === "OK") {
                if (
                  this.finalCount[this.loc] ===
                    this.dqrConfig.emu.Background_Data.defaultDataType.length &&
                  key == "outputCharts" &&
                  dataStoreKey == "annualCharts"
                ) {
                  this.saveFinalAnnualEMU(annualCharts);
                } else {
                  this.annaulEMUChartsUpdated = true;
                }
              }
            });
        });
    },
    async saveCharts(dataStoreKey, key, chartData, dataType) {
      //"annualCharts_en
      setTimeout(function () {
        console.log(
          "Hello World for saveCharts",
          dataStoreKey,
          key,
          chartData,
          dataType
        );
      }, 1000);
      trimUndefinedRecursively(chartData);
      await service
        .getSavedConfig(dataStoreKey, false, "fp-dashboard")
        .then((resp) => {
          if (resp && resp.data) {
            let annualCharts = resp.data;
            if (!annualCharts[this.loc.split("/")[1]])
              annualCharts[this.loc.split("/")[1]] = {};
            if (!annualCharts[this.loc.split("/")[1]][this.defaultType])
              annualCharts[this.loc.split("/")[1]][this.defaultType] = {};
            annualCharts[this.loc.split("/")[1]][this.defaultType][key] = {};
            let compressedData = JSON.stringify(compress(chartData));
            // let compressedData = chartData;

            annualCharts[this.loc.split("/")[1]][this.defaultType][key] =
              compressedData;

            service
              .updateConfig(annualCharts, dataStoreKey, false, "fp-dashboard")
              .then((resp) => {
                if (resp.data.status === "OK") {
                  console.log(
                    "Charts saved for dashboard",
                    this.defaultType,
                    this.loc
                  );
                }
              })
              .catch((er) => {
                console.log(
                  err,
                  "in catch error occured while saving annual charts data"
                );
                console.log(err, "err");
                service
                  .saveConfig(annualCharts, dataStoreKey, false, "fp-dashboard")
                  .then((resp) => {
                    if (resp.data.status === "OK") {
                      console.log(
                        "Charts saved for dashboard",
                        this.defaultType,
                        this.loc
                      );
                    }
                  });
              });
          }
        })
        .catch(async (err) => {
          console.log("in outer catch", err);
        });
    },
    async saveFinalAnnualEMU(annualCharts) {
      console.log(
        "====================== Calling saveFinalAnnualEMU method ======================="
      );
      let key = this.generateKey(`annualCharts_${this.$i18n.locale}`);
      let allKeys = service.getAllKeys(false, "fp-dashboard");
      allKeys.then(async (keys) => {
        if (keys.data.includes(key)) {
          await service
            .getSavedConfig(key, false, "fp-dashboard")
            .then((resp) => {
              // console.log(resp, "getdata from api");
              if (resp && resp.data) {
                annualCharts = resp.data;
                let outputCharts = annualCharts[this.loc.split("/")[1]]
                  ? annualCharts[this.loc.split("/")[1]]
                  : {};
                if (outputCharts) {
                  let selectedTypesArray =
                    this.dqrConfig.emu.Background_Data.defaultDataType;
                  if (selectedTypesArray.length > 0) {
                    //first chart of emu o/p
                    // let obj = {
                    //   commoditiesToClients: this.$i18n.t("Commodities_Client"),
                    //   commoditiesToFacilities: this.$i18n.t(
                    //     "Commodities_Facilities"
                    //   ),
                    //   fp_visits: this.$i18n.t("visits"),
                    //   fp_users: this.$i18n.t("users"),
                    // };
                    let aMICS = [];
                    aMICS = [
                      {
                        name:
                          this.dqrConfig.emu.Background_Data
                            .FPWomenPopulation === "WRA"
                            ? this.$i18n.t("mCPR_AW_MICS")
                            : this.$i18n.t("mCPR_MW_MICS"),
                        data: [],
                        color: this.bgData["bgIndColor"]["MICS"],
                        keyVal: {},
                      },
                    ];
                    if (this.bgData["MICS"]) {
                      for (let yearInd in this.sYearArray) {
                        let year = this.sYearArray[yearInd];
                        aMICS[0].data.push(
                          this.bgData["MICS"][year]
                            ? this.bgData["MICS"][year]
                            : null
                        );
                        aMICS[0].keyVal[year] = this.bgData["MICS"][year]
                          ? this.bgData["MICS"][year]
                          : null;
                      }
                    }
                    let unpdData = {},
                      unpdtext = "";
                    if (this.defaultLevelID == this.loc.split("/")[0]) {
                      // unpdData = this.bgData.UNPD;
                      unpdData = this.bgData.FPET;
                      // unpdtext = 'unpd';
                      unpdtext = "fpet";
                    } else {
                      unpdData = this.bgData.FPET;
                      unpdtext = "fpet";
                    }
                    let dhsData = this.bgData.DHS ? this.bgData.DHS : {};
                    let pmaData = this.bgData.PMA ? this.bgData.PMA : {};
                    let bgSureyData = dataM.getUserTrendsDatafromSurvey(
                      this.sYearArray,
                      unpdData,
                      dhsData,
                      pmaData,
                      this.bAllWomen,
                      this.bgData["bgIndColor"],
                      unpdtext
                    );
                    let outputdata = {}; //fr 1st chart
                    let userTrendsData = {},
                      surveyData = {},
                      finalMethodArr = {}; //for 3rd chart
                    let adjustedValues = {}; //for method table
                    selectedTypesArray.forEach((dttype) => {
                      if (
                        outputCharts[dttype] &&
                        outputCharts[dttype]["outputCharts"]
                      ) {
                        let opChartData =
                          typeof outputCharts[dttype]["outputCharts"] ===
                          "string"
                            ? decompress(
                                JSON.parse(outputCharts[dttype]["outputCharts"])
                              )
                            : outputCharts[dttype]["outputCharts"];
                        outputdata[dttype] = opChartData["userTrendsbyEmu"];
                        userTrendsData[dttype] =
                          opChartData["methodWiseAdjObject"];
                        surveyData[dttype] = opChartData["surveyData"];
                        finalMethodArr[dttype] = opChartData["finalMethodArr"];
                        adjustedValues[dttype] = dataM.calculateNewAdjustedVals(
                          opChartData["allMethodsAdjusted"].adjusted
                        );
                      }
                    });
                    let oResponse = dataM.getemuComparisonData(
                      bgSureyData,
                      outputdata,
                      this.filter,
                      this.staticColors
                    );
                    let finalEMUComparisonData = this.getOtherChartDeatils(
                      "Output",
                      oResponse,
                      0,
                      "line"
                    );
                    finalEMUComparisonData.reportChartType =
                      finalEMUComparisonData.type;
                    finalEMUComparisonData.isPeriodChart = true;
                    finalEMUComparisonData.fields = [];
                    finalEMUComparisonData.tableData = [];
                    finalEMUComparisonData.fields.push({
                      key: this.$i18n.t("period"),
                      sortable: true,
                    });
                    finalEMUComparisonData.categories.forEach((cat, i) => {
                      let row = {};
                      row[this.$i18n.t("period")] = cat;
                      finalEMUComparisonData.data.forEach((d) => {
                        if (
                          finalEMUComparisonData.fields.indexOf(d.name) == -1
                        ) {
                          finalEMUComparisonData.fields.push(d.name);
                        }
                        row[d.name] = d.data[i];
                      });
                      finalEMUComparisonData.tableData.push(row);
                    });
                    //end of first chart

                    //second chart of emu o/p
                    let secondChartResponse = dataM.getSlopData(
                      finalEMUComparisonData
                    );
                    let annualAvgComarisonChart = this.getOtherChartDeatils(
                      "Output",
                      secondChartResponse,
                      1,
                      "bar"
                    );

                    annualAvgComarisonChart.reportChartType =
                      annualAvgComarisonChart.type;
                    annualAvgComarisonChart.isPeriodChart = false;

                    //end of second chart

                    //third chart of emu o/p
                    let emufromDQR = this.dqrConfig.emu["Background_Data"][
                      "defaultEMU"
                    ]
                      ? this.dqrConfig.emu["Background_Data"]["defaultEMU"]
                      : "Commodities_Client";
                    let sourcesData = {
                      Commodities_Client: this.$i18n.t(
                        "commodities_to_clients"
                      ),
                      Visits: this.$i18n.t("fp_visits"),
                      Commodities_Facilities: this.$i18n.t(
                        "commodities_to_facility"
                      ),
                      User: this.$i18n.t("fp_users"),
                    };
                    let oRet = dataM.emuOutputCompByMethod(
                      this.dqrConfig.emu["Background_Data"]["SSDataRecentYear"],
                      this.sYearArray,
                      userTrendsData,
                      surveyData,
                      finalMethodArr,
                      sourcesData[emufromDQR]
                    );
                    let retData = oRet.data ? oRet.data.reverse() : [];
                    let annualComparisionOfMethods = {
                      data: retData,
                      tableData: oRet.tableData,
                      fields: oRet.fields,
                      categories: oRet.categories,
                    };
                    annualComparisionOfMethods = this.getOtherChartDeatils(
                      "Output",
                      annualComparisionOfMethods,
                      2,
                      "bar"
                    );
                    annualComparisionOfMethods.reportChartType =
                      annualComparisionOfMethods.type;
                    annualComparisionOfMethods.isPeriodChart = false;
                    //end of third chart

                    //fourth chart of emu o/p emuOutputUserByMethod
                    let userByMethodData = dataM.emuOutputUserByMethod(
                      this.sYearArray,
                      userTrendsData,
                      finalMethodArr,
                      sourcesData[emufromDQR],
                      this.filter,
                      this.staticColors
                    );
                    let saveuserTrendsByMethods = userByMethodData;
                    saveuserTrendsByMethods.type = "line";
                    saveuserTrendsByMethods.reportChartType = "line";
                    saveuserTrendsByMethods.isPeriodChart = true;
                    //end of fourth chart
                    //logic for methodtable

                    let methodSeq = this.tableMethodSeq;
                    console.log(
                      methodSeq,
                      adjustedValues,
                      emufromDQR,
                      "methodSeq----------------"
                    );
                    let i,
                      oData = adjustedValues[emufromDQR],
                      aFinalCats = [],
                      oFinalData = {},
                      tableData = {};
                    methodSeq.forEach((v, i) => {
                      Object.keys(oData).forEach((m) => {
                        if (m == v) {
                          tableData[methodSeq[i]] = oData[m];
                        }
                      });
                    });
                    let oAllMethods = dataM.getTableFormatedData(
                      tableData,
                      this.tableMethodSeq
                    );

                    for (i in tableData) {
                      let aCats = Object.keys(tableData[i]);
                      aCats.forEach((year) => {
                        if (aFinalCats.indexOf(" " + year + " ") == -1) {
                          aFinalCats.push(" " + year + " ");
                        }
                      });
                      // aFinalCats = aCats;
                      //}
                    }
                    if (aFinalCats && aFinalCats.length) {
                      this.fields = [
                        " " + this.$i18n.t("methods") + " ",
                        " " + this.$i18n.t("sub_method") + " ",
                        ...aFinalCats,
                      ];
                    } else {
                      this.fields = [
                        " " + this.$i18n.t("methods") + " ",
                        " " + this.$i18n.t("sub_method") + " ",
                      ];
                    }
                    let tableRows = [];
                    let oSumModernUsers = {},
                      oSumModernUsersexCon = {};
                    if (Object.keys(oAllMethods).length > 0) {
                      for (let k in oAllMethods) {
                        // let bFlag = true;
                        for (let l in oAllMethods[k]) {
                          let oRow = {
                              [" " + this.$i18n.t("methods") + " "]:
                                k.toUpperCase(),
                              [" " + this.$i18n.t("sub_method") + " "]: l,
                            },
                            bIsCon =
                              k.toLowerCase() === "condom" ||
                              k.toLowerCase === "préservatifs";
                          //let oRow = {[this.$i18n.t('methods')]:bFlag ? k.toUpperCase() : '',[this.$i18n.t('sub_method')]:l},bIsCon = k.toLowerCase() === 'condom';
                          for (let m in oAllMethods[k][l]) {
                            oAllMethods[k][l][m] = oAllMethods[k][l][m]
                              ? oAllMethods[k][l][m]
                              : 0;
                            oRow[" " + m + " "] = Math.round(
                              oAllMethods[k][l][m]
                            ).toLocaleString();
                            oSumModernUsers[m] =
                              (oSumModernUsers[m] || 0) + oAllMethods[k][l][m];
                            //if(!bIsCon){
                            if (
                              k.toLowerCase() !=
                              this.$i18n.t("condom").toLowerCase()
                            ) {
                              oSumModernUsersexCon[m] =
                                (oSumModernUsersexCon[m] || 0) +
                                oAllMethods[k][l][m];
                            }
                          }
                          // bFlag = false;
                          tableRows.push(oRow);
                        }
                      }
                    }
                    let oRows1 = {
                        [" " + this.$i18n.t("methods") + " "]: this.$i18n.t(
                          "estimated_modern_users"
                        ),
                        [" " + this.$i18n.t("sub_method") + " "]: "",
                        _rowVariant: "customclass",
                      },
                      oRows2 = {
                        [" " + this.$i18n.t("methods") + " "]: this.$i18n.t(
                          "estimated_modern_users_excon"
                        ),
                        [" " + this.$i18n.t("sub_method") + " "]: "",
                        _rowVariant: "customclass",
                      };
                    for (let x in oSumModernUsersexCon) {
                      oRows1[" " + x + " "] = Math.round(
                        oSumModernUsers[x]
                      ).toLocaleString();
                      oRows2[" " + x + " "] = Math.round(
                        oSumModernUsersexCon[x]
                      ).toLocaleString();
                    }

                    tableRows.push(oRows1);
                    tableRows.push(oRows2);
                    console.log(tableRows, "final o/p table in in/op tab");

                    console.log(this.defaultType, emufromDQR, "last if");
                    let methodTable = { [this.loc.split("/")[1]]: tableRows };

                    //methodTable logic end here
                    //save final emu process started
                    finalEMUComparisonData.source = this.emufromDQR;
                    annualAvgComarisonChart.source = this.emufromDQR;
                    annualComparisionOfMethods.source = this.emufromDQR;
                    // this.userTrendsDataByMethods.source = this.category
                    let dataStore = {};
                    let key = this.generateKey(
                      `annualEMU_${this.$i18n.locale}`
                    );
                    // this.bshowLoader = true;
                    if (keys.data.includes(key)) {
                      let oConfig = service.getSavedConfig(
                        key,
                        false,
                        "fp-dashboard"
                      );
                      oConfig.then((response) => {
                        let oResponse = response.data;
                        if (oResponse["compEMU"]) {
                          oResponse["compEMU"] = JSON.parse(
                            oResponse["compEMU"]
                          );
                          if (oResponse["compEMU"][this.loc.split("/")[1]]) {
                            oResponse["compEMU"][this.loc.split("/")[1]] =
                              finalEMUComparisonData;
                          } else {
                            oResponse["compEMU"] = {
                              ...oResponse["compEMU"],
                              [this.loc.split("/")[1]]: finalEMUComparisonData,
                            };
                          }
                        } else {
                          oResponse["compEMU"] = {
                            [this.loc.split("/")[1]]: finalEMUComparisonData,
                          };
                        }

                        if (oResponse["compAvgAnuual"]) {
                          oResponse["compAvgAnuual"] = JSON.parse(
                            oResponse["compAvgAnuual"]
                          );
                          if (
                            oResponse["compAvgAnuual"][this.loc.split("/")[1]]
                          ) {
                            oResponse["compAvgAnuual"][this.loc.split("/")[1]] =
                              annualAvgComarisonChart;
                          } else {
                            oResponse["compAvgAnuual"] = {
                              ...oResponse["compAvgAnuual"],
                              [this.loc.split("/")[1]]: annualAvgComarisonChart,
                            };
                          }
                        } else {
                          oResponse["compAvgAnuual"] = {
                            [this.loc.split("/")[1]]: annualAvgComarisonChart,
                          };
                        }

                        if (oResponse["compUsers"]) {
                          oResponse["compUsers"] = JSON.parse(
                            oResponse["compUsers"]
                          );
                          if (oResponse["compUsers"][this.loc.split("/")[1]]) {
                            oResponse["compUsers"][this.loc.split("/")[1]] =
                              annualComparisionOfMethods;
                          } else {
                            oResponse["compUsers"] = {
                              ...oResponse["compUsers"],
                              [this.loc.split("/")[1]]:
                                annualComparisionOfMethods,
                            };
                          }
                        } else {
                          oResponse["compUsers"] = {
                            [this.loc.split("/")[1]]:
                              annualComparisionOfMethods,
                          };
                        }

                        if (oResponse["usersTrend"]) {
                          oResponse["usersTrend"] = JSON.parse(
                            oResponse["usersTrend"]
                          );
                          if (oResponse["usersTrend"][this.loc.split("/")[1]]) {
                            oResponse["usersTrend"][this.loc.split("/")[1]] =
                              saveuserTrendsByMethods;
                          } else {
                            oResponse["usersTrend"] = {
                              ...oResponse["usersTrend"],
                              [this.loc.split("/")[1]]: saveuserTrendsByMethods,
                            };
                          }
                        } else {
                          oResponse["usersTrend"] = {
                            [this.loc.split("/")[1]]: saveuserTrendsByMethods,
                          };
                        }
                        if (oResponse["methodTable"]) {
                          oResponse["methodTable"] = JSON.parse(
                            oResponse["methodTable"]
                          );
                          if (
                            oResponse["methodTable"][this.loc.split("/")[1]]
                          ) {
                            oResponse["methodTable"][this.loc.split("/")[1]] =
                              methodTable;
                          } else {
                            oResponse["methodTable"] = {
                              ...oResponse["methodTable"],
                              [this.loc.split("/")[1]]: methodTable,
                            };
                          }
                        } else {
                          oResponse["methodTable"] = {
                            [this.loc.split("/")[1]]: methodTable,
                          };
                        }
                        //methodtable is used in geoprogress tab
                        //if(oResponse['methodTable']){
                        //    oResponse['methodTable'] = this.$store.state.methodTable
                        //}
                        oResponse["emuColors"] = JSON.parse(
                          localStorage.getItem("emuColors")
                        );
                        oResponse["compEMU"] = JSON.stringify(
                          oResponse["compEMU"]
                        );
                        oResponse["compAvgAnuual"] = JSON.stringify(
                          oResponse["compAvgAnuual"]
                        );
                        oResponse["compUsers"] = JSON.stringify(
                          oResponse["compUsers"]
                        );
                        oResponse["usersTrend"] = JSON.stringify(
                          oResponse["usersTrend"]
                        );
                        oResponse["methodTable"] = JSON.stringify(
                          oResponse["methodTable"]
                        );
                        console.log(oResponse, "annualemu updating");
                        service
                          .updateConfig(oResponse, key, false, "fp-dashboard")
                          .then(() => {
                            // this.$store.state.loading = false;
                            this.annaulEMUChartsUpdated = true;
                            this.$store.commit("setEMUMethodTable", null);
                            this.$store.commit("setEMUColors", null);
                          });
                      });
                    } else {
                      let compEMUObj = {
                          [this.loc.split("/")[1]]: finalEMUComparisonData,
                        },
                        compAvgAnuualObj = {
                          [this.loc.split("/")[1]]: annualAvgComarisonChart,
                        },
                        compUsersObj = {
                          [this.loc.split("/")[1]]: annualComparisionOfMethods,
                        },
                        usersTrendObj = {
                          [this.loc.split("/")[1]]: saveuserTrendsByMethods,
                        },
                        methodTable = {
                          [this.loc.split("/")[1]]: methodTable,
                        };

                      dataStore = {
                        compEMU: JSON.stringify(compEMUObj),
                        compAvgAnuual: JSON.stringify(compAvgAnuualObj),
                        compUsers: JSON.stringify(compUsersObj),
                        usersTrend: JSON.stringify(usersTrendObj),
                        methodTable: JSON.stringify(methodTable),
                        emuColors: JSON.parse(
                          localStorage.getItem("emuColors")
                        ),
                      };
                      console.log(dataStore, "annual emu creating key");
                      service
                        .saveConfig(dataStore, key, false, "fp-dashboard")
                        .then(() => {
                          this.annaulEMUChartsUpdated = true;
                          // this.$store.state.loading = false;
                          this.$store.commit("setEMUMethodTable", null);
                          this.$store.commit("setEMUColors", null);
                          // this.$emit("saveEMUFinal", this.loc);
                          // this.sweetAlert({
                          //   title: this.$i18n.t("data_saved_successfully"),
                          // });
                        });
                    }
                    //});
                    //process ends here
                  }
                }
              }
            });
        }
      });
      console.log("saveFinalAnnual EMU mETHOD END");
    },
    getPieChart(pieDataObject) {
      let sources = {
        Commodities_Client: "Commodities Distributed to Clients",
        Commodities_Facilities: "Commodities Distributed to Facilities",
        Visits: "FP Visits",
        User: "FP Users",
      };
      let oResponse = {
        data: [
          {
            size: 200,
            center: [200, 180],
            name: this.$i18n.t("methods"),
            colorByPoint: true,
            data: pieDataObject["estiMethod"].data,
          },
          {
            size: 200,
            center: [600, 180],
            name: this.$i18n.t("methods"),
            colorByPoint: true,
            data: pieDataObject["methodMix"].data,
          },
        ],
        title:
          this.dqrConfig.emu[this.defaultType]["derivedCharts"][3][
            "chartOptions"
          ]["chartName"],
        source: sources[this.defaultType],
        xTitle: "",
        yTitle: "",
        type: "pie",
        disable:
          this.dqrConfig.emu[this.defaultType]["derivedCharts"][3][
            "chartOptions"
          ]["disableChart"],
        dataLable: true,
        chartInfo:
          this.dqrConfig.emu[this.defaultType]["derivedCharts"][3][
            "chartOptions"
          ]["chartInfo"],
        cid: this.dqrConfig.emu[this.defaultType]["derivedCharts"][3][
          "chartOptions"
        ]["cid"],
        tableData: pieDataObject.tableData,
        fields: pieDataObject.aFields,
        labels: {
          items: [
            {
              // html: 'Estimated Modern Method Mix',
              html: this.dqrConfig.emu[this.defaultType]["derivedCharts"][3][
                "chartOptions"
              ]["subTitle"]["text"],
              style: {
                left: "150px",
                top: "0px",
                color: "black",
              },
            },
            {
              // html: 'Modern Contraceptive Method Mix',
              html: this.dqrConfig.emu[this.defaultType]["derivedCharts"][3][
                "chartOptions"
              ]["subTitle1"]["text"],
              style: {
                left: "450px",
                top: "0px",
                color: "black",
              },
            },
          ],
        },
      };
      return oResponse;
    },
    getFinalChartsdata() {
      let type = this.defaultType;
      let aChartArr = this.gConfig.chartArr;
      let methodArr = {};
      Object.keys(this.continuation[type]).forEach((cont) => {
        methodArr[cont] = {};
        let valArr = {},
          contArr = {};
        aChartArr.forEach((a, i) => {
          let name = "",
            color = "",
            mTransname = "";
          Object.keys(this.continuation[type][cont]).forEach((c) => {
            if (
              a["monthlyCharts"] !== undefined &&
              a["monthlyCharts"][c] !== undefined
            ) {
              Object.keys(a["monthlyCharts"][c]).forEach((key, i) => {
                let newKey = key.split("/");

                if (newKey[1] === cont) {
                  name = a.name;
                  mTransname = a.trans_name;
                  color = a.color;
                  methodArr[cont]["name"] = name;
                  methodArr[cont]["mTransname"] = mTransname;
                  methodArr[cont]["trans_name"] = newKey[0];
                  methodArr[cont]["subname"] = newKey[1];
                  methodArr[cont]["color"] = color;
                  methodArr[cont]["sfa"] = color;

                  let val =
                    a["monthlyCharts"][c][key] !== undefined
                      ? a["monthlyCharts"][c][key]
                      : 0;
                  valArr[c] = val;
                  contArr[c] = this.continuation[type][cont][c];
                }
              });
            }
          });
        });
        methodArr[cont]["val"] = valArr;
        methodArr[cont]["cont"] = contArr;
      });
      let oFinalVals = {},
        oUsers = {},
        oNewUsers = {};
      for (let j in methodArr) {
        let oVal = methodArr[j].val,
          oCont = methodArr[j].cont,
          aMonths = Object.keys(methodArr[j].val);

        if (methodArr[j].name !== undefined) {
          oFinalVals[j] = {
            vals: {},
            name: methodArr[j].name,
            mTransname: methodArr[j].mTransname,
            subname: methodArr[j].subname,
            trans_name: methodArr[j].trans_name,
          };
          oNewUsers[j] = {
            vals: {},
            name: methodArr[j].name,
            mTransname: methodArr[j].mTransname,
            subname: methodArr[j].subname,
            color: methodArr[j].color,
            trans_name: methodArr[j].trans_name,
          };
          for (let k in oVal) {
            let nIndex = aMonths.indexOf(k),
              nSum = 0,
              l = 0,
              newUserVal = 0;

            while (nIndex > -1) {
              nSum += oVal[aMonths[l]] * oCont[aMonths[nIndex]];
              newUserVal = oVal[aMonths[l]];
              nIndex--;
              l++;
            }
            oFinalVals[j].vals[k] = parseInt(nSum);
            oNewUsers[j].vals[k] = parseInt(newUserVal);
          }
        }
      }

      oUsers = oFinalVals;
      this.users = oUsers;
      this.newUsers = oNewUsers;
      this.getHistoricUsers(this.users, this.newUsers);
    },
    getHistoricUsers(users, newUsers) {
      let contSum = [];
      let type = this.defaultType,
        scaling = this.scaling,
        continuation = this.continuation;
      Object.keys(continuation).forEach((cat) => {
        Object.keys(continuation[cat]).forEach((method) => {
          Object.keys(continuation[cat][method]).forEach((yearVal, i) => {
            if (i < 1) {
              delete continuation[cat][method][yearVal];
            }
          });
        });
      });
      contSum = dataM.getSumOfContMonthly(continuation[type]);
      let historicUsers = {};
      Object.keys(newUsers).forEach((method, i) => {
        historicUsers[method] = {
          vals: {},
          name: newUsers[method].name,
          subname: newUsers[method].subname,
          contSum: {},
          mTransname: newUsers[method].mTransname,
          color: newUsers[method].color,
          trans_name: newUsers[method].trans_name,
          contSum: {},
        };
        var keys = Object.keys(newUsers[method]["vals"]);

        if (keys.length > 0) {
          Object.keys(newUsers[method]["vals"]).forEach((yearVal, i) => {
            historicUsers[method]["contSum"][yearVal] = contSum[method][i]
              ? contSum[method][i].toFixed(2) * 1
              : null;
            historicUsers[method]["vals"][yearVal] =
              newUsers[method]["vals"][keys[0]] *
              (contSum[method][i] ? contSum[method][i].toFixed(2) * 1 : 0) *
              (scaling[newUsers[method].subname]
                ? scaling[newUsers[method].subname].toFixed(0) * 1
                : 1);
          });
        }
      });
      this.histUsers = historicUsers;
      this.getTotalUsers(users, this.histUsers);
    },
    getTotalUsers(users, histUsers) {
      let totalUsers = {};
      // console.log(this.methodSeq);
      let historicUsers = histUsers;
      Object.keys(users).forEach((method) => {
        totalUsers[method] = {
          vals: {},
          name: "",
          subname: "",
          mTransname: "",
          trans_name: "",
          color: historicUsers[method]["color"],
        };
        Object.keys(users[method]["vals"]).forEach((userVal) => {
          totalUsers[method]["vals"][userVal] =
            historicUsers[method]["vals"][userVal] !== "NaN"
              ? users[method]["vals"][userVal] +
                historicUsers[method]["vals"][userVal]
              : users[method]["vals"][userVal];
        });
        totalUsers[method]["name"] = users[method]["name"];
        totalUsers[method]["subname"] = users[method]["subname"];
        totalUsers[method]["mTransname"] = users[method]["mTransname"];
        totalUsers[method]["trans_name"] = users[method]["trans_name"];
      });

      let oTemp = {};
      let totalEMUByMethod = {};
      let categories = [];
      Object.keys(totalUsers).forEach((method) => {
        let methodnName = method;
        if (!totalEMUByMethod[method])
          totalEMUByMethod[method] = {
            name: totalUsers[method]["name"],
            mTransname: totalUsers[method]["mTransname"],
            subname: totalUsers[method]["subname"],
            vals: {},
            color: totalUsers[method]["color"],
            trans_name: totalUsers[method]["trans_name"],
          };
        if (!oTemp[methodnName]) {
          oTemp[methodnName] = {
            name: totalUsers[method]["name"],
            mTransname: totalUsers[method]["mTransname"],
            subname: totalUsers[method]["subname"],
            color: totalUsers[method]["color"],
            trans_name: totalUsers[method]["trans_name"],
            vals: {},
          };
        }
        Object.keys(totalUsers[method]["vals"]).forEach((year) => {
          if (categories.indexOf(year) == -1) {
            categories.push(year);
          }
          totalEMUByMethod[method]["name"] = totalUsers[method]["name"];
          totalEMUByMethod[method]["subname"] = totalUsers[method]["subname"];
          oTemp[methodnName]["vals"][year] =
            totalUsers[method]["vals"][year] || 0;
          // console.log(
          //   this.monthlyPopulation[year],
          //   year,
          //   totalUsers[method]["vals"][year]
          // );
          totalEMUByMethod[method][year] = this.monthlyPopulation[year]
            ? (
                (totalUsers[method]["vals"][year] /
                  this.monthlyPopulation[year]) *
                100
              ).toFixed(2) * 1
            : 0;
        });
      });
      let sumTotalEmu = {};

      let last24Cat = [...categories];
      if (last24Cat.length > 12) {
        last24Cat.splice(0, last24Cat.length - 24);
      }
      Object.keys(totalEMUByMethod).forEach((method) => {
        Object.keys(totalEMUByMethod[method]).forEach((year) => {
          sumTotalEmu[year] =
            (sumTotalEmu[year] || 0) + totalEMUByMethod[method][year];
        });
      });
      this.totalEMUByMethod = totalEMUByMethod;
      console.log(
        this.totalEMUByMethod,
        "================ this.totalEMUByMethod final object data =============="
      );
      let firstChartSeries = [],
        firstChartSaveSeries = [];

      let filterArr = [],
        mainObj = {
          id: "",
          label: "",
          children: [],
        };
      let firstChartTableData = [],
        secondChartTableData = [];
      Object.keys(this.newUsers).forEach((method) => {
        let actObj = {
          data: [],
          name: this.newUsers[method]["trans_name"],
          mName: this.newUsers[method]["mTransname"],
          trans_name: this.newUsers[method]["trans_name"],
          color: this.newUsers[method]["color"],
        };
        let tableObj = {
          data: [],
          name: this.newUsers[method]["trans_name"],
          mName: this.newUsers[method]["mTransname"],
          trans_name: this.newUsers[method]["trans_name"],
        };
        let saveActObj = {
          data: [],
          name: this.newUsers[method]["trans_name"],
          mName: this.newUsers[method]["mTransname"],
          trans_name: this.newUsers[method]["trans_name"],
          color: this.newUsers[method]["color"],
        };
        last24Cat.forEach((year) => {
          let obj = {};
          obj["Period"] = this.$moment(year, "YYYYMM").format("MMM YYYY");
          obj["EMU"] = this.newUsers[method]["vals"][year];
          actObj.data.push(this.newUsers[method]["vals"][year]);
          tableObj.data.push(obj);
        });
        firstChartTableData.push(tableObj);
        categories.forEach((year) => {
          saveActObj.data.push(this.newUsers[method]["vals"][year]);
        });

        firstChartSeries.push(actObj);
        firstChartSaveSeries.push(saveActObj);
      });
      console.log(firstChartTableData, "firstChartTableData");
      let firstChart = {
        data: firstChartSeries,
        max: 11,
        categories: last24Cat.map((period) =>
          this.$moment(period, "YYYYMM").format("MMM YYYY")
        ),
        tableData: firstChartTableData,
        saveData: firstChartSaveSeries,
        saveCategories: categories.map((period) =>
          this.$moment(period, "YYYYMM").format("MMM YYYY")
        ),
      };
      firstChart = this.getOtherChartDeatils(
        "emu_monthly",
        firstChart,
        1,
        "column"
      );
      let secondChartSeries = [],
        secondChartSaveSeries = [],
        trendChartSaveSeries = [],
        dhsSeries = [],
        dhsSaveSeries = [], //FOR ONE MONTH EMU CHART
        trendChartSeries = []; //without dhs for trend chart in emu monthly o/p 2nd and 3rd chart
      this.monthlyMethodSeq.forEach((method, methodIndex) => {
        let isFound = filterArr.find(
          (obj) =>
            this.totalEMUByMethod[method] &&
            obj.id === this.totalEMUByMethod[method]["name"]
        );
        if (!isFound && this.totalEMUByMethod[method]) {
          mainObj = {
            id: this.totalEMUByMethod[method]["name"],
            label: this.totalEMUByMethod[method]["name"],
            children: [],
          };
          mainObj.children.push({
            id: method,
            label: method,
          });
          filterArr.push(mainObj);
        } else {
          let findIndex = filterArr.findIndex(
            (obj) =>
              this.totalEMUByMethod[method] &&
              obj.id === this.totalEMUByMethod[method]["name"]
          );
          if (findIndex >= 0) {
            filterArr[findIndex]["children"].push({
              id: method,
              label: method,
            });
          }
        }
      });
      Object.keys(this.totalEMUByMethod).forEach((method) => {
        let oMethodTable = {
          name: "",
          data: [],
          mName: "",
          trans_name: "",
          color: this.staticColors["emuColor"],
        };
        let dhsTable = {
          name: "",
          data: [],
          mName: "",
          trans_name: "",
          color: this.staticColors["dhsColor"],
        };
        let saveDhsTable = {
          name: "",
          data: [],
          mName: "",
          trans_name: "",
          color: this.staticColors["dhsColor"],
        };
        let secondChartTableObj = {
          name: "",
          data: [],
          mName: "",
        };
        let oMethodSaveTable = {
          name: "",
          data: [],
          mName: "",
          trans_name: "",
          color: this.staticColors["emuColor"],
        };
        // let publicObj = { name: "", data: [], mName: "", trans_name: "" };

        last24Cat.forEach((year) => {
          let oTable = {};
          oTable[this.$i18n.t("period")] = this.$moment(year, "YYYYMM").format(
            "MMM YYYY"
          );
          if (this.backgroundData != null) {
            Object.keys(this.backgroundData[method]).forEach((back) => {
              this.backgroundData[method][back]["vals"][year] =
                this.backgroundData[method][back]["vals"][year] || 0;
              oTable[back] =
                this.backgroundData[method][back]["vals"][year].toFixed(2) * 1;
            });
          }
          oTable[this.$i18n.t("EMU")] =
            this.totalEMUByMethod[method][year] || 0;
          oMethodTable["name"] = method + " " + this.$i18n.t("EMU");
          oMethodTable["mName"] = this.totalEMUByMethod[method]["mTransname"];
          oMethodTable["trans_name"] = this.totalEMUByMethod[method]["subname"]; //taking subname as transname
          oMethodTable["data"].push(
            this.totalEMUByMethod[method][year].toFixed(2) * 1
          );
          oMethodTable["color"] = this.totalEMUByMethod[method]["color"];
          secondChartTableObj["name"] = method + " " + this.$i18n.t("EMU");
          secondChartTableObj["mName"] =
            this.totalEMUByMethod[method]["mTransname"];
          secondChartTableObj["data"].push(oTable);
        });
        secondChartTableData.push(secondChartTableObj);

        categories.forEach((year) => {
          let oTable = {};
          if (this.backgroundData != null) {
            Object.keys(this.backgroundData[method]).forEach((back) => {
              this.backgroundData[method][back]["vals"][year] =
                this.backgroundData[method][back]["vals"][year] || 0;
              oTable[back] =
                this.backgroundData[method][back]["vals"][year].toFixed(2) * 1;
            });
          }
          oTable[this.$i18n.t("EMU")] = this.totalEMUByMethod[method][year];
          oMethodSaveTable["name"] = method + " " + this.$i18n.t("EMU");
          oMethodSaveTable["trans_name"] =
            this.totalEMUByMethod[method]["subname"];
          //taking subname as transname
          oMethodSaveTable["mName"] =
            this.totalEMUByMethod[method]["mTransname"];
          oMethodSaveTable["color"] = this.totalEMUByMethod[method]["color"];
          oMethodSaveTable["data"].push(
            this.totalEMUByMethod[method][year].toFixed(2) * 1
          );
        });
        if (
          this.backgroundData &&
          Object.keys(this.backgroundData[method]).length > 0
        ) {
          Object.keys(this.backgroundData[method]).forEach((back) => {
            let peevVal = 0;
            Object.keys(this.backgroundData[method][back]["vals"]).forEach(
              (d) => {
                // if (this.backgroundData[method][back][d] != 0) {
                //   peevVal = this.backgroundData[method][back][d];
                // }
                this.backgroundData[method][back]["vals"][d] =
                  this.backgroundData[method][back]["vals"][d] || 0;
                peevVal =
                  this.backgroundData[method][back]["vals"][d].toFixed(2) * 1;
              }
            );
            last24Cat.forEach((year) => {
              dhsTable["name"] = back + " " + method;
              dhsTable["trans_name"] = method;
              dhsTable.data.push(peevVal);
            });
            categories.forEach((year) => {
              saveDhsTable["name"] = back + " " + method;
              saveDhsTable["trans_name"] = method;
              saveDhsTable.data.push(peevVal);
            });
          });
        }
        secondChartSeries.push(dhsTable);
        dhsSeries.push(dhsTable);
        secondChartSeries.push(oMethodTable);
        trendChartSeries.push(oMethodTable);
        secondChartSaveSeries.push(oMethodSaveTable);
        secondChartSaveSeries.push(saveDhsTable);
        dhsSaveSeries.push(saveDhsTable);
        trendChartSaveSeries.push(oMethodSaveTable);
      });
      //calculate monthly charts
      let secondChart = {
        data: secondChartSeries,
        max: 11,
        categories: last24Cat.map((period) =>
          this.$moment(period, "YYYYMM").format("MMM YYYY")
        ),
        tableData: secondChartTableData,
        saveData: secondChartSaveSeries,
        saveCategories: categories.map((period) =>
          this.$moment(period, "YYYYMM").format("MMM YYYY")
        ),
        filter: filterArr,
      };
      firstChart.filter = filterArr;
      secondChart = this.getOtherChartDeatils(
        "emu_monthly",
        secondChart,
        0,
        "line"
      );
      let chartObj = {};
      chartObj["inputChart"] = firstChart;
      chartObj["emuByMethod"] = secondChart;
      chartObj["inputNewUsers"] = this.newUsers;
      chartObj["totalUsers"] = totalUsers;
      chartObj["monthlyPopulation"] = this.monthlyPopulation;
      let indDataSeq = [];
      let indData = this.dqrConfig.emu_monthly[this.defaultType]["chartData"];
      indData.forEach((ind) => {
        let paretnInd = Array.isArray(ind["indicator"]["static_name"])
          ? ind["indicator"]["static_name"][this.$i18n.locale]
          : ind["indicator"]["static_name"];
        let obj = {};
        obj["parent"] = paretnInd;
        obj["subInd"] = [];
        obj["dataDiffer"] = false;
        ind["indicator"]["subIndicator"].forEach((subind) => {
          let subIndName = Array.isArray(subind["static_name"])
            ? subind["static_name"][this.$i18n.locale]
            : subind["static_name"];
          obj["subInd"].push(subIndName);
        });
        indDataSeq.push(obj);
      });

      let emuByMethodChart = {
        agreData: [],
        saveAgreData: [],
        agreTableData: [],
        tableData: [],
        methodData: trendChartSeries,
        methodTableData: [],
        data: trendChartSeries,
        saveData: trendChartSaveSeries,
        categories: last24Cat.map((period) =>
          this.$moment(period, "YYYYMM").format("MMM YYYY")
        ),
        saveCategories: categories.map((period) =>
          this.$moment(period, "YYYYMM").format("MMM YYYY")
        ),
      };
      let oneMonthEMU = {
        agreData: [
          {
            data: [],
            name: this.$i18n.t("EMU") + " " + last24Cat[last24Cat.length - 1],
            color: this.staticColors["emuColor"],
          },
          {
            data: [],
            name: "DHS",
            color: this.staticColors["dhsColor"],
          },
        ],
        saveAgreData: [],
        agreTableData: [
          {
            data: [],
            name: this.$i18n.t("EMU") + " " + last24Cat[last24Cat.length - 1],
          },
          {
            data: [],
            name: "DHS",
          },
        ],
        tableData: [
          {
            data: [],
            name: this.$i18n.t("EMU") + " " + last24Cat[last24Cat.length - 1],
          },
          {
            data: [],
            name: "DHS",
          },
        ],
        methodData: trendChartSeries,
        methodTableData: [],
        data: [
          {
            data: [],
            name: this.$i18n.t("EMU") + " " + last24Cat[last24Cat.length - 1],
            color: this.staticColors["emuColor"],
          },
          {
            data: [],
            name: "DHS",
            color: this.staticColors["dhsColor"],
          },
        ],
        saveData: trendChartSaveSeries,
        methodCategories: [],
        categories: [],
        saveCategories: categories.map((period) =>
          this.$moment(period, "YYYYMM").format("MMM YYYY")
        ),
        agreCategories: [],
      };
      indDataSeq.forEach((mobj) => {
        if (mobj.parent != "Total CYP") {
          // let actObj = {
          //   name: mobj.parent,
          //   data: [],
          // };
          let saveObj = {
            name: mobj.parent,
            data: [],
            color: "",
          };
          last24Cat.forEach((year, yearIndex) => {
            let agreEmu = 0,
              oneMonthAgreEMU = 0,
              saveoneMonthAgreDHS = 0;
            // agreDHS = 0;

            mobj.subInd.forEach((sunMethod, subi) => {
              let findinArray = trendChartSeries.filter((obj) => {
                return sunMethod == obj.trans_name; //line no 2609
              });

              if (findinArray.length) {
                let sum = 0;
                findinArray.forEach((obj) => {
                  agreEmu = agreEmu + obj["data"][yearIndex];
                  if (
                    !oneMonthEMU.categories.includes(sunMethod) &&
                    yearIndex == last24Cat.length - 1
                  ) {
                    oneMonthEMU.categories.push(sunMethod);
                    if (yearIndex == last24Cat.length - 1) {
                      oneMonthEMU.data[0].data.push(obj["data"][yearIndex]);
                    }
                  }
                  if (
                    !oneMonthEMU.agreCategories.includes(mobj.parent) &&
                    yearIndex == last24Cat.length - 1
                  ) {
                    oneMonthEMU.agreCategories.push(mobj.parent);
                  }
                  if (yearIndex == last24Cat.length - 1) {
                    oneMonthAgreEMU = oneMonthAgreEMU + obj["data"][yearIndex];
                  }
                });
              }
              //for dhs values
              let findindhs = dhsSeries.filter((obj) => {
                return sunMethod == obj.trans_name; //line no 2609
              });
              if (findindhs.length) {
                findindhs.forEach((obj) => {
                  if (yearIndex == last24Cat.length - 1) {
                    oneMonthEMU.data[1].data.push(obj["data"][yearIndex]);
                  }

                  if (yearIndex == last24Cat.length - 1) {
                    saveoneMonthAgreDHS =
                      saveoneMonthAgreDHS + obj["data"][yearIndex];
                  }
                });
              }
            });
            // actObj.data.push(agreEmu);

            if (yearIndex == last24Cat.length - 1) {
              oneMonthEMU.agreData[0].data.push(oneMonthAgreEMU);
              oneMonthEMU.agreData[1].data.push(saveoneMonthAgreDHS);
            }
          });
          // emuByMethodChart.agreData.push(actObj);

          categories.forEach((year, yearIndex) => {
            //for all months
            let saveAgreEMU = 0;
            mobj.subInd.forEach((subMethod, subi) => {
              let findAllinArray = trendChartSaveSeries.filter((obj) => {
                return subMethod == obj.name; //line no 2609
              });

              if (findAllinArray.length) {
                findAllinArray.forEach((obj) => {
                  // console.log(obj, yearIndex, findAllinArray);

                  saveAgreEMU = saveAgreEMU + obj["data"][yearIndex];
                  saveObj.color = obj.color;
                  // console.log(sum);
                });
              }
            });
            saveObj.data.push(saveAgreEMU);
          });
          emuByMethodChart.agreData.push(saveObj);
        }
      });
      emuByMethodChart.agreTableData.push({ data: [], name: "EMU" });
      emuByMethodChart.methodTableData.push({ data: [], name: "EMU" });
      emuByMethodChart.tableData.push({ data: [], name: "EMU" });
      last24Cat.forEach((year, yearIndex) => {
        let tableObj = {};
        tableObj["Period"] = this.$moment(year, "YYYYMM").format("MMM YYYY");
        emuByMethodChart.agreData.forEach((obj) => {
          tableObj[obj.name] = obj.data[yearIndex];
        });
        emuByMethodChart.agreTableData[0].data.push(tableObj);
        let actTablObj = {};
        actTablObj["Period"] = this.$moment(year, "YYYYMM").format("MMM YYYY");
        secondChartSeries.forEach((obj) => {
          actTablObj[obj.name] = obj.data[yearIndex];
        });
        emuByMethodChart.tableData[0].data.push(actTablObj);
      });
      //one month emu tables

      oneMonthEMU.categories.forEach((method, ind) => {
        let emuTable = {};
        emuTable["Method"] = method;
        oneMonthEMU.data.forEach((obj) => {
          emuTable[obj.name] = obj.data[ind];
        });
        oneMonthEMU.tableData[0].data.push(emuTable);
      });
      oneMonthEMU.agreCategories.forEach((method, ind) => {
        let emuAgreTable = {};
        emuAgreTable["Method"] = method;
        oneMonthEMU.agreData.forEach((obj) => {
          emuAgreTable[obj.name] = obj.data[ind];
        });
        oneMonthEMU.agreTableData[0].data.push(emuAgreTable);
      });
      emuByMethodChart.methodTableData = emuByMethodChart.tableData;
      oneMonthEMU.methodTableData = emuByMethodChart.tableData;
      oneMonthEMU.methodCategories = oneMonthEMU.categories;
      let trendEmuByMethodChart = this.getOtherChartDeatils(
        "emu_monthly",
        { ...emuByMethodChart },
        4,
        "stacked"
      );
      let methodEmuByMethodChart = this.getOtherChartDeatils(
        "emu_monthly",
        { ...emuByMethodChart },
        5,
        "line"
      );
      oneMonthEMU = this.getOtherChartDeatils(
        "emu_monthly",
        oneMonthEMU,
        6,
        "column"
      );
      let totalEMUObj = {
        data: [
          { name: "EMU", data: [], color: this.staticColors["emuColor"] },
          { name: "DHS", data: [], color: this.staticColors["dhsColor"] },
        ],
        categories: last24Cat.map((period) =>
          this.$moment(period, "YYYYMM").format("MMM YYYY")
        ),
        saveData: [
          { name: "EMU", data: [], color: this.staticColors["emuColor"] },
          { name: "DHS", data: [], color: this.staticColors["dhsColor"] },
        ],
        saveCategories: categories.map((period) =>
          this.$moment(period, "YYYYMM").format("MMM YYYY")
        ),
        tableData: [{ name: "CompEMU", data: [] }],
      };
      last24Cat.forEach((year, yearIndex) => {
        let val = 0,
          dhsVal = 0;
        trendChartSeries.forEach((obj, index) => {
          val = val + (obj["data"][yearIndex] ? obj["data"][yearIndex] * 1 : 0);
        });
        dhsSeries.forEach((obj, index) => {
          dhsVal =
            dhsVal + (obj["data"][yearIndex] ? obj["data"][yearIndex] * 1 : 0);
        });
        totalEMUObj.data[0].data.push(val.toFixed(2) * 1);
        totalEMUObj.data[1].data.push(dhsVal);
        let tableObj = {};
        tableObj["Period"] = this.$moment(year, "YYYYMM").format("MMM YYYY");
        tableObj["EMU"] = val;
        tableObj["DHS"] = dhsVal;
        totalEMUObj.tableData[0].data.push(tableObj);
      });
      categories.forEach((year, yearIndex) => {
        let val = 0,
          dhsVal = 0;
        trendChartSaveSeries.forEach((obj) => {
          val = val + obj.data[yearIndex];
        });
        totalEMUObj.saveData[0].data.push(val);
        dhsSaveSeries.forEach((obj, index) => {
          dhsVal =
            dhsVal + (obj["data"][yearIndex] ? obj["data"][yearIndex] * 1 : 0);
        });
        totalEMUObj.saveData[1].data.push(dhsVal);
      });
      totalEMUObj = this.getOtherChartDeatils(
        "emu_monthly",
        totalEMUObj,
        3,
        "line"
      );
      console.log(chartObj);

      chartObj["trendEmuByMethodChart"] = trendEmuByMethodChart; //second
      chartObj["methodEmuByMethodChart"] = methodEmuByMethodChart; //third
      chartObj["oneMonthEMUChart"] = oneMonthEMU; //forth
      chartObj["totalEMUChart"] = totalEMUObj; //first
      let key = this.generateKey(`monthlyCharts_${this.$i18n.locale}`);
      this.saveCharts(key, "outputCharts", chartObj, "object");
      this.saveFinalEMUcharts(chartObj);
      this.monthlyEMU = sumTotalEmu;

      //end of monthly charts
    },
    saveFinalEMUcharts(chartObj) {
      let dataStore = {};
      let key = this.generateKey(`monthlyEMU_${this.$i18n.locale}`);
      let allKeys = service.getAllKeys(false, "fp-dashboard");
      allKeys.then((keys) => {
        if (keys.data.includes(key)) {
          let oConfig = service.getSavedConfig(key, false, "fp-dashboard");
          oConfig.then((response) => {
            let oResponse = response.data;
            if (oResponse["totalEMU"]) {
              oResponse["totalEMU"] =
                typeof oResponse["totalEMU"] === "string"
                  ? JSON.parse(oResponse["totalEMU"])
                  : oResponse["totalEMU"];
              if (oResponse["totalEMU"][this.loc.split("/")[1]]) {
                oResponse["totalEMU"][this.loc.split("/")[1]] =
                  chartObj["totalEMUChart"];
              } else {
                oResponse["totalEMU"] = {
                  ...oResponse["totalEMU"],
                  [this.loc.split("/")[1]]: chartObj["totalEMUChart"],
                };
              }
            } else {
              oResponse["totalEMU"] = {
                [this.loc.split("/")[1]]: chartObj["totalEMUChart"],
              };
            }

            if (oResponse["methodTrend"]) {
              oResponse["methodTrend"] =
                typeof oResponse["methodTrend"] === "string"
                  ? JSON.parse(oResponse["methodTrend"])
                  : oResponse["methodTrend"];
              if (oResponse["methodTrend"][this.loc.split("/")[1]]) {
                oResponse["methodTrend"][this.loc.split("/")[1]] =
                  chartObj["methodEmuByMethodChart"];
              } else {
                oResponse["methodTrend"] = {
                  ...oResponse["methodTrend"],
                  [this.loc.split("/")[1]]: chartObj["methodEmuByMethodChart"],
                };
              }
            } else {
              oResponse["methodTrend"] = {
                [this.loc.split("/")[1]]: chartObj["methodEmuByMethodChart"],
              };
            }

            if (oResponse["monthTrend"]) {
              oResponse["monthTrend"] =
                typeof oResponse["monthTrend"] === "string"
                  ? JSON.parse(oResponse["monthTrend"])
                  : oResponse["monthTrend"];
              if (oResponse["monthTrend"][this.loc.split("/")[1]]) {
                oResponse["monthTrend"][this.loc.split("/")[1]] =
                  chartObj["oneMonthEMUChart"];
              } else {
                oResponse["monthTrend"] = {
                  ...oResponse["monthTrend"],
                  [this.loc.split("/")[1]]: chartObj["oneMonthEMUChart"],
                };
              }
            } else {
              oResponse["monthTrend"] = {
                [this.loc.split("/")[1]]: chartObj["oneMonthEMUChart"],
              };
            }
            if (oResponse["emuTrend"]) {
              oResponse["emuTrend"] =
                typeof oResponse["emuTrend"] === "string"
                  ? JSON.parse(oResponse["emuTrend"])
                  : oResponse["emuTrend"];
              if (oResponse["emuTrend"][this.loc.split("/")[1]]) {
                oResponse["emuTrend"][this.loc.split("/")[1]] =
                  chartObj["trendEmuByMethodChart"];
              } else {
                oResponse["emuTrend"] = {
                  ...oResponse["emuTrend"],
                  [this.loc.split("/")[1]]: chartObj["trendEmuByMethodChart"],
                };
              }
            } else {
              oResponse["emuTrend"] = {
                [this.loc.split("/")[1]]: chartObj["trendEmuByMethodChart"],
              };
            }

            // oResponse['totalEMU'] = JSON.stringify(oResponse['totalEMU'])
            // oResponse['methodTrend'] = JSON.stringify(oResponse['methodTrend'])
            // oResponse['monthTrend'] = JSON.stringify(oResponse['monthTrend'])
            // oResponse['emuTrend'] = JSON.stringify(oResponse['emuTrend'])
            service
              .updateConfig(oResponse, key, false, "fp-dashboard")
              .then((res) => {
                if (res.data.status.toLowerCase() === "ok") {
                  this.monthlyEMUChartsSaved = true;
                  // this.bshowLoader = false;
                  // this.$emit("saveEMUFinal", this.location);
                  // this.sweetAlert({
                  //   title: this.$i18n.t("data_saved_successfully"),
                  // });
                }
              });
          });
        } else {
          let totalEMU = {
              [this.loc.split("/")[1]]: chartObj["totalEMUChart"],
            },
            emuTrend = {
              [this.loc.split("/")[1]]: chartObj["trendEmuByMethodChart"],
            },
            methodTrend = {
              [this.loc.split("/")[1]]: chartObj["methodEmuByMethodChart"],
            },
            monthTrend = {
              [this.loc.split("/")[1]]: chartObj["oneMonthEMUChart"],
            };
          // dataStore = {
          //   'totalEMU': JSON.stringify(totalEMU),
          //   'emuTrend': JSON.stringify(emuTrend),
          //   'methodTrend': JSON.stringify(methodTrend),
          //   'monthTrend': JSON.stringify(monthTrend)
          // }
          dataStore = {
            totalEMU: totalEMU,
            emuTrend: emuTrend,
            methodTrend: methodTrend,
            monthTrend: monthTrend,
          };
          service
            .saveConfig(dataStore, key, false, "fp-dashboard")
            .then((res) => {
              if (res.data.status.toLowerCase() === "ok") {
                this.monthlyEMUChartsSaved = true;
                // this.bshowLoader = false;
                // this.$emit("saveEMUFinal", this.location);
                // this.sweetAlert({
                //   title: this.$i18n.t("data_saved_successfully"),
                // });
              }
            });
        }
      });
    },
    getCatOptCombo() {
      service.getCategoryOptionCombo("default").then((resp) => {
        if (resp.data) {
          let catIdArr = resp.data.categoryOptionCombos.filter((obj) => {
            return obj["displayName"] === "default";
          });
          if (catIdArr.length) {
            let cocId_t = catIdArr[0]["id"];
            this.cocId = cocId_t;
          }
        }
      });
    },
    getAllCatOptCombo() {
      service.getAllCategoryOptionCombo().then((resp) => {
        if (resp.data) {
          this.allCatOpt = resp.data.categoryOptionCombos;
        }
      });
    },
    getAnnualSectorReporting(loc) {
      let key = this.generateKey("annualSectorReporting");
      //India
      // if (!settings.country) {
      //     let appId = this.$store.state.appId ? this.$store.state.appId : "", appUserId = this.$store.state.appUserId ? this.$store.state.appUserId : ""
      //     if(appId && appUserId) {
      //     key = `${appUserId}_${appId}_annualSectorReporting_${locale}`;
      //     } else {
      //         this.showLocalStorageError()
      //         return;
      //     }
      // }
      let allKeys = service.getAllKeys(false, "fp-dashboard");
      allKeys
        .then((keys) => {
          service
            .getSavedConfig(key, false, "fp-dashboard")
            .then((appRes) => {
              let FPSource = {
                Commodities_Client: {
                  governmentHealth: "Yes",
                  ngo: "Yes",
                  otherSector: "Yes",
                  pharmacy: "Yes",
                  privateHospital: "Yes",
                  shopChurchFriend: "Yes",
                },
                Commodities_Facilities: {
                  governmentHealth: "Yes",
                  ngo: "Yes",
                  otherSector: "Yes",
                  pharmacy: "Yes",
                  privateHospital: "Yes",
                  shopChurchFriend: "Yes",
                },
                User: {
                  governmentHealth: "Yes",
                  ngo: "Yes",
                  otherSector: "Yes",
                  pharmacy: "Yes",
                  privateHospital: "Yes",
                  shopChurchFriend: "Yes",
                },
                Visits: {
                  governmentHealth: "Yes",
                  ngo: "Yes",
                  otherSector: "Yes",
                  pharmacy: "Yes",
                  privateHospital: "Yes",
                  shopChurchFriend: "Yes",
                },
              };
              let updatedFPSource = appRes.data.sectorReporting[
                loc.split("/")[1]
              ]
                ? appRes.data.sectorReporting[loc.split("/")[1]]
                : FPSource;
              this.sectorReporting = updatedFPSource; //FPSource or updatedFPSource as for MCGL it should be 100% as asked by jessica
              this.getFPSourceData(
                this.dqrConfig,
                loc,
                this.sectorReporting,
                this.defaultType
              );
            })
            .catch((res) => {
              // this.bShowLoader = false;
              //console.log(res);
            });
        })
        .catch((res) => {
          // this.bShowLoader = false;
          //console.log(res);
        });
    },
    async getReportingRate(loc, configData, sYear, defaultType) {
      let type = defaultType;
      let selectedLoc = loc;
      let yearArray = sYear.split(";");

      let repoId =
        configData["emu"][type]["reportingRate"][0]["indicator"][
          "subIndicator"
        ][0]["de"][0];
      await service
        .getAnalyticalIndicatorData(repoId, selectedLoc.split("/")[1], sYear)
        .then((response) => {
          let i,
            aRows = response.data.rows,
            nLength = aRows.length,
            oRepoRate = {};

          for (let yInd = 0; yInd < yearArray.length; yInd++) {
            let sYr = yearArray[yInd];
            let findData = aRows.find((obj) => obj[1] * 1 === sYr * 1);
            oRepoRate[sYr] = isFinite(findData && findData[3])
              ? Number(findData[3])
              : 0;
          }
          this.repoRate = oRepoRate;
          let categories = [];
          let seriesData = [];
          let catData = [];
          let repoConfig = configData["emu"][type]["reportingRate"];
          Object.keys(oRepoRate).forEach((res) => {
            categories.push(res);
            seriesData.push(oRepoRate[res]);
            catData.push({
              [this.$i18n.t("year")]: res,
              [this.$i18n.t("Reporting Rate")]: oRepoRate[res],
            });
          });

          let repoData = {
            categories: categories,
            data: [
              {
                name: this.$i18n.t("Reporting Rate"),
                data: seriesData,
                color: repoConfig[0]["indicator"]["chartOptions"]["color"],
              },
            ],
          };
          repoData.title = repoConfig[0]["indicator"]["chartName"];
          repoData.chartInfo = repoConfig[0]["indicator"]["chartInfo"];
          repoData.categoryInfo = repoConfig[0]["indicator"]["categoryInfo"];
          repoData.source = "";
          repoData.xTitle =
            repoConfig[0]["indicator"]["chartOptions"]["xAxis"]["text"] || "";
          repoData.yTitle =
            repoConfig[0]["indicator"]["chartOptions"]["yAxis"]["text"] || "";
          repoData.type = "column";
          repoData.tableData = catData;
          repoData.cid = repoConfig[0]["indicator"]["cid"];
          trimUndefinedRecursively(this.repoRate);

          this.finalAnnualSavedCharts["repoCharts"] = {};
          this.finalAnnualSavedCharts["repoCharts"] = JSON.stringify(
            compress(this.repoRate)
          );
        })
        .catch((res) => {
          console.log("reporting rate data is not available");
          this.stopProcessing(
            loc,
            "Some error ccured in accessing repo rate data",
            defaultType
          );
        });
    },
    async getFPSourceData(configData, loc, sectorReporting, defaultType) {
      let selectedLoc = loc;
      let bgConfig = configData;
      let fpData = bgConfig.emu.Background_Data.fpSourceIndicators;
      let fromDataStore = bgConfig.emu.Background_Data.bgDataSource;
      //eslint-disable-next-line
      let count = 0,
        nCount = 0,
        fpItems = [];
      let response = null;
      if (fromDataStore === "Datastore") {
        let levelid = selectedLoc.split("/")[0];
        let key = `psa_${levelid}`;
        // for India
        // if (!settings.country) {
        // let appId = this.$store.state.appId ? this.$store.state.appId : "",
        //     appUserId = this.$store.state.appUserId
        //     ? this.$store.state.appUserId
        //     : "";
        // if (appId && appUserId) {
        //     key = `psa_${levelid}`;
        // } else {
        //     this.showLocalStorageError();
        //     return;
        // }

        // }
        await service
          .getSavedConfig(key, false, "fp-dashboard")
          .then((fpRes) => {
            let fpResponse =
              fpRes && typeof fpRes.data.rows === "string"
                ? {
                    ...fpRes.data,
                    rows: decompress(JSON.parse(fpRes.data.rows)),
                  }
                : fpRes.data;
            response = fpResponse.rows.filter(
              (arr) => arr[2] === selectedLoc.split("/")[1]
            );
          })
          .catch((res) => {
            // console.log(locName);
            this.stopProcessing(
              selectedLoc,
              "FP Source data not found",
              defaultType
            );
          });
        fpData.forEach((res) => {
          res.subIndicators.forEach((r) => {
            let indId = [];
            let oData = [];
            oData["method"] = res.name;
            if (r.static_name === "Tubal Ligation (F)") {
              oData["method"] = res.name + " (F)";
            }
            if (r.static_name === "Vasectomy (M)") {
              oData["method"] = res.name + " (M)";
            }
            if (r.static_name === "Male Condom") {
              oData["method"] = res.name + " (M)";
            }
            if (r.static_name === "Female Condom") {
              oData["method"] = res.name + " (F)";
            }
            oData["submethod"] = r.name + "/" + r.static_name;
            if (r.static_name === "Male Condom") {
              oData["adjusted"] = r.adjusted ? r.adjusted : false;
            }
            r.selectedDatastoreDE.forEach((de) => {
              indId.push(de.id);

              let val = response
                ? response.find((obj) => {
                    if (obj[0] === de.id) return obj;
                    else return null;
                  })
                : null;
              var n = de.id.split(" ");
              if (val) {
                oData[n[n.length - 1]] = val[3] * 1;
              } else {
                oData[n[n.length - 1]] = null;
              }
            });
            fpItems.push(oData);
          });
        });
        this.drawChart(fpItems, selectedLoc, sectorReporting);
      } else {
        await fpData.forEach((res) => {
          res.subIndicators.forEach((r) => {
            count++;
            let indId = [];
            r.selectedDE.forEach((de) => {
              indId.push(de.id);
            });
            if (indId.length > 0) {
              nCount++;
              service
                .getAnalyticalIndicatorData(
                  indId.join(";"),
                  selectedLoc.split("/")[1],
                  this.sYear
                )
                .then((response) => {
                  let data = response.data;
                  let oData = {},
                    aRows = data.rows,
                    i,
                    nLen = aRows.length,
                    aDimensions = data.metaData.dimensions.dx,
                    nDimenLen = aDimensions.length,
                    oDataElements = {};
                  for (i = 0; i < nLen; i++) {
                    let sYear = aRows[i][1],
                      sDx = aRows[i][0],
                      nVal = aRows[i][3],
                      j;
                    oDataElements[sDx] = data.metaData.items[sDx];
                    if (!oData[sYear]) {
                      oData[sYear] = {};
                    }
                    for (j = 0; j < nDimenLen; j++) {
                      let sTemp = aDimensions[j];
                      if (oData[sYear][sTemp] === undefined) {
                        oData[sYear][sTemp] = 0;
                        oDataElements[sTemp] = data.metaData.items[sTemp];
                      }
                    }
                    oData[sYear][sDx] = nVal * 1;
                  }

                  if (Object.keys(oData).length > 0) {
                    let obj = {};
                    Object.keys(oData).forEach((resp) => {
                      obj["method"] = res.name;
                      if (r.static_name === "Tubal Ligation (F)") {
                        obj["method"] = res.name + " (F)";
                      }
                      if (r.static_name === "Vasectomy (M)") {
                        obj["method"] = res.name + " (M)";
                      }
                      if (r.static_name === "Male Condom") {
                        obj["method"] = res.name + " (M)";
                      }
                      if (r.static_name === "Female Condom") {
                        obj["method"] = res.name + " (F)";
                      }
                      obj["submethod"] = r.name + "/" + r.static_name;
                      if (
                        r.static_name === "Male Condom" ||
                        r.static_name === "Female Condom"
                      ) {
                        obj["adjusted"] = r.adjusted;
                      }
                      Object.keys(oData[resp]).forEach((data) => {
                        var n = oDataElements[data].name.split(" ");
                        obj[n[n.length - 1]] = oData[resp][data];
                      });
                    });

                    fpItems.push(obj);
                  } else {
                    let obj = {};

                    if (
                      r.static_name === "Male Condom" ||
                      r.static_name === "Female Condom"
                    ) {
                      obj["adjusted"] = r.adjusted;
                    }
                    obj["method"] = res.name;

                    if (r.static_name === "Tubal Ligation (F)") {
                      obj["method"] = res.name + " (F)";
                    }
                    if (r.static_name === "Vasectomy (M)") {
                      obj["method"] = res.name + " (M)";
                    }
                    if (r.static_name === "Male Condom") {
                      obj["method"] = res.name + " (M)";
                    }
                    if (r.static_name === "Female Condom") {
                      obj["method"] = res.name + " (F)";
                    }

                    obj["submethod"] = r.name + "/" + r.static_name;
                    obj["Hospital"] = null;
                    obj["NGO"] = null;
                    obj["Other"] = null;
                    obj["Pharmacy"] = null;
                    obj["Sector"] = null;
                    obj["Shop"] = null;
                    fpItems.push(obj);
                  }
                  if (fpItems.length === nCount) {
                    this.drawChart(fpItems, selectedLoc, sectorReporting);
                  }
                });
            }
          });
        });
      }
    },
    drawChart(fpItems, selectedLoc, sectorReporting) {
      let categories = [];
      let series = [],
        emuData = this.dqrConfig.emu,
        combinedObj = {},
        objFpNames = {
          governmentHealth: "Sector",
          ngo: "NGO",
          privateHospital: "Hospital",
          pharmacy: "Pharmacy",
          shopChurchFriend: "Shop",
          otherSector: "Other",
        },
        nFPItems = fpItems.length,
        c,
        catName = {
          Visits: "Visits",
          User: "User",
          Commodities_Client: "Commodities Client",
          Commodities_Facilities: " Commodities Facilities",
        };
      let type = this.defaultType;
      for (c = 0; c < nFPItems; c++) {
        categories.push(fpItems[c].submethod.split("/")[0]);
      }
      for (let i in emuData) {
        if (
          i !== "Background_Data" &&
          i !== "Output" &&
          emuData[i]["dataOnContraceptive"] !== "No"
        ) {
          let ofpSource = {},
            oTemp = { name: catName[i], data: [], _i: i },
            oModified = {};

          ofpSource =
            sectorReporting && sectorReporting[type]
              ? sectorReporting[type]
              : JSON.parse(JSON.stringify(emuData[i].FPSource));
          // ofpSource = JSON.parse(JSON.stringify(emuData[i].FPSource));
          // } else {
          // ofpSource = sectorReporting[i];
          //}
          for (let j in ofpSource) {
            // if (this.defaultLevel === this.selectedLevel.split("/")[0]) {
            // if (j !== "reporting" && j !== "type") {
            //     oModified[objFpNames[j]] = this.$i18n.t('backendtext.'+ofpSource[j].toLowerCase()) ;
            // }
            // // tempObj[j] = this.$i18n.t('backendtext.'+ofpSource[j].toLowerCase());
            // }else{
            if (j !== "reporting" && j !== "type") {
              oModified[objFpNames[j]] = ofpSource[j];
            }
            // tempObj[j] = ofpSource[j];
            // }
          }
          let sData = dataM.getFpSourceVals(oModified, fpItems, this.excludeAF);
          sData["aData"].forEach((d) => {
            oTemp.data.push(d);
          });
          series.push(oTemp);
          combinedObj[i] = sData["combinedObj"];
        }
      }

      let adjData = {
        adjustments: { data: series, cat: categories },
        combinedObj: combinedObj,
      };
      this.adjustmentData = adjData;
      this.adjFlag = true;
      if (this.adjustmentData && this.adjFlag && this.sYear && this.popYear) {
        this.getBackgroundData(
          this.dqrConfig,
          this.adjustmentData,
          this.globeData,
          this.sYear,
          this.loc,
          this.defaultType,
          this.popYear
        );
      }
    },
    async getBackgroundData(
      configData,
      adjustmentData,
      globData,
      sYear,
      loc,
      defaultType,
      popYear
    ) {
      let aYear = sYear.split(";");
      let pYear = popYear.split(";");
      let selectedLoc = loc;
      let bgConfig = configData;
      let defaultEMUSource = defaultType;

      let promises = [],
        aSelectedDe = [],
        response = {},
        oBackground = {},
        oBackgroundColor = {};
      response.rows = [];
      let cypGlobal = {};
      Object.keys(globData.cyp).forEach((contName) => {
        cypGlobal[contName] = {};
        globData.cyp[contName].chartData.forEach((ind) => {
          ind.indicator.subIndicator.forEach((sub) => {
            let subName = Array.isArray(sub.name)
              ? sub.name[this.$i18n.locale]
              : sub.name;
            cypGlobal[contName][subName] = sub.cyp;
          });
        });
      });
      let aAdjCats = adjustmentData.adjustments.cat,
        aAdjTypes = adjustmentData.adjustments.data,
        oFinalAdjTypes = {};
      aAdjTypes.forEach((ele) => {
        let { _i, data } = ele;
        oFinalAdjTypes[_i] = {};
        aAdjCats.forEach((categ, jndex) => {
          oFinalAdjTypes[_i][categ] = data[jndex]
            ? data[jndex].toFixed(3) * 1
            : 0;
        });
      });
      //setPopType(bgConfig.emu.Background_Data.FPWomenPopulation);
      bgConfig.emu.Background_Data.backgroundIndicators.forEach(
        (bg, bgindex) => {
          let bgStore = bg.bgDataSource;
          let subIndicators = bg.subIndicators;
          for (let j = 0; j < subIndicators.length; j++) {
            let sName =
                typeof subIndicators[j].name == "object"
                  ? subIndicators[j].name[this.$i18n.locale]
                  : subIndicators[j].name,
              aSelectedDE =
                bgStore === "Datastore"
                  ? subIndicators[j].selectedDatastoreDE
                  : subIndicators[j].selectedDE;
            oBackground[sName] = aSelectedDE.map((ele) => {
              if (ele.static_displayName) {
                return (
                  ele.id +
                  "/" +
                  (typeof ele.static_displayName == "object"
                    ? ele.static_displayName[this.$i18n.locale]
                    : ele.static_displayName)
                );
              } else {
                return ele.id;
              }
            });
            oBackgroundColor[sName] = subIndicators[j].color;
          }
          let keyName =
            bgindex === 0 ? "population_" : bgindex === 1 ? "mcpr_" : "mcmm_";
          if (bgStore === "Datastore") {
            let levelid = selectedLoc.split("/")[0];
            let popType = bgConfig.emu.Background_Data.FPWomenPopulation;
            popType = popType.toLowerCase();
            let key = `${keyName}${popType}_${levelid}`;
            // for India
            // if (!settings.country) {
            //   let appId = this.$store.state.appId ? this.$store.state.appId : "",
            //   appUserId = this.$store.state.appUserId
            //     ? this.$store.state.appUserId
            //     : "";
            //   if (appId && appUserId) {
            //     key = `${keyName}${popType}_${levelid}`;
            //   } else {
            //     this.showLocalStorageError();
            //     return;
            //   }
            // }
            promises.push(service.getSavedConfig(key, false, "fp-dashboard"));
          } else {
            let allDES = [];
            for (let j = 0; j < subIndicators.length; j++) {
              subIndicators[j].selectedDE.map((ele) => {
                allDES.push(ele);
              });
            }
            allDES.forEach((ele) => {
              aSelectedDe.push(ele.id);
            });
          }
        }
      );
      if (promises.length) {
        await Promise.all(promises)
          .then((results) => {
            results.forEach((resultResponse, i) => {
              let resultRes =
                resultResponse && typeof resultResponse.data.rows === "string"
                  ? {
                      ...resultResponse.data,
                      rows: decompress(JSON.parse(resultResponse.data.rows)),
                    }
                  : resultResponse.data;
              if (i === 0) {
                response = {
                  ...resultRes.data,
                  rows: resultRes.rows.filter(
                    (arr) => arr[2] === selectedLoc.split("/")[1]
                  ),
                };
              } else {
                resultRes.rows.forEach((arr) => {
                  if (arr[2] === selectedLoc.split("/")[1]) {
                    response.rows.push(arr);
                  }
                });
              }
            });
          })
          .catch((res) => {
            //console.log(res);
          });
      }
      if (aSelectedDe.length) {
        let sSelectedDEs = aSelectedDe.join(";");
        await service
          .getAnalyticalIndicatorData(
            sSelectedDEs,
            selectedLoc.split("/")[1],
            popYear
          )
          .then((dataresponse) => {
            if (promises.length === 0) {
              response = dataresponse.data;
            } else {
              response.rows = [...response.rows, ...dataresponse.data.rows];
            }
          })
          .catch((res) => {
            //console.log(res);
          });
      }
      if (response && response.rows.length) {
        let oFinalData = dataM.getFormatedBackGroundData(
          response,
          oBackground,
          pYear
        );
        let oTemp = oFinalData.final,
          odata = adjustmentData,
          ocontdata = dataM.getComputedContFact(
            JSON.parse(JSON.stringify(globData.continuation))
          );
        console.log(oTemp, "bgdata from DM");
        this.population = oTemp["Population (MWRA)"] || oTemp.Population;
        let oBgdata = {
          population: oTemp["Population (MWRA)"] || oTemp.Population,
          UNPD: oTemp.UNPD,
          PMA: oTemp["PMA"],
          PMS: oTemp["PMA"],
          FPET: oTemp["FPET"],
          MICS: oTemp.MICS,
          DHS: oTemp.DHS,
          methodMix: oFinalData.methodMix,
          continuation: ocontdata,
          cyp: cypGlobal,
          adjustmentFactor: odata.adjustmentFactor,
          adjustmentFactorTypeWise: oFinalAdjTypes,
          recentYear: oFinalData.recentYear,
          defaultEMUSource: defaultEMUSource,
          bgIndColor: oBackgroundColor,
        };
        this.bgData = oBgdata;
        this.bgDataFound = true;
        this.monthlyStart = true;
        console.log("bg data", this.bgData);
      } else {
        this.bgDataFound = false;
        this.stopProcessing(
          selectedLoc,
          "Background Data not found",
          defaultType
        );
      }
    },
    stopProcessing(val, errorText = "", dataType) {
      this.annualStart = false;
      this.monthlyStart = false;
      this.annaulEMUChartsUpdated = false;
      this.start = false;
      this.adjustmentData = null;
      this.adjFlag = false;
      this.repoRate = null;
      this.bgDataFound = false;
      this.bgData = null;
      this.isGlobalConfig = false;
      this.gConfig = null;
      this.bRequestFlag = false;
      this.adjNonAdjCalcData = null;
      this.annualEMU = null;
      this.DataElementIDinc = null;
      this.DataElementIDex = null;
      //forMonthly
      this.continuation = null;
      this.monthlyEMUChartsSaved = false;
      this.population = null;
      this.monthlyPopulation = null;
      this.backgroundData = null;
      this.globalChartConfig = null;
      this.bRequestFlagMonthly = false;
      this.isChartConfigUpdated = false;
      this.users = null;
      this.newUsers = null;
      this.histUsers = null;
      this.monthlyEMU = null;
      this.DataElementID = null;
      this.deProcess = false;
      // this.$emit("sendStart", false);
      this.saveJson(false);
      //eslint-disable-next-line
      this.$emit("getLocs", val, errorText, dataType);
      //eslint-disable-next-line
    },
    setValues() {
      let configData = this.dqrConfig;
      if (this.start && configData && this.defaultType) {
        this.disableChart =
          this.dqrConfig.emu[this.defaultType]["reportingRate"][0]["indicator"][
            "disableChart"
          ];
        let tp =
          this.defaultType === "Commodities_Client"
            ? "Commodities Client"
            : this.defaultType === "Commodities_Facilities"
            ? "Commodities Facilities"
            : this.defaultType;
        let emuInc = configData["emu"][this.defaultType]["incCondomEMU"]
          ? configData["emu"][this.defaultType]["incCondomEMU"]
          : "EMU: " + tp + " - Inc. Condom";

        let emuEx = configData["emu"][this.defaultType]["excCondomEMU"]
          ? configData["emu"][this.defaultType]["excCondomEMU"]
          : "EMU: " + tp + " - Exc. Condom";
        let monthlyEMU = configData["emu"][this.defaultType]["monthlyEMU"]
          ? configData["emu"][this.defaultType]["monthlyEMU"]
          : "Monthly EMU : " + tp;
        let userAdjusted = configData["emu"][this.defaultType]["userAdjusted"]
          ? configData["emu"][this.defaultType]["userAdjusted"]
          : "User Adjusted -" + tp;
        let userUnadjusted = configData["emu"][this.defaultType][
          "userUnadjusted"
        ]
          ? configData["emu"][this.defaultType]["userUnadjusted"]
          : "User Unadjusted -" + tp;

        let monthlyEMUByMethod = configData["emu"][this.defaultType][
          "monthlyEMUByMethod"
        ]
          ? configData["emu"][this.defaultType]["monthlyEMUByMethod"]
          : "Monthly EMU (Method wise): " + tp;
        this.excludeAF =
          configData["emu"]["Background_Data"]["adjustmentFactor"];
        this.deNameInc = emuInc;
        this.deNameEx = emuEx;
        this.deName = monthlyEMU;
        this.userAdjustedDE = userAdjusted;
        this.userUnadjustedDE = userUnadjusted;
        this.totalEMUByMethodDEName = monthlyEMUByMethod;
        this.annualStart = true;
      }
    },
  },
  created() {
    // this.start = this.startP;
    if (this.start) this.setValues();
  },
};
</script>
