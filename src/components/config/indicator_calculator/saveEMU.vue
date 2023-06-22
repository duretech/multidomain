<template>
  <b-tabs class="md_tabs mt-xl-n3 default-tab">
    <b-tab active @click="updateActiveSubTab('emu_settings')">
      <div no-body class="p-1">
        <b-form>
          <div class="accordion" role="tablist">
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">
                <b-button block v-b-toggle.accordion-emu1 variant="info">{{
                  $t("emuSettings")
                }}</b-button>
              </b-card-header>
              <b-collapse
                id="accordion-emu1"
                visible
                accordion="my-accordion"
                role="tabpanel"
              >
                <b-card-body>
                  <b-card-text>
                    <div class="d-flex justify-content-end">
                      <!-- <h5 class="color-text">{{ $t("dataMapping") }}</h5> -->
                      <div>
                        <b-button
                          class="btn btn-primary black-btn mr-2"
                          @click="openLoc()"
                          >{{ $t("selectLocationScheduler") }}</b-button
                        >
                        <b-button
                          class="btn btn-primary black-btn"
                          id="startEMUButton"
                          @click="startAutoEMU()"
                          >{{ $t("startEMU") }}</b-button
                        >
                      </div>
                      <singlePage
                        v-if="
                          EMULocation &&
                          defaultType &&
                          dqrConfig &&
                          dqrConfig.emu.Background_Data.locArr.length > 0 &&
                          startP
                        "
                        :startP="startP"
                        :dqrConfig="dqrConfig"
                        :globeData="bgDataConfig"
                        :defaultType="defaultType"
                        :deList="dataElementList"
                        :loc="EMULocation"
                        :finalCount="finalCount"
                        :categoryOptionID="categoryOptionID"
                        :methodCatId="methodCatId"
                        @getLocs="getLocs"
                        @sendStart="sendStart"
                        @saveJson="saveJson"
                      />
                      <!--  :deNameInc="deNameInc"
                          :deNameEx="deNameEx"
                          :deName="deName" -->
                    </div>
                    <div
                      class="d-flex justify-content-between align-items-center my-3"
                    >
                      <div class="w-50">
                        {{ $t("family_Planning_Women_Population") }}
                      </div>
                      <b-form-select
                        class="w-50"
                        v-model="
                          dqrConfig.emu.Background_Data.FPWomenPopulation
                        "
                        :options="fpWomenPopulation"
                      ></b-form-select>
                    </div>

                    <div
                      class="d-flex justify-content-between align-items-center my-3"
                    >
                      <div class="w-50">
                        {{ $t("completeService") }}
                      </div>
                      <b-form-input
                        class="w-50"
                        v-model="dqrConfig.emu.Background_Data.SSDataRecentYear"
                        required
                      ></b-form-input>
                    </div>
                    <div
                      class="d-flex justify-content-between align-items-center my-3"
                    >
                      <div class="w-50">
                        {{ $t("adjustmentFactor") }}
                      </div>
                      <select
                        class="w-50 form-control custom-select"
                        id="adjustmentFactor"
                        v-model="dqrConfig.emu.Background_Data.adjustmentFactor"
                      >
                        <option value="Yes">
                          {{ $t("yes") }}
                        </option>
                        <option value="No">
                          {{ $t("no") }}
                        </option>
                      </select>
                    </div>
                    <div
                      class="d-flex justify-content-between align-items-center my-3"
                    >
                      <div class="w-50">Default data type :</div>
                      <b-form-select
                        v-if="defaultDataTypeOptions.length > 0"
                        class="w-50"
                        v-model="dqrConfig.emu.Background_Data.defaultDataType"
                        :options="defaultDataTypeOptions"
                        :select-size="4"
                        multiple
                      ></b-form-select>
                    </div>
                  </b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>

          <div
            :key="index"
            v-for="(dtType, index) in this.dqrConfig.emu.Background_Data
              .defaultDataType"
          >
            <span class="hide">{{ getDataElementNames }}</span>
            <div class="accordion w-100 mt-2" role="tablist">
              <b-form no-body class="mb-1">
                <b-card-header header-tag="header" class="p-1" role="tab">
                  <b-button block v-b-toggle.accordion-1 variant="info"
                    >{{
                      dtType === "Commodities_Client"
                        ? "Commodities Client"
                        : dtType === "Commodities_Facilities"
                        ? "Commodities Facilities"
                        : dtType
                    }}
                  </b-button>
                </b-card-header>
                <b-collapse
                  id="accordion-1"
                  accordion="my-accordion"
                  role="tabpanel"
                >
                  <b-card-body v-if="dtType !== ''">
                    <b-form
                      class="d-flex justify-content-between align-items-center my-3"
                    >
                      <div class="w-50">{{ $t("AnnualEMUInc") }}</div>
                      <b-form-input
                        class="w-50"
                        v-model="dqrConfig.emu[dtType]['incCondomEMU']"
                        required
                      ></b-form-input>
                    </b-form>
                    <b-form
                      class="d-flex justify-content-between align-items-center my-3"
                    >
                      <div class="w-50">{{ $t("AnnualEMUExc") }}</div>
                      <b-form-input
                        class="w-50"
                        v-model="dqrConfig.emu[dtType]['excCondomEMU']"
                        required
                      ></b-form-input>
                    </b-form>
                    <b-form
                      class="d-flex justify-content-between align-items-center my-3"
                    >
                      <div class="w-50">{{ $t("monthlyEmu") }}</div>
                      <b-form-input
                        class="w-50"
                        v-model="dqrConfig.emu[dtType]['monthlyEMU']"
                        required
                      ></b-form-input>
                    </b-form>
                  </b-card-body>
                </b-collapse>
              </b-form>
            </div>
          </div>
          <b-button
            class="float-right btn btn-primary black-btn save-btn mr-2 mt-5"
            @click="saveJson"
            >{{ $t("savebtn") }}</b-button
          >
        </b-form>
      </div>
      <b-modal
        ref="location-modal"
        hide-footer
        centered
        :title="$t('selectLocation')"
      >
        <div class="d-block text-left default-btn">
          <h5>{{ $t("selectLocation") }}</h5>
          <treeselect
            :multiple="true"
            class=""
            :options="computedLocList"
            :show-count="true"
            :placeholder="$t('search')"
            v-model="selectedNode"
            :flat="true"
            :default-expand-level="1"
          />
        </div>
        <b-row>
          <b-col class="mx-5">
            <b-button
              class="btn btn-primary black-btn greycolor-btn mt-2 w-75"
              variant="outline-danger"
              block
              @click="hideModal"
              >{{ $t("close") }}</b-button
            >
          </b-col>
          <b-col>
            <b-button
              class="btn btn-primary black-btn mt-2 blue-btn w-75"
              variant="outline-warning"
              block
              @click="closeLoc"
              >{{ $t("saveChanges") }}</b-button
            >
          </b-col>
        </b-row>
      </b-modal>
    </b-tab>
  </b-tabs>
</template>
<script>
import service from "@/service";
import Treeselect from "@riophae/vue-treeselect";
import singlePage from "./singlePage";
export default {
  props: [
    "dqrConfig",
    "orgList",
    "dataElementList",
    "categoryOptionID",
    "methodCatId",
    "bgDataConfig",
    "flatLocList",
  ],
  components: { Treeselect, singlePage },
  data() {
    return {
      finalCount: {},
      defaultTypeIndex: -1,
      defaultType: "",
      locIndex: -1,
      EMULocation: "",
      startP: false,
      locEmus: [],
      errLoc: [],
      selectedNode: [],
      deName: "",
      deNameInc: "",
      deNameEx: "",
      fpWomenPopulation: [
        { value: "MWRA", text: "Married Women (MWRA)" },
        { value: "WRA", text: "All Women (WRA)" },
      ],
    };
  },
  methods: {
    updateDataOnContraceptive() {
      let arr = [
        "Visits",
        "Commodities_Client",
        "Commodities_Facilities",
        "User",
      ];
      this.dqrConfig.emu.Background_Data.defaultDataType = [];

      arr.map((item) => {
        if (
          this.dqrConfig.emu[item]["dataOnContraceptive"] === "Yes" &&
          !this.dqrConfig.emu.Background_Data.defaultDataType?.find(
            (compare) => compare === item
          )
        ) {
          this.dqrConfig.emu.Background_Data.defaultDataType.push(item);
        } else if (
          this.dqrConfig.emu[item]["dataOnContraceptive"] === "No" &&
          this.dqrConfig.emu.Background_Data.defaultDataType?.find(
            (compare) => compare === item
          )
        ) {
          this.dqrConfig.emu.Background_Data.defaultDataType.filter(
            (remove) => remove === item
          );
        }
      });
    },
    sendStart(val) {
      console.log("calling sendstart", val);
      this.startP = val;
    },
    getLocs(val, errorText = "", dataType) {
      console.log("calling getLocs", val, errorText, dataType);
      if (val) {
        this.startP = false;
        let actEmuArr = this.locEmus;
        let isObj = actEmuArr.find((d) => d === val);
        if (isObj) {
          let foundIndex = actEmuArr.findIndex((d) => d === val);
          actEmuArr[foundIndex] = val;
        } else {
          actEmuArr.push(val);
        }
        this.locEmus = actEmuArr;
        // if (errorText !== "") {
        let errArr = this.errLoc ? this.errLoc : {};
        let nameFound = this.flatLocList.filter(
          (obj) => obj.id === val.split("/")[1]
        );
        let name =
          nameFound && nameFound.length > 0 ? nameFound[0]["name"] : val;
        if (errArr && !errArr[name + "__" + dataType])
          errArr[name + "__" + dataType] = {};
        errArr[name + "__" + dataType] = {
          message: errorText !== "" ? errorText : "Success! ",
          dataType: dataType,
        };

        this.errLoc = errArr;

        // }
        if (this.locIndex < this.dqrConfig.emu.Background_Data.locArr.length) {
          let ind = this.locIndex * 1 + 1;
          //console.log("previous locindex while emiting", locIndex, ind);
          this.locIndex = ind;
          // //console.log(locIndexRef);
        }
      }
      // else {
      //     // setStatusText('SUCCESS');
      //     //setStatusText('');
      //     setStart(false);
      //     setDisable(false)
      // }
    },
    startAutoEMU() {
      if (
        this.dqrConfig.emu.Background_Data.locArr &&
        this.dqrConfig.emu.Background_Data.locArr.length > 0
      ) {
        this.$store.commit("setLoading", true);

        let dtIndex = this.defaultTypeIndex * 1 + 1;
        this.defaultTypeIndex = dtIndex;
      } else {
        this.sweetAlert({
          title: "Locations are not saved for EMU generation",
        });
      }
    },
    hideModal() {
      this.$refs["location-modal"].hide();
    },
    getLevel(mainObj, id) {
      mainObj.map((root) => {
        if (root.id === id) {
          this.level = root.level;
        } else if (root.children) {
          this.getLevel(root.children, id);
        }
      });
      // return level;
    },
    closeLoc() {
      if (this.selectedNode && this.selectedNode.length) {
        let arr = [];
        this.selectedNode.forEach((id) => {
          this.level = null;
          this.getLevel(this.computedLocList, id);
          console.log("level", this.level);
          if (this.level) arr.push(this.level + "/" + id);
        });
        this.dqrConfig.emu.Background_Data.locArr = arr;
        // this.stockOutLoc = arr;
        this.saveJson();
      }
      this.$refs["location-modal"].hide();
    },
    openLoc() {
      // this.selectedNode = [];
      // let idArr = dqrConfig.emu.Background_Data.locArr
      //   ? dqrConfig.emu.Background_Data.locArr
      //   : [];
      //setSelectedNode1(selectedNodes)
      this.$refs["location-modal"].show();
    },
    saveJson() {
      let key = this.generateKey("dqrModule");
      this.$emit("saveJson", this.dqrConfig, key);
    },
  },
  watch: {
    defaultTypeIndex(newVal) {
      console.log(
        "defaultTypeIndex watch called",
        newVal,
        this.dqrConfig.emu.Background_Data.defaultDataType.length
      );
      if (
        newVal > -1 &&
        this.dqrConfig.emu.Background_Data.defaultDataType &&
        newVal < this.dqrConfig.emu.Background_Data.defaultDataType.length
      ) {
        let defTpe = this.dqrConfig.emu.Background_Data.defaultDataType[newVal];
        // console.log(defTpe, "data type");
        this.defaultType = defTpe;
        let ind = this.locIndex * 1 + 1;
        this.locIndex = ind;
      } else if (
        newVal !== -1 &&
        newVal >= this.dqrConfig.emu.Background_Data.defaultDataType.length
      ) {
        //this.saveFinalEMU();
        this.$store.commit("setLoading", false);
        let locNames = "",
          errLoc = this.errLoc;
        if (errLoc && Object.keys(errLoc).length > 0) {
          // Object.keys(errLoc).join(" ,");
          let names =
            "<table class='logTable w-100'><tr ><th>Location</th><th>Message</th><th>Data Type</th></tr>";
          Object.keys(errLoc).forEach((lc) => {
            names +=
              "<tr><td>" +
              lc.split("__")[0] +
              "</td><td>" +
              errLoc[lc]["message"] +
              "</td><td>" +
              errLoc[lc]["dataType"] +
              "</td></tr>";
          });
          locNames += "<div class='textCenter'>" + names + "</table></div>";
        }
        console.log(locNames);
        this.startP = false;
        this.sweetAlert({
          title: "Annual and Monthly EMU process successfully. ",
          html: locNames,
        });
        this.defaultTypeIndex = -1;
        this.errLoc = [];
      }
    },
    createCompEMUmCPR() {
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
        this.filter
      );
      // let oResponse =  dataM.getEMUOPCompChart(this.outputData, this.filter);
      //oResponse.title = this.bAllWomen ? "Comparing EMUs and mCPR (AWRA)" : 'Comparing EMUs and mCPR (MWRA)';
      oResponse.source = this.category;
      oResponse.xTitle =
        this.data["Output"]["derivedCharts"][0]["chartOptions"]["xAxis"][
          "text"
        ];
      oResponse.yTitle =
        this.data["Output"]["derivedCharts"][0]["chartOptions"]["yAxis"][
          "text"
        ];
      oResponse.type = "line";
      oResponse.title =
        this.data["Output"]["derivedCharts"][0]["chartOptions"]["chartName"];
      oResponse.disable =
        this.data["Output"]["derivedCharts"][0]["chartOptions"]["disableChart"];
      oResponse.chartInfo =
        this.data["Output"]["derivedCharts"][0]["chartOptions"]["chartInfo"];
      oResponse.cid =
        this.data["Output"]["derivedCharts"][0]["chartOptions"]["cid"];
      //oResponse.data = [...oResponse.data,...aPMC,...aMICS];
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
      return oResponse;
    },
    locIndex(newIndex) {
      console.log("Calling locIndex watch");
      if (
        newIndex > -1 &&
        this.dqrConfig.emu.Background_Data.locArr &&
        newIndex < this.dqrConfig.emu.Background_Data.locArr.length
      ) {
        console.log("start time", this.$moment().format("LT"));
        this.EMULocation = "";
        let loc = this.dqrConfig.emu.Background_Data.locArr[newIndex];
        console.log(loc, "location");
        this.startP = true;
        this.EMULocation = loc;
        this.finalCount[this.EMULocation] = this.defaultTypeIndex + 1;

        //console.log("in useeffect");
      } else if (
        this.dqrConfig.emu.Background_Data.locArr &&
        newIndex >= this.dqrConfig.emu.Background_Data.locArr.length
      ) {
        console.log("finished time", this.$moment().format("LT"));

        this.locIndex = -1;
        let dtIndex = this.defaultTypeIndex * 1 + 1;
        this.defaultTypeIndex = dtIndex;
        this.finalCount[this.EMULocation] = dtIndex + 1;
      }
    },
  },
  computed: {
    computedLocList() {
      console.log(this.orgList);
      return this.orgList;
    },
    defaultDataTypeOptions() {
      let arr = [
        {
          value: "Visits",
          text: "Visits",
          disabled: true,
        },
        {
          value: "Commodities_Client",
          text: "Commodities Clients",
          disabled: true,
        },
        {
          value: "Commodities_Facilities",
          text: "Commodities Facilities",
          disabled: true,
        },
        {
          value: "User",
          text: "User",
          disabled: true,
        },
      ];
      return arr;
    },
    getDataElementNames() {
      this.dqrConfig.emu.Background_Data.defaultDataType.forEach((dtType) => {
        this.dqrConfig.emu[dtType]["incCondomEMU"] =
          this.dqrConfig.emu[dtType]["incCondomEMU"] &&
          this.dqrConfig.emu[dtType]["incCondomEMU"] !== ""
            ? this.dqrConfig.emu[dtType]["incCondomEMU"]
            : "EMU: " +
              (dtType === "Commodities_Client"
                ? "Commodities Client"
                : dtType === "Commodities_Facilities"
                ? "Commodities Facilities"
                : dtType) +
              " - Inc. Condom";

        this.dqrConfig.emu[dtType]["excCondomEMU"] =
          this.dqrConfig.emu[dtType]["excCondomEMU"] &&
          this.dqrConfig.emu[dtType]["excCondomEMU"] !== ""
            ? this.dqrConfig.emu[dtType]["excCondomEMU"]
            : "EMU: " +
              (dtType === "Commodities_Client"
                ? "Commodities Client"
                : dtType === "Commodities_Facilities"
                ? "Commodities Facilities"
                : dtType) +
              " - Exc. Condom";
        this.dqrConfig.emu[dtType]["monthlyEMU"] =
          this.dqrConfig.emu[dtType]["monthlyEMU"] &&
          this.dqrConfig.emu[dtType]["monthlyEMU"] !== ""
            ? this.dqrConfig.emu[dtType]["monthlyEMU"]
            : "Monthly EMU : " +
              (dtType === "Commodities_Client"
                ? "Commodities Client"
                : dtType === "Commodities_Facilities"
                ? "Commodities Facilities"
                : dtType);
      });
    },
  },
  created() {
    this.updateDataOnContraceptive();
    console.log(this.dqrConfig.emu.Background_Data.locArr, "locArr in created");
    // if (this.dqrConfig.emu.Background_Data.locArr) {
    this.selectedNode = this.dqrConfig.emu.Background_Data.locArr.map((obj) => {
      if (obj.split("/").length > 0) return obj.split("/")[1];
      // else return obj;
    });
    this.dqrConfig.emu.Background_Data.defaultDataType.forEach(
      (dtType, index) => {
        this.dqrConfig.emu[dtType]["incCondomEMU"] =
          this.dqrConfig.emu[dtType]["incCondomEMU"] &&
          this.dqrConfig.emu[dtType]["incCondomEMU"] !== ""
            ? this.dqrConfig.emu[dtType]["incCondomEMU"]
            : "EMU: " +
              (dtType === "Commodities_Client"
                ? "Commodities Client"
                : dtType === "Commodities_Facilities"
                ? "Commodities Facilities"
                : dtType) +
              " - Inc. Condom";

        this.dqrConfig.emu[dtType]["excCondomEMU"] =
          this.dqrConfig.emu[dtType]["excCondomEMU"] &&
          this.dqrConfig.emu[dtType]["excCondomEMU"] !== ""
            ? this.dqrConfig.emu[dtType]["excCondomEMU"]
            : "EMU: " +
              (dtType === "Commodities_Client"
                ? "Commodities Client"
                : dtType === "Commodities_Facilities"
                ? "Commodities Facilities"
                : dtType) +
              " - Exc. Condom";
        this.dqrConfig.emu[dtType]["monthlyEMU"] =
          this.dqrConfig.emu[dtType]["monthlyEMU"] &&
          this.dqrConfig.emu[dtType]["monthlyEMU"] !== ""
            ? this.dqrConfig.emu[dtType]["monthlyEMU"]
            : "Monthly EMU : " +
              (dtType === "Commodities_Client"
                ? "Commodities Client"
                : dtType === "Commodities_Facilities"
                ? "Commodities Facilities"
                : dtType);
      }
    );

    // let tp =
    //   this.dqrConfig.emu.Background_Data.defaultEMU === "Commodities_Client"
    //     ? "Commodities Client"
    //     : this.dqrConfig.emu.Background_Data.defaultEMU ===
    //       "Commodities_Facilities"
    //     ? "Commodities Facilities"
    //     : this.dqrConfig.emu.Background_Data.defaultEMU;

    // this.deNameInc = "EMU: " + tp + " - Inc. Condom";
    // this.deNameEx = "EMU: " + tp + " - Exc. Condom";
    // let tp1 =
    //   this.dqrConfig.emu_monthly.Background_Data.autoSaveEMU ===
    //   "Commodities_Client"
    //     ? "Commodities Client"
    //     : this.dqrConfig.emu_monthly.Background_Data.autoSaveEMU ===
    //       "Commodities_Facilities"
    //     ? "Commodities Facilities"
    //     : this.dqrConfig.emu_monthly.Background_Data.autoSaveEMU;
    // this.deName = "Monthly EMU : " + tp1;
    // }
  },
};
</script>
