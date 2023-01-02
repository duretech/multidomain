const defaultConfig = {
	chart: { type: "lowmedhigh", zoomType: "x", height: 350 },
	title: {
		text: "",
	},
	subtitle: { text: "" },
	xAxis: [
		{
			accessibility: { description: "" },
			categories: [],
			crosshair: true,
			min: 0,
			scrollbar: {
				enabled: true,
				width: 50,
				barBorderRadius: 7,
				barBorderWidth: 0,
				buttonBorderWidth: 0,
				buttonArrowColor: "#2f2e46",
				buttonBorderRadius: 7,
				rifleColor: "#98989896",
				trackBackgroundColor: "#2f2e46",
				trackBorderWidth: 0,
				trackBorderColor: "silver",
				trackBorderRadius: 7,
				minWidth: 1,
				barBackgroundColor: "#12122a",
				buttonBackgroundColor: "#12122a",
			},
			labels: { rotation: -45 },
			title: { text: "" },
		},
	],
	legend: {
		enabled: false,
	},
	yAxis: {
		title: { text: "" },
		max: 100,
	},
	tooltip: {
		// shared: false,
		// style: {
		// 	color: '#212529',
		// 	fontWeight: 'bold'
		// },
		// headerFormat: null,
		// pointFormat: "<b>{point.name}</b>: <b>{point.y}</b>",
		shared: true,
		useHTML: true,
	},
	exporting: {
		enabled: false,
	},
	credits: { enabled: false },
	series: [
		{
			name: "Coverage",
			type: "column",
			color: "#47c49a",
			data: [],
			lineWidth: 0,
			states: { hover: { lineWidthPlus: 0 } },
		},
		// {
		// 	name: "High & Low",
		// 	data: [],
		// },
		{
			name: "Benchmark",
			type: "line",
			data: [],
			lineWidth: 0,
			states: { hover: { lineWidthPlus: 0 } },
			marker: {
				radius: 8,
			},
		},
	],
};

export default defaultConfig;
