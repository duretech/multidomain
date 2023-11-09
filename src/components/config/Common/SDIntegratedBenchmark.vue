<template>
  <b-row v-if="integrated.linked">
    <b-col
      sm="12"
      lg="12"
      v-if="$store.getters.getNamespace === `${$store.getters.getAppSettings.tableName}_mnch-dashboard`"
    >
      
      <div>
    <b-card no-body>
      <b-tabs pills card 
      class="charts-pills">
        <b-tab title="Dashboard Settings" active><b-card-text>
          <b-row class="mb-3">
          <b-col sm="4"
            ><label :for="`chartDataMapping-${i}-${j}`">{{
              $t("dataMapping")
            }}</label></b-col
          >
          <b-col sm="8" class="search-text">
            <treeselect
              :id="`chartDataMapping-${i}-${j}`"
              :flat="true"
              :multiple="true"
              :show-count="true"
              :default-expand-level="1"
              :placeholder="$t('search')"
              sort-value-by="ORDER_SELECTED"
              v-model="integrated.dataMapping"
              :options="allMappings"
              :disable-branch-nodes="true"
              search-nested
              ><label
                slot="option-label"
                slot-scope="{ node, labelClassName }"
                :class="labelClassName"
              >
                <b-badge
                  v-for="t in node.raw.type"
                  :key="'type' + t.alias"
                  class="mr-2 text-body"
                  variant="light"
                  :title="t.text"
                  v-b-tooltip.hover
                  :style="{
                    backgroundColor: t.color,
                    width: '25px',
                  }"
                  >{{ t.alias }}</b-badge
                >
                {{ node.label }}
              </label>
            </treeselect>
          </b-col>
        </b-row>
        
        <b-row class="mb-3"  v-if="$store.getters.getNamespace === `${$store.getters.getAppSettings.tableName}_mnch-dashboard`
">
          <b-col sm="4">
            <label :for="`percentIndicator-${i}-${j}`">{{
              $t("percentageIndicator")
            }}</label>
          </b-col>
          <b-col sm="8">
            <b-input-group :id="`percentIndicator-${i}-${j}`">
              <b-input-group-prepend is-text>
                <b-form-checkbox
                  switch
                  class="mr-n2"
                  v-model="integrated.percentIndicator"
                >
                </b-form-checkbox>
              </b-input-group-prepend>
            </b-input-group>
          </b-col>
        </b-row>
      
   
        <b-row class="mb-3"  v-if="$store.getters.getNamespace === `${$store.getters.getAppSettings.tableName}_mnch-dashboard`
">
          <b-col sm="4">
            <label :for="`displayName-${i}-${j}`">{{ $t("displayName") }}</label>
          </b-col>
          <b-col sm="8">
            <b-input-group :id="`displayName-${i}-${j}`">
              <b-form-input
                type="text"
                v-model="integrated.displayName[$i18n.locale]"
                disabled
              ></b-form-input>
              <b-input-group-append is-text>
                <Translations :transText.sync="integrated.displayName" />
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
    
     
        <b-row class="mb-3"  v-if="$store.getters.getNamespace === `${$store.getters.getAppSettings.tableName}_mnch-dashboard`
">
          <b-col sm="4">
            <label :for="`color-${i}-${j}`">{{ $t("color") }}</label>
          </b-col>
          <b-col sm="8">
            <b-input-group :id="`color-${i}-${j}`">
              <b-form-input type="text" v-model="integrated.color"></b-form-input>
              <b-input-group-append>
                <b-form-input
                  type="color"
                  class="w-40px"
                  v-model="integrated.color"
                ></b-form-input>
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
    
        </b-card-text></b-tab>
        <b-tab title="Chart Settings"><b-card-text>
           
        <b-row class="mb-3" v-if="$store.getters.getNamespace === `${$store.getters.getAppSettings.tableName}_mnch-dashboard`
">
          <b-col sm="4"
            ><label :for="`chartDataMapping1-${i}-${j}`">{{
              $t("dataMapping")
            }}</label></b-col
          >
          <b-col sm="8" class="search-text">
            <treeselect
              :id="`chartDataMapping1-${i}-${j}`"
              :flat="true"
              :multiple="true"
              :show-count="true"
              :default-expand-level="1"
              :placeholder="$t('search')"
              sort-value-by="ORDER_SELECTED"
              v-model="integrated.graphDataMapping"
              :options="allMappings"
              :disable-branch-nodes="true"
              search-nested
              ><label
                slot="option-label"
                slot-scope="{ node, labelClassName }"
                :class="labelClassName"
              >
                <b-badge
                  v-for="t in node.raw.type"
                  :key="'type' + t.alias"
                  class="mr-2 text-body"
                  variant="light"
                  :title="t.text"
                  v-b-tooltip.hover
                  :style="{
                    backgroundColor: t.color,
                    width: '25px',
                  }"
                  >{{ t.alias }}</b-badge
                >
                {{ node.label }}
              </label>
            </treeselect>
          </b-col>
        </b-row>
     
    
        <b-row class="mb-3 hide d-none"  v-if="$store.getters.getNamespace === `${$store.getters.getAppSettings.tableName}_mnch-dashboard`
">
          <b-col sm="4" >
            <label :for="`graphPercentIndicator-${i}-${j}`">{{
              $t("graphPercentIndicator")
            }}</label>
          </b-col>
          <b-col sm="8">
            <b-input-group :id="`graphPercentIndicator-${i}-${j}`">
              <b-input-group-prepend is-text>
                <b-form-checkbox
                  switch
                  class="mr-n2"
                  v-model="integrated.graphPercentageIndicator"
                >
                </b-form-checkbox>
              </b-input-group-prepend>
            </b-input-group>
          </b-col>
        </b-row>
 
     
        <b-row class="mb-3"  v-if="$store.getters.getNamespace === `${$store.getters.getAppSettings.tableName}_mnch-dashboard`
">
          <b-col sm="4">
            <label :for="`graphDisplayName-${i}-${j}`">{{
              $t("displayName")
            }}</label>
          </b-col>
          <b-col sm="8">
            <b-input-group :id="`graphDisplayName-${i}-${j}`">
              <b-form-input
                v-if="integrated.graphDisplayName &&
                  integrated.graphDisplayName[$i18n.locale]
                  "
                type="text"
                v-model="integrated.graphDisplayName[$i18n.locale]"
                disabled
              ></b-form-input>
              <b-input-group-append is-text>
                <Translations :transText.sync="integrated.graphDisplayName" />
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
    
     
        <b-row class="mb-3"  v-if="$store.getters.getNamespace === `${$store.getters.getAppSettings.tableName}_mnch-dashboard`
">
          <b-col sm="4">
            <label :for="`graphColor-${i}-${j}`">{{ $t("color") }}</label>
          </b-col>
          <b-col sm="8">
            <b-input-group :id="`graphColor-${i}-${j}`">
              <b-form-input
                type="text"
                v-model="integrated.graphColor"
              ></b-form-input>
              <b-input-group-append>
                <b-form-input
                  type="color"
                  class="w-40px"
                  v-model="integrated.graphColor"
                ></b-form-input>
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
   
     
        <b-row class="mb-3">
          <b-col sm="4">
            <label :for="`benchmarkLabel-${i}-${j}`"
              >{{ $t("benchmark") }} {{ $t("label") }}</label
            >
          </b-col>
          <b-col sm="8">
            <b-input-group :id="`benchmarkLabel-${i}-${j}`">
              <b-form-input
                v-if="integrated.benchmarkLabel &&
                  integrated.benchmarkLabel[$i18n.locale]
                  "
                type="text"
                v-model="integrated.benchmarkLabel[$i18n.locale]"
                disabled
              ></b-form-input>
              <b-input-group-append is-text>
                <Translations :transText.sync="integrated.benchmarkLabel" />
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
    
     
        <b-row class="mb-3">
          <b-col sm="4">
            <label :for="`benchmarkColor-${i}-${j}`"
              >{{ $t("benchmark") }} {{ $t("color") }}</label
            >
          </b-col>
          <b-col sm="8">
            <b-input-group :id="`benchmarkColor-${i}-${j}`">
              <b-form-input
                type="text"
                v-model="integrated.benchmarkColor"
              ></b-form-input>
              <b-input-group-append>
                <b-form-input
                  type="color"
                  class="w-40px"
                  v-model="integrated.benchmarkColor"
                ></b-form-input>
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>

     
        <b-row class="mb-3">
          <b-col sm="4">
            <label :for="`benchmarkValue-${i}-${j}`">{{
              $t("placeholderBenchmarkValue")
            }}</label>
          </b-col>
          <b-col sm="8">
            <b-button
              class="black-btn blue-btn btn-sm"
              v-on:click="dataEntry(`benchmark-${tabGroup}-${tabId}-${subTabId}`)"
              >{{ $t("dataEntry") }}</b-button
            >
          </b-col>
        </b-row>
    
        </b-card-text></b-tab>
      </b-tabs>
    </b-card>
    </div> 

    </b-col>
   

   
   
    <!-- <b-col sm="12" lg="12">
												<b-row class="mb-3">
													<b-col sm="5">
														<label :for="`minThreshold-${i}-${j}`"
															>Min Threshold</label
														>
													</b-col>
													<b-col sm="7">
														<b-input-group :id="`minThreshold-${i}-${j}`">
															<b-form-input
																min="0"
																max="100"
																step="0.01"
																type="number"
																v-model="integrated.minThreshold"
															></b-form-input>
															< !-- UI not loading properly due to _signoff.scss file css -->
    <!-- <b-input-group-append is-text>
																<b-form-input
																	v-model="integrated.minThreshold"
																	type="range"
																	min="0"
																	max="100"
																	step="0.01"
																></b-form-input>
															</b-input-group-append>
														</b-input-group>
													</b-col>
												</b-row>
											</b-col> -->
    <!-- <b-col sm="12" lg="12">
												<b-row class="mb-3">
													<b-col sm="5">
														<label :for="`maxThreshold-${i}-${j}`"
															>Max Threshold</label
														>
													</b-col>
													<b-col sm="7">
														<b-input-group :id="`maxThreshold-${i}-${j}`">
															<b-form-input
																min="0"
															max="100"
																step="0.01"
																type="number"
																v-model="integrated.maxThreshold"
															></b-form-input>
															<b-input-group-append is-text>
																<b-form-input
																	v-model="integrated.maxThreshold"
																	type="range"
																	min="0"
																	max="100"
																	step="0.01"
																></b-form-input>
															</b-input-group-append>
														</b-input-group>
													</b-col>
												</b-row>
											</b-col> -->
   
  </b-row>
</template>
<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  props: ["i", "j", "tabGroup", "tabId", "subTabId", "dataEntry", "integrated"],
  data() {
    return {
      allMappings: null,
    };
  },
  components: {
    Treeselect,
    Translations: () =>
      import(
        /*webpackChunkName: 'translations'*/ "@/components/config/Common/Translations"
      ),
  },
  methods: {
    getMappings() {
      let allMappings = [];
      let gSetting = this.$store.getters.getGlobalFactors();
      if (
        gSetting.globalMappings &&
        gSetting.globalMappings.mappings &&
        gSetting.globalMappings.mappings.length
      ) {
        gSetting.globalMappings.mappings.forEach((ms) => {
          let obj = {
            id: ms.id,
            label: ms.tabName[this.$i18n.locale],
            children: [],
          };
          if (ms.mapping && ms.mapping.length) {
            ms.mapping.forEach((m) => {
              let type = [];
              let isMapping = m.indicator.subIndicator.find(
                (s) => s.selectedDE.length
              );
              m.indicator.subIndicator.forEach((sm) => {
                let isFound = type.find((t) => t.type === sm.type);
                if (!isFound) {
                  if (sm.type === "indicator") {
                    type.push({
                      alias: "I",
                      color: "#5c9fef",
                      type: "indicator",
                      text: this.$i18n.t("indicator"),
                    });
                  }
                  if (sm.type === "data_element") {
                    type.push({
                      alias: "DE",
                      color: "#ed8d34",
                      type: "data_element",
                      text: this.$i18n.t("dataElement"),
                    });
                  }
                  if (sm.type === "data_sets") {
                    type.push({
                      alias: "DS",
                      color: "#72b656",
                      type: "data_sets",
                      text: this.$i18n.t("dataSets"),
                    });
                  }
                }
              });
              if (isMapping) {
                obj.children.push({
                  label: m.indicator.name[this.$i18n.locale],
                  id: m.indicator.static_name,
                  type,
                });
              }
            });
          }
          allMappings.push(obj);
        });
      }
      this.allMappings = allMappings;
    },
  },
  created() {
    this.getMappings();
  },
};
</script>
