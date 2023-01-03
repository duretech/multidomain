<template>
  <div class="mdgridviewpage-bg mapIndiBg">
    <div class="filter-btn" @click.prevent="showToolbarOnTablet = true">
      <a href="#" id="tabbar-expand">
        <i class="fas fa-filter"></i>
      </a>
    </div>
    <Header
      :headerConditions="{
        home: true,
        profile: false,
        pageTitle: true,
        dashboardLogo: true,
      }"
      @langChange="langChange"
      @activateTour="activateTour"
    >
      <template v-slot:admin>
        <button
          type="button"
          class="btn btn-primary black-btn"
          @click.prevent.stop="exportPPT"
          v-if="showExportButton"
          style="border: 2px solid #fff"
        >
          {{ $t("exportbtn") }}
        </button>
      </template>
    </Header>
    <div class="container-fluid">
      <div class="row m-t-20px dashboardchart-container mapheight pb-5">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body p-0 map_cardBody">
              <div class="row">
                <div class="col-md-3 pr-0">
                  <div class="left_menu">
                    <div
                      class="nav-side-menu"
                      style="border-right: 1px solid rgba(0, 0, 0, 0.12)"
                    >
                      <div class="menu-list">
                        <div class="top_menu">
                          <ul class="nav">
                            <li class="nav-item">
                              <a
                                class="nav-link"
                                href="javascript:void(0)"
                                :style="{
                                  color:
                                    activeTab === 'map' ? '#03a9a4' : '#17a2b8',
                                  'background-color':
                                    activeTab === 'map' ? '#343361' : '#2e2e48',
                                }"
                                v-b-tooltip.hover
                                :title="this.$i18n.t('mapViewIcon')"
                              >
                                <img
                                  alt="img"
                                  v-if="activeTab === 'map'"
                                  :src="require('@/assets/img/map.png')"
                                  @click="mapview" />
                                <img
                                  alt="img"
                                  v-else
                                  :src="require('@/assets/img/mapover.png')"
                                  @click="mapview"
                              /></a>
                            </li>
                            <li class="nav-item" v-if="$store.state.appId == 6">
                              <a
                                disabled
                                class="nav-link"
                                href="javascript:void(0)"
                                :style="{
                                  color:
                                    activeTab === 'district'
                                      ? '#03a9a4'
                                      : '#17a2b8',
                                  'background-color':
                                    activeTab === 'district'
                                      ? '#343361'
                                      : '#2e2e4',
                                }"
                                v-b-tooltip.hover
                                title="District view"
                              >
                                <img
                                  alt="img"
                                  v-if="activeTab === 'district'"
                                  :src="require('@/assets/img/district.png')"
                                  @click="mapDistrictview"
                                />
                                <img
                                  alt="img"
                                  v-else
                                  :src="
                                    require('@/assets/img/districtover.png')
                                  "
                                  @click="mapDistrictview"
                                />
                              </a>
                            </li>
                            <li class="nav-item" v-if="$store.state.appId == 6">
                              <a
                                disabled
                                class="nav-link"
                                href="javascript:void(0)"
                                :style="{
                                  color:
                                    activeTab === 'mpvDistrict'
                                      ? '#03a9a4'
                                      : '#17a2b8',
                                  'background-color':
                                    activeTab === 'mpvDistrict'
                                      ? '#fff'
                                      : '#747474',
                                }"
                                v-b-tooltip.hover
                                title="MPV district"
                              >
                                <img
                                  alt="img"
                                  v-if="activeTab === 'mpvDistrict'"
                                  :src="require('@/assets/img/mpv.png')"
                                  @click="mpvdistrict"
                                />
                                <img
                                  alt="img"
                                  v-else
                                  :src="require('@/assets/img/mpvover.png')"
                                  @click="mpvdistrict"
                                />
                              </a>
                            </li>
                            <li class="nav-item" v-if="$store.state.appId == 6">
                              <a
                                disabled
                                class="nav-link"
                                href="javascript:void(0)"
                                :style="{
                                  color:
                                    activeTab === 'adDistrict'
                                      ? '#03a9a4'
                                      : '#17a2b8',
                                  'background-color':
                                    activeTab === 'adDistrict'
                                      ? '#fff'
                                      : '#747474',
                                }"
                                v-b-tooltip.hover
                                title="AD district"
                              >
                                <img
                                  alt="img"
                                  v-if="activeTab === 'adDistrict'"
                                  :src="require('@/assets/img/adress.png')"
                                  @click="apdistrict"
                                />
                                <img
                                  alt="img"
                                  v-else
                                  :src="require('@/assets/img/adressover.png')"
                                  @click="apdistrict"
                                />
                              </a>
                            </li>
                            <li class="nav-item" v-if="$store.state.appId == 6">
                              <a
                                disabled
                                class="nav-link"
                                href="javascript:void(0)"
                                :style="{
                                  color:
                                    activeTab === 'samarthDistrict'
                                      ? '#2e2e48'
                                      : '#2e2e48',
                                  'background-color':
                                    activeTab === 'samarthDistrict'
                                      ? '#fff'
                                      : '#2e2e48',
                                }"
                                v-b-tooltip.hover
                                title="Samarth district"
                              >
                                <img
                                  alt="img"
                                  v-if="activeTab === 'samarthDistrict'"
                                  :src="require('@/assets/img/Srh.png')"
                                  @click="samrtdistrict"
                                />
                                <img
                                  alt="img"
                                  v-else
                                  :src="require('@/assets/img/srhover.png')"
                                  @click="samrtdistrict"
                                />
                              </a>
                            </li>
                            <li class="nav-item">
                              <a
                                disabled
                                class="nav-link"
                                href="javascript:void(0)"
                                :style="{
                                  color:
                                    activeTab === 'chart' &&
                                    splitViewType == 'chart'
                                      ? '#2e2e48'
                                      : '#fff',
                                  'background-color':
                                    activeTab === 'chart' &&
                                    splitViewType == 'chart'
                                      ? '#fff'
                                      : '#2e2e48',
                                }"
                                v-b-tooltip.hover
                                :title="this.$i18n.t('chartViewIcon')"
                                @click="splitView('chart')"
                              >
                                <i
                                  class="fa fa-pie-chart"
                                  aria-hidden="true"
                                  v-if="activeTab === 'chart'"
                                ></i>
                                <i
                                  class="fa fa-pie-chart"
                                  aria-hidden="true"
                                  v-else
                                ></i>
                              </a>
                            </li>
                          </ul>
                        </div>
                        <template v-if="menustructure.length != 0">
                          <ul
                            class="menu-content collapse"
                            v-for="(groupvalue, index) in menustructure"
                            :key="index"
                          >
                            <div
                              class="brand fs-19-1920"
                              v-if="
                                groupvalue.subGroups.length != 0 &&
                                groupvalue.visible
                              "
                            >
                              {{ groupvalue.name }}
                            </div>
                            <template
                              v-if="
                                groupvalue.subGroups.length != 0 &&
                                groupvalue.visible
                              "
                            >
                              <template
                                v-for="(item, i) in groupvalue.subGroups"
                              >
                                <li
                                  :key="i"
                                  data-toggle="collapse"
                                  :data-target="'#menuitem' + item.id"
                                  class="fs-18-1920"
                                  :class="
                                    item.indicators.filter(
                                      (o) => o.subIndicator[0].name == indiName
                                    ).length > 0 || index == 0
                                      ? 'collapsed'
                                      : ''
                                  "
                                  :aria-expanded="index == 0 ? true : false"
                                  v-if="
                                    item.indicators.length != 0 && item.visible
                                  "
                                >
                                  <div
                                    class="d-flex justify-content-between fs-18-1920 map-firstitem"
                                  >
                                    <a href="javascript:void(0)">{{
                                      item.name
                                    }}</a>
                                    <span class="arrow"></span>
                                  </div>
                                  <ul
                                    class="sub-menu collapse fs-18-1920 map-activeitem"
                                    :id="'menuitem' + item.id"
                                    v-if="item.visible"
                                    :class="
                                      item.indicators.filter(
                                        (o) =>
                                          o.subIndicator[0].name == indiName
                                      ).length > 0 || index == 0
                                        ? 'show'
                                        : ''
                                    "
                                  >
                                    <template v-if="item.indicators.length">
                                      <li
                                        v-for="(
                                          items, index
                                        ) in item.indicators"
                                        :key="index"
                                      >
                                        <a
                                          :style="{
                                            color:
                                              isLoading ==
                                              items.subIndicator[0].de
                                                ? '#3471CE'
                                                : '#000',
                                          }"
                                          class="fs-17-1920"
                                          href="javascript:void(0)"
                                          @click.prevent.stop="
                                            getIndMapView(
                                              items.subIndicator[0].de,
                                              items.levels,
                                              null,
                                              null,
                                              viewType,
                                              items.name,
                                              items.source
                                            )
                                          "
                                          > <span class="ml-4">{{ items.name }} </span></a
                                        >
                                       
                                      </li>
                                    </template>
                                  </ul>
                                </li>
                              </template>
                            </template>
                          </ul>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 px-0" v-show="splitViewType === 'map'">
                  <bubble-Map
                    v-if="
                      mapObj &&
                      mapObj.indiId &&
                      mapConfigData &&
                      childrens &&
                      $store.state.appId &&
                      $store.state.appId == 6
                    "
                    :defaultLevelID="defaultLevelID"
                    :defaultLocationID="defaultLocationID"
                    :subLevelID="subLevelID"
                    :period="period"
                    :mapObj="mapObj"
                    ref="map"
                    :mapConfigData="newMapConfigData"
                    :locationChanged="locationChanged"
                    :viewType="viewType"
                    :defaultView="defaultView"
                    :mapData="mapConfigData"
                    :globalData="globalMapConfigData"
                    :globalRightData="globalRightMenuData"
                    :toolbarLevelID="toolbarLevelID"
                    :toolbarLocationID="toolbarLocationID"
                    :facilityLevelID="facilityLevelID"
                    :viewflag="viewflag"
                    @setLocationOnReset="setLocationOnReset"
                    :childrens="childrens"
                    @bubbleCurrentYearFunction="bubbleCurrentYearFunction"
                    @scales="getScales"
                    @mapLoaded="mapLoaded"
                    :countryGeoJson="countryGeoJson"
                    :orgUnitLevels="orgUnitLevels"
                    :pType="pType"
                    :districtParentGeo="districtParentGeo"
                    @noGeoJson="noGeoJson"
                  />
                  <bubble-Map
                    v-if="
                      mapObj &&
                      mapObj.indiId &&
                      mapConfigData &&
                      settings.countryName !== 'India' &&
                      settings.countryName !== 'india'
                    "
                    :defaultLevelID="defaultLevelID"
                    :defaultLocationID="defaultLocationID"
                    :subLevelID="subLevelID"
                    :period="period"
                    :mapObj="mapObj"
                    ref="map"
                    :mapConfigData="newMapConfigData"
                    :locationChanged="locationChanged"
                    :viewType="viewType"
                    :defaultView="defaultView"
                    :mapData="mapConfigData"
                    :globalData="globalMapConfigData"
                    :globalRightData="globalRightMenuData"
                    :toolbarLevelID="toolbarLevelID"
                    :toolbarLocationID="toolbarLocationID"
                    :facilityLevelID="facilityLevelID"
                    :viewflag="viewflag"
                    @setLocationOnReset="setLocationOnReset"
                    :childrens="childrens"
                    @bubbleCurrentYearFunction="bubbleCurrentYearFunction"
                    @scales="getScales"
                    @mapLoaded="mapLoaded"
                    :countryGeoJson="countryGeoJson"
                    :orgUnitLevels="orgUnitLevels"
                    :pType="pType"
                    :districtParentGeo="districtParentGeo"
                    @noGeoJson="noGeoJson"
                  />
                </div>
                <div class="col-md-6 px-0" v-show="splitViewType === 'chart'">
                  <chart-view
                    v-if="rightsidemapconfigdata && periodList"
                    @setView="setView"
                    :data="rightsidemapconfigdata"
                    :periodList="periodList"
                    :indiName="indiName"
                  />
                </div>
                <div class="col-md-3 pl-0">
                  <div class="right_menu">
                    <div class="nav-side-menu">
                      <div class="searchbox">
                        <div class="form-group has-search fs-15-1920">
                          <span
                            class="fa fa-search form-control-feedback"
                          ></span>
                          <input
                            type="text"
                            class="form-control"
                            :placeholder="this.$i18n.t('search')"
                            v-model="menulistsearch"
                          />
                        </div>
                      </div>

                      <div
                        class="menu-list"
                        v-if="
                          period &&
                          rightsidemapconfigdata &&
                          rightsidemapconfigdata[period]
                        "
                      >
                        <ul
                          id="menu-content"
                          class="menu-content collapse out"
                          v-for="(itemmap, i) in rightsidemapconfigdatafilter"
                          :key="i"
                        >
                          <li
                            class="row position-relative"
                            style="cursor: context-menu"
                          >
                            <a
                              href="#"
                              class="col-9 px-0 text-truncate fs-17-1920"
                              style="cursor: context-menu"
                            >
                              <i class="fa fa-file-text-o fa-lg mr-2"></i>
                              {{ itemmap.name }}
                              <span
                                v-if="
                                  itemmap.parent &&
                                  itemmap.parent != 'All India' &&
                                  itemmap.parent != 'FP Generic'
                                "
                              >
                                ({{ itemmap.parent }})
                              </span>
                              <span v-if="itemmap.group && itemmap.group != ''">
                                ({{ itemmap.group }})
                              </span>
                            </a>

                            <template
                              v-if="scales"
                              class="col-2 px-0 text-center"
                            >
                              <span
                                :id="'badgeNumberPosition0' + i"
                                class="badge badge-dark badgeNumberPosition fs-14-1920"
                                v-if="
                                  itemmap.value >= scales[0]['lowScale'] &&
                                  itemmap.value <= scales[0]['highScale']
                                "
                                :style="{
                                  backgroundColor: scales[0]['scaleColor'],
                                }"
                              >
                                {{ itemmap.value }}
                              </span>
                              <span
                                :id="'badgeNumberPosition1' + i"
                                class="badge badge-dark badgeNumberPosition fs-14-1920"
                                v-else-if="
                                  itemmap.value >= scales[1]['lowScale'] &&
                                  itemmap.value <= scales[1]['highScale']
                                "
                                :style="{
                                  backgroundColor: scales[1]['scaleColor'],
                                }"
                              >
                                {{ itemmap.value }}
                              </span>
                              <span
                                :id="'badgeNumberPosition2' + i"
                                class="badge badge-dark badgeNumberPosition fs-14-1920"
                                v-else-if="
                                  itemmap.value >= scales[2]['lowScale'] &&
                                  itemmap.value <= scales[2]['highScale']
                                "
                                :style="{
                                  backgroundColor: scales[2]['scaleColor'],
                                }"
                              >
                                {{ itemmap.value }}
                              </span>
                              <span
                                :id="'badgeNumberPosition3' + i"
                                class="badge badgeNumberPosition"
                                v-else-if="
                                  itemmap.value >= scales[3]['lowScale']
                                "
                                :style="{
                                  backgroundColor: scales[3]['scaleColor'],
                                }"
                              >
                                {{ itemmap.value }}
                              </span>
                            </template>
                            <template v-else class="col-2 px-0 text-center">
                              <span
                                class="badge badge-dark badgeNumberPosition fs-14-1920"
                                >{{ itemmap.value }}</span
                              >
                            </template>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- The Modal -->
      <div class="modal fade" id="selectionModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header" style="background: #757575">
              <h4 class="modal-title">Select</h4>
              <button type="button" class="close" data-dismiss="modal">
                &times;
              </button>
            </div>
            <!-- Modal body -->
            <div class="modal-body p-0">
              <section class="d-flex flex-column">
                <div class="my-auto">
                  <!-- <h2 class="mb-5">Accordion Bootstrap 4 with Expand Collapse Icon animation</h2> -->
                  <div
                    id="accordion"
                    role="tablist"
                    aria-multiselectable="true"
                  >
                    <!-- Accordion Item 1 -->
                    <div
                      class="card border-0"
                      style="
                        border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
                        border-radius: 0;
                      "
                    >
                      <div
                        class="card-header border-0"
                        role="tab"
                        id="accordionHeadingOne"
                      >
                        <div class="mb-0 row">
                          <div class="col-12 no-padding accordion-head">
                            <a
                              data-toggle="collapse"
                              data-parent="#accordion"
                              href="#accordionBodyOne"
                              aria-expanded="false"
                              aria-controls="accordionBodyOne"
                              class="collapsed"
                            >
                              <i
                                class="fa fa-angle-down text-dark"
                                aria-hidden="true"
                              ></i>
                              <h5 class="text-dark accordion-heading">
                                Select Location
                              </h5>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div
                        id="accordionBodyOne"
                        class="collapse"
                        role="tabpanel"
                        aria-labelledby="accordionHeadingOne"
                        aria-expanded="false"
                        data-parent="accordion"
                      >
                        <div class="card-block col-12">
                          <div class="form-check">
                            <label class="form-check-label">
                              <input
                                type="checkbox"
                                class="form-check-input"
                                value=""
                              />India
                            </label>
                          </div>
                          <div class="form-check">
                            <label class="form-check-label">
                              <input
                                type="checkbox"
                                class="form-check-input"
                                value=""
                              />Assam
                            </label>
                          </div>
                          <div class="form-check">
                            <label class="form-check-label">
                              <input
                                type="checkbox"
                                class="form-check-input"
                                value=""
                              />Bihar
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- Accordion Item 2 -->
                    <div
                      class="card border-0"
                      style="
                        border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
                        border-radius: 0;
                      "
                    >
                      <div
                        class="card-header border-0"
                        role="tab"
                        id="accordionHeadingTwo"
                      >
                        <div class="mb-0 row">
                          <div class="col-12 no-padding accordion-head">
                            <a
                              data-toggle="collapse"
                              data-parent="#accordion"
                              href="#accordionBodyTwo"
                              aria-expanded="false"
                              aria-controls="accordionBodyTwo"
                              class="collapsed"
                            >
                              <i
                                class="fa fa-angle-down text-dark"
                                aria-hidden="true"
                              ></i>
                              <h5 class="text-dark accordion-heading">
                                Select Year
                              </h5>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div
                        id="accordionBodyTwo"
                        class="collapse"
                        role="tabpanel"
                        aria-labelledby="accordionHeadingTwo"
                        aria-expanded="false"
                        data-parent="accordion"
                      >
                        <div class="card-block col-12">
                          <div class="form-check">
                            <label class="form-check-label">
                              <input
                                type="checkbox"
                                class="form-check-input"
                                value=""
                              />2010 - 2011
                            </label>
                          </div>
                          <div class="form-check">
                            <label class="form-check-label">
                              <input
                                type="checkbox"
                                class="form-check-input"
                                value=""
                              />2012 - 2013
                            </label>
                          </div>
                          <div class="form-check">
                            <label class="form-check-label">
                              <input
                                type="checkbox"
                                class="form-check-input"
                                value=""
                              />2014 - 2015
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <!-- Modal footer -->
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <toolbarComponent
      v-if="globalPeriodData && period && periodList"
      @period="getPeriod"
      @location="getLocation"
      :globalPeriodData="globalPeriodData"
      :locationValue="locationValue"
      :period="period"
      :disabledFilter="true"
      :showIndicator="true"
      :showLocation="true"
      :showYear="true"
      :showSource="true"
      :periodList="periodList"
    />
  </div>
</template>

<script>
/*global settings*/
import service from "@/service";
import emuIndicator from "@/config/emuMapIndicator";
import DocumentTitleMixin from "@/helpers/DocumentTitleMixin";
import LanguageChangeMixin from "@/helpers/LanguageChangeMixin";
import EmitTourCallbackMixin from "@/helpers/EmitTourCallbackMixin";
import toolbarComponent from "@/components/FPDashboard/analytical/filterComponentPeriod";
import chartView from "@/components/FPDashboard/analytical/anchorMap/chartViewComponent.vue";

export default {
  components: {
    bubbleMap: () =>
      import(
        /* webpackChunkName: "mapViz_map"*/ "@/components/FPDashboard/analytical/anchorMap/bubbleAnchorMapindicator.vue"
      ),
    toolbarComponent,
    chartView,
  },
  mixins: [DocumentTitleMixin, LanguageChangeMixin, EmitTourCallbackMixin],
  data() {
    //console.log(emuIndicator)
    let type = null;
    let appId = this.$store.state.appId ? this.$store.state.appId : "",
      appUserId = this.$store.state.appUserId
        ? this.$store.state.appUserId
        : "";
    if (appId && appUserId) {
      type =
        this.$store.state.financialYear.length === 1 &&
        this.$store.state.financialYear.includes("July")
          ? "financialYearJuly"
          : "financialYear";
    } else {
      type = "monthly";
    }

    return {
      emuIndicatorObj: JSON.parse(JSON.stringify(emuIndicator)),
      monthlyEMU: null,
      annualEMU: null,
      districtParentGeo: null,
      pType: type,
      orgUnitLevels: null,
      ougroup: "",
      countryGeoJson: null,
      settings: settings,
      mapLoadedFlag: false,
      indiName: "",
      source: "",
      scales: null,
      splitViewType: "map",
      periodList: [],
      viewType: "map",
      globalPeriodData: null,
      menulistsearch: "",
      facilityLevelID: null,
      debugging: false,
      debuggingLevel: "API",
      showExportButton: false,
      isLoading: "",
      subgroupdata: [],
      indicatordata: [],
      mapConfigData: null,
      newMapConfigData: null,
      rightsidemapconfigdata: null,
      globalMapConfigData: null,
      globalRightMenuData: null,
      mapConfigAvailable: true,
      period: "",
      locationChanged: false,
      resetCurrentLevel: false,
      mapIndicatorName: "Map",
      defaultLevelID: "",
      subLevelID: "",
      toolbarLevelID: "",
      defaultLocationID: "",
      locationValue: "",
      toolbarLocationID: "",
      menustructure: [],
      currentId: "",
      currentLevel: "",
      viewflag: true,
      mpvflag: false,
      districtflag: false,
      samrtflag: false,
      apflag: false,
      defaultView: true,
      countryLevel: "",
      countryLocation: "",
      childrens: null,
      mapObj: {
        indiId: "",
        zoom: 5,
        lat: "",
        lang: "",
      },
      activeTab: "map",
      backToTab: "",
    };
  },
  watch: {},
  created() {
    this.$store.state.loading = true;
    let emuObj = JSON.parse(JSON.stringify(emuIndicator));
    emuObj = {
      ...emuObj,
      name: this.$i18n.t("EMU"),
      subGroups: emuObj.subGroups.map((s) => ({
        ...s,
        name: this.$i18n.t("EMU"),
        indicators: s.indicators.map((i) => ({
          ...i,
          name: this.$i18n.t("comparingEMU"),
          levels: i.levels.map((l) => ({
            ...l,
            scales: l.scales.map((s) => ({
              ...s,
              scaleLabel:
                s.scaleLabel === "Low"
                  ? this.$i18n.t("low")
                  : s.scaleLabel === "Medium"
                  ? this.$i18n.t("medium")
                  : s.scaleLabel === "High"
                  ? this.$i18n.t("high")
                  : s.scaleLabel === "Very High"
                  ? this.$i18n.t("veryHigh")
                  : this.$i18n.t("noData"),
            })),
          })),
        })),
      })),
    };
    this.emuIndicatorObj = emuObj;
    this.getEMU();
  },
  computed: {
    rightsidemapconfigdatafilter() {
      // this.rightSideMenu();
      if (this.rightsidemapconfigdata) {
        return this.rightsidemapconfigdata[this.period].filter((item) => {
          //console.log(item, this.menulistsearch.toLowerCase())
          return item.name
            .toLowerCase()
            .includes(this.menulistsearch.toLowerCase());
        });
      } else {
        return [];
      }
      // if (this.menulistsearch && this.rightsidemapconfigdata) {
      //   return this.rightsidemapconfigdata[this.period].filter((item) => {
      //     //console.log(item, this.menulistsearch.toLowerCase())
      //     // return this.menulistsearch
      //     //   .toLowerCase()
      //     //   .split(" ")
      //     //   .every(
      //     //     (v) => {
      //     //         item.name.toLowerCase().includes(v)
      //     //     }
      //     //   );
      //     return item.name
      //       .toLowerCase()
      //       .includes(this.menulistsearch.toLowerCase());
      //   });
      // } else {
      //   if (this.rightsidemapconfigdata) {
      //     this.rightsidemapconfigdata[this.period].sort((a, b) => {
      //       return b.value - a.value;
      //     });
      //     //console.log(this.rightsidemapconfigdata[this.period])
      //     return this.rightsidemapconfigdata[this.period];
      //   } else {
      //     return []
      //   }
      // }
    },
  },
  methods: {
    noGeoJson(val) {
      if (!val) {
        this.$store.state.loading = false;
        this.$swal({
          text: "GeoJson not available",
        });
      }
    },
    getEMU() {
      //console.log('EMU called')
      let key = this.generateKey("monthlyEMU"),
        key2 = this.generateKey("annualEMU");

      service
        .getSavedConfig(key)
        .then((mResponse) => {
          this.monthlyEMU = mResponse.data;
          service
            .getSavedConfig(key2)
            .then((aResponse) => {
              this.annualEMU = aResponse.data;
              this.getMapData();
            })
            .catch((res) => {
              console.log(res);
              this.getMapData();
            });
        })
        .catch((res) => {
          console.log(res);
          this.getMapData();
        });
    },
    adjustTextColor(id, color) {
      //let element = document.getElementById('badgeNumberPosition40');
      let element = document.getElementById(id);
      // Get the element's background color
      //console.log(element)
      let bgColor = "";
      if (element != null) {
        // bgColor = window.getComputedStyle(element || null, null).getPropertyValue('background-color');
        bgColor = color;
        // Call lightOrDark function to get the brightness (light or dark)
        let brightness = this.lightOrDark(bgColor);
        // If the background color is dark, add the light-text class to it
        if (brightness == "dark") {
          element.classList.remove("dark-text");
          element.classList.add("light-text");
        } else {
          element.classList.remove("light-text");
          element.classList.add("dark-text");
        }
      }
    },
    lightOrDark(color) {
      // Variables for red, green, blue values
      var r, g, b, hsp;

      // Check the format of the color, HEX or RGB?
      if (color.match(/^rgb/)) {
        // If RGB --> store the red, green, blue values in separate variables
        color = color.match(
          /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
        );

        r = color[1];
        g = color[2];
        b = color[3];
      } else {
        // If hex --> Convert it to RGB: http://gist.github.com/983661
        color = +(
          "0x" + color.slice(1).replace(color.length < 5 && /./g, "$&$&")
        );

        r = color >> 16;
        g = (color >> 8) & 255;
        b = color & 255;
      }

      // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
      hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

      // Using the HSP value, determine whether the color is light or dark
      if (hsp > 127.5) {
        return "light";
      } else {
        return "dark";
      }
    },
    mapLoaded(flag) {
      if (flag) {
        this.$store.state.loading = false;
      } else {
        this.$store.state.loading = true;
      }
    },
    setView(view) {
      this.splitViewType = view;
      // this.mapview();
      this.activeTab = this.backToTab;
    },
    getScales(scales) {
      this.scales = scales;
    },
    rightSideMenu() {
      // console.log("rightSideMenu called")
      if (this.menulistsearch) {
        return this.rightsidemapconfigdata[this.period].filter((item) => {
          return this.menulistsearch
            .toLowerCase()
            .split(" ")
            .every(
              (v) =>
                item.name.toLowerCase().includes(v) ||
                item.parent.toLowerCase().includes(v) ||
                item.group.toLowerCase().includes(v)
            );
        });
      } else {
        if (this.rightsidemapconfigdata) {
          this.rightsidemapconfigdata[this.period].sort((a, b) => {
            return b.value - a.value;
          });
          return this.rightsidemapconfigdata[this.period];
        }
      }
    },
    bubbleCurrentYearFunction(year) {
      this.period = year;
      this.rightSideMenu(year);
    },
    splitView(type) {
      this.backToTab = this.activeTab;
      this.splitViewType = type;
      this.activeTab = type;
    },
    setLocationOnReset(location) {
      this.$store.state.loading = true;

      if (location.type == "reset") {
        this.locationValue = this.countryLevel + "/" + this.countryLocation;
      } else {
        this.locationValue = location.locationValue;
      }

      //this.getLocation(location.locationValue)
    },
    getLocation(location) {
      this.mapConfigData = null;
      this.defaultView = false;
      //this.pageLoader = true;
      var res = location.split("/");
      // if (parseInt(res[0]) < 6) {

      this.toolbarLevelID = parseInt(res[0]);
      this.subLevelID = parseInt(res[0]) + 1;
      this.toolbarLocationID = res[1];
      this.locationValue = "";
      this.locationValue = location;
      this.locationChanged = true;
      let id = this.currentId;
      let levels = this.currentLevel;
      this.defaultLevelID = res[0];
      this.defaultLocationID = res[1];
      this.viewflag = true;
      let alevel = [];
      if (this.viewType == "map") {
        alevel = [this.defaultLevelID, this.subLevelID];
      } else {
        alevel = [Number(this.defaultLevelID) + 1, this.subLevelID + 1];
      }
      if (this.viewType == "district" || this.viewType == "map") {
        this.ougroup = null;
      }
      // console.log("currentId", this.currentId)
      // console.log("id", id)
      this.getMapConfig(
        id,
        levels,
        alevel,
        this.ougroup,
        this.viewType,
        this.indiName,
        this.source
      );
    },
    getPeriod(p) {
      this.mapConfigData = null;
      this.rightsidemapconfigdata = null;
      let emuInd = this.menustructure.filter(
        (obj) => obj.name == this.emuIndicatorObj.name
      );
      if (
        this.$store.getters.getNamespace ===
        `${settings.tableName}_mnch-dashboard`
      ) {
      }
      if (emuInd.length == 0 && (p.type == "monthly" || p.type == "yearly")) {
        this.menustructure.unshift(this.emuIndicatorObj);
      }
      if (
        emuInd.length > 0 &&
        (p.type == "financialYear" ||
          p.type == "quarterly" ||
          this.$store.getters.getNamespace ===
            `${settings.tableName}_mnch-dashboard`)
      ) {
        this.menustructure.shift(this.emuIndicatorObj);
      }
      let count = 0;
      this.menustructure.forEach((key) => {
        if (key.subGroups.length > 0 && key.visible) {
          key.subGroups.forEach((sub) => {
            if (sub.indicators.length > 0 && sub.visible) {
              sub.indicators.forEach((ind) => {
                if (ind.visible) {
                  this.indname = ind.name;
                  count = count + 1;
                  if (count == 1) {
                    //this.currentId = ind.subIndicator[0].de;
                    // this.levels = ind.levels;
                    // this.source = ind.source;
                  }
                }
              });
            }
          });
        }
      });

      this.periodList = p.periodList;
      this.pType = p.type;
      let alevel = [];

      if (
        this.locationValue != "" &&
        this.locationValue.split("/")[0] != this.countryLevel &&
        this.viewflag
      ) {
        alevel = [this.countryLevel, this.countryLevel + 2];
      } else if (
        this.locationValue.split("/")[0] == this.countryLevel &&
        this.viewflag
      ) {
        alevel = [this.countryLevel, parseInt(this.countryLevel) + 1];
      } else {
        alevel = [this.countryLevel, this.countryLevel + 1];
      }
      let id = this.currentId;
      //let levels = this.currentLevel;
      let levels = this.currentLevel;
      // console.log("currentId", this.currentId)
      // console.log("id", id)
      this.getMapConfig(
        id,
        levels,
        alevel,
        this.ougroup,
        this.viewType,
        this.indiName,
        this.source
      );
    },
    layerchange(event) {
      this.url = event;
    },
    mapview() {
      this.activeTab = "map";
      this.splitViewType = "map";
      this.mapConfigData = null;
      //this.defaultLevelID = 5
      let id = this.currentId;
      let levels = this.currentLevel;
      this.viewflag = true;
      this.districtflag = false;
      this.mpvflag = false;
      this.defaultView = true;
      this.viewType = "map";
      this.resetLevel(id, levels, this.viewType, "");
      //this.defaultLocationID = 'ZIo5RmTAF1N'
    },
    mapDistrictview() {
      this.activeTab = "district";
      this.splitViewType = "map";
      this.mapConfigData = null;
      this.mpvflag = false;
      this.districtflag = true;
      this.samrtflag = false;
      this.apflag = false;
      this.viewflag = false;
      this.defaultView = false;
      // this.defaultLevelID = 6
      let id = this.currentId;
      let levels = this.currentLevel;
      this.viewType = "district";
      // this.defaultLocationID = 'ZIo5RmTAF1N'
      this.resetLevel(id, levels, this.viewType, "");
    },
    apdistrict() {
      this.activeTab = "adDistrict";
      this.splitViewType = "map";
      this.mapConfigData = null;
      this.districtflag = false;
      this.mpvflag = false;
      this.samrtflag = false;
      this.apflag = true;
      this.viewflag = false;
      this.defaultView = false;
      //this.defaultLevelID = 6
      this.viewType = "apd";
      let id = this.currentId;
      let levels = this.currentLevel;
      //let ougroup = "LqIkhD0s9Lw";
      this.ougroup = "LqIkhD0s9Lw";

      this.resetLevel(id, levels, this.viewType, this.ougroup, "");
    },
    samrtdistrict() {
      this.activeTab = "samarthDistrict";
      this.splitViewType = "map";
      this.mapConfigData = null;
      this.districtflag = false;
      this.mpvflag = false;
      this.samrtflag = true;
      this.viewflag = false;
      this.apflag = false;
      this.defaultView = false;
      //this.defaultLevelID = 6

      let id = this.currentId;
      let levels = this.currentLevel;
      //let ougroup = "Mn6SJTU8jLW";
      this.ougroup = "Mn6SJTU8jLW";
      this.viewType = "smart";
      this.resetLevel(id, levels, this.viewType, this.ougroup, "");
    },
    mpvdistrict() {
      this.activeTab = "mpvDistrict";
      this.splitViewType = "map";
      this.mapConfigData = null;
      this.districtflag = false;
      this.mpvflag = false;
      this.samrtflag = false;
      this.apflag = false;
      this.viewflag = false;
      this.defaultView = false;
      //this.defaultLevelID = 6
      this.viewType = "mpv";
      let id = this.currentId;
      let levels = this.currentLevel;
      //let ougroup = "iYvIWyBmPp9";
      this.ougroup = "iYvIWyBmPp9";
      //this.defaultLocationID = ougroup;
      this.resetLevel(id, levels, this.viewType, this.ougroup, "");
    },
    resetLevel(id, levels, view, ougroup) {
      let alevel = [];
      if (view == "map") {
        alevel = [this.defaultLevelID, this.subLevelID];
      } else {
        alevel = [Number(this.defaultLevelID) + 1, this.subLevelID + 1];
      }
      // console.log(view, alevel);
      this.getMapConfig(
        id,
        levels,
        alevel,
        ougroup,
        view,
        this.indiName,
        this.source
      );
    },
    getIndMapView(de, levels, alevel, ougroup, viewType, name, source) {
      this.viewType = "map";
      this.splitViewType = "map";
      this.viewflag = true;
      this.districtflag = false;
      this.mpvflag = false;
      this.defaultView = true;
      this.activeTab = "map";
      this.getMapConfig(
        de,
        levels,
        alevel,
        ougroup,
        this.viewType,
        name,
        source
      );
    },
    getMapConfig(id, levels, ouvalue, ougroup, view, indiName, source) {
      // console.log(id, levels, ouvalue, ougroup, view, indiName, source)
      this.indiName = indiName;
      this.source = source;
      this.rightsidemapconfigdata = null;
      this.mapConfigData = null;
      this.$store.state.loading = true;
      this.isLoading = id;
      this.mapObj.indiId = "";
      this.currentId = id;
      this.currentLevel = levels;
      let alevel = [];
      if (ouvalue == undefined) {
        if (view == "map") {
          alevel = [Number(this.defaultLevelID), this.subLevelID];
        } else {
          alevel = [Number(this.defaultLevelID) + 1, this.subLevelID + 1];
        }
      } else {
        alevel = ouvalue;
      }
      if (ougroup == undefined) {
        ougroup = null;
      }
      //console.log(alevel, 'alevel')
      let key = this.generateKey("adAnchorMapModule");

      //this.mapConfigData.series = []
      service
        .getSavedConfig(key)
        .then(async (amResponse) => {
          let anchorMapConfig = amResponse.data.anchorMap.anchorMap;
          if (anchorMapConfig && id) {
            this.mapObj.zoom = Number(anchorMapConfig.mapOptions.mapZoom);
            this.mapObj.lang = anchorMapConfig.mapOptions.lng;
            this.mapObj.lat = anchorMapConfig.mapOptions.lat;
            this.newMapConfigData = levels;
            this.mapObj.indiId = id;
            this.mapObj.ngoValue = null;
            this.mapObj.ageGroupValue = null;
            this.mapObj.msiGroupValue = null;
            this.mapObj.ougroup = ougroup;
            this.mapObj.level = alevel;
            this.mapObj.countryLevel = this.countryLevel;
            this.mapObj.view = view;
            this.mapObj.indiName = this.indiName;
            this.mapObj.source = this.source;
            let periods = this.periodList[0].value;
            //let period = this.periodList.join(';')
            this.periodList.forEach((p, i) => {
              if (i != 0) {
                periods = periods + ";" + p.value;
              }
            });
            // console.log(this.periodList)
            if (id != "EMU") {
              service
                .getIndicatorData(
                  id,
                  alevel,
                  this.defaultLocationID,
                  periods,
                  null,
                  null,
                  null,
                  ougroup
                )
                .then((response) => {
                  //this.mapConfigData = response.data
                  // let pe = response.data.metaData.dimensions.pe;
                  let valueIndex = 0,
                    ouIndex = 0,
                    peIndex = 0;
                  response.data.headers.forEach((h, i) => {
                    if (h.name === "value") {
                      valueIndex = i;
                    }
                    if (h.name === "ou") {
                      ouIndex = i;
                    }
                    if (h.name === "pe") {
                      peIndex = i;
                    }
                  });

                  let rData = {};
                  response.data.rows.forEach((r) => {
                    if (Object.keys(rData).includes(r[peIndex])) {
                      if (Object.keys(rData[r[peIndex]]).includes(r[ouIndex])) {
                        rData[r[peIndex]][r[ouIndex]] =
                          Number(rData[r[peIndex]][r[ouIndex]]) +
                          Number(r[valueIndex]);
                      } else {
                        rData[r[peIndex]][r[ouIndex]] = r[valueIndex] * 1;
                      }
                    } else {
                      rData[r[peIndex]] = {
                        [r[ouIndex]]: r[valueIndex] * 1,
                      };
                    }
                  });
                  let rightMenu = {};
                  Object.keys(rData).forEach((r) => {
                    rightMenu[r] = [];
                    Object.keys(rData[r]).forEach((key) => {
                      if (this.$store.state.appId == 6) {
                        this.childrens.listGrid.rows.forEach((row) => {
                          if (row[1] == key) {
                            // let group = "";
                            let text = [row[4], row[5], row[6]]
                              .filter(Boolean)
                              .join(",");
                            rightMenu[r].push({
                              name: row[2],
                              value: rData[r][key] * 1,
                              parent: row[3],
                              group: text,
                            });
                          }
                        });
                      } else {
                        rightMenu[r].push({
                          name: response.data.metaData.items[key].name,
                          value: rData[r][key] * 1,
                        });
                      }
                    });
                  });

                  this.period =
                    Object.keys(rData).sort()[Object.keys(rData).length - 1];
                  // console.log(pe)
                  // let period = null
                  // for(let i = pe.length - 1; i > 0; i--) {
                  //   if(Object.keys(rData).includes(pe[i])) {
                  //       period = pe[i]
                  //       break;
                  //   }
                  // }

                  // this.period = period
                  //console.log(this.period)
                  if (this.period) {
                    //console.log(rData, this.periodList)
                    this.globalMapConfigData = rData;
                    this.globalRightMenuData = rightMenu;
                    this.rightsidemapconfigdata = rightMenu;
                    this.mapConfigData = rData;
                  } else {
                    this.period =
                      this.periodList[this.periodList.length - 1].value;
                    this.$store.state.loading = false;
                    this.$swal({
                      text: "Data not available for selected time frequency.",
                    });
                  }

                  /*commented for now nned to think on it */
                  // let newPeriod = ''
                  // if(typeof this.period == 'object'){
                  //   newPeriod = this.period[0]
                  // }else{
                  //   newPeriod = this.period
                  // }
                  // this.rightsidemapconfigdata = {[newPeriod]: rightMenu[newPeriod]}
                  // this.mapConfigData = {[newPeriod]: rData[newPeriod]};
                  /****************************** */
                })
                .catch((res) => {
                  // console.log("res", res);
                  this.$store.state.loading = false;
                  let text = "";
                  if (this.viewType == "district") {
                    text = "Location data is not present in District View";
                  } else if (this.viewType == "mpv") {
                    text = "Location data is not present in MPV District View";
                  } else if (this.viewType == "apd") {
                    text = "Location data is not present in AP District View";
                  } else if (this.viewType == "smart") {
                    text =
                      "Location data is not present in Samarth District View";
                  } else {
                    text = "Incorrect viewType for given indicator.";
                  }
                  this.$swal({
                    title: "Oops...",
                    text: text,
                  });
                });
            } else {
              let finalEMU = {},
                rightMenu = {};
              if (this.pType === "yearly") {
                this.periodList.forEach((period) => {
                  finalEMU[period.value] = {};
                  //console.log(this.annualEMU)
                  if (this.annualEMU) {
                    let cEMU = JSON.parse(this.annualEMU.compEMU);
                    Object.keys(cEMU).forEach((e) => {
                      if (cEMU[e]) {
                        let newIndex = cEMU[e].categories.findIndex(
                          (pe) =>
                            period.value ===
                            this.$moment(pe, "YYYY").format("YYYY")
                        );
                        if (newIndex != undefined) {
                          let emuData = cEMU[e].data.find(
                            (d) => d.name === cEMU[e].source
                          );
                          if (emuData) {
                            finalEMU[period.value][e] = emuData.data[newIndex]
                              ? emuData.data[newIndex]
                              : null;
                          }
                        }
                      }
                    });
                  } else {
                    this.$swal({
                      text: "Data not available for selected time frequency.",
                    });
                    this.$store.state.loading = false;
                  }
                });
              } else if (this.pType === "monthly") {
                let tEMU =
                  typeof this.monthlyEMU.totalEMU === "string"
                    ? JSON.parse(this.monthlyEMU.totalEMU)
                    : this.monthlyEMU.totalEMU;
                this.periodList.forEach((period) => {
                  finalEMU[period.value] = {};
                  if (tEMU) {
                    Object.keys(tEMU).forEach((e) => {
                      if (tEMU[e]) {
                        let newIndex = tEMU[e].saveCategories.findIndex(
                          (pe) =>
                            period.value ===
                            this.$moment(pe, "MMM YYYY").format("YYYYMM")
                        );
                        if (newIndex != undefined) {
                          let emuData = tEMU[e].saveData.find(
                            (d) => d.name === this.$i18n.t("EMU")
                          );
                          if (emuData) {
                            finalEMU[period.value][e] = emuData.data[newIndex]
                              ? emuData.data[newIndex]
                              : null;
                          }
                        }
                      }
                    });
                  } else {
                    this.$swal({
                      text: "Data not available for selected time frequency.",
                    });
                  }
                });
              } else {
                this.$swal({
                  text: "Data not available for selected time frequency.",
                });
                this.$store.state.loading = false;
              }
              // console.log("finalEMU", finalEMU)
              if (Object.keys(finalEMU).length !== 0) {
                // console.log("this.defaultLocationID", this.defaultLocationID)
                let locList = await service.getChildOrganisation(
                  this.defaultLocationID
                );
                // console.log("locList", locList)
                // console.log("this.districtParentGeo", this.districtParentGeo)
                Object.keys(finalEMU).forEach((p) => {
                  rightMenu[p] = [];
                  locList.data.children.forEach((org) => {
                    let isFound = Object.keys(finalEMU[p]).find(
                      (loc) => loc === org.id
                    );
                    if (isFound) {
                      rightMenu[p].push({
                        name: org.displayName,
                        value: finalEMU[p][org.id] * 1,
                      });
                    } else {
                      rightMenu[p].push({
                        name: org.displayName,
                        value: null,
                      });
                    }
                  });
                });
                this.period =
                  Object.keys(finalEMU)[Object.keys(finalEMU).length - 1];
                if (Object.keys(finalEMU[this.period]).length !== 0) {
                  if (this.period) {
                    this.globalMapConfigData = finalEMU;
                    this.mapConfigData = finalEMU;
                    this.globalRightMenuData = rightMenu;
                    this.rightsidemapconfigdata = rightMenu;
                  } else {
                    this.period =
                      this.periodList[this.periodList.length - 1].value;
                    this.$store.state.loading = false;
                    this.$swal({
                      text: "Data not available for selected time frequency.",
                    });
                  }
                } else {
                  this.$swal({
                    text: "Data not available for selected time frequency.",
                  });
                  this.$store.state.loading = false;
                }
              }
              //console.log(this.period)
            }
            this.mapConfigAvailable = true;
          } else {
            this.mapConfigAvailable = false;
            this.$store.state.loading = false;
            if (this.$store.state.isAdmin) {
              // Popup message to set the configurations
              this.$swal({
                title: this.$i18n.t("configurationnotavailable"),
                text: this.$i18n.t("pleasesetyourconfiguration"),
                showCancelButton: true,
                confirmButtonText: this.$i18n.t("configurenow"),
              }).then((result) => {
                if (result.value) {
                  this.$router.push("/config");
                }
              });
            } else {
              // Popup message to contact admin for the configurations
              this.$swal({
                title: this.$i18n.t("configurationnotavailable"),
                text: this.$i18n.t("error_text_2"),
              });
            }
          }
        })
        .catch((res) => {
          console.log("res", res);
          this.$store.state.loading = false;
          this.mapConfigAvailable = false;
        });
    },
    exportPPT() {
      this.$refs.geoTab.exportPPT();
    },
    getMapData() {
      if (
        this.$store.getters.getGlobalFactors().period &&
        this.$store.getters.getGlobalFactors().period.Period
      ) {
        this.globalPeriodData =
          this.$store.getters.getGlobalFactors().period.Period;
        let tPeriod = this.globalPeriodData;
        let d = new Date();
        this.period = new Date(
          this.$store.getters.getGlobalFactors().period.Period.backtrackedDate
        );
        let currentDate = this.$moment(d, "YYYYMM")
          .subtract(tPeriod.backtrackedMonth * 1, "months")
          .format("YYYY-M");
        // let currentFinalDate = this.$moment(currentDate, "YYYYMM")
        //   .subtract(tPeriod.backtrackedYearLimit * 1, "years")
        //   .format("YYYY-M");
        //console.log(currentDate)
        // let currentYear = this.$store.getters.getGlobalFactors().period.Period.backtrackedDate.split("-")[0];
        // let currentMonth = this.$store.getters.getGlobalFactors().period.Period.backtrackedDate.split("-")[1];
        let currentYear = currentDate.split("-")[0];
        // let currentMonth = currentDate.split("-")[1];

        let appId = this.$store.state.appId ? this.$store.state.appId : "",
          appUserId = this.$store.state.appUserId;
        if (appId && appUserId) {
          for (
            let i =
              currentYear -
              Number(
                this.$store.getters.getGlobalFactors().period.Period
                  .backtrackedYearLimit
              );
            i <= currentYear;
            i++
          ) {
            if (this.pType === "financialYear") {
              this.periodList.push({
                text: `${i} - ${i + 1}`,
                value: `${i}April`,
              });
            } else {
              this.periodList.push({
                text: `${i} - ${i + 1}`,
                value: `${i}July`,
              });
            }
          }
          let periodValue = this.$moment(
            new Date(this.period),
            "YYYYMM"
          ).format("YYYY-MM");
          this.period =
            this.pType === "financialYear"
              ? [periodValue.split("-")[0] + "April"]
              : [periodValue.split("-")[0] + "July"];
        } else {
          // let year = currentYear;
          // let month = currentMonth;
          //console.log(currentYear, currentMonth)
          // let i = 0;
          let selectedMonths = [];
          // do {
          //     if (month <= 0) {
          //         month = 12;
          //         year--;
          //     }
          //     selectedMonths.push(year + (month > 9 ? "" : "0") + month)
          //     this.periodList.push({
          //       text: year+ (month > 9 ? "" : "0") + month,
          //       value: year + (month > 9 ? "" : "0") + month,
          //     });

          //     month--;
          //     i++;
          // } while (i < 11);
          //*** added by ashvini */
          for (let mn = 0; mn < 10; mn++) {
            let mnt = this.$moment(currentDate, "YYYYMM")
              .subtract(mn * 1, "months")
              .format("YYYYMM");
            selectedMonths.push(mnt);
            this.periodList.push({
              text: mnt,
              value: mnt,
            });
          }
          //let periodValue = this.$moment(new Date(this.period), "YYYYMM").format("YYYY-MM");
          this.period = [selectedMonths[selectedMonths.length - 1]];
          //console.log(this.period, selectedMonths)
        }
      }

      let { locationID, levelID, subLevelID } = service.getAllowedLocation();

      this.defaultLocationID =
        this.toolbarLocationID =
        this.countryLocation =
          locationID;
      this.defaultLevelID = this.toolbarLevelID = this.countryLevel = levelID;
      this.subLevelID = subLevelID;
      this.locationValue = levelID + "/" + locationID;

      let key = this.generateKey("mapVisualization");

      service
        .getSavedConfig(key)
        .then((mapResponse) => {
          service.getOrganisationUnitLevels().then((orgResponse) => {
            this.orgUnitLevels = orgResponse.data;
            service
              .getNewOrganisationUnitGeoJson(
                this.countryLocation,
                this.countryLevel + 1
              )
              .then((geoJson) => {
                this.countryGeoJson = geoJson.data;
                service
                  .getOpenOrganisation(this.countryLevel + 1)
                  .then((ores) => {
                    this.districtParentGeo = ores.data;

                    let facility = orgResponse.data.find(
                      (o) => o.name.toLowerCase().includes("facility")
                    );
                    if (facility) {
                      this.facilityLevelID = facility.level;
                    } else {
                      let facilityLevels =
                        orgResponse.data.map(
                          (o) => o.level
                        );
                      this.facilityLevelID = Math.max(...facilityLevels);
                    }
                    //console.log(JSON.stringify(mapResponse.data.mapGroups))
                    //console.log(this.emuIndicatorObj)
                    // && $route.name == "map"
                    if (
                      this.$store.state.appId != 6 &&
                      this.$store.getters.getNamespace !==
                        `${settings.tableName}_mnch-dashboard`
                    ) {
                      this.menustructure.unshift(this.emuIndicatorObj);
                    }
                    mapResponse.data.mapGroups.forEach((g) => {
                      this.menustructure.push(g);
                    });
                    //this.menustructure = mapResponse.data.mapGroups;
                    let de,
                      le,
                      indname,
                      source,
                      count = 0;

                    this.menustructure.forEach((key) => {
                      if (key.subGroups.length > 0 && key.visible) {
                        key.subGroups.forEach((sub) => {
                          if (sub.indicators.length > 0 && sub.visible) {
                            sub.indicators.forEach((ind) => {
                              if (ind.visible) {
                                count = count + 1;
                                if (count == 1) {
                                  indname = ind.name;
                                  de =
                                    this.$store.state.appId != 6
                                      ? ind.subIndicator[0].de[0]
                                      : ind.subIndicator[0].de;
                                  le = ind.levels;
                                  source = ind.source;
                                }
                              }
                            });
                          }
                        });
                      }
                    });

                    console.log(
                      "this.menustructure",
                      JSON.parse(JSON.stringify(this.menustructure))
                    );
                    //console.log(this.menustructure)
                    if (this.$store.state.appId == 6) {
                      service.getDistrictGroups().then((children) => {
                        this.childrens = children.data;
                        this.getMapConfig(
                          de,
                          le,
                          [this.defaultLevelID, this.defaultLevelID + 1],
                          null,
                          "map",
                          indname,
                          source
                        );
                      });
                    } else {
                      this.getMapConfig(
                        de,
                        le,
                        [this.defaultLevelID, this.defaultLevelID + 1],
                        null,
                        "map",
                        indname,
                        source
                      );
                    }
                  });
              });
          });
        })
        .catch(() => {
          this.$store.state.loading = false;
          if (this.$store.state.isAdmin) {
            // Popup message to set the configurations
            this.$swal({
              title: this.$i18n.t("configurationnotavailable"),
              text: this.$i18n.t("pleasesetyourconfiguration"),
              showCancelButton: true,
              confirmButtonText: this.$i18n.t("configurenow"),
            }).then((result) => {
              if (result.value) {
                this.$router.push("/config");
              }
            });
          } else {
            // Popup message to contact admin for the configurations
            this.$swal({
              title: this.$i18n.t("configurationnotavailable"),
              text: this.$i18n.t("error_text_2"),
            });
          }
        });
    },
  },
  mounted() {},
  updated() {
    // console.log("rightsidemapconfigdatafilter", this.rightsidemapconfigdatafilter)
    // console.log("this.scales", this.scales)
    if (this.rightsidemapconfigdatafilter && this.scales) {
      this.scales.forEach((scale, i) => {
        this.rightsidemapconfigdatafilter.forEach((res, j) => {
          //console.log('badgeNumberPosition'+i+j, scale['scaleColor'])
          this.adjustTextColor(
            "badgeNumberPosition" + i + j,
            scale["scaleColor"]
          );
        });
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.mdgridviewpage-bg {
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  // padding: 20px 40px;
  // padding: 0px 0 20px !important;
  // padding-bottom: 50px;
  background-color: #3471ce;
}

.map_cardBody {
  height: calc(100vh - 110px);
  overflow: hidden;
  background: #12122a;
  border-radius: 5px;
}

.nav-side-menu {
  overflow: auto;
  /* font-family: verdana; */
  font-size: 0.75rem;
  font-weight: 200;
  /* position: fixed; */
  top: 0px;
  /* width: 300px; */
  height: calc(100vh - 110px);
  overflow: hidden;
  overflow-y: scroll;
  color: #000;
  background: #292847 0% 0% no-repeat padding-box;
  opacity: 1;
}
.nav-side-menu .brand {
  line-height: 40px;
  display: block;
  background: #393856 0% 0% no-repeat padding-box;
  opacity: 1;
  border: 1px solid transparent;
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
  font-size: var(--font-size-chart-sidebar-heading);
  color: #E5E5E5;
  font-weight: 400;
  font-size: 14px;
  padding-left: 5%;
}
.nav-side-menu .toggle-btn {
  display: none;
}
.nav-side-menu ul,
.nav-side-menu li {
  list-style: none;
  padding: 0px;
  margin: 0px;
  line-height: 35px;
  cursor: pointer;
}
.nav-side-menu ul :not(collapsed) .arrow:before,
.nav-side-menu li :not(collapsed) .arrow:before {
  font-family: FontAwesome;
  content: "\f078";
  display: inline-block;
  padding-left: 10px;
  padding-right: 10px;
  vertical-align: middle;
  float: right;
  color: #c5c3c3;
}

.nav-side-menu ul .sub-menu li,
.nav-side-menu li .sub-menu li {
  //background-color: #181736;
  border: none;
  line-height: 28px;
  //border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  // margin-left: 8%;
  display: flex;
  align-items: center;
}

.nav-side-menu li .sub-menu li a {
  color: #c5c3c3 !important;
  
}
.nav-side-menu li .sub-menu li a:active ,
.nav-side-menu li .sub-menu li a:focus{
  color: #ffff !important;
  border-left: 3px solid var(--sidebar-border-left) !important;
 
  
}
.nav-side-menu li {
  padding-left: 0px;
  // border-left: 3px solid #f4f4f4;
  //border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding-top: 8px;
  padding-bottom: 8px;
  min-height: 48px;
  //margin-left: 4%;

}



.nav-side-menu li:hover{
 // background: var(--active-option-liner-gradient-color);
  border: 1px solid transparent;
    
    //border-top-right-radius: 30px;
    //border-bottom-right-radius: 30px;
    color: var(--color-white);
}
.menu-list #menu-content li {
  margin-right: 4%;
}
.nav-side-menu li a {
  text-decoration: none;
  // color: #f2f2f2;
  font-size: 0.875rem;
  line-height: 20px;
  display: flex;
  align-items: center;
  /* height: 100%; */
  color: #c5c3c3;
  opacity: 1;
  text-align: left;
  letter-spacing: 0.8px;
  font-size:14px;
  font-weight:400;
}

.top_menu .nav-side-menu li a {
  height: 100%;
}
.nav-side-menu li a i {
  padding-left: 10px;
  width: 20px;
  padding-right: 20px;
}

.nav-side-menu li .sub-menu li a:active {
  color:#fff !important;
  border-left: 3px solid var(--sidebar-border-left) !important;
 
}
.map-firstitem ul:active {
  color:#fff !important;
}


@media (max-width: 767px) {
  .nav-side-menu {
    position: relative;
    width: 100%;
    margin-bottom: 10px;
  }
  .nav-side-menu .toggle-btn {
    display: block;
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 10 !important;
    padding: 3px;
    background-color: #ffffff;
    color: #000;
    width: 40px;
    text-align: center;
  }
  .brand {
    text-align: left !important;
    font-size: 1.375rem;
    padding-left: 20px;
    line-height: 50px !important;
  }
}
@media (min-width: 767px) {
  .nav-side-menu .menu-list .menu-content {
    display: block;
  }
}
body {
  margin: 0px;
  padding: 0px;
}

.nav-side-menu ul .sub-menu li .sub-line li,
.nav-side-menu li .sub-menu li .sub-line li {
  background-color: #181c20;
  border: none;
  line-height: 28px;
  border-bottom: 1px solid #23282e;
  margin-left: 0px;
}

.nav-side-menu ul .sub-menu li .sub-line li:before,
.nav-side-menu li .sub-menu li .sub-line li:before {
  font-family: FontAwesome;
  content: "\f105";
  display: inline-block;
  padding-left: 100px;
  padding-right: 10px;
  vertical-align: middle;
}

.nav-side-menu .sub-menu li {
  padding-left: 20px;
  border-left: 3px solid #2e353d;
  border-bottom: 1px solid #23282e;
}
.nav-side-menu .sub-menu li a {
  text-decoration: none;
  color: #000;
}
.nav-side-menu .sub-menu li a.active {
  color: #03a9f4 !important;
  font-weight: 600;
}
.sub-menu li a i {
  padding-left: 10px;
  width: 20px;
  padding-right: 20px;
}

@media (max-width: 767px) {
  .nav-side-menu .sub-menu {
    position: relative;
    width: 100%;
    margin-bottom: 10px;
  }
  .nav-side-menu .sub-menu .toggle-btn {
    display: block;
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 10 !important;
    padding: 3px;
    background-color: #ffffff;
    color: #000;
    width: 40px;
    text-align: center;
  }
}
.sub-line ul .sub-press li.active,
.sub-line li .sub-press li.active {
  color: #d19b3d;
}

.sub-line ul .sub-press li.active a,
.sub-line li .sub-press li.active a {
  color: #d19b3d;
}
.sub-line ul .sub-press li,
.sub-line li .sub-press li {
  background-color: #181c20;
  border: none;
  line-height: 28px;
  border-bottom: 1px solid #23282e;
  margin-left: 0px;
}
.sub-line ul .sub-press li:hover,
.sub-line li .sub-press li:hover {
  background-color: #020203;
}
.sub-line ul .sub-press li:before,
.sub-line li .sub-press li:before {
  font-family: Arial;
  content: "\f105";
  display: inline-block;
  padding-left: 50px;
  padding-right: 10px;
  vertical-align: middle;
}

.sub-line li {
  padding-left: 20px;
  border-left: 3px solid #2e353d;
  border-bottom: 1px solid #23282e;
}
.sub-line li a {
  text-decoration: none;
  color: #e1ffff;
}
.sub-line li a i {
  padding-left: 50px;
  width: 20px;
  padding-right: 20px;
}

@media (max-width: 767px) {
  .sub-line {
    position: relative;
    width: 100%;
    margin-bottom: 10px;
  }
  .sub-line .toggle-btn {
    display: block;
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 10 !important;
    padding: 3px;
    background-color: #ffffff;
    color: #000;
    width: 40px;
    text-align: center;
  }
}
.top_menu .nav {
  display: flex;
  justify-content: flex-start;
  background: #2e2e48;
}
.top_menu .nav-item {
  margin-left: 0;
}

.top_menu li {
  border: 0;
}
.top_menu li.nav-item {
  padding: 0px 0;
}

.top_menu li.nav-item:hover .fa {
  color: #ddd;
}
.top_menu .nav-link .fa {
  padding-left: 0px;
  width: auto;
  padding-right: 0px;
  // color: #ddd;
}
.right_menu .fa {
  color: #d3d3d3;
  opacity:0.3;
}
.right_menu .nav-side-menu li a {
  line-height: 23px;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}
.has-search .form-control {
  padding-left: 2.375rem;
  border: 0;
  border-radius: 0;
}

.has-search .form-control-feedback {
  position: absolute;
  z-index: 2;
  display: block;
  width: 2.375rem;
  height: 2.375rem;
  line-height: 2.375rem;
  text-align: center;
  pointer-events: none;
  color: #aaa;
}
.form-group.has-search {
  margin-bottom: 0;
  position: relative;
}
.informationDiv p {
  margin-bottom: 0%;
  font-size: 0.875rem;
  font-weight: 100;
}
.accordion-head i {
  font-size: 1.5rem;
  float: right;
}

.accordion-head > .collapsed > i:before {
  content: "\f105";
}
#selectionModal .form-check {
  min-height: 45px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
#selectionModal .form-check-label {
  font-size: 0.875rem;
  font-weight: 100;
}
.accordion-heading {
  font-size: 1rem;
  display: flex;
  align-items: center;
  margin-bottom: 0;
  font-weight: 100;
}
a:hover {
  text-decoration: none;
}

.is-red {
  background: red;
}
.is-blue {
  background: blue;
}

.top_menu {
  .nav-link {
    height: 100%;
    width: 49px;
    padding: 9px 10px;
    display: flex;
    justify-content: center;
    font-size: 1.7rem;
    color: #fff;
  }

  .nav-link:hover .fa {
    color: #fff;
  }
}
.searchbox {
  position: sticky;
  width: 100%;
  top: 1px;
  z-index: 1;
}
.sub-menu li:last-child {
  border-bottom: none !important;
}

.light-text {
  color: #E5E5E5;
  opacity: 1;
  width: 64px;
  height: 16px;
  padding-top: 2%;
  padding-bottom: 5%;
}

.dark-text {
    //background-color: #464287 !important;
    letter-spacing: 0.7px;
    color: #000;
    opacity: 1;
    width: 64px;
    height: 16px;
    padding-top: 2%;
    padding-bottom: 5%;
    //height: 24px;
    //padding-top:3%;
}

.searchbox .form-control{
  background: #2F2D55 0% 0% no-repeat padding-box !important;
  opacity: 1;
  letter-spacing: 0.7px;
  color: #B2B1C5 !important;
  opacity: 1;

}
</style>
