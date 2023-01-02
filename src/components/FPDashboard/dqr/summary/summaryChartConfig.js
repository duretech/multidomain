const summaryChartconfig = {
	chart: {
		type: "solidgauge",
	},
	title: {
		text: "",
		y: 10,
	},
	pane: {
		center: ["50%", "75%"],
		size: "120%",
		startAngle: -90,
		endAngle: 90,
		background: {
			backgroundColor: "#EEE",
			innerRadius: "60%",
			outerRadius: "100%",
			shape: "arc",
		},
	},

	exporting: {
		enabled: false,
		chartOptions: {
			title: {
				text: "",
				style: {
					fontFamily: "Roboto",
					fontSize: "20px",
				},
			},
			chart: {
				height: 768,
				width: 1024,
				marginTop: 100,
				marginBottom: 200,
				events: {
					load: function () {
						var renderer = this.renderer;
					},
				},
			},
			legend: {
				layout: "horizontal",
				align: "left",
				verticalAlign: "bottom",
				x: 50,
				y: 20,
				floating: false,
				maxHeight: 150,
				width: 600,
				itemMarginTop: 0,
				itemMarginBottom: 0,
			},
			credits: {
				position: {
					y: -220,
				},
			},
			xAxis: {
				labels: {
					rotation: 45,
				},
			},
			plotOptions: {
				line: {
					dataLabels: {
						enabled: true,
					},
				},
				spline: {
					dataLabels: {
						enabled: true,
					},
				},
				column: {
					stacking: "",
					dataLabels: {
						enabled: true,
					},
				},
				area: {
					stacking: "",
					dataLabels: {
						enabled: true,
					},
				},
			},
		},
	},

	tooltip: {
		enabled: false,
		shared: true,
		useHTML: true,
	},

	// the value axis
	yAxis: {
		stops: [
			[1, "#55BF3B"], // green
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
		max: 7,
		tickPositioner: function () {
			return [this.min, this.max];
		},
	},
	credits: {
		enabled: false,
	},

	series: [
		{
			name: "",
			data: [
				{
					y: 0,
					radius: 100,
					innerRadius: 60,
				},
			],
			dataLabels: {
				enabled: false,
				format:
					'<div style="text-align:center">' +
					'<span style="font-size:0.75rem;opacity:1">Score</span><br/>' +
					'<span style="font-size:1rem">{y}/6</span><br/>' +
					"</div>",
			},
			tooltip: {
				valueSuffix: " ",
				shared: true,
				useHTML: true,
			},
		},
	],

	plotOptions: {
		solidgauge: {
			dataLabels: {
				y: 5,
				borderWidth: 0,
				useHTML: true,
			},
		},
	},
};

export default summaryChartconfig;
