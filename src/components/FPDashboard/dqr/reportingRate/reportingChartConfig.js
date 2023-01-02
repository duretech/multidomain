const reportingChartconfig = {
  chart: {
    height: 400,
    type: 'column',
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
    min:0,
    max: 11,
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
    min: 0,
    // max: 100,
    tickStep: 25,
    title: {
      text: 'Value by %'
    },
    plotLines: [{
      enabled: true,
      value: 80,
      percValue: undefined,
      valueType: 'percentage',
      color: '#ff0000',
      width: 2,
      zIndex: 5,
      dashStyle: 'solid',
      label: {
        enabled: true,
        text: '80%',
        textVisible: '',
        align: 'right',
        style: {
          color: '#000000'
        }
      }
    }]
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
    sourceWidth: 1200,
    sourceHeight: 500,
    chartOptions: {
      plotOptions: {
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
  tooltip: {
    // headerFormat: '<span style="color:#212529";font-size:0.625rem;">{point.key}</span><br/>',
    //         pointFormat: '<span style="color:#212529">{series.name}:{point.y}</span><br/>',
    //         footerFormat: '',
    // style: {
    //   color: '#212529',
    //   fontWeight: 'bold'
    // },
    // headerFormat: '<span style="font-size:0.625rem">{point.key}</span><table>',
    // pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
    //   '<td style="padding:0"><b>\x3cb\x3e{point.y}\x3c/b\x3e\x3cbr/\x3e</b></td></tr>',
    // footerFormat: '</table>',
    shared: true,
    useHTML: true
  },
  plotOptions: {
    series: {
      kdNow: true,
      dataLabels: {
        enabled: false
      }
    }
  },
  series: [],
  drilldown: {
    series: []
  }
}


export default reportingChartconfig
