<template>
  <div class="row mt-3 mb-4">
    <div class="col">
      <div class="card">
        <div
          class="
            card-header
            color-black
            text-uppercase
            f-s-0-875rem
            font-weight-bold
          "
        >
          {{ $t("derivedChartsSetting") }}
        </div>
        <div class="card-body border indicator-border">
          <div class="mb-3" v-for="(derived, ind) in configData.derivedCharts" :key="ind">
            <div class="card-header p-5px">
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
                  v-b-toggle="
                    'collapseChartSettings' + chartBySubtype + chartByType + ind
                  "
                >
                  {{ derived.chartOptions.chartName }}
                </button>
              </h2>
            </div>
            <b-collapse
              class="border border-b-l-radius-10px border-b-r-radius-10px"
              :id="'collapseChartSettings' + chartBySubtype + chartByType + ind"
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
                        <label class="col-sm-5 col-lg-6 col-form-label">{{
                          $t("chartHeading")
                        }}</label>
                        <div class="col-sm-7 col-lg-6">
                          <b-form-textarea
                            v-model="derived.chartOptions.chartName"
                            :state="
                              derived.chartOptions.chartName.length !== 0 &&
                              derived.chartOptions.chartName.length <=
                                chartTitleMaxLength
                            "
                            placeholder=""
                            rows="3"
                            :maxlength="chartTitleMaxLength"
                          ></b-form-textarea>
                          <span class="small"
                            >{{ derived.chartOptions.chartName.length }}/{{
                              chartTitleMaxLength
                            }}</span
                          >
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
                          >{{ $t("chart_subtitle") }}</label
                        >
                        <div class="col-sm-2 pr-0">
                          <b-form-checkbox
                            checked="chartSubTitleVisible"
                            v-model="derived.chartOptions.subTitle.visible"
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
                              v-model="derived.chartOptions.subTitle.text"
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
                    <div class="col-12">
                      <div class="form-group row">
                        <label
                          for="inputChartSource"
                          class="col-sm-5 col-lg-6 col-form-label"
                          >{{ $t("chartInformation") }}</label
                        >
                        <div class="col-sm-7 col-lg-6">
                          <b-form-textarea
                            id="inputChartInfoDerived"
                            v-model="derived.chartOptions.chartInfo"
                            :state="
                              derived.chartOptions.chartInfo.length !== 0 &&
                              derived.chartOptions.chartInfo.length <=
                                chartInfoMaxLength
                            "
                            :placeholder="chartInfoPlaceholder"
                            rows="3"
                            :maxlength="chartInfoMaxLength"
                          ></b-form-textarea>
                          <span class="small"
                            >{{ derived.chartOptions.chartInfo.length }}/{{
                              chartInfoMaxLength
                            }}</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </b-collapse>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: [
    "configData",
    "chartBySubtype",
    "chartByType",
    "chartInfoMaxLength",
    "chartTitleMaxLength",
    "chartInfoPlaceholder",
  ],
};
</script>