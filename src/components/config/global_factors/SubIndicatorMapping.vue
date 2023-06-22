<template>
  <b-row class="mb-3">
    <b-col sm="12" class="p-b-15px">
      <!-- <div class="accordion-heading f-s-0-875rem font-weight-bold mt-3 mb-2">
				{{ $t("dataMapping") }}
			</div> -->
      <div class="accordion accordion-add w-100" role="tablist">
        <b-card no-body class="mb-1">
          <b-card-header
            header-tag="header"
            class="p-1 map-header f-s-0-875rem font-weight-bold"
            role="tab"
          >
            <b-button
              block
              v-b-toggle.accordion-data
              variant="info"
              class="button-add"
              >{{ $t("dataMapping") }}</b-button
            >
          </b-card-header>
          <b-collapse
            id="accordion-data"
            visible
            accordion="my-dataaccordion"
            role="tabpanel"
            class="border-module"
          >
            <b-card-body class="m-lg-n2">
              <b-card-text>
                <template v-if="subIndicators.length">
                  <b-col
                    sm="12"
                    class="mt-2"
                    v-for="(subIndicator, ind) in subIndicators"
                    :key="'subIndicator' + subIndicator.id"
                  >
                    <img
                      src="@/assets/images/icons/up-adminarrow.svg"
                      class="mr-2 cursor-pointer f-s-0-875rem w-8px"
                      :style="{ filter: filterColor }"
                      v-b-tooltip.hover
                      title="Move Up"
                      @click.prevent.stop="
                        moveItem({
                          tInd,
                          type: 'subMethod',
                          mInd: m,
                          siInd: ind,
                          places: -1,
                        })
                      "
                    />
                    <img
                      src="@/assets/images/icons/down-adminarrow.svg"
                      :style="{ filter: filterColor }"
                      class="mr-2 cursor-pointer f-s-0-875rem w-8px"
                      v-b-tooltip.hover
                      title="Move Down"
                      @click.prevent.stop="
                        moveItem({
                          tInd,
                          type: 'subMethod',
                          mInd: m,
                          siInd: ind,
                          places: 1,
                        })
                      "
                    />
                    <img
                      src="@/assets/images/icons/admindelete-icon.svg"
                      :style="{ filter: filterColor }"
                      class="mr-2 cursor-pointer f-s-0-875rem w-13"
                      v-b-tooltip.hover
                      :title="$t('deletebtn')"
                      @click.prevent.stop="
                        deleteElement({
                          type: 'subMethod',
                          tInd,
                          mInd: m,
                          dInd: ind,
                        })
                      "
                    />
                    <b-button
                      class="btn-link p-0 text-uppercase color-grey f-s-0-875rem bg-transparent border-0"
                      v-b-toggle="
                        'additionalSettingsCollapse' + subIndicator.id
                      "
                    >
                      <img
                        src="@/assets/images/icons/adminlink-icon.svg"
                        class="mr-2 cursor-pointer f-s-0-875rem w-auto"
                        :style="{ filter: filterColor }"
                        v-b-tooltip.hover
                        :title="$t('link_IndicatorsData_Elements')"
                      />
                      <span class="color-grey">{{
                        subIndicator.name[$i18n.locale]
                      }}</span>
                    </b-button>
                    <b-collapse
                      class="border-b-l-radius-10px border-b-r-radius-10px"
                      :id="'additionalSettingsCollapse' + subIndicator.id"
                    >
                      <b-row class="mb-3 mt-4">
                        <b-col sm="5">
                          <label
                            :for="`displayName-${subIndicator.id}-${ind}`"
                            >{{ $t("displayName") }}</label
                          >
                        </b-col>
                        <b-col sm="7">
                          <b-input-group
                            :id="`displayName-${subIndicator.id}-${ind}`"
                          >
                            <b-form-input
                              type="text"
                              v-model="subIndicator.name[$i18n.locale]"
                              disabled
                            ></b-form-input>
                            <b-input-group-append is-text>
                              <Translations
                                :transText.sync="subIndicator.name"
                              />
                            </b-input-group-append>
                          </b-input-group>
                        </b-col>
                      </b-row>
                      <b-row class="mb-3">
                        <b-col sm="5">
                          <label :for="`color-${subIndicator.id}-${ind}`">{{
                            $t("color")
                          }}</label>
                        </b-col>
                        <b-col sm="7">
                          <b-input-group
                            :id="`color-${subIndicator.id}-${ind}`"
                          >
                            <b-form-input
                              type="text"
                              v-model="subIndicator.color"
                            ></b-form-input>
                            <b-input-group-append>
                              <b-form-input
                                type="color"
                                class="w-40px"
                                v-model="subIndicator.color"
                              ></b-form-input>
                            </b-input-group-append>
                          </b-input-group>
                        </b-col>
                      </b-row>
                      <b-row
                        class="mb-3"
                        v-if="
                          $store.getters.getNamespace !==
                          'multi_program_mnch-dashboard'
                        "
                      >
                        <b-col sm="5">
                          <label :for="`cyp-${subIndicator.id}-${ind}`">{{
                            $t("cyp")
                          }}</label>
                        </b-col>
                        <b-col sm="7">
                          <b-form-input
                            :id="`cyp-${subIndicator.id}-${ind}`"
                            type="number"
                            v-model.number="subIndicator.cyp"
                          ></b-form-input>
                        </b-col>
                      </b-row>
                      <div
                        class="row mt-4"
                        :key="
                          'collapse-subIndicator' +
                          ind +
                          m +
                          indicatorId +
                          subIndicator.id
                        "
                      >
                        <div class="col-12">
                          <div class="accordion w-100" role="tablist">
                            <b-card no-body class="">
                              <b-card-header
                                header-tag="header"
                                class="p-1 map-header f-s-0-875rem font-weight-bold"
                                role="tab"
                              >
                                <b-button
                                  block
                                  v-b-toggle.accordion-indicator1
                                  variant="info"
                                  class="button-add"
                                  >{{
                                    $t("indicators_Data_Elements_Mapping")
                                  }}</b-button
                                >
                              </b-card-header>
                              <b-collapse
                                id="accordion-indicator1"
                                visible
                                accordion="my-indicatoraccordion"
                                role="tabpanel"
                                class="border-module"
                              >
                                <b-card-body>
                                  <b-card-text>
                                    <AddMapping
                                      :metrixList="metrixList"
                                      :dataSetsList="dataSetsList"
                                      :indicatorsList="indicatorsList"
                                      :dataElementsList="dataElementsList"
                                      :modalKey="
                                        'add-mapping' +
                                        indicatorId +
                                        subIndicator.id +
                                        ind
                                      "
                                      :mappingType.sync="subIndicator.type"
                                      :selectedDE.sync="subIndicator.selectedDE"
                                      v-if="isDataFetched"
                                    />
                                  </b-card-text>
                                </b-card-body>
                              </b-collapse>
                            </b-card>
                          </div>
                        </div>
                      </div>
                    </b-collapse>
                    <div class="bordertop-grey mt-3"></div>
                  </b-col>
                </template>
                <b-col
                  sm="12"
                  class="text-center"
                  v-if="subIndicators.length === 0"
                >
                  {{ $t("addMapping") }}
                  <code>{{ $t("addbtn") }}</code> {{ $t("btnBelow") }}
                </b-col>
                <b-col sm="12" class="text-right mt-3 mb-1">
                  <b-button
                    class="black-btn btn-sm blue-btn"
                    v-on:click="
                      addElement({
                        type: 'subMethod',
                        mInd: m,
                        tInd,
                      })
                    "
                    >{{ $t("addbtn") }}</b-button
                  >
                </b-col>
              </b-card-text>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
    </b-col>
  </b-row>
</template>
<script>
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
export default {
  props: [
    "m",
    "tInd",
    "moveItem",
    "addElement",
    "metrixList",
    "indicatorId",
    "dataSetsList",
    "isDataFetched",
    "subIndicators",
    "deleteElement",
    "indicatorsList",
    "dataElementsList",
  ],
  mixins: [DynamicImageMixin],
  components: {
    AddMapping: () =>
      import(
        /* webpackChunkName: "admin_AddMapping"*/ "@/components/config/AddMapping"
      ),
    Translations: () =>
      import(
        /*webpackChunkName: 'translations'*/ "@/components/config/Common/Translations"
      ),
  },
};
</script>
