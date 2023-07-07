import {
  subtractNDate,
  translateDate,
  formatSingleDate,
} from "@/components/Common/commonFunctions";

export default {
  methods: {
    getPeriods() {
      let currDate = formatSingleDate({
          rawDate: this.locationPeriod.period,
          periodType: this.locationPeriod.periodType,
        }),
        currForDate = translateDate({
          rawDate: this.locationPeriod.period,
          periodType: this.locationPeriod.periodType,
          monthlyFormat: "MMM YYYY",
        }),
        prevDate = subtractNDate({
          rawDate: this.locationPeriod.period,
          periodType: this.locationPeriod.periodType,
        }),
        prevForDate = translateDate({
          rawDate: prevDate,
          periodType: this.locationPeriod.periodType,
          monthlyFormat: "MMM YYYY",
        }),
        prevYrDate = subtractNDate({
          rawDate: this.locationPeriod.period,
          periodType: this.locationPeriod.periodType,
          n: 12,
        }),
        prevYrForDate = translateDate({
          rawDate: prevYrDate,
          periodType: this.locationPeriod.periodType,
          monthlyFormat: "MMM YYYY",
        });
      return {
        currDate,
        currForDate,
        prevDate,
        prevForDate,
        prevYrDate,
        prevYrForDate,
      };
    },
    getValue(data, currDate, prevDate, prevYrDate) {
      let currValue = data.find((d) => d.pe === currDate);
      let prevValue = data.find((d) => d.pe === prevDate);
      let prevYrValue = data.find((d) => d.pe === prevYrDate);

      currValue = currValue ? currValue.y * 1 : null;
      prevValue = prevValue ? prevValue.y * 1 : null;
      prevYrValue = prevYrValue ? prevYrValue.y * 1 : null;

      return {
        currValue,
        prevValue,
        prevYrValue,
      };
    },
    getRangeColor(change, cData) {
      let compare = null,
        color = null;
      if (change > 5) {
        compare = this.$i18n.t("increased_V3");
        color = cData.cngSumPos || "#5ab276";
      } else if (change < -5) {
        compare = this.$i18n.t("decreased_V3");
        color = cData.cngSumNeg || "#d97276";
      } else {
        compare = this.$i18n.t("similar_to_V2");
        color = cData.cngSumEq || "#e8bb69";
      }
      return { compare, color };
    },
    getPercentChange(currValue, prevValue, percentage) {
      let change = null;
      if (percentage) {
        change = (currValue - prevValue).toFixed(2);
      } else {
        if (prevValue) {
          change = (((currValue - prevValue) / prevValue) * 100).toFixed(2);
        }
      }
      return { change };
    },
  },
};
