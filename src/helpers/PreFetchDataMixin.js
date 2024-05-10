import service from "@/service";
export default {
  methods: {
    fetchData() {
      if (
        !this.preFetchData[`monthly_${this.$i18n.locale}`] ||
        !this.$store.getters.getIsMonthlyEMUSet
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
        !this.preFetchData[`yearly_${this.$i18n.locale}`] ||
        !this.$store.getters.getIsAnnualEMUSet
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
      // if (!this.preFetchData["allowedArray"]) {
      //   let locArray = [];
      //   let { levelID } = service.getAllowedLocation();
      //   if (levelID == 1) {
      //     if (this.preFetchData?.orgList?.length) {
      //       console.log(this.preFetchData.orgList, "this.preFetchData.orgList");
      //       this.preFetchData.orgList.forEach((ar) => {
      //         if (!locArray.includes(ar.id)) locArray.push(ar.id);
      //       });
      //        this.$set(this.preFetchData, "allowedArray", locArray);
      //     }
      //   }
      // }
    },
  },
};
