<template>
  <div>
    <div :class="'card-body ' + chartBySubtype">
      <div class="form-group row">
        <label for="finalYear" class="col-sm-6 col-form-label">{{
          $t("catInformation")
        }}</label>
        <div class="col-sm-6">
          <vue-editor
            v-model="categoryInfo"
            :state="categoryInfo.length !== 0"
            :editorToolbar="customToolbar"
            :placeholder="
              $t('enter_category_information')
            "
          ></vue-editor>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-sm-6 col-form-label">{{
          $t("emu_mon_quest")
        }}</label>
        <div class="col-sm-6">
          <div class="">
            <select class="form-control" v-model="disableChart">
              <option :value="false">{{ $t("yes") }}</option>
              <option :value="true">{{ $t("no") }}</option>
            </select>
          </div>
        </div>
      </div>
      <transition name="slide-fade">
        <div v-if="!disableChart">
          <div class="form-group row">
            <label for="initialYear" class="col-sm-6 col-form-label">{{
              $t("emu_initial_year_quest")
            }}</label>
            <div class="col-sm-6">
              <input
                type="number"
                class="form-control"
                id="initialYear"
                placeholder=""
                v-model="initialYear"
              />
            </div>
          </div>
          <div class="form-group row">
            <label for="finalYear" class="col-sm-6 col-form-label">{{
              $t("emu_final_year_quest")
            }}</label>
            <div class="col-sm-6">
              <input
                type="number"
                class="form-control"
                id="finalYear"
                placeholder=""
                v-model="finalYear"
              />
            </div>
          </div>

          <div class="row mt-3 mb-4" v-if="chartData.length">
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
                    class="text-right"
                    v-if="
                      $root.defaultLanguageLocale === $i18n.locale &&
                      globalMapping &&
                      chartData
                    "
                  >
                    <copyMapping
                      :globalMapping="globalMapping"
                      :chartData="chartData"
                      @getUpdatedMapping="getUpdatedMapping"
                    />
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
                            <div class="form-group row">
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
                                font-weight-bold
                              "
                            >
                              {{ $t("dataMapping") }}
                            </div>
                          </div>
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
                                        <div
                                          class="form-group row"
                                          v-if="
                                            typeof chartData[index].indicator
                                              .subIndicator[ind]
                                              .scalingFactor !== 'undefined'
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
                                          <div class="col-sm-7">
                                            <select
                                              class="form-control"
                                              v-model="
                                                chartData[index].indicator
                                                  .subIndicator[ind]
                                                  .scalingFactor
                                              "
                                            >
                                              <option :value="0.5">
                                                {{
                                                  $t(
                                                    "emu_mon_quest3_opt1"
                                                  )
                                                }}
                                              </option>
                                              <option :value="0">
                                                {{
                                                  $t(
                                                    "emu_mon_quest3_opt2"
                                                  )
                                                }}
                                              </option>
                                              <option :value="1">
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
                                      <div class="col-12">
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-3 mb-4" v-if="derivedCharts.length">
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
                    font-weight-bold
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
                    <h6 v-if="ind === 0">
                      {{ $t("inputData") }}
                    </h6>
                    <h6 v-if="ind === 3">
                      {{ $t("total-EMU") }}
                    </h6>

                    <div class="form-group row" v-if="ind === 0">
                      <label for="finalYear" class="col-sm-6 col-form-label">{{
                        $t("catInformation")
                      }}</label>
                      <div class="col-sm-6">
                        <vue-editor
                          v-model="tabCategoryInfo[0]"
                          :editorToolbar="customToolbar"
                          :placeholder="
                            $t(
                              'enter_category_information'
                            )
                          "
                        />
                      </div>
                    </div>
                    <div class="form-group row" v-if="ind === 3">
                      <label for="finalYear" class="col-sm-6 col-form-label">{{
                        $t("catInformation")
                      }}</label>
                      <div class="col-sm-6">
                        <vue-editor
                          v-model="tabCategoryInfo[1]"
                          :editorToolbar="customToolbar"
                          :placeholder="
                            $t(
                              'enter_category_information'
                            )
                          "
                        />
                      </div>
                    </div>
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
                            <div class="col-sm-12 col-lg-12">
                              <div class="form-group row">
                                <label
                                  class="col-sm-5 col-lg-6 col-form-label"
                                  >{{
                                    $t("chartHeading")
                                  }}</label
                                >
                                <div class="col-sm-7 col-lg-6">
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
                            <div
                              class="col-sm-12 col-lg-6"
                              v-if="derived.chartOptions.xAxis"
                            >
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
                            <div
                              class="col-sm-12 col-lg-6"
                              v-if="derived.chartOptions.yAxis"
                            >
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
                            <div class="col-12">
                              <div class="form-group row">
                                <label
                                  for="inputChartSource"
                                  class="col-sm-5 col-lg-6 col-form-label"
                                  >{{
                                    $t(
                                      "chartInformation"
                                    )
                                  }}</label
                                >
                                <div class="col-sm-7 col-lg-6">
                                  <b-form-textarea
                                    id="inputChartInfoDerived"
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
import emuMonthly from "@/config/emuMonthlyConfig.js";
import service from "@/service";
import { VueEditor } from "vue2-editor";
import merge from "lodash/merge";
import audit from "../audit.js";
import assign from "lodash/assign";
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
  mixins: [VueEditorOptionMixin],
  components: {
    VueEditor,
    copyMapping: () =>
      import(
        /* webpackChunkName: "admin_copyMapping"*/ "@/components/config/copyMapping"
      ),
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
    // console.log(config[this.chartByModule][this.chartByType]);
    let cData =
      emuMonthly[this.chartByModule][this.chartByType][this.chartBySubtype];
    console.log(cData.derivedCharts);
    return {
      disableChart: cData.disableChart ? cData.disableChart : false,

      initialYear: cData.initialYear
        ? cData.initialYear
        : new Date().getFullYear(),

      finalYear: cData.finalYear ? cData.finalYear : new Date().getFullYear(),

      chartData: cData.chartData ? cData.chartData : [],

      derivedCharts: cData.derivedCharts ? cData.derivedCharts : [],

      chartInfoMaxLength: 200,

      chartTitleMaxLength: 100,
      categoryInfo: cData.categoryInfo ? cData.categoryInfo : "",
      tabCategoryInfo: cData.tabCategoryInfo ? cData.tabCategoryInfo : [],
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
        this.$swal({
          title: this.$i18n.t("oops"),
          text: this.$i18n.t("no_match_found"),
        });
      }
    },
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
            let data = response.data[this.chartByType][this.chartBySubtype];
            // console.log(data)
            this.disableChart = data.disableChart
              ? data.disableChart
              : this.disableChart;
            this.initialYear = data.initialYear
              ? data.initialYear
              : this.initialYear;
            this.finalYear = data.finalYear ? data.finalYear : this.finalYear;
            this.chartData = data.chartData
              ? merge(this.chartData, data.chartData)
              : this.chartData;
            this.derivedCharts = data.derivedCharts
              ? merge(this.derivedCharts, data.derivedCharts)
              : this.derivedCharts;
            this.categoryInfo = data.categoryInfo
              ? data.categoryInfo
              : this.categoryInfo;
            this.tabCategoryInfo = data.tabCategoryInfo
              ? data.tabCategoryInfo
              : this.tabCategoryInfo;
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
        disableChart: this.disableChart,
        initialYear: this.initialYear,
        finalYear: this.finalYear,
        categoryInfo: this.categoryInfo,
        tabCategoryInfo: this.tabCategoryInfo,
        derivedCharts: dCharts,
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
    },
  },
  created() {
    this.$store.state.loading = true;
    this.getConfigData();
  },
};
</script>
