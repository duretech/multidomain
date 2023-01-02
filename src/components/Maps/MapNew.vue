<template>
	<div>
		<b-card class="map-container p-0">
			<template #header class="pb-0 rounded-0">
				<b-row>
					<b-col sm="9">
						<h5 class="map-country fs-17-1920 mb-0">{{ $t("Harmonia") }}</h5>
					</b-col>
					<b-col sm="3" class="position-relative">
						<!-- <ChartOptions/> -->
					</b-col>
				</b-row>
			</template>

			<b-card-body class="map p-0">
				<div>
					<b-row class="map-row p-3">
						<b-col cols="6" v-if="showArea === 'true'">
							<div class="loctitles fs-17-1920">
								<p>{{ $t("Country") }}</p>
								<p>{{ $t("Country") }}</p>
								<p>{{ $t("District") }}</p>
								<p>{{ $t("Ward") }}</p>
								<p>{{ $t("Facility") }}</p>
							</div>
							<div class="map-icons">
								<div class="map-icon">
									<img
										:src="require('@/assets/images/icons/country.png')"
										class="py-2 icon-img"
									/>
								</div>
								<div class="map-icon">
									<img
										:src="require('@/assets/images/icons/region.png')"
										class="py-2 icon-img"
									/>
								</div>
								<div class="map-icon">
									<img
										:src="require('@/assets/images/icons/district.png')"
										class="py-2 icon-img"
									/>
								</div>
								<div class="map-icon">
									<img
										:src="require('@/assets/images/icons/ward.png')"
										class="py-2 icon-img"
									/>
								</div>
								<div class="map-icon">
									<img
										:src="require('@/assets/images/icons/facilityactive.png')"
										class="py-2 icon-img"
									/>
								</div>
							</div>
						</b-col>
						<b-col cols="6" v-else></b-col>
						<b-col cols="6" class="dropdownmap-col text-right">
							<b-form-select
								class="mapDropdown"
								v-if="indDropdown.length > 0"
								v-model="selectedInd"
								:options="indDropdown"
							></b-form-select>
							<!-- <b-dropdown
                id="dropdownmap"
                text="% Pregnant Women attending 4 ANC Visits"
                class="fs-17-1920"
              >
                <b-dropdown-item
                  >% Pregnant Women attending 4 ANC Visits</b-dropdown-item
                >
              </b-dropdown> -->
						</b-col>
						<b-col cols="12">
							<l-map
								class="l-map"
								ref="mapObj"
								:zoom="zoom"
								:center="center"
								:options="{ zoomControl: false, attributionControl: false }"
							>
								<l-geo-json
									:geojson="geoJson"
									:options="getOptions"
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
								<l-control position="topright">
									<a
										href="javascript:void(0)"
										class="mapactionbtn"
										@click.prevent.stop="resetMap"
										title="Reset Map"
										data-html2canvas-ignore="true"
									>
										<i class="fa fa-refresh"></i>
									</a>
								</l-control>
								<l-control position="bottomleft" id="legend" class="legendnew">
									<div class="select-wrapper legarrow">
										<div
											v-b-toggle.my-collapse
											class="toggleLegend fs-17-1920 legendarrow"
											v-b-tooltip.hover
											title="Legend"
										>
											{{ $t("Legend") }}
										</div>
									</div>
									<b-collapse id="my-collapse" visible>
										<div class="maplegend mapDivLegend">
											<ul>
												<li>
													<!--                    @click="legendclick(index)" -->
													<a
														class="dropdown-item fs-17-1920 descVal fs-15-1920"
														v-for="(scales, index) in scaleDescription[0]
															.scales"
														:key="index"
													>
														<input
															type="color"
															class="cursor-pointer mapInputBox fs-15-1920"
															@change="newColorForMap($event)"
															v-bind:style="{
																color:
																	scaleDescription[0].scales[index].scaleColor,
															}"
															v-bind:value="
																scaleDescription[0].scales[index].scaleColor
															"
														/>
														<span class="low-high ml-2 fs-17-1920">{{
															scaleDescription[0].scales[index].scaleLabel
														}}</span></a
													>
												</li>
											</ul>
										</div>
									</b-collapse>
								</l-control>
								<l-control class="play-content" position="bottomright">
									<Yearslider
										class="contentplay-year"
										:yearArr="yearArr"
										:pType="pType"
										:updatedYaerSliderValue="updatedYaerSliderValue"
										@currentYearChange="currentYearChange"
									/>
								</l-control>
							</l-map>
						</b-col>
					</b-row>
				</div>
			</b-card-body>
		</b-card>
	</div>
</template>
<script>
/*global L*/

//import ChartOptions from "@/components/ChartOptions.vue"
import {
	LMap,
	LControlZoom,
	LControl,
	LTileLayer,
	LGeoJson,
	LMarker,
	LPopup,
	LIcon,
} from "vue2-leaflet";
import * as LocationModes from "leaflet-dvf";
import LControlFullscreen from "vue2-leaflet-fullscreen";
import "leaflet/dist/leaflet.css";
// import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
// import "leaflet-fullscreen/dist/Leaflet.fullscreen";
import Yearslider from "@/components/Common/Yearslider.vue";
import {
	isNumber,
} from "@/components/Common/commonFunctions";
// / <l-map ref="myMap"> </l-map>
export default {
	props: ["data", "showArea", "geoJson"],
	// name: 'MyAwesomeMap',
	components: {
		LMap,
		// LTileLayer,
		LControlZoom,
		LControl,
		LTileLayer,
		LGeoJson,
		LMarker,
		LPopup,
		LIcon,
		LControlFullscreen,
		Yearslider,
		//ChartOptions
	},
	data() {
		console.log(this.data);
		return {
			selectedInd: null,
			map: null,
			mapData: null,
			pType: "yearly",
			url: null,
			updatedYaerSliderValue: null,
			zoom: 4,
			center: [50.919437, 19.145136],
			scaleDescription: [],
			scales: [
				{
					highScale: "25",
					lowScale: "0",
					scaleColor: "#8484a3",
					scaleLabel: "Low",
				},
				{
					highScale: "26",
					lowScale: "50",
					scaleColor: "#8484a3",
					scaleLabel: "high",
				},
			],
			yearArr: null,
			locNameLayer: null,
			isChecked: true,
			// isIndDrodown: false,
		};
	},
	created() {
		this.scaleDescription.push({ scales: this.scales });
		this.yearArr = [2014, 2015, 2016, 2017, 2018];
		this.yearArr.sort();
		this.updatedYaerSliderValue = this.yearArr[this.yearArr.length - 1];
		if (this.indDropdown.length > 0) {
			this.selectedInd = this.indDropdown[0].value;
		}
	},
	methods: {
		currentYearChange(year) {
			this.updatedYaerSliderValue = year * 1;
			this.getUpdatedMapValues(this.actMapObj);
		},
		resetMap() {
			this.zoom = 5;
			this.center = [50.919437, 21.145136];
			this.$refs.mapObj.setCenter(this.center);
			this.$refs.mapObj.setZoom(this.zoom);
		},
		getToolTipContent(locationName) {
			var content =
				'<div style="max-width:180px;"><div style="font-weight: 600;"> ' +
				locationName +
				"</div></div>";
			return content;
		},
		highlightFeature(e) {
			var layer = e.target;
			layer.setStyle({
				weight: 3,
				color: "#65648c",
				dashArray: "",
				fillOpacity: 0.7,
			});
		},
		resetHighlight(e) {
			var layer = e.target;
			layer.setStyle({
				color: "#65648c",
				dashArray: "",
				weight: 1.5,
				opacity: 1.5,
				fillOpacity: 2,
			});
		},
		getScales(scaleData) {
			if (scaleData && scaleData.length > 0) {
				let valArray = [];
				scaleData.forEach((obj) => {
					valArray.push(obj[3] * 1);
				});

				let maxValue = Math.max.apply(Math, valArray);
				let medianValue = isNumber(maxValue) && valArray.length ? parseInt(maxValue / 4) : 0;
				let legendScales = {
					lowScale: [],
					highScale: [],
					scaleDesc: "scale",
					colorScale: "#8484a3",
				};

				let lowScaleMinValue = 0;
				let highScaleMinValue = medianValue;
				for (var i = 0; i < 4; i++) {
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
				console.log(legendScales, "legendScales");
				let scales = [];
				let scaleD = ["Low", "Medium", "High", "Very High"];
				for (let i = 0; i < legendScales["lowScale"].length; i++) {
					let scaleDescValue = "";
					if (i == legendScales["lowScale"].length - 1) {
						scaleDescValue =
							scaleD[i] + " (" + legendScales["lowScale"][i] + " + )";
					} else {
						scaleDescValue =
							scaleD[i] +
							" (" +
							legendScales["lowScale"][i] +
							" - " +
							legendScales["highScale"][i] +
							" )";
					}

					scales.push({
						highScale: legendScales["highScale"][i],
						lowScale: legendScales["lowScale"][i],
						scaleColor: legendScales["colorScale"], //[i]
						scaleLabel: scaleDescValue,
					});
				}
				this.scaleDescription[0].scales = scales;
			}
		},
		getGeoJsonMapped(indData) {
			console.log(indData, this.geoJson);
			let overlaysMap = [];
			if (indData.length > 0) {
				if (this.geoJson != null) {
					for (var i in this.geoJson.features) {
						let layerObj = L.geoJson(this.geoJson.features[i]);
						var mapCentroid = layerObj.getBounds().getCenter();
						let findId = indData.filter((obj) => {
							if (
								obj[2] === this.geoJson.features[i]["id"] &&
								obj[1] * 1 === this.updatedYaerSliderValue * 1
							)
								return obj;
						});
						let nameControlObj = {};
						if (findId.length > 0) {
							nameControlObj = {
								name: this.geoJson.features[i]["properties"].name,
								lat: mapCentroid.lat,
								lng: mapCentroid.lng,
								value:
									this.geoJson.features[i]["properties"].name +
									": " +
									findId[0][3],
							};
							overlaysMap.push(nameControlObj);
						}
					}
				}
			}
			return overlaysMap;
		},
		locationNames(overlayData) {
			console.log(overlayData, "Overlaydata", this.geoJson);
			var _this = this;
			// var fg = new L.featureGroup();

			// let data = overlayData;
			var textFunction = function (value) {
				// console.log(that.fontsize)
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
						//radius: radiusFunction,
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
			// console.log(L, "MAP");
			let dataLayer = new L.DataLayer(overlayData, markerOptions);

			// let nm = new L.LayerGroup(dataLayer).addTo(this.$refs.mapObj.mapObject);
			var overlayMaps = {};
			// overlayMaps["names"] = new L.LayerGroup([dataLayer]);
			if (this.isChecked) {
				overlayMaps["names"] = new L.LayerGroup([dataLayer]).addTo(
					this.$refs.mapObj.mapObject
				);
			} else {
				overlayMaps["names"] = new L.LayerGroup([dataLayer]);
			}

			this.locNameLayer = new L.Control.Layers(null, overlayMaps, {
				position: "topleft",
				collapsed: false,
			}).addTo(this.$refs.mapObj.mapObject);
		},
		removedLocationName() {
			if (this.locNameLayer != null) {
				this.locNameLayer._layers.filter((obj) => {
					this.$refs.mapObj.mapObject.removeLayer(obj["layer"]);
				});
				this.locNameLayer.remove();
			}
		},
		getUpdatedMapValues(mapObj) {
			this.removedLocationName();
			this.getScales(mapObj[0]["mapData"]);
			let overlayData = this.getGeoJsonMapped(mapObj[0]["mapData"]);
			this.locationNames(overlayData);
		},
	},
	computed: {
		indDropdown() {
			let arr = [];
			console.log(this.$store.getters.getActiveTab, "tab");

			let tb = this.$store.getters.getActiveTab.split("--")[2];
			if (this.data && this.data.length > 0) {
				this.data.forEach((ind) => {
					if (tb === ind.parentTab)
						arr.push({ value: ind.static_name, text: ind.name });
				});
			}
			console.log(arr, this.$store.getters.getActiveTab, "indDropdown");
			return arr;
		},
		getOptions() {
			let layerObj = {
				style: this.bstyleFunction,
				onEachFeature: this.onEachFeatureFunction,
			};
			return layerObj;
		},
		getFillColor(value) {
			var returnColor = "#65648c";
			let scales = this.scaleDescription[0].scales;

			for (var i in scales) {
				//scales[i]
				if (this.type != "bubble") {
					value = parseInt(value);
					parseInt(scales[i].lowScale);
					parseInt(scales[i].highScale);
					if (value != undefined && value != -1) {
						if (value > scales[i].highScale) {
							returnColor = scales[i].scaleColor;
						} else {
							if (value >= scales[i].lowScale && value <= scales[i].highScale) {
								returnColor = scales[i].scaleColor;
								break;
							}
							if (value < scales[i].lowScale) {
								returnColor = scales[i].scaleColor;
								break;
							}
						}
					}
				}
				// else {
				//   this.mapData.series.forEach((key) => {
				//     key.data.forEach((val) => {
				//       if (val.value == value) {
				//         returnColor = key.color;
				//       }
				//     });
				//   });
				//   //returnColor = scales[i].scaleColor;
				// }
			}

			return returnColor;
		},
		getFeatureValue(paramId) {
			var returnVal = -1;
			var dataVal = this.mapData[this.updatedYaerSliderValue][paramId];
			if (dataVal) {
				returnVal = dataVal;
			}
			return returnVal;
		},
		bstyleFunction() {
			return (feature) => {
				// let fillColor = this.getFillColor(this.getFeatureValue(feature.id));
				let fillColor = "#65648c";
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
				layer.on({
					mouseover: this.highlightFeature,
					mouseout: this.resetHighlight,
					click: this.drilldown,
				});
			};
		},
	},
	watch: {
		indDropdown(arr) {
			console.log(arr, "in watch indDropdown");
			if (arr.length > 0) {
				this.selectedInd = arr[0].value;
			}
		},
		// isIndDrodown(val) {
		//   console.log("in watch", val, "isIndDropdown");
		//   if (val) {
		//     this.selectedInd = this.indDropdown[0].value;
		//   }
		// },
		selectedInd(newVal) {
			console.log("ind selected", newVal);
			let mapObj = null;
			if (this.data && this.data.length > 0) {
				mapObj = this.data.filter((obj) => obj.static_name === newVal);
			}
			this.mapData = mapObj;
			console.log(mapObj);
			if (mapObj) {
				this.yearArr = mapObj[0]["period"].map(function (v) {
					return parseInt(v, 10);
				});
				this.yearArr = mapObj[0]["period"];
				console.log(this.yearArr);
				this.pType = mapObj[0]["periodType"];
				this.yearArr.sort();
				this.updatedYaerSliderValue = this.yearArr[this.yearArr.length - 1] * 1;
				this.getUpdatedMapValues(mapObj);
				this.actMapObj = mapObj;
			}
		},
	},
};
</script>
<style scoped>
.mapDropdown {
	color: #cbcbcb !important;
}
</style>
