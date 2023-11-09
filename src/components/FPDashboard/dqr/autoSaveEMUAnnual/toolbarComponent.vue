<template>
  <div
    class="container-fluid bottom-tabbar"
    :class="{ active: showToolbarOnTablet }"
  >
    <div class="bottom-tabbar-close" @click="closeToolbar">
      <i class="far fa-times-circle"></i>
    </div>
    <div class="bottom_toolbar_wrap">
      <form class="input-select-items">
        <div class="form-group pr-3" v-if="recentActiveTab != 'emu'">
          <label class="text-center">{{ $t("location") }}</label>
          <treeselect
            class="form-control"
            :options="options"
            :show-count="true"
            :placeholder="$t('search')"
            v-model="value"
            :flat="false"
            :default-expand-level="defaultExpandLevel"
            :load-options="loadOptions"
          />
        </div>

        <div
          class="form-group pr-3"
          v-if="recentActiveTab == 'output' || recentActiveTab == 'emu'"
        >
          <label class="text-capitalize text-center">{{ $t("year") }}</label>
          <select
            class="form-control tabbarselect"
            v-model="emuYear"
            v-b-tooltip.hover
          >
            <option v-for="year in emuYears" :key="year.val" :value="year.val">
              {{ year.label }}
            </option>
          </select>
        </div>
      </form>
    </div>
    <b-modal
      v-model="generateEMUPopup"
      hide-footer
      centered
      size="sm"
      :title="$t('location')"
      no-close-on-backdrop
    >
      <div class="row">
        <div class="col-12">
          <treeselect
            name="Locations"
            :multiple="true"
            :options="options"
            :limit="3"
            :flat="true"
            :load-options="loadOptions"
            v-model="selectedEMULocation"
            sort-value-by="INDEX"
            :placeholder="$t('select')"
          />
        </div>
        <div class="col-12 mt-4">
          <div class="text-right">
            <b-button
              small
              @click.prevent.stop="generateEMU"
              class=""
              :disabled="selectedEMULocation.length === 0"
            >
              <span class="small">{{ $t("ok") }}</span>
            </b-button>
          </div>
        </div>
      </div>
    </b-modal>
    <b-modal
      v-model="viewEMUPopup"
      hide-footer
      centered
      size="xl"
      :title="EMU"
      :ok-title="$t('ok')"
      no-close-on-backdrop
    >
      <div class="row">
        <!-- <div class="col-4"> -->
        <!-- <div v-if="scorecardLocation" class="mr-4 small">
              <strong>{{$t('location')}}: </strong><strong>{{scorecardLocation}}</strong>
            </div>
            <div v-if="scorecardPeriod" class="mr-4 small">
              <strong>{{$t('period')}}: </strong><strong>{{scorecardPeriod}}</strong>
            </div> -->
        <!-- </div> -->
        <!-- <div class="col-4">

          </div> -->
        <div class="col-3">
          <div class="text-right small pb-3">
            <input
              type="text"
              class="form-control"
              id="inputScorecardSearch"
              :placeholder="$t('search')"
              v-model="emuSearch"
            />
          </div>
        </div>
        <div class="col-9">
          <div class="d-flex justify-content-end pb-3 text-right">
            <div class="small w-50 mx-3">
              <treeselect
                name="Locations"
                :multiple="true"
                :options="options"
                :limit="3"
                :flat="true"
                :load-options="loadOptions"
                v-model="selectedEMULocation"
                sort-value-by="INDEX"
                :placeholder="$t('select')"
              />
            </div>
            <b-button
              small
              @click.prevent.stop="generateEMU"
              class="position-relative blue-btn h-50"
              :disabled="selectedEMULocation.length === 0"
            >
              <span class="small">Regenerate EMU</span>
            </b-button>
          </div>
        </div>

        <div class="col-12 table-annual">
          <b-table
            head-variant="light"
            responsive
            sticky-header
            bordered
            hover
            :items="emuDataFiltered"
            :fields="emuFields"
            show-empty
            :empty-text="$t('no_data_to_display')"
          >
            <!-- <template v-slot:cell(show_details)="row">
                <b-form-checkbox v-model="row.detailsShowing" @change="row.toggleDetails">
                </b-form-checkbox>
              </template> -->
            <template>
              <b-card>
                <b-table
                  head-variant="light"
                  responsive
                  hover
                  bordered
                  :items="emuItems"
                  show-empty
                  :empty-text="$t('no_data_to_display')"
                ></b-table>
              </b-card>
            </template>
            <!-- <template #table-caption>
                <span v-if="scorecardLocation" class="mr-4 small">
                  <strong>{{$t('location')}}:: </strong><strong>{{scorecardLocation}}</strong>
                </span>
                <span v-if="scorecardPeriod" class="mr-4 small">
                  <strong>{{$t('period')}}:: </strong><strong>{{scorecardPeriod}}</strong>
                </span>
              </template> -->
          </b-table>
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script>
import service from "@/service";
import Treeselect from "@riophae/vue-treeselect";
// import the styles
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import loadLocChildMixin from "@/helpers/LoadLocationChildMixin";
export default {
  props: [
    // "emuYears",
    "locationValue",
    "showToolbarOnTablet",
    "recentActiveTab",
    "dqrResponse",
    "autoSaveSource",
    "getActiveTab",
    "generateFlag",
  ],
  components: {
    Treeselect,
  },
  data() {
    return {
      showAutoButton: false,
      EMU: "EMU",
      emuTableData: "",
      emuSearch: "",
      viewEMUPopup: false,
      generateEMUPopup: false,
      emuFields: [],
      emuItems: [],
      selectedEMULocation: [],
      multiple: false,
      clearable: true,
      searchable: false,
      disabled: false,
      openOnClick: true,
      openOnFocus: false,
      clearOnSelect: true,
      closeOnSelect: false,
      alwaysOpen: true,
      appendToBody: false,
      defaultExpandLevel: 1,
      options: [],
      value: null,
      firstTime: false,
      selected: "",
      emuYear: null,
    };
  },
  mixins: [loadLocChildMixin],
  watch: {
    getActiveTab(tab) {
      if (tab) this.showTable();
    },
    generateFlag(newVal) {
      console.log("generateFlag", newVal);
      if (newVal) {
        // this.generateEMUTable();
        this.selectedEMULocation = [];
        this.showAutoButton = false;
        this.generateEMUPopup = false;
      }
    },
    recentActiveTab(vale) {
      //console.log(vale)
    },

    emuYear(newValue) {
      console.log("emuYear watch", newValue);
      if (newValue) {
        this.$emit("emuYear", newValue);

        // this.$nextTick(() => {
        // });
      }
    },
    // locationValue(newValue) {
    //   if (newValue) {
    //     this.value = newValue;
    //   }
    // },
    // value(newValue) {
    //   if (!this.firstTime) {
    //     console.log("location", newValue);
    //     this.$emit("location", newValue);
    //   } else {
    //     this.firstTime = false;
    //   }
    // },
  },
  methods: {
    showTable() {
      if (this.emuTableData && this.emuTableData[this.getActiveTab]) {
        let innerdata = this.emuTableData[this.getActiveTab];
        Object.keys(innerdata).forEach((locId) => {
          let item = {
            [this.$i18n.t("location")]: innerdata[locId]["name"],
            "EMU Generated on": innerdata[locId]["time"]
              ? innerdata[locId]["time"]
              : "Some error occured",
          };
          this.emuItems.push(item);
        });
      }
    },

    generateEmuButtonClick() {
      this.generateEMUPopup = true;
    },
    viewEMU() {
      this.viewEMUPopup = true;
    },
    generateEMU() {
      this.$emit("emuLocations", this.selectedEMULocation);
    },
    closeToolbar() {
      this.$emit("closeToolbar");
    },
    getConfigAccess() {
      this.options = JSON.parse(
        JSON.stringify(this.$store.getters.getLocationList)
      );
      this.value = this.options[0].id;
      this.$emit("defLevel", this.value.split("/")[0]);
      // this.emuYear = this.dqrResponse.emu["Background_Data"]["SSDataRecentYear"];
      //Global Period Seeting in emu annual
      let periodData = this.$store.getters.getGlobalFactors().period.Period;
      let d = new Date();
      if (this.$store.getters.getAppSettings.calendar === "nepali") {
        const { adToBs } = require("@sbmdkl/nepali-date-converter");
        const bsDate = adToBs(
          `${d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()}`
        );
        d = bsDate.split("-")[0] + bsDate.split("-")[1];
      }
      let recentYearMonth = this.$moment(d, "YYYYMM")
        .subtract(periodData.backtrackedMonth * 1, "months")
        .format("YYYY-MM");
      if (recentYearMonth.split("-")[1] == 12)
        this.emuYear = recentYearMonth.split("-")[0];
      else this.emuYear = recentYearMonth.split("-")[0] * 1 - 1;
    },
  },
  computed: {
    emuDataFiltered: function () {
      let filterdData = this.emuItems.filter((s) =>
        s[this.$i18n.t("location")].toLowerCase().includes(this.emuSearch)
      );
      return filterdData;
    },
    emuYears() {
      let aKeys = [],
        nStart,
        nEnd;
      //Global Period Seeting in emu annual
      let periodData = this.$store.getters.getGlobalFactors().period.Period;
      let d = new Date();
      if (this.$store.getters.getAppSettings.calendar === "nepali") {
        const { adToBs } = require("@sbmdkl/nepali-date-converter");
        const bsDate = adToBs(
          `${d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()}`
        );
        d = bsDate.split("-")[0] + bsDate.split("-")[1];
      }
      let recentYearMonth = this.$moment(d, "YYYYMM")
        .subtract(periodData.backtrackedMonth * 1, "months")
        .format("YYYY-MM");
      if (recentYearMonth.split("-")[1] == 12)
        nEnd = recentYearMonth.split("-")[0];
      else nEnd = recentYearMonth.split("-")[0] * 1 - 1;
      nStart = this.$moment(recentYearMonth, "YYYY-MM")
        .subtract(periodData.backtrackedYearLimit * 1, "years")
        .format("YYYY");
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
  },
  mounted() {
    this.getConfigAccess();
    // this.generateEMUTable();
  },
};
</script>
<style lang="scss" scoped>
.form-control:disabled {
  opacity: 0.8 !important;
}
.indicatortext {
  display: flex;
}
</style>
