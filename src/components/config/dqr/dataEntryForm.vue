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
          <label>{{ $t("dataElement") }}</label>
          <input
            type="text"
            class="form-control"
            placeholder=""
            v-model="dataEntryID"
            disabled
          />
        </div>
        <div class="form-group admin-theme">
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
      <b-button class="black-btn btn-sm ml-3 blue-btn" @click="addData()">
        {{ $t("addbtn") }}
      </b-button>
    </template>
  </b-modal>
</template>
<script>
import service from "@/service";
import Treeselect from "@riophae/vue-treeselect";
import { decompress } from "compress-json";
import DataEntryMixin from "@/helpers/DataEntryMixin";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import loadLocChildMixin from "@/helpers/LoadLocationChildMixin";
import NepaliDate from "nepali-date-converter";

export default {
  props: ["isDataEntry", "dataEntryID", "bgDataType"],
  components: {
    Treeselect,
  },
  mixins: [DataEntryMixin, loadLocChildMixin],
  data() {
    return {
      // isForm: this.isDataEntry,
      isForm: false,
      defaultExpandLevel: 1,
      locationList: [],
      location: null,
      period: [],
      periodList: [],
      currentYear: this.$store.getters.getAppSettings.calendar === "nepali" ? new NepaliDate(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      )).getBS().year : new Date().getFullYear(),
      data: [],
      allData: [],
      fileName: "",
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
    showUploadCsv() {
      this.$refs["uploadCsv"].show();
    },
    hideUploadCsv() {
      this.$refs["uploadCsv"].hide();
    },
    updateFileName() {
      this.fileName = event.target.files[0];
    },
    readFile() {
      this.$papa.parse(this.fileName, {
        header: true,
        complete: this.onComplete,
      });
    },
    onComplete(results) {
      console.log(results);
      let report = [];
      results.data.map((val) => {
        let arr = [];
        for (let i in val) {
          arr.push(val[i]);
        }
        report.push(arr);
      });
      console.log("report", report);
      this.hideUploadCsv();
    },
    getData(isLocationChanged = false) {
      this.$store.commit("setLoading", true);
      let key = this.getKey({
        dataEntryID: this.dataEntryID,
        bgDataType: this.bgDataType,
        orgLevel: this.location.split("/")[0],
      }); //Mixin method
      service
        .getSavedConfig({ tableKey: key })
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
          this.$store.commit("setLoading", false);
          this.isForm = this.isDataEntry;
          if (isLocationChanged) {
            this.updatedLocationValue();
          }
        })
        .catch(() => {
          this.$store.commit("setLoading", false);
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
      this.$store.commit("setLoading", true);
      let key = this.getKey({
        dataEntryID: this.dataEntryID,
        bgDataType: this.bgDataType,
        orgLevel: this.location.split("/")[0],
      }); //Mixin method
      this.uploadData(key, this.data); //Mixin method
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
            "January",
            "February",
            "March",
            "April;",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
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
          
          if(this.$store.getters.getAppSettings.calendar === "nepali"){
            months = [
            "Baisakh",
            "Jestha",
            "Ashad",
            "Shrawan",
            "Bhadra",
            "Ashoj",
            "Kartik",
            "Mangsir",
            "Poush",
            "Magh",
            "Falgun",
            "Chaitra",
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
    let d = new Date();
    console.log(
      )
  },
};
</script>
