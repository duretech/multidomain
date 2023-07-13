<template>
  <div>
    <loader v-if="bshowLoader" />
    <div class="row mx-0">
      <div class="row col-lg-12 px-0">
        <div class="col-lg-8">
          <ul class="nav nav-pills mb-3 mx-3" role="tablist">
            <li class="nav-item fs-19-1920" @click="changeFilter('input')">
              <a
                class="nav-link active analytical-tab-links fs-19-1920"
                :id="'input_tab_link_' + tabName"
                data-toggle="pill"
                :href="'#input_tab_content_' + tabName"
                role="tab"
                :aria-controls="'input_tab_content_' + tabName"
                aria-selected="true"
                @click="getActiveTab('input')"
              >
                {{ $t("inputData") }}
              </a>
            </li>
            <li class="nav-item fs-19-1920" @click="changeFilter('total')">
              <a
                class="nav-link analytical-tab-links fs-19-1920"
                :id="'output_tab_link_' + tabName"
                data-toggle="pill"
                :href="'#output_tab_content_' + tabName"
                role="tab"
                :aria-controls="'output_tab_content_' + tabName"
                aria-selected="false"
                @click="getActiveTab('total')"
              >
                {{ $t("total-EMU") }}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="col-lg-12">
        <div class="saveEMUBtn">
          <a
            v-if="contName == autoSaveSource && activetab == 'total'"
            class="btn black-btn pointer-events-none color-white mt-4 float-left mb-5"
            @click="saveFinalEMU"
          >
            {{ $t("save-EMU") }}
          </a>
        </div>
        <div class="tab-content">
          <div
            class="tab-pane fade show active"
            :id="'input_tab_content_' + tabName"
            role="tabpanel"
            :aria-labelledby="'input_tab_link_' + tabName"
          >
            <TabSummary
              v-if="
                tabCategoryInfo &&
                tabCategoryInfo[0] &&
                tabCategoryInfo[0][$i18n.locale] != null &&
                tabCategoryInfo[0][$i18n.locale] != ''
              "
              :content="tabCategoryInfo[0][$i18n.locale]"
              :contKey="'input' + contName"
            />

            <div class="row dashboardchart-container emu-dqr">
              <div
                v-bind:class="getClass()"
                v-if="
                  newUsersChartData &&
                  backgroundData &&
                  newUsersChartData.disable == false
                "
              >
                <card-component
                  :signOffActive="signOffActive"
                  :chartdata="newUsersChartData"
                  :filter="true"
                  :period="true"
                  :methodSelected="selected"
                  :canComment="canComment"
                  :loggedInUserId="loggedInUserId"
                  defaultSort="JAN-DEC"
                  sorting="type3"
                  :setExtreme="true"
                />
              </div>
              <div
                v-bind:class="getClass()"
                v-if="chartData && backgroundData && chartData.disable == false"
              >
                <card-component
                  :chartdata="chartData"
                  :filter="true"
                  :methodSelected="selected"
                  :canComment="canComment"
                  :loggedInUserId="loggedInUserId"
                  defaultSort="JAN-DEC"
                  sorting="type3"
                  :setExtreme="true"
                />
              </div>
            </div>
            <div class="col-xl-12 mt-4">
              <div class="row dashboardchart-container">
                <div class="col-lg-12 col-xl-12 m-b-40px pl-0 pr-0">
                  <div class="card">
                    <div class="card-header p-10px text-decoration-none">
                      <div class="row no-gutters">
                        <div class="col-lg-6 col-md-7 p-t-4px">
                          <i
                            class="fa fa-info-circle color-white cursor-pointer chart-info p-t-5px mr-2"
                            aria-hidden="true"
                            v-b-popover.hover.rightbottom="{
                              variant: 'info',
                              content:
                                data['derivedCharts'][2]['chartOptions'][
                                  'chartInfo'
                                ],
                              title:
                                typeof data['derivedCharts'][2]['chartOptions'][
                                  'chartName'
                                ] == 'object'
                                  ? data['derivedCharts'][2]['chartOptions'][
                                      'chartName'
                                    ][$i18n.locale]
                                  : data['derivedCharts'][2]['chartOptions'][
                                      'chartName'
                                    ],
                              html: true,
                            }"
                          ></i>
                          {{
                            typeof data["derivedCharts"][2]["chartOptions"][
                              "chartName"
                            ] == "object"
                              ? data["derivedCharts"][2]["chartOptions"][
                                  "chartName"
                                ][$i18n.locale]
                              : data["derivedCharts"][2]["chartOptions"][
                                  "chartName"
                                ]
                          }}
                        </div>
                        <div class="col-lg-6 col-md-5 text-right">
                          <div class="row no-gutters">
                            <div class="col-lg-6 col-md-6 text-right"></div>
                            <div class="col-lg-6 col-md-6 text-right">
                              <download-csv
                                :data="items"
                                style="display: inline-block; margin-left: 10px"
                                ><img
                                  :src="
                                    require('@/assets/images/icons/downloadActive.svg')
                                  "
                                  class="img cursor-pointer"
                                  :style="{ filter: filterColor }"
                                  v-b-tooltip.hover
                                  :title="$t('downloadIcon')"
                              /></download-csv>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="card-body">
                      <div class="table-responsive" v-if="items.length">
                        <b-table
                          head-variant="light"
                          sticky-header
                          :items="items"
                          :fields="filelds"
                          stripped
                          hover
                          :sort-compare="sortDate"
                        ></b-table>
                      </div>
                      <b-alert show v-else>{{
                        $t("no_data_to_display")
                      }}</b-alert>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="tab-pane fade"
            :id="'output_tab_content_' + tabName"
            role="tabpanel"
            :aria-labelledby="'output_tab_link_' + tabName"
          >
            <TabSummary
              v-if="
                tabCategoryInfo &&
                tabCategoryInfo[1] &&
                tabCategoryInfo[1][$i18n.locale] != '' &&
                tabCategoryInfo[1][$i18n.locale] != null
              "
              :content="tabCategoryInfo[1][$i18n.locale]"
              :contKey="'total0' + contName"
            />
            <div class="row dashboardchart-container emu-dqr1">
              <!--   ||
                  emuSaveType != 'Custom' -->

              <div
                v-bind:class="getClass()"
                v-if="
                  totalEMUChartData &&
                  backgroundData &&
                  totalEMUChartData.disable == false
                "
                class="border-right"
              >
                <card-component
                  :chartdata="totalEMUChartData"
                  :canComment="canComment"
                  :loggedInUserId="loggedInUserId"
                  defaultSort="JAN-DEC"
                  sorting="type3"
                  :setExtreme="true"
                />
              </div>
              <div
                v-bind:class="getClass()"
                v-if="
                  trendsChartData &&
                  backgroundData &&
                  trendsChartData.disable == false
                "
              >
                <card-component
                  :chartdata="trendsChartData"
                  :period="true"
                  :canComment="canComment"
                  :loggedInUserId="loggedInUserId"
                  aggregate="true"
                  chartName="trend"
                  :caltype="caltype"
                  defaultSort="JAN-DEC"
                  sorting="type3"
                  :setExtreme="true"
                />
              </div>
            </div>

            <div class="row dashboardchart-container m-t-20px emu-dqr1">
              <div
                v-bind:class="getClass()"
                v-if="
                  methodTrendsChartData &&
                  backgroundData &&
                  methodTrendsChartData.disable == false
                "
                class="border-right"
              >
                <card-component
                  :chartdata="methodTrendsChartData"
                  :canComment="canComment"
                  :loggedInUserId="loggedInUserId"
                  aggregate="true"
                  chartName="methodSpecific"
                  :caltype="caltype"
                  defaultSort="JAN-DEC"
                  sorting="type3"
                  :setExtreme="true"
                />
              </div>
              <div
                v-bind:class="getClass()"
                v-if="
                  oneMonthEMUChartData &&
                  backgroundData &&
                  oneMonthEMUChartData.disable == false
                "
              >
                <card-component
                  :chartdata="oneMonthEMUChartData"
                  :canComment="canComment"
                  :loggedInUserId="loggedInUserId"
                  aggregate="true"
                  chartName="monthSpecific"
                  :caltype="caltype"
                  defaultSort="Z-A"
                  sorting="type2"
                  :setExtreme="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from "@/service";
import dataM from "./../monthly/dataMassaging.js";
import cardComponent from "./../monthly/cardComponent";
import { decompress } from "compress-json";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
export default {
  props: [
    "dhsColor",
    "totalEMUColor",
    "data",
    "bAllWomen",
    "tabName",
    "tableName",
    "startYear",
    "endYear",
    "population",
    "location",
    "locationName",
    "source",
    "setData",
    "method",
    "signOffActive",
    "exportPosition",
    "contName",
    "userDetails",
    "dqrResponse",
    "appResponse",
    "globalResponse",
    "caltype",
  ],
  mixins: [DynamicImageMixin],
  components: {
    cardComponent,
    TabSummary: () =>
      import(
        /* webpackChunkName: "TabSummary"*/ "@/components/Common/TabSummary"
      ),
  },
  created() {
    this.getBackgroundData();
    //  this.getGlobalConfig()
    this.loggedInUserId = this.userDetails.id;
    this.canComment =
      this.$store.getters.getIsAdmin ||
        this.$store.getters.getAppSettings.bypassUser ||
      this.$store.getters.getUserPermissions.canComment;
  },
  methods: {
    getActiveTab(tab) {
      this.activetab = tab;
      this.$emit("activeTabName", tab);
    },
    changeFilter(tab) {
      this.filter = tab;
    },
    sortDate(a, b, key) {
      if (key !== this.$i18n.t("period")) {
        // `key` is not the field that is a date.
        // Let b-table handle the sorting for other columns
        // returning null or false will tell b-table to fall back to it's
        // internal sort compare routine for fields keys other than `myDateField`
        return null; // or false
      }
      let aDate = this.$moment(a[key], "MMM YYYY");
      let bDate = this.$moment(b[key], "MMM YYYY");
      if (aDate.isValid && bDate.isValid) {
        if (aDate < bDate) {
          return -1;
        } else if (aDate > bDate) {
          return 1;
        } else {
          return 0;
        }
      }
      return null;
    },
    removeActiveClass(e) {
      this.showTab = !this.showTab;
    },
    addActiveClass(e) {
      this.showTab = true;
    },
    /**
     * This fnc is to get applicationModule.
     * Usage: `getGlobalConfig()`
     * @param 'applicationModule' which is key for global application config
     * @return {Object} globalConfig
     */
    async getGlobalConfig() {
      let oContTrend = {},
        oMonthContinuation = {};
      // Object.keys(this.globalResponse.continuation).forEach(cat => {
      let cat = this.contName;
      oContTrend[cat] = {};
      oMonthContinuation[cat] = {};

      Object.keys(this.globalResponse.continuation[cat]).forEach((key) => {
        let oContVal = {};
        let len = Object.keys(
          this.globalResponse.continuation[cat][key]["continuation"]
        ).length;
        for (let i = 0; i < len; i++) {
          var last =
            i != len - 1
              ? this.globalResponse.continuation[cat][key]["continuation"][
                  i + 1
                ]
              : 0;
          let value =
            (this.globalResponse.continuation[cat][key]["continuation"][i] -
              last) /
            12;
          oContVal[i] = value;
        }
        oContTrend[cat][key] = oContVal;
      });
      Object.keys(this.globalResponse.continuation[cat]).forEach((key) => {
        let j = 0;
        let conObj = {};
        var prevval, count;
        let nStart = this.sourceStartYear * 1,
          nEnd = nStart + 11,
          bisShortTerm =
            this.globalResponse.continuation[cat][key]["type"] == "Short Term",
          nCount = 0,
          valFlag = false;
        for (let i = nStart; i < nEnd; i++) {
          for (let month = 1; month <= 12; month++) {
            if (month == 1 && !bisShortTerm) {
              count =
                this.globalResponse.continuation[cat][key]["continuation"][j] *
                1;
              if (
                i == nEnd - 1 &&
                (key == "Tubal Ligation (F)" || key == "Vasectomy (M)")
              ) {
                count = 0;
              }
            } else {
              if (!bisShortTerm) {
                count =
                  month == 1
                    ? this.globalResponse.continuation[cat][key][
                        "continuation"
                      ][j] * 1
                    : count - oContTrend[cat][key][j];
                if (
                  count != 1 &&
                  (key == "Tubal Ligation (F)" || key == "Vasectomy (M)")
                ) {
                  count = 0;
                } else if (i == nEnd - 1 && month == 12) {
                  count = 0;
                }
              } else if (nCount < 12 && bisShortTerm) {
                count =
                  this.globalResponse.continuation[cat][key]["continuation"][
                    nCount
                  ] * 1;
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
      //  })
      console.log("Monthwise continuation", oMonthContinuation);
      this.continuation = oMonthContinuation;
      let locationID = this.appResponse.defaultLocationID[0];
      if (
        this.userDetails.dataViewOrganisationUnits[0].level >
        this.appResponse.defaultLevelID
      ) {
        locationID = this.userDetails.dataViewOrganisationUnits[0].id;
      }
      this.appResponse.defaultLocationID = [locationID];
      let oRet = dataM.getFormatedData(
        this.data,
        this.appResponse,
        this.startYear
      );
      this.methodSeq = oRet.methodSeq;
      this.mainmethodSeq = oRet.mainmethodSeq;
      this.globalConfig = oRet.data;
      if (this.globalConfig.chartArr.length) {
        let returnSt = await this.getAllDataelemsData();
        if (returnSt) this.$emit("errorOccured", returnSt);
      } else {
        this.bshowLoader = false;
      }
    },

    async getBackgroundData() {
      this.indDataSeq = [];
      this.autoSaveSource =
        this.dqrResponse.emu_monthly.Background_Data["autoSaveEMU"];
      let fromDataStore = this.dqrResponse.emu_monthly.Background_Data[
        "bgDataSource"
      ]
        ? this.dqrResponse.emu_monthly.Background_Data["bgDataSource"]
        : false;
      let backData =
          this.dqrResponse.emu_monthly.Background_Data.fpSourceIndicators,
        sLocId = this.location.split("/")[1];
      let indData = this.dqrResponse.emu_monthly[this.contName]["chartData"];
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
        this.indDataSeq.push(obj);
      });
      let startDate = this.$moment(this.sourceStartYear),
        endDate = this.$moment(this.sourceEndYear).add(1, "year"),
        months = [];

      while (startDate.isBefore(endDate)) {
        months.push(startDate.format("YYYYMM"));
        startDate.add(1, "month");
      }
      this.allMonthArray = months;
      // months.sort(() => Math.random() - 0.5);
      let sYear = months.join(";");
      let oData = {},
        nNumber = 0,
        nNumber1 = 0;
      if (fromDataStore == "Datastore") {
        let levelid = this.location.split("/")[0];
        let popType = this.dqrResponse.emu_monthly.Background_Data[
          "FPWomenPopulation"
        ]
          ? this.dqrResponse.emu_monthly.Background_Data["FPWomenPopulation"]
          : "MWRA";
        popType = popType.toLowerCase();
        let key = `prevalence_${levelid}`;
        await service
          .getSavedConfig(key)
          .then(async (backResp) => {
            let backResponse =
              backResp && typeof backResp.data.rows == "string"
                ? {
                    ...backResp.data,
                    rows: decompress(JSON.parse(backResp.data.rows)),
                  }
                : backResp.data;
            backData.forEach((obj) => {
              nNumber++;

              obj["subIndicators"].forEach((de) => {
                // console.log(de, "selectedDatastoreDE");
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
                      if (obj[0] == name && obj[2] == sLocId) return obj;
                    });
                    if (findInData && findInData.length) {
                      let firstYear = findInData[0][1] * 1;
                      findInData.forEach((obj) => {
                        let year = obj[1] * 1;
                        if (year >= firstYear) {
                          firstYear = year;
                          oData[sKey][statName] = {
                            // name:
                            //   typeof key.static_name == "object"
                            //     ? key.static_name[this.$i18n.locale]
                            //     : key.static_name,
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
            this.backgroundData = oData;
          })
          .catch((res) => {
            console.log(res);
            //this.showAlert();
            this.bShowLoader = false;
          });
      } else {
        backData.forEach((key) => {
          nNumber++;

          key["subIndicators"].forEach(async (de) => {
            let sKey =
              typeof de.static_name == "object"
                ? de.static_name[this.$i18n.locale]
                : de.static_name;

            if (!oData[sKey]) {
              oData[sKey] = {};
            }
            let ids = [],
              dName = [];

            Object.keys(de["selectedDE"]).forEach((sde) => {
              ids.push(de["selectedDE"][sde]["id"]);
              dName.push({
                [de["selectedDE"][sde]["id"]]:
                  de["selectedDE"][sde]["static_displayName"],
              });
            });
            let sdes = ids.join(";");
            let rowYear = "";
            if (ids.length) {
              // console.log(sdes, sLocId, sYear)
              await service
                .getAnalyticalIndicatorData(sdes, sLocId, sYear)
                .then((response) => {
                  nNumber1++;
                  Object.keys(dName).forEach((d) => {
                    response.data.rows.forEach((row) => {
                      let oRow = dName[d][row[0]];
                      if (oRow) {
                        let sRowName = oRow;
                        oData[sKey][sRowName] = oData[sKey][sRowName] || {
                          // name: key.static_name,
                          vals: {},
                        };
                        oData[sKey][sRowName]["vals"][row[1]] =
                          (oData[sKey][sRowName]["vals"][row[1]] || 0) +
                          row[3] * 1;
                        rowYear = this.$moment(row[1], "YYYYMM").year();
                      }
                    });
                  });
                })
                .catch((res) => {
                  //console.log(res)
                });
            }
          });
        });
        this.backgroundData = oData;
      }
      console.log("Backgraound data from ", fromDataStore);
      console.log(JSON.parse(JSON.stringify(this.backgroundData)));
      if (this.contName == this.autoSaveSource) {
        this.getGlobalConfig();
      }
    },
    /**
     * This fnc is to get fetch all data of data elements.
     * Usage: `getAllDataelemsData()`
     */
    async getAllDataelemsData() {
      let i,
        aChart = this.globalConfig.chartArr,
        ncLen = aChart.length,
        sLocId = this.location.split("/")[1],
        nFlag1 = 0,
        nFlag2 = 0;

      let showAlert = false;
      let mainAlertSt = "";
      var startDate = this.$moment(this.sourceStartYear);
      var endDate = this.$moment(this.sourceEndYear).add(1, "year");
      var curDate = this.$moment(new Date());
      while (startDate.isBefore(endDate) && startDate.isBefore(curDate)) {
        this.months.push(startDate.format("YYYYMM"));
        startDate.add(1, "month");
      }
      let mnt = this.months;
      for (i = 0; i < ncLen; i++) {
        let dataEle = aChart[i].dataElems;
        let j;
        for (j in dataEle) {
          if (dataEle[j].de.length) nFlag1++;
        }
      }
      let combinedSDE = "";
      let sYear = mnt.join(";");
      for (i = 0; i < ncLen; i++) {
        let j,
          aDe = aChart[i].dataElems,
          nLen = aDe.length;
        let alertSt = "";
        for (j in aDe) {
          let transName =
            typeof aDe[j].trans_name == "object"
              ? aDe[j].trans_name[this.$i18n.locale]
              : aDe[j].trans_name;
          // this.scaling[transName] = aDe[j].scaling;
          let sdes = aDe[j].de.join(";"),
            nI = i,
            nJ = j;
          nFlag2++;
          let subinpName = aDe[j].name;
          combinedSDE = combinedSDE != "" ? combinedSDE + ";" + sdes : sdes;
          await service
            .getAnalyticalIndicatorData(sdes, sLocId, sYear)
            .then((response) => {
              if (
                response != undefined &&
                response.data &&
                response.data.rows.length
              ) {
                if (!aChart[nI].charts) {
                  aChart[nI].charts = {};
                }

                // let pe = response.data.metaData.dimensions.pe,
                //   sSubMethod = aChart[nI].dataElems[nJ].static_name;
                // pe.forEach((key) => {
                //   aChart[nI].charts[key] = aChart[nI].charts[key] || {};
                // });

                aChart[nI].charts = dataM.getChartFormatedData(
                  response.data,
                  aChart[nI].dataElems[nJ],
                  aChart[nI].charts,
                  mnt
                );
              } else {
                showAlert = true;
                alertSt += subinpName + " , ";
              }
            })
            .catch((res) => {
              console.log(res);
              this.showAlert();
            });
        }
        mainAlertSt += alertSt;
      }
      if (nFlag1 === nFlag2) {
        this.bRequestFlag = true;
        showAlert = false;
      }

      if (showAlert == true) {
        // //console.log("location"+ service.getLocationName(this.location.split('/')[1])+ "Error" - mainAlertSt)
        // return "location"+ service.getLocationName(this.location.split('/')[1])+ "Error" - mainAlertSt;
        return this.location;
      } else {
        return null;
      }
    },
    /**
     * This fnc is to compute final chart data.
     * Usage: `getFinalChartsdata()`
     * @param 'globalConfig' which is used in the function
     * @return {Array} 'aFinalInputData'
     */
    getFinalChartsdata() {
      let aChartArr = this.globalConfig.chartArr,
        i,
        nLen = aChartArr.length;
      this.newUsers = aChartArr;
      this.totalCyp = dataM.getTotalCYP(aChartArr);

      let continuation = {
        ...this.continuation,
      };

      let methodArr = {};
      Object.keys(continuation[this.contName]).forEach((cont, index) => {
        methodArr[cont] = {};
        let valArr = {},
          contArr = {},
          name = "";
        aChartArr.forEach((a, i) => {
          let name = "",
            color = "",
            mTransname = "";
          Object.keys(continuation[this.contName][cont]).forEach((c) => {
            if (a["charts"] != undefined && a["charts"][c] != undefined) {
              Object.keys(a["charts"][c]).forEach((key, i) => {
                let newKey = key.split("/");

                if (newKey[1] == cont) {
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
                    a["charts"][c][key] != undefined ? a["charts"][c][key] : 0;
                  valArr[c] = val;
                  contArr[c] = continuation[this.contName][cont][c];
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
          aMonths = Object.keys(methodArr[j].val),
          nCounter = 0;

        if (methodArr[j].name != undefined) {
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
            nCounter++;
          }
        }
      }

      oUsers = oFinalVals;
      this.inputNewUsers = oNewUsers;
      console.log("Historic Users calculation needed users and New users");
      console.log(oUsers, oNewUsers);
      this.getHistoricUsers(oUsers, oNewUsers);
    },
    getHistoricUsers(users, oNewUsers) {
      let continuation = {
        ...this.continuation,
      };
      let contSum = [];
      Object.keys(continuation).forEach((cat) => {
        Object.keys(continuation[cat]).forEach((method) => {
          Object.keys(continuation[cat][method]).forEach((yearVal, i) => {
            if (i < 1) {
              delete continuation[cat][method][yearVal];
            }
          });
        });
      });

      contSum = dataM.getSumOfCont(continuation[this.contName]);

      console.log("Sum of continuation ", contSum);
      // console.log("this.scaling data", this.scaling);
      let historicUsers = {};
      Object.keys(oNewUsers).forEach((method, i) => {
        historicUsers[method] = {
          vals: {},
          mTransname: oNewUsers[method].mTransname,
          name: oNewUsers[method].name,
          subname: oNewUsers[method].subname,
          color: oNewUsers[method].color,
          trans_name: oNewUsers[method].trans_name,
          contSum: {},
        };
        let val = 0;
        var keys = Object.keys(oNewUsers[method]["vals"]);

        if (keys.length > 0) {
          Object.keys(oNewUsers[method]["vals"]).forEach((yearVal, i) => {
            historicUsers[method]["contSum"][yearVal] = contSum[method][i]
              ? contSum[method][i].toFixed(2) * 1
              : 0;
            // historicUsers[method]["vals"][yearVal] =
            //   (
            //     oNewUsers[method]["vals"][keys[0]] *
            //     (contSum[method][i] ? contSum[method][i].toFixed(2) * 1 : 0) *
            //     (this.scaling[oNewUsers[method].trans_name]
            //       ? this.scaling[oNewUsers[method].trans_name]
            //       : 1)
            //   ).toFixed(0) * 1;
            //removing scaling factor as its not needed
            historicUsers[method]["vals"][yearVal] =
              (
                oNewUsers[method]["vals"][keys[0]] *
                (contSum[method][i] ? contSum[method][i].toFixed(2) * 1 : 0)
              ).toFixed(0) * 1;
          });
        }
      });
      console.log(
        "Total users calculaton data needed is users and  historicUsers"
      );
      console.log(users, historicUsers);
      this.getTotalUsers(users, historicUsers);
    },
    getTotalUsers(users, historicUsers) {
      let totalUsers = {};
      Object.keys(users).forEach((method) => {
        totalUsers[method] = {
          vals: {},
          name: "",
          mTransname: "",
          subname: "",
          color: historicUsers[method]["color"],
          trans_name: "",
        };
        Object.keys(users[method]["vals"]).forEach((userVal) => {
          totalUsers[method]["vals"][userVal] =
            historicUsers[method]["vals"][userVal] !== "NaN"
              ? users[method]["vals"][userVal] +
                historicUsers[method]["vals"][userVal]
              : users[method]["vals"][userVal];
        });
        totalUsers[method]["name"] = users[method]["name"];
        totalUsers[method]["mTransname"] = users[method]["mTransname"];
        totalUsers[method]["subname"] = users[method]["subname"];
        totalUsers[method]["trans_name"] = users[method]["trans_name"];
      });

      this.users = users;
      this.historicUsers = historicUsers;
      let oTemp = {};

      Object.keys(totalUsers).forEach((method) => {
        let methodnName = method;
        if (!oTemp[methodnName]) {
          oTemp[methodnName] = {
            name: totalUsers[method]["name"],
            mTransname: totalUsers[method]["mTransname"],
            subname: totalUsers[method]["subname"],
            vals: {},
            color: totalUsers[method]["color"],
            trans_name: totalUsers[method]["trans_name"],
          };
        }
        Object.keys(totalUsers[method]["vals"]).forEach((val) => {
          oTemp[methodnName]["vals"][val] =
            totalUsers[method]["vals"][val] || 0;
        });
      });
      this.totalUsers = oTemp;
    },

    calculateFirstChartData() {
      /*if condom value is on dozen we need to multiply emu value with 12*/
      this.finalEmu = [];
      let tempObj = {
        data: [],
        max: 11,
        categories: [],
        tableData: [],
        saveData: [],
        saveCategories: [],
        filter: [],
      };
      tempObj = this.getOtherChartsDetails(tempObj, 0, "line");
      let series = [],
        categories = [],
        trendSeries = [],
        aTable = [],
        oEMUValues = {};
      Object.keys(this.totalUsers).forEach((method) => {
        let oMethodTable = {
          name: "",
          data: [],
          mName: "",
          trans_name: "",
        };
        if (method != "undefined") {
          let finalEMU = {
            [method]: {},
          };
          Object.keys(this.totalUsers[method]["vals"]).forEach((val) => {
            let oTable = {};
            if (categories.indexOf(val) == -1) {
              categories.push(val);
            }
            oTable[this.$i18n.t("period")] = this.$moment(val, "YYYYMM").format(
              "MMM YYYY"
            );
            finalEMU[method][val] =
              (this.totalUsers[method]["vals"][val] /
                this.monthlyPopulation[val]) *
              100;

            oEMUValues[method] = oEMUValues[method] || {
              name: this.totalUsers[method]["name"],
              subname: this.totalUsers[method]["subname"],
              vals: {},
              color: this.totalUsers[method]["color"],
              trans_name: this.totalUsers[method]["trans_name"],
              mTransname: this.totalUsers[method]["mTransname"],
            };
            oEMUValues[method]["vals"][val] =
              (
                (this.totalUsers[method]["vals"][val] /
                  this.monthlyPopulation[val]) *
                100
              ).toFixed(2) * 1;

            if (this.backgroundData != null) {
              Object.keys(this.backgroundData[method]).forEach((back) => {
                this.backgroundData[method][back]["vals"][val] =
                  this.backgroundData[method][back]["vals"][val] || 0;
                oTable[back] =
                  this.backgroundData[method][back]["vals"][val].toFixed(2) * 1;
              });
            }
            oTable[this.$i18n.t("EMU")] =
              (
                (this.totalUsers[method]["vals"][val] /
                  this.monthlyPopulation[val]) *
                100
              ).toFixed(2) * 1;
            /*commented to remove CYPs/Population*/
            //oTable[this.$i18n.t('cyp_pop')] = (this.totalCyp[method][val]/(this.monthlyPopulation[val]/12)*100).toFixed(2) * 1
            oMethodTable["name"] = method;
            oMethodTable["mName"] = this.totalUsers[method]["name"];
            oMethodTable["trans_name"] = this.totalUsers[method]["trans_name"];
            oMethodTable["data"].push(oTable);
          });

          categories.sort();
          aTable.push(oMethodTable);
          tempObj.tableData = aTable;
          this.finalEmu.push(finalEMU);
        }
      });

      let methodCategories = [],
        pubSeries = [],
        saveCategories = [...categories],
        saveMethodCategories = [],
        saveSeries = [];

      let tempO = {},
        oFinalAgrEMU = {};
      if (Object.keys(oEMUValues).length > 0) {
        Object.keys(oEMUValues).forEach((d) => {
          tempO[d + "__" + oEMUValues[d]["mTransname"]] = {};
          saveCategories.forEach((key) => {
            let pVal = oEMUValues[d]["vals"][key]
              ? oEMUValues[d]["vals"][key]
              : 0;
            tempO[d + "__" + oEMUValues[d]["mTransname"]][key] = pVal;
          });
        });

        for (let i in tempO) {
          let aSplit = i.split("__"),
            sMethod = aSplit[1];
          if (!oFinalAgrEMU[sMethod]) {
            oFinalAgrEMU[sMethod] = {};
          }
          for (let j in tempO[i]) {
            oFinalAgrEMU[sMethod][j] =
              (oFinalAgrEMU[sMethod][j] || 0) + tempO[i][j];
          }
        }
      }

      if (categories.length > 12) {
        categories.splice(0, categories.length - 24);
      }
      let count = 0;
      if (Object.keys(oEMUValues).length > 0) {
        Object.keys(oEMUValues).forEach((ele) => {
          tempObj.filter.push({
            [oEMUValues[ele]["mTransname"]]: {
              subname: oEMUValues[ele]["trans_name"],
            },
          });
          let methodEMUObject = {
              name: oEMUValues[ele]["trans_name"] + " " + this.$i18n.t("EMU"),
              data: [],
              mName: oEMUValues[ele]["mTransname"],
              color: oEMUValues[ele]["color"]
                ? oEMUValues[ele]["color"]
                : this.totalEMUColor,
              trans_name: oEMUValues[ele]["trans_name"],
            },
            saveMethodEMUObject = {
              name: ele + " " + this.$i18n.t("EMU"),
              data: [],
              mName: oEMUValues[ele]["mTransname"],
              color: oEMUValues[ele]["color"]
                ? oEMUValues[ele]["color"]
                : this.totalEMUColor,
              trans_name: oEMUValues[ele]["trans_name"],
            };
          if (
            this.backgroundData &&
            Object.keys(this.backgroundData[ele]).length > 0
          ) {
            Object.keys(this.backgroundData[ele]).forEach((back) => {
              let peevVal = 0;
              Object.keys(this.backgroundData[ele][back]["vals"]).forEach(
                (d) => {
                  if (this.backgroundData[ele][back]["vals"][d] != 0) {
                    peevVal = this.backgroundData[ele][back]["vals"][d];
                  }
                }
              );

              methodEMUObject.data = [];
              saveMethodEMUObject.data = [];
              //DHS Series in emu by method chart
              let methodPublicObject = {
                name: "",
                data: [],
                mName: oEMUValues[ele]["mTransname"],
                trans_name: oEMUValues[ele]["trans_name"],
                color: this.dhsColor, //DHS Color
              };

              categories.forEach((key) => {
                methodEMUObject.data.push(oEMUValues[ele]["vals"][key] || 0);
                methodPublicObject["name"] =
                  back + " " + oEMUValues[ele]["trans_name"];
                methodPublicObject.data.push(peevVal);

                if (
                  methodCategories.indexOf(
                    this.$moment(key, "YYYYMM").format("MMM YYYY")
                  ) == -1
                ) {
                  methodCategories.push(
                    this.$moment(key, "YYYYMM").format("MMM YYYY")
                  );
                }
              });

              saveCategories.forEach((key) => {
                saveMethodEMUObject.data.push(
                  oEMUValues[ele]["vals"][key] || 0
                );
                if (
                  saveMethodCategories.indexOf(
                    this.$moment(key, "YYYYMM").format("MMM YYYY")
                  ) == -1
                ) {
                  saveMethodCategories.push(
                    this.$moment(key, "YYYYMM").format("MMM YYYY")
                  );
                }
              });

              series.push(methodPublicObject);
              pubSeries.push(methodPublicObject);
              count++;
            });
          } else {
            categories.forEach((key) => {
              methodEMUObject.data.push(oEMUValues[ele]["vals"][key] || 0);
              if (
                methodCategories.indexOf(
                  this.$moment(key, "YYYYMM").format("MMM YYYY")
                ) == -1
              ) {
                methodCategories.push(
                  this.$moment(key, "YYYYMM").format("MMM YYYY")
                );
              }
            });
            saveCategories.forEach((key) => {
              saveMethodEMUObject.data.push(oEMUValues[ele]["vals"][key] || 0);
              if (
                saveMethodCategories.indexOf(
                  this.$moment(key, "YYYYMM").format("MMM YYYY")
                ) == -1
              ) {
                saveMethodCategories.push(
                  this.$moment(key, "YYYYMM").format("MMM YYYY")
                );
              }
            });
          }

          trendSeries.push(methodEMUObject);
          series.push(methodEMUObject);
          /* commented to remove CYPs/Population */
          saveSeries.push(saveMethodEMUObject);
        });
      }
      let seqTemp = [];
      this.methodSeq.forEach((element) => {
        Object.keys(tempObj.filter).forEach((obj) => {
          Object.keys(tempObj.filter[obj]).forEach((m) => {
            if (tempObj.filter[obj][m].subname == element) {
              seqTemp.push(tempObj.filter[obj]);
            }
          });
        });
      });
      let options = [],
        tempArray = [];
      Object.keys(seqTemp).forEach((fil) => {
        Object.keys(seqTemp[fil]).forEach((m) => {
          if (tempArray.indexOf(m) === -1) {
            tempArray.push(m);
            options.push({
              id: m,
              label: m,
              children: [],
            });
          }
          options.forEach((o) => {
            if (o["id"] == m) {
              o["children"].push({
                id: seqTemp[fil][m]["subname"],
                label: seqTemp[fil][m]["subname"],
              });
            }
          });
        });
      });

      if (options.length > 0) {
        this.selected = options[0]["children"][0]["id"];
        this.dHSIndDataSeq = options;
        //setTimeout(() => {
        this.options = options;
        // //this.$emit('methodFilter', options)
        // disabled for autosaveEMU
        this.$emit("methodFilter", {
          name: this.contName,
          value: options,
        });
        //this.$emit('defaultMethod', options[0]['children'][0]['id'])
        //}, 2000)
      }
      tempObj.filter = options;
      tempObj.data = series;
      tempObj.categories = methodCategories;
      tempObj.saveData = saveSeries;
      tempObj.saveCategories = saveMethodCategories;
      let newSeries = [],
        newSaveSeries = [];
      this.methodSeq.forEach((element, i) => {
        let val = trendSeries.filter((obj) => obj.trans_name == element);
        if (val.length) {
          newSeries.push(val[0]);
        }
        let saveVal = saveSeries.filter((obj) => obj.trans_name == element);
        if (saveVal.length) {
          saveVal[0]["trans_name"] =
            saveVal[0]["trans_name"] + " " + this.$i18n.t("EMU");
          newSaveSeries.push(saveVal[0]);
        }
      });
      this.emuTrendByMethod(
        newSeries,
        methodCategories,
        pubSeries,
        newSaveSeries,
        saveMethodCategories,
        oFinalAgrEMU
      );
      this.methodTrendByMethod(
        newSeries,
        methodCategories,
        newSaveSeries,
        saveMethodCategories,
        oFinalAgrEMU
      );
      let oEMUData = {
        tab: this.tabName,
        loc: this.location.split("/")[1],
        data: this.finalEmu,
        type: "EMU",
      };
      this.setData(oEMUData);
      this.chartData = tempObj;
      this.newUsersChart(methodCategories);
      let reversedCat = saveMethodCategories;
      this.methodTable(saveSeries, reversedCat.reverse());
    },
    getOtherChartsDetails(chartObj, index, chartType = "line") {
      // chartObj = {
      chartObj["data"] = [];
      chartObj["title"] =
        typeof this.data["derivedCharts"][index]["chartOptions"]["chartName"] ==
        "object"
          ? this.data["derivedCharts"][index]["chartOptions"]["chartName"][
              this.$i18n.locale
            ]
          : this.data["derivedCharts"][index]["chartOptions"]["chartName"];
      chartObj["source"] = this.source;
      chartObj["xTitle"] =
        typeof this.data["derivedCharts"][index]["chartOptions"]["xAxis"][
          "text"
        ] == "object"
          ? this.data["derivedCharts"][index]["chartOptions"]["xAxis"]["text"][
              this.$i18n.locale
            ]
          : this.data["derivedCharts"][index]["chartOptions"]["xAxis"]["text"];
      chartObj["yTitle"] =
        typeof this.data["derivedCharts"][index]["chartOptions"]["yAxis"][
          "text"
        ] == "object"
          ? this.data["derivedCharts"][index]["chartOptions"]["yAxis"]["text"][
              this.$i18n.locale
            ]
          : this.data["derivedCharts"][index]["chartOptions"]["yAxis"]["text"];
      chartObj["disable"] =
        this.data["derivedCharts"][index]["chartOptions"]["disableChart"];
      chartObj["type"] = chartType;
      chartObj["chartInfo"] =
        typeof this.data["derivedCharts"][index]["chartOptions"]["chartInfo"] ==
        "object"
          ? this.data["derivedCharts"][index]["chartOptions"]["chartInfo"][
              this.$i18n.locale
            ]
          : this.data["derivedCharts"][index]["chartOptions"]["chartInfo"];
      chartObj["cid"] =
        this.data["derivedCharts"][index]["chartOptions"]["cid"];
      // };
      return chartObj;
    },
    newUsersChart(cats) {
      let tempObj = {
          data: [],
          categories: [],
          tableData: [],
          filter: [],
          max: 11,
        },
        series = [],
        categories = [],
        tableData = [],
        fCategories = [];
      tempObj = this.getOtherChartsDetails(tempObj, 1, "column");
      Object.keys(this.inputNewUsers).forEach((method) => {
        let oSeries = {
            name: this.inputNewUsers[method]["trans_name"],
            data: [],
            mName: "",
            color: this.inputNewUsers[method]["color"],
          },
          oMethodTable = {
            name: "",
            data: [],
            mName: "",
          };
        fCategories = [];
        categories = Object.keys(this.inputNewUsers[method]["vals"]);
        categories.splice(0, categories.length - 24);
        cats.forEach((year) => {
          let oTable = {};
          let y = this.$moment(year, "MMM YYYY").format("YYYYMM");
          fCategories.push(year);
          oTable[this.$i18n.t("period")] = year;
          let newUserVal =
            this.inputNewUsers[method]["vals"][y] != undefined
              ? parseInt(this.inputNewUsers[method]["vals"][y]).toLocaleString()
              : null;

          oTable[this.$i18n.t("new_users")] = newUserVal;
          oMethodTable["name"] = this.inputNewUsers[method]["trans_name"];
          oMethodTable["trans_name"] = this.inputNewUsers[method]["trans_name"];
          oMethodTable["mName"] = this.inputNewUsers[method]["mTransname"];
          oMethodTable["data"].push(oTable);
          oSeries.data.push(this.inputNewUsers[method]["vals"][y] || null);
          oSeries.mName = this.inputNewUsers[method]["mTransname"];
          oSeries.isSignActive = this.signOffActive;
        });

        tableData.push(oMethodTable);
        series.push(oSeries);
      });
      (tempObj.data = series),
        (tempObj.categories = fCategories),
        (tempObj.tableData = tableData);
      tempObj.filter = this.options;
      this.newUsersChartData = tempObj;
    },
    methodTable(emu, cat) {
      let emuObj = {},
        catArr = [];
      emu.forEach((m) => {
        var lastIndex = m.name.lastIndexOf(" ");
        m.name = m.name.substring(0, lastIndex);
        emuObj[m.name] = m.data.reverse();
      });

      // cat.reverse();
      cat.map((currentValue) => {
        let newVal = this.$moment(currentValue, "MMM YYYY").format("YYYYMM");
        catArr.push(newVal);
      });
      this.catArr = catArr;
      let oFilterData = {};
      Object.keys(this.totalUsers).forEach((key) => {
        let { name, vals } = this.totalUsers[key];
        oFilterData[key.trim()] = {
          totalusers: vals,
          newusers: this.inputNewUsers[key]["vals"],
          trans_name: this.inputNewUsers[key]["trans_name"],
          // totalcyp: this.totalCyp[key],
          totalEMU: emuObj[key],
        };
      });
      this.filterTableData = oFilterData;

      if (this.filterTableData && catArr.length > 0) {
        this.drawTable();
      }
    },
    drawTable() {
      let data = [],
        headers = [
          this.$i18n.t("period"),
          this.$i18n.t("Total Users"),
          this.$i18n.t("emu_value_per"),
          this.$i18n.t("Population"),
        ];
      Object.keys(this.filterTableData).forEach((key) => {
        key = key.trim();
        this.selected = this.selected.trim();
        if (this.selected == this.filterTableData[key].trans_name) {
          this.catArr.forEach((val, i) => {
            let oTable = {},
              dataArr = [];
            if (i < 24) {
              oTable[this.$i18n.t("period")] = this.$moment(
                val,
                "YYYYMM"
              ).format("MMM YYYY");
              let userVal = this.filterTableData[key]["totalusers"][val]
                ? parseInt(
                    this.filterTableData[key]["totalusers"][val]
                  ).toLocaleString()
                : 0;
              oTable[this.$i18n.t("Total Users")] = userVal;
              oTable[this.$i18n.t("emu_value_per")] =
                !this.filterTableData[key]["totalEMU"] ||
                isNaN(this.filterTableData[key]["totalEMU"][i])
                  ? null
                  : this.filterTableData[key]["totalEMU"][i];
              // let cypVal = this.cypPopVal[key]
              //   ? this.cypPopVal[key][val]
              //   : null;
              oTable["Population"] = this.monthlyPopulation[val]
                ? this.monthlyPopulation[val].toLocaleString()
                : "NA";
              /* commented to remove CYPs/Population */
              //oTable[this.$i18n.t('cyp_pop')] = cypVal == 'NaN' ? null : cypVal
              this.items.push(oTable);
              dataArr.push(this.$moment(val, "YYYYMM").format("MMM YYYY"));
              dataArr.push(userVal);
              dataArr.push(
                !this.filterTableData[key]["totalEMU"] ||
                  isNaN(this.filterTableData[key]["totalEMU"][i])
                  ? null
                  : this.filterTableData[key]["totalEMU"][i]
              );
              // dataArr.push(cypVal == "NaN" ? null : cypVal);
              dataArr.push(
                this.monthlyPopulation[val] ? this.monthlyPopulation[val] : "NA"
              );
              data.push(dataArr);
            }
          });
        }
      });
      this.filelds = [
        {
          key: this.$i18n.t("period"),
          sortable: true,
        },
        {
          key: this.$i18n.t("emu_value_per"),
          label: this.$i18n.t("emu_value_per"),
        },
        {
          key: this.$i18n.t("Total Users"),
        },
        {
          key: "Population",
          label: this.$i18n.t("Population"),
        },
      ];
      this.exportPPTTable = {
        data: data,
        headers: headers,
      };
    },
    getPopulation() {
      let oPopulation = {};
      Object.keys(this.population).forEach((key) => {
        let oContVal = {};
        let len = Object.keys(this.population).length;
        let keys = Object.keys(this.population);
        for (let i = 0; i < len; i++) {
          var last = i != len - 1 ? this.population[keys[i + 1]] : 0;
          if (last != 0) {
            let value = (this.population[keys[i]] - last) / 12;
            oContVal[keys[i]] = 0 - value;
          }
        }
        oPopulation = oContVal;
      });
      let oMonthPopulation = {};
      Object.keys(this.population).forEach((key) => {
        var count;
        //let len = Object.keys(this.population).length;
        // for (let i = 0; i <= len; i++) {
        if (oPopulation[key]) {
          for (let month = 1; month <= 12; month++) {
            if (month == 1) {
              count = this.population[key];
            } else {
              count = count + (oPopulation[key] ? oPopulation[key] : 0);
            }
            month < 10
              ? (oMonthPopulation[key + "0" + month] = Math.round(count))
              : (oMonthPopulation[key + "" + month] = Math.round(count));
          }
        }
        //j++;
        //}
      });
      this.monthlyPopulation = oMonthPopulation;
      this.calculateFirstChartData(oMonthPopulation);
      this.calculateTotalEMU();
    },
    emuTrendByMethod(
      series,
      categories,
      pubSeries,
      saveSeries,
      saveCategories,
      oFinalAgrEMU
    ) {
      let pubobj = {},
        seriesObj = {};
      this.indDataSeq.forEach((mobj) => {
        let isSubMethValDiffer = false,
          prevDHSVal = 0;
        mobj.subInd.forEach((subObj, subi) => {
          let findinArray = pubSeries.filter((obj) => {
            return obj.mName == mobj.parent && subObj == obj.trans_name;
          });
          if (findinArray.length) {
            if (!pubobj[findinArray[0].mName]) {
              pubobj[findinArray[0].mName] = {};
            }
            for (let j in findinArray[0].data) {
              if (prevDHSVal == 0) {
                prevDHSVal = findinArray[0].data[j];
                pubobj[findinArray[0].mName][j] =
                  (pubobj[findinArray[0].mName][j] || 0) +
                  findinArray[0].data[j];
              } else if (
                prevDHSVal != 0 &&
                (prevDHSVal != findinArray[0].data[j] ||
                  isSubMethValDiffer == true) &&
                subi != 0
              ) {
                // if(pubobj[findinArray[0].mName][j] == undefined)
                isSubMethValDiffer = true;
                pubobj[findinArray[0].mName][j] =
                  (pubobj[findinArray[0].mName][j] || 0) +
                  findinArray[0].data[j];
              }
            }
          }
        });
      });
      let catLen = categories.length;
      let oneMonthCategories = [],
        tableData = [],
        oneAgreMonthSeries = [
          {
            data: [],
            name: this.$i18n.t("EMU") + " " + categories[catLen - 1],
            color: this.totalEMUColor,
          },
        ],
        agreDhsSeries = {
          data: [],
          name: this.$i18n.t("DHS"),
          color: this.dhsColor,
        },
        agreDHSExist = false;
      let tempObj = {
          data: [],
          agreData: [],
          methodData: [],
          max: 11,
          categories: [],
          tableData: [],
          agreTableData: [],
          methodTableData: [],
          saveData: saveSeries,
          saveCategories: saveCategories,
          saveAgreData: [],
        },
        oneMonthEMU = {
          data: [],
          agreData: [],
          methodData: [],
          max: 4,
          categories: [],
          methodCategories: [],
          agreCategories: [],
          tableData: [],
          agreTableData: [],
          methodTableData: [],
          saveData: saveSeries,
          saveCategories: saveCategories,
        };
      tempObj = this.getOtherChartsDetails(tempObj, 4, "stacked");
      oneMonthEMU = this.getOtherChartsDetails(oneMonthEMU, 6, "column");
      let emuColors = {};
      let oPeroid = {},
        agrePeriod = {},
        oneMonthSeries = [
          {
            data: [],
            name: this.$i18n.t("EMU") + " " + categories[catLen - 1],
            color: this.totalEMUColor,
          },
        ],
        dhsSeries = {
          data: [],
          name: this.$i18n.t("DHS"),
          color: this.dhsColor,
        };
      let dhsExist = false;
      series.forEach((key, i) => {
        emuColors[key.mName] = key.color;
        let lastword = key.name.lastIndexOf(" "),
          keyName = "";
        keyName = key.name.substring(0, lastword) + "-" + key.mName;

        let len = key["data"].length;
        let pubArray = pubSeries.filter((pub) =>
          pub.trans_name.includes(key.name.substring(0, lastword))
        );
        if (pubArray.length > 0) {
          oneMonthSeries[0]["data"].push(key["data"][len - 1]);
          dhsSeries["data"].push(pubArray[0]["data"][len - 1]);
          oneMonthCategories.push(keyName);
          dhsExist = true;
        } else {
          oneMonthSeries[0]["data"].push(key["data"][len - 1]);
          dhsSeries["data"].push(null);
          oneMonthCategories.push(keyName);
        }

        key["data"].forEach((d, i) => {
          oPeroid[categories[i]] = oPeroid[categories[i]] || {};
          oPeroid[categories[i]][keyName] = d;
        });
      });
      if (dhsExist) oneMonthSeries.push(dhsSeries);
      let newFinAgr = [];
      this.mainmethodSeq.forEach((element, i) => {
        Object.keys(oFinalAgrEMU).forEach((m) => {
          if (m == element) {
            newFinAgr.push({ [m]: oFinalAgrEMU[m] });
          }
        });
      });
      if (oFinalAgrEMU && emuColors) {
        newFinAgr.forEach((i) => {
          Object.keys(i).forEach((m) => {
            let pubval = pubobj[m] ? pubobj[m][0] : null;
            if (pubval) agreDHSExist = true;
            agreDhsSeries.data.push(pubval);
            let lastKey = Object.keys(oFinalAgrEMU[m])[
              Object.keys(oFinalAgrEMU[m]).length - 1
            ];
            let lastVal = oFinalAgrEMU[m] ? oFinalAgrEMU[m][lastKey] : 0;
            oneAgreMonthSeries[0].data.push(lastVal);
            oneMonthEMU.agreCategories.push(m);
            let aobj = { color: emuColors[m], name: m, data: [] };
            let mobj = { color: emuColors[m], name: m, data: [] };
            if (oFinalAgrEMU[m]) {
              Object.keys(oFinalAgrEMU[m]).forEach((d) => {
                aobj["data"].push(oFinalAgrEMU[m][d].toFixed(3) * 1);
                categories.forEach((c) => {
                  let p = this.$moment(c, "MMM YYYY").format("YYYYMM");
                  if (d == p) {
                    mobj["data"].push(oFinalAgrEMU[m][d].toFixed(3) * 1);
                  }
                });
              });
            }
            tempObj.agreData.push(mobj);
            tempObj.saveAgreData.push(aobj);
          });
        });
      }
      if (agreDHSExist) oneAgreMonthSeries.push(agreDhsSeries);
      let aTable = [];
      for (let p in oPeroid) {
        let oP = {
          [this.$i18n.t("period")]: p,
          ...oPeroid[p],
        };
        aTable.push(oP);
      }

      let eTable = [],
        oagreTable = [];

      oneMonthCategories.forEach((catname, catInd) => {
        let obj = {};
        obj[this.$i18n.t("method")] = catname;
        oneMonthSeries.forEach((mdata, i) => {
          mdata.data.forEach((key, i_k) => {
            if (catInd == i_k) obj[mdata.name] = key;
          });
        });
        eTable.push(obj);
      });
      oneMonthEMU.agreCategories.forEach((methd, methodi) => {
        let obj = {};
        obj[this.$i18n.t("method")] = methd;
        oneAgreMonthSeries.forEach((innerData) => {
          let dt = innerData["data"];
          let nm = innerData["name"];
          obj[nm] = dt[methodi] ? dt[methodi] : null;
        });
        oagreTable.push(obj);
      });
      tempObj.agreData.forEach((key) => {
        key["data"].forEach((d, i) => {
          agrePeriod[categories[i]] = agrePeriod[categories[i]] || {};
          agrePeriod[categories[i]][key.name] = d;
        });
      });
      let agreTable = [];
      for (let p in agrePeriod) {
        let oP = {
          [this.$i18n.t("period")]: p,
          ...agrePeriod[p],
        };
        agreTable.push(oP);
      }

      (oneMonthEMU.data = oneMonthSeries),
        (oneMonthEMU.methodData = oneMonthSeries),
        (oneMonthEMU.categories = oneMonthCategories),
        (oneMonthEMU.methodCategories = oneMonthCategories),
        (oneMonthEMU.agreData = oneAgreMonthSeries);
      oneMonthEMU.tableData = [
        {
          name: this.$i18n.t("EMU"),
          data: eTable,
        },
      ];
      // oneMonthEMU.methodTableData = [{
      //   name: this.$i18n.t('EMU'),
      //   data: eTable
      // }]
      oneMonthEMU.agreTableData = [
        {
          name: this.$i18n.t("EMU"),
          data: oagreTable,
        },
      ];

      (tempObj.data = series),
        (tempObj.methodData = series),
        (tempObj.categories = categories);
      tempObj.tableData = [
        {
          name: this.$i18n.t("EMU"),
          data: aTable,
        },
      ];
      // tempObj.methodTableData = [{
      //   name: this.$i18n.t('EMU'),
      //   data: aTable
      // }]
      tempObj.agreTableData = [
        {
          name: this.$i18n.t("EMU"),
          data: agreTable,
        },
      ];
      this.trendsChartData = tempObj;
      this.oneMonthEMUChartData = oneMonthEMU;
      this.saveTrendsChartData = {
        isPeriodChart: true,
        reportChartType: "column_stack",
        type: tempObj.type,
        cid: this.data["derivedCharts"][4]["chartOptions"]["cid"],
        saveData: tempObj.saveData,
        saveCategories: tempObj.saveCategories,
        //data : tempObj.data,
        // categories : tempObj.categories,
        source: this.source,
        agreData: tempObj.saveAgreData,
      };
      this.saveOneMonthEMUChartData = {
        isPeriodChart: false,
        reportChartType: oneMonthEMU.type,
        type: oneMonthEMU.type,
        cid: this.data["derivedCharts"][6]["chartOptions"]["cid"],
        data: oneMonthEMU.data,
        categories: oneMonthEMU.categories,
        source: this.source,
        agreData: oneMonthEMU.agreData,
        agreTableData: oneMonthEMU.agreTableData,
        tableData: oneMonthEMU.tableData,
        agreCategories: oneMonthEMU.agreCategories,
      };
      this.saveTrendsChartData = JSON.parse(
        JSON.stringify(this.saveTrendsChartData)
      );
      console.log(
        JSON.parse(JSON.stringify(this.saveTrendsChartData)),
        "trend emuTrned"
      );
      this.saveOneMonthEMUChartData = JSON.parse(
        JSON.stringify(this.saveOneMonthEMUChartData)
      );
      console.log(
        JSON.parse(JSON.stringify(this.saveOneMonthEMUChartData)),
        "saveOneMonthEMUChartData onemonthemu"
      );
    },
    methodTrendByMethod(
      series,
      categories,
      saveSeries,
      saveMethodCategories,
      oFinalAgrEMU
    ) {
      let tempObj = {
        data: [],
        agreData: [],
        methodData: [],
        max: 11,
        categories: [],
        tableData: [],
        agreTableData: [],
        methodTableData: [],
        saveData: saveSeries,
        saveCategories: saveMethodCategories,
        saveAgreData: [],
      };
      tempObj = this.getOtherChartsDetails(tempObj, 5, "line");

      let oPeroid = {},
        agrePeriod = {};
      let emuColors = {};
      series.forEach((key) => {
        emuColors[key.mName] = key.color;
        key["data"].forEach((d, i) => {
          oPeroid[categories[i]] = oPeroid[categories[i]] || {};
          oPeroid[categories[i]][key.name] = d;
        });
      });
      let aTable = [];
      for (let p in oPeroid) {
        let oP = {
          [this.$i18n.t("period")]: p,
          ...oPeroid[p],
        };
        aTable.push(oP);
      }
      let newFinAgr = [];
      this.mainmethodSeq.forEach((element, i) => {
        Object.keys(oFinalAgrEMU).forEach((m) => {
          if (m == element) {
            newFinAgr.push({ [m]: oFinalAgrEMU[m] });
          }
        });
      });
      if (oFinalAgrEMU) {
        newFinAgr.forEach((i) => {
          Object.keys(i).forEach((m) => {
            let aobj = { color: emuColors[m], name: m, data: [] };
            let mobj = { color: emuColors[m], name: m, data: [] };
            if (oFinalAgrEMU[m]) {
              Object.keys(oFinalAgrEMU[m]).forEach((d) => {
                aobj["data"].push(oFinalAgrEMU[m][d].toFixed(3) * 1);
                categories.forEach((c) => {
                  let p = this.$moment(c, "MMM YYYY").format("YYYYMM");
                  if (d == p) {
                    mobj["data"].push(oFinalAgrEMU[m][d].toFixed(3) * 1);
                  }
                });
              });
            }
            tempObj.agreData.push(mobj);
            tempObj.saveAgreData.push(aobj);
          });
        });
      }
      tempObj.agreData.forEach((key) => {
        key["data"].forEach((d, i) => {
          agrePeriod[categories[i]] = agrePeriod[categories[i]] || {};
          agrePeriod[categories[i]][key.name] = d;
        });
      });
      let agreTable = [];
      for (let p in agrePeriod) {
        let oP = {
          [this.$i18n.t("period")]: p,
          ...agrePeriod[p],
        };
        agreTable.push(oP);
      }
      (tempObj.data = series), (tempObj.categories = categories);
      //tempObj.methodData = series
      tempObj.tableData = [
        {
          name: this.$i18n.t("EMU"),
          data: aTable,
        },
      ];
      // tempObj.methodTableData = [{
      //   name: this.$i18n.t('EMU'),
      //   data: aTable
      // }]
      tempObj.agreTableData = [
        {
          name: this.$i18n.t("EMU"),
          data: agreTable,
        },
      ];
      this.methodTrendsChartData = tempObj;
      this.saveMethodTrendsChartData = {
        isPeriodChart: true,
        reportChartType: tempObj.type,
        saveData: tempObj.saveData,
        saveCategories: saveMethodCategories,
        type: "line",
        cid: this.data["derivedCharts"][5]["chartOptions"]["cid"],
        //tableData:tempObj.tableData,
        agreData: tempObj.saveAgreData,
        //agreTableData : tempObj.agreTableData,
        source: this.source,
      };
      console.log(
        JSON.parse(JSON.stringify(this.saveMethodTrendsChartData)),
        "this.saveMethodTrendsChartData"
      );
      this.saveMethodTrendsChartData = JSON.parse(
        JSON.stringify(this.saveMethodTrendsChartData)
      );
    },
    calculateTotalEMU() {
      delete this.totalUsers["undefined"];

      let sumTotalUsers = {},
        // sumTotalCYP = {},
        // sumPublic = {},
        // sumPrivate = {},
        sumBack = {};
      // sumDhs = {};
      Object.keys(this.totalUsers).forEach((key) => {
        Object.keys(this.totalUsers[key]["vals"]).forEach((year) => {
          sumTotalUsers[year] =
            (sumTotalUsers[year] || 0) + this.totalUsers[key]["vals"][year];
          //   sumTotalCYP[year] =
          //     (sumTotalCYP[year] || 0) + this.totalCyp[key][year];
        });
      });
      console.log("this.backgroundData", this.backgroundData);
      if (this.backgroundData) {
        // Object.keys(this.totalUsers).forEach(key => {
        //   let peevVal = 0
        //   Object.keys(this.backgroundData[key]).forEach(back => {
        //     if(back){
        //       Object.keys(this.backgroundData[key][back]['vals']).forEach(d => {
        //         if (this.backgroundData[key][back]['vals'][d] != 0) {
        //           peevVal = this.backgroundData[key][back]['vals'][d]
        //         }
        //       })
        //       if (!sumBack[back]) {
        //         sumBack[back] = {}
        //       }
        //       Object.keys(this.backgroundData[key][back]['vals']).forEach(year => {
        //         sumBack[back][year] = (sumBack[back][year] || 0) + peevVal
        //       })
        //     }
        //   })
        // })
        // Added by Ashvini
        //for backGround Indicator, only one sub indicator value will get plus into toatl EMU if values are same
        this.indDataSeq.forEach((ind) => {
          let dhsVal = 0,
            preDHSVal = 999;
          ind["subInd"].forEach((sind, sIndex) => {
            if (this.backgroundData[sind]) {
              Object.keys(this.backgroundData[sind]).forEach((dhs) => {
                if (dhs) {
                  if (!sumBack[dhs]) {
                    sumBack[dhs] = {};
                  }
                  Object.keys(this.backgroundData[sind][dhs]["vals"]).forEach(
                    (d) => {
                      if (this.backgroundData[sind][dhs]["vals"][d] != 0) {
                        if (dhsVal == 0) {
                          dhsVal = this.backgroundData[sind][dhs]["vals"][d];
                        }
                      }
                    }
                  );
                  if (sIndex == 0 && dhsVal == 0) preDHSVal = dhsVal;
                  Object.keys(this.backgroundData[sind][dhs]["vals"]).forEach(
                    (year) => {
                      if (
                        dhsVal != 0 &&
                        dhsVal !=
                          this.backgroundData[sind][dhs]["vals"][year] &&
                        this.backgroundData[sind][dhs]["vals"][year] != 0
                      ) {
                        ind["dataDiffer"] = true;
                      }
                      if (sIndex > 0 && preDHSVal == 0 && dhsVal != 0) {
                        ind["dataDiffer"] = true;
                      }
                    }
                  );
                }
              });
            }
          });
        });
        loop1: for (
          let indIndex = 0;
          indIndex < this.indDataSeq.length;
          indIndex++
        ) {
          let ind = this.indDataSeq[indIndex];
          for (let sindex = 0; sindex < ind["subInd"].length; sindex++) {
            let sind = ind["subInd"][sindex];
            let actualDhsVal = 0;
            let methFound = this.dHSIndDataSeq.find((obj) =>
              obj.children.find((innObj) => innObj.id == sind)
            );
            if (this.backgroundData[sind] && methFound) {
              for (
                let bgindex = 0;
                bgindex < Object.keys(this.backgroundData[sind]).length;
                bgindex++
              ) {
                let dhs = Object.keys(this.backgroundData[sind])[bgindex];
                if (dhs) {
                  if (!sumBack[dhs]) {
                    sumBack[dhs] = {};
                  }

                  Object.keys(this.backgroundData[sind][dhs]["vals"])
                    .reverse()
                    .forEach((d) => {
                      if (this.backgroundData[sind][dhs]["vals"][d] != 0) {
                        if (actualDhsVal == 0) {
                          actualDhsVal =
                            this.backgroundData[sind][dhs]["vals"][d];
                        }
                      }
                    });
                  for (
                    let yrIndex = 0;
                    yrIndex < this.allMonthArray.length;
                    yrIndex++
                  ) {
                    let year = this.allMonthArray[yrIndex];
                    sumBack[dhs][year] =
                      (sumBack[dhs][year] || 0) + actualDhsVal;
                  }
                  if (ind["dataDiffer"] == false) continue loop1;
                }
              }
            }
          }
        }
      }
      console.log("Total dhs", sumBack);
      let totalEMU = {
          data: [],
          name: this.$i18n.t("EMU"),
          color: this.totalEMUColor,
        },
        saveTotalEMU = {
          data: [],
          name: this.$i18n.t("EMU"),
          color: this.totalEMUColor,
        },
        // totalCYP = {
        //   data: [],
        //   name: this.$i18n.t("cyp_pop"),
        // },
        series = [],
        // saveTotalCYP = {
        //   data: [],
        //   name: this.$i18n.t("cyp_pop"),
        // },
        categories = [],
        fCategories = [],
        saveCategories = [],
        saveSeries = [],
        savefCategories = [];

      saveCategories = Object.keys(sumTotalUsers);
      categories = Object.keys(sumTotalUsers);
      categories.splice(0, categories.length - 24);

      if (Object.keys(sumBack).length > 0) {
        Object.keys(sumBack).forEach((sumVal) => {
          totalEMU["data"] = [];
          // totalCYP["data"] = [];
          fCategories = [];
          saveTotalEMU["data"] = [];
          // saveTotalCYP["data"] = [];
          savefCategories = [];

          let totalBack = {
              data: [],
              name: "",
              color: this.dhsColor, //color for dhs series
            },
            preVal = 0,
            preValFlag = false,
            saveTotalBack = {
              data: [],
              name: "",
              color: this.dhsColor, //color for dhs series
            },
            savePreVal = 0,
            savePreValFlag = false;
          totalBack.name = sumVal;
          saveTotalBack.name = sumVal;
          categories.forEach((period) => {
            if (sumBack[sumVal][period] != 0) {
              if (preVal == 0 && preValFlag == false) {
                preVal = sumBack[sumVal][period];
                preValFlag = true;
              }
            }

            totalEMU["data"].push(
              (
                (sumTotalUsers[period] / this.monthlyPopulation[period]) *
                100
              ).toFixed(2) * 1
            );
            // totalCYP["data"].push(
            //   (
            //     (sumTotalCYP[period] / (this.monthlyPopulation[period] / 12)) *
            //     100
            //   ).toFixed(2) * 1
            // );
            totalBack["data"].push(preVal ? preVal.toFixed(2) * 1 : null);
            fCategories.push(this.$moment(period, "YYYYMM").format("MMM YYYY"));
          });
          series.push(totalBack);
          saveCategories.forEach((period) => {
            if (sumBack[sumVal][period] != 0) {
              if (savePreVal == 0 && savePreValFlag == false) {
                savePreVal = sumBack[sumVal][period]
                  ? sumBack[sumVal][period]
                  : 0;
                savePreValFlag = true;
              }
            }
            saveTotalEMU["data"].push(
              (
                (sumTotalUsers[period] / this.monthlyPopulation[period]) *
                100
              ).toFixed(2) * 1
            );
            // saveTotalCYP["data"].push(
            //   (
            //     (sumTotalCYP[period] / (this.monthlyPopulation[period] / 12)) *
            //     100
            //   ).toFixed(2) * 1
            // );
            saveTotalBack["data"].push(
              savePreVal ? savePreVal.toFixed(2) * 1 : null
            );
            savefCategories.push(
              this.$moment(period, "YYYYMM").format("MMM YYYY")
            );
          });
          saveSeries.push(saveTotalBack);
        });
      } else {
        fCategories = [];
        categories.forEach((period) => {
          totalEMU["data"].push(
            (
              (sumTotalUsers[period] / this.monthlyPopulation[period]) *
              100
            ).toFixed(2) * 1
          );
          // totalCYP["data"].push(
          //   (
          //     (sumTotalCYP[period] / (this.monthlyPopulation[period] / 12)) *
          //     100
          //   ).toFixed(2) * 1
          // );
          fCategories.push(this.$moment(period, "YYYYMM").format("MMM YYYY"));
        });
        saveCategories.forEach((period) => {
          saveTotalEMU["data"].push(
            (
              (sumTotalUsers[period] / this.monthlyPopulation[period]) *
              100
            ).toFixed(2) * 1
          );
          // saveTotalCYP["data"].push(
          //   (
          //     (sumTotalCYP[period] / (this.monthlyPopulation[period] / 12)) *
          //     100
          //   ).toFixed(2) * 1
          // );
          savefCategories.push(
            this.$moment(period, "YYYYMM").format("MMM YYYY")
          );
        });
      }

      let tempObj = {
        data: [],

        max: 11,
        categories: [],
        tableData: [],
        saveData: [],
        saveCategories: [],
      };
      tempObj = this.getOtherChartsDetails(tempObj, 3, "line");

      this.saveTotalEmuChartData = {
        isPeriodChart: true,
        reportChartType: tempObj.type,
        saveData: [],
        saveCategories: [],
        cid: this.data["derivedCharts"][3]["chartOptions"]["cid"],
        tableData: [],
        source: this.source,
      };
      series.push(totalEMU);
      /*commented to remove CYPs/Population*/
      //series.push(totalCYP)

      saveSeries.push(saveTotalEMU);
      //saveSeries.push(saveTotalCYP)

      let oPeroid = {};
      series.forEach((key) => {
        key["data"].forEach((d, i) => {
          oPeroid[fCategories[i]] = oPeroid[fCategories[i]] || {};
          oPeroid[fCategories[i]][key.name] = d;
        });
      });
      let aTable = [];
      for (let p in oPeroid) {
        let oP = {
          [this.$i18n.t("period")]: p,
          ...oPeroid[p],
        };
        aTable.push(oP);
      }
      tempObj.data = series;
      tempObj.categories = fCategories;
      tempObj.saveData = saveSeries;
      tempObj.saveCategories = savefCategories;
      tempObj.tableData = [
        {
          name: "compEMU",
          data: aTable,
        },
      ];
      this.totalEMUChartData = tempObj;
      this.saveTotalEmuChartData.saveData = tempObj.saveData;
      this.saveTotalEmuChartData.type = "line";
      this.saveTotalEmuChartData.saveCategories = tempObj.saveCategories;
      // this.saveTotalEmuChartData.tableData = [{
      //   name: 'compEMU',
      //   data: aTable
      // }]
      this.saveFinalEMU();
    },
    allDataFetched() {
      this.getFinalChartsdata();
      this.getPopulation();
      this.bshowLoader = false;

      this.exportArr = [];
      setTimeout(() => {
        if (this.exportPosition == 1) {
          if (!this.newUsersChartData.disable) {
            this.exportArr.push({
              cardKey: "key1",
              ...this.newUsersChartData,
            });
          }
          if (!this.chartData.disable) {
            this.exportArr.push({
              cardKey: "key2",
              ...this.chartData,
            });
          }
          if (!this.totalEMUChartData.disable) {
            this.exportArr.push({
              cardKey: "key3",
              ...this.totalEMUChartData,
            });
          }
          if (!this.trendsChartData.disable) {
            this.exportArr.push({
              cardKey: "key4",
              ...this.trendsChartData,
            });
          }
          if (!this.oneMonthEMUChartData.disable) {
            this.exportArr.push({
              cardKey: "key5",
              ...this.oneMonthEMUChartData,
            });
          }
          if (!this.methodTrendsChartData.disable) {
            this.exportArr.push({
              cardKey: "key6",
              ...this.methodTrendsChartData,
            });
          }
          if (this.exportPPTTable) {
            let pptTable = JSON.parse(JSON.stringify(this.exportPPTTable));
            this.exportArr.push({
              cardKey: "key7",
              source: this.source,
              title: this.data["derivedCharts"][2]["chartOptions"]["chartName"],
              ...pptTable,
            });
          }
        } else if (this.exportPosition == 2) {
          if (!this.newUsersChartData.disable) {
            this.exportArr.push({
              cardKey: "key8",
              ...this.newUsersChartData,
            });
          }
          if (!this.chartData.disable) {
            this.exportArr.push({
              cardKey: "key9",
              ...this.chartData,
            });
          }
          if (!this.totalEMUChartData.disable) {
            this.exportArr.push({
              cardKey: "key10",
              ...this.totalEMUChartData,
            });
          }
          if (!this.trendsChartData.disable) {
            this.exportArr.push({
              cardKey: "key11",
              ...this.trendsChartData,
            });
          }
          if (!this.oneMonthEMUChartData.disable) {
            this.exportArr.push({
              cardKey: "key12",
              ...this.oneMonthEMUChartData,
            });
          }
          if (!this.methodTrendsChartData.disable) {
            this.exportArr.push({
              cardKey: "key13",
              ...this.methodTrendsChartData,
            });
          }
          if (this.exportPPTTable) {
            let pptTable = JSON.parse(JSON.stringify(this.exportPPTTable));
            this.exportArr.push({
              cardKey: "key14",
              source: this.source,
              title: this.data["derivedCharts"][2]["chartOptions"]["chartName"],
              ...pptTable,
            });
          }
        } else if (this.exportPosition == 3) {
          if (!this.newUsersChartData.disable) {
            this.exportArr.push({
              cardKey: "key15",
              ...this.newUsersChartData,
            });
          }
          if (!this.chartData.disable) {
            this.exportArr.push({
              cardKey: "key16",
              ...this.chartData,
            });
          }
          if (!this.totalEMUChartData.disable) {
            this.exportArr.push({
              cardKey: "key17",
              ...this.totalEMUChartData,
            });
          }
          if (!this.trendsChartData.disable) {
            this.exportArr.push({
              cardKey: "key18",
              ...this.trendsChartData,
            });
          }
          if (!this.oneMonthEMUChartData.disable) {
            this.exportArr.push({
              cardKey: "key19",
              ...this.oneMonthEMUChartData,
            });
          }
          if (!this.methodTrendsChartData.disable) {
            this.exportArr.push({
              cardKey: "key20",
              ...this.methodTrendsChartData,
            });
          }
          if (this.exportPPTTable) {
            let pptTable = JSON.parse(JSON.stringify(this.exportPPTTable));
            this.exportArr.push({
              cardKey: "key21",
              source: this.source,
              title: this.data["derivedCharts"][2]["chartOptions"]["chartName"],
              ...pptTable,
            });
          }
        } else if (this.exportPosition == 4) {
          if (!this.newUsersChartData.disable) {
            this.exportArr.push({
              cardKey: "key22",
              ...this.newUsersChartData,
            });
          }
          if (!this.chartData.disable) {
            this.exportArr.push({
              cardKey: "key23",
              ...this.chartData,
            });
          }
          if (!this.totalEMUChartData.disable) {
            this.exportArr.push({
              cardKey: "key24",
              ...this.totalEMUChartData,
            });
          }
          if (!this.trendsChartData.disable) {
            this.exportArr.push({
              cardKey: "key25",
              ...this.trendsChartData,
            });
          }
          if (!this.oneMonthEMUChartData.disable) {
            this.exportArr.push({
              cardKey: "key26",
              ...this.oneMonthEMUChartData,
            });
          }
          if (!this.methodTrendsChartData.disable) {
            this.exportArr.push({
              cardKey: "key27",
              ...this.methodTrendsChartData,
            });
          }
          if (this.exportPPTTable) {
            let pptTable = JSON.parse(JSON.stringify(this.exportPPTTable));
            this.exportArr.push({
              cardKey: "key28",
              source: this.source,
              title: this.data["derivedCharts"][2]["chartOptions"]["chartName"],
              ...pptTable,
            });
          }
        }
        this.emitPPTData();
      }, 5000);
    },
    emitPPTData() {
      this.$emit("sendEMUCharts", this.exportArr);
    },
    saveFinalEMU() {
      let dataStore = {};
      let key = this.generateKey(`monthlyEMU_${this.$i18n.locale}`);
      let allKeys = service.getAllKeys();
      allKeys.then((keys) => {
        if (keys.data.includes(key)) {
          let oConfig = service.getSavedConfig(key);
          oConfig.then((response) => {
            let oResponse = response.data;
            if (oResponse["totalEMU"]) {
              oResponse["totalEMU"] =
                typeof oResponse["totalEMU"] === "string"
                  ? JSON.parse(oResponse["totalEMU"])
                  : oResponse["totalEMU"];
              if (oResponse["totalEMU"][this.location.split("/")[1]]) {
                oResponse["totalEMU"][this.location.split("/")[1]] =
                  this.saveTotalEmuChartData;
              } else {
                oResponse["totalEMU"] = {
                  ...oResponse["totalEMU"],
                  [this.location.split("/")[1]]: this.saveTotalEmuChartData,
                };
              }
            } else {
              oResponse["totalEMU"] = {
                [this.location.split("/")[1]]: this.saveTotalEmuChartData,
              };
            }

            if (oResponse["methodTrend"]) {
              oResponse["methodTrend"] =
                typeof oResponse["methodTrend"] === "string"
                  ? JSON.parse(oResponse["methodTrend"])
                  : oResponse["methodTrend"];
              if (oResponse["methodTrend"][this.location.split("/")[1]]) {
                oResponse["methodTrend"][this.location.split("/")[1]] =
                  this.saveMethodTrendsChartData;
              } else {
                oResponse["methodTrend"] = {
                  ...oResponse["methodTrend"],
                  [this.location.split("/")[1]]: this.saveMethodTrendsChartData,
                };
              }
            } else {
              oResponse["methodTrend"] = {
                [this.location.split("/")[1]]: this.saveMethodTrendsChartData,
              };
            }

            if (oResponse["monthTrend"]) {
              oResponse["monthTrend"] =
                typeof oResponse["monthTrend"] === "string"
                  ? JSON.parse(oResponse["monthTrend"])
                  : oResponse["monthTrend"];
              if (oResponse["monthTrend"][this.location.split("/")[1]]) {
                oResponse["monthTrend"][this.location.split("/")[1]] =
                  this.saveOneMonthEMUChartData;
              } else {
                oResponse["monthTrend"] = {
                  ...oResponse["monthTrend"],
                  [this.location.split("/")[1]]: this.saveOneMonthEMUChartData,
                };
              }
            } else {
              oResponse["monthTrend"] = {
                [this.location.split("/")[1]]: this.saveOneMonthEMUChartData,
              };
            }
            if (oResponse["emuTrend"]) {
              oResponse["emuTrend"] =
                typeof oResponse["emuTrend"] === "string"
                  ? JSON.parse(oResponse["emuTrend"])
                  : oResponse["emuTrend"];
              if (oResponse["emuTrend"][this.location.split("/")[1]]) {
                oResponse["emuTrend"][this.location.split("/")[1]] =
                  this.saveTrendsChartData;
              } else {
                oResponse["emuTrend"] = {
                  ...oResponse["emuTrend"],
                  [this.location.split("/")[1]]: this.saveTrendsChartData,
                };
              }
            } else {
              oResponse["emuTrend"] = {
                [this.location.split("/")[1]]: this.saveTrendsChartData,
              };
            }

            // oResponse['totalEMU'] = JSON.stringify(oResponse['totalEMU'])
            // oResponse['methodTrend'] = JSON.stringify(oResponse['methodTrend'])
            // oResponse['monthTrend'] = JSON.stringify(oResponse['monthTrend'])
            // oResponse['emuTrend'] = JSON.stringify(oResponse['emuTrend'])
            service.updateConfig(oResponse, key).then((res) => {
              if (res.data.status.toLowerCase() === "ok") {
                this.$emit("emittingEMU", this.location);
                this.bshowLoader = false;
                ////console.log(this.location)
                // this.sweetAlert({
                //   title: this.$i18n.t('data_saved_successfully')
                // })
              }
            });
          });
        } else {
          let totalEMU = {
              [this.location.split("/")[1]]: this.saveTotalEmuChartData,
            },
            emuTrend = {
              [this.location.split("/")[1]]: this.saveTrendsChartData,
            },
            methodTrend = {
              [this.location.split("/")[1]]: this.saveMethodTrendsChartData,
            },
            monthTrend = {
              [this.location.split("/")[1]]: this.saveOneMonthEMUChartData,
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
          service.saveConfig(dataStore, key).then((res) => {
            if (res.data.status.toLowerCase() === "ok") {
              this.$emit("emittingEMU", this.location);
              // //console.log('saved', res)
              this.bshowLoader = false;
              // this.sweetAlert({
              //   title: this.$i18n.t('data_saved_successfully')
              // })
            }
          });
        }
      });
    },
    /**
     * This function is to alert when something goes wrong with API.
     * Usage: `showAlert()`
     */
    showAlert() {
      console.trace();
      this.sweetAlert({
        text: this.$i18n.t("somethingwentwrong"),
      });
      this.bshowLoader = false;
    },
    getClass() {
      if (this.signOffActive) {
        return "col-lg-12 col-xl-12 mb-4";
      } else {
        return "col-lg-6 col-xl-6 mb-4";
      }
    },
  },
  mounted() {
    this.getActiveTab("input");
  },
  data() {
    return {
      allMonthArray: [],
      dHSIndDataSeq: [],
      indDataSeq: [],
      finalCalculatedTable: null,
      calculatedUsers: null,
      viewSteps: false,
      saveTotalEmuChartData: null,
      saveMethodTrendsChartData: null,
      saveTrendsChartData: null,
      saveOneMonthEMUChartData: null,
      //scaling: {},
      globalConfig: null,
      bshowLoader: true,
      totalCyp: null,
      currentYear: this.endYear,
      bRequestFlag: false,
      months: [],
      continuation: null,
      monthlyPopulation: {},
      users: {},
      historicUsers: {},
      totalUsers: {},
      chartData: null,
      newUsers: {},
      finalEmu: [],
      newContChart: null,
      trendsChartData: null,
      methodTrendsChartData: null,
      totalEMUChartData: null,
      showTab: true,
      backgroundData: null,
      oneMonthEMUChartData: null,
      inputNewUsers: null,
      newUsersChartData: null,
      items: [],
      filelds: [],
      filterTableData: null,
      options: [],
      filter: "input",
      canComment: false,
      loggedInUserId: "",
      selected: this.method,
      activetab: "",
      catArr: null,
      exportPPTTable: null,
      exportArr: [],
      // cypPopVal: null,
      autoSaveSource: "",
      sourceStartYear: this.data["initialYear"],
      sourceEndYear: this.data["finalYear"],
      categoryInfo: this.data["categoryInfo"],
      tabCategoryInfo: this.data["tabCategoryInfo"],
      methodSeq: [],
      mainmethodSeq: [],
    };
  },
  watch: {
    method(newVal) {
      this.selected = newVal;
    },
    bRequestFlag(newVal) {
      if (newVal) {
        this.allDataFetched();
      }
    },
    location(newVal) {
      if (newVal) {
        this.months = [];
        this.items = [];
        this.newUsersChartData = null;
        this.chartData = null;
        this.totalEMUChartData = null;
        this.trendsChartData = null;
        this.methodTrendsChartData = null;
        this.oneMonthEMUChartData = null;
        this.bRequestFlag = false;
        this.bshowLoader = true;
        this.getBackgroundData();
        // this.getGlobalConfig();
      }
    },
    selected(newVal) {
      if (newVal && this.filterTableData) {
        this.items = [];
        this.drawTable();
      }
      this.emitPPTData();
    },
    signOffActive(newVal) {
      this.signOffActive = newVal;
      this.newUsersChartData = null;
      this.chartData = null;
      this.totalEMUChartData = null;
      this.trendsChartData = null;
      this.methodTrendsChartData = null;
      this.oneMonthEMUChartData = null;
      this.bRequestFlag = false;
      this.bshowLoader = true;
      this.getGlobalConfig();
    },
  },
};
</script>
<style>
.vue-treeselect__placeholder,
.vue-treeselect__single-value {
  line-height: 1.5;
  color: var(--text-color) !important;
}

.vue-treeselect--open-below:not(.vue-treeselect--append-to-body)
  .vue-treeselect__menu-container {
  top: 100%;
  color: var(--color-black);
}

.saveEMUBtn {
  position: absolute;
  top: -90px;
  right: 65px;
  z-index: 1;
}
.showStepBtn {
  position: absolute;
  top: -90px;
  right: 17px;
  z-index: 1;
}
</style>
