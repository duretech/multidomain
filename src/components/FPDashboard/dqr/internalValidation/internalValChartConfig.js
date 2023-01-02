export default {
  totalCYPRegionDrillDown: {
    chart: {
      type: 'line',
      zoomType: 'x',
      height: 400
    },
    title: {
      text: ''
    },
    subtitle: {
      text: ''
    },
    credits: {
      enabled: false
    },
    exporting: {
      enabled: false,
      sourceWidth: 1200,
      sourceHeight: 500,
      chartOptions: {
        plotOptions: {
          series: {
            stacking: '',
            dataLabels: {
              enabled: true,
              formatter: function() {
                return this.point.y;
              }
            }
          }
        }
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: '',
        style: {
          fontSize: 15
        }
      },
      labels: {
        enabled: true,
        formatter: function() {
          // return this.value + '%';
          return this.value;
        }
      },
    },
    tooltip: {
      // headerFormat: '<span style="color:#212529";font-size:0.625rem;">{point.key}</span><br/>',
      // pointFormat: '<span style="color:#212529">{series.name}:{point.y}</span><br/>',
      // footerFormat: '',
      // style: {
			// 	color: '#212529',
			// 	fontWeight: 'bold'
			// },
      // headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      // pointFormatter: function() {
      //   if (this.series.chart.drilldownLevels !== undefined && this.series.chart.drilldownLevels.length > 0) {
      //     return '<span><b>' + this.name + '</b></span>: ' + Highcharts.numberFormat(this.y) + '<br/>' +
      //       '<b>MIN (-2 SDs)</b> : ' + Highcharts.numberFormat(this.lowd.toFixed(1) * 1) + '<br/>' +
      //       '<b>MAX (+2 SDs)</b> : ' + Highcharts.numberFormat(this.highd.toFixed(1) * 1);
      //
      //   } else {
      //     return '<span style="color:' + this.color + '">' + this.name + '</span>: <b>' + Highcharts.numberFormat(this.y);
      //   }
      // }
      shared: true,
      useHTML: true,
    },
    xAxis: {
      // categories: [],
      type: 'category',
      title: {
        text: ''
      },
      labels: {
        enabled: true,
        rotation: -45
      },
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
      }
    },
    legend: {
      enabled: true,
      // backgroundColor: '#FCFFC5',
      // backgroundColor: '#71b5cd33',
      backgroundColor: 'transparent',
      // borderColor: '#C98657',
      // borderColor: '#00000080',
      borderColor: '#a7a7a7',
      borderWidth: 1,
      borderRadius: 5,
      // maxHeight: 60,
      // itemDistance: 50,
    },
    plotOptions: {
      series: {
        stacking: '',
        dataLabels: {
          enabled: true,
          formatter: function() {
            return this.point.label;
          }
        }
      }
    },

    series: [],
    drilldown: {
      drillUpButton: {
        position: {
          align: "left",
          x: 0,
          y: 0
        }
      },
      series: []
    }
  },
  totalCYPRegionWiseDiff: {
    chart: {
      type: 'bar',
      zoomType: 'x'
    },
    title: {
      text: ''
    },
    credits: {
      enabled: false
    },
    accessibility: {
      announceNewData: {
        enabled: true
      }
    },
    exporting: {
      enabled: false,
      sourceWidth: 1200,
      sourceHeight: 500,
      chartOptions: {
        plotOptions: {
          series: {
            stacking: '',
            dataLabels: {
              enabled: true,
              formatter: function() {
                return this.point.y + " " +this.point.label;
              }
            }
          }
        }
      }
    },
    xAxis: {
      type: 'category',
      labels: {
        rotation: -45
      },
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
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: ''
      },
    },
    legend: {
      enabled: false,
      // backgroundColor: '#FCFFC5',
      // backgroundColor: '#71b5cd33',
      backgroundColor: 'transparent',
      // borderColor: '#C98657',
      // borderColor: '#00000080',
      borderColor: '#a7a7a7',
      borderWidth: 1,
      borderRadius: 5,
      // maxHeight: 60,
      // itemDistance: 50,
    },
    plotOptions: {
      series: {
        stacking: '',
        borderWidth: 0,
        dataLabels: {
          enabled: false,
          format: '{point.y:.1f}%'
        }
      }
    },
    tooltip: {
      shared: true,
      useHTML: true,
      // style: {
			// 	color: '#212529',
			// 	fontWeight: 'bold'
			// },
      /* headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b><br/>' */
    },

    series: []
  },
  totalCYPRegion: {
    chart: {
      type: 'line',
      zoomType: 'xy',
      height: 400
    },
    title: {
      text: ''
    },
    subtitle: {
      text: ''
    },
    credits: {
      enabled: false
    },
    exporting: {
      enabled: false,
      sourceWidth: 1200,
      sourceHeight: 500,
      chartOptions: {
        plotOptions: {
          series: {
            stacking: '',
            dataLabels: {
              enabled: true,
              formatter: function() {
                return this.point.y + " " +this.point.label;
              }
            }
          }
        }
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: '',
        style: {
          fontSize: 15
        }
      },
      labels: {
        enabled: true,
        formatter: function() {
          return this.value;
        }
      },
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
      }
    },
    tooltip: {
      // headerFormat: '<span style="color:#212529";font-size:0.625rem;">{point.key}</span><br/>',
      // pointFormat: '<span style="color:#212529">{series.name}:{point.y}</span><br/>',
      // footerFormat: '',
      // valueSuffix: '%'
      shared: true,
      useHTML: true
    },
    xAxis: {
      // categories: [],
      type: "category",
      title: {
        text: ''
      },
      labels: {
        enabled: true,
        rotation: -45
      },
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
      }
    },
    legend: {
      enabled: true,
      // backgroundColor: '#FCFFC5',
      // backgroundColor: '#71b5cd33',
      backgroundColor: 'transparent',
      // borderColor: '#C98657',
      // borderColor: '#00000080',
      borderColor: '#a7a7a7',
      borderWidth: 1,
      borderRadius: 5,
      // maxHeight: 60,
      // itemDistance: 50,

    },
    plotOptions: {
      series: {
        stacking: '',
        dataLabels: {
          enabled: true,
          formatter: function() {
            return this.point.label;
          }
        }
      }
    },
    series: [],
  }
}
