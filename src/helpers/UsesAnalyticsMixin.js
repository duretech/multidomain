import service from "@/service";
import { getDateTimestamp } from "@/components/Common/commonFunctions";
export default {
  methods: {
    UpdateAnalytics({ modulesData = null }) {
      let uDetails = this.$store.getters.getUserDetails,
        uId = uDetails?.id || null;
      let d = getDateTimestamp({ isTimestamp: true });
      let org = [];
      uDetails.dataViewOrganisationUnits.forEach((o) => {
        let n = o.name ? o.name : o.id;
        org.push(n);
      });
      if (uId && d) {
        service
          .getSavedConfig({ tableKey: d, isUses: true })
          .then((resp) => {
            let rData = resp.data;
            let uDataIndex = rData.findIndex((r) => r.uId === uId);
            if (uDataIndex >= 0) {
              let usDataIndex = rData[uDataIndex].usesData.findIndex(
                (u) =>
                  u.type === modulesData.type &&
                  u.moduleName === modulesData.moduleName &&
                  u.namespace === modulesData.namespace
              );
              if (usDataIndex >= 0) {
                rData[uDataIndex].usesData[usDataIndex] = {
                  ...rData[uDataIndex].usesData[usDataIndex],
                  visitCount:
                    rData[uDataIndex].usesData[usDataIndex].visitCount + 1,
                };
              } else {
                rData[uDataIndex].usesData.push(modulesData);
              }
            } else {
              rData.push({
                uId: uDetails.id,
                uName: `${uDetails.firstName} ${uDetails.surname}`,
                isAdmin: this.$store.getters.getIsAdmin,
                orgAccess: org.join(", "),
                usesData: modulesData ? [modulesData] : [],
              });
            }
            console.log("rData" , rData)
            service
              .updateConfig({ data: rData, tableKey: d, isUses: true })
              .then((resp) => {
                console.log("user details saved...", resp);
              })
              .catch((err) => {
                console.log("Error in saving user details...", err);
              });
          })
          .catch((err) => {
            console.log("err", err);
            let data = [
              {
                uId: uDetails.id,
                uName: `${uDetails.firstName} ${uDetails.surname}`,
                isAdmin: this.$store.getters.getIsAdmin,
                orgAccess: org.join(", "),
                usesData: modulesData ? [modulesData] : [],
              },
            ];
            service
              .saveConfig({ data: data, tableKey: d, isUses: true })
              .then((resp) => {
                console.log("user details saved...", resp);
              })
              .catch((err) => {
                console.log("Error in saving user details...", err);
              });
          });
      }
    },
  },
  mounted() {
    if (
      this.$store.getters.getAppSettings?.isAnalytics &&
      !this.reportChartData
    ) {
      let title =
        typeof this.$route.meta === "function"
          ? this.$route.meta().title
          : this.$i18n.t("dashboard");
      let data = {
        moduleName: title,
        visitCount: 1,
        type: "module",
        namespace: this.$store.getters.getNamespace,
      };
      console.log("data" , data)
      this.UpdateAnalytics({ modulesData: data });
    }
  },
};
