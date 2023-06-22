import { translateDate } from "@/components/Common/commonFunctions";
export default {
  data() {
    return {
      dsl: [],
      signOffForm: [],
      updateForm: null,
    };
  },
  components: {
    SignOffDSL: () =>
      import(
        /* webpackChunkName: "signOff_DSL"*/ "@/components/DQR/SignOffDSL.vue"
      ),
    SignOffForm: () =>
      import(
        /* webpackChunkName: "signOff_form"*/ "@/components/DQR/SignOffForm.vue"
      ),
    SignOffHeader: () =>
      import(
        /* webpackChunkName: "signOff_header"*/ "@/components/DQR/SignOffHeader.vue"
      ),
    AllSignOffForms: () =>
      import(
        /* webpackChunkName: "signOff_allForms"*/ "@/components/DQR/AllSignOffForms.vue"
      ),
  },
  computed: {
    tabNameID() {
      return this.updateForm && this.updateForm.signOffTab
        ? this.updateForm.signOffTab
        : this.$store.getters.getActiveTab;
    },
    tabName() {
      // console.log("signOffData", this.signOffData);
      // console.log("configData", this.configData);
      // console.log("tabNameID", this.tabNameID);
      let id = this.tabNameID.split("-");
      let tName = id[0];
      if (tName === "emuMonthlyTab") {
        tName = this.$i18n.t("emu_monthly");
      } else if (tName === "emuAnnualTab") {
        tName = this.$i18n.t("emu_annual");
      } else {
        tName = this.configData
          ? this.configData.tabName[this.$i18n.locale] || id[0]
          : id[0];
      }
      let gName = "";
      if (id[2] === "CT") {
        gName = this.$i18n.t("compTime");
      }
      if (id[2] === "IC") {
        gName = this.$i18n.t("Internal_Consistency");
      }
      if (id[2] === "CC") {
        gName = this.$i18n.t("icc");
      }
      if (id[2] === "EC") {
        gName = this.$i18n.t("eConsistency");
      }
      let stName = "";
      if (
        this.signOffData &&
        this.signOffData.tabName &&
        this.signOffData.tabName[this.$i18n.locale]
      ) {
        stName = this.signOffData.tabName[this.$i18n.locale];
      } else {
        let isTab = this.configData
          ? this.configData.subTabs.find((s) => s.id === id[3])
          : false;
        if (isTab) {
          stName = isTab.tabName[this.$i18n.locale];
        }
      }
      return `${tName}${gName ? "-" + gName : ""}${stName ? "-" + stName : ""}`;
    },
    formDate() {
      return this.updateForm &&
        this.updateForm.period &&
        this.updateForm.periodType
        ? translateDate({
            rawDate: this.updateForm.period,
            periodType: this.updateForm.periodType,
          })
        : this.selectedDate;
    },
    formUser() {
      return this.updateForm && this.updateForm.userDetails
        ? this.updateForm.userDetails
        : this.userDetails;
    },
    formLocation() {
      return this.updateForm && this.updateForm.location
        ? this.updateForm.location
        : this.locationName;
    },
    formColor() {
      return this.updateForm && this.updateForm.iconColorClass
        ? this.updateForm.iconColorClass
        : "";
    },
  },
  created() {
    let classes = ["low", "mediumLow", "medium", "mediumHigh", "high"];
    classes.forEach((a) => {
      this.dsl.push({
        text: this.$i18n.t(`${a}`),
        class: a,
        count: null,
      });
    });
  },
};
