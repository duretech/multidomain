<template>
  <div class="row dqr-datamodal">
    <div class="col-12 mb-3" v-for="(subInd, _j) in subIndicators" :key="_j">
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
            <!-- <i
              class="fa fa-link f-s-20px"
              v-b-tooltip.hover
              :title="$t('link_IndicatorsData_Elements')"
            >
            </i> -->
            <img
              src="@/assets/images/icons/adminlink-icon.svg"
              class="mr-2 cursor-pointer f-s-0-875rem w-auto mt-lg-n1"
              :style="{ filter: filterColor }"
              v-b-tooltip.hover
              :title="$t('link_IndicatorsData_Elements')"
            />
          </a>
          <span>{{
            Array.isArray(subInd.static_name)
              ? $t(`${subInd.static_name[0]}`)
              : $t(`${subInd.static_name}`)
          }}</span>
          <template v-if="typeof subInd.adjusted !== 'undefined'">
            <select
              class="form-control form-control-sm m-l-20px w-auto custom-select"
              style="display: inline-block"
              v-model="subInd.adjusted"
            >
              <option :value="true">{{ $t("adjusted") }}</option>
              <option :value="false">{{ $t("unadjusted") }}</option>
            </select></template
          >
        </div>
      </div>
      <div class="row mx-0 border-bottomgrey mt-3">
        <div class="col-lg-12">
          <div class="collapse" :id="'sub_indicator0' + _i + _j">
            <div class="accordion mb-3" role="tablist">
              <b-card no-body class="mb-1">
                <b-card-header
                  header-tag="header"
                  class="p-1 map-header f-s-0-875rem font-weight-bold"
                  role="tab"
                >
                  <b-button block v-b-toggle.accordion-in13 variant="info">
                    {{ $t("indicators_Data_Elements_Mapping") }}</b-button
                  >
                </b-card-header>
                <b-collapse
                  id="accordion-in13"
                  visible
                  accordion="my-accordion13"
                  role="tabpanel"
                  class="border-module"
                >
                  <b-card-body>
                    <b-card-text>
                      <div class="card">
                        <div class="row mt-15px">
                          <div class="col-12">
                            <div class="card">
                              <div class="translate-height">
                                <div
                                  class="row"
                                  v-if="bgDataSource === 'Datastore'"
                                >
                                  <div
                                    class="col-12 mt-3"
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
                                          <i class="fa fa fa-circle mx-3"></i>
                                          <span class="mx-2">
                                            {{ de.displayName }}
                                          </span>
                                          <div
                                            class="form-group row py-2 px-4 ml-2"
                                          >
                                            <div class="col-sm-5">
                                              <b-input-group>
                                                <input
                                                  type="text"
                                                  class="form-control form-control-sm"
                                                  :placeholder="
                                                    $t('displayName')
                                                  "
                                                  v-model="
                                                    de.static_displayName[
                                                      $i18n.locale
                                                    ]
                                                  "
                                                  @change="
                                                    updateName(_j, deIndex, de)
                                                  "
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
                                    :modalKey="
                                      'add-mapping' + _j + _i + subInd.id
                                    "
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
                    </b-card-text>
                  </b-card-body>
                </b-collapse>
              </b-card>
            </div>
          </div>
        </div>
      </div>
    </div>
    <dataEntryForm
      v-if="isDataEntry"
      :isDataEntry="isDataEntry"
      :dataEntryID="dataEntryID"
      :bgDataType="bgDataType"
      @hideModal="hideModal"
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
    DataEntryAction: () =>
      import(
        /*webpackChunkName: 'DataEntryAction'*/ "@/components/config/dqr/DataEntryAction"
      ),
    DataEntryPopup: () =>
      import(
        /*webpackChunkName: 'DataEntryPopup'*/ "@/components/config/dqr/DataEntryPopup"
      ),
    Translations: () =>
      import(
        /*webpackChunkName: 'translations'*/ "@/components/config/Common/Translations"
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
