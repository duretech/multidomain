<template>
  <div class="hide"></div>
</template>
<script>
import service from "@/service";
import { compress, decompress } from "compress-json";
import {
  getFormatedData,
  getFinalChartData,
  getFinalTotalCYP,
  getTotalCYP,
  getYearFormated,
  getFormatedBackGroundData,
  getComputedContFact,
  getYearFormatedMonthly,
  calculateSTMNotAdjusted,
  getSumOfCont,
  calculateNewBU,
  getFinaladjNonAdjData,
  getuserTrendsbyEmuForSlope,
  getuserTrendsbyEmu,
  getSumOfContMonthly,
  getFpSourceVals,
  getChartFormatedData,
  getChartFormatedDataMonthly,
  getUserTrendsData,
  getUserTrendsDatafromSurvey,
  getSurveyWiseData,
  combinedComparisonEstimate,
  comarisonEstimateColumnChart,
  getadjNonAdjLineChart,
  getadjNonAdjBarChart,
  getMethodMixServicePie,
  getSlopData,
} from "./DataMassaging.js";
export default {
  props: [
    "startP",
    "dqrConfig",
    "globeData",
    "loc",
    "deList",
    "defaultType",
    "dataElementList",
    "EMULocation",
    "categoryOptionID",
    "methodCatId",
  ],
  data() {
    console.log(this.dqrConfig, this.defaultType, this.startP);
    return {
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
    startP(newVal) {
      console.log("watch called startP", newVal);
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
    // annualInputChartData: {
    //   handler(val) {
    //     if (val.length > 0) {
    //       console.log(val, "annualInputChartData watch called");
    //     }
    //   },
    //   deep: true,
    // },
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
        this.startYearM = sStartYear;
        let curr_date = this.$moment().format("YYYY-MM");
        let months = configData["emu_monthly"][defaultType]["backTrackingMonth"]
          ? configData["emu_monthly"][defaultType]["backTrackingMonth"]
          : 1;
        let lYear = this.$moment(curr_date, "YYYY-MM")
          .subtract(months, "months")
          .format("YYYY");
        this.endYearM = lYear;
        let startDate = this.$moment(sStartYear, "YYYY"),
          endDate = this.$moment(lYear).add(1, "year"),
          monthsArr = [];
        while (startDate.isBefore(endDate)) {
          monthsArr.push(startDate.format("YYYYMM"));
          startDate.add(1, "month");
        }

        let sYearMonthly = monthsArr.join(";");

        this.sYearMonthly = sYearMonthly;
        this.monthContinuation(this.globeData, sStartYear, lYear, defaultType);
        this.getPopulationData(configData, this.loc, sStartYear, lYear);
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
        let yrStr = getYearFormated(stYear, lYear);

        let bgLastYear =
          configData["emu"]["Background_Data"]["SSDataRecentYear"];
        let popYearStr = getYearFormated(stYear, bgLastYear);
        console.log("population year", popYearStr);
        this.popYear = popYearStr;
        this.sYear = yrStr;
        let startDate = this.$moment(stYear, "YYYY"),
          endDate = this.$moment(lYear).add(1, "year"),
          monthsArr = [];

        while (startDate.isBefore(endDate)) {
          monthsArr.push(startDate.format("YYYYMM"));
          startDate.add(1, "month");
        }

        let sYearMonthly = monthsArr.join(";");
        this.sYearMonthly = sYearMonthly;
        //calling annual basic functions
        if (this.sYear && this.loc && this.defaultType) {
          ////console.log("Calling sYear useeffect getAnnualSectorReporting");
          this.getCatOptCombo();
          this.getAllCatOptCombo();
          this.getAnnualSectorReporting(this.loc);
          if (!this.disableChart) {
            this.getReportingRate(
              this.loc,
              this.dqrConfig,
              this.sYear,
              this.defaultType
            );
          }
        }
      }
    },
    start(newVal) {
      console.log("calling start", newVal, this.startP);
      if (this.startP) this.start = this.startP;
      if (newVal) this.setValues();
    },
  },
  methods: {
    saveJson(noalert = true) {
      // console.log(this.dqrConfig);
      //this.$store.commit("setLoading", true);
      service
        .updateConfig(this.dqrConfig, "dqrModule_en", false, "fp-dashboard")
        .then((resp) => {
          if (resp.data.status === "OK") {
            //this.$store.commit("setLoading", false);
            if (noalert)
              this.$swal({
                title: "Data updated successfully.",
                type: "success",
              }).then(() => {});
          }
        })
        .catch((err) => {
          service
            .saveConfig(this.dqrConfig, "dqrModule_en", false, "fp-dashboard")
            .then((resp) => {
              if (resp.data.status === "OK") {
                // this.$store.commit("setLoading", false);
                if (noalert)
                  this.$swal({
                    title: "Data saved successfully.",
                    type: "success",
                  }).then(() => {});
              }
            })
            .catch((er) => {
              // this.$store.commit("setLoading", false);
              if (noalert)
                this.$swal({
                  title: "Something went wrong. Please try again later.",
                  type: "error",
                }).then(() => {});
            });
        });
    },
    async getDE(deList, dataEleName, catcomboid) {
      let isExistDEArAdj = deList.filter((obj) => {
        return obj["displayName"] === dataEleName;
      });
      if (isExistDEArAdj.length) {
        //console.log("Data Element already exist", isExistDEAr);
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
            //console.log("create ID");
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
            ////console.log(createJson);
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
                console.log(res, "in catch DE");
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
      console.log("in uploadFile function", monthlyEMUbyMethod);
      Object.keys(monthlyEMUbyMethod).forEach((method) => {
        let innerObj = monthlyEMUbyMethod[method];
        Object.keys(innerObj).forEach((year) => {
          let val = innerObj[year];
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
        });
      });

      let adjNonAdjCalcData = this.adjNonAdjCalcData,
        annualEMU = this.annualEMU,
        monthlyEMU = this.monthlyEMU;

      console.log("in uploadFile function", adjNonAdjCalcData);
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
      Object.keys(monthlyEMU).forEach((period) => {
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
      });
      await service
        .uploadJson(finalIncJson)
        .then((resp) => {
          ////console.log(resp);
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
                ////console.log(taskResp);
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
      // if(status === "Calculation Done")
      // {
      console.log(
        "fetchdata method called",
        this.methodCatId,
        this.categoryOptionID
      );
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
        console.log(
          this.DataElementIDinc,
          this.DataElementIDex,
          this.DataElementID,
          "Data Elements"
        );

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

      let allYear = getYearFormatedMonthly(startYearM, endYearM * 1 + 1);
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
        if (!population) {
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
              this.population = popObj;
            })
            .catch((res) => {});
        } else {
          popObj = this.population;
        }
        let oPopulation = {};
        Object.keys(popObj).forEach((key) => {
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
        });
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
        Object.keys(popObj).forEach((key) => {
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
        });
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
        if (this.monthlyPopulation && this.population) {
          this.getMonthlyBackgrounData();
          this.generateFormatedData();
        }
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
      let stYear = this.startYearM;
      let eYaer = this.endYearM;
      let startDate = this.$moment(stYear, "YYYY"),
        endDate = this.$moment(eYaer).add(1, "year"),
        months = [];

      while (startDate.isBefore(endDate)) {
        months.push(startDate.format("YYYYMM"));
        startDate.add(1, "month");
      }
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
                let sKey = de.static_name;

                if (!oData[sKey]) {
                  oData[sKey] = {};
                }
                let ids = [],
                  dName = {};

                Object.keys(de["selectedDatastoreDE"]).forEach((sde) => {
                  ids.push(de["selectedDatastoreDE"][sde]["id"]);
                  dName[de["selectedDatastoreDE"][sde]["id"]] =
                    de["selectedDatastoreDE"][sde]["static_displayName"];
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
                          oData[sKey][statName] = {
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
            let sKey = de.static_name;

            if (!oData[sKey]) {
              oData[sKey] = {};
            }
            let ids = [],
              dName = [];

            Object.keys(de["selectedDE"]).forEach((sde) => {
              ids.push(de["selectedDE"][sde]["id"]);
              dName.push({
                [de["selectedDE"][sde]["id"]]:
                  de["selectedDE"][sde]["updatedName"],
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
      let oRet = getFormatedData(
        this.dqrConfig.emu[type],
        this.startYear,
        selectedLoc.split("/")[1],
        this.bgData.cyp[type],
        this.bgData.continuation[type]
      );
      let globalConfig = oRet.data;
      this.totalCyp = oRet.totalCYP;
      this.finalMethodArr = oRet.finalMethodArr;
      this.methodSeq = oRet.methodSeq;
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
        aFinalCharts.push(getFinalChartData(aChartArr[i], ochartConfig));
      }

      aFinalCharts.push(
        getFinalTotalCYP(getTotalCYP(aChartArr), ochartConfig, this.totalCyp)
      );

      this.annualInputChartData = aFinalCharts;
      console.log("annualInputChartData", this.annualInputChartData);
      if (this.annualInputChartData.length > 0) {
        this.saveCharts(
          "annualCharts_en",
          "inputCharts",
          this.annualInputChartData
        );
      }
      // dataM.saveChartColors(aFinalCharts, this.tabName);
      // console.log(this.aFinalInputData);
    },
    async getAllDataelemsData() {
      let selectedLoc = this.loc;
      let gConfig = this.gConfig;
      let startDate = this.$moment(this.startYear, "YYYY"),
        endDate = this.$moment(this.endYear).add(1, "year"),
        months = [];

      while (startDate.isBefore(endDate)) {
        months.push(startDate.format("YYYYMM"));
        startDate.add(1, "month");
      }

      // this.allMonthArray = months;
      // months.sort(() => Math.random() - 0.5);
      let mntStr = months.join(";");
      //console.log(mntStr, sYear);
      let newPeriodStr = this.sYear.concat(";", mntStr);
      //console.log("newPeriodStr", newPeriodStr);

      ////console.log("calling getAllDataelemsData");
      //console.log("annual chartArr", gConfig);
      let i,
        aChart = gConfig.chartArr,
        ncLen = aChart.length,
        //sLocId = gConfig.locationId,
        sLocId = selectedLoc.split("/")[1],
        //sYear = dataM.getYearFormated(this.startYear,this.endYear),
        //sYear = getYearFormated(startYear, endYear),
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
          ////console.log(sdes)
          await service
            .getAnalyticalIndicatorData(sdes.join(";"), sLocId, newPeriodStr)
            .then(async (response) => {
              // console.log("getting response", subinpName, response);
              if (
                response !== undefined &&
                response.data &&
                response.data.rows.length
              ) {
                // console.log(
                //   "getting response with length",
                //   subinpName,
                //   response.data.rows.length
                // );

                if (!aChart[nI].charts) {
                  aChart[nI].charts = {};
                }
                if (!aChart[nI].monthlyCharts) {
                  aChart[nI].monthlyCharts = {};
                }
                if (!aChart[nI].scaling) {
                  aChart[nI].scaling = {};
                }
                // console.log(aChart[nI].charts, nI, "annual charts data");

                aChart[nI].charts = getChartFormatedData(
                  response.data.rows,
                  aChart[nI].dataElems[nJ],
                  aChart[nI].charts,
                  this.sYear
                );
                // console.log(aChart[nI].charts, "annual charts data");
                aChart[nI].monthlyCharts = getChartFormatedDataMonthly(
                  response.data,
                  aChart[nI].dataElems[nJ],
                  aChart[nI].monthlyCharts,
                  mntStr
                );
                // console.log(aChart[nI].monthlyCharts, "monthly charts data");
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
        console.log("Input data fetched");

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
        // getIndividualOrganisation(selectedLoc.split('/')[1]).then(key => {
        //   // //console.log(key)
        //   //console.log("location" + key.data.displayName + "Error NO Data found for" - alertSt)
        //   //   this.bshowLoader=false;
        // })
        // return "location"+ service.getLocationName(this.location.split('/')[1])+ "Error" - mainAlertSt;
        //  return this.location;
      }
    },
    getOtherChartDeatils(emutype, obj, index, type) {
      obj.title =
        this.dqrConfig[emutype][this.defaultType]["derivedCharts"][index][
          "chartOptions"
        ]["chartName"];
      obj.source = "";
      obj.xTitle =
        this.dqrConfig[emutype][this.defaultType]["derivedCharts"][index][
          "chartOptions"
        ]["xAxis"]["text"];
      obj.yTitle =
        this.dqrConfig[emutype][this.defaultType]["derivedCharts"][index][
          "chartOptions"
        ]["yAxis"]["text"];
      obj.disable =
        this.dqrConfig[emutype][this.defaultType]["derivedCharts"][index][
          "chartOptions"
        ]["disableChart"];
      obj.cid =
        this.dqrConfig[emutype][this.defaultType]["derivedCharts"][index][
          "chartOptions"
        ]["cid"];
      obj.chartInfo =
        this.dqrConfig[emutype][this.defaultType]["derivedCharts"][index][
          "chartOptions"
        ]["chartInfo"];
      obj.type = type;
      return obj;
    },
    getOutComAdjustment() {
      let chartObj = [],
        outputChartObj = {};
      let type = this.defaultType,
        bgData = this.bgData;
      this.sYearArray = this.sYear.split(";");
      // console.log(
      //   "calling getOutComAdjustment",
      //   bgData,
      //   this.gConfig.chartArr,
      //   this.repoRate,
      //   this.disableChart
      // );
      //setStatus("Long term and Short term methods calculation is started.")
      let allMethodsAdjusted = { adjusted: {}, nonAdjusted: {} };

      let oAdjustmentFactors =
        bgData.adjustmentFactorTypeWise[type] || bgData.adjustmentFactor;
      let oSTMAdjusment = calculateSTMNotAdjusted(
        this.gConfig.chartArr,
        this.repoRate,
        oAdjustmentFactors,
        this.disableChart
      );

      // //console.log(type, "Short term methods calculation", repoRate, oSTMAdjusment);
      // //console.log("Continuation factor ", bgData.continuation[type]);
      let aSumOfCont = getSumOfCont(bgData.continuation[type]);
      // bIsUser = this.tabName === "fp_users";
      ////console.log(type, "aSumOfContinuation", aSumOfCont);
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

      let newBaseLineUsers = calculateNewBU(
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

      let adjNonAdjData = getFinaladjNonAdjData(allMethodsAdjusted);
      console.log("adjNonAdjData", adjNonAdjData);
      let methodWiseAdjObject = adjNonAdjData.adjusted;
      //setStatus("EMU Calculation started")
      let userTrendsbyEmu = getuserTrendsbyEmu(
        this.sYear,
        methodWiseAdjObject,
        bgData.population
      );
      this.annualEMU = userTrendsbyEmu;

      // Outputchart craetion start
      let oUserTrends = getUserTrendsData(
        this.tabName,
        this.finalMethodArr,
        this.sYearArray,
        methodWiseAdjObject
      );
      //console.log("oUserTrendsNew",oUserTrendsNew);
      // console.log("oUserTrends",oUserTrends);
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

      let surveyData = getSurveyWiseData(
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
      let combinedComparisonEstimateChart = combinedComparisonEstimate(
        this.currentYear,
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
      let MordernUsersByMethodsData = comarisonEstimateColumnChart(
        this.currentYear,
        this.finalMethodArr,
        this.sYearArray,
        methodWiseAdjObject,
        surveyData
      );
      MordernUsersByMethodsData = this.getOtherChartDeatils(
        "emu",
        MordernUsersByMethodsData,
        2,
        "column"
      );
      outputChartObj["MordernUsersByMethodsData"] = MordernUsersByMethodsData;

      let adjNonAdjLineChart = getadjNonAdjLineChart(
        this.sYearArray,
        this.finalMethodArr,
        adjNonAdjData,
        surveyData
      );
      let lineAdNonAdChartData = this.getOtherChartDeatils(
        "emu",
        adjNonAdjLineChart,
        8,
        "line"
      );
      outputChartObj["lineAdNonAdChartData"] = lineAdNonAdChartData;

      let adjNonAdjBarChart = getadjNonAdjBarChart(
        this.currentYear,
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

      let methodMixService = getMethodMixServicePie(
        this.currentYear,
        this.finalMethodArr,
        this.sYearArray,
        methodWiseAdjObject,
        this.bgData.methodMix
      );
      let MixComparisionData = this.getPieChart(methodMixService);
      outputChartObj["MixComparisionData"] = MixComparisionData;

      let dhsData = this.bgData.DHS ? this.bgData.DHS : {};
      let pmaData = this.bgData.PMA ? this.bgData.PMA : {};
      let userTrendsByMethodSurvey = getUserTrendsDatafromSurvey(
        this.sYearArray,
        unpdData,
        dhsData,
        pmaData,
        this.bAllWomen,
        this.bgData["bgIndColor"],
        unpdtext
      );
      let aSource = {
        Commodities_Client: this.$i18n.t("commodities_to_clients"),
        Visits: this.$i18n.t("fp_visits"),
        Commodities_Facilities: this.$i18n.t("commodities_to_facility"),
        User: this.$i18n.t("fp_users"),
      };
      userTrendsbyEmu = getuserTrendsbyEmuForSlope(
        this.sYearArray,
        methodWiseAdjObject,
        oPopulation,
        userTrendsByMethodSurvey,
        aSource[this.defaultType]
      );
      let userTrendsByMethod = this.getOtherChartDeatils(
        "emu",
        userTrendsbyEmu,
        4,
        "line"
      );
      outputChartObj["userTrendsByMethod"] = userTrendsByMethod;

      let slopeData = getSlopData(userTrendsbyEmu);
      let comparisionSlope = this.getOtherChartDeatils(
        "emu",
        slopeData,
        5,
        "bar"
      );
      outputChartObj["comparisionSlope"] = comparisionSlope;
      outputChartObj["methodWiseAdjObject"] = methodWiseAdjObject;
      outputChartObj["userTrendsbyEmu"] = userTrendsbyEmu;

      //console.log("comparisionSlope by ashvini", this.comparisionSlope);
      // console.log("adjNonAdjData.adjusted",adjNonAdjData.adjusted);
      // if (this.getData) {
      //   this.getData(this.tabName, methodWiseAdjObject, "userT", this.filter);
      // }
      // if (this.getData) {
      //   this.getData(this.tabName, this.comparisionSlope, "slope", this.filter);
      // }
      // //console.log("userTrendsbyEmu",this.userTrendsByMethod)
      // if (this.getData) {
      //   this.getData(this.tabName, userTrendsbyEmu, "output", this.filter);
      // }
      chartObj.push(outputChartObj);
      this.saveCharts("annualCharts_en", "outputCharts", chartObj);
      // Outputchart craetion end
    },
    saveCharts(dataStoreKey, key, chartData) {
      //"annualCharts_en"
      console.log(key, chartData);
      service
        .getSavedConfig(dataStoreKey, false, "fp-dashboard")
        .then((resp) => {
          console.log(resp, "getdata from api");
          if (resp && resp.data) {
            let annualCharts = resp.data;
            if (!annualCharts[this.loc.split("/")[1]])
              annualCharts[this.loc.split("/")[1]] = {};
            if (!annualCharts[this.loc.split("/")[1]][this.defaultType])
              annualCharts[this.loc.split("/")[1]][this.defaultType] = {};
            if (!annualCharts[this.loc.split("/")[1]][this.defaultType][key])
              annualCharts[this.loc.split("/")[1]][this.defaultType][key] = [];
            annualCharts[this.loc.split("/")[1]][this.defaultType][key] =
              JSON.stringify(compress(chartData));
            console.log(annualCharts);
            service
              .updateConfig(annualCharts, dataStoreKey, false, "fp-dashboard")
              .then((resp) => {
                if (resp.data.status === "OK") {
                  // this.$store.commit("setLoading", false);
                  // if (noalert)
                  //   this.$swal({
                  //     title: "Data saved successfully.",
                  //     type: "success",
                  //   }).then(() => {});
                  console.log("annual charts saved");
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
                      console.log("annual charts key created");
                    }
                  });
              });
          }
        })
        .catch((err) => {
          console.log("in outer catch", err);
          let annualCharts = {};
          if (!annualCharts[this.loc.split("/")[1]])
            annualCharts[this.loc.split("/")[1]] = {};
          if (!annualCharts[this.loc.split("/")[1]][this.defaultType])
            annualCharts[this.loc.split("/")[1]][this.defaultType] = {};

          if (!annualCharts[this.loc.split("/")[1]][this.defaultType][key])
            annualCharts[this.loc.split("/")[1]][this.defaultType][key] = [];
          annualCharts[this.loc.split("/")[1]][this.defaultType][key] =
            JSON.stringify(compress(chartData));
          service
            .saveConfig(annualCharts, dataStoreKey, false, "fp-dashboard")
            .then((resp) => {
              if (resp.data.status === "OK") {
                console.log("annual charts key created");
              }
            });
        });
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
      //console.log(oResponse, this.tabName, this.location.split('/')[1])
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
          let name = "";
          Object.keys(this.continuation[type][cont]).forEach((c) => {
            if (
              a["monthlyCharts"] !== undefined &&
              a["monthlyCharts"][c] !== undefined
            ) {
              Object.keys(a["monthlyCharts"][c]).forEach((key, i) => {
                let newKey = key.split("/");

                if (newKey[1] === cont) {
                  name = a.name;
                  methodArr[cont]["name"] = name;

                  methodArr[cont]["subname"] = newKey[1];

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
            subname: methodArr[j].subname,
          };
          oNewUsers[j] = {
            vals: {},
            name: methodArr[j].name,
            subname: methodArr[j].subname,
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
      contSum = getSumOfContMonthly(continuation[type]);
      let historicUsers = {};
      Object.keys(newUsers).forEach((method, i) => {
        historicUsers[method] = {
          vals: {},
          name: newUsers[method].name,
          subname: newUsers[method].subname,
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
      let historicUsers = histUsers;
      Object.keys(users).forEach((method) => {
        totalUsers[method] = {
          vals: {},
          name: "",
          subname: "",
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
      });

      let oTemp = {};
      let totalEMUByMethod = {};
      let categories = [];
      Object.keys(totalUsers).forEach((method) => {
        let methodnName = method;
        if (!totalEMUByMethod[method]) totalEMUByMethod[method] = {};
        if (!oTemp[methodnName]) {
          oTemp[methodnName] = {
            name: totalUsers[method]["name"],
            subname: totalUsers[method]["subname"],
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
      Object.keys(totalEMUByMethod).forEach((method) => {
        Object.keys(totalEMUByMethod[method]).forEach((year) => {
          sumTotalEmu[year] =
            (sumTotalEmu[year] || 0) + totalEMUByMethod[method][year];
        });
      });
      this.monthlyEMU = sumTotalEmu;
      this.totalEMUByMethod = totalEMUByMethod;
      let firstChartSeries = [];
      console.log(this.newUsers, "this.newUsers i/p data");
      let aTable = [];
      let filterArr = [],
        mainObj = {
          id: "",
          label: "",
          children: [],
        };
      Object.keys(this.newUsers).forEach((method) => {
        let actObj = {
          data: [],
          name: method,
          mName: this.newUsers[method]["name"],
        };
        actObj.data = this.newUsers[method]["vals"];
        // Object.keys(this.newUsers[method]["vals"]).forEach((year) => {
        // });
        firstChartSeries.push(actObj);
      });
      let firstChart = {
        data: firstChartSeries,
        max: 11,
        categories: categories,
        tableData: firstChartSeries,
        saveData: firstChartSeries,
        saveCategories: categories,
        filter: filterArr,
      };
      firstChart = this.getOtherChartDeatils(
        "emu_monthly",
        firstChart,
        1,
        "column"
      );
      Object.keys(this.totalEMUByMethod).forEach((method) => {
        let oMethodTable = {
          name: "",
          data: [],
          mName: "",
          trans_name: "",
        };

        let isFound = filterArr.find(
          (obj) => obj.id === this.totalEMUByMethod[method]["name"]
        );
        if (!isFound) {
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
            (obj) => obj.id === this.totalEMUByMethod[method]["name"]
          );
          if (findIndex >= 0) {
            filterArr[findIndex]["children"].push({
              id: method,
              label: method,
            });
          }
        }
        Object.keys(this.totalEMUByMethod[method]).forEach((year) => {
          let oTable = {};
          if (this.backgroundData != null) {
            Object.keys(this.backgroundData[method]).forEach((back) => {
              this.backgroundData[method][back][year] =
                this.backgroundData[method][back][year] || 0;
              oTable[back] =
                this.backgroundData[method][back][year].toFixed(2) * 1;
            });
          }
          oTable[this.$i18n.t("EMU")] = this.totalEMUByMethod[method][year];
          oMethodTable["name"] = method;
          oMethodTable["mName"] = this.totalEMUByMethod[method]["name"];
          oMethodTable["trans_name"] = this.totalEMUByMethod[method]["subname"]; //taking subname as transname
          oMethodTable["data"].push(oTable);
        });
        aTable.push(oMethodTable);
      });
      //calculate monthly charts
      let secondChart = {
        data: aTable,
        max: 11,
        categories: categories,
        tableData: aTable,
        saveData: aTable,
        saveCategories: categories,
        filter: filterArr,
      };
      secondChart = this.getOtherChartDeatils(
        "emu_monthly",
        secondChart,
        0,
        "line"
      );
      //generate Table
      // Object.keys(this.filterTableData).forEach((key) => {
      //   key = key.trim();
      //   this.selected = this.selected.trim();
      //   if (this.selected == key) {
      //     this.catArr.forEach((val, i) => {
      //       let oTable = {},
      //         dataArr = [];
      //       if (i < 24) {
      //         oTable[this.$i18n.t("period")] = this.$moment(
      //           val,
      //           "YYYYMM"
      //         ).format("MMM YYYY");
      //         let userVal = this.filterTableData[key]["totalusers"][val]
      //           ? parseInt(
      //               this.filterTableData[key]["totalusers"][val]
      //             ).toLocaleString()
      //           : 0;
      //         oTable[this.$i18n.t("Total Users")] = userVal;
      //         oTable[this.$i18n.t("emu_value_per")] = isNaN(
      //           this.filterTableData[key]["totalEMU"][i]
      //         )
      //           ? null
      //           : this.filterTableData[key]["totalEMU"][i];
      //         // let cypVal = this.cypPopVal[key]
      //         //   ? this.cypPopVal[key][val]
      //         //   : null;
      //         oTable["Population"] = this.monthlyPopulation[val]
      //           ? this.monthlyPopulation[val].toLocaleString()
      //           : "NA";
      //         /* commented to remove CYPs/Population */
      //         //oTable[this.$i18n.t('cyp_pop')] = cypVal == 'NaN' ? null : cypVal
      //         this.items.push(oTable);
      //         dataArr.push(this.$moment(val, "YYYYMM").format("MMM YYYY"));
      //         dataArr.push(userVal);
      //         dataArr.push(this.filterTableData[key]["totalEMU"][i] || null);
      //         // dataArr.push(cypVal == "NaN" ? null : cypVal);
      //         dataArr.push(
      //           this.monthlyPopulation[val] ? this.monthlyPopulation[val] : "NA"
      //         );
      //         data.push(dataArr);
      //       }
      //     });
      //   }
      // });
      // let filelds = [
      //   {
      //     key: this.$i18n.t("period"),
      //     sortable: true,
      //   },
      //   {
      //     key: this.$i18n.t("emu_value_per"),
      //     label: this.$i18n.t("emu_value_per"),
      //   },
      //   {
      //     key: this.$i18n.t("Total Users"),
      //   },
      //   {
      //     key: "Population",
      //     label: this.$i18n.t("Population"),
      //   },
      // ];
      //-------------//
      let chartObj = {};
      chartObj["inputChart"] = firstChart;
      chartObj["emuByMethod"] = secondChart;
      this.saveCharts("monthlyCharts_en", "inputCharts", chartObj);
      //end of monthly charts
      console.log(
        this.adjNonAdjCalcData,
        this.annualEMU,
        this.monthlyEMU,
        this.totalEMUByMethod,
        Object.keys(this.monthlyEMU).length
      );
      if (
        this.adjNonAdjCalcData &&
        this.annualEMU &&
        this.monthlyEMU &&
        Object.keys(this.monthlyEMU).length > 0
      ) {
        this.deProcess = true;
        // this.$store.commit("setLoading", false);
        // console.log(
        //   "data upload into de to be strted",
        //   this.annualEMU,
        //   this.monthlyEMU
        // );
      }
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
      let key = `annualSectorReporting_en`;
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
      console.log("Calling method getReportingRate");
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
          //console.log(this.data['reportingRate'][0]['indicator']['chartOptions']['title']['text'], 'jvhnvhgvng')
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
          console.log("reporate data==========", repoData);
          this.saveCharts("annualCharts_en", "repoCharts", this.repoRate);
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
            //let static_name = res.static_name ? res.static_name : res.key
            // if(static_name === 'Sterilization' || static_name === 'Condom'){
            //   this.methodSeq.push(r.name)
            // }else
            // if(!existMethod.includes(static_name)){
            //     existMethod.push(static_name)
            //     this.methodSeq.push(static_name)
            // }

            //count++;
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
            // let static_name = res.static_name ? res.static_name : res.key
            // if(static_name === 'Sterilization' || static_name === 'Condom'){
            //   this.methodSeq.push(static_name)
            // }else
            // if(!existMethod.includes(static_name)){
            //     existMethod.push(static_name)
            //     this.methodSeq.push(static_name)
            // }

            count++;
            let indId = [];
            r.selectedDE.forEach((de) => {
              indId.push(de.id);
            });
            if (indId.length > 0) {
              nCount++;
              ////console.log(indId)
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
                  ////console.log(fpItems, nCount)
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
          ////console.log(ofpSource)
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
          let sData = getFpSourceVals(oModified, fpItems);
          sData["aData"].forEach((d) => {
            oTemp.data.push(d);
          });
          series.push(oTemp);
          combinedObj[i] = sData["combinedObj"];
        }
      }
      // key = `ssToEMUBgData_en`;
      //for INDIA
      // if (!settings.country) {
      //   let appId = this.$store.state.appId ? this.$store.state.appId : "", appUserId = this.$store.state.appUserId ? this.$store.state.appUserId : ""
      //   if(appId && appUserId) {
      //     key = `${appUserId}_${appId}_ssToEMUBgData_${locale}`;
      //   } else {
      //       this.showLocalStorageError()
      //       return;
      //   }
      // }
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
            let subName = Array.isArray(sub.name) ? sub.name[0] : sub.name;
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
            let sName = subIndicators[j].name,
              aSelectedDE =
                bgStore === "Datastore"
                  ? subIndicators[j].selectedDatastoreDE
                  : subIndicators[j].selectedDE;
            oBackground[sName] = aSelectedDE.map((ele) => {
              if (ele.static_displayName) {
                return ele.id + "/" + ele.static_displayName;
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
            ////console.log(key);
            promises.push(service.getSavedConfig(key, false, "fp-dashboard"));
          } else {
            let allDES = [];
            for (let j = 0; j < subIndicators.length; j++) {
              subIndicators[j].selectedDE.map((ele) => {
                allDES.push(ele);
              });
            }
            ////console.log(allDES);
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
              ////console.log("resultResponse", JSON.parse(JSON.stringify(resultResponse)));
            });
          })
          .catch((res) => {
            //console.log(res);
          });
      }
      if (aSelectedDe.length) {
        let sSelectedDEs = aSelectedDe.join(";");
        ////console.log(sSelectedDEs)
        await service
          .getAnalyticalIndicatorData(
            sSelectedDEs,
            selectedLoc.split("/")[1],
            sYear
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
      console.log("Final response", response);
      if (response && response.rows.length) {
        let oFinalData = getFormatedBackGroundData(
          response,
          oBackground,
          aYear,
          pYear
        );
        console.log("oFinalData from dataMassaging method", oFinalData);
        let oTemp = oFinalData.final,
          odata = adjustmentData,
          ocontdata = getComputedContFact(
            JSON.parse(JSON.stringify(globData.continuation))
          );
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
      console.log("setvalues method called");
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
        this.deNameInc = emuInc;
        this.deNameEx = emuEx;
        this.deName = monthlyEMU;
        this.userAdjustedDE = userAdjusted;
        this.userUnadjustedDE = userUnadjusted;
        this.totalEMUByMethodDEName = monthlyEMUByMethod;
        this.annualStart = true;
        console.log("this.annualStart set", this.annualStart);
      }
    },
  },
  created() {
    // this.start = this.startP;
    if (this.start) this.setValues();
  },
};
</script>
