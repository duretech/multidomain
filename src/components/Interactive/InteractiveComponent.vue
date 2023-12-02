<template>
  <section class="interactive-section">
    <div class="interactive-main">
      <b-card class="interactive-maincard">
        <div class="">
          <b-row>
            <b-col sm="12" lg="4" class="border-right">
              <div class="interactive-left position-relative">
                <div class="accordion" role="tablist">
                  <b-card no-body class="mb-1">
                    <b-card-header header-tag="header" class="p-1" role="tab">
                      <b-button block v-b-toggle.accordion-1 variant="info">{{
                        $t("chartType")
                      }}</b-button>
                    </b-card-header>
                    <b-collapse
                      id="accordion-1"
                      visible
                      accordion="my-accordion"
                      role="tabpanel"
                    >
                      <div class="p-2 pb-4">
                        <img
                          v-for="(type, index) in chartTypeOptions"
                          :key="type.value + index"
                          :src="
                            require(`@/assets/images/icons/${type.icon}Active.svg`)
                          "
                          :style="{
                            opacity:
                              chartType === type.value &&
                              isPercentageChart === type.percentageChart
                                ? 1
                                : 0.3,
                            filter: filterColor,
                          }"
                          v-b-tooltip.hover
                          :title="type.text"
                          class="chrtlogo-img px-4 py-3 cursor-pointer"
                          @click="changeType(type.value, type.percentageChart)"
                        />
                      </div>
                    </b-collapse>
                  </b-card>
                </div>
                <div class="border-bottom mt-3 mb-3"></div>
                <div class="accordion" role="tablist">
                  <b-card no-body class="mb-1">
                    <b-card-header header-tag="header" class="p-1" role="tab">
                      <b-button block v-b-toggle.accordion-2 variant="info">
                        {{ $t("data") }}</b-button
                      >
                    </b-card-header>
                    <b-collapse
                      id="accordion-2"
                      accordion="my-accordion"
                      role="tabpanel"
                      visible
                    >
                      <b-card-body>
                        <ConfigureOptions
                          :reusableKey="'key2'"
                          :allowedOptions="allowedOptions"
                          @getUpdatedOpt="getUpdatedOpt"
                        />
                        <DataComponent
                          key="'MainMapping'"
                          :reusableKey="'key1'"
                          @getDataSource="getDataSource"
                          :allowedOptions="allowedOptions"
                          @getDataSourceGroup="getDataSourceGroup"
                          @getSelectedData="getSelectedData"
                        />
                      </b-card-body>
                    </b-collapse>
                  </b-card>
                </div>
                <div class="border-bottom mt-3 mb-3"></div>
                <div class="accordion" role="tablist">
                  <b-card no-body class="mb-1">
                    <b-card-header header-tag="header" class="p-1" role="tab">
                      <b-button block v-b-toggle.accordion-3 variant="info">
                        {{ $t("period") }}</b-button
                      >
                    </b-card-header>
                    <b-collapse
                      id="accordion-3"
                      accordion="my-accordion"
                      role="tabpanel"
                    >
                      <b-card-body>
                        <b-dropdown
                          id="dropdown-1"
                          :text="periodTypeText"
                          class="period mt-2 mb-2 w-100 text-left fs-17-1920"
                        >
                          <b-dropdown-item-button
                            class="fs-17-1920"
                            v-for="(pType, index) in pTypeOptions"
                            :key="pType.value + index"
                            :value="pType.value"
                            @click="changePeriodType(pType)"
                            ><div class="fs-17-1920">
                              {{ pType.text }}
                            </div></b-dropdown-item-button
                          >
                        </b-dropdown>
                        <b-container>
                          <b-row class="mt-3 move-btn">
                            <b-col cols="6" class="text-center"
                              ><b-button
                                class="year-btn-left rounded-pill fs-17-1920"
                                @click="currentYear = currentYear - 1"
                                >{{ $t("prev_year") }}</b-button
                              ></b-col
                            >
                            <b-col cols="6" class="text-center"
                              ><b-button
                                class="year-btn-right rounded-pill fs-17-1920"
                                @click="currentYear = currentYear + 1"
                                >{{ $t("next_year") }}</b-button
                              ></b-col
                            >
                          </b-row>
                        </b-container>
                        <b-container fluid>
                          <b-row class="mt-3">
                            <b-col sm="6" class="pl-0">
                              <div class="small">{{ $t("available") }}</div>
                              <div class="left-year-data">
                                <ul
                                  class="year-list list-unstyled p-3 fs-17-1920"
                                >
                                  <li
                                    class="year-list-item pt-1 pb-1 fs-17-1920"
                                    v-on:click="
                                      movePeriod({ type: '+', period: item })
                                    "
                                    v-for="item in periodList"
                                    :key="item.text"
                                  >
                                    {{ item.text }}
                                    <span class="move-txt"
                                      >{{ $t("move") }}
                                      <i
                                        class="fa fa-angle-double-right"
                                        aria-hidden="true"
                                      ></i>
                                    </span>
                                  </li>
                                </ul>
                              </div>
                            </b-col>
                            <b-col sm="6" class="pr-0">
                              <div class="small">
                                {{ $t("selected") }}
                              </div>
                              <div class="right-year-data">
                                <ul class="year-list list-unstyled p-3">
                                  <li
                                    class="year-list-item pt-1 pb-1 fs-17-1920"
                                    v-on:click="
                                      movePeriod({ type: '-', period: item })
                                    "
                                    v-for="item in selectedPeriod"
                                    :key="item.text"
                                  >
                                    {{ item.text }}
                                    <span class="move-txt fs-17-1920"
                                      >{{ $t("move") }}
                                      <i
                                        class="fa fa-angle-double-left"
                                        aria-hidden="true"
                                      ></i>
                                    </span>
                                  </li>
                                </ul>
                              </div>
                            </b-col>
                          </b-row>
                          <b-row class="mt-3 move-btn">
                            <b-col cols="6" class="text-center"
                              ><b-button
                                class="move-btn-left rounded-pill fs-17-1920"
                                v-on:click="movePeriod({ type: '+' })"
                                >{{ $t("moveAll") }}</b-button
                              ></b-col
                            >
                            <b-col cols="6" class="text-center"
                              ><b-button
                                class="move-btn-right rounded-pill fs-17-1920"
                                v-on:click="movePeriod({ type: '-' })"
                                >{{ $t("moveAll") }}</b-button
                              ></b-col
                            >
                          </b-row>
                        </b-container>
                      </b-card-body>
                    </b-collapse>
                  </b-card>
                </div>
                <div class="border-bottom mt-3 mb-3"></div>
                <div class="accordion" role="tablist">
                  <b-card no-body class="mb-1">
                    <b-card-header header-tag="header" class="p-1" role="tab">
                      <b-button block v-b-toggle.accordion-4 variant="info">
                        {{ $t("orgUnits") }}</b-button
                      >
                    </b-card-header>
                    <b-collapse
                      id="accordion-4"
                      accordion="my-accordion"
                      role="tabpanel"
                    >
                      <b-card-body>
                        <div>
                          <treeselect
                            class="search-unit fs-17-1920"
                            :placeholder="$t('search')"
                            :multiple="true"
                            :show-count="true"
                            :default-expand-level="1"
                            :limit="3"
                            :flat="true"
                            :open-direction="'bottom'"
                            :load-options="loadOptionsWrapper"
                            v-model="selectedLocation"
                            :options="orgOptions"
                          />
                        </div>
                      </b-card-body>
                    </b-collapse>
                  </b-card>
                </div>
                <div class="border-bottom mt-3 mb-3"></div>
                <div
                  class="accordion"
                  role="tablist"
                  v-if="facilityListOriginal.length"
                >
                  <b-card no-body class="mb-1">
                    <b-card-header header-tag="header" class="p-1" role="tab">
                      <b-button block v-b-toggle.accordion-5 variant="info">
                        {{ $t("facilityType") }}
                      </b-button>
                    </b-card-header>
                    <b-collapse
                      id="accordion-5"
                      accordion="my-accordion"
                      role="tabpanel"
                    >
                      <b-card-body>
                        <div>
                          <b-container fluid>
                            <b-row>
                              <b-col sm="6" class="pl-0">
                                <div class="small">{{ $t("available") }}</div>
                                <div class="left-data p-3">
                                  <ul
                                    class="med-list list-unstyled"
                                    ref="data_left"
                                  >
                                    <li
                                      class="med-list-item pt-1 pb-1 fs-17-1920"
                                      v-on:click="
                                        moveFacility({
                                          type: '+',
                                          facility: item,
                                        })
                                      "
                                      v-for="item in facilityList"
                                      :key="item.id"
                                    >
                                      {{ item.name }}
                                      <span class="move-txt fs-17-1920"
                                        >{{ $t("move") }}
                                        <i
                                          class="fa fa-angle-double-right fs-17-1920"
                                          aria-hidden="true"
                                        ></i>
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                              </b-col>
                              <b-col sm="6" class="pr-0">
                                <div class="small">
                                  {{ $t("selected") }}
                                </div>
                                <div class="right-data p-3">
                                  <ul
                                    class="med-list list-unstyled fs-17-1920"
                                    ref="data_right"
                                  >
                                    <li
                                      class="med-list-item pt-1 pb-1 fs-17-1920"
                                      v-on:click="
                                        moveFacility({
                                          type: '-',
                                          facility: item,
                                        })
                                      "
                                      v-for="item in selectedFacility"
                                      :key="item.id"
                                    >
                                      {{ item.name }}
                                      <span class="move-txt fs-17-1920"
                                        >{{ $t("move") }}
                                        <i
                                          class="fa fa-angle-double-left"
                                          aria-hidden="true"
                                        ></i>
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                              </b-col>
                            </b-row>
                            <b-row class="mt-3 move-btn">
                              <b-col cols="6" class="text-center move-btn"
                                ><b-button
                                  class="move-btn-left rounded-pill fs-17-1920"
                                  v-on:click="moveFacility({ type: '+' })"
                                  >{{ $t("moveAll") }}</b-button
                                ></b-col
                              >
                              <b-col cols="6" class="text-center"
                                ><b-button
                                  class="move-btn-right rounded-pill fs-17-1920"
                                  v-on:click="moveFacility({ type: '-' })"
                                  >{{ $t("moveAll") }}</b-button
                                ></b-col
                              >
                            </b-row>
                          </b-container>
                        </div>
                      </b-card-body>
                    </b-collapse>
                  </b-card>
                </div>
              </div>
              <div class="text-right mt-5 updateButton position-absolute">
                <b-button
                  class="blue-btn border-0 px-4 fs-17-1920"
                  v-on:click="generateChart"
                  >{{ $t("update") }}</b-button
                >
              </div>
            </b-col>

            <b-col sm="12" lg="8">
              <b-card class="chart-footer bg-transparent layout-info">
                <b-row class="">
                  <b-col
                    class="layout d-flex justify-content-between align-items-center pl-4 fs-17-1920"
                    sm="2"
                    >{{ $t("layout") }}:</b-col
                  >
                  <b-col sm="10">
                    <b-row>
                      <b-col
                        class="series"
                        sm="6"
                        :class="{
                          'border-danger': seriesLayout.length === 0,
                          'col-sm-12': chartType === 'pie',
                        }"
                      >
                        <div
                          class="p-2 d-flex"
                          id="series"
                          @drop.stop.prevent="drop('seriesLayout')"
                          @dragover.prevent
                        >
                          <div class="series-title mb-n2 pt-2 mt-n2 fs-17-1920">
                            {{ $t("series") }}
                          </div>
                          <b-badge
                            class="layout-item rounded-pill p-1 pl-2 pr-2 ml-3 fs-16-1920"
                            draggable="true"
                            :id="series.id"
                            @dragstart="drag(series.id, 'seriesLayout')"
                            v-for="(series, i) in seriesLayout"
                            :key="i"
                          >
                            {{ series.text }}</b-badge
                          >
                        </div>
                      </b-col>
                      <b-col
                        class="category"
                        sm="6"
                        :class="{
                          'border-danger': categoryLayout.length === 0,
                          'd-none': chartType === 'pie',
                        }"
                        ><div
                          class="p-2 d-flex"
                          id="category fs-17-1920"
                          @drop.stop.prevent="drop('categoryLayout')"
                          @dragover.prevent
                        >
                          <div
                            class="category-title mb-n2 pt-2 mt-n2 fs-17-1920"
                          >
                            {{ $t("category") }}
                          </div>
                          <b-badge
                            class="layout-item rounded-pill p-1 pl-2 pr-2 ml-3 fs-16-1920"
                            draggable="true"
                            :id="category.id"
                            @dragstart="drag(category.id, 'categoryLayout')"
                            v-for="(category, i) in categoryLayout"
                            :key="i"
                            >{{ category.text }}</b-badge
                          >
                        </div></b-col
                      >
                      <b-col class="filter" sm="12"
                        ><div
                          class="p-2 d-flex fs-17-1920"
                          id="filter"
                          @drop.stop.prevent="drop('filterLayout')"
                          @dragover.prevent
                        >
                          <div class="filter-title mb-n2 pt-2 mt-n2 fs-17-1920">
                            {{ $t("filter") }}
                          </div>
                          <b-badge
                            class="layout-item rounded-pill p-1 pl-2 pr-2 ml-3 fs-16-1920"
                            draggable="true"
                            :id="filter.id"
                            @dragstart="drag(filter.id, 'filterLayout')"
                            v-for="(filter, i) in filterLayout"
                            :key="i"
                          >
                            {{ filter.text }}
                          </b-badge>
                        </div></b-col
                      >
                      <b-col
                        class="dimension"
                        sm="12"
                        v-if="
                          dataSource === 'dataElements' && chartType !== 'pie'
                        "
                        ><div
                          class="p-2 d-flex fs-17-1920"
                          id="assignedCatLayout"
                          @drop.stop.prevent="drop('assignedCatLayout')"
                          @dragover.prevent
                        >
                          <div class="filter-title mb-n2 pt-2 mt-n2 fs-17-1920">
                            {{ $t("otherDimension") }}
                          </div>
                          <b-badge
                            class="layout-item rounded-pill p-1 pl-2 pr-2 ml-3 fs-16-1920"
                            draggable="true"
                            :id="assignedCat.id"
                            @dragstart="
                              drag(assignedCat.id, 'assignedCatLayout')
                            "
                            v-for="(assignedCat, i) in assignedCatLayout"
                            :key="i"
                            >{{ assignedCat.text }}</b-badge
                          >
                        </div></b-col
                      >
                    </b-row>
                  </b-col>
                </b-row>
              </b-card>
              <b-card-body class="configure mt-4">
                <div class="d-flex justify-content-end">
                  <div class="d-flex" v-if="chartOptions.series.length > 0">
                    <template
                      v-if="
                        chartOptions.chart.type !== 'pie' &&
                        chartOptions.chart.type !== 'table'
                      "
                    >
                      <advancedOptions
                        :key="'advancedOptions'"
                        :chartOptions="chartOptions"
                        :selectedDrilldownData="selectedDrilldownData"
                        :source="source"
                        @updateOptions="updateOptions"
                        :orgOptions="orgOptions"
                        :defaultOrg="selectedLocation"
                        :autoUpdate="autoUpdate"
                        :canAddDrilldown="canAddDrilldown"
                      />
                    </template>
                    <chartOptions
                      :chartOptions="chartOptions"
                      @exportChart="exportChart"
                      @sortData="dataSort"
                      @bookmark="bookmark"
                      :table="table"
                      :chartType="chartType"
                    />
                  </div>
                </div>
                <div class="configure-chart fs-17-1920">
                  <template v-if="dataFetched">
                    <template v-if="chartType !== 'table'">
                      <highcharts
                        id="container"
                        v-if="chartOptions.series.length"
                        class="chartHeight"
                        :options="chartOptions"
                        ref="interactiveChart"
                      ></highcharts>
                      <div
                        class="chartHeight align-items-center justify-content-center d-flex"
                        v-else
                      >
                        {{ $t("no_data_to_display") }}
                      </div>
                    </template>
                    <template v-else>
                      <div
                        class="chartHeight text-center m-t-20px"
                        style="overflow: scroll"
                      >
                        <b-table
                          class="mb-0"
                          v-if="chartOptions.series.length"
                          :bordered="true"
                          striped
                          hover
                          :items="table.items"
                          :fields="table.fields"
                          show-empty
                          :empty-text="$t('no_data_to_display')"
                          ref="interactiveChart"
                        ></b-table>
                        <div
                          class="chartHeight align-items-center justify-content-center d-flex"
                          v-else
                        >
                          {{ $t("no_data_to_display") }}
                        </div>
                      </div>
                    </template>
                    <div class="text-right f-08rem">
                      {{ $t("source") }}: <b>{{ source }}</b>
                    </div>
                  </template>
                  <template v-else>
                    <div
                      class="chartHeight align-items-center justify-content-center d-flex"
                    >
                      <h3 class="configChart">
                        <i class="fa fa-arrow-left mr-2"></i
                        >{{ $t("configYourChart") }}
                      </h3>
                    </div>
                  </template>
                </div>
              </b-card-body>
            </b-col>
          </b-row>
        </div>
      </b-card>
    </div>
  </section>
</template>

<script>
/*global Highcharts*/
import IA from "./interactive";
import service from "@/service";
import chartOptions from "./chartOptions";
import Treeselect from "@riophae/vue-treeselect";
import ConfigureOptions from "./ConfigureOptions";
import { basicChartConfig } from "@/config/basicChartConfig";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import ReFetchConfigMixin from "@/helpers/ReFetchConfigMixin";
import loadLocChildMixin from "@/helpers/LoadLocationChildMixin";
import { adToBs } from "@sbmdkl/nepali-date-converter";
import {
  pTypeList,
  chartExport,
  randomString,
} from "@/components/Common/commonFunctions";
export default {
  components: {
    chartOptions,
    ConfigureOptions,
    advancedOptions: () =>
      import(
        /*webpackChunkName: 'interactive-advancedOptions'*/ "./advancedOptions"
      ),
    Treeselect,
    DataComponent: () =>
      import(
        /*webpackChunkName: 'interactive-DataComponent'*/ "./DataComponent"
      ),
  },
  mixins: [loadLocChildMixin, DynamicImageMixin, ReFetchConfigMixin],
  data() {
    return {
      dataMappingKey: "mainMapping",
      chartType: "column",
      isPercentageChart: false,
      periodType: null,
      selectedPeriod: [],
      currentYear:
        this.$store.getters.getAppSettings.calendar === "nepali"
          ? adToBs(
              `${
                new Date().getFullYear() +
                "-" +
                (new Date().getMonth() + 1) +
                "-" +
                new Date().getDate()
              }`
            ).split("-")[0]
          : new Date().getFullYear(),
      dataSource: null,
      dataSourceGroup: "",
      dataSourceText: "",
      dataSourceGroupList: [],
      allData: IA.allData,
      selectedLocation: [],
      orgOptions: [],
      seriesLayout: [],
      categoryLayout: [],
      filterLayout: [],
      assignedCatLayout: [],
      dragDropDetails: "",
      canAddDrillDown: false,
      isDrillDownAdded: false,
      selectedData: [],
      chartOptions: JSON.parse(JSON.stringify(basicChartConfig.column)),
      selectedDrilldownData: [],
      selectedFacility: [],
      dataFetched: false,
      count: 3,
      dataSearchText: "",
      source: this.$i18n.t("NA"),
      autoUpdate: false,
      loggedInUser: "",
      table: {
        items: [],
        fields: [
          {
            key: "Period / Data",
            sortable: true,
            variant: "secondary",
          },
        ],
      },
      facilityDimension: "",
      indicatorsColors: [],
      facilityListOriginal: [],
      allowedOptions: {},
      pTypeOptions: [],
    };
  },
  watch: {
    dataFetched(newValue) {
      if (newValue) {
        if (this.$route.query.bookmarkChart) {
          this.autoUpdate = true;
        }
      }
    },
  },
  computed: {
    periodList() {
      let pList = [],
        years = [],
        curYear;
      if (this.periodType === "yearly") {
        for (let i = this.currentYear; i > this.currentYear - 10; i--) {
          pList.push({ id: `${i}`, text: `${i}`, periodType: this.periodType });
        }
      } else if (
        this.periodType === "financialYear" ||
        this.periodType === "financialYearJuly" ||
        this.periodType === "financialYearOct"
      ) {
        (years =
          this.periodType === "FinancialYear"
            ? ["Mar", "Apr"]
            : this.periodType === "financialYearJuly"
            ? ["Jun", "Jul"]
            : ["Sept", "Oct"]),
          (curYear = this.currentYear);
        if (this.$store.getters.getAppSettings.calendar === "nepali") {
          years =
            this.periodType === "FinancialYear"
              ? ["Ashad", "Shrawan"]
              : this.periodType === "financialYearJuly"
              ? ["Ashoj", "Kartik"]
              : ["Poush", "Magh"];
        }
        if (this.$i18n.locale === "fr") {
          years =
            this.periodType === "FinancialYear"
              ? ["mars", "avril"]
              : this.periodType === "financialYearJuly"
              ? ["juin", "juil."]
              : ["sept.", "oct."];
        }
        for (let i = 1; i <= 10; i++) {
          pList.push({
            id:
              this.periodType === "FinancialYear"
                ? `${curYear}April`
                : `${curYear}July`,
            text:
              years[1] +
              " " +
              curYear +
              " " +
              this.$i18n.t("toSmall") +
              " " +
              years[0] +
              " " +
              (curYear + 1),
            periodType: this.periodType,
          });
          curYear -= 1;
        }
      } else if (this.periodType === "quarterly") {
        if (this.$store.getters.getAppSettings.calendar === "nepali") {
          years = {
            Q1: ["Baisakh", "Ashad"],
            Q2: ["Shrawan", "Ashoj"],
            Q3: ["Kartik", "Poush"],
            Q4: ["Magh", "Chaitra"],
          };
        } else {
          years = {
            Q1: ["Jan", "Mar"],
            Q2: ["Apr", "Jun"],
            Q3: ["Jul", "Sep"],
            Q4: ["Oct", "Dec"],
          };
        }
        if (this.$i18n.locale === "fr") {
          years = {
            Q1: ["janv.", "mars"],
            Q2: ["avril", "juin"],
            Q3: ["juil.", "sept."],
            Q4: ["oct.", "déc."],
          };
        }
        for (let i = 1; i <= 4; i++) {
          pList.push({
            id: `${this.currentYear}Q${i}`,
            text:
              years[`Q${i}`][0] +
              " " +
              this.$i18n.t("toSmall") +
              " " +
              years[`Q${i}`][1] +
              " " +
              this.currentYear,
            periodType: this.periodType,
          });
        }
        pList.reverse();
      } else {
        if (this.$store.getters.getAppSettings.calendar === "nepali") {
          years = [
            "Baishakh",
            "Jestha",
            "Ashadh",
            "Shrawan",
            "Bhadra",
            "Ashwin",
            "Kartik",
            "Mangsir",
            "Poush",
            "Magh",
            "Falgun",
            "Chaitra",
          ];
        } else {
          years = [
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
        }
        if (this.$i18n.locale === "fr") {
          years = [
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
          ];
        }
        for (let i = 1; i <= 12; i++) {
          pList.push({
            id: i < 10 ? `${this.currentYear}0${i}` : `${this.currentYear}${i}`,
            text: years[i - 1] + " " + this.currentYear,
            periodType: this.periodType,
          });
        }
        pList.reverse();
      }
      pList = pList.filter((p) => {
        let isFound = this.selectedPeriod.find((sp) => sp.id === p.id);
        if (!isFound) {
          return p;
        }
      });
      return pList;
    },
    facilityList() {
      return this.facilityListOriginal.filter((l) => {
        let isFound = this.selectedFacility.find((sd) => sd.id === l.id);
        if (!isFound) {
          return l;
        }
      });
    },
    periodTypeText() {
      return this.pTypeOptions.find((p) => p.value === this.periodType).text;
    },
    chartTypeOptions() {
      return [
        {
          value: "column",
          text: this.$i18n.t("column"),
          percentageChart: false,
          icon: "column",
        },
        {
          value: "column_stacked",
          text: this.$i18n.t("columnStacked"),
          percentageChart: false,
          icon: "column_stacked",
        },
        {
          value: "column_stacked",
          text: this.$i18n.t("columnStackedPercentage"),
          percentageChart: true,
          icon: "column_percentage",
        },
        {
          value: "bar",
          text: this.$i18n.t("bar"),
          percentageChart: false,
          icon: "bar",
        },
        {
          value: "bar_stacked",
          text: this.$i18n.t("barStacked"),
          percentageChart: false,
          icon: "bar_stacked",
        },
        {
          value: "bar_stacked",
          text: this.$i18n.t("barStackedPercentage"),
          percentageChart: true,
          icon: "bar_percentage",
        },
        {
          value: "line",
          text: this.$i18n.t("line"),
          percentageChart: false,
          icon: "line",
        },
        {
          value: "area",
          text: this.$i18n.t("area"),
          percentageChart: false,
          icon: "area",
        },
        {
          value: "pie",
          text: this.$i18n.t("pie"),
          percentageChart: false,
          icon: "pie",
        },
        {
          value: "table",
          text: this.$i18n.t("table"),
          percentageChart: false,
          icon: "tableIA",
        },
      ];
    },
  },
  methods: {
    getUpdatedOpt(obj) {
      this.allowedOptions = obj;
    },
    changeType(type, isPercentageChart) {
      this.chartType = type;
      this.isPercentageChart = isPercentageChart;

      if (type === "pie") {
        this.filterLayout = this.filterLayout.filter((f) => f.id !== "co");
        this.seriesLayout = this.seriesLayout.filter((f) => f.id !== "co");
        this.categoryLayout.forEach((c) => {
          if (c.id !== "co") {
            this.filterLayout.push(c);
          }
        });
        this.assignedCatLayout = [
          { id: "co", text: this.$i18n.t("assignedCategory") },
        ];
        this.$nextTick(() => (this.categoryLayout = []));
      } else {
        if (!this.dataFetched) {
          if (this.$route.query.bookmarkChart) {
            let savedBookmarkData = JSON.parse(
              localStorage.getItem("bookmarkChart")
            );
            this.seriesLayout = savedBookmarkData.seriesLayout;
            this.categoryLayout = savedBookmarkData.categoryLayout;
            this.filterLayout = savedBookmarkData.filterLayout;
          } else {
            this.seriesLayout = [{ id: "dx", text: this.$i18n.t("data") }];
            this.categoryLayout = [{ id: "pe", text: this.$i18n.t("period") }];
            if (this.selectedFacility.length) {
              this.filterLayout = [
                { id: "ou", text: this.$i18n.t("orgUnits") },
                {
                  id: this.facilityDimension.id,
                  text: this.$i18n.t("facilityType"),
                },
              ];
            } else {
              this.filterLayout = [
                { id: "ou", text: this.$i18n.t("orgUnits") },
              ];
            }
            this.assignedCatLayout = [
              { id: "co", text: this.$i18n.t("assignedCategory") },
            ];
          }
        }
      }
    },
    getDataSource(value) {
      this.dataSource = value;
      // if (this.dataSource !== "dataElements") {
      if (!(this.$route.query.bookmarkChart && !this.isDrillDown)) {
        this.seriesLayout = [{ id: "dx", text: this.$i18n.t("data") }];
        if (this.selectedFacility.length) {
          this.filterLayout = [
            { id: "ou", text: this.$i18n.t("orgUnits") },
            {
              id: this.facilityDimension.id,
              text: this.$i18n.t("facilityType"),
            },
          ];
        } else {
          this.filterLayout = [{ id: "ou", text: this.$i18n.t("orgUnits") }];
        }
        if (this.chartType === "pie") {
          this.filterLayout.push({
            id: "pe",
            text: this.$i18n.t("period"),
          });
        } else {
          this.categoryLayout = [{ id: "pe", text: this.$i18n.t("period") }];
          this.assignedCatLayout = [
            { id: "co", text: this.$i18n.t("assignedCategory") },
          ];
        }
      }
    },
    getDataSourceGroup(value) {
      this.dataSourceGroup = value;
    },
    getSelectedData(value) {
      this.selectedData = value;
    },
    dataSort(sort) {
      let sortedData = IA.sortData(sort, this.chartOptions);
      this.chartOptions.xAxis.categories = sortedData.aCategories;
      this.chartOptions.series.forEach((key, i) => {
        this.chartOptions.series[i].data = sortedData.aSeriesData[i];
      });
    },
    exportChart(type) {
      let chart = this.$refs.interactiveChart.chart;
      chartExport(type, chart);
    },
    bookmark() {
      this.$store.commit("setLoading", true);
      let key = this.generateKey("interactive");
      let allKeys = service.getAllKeys({});
      allKeys
        .then((keys) => {
          if (keys.data.includes(key)) {
            let saveConfig = service.getSavedConfig({ tableKey: key });
            saveConfig.then(async (res) => {
              this.$store.commit("setLoading", false);
              if (this.$route.query.bookmarkChart) {
                const { value: yesNo } = await this.$swal({
                  title: this.$i18n.t("bookmarkName", {
                    name: JSON.parse(localStorage.getItem("bookmarkChart"))
                      .name,
                  }),
                  inputLabel: this.$i18n.t("changeName"),
                  input: "select",
                  inputOptions: {
                    no: this.$i18n.t("no"),
                    yes: this.$i18n.t("yes"),
                  },
                  type: "question",
                  //inputPlaceholder: this.$i18n.t("changeName"),
                  showCancelButton: true,
                  reverseButtons: true,
                  confirmButtonText: this.$i18n.t("submitbtn"),
                  cancelButtonText: this.$i18n.t("cancelbtn"),
                  inputValidator: (value) => {
                    return new Promise((resolve) => {
                      if (value) {
                        resolve();
                      } else {
                        resolve(this.$i18n.t("warnMessage"));
                      }
                    });
                  },
                });

                if (yesNo === "yes") {
                  this.$swal({
                    title: this.$i18n.t("nameYourBookmark"),
                    input: "text",
                    showCancelButton: true,
                    reverseButtons: true,
                    confirmButtonText: this.$i18n.t("submitbtn"),
                    cancelButtonText: this.$i18n.t("cancelbtn"),
                  }).then((result) => {
                    if (result.value) {
                      this.$store.commit("setLoading", true);
                      let allBookmarks = res.data;
                      let b = allBookmarks.find(
                        (b) =>
                          b.name ===
                          JSON.parse(localStorage.getItem("bookmarkChart")).name
                      );
                      allBookmarks = allBookmarks.filter(
                        (b) =>
                          b.name !==
                          JSON.parse(localStorage.getItem("bookmarkChart")).name
                      );
                      let bookmark = this.getBookmarkObj(b, result.value);

                      allBookmarks.push(bookmark);
                      let response = service.updateConfig({
                        data: allBookmarks,
                        tableKey: key,
                      });
                      response.then((response) => {
                        this.showAlert(response);
                      });
                    }
                  });
                }
                if (yesNo === "no") {
                  this.$store.commit("setLoading", true);
                  let allBookmarks = res.data;
                  let b = allBookmarks.find(
                    (b) =>
                      b.name ===
                      JSON.parse(localStorage.getItem("bookmarkChart")).name
                  );
                  allBookmarks = allBookmarks.filter(
                    (b) =>
                      b.name !==
                      JSON.parse(localStorage.getItem("bookmarkChart")).name
                  );
                  let bookmark = this.getBookmarkObj(
                    b,
                    JSON.parse(localStorage.getItem("bookmarkChart")).name
                  );

                  allBookmarks.push(bookmark);
                  let response = service.updateConfig({
                    data: allBookmarks,
                    tableKey: key,
                  });
                  response.then((response) => {
                    this.showAlert(response);
                  });
                }
              } else {
                this.saveBookmark(res);
              }
            });
          } else {
            this.$store.commit("setLoading", false);
            this.$swal({
              title: this.$i18n.t("nameYourBookmark"),
              input: "text",
              showCancelButton: true,
              reverseButtons: true,
              confirmButtonText: this.$i18n.t("submitbtn"),
              cancelButtonText: this.$i18n.t("cancelbtn"),
            }).then((result) => {
              if (result.value) {
                this.$store.commit("setLoading", true);
                let interactiveBookmarks = [
                  this.getFirstBookmarkObj(result.value),
                ];
                let response = service.saveConfig({
                  data: interactiveBookmarks,
                  tableKey: key,
                });
                response.then((response) => {
                  this.showAlert(response);
                });
              }
            });
          }
        })
        .catch(() => {
          this.$store.commit("setLoading", false);
        });
    },
    getBookmarkObj(b, name) {
      return {
        ...b,
        name: name,
        chartData: this.chartOptions,
        source: this.source,
        selectedData: this.selectedData,
        selectedDrilldownData: this.selectedDrilldownData,
        dataSource: this.dataSource,
        dataSourceGroup: this.dataSourceGroup,
        updatedAt: this.$moment(new Date()).format("DD/MM/YYYY, h:mm:ss a"),
        selectedPeriod: this.selectedPeriod,
        periodType: this.periodType,
        selectedFacility: this.selectedFacility,
        facilityDimension: this.facilityDimension,
        selectedOrg: this.selectedLocation,
        tableData: this.table,
        seriesLayout: this.seriesLayout,
        categoryLayout: this.categoryLayout,
        filterLayout: this.filterLayout,
        chartType: this.chartType,
        isPercentageChart: this.isPercentageChart,
      };
    },
    getFirstBookmarkObj(name) {
      let randomStr = randomString(16);
      return {
        id: randomStr,
        i: randomStr, //Required in dynamic module creation ["vue-grid-layout" plugin]
        name: name,
        user: this.loggedInUser.userCredentials.id,
        userName: this.loggedInUser.firstName + " " + this.loggedInUser.surname,
        isAdmin: this.$store.getters.getIsAdmin,
        isNotAdmin: !this.$store.getters.getIsAdmin,
        chartData: this.chartOptions,
        source: this.source,
        selectedData: this.selectedData,
        selectedDrilldownData: this.selectedDrilldownData,
        dataSource: this.dataSource,
        dataSourceGroup: this.dataSourceGroup,
        createdAt: this.$moment(new Date()).format("DD/MM/YYYY, h:mm:ss a"),
        updatedAt: this.$moment(new Date()).format("DD/MM/YYYY, h:mm:ss a"),
        selectedPeriod: this.selectedPeriod,
        periodType: this.periodType,
        selectedFacility: this.selectedFacility,
        facilityDimension: this.facilityDimension,
        selectedOrg: this.selectedLocation,
        tableData: this.table,
        adminAccess: false,
        seriesLayout: this.seriesLayout,
        categoryLayout: this.categoryLayout,
        filterLayout: this.filterLayout,
        chartType: this.chartType,
        isPercentageChart: this.isPercentageChart,
        locale: this.$i18n.locale,
      };
    },
    saveBookmark(res) {
      let key = this.generateKey("interactive");

      this.$swal({
        title: this.$i18n.t("nameYourBookmark"),
        input: "text",
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: this.$i18n.t("submitbtn"),
        cancelButtonText: this.$i18n.t("cancelbtn"),
      }).then((result) => {
        if (result.value) {
          this.$store.commit("setLoading", true);
          let isName = null;
          isName =
            res.data &&
            Array.isArray(res.data) &&
            res.data.find((d) => d.name === result.value);

          if (isName) {
            this.sweetAlert({
              title: this.$i18n.t("error"),
              text: this.$i18n.t("duplicateName"),
            });
            this.$store.commit("setLoading", false);
          } else {
            let bookmark = this.getFirstBookmarkObj(result.value);
            let allBookmarks = res.data;
            allBookmarks.push(bookmark);
            let response = service.updateConfig({
              data: allBookmarks,
              tableKey: key,
            });
            response.then((response) => {
              this.showAlert(response);
            });
          }
        }
      });
    },
    showAlert(response) {
      if (response.data.status === "OK") {
        this.$swal({
          title: this.$i18n.t("data_saved_successfully"),
          html: this.$i18n.t("redirectIn"),
          timer: 2000,
          showConfirmButton: false,
        }).then((result) => {
          if (result.dismiss) {
            this.$router.push("SavedFavorites");
          }
        });
        this.$store.commit("setLoading", false);
      } else {
        this.sweetAlert({
          title: this.$i18n.t("error"),
          text: `${response.data.message}`,
        });
        this.$store.commit("setLoading", false);
        return;
      }
    },
    changePeriodType(pType) {
      this.periodType = pType.value;
    },
    movePeriod({ type, period = "all" }) {
      if (type === "+") {
        if (period === "all") {
          this.selectedPeriod = [...this.selectedPeriod, ...this.periodList];
        } else {
          this.selectedPeriod.push(period);
        }
      } else {
        if (period === "all") {
          this.selectedPeriod = [];
        } else {
          this.selectedPeriod = this.selectedPeriod.filter(
            (p) => p.id !== period.id
          );
        }
      }
    },
    moveFacility({ type, facility = "all" }) {
      if (type === "+") {
        if (facility === "all") {
          this.selectedFacility = [
            ...this.selectedFacility,
            ...this.facilityList,
          ];
        } else {
          this.selectedFacility.push(facility);
        }
      } else {
        if (facility === "all") {
          this.selectedFacility = [];
        } else {
          this.selectedFacility = this.selectedFacility.filter(
            (p) => p.id !== facility.id
          );
        }
      }
    },
    getOrganizationUnits() {
      const renamedObj = service.renameKeys(
        this.$store.getters.getLocationList[0],
        false
      );
      this.orgOptions = JSON.parse(JSON.stringify([renamedObj]));
      if (this.$route.query.bookmarkChart) {
        this.selectedLocation = JSON.parse(
          localStorage.getItem("bookmarkChart")
        ).selectedOrg;
      } else {
        let { locationID } = service.getAllowedLocation();
        this.selectedLocation = [locationID];
      }
    },
    drag(id, layout) {
      this.dragDropDetails = `${id}_${layout}`;
      // event.dataTransfer.setData("transferData", );
    },
    drop(layout) {
      // let data = event.dataTransfer.getData("transferData");
      let data = this.dragDropDetails;
      let transferID = data.split("_")[0],
        sourceLayout = data.split("_")[1];
      if (layout === "seriesLayout") {
        let targetData = this[layout].length > 0 && this[layout][0];
        if (targetData) {
          this[layout] = [];
          this[sourceLayout].push(targetData);
        }
      }
      let dragData = this[sourceLayout].filter((s) => s.id === transferID)[0];
      this[sourceLayout] = this[sourceLayout].filter(
        (s) => s.id !== transferID
      );
      this[layout].push(dragData);

      this.$nextTick(() => {
        this.dragDropDetails = "";
        this.canAddDrillDown =
          this.seriesLayout.length > 0 && this.seriesLayout[0].id === "dx"
            ? true
            : false;
        this.isDrillDownAdded = this.canAddDrillDown;
      });
      // event.target.appendChild(document.getElementById(data));
    },
    loadOptionsWrapper({ action, parentNode, callback }) {
      this.loadOptions({ action, parentNode, callback }, false);
    },
    generateChart() {
      if (this.seriesLayout.length === 0) {
        this.sweetAlert({
          title: this.$i18n.t("error"),
          text: this.$i18n.t("seriesError"),
        });
      } else {
        if (this.categoryLayout.length === 0 && this.chartType !== "pie") {
          this.sweetAlert({
            title: this.$i18n.t("error"),
            text: this.$i18n.t("categoryError"),
          });
        } else {
          // this.selectedDrilldownData = this.selectedData
          if (!this.$route.query.bookmarkChart) {
            // this.selectedDrilldownData = this.selectedData
            if (this.chartType !== "table") {
              this.chartOptions = JSON.parse(
                JSON.stringify(basicChartConfig[this.chartType])
              );
            } else {
              this.chartOptions = JSON.parse(
                JSON.stringify(basicChartConfig.column)
              );
            }
          }
          // else {
          let newAdded = this.selectedData.filter(
            (s) => !this.selectedDrilldownData.find((b) => b.id === s.id)
          );
          let filteredData = this.selectedDrilldownData.filter((b) =>
            this.selectedData.find((s) => s.id === b.id)
          );
          this.selectedDrilldownData = [...filteredData, ...newAdded];
          // }
          if (this.$route.query.bookmarkChart && this.chartType !== "pie") {
            this.chartOptions.yAxis.plotLines = JSON.parse(
              localStorage.getItem("bookmarkChart")
            ).chartData.yAxis.plotLines;
          }
          if (this.selectedData.length) {
            if (this.selectedPeriod.length) {
              if (this.selectedLocation.length) {
                this.$store.commit("setLoading", true);
                this.chartOptions.chart.type =
                  this.chartType !== "table"
                    ? this.chartType.split("_")[0]
                    : "column";
                this.chartOptions.chart.oType = this.chartType;

                let de = this.selectedData.map((sd) => sd.id).join(";");

                this.chartOptions.series = [];
                // if (this.chartType !== 'pie') {
                //   this.chartOptions.xAxis.categories = []
                // }

                let items = [];
                let fields = [];

                let period = this.selectedPeriod.map((p) => p.id).join(";");

                let facilities = this.selectedFacility.length
                  ? this.selectedFacility.map((f) => f.id).join(";")
                  : "";
                // if (facilities) {
                //   facilities = this.facilityDimension.id + ":" + facilities;
                // }

                let location = this.selectedLocation.join(";");

                let dimensions = [],
                  filters = [],
                  series = this.seriesLayout[0].id,
                  xAxis =
                    this.categoryLayout.length > 0
                      ? this.categoryLayout[0].id
                      : "",
                  isDualAxes = this.categoryLayout.length > 1 ? true : false,
                  dualAxesCategory = "";
                this.canAddDrilldown = series === "dx" ? true : false;
                if (isDualAxes) {
                  dualAxesCategory = this.categoryLayout[1].id;
                }

                let tableHeaders = [];
                this.seriesLayout.forEach((s) => {
                  let tableHeader =
                    s.id === "dx"
                      ? this.$i18n.t("data")
                      : s.id === "pe"
                      ? this.$i18n.t("period")
                      : s.id === "ou"
                      ? this.$i18n.t("orgUnits")
                      : this.facilityDimension &&
                        s.id === this.facilityDimension.id
                      ? this.$i18n.t("facilityType")
                      : this.$i18n.t("assignedCategory");
                  if (this.chartType === "pie") {
                    tableHeaders.push({ id: s.id, header: tableHeader });
                    tableHeaders.push({ id: "value", header: "Value" });
                    fields.push({
                      key: tableHeader,
                      sortable: true,
                      variant: "secondary",
                    });
                    fields.push({
                      key: "Value",
                      sortable: true,
                    });
                  }
                  dimensions.push(
                    `${s.id}:${
                      s.id === "dx"
                        ? de
                        : s.id === "pe"
                        ? period
                        : s.id === "ou"
                        ? location
                        : this.facilityDimension &&
                          s.id === this.facilityDimension.id
                        ? facilities
                        : ""
                    }`
                  );
                });
                this.categoryLayout.forEach((c) => {
                  let tableHeader =
                    c.id === "dx"
                      ? this.$i18n.t("data")
                      : c.id === "pe"
                      ? this.$i18n.t("period")
                      : c.id === "ou"
                      ? this.$i18n.t("orgUnits")
                      : this.facilityDimension &&
                        c.id === this.facilityDimension.id
                      ? this.$i18n.t("facilityType")
                      : this.$i18n.t("assignedCategory");
                  tableHeaders.push({ id: c.id, header: tableHeader });
                  fields.push({
                    key: tableHeader,
                    sortable: true,
                    variant: "secondary",
                  });
                  dimensions.push(
                    `${c.id}:${
                      c.id === "dx"
                        ? de
                        : c.id === "pe"
                        ? period
                        : c.id === "ou"
                        ? location
                        : this.facilityDimension &&
                          c.id === this.facilityDimension.id
                        ? facilities
                        : ""
                    }`
                  );
                });
                if (this.filterLayout.length > 0) {
                  this.filterLayout.forEach((f) => {
                    filters.push(
                      `${f.id}:${
                        f.id === "dx"
                          ? de
                          : f.id === "pe"
                          ? period
                          : f.id === "ou"
                          ? location
                          : this.facilityDimension &&
                            f.id === this.facilityDimension.id
                          ? facilities
                          : ""
                      }`
                    );
                  });
                }
                this.table = {
                  items,
                  fields,
                };
                let drillDownObj = {};
                let drillDownDX = [];
                if (this.isDrilldownAdded) {
                  let isDrilldown = this.selectedDrilldownData.filter(
                    (s) => typeof s.drilldownDetails !== "undefined"
                  );
                  isDrilldown.forEach((s) => {
                    drillDownObj[s.id] = s.drilldownDetails.selectedData.map(
                      (s) => s.id
                    );
                    s.drilldownDetails.selectedData.map((s) =>
                      drillDownDX.push(s.id)
                    );
                  });
                  dimensions = dimensions.map((d) => {
                    if (d.split(":")[0] === "dx") {
                      let allDX = d
                        .split(":")[1]
                        .split(";")
                        .concat(drillDownDX)
                        .join(";");
                      let id = d.split(":")[0];
                      return `${id}:${allDX}`;
                    } else {
                      return d;
                    }
                  });
                  filters = filters.map((d) => {
                    if (d.split(":")[0] === "dx") {
                      let allDX = d
                        .split(":")[1]
                        .split(";")
                        .concat(drillDownDX)
                        .join(";");
                      let id = d.split(":")[0];
                      return `${id}:${allDX}`;
                    } else {
                      return d;
                    }
                  });
                }
                console.log(this.selectedPeriod, "period selected");
                let data = service.getInteractiveData(dimensions, filters);
                data
                  .then((response) => {
                    let { items, fields, chartOptions } = IA.generateChart(
                      response,
                      this.chartOptions,
                      this.table.items,
                      this.table.fields,
                      this.chartType,
                      series,
                      xAxis,
                      isDualAxes,
                      dualAxesCategory,
                      tableHeaders,
                      drillDownObj,
                      drillDownDX,
                      this.isDrilldownAdded,
                      this.facilityDimension,
                      this.selectedPeriod,
                      this.periodType
                    );
                    // return
                    let finalData = chartOptions;
                    if (this.$route.query.bookmarkChart) {
                      finalData = {
                        ...chartOptions,
                        series: chartOptions.series.map((s) => {
                          let findInd = this.indicatorsColors.find(
                            (c) => c.static_name === s.static_name
                          );
                          if (findInd) {
                            return {
                              ...s,
                              color: findInd.color,
                              name: findInd.name,
                            };
                          } else {
                            return s;
                          }
                        }),
                      };
                    }
                    this.chartOptions = finalData;
                    if (this.isPercentageChart) {
                      this.chartOptions.plotOptions.series.stacking = "percent";
                      this.chartOptions.yAxis.labels = {
                        format: "{value} %",
                      };
                    }

                    this.chartOptions.tooltip.pointFormat = `<tr><td>${
                      isDualAxes ? "{series.userOptions.stack}:" : ""
                    } </td></tr>
                  <tr><td style="color:{series.color};padding:0">{series.name}: </td>
                  <td style="padding:0"><b>${
                    this.isPercentageChart
                      ? "{point.y} ({point.percentage:.0f}%)"
                      : "{point.y}"
                  }</b></td></tr><br/>`;

                    this.table = {
                      items,
                      fields,
                    };
                    this.dataFetched = true;
                    this.$store.commit("setLoading", false);
                  })
                  .catch((res) => {
                    console.log("res", res);
                    this.$store.commit("setLoading", false);
                    this.sweetAlert({
                      title: this.$i18n.t("somethingwentwrong"),
                      html: `<div>${this.$i18n.t(
                        "posReasons"
                      )}<ul class="text-left"><li>${this.$i18n.t(
                        "errorInData"
                      )}</li><li>${this.$i18n.t("res1", {
                        data: this.$i18n.t("data"),
                        period: this.$i18n.t("period"),
                        orgUnits: this.$i18n.t("orgUnits"),
                      })}</li><li>${this.$i18n.t("res2", {
                        layout: this.$i18n.t("layout"),
                      })}</li></ul></div>`,
                    });
                  });
              } else {
                this.sweetAlert({
                  title: this.$i18n.t("error"),
                  text: this.$i18n.t("orgError"),
                });
              }
            } else {
              this.sweetAlert({
                title: this.$i18n.t("error"),
                text: this.$i18n.t("periodError"),
              });
            }
          } else {
            this.sweetAlert({
              title: this.$i18n.t("error"),
              text: this.$i18n.t("dataElementError"),
            });
          }
        }
      }
    },
    updateOptions(updated) {
      this.chartOptions.series = [];
      this.chartOptions.series = JSON.parse(JSON.stringify(updated.seriesData));
      this.chartOptions.plotOptions.series.dataLabels.enabled =
        updated.dataLabels;
      this.chartOptions.xAxis.title.text = updated.xAxisTitle;
      this.chartOptions.yAxis.title.text = updated.yAxisTitle;
      this.chartOptions.legend.enabled = updated.legends;
      this.chartOptions.title.text = updated.title;
      this.chartOptions.subtitle.text = updated.subTitle;
      this.indicatorsColors = updated.seriesData.map((s) => ({
        color: s.color,
        static_name: s.static_name,
        name: s.name,
      }));
      if (updated.sharedTooltip !== "NA") {
        this.chartOptions.tooltip.shared = updated.sharedTooltip;
      }
      let yMax = this.$refs.interactiveChart?.chart?.yAxis[0]?.max || null;
      let plotlines = updated.plotline.map((p) => {
        let benchmarkValue = p.percValue;
        if (p.valueType === "percentage") {
          benchmarkValue = (yMax * (p.percValue * 1)) / 100;
        }
        return {
          ...p,
          value: p.value === "" ? undefined : benchmarkValue,
          percValue: p.value === "" ? undefined : p.percValue,
          label: {
            ...p.label,
            text: p.label.textVisible
              ? `${p.label.textVisible}: ${p.percValue}${
                  p.valueType === "percentage" ? "%" : ""
                }`
              : "",
          },
        };
      });
      this.chartOptions.yAxis.plotLines = plotlines;
      this.selectedDrilldownData = updated.drilldownData;
      this.source = updated.source;
      this.isDrilldownAdded = updated.isDrilldownAdded;
      if (updated.isDrilldownAdded) {
        this.autoUpdate = false;
        this.generateChart();
      }
    },
    getDimensions() {
      let facilities = service.getDimensions();
      facilities
        .then((response) => {
          this.facilityDimension = response.data.dimensions.find(
            (r) =>
              r.name === "Facility Ownership" ||
              r.name.includes("OrgUnit Ownership") //OrgUnit Ownership
          );
          if (this.facilityDimension) {
            this.getFacilities();
          }
        })
        .catch(() => {
          console.log("getDimensions failed");
        });
    },
    getFacilities() {
      let facilities = service.getFacilityTypes(this.facilityDimension.id);
      facilities.then((response) => {
        this.facilityListOriginal = JSON.parse(
          JSON.stringify(response.data.items)
        );
      });
    },
    setData() {
      this.dataFetched = true;
      let savedBookmarkData = JSON.parse(localStorage.getItem("bookmarkChart"));
      this.selectedDrilldownData = savedBookmarkData.selectedDrilldownData;

      this.seriesLayout = savedBookmarkData.seriesLayout;
      this.categoryLayout = savedBookmarkData.categoryLayout;
      this.filterLayout = savedBookmarkData.filterLayout;
      let isFound = savedBookmarkData.seriesLayout.find((s) => s.id === "co");
      isFound = savedBookmarkData.categoryLayout.find((s) => s.id === "co");
      isFound = savedBookmarkData.filterLayout.find((s) => s.id === "co");
      if (!isFound) {
        this.assignedCatLayout = [
          { id: "co", text: this.$i18n.t("assignedCategories") },
        ];
      }
      this.canAddDrilldown =
        savedBookmarkData.seriesLayout[0].id === "dx" ? true : false;
      if (this.categoryLayout.length > 1) {
        this.chartOptions.tooltip = {
          formatter: function () {
            return (
              "<b>" +
              this.series.userOptions.stack +
              "</b><br/>" +
              this.series.name +
              ": " +
              Highcharts.numberFormat(this.y)
            );
          },
        };
      }
      this.indicatorsColors = savedBookmarkData.chartData.series.map((s) => ({
        color: s.color,
        static_name: s.static_name,
        name: s.name,
      }));
      this.chartType =
        typeof savedBookmarkData.chartType !== "undefined"
          ? savedBookmarkData.chartType
          : savedBookmarkData.chartData.chart.oType;
      this.isPercentageChart =
        typeof savedBookmarkData.isPercentageChart !== "undefined"
          ? savedBookmarkData.isPercentageChart
          : false;
      this.chartOptions = JSON.parse(
        JSON.stringify(savedBookmarkData.chartData)
      );
      this.periodType = savedBookmarkData.periodType;
      this.selectedPeriod = savedBookmarkData.selectedPeriod;
      // let d = this.selectedPeriod.map((d) => d.id);
      // this.periodList = this.periodList.filter((dl) => !d.includes(dl.id));
      this.selectedFacility = savedBookmarkData.selectedFacility;
      this.facilityDimension = savedBookmarkData.facilityDimension;
      this.selectedLocation = savedBookmarkData.selectedOrg;
      this.table = savedBookmarkData.tableData;
      this.source = savedBookmarkData.source
        ? savedBookmarkData.source
        : this.source;
    },
    dataCalls() {
      this.loggedInUser = this.$store.getters.getUserDetails;
      this.getDimensions();
      this.chartOptions.series = [];
      this.getOrganizationUnits();
      if (this.$route.query.bookmarkChart) {
        if (localStorage.getItem("bookmarkChart")) {
          this.setData();
        } else {
          let key = this.generateKey("interactive");

          let saveConfig = service.getSavedConfig({ tableKey: key });
          saveConfig.then((res) => {
            let bookmarkData = res.data.find(
              (d) => d.id === this.$route.query.bookmarkChart
            );
            if (bookmarkData) {
              localStorage.setItem(
                "bookmarkChart",
                JSON.stringify(bookmarkData)
              );
              this.$nextTick(() => this.setData());
            } else {
              this.sweetAlert({
                title: this.$i18n.t("oops"),
                text: this.$i18n.t("no_data_to_display"),
              });
            }
          });
        }
      } else {
        this.seriesLayout = [{ id: "dx", text: this.$i18n.t("data") }];
        this.categoryLayout = [{ id: "pe", text: this.$i18n.t("period") }];
        this.filterLayout = [{ id: "ou", text: this.$i18n.t("orgUnits") }];
        this.assignedCatLayout = [
          { id: "co", text: this.$i18n.t("assignedCategories") },
        ];
      }
    },
    getConfigData() {
      let key = this.generateKey("interactiveConfig");
      service
        .getSavedConfig({ tableKey: key })
        .then((res) => {
          this.allowedOptions = res.data;
        })
        .catch((err) => {
          this.$store.commit("setLoading", false);
          this.reFetchConfig(err);
        });
    },
  },
  created() {
    this.pTypeOptions = pTypeList({ id: "value", label: "text" });
    this.getConfigData();
    this.periodType = "monthly";
    this.dataCalls();
  },
};
</script>
