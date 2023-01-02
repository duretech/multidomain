<template>
  <div :key="updateDOM">
    <div
      class="p-0 mapHeight mapHeightNew bubblemap"
      style="height: calc(80vh)"
      ref="map"
      id="bubblemap"
      v-show="showMap"
    >
      <l-map
        ref="mapObj"
        style="
          height: 100%;
          width: 100%;
          background-color: #fff;
          background: #12122a !important;
        "
        :minZoom="2"
        :maxZoom="12"
        :zoom="zoom"
        :center="center"
        :options="{ zoomControl: false }"
        @update:zoom="zoomUpdated"
      >
        <l-tile-layer v-if="url" :url="url"></l-tile-layer>
        <l-control-zoom
          position="topright"
          :zoomInTitle="$t('zoomin')"
          :zoomOutTitle="$t('zoomout')"
        >
        </l-control-zoom>
        <l-control position="topright">
          <a
            href="javascript:void(0)"
            class="mapactionbtn"
            @click.prevent.stop="resetMap"
            style="padding: 4px 8.5px"
            :title="$t('resetMap')"
            data-html2canvas-ignore="true"
          >
            <i class="fa fa-refresh"></i>
          </a>
          <a
            href="javascript:void(0)"
            class="mapactionbtn hide"
            style="top: 35px"
            :title="$t('chartViewIcon')"
            data-html2canvas-ignore="true"
          >
            <i class="fa fa-pie-chart" aria-hidden="true"></i>
          </a>
          <a
            href="javascript:void(0)"
            class="mapactionbtn mt-2"
            style="top: 28px"
            @click.prevent.stop="getImage"
            :title="$t('downloadIcon')"
            data-html2canvas-ignore="true"
          >
            <i class="fa fa-download" aria-hidden="true"></i>
          </a>
          <a
            href="javascript:void(0)"
            class="mapactionbtn"
            style="top: 72px"
            @click.prevent.stop="getTable"
            :title="$t('tableViewIcon')"
            data-html2canvas-ignore="true"
          >
            <i class="fa fa-table" aria-hidden="true"></i>
          </a>
        </l-control>

        <l-control position="topright" class="cust_map_div" style="top: 98px">
          <b-dropdown
            right
            id="dropdown-1"
            text=""
            class="cust_map_dropdown cust_map_bg"
            data-html2canvas-ignore="true"
          >
            <b-form-radio-group
              v-model="selectedvalue"
              :options="optionsradio"
              class="mb-3"
              value-field="item"
              text-field="name"
              v-on:change="layerchange($event)"
              style="top: 70px"
            ></b-form-radio-group>
          </b-dropdown>
        </l-control>

        <l-control v-if="indicatorMeta" position="bottomleft"
          ><span
            style="
              background-color: #fffff5;
              padding: 1px 2px;
              font-size: 0.8125em;
            "
            >{{ $t("source") }}:
            {{ mapObj.source }}</span
          ></l-control
        >

        <l-control v-if="showlegend" position="bottomleft" id="legend">
          <div class="select-wrapper mapindi">
            <div
              v-b-toggle.my-collapse
              class="toggleLegend fs-17-1920 "
              v-b-tooltip.hover
              :title="this.mapObj.indiName"
            >
              {{ this.mapObj.indiName }}
            </div>
          </div>
          <b-collapse id="my-collapse" visible>
            <div class="maplegend mapDivLegend">
              <ul>
                <li>
                  <a
                    class="dropdown-item descVal fs-17-1920"
                    v-for="(scales, index) in scaleDescription[0].scales"
                    :key="index"
                    @click="legendclick(index)"
                  >
                    <input
                      type="color"
                      class="cursor-pointer mapInputBox"
                      @change="newColorForMap($event)"
                      v-bind:style="{
                        color: scaleDescription[0].scales[index].scaleColor,
                      }"
                      v-bind:value="
                        scaleDescription[0].scales[index].scaleColor
                      "
                    />
                    <span class="ml-2">{{
                      scaleDescription[0].scales[index].scaleLabel
                    }}</span></a
                  >
                </li>
              </ul>
            </div>
          </b-collapse>
        </l-control>

        <GeoJson
          v-if="
            geojsoncomponentKey &&
            indiData &&
            indicatorMeta &&
            scaleDescription &&
            mapInstance
          "
          :scaleDesc="scaleDescription"
          :key="geojsonKey"
          @drilldown="drilldown"
          :locName="topLocationName"
          :indicatorObj="indiData"
          :indicatorMeta="indicatorMeta"
          :currentLevel="currentLevel"
          :defaultLevelID="defaultLevelID"
          :itemsDefinition="itemsDefinition"
          :defaultLocationID="currentLocationId"
          :mapInstance="mapInstance"
          :drillObj="drillObj"
          :facilityLevelID="facilityLevelID"
          @geoJsonValue="getGeoJson"
          @currentPeriodFunction="currentPeriodFunction"
          :mapData="mapData"
          :datatype="type"
          :viewflag="viewflag"
          :period="period"
          :defaultView="defaultView"
          :viewType="viewType"
          :globalData="globalData"
          :globalRightData="globalRightData"
          @layerObject="layerObject"
          :countryGeoJson="countryGeoJson"
          :orgUnitLevels="orgUnitLevels"
          :indId="mapObj.indiId"
          :pType="pType"
          :districtParentGeo="districtParentGeo"
          @noGeoJson="noGeoJson"
        />
      </l-map>
    </div>
    <div v-show="showTable">
      <div class="mapTableView mt-3">
        <div class="row">
          <div class="col-sm-12 px-4">
            <a class="float-right cursor-pointer" @click.prevent.stop="getMap"
              ><small class="text-secondary" style="font-weight: 300"
                ><i class="fa fa-arrow-left"></i> {{$t('backToMap')}}</small
              ></a
            >
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-sm-12 px-4">
            <div class="form-group float-right d-flex">
              <label for="filter">&nbsp;</label>
              <input
                type="text"
                class="form-control"
                v-model="filter"
                :placeholder="$t('search')"
                @keydown="$event.stopImmediatePropagation()"
              />
              <download-csv :data="rows">
                <b-button
                  class="btn btn-light btn-md mx-2"
                  style="font-size: 0.938rem"
                  >{{$t('csv')}}</b-button
                >
              </download-csv>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-xs-12 table-responsive px-4">
            <div class="mapPageTableRes mb-3">
              <b-table
                striped
                bordered
                hover
                :fields="columns"
                :items="filteredRows"
                :per-page="perPage"
                :filter="filter"
                class="mapPageDataTable"
                ref="tabObj"
              ></b-table>
            </div>
            <div class="paginaionWrap">
              <div class="paginaionDiv">
                <b-pagination
                  v-model="currentPage"
                  :total-rows="rowsLen"
                  :per-page="perPage"
                  first-text="<<"
                  prev-text="<"
                  next-text=">"
                  last-text=">>"
                  align="center"
                ></b-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*global L*/
/*eslint no-undef: "error"*/
import service from "@/service";
import {
  LMap,
  LControlZoom,
  LControl,
  // LControlLayers,
  LTileLayer,
} from "vue2-leaflet";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet-fullscreen/dist/Leaflet.fullscreen";
import "leaflet/dist/leaflet.css";
import dom_to_image from "dom-to-image/dist/dom-to-image.min.js";
// import easyPrint from 'leaflet-easyprint'
import GeoJson from "./GeoJsonMapIndicator.vue";
// import Markercluster from "./Markercluster.vue";
// import html2canvas from "html2canvas";
import {
	isNumber,
} from "@/components/Common/commonFunctions";
export default {
  name: "Map",
  inheritAttrs: false,
  props: [
    "pType",
    "defaultLevelID",
    "defaultLocationID",
    "subLevelID",
    "periodLength",
    "period",
    "mapObj",
    "mapConfigData",
    "mapOn",
    "resetCurrentLevel",
    "locationChanged",
    "toolbarLevelID",
    "defaultView",
    "toolbarLocationID",
    "facilityLevelID",
    "leftMapChartInfo",
    "mapIndicatorName",
    "mapData",
    "globalData",
    "globalRightData",
    "title",
    "type",
    "viewflag",
    "viewType",
    "childrens",
    "countryGeoJson",
    "orgUnitLevels",
    "districtParentGeo",
  ],
  components: {
    LMap,
    LControlZoom,
    LControl,
    // LControlLayers,
    LTileLayer,
    GeoJson,
    // Markercluster,
  },
  watch: {
    mapData: {
      handler() {
        this.getIndicatordata();
      },
      deep: true,
    },
    colorvalue(newVal) {
      this.legendclick(null, newVal);
    },
    selectedvalue(newVal) {
      // this.layerchange(newVal);
    },

    resetCurrentLevel(newVal) {
      if (newVal) {
        this.currentLevel = this.defaultLevelID;
      }
    },
    locationChanged(newVal) {
      this.toolbarLocationChanged = newVal;
    },
    toolbarLevelID(newVal) {
      this.localToolbarLevelID = newVal;
    },
    toolbarLocationID(newVal) {
      this.localToolbarLocationID = newVal;
    },
  },
  computed: {
    filteredRows() {
      let filteredRows = this.rows.filter((group) => {
        return (
          group.name.toLowerCase().includes(this.searchRow.toLowerCase()) ||
          group.statename.toLowerCase().includes(this.searchRow.toLowerCase())
        );
      });
      //eslint-disable-next-line
      this.rowsLen = filteredRows.length;
      return filteredRows.slice(
        (this.currentPage - 1) * this.perPage,
        this.currentPage * this.perPage
      );
    },
  },
  data() {
    let zoomvalue = "";
    if (this.viewflag) {
      zoomvalue = 5;
    } else {
      zoomvalue = 0;
    }

    return {
      updateDOM: 0,
      isExpanded: false,
      updatedYaerSliderValue: null,
      currentPage: 1,
      searchRow: "",
      alertData: [],
      gColor: [],
      gScale: [],
      isChecked: false,
      defaultZoomLevel: 4,
      fontsize: "10px",
      filter: "",
      columns: [],
      rowsLen: 0,
      perPage: 10,
      rows: [],
      page: 1,
      showMap: true,
      showTable: false,
      isFirstLoad: true,
      defaultScales: null,
      legendClickIndex: 0,
      dataLayer: null,
      overlaysMap: null,
      colorvalue: "",
      defaults: {
        disabled: false,
        "dot-size": 25,
        "hide-canvas": false,
        "hide-inputs": false,
        "hide-mode-switch": false,
        mode: null,
        "show-swatches": false,
        "swatches-max-height": 200,
      },
      options: {
        booleans: [
          "disabled",
          "hide-canvas",
          "hide-inputs",
          "hide-mode-switch",
          "show-swatches",
        ],
        selects: {
          mode: ["rgba", "hsla", "hexa"],
        },
        sliders: {
          "dot-size": [0, 50],
          "swatches-max-height": [100, 250],
        },
      },
      tabs: [],
      swatches: [
        ["#FF0000", "#AA0000", "#550000"],
        ["#FFFF00", "#AAAA00", "#555500"],
        ["#00FF00", "#00AA00", "#005500"],
        ["#00FFFF", "#00AAAA", "#005555"],
        ["#0000FF", "#0000AA", "#000055"],
      ],

      url: null,
      zoom: zoomvalue,
      //  center: [0, 0.709953],
      center: L.latLng(0, 0),
      bounds: null,
      indiData: null,
      itemsDefinition: null,
      indicatorMeta: null,
      tileLayerFlag: true,
      geojsoncomponentKey: false,
      onZoomKey: true,
      serviceCheck: false,
      geojsonKey: 0,
      mapInstance: null,
      currentLevel: 0,
      //currentLevel: this.defaultLevelID,
      drillObj: null,

      defaultLocalLevelId: this.defaultLevelID,
      currentLocationId: this.defaultLocationID,
      toolbarLocationChanged: this.locationChanged,
      localToolbarLevelID: this.toolbarLevelID,
      localToolbarLocationID: this.toolbarLocationID,
      topLocationName: "",
      map: null,
      locNameLayer: null,
      geoJson: null,
      scaleDescription: null,
      showlegend: false,
      mapCentroid: {},
      // selected: '',
      selectedvalue: "Default",
      optionsradio: [
        {
          name: "OpenStreetMap.Mapnik",
          item: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        },
        {
          name: "OpenTopoMap",
          item: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        },
        {
          name: "CartoDB.DarkMatter",
          item: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        },
        {
          name: "Esri.DeLorme",
          item: "https://server.arcgisonline.com/ArcGIS/rest/services/Specialty/DeLorme_World_Base_Map/MapServer/tile/{z}/{y}/{x}",
        },
        {
          name: "Esri.WorldImagery",
          item: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        },
        {
          name: "Default",
          item: "Default",
        },
      ],
    };
  },
  methods: {
    noGeoJson(value) {
      if (!value) {
        this.$emit("noGeoJson", false);
      }
    },
    updatePage() {
      var that = this;
      let data = this.globalRightData[this.period].sort((a, b) => {
        return b.value - a.value;
      });

      data.forEach(function (v) {
        that.rows.push({ name: v.name, value: v.value });
      });

      this.rows = data.slice(
        (this.page - 1) * this.perPage,
        this.page * this.perPage
      );
    },
    getMap() {
      this.rows = [];
      this.showMap = true;
      this.showTable = false;
        this.updateDOM++;
      this.$nextTick(() => {
        // this.geojsonKey++;
      })
      // this.$emit("mapLoaded", false);
      //this.getGeoJson(this.geoJson)
      // this.overlaysMap = null
      // this.dataLayer = null
      //this.getIndicatordata(this.mapObj.indiId)
    },
    getTable() {
      var that = this;
      let data = this.globalRightData[this.period].sort((a, b) => {
        return b.value - a.value;
      });

      if (this.viewType == "map") {
        this.columns = [
          {
            label: this.$i18n.t("name"),
            key: "name", // field changed to key
            headerClass: "class-in-header second-class",
            sortable: true,
          },
          { label: this.$i18n.t("value"), key: "value", sortable: true },
        ];
        data.forEach(function (v) {
          that.rows.push({ name: v.name, value: v.value });
        });
      } else {
        this.columns = [
          {
            label: this.$i18n.t("name"),
            key: "name",
            headerClass: "class-in-header second-class",
            sortable: true,
          },
          { label: this.$i18n.t("value"), key: "value", sortable: true },
          { label: this.$i18n.t("type"), key: "type", sortable: true },
          { label: "State Name", key: "statename", sortable: true },
        ];

        data.forEach(function (v) {
          that.rows.push({
            name: v.name,
            value: v.value,
            type: v.group,
            statename: v.parent,
          });
        });
      }

      this.rowsLen = this.rows.length;
      this.showMap = false;
      this.showTable = true;
    },
    layerObject() {},
    newColorForMap(e) {
      this.$store.state.loading = true;
      this.scaleDescription[0].scales[this.legendClickIndex].scaleColor =
        e.target.value;
      this.legendClickIndex = 0;
      this.geojsonKey++;
    },
    currentPeriodFunction(year) {
      this.$emit("bubbleCurrentYearFunction", year);
      //this.getScales(this.indicatorMeta)
      this.updatedYaerSliderValue = year;
    },
    legendclick(index) {
      this.legendClickIndex = index;
    },
    layerchange(event) {
      this.url = event;
    },
    async getScreenShot() {
      let map = null;
      await html2canvas(this.$refs.map)
        .then((canvas) => {
          map = canvas.toDataURL();
        })
        .catch((error) => {
          map = null;
          console.log("Erorr in map screenshot capture...", error);
        });
      return map;
    },

    getGeoJson(response, currYear = null) {
      this.geoJson = response;
      this.removedLocationName();
      let yearArr = Object.keys(this.indiData);
      let currentYear = currYear ? currYear : yearArr[yearArr.length - 1];
      let overlaysMap = [];
      if (Object.keys(this.indiData).length > 0) {
        Object.keys(this.indiData[currentYear]).forEach((id, j) => {
          let nameControlObj = {};
          if (response != null) {
            let filteredFeature = response.features.filter((f) => id === f.id);
            for (let i = 0, len = filteredFeature.length; i < len; i++) {
              let layerObj = L.geoJson(filteredFeature[i]);
              var mapCentroid = layerObj.getBounds().getCenter();
              this.mapCentroid = mapCentroid;
              // console.log("this.mapCentroid", this.mapCentroid)
              // if(j == 0) {
                this.center = [mapCentroid.lat, mapCentroid.lng]
              // }
              if (mapCentroid.lat && mapCentroid.lng) {
                nameControlObj = {
                  name: filteredFeature[i]["properties"].name,
                  lat: Number(mapCentroid.lat),
                  lng: Number(mapCentroid.lng),
                  value:
                    filteredFeature[i]["properties"].name +
                    ": " +
                    this.indiData[currentYear][id],
                };
              }
            }

            // for (var i in response.features) {
            //   let layerObj = L.geoJson(response.features[i]);
            //   var mapCentroid = layerObj.getBounds().getCenter();
            //   this.mapCentroid = mapCentroid;
            //
            //   if (
            //     id == response.features[i]["id"] &&
            //     mapCentroid.lat &&
            //     mapCentroid.lng
            //   ) {
            //     //nameControlObj = {name: response.features[i]['properties'].name,
            //
            //     nameControlObj = {
            //       name: response.features[i]["properties"].name,
            //       lat: Number(mapCentroid.lat),
            //       lng: Number(mapCentroid.lng),
            //       value:
            //         response.features[i]["properties"].name +
            //         ": " +
            //         this.indiData[currentYear][id],
            //     };
            //   }
            // }
          }
          overlaysMap.push(nameControlObj);
        });
      }

      this.overlaysMap = overlaysMap;
      this.locationNames();
      // var overlayMaps = {
      //   [this.$i18n.t("names")]: L.layerGroup([this.dataLayer]),
      // };

      // this.locNameLayer = L.control
      //   .layers(null, overlayMaps, { position: "topleft", collapsed: false })
      //   .addTo(this.$refs.mapObj.mapObject);

      // this.$emit("mapLoaded", true);
    },
    locationNames() {
      var that = this;
      let data = this.overlaysMap;
      var textFunction = function (value) {
        let font = "10px";
        return {
          text: value,
          style: {
            // "fill": font,
            "font-size": that.fontsize,
            "font-family": "cursive",
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
            //radius: radiusFunction,
            text: textFunction,
          },
        },
        layerOptions: {
          numberOfSides: 50,
          radius: 1,
          weight: 0,
          color: "#fff",
          opacity: 0,
          stroke: true,
          fillOpacity: 0.1,
          dropShadow: false,
          gradient: false,
        },
      };
      this.dataLayer = new L.DataLayer(data, markerOptions);
      var overlayMaps = {};
      // console.log("this.isChecked", this.isChecked);
      if (this.isChecked) {
        overlayMaps = {
          [this.$i18n.t("names")]: L.layerGroup([this.dataLayer]).addTo(
            this.$refs.mapObj.mapObject
          ),
        };
      } else {
        overlayMaps = {
          [this.$i18n.t("names")]: L.layerGroup([this.dataLayer]),
        };
      }

      this.locNameLayer = L.control
        .layers(null, overlayMaps, { position: "topleft", collapsed: false })
        .addTo(this.$refs.mapObj.mapObject);

      this.$emit("mapLoaded", true);
    },
    zoomUpdated(zoom) {
      // console.log("zoom", zoom)
      // console.log("this.defaultZoomLevel", this.defaultZoomLevel)
      // console.log(document.getElementsByClassName("leaflet-control-layers-selector"))
      if (
        document.getElementsByClassName("leaflet-control-layers-selector")
          .length != 0 &&
        document.getElementsByClassName("leaflet-control-layers-selector")[0]
          .checked
      ) {
        this.isChecked = true;
      } else {
        this.isChecked = false;
      }

      if (this.defaultZoomLevel != zoom) {
        this.defaultZoomLevel == zoom;
        if (zoom == 3 || zoom == 4) {
          this.fontsize = "8px";
        } else if (zoom == 5) {
          this.fontsize = "9px";
        } else if (zoom == 6) {
          this.fontsize = "10px";
        } else if (zoom == 7) {
          this.fontsize = "11px";
        } else if (zoom == 8) {
          this.fontsize = "12px";
        } else {
          this.fontsize = "14px";
        }
        this.removedLocationName();
        this.locationNames();
      } else if (this.defaultZoomLevel == 4) {
        this.removedLocationName();
        this.fontsize = "8px";
        this.locationNames();
      }
    },
    async downloadURI() {
      var map = this.$refs.mapObj.mapObject;
      this.isExpanded = map.isFullscreen();
      let getStyleObj = this.isExpanded
        ? {
            width: window.outerWidth,
            height: window.outerHeight,
            quality: 0.95,
          }
        : { quality: 0.95 };
      await dom_to_image
        .toJpeg(document.getElementById("bubblemap"), getStyleObj)
        .then(function (dataUrl) {
          var link = document.createElement("a");
          link.download = "my_image.jpg";
          link.href = dataUrl;
          link.click();
        })
        .catch(function (error) {
          console.error("oops, something went wrong!", error);
        });
    },
    getImage() {
      this.downloadURI();
      // let _that = this;
      // html2canvas(document.getElementById("bubblemap"), {
      //   // position: "relative",
      //   top: 3000,
      //   backgroundColor: null,
      //   logging:true,
      //   allowTaint: true,
      //   useCORS: true,
      //   // scale: 3,
      //   // height: 8000,
      //   // width : window.outerWidth + window.innerWidth,
      //   // windowWidth : window.outerWidth + window.innerWidth,
      //   // height: window.outerHeight + window.innerHeight,
      //   // windowHeight: window.outerHeight + window.innerHeight,
      //   scrollY: -window.scrollY,
      //   scrollX: -window.scrollX,
      // })
      // .then(function (canvas) {
      //   var myImage = canvas.toDataURL("image/png");
      //   _that.downloadURI("data:" + myImage, "yourImage.png");
      // });
    },
    drilldown(e) {
      if (this.currentLevel + 1 < this.facilityLevelID) {
        this.geoJson = null;
      }

      //if (this.defaultLocalLevelId+1 < this.facilityLevelID-1) {
      this.currentLevel++;
      this.defaultLocalLevelId++;
      this.drillObj = e.target;
      let locationValue =
        this.defaultLocalLevelId + "/" + this.drillObj.feature.id;
      this.$emit("setLocationOnReset", {
        locationValue: locationValue,
        type: "drilldown",
      });
      //this.getIndicatordata(this.mapObj.indiId)
      this.getGeoJson(this.geoJson);
      //}
    },
    getScales(indicatorMeta) {
      this.scaleDescription = [];
      this.gColor = [];
      this.gScale = [];
      // console.log("indicatorMeta", indicatorMeta)
      //let scaleDescription = indicatorMeta[0].indicator.levels.filter(c => c.level === this.currentLevel)
      this.scaleDescription = JSON.parse(JSON.stringify(indicatorMeta)).filter(
        (c) => c.level === this.currentLevel
      );
      // console.log("this.scaleDescription", this.scaleDescription)
      this.scaleDescription[0].scales.forEach((scale) => {
        this.gColor.push(scale.scaleColor);
        this.gScale.push(scale.scaleLabel);
      });
      // console.log(this.scaleDescription[0].isAutoRange)
      if (this.scaleDescription[0].isAutoRange == true) {
        //console.log('eferferfer')
        let color = [],
          scaleD = [];
        this.scaleDescription[0].scales.forEach((scale) => {
          color.push(scale.scaleColor);
          scaleD.push(scale.scaleLabel);
        });

        let valArray = [];
        // console.log("this.indiData", this.indiData)
        // console.log("this.currentLocationId", this.currentLocationId)
        Object.keys(this.indiData).forEach((y) => {
          if (y === this.period) {
            // console.log("this.indiData", this.indiData[y])
            Object.keys(this.indiData[y]).forEach((id) => {
              if (id !== this.currentLocationId) {
                valArray.push(this.indiData[y][id]);
              }
            });
          }
        });
        let maxValue = Math.max.apply(Math, valArray);
        let medianValue = isNumber(maxValue) && valArray.length ? Math.ceil(maxValue / 4) : 0;
        // console.log("medianValue", medianValue)
        // console.log("this.gScale", this.gScale)
        // console.log("this.gScale.length", this.gScale.length)
        // let array = [];
        let legendScales = {
          lowScale: [],
          highScale: [],
          scaleDesc: [],
          colorScale: this.gColor,
        };

        let lowScaleMinValue = 0;
        let highScaleMinValue = medianValue;

        for (var i = 0; i < this.gScale.length; i++) {
          if (i == 0) {
            legendScales["lowScale"].push(0);
            legendScales["highScale"].push(highScaleMinValue);
          } else {
            lowScaleMinValue += medianValue;
            highScaleMinValue += medianValue;
            legendScales["lowScale"].push(lowScaleMinValue);
            legendScales["highScale"].push(highScaleMinValue);
          }
        }
        // console.log("this.gColor", this.gColor)
        // console.log("legendScales", legendScales)

        let scales = [];
        for (let i = 0; i < legendScales["lowScale"].length; i++) {
          let scaleDescValue = "";
          // if (i == legendScales["lowScale"].length - 1) {
          //   scaleDescValue =
          //     this.gScale[i] + " (" + legendScales["lowScale"][i] + " + )";
          // } else {
          scaleDescValue =
            this.gScale[i] +
            " (" +
            legendScales["lowScale"][i] +
            " - " +
            legendScales["highScale"][i] +
            ")";
          // }

          let scaleArr = scaleDescValue.split("("),
            scaledesc = "";
          if (scaleArr.length > 2) {
            scaledesc = scaleArr[0] + "(" + scaleArr[scaleArr.length - 1];
          } else {
            scaledesc = scaleDescValue;
          }
          scales.push({
            highScale: legendScales["highScale"][i],
            lowScale: legendScales["lowScale"][i],
            scaleColor: legendScales["colorScale"][i],
            scaleLabel: scaledesc,
          });
        }
        // console.log("scales", scales)
        this.scaleDescription[0].scales = scales;
        //scaleD = []
        // this.scaleFlag = false;
        var index = this.scaleDescription[0].scales.findIndex((x) =>
          x.scaleLabel.includes(this.$i18n.t("noData"))
        );

        if (index === -1) {
          this.scaleDescription[0].scales.push({
            highScale: "",
            lowScale: "",
            scaleColor: "#FFFFFF",
            scaleLabel: this.$i18n.t("noData"),
          });
        }
        if (this.isFirstLoad) {
          this.isFirstLoad = false;
          sessionStorage.setItem("defaultScales", JSON.stringify(scales));
        }
      } else {
        var index = this.scaleDescription[0].scales.findIndex(
          (x) => x.scaleLabel == this.$i18n.t("noData")
        );

        if (index === -1) {
          this.scaleDescription[0].scales.push({
            highScale: "",
            lowScale: "",
            scaleColor: "#FFFFFF",
            scaleLabel: this.$i18n.t("noData"),
          });
        }

        if (this.isFirstLoad) {
          this.isFirstLoad = false;
          sessionStorage.setItem(
            "defaultScales",
            JSON.stringify(this.scaleDescription[0].scales)
          );
        }
      }
      this.$emit("scales", this.scaleDescription[0].scales);
      // this.geojsonKey++;
    },
    getIndicatordata() {
      this.$store.state.loading = true;
      if (this.toolbarLocationChanged) {
        this.defaultLocalLevelId = this.localToolbarLevelID;
        this.currentLevel = this.localToolbarLevelID;
        this.currentLocationId = this.localToolbarLocationID;
      } else {
        if (this.defaultLocalLevelId != this.defaultLevelID) {
          this.currentLocationId = this.drillObj.feature.id;
        } else {
          this.currentLocationId = this.defaultLocationID;
        }
      }
      //let period = moment(this.period, "YYYYMM").format("YYYYMM");
      this.indiData = this.mapData;
      this.indicatorMeta = this.mapConfigData;
      this.scaleDescription = null;
      (this.gColor = []), (this.gScale = []);
      this.getScales(this.indicatorMeta);
      //this.$emit("setIndicatordata", this.indicatorMeta);
      this.$store.state.loading = false;
      this.geojsoncomponentKey = true;
      this.showlegend = true;
      this.geojsonKey++;
    },
    removedLocationName() {
      if (this.locNameLayer != null) {
        this.locNameLayer._layers.filter((obj) => {
          this.$refs.mapObj.mapObject.removeLayer(obj["layer"]);
        });
        this.locNameLayer.remove();
      }
    },

    getServices() {
      var param = {
        encryptedUserName: "user",
        encryptedCredentials: "cred",
        roleid: "1",
        datatype: "4",
        datalevel: "1",
        appid: this.$root.config.appId,
        langid: "1",
        cityid: "0",
      };
      var that = this;
      service.getApidData(param).then((res) => {
        that.servicedata = res;
        that.serviceCheck = true;
      });
    },
    resetMap() {
      // console.log(JSON.parse(sessionStorage.getItem("defaultScales")));
      this.toolbarLocationChanged = this.locationChanged;
      //this.mapInstance.setZoom(this.zoom);
      this.currentLevel = this.defaultLevelID;
      this.defaultLocalLevelId = this.defaultLevelID;
      this.updatedYaerSliderValue = null;
      this.currentLocationId = this.defaultLocationID;
      this.toolbarLocationChanged = this.locationChanged;
      this.localToolbarLevelID = this.defaultLevelID;
      this.localToolbarLocationID = this.defaultLocationID;
      this.defaultScales = JSON.parse(sessionStorage.getItem("defaultScales"));
      this.scaleDescription[0].scales = this.defaultScales;
      this.$emit("scales", this.scaleDescription[0].scales);
      this.geojsonKey++;
      let locationValue = this.defaultLevelID + "/" + this.defaultLocationID;

      this.$emit("setLocationOnReset", {
        locationValue: locationValue,
        type: "reset",
      });
    },
  },
  created() {
    if (this.mapObj != null) {
      // this.zoom = this.mapObj.zoom;
      // this.center = [this.mapObj.lat, this.mapObj.lang]

      this.currentLevel = this.toolbarLevelID;
      (this.defaultLocalLevelId = this.defaultLevelID),
        (this.currentLocationId = this.defaultLocationID),
        (this.toolbarLocationChanged = this.locationChanged),
        (this.localToolbarLevelID = this.toolbarLevelID),
        (this.localToolbarLocationID = this.toolbarLocationID);

      //this.getServices();
      //this.mapInstance = this.$refs.mapObj;
      //this.toolbarLocationChanged = this.locationChanged

      this.getIndicatordata();
    }
    // console.log("this.zoom", this.zoom)
  },
  mounted() {
    this.mapInstance = this.$refs.mapObj;
    const map = this.$refs.mapObj.mapObject;
    map.addControl(
      new L.Control.Fullscreen({
        position: "topright",
        title: {
          false: this.$i18n.t("fullscreen"),
          true: this.$i18n.t("exitscreen"),
        },
      })
    );
    // var tileL = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar'}).addTo(map);
    // var printer = L.easyPrint({
    //       tileLayer: tileL,
    //     //  hidden: true,
    //       sizeModes: ['A4Portrait'],
    //       filename: 'myMap',
    //       exportOnly: true,
    //       // CORS:true,
    //      // title:"Print",
    //       hideControlContainer: false
    //   }).addTo(map);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.mapactionbtn {
  /*position: absolute;
        top: -10px;
        right: -10px;
        background-color: #212121;
        padding: 5px 10px;
        border: 1px solid #ddd;
        color: #fff !important;
        border-radius: 5px;*/

  position: absolute;
  top: 0;
  right: 0px;
  -webkit-box-shadow: 0 0px 2px rgba(0, 0, 0, 0.65) !important;
  box-shadow: 0 0px 2px rgba(0, 0, 0, 0.65) !important;
  background-color: #ffffff;
  padding: 4px 8px;
  border: 0px solid #ddd;
  // color: #000 !important;
  border-radius: 5px;
}
.leaflet-control {
  cursor: pointer;
}
/*.leaflet-control-layers {
        position: absolute;
        bottom: -105px;
        left: 0px;
        border-radius: 5px;
        width: 71px;
    }*/

.leaflet-left .leaflet-control-zoom {
  margin-top: 2px;
}

.leaflet-bar {
  -webkit-box-shadow: 0 0px 2px rgba(0, 0, 0, 0.65) !important;
  box-shadow: 0 0px 2px rgba(0, 0, 0, 0.65) !important;
  border-radius: 4px;
  border: 0px;
}
.leaflet-bar {
  -webkit-box-shadow: 0 0px 2px rgba(0, 0, 0, 0.65) !important;
  box-shadow: 0 0px 2px rgba(0, 0, 0, 0.65) !important;
  border-radius: 4px;
}
.dropup .dropdown-toggle::after {
  display: none;
}
.maplegend button {
  // background-color: #fff !important;
  -webkit-box-shadow: 0 0px 2px rgba(0, 0, 0, 0.65) !important;
  box-shadow: 0 0px 2px rgba(0, 0, 0, 0.65) !important;
  padding: 1px 6px !important;
  border: 0px solid #ddd !important;
  // color: #000 !important;
  border-radius: 5px !important;
  top: 35px !important;
  left: -18px !important;
  position: absolute;
}
.mapDivLegend {
  width: 220px;
  position: relative !important;
  bottom: 0px;
  left: 1px;
  height: 100%;
  background: rgb(52 51 97 / 87%);
  color: #000 !important;
  //margin-top: 15%;
  max-height: 174px;
  overflow: hidden;
  overflow-y: auto;
  border-radius: 0;
  z-index: 9999;
  // padding: 6px 6px;
  ul {
    list-style: none;
    padding-left: 0;
    margin-top: 3%;
    margin-bottom: 2%;
    li {
      a {
        padding-left: 3%;
        padding-right: 3%;
        color: #fff;
        font-size: 0.8125rem;
        font-weight: 300;
        //font-family: "Montserrat-Regular";
        &:hover{
              background-color: #12122a;
        }
      }
    }
  }
}

.custom-control-inline {
  margin-left: 1rem !important;
}
.dropdown-item {
  padding: 0.2rem 1.5rem;
  padding-left: 5%;
  .fa.fa-square {
    font-size: 1rem;
  }
}
.mapDivLegend ul li a:active {
  background: #12122a;
}
.toggleLegend {
  width: 220px;
  position: relative !important;
  bottom: 0;
  left: 1px;
  height: 48px;
  background: #f4f4f4;
  padding: 8px 30px 8px 10px;
  cursor: pointer;
  font-weight: 600;
  overflow: hidden;
  //text-overflow: ellipsis;
  // display: -webkit-box;
  // -webkit-line-clamp: 2;
  // -webkit-box-orient: vertical;
}
.select-wrapper:after {
  font-family: FontAwesome;
  content: "\F0D7";
  font-size: 1rem;
  position: absolute;
  top: 12px;
  right: 11px;
  color: #d9d9d9;
  pointer-events: none;
}
.mapInputBox {
  background: transparent;
  border: 0;
  width: 25px;
  height: 25px;
}
.mapTableView {
  height: calc(100vh - 110px);
  overflow: hidden;
  overflow-y: scroll;
}

.descVal {
  cursor: auto;
}
// .cust_map_div{
//         position: relative;
//     top: 57px;
// }
.mapPageTableRes {
  max-height: 350px;
  overflow: hidden;
  overflow-y: scroll;
}
</style>
