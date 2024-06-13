<template>
  <div
    class="totalicons dqr-chart1"
    :class="{ 'charticon-overlay': visible, isMapIcon: mapView }"
    :style="{ width: mapView && '265px' }"
  >
    <div class="icontoggle">
      <div class="openicons" :class="{ 'mr-2': !visible }">
        <img
          v-if="!drillDown && mapView"
          :src="require(`@/assets/images/icons/icon-globe.svg`)"
          :style="{ opacity: tType == 'map' ? 1 : 0.5, filter: filterColor }"
          v-b-tooltip.hover
          :title="$t('mapViewIcon')"
          class="img-fluid icon"
          @click.prevent="getActive('map')"
        />
        <img
          v-if="!drillDown"
          :src="require(`@/assets/images/icons/chartnewActive.svg`)"
          :style="{ opacity: tType == 'chart' ? 1 : 0.5, filter: filterColor }"
          v-b-tooltip.hover
          :title="$t('chartViewIcon')"
          class="img-fluid icon"
          @click.prevent="getActive('chart')"
        />
        <img
          v-if="!drillDown"
          :src="require(`@/assets/images/icons/tablenewActive.svg`)"
          :style="{ opacity: tType == 'table' ? 1 : 0.5, filter: filterColor }"
          v-b-tooltip.hover
          :title="$t('tableViewIcon')"
          class="img-fluid icon"
          @click.prevent="getActive('table')"
        />
      </div>

      <b-collapse id="collapse-n" v-model="visible">
        <b-dropdown
          right
          no-caret
          @hide="hideClass"
          menu-class="chart-dd-menu"
          v-if="tType !== 'table' && !drillDown"
          toggle-class="text-decoration-none bg-transparent border-0 dropdown-toggle p-0"
        >
          <template v-slot:button-content>
            <img
              :src="require(`@/assets/images/icons/sortnewActive.svg`)"
              :style="{
                opacity: activeIcon == 'sort' ? 1 : 0.5,
                filter: filterColor,
              }"
              v-b-tooltip.hover
              :title="$t('sorting')"
              class="img-fluid icon"
              @click.prevent="getActive('sort')"
            />
          </template>
          <b-dropdown-group>
            <template v-if="sortOptions.length">
              <template v-for="(opt, i) in sortOptions">
                <b-dropdown-item
                  v-if="sortType !== opt.id"
                  :key="'sortOption-' + opt.id + i"
                  @click.prevent="dataSort(opt.id)"
                  class="list-group-item bg-transparent px-0"
                >
                  <a href="#" class="color-white">
                    <div class="row no-gutters">
                      <div class="col-lg-10">
                        <p class="m-0px">{{ $t("sortBy") }}</p>
                      </div>
                      <div class="col-lg-2">
                        <p class="m-0px">
                          <i class="fa" :class="opt.value"></i>
                        </p>
                      </div>
                    </div>
                  </a>
                </b-dropdown-item>
              </template>
            </template>
            <template v-else>
              <b-dropdown-text class="text-center no-data-error-msg">{{
                $t("noOptions")
              }}</b-dropdown-text>
            </template>
          </b-dropdown-group>
        </b-dropdown>
        <img
          v-if="tType !== 'table' && !drillDown"
          :src="require(`@/assets/images/icons/previewnewActive.svg`)"
          :style="{
            opacity: activeIcon == 'preview' ? 1 : 0.5,
            filter: filterColor,
          }"
          v-b-tooltip.hover
          :title="$t('preview')"
          class="img-fluid icon"
          @click.prevent="getActive('preview'), fullScreen()"
        />
        <b-dropdown
          right
          no-caret
          ref="dropdown"
          @hide="hideClass"
          id="dropdown-form"
          @show="getComments"
          menu-class="chart-dd-menu comment-menu"
          toggle-class="text-decoration-none bg-transparent border-0 dropdown-toggle p-0">
          <template v-slot:button-content>
            <img
              :src="require(`@/assets/images/icons/commentnewActive.svg`)"
              :style="{
                opacity: activeIcon == 'comment' ? 1 : 0.5,
                filter: filterColor,
              }"
              v-b-tooltip.hover
              :title="$t('commentsIcon')"
              class="img-fluid icon"
              @click.prevent="getActive('comment')"
            />
          </template>
          <b-overlay rounded="sm" :show="loadComment">
            <div
              class="commentDropDownBox h-300px overflow-auto color-dark-grey"
            >
              <b-dropdown-form
                class="border-bottom-black dropdownComments"
                v-if="
                  $store.getters.getIsAdmin ||
                  $store.getters.getAppSettings.bypassUser ||
                  $store.getters.getUserPermissions.canComment
                "
              >
                <b-form-group @submit.stop.prevent>
                  <div style="position: relative">
                    <textarea v-model="textWithComment" class="form-control" @input="onOpen" />

                    <div v-if="mentionDropdownVisible" class="mention-dropdown">
                      <div
                        v-for="(item, index) in items"
                        :key="index"
                        class="mention-item"
                        @click="(e) => selectMention(e, item)"
                      >
                        {{ item.text }}
                      </div>
                      <div v-if="items.length === 0" class="mention-no-result">
                        No result
                      </div>
                    </div>
                  </div>
                  <span
                    >{{ textWithComment.length }}/{{ commentTextMaxLength }}</span
                  >
                </b-form-group>

                <div class="col-sm-12 m-t-30px text-right px-0">
                  <b-button
                    class="chartsBtn black-btn blue-btn mr-3 btn-sm"
                    @click.prevent="addComment"
                    :disabled="
                      textWithComment.length === 0 ||
                      textWithComment.length > commentTextMaxLength
                    "
                    >{{ $t("submitbtn") }}</b-button
                  >
                  <b-button
                    :disabled="!textWithComment"
                    @click.prevent="cancelComment"
                    class="canbtn btn-sm"
                    >{{ $t("cancelbtn") }}</b-button
                  >
                </div>
              </b-dropdown-form>
              <div class="col-lg-12 px-0 mt-3">
                <template v-if="commentList.length > 0">
                  <div
                    class="media"
                    :class="{ 'm-t-10px': index !== 0 }"
                    v-for="(comment, index) in commentList"
                    :key="comment.id"
                  >
                    <div
                      class="row border-bottom-black mx-0 w-100"
                      style="padding-bottom: 10px"
                    >
                      <div class="col-md-2">
                        <i
                          class="fa fa-user fa-2x img-thumbnail"
                          aria-hidden="true"
                        ></i>
                      </div>
                      <div class="col-md-10">
                        <div class="media-body">
                          <h6 class="mt-0">{{ comment.user.displayName }}</h6>
                          <h6 class="font-weight-normal f-s-0-875rem w-100">
                            {{ comment.text }}
                          </h6>
                          <div class="row">
                            <div class="col commentsactionlinkcontainer hide">
                              <a href="#" :title="$t('like')" v-b-tooltip>
                                <i class="fa fa-thumbs-up"></i>
                              </a>
                              <a href="#" :title="$t('reply')" v-b-tooltip>
                                <i class="fa fa-reply"></i>
                              </a>
                              <a
                                href="#"
                                :title="$t('edit')"
                                v-b-tooltip
                                v-if="
                                  $store.getters.getLoggedInUserId ===
                                  comment.user.id
                                "
                              >
                                <i class="fa fa-pencil"></i>
                              </a>
                              <a
                                href="#"
                                :title="$t('deletebtn')"
                                v-b-tooltip
                                v-if="
                                  $store.getters.getLoggedInUserId ===
                                  comment.user.id
                                "
                              >
                                <i class="fa fa-trash"></i>
                              </a>
                            </div>
                            <div class="col text-right">
                              <p class="f-w-500 commentsdate mb-0">
                                <i class="fa fa-calendar"></i>
                                {{ comment.created }}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="text-center no-data-error-msg">
                    {{ $t("no_data_to_display") }}
                  </div>
                </template>
              </div>
            </div>
          </b-overlay>
        </b-dropdown>
        <b-dropdown
          right
          no-caret
          @hide="hideClass"
          menu-class="chart-dd-menu"
          @show="getActive('download')"
          toggle-class="text-decoration-none bg-transparent border-0 dropdown-toggle p-0"
        >
          <!-- v-if="tType !== 'map'" -->
          <template v-slot:button-content>
            <img
              :src="require(`@/assets/images/icons/downloadnewActive.svg`)"
              :style="{
                opacity: activeIcon == 'download' ? 1 : 0.5,
                filter: filterColor,
              }"
              v-b-tooltip.hover
              :title="$t('downloadIcon')"
              class="img-fluid icon1"
              @click.prevent="getActive('download')"
            />
          </template>
          <b-dropdown-group class="chart-dd-options" v-if="tType == 'table'">
            <b-dropdown-item class="list-group-item bg-transparent px-0">
              <a class="color-white">
                <div class="row no-gutters">
                  <div class="col-lg-10">
                    <download-csv
                      class="btn color-white cursor-pointer w-100 p-0 text-left"
                      :data="tTable.items"
                      >{{ $t("csv") }}</download-csv
                    >
                  </div>
                  <div class="col-lg-2">
                    <p class="m-0px">
                      <i class="fa fa-file-image-o"></i>
                    </p>
                  </div>
                </div>
              </a>
            </b-dropdown-item>
          </b-dropdown-group>
          <b-dropdown-group class="download-dropdown" v-else>
            <b-dropdown-item
              class="list-group-item bg-transparent px-0"
              v-for="(opt, i) in downloadOptions"
              :key="'downloadOption-' + opt.id + i"
            >
              <a class="color-white" @click.prevent.stop="exportChart(opt.id)">
                <div class="row no-gutters options-item">
                  <div class="col-lg-10 text-left">
                    <p class="m-0px">{{ $t(`${opt.text}`) }}</p>
                  </div>
                  <div class="col-lg-2">
                    <p class="m-0px">
                      <i class="fa" :class="opt.icon"></i>
                    </p>
                  </div>
                </div>
              </a>
            </b-dropdown-item>
          </b-dropdown-group>
        </b-dropdown>
      </b-collapse>
      <b-button
        class="arrow-btn"
        :class="visible ? null : 'collapsed'"
        :aria-expanded="visible ? 'true' : 'false'"
        @click.prevent="visible = !visible"
      >
        <i class="fa fa-angle-double-right" aria-hidden="true"></i>
      </b-button>
    </div>
    <b-modal
      class="preview"
      body-bg-variant="var(--primary-bg-color)"
      v-model="modalShow"
      hide-footer
      centered
      size="xl"
      :title="name"
      modal-class="preview-modal-up"
      no-close-on-backdrop
    >
      <highcharts
        id="container"
        class="chartHeight h-100 align-items-center justify-content-center d-flex"
        :options="chartData"
      ></highcharts>
    </b-modal>
  </div>
</template>
<script>
import CommentMixin from "@/helpers/CommentMixin";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import service from "@/service";
import { Mentionable } from "vue-mention";
import "floating-vue/dist/style.css";

export default {
  components: {
    Mentionable,
  },
  props: [
    "cID",
    "title",
    "isTable",
    "mapView",
    "sorting",
    "viewType",
    "chartKey",
    "drillDown",
    "trendTable",
    "defaultSort",
    "fullScreenKey",
    "outliersMethodFull",
    "titleComment",
  ],
  mixins: [CommentMixin, DynamicImageMixin],
  data() {
    {
      return {
        name: "",
        chartData: "",
        visible: this.$store.getters?.getAppSettings?.enableChartOpt || false,
        modalShow: false,
        sortType: this.defaultSort,
        sortingOptions: {
          type1: ["0-1", "1-0"],
          type2: ["A-Z", "Z-A"],
          type3: ["JAN-DEC", "DEC-JAN"],
          type4: ["0-1", "1-0", "A-Z", "Z-A"],
          type5: ["0-1", "1-0", "JAN-DEC", "DEC-JAN"],
          type6: ["A-Z", "Z-A", "JAN-DEC", "DEC-JAN"],
          type7: ["0-1", "1-0", "A-Z", "Z-A", "JAN-DEC", "DEC-JAN"],
        },
        activeIcon: this.viewType,
        tType: this.viewType,
        commentText: "",
        textWithComment: "",
        items: [],
        mentionDropdownVisible: false,
      };
    }
  },
  computed: {
    downloadOptions() {
      let opt = [];
      opt = [
        {
          id: "png",
          text: "PNG",
          icon: "fa-file-powerpoint-o",
        },
        {
          id: "jpg",
          text: "JPG",
          icon: "fa-file-image-o",
        },
      ];
      if (this.tType === "chart") {
        opt.push({
          id: "pdf",
          text: "PDF",
          icon: "fa-file-pdf-o",
        });
      }
      return opt;
    },
    tTable() {
      return this.trendTable?.items
        ? {
            ...this.trendTable,
            //eslint-disable-next-line
            items: this.trendTable.items.map(
              ({ _cellVariants, regions, _rowVariant, ...rest }) => ({
                ...rest,
              })
            ),
          }
        : this.trendTable && this.trendTable.length > 0
        ? {
            //eslint-disable-next-line
            items: this.trendTable.map(
              ({ _cellVariants, regions, _rowVariant, ...rest }) => ({
                ...rest,
              })
            ),
          }
        : {
            items: [],
          };
    },
    sortOptions() {
      let opt = null;
      if (this.sorting) {
        opt = Array.isArray(this.sorting)
          ? this.sorting
          : this.sortingOptions[this.sorting];
      }
      let optArr =
        opt && opt.length
          ? opt.map((o) => {
              let val = "";
              if (o === "0-1") {
                val = "fa-sort-numeric-asc";
              }
              if (o === "1-0") {
                val = "fa-sort-numeric-desc";
              }
              if (o === "A-Z") {
                val = "fa-sort-alpha-asc";
              }
              if (o === "Z-A") {
                val = "fa-sort-alpha-desc";
              }
              if (o === "JAN-DEC") {
                val = "fa-custom-sort-date-asc";
              }
              if (o === "DEC-JAN") {
                val = "fa-custom-sort-date-desc";
              }
              return {
                id: o,
                value: val,
              };
            })
          : [];
      return optArr;
    },
  },
  watch: {
    viewType(newValue) {
      this.tType = newValue;
    },
    modalShow(newValue) {
      if (!newValue) {
        this.$emit("resetDrillDown");
        this.hideClass();
      }
    },
    outliersMethodFull(newValue) {
      if (!newValue) {
        this.hideClass();
      }
    },
  },
  methods: {
    selectMention(e, mention) {
      e.stopPropagation();
      let textArr = this.textWithComment.split(" ").slice(0,-1)
      this.textWithComment = textArr.join(" ")
      this.textWithComment += this.textWithComment.length > 0 ?  " " + mention.value + " " : mention.value + " ";
      this.mentionDropdownVisible = false;
    },
    async onOpen() {
      if(this.$store.getters?.getAppSettings?.commentVersion==='new'){
        this.items = [];
        this.mentionDropdownVisible = false;
        let text = this.textWithComment;
        let atIndex = text.lastIndexOf("@");
        if (
          atIndex !== -1 &&
          (atIndex === 0 || /\s/.test(text.charAt(atIndex - 1)))
        ) {
          const query = text.substring(atIndex + 1);
          const resp = await service.getFilteredUserList(query);
          if (resp) {
            resp.data.users.forEach((i) => {
              // console.log("i", i);
              this.items.push({
                value: i.displayName,
                text: i.displayName,
              });
            });
            this.mentionDropdownVisible = true;
          } else {
            this.mentionDropdownVisible = false;
          }
        } else {
          this.mentionDropdownVisible = false;
        }
      }
    },
    hideClass() {
      this.activeIcon = this.tType;
      document.body.className = "";
    },
    getActive(val) {
      this.activeIcon = val;
      if (["chart", "table", "map"].includes(val)) {
        this.tType = val;
        this.$emit("showTable", val, this.chartKey);
      }
      document.body.className = val === "comment" ? "commentActive" : "";
    },
    fullScreen() {
      let key = this.fullScreenKey ? this.fullScreenKey : this.chartKey;
      this.$emit("toggleFullscreen", key);
    },
    dataSort(type) {
      this.sortType = type;
      this.$emit("dataSort", type, this.chartKey);
    },
    exportChart(type) {
      this.$emit("exportChart", type, this.chartKey);
    },
  },
  created() {},
};
</script>
<style scoped lang="scss">
.fa-custom-sort-date-asc,
.fa-custom-sort-date-desc {
  position: relative;
  width: 35px;
}
.fa-custom-sort-date-asc::before,
.fa-custom-sort-date-desc::before {
  content: "\f175";
  position: relative;
  right: 0px;
}
.fa-custom-sort-date-asc::after,
.fa-custom-sort-date-desc::after {
  position: absolute;
  width: 18px;
  top: 0;
  right: 8px;
  font-size: 0.625rem;
  line-height: 9px;
  font-family: "courier new", monospace;
  font-weight: bold;
}
.fa-custom-sort-date-asc::after {
  content: "JAN\a DEC";
  white-space: pre-line;
}
.fa-custom-sort-date-desc::after {
  content: "DEC\aJAN";
  white-space: pre;
}

.positionDD {
  width: 150px;
  height: 25px;
  background-color: transparent !important;
  position: absolute !important;
}

.positionDD.custom-select {
  color: #4a5768 !important;
}
.spinCSS {
  position: absolute;
  top: 0;
  background: grey;
}

.mention-dropdown {
  position: absolute;
  top: 105%;
  left: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000; /* Adjust z-index as needed */
  height: 300%;
  overflow: auto;
  width: 100%;
}

.mention-item {
  padding: 8px 12px;
  cursor: pointer;
}

.mention-item:hover {
  background-color: #f5f5f5;
}

.mention-no-result {
  padding: 8px 12px;
  color: #999;
}
</style>
