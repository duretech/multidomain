import service from "@/service";
export default {
  methods: {
    fetchData() {
      if (
        !this.preFetchData[`monthlyEMU_${this.$i18n.locale}`] ||
        !$store.getters.getIsMonthlyEMUSet
      ) {
        let key = this.generateKey(`monthlyEMU_${this.$i18n.locale}`);
        service
          .getSavedConfig({ tableKey: key, namespace: "fp-dashboard" })
          .then((res) => {
            this.$set(
              this.preFetchData,
              `monthly_${this.$i18n.locale}`,
              res.data
            );
            this.$store.commit("setIsMonthlyEMUSet", true);
          });
      }
      if (
        !this.preFetchData[`annualEMU_${this.$i18n.locale}`] ||
        !$store.getters.getIsAnnualEMUSet
      ) {
        let key = this.generateKey(`annualEMU_${this.$i18n.locale}`);
        service
          .getSavedConfig({ tableKey: key, namespace: "fp-dashboard" })
          .then((res) => {
            this.$set(
              this.preFetchData,
              `yearly_${this.$i18n.locale}`,
              res.data
            );
            this.$store.commit("setIsAnnualEMUSet", true);
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
