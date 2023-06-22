<template>
  <div class="accordion-delete main-theme">
    <b-row
      class="mb-3"
      v-for="(chart, c) in settings"
      :key="configKey + chart.chartOptions.cid"
    >
      <b-col sm="12">
        <div>
          <img
            src="@/assets/images/icons/up-adminarrow.svg"
            :style="{ filter: filterColor }"
            class="mr-2 cursor-pointer f-s-0-875rem w-8px"
            v-b-tooltip.hover
            :title="$t('moveUp')"
            @click.prevent.stop="
              moveItem({
                type: configKey,
                tInd: i,
                stInd: j,
                cInd: c,
                places: -1,
              })
            "
          />
          <img
            src="@/assets/images/icons/down-adminarrow.svg"
            :style="{ filter: filterColor }"
            class="mr-2 cursor-pointer f-s-0-875rem w-8px"
            v-b-tooltip.hover
            :title="$t('moveDown')"
            @click.prevent.stop="
              moveItem({
                type: configKey,
                tInd: i,
                stInd: j,
                cInd: c,
                places: 1,
              })
            "
          />
          <img
            src="@/assets/images/icons/admindelete-icon.svg"
            :style="{ filter: filterColor }"
            class="mr-2 cursor-pointer f-s-0-875rem w-13"
            v-b-tooltip.hover
            :title="$t('deletebtn')"
            @click.prevent.stop="
              deleteElement({
                type: configKey,
                tInd: i,
                stInd: j,
                delInd: c,
              })
            "
          />
          <b-button
            class="btn-link p-0 text-uppercase color-grey f-s-0-875rem bg-transparent border-0"
            v-b-toggle="'collapse' + configKey + i + j + c"
          >
            <img
              src="@/assets/images/icons/setting-icon.svg"
              :style="{ filter: filterColor }"
              class="mr-2 cursor-pointer f-s-0-875rem w-14 mb-lg-1 mt-1"
              v-b-tooltip.hover
              :title="$t('settings')"
            />
            {{ chart.chartOptions.chartName[$i18n.locale] }}
          </b-button>

          <b-collapse
            class="border-b-l-radius-10px border-b-r-radius-10px mt-4"
            :id="'collapse' + configKey + i + j + c"
          >
            <b-row class="mb-3">
              <b-col sm="3">
                <label :for="`visible-${configKey}-${i}-${j}-${c}`">{{
                  $t("disable")
                }}</label>
              </b-col>
              <b-col sm="9">
                <b-input-group :id="`visible-${configKey}-${i}-${j}-${c}`">
                  <b-input-group-prepend
                    is-text
                    class="custom-switch"
                    style="margin-left: -45px"
                  >
                    <b-form-checkbox
                      switch
                      class="mr-n2"
                      v-model="chart.chartOptions.disable"
                    >
                    </b-form-checkbox>
                  </b-input-group-prepend>
                </b-input-group>
              </b-col>
            </b-row>
            <transition name="slide-fade">
              <div v-if="!chart.chartOptions.disable">
                <b-row>
                  <b-col sm="12" class="mb-3">
                    <b-row>
                      <b-col sm="3">
                        <label
                          :for="`chartHeading-${configKey}-${i}-${j}-${c}`"
                          >{{ $t("chartHeading") }}</label
                        >
                      </b-col>
                      <b-col sm="9">
                        <b-input-group
                          :id="`chartHeading-${configKey}-${i}-${j}-${c}`"
                        >
                          <b-form-textarea
                            v-model="chart.chartOptions.chartName[$i18n.locale]"
                            :state="
                              chart.chartOptions.chartName[$i18n.locale] &&
                              chart.chartOptions.chartName[$i18n.locale]
                                .length !== 0 &&
                              chart.chartOptions.chartName[$i18n.locale]
                                .length <= chartTitleMaxLength
                            "
                            placeholder=""
                            rows="3"
                            :maxlength="chartTitleMaxLength"
                            disabled
                          ></b-form-textarea>
                          <b-input-group-append is-text>
                            <Translations
                              :transText.sync="chart.chartOptions.chartName"
                            />
                          </b-input-group-append>
                        </b-input-group>
                        <span class="small"
                          >{{
                            chart.chartOptions.chartName[$i18n.locale]
                              ? chart.chartOptions.chartName[$i18n.locale]
                                  .length
                              : 0
                          }}/{{ chartTitleMaxLength }}</span
                        >
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col sm="12" class="mb-3">
                    <b-row>
                      <b-col sm="3">
                        <label
                          :for="`chartInformation-${configKey}-${i}-${j}-${c}`"
                          >{{ $t("chartInformation") }}</label
                        >
                      </b-col>
                      <b-col sm="9">
                        <b-input-group
                          :id="`chartInformation-${configKey}-${i}-${j}-${c}`"
                        >
                          <b-form-textarea
                            v-model="chart.chartOptions.chartInfo[$i18n.locale]"
                            :state="
                              chart.chartOptions.chartInfo[$i18n.locale] &&
                              chart.chartOptions.chartInfo[$i18n.locale]
                                .length !== 0 &&
                              chart.chartOptions.chartInfo[$i18n.locale]
                                .length <= chartInfoMaxLength
                            "
                            placeholder=""
                            rows="3"
                            :maxlength="chartInfoMaxLength"
                            disabled
                          ></b-form-textarea>
                          <b-input-group-append is-text>
                            <Translations
                              :transText.sync="chart.chartOptions.chartInfo"
                            />
                          </b-input-group-append>
                        </b-input-group>
                        <span class="small"
                          >{{
                            chart.chartOptions.chartInfo[$i18n.locale]
                              ? chart.chartOptions.chartInfo[$i18n.locale]
                                  .length
                              : 0
                          }}/{{ chartInfoMaxLength }}</span
                        >
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col
                    sm="12"
                    class="mb-3"
                    v-if="
                      $store.getters.getNamespace !==
                        'multi_program_mnch-dashboard' &&
                      (moduleKey === 'summaryDashboard' ||
                        moduleKey === 'analyticalDashboard') &&
                      subTabGroup === 'EMU'
                    "
                  >
                    <b-row>
                      <b-col sm="6">
                        <label
                          :for="`isSavedData-${configKey}-${i}-${j}-${c}`"
                          >{{ $t("useSavedEMU") }}</label
                        >
                      </b-col>
                      <b-col sm="6">
                        <b-input-group
                          :id="`isSavedData-${configKey}-${i}-${j}-${c}`"
                        >
                          <b-input-group-prepend is-text>
                            <b-form-checkbox
                              switch
                              class="mr-n2"
                              v-model="chart.chartOptions.isSavedData"
                            >
                            </b-form-checkbox>
                          </b-input-group-prepend>
                        </b-input-group>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col
                    sm="12"
                    class="mb-3"
                    v-if="
                      configKey !== 'mapSetting' &&
                      !chart.chartOptions.isSavedData
                    "
                  >
                    <b-row>
                      <b-col sm="3">
                        <label
                          :for="`isSingleSource-${configKey}-${i}-${j}-${c}`"
                          >{{ $t("singleSource") }}</label
                        >
                      </b-col>
                      <b-col sm="9" style="margin-left: -13px">
                        <b-input-group
                          :id="`isSingleSource-${configKey}-${i}-${j}-${c}`"
                        >
                          <b-input-group-prepend is-text>
                            <b-form-checkbox
                              switch
                              class="mr-n2"
                              v-model="chart.chartOptions.isSingleSource"
                            >
                            </b-form-checkbox>
                          </b-input-group-prepend>
                        </b-input-group>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col
                    sm="12"
                    class="mb-4"
                    v-if="!chart.chartOptions.isSavedData"
                  >
                    <b-row>
                      <b-col sm="3"
                        ><label
                          :for="`chartDataMapping-${configKey}-${i}-${j}-${c}`"
                          >{{ $t("dataMapping")
                          }}{{
                            !chart.chartOptions.isSingleSource
                              ? " (Source 1)"
                              : ""
                          }}</label
                        ></b-col
                      >
                      <b-col sm="9" class="search-text">
                        <!-- :auto-load-root-options="false" -->
                        <!-- :load-options="loadOptions" -->
                        <!-- :always-open="true" -->
                        <treeselect
                          :id="`chartDataMapping-${configKey}-${i}-${j}-${c}`"
                          :flat="true"
                          :multiple="true"
                          :show-count="true"
                          :default-expand-level="1"
                          :placeholder="$t('search')"
                          sort-value-by="ORDER_SELECTED"
                          v-model="chart.chartOptions.dataMapping"
                          :options="allMappings"
                          :disable-branch-nodes="true"
                          search-nested
                          @input="
                            updateBenchmarks({
                              tInd: i,
                              stInd: j,
                              cInd: c,
                              dataMapping: chart.chartOptions.dataMapping,
                              chartCategory: chart.chartOptions.chartCategory,
                              chartDataSum: chart.chartOptions.chartDataSum,
                            })
                          "
                          ><label
                            slot="option-label"
                            slot-scope="{ node, labelClassName }"
                            :class="labelClassName"
                          >
                            <b-badge
                              v-for="t in node.raw.type"
                              :key="'type' + t.alias"
                              class="mr-2 text-body"
                              variant="light"
                              :title="t.text"
                              v-b-tooltip.hover
                              :style="{
                                backgroundColor: t.color,
                                width: '25px',
                              }"
                              >{{ t.alias }}</b-badge
                            >
                            {{ node.label }}
                          </label>
                        </treeselect>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col
                    sm="12"
                    class="mb-3"
                    v-if="
                      !chart.chartOptions.isSingleSource &&
                      !chart.chartOptions.isSavedData
                    "
                  >
                    <b-row class="mb-2">
                      <b-col sm="3"
                        ><label
                          :for="`chartDataMapping2-${configKey}-${i}-${j}-${c}`"
                          >{{ $t("dataMapping") }} ({{ $t("Source2") }})</label
                        ></b-col
                      >
                      <b-col sm="9" class="search-text">
                        <!-- :auto-load-root-options="false" -->
                        <!-- :load-options="loadOptions" -->
                        <treeselect
                          :id="`chartDataMapping2-${configKey}-${i}-${j}-${c}`"
                          :flat="true"
                          :multiple="true"
                          :show-count="true"
                          :default-expand-level="1"
                          :placeholder="$t('search')"
                          sort-value-by="ORDER_SELECTED"
                          v-model="chart.chartOptions.dataMapping2"
                          :options="allMappings"
                          :disable-branch-nodes="true"
                          search-nested
                          @input="
                            updateBenchmarks({
                              tInd: i,
                              stInd: j,
                              cInd: c,
                              dataMapping: chart.chartOptions.dataMapping2,
                              chartCategory: chart.chartOptions.chartCategory,
                              chartDataSum: chart.chartOptions.chartDataSum2,
                            })
                          "
                          ><label
                            slot="option-label"
                            slot-scope="{ node, labelClassName }"
                            :class="labelClassName"
                          >
                            <b-badge
                              v-for="t in node.raw.type"
                              :key="'type' + t.alias"
                              class="mr-2 text-body"
                              variant="light"
                              :title="t.text"
                              v-b-tooltip.hover
                              :style="{
                                backgroundColor: t.color,
                                width: '25px',
                              }"
                              >{{ t.alias }}</b-badge
                            >
                            {{ node.label }}
                          </label>
                        </treeselect>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col
                    sm="12"
                    lg="6"
                    class="mb-3"
                    v-if="chart.chartOptions.type !== 'map'"
                  >
                    <b-row>
                      <b-col sm="5"
                        ><label
                          :for="`chartCategory-${configKey}-${i}-${j}-${c}`"
                          >{{ $t("category") }}</label
                        >
                      </b-col>
                      <b-col sm="7">
                        <b-form-select
                          :id="`chartCategory-${configKey}-${i}-${j}-${c}`"
                          v-model="chart.chartOptions.chartCategory"
                          :options="
                            chartCategories(
                              subTabGroup,
                              chart.chartOptions.isSingleSource,
                              chart.chartOptions.isSavedData
                            )
                          "
                          @change="
                            updateBenchmarks({
                              tInd: i,
                              stInd: j,
                              cInd: c,
                              dataMapping: chart.chartOptions.dataMapping,
                              chartCategory: chart.chartOptions.chartCategory,
                              chartDataSum: chart.chartOptions.chartDataSum,
                            })
                          "
                        ></b-form-select>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col sm="12" lg="6" class="mb-3">
                    <b-row>
                      <b-col sm="6">
                        <label :for="`chartType-${configKey}-${i}-${j}-${c}`"
                          >{{ $t("chart") }} {{ $t("type") }}</label
                        >
                      </b-col>
                      <b-col sm="6">
                        <b-form-select
                          :id="`chartType-${configKey}-${i}-${j}-${c}`"
                          :disabled="chart.chartOptions.type === 'map'"
                          v-model="chart.chartOptions.type"
                          :options="
                            chartTypeOptions(
                              chart.chartOptions.type,
                              subTabGroup,
                              chart.chartOptions.chartCategory,
                              chart.chartOptions.isSavedData,
                              chart.chartOptions.chartCalculation
                            )
                          "
                        >
                        </b-form-select>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col
                    sm="12"
                    lg="6"
                    class="mb-3"
                    v-if="chart.chartOptions.type !== 'map'"
                  >
                    <b-row>
                      <b-col sm="5"
                        ><label
                          :for="`chartCalculation-${configKey}-${i}-${j}-${c}`"
                          >{{ $t("calculationType") }}</label
                        >
                      </b-col>
                      <b-col sm="7">
                        <b-form-select
                          :id="`chartCalculation-${configKey}-${i}-${j}-${c}`"
                          v-model="chart.chartOptions.chartCalculation"
                          :options="
                            chartCalculations(
                              chart.chartOptions.chartCategory,
                              subTabGroup,
                              chart.chartOptions.isSavedData,
                              chart.chartOptions.isSingleSource
                            )
                          "
                        ></b-form-select>
                      </b-col>
                    </b-row>
                  </b-col>
                  <template
                    v-if="
                      ![
                        'MATRIX_TABLE',
                        'OTHER_MATRIX_TABLE',
                        'OTHER_MATRIX_TABLE_CYP',
                      ].includes(chart.chartOptions.chartCalculation)
                    "
                  >
                    <b-col
                      sm="12"
                      lg="6"
                      class="mb-3"
                      v-if="
                        chart.chartOptions.type !== 'map' &&
                        chart.chartOptions.chartCategory === 'seasonal'
                      "
                    >
                      <b-row>
                        <b-col sm="5"
                          ><label
                            :for="`seasonalPeriod-${configKey}-${i}-${j}-${c}`"
                            >{{ $t("compareYears") }}</label
                          >
                        </b-col>
                        <b-col sm="7">
                          <b-form-select
                            :id="`seasonalPeriod-${configKey}-${i}-${j}-${c}`"
                            v-model.number="chart.chartOptions.seasonalPeriod"
                            :options="seasonalPeriod()"
                          ></b-form-select>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col
                      sm="12"
                      lg="6"
                      class="mb-3"
                      v-if="chart.chartOptions.type !== 'map'"
                    >
                      <b-row>
                        <b-col sm="5">
                          <label
                            :for="`percentIndicator-${configKey}-${i}-${j}-${c}`"
                            >{{ $t("percentageIndicator") }}</label
                          >
                        </b-col>
                        <b-col sm="7">
                          <b-input-group
                            :id="`percentIndicator-${configKey}-${i}-${j}-${c}`"
                          >
                            <b-input-group-prepend is-text>
                              <b-form-checkbox
                                switch
                                class="mr-n2"
                                v-model="chart.chartOptions.percentageIndicator"
                              >
                              </b-form-checkbox>
                            </b-input-group-prepend>
                          </b-input-group>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col
                      sm="12"
                      lg="6"
                      class="mb-3"
                      v-if="
                        chart.chartOptions.type !== 'map' &&
                        chart.chartOptions.chartCategory === 'trend'
                      "
                    >
                      <b-row>
                        <b-col sm="5">
                          <label
                            :for="`chartDrillDown-${configKey}-${i}-${j}-${c}`"
                            >{{ $t("drilldown") }}</label
                          >
                        </b-col>
                        <b-col sm="7">
                          <b-input-group
                            :id="`chartDrillDown-${configKey}-${i}-${j}-${c}`"
                          >
                            <b-input-group-prepend is-text>
                              <b-form-checkbox
                                switch
                                class="mr-n2"
                                v-model="chart.chartOptions.chartDrillDown"
                              >
                              </b-form-checkbox>
                            </b-input-group-prepend>
                            <transition name="slide-fade">
                              <template
                                v-if="chart.chartOptions.chartDrillDown"
                              >
                                <b-form-textarea
                                  v-model="
                                    chart.chartOptions.drillYTitle[$i18n.locale]
                                  "
                                  :placeholder="$t('y_axis')"
                                  disabled
                                ></b-form-textarea>
                              </template>
                            </transition>
                            <b-input-group-append
                              is-text
                              v-if="chart.chartOptions.chartDrillDown"
                            >
                              <Translations
                                :transText.sync="chart.chartOptions.drillYTitle"
                              />
                            </b-input-group-append>
                          </b-input-group>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col
                      sm="12"
                      lg="6"
                      class="mb-3"
                      v-if="
                        chart.chartOptions.type !== 'map' &&
                        chart.chartOptions.chartCategory === 'trend' &&
                        chart.chartOptions.chartDrillDown
                      "
                    >
                      <b-row>
                        <b-col sm="5"
                          ><label
                            :for="`drillCalculation-${configKey}-${i}-${j}-${c}`"
                            >{{ $t("drilldown") }}
                            {{ $t("calculationType") }}</label
                          >
                        </b-col>
                        <b-col sm="7">
                          <b-form-select
                            :id="`drillCalculation-${configKey}-${i}-${j}-${c}`"
                            v-model="chart.chartOptions.drillCalculation"
                            :options="[
                              {
                                text: $t('changeMonth'),
                                value: 'PERIOD_DIFF',
                              },
                              {
                                text: $t('default'),
                                value: 'DEFAULT',
                              },
                            ]"
                          ></b-form-select>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col
                      sm="12"
                      lg="6"
                      class="mb-3"
                      v-if="
                        chart.chartOptions.type !== 'map' &&
                        chart.chartOptions.chartCategory === 'trend' &&
                        chart.chartOptions.chartDrillDown
                      "
                    >
                      <b-row>
                        <b-col sm="5">
                          <label
                            :for="`drillPointBenchmark-${configKey}-${i}-${j}-${c}`"
                            >{{ $t("drillPointBenchmark") }}</label
                          >
                        </b-col>
                        <b-col sm="7">
                          <b-input-group
                            :id="`drillPointBenchmark-${configKey}-${i}-${j}-${c}`"
                          >
                            <b-input-group-prepend is-text>
                              <b-form-checkbox
                                switch
                                class="mr-n2"
                                v-model="chart.chartOptions.drillPointBenchmark"
                              >
                              </b-form-checkbox>
                            </b-input-group-prepend>
                          </b-input-group>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col
                      sm="12"
                      lg="6"
                      class="mb-3"
                      v-if="chart.chartOptions.type !== 'map'"
                    >
                      <b-row>
                        <b-col sm="5">
                          <label
                            :for="`chartDataSum-${configKey}-${i}-${j}-${c}`"
                            >{{ $t("dataSum")
                            }}{{
                              !chart.chartOptions.isSingleSource
                                ? " (Source 1)"
                                : ""
                            }}</label
                          >
                        </b-col>
                        <b-col sm="7">
                          <b-input-group
                            :id="`chartDataSum-${configKey}-${i}-${j}-${c}`"
                          >
                            <b-input-group-prepend is-text>
                              <b-form-checkbox
                                switch
                                class="mr-n2"
                                v-model="chart.chartOptions.chartDataSum"
                                @change="
                                  updateBenchmarks({
                                    tInd: i,
                                    stInd: j,
                                    cInd: c,
                                    dataMapping: chart.chartOptions.dataMapping,
                                    chartCategory:
                                      chart.chartOptions.chartCategory,
                                    chartDataSum:
                                      chart.chartOptions.chartDataSum,
                                  })
                                "
                              >
                              </b-form-checkbox>
                            </b-input-group-prepend>
                            <transition name="slide-fade">
                              <template v-if="chart.chartOptions.chartDataSum">
                                <template
                                  v-if="
                                    chart.chartOptions.sumLegend &&
                                    typeof chart.chartOptions.sumLegend ===
                                      'object'
                                  "
                                >
                                  <b-form-textarea
                                    v-model="
                                      chart.chartOptions.sumLegend[$i18n.locale]
                                    "
                                    :placeholder="$t('legend')"
                                    disabled
                                  ></b-form-textarea>
                                </template>
                                <template v-else>
                                  <b-form-textarea
                                    v-model="chart.chartOptions.sumLegend"
                                    :placeholder="$t('legend')"
                                    disabled
                                  ></b-form-textarea>
                                </template>
                              </template>
                            </transition>
                            <b-input-group-append
                              is-text
                              v-if="chart.chartOptions.chartDataSum"
                            >
                              <Translations
                                :transText.sync="chart.chartOptions.sumLegend"
                              />
                            </b-input-group-append>
                          </b-input-group>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col
                      sm="12"
                      lg="6"
                      class="mb-3"
                      v-if="
                        chart.chartOptions.type !== 'map' &&
                        !chart.chartOptions.isSingleSource
                      "
                    >
                      <b-row>
                        <b-col sm="5">
                          <label
                            :for="`chartDataSum2-${configKey}-${i}-${j}-${c}`"
                            >{{ $t("dataSum") }} ({{ $t("Source2") }})</label
                          >
                        </b-col>
                        <b-col sm="7">
                          <b-input-group
                            :id="`chartDataSum2-${configKey}-${i}-${j}-${c}`"
                          >
                            <b-input-group-prepend is-text>
                              <b-form-checkbox
                                switch
                                class="mr-n2"
                                v-model="chart.chartOptions.chartDataSum2"
                                @change="
                                  updateBenchmarks({
                                    tInd: i,
                                    stInd: j,
                                    cInd: c,
                                    dataMapping:
                                      chart.chartOptions.dataMapping2,
                                    chartCategory:
                                      chart.chartOptions.chartCategory,
                                    chartDataSum:
                                      chart.chartOptions.chartDataSum2,
                                  })
                                "
                              >
                              </b-form-checkbox>
                            </b-input-group-prepend>
                            <transition name="slide-fade">
                              <template v-if="chart.chartOptions.chartDataSum2">
                                <template
                                  v-if="
                                    chart.chartOptions.sumLegend2 &&
                                    typeof chart.chartOptions.sumLegend2 ===
                                      'object'
                                  "
                                >
                                  <b-form-textarea
                                    v-model="
                                      chart.chartOptions.sumLegend2[
                                        $i18n.locale
                                      ]
                                    "
                                    :placeholder="$t('legend')"
                                    disabled
                                  ></b-form-textarea>
                                </template>
                                <template v-else>
                                  <b-form-textarea
                                    v-model="chart.chartOptions.sumLegend2"
                                    :placeholder="$t('legend')"
                                    disabled
                                  ></b-form-textarea>
                                </template>
                              </template>
                            </transition>
                            <b-input-group-append
                              is-text
                              v-if="chart.chartOptions.chartDataSum2"
                            >
                              <Translations
                                :transText.sync="chart.chartOptions.sumLegend2"
                              />
                            </b-input-group-append>
                          </b-input-group>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col
                      sm="12"
                      lg="6"
                      class="mb-3"
                      v-if="chart.chartOptions.type !== 'map'"
                    >
                      <b-row>
                        <b-col sm="5"
                          ><label
                            :for="`benchmarks-${configKey}-${i}-${j}-${c}`"
                            >{{ $t("benchmark") }}</label
                          >
                        </b-col>
                        <b-col sm="7">
                          <treeselect
                            :id="`benchmarks-${configKey}-${i}-${j}-${c}`"
                            :flat="true"
                            :multiple="true"
                            :show-count="true"
                            sort-value-by="INDEX"
                            :default-expand-level="1"
                            :placeholder="$t('search')"
                            :auto-load-root-options="false"
                            v-model="chart.chartOptions.benchmarks"
                            :options="
                              benchmarks(
                                chart.chartOptions.dataMapping,
                                chart.chartOptions.chartCategory,
                                chart.chartOptions.chartCalculation,
                                chart.chartOptions.chartDataSum
                              )
                            "
                          />
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col
                      sm="12"
                      lg="6"
                      class="mb-3"
                      v-if="
                        chart.chartOptions.type !== 'map' &&
                        chart.chartOptions.benchmarks &&
                        chart.chartOptions.benchmarks.length
                      "
                    >
                      <b-row>
                        <b-col sm="5">
                          <label
                            :for="`benchmarkInLegend-${configKey}-${i}-${j}-${c}`"
                            >{{ $t("benchmark") }} in {{ $t("legend") }}</label
                          >
                        </b-col>
                        <b-col sm="7">
                          <b-input-group
                            :id="`benchmarkInLegend-${configKey}-${i}-${j}-${c}`"
                          >
                            <b-input-group-prepend is-text>
                              <b-form-checkbox
                                switch
                                class="mr-n2"
                                v-model="chart.chartOptions.benchmarkInLegend"
                              >
                              </b-form-checkbox>
                            </b-input-group-prepend>
                          </b-input-group>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col
                      sm="12"
                      lg="6"
                      class="mb-3"
                      v-if="
                        chart.chartOptions.type !== 'map' &&
                        chart.chartOptions.chartDataSum &&
                        chart.chartOptions.chartCategory !== 'regionalTrend'
                      "
                    >
                      <b-row>
                        <b-col sm="5"
                          ><label
                            :for="`chartColor-${configKey}-${i}-${j}-${c}`"
                            >{{ $t("color") }}</label
                          ></b-col
                        >
                        <b-col sm="7">
                          <b-input-group
                            :id="`chartColor-${configKey}-${i}-${j}-${c}`"
                          >
                            <b-form-input
                              type="text"
                              v-model="chart.chartOptions.color"
                            ></b-form-input>
                            <b-input-group-append>
                              <b-form-input
                                type="color"
                                class="w-40px"
                                v-model="chart.chartOptions.color"
                              ></b-form-input>
                            </b-input-group-append>
                          </b-input-group>
                        </b-col>
                      </b-row>
                    </b-col>
                    <template
                      v-if="
                        chart.chartOptions.type !== 'map' &&
                        chart.chartOptions.chartCategory === 'seasonal'
                      "
                    >
                      <b-col
                        sm="12"
                        lg="6"
                        class="mb-3"
                        v-for="n in chart.chartOptions.seasonalPeriod"
                        :key="`seasonalChartColors-${configKey}-${i}-${j}-${c}-${n}`"
                      >
                        <b-row>
                          <b-col sm="5"
                            ><label
                              :for="`seasonalChartColor-${configKey}-${i}-${j}-${c}-${n}`"
                              >{{ $t("color") }} {{ n }}</label
                            ></b-col
                          >
                          <b-col sm="7">
                            <b-input-group
                              :id="`seasonalChartColor-${configKey}-${i}-${j}-${c}-${n}`"
                            >
                              <b-form-input
                                type="text"
                                v-model="
                                  chart.chartOptions.seasonalColors[n - 1]
                                "
                              ></b-form-input>
                              <b-input-group-append>
                                <b-form-input
                                  type="color"
                                  class="w-40px"
                                  v-model="
                                    chart.chartOptions.seasonalColors[n - 1]
                                  "
                                ></b-form-input>
                              </b-input-group-append>
                            </b-input-group>
                          </b-col>
                        </b-row>
                      </b-col>
                    </template>
                    <b-col
                      sm="12"
                      lg="6"
                      class="mb-3"
                      v-if="chart.chartOptions.type !== 'map'"
                    >
                      <b-row>
                        <b-col sm="5"
                          ><label
                            :for="`chartTitle-${configKey}-${i}-${j}-${c}`"
                            >{{ $t("chart_title") }}</label
                          ></b-col
                        >
                        <b-col sm="7">
                          <b-input-group
                            :id="`chartTitle-${configKey}-${i}-${j}-${c}`"
                          >
                            <b-input-group-prepend is-text>
                              <b-form-checkbox
                                switch
                                class="mr-n2"
                                v-model="chart.chartOptions.title.visible"
                              >
                              </b-form-checkbox>
                            </b-input-group-prepend>
                            <transition name="slide-fade">
                              <template v-if="chart.chartOptions.title.visible">
                                <b-form-textarea
                                  v-model="
                                    chart.chartOptions.title.text[$i18n.locale]
                                  "
                                  disabled
                                ></b-form-textarea>
                              </template>
                            </transition>
                            <b-input-group-append
                              is-text
                              v-if="chart.chartOptions.title.visible"
                            >
                              <Translations
                                :transText.sync="chart.chartOptions.title.text"
                              />
                            </b-input-group-append>
                          </b-input-group>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col
                      sm="12"
                      lg="6"
                      class="mb-3"
                      v-if="chart.chartOptions.type !== 'map'"
                    >
                      <b-row>
                        <b-col sm="5"
                          ><label
                            :for="`chartSubTitle-${configKey}-${i}-${j}-${c}`"
                            >{{ $t("chart_subtitle") }}</label
                          ></b-col
                        >
                        <b-col sm="7">
                          <b-input-group
                            :id="`chartSubTitle-${configKey}-${i}-${j}-${c}`"
                          >
                            <b-input-group-prepend is-text>
                              <b-form-checkbox
                                switch
                                class="mr-n2"
                                v-model="chart.chartOptions.subTitle.visible"
                              >
                              </b-form-checkbox>
                            </b-input-group-prepend>
                            <transition name="slide-fade">
                              <template
                                v-if="chart.chartOptions.subTitle.visible"
                              >
                                <b-form-textarea
                                  v-model="
                                    chart.chartOptions.subTitle.text[
                                      $i18n.locale
                                    ]
                                  "
                                  disabled
                                ></b-form-textarea>
                              </template>
                            </transition>
                            <b-input-group-append
                              is-text
                              v-if="chart.chartOptions.subTitle.visible"
                            >
                              <Translations
                                :transText.sync="
                                  chart.chartOptions.subTitle.text
                                "
                              />
                            </b-input-group-append>
                          </b-input-group>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col
                      sm="12"
                      lg="6"
                      class="mb-3"
                      v-if="chart.chartOptions.type !== 'map'"
                    >
                      <b-row>
                        <b-col sm="5"
                          ><label
                            :for="`chartXAxis-${configKey}-${i}-${j}-${c}`"
                            >{{ $t("x_axis") }}</label
                          ></b-col
                        >
                        <b-col sm="7">
                          <b-input-group
                            :id="`chartXAxis-${configKey}-${i}-${j}-${c}`"
                          >
                            <b-input-group-prepend is-text>
                              <b-form-checkbox
                                switch
                                class="mr-n2"
                                v-model="chart.chartOptions.xAxis.visible"
                              >
                              </b-form-checkbox>
                            </b-input-group-prepend>
                            <transition name="slide-fade">
                              <template v-if="chart.chartOptions.xAxis.visible">
                                <b-form-textarea
                                  v-model="
                                    chart.chartOptions.xAxis.text[$i18n.locale]
                                  "
                                  disabled
                                ></b-form-textarea>
                              </template>
                            </transition>
                            <b-input-group-append
                              is-text
                              v-if="chart.chartOptions.xAxis.visible"
                            >
                              <Translations
                                :transText.sync="chart.chartOptions.xAxis.text"
                              />
                            </b-input-group-append>
                          </b-input-group>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col
                      sm="12"
                      lg="6"
                      class="mb-3"
                      v-if="chart.chartOptions.type !== 'map'"
                    >
                      <b-row>
                        <b-col sm="5"
                          ><label
                            :for="`chartYAxis-${configKey}-${i}-${j}-${c}`"
                            >{{ $t("y_axis") }}</label
                          ></b-col
                        >
                        <b-col sm="7">
                          <b-input-group
                            :id="`chartYAxis-${configKey}-${i}-${j}-${c}`"
                          >
                            <b-input-group-prepend is-text>
                              <b-form-checkbox
                                switch
                                class="mr-n2"
                                v-model="chart.chartOptions.yAxis.visible"
                              >
                              </b-form-checkbox>
                            </b-input-group-prepend>
                            <transition name="slide-fade">
                              <template v-if="chart.chartOptions.yAxis.visible">
                                <b-form-textarea
                                  v-model="
                                    chart.chartOptions.yAxis.text[$i18n.locale]
                                  "
                                  disabled
                                ></b-form-textarea>
                              </template>
                            </transition>
                            <b-input-group-append
                              is-text
                              v-if="chart.chartOptions.yAxis.visible"
                            >
                              <Translations
                                :transText.sync="chart.chartOptions.yAxis.text"
                              />
                            </b-input-group-append>
                          </b-input-group>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col sm="12" lg="6" class="mb-3">
                      <b-row>
                        <b-col sm="6">
                          <label
                            class=""
                            :for="`chartSource-${configKey}-${i}-${j}-${c}`"
                            >{{ $t("source") }}</label
                          >
                        </b-col>
                        <b-col sm="6">
                          <b-input-group
                            :id="`chartSource-${configKey}-${i}-${j}-${c}`"
                          >
                            <b-form-textarea
                              v-model="chart.chartOptions.source[$i18n.locale]"
                              disabled
                            ></b-form-textarea>
                            <b-input-group-append is-text>
                              <Translations
                                :transText.sync="chart.chartOptions.source"
                              />
                            </b-input-group-append>
                          </b-input-group>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col
                      sm="12"
                      lg="6"
                      class="mb-3"
                      v-if="chart.chartOptions.type !== 'map'"
                    >
                      <b-row>
                        <b-col sm="5">
                          <label
                            :for="`chartDataLabel-${configKey}-${i}-${j}-${c}`"
                            >{{ $t("dataLabels") }}</label
                          >
                        </b-col>
                        <b-col sm="7">
                          <b-input-group
                            :id="`chartDataLabel-${configKey}-${i}-${j}-${c}`"
                          >
                            <b-input-group-prepend is-text>
                              <b-form-checkbox
                                class="mr-n2"
                                switch
                                v-model="chart.chartOptions.dataLabels"
                              >
                              </b-form-checkbox>
                            </b-input-group-prepend>
                          </b-input-group>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col
                      sm="12"
                      lg="6"
                      class="mb-3"
                      v-if="
                        chart.chartOptions.type !== 'map' &&
                        ((moduleKey === 'analyticalDashboard' &&
                          (['seasonal', 'trend'].includes(
                            chart.chartOptions.chartCategory
                          ) ||
                            chart.chartOptions.chartCalculation ===
                              'PERIOD_DIFF')) ||
                          ((moduleKey === 'summaryDashboard' ||
                            moduleKey === 'dqrDashboard') &&
                            ['trend'].includes(
                              chart.chartOptions.chartCategory
                            ) &&
                            !subTabGroup.includes('-CC-')) ||
                          (moduleKey === 'dqrDashboard' &&
                            ['regional'].includes(
                              chart.chartOptions.chartCategory
                            ) &&
                            subTabGroup.includes('-CC-') &&
                            ['scatter'].includes(chart.chartOptions.type)))
                      "
                    >
                      <b-row>
                        <b-col sm="5">
                          <label
                            :for="`chartNarrations-${configKey}-${i}-${j}-${c}`"
                            >{{ $t("generateSummary") }}</label
                          >
                        </b-col>
                        <b-col sm="7">
                          <b-input-group
                            :id="`chartNarrations-${configKey}-${i}-${j}-${c}`"
                          >
                            <b-input-group-prepend is-text>
                              <b-form-checkbox
                                class="mr-n2"
                                switch
                                v-model="chart.chartOptions.generateSummary"
                              >
                              </b-form-checkbox>
                            </b-input-group-prepend>
                          </b-input-group>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col
                      sm="12"
                      lg="6"
                      class="mb-3"
                      v-if="
                        chart.chartOptions.type !== 'map' &&
                        moduleKey === 'analyticalDashboard' &&
                        subTabGroup.includes('SUMMARY') &&
                        chart.chartOptions.generateSummary &&
                        chart.chartOptions.priorityIndicator
                      "
                    >
                      <b-row>
                        <b-col sm="5">
                          <label
                            :for="`compareFlag-${configKey}-${i}-${j}-${c}`"
                            >{{ $t("compareFlag") }}</label
                          >
                        </b-col>
                        <b-col sm="7">
                          <b-input-group
                            :id="`compareFlag-${configKey}-${i}-${j}-${c}`"
                          >
                            <b-input-group-prepend is-text>
                              <b-form-checkbox
                                class="mr-n2"
                                switch
                                v-model="chart.chartOptions.compareFlag"
                              >
                              </b-form-checkbox>
                            </b-input-group-prepend>
                          </b-input-group>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col
                      sm="12"
                      lg="6"
                      class="mb-3"
                      v-if="
                        chart.chartOptions.type !== 'map' &&
                        (chart.chartOptions.compareFlag ||
                          chart.chartOptions.generateFlag) &&
                        !chart.chartOptions.chartDataSum
                      "
                    >
                      <b-row>
                        <b-col sm="5">
                          <label
                            :for="`priorityFlagIndicator-${configKey}-${i}-${j}-${c}`"
                            >{{ $t("priorityFlagIndicator") }}</label
                          >
                        </b-col>
                        <b-col sm="7">
                          <b-form-select
                            :id="`priorityFlagIndicator-${configKey}-${i}-${j}-${c}`"
                            v-model="chart.chartOptions.priorityFlagIndicator"
                            :options="mappings(chart.chartOptions.dataMapping)"
                          ></b-form-select>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col
                      sm="12"
                      lg="6"
                      class="mb-3"
                      v-if="
                        chart.chartOptions.type !== 'map' &&
                        moduleKey === 'analyticalDashboard' &&
                        !subTabGroup.includes('SUMMARY') &&
                        chart.chartOptions.generateSummary &&
                        ((chart.chartOptions.chartCalculation ===
                          'PERIOD_DIFF' &&
                          subTabGroup.includes('GEO')) ||
                          !subTabGroup.includes('GEO'))
                      "
                    >
                      <b-row>
                        <b-col sm="5">
                          <label
                            :for="`generateFlag-${configKey}-${i}-${j}-${c}`"
                            >{{ $t("generateFlag") }}</label
                          >
                        </b-col>
                        <b-col sm="7">
                          <b-input-group
                            :id="`generateFlag-${configKey}-${i}-${j}-${c}`"
                          >
                            <b-input-group-prepend is-text>
                              <b-form-checkbox
                                class="mr-n2"
                                switch
                                v-model="chart.chartOptions.generateFlag"
                              >
                              </b-form-checkbox>
                            </b-input-group-prepend>
                          </b-input-group>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col
                      sm="12"
                      lg="6"
                      class="mb-3"
                      v-if="
                        chart.chartOptions.type !== 'map' &&
                        moduleKey === 'dqrDashboard' &&
                        !['seasonal'].includes(
                          chart.chartOptions.chartCategory
                        ) &&
                        chart.chartOptions.chartCalculation === 'DEFAULT' &&
                        (subTabGroup.includes('-CT-') ||
                          subTabGroup.includes('-IC-'))
                      "
                    >
                      <b-row>
                        <b-col sm="5">
                          <label
                            :for="`generateOutliers-${configKey}-${i}-${j}-${c}`"
                            >{{ $t("generateOutliers") }}</label
                          >
                        </b-col>
                        <b-col sm="7">
                          <b-input-group
                            :id="`generateOutliers-${configKey}-${i}-${j}-${c}`"
                          >
                            <b-input-group-prepend is-text>
                              <b-form-checkbox
                                class="mr-n2"
                                switch
                                v-model="chart.chartOptions.generateOutliers"
                              >
                              </b-form-checkbox>
                            </b-input-group-prepend>
                          </b-input-group>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col
                      sm="12"
                      lg="6"
                      class="mb-3"
                      v-if="
                        chart.chartOptions.type !== 'map' &&
                        subTabGroup === 'SUMMARY'
                      "
                    >
                      <b-row>
                        <b-col sm="5">
                          <label
                            :for="`chartPriorityIndicator-${configKey}-${i}-${j}-${c}`"
                            >{{ $t("chartPriorityIndicator") }}</label
                          >
                        </b-col>
                        <b-col sm="7">
                          <b-input-group
                            :id="`chartPriorityIndicator-${configKey}-${i}-${j}-${c}`"
                          >
                            <b-input-group-prepend is-text>
                              <b-form-checkbox
                                class="mr-n2"
                                switch
                                v-model="chart.chartOptions.priorityIndicator"
                              >
                              </b-form-checkbox>
                            </b-input-group-prepend>
                          </b-input-group>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col
                      sm="12"
                      lg="6"
                      class="mb-3"
                      v-if="
                        chart.chartOptions.type !== 'map' &&
                        ['regional', 'trend'].includes(
                          chart.chartOptions.chartCategory
                        ) &&
                        chart.chartOptions.type !== 'packedbubble'
                      "
                    >
                      <b-row>
                        <b-col sm="5">
                          <label
                            :for="`generateTotal-${configKey}-${i}-${j}-${c}`"
                            >{{ $t("generateTotal") }}</label
                          >
                        </b-col>
                        <b-col sm="7">
                          <b-input-group
                            :id="`generateTotal-${configKey}-${i}-${j}-${c}`"
                          >
                            <b-input-group-prepend is-text>
                              <b-form-checkbox
                                switch
                                class="mr-n2"
                                v-model="chart.chartOptions.generateTotal"
                              >
                              </b-form-checkbox>
                            </b-input-group-prepend>
                            <transition name="slide-fade">
                              <template v-if="chart.chartOptions.generateTotal">
                                <template
                                  v-if="
                                    chart.chartOptions.totalLegend &&
                                    typeof chart.chartOptions.totalLegend ===
                                      'object'
                                  "
                                >
                                  <b-form-textarea
                                    v-model="
                                      chart.chartOptions.totalLegend[
                                        $i18n.locale
                                      ]
                                    "
                                    :placeholder="$t('legend')"
                                    disabled
                                  ></b-form-textarea>
                                </template>
                                <template v-else>
                                  <b-form-textarea
                                    v-model="chart.chartOptions.totalLegend"
                                    :placeholder="$t('legend')"
                                    disabled
                                  ></b-form-textarea>
                                </template>
                              </template>
                            </transition>
                            <b-input-group-append
                              is-text
                              v-if="chart.chartOptions.generateTotal"
                            >
                              <Translations
                                :transText.sync="chart.chartOptions.totalLegend"
                              />
                            </b-input-group-append>
                          </b-input-group>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col
                      sm="12"
                      lg="6"
                      class="mb-3"
                      v-if="
                        chart.chartOptions.type !== 'map' &&
                        chart.chartOptions.generateTotal
                      "
                    >
                      <b-row>
                        <b-col sm="5">
                          <label :for="`totalColor-${configKey}-${i}-${j}-${c}`"
                            >{{ $t("Total") }} {{ $t("color") }}</label
                          >
                        </b-col>
                        <b-col sm="7">
                          <b-input-group
                            :id="`totalColor-${configKey}-${i}-${j}-${c}`"
                          >
                            <b-form-input
                              type="text"
                              v-model="chart.chartOptions.totalColor"
                            ></b-form-input>
                            <b-input-group-append>
                              <b-form-input
                                type="color"
                                class="w-40px"
                                v-model="chart.chartOptions.totalColor"
                              ></b-form-input>
                            </b-input-group-append>
                          </b-input-group>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col
                      sm="12"
                      lg="6"
                      class="mb-3"
                      v-if="
                        chart.chartOptions.type !== 'map' &&
                        chart.chartOptions.generateTotal
                      "
                    >
                      <b-row>
                        <b-col sm="5">
                          <label
                            :for="`totalPosition-${configKey}-${i}-${j}-${c}`"
                            >{{ $t("totalPosition") }}</label
                          >
                        </b-col>
                        <b-col sm="7">
                          <b-form-select
                            :id="`totalPosition-${configKey}-${i}-${j}-${c}`"
                            v-model="chart.chartOptions.totalPosition"
                            :options="[
                              {
                                text: $t('first'),
                                value: 'FIRST',
                              },
                              {
                                text: $t('last'),
                                value: 'LAST',
                              },
                            ]"
                          >
                          </b-form-select>
                        </b-col>
                      </b-row>
                    </b-col>
                  </template>
                  <b-col
                    sm="12"
                    lg="12"
                    class="mb-3 mt-3"
                    v-if="chart.chartOptions.type === 'map'"
                  >
                    <b-row>
                      <b-col sm="3" class="mb-3">
                        {{ $t("scales") }}
                      </b-col>
                      <b-col sm="9" class="mb-3">
                        <b-tabs class="charts-tabs">
                          <!-- content-class="mt-3" -->
                          <b-tab
                            v-for="(levelScale, levelIndex) in chart
                              .chartOptions.levels"
                            :key="'levels-' + i + j + c + levelIndex"
                            :title="levelScale.levelName"
                          >
                            <div
                              class="border-adminmain border-adminradius mt-3 mb-3 p-3"
                            >
                              <b-row class="mt-3">
                                <b-col sm="4" class="mb-3">
                                  <b-input-group>
                                    <b-form-input
                                      type="text"
                                      v-model="paletteColor"
                                    ></b-form-input>
                                    <b-input-group-append>
                                      <b-form-input
                                        type="color"
                                        class="w-40px"
                                        v-model="paletteColor"
                                      ></b-form-input>
                                    </b-input-group-append>
                                  </b-input-group>
                                </b-col>
                                <b-col sm="8" class="mb-3">
                                  <b-row class="color-admingroup">
                                    <b-col sm="6" class="pr-1">
                                      <b-input-group>
                                        <b-input-group-prepend>
                                          <div
                                            class="input-group-text p-1 px-2 cursor-pointer"
                                            v-b-tooltip.hover
                                            :title="$t('percentageInfo')"
                                          >
                                            <i
                                              class="fa fa-info f-s-0-875rem"
                                            ></i>
                                          </div>
                                        </b-input-group-prepend>
                                        <b-form-input
                                          type="number"
                                          min="-99"
                                          max="99"
                                          v-model="percentageLight"
                                        ></b-form-input>
                                        <b-input-group-append
                                          is-text
                                          class="w-50"
                                        >
                                          <b-form-input
                                            v-model="percentageLight"
                                            type="range"
                                            min="-99"
                                            max="99"
                                            step="1"
                                          ></b-form-input>
                                        </b-input-group-append>
                                      </b-input-group>
                                    </b-col>
                                    <b-col sm="6" class="">
                                      <b-input-group>
                                        <b-input-group-prepend>
                                          <div
                                            class="input-group-text p-1 px-2 cursor-pointer"
                                            v-b-tooltip.hover
                                            :title="$t('shadesInfo')"
                                          >
                                            <i
                                              class="fa fa-info f-s-0-875rem"
                                            ></i>
                                          </div>
                                        </b-input-group-prepend>
                                        <b-form-input
                                          type="number"
                                          min="4"
                                          max="9"
                                          v-model="shadesNumber"
                                        ></b-form-input>
                                        <b-input-group-append
                                          is-text
                                          class="w-50"
                                        >
                                          <b-form-input
                                            v-model="shadesNumber"
                                            type="range"
                                            min="4"
                                            max="9"
                                            step="1"
                                          ></b-form-input>
                                        </b-input-group-append>
                                      </b-input-group>
                                    </b-col>
                                  </b-row>
                                </b-col>
                              </b-row>
                              <b-row class="color-shades">
                                <b-col sm="5" class="mb-3">
                                  <b-row class="mx-0 palettee1">
                                    <b-col
                                      class="p-3 border"
                                      v-for="(shade, sh) in shades"
                                      :key="
                                        'shades-' + i + j + c + levelIndex + sh
                                      "
                                      :style="{
                                        'background-color': shade,
                                      }"
                                    ></b-col>
                                  </b-row>
                                </b-col>
                                <b-col sm="7" class="mb-3 mt-2 text-right">
                                  <b-button
                                    class="black-btn btn-sm ml-2 admin-greybtn"
                                    v-on:click.prevent.stop="
                                      applyPalette({
                                        tInd: i,
                                        stInd: j,
                                        cmInd: c,
                                        key: configKey,
                                        shades: shades,
                                        levelInd: levelIndex,
                                      })
                                    "
                                    >{{ $t("apply") }}</b-button
                                  >
                                  <b-button
                                    class="black-btn btn-sm ml-2 blue-btn"
                                    v-on:click.prevent.stop="
                                      applyPalette({
                                        tInd: i,
                                        stInd: j,
                                        cmInd: c,
                                        key: configKey,
                                        shades: shades,
                                      })
                                    "
                                    >{{ $t("applyAll") }}</b-button
                                  >
                                </b-col>
                              </b-row>

                              <b-row>
                                <b-col sm="12" class="mb-3">
                                  <div class="cursor-pointer small">
                                    <span @click="showShades = !showShades"
                                      ><u>{{ $t("predefinedColors") }}</u></span
                                    >
                                  </div>
                                  <transition name="slide-fade">
                                    <div
                                      v-if="showShades"
                                      class="border p-2 border-radius-4px"
                                    >
                                      <b-row
                                        class="mx-0"
                                        v-for="(
                                          predefinedShade, psi
                                        ) in predefinedShades"
                                        :key="
                                          'predefinedShades' +
                                          i +
                                          j +
                                          c +
                                          levelIndex +
                                          psi
                                        "
                                        :class="
                                          predefinedShades.length - 1 === psi
                                            ? ''
                                            : 'pb-2'
                                        "
                                      >
                                        <b-col sm="5">
                                          <b-row class="row mx-0">
                                            <b-col
                                              class="p-3 border"
                                              v-for="(
                                                shade, si
                                              ) in predefinedShade"
                                              :key="
                                                'predefinedShade' +
                                                i +
                                                j +
                                                c +
                                                levelIndex +
                                                psi +
                                                si
                                              "
                                              :style="{
                                                'background-color': shade,
                                              }"
                                            ></b-col>
                                          </b-row>
                                        </b-col>
                                        <b-col sm="7" class="text-right">
                                          <b-button
                                            class="black-btn btn-sm mx-1 admin-greybtn"
                                            @click.prevent.stop="
                                              applyPalette({
                                                tInd: i,
                                                stInd: j,
                                                cmInd: c,
                                                key: configKey,
                                                levelInd: levelIndex,
                                                shades: predefinedShade,
                                              })
                                            "
                                            >{{ $t("apply") }}</b-button
                                          >
                                          <b-button
                                            class="black-btn btn-sm mx-1 blue-btn"
                                            @click.prevent.stop="
                                              applyPalette({
                                                tInd: i,
                                                stInd: j,
                                                cmInd: c,
                                                key: configKey,
                                                shades: predefinedShade,
                                              })
                                            "
                                            >{{ $t("applyAll") }}</b-button
                                          >
                                        </b-col>
                                      </b-row>
                                    </div>
                                  </transition>
                                </b-col>
                              </b-row>

                              <b-row>
                                <b-col sm="5" class="mb-3">
                                  <label
                                    :for="`autoScaling-${configKey}-${i}-${j}-${c}-${levelIndex}`"
                                    >{{ $t("autoScaling") }}</label
                                  >
                                </b-col>
                                <b-col sm="7" class="mb-3">
                                  <b-form-checkbox
                                    :id="`autoScaling-${configKey}-${i}-${j}-${c}-${levelIndex}`"
                                    class="mr-n2 mb-n1"
                                    v-model="levelScale.isAutoRange"
                                    switch
                                    size="lg"
                                  ></b-form-checkbox>
                                </b-col>
                              </b-row>
                              <b-row
                                v-for="(
                                  scaleRow, scaleIndex
                                ) in levelScale.scales"
                                :key="
                                  'scales-' +
                                  i +
                                  j +
                                  c +
                                  levelIndex +
                                  scaleIndex
                                "
                                class="translate-adminheight"
                              >
                                <b-col
                                  sm="4"
                                  class="mb-3"
                                  :class="{
                                    'col-sm-6': levelScale.isAutoRange,
                                  }"
                                >
                                  <b-input-group
                                    :id="`scaleLabel-${configKey}-${i}-${j}-${c}-${levelIndex}-${scaleIndex}`"
                                  >
                                    <b-form-input
                                      type="text"
                                      :placeholder="$t('label')"
                                      v-model="
                                        levelScale.scales[scaleIndex]
                                          .scaleLabel[$i18n.locale]
                                      "
                                      disabled
                                    ></b-form-input>
                                    <b-input-group-append is-text>
                                      <Translations
                                        :transText.sync="
                                          levelScale.scales[scaleIndex]
                                            .scaleLabel
                                        "
                                      />
                                    </b-input-group-append>
                                  </b-input-group>
                                </b-col>
                                <b-col
                                  sm="2"
                                  class="mb-3"
                                  :class="{
                                    hide: levelScale.isAutoRange,
                                  }"
                                >
                                  <b-form-input
                                    :id="`lowScale-${configKey}-${i}-${j}-${c}-${levelIndex}-${scaleIndex}`"
                                    type="number"
                                    :placeholder="$t('placeholderLowRange')"
                                    v-model="
                                      levelScale.scales[scaleIndex].lowScale
                                    "
                                    :disabled="
                                      scaleIndex === 0 &&
                                      !levelScale.isAutoRange
                                        ? false
                                        : true
                                    "
                                  ></b-form-input>
                                </b-col>
                                <b-col
                                  sm="2"
                                  class="mb-3"
                                  :class="{
                                    hide: levelScale.isAutoRange,
                                  }"
                                >
                                  <b-form-input
                                    :id="`highScale-${configKey}-${i}-${j}-${c}-${levelIndex}-${scaleIndex}`"
                                    type="number"
                                    :placeholder="$t('placeholderHighRange')"
                                    v-model="
                                      levelScale.scales[scaleIndex].highScale
                                    "
                                    :disabled="levelScale.isAutoRange"
                                    @change="
                                      scaleIndex < levelScale.scales.length - 1
                                        ? (levelScale.scales[
                                            scaleIndex + 1
                                          ].lowScale =
                                            levelScale.scales[
                                              scaleIndex
                                            ].highScale)
                                        : ''
                                    "
                                  ></b-form-input>
                                </b-col>
                                <b-col
                                  sm="4"
                                  class="mb-3"
                                  :class="{
                                    'col-sm-6': levelScale.isAutoRange,
                                  }"
                                >
                                  <b-input-group>
                                    <b-form-input
                                      :id="`scaleColor-${configKey}-${i}-${j}-${c}-${levelIndex}-${scaleIndex}`"
                                      type="text"
                                      v-model="
                                        levelScale.scales[scaleIndex].scaleColor
                                      "
                                    ></b-form-input>
                                    <b-input-group-append>
                                      <b-form-input
                                        type="color"
                                        class="w-40px"
                                        v-model="
                                          levelScale.scales[scaleIndex]
                                            .scaleColor
                                        "
                                      ></b-form-input>
                                    </b-input-group-append>
                                  </b-input-group>
                                </b-col>
                              </b-row>
                            </div>

                            <!-- </div>   -->
                          </b-tab>
                        </b-tabs>
                      </b-col>
                      <b-col sm="12" class="text-right">
                        <b-button
                          class="btn-sm blue-btn"
                          @click.prevent.stop="
                            copyTo({
                              tInd: i,
                              stInd: j,
                              cmInd: c,
                              key: configKey,
                            })
                          "
                          >{{ $t("copyTobtn") }}</b-button
                        >
                        <b-modal
                          :id="'copyToModal' + i + j + c"
                          hide-footer
                          centered
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
                              <span class="small">{{ $t("from") }}</span>
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
                              <span class="small">{{ $t("to") }}</span>
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
                                <strong>{{ $t("note") }}: </strong>
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
                                class="btn-sm blue-btn"
                                @click.prevent.stop="
                                  copy({
                                    tInd: i,
                                    stInd: j,
                                    cmInd: c,
                                  })
                                "
                                >{{ $t("copybtn") }}</b-button
                              >
                            </div>
                          </div>
                        </b-modal>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
              </div>
            </transition>
          </b-collapse>
          <div class="bordertop-grey mt-3"></div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";

export default {
  props: [
    "i",
    "j",
    "copy",
    "tabs",
    "tabId",
    "copyTo",
    "subTabId",
    "moveItem",
    "settings",
    "moduleKey",
    "configKey",
    "subTabGroup",
    "levelsSelect",
    "applyPalette",
    "deleteElement",
    "updateBenchmarks",
  ],
  mixins: [DynamicImageMixin],
  components: {
    Treeselect,
    Translations: () =>
      import(
        /*webpackChunkName: 'translations'*/ "@/components/config/Common/Translations"
      ),
  },
  data() {
    return {
      shadesNumber: 4,
      showShades: false,
      allMappings: null,
      percentageLight: 40,
      selectedLevel: null,
      paletteColor: "#00ff80",
      chartInfoMaxLength: 200,
      chartTitleMaxLength: 100,
      predefinedShades: [
        ["#d4ffff", "#acefff", "#84c7ff", "#5c9fef"],
        ["#ffffac", "#ffdd84", "#ffb55c", "#ed8d34"],
        ["#ffd9d3", "#ffb1ab", "#ff8983", "#e2615b"],
        ["#eaffce", "#c2ffa6", "#9ade7e", "#72b656"],
      ],
    };
  },
  computed: {
    mappings: function () {
      return function (dataMapping) {
        let arr = [];
        if (dataMapping.length) {
          let gSetting = this.$store.getters.getGlobalFactors();
          if (
            gSetting.globalMappings &&
            gSetting.globalMappings.mappings &&
            gSetting.globalMappings.mappings.length
          ) {
            const allMappings = [].concat(
              ...gSetting.globalMappings.mappings.map(
                ({ mapping }) => mapping || []
              )
            );
            allMappings.forEach((m) => {
              if (dataMapping.includes(m.indicator.id)) {
                arr.push({
                  text: m.indicator.name[this.$i18n.locale],
                  value: m.indicator.name[this.$i18n.locale],
                });
              }
            });
          }
        }
        return arr;
      };
    },
    shades: function () {
      let shades = [this.paletteColor],
        color = this.paletteColor;
      for (let i = 1; i < this.shadesNumber; i++) {
        color = this.adjust({ color: color, amount: this.percentageLight * 1 });
        shades.push(color);
      }
      shades = this.percentageLight * 1 < 0 ? shades : shades.reverse();
      return shades;
    },
    chartCalculations: function () {
      return function (category, group, isSavedData, isSingleSource) {
        let calc = [];
        if (
          this.$store.getters.getNamespace !== "multi_program_mnch-dashboard" &&
          isSavedData &&
          group.includes("EMU")
        ) {
          calc.push({
            text: this.$i18n.t("emuNatBench"),
            value: "EMU_NATIONAL",
          });
          calc.push({
            text: this.$i18n.t("emuAvg"),
            value: "EMU_AVERAGE",
          });
          calc.push({
            text: this.$i18n.t("matTable"),
            value: "MATRIX_TABLE",
          });
        } else {
          if (
            this.$store.getters.getNamespace !==
              "multi_program_mnch-dashboard" &&
            isSingleSource
          ) {
            calc.push({
              text: this.$i18n.t("mulCYP"),
              value: "CYP",
            });
            calc.push({
              text: this.$i18n.t("stockOut"),
              value: "STOCK_OUT",
            });
            calc.push({
              text: this.$i18n.t("access"),
              value: "AVAILABILITY",
            });
            if (group.includes("GEO") && category === "regional") {
              calc.push({
                text: this.$i18n.t("mulCYPAvg"),
                value: "OTHER_AVERAGE_CYP",
              });
              calc.push({
                text: this.$i18n.t("avg"),
                value: "OTHER_AVERAGE",
              });
              calc.push({
                text: this.$i18n.t("matMulCYP"),
                value: "OTHER_MATRIX_TABLE_CYP",
              });
              calc.push({
                text: this.$i18n.t("matTable"),
                value: "OTHER_MATRIX_TABLE",
              });
            }
          }

          if (category === "regional" && isSingleSource) {
            calc.push({
              text: this.$i18n.t("ptChange"),
              value: "PERIOD_DIFF",
            });
            calc.push({
              text: this.$i18n.t("ptChangeCYP"),
              value: "PERIOD_DIFF_CYP",
            });
          }
          if (category === "regional" && !isSingleSource) {
            calc.push({
              text: this.$i18n.t("diffSource"),
              value: "SOURCE_DIFF",
            });
            calc.push({
              text: this.$i18n.t("avgSource"),
              value: "SOURCE_AVG",
            });
          }
        }
        calc.push({
          text: this.$i18n.t("default"),
          value: "DEFAULT",
        });
        return calc;
      };
    },
    benchmarks: function () {
      return function (mapping, category, calc, dataSum) {
        let arr = [];
        let gSetting = this.$store.getters.getGlobalFactors();
        if (
          gSetting.allBenchmarks &&
          gSetting.allBenchmarks.benchmarks &&
          gSetting.allBenchmarks.benchmarks.length
        ) {
          gSetting.allBenchmarks.benchmarks.forEach((b) => {
            let addBenchmark = true;
            if (
              (category !== "regional" && b.plotLineType === "national") ||
              (category === "regional" &&
                calc === "PERIOD_DIFF" &&
                b.plotLineType === "national") ||
              (mapping &&
                mapping.length > 1 &&
                !dataSum &&
                b.plotLineType === "national")
            ) {
              addBenchmark = false;
            }
            if (addBenchmark) {
              arr.push({
                label:
                  typeof b.displayName === "object"
                    ? b.displayName[this.$i18n.locale]
                    : b.displayName,
                id: `${b.id}_${b.plotLineType}`,
              });
            }
          });
        }
        return arr;
      };
    },
    chartTypeOptions: function () {
      return function (type, group, category, isSavedData, chartCalculation) {
        let option = [];
        option.push({
          value: null,
          text: this.$i18n.t("cType"),
          disabled: true,
        });
        if (type === "map") {
          option.push({
            value: "map",
            text: this.$i18n.t("map"),
          });
        } else {
          option.push({
            value: "column",
            text: this.$i18n.t("column"),
          });
          option.push({
            value: "bar",
            text: this.$i18n.t("bar"),
          });
          option.push({
            value: "cluster_bar",
            text: this.$i18n.t("clusterBar"),
          });
          option.push({
            value: "line",
            text: this.$i18n.t("line"),
          });
          option.push({
            value: "spline",
            text: this.$i18n.t("spline"),
          });
          option.push({
            value: "area",
            text: this.$i18n.t("area"),
          });
          option.push({
            value: "stack",
            text: this.$i18n.t("stack"),
          });
          option.push({
            value: "stack_percent",
            text: `${this.$i18n.t("stack")} (%)`,
          });
          option.push({
            value: "stack_bar",
            text: `${this.$i18n.t("stack")} ${this.$i18n.t("bar")}`,
          });
          option.push({
            value: "stack_bar_percent",
            text: `${this.$i18n.t("stack")} ${this.$i18n.t("bar")} (%)`,
          });
          if (category === "regional" && chartCalculation === "DEFAULT") {
            option.push({
              value: "scatter",
              text: this.$i18n.t("scatter"),
            });
          }
          if (
            ((group.includes("EMU") && isSavedData) ||
              (group.includes("GEO") && !isSavedData)) &&
            category === "regional"
          ) {
            option.push({
              value: "packedbubble",
              text: this.$i18n.t("bubble"),
            });
          }
        }
        return option;
      };
    },
    chartCategories: function () {
      return function (group, isSingleSource, isSavedData) {
        let category = [];
        //Maintain the below conditions for sequence
        if (isSingleSource) {
          category.push({
            text: this.$i18n.t("trend"),
            value: "trend",
          });
        }
        category.push({
          text: this.$i18n.t("regional"),
          value: "regional",
        });
        if (!isSavedData && group !== "EMU" && isSingleSource) {
          category.push({
            text: this.$i18n.t("seasonalTrend"),
            value: "seasonal",
          });
        }
        if (
          (group.includes("-CT-") ||
            group.includes("-IC-") ||
            group.includes("PPFP")) &&
          isSingleSource
        ) {
          category.push({
            text: this.$i18n.t("regionalTrend"),
            value: "regionalTrend",
          });
        }
        return category;
      };
    },
    seasonalPeriod: function () {
      return function () {
        let yrs = [
          {
            text: "1",
            value: 1,
          },
          {
            text: "2",
            value: 2,
          },
          {
            text: "3",
            value: 3,
          },
          {
            text: "4",
            value: 4,
          },
          {
            text: "5",
            value: 5,
          },
        ];
        return yrs;
      };
    },
    levelsTreeSelect: function () {
      return this.levelsSelect.filter((l) => l.value !== this.selectedLevel);
    },
  },
  methods: {
    adjust({ color, amount }) {
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
    getMappings() {
      let allMappings = [];
      let gSetting = this.$store.getters.getGlobalFactors();
      if (
        gSetting.globalMappings &&
        gSetting.globalMappings.mappings &&
        gSetting.globalMappings.mappings.length
      ) {
        gSetting.globalMappings.mappings.forEach((ms) => {
          let obj = {
            id: ms.id,
            label: ms.tabName[this.$i18n.locale],
            children: [],
          };
          if (ms.mapping && ms.mapping.length) {
            ms.mapping.forEach((m) => {
              let type = [];
              let isMapping = m.indicator.subIndicator.find(
                (s) => s.selectedDE.length
              );
              m.indicator.subIndicator.forEach((sm) => {
                let isFound = type.find((t) => t.type === sm.type);
                if (!isFound) {
                  if (sm.type === "indicator") {
                    type.push({
                      alias: "I",
                      color: "#5c9fef",
                      type: "indicator",
                      text: this.$i18n.t("indicator"),
                    });
                  }
                  if (sm.type === "data_element") {
                    type.push({
                      alias: "DE",
                      color: "#ed8d34",
                      type: "data_element",
                      text: this.$i18n.t("dataElement"),
                    });
                  }
                  if (sm.type === "data_sets") {
                    type.push({
                      alias: "DS",
                      color: "#72b656",
                      type: "data_sets",
                      text: this.$i18n.t("dataSets"),
                    });
                  }
                }
              });
              if (isMapping) {
                obj.children.push({
                  label: m.indicator.name[this.$i18n.locale],
                  id: m.indicator.static_name,
                  type,
                });
              }
            });
          }
          allMappings.push(obj);
        });
      }
      this.allMappings = allMappings;
    },
  },
  created() {
    this.getMappings();
  },
};
</script>
<style lang="scss">
.vue-treeselect__label {
  white-space: inherit !important;
}
</style>
