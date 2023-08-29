<template>
  <div class="map-admin admin-active" v-if="isDataFetched">
    <b-card no-body>
    <b-tabs card vertical nav-class="p-0" nav-wrapper-class="adminConfig">
      <b-tab :title="$t('groupCreation')" class="pl-2 pb-0 pt-0 pr-2">
        <TabComponent
          type="groups"
          :groups="groups"
          @updateData="updateData"
          :addBtnTxt="$t('addGroup')"
          :addFrmTxt="$t('addGroup')"
          :editFrmTxt="$t('editGroup')"
          :tabName="$t('groupCreation')"
          :isDataFetched="isDataFetched"
        />
      </b-tab>
      <b-tab
        class="pl-2 pb-0 pt-0 pr-2"
        :title="$t('subGroupCreation')"
        v-if="groups && groups.length"
      >
        <TabComponent
          :groups="groups"
          type="subGroups"
          @updateData="updateData"
          :addBtnTxt="$t('addSubGroup')"
          :addFrmTxt="$t('addSubGroup')"
          :editFrmTxt="$t('editSubGroup')"
          :tabName="$t('subGroupCreation')"
          :isDataFetched="isDataFetched"
        />
      </b-tab>
      <b-tab
        class="pl-2 pb-0 pt-0 pr-2"
        :title="$t('indicatorCreation')"
        v-if="groups && groups.length"
      >
        <TabComponent
          :groups="groups"
          :levels="levels"
          type="indicators"
          :orgList="orgList"
          :langList="langList"
          :matrixList="matrixList"
          @updateData="updateData"
          :dataSetsList="dataSetsList"
          :isDataFetched="isDataFetched"
          :indicatorsList="indicatorsList"
          :dataElementsList="dataElementsList"
          :addBtnTxt="$t('addIndicator')"
          :addFrmTxt="$t('addIndicator')"
          :editFrmTxt="$t('editIndicator')"
          :tabName="$t('indicatorCreation')"
        />
      </b-tab>
    </b-tabs>
  </b-card>
  </div>
</template>
<script>
import service from "@/service";
import ReFetchConfigMixin from "@/helpers/ReFetchConfigMixin";

export default {
  props: [
    "orgList",
    "langList",
    "matrixList",
    "dataSetsList",
    "indicatorsList",
    "dataElementsList",
  ],
  mixins: [ReFetchConfigMixin],
  components: {
    TabComponent: () =>
      import(/* webpackChunkName: "adm_map_tab"*/ "./TabComponent"),
  },
  data() {
    return {
      groups: [],
      defaultLevelID: 1,
      isDataFetched: false,
    };
  },
  watch: {},
  computed: {
    levels() {
      let l = this.orgList
        .filter((item) => {
          if (
            item.level === this.defaultLevelID &&
            item.level === this.orgList.length
          ) {
            return item;
          }
          if (item.level >= this.defaultLevelID) {
            return item;
          }
        })
        .map((o) => ({
          level: o.level,
          levelName: o.name,
          isAutoRange: true,
          scales: [
            {
              lowScale: "0",
              highScale: "25",
              scaleColor: "#90CAF9",
              scaleLabel: { [this.$i18n.locale]: this.$i18n.t("low") },
            },
            {
              lowScale: "25",
              highScale: "50",
              scaleColor: "#2BAE8D",
              scaleLabel: { [this.$i18n.locale]: this.$i18n.t("medium") },
            },
            {
              lowScale: "50",
              highScale: "75",
              scaleColor: "#FFE082",
              scaleLabel: { [this.$i18n.locale]: this.$i18n.t("high") },
            },
            {
              lowScale: "75",
              highScale: "100",
              scaleColor: "#F06868",
              scaleLabel: { [this.$i18n.locale]: this.$i18n.t("veryHigh") },
            },
          ],
        }))
        .sort((a, b) => {
          return a.level < b.level ? -1 : a.level == b.level ? 0 : 1;
        });
      return l;
    },
  },
  methods: {
    getConfigData() {
      this.$store.commit("setLoading", true);
      let key = this.generateKey("mapVisualization");

      let oConfig = service.getSavedConfig({ tableKey: key });
      oConfig
        .then((response) => {
          let oResponse = response.data;
          if (oResponse && oResponse.length) {
            this.groups = oResponse.map((d) => {
              return {
                ...d,
                subGroups: d.subGroups.map((s) => {
                  if (s.indicators && s.indicators.length) {
                    return {
                      ...s,
                      indicators: s.indicators.map((m) => {
                        return {
                          ...m,
                          levels: this.levels.map((l) => {
                            let isFound = m.levels.find(
                              (ml) => ml.level === l.level
                            );
                            if (isFound) {
                              return { ...isFound, levelName: l.levelName };
                            } else {
                              return l;
                            }
                          }),
                        };
                      }),
                    };
                  } else {
                    return s;
                  }
                }),
              };
            });
          }
          this.isDataFetched = true;
          this.$store.commit("setLoading", false);
        })
        .catch((err) => {
          this.isDataFetched = true;
          this.$store.commit("setLoading", false);
          this.reFetchConfig(err);
        });
    },
    updateData(data) {
      this.groups = data;
    },
  },
  created() {
    if (
      this.$store.getters.getApplicationModule(
        this.$store.getters.getIsMultiProgram
      )
    ) {
      this.defaultLevelID = this.$store.getters.getApplicationModule(
        this.$store.getters.getIsMultiProgram
      ).defaultLevelID;
    }
    this.getConfigData();
  },
};
</script>
<style lang="scss" scoped>
</style>