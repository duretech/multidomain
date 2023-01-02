<template>
  <div>
    <div :class="'card-body ' + chartBySubtype">
      <div class="form-group row">
        <label class="col-sm-5 col-form-label">{{
          $t("disable_chart")
        }}</label>
        <div class="col-sm-7 pr-0">
          <b-form-checkbox
            checked="disableChart"
            v-model="disableChart"
            name="disableChartTitle"
            switch
            size="lg"
            class="mt-1"
          />
        </div>
      </div>
      <transition name="slide-fade">
        <div v-if="!disableChart">
          <div
            v-if="!map"
            class="card-header p-5px bg-faint-grey default-card-border-radius"
            :id="'headingChartSettings' + chartBySubtype + chartByType"
          >
            <h2 class="mb-0">
              <button
                class="
                  btn btn-link
                  w-100
                  text-left text-uppercase
                  color-grey
                  f-s-0-875rem
                "
                type="button"
                data-toggle="collapse"
                :data-target="
                  '#collapseChartSettings' + chartBySubtype + chartByType
                "
                aria-expanded="false"
                :aria-controls="
                  'collapseChartSettings' + chartBySubtype + chartByType
                "
              >
                {{ $t("addChartSettings") }}
              </button>
            </h2>
          </div>
          <div
            :id="'collapseChartSettings' + chartBySubtype + chartByType"
            class="collapse collapse-section-border"
            :aria-labelledby="
              'headingChartSettings' + chartBySubtype + chartByType
            "
          >
            <div class="row m-0 mt-4 mb-2">
              <div class="col-lg-6">
                <div class="form-group row">
                  <label class="col-sm-5 col-form-label"
                    >{{ $t("chart") }}
                    {{ $t("type") }}</label
                  >
                  <div class="col-sm-7">
                    <div class="select-wrapper">
                      <select class="form-control" v-model="chartType">
                        <option value="Column">
                          {{ $t("column") }}
                        </option>
                        <option value="Line">
                          {{ $t("line") }}
                        </option>
                        <option value="Area">
                          {{ $t("area") }}
                        </option>
                        <option value="Stack">
                          {{ $t("stack") }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-sm-5 col-form-label">{{
                    $t("chart_title")
                  }}</label>
                  <div class="col-sm-2 pr-0">
                    <b-form-checkbox
                      checked="chartTitleVisible"
                      v-model="chartTitleVisible"
                      name="someSwitchOptionTitle"
                      switch
                      size="lg"
                      class="mt-1"
                    />
                  </div>
                  <transition name="slide-fade">
                    <div class="col-sm-5 pl-0" v-if="chartTitleVisible">
                      <input
                        type="text"
                        class="form-control"
                        placeholder=""
                        v-model="chartTitle"
                      />
                    </div>
                  </transition>
                </div>
                <div class="form-group row">
                  <label
                    for="inputChartSubtitle"
                    class="col-sm-5 col-form-label"
                    >{{ $t("chart_subtitle") }}</label
                  >
                  <div class="col-sm-2 pr-0">
                    <b-form-checkbox
                      checked="chartSubTitleVisible"
                      v-model="chartSubTitleVisible"
                      name="someSwitchOptionSubtitle"
                      switch
                      size="lg"
                      class="mt-1"
                    />
                  </div>
                  <transition name="slide-fade">
                    <div class="col-sm-5 pl-0" v-if="chartSubTitleVisible">
                      <input
                        type="text"
                        class="form-control"
                        id="inputChartSubtitle"
                        :placeholder="$t('chart_subtitle')"
                        v-model="chartSubTitle"
                      />
                    </div>
                  </transition>
                </div>
                <div class="form-group row">
                  <label
                    for="inputChartSource"
                    class="col-sm-5 col-form-label"
                    >{{ $t("source") }}</label
                  >
                  <div class="col-sm-7">
                    <input
                      type="text"
                      class="form-control"
                      id="inputChartSource"
                      :placeholder="$t('chart_source')"
                      v-model="chartDataSource"
                    />
                  </div>
                </div>
              </div>
              <div class="col-lg-6">
                <div class="form-group row">
                  <label class="col-sm-5 col-form-label">{{
                    $t("x-axis")
                  }}</label>
                  <div class="col-sm-2 pr-0">
                    <b-form-checkbox
                      checked="chartXAxisTitleVisible"
                      v-model="chartXAxisTitleVisible"
                      name="someSwitchOptionXAxis"
                      switch
                      size="lg"
                      class="mt-1"
                    />
                  </div>
                  <transition name="slide-fade">
                    <div class="col-sm-5 pl-0" v-if="chartXAxisTitleVisible">
                      <input
                        type="text"
                        class="form-control"
                        placeholder=""
                        v-model="chartXAxisTitle"
                      />
                    </div>
                  </transition>
                </div>
                <div class="form-group row">
                  <label class="col-sm-5 col-form-label">{{
                    $t("y-axis")
                  }}</label>
                  <div class="col-sm-2 pr-0">
                    <b-form-checkbox
                      checked="chartYAxisTitleVisible"
                      v-model="chartYAxisTitleVisible"
                      name="someSwitchOptionYAxis"
                      switch
                      size="lg"
                      class="mt-1"
                    />
                  </div>
                  <transition name="slide-fade">
                    <div class="col-sm-5 pl-0" v-if="chartYAxisTitleVisible">
                      <input
                        type="text"
                        class="form-control"
                        placeholder=""
                        v-model="chartYAxisTitle"
                      />
                    </div>
                  </transition>
                </div>
                <div class="form-group row">
                  <label
                    for="inputChartDataLabels"
                    class="col-sm-5 col-form-label"
                    >{{ $t("dataLabels") }}</label
                  >
                  <div class="col-sm-7">
                    <b-form-checkbox
                      checked="chartDataLabels"
                      v-model="chartDataLabels"
                      name="someSwitchOptionDataLabels"
                      switch
                      size="lg"
                      class="mt-1"
                    />
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div class="form-group row">
                  <label
                    for="inputChartSource"
                    class="col-sm-5 col-lg-6 col-form-label"
                    >{{ $t("chartHeading") }}</label
                  >
                  <div class="col-sm-7 col-lg-6">
                    <!-- <input type="text" class="form-control" id="inputChartName" :placeholder="$t('chartHeading')" v-model="chartName" /> -->
                    <b-form-textarea
                      id="inputChartInfo"
                      v-model="chartName"
                      :state="
                        chartName.length !== 0 &&
                        chartName.length <= chartTitleMaxLength
                      "
                      :placeholder="
                        $t('chartHeading')
                      "
                      rows="3"
                      :maxlength="chartTitleMaxLength"
                    ></b-form-textarea>
                    <span
                      >{{ chartName.length }}/{{ chartTitleMaxLength }}</span
                    >
                  </div>
                </div>
                <div class="form-group row">
                  <label
                    for="inputChartSource"
                    class="col-sm-5 col-lg-6 col-form-label"
                    >{{
                      $t("chartInformation")
                    }}</label
                  >
                  <div class="col-sm-7 col-lg-6">
                    <b-form-textarea
                      id="inputChartInfo"
                      v-model="chartInfo"
                      :state="
                        chartInfo.length !== 0 &&
                        chartInfo.length <= chartInfoMaxLength
                      "
                      :placeholder="chartInfoPlaceholder"
                      rows="3"
                      :maxlength="chartInfoMaxLength"
                    ></b-form-textarea>
                    <span>{{ chartInfo.length }}/{{ chartInfoMaxLength }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-3 mb-4">
            <div class="col-12">
              <div class="card">
                <div
                  class="
                    card-header
                    bg-faint-grey
                    color-black
                    border-radius-0
                    text-uppercase
                    f-s-0-875rem
                    font-weight-bold
                  "
                >
                  {{ $t("mapping") }}
                </div>
                <div class="card-body">
                  <div
                    class="text-right"
                    v-if="$root.defaultLanguageLocale !== $i18n.locale"
                  >
                    <SyncMapping ref="syncMapping" @syncMapping="syncMapping" />
                  </div>
                  <div
                    class="row"
                    v-for="(chart, index) in chartData"
                    :key="index"
                  >
                    <div class="col-12">
                      <div
                        class="default-card-border-radius"
                        :id="'headingChartSettings' + index + chartBySubtype"
                      >
                        <!-- mb-0 class removed to remove fa-plus icon from right corner -->
                        <h2 class="">
                          <button
                            class="
                              btn btn-link
                              p-0
                              w-100
                              text-left text-uppercase
                              color-grey
                              f-s-0-875rem
                            "
                            type="button"
                            data-toggle="collapse"
                            :data-target="
                              '#collapseChartSettings' +
                              index +
                              chartBySubtype +
                              chartByType
                            "
                            aria-expanded="false"
                            :aria-controls="
                              'collapseChartSettings' +
                              index +
                              chartBySubtype +
                              chartByType
                            "
                          >
                            <i
                              class="fa fa-cog f-s-20px pr-2"
                              v-b-tooltip.hover
                              :title="$t('dataMapping')"
                            ></i>
                            {{
                              Array.isArray(chartData[index].indicator.name)
                                ? chartData[index].indicator.name[0]
                                : chartData[index].indicator.name
                            }}
                          </button>
                        </h2>
                      </div>
                      <div
                        :id="
                          'collapseChartSettings' +
                          index +
                          chartBySubtype +
                          chartByType
                        "
                        class="collapse collapse-section-border"
                        :aria-labelledby="
                          'headingChartSettings' +
                          index +
                          chartBySubtype +
                          chartByType
                        "
                      >
                        <div class="row m-0 mt-4 mb-2">
                          <div class="col">
                            <div class="form-group row hide">
                              <label class="col-sm-5 col-form-label">{{
                                $t("identifier")
                              }}</label>
                              <div class="col-sm-7">
                                <input
                                  type="text"
                                  class="form-control"
                                  placeholder=""
                                  :value="
                                    Array.isArray(
                                      chartData[index].indicator.static_name
                                    )
                                      ? $t(
                                          `${chartData[index].indicator.static_name[0]}`
                                        )
                                      : $t(
                                          `${chartData[index].indicator.static_name}`
                                        )
                                  "
                                  disabled
                                />
                              </div>
                            </div>
                            <div class="form-group row">
                              <label class="col-sm-5 col-form-label">{{
                                $t("displayName")
                              }}</label>
                              <div class="col-sm-7">
                                <input
                                  type="text"
                                  class="form-control"
                                  placeholder=""
                                  v-model="chartData[index].indicator.name"
                                />
                              </div>
                            </div>
                            <div v-if="map" class="form-group row">
                              <label class="col-sm-5 col-form-label">{{
                                $t("scales")
                              }}</label>
                              <div class="col-sm-7">
                                <b-tabs content-class="mt-3">
                                  <b-tab
                                    v-for="(
                                      levelScale, levelIndex
                                    ) in chartData[index].indicator.levels"
                                    :key="levelIndex"
                                    :title="levelScale.levelName"
                                  >
                                    <div
                                      class="row"
                                      style="padding: 5px"
                                      v-for="(
                                        scaleRow, scaleIndex
                                      ) in levelScale.scales"
                                      :key="scaleIndex"
                                    >
                                      <div class="col-sm-3">
                                        <input
                                          type="text"
                                          class="form-control"
                                          :placeholder="
                                            $t(
                                              'label'
                                            )
                                          "
                                          v-model="
                                            levelScale.scales[scaleIndex]
                                              .scaleLabel
                                          "
                                        />
                                      </div>
                                      <div class="col-sm-3">
                                        <input
                                          type="text"
                                          class="form-control"
                                          :placeholder="
                                            $t(
                                              'placeholderLowRange'
                                            )
                                          "
                                          v-model="
                                            levelScale.scales[scaleIndex]
                                              .lowScale
                                          "
                                        />
                                      </div>
                                      <div class="col-sm-3">
                                        <input
                                          type="text"
                                          class="form-control"
                                          :placeholder="
                                            $t(
                                              'placeholderHighRange'
                                            )
                                          "
                                          v-model="
                                            levelScale.scales[scaleIndex]
                                              .highScale
                                          "
                                        />
                                      </div>
                                      <div class="col-sm-3">
                                        <input
                                          type="color"
                                          class="form-control"
                                          placeholder=""
                                          v-model="
                                            levelScale.scales[scaleIndex]
                                              .scaleColor
                                          "
                                        />
                                      </div>
                                    </div>
                                  </b-tab>
                                </b-tabs>
                              </div>
                            </div>
                            <div v-else class="form-group row">
                              <label class="col-sm-5 col-form-label">{{
                                $t("color")
                              }}</label>
                              <div class="col-sm-2">
                                <input
                                  type="color"
                                  class="form-control"
                                  placeholder=""
                                  v-model="chartData[index].indicator.color"
                                />
                              </div>
                              <div class="col-sm-5">
                                <input
                                  type="text"
                                  class="form-control"
                                  placeholder=""
                                  v-model="chartData[index].indicator.color"
                                />
                              </div>
                            </div>
                            <div class="form-group row">
                              <label class="col-sm-5 col-form-label">{{
                                $t("visible")
                              }}</label>
                              <div class="col-sm-7">
                                <b-form-checkbox
                                  checked="chartData[index].indicator.visible"
                                  v-model="chartData[index].indicator.visible"
                                  name="check-button"
                                  switch
                                  size="lg"
                                >
                                </b-form-checkbox>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="row m-0 mt-4 mb-2">
                          <div class="col-12 p-b-15px">
                            <div
                              class="
                                card-header
                                bg-faint-grey
                                color-black
                                border-radius-0
                                text-uppercase
                                f-s-0-875rem
                              "
                            >
                              {{ $t("dataMapping") }}
                            </div>
                          </div>
                          <!-- <template v-if="false"> -->
                          <div
                            class="col-12"
                            v-for="(subIndicator, ind) in chartData[index]
                              .indicator.subIndicator"
                            :key="ind"
                          >
                            <div class="row">
                              <div class="col">
                                <div
                                  class="form-check form-check-inline mr-0 hide"
                                >
                                  <div class="pure-checkbox">
                                    <input
                                      name="checkbox"
                                      type="checkbox"
                                      :id="
                                        'checkbox1' +
                                        chartBySubtype +
                                        index +
                                        ind
                                      "
                                    />
                                    <label
                                      :for="
                                        'checkbox1' +
                                        chartBySubtype +
                                        index +
                                        ind
                                      "
                                    ></label>
                                  </div>
                                </div>
                                <a
                                  data-toggle="collapse"
                                  :href="
                                    '#additionalSettingsCollapse' +
                                    chartBySubtype +
                                    ind +
                                    index +
                                    chartByType
                                  "
                                  role="button"
                                  aria-expanded="false"
                                  :aria-controls="
                                    'additionalSettingsCollapse' +
                                    chartBySubtype +
                                    ind +
                                    index +
                                    chartByType
                                  "
                                  class="pr-2"
                                  ><i
                                    class="fa fa-link f-s-20px"
                                    v-b-tooltip.hover
                                    :title="
                                      $t(
                                        'link_IndicatorsData_Elements'
                                      )
                                    "
                                  ></i
                                ></a>
                                <span>{{
                                  Array.isArray(
                                    chartData[index].indicator.subIndicator[ind]
                                      .name
                                  )
                                    ? chartData[index].indicator.subIndicator[
                                        ind
                                      ].name[0]
                                    : chartData[index].indicator.subIndicator[
                                        ind
                                      ].name
                                }}</span>
                              </div>
                            </div>
                            <div class="row my-3">
                              <div class="col-lg-12">
                                <div
                                  class="collapse border-grey"
                                  :id="
                                    'additionalSettingsCollapse' +
                                    chartBySubtype +
                                    ind +
                                    index +
                                    chartByType
                                  "
                                  :aria-labelledby="
                                    'additionalSettingsCollapse' +
                                    chartBySubtype +
                                    ind +
                                    index +
                                    chartByType
                                  "
                                >
                                  <div
                                    class="
                                      card-header
                                      bg-faint-grey
                                      default-card-border-radius
                                      color-black
                                      f-s-0-875rem
                                    "
                                  >
                                    {{
                                      $t("settings")
                                    }}
                                  </div>
                                  <div class="card card-body">
                                    <div class="row">
                                      <div class="col-12">
                                        <div class="form-group row hide">
                                          <label
                                            class="col-sm-5 col-form-label"
                                            >{{
                                              $t("identifier")
                                            }}</label
                                          >
                                          <div class="col-sm-7">
                                            <input
                                              type="text"
                                              class="form-control"
                                              placeholder=""
                                              :value="
                                                Array.isArray(
                                                  chartData[index].indicator
                                                    .subIndicator[ind]
                                                    .static_name
                                                )
                                                  ? $t(
                                                      `${chartData[index].indicator.subIndicator[ind].static_name[0]}`
                                                    )
                                                  : $t(
                                                      `${chartData[index].indicator.subIndicator[ind].static_name}`
                                                    )
                                              "
                                              disabled
                                            />
                                          </div>
                                        </div>
                                        <div class="form-group row">
                                          <label
                                            class="col-sm-5 col-form-label"
                                            >{{
                                              $t(
                                                "displayName"
                                              )
                                            }}</label
                                          >
                                          <div class="col-sm-7">
                                            <input
                                              type="text"
                                              class="form-control"
                                              placeholder=""
                                              v-model="
                                                chartData[index].indicator
                                                  .subIndicator[ind].name
                                              "
                                            />
                                          </div>
                                        </div>
                                        <div class="form-group row">
                                          <label
                                            class="col-sm-5 col-form-label"
                                            >{{
                                              $t(
                                                "color"
                                              )
                                            }}</label
                                          >
                                          <div class="col-sm-2">
                                            <input
                                              type="color"
                                              class="form-control"
                                              placeholder=""
                                              v-model="
                                                chartData[index].indicator
                                                  .subIndicator[ind].color
                                              "
                                            />
                                          </div>
                                          <div class="col-sm-5">
                                            <input
                                              type="text"
                                              class="form-control"
                                              placeholder=""
                                              v-model="
                                                chartData[index].indicator
                                                  .subIndicator[ind].color
                                              "
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div class="col-12">
                                        <div
                                          class="
                                            card-header
                                            bg-faint-grey
                                            color-black
                                            border-radius-0
                                            text-uppercase
                                            f-s-0-875rem
                                          "
                                        >
                                          {{
                                            $t(
                                              "indicators_Data_Elements_Mapping"
                                            )
                                          }}
                                        </div>
                                      </div>
                                      <div class="col-12">
                                        <AddMapping
                                          :ind="ind"
                                          :index="index"
                                          dataKey="subIndicator"
                                          :metrixList="metrixList"
                                          :chartByType="chartByType"
                                          :dataSetsList="dataSetsList"
                                          :chartBySubtype="chartBySubtype"
                                          :indicatorsList="indicatorsList"
                                          :dataElementsList="dataElementsList"
                                          :key="
                                            'add-mapping' +
                                            chartBySubtype +
                                            ind +
                                            chartByType +
                                            index
                                          "
                                          :mappingType="
                                            chartData[index].indicator
                                              .subIndicator[ind].type
                                          "
                                          :selectedDE="
                                            chartData[index].indicator
                                              .subIndicator[ind].selectedDE
                                          "
                                          @addDE="addDE"
                                          @resetDE="resetDE"
                                          @deleteDE="deleteDE"
                                          v-if="isDataFetched"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <!-- </template> -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
      <div class="row pt-4">
        <div class="col text-right">
          <button
            type="button"
            class="btn btn-primary black-btn"
            v-on:click="updateConfigData"
          >
            {{ $t("savebtn") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ppConfig from "@/config/programPrioritiesConfig.js";
import service from "@/service";
import audit from "../../audit.js";
import merge from "lodash/merge";
import assign from "lodash/assign";
export default {
  props: [
    "chartByModule",
    "chartByType",
    "chartBySubtype",
    "indicatorsList",
    "dataElementsList",
    "map",
    "mapData",
    "dataSetsList",
    "metrixList",
  ],
  components: {
    SyncMapping: () =>
      import(
        /* webpackChunkName: "admin_SyncMapping"*/ "@/components/config/SyncMapping"
      ),
    AddMapping: () =>
      import(
        /* webpackChunkName: "admin_AddMapping"*/ "@/components/config/AddMapping"
      ),
  },
  data() {
    let cData = ppConfig.adProgramModule[this.chartByType][this.chartBySubtype];
    return {
      categoryInfo: ppConfig.adProgramModule[this.chartByType]["categoryInfo"],

      cID: cData.cid ? cData.cid : "",

      disableChart: cData.disableChart ? cData.disableChart : false,

      chartType: cData.chartOptions.chart.type
        ? cData.chartOptions.chart.type
        : "",

      chartTitle: cData.chartOptions.title.title
        ? cData.chartOptions.title.title
        : "",

      chartTitleVisible: cData.chartOptions.title.visible
        ? cData.chartOptions.title.visible
        : "",

      chartSubTitle: cData.chartOptions.subTitle.subTitle
        ? cData.chartOptions.subTitle.subTitle
        : "",

      chartDataSource: cData.chartOptions.chartDataSource.text
        ? cData.chartOptions.chartDataSource.text
        : "",

      chartSubTitleVisible: cData.chartOptions.subTitle.visible
        ? cData.chartOptions.subTitle.visible
        : "",

      chartXAxisTitle: cData.chartOptions.xAxis.title.text
        ? cData.chartOptions.xAxis.title.text
        : "",

      chartXAxisTitleVisible: cData.chartOptions.xAxis.visible
        ? cData.chartOptions.xAxis.visible
        : "",

      chartYAxisTitle: cData.chartOptions.yAxis.title.text
        ? cData.chartOptions.yAxis.title.text
        : "",

      chartYAxisTitleVisible: cData.chartOptions.yAxis.visible
        ? cData.chartOptions.yAxis.visible
        : "",

      chartColor: cData.chartOptions.color ? cData.chartOptions.color : "",

      chartDataLabels: cData.dataLabels.enabled ? cData.dataLabels.enabled : "",

      chartName: cData.chartName ? cData.chartName : "",

      chartInfo: cData.chartInfo ? cData.chartInfo : "",

      chartData: cData.chartData ? cData.chartData : [],

      chartInfoMaxLength: 200,

      chartTitleMaxLength: 100,
      originalData: null,
      isDataFetched: false,
    };
  },
  computed: {
    chartInfoPlaceholder: function () {
      return this.$i18n.t("placeholderMaxValue", {
        number: this.chartInfoMaxLength,
      });
    },
  },
  watch: {},
  methods: {
    syncMapping(selectedLocaleToCopy) {
      console.log(selectedLocaleToCopy);
      this.$store.state.loading = true;
      let key = this.generateKey(
        this.chartByModule,
        true,
        true,
        selectedLocaleToCopy
      );

      let response = service.getSavedConfig(key);
      response.then((response) => {
        let data = response.data[this.chartByType][this.chartBySubtype],
          updatedData = [];

        this.chartData.forEach((c, i) => {
          let innerData = c.indicator,
            dataFromLocale = data.chartData.find((cLocale) => {
              if (Array.isArray(innerData.static_name)) {
                if (Array.isArray(cLocale.indicator.static_name)) {
                  return (
                    cLocale.indicator.static_name[0].toLowerCase() ===
                    innerData.static_name[0].toLowerCase()
                  );
                } else {
                  return (
                    cLocale.indicator.static_name.toLowerCase() ===
                    innerData.static_name[0].toLowerCase()
                  );
                }
              } else {
                if (Array.isArray(cLocale.indicator.static_name)) {
                  return (
                    cLocale.indicator.static_name[0].toLowerCase() ===
                    innerData.static_name.toLowerCase()
                  );
                } else {
                  return (
                    cLocale.indicator.static_name.toLowerCase() ===
                    innerData.static_name.toLowerCase()
                  );
                }
              }
            }),
            innerSubInd = [];
          if (dataFromLocale) {
            innerData.subIndicator.forEach((subInd, j) => {
              let dataFromSubLocale =
                dataFromLocale.indicator.subIndicator.find((cSubLocale) => {
                  if (Array.isArray(subInd.static_name)) {
                    if (Array.isArray(cSubLocale.static_name)) {
                      return (
                        cSubLocale.static_name[0].toLowerCase() ===
                        subInd.static_name[0].toLowerCase()
                      );
                    } else {
                      return (
                        cSubLocale.static_name.toLowerCase() ===
                        subInd.static_name[0].toLowerCase()
                      );
                    }
                  } else {
                    if (Array.isArray(cSubLocale.static_name)) {
                      return (
                        cSubLocale.static_name[0].toLowerCase() ===
                        subInd.static_name.toLowerCase()
                      );
                    } else {
                      return (
                        cSubLocale.static_name.toLowerCase() ===
                        subInd.static_name.toLowerCase()
                      );
                    }
                  }
                });
              if (dataFromSubLocale) {
                innerSubInd.push({
                  ...subInd,
                  de: dataFromSubLocale.de,
                  selectedDE: dataFromSubLocale.selectedDE,
                  type: dataFromSubLocale.type,
                  color: dataFromSubLocale.color,
                });
              } else {
                innerSubInd.push({
                  ...subInd,
                });
              }
            });
            updatedData.push({
              indicator: {
                ...innerData,
                subIndicator: innerSubInd,
                color: dataFromLocale.indicator.color,
                visible: dataFromLocale.indicator.visible,
              },
            });
          } else {
            updatedData.push({
              indicator: {
                ...innerData,
              },
            });
          }
        });
        this.chartData = updatedData;
        this.$store.state.loading = false;
        if (this.$refs.syncMapping) {
          this.$refs.syncMapping.syncMappingModal();
        }
        this.$nextTick(() => {
          this.updateConfigData();
        });
      });
    },
    //Delete specific mapping
    deleteDE({ index, ind, deIndex, dataKey }) {
      this.chartData[index].indicator[dataKey][ind].selectedDE.splice(
        deIndex,
        1
      );
      this.chartData[index].indicator[dataKey][ind].de.splice(deIndex, 1);
    },
    //Reset the mapping
    resetDE({ index, ind, dataKey }) {
      this.chartData[index].indicator[dataKey][ind].de = [];
      this.chartData[index].indicator[dataKey][ind].selectedDE = [];
    },
    //Store the selected mapping in configuration object
    addDE({ index, ind, type, selectedDataSource, dataKey }) {
      this.chartData[index].indicator[dataKey][ind].type = type;
      this.chartData[index].indicator[dataKey][ind].selectedDE.push(
        selectedDataSource
      );
      this.chartData[index].indicator[dataKey][ind].de.push(
        selectedDataSource.id
      );
    },
    //This is to fetch config data on page load
    getConfigData() {
      // console.log("data initial",[this.chartBySubtype],JSON.stringify(config))
      let key = this.generateKey(this.chartByModule);

      let response = service.getSavedConfig(key);
      response
        .then((response) => {
          // console.log(response)
          this.$emit("getBGInfo", response.data);
          if (
            response.data[this.chartByType] &&
            response.data[this.chartByType][this.chartBySubtype]
          ) {
            // console.log("response ministrial",[this.chartBySubtype],response.data)
            let data = response.data[this.chartByType][this.chartBySubtype];

            this.cID = data.cid ? data.cid : this.cID;
            this.disableChart = data.disableChart
              ? data.disableChart
              : this.disableChart;

            this.chartType = data.chartOptions.chart.type
              ? data.chartOptions.chart.type
              : this.chartType;
            this.chartTitle = data.chartOptions.title.title
              ? data.chartOptions.title.title
              : this.chartTitle;
            this.chartTitleVisible = data.chartOptions.title.visible
              ? data.chartOptions.title.visible
              : this.chartTitleVisible;
            this.chartSubTitle = data.chartOptions.subTitle.subTitle
              ? data.chartOptions.subTitle.subTitle
              : this.chartSubTitle;
            this.chartDataSource = data.chartOptions.chartDataSource.text
              ? data.chartOptions.chartDataSource.text
              : this.chartDataSource;
            this.chartSubTitleVisible = data.chartOptions.subTitle.visible
              ? data.chartOptions.subTitle.visible
              : this.chartSubTitleVisible;
            this.chartXAxisTitle = data.chartOptions.xAxis.title.text
              ? data.chartOptions.xAxis.title.text
              : this.chartXAxisTitle;
            this.chartXAxisTitleVisible = data.chartOptions.xAxis.visible
              ? data.chartOptions.xAxis.visible
              : this.chartXAxisTitleVisible;
            this.chartYAxisTitle = data.chartOptions.yAxis.title.text
              ? data.chartOptions.yAxis.title.text
              : this.chartYAxisTitle;
            this.chartYAxisTitleVisible = data.chartOptions.yAxis.visible
              ? data.chartOptions.yAxis.visible
              : this.chartYAxisTitleVisible;
            this.chartColor = data.chartOptions.color
              ? data.chartOptions.color
              : this.chartColor;
            this.chartDataLabels = data.dataLabels.enabled
              ? data.dataLabels.enabled
              : this.chartDataLabels;
            this.chartData = data.chartData.length
              ? merge(this.chartData, data.chartData)
              : this.chartData;
            this.chartName = data.chartName ? data.chartName : this.chartName;
            this.chartInfo = data.chartInfo ? data.chartInfo : this.chartInfo;
            this.categoryInfo = response.data[this.chartByType]["categoryInfo"]
              ? response.data[this.chartByType]["categoryInfo"]
              : this.categoryInfo;

            this.originalData = JSON.parse(JSON.stringify(data));
          }
          this.isDataFetched = true;
          this.$store.state.loading = false;
        })
        .catch((res) => {
          console.log("Config not found...");
          this.isDataFetched = true;
          this.$store.state.loading = false;
        });
    },
    //This is to update config data on click of save button
    async updateConfigData() {
      this.$store.state.loading = true;
      let saveData = false;
      if (!this.cID) {
        try {
          let resp = await service.createDHISChart(
            `${this.chartByModule} ${this.chartByType}`
          );
          if (resp.data.status === "OK") {
            this.cID = resp.data.response.uid;
            saveData = true;
          } else {
            saveData = true;
          }
        } catch (err) {
          // console.log(err)
          saveData = true;
        }
      } else {
        saveData = true;
      }
      if (saveData) {
        let chartBySubtypeData = {
          cid: this.cID,
          disableChart: this.disableChart,
          chartOptions: {
            chart: {
              type: this.chartType,
            },
            title: {
              text: "",
              title: this.chartTitle,
              visible: this.chartTitleVisible,
            },
            subTitle: {
              text: "",
              subTitle: this.chartSubTitle,
              visible: this.chartSubTitleVisible,
            },
            chartDataSource: {
              text: this.chartDataSource,
            },
            tooltip: {
                color: '#fff' ,
                shared: true,

                useHTML: true,
            },
            xAxis: {
              title: {
                text: this.chartXAxisTitle,
              },
              visible: this.chartXAxisTitleVisible,
            },
            yAxis: {
              title: {
                text: this.chartYAxisTitle,
              },
              visible: this.chartYAxisTitleVisible,
            },
            color: this.chartColor,
          },
          dataLabels: {
            enabled: this.chartDataLabels,
          },
          chartName: this.chartName,
          chartInfo: this.chartInfo,
          chartData: this.chartData,
        };

        let key = this.generateKey(this.chartByModule);

        let allKeys = service.getAllKeys();
        allKeys.then((keys) => {
          if (keys.data.includes(key)) {
            let saveConfig = service.getSavedConfig(key);
            saveConfig.then((res) => {
              let configData = res.data;
              // console.log("configData",configData);
              if (configData[this.chartByType]) {
                configData[this.chartByType][this.chartBySubtype] = configData[
                  this.chartByType
                ][this.chartBySubtype]
                  ? assign(
                      configData[this.chartByType][this.chartBySubtype],
                      chartBySubtypeData
                    )
                  : chartBySubtypeData;
              } else {
                configData[this.chartByType] = {
                  [this.chartBySubtype]: chartBySubtypeData,
                };
              }

              let configChanges = audit.configAudit(
                this.originalData,
                configData[this.chartByType][this.chartBySubtype]
              );
              // console.log("configChanges", configChanges)
              let response = service.updateConfig(configData, key);
              response
                .then((response) => {
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
                          this.chartByType,
                          this.chartBySubtype
                        );
                      }
                    });
                    this.getConfigData();

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
            let programPriority = {
              [this.chartByType]: {
                [this.chartBySubtype]: chartBySubtypeData,
              },
            };
            let response = service.saveConfig(programPriority, key);
            response.then((response) => {
              if (response.data.status === "OK") {
                // console.log("response save ", response.data)
                this.$swal({
                  title: this.$i18n.t("data_saved_successfully"),
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
            });
          }
        });
      }
    },
  },
  created() {
    this.$store.state.loading = true;
    this.getConfigData();
  },
};
</script>
