<template>
<!-- <div class="md_tabs py-3"> -->
<div>
  <b-card no-body>
    <b-tabs card vertical nav-class="p-0" nav-wrapper-class="adminConfig">
      <b-tab :title="$t('summary')" active @click="updateActiveTab('summary')" class="pl-2 pb-0 pt-0 pr-0">
        <!-- <b-card-text> -->
        <b-card-text v-if="activeTab === 'summary'">
          <div class="md_nested_tabs">
            <b-card no-body>
              <b-tabs card class="border" nav-class="p-0 m-0"
								nav-wrapper-class="adminConfigInner p-0">
                <b-tab :title="$t('summary')" active @click="updateActiveSubTab('summary')" class="p-0">
                  <!-- <b-card-text> -->
                  <b-card-text v-if="activeSubTab === 'summary'">
                    <summary-component
                      :supportedLanguages="supportedLanguages"
                    />
                  </b-card-text>
                </b-tab>
              </b-tabs>
            </b-card>
          </div>
        </b-card-text>
      </b-tab>
      <b-tab :title="$t('Volume')" @click="updateActiveTab('volume')" class="pl-2 pb-0 pt-0 pr-0">
        <!-- <b-card-text> -->
        <b-card-text v-if="activeTab === 'volume'">
          <div class="md_nested_tabs">
            <b-card no-body>
              <b-tabs card class="border" nav-class="p-0 m-0"
								nav-wrapper-class="adminConfigInner p-0">
                <b-tab :title="$t('visits')" @click="updateActiveSubTab('visits')" class="p-0">
                  <!-- <b-card-text> -->
                  <b-card-text v-if="activeSubTab === 'visits'">
                    <config-component
                      chartByModule="ministrialModule"
                      chartByType="Volume"
                      chartBySubtype="Visits"
                      :indicatorsList="indicatorsList"
                      :dataElementsList="dataElementsList"
                      :dataSetsList="dataSetsList"
                      :metrixList="metrixList"
                      :supportedLanguages="supportedLanguages"
                      :globalMapping="globalMapping"
                    />
                  </b-card-text>
                </b-tab>
                <b-tab :title="$t('Commodities_Client')" @click="updateActiveSubTab('c_client')" class="p-0">
                  <!-- <b-card-text> -->
                  <b-card-text v-if="activeSubTab === 'c_client'">
                    <config-component
                      chartByModule="ministrialModule"
                      chartByType="Volume"
                      chartBySubtype="Commodities_Client"
                      :indicatorsList="indicatorsList"
                      :dataElementsList="dataElementsList"
                      :dataSetsList="dataSetsList"
                      :metrixList="metrixList"
                      :supportedLanguages="supportedLanguages"
                      :globalMapping="globalMapping"
                    />
                  </b-card-text>
                </b-tab>
                <b-tab :title="$t('Commodities_Facilities')" @click="updateActiveSubTab('c_facilities')" class="p-0">
                  <!-- <b-card-text> -->
                  <b-card-text v-if="activeSubTab === 'c_facilities'">
                    <config-component
                      chartByModule="ministrialModule"
                      chartByType="Volume"
                      chartBySubtype="Commodities_Facilities"
                      :indicatorsList="indicatorsList"
                      :dataElementsList="dataElementsList"
                      :dataSetsList="dataSetsList"
                      :metrixList="metrixList"
                      :supportedLanguages="supportedLanguages"
                      :globalMapping="globalMapping"
                    />
                  </b-card-text>
                </b-tab>
                <b-tab :title="$t('users')" @click="updateActiveSubTab('users')" class="p-0">
                  <!-- <b-card-text> -->
                  <b-card-text v-if="activeSubTab === 'users'">
                    <config-component
                      chartByModule="ministrialModule"
                      chartByType="Volume"
                      chartBySubtype="User"
                      :indicatorsList="indicatorsList"
                      :dataElementsList="dataElementsList"
                      :dataSetsList="dataSetsList"
                      :metrixList="metrixList"
                      :supportedLanguages="supportedLanguages"
                      :globalMapping="globalMapping"
                    />
                  </b-card-text>
                </b-tab>
              </b-tabs>
            </b-card>
          </div>
        </b-card-text>
      </b-tab>
      <b-tab :title="$t('volume_cyp')" @click="updateActiveTab('coverage')" class="pl-2 pb-0 pt-0 pr-0">
        <!-- <b-card-text> -->
        <b-card-text v-if="activeTab === 'coverage'">
          <div class="md_nested_tabs">
            <b-card no-body>
              <b-tabs card class="border" nav-class="p-0 m-0"
								nav-wrapper-class="adminConfigInner p-0">
                <b-tab :title="$t('visits')" active @click="updateActiveSubTab('visits')" class="p-0">
                  <!-- <b-card-text> -->
                  <b-card-text v-if="activeSubTab === 'visits'">
                    <config-component
                      chartByModule="ministrialModule"
                      chartByType="coverage"
                      chartBySubtype="Visits"
                      :indicatorsList="indicatorsList"
                      :dataElementsList="dataElementsList"
                      :dataSetsList="dataSetsList"
                      :metrixList="metrixList"
                      :supportedLanguages="supportedLanguages"
                      :globalMapping="globalMapping"
                    />
                  </b-card-text>
                </b-tab>
                <b-tab :title="$t('Commodities_Client')" @click="updateActiveSubTab('c_client')" class="p-0">
                  <!-- <b-card-text> -->
                  <b-card-text v-if="activeSubTab === 'c_client'">
                    <config-component
                      chartByModule="ministrialModule"
                      chartByType="coverage"
                      chartBySubtype="Commodities_Client"
                      :indicatorsList="indicatorsList"
                      :dataElementsList="dataElementsList"
                      :dataSetsList="dataSetsList"
                      :metrixList="metrixList"
                      :supportedLanguages="supportedLanguages"
                      :globalMapping="globalMapping"
                    />
                  </b-card-text>
                </b-tab>
                <b-tab :title="$t('Commodities_Facilities')" @click="updateActiveSubTab('c_facilities')" class="p-0">
                  <!-- <b-card-text> -->
                  <b-card-text v-if="activeSubTab === 'c_facilities'">
                    <config-component
                      chartByModule="ministrialModule"
                      chartByType="coverage"
                      chartBySubtype="Commodities_Facilities"
                      :indicatorsList="indicatorsList"
                      :dataElementsList="dataElementsList"
                      :dataSetsList="dataSetsList"
                      :metrixList="metrixList"
                      :supportedLanguages="supportedLanguages"
                      :globalMapping="globalMapping"
                    />
                  </b-card-text>
                </b-tab>
              </b-tabs>
            </b-card>
          </div>
        </b-card-text>
      </b-tab>
      <b-tab :title="$t('stockOut')" @click="updateActiveTab('stockOut')" class="pl-2 pb-0 pt-0 pr-0">
        <!-- <b-card-text> -->
        <b-card-text v-if="activeTab === 'stockOut'">
          <div class="md_nested_tabs">
            <b-card no-body>
              <b-tabs card class="border" nav-class="p-0 m-0"
								nav-wrapper-class="adminConfigInner p-0">
                <b-tab :title="$t('stockOut')" active @click="updateActiveSubTab('stockOut')" class="p-0">
                  <!-- <b-card-text> -->
                  <b-card-text v-if="activeSubTab === 'stockOut'">
                    <config-component
                      chartByModule="ministrialModule"
                      chartByType="stockOut"
                      chartBySubtype="stockOut"
                      :indicatorsList="indicatorsList"
                      :dataElementsList="dataElementsList"
                      :dataSetsList="dataSetsList"
                      :metrixList="metrixList"
                      :supportedLanguages="supportedLanguages"
                      :globalMapping="globalMapping"
                    />
                  </b-card-text>
                </b-tab>
              </b-tabs>
            </b-card>
          </div>
        </b-card-text>
      </b-tab>
      <b-tab :title="$t('program')" @click="updateActiveTab('program')" class="pl-2 pb-0 pt-0 pr-0">
        <!-- <b-card-text> -->
        <b-card-text v-if="activeTab === 'program'">
          <div class="md_nested_tabs">
            <b-card no-body>
              <b-tabs card class="border" nav-class="p-0 m-0"
								nav-wrapper-class="adminConfigInner p-0">
                <b-tab :title="$t('post_partum')" active @click="updateActiveSubTab('Post_Partum')" class="p-0">
                  <!-- <b-card-text> -->
                  <b-card-text v-if="activeSubTab === 'Post_Partum'">
                    <config-component chartByModule="ministrialModule" chartByType="program" chartBySubtype="Post_Partum" :indicatorsList="indicatorsList" :dataElementsList="dataElementsList" :dataSetsList="dataSetsList" :metrixList="metrixList" :supportedLanguages="supportedLanguages"></config-component>
                  </b-card-text>
                </b-tab>
                <b-tab :title="$t('youthAvailing')" @click="updateActiveSubTab('Youth_Availing')" class="p-0">
                  <!-- <b-card-text> -->
                  <b-card-text v-if="activeSubTab === 'Youth_Availing'">
                    <config-component chartByModule="ministrialModule" chartByType="program" chartBySubtype="Youth_Availing" :indicatorsList="indicatorsList" :dataElementsList="dataElementsList" :dataSetsList="dataSetsList" :metrixList="metrixList" :supportedLanguages="supportedLanguages"></config-component>
                  </b-card-text>
                </b-tab>
              </b-tabs>
            </b-card>
          </div>
        </b-card-text>
      </b-tab>
      <b-tab :title="$t('Reporting Rate')" @click="updateActiveTab('reportingRate')" class="pl-2 pb-0 pt-0 pr-0">
        <!-- <b-card-text> -->
        <b-card-text v-if="activeTab === 'reportingRate'">
          <div class="md_nested_tabs">
            <b-card no-body>
              <b-tabs card class="border" nav-class="p-0 m-0"
								nav-wrapper-class="adminConfigInner p-0">
                <b-tab :title="$t('visits')" active @click="updateActiveSubTab('visits')" class="p-0">
                  <!-- <b-card-text> -->
                  <b-card-text v-if="activeSubTab === 'visits'">
                    <config-component
                      chartByModule="ministrialModule"
                      chartByType="reportingRate"
                      chartBySubtype="Visits"
                      :indicatorsList="indicatorsList"
                      :dataElementsList="dataElementsList"
                      :dataSetsList="dataSetsList"
                      :metrixList="metrixList"
                      :supportedLanguages="supportedLanguages"
                      :globalMapping="globalMapping"
                    />
                  </b-card-text>
                </b-tab>
                <b-tab :title="$t('Commodities_Client')" @click="updateActiveSubTab('c_client')" class="p-0">
                  <!-- <b-card-text> -->
                  <b-card-text v-if="activeSubTab === 'c_client'">
                    <config-component
                      chartByModule="ministrialModule"
                      chartByType="reportingRate"
                      chartBySubtype="Commodities_Client"
                      :indicatorsList="indicatorsList"
                      :dataElementsList="dataElementsList"
                      :dataSetsList="dataSetsList"
                      :metrixList="metrixList"
                      :supportedLanguages="supportedLanguages"
                      :globalMapping="globalMapping"
                    />
                  </b-card-text>
                </b-tab>
                <b-tab :title="$t('Commodities_Facilities')" @click="updateActiveSubTab('c_facilities')" class="p-0">
                  <!-- <b-card-text> -->
                  <b-card-text v-if="activeSubTab === 'c_facilities'">
                    <config-component
                      chartByModule="ministrialModule"
                      chartByType="reportingRate"
                      chartBySubtype="Commodities_Facilities"
                      :indicatorsList="indicatorsList"
                      :dataElementsList="dataElementsList"
                      :dataSetsList="dataSetsList"
                      :metrixList="metrixList"
                      :supportedLanguages="supportedLanguages"
                      :globalMapping="globalMapping"
                    />
                  </b-card-text>
                </b-tab>
                <b-tab :title="$t('users')" @click="updateActiveSubTab('users')" class="p-0">
                  <!-- <b-card-text> -->
                  <b-card-text v-if="activeSubTab === 'users'">
                    <config-component
                      chartByModule="ministrialModule"
                      chartByType="reportingRate"
                      chartBySubtype="User"
                      :indicatorsList="indicatorsList"
                      :dataElementsList="dataElementsList"
                      :dataSetsList="dataSetsList"
                      :metrixList="metrixList"
                      :supportedLanguages="supportedLanguages"
                      :globalMapping="globalMapping"
                    />
                  </b-card-text>
                </b-tab>
                <b-tab :title="$t('overall')" @click="updateActiveSubTab('overall')" class="p-0">
                  <!-- <b-card-text> -->
                  <b-card-text v-if="activeSubTab === 'overall'">
                    <config-component
                      chartByModule="ministrialModule"
                      chartByType="reportingRate"
                      chartBySubtype="Overall"
                      :indicatorsList="indicatorsList"
                      :dataElementsList="dataElementsList"
                      :dataSetsList="dataSetsList"
                      :metrixList="metrixList"
                      :supportedLanguages="supportedLanguages"
                      :globalMapping="globalMapping"
                    />
                  </b-card-text>
                </b-tab>
              </b-tabs>
            </b-card>
          </div>
        </b-card-text>
      </b-tab>
      <b-tab :title="$t('RMNCH')" @click="updateActiveTab('RMNCH')" class="pl-2 pb-0 pt-0 pr-0">
        <!-- <b-card-text> -->
        <b-card-text v-if="activeTab === 'RMNCH'">
          <div class="md_nested_tabs">
            <b-card no-body>
              <b-tabs card class="border" nav-class="p-0 m-0"
								nav-wrapper-class="adminConfigInner p-0">
                <b-tab :title="$t('RMNCH')" active @click="updateActiveSubTab('RMNCH')" class="p-0">
                  <!-- <b-card-text> -->
                  <b-card-text v-if="activeSubTab === 'RMNCH'">
                    <config-component chartByModule="ministrialModule" chartByType="RMNCH" chartBySubtype="RMNCH" :indicatorsList="indicatorsList" :dataElementsList="dataElementsList" :dataSetsList="dataSetsList" :metrixList="metrixList" :supportedLanguages="supportedLanguages"></config-component>
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
import configComponent from './configComponent'
import summaryComponent from './summaryComponent'
export default {
  props: ['indicatorsList', 'dataElementsList', 'dataSetsList', 'metrixList', 'supportedLanguages', 'globalMapping'],
  components: {
    configComponent,
    summaryComponent
  },
  data() {
    return {
      activeTab: "summary",
      activeSubTab: "summary",
    }
  },
  methods: {
    //This is to update active tab name.
    //On the base of the active tab we will render the component.
    updateActiveTab(tab_name) {
      this.activeTab = tab_name;
      if (tab_name === 'volume' || tab_name === "coverage" || tab_name === "reportingRate") {
        this.activeSubTab = 'visits';
      }
      if (tab_name === 'stockOut') {
        this.activeSubTab = 'stockOut';
      }
      if (tab_name === 'RMNCH') {
        this.activeSubTab = 'RMNCH';
      }
      if (tab_name === 'program') {
        this.activeSubTab = 'Post_Partum'
      }
      if (tab_name === 'summary') {
        this.activeSubTab = 'summary'
      }
    },
    updateActiveSubTab(tab_name) {
      this.activeSubTab = tab_name;
    }
  }
}
</script>
