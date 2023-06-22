<template>
  <div class="text-right">
    <b-button
      v-if="$store.getters.getIsAdmin"
      class="blue-btn mb-2 btn-sm"
      @click="configureBtn = !configureBtn"
      >{{ $t("configure") }}</b-button
    >
    <b-modal
      hide-footer
      no-close-on-backdrop
      v-model="configureBtn"
      :title="$t('configure')"
    >
      <b-card-body class="p-0">
        <b-form-group class="mb-0 fs-17-1920" v-slot="{ ariaDescribedby }">
          <b-form-radio-group
            :id="'radio-group-1' + reusableKey"
            v-model="dataSource"
            :options="dataOptions"
            :aria-describedby="ariaDescribedby"
            :name="'radio-options' + reusableKey"
            class="data-options fs-17-1920"
          ></b-form-radio-group>
        </b-form-group>
        <div class="my-2 fs-17-1920">
          <b-form-input
            class="search-input border-0 rounded-pill fs-17-1920"
            :placeholder="$t('search')"
            v-model="dataSearchText"
          ></b-form-input>
        </div>
        <div class="mt-2">
          <b-container fluid>
            <b-row>
              <b-col sm="6" class="pl-0">
                <div class="small">{{ $t("available") }}</div>
                <div class="left-data p-3 dataConfig" style="">
                  <ul class="med-list list-unstyled" ref="data_left">
                    <template v-if="dataList.length">
                      <li
                        class="med-list-item pt-1 pb-1 fs-17-1920"
                        v-on:click="moveData({ type: '+', data: item })"
                        v-for="item in dataList"
                        :key="item.id"
                      >
                        {{ item.name }}
                        <span class="move-txt fs-17-1920"
                          >{{ $t("move") }}
                          <i
                            class="fa fa-angle-double-right fs-17-1920"
                            aria-hidden="true"
                          ></i>
                        </span>
                      </li>
                    </template>
                    <template v-else>
                      <li class="pt-1 pb-1 fs-17-1920 text-center">
                        {{ $t("no_data_to_display") }}
                      </li>
                    </template>
                  </ul>
                </div>
              </b-col>
              <b-col sm="6" class="pr-0">
                <div class="small text-right">{{ $t("selected") }}</div>
                <div class="right-data p-3 dataConfig">
                  <ul
                    class="med-list list-unstyled fs-17-1920"
                    ref="data_right"
                  >
                    <template v-if="selectedData.length">
                      <li
                        class="med-list-item pt-1 pb-1 fs-17-1920"
                        v-on:click="moveData({ type: '-', data: item })"
                        v-for="item in selectedData"
                        :key="item.id"
                      >
                        {{ item.name }}
                        <span class="move-txt fs-17-1920"
                          >{{ $t("move") }}
                          <i
                            class="fa fa-angle-double-left"
                            aria-hidden="true"
                          ></i>
                        </span>
                      </li>
                    </template>
                    <template v-else>
                      <li class="pt-1 pb-1 fs-17-1920 text-center">
                        {{ $t("no_data_to_display") }}
                      </li>
                    </template>
                  </ul>
                </div>
              </b-col>
            </b-row>
            <b-row class="mt-3 move-btn">
              <b-col sm="6" class="text-center pl-0"
                ><b-button
                  class="move-btn-left rounded-pill fs-17-1920 btn-sm"
                  v-on:click="moveData({ type: '+' })"
                  >{{ $t("moveAll") }}</b-button
                >
              </b-col>
              <b-col sm="6" class="text-center pr-0"
                ><b-button
                  class="move-btn-right rounded-pill fs-17-1920 btn-sm"
                  v-on:click="moveData({ type: '-' })"
                  >{{ $t("moveAll") }}</b-button
                ></b-col
              >
            </b-row>
            <b-row class="mt-3">
              <b-col class="p-0"
                ><b-button
                  class="move-btn-right fs-17-1920 float-right blue-btn"
                  v-on:click="updateConfigData"
                  >{{ $t("update") }}</b-button
                ></b-col
              >
            </b-row>
          </b-container>
        </div>
      </b-card-body>
    </b-modal>
  </div>
</template>
<script>
import service from "@/service";
import IA from "./interactive";

export default {
  props: ["reusableKey", "allowedOptions"],
  data() {
    return {
      dataOptions: [],
      selectedData: [],
      dataSource: null,
      dataSearchText: "",
      configureBtn: false,
      allData: IA.allData,
      dataSourceGroupList: [],
      dSourceGroupList: IA.dSourceGroupList,
    };
  },
  computed: {
    dataList() {
      let list = this.dataSourceGroupList;
      list = list.filter((l) => {
        let isFound = this.selectedData.find((sd) => sd.id === l.id);
        let isFiltered = this.dataSearchText
          ? l.name.toLowerCase().includes(this.dataSearchText.toLowerCase())
          : true;
        if (!isFound && isFiltered) {
          return l;
        }
      });
      return list;
    },
  },
  watch: {
    dataSource(newValue) {
      if (newValue) {
        this.selectedData = [];
        this.getDataSourceGroup();
      }
    },
    allowedOptions: {
      handler(newValue) {
        if (newValue[this.dataSource]) {
          this.selectedData = newValue[this.dataSource];
        }
      },
      deep: true,
    },
  },
  methods: {
    moveData({ type, data = "all" }) {
      if (type === "+") {
        if (data === "all") {
          this.selectedData = [...this.selectedData, ...this.dataList];
        } else {
          this.selectedData.push(data);
        }
      } else {
        if (data === "all") {
          this.selectedData = [];
        } else {
          this.selectedData = this.selectedData.filter((p) => p.id !== data.id);
        }
      }
    },
    getDataSourceGroup() {
      this.$store.commit("setLoading", true);
      this.dataSourceGroupList = [];
      if (this.allData[this.dataSource]["dataSourceGroup"].length) {
        this.dataSourceGroupList =
          this.allData[this.dataSource]["dataSourceGroup"];
        this.dataSourceGroup =
          this.allData[this.dataSource]["selectedSourceGroup"];
        if (this.allowedOptions[this.dataSource]) {
          this.selectedData = this.allowedOptions[this.dataSource];
        }
        this.$store.commit("setLoading", false);
      } else {
        let page =
          this.dataSource === "dataSets"
            ? this.allData[this.dataSource]["data"]["pager"]["page"] * 1 + 1
            : 1;
        let indicatorGroups = service.getDataSourceGroupsNew(
          this.dataSource,
          page
        );
        indicatorGroups.then((response) => {
          if (this.allowedOptions[this.dataSource]) {
            this.selectedData = this.allowedOptions[this.dataSource];
          }
          if (this.dataSource === "indicators") {
            // let allowedList = ["HMIS- Maternal Health", "RMNCH Scorecard"]
            // this.dataSourceGroupList = response.data.indicatorGroups.filter(l => allowedList.includes(l.name))
            this.allData[this.dataSource]["dataSourceGroup"] =
              response.data.indicatorGroups;
            this.dataSourceGroupList = response.data.indicatorGroups;
          }
          if (this.dataSource === "dataElements") {
            // let allowedList = ["HMIS-MAAR- All data elements of Family Planning", "HMIS-MAAR- All data elements of Maternal Health", "HMIS-MIAR- All data elements of Maternal & Neonatal Care"]
            // this.dataSourceGroupList = response.data.dataElementGroups.filter(l => allowedList.includes(l.name))
            this.allData[this.dataSource]["dataSourceGroup"] =
              response.data.dataElementGroups;
            this.dataSourceGroupList = response.data.dataElementGroups;
          }
          if (this.dataSource === "dataSets") {
            this.dataSourceGroupList = this.dSourceGroupList;
            this.allData[this.dataSource]["dataSourceGroup"] =
              this.dSourceGroupList;
            let originalDSets = [];
            response.data.dataSets.forEach((d) => {
              this.dSourceGroupList.forEach((ds) => {
                if (ds.alias !== "ALL") {
                  originalDSets.push({
                    ...d,
                    id: d.id + "." + ds.alias,
                    name: d.name + " (" + ds.name + ")",
                    dataSourceGroup: ds.name,
                  });
                }
              });
            });
            if (response.data.pager) {
              this.allData[this.dataSource]["data"]["pager"]["page"] = page;
              this.allData[this.dataSource]["data"]["pager"]["pageCount"] =
                response.data.pager.pageCount;
            }
            this.originalDataSets = originalDSets;
          }
          if (this.dataSource === "eventDataItems") {
            this.allData[this.dataSource]["dataSourceGroup"] =
              response.data.programs;
            this.allData["programIndicators"]["dataSourceGroup"] =
              response.data.programs;
            this.dataSourceGroupList = response.data.programs;
          }
          if (this.dataSource === "programIndicators") {
            this.allData["eventDataItems"]["dataSourceGroup"] =
              response.data.programs;
            this.allData[this.dataSource]["dataSourceGroup"] =
              response.data.programs;
            this.dataSourceGroupList = response.data.programs;
          }

          this.$store.commit("setLoading", false);
        });
      }
    },
    updateConfigData() {
      this.$store.commit("setLoading", true);
      let key = this.generateKey("interactiveConfig");
      let allKeys = service.getAllKeys();
      allKeys
        .then((keys) => {
          if (keys.data.includes(key)) {
            let saveConfig = service.getSavedConfig(key);
            saveConfig.then((res) => {
              let configData = res.data;
              configData[this.dataSource] = this.selectedData;
              let response = service.updateConfig(configData, key);
              response
                .then((response) => {
                  if (response.data.status === "OK") {
                    this.sweetAlert({
                      title: this.$i18n.t("data_saved_successfully"),
                    });
                    this.$store.state.loading = false;
                    this.$emit("getUpdatedOpt", configData);
                  } else {
                    this.sweetAlert({
                      title: this.$i18n.t("error"),
                      text: `${response.data.message}`,
                    });
                    this.$store.state.loading = false;
                    return;
                  }
                })
                .catch((error) => {
                  this.sweetAlert({
                    title: this.$i18n.t("error"),
                  });
                  this.$store.state.loading = false;
                  return;
                });
            });
          } else {
            let configData = {
              [this.dataSource]: this.selectedData,
            };
            let response = service.saveConfig(configData, key);
            response.then((response) => {
              if (response.data.status === "OK") {
                this.sweetAlert({
                  title: this.$i18n.t("data_saved_successfully"),
                });
                this.$store.state.loading = false;
                this.$emit("getUpdatedOpt", configData);
              } else {
                this.sweetAlert({
                  title: this.$i18n.t("error"),
                  text: `${response.data.message}`,
                });
                this.$store.state.loading = false;
                return;
              }
            });
          }
        })
        .catch(() => {
          this.$store.state.loading = false;
        });
    },
  },
  created() {
    this.dataSource = "indicators";
    this.dataOptions = [
      {
        id: 1,
        value: "indicators",
        text: this.$i18n.t("indicators"),
      },
      {
        id: 2,
        value: "dataElements",
        text: this.$i18n.t("dataElement"),
      },
      {
        id: 3,
        value: "dataSets",
        text: this.$i18n.t("dataSets"),
      },
      {
        id: 4,
        value: "eventDataItems",
        text: this.$i18n.t("eventDataItems"),
      },
      {
        id: 5,
        value: "programIndicators",
        text: this.$i18n.t("programIndicators"),
      },
    ];
  },
};
</script>