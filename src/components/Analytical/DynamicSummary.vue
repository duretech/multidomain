<template>
	<b-row id="modal-anc">
		<b-col class="tablemap-col1 pr-4 modal-content" sm="12" lg="6">
			<div :key="i" v-for="(obj, i) in sumArray">
				<b-row class="pt-1 pb-1 pl-3" v-if="obj.summaryDetails && i === 0">
					<b-col cols="4"></b-col>
					<b-col class="table-heading pr-0" cols="2"
					><p class="fs-17-1920">
						{{ obj.summaryDetails[0].prevForDate }}
					</p></b-col
					>
					<b-col class="table-heading pr-0" cols="2"
						><p class="fs-17-1920">
							{{ obj.summaryDetails[0].currForDate }}
						</p>
					</b-col>
					<b-col class="table-heading pr-0" cols="2"
						><p class="fs-17-1920">{{ $t("change%") }}</p></b-col
					>
					<b-col class="table-heading pr-0" cols="2"
						><p class="fs-17-1920">{{ $t("2014dhs") }}</p></b-col
					>
				</b-row>
				<!-- {{ obj.summaryDetails }} -->
				<b-row
					class="pt-1 pb-2 valueRow"
					v-for="(sDetails, i) in obj.summaryDetails"
					:key="'details' + i"
				>
					<b-col class="table-heading pt-2" cols="4"
						><p class="fs-17-1920">{{ sDetails.indicatorName }}</p></b-col
					>
					<b-col cols="2"
						><div class="summary-dot fs-17-1920">
							{{ sDetails.prevValue }}
						</div></b-col
					>
					<b-col cols="2"
						><div class="summary-dot fs-17-1920">
							{{ sDetails.currValue }}
						</div></b-col
					>
					<b-col cols="2">
						<div class="summary-dot fs-17-1920" :class="sDetails.colorLastYr">
							{{ sDetails.change }}
						</div></b-col
					>
					<b-col cols="2"
						><div class="summary-dot fs-17-1920">61.5%</div></b-col
					>
				</b-row>
			</div>
			<div class="anc-map">
				<Maps
					v-if="mapList && mapList.length > 0 && geoJson"
					class="mx-2 mb-2"
					:data="mapList"
					showArea="false"
					:geoJson="geoJson"
				/>
			</div>
		</b-col>
		<b-col class="anc-charts tablemap-col2" sm="12" lg="6">
			<div :key="i" v-for="(obj, i) in sumArray">
				<!-- <span :key="i" style="color: white">"index of chart "+{{ i }}</span> -->
				<HighChartComponentDynamic
					v-if="obj.trend"
					:chartData="obj.trend"
					class="border-bottom"
					:dataFetched="true"
					:chartType="'period'"
					:isHideOption="true"
				/>
			</div>
		</b-col>
	</b-row>
</template>
<script>
// import Maps from "@/components/Maps/MapNew.vue";
import { LMap, LControlZoom, LControl, LGeoJson } from "vue2-leaflet";
import LControlFullscreen from "vue2-leaflet-fullscreen";
import "leaflet/dist/leaflet.css";
// import GeoJson from "@/config/Harmonia_province.json";
import Yearslider from "@/components/Common/Yearslider.vue";
import dom_to_image from "dom-to-image";
import HighChartComponentDynamic from "@/components/Highcharts/HighChartComponentDynamic";
import Maps from "@/components/Maps/MapNew.vue";

export default {
	props: ["locationPeriod", "summaryList", "mapList", "geoJson"],
	components: {
		// Maps,
		LMap,
		// LTileLayer,
		LControlZoom,
		LControl,
		LGeoJson,
		LControlFullscreen,
		Yearslider,
		HighChartComponentDynamic,
		Maps,
	},
	data() {
		return {
			selectedInd: "Please Choose",
			activeicon: "",
			//summaryObj: this.summaryList[0],
			// sumArray: [],
			map: null,
			pType: "yearly",
			updatedYaerSliderValue: null,
			url: null,
			zoom: 4,
			center: [49.919437, 19.145136],
			scaleDescription: [],
			scales: [
				{
					highScale: "25",
					lowScale: "0",
					scaleColor: "#d5f1ff",
					scaleLabel: "Low",
				},
				{
					highScale: "25",
					lowScale: "50",
					scaleColor: "#d5f1ff",
					scaleLabel: "high",
				},
			],
			yearArr: null,
		};
	},
	created() {
		// this.sumArray = [];
		// this.sumArray.push(this.summaryList[0]);
		// this.sumArray.push(this.summaryList[1]);
		this.scaleDescription.push({ scales: this.scales });
		this.yearArr = [2014, 2015, 2016, 2017, 2018];
		this.yearArr.sort();
		this.updatedYaerSliderValue = this.yearArr[this.yearArr.length - 1];
		this.modalShown();
	},
	methods: {
		getActive(val) {
			this.activeicon = val;
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
			this.zoom = 4;
			this.center = [50.919437, 21.145136];
			this.$refs.mapObj.setCenter(this.center);
			this.$refs.mapObj.setZoom(this.zoom);
		},
		modalShown() {
			// setTimeout(() => { //to reframe map
			//   //mapObject is a property that is part of leaflet
			//   this.$refs.mapObj.mapObject.invalidateSize();
			// }, 100);
		},
		onCancel() {
			this.$emit("visiblechange", false);
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
	},
	computed: {
		getOptions() {
			let layerObj = {
				style: this.bstyleFunction,
				onEachFeature: this.onEachFeatureFunction,
			};
			return layerObj;
		},
		sumArray() {
			let arr = [];
			let tb = this.$store.getters.getActiveTab.split("--")[2];
			if (this.summaryList && this.summaryList.length > 0) {
				arr = this.summaryList.filter((obj) => obj.parentTab === tb);
			}
			return arr;
		},
		bstyleFunction() {
			return (feature) => {
				let name = feature.properties.Province;
				if (name == "Province Orange") {
					return {
						stroke: true,
						color: "#FF6850",
						weight: 1.5,
						opacity: 1.5,
						fillColor: "#FF6850",
						fillOpacity: 2,
					};
				} else if (name == "Province Green") {
					return {
						stroke: true,
						color: "#69D48C",
						weight: 1.5,
						opacity: 1.5,
						fillColor: "#69D48C",
						fillOpacity: 2,
					};
				} else if (name == "Province Yellow" || name == "Province Red") {
					return {
						stroke: true,
						color: "#65648c",
						weight: 1.5,
						opacity: 1.5,
						fillColor: "#65648c",
						fillOpacity: 2,
					};
				} else {
					return {
						stroke: true,
						color: "#65648c",
						weight: 1.5,
						opacity: 1.5,
						fillColor: "#65648c",
						fillOpacity: 2,
					};
				}
			};
		},
		onEachFeatureFunction() {
			return (feature, layer) => {
				var locationName = feature.properties.Province;
				var tooltipContent = this.getToolTipContent(locationName);
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
		summaryList: {
			handler: function (newValue) {
				if (newValue) {
					console.log("summaryList in watch", newValue);
				}
			},
			deep: true,
		},
	},
};
</script>

<style scoped></style>
