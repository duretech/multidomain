import { chartExport } from "@/components/Common/commonFunctions";
export default {
	methods: {
		exportChart(type) {
			let chart = this.$refs.barCharts.chart;
			// console.log("chart", chart);
			let max = chart.options.xAxis[0].max,
				yMin = chart.yAxis[0].min,
				yMax = chart.yAxis[0].max,
				catLen = chart.options.series[0].data.length - 1;
			if (!this.drilldown) {
				chart.options.xAxis[0].max = null;
				chart.options.xAxis[0].min = 0;
				if (this.derivedChart) {
					chart.xAxis[0].setExtremes(0, catLen);
				}
			} else {
				chart.yAxis[0].setExtremes(yMin, yMax);
			}

			chartExport(type, chart);
			setTimeout(() => {
				if (!this.drilldown) {
					chart.options.xAxis[0].max = max;
					if (this.derivedChart) {
						chart.xAxis[0].setExtremes(catLen - 11, catLen);
					}
				}
			}, 100);
		},
	},
};
