import i18n from "@/i18n";
import moment from "moment";
import store from "@/store";
import service from "@/service";
import regression from "regression";
import merge from "lodash/merge";

export const getDateRange = ({
  sendPeriod,
  periodType,
  periodLength = 1,
  applicationFinalYear = getAppFinalYear(),
}) => {
  let period = [];
  if (periodType === "yearly") {
    let periodValue = moment(sendPeriod, "YYYY").format("YYYY");
    period = [periodValue];
    for (let i = 1; i < periodLength * 1; i++) {
      if (periodValue - i < applicationFinalYear) {
        break;
      }
      period.push(periodValue - i);
    }
  } else if (
    periodType === "financialYear" ||
    periodType === "financialYearJuly"
  ) {
    let pText = periodType === "financialYear" ? "April" : "July";
    let currentYear =
      periodType === "financialYear" ? sendPeriod : sendPeriod.split("July")[0];
    period = [`${currentYear}${pText}`];
    for (let i = 1; i < periodLength * 1; i++) {
      currentYear = currentYear - 1;
      if (currentYear < applicationFinalYear) {
        break;
      }
      period.push(`${currentYear}${pText}`);
    }
  } else if (periodType === "quarterly") {
    period = [sendPeriod];
    for (let i = 1; i < periodLength * 1; i++) {
      let currentYear = moment(sendPeriod, "YYYY[Q]Q")
        .subtract(i, "Q")
        .format("YYYY[Q]Q");
      let cYear = currentYear.split("Q")[0];
      if (cYear < applicationFinalYear) {
        break;
      }
      period.push(currentYear);
    }
  } else {
    let periodValue = moment(sendPeriod, "YYYYMM").format("YYYYMM");
    period = [periodValue];
    for (let i = 1; i < periodLength * 1; i++) {
      period.push(
        moment(periodValue, "YYYYMM").subtract(i, "months").format("YYYYMM")
      );
    }
  }
  return period;
};

export const getAppFinalYear = () => {
  let globalPeriodData = store.getters.getGlobalFactors().period.Period;
  return globalPeriodData
    ? moment(new Date(globalPeriodData.backtrackedLimitedDate), "YYYY").format(
        "YYYY"
      )
    : new Date().getFullYear();
};

export const translateDate = ({
  rawDate,
  periodType,
  monthlyFormat = "MMM YYYY",
}) => {
  let quarters = {
      Q1: ["Jan", "Mar"],
      Q2: ["Apr", "Jun"],
      Q3: ["Jul", "Sep"],
      Q4: ["Oct", "Dec"],
    },
    years = ["Mar", "Apr"],
    yearsJuly = ["Jun", "Jul"];
  if (i18n.locale === "fr") {
    quarters = {
      Q1: ["janv.", "mars"],
      Q2: ["avril", "juin"],
      Q3: ["juil.", "sept."],
      Q4: ["oct.", "d??c."],
    };
    (years = ["mars", "avril"]), (yearsJuly = ["juin", "juil."]);
  }
  let formattedPeriod = null;
  if (periodType === "monthly") {
    formattedPeriod = moment(rawDate, "YYYYMM").format(monthlyFormat);
  } else if (periodType === "quarterly") {
    let q1 = rawDate.split("Q");
    formattedPeriod =
      quarters[`Q${q1[1]}`][0] +
      " " +
      i18n.t("toSmall") +
      " " +
      quarters[`Q${q1[1]}`][1] +
      " " +
      q1[0];
  } else if (periodType === "financialYear") {
    let q1 = rawDate.split("April");
    formattedPeriod = `${years[1]} ${q1[0]} ${i18n.t("toSmall")} ${years[0]} ${
      q1[0] * 1 + 1
    }`;
  } else if (periodType === "financialYearJuly") {
    let q1 = rawDate.split("July");
    formattedPeriod = `${yearsJuly[1]} ${q1[0]} ${i18n.t("toSmall")} ${
      yearsJuly[0]
    } ${q1[0] * 1 + 1}`;
  } else {
    formattedPeriod = moment(rawDate, "YYYY").format("YYYY");
  }
  return formattedPeriod;
};

export const formatSingleDate = ({ rawDate, periodType }) => {
  let currPeriod = null;
  if (periodType === "monthly") {
    currPeriod = moment(rawDate, "YYYYMM").format("YYYYMM");
  }
  if (periodType === "yearly") {
    currPeriod = moment(rawDate, "YYYY").format("YYYY");
  }
  if (periodType === "quarterly") {
    currPeriod = moment(rawDate, "YYYY[Q]Q").format("YYYY[Q]Q");
  }
  if (periodType === "financialYear") {
    let pYear = rawDate.substring(0, 4);
    currPeriod = `${pYear}April`;
  }
  if (periodType === "financialYearJuly") {
    let pYear = rawDate.substring(0, 4);
    currPeriod = `${pYear}July`;
  }
  return currPeriod;
};

export const subtractNDate = ({ rawDate, periodType, n = 1 }) => {
  let prevPeriod = null;
  if (periodType === "monthly") {
    prevPeriod = moment(rawDate, "YYYYMM")
      .subtract(n, "months")
      .format("YYYYMM");
  }
  if (periodType === "yearly") {
    prevPeriod = moment(rawDate, "YYYY").subtract(n, "year").format("YYYY");
  }
  if (periodType === "quarterly") {
    prevPeriod = moment(rawDate, "YYYY[Q]Q")
      .subtract(n, "Q")
      .format("YYYY[Q]Q");
  }
  if (periodType === "financialYear") {
    let pYear = rawDate.substring(0, 4);
    prevPeriod = `${pYear - n}April`;
  }
  if (periodType === "financialYearJuly") {
    let pYear = rawDate.substring(0, 4);
    prevPeriod = `${pYear - n}July`;
  }
  return prevPeriod;
};

export const chartExport = (type, chart) => {
  if (type == "jpg") {
    chart.exportChart({
      type: "image/jpeg",
      filename: "overview-chart",
    });
  } else if (type == "png") {
    chart.exportChart({
      type: "image/png",
      filename: "overview-chart",
    });
  } else if (type == "pdf") {
    chart.exportChart({
      type: "application/pdf",
      filename: "overview-chart",
    });
  }
};

export const randomString = (length) => {
  let result = "",
    chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = length; i > 0; --i)
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  return result;
};

export const roundNumber = (num, scale) => {
  if (!("" + num).includes("e")) {
    return +(Math.round(num + "e+" + scale) + "e-" + scale);
  } else {
    var arr = ("" + num).split("e");
    var sig = "";
    if (+arr[1] + scale > 0) {
      sig = "+";
    }
    var i = +arr[0] + "e" + sig + (+arr[1] + scale);
    var j = Math.round(i);
    var k = +(j + "e-" + scale);
    return k;
  }
};

export const isNumber = (n) => {
  return !isNaN(parseFloat(n)) && !isNaN(n - 0);
};

export const randomIntFromInterval = (min, max) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getLocationName = ({ locationList, location }) => {
  let flatLocations = service.flattenLocationList(locationList);
  let isLocation = flatLocations.find((l) => l.id === location);
  return {
    locName: isLocation?.label || "",
    childArr: isLocation?.children || [],
  };
};
export const getColor = () => {
  let clr = "";
  do {
    clr = "#" + ((Math.random() * 0xffffff) << 0).toString(16);
  } while (clr.length < 7);
  return clr;
};

export const getAllMappings = () => {
  let allMappings = [],
    gSetting = store.getters.getGlobalFactors();
  if (
    gSetting.globalMappings &&
    gSetting.globalMappings.mappings &&
    gSetting.globalMappings.mappings.length
  ) {
    allMappings = [].concat(
      ...gSetting.globalMappings.mappings.map(({ mapping }) => mapping || [])
    );
  }
  return allMappings;
};

export const formatSeasonalPeriod = ({ rawData, periodType, type = "MMM" }) => {
  let forDate = null;
  if (periodType === "monthly") {
    forDate = moment(rawData).format(type);
  }
  if (periodType === "financialYear") {
    let d = rawData.split("A");
    if (type === "MMM") {
      let years = ["Apr", "Mar"];
      if (i18n.locale === "fr") {
        years = ["avril", "mars"];
      }
      forDate = years.join("-");
    } else {
      forDate = d[0];
    }
  }
  if (periodType === "yearly") {
    if (type === "MMM") {
      let years = ["Jan", "Dec"];
      if (i18n.locale === "fr") {
        years = ["janv.", "d??c."];
      }
      forDate = years.join("-");
    } else {
      forDate = rawData;
    }
  }
  if (periodType === "quarterly") {
    let d = rawData.split("Q");
    if (type === "MMM") {
      let quarters = {
        Q1: ["Jan", "Mar"],
        Q2: ["Apr", "Jun"],
        Q3: ["Jul", "Sep"],
        Q4: ["Oct", "Dec"],
      };
      if (i18n.locale === "fr") {
        quarters = {
          Q1: ["janv.", "mars"],
          Q2: ["avril", "juin"],
          Q3: ["juil.", "sept."],
          Q4: ["oct.", "d??c."],
        };
      }
      let str = quarters[`Q${d[1]}`];
      forDate = str.join("-");
    } else {
      forDate = d[0];
    }
  }
  return forDate;
};

export const capitalize = (string) => {
  return string
    ? string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
    : "";
};
export const generateChart = ({
  cObj,
  cData,
  childArr,
  response,
  catArray,
  location,
  periodArr,
  minOutlier,
  periodType,
  prevPeriod,
  isBenchmark,
  periodLength,
  locationName,
  wastageFactor,
  currentPeriod,
  backgroundData,
  qualityThreshold,
}) => {
  let pe = response.data.metaData.dimensions.pe;
  let ou =
    cData.chartCalculation === "PERIOD_DIFF" || isBenchmark
      ? response.data.metaData.dimensions.ou
      : response.data.metaData.dimensions.ou.filter((o) => o !== location);
  let benchmarkValue = null,
    exceptionTable = [];
  let valueIndex = 0,
    ouIndex = 0,
    peIndex = 0,
    dxIndex = 0,
    r2 = -1;
  response.data.headers.forEach((h, i) => {
    if (h.name === "value") {
      valueIndex = i;
    }

    if (h.name === "ou") {
      ouIndex = i;
    }

    if (h.name === "dx") {
      dxIndex = i;
    }

    if (h.name === "pe") {
      peIndex = i;
    }
  });
  let obj = {},
    drilldown = {
      drillUpButton: {
        position: {
          align: "left",
          x: 0,
          y: 0,
        },
      },
      series: [],
    };
  let peFinalCount = {};
  if (["STOCK_OUT", "AVAILABILITY"].includes(cData.chartCalculation)) {
    let rows = response.data.rows.filter((r) => r[ouIndex] !== location);
    let uniqueOU = {};
    response.data.metaData.dimensions.ou.forEach((ou) => {
      if (ou !== location) {
        uniqueOU[ou] = "IA";
      }
    });
    let pData = {};
    pe.forEach((p) => {
      let rCatData = {};
      catArray.forEach((item) => {
        let catData = { name: item.name, de: [] };
        item.dx.forEach((dx) => {
          let innerDX = { deID: dx, count: {} };
          rows.forEach((r) => {
            if (dx === r[dxIndex] && p === r[peIndex]) {
              innerDX["count"][r[ouIndex]] =
                r[valueIndex] * 1 === 0 ? "T" : "F";
            }
          });
          let uniqueOU_Temp = JSON.parse(JSON.stringify(uniqueOU));
          let combinedOU = merge(uniqueOU_Temp, innerDX.count);
          innerDX.count = combinedOU;
          catData["de"].push(innerDX);
        });
        rCatData[item.name] = catData;
      });
      pData[p] = rCatData;
    });

    let peDECompare = {};
    Object.keys(pData).forEach((pd) => {
      let deCompare = {};
      Object.keys(pData[pd]).forEach((rData) => {
        let catData = { name: rData, deCompare: {} };

        Object.keys(uniqueOU).forEach((ou) => {
          let finalStatus = null;
          pData[pd][rData].de.forEach((de, j) => {
            if (j === 0) {
              finalStatus = de.count[ou];
            } else {
              if (
                (finalStatus === "T" && de.count[ou] === "T") ||
                (finalStatus === "T" && de.count[ou] === "IA") ||
                (finalStatus === "IA" && de.count[ou] === "T")
              ) {
                finalStatus = "T";
              } else if (finalStatus === "IA" && de.count[ou] === "IA") {
                finalStatus = "IA";
              } else {
                finalStatus = "F";
              }
            }
          });
          catData.deCompare[ou] = finalStatus;
        });
        deCompare[rData] = catData;
      });
      peDECompare[pd] = deCompare;
    });

    Object.keys(peDECompare).forEach((pm) => {
      let finalCount = {};
      Object.keys(peDECompare[pm]).forEach((deData) => {
        let numKey = "T",
          denKey = "F";
        if (["AVAILABILITY"].includes(cData.chartCalculation)) {
          (numKey = "F"), (denKey = "T");
        }
        let methodData = peDECompare[pm][deData].deCompare,
          numerator = Object.keys(methodData).filter(
            (d) => methodData[d] === numKey
          ).length,
          denominator = Object.keys(methodData).filter(
            (d) => methodData[d] === denKey
          ).length;
        finalCount[deData] = {
          numerator,
          denominator: numerator + denominator,
        };
      });
      peFinalCount[pm] = finalCount;
    });
  }
  if (cData.chartCategory === "seasonal") {
    catArray.forEach((dx) => {
      let rData = {};
      response.data.rows.forEach((r) => {
        if (dx.dx.includes(r[dxIndex])) {
          if (!rData[r[ouIndex]]) {
            rData[r[ouIndex]] = {};
          }
          rData[r[ouIndex]][r[peIndex]] =
            Number(rData[r[ouIndex]][r[peIndex]] || 0) + Number(r[valueIndex]);
        }
      });
      Object.keys(rData).forEach((d) => {
        if (d === location) {
          periodArr.forEach((p, pInd) => {
            let name = formatSeasonalPeriod({
              rawData: p[0],
              periodType,
              type: "YYYY",
            });
            if (dx.name) {
              name =
                dx.name +
                " - " +
                formatSeasonalPeriod({
                  rawData: p[0],
                  periodType,
                  type: "YYYY",
                });
            }
            let color = Array.isArray(dx.color) ? dx.color[pInd] : dx.color;
            let visible = dx.visible;

            obj = {
              name,
              visible,
              data: [],
              color: color ? color : getColor(),
            };
            p.forEach((p) => {
              if (rData[d][p]) {
                obj.data.push({
                  name: formatSeasonalPeriod({
                    rawData: p,
                    periodType,
                  }),
                  y: (rData[d][p] * 1).toFixed(2) * 1,
                  pe: p,
                });
              } else {
                obj.data.push({
                  name: formatSeasonalPeriod({
                    rawData: p,
                    periodType,
                  }),
                  y: null,
                  pe: p,
                });
              }
            });
            cObj.series.push(obj);
          });
        }
      });
    });
  }
  if (cData.chartCategory === "trend") {
    if (["STOCK_OUT", "AVAILABILITY"].includes(cData.chartCalculation)) {
      let name = null,
        color = null,
        visible = null;
      catArray.forEach((cat) => {
        name = cat.name;
        color = cat.color;
        visible = cat.visible;

        obj = {
          name,
          visible,
          data: [],
          color: color ? color : getColor(),
        };

        Object.keys(peFinalCount).forEach((d, j) => {
          let formattedPeriod = translateDate({
            rawDate: d,
            periodType: periodType,
          });

          obj.data.push({
            name: formattedPeriod,
            y:
              peFinalCount[d][name].denominator * 1 !== 0
                ? (
                    (peFinalCount[d][name].numerator /
                      peFinalCount[d][name].denominator) *
                    100
                  ).toFixed(2) * 1
                : null,
            pe: d,
          });
        });
        cObj.series.push(obj);
      });
    } else {
      catArray.forEach((dx, dxI) => {
        let rData = {};
        response.data.rows.forEach((r) => {
          if (dx.dx.includes(r[dxIndex])) {
            if (!rData[r[ouIndex]]) {
              rData[r[ouIndex]] = {};
            }
            rData[r[ouIndex]][r[peIndex]] =
              Number(rData[r[ouIndex]][r[peIndex]] || 0) +
              Number(r[valueIndex]) * dx.cyp[r[dxIndex]];
          }
        });
        if (Object.keys(rData).length === 0) {
          let name = dx.name
            ? dx.name
            : response.data.metaData.items[location].name;
          let color = dx.color;
          let visible = dx.visible;

          obj = {
            name,
            visible,
            data: [],
            color: color ? color : getColor(),
            static_name: dx.static_name,
          };
          cObj.series.push(obj);
        }
        let bFlag = false;
        Object.keys(rData).forEach((d, j) => {
          if (d === location) {
            let name = dx.name
              ? dx.name
              : response.data.metaData.items[location].name;
            let color = dx.color ? dx.color : getColor();
            let visible = dx.visible;

            obj = {
              name,
              visible,
              data: [],
              color,
              static_name: dx.static_name,
            };
            pe.forEach((p, i) => {
              let prevPeriod = subtractNDate({
                rawDate: p,
                periodType: periodType,
              });
              let formCurrPeriod = translateDate({
                rawDate: p,
                periodType: periodType,
              });
              let formPrevPeriod = translateDate({
                rawDate: prevPeriod,
                periodType: periodType,
              });
              let drillText =
                cData.drillCalculation === "PERIOD_DIFF"
                  ? i === 0
                    ? `${name} ( ${formCurrPeriod} )`
                    : `${name} ( ${formCurrPeriod} - ${formPrevPeriod} )`
                  : formCurrPeriod;
              if (rData[d][p]) {
                obj.data.push({
                  name: formCurrPeriod,
                  pe: p,
                  pePrev: i === 0 ? 0 : prevPeriod,
                  // y: (rData[d][p] * 1).toFixed(2) * 1,
                  y: Math.round(rData[d][p]),
                  drillColor: color,
                  drilldown: cData.chartDrillDown ? drillText : null,
                });
              } else {
                obj.data.push({
                  name: formCurrPeriod,
                  pe: p,
                  pePrev: i === 0 ? 0 : prevPeriod,
                  y: null,
                  drilldown: null,
                });
              }
            });
            cObj.series.push(obj);
          }
          if (j === Object.keys(rData).length - 1 && cData.chartDrillDown) {
            bFlag = true;
          }
        });

        if (bFlag) {
          cObj.series[dxI].data.forEach((rt, k) => {
            obj = {
              id: rt.drilldown,
              type: "column",
              name: rt.drilldown,
              data: [],
            };
            Object.keys(rData).forEach((d) => {
              let name = response.data.metaData.items[d].name || null;

              if (d !== location) {
                if (Object.keys(rData[d]).includes(rt.pe)) {
                  let y = null,
                    color = null;
                  if (cData.drillCalculation !== "PERIOD_DIFF" || k === 0) {
                    y = rData[d][rt.pe]
                      ? (rData[d][rt.pe] * 1 - 0).toFixed(2) * 1
                      : null;
                  } else {
                    if (rData[d][rt.pePrev]) {
                      if (rData[d][rt.pe]) {
                        y =
                          (
                            rData[d][rt.pe] * 1 -
                            rData[d][rt.pePrev] * 1
                          ).toFixed(2) * 1;
                      } else {
                        y = (0 - rData[d][rt.pePrev] * 1).toFixed(2) * 1;
                      }
                    } else if (rData[d][rt.pe]) {
                      y = (rData[d][rt.pe] * 1 - 0).toFixed(2) * 1;
                    } else {
                      y = null;
                    }
                  }
                  color =
                    cData.drillCalculation !== "PERIOD_DIFF"
                      ? rt.drillColor
                      : y > 0
                      ? "#5BD282"
                      : "#FE8081";
                  obj.data.push({
                    name,
                    y,
                    color,
                    locationID: d,
                    originalY: rData[d][rt.pe] * 1,
                  });
                }
              }
            });
            drilldown.series.push(obj);
          });
        }
      });
      if (cData.chartDrillDown) {
        cObj.drilldown = drilldown;
      }
    }
  }
  if (cData.chartCategory === "regional") {
    if (!cData.isSingleSource) {
      let sData = {},
        sources = [];
      catArray.forEach((c) => {
        sources.push(c.name);
        let rData = {};
        response.data.rows.forEach((r) => {
          if (c.dx.includes(r[dxIndex])) {
            if (!rData[r[ouIndex]]) {
              rData[r[ouIndex]] = {};
            }
            rData[r[ouIndex]][r[peIndex]] =
              Number(rData[r[ouIndex]][r[peIndex]] || 0) +
              Number(r[valueIndex]);
          }
        });
        sData[c.name] = rData;
      });
      let method1 = sources[0];
      let method2 = sources[1];

      let data = [],
        ratioData = [],
        diffData = [],
        avgData = [],
        accessData = [],
        accessDataFixYAxis = [],
        cat = [],
        regressionData = [];

      Object.keys(sData[method1]).forEach((x) => {
        let name = response.data.metaData.items[x].name || "";
        let locID = location;
        if (childArr && childArr.length === 0) {
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
              let accData = (avg * (wastageFactor * 1)) / 100;
              let outlier = Math.abs(diff) > accData && avg > minOutlier * 1;
              cat.push(name);

              ratioData.push({
                name,
                y: ratio.toFixed(2) * 1,
                color: cData.color,
              });

              data.push({
                name,
                x: sData[method1][x][currentPeriod] * 1,
                y: sData[method2][y][currentPeriod] * 1,
                color: outlier
                  ? backgroundData?.outliersColor || cData.color
                  : cData.color,
                outlier,
              });
              diffData.push({
                name,
                y: diff.toFixed(2) * 1,
                color: outlier
                  ? backgroundData?.outliersColor || cData.color
                  : cData.color,
              });
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
      if (ratioData.length && cData.chartCalculation === "SOURCE_AVG") {
        ratioData.sort((a, b) => {
          return a.y < b.y ? 1 : a.y == b.y ? 0 : -1;
        });
        cObj.series = [
          {
            name: i18n.t("legend5", {
              m2: method2,
              m1: method1,
            }),
            data: ratioData,
            color: cData.color,
          },
        ];
        // cObj2.xAxis.categories = cat
        cObj.xAxis.max = ratioData.length > 10 ? 10 : ratioData.length - 1;

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
        cObj.yAxis.min = min > 0 ? 0 : min;
        cObj.yAxis.max = max;
      }

      if (
        accessData.length &&
        diffData.length &&
        cData.chartCalculation === "SOURCE_DIFF"
      ) {
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
            return a.value1.y < b.value1.y
              ? -1
              : a.value1.y == b.value1.y
              ? 0
              : 1;
          })
          .forEach(function (v, i) {
            diffData[i] = v.value1;
            accessData[i] = v.value2;
            cat[i] = v.value3;
          });
        cObj.xAxis[0].categories = cat;
        cObj.series.push({
          name: i18n.t("legend3", { m2: method2, m1: method1 }),
          type: "line",
          color: cData.color,
          data: diffData,
          lineWidth: 0,
          states: {
            hover: {
              lineWidthPlus: 0,
            },
          },
        });
        cObj.series.push({
          name: `${wastageFactor}% & -${i18n.t("legend4", {
            wastageFactor: wastageFactor,
          })}`,
          data: accessData,
          tooltip: {
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
        cObj.yAxis.plotLines = [
          {
            value: "0",
            color: "#f6f6f6",
            width: 2,
            zIndex: 5,
            dashStyle: "solid",
          },
        ];
        cObj.xAxis[0].max = diffData.length > 10 ? 10 : diffData.length - 1;

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
        cObj.yAxis.min = min > 0 ? 0 : min;
        cObj.yAxis.max = max;
      }

      if (
        data.length &&
        cData.chartCalculation === "DEFAULT" &&
        cData.type === "scatter"
      ) {
        cObj.series.push({
          name: `${method1} vs ${method2}`,
          color: cData.color,
          data: data,
        });

        const result = regression.linear(regressionData);
        let maxValue = Math.max(...regressionData.flat());
        let diagonalLine = {
          type: "line",
          name: i18n.t("legend1"),
          color: backgroundData?.idleTrendColor || "#f6f6f6",
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
          color: backgroundData?.linearTrendColor || "#f6f6f6",
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
    } else {
      if (cData.chartCalculation === "PERIOD_DIFF") {
        catArray.forEach((dx) => {
          let rData = {};
          response.data.rows.forEach((r) => {
            if (dx.dx.includes(r[dxIndex])) {
              if (!rData[r[peIndex]]) {
                rData[r[peIndex]] = {};
              }
              rData[r[peIndex]][r[ouIndex]] =
                Number(rData[r[peIndex]][r[ouIndex]] || 0) +
                Number(r[valueIndex]);
            }
          });
          let name = dx.name;
          let color = dx.color;
          let visible = dx.visible;

          obj = {
            name,
            visible,
            data: [],
            color: color ? color : getColor(),
          };
          ou.forEach((o) => {
            let currValue = rData[currentPeriod][o] || null;
            let prevValue = rData[prevPeriod][o] || null;
            obj.data.push({
              y: currValue - prevValue,
              locationID: o,
              originalY: currValue - prevValue,
              name: response.data.metaData.items[o].name || "NA",
              color: currValue - prevValue > 0 ? "#5ab276" : "#e8bb69", //y > 0 ? "#5BD282" : "#FE8081"
            });
          });
          cObj.series.push(obj);
        });
      } else if (
        ["STOCK_OUT", "AVAILABILITY"].includes(cData.chartCalculation)
      ) {
        let obj = {},
          name = null,
          color = null,
          visible = null;
        Object.keys(peFinalCount).forEach((d, j) => {
          Object.keys(peFinalCount[d]).forEach((m) => {
            let catData = catArray.find((c) => c.name == m);
            name = catData.name;
            color = catData.color;
            visible = catData.visible;
            obj = {
              name,
              visible,
              data: [],
              color: color ? color : getColor(),
            };
            let innerObj = {
              name: locationName,
              y:
                peFinalCount[d][name].denominator * 1 !== 0
                  ? (
                      (peFinalCount[d][m].numerator /
                        peFinalCount[d][m].denominator) *
                      100
                    ).toFixed(2) * 1
                  : null,
              color: catData.color,
            };
            let isFound = cObj.series.findIndex((s) => s.name === name);
            if (isFound >= 0) {
              cObj.series[isFound] = {
                ...cObj.series[isFound],
                data: cObj.series[isFound].data.concat(innerObj),
              };
            } else {
              obj.data.push(innerObj);
              cObj.series.push(obj);
            }
          });
        });
      } else if (
        ["OTHER_AVERAGE", "OTHER_AVERAGE_CYP"].includes(cData.chartCalculation)
      ) {
        catArray.forEach((dx) => {
          let rData = {};
          response.data.rows.forEach((r) => {
            if (dx.dx.includes(r[dxIndex])) {
              if (!rData[r[peIndex]]) {
                rData[r[peIndex]] = {};
              }
              rData[r[peIndex]][r[ouIndex]] =
                Number(rData[r[peIndex]][r[ouIndex]] || 0) +
                Number(r[valueIndex]) * dx.cyp[r[dxIndex]];
            }
          });
          let name = dx.name;
          let color = dx.color;
          let visible = dx.visible;

          obj = {
            name,
            visible,
            data: [],
            color: color ? color : getColor(),
          };
          ou.forEach((o) => {
            let currValue = rData[currentPeriod][o] || null;
            let prevValue = rData[prevPeriod][o] || null;
            obj.data.push({
              y: (currValue - prevValue) / 2,
              locationID: o,
              originalY: (currValue - prevValue) / 2,
              name: response.data.metaData.items[o].name || "NA",
            });
            // color: (currValue - prevValue) / 2 > 0 ? "#5ab276" : "#e8bb69", //y > 0 ? "#5BD282" : "#FE8081"
          });
          cObj.series.push(obj);
        });
      } else if (
        ["OTHER_MATRIX_TABLE", "OTHER_MATRIX_TABLE_CYP"].includes(
          cData.chartCalculation
        )
      ) {
        let rData = {},
          oMethodRef = {},
          oFinalData = {},
          aTotalCypCats = [];
        catArray.forEach((dx) => {
          response.data.rows.forEach((r) => {
            if (dx.dx.includes(r[dxIndex])) {
              if (!oFinalData[r[ouIndex]]) {
                oFinalData[r[ouIndex]] = {};
                aTotalCypCats.push(
                  response.data.metaData.items[r[ouIndex]].name
                );
              }
              if (!rData[r[dxIndex]]) {
                rData[r[dxIndex]] = {};
                oMethodRef[r[dxIndex]] = dx.name;
              }
              if (!rData[r[dxIndex]][r[ouIndex]]) {
                rData[r[dxIndex]][r[ouIndex]] = {};
              }
              rData[r[dxIndex]][r[ouIndex]][r[peIndex]] =
                Number(rData[r[dxIndex]][r[ouIndex]][r[peIndex]] || 0) +
                Number(r[valueIndex]) * dx.cyp[r[dxIndex]];
            }
          });
        });

        let oMethodFinalRegPeriod = {},
          aAvgTotalCyp = [],
          oAvgTotalCyp = {};
        for (let m in rData) {
          // data.metaData.items[r[ouIndex]].name
          // let sMethod = data.metaData.items[m].name;
          let sMethod = oMethodRef[m];
          if (!oMethodFinalRegPeriod[sMethod]) {
            oMethodFinalRegPeriod[sMethod] = {};
          }
          for (let n in rData[m]) {
            let sRegion = response.data.metaData.items[n].name;
            if (!oMethodFinalRegPeriod[sMethod][sRegion]) {
              oMethodFinalRegPeriod[sMethod][sRegion] = {};
            }
            /* for(let l in rData[m][n]){
                    let sMonth = data.metaData.items[l].name;
                    oMethodFinalRegPeriod[sMethod][sRegion][sMonth] = rData[m][n][l];
                } */

            pe.forEach((p, ind) => {
              let sMonth = translateDate({
                rawDate: p,
                periodType: periodType,
              });
              oMethodFinalRegPeriod[sMethod][sRegion][sMonth] =
                rData[m][n][p] || 0;
              aAvgTotalCyp[ind] =
                (aAvgTotalCyp[ind] || 0) +
                oMethodFinalRegPeriod[sMethod][sRegion][sMonth] * 1;
              if (!oAvgTotalCyp[sRegion]) {
                oAvgTotalCyp[sRegion] = {};
              }
              oAvgTotalCyp[sRegion][sMonth] =
                (oAvgTotalCyp[sRegion][sMonth] || 0) +
                oMethodFinalRegPeriod[sMethod][sRegion][sMonth] * 1;
            });
          }
        }
        cObj.categories = aTotalCypCats;
        cObj.avgAnnualGrowthData = oMethodFinalRegPeriod;
        cObj.avgTotalCypData = oAvgTotalCyp;
        cObj.methodSeq = catArray;
      } else if (
        cData.chartCalculation === "DEFAULT" &&
        cData.type === "scatter"
      ) {
        let rData = {};
        response.data.rows.forEach((r) => {
          if (!rData[r[ouIndex]]) {
            rData[r[ouIndex]] = {};
          }
          rData[r[ouIndex]][r[peIndex]] =
            Number(rData[r[ouIndex]][r[peIndex]] || 0) + Number(r[valueIndex]);
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
        let formattedPeriod = translateDate({
            rawDate: currentPeriod,
            periodType,
          }),
          pType = i18n.t("month");
        if (periodType === "monthly") {
          pType = i18n.t("month");
        } else if (periodType === "quarterly") {
          pType = i18n.t("quarter");
        } else if (periodType === "financialYear") {
          pType = i18n.t("financialYear");
        } else {
          pType = i18n.t("year");
        }
        let xLegend = i18n.t("legend6", {
          count: periodLength * 1 - 1,
          periodType: pType,
        });
        let chartXLegend = cData.xAxis.visible
          ? cData.xAxis.text
            ? cData.xAxis.text
            : xLegend
          : xLegend;
        let chartYLegend = cData.yAxis.visible
          ? cData.yAxis.text
            ? cData.yAxis.text
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
                  [chartYLegend]: yAxisData[x] * 1,
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
          if (childArr && childArr.length === 0) {
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
                    ? backgroundData?.outliersColor || cData.color
                    : cData.color,
                  outlier: outlier,
                });
                let itemObj = {
                  [i18n.t("location")]: name,
                };
                Object.keys(rData[y]).forEach((d) => {
                  if (d !== currentPeriod) {
                    let formattedPeriod = translateDate({
                      rawDate: d,
                      periodType,
                    });
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
            color: cData.color,
            data: data,
          });

          const result = regression.linear(regressionData);
          let maxValue = Math.max(...regressionData.flat());
          // maxValue = Math.round(maxValue / 1000) * 1000;
          let diagonalLine = {
            type: "line",
            name: i18n.t("legend1"),
            color: backgroundData?.idleTrendColor || "#f6f6f6",
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
            color: backgroundData?.qualityThresholdColor || "#f6f6f6",
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
            color: backgroundData?.qualityThresholdColor || "#f6f6f6",
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
            color: backgroundData?.linearTrendColor || "#f6f6f6",
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
      } else if (
        cData.chartCalculation === "DEFAULT" &&
        cData.type === "packedbubble"
      ) {
        let rData = {},
          oMethodRef = {},
          oFinalData = {},
          aTotalCypCats = [];
        catArray.forEach((dx) => {
          response.data.rows.forEach((r) => {
            if (dx.dx.includes(r[dxIndex])) {
              if (!oFinalData[r[ouIndex]]) {
                oFinalData[r[ouIndex]] = {};
                aTotalCypCats.push(
                  response.data.metaData.items[r[ouIndex]].name
                );
              }
              if (!rData[r[dxIndex]]) {
                rData[r[dxIndex]] = {};
                oMethodRef[r[dxIndex]] = dx.name;
              }
              rData[r[dxIndex]][r[ouIndex]] =
                Number(rData[r[dxIndex]][r[ouIndex]] || 0) +
                Number(r[valueIndex]) * dx.cyp[r[dxIndex]];
            }
          });
        });
        let oMethodCyp = {},
          oBubbleMethods = {},
          aRegCat = Object.keys(oFinalData);
        for (let l in rData) {
          let sName = oMethodRef[l];

          if (!oMethodCyp[sName]) {
            oMethodCyp[sName] = { name: sName, data: [], visible: false };
            oBubbleMethods[sName] = { name: sName, data: [] };
          }
          aRegCat.forEach((ele, ind) => {
            oMethodCyp[sName].data[ind] =
              (oMethodCyp[sName].data[ind] || 0) +
              (rData[l][ele] ? rData[l][ele] : 0);
            oMethodCyp[sName].data[ind] =
              oMethodCyp[sName].data[ind].toFixed(2) * 1;
            if (!oBubbleMethods[sName].data[ind]) {
              oBubbleMethods[sName].data[ind] = {
                name: response.data.metaData.items[ele].name,
                value: 0,
                id: ele,
              };
            }
            oBubbleMethods[sName].data[ind].value +=
              oMethodCyp[sName].data[ind];
            oBubbleMethods[sName].data[ind].value =
              oBubbleMethods[sName].data[ind].value.toFixed(2) * 1;
          });
        }
        let aBubbleSeries = [];
        const getMostUsedMethod = (p_obj, p_met, p_ind, p_val) => {
          let bFlag = false;
          for (let i in p_obj) {
            if (i === p_met) {
              continue;
            }
            bFlag = p_obj[i].data[p_ind].value > p_val;
            if (bFlag) break;
          }
          return bFlag ? 0 : p_val;
        };
        for (let t in oBubbleMethods) {
          let oTemp = { name: t, data: [] };
          aTotalCypCats.forEach((ele, ind) => {
            let oRow = Math.round(oBubbleMethods[t].data[ind].value);
            let nVal = getMostUsedMethod(oBubbleMethods, t, ind, oRow);
            nVal = Math.round(nVal);
            if (nVal) {
              oTemp.data.push({
                name: ele,
                value: nVal,
                id: oBubbleMethods[t].data[ind].id,
              });
            }
          });
          if (oTemp.data.length) {
            aBubbleSeries.push(oTemp);
          }
        }
        cObj.series = aBubbleSeries;
      } else {
        let pPadding = 0;
        catArray.forEach((dx, dxI) => {
          let rData = {};
          response.data.rows.forEach((r) => {
            if (dx.dx.includes(r[dxIndex]) && r[peIndex] === currentPeriod) {
              if (!rData[r[peIndex]]) {
                rData[r[peIndex]] = {};
              }
              rData[r[peIndex]][r[ouIndex]] =
                Number(rData[r[peIndex]][r[ouIndex]] || 0) +
                Number(r[valueIndex]) * dx.cyp[r[dxIndex]];
            }
          });
          if (isBenchmark) {
            benchmarkValue = rData[currentPeriod][location] || 0;
          }
          if (cData.type === "cluster_bar") {
            if (dxI === 0) {
              pPadding = 0;
            } else {
              pPadding = pPadding + 0.2;
            }
          }
          Object.keys(rData).forEach((d) => {
            let name = dx.name;
            let color = dx.color;
            let visible = dx.visible;

            obj = {
              name,
              visible,
              data: [],
              color: color ? color : getColor(),
            };
            if (cData.type === "cluster_bar") {
              obj.pointPadding = pPadding.toFixed(2);
            }
            ou.forEach((o) => {
              if (rData[d][o]) {
                obj.data.push({
                  locationID: o,
                  name: response.data.metaData.items[o].name || "NA",
                  y: (rData[d][o] * 1).toFixed(2) * 1,
                  originalY: (rData[d][o] * 1).toFixed(2) * 1,
                });
              } else {
                obj.data.push({
                  y: null,
                  locationID: o,
                  originalY: null,
                  name: response.data.metaData.items[o].name || "NA",
                });
              }
            });
            cObj.series.push(obj);
          });
        });
      }
    }
  }
  if (cData.chartCategory === "regionalTrend") {
    catArray.forEach((dx) => {
      let rData = {};
      response.data.rows.forEach((r) => {
        if (dx.dx.includes(r[dxIndex])) {
          if (!rData[r[ouIndex]]) {
            rData[r[ouIndex]] = {};
          }
          rData[r[ouIndex]][r[peIndex]] =
            Number(rData[r[ouIndex]][r[peIndex]] || 0) + Number(r[valueIndex]);
        }
      });
      let method = {
        name: dx.name,
        data: [],
      };
      Object.keys(rData).forEach((d) => {
        let name = response.data.metaData.items[d].name || null;

        obj = {
          name,
          visible: true,
          data: [],
          color: getColor(),
        };
        pe.forEach((p) => {
          let formCurrPeriod = translateDate({
            rawDate: p,
            periodType: periodType,
          });
          if (rData[d][p]) {
            obj.data.push({
              name: formCurrPeriod,
              pe: p,
              // y: (rData[d][p] * 1).toFixed(2) * 1,
              y: Math.round(rData[d][p]),
            });
          } else {
            obj.data.push({
              name: formCurrPeriod,
              pe: p,
              y: null,
            });
          }
        });
        if (!cData.chartDataSum) {
          method.data.push(obj);
        } else {
          cObj.series.push(obj);
        }
      });
      if (!cData.chartDataSum) {
        if (!cObj.methodSeries) {
          cObj.methodSeries = [];
        }
        cObj.methodSeries.push(method);
      }
    });
  }
  return { cObj, benchmarkValue, r2 };
};
