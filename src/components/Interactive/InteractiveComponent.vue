<template>
  <b-card class="interactive-card mx-4">
    <b-card-header
      class="interactive-card-title pb-0 pt-0 d-flex justify-content-between align-items-center"
    >
      <h6 class="mb-0 fs-18-1920">
        {{ $t("configureChart") }}
      </h6>
      <div>
        <div class="row no-gutters" v-if="chartOptions.series.length > 0">
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
      <b-button
	  v-if="this.$store.getters.getIsAdmin"
        class="update-btn border-0 px-4 fs-17-1920"
        @click="configireBtn = !configireBtn"
        >Configure</b-button
      >
      <b-modal v-model="configireBtn" hide-footer style="background" size="lg">
        <b-card-body class="pt-1 pb-1">
          <b-dropdown
            id="'dropdown-indi' + 'key1'"
            :text="dataSourceText"
            class="indi mt-2 mb-2 w-100 text-left fs-17-1920"
            lazy
            menu-class="data-source-group-list fs-17-1920"
          >
            <b-dropdown-item
              v-for="dataSourceOpt in dataOptions"
              :key="dataSourceOpt.id"
              :value="dataSourceOpt.text"
              @click="dataSource = dataSourceOpt.value"
              ><div class="fs-17-1920">
                {{ dataSourceOpt.text }}
              </div></b-dropdown-item
            >
          </b-dropdown>
          <div class="pb-1 fs-17-1920">
            <b-form-input
              class="search-input border-0 rounded-pill fs-17-1920"
              :placeholder="$t('search')"
              v-model="dataSearchText"
            ></b-form-input>
          </div>
          <div class="mt-2">
            <b-container fluid>
              <b-row>
                <b-col sm="6" class="pl-0">
                  <div class="small">{{ $t("available") }}</div>
                  <div
                    class="left-data p-3 dataConfig"
                    @scroll="onScroll"
                    style=""
                  >
                    <ul class="med-list list-unstyled" ref="data_left">
                      <li
                        class="med-list-item pt-1 pb-1 fs-17-1920"
                        v-on:click="moveData({ type: '+', data: item })"
                        v-for="item in dataList"
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
                  <div class="small text-right">{{ $t("selected") }}</div>
                  <div class="right-data p-3 dataConfig">
                    <ul
                      class="med-list list-unstyled fs-17-1920"
                      ref="data_right"
                    >
                      <li
                        class="med-list-item pt-1 pb-1 fs-17-1920"
                        v-on:click="moveData({ type: '-', data: item })"
                        v-for="item in selectedData"
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
              <b-row class="mt-3">
                <b-col cols="6" class="text-center"
                  ><b-button
                    class="move-btn-left rounded-pill fs-17-1920"
                    v-on:click="moveData({ type: '+' })"
                    >{{ $t("moveAll") }}</b-button
                  ></b-col
                >
                <b-col cols="6" class="text-center"
                  ><b-button
                    class="move-btn-right rounded-pill fs-17-1920"
                    v-on:click="moveData({ type: '-' })"
                    >{{ $t("moveAll") }}</b-button
                  ></b-col
                >
              </b-row>
              <b-row>
                <b-col
                  ><b-button
                    class="move-btn-right rounded-pill fs-17-1920 float-right"
                    v-on:click="UpdateSelectedList()"
                    >Updates</b-button
                  ></b-col
                >
              </b-row>
            </b-container>
          </div>
        </b-card-body>
      </b-modal>
    </b-card-header>
    <b-card-body class="pr-0 pt-2">
      <b-row>
        <b-col sm="12" lg="4" className="position-relative border-0">
          <div class="accordian-col">
            <div class="accordion" id="conf-data" role="tablist">
              <b-card no-body class="bg-transparent border-0">
                <b-card-header
                  header-tag="header"
                  class="title p-1 border-right-0"
                  role="tab"
                >
                  <b-button
                    class="main-title text-left bg-transparent border-left-0 border-right-0 border-bottom-0 rounded-0 text-uppercase fs-18-1920"
                    block
                    v-b-toggle.accordion-1
                  >
                    <img
                      :src="require('@/assets/images/icons/data.png')"
                      class="datalogo-img pl-2 pr-4"
                    />
                    {{ $t("data") }}</b-button
                  >
                </b-card-header>
                <b-collapse
                  id="accordion-1"
                  class="data-acc fs-17-1920 border-right-0"
                  visible
                  accordion="my-accordion"
                  role="tabpanel"
                >
                  <DataComponent
                    key="'MainMapping'"
                    :reusableKey="'key1'"
                    @getDataSource="getDataSource"
                    @getDataSourceGroup="getDataSourceGroup"
                    @getSelectedData="getSelectedData"
                  />
                </b-collapse>
              </b-card>
              <b-card no-body class="bg-transparent border-0">
                <b-card-header header-tag="header" class="p-1" role="tab">
                  <b-button
                    class="main-title text-left bg-transparent border-left-0 border-right-0 rounded-0 text-uppercase fs-18-1920"
                    block
                    v-b-toggle.accordion-2
                  >
                    <img
                      :src="require('@/assets/images/icons/period.png')"
                      class="periodlogo-img pl-2 pr-4"
                    />
                    {{ $t("period") }}</b-button
                  >
                </b-card-header>
                <b-collapse
                  id="accordion-2"
                  class="period-acc fs-17-1920"
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
                        v-for="(pType, index) in periodTypeList"
                        :key="pType.value + index"
                        :value="pType.value"
                        @click="changePeriodType(pType)"
                        ><div class="fs-17-1920">
                          {{ pType.text }}
                        </div></b-dropdown-item-button
                      >
                    </b-dropdown>
                    <b-container>
                      <b-row class="mt-3">
                        <b-col cols="6" class="text-center"
                          ><b-button
                            class="year-btn-left rounded-pill fs-17-1920"
                            @click="currentYear = currentYear - 1"
                            >{{ $t("prevYear") }}</b-button
                          ></b-col
                        >
                        <b-col cols="6" class="text-center"
                          ><b-button
                            class="year-btn-right rounded-pill fs-17-1920"
                            @click="currentYear = currentYear + 1"
                            >{{ $t("nextYear") }}</b-button
                          ></b-col
                        >
                      </b-row>
                    </b-container>
                    <b-container fluid>
                      <b-row class="mt-3">
                        <b-col sm="6" class="pl-0">
                          <div class="small">{{ $t("available") }}</div>
                          <div class="left-year-data">
                            <ul class="year-list list-unstyled p-3 fs-17-1920">
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
                          <div class="small text-right">
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
                      <b-row class="mt-3">
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
              <b-card no-body class="bg-transparent border-0">
                <b-card-header header-tag="header" class="p-1" role="tab">
                  <b-button
                    class="main-title text-left bg-transparent border-left-0 border-right-0 border-top-0 rounded-0 text-uppercase fs-18-1920"
                    block
                    v-b-toggle.accordion-3
                  >
                    <img
                      :src="
                        require('@/assets/images/icons/organaisation-unit.png')
                      "
                      class="unitlogo-img pl-2 pr-4"
                    />
                    {{ $t("organizationUnit") }}</b-button
                  >
                </b-card-header>
                <b-collapse
                  id="accordion-3"
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
                        :load-options="loadOptionsWrapper"
                        v-model="selectedLocation"
                        :options="orgOptions"
                      />
                    </div>
                  </b-card-body>
                </b-collapse>
              </b-card>
              <b-card
                no-body
                class="bg-transparent"
                v-if="facilityListOriginal.length"
              >
                <b-card-header header-tag="header" class="p-1" role="tab">
                  <b-button
                    class="main-title text-left bg-transparent border-left-0 border-right-0 border-top-0 rounded-0 text-uppercase fs-18-1920"
                    block
                    v-b-toggle.accordion-4
                  >
                    <img
                      :src="
                        require('@/assets/images/icons/organaisation-unit.png')
                      "
                      class="unitlogo-img pl-2 pr-4"
                    />
                    {{ $t("facilityType") }}</b-button
                  >
                </b-card-header>
                <b-collapse
                  id="accordion-4"
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
                                    moveFacility({ type: '+', facility: item })
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
                            <div class="small text-right">
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
                                    moveFacility({ type: '-', facility: item })
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
                        <b-row class="mt-3">
                          <b-col cols="6" class="text-center"
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
              class="update-btn border-0 rounded-pill px-4 fs-17-1920"
              v-on:click="generateChart"
              >{{ $t("update") }}</b-button
            >
          </div>
        </b-col>
        <b-col sm="12" lg="8" class="pr-0 mt-sm-4 mt-lg-0">
          <b-card class="chart rounded-0">
            <template #header class="chart-title bg-transparent d-flex ml-3">
              <p class="mb-0 chart-type ml-4">{{ $t("chartType") }}:</p>
              <div class="pl-5 pl-sm-3">
                <img
                  v-for="(type, index) in chartTypeOptions"
                  :key="type.value + index"
                  :src="
                    require(`@/assets/images/icons/${type.icon}${
                      chartType === type.value &&
                      isPercentageChart === type.percentageChart
                        ? 'Active'
                        : ''
                    }.png`)
                  "
                  v-b-tooltip.hover
                  :title="type.text"
                  class="chrtlogo-img pl-4 pr-5 pr-sm-3 pl-sm-3 cursor-pointer"
                  @click="changeType(type.value, type.percentageChart)"
                />
              </div>
            </template>
            <b-card-body class="configure pt-0">
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
                  <div class="text-right mt-2">
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
            <b-card-footer class="chart-footer bg-transparent">
              <b-row>
                <b-col
                  class="layout d-flex justify-content-between align-items-center pl-4 fs-17-1920"
                  sm="2"
                  >{{ $t("layout") }}:</b-col
                >
                <b-col sm="10">
                  <b-row class="layout-info">
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
                        <div class="category-title mb-n2 pt-2 mt-n2 fs-17-1920">
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
                          @dragstart="drag(assignedCat.id, 'assignedCatLayout')"
                          v-for="(assignedCat, i) in assignedCatLayout"
                          :key="i"
                          >{{ assignedCat.text }}</b-badge
                        >
                      </div></b-col
                    >
                  </b-row>
                </b-col>
              </b-row>
            </b-card-footer>
          </b-card>
        </b-col>
      </b-row>
    </b-card-body>
  </b-card>
</template>
<script>
/*global settings, Highcharts*/
import service from "@/service";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import loadLocChildMixin from "@/helpers/LoadLocationChildMixin";
import IA from "./interactive";
import basicChartConfig from "@/config/basicChartConfig_IA.js";
import chartOptions from "./chartOptions";
import { chartExport, randomString } from "@/components/Common/commonFunctions";
import audit from "../config/audit.js";
export default {
  components: {
    chartOptions,
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
  mixins: [loadLocChildMixin],
  data() {
    return {
      dataMappingKey: "mainMapping",
      chartType: "column",
      chartTypeOptions: [],
      isPercentageChart: false,
      periodTypeList: [],
      periodType: null,
      selectedPeriod: [],
      currentYear: new Date().getFullYear(),
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
      source: "N/A",
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
      configireBtn: false,
      dataOptions: [],
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
    dataSource(newValue) {
      let text = "";
      if (newValue === "indicators") {
        text = "Indicator Group";
      }
      if (newValue === "dataElements") {
        text = "Data Element Group";
      }
      if (newValue === "dataSets") {
        text = "Data Set Group";
      }
      if (newValue === "eventDataItems" || newValue === "programIndicators") {
        text = "Program";
      }
      this.dataSourceText = text;
      if (this.allData[this.dataSource]["selectedSourceGroup"]) {
        let isFound = this.allData[this.dataSource]["dataSourceGroup"].find(
          (d) => d.id === this.allData[this.dataSource]["selectedSourceGroup"]
        );
        if (isFound) {
          this.dataSourceGroup = isFound.id;
        }
      }
      this.selectedData = [];
      if (this.$route.query.bookmarkChart && !this.isDrillDown) {
        let data = JSON.parse(localStorage.getItem("bookmarkChart"));
        if (data.dataSource === newValue) {
          this.getDataSourceGroup();
        }
      }
      this.getDataSource(newValue);
      this.getDataSourceGroup();
    },
  },
  computed: {
    periodList() {
      let pList = [];
      if (this.periodType === "yearly") {
        for (let i = this.currentYear; i > this.currentYear - 10; i--) {
          pList.push({ id: `${i}`, text: `${i}` });
        }
      } else if (
        this.periodType === "financialYear" ||
        this.periodType === "financialYearJuly"
      ) {
        let years =
            this.periodType === "FinancialYear"
              ? ["Mar", "Apr"]
              : ["Jun", "Jul"],
          curYear = this.currentYear;
        if (this.$i18n.locale === "fr") {
          years =
            this.periodType === "FinancialYear"
              ? ["mars", "avril"]
              : ["juin", "juil."];
        }
        // console.log("curYear",curYear)
        for (let i = 1; i <= 10; i++) {
          pList.push({
            id:
              this.periodType === "FinancialYear"
                ? `${curYear}April`
                : `${curYear}July`,
            text:
              years[1] + " " + curYear + " - " + years[0] + " " + (curYear + 1),
          });
          curYear -= 1;
        }
      } else if (this.periodType === "quarterly") {
        let years = {
          Q1: ["Jan", "Mar"],
          Q2: ["Apr", "Jun"],
          Q3: ["Jul", "Sep"],
          Q4: ["Oct", "Dec"],
        };
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
              " - " +
              years[`Q${i}`][1] +
              " " +
              this.currentYear,
          });
        }
        pList.reverse();
      } else {
        let years = [
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
        ];
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
      return this.periodTypeList.find((p) => p.value === this.periodType).text;
    },
    dataList() {
      let list = this.allData[this.dataSource]["data"]["list"];
      if (list) {
        list = list.filter((l) => {
          let isFound = this.selectedData.find((sd) => sd.id === l.id);
          let isFiltered = this.dataSearchText
            ? l.name.toLowerCase().includes(this.dataSearchText.toLowerCase())
            : true;
          if (!isFound && isFiltered) {
            return l;
          }
        });
        return list;
      }
    },
  },
  methods: {
    changeType(type, isPercentageChart) {
      this.chartType = type;
      this.isPercentageChart = isPercentageChart;

      if (type === "pie") {
        this.filterLayout = this.filterLayout.filter((f) => f.id !== "co");
        console.log("2");
        this.seriesLayout = this.seriesLayout.filter((f) => f.id !== "co");
        this.categoryLayout.forEach((c) => {
          if (c.id !== "co") {
            this.filterLayout.push(c);
          }
        });
        this.assignedCatLayout = [
          { id: "co", text: this.$i18n.t("assignedCategory") },
        ];
        // console.log(this.filterLayout)
        this.$nextTick(() => (this.categoryLayout = []));
      } else {
        if (!this.dataFetched) {
          if (this.$route.query.bookmarkChart) {
            let savedBookmarkData = JSON.parse(
              localStorage.getItem("bookmarkChart")
            );
            console.log("3");

            this.seriesLayout = savedBookmarkData.seriesLayout;
            this.categoryLayout = savedBookmarkData.categoryLayout;
            this.filterLayout = savedBookmarkData.filterLayout;
          } else {
            console.log("4");

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
      console.log("getDataSource", value);
      this.dataSource = value;
      // if (this.dataSource !== "dataElements") {
      if (!(this.$route.query.bookmarkChart && !this.isDrillDown)) {
        console.log("5");
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
      // console.log(this.chartData);
      //debugger
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
      let key = this.generateKey("interactive");
      let allKeys = service.getAllKeys();
      allKeys.then((keys) => {
        // console.log(keys);
        // console.log(key);
        if (keys.data.includes(key)) {
          let saveConfig = service.getSavedConfig(key);
          saveConfig.then(async (res) => {
            // console.log(res.data);
            if (this.$route.query.bookmarkChart) {
              const { value: yesNo } = await this.$swal({
                title: this.$i18n.t("bookmarkName", {
                  name: JSON.parse(localStorage.getItem("bookmarkChart")).name,
                }),
                input: "select",
                inputOptions: {
                  no: this.$i18n.t("no"),
                  yes: this.$i18n.t("yes"),
                },
                type: "question",
                inputPlaceholder: this.$i18n.t("changeName"),
                showCancelButton: true,
                confirmButtonText: this.$i18n.t("submitbtn"),
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
                  confirmButtonText: this.$i18n.t("submitbtn"),
                }).then((result) => {
                  // console.log(result)
                  if (result.value) {
                    this.$store.state.loading = true;
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
                    let response = service.updateConfig(allBookmarks, key);
                    response.then((response) => {
                      this.showAlert(response);
                    });
                  }
                });
              }
              if (yesNo === "no") {
                this.$store.state.loading = true;
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
                let response = service.updateConfig(allBookmarks, key);
                response.then((response) => {
                  this.showAlert(response);
                });
              }
            } else {
              this.saveBookmark(res);
            }
          });
        } else {
          this.$swal({
            title: this.$i18n.t("nameYourBookmark"),
            input: "text",
            showCancelButton: true,
            confirmButtonText: this.$i18n.t("submitbtn"),
          }).then((result) => {
            // console.log(result)
            if (result.value) {
              this.$store.state.loading = true;
              let interactiveBookmarks = [
                this.getFirstBookmarkObj(result.value),
              ];
              let response = service.saveConfig(interactiveBookmarks, key);
              response.then((response) => {
                this.showAlert(response);
              });
            }
          });
        }
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
      let role = "";
      this.loggedInUser.userCredentials.userRoles.forEach((u) => {
        if (settings.userRole.includes(u.name)) {
          role = u.name;
        }
      });
      let randomStr = randomString(16);
      return {
        id: randomStr,
        i: randomStr, //Required in dynamic module creation ["vue-grid-layout" plugin]
        name: name,
        user: this.loggedInUser.userCredentials.id,
        userName: this.loggedInUser.firstName + " " + this.loggedInUser.surname,
        isAdmin: role ? true : false,
        isNotAdmin: role ? false : true,
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
      };
    },
    saveBookmark(res) {
      let key = this.generateKey("interactive");

      this.$swal({
        title: this.$i18n.t("nameYourBookmark"),
        input: "text",
        showCancelButton: true,
        confirmButtonText: this.$i18n.t("submitbtn"),
      }).then((result) => {
        // console.log(result)
        // console.log(res)
        if (result.value) {
          this.$store.state.loading = true;
          let isName = null;
          // console.log(typeof res.data)

          isName =
            res.data &&
            Array.isArray(res.data) &&
            res.data.find((d) => d.name === result.value);

          if (isName) {
            this.$swal({
              title: this.$i18n.t("error"),
              text: this.$i18n.t("duplicateName"),
            });
            this.$store.state.loading = false;
          } else {
            let bookmark = this.getFirstBookmarkObj(result.value);
            let allBookmarks = res.data;
            allBookmarks.push(bookmark);
            let response = service.updateConfig(allBookmarks, key);
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
        this.$store.state.loading = false;
      } else {
        this.$swal({
          title: this.$i18n.t("error"),
          text: `${response.data.message}`,
        });
        this.$store.state.loading = false;
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
      console.log("renamedObj from service", renamedObj);
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
      // console.log("drag id",id)
      this.dragDropDetails = `${id}_${layout}`;
      // event.dataTransfer.setData("transferData", );
    },
    drop(layout) {
      // console.log("drop id",event.target.id)
      // let data = event.dataTransfer.getData("transferData");
      let data = this.dragDropDetails;
      // console.log("data", data)
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
      console.log("seriesLayout", this.seriesLayout);
      console.log("categoryLayout", this.categoryLayout);
      console.log("filterLayout", this.filterLayout);
      if (this.seriesLayout.length === 0) {
        this.$swal({
          title: this.$i18n.t("error"),
          text: this.$i18n.t("seriesError"),
        });
      } else {
        if (this.categoryLayout.length === 0 && this.chartType !== "pie") {
          this.$swal({
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
                // console.log("this.dataSource", this.dataSource);
                console.log("this.selectedData", this.selectedData);
                console.log("this.selectedPeriod", this.selectedPeriod);
                console.log("this.selectedLocation", this.selectedLocation);
                // console.log("this.selectedFacility", this.selectedFacility);
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
                // console.log("facilities", facilities);
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
                // console.log(this.categoryLayout)
                // console.log(isDualAxes)
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
                this.categoryLayout.forEach((c, i) => {
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
                // console.log("dimensions",dimensions)
                // console.log("filters",filters)
                this.table = {
                  items,
                  fields,
                };
                // console.log("fields",this.table)
                let drillDownObj = {};
                let drillDownDX = [];
                if (this.isDrilldownAdded) {
                  // console.log("this.selectedDrilldownData",this.selectedDrilldownData)
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
                  // console.log("drillDownObj",drillDownObj)
                  // console.log("drillDownDX",drillDownDX)
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
                // console.log("dimensions", dimensions);
                // console.log("filters", filters);
                let data = service.getInteractiveData(dimensions, filters);
                // console.log(data)
                data
                  .then((response) => {
                    // console.log("res",response.data);

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
                      this.facilityDimension
                    );
                    // console.log("items",items)
                    // console.log("fields",fields)
                    // console.log("chartOptions",chartOptions)
                    // return
                    let finalData = chartOptions;
                    // console.log("this.indicatorsColors",this.indicatorsColors)
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
                    // console.log("finalData",finalData)
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
                }</b></td></tr>`;

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
                    this.$swal({
                      title: this.$i18n.t("error"),
                      text: res.response.data.message,
                    });
                  });
              } else {
                this.$swal({
                  title: this.$i18n.t("error"),
                  text: this.$i18n.t("orgError"),
                });
              }
            } else {
              this.$swal({
                title: this.$i18n.t("error"),
                text: this.$i18n.t("periodError"),
              });
            }
          } else {
            this.$swal({
              title: this.$i18n.t("error"),
              text: this.$i18n.t("dataElementError"),
            });
          }
        }
      }
    },
    updateOptions(updated) {
      console.log("updated", updated);
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
        // console.log("p",p)
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
      // console.log("called");
      let facilities = service.getDimensions();
      facilities
        .then((response) => {
          // console.log(response)
          this.facilityDimension = response.data.dimensions.find(
            (r) =>
              r.name === "Facility Ownership" ||
              r.name.includes("OrgUnit Ownership") //OrgUnit Ownership
          );
          // console.log(this.facilityDimension)
          if (this.facilityDimension) {
            this.getFacilities();
          }
        })
        .catch(() => {
          console.log("getDimensions failed");
        });
    },
    getFacilities() {
      // console.log("called");
      let facilities = service.getFacilityTypes(this.facilityDimension.id);
      facilities.then((response) => {
        // console.log("facilities",response);
        this.facilityListOriginal = JSON.parse(
          JSON.stringify(response.data.items)
        );
      });
    },
    setData() {
      this.dataFetched = true;
      let savedBookmarkData = JSON.parse(localStorage.getItem("bookmarkChart"));
      // console.log("savedBookmarkData",savedBookmarkData)
      this.selectedDrilldownData = savedBookmarkData.selectedDrilldownData;
      console.log("6");

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
      // console.log("savedBookmarkData",this.selectedDrilldownData)
      this.chartType =
        typeof savedBookmarkData.chartType !== "undefined"
          ? savedBookmarkData.chartType
          : savedBookmarkData.chartData.chart.oType;
      this.isPercentageChart =
        typeof savedBookmarkData.isPercentageChart !== "undefined"
          ? savedBookmarkData.isPercentageChart
          : false;
      this.periodType = savedBookmarkData.periodType;
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
      console.log(this.$route.query.bookmarkChart);
      if (this.$route.query.bookmarkChart) {
        if (localStorage.getItem("bookmarkChart")) {
          this.setData();
        } else {
          let key = this.generateKey("interactive");

          let saveConfig = service.getSavedConfig(key);
          saveConfig.then((res) => {
            // console.log(res.data);
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
              this.$swal({
                title: this.$i18n.t("oops"),
                text: this.$i18n.t("no_data_to_display"),
              });
            }
          });
        }
      } else {
        console.log("1");
        this.seriesLayout = [{ id: "dx", text: this.$i18n.t("data") }];
        this.categoryLayout = [{ id: "pe", text: this.$i18n.t("period") }];
        this.filterLayout = [
          { id: "ou", text: this.$i18n.t("organizationUnit") },
        ];
        this.assignedCatLayout = [
          { id: "co", text: this.$i18n.t("assignedCategories") },
        ];
      }
    },
    onScroll(e) {
      const { scrollTop, offsetHeight, scrollHeight } = e.target;
      if (scrollTop + offsetHeight >= scrollHeight - 5) {
        if (
          !this.loadMore &&
          this.allData[this.dataSource]["data"]["pager"]["page"] <
            this.allData[this.dataSource]["data"]["pager"]["pageCount"]
        ) {
          this.loadMore = true;
          this.$store.commit("setLoading", true);
          this.getNextPage(
            this.allData[this.dataSource]["data"]["pager"]["page"] * 1 + 1,
            true
          );
        }
      }
    },
    setDataSource(dataSourceGroup) {
      this.dataSourceGroup = dataSourceGroup.id;
      this.dataSourceText = dataSourceGroup.name;
      this.allData[this.dataSource]["data"]["pager"]["page"] = 0;
      this.allData[this.dataSource]["data"]["pager"]["pageCount"] = 0;
      this.getData();
    },
    getDataSourceGroup() {
      console.log("this.allData", this.allData);
      this.$store.commit("setLoading", true);
      this.dataSourceGroupList = [];
      if (this.allData[this.dataSource]["dataSourceGroup"].length) {
        this.dataSourceGroupList =
          this.allData[this.dataSource]["dataSourceGroup"];
        this.dataSourceGroup =
          this.allData[this.dataSource]["selectedSourceGroup"];
        this.$store.commit("setLoading", false);
        if (this.$route.query.bookmarkChart && !this.isDrillDown) {
          this.dataSourceGroup = JSON.parse(
            localStorage.getItem("bookmarkChart")
          ).dataSourceGroup;
          this.getData();
        } else if (this.isDrillDown && this.editDrillDownData) {
          this.dataSourceGroup = this.editDrillDownData.dataSourceGroup;
        }
      } else {
        let page =
          this.dataSource === "dataSets"
            ? this.allData[this.dataSource]["data"]["pager"]["page"] * 1 + 1
            : 1;
        console.log("page", page);
        let indicatorGroups = service.getDataSourceGroupsNew(
          this.dataSource,
          page
        );
        indicatorGroups.then((response) => {
          console.log(this.dataSource, response);
          if (this.dataSource === "indicators") {
            // let allowedList = ["HMIS- Maternal Health", "RMNCH Scorecard"]
            // this.dataSourceGroupList = response.data.indicatorGroups.filter(l => allowedList.includes(l.name))
            this.allData[this.dataSource]["dataSourceGroup"] =
              response.data.indicatorGroups;
            this.dataSourceGroupList = response.data.indicatorGroups;
            this.dataSourceGroupList.unshift({
              id: "All",
              name: "[All Indicators]",
            });
          }
          if (this.dataSource === "dataElements") {
            // let allowedList = ["HMIS-MAAR- All data elements of Family Planning", "HMIS-MAAR- All data elements of Maternal Health", "HMIS-MIAR- All data elements of Maternal & Neonatal Care"]
            // this.dataSourceGroupList = response.data.dataElementGroups.filter(l => allowedList.includes(l.name))
            this.allData[this.dataSource]["dataSourceGroup"] =
              response.data.dataElementGroups;
            this.dataSourceGroupList = response.data.dataElementGroups;
            this.dataSourceGroupList.unshift({
              id: "All",
              name: "[All Data Elements]",
            });
          }
          if (this.dataSource === "dataSets") {
            this.dataSourceGroupList = this.dSourceGroupList;
            this.allData[this.dataSource]["dataSourceGroup"] =
              this.dSourceGroupList;
            let originalDSets = [];
            response.data.dataSets.forEach((d) => {
              this.dSourceGroupList.forEach((ds) => {
                if (ds.alias !== "ALL") {
                  originalDSets.push({
                    ...d,
                    id: d.id + "." + ds.alias,
                    name: d.name + " (" + ds.name + ")",
                    dataSourceGroup: ds.name,
                  });
                }
              });
            });
            if (response.data.pager) {
              this.allData[this.dataSource]["data"]["pager"]["page"] = page;
              this.allData[this.dataSource]["data"]["pager"]["pageCount"] =
                response.data.pager.pageCount;
            }
            this.originalDataSets = originalDSets;
          }
          if (this.dataSource === "eventDataItems") {
            this.allData[this.dataSource]["dataSourceGroup"] =
              response.data.programs;
            this.allData["programIndicators"]["dataSourceGroup"] =
              response.data.programs;
            this.dataSourceGroupList = response.data.programs;
          }
          if (this.dataSource === "programIndicators") {
            this.allData["eventDataItems"]["dataSourceGroup"] =
              response.data.programs;
            this.allData[this.dataSource]["dataSourceGroup"] =
              response.data.programs;
            this.dataSourceGroupList = response.data.programs;
          }

          this.$store.commit("setLoading", false);
          if (this.$route.query.bookmarkChart && !this.isDrillDown) {
            this.dataSourceGroup = JSON.parse(
              localStorage.getItem("bookmarkChart")
            ).dataSourceGroup;
          } else if (this.isDrillDown && this.editDrillDownData) {
            this.dataSourceGroup = this.editDrillDownData.dataSourceGroup;
          }
          //this.getData();
        });
      }
      this.dataSourceGroup = "All";
      this.allData[this.dataSource]["data"]["pager"]["page"] = 0;
      this.allData[this.dataSource]["data"]["pager"]["pageCount"] = 0;
      this.getData();
    },
    moveData({ type, data = "all" }) {
      if (type === "+") {
        if (data === "all") {
          this.selectedData = [...this.selectedData, ...this.dataList];
        } else {
          this.selectedData.push(data);
        }
      } else {
        if (data === "all") {
          this.selectedData = [];
        } else {
          this.selectedData = this.selectedData.filter((p) => p.id !== data.id);
        }
      }
    },
    getData() {
      this.allData[this.dataSource]["selectedSourceGroup"] =
        this.dataSourceGroup;
      this.$store.commit("setLoading", true);
      if (this.dataSource === "dataSets") {
        if (this.dataSourceGroup === "[All metrics]") {
          this.allData[this.dataSource]["data"]["list"] = this.originalDataSets;
        } else {
          this.allData[this.dataSource]["data"]["list"] =
            this.originalDataSets.filter(
              (d) => d.dataSourceGroup === this.dataSourceGroup
            );
        }
        if (this.$route.query.bookmarkChart && !this.isDrillDown) {
          this.selectedData = JSON.parse(
            localStorage.getItem("bookmarkChart")
          ).selectedData;
        } else if (this.isDrillDown && this.editDrillDownData) {
          this.selectedData = this.editDrillDownData.selectedData;
        }
        this.$store.commit("setLoading", false);
      } else {
        let page =
          this.allData[this.dataSource]["data"]["pager"]["page"] * 1 + 1 || 1;
        console.log("page", page);
        this.getNextPage(page);
      }
    },
    getNextPage(page, isAppend = false) {
      let indicators = service.getFilteredDataNew(
        this.dataSource,
        this.dataSourceGroup,
        page
      );
      indicators.then((response) => {
        if (this.dataSource === "indicators") {
          this.allData[this.dataSource]["data"]["list"] = isAppend
            ? this.allData[this.dataSource]["data"]["list"].concat(
                response.data.indicators
              )
            : response.data.indicators;
        }
        if (this.dataSource === "dataElements") {
          this.allData[this.dataSource]["data"]["list"] = isAppend
            ? this.allData[this.dataSource]["data"]["list"].concat(
                response.data.dataElements
              )
            : response.data.dataElements;
        }
        if (this.dataSource === "eventDataItems") {
          this.allData[this.dataSource]["data"]["list"] = isAppend
            ? this.allData[this.dataSource]["data"]["list"].concat(
                response.data.programDataElements
              )
            : response.data.programDataElements;
        }
        if (this.dataSource === "programIndicators") {
          this.allData[this.dataSource]["data"]["list"] = isAppend
            ? this.allData[this.dataSource]["data"]["list"].concat(
                response.data.programIndicators
              )
            : response.data.programIndicators;
        }
        if (response.data.pager) {
          this.allData[this.dataSource]["data"]["pager"]["page"] = page;
          this.allData[this.dataSource]["data"]["pager"]["pageCount"] =
            response.data.pager.pageCount;
        }
        this.loadMore = false;
        if (this.$route.query.bookmarkChart && !this.isDrillDown) {
          this.selectedData = JSON.parse(
            localStorage.getItem("bookmarkChart")
          ).selectedData;
        } else if (this.isDrillDown && this.editDrillDownData) {
          this.selectedData = this.editDrillDownData.selectedData;
        }
        this.$store.commit("setLoading", false);
      });
    },
	UpdateSelectedList(){
		let key = this.generateKey("selectedInd");
        let allKeys = service.getAllKeys();
        allKeys
          .then((keys) => {
			console.log(keys);
            if (keys.data.includes(key)) {
              let saveConfig = service.getSavedConfig(key);
              saveConfig.then((res) => {
                let configData = res.data;
                console.log("configData",configData);
                  configData[this.dataSource] = this.selectedData;
                let configChanges = audit.configAudit(
                  this.originalData,
                  configData[this.dataSource]
                );
                console.log("configChanges", configChanges)
                let response = service.updateConfig(configData, key);
                response
                  .then((response) => {
					console.log(response)
                    if (response.data.status === "OK") {
                      // console.log("response update ", response.data)
                      this.$swal({
                        title: this.$i18n.t("data_saved_successfully"),
                      }).then(() => {
                        if (Object.keys(configChanges).length) {
                          audit.processAudit(
                            "process2",
                            key,
                            configChanges,
                          );
                        }
                      });
                    //   this.getConfigData();
                      this.$store.state.loading = false;
                    } else {
                      this.$swal({
                        title: this.$i18n.t("error"),
                        text: `${response.data.message}`,
                      });
                      this.$store.state.loading = false;
                      return;
                    }
                  })
                  .catch((error) => {
                    this.$swal({
                      title: this.$i18n.t("error"),
                    });
                    this.$store.state.loading = false;
                    return;
                  });
              });
            } else {
              let ministrial = {
                [this.dataSource]: this.selectedData,
              };
			  console.log(ministrial)
              let response = service.saveConfig(ministrial, key);
              response.then((response) => {
                if (response.data.status === "OK") {
                  // console.log("response save ", response.data)
                  this.$swal({
                    title: this.$i18n.t("data_saved_successfully"),
                  });
                //   this.getConfigData();
                  this.$store.state.loading = false;
                } else {
                  this.$swal({
                    title: this.$i18n.t("error"),
                    text: `${response.data.message}`,
                  });
                  this.$store.state.loading = false;
                  return;
                }
              });
            }
          })
          .catch(() => {
            this.$store.state.loading = false;
          });
	}
  },
  created() {
	console.log(audit)
    console.log("isDrillDown", this.isDrillDown);
    console.log("editDrillDownData", this.editDrillDownData);
    if (this.$route.query.bookmarkChart && !this.isDrillDown) {
      let data = JSON.parse(localStorage.getItem("bookmarkChart"));
      this.dataSource = data.dataSource;
      this.getDataSourceGroup();
    } else if (this.isDrillDown && this.editDrillDownData) {
      console.log("editDrillDownData", this.editDrillDownData);
      this.dataSource = this.editDrillDownData.dataSource;
      this.getDataSourceGroup();
    } else {
      this.dataSource = "indicators";
    }
    this.dataOptions = [
      {
        id: 1,
        value: "indicators",
        text: this.$i18n.t("indicators"),
      },
      {
        id: 2,
        value: "dataElements",
        text: this.$i18n.t("dataElements"),
      },
      {
        id: 3,
        value: "dataSets",
        text: this.$i18n.t("dataSets"),
      },
      {
        id: 4,
        value: "eventDataItems",
        text: this.$i18n.t("eventDataItems"),
      },
      {
        id: 5,
        value: "programIndicators",
        text: this.$i18n.t("programIndicators"),
      },
    ];
    this.chartTypeOptions = [
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
        icon: "column_stacked",
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
        icon: "bar_stacked",
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

    this.periodTypeList = [
      { value: "monthly", text: this.$i18n.t("monthly") },
      { value: "quarterly", text: this.$i18n.t("quarterly") },
      { value: "yearly", text: this.$i18n.t("yearly") },
    ];
    if (this.$store.state.financialYear.includes("April")) {
      this.periodTypeList.push({
        value: "financialYear",
        text: this.$i18n.t("financialYear"),
      });
    }
    if (this.$store.state.financialYear.includes("July")) {
      this.periodTypeList.push({
        value: "financialYearJuly",
        text: this.$i18n.t("financialYearJuly"),
      });
    }
    this.periodType = "monthly";
    this.dataCalls();
  },
};
</script>
<style lang="scss">
.data-source-group-list {
  height: 200px;
  overflow: auto;
}
</style>
