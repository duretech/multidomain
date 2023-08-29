<template>
  <div class="pt-1 pb-1" :key="reusableKey">
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
    <div class="py-1 fs-17-1920">
      <b-dropdown
        :id="'dropdown-indi' + reusableKey"
        :text="dataSourceGroupText"
        class="indi mt-2 mb-2 w-100 text-left fs-17-1920"
        @show="getDataSourceGroup"
        lazy
        menu-class="data-source-group-list fs-17-1920"
        @click.prevent="getActive('comment')"
      >
        <b-dropdown-item
          v-for="dataSourceGroup in dataSourceGroupList"
          :key="dataSourceGroup.id"
          :value="dataSourceGroup.id"
          @click="setDataSource(dataSourceGroup)"
          ><div class="fs-17-1920">
            {{ dataSourceGroup.name }}
          </div></b-dropdown-item
        >
        <b-dropdown-text
          class="color-white text-center small fs-17-1920"
          v-if="dataSourceGroupList.length === 0"
        >
          <span class="fs-17-1920 small"
            >{{ $t("no_data_to_display") }}
          </span></b-dropdown-text
        >
      </b-dropdown>
    </div>
    <div class="pb-1 fs-17-1920">
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
            <div class="left-data p-3" @scroll="onScroll">
              <ul class="med-list list-unstyled" ref="data_left">
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
              </ul>
            </div>
          </b-col>
          <b-col sm="6" class="pr-0">
            <div class="small text-right">{{ $t("selected") }}</div>
            <div class="right-data p-3">
              <ul class="med-list list-unstyled fs-17-1920" ref="data_right">
                <li
                  class="med-list-item pt-1 pb-1 fs-17-1920"
                  v-on:click="moveData({ type: '-', data: item })"
                  v-for="item in selectedData"
                  :key="item.id"
                >
                  {{ item.name }}
                  <span class="move-txt fs-17-1920"
                    >{{ $t("move") }}
                    <i class="fa fa-angle-double-left" aria-hidden="true"></i>
                  </span>
                </li>
              </ul>
            </div>
          </b-col>
        </b-row>
        <b-row class="mt-3 move-btn">
          <b-col cols="6" class="text-center"
            ><b-button
              class="move-btn-left rounded-pill fs-17-1920"
              v-on:click="moveData({ type: '+' })"
              >{{ $t("moveAll") }}</b-button
            ></b-col
          >
          <b-col cols="6" class="text-center"
            ><b-button
              class="move-btn-right rounded-pill fs-17-1920"
              v-on:click="moveData({ type: '-' })"
              >{{ $t("moveAll") }}</b-button
            ></b-col
          >
        </b-row>
      </b-container>
    </div>
  </div>
</template>
<script>
import service from "@/service";
import IA from "./interactive";
export default {
  props: ["reusableKey", "isDrillDown", "editDrillDownData", "allowedOptions"],
  data() {
    return {
      loadMore: false,
      dataOptions: [],
      dataSource: null,
      selectedData: [],
      dataSearchText: "",
      dataSourceGroup: "",
      allData: IA.allData,
      originalDataSets: [],
      dataSourceGroupText: "",
      dataSourceGroupList: [],
      dSourceGroupList: IA.dSourceGroupList,
    };
  },
  watch: {
    dataSource(newValue) {
      let text = "";
      if (newValue === "indicators") {
        text = this.$i18n.t("IndGroup");
      }
      if (newValue === "dataElements") {
        text = this.$i18n.t("DEGroup");
      }
      if (newValue === "dataSets") {
        text = this.$i18n.t("DSGroup");
      }
      if (newValue === "eventDataItems" || newValue === "programIndicators") {
        text = this.$i18n.t("ProgGroup");
      }
      this.dataSourceGroupText = text;
      if (this.allData[this.dataSource]["selectedSourceGroup"]) {
        let isFound = this.allData[this.dataSource]["dataSourceGroup"].find(
          (d) => d.id === this.allData[this.dataSource]["selectedSourceGroup"]
        );
        if (isFound) {
          this.dataSourceGroupText = isFound.name;
          this.dataSourceGroup = isFound.id;
        }
      }
      this.selectedData = [];
      if (this.$route.query.bookmarkChart && !this.isDrillDown) {
        let data = JSON.parse(localStorage.getItem("bookmarkChart"));
        if (data.dataSource === newValue) {
          this.getDataSourceGroup();
        }
      }
      this.$emit("getDataSource", newValue);
    },
    dataSourceGroup(newValue) {
      this.$emit("getDataSourceGroup", newValue);
    },
    selectedData(newValue) {
      this.$emit("getSelectedData", newValue);
    },
  },
  computed: {
    dataList() {
      let list = this.allData[this.dataSource]["data"]["list"];
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
  methods: {
    getDataSourceGroup() {
      this.$store.commit("setLoading", true);
      this.dataSourceGroupList = [];
      let allowedList = this.allowedOptions[this.dataSource] || [];
      let aList = allowedList.length ? allowedList.map((a) => a.id) : [];
      if (this.allData[this.dataSource]["dataSourceGroup"].length) {
        this.dataSourceGroupList = this.allData[this.dataSource][
          "dataSourceGroup"
        ].filter((l) => aList.includes(l.id));
        this.dataSourceGroup =
          this.allData[this.dataSource]["selectedSourceGroup"];
        this.$store.commit("setLoading", false);
        if (this.$route.query.bookmarkChart && !this.isDrillDown) {
          this.dataSourceGroup = JSON.parse(
            localStorage.getItem("bookmarkChart")
          ).dataSourceGroup;
          this.getData();
        } else if (this.isDrillDown && this.editDrillDownData) {
          this.dataSourceGroup = this.editDrillDownData.dataSourceGroup;
        }
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
          if (this.dataSource === "indicators") {
            // let allowedList = ["HMIS- Maternal Health", "RMNCH Scorecard"]
            // this.dataSourceGroupList = response.data.indicatorGroups.filter(l => allowedList.includes(l.name))
            this.allData[this.dataSource]["dataSourceGroup"] =
              response.data.indicatorGroups;
            this.dataSourceGroupList = response.data.indicatorGroups.filter(
              (l) => aList.includes(l.id)
            );
            // this.dataSourceGroupList.unshift({
            // 	id: "All",
            // 	name: "[All Indicators]",
            // });
          }
          if (this.dataSource === "dataElements") {
            // let allowedList = ["HMIS-MAAR- All data elements of Family Planning", "HMIS-MAAR- All data elements of Maternal Health", "HMIS-MIAR- All data elements of Maternal & Neonatal Care"]
            // this.dataSourceGroupList = response.data.dataElementGroups.filter(l => allowedList.includes(l.name))
            this.allData[this.dataSource]["dataSourceGroup"] =
              response.data.dataElementGroups;
            this.dataSourceGroupList = response.data.dataElementGroups.filter(
              (l) => aList.includes(l.id)
            );
            // this.dataSourceGroupList.unshift({
            // 	id: "All",
            // 	name: "[All Data Elements]",
            // });
          }
          if (this.dataSource === "dataSets") {
            this.dataSourceGroupList = this.dSourceGroupList.filter((l) =>
              aList.includes(l.id)
            );
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
            this.dataSourceGroupList = response.data.programs.filter((l) =>
              aList.includes(l.id)
            );
          }
          if (this.dataSource === "programIndicators") {
            this.allData["eventDataItems"]["dataSourceGroup"] =
              response.data.programs;
            this.allData[this.dataSource]["dataSourceGroup"] =
              response.data.programs;
            this.dataSourceGroupList = response.data.programs.filter((l) =>
              aList.includes(l.id)
            );
          }

          this.$store.commit("setLoading", false);
          if (this.$route.query.bookmarkChart && !this.isDrillDown) {
            this.dataSourceGroup = JSON.parse(
              localStorage.getItem("bookmarkChart")
            ).dataSourceGroup;
            this.getData();
          } else if (this.isDrillDown && this.editDrillDownData) {
            this.dataSourceGroup = this.editDrillDownData.dataSourceGroup;
          }
        });
      }
    },
    getData() {
      this.allData[this.dataSource]["selectedSourceGroup"] =
        this.dataSourceGroup;
      this.$store.commit("setLoading", true);
      if (this.dataSource === "dataSets") {
        if (this.dataSourceGroup === "[All metrics]") {
          this.allData[this.dataSource]["data"]["list"] = this.originalDataSets;
        } else {
          this.allData[this.dataSource]["data"]["list"] =
            this.originalDataSets.filter(
              (d) => d.dataSourceGroup === this.dataSourceGroup
            );
        }
        if (this.$route.query.bookmarkChart && !this.isDrillDown) {
          this.selectedData = JSON.parse(
            localStorage.getItem("bookmarkChart")
          ).selectedData;
        } else if (this.isDrillDown && this.editDrillDownData) {
          this.selectedData = this.editDrillDownData.selectedData;
        }
        this.$store.commit("setLoading", false);
      } else {
        let page =
          this.allData[this.dataSource]["data"]["pager"]["page"] * 1 + 1 || 1;
        this.getNextPage(page);
      }
    },
    hideClass() {
      this.activeIcon = this.tType;
      document.body.className = "";
    },
    getActive(val) {
      this.activeIcon = val;
      if (val === "chart" || val === "table" || val === "map") {
        this.tType = val;
        this.$emit("showTable", val, this.chartKey);
      }
      document.body.className = val === "comment" ? "commentActive" : "";
    },
    getNextPage(page, isAppend = false) {
      let indicators = service.getFilteredDataNew(
        this.dataSource,
        this.dataSourceGroup,
        page
      );
      indicators.then((response) => {
        if (this.dataSource === "indicators") {
          this.allData[this.dataSource]["data"]["list"] = isAppend
            ? this.allData[this.dataSource]["data"]["list"].concat(
                response.data.indicators
              )
            : response.data.indicators;
        }
        if (this.dataSource === "dataElements") {
          this.allData[this.dataSource]["data"]["list"] = isAppend
            ? this.allData[this.dataSource]["data"]["list"].concat(
                response.data.dataElements
              )
            : response.data.dataElements;
        }

        if (this.dataSource === "eventDataItems") {
          this.allData[this.dataSource]["data"]["list"] = isAppend
            ? this.allData[this.dataSource]["data"]["list"].concat(
                response.data.programDataElements
              )
            : response.data.programDataElements;
        }
        if (this.dataSource === "programIndicators") {
          this.allData[this.dataSource]["data"]["list"] = isAppend
            ? this.allData[this.dataSource]["data"]["list"].concat(
                response.data.programIndicators
              )
            : response.data.programIndicators;
        }
        if (response.data.pager) {
          this.allData[this.dataSource]["data"]["pager"]["page"] = page;
          this.allData[this.dataSource]["data"]["pager"]["pageCount"] =
            response.data.pager.pageCount;
        }
        this.loadMore = false;
        if (this.$route.query.bookmarkChart && !this.isDrillDown) {
          this.selectedData = JSON.parse(
            localStorage.getItem("bookmarkChart")
          ).selectedData;
        } else if (this.isDrillDown && this.editDrillDownData) {
          this.selectedData = this.editDrillDownData.selectedData;
        }
        this.$store.commit("setLoading", false);
      });
    },
    onScroll(e) {
      const { scrollTop, offsetHeight, scrollHeight } = e.target;
      if (scrollTop + offsetHeight >= scrollHeight - 5) {
        if (
          !this.loadMore &&
          this.allData[this.dataSource]["data"]["pager"]["page"] <
            this.allData[this.dataSource]["data"]["pager"]["pageCount"]
        ) {
          this.loadMore = true;
          this.$store.commit("setLoading", true);
          this.getNextPage(
            this.allData[this.dataSource]["data"]["pager"]["page"] * 1 + 1,
            true
          );
        }
      }
    },
    setDataSource(dataSourceGroup) {
      this.dataSourceGroup = dataSourceGroup.id;
      this.dataSourceGroupText = dataSourceGroup.name;
      this.allData[this.dataSource]["data"]["pager"]["page"] = 0;
      this.allData[this.dataSource]["data"]["pager"]["pageCount"] = 0;
      this.getData();
    },
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
  },
  created() {
    if (this.$route.query.bookmarkChart && !this.isDrillDown) {
      let data = JSON.parse(localStorage.getItem("bookmarkChart"));
      this.dataSource = data.dataSource;
      this.getDataSourceGroup();
    } else if (this.isDrillDown && this.editDrillDownData) {
      this.dataSource = this.editDrillDownData.dataSource;
      this.getDataSourceGroup();
    } else {
      this.dataSource = "indicators";
    }
    this.dataOptions = [
      {
        value: "indicators",
        text: this.$i18n.t("indicators"),
      },
      {
        value: "dataElements",
        text: this.$i18n.t("dataElement"),
      },
      {
        value: "dataSets",
        text: this.$i18n.t("dataSets"),
      },
      {
        value: "eventDataItems",
        text: this.$i18n.t("eventDataItems"),
      },
      {
        value: "programIndicators",
        text: this.$i18n.t("programIndicators"),
      },
    ];
  },
};
</script>
