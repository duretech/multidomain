<template>
	<div>
		<l-geo-json
			v-if="showGeoJson && indicatorObj"
			:geojson="geojson"
			:options="options"
			:key="geoJsonKey"
			ref="myGeo"
		></l-geo-json>
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
			position="bottomleft"
			v-if="locName && type != 'bubble' && topLevelVal"
			class="locationNameDiv"
		>
			<span class="location--name">{{ locName }}: {{ topLevelVal }}</span>
		</l-control>
		<l-control
			position="bottomright"
			v-else-if="locName && topLevelVal"
			class="locationNameDiv"
		>
			<span class="location--name"
				>{{ locName }}: {{ topLevelVal }}
				<i class="fa fa-circle" v-bind:style="{ color: topColor }"></i
			></span>
		</l-control>
	</div>
</template>

<script>
import service from "@/service";
import { LGeoJson, LControl, LMarker, LPopup, LIcon } from "vue2-leaflet";
import { geoJSON, latLng, icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import * as LocationModes from "leaflet-dvf";
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
		"locName",
		"indicatorObj",
		"scaleDesc",
		"mapInstance",
		"drillObj",
		"currentLevel",
		"indicatorMeta",
		"itemsDefinition",
		"defaultLocationID",
		"facilityLevelID",
		"type",
		"mapData",
		"periodType",
	],
	components: {
		LGeoJson,
		LControl,
		LMarker,
		LPopup,
		LIcon,
	},
	data() {
		return {
			geojson: null,
			fillColor: "#006fc1",
			enableTooltip: true,
			scaleDescription: this.scaleDesc,
			currentYear: "",
			showlegend: false,
			yearArr: null,
			geoJsonKey: 0,
			indicatorName: "Indicator Name",
			showGeoJson: true,
			showMarker: false,
			markers: [],
			icon: L.icon({
				iconUrl: require("leaflet/dist/images/marker-icon.png"),
				shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
				iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
			}),
			topLevelVal: "",
			locNameLayer: null,
			layerObj: null,
			formatedTooltipDate: null,
			topColor: "#006fc1",
		};
	},
	created() {
		service
			.getGeoJson(this.defaultLocationID, this.currentLevel + 1)
			.then((response) => {
				if (
					Object.keys(this.indicatorObj).length > 0 &&
					this.indicatorObj[this.currentYear][this.defaultLocationID] !=
						undefined
				) {
					this.topLevelVal =
						this.indicatorObj[this.currentYear][this.defaultLocationID];
				}
				if (this.type == "bubble") {
					this.mapData.series.forEach((key) => {
						key.data.forEach((val) => {
							if (val.id == this.defaultLocationID) {
								this.topColor = key.color;
							}
						});
					});
				}

				if (this.currentLevel + 1 < this.facilityLevelID) {
					this.showGeoJson = true;
					this.showMarker = false;
					this.geojson = response.data;

					var layerFeatureJSON = geoJSON(this.geojson);
					var mapCentroid = layerFeatureJSON.getBounds();
					this.mapInstance.fitBounds(mapCentroid);
				} else {
					//console.log('Show facilities')

					this.showGeoJson = false;
					this.showMarker = true;

					// console.log(this.currentLevel)
					// console.log(this.facilityLevelID)
					// console.log(response.data)
					// console.log(this.indicatorObj)
					if (Object.keys(this.indicatorObj).length > 0) {
						Object.keys(this.indicatorObj[this.currentYear]).forEach((id) => {
							for (var i in response.data.features) {
								if (id == response.data.features[i]["id"]) {
									//console.log(response.data.features[i])
									this.markers.push({
										id: response.data.features[i].id,
										latlng: latLng(
											response.data.features[i].geometry.coordinates[1],
											response.data.features[i].geometry.coordinates[0]
										),
										visible: true,
										icon: this.icon,
										content:
											response.data.features[i].properties.name +
											" - " +
											this.indicatorObj[this.currentYear][
												response.data.features[i].id
											],
									});
								}
							}
						});
					}
				}
				if (this.currentLevel + 1 < this.facilityLevelID) {
					this.$emit("geoJsonValue", response.data);
				}
			})
			.catch(() => {
				console.log("GeoJson created catch");
				this.$emit("geoJsonValue", null);
			});

		let oIndicatorMeta = this.indicatorMeta[0]
			? this.indicatorMeta[0].indicator
			: null;
		this.indicatorName = oIndicatorMeta
			? oIndicatorMeta.name
			: "Indicator Name";
		this.yearArr = Object.keys(this.indicatorObj);
		// console.log('this.indicatorObj',this.indicatorObj)
		this.currentYear = this.yearArr[this.yearArr.length - 1];
		// console.log('this.currentYear',this.currentYear)
		this.formatedTooltipDate = translateDate({
			rawDate: this.currentYear,
			periodType: this.periodType,
		});
		// console.log('this.formatedTooltipDate',this.formatedTooltipDate)
		this.showlegend = true;
	},
	computed: {
		options() {
			this.layerObj = {
				style: this.styleFunction,
				onEachFeature: this.onEachFeatureFunction,
			};
			return this.layerObj;
		},
		styleFunction() {
			return (feature) => {
				let fillColor = this.getFillColor(this.getFeatureValue(feature.id));
				return {
					weight: 2,
					color: "#cecece",
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
	methods: {
		currentYearChange(year) {
			this.currentYear = year;
			this.geoJsonKey++;
		},
		getToolTipContent(locationISO, locationName) {
			// console.log(this.itemsDefinition)
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
				: (content +=
						"<div>" + this.$i18n.t("no_data_to_display") + "</div></div>");

			return content;
		},
		getFeatureValue(paramId) {
			var returnVal = -1;
			var dataVal = this.indicatorObj[this.currentYear][paramId];
			if (dataVal) {
				returnVal = dataVal;
			}
			return returnVal;
		},
		highlightFeature(e) {
			var layer = e.target;
			layer.setStyle({
				weight: 3,
				color: "#cecece",
				dashArray: "",
				fillOpacity: 0.7,
			});
		},
		resetHighlight(e) {
			var layer = e.target;
			layer.setStyle({
				weight: 2,
				opacity: 1,
				color: "#cecece",
				dashArray: "",
				fillOpacity: 1,
			});
		},
		drilldown(e) {
			//console.log(e)
			//e.preventDefault()
			this.$emit("drilldown", e);
		},
		getFillColor(value) {
			var returnColor = "#EEEEEE";
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

			return returnColor;
		},
	},
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.location--name {
	background-color: #171a22;
	padding: 4px 4px;
	border-radius: 2px;
	color: #fff;
	font-weight: 600;
	letter-spacing: 0.5px;
}
</style>
