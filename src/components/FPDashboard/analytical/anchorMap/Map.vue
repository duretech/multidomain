<template>
	<div class="p-0 mapHeight position-relative" style="height: 100%" ref="map">
		<loader
			v-if="showLoader"
			class="cardLoader"
			style="z-index: 999 !important"
		/>
		<l-map
			ref="mapObj"
			style="height: 100%; width: 100%; background-color: #fff"
			:minZoom="2"
			:maxZoom="20"
			:zoom="zoom"
			:center="center"
			:options="{ zoomControl: false }"
			@update:zoom="zoomUpdated"
		>
			<l-tile-layer v-if="tileLayerFlag" :url="url"></l-tile-layer>
			<l-control-zoom
				position="topleft"
				:zoomInTitle="$t('zoomin')"
				:zoomOutTitle="$t('zoomout')"
			></l-control-zoom>
			<l-control position="topleft">
				<a
					href="javascript:void(0)"
					class="mapactionbtn"
					@click.prevent.stop="resetMap"
					:title="$t('resetMap')"
				>
					<i class="fa fa-refresh"></i>
				</a>
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
				</b-dropdown>
			</l-control>
			<l-control v-if="showlegend" position="topleft">
				<div class="maplegend map-legend2">
					<button
						type="button"
						class="btn btn-secondary"
						:title="$t('legend')"
						@click.prevent.stop="openLegends = !openLegends"
					>
						<i class="fa fa-circle"></i>
					</button>
					<div class="legend-menu" v-if="openLegends">
						<a
							class="legend-item"
							style="cursor: default"
							v-for="(scales, index) in scaleDescription[0].scales"
							:key="index"
							><i
								class="fa fa-circle mx-2"
								v-bind:style="{
									color: scaleDescription[0].scales[index].scaleColor,
								}"
							></i>
							{{ scaleDescription[0].scales[index].scaleLabel }}</a
						>
					</div>
				</div>
			</l-control>
			<GeoJson
				v-if="
					geojsoncomponentKey && indiData && indicatorMeta && scaleDescription
				"
				:scaleDesc="scaleDescription"
				:key="geojsonKey"
				@drilldown="drilldown"
				:locName="locationName"
				:indicatorObj="indiData"
				:indicatorMeta="indicatorMeta"
				:currentLevel="currentLevel"
				:itemsDefinition="itemsDefinition"
				:defaultLocationID="currentLocationId"
				:mapInstance="mapInstance"
				:drillObj="drillObj"
				:facilityLevelID="facilityLevelID"
				@geoJsonValue="getGeoJson"
				type="anchor"
				:periodType="periodType"
			/>
			<l-control v-if="indicatorMeta" position="bottomright"
				><span
					style="
						background-color: #fffff5;
						padding: 1px 2px;
						font-size: 0.8125em;
					"
					>{{ $t("source") }}: {{ indicatorMeta[0].indicator.source }}</span
				></l-control
			>
		</l-map>
	</div>
</template>

<script>
/*global L*/
/*eslint no-undef: "error"*/
import service from "@/service";
import { LMap, LControlZoom, LControl, LTileLayer } from "vue2-leaflet";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet-fullscreen/dist/Leaflet.fullscreen";
import "leaflet/dist/leaflet.css";
import GeoJson from "./GeoJson.vue";
import html2canvas from "html2canvas";
import * as easyPrint from "leaflet-easyprint";
import {
	isNumber,
	formatSingleDate,
} from "@/components/Common/commonFunctions";

export default {
	name: "Map",
	props: [
		"defaultLevelID",
		"defaultLocationID",
		"subLevelID",
		"periodLength",
		"period",
		"periodType",
		"mapObj",
		"mapConfigData",
		"mapOn",
		"resetCurrentLevel",
		"locationChanged",
		"toolbarLevelID",
		"toolbarLocationID",
		"facilityLevelID",
		"leftMapChartInfo",
		"mapIndicatorName",
		"locationName",
	],
	components: {
		LMap,
		LControlZoom,
		LControl,
		LTileLayer,
		GeoJson,
	},
	watch: {
		mapObj: {
			// watch it
			handler(newVal) {
				this.showLoader = true;
				this.getIndicatordata(newVal.indiId);
			},
			deep: true,
		},
		resetCurrentLevel(newVal) {
			if (newVal) {
				this.currentLevel = this.defaultLevelID;
			}
		},
		locationChanged(newVal) {
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
		return {
			showLoader: true,
			url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
			zoom: 0,
			defaultZoomLevel: 4,
			fontsize: "10px",
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
			dataLayer: null,
			overlaysMap: null,
			defaultLocalLevelId: this.defaultLevelID,
			currentLocationId: this.defaultLocationID,
			toolbarLocationChanged: this.locationChanged,
			localToolbarLevelID: this.toolbarLevelID,
			localToolbarLocationID: this.toolbarLocationID,
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
			openLegends: true,
		};
	},
	methods: {
		layerchange(event) {
			this.url = event;
		},
		async getScreenShot() {
			let map = null;
			await html2canvas(this.$refs.map, {
				logging: true,
				letterRendering: true,
				allowTaint: true,
				useCORS: true,
				scale: (1920 * 2) / window.innerWidth,
				backgroundColor: null,
			})
				.then((canvas) => {
					map = canvas.toDataURL();
				})
				.catch((error) => {
					map = null;
					//console.log("Erorr in map screenshot capture...", error);
				});
			return map;
		},
		getScales(indicatorMeta) {
			//let scaleDescription = indicatorMeta[0].indicator.levels.filter(c => c.level === this.currentLevel)
			this.scaleDescription = indicatorMeta[0].indicator.levels.filter(
				(c) => c.level === this.currentLevel
			);
			if (this.scaleDescription[0].isAutoRange == true) {
				let color = [],
					scaleD = [];
				this.scaleDescription[0].scales.forEach((scale) => {
					color.push(scale.scaleColor);
					////console.log(scale.scaleLabel)
					scaleD.push(scale.scaleLabel);
				});

				// //console.log(scaleD)
				let valArray = [];
				Object.keys(this.indiData).forEach((y) => {
					Object.keys(this.indiData[y]).forEach((id) => {
						if (id != this.currentLocationId && this.indiData[y][id]) {
							valArray.push(this.indiData[y][id]);
						}
					});
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
						legendScales["lowScale"].push(0);
						legendScales["highScale"].push(highScaleMinValue);
					} else {
						lowScaleMinValue += medianValue;
						highScaleMinValue += medianValue;
						legendScales["lowScale"].push(lowScaleMinValue);
						legendScales["highScale"].push(highScaleMinValue);
					}
				}
				// //console.log(legendScales)
				let scales = [];
				scaleD = ["Low", "Medium", "High", "Very High"];
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
						scaleColor: legendScales["colorScale"][i],
						scaleLabel: scaleDescValue,
					});
				}
				//scaleD = []
				//this.scaleFlag = false
				this.scaleDescription[0].scales = scales;
			}
		},
		getGeoJson(response) {
			if (response) {
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
				this.overlaysMap = overlaysMap;
				this.locationNames();
				this.showLoader = false;
				// setTimeout(() => {
				//     //console.log('wdwqfqwf')
				//     this.$refs.mapObj.mapObject.invalidateSize(true);
				// }, 500);
				// let data = overlaysMap;
				// var textFunction = function(value) {
				//     return {
				//         text: value,
				//         style: {
				//             'fill': '#000',
				//             'font-size': '10px',
				//             'margin-left': '-100px',
				//             'font-family': 'Roboto',
				//             'background-color': 'rgb(255, 255, 245)',
				//             'padding': '1px 2px'
				//         }
				//     };
				// };
				// let markerOptions = {
				//     recordsField: null,
				//     locationMode: L.LocationModes.LATLNG,
				//     latitudeField: 'lat',
				//     longitudeField: 'lng',
				//     displayOptions: {
				//     'value': {
				//         displayName: 'abc',
				//         //radius: radiusFunction,
				//         text: textFunction
				//     }
				//     },
				//     layerOptions: {
				//     numberOfSides: 50,
				//     radius: 1,
				//     weight: 0,
				//     color: '#fff',
				//     opacity: 0,
				//     stroke: true,
				//     fillOpacity: 0.1,
				//     dropShadow: false,
				//     gradient: false
				//     }
				// };
				// var dataLayer = new L.DataLayer(data, markerOptions);
				// var overlayMaps = {
				//     [this.$i18n.t('location')]: L.layerGroup([dataLayer])
				// };
				// this.locNameLayer = L.control.layers(null, overlayMaps, { position: 'topright', collapsed: false }).addTo(this.mapInstance.mapObject);
			} else {
				//console.log("response", response)
				this.showLoader = false;
			}
		},
		locationNames() {
			var that = this;
			let data = this.overlaysMap;
			var textFunction = function (value) {
				// //console.log(that.fontsize)
				return {
					text: value,
					style: {
						fill: "#000",
						"font-size": that.fontsize,
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

			this.dataLayer = new L.DataLayer(data, markerOptions);
			var overlayMaps = {};
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
				.layers(null, overlayMaps, { position: "topright", collapsed: false })
				.addTo(this.$refs.mapObj.mapObject);

			this.$emit("mapLoaded", true);
		},
		zoomUpdated(zoom) {
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
		drilldown(e) {
			////console.log(e)
			////console.log(this.currentLevel)
			////console.log(this.defaultLocalLevelId+1)
			////console.log(this.facilityLevelID)
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
			// this.showLoader = true;
			let sSelectedDE = "";
			sSelectedDE = id;

			this.indicatorMeta = null;

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

			let level = [this.defaultLocalLevelId, this.defaultLocalLevelId + 1];
			//let level = [this.defaultLocalLevelId + 1]

			let period = formatSingleDate({
				rawDate: this.period,
				periodType: this.periodType,
			});

			let emuKey = null;
			if (this.periodType === "yearly") {
				emuKey = this.generateKey("annualEMU");
			} else {
				emuKey = this.generateKey("monthlyEMU");
			}

			if (sSelectedDE != "monthlyEMU") {
				service
					.getIndicatorData(sSelectedDE, level, this.currentLocationId, period)
					.then((response) => {
						////console.log("Indicator ", response.data.rows)

						// let pe = response.data.metaData.dimensions.pe
						let valueIndex = 0,
							ouIndex = 0,
							peIndex = 0;
						response.data.headers.forEach((h, i) => {
							////console.log(h);

							// if (h.name === 'dx') {
							//     dxIndex = i
							// }
							if (h.name === "value") {
								valueIndex = i;
							}
							if (h.name === "ou") {
								ouIndex = i;
							}
							if (h.name === "pe") {
								peIndex = i;
							}
						});

						let rData = {};

						response.data.rows.forEach((r) => {
							if (Object.keys(rData).includes(r[peIndex])) {
								////console.log("rData1", r[peIndex]);

								if (Object.keys(rData[r[peIndex]]).includes(r[ouIndex])) {
									rData[r[peIndex]][r[ouIndex]] =
										Number(rData[r[peIndex]][r[ouIndex]]) +
										Number(r[valueIndex]);
								} else {
									rData[r[peIndex]][r[ouIndex]] = r[valueIndex];
								}
							} else {
								////console.log(r[ouIndex]);

								rData[r[peIndex]] = {
									[r[ouIndex]]: r[valueIndex],
								};
							}
						});

						this.itemsDefinition = response.data.metaData.items;

						this.indiData = rData;

						let indicatorMeta = this.mapConfigData.filter(
							(c) => c.indicator.subIndicator[0].de[0] === sSelectedDE
						);
						//let indicatorScales = indicatorMeta[0].indicator.levels.filter(c => c.level === this.currentLevel)

						this.indicatorMeta = indicatorMeta;
						//this.indicatorScales = indicatorScales
						this.getScales(indicatorMeta);
						this.$emit("setIndicatordata", indicatorMeta);
						// this.showLoader = false;

						this.geojsoncomponentKey = true;
						this.showlegend = true;
						this.geojsonKey++;
					})
					.catch(() => {
						this.showLoader = false;
					});
			} else {
				// this.showLoader = true
				// //console.log("in map monthlyEMU")
				// //console.log("this.toolbarLocationID",this.toolbarLocationID)
				// //console.log("this.defaultLocationID",this.defaultLocationID)
				service
					.getSavedConfig(emuKey)
					.then((monthlyEMURes) => {
						let finalEMU = { [period]: {} };
						if (this.periodType === "monthly") {
							let tEMU =
								typeof monthlyEMURes.data.totalEMU === "string"
									? JSON.parse(monthlyEMURes.data.totalEMU)
									: monthlyEMURes.data.totalEMU;
							//console.log("tEMU", tEMU)
							Object.keys(tEMU).forEach((e) => {
								if (tEMU[e]) {
									let newIndex = tEMU[e].saveCategories.findIndex(
										(pe) =>
											period === this.$moment(pe, "MMM YYYY").format("YYYYMM")
									);
									if (newIndex != -1) {
										let emuData = tEMU[e].saveData.find(
											(d) => d.name === this.$i18n.t("EMU")
										);
										if (emuData) {
											finalEMU[period][e] = emuData.data[newIndex];
										} else {
											finalEMU[period][e] = null;
										}
									} else {
										//console.log("Data not found for period " + period);
										finalEMU[period][e] = null;
									}
								}
							});
						}

						if (this.periodType === "yearly") {
							let compEMU = JSON.parse(monthlyEMURes.data.compEMU);
							Object.keys(compEMU).forEach((e) => {
								if (compEMU[e]) {
									let newIndex = compEMU[e].categories.findIndex(
										(pe) =>
											period === this.$moment(pe, "MMM YYYY").format("YYYY")
									);
									//compEMU[e].categories.forEach((i, index) => {
									if (newIndex != -1) {
										let emuData = compEMU[e].data.find(
											(d) => d.name === compEMU[e].source
										);
										if (emuData) {
											finalEMU[period][e] = emuData.data[newIndex];
										}
									} else {
										//console.log("Data not found for period " + period);
										finalEMU[period][e] = null;
									}
									//})
								}
							});
						}
						//console.log("finalEMU", finalEMU)
						if (Object.keys(finalEMU[period]).length !== 0) {
							this.indiData = finalEMU;
							// Set scales for Indicator
							let indicatorMeta = this.mapConfigData.filter(
								(c) => c.indicator.subIndicator[0].de[0] === sSelectedDE
							);
							//let indicatorScales = indicatorMeta[0].indicator.levels.filter(c => c.level === this.currentLevel)

							this.indicatorMeta = indicatorMeta;
							//this.indicatorScales = indicatorScales
							this.$emit("setIndicatordata", indicatorMeta);
							// this.showLoader = false;
							this.getScales(indicatorMeta);
							this.geojsoncomponentKey = true;
							this.showlegend = true;
							this.geojsonKey++;
						} else {
							//console.log("in else")
							//   this.showLoader = false;
						}
					})
					.catch((res) => {
						//console.log(res);
						this.showLoader = false;
					});
			}
		},
		removedLocationName() {
			if (this.locNameLayer != null) {
				this.locNameLayer._layers.filter((obj) => {
					this.mapInstance.mapObject.removeLayer(obj["layer"]);
				});
				this.locNameLayer.remove();
			}
		},
		resetMap() {
			//console.log("called");
			this.toolbarLocationChanged = this.locationChanged;
			//this.mapInstance.setZoom(this.zoom)
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
		//console.log("this.mapObj", this.mapObj)
		if (this.mapObj != null) {
			this.zoom = this.mapObj.zoom;
			// //console.log(this.zoom)
			this.center = [this.mapObj.lat, this.mapObj.lang];

			this.currentLevel = this.toolbarLevelID;
			this.defaultLocalLevelId = this.defaultLevelID;
			this.currentLocationId = this.defaultLocationID;
			this.toolbarLocationChanged = this.locationChanged;
			this.localToolbarLevelID = this.toolbarLevelID;
			this.localToolbarLocationID = this.toolbarLocationID;
			this.getIndicatordata(this.mapObj.indiId);
		}
	},
	mounted() {
		this.mapInstance = this.$refs.mapObj;
		const map = this.$refs.mapObj.mapObject;
		map.addControl(
			new L.Control.Fullscreen({
				title: {
					false: this.$i18n.t("fullscreen"),
					true: this.$i18n.t("exitscreen"),
				},
			})
		);
		L.easyPrint({
			title: this.$i18n.t("downloadIcon"),
			tileLayer: this.tileLayer,
			sizeModes: ["A4Landscape"],
			filename: "myMap",
			exportOnly: true,
			hideControlContainer: false,
			defaultSizeTitles: {
				A4Landscape: this.$i18n.t("downloadIcon"),
			},
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
	padding: 4px 9px;
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
.maplegend {
	position: relative;
	button {
		// background-color: #fff !important;
		-webkit-box-shadow: 0 0px 2px rgba(0, 0, 0, 0.65) !important;
		box-shadow: 0 0px 2px rgba(0, 0, 0, 0.65) !important;
		padding: 1px 6px !important;
		border: 0px solid #ddd !important;
		// color: #000 !important;
		border-radius: 5px !important;
		top: 45px !important;
		left: -20px !important;
		position: absolute;
	}
	.legend-menu {
		-webkit-box-shadow: 0 0px 2px rgba(0, 0, 0, 0.65) !important;
		box-shadow: 0 0px 2px rgba(0, 0, 0, 0.65) !important;
		position: absolute;
		left: -20px;
		top: 72px;
		font-size: inherit;
		padding: 1px;
		min-width: 6rem;
		.legend-item {
			padding: 1px;
			display: block;
			text-decoration: none;
		}
	}
}
</style>
