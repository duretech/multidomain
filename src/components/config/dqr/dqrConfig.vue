<template>
  <!-- <div class="md_tabs py-3"> -->
  <div>
    <b-card no-body>
      <b-tabs card vertical nav-class="p-0" nav-wrapper-class="adminConfig">
        <b-tab
          v-if="
            !modules.reportingRate.disable ||
            !modules.internalValidation.disable ||
            !modules.externalValidation.disable
          "
          :title="$t('summary')"
          :active="activeTab === 'summary'"
          @click="updateActiveTab('summary')"
          class="pl-2 pb-0 pt-0 pr-0"
        >
          <b-card-text v-if="activeTab === 'summary'">
            <div class="md_nested_tabs">
              <b-card no-body>
                <b-tabs card class="border" nav-class="p-0 m-0"
								nav-wrapper-class="adminConfigInner p-0">
                  <b-tab
                    :title="$t('summary')"
                    active
                    @click="updateActiveSubTab('summary')"
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'summary'">
                      <div class="card-body">
                        <template v-if="!modules.reportingRate.disable">
                          <div
                            class="
                              card-header
                              p-5px
                              bg-faint-grey
                              default-card-border-radius
                            "
                            id="reportingRateSummary"
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
                                data-target="#reportingRateSummaryTarget"
                                aria-expanded="true"
                                aria-controls="reportingRateSummaryTarget"
                              >
                                {{ $t("compTime") }}
                              </button>
                            </h2>
                          </div>
                          <div
                            id="reportingRateSummaryTarget"
                            class="collapse collapse-section-border border show"
                            aria-labelledby="reportingRateSummary"
                          >
                            <div class="p-3">
                              <div class="cursor-pointer small" @click="goTo">
                                <b
                                  ><i
                                    ><u>
                                      {{ $t("clicktoedit") }}
                                      {{
                                        $t(
                                          "reportingRateBenchmarking"
                                        )
                                      }}
                                    </u></i
                                  ></b
                                >
                              </div>
                            </div>
                          </div>
                        </template>
                        <template v-if="!modules.internalValidation.disable">
                          <div
                            class="
                              card-header
                              p-5px
                              bg-faint-grey
                              default-card-border-radius
                              mt-3
                            "
                            id="internalSummary"
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
                                data-target="#internalSummaryTarget"
                                aria-expanded="true"
                                aria-controls="internalSummaryTarget"
                              >
                                {{
                                  $t("in_Consistency")
                                }}
                              </button>
                            </h2>
                          </div>
                          <div
                            id="internalSummaryTarget"
                            class="collapse collapse-section-border border show"
                            aria-labelledby="internalSummary"
                          >
                            <div class="p-3">
                              <div
                                class="cursor-pointer small"
                                @click="updateActiveTab('internalValidation')"
                              >
                                <b
                                  ><i
                                    ><u>
                                      {{ $t("clicktoedit") }}
                                      {{
                                        $t(
                                          "standardDeviation"
                                        )
                                      }}
                                    </u></i
                                  ></b
                                >
                              </div>
                            </div>
                          </div>
                        </template>
                        <template v-if="!modules.externalValidation.disable">
                          <div
                            class="
                              card-header
                              p-5px
                              bg-faint-grey
                              default-card-border-radius
                              mt-3
                            "
                            id="externalSummary"
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
                                data-target="#externalSummaryTarget"
                                aria-expanded="true"
                                aria-controls="externalSummaryTarget"
                              >
                                {{
                                  $t(
                                    "internalConsistencyCorrelation_tab"
                                  )
                                }}
                              </button>
                            </h2>
                          </div>
                          <div
                            id="externalSummaryTarget"
                            class="collapse collapse-section-border border show"
                            aria-labelledby="externalSummary"
                          >
                            <div class="p-3">
                              <div
                                class="cursor-pointer small"
                                @click="updateActiveTab('externalValidation')"
                              >
                                <b
                                  ><i
                                    ><u>
                                      {{ $t("clicktoedit") }}
                                      {{
                                        $t(
                                          "dqrtext",
                                          { num: "2" }
                                        )
                                      }}
                                    </u></i
                                  ></b
                                >
                              </div>
                            </div>
                          </div>
                        </template>
                      </div>
                    </b-card-text>
                  </b-tab>
                </b-tabs>
              </b-card>
            </div>
          </b-card-text>
        </b-tab>
        <b-tab
          v-if="!modules.reportingRate.disable"
          :title="$t('compTime')"
          :active="activeTab === 'reportingRate'"
          @click="updateActiveTab('reportingRate')"
          class="pl-2 pb-0 pt-0 pr-0"
        >
          <b-card-text v-if="activeTab === 'reportingRate'">
            <div class="md_nested_tabs">
              <div class="row mb-4">
                <div class="col-lg-12">
                  <div class="card">
                    <div
                      class="
                        card-header
                        bg-faint-grey
                        default-card-border-radius
                        f-s-0-875rem
                        w-100
                        text-left text-uppercase
                        color-grey
                        f-s-0-875rem
                      "
                    >
                      {{ $t("dataSource") }}
                    </div>
                    <div class="card-body">
                      <div class="row">
                        <div class="col-lg-12">
                          <div class="form-group row">
                            <label
                              for="data_source_selector"
                              class="col-sm-6 col-form-label"
                            >
                              {{
                                $t("selectDataSource")
                              }}
                            </label>
                            <div class="col-sm-6">
                              <div class="select-wrapper">
                                <select
                                  class="form-control"
                                  id="data_source_selector"
                                  v-model="reportingRateDataSource"
                                >
                                  <option
                                    v-for="(opt, ind) in data_sources_arr"
                                    :value="opt.value"
                                    :key="ind"
                                  >
                                    {{ opt.text }}
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-12 text-center">
                          <button
                            type="button"
                            class="btn btn-primary black-btn"
                            @click="saveBgData('reportingRate')"
                          >
                            {{ $t("savebtn") }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <b-card no-body>
                <transition name="slide-fade">
                  <b-tabs card class="border" v-if="dataSaved" nav-class="p-0 m-0"
								nav-wrapper-class="adminConfigInner p-0">
                    <b-tab
                      :title="$t('visits')"
                      active
                      v-if="reportingRateDataSource === 'Visits'"
                      class="p-0"
                    >
                      <b-card-text>
                        <reportingRate
                          chartByModule="dqrModule"
                          chartByType="reportingRate"
                          chartBySubtype="Visits"
                          key="Visits"
                          :indicatorsList="indicatorsList"
                          :dataElementsList="dataElementsList"
                          :dataSetsList="dataSetsList"
                          :metrixList="metrixList"
                          :globalMapping="globalMapping"
                          @getBGInfo="getBGInfo"
                        />
                      </b-card-text>
                    </b-tab>
                    <b-tab
                      :title="
                        $t('Commodities_Client')
                      "
                      active
                      v-if="reportingRateDataSource === 'Commodities_Client'"
                      class="p-0"
                    >
                      <b-card-text>
                        <reportingRate
                          chartByModule="dqrModule"
                          chartByType="reportingRate"
                          chartBySubtype="Commodities_Client"
                          key="Commodities_Client"
                          :indicatorsList="indicatorsList"
                          :dataElementsList="dataElementsList"
                          :dataSetsList="dataSetsList"
                          :metrixList="metrixList"
                          :globalMapping="globalMapping"
                          @getBGInfo="getBGInfo"
                        />
                      </b-card-text>
                    </b-tab>
                    <b-tab
                      :title="
                        $t('Commodities_Facilities')
                      "
                      active
                      v-if="
                        reportingRateDataSource === 'Commodities_Facilities'
                      "
                      class="p-0"
                    >
                      <b-card-text>
                        <reportingRate
                          chartByModule="dqrModule"
                          chartByType="reportingRate"
                          chartBySubtype="Commodities_Facilities"
                          key="Commodities_Facilities"
                          :indicatorsList="indicatorsList"
                          :dataElementsList="dataElementsList"
                          :dataSetsList="dataSetsList"
                          :metrixList="metrixList"
                          :globalMapping="globalMapping"
                          @getBGInfo="getBGInfo"
                        />
                      </b-card-text>
                    </b-tab>
                    <b-tab
                      :title="$t('users')"
                      active
                      v-if="reportingRateDataSource === 'User'"
                      class="p-0"
                    >
                      <b-card-text>
                        <reportingRate
                          chartByModule="dqrModule"
                          chartByType="reportingRate"
                          chartBySubtype="User"
                          key="User"
                          :indicatorsList="indicatorsList"
                          :dataElementsList="dataElementsList"
                          :dataSetsList="dataSetsList"
                          :metrixList="metrixList"
                          :globalMapping="globalMapping"
                          @getBGInfo="getBGInfo"
                        />
                      </b-card-text>
                    </b-tab>
                    <b-tab
                      :title="$t('overall')"
                      active
                      v-if="reportingRateDataSource === 'Overall'"
                      class="p-0"
                    >
                      <b-card-text>
                        <reportingRate
                          chartByModule="dqrModule"
                          chartByType="reportingRate"
                          chartBySubtype="Overall"
                          key="Overall"
                          :indicatorsList="indicatorsList"
                          :dataElementsList="dataElementsList"
                          :dataSetsList="dataSetsList"
                          :metrixList="metrixList"
                          :globalMapping="globalMapping"
                          @getBGInfo="getBGInfo"
                        />
                      </b-card-text>
                    </b-tab>
                  </b-tabs>
                </transition>
              </b-card>
            </div>
          </b-card-text>
        </b-tab>
        <b-tab
          v-if="!modules.internalValidation.disable"
          :title="$t('in_Consistency')"
          :active="activeTab === 'internalValidation'"
          @click="updateActiveTab('internalValidation')"
          class="pl-2 pb-0 pt-0 pr-0"
        >
          <b-card-text v-if="activeTab === 'internalValidation'">
            <div class="md_nested_tabs">
              <div class="row mb-4">
                <div class="col-lg-12">
                  <div class="card">
                    <div
                      class="
                        card-header
                        bg-faint-grey
                        default-card-border-radius
                        f-s-0-875rem
                        w-100
                        text-left text-uppercase
                        color-grey
                        f-s-0-875rem
                      "
                    >
                      {{ $t("dataSource") }}
                    </div>
                    <div class="card-body">
                      <div class="row">
                        <div class="col-lg-12">
                          <div class="form-group row">
                            <label
                              for="data_source_selector"
                              class="col-sm-6 col-form-label"
                            >
                              {{
                                $t("selectDataSource")
                              }}
                            </label>
                            <div class="col-sm-6">
                              <div class="select-wrapper">
                                <select
                                  class="form-control"
                                  id="data_source_selector"
                                  v-model="internalValDataSource"
                                >
                                  <option
                                    v-for="(opt, ind) in data_sources_arr"
                                    :value="opt.value"
                                    :key="ind"
                                  >
                                    {{ opt.text }}
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div class="form-group row">
                            <label
                              for="inputSD"
                              class="col-sm-6 col-form-label"
                            >
                              {{
                                $t(
                                  "standardDeviation"
                                )
                              }}
                            </label>
                            <div class="col-sm-6">
                              <div class="row mx-0">
                                <input
                                  type="number"
                                  class="form-control col-sm-2"
                                  id="inputSD"
                                  placeholder=""
                                  v-model="standardDeviation"
                                  disabled=""
                                />
                                <b-form-input
                                  id="sd-range-1"
                                  v-model="standardDeviation"
                                  class="col-sm-10 mt-2 pl-2"
                                  type="range"
                                  min="1"
                                  max="5"
                                  step="1"
                                ></b-form-input>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-12 text-center">
                          <button
                            type="button"
                            class="btn btn-primary black-btn"
                            @click="saveBgData('internal_validations')"
                          >
                            {{ $t("savebtn") }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <b-card no-body>
                <transition name="slide-fade">
                  <b-tabs card class="border" v-if="dataSaved" nav-class="p-0 m-0"
								nav-wrapper-class="adminConfigInner p-0">
                    <b-tab
                      :title="$t('visits')"
                      active
                      v-if="internalValDataSource === 'Visits'"
                      class="p-0"
                    >
                      <b-card-text>
                        <internalValidation
                          chartByModule="dqrModule"
                          chartByType="internal_validations"
                          chartBySubtype="Visits"
                          key="Visits"
                          :indicatorsList="indicatorsList"
                          :dataElementsList="dataElementsList"
                          :dataSetsList="dataSetsList"
                          :metrixList="metrixList"
                          :globalMapping="globalMapping"
                          @getBGInfo="getBGInfo"
                        />
                      </b-card-text>
                    </b-tab>
                    <b-tab
                      :title="
                        $t('Commodities_Client')
                      "
                      active
                      v-if="internalValDataSource === 'Commodities_Client'"
                      class="p-0"
                    >
                      <b-card-text>
                        <internalValidation
                          chartByModule="dqrModule"
                          chartByType="internal_validations"
                          chartBySubtype="Commodities_Client"
                          key="Commodities_Client"
                          :indicatorsList="indicatorsList"
                          :dataElementsList="dataElementsList"
                          :dataSetsList="dataSetsList"
                          :metrixList="metrixList"
                          :globalMapping="globalMapping"
                          @getBGInfo="getBGInfo"
                        />
                      </b-card-text>
                    </b-tab>
                    <b-tab
                      :title="
                        $t('Commodities_Facilities')
                      "
                      active
                      v-if="internalValDataSource === 'Commodities_Facilities'"
                      class="p-0"
                    >
                      <b-card-text>
                        <internalValidation
                          chartByModule="dqrModule"
                          chartByType="internal_validations"
                          chartBySubtype="Commodities_Facilities"
                          key="Commodities_Facilities"
                          :indicatorsList="indicatorsList"
                          :dataElementsList="dataElementsList"
                          :dataSetsList="dataSetsList"
                          :metrixList="metrixList"
                          :globalMapping="globalMapping"
                          @getBGInfo="getBGInfo"
                        />
                      </b-card-text>
                    </b-tab>
                    <b-tab
                      :title="$t('users')"
                      active
                      v-if="internalValDataSource === 'User'"
                      class="p-0"
                    >
                      <b-card-text>
                        <internalValidation
                          chartByModule="dqrModule"
                          chartByType="internal_validations"
                          chartBySubtype="User"
                          key="User"
                          :indicatorsList="indicatorsList"
                          :dataElementsList="dataElementsList"
                          :dataSetsList="dataSetsList"
                          :metrixList="metrixList"
                          :globalMapping="globalMapping"
                          @getBGInfo="getBGInfo"
                        />
                      </b-card-text>
                    </b-tab>
                  </b-tabs>
                </transition>
              </b-card>
            </div>
          </b-card-text>
        </b-tab>
        <b-tab
          v-if="!modules.externalValidation.disable"
          :title="$t('internalConsistencyCorrelation_tab')"
          :active="activeTab === 'externalValidation'"
          @click="updateActiveTab('externalValidation')"
          class="pl-2 pb-0 pt-0 pr-0"
        >
          <b-card-text v-if="activeTab === 'externalValidation'">
            <div class="md_nested_tabs">
              <b-card no-body>
                <div class="form-group row">
                  <label for="inputSubLevelID" class="col-sm-5 col-form-label">
                    {{ $t("dataLevel") }}
                  </label>
                  <div class="col-sm-7">
                    <div class="select-wrapper">
                      <select
                        class="form-control"
                        id="inputSubLevelID"
                        v-model="subLevelID"
                      >
                        <option v-if="!subLevelIDList.length" disabled>
                          {{ $t("no_data_to_display") }}
                        </option>
                        <option
                          v-for="(subLevel, index) in subLevelIDList"
                          :key="index"
                          :value="subLevel.level"
                        >
                          {{ subLevel.name }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="form-group row">
                  <label for="inputSubLevelID" class="col-sm-5 col-form-label">
                    {{ $t("dqrtext", { num: "2" }) }}
                  </label>
                  <div class="col-sm-7">
                    <div class="row mx-0">
                      <input
                        type="number"
                        class="form-control col-sm-2"
                        id="inputR2Max"
                        placeholder=""
                        v-model="r2Max"
                        disabled=""
                      />
                      <b-form-input
                        id="r2Max-range-1"
                        v-model="r2Max"
                        class="col-sm-10 mt-2 pl-2"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                      ></b-form-input>
                    </div>
                  </div>
                </div>
                <div class="row pb-3">
                  <div class="col-12 text-center">
                    <button
                      type="button"
                      class="btn btn-primary black-btn"
                      @click="saveBgData('external_validation')"
                    >
                      {{ $t("savebtn") }}
                    </button>
                  </div>
                </div>
                <transition name="slide-fade">
                  <b-tabs card class="border" v-if="dataSaved" nav-class="p-0 m-0"
								nav-wrapper-class="adminConfigInner p-0">
                    <b-tab
                      :title="$t('Injectable')"
                      :active="activeExternalSubTab === 'Injectable'"
                      @click="updateActiveSubTab('Injectable')"
                      class="p-0"
                    >
                      <b-card-text
                        class="p-2"
                        v-if="activeExternalSubTab === 'Injectable'"
                      >
                        <externalValidation
                          chartByModule="dqrModule"
                          chartByType="external_validation"
                          chartBySubtype="Injectable"
                          key="Injectable"
                          :indicatorsList="indicatorsList"
                          :dataElementsList="dataElementsList"
                          :dataSetsList="dataSetsList"
                          :metrixList="metrixList"
                          @getBGInfo="getBGInfo"
                        />
                      </b-card-text>
                    </b-tab>
                    <b-tab
                      :title="$t('IUD')"
                      :active="activeExternalSubTab === 'IUD'"
                      @click="updateActiveSubTab('IUD')"
                      class="p-0"
                    >
                      <b-card-text
                        class="p-2"
                        v-if="activeExternalSubTab === 'IUD'"
                      >
                        <externalValidation
                          chartByModule="dqrModule"
                          chartByType="external_validation"
                          chartBySubtype="IUD"
                          key="IUD"
                          :indicatorsList="indicatorsList"
                          :dataElementsList="dataElementsList"
                          :dataSetsList="dataSetsList"
                          :metrixList="metrixList"
                          @getBGInfo="getBGInfo"
                        />
                      </b-card-text>
                    </b-tab>
                    <b-tab
                      :title="$t('Implant')"
                      :active="activeExternalSubTab === 'Implant'"
                      @click="updateActiveSubTab('Implant')"
                      class="p-0"
                    >
                      <b-card-text
                        class="p-2"
                        v-if="activeExternalSubTab === 'Implant'"
                      >
                        <externalValidation
                          chartByModule="dqrModule"
                          chartByType="external_validation"
                          chartBySubtype="Implant"
                          key="Implant"
                          :indicatorsList="indicatorsList"
                          :dataElementsList="dataElementsList"
                          :dataSetsList="dataSetsList"
                          :metrixList="metrixList"
                          @getBGInfo="getBGInfo"
                        />
                      </b-card-text>
                    </b-tab>
                  </b-tabs>
                </transition>
              </b-card>
            </div>
          </b-card-text>
        </b-tab>
        <b-tab
          v-if="!modules.emuMonthly.disable"
          :title="$t('emu_monthly')"
          :active="activeTab === 'emu_monthly'"
          @click="updateActiveTab('emu_monthly')"
          class="pl-2 pb-0 pt-0 pr-0"
        >
          <b-card-text v-if="activeTab === 'emu_monthly'">
            <div class="md_nested_tabs">
              <benchmark-background-config
                :moduleConfig="backgroundDataMonthly"
                :indicatorsList="indicatorsList"
                :dataElementsList="dataElementsList"
                :dataSetsList="dataSetsList"
                :metrixList="metrixList"
                :autoSaveOption="true"
                @syncMapping="syncMappingFromLocale"
                originalSyncKey="backgroundDataMonthly"
              />
              <div class="row mb-4">
                <div class="col-12 text-center">
                  <button
                    type="button"
                    class="btn btn-primary black-btn"
                    @click="saveBgData('emu_monthly')"
                  >
                    {{ $t("savebtn") }}
                  </button>
                </div>
              </div>
              <b-card no-body>
                <b-tabs card class="border" nav-class="p-0 m-0"
								nav-wrapper-class="adminConfigInner p-0">
                  <b-tab
                    :title="$t('visits')"
                    active
                    @click="updateActiveSubTab('visits')"
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'visits'">
                      <emuMonthly
                        chartByModule="dqrModule"
                        chartByType="emu_monthly"
                        chartBySubtype="Visits"
                        :indicatorsList="indicatorsList"
                        :dataElementsList="dataElementsList"
                        :dataSetsList="dataSetsList"
                        :metrixList="metrixList"
                        :globalMapping="globalMapping"
                        @getBGInfo="getBGInfo"
                      />
                    </b-card-text>
                  </b-tab>
                  <b-tab
                    :title="$t('Commodities_Client')"
                    @click="updateActiveSubTab('c_client')"
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'c_client'">
                      <emuMonthly
                        chartByModule="dqrModule"
                        chartByType="emu_monthly"
                        chartBySubtype="Commodities_Client"
                        :indicatorsList="indicatorsList"
                        :dataElementsList="dataElementsList"
                        :dataSetsList="dataSetsList"
                        :metrixList="metrixList"
                        :globalMapping="globalMapping"
                        @getBGInfo="getBGInfo"
                      />
                    </b-card-text>
                  </b-tab>
                  <b-tab
                    :title="
                      $t('Commodities_Facilities')
                    "
                    @click="updateActiveSubTab('c_facilities')"
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'c_facilities'">
                      <emuMonthly
                        chartByModule="dqrModule"
                        chartByType="emu_monthly"
                        chartBySubtype="Commodities_Facilities"
                        :indicatorsList="indicatorsList"
                        :dataElementsList="dataElementsList"
                        :dataSetsList="dataSetsList"
                        :metrixList="metrixList"
                        :globalMapping="globalMapping"
                        @getBGInfo="getBGInfo"
                      />
                    </b-card-text>
                  </b-tab>
                  <b-tab
                    :title="$t('users')"
                    @click="updateActiveSubTab('users')"
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'users'">
                      <emuMonthly
                        chartByModule="dqrModule"
                        chartByType="emu_monthly"
                        chartBySubtype="User"
                        :indicatorsList="indicatorsList"
                        :dataElementsList="dataElementsList"
                        :dataSetsList="dataSetsList"
                        :metrixList="metrixList"
                        :globalMapping="globalMapping"
                        @getBGInfo="getBGInfo"
                      />
                    </b-card-text>
                  </b-tab>
                </b-tabs>
              </b-card>
            </div>
          </b-card-text>
        </b-tab>
        <b-tab
          v-if="!modules.emuAnnual.disable"
          :title="$t('emu_annual')"
          :active="activeTab === 'emu'"
          @click="updateActiveTab('emu')"
          class="pl-2 pb-0 pt-0 pr-0"
        >
          <b-card-text v-if="activeTab === 'emu'">
            <div class="md_nested_tabs">
              <benchmark-background-config
                :moduleConfig="backgroundData"
                :indicatorsList="indicatorsList"
                :dataElementsList="dataElementsList"
                :dataSetsList="dataSetsList"
                :metrixList="metrixList"
                :defaultEMUOption="true"
                @syncMapping="syncMappingFromLocale"
                originalSyncKey="backgroundData"
              />
              <div class="row mb-4">
                <div class="col-12 text-center">
                  <button
                    type="button"
                    class="btn btn-primary black-btn"
                    @click="saveBgData('emu')"
                  >
                    {{ $t("savebtn") }}
                  </button>
                </div>
              </div>
              <b-card no-body>
                <b-tabs card class="border" nav-class="p-0 m-0"
								nav-wrapper-class="adminConfigInner p-0">
                  <b-tab
                    :title="$t('visits')"
                    active
                    @click="updateActiveSubTab('visits')"
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'visits'">
                      <emuAnnual
                        chartByModule="dqrModule"
                        chartByType="emu"
                        chartBySubtype="Visits"
                        :indicatorsList="indicatorsList"
                        :dataElementsList="dataElementsList"
                        :dataSetsList="dataSetsList"
                        :metrixList="metrixList"
                        :globalMapping="globalMapping"
                        @getBGInfo="getBGInfo"
                      />
                    </b-card-text>
                  </b-tab>
                  <b-tab
                    :title="$t('Commodities_Client')"
                    @click="updateActiveSubTab('c_client')"
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'c_client'">
                      <emuAnnual
                        chartByModule="dqrModule"
                        chartByType="emu"
                        chartBySubtype="Commodities_Client"
                        :indicatorsList="indicatorsList"
                        :dataElementsList="dataElementsList"
                        :dataSetsList="dataSetsList"
                        :metrixList="metrixList"
                        :globalMapping="globalMapping"
                        @getBGInfo="getBGInfo"
                      />
                    </b-card-text>
                  </b-tab>
                  <b-tab
                    :title="
                      $t('Commodities_Facilities')
                    "
                    @click="updateActiveSubTab('c_facilities')"
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'c_facilities'">
                      <emuAnnual
                        chartByModule="dqrModule"
                        chartByType="emu"
                        chartBySubtype="Commodities_Facilities"
                        :indicatorsList="indicatorsList"
                        :dataElementsList="dataElementsList"
                        :dataSetsList="dataSetsList"
                        :metrixList="metrixList"
                        :globalMapping="globalMapping"
                        @getBGInfo="getBGInfo"
                      />
                    </b-card-text>
                  </b-tab>
                  <b-tab
                    :title="$t('users')"
                    @click="updateActiveSubTab('users')"
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'users'">
                      <emuAnnual
                        chartByModule="dqrModule"
                        chartByType="emu"
                        chartBySubtype="User"
                        :indicatorsList="indicatorsList"
                        :dataElementsList="dataElementsList"
                        :dataSetsList="dataSetsList"
                        :metrixList="metrixList"
                        :globalMapping="globalMapping"
                        @getBGInfo="getBGInfo"
                      />
                    </b-card-text>
                  </b-tab>
                  <b-tab
                    :title="$t('output')"
                    @click="updateActiveSubTab('output')"
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'output'">
                      <emuAnnual
                        chartByModule="dqrModule"
                        chartByType="emu"
                        chartBySubtype="Output"
                        :indicatorsList="indicatorsList"
                        :dataElementsList="dataElementsList"
                        :dataSetsList="dataSetsList"
                        :metrixList="metrixList"
                        @getBGInfo="getBGInfo"
                      />
                    </b-card-text>
                  </b-tab>
                </b-tabs>
              </b-card>
            </div>
          </b-card-text>
        </b-tab>
        <b-tab
          v-if="
            !modules.reportingRate.disable ||
            !modules.internalValidation.disable ||
            !modules.externalValidation.disable
          "
          :title="$t('data_sign_off')"
          :active="activeTab === 'signOff'"
          @click="updateActiveTab('signOff')"
          class="pl-2 pb-0 pt-0 pr-0"
        >
          <b-card-text v-if="activeTab === 'signOff'">
            <div class="md_nested_tabs">
              <b-card no-body>
                <b-tabs card class="border" nav-class="p-0 m-0"
								nav-wrapper-class="adminConfigInner p-0">
                  <b-tab
                    v-if="!modules.reportingRate.disable"
                    :title="$t('compTime')"
                    active
                    @click="updateActiveSubTab('reportingRate', 'actual')"
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'reportingRate'">
                      <div class="md_nested_tabs p-3">
                        <b-card no-body>
                          <b-tabs card class="border" nav-class="p-0 m-0"
								nav-wrapper-class="adminConfigInner p-0">
                            <b-tab
                              :title="$t('Reporting Rate (Actual)')"
                              active
                              @click="
                                updateActiveSubSubTab('reportingRate', 'actual')
                              "
                              class="p-0"
                            >
                              <b-card-text v-if="activeSubSubTab === 'actual'">
                                <signOffForm
                                  chartByModule="signOffModule"
                                  chartByType="reportingRate"
                                  chartBySubtype="reportingActual"
                                />
                              </b-card-text>
                            </b-tab>
                            <b-tab
                              :title="$t('Reporting Rate (On Time)')"
                              @click="
                                updateActiveSubSubTab('reportingRate', 'onTime')
                              "
                              class="p-0"
                            >
                              <b-card-text v-if="activeSubSubTab === 'onTime'">
                                <signOffForm
                                  chartByModule="signOffModule"
                                  chartByType="reportingRate"
                                  chartBySubtype="reportingOnTime"
                                />
                              </b-card-text>
                            </b-tab>
                          </b-tabs>
                        </b-card>
                      </div>
                    </b-card-text>
                  </b-tab>
                  <b-tab
                    v-if="!modules.internalValidation.disable"
                    :title="$t('in_Consistency')"
                    @click="
                      updateActiveSubTab('internalValidation', 'aggregate')
                    "
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'internalValidation'">
                      <div class="md_nested_tabs p-3">
                        <b-card no-body>
                          <b-tabs card class="border" nav-class="p-0 m-0"
								nav-wrapper-class="adminConfigInner p-0">
                            <b-tab
                              :title="$t('aggregate')"
                              active
                              @click="
                                updateActiveSubSubTab(
                                  'internalValidation',
                                  'aggregate'
                                )
                              "
                              class="p-0"
                            >
                              <b-card-text
                                v-if="activeSubSubTab === 'aggregate'"
                              >
                                <signOffForm
                                  chartByModule="signOffModule"
                                  chartByType="internal_validations"
                                  chartBySubtype="Aggregate"
                                />
                              </b-card-text>
                            </b-tab>
                            <b-tab
                              :title="$t('method')"
                              @click="
                                updateActiveSubSubTab(
                                  'internalValidation',
                                  'method'
                                )
                              "
                              class="p-0"
                            >
                              <b-card-text v-if="activeSubSubTab === 'method'">
                                <signOffForm
                                  chartByModule="signOffModule"
                                  chartByType="internal_validations"
                                  chartBySubtype="Method"
                                />
                              </b-card-text>
                            </b-tab>
                          </b-tabs>
                        </b-card>
                      </div>
                    </b-card-text>
                  </b-tab>
                  <b-tab
                    v-if="!modules.externalValidation.disable"
                    :title="
                      $t('internalConsistencyCorrelation_tab')
                    "
                    @click="
                      updateActiveSubTab('externalValidation', 'Injectable')
                    "
                    class="p-0"
                  >
                    <b-card-text v-if="activeSubTab === 'externalValidation'">
                      <div class="md_nested_tabs p-3">
                        <b-card no-body>
                          <b-tabs card class="border" nav-class="p-0 m-0"
								nav-wrapper-class="adminConfigInner p-0">
                            <b-tab
                              :title="$t('Injectable')"
                              active
                              @click="
                                updateActiveSubSubTab(
                                  'externalValidation',
                                  'Injectable'
                                )
                              "
                              class="p-0"
                            >
                              <b-card-text
                                v-if="activeSubSubTab === 'Injectable'"
                              >
                                <signOffForm
                                  chartByModule="signOffModule"
                                  chartByType="external_validation"
                                  chartBySubtype="Injectable"
                                />
                              </b-card-text>
                            </b-tab>
                            <b-tab
                              :title="$t('IUD')"
                              @click="
                                updateActiveSubSubTab(
                                  'externalValidation',
                                  'IUD'
                                )
                              "
                              class="p-0"
                            >
                              <b-card-text v-if="activeSubSubTab === 'IUD'">
                                <signOffForm
                                  chartByModule="signOffModule"
                                  chartByType="external_validation"
                                  chartBySubtype="IUD"
                                />
                              </b-card-text>
                            </b-tab>
                            <b-tab
                              :title="$t('Implant')"
                              @click="
                                updateActiveSubSubTab(
                                  'externalValidation',
                                  'Implant'
                                )
                              "
                              class="p-0"
                            >
                              <b-card-text v-if="activeSubSubTab === 'Implant'">
                                <signOffForm
                                  chartByModule="signOffModule"
                                  chartByType="external_validation"
                                  chartBySubtype="Implant"
                                />
                              </b-card-text>
                            </b-tab>
                          </b-tabs>
                        </b-card>
                      </div>
                    </b-card-text>
                  </b-tab>
                </b-tabs>
              </b-card>
            </div>
          </b-card-text>
        </b-tab>
      </b-tabs>
    </b-card>
    <b-modal
      v-model="syncMappingModalStatus"
      hide-footer
      centered
      size="sm"
      :title="$t('sync_mapping')"
      no-close-on-backdrop
    >
      <div class="form-group row">
        <label for="inputPeriodType" class="col-sm-12 col-form-label">{{
          $t("sync_from")
        }}</label>
        <div class="col-sm-12">
          <div class="select-wrapper">
            <select
              class="form-control"
              id="inputPeriodType"
              v-model="selectedLocaleToCopy"
            >
              <option value="" disabled>
                {{ $t("select_sync_mapping") }}
              </option>
              <option value="en" v-if="$i18n.locale !== 'en'">
                {{ $t("en") }}
              </option>
              <option value="fr" v-if="$i18n.locale !== 'fr'">
                {{ $t("fr") }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="text-right mt-3">
        <button
          type="button"
          class="btn btn-primary black-btn btn-sm"
          :disabled="!selectedLocaleToCopy"
          v-on:click="syncMapping"
        >
          {{ $t("sync") }}
        </button>
      </div>
    </b-modal>
  </div>
</template>
<script>
import emuAnnualConfig from "@/config/emuAnnualConfig.js";
import emuMonthlyConfig from "@/config/emuMonthlyConfig.js";
import reportingRateConfig from "@/config/reportingRateConfig.js";
import internalConfig from "@/config/internalValidationConfig.js";
import externalConfig from "@/config/externalValidationConfig.js";
import service from "@/service";
import modules from "@/config/modules.js";
import merge from "lodash/merge";
import audit from "../audit.js";
import assign from "lodash/assign";

export default {
  props: [
    "indicatorsList",
    "dataElementsList",
    "dataSetsList",
    "metrixList",
    "globalMapping",
  ],
  components: {
    emuAnnual: () =>
      import(/* webpackChunkName: "admin_dqr_emuAnnual"*/ "./emuAnnual"),
    benchmarkBackgroundConfig: () =>
      import(
        /* webpackChunkName: "admin_dqr_emuBGSettings"*/ "./benchmarkBackgroundConfig"
      ),
    externalValidation: () =>
      import(
        /* webpackChunkName: "admin_dqr_ICCorrelation"*/ "./externalValidation"
      ),
    internalValidation: () =>
      import(
        /* webpackChunkName: "admin_dqr_internalConsistency"*/ "./internalValidation"
      ),
    reportingRate: () =>
      import(
        /* webpackChunkName: "admin_dqr_reportingRate"*/ "./reportingRate"
      ),
    emuMonthly: () =>
      import(/* webpackChunkName: "admin_dqr_emuMonthly"*/ "./emuMonthly"),
    signOffForm: () =>
      import(/* webpackChunkName: "admin_dqr_signOff"*/ "./signOffForm"),
  },
  data() {
    // console.log("emuMonthlyConfig.dqrModule.emu_monthly.Background_Data",emuMonthlyConfig.dqrModule.emu_monthly.Background_Data)
    return {
      activeTab: "summary",
      activeSubTab: "summary",
      activeSubSubTab: "actual",
      activeExternalSubTab: "Injectable",
      activeInjectableSubTab: "Visits",
      activeIUDSubTab: "Visits",
      activeImplantSubTab: "Visits",
      backgroundData: emuAnnualConfig.dqrModule.emu.Background_Data,
      backgroundDataMonthly:
        emuMonthlyConfig.dqrModule.emu_monthly.Background_Data,
      internalValDataSource: "Visits",
      reportingRateDataSource: "Visits",
      storedMethod: "",
      data_sources_arr: [],
      selectedMethod:
        externalConfig.dqrModule.external_validation.Background_Data
          .selectedMethod,
      subLevelID:
        externalConfig.dqrModule.external_validation.Background_Data.dataLevel,
      r2Max: externalConfig.dqrModule.external_validation.Background_Data.r2Max,
      levelIDList: [],
      defaultLevelID: "",
      dataSaved: false,
      syncMappingModalStatus: false,
      selectedLocaleToCopy: "",
      syncKey: "",
      originalSyncKey: "",
      standardDeviation: 2,
      originalData: null,
      modules: modules.module,
    };
  },
  computed: {
    subLevelIDList: function () {
      if (this.levelIDList && this.levelIDList.length) {
        return this.levelIDList.filter((item) => {
          if (
            item.level === this.defaultLevelID &&
            item.level === this.levelIDList.length
          ) {
            return item;
          }
          if (item.level > this.defaultLevelID) {
            return item;
          }
        });
      } else {
        return [];
      }
    },
  },
  watch: {
    internalValDataSource(selected) {
      // console.log(selected)
      // console.log(this.activeExternalSubTab)
      if (this.storedMethod === selected) {
        this.dataSaved = true;
      } else {
        this.dataSaved = false;
      }
    },
    reportingRateDataSource(selected) {
      // console.log(selected)
      // console.log(this.activeExternalSubTab)
      if (this.storedMethod === selected) {
        this.dataSaved = true;
      } else {
        this.dataSaved = false;
      }
    },
  },
  methods: {
    goTo() {
      this.$emit("updateActiveTab", "nav-gf-tab", true);
    },
    syncMappingFromLocale(key, orgSyncKey) {
      // console.log(key)
      this.syncMappingModalStatus = true;
      this.syncKey = key;
      this.originalSyncKey = orgSyncKey;
    },
    syncMapping() {
      // console.log(this.syncKey)
      // console.log("this.backgroundData",this.backgroundData)
      // console.log("this.backgroundDataMonthly",this.backgroundDataMonthly)
      this.$store.state.loading = true;
      let key = this.generateKey(
        dqrModule,
        true,
        true,
        this.selectedLocaleToCopy
      );

      let response = service.getSavedConfig(key);
      response.then((res) => {
        // console.log(res.data)
        let data = null,
          updatedData = [];
        if (this.originalSyncKey === "backgroundData") {
          data = res.data.emu.Background_Data;
        }

        if (this.originalSyncKey === "backgroundDataMonthly") {
          data = res.data.emu_monthly.Background_Data;
        }
        // console.log("data",data)
        // console.log("this.originalSyncKey",this.originalSyncKey)
        // console.log("this.syncKey",this.syncKey)
        // console.log("this[this.originalSyncKey][this.syncKey]",this[this.originalSyncKey][this.syncKey])
        this[this.originalSyncKey][this.syncKey].forEach((c, i) => {
          let innerData = c,
            dataFromLocale = data[this.syncKey].find((cLocale) => {
              if (Array.isArray(innerData.static_name)) {
                if (Array.isArray(cLocale.static_name)) {
                  return (
                    cLocale.static_name[0].toLowerCase() ===
                    innerData.static_name[0].toLowerCase()
                  );
                } else {
                  return (
                    cLocale.static_name.toLowerCase() ===
                    innerData.static_name[0].toLowerCase()
                  );
                }
              } else {
                if (Array.isArray(cLocale.static_name)) {
                  return (
                    cLocale.static_name[0].toLowerCase() ===
                    innerData.static_name.toLowerCase()
                  );
                } else {
                  return (
                    cLocale.static_name.toLowerCase() ===
                    innerData.static_name.toLowerCase()
                  );
                }
              }
            }),
            innerSubInd = [];
          // console.log(innerData)
          // console.log(dataFromLocale)
          if (dataFromLocale) {
            innerData.subIndicators.forEach((subInd, j) => {
              let dataFromSubLocale = dataFromLocale.subIndicators.find(
                (cSubLocale) => {
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
                }
              );
              // console.log(dataFromSubLocale)
              if (dataFromSubLocale) {
                innerSubInd.push({
                  ...subInd,
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
              ...innerData,
              subIndicators: innerSubInd,
              color: dataFromLocale.color,
              visible: dataFromLocale.visible,
            });
          } else {
            updatedData.push({
              ...innerData,
            });
          }
        });

        // console.log(this.originalSyncKey)
        // console.log(this.syncKey)
        // console.log(updatedData)
        this[this.originalSyncKey][this.syncKey] = updatedData;
        this.$store.state.loading = false;
        this.syncMappingModalStatus = false;
        this.selectedLocaleToCopy = "";
        this.syncKey = "";
        this.$nextTick(() => {
          let p_type =
            this.originalSyncKey === "backgroundData" ? "emu" : "emu_monthly";
          this.saveBgData(p_type);
          this.originalSyncKey = "";
        });
      });
    },
    getDataLevel(id) {
      this.subLevelID = id;
      let levelID = this.levelIDList.find((a) => a.level === id);
      let bFlag = this.subLevelIDList.find((a) => a.level === id);
      // console.log(this.subLevelIDList)
      // console.log(bFlag)
      if (!bFlag) {
        this.subLevelIDList.push(levelID);
      }
    },
    getSelectedSource(name, key) {
      let n = `selected${key}Source`;
      this[n] = name;
    },
    //This is to update active tab name.
    //On the base of the active tab we will render the component.
    updateActiveTab(tab_name) {
      this.activeTab = tab_name;
      this.activeSubTab = "visits";
      if (tab_name === "summary") {
        this.activeSubTab = "summary";
      }
      if (tab_name === "moduleSettings") {
        this.activeSubTab = "moduleSettings";
      }
      if (tab_name === "externalValidation") {
        this.activeExternalSubTab = "Injectable";
        this.activeInjectableSubTab = "Visits";
        this.dataSaved = true;
      }
      if (tab_name === "signOff") {
        if (this.modules.reportingRate.disable) {
          if (this.modules.internalValidation.disable) {
            this.activeSubTab = "externalValidation";
          } else {
            this.activeSubTab = "internalValidation";
          }
        } else {
          this.activeSubTab = "reportingRate";
        }
      }
      if (tab_name === "internalValidation") {
        this.dataSaved = true;
        this.data_sources_arr = this.data_sources_arr.filter(
          (d) => d.value !== "Overall"
        );
      }
      if (tab_name === "reportingRate") {
        this.dataSaved = true;
        let isFound = this.data_sources_arr.find((d) => d.value === "Overall");
        if (!isFound) {
          this.data_sources_arr = this.data_sources_arr.concat({
            text: this.$i18n.t("overall"),
            value: "Overall",
          });
        }
      }
    },
    updateActiveSubTab(tab_name, subSubTab = null) {
      if (this.activeTab === "externalValidation") {
        this.activeExternalSubTab = tab_name;
        this.activeInjectableSubTab = "Visits";
        this.activeIUDSubTab = "Visits";
        this.activeImplantSubTab = "Visits";
      } else {
        this.activeSubTab = tab_name;
      }
      //Only for signOff module
      if (subSubTab) {
        this.activeSubSubTab = subSubTab;
      }
    },
    updateActiveSubSubTab(subTab, subSubTab) {
      this.activeSubTab = subTab;
      this.activeSubSubTab = subSubTab;
    },
    getBGInfo(response) {
      this.backgroundData = emuAnnualConfig.dqrModule.emu.Background_Data;
      this.backgroundDataMonthly =
        emuMonthlyConfig.dqrModule.emu_monthly.Background_Data;
      this.$nextTick(() => {
        if (response.emu.Background_Data) {
          let mergedData = merge(
            this.backgroundData,
            response.emu.Background_Data
          );
          this.backgroundData = JSON.parse(JSON.stringify(mergedData));
          if (this.activeTab === "emu") {
            this.originalData = JSON.parse(
              JSON.stringify(response.emu.Background_Data)
            );
          }
        }
        // console.log("this.backgroundData after merging",this.backgroundData)

        if (response.emu_monthly.Background_Data) {
          let mergedData = merge(
            this.backgroundDataMonthly,
            response.emu_monthly.Background_Data
          );
          this.backgroundDataMonthly = JSON.parse(JSON.stringify(mergedData));
          if (this.activeTab === "emu_monthly") {
            this.originalData = JSON.parse(
              JSON.stringify(response.emu_monthly.Background_Data)
            );
          }
        }
        // console.log("this.backgroundDataMonthly after merging",this.backgroundDataMonthly)
        if (response.external_validation.Background_Data) {
          this.storedMethod =
            response.external_validation.Background_Data.selectedMethod;
          this.selectedMethod =
            response.external_validation.Background_Data.selectedMethod;
          this.subLevelID =
            response.external_validation.Background_Data.dataLevel;
          this.r2Max = response.external_validation.Background_Data.r2Max;
          if (this.activeTab === "externalValidation") {
            this.originalData = JSON.parse(
              JSON.stringify(response.external_validation.Background_Data)
            );
          }
        }

        if (
          response.internal_validations &&
          response.internal_validations.Background_Data.data_source
        ) {
          this.internalValDataSource =
            response.internal_validations.Background_Data.data_source;
          this.standardDeviation = response.internal_validations.Background_Data
            .standardDeviation
            ? response.internal_validations.Background_Data.standardDeviation
            : this.standardDeviation;
          this.storedMethod =
            response.internal_validations.Background_Data.data_source;
          if (this.activeTab === "internalValidation") {
            this.originalData = JSON.parse(
              JSON.stringify(response.internal_validations.Background_Data)
            );
          }
        }

        if (
          response.reportingRate &&
          response.reportingRate.Background_Data.data_source
        ) {
          this.reportingRateDataSource =
            response.reportingRate.Background_Data.data_source;
          this.storedMethod =
            response.reportingRate.Background_Data.data_source;
          if (this.activeTab === "reportingRate") {
            this.originalData = JSON.parse(
              JSON.stringify(response.reportingRate.Background_Data)
            );
          }
        }
      });
    },
    getModules() {
      let key = this.generateKey("modules", false);

      service.getSavedConfig(key).then((response) => {
        this.modules = assign(this.modules, response.data);
      });
    },
    saveBgData(p_type) {
      // console.log(p_type)
      // console.log(this.backgroundData)
      // console.log(this.backgroundDataMonthly)
      this.$store.state.loading = true;
      let key = this.generateKey("dqrModule");

      // console.log("key", key)
      let allKeys = service.getAllKeys();
      allKeys.then((keys) => {
        if (keys.data.includes(key)) {
          let saveConfig = service.getSavedConfig(key);
          saveConfig.then((res) => {
            let configData = res.data;
            // console.log("configData",configData);
            if (p_type === "reportingRate") {
              if (!configData[p_type]) {
                configData[p_type] = {
                  Background_Data: {
                    data_source: this.reportingRateDataSource,
                  },
                };
              } else {
                configData[p_type] = {
                  ...configData[p_type],
                  Background_Data: {
                    data_source: this.reportingRateDataSource,
                  },
                };
              }
            }
            if (p_type === "internal_validations") {
              if (!configData[p_type]) {
                configData[p_type] = {
                  Background_Data: {
                    data_source: this.internalValDataSource,
                    standardDeviation: this.standardDeviation,
                  },
                };
              } else {
                configData[p_type] = {
                  ...configData[p_type],
                  Background_Data: {
                    data_source: this.internalValDataSource,
                    standardDeviation: this.standardDeviation,
                  },
                };
              }
            }
            if (p_type === "external_validation") {
              // let orgLevel = this.subLevelIDList.find(o => o.level === this.subLevelID).name
              // console.log(orgLevel)
              if (!configData[p_type]) {
                configData[p_type] = {
                  Background_Data: {
                    selectedMethod: this.selectedMethod,
                    dataLevel: this.subLevelID,
                    r2Max: this.r2Max,
                    orgLevel: this.levelIDList,
                  },
                };
              } else {
                configData[p_type] = {
                  ...configData[p_type],
                  Background_Data: {
                    selectedMethod: this.selectedMethod,
                    dataLevel: this.subLevelID,
                    r2Max: this.r2Max,
                    orgLevel: this.levelIDList,
                  },
                };
              }
            }
            if (p_type === "emu") {
              if (!configData[p_type]) {
                configData[p_type] = {
                  Background_Data: this.backgroundData,
                };
              } else {
                configData[p_type] = {
                  ...configData[p_type],
                  Background_Data: configData[p_type].Background_Data
                    ? assign(
                        configData[p_type].Background_Data,
                        this.backgroundData
                      )
                    : this.backgroundData,
                };
              }
            }
            if (p_type === "emu_monthly") {
              if (!configData[p_type]) {
                configData[p_type] = {
                  Background_Data: this.backgroundDataMonthly,
                };
              } else {
                configData[p_type] = {
                  ...configData[p_type],
                  Background_Data: configData[p_type].Background_Data
                    ? assign(
                        configData[p_type].Background_Data,
                        this.backgroundDataMonthly
                      )
                    : this.backgroundDataMonthly,
                };
              }
            }
            let configChanges = audit.configAudit(
              this.originalData,
              configData[p_type].Background_Data
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
                        p_type,
                        "Background_Data"
                      );
                    }
                  });
                  this.$store.state.loading = false;
                  if (
                    p_type === "reportingRate" ||
                    p_type === "external_validation" ||
                    p_type === "internal_validations"
                  ) {
                    this.dataSaved = true;
                  }
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
          let dqr = {};
          if (p_type === "emu") {
            dqr = {
              [p_type]: {
                Background_Data: this.backgroundData,
              },
            };
          }
          if (p_type === "emu_monthly") {
            dqr = {
              [p_type]: {
                Background_Data: this.backgroundDataMonthly,
              },
            };
          }
          if (p_type === "external_validation") {
            // let orgLevel = this.subLevelIDList.find(o => o.level === this.subLevelID)
            dqr = {
              [p_type]: {
                Background_Data: {
                  selectedMethod: this.selectedMethod,
                  dataLevel: this.subLevelID,
                  r2Max: this.r2Max,
                  orgLevel: this.levelIDList,
                },
              },
            };
          }
          if (p_type === "internal_validations") {
            let oConfig = internalConfig.dqrModule[p_type];
            oConfig.Background_Data.data_source = this.internalValDataSource;
            oConfig.Background_Data.standardDeviation = this.standardDeviation;
            dqr = oConfig;
          }
          if (p_type === "reportingRate") {
            let oConfig = reportingRateConfig.dqrModule[p_type];
            oConfig.Background_Data.data_source = this.reportingRateDataSource;
            dqr = oConfig;
          }
          let response = service.saveConfig(dqr, key);
          response.then((response) => {
            if (response.data.status === "OK") {
              // console.log("response save ", response.data)
              this.$swal({
                title: this.$i18n.t("data_saved_successfully"),
              });
              if (
                p_type === "reportingRate" ||
                p_type === "external_validation" ||
                p_type === "internal_validations"
              ) {
                this.dataSaved = true;
              }
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
    saveModules() {
      // console.log(p_type)
      // console.log(this.backgroundData)
      // console.log(this.backgroundDataMonthly)
      this.$store.state.loading = true;
      let key = this.generateKey("modules", false);

      // console.log("key", key)
      let allKeys = service.getAllKeys();
      allKeys.then((keys) => {
        if (keys.data.includes(key)) {
          let saveConfig = service.getSavedConfig(key);
          saveConfig.then((res) => {
            let configData = assign(res.data, this.modules);
            // console.log(configData)
            // console.log("configData",configData);

            let response = service.updateConfig(configData, key);
            response
              .then((response) => {
                if (response.data.status === "OK") {
                  // console.log("response update ", response.data)
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
              })
              .catch(() => {
                this.$swal({
                  title: this.$i18n.t("error"),
                });
                this.$store.state.loading = false;
                return;
              });
          });
        } else {
          let data = this.modules;
          let response = service.saveConfig(data, key);
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
    // console.log("dqr created called")
    this.data_sources_arr = [
      {
        text: this.$i18n.t("visits"),
        value: "Visits",
      },
      {
        text: this.$i18n.t("Commodities_Client"),
        value: "Commodities_Client",
      },
      {
        text: this.$i18n.t("Commodities_Facilities"),
        value: "Commodities_Facilities",
      },
      {
        text: this.$i18n.t("users"),
        value: "User",
      },
    ];

    this.getModules();
    let { levelID } = service.getAllowedLocation();
    this.defaultLevelID = levelID;

    //This is to fetch list of Indicator(s)
    let orgLevelList = service.getOrganisationUnitLevels();
    orgLevelList.then((orgList) => {
      // console.log("orgList",orgList.data.organisationUnitLevels);
      this.levelIDList = orgList.data;
    });
  },
};
</script>
