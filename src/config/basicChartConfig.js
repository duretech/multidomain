export const commonChartConfig = {
  chart: {
    type: "line",
    zoomType: "x",
  },
  title: {
    text: "",
    title: "",
  },
  subtitle: {
    text: "",
    title: "",
  },
  xAxis: {
    type: "category",
    crosshair: true,
    labels: {
      rotation: -45,
    },
    title: {
      text: "",
    },
    scrollbar: {
      enabled: true,
      buttonsEnabled: true,
    },
  },
  yAxis: {
    title: {
      text: "",
    },
  },
  legend: {
    enabled: true,
  },
  credits: {
    enabled: false,
  },
  tooltip: {
    shared: true,
    useHTML: true,
  },
  plotOptions: {
    series: {
      connectNulls: true,
      dataLabels: {
        enabled: true,
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
  exporting: {
    enabled: false,
    allowHTML: true,
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
      title: {
        useHTML: true,
        text: "",
      },
      xAxis: [
        {
          scrollbar: {
            enabled: false,
          },
        },
      ],
    },
  },
};

export const methodChartConfig = {
  chart: {
    type: "scatter",
    zoomType: "xy",
  },
  title: {
    text: "",
    title: "",
  },
  subtitle: {
    text: "",
  },
  xAxis: {
    title: {
      enabled: true,
      text: "",
    },
    startOnTick: true,
    endOnTick: true,
    showLastLabel: true,
    tickInterval: 1000,
    min: 0,
    scrollbar: {
      enabled: true,
      buttonsEnabled: true,
    },
  },
  yAxis: {
    title: {
      text: "",
    },
    tickInterval: 1000,
    min: 0,
    scrollbar: {
      enabled: true,
      buttonsEnabled: true,
    },
  },
  legend: {
    enabled: true,
  },
  tooltip: {
    headerFormat: "<b>{point.name}</b><br/>",
    pointFormat: "<b>{series.name}</b> X: {point.x}, Y: {point.y}",
    // shared: true,
    useHTML: true,
  },
  plotOptions: {
    scatter: {
      marker: {
        radius: 5,
        states: {
          hover: {
            enabled: true,
          },
        },
      },
      states: {
        hover: {
          marker: {
            enabled: false,
          },
        },
      },
    },
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
            enabled: true,
          },
        },
        spline: {
          dataLabels: {
            enabled: true,
          },
        },
        column: {
          stacking: "",
          dataLabels: {
            enabled: true,
          },
        },
        bar: {
          stacking: "",
          dataLabels: {
            enabled: true,
          },
        },
        area: {
          stacking: "",
          dataLabels: {
            enabled: true,
          },
        },
        series: {
          stacking: "",
          dataLabels: {
            enabled: true,
          },
        },
      },
      title: {
        useHTML: true,
        text: "",
      },
      xAxis: [
        {
          scrollbar: {
            enabled: false,
          },
        },
      ],
      yAxis: [
        {
          scrollbar: {
            enabled: false,
          },
        },
      ],
      drilldown: {
        activeAxisLabelStyle: {
          textDecoration: "none",
        },
      },
    },
  },
  credits: {
    enabled: false,
  },
  series: [],
};

export const averageChartConfig = {
  chart: {
    type: "column",
    zoomType: "x",
  },
  title: {
    text: "",
    title: "",
  },
  subtitle: {
    text: "",
  },
  xAxis: {
    type: "category",
    crosshair: true,
    scrollbar: {
      enabled: true,
      buttonsEnabled: true,
    },
    title: {
      text: "",
    },
    labels: {
      rotation: -45,
    },
  },
  yAxis: {
    title: {
      text: "",
    },
  },
  legend: {
    enabled: true,
  },
  tooltip: {
    shared: true,
    useHTML: true,
  },
  plotOptions: {
    column: {
      pointPadding: 0.2,
      borderWidth: 0,
    },
  },
  exporting: {
    enabled: false,
    sourceWidth: 1200,
    sourceHeight: 500,
    chartOptions: {
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true,
          },
        },
        spline: {
          dataLabels: {
            enabled: true,
          },
        },
        column: {
          stacking: "",
          dataLabels: {
            enabled: true,
          },
        },
        bar: {
          stacking: "",
          dataLabels: {
            enabled: true,
          },
        },
        area: {
          stacking: "",
          dataLabels: {
            enabled: true,
          },
        },
        series: {
          stacking: "",
          dataLabels: {
            enabled: true,
          },
        },
      },
      title: {
        useHTML: true,
        text: "",
      },
      xAxis: [
        {
          scrollbar: {
            enabled: false,
          },
        },
      ],
      drilldown: {
        activeAxisLabelStyle: {
          textDecoration: "none",
        },
      },
    },
  },
  credits: {
    enabled: false,
  },
  series: [],
};

export const outlierChartConfig = {
  chart: {
    type: "lowmedhigh",
    zoomType: "x",
  },
  title: {
    text: "",
    title: "",
  },
  subtitle: {
    text: "",
  },
  xAxis: [
    {
      categories: [],
      crosshair: true,
      min: 0,
      scrollbar: {
        enabled: true,
        buttonsEnabled: true,
      },
      labels: {
        rotation: -45,
      },
      title: {
        text: "",
      },
    },
  ],
  legend: {
    enabled: true,
  },
  yAxis: {
    title: {
      text: "",
    },
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
            enabled: true,
          },
        },
        spline: {
          dataLabels: {
            enabled: true,
          },
        },
        column: {
          stacking: "",
          dataLabels: {
            enabled: true,
          },
        },
        bar: {
          stacking: "",
          dataLabels: {
            enabled: true,
          },
        },
        area: {
          stacking: "",
          dataLabels: {
            enabled: true,
          },
        },
        series: {
          stacking: "",
          dataLabels: {
            enabled: true,
          },
        },
      },
      title: {
        useHTML: true,
        text: "",
      },
      xAxis: [
        {
          scrollbar: {
            enabled: false,
          },
        },
      ],
      drilldown: {
        activeAxisLabelStyle: {
          textDecoration: "none",
        },
      },
    },
  },
  credits: {
    enabled: false,
  },
  series: [],
  plotOptions: {},
};

export const summaryChartConfig = {
  chart: {
    type: "solidgauge",
  },
  title: {
    text: "",
    y: 10,
  },
  pane: {
    center: ["50%", "75%"],
    size: "120%",
    startAngle: -90,
    endAngle: 90,
    background: {
      backgroundColor: "#EEE",
      innerRadius: "60%",
      outerRadius: "100%",
      shape: "arc",
    },
  },
  exporting: {
    enabled: false,
    chartOptions: {
      title: {
        text: "",
      },
      chart: {
        height: 768,
        width: 1024,
        marginTop: 100,
        marginBottom: 200,
      },
      legend: {
        layout: "horizontal",
        align: "left",
        verticalAlign: "bottom",
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
          y: -220,
        },
      },
      xAxis: {
        labels: {
          rotation: 45,
        },
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true,
          },
        },
        spline: {
          dataLabels: {
            enabled: true,
          },
        },
        column: {
          stacking: "",
          dataLabels: {
            enabled: true,
          },
        },
        area: {
          stacking: "",
          dataLabels: {
            enabled: true,
          },
        },
      },
    },
  },
  tooltip: {
    enabled: false,
    shared: true,
    useHTML: true,
  },
  yAxis: {
    stops: [
      [1, "#55BF3B"], // green
    ],
    lineWidth: 0,
    tickWidth: 0,
    minorTickInterval: null,
    tickPixelInterval: 0,
    title: {
      y: -70,
    },
    labels: {
      y: 16,
      enabled: true,
    },
    min: 0,
    max: 6,
    tickPositioner: function () {
      return [this.min, this.max];
    },
  },
  credits: {
    enabled: false,
  },
  series: [
    {
      name: "",
      data: [
        {
          y: 0,
          radius: 100,
          innerRadius: 60,
        },
      ],
      dataLabels: {
        enabled: false,
        format:
          '<div style="text-align:center">' +
          '<span style="font-size:0.75rem;opacity:1">Score</span><br/>' +
          '<span style="font-size:1rem">{y}/6</span><br/>' +
          "</div>",
      },
      tooltip: {
        valueSuffix: " ",
        shared: true,

        useHTML: true,
      },
    },
  ],
  plotOptions: {
    solidgauge: {
      dataLabels: {
        y: 5,
        borderWidth: 0,
        useHTML: true,
      },
    },
  },
};

export const integratedChartConfig = {
  chart: { type: "lowmedhigh", zoomType: "x", height: 350 },
  title: {
    text: "",
  },
  subtitle: { text: "" },
  xAxis: [
    {
      categories: [],
      crosshair: true,
      min: 0,
      scrollbar: {
        enabled: true,
        buttonsEnabled: true,
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

export const methodMixChartConfig = {
  chart: {
    type: "packedbubble",
    // height: "95%",
  },
  title: {
    text: "",
    title: "",
  },
  subtitle: {
    text: "",
  },
  exporting: {
    enabled: false,
    allowHTML: true,
    sourceWidth: 1200,
    sourceHeight: 500,
    chartOptions: {
      plotOptions: {
        packedbubble: {
          dataLabels: {
            enabled: true,
            formatter: function () {
              return "<b>{point.name}:</b> {point.value}";
            },
          },
        },
      },
      title: {
        useHTML: true,
        text: "",
      },
    },
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
      maxSize: "70%",
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
      },
    },
  },
  series: [],
  legend: {
    enabled: true,
  },
};

export const basicChartConfig = {
  column: {
    chart: {
      renderTo: "container",
      type: "column",
      zoomType: "x",
      oType: "column",
    },
    title: {
      text: "",
    },
    subtitle: {
      text: "",
    },
    xAxis: {
      type: "category",
      crosshair: true,
      scrollbar: {
        enabled: true,
        buttonsEnabled: true,
      },
      title: {
        text: "",
      },
    },
    yAxis: {
      title: {
        text: "",
      },
      plotLines: [
        {
          value: undefined,
          percValue: undefined,
          valueType: "percentage",
          color: "#ff0000",
          width: 1,
          zIndex: 5,
          dashStyle: "solid",
          label: {
            enabled: false,
            text: "",
            textVisible: "",
            align: "center",
            style: {
              color: "#000000",
            },
          },
        },
      ],
    },
    legend: {
      enabled: true,
    },
    exporting: {
      enabled: false,
      sourceWidth: 1200,
      sourceHeight: 500,
      chartOptions: {
        plotOptions: {
          series: {
            stacking: "",
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
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      series: {
        stacking: "",
        pointPadding: 0.2,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
        },
      },
    },
    series: [],
    drilldown: {
      drillUpButton: {
        position: {
          align: "left",
          x: 0,
          y: 0,
        },
      },
      series: [],
    },
  },
  column_stacked: {
    chart: {
      renderTo: "container",
      type: "column",
      oType: "column_stacked",
      zoomType: "x",
    },
    title: {
      text: "",
    },
    subtitle: {
      text: "",
    },
    xAxis: {
      type: "category",
      title: {
        text: "",
      },
    },
    yAxis: {
      title: {
        text: "",
      },
      stackLabels: {
        enabled: true,
      },
      plotLines: [
        {
          value: undefined,
          percValue: undefined,
          valueType: "percentage",
          color: "#ff0000",
          width: 1,
          zIndex: 5,
          dashStyle: "solid",
          label: {
            enabled: false,
            text: "",
            textVisible: "",
            align: "center",
            style: {
              color: "#000000",
            },
          },
        },
      ],
    },
    legend: {
      enabled: true,
    },
    exporting: {
      enabled: false,
      sourceWidth: 1200,
      sourceHeight: 500,
      chartOptions: {
        plotOptions: {
          series: {
            stacking: "normal",
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
      shared: true,
      pointFormat: "",
      useHTML: true,
    },
    plotOptions: {
      series: {
        stacking: "normal",
        minPointLength: 3,
        dataLabels: {
          enabled: true,
        },
      },
    },
    series: [],
    drilldown: {
      drillUpButton: {
        position: {
          align: "left",
          x: 0,
          y: 0,
        },
      },
      series: [],
    },
  },
  line: {
    chart: {
      type: "line",
      oType: "line",
      zoomType: "x",
    },
    title: {
      text: "",
    },
    subtitle: {
      text: "",
    },
    xAxis: {
      type: "category",
      crosshair: true,
      scrollbar: {
        enabled: true,
        buttonsEnabled: true,
      },
      title: {
        text: "",
      },
    },
    yAxis: {
      title: {
        text: "",
      },
      plotLines: [
        {
          value: undefined,
          percValue: undefined,
          valueType: "percentage",
          color: "#ff0000",
          width: 1,
          zIndex: 5,
          dashStyle: "solid",
          label: {
            enabled: false,
            text: "",
            textVisible: "",
            align: "center",
            style: {
              color: "#000000",
            },
          },
        },
      ],
    },
    legend: {
      enabled: true,
    },
    exporting: {
      enabled: false,
      sourceWidth: 1200,
      sourceHeight: 500,
      chartOptions: {
        plotOptions: {
          series: {
            stacking: "",
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
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      series: {
        stacking: "",
        dataLabels: {
          enabled: true,
        },
      },
    },
    series: [],
    drilldown: {
      drillUpButton: {
        position: {
          align: "left",
          x: 0,
          y: 0,
        },
      },
      series: [],
    },
  },
  area: {
    chart: {
      type: "area",
      oType: "area",
      zoomType: "x",
    },
    title: {
      text: "",
    },
    subtitle: {
      text: "",
    },
    xAxis: {
      allowDecimals: false,
      labels: {
        formatter: function () {
          return this.value;
        },
      },
      title: {
        text: "",
      },
    },
    yAxis: {
      title: {
        text: "",
      },
      plotLines: [
        {
          value: undefined,
          percValue: undefined,
          valueType: "percentage",
          color: "#ff0000",
          width: 1,
          zIndex: 5,
          dashStyle: "solid",
          label: {
            enabled: false,
            text: "",
            textVisible: "",
            align: "center",
            style: {
              color: "#000000",
            },
          },
        },
      ],
    },
    legend: {
      enabled: true,
    },
    exporting: {
      enabled: false,
      sourceWidth: 1200,
      sourceHeight: 500,
      chartOptions: {
        plotOptions: {
          series: {
            stacking: "",
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
      shared: true,
      pointFormat: "",
      useHTML: true,
    },
    plotOptions: {
      series: {
        stacking: "",
        marker: {
          enabled: false,
          symbol: "circle",
          radius: 2,
          states: {
            hover: {
              enabled: true,
            },
          },
        },
        dataLabels: {
          enabled: true,
        },
      },
    },
    series: [],
    drilldown: {
      drillUpButton: {
        position: {
          align: "left",
          x: 0,
          y: 0,
        },
      },
      series: [],
    },
  },
  bar: {
    chart: {
      type: "bar",
      oType: "bar",
      zoomType: "x",
    },
    title: {
      text: "",
    },
    subtitle: {
      text: "",
    },
    xAxis: {
      type: "category",
      title: {
        text: "",
      },
    },
    yAxis: {
      title: {
        text: "",
        align: "high",
      },
      labels: {
        overflow: "justify",
      },
      plotLines: [
        {
          value: undefined,
          percValue: undefined,
          valueType: "percentage",
          color: "#ff0000",
          width: 1,
          zIndex: 5,
          dashStyle: "solid",
          label: {
            enabled: false,
            text: "",
            textVisible: "",
            align: "center",
            style: {
              color: "#000000",
            },
          },
        },
      ],
    },
    tooltip: {
      shared: true,
      pointFormat: "",
      useHTML: true,
    },
    plotOptions: {
      series: {
        stacking: "",
        dataLabels: {
          enabled: true,
        },
      },
    },
    legend: {
      enabled: true,
    },
    exporting: {
      enabled: false,
      sourceWidth: 1200,
      sourceHeight: 500,
      chartOptions: {
        plotOptions: {
          series: {
            stacking: "",
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
    series: [],
    drilldown: {
      drillUpButton: {
        position: {
          align: "left",
          x: 0,
          y: 0,
        },
      },
      series: [],
    },
  },
  bar_stacked: {
    chart: {
      type: "bar",
      oType: "bar_stacked",
      zoomType: "x",
    },
    title: {
      text: "",
    },
    subtitle: {
      text: "",
    },
    xAxis: {
      type: "category",
      title: {
        text: "",
      },
    },
    yAxis: {
      title: {
        text: "",
      },
      stackLabels: {
        enabled: true,
      },
      plotLines: [
        {
          value: undefined,
          percValue: undefined,
          valueType: "percentage",
          color: "#ff0000",
          width: 1,
          zIndex: 5,
          dashStyle: "solid",
          label: {
            enabled: false,
            text: "",
            textVisible: "",
            align: "center",
            style: {
              color: "#000000",
            },
          },
        },
      ],
    },
    legend: {
      enabled: true,
    },
    tooltip: {
      shared: true,
      pointFormat: "",
      useHTML: true,
    },
    plotOptions: {
      series: {
        stacking: "normal",
        minPointLength: 3,
        dataLabels: {
          enabled: true,
        },
      },
    },
    exporting: {
      enabled: false,
      sourceWidth: 1200,
      sourceHeight: 500,
      chartOptions: {
        plotOptions: {
          series: {
            stacking: "normal",
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
    series: [],
    drilldown: {
      drillUpButton: {
        position: {
          align: "left",
          x: 0,
          y: 0,
        },
      },
      series: [],
    },
  },
  pie: {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
      oType: "pie",
    },
    title: {
      text: "",
    },
    tooltip: {
      shared: true,
      pointFormat: "",
      useHTML: true,
    },
    legend: {
      enabled: true,
    },
    exporting: {
      enabled: false,
      sourceWidth: 1200,
      sourceHeight: 500,
      chartOptions: {
        plotOptions: {
          series: {
            stacking: "",
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
    plotOptions: {
      series: {
        stacking: "",
        allowPointSelect: true,
        cursor: "pointer",
        depth: 35,
        dataLabels: {
          enabled: true,
        },
        showInLegend: true,
      },
    },
    series: [],
  },
};
