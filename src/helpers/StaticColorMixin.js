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
      inc: "#8DC645",
      exc: "#0B9444",
    };
    this.staticColors[this.$i18n.t("commodities_to_facility")] = {
      inc: "#8DC645",
      exc: "#0B9444",
    };
    this.staticColors[this.$i18n.t("fp_users")] = {
      inc: "#8FB5E9",
      exc: "#1D4E92",
    };
    this.staticColors[this.$i18n.t("fp_visits")] = {
      inc: "#8FB5E9",
      exc: "#1D4E92",
    };
    (this.staticColors[this.$i18n.t("user_by_methods_service_unadjusted")] =
      "#4A2739"),
      (this.staticColors[this.$i18n.t("user_by_methods_service_adjusted")] =
        "#954F72"),
      (this.staticColors[this.$i18n.t("user_by_methods_survey")] = "#C490AA");
    this.staticColors["dhsColor"] = "#4375BC";
    this.staticColors["emuColor"] = "#47c49a"; //need to change
  },
};
