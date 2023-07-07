<template>
  <div>
    <div class="row me-15" v-bind:style="getSourceClass()">
      <div class="col-lg-12">
        <div class="btn condom-filter pointer-none">
          <span
            v-for="(option, i) in options"
            :key="i"
            class="pointer-events-none color-white fs-17-1920"
          >
            {{ option.label }}
          </span>
        </div>
        <div class="top-date-page-div">
          <span class="btn pointer-events-none color-white">
            {{ startYear }} - {{ endYear }}
          </span>
        </div>
      </div>
    </div>

    <div class="row dashboardchart-container emu-dqr m-2">
      <div
        v-bind:class="getClass()"
        v-if="emuMcprComparisionChart"
        class="border-right"
      >
        <card-component
          :chartdata="emuMcprComparisionChart"
          :canComment="canComment"
          :loggedInUserId="loggedInUserId"
          defaultSort="JAN-DEC"
          sorting="type3"
        />
      </div>

      <div v-bind:class="getClass()" v-if="annualAvgComparisionChart">
        <card-component
          :chartdata="annualAvgComparisionChart"
          :canComment="canComment"
          :loggedInUserId="loggedInUserId"
          defaultSort="A-Z"
          sorting="type4"
        />
      </div>
    </div>

    <div class="row dashboardchart-container emu-dqr m-2">
      <div
        v-bind:class="getClass()"
        v-if="annualComparisionOfMethods"
        class="border-right"
      >
        <card-component
          :chartdata="annualComparisionOfMethods"
          :canComment="canComment"
          :loggedInUserId="loggedInUserId"
          defaultSort="A-Z"
          sorting="type4"
        />
      </div>
      <div v-bind:class="getClass()" v-if="annualuserTrendsDataByMethods">
        <card-component
          :chartdata="annualuserTrendsDataByMethods"
          :ddOptions="userMethodList"
          @handleFilterChange="handleUserMthdChange"
          :canComment="canComment"
          :loggedInUserId="loggedInUserId"
          defaultSort="JAN-DEC"
          sorting="type3"
        />
      </div>
      <loader v-else />
    </div>
    <div class="row dashboardchart-container">
      <div class="col-lg-12 col-xl-12 m-b-40px">
        <div class="card mb-25px">
          <div class="card-header p-10px text-decoration-none">
            <div class="row no-gutters p-0-15px">
              <div class="col-lg-12 col-md-12 p-t-4px">
                {{ $t("emu_output_1") }}
              </div>
              <!-- <div class="col-lg-5 col-md-5"></div> -->
            </div>
          </div>
          <div class="card-body p-4">
            <div class="table-responsive">
              <table class="table table-bordered">
                <thead>
                  <th>{{ $t("emu_output_2") }}</th>
                  <th>{{ $t("emu_output_3") }}</th>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ $t("emu_output_4") }}</td>
                    <td>
                      <div class="form-group mb-0">
                        <select
                          class="form-control"
                          id="exampleFormControlSelect1"
                        >
                          <option
                            v-if="
                              data['Commodities_Client'][
                                'dataOnContraceptive'
                              ] == 'Yes'
                            "
                          >
                            {{ $t("emu_output_5") }}
                          </option>
                          <option
                            v-if="
                              data['Commodities_Facilities'][
                                'dataOnContraceptive'
                              ] == 'Yes'
                            "
                          >
                            {{ $t("emu_output_6") }}
                          </option>
                          <option
                            v-if="
                              data['Visits']['dataOnContraceptive'] == 'Yes'
                            "
                          >
                            {{ $t("emu_output_7") }}
                          </option>
                          <option
                            v-if="data['User']['dataOnContraceptive'] == 'Yes'"
                          >
                            {{ $t("emu_output_8") }}
                          </option>
                        </select>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t("emu_output_9") }}</td>
                    <td>
                      <div class="form-group mb-0">
                        <select
                          class="form-control"
                          id="exampleFormControlSelect1"
                        >
                          <option
                            v-if="
                              data['Commodities_Client'][
                                'dataOnContraceptive'
                              ] == 'Yes'
                            "
                          >
                            {{ $t("emu_output_5") }}
                          </option>
                          <option
                            v-if="
                              data['Commodities_Facilities'][
                                'dataOnContraceptive'
                              ] == 'Yes'
                            "
                          >
                            {{ $t("emu_output_6") }}
                          </option>
                          <option
                            v-if="
                              data['Visits']['dataOnContraceptive'] == 'Yes'
                            "
                          >
                            {{ $t("emu_output_7") }}
                          </option>
                          <option
                            v-if="data['User']['dataOnContraceptive'] == 'Yes'"
                          >
                            {{ $t("emu_output_8") }}
                          </option>
                        </select>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t("emu_output_10") }}</td>
                    <td>
                      <div class="form-group mb-0">
                        <select
                          class="form-control"
                          id="exampleFormControlSelect1"
                        >
                          <option
                            v-if="
                              data['Commodities_Client'][
                                'dataOnContraceptive'
                              ] == 'Yes'
                            "
                          >
                            {{ $t("emu_output_5") }}
                          </option>
                          <option
                            v-if="
                              data['Commodities_Facilities'][
                                'dataOnContraceptive'
                              ] == 'Yes'
                            "
                          >
                            {{ $t("emu_output_6") }}
                          </option>
                          <option
                            v-if="
                              data['Visits']['dataOnContraceptive'] == 'Yes'
                            "
                          >
                            {{ $t("emu_output_7") }}
                          </option>
                          <option
                            v-if="data['User']['dataOnContraceptive'] == 'Yes'"
                          >
                            {{ $t("emu_output_8") }}
                          </option>
                        </select>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t("emu_output_11") }}</td>
                    <td>
                      <div class="form-group mb-0">
                        <select
                          class="form-control"
                          id="exampleFormControlSelect1"
                          @change="getMethodData"
                          v-model="category"
                        >
                          <option
                            :value="$t('emu_output_5')"
                            v-if="
                              data['Commodities_Client'][
                                'dataOnContraceptive'
                              ] == 'Yes'
                            "
                          >
                            {{ $t("emu_output_5") }}
                          </option>
                          <option
                            :value="$t('emu_output_6')"
                            v-if="
                              data['Commodities_Facilities'][
                                'dataOnContraceptive'
                              ] == 'Yes'
                            "
                          >
                            {{ $t("emu_output_6") }}
                          </option>
                          <option
                            :value="$t('emu_output_7')"
                            v-if="
                              data['Visits']['dataOnContraceptive'] == 'Yes'
                            "
                          >
                            {{ $t("emu_output_7") }}
                          </option>
                          <option
                            :value="$t('emu_output_8')"
                            v-if="data['User']['dataOnContraceptive'] == 'Yes'"
                          >
                            {{ $t("emu_output_8") }}
                          </option>
                        </select>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row dashboardchart-container">
      <div class="col-lg-12 col-xl-12 m-b-40px">
        <div class="card mb-25px mt-25px">
          <div class="card-header p-10px text-decoration-none">
            <div class="row no-gutters p-0-15px">
              <div class="col-lg-11 col-md-11 p-t-4px">
                {{ $t("emu_output_12") }}
              </div>
              <div class="col-lg-1 col-md-1">
                <download-csv
                  class="btn color-white cursor-pointer w-100 p-0"
                  :data="items"
                >
                  <a href="#" class="color-white">
                    <div class="row no-gutters">
                      <div class="col text-right">
                        <p class="m-0px">
                          <span>
                            <img
                              :src="
                                require('@/assets/images/icons/downloadActive.svg')
                              "
                              class="w-auto mx-1 mt-lg-n1"
                              :style="{ filter: filterColor }"
                            />
                          </span>
                          <span class="mx-1"> {{ $t("csv") }} </span>
                        </p>
                      </div>
                    </div>
                  </a>
                </download-csv>
              </div>
            </div>
          </div>
          <div class="card-body p-4">
            <div class="table-responsive">
              <b-table
                striped
                sticky-header
                hover
                :items="items"
                :fields="fields"
              ></b-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <a
      class="btn black-btn pointer-events-none color-white mx-4 save-emubtn mt-25px"
      @click="saveFinalEMU"
      style="margin-bottom: 30px"
    >
      {{ $t("save-EMU") }}
    </a>
  </div>
</template>
<script>
import dataM from "./../emuAnnual/dataMassaging";
import cardComponent from "./../emuAnnual/cardComponent";
import selectDD from "./../emuAnnual/selectDD";
import service from "@/service";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import StaticColorMixin from "@/helpers/StaticColorMixin";

export default {
  props: [
    "outputData",
    "slopeData",
    "surveyData",
    "finalMethodArr",
    "bgData",
    "bAllWomen",
    "userTrendsData",
    "userTrendsDataByMethods",
    "startYear",
    "endYear",
    "location",
    "data",
    "filter",
    "boolVal",
    "year",
    "signOffActive",
    "defaultLevelID",
    "filterYear",
    "userDetails",
    "defaultEMU",
    "emuOuputFinalEMu",
    "initialYear",
  ],
  mixins: [DynamicImageMixin, StaticColorMixin],
  components: {
    cardComponent,
    selectDD,
  },
  data() {
    return {
      emuMcprComparisionChart: null,
      annualAvgComparisionChart: null,
      annualComparisionOfMethods: null,
      annualuserTrendsDataByMethods: null,
      saveEmuMcprComp: {},
      saveAnnualAvgComp: {},
      saveCompareMethods: {},
      saveuserTrendsByMethods: {},
      /* PMS:this.bAllWomen ? this.bgData['PMS']['AW'] : this.bgData['PMS']['MW'],
                MICS:this.bAllWomen ? this.bgData['MICS']['AW'] : this.bgData['MICS']['MW'], */
      PMS: this.bgData["PMS"],
      MICS: this.bgData["MICS"],
      bgIndColor: this.bgData["bgIndColor"],
      selectedUserMethod: 0,
      userMethodList: null,
      items: [],
      //category: this.sourcecategory,
      category: this.defaultEMU,
      includeCondoms: false,
      //curentYear:this.endYear,
      curentYear: this.year,
      yearFilterList: this.getYearList(),
      options: [],
      canComment: false,
      loggedInUserId: "",
      fields: [],
      sYearArray: [],
    };
  },
  mounted() {},
  created() {
    let sYear = dataM.getYearFormated(this.initialYear, this.endYear);
    this.sYearArray = sYear.split(";");
    this.getUser();
    this.drawComparisionofEmuMcpr();
    this.drawAnnualAvgComparision();
    this.drawComparisionofUsersByMethods();
    this.drawUserBymethods(true);
    //this.getMethodData();
    this.saveFinalEMU();
  },
  methods: {
    getClass() {
      if (this.signOffActive) {
        return "col-lg-12 col-xl-12 mb-4";
      } else {
        return "col-lg-6 col-xl-6 mb-4";
      }
    },
    getSourceClass() {
      if (this.signOffActive) {
        return "position: relative;margin-bottom: 7%;";
      } else {
        return "position: relative;margin-bottom: 5%;";
      }
    },
    getUser() {
      this.loggedInUserId = this.userDetails.id;
      this.canComment =
        this.$store.getters.getIsAdmin ||
        this.$store.getters.getUserPermissions.canComment;
    },
    getOtherChartDetails(obj, index, chartType) {
      obj.xTitle =
        typeof this.data["Output"]["derivedCharts"][index]["chartOptions"][
          "xAxis"
        ]["text"] == "object"
          ? this.data["Output"]["derivedCharts"][index]["chartOptions"][
              "xAxis"
            ]["text"][this.$i18n.locale]
          : this.data["Output"]["derivedCharts"][index]["chartOptions"][
              "xAxis"
            ]["text"];
      obj.yTitle =
        typeof this.data["Output"]["derivedCharts"][index]["chartOptions"][
          "yAxis"
        ]["text"] == "object"
          ? this.data["Output"]["derivedCharts"][index]["chartOptions"][
              "yAxis"
            ]["text"][this.$i18n.locale]
          : this.data["Output"]["derivedCharts"][index]["chartOptions"][
              "yAxis"
            ]["text"];
      obj.type = chartType;
      obj.title =
        typeof this.data["Output"]["derivedCharts"][index]["chartOptions"][
          "chartName"
        ] == "object"
          ? this.data["Output"]["derivedCharts"][index]["chartOptions"][
              "chartName"
            ][this.$i18n.locale]
          : this.data["Output"]["derivedCharts"][index]["chartOptions"][
              "chartName"
            ];
      obj.disable =
        this.data["Output"]["derivedCharts"][index]["chartOptions"][
          "disableChart"
        ];
      obj.chartInfo =
        typeof this.data["Output"]["derivedCharts"][index]["chartOptions"][
          "chartInfo"
        ] == "object"
          ? this.data["Output"]["derivedCharts"][index]["chartOptions"][
              "chartInfo"
            ][this.$i18n.locale]
          : this.data["Output"]["derivedCharts"][index]["chartOptions"][
              "chartInfo"
            ];
      obj.cid =
        this.data["Output"]["derivedCharts"][index]["chartOptions"]["cid"];
      return obj;
    },
    drawComparisionofEmuMcpr() {
      this.options = [];
      let obj = {
        commoditiesToClients: this.$i18n.t("Commodities_Client"),
        commoditiesToFacilities: this.$i18n.t("Commodities_Facilities"),
        fp_visits: this.$i18n.t("visits"),
        fp_users: this.$i18n.t("users"),
      };
      Object.keys(this.filter).forEach((key) => {
        if (this.filter[key] == "inc") {
          this.options.push({
            val: this.filter[key],
            label: obj[key] + " " + this.$i18n.t("inc_condoms"),
          });
        } else {
          this.options.push({
            val: this.filter[key],
            label: obj[key] + " " + this.$i18n.t("ex_condoms"),
          });
        }
      });
      let aMICS = [];
      aMICS = [
        {
          name: this.bAllWomen
            ? this.$i18n.t("mCPR_AW_MICS")
            : this.$i18n.t("mCPR_MW_MICS"),
          data: [],
          color: this.bgIndColor["MICS"],
          keyVal: {},
        },
      ];
      if (this.MICS) {
        for (let yearInd in this.sYearArray) {
          let year = this.sYearArray[yearInd];
          aMICS[0].data.push(this.MICS[year] ? this.MICS[year] : null);
          aMICS[0].keyVal[year] = this.MICS[year] ? this.MICS[year] : null;
        }
      }
      let unpdData = {},
        unpdtext = "";
      if (this.defaultLevelID == this.location.split("/")[0]) {
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
      let oResponse = dataM.getemuComparisonData(
        bgSureyData,
        this.outputData,
        this.filter,
        this.staticColors
      );
      // let oResponse =  dataM.getEMUOPCompChart(this.outputData, this.filter);
      //oResponse.title = this.bAllWomen ? "Comparing EMUs and mCPR (AWRA)" : 'Comparing EMUs and mCPR (MWRA)';
      oResponse.source = this.category;

      //oResponse.data = [...oResponse.data,...aPMC,...aMICS];
      oResponse = this.getOtherChartDetails(oResponse, 0, "line");
      oResponse.data = [...oResponse.data, ...aMICS];
      oResponse.fields = [];
      oResponse.tableData = [];
      oResponse.fields.push({ key: this.$i18n.t("period"), sortable: true });
      oResponse.categories.forEach((cat, i) => {
        let row = {};
        row[this.$i18n.t("period")] = cat;
        oResponse.data.forEach((d) => {
          if (oResponse.fields.indexOf(d.name) == -1) {
            oResponse.fields.push(d.name);
          }
          row[d.name] = d.data[i];
        });
        oResponse.tableData.push(row);
      });
      this.emuMcprComparisionChart = oResponse;
      this.saveEmuMcprComp.categories = oResponse.categories;
      this.saveEmuMcprComp.data = this.emuMcprComparisionChart.data;
      this.saveEmuMcprComp.cid = oResponse.cid;
      this.saveEmuMcprComp.tableData = this.emuMcprComparisionChart.tableData;
      this.saveEmuMcprComp.type = oResponse.type;
      this.saveEmuMcprComp.reportChartType = oResponse.type;
      this.saveEmuMcprComp.isPeriodChart = true;
      this.getMethodData();
    },
    drawAnnualAvgComparision() {
      let oResponse = dataM.getSlopData(this.emuMcprComparisionChart);
      oResponse = this.getOtherChartDetails(oResponse, 1, "bar");
      this.annualAvgComparisionChart = oResponse;
      this.saveAnnualAvgComp.categories = oResponse.categories;
      this.saveAnnualAvgComp.data = oResponse.data;
      this.saveAnnualAvgComp.cid = oResponse.cid;
      this.saveAnnualAvgComp.tableData = oResponse.tableData;
      this.saveAnnualAvgComp.type = oResponse.type;
      this.saveAnnualAvgComp.reportChartType = oResponse.type;
      this.saveAnnualAvgComp.isPeriodChart = false;
    },
    drawComparisionofUsersByMethods() {
      let oRet = dataM.emuOutputCompByMethod(
        this.curentYear,
        this.sYearArray,
        this.userTrendsData,
        this.surveyData,
        this.finalMethodArr,
        this.emuOuputFinalEMu
      );
      let retData = oRet.data ? oRet.data.reverse() : [];
      let oResponse = {
        data: retData,
        source: this.category,
        categories: oRet.categories,
        tableData: oRet.tableData,
        fields: oRet.fields,
      };
      oResponse = this.getOtherChartDetails(oResponse, 2, "bar");
      this.annualComparisionOfMethods = oResponse;
      this.saveCompareMethods.categories = oResponse.categories;
      this.saveCompareMethods.data = oResponse.data;
      this.saveCompareMethods.cid = oResponse.cid;
      this.saveCompareMethods.tableData = oResponse.tableData;
      this.saveCompareMethods.type = oResponse.type;
      this.saveCompareMethods.reportChartType = oResponse.type;
      this.saveCompareMethods.isPeriodChart = false;
    },
    drawUserBymethods(p_bFlag) {
      let oRet = dataM.emuOutputUserByMethod(
          this.sYearArray,
          this.userTrendsData,
          this.finalMethodArr,
          this.emuOuputFinalEMu,
          this.filter,
          this.staticColors
        ),
        aCategories = Object.keys(oRet),
        sMethod;
      this.saveuserTrendsByMethods = oRet;
      this.saveuserTrendsByMethods.type = "line";
      this.saveuserTrendsByMethods.reportChartType = "line";
      this.saveuserTrendsByMethods.isPeriodChart = true;
      this.saveuserTrendsByMethods.cid =
        this.data["Output"]["derivedCharts"][3]["chartOptions"]["cid"];
      this.userMethodList = aCategories;
      if (p_bFlag) {
        this.selectedUserMethod = 0;
      }
      sMethod = this.userMethodList[this.selectedUserMethod];
      let newMdata =
        oRet[sMethod] && oRet[sMethod].data ? oRet[sMethod].data : [];
      if (sMethod) {
        this.annualuserTrendsDataByMethods = {
          data: newMdata,
          source: this.category,
          categories: oRet[sMethod].categories,
          tableData: oRet[sMethod].tableData,
          //fields: oRet[sMethod].fields
        };
        this.annualuserTrendsDataByMethods = this.getOtherChartDetails(
          this.annualuserTrendsDataByMethods,
          3,
          "line"
        );
      }
      console.log(
        this.saveuserTrendsByMethods,
        this.saveuserTrendsByMethods,
        "----"
      );
    },
    getMethodData() {
      localStorage.setItem("methodCategory", this.category);
      this.items = [];
      let data = this.emuMcprComparisionChart.data.filter(
        (d) => d.name == this.category
      );
      console.log(
        data,
        this.emuMcprComparisionChart.data,
        this.category,
        "emu o/p last table"
      );
      this.emuMcprComparisionChart.categories.forEach((res, i) => {
        if (data[0].data[i]) {
          this.items.push({
            [this.$i18n.t("year")]: res,
            [this.$i18n.t("EMU")]: Number(data[0].data[i]).toFixed(2),
            [this.$i18n.t("service_type")]: data[0].name,
          });
        }
      });
    },
    handleUserMthdChange(value) {
      this.selectedUserMethod = value;
      this.drawUserBymethods();
    },
    onConChange(p_val) {
      this.includeCondoms = p_val === "true";
      this.drawComparisionofEmuMcpr();
      this.drawAnnualAvgComparision();
    },
    onYearChange(p_val) {
      this.curentYear = p_val;
      this.drawComparisionofUsersByMethods();
    },
    getYearList() {
      let aKeys = [],
        nStart = this.startYear * 1,
        nEnd = this.endYear * 1;
      if (!(isNaN(nStart) || isNaN(nEnd))) {
        while (nStart <= nEnd) {
          aKeys.push(nStart);
          nStart++;
        }
      }
      let i,
        nLen = aKeys.length,
        aFinalList = [];
      for (i = 0; i < nLen; i++) {
        let oTemp = { val: aKeys[i], label: aKeys[i] };
        aFinalList.push(oTemp);
      }
      return aFinalList;
    },
    saveFinalEMU() {
      this.saveEmuMcprComp.source = this.category;
      this.saveAnnualAvgComp.source = this.category;
      this.saveCompareMethods.source = this.category;
      // this.userTrendsDataByMethods.source = this.category
      //console.log(this.$store.state.methodTable)
      let dataStore = {};
      let key = this.generateKey(`annualEMU_${this.$i18n.locale}`);
      let allKeys = service.getAllKeys();
      allKeys.then((keys) => {
        if (keys.data.includes(key)) {
          let oConfig = service.getSavedConfig(key);
          oConfig.then((response) => {
            let oResponse = response.data;
            if (oResponse["compEMU"]) {
              oResponse["compEMU"] = JSON.parse(oResponse["compEMU"]);
              if (oResponse["compEMU"][this.location.split("/")[1]]) {
                oResponse["compEMU"][this.location.split("/")[1]] =
                  this.saveEmuMcprComp;
              } else {
                oResponse["compEMU"] = {
                  ...oResponse["compEMU"],
                  [this.location.split("/")[1]]: this.saveEmuMcprComp,
                };
              }
            } else {
              oResponse["compEMU"] = {
                [this.location.split("/")[1]]: this.saveEmuMcprComp,
              };
            }

            if (oResponse["compAvgAnuual"]) {
              oResponse["compAvgAnuual"] = JSON.parse(
                oResponse["compAvgAnuual"]
              );
              if (oResponse["compAvgAnuual"][this.location.split("/")[1]]) {
                oResponse["compAvgAnuual"][this.location.split("/")[1]] =
                  this.saveAnnualAvgComp;
              } else {
                oResponse["compAvgAnuual"] = {
                  ...oResponse["compAvgAnuual"],
                  [this.location.split("/")[1]]: this.saveAnnualAvgComp,
                };
              }
            } else {
              oResponse["compAvgAnuual"] = {
                [this.location.split("/")[1]]: this.saveAnnualAvgComp,
              };
            }

            if (oResponse["compUsers"]) {
              oResponse["compUsers"] = JSON.parse(oResponse["compUsers"]);
              if (oResponse["compUsers"][this.location.split("/")[1]]) {
                oResponse["compUsers"][this.location.split("/")[1]] =
                  this.saveCompareMethods;
              } else {
                oResponse["compUsers"] = {
                  ...oResponse["compUsers"],
                  [this.location.split("/")[1]]: this.saveCompareMethods,
                };
              }
            } else {
              oResponse["compUsers"] = {
                [this.location.split("/")[1]]: this.saveCompareMethods,
              };
            }

            if (oResponse["usersTrend"]) {
              oResponse["usersTrend"] = JSON.parse(oResponse["usersTrend"]);
              if (oResponse["usersTrend"][this.location.split("/")[1]]) {
                oResponse["usersTrend"][this.location.split("/")[1]] =
                  this.saveuserTrendsByMethods;
              } else {
                oResponse["usersTrend"] = {
                  ...oResponse["usersTrend"],
                  [this.location.split("/")[1]]: this.saveuserTrendsByMethods,
                };
              }
            } else {
              oResponse["usersTrend"] = {
                [this.location.split("/")[1]]: this.saveuserTrendsByMethods,
              };
            }
            if (oResponse["methodTable"]) {
              oResponse["methodTable"] = JSON.parse(oResponse["methodTable"]);
              //console.log(this.$store.state.methodTable)
              if (oResponse["methodTable"][this.location.split("/")[1]]) {
                oResponse["methodTable"][this.location.split("/")[1]] = this
                  .$store.state.methodTable
                  ? this.$store.state.methodTable[this.location.split("/")[1]]
                  : null;
              } else {
                oResponse["methodTable"] = {
                  ...oResponse["methodTable"],
                  [this.location.split("/")[1]]: this.$store.state.methodTable
                    ? this.$store.state.methodTable[this.location.split("/")[1]]
                    : null,
                };
              }
            } else {
              oResponse["methodTable"] = {
                [this.location.split("/")[1]]: this.$store.state.methodTable
                  ? this.$store.state.methodTable[this.location.split("/")[1]]
                  : null,
              };
            }
            //if(oResponse['methodTable']){
            //    oResponse['methodTable'] = this.$store.state.methodTable
            //}
            oResponse["emuColors"] = JSON.parse(
              localStorage.getItem("emuColors")
            );
            oResponse["compEMU"] = JSON.stringify(oResponse["compEMU"]);
            oResponse["compAvgAnuual"] = JSON.stringify(
              oResponse["compAvgAnuual"]
            );
            oResponse["compUsers"] = JSON.stringify(oResponse["compUsers"]);
            oResponse["usersTrend"] = JSON.stringify(oResponse["usersTrend"]);
            oResponse["methodTable"] = JSON.stringify(oResponse["methodTable"]);
            // console.log(oResponse)
            service.updateConfig(oResponse, key).then(() => {
              this.$store.commit("setEMUMethodTable", null);
              this.$store.commit("setEMUColors", null);
              this.$emit("saveEMUAuto", this.location);
            });

            // this.saveLocalStorage(key, this.emuMcprComparisionChart, 'compEMU')
            // this.saveLocalStorage(key, this.annualAvgComparisionChart, 'compAvgAnuual')
            // this.saveLocalStorage(key, this.annualComparisionOfMethods, 'compUsers')
            // this.saveLocalStorage(key, this.userTrendsDataByMethods, 'usersTrend')
          });
        } else {
          let compEMUObj = {
              [this.location.split("/")[1]]: this.saveEmuMcprComp,
            },
            compAvgAnuualObj = {
              [this.location.split("/")[1]]: this.saveAnnualAvgComp,
            },
            compUsersObj = {
              [this.location.split("/")[1]]: this.saveCompareMethods,
            },
            usersTrendObj = {
              [this.location.split("/")[1]]: this.saveuserTrendsByMethods,
            },
            methodTable = {
              [this.location.split("/")[1]]: this.$store.state.methodTable
                ? this.$store.state.methodTable[this.location.split("/")[1]]
                : null,
            };

          dataStore = {
            compEMU: JSON.stringify(compEMUObj),
            compAvgAnuual: JSON.stringify(compAvgAnuualObj),
            compUsers: JSON.stringify(compUsersObj),
            usersTrend: JSON.stringify(usersTrendObj),
            methodTable: JSON.stringify(methodTable),
            emuColors: JSON.parse(localStorage.getItem("emuColors")),
          };
          service.saveConfig(dataStore, key).then(() => {
            this.$store.commit("setEMUMethodTable", null);
            this.$store.commit("setEMUColors", null);
            this.$emit("saveEMUAuto", this.location);
          });
        }
      });
    },
  },
  watch: {
    year(newVal) {
      if (newVal) {
        this.curentYear = newVal;
        this.drawComparisionofUsersByMethods();
      }
    },
    // boolVal(newV){
    //     console.log(newV)
    //     this.options = []
    //     this.drawComparisionofEmuMcpr()
    //     this.drawAnnualAvgComparision()
    // },
    // bgData(newVal){
    //    // console.log(newVal)
    //     this.PMS = newVal['PMS']
    //     this.MICS = newVal['MICS']
    //     this.drawComparisionofEmuMcpr()
    //     this.drawAnnualAvgComparision()
    // }
  },
};
</script>
<style scoped lang="scss">
.condom-filter {
  position: absolute;
  /* top: -25px; */
  right: 110px;
  width: auto;
  font-size: 0.875rem;
  padding: 12px 12px;
  background-color: var(--new-header-color);
  border-color: var(--new-header-color);

  span {
    padding: 0;
    background-color: var(--new-header-color);
    border-color: var(--new-header-color);
    border-right: 1px solid var(--border-grey-color);
    margin-right: 14px;
    padding-right: 12px;
  }
  span:last-child {
    border-right: 0px solid var(--border-grey-color);
  }
}

.top-date-page-div {
  position: absolute;
  top: 0;
  right: 15px;

  span {
    background-color: var(--new-footer-component-color);
    border-color: var(--new-footer-component-color);
    font-size: 0.875rem;
    padding: 12px 12px;
  }
  span:hover {
    background-color: var(--new-footer-component-color);
    border-color: var(--new-footer-component-color);
  }
}
</style>
