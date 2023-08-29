<template>
  <div>
    <div :class="'card-body ' + chartBySubtype">
      <div class="row">
        <div class="col-lg-12">
          <div class="form-group row">
            <label for="finalYear" class="col-sm-4 col-form-label">{{
              $t("catInformation")
            }}</label>
            <div class="col-sm-8">
              <b-input-group>
                <vue-editor
                  v-model="categoryInfo[$i18n.locale]"
                  :state="
                    categoryInfo &&
                    categoryInfo[$i18n.locale] &&
                    categoryInfo[$i18n.locale].length !== 0
                  "
                  :editorToolbar="customToolbar"
                  disabled
                ></vue-editor>
                <b-input-group-append is-text>
                  <Translations :transText.sync="categoryInfo" type="editor" />
                </b-input-group-append>
              </b-input-group>
            </div>
          </div>
          <div class="form-group row" v-if="dataOnContraceptive">
            <label for="conterceptiveYesNo" class="col-sm-4 col-form-label">{{
              $t("emu_mon_quest")
            }}</label>
            <div class="col-sm-8">
              <div class="select-wrapper">
                <select class="form-control" v-model="dataOnContraceptive">
                  <option value="Yes">
                    {{ $t("yes") }}
                  </option>
                  <option value="No">
                    {{ $t("no") }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <transition name="slide-fade">
        <div v-if="dataOnContraceptive !== 'No'">
          <div class="form-group row hide" v-if="chartBySubtype !== 'Output'">
            <label for="initialYear" class="col-sm-4 col-form-label">{{
              $t("emu_initial_year_quest")
            }}</label>
            <div class="col-sm-8">
              <input
                type="number"
                class="form-control"
                id="initialYear"
                placeholder=""
                v-model="initialYear"
              />
            </div>
          </div>
          <div class="form-group row hide" v-if="chartBySubtype !== 'Output'">
            <label for="finalYear" class="col-sm-4 col-form-label">{{
              $t("emu_final_year_quest")
            }}</label>
            <div class="col-sm-8">
              <input
                type="number"
                class="form-control"
                id="finalYear"
                placeholder=""
                v-model="finalYear"
              />
            </div>
          </div>
          <div class="accordion" role="tablist">
            <b-card no-body class="mb-1">
              <b-card-header
                header-tag="header"
                class="p-1 map-header f-s-0-875rem font-weight-bold"
                role="tab"
              >
                <b-button block v-b-toggle.accordion-an12 variant="info">
                  {{ $t("mapping") }}</b-button
                >
              </b-card-header>
              <b-collapse
                id="accordion-an12"
                accordion="my-accordion"
                role="tabpanel"
                class="border-module"
              >
                <b-card-body>
                  <b-card-text>
                    <div class="row" v-if="chartData.length">
                      <div class="col">
                        <div class="card">
                          <div class="card-body">
                            <div>
                              <b-alert show class="">
                                <!-- <i class="fa-duotone fa-circle-info f-s-20px pr-2"></i> -->
                                <div>{{ $t("DQRICChanges") }}</div>
                              </b-alert>
                            </div>
                            <div class="form-group row">
                              <label
                                for="finalYear"
                                class="col-sm-3 col-form-label"
                                >{{ $t("catInformation") }}</label
                              >
                              <div class="col-sm-9">
                                <b-input-group>
                                  <vue-editor
                                    v-model="tabCategoryInfo[0][$i18n.locale]"
                                    :editorToolbar="customToolbar"
                                    disabled
                                  ></vue-editor>
                                  <b-input-group-append is-text>
                                    <Translations
                                      :transText.sync="tabCategoryInfo[0]"
                                      type="editor"
                                    />
                                  </b-input-group-append>
                                </b-input-group>
                              </div>
                            </div>
                            <div
                              class="row"
                              v-for="(chart, index) in chartData"
                              :key="index"
                            >
                              <div class="col-12">
                                <div
                                  class="default-card-border-radius accordion-delete"
                                  :id="
                                    'headingChartSettings' +
                                    index +
                                    chartBySubtype
                                  "
                                >
                                  <!-- mb-0 class removed to remove fa-plus icon from right corner -->
                                  <h2 class="">
                                    <button
                                      class="btn p-0 w-100 text-left text-uppercase color-default f-s-0-875rem"
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
                                      <!-- <i
                                        class="fa fa-cog f-s-20px pr-2"
                                        v-b-tooltip.hover
                                        :title="$t('dataMapping')"
                                      ></i> -->
                                      <img
                                        src="@/assets/images/icons/adminsetting-icon.svg"
                                        :style="{ filter: filterColor }"
                                        class="pr-2 cursor-pointer f-s-20px mb-lg-1"
                                        v-b-tooltip.hover
                                        :title="$t('dataMapping')"
                                      />
                                      {{
                                        chartData[index].indicator.name[
                                          $i18n.locale
                                        ]
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
                                  class="collapse mt-3 translate-adminheight"
                                  :aria-labelledby="
                                    'headingChartSettings' +
                                    index +
                                    chartBySubtype +
                                    chartByType
                                  "
                                >
                                  <div class="row m-0 mb-2">
                                    <div class="col-sm-12 col-lg-6">
                                      <div class="form-group row mt-3">
                                        <label
                                          class="col-sm-6 col-form-label"
                                          >{{ $t("disable_chart") }}</label
                                        >
                                        <div class="col-sm-6 pr-0">
                                          <b-form-checkbox
                                            checked="derived.chartOptions.disableChart"
                                            v-model="
                                              chart.indicator.disableChart
                                            "
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
                                    <div v-if="!chart.indicator.disableChart">
                                      <div class="row m-0 mb-2">
                                        <div class="col-sm-12 col-lg-6">
                                          <div class="form-group row">
                                            <label
                                              class="col-sm-6 col-form-label"
                                              >{{ $t("displayName") }}</label
                                            >
                                            <div class="col-sm-6">
                                              <b-input-group>
                                                <input
                                                  type="text"
                                                  class="form-control"
                                                  placeholder=""
                                                  v-model="
                                                    chart.indicator.name[
                                                      $i18n.locale
                                                    ]
                                                  "
                                                  disabled
                                                />
                                                <b-input-group-append is-text>
                                                  <Translations
                                                    :transText.sync="
                                                      chart.indicator.name
                                                    "
                                                  />
                                                </b-input-group-append>
                                              </b-input-group>
                                            </div>
                                          </div>
                                        </div>
                                        <div class="col-sm-12 col-lg-6">
                                          <div class="form-group row">
                                            <label
                                              class="col-sm-5 col-form-label"
                                              >{{ $t("dataLabels") }}</label
                                            >
                                            <div class="col-sm-7">
                                              <b-form-checkbox
                                                checked="chart.indicator.dataLabels.enabled"
                                                v-model="
                                                  chart.indicator.dataLabels
                                                    .enabled
                                                "
                                                name="someSwitchOptionDataLabels"
                                                switch
                                                size="lg"
                                                class="mt-1"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="row m-0 mb-2">
                                        <div class="col-sm-12 col-lg-6">
                                          <div class="form-group row">
                                            <label
                                              class="col-sm-6 col-form-label"
                                              >{{ $t("chart_title") }}</label
                                            >
                                            <div class="col-sm-2 pr-0">
                                              <b-form-checkbox
                                                checked="chartTitleVisible"
                                                v-model="
                                                  chart.indicator.chartOptions
                                                    .title.visible
                                                "
                                                name="someSwitchOptionTitle"
                                                switch
                                                size="lg"
                                                class="mt-1"
                                              />
                                            </div>
                                            <transition name="slide-fade">
                                              <div
                                                class="col-sm-4 pl-0"
                                                v-if="
                                                  chart.indicator.chartOptions
                                                    .title.visible
                                                "
                                              >
                                                <b-input-group>
                                                  <input
                                                    type="text"
                                                    class="form-control"
                                                    placeholder=""
                                                    v-model="
                                                      chart.indicator
                                                        .chartOptions.title
                                                        .text[$i18n.locale]
                                                    "
                                                    disabled
                                                  />
                                                  <b-input-group-append is-text>
                                                    <Translations
                                                      :transText.sync="
                                                        chart.indicator
                                                          .chartOptions.title
                                                          .text
                                                      "
                                                    />
                                                  </b-input-group-append>
                                                </b-input-group>
                                              </div>
                                            </transition>
                                          </div>
                                        </div>
                                        <div class="col-sm-12 col-lg-6">
                                          <div class="form-group row">
                                            <label
                                              for="inputChartSubtitle"
                                              class="col-sm-5 col-form-label"
                                              >{{ $t("chart_subtitle") }}</label
                                            >
                                            <div class="col-sm-2 pr-0">
                                              <b-form-checkbox
                                                checked="chartSubTitleVisible"
                                                v-model="
                                                  chart.indicator.chartOptions
                                                    .subTitle.visible
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
                                                v-if="
                                                  chart.indicator.chartOptions
                                                    .subTitle.visible
                                                "
                                              >
                                                <b-input-group>
                                                  <input
                                                    type="text"
                                                    class="form-control"
                                                    id="inputChartSubtitle"
                                                    v-model="
                                                      chart.indicator
                                                        .chartOptions.subTitle
                                                        .text[$i18n.locale]
                                                    "
                                                    disabled
                                                  />
                                                  <b-input-group-append is-text>
                                                    <Translations
                                                      :transText.sync="
                                                        chart.indicator
                                                          .chartOptions.subTitle
                                                          .text
                                                      "
                                                    />
                                                  </b-input-group-append>
                                                </b-input-group>
                                              </div>
                                            </transition>
                                          </div>
                                        </div>
                                      </div>
                                      <div
                                        class="row m-0 mb-2"
                                        v-if="
                                          chart.indicator.chartOptions.xAxis &&
                                          chart.indicator.chartOptions.yAxis
                                        "
                                      >
                                        <div
                                          class="col-sm-12 col-lg-6"
                                          v-if="
                                            chart.indicator.chartOptions.xAxis
                                          "
                                        >
                                          <div class="form-group row">
                                            <label
                                              class="col-sm-6 col-form-label"
                                              >{{ $t("x_axis") }}</label
                                            >
                                            <div class="col-sm-2 pr-0">
                                              <b-form-checkbox
                                                checked="chartXAxisTitleVisible"
                                                v-model="
                                                  chart.indicator.chartOptions
                                                    .xAxis.visible
                                                "
                                                name="someSwitchOptionXAxis"
                                                switch
                                                size="lg"
                                                class="mt-1"
                                              />
                                            </div>
                                            <transition name="slide-fade">
                                              <div
                                                class="col-sm-4 pl-0"
                                                v-if="
                                                  chart.indicator.chartOptions
                                                    .xAxis.visible
                                                "
                                              >
                                                <b-input-group>
                                                  <input
                                                    type="text"
                                                    class="form-control"
                                                    placeholder=""
                                                    v-model="
                                                      chart.indicator
                                                        .chartOptions.xAxis
                                                        .title.text[
                                                        $i18n.locale
                                                      ]
                                                    "
                                                    disabled
                                                  />
                                                  <b-input-group-append is-text>
                                                    <Translations
                                                      :transText.sync="
                                                        chart.indicator
                                                          .chartOptions.xAxis
                                                          .title.text
                                                      "
                                                    />
                                                  </b-input-group-append>
                                                </b-input-group>
                                              </div>
                                            </transition>
                                          </div>
                                        </div>
                                        <div
                                          class="col-sm-12 col-lg-6"
                                          v-if="
                                            chart.indicator.chartOptions.yAxis
                                          "
                                        >
                                          <div class="form-group row">
                                            <label
                                              class="col-sm-5 col-form-label"
                                              >{{ $t("y_axis") }}</label
                                            >
                                            <div class="col-sm-2 pr-0">
                                              <b-form-checkbox
                                                checked="chartYAxisTitleVisible"
                                                v-model="
                                                  chart.indicator.chartOptions
                                                    .yAxis.visible
                                                "
                                                name="someSwitchOptionYAxis"
                                                switch
                                                size="lg"
                                                class="mt-1"
                                              />
                                            </div>
                                            <transition name="slide-fade">
                                              <div
                                                class="col-sm-5 pl-0"
                                                v-if="
                                                  chart.indicator.chartOptions
                                                    .yAxis.visible
                                                "
                                              >
                                                <b-input-group>
                                                  <input
                                                    type="text"
                                                    class="form-control"
                                                    placeholder=""
                                                    v-model="
                                                      chart.indicator
                                                        .chartOptions.yAxis
                                                        .title.text[
                                                        $i18n.locale
                                                      ]
                                                    "
                                                    disabled
                                                  />
                                                  <b-input-group-append is-text>
                                                    <Translations
                                                      :transText.sync="
                                                        chart.indicator
                                                          .chartOptions.yAxis
                                                          .title.text
                                                      "
                                                    />
                                                  </b-input-group-append>
                                                </b-input-group>
                                              </div>
                                            </transition>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="row m-0 mb-2">
                                        <div class="col-sm-12 col-lg-12">
                                          <div class="form-group row">
                                            <label
                                              class="col-sm-3 col-lg-3 col-form-label"
                                              >{{ $t("color") }}</label
                                            >
                                            <div class="col-sm-2 col-lg-2">
                                              <input
                                                type="color"
                                                class="form-control"
                                                placeholder=""
                                                v-model="
                                                  chart.indicator.chartOptions
                                                    .color
                                                "
                                              />
                                            </div>
                                            <div class="col-sm-5 col-lg-4">
                                              <input
                                                type="text"
                                                class="form-control"
                                                placeholder=""
                                                v-model="
                                                  chart.indicator.chartOptions
                                                    .color
                                                "
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="row m-0 mb-2">
                                        <div class="col-sm-12 col-lg-12">
                                          <div class="form-group row">
                                            <label
                                              class="col-sm-3 col-lg-3 col-form-label"
                                              >{{ $t("chartHeading") }}</label
                                            >
                                            <div class="col-sm-9 col-lg-9">
                                              <b-input-group>
                                                <b-form-textarea
                                                  id="inputChartInfoDerived"
                                                  v-model="
                                                    chart.indicator.chartName[
                                                      $i18n.locale
                                                    ]
                                                  "
                                                  :state="
                                                    chart.indicator.chartName &&
                                                    chart.indicator.chartName[
                                                      $i18n.locale
                                                    ] &&
                                                    chart.indicator.chartName[
                                                      $i18n.locale
                                                    ].length !== 0 &&
                                                    chart.indicator.chartName[
                                                      $i18n.locale
                                                    ].length <=
                                                      chartTitleMaxLength
                                                  "
                                                  placeholder=""
                                                  rows="3"
                                                  :maxlength="
                                                    chartTitleMaxLength
                                                  "
                                                  disabled
                                                ></b-form-textarea>
                                                <b-input-group-append is-text>
                                                  <Translations
                                                    :transText.sync="
                                                      chart.indicator.chartName
                                                    "
                                                  />
                                                </b-input-group-append>
                                              </b-input-group>

                                              <span
                                                >{{
                                                  chart.indicator.chartName[
                                                    $i18n.locale
                                                  ]
                                                    ? chart.indicator.chartName[
                                                        $i18n.locale
                                                      ].length
                                                    : 0
                                                }}/{{
                                                  chartTitleMaxLength
                                                }}</span
                                              >
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="row m-0 mb-3">
                                        <div class="col-12">
                                          <div class="form-group row">
                                            <label
                                              for="inputChartSource"
                                              class="col-sm-3 col-lg-3 col-form-label"
                                              >{{
                                                $t("chartInformation")
                                              }}</label
                                            >
                                            <div class="col-sm-9 col-lg-9">
                                              <b-input-group>
                                                <b-form-textarea
                                                  id="inputChartInfoDerived"
                                                  v-model="
                                                    chart.indicator.chartInfo[
                                                      $i18n.locale
                                                    ]
                                                  "
                                                  :state="
                                                    chart.indicator.chartInfo &&
                                                    chart.indicator.chartInfo[
                                                      $i18n.locale
                                                    ] &&
                                                    chart.indicator.chartInfo[
                                                      $i18n.locale
                                                    ].length !== 0 &&
                                                    chart.indicator.chartInfo[
                                                      $i18n.locale
                                                    ].length <=
                                                      chartInfoMaxLength
                                                  "
                                                  :placeholder="
                                                    chartInfoPlaceholder
                                                  "
                                                  rows="3"
                                                  :maxlength="
                                                    chartInfoMaxLength
                                                  "
                                                  disabled
                                                ></b-form-textarea>
                                                <b-input-group-append is-text>
                                                  <Translations
                                                    :transText.sync="
                                                      chart.indicator.chartInfo
                                                    "
                                                  />
                                                </b-input-group-append>
                                              </b-input-group>
                                              <span
                                                >{{
                                                  chart.indicator.chartInfo[
                                                    $i18n.locale
                                                  ]
                                                    ? chart.indicator.chartInfo[
                                                        $i18n.locale
                                                      ].length
                                                    : 0
                                                }}/{{
                                                  chartInfoMaxLength
                                                }}</span
                                              >
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div
                                        class="row m-0 mt-4 mb-lg-n3"
                                        v-if="
                                          chartData[index].indicator
                                            .subIndicator.length
                                        "
                                      >
                                        <div
                                          class="col-12 p-b-15px bordertop-grey"
                                        >
                                          <div
                                            class="accordion mt-3"
                                            role="tablist"
                                          >
                                            <b-card no-body class="mb-1">
                                              <b-card-header
                                                header-tag="header"
                                                class="p-1 map-header f-s-0-875rem font-weight-bold"
                                                role="tab"
                                              >
                                                <b-button
                                                  block
                                                  v-b-toggle.accordion-an23
                                                  variant="info"
                                                >
                                                  {{
                                                    $t("dataMapping")
                                                  }}</b-button
                                                >
                                              </b-card-header>
                                              <b-collapse
                                                id="accordion-an23"
                                                visible
                                                accordion="my-accordion23"
                                                role="tabpanel"
                                                class="border-module"
                                              >
                                                <b-card-body
                                                  class="p-3 mb-lg-n2"
                                                >
                                                  <b-card-text>
                                                    <div
                                                      class="col-12"
                                                      v-for="(
                                                        subIndicator, ind
                                                      ) in chartData[index]
                                                        .indicator.subIndicator"
                                                      :key="ind"
                                                    >
                                                      <div class="row mb-3">
                                                        <div class="col">
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
                                                          >
                                                            <!-- <i
                                                  class="fa fa-link f-s-20px"
                                                  v-b-tooltip.hover
                                                  :title="
                                                    $t('link_IndicatorsData_Elements')
                                                  "
                                                ></i> -->
                                                            <img
                                                              src="@/assets/images/icons/adminlink-icon.svg"
                                                              class="mr-2 cursor-pointer f-s-0-875rem w-auto"
                                                              :style="{
                                                                filter:
                                                                  filterColor,
                                                              }"
                                                              v-b-tooltip.hover
                                                              :title="
                                                                $t(
                                                                  'link_IndicatorsData_Elements'
                                                                )
                                                              "
                                                            />
                                                          </a>
                                                          <span>{{
                                                            chartData[index]
                                                              .indicator
                                                              .subIndicator[ind]
                                                              .name[
                                                              $i18n.locale
                                                            ]
                                                          }}</span>
                                                        </div>
                                                      </div>

                                                      <div
                                                        class="row border-bottomgrey mb-3"
                                                      >
                                                        <div class="col-lg-12">
                                                          <div
                                                            class="collapse"
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
                                                              class="card-header default-card-border-radius color-black f-s-0-875rem p-10px accordion-header1 f-s-0-875rem font-weight-bold bt-10"
                                                            >
                                                              {{
                                                                $t("settings")
                                                              }}
                                                            </div>
                                                            <div
                                                              class="card card-body admin-emucard mb-3"
                                                            >
                                                              <div class="row">
                                                                <div
                                                                  class="col-12"
                                                                >
                                                                  <div
                                                                    class="form-group row"
                                                                  >
                                                                    <label
                                                                      class="col-sm-5 col-form-label"
                                                                      >{{
                                                                        $t(
                                                                          "displayName"
                                                                        )
                                                                      }}</label
                                                                    >
                                                                    <div
                                                                      class="col-sm-7"
                                                                    >
                                                                      <b-input-group>
                                                                        <input
                                                                          type="text"
                                                                          class="form-control"
                                                                          placeholder=""
                                                                          v-model="
                                                                            chartData[
                                                                              index
                                                                            ]
                                                                              .indicator
                                                                              .subIndicator[
                                                                              ind
                                                                            ]
                                                                              .name[
                                                                              $i18n
                                                                                .locale
                                                                            ]
                                                                          "
                                                                          disabled
                                                                        />
                                                                        <b-input-group-append
                                                                          is-text
                                                                        >
                                                                          <Translations
                                                                            :transText.sync="
                                                                              chartData[
                                                                                index
                                                                              ]
                                                                                .indicator
                                                                                .subIndicator[
                                                                                ind
                                                                              ]
                                                                                .name
                                                                            "
                                                                          />
                                                                        </b-input-group-append>
                                                                      </b-input-group>
                                                                    </div>
                                                                  </div>
                                                                  <div
                                                                    class="form-group row"
                                                                  >
                                                                    <label
                                                                      class="col-sm-5 col-form-label"
                                                                      >{{
                                                                        $t(
                                                                          "color"
                                                                        )
                                                                      }}</label
                                                                    >
                                                                    <div
                                                                      class="col-sm-2"
                                                                    >
                                                                      <input
                                                                        type="color"
                                                                        class="form-control"
                                                                        placeholder=""
                                                                        v-model="
                                                                          chartData[
                                                                            index
                                                                          ]
                                                                            .indicator
                                                                            .subIndicator[
                                                                            ind
                                                                          ]
                                                                            .color
                                                                        "
                                                                      />
                                                                    </div>
                                                                    <div
                                                                      class="col-sm-5"
                                                                    >
                                                                      <input
                                                                        type="text"
                                                                        class="form-control"
                                                                        placeholder=""
                                                                        v-model="
                                                                          chartData[
                                                                            index
                                                                          ]
                                                                            .indicator
                                                                            .subIndicator[
                                                                            ind
                                                                          ]
                                                                            .color
                                                                        "
                                                                      />
                                                                    </div>
                                                                  </div>
                                                                  <!-- <div class="form-group row"> -->
                                                                  <div
                                                                    class="form-group row"
                                                                    v-if="
                                                                      typeof chartData[
                                                                        index
                                                                      ]
                                                                        .indicator
                                                                        .subIndicator[
                                                                        ind
                                                                      ]
                                                                        .scalingFactor !==
                                                                      'undefined'
                                                                    "
                                                                  >
                                                                    <label
                                                                      class="col-sm-5 col-form-label"
                                                                      >{{
                                                                        $t(
                                                                          "emu_mon_quest3"
                                                                        )
                                                                      }}</label
                                                                    >
                                                                    <div
                                                                      class="col-sm-7"
                                                                    >
                                                                      <select
                                                                        class="form-control"
                                                                        v-model="
                                                                          chartData[
                                                                            index
                                                                          ]
                                                                            .indicator
                                                                            .subIndicator[
                                                                            ind
                                                                          ]
                                                                            .scalingFactor
                                                                        "
                                                                      >
                                                                        <option
                                                                          :value="
                                                                            0.5
                                                                          "
                                                                        >
                                                                          {{
                                                                            $t(
                                                                              "emu_mon_quest3_opt1"
                                                                            )
                                                                          }}
                                                                        </option>
                                                                        <option
                                                                          :value="
                                                                            0
                                                                          "
                                                                        >
                                                                          {{
                                                                            $t(
                                                                              "emu_mon_quest3_opt2"
                                                                            )
                                                                          }}
                                                                        </option>
                                                                        <option
                                                                          :value="
                                                                            1
                                                                          "
                                                                        >
                                                                          {{
                                                                            $t(
                                                                              "emu_mon_quest3_opt3"
                                                                            )
                                                                          }}
                                                                        </option>
                                                                      </select>
                                                                    </div>
                                                                  </div>
                                                                </div>
                                                                <div
                                                                  class="col-12 bordertop-grey"
                                                                >
                                                                  <div
                                                                    class="accordion-heading f-s-0-875rem font-weight-bold mt-4"
                                                                  >
                                                                    {{
                                                                      $t(
                                                                        "indicators_Data_Elements_Mapping"
                                                                      )
                                                                    }}
                                                                  </div>
                                                                </div>
                                                                <div
                                                                  class="col-12"
                                                                >
                                                                  <AddMapping
                                                                    :matrixList="
                                                                      matrixList
                                                                    "
                                                                    :dataSetsList="
                                                                      dataSetsList
                                                                    "
                                                                    :indicatorsList="
                                                                      indicatorsList
                                                                    "
                                                                    :dataElementsList="
                                                                      dataElementsList
                                                                    "
                                                                    :modalKey="
                                                                      'add-mapping' +
                                                                      chartBySubtype +
                                                                      ind +
                                                                      chartByType +
                                                                      index
                                                                    "
                                                                    :mappingType.sync="
                                                                      chartData[
                                                                        index
                                                                      ]
                                                                        .indicator
                                                                        .subIndicator[
                                                                        ind
                                                                      ].type
                                                                    "
                                                                    :selectedDE.sync="
                                                                      chartData[
                                                                        index
                                                                      ]
                                                                        .indicator
                                                                        .subIndicator[
                                                                        ind
                                                                      ]
                                                                        .selectedDE
                                                                    "
                                                                    v-if="
                                                                      isDataFetched
                                                                    "
                                                                  />
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </b-card-text>
                                                </b-card-body>
                                              </b-collapse>
                                            </b-card>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </transition>
                                </div>
                                <div class="bordertop-grey"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="p-1 accordion-header f-s-0-875rem font-weight-bold bt-10"
                      :id="
                        'adHeadingReportingRate' + chartByType + chartBySubtype
                      "
                      v-if="reportingRate.length"
                    >
                      <h2 class="mb-0 mt-lg-n1">
                        <button
                          class="btn btn-link w-100 text-left"
                          type="button"
                          data-toggle="collapse"
                          :data-target="
                            '#adCollapseReportingRate' +
                            chartByType +
                            chartBySubtype
                          "
                          aria-expanded="false"
                          :aria-controls="
                            'adCollapseReportingRate' +
                            chartByType +
                            chartBySubtype
                          "
                        >
                          {{ $t("rrm") }}
                        </button>
                      </h2>
                    </div>
                    <div
                      :id="
                        'adCollapseReportingRate' + chartByType + chartBySubtype
                      "
                      class="collapse border-module"
                      :aria-labelledby="
                        'adHeadingReportingRate' + chartByType + chartBySubtype
                      "
                      v-if="reportingRate.length"
                    >
                      <div class="col-sm-12 col-lg-12 mt-3">
                        <div class="form-group row">
                          <label class="col-sm-3 col-form-label">{{
                            $t("excRr")
                          }}</label>
                          <div class="col-sm-7">
                            <b-form-checkbox
                              checked="reportingRate[0].indicator.disableChart"
                              v-model="reportingRate[0].indicator.disableChart"
                              name="someSwitchOptionDisableChart"
                              switch
                              size="lg"
                              class="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                      <!-- v-if="reportingRate[0].indicator.disableChart == false" -->
                      <div
                        class="p-2"
                        v-if="reportingRate[0].indicator.disableChart == false"
                      >
                        <div class="row m-0 mb-2">
                          <div class="col-sm-12 col-lg-6">
                            <div class="form-group row">
                              <label class="col-sm-6 col-form-label">{{
                                $t("displayName")
                              }}</label>
                              <div class="col-sm-6">
                                <b-input-group>
                                  <input
                                    type="text"
                                    class="form-control"
                                    placeholder=""
                                    v-model="
                                      reportingRate[0].indicator.name[
                                        $i18n.locale
                                      ]
                                    "
                                    disabled
                                  />
                                  <b-input-group-append is-text>
                                    <Translations
                                      :transText.sync="
                                        reportingRate[0].indicator.name
                                      "
                                    />
                                  </b-input-group-append>
                                </b-input-group>
                              </div>
                            </div>
                          </div>
                          <div class="col-sm-12 col-lg-6">
                            <div class="form-group row">
                              <label class="col-sm-5 col-form-label">{{
                                $t("dataLabels")
                              }}</label>
                              <div class="col-sm-7">
                                <b-form-checkbox
                                  checked="reportingRate[0].indicator.dataLabels.enabled"
                                  v-model="
                                    reportingRate[0].indicator.dataLabels
                                      .enabled
                                  "
                                  name="someSwitchOptionDataLabels"
                                  switch
                                  size="lg"
                                  class="mt-1"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="row m-0 mb-2">
                          <div class="col-sm-12 col-lg-6">
                            <div class="form-group row">
                              <label class="col-sm-6 col-form-label">{{
                                $t("chart_title")
                              }}</label>
                              <div class="col-sm-2 pr-0">
                                <b-form-checkbox
                                  checked="chartTitleVisible"
                                  v-model="
                                    reportingRate[0].indicator.chartOptions
                                      .title.visible
                                  "
                                  name="someSwitchOptionTitle"
                                  switch
                                  size="lg"
                                  class="mt-1"
                                />
                              </div>
                              <transition name="slide-fade">
                                <div
                                  class="col-sm-4 pl-0"
                                  v-if="
                                    reportingRate[0].indicator.chartOptions
                                      .title.visible
                                  "
                                >
                                  <b-input-group>
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder=""
                                      v-model="
                                        reportingRate[0].indicator.chartOptions
                                          .title.text[$i18n.locale]
                                      "
                                      disabled
                                    />
                                    <b-input-group-append is-text>
                                      <Translations
                                        :transText.sync="
                                          reportingRate[0].indicator
                                            .chartOptions.title.text
                                        "
                                      />
                                    </b-input-group-append>
                                  </b-input-group>
                                </div>
                              </transition>
                            </div>
                          </div>
                          <div class="col-sm-12 col-lg-6">
                            <div class="form-group row">
                              <label
                                for="inputChartSubtitle"
                                class="col-sm-5 col-form-label"
                                >{{ $t("chart_subtitle") }}</label
                              >
                              <div class="col-sm-2 pr-0">
                                <b-form-checkbox
                                  checked="chartSubTitleVisible"
                                  v-model="
                                    reportingRate[0].indicator.chartOptions
                                      .subTitle.visible
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
                                  v-if="
                                    reportingRate[0].indicator.chartOptions
                                      .subTitle.visible
                                  "
                                >
                                  <b-input-group>
                                    <input
                                      type="text"
                                      class="form-control"
                                      id="inputChartSubtitle"
                                      v-model="
                                        reportingRate[0].indicator.chartOptions
                                          .subTitle.text[$i18n.locale]
                                      "
                                      disabled
                                    />
                                    <b-input-group-append is-text>
                                      <Translations
                                        :transText.sync="
                                          reportingRate[0].indicator
                                            .chartOptions.subTitle.text
                                        "
                                      />
                                    </b-input-group-append>
                                  </b-input-group>
                                </div>
                              </transition>
                            </div>
                          </div>
                        </div>
                        <div
                          class="row m-0 mb-2"
                          v-if="
                            reportingRate[0].indicator.chartOptions.xAxis &&
                            reportingRate[0].indicator.chartOptions.yAxis
                          "
                        >
                          <div
                            class="col-sm-12 col-lg-6"
                            v-if="reportingRate[0].indicator.chartOptions.xAxis"
                          >
                            <div class="form-group row">
                              <label class="col-sm-6 col-form-label">{{
                                $t("x_axis")
                              }}</label>
                              <div class="col-sm-2 pr-0">
                                <b-form-checkbox
                                  checked="chartXAxisTitleVisible"
                                  v-model="
                                    reportingRate[0].indicator.chartOptions
                                      .xAxis.visible
                                  "
                                  name="someSwitchOptionXAxis"
                                  switch
                                  size="lg"
                                  class="mt-1"
                                />
                              </div>
                              <transition name="slide-fade">
                                <div
                                  class="col-sm-4 pl-0"
                                  v-if="
                                    reportingRate[0].indicator.chartOptions
                                      .xAxis.visible
                                  "
                                >
                                  <b-input-group>
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder=""
                                      v-model="
                                        reportingRate[0].indicator.chartOptions
                                          .xAxis.title.text[$i18n.locale]
                                      "
                                      disabled
                                    />
                                    <b-input-group-append is-text>
                                      <Translations
                                        :transText.sync="
                                          reportingRate[0].indicator
                                            .chartOptions.xAxis.title.text
                                        "
                                      />
                                    </b-input-group-append>
                                  </b-input-group>
                                </div>
                              </transition>
                            </div>
                          </div>
                          <div
                            class="col-sm-12 col-lg-6"
                            v-if="reportingRate[0].indicator.chartOptions.yAxis"
                          >
                            <div class="form-group row">
                              <label class="col-sm-5 col-form-label">{{
                                $t("y_axis")
                              }}</label>
                              <div class="col-sm-2 pr-0">
                                <b-form-checkbox
                                  checked="chartYAxisTitleVisible"
                                  v-model="
                                    reportingRate[0].indicator.chartOptions
                                      .yAxis.visible
                                  "
                                  name="someSwitchOptionYAxis"
                                  switch
                                  size="lg"
                                  class="mt-1"
                                />
                              </div>
                              <transition name="slide-fade">
                                <div
                                  class="col-sm-5 pl-0"
                                  v-if="
                                    reportingRate[0].indicator.chartOptions
                                      .yAxis.visible
                                  "
                                >
                                  <b-input-group>
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder=""
                                      v-model="
                                        reportingRate[0].indicator.chartOptions
                                          .yAxis.title.text[$i18n.locale]
                                      "
                                      disabled
                                    />
                                    <b-input-group-append is-text>
                                      <Translations
                                        :transText.sync="
                                          reportingRate[0].indicator
                                            .chartOptions.yAxis.title.text
                                        "
                                      />
                                    </b-input-group-append>
                                  </b-input-group>
                                </div>
                              </transition>
                            </div>
                          </div>
                        </div>
                        <div class="row m-0 mb-2">
                          <div class="col-sm-12 col-lg-12">
                            <div class="form-group row">
                              <label class="col-sm-3 col-lg-3 col-form-label">{{
                                $t("color")
                              }}</label>
                              <div class="col-sm-2 col-lg-2">
                                <input
                                  type="color"
                                  class="form-control"
                                  placeholder=""
                                  v-model="
                                    reportingRate[0].indicator.chartOptions
                                      .color
                                  "
                                />
                              </div>
                              <div class="col-sm-5 col-lg-4">
                                <input
                                  type="text"
                                  class="form-control"
                                  placeholder=""
                                  v-model="
                                    reportingRate[0].indicator.chartOptions
                                      .color
                                  "
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="row m-0 mb-2">
                          <div class="col-sm-12 col-lg-12">
                            <div class="form-group row">
                              <label class="col-sm-3 col-lg-3 col-form-label">{{
                                $t("chartHeading")
                              }}</label>
                              <div class="col-sm-9 col-lg-9">
                                <b-input-group>
                                  <b-form-textarea
                                    id="inputChartInfoDerived"
                                    v-model="
                                      reportingRate[0].indicator.chartName[
                                        $i18n.locale
                                      ]
                                    "
                                    :state="
                                      reportingRate[0].indicator.chartName &&
                                      reportingRate[0].indicator.chartName[
                                        $i18n.locale
                                      ] &&
                                      reportingRate[0].indicator.chartName[
                                        $i18n.locale
                                      ].length !== 0 &&
                                      reportingRate[0].indicator.chartName[
                                        $i18n.locale
                                      ].length <= chartTitleMaxLength
                                    "
                                    placeholder=""
                                    rows="3"
                                    :maxlength="chartTitleMaxLength"
                                    disabled
                                  ></b-form-textarea>
                                  <b-input-group-append is-text>
                                    <Translations
                                      :transText.sync="
                                        reportingRate[0].indicator.chartName
                                      "
                                    />
                                  </b-input-group-append>
                                </b-input-group>
                                <span
                                  >{{
                                    reportingRate[0].indicator.chartName[
                                      $i18n.locale
                                    ]
                                      ? reportingRate[0].indicator.chartName[
                                          $i18n.locale
                                        ].length
                                      : 0
                                  }}/{{ chartTitleMaxLength }}</span
                                >
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="row m-0 mb-2">
                          <div class="col-12">
                            <div class="form-group row">
                              <label
                                for="inputChartSource"
                                class="col-sm-3 col-lg-3 col-form-label"
                                >{{ $t("chartInformation") }}</label
                              >
                              <div class="col-sm-9 col-lg-9">
                                <b-input-group>
                                  <b-form-textarea
                                    id="inputChartInfoDerived"
                                    v-model="
                                      reportingRate[0].indicator.chartInfo[
                                        $i18n.locale
                                      ]
                                    "
                                    :state="
                                      reportingRate[0].indicator.chartInfo &&
                                      reportingRate[0].indicator.chartInfo[
                                        $i18n.locale
                                      ] &&
                                      reportingRate[0].indicator.chartInfo[
                                        $i18n.locale
                                      ].length !== 0 &&
                                      reportingRate[0].indicator.chartInfo[
                                        $i18n.locale
                                      ].length <= chartInfoMaxLength
                                    "
                                    :placeholder="chartInfoPlaceholder"
                                    rows="3"
                                    :maxlength="chartInfoMaxLength"
                                    disabled
                                  ></b-form-textarea>
                                  <b-input-group-append is-text>
                                    <Translations
                                      :transText.sync="
                                        reportingRate[0].indicator.chartInfo
                                      "
                                    />
                                  </b-input-group-append>
                                </b-input-group>
                                <span
                                  >{{
                                    reportingRate[0].indicator.chartInfo[
                                      $i18n.locale
                                    ]
                                      ? reportingRate[0].indicator.chartInfo[
                                          $i18n.locale
                                        ].length
                                      : 0
                                  }}/{{ chartInfoMaxLength }}</span
                                >
                              </div>
                            </div>
                            <div class="form-group row">
                              <label
                                for="inputChartSource"
                                class="col-sm-3 col-lg-3 col-form-label"
                                >{{ $t("catInformation") }}</label
                              >
                              <div class="col-sm-9 col-lg-9">
                                <b-input-group>
                                  <vue-editor
                                    v-model="
                                      reportingRate[0].indicator.categoryInfo[
                                        $i18n.locale
                                      ]
                                    "
                                    :state="
                                      reportingRate[0].indicator.categoryInfo &&
                                      reportingRate[0].indicator.categoryInfo[
                                        $i18n.locale
                                      ] &&
                                      reportingRate[0].indicator.categoryInfo[
                                        $i18n.locale
                                      ].length !== 0
                                    "
                                    :editorToolbar="customToolbar"
                                    disabled
                                  ></vue-editor>
                                  <b-input-group-append is-text>
                                    <Translations
                                      :transText.sync="
                                        reportingRate[0].indicator.categoryInfo
                                      "
                                      type="editor"
                                    />
                                  </b-input-group-append>
                                </b-input-group>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="accordion m-2" role="tablist">
                          <b-card no-body class="mb-1">
                            <b-card-header
                              header-tag="header"
                              class="p-1 map-header f-s-0-875rem font-weight-bold"
                              role="tab"
                            >
                              <b-button
                                block
                                v-b-toggle.accordion-mapping1
                                variant="info"
                              >
                                {{ $t("dataMapping") }}</b-button
                              >
                            </b-card-header>
                            <b-collapse
                              id="accordion-mapping1"
                              accordion="my-mappingaccordion"
                              role="tabpanel"
                              class="border-module"
                            >
                              <b-card-body>
                                <b-card-text
                                  ><AddMapping
                                    :matrixList="matrixList"
                                    :dataSetsList="dataSetsList"
                                    :indicatorsList="indicatorsList"
                                    :dataElementsList="dataElementsList"
                                    :modalKey="
                                      'add-mapping-reportingRate' +
                                      chartBySubtype +
                                      0 +
                                      chartByType +
                                      0
                                    "
                                    :mappingType.sync="
                                      reportingRate[0].indicator.subIndicator[0]
                                        .type
                                    "
                                    :selectedDE.sync="
                                      reportingRate[0].indicator.subIndicator[0]
                                        .selectedDE
                                    "
                                    v-if="isDataFetched"
                                /></b-card-text>
                              </b-card-body>
                            </b-collapse>
                          </b-card>
                        </div>
                      </div>
                    </div>
                    <div
                      class="p-1 accordion-header f-s-0-875rem font-weight-bold bt-10 mt-2"
                      :id="'adHeadingFPSource' + chartByType + chartBySubtype"
                      v-if="reportingSector"
                    >
                      <h2 class="mb-0 mt-lg-n1">
                        <button
                          class="btn btn-link w-100 text-left"
                          type="button"
                          data-toggle="collapse"
                          :data-target="
                            '#adCollapseFPSource' + chartByType + chartBySubtype
                          "
                          aria-expanded="false"
                          :aria-controls="
                            'adCollapseFPSource' + chartByType + chartBySubtype
                          "
                        >
                          {{ $t("sectorReporting") }}
                        </button>
                      </h2>
                    </div>
                    <div
                      :id="'adCollapseFPSource' + chartByType + chartBySubtype"
                      class="collapse border-module"
                      :aria-labelledby="
                        'adHeadingFPSource' + chartByType + chartBySubtype
                      "
                      v-if="reportingSector"
                    >
                      <!-- FP Source Component -->
                      <bachmarkFpSource
                        :FPSource="fpSource"
                        :indicatorsList="indicatorsList"
                        :dataElementsList="dataElementsList"
                      />
                    </div>
                  </b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>

          <!-- FPSource collapse start-->

          <div class="mt-2 mb-4" v-if="derivedCharts.length">
            <div class="">
              <div class="">
                <div class="">
                  <div class="accordion" role="tablist">
                    <b-card no-body class="mb-1">
                      <b-card-header
                        header-tag="header"
                        class="p-1 map-header f-s-0-875rem font-weight-bold"
                        role="tab"
                      >
                        <b-button
                          block
                          v-b-toggle.accordion-an22
                          variant="info"
                        >
                          {{
                            chartBySubtype === "Output"
                              ? $t("outputChartsSetting")
                              : $t("derivedChartsSetting")
                          }}</b-button
                        >
                      </b-card-header>
                      <b-collapse
                        id="accordion-an22"
                        accordion="my-accordion"
                        role="tabpanel"
                        class="border-module"
                      >
                        <b-card-body>
                          <b-card-text>
                            <div
                              class="form-group row"
                              v-if="chartBySubtype != 'Output'"
                            >
                              <label
                                for="finalYear"
                                class="col-sm-3 col-form-label"
                                >{{ $t("catInformation") }}</label
                              >
                              <div class="col-sm-9">
                                <b-input-group>
                                  <vue-editor
                                    v-model="tabCategoryInfo[1][$i18n.locale]"
                                    :editorToolbar="customToolbar"
                                    disabled
                                  ></vue-editor>
                                  <b-input-group-append is-text>
                                    <Translations
                                      :transText.sync="tabCategoryInfo[1]"
                                      type="editor"
                                    />
                                  </b-input-group-append>
                                </b-input-group>
                              </div>
                            </div>
                            <div
                              class="mb-2"
                              v-for="(derived, ind) in derivedCharts"
                              :key="ind"
                            >
                              <div
                                class="p-1 accordion-header f-s-0-875rem font-weight-bold bt-10"
                                :id="
                                  'headingChartSettings' +
                                  chartBySubtype +
                                  chartByType +
                                  ind
                                "
                              >
                                <h2 class="mb-0 mt-lg-n1">
                                  <button
                                    class="btn btn-link w-100 text-left"
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
                                    {{
                                      derived.chartOptions.chartName[
                                        $i18n.locale
                                      ]
                                    }}
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
                                class="collapse border-module"
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
                                      <label class="col-sm-6 col-form-label">{{
                                        $t("disable_chart")
                                      }}</label>
                                      <div class="col-sm-6 pr-0">
                                        <b-form-checkbox
                                          checked="derived.chartOptions.disableChart"
                                          v-model="
                                            derived.chartOptions.disableChart
                                          "
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
                                  <div
                                    v-if="!derived.chartOptions.disableChart"
                                  >
                                    <div class="row m-0 mb-2">
                                      <div class="col-sm-12 col-lg-12">
                                        <div class="form-group row">
                                          <label
                                            class="col-sm-3 col-lg-3 col-form-label"
                                            >{{ $t("chartHeading") }}</label
                                          >
                                          <div class="col-sm-9 col-lg-9">
                                            <b-input-group>
                                              <b-form-textarea
                                                id="inputChartInfoDerived"
                                                v-model="
                                                  derived.chartOptions
                                                    .chartName[$i18n.locale]
                                                "
                                                :state="
                                                  derived.chartOptions
                                                    .chartName &&
                                                  derived.chartOptions
                                                    .chartName[$i18n.locale] &&
                                                  derived.chartOptions
                                                    .chartName[$i18n.locale]
                                                    .length !== 0 &&
                                                  derived.chartOptions
                                                    .chartName[$i18n.locale]
                                                    .length <=
                                                    chartTitleMaxLength
                                                "
                                                placeholder=""
                                                rows="3"
                                                :maxlength="chartTitleMaxLength"
                                                disabled
                                              ></b-form-textarea>
                                              <b-input-group-append is-text>
                                                <Translations
                                                  :transText.sync="
                                                    derived.chartOptions
                                                      .chartName
                                                  "
                                                />
                                              </b-input-group-append>
                                            </b-input-group>
                                            <span
                                              >{{
                                                derived.chartOptions.chartName[
                                                  $i18n.locale
                                                ]
                                                  ? derived.chartOptions
                                                      .chartName[$i18n.locale]
                                                      .length
                                                  : 0
                                              }}/{{ chartTitleMaxLength }}</span
                                            >
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div
                                      class="row m-0 mb-2"
                                      v-if="
                                        derived.chartOptions.title &&
                                        derived.chartOptions.subTitle
                                      "
                                    >
                                      <div
                                        class="col-sm-12 col-lg-6"
                                        v-if="derived.chartOptions.title"
                                      >
                                        <div class="form-group row translate-iconheight">
                                          <label
                                            class="col-sm-6 col-form-label"
                                            >{{ $t("chart_title") }}</label
                                          >
                                          <div class="col-sm-2 pr-0">
                                            <b-form-checkbox
                                              checked="chartTitleVisible"
                                              v-model="
                                                derived.chartOptions.title
                                                  .visible
                                              "
                                              name="someSwitchOptionTitle"
                                              switch
                                              size="lg"
                                              class="mt-1"
                                            />
                                          </div>
                                          <transition name="slide-fade">
                                            <div
                                              class="col-sm-4 pl-0"
                                              v-if="
                                                derived.chartOptions.title
                                                  .visible
                                              "
                                            >
                                              <b-input-group>
                                                <input
                                                  type="text"
                                                  class="form-control"
                                                  placeholder=""
                                                  v-model="
                                                    derived.chartOptions.title
                                                      .text[$i18n.locale]
                                                  "
                                                  disabled
                                                />
                                                <b-input-group-append is-text>
                                                  <Translations
                                                    :transText.sync="
                                                      derived.chartOptions.title
                                                        .text
                                                    "
                                                  />
                                                </b-input-group-append>
                                              </b-input-group>
                                            </div>
                                          </transition>
                                        </div>
                                      </div>
                                      <div
                                        class="col-sm-12 col-lg-6"
                                        v-if="derived.chartOptions.subTitle"
                                      >
                                        <div class="form-group row translate-iconheight">
                                          <label
                                            for="inputChartSubtitle"
                                            class="col-sm-6 col-form-label"
                                            >{{ $t("chart_subtitle") }}</label
                                          >
                                          <div class="col-sm-2 pr-0">
                                            <b-form-checkbox
                                              checked="chartSubTitleVisible"
                                              v-model="
                                                derived.chartOptions.subTitle
                                                  .visible
                                              "
                                              name="someSwitchOptionSubtitle"
                                              switch
                                              size="lg"
                                              class="mt-1"
                                            />
                                          </div>
                                          <transition name="slide-fade">
                                            <div
                                              class="col-sm-4 pl-0"
                                              v-if="
                                                derived.chartOptions.subTitle
                                                  .visible
                                              "
                                            >
                                              <b-input-group>
                                                <input
                                                  type="text"
                                                  class="form-control"
                                                  id="inputChartSubtitle"
                                                  v-model="
                                                    derived.chartOptions
                                                      .subTitle.text[
                                                      $i18n.locale
                                                    ]
                                                  "
                                                  disabled
                                                />
                                                <b-input-group-append is-text>
                                                  <Translations
                                                    :transText.sync="
                                                      derived.chartOptions
                                                        .subTitle.text
                                                    "
                                                  />
                                                </b-input-group-append>
                                              </b-input-group>
                                            </div>
                                          </transition>
                                        </div>
                                      </div>
                                    </div>
                                    <div
                                      class="row m-0 mb-2"
                                      v-if="
                                        derived.chartOptions.title1 &&
                                        derived.chartOptions.subTitle1
                                      "
                                    >
                                      <div
                                        class="col-sm-12 col-lg-6"
                                        v-if="derived.chartOptions.title1"
                                      >
                                        <div class="form-group row translate-iconheight">
                                          <label
                                            class="col-sm-6 col-form-label"
                                            >{{ $t("chart_title2") }}</label
                                          >
                                          <div class="col-sm-2 pr-0">
                                            <b-form-checkbox
                                              checked="chartTitleVisible"
                                              v-model="
                                                derived.chartOptions.title1
                                                  .visible
                                              "
                                              name="someSwitchOptionTitle"
                                              switch
                                              size="lg"
                                              class="mt-1"
                                            />
                                          </div>
                                          <transition name="slide-fade">
                                            <div
                                              class="col-sm-4 pl-0"
                                              v-if="
                                                derived.chartOptions.title1
                                                  .visible
                                              "
                                            >
                                              <b-input-group>
                                                <input
                                                  type="text"
                                                  class="form-control"
                                                  placeholder=""
                                                  v-model="
                                                    derived.chartOptions.title1
                                                      .text[$i18n.locale]
                                                  "
                                                  disabled
                                                />
                                                <b-input-group-append is-text>
                                                  <Translations
                                                    :transText.sync="
                                                      derived.chartOptions
                                                        .title1.text
                                                    "
                                                  />
                                                </b-input-group-append>
                                              </b-input-group>
                                            </div>
                                          </transition>
                                        </div>
                                      </div>
                                      <div
                                        class="col-sm-12 col-lg-6"
                                        v-if="derived.chartOptions.subTitle1"
                                      >
                                        <div class="form-group row translate-iconheight">
                                          <label
                                            for="inputChartSubtitle"
                                            class="col-sm-6 col-form-label"
                                            >{{ $t("chart_subtitle2") }}</label
                                          >
                                          <div class="col-sm-2 pr-0">
                                            <b-form-checkbox
                                              checked="chartSubTitleVisible"
                                              v-model="
                                                derived.chartOptions.subTitle1
                                                  .visible
                                              "
                                              name="someSwitchOptionSubtitle"
                                              switch
                                              size="lg"
                                              class="mt-1"
                                            />
                                          </div>
                                          <transition name="slide-fade">
                                            <div
                                              class="col-sm-4 pl-0"
                                              v-if="
                                                derived.chartOptions.subTitle1
                                                  .visible
                                              "
                                            >
                                              <b-input-group>
                                                <input
                                                  type="text"
                                                  class="form-control"
                                                  id="inputChartSubtitle"
                                                  v-model="
                                                    derived.chartOptions
                                                      .subTitle1.text[
                                                      $i18n.locale
                                                    ]
                                                  "
                                                  disabled
                                                />
                                                <b-input-group-append is-text>
                                                  <Translations
                                                    :transText.sync="
                                                      derived.chartOptions
                                                        .subTitle1.text
                                                    "
                                                  />
                                                </b-input-group-append>
                                              </b-input-group>
                                            </div>
                                          </transition>
                                        </div>
                                      </div>
                                    </div>
                                    <div
                                      class="row m-0 mb-2"
                                      v-if="
                                        derived.chartOptions.xAxis &&
                                        derived.chartOptions.yAxis
                                      "
                                    >
                                      <div
                                        class="col-sm-12 col-lg-6"
                                        v-if="derived.chartOptions.xAxis"
                                      >
                                        <div class="form-group row translate-iconheight">
                                          <label
                                            class="col-sm-6 col-form-label"
                                            >{{ $t("x_axis") }}</label
                                          >
                                          <div class="col-sm-2 pr-0">
                                            <b-form-checkbox
                                              checked="chartXAxisTitleVisible"
                                              v-model="
                                                derived.chartOptions.xAxis
                                                  .visible
                                              "
                                              name="someSwitchOptionXAxis"
                                              switch
                                              size="lg"
                                              class="mt-1"
                                            />
                                          </div>
                                          <transition name="slide-fade">
                                            <div
                                              class="col-sm-4 pl-0"
                                              v-if="
                                                derived.chartOptions.xAxis
                                                  .visible
                                              "
                                            >
                                              <b-input-group>
                                                <input
                                                  type="text"
                                                  class="form-control"
                                                  placeholder=""
                                                  v-model="
                                                    derived.chartOptions.xAxis
                                                      .text[$i18n.locale]
                                                  "
                                                  disabled
                                                />
                                                <b-input-group-append is-text>
                                                  <Translations
                                                    :transText.sync="
                                                      derived.chartOptions.xAxis
                                                        .text
                                                    "
                                                  />
                                                </b-input-group-append>
                                              </b-input-group>
                                            </div>
                                          </transition>
                                        </div>
                                      </div>
                                      <div
                                        class="col-sm-12 col-lg-6"
                                        v-if="derived.chartOptions.yAxis"
                                      >
                                        <div class="form-group row translate-iconheight">
                                          <label
                                            class="col-sm-6 col-form-label"
                                            >{{ $t("y_axis") }}</label
                                          >
                                          <div class="col-sm-2 pr-0">
                                            <b-form-checkbox
                                              checked="chartYAxisTitleVisible"
                                              v-model="
                                                derived.chartOptions.yAxis
                                                  .visible
                                              "
                                              name="someSwitchOptionYAxis"
                                              switch
                                              size="lg"
                                              class="mt-1"
                                            />
                                          </div>
                                          <transition name="slide-fade">
                                            <div
                                              class="col-sm-4 pl-0"
                                              v-if="
                                                derived.chartOptions.yAxis
                                                  .visible
                                              "
                                            >
                                              <b-input-group>
                                                <input
                                                  type="text"
                                                  class="form-control"
                                                  placeholder=""
                                                  v-model="
                                                    derived.chartOptions.yAxis
                                                      .text[$i18n.locale]
                                                  "
                                                  disabled
                                                />
                                                <b-input-group-append is-text>
                                                  <Translations
                                                    :transText.sync="
                                                      derived.chartOptions.yAxis
                                                        .text
                                                    "
                                                  />
                                                </b-input-group-append>
                                              </b-input-group>
                                            </div>
                                          </transition>
                                        </div>
                                      </div>
                                    </div>
                                    <div class="row m-0 mb-2">
                                      <div class="col-12">
                                        <div class="form-group row">
                                          <label
                                            for="inputChartSource"
                                            class="col-sm-3 col-lg-3 col-form-label"
                                            >{{ $t("chartInformation") }}</label
                                          >
                                          <div class="col-sm-9 col-lg-9">
                                            <b-input-group>
                                              <b-form-textarea
                                                id="inputChartInfoDerived"
                                                v-model="
                                                  derived.chartOptions
                                                    .chartInfo[$i18n.locale]
                                                "
                                                :state="
                                                  derived.chartOptions
                                                    .chartInfo &&
                                                  derived.chartOptions
                                                    .chartInfo[$i18n.locale] &&
                                                  derived.chartOptions
                                                    .chartInfo[$i18n.locale]
                                                    .length !== 0 &&
                                                  derived.chartOptions
                                                    .chartInfo[$i18n.locale]
                                                    .length <=
                                                    chartInfoMaxLength
                                                "
                                                :placeholder="
                                                  chartInfoPlaceholder
                                                "
                                                rows="3"
                                                :maxlength="chartInfoMaxLength"
                                                disabled
                                              ></b-form-textarea>
                                              <b-input-group-append is-text>
                                                <Translations
                                                  :transText.sync="
                                                    derived.chartOptions
                                                      .chartInfo
                                                  "
                                                />
                                              </b-input-group-append>
                                            </b-input-group>
                                            <span
                                              >{{
                                                derived.chartOptions.chartInfo[
                                                  $i18n.locale
                                                ]
                                                  ? derived.chartOptions
                                                      .chartInfo[$i18n.locale]
                                                      .length
                                                  : 0
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
                          </b-card-text>
                        </b-card-body>
                      </b-collapse>
                    </b-card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
      <div class="row pt-4">
        <div class="col text-right" v-if="reportingRate.length">
          <span
            class="text-danger mr-4"
            v-if="
              dataOnContraceptive === 'No'
                ? false
                : reportingRate[0].indicator.subIndicator[0].de.length === 0
            "
            ><strong>{{ $t("note") }}:</strong>
            {{ $t("mappingMandatory") }}</span
          ><button
            type="button"
            class="btn btn-primary black-btn save-btn"
            v-on:click="updateConfigData"
            :disabled="
              dataOnContraceptive === 'No'
                ? false
                : reportingRate[0].indicator.subIndicator[0].de.length === 0
            "
          >
            {{ $t("savebtn") }}
          </button>
        </div>
        <div class="col text-right" v-else>
          <button
            type="button"
            class="btn btn-primary black-btn save-btn"
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
import emuAnnual from "@/config/emuAnnualConfig.js";
import service from "@/service";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import bachmarkFpSource from "./bachmarkFpSource";
import { VueEditor } from "vue2-editor";
import assign from "lodash/assign";
import ReFetchConfigMixin from "@/helpers/ReFetchConfigMixin";
import VueEditorOptionMixin from "@/helpers/VueEditorOptionMixin";
export default {
  props: [
    "chartByModule",
    "chartByType",
    "chartBySubtype",
    "indicatorsList",
    "dataElementsList",
    "dataSetsList",
    "matrixList",
    "globalMapping",
  ],
  mixins: [DynamicImageMixin, ReFetchConfigMixin, VueEditorOptionMixin],
  components: {
    bachmarkFpSource,
    VueEditor,
    AddMapping: () =>
      import(
        /* webpackChunkName: "admin_AddMapping"*/ "@/components/config/AddMapping"
      ),
    Translations: () =>
      import(
        /*webpackChunkName: 'translations'*/ "@/components/config/Common/Translations"
      ),
  },
  data() {
    // console.log(this.chartBySubtype, this.indicatorsList)
    // console.log(config[this.chartByModule][this.chartByType]);
    let cData =
      emuAnnual[this.chartByModule][this.chartByType][this.chartBySubtype];
    return {
      derivedCharts: cData.derivedCharts ? cData.derivedCharts : [],

      chartData: cData.chartData ? cData.chartData : [],

      reportingRate: cData.reportingRate ? cData.reportingRate : [],

      dataOnContraceptive: cData.dataOnContraceptive
        ? cData.dataOnContraceptive
        : "",

      initialYear: cData.initialYear
        ? cData.initialYear
        : new Date().getFullYear(),

      finalYear: cData.finalYear ? cData.finalYear : new Date().getFullYear(),

      dataSource: cData.source ? cData.source : "",

      reportingSector: cData.reportingSector ? cData.reportingSector : "",

      fpSource: cData.FPSource ? cData.FPSource : {},

      chartInfoMaxLength: 200,

      chartTitleMaxLength: 100,
      categoryInfo: cData.categoryInfo ? cData.categoryInfo : "",
      tabCategoryInfo: cData.tabCategoryInfo ? cData.tabCategoryInfo : [{}, {}],
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
    getUpdatedMapping(updatedMapping, ismatchFound) {
      if (ismatchFound) {
        this.chartData = updatedMapping;
        this.$nextTick(() => {
          this.updateConfigData();
        });
      } else {
        this.sweetAlert({
          title: this.$i18n.t("oops"),
          text: this.$i18n.t("no_match_found"),
        });
      }
    },
    //This is to fetch config data on page load
    getConfigData() {
      // console.log("data initial",[this.chartBySubtype],JSON.stringify(config))
      let key = this.generateKey(this.chartByModule);

      let response = service.getSavedConfig({ tableKey: key });
      response
        .then((response) => {
          // console.log(response)
          this.$emit("getBGInfo", response.data);
          if (
            response.data[this.chartByType] &&
            response.data[this.chartByType][this.chartBySubtype]
          ) {
            let data = response.data[this.chartByType][this.chartBySubtype];
            // console.log(data)
            this.chartData = data.chartData ? data.chartData : this.chartData;
            // ? merge(this.chartData, data.chartData)
            this.derivedCharts = data.derivedCharts
              ? data.derivedCharts
              : this.derivedCharts;
            // ? merge(this.derivedCharts, data.derivedCharts)
            this.dataOnContraceptive = data.dataOnContraceptive
              ? data.dataOnContraceptive
              : this.dataOnContraceptive;
            this.initialYear = data.initialYear
              ? data.initialYear
              : this.initialYear;
            this.finalYear = data.finalYear ? data.finalYear : this.finalYear;
            this.dataSource = data.dataSource
              ? data.dataSource
              : this.dataSource;
            this.reportingSector = data.reportingSector
              ? data.reportingSector
              : this.reportingSector;
            this.fpSource = data.FPSource ? data.FPSource : this.fpSource;
            // ? merge(this.fpSource, data.FPSource)
            this.reportingRate = data.reportingRate
              ? data.reportingRate
              : this.reportingRate;
            // ? merge(this.reportingRate, data.reportingRate)
            this.categoryInfo = data.categoryInfo
              ? data.categoryInfo
              : this.categoryInfo;
            this.tabCategoryInfo = data.tabCategoryInfo
              ? data.tabCategoryInfo
              : this.tabCategoryInfo;
            this.originalData = JSON.parse(JSON.stringify(data));
            this.$store.commit("setLoading", false);
          } else {
            this.$store.commit("setLoading", false);
          }
          this.isDataFetched = true;
        })
        .catch((err) => {
          console.log("Config not found...");
          this.isDataFetched = true;
          this.$store.commit("setLoading", false);
          this.reFetchConfig(err);
        });
    },
    //This is to update config data on click of save button
    async updateConfigData() {
      this.$store.commit("setLoading", true);

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

      let rCharts = [];
      if (this.reportingRate.length) {
        rCharts = this.reportingRate.map(async (d, index) => {
          let cid = "";
          if (d.indicator && !d.indicator.cid) {
            try {
              let resp = await service.createDHISChart(
                `${this.chartByModule} ${d.indicator.chartName}`
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
            indicator: {
              ...d.indicator,
              cid,
            },
          };
        });
        rCharts = await Promise.all(rCharts);
      }

      let cCharts = this.chartData;

      if (this.chartData.length) {
        cCharts = this.chartData.map(async (d, index) => {
          let cid = "";
          if (d.indicator && !d.indicator.cid) {
            try {
              let resp = await service.createDHISChart(
                `${this.chartByModule} ${d.indicator.chartName}`
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
            indicator: {
              ...d.indicator,
              cid,
            },
          };
        });
        cCharts = await Promise.all(cCharts);
      }

      let chartBySubtypeData = {
        derivedCharts: dCharts,
        chartData: cCharts,
        reportingRate: rCharts,
        dataOnContraceptive: this.dataOnContraceptive,
        initialYear: this.initialYear,
        finalYear: this.finalYear,
        source: this.dataSource,
        reportingSector: this.reportingSector,
        FPSource: this.fpSource,
        categoryInfo: this.categoryInfo,
        tabCategoryInfo: this.tabCategoryInfo,
      };

      let key = this.generateKey(this.chartByModule);

      let allKeys = service.getAllKeys({});
      allKeys.then((keys) => {
        if (keys.data.includes(key)) {
          let saveConfig = service.getSavedConfig({ tableKey: key });
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
            let configChanges = {};
            // let configChanges = audit.configAudit(
            //   this.originalData,
            //   configData[this.chartByType][this.chartBySubtype]
            // );
            // console.log("configChanges", configChanges)
            let response = service.updateConfig({
              data: configData,
              tableKey: key,
            });
            response
              .then((response) => {
                if (response.data.status === "OK") {
                  // console.log("response update ", response.data)
                  this.sweetAlert({
                    title: this.$i18n.t("data_saved_successfully"),
                  });
                  this.getConfigData();

                  this.$store.commit("setLoading", false);
                } else {
                  this.sweetAlert({
                    title: this.$i18n.t("error"),
                    text: `${response.data.message}`,
                  });

                  this.$store.commit("setLoading", false);
                  return;
                }
              })
              .catch((error) => {
                this.sweetAlert({
                  title: this.$i18n.t("error"),
                });

                this.$store.commit("setLoading", false);
                return;
              });
          });
        } else {
          let ministrial = {
            [this.chartByType]: {
              [this.chartBySubtype]: chartBySubtypeData,
            },
          };
          let response = service.saveConfig({
            data: ministrial,
            tableKey: key,
          });
          response.then((response) => {
            if (response.data.status === "OK") {
              // console.log("response save ", response.data)
              this.sweetAlert({
                title: this.$i18n.t("data_saved_successfully"),
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
          });
        }
      });
    },
  },
  created() {
    this.$store.commit("setLoading", true);
    this.getConfigData();
  },
};
</script>
<style>
.noteBackground {
  background-color: var(--modal-bg-color);
  color: var(--text-color);
  border-color: var(--modal-bg-color);
}
</style>
