export default {
  computed: {
    dashboards() {
      let d = [],
        programs = [];
      if (this.$store.getters.getIsAdmin) {
        programs = this.$store.getters.getAppSettings?.modulesList || [];
      } else {
        programs = this.$store.getters.getUserPermissions?.dashboards || [];
      }

      if (programs.includes("mnch")) {
        d.push({
          module: "mnch-dashboard",
          setNamespace: true,
          routeName: "dashboard",
          icon: "maternal_healthicon.png",
          text: this.$i18n.t("maternalHealth"),
        });
      }
      if (programs.includes("fp")) {
        d.push({
          module: "fp-dashboard",
          setNamespace: true,
          routeName: "dashboard",
          icon: "RMNCHdashsmall.png",
          text: this.$i18n.t("family_planning"),
        });
      }

      return d;
    },
  },
};
