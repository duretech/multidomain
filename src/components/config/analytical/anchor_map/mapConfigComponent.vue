<template>
  <div>
    <div class="card m-b-20px">
      <div
        class="
          card-header
          p-5px
          border-radius-0
          text-uppercase
          f-s-0-875rem
        "
        id="headingFive"
      >
        <h2 class="mb-0">
          <button
            class="btn btn-link w-100 text-left color-grey"
            type="button"
            data-toggle="collapse"
            data-target="#collapseFive"
            aria-expanded="true"
            aria-controls="collapseFive"
          >
            {{ $t("selectMapConfiguration") }}
            <span class="float-right"><i class="fa fa-minus"></i></span>
          </button>
        </h2>
      </div>
      <div
        id="collapseFive"
        class="collapse show"
        aria-labelledby="headingFive"
      >
        <div class="card-body">
          <div class="row">
            <div class="col-12">
              <div class="row m-0 mt-4 mb-2">
                <div class="col">
                  <div class="form-group row">
                    <label class="col-sm-4 col-form-label">{{
                      $t("mapCenter")
                    }}</label>
                    <div class="col-sm-4">
                      <label class="col-form-label">{{
                        $t("mapLat")
                      }}</label>
                      <input
                        type="text"
                        class="form-control"
                        :placeholder="$t('mapLat')"
                        v-model="mapOptions.lat"
                      />
                    </div>
                    <div class="col-sm-4">
                      <label class="col-form-label">{{
                        $t("mapLong")
                      }}</label>
                      <input
                        type="text"
                        class="form-control"
                        :placeholder="$t('mapLong')"
                        v-model="mapOptions.lng"
                      />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label class="col-sm-4 col-form-label">{{
                      $t("mapzoom")
                    }}</label>
                    <div class="col-sm-4">
                      <div class="select-wrapper">
                        <select
                          class="form-control tabbarselect"
                          v-model="mapOptions.mapZoom"
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                          <option value="10">10</option>
                          <option value="11">11</option>
                          <option value="12">12</option>
                          <option value="13">13</option>
                          <option value="14">14</option>
                          <option value="15">15</option>
                        </select>
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

    <div class="card">
      <div
        class="
          card-header
          p-5px
          border-radius-0
          text-uppercase
          f-s-0-875rem
        "
        id="headingFour"
      >
        <h2 class="mb-0">
          <button
            class="btn btn-link w-100 text-left color-grey"
            type="button"
            data-toggle="collapse"
            data-target="#collapseFour"
            aria-expanded="true"
            aria-controls="collapseFour"
          >
            {{ $t("indicatorMapping") }}
            <span class="float-right"><i class="fa fa-minus"></i></span>
          </button>
        </h2>
      </div>
      <div
        id="collapseFour"
        class="collapse show"
        aria-labelledby="headingFour"
      >
        <div class="card-body">
          <div :class="'card-body ' + chartBySubtype">
            <div
              class="text-right"
              v-if="$root.defaultLanguageLocale !== $i18n.locale"
            >
              <SyncMapping ref="syncMapping" @syncMapping="syncMapping" />
            </div>
            <div class="row" v-for="(chart, index) in mapData" :key="index">
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
                        Array.isArray(mapData[index].indicator.name)
                          ? mapData[index].indicator.name[0]
                          : mapData[index].indicator.name
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
                      <div class="form-group row">
                        <label class="col-sm-3 col-form-label">{{
                          $t("displayName")
                        }}</label>
                        <div class="col-sm-9">
                          <input
                            type="text"
                            class="form-control"
                            placeholder=""
                            v-model="mapData[index].indicator.name"
                          />
                        </div>
                      </div>
                      <div class="form-group row mb-0">
                        <label class="col-sm-3 col-form-label">{{
                          $t("scales")
                        }}</label>
                        <div class="col-sm-9">
                          <b-tabs content-class="mt-3">
                            <b-tab
                              v-for="(levelScale, levelIndex) in mapData[index]
                                .indicator.levels"
                              :key="levelIndex"
                              :title="levelScale.levelName"
                            >
                              <div class="row pb-2 pt-2">
                                <div class="col-5">
                                  <div class="input-group">
                                    <div class="input-group-prepend">
                                      <div class="input-group-text p-1">
                                        <input
                                          type="color"
                                          class=""
                                          placeholder=""
                                          v-model="paletteColor"
                                        />
                                      </div>
                                    </div>
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder=""
                                      v-model="paletteColor"
                                    />
                                  </div>
                                </div>
                                <div class="col-7">
                                  <div class="row">
                                    <div class="col-7 pr-1">
                                      <div class="input-group">
                                        <div class="input-group-prepend">
                                          <div
                                            class="
                                              input-group-text
                                              p-1
                                              px-2
                                              cursor-pointer
                                            "
                                            v-b-tooltip.hover
                                            :title="
                                              $t('percentageInfo')
                                            "
                                          >
                                            <i class="fa fa-info"></i>
                                          </div>
                                        </div>
                                        <input
                                          type="number"
                                          min="-99"
                                          max="99"
                                          class="form-control col-4"
                                          placeholder=""
                                          v-model="percentageLight"
                                        />
                                        <b-form-input
                                          id="percentageLight-range-1"
                                          v-model="percentageLight"
                                          class="form-control"
                                          type="range"
                                          min="-99"
                                          max="99"
                                          step="1"
                                        ></b-form-input>
                                      </div>
                                    </div>
                                    <div class="col-5 pl-1">
                                      <div class="input-group">
                                        <div class="input-group-prepend">
                                          <div
                                            class="
                                              input-group-text
                                              p-1
                                              px-2
                                              cursor-pointer
                                            "
                                            v-b-tooltip.hover
                                            :title="$t('shadesInfo')"
                                          >
                                            <i class="fa fa-info"></i>
                                          </div>
                                        </div>
                                        <input
                                          type="number"
                                          min="4"
                                          max="9"
                                          class="form-control"
                                          placeholder=""
                                          v-model="shadesNumber"
                                        />
                                        <b-form-input
                                          id="shadesNumber-range-1"
                                          v-model="shadesNumber"
                                          class="form-control"
                                          type="range"
                                          min="4"
                                          max="9"
                                          step="1"
                                        ></b-form-input>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="row pb-4">
                                <div class="col-5">
                                  <div class="row mx-0">
                                    <div
                                      class="p-3 border col"
                                      v-for="(shade, i) in shades"
                                      :key="i"
                                      :style="{ 'background-color': shade }"
                                    ></div>
                                  </div>
                                </div>
                                <div class="col-7 text-right">
                                  <b-button
                                    class="black-btn btn-sm mx-1"
                                    @click.prevent.stop="
                                      applyPalette(index, levelIndex)
                                    "
                                    >{{ $t("apply") }}</b-button
                                  >
                                  <b-button
                                    class="black-btn btn-sm mx-1"
                                    @click.prevent.stop="
                                      applyPalette(index, 'all')
                                    "
                                    >{{ $t("applyAll") }}</b-button
                                  >
                                </div>
                              </div>
                              <div class="row pb-4">
                                <div class="col-12">
                                  <div
                                    class="cursor-pointer text-primary small"
                                  >
                                    <span @click="showShades = !showShades"
                                      ><u>{{
                                        $t("predefinedColors")
                                      }}</u></span
                                    >
                                  </div>
                                  <transition name="slide-fade">
                                    <div
                                      v-if="showShades"
                                      class="border p-2 border-radius-4px"
                                    >
                                      <div
                                        class="row mx-0"
                                        v-for="(
                                          predefinedShade, i
                                        ) in predefinedShades"
                                        :key="i"
                                        :class="
                                          predefinedShades.length - 1 === i
                                            ? ''
                                            : 'pb-2'
                                        "
                                      >
                                        <div class="col-5">
                                          <div class="row mx-0">
                                            <div
                                              class="p-3 border col"
                                              v-for="(
                                                shade, i
                                              ) in predefinedShade"
                                              :key="i"
                                              :style="{
                                                'background-color': shade,
                                              }"
                                            ></div>
                                          </div>
                                        </div>
                                        <div class="col-7">
                                          <b-button
                                            class="black-btn btn-sm mx-1"
                                            @click.prevent.stop="
                                              applyPalette(
                                                index,
                                                levelIndex,
                                                predefinedShade
                                              )
                                            "
                                            >{{
                                              $t("apply")
                                            }}</b-button
                                          >
                                          <b-button
                                            class="black-btn btn-sm mx-1"
                                            @click.prevent.stop="
                                              applyPalette(
                                                index,
                                                'all',
                                                predefinedShade
                                              )
                                            "
                                            >{{
                                              $t("applyAll")
                                            }}</b-button
                                          >
                                        </div>
                                      </div>
                                    </div>
                                  </transition>
                                </div>
                              </div>
                              <div class="row pb-2">
                                <div class="col-5">
                                  {{
                                    $t("autoScaling")
                                  }}
                                </div>
                                <div class="col-7">
                                  <b-form-checkbox
                                    checked="levelScale.isAutoRange"
                                    v-model="levelScale.isAutoRange"
                                    name="check-button"
                                    switch
                                    size="lg"
                                    @change="
                                      autoScaling(
                                        index,
                                        levelIndex,
                                        mapData[index].indicator.name,
                                        levelScale.isAutoRange
                                      )
                                    "
                                  >
                                  </b-form-checkbox>
                                </div>
                              </div>
                              <div
                                class="row pb-2"
                                v-for="(
                                  scaleRow, scaleIndex
                                ) in levelScale.scales"
                                :key="scaleIndex"
                              >
                                <div
                                  class="col-sm-4"
                                  :class="{
                                    'col-sm-6': levelScale.isAutoRange,
                                  }"
                                >
                                  <input
                                    type="text"
                                    class="form-control"
                                    :placeholder="
                                      $t('label')
                                    "
                                    v-model="
                                      levelScale.scales[scaleIndex].scaleLabel
                                    "
                                  />
                                </div>
                                <div
                                  class="col-sm-2"
                                  :class="{ hide: levelScale.isAutoRange }"
                                >
                                  <input
                                    type="text"
                                    class="form-control"
                                    :placeholder="
                                      $t('placeholderLowRange')
                                    "
                                    v-model="
                                      levelScale.scales[scaleIndex].lowScale
                                    "
                                    :disabled="
                                      scaleIndex === 0 &&
                                      !levelScale.isAutoRange
                                        ? false
                                        : true
                                    "
                                    :class="{
                                      'border-danger': errorIndex.includes(
                                        `low${index}${levelIndex}${scaleIndex}`
                                      ),
                                    }"
                                    @change="
                                      validateInput(
                                        index,
                                        levelIndex,
                                        scaleIndex,
                                        'low',
                                        levelScale.scales[scaleIndex].lowScale,
                                        mapData[index].indicator.name
                                      )
                                    "
                                  />
                                </div>
                                <div
                                  class="col-sm-2"
                                  :class="{ hide: levelScale.isAutoRange }"
                                >
                                  <input
                                    type="text"
                                    class="form-control"
                                    :placeholder="
                                      $t('placeholderHighRange')
                                    "
                                    v-model="
                                      levelScale.scales[scaleIndex].highScale
                                    "
                                    :class="{
                                      'border-danger': errorIndex.includes(
                                        `high${index}${levelIndex}${scaleIndex}`
                                      ),
                                    }"
                                    :disabled="levelScale.isAutoRange"
                                    @change="
                                      validateInput(
                                        index,
                                        levelIndex,
                                        scaleIndex,
                                        'high',
                                        levelScale.scales[scaleIndex].highScale,
                                        mapData[index].indicator.name
                                      )
                                    "
                                  />
                                </div>
                                <div
                                  class="input-group col-sm-4"
                                  :class="{
                                    'col-sm-6': levelScale.isAutoRange,
                                  }"
                                >
                                  <div class="input-group-prepend">
                                    <div class="input-group-text p-1">
                                      <input
                                        type="color"
                                        class=""
                                        placeholder=""
                                        v-model="
                                          levelScale.scales[scaleIndex]
                                            .scaleColor
                                        "
                                      />
                                    </div>
                                  </div>
                                  <input
                                    type="text"
                                    class="form-control"
                                    placeholder=""
                                    v-model="
                                      levelScale.scales[scaleIndex].scaleColor
                                    "
                                  />
                                </div>
                              </div>
                            </b-tab>
                          </b-tabs>
                        </div>
                      </div>
                      <div class="text-right mb-3">
                        <b-button
                          class="black-btn btn-sm"
                          @click.prevent.stop="copyTo(index)"
                          >{{ $t("copyTobtn") }}</b-button
                        >
                        <b-modal
                          :id="'copyToModal' + index"
                          hide-footer
                          :title="$t('copyTobtn')"
                          no-close-on-backdrop
                        >
                          <div
                            class="my-2"
                            v-if="
                              levelsSelect.length > 0 &&
                              levelsTreeSelect.length > 0
                            "
                          >
                            <div class="from-levels mb-2">
                              <span class="small">{{
                                $t("from")
                              }}</span>
                              <b-form-select
                                v-model="selectedLevel"
                                size="sm"
                                :options="levelsSelect"
                              >
                                <template v-slot:first>
                                  <b-form-select-option
                                    :value="null"
                                    disabled
                                    >{{
                                      $t("selectPlaceholder")
                                    }}</b-form-select-option
                                  >
                                </template>
                              </b-form-select>
                            </div>
                            <div class="to-levels mb-2">
                              <span class="small">{{
                                $t("to")
                              }}</span>
                              <b-form-select
                                v-model="selectedTreeLevel"
                                size="sm"
                                :options="levelsTreeSelect"
                                multiple
                                :select-size="4"
                              >
                                <template v-slot:first>
                                  <b-form-select-option
                                    :value="null"
                                    disabled
                                    >{{
                                      $t("selectPlaceholder")
                                    }}</b-form-select-option
                                  >
                                </template>
                              </b-form-select>
                              <div class="mt-1" style="font-size: 0.6875rem">
                                <strong
                                  >{{ $t("note") }}:
                                </strong>
                                {{ $t("multiSelectNote") }}
                              </div>
                            </div>
                            <div class="copy-options small">
                              <b-form-group>
                                <b-form-checkbox-group
                                  id="checkbox-copy-options"
                                  v-model="selectedCopyOption"
                                  name="copy-options"
                                >
                                  <b-form-checkbox value="labels">{{
                                    $t("labels")
                                  }}</b-form-checkbox>
                                  <b-form-checkbox value="range">{{
                                    $t("range")
                                  }}</b-form-checkbox>
                                  <b-form-checkbox value="colors">{{
                                    $t("colors")
                                  }}</b-form-checkbox>
                                </b-form-checkbox-group>
                              </b-form-group>
                            </div>
                            <div class="text-right">
                              <b-button
                                class="black-btn btn-sm"
                                @click.prevent.stop="copy(index)"
                                >{{ $t("copybtn") }}</b-button
                              >
                            </div>
                          </div>
                        </b-modal>
                      </div>
                      <div class="form-group row">
                        <label class="col-sm-3 col-form-label">{{
                          $t("source")
                        }}</label>
                        <div class="col-sm-9">
                          <input
                            type="text"
                            class="form-control"
                            placeholder=""
                            v-model="mapData[index].indicator.source"
                          />
                        </div>
                      </div>
                      <div class="form-group row">
                        <label
                          for="inputChartSource"
                          class="col-sm-3 col-form-label"
                          >{{
                            $t("chartInformation")
                          }}</label
                        >
                        <div
                          class="col-sm-9"
                          v-if="mapData[index].indicator.chartInfo"
                        >
                          <b-form-textarea
                            id="inputChartInfo"
                            v-model="mapData[index].indicator.chartInfo"
                            :state="
                              mapData[index].indicator.chartInfo.length !== 0 &&
                              mapData[index].indicator.chartInfo.length <=
                                chartInfoMaxLength
                            "
                            :placeholder="chartInfoPlaceholder"
                            rows="3"
                            :maxlength="chartInfoMaxLength"
                          ></b-form-textarea>
                          <span
                            >{{ mapData[index].indicator.chartInfo.length }}/{{
                              chartInfoMaxLength
                            }}</span
                          >
                        </div>
                        <div class="col-sm-9" v-else>
                          <b-form-textarea
                            id="inputChartInfo"
                            v-model="mapData[index].indicator.chartInfo"
                            :placeholder="chartInfoPlaceholder"
                            rows="3"
                            :maxlength="chartInfoMaxLength"
                          ></b-form-textarea>
                        </div>
                      </div>
                      <div class="form-group row">
                        <label class="col-sm-3 col-form-label">{{
                          $t("visible")
                        }}</label>
                        <div class="col-sm-9">
                          <b-form-checkbox
                            checked="mapData[index].indicator.visible"
                            v-model="mapData[index].indicator.visible"
                            name="check-button"
                            switch
                            size="lg"
                          >
                          </b-form-checkbox>
                        </div>
                      </div>
                    </div>
                  </div>
                  <transition name="slide-fade">
                    <div
                      class="row m-0 mt-4 mb-2"
                      v-if="
                        mapData[index].indicator.dataMapping &&
                        mapData[index].indicator.visible
                      "
                    >
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
                        v-for="(subIndicator, ind) in mapData[index].indicator
                          .subIndicator"
                        :key="ind"
                      >
                        <div class="row">
                          <div class="col">
                            <div class="form-check form-check-inline mr-0 hide">
                              <div class="pure-checkbox">
                                <input
                                  name="checkbox"
                                  type="checkbox"
                                  :id="
                                    'checkbox1' + chartBySubtype + index + ind
                                  "
                                />
                                <label
                                  :for="
                                    'checkbox1' + chartBySubtype + index + ind
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
                                mapData[index].indicator.subIndicator[ind].name
                              )
                                ? mapData[index].indicator.subIndicator[ind]
                                    .name[0]
                                : mapData[index].indicator.subIndicator[ind]
                                    .name
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
                                {{ $t("settings") }}
                              </div>
                              <div class="card card-body">
                                <div class="row">
                                  <div class="col-12">
                                    <div class="form-group row">
                                      <label class="col-sm-5 col-form-label">{{
                                        $t(
                                          "displayName"
                                        )
                                      }}</label>
                                      <div class="col-sm-7">
                                        <input
                                          type="text"
                                          class="form-control"
                                          placeholder=""
                                          v-model="
                                            mapData[index].indicator
                                              .subIndicator[ind].name
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
                                        mapData[index].indicator.subIndicator[
                                          ind
                                        ].type
                                      "
                                      :selectedDE="
                                        mapData[index].indicator.subIndicator[
                                          ind
                                        ].selectedDE
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
                  </transition>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 pt-4">
            <div class="col text-right">
              <span class="text-danger mr-4" v-if="errorIndex.length > 0"
                ><strong>{{ $t("note") }}:</strong>
                {{ $t("note_tittle3") }}
                {{ errorIndicator }}</span
              ><button
                type="button"
                class="btn btn-primary black-btn"
                v-on:click="updateConfigData"
                :disabled="errorIndex.length > 0"
              >
                {{ $t("savebtn") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ppConfig from "@/config/programPrioritiesConfig.js";
import anchorMapConfig from "@/config/anchorMapConfig.js";
import service from "@/service";
import merge from "lodash/merge";
import assign from "lodash/assign";
import audit from "../../audit.js";
export default {
  props: [
    "chartByModule",
    "chartByType",
    "chartBySubtype",
    "indicatorsList",
    "dataElementsList",
    "bProgramPriority",
    "dataSetsList",
    "metrixList",
    "orgList",
    "defaultLevelID",
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
    // console.log(this.chartByType, this.chartBySubtype, this.indicatorsList)
    //console.log(anchorMapConfig)
    let oModule = this.bProgramPriority
      ? ppConfig.adProgramModule
      : anchorMapConfig.adAnchorMapModule;

    let levels = this.orgList
      .filter((item) => {
        if (
          item.level === this.defaultLevelID &&
          item.level === this.orgList.length
        ) {
          return item;
        }
        if (item.level >= this.defaultLevelID) {
          return item;
        }
      })
      .map((o) => ({
        level: o.level,
        levelName: o.name,
        isAutoRange: true,
        scales: [
          {
            lowScale: "0",
            highScale: "25",
            scaleColor: "#0000ff",
            scaleLabel: "Low",
          },
          {
            lowScale: "25",
            highScale: "50",
            scaleColor: "#0000ff",
            scaleLabel: "Medium",
          },
          {
            lowScale: "50",
            highScale: "75",
            scaleColor: "#0000ff",
            scaleLabel: "High",
          },
          {
            lowScale: "75",
            highScale: "100",
            scaleColor: "#0000ff",
            scaleLabel: "Very High",
          },
        ],
      }))
      .sort((a, b) => {
        return a.level < b.level ? -1 : a.level == b.level ? 0 : 1;
      });
    // console.log(this.orgList)
    // console.log(levels)
    let mapData = "";
    if (oModule[this.chartByType][this.chartBySubtype]) {
      mapData = oModule[this.chartByType][this.chartBySubtype].mapData.map(
        (md) => ({
          indicator: {
            ...md.indicator,
            levels,
          },
        })
      );
    }
    // console.log(mapData)
    return {
      paletteColor: "#00ff80",
      percentageLight: 40,
      shadesNumber: 4,
      showShades: false,
      predefinedShades: [
        ["#d4ffff", "#acefff", "#84c7ff", "#5c9fef"],
        ["#ffffac", "#ffdd84", "#ffb55c", "#ed8d34"],
        ["#ffd9d3", "#ffb1ab", "#ff8983", "#e2615b"],
        ["#eaffce", "#c2ffa6", "#9ade7e", "#72b656"],
      ],
      mapOptions: oModule[this.chartByType][this.chartBySubtype]
        ? oModule[this.chartByType][this.chartBySubtype].mapOptions
        : "",
      mapData: mapData,
      levels: levels,
      errorIndex: [],
      errorIndicator: [],
      chartInfoMaxLength: 200,
      levelsSelect: [],
      selectedLevel: null,
      selectedTreeLevel: [],
      copyLevels: [],
      selectedCopyOption: [],
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
    levelsTreeSelect: function () {
      return this.levelsSelect.filter((l) => l.value !== this.selectedLevel);
    },
    shades: function () {
      let shades = [this.paletteColor],
        color = this.paletteColor;
      for (let i = 1; i < this.shadesNumber; i++) {
        color = this.adjust(color, this.percentageLight * 1);
        // console.log("color", i, color)
        shades.push(color);
      }
      shades = this.percentageLight * 1 < 0 ? shades : shades.reverse();
      return shades;
    },
  },
  watch: {},
  methods: {
    adjust(color, amount) {
      // console.log("color :: ",color," & amount :: ",amount)
      return (
        "#" +
        color
          .replace(/^#/, "")
          .replace(/../g, (color) =>
            (
              "0" +
              Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(
                16
              )
            ).substr(-2)
          )
      );
    },
    applyPalette(index, levelIndex = "all", predefinedShade = null) {
      let colors = predefinedShade ? predefinedShade : this.shades;
      this.mapData = this.mapData.map((map, i) => {
        if (index === i) {
          return {
            indicator: {
              ...map.indicator,
              levels: map.indicator.levels.map((level, j) => {
                if (levelIndex !== "all") {
                  if (j === levelIndex) {
                    return {
                      ...level,
                      scales: level.scales.map((scale, k) => ({
                        ...scale,
                        scaleColor: colors[k],
                      })),
                    };
                  } else {
                    return level;
                  }
                } else {
                  return {
                    ...level,
                    scales: level.scales.map((scale, k) => ({
                      ...scale,
                      scaleColor: colors[k],
                    })),
                  };
                }
              }),
            },
          };
        } else {
          return map;
        }
      });
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
        let mapData = "";
        if (data.mapData && typeof data.levelsSet === "undefined") {
          // if(data.mapData) {
          mapData = data.mapData.map((md) => ({
            indicator: {
              ...md.indicator,
              levels: this.levels,
            },
          }));
        } else {
          mapData = data.mapData;
        }
        console.log("mapData", mapData);

        this.mapData.forEach((c, i) => {
          let innerData = c.indicator,
            dataFromLocale = data.mapData.find((cLocale) => {
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
                levels: innerData.levels.map((i) => {
                  let updatedLevel = dataFromLocale.indicator.levels.find(
                    (l) => l.level === i.level
                  );
                  if (updatedLevel) {
                    return {
                      ...i,
                      isAutoRange: updatedLevel.isAutoRange,
                      scales: i.scales.map((s, index) => {
                        return {
                          ...s,
                          lowScale: updatedLevel.scales[index].lowScale,
                          highScale: updatedLevel.scales[index].highScale,
                          scaleColor: updatedLevel.scales[index].scaleColor,
                        };
                      }),
                    };
                  } else {
                    return i;
                  }
                }),
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
        this.mapData = updatedData;
        this.$store.state.loading = false;
        if (this.$refs.syncMapping) {
          this.$refs.syncMapping.syncMappingModal();
        }
        this.$nextTick(() => {
          this.updateConfigData();
        });
      });
    },
    copyTo(index) {
      // console.log(this.mapData[index])
      this.levelsSelect = this.mapData[index].indicator.levels.map((l) => ({
        text: l.levelName,
        value: l.level,
      }));
      this.copyLevels = this.mapData[index].indicator.levels;
      this.selectedLevel = null;
      this.selectedTreeLevel = [];
      this.selectedCopyOption = [];
      this.$nextTick(() => {
        this.$bvModal.show("copyToModal" + index);
      });
    },
    copy(index) {
      // console.log(this.mapData[index])
      let mData = JSON.parse(JSON.stringify(this.mapData[index]));
      let levels = mData.indicator.levels,
        sourceLevel = levels.filter((l) => l.level === this.selectedLevel),
        targetLevel = levels.filter((l) =>
          this.selectedTreeLevel.includes(l.level)
        ),
        updatedTargetLevels = [],
        pendingLevel = levels.filter(
          (l) => !this.selectedTreeLevel.includes(l.level)
        );
      targetLevel.forEach((t) => {
        let updatedScale = [];
        t.scales.forEach((s, j) => {
          if (this.selectedCopyOption.includes("labels")) {
            s = { ...s, scaleLabel: sourceLevel[0].scales[j].scaleLabel };
          }
          if (this.selectedCopyOption.includes("range")) {
            s = {
              ...s,
              highScale: sourceLevel[0].scales[j].highScale,
              lowScale: sourceLevel[0].scales[j].lowScale,
            };
          }
          if (this.selectedCopyOption.includes("colors")) {
            s = { ...s, scaleColor: sourceLevel[0].scales[j].scaleColor };
          }
          updatedScale[j] = s;
        });
        updatedTargetLevels.push({ ...t, scales: updatedScale });
      });
      let finalLevels = [...pendingLevel, ...updatedTargetLevels].sort(
        (a, b) => {
          return a.level < b.level ? -1 : a.level == b.level ? 0 : 1;
        }
      );
      this.mapData[index].indicator.levels = finalLevels;
      this.$nextTick(() => {
        this.$bvModal.hide("copyToModal" + index);
      });
    },
    autoScaling(index, levelIndex, indicatorName, isAutoRange) {
      if (!isAutoRange) {
        let originalScale = [
          {
            lowScale: "0",
            highScale: "25",
          },
          {
            lowScale: "25",
            highScale: "50",
          },
          {
            lowScale: "50",
            highScale: "75",
          },
          {
            lowScale: "75",
            highScale: "100",
          },
        ];
        this.mapData[index].indicator.levels[levelIndex].scales = this.mapData[
          index
        ].indicator.levels[levelIndex].scales.map((s, i) => {
          this.removeIndexes(index, levelIndex, i, "low", indicatorName);
          this.removeIndexes(index, levelIndex, i, "high", indicatorName);
          // console.log({...s, ...originalScale[i]})
          return { ...s, ...originalScale[i] };
        });
      }
    },
    validateInput(
      index,
      levelIndex,
      scaleIndex,
      scaleType,
      value,
      indicatorName
    ) {
      if (value) {
        let scaleObj =
          this.mapData[index].indicator.levels[levelIndex].scales[scaleIndex];
        let len =
          this.mapData[index].indicator.levels[levelIndex].scales.length;
        let indName = Array.isArray(indicatorName)
          ? indicatorName[0]
          : indicatorName;
        if (scaleType === "low") {
          if (value > scaleObj.highScale) {
            this.addIndexes(index, levelIndex, scaleIndex, scaleType, indName);
          } else {
            this.removeIndexes(
              index,
              levelIndex,
              scaleIndex,
              scaleType,
              indName
            );
          }
        } else {
          if (value < scaleObj.lowScale * 1) {
            this.addIndexes(index, levelIndex, scaleIndex, scaleType, indName);
          } else {
            this.removeIndexes(
              index,
              levelIndex,
              scaleIndex,
              scaleType,
              indName
            );
            if (scaleIndex !== len - 1) {
              this.mapData[index].indicator.levels[levelIndex].scales[
                `${scaleIndex + 1}`
              ].lowScale = value;
              if (
                this.mapData[index].indicator.levels[levelIndex].scales[
                  `${scaleIndex + 1}`
                ].highScale *
                  1 <
                value * 1
              ) {
                this.addIndexes(
                  index,
                  levelIndex,
                  `${scaleIndex + 1}`,
                  scaleType,
                  indName
                );
              } else {
                this.removeIndexes(
                  index,
                  levelIndex,
                  `${scaleIndex + 1}`,
                  scaleType,
                  indName
                );
              }
            }
          }
        }
      }
    },
    addIndexes(index, levelIndex, scaleIndex, scaleType, indicatorName) {
      this.errorIndex.push(`${scaleType}${index}${levelIndex}${scaleIndex}`);
      this.errorIndicator.push(indicatorName);
    },
    removeIndexes(index, levelIndex, scaleIndex, scaleType, indicatorName) {
      // console.log(this.errorIndex)
      let ind = this.errorIndex.indexOf(
        `${scaleType}${index}${levelIndex}${scaleIndex}`
      );
      if (ind > -1) {
        this.errorIndex.splice(ind, 1);
      }

      let ind1 = this.errorIndicator.indexOf(indicatorName);
      if (ind1 > -1) {
        this.errorIndicator.splice(ind1, 1);
      }
      // console.log(this.errorIndex)
    },
    //Delete specific mapping
    deleteDE({ index, ind, deIndex, dataKey }) {
      this.mapData[index].indicator[dataKey][ind].selectedDE.splice(deIndex, 1);
      this.mapData[index].indicator[dataKey][ind].de.splice(deIndex, 1);
    },
    //Reset the mapping
    resetDE({ index, ind, dataKey }) {
      this.mapData[index].indicator[dataKey][ind].de = [];
      this.mapData[index].indicator[dataKey][ind].selectedDE = [];
    },
    //Store the selected mapping in configuration object
    addDE({ index, ind, type, selectedDataSource, dataKey }) {
      this.mapData[index].indicator[dataKey][ind].type = type;
      this.mapData[index].indicator[dataKey][ind].selectedDE.push(
        selectedDataSource
      );
      this.mapData[index].indicator[dataKey][ind].de.push(
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

          if (
            response.data[this.chartByType] &&
            response.data[this.chartByType][this.chartBySubtype]
          ) {
            // console.log("response ministrial", [this.chartBySubtype], response.data)
            let data = response.data[this.chartByType][this.chartBySubtype];
            // console.log("response ministrial 1", data)

            this.mapOptions = data.mapOptions
              ? data.mapOptions
              : this.mapOptions;
            let mapData = "";
            if (data.mapData && typeof data.levelsSet === "undefined") {
              // if(data.mapData) {
              mapData = data.mapData.map((md) => ({
                indicator: {
                  ...md.indicator,
                  levels: this.levels,
                },
              }));
            } else {
              mapData = data.mapData;
            }
            let mData = mapData
              ? merge(
                  JSON.parse(JSON.stringify(this.mapData)),
                  JSON.parse(JSON.stringify(mapData))
                )
              : this.mapData;
            // console.log("mData",mData)
            let EMUData = mData.find((m) => !m.indicator.dataMapping),
              noEMUData = mData.filter((m) => m.indicator.dataMapping);
            // console.log("EMUData",EMUData)
            // console.log("noEMUData",noEMUData)
            if (EMUData) {
              noEMUData.unshift(EMUData);
            } else {
              noEMUData = noEMUData.map((m) => {
                if (m.indicator.static_name === "Indicator 10") {
                  return {
                    indicator: {
                      ...m.indicator,
                      dataMapping: false,
                    },
                  };
                } else {
                  return m;
                }
              });
            }
            // console.log("noEMUData",noEMUData)
            this.mapData = noEMUData;
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
    updateConfigData() {
      this.$store.state.loading = true;
      let chartBySubtypeData = {
        mapOptions: this.mapOptions,
        mapData: this.mapData,
        levelsSet: true,
      };

      let locale = this.$i18n.locale;
      let key = this.bProgramPriority
        ? this.generateKey("adProgramModule")
        : this.generateKey("adAnchorMapModule");

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
    },
  },
  created() {
    this.$store.state.loading = true;
    this.getConfigData();
  },
};
</script>
