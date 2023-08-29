<template>
  <b-card>
    <b-row>
      <b-col sm="12">
        <div class="accordion" role="tablist">
          <b-alert
            class="text-center"
            variant="warning"
            show
            v-if="mappings.length >= 15"
          >
            {{ $t("maxLimit") }}
          </b-alert>
          <b-card
            no-body
            class="mb-3"
            v-for="(map, m) in mappings"
            :key="'indicator-' + map.indicator.id"
          >
            <div class="" role="tab">
              <!-- <i
								class="fa fa-trash mr-2 cursor-pointer f-s-0-875rem"
								v-b-tooltip.hover
								:title="$t('deletebtn')"
								@click.prevent.stop="
									deleteElement({ type: 'method', tInd, dInd: m })
								"
							></i> -->
              <img
                src="@/assets/images/icons/admindelete-icon.svg"
                :style="{ filter: filterColor }"
                class="cursor-pointer f-s-0-875rem w-13 mr-2"
                v-b-tooltip.hover
                :title="$t('deletebtn')"
                @click.prevent.stop="
                  deleteElement({ type: 'method', tInd, dInd: m })
                "
              />
              <b-button
                v-b-toggle="'accordion-' + map.indicator.id"
                class="btn-link p-0 text-uppercase color-grey f-s-0-875rem bg-transparent border-0"
              >
                <!-- <i
                  class="fa fa-cog mr-2 f-s-0-875rem"
                  v-b-tooltip.hover
                  :title="$t('settings')"
                ></i
                > -->
                <img
                  src="@/assets/images/icons/setting-icon.svg"
                  :style="{ filter: filterColor }"
                  class="mr-2 cursor-pointer f-s-0-875rem w-14 mb-lg-1 mt-1"
                  v-b-tooltip.hover
                  :title="$t('settings')"
                />
                {{ map.indicator.name[$i18n.locale] }}</b-button
              >
            </div>

            <b-collapse
              :id="'accordion-' + map.indicator.id"
              accordion="my-accordion"
              role="tabpanel"
              class="border mt-3"
            >
              <b-card-body>
                <b-row class="mb-3">
                  <b-col sm="5">
                    <label :for="`displayName-${map.indicator.id}-${m}`">{{
                      $t("displayName")
                    }}</label>
                  </b-col>
                  <b-col sm="7">
                    <b-input-group :id="`displayName-${map.indicator.id}-${m}`">
                      <b-form-input
                        type="text"
                        v-model="map.indicator.name[$i18n.locale]"
                        disabled
                      ></b-form-input>
                      <b-input-group-append is-text>
                        <Translations :transText.sync="map.indicator.name" />
                      </b-input-group-append>
                    </b-input-group>
                  </b-col>
                </b-row>
                <b-row class="mb-3">
                  <b-col sm="5">
                    <label :for="`color-${map.indicator.id}-${m}`">{{
                      $t("color")
                    }}</label>
                  </b-col>
                  <b-col sm="7">
                    <b-input-group :id="`color-${map.indicator.id}-${m}`">
                      <b-form-input
                        type="text"
                        v-model="map.indicator.color"
                      ></b-form-input>
                      <b-input-group-append>
                        <b-form-input
                          type="color"
                          class="w-40px"
                          v-model="map.indicator.color"
                        ></b-form-input>
                      </b-input-group-append>
                    </b-input-group>
                  </b-col>
                </b-row>
                <b-row class="mb-3">
                  <b-col sm="5">
                    <label :for="`visible-${map.indicator.id}-${m}`">{{
                      $t("disable")
                    }}</label>
                  </b-col>
                  <b-col sm="7">
                    <b-form-checkbox
                      :id="`visible-${map.indicator.id}-${m}`"
                      class="mr-n2 mb-n1"
                      switch
                      v-model="map.indicator.disable"
                    >
                    </b-form-checkbox>
                  </b-col>
                </b-row>
                <SubIndicatorMapping
                  :m="m"
                  :tInd="tInd"
                  :moveItem="moveItem"
                  :addElement="addElement"
                  :matrixList="matrixList"
                  :dataSetsList="dataSetsList"
                  :deleteElement="deleteElement"
                  :isDataFetched="isDataFetched"
                  :indicatorId="map.indicator.id"
                  :indicatorsList="indicatorsList"
                  :dataElementsList="dataElementsList"
                  :subIndicators="map.indicator.subIndicator"
                  v-bind.sync="map.indicator.subIndicator"
                  :key="'add-indicator' + map.indicator.id + m"
                />
              </b-card-body>
            </b-collapse>
            <div class="bordertop-grey mt-3"></div>
          </b-card>
        </div>
      </b-col>
      <b-col sm="12" class="text-center" v-if="mappings.length === 0">
        {{ $t("addMapping") }}
        <code>{{ $t("addbtn") }}</code> {{ $t("btnBelow") }}
      </b-col>
      <b-col sm="12" class="text-right pt-3">
        <b-button
          v-if="mappings.length < 15"
          class="black-btn blue-btn btn-sm"
          @click="addElement({ type: 'method', tInd })"
          >{{ $t("addbtn") }}</b-button
        >
      </b-col>
    </b-row>
  </b-card>
</template>
<script>
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
export default {
  props: [
    "tInd",
    "moveItem",
    "mappings",
    "addElement",
    "matrixList",
    "dataSetsList",
    "deleteElement",
    "isDataFetched",
    "indicatorsList",
    "dataElementsList",
  ],
  mixins: [DynamicImageMixin],
  components: {
    SubIndicatorMapping: () =>
      import(
        /* webpackChunkName: "admin_SubIndicatorMapping"*/ "./SubIndicatorMapping"
      ),
    Translations: () =>
      import(
        /*webpackChunkName: 'translations'*/ "@/components/config/Common/Translations"
      ),
  },
  methods: {},
};
</script>
