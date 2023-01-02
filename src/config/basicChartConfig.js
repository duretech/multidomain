const chartConfig = {
  chart: {
    type: "line",
    zoomType: "x",
    backgroundColor: "#181736",
  },
  title: {
    text: "",
  },
  subtitle: {
    text: "",
    style: {
      color: "#d6d6d6",
      fontSize: "10px",
    },
  },
  xAxis: {
    lineColor: "#302f52",
    type: "category",
    min: 0,
    crosshair: true,
    labels: {
      rotation: -45,
      enabled: true,
      style: {
        color: "#dad7d7",
        fontSize: "10px",
      },
    },
    title: {
      text: "",
      style: {
        color: "#d6d6d6 ",
        fontSize: "10px",
      },
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
    title: {
      text: "",
      style: {
        color: "#dad7d7",
        fontSize: "12px",
      },
    },
    labels: {
      style: {
        color: "#dad7d7",
      },
    },
    gridLineColor: "#12122a",
  },
  legend: {
    enabled: true,
    backgroundColor: "transparent",
    itemStyle: {
      color: "#dad7d7",
      fontSize: "12px",
      fontWeight: "300",
    },
    itemHoverStyle: {
      color: "#dad7d7",
    },
  },
  exporting: {
    enabled: false,
    sourceWidth: 1200,
    sourceHeight: 500,
    chartOptions: {
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
          },
        },
      },
    },
  },
  credits: {
    enabled: false,
  },
  tooltip: {
    // headerFormat: '<span style="font-size:0.625rem;">{point.key}</span><table style="background-color:#343361;">',
    // pointFormat: '<tr style="background-color:#343361;"><td style="background-color:#343361;color:{series.color};padding:0">{series.name}: </td>' +
    //   '<td style="padding:0"><b>\x3cb\x3e{point.y}\x3c/b\x3e\x3cbr/\x3e</b></td></tr>',
    // footerFormat: '</table>',

    shared: true,
    useHTML: true,
  },
  plotOptions: {
    series: {
      connectNulls: true,
      dataLabels: {
        enabled: true,
        color: "#dad7d7",
      },
      marker: {
        enabled: true,
      },
      enableMouseTracking: true,
      grouping: true,
      shadow: false,
      borderWidth: 0,
    },
  },
  series: [],
  drilldown: {
    series: [],
  },
};

export default chartConfig;
