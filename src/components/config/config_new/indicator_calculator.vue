<template>
  <!-- <b-overlay :show="showLoader" rounded="sm" :opacity="0.3"> -->
  <div class="m-t-20px datamappingtopcar">
    <b-tabs nav-class="appCongigtabSub">
      <b-tab
        :title= bgDataConfig.showingTabs.ssToEmu.name
        :active="tab === 'nav-tab1-tab'"
        @click="updateActiveTab('nav-tab1-tab')"
        v-if="bgDataConfig.showingTabs.ssToEmu.value"
      >
        <b-card-text v-if="tab === 'nav-tab1-tab'">
          <div class="md_nested_tabs">
            <EmuConfig
              v-if="
                bgDataConfig &&
                dqrConfig &&
                sectorRepo &&
                categoryOptionID &&
                methodCatId
              "
              :bgDataConfig="bgDataConfig"
              :dqrConfig="dqrConfig"
              :indicatorList="indicatorList"
              :matrixList="matrixList"
              :dataElementList="dataElementList"
              :dataSetList="dataSetList"
              :orgList="orgList"
              :categoryOptionID="categoryOptionID"
              :methodCatId="methodCatId"
              :flatLocList="flatLocList"
              :sectorRepo="sectorRepo"
              @saveJson="saveJson"
            />
          </div>
        </b-card-text>
      </b-tab>
      <b-tab
        :title = bgDataConfig.showingTabs.facilityOfferingFp.name
        :active="tab === 'nav-tab2-tab'"
        @click="updateActiveTab('nav-tab2-tab')"
        v-if="bgDataConfig.showingTabs.facilityOfferingFp.value"
      >
        <b-card-text v-if="tab === 'nav-tab2-tab'">
          <div class="md_nested_tabs">
            <SubTabConfig
              v-if="config && orgList"
              :config="config"
              indKey="indicator_1"
              :dataElementList="dataElementList"
              :dataSetList="dataSetList"
              :indicatorList="indicatorList"
              :matrixList="matrixList"
              :categoryOptionID="categoryOptionID"
              :orgList="orgList"
            />
          </div>
        </b-card-text>
      </b-tab>
      <b-tab
        :title = bgDataConfig.showingTabs.daysOfStockout.name
        :active="tab === 'nav-tab3-tab'"
        @click="updateActiveTab('nav-tab3-tab')"
        v-if="bgDataConfig.showingTabs.daysOfStockout.value"
      >
        <b-card-text v-if="tab === 'nav-tab3-tab'">
          <div class="md_nested_tabs">
            <SubTabConfig
              v-if="config && orgList"
              :config="config"
              indKey="indicator_2"
              :dataElementList="dataElementList"
              :dataSetList="dataSetList"
              :indicatorList="indicatorList"
              :matrixList="matrixList"
              :categoryOptionID="categoryOptionID"
              :orgList="orgList"
            />
          </div>
        </b-card-text>
      </b-tab>
      <b-tab
        :title = bgDataConfig.showingTabs.newAcceptorsLessThan20.name
        :active="tab === 'nav-tab4-tab'"
        @click="updateActiveTab('nav-tab4-tab')"
        v-if="bgDataConfig.showingTabs.newAcceptorsLessThan20.value"
      >
        <b-card-text v-if="tab === 'nav-tab4-tab'">
          <div class="md_nested_tabs">
            <SubTabConfig
              v-if="config && orgList"
              :config="config"
              indKey="indicator_3"
              :dataElementList="dataElementList"
              :dataSetList="dataSetList"
              :indicatorList="indicatorList"
              :matrixList="matrixList"
              :categoryOptionID="categoryOptionID"
              :orgList="orgList"
            />
          </div>
        </b-card-text>
      </b-tab>
      <b-tab
        :title = bgDataConfig.showingTabs.HealthAreaOfferingCD.name
        :active="tab === 'nav-tab5-tab'"
        @click="updateActiveTab('nav-tab5-tab')"
        v-if="bgDataConfig.showingTabs.HealthAreaOfferingCD.value"
      >
        <b-card-text v-if="tab === 'nav-tab5-tab'">
          <div class="md_nested_tabs">
            <SubTabConfig
              v-if="config && orgList"
              :config="config"
              indKey="indicator_4"
              :dataElementList="dataElementList"
              :dataSetList="dataSetList"
              :indicatorList="indicatorList"
              :matrixList="matrixList"
              :categoryOptionID="categoryOptionID"
              :orgList="orgList"
            />
          </div>
        </b-card-text>
      </b-tab>
    </b-tabs>
  </div>
  <!-- </b-overlay> -->
</template>
<script>
import service from "@/service";
import SubTabConfig from "../indicator_calculator/SubTabConfig";
import EmuConfig from "../indicator_calculator/emuConfig";
import stockOutConfig from "@/config/stockOutConfig.js";
// import bgDataConfig from "@/config/globalFactorsConfig.js";
import annualConfig from "@/config/emuAnnualConfig.js";
import monthlyConfig from "@/config/emuMonthlyConfig.js";
// import globalFactorsConfig from "@/config/globalFactorsConfig.js";

export default {
  props: ["bgDataConfig"],
  components: {
    SubTabConfig,
    EmuConfig,
  },
  data() {
    return {
      tab: "nav-tab1-tab",
      config: stockOutConfig,
      // bgDataConfig: bgDataConfig,
      dataElementList: [],
      dqrConfig: null,
      // bgDataConfig: globalFactorsConfig,
      indicatorList: [],
      dataSetList: [],
      matrixList: [],
      flatLocList: [],
      methodCatId: null,
      categoryOptionID: null,
      orgList: [],
      sectorRepo: "",
    };
  },
  methods: {
    updateActiveTab(tab_name) {
      this.tab = tab_name;
    },
    assignParent(mainObj, obj) {
      return mainObj.map((root) => {
        if (root.id === obj.parent.id) {
          if (!root.children) root.children = [];
          root.children.push({
            label: obj.name,
            value: obj.id,
            id: obj.id,
            level: obj.level,
          });
        } else if (root.children) {
          for (var k in root.children) {
            if (root.children[k].id === obj.parent.id) {
              if (!root.children[k].children) root.children[k].children = [];
              root.children[k].children.push({
                label: obj.name,
                value: obj.id,
                id: obj.id,
                level: obj.level,
              });
              return root;
            } else if (root.children.length) {
              root.children = this.assignParent(root.children, obj);
              return root;
            }
          }
        }
        return root;
      });
    },
    saveJson(val, configKey ,noalert = true) {
      // console.log(this.dqrConfig);
      this.$store.commit("setLoading", true);
      service
        .updateConfig(val, configKey, false, "fp-dashboard")
        .then((resp) => {
          if (resp.data.status === "OK") {
            this.$store.commit("setLoading", false);
            if (noalert)
              this.$swal({
                title: "Data updated successfully.",
                type: "success",
              }).then(() => {});
          }
        })
        .catch((err) => {
          service
            .saveConfig(val, configKey, false, "fp-dashboard")
            .then((resp) => {
              if (resp.data.status === "OK") {
                this.$store.commit("setLoading", false);
                if (noalert)
                  this.$swal({
                    title: "Data saved successfully.",
                    type: "success",
                  }).then(() => {});
              }
            })
            .catch((er) => {
              this.$store.commit("setLoading", false);
              if (noalert)
                this.$swal({
                  title: "Something went wrong. Please try again later.",
                  type: "error",
                }).then(() => {});
            });
        });
    },
  },
  created() {
    let dSourceGroupList = [
      {
        id: "[All metrics]",
        name: "[All metrics]",
        alias: "ALL",
      },
      {
        id: "Reporting rates",
        name: "Reporting rates",
        alias: "REPORTING_RATE",
      },
      {
        id: "Reporting rates on time",
        name: "Reporting rates on time",
        alias: "REPORTING_RATE_ON_TIME",
      },
      {
        id: "Actual reports",
        name: "Actual reports",
        alias: "ACTUAL_REPORTS",
      },
      {
        id: "Actual reporting rates on time",
        name: "Actual reporting rates on time",
        alias: "ACTUAL_REPORTS_ON_TIME",
      },
      {
        id: "Expected reports",
        name: "Expected reports",
        alias: "EXPECTED_REPORTS",
      },
    ];
    this.matrixList = dSourceGroupList;
    service.getOrganisationWithParent().then((orgList) => {
      console.log("orgList", orgList);
      let arrList = [orgList.data.organisationUnits];
      // let oList = orgList.data.organisationUnits;
      let oList = service.flattenLocationList(arrList)[0]; //flatlocationlist returns array with one index "0"
      this.flatLocList = oList;
      // let oList = orgList.data.organisationUnits;
      let levelArr = [];
      let finalOrgList = [];
      oList.forEach((list) => {
        if (!levelArr.includes(list.level)) levelArr.push(list.level);
      });
      levelArr.sort();
      levelArr.forEach((level, lInd) => {
        let findData = oList.filter((obj) => obj.level === level);
        if (findData && findData.length) {
          findData.forEach((dt) => {
            if (lInd === 0)
              finalOrgList = [
                ...finalOrgList,
                {
                  label: dt.name,
                  value: dt.id,
                  id: dt.id,
                  level: dt.level,
                  checked: false,
                },
              ];
            else finalOrgList = this.assignParent(finalOrgList, dt);
          });
        }
      });
      this.orgList = finalOrgList;
      // this.showLoader = false;
    });
    service
      .getSavedConfig("annualSectorReporting_en", false, "fp-dashboard")
      .then((resp) => {
        if (resp && resp.data){
          this.sectorRepo = resp.data.sectorReporting;
        }
        console.log(this.sectorRepo)
      });
    service
      .getSavedConfig("dqrModule_en", false, "fp-dashboard")
      .then((resp) => {
        // this.showLoader = true;
        if (resp && resp.data) {
          this.dqrConfig = resp.data;
          this.$set(this.dqrConfig, "emu", resp.data.emu);
        } else {
          this.dqrConfig = {
            ...annualConfig.dqrModule,
            ...monthlyConfig.dqrModule,
          };
        }
        // this.showLoader = false;
      });

    service
      .getSavedConfig("stockOut_en", false, "fp-dashboard")
      .then((resp) => {
        if (resp && resp.data) this.config = resp.data;
      });
    service.getDataElements().then((resp) => {
      if (resp && resp.data) this.dataElementList = resp.data.dataElements;
    });
    service.getIndicators().then((resp) => {
      if (resp && resp.data) this.indicatorList = resp.data.indicators;
    });
    service.getDataSets().then((resp) => {
      if (resp && resp.data) {
        let originalDSets = [];
        resp.data.dataSets.forEach((d) => {
          this.matrixList.forEach((ds) => {
            if (ds.alias !== "ALL") {
              originalDSets.push({
                ...d,
                id: d.id + "." + ds.alias,
                displayName: d.displayName + " (" + ds.name + ")",
                dataSourceGroup: ds.id,
              });
            }
          });
        });
        this.dataSetList = originalDSets;
      }
    });
    service.getdefaultCategoryCombo("default").then((resp) => {
      if (resp.data) {
        let catIdArr = resp.data.categoryCombos.filter((obj) => {
          return obj["displayName"] === "default";
        });
        console.log(resp.data, "default category");
        if (catIdArr.length) {
          let catId = catIdArr[0]["id"];
          this.categoryOptionID = catId;
        }
      }
      // this.showLoader = false;
    });
    service
      .getdefaultCategoryCombo("All Methods")
      .then((resp) => {
        console.log(resp, "getCategoryOptionCombo All Methods");
        if (resp.data) {
          let catIdArr = resp.data.categoryCombos.filter((obj) => {
            return obj["displayName"] === "All Methods";
          });
          if (catIdArr.length) {
            let catId = catIdArr[0]["id"];
            // //console.log("catId", catId)
            this.methodCatId = catId;
          }
        }
      })
      .catch((err) => {
        // //console.log(err)
      });
  },
};
</script>
