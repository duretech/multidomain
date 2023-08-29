<template>
  <div
    class="modal-dialog modal-dialog-scrollable modal-xl bg-data"
    role="document"
  >
    <div class="modal-content">
      <div
        class="modal-header"
        style="
          background-color: rgb(33, 33, 33);
          color: rgb(255, 255, 255);
          padding: 12px;
        "
      >
        <h5
          class="modal-title"
          id="exampleModalScrollableTitle"
          style="font-size: 1rem"
        >
          {{ $t("backgroundData") }}
        </h5>
        <button
          type="button"
          class="close"
          data-dismiss="modal"
          aria-label="Close"
        >
          <span aria-hidden="true" class="color-white">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <download-csv :data="items">
          <a
            class="btn black-btn pointer-events-none color-white float-right blue-btn"
          >
            <span class="">
              <img
                :src="require('@/assets/images/icons/generateReport.svg')"
                class="img-fluid mt-xl-n1"
              />
            </span>
            <span class="mx-1"> {{ $t("exportbtn") }} </span>
          </a>
        </download-csv>

        <b-table :items="items" :fields="fields" responsive="sm" show-empty :empty-text="$t('no_data_to_display')">
          <!-- <template v-slot:thead-top="data">
                        <b-tr>
                        <b-th colspan="1"></b-th>
                        <b-th class="text-center" v-for="(val, i) in keys" :key="i">
                          <span v-if="i != 0">{{val[Object.keys(val)[0]]}}</span>
                        </b-th>
                        </b-tr>
                    </template> -->
        </b-table>

        <cardComponent
          v-if="methodMixPieChart"
          :chartdata="methodMixPieChart"
          :bShowIcons="true"
        />

        <download-csv :data="bgItems">
          <a
            class="btn black-btn pointer-events-none color-white float-right m-t-40px blue-btn"
          >
            <span class="">
              <img
                :src="require('@/assets/images/icons/generateReport.svg')"
                class="img-fluid mt-xl-n1"
              />
            </span>
            <span class="mx-1"> {{ $t("exportbtn") }} </span>
          </a>
        </download-csv>

        <b-table striped hover :items="bgItems" show-empty :empty-text="$t('no_data_to_display')"></b-table>
      </div>
    </div>
  </div>
</template>
<script>
import cardComponent from "./cardComponent";
import NepaliDate from "nepali-date-converter";

export default {
  props: [
    "bgData",
    "methodMixData",
    "selectedLevel",
    "dqrResponse",
    "appResponse",
    "userDetails",
  ],
  data() {
    return {
      items: [],
      bgItems: [],
      fpItems: [],
      fields: [],
      methodMixPieChart: null,
      methodMixTable: null,
      keys: [],
    };
  },
  components: {
    cardComponent,
  },
  watch: {
    selectedLevel(newVal) {
      this.items = [];
      this.bgItems = [];
      this.getBackgroundData();
      this.getMethodMixData();
    },
  },
  methods: {
    getBackgroundData() {
      let self = this;
      let locale = this.$i18n.locale,
        key = `applicationModule_${locale}`,
        key1 = `dqrModule_${locale}`;
      if (!this.$store.getters.getAppSettings.country) {
        let appId = this.$store.getters.getAppId
            ? this.$store.getters.getAppId
            : "",
          appUserId = this.$store.getters.getAppUserId
            ? this.$store.getters.getAppUserId
            : "";
        if (appId && appUserId) {
          key = `${appUserId}_${appId}_applicationModule_${locale}`;
          key1 = `${appUserId}_${appId}_dqrModule_${locale}`;
        } else {
          this.showLocalStorageError();
          return;
        }
      }
      this.categoryData = this.dqrResponse.emu;
      let fromDataStore = this.dqrResponse.emu["Background_Data"][
        "bgDataSource"
      ]
        ? this.dqrResponse.emu["Background_Data"]["bgDataSource"]
        : false;
      let womenPop = this.categoryData["Background_Data"]["FPWomenPopulation"];
      this.fields = [{ key: "year", label: this.$i18n.t("year") }];
      let periodData = this.$store.getters.getGlobalFactors().period.Period;
      let d = new Date();
      if (this.$store.getters.getAppSettings.calendar === "nepali") {
        d = new NepaliDate(
          new Date(d.getFullYear(), d.getMonth() + 1, d.getDate())
        ).getBS();
        let nplMonth = d.month;
        let nplYear = d.year;
        let zeroForMonth = nplMonth < 10 ? "0" + nplMonth : nplMonth;
        d = d.year + "" + zeroForMonth;
      }
      let lastYear = "";
      let recentYearMonth = this.$moment(d, "YYYYMM")
        .subtract(periodData.backtrackedMonth * 1, "months")
        .format("YYYY-MM");
      if (recentYearMonth.split("-")[1] == 12)
        lastYear = recentYearMonth.split("-")[0];
      else lastYear = recentYearMonth.split("-")[0] * 1 - 1;

      let startYear = this.$moment(recentYearMonth, "YYYY-MM")
        .subtract(periodData.backtrackedYearLimit * 1, "years")
        .format("YYYY");
      let years = [];
      let indId = [];
      for (let year = startYear; year <= lastYear; year++) {
        years.push(Number(year));
      }
      let bgData = this.bgData;
      let tablearr = [
        "dhs",
        "fpet",
        "mics",
        "pms",
        "unpd",
        "pma",
        "population",
      ];
      if (fromDataStore == "Datastore") {
        this.categoryData["Background_Data"]["backgroundIndicators"].forEach(
          (res, i) => {
            if (res["name"] != "Method Mix") {
              res["subIndicators"].forEach((sub) => {
                if (sub["selectedDatastoreDE"][0]) {
                  indId.push(sub["selectedDatastoreDE"][0].id);
                  this.fields.push({
                    key: sub["static_name"].toLowerCase(),
                    label: sub["static_name"],
                  });
                }
              });
            }
          }
        );
      } else {
        this.categoryData["Background_Data"]["backgroundIndicators"].forEach(
          (res, i) => {
            if (res["name"] != "Method Mix") {
              res["subIndicators"].forEach((sub) => {
                if (sub["selectedDE"][0]) {
                  indId.push(sub["selectedDE"][0].id);
                  this.fields.push({
                    key: sub["static_name"].toLowerCase(),
                    label: sub["static_name"],
                  });
                }
              });
            }
          }
        );
      }

      for (let yearind in years) {
        let obj = {};
        let year = years[yearind];
        obj["year"] = year;
        Object.keys(bgData).forEach((ind) => {
          let indData = bgData[ind];
          ind = ind.toLowerCase();
          if (tablearr.includes(ind)) {
            if (indData != undefined && indData[year] != undefined) {
              let val =
                indData[year] != 0 && indData[year] ? indData[year] : "";
              obj[ind] = ind == "population" ? val : val ? val + "%" : "";
            } else {
              obj[ind] = null;
            }
          }
        });
        this.items.push(obj);
      }
    },
    getMethodMixData() {
      let oResponse = {
        data: [
          {
            name: this.$i18n.t("method"),
            colorByPoint: true,
            data: this.methodMixData,
          },
        ],
        //title : "Comparing Method Mix [ Service Statistics & Survey " + this.bgData.recentYear + "]",
        title: this.$i18n.t("bgChart") + this.bgData.recentYear + "]",
        source: "",
        xTitle: "",
        yTitle: "",
        type: "pie",
        dataLable: true,
        labels: {},
      };
      this.methodMixPieChart = oResponse;
      oResponse.data[0].data.forEach((res) => {
        if (res.name != undefined) {
          this.bgItems.push({
            [this.$i18n.t("method")]: res.name,
            [this.$i18n.t("percentage")]: res.y + "%",
          });
        }
      });
    },
  },
  mounted() {},
  created() {
    this.getBackgroundData();
    this.getMethodMixData();
  },
};
</script>
