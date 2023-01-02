const chartConfig = {
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
    min: 0,
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
      text: ''
    }
  },
  legend: {
    enabled: true,
    backgroundColor: 'transparent',
    borderColor: '#a7a7a7',
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
    // headerFormat: '<span style="font-size:0.625rem">{point.key}</span><table>',
    // pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
    //   '<td style="padding:0"><b>\x3cb\x3e{point.y}\x3c/b\x3e\x3cbr/\x3e</b></td></tr>',
    // footerFormat: '</table>',
    // headerFormat: '<span style="color:#212529";font-size:0.625rem;">{point.key}</span><br/>',
    //         pointFormat: '<span style="color:#212529">{series.name}:{point.y}</span><br/>',
    //         footerFormat: '',
    // style: {
    //   color: '#212529',
    //   fontWeight: 'bold'
    // },
    shared: true,
    useHTML: true
  },
  plotOptions: {
    series: {
      connectNulls: true,
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


export default chartConfig
