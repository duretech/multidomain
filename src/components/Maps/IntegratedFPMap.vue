<template>
	<div>
		<div class="map-container fp-map p-0">
			<div class="map fp-map p-0">
				<div>
					<b-row class="map-row">
						<b-col cols="12">
							<l-map
								class="l-map integratedMap fs-17-1920"
								ref="mapObjNew"
								:zoom="zoom"
								:center="center"
								@ready="mapReady"
								:options="{
									zoomControl: false,
									attributionControl: false,
									scrollWheelZoom: showIcons === 'true' ? true : false,
									dragging: showIcons === 'true' ? true : false,
								}"
								:style="{ height: showIcons === 'true' ? '340px' : '100px' }"
							>
								<l-geo-json
									:geojson="geoJson"
									:options="getOptions"
								></l-geo-json>
								<l-control
									v-if="showIcons === 'true'"
									position="topright"
									id="legend"
									class="legendnew"
								>
									<b-collapse id="my-collapse" visible>
										<div class="maplegend mapDivLegend fs-17-1920">
											<ul>
												<li>
													<a
														class="dropdown-item descVal fs-15-1920"
														v-for="(scales, index) in scaleDescription[0]
															.scales"
														:key="index"
													>
														<!--                               @change="newColorForMap($event)"
 -->
														<input
															type="color"
															class="cursor-pointer mapInputBox fs-17-1920"
															v-bind:style="{
																color:
																	scaleDescription[0].scales[index].scaleColor,
															}"
															v-bind:value="
																scaleDescription[0].scales[index].scaleColor
															"
															readonly
															disabled
															v-if="!exportingPdf"
														/>
														<canvas v-if="exportingPdf" v-bind:style="{
																background:
																	scaleDescription[0].scales[index].scaleColor,
															}" style="display: inline; border:1px solid white ;padding: 4px;height: 4px;"></canvas>
														<span class="low-high fs-17-1920 ml-2">{{
															scaleDescription[0].scales[index].scaleLabel
														}}</span></a
													>
												</li>
											</ul>
										</div>
									</b-collapse>
								</l-control>
								<l-control-fullscreen
									v-if="showIcons === 'true' && !exportingPdf"
									position="topright"
									class="full-screen"
									:options="{
										title: { false: 'View Full Screen', true: 'Be regular' },
									}"
								/>
								<l-control-zoom
									v-if="showIcons === 'true' && !exportingPdf"
									style="padding: 4px 8.5px"
									position="topright"
									zoomInTitle="Zoom In"
									zoomOutTitle="Zoom Out"
									class="zoom-inout"
								>
								</l-control-zoom>
								<l-control v-if="showIcons === 'true' && !exportingPdf" position="topright">
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
//import ChartOptions from "@/components/ChartOptions.vue"
import { LMap, LControlZoom, LControl, LGeoJson } from "vue2-leaflet";
import * as LocationModes from "leaflet-dvf";
import LControlFullscreen from "vue2-leaflet-fullscreen";
import "leaflet/dist/leaflet.css";
// import GeoJson from "@/config/Harmonia_province.json";
import Yearslider from "@/components/Common/Yearslider.vue";

// / <l-map ref="myMap"> </l-map>
export default {
	// name: 'MyAwesomeMap',
	props: ["mapData", "geoJson", "showIcons","exportingPdf"],

	components: {
		LMap,
		// LTileLayer,
		LControlZoom,
		LControl,
		LGeoJson,
		LControlFullscreen,
		Yearslider,
		//ChartOptions
	},
	data() {
		return {
			map: null,
			pType: "yearly",
			url: null,
			updatedYaerSliderValue: null,
			zoom: 4.5,
			center: [52.119437, 23.145136],
			geojson: null,
			scaleDescription: [],
			scales: [
				{
					highScale: "25",
					lowScale: "0",
					scaleColor: "#FF6850",
					scaleLabel: "Lowest Coverage",
				},
				{
					highScale: "25",
					lowScale: "50",
					scaleColor: "#69D48C",
					scaleLabel: "Highest Coverage",
				},
			],
			yearArr: null,
			locNameLayer: null,
			dataLayer: null,
			isChecked: this.showIcons === "true" ? true : false,
			minVal: null,
			maxVal: null,
			enableTooltip: false,
		};
	},
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
			//   return () => {};
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
		showIcons(newVal) {
			if (newVal === "false") {
				this.zoom = 3;
				this.center = [51.919437, 20.145136];
				this.$nextTick(() => {
					this.$refs.mapObjNew.setCenter(this.center);
					this.$refs.mapObjNew.setZoom(this.zoom);
				});
			} else if (this.showIcons === "true") {
				this.zoom = 5;
				this.center = [52.119437, 23.145136];
				this.$nextTick(() => {
					this.$refs.mapObjNew.setCenter(this.center);
					this.$refs.mapObjNew.setZoom(this.zoom);
				});
			}
		},
		mapData: {
			handler(newVal) {
				if (newVal) {
					this.setMinMax(newVal);
					this.removedLocationName();
					let overlayData = this.getGeoJsonMapped(newVal);
					if (this.isChecked) this.locationNames(overlayData);
				}
			},
			depp: true,
		},
	},
	methods: {
		mapReady(map) {
			this.$nextTick(() => {
				map.invalidateSize();
			});
		},
		setMinMax(mapData) {
			// console.log("setMinMax", mapData)
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
			var returnColor = "#65648c";
			if (value === this.minVal) {
				returnColor = "#FF6850";
			}
			if (value === this.maxVal) {
				returnColor = "#69D48C";
			}
			//let scales = this.scaleDescription[0].scales;

			// for (var i in scales) {
			//   //scales[i]
			//   if (this.type != "bubble") {
			//     value = parseInt(value);
			//     parseInt(scales[i].lowScale);
			//     parseInt(scales[i].highScale);
			//     if (value != undefined && value != -1) {
			//       if (value > scales[i].highScale) {
			//         returnColor = scales[i].scaleColor;
			//       } else {
			//         if (value >= scales[i].lowScale && value <= scales[i].highScale) {
			//           returnColor = scales[i].scaleColor;
			//           break;
			//         }
			//         if (value < scales[i].lowScale) {
			//           returnColor = scales[i].scaleColor;
			//           break;
			//         }
			//       }
			//     }
			//   }
			//   // else {
			//   //   this.mapData.series.forEach((key) => {
			//   //     key.data.forEach((val) => {
			//   //       if (val.value == value) {
			//   //         returnColor = key.color;
			//   //       }
			//   //     });
			//   //   });
			//   //   //returnColor = scales[i].scaleColor;
			//   // }
			// }

			return returnColor;
		},
		getFeatureValue(locId) {
			var returnVal = -1;
			var dataVal = this.mapData.filter((obj) => obj["location"] === locId);
			if (dataVal.length > 0) {
				returnVal = dataVal[0]["data"];
			}
			return returnVal;
		},
		getGeoJsonMapped(indData) {
			let overlaysMap = [];
			if (indData.length > 0) {
				if (this.geoJson != null) {
					for (var i in this.geoJson.features) {
						let layerObj = L.geoJson(this.geoJson.features[i]);
						var mapCentroid = layerObj.getBounds().getCenter();
						let findId = indData.filter((obj) => {
							if (obj["location"] === this.geoJson.features[i]["id"])
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
									findId[0]["data"],
							};
							overlaysMap.push(nameControlObj);
						}
					}
				}
			}
			return overlaysMap;
		},
		locationNames(overlayData) {
			var _this = this;
			// var fg = new L.featureGroup();

			// let data = overlayData;
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
			this.$nextTick(() => {
				this.dataLayer = new L.DataLayer(overlayData, markerOptions).addTo(
					this.$refs.mapObjNew.mapObject
				);
				// } else {
				//   let dataLayer = new L.DataLayer(overlayData, markerOptions);
				// }
			});

			// let nm = new L.LayerGroup(dataLayer).addTo(this.$refs.mapObjNew.mapObject);
			// var overlayMaps = {};
			// // overlayMaps["names"] = new L.LayerGroup([dataLayer]);
			// if (this.isChecked) {
			//   overlayMaps["names"] = new L.LayerGroup([dataLayer]).addTo(
			//     this.$refs.mapObjNew.mapObject
			//   );
			// } else {
			//   overlayMaps["names"] = new L.LayerGroup([dataLayer]);
			// }

			// this.locNameLayer = new L.Control.Layers(null, overlayMaps, {
			//   position: "topleft",
			//   collapsed: false,
			// }).addTo(this.$refs.mapObjNew.mapObject);
		},
		removedLocationName() {
			if (this.locNameLayer != null) {
				this.locNameLayer._layers.filter((obj) => {
					this.$refs.mapObjNew.mapObject.removeLayer(obj["layer"]);
				});
				this.locNameLayer.remove();
			}

			if (this.dataLayer != null) {
				// this.dataLayer._layers.filter((obj) => {
				//   this.$refs.mapObjNew.mapObject.removeLayer(obj["layer"]);
				// });
				this.dataLayer.remove();
			}
		},
		resetMap() {
			this.zoom = 5;
			this.center = [52.119437, 23.145136];
			this.$refs.mapObjNew.setCenter(this.center);
			this.$refs.mapObjNew.setZoom(this.zoom);
			this.$emit("resetMap");
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
	},
	created() {
		this.scaleDescription.push({ scales: this.scales });
		//this.geojson = JSON.parse(JSON.stringify(GeoJson));
		this.yearArr = [2014, 2015, 2016, 2017, 2018];
		this.yearArr.sort();
		this.updatedYaerSliderValue = this.yearArr[this.yearArr.length - 1];
		let overlayData = "";
		if (this.showIcons === "false") {
			this.zoom = 3;
			this.center = [51.919437, 20.145136];
			this.$nextTick(() => {
				this.$refs.mapObjNew.setCenter(this.center);
				this.$refs.mapObjNew.setZoom(this.zoom);
			});
		} else if (this.showIcons === "true") {
			this.zoom = 5;
			this.center = [52.119437, 23.145136];
			this.$nextTick(() => {
				this.$refs.mapObjNew.setCenter(this.center);
				this.$refs.mapObjNew.setZoom(this.zoom);
			});
		}
		if (this.mapData) {
			this.setMinMax(this.mapData);
			this.removedLocationName();
			overlayData = this.getGeoJsonMapped(this.mapData);
			if (this.isChecked) this.locationNames(overlayData);
		}
	},
};
</script>
<style scoped></style>
