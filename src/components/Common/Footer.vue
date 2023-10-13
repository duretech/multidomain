<template>
  <div class="footer-body">
    <div class="footer-tab">
      <div
        class="floating-footer d-flex justify-content-center align-items-center"
        v-b-toggle.sidebar-backdrop
      >
        <i class="fa fa-filter fa-2x" aria-hidden="true"></i>
      </div>

      <b-sidebar id="sidebar-backdrop" backdrop shadow>
        <b-row class="footer-tab-items pt-3 mt-5 ml-2">
          <b-col cols="12" class="footer-col pt-1">
            <div class="loc-col mr-3">
              <p class="loc-title fs-15-1920">{{ $t("location") }}</p>
              <treeselect
                :options="options"
                :show-count="true"
                :load-options="loadOptions"
                :placeholder="$t('search')"
                v-model="value"
                :flat="false"
                :default-expand-level="defaultExpandLevel"
                @open="
                  openM1 = false;
                  openY1 = false;
                "
              />
            </div>
          </b-col>
          <b-col cols="12" class="footer-col pt-1">
            <div
              class="view-col mr-4 ml-2 text-center d-none"
              :class="{ invisible: $route.name !== 'SummaryDashboard' }"
            >
              <p class="view-title fs-15-1920">{{ $t("View") }}</p>
              <div class="grid-wide">
                <b-button
                  class="grid-btn ml-2"
                  :class="{ active: viewType === 'grid' }"
                  @click="gridView"
                >
                  <img
                    v-if="viewType == 'grid'"
                    :src="require('@/assets/images/icons/gridactive.png')"
                    class="grid-img pr-2"
                  />
                  <img
                    v-else
                    :src="require('@/assets/images/icons/grid.png')"
                    class="grid-img pr-2"
                  />
                  <p class="grid-txt fs-17-1920">
                    {{ $t("grid") }}
                  </p>
                </b-button>
                <b-button
                  class="wide-btn"
                  :class="{ active: viewType === 'wide' }"
                  @click="wideView"
                >
                  <img
                    v-if="viewType == 'wide'"
                    :src="require('@/assets/images/icons/wideactive.png')"
                    class="wide-img pr-2"
                  />
                  <img
                    v-else
                    :src="require('@/assets/images/icons/wide.png')"
                    class="wide-img pr-2"
                  />
                  <p class="wide-txt fs-17-1920">{{ $t("wide") }}</p>
                </b-button>
              </div>
            </div>
          </b-col>
          <template v-if="!hidePeriodFilter">
            <b-col cols="12" class="footer-col pt-1">
              <div>
                <div class="loc-col mr-1">
                  <p class="loc-title fs-15-1920">{{ $t("periodType") }}</p>
                  <treeselect
                    :options="pTypeOptions"
                    :show-count="true"
                    :load-options="loadOptions"
                    :placeholder="$t('search')"
                    v-model="pType"
                    :flat="false"
                    :default-expand-level="defaultExpandLevel"
                    @open="
                      openM1 = false;
                      openY1 = false;
                    "
                  />
                </div>
              </div>
            </b-col>
            <b-col cols="12" class="footer-col pt-1">
              <div>
                <div class="loc-col mr-1">
                  <p class="loc-title fs-15-1920">{{ $t("period") }}</p>
                  <date-picker
                    v-model="monthYear"
                    type="month"
                    value-type="format"
                    format="YYYY-MM"
                    class="form-control"
                    :lang="lang"
                    :open.sync="openM1"
                    v-if="pType === 'monthly'"
                    :disabled-date="disableDate"
                  ></date-picker>
                  <date-picker
                    v-model="monthYear"
                    type="year"
                    value-type="format"
                    format="YYYY"
                    class="form-control"
                    :lang="lang"
                    :open.sync="openY1"
                    v-else-if="pType === 'yearly'"
                    :disabled-date="disableDate"
                  ></date-picker>
                  <b-dropdown
                    id="dropdown-dropup"
                    ref="dropdown"
                    dropup
                    :text="periodText"
                    class="form-control p-0"
                    variant="link"
                    toggle-class="color-black"
                    menu-class="timeFrequenncyDropdown"
                    v-else
                  >
                    <b-dropdown-form>
                      <b-form-group>
                        <b-form-radio-group
                          v-model="monthYear"
                          :options="periodOptions"
                          name="period"
                          stacked
                        ></b-form-radio-group>
                      </b-form-group>
                    </b-dropdown-form>
                  </b-dropdown>
                </div>
              </div>
            </b-col>
          </template>
          <b-col cols="12" class="footer-col pt-1">
            <div
              class="key-indicators"
              v-if="$route.name === 'SummaryDashboard'"
            >
              <p class="view-title fs-15-1920">
                {{ $t("view_key_indicators_variations") }}
              </p>
              <div class="tr-checkboxes px-4 fs-15-1920">
                <b-form-checkbox
                  class="pr-3 fs-15-1920"
                  id="checkbox-trends"
                  name="checkbox-trends"
                  :value="true"
                  v-model="trendCharts"
                >
                  {{ $t("trend") }}
                </b-form-checkbox>
                <b-form-checkbox
                  class="fs-15-1920"
                  id="checkbox-regional"
                  name="checkbox-regional"
                  :value="true"
                  v-model="regionalCharts"
                >
                  {{ $t("regional") }}
                </b-form-checkbox>
              </div>
            </div>
          </b-col>
        </b-row>
      </b-sidebar>
    </div>
    <b-row class="footer-row">
      <b-col cols="12" class="footer-col pt-1">
        <div class="loc-col mr-3">
          <p class="loc-title fs-15-1920">{{ $t("location") }}</p>
          <treeselect
            :options="options"
            :show-count="true"
            :load-options="loadOptions"
            :placeholder="$t('search')"
            v-model="value"
            :flat="false"
            :default-expand-level="defaultExpandLevel"
            @open="
              openM = false;
              openY = false;
            "
          />
        </div>
        <div
          class="view-col mr-4 ml-2 text-center d-none"
          :class="{ invisible: $route.name !== 'SummaryDashboard' }"
        >
          <p class="view-title fs-15-1920">{{ $t("View") }}</p>
          <div class="grid-wide">
            <b-button
              class="grid-btn ml-2"
              :class="{ active: viewType === 'grid' }"
              @click="gridView"
            >
              <img
                v-if="viewType == 'grid'"
                :src="require('@/assets/images/icons/gridactive.png')"
                class="grid-img pr-2"
              />
              <img
                v-else
                :src="require('@/assets/images/icons/grid.png')"
                class="grid-img pr-2"
              />
              <p class="grid-txt fs-17-1920">
                {{ $t("grid") }}
              </p>
            </b-button>
            <b-button
              class="wide-btn"
              :class="{ active: viewType === 'wide' }"
              @click="wideView"
            >
              <img
                v-if="viewType == 'wide'"
                :src="require('@/assets/images/icons/wideactive.png')"
                class="wide-img pr-2"
              />
              <img
                v-else
                :src="require('@/assets/images/icons/wide.png')"
                class="wide-img pr-2"
              />
              <p class="wide-txt fs-17-1920">{{ $t("wide") }}</p>
            </b-button>
          </div>
        </div>
        <template v-if="!hidePeriodFilter">
          <div>
            <div class="loc-col mr-3">
              <p class="loc-title fs-15-1920">{{ $t("periodType") }}</p>
              <treeselect
                :options="pTypeOptions"
                :show-count="true"
                :load-options="loadOptions"
                :placeholder="$t('search')"
                v-model="pType"
                :flat="false"
                :default-expand-level="defaultExpandLevel"
                @open="
                  openM = false;
                  openY = false;
                "
              />
            </div>
          </div>
          <div>
            <div class="loc-col mr-3">
              <p class="loc-title fs-15-1920">{{ $t("period") }}</p>
              <date-picker
                v-model="monthYear"
                type="month"
                value-type="format"
                format="YYYY-MM"
                class="form-control"
                :lang="lang"
                :open.sync="openM"
                v-if="pType === 'monthly'"
                :disabled-date="disableDate"
              ></date-picker>
              <date-picker
                v-model="monthYear"
                type="year"
                value-type="format"
                format="YYYY"
                class="form-control"
                :lang="lang"
                :open.sync="openY"
                v-else-if="pType === 'yearly'"
                :disabled-date="disableDate"
              ></date-picker>
              <b-dropdown
                id="dropdown-dropup"
                ref="dropdown"
                dropup
                :text="periodText"
                class="form-control p-0"
                variant="link"
                toggle-class="color-black"
                menu-class="timeFrequenncyDropdown"
                v-else
              >
                <b-dropdown-form>
                  <b-form-group>
                    <b-form-radio-group
                      v-model="monthYear"
                      :options="periodOptions"
                      name="period"
                      stacked
                    ></b-form-radio-group>
                  </b-form-group>
                </b-dropdown-form>
              </b-dropdown>
            </div>
          </div>
        </template>
        <div
          class="key-indicators mr-3"
          v-if="$route.name === 'SummaryDashboard'"
        >
          <p class="view-title fs-15-1920">
            {{ $t("view_key_indicators_variations") }}
          </p>
          <div class="tr-checkboxes px-4 fs-15-1920">
            <b-form-checkbox
              v-if="showCheckboxes['emitTrend'] == true"
              class="pr-3 fs-15-1920"
              id="checkbox-trends"
              name="checkbox-trends"
              :value="true"
              v-model="trendCharts"
            >
              {{ $t("trend") }}
            </b-form-checkbox>
            <b-form-checkbox
              v-if="showCheckboxes['emitSeasonal'] == true"
              class="pr-3 fs-15-1920"
              id="checkbox-seasonal"
              name="checkbox-seasonal"
              :value="true"
              v-model="seasonalCharts"
            >
              {{ $t("seasonalTrend") }}
            </b-form-checkbox>
            <b-form-checkbox
              v-if="showCheckboxes['emitRegional'] == true"
              class="fs-15-1920"
              id="checkbox-regional"
              name="checkbox-regional"
              :value="true"
              v-model="regionalCharts"
            >
              {{ $t("regional") }}
            </b-form-checkbox>
          </div>
        </div>
        <div
          class="loc-col mr-3"
          v-if="
            $route.name === 'AnalyticalDashboard' &&
            ['emuMonthlyTab'].includes($store.getters.getActiveTab)
          "
        >
          <p class="loc-title fs-15-1920">{{ $t("methods") }}</p>
          <treeselect
            :options="mOptions"
            :show-count="true"
            :load-options="loadOptions"
            :placeholder="$t('search')"
            v-model="mType"
            :flat="false"
            :default-expand-level="defaultExpandLevel"
          />
        </div>
        <b-button
          class="applyBtn blue-btn btn btn-sm fs-15-1920"
          style="height: 38px; margin-top: 21px; border: none"
          @click.prevent.stop="sendDetails"
          v-if="value && monthYear"
          :disabled="!value || !monthYear"
          >{{ $t("apply") }}</b-button
        >
      </b-col>
    </b-row>
  </div>
</template>
<script>
import service from "@/service";
import "vue2-datepicker/index.css";
import DatePicker from "vue2-datepicker";
import Treeselect from "@riophae/vue-treeselect";
import NavigationMixin from "@/helpers/NavigationMixin";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import loadLocChildMixin from "@/helpers/LoadLocationChildMixin";
import merge from "lodash/merge";
import {
  pTypeList,
  excludeName,
  getLocationName,
} from "@/components/Common/commonFunctions";
import NepaliDate from "nepali-date-converter";
export default {
  props: [
    "showTrend",
    "showRegional",
    "showSeasonal",
    "globalPeriodData",
    "IDLocationPeriod",
    "updateLocPer",
    "showCheckboxes",
  ],
  components: { Treeselect, DatePicker },
  mixins: [NavigationMixin, DynamicImageMixin, loadLocChildMixin],
  data() {
    let period = this.globalPeriodData;
    let d = new Date();
    let currentDate = this.$moment(d, "YYYYMM")
      .subtract(period.backtrackedMonth * 1, "months")
      .format("YYYY-MM");
    let currentFinalDate = this.$moment(currentDate, "YYYYMM")
      .subtract(period.backtrackedYearLimit * 1, "years")
      .format("YYYY-MM");
    return {
      viewType: this.$store.getters.getViewType,
      defaultExpandLevel: 1,
      options: [],
      value: null,
      monthYear: currentDate,
      allowedStartDate: period ? currentDate : null,
      allowedFinalDate: period ? currentFinalDate : null,
      pType: "",
      periodOptions: [],
      periodText: "",
      // alwaysOpen:"true",
      openM: false,
      openM1: false,
      openY: false,
      openY1: false,
      lang: {
        formatLocale: {
          monthsShort: [
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
          ],
        },
      },
      financialYearsText: ["Mar", "Apr"],
      financialYearsJulyText: ["Jun", "Jul"],
      quartersText: {
        Q1: ["Jan", "Mar"],
        Q2: ["Apr", "Jun"],
        Q3: ["Jul", "Sep"],
        Q4: ["Oct", "Dec"],
      },
      trendCharts: false,
      regionalCharts: false,
      seasonalCharts: false,
      mType: "method",
      pTypeOptions: [],
    };
  },
  computed: {
    hidePeriodFilter() {
      let isHide = false;
      if (
        ["emuMonthlyTab", "emuAnnualTab"].includes(
          this.$store.getters.getActiveTab
        ) &&
        this.$route.name === "AnalyticalDashboard" &&
        this.$store.getters.getNamespace !== "multi_program_mnch-dashboard"
      ) {
        isHide = true;
      }
      return isHide;
    },
    mOptions() {
      let mType = [
        { id: "aggregate", label: this.$i18n.t("method_aggregate") },
        { id: "method", label: this.$i18n.t("method_detial") },
      ];
      return mType;
    },
  },
  watch: {
    showTrend(newValue) {
      this.trendCharts = newValue;
    },
    showRegional(newValue) {
      this.regionalCharts = newValue;
    },
    showSeasonal(newValue) {
      this.seasonalCharts = newValue;
    },
    "$store.getters.getViewType": function (val) {
      this.viewType = val;
    },
    pType(newVal) {
      this.periodOptions = [];
      let period = this.globalPeriodData;
      let d = new Date();
      let nplMonth;
      let nplYear;
      if (this.$store.getters.getAppSettings.calendar === "nepali") {
        d = new NepaliDate(
          new Date(d.getFullYear(), d.getMonth() + 1, d.getDate())
        ).getBS();
        nplMonth = d.month;
        nplYear = d.year;
        let zeroForMonth = nplMonth < 10 ? "0" + nplMonth : nplMonth;
        d = d.year + "" + zeroForMonth;
      }
      let currentDate = this.$moment(d, "YYYYMM")
        .subtract(period.backtrackedMonth * 1, "months")
        .format("YYYY-MM");
      let currentFinalDate = this.$moment(currentDate, "YYYYMM")
        .subtract(period.backtrackedYearLimit * 1, "years")
        .format("YYYY-MM");
      let currentYear = this.$moment(currentDate, "YYYY").format("YYYY");
      let finalYear = this.$moment(currentFinalDate, "YYYY").format("YYYY");

      if (newVal === "monthly") {
        this.monthYear =
          this.IDLocationPeriod && this.IDLocationPeriod.period
            ? this.IDLocationPeriod.period
            : currentDate;
        this.allowedStartDate = period ? currentDate : null;
        this.allowedFinalDate = period ? currentFinalDate : null;
      }

      if (newVal === "yearly") {
        let newYear;
        if (currentDate.split("-")[1] == 12)
          newYear = currentDate.split("-")[0];
        else newYear = currentDate.split("-")[0] * 1 - 1;
        this.monthYear =
          this.IDLocationPeriod && this.IDLocationPeriod.period
            ? this.IDLocationPeriod.period
            : newYear.toString();
      }

      if (newVal === "financialYear" || newVal === "financialYearJuly") {
        let yearsText =
          newVal === "financialYear"
            ? this.financialYearsText
            : this.financialYearsJulyText;
        for (let i = currentYear - 1; i >= finalYear; i--) {
          this.periodOptions.push({
            text: `${yearsText[1]} ${i} ${this.$i18n.t("toSmall")}  ${
              yearsText[0]
            } ${i + 1}`,
            value: newVal === "financialYear" ? `${i}` : `${i}July`,
          });
        }
        this.monthYear =
          this.IDLocationPeriod && this.IDLocationPeriod.period
            ? this.IDLocationPeriod.period
            : newVal === "financialYear"
            ? `${currentYear - 1}`
            : `${currentYear - 1}July`;
        this.periodText = `${yearsText[1]} ${currentYear - 1} ${this.$i18n.t(
          "toSmall"
        )} ${yearsText[0]} ${currentYear}`;
      }

      if (newVal === "quarterly") {
        let currYear, currentQuarter, currentMonth;

        if (this.$store.getters.getAppSettings.calendar === "nepali") {
          currentMonth = parseInt(nplMonth);
          currYear = nplYear;

          if (currentMonth > 1 && currentMonth <= 3) {
            currentQuarter = 3;
          } else if (currentMonth > 4 && currentMonth <= 6) {
            currentQuarter = 4;
          } else if (currentMonth > 7 && currentMonth <= 9) {
            currentQuarter = 1;
          } else if (currentMonth > 10 && currentMonth <= 12) {
            currentQuarter = 2;
          } else {
            currentQuarter = "Invalid quarter";
          }
        } else {
          (currYear = new Date(currentDate).getFullYear()),
            (currentMonth = new Date(currentDate).getMonth() + 1);
          currentQuarter = Math.ceil(currentMonth / 3);
        }
        let quarterLimit =
          currentYear * 1 === currYear * 1 ? currentQuarter : 4;
        console.log(currentYear, currYear, currentQuarter, "currentQuarter");
        for (let i = currentYear; i >= finalYear; i--) {
          let quarterLimit = i * 1 === currYear * 1 ? currentQuarter : 4;
          for (let j = quarterLimit; j >= 1; j--) {
            this.periodOptions.push({
              value: `${i}Q${j}`,
              text:
                this.quartersText[`Q${j}`][0] +
                " " +
                this.$i18n.t("toSmall") +
                " " +
                this.quartersText[`Q${j}`][1] +
                " " +
                i,
            });
          }
        }
        this.monthYear =
          this.IDLocationPeriod && this.IDLocationPeriod.period
            ? this.IDLocationPeriod.period
            : `${currentYear}Q${quarterLimit}`;
        this.periodText =
          this.quartersText[`Q${quarterLimit}`][0] +
          " " +
          this.$i18n.t("toSmall") +
          " " +
          this.quartersText[`Q${quarterLimit}`][1] +
          " " +
          currentYear;
      }
      // this.$emit('period', this.monthYear, this.value, this.options, newVal)
    },
    value(newValue) {
      if (newValue && this.monthYear && this.options && this.pType) {
        let obj = this.IDLocationPeriod
          ? this.IDLocationPeriod
          : {
              period: this.monthYear,
              location: newValue,
              locationList: this.options,
              periodType: this.pType,
            };
        const { locName } = getLocationName(obj);
        if (locName) {
          obj.locationName = excludeName(locName);
        }
        // this.$emit("getLocationPeriod", obj);
      }
    },
    monthYear(newValue) {
      if (newValue && this.value && this.options && this.pType) {
        let obj = this.IDLocationPeriod
          ? this.IDLocationPeriod
          : {
              period: newValue,
              location: this.value,
              locationList: this.options,
              periodType: this.pType,
            };
        const { locName } = getLocationName(obj);
        if (locName) {
          obj.locationName = excludeName(locName);
        }
        // this.$emit("getLocationPeriod", obj);
        if (
          this.pType === "quarterly" ||
          this.pType === "financialYear" ||
          this.pType === "financialYearJuly"
        ) {
          this.setPeriodText(newValue);
        }
      }
    },
    trendCharts(newValue) {
      this.$emit("getViewType", "trend", newValue);
    },
    regionalCharts(newValue) {
      this.$emit("getViewType", "regional", newValue);
    },
    seasonalCharts(newValue) {
      this.$emit("getViewType", "seasonal", newValue);
    },
    updateLocPer(newVal) {
      this.pType = newVal.pType;
      this.monthYear = newVal.monthYear;
      this.value = newVal.id;
      this.updateOptions(newVal);
      this.$nextTick(() => {
        this.sendDetails();
      });
    },
  },
  methods: {
    sendDetails() {
      let canSend = true;
      let periodName =
        this.$store.getters?.getPeriodData?.[this.monthYear] || this.monthYear;

      if (
        ["quarterly", "financialYear", "financialYearJuly"].includes(this.pType)
      ) {
        let isFound = this.periodOptions.find(
          (p) => p.value === this.monthYear
        );
        periodName = isFound.text;
      }
      if (["monthly"].includes(this.pType)) {
        periodName =
          this.$store.getters?.getPeriodData?.[
            this.monthYear.split("-").join("")
          ]?.name || this.monthYear;
      }

      if (this.IDLocationPeriod) {
        if (["monthly", "yearly"].includes(this.pType)) {
          let isDisable = this.disableDate(this.monthYear);
          if (isDisable) {
            canSend = false;
          }
        }
        if (
          ["quarterly", "financialYear", "financialYearJuly"].includes(
            this.pType
          )
        ) {
          let isFound = this.periodOptions.find(
            (p) => p.value === this.monthYear
          );
          if (!isFound) {
            canSend = false;
          }
        }
      }
      if (
        canSend &&
        this.value &&
        this.monthYear &&
        this.options &&
        this.pType
      ) {
        let obj = {
          periodText: periodName,
          period: this.monthYear,
          location: this.value,
          locationList: this.options,
          periodType: this.pType,
          mType: this.mType,
        };
        const { locName } = getLocationName(obj);
        if (locName) {
          obj.locationName = excludeName(locName);
        }
        this.$emit("getLocationPeriod", obj);
      } else {
        if (this.IDLocationPeriod) {
          this.$swal({
            title: `${this.$i18n.t("periodRange")} <br/> [${
              this.allowedFinalDate
            } ${this.$i18n.t("toSmall")} ${this.allowedStartDate}]`,
          }).then((result) => {
            if (result && this.$store.getters.getIsMultiProgram) {
              this.goTo({
                setNamespace: true,
                routeName: "integrated-dashboard",
              });
            }
          });
        }
      }
    },
    resetMap() {
      this.getConfigAccess();
    },
    disableDate(date) {
      let format = this.pType == "yearly" ? "YYYY" : "YYYYMM",
        dStart;
      if (this.pType == "yearly") {
        let yearMonth = this.$moment(this.allowedStartDate, "YYYY-MM").format(
          "YYYY-MM"
        );
        dStart =
          yearMonth.split("-")[1] == 12
            ? yearMonth.split("-")[0]
            : yearMonth.split("-")[0] * 1 - 1;
      } else
        dStart = this.$moment(this.allowedStartDate, format).format(format);
      let dEnd = this.$moment(this.allowedFinalDate, format).format(format);
      let d1 = this.$moment(date, format).format(format);
      return d1 < dEnd || d1 > dStart;
    },
    setPeriodText(newValue) {
      if (this.pType === "quarterly") {
        let q = newValue.split("Q");
        this.periodText =
          this.quartersText[`Q${q[1]}`][0] +
          " " +
          this.$i18n.t("toSmall") +
          " " +
          this.quartersText[`Q${q[1]}`][1] +
          " " +
          q[0];
      }
      if (
        this.pType === "financialYear" ||
        this.pType === "financialYearJuly"
      ) {
        let yearsText =
          this.pType === "financialYear"
            ? this.financialYearsText
            : this.financialYearsJulyText;
        let p =
          this.pType === "financialYear" ? newValue : newValue.split("July")[0];
        this.periodText = `${yearsText[1]} ${p} ${this.$i18n.t("toSmall")} ${
          yearsText[0]
        } ${p * 1 + 1}`;
      }

      if (this.$refs.dropdown) {
        this.$refs.dropdown.hide();
      }
    },
    gridView() {
      this.viewType = "grid";
      this.$store.commit("setViewType", this.viewType);
    },
    wideView() {
      this.viewType = "wide";
      this.$store.commit("setViewType", this.viewType);
    },
    changeview(value) {
      this.pType = value;
    },
    getConfigAccess() {
      let { locationID, levelID } = service.getAllowedLocation();
      this.options = JSON.parse(
        JSON.stringify(this.$store.getters.getLocationList)
      );
      this.value =
        this.IDLocationPeriod && this.IDLocationPeriod.location
          ? this.IDLocationPeriod.location
          : levelID + "/" + locationID;
    },
    updateOptions(obj, updatedPath = this.options[0]) {
      if (updatedPath.id.split("/")[1] == obj.children[0].parent.id) {
        let findData = null;
        if (updatedPath?.children) {
          findData = updatedPath.children.find(
            (item) => item.id == obj.children[0].id
          );
        } else {
          updatedPath.children = [];
        }
        if (!findData) {
          updatedPath.children.push(obj);
        }
        return true;
      } else {
        if (updatedPath.children) {
          for (let i = 0; i < updatedPath.children.length; i++) {
            let result = this.updateOptions(obj, updatedPath.children[i]);
            if (result) {
              break;
            }
          }
        } else {
          return;
        }
      }
    },
  },
  created() {
    this.pTypeOptions = pTypeList({});
    if (this.$store.getters.getAppSettings.calendar === "nepali") {
      this.lang = {
        formatLocale: {
          monthsShort: [
            "Baisakh",
            "Jestha",
            "Ashad",
            "Shrawan",
            "Bhadra",
            "Ashoj",
            "Kartik",
            "Mangsir",
            "Poush",
            "Magh",
            "Falgun",
            "Chaitra",
          ],
          // janv.	févr.	mars	avril	mai	juin	juil.	août	sept.	oct.	nov.	déc.
          //https://web.library.yale.edu/cataloging/months get abbrevation from here for othe locales
        },
      };
      this.financialYearsText = ["Shrawan", "Ashad"];
      this.financialYearsjulyText = ["Shrawan", "Ashad"];
      this.quartersText = {
        Q1: ["Ashad", "Shrawan"],
        Q2: ["Bhadra", "Ashoj"],
        Q3: ["Kartik", "Mangsir"],
        Q4: ["Baisakh", "Jestha"],
      };
    }
    if (this.$i18n.locale === "fr") {
      this.lang = {
        formatLocale: {
          monthsShort: [
            "janv.",
            "févr.",
            "mars",
            "avril",
            "mai",
            "juin",
            "juil.",
            "août",
            "sept.",
            "oct.",
            "nov.",
            "déc.",
          ],
          // janv.	févr.	mars	avril	mai	juin	juil.	août	sept.	oct.	nov.	déc.
          //https://web.library.yale.edu/cataloging/months get abbrevation from here for othe locales
        },
      };
      this.financialYearsText = ["mars", "avril"];
      this.financialYearsJulyText = ["juin", "juil."];
      this.quartersText = {
        Q1: ["janv.", "mars"],
        Q2: ["avril", "juin"],
        Q3: ["juil.", "sept."],
        Q4: ["oct.", "déc."],
      };
    }
    this.pType =
      this.IDLocationPeriod && this.IDLocationPeriod.periodType
        ? this.IDLocationPeriod.periodType
        : "monthly";
    this.getConfigAccess();
    this.$nextTick(() => {
      this.sendDetails();
    });
  },
  mounted() {},
};
</script>
<style>
.invisible {
  display: none;
}
</style>
