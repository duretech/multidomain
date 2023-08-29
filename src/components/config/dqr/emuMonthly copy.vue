<template>
  <div>
    <div :class="'card-body ' + chartBySubtype">
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
      <div class="form-group row">
        <label class="col-sm-4 col-form-label">{{ $t("emu_mon_quest") }}</label>
        <div class="col-sm-8">
          <div class="">
            <select class="form-control" v-model="dataOnContraceptive">
              <option value="Yes">{{ $t("yes") }}</option>
              <option value="No">{{ $t("no") }}</option>
            </select>
          </div>
        </div>
      </div>
      <transition name="slide-fade">
        <div v-if="dataOnContraceptive == 'Yes'">
          <div class="form-group row hide">
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
          <div class="form-group row hide">
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
          <div class="accordion mb-2" role="tablist">
            <b-card no-body class="mb-1">
              <b-card-header
                header-tag="header"
                class="p-1 map-header f-s-0-875rem font-weight-bold"
                role="tab"
              >
                <b-button block v-b-toggle.accordion-mon1 variant="info">
                  {{ $t("mapping") }}</b-button
                >
              </b-card-header>
              <b-collapse
                id="accordion-mon1"
                accordion="my-accordion"
                role="tabpanel"
                class="border-module"
              >
                <b-card-body>
                  <b-card-text>
                    <div class="row mt-lg-n3 mb-2" v-if="chartData.length">
                      <div class="col">
                        <div class="card">
                          <div class="card-body">
                            <div
                              class="row border-bottomgrey"
                              v-for="(chart, index) in chartData"
                              :key="index"
                            >
                              <div class="col-12 accordion-delete">
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
                                  class="collapse mt-3"
                                  :aria-labelledby="
                                    'headingChartSettings' +
                                    index +
                                    chartBySubtype +
                                    chartByType
                                  "
                                >
                                  <div class="row m-0 mb-2 mb-lg-n3">
                                    <div class="col">
                                      <div class="form-group row">
                                        <label
                                          class="col-sm-5 col-form-label"
                                          >{{ $t("displayName") }}</label
                                        >
                                        <div class="col-sm-7">
                                          <b-input-group>
                                            <input
                                              type="text"
                                              class="form-control"
                                              placeholder=""
                                              v-model="
                                                chartData[index].indicator.name[
                                                  $i18n.locale
                                                ]
                                              "
                                              disabled
                                            />
                                            <b-input-group-append is-text>
                                              <Translations
                                                :transText.sync="
                                                  chartData[index].indicator
                                                    .name
                                                "
                                              />
                                            </b-input-group-append>
                                          </b-input-group>
                                        </div>
                                      </div>
                                      <div class="form-group row">
                                        <label
                                          class="col-sm-5 col-form-label"
                                          >{{ $t("color") }}</label
                                        >
                                        <div class="col-sm-2">
                                          <input
                                            type="color"
                                            class="form-control"
                                            placeholder=""
                                            v-model="
                                              chartData[index].indicator.color
                                            "
                                          />
                                        </div>
                                        <div class="col-sm-5">
                                          <input
                                            type="text"
                                            class="form-control"
                                            placeholder=""
                                            v-model="
                                              chartData[index].indicator.color
                                            "
                                          />
                                        </div>
                                      </div>
                                      <div class="form-group row">
                                        <label
                                          class="col-sm-5 col-form-label"
                                          >{{ $t("visible") }}</label
                                        >
                                        <div class="col-sm-7">
                                          <b-form-checkbox
                                            checked="chartData[index].indicator.visible"
                                            v-model="
                                              chartData[index].indicator.visible
                                            "
                                            name="check-button"
                                            switch
                                            size="lg"
                                          >
                                          </b-form-checkbox>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="row m-0 mt-4 mb-lg-n3">
                                    <div class="col-12 p-b-15px bordertop-grey">
                                      <div
                                        class="accordion accordion-add mt-3 mb-3"
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
                                              v-b-toggle.accordion-data12
                                              variant="info"
                                              class="button-add"
                                            >
                                              {{ $t("dataMapping") }}</b-button
                                            >
                                          </b-card-header>
                                          <b-collapse
                                            id="accordion-data12"
                                            visible
                                            accordion="my-accordion12"
                                            role="tabpanel"
                                            class="border-module"
                                          >
                                            <b-card-body class="mb-lg-n4">
                                              <b-card-text>
                                                <div
                                                  class="col-12"
                                                  v-for="(
                                                    subIndicator, ind
                                                  ) in chartData[index]
                                                    .indicator.subIndicator"
                                                  :key="ind"
                                                >
                                                  <div class="row">
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
                                                            $t(
                                                              'link_IndicatorsData_Elements'
                                                            )
                                                          "
                                                        ></i> -->
                                                        <img
                                                          src="@/assets/images/icons/adminlink-icon.svg"
                                                          class="mr-2 cursor-pointer f-s-0-875rem w-auto mt-lg-n1"
                                                          :style="{
                                                            filter: filterColor,
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
                                                          .name[$i18n.locale]
                                                      }}</span>
                                                    </div>
                                                  </div>
                                                  <div
                                                    class="row my-3 border-bottomgrey"
                                                  >
                                                    <div class="col-lg-12">
                                                      <div
                                                        class="collapse mb-3"
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
                                                          {{ $t("settings") }}
                                                        </div>
                                                        <div
                                                          class="card card-body admin-emucard"
                                                        >
                                                          <div class="row">
                                                            <div class="col-12">
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
                                                                        ].name[
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
                                                                          ].name
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
                                                                    $t("color")
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
                                                                      ].color
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
                                                                      ].color
                                                                    "
                                                                  />
                                                                </div>
                                                              </div>
                                                              <div
                                                                class="form-group row"
                                                                v-if="
                                                                  typeof chartData[
                                                                    index
                                                                  ].indicator
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
                                                                      :value="0"
                                                                    >
                                                                      {{
                                                                        $t(
                                                                          "emu_mon_quest3_opt2"
                                                                        )
                                                                      }}
                                                                    </option>
                                                                    <option
                                                                      :value="1"
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
                                                            <div class="col-12">
                                                              <AddMapping
                                                                :metrixList="
                                                                  metrixList
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
                                                                  ].indicator
                                                                    .subIndicator[
                                                                    ind
                                                                  ].type
                                                                "
                                                                :selectedDE.sync="
                                                                  chartData[
                                                                    index
                                                                  ].indicator
                                                                    .subIndicator[
                                                                    ind
                                                                  ].selectedDE
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
                              </div>
                            </div>
                          </div>
                        </div>
                      </div></div
                  ></b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>
          <div class="accordion" role="tablist">
            <b-card no-body class="mb-1">
              <b-card-header
                header-tag="header"
                class="p-1 map-header f-s-0-875rem font-weight-bold"
                role="tab"
              >
                <b-button block v-b-toggle.accordion-chat1 variant="info">
                  {{ $t("derivedChartsSetting") }}</b-button
                >
              </b-card-header>
              <b-collapse
                id="accordion-chat1"
                accordion="my-accordion"
                role="tabpanel"
                class="border-module"
              >
                <b-card-body>
                  <b-card-text>
                    <div class="row" v-if="derivedCharts.length">
                      <div class="col">
                        <div class="card">
                          <div class="">
                            <div
                              class="mb-2"
                              v-for="(derived, ind) in derivedCharts"
                              :key="ind"
                            >
                              <h6 v-if="ind === 0">
                                {{ $t("inputData") }}
                              </h6>
                              <h6 v-if="ind === 3" class="m-2">
                                {{ $t("total-EMU") }}
                              </h6>

                              <div class="form-group row" v-if="ind === 0">
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
                                    />
                                    <b-input-group-append is-text>
                                      <Translations
                                        :transText.sync="tabCategoryInfo[0]"
                                        type="editor"
                                      />
                                    </b-input-group-append>
                                  </b-input-group>
                                </div>
                              </div>
                              <div class="form-group row p-2" v-if="ind === 3">
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
                                    />
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
                                class="card-header p-xl-1 accordion-header2 f-s-0-875rem font-weight-bold bt-10"
                                :id="
                                  'headingChartSettings' +
                                  chartBySubtype +
                                  chartByType +
                                  ind
                                "
                              >
                                <h2 class="mb-0 mt-lg-n1">
                                  <button
                                    class="btn btn-link w-100 text-left text-uppercase color-grey f-s-0-875rem"
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
                                class="collapse border-adminmain"
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
                                        v-if="derived.chartOptions.xAxis"
                                      >
                                        <div class="form-group row translate-iconheight">
                                          <label
                                            for="inputChartSubtitle"
                                            class="col-sm-5 col-form-label"
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
                                              class="col-sm-5 pl-0"
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
                                            class="col-sm-5 col-form-label"
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
                                              class="col-sm-5 pl-0"
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
      </transition>
      <div class="row pt-4">
        <div class="col text-right">
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
import emuMonthly from "@/config/emuMonthlyConfig.js";
import service from "@/service";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
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
    "metrixList",
    "globalMapping",
  ],
  mixins: [DynamicImageMixin, ReFetchConfigMixin, VueEditorOptionMixin],
  components: {
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
      emuMonthly[this.chartByModule][this.chartByType][this.chartBySubtype];
    return {
      dataOnContraceptive: cData.dataOnContraceptive
        ? cData.dataOnContraceptive
        : "Yes",

      initialYear: cData.initialYear
        ? cData.initialYear
        : new Date().getFullYear(),

      finalYear: cData.finalYear ? cData.finalYear : new Date().getFullYear(),

      chartData: cData.chartData ? cData.chartData : [],

      derivedCharts: cData.derivedCharts ? cData.derivedCharts : [],

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
            this.dataOnContraceptive = data.dataOnContraceptive
              ? data.dataOnContraceptive
              : this.dataOnContraceptive;
            this.initialYear = data.initialYear
              ? data.initialYear
              : this.initialYear;
            this.finalYear = data.finalYear ? data.finalYear : this.finalYear;
            this.chartData = data.chartData ? data.chartData : this.chartData;
            // ? merge(this.chartData, data.chartData)
            this.derivedCharts = data.derivedCharts
              ? data.derivedCharts
              : this.derivedCharts;
            // ? merge(this.derivedCharts, data.derivedCharts)
            this.categoryInfo = data.categoryInfo
              ? data.categoryInfo
              : this.categoryInfo;
            this.tabCategoryInfo = data.tabCategoryInfo
              ? data.tabCategoryInfo
              : this.tabCategoryInfo;
            this.originalData = JSON.parse(JSON.stringify(data));
          }
          this.isDataFetched = true;
          this.$store.commit("setLoading", false);
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

      let saveData = false;

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

      let chartBySubtypeData = {
        dataOnContraceptive: this.dataOnContraceptive,
        initialYear: this.initialYear,
        finalYear: this.finalYear,
        categoryInfo: this.categoryInfo,
        tabCategoryInfo: this.tabCategoryInfo,
        derivedCharts: dCharts,
        chartData: this.chartData,
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
