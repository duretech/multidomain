<template>
  <div clas="">
    <b-card>
      <b-row>
        <b-col sm="12" class="text-right mb-3" v-if="allExtData.length">
          <b-form-input
            type="text"
            v-model="searchText"
            :placeholder="$t('search')"
            class="w-25"
          ></b-form-input>
        </b-col>
        <b-col sm="12">
          <div class="accordion no-header" role="tablist">
            <b-card no-body class="mb-1">
              <b-card-header
                header-tag="header"
                class="p-1 map-header"
                role="tab"
              >
                <b-button block v-b-toggle.accordion-bench1 variant="info">{{
                  $t("extData")
                }}</b-button>
              </b-card-header>
              <b-collapse
                id="accordion-bench1"
                visible
                accordion="my-benchaccordion"
                role="tabpanel"
                class="accordion-delete"
              >
                <b-card-body>
                  <b-card-text>
                    <b-col sm="12">
                      <div class="accordion" role="tablist">
                        <b-card
                          no-body
                          class="mb-1"
                          v-for="(eData, eInd) in filteredExtData"
                          :key="eData.id"
                        >
                          <div class="p-2" role="tab">
                            <img
                              src="@/assets/images/icons/admindelete-icon.svg"
                              :style="{ filter: filterColor }"
                              class="cursor-pointer f-s-0-875rem w-13 mr-2"
                              v-b-tooltip.hover
                              :title="$t('deletebtn')"
                              @click.prevent.stop="deleteExtData(eData.id)"
                            />
                            <b-button
                              v-b-toggle="'accordion-' + eInd"
                              class="btn-link p-0 text-uppercase color-grey f-s-0-875rem bg-transparent border-0"
                            >
                              <img
                                src="@/assets/images/icons/adminsetting-icon.svg"
                                :style="{ filter: filterColor }"
                                class="mr-2 cursor-pointer f-s-0-875rem w-14"
                                v-b-tooltip.hover
                                :title="$t('settings')"
                              />
                              {{ eData.displayName[$i18n.locale] }}</b-button
                            >
                          </div>
                          <div class="bordertop-grey mt-2"></div>
                          <b-collapse
                            :id="'accordion-' + eInd"
                            accordion="my-accordion"
                            role="tabpanel"
                            class="border-bottomgrey"
                          >
                            <b-card-body>
                              <b-row class="">
                                <b-col sm="12" lg="6" class="mb-3">
                                  <b-row>
                                    <b-col sm="5"
                                      ><label :for="`displayName-${eInd}`">{{
                                        $t("name")
                                      }}</label>
                                    </b-col>
                                    <b-col sm="7">
                                      <b-input-group
                                        :id="`displayName-${eInd}`"
                                      >
                                        <b-form-input
                                          type="text"
                                          v-model="
                                            eData.displayName[$i18n.locale]
                                          "
                                          disabled
                                        ></b-form-input>
                                        <b-input-group-append is-text>
                                          <Translations
                                            :transText.sync="eData.displayName"
                                          />
                                        </b-input-group-append>
                                      </b-input-group>
                                    </b-col>
                                  </b-row>
                                </b-col>
                                <b-col sm="12" lg="6" class="mb-3">
                                  <b-row>
                                    <b-col sm="5"
                                      ><label :for="`color-${eInd}`">{{
                                        $t("line_color")
                                      }}</label>
                                    </b-col>
                                    <b-col sm="7">
                                      <b-input-group :id="`color-${eInd}`">
                                        <b-form-input
                                          type="text"
                                          v-model="eData.color"
                                        ></b-form-input>
                                        <b-input-group-append>
                                          <b-form-input
                                            type="color"
                                            class="w-40px"
                                            v-model="eData.color"
                                          ></b-form-input>
                                        </b-input-group-append>
                                      </b-input-group>
                                    </b-col>
                                  </b-row>
                                </b-col>
                                <b-col sm="12" lg="6">
                                  <b-row class="mb-3">
                                    <b-col sm="5">
                                      <label :for="`value-${eInd}`">{{
                                        $t("value")
                                      }}</label>
                                    </b-col>
                                    <b-col sm="7">
                                      <b-button
                                        class="black-btn blue-btn btn-sm"
                                        v-on:click="
                                          dataEntry(`externalData-${eData.id}`)
                                        "
                                        >{{ $t("dataEntry") }}</b-button
                                      >
                                    </b-col>
                                  </b-row>
                                </b-col>
                              </b-row>
                            </b-card-body>
                          </b-collapse>
                        </b-card>
                      </div>
                    </b-col>
                    <b-col
                      sm="12"
                      class="text-center"
                      v-if="allExtData.length && filteredExtData.length === 0"
                    >
                      {{ $t("noBenchmark") }}
                    </b-col>
                  </b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>
        </b-col>
        <b-col sm="12" class="text-center" v-if="allExtData.length === 0">
          {{ $t("addExtData") }}
          <code>{{ $t("addbtn") }}</code> {{ $t("btnBelow") }}
        </b-col>
        <b-col sm="12" class="text-right pt-3">
          <b-button class="black-btn ml-2" @click="addExtData">{{
            $t("addbtn")
          }}</b-button>
          <b-button
            class="black-btn save-btn ml-2"
            @click="updateConfigData"
            v-if="allExtData.length"
            >{{ $t("savebtn") }}</b-button
          >
        </b-col>
      </b-row>
      <dataEntryForm
        v-if="isDataEntry"
        :isDataEntry="isDataEntry"
        :dataEntryID="dataEntryID"
        @hideModal="hideModal"
      />
    </b-card>
  </div>
</template>
<script>
import service from "@/service";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import ReFetchConfigMixin from "@/helpers/ReFetchConfigMixin";
import { randomString } from "@/components/Common/commonFunctions";

const dataConfig = {
  id: null,
  displayName: {},
  color: "#000000",
};
export default {
  props: ["module", "type", "subType"],
  mixins: [DynamicImageMixin, ReFetchConfigMixin],
  components: {
    Translations: () =>
      import(
        /*webpackChunkName: 'translations'*/ "@/components/config/Common/Translations"
      ),
    dataEntryForm: () =>
      import(
        /*webpackChunkName: 'dataEntryForm'*/ "@/components/config/dqr/dataEntryForm"
      ),
  },
  data() {
    return {
      searchText: "",
      allExtData: [],
      dataEntryID: "",
      isDataEntry: false,
    };
  },
  computed: {
    filteredExtData() {
      let list = this.allExtData;
      list = list.filter((l) =>
        l.displayName[this.$i18n.locale]
          .toLowerCase()
          .includes(this.searchText.toLowerCase())
      );
      return list;
    },
  },
  methods: {
    hideModal() {
      this.dataEntryID = "";
      this.isDataEntry = false;
    },
    dataEntry(id) {
      this.dataEntryID = id;
      this.isDataEntry = true;
    },
    //To delete external data
    deleteExtData(id) {
      this.$swal({
        title: this.$i18n.t("areyousure"),
        text: this.$i18n.t("youablerevertthis"),
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: this.$i18n.t("yes_delete_it"),
        cancelButtonText: this.$i18n.t("cancelbtn"),
      }).then((result) => {
        if (result.value) {
          this.allExtData = this.allExtData.filter((b) => b.id !== id);
        }
      });
    },
    //To add new external data
    addExtData() {
      let config = JSON.parse(JSON.stringify(dataConfig));
      this.allExtData.push({
        ...config,
        id: randomString(16),
        displayName: { [this.$i18n.locale]: this.$i18n.t("default") },
      });
    },
    //This is to fetch config data on page load
    getConfigData() {
      this.$store.state.loading = true;
      let key = this.generateKey(this.module);

      let response = service.getSavedConfig(key);
      response
        .then((response) => {
          if (response.data[this.type][this.subType]) {
            this.allExtData = response.data[this.type][this.subType];
          }
          this.$store.state.loading = false;
        })
        .catch((err) => {
          console.log("Config not found...", err);
          this.$store.state.loading = false;
          this.reFetchConfig(err);
        });
    },
    updateConfigData() {
      this.$store.state.loading = true;
      let extData = this.allExtData;

      let key = this.generateKey(this.module);

      let allKeys = service.getAllKeys();
      allKeys.then((keys) => {
        if (keys.data.includes(key)) {
          let saveConfig = service.getSavedConfig(key);
          saveConfig.then((res) => {
            let configData = res.data;
            if (!configData[this.type]) {
              configData[this.type] = {};
            }
            configData[this.type][this.subType] = extData;
            let response = service.updateConfig(configData, key);
            response
              .then((response) => {
                if (response.data.status === "OK") {
                  this.sweetAlert({
                    title: this.$i18n.t("data_saved_successfully"),
                  });
                  this.$store.commit("setGlobalFactors", {
                    payload: configData,
                  });
                  this.$store.state.loading = false;
                } else {
                  this.sweetAlert({
                    title: this.$i18n.t("error"),
                    text: `${response.data.message}`,
                  });

                  this.$store.state.loading = false;
                  return;
                }
              })
              .catch((error) => {
                this.sweetAlert({
                  title: this.$i18n.t("error"),
                  text: error,
                });

                this.$store.state.loading = false;
                return;
              });
          });
        } else {
          let configData = {
            [this.type]: {
              [this.subType]: extData,
            },
          };
          let response = service.saveConfig(configData, key);
          response.then((response) => {
            if (response.data.status === "OK") {
              this.sweetAlert({
                title: this.$i18n.t("data_saved_successfully"),
              });
              this.$store.commit("setGlobalFactors", {
                payload: configData,
              });
              this.$store.state.loading = false;
            } else {
              this.sweetAlert({
                title: this.$i18n.t("error"),
                text: `${response.data.message}`,
              });
              this.$store.state.loading = false;
              return;
            }
          });
        }
      });
    },
  },
  created() {
    this.getConfigData();
  },
};
</script>
