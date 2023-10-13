<template>
  <b-modal
    v-model="isModal"
    size="m"
    class="modal-fullscreen1 home-popup"
    hide-footer
    centered
    :title="$t('uploadAppSetting')"
    no-close-on-backdrop
  >
    <div class="" id="modal-newanc">
      <!-- v-if="isFetched" :class="{ 'text-center': !isFetched }"-->
      <div class="form-group row">
        <label
          for="inputDashboardDescription"
          class="col-sm-4 col-form-label"
          >{{ $t("selectFiles") }}</label
        >
        <div class="col-sm-8 p-t-4px">
          <input
            type="file"
            multiple
            class="form-control-file"
            style="font-size: 0.9375rem"
            name="configFile"
            ref="configFile"
            @change="onFileChange"
            id="ConfigFile"
            accept="application/ZIP"
          />
        </div>
      </div>
      <div class="row m-t-20px">
        <div class="col-sm-12 text-right">
          <button
            type="button"
            class="btn btn-primary btn-sm new-btn1 blue-btn"
            v-on:click="uploadFile"
          >
            {{ $t("upload") }}
          </button>
        </div>
      </div>
      <!-- <template v-else>
        <b-spinner type="grow" label="Spinning"></b-spinner>
      </template> -->
    </div>
  </b-modal>
</template>

<script>
import service from "@/service";
import JSZip from "jszip";
export default {
  props: ["showModal"],
  components: {},
  data() {
    return {
      isModal: this.showModal,
      selectedFiles: {},
      updConfig: false,
    };
  },
  computed: {},
  watch: {
    isModal(newValue) {
      console.log(newValue, "isModal");
      if (!newValue) {
        this.$emit("hideModal");
      }
    },
  },
  methods: {
    uploadFile() {
      this.$store.commit("setLoading", true);
      service
        .getAllKeys({})
        .then((res) => {
          this.processUploadFile(res);
        })
        .catch(() => {
          this.processUploadFile();
        });
    },
    async processUploadFile(res = null) {
      let fileSuccess = [],
        // fileDuplicate = [],
        fileError = [],
        promises = [],
        files = [];
      Object.keys(this.selectedFiles).forEach((key) => {
        // if (res && res.data.includes(key)) {
        //   fileDuplicate.push(key);
        // } else {
        files.push(key);
        this.$store.commit("setAppSettings", this.selectedFiles[key]);
        promises.push(
          service.updateConfig({
            data: this.selectedFiles[key],
            tableKey: key,
            namespace: "",
            isUses: false,
            isAudit: false,
            isDefault: true,
          })
        );
        // }
      });
      await Promise.allSettled(promises).then((results) => {
        results.forEach((response, i) => {
          if (response.status === "fulfilled") {
            fileSuccess.push(files[i]);
          } else {
            fileError.push(files[i]);
          }
        });
      });
      this.$store.commit("setLoading", false);
      let successText = this.createStatusText(
        fileSuccess,
        "success",
        "success"
      );
      // let duplicateText = this.createStatusText(
      //   fileDuplicate,
      //   "ignored",
      //   "info"
      // );
      let errorText = this.createStatusText(fileError, "error", "danger");
      this.$swal({
        title: this.$i18n.t("status"),
        html: `<div>${successText} ${errorText}</div>`,
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: this.$i18n.t("dashboard"),
        cancelButtonText: this.$i18n.t("ok"),
      }).then((result) => {
        this.$emit("uploadSuccess");
        if (result.value) {
          this.$router.push("/");
        } else {
          this.$router.go();
        }
      });
      this.resetFileDetails();
    },
    createStatusText(files, textType, textClass) {
      let text = "";
      if (files.length) {
        let textLI = "";
        files.forEach((f) => {
          textLI += `<li class="text-left">${f}</li>`;
        });
        text = `<div>
          <div class="text-left">
            <strong class="text-${textClass}">${this.$i18n.t(
          `${textType}Head`
        )}</strong> ${this.$i18n.t(`${textType}Text`, {
          fileLength: files.length,
        })}
          </div>
          <ul>
            ${textLI}
          </ul>
        </div>`;
      }
      return text;
    },
    resetFileDetails() {
      this.selectedFiles = {};
      this.$refs.configFile.value = null;
    },
    onFileChange(event) {
      this.selectedFiles = {};
      this.$store.commit("setLoading", true);
      this.$refs.configFile.files.forEach((file) => {
        var new_zip = new JSZip();
        new_zip.loadAsync(file).then(async (zip) => {
          let isDir = Object.keys(zip.files).find((f) => zip.files[f].dir);
          for (const f in zip.files) {
            if (!zip.files[f].dir) {
              let fileData = await zip.files[f].async("string");
              let fData = JSON.parse(fileData);
              // this.removeCID(fData);
              let fName = isDir ? f.split("/")[1] : f;
              fName = fName.split(".")[0];
              this.selectedFiles[fName] = fData;
            }
            if (
              Object.keys(zip.files).length ===
              Object.keys(this.selectedFiles).length
            ) {
              this.$store.commit("setLoading", false);
            }
          }
        });
      });
    },
  },
  created() {},
};
</script>
