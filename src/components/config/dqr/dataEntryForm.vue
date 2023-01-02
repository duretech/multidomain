<template>
  <b-modal
    :title="$t('dataEntry')"
    centered
    size="lg"
    v-model="isForm"
    button-size="sm"
    no-close-on-backdrop
  >
    <!-- scrollable -->
    <div class="row">
      <div class="col">
        <div class="form-group">
          <label class="">{{
            $t("dataElement")
          }}</label>
          <input
            type="text"
            class="form-control"
            placeholder=""
            v-model="dataEntryID"
            disabled
          />
        </div>
        <div class="form-group">
          <label class="">{{ $t("location") }}</label>
          <treeselect
            class=""
            :options="locationList"
            :show-count="true"
            :placeholder="$t('search')"
            v-model="location"
            :flat="false"
            :default-expand-level="defaultExpandLevel"
            :max-height="150"
            openDirection="below"
            :load-options="loadOptions"
          />
        </div>
        <div class="form-group" v-if="location">
          <label class="w-100"
            >{{ $t("period") }}
            <span
              class="float-right"
              v-if="
                (period.length < 10 &&
                  location &&
                  !dataEntryID.includes('prevalence')) ||
                (period.length < 12 &&
                  location &&
                  dataEntryID.includes('prevalence'))
              "
              ><b-button class="black-btn btn-sm ml-3" @click="nextYear">{{
                $t("next_year")
              }}</b-button>
              <b-button class="black-btn btn-sm ml-3" @click="prevYear">{{
                $t("prev_year")
              }}</b-button></span
            ></label
          >
          <treeselect
            :options="periodList"
            :multiple="true"
            :placeholder="$t('search')"
            v-model="period"
            openDirection="below"
            :max-height="150"
            sort-value-by="INDEX"
          />
        </div>
        <!-- <div
          class="text-right"
          v-if="
            (period.length < 10 &&
              location &&
              !dataEntryID.includes('prevalence')) ||
            (period.length < 12 &&
              location &&
              dataEntryID.includes('prevalence'))
          "
        >
          <b-button class="black-btn btn-sm ml-3" @click="nextYear">{{
            $t("next_year")
          }}</b-button>
          <b-button class="black-btn btn-sm ml-3" @click="prevYear">{{
            $t("prev_year")
          }}</b-button>
        </div> -->
      </div>
      <div class="col border-left">
        <div v-if="data.length > 0">
          <div class="row pb-3" v-for="(d, i) in data" :key="i">
            <div class="col-4">
              {{ d[1] }}
            </div>
            <div class="col-8">
              <input
                type="number"
                class="form-control"
                placeholder=""
                v-model="d[3]"
              />
            </div>
          </div>
        </div>
        <div class="text-center" v-else>
          {{ $t("no_data_to_display") }}
        </div>
      </div>
    </div>
    <template #modal-footer>
      <b-button class="black-btn btn-sm ml-3" @click="addData()">
        {{ $t("addbtn") }}
      </b-button>
    </template>
  </b-modal>
</template>
<script>
import service from "@/service";
import loadLocChildMixin from "@/helpers/LoadLocationChildMixin";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { compress, decompress } from "compress-json";
export default {
  props: ["isDataEntry", "dataEntryID", "bgDataType"],
  components: {
    Treeselect,
  },
  mixins: [loadLocChildMixin],
  data() {
    return {
      // isForm: this.isDataEntry,
      isForm: false,
      defaultExpandLevel: 1,
      locationList: [],
      location: null,
      period: [],
      periodList: [],
      currentYear: new Date().getFullYear(),
      data: [],
      allData: [],
    };
  },
  watch: {
    isDataEntry(newValue) {
      this.isForm = newValue;
    },
    isForm(newValue) {
      if (!newValue) {
        this.$emit("hideModal");
      }
    },
    period(newValue) {
      if (newValue.length) {
        this.data = this.data.filter((d) =>
          newValue.find((dNew) => dNew === d[1])
        );
        this.updateData(newValue);
      } else {
        this.data = [];
      }
    },
    location(newValue) {
      if (newValue) {
        this.getData(true);
      }
    },
  },
  methods: {
    getData(isLocationChanged = false) {
      this.$store.state.loading = true;
      let key = "";
      if (this.dataEntryID.includes("population")) {
        key = `population_${this.bgDataType.toLowerCase()}_${
          this.location.split("/")[0]
        }`;
      }
      if (this.dataEntryID.includes("mcpr")) {
        key = `mcpr_${this.bgDataType.toLowerCase()}_${
          this.location.split("/")[0]
        }`;
      }
      if (this.dataEntryID.includes("mcmm")) {
        key = `mcmm_${this.bgDataType.toLowerCase()}_${
          this.location.split("/")[0]
        }`;
      }
      if (this.dataEntryID.includes("psa")) {
        key = `psa_${this.location.split("/")[0]}`;
      }
      if (this.dataEntryID.includes("prevalence")) {
        key = `prevalence_${this.location.split("/")[0]}`;
      }
      if (this.dataEntryID.includes("benchmark")) {
        key = `benchmark_${this.location.split("/")[0]}`;
      }
      service
        .getSavedConfig(key)
        .then((response) => {
          let transData =
            typeof response.data.rows == "string"
              ? {
                  ...response.data,
                  rows: decompress(JSON.parse(response.data.rows)),
                }
              : response.data;
          this.allData = transData.rows.filter(
            (d) => d[0] === this.dataEntryID
          );
          this.$store.state.loading = false;
          this.isForm = this.isDataEntry;
          if (isLocationChanged) {
            this.updatedLocationValue();
          }
        })
        .catch(() => {
          this.$store.state.loading = false;
          this.allData = [];
          if (isLocationChanged) {
            this.updatedLocationValue();
          }
          this.isForm = this.isDataEntry;
          console.log(key, " Not found");
        });
    },
    updatedLocationValue() {
      let p = [];
      this.data.forEach((d) => {
        p.push(d[1] * 1);
      });
      this.data = [];
      this.$nextTick(() => {
        this.updateData(p);
      });
    },
    updateData(newValue) {
      newValue.forEach((p, i) => {
        let isFound = this.allData.find(
          (d) =>
            d[0] === this.dataEntryID &&
            d[1] === p.toString() &&
            d[2] === this.location.split("/")[1]
        );
        if (isFound) {
          let isIndexFound = this.data.findIndex(
            (d) =>
              d[0] === this.dataEntryID &&
              d[1] === p.toString() &&
              d[2] === this.location.split("/")[1]
          );
          if (isIndexFound >= 0) {
            this.data[isIndexFound][3] = isFound[3];
          } else {
            this.data.push([
              this.dataEntryID,
              p.toString(),
              this.location.split("/")[1] || "",
              isFound[3],
            ]);
          }
        } else {
          let isInnerFound = this.data.find(
            (d) =>
              d[0] === this.dataEntryID &&
              d[1] === p.toString() &&
              d[2] === this.location.split("/")[1]
          );
          if (!isInnerFound) {
            this.data.push([
              this.dataEntryID,
              p.toString(),
              this.location.split("/")[1] || "",
              "",
            ]);
          }
        }
      });
    },
    addData() {
      this.$store.state.loading = true;
      let key = "";
      if (this.dataEntryID.includes("population")) {
        key = `population_${this.bgDataType.toLowerCase()}_${
          this.location.split("/")[0]
        }`;
      }
      if (this.dataEntryID.includes("mcpr")) {
        key = `mcpr_${this.bgDataType.toLowerCase()}_${
          this.location.split("/")[0]
        }`;
      }
      if (this.dataEntryID.includes("mcmm")) {
        key = `mcmm_${this.bgDataType.toLowerCase()}_${
          this.location.split("/")[0]
        }`;
      }
      if (this.dataEntryID.includes("psa")) {
        key = `psa_${this.location.split("/")[0]}`;
      }
      if (this.dataEntryID.includes("prevalence")) {
        key = `prevalence_${this.location.split("/")[0]}`;
      }
      if (this.dataEntryID.includes("benchmark")) {
        key = `benchmark_${this.location.split("/")[0]}`;
      }
      if (key) {
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
          rows: this.data,
        };
        service
          .getSavedConfig(key)
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
              let isFound = this.data.find(
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
            for (let i = 0; i < this.data.length; i++) {
              let isFound = data.rows.find(
                (itmInner) =>
                  itmInner[0] === this.data[i][0] &&
                  itmInner[1] === this.data[i][1] &&
                  itmInner[2] === this.data[i][2]
              );
              if (!isFound) {
                updatedData.push(this.data[i]);
              }
            }

            data.rows = JSON.stringify(compress(updatedData));
            service
              .updateConfig(data, key)
              .then((response) => {
                if (response.data.status === "OK") {
                  this.$swal({
                    title: this.$i18n.t("data_saved_successfully"),
                  }).then(() => {
                    // if(Object.keys(configChanges).length) {
                    //   audit.processAudit('process2', key, configChanges, this.type, this.subType)
                    // }
                  });
                  this.$store.state.loading = false;
                  this.$emit("hideModal");
                } else {
                  this.$swal({
                    title: this.$i18n.t("error"),
                    text: `${response.data.message}`,
                  });

                  this.$store.state.loading = false;
                  this.$emit("hideModal");
                  return;
                }
              })
              .catch((error) => {
                this.$swal({
                  title: this.$i18n.t("error"),
                });

                this.$store.state.loading = false;
                this.$emit("hideModal");
                return;
              });
          })
          .catch(() => {
            let response = service.saveConfig(data, key);
            response
              .then((response) => {
                if (response.data.status === "OK") {
                  this.$swal({
                    title: this.$i18n.t("data_saved_successfully"),
                  });
                  this.$store.state.loading = false;
                  this.$emit("hideModal");
                } else {
                  this.$swal({
                    title: this.$i18n.t("error"),
                    text: `${response.data.message}`,
                  });
                  this.$store.state.loading = false;
                  this.$emit("hideModal");
                  return;
                }
              })
              .catch(() => (this.$store.state.loading = false));
          });
      } else {
        this.$swal({
          title: this.$i18n.t("error"),
        });
        this.$store.state.loading = false;
      }
    },
    nextYear() {
      this.currentYear = this.currentYear * 1 + 1;
      this.periodList = [];
      this.$nextTick(() => {
        this.getPeriods();
      });
    },
    prevYear() {
      this.currentYear = this.currentYear * 1 - 1;
      this.periodList = [];
      this.$nextTick(() => {
        this.getPeriods();
      });
    },
    getPeriods(isDefault = false) {
      if (this.dataEntryID.includes("prevalence")) {
        for (let i = 0; i < 12; i++) {
          let month = i < 9 ? `0${i + 1}` : i + 1;
          let months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          if (this.$i18n.locale === "fr") {
            months = [
              "janv.",
              "févr.",
              "mars",
              "avril",
              "mai",
              "juin",
              "juil.",
              "août",
              "sept.",
              "oct.",
              "nov.",
              "déc.",
            ];
          }
          this.periodList.push({
            id: `${this.currentYear}${month}`,
            label: `${months[i]} ${this.currentYear}`,
          });
          // if(isDefault) {
          //   this.period.push(i)
          // }
        }
      } else {
        for (let i = this.currentYear; i > this.currentYear * 1 - 10; i--) {
          this.periodList.push({ id: i, label: i });
          // if(isDefault) {
          //   this.period.push(i)
          // }
        }
      }
    },
  },
  created() {
    this.locationList = JSON.parse(
      JSON.stringify(this.$store.getters.getLocationList)
    );
    this.location = this.locationList.length ? this.locationList[0].id : null;
    this.$nextTick(() => {
      this.getData();
      this.getPeriods(true);
    });
  },
};
</script>
