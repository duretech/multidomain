// import { translateDate } from "@/components/Common/commonFunctions";
const renameKeys = (obj) => {
  const keyValues = Object.keys(obj)
    .map((key) => {
      let newKey = null;
      if (key === "displayName") {
        newKey = "label";
      } else {
        newKey = key;
      }
      if (key === "children") {
        obj[key] = obj[key]
          .map((obj) => renameKeys(obj))
          .sort((a, b) => (a.label > b.label ? 1 : a.label < b.label ? -1 : 0));
      }
      return {
        [newKey]: obj[key],
      };
    })
    .sort((a, b) =>
      a.displayName > b.displayName ? 1 : a.displayName < b.displayName ? -1 : 0
    );
  return Object.assign({}, ...keyValues);
};

export default {
  dSourceGroupList: [
    {
      id: "[All metrics]",
      name: "[All metrics]",
      alias: "ALL",
    },
    {
      id: "Reporting rates",
      name: "Reporting rates",
      alias: "REPORTING_RATE",
    },
    {
      id: "Reporting rates on time",
      name: "Reporting rates on time",
      alias: "REPORTING_RATE_ON_TIME",
    },
    {
      id: "Actual reports",
      name: "Actual reports",
      alias: "ACTUAL_REPORTS",
    },
    {
      id: "Actual reporting rates on time",
      name: "Actual reporting rates on time",
      alias: "ACTUAL_REPORTS_ON_TIME",
    },
    {
      id: "Expected reports",
      name: "Expected reports",
      alias: "EXPECTED_REPORTS",
    },
  ],
  allData: {
    indicators: {
      dataSourceGroup: [],
      selectedSourceGroup: "",
      data: {
        list: [],
        pager: {
          page: 0,
          pageCount: 0,
        },
      },
    },
    dataElements: {
      dataSourceGroup: [],
      selectedSourceGroup: "",
      data: {
        list: [],
        pager: {
          page: 0,
          pageCount: 0,
        },
      },
    },
    dataSets: {
      dataSourceGroup: [],
      selectedSourceGroup: "",
      data: {
        list: [],
        pager: {
          page: 0,
          pageCount: 0,
        },
      },
    },
    eventDataItems: {
      dataSourceGroup: [],
      selectedSourceGroup: "",
      data: {
        list: [],
        pager: {
          page: 0,
          pageCount: 0,
        },
      },
    },
    programIndicators: {
      dataSourceGroup: [],
      selectedSourceGroup: "",
      data: {
        list: [],
        pager: {
          page: 0,
          pageCount: 0,
        },
      },
    },
  },
  periodList: {
    Monthly: [
      { id: "LAST_12_MONTHS", name: "Last 12 months" },
      { id: "THIS_MONTH", name: "This month" },
      { id: "LAST_MONTH", name: "Last month" },
      { id: "LAST_3_MONTHS", name: "Last 3 months" },
      { id: "LAST_6_MONTHS", name: "Last 6 months" },
      { id: "MONTHS_THIS_YEAR", name: "Months this year" },
    ],
    Daily: [
      { id: "TODAY", name: "Today" },
      { id: "YESTERDAY", name: "Yesterday" },
      { id: "LAST_3_DAYS", name: "Last 3 days" },
      { id: "LAST_7_DAYS", name: "Last 7 days" },
      { id: "LAST_14_DAYS", name: "Last 14 days" },
    ],
    Weekly: [
      { id: "THIS_WEEK", name: "This week" },
      { id: "LAST_WEEK", name: "Last week" },
      { id: "LAST_4_WEEKS", name: "Last 4 weeks" },
      { id: "LAST_12_WEEKS", name: "Last 12 weeks" },
      { id: "LAST_52_WEEKS", name: "Last 52 weeks" },
      { id: "WEEKS_THIS_YEAR", name: "Weeks this year" },
    ],
  },
  generateChart: (
    response,
    chartOptions,
    items,
    fields,
    chartType,
    series,
    xAxis,
    isDualAxes,
    dualAxesCategory,
    tableHeaders,
    drillDownObj,
    drillDownDX,
    isDrilldownAdded,
    facilityDimension,
    selectedPeriod,
    periodType,
  ) => {
    // console.log(series, xAxis);
    // console.log("response", response);
    // console.log("chartOptions", chartOptions);
    // console.log("items", items);
    // console.log("fields", fields);
    // console.log("chartType", chartType);
    // console.log("series", series);
    // console.log("xAxis", xAxis);
    // console.log("isDualAxes", isDualAxes);
    // console.log("dualAxesCategory", dualAxesCategory);
    // console.log("tableHeaders", tableHeaders);
    // console.log("drillDownObj", drillDownObj);
    // console.log("drillDownDX", drillDownDX);
    // console.log("isDrilldownAdded", isDrilldownAdded);
    let axisData =
      xAxis === "dx"
        ? response.data.metaData.dimensions.dx
        : xAxis === "pe"
        ? response.data.metaData.dimensions.pe
        : xAxis === "co"
        ? response.data.metaData.dimensions.co
        : facilityDimension && xAxis === facilityDimension.id
        ? response.data.metaData.dimensions[facilityDimension.id]
        : response.data.metaData.dimensions.ou;
    let secondatAxisData =
      dualAxesCategory === "dx"
        ? response.data.metaData.dimensions.dx
        : dualAxesCategory === "pe"
        ? response.data.metaData.dimensions.pe
        : dualAxesCategory === "co"
        ? response.data.metaData.dimensions.co
        : facilityDimension && dualAxesCategory === facilityDimension.id
        ? response.data.metaData.dimensions[facilityDimension.id]
        : response.data.metaData.dimensions.ou;
    let valueIndex = 0,
      rData = {},
      rDrilldownData = {},
      ser = 0,
      axis = 0,
      secondaryAxis = 0;
    // console.log("axisData", axisData)
    // console.log("secondatAxisData", secondatAxisData)
    // return
    response.data.headers.forEach((h, i) => {
      if (h.name === "value") {
        valueIndex = i;
      }

      if (h.name === series) {
        ser = i;
      }

      if (h.name === xAxis) {
        axis = i;
      }

      if (isDualAxes && h.name === dualAxesCategory) {
        secondaryAxis = i;
      }
    });

    let obj = {};
    if (chartType === "pie") {
      obj = {
        name: "",
        colorByPoint: true,
        data: [],
      };
    }

    if (isDualAxes) {
      // console.log("response",response)
      // console.log("isDualAxes",isDualAxes)

      // console.log(ser,axis)
      response.data.rows.forEach((r) => {
        if (!drillDownDX.includes(r[ser])) {
          if (Object.keys(rData).includes(r[ser])) {
            if (Object.keys(rData[r[ser]]).includes(r[axis])) {
              if (
                Object.keys(rData[r[ser]][r[axis]]).includes(r[secondaryAxis])
              ) {
                rData[r[ser]][r[axis]][r[secondaryAxis]] =
                  Number(rData[r[ser]][r[axis]][r[secondaryAxis]]) +
                  Number(r[valueIndex]);
              } else {
                rData[r[ser]][r[axis]][r[secondaryAxis]] = Number(
                  r[valueIndex]
                );
              }
            } else {
              rData[r[ser]][r[axis]] = {
                [r[secondaryAxis]]: Number(r[valueIndex]),
              };
            }
          } else {
            rData[r[ser]] = {
              [r[axis]]: { [r[secondaryAxis]]: Number(r[valueIndex]) },
            };
          }
        }
      });
      // console.log(response)
      // console.log("rData",rData)

      if (isDrilldownAdded && drillDownDX.length > 0) {
        response.data.rows.forEach((r) => {
          if (drillDownDX.includes(r[ser])) {
            if (Object.keys(rDrilldownData).includes(r[axis])) {
              if (Object.keys(rDrilldownData[r[axis]]).includes(r[ser])) {
                if (
                  Object.keys(rDrilldownData[r[axis]][r[ser]]).includes(
                    r[secondaryAxis]
                  )
                ) {
                  rDrilldownData[r[axis]][r[ser]][r[secondaryAxis]] =
                    Number(rDrilldownData[r[axis]][r[ser]][r[secondaryAxis]]) +
                    Number(r[valueIndex]);
                } else {
                  rDrilldownData[r[axis]][r[ser]][r[secondaryAxis]] = Number(
                    r[valueIndex]
                  );
                }
              } else {
                rDrilldownData[r[axis]][r[ser]] = {
                  [r[secondaryAxis]]: Number(r[valueIndex]),
                };
              }
            } else {
              rDrilldownData[r[axis]] = {
                [r[ser]]: { [r[secondaryAxis]]: Number(r[valueIndex]) },
              };
            }
          }
        });
      }

      // console.log("rDrilldownData",rDrilldownData)
      // console.log("drillDownObj",drillDownObj)

      Object.keys(rData).forEach((d, j) => {
        let name = null;
        Object.keys(response.data.metaData.items).forEach((k) => {
          if (d === k) {
            name = response.data.metaData.items[k].name;
          }
        });
        fields.push({ key: name, sortable: true });
        let color = "#" + ((Math.random() * 0xffffff) << 0).toString(16);
        secondatAxisData.forEach((s, i) => {
          let linkedToID = i === 0 ? "id" : "linkedTo";
          obj = {
            name,
            [linkedToID]: name,
            static_name: name,
            stack: response.data.metaData.items[s].name,
            data: [],
            color: color,
            showInEdit: i === 0 ? true : false,
          };
          axisData.forEach((p, j) => {
            let peValue =
              xAxis === "pe" ? p : dualAxesCategory === "pe" ? s : d;
            let ouValue =
              xAxis === "ou" ? p : dualAxesCategory === "ou" ? s : d;
            let dxValue =
              xAxis === "dx" ? p : dualAxesCategory === "dx" ? s : d;
            // console.log("drill",isDrilldownAdded && Object.keys(drillDownObj).includes(dxValue))
            // console.log("peValue",peValue)
            // console.log("ouValue",ouValue)
            // console.log("dxValue",dxValue)
            // console.log("cmbained",`${dxValue}_${ouValue}_${peValue}`)
            let drillID = `${dxValue}_${ouValue}_${peValue}`;
            let frmtData = response.data.metaData.items[p].name;
            if (xAxis === "pe") {
              let isFound = selectedPeriod.find((pe) => pe.id == p);
              if (isFound) {
                frmtData = isFound.text;
              }
              // else {
              //   frmtData = p;
              // }
            }
            if (Object.keys(rData[d]).includes(p)) {
              if (Object.keys(rData[d][p]).includes(s)) {
                obj.data.push({
                  name: frmtData,
                  y: rData[d][p][s] * 1,
                  pe: peValue,
                  ou: ouValue,
                  dx: dxValue,
                  drilldown:
                    isDrilldownAdded &&
                    Object.keys(drillDownObj).length > 0 &&
                    Object.keys(drillDownObj).includes(dxValue)
                      ? drillID
                      : false,
                });

                let axes1Name = tableHeaders[0].header;
                let axes1Value =
                  tableHeaders[0].id === xAxis
                    ? frmtData
                    : response.data.metaData.items[s].name;

                let axes2Name = tableHeaders[1].header;
                let axes2Value =
                  tableHeaders[1].id === xAxis
                    ? frmtData
                    : response.data.metaData.items[s].name;

                let itemIndex = items.findIndex(
                  (i) =>
                    i[axes1Name] === axes1Value && i[axes2Name] === axes2Value
                );

                if (itemIndex >= 0) {
                  items[itemIndex] = {
                    ...items[itemIndex],
                    [name]: rData[d][p][s] * 1,
                  };
                } else {
                  items.push({
                    [axes1Name]: axes1Value,
                    [axes2Name]: axes2Value,
                    [name]: rData[d][p][s] * 1,
                  });
                }
              } else {
                obj.data.push({
                  name: frmtData,
                  y: null,
                  pe: peValue,
                  ou: ouValue,
                  dx: dxValue,
                  drilldown:
                    isDrilldownAdded &&
                    Object.keys(drillDownObj).length > 0 &&
                    Object.keys(drillDownObj).includes(dxValue)
                      ? drillID
                      : false,
                });

                let axes1Name = tableHeaders[0].header;
                let axes1Value =
                  tableHeaders[0].id === xAxis
                    ? frmtData
                    : response.data.metaData.items[s].name;

                let axes2Name = tableHeaders[1].header;
                let axes2Value =
                  tableHeaders[1].id === xAxis
                    ? frmtData
                    : response.data.metaData.items[s].name;

                let itemIndex = items.findIndex(
                  (i) =>
                    i[axes1Name] === axes1Value && i[axes2Name] === axes2Value
                );

                if (itemIndex >= 0) {
                  items[itemIndex] = {
                    ...items[itemIndex],
                    [name]: "",
                  };
                } else {
                  items.push({
                    [axes1Name]: axes1Value,
                    [axes2Name]: axes2Value,
                    [name]: "",
                  });
                }
              }
            } else {
              obj.data.push({
                name: frmtData,
                y: null,
                pe:
                  xAxis === "pe"
                    ? p
                    : dualAxesCategory === "pe"
                    ? s
                    : response.data.metaData.dimensions.pe.join(";"),
                ou:
                  xAxis === "ou"
                    ? p
                    : dualAxesCategory === "ou"
                    ? s
                    : response.data.metaData.dimensions.ou.join(";"),
                drilldown:
                  isDrilldownAdded &&
                  Object.keys(drillDownObj).length > 0 &&
                  Object.keys(drillDownObj).includes(dxValue)
                    ? drillID
                    : false,
              });

              let axes1Name = tableHeaders[0].header;
              let axes1Value =
                tableHeaders[0].id === xAxis
                  ? frmtData
                  : response.data.metaData.items[s].name;

              let axes2Name = tableHeaders[1].header;
              let axes2Value =
                tableHeaders[1].id === xAxis
                  ? frmtData
                  : response.data.metaData.items[s].name;

              let itemIndex = items.findIndex(
                (i) =>
                  i[axes1Name] === axes1Value && i[axes2Name] === axes2Value
              );

              if (itemIndex >= 0) {
                items[itemIndex] = {
                  ...items[itemIndex],
                  [name]: "",
                };
              } else {
                items.push({
                  [axes1Name]: axes1Value,
                  [axes2Name]: axes2Value,
                  [name]: "",
                });
              }
            }
            if (
              isDrilldownAdded &&
              Object.keys(drillDownObj).length > 0 &&
              Object.keys(drillDownObj).includes(dxValue)
            ) {
              let drillObj = {
                name: `${name} (${frmtData}) (${response.data.metaData.items[s].name})`,
                id: drillID,
                stack: response.data.metaData.items[s].name,
                type: "column",
                data: [],
              };
              if (Object.keys(rDrilldownData).includes(p)) {
                Object.keys(rDrilldownData[p]).forEach((k, i) => {
                  if (
                    drillDownObj[d].includes(k) &&
                    Object.keys(rDrilldownData[p][k]).includes(s)
                  ) {
                    drillObj.data.push({
                      name: response.data.metaData.items[k].name,
                      y: rDrilldownData[p][k][s] * 1,
                    });
                  }
                });
                chartOptions.drilldown.series.push(drillObj);
              }
            }
          });
          chartOptions.series.push(obj);
        });
      });
    } else {
      // console.log(ser,axis)
      response.data.rows.forEach((r) => {
        if (!drillDownDX.includes(r[ser])) {
          if (Object.keys(rData).includes(r[ser])) {
            rData[r[ser]][r[axis]] = r[valueIndex];
          } else {
            rData[r[ser]] = {
              [r[axis]]: r[valueIndex],
            };
          }
        }
      });
      // console.log(response)
      // console.log("rData", rData);

      if (isDrilldownAdded && drillDownDX.length > 0) {
        response.data.rows.forEach((r) => {
          if (drillDownDX.includes(r[ser])) {
            if (Object.keys(rDrilldownData).includes(r[axis])) {
              rDrilldownData[r[axis]][r[ser]] = r[valueIndex];
            } else {
              rDrilldownData[r[axis]] = {
                [r[ser]]: r[valueIndex],
              };
            }
          }
        });
      }

      // console.log("rDrilldownData",rDrilldownData)
      // return

      Object.keys(rData).forEach((d, j) => {
        let name = null;
        Object.keys(response.data.metaData.items).forEach((k) => {
          if (d === k) {
            name = response.data.metaData.items[k].name;
          }
        });

        if (chartType !== "pie") {
          obj = {
            name,
            static_name: name,
            data: [],
            color: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
            showInEdit: true,
          };
        }
        if (chartType !== "pie") {
          fields.push({ key: name, sortable: true });
          axisData.forEach((p, i) => {
            let peValue =
              xAxis === "pe"
                ? p
                : series === "pe"
                ? d
                : response.data.metaData.dimensions.pe.join(";");
            let ouValue =
              xAxis === "ou"
                ? p
                : series === "ou"
                ? d
                : response.data.metaData.dimensions.ou.join(";");
            let dxValue =
              xAxis === "dx"
                ? p
                : series === "dx"
                ? d
                : response.data.metaData.dimensions.dx.join(";");
            // console.log("drill",isDrilldownAdded && Object.keys(drillDownObj).includes(dxValue))
            // console.log("peValue",peValue)
            // console.log("ouValue",ouValue)
            // console.log("dxValue",dxValue)
            // console.log("cmbained",`${dxValue}_${ouValue}_${peValue}`)
            let drillID = `${dxValue}_${ouValue}_${peValue}`;
            let frmtData = response.data.metaData.items[p].name;
            if (xAxis === "pe") {
                            let isFound = selectedPeriod.find((pe) => pe.id == p);
              if (isFound) {
                frmtData = isFound.text;
              }
              // else {
              //   frmtData = p;
              // }
            }
            if (Object.keys(rData[d]).includes(p)) {
              obj.data.push({
                name: frmtData,
                y: rData[d][p] * 1,
                pe: peValue,
                ou: ouValue,
                dx: dxValue,
                drilldown:
                  isDrilldownAdded &&
                  Object.keys(drillDownObj).length > 0 &&
                  Object.keys(drillDownObj).includes(dxValue)
                    ? drillID
                    : false,
              });
              items[i] = {
                ...items[i],
                [tableHeaders[0].header]: frmtData,
                [name]: rData[d][p] * 1,
              };
            } else {
              obj.data.push({
                name: frmtData,
                y: null,
                pe: peValue,
                ou: ouValue,
                dx: dxValue,
                drilldown:
                  isDrilldownAdded &&
                  Object.keys(drillDownObj).length > 0 &&
                  Object.keys(drillDownObj).includes(dxValue)
                    ? drillID
                    : false,
              });
              items[i] = {
                ...items[i],
                [tableHeaders[0].header]: frmtData,
                [name]: "",
              };
            }

            if (
              isDrilldownAdded &&
              Object.keys(drillDownObj).length > 0 &&
              Object.keys(drillDownObj).includes(dxValue)
            ) {
              let drillObj = {
                name: `${name} (${frmtData})`,
                id: drillID,
                type: "column",
                data: [],
              };
              if (Object.keys(rDrilldownData).includes(p)) {
                Object.keys(rDrilldownData[p]).forEach((k, i) => {
                  if (drillDownObj[d].includes(k)) {
                    drillObj.data.push({
                      name: response.data.metaData.items[k].name,
                      y: rDrilldownData[p][k] * 1,
                    });
                  }
                });
                chartOptions.drilldown.series.push(drillObj);
              }
            }
          });
                    chartOptions.series.push(obj);
        } else {
          let t = 0;
          Object.keys(rData[d]).forEach((p) => {
            t += rData[d][p] * 1;
          });
          items.push({
            [tableHeaders[0].header]: name,
            [tableHeaders[1].header]: t,
          });
          obj.data.push({
            name,
            y: t * 1,
            drilldown: false,
          });
        }
      });
      if (chartType === "pie") {
        chartOptions.series.push(obj);
      }
    }
    // console.log("chartOptions", chartOptions);

    return {
      items,
      fields,
      chartOptions,
    };
  },
  generateChartOld: (response, chartOptions, items, fields, chartType) => {
    let pe = response.data.metaData.dimensions.pe;
    if (chartType !== "pie") {
      pe.forEach((p) => {
        Object.keys(response.data.metaData.items).forEach((k) => {
          if (p === k) {
            //chartOptions.xAxis.categories.push(response.data.metaData.items[k].name)
            items.push({
              "Period / Data": response.data.metaData.items[k].name,
            });
          }
        });
      });
    }

    let valueIndex = 0,
      dxIndex = 0,
      peIndex = 0;
    response.data.headers.forEach((h, i) => {
      if (h.name === "value") {
        valueIndex = i;
      }
      if (h.name === "dx") {
        dxIndex = i;
      }

      if (h.name === "pe") {
        peIndex = i;
      }
    });

    let rData = {};
    response.data.rows.forEach((r) => {
      if (Object.keys(rData).includes(r[dxIndex])) {
        rData[r[dxIndex]][r[peIndex]] = r[valueIndex];
      } else {
        rData[r[dxIndex]] = {
          [r[peIndex]]: r[valueIndex],
        };
      }
    });
    // console.log(response)
    // console.log("rData",rData)
    let obj = {};
    if (chartType === "pie") {
      obj = {
        name: "",
        colorByPoint: true,
        data: [],
      };
    }

    Object.keys(rData).forEach((d, j) => {
      let name = null;
      Object.keys(response.data.metaData.items).forEach((k) => {
        if (d === k) {
          name = response.data.metaData.items[k].name;
        }
      });

      fields.push({ key: name, sortable: true });
      if (chartType !== "pie") {
        obj = {
          name,
          static_name: name,
          data: [],
          color: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
        };
      }
      if (chartType !== "pie") {
        pe.forEach((p, i) => {
          if (Object.keys(rData[d]).includes(p)) {
            obj.data.push({
              name: response.data.metaData.items[p].name,
              pe: p,
              org: response.data.metaData.dimensions.ou,
              y: rData[d][p] * 1,
              drilldown: false,
            });
            items[i] = {
              ...items[i],
              [name]: rData[d][p] * 1,
            };
          } else {
            obj.data.push({
              name: response.data.metaData.items[p].name,
              pe: p,
              org: response.data.metaData.dimensions.ou,
              y: null,
              drilldown: false,
            });
            items[i] = {
              ...items[i],
              [name]: "",
            };
          }
        });
        chartOptions.series.push(obj);
      } else {
        let t = 0;
        Object.keys(rData[d]).forEach((p) => {
          t += rData[d][p] * 1;
        });
        obj.data.push({
          name,
          y: t * 1,
          drilldown: false,
        });
      }
    });
    if (chartType === "pie") {
      chartOptions.series.push(obj);
    }
    // console.log("chartOptions",chartOptions)
    return {
      items,
      fields,
      chartOptions,
    };
  },
  renameKeys: (obj) => renameKeys(obj),
  sortData: (sort, chartOptions) => {
    let aData = [],
      aCats = chartOptions.xAxis.categories,
      i,
      aSeries = chartOptions.series,
      nLen = aSeries.length,
      aFinalData = [];

    for (i = 0; i < nLen; i++) {
      let nCats = aCats.length,
        j,
        aData = aSeries[i].data;
      let aTemp = [];
      for (j = 0; j < nCats; j++) {
        let sPlace = aCats[j],
          nVal = aData[j] ? aData[j] : 0;
        aTemp.push([sPlace, nVal]);
      }
      aFinalData.push(aTemp);
    }
    let nArrLen = aFinalData.length,
      k;
    for (k = 0; k < nArrLen; k++) {
      if (sort == "0-1") {
        aFinalData[k] = aFinalData[k].sort((a, b) => {
          return a[1] - b[1];
        });
      } else if (sort == "1-0") {
        aFinalData[k] = aFinalData[k].sort((a, b) => {
          return b[1] - a[1];
        });
      } else if (sort == "A-Z") {
        aFinalData[k] = aFinalData[k].sort((a, b) => {
          if (a[0][0] < b[0][0]) {
            return -1;
          }
          if (a[0][0] > b[0][0]) {
            return 1;
          }
          return 0;
        });
      } else if (sort == "Z-A") {
        aFinalData[k] = aFinalData[k].sort((a, b) => {
          if (b[0][0] < a[0][0]) {
            return -1;
          }
          if (b[0][0] > a[0][0]) {
            return 1;
          }
          return 0;
        });
      }
    }

    let nFinalLen = aFinalData.length,
      j,
      bFlag = true,
      aCategories = [],
      aSeriesData = [];
    for (j = 0; j < nFinalLen; j++) {
      let k,
        nkLen = aFinalData[j].length,
        aTemp = [];
      for (k = 0; k < nkLen; k++) {
        if (bFlag) {
          aCategories.push(aFinalData[j][k][0]);
        }
        aTemp.push(aFinalData[j][k][1]);
      }
      bFlag = false;
      aSeriesData.push(aTemp);
    }
    return { aCategories, aSeriesData };
  },
};
