const basicChartconfig = {
	column: {
		chart: {
			renderTo: "container",
			// height: 550,
			type: "column",
			zoomType: "x",
			oType: "column",
		},
		title: {
			text: "",
		},
		subtitle: {
			text: "",
		},
		xAxis: {
			type: "category",
			crosshair: true,
			scrollbar: {
				enabled: true,
				width: 100,
				barBorderRadius: 7,
				barBorderWidth: 0,
				buttonBorderWidth: 0,
				buttonArrowColor: '#2f2e46',
				buttonBorderRadius: 7,
				rifleColor: '#98989896',
				trackBackgroundColor: '#2f2e46',
				trackBorderWidth: 0,
				trackBorderColor: 'silver',
				trackBorderRadius: 7,
				minWidth: 1,
				barBackgroundColor: '#12122a',
				buttonBackgroundColor: '#12122a'
			  },
			title: {
				text: "",
			},
		},
		yAxis: {
			min: 0,
			title: {
				text: "",
			},
			plotLines: [
				{
					value: undefined,
					percValue: undefined,
					valueType: "percentage",
					color: "#ff0000",
					width: 1,
					zIndex: 5,
					dashStyle: "solid",
					label: {
						enabled: false,
						text: "",
						textVisible: "",
						align: "center",
						style: {
							color: "#000000",
						},
					},
				},
			],
		},
		legend: {
			enabled: true,
			backgroundColor: "transparent",
			borderColor: "#a7a7a7",
			borderWidth: 1,
			borderRadius: 5,
		},
		exporting: {
			enabled: false,
			sourceWidth: 1200,
			sourceHeight: 500,
			chartOptions: {
				plotOptions: {
					series: {
						stacking: "",
						dataLabels: {
							enabled: true,
						},
					},
				},
			},
		},
		credits: {
			enabled: false,
		},
		tooltip: {
			shared: true,
			// pointFormat: "",
			useHTML: true,
		},
		plotOptions: {
			series: {
				stacking: "",
				pointPadding: 0.2,
				borderWidth: 0,
				dataLabels: {
					enabled: true,
				},
			},
		},
		series: [],
		drilldown: {
			drillUpButton: {
				position: {
					align: "left",
					x: 0,
					y: 0,
				},
			},
			series: [],
		},
	},
	column_stacked: {
		chart: {
			renderTo: "container",
			// height: 550,
			type: "column",
			oType: "column_stacked",
			zoomType: "x",
		},
		title: {
			text: "",
		},
		subtitle: {
			text: "",
		},
		xAxis: {
			type: "category",
			title: {
				text: "",
			},
		},
		yAxis: {
			min: 0,
			title: {
				text: "",
			},
			stackLabels: {
				enabled: true,
				style: {
					fontWeight: "bold",
					color: "gray",
				},
			},
			plotLines: [
				{
					value: undefined,
					percValue: undefined,
					valueType: "percentage",
					color: "#ff0000",
					width: 1,
					zIndex: 5,
					dashStyle: "solid",
					label: {
						enabled: false,
						text: "",
						textVisible: "",
						align: "center",
						style: {
							color: "#000000",
						},
					},
				},
			],
		},
		legend: {
			enabled: true,
			backgroundColor: "transparent",
			borderColor: "#a7a7a7",
			borderWidth: 1,
			borderRadius: 5,
		},
		exporting: {
			enabled: false,
			sourceWidth: 1200,
			sourceHeight: 500,
			chartOptions: {
				plotOptions: {
					series: {
						stacking: "normal",
						dataLabels: {
							enabled: true,
						},
					},
				},
			},
		},
		credits: {
			enabled: false,
		},
		tooltip: {
			shared: true,
			pointFormat: "",
			useHTML: true,
		},
		plotOptions: {
			series: {
				stacking: "normal",
				minPointLength: 3,
				dataLabels: {
					enabled: true,
				},
			},
		},
		series: [],
		drilldown: {
			drillUpButton: {
				position: {
					align: "left",
					x: 0,
					y: 0,
				},
			},
			series: [],
		},
	},
	line: {
		chart: {
			// height: 550,
			type: "line",
			oType: "line",
			zoomType: "x",
		},
		title: {
			text: "",
		},
		subtitle: {
			text: "",
		},
		xAxis: {
			type: "category",
			crosshair: true,
			scrollbar: {
				enabled: true,
				width: 100,
				barBorderRadius: 7,
				barBorderWidth: 0,
				buttonBorderWidth: 0,
				buttonArrowColor: '#2f2e46',
				buttonBorderRadius: 7,
				rifleColor: '#98989896',
				trackBackgroundColor: '#2f2e46',
				trackBorderWidth: 0,
				trackBorderColor: 'silver',
				trackBorderRadius: 7,
				minWidth: 1,
				barBackgroundColor: '#12122a',
				buttonBackgroundColor: '#12122a'
			  },
			title: {
				text: "",
			},
		},
		yAxis: {
			title: {
				text: "",
			},
			plotLines: [
				{
					value: undefined,
					percValue: undefined,
					valueType: "percentage",
					color: "#ff0000",
					width: 1,
					zIndex: 5,
					dashStyle: "solid",
					label: {
						enabled: false,
						text: "",
						textVisible: "",
						align: "center",
						style: {
							color: "#000000",
						},
					},
				},
			],
		},
		legend: {
			enabled: true,
			backgroundColor: "transparent",
			borderColor: "#a7a7a7",
			borderWidth: 1,
			borderRadius: 5,
		},
		exporting: {
			enabled: false,
			sourceWidth: 1200,
			sourceHeight: 500,
			chartOptions: {
				plotOptions: {
					series: {
						stacking: "",
						dataLabels: {
							enabled: true,
						},
					},
				},
			},
		},
		credits: {
			enabled: false,
		},
		tooltip: {
			shared: true,
			// pointFormat: "",
			useHTML: true,
		},
		plotOptions: {
			series: {
				stacking: "",
				dataLabels: {
					enabled: true,
				},
			},
		},
		series: [],
		drilldown: {
			drillUpButton: {
				position: {
					align: "left",
					x: 0,
					y: 0,
				},
			},
			series: [],
		},
	},
	area: {
		chart: {
			// height: 550,
			type: "area",
			oType: "area",
			zoomType: "x",
		},
		accessibility: {
			description: "",
		},
		title: {
			text: "",
		},
		subtitle: {
			text: "",
		},
		xAxis: {
			allowDecimals: false,
			labels: {
				formatter: function () {
					return this.value;
				},
			},
			title: {
				text: "",
			},
		},
		yAxis: {
			title: {
				text: "",
			},
			plotLines: [
				{
					value: undefined,
					percValue: undefined,
					valueType: "percentage",
					color: "#ff0000",
					width: 1,
					zIndex: 5,
					dashStyle: "solid",
					label: {
						enabled: false,
						text: "",
						textVisible: "",
						align: "center",
						style: {
							color: "#000000",
						},
					},
				},
			],
		},
		legend: {
			enabled: true,
			backgroundColor: "transparent",
			borderColor: "#a7a7a7",
			borderWidth: 1,
			borderRadius: 5,
		},
		exporting: {
			enabled: false,
			sourceWidth: 1200,
			sourceHeight: 500,
			chartOptions: {
				plotOptions: {
					series: {
						stacking: "",
						dataLabels: {
							enabled: true,
						},
					},
				},
			},
		},
		credits: {
			enabled: false,
		},
		tooltip: {
			shared: true,
			pointFormat: "",
			useHTML: true,
		},
		plotOptions: {
			series: {
				stacking: "",
				marker: {
					enabled: false,
					symbol: "circle",
					radius: 2,
					states: {
						hover: {
							enabled: true,
						},
					},
				},
				dataLabels: {
					enabled: true,
				},
			},
		},
		series: [],
		drilldown: {
			drillUpButton: {
				position: {
					align: "left",
					x: 0,
					y: 0,
				},
			},
			series: [],
		},
	},
	bar: {
		chart: {
			// height: 550,
			type: "bar",
			oType: "bar",
			zoomType: "x",
		},
		title: {
			text: "",
		},
		subtitle: {
			text: "",
		},
		xAxis: {
			type: "category",
			title: {
				text: "",
			},
		},
		yAxis: {
			min: 0,
			title: {
				text: "",
				align: "high",
			},
			labels: {
				overflow: "justify",
			},
			plotLines: [
				{
					value: undefined,
					percValue: undefined,
					valueType: "percentage",
					color: "#ff0000",
					width: 1,
					zIndex: 5,
					dashStyle: "solid",
					label: {
						enabled: false,
						text: "",
						textVisible: "",
						align: "center",
						style: {
							color: "#000000",
						},
					},
				},
			],
		},
		tooltip: {
			shared: true,
			pointFormat: "",
			useHTML: true,
		},
		plotOptions: {
			series: {
				stacking: "",
				dataLabels: {
					enabled: true,
				},
			},
		},
		legend: {
			enabled: true,
			backgroundColor: "transparent",
			borderColor: "#a7a7a7",
			borderWidth: 1,
			borderRadius: 5,
		},
		exporting: {
			enabled: false,
			sourceWidth: 1200,
			sourceHeight: 500,
			chartOptions: {
				plotOptions: {
					series: {
						stacking: "",
						dataLabels: {
							enabled: true,
						},
					},
				},
			},
		},
		credits: {
			enabled: false,
		},
		series: [],
		drilldown: {
			drillUpButton: {
				position: {
					align: "left",
					x: 0,
					y: 0,
				},
			},
			series: [],
		},
	},
	bar_stacked: {
		chart: {
			// height: 550,
			type: "bar",
			oType: "bar_stacked",
			zoomType: "x",
		},
		title: {
			text: "",
		},
		subtitle: {
			text: "",
		},
		xAxis: {
			type: "category",
			title: {
				text: "",
			},
		},
		yAxis: {
			min: 0,
			title: {
				text: "",
			},
			stackLabels: {
				enabled: true,
				style: {
					fontWeight: "bold",
					color: "gray",
				},
			},
			plotLines: [
				{
					value: undefined,
					percValue: undefined,
					valueType: "percentage",
					color: "#ff0000",
					width: 1,
					zIndex: 5,
					dashStyle: "solid",
					label: {
						enabled: false,
						text: "",
						textVisible: "",
						align: "center",
						style: {
							color: "#000000",
						},
					},
				},
			],
		},
		legend: {
			enabled: true,
			backgroundColor: "transparent",
			borderColor: "#a7a7a7",
			borderWidth: 1,
			borderRadius: 5,
		},
		tooltip: {
			shared: true,
			pointFormat: "",
			useHTML: true,
		},
		plotOptions: {
			series: {
				stacking: "normal",
				minPointLength: 3,
				dataLabels: {
					enabled: true,
				},
			},
		},
		exporting: {
			enabled: false,
			sourceWidth: 1200,
			sourceHeight: 500,
			chartOptions: {
				plotOptions: {
					series: {
						stacking: "normal",
						dataLabels: {
							enabled: true,
						},
					},
				},
			},
		},
		credits: {
			enabled: false,
		},
		series: [],
		drilldown: {
			drillUpButton: {
				position: {
					align: "left",
					x: 0,
					y: 0,
				},
			},
			series: [],
		},
	},
	pie: {
		chart: {
			// height: 550,
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: "pie",
			oType: "pie",
		},
		title: {
			text: "",
		},
		tooltip: {
			shared: true,
			pointFormat: "",
			useHTML: true,
		},
		legend: {
			enabled: true,
			backgroundColor: "transparent",
			borderColor: "#a7a7a7",
			borderWidth: 1,
			borderRadius: 5,
		},
		exporting: {
			enabled: false,
			sourceWidth: 1200,
			sourceHeight: 500,
			chartOptions: {
				plotOptions: {
					series: {
						stacking: "",
						dataLabels: {
							enabled: true,
						},
					},
				},
			},
		},
		credits: {
			enabled: false,
		},
		plotOptions: {
			series: {
				stacking: "",
				allowPointSelect: true,
				cursor: "pointer",
				depth: 35,
				dataLabels: {
					enabled: true,
				},
				showInLegend: true,
			},
		},
		series: [],
	},
};

export default basicChartconfig;
