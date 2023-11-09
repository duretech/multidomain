<template>
  <div class="dqr dqr-main2 dqr-section">
    <div id="scrollTop">
      <div
        class="dqr-main pt-2"
        v-show="$store.getters.getActiveTab.includes('dqr-summary')"
      >
        <div class="summary-dqr-page" v-if="!reportChartData">
          <b-card class="overview-card mx-3 mt-3">
            <template #header class="pb-0 border-bottom-0">
              <div
                class="d-flex justify-content-between align-items-center w-100"
              >
                <h5 class="dqr-title mb-0 text-uppercase fs-19-1920">
                  {{ $t("dqr") }} {{ selectedDate }}
                </h5>
                <div class="text-right mb-3">
                  <button
                    type="button"
                    class="btn btn-primary black-btn blue-btn f-08rem"
                    @click.prevent.stop="downloadReport()"
                  >
                    <span class="">
                      <img
                        :src="
                          require('@/assets/images/icons/generateReport.svg')
                        "
                        class="img-fluid mt-xl-n1"
                      />
                    </span>
                    <span class="mx-1"> {{ $t("exportbtn") }} </span>
                  </button>
                </div>
              </div>
            </template>
            <b-card-body :style="{backgroundColor: isGenerating || textUpdate ? $store.getters.getTheme == 'dark'? '#201F3C !important' : $store.getters.getTheme == 'grey' ? '#212934 !important' : '' : ''}" class="dqr-card-body pt-0" ref="printPDF">
              <h2 v-if="isGenerating" style="text-align: center" :style="{color: isGenerating ? $store.getters.getTheme == 'dark'? 'white !important' : $store.getters.getTheme == 'grey' ? 'white !important' : '' : ''}">
                {{ $t("DQR") }}
              </h2>
              <!-- //here -->
              <div class="dqr-border">
                <div class="d-flex justify-content-end mb-2">
                  <b-button
                    @click.prevent.stop="cancelScorecard"
                    class="mt-4 mb-2 ml-3"
                    v-if="scorecardDataFetching"
                  >
                    <span>{{ $t("cancelbtn") }}</span>
                  </b-button>
                  <b-button
                    v-if="!scorecardGenerated"
                    class="position-relative blue-btn mt-4 mb-2 mx-2"
                    @click.prevent.stop="viewScorecard"
                  >
                    <span v-if="scorecardDataFetching">{{
                      `${locationFetchedPercent}%`
                    }}</span>
                    <div
                      class="loaderBackground"
                      v-if="scorecardDataFetching || scorecardsFetching"
                    ></div>
                    <span
                      :class="{
                        'ml-2': scorecardDataFetching,
                        'ml-4 pl-2': scorecardsFetching,
                      }"
                      >{{
                        scorecardDataFetching
                          ? $t("scorecardGenerating")
                          : scorecardsFetching
                          ? $t("scorecardFetch")
                          : $t("scorecardGenerate")
                      }}</span
                    >
                  </b-button>

                  <b-button
                    class="generate-btn blue-btn mt-4 mb-2"
                    @click.prevent.stop="viewScorecard"
                    :style="{background: isGenerating ? '#4375BC !important' : ''}"
                    v-else
                  >
                    <span>{{ $t("viewScorecard") }}</span>
                  </b-button>

                  <!-- <b-modal
                    v-model="generateScorecardPopup"
                    hide-footer
                    centered
                    size="sm"
                    :title="$t('location')"
                    no-close-on-backdrop
                  >
                    <div class="row">
                      <div class="col-12">
                        <treeselect
                          name="scorecardLocations"
                          :multiple="true"
                          :options="locationPeriod.locationList"
                          :limit="3"
                          :flat="true"
                          :default-expand-level="1"
                          v-model="selectedScorecardLocations"
                          sort-value-by="INDEX"
                          :placeholder="$t('select')"
                          :load-options="loadOptions"
                        />
                      </div>
                      <div class="col-12 mt-4">
                        <div class="text-right">
                          <b-button
                            small
                            @click.prevent.stop="generateScore"
                            class="ok-grey blue-btn"
                            :disabled="selectedScorecardLocations.length === 0"
                          >
                            <span class="small">{{ $t("ok") }}</span>
                          </b-button>
                        </div>
                      </div>
                    </div>
                  </b-modal> -->
                  <b-modal
                    v-model="showScorecard"
                    hide-footer
                    centered
                    size="xl"
                    :title="$t('scorecard')"
                    no-close-on-backdrop
                    :ok-title="$t('ok')"
                    :cancel-title="$t('cancelbtn')"
                  >
                    <div class="d-flex align-items-center mb-3">
                      <div>{{ $t("generateFacScore") }}</div>
                      <b-form-checkbox
                        v-model="facilityLevelScorecard"
                        name="facilityLevelScorecard"
                        switch
                        size="lg"
                        class="mx-3 mb-1"
                      />
                    </div>
                    <div v-if="facilityLevelScorecard">
                      <div v-if="selectedDate" class="mr-4 small mb-2">
                        <strong>{{ $t("period") }}: </strong
                        ><strong>{{ selectedDate }}</strong>
                      </div>
                      <div class="row">
                        <div class="col-8" v-if="facilityLevelScorecard">
                          <div
                            class="d-flex justify-content-end pb-3 text-right"
                          >
                            <div class="small w-50 select-dqr select-dropdown">
                              <treeselect
                                name="scorecardLevels"
                                :multiple="false"
                                :options="scorecardLevels"
                                :limit="3"
                                :isDisabled="true"
                                :default-expand-level="1"
                                v-model="selectedScorecardLevels"
                                sort-value-by="INDEX"
                                :placeholder="$t('select')"

                              />
                            </div>
                            <div class="small w-50 select-dqr">
                              <treeselect
                                name="scorecardLocations"
                                :multiple="true"
                                :options="updatedOrgList"
                                :limit="3"
                                :flat="true"
                                :default-expand-level="1"
                                v-model="selectedFacilityOrg"
                                sort-value-by="INDEX"
                                :placeholder="$t('select')"
                                :load-options="loadOptions"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-4" v-if="facilityLevelScorecard">
                          <b-button
                            small
                            @click.prevent.stop="
                              scorecardGenerated
                                ? generateScore(true)
                                : generateScore()
                            "
                            class="ok-grey blue-btn"
                            :disabled="selectedScorecardLocations.length === 0"
                          >
                            <span class="small">{{
                              scorecardGenerated
                                ? $t("scorecardReGenerate")
                                : $t("scorecardGenerate")
                            }}</span>
                          </b-button>
                        </div>
                      </div>

                      <div
                        class=""
                        v-if="
                          selectedFacilityOrg.length &&
                          getFacilityTableData.length
                        "
                      >
                        <div
                          class="d-flex justify-content-between align-items-center"
                        >
                          <div class="button-score">
                            <b-button
                              size="sm"
                              @click="selectAllRows"
                              class="btn"
                            >
                              {{ $t("selectAll") }}</b-button
                            >
                            <b-button
                              size="sm"
                              @click="clearSelected"
                              class="btn mx-3"
                              >{{ $t("clearSelected") }}</b-button
                            >
                          </div>
                          <div
                            class="d-flex justify-content-between align-items-center"
                          >
                            <div>
                              <b-input-group
                                v-if="getFacilityTableData.length"
                                class="my-3 w-100"
                              >
                                <b-input-group class="mx-4">
                                  <b-form-input
                                    id="filter-input"
                                    v-model="filter"
                                    type="search"
                                    :placeholder="$t('search')"
                                  ></b-form-input>
                                </b-input-group>
                              </b-input-group>
                            </div>
                            <b-pagination
                              class="m-0"
                              v-model="currentPage"
                              :total-rows="rows.length"
                              :per-page="perPage"
                              aria-controls="selectableTableId"
                            ></b-pagination>
                          </div>
                        </div>
                        <div class="">
                          <b-table
                            id="selectableTableId"
                            sticky-header
                            responsive="sm"
                            :items="rows"
                            :fields="facilityTableFields"
                            :filter="filter"
                            select-mode="multi"
                            ref="selectableTable"
                            selectable
                            @row-selected="onRowSelected"
                            class="table-bordered dqr-score"
                            :per-page="perPage"
                            :current-page="currentPage"
                            show-empty
                            :empty-text="$t('no_data_to_display')"
                          >
                            <template #cell(selected)="{ rowSelected }">
                              <template v-if="rowSelected">
                                <span aria-hidden="true">
                                  <i
                                    class="fa fa-check-square-o"
                                    aria-hidden="true"
                                  ></i
                                ></span>

                                <span class="sr-only">Selected</span>
                              </template>
                              <template v-else>
                                <span aria-hidden="true"
                                  ><i
                                    class="fa fa-square-o"
                                    aria-hidden="true"
                                  ></i
                                ></span>
                                <span class="sr-only">Not selected</span>
                              </template>
                            </template>
                          </b-table>
                        </div>
                      </div>
                      <b-spinner
                        v-if="
                          selectedFacilityOrg.length &&
                          getFacilityTableData.length == 0
                        "
                        type="grow"
                        label="Spinning"
                      ></b-spinner>
                    </div>
                    <div class="row">
                      <div class="col-4" v-if="!facilityLevelScorecard">
                        <!-- <div
                          v-if="locationPeriod.locationName"
                          class="mr-4 small"
                        >
                          <strong>{{ $t("location") }}: </strong
                          ><strong>{{ locationPeriod.locationName }}</strong>
                        </div> -->
                        <div v-if="selectedDate" class="mr-4 small">
                          <strong>{{ $t("period") }}: </strong
                          ><strong>{{ selectedDate }}</strong>
                        </div>
                      </div>
                      <div class="col-8" v-if="!facilityLevelScorecard">
                        <div class="d-flex justify-content-end pb-3 text-right">
                          <div class="small w-50 select-dqr">
                            <treeselect
                              name="scorecardLocations"
                              :multiple="true"
                              :options="locationPeriod.locationList"
                              :limit="3"
                              :flat="true"
                              :default-expand-level="1"
                              v-model="selectedScorecardLocations"
                              sort-value-by="INDEX"
                              :placeholder="$t('select')"
                              :load-options="loadOptions"
                            />
                          </div>
                          <b-button
                            small
                            @click.prevent.stop="generateScore(true)"
                            class="position-relative mx-4 blue-btn"
                            :disabled="
                              selectedScorecardLocations.length === 0 ||
                              scorecardDataFetching
                            "
                          >
                            <span class="small">{{
                              scorecardGenerated
                                ? $t("scorecardReGenerate")
                                : $t("scorecardGenerate")
                            }}</span>
                          </b-button>
                        </div>
                      </div>

                      <div
                        class="row d-flex justify-content-end align-items-center ml-auto mb-3 mx-3"
                      >
                        <div class="col-8" v-if="scorecardGenerated">
                          <div class="text-right small">
                            <input
                              type="text"
                              class="form-control"
                              id="inputScorecardSearch"
                              :placeholder="$t('search')"
                              v-model="scorecardSearch"
                            />
                            <!-- </div>

                          <div class="text-right small pb-3"> -->
                          </div>
                        </div>
                        <div class="col-4" v-if="scorecardGenerated">
                          <download-csv
                            class="align-items-center btn btn-secondary blue-btn d-flex justify-content-center"
                            :data="scorecardItemsDownload"
                          >
                            <span class="small">
                              <!-- <i class="fa fa-download mr-2"></i> -->
                              <span>
                                <img
                                  :src="
                                    require('@/assets/images/icons/downloadcsvActive.svg')
                                  "
                                  class="w-auto mx-1 mt-lg-n1"
                                />
                              </span>
                              <span class="mx-1"> {{ $t("csv") }} </span>
                            </span>
                          </download-csv>
                        </div>
                      </div>
                      <div class="col-12" v-if="scorecardGenerated">
                        <b-table
                          class="dqr-scoreboard"
                          head-variant="light"
                          responsive
                          sticky-header
                          bordered
                          hover
                          :items="scorecardItemsFiltered"
                          :fields="scorecardFields"
                          show-empty
                          :empty-text="$t('no_data_to_display')"
                        >
                          <template v-slot:cell(show_details)="row">
                            <b-form-checkbox
                              v-model="row.detailsShowing"
                              @change="row.toggleDetails"
                            >
                            </b-form-checkbox>
                          </template>
                          <template v-slot:row-details="row">
                            <b-card>
                              <b-table
                                head-variant="light"
                                responsive
                                hover
                                bordered
                                show-empty
                                :items="row.item.scoreDetails"
                                :empty-text="$t('no_data_to_display')"
                              ></b-table>
                            </b-card>
                          </template>
                        </b-table>
                      </div>
                    </div>
                  </b-modal>
                </div>
                <div>
                  <b-row>
                    <b-col cols="6">
                      <p
                        class="quality-text fs-17-1920"
                        v-if="
                          $store.getters.getNamespace.includes('_fp-dashboard')
                        "
                        :style="{color: isGenerating && ['dark', 'grey'].includes($store.getters.getTheme) ? 'white !important' : ''}"
                        >
                        {{ $t("dqr1", { selectedDate }) }}
                      </p>
                      <p
                      class="quality-text fs-17-1920"
                      v-if="
                          $store.getters.getNamespace.includes(
                            '_mnch-dashboard'
                            )
                            "
                            :style="{color: isGenerating && ['dark', 'grey'].includes($store.getters.getTheme) ? 'white !important' : ''}"
                      >
                        {{ $t("dqr2", { selectedDate }) }}
                      </p>
                    </b-col>
                    <b-col cols="4">
                      <highcharts
                        :options="chartConfig"
                        style="height: 150px"
                      ></highcharts>
                    </b-col>
                    <b-col cols="2">
                      <div
                        class="align-items-center d-flex flex-column justify-content-center score"
                      >
                        <h4 class="scoretitle fs-25-1920" :style="{color: isGenerating ? $store.getters.getTheme == 'dark'? 'white !important' : $store.getters.getTheme == 'grey' ? 'white !important' : '' : ''}">
                          {{ $t("dqrScore") }}
                        </h4>
                        <p class="totalscore fs-25-1920" :style="{color: isGenerating ? $store.getters.getTheme == 'dark'? 'white !important' : $store.getters.getTheme == 'grey' ? 'white !important' : '' : ''}">
                          {{ qualityScore }}/{{ totalScores }}
                        </p>
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </div>
              <div class="">
                <b-row>
                  <template v-if="scoreBox.length === 0 && !isGenerating">
                    <b-col sm="4" v-for="i in 3" :key="'dummy' + i">
                      <b-card class="inner-card">
                        <template #header class="inner-header pb-0">
                          <h6 class="mb-0 pl-1 fs-19-1920">
                            <b-skeleton></b-skeleton>
                          </h6>
                        </template>
                        <b-card-body class="inner-card-body p-3">
                          <b-skeleton class="mb-3"></b-skeleton>
                          <b-skeleton></b-skeleton>
                        </b-card-body>
                      </b-card>
                    </b-col>
                  </template>
                  <b-col
                    :sm="dynamicCols"
                    class="mb-3"
                    v-for="(menu, i) in scoreBox"
                    :key="'menu' + i"
                  >
                    <b-card class="inner-card" :style="{backgroundColor: isGenerating ? $store.getters.getTheme === 'dark'? '#64648D !important' : $store.getters.getTheme === 'grey' ? '#404B5A !important' : '' : ''}">
                      <template #header>
                        <h6 class="mb-0 pl-1 fs-19-1920">
                          {{ menu.tabName }}
                        </h6>
                      </template>
                      <b-card-body
                        class="inner-card-body pl-0"
                        :style="{ 'height': getHeight + 'px' }"
                      >
                        <div class="complete-list p-4 mb-0">
                          <div
                            class="pb-2 d-flex"
                            v-for="(subMenu, j) in menu.subTabs"
                            :key="'subMenu' + i + j"
                          >
                            <div>
                              <i
                                class="fa fa-circle pr-2 cursor-pointer"
                                aria-hidden="true"
                                :class="[
                                  subMenu.scoreDetails.score === 0
                                    ? 'color-red'
                                    : subMenu.scoreDetails.score === 1
                                    ? 'color-green'
                                    : '',
                                ]"
                                v-b-popover.hover="{
                                  variant: 'info',
                                  content: subMenu.scoreDetails.errorMsg
                                    ? subMenu.scoreDetails.errorMsg
                                    : subMenu.scoreDetails.hoverText,
                                  title: subMenu.tabName,
                                  html: true,
                                }"
                                v-if="subMenu.scoreDetails"
                              ></i>
                              <b-spinner
                                class="mr-2"
                                small
                                type="grow"
                                label="Spinning"
                                v-else
                              ></b-spinner>
                            </div>
                            <div
                              class="fs-17-1920 cursor-pointer"
                              @click="
                                $store.commit('setActiveTab', subMenu.navLink)
                              "
                              :style="{color: isGenerating ? $store.getters.getTheme === 'dark'? 'white !important' : $store.getters.getTheme === 'grey' ? 'white !important' : '' : ''}"
                            >
                              {{ subMenu.tabName }}
                            </div>
                          </div>
                        </div>
                      </b-card-body>
                    </b-card>
                  </b-col>
                  <b-col
                    sm="12"
                    class="analytic"
                    v-if="$store.getters.getNamespace.includes('_fp-dashboard')"
                  >
                    <b-card
                      class="inner-card"
                      :class="[isGenerating ? 'no-border' : 'border-grey']"
                      :style="{backgroundColor: isGenerating ? this.$store.getters.getTheme === 'dark'? '#201F3C !important' : this.$store.getters.getTheme === 'grey' ? '#212934 !important' : '' : ''}"
                    >
                      <template #header class="inner-header">
                        <h6 class="mb-0 pl-1 fs-19-1920 text-center">
                          {{ $t("eConsistency") }}
                        </h6>
                      </template>
                      <div class="inner-card-body py-3">
                        <FPExternal
                          :dqrResponse="dqrResponse"
                          :preFetchData="preFetchData"
                          :locationPeriod="locationPeriod"
                          :isGenerating="isGenerating"
                          v-if="
                            $store.getters.getNamespace.includes(
                              '_fp-dashboard'
                            )
                          "
                        ></FPExternal>
                        <div class="text-center" v-else>
                          {{ $t("no_data_to_display") }}
                        </div>
                      </div>
                    </b-card>
                  </b-col>
                </b-row>
              </div>
            </b-card-body>
          </b-card>
          <b-card class="sign-off-card mx-3 mb-5 pb-5">
            <template #header class="sign-off-header border-bottom-0">
              <h5 class="dqr-title mb-0 text-uppercase fs-19-1920">
                {{ $t("data_sign_off") }}
              </h5>
            </template>

            <b-card-body class="sign-off-card-body p-0">
              <b-row>
                <b-col sm="12" lg="6">
                  <b-card class="level-card">
                    <!-- <b-card-body> -->
                    <div class="dsl fs-17-1920">
                      <label>{{ $t("dsl") }}</label>
                      <div>
                        <div id="range"></div>
                        <div class="rangeSlider">
                          <SignOffDSL :dsl="dsl" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div
                        class="align-items-center d-flex justify-content-end"
                      >
                        <b-button
                          size="sm"
                          @click="showCountTable = !showCountTable"
                          id="tooltip-target-count"
                          class="count bg-transparent rounded-0 border-left-0 border-right-0 border-top-0 fs-17-1920"
                        >
                          <i
                            aria-hidden="true"
                            class="fa mr-2 fs-17-1920"
                            :class="[
                              showCountTable ? 'fa-eye-slash' : 'fa-eye',
                            ]"
                          ></i>
                          {{ $t("countDetails") }}
                        </b-button>
                        <b-tooltip
                          class="fs-17-1920"
                          target="tooltip-target-count"
                          triggers="hover"
                        >
                          {{ $t("countDetails_hover") }}
                        </b-tooltip>
                      </div>
                      <transition name="slide-fade">
                        <div
                          class="mt-3 table-responsive"
                          v-if="showCountTable"
                          style="font-size: 0.7rem"
                        >
                          <table class="table table-bordered dqr-table">
                            <thead class="thead-light">
                              <tr>
                                <th
                                  :colspan="Object.keys(value).length"
                                  v-for="(value, name, i) in countDistribution"
                                  :key="'name' + i"
                                  class="dqr-tablehead"
                                >
                                  {{ name }}
                                </th>
                              </tr>
                              <tr>
                                <template
                                  v-for="(value, name, i) in countDistribution"
                                >
                                  <th
                                    v-for="(vInner, nInner, j) in value"
                                    :key="'name' + i + j"
                                  >
                                    {{ nInner }}
                                  </th>
                                </template>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <template
                                  v-for="(value, name, i) in countDistribution"
                                >
                                  <th
                                    v-for="(vInner, nInner, j) in value"
                                    :key="'name' + j + i"
                                  >
                                    <template v-if="vInner.length > 0">
                                      <i
                                        class="fa fa-user mr-2 cursor-pointer"
                                        v-b-tooltip.hover
                                        :title="
                                          dot.title + ' (' + dot.count + ')'
                                        "
                                        v-for="(dot, k) in vInner"
                                        :key="'name' + j + i + k"
                                        :style="{
                                          color: dot.color,
                                        }"
                                        :class="dot.color"
                                        ><span class="ml-1">{{
                                          dot.count
                                        }}</span></i
                                      >
                                    </template>
                                    <template v-else>
                                      <i
                                        class="fa fa-user mr-2 cursor-pointer"
                                        v-b-tooltip.hover
                                        :title="$t('no_forms')"
                                        ><span class="ml-1">0</span></i
                                      >
                                    </template>
                                  </th>
                                </template>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </transition>
                    </div>
                    <div class="mt-2 dqr-greyvue">
                      <b-row>
                        <b-col cols="6">
                          <treeselect
                            :multiple="true"
                            :options="userList"
                            value-consists-of="LEAF_PRIORITY"
                            :default-expand-level="1"
                            :limit="1"
                            :zIndex="999999"
                            v-model="userSelected"
                            :placeholder="$t('pickUser')"
                          />
                        </b-col>
                        <b-col cols="6" class="select-vue">
                          <treeselect
                            :multiple="true"
                            :openDirection="'bottom'"
                            :options="tabList"
                            value-consists-of="LEAF_PRIORITY"
                            :default-expand-level="1"
                            :limit="1"
                            :zIndex="998"
                            v-model="tabSelected"
                            :placeholder="$t('pickCategory')"
                          />
                        </b-col>
                        <b-col
                          sm="12"
                          class="mt-1 text-right small"
                          :style="{
                            opacity:
                              userSelected.length || tabSelected.length
                                ? '1'
                                : '0.5',
                            cursor:
                              userSelected.length || tabSelected.length
                                ? 'pointer'
                                : 'default',
                          }"
                        >
                          <i class="fa fa-refresh mr-1" aria-hidden="true"></i>
                          <u
                            class="resetcolr"
                            @click="
                              userSelected = [];
                              tabSelected = [];
                            "
                            >{{ $t("resetbtn") }}</u
                          >
                        </b-col>
                      </b-row>
                    </div>
                    <div
                      class="signoff-modal-body list-of-cards question_view mt-3"
                    >
                      <AllSignOffForms
                        :viewOpt="true"
                        :editOpt="false"
                        :deleteOpt="false"
                        :userDetails="userDetails"
                        :responseForms="signOffForms"
                        @updateSignOffForm="updateSignOffForm"
                      />
                    </div>
                    <!-- </b-card-body> -->
                  </b-card>
                </b-col>
                <b-col sm="12" lg="6">
                  <b-card class="sign-questions">
                    <!-- <b-card-body> -->
                    <div
                      class="signoff-modal-header"
                      v-if="tabName && formUser && formDate && formLocation"
                    >
                      <SignOffHeader
                        :showForms="false"
                        :tabName="tabName"
                        :isViewForms="false"
                        :formColor="formColor"
                        :userDetails="formUser"
                        :selectedDate="formDate"
                        :locationName="formLocation"
                      />
                    </div>
                    <div class="list-of-questions">
                      <SignOffForm
                        :isViewForm="true"
                        :hideRefresh="true"
                        :signOffForm="signOffForm"
                      />
                    </div>
                    <!-- </b-card-body> -->
                  </b-card>
                </b-col>
              </b-row>
            </b-card-body>
          </b-card>
        </div>
      </div>
      <!-- class="dqr-main pt-4" -->
      <div
        class="pt-4 mt-1"
        :style="{backgroundColor: isGenerating ? this.$store.getters.getTheme === 'dark'? '#201F3C' : this.$store.getters.getTheme === 'grey' ? '#212934' : '' : ''}"
        v-show="!$store.getters.getActiveTab.includes('dqr-summary')"
        ref="printDQR"
      >
        <h2 v-if="isGenerating" style="text-align: center" :style="{color: isGenerating ? $store.getters.getTheme == 'dark'? 'white !important' : $store.getters.getTheme == 'grey' ? 'white !important' : '' : ''}">{{ $t("DQR") }}</h2>
        <div
          :style="{
            visibility:
              $store.getters.getActiveTab.includes('emuMonthlyTab') ||
              $store.getters.getActiveTab.includes('emuAnnualTab')
                ? 'hidden'
                : 'visible',
          }"
        >
          <SignOff
            :configData="configData"
            :userDetails="userDetails"
            :signOffData="signOffData"
            :selectedDate="selectedDate"
            :locationName="locationPeriod.locationName"
            @updatedConfig="updatedConfig"
            :locationPeriod="locationPeriod"
            v-if="
              !isGenerating &&
              ($store.getters.getIsAdmin ||
                this.$store.getters.getAppSettings.bypassUser ||
                $store.getters.getUserPermissions.canSignOff) &&
              !reportChartData
            "
            @downloadReport="downloadReport"
          />
        </div>
        <b-container class="dqr-charts p-0 m-0">
          <template v-if="showCharts">
            <div
              v-for="(subTab, i) in configData.subTabs"
              :key="subTab.group + i"
            >
              <div v-show="$store.getters.getActiveTab.includes(subTab.id)">
                <TabSummary
                  :content="subTab.categoryInfo[$i18n.locale]"
                  :contKey="subTab.group + subTab.id"
                  v-if="!isGenerating"
                />
                <div
                  v-for="chartData in subTab.chartSetting"
                  :key="configData.id + subTab.id + chartData.chartOptions.cid"
                  class="after"
                >
                  <template v-if="!chartData.chartOptions.disable">
                    <ChartComponent
                      :subTab="subTab"
                      :childArr="childArr"
                      :chartData="chartData"
                      @setExtData="setExtData"
                      :allExtData="allExtData"
                      @summaryData="summaryData"
                      @updateToolBar="updateToolBar"
                      @setReportChart="setReportChart"
                      :locationPeriod="locationPeriod"
                      :reportChartData="reportChartData"
                      :scorecardLocation="scorecardLocation"
                      :backgroundData="subTab.backgroundData"
                      :configDQR="configDQR"
                      @updateChartData="updateChartData"
                      @getBubbleChart="getBubbleChart"
                      :isGenerating="isGenerating"
                    />
                  </template>
                </div>
              </div>
            </div>
          </template>
          <template
            v-if="
              !showCharts &&
              !['emuMonthlyTab', 'emuAnnualTab'].includes(
                $store.getters.getActiveTab
              )
            "
          >
            <HighChartComponent :chartData="placeholderObj" />
          </template>
          <div
            v-if="
              $store.getters.getActiveTab.includes('emuMonthlyTab') &&
              dqrResponse
            "
          >
            <!-- @sendScore="score" -->
            <benchmarkMonthlyTab
              ref="emu"
              :locationVal="locationPeriod.location"
              :isGenerating="isGenerating"
              :userDetails="userDetails"
              :dqrResponse="dqrResponse"
              :appResponse="appResponse"
              :globalResponse="globalResponse"
              :dhsColor="dhsColor"
              :totalEMUColor="emuColor"
              @methodFilter="methodFilterVal"
              :method="methodSelected"
              :debugging="debugging"
              :debuggingLevel="debuggingLevel"
              :tabName="$t('emu_monthly')"
              @updateChartData="updateChartData"
              @downloadReport="downloadReport"
            />
          </div>
          <div
            v-if="
              $store.getters.getActiveTab.includes('emuAnnualTab') &&
              dqrResponse
            "
          >
            <annual-tab
              :locationVal="locationPeriod.location"
              :isGenerating="isGenerating"
              :userDetails="userDetails"
              :dqrResponse="dqrResponse"
              :appResponse="appResponse"
              :globalResponse="globalResponse"
              @yearFilter="yearVal"
              :debugging="debugging"
              :debuggingLevel="debuggingLevel"
              :tabName="$t('emu_annual')"
              @updateChartData="updateChartData"
              @downloadReport="downloadReport"
            />
          </div>
        </b-container>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/service";
import {
  getOrg,
  getChild,
  getParent,
  excludeName,
  translateDate,
  formatSingleDate,
} from "@/components/Common/commonFunctions";
import SignOff from "@/components/DQR/SignOff";
import Treeselect from "@riophae/vue-treeselect";
import {
  commonChartConfig,
  summaryChartConfig,
} from "@/config/basicChartConfig";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import SignOffMixin from "@/helpers/SignOffMixin";
import ScrollPageMixin from "@/helpers/ScrollPageMixin";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import StaticColorMixin from "@/helpers/StaticColorMixin";
import loadLocChildMixin from "@/helpers/LoadLocationChildMixin";
import NepaliDate from "nepali-date-converter";
import GenerateReportMixin from "@/helpers/GenerateReportMixin";

export default {
  props: [
    "sideMenu",
    "dqrResponse",
    "selectedData",
    "preFetchData",
    "locationPeriod",
    "reportChartData",
    "configDataDQR",
  ],
  mixins: [
    SignOffMixin,
    ScrollPageMixin,
    DynamicImageMixin,
    StaticColorMixin,
    loadLocChildMixin,
    GenerateReportMixin,
  ],
  components: {
    SignOff,
    Treeselect,
    ChartComponent: () =>
      import(
        /* webpackChunkName: "Dynamic_Common_ChartComponent"*/ "@/components/Analytical/ChartComponent"
      ),
    HighChartComponent: () =>
      import(
        /* webpackChunkName: "HighChartComponentDynamic"*/ "@/components/Highcharts/HighChartComponentDynamic"
      ),
    TabSummary: () =>
      import(
        /* webpackChunkName: "TabSummary"*/ "@/components/Common/TabSummary"
      ),
    benchmarkMonthlyTab: () =>
      import(
        /* webpackChunkName: "dqr_emuMonthly"*/ "@/components/FPDashboard/dqr/monthly/benchmarkTab"
      ),
    annualTab: () =>
      import(
        /* webpackChunkName: "dqr_emuAnnual"*/ "@/components/FPDashboard/dqr/emuAnnual/benchmarkTab"
      ),
    FPExternal: () =>
      import(
        /* webpackChunkName: "dqr_FPExternal"*/ "@/components/DQR/FPExternal"
      ),
  },
  data() {
    return {
      updatedOrgList: [],
      perPage: 15,
      currentPage: 1,
      facilityLevelID: -1,
      facilityLevelScorecard: false,
      selectedScorecardLevels: [],
      selectedFacilityOrg: [],
      getFacilityTableData: [],
      selectedFacilities: [],
      facilityTableFields: [
        {
          key: "selected",
          sortable: false,
          isRowHeader: true,
        },
        {
          key: this.$i18n.t("name"),
          sortable: true,
          isRowHeader: true,
        },
        {
          key: this.$i18n.t("parent"),
          sortable: true,
          isRowHeader: true,
        },
        {
          key: this.$i18n.t("level"),
          sortable: true,
          isRowHeader: true,
        },
      ],
      scores: [],
      childArr: [],
      userList: [],
      allExtData: {},
      tabSelected: [],
      userSelected: [],
      userDetails: null,
      locationScores: [],
      scorecardItems: [],
      scorecardSearch: "",
      scorecardData: null,
      scorecardFields: [],
      scorecardDetails: [],
      showScorecard: false,
      showCountTable: false,
      scorecardLocation: "",
      isChildFetched: false,
      currentScorecard: [],
      isScorecardCancel: false,
      scorecardsFetching: false,
      scorecardGenerated: false,
      scorecardItemsDownload: [],
      scorecardDataFetching: false,
      configData: this.selectedData,
      generateScorecardPopup: false,
      selectedScorecardLocations: [],
      placeholderObj: commonChartConfig,
      chartConfig: JSON.parse(JSON.stringify(summaryChartConfig)),
      //Used for EMU setions
      appResponse: null,
      globalResponse: null,
      methodSelected: "",
      debugging: false,
      debuggingLevel: "API",
      filter: "",
      configDQR: null,
    };
  },
  computed: {
    rows() {
      const query = this.filter.toLowerCase();
      return this.getFacilityTableData.filter((item) => {
        console.log(
          item[this.$i18n.t("parent")],
          item[this.$i18n.t("location")]
        );
        return (
          item[this.$i18n.t("parent")].toLowerCase().includes(query) ||
          item[this.$i18n.t("name")].toLowerCase().includes(query)
        );
      });
      // return this.getFacilityTableData.length;
    },
    definedScorecardLevels() {
      if (this.$store.getters.getOrgLevels) {
        return this.$store.getters.getOrgLevels;
      } else {
        service.getOrganisationUnitLevels().then((orgList) => {
          return orgList.data;
        });
      }
    },
    scorecardLevels() {
      let facility = this.definedScorecardLevels.find((o) =>
        o.displayName.toLowerCase().includes("facility")
      );
      if (facility) {
        this.facilityLevelID = facility.level;
      } else {
        let facilityLevels = this.definedScorecardLevels.map((o) => o.level);
        this.facilityLevelID = Math.max(...facilityLevels);
      }
      let list = [];
      this.definedScorecardLevels.forEach((levels) => {
        if (
          this.facilityLevelID == levels.level &&
          !this.selectedScorecardLevels.includes(levels.level)
        ) {
          this.selectedScorecardLevels.push(levels.level);
        }
        list.push({
          label: levels.displayName,
          id: levels.level,
          isDisabled: true,
        });
      });
      if (
        this.locationPeriod?.locationList.length > 0 &&
        this.selectedScorecardLevels
      ) {
        this.updatedOrgList = this.newLocList(
          JSON.parse(JSON.stringify(this.locationPeriod.locationList))
        );
      }
      return list;
    },
    showCharts() {
      return this.configData && this.isChildFetched;
    },
    dhsColor() {
      return this.staticColors["dhsColor"];
    },
    emuColor() {
      return this.staticColors["emuColor"];
    },
    dynamicCols() {
      let cols = 12;
      if (this.scoreBox.length === 2 || this.scoreBox.length === 4) {
        cols = 6;
      }
      if (this.scoreBox.length === 3) {
        cols = 4;
      }
      return cols;
    },
    getHeight() {
      let h = 125;
      if (this.scoreBox.length) {
        let el = document.getElementsByClassName("complete-list");
        for (let i = 0; i < el.length; i++) {
          let ht = el[i].clientHeight;
          h = ht > h ? ht : h;
        }
      }
      return h;
    },
    scorecardItemsFiltered: function () {
      let filteredData = this.scorecardItems.length
        ? this.scorecardItems.filter(
            (s) =>
              s[this.$i18n.t("location")]
                ?.toLowerCase()
                .includes(this.scorecardSearch?.toLowerCase()) ||
              s[this.$i18n.t("parent")]
                ?.toLowerCase()
                .includes(this.scorecardSearch?.toLowerCase())
          )
        : [];
      return filteredData;
    },
    tabList() {
      let activeTab = this.$store.getters.getActiveTab;
      let tab = this.sideMenu
        ? this.sideMenu.find((s) => s.group === activeTab.split("-")[0])
        : null;
      let tabs = tab ? tab.subTabs : [];
      let tabList = [];
      if (tabs.length) {
        tabs.forEach((c) => {
          let obj = {
            id: c.tabName,
            label: c.tabName,
            children: [],
          };
          c.subTabs.forEach((s) => {
            obj.children.push({
              id: `${activeTab.split("-")[0]}-${activeTab.split("-")[1]}-${
                c.id
              }-${s.id}`,
              label: s.tabName,
            });
          });
          tabList.push(obj);
        });
      }
      return tabList;
    },
    countDistribution() {
      let activeTab = this.$store.getters.getActiveTab;
      let tab = this.sideMenu
        ? this.sideMenu.find((s) => s.group === activeTab.split("-")[0])
        : null;
      let tabs = tab ? tab.subTabs : [];
      let count = {};
      if (tabs.length) {
        tabs.forEach((c) => {
          count[c.tabName] = {};
          c.subTabs.forEach((s) => {
            count[c.tabName][s.tabName] = [];
            let data = this.signOffForms.filter(
              (t) =>
                t.signOffTab ===
                `${activeTab.split("-")[0]}-${activeTab.split("-")[1]}-${
                  c.id
                }-${s.id}`
            );
            if (data.length) {
              data.forEach((d) => {
                let t = d.iconColorClass.split("-")[0];
                let dotDetails = {
                  title: this.$i18n.t(`${t}`),
                  color: d.iconColorClass,
                  count: 1,
                };
                let catDetails = count[c.tabName][s.tabName];
                let foundIndex = catDetails.findIndex(
                  (c) => c.title === this.$i18n.t(`${t}`)
                );
                if (foundIndex >= 0) {
                  let updatedDotDetails = {
                    ...catDetails[foundIndex],
                    count: catDetails[foundIndex].count * 1 + 1,
                  };
                  catDetails[foundIndex] = updatedDotDetails;
                } else {
                  catDetails.push(dotDetails);
                }
              });
            }
          });
        });
      }
      return count;
    },
    scoreBox() {
      let activeTab = this.$store.getters.getActiveTab;
      let tab = this.sideMenu
        ? this.sideMenu.find((s) => s.group === activeTab.split("-")[0])
        : null;
      let box = tab ? tab.subTabs : [];
      if (box.length) {
        let innerBox = [];
        box.forEach((b) => {
          let isSubTabs = b.subTabs.filter((st) => st.isSummary);
          if (isSubTabs.length) {
            innerBox.push(b);
          }
        });
        box = innerBox.map((b) => ({
          ...b,
          subTabs: b.subTabs
            .filter((st) => st.isSummary)
            .map((st) => {
              let isFound = this.scores.findIndex((s) => s.id === st.id);
              st.navLink = `${tab.group}-${tab.id}-${b.id}-${st.id}`;
              if (isFound >= 0) {
                st = {
                  ...st,
                  scoreDetails: this.scores[isFound],
                };
              }
              return st;
            }),
        }));
      }
      this.$refs?.printPDF ? this.getDQRImg(): '';
      return box;
    },
    scoreTabID() {
      let ids = [];
      this.scoreBox.forEach((s) => {
        s.subTabs.forEach((s) => {
          ids.push({ id: s.id, tabName: s.tabName });
        });
      });

      return ids;
    },
    selectedDate() {
      if (this.locationPeriod.periodType === "financialYear") {
        let pYear = this.locationPeriod.period.substring(0, 4);
        let currPeriod = `${pYear}April`;
        return translateDate({
          rawDate: currPeriod,
          periodType: this.locationPeriod.periodType,
        });
      } else if (this.locationPeriod.periodType === "financialYearJuly") {
        let pYear = rawDate.substring(0, 4);
        currPeriod = `${pYear}July`;
        return translateDate({
          rawDate: currPeriod,
          periodType: this.locationPeriod.periodType,
        });
      } else {
        return translateDate({
          rawDate: this.locationPeriod.period,
          periodType: this.locationPeriod.periodType,
          monthlyFormat: "MMMM YYYY",
        });
      }
    },
    qualityScore() {
      let score = 0;
      this.scores.forEach((s) => {
        if (s.score === 1) {
          score++;
        }
      });
      return score;
    },
    totalScores() {
      let score = 0;
      this.scoreBox.forEach((s) => {
        score = score + s.subTabs.length;
      });
      return score;
    },
    locationFetchedPercent() {
      let per = 0;
      if (
        this.scorecardDetails.length > 0 &&
        this.selectedScorecardLocations.length >= 0
      ) {
        per = Math.round(
          (this.scorecardDetails.length /
            this.selectedScorecardLocations.length) *
            100
        );
      }
      return per;
    },
    signOffData() {
      let id = this.$store.getters.getActiveTab.split("-");
      let data =
        this.configData &&
        this.configData.subTabs &&
        this.configData.subTabs.length
          ? this.configData.subTabs.find((c) => c.id === id[3])
          : null;
      return data ? JSON.parse(JSON.stringify(data)) : {};
    },
    signOffForms() {
      let forms = [];
      if (this.configData) {
        this.configData.subTabs.forEach((f) => {
          let tabs = this.tabSelected.length
            ? f.signOff.filter((t) => this.tabSelected.includes(t.signOffTab))
            : f.signOff;
          tabs = this.userSelected.length
            ? tabs.filter((u) => this.userSelected.includes(u.userDetails.id))
            : tabs;
          forms = forms.concat(tabs);
        });
      }
      forms.sort((a, b) => {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return (
          this.$moment(b.updatedAt, "MMMM Do YYYY, h:mm:ss a").valueOf() -
          this.$moment(a.updatedAt, "MMMM Do YYYY, h:mm:ss a").valueOf()
        );
      });
      return forms;
    },
  },
  watch: {
    facilityLevelScorecard(newValue) {
      if (!newValue) {
        // this.selectedFacilityOrg = [];
        // this.getFacilityTableData = [];
        this.selectedFacilities = [];
      } else {
        this.selectedScorecardLocations = [];
      }
    },
    selectedFacilityOrg: {
      async handler(newvalue) {
        if (newvalue.length) {
          this.getFacilityTableData = await this.getTableOrgData();
        } else {
          this.getFacilityTableData = [];
          this.selectedScorecardLocations = [];
        }
      },
      deep: true,
    },
    "$store.getters.getTheme": function (){
      this.$refs?.printPDF ? this.getDQRImg(): '';
    },
    totalScores(newValue) {
      this.chartConfig.yAxis.max = newValue;
      this.chartConfig.yAxis.tickPositioner = function () {
        return [this.min, this.max];
      };
    },
    qualityScore(newValue) {
      this.chartConfig.series[0].data[0].y = newValue;
    },
    signOffForms: {
      handler(newValue) {
        this.dsl = this.dsl.map((d) => ({
          ...d,
          count: null,
        }));
        this.signOffForm = [];
        this.updateForm = null;
        if (newValue.length) {
          let form = newValue[0];
          this.signOffForm = form.signOffForm;
          this.updateForm = JSON.parse(JSON.stringify(form));
          this.dsl = this.dsl.map((d) => {
            let count = 0;
            newValue.forEach((n) => {
              if (n.iconColorClass === `${d.class}-text`) {
                count++;
              }
            });
            return {
              ...d,
              count: count > 0 ? count : null,
            };
          });
          newValue.forEach((s) => {
            let newUser = this.userList.find((u) => u.id === s.userDetails.id);
            if (!newUser) {
              this.userList.push({
                label: `${s.userDetails.firstName} ${s.userDetails.surname}`,
                id: s.userDetails.id,
              });
            }
          });
        }
      },
      deep: true,
    },
    selectedData: {
      handler(newValue) {
        this.scores = [];
        this.configData = newValue;
      },
      deep: true,
    },
    locationPeriod: {
      handler(newValue, oldValue) {
        if (
          oldValue &&
          (newValue.location !== oldValue.location ||
            newValue.periodType !== oldValue.periodType ||
            newValue.period !== oldValue.period)
        ) {
          this.scores = [];
          if (this.$store.getters.getActiveTab && !this.reportChartData) {
            this.getScorecard();
          }
          this.isChildFetched = false;
          this.setScorecardLocations();
        }
      },
      deep: true,
    },
    async locationScores(newValue) {
      if (newValue.length === this.totalScores && !this.isScorecardCancel) {
        let periodValue = formatSingleDate({
          rawDate: this.locationPeriod.period,
          periodType: this.locationPeriod.periodType,
        });
        let scorecardCreatedOn = this.$moment().format("L");
        let isFound = this.scorecardDetails.findIndex(
          (s) => s.id === this.scorecardLocation && s.period === periodValue
        );
        let { locName, parent } = await this.getLocation(
          this.scorecardLocation.split("/")[1]
        );
        let obj = {
          parent,
          name: locName,
          period: periodValue,
          id: this.scorecardLocation,
          createdOn: scorecardCreatedOn,
          score: JSON.parse(JSON.stringify(newValue)),
        };
        if (isFound >= 0) {
          this.scorecardDetails[isFound] = obj;
        } else {
          this.scorecardDetails.push(obj);
        }

        this.locationScores = [];
        let locIndex = this.scorecardDetails.length;
        if (
          locIndex < this.selectedScorecardLocations.length &&
          this.selectedScorecardLocations.length > 0
        ) {
          this.scorecardLocation = this.selectedScorecardLocations[locIndex];
        }
        if (
          locIndex === this.selectedScorecardLocations.length &&
          this.selectedScorecardLocations.length > 0
        ) {
          this.updateScorecard(periodValue);
        }
      }
    },
    "$store.getters.getActiveTab": function () {
      if (this.$store.getters.getActiveTab && !this.reportChartData) {
        this.getScorecard();
      }
    },
    configDataDQR: {
      immediate: true,
      handler(newVal) {
        this.configDQR = newVal;
      },
    },
  },
  methods: {
    newLocList(orgList) {
      let list = [];
      let levelAllowed =
        this.$store.getters.getAppSettings.allowFacilityScorecardLevel * 1 || 2;
      list = orgList.map((loc) => {
        if (loc.level < this.facilityLevelID * 1 - levelAllowed) {
          loc.isDisabled = true;
        } else {
          loc.isDisabled = false;
        }
        if (loc.children) {
          loc.children = this.newLocList(loc.children);
        }
        return loc;
      });
      return list;
    },
    onRowSelected(items) {
      if (items.length > 0) {
        this.selectedFacilities = items;
        //this.selected = items;
        items.forEach((lt) => {
          if (!this.selectedScorecardLocations.includes(lt.id))
            this.selectedScorecardLocations.push(lt.id);
        });
      } else {
        this.selectedScorecardLocations = [];
      }
    },
    // selectThirdRow() {
    //   // Rows are indexed from 0, so the third row is index 2
    //   this.$refs.selectableTable.selectRow(2);
    // },
    // unselectThirdRow() {
    //   // Rows are indexed from 0, so the third row is index 2
    //   this.$refs.selectableTable.unselectRow(2);
    // },
    selectAllRows() {
      this.$refs.selectableTable.selectAllRows();
    },
    clearSelected() {
      this.$refs.selectableTable.clearSelected();
      this.selectedScorecardLocations = [];
    },
    async getTableOrgData() {
      let orgData = [];

      let gSetting = this.$store.getters.getGlobalFactors();
      let des = null;
      if (
        gSetting.globalMappings &&
        gSetting.globalMappings.mappings &&
        gSetting.globalMappings.mappings.length
      ) {
        for (let map in gSetting.globalMappings.mappings) {
          let mappingData = gSetting.globalMappings.mappings[map];
          for (let innerMap in mappingData["mapping"]) {
            let innerMapData =
              gSetting.globalMappings.mappings[map]["mapping"][innerMap][
                "indicator"
              ]["subIndicator"];
            if (innerMapData[0] && innerMapData[0]["selectedDE"].length > 0) {
              des = innerMapData[0]["selectedDE"][0]["id"];
              break;
            }
          }
          if (des != null) break;
        }
      }
      let requiredLocs = [];
      requiredLocs = this.selectedFacilityOrg.map((org) => org.split("/")[1]);
      requiredLocs.push("LEVEL-" + this.facilityLevelID);
      await service
        .getAnalyticalIndicatorData(
          des,
          requiredLocs.join(";"),
          this.locationPeriod.period.split("-").join(""),
          false,
          true
        )
        .then((response) => {
          if (response?.data?.metaData["dimensions"]["ou"]) {
            let ouList = response?.data?.metaData["dimensions"]["ou"];
            ouList.forEach(async (lt) => {
              let locDetails = "";
              locDetails = await this.getLocation(lt);
              this.$nextTick(() => {
                orgData.push({
                  [this.$i18n.t("name")]:
                    response?.data?.metaData["items"][lt]["name"],
                  id: this.facilityLevelID + "/" + lt,
                  [this.$i18n.t("level")]: this.facilityLevelID,
                  [this.$i18n.t("parent")]: locDetails?.parent?.name,
                });
              });
            });

            // });
          }
        });

      return orgData;
    },
    // async getSelected(value, instanceId) {
    //   let facilityLevelID = -1;
    //   let levels = this.$store.getters.getOrgLevels;
    //   let facility = levels.find((o) =>
    //     o.displayName.toLowerCase().includes("facility")
    //   );
    //   if (facility) {
    //     facilityLevelID = facility.level;
    //   } else {
    //     let facilityLevels = levels.map((o) => o.level);
    //     facilityLevelID = Math.max(...facilityLevels);
    //   }
    //   let upperLevel = facilityLevelID * 1 - 1;
    //   let children = [];
    //   //newValue.forEach(async (loction) => {
    //   let location = value.id;
    //   if (!this.selectedScorecardLocations.includes(location))
    //     this.selectedScorecardLocations.push(location);
    //   if (location.split("/")[0] == upperLevel) {
    //     //console.log("One level up facility level selected");
    //     if (this.preFetchData?.orgList?.length) {
    //       children = getChild({
    //         locationList: this.preFetchData.orgList,
    //         location: location.split("/")[1],
    //       });
    //       children = children.map((c) => {
    //         return {
    //           ...c,
    //           id: `${c.level}/${c.id}`,
    //         };
    //       });
    //     } else {
    //       try {
    //         let response = await service.getChildOrganisation(
    //           location.split("/")[1]
    //         );
    //         children = response?.data?.children || [];
    //       } catch (err) {
    //         console.log("err", err);
    //       }
    //     }
    //     // console.log(children, "children");
    //     if (children.length) {
    //       children.forEach((obj) => {
    //         if (!this.selectedScorecardLocations.includes(obj.id))
    //           this.selectedScorecardLocations.push(obj.id);
    //       });
    //       //this.childArr = children;
    //       //this.isChildFetched = true;
    //     } else {
    //       //this.childArr = [];
    //       //this.isChildFetched = true;
    //     }
    //   }
    //   //});
    // },
    // async getDeSelected(value, instanceId) {
    //   let facilityLevelID = -1;
    //   let levels = this.$store.getters.getOrgLevels;
    //   let facility = levels.find((o) =>
    //     o.displayName.toLowerCase().includes("facility")
    //   );
    //   if (facility) {
    //     facilityLevelID = facility.level;
    //   } else {
    //     let facilityLevels = levels.map((o) => o.level);
    //     facilityLevelID = Math.max(...facilityLevels);
    //   }
    //   let upperLevel = facilityLevelID * 1 - 1;
    //   let children = [];
    //   //newValue.forEach(async (loction) => {
    //   let location = value.id;
    //   if (this.selectedScorecardLocations.includes(location))
    //     this.selectedScorecardLocations.splice(
    //       this.selectedScorecardLocations.indexOf(location),
    //       1
    //     );
    //   if (location.split("/")[0] == upperLevel) {
    //     //console.log("One level up facility level selected");
    //     if (this.preFetchData?.orgList?.length) {
    //       children = getChild({
    //         locationList: this.preFetchData.orgList,
    //         location: location.split("/")[1],
    //       });
    //       children = children.map((c) => {
    //         return {
    //           ...c,
    //           id: `${c.level}/${c.id}`,
    //         };
    //       });
    //     } else {
    //       try {
    //         let response = await service.getChildOrganisation(
    //           location.split("/")[1]
    //         );
    //         children = response?.data?.children || [];
    //       } catch (err) {
    //         console.log("err", err);
    //       }
    //     }
    //     if (children.length) {
    //       children.forEach((obj) => {
    //         if (this.selectedScorecardLocations.includes(obj.id))
    //           this.selectedScorecardLocations.splice(
    //             this.selectedScorecardLocations.indexOf(obj.id),
    //             1
    //           );
    //         //this.selectedScorecardLocations.push(obj.id);
    //       });
    //       //this.childArr = children;
    //       //this.isChildFetched = true;
    //     } else {
    //       //this.childArr = [];
    //       //this.isChildFetched = true;
    //     }
    //   }
    // },
    updateToolBar(updatedVal) {
      this.$emit("updateToolBar", updatedVal);
    },
    setExtData(level, obj) {
      this.allExtData[level] = obj;
    },
    async getLocation(location) {
      let locName = "",
        parent = "";
      let loc = getOrg({
        locationList: this.locationPeriod.locationList,
        location: location,
      });

      if (loc) {
        locName = loc;
        parent = getParent({
          locationList: this.locationPeriod.locationList,
          location: location,
        });
      } else if (this.preFetchData?.orgList?.length > 0) {
        let newLoc = getOrg({
          locationList: this.preFetchData.orgList,
          location: location,
          isFlat: true,
        });
        if (newLoc) {
          locName = newLoc;
          parent = getParent({
            locationList: this.preFetchData.orgList,
            location: location,
          });
        } else {
          try {
            let orgData = await service.getIndividualOrganisation(
              location,
              false,
              true
            );
            locName = orgData.data?.displayName || "";
            parent = {
              name: orgData.data?.parent?.displayName,
              id: orgData.data?.parent?.id,
            };
          } catch (err) {
            console.log("Error in fetching location...");
          }
        }
      }
      return { locName, parent };
    },
    setReportChart(obj) {
      this.$emit("setReportChart", obj);
    },
    updateSignOffForm({ form }) {
      this.signOffForm = form.signOffForm;
      this.updateForm = JSON.parse(JSON.stringify(form));
    },
    updatedConfig(configData) {
      this.$emit("updatedConfig", configData);
    },
    updateScorecard(periodValue) {
      // We call this method when we have all the locationScores are in hand and the locationScore is set in the scoredDetails as an array. After that the same data is pushed to ScorecareData Array to filter currentData from that. After that we call the setScorecard method.
      let key = this.generateKey("dqrScorecard");
      service
        .getSavedConfig({ tableKey: key })
        .then((res) => {
          let scorecardData = res.data;
          if (!scorecardData[this.$store.getters.getActiveTab.split("-")[0]]) {
            scorecardData[this.$store.getters.getActiveTab.split("-")[0]] = [];
          }
          this.scorecardDetails.forEach((sd) => {
            let isFound = scorecardData[
              this.$store.getters.getActiveTab.split("-")[0]
            ].findIndex((s) => s.id === sd.id && s.period === sd.period);
            if (isFound >= 0) {
              scorecardData[this.$store.getters.getActiveTab.split("-")[0]][
                isFound
              ] = sd;
            } else {
              scorecardData[
                this.$store.getters.getActiveTab.split("-")[0]
              ].push(sd);
            }
          });
          let response = service.updateConfig({
            data: scorecardData,
            tableKey: key,
          });
          response
            .then((response) => {
              if (response.data.status === "OK") {
                this.scorecardData = scorecardData;
                this.currentScorecard = scorecardData[
                  this.$store.getters.getActiveTab.split("-")[0]
                ].filter((s) => s.period === periodValue);
                this.setScorecard();
                this.resetBackgroundSetting("update", true);
                this.selectedScorecardLocations = [];
              } else {
                console.log("Scorecard Saving Failed!");
                return;
              }
            })
            .catch(() => {
              console.log("Scorecard Saving Failed!");
            });
        })
        .catch(() => {
          let scorecardData = {
            [this.$store.getters.getActiveTab.split("-")[0]]:
              this.scorecardDetails,
          };
          let response = service.saveConfig({
            data: scorecardData,
            tableKey: key,
          });
          response.then((response) => {
            if (response.data.status === "OK") {
              this.currentScorecard = this.scorecardDetails.filter(
                (s) => s.period === periodValue
              );
              this.setScorecard();
              this.resetBackgroundSetting("update", true);
              this.selectedScorecardLocations = [];
            } else {
              console.log("Scorecard Saving Failed!");
              return;
            }
          });
        });
    },
    generateTable(scorecardDetails) {
      this.scorecardFields = [];
      this.scorecardItems = [];
      this.scorecardItemsDownload = [];
      this.scorecardFields = [
        {
          key: this.$i18n.t("location"),
          sortable: true,
          isRowHeader: true,
        },
        {
          key: this.$i18n.t("parent"),
          sortable: true,
          isRowHeader: true,
        },
        {
          key: this.$i18n.t("dqrScore"),
          sortable: true,
          isRowHeader: true,
        },
        {
          key: this.$i18n.t("scorecardPeriod"),
          sortable: true,
          isRowHeader: true,
        },
        {
          key: this.$i18n.t("scorecardGeneratedOn"),
          sortable: true,
          isRowHeader: true,
        },
        {
          key: "show_details",
          label: this.$i18n.t("viewMore"),
        },
      ];
      console.log("scoreTabID", this.scoreTabID);
      scorecardDetails.forEach((s) => {
        let innerItem = {
            [this.$i18n.t("location")]: excludeName(s.name),
            [this.$i18n.t("scorecardPeriod")]: translateDate({
              rawDate: this.locationPeriod.period,
              periodType: this.locationPeriod.periodType,
              monthlyFormat: "MMMM YYYY",
            }),
            [this.$i18n.t("parent")]: excludeName(s.parent?.name || "-"),
            scoreDetails: [],
            _cellVariants: {},
          },
          innerItemDownload = {
            [this.$i18n.t("group")]:
              this.$store.getters.getActiveTab.split("-")[0],
            [this.$i18n.t("location")]: excludeName(s.name),
            [this.$i18n.t("period")]: s.period,
            [this.$i18n.t("parent")]: excludeName(s.parent?.name || "-"),
          };
        let positiveScore = 0,
          totalScore = 0,
          sDetails = {};
        this.scoreTabID.forEach((tab) => {
          let isTab = s.score.find((t) => t.id === tab.id);
          if (isTab) {
            let innerScore = isTab.score;
            let keyName = tab.tabName;
            totalScore += 1;
            if (innerScore) {
              sDetails[keyName] = 1;
              innerItemDownload[keyName] = 1;
              sDetails["_cellVariants"] = {
                ...sDetails["_cellVariants"],
                [keyName]: "success",
              };
              positiveScore += 1;
            } else {
              sDetails[keyName] = 0;
              innerItemDownload[keyName] = 0;
              sDetails["_cellVariants"] = {
                ...sDetails["_cellVariants"],
                [keyName]: "danger",
              };
            }
          }
        });

        innerItem.scoreDetails.push(sDetails);
        innerItem[this.$i18n.t("dqrScore")] = `${positiveScore}/${totalScore}`;
        innerItem[this.$i18n.t("scorecardGeneratedOn")] = this.$moment(
          s.createdOn
        ).format("ll");
        innerItemDownload[
          this.$i18n.t("dqrScore")
        ] = `${positiveScore} ${this.$i18n.t("outOf")} ${totalScore}`;
        innerItemDownload[this.$i18n.t("scorecardGeneratedOn")] = this.$moment(
          s.createdOn
        ).format("ll");
        this.scorecardItems.push(innerItem);
        this.scorecardItems.sort((a, b) => {
          var textA = a[this.$i18n.t("parent")].toUpperCase();
          var textB = b[this.$i18n.t("parent")].toUpperCase();
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
        this.scorecardItemsDownload.push(innerItemDownload);
        this.scorecardItemsDownload.sort((a, b) => {
          var textA = a[this.$i18n.t("parent")].toUpperCase();
          var textB = b[this.$i18n.t("parent")].toUpperCase();
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
      });
      console.log("scorecardItems", this.scorecardItems);
    },
    getScorecard() {
      this.scorecardGenerated = false;
      let periodValue = formatSingleDate({
        rawDate: this.locationPeriod.period,
        periodType: this.locationPeriod.periodType,
      });
      let group = this.$store.getters.getActiveTab.split("-")[0];
      if (
        this.scorecardData &&
        this.scorecardData[group] &&
        this.scorecardData[group].length
      ) {
        this.currentScorecard = this.scorecardData[group].filter(
          (s) => s.period === periodValue
        );
        this.setScorecard();
      } else {
        this.scorecardsFetching = true;
        let key = this.generateKey("dqrScorecard");
        service
          .getSavedConfig({ tableKey: key })
          .then((res) => {
            this.scorecardData = res.data;
            this.scorecardsFetching = false;
            if (
              this.scorecardData &&
              this.scorecardData[group] &&
              this.scorecardData[group].length
            ) {
              this.currentScorecard = this.scorecardData[group].filter(
                (s) => s.period === periodValue
              );
              this.setScorecard();
            } else {
              this.currentScorecard = [];
            }
          })
          .catch(() => {
            this.currentScorecard = [];
            this.scorecardsFetching = false;
            console.log("Scorecard Not Found!");
          });
      }
    },
    setScorecard() {
      console.log("currentScorecard", this.currentScorecard);
      if (this.currentScorecard.length) {
        this.scorecardGenerated = true;
        this.generateTable(this.currentScorecard);
      }
    },
    // setScorecard() {
    //   let isFound = false
    //   if (this.currentScorecard.length) {
    //     console.log('this.currentScorecard',this.currentScorecard);
    //     this.currentScorecard.forEach((item) => {
    //       if(item.id == this.locationPeriod.location){
    //         isFound = true;
    //       }
    //     })
    //     this.generateTable(this.currentScorecard);
    //   }
    //   if(isFound){
    //     this.scorecardGenerated = true
    //   }
    // },
    summaryData(data) {
      let scoreKey = data.scorecardLocation ? "locationScores" : "scores";
      let isFound = this[scoreKey].findIndex((s) => s.id === data.id);
      if (isFound >= 0) {
        this[scoreKey][isFound] = data;
      } else {
        this[scoreKey].push(data);
      }
    },
    async setScorecardLocations() {
      let children = [];
      if (this.preFetchData?.orgList?.length) {
        children = getChild({
          locationList: this.preFetchData.orgList,
          location: this.locationPeriod.location.split("/")[1],
        });
        children = children.map((c) => {
          return {
            ...c,
            id: `${c.level}/${c.id}`,
          };
        });
      } else {
        try {
          let response = await service.getChildOrganisation(
            this.locationPeriod.location.split("/")[1]
          );
          children = response?.data?.children || [];
        } catch (err) {
          console.log("err", err);
        }
      }
      if (children.length) {
        this.childArr = children;
        this.isChildFetched = true;
      } else {
        this.childArr = [];
        this.isChildFetched = true;
      }
    },
    generateScorePopup() {
      if (!this.scorecardDataFetching) {
        this.selectedScorecardLocations = [];
        this.generateScorecardPopup = true;
        this.currentPage = 1;
      }
    },
    async generateScore(isReset = false) {
      this.showScorecard = false;
      this.isScorecardCancel = false;
      this.scorecardDataFetching = true;
      this.generateScorecardPopup = false;
      let locIndex = this.scorecardDetails.length;
      if (
        locIndex < this.selectedScorecardLocations.length &&
        this.selectedScorecardLocations.length > 0
      ) {
        this.scorecardLocation = this.selectedScorecardLocations[locIndex];
        if (isReset) {
          this.resetBackgroundSetting("regenerate");
        }
      } else {
        if (isReset) {
          this.resetBackgroundSetting("noLocationReset");
        } else {
          this.resetBackgroundSetting("noLocation");
        }
        if (this.selectedScorecardLocations.length === 0) {
          this.sweetAlert({
            title: this.$i18n.t("oops"),
            text: this.$i18n.t("errorInfo"),
          });
        }
      }
    },
    resetBackgroundSetting(type, scorecardGenerated = false) {
      if (
        type === "cancel" ||
        type === "filterChange" ||
        type === "noLocation" ||
        type === "noLocationReset" ||
        type === "update"
      ) {
        this.locationScores = [];
        this.scorecardDetails = [];
        this.scorecardLocation = "";
        this.scorecardDataFetching = false;
      }
      if (
        type === "cancel" ||
        type === "regenerate" ||
        type === "filterChange" ||
        type === "noLocation"
      ) {
        this.showScorecard = false;
        this.isScorecardCancel = false;
        this.scorecardGenerated = scorecardGenerated;
        if (!scorecardGenerated) {
          this.scorecardDetails = [];
          this.scorecardItems = [];
          this.scorecardFields = [];
        }
      }
    },
    cancelScorecard() {
      this.$swal({
        title: this.$i18n.t("areyousure"),
        text: this.$i18n.t("youablerevertthis"),
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: this.$i18n.t("ok"),
        cancelButtonText: this.$i18n.t("cancelbtn"),
      }).then((result) => {
        if (result.value) {
          this.isScorecardCancel = true;
          this.selectedScorecardLocations = [];
          this.resetBackgroundSetting("cancel");
          this.setScorecard();
        }
      });
    },
    viewScorecard() {
      this.showScorecard = true;
      this.scorecardSearch = "";
      this.selectedScorecardLocations = [];
      this.facilityLevelScorecard = false;
    },
    methodFilterVal() {},
    yearVal() {},
  },
  created() {
    this.userDetails = this.$store.getters.getUserDetails;

    if (!this.reportChartData) {
      this.appResponse = this.$store.getters.getApplicationModule(
        this.$store.getters.getIsMultiProgram
      );
      this.globalResponse = this.$store.getters.getGlobalFactors();
      this.debugging = this.appResponse.debugging
        ? this.appResponse.debugging
        : false;
      this.debuggingLevel = this.appResponse.debuggingLevel
        ? this.appResponse.debuggingLevel
        : "API";
    }
  },
};
</script>

<style lang="scss" scoped>
.before {
  page-break-before: always !important;
}
.after {
  page-break-after: always !important;
  page-break-inside: avoid !important;
}
.loaderBackground {
  position: absolute;
  top: 2px;
  left: 7px;
  border: 16px solid rgba(255, 255, 255, 0.2); /* Light grey */
  border-top: 16px solid rgba(255, 255, 255, 0.53); /* Blue */
  border-radius: 50%;
  width: 10px;
  height: 10px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.spin-enter {
  opacity: 0.35;
  transform: rotate(720deg);
}

.spin-enter-active {
  transition: transform 0.75s ease-in-out, opacity 0.5s;
}
</style>
