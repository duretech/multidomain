<template>
  <div class="row">
    <div class="col-12 mt-3" v-for="(subInd, _j) in subIndicators" :key="_j">
      <div class="row">
        <div class="col">
          <a
            data-toggle="collapse"
            :href="'#sub_indicator0' + _i + _j"
            role="button"
            aria-expanded="false"
            :aria-controls="'sub_indicator0' + _i + _j"
            class="pr-2"
          >
            <img
              src="@/assets/images/icons/adminlink-icon.svg"
              class="mr-2 cursor-pointer f-s-0-875rem w-auto mt-lg-n1"
              :style="{ filter: filterColor }"
              v-b-tooltip.hover
              :title="$t('link_IndicatorsData_Elements')"
            />
          </a>
          <span>{{ $t(`${subInd.static_name}`) }}</span>
        </div>
      </div>
      <div class="row border-bottomgrey mt-3">
        <div class="col-lg-12">
          <div class="collapse" :id="'sub_indicator0' + _i + _j">
            <div
              class="card-header bg-faint-grey default-card-border-radius color-black f-s-0-875rem p-10px accordion-header1 f-s-0-875rem font-weight-bold bt-10"
            >
              {{ $t("settings") }}
            </div>
            <div class="card card-body admin-emucard mb-3">
              <div class="row">
                <div class="col-12">
                  <div class="form-group row">
                    <label class="col-sm-5 col-form-label">{{
                      $t("name")
                    }}</label>
                    <div class="col-sm-7">
                      <input
                        type="text"
                        class="form-control"
                        placeholder=""
                        v-model="subInd.name"
                        :disabled="type === 'backgroundIndicators'"
                      />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label class="col-sm-5 col-form-label">{{
                      $t("color")
                    }}</label>
                    <div class="col-sm-2">
                      <div class="input-group mb-2">
                        <input
                          type="color"
                          class="form-control"
                          placeholder=""
                          v-model="subInd.color"
                        />
                      </div>
                    </div>
                    <div class="col-sm-5">
                      <input
                        type="text"
                        class="form-control"
                        placeholder=""
                        v-model="subInd.color"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-12 bordertop-grey">
                  <div class="f-s-0-875rem mt-3 accordion-heading">
                    {{ $t("indicators_Data_Elements_Mapping") }}
                  </div>
                </div>
                <div class="col-12">
                  <div class="card">
                    <div class="card-body">
                      <div class="row" v-if="bgDataSource === 'Datastore'">
                        <div
                          class="col-12 mx-lg-n3"
                          v-if="subInd.selectedDatastoreDE.length > 0"
                        >
                          {{ $t("selectedDataElements") }}
                          <ul class="list-unstyled mt-3">
                            <template
                              v-for="(
                                de, deIndex
                              ) in subInd.selectedDatastoreDE"
                            >
                              <li :key="deIndex">
                                <i class="fa fa fa-circle"></i>
                                <span class="mx-3"> {{ de.displayName }} </span>
                                <div class="form-group row py-2 mt-2">
                                  <div class="col-sm-5 translate-height">
                                    <b-input-group>
                                      <input
                                        type="text"
                                        class="form-control form-control-sm"
                                        :placeholder="$t('displayName')"
                                        v-model="
                                          de.static_displayName[$i18n.locale]
                                        "
                                        @change="updateName(_j, deIndex, de)"
                                        disabled
                                        v-if="
                                          de.static_displayName &&
                                          typeof de.static_displayName ===
                                            'object'
                                        "
                                      />
                                      <b-input-group-append is-text>
                                        <Translations
                                          :transText.sync="
                                            de.static_displayName
                                          "
                                        />
                                      </b-input-group-append>
                                    </b-input-group>
                                  </div>
                                  <div
                                    class="col-sm-7 d-flex justify-content-end align-items-center"
                                  >
                                    <DataEntryAction
                                      :dataEntryID="de.id"
                                      @openPopup="openPopup"
                                    />
                                    <b-button
                                      class="mx-1 btn-sm greycolor-btn"
                                      @click="dataEntry(de.id)"
                                      >{{ $t("dataEntry") }}</b-button
                                    >
                                  </div>
                                </div>
                              </li>
                            </template>
                          </ul>
                        </div>
                        <div class="col-12 pt-3" v-else>
                          {{ $t("no_Data_Elements_selected") }}
                        </div>
                      </div>
                      <div v-else>
                        <AddMapping
                          :matrixList="matrixList"
                          :dataSetsList="dataSetsList"
                          :indicatorsList="indicatorsList"
                          :dataElementsList="dataElementsList"
                          :modalKey="'add-mapping' + _j + _i + subInd.id"
                          namesKey="static_displayName"
                          :mappingType.sync="subInd.type"
                          :selectedDE.sync="subInd.selectedDE"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <dataEntryForm
      v-if="isDataEntry"
      @hideModal="hideModal"
      :bgDataType="bgDataType"
      :isDataEntry="isDataEntry"
      :dataEntryID="dataEntryID"
    />
    <DataEntryPopup
      v-if="isPopupEntry"
      :popupType="popupType"
      @hidePopup="hidePopup"
      :bgDataType="bgDataType"
      :dataEntryID="dataEntryID"
      :isPopupEntry="isPopupEntry"
    />
  </div>
</template>
<script>
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
export default {
  props: [
    "subIndicators",
    "_i",
    "index",
    "type",
    "indicatorsList",
    "dataElementsList",
    "updateDEName",
    "dataSetsList",
    "matrixList",
    "bgDataSource",
    "bgDataType",
  ],
  mixins: [DynamicImageMixin],
  components: {
    dataEntryForm: () =>
      import(
        /*webpackChunkName: 'dataEntryForm'*/ "@/components/config/dqr/dataEntryForm"
      ),
    AddMapping: () =>
      import(
        /* webpackChunkName: "admin_AddMapping"*/ "@/components/config/AddMapping"
      ),
    Translations: () =>
      import(
        /*webpackChunkName: 'translations'*/ "@/components/config/Common/Translations"
      ),
    DataEntryAction: () =>
      import(
        /*webpackChunkName: 'DataEntryAction'*/ "@/components/config/dqr/DataEntryAction"
      ),
    DataEntryPopup: () =>
      import(
        /*webpackChunkName: 'DataEntryPopup'*/ "@/components/config/dqr/DataEntryPopup"
      ),
  },
  data() {
    return {
      isDataEntry: false,
      dataEntryID: "",
      isPopupEntry: false,
      popupType: "",
    };
  },
  watch: {},
  methods: {
    updateName(_j, k, de) {
      this.updateDEName(this.index, _j, k, this.type, de);
    },
    dataEntry(id) {
      this.dataEntryID = id;
      this.isDataEntry = true;
    },
    hideModal() {
      this.dataEntryID = "";
      this.isDataEntry = false;
    },
    openPopup(id, type) {
      this.popupType = type;
      this.dataEntryID = id;
      this.isPopupEntry = true;
    },
    hidePopup() {
      this.popupType = "";
      this.dataEntryID = "";
      this.isPopupEntry = false;
    },
  },
  created() {},
};
</script>
