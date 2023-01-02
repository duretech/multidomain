const externalChartconfig = {
  method: {
    chart: {
      type: 'scatter',
      zoomType: 'xy'
    },
    title: {
      text: ''
    },
    subtitle: {
      text: ''
    },
    xAxis: {
      title: {
        enabled: true,
        text: ''
      },
      startOnTick: true,
      endOnTick: true,
      showLastLabel: true,
      tickInterval: 1000,
      min: 0,
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
      title: {
        text: ''
      },
      tickInterval: 1000,
      min: 0,
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
      scatter: {
        marker: {
          radius: 5,
          states: {
            hover: {
              enabled: true,
              lineColor: 'rgb(100,100,100)'
            }
          }
        },
        states: {
          hover: {
            marker: {
              enabled: false
            }
          }
        },
        tooltip: {
          // style: {
          //   color: 'blue',
          //   fontWeight: 'bold'
          // },
          // headerFormat: '',
          // pointFormat: '<b>{point.name}</b><br> x: {point.x:,.2f} <br> y: {point.y:,.2f}'
          shared: true,
          useHTML: true,
        }
      },
      // line: {
      //   dashStyle: 'Dot'
      // }
    },
    exporting: {
      enabled: false,
      allowHTML: true,
      sourceWidth: 1200,
      sourceHeight: 500,
      chartOptions: {
        plotOptions: {
          line: {
            dataLabels: {
              enabled: true
            }
          },
          spline: {
            dataLabels: {
              enabled: true
            }
          },
          column: {
            stacking: '',
            dataLabels: {
              enabled: true
            }
          },
          bar: {
            stacking: '',
            dataLabels: {
              enabled: true
            }
          },
          area: {
            stacking: '',
            dataLabels: {
              enabled: true
            }
          },
          series: {
            stacking: '',
            dataLabels: {
              enabled: true
            }
          }
        }
     }
    },
    credits: {
      enabled: false
    },
    series: []
  },
  average: {
    chart: {
      type: 'column',
      zoomType: 'x'
    },
    title: {
      text: ''
    },
    subtitle: {
      text: ''
    },
    xAxis: {
      type: 'category',
      crosshair: true,
      min: 0,
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
        text: ''
      },
      labels: {
        rotation: -45
      }
    },
    yAxis: {
      title: {
        text: ''
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
    tooltip: {
      // style: {
			// 	color: '#212529',
			// 	fontWeight: 'bold'
			// },
      // headerFormat: '<span style="font-size:0.625rem"><b>{point.key}</b></span><table>',
      // pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      //   '<td style="padding:0"><b>{point.y:.2f}</b></td></tr>',
      // footerFormat: '</table>',
      shared: true,
      useHTML: true
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    exporting: {
      enabled: false,
      sourceWidth: 1200,
      sourceHeight: 500,
      chartOptions: {
        plotOptions: {
          line: {
            dataLabels: {
              enabled: true
            }
          },
          spline: {
            dataLabels: {
              enabled: true
            }
          },
          column: {
            stacking: '',
            dataLabels: {
              enabled: true
            }
          },
          bar: {
            stacking: '',
            dataLabels: {
              enabled: true
            }
          },
          area: {
            stacking: '',
            dataLabels: {
              enabled: true
            }
          },
          series: {
            stacking: '',
            dataLabels: {
              enabled: true
            }
          }
        }
     }
    },
    credits: {
      enabled: false
    },
    series: []
  },
  outlier: {
    chart: {
      type: 'lowmedhigh',
      zoomType: 'x'
    },
    title: {
      text: ''
    },
    subtitle: {
      text: ''
    },
    xAxis: [{
      accessibility: {
        description: ''
      },
      categories: [],
      crosshair: true,
      min:0,
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
      labels: {
        rotation: -45
      },
      title: {
        text: ''
      }
    }],
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
    yAxis: {
      title: {
        text: ''
      }
    },
    tooltip: {
      shared: true,
      useHTML: true,
    },
    exporting: {
      enabled: false,
      sourceWidth: 1200,
      sourceHeight: 500,
      chartOptions: {
        plotOptions: {
          line: {
            dataLabels: {
              enabled: true
            }
          },
          spline: {
            dataLabels: {
              enabled: true
            }
          },
          column: {
            stacking: '',
            dataLabels: {
              enabled: true
            }
          },
          bar: {
            stacking: '',
            dataLabels: {
              enabled: true
            }
          },
          area: {
            stacking: '',
            dataLabels: {
              enabled: true
            }
          },
          series: {
            stacking: '',
            dataLabels: {
              enabled: true
            }
          }
        }
     }
    },
    credits: {
      enabled: false
    },
    series: []
  }
}


export default externalChartconfig
