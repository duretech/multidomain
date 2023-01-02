const defaultconfig = {
    chart: {
        type: 'column',
        height: 400,
        zoomType: 'x'
    },

    legend: {
        enabled: true,
        backgroundColor: 'transparent',
        borderColor: '#a7a7a7',
        borderWidth: 1,
        borderRadius: 5,
    },
    title: {
        text: '',
        title: '',
        style: {
            'font-size':  '20px'
        }
    },
    xAxis: {
        categories: [],
        labels: {
            rotation: '-45',
            style: {
                fontSize: '12px',
                fontFamily: 'Roboto'
            }
        },
        max: 4,
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
    },
    yAxis: {
        title: {
            text: ''
        }
    },
    tooltip: {
        crosshairs: true,
        pointFormat: '\x3cspan style\x3d"color:{point.color}"\x3e\u25cf\x3c/span\x3e {series.name}: \x3cb\x3e{point.y:,.2f}\x3c/b\x3e\x3cbr/\x3e',
        shared: true,
        useHTML: true,
    },
    credits: {
        enabled: false
    },

    plotOptions: {
        spline: {
            marker: {
            radius: 4,
            lineColor: '#666666',
            lineWidth: 1
            }
        },
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                    color:  'black'
                }
            }
        },
        column: {
            dataLabels: {
                enabled: false,
                format: '{point.y:,.2f}\x3c/b\x3e\x3cbr/\x3e'
            },
            events: {
                legendItemClick: function (e) {
                    console.log(e)
                }
            }
        },
        series: {
            dataLabels: {
                enabled: false,
                format: '{point.y:,.2f}\x3c/b\x3e\x3cbr/\x3e'
            },
            connectNulls: true,
            stacking: ''
        }
    },
    series: [{
        name: '',
        data:[],
        color:''
    }],
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
            spline: {
                dataLabels: {
                    enabled: true,
                    format: '{point.y:,.2f}\x3c/b\x3e\x3cbr/\x3e'
                }
            },
            column: {
                stacking: '',
                dataLabels: {
                    enabled: true,
                    format: '{point.y:,.2f}\x3c/b\x3e\x3cbr/\x3e'
                }
            },
            area: {
                stacking: '',
                dataLabels: {
                    enabled: true,
                    format: '{point.y:,.2f}\x3c/b\x3e\x3cbr/\x3e'
                }
            }

        },
      }
    },
}


export default defaultconfig
