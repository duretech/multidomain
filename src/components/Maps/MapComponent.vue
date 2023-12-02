<template>
  <div
    class="anchor-map h-100"
    :class="{
      'text-center': !isJsonFetched,
    }"
    :style="{ height: computedHeight + 'px' }"
    id="leafLet_map"
    ref="leafLet_map"
  >
    <template v-if="isJSONError">
      <div class="mt-5 text-center">
        {{ $t("jsonError") }}
      </div>
    </template>
    <template v-else>
      <l-map
        ref="myMap"
        :zoom="zoom"
        :center="center"
        @ready="mapReady"
        v-if="isJsonFetched"
        @update:zoom="zoomUpdated"
        @update:center="centerUpdated"
        @update:bounds="boundsUpdated"
        @fullscreenchange="reCenterMap"
        style="height: 100%; width: 100%"
        :options="{
          zoomSnap: 0.1,
          keyboard: false, // check issues - 1) https://github.com/Leaflet/Leaflet/issues/4125 2) https://github.com/Leaflet/Leaflet/issues/1228 3) https://github.com/Leaflet/Leaflet/commit/b61b7b47570dfbe7d72ef4dbe50b3af85f7b1a8c
          zoomControl: false,
          attributionControl: false,
        }"
      >
        <l-tile-layer v-if="url" :url="url"></l-tile-layer>
        <l-geo-json
          :geojson="geoJson"
          :options="getOptions"
          v-if="showGeoJson"
        ></l-geo-json>
          <l-control-fullscreen
            v-if="!isExporting"
            position="topright"
            :class="isGenerating ? 'd-none' : 'full-screen leaflet-control'"
            :options="{
              title: { false: $t('fullScreen'), true: $t('exitFullScreen') },
            }"
          />
          <l-control-zoom
            style="padding: 4px 6px"
            position="topright"
            :zoomInTitle="$t('zoomin')"
            :zoomOutTitle="$t('zoomout')"
            :class="isGenerating ? 'd-none' : 'zoom-inout leaflet-control'"
            v-if="!isExporting"
          >
          </l-control-zoom>
          <l-control position="topright" v-if="!isExporting" :class="isGenerating ? 'd-none' : 'reset-map leaflet-control'">
            <span
              @click.prevent.stop="reCenterMap"
              :title="$t('resetMap')"
              data-html2canvas-ignore="true"
            >
              <img
                src="@/assets/images/icons/icon-refresh.svg"
                class="w-17px"
                :style="{ filter: filterColor }"
              />
            </span>
          </l-control>
        <l-control
          position="bottomleft"
          id="legend"
          v-if="scaleDescription.length"
        >
          <div class="select-wrapper">
            <div
              v-b-toggle.my-collapse
              class="toggleLegend fs-17-1920"
              v-b-tooltip.hover
              :title="selectedInd || $t('legend')"
            >
              <span class="toggleHeading">
                <i
                  class="fa fa-info-circle cursor-pointer chart-info"
                  aria-hidden="true"
                  v-b-popover.hover.rightbottom="{
                    variant: 'info',
                    content: $t('mapScaleInfo'),
                    html: true,
                  }"
                ></i>
                {{ selectedInd || $t("legend") }}
              </span>
            </div>
          </div>
          <b-collapse id="my-collapse" visible>
            <div class="maplegend mapDivLegend map-live">
              <ul class="list-unstyled mb-0">
                <li
                  class="p-2 legend-map"
                  v-for="(scales, index) in scaleDescription[0].scales"
                  :key="index"
                >
                  <input
                    type="color"
                    class="mapInputBox fs-15-1920 w-30"
                    v-bind:style="{
                      color: scaleDescription[0].scales[index].scaleColor,
                    }"
                    disabled
                    v-bind:value="scaleDescription[0].scales[index].scaleColor"
                    v-if="!isGenerating"
                  />
                  <canvas
                    v-if="isGenerating"
                    v-bind:style="{
                      background: scaleDescription[0].scales[index].scaleColor,
                    }"
                    style="
                      display: inline;
                      border: 1px solid white;
                      padding: 4px;
                      height: 4px;
                    "
                  ></canvas>
                  <span
                    class="ml-2 legend-plot cursor-pointer"
                    style="color: white"
                    v-b-tooltip.hover
                    :title="scaleDescription[0].scales[index].scaleLabel"
                    >{{ scaleDescription[0].scales[index].scaleLabel }}</span
                  >
                </li>
              </ul>
            </div>
          </b-collapse>
        </l-control>
        <l-control
          class="play-content"
          position="bottomright"
          v-if="yearArr.length && !isExporting"
        >
          <YearSlider
            :pType="pType"
            :yearArr="yearArr"
            class="contentplay-year"
            @currentYearChange="currentYearChange"
            :updatedYearSliderValue="updatedYearSliderValue"
          />
        </l-control>
      </l-map>
      <div
        class="align-items-center d-flex justify-content-center h-400px"
        v-else
      >
        <b-spinner type="grow" label="Spinning"></b-spinner>
      </div>
    </template>
  </div>
</template>
<script>
import L from "leaflet";
import domtoimage from "dom-to-image";
import {
  LMap,
  LGeoJson,
  LControl,
  LTileLayer,
  LControlZoom,
} from "vue2-leaflet";
import { featureGroup } from "leaflet";
import * as LocationModes from "leaflet-dvf";
import LControlFullscreen from "vue2-leaflet-fullscreen";
import "leaflet/dist/leaflet.css";
import YearSlider from "@/components/Common/YearSliderNew.vue";
import { isNumber, excludeName } from "@/components/Common/commonFunctions";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default {
  props: [
    "hideYears",
    "mapHeight",
    "chartData",
    "showScales",
    "allGeoJson",
    "selectedInd",
    "mapConfigData",
    "selectedLayer",
    "locationPeriod",
    "isGenerating",
    "title"
  ],
  components: {
    LMap,
    LControl,
    LGeoJson,
    LTileLayer,
    YearSlider,
    LControlZoom,
    LControlFullscreen,
  },
  mixins: [DynamicImageMixin],
  data() {
    return {
      zoom: 5,
      url: null,
      scales: [],
      yearArr: [],
      bounds: null,
      minVal: null,
      maxVal: null,
      geoJson: null,
      mapData: null,
      pType: "yearly",
      isJSONError: false,
      showGeoJson: false,
      isExporting: false,
      locNameLayer: null,
      scaleDescription: [],
      isJsonFetched: false,
      updatedYearSliderValue: null,
      center: [0, 0],
    };
  },
  computed: {
    computedHeight() {
      return this.mapHeight ? this.mapHeight : 400;
    },
    getOptions() {
      let layerObj = {
        style: this.bStyleFunction,
        onEachFeature: this.onEachFeatureFunction,
      };
      return layerObj;
    },
    bStyleFunction() {
      return (feature) => {
        let fillColor = this.getFillColor(this.getFeatureValue(feature.id));
        return {
          weight: 1.5,
          color: "#9a99c7",
          opacity: 1,
          fillColor: fillColor,
          fillOpacity: 1,
        };
      };
    },
    onEachFeatureFunction() {
      return (feature, layer) => {
        let locationISO = feature.id;
        let locationName = feature.properties.name;
        let tooltipContent = this.getToolTipContent(locationName, locationISO);
        layer.bindTooltip(tooltipContent, {
          permanent: false,
          sticky: true,
        });
        layer.on({
          mouseover: this.highlightFeature,
          mouseout: this.resetHighlight,
        });
      };
    },
  },
  watch: {
    allGeoJson(newValue) {
      if (newValue[this.locationPeriod.location] === "error") {
        this.isJSONError = true;
      }
      if (newValue[this.locationPeriod.location]) {
        this.$nextTick(() => {
          this.geoJson = newValue[this.locationPeriod.location];
          this.isJsonFetched = true;
        });
      }
    },
    selectedLayer(newValue) {
      this.url = newValue;
    },
    selectedInd(newValue) {
      this.mapData = null;
      this.showGeoJson = false;
      this.scaleDescription = [];
      this.setPeriod();
      this.$emit("deleteMapPic", this.title);
      this.reCenterMap()
    },
    isJsonFetched(newValue) {
      if (newValue) {
        this.$emit("isJsonFetched");
      }
    },
    "$store.getters.getActiveTab": function () {
      this.$refs.myMap.mapObject.invalidateSize();
    },
    isExporting(newValue) {
      if (newValue) {
        this.removedLocationName();
      } else {
        this.setPeriod();
      }
    },
    viewType(newVal, oldVal){
      if (newVal === "map" && oldVal === "chart") {
        this.$emit("deleteBubbleChart");
        this.reCenterMap();
      }
    },
    isGenerating: {
      handler(newVal) {
        if (newVal) {
          this.zoom = this.zoom - 1;
        } else {
          this.zoom = this.zoom + 1;
        }
      },
      deep: true,
    },
  },
  methods: {
    getFillColor(value) {
      value = parseFloat(value.replaceAll(",", ""));
      let returnColor = "#A0ADBA";
      if (this.showScales) {
        if (this.scaleDescription.length) {
          let scales = this.scaleDescription[0].scales;
          for (let i in scales) {
            if (value != undefined && value * 1 != -1) {
              if (value * 1 > scales[i].highScale * 1) {
                returnColor = scales[i].scaleColor;
              } else {
                if (
                  value * 1 >= scales[i].lowScale * 1 &&
                  value * 1 <= scales[i].highScale * 1
                ) {
                  returnColor = scales[i].scaleColor;
                  break;
                }
                if (value * 1 < scales[i].lowScale * 1) {
                  returnColor = scales[i].scaleColor;
                  break;
                }
              }
            }
          }
        }
      } else {
        if (isNumber(value)) {
          returnColor = "#6c7787";
        }
        if (
          value === this.minVal &&
          ![null, this.$i18n.t("NA")].includes(this.minVal)
        ) {
          returnColor = "#FF6850";
        }
        if (
          value === this.maxVal &&
          ![null, this.$i18n.t("NA")].includes(this.maxVal)
        ) {
          returnColor = "#69D48C";
        }
      }
      return returnColor;
    },
    getFeatureValue(paramId) {
      let returnVal = this.$i18n.t("NA");
      let dataVal =
        this.mapData && this.mapData.length
          ? this.mapData.find((d) => d.locationID === paramId)
          : null;
      if (dataVal) {
        returnVal = Number(dataVal.originalY).toLocaleString();
      }
      return returnVal;
    },
    setMinMax(mapData) {
      this.minVal = null;
      this.maxVal = null;
      this.$nextTick(() => {
        mapData.forEach((obj) => {
          let returnVal = obj.originalY;
          this.minVal =
            this.minVal != null
              ? this.minVal > returnVal
                ? returnVal
                : this.minVal
              : returnVal;
          this.maxVal =
            this.maxVal != null
              ? this.maxVal < returnVal
                ? returnVal
                : this.maxVal
              : returnVal;
        });
      });
    },
    getUpdatedMapValues() {
      this.removedLocationName();
      let isFound = this.chartData.series.find(
        (c) => c.name === this.selectedInd
      );
      if (isFound) {
        let obj = !this.hideYears
          ? isFound.data.find((d) => d.pe == this.updatedYearSliderValue)
          : true;
        if (obj) {
          let isDataFound = !this.hideYears
            ? this.chartData.drilldown.series.find(
                (d) => d.name === obj.drilldown
              )
            : true;
          if (isDataFound) {
            let data = !this.hideYears ? isDataFound.data : isFound.data;
            this.mapData = data;
            if (this.showScales) {
              this.getScales(data);
            } else {
              this.setMinMax(data);
            }
            let overlayData = this.getGeoJsonMapped(data);
            this.locationNames(overlayData);
          } else {
            this.dummyGeoJson();
          }
        } else {
          this.dummyGeoJson();
        }
      }
    },
    removedLocationName() {
      if (this.locNameLayer != null) {
        this.locNameLayer._layers.filter((obj) => {
          this.$refs.myMap.mapObject.removeLayer(obj["layer"]);
        });
        this.locNameLayer.remove();
      }
    },
    getScales(scaleData) {
      let scales = [],
        loc = this.locationPeriod.location.split("/");
      this.scaleDescription = [];
      let scaleDescription =
        this.mapConfigData?.levels?.filter((c) => c.level === loc[0] * 1) || [];
      this.scaleDescription = JSON.parse(JSON.stringify(scaleDescription));
      if (this.scaleDescription.length === 0) {
        this.scaleDescription = [{ scales: [] }];
      }
      if (this.scaleDescription[0]?.isAutoRange) {
        let color = [],
          scaleD = [];
        this.scaleDescription[0].scales.forEach((scale) => {
          color.push(scale.scaleColor);
          scaleD.push(scale.scaleLabel[this.$i18n.locale]);
        });
        let valArray = [];
        scaleData.forEach((obj) => {
          if (obj.locationID !== loc[1]) {
            valArray.push(obj.originalY * 1);
          }
        });
        let maxValue = Math.max.apply(Math, valArray);
        let minValue = valArray.length ? Math.floor(Math.min.apply(Math, valArray)) : 0;
        let medianValue =
          isNumber(maxValue) && isNumber(minValue) && valArray.length
            ? Math.ceil(parseFloat((maxValue - minValue) / 4))
            : 0;
        let legendScales = {
          lowScale: [],
          highScale: [],
          scaleDesc: scaleD,
          colorScale: color,
        };

        let lowScaleMinValue = isNumber(minValue) ? minValue : 0;
        let highScaleMinValue = medianValue + (isNumber(minValue) ? minValue : 0);
        for (let i = 0; i < 4; i++) {
          if (i == 0) {
            legendScales.lowScale.push(isNumber(minValue) ? minValue : 0);
            legendScales.highScale.push(highScaleMinValue);
          } else {
            lowScaleMinValue += medianValue;
            highScaleMinValue += medianValue;
            legendScales.lowScale.push(lowScaleMinValue);
            legendScales.highScale.push(highScaleMinValue);
          }
        }
        for (let i = 0; i < legendScales.lowScale.length; i++) {
          let scaleDescValue = "";
          scaleDescValue =
            legendScales.scaleDesc[i] +
            " (" +
            legendScales.lowScale[i].toLocaleString() +
            " - " +
            legendScales.highScale[i].toLocaleString() +
            " )";

          scales.push({
            highScale: legendScales.highScale[i],
            lowScale: legendScales.lowScale[i],
            scaleColor: legendScales.colorScale[i],
            scaleLabel: scaleDescValue,
          });
        }
      } else {
        this.scaleDescription[0].scales.forEach((scale) => {
          scales.push({
            ...scale,
            scaleLabel: `${scale.scaleLabel[this.$i18n.locale]} (${
              scale.lowScale
            } - ${scale.highScale})`,
          });
        });
      }
      scales.push({
        highScale: null,
        lowScale: null,
        scaleColor: "#A0ADBA",
        scaleLabel: this.$i18n.t("noData"),
      });
      this.scaleDescription[0].scales = scales;
      this.$emit("getScales", this.scaleDescription[0].scales);
    },
    currentYearChange(year) {
      this.mapData = null;
      this.showGeoJson = false;
      this.updatedYearSliderValue = year;
      this.getUpdatedMapValues();
    },
    async exportChart(type = "jpg", exp = false) {
      this.isExporting = true;
      if(!exp){
        this.$store.commit("setLoading", true);
      }
      let map = this.$refs.myMap.mapObject;
      let isExpanded = map.isFullscreen();
      let getStyleObj = isExpanded
        ? { width: 1000, quality: 0.95 }
        : { quality: 0.95 };
      if (type === "jpg") {
        await domtoimage
          .toJpeg(this.$refs.leafLet_map, getStyleObj)
          .then((dataUrl) => {
            let link = document.createElement("a");
            link.download = "my_image.jpg";
            link.href = dataUrl;
            link.click();
            this.isExporting = false;
            this.$store.commit("setLoading", false);
          })
          .catch((error) => {
            this.isExporting = false;
            this.$store.commit("setLoading", false);
            console.error("oops, something went wrong!", error);
          });
      } else if (type === "png") {
        await domtoimage
          .toPng(this.$refs.leafLet_map, getStyleObj)
          .then((dataUrl) => {
            if (exp) {
              this.$store.commit("setLoading", false);
              this.$nextTick(() => {
                this.$emit("mapPic", {
                  pic: dataUrl,
                  url: this.$store.getters.getActiveTab,
                  title: this.title,
                });
              });
              this.isExporting = false;
              return;
            }
            let link = document.createElement("a");
            link.download = "my_image.png";
            link.href = dataUrl;
            link.click();
            this.isExporting = false;
            this.$store.commit("setLoading", false);
          })
          .catch((error) => {
            this.isExporting = false;
            this.$store.commit("setLoading", false);
            console.error("oops, something went wrong!", error);
          });
      }
    },
    getToolTipContent(locationName, locationISO) {
      let value = this.getFeatureValue(locationISO);
      let content =
        '<div style="max-width:180px;"><div style="font-weight: 600;"> ' +
        excludeName(locationName) +
        " : " +
        value +
        "</div></div>";
      return content;
    },
    highlightFeature(e) {
      let layer = e.target;
      layer.setStyle({
        weight: 3,
        color: "#9a99c7",
        dashArray: "",
        fillOpacity: 0.7,
      });
    },
    resetHighlight(e) {
      let layer = e.target;
      layer.setStyle({
        color: "#9a99c7",
        dashArray: "",
        weight: 1.5,
        opacity: 1.5,
        fillOpacity: 2,
      });
    },
    zoomUpdated(zoom) {
      this.zoom = zoom;
    },
    centerUpdated(center) {
      this.center = center;
    },
    boundsUpdated(bounds) {
      this.bounds = bounds;
    },
    mapReady(map) {
      this.$nextTick(() => {
        this.setPeriod();
      });
      setTimeout(() => {
        map.invalidateSize();
        this.reCenterMap();
      }, 0);
    },
    reCenterMap() {
      this.$nextTick().then(() => {
        let group = new featureGroup();
        this.$refs.myMap.mapObject.eachLayer(function (layer) {
          if (layer.feature && layer.feature != undefined)
            group.addLayer(layer);
        });
        this.$refs.myMap.mapObject.fitBounds(group.getBounds(), {
          padding: [10, 10],
        });
      });
      this.exportChart("png", true);
    },
    locationNames(overlayData) {
      let _this = this;
      let textFunction = (value) => {
        return {
          text: value,
          style: {
            // fill: " #cbcbcb ",
            fill: "#5C5B6D",
            "font-size": this.fontsize,
            "margin-left": "-100px",
            "font-family": "Roboto",
            "background-color": "rgb(255, 255, 245)",
            padding: "1px 2px",
          },
        };
      };
      let markerOptions = {
        recordsField: null,
        locationMode: L.LocationModes.LATLNG,
        latitudeField: "lat",
        longitudeField: "lng",
        displayOptions: {
          value: {
            displayName: "abc",
            text: textFunction,
          },
        },
        layerOptions: {
          numberOfSides: 50,
          radius: 1,
          weight: 0,
          color: "#343361",
          // color: "#5C5B6D",
          opacity: 0,
          stroke: true,
          fillOpacity: 0.1,
          dropShadow: false,
          gradient: false,
        },
      };
      let dataLayer = new L.DataLayer(overlayData, markerOptions);
      let overlayMaps = {};
      if (this.isChecked) {
        overlayMaps[this.$i18n.t("names")] = new L.LayerGroup([
          dataLayer,
        ]).addTo(this.$refs.myMap.mapObject);
      } else {
        overlayMaps[this.$i18n.t("names")] = new L.LayerGroup([dataLayer]);
      }
      // Adding names checkbox on top left corner
      // if (this.mapConfigData?.isNames) {
      //   this.locNameLayer = new L.Control.Layers(null, overlayMaps, {
      //     position: "topleft",
      //     collapsed: false,
      //   }).addTo(this.$refs.myMap.mapObject);
      // }
      this.$nextTick(() => {
        this.showGeoJson = true;
        this.$emit("getGeoData", overlayData);
        this.$refs.myMap.mapObject.invalidateSize();
      });
    },
    getGeoJsonMapped(indData) {
      let overlaysMap = [];
      if (this.geoJson != null) {
        for (let i in this.geoJson.features) {
          let layerObj = L.geoJson(this.geoJson.features[i]);
          let mapCentroid = layerObj.getBounds().getCenter();
          let nameControlObj = {},
            findId = false,
            value = this.$i18n.t("NA");
          if (indData.length > 0) {
            findId = indData.find(
              (obj) => obj.locationID === this.geoJson.features[i]["id"]
            );
            value = findId ? findId.originalY : this.$i18n.t("NA");
          } else {
            findId = true;
          }
          if (findId) {
            nameControlObj = {
              name: excludeName(this.geoJson.features[i]["properties"].name),
              lat: mapCentroid.lat,
              lng: mapCentroid.lng,
              value:
                excludeName(this.geoJson.features[i]["properties"].name) +
                ": " +
                value,
              period: this.updatedYearSliderValue,
            };
          }
          overlaysMap.push(nameControlObj);
        }
      }
      return overlaysMap;
    },
    ConvertToRadian(input) {
      return (input * Math.PI) / 180;
    },
    setPeriod() {
      if (this.chartData && this.chartData.series.length) {
        let isFound = this.chartData.series.find(
          (c) => c.name === this.selectedInd
        );
        if (isFound) {
          if (!this.hideYears) {
            let periodList = isFound.data.map((d) => d.pe);
            this.pType = this.locationPeriod.periodType;
            this.yearArr = periodList;
            this.updatedYearSliderValue = this.yearArr[this.yearArr.length - 1];
          }
          this.getUpdatedMapValues();
        } else {
          this.dummyGeoJson();
        }
      } else {
        this.dummyGeoJson();
      }
    },
    dummyGeoJson() {
      console.log("Chart data not found");
      this.removedLocationName();
      let overlayData = this.getGeoJsonMapped([]);
      if (this.showScales) {
        this.getScales([]);
      } else {
        this.setMinMax([]);
      }
      this.locationNames(overlayData);
    },
  },
  created() {
    this.zoom = this.$store.getters.getAppSettings?.defaultMapZoom || 5;
    if (!this.showScales) {
      this.scales = [
        {
          highScale: "25",
          lowScale: "0",
          scaleColor: "#FF6850",
          scaleLabel: this.$i18n.t("lowCoverage"),
        },
        {
          highScale: "25",
          lowScale: "50",
          scaleColor: "#69D48C",
          scaleLabel: this.$i18n.t("highCoverage"),
        },
        {
          highScale: "50",
          lowScale: "75",
          scaleColor: "#6c7787",
          scaleLabel: this.$i18n.t("coverage"),
        },
        {
          highScale: null,
          lowScale: null,
          scaleColor: "#A0ADBA",
          scaleLabel: this.$i18n.t("noData"),
        },
      ];
      this.scaleDescription.push({ scales: this.scales });
    }
    if (this.allGeoJson[this.locationPeriod.location]) {
      this.$nextTick(() => {
        this.geoJson = this.allGeoJson[this.locationPeriod.location];
        this.isJsonFetched = true;
      });
    }
  },
  mounted() {},
};
</script>
<style scoped>
.reset-map {
  border: 1px solid var(--sidebar-main-active-color) !important;
  padding: 4px;
  border-radius: 5px;
  background-color: var(--sidebar-main-active-color) !important;
  color: var(--text-font-color) !important;
  cursor: pointer;
}
</style>
