export default {
  data() {
    return {
      staticColors: {},
    };
    // i18n.t("user_by_methods_service_unadjusted"),
    // i18n.t("user_by_methods_service_adjusted"),
    // i18n.t("user_by_methods_survey"),
    // Commodities_Client: i18n.t("commodities_to_clients"),
    //   Commodities_Facilities: i18n.t("commodities_to_facility"),
    //   Users: i18n.t("fp_users"),
    //   Visits: i18n.t("fp_visits"),
  },
  created() {
    this.staticColors[this.$i18n.t("commodities_to_clients")] = {
      inc: "#7A5BC2",
      exc: "#C853C9",
    };
    this.staticColors[this.$i18n.t("commodities_to_facility")] = {
      inc: "#55BCCC",
      exc: "#D58383",
    };
    this.staticColors[this.$i18n.t("fp_users")] = {
      inc: "#3E926E",
      exc: "#A6AC5D",
    };
    this.staticColors[this.$i18n.t("fp_visits")] = {
      inc: "#9E51BF",
      exc: "#5D66B4",
    };
    (this.staticColors[this.$i18n.t("user_by_methods_service_unadjusted")] =
      "#D25D69"),
      (this.staticColors[this.$i18n.t("user_by_methods_service_adjusted")] =
        "#6036BF"),
      (this.staticColors[this.$i18n.t("user_by_methods_survey")] = "#C94D98");
    this.staticColors["dhsColor"] = "#4375BC";
    this.staticColors["emuColor"] = "#47c49a"; //need to change
  },
};
