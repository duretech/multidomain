import i18n from "@/i18n.js";
export default {
  calculateAvgMethodMix: (
    { avgAnnualGrowthData, avgTotalCypData, categories },
    p_period,
    p_months,
    p_flag,
    locale,
    totalCYPText,
    methodTableHeaderName,
    methodSeq,
    periodType,
    moment
  ) => {
    // console.log(avgAnnualGrowthData,avgTotalCypData,moment(p_period, 'YYYYMM').subtract(12, 'months').format('MMM YYYY'));
    // console.log(avgAnnualGrowthData,avgTotalCypData,categories,p_period,p_months,p_flag, locale, totalCYPText,methodTableHeaderName, methodSeq, periodType)
    let aSeries = [],
      aTable = [],
      aMethodCats = [],
      sPrevPer = null,
      sNextPer = null;
    let quarters = {
        Q1: ["Jan", "Mar"],
        Q2: ["Apr", "Jun"],
        Q3: ["Jul", "Sep"],
        Q4: ["Oct", "Dec"],
      },
      years = ["Mar", "Apr"],
      yearsJuly = ["Jun", "Jul"];
    if (locale === "fr") {
      quarters = {
        Q1: ["janv.", "mars"],
        Q2: ["avril", "juin"],
        Q3: ["juil.", "sept."],
        Q4: ["oct.", "déc."],
      };
      (years = ["mars", "avril"]), (yearsJuly = ["juin", "juil."]);
    }
    if (periodType === "monthly") {
      sPrevPer = moment(p_period, "YYYYMM").format("MMM YYYY");
      sNextPer = moment(p_period, "YYYYMM")
        .subtract(p_months, "months")
        .format("MMM YYYY");
    }
    if (periodType === "yearly") {
      sPrevPer = moment(p_period, "YYYY").format("YYYY");
      sNextPer = moment(p_period, "YYYY")
        .subtract(p_months, "year")
        .format("YYYY");
    }
    if (periodType === "financialYear") {
      // sPrevPer = `${p_period}April`
      // sNextPer = `${p_period*1-1}April`;
      let q1 = p_period.split("April");
      sPrevPer = `${years[1]} ${q1[0]} ${i18n.t("toSmall")} ${years[0]} ${
        q1[0] * 1 + 1
      }`;
      sNextPer = `${years[1]} ${q1[0] * 1 - 1} ${i18n.t("toSmall")} ${
        years[0]
      } ${q1[0]}`;
    }
    // console.log("p_period", p_period)
    if (periodType === "financialYearJuly") {
      let q1 = p_period.split("July");
      // sPrevPer = `${p}July`
      // sNextPer = `${p*1-1}July`;
      sPrevPer = `${yearsJuly[1]} ${q1[0]} ${i18n.t("toSmall")} ${
        yearsJuly[0]
      } ${q1[0] * 1 + 1}`;
      sNextPer = `${yearsJuly[1]} ${q1[0] * 1 - 1} ${i18n.t("toSmall")} ${
        yearsJuly[0]
      } ${q1[0]}`;
    }
    if (periodType === "quarterly") {
      sPrevPer = p_period;
      sNextPer = moment(p_period, "YYYY[Q]Q")
        .subtract(p_months, "Q")
        .format("YYYY[Q]Q");
    }
    // console.log("sPrevPer",sPrevPer)
    // console.log("sNextPer",sNextPer)
    //console.log("aSeries",aSeries)
    for (let i in avgAnnualGrowthData) {
      let oTemp = { name: i, data: [], visible: false },
        oRow = { [methodTableHeaderName]: i };
      aMethodCats.push(i);
      // console.log("avgAnnualGrowthData[i]",avgAnnualGrowthData[i])
      categories.forEach((ele, ind) => {
        let nInt = 0;
        if (avgAnnualGrowthData[i][ele]) {
          // console.log("ele",ele)
          // console.log("avgAnnualGrowthData[i][ele]",avgAnnualGrowthData[i][ele])
          if (p_flag) {
            nInt =
              (
                ((avgAnnualGrowthData[i][ele][sNextPer] || 0) -
                  (avgAnnualGrowthData[i][ele][sPrevPer] || 0)) /
                12
              ).toFixed(2) * 1;
          } else {
            // console.log("avgAnnualGrowthData[i][ele][sNextPer]", avgAnnualGrowthData[i][ele][sNextPer])
            // console.log("avgAnnualGrowthData[i][ele][sPrevPer]", avgAnnualGrowthData[i][ele][sPrevPer])
            nInt =
              (
                ((avgAnnualGrowthData[i][ele][sNextPer] || 0) -
                  (avgAnnualGrowthData[i][ele][sPrevPer] || 0)) /
                (avgAnnualGrowthData[i][ele][sPrevPer] || 1)
              ).toFixed(2) * 1;
          }
        }

        oTemp.data[ind] = nInt;
        oRow[ele] = nInt;
      });
      aSeries.push(oTemp);
      aTable.push(oRow);
    }

    if (p_flag) {
      let oCypBar = { name: totalCYPText, data: [], visible: true },
        oTableRow = { [methodTableHeaderName]: totalCYPText };
      categories.forEach((ele) => {
        let nInt =
          (
            ((avgTotalCypData[ele][sNextPer] || 0) -
              (avgTotalCypData[ele][sPrevPer] || 0)) /
            12
          ).toFixed(1) * 1;
        oCypBar.data.push(nInt);
        oTableRow[ele] = nInt;
      });
      aSeries.unshift(oCypBar);
      aTable.unshift(oTableRow);
    }
    let compData = [],
      existArray = [],
      newCats = [];
    if (aSeries && methodSeq) {
      aSeries.forEach((m, i) => {
        if (existArray.includes(m["name"]) == false) {
          existArray.push(m["name"]);
          methodSeq.forEach((v, i) => {
            if (m["name"] == v.name) {
              compData[i] = m;
              newCats[i] = m["name"];
            }
          });
        } else {
          aSeries.splice(i, 1);
        }

        if (m["name"] == totalCYPText) {
          compData.push(m);
        }
      });
    }
    compData = compData.filter(function (el) {
      return el != null && el != "";
    });
    newCats = newCats.filter(function (el) {
      return el != null && el != "";
    });

    // console.log("aSeries", aSeries)
    // console.log("aTable", aTable)
    // console.log("newCats", newCats)
    // console.log("compData", compData)
    return {
      series: aSeries,
      table: aTable,
      methods: newCats,
      data: compData,
    };
  },
  calculateAvgEMUMethodMix: (
    { categories, avgAnnualGrowthData },
    p_period,
    p_months,
    methodTableHeaderName,
    periodType,
    locale,
    moment
  ) => {
    let aSeries = [],
      aTable = [],
      aMethodCats = [],
      sPrevPer = null,
      sNextPer = null;
    let quarters = {
        Q1: ["Jan", "Mar"],
        Q2: ["Apr", "Jun"],
        Q3: ["Jul", "Sep"],
        Q4: ["Oct", "Dec"],
      },
      years = ["Mar", "Apr"],
      yearsJuly = ["Jun", "Jul"];
    if (locale === "fr") {
      quarters = {
        Q1: ["janv.", "mars"],
        Q2: ["avril", "juin"],
        Q3: ["juil.", "sept."],
        Q4: ["oct.", "déc."],
      };
      (years = ["mars", "avril"]), (yearsJuly = ["juin", "juil."]);
    }
    if (periodType === "monthly") {
      sPrevPer = moment(p_period, "MMM YYYY").format("MMM YYYY");
      sNextPer = moment(p_period, "MMM YYYY")
        .subtract(p_months, "months")
        .format("MMM YYYY");
    }
    if (periodType === "yearly") {
      sPrevPer = moment(p_period, "YYYY").format("YYYY");
      sNextPer = moment(p_period, "YYYY")
        .subtract(p_months, "year")
        .format("YYYY");
    }
    if (periodType === "financialYear") {
      // sPrevPer = `${p_period}April`
      // sNextPer = `${p_period*1-1}April`;
      let q1 = p_period.split("April");
      sPrevPer = `${years[1]} ${q1[0]} ${i18n.t("toSmall")} ${years[0]} ${
        q1[0] * 1 + 1
      }`;
      sNextPer = `${years[1]} ${q1[0] * 1 - 1} ${i18n.t("toSmall")} ${
        years[0]
      } ${q1[0]}`;
    }
    // console.log("p_period", p_period)
    if (periodType === "financialYearJuly") {
      let q1 = p_period.split("July");
      // sPrevPer = `${p}July`
      // sNextPer = `${p*1-1}July`;
      sPrevPer = `${yearsJuly[1]} ${q1[0]} ${i18n.t("toSmall")} ${
        yearsJuly[0]
      } ${q1[0] * 1 + 1}`;
      sNextPer = `${yearsJuly[1]} ${q1[0] * 1 - 1} ${i18n.t("toSmall")} ${
        yearsJuly[0]
      } ${q1[0]}`;
    }
    if (periodType === "quarterly") {
      sPrevPer = p_period;
      sNextPer = moment(p_period, "YYYY[Q]Q")
        .subtract(p_months, "Q")
        .format("YYYY[Q]Q");
    }

    for (let i in avgAnnualGrowthData) {
      let oTemp = { name: i, data: [] },
        oRow = { [methodTableHeaderName]: i };
      aMethodCats.push(i);
      categories.forEach((ele, ind) => {
        let nInt;
        if ((i, avgAnnualGrowthData[i][ele])) {
          nInt =
            (
              ((avgAnnualGrowthData[i][ele][sNextPer] || 0) -
                (avgAnnualGrowthData[i][ele][sPrevPer] || 0)) /
              (avgAnnualGrowthData[i][ele][sPrevPer] || 0)
            ).toFixed(2) * 1;
        }

        oTemp.data[ind] = nInt;
        oRow[ele] = nInt;
      });
      aSeries.push(oTemp);
      aTable.push(oRow);
    }

    return {
      series: aSeries,
      table: aTable,
      methods: aMethodCats,
      data: aSeries,
    };
  },
  calculateHighChartTable: ({ data }, p_cats) => {
    // console.log("calculateHighChartTable data",data)
    // console.log("calculateHighChartTable p_cats", p_cats)
    let aChartTable = [];
    p_cats.forEach((ele, i) => {
      let aRow = [ele];
      data.forEach((ser) => {
        aRow.push(ser.data[i]);
      });
      aChartTable.push(aRow);
    });
    return aChartTable;
  },
};
