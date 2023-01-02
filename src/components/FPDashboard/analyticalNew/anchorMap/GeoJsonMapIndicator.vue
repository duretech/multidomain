<template>
  <div>
    <l-geo-json
      v-if="viewType != 'map' && this.currentLevel == this.countryLevel"
      :geojson="countryGeoJ"
      ref="myGeo1"
      :options-style="bstyleFunction"
      :key="cJsonKey"
    ></l-geo-json>
    <l-geo-json
      v-if="showGeoJson && indicatorObj"
      :geojson="geojson"
      :options="options"
      :period="period"
      :key="geoJsonKey"
      ref="myGeo"
      :viewflag="viewflag"
    ></l-geo-json>

    <!--Show markers for facility level-->

    <template v-if="showMarker && markers">
      <l-marker
        v-for="marker in markers"
        :key="marker.id"
        :visible="marker.visible"
        :lat-lng="marker.latlng"
        :icon="marker.icon"
        @l-add="$event.target.openPopup()"
      >
        <l-popup :content="marker.content"></l-popup>
      </l-marker>
    </template>
    <l-control
      position="topright"
      :class="[isAlert ? 'active leaflet-control' : 'leaflet-control']"
      style="top: 100px"
      v-if="indAlertList.length > 0"
    >
      <b-dropdown
        right
        id="dropdown-2"
        text=""
        class="cust_map_dropdown alert_dropdown"
        data-html2canvas-ignore="true"
      >
        <!-- <template #button-content>
        <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
      </template> -->
        <template v-if="indAlertList.length > 0">
          <b-form-checkbox
            v-for="option in indAlertList"
            v-model="selectedalert"
            :key="option.value"
            :value="option.value"
            name="flavour-3a"
            @input="getAlertData()"
          >
            {{ option.text }}
          </b-form-checkbox>
        </template>
        <span v-else>{{ $t("no_data_to_display") }}</span>
      </b-dropdown>
    </l-control>
    <l-control
      position="bottomleft"
      v-if="locName && type != 'bubble'"
      class="locationNameDiv"
    >
      <span class="location--name">{{ locName }}: {{ topLevelVal }}</span>
    </l-control>
    <l-control
      position="bottomleft"
      v-else-if="locName"
      class="locationNameDiv"
    >
      <span class="location--name"
        >{{ locName }}: {{ topLevelVal }}
        <i class="fa fa-circle" v-bind:style="{ color: topColor }"></i
      ></span>
    </l-control>
    <!-- <l-control v-if='showlegend' position="topleft">
            <div class="btn-group dropup maplegend">
                <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fa fa-circle" aria-hidden="true"></i>
                </button>
                <div class="dropdown-menu bg-light">
                    <a class="dropdown-item" v-for="(scales, index) in scaleDescription[0].scales" :key="index" href="#"><i class="fa fa-circle" v-bind:style="{'color': scaleDescription[0].scales[index].scaleColor}"></i> {{scaleDescription[0].scales[index].scaleLabel}}</a> -->
    <!--<a class="dropdown-item" href="#"><i class="fa fa-circle" style="color: #3783a5"></i> 10-20</a>
                    <a class="dropdown-item" href="#"><i class="fa fa-circle" style="color: #68a7ca"></i> 20-30</a>

                    <a class="dropdown-item" href="#"><i class="fa fa-circle" style="color: #b4dff2"></i> 30-40</a>-->
    <!-- </div>
            </div> -->
    <!--<b-card no-body class="mb-1 legend">
                <b-card-header header-tag="header" class="p-1" role="tab">
                    <b-button block href="#" v-b-toggle.legend-1 variant="info">{{$t('range')}}</b-button>
                </b-card-header>
                <b-collapse id="legend-1" visible accordion="legend-1" role="tabpanel">
                    <b-card-body>
                        <div style="margin-top: 2px;" v-for="(color, index) in scaleDescription[0].colorScale" :key="index">
                            <i class="cursor-pointer legend-spectrum" v-bind:style="{ 'background-color': color, 'width': '21px' ,'height': '18px', 'float': 'left' , 'margin-right': '8px' ,' opacity': '1' }"></i>
                            <span class="cursor-pointer showthisrange" style="font-weight: normal;">{{scaleDescription.scaleDesc[index]}}</span>
                        </div>
                        <div style="margin-top: 2px;">
                            <i class="legend-spectrum" spectrum-color="#eee;" style="background:#eee;width: 21px;height: 18px;float: left;margin-right: 8px;opacity: 1;"></i>
                            <span class="showthisrange highlight-eee">{{$t('no_data_to_display')}}</span>
                        </div>
                    </b-card-body>
                </b-collapse>
            </b-card>-->
    <!-- </l-control> -->
    <l-control v-if="showlegend" position="bottomright">
      <Yearslider
        :yearArr="yearArr"
        :pType="pType"
        @currentYearChange="currentYearChange"
        :updatedYaerSliderValue="updatedYaerSliderValue"
      />
    </l-control>
  </div>
</template>

<script>
/*global settings, L*/
/*eslint no-undef: "error"*/
import service from "@/service";
import { LGeoJson, LControl, LMarker, LPopup } from "vue2-leaflet";

import { geoJSON, latLng } from "leaflet";
import Yearslider from "./Yearslider.vue";
import "leaflet/dist/leaflet.css";
import * as LocationModes from "leaflet-dvf";
//import contshape from "./ind.json";
// import merge from 'lodash/merge'
delete L.Icon.Default.prototype._getIconUrl;
import { translateDate } from "@/components/Common/commonFunctions";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
export default {
  name: "GeoJson",
  props: [
    "pType",
    "locName",
    "indicatorObj",
    "scaleDesc",
    "mapInstance",
    "drillObj",
    "currentLevel",
    "defaultLevelID",
    "indicatorMeta",
    "itemsDefinition",
    "defaultLocationID",
    "facilityLevelID",
    "type",
    "mapData",
    "datatype",
    "viewflag",
    "period",
    "defaultView",
    "viewType",
    "globalData",
    "globalRightData",
    "countryGeoJson",
    "orgUnitLevels",
    "indId",
    "districtParentGeo",
  ],
  components: {
    LGeoJson,
    LControl,
    LMarker,
    LPopup,
    // LIcon,
    Yearslider,
  },
  data() {
    //console.log(this.pType)
    return {
      updatedYaerSliderValue: null,
      isAlert: false,
      color: "",
      alertSelected: false,
      countryGeoJ: null,
      geoFeatures: null,
      OrgData: null,
      geoFormat: null,
      selectedalert: [],
      selectedalertObj: [],
      //mycontshape: contshape,
      indAlertList: [],
      geojson: null,
      fillColor: "#006fc1",
      enableTooltip: true,
      scaleDescription: this.scaleDesc,
      currentYear: "",
      showlegend: false,
      yearArr: null,
      geoJsonKey: 0,
      cJsonKey: 1,
      indicatorName: "Indicator Name",
      showGeoJson: true,
      showMarker: false,
      //marker: L.latLng(65.0424, 35.08789),
      markers: [],
      icon: L.icon({
        iconUrl: require("leaflet/dist/images/marker-icon.png"),
        shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
        iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      }),
      topLevelVal: "",
      locNameLayer: null,
      layerObj: null,
      layerObj1: null,
      formatedTooltipDate: null,
      topColor: "#006fc1",
      countryLevel: "",
    };
  },
  watch: {
    indicatorObj() {},
    defaultLevelID() {},
  },
  created() {
    this.countryLevel = this.$store.getters.getApplicationModule(true).defaultLevelID;
    let level = "";
    if (this.viewType == "map") {
      level = Number(this.currentLevel) + 1;
    } else if (this.currentLevel == this.countryLevel) {
      level = Number(this.currentLevel) + 2;
    } else {
      level = Number(this.currentLevel) + 1;
    }
    //console.log(this.defaultLocationID, level, this.defaultLevelID)
    service
      .getNewOrganisationUnitGeoJson(this.defaultLocationID, level)
      .then((response) => {
        this.geoFeatures = response;
        service
          .getOpenOrganisation(level)
          .then((ores) => {
            let orgData = [];
            ores.data.organisationUnits.forEach((org) => {
              if (org.parent.id == this.defaultLocationID) {
                this.geoFeatures.data.find((Obj) => {
                  if (Obj.id == org.id) {
                    orgData.push(org);
                  }
                });
              }
            });
            this.OrgData = orgData;
            this.getAlertsData();
            this.loadYearlyGeojson();
            this.countryGeo();
            if (
              Object.keys(this.indicatorObj).length > 0 &&
              this.indicatorObj[this.currentYear][this.defaultLocationID] !=
                undefined
            ) {
              this.topLevelVal =
                this.indicatorObj[this.currentYear][this.defaultLocationID];
            }

            if (Number(this.currentLevel) + 1 < this.facilityLevelID) {
              this.showGeoJson = true;
              this.showMarker = false;
              //this.geojson = this.geoFormat;

              var layerFeatureJSON = geoJSON(this.geojson);
              var mapCentroid = layerFeatureJSON.getBounds();
              this.mapInstance.fitBounds(mapCentroid);
            } else {
              this.showGeoJson = false;
              this.showMarker = true;
              if (Object.keys(this.indicatorObj).length > 0) {
                Object.keys(this.indicatorObj[this.currentYear]).forEach(
                  (id) => {
                    let filteredFeature = this.geoFormat.features.filter(
                      (f) => id === f.id
                    );
                    for (
                      let i = 0, len = filteredFeature.length;
                      i < len;
                      i++
                    ) {
                      this.markers.push({
                        id: filteredFeature[i].id,
                        latlng: latLng(
                          filteredFeature[i].geometry.coordinates[1],
                          filteredFeature[i].geometry.coordinates[0]
                        ),
                        visible: true,
                        icon: this.icon,
                        content:
                          filteredFeature[i].properties.name +
                          " - " +
                          this.indicatorObj[this.currentYear][
                            filteredFeature[i].id
                          ],
                      });
                    }
                  }
                );
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
        this.$emit("noGeoJson", false);
      });
    let oIndicatorMeta = this.indicatorMeta[0]
      ? this.indicatorMeta[0].indicator
      : null;
    this.indicatorName = oIndicatorMeta
      ? oIndicatorMeta.name
      : "Indicator Name";

    this.yearArr = Object.keys(this.indicatorObj);
    this.yearArr.sort();
    this.currentYear = this.updatedYaerSliderValue
      ? this.updatedYaerSliderValue
      : this.yearArr[this.yearArr.length - 1];
    this.getFormattedToolTip();
    this.showlegend = true;
  },
  computed: {
    options() {
      //eslint-disable-next-line
      this.layerObj = {
        style: this.styleFunction,
        onEachFeature: this.onEachFeatureFunction,
      };
      return this.layerObj;
    },
    // borderoptions() {
    //   this.layerObj1 = {
    //     style: this.bstyleFunction
    //   };

    //   return this.layerObj1;
    // },
    bstyleFunction() {
      return {
        stroke: true,
        color: "#000000",
        weight: 1.5,
        opacity: 1.5,
        fillColor: "#ddd",
        fillOpacity: 2,
      };
    },
    styleFunction() {
      return (feature) => {
        if (feature.id != undefined) {
          let color = "#cecece";
          let fillColor = this.getFillColor(this.getFeatureValue(feature.id));
          let styleObj = {};

          if (this.selectedalertObj.length > 0) {
            var condition = false,
              alColor = "#FFF";
            for (let i = 0; i < this.selectedalertObj.length; i++) {
              condition = this.getOperator(
                Number(this.indicatorObj[this.currentYear][feature.id]),
                this.selectedalertObj[i].operator,
                Number(this.selectedalertObj[i].thresholdValue)
              );
              if (condition) {
                alColor = this.selectedalertObj[i].color;
                break;
              }
            }

            if (condition) {
              this.color = alColor;
              if (this.viewType == "map") {
                styleObj = {
                  weight: 2,
                  color: alColor,
                  opacity: 1,
                  fillColor: fillColor,
                  fillOpacity: 1,
                };
              } else {
                styleObj = {
                  weight: 0.6,
                  color: alColor,
                  opacity: 0.6,
                  fillColor: fillColor,
                  fillOpacity: 0.5,
                };
              }
            } else {
              this.color = color;
              if (this.viewType == "map") {
                styleObj = {
                  weight: 2,
                  color: color,
                  opacity: 0.5,
                  fillColor: fillColor,
                  fillOpacity: 1,
                };
              } else {
                styleObj = {
                  weight: 0.6,
                  color: color,
                  opacity: 0.6,
                  fillColor: fillColor,
                  fillOpacity: 0.5,
                };
              }
            }
          } else {
            this.color = color;
            if (this.viewType == "map") {
              styleObj = {
                weight: 2,
                color: color,
                opacity: 0.5,
                fillColor: fillColor,
                fillOpacity: 1,
              };
            } else {
              styleObj = {
                weight: 0.6,
                color: color,
                opacity: 0.6,
                fillColor: fillColor,
                fillOpacity: 0.5,
              };
            }
          }
          return styleObj;
        }
      };
    },
    onEachFeatureFunction() {
      if (!this.enableTooltip) {
        return () => {};
      }
      return (feature, layer) => {
        var locationISO = feature.id;
        var locationName = feature.properties.name;
        var tooltipContent = this.getToolTipContent(locationISO, locationName);
        layer.bindTooltip(tooltipContent, {
          permanent: false,
          sticky: true,
        });
        if (this.viewType == "map") {
          layer.on({
            mouseover: this.highlightFeature,
            mouseout: this.resetHighlight,
            click: this.drilldown,
          });
        } else {
          layer.on({
            mouseover: this.highlightFeature,
            mouseout: this.resetHighlight,
          });
        }
      };
    },
  },
  methods: {
    getFormattedToolTip() {
      this.formatedTooltipDate = translateDate({
        rawDate: this.currentYear,
        periodType: this.pType,
      });
    },
    getOperator(val, op, tVal) {
      let condition = false;

      if (op === "===") {
        condition = val === tVal;
      }
      if (op === "!==") {
        condition = val !== tVal;
      }
      if (op === ">") {
        condition = val > tVal;
      }
      if (op === ">=") {
        condition = val >= tVal;
      }
      if (op === "<") {
        condition = val < tVal;
      }
      if (op === "<=") {
        condition = val <= tVal;
      }
      return condition;
    },
    countryGeo() {
      let newGeoFormat = { type: "FeatureCollection", features: [] };
      let disGeo = [];
      this.districtParentGeo.organisationUnits.forEach((org) => {
        if (org.parent.id == this.defaultLocationID) {
          this.countryGeoJson.find((Obj) => {
            if (Obj.id == org.id) {
              disGeo.push(org);
            }
          });
        }
      });
      this.countryGeoJson.forEach((geo, i) => {
        var res = geo.co.substring(0, 4);
        let len = (res.match(/\W|_/g) || []).length;
        let type = "";
        if (parseInt(geo.ty) === 1) {
          type = "Point";
        } else {
          if (len == 3) {
            type = "Polygon";
          } else if (len == 4) {
            type = "MultiPolygon";
          }
        }
        let feature = {
          type: "Feature",
          id: geo.id,
          geometry: { type: type, coordinates: JSON.parse(geo.co) },
          properties: {
            code: null,
            name: geo.na,
            hasCoordinatesDown: geo.hcd,
            hasCoordinatesUp: geo.hcu,
            level: geo.le,
            parent: geo.pi,
            parentGraph: geo.pg,
            groups: [],
          },
        };
        let oDate = new Date().getFullYear();
        if (disGeo[i]) {
          oDate = new Date(disGeo[i].openingDate).getFullYear();
        }

        if (this.pType === "financialYear") {
          if (oDate <= Number(this.currentYear.split("A")[0])) {
            newGeoFormat.features.push(feature);
          }
        } else if (this.pType === "financialYearJuly") {
          if (oDate <= Number(this.currentYear.split("J")[0])) {
            newGeoFormat.features.push(feature);
          }
        } else if (this.pType === "quarterly") {
          if (oDate <= Number(this.currentYear.split("Q")[0])) {
            newGeoFormat.features.push(feature);
          }
        } else if (this.pType === "monthly" || this.pType === "yearly") {
          if (oDate <= Number(this.currentYear)) {
            newGeoFormat.features.push(feature);
          }
        }
      });
      //console.log(newGeoFormat)
      this.countryGeoJ = newGeoFormat;
      this.cJsonKey++;
    },
    loadYearlyGeojson() {
      //console.log(this.pType, Number(this.currentYear.split("Q")[0]))
      let newGeoFormat = { type: "FeatureCollection", features: [] };

      this.geoFeatures.data.forEach((geo, i) => {
        var res = geo.co.substring(0, 4);
        let len = (res.match(/\W|_/g) || []).length;
        let type = "";
        if (parseInt(geo.ty) === 1) {
          type = "Point";
        } else {
          if (len == 3) {
            type = "Polygon";
          } else if (len == 4) {
            type = "MultiPolygon";
          }
        }

        let feature = {
          type: "Feature",
          id: geo.id,
          geometry: { type: type, coordinates: JSON.parse(geo.co) },
          properties: {
            code: null,
            name: geo.na,
            hasCoordinatesDown: geo.hcd,
            hasCoordinatesUp: geo.hcu,
            level: geo.le,
            parent: geo.pi,
            parentGraph: geo.pg,
            groups: [],
          },
        };
        //console.log(this.OrgData[i].openingDate, this.OrgData[i].closedDate, geo.na, geo.id)
        let oDate = new Date().getFullYear(),
          cDate = new Date().getFullYear();
        if (this.OrgData[i]) {
          oDate = new Date(this.OrgData[i].openingDate).getFullYear();
          if (this.OrgData[i].closedDate) {
            cDate = new Date(this.OrgData[i].closedDate).getFullYear();
          }
        }

        if (
          this.pType === "financialYear" &&
          oDate <= Number(this.currentYear.split("A")[0]) &&
          cDate >= Number(this.currentYear.split("A")[0]) &&
          this.viewType == "map"
        ) {
          newGeoFormat.features.push(feature);
        } else if (
          this.pType === "financialYearJuly" &&
          oDate <= Number(this.currentYear.split("J")[0]) &&
          cDate >= Number(this.currentYear.split("J")[0]) &&
          this.viewType == "map"
        ) {
          newGeoFormat.features.push(feature);
        } else if (
          this.pType === "quarterly" &&
          oDate <= Number(this.currentYear.split("Q")[0]) &&
          cDate >= Number(this.currentYear.split("Q")[0]) &&
          this.viewType == "map"
        ) {
          newGeoFormat.features.push(feature);
        } else if (
          this.pType === "monthly" &&
          oDate <= Number(this.currentYear.substring(0, 4)) &&
          cDate >= Number(this.currentYear.substring(0, 4)) &&
          this.viewType == "map"
        ) {
          newGeoFormat.features.push(feature);
        } else if (
          this.pType === "yearly" &&
          oDate <= Number(this.currentYear) &&
          cDate >= Number(this.currentYear) &&
          this.viewType == "map"
        ) {
          newGeoFormat.features.push(feature);
        } else if (this.viewType != "map") {
          newGeoFormat.features.push(feature);
        }
      });
      //console.log(newGeoFormat)
      //newGeoFormat = this.mycontshape;
      this.$emit("geoJsonValue", newGeoFormat, this.currentYear);
      // if (Number(this.currentLevel) + 1 < this.facilityLevelID) {
      //   this.$emit("geoJsonValue", newGeoFormat);
      // }
      this.geoFormat = newGeoFormat;
      this.geojson = this.geoFormat;

      this.geoJsonKey++;
    },
    getAlertData() {
      // this.selectedalert = val
      let alArr = [];
      if (this.selectedalert.length > 0) {
        this.selectedalert.forEach((al) => {
          alArr.push(this.alertData.find((a) => a.alertID === al));
        });
      }
      this.selectedalertObj = alArr;
      this.geoJsonKey++;
    },
    getAlertsData() {
      let key = this.generateKey("alertRules", false, false);

      service
        .getSavedConfig(key)
        .then((response) => {
          this.alertData = response.data;
          let alert = this.alertData.filter(
            (a) => a.targetIndicator === this.indId[0]
          );
          if (alert.length > 0) {
            alert.forEach((a) => {
              this.indAlertList.push({
                value: a.alertID,
                text: a.alertName,
                color: a.color,
              });
            });
            this.isAlert = true;
          }
        })
        .catch(() => {
          console.log("No alerts defined for this application...");
        });
      this.$store.state.loading = false;
    },
    currentYearChange(year) {
      this.currentYear = year;
      //if (this.viewType == "map") {
      this.loadYearlyGeojson();
      //}
      this.countryGeo();
      this.getFormattedToolTip();
      this.updatedYaerSliderValue = year;
      this.$emit("currentPeriodFunction", this.currentYear);
      //this.geoJsonKey++;
    },
    getToolTipContent(locationISO, locationName) {
      //Created a new variable "this.formatedTooltipDate" to show in tooltip, because "this.itemsDefinition[this.currentYear].name" is creating problem (not getting formated date) when we select Monthly EMU from Map indicators.
      var val = this.getFeatureValue(locationISO);
      var content =
        '<div style="max-width:180px;"><div style="font-weight: 600;">' +
        locationName +
        "</div>";

      //val != -1 ? content += '<div>'+ this.indicatorName+' : '+ val + '</div>' : content += '<div>Data not available</div></div>';
      // val != -1 ? content += '<div>' + this.itemsDefinition[this.currentYear].name + ' : '+ val + '</div>' : content += '<div>Data not available</div></div>';
      val != -1
        ? (content +=
            "<div>" + this.formatedTooltipDate + " : " + val + "</div>")
        : (content += "<div>"+this.$i18n.t('no_data_to_display')+"</div></div>");
      return content;
    },
    getFeatureValue(paramId) {
      var returnVal = -1;
      var dataVal = this.indicatorObj[this.currentYear][paramId];

      if (dataVal || dataVal === 0) {
        returnVal = dataVal;
      }
      return returnVal;
    },
    highlightFeature(e) {
      let fId = e.target.feature.id;
      var layer = e.target;
      let color = "#cecece";
      let styleObj = {};
      if (this.selectedalert.length > 0) {
        var condition = false,
          alColor = "#FFF";
        for (let i = 0; i < this.selectedalertObj.length; i++) {
          condition = this.getOperator(
            Number(this.indicatorObj[this.currentYear][fId]),
            this.selectedalertObj[i].operator,
            Number(this.selectedalertObj[i].thresholdValue)
          );
          if (condition) {
            alColor = this.selectedalertObj[i].color;
            break;
          }
        }
        if (condition) {
          if (this.viewType == "map") {
            styleObj = {
              weight: 4,
              color: alColor,
              dashArray: "",
              fillOpacity: 0.7,
            };
          } else {
            styleObj = {
              weight: 0.8,
              color: alColor,
              dashArray: "",
              fillOpacity: 0.8,
            };
          }
        } else {
          if (this.viewType == "map") {
            styleObj = {
              weight: 3,
              color: color,
              dashArray: "",
              fillOpacity: 0.7,
            };
          } else {
            styleObj = {
              weight: 0.8,
              color: color,
              dashArray: "",
              fillOpacity: 0.8,
            };
          }
        }
      } else {
        if (this.viewType == "map") {
          styleObj = {
            weight: 3,
            color: color,
            dashArray: "",
            fillOpacity: 0.7,
          };
        } else {
          styleObj = {
            weight: 0.8,
            color: color,
            dashArray: "",
            fillOpacity: 0.8,
          };
        }
      }
      layer.setStyle(styleObj);
    },
    resetHighlight(e) {
      let fId = e.target.feature.id;
      var layer = e.target;
      let color = "#cecece";

      let styleObj = {};
      if (this.selectedalert.length > 0) {
        var condition = false,
          alColor = "#FFF";
        for (let i = 0; i < this.selectedalertObj.length; i++) {
          condition = this.getOperator(
            Number(this.indicatorObj[this.currentYear][fId]),
            this.selectedalertObj[i].operator,
            Number(this.selectedalertObj[i].thresholdValue)
          );
          if (condition) {
            alColor = this.selectedalertObj[i].color;
            break;
          }
        }
        if (condition) {
          if (this.viewType == "map") {
            styleObj = {
              weight: 2,
              opacity: 1,
              color: alColor,
              dashArray: "",
              fillOpacity: 1,
            };
          } else {
            styleObj = {
              weight: 0.5,
              color: alColor,
              opacity: 0.5,
              dashArray: "",
              fillOpacity: 0.5,
            };
          }
        } else {
          if (this.viewType == "map") {
            styleObj = {
              weight: 2,
              opacity: 1,
              color: color,
              dashArray: "",
              fillOpacity: 1,
            };
          } else {
            styleObj = {
              weight: 0.5,
              color: color,
              opacity: 0.5,
              dashArray: "",
              fillOpacity: 0.5,
            };
          }
        }
      } else {
        if (this.viewType == "map") {
          styleObj = {
            weight: 2,
            opacity: 1,
            color: color,
            dashArray: "",
            fillOpacity: 1,
          };
        } else {
          styleObj = {
            weight: 0.5,
            color: color,
            opacity: 0.5,
            dashArray: "",
            fillOpacity: 0.5,
          };
        }
      }

      layer.setStyle(styleObj);
    },
    drilldown(e) {
      //e.preventDefault()
      this.$emit("drilldown", e);
    },
    getFillColor(value) {
      var returnColor = "#EEEEEE";
      let scales = this.scaleDescription[0].scales;
      // console.log("value", value)
      // console.log("scales", scales)
      for (var i in scales) {
        //scales[i]
        if (this.type != "bubble") {
          value = parseFloat(value);
          parseFloat(scales[i].lowScale);
          parseFloat(scales[i].highScale);
          //console.log(value, parseFloat(scales[i].lowScale), parseFloat(scales[i].highScale))
          if (value != undefined && value != -1) {
            if (value > scales[i].highScale) {
              returnColor = scales[i].scaleColor;
              //console.log(returnColor, value, scales[i].highScale, 'infirstif')
            }
            //else {
            if (value >= scales[i].lowScale && value <= scales[i].highScale) {
              returnColor = scales[i].scaleColor;
              //console.log(returnColor, value, 'insectif')
              break;
            }
            if (value <= scales[i].lowScale) {
              returnColor = scales[i].scaleColor;
              //console.log(returnColor, value, 'inthirdtif')
              break;
            }
            //}
          } else if (value != undefined && value == -1) {
            returnColor = scales[i].scaleColor;
          }
        } else {
          this.mapData.series.forEach((key) => {
            key.data.forEach((val) => {
              if (val.value == value) {
                returnColor = key.color;
              }
            });
          });
          //returnColor = scales[i].scaleColor;
        }
      }
      // console.log(returnColor, value, 'insectif')
      return returnColor;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.active {
  display: block;
}
.none {
  display: none;
}
/*.maplegend {
        position: absolute;
        bottom: -10px;
        left: -10px;
        background-color: transparent;
        color: #fff;
        border-radius: 5px;
    }*/

.location--name {
  background-color: #171a22;
  padding: 4px 4px;
  border-radius: 2px;
  color: #fff;
  font-weight: 600;
  letter-spacing: 0.5px;
}
</style>
