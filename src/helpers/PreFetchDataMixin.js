import service from "@/service";
export default {
  methods: {
    fetchData() {
      if (!this.preFetchData[`monthlyEMU_${this.$i18n.locale}`]) {
        let key = this.generateKey(`monthlyEMU_${this.$i18n.locale}`);
        service.getSavedConfig(key, false, "fp-dashboard").then((res) => {
          this.$set(
            this.preFetchData,
            `monthly_${this.$i18n.locale}`,
            res.data
          );
        });
      }
      if (!this.preFetchData[`annualEMU_${this.$i18n.locale}`]) {
        let key = this.generateKey(`annualEMU_${this.$i18n.locale}`);
        service.getSavedConfig(key, false, "fp-dashboard").then((res) => {
          this.$set(this.preFetchData, `yearly_${this.$i18n.locale}`, res.data);
        });
      }
      if (!this.preFetchData["orgList"]) {
        service.getOrganisation().then((orgList) => {
          this.$set(
            this.preFetchData,
            "orgList",
            orgList.data.organisationUnits
          );
        });
      }
    },
  },
};
