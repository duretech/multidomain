<template>
  <div>
    <div class="fp-map p-0">
      <div class="fp-map p-0">
        <div>
          <b-row class="map-row" id="int_map">
            <b-col cols="12">
              <l-map
                class="l-map integratedMap fs-17-1920"
                ref="mapObjNew"
                :zoom="zoom"
                :center="center"
                @ready="mapReady"
                @fullscreenchange="reCenterMap"
                :options="{
                  zoomSnap: 0.1,
                  zoomControl: false,
                  attributionControl: false,
                  scrollWheelZoom: showIcons ? true : false,
                  dragging: showIcons ? true : false,
                }"
                :style="{
                  height: showIcons
                    ? isAnalytical
                      ? '400px'
                      : '340px'
                    : '100px',
                }"
              >
                <l-geo-json
                  :geojson="geoJson"
                  :options="getOptions"
                ></l-geo-json>
                <l-control
                  v-if="showIcons"
                  position="bottomleft"
                  id="legend"
                  class="legendnew"
                >
                  <div class="select-wrapper">
                    <div
                      v-b-toggle.my-collapse1
                      class="toggleLegend fs-17-1920"
                      v-b-tooltip.hover
                      :title="selectedInd || $t('legend')"
                    >
                      <span class="toggleHeading">
                        {{ selectedInd || $t("legend") }}
                      </span>
                    </div>
                  </div>
                  <b-collapse id="my-collapse1" visible>
                    <div class="maplegend mapDivLegend map-live">
                      <ul class="list-unstyled mb-0">
                        <li
                          class="p-2 legend-map"
                          v-for="(scales, index) in scaleDescription[0].scales"
                          :key="index"
                        >
                          <input
                            type="color"
                            class="cursor-pointer mapInputBox fs-17-1920 w-30"
                            v-bind:style="{
                              color:
                                scaleDescription[0].scales[index].scaleColor,
                            }"
                            v-bind:value="
                              scaleDescription[0].scales[index].scaleColor
                            "
                            readonly
                            disabled
                            v-if="!exportingPdf && !isExporting"
                          />
                          <canvas
                            v-if="exportingPdf || isExporting"
                            v-bind:style="{
                              background:
                                scaleDescription[0].scales[index].scaleColor,
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
                            v-b-tooltip.hover
                            :title="
                              scaleDescription[0].scales[index].scaleLabel
                            "
                            >{{
                              scaleDescription[0].scales[index].scaleLabel
                            }}</span
                          >
                        </li>
                      </ul>
                    </div>
                  </b-collapse>
                </l-control>
                <l-control-fullscreen
                  v-if="showIcons && !exportingPdf && !isExporting"
                  position="topright"
                  class="full-screen"
                  :options="{
                    title: {
                      false: $t('fullScreen'),
                      true: $t('exitFullScreen'),
                    },
                  }"
                />
                <l-control-zoom
                  v-if="showIcons && !exportingPdf && !isExporting"
                  style="padding: 4px 8.5px"
                  position="topright"
                  :zoomInTitle="$t('zoomin')"
                  :zoomOutTitle="$t('zoomout')"
                  class="zoom-inout"
                >
                </l-control-zoom>
                <l-control
                  v-if="showIcons && !exportingPdf && !isExporting"
                  position="topright"
                  class="reset-map"
                >
                  <a
                    href="javascript:void(0)"
                    class=""
                    @click.prevent.stop="reCenterMap"
                    :title="$t('resetMap')"
                    data-html2canvas-ignore="true"
                  >
                    <img
                      src="@/assets/images/icons/icon-refresh.svg"
                      class="w-17px"
                      :style="{ filter: filterColor }"
                    />
                  </a>
                </l-control>
              </l-map>
            </b-col>
          </b-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/*global L*/
import { LMap, LControlZoom, LControl, LGeoJson } from "vue2-leaflet";
import * as LocationModes from "leaflet-dvf";
import LControlFullscreen from "vue2-leaflet-fullscreen";
import "leaflet/dist/leaflet.css";
import domtoimage from "dom-to-image";
import { featureGroup } from "leaflet";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import { isNumber, excludeName } from "@/components/Common/commonFunctions";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default {
  props: [
    "mapData",
    "geoJson",
    "showIcons",
    "mapScales",
    "selectedInd",
    "exportingPdf",
    "isAnalytical",
    "isGenerating",
    "title",
  ],
  components: {
    LMap,
    LControl,
    LGeoJson,
    LControlZoom,
    LControlFullscreen,
  },
  data() {
    return {
      map: null,
      pType: "yearly",
      url: null,
      zoom: 4.5,
      center: [52.119437, 23.145136],
      scaleDescription: [],
      scales: [],
      locNameLayer: null,
      dataLayer: null,
      isChecked: false,
      minVal: null,
      maxVal: null,
      enableTooltip: false,
      isExporting: false,
    };
  },
  mixins: [DynamicImageMixin],
  computed: {
    getOptions() {
      let layerObj = {
        style: this.bstyleFunction,
        onEachFeature: this.onEachFeatureFunction,
      };
      return layerObj;
    },
    bstyleFunction() {
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
    isExporting(newValue) {
      if (newValue) {
        this.removedLocationName();
      } else {
        this.setData(this.mapData);
      }
    },
    mapData: {
      handler(newVal) {
        if (newVal) {
          this.setData(newVal);
        }
      },
      deep: true,
    },
    exportingPdf:{
      handler(newVal){
        if(this.showIcons){
            if(newVal){
              this.zoom = this.zoom - 1;
            }
            else{
              this.zoom = this.zoom + 1;
            }
        }
      },
      deep:true
    }
  },
  methods: {
    async exportChart(type = "jpg", exp = false) {
      this.isExporting = true;
      this.$store.commit("setLoading", true);
      let map = this.$refs.mapObjNew.mapObject;
      let isExpanded = map.isFullscreen();
      let getStyleObj = isExpanded
        ? { width: 1000, quality: 0.95 }
        : { quality: 0.95 };
      if (type === "jpg") {
        await domtoimage
          .toJpeg(document.getElementById("int_map"), getStyleObj)
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
          .toPng(document.getElementById("int_map"), getStyleObj)
          .then((dataUrl) => {
            if (exp) {
              this.$store.commit("setLoading", false);
              this.$emit("mapPic", {
                pic: dataUrl,
                url: this.$store.getters.getActiveTab,
                title: this.title,
              });

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
    mapReady(map) {
      this.$nextTick(() => {
        map.invalidateSize();
        this.reCenterMap();
      });
    },
    reCenterMap() {
      this.$nextTick().then(() => {
        let group = new featureGroup();
        this.$refs.mapObjNew.mapObject.eachLayer(function (layer) {
          if (layer.feature != undefined) group.addLayer(layer);
        });
        this.$refs.mapObjNew.mapObject.fitBounds(group.getBounds(), {
          padding: [10, 10],
        });
        this.exportChart("png", true);
      });
    },
    setMinMax(mapData) {
      mapData.forEach((obj) => {
        let returnVal = obj["data"];
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
    },
    getFillColor(value) {
      let returnColor = "#A0ADBA";
      if (this.isAnalytical) {
        let mFound = this.mapData.find((m) => m.data === value);
        if (mFound) {
          returnColor = mFound.color;
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
    getFeatureValue(locId) {
      let returnVal = null;
      let dataVal = this.mapData.filter((obj) => obj["location"] === locId);
      if (dataVal.length > 0) {
        returnVal = dataVal[0]["data"];
      }
      return returnVal;
    },
    getGeoJsonMapped(indData) {
      let overlaysMap = [];
      if (this.geoJson != null) {
        for (let i in this.geoJson.features) {
          let layerObj = L.geoJson(this.geoJson.features[i]);
          let mapCentroid = layerObj.getBounds().getCenter();
          let findId = indData.filter((obj) => {
            if (obj["location"] === this.geoJson.features[i]["id"]) return obj;
          });
          let nameControlObj = {};
          if (findId.length > 0) {
            nameControlObj = {
              name: excludeName(this.geoJson.features[i]["properties"].name),
              lat: mapCentroid.lat,
              lng: mapCentroid.lng,
              value:
                excludeName(this.geoJson.features[i]["properties"].name) +
                ": " +
                findId[0]["data"],
            };
            overlaysMap.push(nameControlObj);
          }
        }
      }
      return overlaysMap;
    },
    locationNames(overlayData) {
      let textFunction = (value) => {
        return {
          text: value,
          style: {
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
          opacity: 0,
          stroke: true,
          fillOpacity: 0.1,
          dropShadow: false,
          gradient: false,
        },
      };
      this.$nextTick(() => {
        let dataLayer = new L.DataLayer(overlayData, markerOptions);
        let overlayMaps = {};
        if (this.isChecked) {
          overlayMaps["names"] = new L.LayerGroup([dataLayer]).addTo(
            this.$refs.mapObjNew.mapObject
          );
        } else {
          overlayMaps["names"] = new L.LayerGroup([dataLayer]);
        }

        // this.locNameLayer = new L.Control.Layers(null, overlayMaps, {
        //   position: "topleft",
        //   collapsed: false,
        // }).addTo(this.$refs.mapObjNew.mapObject);
      });

      this.$nextTick(() => {
        this.$refs.mapObjNew.mapObject.invalidateSize();
      });
    },
    removedLocationName() {
      if (this.locNameLayer != null) {
        this.locNameLayer._layers.filter((obj) => {
          this.$refs.mapObjNew.mapObject.removeLayer(obj["layer"]);
        });
        this.locNameLayer.remove();
      }

      if (this.dataLayer != null) {
        this.dataLayer.remove();
      }
    },
    getToolTipContent(locationName, locationISO) {
      let value = this.getFeatureValue(locationISO);
      let content =
        '<div style="max-width:180px;"><div style="font-weight: 600;"> ' +
        excludeName(locationName) +
        " : " +
        value.toLocaleString() +
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
    setData(mapData) {
      let overlayData = "";
      if (!this.isAnalytical) {
        this.setMinMax(mapData);
      }
      this.removedLocationName();
      overlayData = this.getGeoJsonMapped(mapData);
      if (this.showIcons) this.locationNames(overlayData);
    },
  },
  created() {
    this.zoom = this.$store.getters.getAppSettings?.defaultMapZoom || 5;
    if (this.isAnalytical) {
      this.scales = [
        ...this.mapScales,
        {
          highScale: null,
          lowScale: null,
          scaleColor: "#A0ADBA",
          scaleLabel: this.$i18n.t("noData"),
        },
      ];
    } else {
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
        // {
        //   highScale: "50",
        //   lowScale: "75",
        //   scaleColor: "#6c7787",
        //   scaleLabel: this.$i18n.t("coverage"),
        // },
        {
          highScale: null,
          lowScale: null,
          scaleColor: "#A0ADBA",
          scaleLabel: this.$i18n.t("noData"),
        },
      ];
    }
    this.scaleDescription.push({ scales: this.scales });
    if (this.mapData) {
      this.setData(this.mapData);
    }
  },
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
