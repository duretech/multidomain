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
      Q4: ["oct.", "déc."],
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

export const getChild = ({ locationList, location }) => {
  return locationList.filter((l) => l.parent && l.parent.id === location);
};
export const getParent = ({ locationList, location, isFlat = false }) => {
  let p = null,
    pIn = null;
  if (isFlat) {
    pIn = locationList.find((l) => l.id.includes(location));
  } else {
    let flatLocations = service.flattenLocationList(locationList);
    pIn = flatLocations.find((l) => l.id.includes(location));
  }
  if (pIn && pIn.parent && Object.keys(pIn.parent).length) {
    p = pIn.parent;
  }
  return p;
};
export const getOrg = ({ locationList, location, isFlat = false }) => {
  let org = null;
  if (isFlat) {
    org = locationList.find((l) => l.id.includes(location));
  } else {
    let flatLocations = service.flattenLocationList(locationList);
    org = flatLocations.find((l) => l.id.includes(location));
  }
  if (org) {
    org = org.label;
  }
  return org;
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
        years = ["janv.", "déc."];
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
          Q4: ["oct.", "déc."],
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

export const excludeName = (str) => {
  let appSet = store.getters.getAppSettings;
  if (appSet?.exLocNames?.length) {
    appSet.exLocNames.sort((a, b) => b.level - a.level);
    appSet.exLocNames.forEach((l) => {
      let lastIndex = str.lastIndexOf(l.text);
      if (lastIndex >= 0) {
        str = str.substring(0, lastIndex).trim();
      }
    });
  }
  return str;
};

export const pTypeList = ({ id = "id", label = "label" }) => {
  let pType = [
    { [id]: "monthly", [label]: i18n.t("monthly") },
    { [id]: "quarterly", [label]: i18n.t("quarterly") },
    { [id]: "yearly", [label]: i18n.t("yearly") },
  ];
  if (store.state.financialYear.includes("July")) {
    pType.push({
      [id]: "financialYearJuly",
      [label]: i18n.t("financialYearJuly"),
    });
  }
  if (store.state.financialYear.includes("April")) {
    pType.push({
      [id]: "financialYear",
      [label]: i18n.t("financialYear"),
    });
  }
  return pType;
};

export const generateException = ({
  response,
  ou,
  m1,
  m1Obj,
  m2,
  m2Obj,
  currentPeriod = null,
}) => {
  let exceptionTable = [];
  let xException = Object.keys(m1Obj).filter(
    (val) => !Object.keys(m2Obj).includes(val)
  );
  let yException = Object.keys(m2Obj).filter(
    (val) => !Object.keys(m1Obj).includes(val)
  );

  let sameRegions = Object.keys(m1Obj).filter((val) =>
    Object.keys(m2Obj).includes(val)
  );
  let noDataRegions = ou.filter((val) => !sameRegions.includes(val));

  noDataRegions.forEach((val) => {
    let name = null;
    if (response.data.metaData.items[val]) {
      name = excludeName(response.data.metaData.items[val].name);
    }
    if (xException.includes(val)) {
      Object.keys(m1Obj).forEach((x) => {
        if (x === val) {
          exceptionTable.push({
            [i18n.t("location")]: name,
            [m2]: "",
            [m1]: currentPeriod ? m1Obj[x][currentPeriod] * 1 : m1Obj[x] * 1,
          });
        }
      });
    } else if (yException.includes(val)) {
      Object.keys(m2Obj).forEach((x) => {
        if (x === val) {
          exceptionTable.push({
            [i18n.t("location")]: name,
            [m2]: currentPeriod ? m2Obj[x][currentPeriod] * 1 : m2Obj[x] * 1,
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
  return exceptionTable;
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
    [
      "PERIOD_DIFF",
      "PERIOD_DIFF_CYP",
      "OTHER_MATRIX_TABLE",
      "OTHER_MATRIX_TABLE_CYP",
    ].includes(cData.chartCalculation) || cData.isHigherLoc
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
          numKey = "F";
          denKey = "T";
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
            : excludeName(response.data.metaData.items[location].name);
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
              : excludeName(response.data.metaData.items[location].name);
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
                cData.drillCalculation === "PERIOD_DIFF" && i !== 0
                  ? `${name} ( ${formCurrPeriod} - ${formPrevPeriod} )`
                  : `${name} ( ${formCurrPeriod} )`;
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
              let name =
                excludeName(response.data.metaData.items[d].name) || null;

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
                      ? cData.cngPtPos || "#5BD282"
                      : cData.cngPtNeg || "#FE8081";
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
        cat = [],
        regressionData = [],
        natData = [];

      Object.keys(sData[method1]).forEach((x) => {
        let name = excludeName(response.data.metaData.items[x].name) || "";
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
            }
          });
        }
        if (x === locID) {
          Object.keys(sData[method2]).forEach((y) => {
            if (x === y) {
              natData.push({
                name,
                x: sData[method1][x][currentPeriod] * 1,
                y: sData[method2][y][currentPeriod] * 1,
              });
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
              ? 1
              : a.value1.y == b.value1.y
              ? 0
              : -1;
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
          isHighLow: true, //used for table creation
          lText: `${i18n.t("legend4", {
            wastageFactor: wastageFactor,
          })}`, //used for table creation
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
            color: "#2caffe",
            width: 2,
            zIndex: 5,
            dashStyle: "solid",
          },
        ];
      }

      if (
        data.length &&
        cData.chartCalculation === "DEFAULT" &&
        cData.type === "scatter"
      ) {
        exceptionTable = generateException({
          response,
          ou,
          m1: method1,
          m1Obj: sData[method1],
          m2: method2,
          m2Obj: sData[method2],
          currentPeriod,
        });
        cObj.series.push({
          name: `${method1} ${i18n.t("vs")} ${method2}`,
          xMethod: method1,
          yMethod: method2,
          color: cData.color,
          data: data,
        });

        const result = regression.linear(regressionData);
        let maxValue = Math.max(...regressionData.flat());
        let diagonalLine = {
          type: "line",
          name: i18n.t("legend1"),
          color: backgroundData?.idleTrendColor || "#e8edf2",
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
          isBenchmark: true,
          enableMouseTracking: false,
          // showInLegend: false
        };
        cObj.xAxis.max = maxValue;
        cObj.yAxis.max = maxValue;
        cObj.series.push(diagonalLine);

        let regressionLine = {
          type: "line",
          name: i18n.t("legend2"),
          color: backgroundData?.linearTrendColor || "#e8edf2",
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
          isBenchmark: true,
          enableMouseTracking: false,
        };
        cObj.series.push(regressionLine);
        r2 = result.r2 ? result.r2 : 0;
        cObj.natData = natData;
      }
    } else {
      if (["PERIOD_DIFF", "PERIOD_DIFF_CYP"].includes(cData.chartCalculation)) {
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
            let currValue = rData?.[currentPeriod]?.[o] || null;
            let prevValue = rData?.[prevPeriod]?.[o] || null;
            let y = currValue - prevValue;
            y = y ? y.toFixed(2) * 1 : null;
            obj.data.push({
              y: y,
              locationID: o,
              originalY: y,
              name: excludeName(response.data.metaData.items[o].name) || "NA",
              color:
                y > 0
                  ? cData.cngPtPos || "#5ab276"
                  : cData.cngPtNeg || "#e8bb69",
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
        Object.keys(peFinalCount).forEach((d) => {
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
            let currValue = rData?.[currentPeriod]?.[o] || null;
            let prevValue = rData?.[prevPeriod]?.[o] || null;
            let y = (currValue - prevValue) / 2;
            y = y ? y.toFixed(2) * 1 : null;
            obj.data.push({
              y: y,
              locationID: o,
              originalY: y,
              name: excludeName(response.data.metaData.items[o].name) || "NA",
            });
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
                  excludeName(response.data.metaData.items[r[ouIndex]].name)
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
            let sRegion = excludeName(response.data.metaData.items[n].name);
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
        let oUpdated = ou.map((o) =>
          excludeName(response.data.metaData.items[o].name)
        );
        oUpdated = oUpdated.filter((item) => item !== locationName);
        oUpdated.unshift(locationName);
        cObj.categories = oUpdated;
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
        let chartXLegend =
          cData.xAxis.visible && cData.xAxis?.text?.[i18n.locale]
            ? cData.xAxis.text[i18n.locale]
            : xLegend;
        let chartYLegend =
          cData.yAxis.visible && cData.yAxis?.text?.[i18n.locale]
            ? cData.yAxis.text[i18n.locale]
            : formattedPeriod;
        exceptionTable = generateException({
          response,
          ou,
          m1: chartXLegend,
          m1Obj: xAxisData,
          m2: chartYLegend,
          m2Obj: yAxisData,
        });
        let highX = 0,
          highY = 0,
          lowX = 0,
          lowY = 0;

        let data = [],
          regressionData = [],
          xArr = [],
          natData = [];

        Object.keys(xAxisData).forEach((x) => {
          let locID = location;
          let name = excludeName(response.data.metaData.items[x].name) || "";
          if (childArr && childArr.length === 0) {
            locID = "";
          }
          if (x !== locID) {
            xArr.push(xAxisData[x]);

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
              }
            });
          }
          if (x === locID) {
            Object.keys(yAxisData).forEach((y) => {
              if (x === y) {
                natData.push({
                  name,
                  x: xAxisData[x] * 1,
                  y: yAxisData[y] * 1,
                });
              }
            });
          }
        });

        let max = Math.max(...xArr);
        highX = lowY = max;
        highY = lowX = (1 + qualityThreshold) * highX;
        if (data.length) {
          cObj.series.push({
            name: `${chartXLegend} ${i18n.t("vs")} ${chartYLegend}`,
            xMethod: chartXLegend,
            yMethod: chartYLegend,
            color: cData.color,
            data: data,
          });

          const result = regression.linear(regressionData);
          let maxValue = Math.max(...regressionData.flat());
          let diagonalLine = {
            type: "line",
            name: i18n.t("legend1"),
            color: backgroundData?.idleTrendColor || "#e8edf2",
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
            isBenchmark: true,
            enableMouseTracking: false,
            // showInLegend: false
          };
          let qualityThresholdHigh = {
            type: "line",
            name: "Quality Threshold High",
            color: backgroundData?.qualityThresholdColor || "#e8edf2",
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
            isBenchmark: true,
            enableMouseTracking: false,
            showInLegend: false,
          };
          let qualityThresholdLow = {
            type: "line",
            name: "Quality Threshold Low",
            color: backgroundData?.qualityThresholdColor || "#e8edf2",
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
            isBenchmark: true,
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
            color: backgroundData?.linearTrendColor || "#e8edf2",
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
            isBenchmark: true,
            enableMouseTracking: false,
          };
          cObj.series.push(regressionLine);
          r2 = result.r2 ? result.r2 : 0;
          cObj.natData = natData;
        }
      } else if (
        ["CYP", "DEFAULT"].includes(cData.chartCalculation) &&
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
                  excludeName(response.data.metaData.items[r[ouIndex]].name)
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
                name: excludeName(response.data.metaData.items[ele].name),
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
          let color = null,
            cFound = catArray.find((c) => c.name === t);
          if (cFound) {
            color = cFound.color;
          }
          let oTemp = { name: t, data: [], color };
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
          Object.keys(rData).forEach((d, i) => {
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
                  name:
                    excludeName(response.data.metaData.items[o].name) || "NA",
                  y: (rData[d][o] * 1).toFixed(2) * 1,
                  originalY: (rData[d][o] * 1).toFixed(2) * 1,
                });
              } else {
                obj.data.push({
                  y: null,
                  locationID: o,
                  originalY: null,
                  name:
                    excludeName(response.data.metaData.items[o].name) || "NA",
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
      let rows = response.data.rows.sort(
        (a, b) => ou.indexOf(a[ouIndex]) - ou.indexOf(b[ouIndex])
      );
      rows.forEach((r) => {
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
      Object.keys(rData).forEach((d, i) => {
        let name = excludeName(response.data.metaData.items[d].name) || null;

        obj = {
          name,
          visible: i < 5,
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
  return { cObj, benchmarkValue, r2, exceptionTable };
};
