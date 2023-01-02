const programPrioritiesChartConfig = {
	comparingPPFPUptake: {
		chart: {
			type: "column",
			zoomType: "x",
		},
		title: {
			text: "",
		},
		subtitle: {
			text: "",
		},
		credits: {
			enabled: false,
		},
		exporting: {
			enabled: false,
			chartOptions: {
				title: {
					text: "Comparing PPFP Uptake",
				},
				plotOptions: {
					column: {
						dataLabels: {
							enable: true,
						},
					},
				},
			},
		},
		xAxis: {
			title: {
				text: "",
			},
			type: "category",
			labels: {
				rotation: -45,
			},
			scrollbar: {
				enabled: true,
				width: 100,
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
		},
		yAxis: {
			min: 0,
			title: {
				text: "",
				style: {
					fontSize: 15,
				},
			},
			labels: {
				enabled: true,
				formatter: function () {
					return this.value;
				},
			},
		},
		tooltip: {
			// headerFormat: '<span style="color:#212529";font-size:0.625rem;">{point.key}</span><br/>',
            // pointFormat: '<span style="color:#212529">{series.name}:{point.y}</span><br/>',
            // footerFormat: '',
			// valueSuffix: '%' 
			shared: true,

        useHTML: true,
		},
		legend: {
			enabled: true,
			// backgroundColor: '#FCFFC5',
			// backgroundColor: '#71b5cd33',
			backgroundColor: "transparent",
			// borderColor: '#C98657',
			// borderColor: '#00000080',
			borderColor: "#a7a7a7",
			borderWidth: 1,
			borderRadius: 5,
			// maxHeight: 60,
			// itemDistance: 50,
		},
		/*   plotOptions: {
             series: {
                 color: '#fd7b7b'
             }
         },*/

		/* tooltip: {
             pointFormat: 'Population in 2017: <b>{point.y:.1f} millions</b>'
         },*/
		series: [],
	},
	trendsInPPFPRegion: {
		chart: {
			type: "line",
			zoomType: "x",
		},
		title: {
			text: "",
		},
		subtitle: {
			text: "",
		},
		credits: {
			enabled: false,
		},
		exporting: {
			enabled: false,
			chartOptions: {
				title: {
					text: "Trends in PPFP Uptake",
				},
				plotOptions: {
					series: {
						dataLabels: {
							enable: true,
						},
					},
				},
			},
		},
		yAxis: {
			min: 0,
			title: {
				text: "",
				style: {
					fontSize: 15,
				},
			},
			labels: {
				enabled: true,
				formatter: function () {
					return this.value;
				},
			},
		},
		tooltip: {
			// headerFormat: '<span style="color:#212529";font-size:0.625rem;">{point.key}</span><br/>',
            // pointFormat: '<span style="color:#212529">{series.name}:{point.y}</span><br/>',
            // footerFormat: '',
			// valueSuffix: '%' 
			shared: true,

        	useHTML: true,
		},
		xAxis: {
			categories: [],
			title: {
				text: "",
			},
			labels: {
				rotation: -45,
			},
			scrollbar: {
				enabled: true,
				width: 100,
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
		},
		legend: {
			enabled: true,
			// backgroundColor: '#FCFFC5',
			// backgroundColor: '#71b5cd33',
			backgroundColor: "transparent",
			// borderColor: '#C98657',
			// borderColor: '#00000080',
			borderColor: "#a7a7a7",
			borderWidth: 1,
			borderRadius: 5,
			// maxHeight: 60,
			// itemDistance: 50,
		},
		plotOptions: {
			/* series: {
                 label: {
                     connectorAllowed: false
                 },
                 pointStart: 2014
             }*/
		},

		series: [],
	},
	overAllPPFPUse: {
		chart: {
			type: "column",
			zoomType: "x",
		},
		title: {
			text: "",
		},
		subtitle: {
			text: "",
		},
		credits: {
			enabled: false,
		},
		exporting: {
			enabled: false,
			chartOptions: {
				title: {
					text: "Overall PPFP Use",
				},
				plotOptions: {
					series: {
						dataLabels: {
							enable: true,
						},
					},
				},
			},
		},
		tooltip: {
			// headerFormat: '<span style="color:#212529";font-size:0.625rem;">{point.key}</span><br/>',
            // pointFormat: '<span style="color:#212529">{series.name}:{point.y}</span><br/>',
            // footerFormat: '',
			// valueSuffix: '%' ,
			shared: true,

        	useHTML: true,
		},
		xAxis: {
			title: {
				text: "",
			},
			//categories: ['Punjab', 'Goa', 'Delhi', 'Kerala', 'Haryana', 'Rajasthan', 'India'],
			type: "category",
			labels: {
				rotation: -45,
			},
			scrollbar: {
				enabled: true,
				width: 100,
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
		},
		yAxis: {
			min: 0,
			title: {
				text: "",
			},
			labels: {
				enabled: true,
				formatter: function () {
					return this.value;
				},
			},
		},
		legend: {
			enabled: true,
			// backgroundColor: '#FCFFC5',
			// backgroundColor: '#71b5cd33',
			backgroundColor: "transparent",
			// borderColor: '#C98657',
			// borderColor: '#00000080',
			borderColor: "#a7a7a7",
			borderWidth: 1,
			borderRadius: 5,
			// maxHeight: 60,
			// itemDistance: 50,
		},
		tooltip: {
			// headerFormat: '<span style="color:#212529";font-size:0.625rem;">{point.key}</span><br/>',
            // pointFormat: '<span style="color:#212529">{series.name}:{point.y}</span><br/>',
            // footerFormat: '',
			// style: {
			// 	color: '#212529',
			// 	fontWeight: 'bold'
			// },
			// headerFormat: '<b>{point.x}</b><br/>',
			// pointFormat: '{series.name}: {point.x} {point.y} ({point.percentage:.0f}%)<br/>',
			//pointFormat:'<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
			shared: true,
			useHTML: true,
		},
		plotOptions: {
			column: {
				stacking: "percent",
			},
		},
		series: [],
	},
	PPFPContinnum: {
		chart: {
			type: "bar",
			zoomType: "x",
		},
		credits: {
			enabled: false,
		},
		exporting: {
			enabled: false,
			chartOptions: {
				title: {
					text: "PPFP Continuum",
				},
				plotOptions: {
					series: {
						dataLabels: {
							enable: true,
						},
					},
				},
			},
		},
		title: {
			text: "",
		},
		subtitle: {
			text: "",
		},
		xAxis: {
			title: {
				text: "",
			},
			//categories: ['India', 'Punjab', 'Goa', 'Delhi', 'Kerala', 'Haryana', 'Rajasthan']
			type: "category",
			scrollbar: {
				enabled: true,
				width: 100,
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
		},
		yAxis: {
			min: 0,
			title: {
				text: "",
			},
			labels: {
				enabled: true,
				format: "{value}",
				/* formatter: function () {
                    return (this.value + "%");
                } */
			},
		},
		legend: {
			enabled: true,
			// backgroundColor: '#FCFFC5',
			// backgroundColor: '#71b5cd33',
			backgroundColor: "transparent",
			// borderColor: '#C98657',
			// borderColor: '#00000080',
			borderColor: "#a7a7a7",
			borderWidth: 1,
			borderRadius: 5,
			// maxHeight: 60,
			// itemDistance: 50,

			reversed: false,
		},
		tooltip: {
			// headerFormat: '<span style="color:#212529";font-size:0.625rem;">{point.key}</span><br/>',
            // pointFormat: '<span style="color:#212529">{series.name}:{point.y}</span><br/>',
            // footerFormat: '',
			// valueSuffix: '%' ,
			shared: true,

        	useHTML: true,
		},
		plotOptions: {
			series: {
				grouping: false,
				shadow: false,
				borderWidth: 0,
			},
		},
		series: [],
	},
	comparingPPFPRegion: {
		chart: {
			type: "bar",
			zoomType: "x",
		},
		credits: {
			enabled: false,
		},
		exporting: {
			enabled: false,
			chartOptions: {
				title: {
					text: "Comparing PPFP Method",
				},
				plotOptions: {
					series: {
						dataLabels: {
							enable: true,
						},
					},
				},
			},
		},
		title: {
			text: "",
		},
		subtitle: {
			text: "",
		},
		xAxis: {
			title: {
				text: "",
			},
			type: "category",
			scrollbar: {
				enabled: true,
				width: 100,
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
		},
		yAxis: {
			min: 0,
			max: 100,
			title: {
				text: "",
				style: {
					fontSize: 15,
				},
			},
			labels: {
				enabled: true,
				format: "{value}",
				/* formatter: function () {
                    return this.value + '%';
                } */
			},
		},
		legend: {
			enabled: true,
			// backgroundColor: '#FCFFC5',
			// backgroundColor: '#71b5cd33',
			backgroundColor: "transparent",
			// borderColor: '#C98657',
			// borderColor: '#00000080',
			borderColor: "#a7a7a7",
			borderWidth: 1,
			borderRadius: 5,
			// maxHeight: 60,
			// itemDistance: 50,

			reversed: true,
		},
		tooltip: {
			// headerFormat: '<span style="color:#212529";font-size:0.625rem;">{point.key}</span><br/>',
            // pointFormat: '<span style="color:#212529">{series.name}:{point.y}</span><br/>',
            // footerFormat: '',
			// valueSuffix: '%' ,
			shared: true,

        	useHTML: true,
		},
		plotOptions: {
			series: {
				stacking: "normal",
			},
		},
		series: [],
	},
};

export default programPrioritiesChartConfig;
