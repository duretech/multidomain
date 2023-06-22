<template>
  <b-row>
    <template v-if="noData">
      <b-col class="text-center">
        <b-alert variant="info" show class="m-0"
          ><h5 class="m-0">{{ noData }}</h5></b-alert
        >
      </b-col>
    </template>
    <template v-else>
      <b-col sm="6" class="mb-3">
        <card-component
          v-if="totalEMUChartData"
          :chartdata="totalEMUChartData"
          :showSource="true"
          :canComment="canComment"
          defaultSort="JAN-DEC"
          :sorting="['JAN-DEC', 'DEC-JAN']"
          :setExtreme="true"
        />
        <template v-else>
          <HighChartComponent :chartData="placeholderObj" />
        </template>
      </b-col>
      <b-col sm="6" class="mb-3">
        <card-component
          v-if="trendsChartData"
          :chartdata="trendsChartData"
          :period="true"
          :showSource="true"
          :aggregate="true"
          chartName="trend"
          :caltype="calType"
          :canComment="canComment"
          defaultSort="JAN-DEC"
          :sorting="['JAN-DEC', 'DEC-JAN']"
          :setExtreme="true"
        />
        <template v-else>
          <HighChartComponent :chartData="placeholderObj" />
        </template>
      </b-col>

      <b-col sm="6" class="mb-3">
        <card-component
          v-if="methodTrendsChartData"
          :chartdata="methodTrendsChartData"
          :showSource="true"
          :aggregate="true"
          chartName="methodSpecific"
          :caltype="calType"
          :canComment="canComment"
          defaultSort="JAN-DEC"
          :sorting="['JAN-DEC', 'DEC-JAN']"
          :setExtreme="true"
        />
        <template v-else>
          <HighChartComponent :chartData="placeholderObj" />
        </template>
      </b-col>
      <b-col sm="6" class="mb-3">
        <card-component
          v-if="oneMonthEMUChartData"
          :chartdata="oneMonthEMUChartData"
          :showSource="true"
          :aggregate="true"
          chartName="monthSpecific"
          :caltype="calType"
          :canComment="canComment"
          defaultSort="A-Z"
          :sorting="['0-1', '1-0', 'A-Z', 'Z-A']"
          :setExtreme="true"
        />
        <template v-else>
          <HighChartComponent :chartData="placeholderObj" />
        </template>
      </b-col>
    </template>
  </b-row>
</template>
<script>
import service from "@/service";
import { commonChartConfig } from "@/config/basicChartConfig";
import cardComponent from "@/components/FPDashboard/dqr/monthly/cardComponent";

export default {
  props: ["emuData", "dqrResponse", "locationPeriod"],
  components: {
    cardComponent,
    HighChartComponent: () =>
      import(
        /* webpackChunkName: "HighChartComponentDynamic"*/ "@/components/Highcharts/HighChartComponentDynamic"
      ),
  },
  data() {
    return {
      noData: "",
      canComment: false,
      trendsChartData: null,
      globalPeriodData: null,
      totalEMUChartData: null,
      oneMonthEMUChartData: null,
      methodTrendsChartData: null,
      placeholderObj: commonChartConfig,
    };
  },
  computed: {
    calType() {
      return this.locationPeriod.mType;
    },
  },
  watch: {
    emuData: {
      handler(newValue) {
        if (
          newValue[`monthly_${this.$i18n.locale}`] &&
          newValue[`monthly_${this.$i18n.locale}`] !== "Error" &&
          this.dqrResponse
        ) {
          this.getEMUChart();
        }
        if (newValue[`monthly_${this.$i18n.locale}`] === "Error") {
          this.noData = this.$i18n.t("no_data_to_display");
        }
      },
      deep: true,
    },
    dqrResponse: {
      handler(newValue) {
        if (
          this.emuData[`monthly_${this.$i18n.locale}`] &&
          this.emuData[`monthly_${this.$i18n.locale}`] !== "Error" &&
          newValue
        ) {
          this.getEMUChart();
        }
        if (this.emuData[`monthly_${this.$i18n.locale}`] === "Error") {
          this.noData = this.$i18n.t("no_data_to_display");
        }
      },
      deep: true,
    },
    locationPeriod: {
      handler() {
        this.getEMUChart();
      },
      deep: true,
    },
  },
  methods: {
    getEMUChart() {
      this.trendsChartData = null;
      this.totalEMUChartData = null;
      this.oneMonthEMUChartData = null;
      this.methodTrendsChartData = null;

      let locId = this.locationPeriod.location.split("/")[1];
      let emuData = JSON.parse(JSON.stringify(this.emuData));
      let totalEMU =
        typeof emuData[`monthly_${this.$i18n.locale}`]["totalEMU"] === "string"
          ? JSON.parse(emuData[`monthly_${this.$i18n.locale}`]["totalEMU"])
          : emuData[`monthly_${this.$i18n.locale}`]["totalEMU"];
      // let totalEMU = emuData[`monthly_${this.$i18n.locale}`]['totalEMU'] ? emuData[`monthly_${this.$i18n.locale}`]['totalEMU'] : null
      if (totalEMU[locId]) {
        let savedEMU = this.dqrResponse.emu_monthly.Background_Data.autoSaveEMU;
        let dqrData = this.dqrResponse.emu_monthly[savedEMU].derivedCharts;
        let d = new Date();
        let defaultDate = this.$moment(d, "YYYYMM").subtract(
          this.globalPeriodData.backtrackedMonth * 1,
          "months"
        );
        let selectedDate = this.$moment(defaultDate, "YYYYMM").format(
          "MMM YYYY"
        );
        let totalEMUChartData = totalEMU[locId] ? totalEMU[locId] : null;
        if (totalEMUChartData) {
          let data = dqrData.find(
            (d) => d.chartOptions.cid === totalEMUChartData.cid
          );
          if (data) {
            data = data.chartOptions;
            totalEMUChartData.chartInfo =
              data.chartInfo[this.$i18n.locale] || data.chartInfo;
            totalEMUChartData.title =
              data.chartName[this.$i18n.locale] || data.chartName;
            totalEMUChartData.xTitle =
              data.xAxis && data.xAxis.visible
                ? data.xAxis.text[this.$i18n.locale] || data.xAxis.text
                : "";
            totalEMUChartData.yTitle =
              data.yAxis && data.yAxis.visible
                ? data.yAxis.text[this.$i18n.locale] || data.yAxis.text
                : "";
            totalEMUChartData.type = "line";
            totalEMUChartData.max = 11;
            totalEMUChartData["categories"] = [];
            totalEMUChartData["data"] = [];
            let pe = [],
              formatedCatArray = [];
            for (let i = 23; i >= 0; i--) {
              if (i === 0) {
                pe.push(
                  this.$moment(selectedDate, "MMM YYYY").format("YYYYMM")
                );
              } else {
                pe.push(
                  this.$moment(selectedDate, "MMM YYYY")
                    .subtract(i, "months")
                    .format("YYYYMM")
                );
              }
            }
            totalEMUChartData.saveCategories.forEach((c) =>
              formatedCatArray.push(
                this.$moment(c, "MMM YYYY").format("YYYYMM")
              )
            );
            let items = [],
              fields = [];
            fields.push(
              { key: "Period", value: this.$i18n.t("period") }
              // {
              //   key: "Value",
              //   value: this.$i18n.t("value"),
              // }
            );
            totalEMUChartData.saveData.forEach((sData) => {
              let reqData = sData.data;
              let obj = {
                name: sData.name,
                data: [],
                color: sData.color,
              };
              let methodName = sData.name;
              fields.push(methodName);
              pe.forEach((p, i) => {
                let formatedDate = this.$moment(p, "YYYYMM").format("MMM YYYY");
                if (formatedCatArray.includes(p)) {
                  let catIndex = formatedCatArray.indexOf(p);
                  obj.data.push(reqData[catIndex]);

                  if (!totalEMUChartData.categories.includes(formatedDate))
                    totalEMUChartData.categories.push(formatedDate);
                }
              });
              totalEMUChartData["data"].push(obj);
            });
            totalEMUChartData.categories.forEach((p, i) => {
              let innObj = { Period: p };
              totalEMUChartData.data.forEach((sData) => {
                let reqData = sData.data;
                let methodName = sData.trans_name
                  ? sData.trans_name
                  : sData.name;
                innObj[methodName] = reqData[i] ? reqData[i] : null;
              });
              items.push(innObj);
            });
            // let reqData = totalEMUChartData.saveData[0].data;
            // let obj = {
            //   name: totalEMUChartData.saveData[0].name,
            //   data: [],
            // };
            // let items = [],
            //   fields = [];
            // fields.push(
            //   { key: "Period", value: this.$i18n.t("period") },
            //   {
            //     key: "Value",
            //     value: this.$i18n.t("value"),
            //   }
            // );
            // pe.forEach((p, i) => {
            //   let formatedDate = this.$moment(p, "YYYYMM").format("MMM YYYY");
            //   if (formatedCatArray.includes(p)) {
            //     let catIndex = formatedCatArray.indexOf(p);
            //     obj.data.push(reqData[catIndex]);
            //     totalEMUChartData.categories.push(formatedDate);
            //     items.push({ Period: formatedDate, Value: reqData[catIndex] });
            //   }
            // });
            totalEMUChartData["fields"] = fields;
            totalEMUChartData["tableData"] = [
              {
                name: this.$i18n.t("EMU"),
                data: items,
              },
            ];
            //totalEMUChartData["data"].push(obj);
          }
          this.totalEMUChartData = totalEMUChartData;
        } else {
          this.totalEMUChartData = null;
        }
        // let eTrend = emuData[`monthly_${this.$i18n.locale}`]['emuTrend'] ? JSON.parse(emuData[`monthly_${this.$i18n.locale}`]['emuTrend']) : null
        let eTrend =
          typeof emuData[`monthly_${this.$i18n.locale}`]["emuTrend"] ===
          "string"
            ? JSON.parse(emuData[`monthly_${this.$i18n.locale}`]["emuTrend"])
            : emuData[`monthly_${this.$i18n.locale}`]["emuTrend"];
        let trendsChartData = eTrend[locId] ? eTrend[locId] : null;
        if (trendsChartData) {
          let data = dqrData.find(
            (d) => d.chartOptions.cid === trendsChartData.cid
          );
          if (data) {
            data = data.chartOptions;
            trendsChartData.chartInfo =
              data.chartInfo[this.$i18n.locale] || data.chartInfo;
            trendsChartData.title =
              data.chartName[this.$i18n.locale] || data.chartName;
            trendsChartData.xTitle =
              data.xAxis && data.xAxis.visible
                ? data.xAxis.text[this.$i18n.locale] || data.xAxis.text
                : "";
            trendsChartData.yTitle =
              data.yAxis && data.yAxis.visible
                ? data.yAxis.text[this.$i18n.locale] || data.yAxis.text
                : "";
            trendsChartData.max = 11;
            trendsChartData["categories"] = [];
            trendsChartData["data"] = [];
            let pe = [],
              formatedCatArray = [];
            for (let i = 23; i >= 0; i--) {
              if (i === 0) {
                pe.push(
                  this.$moment(selectedDate, "MMM YYYY").format("YYYYMM")
                );
              } else {
                pe.push(
                  this.$moment(selectedDate, "MMM YYYY")
                    .subtract(i, "months")
                    .format("YYYYMM")
                );
              }
            }
            trendsChartData.saveCategories.forEach((c) =>
              formatedCatArray.push(
                this.$moment(c, "MMM YYYY").format("YYYYMM")
              )
            );
            let items = [],
              agreItems = [],
              fields = [{ key: "Period", value: this.$i18n.t("period") }];
            trendsChartData.saveData.forEach((sData) => {
              let reqData = sData.data;
              let obj = {
                name: sData.trans_name ? sData.trans_name : sData.name,
                data: [],
                color: sData.color,
              };
              let methodName = sData.trans_name ? sData.trans_name : sData.name;
              fields.push(methodName);
              pe.forEach((p, i) => {
                let formatedDate = this.$moment(p, "YYYYMM").format("MMM YYYY");
                if (formatedCatArray.includes(p)) {
                  let catIndex = formatedCatArray.indexOf(p);
                  obj.data.push(reqData[catIndex]);

                  if (!trendsChartData.categories.includes(formatedDate))
                    trendsChartData.categories.push(formatedDate);
                }
              });
              trendsChartData["data"].push(obj);
            });
            let agreDataTemp = [];
            trendsChartData.agreData.forEach((sData) => {
              let reqData = sData.data;
              let obj = {
                name: sData.trans_name ? sData.trans_name : sData.name,
                data: [],
                color: sData.color,
              };
              let methodName = sData.trans_name ? sData.trans_name : sData.name;
              //fields.push(methodName)
              pe.forEach((p, i) => {
                let formatedDate = this.$moment(p, "YYYYMM").format("MMM YYYY");
                if (formatedCatArray.includes(p)) {
                  let catIndex = formatedCatArray.indexOf(p);
                  obj.data.push(reqData[catIndex]);
                  if (!trendsChartData.categories.includes(formatedDate))
                    trendsChartData.categories.push(formatedDate);
                }
              });
              agreDataTemp.push(obj);
            });
            trendsChartData["agreData"] = agreDataTemp;
            trendsChartData["fields"] = fields;

            trendsChartData.categories.forEach((p, i) => {
              let innObj = { Period: p };
              let agreObj = { Period: p };
              trendsChartData.data.forEach((sData) => {
                let reqData = sData.data;
                let methodName = sData.trans_name
                  ? sData.trans_name
                  : sData.name;
                innObj[methodName] = reqData[i] ? reqData[i] : null;
              });
              items.push(innObj);
              trendsChartData.agreData.forEach((sData) => {
                let reqData = sData.data;
                let methodName = sData.trans_name
                  ? sData.trans_name
                  : sData.name;
                agreObj[methodName] = reqData[i] ? reqData[i] : null;
              });
              agreItems.push(agreObj);
            });
            trendsChartData["tableData"] = [
              {
                name: this.$i18n.t("EMU"),
                data: items,
              },
            ];
            trendsChartData["agreTableData"] = [
              {
                name: this.$i18n.t("EMU"),
                data: agreItems,
              },
            ];
            //let items=[],fields=[],newFields=[];
            // if (trendsChartData.tableData) {
            //   trendsChartData.tableData[0]['data'].forEach(key => {
            //     Object.keys(key).forEach(field => {
            //       if (newFields.indexOf(field) == -1) {
            //         newFields.push(field)
            //         if(field == 'Period' || field == 'Value'){
            //           fields.push({key: field, sortable: true})
            //         }else{
            //           fields.push(field)
            //         }
            //       }
            //     })
            //     items.push(key)
            //   })
            // }
            //trendsChartData['tableData'] = this.items
            // trendsChartData['fields'] = this.fields
          }
          this.trendsChartData = trendsChartData;
        } else {
          this.trendsChartData = null;
        }
        // let methodTrend = emuData[`monthly_${this.$i18n.locale}`]['methodTrend'] ? JSON.parse(emuData[`monthly_${this.$i18n.locale}`]['methodTrend']) : null
        let methodTrend =
          typeof emuData[`monthly_${this.$i18n.locale}`]["methodTrend"] ===
          "string"
            ? JSON.parse(emuData[`monthly_${this.$i18n.locale}`]["methodTrend"])
            : emuData[`monthly_${this.$i18n.locale}`]["methodTrend"];
        let methodTrendsChartData = methodTrend[locId]
          ? methodTrend[locId]
          : null;
        if (methodTrendsChartData) {
          let data = dqrData.find(
            (d) => d.chartOptions.cid === methodTrendsChartData.cid
          );
          let items = [],
            agreItems = [],
            fields = [{ key: "Period", value: this.$i18n.t("period") }];
          if (data) {
            data = data.chartOptions;
            methodTrendsChartData.chartInfo =
              data.chartInfo[this.$i18n.locale] || data.chartInfo;
            methodTrendsChartData.title =
              data.chartName[this.$i18n.locale] || data.chartName;
            methodTrendsChartData.xTitle =
              data.xAxis && data.xAxis.visible
                ? data.xAxis.text[this.$i18n.locale] || data.xAxis.text
                : "";
            methodTrendsChartData.yTitle =
              data.yAxis && data.yAxis.visible
                ? data.yAxis.text[this.$i18n.locale] || data.yAxis.text
                : "";
            methodTrendsChartData.max = 11;
            methodTrendsChartData["categories"] = [];
            methodTrendsChartData["data"] = [];
            let pe = [],
              formatedCatArray = [];
            for (let i = 23; i >= 0; i--) {
              if (i === 0) {
                pe.push(
                  this.$moment(selectedDate, "MMM YYYY").format("YYYYMM")
                );
              } else {
                pe.push(
                  this.$moment(selectedDate, "MMM YYYY")
                    .subtract(i, "months")
                    .format("YYYYMM")
                );
              }
            }
            methodTrendsChartData.saveCategories.forEach((c) =>
              formatedCatArray.push(
                this.$moment(c, "MMM YYYY").format("YYYYMM")
              )
            );
            methodTrendsChartData.saveData.forEach((sData) => {
              let reqData = sData.data;
              let obj = {
                name: sData.trans_name ? sData.trans_name : sData.name,
                data: [],
                color: sData.color,
              };
              let methodName = sData.trans_name ? sData.trans_name : sData.name;
              fields.push(methodName);
              pe.forEach((p, i) => {
                let formatedDate = this.$moment(p, "YYYYMM").format("MMM YYYY");
                if (formatedCatArray.includes(p)) {
                  let catIndex = formatedCatArray.indexOf(p);
                  obj.data.push(reqData[catIndex]);
                  if (!methodTrendsChartData.categories.includes(formatedDate))
                    methodTrendsChartData.categories.push(formatedDate);
                }
              });
              methodTrendsChartData["data"].push(obj);
            });
            let agreDataTemp = [];
            methodTrendsChartData.agreData.forEach((sData) => {
              let reqData = sData.data;
              let obj = {
                name: sData.trans_name ? sData.trans_name : sData.name,
                data: [],
                color: sData.color,
              };
              let methodName = sData.trans_name ? sData.trans_name : sData.name;
              //fields.push(methodName)
              pe.forEach((p, i) => {
                let formatedDate = this.$moment(p, "YYYYMM").format("MMM YYYY");
                if (formatedCatArray.includes(p)) {
                  let catIndex = formatedCatArray.indexOf(p);
                  obj.data.push(reqData[catIndex]);

                  if (!trendsChartData.categories.includes(formatedDate))
                    methodTrendsChartData.categories.push(formatedDate);
                }
              });
              agreDataTemp.push(obj);
            });
            methodTrendsChartData["agreData"] = agreDataTemp;
            methodTrendsChartData["fields"] = fields;
            methodTrendsChartData.categories.forEach((p, i) => {
              let innObj = { Period: p };
              let agreObj = { Period: p };
              methodTrendsChartData.data.forEach((sData) => {
                let reqData = sData.data;
                let methodName = sData.trans_name
                  ? sData.trans_name
                  : sData.name;
                innObj[methodName] = reqData[i] ? reqData[i] : null;
              });
              methodTrendsChartData.agreData.forEach((sData) => {
                let reqData = sData.data;
                let methodName = sData.trans_name
                  ? sData.trans_name
                  : sData.name;
                agreObj[methodName] = reqData[i] ? reqData[i] : null;
              });
              items.push(innObj);
              agreItems.push(agreObj);
            });
            methodTrendsChartData["tableData"] = [
              {
                name: this.$i18n.t("EMU"),
                data: items,
              },
            ];
            methodTrendsChartData["agreTableData"] = [
              {
                name: this.$i18n.t("EMU"),
                data: agreItems,
              },
            ];
            // if (methodTrendsChartData.tableData) {
            //   methodTrendsChartData.tableData[0]['data'].forEach(key => {
            //     Object.keys(key).forEach(field => {
            //       if (newFields.indexOf(field) == -1) {
            //         newFields.push(field)
            //         if(field == 'Period' || field == 'Value'){
            //           fields.push({key: field, sortable: true})
            //         }else{
            //           fields.push(field)
            //         }
            //       }
            //     })
            //     items.push(key)
            //   })
            // }
            // methodTrendsChartData['tableData'] = this.items
            // methodTrendsChartData['fields'] = this.fields
          }
          this.methodTrendsChartData = methodTrendsChartData;
        } else {
          this.methodTrendsChartData = null;
        }

        // let monthTrend = emuData[`monthly_${this.$i18n.locale}`]['monthTrend'] ? JSON.parse(emuData[`monthly_${this.$i18n.locale}`]['monthTrend']) : null
        let monthTrend =
          typeof emuData[`monthly_${this.$i18n.locale}`]["monthTrend"] ===
          "string"
            ? JSON.parse(emuData[`monthly_${this.$i18n.locale}`]["monthTrend"])
            : emuData[`monthly_${this.$i18n.locale}`]["monthTrend"];
        let oneMonthEMUChartData = monthTrend[locId] ? monthTrend[locId] : null;
        if (oneMonthEMUChartData) {
          let data = dqrData.find(
            (d) => d.chartOptions.cid === oneMonthEMUChartData.cid
          );
          if (data) {
            data = data.chartOptions;
            oneMonthEMUChartData.chartInfo =
              data.chartInfo[this.$i18n.locale] || data.chartInfo;
            oneMonthEMUChartData.title =
              data.chartName[this.$i18n.locale] || data.chartName;
            oneMonthEMUChartData.xTitle =
              data.xAxis && data.xAxis.visible
                ? data.xAxis.text[this.$i18n.locale] || data.xAxis.text
                : "";
            oneMonthEMUChartData.yTitle =
              data.yAxis && data.yAxis.visible
                ? data.yAxis.text[this.$i18n.locale] || data.yAxis.text
                : "";
          }
          this.oneMonthEMUChartData = oneMonthEMUChartData;
        } else {
          this.oneMonthEMUChartData = null;
        }
      } else {
        this.totalEMUChartData = null;
        this.trendsChartData = null;
        this.methodTrendsChartData = null;
        this.oneMonthEMUChartData = null;
        this.noData = this.$i18n.t("no_data_to_display");
      }
    },
    getConfig() {
      let key = this.generateKey("dqrModule");
      service
        .getSavedConfig(key)
        .then((response) => {
          this.$emit("setDQRResponse", response.data);
        })
        .catch((res) => {
          console.log("catch error", res);
          if (this.$store.state.isAdmin) {
            // Popup message to set the configurations
            this.$swal({
              title: this.$i18n.t("configurationnotavailable"),
              text: this.$i18n.t("pleasesetyourconfiguration"),
              showCancelButton: true,
              reverseButtons: true,
              confirmButtonText: this.$i18n.t("configureNow"),
              cancelButtonText: this.$i18n.t("cancelbtn"),
            }).then((result) => {
              if (result.value) {
                this.$router.push("/config");
              }
            });
          } else {
            // Popup message to contact admin for the configurations
            this.sweetAlert({
              title: this.$i18n.t("configurationnotavailable"),
              text: this.$i18n.t("contactAdmin"),
            });
          }
        });
    },
  },
  created() {
    this.canComment =
      this.$store.getters.getIsAdmin ||
      this.$store.getters.getUserPermissions.canComment;
    this.globalPeriodData =
      this.$store.getters.getGlobalFactors().period.Period;
    if (!this.dqrResponse) {
      this.getConfig();
    }
    if (this.emuData[`monthly_${this.$i18n.locale}`] && this.dqrResponse) {
      this.getEMUChart();
    }
  },
};
</script>
