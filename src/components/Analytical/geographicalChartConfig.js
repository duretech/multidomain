export default {
  totalCypChartConfig: {
    chart: {
      type: "column",
      zoomType: "x",
    },
    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
    accessibility: {
      announceNewData: {
        enabled: true,
      },
    },
    exporting: {
      enabled: false,
    },
    xAxis: {
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
      title: {
        text: "Total CYP",
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
      // maxHeight: 40,
      // itemDistance: 50,
      // itemMarginBottom: 5,
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: false,
          format: "{point.y:.1f}%",
        },
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
      // headerFormat: '<span style="color:#212529";font-size:0.625rem;">{point.key}</span><br/>',
      // pointFormat: '<span style="color:#212529">{series.name}:{point.y}</span><br/>',
      // footerFormat: '',
      // style: {
      //   fontWeight: 'bold',
      // },
      /* headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b><br/>' */
    },
    series: [],
  },
  totalCyptrendChartConfig: {
    chart: {
      type: "line",
      zoomType: "x",
      /*  resetZoomButton:{
                position:{
                    align:'left'
                }
            } */
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
          text: "Total Couple Years of Protection by Region",
        },
        plotOptions: {
          series: {
            dataLabels: {
              enable: false,
            },
          },
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Total CYP",
        style: {
          fontSize: 15,
        },
      },
      labels: {
        enabled: true,
        /* formatter: function () {
                    // return this.value + '%';
                    return this.value;
                } */
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
      // headerFormat: '<span style="color:#212529";font-size:0.625rem;">{point.key}</span><br/>',
      // pointFormat: '<span style="color:#212529">{series.name}:{point.y}</span><br/>',
      // footerFormat: '',
      // style: {
      //     color: '#212529',
      //     fontWeight: 'bold'
      // }
    },
    xAxis: {
      // categories: [],
      type: "category",
      title: {
        text: "",
      },
      labels: {
        enabled: true,
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
      // maxHeight: 40,
      // itemDistance: 50,
      // itemMarginBottom: 5,
    },
    plotOptions: {
      series: {
        connectNulls: true,
        dataLabels: {
          enabled: true,
          formatter: function () {
            return this.point.label;
          },
        },
        enableMouseTracking: true,
      },
      /*  series: {
                dataLabels: {
                    enabled: true,
                    formatter:function(){
                            console.log(this);
                        let sVal = this.y < 5 ? 'low': this.y > 10 ?'high': '';

                            return sVal;
                    }
                },
                enableMouseTracking: true
            } */
      /* series: {
                 label: {
                    connectorAllowed: false
                 },
                 pointStart: 2014
             }*/

      /* data label formater */
      /* formatter:function(){
                console.log(this);
                    let sVal = this.y < 5 ? 'low': this.y > 10 ?'high': '';

                        return sVal;
            } */
    },

    series: [],
  },
  methodMix: {
    chart: {
      type: "packedbubble",
      height: "50%",
    },
    title: {
      text: "",
    },
    subtitle: {
      text: "",
    },
    exporting: {
      enabled: false,
    },
    tooltip: {
      shared: true,
      useHTML: true,
      pointFormat: "<b>{point.name}:</b> {point.value}",
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      packedbubble: {
        minSize: "20%",
        maxSize: "90%",
        // pointArrayMap: ['value'],
        // pointValKey: 'value',
        layoutAlgorithm: {
          gravitationalConstant: 0.05,
          splitSeries: true,
          seriesInteraction: false,
          dragBetweenSeries: false,
          parentNodeLimit: true,
        },
        dataLabels: {
          enabled: false,
          format: "{point.name}",
          // filter: {
          //   property: 'y',
          //   operator: '>',
          //   value: 250
          // },
          // style: {
          //   color: 'black',
          //   textOutline: 'none',
          //   fontWeight: 'normal'
          // }
        },
      },
    },
    series: [],
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
      // maxHeight: 40,
      // itemDistance: 50,
      // itemMarginBottom: 5,
    },
  },
  comparingMethodMix: {
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
      title: {
        text: "",
      },
      //categories: ['Method Mix: India', 'Method Mix: Punjab', 'Method Mix: Goa', 'Method Mix: Delhi', 'Method Mix: Kerala', 'Method Mix: Haryana', 'Method Mix: Rajasthan'],
      type: "category",
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
        format: "{value} %",
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
      // maxHeight: 40,
      // itemDistance: 50,
      // itemMarginBottom: 5,
      reversed: true,
    },
    tooltip: {
      shared: true,
      useHTML: true,
      // headerFormat: '<span style="color:#212529";font-size:0.625rem;">{point.key}</span><br/>',
      //     pointFormat: '<span style="color:#212529">{series.name}:{point.y}</span><br/>',
      //     footerFormat: '',
      //   valueSuffix: '%',
      //   style: {
      //     color: '#212529',
      //     fontWeight: 'bold'
      // }
    },
    plotOptions: {
      series: {
        stacking: "normal",
      },
    },
    series: [],
  },
  avgMethodMixChartConfig: {
    chart: {
      type: "column",
      zoomType: "x",
    },
    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
    accessibility: {
      announceNewData: {
        enabled: true,
      },
    },
    exporting: {
      enabled: false,
    },
    xAxis: {
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
      title: {
        text: "Total CYP",
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
      // maxHeight: 40,
      // itemDistance: 50,
      // itemMarginBottom: 5,
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: false,
          format: "{point.y:.1f}%",
        },
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
      // headerFormat: '<span style="color:#212529";font-size:0.625rem;">{point.key}</span><br/>',
      // pointFormat: '<span style="color:#212529">{series.name}:{point.y}</span><br/>',
      // footerFormat: '',
      // style: {
      //     color: '#212529',
      //     fontWeight: 'bold'
      // }
      /* headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b><br/>' */
    },

    series: [],
  },
  comparingEMUChartConfig: {
    chart: {
      type: "column",
      zoomType: "x",
    },
    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
    accessibility: {
      announceNewData: {
        enabled: true,
      },
    },
    exporting: {
      enabled: false,
    },
    xAxis: {
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
      title: {
        text: "Total EMU",
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
      // maxHeight: 40,
      // itemDistance: 50,
      // itemMarginBottom: 5,
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: false,
          format: "{point.y:.1f}%",
        },
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
      // headerFormat: '<span style="color:#212529";font-size:0.625rem;">{point.key}</span><br/>',
      // pointFormat: '<span style="color:#212529">{series.name}:{point.y}</span><br/>',
      // footerFormat: '',
      // style: {
      //     color: '#212529',
      //     fontWeight: 'bold'
      // }
      /* headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b><br/>' */
      //headerFormat: ''
    },

    series: [],
    tableData: [],
  },
  emuTrend: {
    chart: {
      type: "line",
      zoomType: "x",
    },
    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
    accessibility: {
      announceNewData: {
        enabled: true,
      },
    },
    exporting: {
      enabled: false,
    },
    xAxis: {
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
        text: "Trend in EMU",
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
      // maxHeight: 40,
      // itemDistance: 50,
      // itemMarginBottom: 5,
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        connectNulls: true,
        dataLabels: {
          enabled: false,
          format: "{point.y:.1f}%",
        },
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
      // headerFormat: '<span style="color:#212529";font-size:0.625rem;">{point.key}</span><br/>',
      // pointFormat: '<span style="color:#212529">{series.name}:{point.y}</span><br/>',
      // footerFormat: '',
      // style: {
      //     color: '#212529',
      //     fontWeight: 'bold'
      // }
      /* headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b><br/>' */
    },

    series: [],
    tableData: [],
  },
  avgEMUMonthlyGrowth: {
    chart: {
      type: "column",
      zoomType: "x",
    },
    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
    accessibility: {
      announceNewData: {
        enabled: true,
      },
    },
    exporting: {
      enabled: false,
    },
    xAxis: {
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
      title: {
        text: "Trend in EMU",
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
      // maxHeight: 40,
      // itemDistance: 50,
      // itemMarginBottom: 5,
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: false,
          format: "{point.y:.1f}%",
        },
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
      // headerFormat: '<span style="color:#212529";font-size:0.625rem;">{point.key}</span><br/>',
      //     pointFormat: '<span style="color:#212529">{series.name}:{point.y}</span><br/>',
      //     footerFormat: '',
      // style: {
      //     color: '#212529',
      //     fontWeight: 'bold'
      // }
      /* headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b><br/>' */
    },

    series: [],
    tableData: [],
  },
  emuMethodMix: {
    chart: {
      type: "packedbubble",
      height: "50%",
    },
    title: {
      text: "",
    },
    exporting: {
      enabled: false,
    },
    tooltip: {
      shared: true,
      useHTML: true,
      // headerFormat: '<span style="color:#212529";font-size:0.625rem;">{point.key}</span><br/>',
      //     pointFormat: '<span style="color:#212529">{series.name}:{point.y}</span><br/>',
      //     footerFormat: '',
      // pointFormat: '<b>{point.name}:</b> {point.value}',
      // style: {
      //     color: '#212529',
      //     fontWeight: 'bold'
      // }
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      packedbubble: {
        minSize: "20%",
        maxSize: "100%",
        // pointArrayMap: ['value'],
        // pointValKey: 'value',
        layoutAlgorithm: {
          gravitationalConstant: 0.05,
          splitSeries: true,
          seriesInteraction: false,
          dragBetweenSeries: false,
          parentNodeLimit: true,
        },
        dataLabels: {
          enabled: false,
          format: "{point.name}",
          // filter: {
          //   property: 'y',
          //   operator: '>',
          //   value: 0
          // },
          // style: {
          //   color: 'black',
          //   textOutline: 'none',
          //   fontWeight: 'normal'
          // }
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
      // maxHeight: 40,
      // itemDistance: 50,
      // itemMarginBottom: 5,
    },
    series: [],
    tableData: [],
  },
  avgEMUMethodMix: {
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
      title: {
        text: "",
      },
      //categories: ['Method Mix: India', 'Method Mix: Punjab', 'Method Mix: Goa', 'Method Mix: Delhi', 'Method Mix: Kerala', 'Method Mix: Haryana', 'Method Mix: Rajasthan'],
      type: "category",
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
        format: "{value} %",
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
      // maxHeight: 40,
      // itemDistance: 50,
      // itemMarginBottom: 5,
      reversed: true,
    },
    tooltip: {
      shared: true,
      useHTML: true,
      valueSuffix: "%",
      //   headerFormat: '<span style="color:#212529";font-size:0.625rem;">{point.key}</span><br/>',
      //     pointFormat: '<span style="color:#212529">{series.name}:{point.y}</span><br/>',
      //     footerFormat: '',
      //   style: {
      //     color: '#212529',
      //     fontWeight: 'bold'
      // }
    },
    plotOptions: {
      series: {
        stacking: "normal",
      },
    },
    series: [],
    tableData: [],
  },
};
