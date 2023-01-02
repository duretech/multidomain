<template>
	<div>
		<highcharts class="maincharts gauge" :options="chartOptions"></highcharts>
	</div>
</template>

<script>
export default {
	props: ["title", "score", "scoreLimit"],
	data() {
		return {
			chartOptions: {
				chart: {
					type: "solidgauge",
					plotBorderWidth: 0,
				},
				title: null,
				pane: {
					center: ["50%", "65%"],
					size: "100%",
					startAngle: -90,
					endAngle: 90,
					background: {
						backgroundColor: "#EEE",
						innerRadius: "100%",
						outerRadius: "75%",
						shape: "arc",
					},
				},
				exporting: {
					enabled: false,
				},
				tooltip: {
					enabled: false,
					shared: true,
					useHTML: true,
				},
				credits: {
					enabled: false,
				},
				// the value axis
				yAxis: {
					stops: [
						[0.3, "#FE8A67"],
						[0.6, "#FE8A67"],
						[0.9, "#B83C6D"],
					],
					lineWidth: 0,
					tickWidth: 0,
					minorTickInterval: null,
					tickPixelInterval: 0,
					title: {
						y: -70,
					},
					labels: {
						y: 16,
						enabled: true,
					},
					min: 0,
					max: 10,
					tickPositioner: function () {
						return [this.min, this.max];
					},
				},
				plotOptions: {
					solidgauge: {
						innerRadius: "75%",
						dataLabels: {
							y: 1,
							borderWidth: 0,
							useHTML: true,
						},
					},
				},
				series: [
					{
						data: [],
						dataLabels: {
							format:
								'<div style="text-align:center">' +
								'<span style="font-size:9px;color:white;">{y}/10</span><br/>' +
								"</div>",
						},
					},
				],
			},
		};
	},
	watch: {
		score(newValue) {
			//console.log("score", newValue);
			this.$nextTick(() => {
				this.setValue();
			});
		},
	},
	methods: {
		setValue() {
			this.chartOptions.series[0].data[0] =
				this.score === "N/A" ? 0 : this.score;
			let score =
				this.score === "N/A" ? `${this.score}` : `{y}/${this.scoreLimit}`;
				if(score === "N/A"){
					this.chartOptions.pane.background.innerRadius = "0%"
					this.chartOptions.pane.background.outerRadius = "0%"
				}
			this.chartOptions.series[0].dataLabels = {
				format: `<div style="text-align:center"><span style="font-size:9px;color:white;">${score}</span><br/></div>`,
			};
			this.chartOptions.yAxis.max = this.scoreLimit;
			this.chartOptions.yAxis.tickPositioner = function () {
				return [this.min, this.max];
			};
		},
	},
	created() {
		this.setValue();
	},
};
</script>