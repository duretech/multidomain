<template>
  <div class="md_tabs py-3">
    <b-card no-body class="">
      <b-tabs pills card vertical>
        <b-tab
          title="Information"
          :active="activeTab === 'info'"
          @click="updateActiveTab('info')"
        >
          <b-card-text v-if="activeTab === 'info'">
            <div class="md_nested_tabs">
              <b-card class="border">
                <Numerator
                  v-if="config && orgList.length > 0"
                  :config="config"
                  :indKey="indKey"
                  :dataElementList="dataElementList"
                  :dataSetList="dataSetList"
                  :indicatorList="indicatorList"
                  :matrixList="matrixList"
                  tabType="Information"
                  :locOrgList="orgList"
                />
              </b-card>
            </div>
          </b-card-text>
        </b-tab>
        <b-tab
          title="Numerator"
          :active="activeTab === 'numerator'"
          @click="updateActiveTab('numerator')"
        >
          <b-card-text v-if="activeTab === 'numerator'">
            <div class="md_nested_tabs no-header">
              <b-card class="border">
                <Numerator
                  v-if="config"
                  :config="config"
                  :indKey="indKey"
                  :dataElementList="dataElementList"
                  :dataSetList="dataSetList"
                  :indicatorList="indicatorList"
                  :matrixList="matrixList"
                  tabType="Numerator"
                />
              </b-card>
            </div>
          </b-card-text>
        </b-tab>
        <b-tab
          title="Denominator"
          :active="activeTab === 'denominator'"
          @click="updateActiveTab('denominator')"
        >
          <b-card-text v-if="activeTab === 'denominator'">
            <div class="md_nested_tabs">
              <b-card class="border">
                <Numerator
                  v-if="config"
                  :config="config"
                  :indKey="indKey"
                  :dataElementList="dataElementList"
                  :dataSetList="dataSetList"
                  :indicatorList="indicatorList"
                  :matrixList="matrixList"
                  tabType="Denominator"
                />
              </b-card>
            </div>
          </b-card-text>
        </b-tab>
        <b-tab
          title="Basic Settings"
          :active="activeTab === 'basic_settings'"
          @click="updateActiveTab('basic_settings')"
        >
          <b-card-text v-if="activeTab === 'basic_settings'">
            <div class="md_nested_tabs">
              <b-card class="border">
                <Numerator
                  v-if="config"
                  :config="config"
                  :indKey="indKey"
                  :dataElementList="dataElementList"
                  :dataSetList="dataSetList"
                  :indicatorList="indicatorList"
                  :matrixList="matrixList"
                  :categoryOptionID="categoryOptionID"
                  tabType="Basic"
                />
              </b-card>
              <!-- <BasicSettings
                v-if="config"
                :config="config"
                :indKey="indKey"
                :dataElementList="dataElementList"
                :dataSetList="dataSetList"
                :indicatorList="indicatorList"
                :matrixList="matrixList"
              /> -->
            </div>
          </b-card-text>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>
<script>
import Information from "./information.vue";
import Numerator from "./numerator.vue";
import BasicSettings from "./basicsettings.vue";

export default {
  props: [
    "config",
    "indKey",
    "dataElementList",
    "dataSetList",
    "matrixList",
    "indicatorList",
    "categoryOptionID",
    "orgList",
  ],
  components: {
    Information,
    Numerator,
    BasicSettings,
  },
  data() {
    return {
      activeTab: "info",
      actConfig: this.config,
    };
  },
  methods: {
    updateActiveTab(tab_name) {
      this.activeTab = tab_name;
    },
  },
  created() {},
};
</script>
