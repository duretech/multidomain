<template>
  <div class="md_tabs py-3">
    <b-card no-body class="">
      <b-tabs pills card vertical>
        <b-tab
          :title="$t('Save EMU')"
          :active="activeTab === 'saveEMU'"
          @click="updateActiveTab('saveEMU')"
        >
          <b-card-text v-if="activeTab === 'saveEMU'">
            <div class="md_nested_tabs">
              <b-card class="border">
                <SaveEMU
                  :dqrConfig="dqrConfig"
                  :orgList="orgList"
                  :dataElementList="dataElementList"
                  :categoryOptionID="categoryOptionID"
                  :methodCatId="methodCatId"
                  :bgDataConfig="bgDataConfig"
                  :flatLocList="flatLocList"
                  @saveJson="saveJson"
                />
              </b-card>
            </div>
          </b-card-text>
        </b-tab>
        <b-tab
          :title="$t('Background Data')"
          :active="activeTab === 'bgData'"
          @click="updateActiveTab('bgData')"
        >
          <b-card-text v-if="activeTab === 'bgData'">
            <div class="md_nested_tabs">
              <b-card no-body>
                <b-tabs class="card-section mt-lg-auto default-emu">
                  <b-tab
                  :title="$t('Background Data')"
                    active
                    @click="updateActiveSubTab('background_data')"
                  
                  >
                    <b-card-text v-if="activeSubTab === 'background_data'">
                      <div class="md_nested_tabs">
                        <b-card class="border">
                          <BackgroundData
                            type="BackgroundData"
                            :dqrConfig="dqrConfig"
                            :indicatorList="indicatorList"
                            :matrixList="matrixList"
                            :dataElementList="dataElementList"
                            :dataSetList="dataSetList"
                            :orgList="orgList"
                            @saveJson="saveJson"
                          />
                        </b-card>
                      </div>
                    </b-card-text>
                  </b-tab>
                  <b-tab :title="$t('cyp')" @click="updateActiveSubTab('cyp')">
                    <b-card-text v-if="activeSubTab === 'cyp'">
                      <div class="md_nested_tabs">
                        <b-card class="border">
                          <BackgroundData
                            type="cyp"
                            :bgDataConfig="bgDataConfig"
                            :indicatorList="indicatorList"
                            :matrixList="matrixList"
                            :dataElementList="dataElementList"
                            :dataSetList="dataSetList"
                            :orgList="orgList"
                            @saveJson="saveJson"
                          />
                        </b-card>
                      </div>
                    </b-card-text>
                  </b-tab>
                  <b-tab
                    :title="$t('continuationFactor')"
                    @click="updateActiveSubTab('continuation')"
                  >
                    <b-card-text v-if="activeSubTab === 'continuation'">
                      <div class="md_nested_tabs">
                        <b-card class="border">
                          <BackgroundData
                            type="continuation"
                            :bgDataConfig="bgDataConfig"
                            :indicatorList="indicatorList"
                            :matrixList="matrixList"
                            :dataElementList="dataElementList"
                            :dataSetList="dataSetList"
                            :orgList="orgList"
                            @saveJson="saveJson"
                          />
                        </b-card>
                      </div>
                    </b-card-text>
                  </b-tab>
                </b-tabs>
              </b-card>
            </div>
          </b-card-text>
        </b-tab>
        <b-tab
          :title="$t('dataMapping')"
          :active="activeTab === 'data_mapping'"
          @click="updateActiveTab('data_mapping')"
        >
          <b-card-text v-if="activeTab === 'data_mapping'">
            <div class="md_nested_tabs card-section">
              <b-card no-body>
                <b-tabs class="default-emu">
                  <b-tab
                    :title="$t('visits')"
                    active
                    @click="updateActiveSubTab('Visits')"
                  >
                    <b-card-text v-if="activeSubTab === 'Visits'">
                      <div class="md_nested_tabs">
                        <b-card class="border">
                          <DataMapping
                            type="Visits"
                            :dqrConfig="dqrConfig"
                            :orgList="orgList"
                            :indicatorList="indicatorList"
                            :matrixList="matrixList"
                            :dataElementList="dataElementList"
                            :dataSetList="dataSetList"
                            :sectorRepo="sectorRepo"
                            @saveJson="saveJson"
                          />
                        </b-card>
                      </div>
                    </b-card-text>
                  </b-tab>
                  <b-tab
                    :title="$t('Commodities_Client')"
                    @click="updateActiveSubTab('Commodities_Client')"
                  >
                    <b-card-text v-if="activeSubTab === 'Commodities_Client'">
                      <div class="md_nested_tabs">
                        <b-card class="border">
                          <DataMapping
                            type="Commodities_Client"
                            :dqrConfig="dqrConfig"
                            :orgList="orgList"
                            :indicatorList="indicatorList"
                            :matrixList="matrixList"
                            :dataElementList="dataElementList"
                            :dataSetList="dataSetList"
                            :sectorRepo="sectorRepo"
                          />
                        </b-card>
                      </div>
                    </b-card-text>
                  </b-tab>
                  <b-tab
                    :title="$t('Commodities_Facilities')"
                    @click="updateActiveSubTab('Commodities_Facilities')"
                  >
                    <b-card-text
                      v-if="activeSubTab === 'Commodities_Facilities'"
                    >
                      <div class="md_nested_tabs">
                        <b-card class="border">
                          <DataMapping
                            type="Commodities_Facilities"
                            :dqrConfig="dqrConfig"
                            :orgList="orgList"
                            :indicatorList="indicatorList"
                            :matrixList="matrixList"
                            :dataElementList="dataElementList"
                            :dataSetList="dataSetList"
                            :sectorRepo="sectorRepo"
                          />
                        </b-card>
                      </div>
                    </b-card-text>
                  </b-tab>
                  <b-tab :title="$t('users')" @click="updateActiveSubTab('User')">
                    <b-card-text v-if="activeSubTab === 'User'">
                      <div class="md_nested_tabs">
                        <b-card class="border">
                          <DataMapping
                            type="User"
                            :dqrConfig="dqrConfig"
                            :orgList="orgList"
                            :indicatorList="indicatorList"
                            :matrixList="matrixList"
                            :dataElementList="dataElementList"
                            :dataSetList="dataSetList"
                            :sectorRepo="sectorRepo"
                          />
                        </b-card>
                      </div>
                    </b-card-text>
                  </b-tab>
                </b-tabs>
              </b-card>
            </div>
          </b-card-text>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>
<script>
import SaveEMU from "./saveEMU";
import BackgroundData from "./backgroundData.vue";
import DataMapping from "./dataMapping.vue";

export default {
  props: [
    "bgDataConfig",
    "dqrConfig",
    "indicatorList",
    "matrixList",
    "dataElementList",
    "dataSetList",
    "orgList",
    "sectorRepo",
    "categoryOptionID",
    "methodCatId",
    "flatLocList",
  ],
  components: {
    SaveEMU,
    BackgroundData,
    DataMapping,
  },
  data() {
    return {
      activeTab: "saveEMU",
      activeSubTab: "emu_settings",
    };
  },
  methods: {
    updateActiveTab(tab_name) {
      this.activeTab = tab_name;
      if (tab_name === "saveEMU") {
        this.activeSubTab = "emu_settings";
      } else if (tab_name === "bgData") {
        this.activeSubTab = "background_data";
      } else if (tab_name === "data_mapping") {
        this.activeSubTab = "Visits";
      }
    },
    updateActiveSubTab(tab_name) {
      this.activeSubTab = tab_name;
    },
    saveJson(val, key){
      console.log(val, key)
      this.$emit('saveJson', val, key)
    }
  },
  created() {
    console.log("sectorRepo in emuConfig", this.sectorRepo);
  },
};
</script>
