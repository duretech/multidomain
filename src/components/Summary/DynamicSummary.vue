<template>
  <b-row id="modal-newanc" class="view-morepopup">
    <b-col class="pr-3" sm="12" lg="6" ref="summaryContainer">
      <div class="border-modal">
        <b-row class="pt-1 pb-1 pl-3">
          <b-col cols="4"></b-col>
          <b-col class="table-heading text-center" cols="2"
            ><p class="mr-2">
              {{ summaryObj.summaryDetails[0].prevForDate }}
            </p></b-col
          >
          <b-col class="table-heading text-center" cols="2"
            ><p class="mr-2">
              {{ summaryObj.summaryDetails[0].currForDate }}
            </p>
          </b-col>
          <b-col class="table-heading text-center" cols="2"
            ><p class="mr-2">{{ $t("per_change") }}</p></b-col
          >
          <b-col class="table-heading text-center" cols="2"
            ><p class="mr-3">{{ extYear }} {{ extName }}</p></b-col
          >
        </b-row>
        <b-row
          class="pt-1 pb-2 mx-0 valueRow"
          v-for="(sDetails, i) in summaryObj.summaryDetails"
          :key="'details' + i"
        >
          <b-col class="table-heading pt-2" cols="4"
            ><p :class="getClass(sDetails.indicatorName)">
              {{ sDetails.indicatorName }}
            </p></b-col
          >
          <b-col cols="2"
            ><div class="summary-dot" :class="getClass(sDetails.prevValue)">
              <p class="mb-0 fs-25-1920"></p>
              {{ sDetails.prevValue === null ? $t("NA") : sDetails.prevValue }}
            </div></b-col
          >
          <b-col cols="2"
            ><div class="summary-dot" :class="getClass(sDetails.currValue)">
              <p class="mb-0 fs-25-1920"></p>
              {{ sDetails.currValue === null ? $t("NA") : sDetails.currValue }}
            </div></b-col
          >
          <b-col cols="2">
            <div
              class="summary-dot"
              :style="{ backgroundColor: sDetails.colorLastMn }"
              :class="getClass(sDetails.change)"
            >
              <p class="mb-0 fs-25-1920"></p>
              {{ sDetails.change === null ? $t("NA") : sDetails.change }}
            </div></b-col
          >
          <b-col cols="2">
            <div class="summary-dot">
              {{ extValue }}{{ extValue === $t("NA") ? "" : "%" }}
            </div></b-col
          >
        </b-row>
        <b-row v-if="$store.getters.getAppSettings?.benchmark">
          <b-col sm="12">
            <p>
              {{ $t("performance_against_benchmark") }}
              {{
                summaryObj.summaryDetails[0].benchmarkValue
                  ? `(${summaryObj.summaryDetails[0].benchmarkValue})`
                  : ""
              }}
              <span class="ml-3">
                <template
                  v-if="
                    summaryObj.summaryDetails[0].performanceBenchmarking ===
                    $t('NA')
                  "
                >
                  {{ summaryObj.summaryDetails[0].performanceBenchmarking }}
                </template>
                <img
                  v-else
                  alt="s_icon"
                  class="equalTosign w-20px"
                  :src="
                    require(`@/assets/images/ministerialSummaryIcon/${getIcon(
                      summaryObj.summaryDetails[0].performanceBenchmarking
                    )}`)
                  "
                />
              </span>
            </p>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="12">
            <p class="">
              <span
                v-html="
                  getSummaryText(summaryObj.summaryDetails[0].summaryText)
                "
              ></span>
            </p>
          </b-col>
        </b-row>
      </div>
    </b-col>
    <b-col class="anc-map" sm="12" lg="6">
      <div class="border-map">
        <div class="map-header mb-3" v-show="isJsonFetched">
          <div class="row map-section">
            <div class="col-3">
              <div v-if="locationPeriod">
                <h6 class="map-title pt-1">
                  {{ locationPeriod.locationName }}
                </h6>
              </div>
            </div>
            <div class="col-9">
              <div class="ml-2" v-if="indList.length > 0">
                <b-form-select
                  class="mapDropdown"
                  v-model="selectedInd"
                  :options="indList"
                ></b-form-select>
              </div>
            </div>
          </div>
        </div>
        <MapComponent
          :allGeoJson="allGeoJson"
          :selectedInd="selectedInd"
          :chartData="summaryObj.trend"
          :locationPeriod="locationPeriod"
          @isJsonFetchedM="isJsonFetchedM"
          @mapPic="mapPic"
          @deleteMapPic="deleteMapPic"
        />
      </div>
    </b-col>
    <div class="html2pdf__page-break"></div>
    <b-col class="anc-charts mt-3" sm="12" lg="6">
      <HighChartComponent
        :chartData="summaryObj.trend"
        class="border-bottom border-greyright border-none"
        :dataFetched="true"
        :chartType="'period'"
        :isHideOption="false"
        :chartConfigData="summaryObj.chartConfigData"
      />
    </b-col>
    <b-col class="anc-charts mt-3" sm="12" lg="6">
      <HighChartComponent
        :chartData="summaryObj.regional"
        class="border-bottom border-greyright border-none"
        :dataFetched="true"
        :chartType="'regional'"
        :isHideOption="false"
      />
    </b-col>
  </b-row>
</template>
<script>
import { decompress } from "compress-json";
import SummaryViewMixin from "@/helpers/SummaryViewMixin";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import domtoimage from "dom-to-image";

export default {
  props: ["summaryObj", "allGeoJson", "allExtData", "locationPeriod"],
  mixins: [SummaryViewMixin, DynamicImageMixin],
  components: {
    HighChartComponent: () =>
      import(
        /* webpackChunkName: "HighChartComponentDynamic"*/ "@/components/Highcharts/HighChartComponentDynamic"
      ),
    MapComponent: () =>
      import(
        /*webpackChunkName: "MapComponent"*/ "@/components/Maps/MapComponent"
      ),
  },
  data() {
    return {
      isJsonFetched: false,
    };
  },
  computed: {
    extYear() {
      return this.sortedData?.[0]?.[1] || null;
    },
    extName() {
      let gSetting = this.$store.getters.getGlobalFactors();
      let name = this.$i18n.t("DHS");
      if (gSetting?.allExtData?.extData?.length) {
        let isFound = gSetting.allExtData.extData.find(
          (m) => m.id === this.summaryObj.extData
        );
        if (isFound) {
          name = isFound.displayName[this.$i18n.locale];
        }
      }
      return name;
    },
    extValue() {
      return this.sortedData?.[0]?.[3] || this.$i18n.t("NA");
    },
    sortedData() {
      let level = this.locationPeriod.location.split("/")[0],
        sortedData = [];
      if (this.allExtData?.[level]?.rows) {
        let r =
          typeof this.allExtData[level].rows == "string"
            ? decompress(JSON.parse(this.allExtData[level].rows))
            : this.allExtData[level].rows;
        if (r.length) {
          let isData = r.filter((r) => r[0].includes(this.summaryObj.extData));
          if (isData.length) {
            sortedData = isData.sort((a, b) => b[1] * 1 - a[1] * 1);
          }
        }
      }
      return sortedData;
    },
    indList() {
      let l = [];
      if (this.summaryObj?.summaryDetails?.length) {
        l = this.summaryObj.summaryDetails.map((s) => ({
          value: s.indicatorName,
          text: s.indicatorName,
        }));
      }
      return l;
    },
    selectedInd() {
      return this.indList.length ? this.indList[0].value : "";
    },
  },
  methods: {
    isJsonFetchedM(newVal) {
      //console.log(newVal, "isJsonFetched method emit value");
      this.isJsonFetched = newVal;
    },
    mapPic(data) {
      data["location"] = this.locationPeriod.locationName;
      data["selectedInd"] = this.selectedInd;
      this.$emit("mapPic", data);
    },
    deleteMapPic(data) {
      this.$emit("deleteMapPic", this.locationPeriod.locationName);
    },
    getClass(value) {
      return value && value.toString().length > 5 && value.toString().length < 7
        ? "big-number"
        : value && value.toString().length >= 7
        ? "biggest-number"
        : "";
    },
  },
  async mounted() {
    await domtoimage
      .toPng(this.$refs.summaryContainer)
      .then((dataUrl) => {
        this.$store.commit("setLoading", false);
        this.$nextTick(() => {
          this.$emit("mapPic", {
            pic: dataUrl,
            url: this.$store.getters.getActiveTab,
            title: this.locationPeriod.locationName,
            summaryContainer: true,
          });
        });
      })
      .catch((error) => {
        this.$store.commit("setLoading", false);
        console.error("oops, something went wrong!", error);
      });
  },
};
</script>

<style scoped></style>
