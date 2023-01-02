<template>
  <div>
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="col-lg-12">
            <div class="form-group mb-1 row">
              <label class="col-lg-3 col-sm-6 col-form-label"
                >{{ $t("currentYearMonth") }}
              </label>
              <div class="col-lg-4 col-sm-6 d-flex align-items-center">
                <input
                  type="text"
                  class="form-control"
                  v-model="currentDate"
                  disabled
                />
              </div>
            </div>
          </div>
          <div class="col-lg-12">
            <div class="form-group mb-1 row">
              <label class="col-lg-3 col-sm-6 col-form-label">{{
                $t("backtrackingMonth")
              }}</label>
              <div class="col-lg-4 col-sm-6">
                <div class="select-wrapper">
                  <select class="form-control" v-model="backtrackedMonth">
                    <option v-for="(n, index) in 61" :key="index">
                      {{ n - 1 }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-12">
            <div class="form-group mb-1 row">
              <label class="col-lg-3 col-sm-6 col-form-label">{{
                $t("backtrackedYearMonth")
              }}</label>
              <div class="col-lg-4 col-sm-6 d-flex align-items-center">
                <input
                  type="text"
                  class="form-control"
                  v-model="backtrackedDate"
                  disabled
                />
              </div>
            </div>
          </div>
          <div class="col-lg-12">
            <div class="form-group mb-1 row">
              <label class="col-lg-3 col-sm-6 col-form-label">{{
                $t("backtrackingYearLimit")
              }}</label>
              <div class="col-lg-4 col-sm-6">
                <div class="select-wrapper">
                  <select class="form-control" v-model="backtrackedYearLimit">
                    <option v-for="(n, index) in 16" :key="index">
                      {{ n - 1 }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-12">
            <div class="form-group mb-1 row">
              <label class="col-lg-3 col-sm-6 col-form-label">{{
                $t("applicationYearRange")
              }}</label>
              <div class="col-lg-4 col-sm-6 d-flex align-items-center">
                <input
                  type="text"
                  class="form-control"
                  v-model="yearRange"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
        <div class="row pt-4">
          <div class="col text-right">
            <button
              type="button"
              class="btn btn-primary black-btn"
              @click="updateConfigData"
            >
              {{ $t("savebtn") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/service";
import audit from "@/components/config/audit.js";
import globalFactorsConfig from "@/config/globalFactorsConfig.js";

export default {
  props: ["module", "type", "subType"],
  data() {
    let currentDateLong = this.$moment().format();
    let format = this.$moment(currentDateLong, "YYYYMM").format("YYYY-MM");
    let periodSettings = globalFactorsConfig[this.type][this.subType]
      ? globalFactorsConfig[this.type][this.subType]
      : null;
    return {
      originalPerioddata: [],
      currentDate: format,
      backtrackedMonth: periodSettings ? periodSettings.backtrackedMonth : 0,
      backtrackedYearLimit: periodSettings
        ? periodSettings.backtrackedYearLimit
        : 3,
      backtrackedDate: format,
      backtrackedLimitedDate: null,
      yearRange: "",
    };
  },
  watch: {
    backtrackedMonth(newValue) {
      if (newValue) {
        this.backtrackedDate = this.$moment(this.currentDate, "YYYYMM")
          .subtract(newValue, "months")
          .format("YYYY-MM");
        (this.backtrackedLimitedDate = this.$moment(
          this.backtrackedDate,
          "YYYYMM"
        )
          .subtract(this.backtrackedYearLimit, "years")
          .format("YYYY-MM")),
          (this.yearRange = `${this.backtrackedLimitedDate} ${this.$i18n.t(
            "toSmall"
          )} ${this.backtrackedDate}`);

        // console.log("yearRange",this.yearRange,this.$i18n.t('toSmall'))
      }
    },
    backtrackedYearLimit(newValue) {
      if (newValue) {
        (this.backtrackedLimitedDate = this.$moment(
          this.backtrackedDate,
          "YYYYMM"
        )
          .subtract(this.backtrackedYearLimit, "years")
          .format("YYYY-MM")),
          (this.yearRange = `${this.backtrackedLimitedDate} ${this.$i18n.t(
            "toSmall"
          )} ${this.backtrackedDate}`);
        // console.log("yearRange",this.yearRange)
      }
    },
  },
  methods: {
    //This is to fetch config data on page load
    getConfigData() {
      this.$store.state.loading = true;
      // console.log("data initial",[this.chartBySubtype],JSON.stringify(config))
      let key = this.generateKey(this.module);

      let response = service.getSavedConfig(key);
      response
        .then((response) => {
          if (response.data[this.type][this.subType]) {
            let periodSettings = response.data[this.type][this.subType];
            this.originalPerioddata = JSON.parse(
              JSON.stringify(periodSettings)
            );
            this.backtrackedMonth = periodSettings.backtrackedMonth
              ? periodSettings.backtrackedMonth
              : this.backtrackedMonth;
            this.backtrackedYearLimit = periodSettings.backtrackedYearLimit
              ? periodSettings.backtrackedYearLimit
              : this.backtrackedYearLimit;
            this.backtrackedDate = periodSettings.backtrackedDate
              ? periodSettings.backtrackedDate
              : this.backtrackedDate;
            this.backtrackedLimitedDate = periodSettings.backtrackedLimitedDate
              ? periodSettings.backtrackedLimitedDate
              : this.backtrackedLimitedDate;
            this.yearRange = periodSettings.yearRange
              ? periodSettings.yearRange
              : this.yearRange;
          }
          this.$store.state.loading = false;
        })
        .catch((res) => {
          console.log("Config not found...");
          this.$store.state.loading = false;
        });
    },
    updateConfigData() {
      this.$store.state.loading = true;

      let key = this.generateKey(this.module);

      let periodSettings = {
        backtrackedMonth: this.backtrackedMonth,
        backtrackedYearLimit: this.backtrackedYearLimit,
        backtrackedDate: this.backtrackedDate,
        backtrackedLimitedDate: this.backtrackedLimitedDate,
        yearRange: this.yearRange,
      };

      // console.log(metaConfigData, "metaConfigData")

      let allKeys = service.getAllKeys();
      allKeys
        .then((keys) => {
          // console.log("keys", keys)
          if (keys.data.includes(key)) {
            let saveConfig = service.getSavedConfig(key);
            saveConfig.then((res) => {
              let configData = res.data;
              // console.log("configData",configData);

              if (configData[this.type]) {
                configData[this.type][this.subType] = periodSettings;
              } else {
                configData[this.type] = {
                  [this.subType]: periodSettings,
                };
              }
              let configChanges = audit.configAudit(
                this.originalPerioddata,
                configData[this.type][this.subType]
              );
              let response = service.updateConfig(configData, key);
              response
                .then((response) => {
                  if (response.data.status === "OK") {
                    // console.log("response update ", response.data)
                    this.$swal({
                      title: this.$i18n.t("data_saved_successfully"),
                    }).then(() => {
                      if (Object.keys(configChanges).length) {
                        audit.processAudit(
                          "process2",
                          key,
                          configChanges,
                          this.type,
                          this.subType
                        );
                      }
                    });
                    this.$store.commit("setGlobalFactors", {
                      payload: configData,
                    });
                    this.originalPerioddata = JSON.parse(
                      JSON.stringify(periodSettings)
                    );
                    this.$store.state.loading = false;
                  } else {
                    this.$swal({
                      title: this.$i18n.t("error"),
                      text: `${response.data.message}`,
                    });

                    this.$store.state.loading = false;
                    return;
                  }
                })
                .catch((error) => {
                  this.$swal({
                    title: this.$i18n.t("error"),
                  });

                  this.$store.state.loading = false;
                  return;
                });
            });
          } else {
            // console.log("else")
            let configData = {
              [this.type]: {
                [this.subType]: periodSettings,
              },
            };
            let response = service.saveConfig(configData, key);
            response.then((response) => {
              if (response.data.status === "OK") {
                // console.log("response save ", response.data)
                this.$swal({
                  title: this.$i18n.t("data_saved_successfully"),
                });
                this.$store.commit("setGlobalFactors", {
                  payload: configData,
                });
                this.originalPerioddata = JSON.parse(
                  JSON.stringify(periodSettings)
                );
                this.$store.state.loading = false;
              } else {
                this.$swal({
                  title: this.$i18n.t("error"),
                  text: `${response.data.message}`,
                });
                this.$store.state.loading = false;
                return;
              }
            });
          }
        })
        .catch(() => {
          this.$store.state.loading = false;
          this.$swal({
            title: this.$i18n.t("error"),
            title: this.$i18n.t("table_not_found"),
          });
        });
    },
  },
  created() {
    // console.log("created")
    this.getConfigData(); //Remove / add $store.state.loading in updated when you enable / disable this call

    (this.backtrackedLimitedDate = this.$moment(this.backtrackedDate, "YYYYMM")
      .subtract(this.backtrackedYearLimit, "years")
      .format("YYYY-MM")),
      (this.yearRange = `${this.backtrackedLimitedDate} ${this.$i18n.t(
        "toSmall"
      )} ${this.backtrackedDate}`);
  },
  updated() {
    // this.$store.state.loading = false
  },
};
</script>
