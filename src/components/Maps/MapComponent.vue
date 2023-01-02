<template>
  <div
    class="anchor-map"
    :class="{
      'text-center': !isJsonFetched,
    }"
    :style="{ height: computedHeight + 'px' }"
  >
    <l-map
      ref="myMap"
      :zoom="zoom"
      :center="center"
      @ready="mapReady"
      v-if="isJsonFetched"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      @update:bounds="boundsUpdated"
      style="height: 100%; width: 100%"
      :options="{
        keyboard: false, // check issues - 1) https://github.com/Leaflet/Leaflet/issues/4125 2) https://github.com/Leaflet/Leaflet/issues/1228 3) https://github.com/Leaflet/Leaflet/commit/b61b7b47570dfbe7d72ef4dbe50b3af85f7b1a8c
        zoomControl: false,
        attributionControl: false,
      }"
    >
      <l-geo-json
        :geojson="geojson"
        :options="getOptions"
        v-if="showGeoJson"
      ></l-geo-json>
      <l-control-fullscreen
        position="topright"
        class="full-screen"
        :options="{
          title: { false: 'View Full Screen', true: 'Be regular' },
        }"
      />
      <l-control-zoom
        style="padding: 4px 8.5px"
        position="topright"
        zoomInTitle="Zoom In"
        zoomOutTitle="Zoom Out"
        class="zoom-inout"
      >
      </l-control-zoom>
      <l-control position="topright" class="reset-map">
        <span
          @click.prevent.stop="resetMap"
          title="Reset Map"
          data-html2canvas-ignore="true"
        >
          <i class="fa fa-refresh"></i>
        </span>
      </l-control>
      <l-control position="bottomleft" id="legend">
        <div class="select-wrapper">
          <div
            v-b-toggle.my-collapse
            class="toggleLegend fs-17-1920"
            v-b-tooltip.hover
            title="Legend"
          >
            {{ $t("Legend") }}
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
                <!-- <a
									class="dropdown-item descVal fs-17-1920 px-2"
									v-for="(scales, index) in scaleDescription[0].scales"
									:key="index"
								> -->
                <input
                  type="color"
                  class="cursor-pointer mapInputBox fs-15-1920 w-25"
                  v-bind:style="{
                    color: scaleDescription[0].scales[index].scaleColor,
                  }"
                  disabled
                  v-bind:value="scaleDescription[0].scales[index].scaleColor"
                />
                <span class="ml-2" style="color: white">{{
                  scaleDescription[0].scales[index].scaleLabel
                }}</span>
                <!-- </a> -->
              </li>
            </ul>
          </div>
        </b-collapse>
      </l-control>
      <l-control
        class="play-content"
        position="bottomright"
        v-if="yearArr.length"
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
    <b-spinner type="grow" label="Spinning" v-else></b-spinner>
  </div>
</template>
<script>
import L from "leaflet";
import service from "@/service";
import dom_to_image from "dom-to-image";
import { LMap, LGeoJson, LControl, LControlZoom } from "vue2-leaflet";
import * as LocationModes from "leaflet-dvf";
import LControlFullscreen from "vue2-leaflet-fullscreen";
import "leaflet/dist/leaflet.css";
import YearSlider from "@/components/Common/YearSliderNew.vue";
import { isNumber } from "@/components/Common/commonFunctions";
export default {
  props: [
    "hideYears",
    "mapHeight",
    "chartData",
    "showScales",
    "allGeoJson",
    "selectedInd",
    "mapConfigData",
    "locationPeriod",
  ],
  components: {
    LMap,
    LControl,
    LGeoJson,
    YearSlider,
    LControlZoom,
    LControlFullscreen,
  },
  data() {
    return {
      zoom: 5,
      yearArr: [],
      bounds: null,
      minVal: null,
      maxVal: null,
      geojson: null,
      mapData: null,
      pType: "yearly",
      showGeoJson: false,
      locNameLayer: null,
      scaleDescription: [],
      isJsonFetched: false,
      scales: [
        {
          lowScale: "0",
          highScale: "25",
          scaleColor: "#FF6850",
          scaleLabel: "Lowest Coverage",
        },
        {
          lowScale: "25",
          highScale: "50",
          scaleColor: "#69D48C",
          scaleLabel: "Highest Coverage",
        },
      ],
      updatedYearSliderValue: null,
      center: [50.919437, 19.145136],
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
        // let fillColor = "#65648c";
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
      // if (!this.enableTooltip) {
      // 	return () => {};
      // }
      return (feature, layer) => {
        var locationISO = feature.id;
        var locationName = feature.properties.name;
        var tooltipContent = this.getToolTipContent(locationName, locationISO);
        layer.bindTooltip(tooltipContent, {
          permanent: false,
          sticky: true,
        });
        layer.on({
          mouseover: this.highlightFeature,
          mouseout: this.resetHighlight,
          click: this.drilldown,
        });
      };
    },
  },
  watch: {
    selectedInd(newValue) {
      this.mapData = null;
      this.showGeoJson = false;
      this.setPeriod();
    },
    isJsonFetched(newValue) {
      if (newValue) {
        this.$emit("isJsonFetched");
      }
    },
    "$store.getters.getActiveTab": function () {
        this.$refs.myMap.mapObject.invalidateSize();
    },
  },
  methods: {
    getFillColor(value) {
      let returnColor = "#65648c";
      if (this.showScales) {
        let scales = this.scaleDescription[0].scales;

        for (var i in scales) {
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
      } else {
        if (value === this.minVal) {
          returnColor = "#FF6850";
        }
        if (value === this.maxVal) {
          returnColor = "#69D48C";
        }
      }
      return returnColor;
    },
    getFeatureValue(paramId) {
      var returnVal = "N/A";
      var dataVal =
        this.mapData && this.mapData.length
          ? this.mapData.find((d) => d.locationID === paramId)
          : null;
      if (dataVal) {
        returnVal = dataVal.originalY;
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
          }
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
      this.scaleDescription = [];

      let scaleDescription = this.mapConfigData.levels.filter(
        (c) => c.level === this.locationPeriod.location.split("/")[0] * 1
      );
      this.scaleDescription = JSON.parse(JSON.stringify(scaleDescription));
      if (this.scaleDescription[0].isAutoRange) {
        let color = [],
          scaleD = [];
        this.scaleDescription[0].scales.forEach((scale) => {
          color.push(scale.scaleColor);
          scaleD.push(scale.scaleLabel);
        });
        let valArray = [];
        scaleData.forEach((obj) => {
          valArray.push(obj.originalY * 1);
        });

        let maxValue = Math.max.apply(Math, valArray);
        let medianValue =
          isNumber(maxValue) && valArray.length ? parseInt(maxValue / 4) : 0;
        let legendScales = {
          lowScale: [],
          highScale: [],
          scaleDesc: scaleD,
          colorScale: color,
        };

        let lowScaleMinValue = 0;
        let highScaleMinValue = medianValue;
        for (var i = 0; i < 4; i++) {
          if (i == 0) {
            legendScales.lowScale.push(0);
            legendScales.highScale.push(highScaleMinValue);
          } else {
            lowScaleMinValue += medianValue;
            highScaleMinValue += medianValue;
            legendScales.lowScale.push(lowScaleMinValue);
            legendScales.highScale.push(highScaleMinValue);
          }
        }
        let scales = [];
        for (let i = 0; i < legendScales.lowScale.length; i++) {
          let scaleDescValue = "";
          if (i == legendScales.lowScale.length - 1) {
            scaleDescValue =
              legendScales.scaleDesc[i] +
              " (" +
              legendScales.lowScale[i] +
              " + )";
          } else {
            scaleDescValue =
              legendScales.scaleDesc[i] +
              " (" +
              legendScales.lowScale[i] +
              " - " +
              legendScales.highScale[i] +
              " )";
          }

          scales.push({
            highScale: legendScales.highScale[i],
            lowScale: legendScales.lowScale[i],
            scaleColor: legendScales.colorScale[i],
            scaleLabel: scaleDescValue,
          });
        }
        this.scaleDescription[0].scales = scales;
      }
    },
    currentYearChange(year) {
      this.mapData = null;
      this.showGeoJson = false;
      this.updatedYearSliderValue = year;
      this.getUpdatedMapValues();
    },
    async exportChart(type) {
      var map = this.$refs.mapObj.mapObject;
      this.isExpanded = map.isFullscreen();
      var getStyleObj = this.isExpanded
        ? { width: 1000, quality: 0.95 }
        : { quality: 0.95 };
      if (type === "jpg") {
        await dom_to_image
          .toJpeg(document.getElementById("leafLet"), { quality: 0.95 })
          .then(function (dataUrl) {
            var link = document.createElement("a");
            link.download = "my_image.jpg";
            link.href = dataUrl;
            link.click();
          })
          .catch(function (error) {
            console.error("oops, something went wrong!", error);
          });
      } else if (type === "png") {
        await dom_to_image
          .toPng(document.getElementById("leafLet"), getStyleObj)
          .then(function (dataUrl) {
            var link = document.createElement("a");
            link.download = "my_image.png";
            link.href = dataUrl;
            link.click();
          })
          .catch(function (error) {
            console.error("oops, something went wrong!", error);
          });
      }
    },
    resetMap() {
      this.zoom = 5;
      this.center = [50.919437, 21.145136];
      this.$refs.myMap.setCenter(this.center);
      this.$refs.myMap.setZoom(this.zoom);
    },
    getToolTipContent(locationName, locationISO) {
      let value = this.getFeatureValue(locationISO);
      var content =
        '<div style="max-width:180px;"><div style="font-weight: 600;"> ' +
        locationName +
        " : " +
        value +
        "</div></div>";
      return content;
    },
    highlightFeature(e) {
      var layer = e.target;
      layer.setStyle({
        weight: 3,
        color: "#9a99c7",
        dashArray: "",
        fillOpacity: 0.7,
      });
    },
    resetHighlight(e) {
      var layer = e.target;
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
      }, 0);
    },
    getGeoJson() {
      let loc = this.locationPeriod.location.split("/");
      service
        .getGeoJson(loc[1], loc[0] * 1 + 1)
        .then((response) => {
          this.geojson = response.data;
          this.$emit("getGeoJson", this.locationPeriod.location, response.data);
          this.isJsonFetched = true;
        })
        .catch(() => {
          this.isJsonFetched = true;
        });
    },
    locationNames(overlayData) {
      var _this = this;
      var textFunction = function (value) {
        return {
          text: value,
          style: {
            fill: " #cbcbcb ",
            "font-size": _this.fontsize,
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
          opacity: 0,
          stroke: true,
          fillOpacity: 0.1,
          dropShadow: false,
          gradient: false,
        },
      };
      let dataLayer = new L.DataLayer(overlayData, markerOptions);
      var overlayMaps = {};
      if (this.isChecked) {
        overlayMaps["names"] = new L.LayerGroup([dataLayer]).addTo(
          this.$refs.myMap.mapObject
        );
      } else {
        overlayMaps["names"] = new L.LayerGroup([dataLayer]);
      }

      this.locNameLayer = new L.Control.Layers(null, overlayMaps, {
        position: "topleft",
        collapsed: false,
      }).addTo(this.$refs.myMap.mapObject);
      this.$nextTick(() => {
        this.showGeoJson = true;
        this.$refs.myMap.mapObject.invalidateSize();
      });
    },
    getGeoJsonMapped(indData) {
      let overlaysMap = [];
      if (this.geojson != null) {
        for (let i in this.geojson.features) {
          let layerObj = L.geoJson(this.geojson.features[i]);
          let mapCentroid = layerObj.getBounds().getCenter();

          let nameControlObj = {},
            findId = false,
            value = "N/A";
          if (indData.length > 0) {
            findId = indData.find(
              (obj) => obj.locationID === this.geojson.features[i]["id"]
            );
            value = findId.originalY;
          } else {
            findId = true;
          }

          if (findId) {
            nameControlObj = {
              name: this.geojson.features[i]["properties"].name,
              lat: mapCentroid.lat,
              lng: mapCentroid.lng,
              value: this.geojson.features[i]["properties"].name + ": " + value,
            };
          }
          overlaysMap.push(nameControlObj);
        }
      }
      return overlaysMap;
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
        }
      } else {
        console.log("Chart data not found");
        let overlayData = this.getGeoJsonMapped([]);
        this.locationNames(overlayData);
      }
    },
  },
  created() {
    this.scaleDescription.push({ scales: this.scales });
    if (this.allGeoJson[this.locationPeriod.location]) {
      this.$nextTick(() => {
        this.geojson = this.allGeoJson[this.locationPeriod.location];
        this.isJsonFetched = true;
      });
    } else {
      this.getGeoJson();
    }
  },
  mounted() {},
};
</script>
<style scoped>
.reset-map {
  border: 1px solid #2f2d55;
  padding: 4px 7px;
  border-radius: 7px;
  background-color: #2f2d55 !important;
  color: #d9d9d9 !important;
}
.toggleLegend {
  padding: 3px 5px;
  min-width: 100px;
}
.mapDivLegend {
  min-width: 155px;
}
#legend .select-wrapper:after {
  top: 0px;
}
.dropdown-item:hover,
.dropdown-item:focus {
  background-color: none;
}
</style>
