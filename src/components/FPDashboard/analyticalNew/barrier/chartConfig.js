const chartConfig = {
  scatter: {
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
          // headerFormat: '<span style="color:#212529";font-size:0.625rem;">{point.key}</span><br/>',
          //   pointFormat: '<span style="color:#212529">{series.name}:{point.y}</span><br/>',
          //   footerFormat: '',
          // style: {
          //   color:'#212529',
           
          //   fontWeight: 'bold',
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
        title: {
          text: '',
          style: {
            fontFamily: 'Roboto',
            fontSize: '20px'
          },
        },
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
  normal: {
    chart: {
      height: 400,
      type: 'line',
      zoomType: 'x',
    },
    title: {
      text: ''
    },
    subtitle: {
      text: ''
    },
    xAxis: {
      type: 'category',
      // max: 11,
      // categories: [],
      crosshair: true,
      labels: {
        rotation: -45
      },
      title: {
        text: ''
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
      title: {
        text: 'Value by %'
      },
      labels: {
        enabled: true,
        formatter: function() {
          return this.value + '%';
        }
      },
    },
    plotOptions: {
      series: {
        connectNulls: true,
        label: {
          connectorAllowed: false
        },
        //pointStart: 2010,
        marker: {
          enabled: false
        }
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
    exporting: {
      enabled: false,
      chartOptions: {
        title: {
          text: '',
          style: {
            fontFamily: 'Roboto',
            fontSize: '20px'
          },
        },
        chart: {
          height: 768,
          width: 1024,
          marginTop: 100,
          marginBottom: 200,
          events: {
            load: function() {
              var renderer = this.renderer;
            }
          }
        },
        legend: {
          layout: 'horizontal',
          align: 'left',
          verticalAlign: 'bottom',
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
            y: -220
          }
        },
        xAxis: {
          labels: {
            rotation: 45
          }
        },
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
          area: {
            stacking: '',
            dataLabels: {
              enabled: true
            }
          }

        },
     }
    },
    credits: {
      enabled: false
    },
    tooltip: {
    //  headerFormat: '<span style="color:#212529";font-size:0.625rem;">{point.key}</span><br/>',
    //         pointFormat: '<span style="color:#212529">{series.name}:{point.y}</span><br/>',
    //         footerFormat: '',
  
    //   style: {
    //     color:'#212529',
       
    //     fontWeight: 'bold',
    //   },
      
      shared: true,
      useHTML: true
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: false
        }
      },
      series: {
          connectNulls: true
      }
    },
    series: [],
    drilldown: {

      series: []
    }
  }
}


export default chartConfig
