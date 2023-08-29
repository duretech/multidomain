import service from "@/service";
import { compress, decompress } from "compress-json";
export default {
  methods: {
    getKey({ dataEntryID, bgDataType, orgLevel }) {
      let key = "";
      if (dataEntryID.includes("population")) {
        key = `population_${bgDataType.toLowerCase()}_${orgLevel}`;
      }
      if (dataEntryID.includes("mcpr")) {
        key = `mcpr_${bgDataType.toLowerCase()}_${orgLevel}`;
      }
      if (dataEntryID.includes("mcmm")) {
        key = `mcmm_${bgDataType.toLowerCase()}_${orgLevel}`;
      }
      if (dataEntryID.includes("psa")) {
        key = `psa_${orgLevel}`;
      }
      if (dataEntryID.includes("prevalence")) {
        key = `prevalence_${orgLevel}`;
      }
      if (dataEntryID.includes("benchmark")) {
        key = `benchmark_${orgLevel}`;
      }
      if (dataEntryID.includes("externalData")) {
        key = `externalData_${orgLevel}`;
      }
      return key;
    },
    uploadData(key, newData) {
      if (key) {
        service
          .getSavedConfig({ tableKey: key })
          .then((response) => {
            let data =
              typeof response.data.rows == "string"
                ? {
                    ...response.data,
                    rows: decompress(JSON.parse(response.data.rows)),
                  }
                : response.data;
            let updatedData = [];

            //To update the existing values
            for (let i = 0; i < data.rows.length; i++) {
              let isFound = newData.find(
                (itmInner) =>
                  itmInner[0] === data.rows[i][0] &&
                  itmInner[1] === data.rows[i][1] &&
                  itmInner[2] === data.rows[i][2]
              );
              if (isFound) {
                updatedData.push([
                  data.rows[i][0],
                  data.rows[i][1],
                  data.rows[i][2],
                  isFound[3],
                ]);
              } else {
                updatedData.push(data.rows[i]);
              }
            }

            //To add new values
            for (let i = 0; i < newData.length; i++) {
              let isFound = data.rows.find(
                (itmInner) =>
                  itmInner[0] === newData[i][0] &&
                  itmInner[1] === newData[i][1] &&
                  itmInner[2] === newData[i][2]
              );
              if (!isFound) {
                updatedData.push(newData[i]);
              }
            }

            data.rows = JSON.stringify(compress(updatedData));
            service
              .updateConfig({ data: data, tableKey: key })
              .then((response) => {
                if (response.data.status === "OK") {
                  this.sweetAlert({
                    title: this.$i18n.t("data_saved_successfully"),
                  });
                  this.emitMethods();
                } else {
                  this.sweetAlert({
                    title: this.$i18n.t("error"),
                    text: `${response.data.message}`,
                  });

                  this.emitMethods();
                  return;
                }
              })
              .catch((error) => {
                this.sweetAlert({
                  title: this.$i18n.t("error"),
                });

                this.emitMethods();
                return;
              });
          })
          .catch(() => {
            let data = {
              headers: [
                {
                  name: "dx",
                },
                {
                  name: "pe",
                },
                {
                  name: "ou",
                },
                {
                  name: "value",
                },
              ],
              rows: JSON.stringify(compress(newData)),
            };
            let response = service.saveConfig({ data: data, tableKey: key });
            response
              .then((response) => {
                if (response.data.status === "OK") {
                  this.sweetAlert({
                    title: this.$i18n.t("data_saved_successfully"),
                  });
                  this.emitMethods();
                } else {
                  this.sweetAlert({
                    title: this.$i18n.t("error"),
                    text: `${response.data.message}`,
                  });
                  this.emitMethods();
                  return;
                }
              })
              .catch(() => {
                this.sweetAlert({
                  title: this.$i18n.t("error"),
                });

                this.emitMethods();
                return;
              });
          });
      } else {
        this.sweetAlert({
          title: this.$i18n.t("error"),
        });
        this.emitMethods();
      }
    },
    emitMethods() {
      this.$store.commit("setLoading", false);
      this.$emit("hideModal");
      this.$emit("hidePopup");
    },
  },
};
