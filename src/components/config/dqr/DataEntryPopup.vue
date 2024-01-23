<template>
  <b-modal
    centered
    hide-footer
    v-model="showModal"
    no-close-on-backdrop
    :title="popupType === 'upload' ? $t('UploadIcon') : $t('downloadIcon')"
  >
    <div>
      <b-row>
        <b-col sm="4">
          <label for="org-list">{{ $t("orgLevel") }}</label>
        </b-col>
        <b-col sm="8">
          <b-form-select v-model="orgLevel" :options="orgList"></b-form-select>
        </b-col>
      </b-row>
      <b-row v-if="popupType === 'upload'">
        <b-col sm="4">
          <label for="csv-file">{{ $t("selectFiles") }}</label>
        </b-col>
        <b-col sm="8">
          <input
            type="file"
            class="form-control-file"
            style="font-size: 0.9375rem"
            name="csv-file"
            ref="csv-file"
            @change="onFileChange"
            id="csv-file"
            accept=".csv"
          />
        </b-col>
      </b-row>
      <b-row>
        <b-col class="text-right">
          <b-button
            class="mt-2 black-btn blue-btn mx-1 btn-sm"
            @click="submit"
            :disabled="!orgLevel"
            >{{ $t("submitbtn") }}</b-button
          >
        </b-col>
      </b-row>
    </div>
  </b-modal>
</template>
<script>
import service from "@/service";
import { decompress } from "compress-json";
import DataEntryMixin from "@/helpers/DataEntryMixin";
export default {
  props: ["popupType", "bgDataType", "dataEntryID", "isPopupEntry", "isFromIC"],
  mixins: [DataEntryMixin],
  data() {
    return {
      allData: [],
      orgLevel: null,
      showModal: this.isPopupEntry,
    };
  },
  watch: {
    isPopupEntry(newValue) {
      console.log("newValue", newValue);
      this.showModal = newValue;
    },
    showModal(newValue) {
      if (!newValue) {
        this.$emit("hidePopup");
      }
    },
  },
  computed: {
    orgList() {
      let org = [];
      if (this.$store.getters.getOrgLevels?.length) {
        org = this.$store.getters.getOrgLevels.map((o) => ({
          value: o.level,
          text: o.name,
        }));
      }
      return org;
    },
  },
  methods: {
    onFileChange(event) {
      this.fileName = event.target.files[0];
    },
    submit() {
      this.$store.commit("setLoading", true);
      if (this.popupType === "upload") {
        this.$papa.parse(this.fileName, {
          header: true,
          complete: this.onComplete,
        });
      } else {
        let key = this.getKey({
          dataEntryID: this.dataEntryID,
          bgDataType: this.bgDataType,
          orgLevel: this.orgLevel,
        }); //Mixin method

        let objKey = { tableKey: key };

        if(this.isFromIC){
          objKey["namespace"] = "fp-dashboard"
        }

        service
          .getSavedConfig(objKey)
          .then((response) => {
            let transData =
              typeof response.data.rows == "string"
                ? {
                    ...response.data,
                    rows: decompress(JSON.parse(response.data.rows)),
                  }
                : response.data;
            let allData = transData.rows
              .filter((d) => d[0] === this.dataEntryID)
              .map((val) => ({
                [this.$i18n.t("dataElement")]: val[0],
                [this.$i18n.t("period")]: val[1],
                [this.$i18n.t("orgUnits")]: val[2],
                [this.$i18n.t("value")]: val[3],
              }));
            this.$papa.download(this.$papa.unparse(allData), key);
            this.emitMethods(); //Mixin method
          })
          .catch(() => {
            this.sweetAlert({
              title: this.$i18n.t("oops"),
              text: this.$i18n.t("noData"),
            });
            this.emitMethods(); //Mixin method
            console.log(key, " Not found");
          });
      }
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
      let key = this.getKey({
        dataEntryID: this.dataEntryID,
        bgDataType: this.bgDataType,
        orgLevel: this.orgLevel,
      }); //Mixin method
      this.uploadData(key, report); //Mixin method
    },
  },
};
</script>