<template>
  <div class="p-0 mapHeight" style="height: calc(100vh - 350px)" ref="map">
    <l-map
      ref="mapObj"
      style="height: 100%; width: 100%; background-color: #fff"
      :minZoom="2"
      :maxZoom="20"
      :zoom="zoom"
      :center="center"
      :options="{ zoomControl: false }"
    >
      <!--@update:zoom="zoomUpdated"-->
      <l-tile-layer v-if="tileLayerFlag" :url="url"></l-tile-layer>
      <l-control-zoom position="topleft" :zoomInTitle="$t('zoomin')"
        :zoomOutTitle="$t('zoomout')"></l-control-zoom>
      <l-control position="topleft">
        <!--<div class="resetMap-button mapactionbtn" @click="resetMap" :title="$t('resetMap')"><span class="fa fa-sync"></span></div>-->

        <!-- <a href="#" class="mapactionbtn" @click="resetMap" :title="$t('resetMap')">
                      <i class="fa fa-refresh"></i>
                  </a> -->
        <!-- <a href="#" class="mapactionbtn" @click="exportMap"  style="top: 25px;" title="Export Map">
                      <i class="fa fa-download"></i>
                  </a> -->
        <a
          href="#"
          class="mapactionbtn hide"
          style="top: 25px"
          :title="$t('tableViewIcon')"
        >
          <i class="fa fa-table"></i>
        </a>
      </l-control>
      <l-control position="topright">
        <b-dropdown
          right
          id="dropdown-1"
          text=""
          class="cust_map_dropdown mt-4"
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

          <!-- <b-form-radio-group v-model="selectedvalue" :options="optionsradio" class="mb-3" value-field="item" text-field="name" ></b-form-radio-group>-->
        </b-dropdown>
      </l-control>

      <l-control v-if="showlegend" position="topleft">
        <div class="maplegend mapDivLegend">
          <ul>
            <li>
              <a
                class="dropdown-item"
                v-for="(scales, index) in scaleDescription[0].scales"
                :key="index"
                ><i
                  class="fa fa-circle"
                  v-bind:style="{
                    color: scaleDescription[0].scales[index].scaleColor,
                  }"
                ></i>
                {{ scaleDescription[0].scales[index].scaleLabel }}</a
              >
            </li>
          </ul>
        </div>

        <div class="btn-group dropup maplegend d-none">
          <button
            type="button"
            class="btn btn-secondary dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <i class="fa fa-circle pr-2" aria-hidden="true"></i>
          </button>
          <div class="dropdown-menu">
            <a
              class="dropdown-item"
              style="cursor: default"
              v-for="(scales, index) in scaleDescription[0].scales"
              :key="index"
              ><i
                class="fa fa-circle"
                v-bind:style="{
                  color: scaleDescription[0].scales[index].scaleColor,
                }"
              ></i>
              {{ scaleDescription[0].scales[index].scaleLabel }}</a
            >
            <!--<a class="dropdown-item" href="#"><i class="fa fa-circle" style="color: #3783a5"></i> 10-20</a>
                          <a class="dropdown-item" href="#"><i class="fa fa-circle" style="color: #68a7ca"></i> 20-30</a>

                          <a class="dropdown-item" href="#"><i class="fa fa-circle" style="color: #b4dff2"></i> 30-40</a>-->
          </div>
        </div>
        <!--<b-card no-body class="mb-1 legend">
                      <b-card-header header-tag="header" class="p-1" role="tab">
                          <b-button block href="#" v-b-toggle.legend-1 variant="info">Range:</b-button>
                      </b-card-header>
                      <b-collapse id="legend-1" visible accordion="legend-1" role="tabpanel">
                          <b-card-body>
                              <div style="margin-top: 2px;" v-for="(color, index) in scaleDescription[0].colorScale" :key="index">
                                  <i class="cursor-pointer legend-spectrum" v-bind:style="{ 'background-color': color, 'width': '21px' ,'height': '18px', 'float': 'left' , 'margin-right': '8px' ,' opacity': '1' }"></i>
                                  <span class="cursor-pointer showthisrange" style="font-weight: normal;">{{scaleDescription.scaleDesc[index]}}</span>
                              </div>
                              <div style="margin-top: 2px;">
                                  <i class="legend-spectrum" spectrum-color="#eee;" style="background:#eee;width: 21px;height: 18px;float: left;margin-right: 8px;opacity: 1;"></i>
                                  <span class="showthisrange highlight-eee">No Data</span>
                              </div>
                          </b-card-body>
                      </b-collapse>
                  </b-card>-->
      </l-control>
      <GeoJson
        v-if="
          geojsoncomponentKey && indiData && indicatorMeta && scaleDescription
        "
        :scaleDesc="scaleDescription"
        :key="geojsonKey"
        @drilldown="drilldown"
        :locName="topLocationName"
        :indicatorObj="indiData"
        :indicatorMeta="indicatorMeta"
        :currentLevel="currentLevel"
        :itemsDefinition="itemsDefinition"
        :defaultLocationID="currentLocationId"
        :mapInstance="mapInstance"
        :drillObj="drillObj"
        :facilityLevelID="facilityLevelID"
        @geoJsonValue="getGeoJson"
        type="bubble"
        :mapData="mapData"
        :periodType="periodType"
      />
      <!--<l-control-layers v-if="serviceCheck" ref="control"></l-control-layers>
              <Markercluster v-if="serviceCheck" :servicedata="servicedata" :mapInstance="mapInstance" />-->
      <!-- <l-control v-if="indicatorMeta" position="bottomright"><span style="background-color: #fffff5;padding: 1px 2px; font-size:0.8125em">{{$t('source')}}: {{indicatorMeta[0].indicator.source}}</span></l-control> -->
    </l-map>

    <b-modal
      v-model="modalShow"
      hide-footer
      centered
      size="xl"
      :title="mapIndicatorName"
    >
      <!-- <highcharts class="chartHeight h-100 align-items-center justify-content-center d-flex" :options="chartOptions"></highcharts> -->
    </b-modal>
    <b-modal ref="my-modal" hide-footer hide-header>
      <div class="d-block text-center">
        {{
          $t(
            "indicator_data_not_avialable"
          )
        }}
      </div>
    </b-modal>
  </div>
</template>

<script>
import service from "@/service";
import {
  LMap,
  LControlZoom,
  LControl,
  LControlLayers,
  LTileLayer,
} from "vue2-leaflet";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet-fullscreen/dist/Leaflet.fullscreen";
import "leaflet/dist/leaflet.css";
import GeoJson from "./GeoJson.vue";
import Markercluster from "./Markercluster.vue";
import * as easyPrint from "leaflet-easyprint";
import html2canvas from "html2canvas";
import { formatSingleDate } from "@/components/Common/commonFunctions";

export default {
  name: "Map",
  props: [
    "defaultLevelID",
    "defaultLocationID",
    "subLevelID",
    "period",
    "mapObj",
    "resetCurrentLevel",
    "locationChanged",
    "toolbarLevelID",
    "toolbarLocationID",
    "facilityLevelID",
    "mapIndicatorName",
    "mapData",
    "title",
    "periodType",
  ],
  components: {
    LMap,
    LControlZoom,
    LControl,
    LControlLayers,
    LTileLayer,
    GeoJson,
    Markercluster,
  },
  watch: {
    mapObj: {
      handler(newVal) {
        this.getIndicatordata(newVal.indiId);
      },
      deep: true,
    },
    resetCurrentLevel(newVal) {
      //console.log(newVal)
      if (newVal) {
        this.currentLevel = this.defaultLevelID;
      }
    },
    locationChanged(newVal) {
      //console.log(newVal)
      //if (newVal) {
      this.toolbarLocationChanged = newVal;
      //}
    },
    toolbarLevelID(newVal) {
      this.localToolbarLevelID = newVal;
    },
    toolbarLocationID(newVal) {
      this.localToolbarLocationID = newVal;
    },
    selectedvalue(newVal) {
      this.layerchange(newVal);
    },
  },
  data() {
    //console.log(this.periodType)
    return {
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      zoom: 0,
      center: [0, 0],
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
      drillObj: null,

      defaultLocalLevelId: this.defaultLevelID,
      currentLocationId: this.defaultLocationID,
      toolbarLocationChanged: this.locationChanged,
      localToolbarLevelID: this.toolbarLevelID,
      localToolbarLocationID: this.toolbarLocationID,
      modalShow: false,
      topLocationName: "",
      map: null,
      locNameLayer: null,
      geoJson: null,
      scaleDescription: null,
      showlegend: false,
      mapCentroid: {},
      selectedvalue: "",
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
      ],
    };
  },
  methods: {
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

    getGeoJson(response) {
      this.geoJson = response;
      this.removedLocationName();
      let yearArr = Object.keys(this.indiData);
      let currentYear = yearArr[yearArr.length - 1];
      let overlaysMap = [];
      if (Object.keys(this.indiData).length > 0) {
        Object.keys(this.indiData[currentYear]).forEach((id) => {
          let nameControlObj = {};
          if (response != null) {
            for (var i in response.features) {
              let layerObj = L.geoJson(response.features[i]);
              var mapCentroid = layerObj.getBounds().getCenter();
              this.mapCentroid = mapCentroid;
              if (id == response.features[i]["id"]) {
                nameControlObj = {
                  name: response.features[i]["properties"].name,
                  lat: mapCentroid.lat,
                  lng: mapCentroid.lng,
                  value:
                    response.features[i]["properties"].name +
                    ": " +
                    this.indiData[currentYear][id],
                };
              }
            }
          }
          overlaysMap.push(nameControlObj);
        });
      }
      let data = overlaysMap;
      var textFunction = function (value) {
        return {
          text: value,
          style: {
            fill: "#000",
            "font-size": "0.625rem",
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
      var dataLayer = new L.DataLayer(data, markerOptions);

      var overlayMaps = {
        [this.$i18n.t("location")]: L.layerGroup([
          dataLayer,
        ]),
      };
      this.locNameLayer = L.control
        .layers(null, overlayMaps, { position: "topright", collapsed: false })
        .addTo(this.mapInstance.mapObject);
    },
    fullScreen() {
      setTimeout(() => {
        this.modalShow = true;
      }, 100);
    },
    zoomUpdated(zoom) {
      let conZom = this.currentLevel == 1 ? 6 : 8;
      if (zoom >= conZom && this.onZoomKey) {
        this.geojsoncomponentKey = false;
        this.tileLayerFlag = true;
        this.onZoomKey = false;
      } else if (zoom < conZom && !this.onZoomKey) {
        this.geojsoncomponentKey = true;
        this.tileLayerFlag = false;
        this.onZoomKey = true;
      }
    },
    drilldown(e) {
      //console.log(e)
      //console.log(this.currentLevel)
      //console.log(this.defaultLocalLevelId+1)
      //console.log(this.facilityLevelID)
      if (this.currentLevel + 1 < this.facilityLevelID) {
        this.geoJson = null;
      }
      //if (this.defaultLocalLevelId+1 < this.facilityLevelID-1) {
      this.currentLevel++;
      this.defaultLocalLevelId++;
      this.drillObj = e.target;

      let locationValue =
        this.defaultLocalLevelId + "/" + this.drillObj.feature.id;
      this.$emit("setLocationOnReset", locationValue);

      //this.getIndicatordata(this.mapObj.indiId)
      this.getGeoJson(this.geoJson);
      //}
    },
    getIndicatordata(id) {
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

      let period = formatSingleDate({
        rawDate: this.period,
        periodType: this.periodType,
      });

      let rData = { [period]: {} },
        scaleDescription = [{ scales: [] }],
        indicatorMeta = [{ indicator: { name: this.title } }];
      this.mapData.series.forEach((data) => {
        scaleDescription[0].scales.push({
          scaleColor: data["color"],
          scaleLabel: data["name"],
        });
        data["data"].forEach((key) => {
          rData[period][key.id] = key.value;
          if (key.id == this.currentLocationId) {
            this.topLocationName = key.name;
          }
        });
      });

      this.indicatorMeta = indicatorMeta;
      this.scaleDescription = scaleDescription;
      this.indiData = rData;
      this.$store.state.loading = false;

      this.geojsoncomponentKey = true;
      this.showlegend = true;
      this.geojsonKey++;
    },
    removedLocationName() {
      if (this.locNameLayer != null) {
        this.locNameLayer._layers.filter((obj) => {
          this.mapInstance.mapObject.removeLayer(obj["layer"]);
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
        // console.log(res)
        that.servicedata = res;
        that.serviceCheck = true;
      });
    },
    resetMap() {
      this.toolbarLocationChanged = this.locationChanged;
      this.mapInstance.setZoom(this.zoom);
      //this.mapInstance.setView(this.center)

      this.currentLevel = this.defaultLevelID;
      this.defaultLocalLevelId = this.defaultLevelID;
      //this.getIndicatordata(this.mapObj.indiId)
      this.currentLocationId = this.defaultLocationID;
      this.toolbarLocationChanged = this.locationChanged;
      this.localToolbarLevelID = this.defaultLevelID;
      this.localToolbarLocationID = this.defaultLocationID;

      let locationValue = this.defaultLevelID + "/" + this.defaultLocationID;
      this.$emit("setLocationOnReset", locationValue);
    },
  },
  created() {
    if (this.mapObj != null) {
      this.zoom = this.mapObj.zoom;
      this.center = [this.mapObj.lat, this.mapObj.lang];

      this.currentLevel = this.toolbarLevelID;
      (this.defaultLocalLevelId = this.defaultLevelID),
        (this.currentLocationId = this.defaultLocationID),
        (this.toolbarLocationChanged = this.locationChanged),
        (this.localToolbarLevelID = this.toolbarLevelID),
        (this.localToolbarLocationID = this.toolbarLocationID);

      this.getIndicatordata(this.mapObj.indiId);
      //this.getServices();
    }
  },
  mounted() {
    this.mapInstance = this.$refs.mapObj;
    const map = this.$refs.mapObj.mapObject;
    map.addControl(new L.Control.Fullscreen({
        title: {
          false: this.$i18n.t("fullscreen"),
          true: this.$i18n.t("exitscreen"),
        },
      }));
    var printer = L.easyPrint({
      title: this.$i18n.t('downloadIcon'),
      tileLayer: this.tileLayer,
      sizeModes: ["A4Landscape"],
      filename: "myMap",
      exportOnly: true,
      hideControlContainer: false,
      defaultSizeTitles: {
        A4Landscape: this.$i18n.t('downloadIcon')
      }
    }).addTo(map);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.mapactionbtn {
  position: absolute;
  top: 0;
  right: -28px;
  -webkit-box-shadow: 0 0px 2px rgba(0, 0, 0, 0.65) !important;
  box-shadow: 0 0px 2px rgba(0, 0, 0, 0.65) !important;
  background-color: #ffffff;
  padding: 4px 8px;
  border: 0px solid #ddd;
  color: #d9d9d9 !important;
  border-radius: 5px;
}
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
  width: 160px;
  position: static !important;
  bottom: -60px;
  left: 1px;
  height: 100%;
  background: #fff;
  color: #000 !important;
  -webkit-box-shadow: 0 0px 2px rgba(0, 0, 0, 0.65) !important;
  box-shadow: 0 0px 2px rgba(0, 0, 0, 0.65) !important;
  max-height: 85px;
  overflow: hidden;
  overflow-y: scroll;
  ul {
    list-style: none;
    padding-left: 0;
    margin-top: 3%;
    margin-bottom: 2%;
    li {
      a {
        padding-left: 5%;
        color: #000;
      }
    }
  }
}
</style>
