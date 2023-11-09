<template>
  <div class="p-4" style="min-height: 18rem">
    <h4>{{ $t("viewAnnMon") }}</h4>
    <div class="flexBox">
      <div class="w-100">{{ $t("Select the Data Type") }}</div>
      <b-form-select
        v-model="selectedDataType"
        :options="optionsDataType"
        value-field="item"
        text-field="name"
        disabled-field="notEnabled"
      ></b-form-select>
    </div>
    <div class="flexBox">
      <div class="w-100">{{ $t("selectEMU") }}</div>
      <b-form-select
        v-model="selectedEMUType"
        :options="optionsEMUType"
        value-field="item"
        text-field="name"
        disabled-field="notEnabled"
      ></b-form-select>
    </div>
    <div class="flexBox">
      <div class="w-100">{{ $t("selectLocation") }}</div>
      <treeselect
        style="width: 105%; color: 'black'"
        :options="orgLists"
        :show-count="true"
        :placeholder="$t('search')"
        v-model="location"
        :multiple="true"
        :flat="true"
        :default-expand-level="1"
        :max-height="150"
      />
    </div>
    <div class="text-right my-3">
      <button @click="printTable" class="btn btn-primary">
        {{ $t("viewEmu") }}
      </button>
    </div>
    <div>
      <b-row id="table-complete">
        <b-col cols="5"></b-col>
        <b-col cols="7" class="d-flex justify-content-end align-items-center">
          <b-input-group v-if="items.length" class="my-3 w-35">
            <b-input-group class="">
              <b-form-input
                id="filter-input"
                v-model="filter"
                type="search"
                :placeholder="$t('search')"
              ></b-form-input>
            </b-input-group>
          </b-input-group>
          <span class="mx-2">
            <download-csv
              class="btn color-white cursor-pointer p-0"
              :data="items"
              v-if="items.length"
            >
              <i class="fa fa-solid fa-download"></i>
            </download-csv>
          </span>
        </b-col>
      </b-row>
      <b-table
        class="py-3"
        id="emu-table"
        :per-page="perPage"
        :current-page="currentPage"
        striped
        hover
        :fields="fields"
        :items="rows"
        :filter="filter"
        :sort-by="sortBy"
        :sort-desc.sync="sortDesc"
        v-if="items.length"
        :sort-compare="onSortChanged"
      ></b-table>
      <b-pagination
        class="justify-content-center"
        v-if="items.length"
        v-model="currentPage"
        :total-rows="rows.length"
        :per-page="perPage"
        aria-controls="emu-table"
      ></b-pagination>
    </div>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import service from "@/service";
import ScrollPageMixin from "@/helpers/ScrollPageMixin";
// import {getLocationName} from "@/components/Common/commonFunctions.js"
import dataM from "./DataMassaging.js";
import { getOrg } from "@/components/Common/commonFunctions";

export default {
  props: [
    "type",
    "dqrConfig",
    "orgList",
    "indicatorList",
    "matrixList",
    "dataElementList",
    "dataSetList",
    "sectorRepo",
  ],
  mixins: [ScrollPageMixin],
  watch: {
    items(newValue) {
      if (newValue) {
        this.scrollPage("table-complete");
      }
    },
  },
  components: {
    Treeselect,
  },
  data() {
    return {
      sortBy: this.$i18n.t("period"),
      sortDesc: false,
      selectedDataType: "Visits",
      selectedEMUType: "EMU Monthly",
      orgLists: JSON.parse(JSON.stringify(this.orgList)),
      location: [],
      optionsDataType: [
        { item: "Visits", name: this.$i18n.t("visits") },
        {
          item: "Commodities_Client",
          name: this.$i18n.t("Commodities_Client"),
        },
        {
          item: "Commodities_Facilities",
          name: this.$i18n.t("Commodities_Facilities"),
        },
        { item: "User", name: this.$i18n.t("users") },
      ],
      optionsEMUType: [
        { item: "EMU Monthly", name: this.$i18n.t("emu_monthly") },
        { item: "EMU Annual", name: this.$i18n.t("emu_annual") },
      ],
      fields: [
        { key: this.$i18n.t("location"), sortable: true },
        { key: this.$i18n.t("period"), sortable: true },
        { key: this.$i18n.t("EMU"), sortable: true },
      ],
      items: [],
      filter: "",
      currentPage: 1,
      perPage: 10,
      locationName: "",
    };
  },
  computed: {
    rows() {
      const query = this.filter.toLowerCase();
      return this.items.filter((item) => {
        return (
          item[this.$i18n.t("location")].toLowerCase().includes(query) ||
          item[this.$i18n.t("period")]
            .toString()
            .toLowerCase()
            .includes(query) ||
          item[this.$i18n.t("EMU")].toString().includes(query)
        );
      });
    },
  },
  methods: {
    async printTable() {
      let locs = this.location.join(";");
      let tp =
        this.selectedDataType === "Commodities_Client"
          ? "Commodities Client"
          : this.selectedDataType === "Commodities_Facilities"
          ? "Commodities Facilities"
          : this.selectedDataType;

      let isExistDEAr, sYear, periodData;
      this.$store.commit("setLoading", true);

      if (
        Object.keys(this.$store.getters.getGlobalFactors("fp_dashboard"))
          .length == 0
      ) {
        let key = this.generateKey("globalFactors");
        await service
          .getSavedConfig({ tableKey: key, namespace: "fp-dashboard" })
          .then((resp) => {
            periodData = resp.data.period.Period;
          })
          .catch(()=>{
            this.$store.commit("setLoading", false);
          })
      } else {
        periodData = this.$store.getters.getGlobalFactors("fp-dashboard", false)
          .period.Period;
      }
      let d = new Date();
      let endYearM = this.$moment(d, "YYYYMM")
        .subtract(periodData.backtrackedMonth * 1, "months")
        .format("YYYYMM");
      let startYearM = this.$moment(endYearM, "YYYYMM")
        .subtract(periodData.backtrackedYearLimit * 1, "years")
        .format("YYYYMM");
      let startDate = this.$moment(startYearM);
      let endDate = this.$moment(endYearM).add(1, "month");
      if (this.selectedEMUType == "EMU Monthly") {
        let monthsArr = [];
        while (startDate.isBefore(endDate)) {
          monthsArr.push(startDate.format("YYYYMM"));
          startDate.add(1, "month");
        }

        sYear = monthsArr.join(";");
        let deName = "Monthly EMU : " + tp;

        isExistDEAr = this.dataElementList.filter((obj) => {
          return obj["displayName"] === deName;
        });
      } else if (this.selectedEMUType == "EMU Annual") {
        sYear = this.getYearFormated(
          this.dqrConfig.emu[this.selectedDataType]["initialYear"],
          this.dqrConfig.emu[this.selectedDataType]["finalYear"]
        );
        let deNameAnnual = this.dqrConfig["emu"][this.selectedDataType][
          "incCondomEMU"
        ]
          ? this.dqrConfig["emu"][this.selectedDataType]["incCondomEMU"]
          : "Annual EMU: " + tp;
        isExistDEAr = this.dataElementList.filter((obj) => {
          return obj["displayName"] === deNameAnnual;
        });
      }

      if (isExistDEAr.length && sYear) {
        let actDEID = isExistDEAr[0]["id"];
        let locName = [];
        if (locs) {
          locs.split(";").map((item) => {
            locName.push({
              [`${item}`]: getOrg({
                locationList: this.orgList,
                location: item,
              }),
            });
          });
          await service
            .getAnalyticalIndicatorData(actDEID, locs, sYear)
            .then((response) => {
              if (response.data.rows.length > 0) {
                this.itemsInTable([response.data], locName);
              } else {
                this.items = [];
                this.$swal.fire({
                  title: this.$i18n.t("MappingNotExists"),
                  icon: "info",
                });
              }
            })
            .catch(()=>{
            this.$store.commit("setLoading", false);
          });
          
        } else {
          this.items = [];
          this.$swal.fire({
            title: this.$i18n.t("locationNotSelected"),
            icon: "error",
          });
        }
      } else {
        this.items = [];
        this.$swal.fire({
          title: this.$i18n.t("MappingNotExists"),
          icon: "info",
        });
      }
      this.$store.commit("setLoading", false);
    },
    getYearFormated(p_start, p_end) {
      let sCurYear = p_end * 1,
        nStartYear = p_start * 1,
        aYear = [nStartYear];
      while (nStartYear < sCurYear) {
        aYear.push(++nStartYear);
      }
      return aYear.join(";");
    },
    itemsInTable(mainObj, locName) {
      this.items = [];
      if (locName.length > 0) {
        mainObj[0].rows.forEach((item) => {
          this.items.push({
            [this.$i18n.t("location")]: locName.find(
              (i) => Object.keys(i) == item[2]
            )[item[2]],
            [this.$i18n.t("period")]:
              this.selectedEMUType === "EMU Monthly"
                ? mainObj[0].metaData.items[item[1]].name
                : item[1],
            [this.$i18n.t("EMU")]: item[3],
          });
        });
      }
    },
    onSortChanged(aDate, bDate, key) {
      if (key !== this.$i18n.t("period")) {
        return false;
      } else {
        let a = this.parseMonthYearString(aDate[this.$i18n.t("period")]).split(
          "/"
        );
        let b = this.parseMonthYearString(bDate[this.$i18n.t("period")]).split(
          "/"
        );

        if (a.length > 1 && b.length > 1) {
          a = parseInt(a[1], 10) * 10000 + parseInt(a[0], 10) * 100;
          b = parseInt(b[1], 10) * 10000 + parseInt(b[0], 10) * 100;
          return a - b;
        } else {
          a = parseInt(a[0], 10) * 10000;
          b = parseInt(b[0], 10) * 10000;
          return a - b;
        }
      }
    },
    parseMonthYearString(monthYearString) {
      let parts = monthYearString.split(" ");
      let monthIndex = 0;
      if (parts.length > 1) {
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        monthIndex = Number(monthNames.indexOf(parts[0])) + 1;
        return `${monthIndex}/${parts[1]}`;
      }
      return monthYearString;
    },
  },
};
</script>
<style scoped>
.flexBox {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}
</style>
