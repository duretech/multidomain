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
            <b-col cols="12" class="footer-col pt-1 d-none">
              <div class="mr-2 d-flex flex-column">
                <b-button
                  v-if="$store.state.financialYear.includes('April')"
                  class="views-btn-footer mx-2 fs-17-1920"
                  :class="{ 'onclick-btn-footer': pType === 'financialYear' }"
                  @click="changeview('financialYear')"
                  v-b-tooltip.hover
                  :title="$t('financialYear')"
                  ><div v-if="pType === 'financialYear'">
                    {{ $t("financialYear") }}
                  </div>
                  <div v-else>{{ $t("FY_Apr") }}</div></b-button
                >
                <b-button
                  v-if="$store.state.financialYear.includes('July')"
                  class="views-btn-footer mx-2 fs-17-1920"
                  :class="{
                    'onclick-btn-footer': pType === 'financialYearJuly',
                  }"
                  @click="changeview('financialYearJuly')"
                  v-b-tooltip.hover
                  :title="$t('financialYearJuly')"
                  ><div v-if="pType === 'financialYearJuly'">
                    {{ $t("financialYearJuly") }}
                  </div>
                  <div v-else>{{ $t("FY_Jul") }}</div></b-button
                >
                <b-button
                  class="views-btn-footer mx-2 fs-17-1920"
                  :class="{ 'onclick-btn-footer': pType === 'yearly' }"
                  @click="changeview('yearly')"
                  v-b-tooltip.hover
                  :title="$t('Yearly_view')"
                  ><div v-if="pType === 'yearly'">
                    {{ $t("Yearly_view") }}
                  </div>
                  <div v-else>{{ $t("Y") }}</div></b-button
                >
                <b-button
                  class="views-btn-footer mx-2 fs-17-1920"
                  :class="{ 'onclick-btn-footer': pType === 'quarterly' }"
                  @click="changeview('quarterly')"
                  v-b-tooltip.hover
                  :title="$t('Quaterly_view')"
                  ><div v-if="pType === 'quarterly'">
                    {{ $t("Quaterly_view") }}
                  </div>
                  <div v-else>{{ $t("Q") }}</div></b-button
                >
                <b-button
                  class="views-btn-footer mx-2 fs-17-1920"
                  :class="{ 'onclick-btn-footer': pType === 'monthly' }"
                  @click="changeview('monthly')"
                  v-b-tooltip.hover
                  :title="$t('Monthly_view')"
                  ><div v-if="pType === 'monthly'">
                    {{ $t("Monthly_view") }}
                  </div>
                  <div v-else>{{ $t("M") }}</div></b-button
                >
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
          <div class="mr-2 d-none">
            <b-button
              v-if="$store.state.financialYear.includes('April')"
              class="views-btn-footer mx-2 fs-17-1920"
              :class="{ 'onclick-btn-footer': pType === 'financialYear' }"
              @click="changeview('financialYear')"
              v-b-tooltip.hover
              :title="$t('financialYear')"
              ><div v-if="pType === 'financialYear'">
                {{ $t("financialYear") }}
              </div>
              <div v-else>{{ $t("FY_Apr") }}</div></b-button
            >
            <b-button
              v-if="$store.state.financialYear.includes('July')"
              class="views-btn-footer mx-2 fs-17-1920"
              :class="{ 'onclick-btn-footer': pType === 'financialYearJuly' }"
              @click="changeview('financialYearJuly')"
              v-b-tooltip.hover
              :title="$t('financialYearJuly')"
              ><div v-if="pType === 'financialYearJuly'">
                {{ $t("financialYearJuly") }}
              </div>
              <div v-else>{{ $t("FY_Jul") }}</div></b-button
            >
            <b-button
              class="views-btn-footer mx-2 fs-17-1920"
              :class="{ 'onclick-btn-footer': pType === 'yearly' }"
              @click="changeview('yearly')"
              v-b-tooltip.hover
              :title="$t('Yearly_view')"
              ><div v-if="pType === 'yearly'">
                {{ $t("Yearly_view") }}
              </div>
              <div v-else>{{ $t("Y") }}</div></b-button
            >
            <b-button
              class="views-btn-footer mx-2 fs-17-1920"
              :class="{ 'onclick-btn-footer': pType === 'quarterly' }"
              @click="changeview('quarterly')"
              v-b-tooltip.hover
              :title="$t('Quaterly_view')"
              ><div v-if="pType === 'quarterly'">
                {{ $t("Quaterly_view") }}
              </div>
              <div v-else>{{ $t("Q") }}</div></b-button
            >
            <b-button
              class="views-btn-footer mx-2 fs-17-1920"
              :class="{ 'onclick-btn-footer': pType === 'monthly' }"
              @click="changeview('monthly')"
              v-b-tooltip.hover
              :title="$t('Monthly_view')"
              ><div v-if="pType === 'monthly'">
                {{ $t("Monthly_view") }}
              </div>
              <div v-else>{{ $t("M") }}</div></b-button
            >
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
              class="pr-3 fs-15-1920"
              id="checkbox-trends"
              name="checkbox-trends"
              :value="true"
              v-model="trendCharts"
            >
              {{ $t("trend") }}
            </b-form-checkbox>
            <b-form-checkbox
              class="pr-3 fs-15-1920"
              id="checkbox-seasonal"
              name="checkbox-seasonal"
              :value="true"
              v-model="seasonalCharts"
            >
              {{ $t("seasonalTrend") }}
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
          style="
            height: 38px;
            margin-top: 21px;
            border: none;
          "
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
import {
  excludeName,
  getLocationName,
} from "@/components/Common/commonFunctions";
export default {
  props: [
    "showTrend",
    "showRegional",
    "showSeasonal",
    "globalPeriodData",
    "IDLocationPeriod",
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
      viewType: this.$store.state.defaultViewType,
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
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
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
    pTypeOptions() {
      let pType = [
        { id: "monthly", label: this.$i18n.t("monthly") },
        { id: "quarterly", label: this.$i18n.t("quarterly") },
        { id: "yearly", label: this.$i18n.t("yearly") },
      ];
      if (this.$store.state.financialYear.includes("July")) {
        pType.push({
          id: "financialYearJuly",
          label: this.$i18n.t("financialYearJuly"),
        });
      }
      if (this.$store.state.financialYear.includes("April")) {
        pType.push({
          id: "financialYear",
          label: this.$i18n.t("financialYear"),
        });
      }
      return pType;
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
    "$store.state.defaultViewType": function (val) {
      this.viewType = val;
    },
    pType(newVal) {
      this.periodOptions = [];
      let period = this.globalPeriodData;
      let d = new Date();
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
        this.monthYear =
          this.IDLocationPeriod && this.IDLocationPeriod.period
            ? this.IDLocationPeriod.period
            : currentYear;
      }

      if (newVal === "financialYear" || newVal === "financialYearJuly") {
        let yearsText =
          newVal === "financialYear"
            ? this.financialYearsText
            : this.financialYearsjulyText;

        for (let i = currentYear - 1; i >= finalYear; i--) {
          this.periodOptions.push({
            text: `${yearsText[1]} ${i} - ${yearsText[0]} ${i + 1}`,
            value: newVal === "financialYear" ? `${i}` : `${i}July`,
          });
        }
        this.monthYear =
          this.IDLocationPeriod && this.IDLocationPeriod.period
            ? this.IDLocationPeriod.period
            : newVal === "financialYear"
            ? `${currentYear - 1}`
            : `${currentYear - 1}July`;
        this.periodText = `${yearsText[1]} ${currentYear - 1} - ${
          yearsText[0]
        } ${currentYear}`;
      }

      if (newVal === "quarterly") {
        let currYear = new Date().getFullYear(),
          currentMonth = new Date().getMonth() + 1;
        let currentQuarter = Math.ceil(currentMonth / 3);
        let quarterLimit =
          currentYear * 1 === currYear * 1 ? currentQuarter : 4;
        for (let i = currentYear; i >= finalYear; i--) {
          let quarterLimit = i * 1 === currYear * 1 ? currentQuarter : 4;
          for (let j = quarterLimit; j >= 1; j--) {
            this.periodOptions.push({
              value: `${i}Q${j}`,
              text:
                this.quartersText[`Q${j}`][0] +
                " - " +
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
          " - " +
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
  },
  methods: {
    sendDetails() {
      let canSend = true;
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
    },
    resetMap() {
      this.getConfigAccess();
    },
    disableDate(date) {
      let format = this.pType == "yearly" ? "YYYY" : "YYYYMM";
      let dStart = this.$moment(this.allowedStartDate, format).format(format);
      let dEnd = this.$moment(this.allowedFinalDate, format).format(format);
      let d1 = this.$moment(date, format).format(format);
      return d1 < dEnd || d1 > dStart;
    },
    setPeriodText(newValue) {
      if (this.pType === "quarterly") {
        let q = newValue.split("Q");
        this.periodText =
          this.quartersText[`Q${q[1]}`][0] +
          " - " +
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
            : this.financialYearsjulyText;
        let p =
          this.pType === "financialYear" ? newValue : newValue.split("July")[0];
        this.periodText = `${yearsText[1]} ${p} - ${yearsText[0]} ${p * 1 + 1}`;
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
  },
  created() {
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
      this.financialYearsjulyText = ["juin", "juil."];
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
