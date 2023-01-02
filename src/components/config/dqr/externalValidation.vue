<template>
  <div>
    <div :class="'card-body ' + chartBySubtype">
      <div class="form-group row">
        <label for="inputCategoryInfoDerived" class="col-sm-5 col-form-label">{{
          $t("catInformation")
        }}</label>
        <div class="col-sm-7">
          <vue-editor
            id="inputCategoryInfoDerived"
            v-model="chartOptions.categoryInfo"
            :state="chartOptions.categoryInfo.length !== 0"
            :editorToolbar="customToolbar"
            :placeholder="
              $t('enter_category_information')
            "
          ></vue-editor>
        </div>
      </div>
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
            <div class="row m-0 mt-4">
              <div class="col-sm-12 col-lg-6 mb-2">
                <div>
                  <b-form-group :label="$t('selectSources')">
                    <b-form-checkbox
                      v-for="option in sourceOptions"
                      v-model="selectedSource"
                      :key="option.value"
                      :value="option.value"
                      name="sourceOptions"
                      :disabled="
                        selectedSource.length === 2 &&
                        selectedSource.indexOf(option.value) === -1
                      "
                      switch
                    >
                      {{ option.text }}
                    </b-form-checkbox>
                  </b-form-group>
                </div>
              </div>
              <div class="col-sm-12 col-lg-6 mb-2">
                <div class="form-group row">
                  <label class="col-sm-5 col-form-label">{{
                    $t("color")
                  }}</label>
                  <div class="col-sm-2">
                    <input
                      type="color"
                      class="form-control"
                      placeholder=""
                      v-model="chartOptions.color"
                    />
                  </div>
                  <div class="col-sm-5">
                    <input
                      type="text"
                      class="form-control"
                      placeholder=""
                      v-model="chartOptions.color"
                    />
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-sm-5 col-form-label">{{
                    $t("trend_color")
                  }}</label>
                  <div class="col-sm-2">
                    <input
                      type="color"
                      class="form-control"
                      placeholder=""
                      v-model="chartOptions.trendlineColor"
                    />
                  </div>
                  <div class="col-sm-5">
                    <input
                      type="text"
                      class="form-control"
                      placeholder=""
                      v-model="chartOptions.trendlineColor"
                    />
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-sm-5 col-form-label">{{
                    $t("outliers_color")
                  }}</label>
                  <div class="col-sm-2">
                    <input
                      type="color"
                      class="form-control"
                      placeholder=""
                      v-model="chartOptions.outliersColor"
                    />
                  </div>
                  <div class="col-sm-5">
                    <input
                      type="text"
                      class="form-control"
                      placeholder=""
                      v-model="chartOptions.outliersColor"
                    />
                  </div>
                </div>
              </div>
              <div class="col-sm-12 col-lg-6 mb-2">
                <div class="form-group row">
                  <label class="col-sm-5 col-form-label">{{
                    $t("chart_title")
                  }}</label>
                  <div class="col-sm-2 pr-0">
                    <b-form-checkbox
                      checked="chartTitleVisible"
                      v-model="chartOptions.title.visible"
                      name="someSwitchOptionTitle"
                      switch
                      size="lg"
                      class="mt-1"
                    />
                  </div>
                  <transition name="slide-fade">
                    <div
                      class="col-sm-5 pl-0"
                      v-if="chartOptions.title.visible"
                    >
                      <input
                        type="text"
                        class="form-control"
                        placeholder=""
                        v-model="chartOptions.title.text"
                      />
                    </div>
                  </transition>
                </div>
              </div>
              <div class="col-sm-12 col-lg-6 mb-2">
                <div class="form-group row">
                  <label
                    for="inputChartSubtitle"
                    class="col-sm-5 col-form-label"
                    >{{ $t("chart_subtitle") }}</label
                  >
                  <div class="col-sm-2 pr-0">
                    <b-form-checkbox
                      checked="chartSubTitleVisible"
                      v-model="chartOptions.subTitle.visible"
                      name="someSwitchOptionSubtitle"
                      switch
                      size="lg"
                      class="mt-1"
                    />
                  </div>
                  <transition name="slide-fade">
                    <div
                      class="col-sm-5 pl-0"
                      v-if="chartOptions.subTitle.visible"
                    >
                      <input
                        type="text"
                        class="form-control"
                        id="inputChartSubtitle"
                        v-model="chartOptions.subTitle.text"
                      />
                    </div>
                  </transition>
                </div>
              </div>
              <div class="col-sm-12 col-lg-6 mb-2">
                <div class="form-group row">
                  <label class="col-sm-5 col-form-label">{{
                    $t("x-axis")
                  }}</label>
                  <div class="col-sm-2 pr-0">
                    <b-form-checkbox
                      checked="chartXAxisTitleVisible"
                      v-model="chartOptions.xAxis.visible"
                      name="someSwitchOptionXAxis"
                      switch
                      size="lg"
                      class="mt-1"
                    />
                  </div>
                  <transition name="slide-fade">
                    <div
                      class="col-sm-5 pl-0"
                      v-if="chartOptions.xAxis.visible"
                    >
                      <input
                        type="text"
                        class="form-control"
                        placeholder=""
                        v-model="chartOptions.xAxis.text"
                      />
                    </div>
                  </transition>
                </div>
              </div>
              <div class="col-sm-12 col-lg-6 mb-2">
                <div class="form-group row">
                  <label class="col-sm-5 col-form-label">{{
                    $t("y-axis")
                  }}</label>
                  <div class="col-sm-2 pr-0">
                    <b-form-checkbox
                      checked="chartYAxisTitleVisible"
                      v-model="chartOptions.yAxis.visible"
                      name="someSwitchOptionYAxis"
                      switch
                      size="lg"
                      class="mt-1"
                    />
                  </div>
                  <transition name="slide-fade">
                    <div
                      class="col-sm-5 pl-0"
                      v-if="chartOptions.yAxis.visible"
                    >
                      <input
                        type="text"
                        class="form-control"
                        placeholder=""
                        v-model="chartOptions.yAxis.text"
                      />
                    </div>
                  </transition>
                </div>
              </div>
              <div class="col-sm-12 col-lg-6 mb-2" v-if="selectedSource.length === 2">
                <div class="form-group row">
                  <label class="col-sm-5 col-form-label"
                    >{{ $t("x-axis") }}
                    {{ $t("source") }}</label
                  >
                  <div class="col-sm-7">
                    <input
                      type="text"
                      class="form-control"
                      placeholder=""
                      v-model="xySources[0]"
                      readonly
                    />
                  </div>
                </div>
              </div>
              <div class="col-sm-12 col-lg-6 mb-2" v-if="selectedSource.length === 2">
                <div class="form-group row">
                  <label class="col-sm-5 col-form-label"
                    >{{ $t("y-axis") }}
                    {{ $t("source") }}</label
                  >
                  <div class="col-sm-7">
                    <input
                      type="text"
                      class="form-control"
                      placeholder=""
                      v-model="xySources[1]"
                      readonly
                    />
                  </div>
                </div>
              </div>
              <div class="col-sm-12 col-lg-6 mb-2" v-if="selectedSource.length === 2">
                <div class="form-group row">
                  <label class="col-sm-5 col-form-label">{{
                    $t("min_outlier")
                  }}</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      class="form-control"
                      placeholder=""
                      v-model="chartOptions.minOutlier"
                    />
                  </div>
                </div>
              </div>
              <div class="col-sm-12 col-lg-6 mb-2" v-if="selectedSource.length === 2">
                <div class="form-group row">
                  <label class="col-sm-5 col-form-label">{{
                    $t("wastageFactor")
                  }}</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      class="form-control"
                      placeholder=""
                      v-model="chartOptions.wastageFactor"
                    />
                  </div>
                </div>
              </div>
              <div class="col-sm-12 col-lg-6 mb-2" v-if="selectedSource.length === 1">
                <div class="form-group row">
                  <label class="col-sm-5 col-form-label">{{
                    $t("qualityThreshold")
                  }}</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      class="form-control"
                      placeholder=""
                      v-model="chartOptions.qualityThreshold"
                    />
                  </div>
                </div>
              </div>
              <div class="col-sm-12 col-lg-6 mb-2">
                <div class="form-group row">
                  <label class="col-sm-5 col-form-label">{{
                    $t("source")
                  }}</label>
                  <div class="col-sm-7">
                    <input
                      type="text"
                      class="form-control"
                      :placeholder="$t('chart_source')"
                      v-model="chartOptions.chartDataSource.text"
                    />
                  </div>
                </div>
              </div>
              <div class="col-sm-12 col-lg-12 mb-2">
                <div class="form-group row">
                  <label class="col-sm-5 col-lg-6 col-form-label">{{
                    $t("chartHeading")
                  }}</label>
                  <div class="col-sm-7 col-lg-6">
                    <b-form-textarea
                      id="inputChartInfoDerived"
                      v-model="chartOptions.chartName"
                      :state="
                        chartOptions.chartName.length !== 0 &&
                        chartOptions.chartName.length <= chartTitleMaxLength
                      "
                      placeholder=""
                      rows="3"
                      :maxlength="chartTitleMaxLength"
                    ></b-form-textarea>
                    <span
                      >{{ chartOptions.chartName.length }}/{{
                        chartTitleMaxLength
                      }}</span
                    >
                  </div>
                </div>
              </div>
              <div class="col-sm-12 col-lg-12 mb-2">
                <div class="form-group row">
                  <label class="col-sm-5 col-lg-6 col-form-label">{{
                    $t("chartInformation")
                  }}</label>
                  <div class="col-sm-7 col-lg-6">
                    <b-form-textarea
                      id="inputChartInfo"
                      v-model="chartOptions.chartInfo"
                      :state="
                        chartOptions.chartInfo.length !== 0 &&
                        chartOptions.chartInfo.length <= chartInfoMaxLength
                      "
                      :placeholder="chartInfoPlaceholder"
                      rows="3"
                      :maxlength="chartInfoMaxLength"
                    ></b-form-textarea>
                    <span
                      >{{ chartOptions.chartInfo.length }}/{{
                        chartInfoMaxLength
                      }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col">
              <div class="card">
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
                  {{ $t("mapping") }}
                </div>
                <div class="card-body px-0">
                  <div
                    class="text-right"
                    v-if="$root.defaultLanguageLocale !== $i18n.locale"
                  >
                    <SyncMapping ref="syncMapping" @syncMapping="syncMapping" />
                  </div>
                  <b-tabs card class="border">
                    <template v-for="(value, name, index) in chartData">
                      <b-tab
                        :title="value.static_name"
                        v-if="selectedSource.includes(name)"
                        :key="index"
                      >
                        <b-card-text>
                          <div
                            class="row mx-0 mt-3"
                            v-for="(chart, ind) in value.chartData"
                            :key="ind"
                          >
                            <div class="col-12">
                              <div
                                class="default-card-border-radius"
                                :id="
                                  'headingChartSettings' +
                                  index +
                                  chartBySubtype
                                "
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
                                      ind +
                                      chartBySubtype +
                                      chartByType +
                                      name
                                    "
                                    aria-expanded="false"
                                    :aria-controls="
                                      'collapseChartSettings' +
                                      ind +
                                      chartBySubtype +
                                      chartByType +
                                      name
                                    "
                                  >
                                    <i
                                      class="
                                        fa fa-cog
                                        f-s-20px
                                        pr-2
                                      "
                                      v-b-tooltip.hover
                                      :title="$t('dataMapping')"
                                    ></i>
                                    {{
                                      Array.isArray(chart.indicator.static_name)
                                        ? $t(
                                            `${chart.indicator.static_name[0]}`
                                          )
                                        : $t(
                                            `${chart.indicator.static_name}`
                                          )
                                    }}
                                  </button>
                                </h2>
                              </div>
                              <div
                                :id="
                                  'collapseChartSettings' +
                                  ind +
                                  chartBySubtype +
                                  chartByType +
                                  name
                                "
                                class="collapse collapse-section-border mb-2"
                                :aria-labelledby="
                                  'headingChartSettings' +
                                  ind +
                                  chartBySubtype +
                                  chartByType +
                                  name
                                "
                              >
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
                                  <div
                                    class="col-12"
                                    v-for="(subIndicator, indx) in chart
                                      .indicator.subIndicator"
                                    :key="indx"
                                  >
                                    <div class="row">
                                      <div class="col">
                                        <div
                                          class="
                                            form-check form-check-inline
                                            mr-0
                                            hide
                                          "
                                        >
                                          <div class="pure-checkbox">
                                            <input
                                              name="checkbox"
                                              type="checkbox"
                                              :id="
                                                'checkbox1' +
                                                chartBySubtype +
                                                index +
                                                ind +
                                                indx
                                              "
                                            />
                                            <label
                                              :for="
                                                'checkbox1' +
                                                chartBySubtype +
                                                index +
                                                ind +
                                                indx
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
                                            indx +
                                            chartByType +
                                            name
                                          "
                                          role="button"
                                          aria-expanded="false"
                                          :aria-controls="
                                            'additionalSettingsCollapse' +
                                            chartBySubtype +
                                            ind +
                                            index +
                                            indx +
                                            chartByType +
                                            name
                                          "
                                          class="pr-2"
                                          ><i
                                            class="
                                              fa fa-link
                                              color-black
                                              f-s-20px
                                            "
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
                                            subIndicator.static_name
                                          )
                                            ? $t(
                                                `${subIndicator.static_name[0]}`
                                              )
                                            : $t(
                                                `${subIndicator.static_name}`
                                              )
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
                                            indx +
                                            chartByType +
                                            name
                                          "
                                          :aria-labelledby="
                                            'additionalSettingsCollapse' +
                                            chartBySubtype +
                                            ind +
                                            index +
                                            indx +
                                            chartByType +
                                            name
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
                                              $t(
                                                "settings"
                                              )
                                            }}
                                          </div>
                                          <div class="card card-body">
                                            <div class="row">
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
                                                  :ind="indx"
                                                  :name="name"
                                                  :index="ind"
                                                  dataKey="subIndicator"
                                                  :metrixList="metrixList"
                                                  :chartByType="chartByType"
                                                  :dataSetsList="dataSetsList"
                                                  :chartBySubtype="
                                                    chartBySubtype
                                                  "
                                                  :indicatorsList="
                                                    indicatorsList
                                                  "
                                                  :dataElementsList="
                                                    dataElementsList
                                                  "
                                                  :key="
                                                    'add-mapping' +
                                                    chartBySubtype +
                                                    ind +
                                                    chartByType +
                                                    indx +
                                                    name
                                                  "
                                                  :mappingType="
                                                    subIndicator.type
                                                  "
                                                  :selectedDE="
                                                    subIndicator.selectedDE
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
                                </div>
                              </div>
                            </div>
                          </div>
                        </b-card-text>
                      </b-tab>
                    </template>
                  </b-tabs>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-3 mb-4" v-if="derivedCharts.length && selectedSource.length === 2">
            <div class="col">
              <div class="card">
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
                  {{ $t("derivedChartsSetting") }}
                </div>
                <div class="card-body">
                  <div
                    class="mb-3"
                    v-for="(derived, ind) in derivedCharts"
                    :key="ind"
                  >
                    <div
                      class="
                        card-header
                        p-5px
                        bg-faint-grey
                        default-card-border-radius
                      "
                      :id="
                        'headingChartSettings' +
                        chartBySubtype +
                        chartByType +
                        ind
                      "
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
                            '#collapseChartSettings' +
                            chartBySubtype +
                            chartByType +
                            ind
                          "
                          aria-expanded="false"
                          :aria-controls="
                            'collapseChartSettings' +
                            chartBySubtype +
                            chartByType +
                            ind
                          "
                        >
                          {{ derived.chartOptions.chartName }}
                        </button>
                      </h2>
                    </div>
                    <div
                      :id="
                        'collapseChartSettings' +
                        chartBySubtype +
                        chartByType +
                        ind
                      "
                      class="collapse collapse-section-border"
                      :aria-labelledby="
                        'headingChartSettings' +
                        chartBySubtype +
                        chartByType +
                        ind
                      "
                    >
                      <div class="row m-0 mt-4 mb-2">
                        <div class="col-sm-12 col-lg-6">
                          <div class="form-group row">
                            <label class="col-sm-5 col-form-label">{{
                              $t("disable_chart")
                            }}</label>
                            <div class="col-sm-7 pr-0">
                              <b-form-checkbox
                                checked="derived.chartOptions.disableChart"
                                v-model="derived.chartOptions.disableChart"
                                name="disableChartTitle"
                                switch
                                size="lg"
                                class="mt-1"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <transition name="slide-fade">
                        <div v-if="!derived.chartOptions.disableChart">
                          <div class="row m-0 mb-2">
                            <div class="col-sm-12 col-lg-6">
                              <div class="form-group row">
                                <label class="col-sm-5 col-form-label">{{
                                  $t("chartHeading")
                                }}</label>
                                <div class="col-sm-7">
                                  <b-form-textarea
                                    id="inputChartInfoDerived"
                                    v-model="derived.chartOptions.chartName"
                                    :state="
                                      derived.chartOptions.chartName.length !==
                                        0 &&
                                      derived.chartOptions.chartName.length <=
                                        chartTitleMaxLength
                                    "
                                    placeholder=""
                                    rows="3"
                                    :maxlength="chartTitleMaxLength"
                                  ></b-form-textarea>
                                  <span
                                    >{{
                                      derived.chartOptions.chartName.length
                                    }}/{{ chartTitleMaxLength }}</span
                                  >
                                </div>
                              </div>
                            </div>
                            <div class="col-sm-12 col-lg-6">
                              <div class="form-group row">
                                <label class="col-sm-5 col-form-label">{{
                                  $t("color")
                                }}</label>
                                <div class="col-sm-2">
                                  <input
                                    type="color"
                                    class="form-control"
                                    placeholder=""
                                    v-model="derived.chartOptions.color"
                                  />
                                </div>
                                <div class="col-sm-5">
                                  <input
                                    type="text"
                                    class="form-control"
                                    placeholder=""
                                    v-model="derived.chartOptions.color"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="row m-0 mb-2">
                            <div class="col-sm-12 col-lg-6">
                              <div class="form-group row">
                                <label class="col-sm-5 col-form-label">{{
                                  $t("chart_title")
                                }}</label>
                                <div class="col-sm-2 pr-0">
                                  <b-form-checkbox
                                    checked="chartTitleVisible"
                                    v-model="derived.chartOptions.title.visible"
                                    name="someSwitchOptionTitle"
                                    switch
                                    size="lg"
                                    class="mt-1"
                                  />
                                </div>
                                <transition name="slide-fade">
                                  <div
                                    class="col-sm-5 pl-0"
                                    v-if="derived.chartOptions.title.visible"
                                  >
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder=""
                                      v-model="derived.chartOptions.title.text"
                                    />
                                  </div>
                                </transition>
                              </div>
                            </div>
                            <div class="col-sm-12 col-lg-6">
                              <div class="form-group row">
                                <label
                                  for="inputChartSubtitle"
                                  class="col-sm-5 col-form-label"
                                  >{{
                                    $t("chart_subtitle")
                                  }}</label
                                >
                                <div class="col-sm-2 pr-0">
                                  <b-form-checkbox
                                    checked="chartSubTitleVisible"
                                    v-model="
                                      derived.chartOptions.subTitle.visible
                                    "
                                    name="someSwitchOptionSubtitle"
                                    switch
                                    size="lg"
                                    class="mt-1"
                                  />
                                </div>
                                <transition name="slide-fade">
                                  <div
                                    class="col-sm-5 pl-0"
                                    v-if="derived.chartOptions.subTitle.visible"
                                  >
                                    <input
                                      type="text"
                                      class="form-control"
                                      id="inputChartSubtitle"
                                      v-model="
                                        derived.chartOptions.subTitle.text
                                      "
                                    />
                                  </div>
                                </transition>
                              </div>
                            </div>
                          </div>
                          <div class="row m-0 mb-2">
                            <div class="col-sm-12 col-lg-6">
                              <div class="form-group row">
                                <label class="col-sm-5 col-form-label">{{
                                  $t("x-axis")
                                }}</label>
                                <div class="col-sm-2 pr-0">
                                  <b-form-checkbox
                                    checked="chartXAxisTitleVisible"
                                    v-model="derived.chartOptions.xAxis.visible"
                                    name="someSwitchOptionXAxis"
                                    switch
                                    size="lg"
                                    class="mt-1"
                                  />
                                </div>
                                <transition name="slide-fade">
                                  <div
                                    class="col-sm-5 pl-0"
                                    v-if="derived.chartOptions.xAxis.visible"
                                  >
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder=""
                                      v-model="derived.chartOptions.xAxis.text"
                                    />
                                  </div>
                                </transition>
                              </div>
                            </div>
                            <div class="col-sm-12 col-lg-6">
                              <div class="form-group row">
                                <label class="col-sm-5 col-form-label">{{
                                  $t("y-axis")
                                }}</label>
                                <div class="col-sm-2 pr-0">
                                  <b-form-checkbox
                                    checked="chartYAxisTitleVisible"
                                    v-model="derived.chartOptions.yAxis.visible"
                                    name="someSwitchOptionYAxis"
                                    switch
                                    size="lg"
                                    class="mt-1"
                                  />
                                </div>
                                <transition name="slide-fade">
                                  <div
                                    class="col-sm-5 pl-0"
                                    v-if="derived.chartOptions.yAxis.visible"
                                  >
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder=""
                                      v-model="derived.chartOptions.yAxis.text"
                                    />
                                  </div>
                                </transition>
                              </div>
                            </div>
                          </div>
                          <div class="row m-0 mb-2">
                            <div class="col-sm-12 col-lg-12">
                              <div class="form-group row">
                                <label
                                  class="col-sm-5 col-lg-6 col-form-label"
                                  >{{
                                    $t(
                                      "chartInformation"
                                    )
                                  }}</label
                                >
                                <div class="col-sm-7 col-lg-6">
                                  <b-form-textarea
                                    id="inputChartInfo"
                                    v-model="derived.chartOptions.chartInfo"
                                    :state="
                                      derived.chartOptions.chartInfo.length !==
                                        0 &&
                                      derived.chartOptions.chartInfo.length <=
                                        chartInfoMaxLength
                                    "
                                    :placeholder="chartInfoPlaceholder"
                                    rows="3"
                                    :maxlength="chartInfoMaxLength"
                                  ></b-form-textarea>
                                  <span
                                    >{{
                                      derived.chartOptions.chartInfo.length
                                    }}/{{ chartInfoMaxLength }}</span
                                  >
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </transition>
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
import config from "@/config/externalValidationConfig.js";
import service from "@/service";
import { VueEditor } from "vue2-editor";
import merge from "lodash/merge";
import assign from "lodash/assign";
import audit from "../audit.js";
import VueEditorOptionMixin from "@/helpers/VueEditorOptionMixin";
export default {
  props: [
    "chartByModule",
    "chartByType",
    "chartBySubtype",
    "indicatorsList",
    "dataElementsList",
    "dataSetsList",
    "metrixList",
  ],
  mixins: [VueEditorOptionMixin],
  components: {
    VueEditor,
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
    // console.log(this.chartBySubtype, this.indicatorsList)
    let cData =
      config[this.chartByModule][this.chartByType][this.chartBySubtype];
    return {
      cID: cData.cid ? cData.cid : "",

      disableChart: cData.disableChart ? cData.disableChart : false,

      selectedSource: cData.selectedSource ? cData.selectedSource : [],

      chartOptions: cData.chartOptions ? cData.chartOptions : {},

      derivedCharts: cData.derivedCharts ? cData.derivedCharts : [],

      chartData: cData,

      chartInfoMaxLength: 200,

      chartTitleMaxLength: 100,

      sourceOptions: [
        {
          value: "Visits",
          text: "Visits",
        },
        {
          value: "Commodities_Client",
          text: "Commodities (Client)",
        },
        {
          value: "Commodities_Facilities",
          text: "Commodities (Facilities)",
        },
      ],
      originalData: null,
      isDataFetched: false,
    };
  },
  computed: {
    xySources: function () {
      if (this.selectedSource && this.selectedSource.length) {
        return this.selectedSource.map((m) => {
          let sourceText = this.sourceOptions.find((s) => s.value === m).text;
          return sourceText;
          // if (m.split('_').length > 1) {
          //   return `${m.split('_')[0]} (${m.split('_')[1]})`
          // } else {
          //   return m
          // }
        });
      } else {
        return [];
      }
    },
    chartInfoPlaceholder: function () {
      return this.$i18n.t("placeholderMaxValue", {
        number: this.chartInfoMaxLength,
      });
    },
  },
  watch: {},
  methods: {
    syncMapping(selectedLocaleToCopy) {
      // console.log(selectedLocaleToCopy)
      this.$store.state.loading = true;
      let key = this.generateKey(
        this.chartByModule,
        true,
        true,
        selectedLocaleToCopy
      );

      let response = service.getSavedConfig(key);
      response.then((response) => {
        // console.log(this.chartData)
        // console.log(this.chartData.selectedSource)
        // console.log(this.chartData.selectedSource[0])
        let data = response.data[this.chartByType][this.chartBySubtype],
          updatedData = {};

        // console.log("data",data)
        this.chartData.selectedSource.forEach((s) => {
          let mUpdated = [];
          this.chartData[s].chartData.forEach((c, i) => {
            let innerData = c.indicator,
              dataFromLocale = data[s].chartData.find((cLocale) => {
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
              mUpdated.push({
                indicator: {
                  ...innerData,
                  subIndicator: innerSubInd,
                  color: dataFromLocale.indicator.color,
                  visible: dataFromLocale.indicator.visible,
                },
              });
            } else {
              mUpdated.push({
                indicator: {
                  ...innerData,
                },
              });
            }
          });

          updatedData[s] = {
            ...this.chartData[s],
            chartData: mUpdated,
          };
        });
        this.chartData = {
          ...this.chartData,
          ...updatedData,
        };
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
    deleteDE({ index, ind, deIndex, dataKey, name }) {
      this.chartData[name].chartData[index].indicator[dataKey][
        ind
      ].selectedDE.splice(deIndex, 1);
      this.chartData[name].chartData[index].indicator[dataKey][ind].de.splice(
        deIndex,
        1
      );
    },
    //Reset the mapping
    resetDE({ index, ind, dataKey, name }) {
      this.chartData[name].chartData[index].indicator[dataKey][ind].de = [];
      this.chartData[name].chartData[index].indicator[dataKey][ind].selectedDE =
        [];
    },
    //Store the selected mapping in configuration object
    addDE({ index, ind, type, selectedDataSource, dataKey, name }) {
      this.chartData[name].chartData[index].indicator[dataKey][ind].type = type;
      this.chartData[name].chartData[index].indicator[dataKey][
        ind
      ].selectedDE.push(selectedDataSource);
      this.chartData[name].chartData[index].indicator[dataKey][ind].de.push(
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
            let cData = response.data[this.chartByType][this.chartBySubtype];
            // console.log(cData)
            this.cID = cData.cid ? cData.cid : this.cID;

            this.disableChart = cData.disableChart ? cData.disableChart : false;

            this.selectedSource = cData.selectedSource
              ? cData.selectedSource
              : this.selectedSource;

            this.chartOptions = cData.chartOptions
              ? merge(this.chartOptions, cData.chartOptions)
              : this.chartOptions;

            this.derivedCharts = cData.derivedCharts
              ? merge(this.derivedCharts, cData.derivedCharts)
              : this.derivedCharts;

            this.chartData = cData
              ? merge(this.chartData, cData)
              : this.chartData;
            this.originalData = JSON.parse(JSON.stringify(cData));
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

      let dCharts = [];
      if (this.derivedCharts.length) {
        dCharts = this.derivedCharts.map(async (d, index) => {
          let cid = "";
          if (d.chartOptions && !d.chartOptions.cid) {
            try {
              let resp = await service.createDHISChart(
                `${this.chartByModule} ${d.chartOptions.chartName}`
              );
              if (resp.data.status === "OK") {
                cid = resp.data.response.uid;
              }
            } catch (err) {
              console.log(err);
            }
          } else {
            return d;
          }
          return {
            chartOptions: {
              ...d.chartOptions,
              cid,
            },
          };
        });
        dCharts = await Promise.all(dCharts);
      }

      if (saveData) {
        let chartBySubtypeData = {
          ...this.chartData,
          cid: this.cID,
          disableChart: this.disableChart,
          selectedSource: this.selectedSource,
          chartOptions: this.chartOptions,
          derivedCharts: dCharts,
        };

        let key = this.generateKey(this.chartByModule);

        let allKeys = service.getAllKeys();
        allKeys.then((keys) => {
          if (keys.data.includes(key)) {
            let saveConfig = service.getSavedConfig(key);
            saveConfig.then((res) => {
              let configData = res.data;
              // console.log("configData", configData);
              if (configData[this.chartByType]) {
                configData[this.chartByType] = {
                  ...configData[this.chartByType],
                  [this.chartBySubtype]: configData[this.chartByType][
                    this.chartBySubtype
                  ]
                    ? assign(
                        configData[this.chartByType][this.chartBySubtype],
                        chartBySubtypeData
                      )
                    : chartBySubtypeData,
                };
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
            let ministrial = {
              [this.chartByType]: {
                [this.chartBySubtype]: chartBySubtypeData,
              },
            };
            let response = service.saveConfig(ministrial, key);
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
      } else {
        this.$store.state.loading = false;
      }
    },
  },
  created() {
    this.$store.state.loading = true;
    if (this.$i18n.locale === "fr") {
      this.sourceOptions = [
        {
          value: "Visits",
          text: this.$i18n.t("visits"),
        },
        {
          value: "Commodities_Client",
          text: this.$i18n.t("Commodities_Client"),
        },
        {
          value: "Commodities_Facilities",
          text: this.$i18n.t(
            "Commodities_Facilities"
          ),
        },
      ];
    }
    this.getConfigData();
  },
};
</script>
