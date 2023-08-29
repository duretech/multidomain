import moment from "moment";
import i18n from "@/i18n";
import regression from "regression";
import {
  translateDate,
  translateAlphatoNum,
} from "@/components/Common/commonFunctions";
export const generateScatterChart = ({
  cObj,
  cObj1,
  cObj2,
  catArray,
  childArr,
  location,
  response,
  periodType,
  minOutlier,
  chartOptions,
  periodLength,
  chartOptions1,
  chartOptions2,
  wastageFactor,
  currentPeriod,
  isSingleSource,
  backgroundData,
  qualityThreshold,
}) => {
  let ou = response.data.metaData.dimensions.ou,
    exceptionTable = [],
    valueIndex = 0,
    ouIndex = 0,
    dxIndex = 0,
    peIndex = 0,
    r2 = 0;
  response.data.headers.forEach((h, i) => {
    if (h.name === "value") {
      valueIndex = i;
    }

    if (h.name === "ou") {
      ouIndex = i;
    }

    if (h.name === "pe") {
      peIndex = i;
    }

    if (h.name === "dx") {
      dxIndex = i;
    }
  });

  if (isSingleSource) {
    let rData = {};
    response.data.rows.forEach((r) => {
      if (rData[r[ouIndex]]) {
        if (rData[r[ouIndex]][r[peIndex]]) {
          rData[r[ouIndex]][r[peIndex]] =
            Number(rData[r[ouIndex]][r[peIndex]]) + Number(r[valueIndex]);
        } else {
          rData[r[ouIndex]][r[peIndex]] = Number(r[valueIndex]);
        }
      } else {
        rData[r[ouIndex]] = {
          [r[peIndex]]: Number(r[valueIndex]),
        };
      }
    });
    let xAxisData = {},
      yAxisData = {};

    Object.keys(rData).forEach((ou) => {
      if (rData[ou][currentPeriod]) {
        yAxisData[ou] = rData[ou][currentPeriod]
          ? rData[ou][currentPeriod]
          : null;
      }
      let sum = Object.keys(rData[ou]).reduce(
        (sum, key) => sum + parseFloat(rData[ou][key] || 0),
        0
      );
      sum = rData[ou][currentPeriod] ? sum - rData[ou][currentPeriod] : sum;
      xAxisData[ou] = Math.round(sum / (periodLength * 1 - 1));
    });

    let quarters = {
        Q1: ["Jan", "Mar"],
        Q2: ["Apr", "Jun"],
        Q3: ["Jul", "Sep"],
        Q4: ["Oct", "Dec"],
      },
      years = ["Mar", "Apr"];
    if (i18n.locale === "fr") {
      quarters = {
        Q1: ["janv.", "mars"],
        Q2: ["avril", "juin"],
        Q3: ["juil.", "sept."],
        Q4: ["oct.", "déc."],
      };
      years = ["mars", "avril"];
    }
    let formattedPeriod = null,
      pType = i18n.t("month");
    if (periodType === "monthly") {
      formattedPeriod = translateDate({
        rawDate: currentPeriod,
      });
      pType = i18n.t("month");
    } else if (periodType === "quarterly") {
      let q1 = currentPeriod.split("Q");
      formattedPeriod =
        quarters[`Q${q1[1]}`][0] +
        " " +
        i18n.t("toSmall") +
        " " +
        quarters[`Q${q1[1]}`][1] +
        " " +
        q1[0];
      pType = i18n.t("quarter");
    } else if (periodType === "financialYear") {
      let q1 = currentPeriod.split("April");
      formattedPeriod = `${years[1]} ${q1[0]} ${i18n.t("toSmall")} ${
        years[0]
      } ${q1[0] * 1 + 1}`;
      pType = i18n.t("financialYear");
    } else {
      formattedPeriod = moment(currentPeriod, "YYYY").format("YYYY");
      pType = i18n.t("year");
    }
    let xLegend = i18n.t("legend6", {
      count: periodLength * 1 - 1,
      periodType: pType,
    });
    let chartXLegend = chartOptions.xAxis.visible
      ? chartOptions.xAxis.text
        ? chartOptions.xAxis.text
        : xLegend
      : xLegend;
    let chartYLegend = chartOptions.yAxis.visible
      ? chartOptions.yAxis.text
        ? chartOptions.yAxis.text
        : formattedPeriod
      : formattedPeriod;

    let xException = Object.keys(xAxisData).filter(
      (val) => !Object.keys(yAxisData).includes(val)
    );
    let yException = Object.keys(yAxisData).filter(
      (val) => !Object.keys(xAxisData).includes(val)
    );

    let sameRegions = Object.keys(xAxisData).filter((val) =>
      Object.keys(yAxisData).includes(val)
    );
    let noDataRegions = ou.filter((val) => !sameRegions.includes(val));

    noDataRegions.forEach((val) => {
      let name = null;
      if (response.data.metaData.items[val]) {
        name = response.data.metaData.items[val].name;
      }
      if (xException.includes(val)) {
        Object.keys(xAxisData).forEach((x) => {
          if (x === val) {
            exceptionTable.push({
              [i18n.t("location")]: name,
              [chartYLegend]: "",
              [chartXLegend]: xAxisData[x] * 1,
            });
          }
        });
      } else if (yException.includes(val)) {
        Object.keys(yAxisData).forEach((x) => {
          if (x === val) {
            exceptionTable.push({
              [i18n.t("location")]: name,
              [chartYLegend]: yAxisData[y] * 1,
              [chartXLegend]: "",
            });
          }
        });
      } else {
        exceptionTable.push({
          [i18n.t("location")]: name,
          [chartYLegend]: "",
          [chartXLegend]: "",
        });
      }
    });
    let highX = 0,
      highY = 0,
      lowX = 0,
      lowY = 0;

    let data = [],
      regressionData = [],
      xArr = [];

    Object.keys(xAxisData).forEach((x) => {
      let locID = location;
      if (childArr.length === 0) {
        locID = "";
      }
      if (x !== locID) {
        xArr.push(xAxisData[x]);
        let name = "";
        if (response.data.metaData.items[x]) {
          name = response.data.metaData.items[x].name;
        }

        Object.keys(yAxisData).forEach((y) => {
          if (x === y) {
            regressionData.push([xAxisData[x] * 1, yAxisData[y] * 1]);
            let ratio =
              xAxisData[x] * 1 !== 0
                ? ((yAxisData[y] * 1) / (xAxisData[x] * 1)) * 1
                : 0;
            let thresholdLow = 1 - qualityThreshold,
              thresholdHigh = 1 + qualityThreshold;
            let outlier = ratio < thresholdLow || ratio > thresholdHigh;
            data.push({
              name,
              x: xAxisData[x] * 1,
              y: yAxisData[y] * 1,
              color: outlier
                ? backgroundData.outliersColor
                : chartOptions.color,
              outlier: outlier,
            });
            let itemObj = {
              [i18n.t("location")]: name,
            };
            Object.keys(rData[y]).forEach((d) => {
              if (d !== currentPeriod) {
                let formattedPeriod = null;
                if (periodType === "monthly") {
                  formattedPeriod = translateDate({
                    rawDate: d,
                  });
                } else if (periodType === "quarterly") {
                  let q1 = d.split("Q");
                  formattedPeriod =
                    quarters[`Q${q1[1]}`][0] +
                    " " +
                    i18n.t("toSmall") +
                    " " +
                    quarters[`Q${q1[1]}`][1] +
                    " " +
                    q1[0];
                } else if (periodType === "financialYear") {
                  let q1 = d.split("April");
                  formattedPeriod = `${years[1]} ${q1[0]} ${i18n.t(
                    "toSmall"
                  )} ${years[0]} ${q1[0] * 1 + 1}`;
                } else {
                  formattedPeriod = moment(d, "YYYY").format("YYYY");
                }
                // let isFound = fields.find((f) => f === formattedPeriod);
                // if (!isFound) {
                // 	fields.push(formattedPeriod);
                // }
                // itemObj[formattedPeriod] = rData[y][d];
              }
            });
            // let isFound = fields.find((f) => f === chartXLegend);
            // if (!isFound) {
            // 	fields.push(chartXLegend);
            // }
            // itemObj[chartXLegend] = xAxisData[x] * 1;
            // isFound = fields.find((f) => f === chartYLegend);
            // if (!isFound) {
            // 	fields.push(chartYLegend);
            // }
            // itemObj[chartYLegend] = yAxisData[y] * 1;
            // if (outlier) {
            // 	itemObj["_rowVariant"] = "danger";
            // }
            // items.push(itemObj);
          }
        });
      }
    });

    let max = Math.max(...xArr);
    // highX = lowY = Math.round(max / 1000) * 1000;
    // highY = lowX =
    //   Math.round(((1 + qualityThreshold) * highX) / 1000) *
    //   1000;
    highX = lowY = max;
    highY = lowX = (1 + qualityThreshold) * highX;
    if (data.length) {
      cObj.series.push({
        name: `${chartXLegend} vs ${chartYLegend}`,
        color: chartOptions.color,
        data: data,
      });

      const result = regression.linear(regressionData);
      let maxValue = Math.max(...regressionData.flat());
      // maxValue = Math.round(maxValue / 1000) * 1000;
      let diagonalLine = {
        type: "line",
        name: i18n.t("legend1"),
        color: backgroundData.idleTrendColor,
        dashStyle: "Dot",
        data: [
          [0, 0],
          [maxValue, maxValue],
        ],
        marker: {
          enabled: false,
        },
        states: {
          hover: {
            lineWidth: 0,
          },
        },
        enableMouseTracking: false,
        // showInLegend: false
      };
      let qualityThresholdHigh = {
        type: "line",
        name: "Quality Threshold High",
        color: backgroundData.qualityThresholdColor,
        dashStyle: "LongDash",
        data: [
          [0, 0],
          [highX, highY],
        ],
        marker: {
          enabled: false,
        },
        states: {
          hover: {
            lineWidth: 0,
          },
        },
        enableMouseTracking: false,
        showInLegend: false,
      };
      let qualityThresholdLow = {
        type: "line",
        name: "Quality Threshold Low",
        color: backgroundData.qualityThresholdColor,
        dashStyle: "LongDash",
        data: [
          [0, 0],
          [lowX, lowY],
        ],
        marker: {
          enabled: false,
        },
        states: {
          hover: {
            lineWidth: 0,
          },
        },
        enableMouseTracking: false,
        showInLegend: false,
      };
      cObj.xAxis.max = maxValue;
      cObj.yAxis.max = maxValue;
      cObj.series.push(diagonalLine);
      cObj.series.push(qualityThresholdHigh);
      cObj.series.push(qualityThresholdLow);

      let regressionLine = {
        type: "line",
        name: i18n.t("legend2"),
        color: backgroundData.linearTrendColor,
        data: result.points,
        dashStyle: "solid",
        marker: {
          enabled: false,
        },
        states: {
          hover: {
            lineWidth: 0,
          },
        },
        enableMouseTracking: false,
      };
      cObj.series.push(regressionLine);
      r2 = result.r2 ? result.r2 : 0;
    }
  } else {
    let sData = {},
      sources = [];
    catArray.forEach((c) => {
      sources.push(c.name);
      let rData = {};
      response.data.rows.forEach((r) => {
        if (c.dx.includes(r[dxIndex])) {
          if (rData[r[ouIndex]]) {
            if (rData[r[ouIndex]][r[peIndex]]) {
              rData[r[ouIndex]][r[peIndex]] =
                Number(rData[r[ouIndex]][r[peIndex]]) + Number(r[valueIndex]);
            } else {
              rData[r[ouIndex]][r[peIndex]] = Number(r[valueIndex]);
            }
          } else {
            rData[r[ouIndex]] = {
              [r[peIndex]]: Number(r[valueIndex]),
            };
          }
        }
      });
      sData[c.name] = rData;
    });
    let method1 = sources[0];
    let method2 = sources[1];

    let m1 = method1;
    let m2 = method2;

    let xException = Object.keys(sData[method1]).filter(
      (val) => !Object.keys(sData[method2]).includes(val)
    );
    let yException = Object.keys(sData[method2]).filter(
      (val) => !Object.keys(sData[method1]).includes(val)
    );

    let sameRegions = Object.keys(sData[method1]).filter((val) =>
      Object.keys(sData[method2]).includes(val)
    );
    let noDataRegions = ou.filter((val) => !sameRegions.includes(val));

    noDataRegions.forEach((val) => {
      let name = response.data.metaData.items[val].name || null;
      if (xException.includes(val)) {
        Object.keys(sData[method1]).forEach((x) => {
          if (x === val) {
            exceptionTable.push({
              [i18n.t("location")]: name,
              [m2]: "",
              [m1]: sData[method1][x][currentPeriod] * 1,
            });
          }
        });
      } else if (yException.includes(val)) {
        Object.keys(sData[method2]).forEach((x) => {
          if (x === val) {
            exceptionTable.push({
              [i18n.t("location")]: name,
              [m2]: sData[method2][x][currentPeriod] * 1,
              [m1]: "",
            });
          }
        });
      } else {
        exceptionTable.push({
          [i18n.t("location")]: name,
          [m2]: "",
          [m1]: "",
        });
      }
    });
    let data = [],
      ratioData = [],
      diffData = [],
      avgData = [],
      accessData = [],
      accessDataFixYAxis = [],
      cat = [],
      regressionData = [];

    Object.keys(sData[method1]).forEach((x) => {
      let name = "";
      if (response.data.metaData.items[x]) {
        name = response.data.metaData.items[x].name;
      }
      let locID = location;
      if (childArr.length === 0) {
        locID = "";
      }
      if (x !== locID) {
        Object.keys(sData[method2]).forEach((y) => {
          if (x === y) {
            regressionData.push([
              sData[method1][x][currentPeriod] * 1,
              sData[method2][y][currentPeriod] * 1,
            ]);
            let ratio =
              sData[method1][y][currentPeriod] * 1 !== 0
                ? ((sData[method2][x][currentPeriod] * 1) /
                    (sData[method1][y][currentPeriod] * 1)) *
                  1
                : 0;
            let diff =
              (sData[method1][x][currentPeriod] * 1 -
                sData[method2][y][currentPeriod] * 1) *
              1;
            let avg =
              ((sData[method1][x][currentPeriod] * 1 +
                sData[method2][y][currentPeriod] * 1) /
                2) *
              1;

            let t2 = i18n.t("legend5", { m2: m2, m1: m1 });
            // items1.push({
            // 	[i18n.t("location")]: name,
            // 	[m2]: sData[method2][y][currentPeriod] * 1,
            // 	[m1]: sData[method1][x][currentPeriod] * 1,
            // 	[t2]: ratio.toFixed(2) * 1,
            // });

            let accData = (avg * (wastageFactor * 1)) / 100;
            let outlier = Math.abs(diff) > accData && avg > minOutlier * 1;
            cat.push(name);

            ratioData.push({
              name,
              y: ratio.toFixed(2) * 1,
              color: chartOptions2.color,
            });

            if (outlier) {
              data.push({
                name,
                x: sData[method1][x][currentPeriod] * 1,
                y: sData[method2][y][currentPeriod] * 1,
                color: backgroundData.outliersColor,
                outlier: true,
              });
              diffData.push({
                name,
                y: diff.toFixed(2) * 1,
                color: backgroundData.outliersColor,
              });
            } else {
              data.push({
                name,
                x: sData[method1][x][currentPeriod] * 1,
                y: sData[method2][y][currentPeriod] * 1,
                outlier: false,
              });
              diffData.push({
                name,
                y: diff.toFixed(2) * 1,
                color: chartOptions1.color,
              });
            }
            avgData.push({
              name,
              y: avg.toFixed(2) * 1,
            });
            accessData.push([
              -accData.toFixed(2) * 1,
              0,
              accData.toFixed(2) * 1,
            ]);
            accessDataFixYAxis.push(accData.toFixed(2) * 1);
          }
        });
      }
    });

    //This is to sort the data by default using location name's on first load
    diffData
      .map(function (v, i) {
        return {
          value1: v,
          value2: accessData[i],
          value3: cat[i],
        };
      })
      .sort(function (a, b) {
        return a.value1.y < b.value1.y ? -1 : a.value1.y == b.value1.y ? 0 : 1;
      })
      .forEach(function (v, i) {
        diffData[i] = v.value1;
        accessData[i] = v.value2;
        cat[i] = v.value3;
      });

    ratioData.sort((a, b) => {
      return a.y < b.y ? 1 : a.y == b.y ? 0 : -1;
    });

    if (ratioData.length) {
      if (!chartOptions2.disable) {
        cObj2.series = [
          {
            name: i18n.t("legend5", {
              m2: m2,
              m1: m1,
            }),
            data: ratioData,
            color: chartOptions2.color,
          },
        ];
        // cObj2.xAxis.categories = cat
        cObj2.xAxis.max = ratioData.length > 10 ? 10 : ratioData.length - 1;

        let min = 0,
          max = 0,
          dArr = [];
        dArr = ratioData.map((dInner) => dInner.y);
        let innerMin = Math.min(...dArr);
        let innerMax = Math.max(...dArr);
        if (innerMin < min) {
          min = innerMin;
        }
        if (innerMax > max) {
          max = innerMax;
        }
        cObj2.yAxis.min = min > 0 ? 0 : min;
        cObj2.yAxis.max = max;
      }
    }

    if (accessData.length && diffData.length) {
      if (!chartOptions1.disable) {
        cObj1.xAxis[0].categories = cat;
        cObj1.series.push({
          name: i18n.t("legend3", { m2: m2, m1: m1 }),
          type: "line",
          color: chartOptions1.color,
          data: diffData,
          lineWidth: 0,
          states: {
            hover: {
              lineWidthPlus: 0,
            },
          },
        });
        cObj1.series.push({
          name: `${wastageFactor}% & -${i18n.t("legend4", {
            wastageFactor: wastageFactor,
          })}`,
          data: accessData,
          tooltip: {
            shared: true,

            useHTML: true,
            pointFormatter: function () {
              var point = this;
              return (
                '<span style="color:' +
                point.color +
                '">\u25CF</span> ' +
                point.series.name +
                ":<br/>High (" +
                wastageFactor +
                "% of average) : <b>" +
                point.high +
                "</b><br/>Low (-" +
                wastageFactor +
                "% of average): <b>" +
                point.low +
                "</b><br/>"
              );
            },
          },
        });
        cObj1.yAxis.plotLines = [
          {
            value: "0",
            color: "#f6f6f6",
            width: 2,
            zIndex: 5,
            dashStyle: "solid",
          },
        ];
        cObj1.xAxis[0].max = diffData.length > 10 ? 10 : diffData.length - 1;
      }

      let min = 0,
        max = 0,
        dArr = [];
      dArr = diffData.map((dInner) => dInner.y);
      let innerMin = Math.min(...dArr);
      let innerMax = Math.max(...dArr);
      if (innerMin < min) {
        min = innerMin;
      }
      if (innerMax > max) {
        max = innerMax;
      }

      innerMin = Math.min(...accessDataFixYAxis);
      innerMax = Math.max(...accessDataFixYAxis);
      if (innerMin < min) {
        min = innerMin;
      }
      if (innerMax > max) {
        max = innerMax;
      }
      cObj1.yAxis.min = min > 0 ? 0 : min;
      cObj1.yAxis.max = max;
    }

    let chartXLegend = chartOptions.xAxis.visible
      ? chartOptions.xAxis.text
        ? chartOptions.xAxis.text
        : m1
      : m1;
    let chartYLegend = chartOptions.yAxis.visible
      ? chartOptions.yAxis.text
        ? chartOptions.yAxis.text
        : m2
      : m2;
    if (data.length) {
      cObj.series.push({
        name: `${chartXLegend} vs ${chartYLegend}`,
        color: chartOptions.color,
        data: data,
      });

      const result = regression.linear(regressionData);
      let maxValue = Math.max(...regressionData.flat());
      let diagonalLine = {
        type: "line",
        name: i18n.t("legend1"),
        color: backgroundData.idleTrendColor,
        dashStyle: "Dot",
        data: [
          [0, 0],
          [maxValue, maxValue],
        ],
        marker: {
          enabled: false,
        },
        states: {
          hover: {
            lineWidth: 0,
          },
        },
        enableMouseTracking: false,
        // showInLegend: false
      };
      cObj.xAxis.max = maxValue;
      cObj.yAxis.max = maxValue;
      cObj.series.push(diagonalLine);

      let regressionLine = {
        type: "line",
        name: i18n.t("legend2"),
        color: backgroundData.linearTrendColor,
        data: result.points,
        dashStyle: "LongDash",
        marker: {
          enabled: false,
        },
        states: {
          hover: {
            lineWidth: 0,
          },
        },
        enableMouseTracking: false,
      };
      cObj.series.push(regressionLine);
      r2 = result.r2 ? result.r2 : 0;
    }
  }
  return { cObj, cObj1, cObj2, r2 };
};
