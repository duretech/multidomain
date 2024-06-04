<template>
  <b-modal
    v-model="isModal"
    size="xl"
    class="modal-fullscreen1 home-popup"
    hide-footer
    centered
    :title="$t('uAnalytics')"
    no-close-on-backdrop
  >
    <div class="" id="modal-newanc" :class="{ 'text-center': !isFetched }">
      <template v-if="isFetched">
        <b-row class="mb-4 text-right">
          <b-col cols="12">
              <b-button
                class="ml-2"
                :variant="f.id === frequency ? 'success' : 'secondary'"
                v-for="f in frequencyList"
                :key="'frequency-' + f.id"
                @click="frequency = f.id"
                >{{ f.text }}</b-button
              >
              <b-button class="ml-2" v-if="!showCustomDates" @click="showCustomDates = true"
                >{{ $t("customDates") }}</b-button
              >
              <Datepicker
                v-if="showCustomDates"
                v-model="customPeriod"
                type="date"
                range
                class="w-25 form-control ml-2 p-0"
              ></Datepicker>
          </b-col>
        </b-row>
        <div>
          <!-- <div style="height: calc(100vh - 115px); overflow: hidden auto"> -->
          <template>
            <b-row class="mb-4">
              <b-col sm="6" class="anc-charts">
                <HighChartComponent
                  :chartData="uByLocObj"
                  :chartType="'regional'"
                  :dataFetched="uByLocObj?.series?.length || true"
                  class="border-greyright"
                />
              </b-col>
              <b-col sm="6" class="anc-charts">
                <HighChartComponent
                  :chartType="'period'"
                  :chartData="uByDateObj"
                  :dataFetched="uByDateObj?.series?.length || true"
                  class="border-greyright"
                />
              </b-col>
            </b-row>
          </template>
          <hr/>
          <template>
            <b-row>
              <b-col>
                <b-row class="small">
                  <b-col sm="8">
                    <strong>{{ $t("mByLocUser") }} - {{ fText }}</strong>
                  </b-col>
                  <b-col sm="4" class="text-right" v-if="mByLocUser.length">
                    <download-csv
                      class="btn color-white cursor-pointer p-0 text-left"
                      :data="mByLocUser"
                      ><img
                        :src="
                          require(`@/assets/images/icons/downloadnewActive.svg`)
                        "
                        :style="{
                          filter: filterColor,
                        }"
                        v-b-tooltip.hover
                        :title="$t('downloadIcon')"
                        class="img-fluid icon1 cursor-pointer"
                    /></download-csv>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col sm="12">
                    <b-table
                      hover
                      bordered
                      responsive
                      show-empty
                      sticky-header
                      :items="mByLocUser"
                      :fields="mByLocUserFields"
                      head-variant="light"
                      :empty-text="$t('no_data_to_display')"
                    >
                    </b-table>
                  </b-col>
                </b-row>
              </b-col>
              <b-col>
                <b-row class="small">
                  <b-col sm="8">
                    <strong>{{ $t("mByLoc") }} - {{ fText }}</strong>
                  </b-col>
                  <b-col sm="4" class="text-right" v-if="mByLoc.length">
                    <download-csv
                      class="btn color-white cursor-pointer p-0 text-left"
                      :data="mByLoc"
                      ><img
                        :src="
                          require(`@/assets/images/icons/downloadnewActive.svg`)
                        "
                        :style="{
                          filter: filterColor,
                        }"
                        v-b-tooltip.hover
                        :title="$t('downloadIcon')"
                        class="img-fluid icon1 cursor-pointer"
                    /></download-csv>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col sm="12">
                    <b-table
                      hover
                      bordered
                      responsive
                      show-empty
                      sticky-header
                      :items="mByLoc"
                      :fields="mByLocFields"
                      head-variant="light"
                      :empty-text="$t('no_data_to_display')"
                    >
                    </b-table>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </template>
          <hr/>
          <template>
            <b-row>
              <b-col>
                <b-row class="small test">
                  <b-col sm="8">
                    <strong>{{ $t("mByUser") }} - {{ fText }}</strong>
                  </b-col>
                  <b-col sm="4" class="text-right" v-if="mByUser.length">
                    <b-form-checkbox
                      v-model="isMUnique"
                      name="check-button"
                      switch
                      size="sm"
                      inline
                    >
                      {{ $t("uniqueOnly") }}
                    </b-form-checkbox>
                    <download-csv
                      class="btn color-white cursor-pointer p-0 text-left"
                      :data="mByUserTableItems"
                      :fields="csvFields"
                      ><img
                        :src="
                          require(`@/assets/images/icons/downloadnewActive.svg`)
                        "
                        :style="{
                          filter: filterColor,
                        }"
                        v-b-tooltip.hover
                        :title="$t('downloadIcon')"
                        class="img-fluid icon1 cursor-pointer"
                    /></download-csv>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col sm="12">
                    <b-table
                      hover
                      bordered
                      responsive
                      show-empty
                      sticky-header
                      :items="mByUser"
                      :fields="mByUserFields"
                      head-variant="light"
                      :empty-text="$t('no_data_to_display')"
                      class="table-user"
                    >
                    </b-table>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </template>
        </div>
      </template>
      <template v-else>
        <b-spinner type="grow" label="Spinning"></b-spinner>
      </template>
    </div>
  </b-modal>
</template>
<script>
import service from "@/service";
import Datepicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import { commonChartConfig } from "@/config/basicChartConfig";
import { getDateTimestamp } from "@/components/Common/commonFunctions";

export default {
  props: ["showModal"],
  mixins: [DynamicImageMixin],
  components: {
    HighChartComponent: () =>
      import(
        /* webpackChunkName: "HighChartComponentDynamic"*/ "@/components/Highcharts/HighChartComponentDynamic"
      ),
    Datepicker,
  },
  data() {
    return {
      mByUserFields: [],
      csvFields: [],
      mByUserTableItems: [],
      mByLocFields: [],
      isMUnique: false,
      frequency: "ALL",
      isFetched: false,
      analyticsData: {},
      mByLocUserFields: [],
      isModal: this.showModal,
      uByLocObj: JSON.parse(JSON.stringify(commonChartConfig)),
      uByDateObj: JSON.parse(JSON.stringify(commonChartConfig)),
      customPeriod: [],
      showCustomDates: null,
    };
  },
  computed: {
    frequencyList() {
      return [
        { id: 1, text: this.$i18n.t("today") },
        { id: 7, text: this.$i18n.t("nDays", { n: 7 }) },
        { id: 15, text: this.$i18n.t("nDays", { n: 15 }) },
        { id: 30, text: this.$i18n.t("nDays", { n: 30 }) },
        { id: "ALL", text: this.$i18n.t("allTime") },
      ];
    },
    filteredAData() {
      let aData = {},
        tD = getDateTimestamp({ isTimestamp: true });

      if (this.frequency === "ALL") {
        this.customPeriod = [];
        this.showCustomDates = null;
        aData = JSON.parse(JSON.stringify(this.analyticsData));
      } else if (this.frequency === 1) {
        this.customPeriod = [];
        this.showCustomDates = null;
        if (this.analyticsData[tD]) {
          aData[tD] = this.analyticsData[tD];
        }
      } else if (this.frequency === "custom") {
        let tFD1 = new Date(this.customPeriod[0]).getTime();
        let tFD2 = new Date(this.customPeriod[1]).getTime();
        if (tFD1 && tFD2) {
          Object.keys(this.analyticsData).forEach((a) => {
            if (a * 1 >= tFD1 && a * 1 !== tFD2) {
              aData[a] = this.analyticsData[a];
            }
          });
        }
      } else {
        this.customPeriod = [];
        this.showCustomDates = null;
        let tFD = getDateTimestamp({ isTimestamp: true, f: this.frequency });
        if (tFD) {
          Object.keys(this.analyticsData).forEach((a) => {
            if (a * 1 >= tFD && a * 1 !== tD) {
              aData[a] = this.analyticsData[a];
            }
          });
        }
      }
      return aData;
    },
    mByUser() {
      let m = [];
      Object.keys(this.filteredAData).forEach((a) => {
        this.filteredAData[a].forEach((u) => {
          let isU = m.findIndex(
            (mI) => mI[this.$i18n.t("identifier")] === u.uId
          );
          if (isU >= 0) {
            u.usesData
              .filter((us) => us.type === "module")
              .forEach((us) => {
                let n = this.$i18n.t("default");
                if (us.namespace.includes("_mnch-dashboard")) {
                  n = this.$i18n.t("maternalHealth");
                }
                if (us.namespace.includes("_fp-dashboard")) {
                  n = this.$i18n.t("family_planning");
                }
                let k = `${us.moduleName} (${n})`;
                if (m[isU][`${k}`] === undefined) {
                  m[isU][`${k}`] = this.isMUnique ? 1 : us.visitCount;
                  this.setFields({
                    key: "mByUserFields",
                    tKey: k,
                  });
                } else {
                  m[isU][`${k}`] = this.isMUnique
                    ? m[isU][`${k}`] * 1 + 1
                    : m[isU][`${k}`] * 1 + us.visitCount * 1;
                }
              });
          } else {
            let oIn = {
              [this.$i18n.t("identifier")]: u.uId,
              [this.$i18n.t("name")]: u.uName,
              [this.$i18n.t("admin")]: u.isAdmin ? "Yes" : "No",
              [this.$i18n.t("location")]: u.orgAccess,
            };
            this.setFields({
              key: "mByUserFields",
              tKey: this.$i18n.t("identifier"),
              position: 1,
            });
            this.setFields({
              key: "mByUserFields",
              tKey: this.$i18n.t("name"),
              position: 2,
            });
            this.setFields({
              key: "mByUserFields",
              tKey: this.$i18n.t("admin"),
              position: 3,
            });
            this.setFields({
              key: "mByUserFields",
              tKey: this.$i18n.t("location"),
              position: 4,
            });
            u.usesData
              .filter((us) => us.type === "module")
              .forEach((us) => {
                let n = this.$i18n.t("default");
                if (us.namespace.includes("_mnch-dashboard")) {
                  n = this.$i18n.t("maternalHealth");
                }
                if (us.namespace.includes("_fp-dashboard")) {
                  n = this.$i18n.t("family_planning");
                }
                let k = `${us.moduleName} (${n})`;
                oIn[k] = this.isMUnique ? 1 : us.visitCount;
                this.setFields({
                  key: "mByUserFields",
                  tKey: k,
                });
              });
            m.push(oIn);
          }
        });
      });
      m.forEach((item) => {
        let obj = {};
        this.csvFields.forEach((col) => {
          // if (item[col]) {
          obj[col] = item[col] ? item[col] : "";
          //}
        });
        this.mByUserTableItems.push(obj);
      });
      
      return m;
    },
    fText() {
      let str = "";
      let isF = this.frequencyList.find((f) => f.id === this.frequency);
      if (isF) {
        str = isF.text;
      }
      return str;
    },
    uByLoc() {
      let t = [
        {
          name: this.$i18n.t("uByLoc"),
          data: [],
        },
      ];
      if (this.mByUser.length) {
        this.mByUser.forEach((m) => {
          let tIndex = t[0].data.findIndex(
            (tIn) => tIn.name === m[this.$i18n.t("location")]
          );
          if (tIndex >= 0) {
            t[0].data[tIndex].y += 1;
          } else {
            t[0].data.push({
              name: m[this.$i18n.t("location")],
              y: 1,
            });
          }
        });
      }
      return t;
    },
    uByDate() {
      let t = [
        {
          name: this.$i18n.t("uByDate"),
          data: [],
        },
      ];
      Object.keys(this.filteredAData).forEach((a) => {
        let d = getDateTimestamp({ t: a * 1 });
        t[0].data.push({
          name: d,
          y: this.filteredAData[a].length,
        });
      });
      return t;
    },
    mByLocUser() {
      let m = [];
      Object.keys(this.filteredAData).forEach((a) => {
        this.filteredAData[a].forEach((u) => {
          u.usesData
            .filter((us) => us.type === "module")
            .forEach((us) => {
              let n = this.$i18n.t("default");
              if (us.namespace.includes("_mnch-dashboard")) {
                n = this.$i18n.t("maternalHealth");
              }
              if (us.namespace.includes("_fp-dashboard")) {
                n = this.$i18n.t("family_planning");
              }
              let k = `${us.moduleName} (${n})`;

              let isU = m.findIndex((mI) => mI[this.$i18n.t("module")] === k);
              if (isU >= 0) {
                m[isU] = {
                  ...m[isU],
                  [this.$i18n.t("tCount")]:
                    m[isU][this.$i18n.t("tCount")] * 1 + us.visitCount * 1,
                };
              } else {
                m.push({
                  [this.$i18n.t("module")]: k,
                  [this.$i18n.t("tCount")]: us.visitCount * 1,
                });
              }
            });
        });
      });
      m.sort((a, b) => b[this.$i18n.t("tCount")] - a[this.$i18n.t("tCount")]);
      return m;
    },
    mByLoc() {
      let m = [];
      Object.keys(this.filteredAData).forEach((a) => {
        this.filteredAData[a].forEach((u) => {
          u.usesData
            .filter((us) => us.type === "module")
            .forEach((us) => {
              let n = this.$i18n.t("default");
              if (us.namespace.includes("_mnch-dashboard")) {
                n = this.$i18n.t("maternalHealth");
              }
              if (us.namespace.includes("_fp-dashboard")) {
                n = this.$i18n.t("family_planning");
              }
              let k = `${us.moduleName} (${n})`;

              let isU = m.findIndex((mI) => mI[this.$i18n.t("module")] === k);
              if (isU >= 0) {
                m[isU] = {
                  ...m[isU],
                  [this.$i18n.t("tCount")]:
                    m[isU][this.$i18n.t("tCount")] * 1 + us.visitCount * 1,
                };
              } else {
                m.push({
                  [this.$i18n.t("module")]: k,
                  [this.$i18n.t("location")]: u.orgAccess,
                  [this.$i18n.t("tCount")]: us.visitCount * 1,
                });
              }
            });
        });
      });
      m.sort((a, b) => b[this.$i18n.t("tCount")] - a[this.$i18n.t("tCount")]);
      return m;
    },
  },
  watch: {
    showModal(newValue) {
      this.isModal = newValue;
    },
    isModal(newValue) {
      if (!newValue) {
        this.$emit("hideModal");
      }
    },
    frequency(newValue) {
      if (newValue) {
        this.mByUserFields = [];
        this.mByLocFields = [];
        this.mByLocUserFields = [];
        this.uByLocObj.series = [];
        this.uByDateObj.series = [];
      }
    },
    fText(newValue) {
      if (newValue) {
        this.setTitles(newValue);
      }
    },
    uByLoc: {
      handler(newValue) {
        this.uByLocObj.chart.type = "column";
        if (newValue[0].data.length) {
          this.uByLocObj.series = newValue;
        }
      },
      deep: true,
    },
    uByDate: {
      handler(newValue) {
        if (newValue[0].data.length) {
          this.uByDateObj.series = newValue;
        }
      },
      deep: true,
    },
    customPeriod(newVal) {
      if (newVal.length == 2) {
        this.frequency = "custom";
      }
    }
  },
  methods: {
    setFields({ key = null, tKey = null, sortable = true }) {
      if (key && tKey) {
        let isUId = this[key].find((m) => m.key === tKey);
        if (!isUId) {
          this[key].push({
            sortable,
            key: tKey,
          });
          if (key === "mByUserFields") {
            this.csvFields.push(tKey);
          }
        }
      }
    },
    setCaption({ key = null, title = null }) {
      if (key && title) {
        this[key] = `${title} - `;
        let isF = this.frequencyList.find((f) => f.id === this.frequency);
        if (isF) {
          this[key] += isF.text;
        }
      }
    },
    getData() {
      service
        .getAllKeys({
          isUses: true,
        })
        .then(async (res) => {
          if (res.data.length) {
            let promises = [];
            res.data.forEach((r) => {
              promises.push(
                service.getSavedConfig({ tableKey: r, isUses: true })
              );
            });
            Promise.all(promises).then((result) => {
              let aData = {};
              for (let i = 0; i < result.length; i++) {
                let key = result[i].config.url.split("_uses/")[1];
                aData[key] = result[i].data;
                if (i === result.length - 1) {
                  this.analyticsData = aData;
                  this.isFetched = true;
                }
              }
            });
          }
        })
        .catch((err) => {
          this.isFetched = true;
        });
    },
    setTitles(t = this.fText) {
      this.uByLocObj.title.title = `${this.$i18n.t("uByLoc")} - ${t}`;
      this.uByDateObj.title.title = `${this.$i18n.t("uByDate")} - ${t}`;
    },
  },
  created() {
    this.getData();
    this.setTitles();
  },
  // mounted(){
  //   // process.env.NODE_ENV !== "production"
  //   //       ? this
  //   //       : LZString.compressToUTF16(JSON.stringify(payload));
  // }
};
</script>