<template>
  <div>
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
         
          v-b-toggle="'collapseChartSettings' + chartBySubtype + chartByType"
        >
          {{ $t("addChartSettings") }}
        </button>
      </h2>
    </div>
    <b-collapse
      class="border border-b-l-radius-10px border-b-r-radius-10px"
      :id="'collapseChartSettings' + chartBySubtype + chartByType"
    >
      <div class="row m-0 mt-4 mb-2">
        <div class="col-lg-6">
          <div class="form-group row">
            <label class="col-sm-5 col-form-label"
              >{{ $t("chart") }} {{ $t("type") }}</label
            >
            <div class="col-sm-7">
              <div class="select-wrapper">
                <select
                  class="form-control"
                  v-model="configData.chartOptions.chart.type"
                >
                  <option value="Column">
                    {{ $t("column") }}
                  </option>
                  <option v-if="chartByType !== 'coverage'" value="Line">
                    {{ $t("line") }}
                  </option>
                  <option v-if="chartByType !== 'coverage'" value="Area">
                    {{ $t("area") }}
                  </option>
                  <option v-if="chartByType === 'coverage'" value="Stack">
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
                checked="configData.chartOptions.title.visible"
                v-model="configData.chartOptions.title.visible"
                name="someSwitchOptionTitle"
                switch
                size="lg"
                class="mt-1"
              />
            </div>
            <transition name="slide-fade">
              <div
                class="col-sm-5 pl-0"
                v-if="configData.chartOptions.title.visible"
              >
                <input
                  type="text"
                  class="form-control"
                  placeholder=""
                  v-model="configData.chartOptions.title.title"
                />
              </div>
            </transition>
          </div>
          <div class="form-group row">
            <label for="inputChartSubtitle" class="col-sm-5 col-form-label">{{
              $t("chart_subtitle")
            }}</label>
            <div class="col-sm-2 pr-0">
              <b-form-checkbox
                checked="configData.chartOptions.subTitle.visible"
                v-model="configData.chartOptions.subTitle.visible"
                name="someSwitchOptionSubtitle"
                switch
                size="lg"
                class="mt-1"
              />
            </div>
            <transition name="slide-fade">
              <div
                class="col-sm-5 pl-0"
                v-if="configData.chartOptions.subTitle.visible"
              >
                <input
                  type="text"
                  class="form-control"
                  id="inputChartSubtitle"
                  :placeholder="$t('chart_subtitle')"
                  v-model="configData.chartOptions.subTitle.subTitle"
                />
              </div>
            </transition>
          </div>
          <div class="form-group row">
            <label for="inputChartSource" class="col-sm-5 col-form-label">
              {{ $t("source") }}</label
            >
            <div class="col-sm-7">
              <input
                type="text"
                class="form-control"
                id="inputChartSource"
                :placeholder="$t('chart_source')"
                v-model="configData.chartOptions.chartDataSource.text"
              />
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group row">
            <label class="col-sm-5 col-form-label">{{ $t("x-axis") }}</label>
            <div class="col-sm-2 pr-0">
              <b-form-checkbox
                checked="configData.chartOptions.xAxis.visible"
                v-model="configData.chartOptions.xAxis.visible"
                name="someSwitchOptionXAxis"
                switch
                size="lg"
                class="mt-1"
              />
            </div>
            <transition name="slide-fade">
              <div
                class="col-sm-5 pl-0"
                v-if="configData.chartOptions.xAxis.visible"
              >
                <input
                  type="text"
                  class="form-control"
                  placeholder=""
                  v-model="configData.chartOptions.xAxis.title.text"
                />
              </div>
            </transition>
          </div>
          <div class="form-group row">
            <label class="col-sm-5 col-form-label">{{ $t("y-axis") }}</label>
            <div class="col-sm-2 pr-0">
              <b-form-checkbox
                checked="configData.chartOptions.yAxis.visible"
                v-model="configData.chartOptions.yAxis.visible"
                name="someSwitchOptionYAxis"
                switch
                size="lg"
                class="mt-1"
              />
            </div>
            <transition name="slide-fade">
              <div
                class="col-sm-5 pl-0"
                v-if="configData.chartOptions.yAxis.visible"
              >
                <input
                  type="text"
                  class="form-control"
                  placeholder=""
                  v-model="configData.chartOptions.yAxis.title.text"
                />
              </div>
            </transition>
          </div>
          <div class="form-group row">
            <label for="inputChartDataLabels" class="col-sm-5 col-form-label">{{
              $t("dataLabels")
            }}</label>
            <div class="col-sm-7">
              <b-form-checkbox
                checked="configData.dataLabels.enabled"
                v-model="configData.dataLabels.enabled"
                name="someSwitchOptionDataLabels"
                switch
                size="lg"
                class="mt-1"
              />
            </div>
          </div>
          <div class="form-group row hide">
            <label class="col-sm-5 col-form-label">{{ $t("color") }}</label>
            <div class="col-sm-2">
              <input
                type="color"
                class="form-control"
                placeholder=""
                v-model="configData.chartOptions.color"
              />
            </div>
            <div class="col-sm-5">
              <input
                type="text"
                class="form-control"
                placeholder=""
                v-model="configData.chartOptions.color"
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
              <b-form-textarea
                id="inputChartName"
                v-model="configData.chartName"
                :state="
                  configData.chartName.length !== 0 &&
                  configData.chartName.length <= chartTitleMaxLength
                "
                placeholder=""
                rows="3"
                :maxlength="chartTitleMaxLength"
              ></b-form-textarea>
              <span class="small"
                >{{ configData.chartName.length }}/{{
                  chartTitleMaxLength
                }}</span
              >
            </div>
          </div>
          <div class="form-group row">
            <label
              for="inputChartSource"
              class="col-sm-5 col-lg-6 col-form-label"
              >{{ $t("chartInformation") }}</label
            >
            <div class="col-sm-7 col-lg-6">
              <b-form-textarea
                id="inputChartInfo"
                v-model="configData.chartInfo"
                :state="
                  configData.chartInfo.length !== 0 &&
                  configData.chartInfo.length <= chartInfoMaxLength
                "
                :placeholder="chartInfoPlaceholder"
                rows="3"
                :maxlength="chartInfoMaxLength"
              ></b-form-textarea>
              <span class="small"
                >{{ configData.chartInfo.length }}/{{
                  chartInfoMaxLength
                }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </b-collapse>
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