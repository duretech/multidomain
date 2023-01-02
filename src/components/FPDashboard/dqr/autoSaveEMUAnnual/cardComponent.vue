<template>
  <div>
    <loader v-if="showLoader" />
    <div class="card">
      <div class="card-header px-2 py-0 text-decoration-none">
        <div class="row no-gutters">
          <div class="col-lg-12 col-md-12 p-t-4px" :title="chartdata.title">
            <div class="cardTitleSection text-wrap  fs-19-1920">
              <i class="fa fa-info-circle color-white cursor-pointer chart-info mr-2 ml-2" aria-hidden="true" v-b-popover.hover.rightbottom="{
                  variant: 'info', content: chartdata.chartInfo,title: chartdata.title,html: true}"></i>
              <p class="title_p fs-19-1920 m-0">{{ chartdata.title }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="row px-3 pt-2">
        <div class="col-lg-12 col-md-12" v-if="!bShowIcons">
          <div class="row">
            <div class="col-12 text-right">
              <div class="dropdown float-right ml-2">
                <b-dropdown right toggle-class="text-decoration-none bg-transparent border-0 dropdown-toggle p-0"
                  no-caret menu-class="chart-dd-menu" @hide="hideClass" @show="getActive('download')">
                  <template v-slot:button-content>
                    <img v-if="activeIcon == 'download'" :src="require('@/assets/img/icons/download_new_active.png')" class="img"  v-b-tooltip.hover :title="$t('downloadIcon')"/>
                    <img v-else :src="require('@/assets/img/icons/download_new.png')" class="img imgWidth_15px"  v-b-tooltip.hover :title="$t('downloadIcon')"/>
                  </template>
                  <b-dropdown-group class="chart-dd-options" v-if="viewType == 'table_viewType'" >
                    <b-dropdown-item class="list-group-item bg-transparent px-0">
                      <a class="color-white">
                        <div class="row no-gutters">
                          <div class="col-lg-10">
                            <download-csv class=" text-left" :data="exportData">CSV</download-csv>
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
                  <b-dropdown-group class="chart-dd-options" v-if="viewType == 'chart_viewType'">
                    <b-dropdown-item class="list-group-item bg-transparent px-0">
                      <a class="color-white" @click="exportChart('png')">
                        <div class="row no-gutters">
                          <div class="col-lg-10 text-left">
                            <p class="m-0px">PNG</p>
                          </div>
                          <div class="col-lg-2">
                            <p class="m-0px">
                              <i class="fa fa-file-powerpoint-o"></i>
                            </p>
                          </div>
                        </div>
                      </a>
                    </b-dropdown-item>
                    <b-dropdown-item class="list-group-item bg-transparent px-0">
                      <a class="color-white" @click="exportChart('jpg')">
                        <div class="row no-gutters">
                          <div class="col-lg-10 text-left">
                            <p class="m-0px">JPG</p>
                          </div>
                          <div class="col-lg-2">
                            <p class="m-0px">
                              <i class="fa fa-file-image-o"></i>
                            </p>
                          </div>
                        </div>
                      </a>
                    </b-dropdown-item>
                    <b-dropdown-item class="list-group-item bg-transparent px-0">
                      <a class="color-white" @click="exportChart('pdf')">
                        <div class="row no-gutters">
                          <div class="col-lg-10 text-left">
                            <p class="m-0px">PDF</p>
                          </div>
                          <div class="col-lg-2">
                            <p class="m-0px">
                              <i class="fa fa-file-pdf-o"></i>
                            </p>
                          </div>
                        </div>
                      </a>
                    </b-dropdown-item>
                  </b-dropdown-group>
                </b-dropdown>
              </div>
              <div class="float-right ml-2">
                  <a ref="table_viewType" @click="changeViewType('table_viewType'); getActive('table')" :title="$t('tableViewIcon')" v-b-tooltip>
                  <img v-if="viewType == 'table_viewType'" :src="require('@/assets/img/icons/table_new_active.png')" class="img cursor-pointer imgWidth_20px"/>
                  <img v-else :src="require('@/assets/img/icons/table_new.png')" class="img cursor-pointer imgWidth_20px viewType"/>
                </a>
              </div>
              <div class="float-right ml-2">
                  <a ref="chart_viewType" @click="changeViewType('chart_viewType'); getActive('chart')" :title="$t('chartViewIcon')" v-b-tooltip>
                    <img v-if="viewType == 'chart_viewType'" :src="require('@/assets/img/icons/chart_new_active.png')" class="img cursor-pointer imgWidth_20px"/>
                    <img v-else :src="require('@/assets/img/icons/chart_new.png')" class="img cursor-pointer imgWidth_20px chartType viewType"/>
                  </a>
              </div>
              <div class="float-right ml-2 hide" v-if="viewType !== 'table_viewType' && chartdata.type != 'pie'">
                  <b-dropdown right toggle-class="text-decoration-none bg-transparent border-0 dropdown-toggle p-0"
                    no-caret menu-class="chart-dd-menu" @hide="hideClass" @show="getActive('sort')">
                    <template v-slot:button-content>
                      <img v-if="activeIcon == 'sort'" :src="require('@/assets/img/icons/sort_new_active.png')" class="img imgWidth_20px" v-b-tooltip.hover :title="$t('sorting')"/>
                      <img v-else :src="require('@/assets/img/icons/sort_new.png')" class="img imgWidth_20px" v-b-tooltip.hover :title="$t('sorting')"/>
                    </template>
                    <b-dropdown-group class="chart-dd-options">
                      <b-dropdown-item v-for="option in dataOptions" :key="option.value" :value="option.value" @click="sortData(option.value)" class="list-group-item bg-transparent px-0">
                        <div class="row no-gutters color-white">
                          <div class="col-lg-10">
                            <p class="m-0px">{{ $t("sortBy") }}</p>
                          </div>
                          <div class="col-lg-2">
                            <p class="m-0px">
                              <i :class="[`fa fa-sort-numeric-${option.value}`]"></i>
                            </p>
                          </div>
                        </div>
                      </b-dropdown-item>
                    </b-dropdown-group>
                  </b-dropdown>
              </div>
              <div class="dropdown float-right ml-2" v-if="viewType !== 'table_viewType' && sorting && chartdata.type != 'pie'">
                <a class="dropdown-toggle" href="#" role="button" id="dropdownOptionsLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <!-- <img :src="require('@/assets/img/icons/sort.png')" class="img" /> -->
                  <img v-if="activeIcon == 'sort'" :src="require('@/assets/img/icons/sort_new_active.png')" class="img imgWidth_20px d-none" v-b-tooltip.hover :title="$t('sorting')" />
                  <img v-else :src="require('@/assets/img/icons/sort_new.png')" class="img imgWidth_20px" v-b-tooltip.hover :title="$t('sorting')" />
                </a>
                <div class="dropdown-menu dropdown-menu-right" id="dropdownOptions" aria-labelledby="dropdownOptionsLink">
                  <div class="card bg-transparent">
                    <div class="card-body p-0px">
                      <ul class="list-group">
                        <li
                          class="list-group-item bg-transparent color-white"
                          v-if="
                            sorting.includes('JAN-DEC') && sortType != 'JAN-DEC'
                          "
                          @click.prevent="sortData('desc', 'JAN-DEC')"
                        >
                          <a href="#" class="color-white">
                            <div class="row no-gutters">
                              <div class="col-lg-10">
                                <p class="m-0px">
                                  {{ $t("sortBy") }}
                                </p>
                              </div>
                              <div class="col-lg-2">
                                <p class="m-0px">
                                  <i
                                    class="fa fa-custom-sort-date-asc fa-fw"
                                  ></i>
                                </p>
                              </div>
                            </div>
                          </a>
                        </li>
                        <li
                          class="list-group-item bg-transparent color-white"
                          v-if="
                            sorting.includes('DEC-JAN') && sortType != 'DEC-JAN'
                          "
                          @click.prevent="sortData('asc', 'DEC-JAN')"
                        >
                          <a href="#" class="color-white">
                            <div class="row no-gutters">
                              <div class="col-lg-10">
                                <p class="m-0px">
                                  {{ $t("sortBy") }}
                                </p>
                              </div>
                              <div class="col-lg-2">
                                <p class="m-0px">
                                  <i
                                    class="fa fa-custom-sort-date-desc fa-fw"
                                  ></i>
                                </p>
                              </div>
                            </div>
                          </a>
                        </li>
                        <li
                          class="list-group-item bg-transparent color-white"
                          v-if="sorting.includes('Z-A') && sortType != 'Z-A'"
                          @click.prevent="sortData('desc', 'Z-A')"
                        >
                          <a href="#" class="color-white">
                            <div class="row no-gutters">
                              <div class="col-lg-10">
                                <p class="m-0px">
                                  {{ $t("sortBy") }}
                                </p>
                              </div>
                              <div class="col-lg-2">
                                <p class="m-0px">
                                  <i class="fa fa-sort-alpha-desc fa-fw"></i>
                                </p>
                              </div>
                            </div>
                          </a>
                        </li>
                        <li
                          class="list-group-item bg-transparent color-white"
                          v-if="sorting.includes('A-Z') && sortType != 'A-Z'"
                          @click.prevent="sortData('asc', 'A-Z')"
                        >
                          <a href="#" class="color-white">
                            <div class="row no-gutters">
                              <div class="col-lg-10">
                                <p class="m-0px">
                                  {{ $t("sortBy") }}
                                </p>
                              </div>
                              <div class="col-lg-2">
                                <p class="m-0px">
                                  <i class="fa fa-sort-alpha-asc fa-fw"></i>
                                </p>
                              </div>
                            </div>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="chartdata.cid" class="dropdown float-right  ml-2 commentSection">
                <b-dropdown id="dropdown-form" ref="dropdown" @hide="hideClass" @show="getActive('comment'); getComments(chartdata.cid)" right toggle-class="text-decoration-none bg-transparent border-0 dropdown-toggle p-0"
                    no-caret menu-class="chart-dd-menu">
                  <template v-slot:button-content>
                    <img v-if="activeIcon == 'comment'" :src="require('@/assets/img/icons/comment_new_active.png')" class="img cursor-pointer imgWidth_20px" v-b-tooltip.hover :title="$t('commentsIcon')"/>
                    <img v-else :src="require('@/assets/img/icons/comment_new.png')" class="img cursor-pointer imgWidth_20px" v-b-tooltip.hover :title="$t('commentsIcon')"/>
                  </template>
                  <div class="commentDropDownBox h-300px overflow-auto">
                    <b-dropdown-form class="border-bottom-black dropdownComments">
                    <b-form-group @submit.stop.prevent v-if="canComment">
                      <b-form-textarea v-model="commentText" :state=" commentText.length !== 0 && commentText.length <= commentTextMaxLength" :placeholder="commentPlaceholder" rows="3"></b-form-textarea>
                      <span>{{ commentText.length }}/{{commentTextMaxLength}}</span>
                    </b-form-group>

                    <div class="col-sm-12 m-t-30px text-center">
                      <b-button class="black-btn" @click.stop.prevent="addComment" :disabled="commentText.length === 0 || commentText.length > commentTextMaxLength">{{$t('submitbtn')}}</b-button>
                      <b-button :disabled="!commentText" @click.stop.prevent="cancelComment" variant="danger">{{$t('cancelbtn')}}</b-button>
                    </div>
                  </b-dropdown-form>
                  <div class="col-lg-12 px-0 mt-3">
                          <template v-if="commentList.length > 0">
                            <div class="media " :class="{ 'm-t-10px': index !== 0 }" v-for="(comment, index) in commentList" :key="comment.id">
                              <div class="row border-bottom-black mx-0 w-100" style="padding-bottom: 10px;">
                                <div class="col-md-2">
                                  <i class="fa fa-user fa-2x img-thumbnail" aria-hidden="true"></i>
                                </div>
                                <div class="col-md-10">
                                  <div class="media-body">
                                    <h6 class="mt-0">{{ comment.user.displayName }}</h6>
                                    <h6 class="font-weight-normal f-s-0-875rem w-100">{{ comment.text }}</h6>
                                    <div class="row ">
                                      <div class="col commentsactionlinkcontainer hide">
                                        <a href="#" :title="$t('like')" v-b-tooltip>
                                          <i class="fa fa-thumbs-up"></i>
                                        </a>
                                        <a href="#" :title="$t('reply')" v-b-tooltip>
                                          <i class="fa fa-reply"></i>
                                        </a>
                                        <a href="#" :title="$t('edit')" v-b-tooltip v-if="loggedInUserId === comment.user.id">
                                          <i class="fa fa-pencil"></i>
                                        </a>
                                        <a href="#" :title="$t('deletebtn')" v-b-tooltip v-if="loggedInUserId === comment.user.id">
                                          <i class="fa fa-trash"></i>
                                        </a>
                                      </div>
                                      <div class="col text-right">
                                        <p class="f-w-500 commentsdate mb-0"><i class="fa fa-calendar"></i> {{ comment.created }}</p>
                                      </div>
                                    </div>
                                    <div class="media mt-3 hide">
                                      <div class="row" style="padding-bottom: 10px;">
                                        <div class="col-md-2">
                                          <i class="fa fa-user fa-2x img-thumbnail" aria-hidden="true" ></i>
                                        </div>
                                        <div class="col-md-10">
                                          <div class="media-body">
                                            <h6 class="mt-0">John Doe</h6>
                                            <h6 class="font-weight-normal f-s-0-875rem">
                                              Location "R6" by "Implant" method
                                              is 28% more than National EMU
                                              Percentage.
                                            </h6>
                                            <div class="row">
                                              <div class="col commentsactionlinkcontainer">
                                                <a href="#"><i class="fa fa-thumbs-up"></i></a>
                                                <a href="#"><i class="fa fa-reply"></i></a>
                                                <a href="#"><i class="fa fa-pencil"></i></a>
                                                <a href="#"><i class="fa fa-trash"></i></a>
                                              </div>
                                              <div class="col text-right">
                                                <p class="f-w-500 commentsdate mb-0"><i class="fa fa-calendar"></i> Feb 17,2020</p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </template>
                          <template v-else>
                            <div class="text-center">
                              {{ $t("no_data_to_display") }}
                            </div>
                          </template>
                        </div>
                  </div>
                </b-dropdown>
              </div>
              <a v-if="viewType !== 'table_viewType'" @click.stop.prevent="fullScreen" @click="getActive('preview')">
                <img v-if="activeIcon == 'preview'" :src="require('@/assets/img/icons/preview_new_active.png')" class="img cursor-pointer imgWidth_20px float-right mt-1 ml-3" v-b-tooltip.hover :title="$t('preview')"/>
                <img v-else :src="require('@/assets/img/icons/preview_new.png')" class="img cursor-pointer imgWidth_20px float-right mt-1 ml-3"  v-b-tooltip.hover :title="$t('preview')"/>
              </a>
              <div class="float-right ml-2 dave2d" v-if="ddOptions">
                <select class="form-control typeDropdown" style="width: 110px; padding: 2px 2px 2px 5px;" v-model="ddValue" @change="handleFilterChange">
                  <option v-for="(option, ind) in ddOptions" :value="ind" :key="ind">
                    {{ option.charAt(0).toUpperCase() + option.slice(1) }}
                  </option>
                </select>
              </div>
              <div class="float-right ml-2 dave2d" v-if="period && viewType == 'chart_viewType'">
                <b-form-select class="typeDropdown" v-model="chartPlotType" :options="chartTypeOptions"></b-form-select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body pb-0 h-410px overflow-hidden">
        <div class="row">
          <div class="col-12" v-if="viewType == 'chart_viewType'">
            <highcharts :options="chartOptions" ref="inputCharts"></highcharts>
          </div>
          <div class="col-12" v-else>
            <!-- <b-table hover :items="items" :fields="fields" head-variant="light" sticky-header :bordered=true style="max-height: 400px !important"></b-table> -->
            <div v-if="chartdata.tableData">
              <b-table v-if="ddOptions" sticky-header striped hover :fields="chartdata.fields" :items="chartdata.tableData" style="margin-top: 40px;"></b-table>
              <b-table v-else sticky-header striped hover :fields="chartdata.fields" :items="chartdata.tableData"></b-table>
            </div>
          </div>
        </div>
      </div>
      <div class="card-footer text-right" v-if="!bShowIcons">
        <!-- <p class="m-0">{{$t('source')}}: <span>{{chartdata.source}}</span></p> -->
      </div>
      <b-modal v-model="modalShow" hide-footer centered size="xl" :title="chartdata.title" @hide="getActive('chart')" modal-class="preview-modal-up" no-close-on-backdrop>
        <highcharts class="chartHeight h-100 align-items-center justify-content-center d-flex" :options="cData"></highcharts>
      </b-modal>
    </div>
  </div>
</template>

<script>
import service from "@/service";
import Highcharts from "highcharts";
import exportingInit from "highcharts/modules/exporting";
import moment from "moment";
exportingInit(Highcharts);
export default {
  props: [
    "chartdata",
    "ddOptions",
    "handleFilterChange",
    "bShowIcons",
    "period",
    "canComment",
    "loggedInUserId",
    "chartComp",
    "emuType",
    "defaultSort",
    "sorting"
  ],
  components: {
  },
  mounted() {
   // console.log(this.$refs.download)
  },
  beforeDestroy () {
    //document.removeEventListener('click',this.close, 'indes')
  },
  data() {
    return {
      state: false,
      activeIcon: 'chart',
      ddValue: this.ddOptions ? 0 : null,
      dataOptions: [
        {
          value: "asc"
        },
        {
          value: "desc"
        }
      ],
      chartOptions: this.reInitilaizeData(this.chartdata),
      chartPlotType: "column",
      modalShow: false,
      viewType: "chart_viewType",
      fields: [],
      items: [],
      commentText: "",
      commentTextMaxLength: 100,
      commentList: [],
      cID: "",
      showLoader: false,
      chartTypeOptions: [
        {
          value: "column",
          text: this.$i18n.t("column")
        },
        {
          value: "area",
          text: this.$i18n.t("area")
        },
        {
          value: "line",
          text: this.$i18n.t("line")
        }
      ],
      exportData: this.chartdata.tableData,
      sortType: this.defaultSort,
      cData: ""
    };
  },
  computed: {
    commentPlaceholder: function() {
      return this.$i18n.t('placeholderMaxValue', {number: this.commentTextMaxLength})
    }
  },
  methods: {
    hideClass(){
      if(this.viewType !== 'table_viewType'){
        this.activeIcon = 'chart'
      }else{
        this.activeIcon = 'table'
      }

    },
    getActive(icon){
      //console.log(icon)
      this.activeIcon = icon

    },
    errorAlert() {
      this.$swal({
        title: this.$i18n.t('error'),
        confirmButtonText: this.$i18n.t('ok'),
        type: "error"
      });
    },
    addComment() {
      this.showLoader = true;
      service.addComments(this.cID, this.commentText).then(response => {
           console.log(response)
          if (response.data.status === "OK") {
            this.commentText = "";
            this.getComments(this.cID, true);
            // this.successAlert()
          } else {
            this.showLoader = false;
            this.errorAlert();
          }
        })
        .catch(() => {
          this.showLoader = false;
          this.errorAlert();
        });
    },
    cancelComment() {
      this.commentText = "";
    },
    getComments(cid, stopLoader = false) {
      service.getComments(cid).then(response => {
          this.cID = cid;
          this.commentList = response.data.interpretations.length
            ? response.data.interpretations
                .map(d => ({
                  ...d,
                  created: moment(d.created).format("lll")
                }))
                .sort((a, b) => {
                  let valueA = new Date(a.created).getTime(),
                    valueB = new Date(b.created).getTime();

                  let comparison = 0;
                  if (valueA > valueB) {
                    comparison = -1;
                  } else if (valueA < valueB) {
                    comparison = 1;
                  }
                  return comparison;
                })
            : [];

          if (stopLoader) {
            this.showLoader = false;
          }
        })
        .catch(() => {
          this.commentList = [];
        });
    },
    formatTableData() {
      if (this.chartdata.tableData != undefined) {
        this.fields.push("Period");
        this.chartdata.tableData.forEach((data, i) => {
          Object.keys(data).forEach(key => {
            if (key == "Method" && this.fields.indexOf(key) == -1) {
              this.fields.push(data[key]);
            }
            if (key != "Method") {
              console.log(this.fields[i + 1], i + 1);
              this.items.push({ Period: key, [this.fields[i + 1]]: data[key] });
            }
          });
        });
        console.log(this.fields, this.items);
      }
    },
    changeViewType(type) {
      this.$refs[`chart_viewType`].classList.remove("active");
      this.$refs[`table_viewType`].classList.remove("active");
      this.$refs[`${type}`].classList.add("active");
      this.viewType = type;
    },
    fullScreen() {
      this.cData = JSON.parse(JSON.stringify(this.chartOptions))
      // console.log("this.cData", this.cData)
      this.cData.xAxis.max = null
      let _this = this
      this.cData.chart.events = {
        drillup: function(e) {
          this.yAxis[0].options.min = 0
          // this.yAxis[0].options.max = _this.yMax
          this.xAxis[0].options.max = null
          this.options.chart.zoomType = 'x'
        },
        drilldown: function(e) {
          // console.log(this.yAxis[0])
          this.yAxis[0].options.min = null
          this.yAxis[0].options.max = null
          this.xAxis[0].options.max = null
          // console.log(this.yAxis[0])
          this.options.chart.zoomType = ''
          e.target.options.plotOptions = {
            ...e.target.options.plotOptions,
            series: {
              ...e.target.options.plotOptions.series,
              cursor: ''
            }
          }
        }
      }
      let isDrilldown = this.cData.drilldown && this.cData.drilldown.series.length > 0 ? true : false

      if(this.cData.plotOptions) {
        this.cData.plotOptions = {
          series: {
            ...this.cData.plotOptions.series,
            events: {
              legendItemClick: function() {}
            },
            showInLegend: true,
            cursor: isDrilldown ? 'pointer' : ''
          }
        }
      }
      setTimeout(() => {
        this.modalShow = true;
      }, 100);
    },
    reInitilaizeData(p_chartData) {
      if (p_chartData.tableData) {
        this.exportData = p_chartData.tableData
      }
      //console.log(p_chartData.tableData)
      //console.log(p_chartData, this.emuType)
      if (p_chartData.cid != undefined) {
        this.cID = p_chartData.cid;
        //this.getComments(p_chartData.cid);
      }
      let chartNewData =
        p_chartData.type === "bar"
          ? {
              chart: {
                type: p_chartData.type ? p_chartData.type : "bar",
                zoomType: "x",
                events: {}
              },
              title: {
                text: ""
              },
              xAxis: {
                categories: p_chartData.categories,
                max: p_chartData.max,
                min: 0,
                scrollbar: {
      enabled: true,
      width: 100,
      barBorderRadius: 7,
      barBorderWidth: 0,
      buttonBorderWidth: 0,
      buttonArrowColor: '#2f2e46',
      buttonBorderRadius: 7,
      rifleColor: '#98989896',
      trackBackgroundColor: '#2f2e46',
      trackBorderWidth: 0,
      trackBorderColor: 'silver',
      trackBorderRadius: 7,
      minWidth: 1,
      barBackgroundColor: '#12122a',
      buttonBackgroundColor: '#12122a'
    }
              },
              yAxis: {
                // min: 0,
                title: {
                  text: p_chartData.yTitle
                },
                plotLines: []
              },
              legend: {
                reversed: true,
                // maxHeight: 60,
                // backgroundColor: '#FCFFC5',
                // backgroundColor: '#71b5cd33',
                backgroundColor: "transparent",
                // borderColor: '#C98657',
                // borderColor: '#00000080',
                borderColor: "#a7a7a7",
                borderWidth: 1,
                borderRadius: 5
                // itemDistance: 50
              },
              plotOptions: {
                series: {
                  stacking: "normal"
                }
              },
              exporting: {
                enabled: false
              },
              credits: {
                enabled: false
              },
              series: p_chartData.data
            }
          : p_chartData.type === "pie"
          ? {
              chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: "pie"
              },
              title: {
                text: p_chartData.xTitle
              },
              tooltip: {
                pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>" ,
                shared: true,

                 useHTML: true,
              },
              legend: {
                // maxHeight: 60,
                // backgroundColor: '#FCFFC5',
                // backgroundColor: '#71b5cd33',
                backgroundColor: "transparent",
                // borderColor: '#C98657',
                // borderColor: '#00000080',
                borderColor: "#a7a7a7",
                borderWidth: 1,
                borderRadius: 5
                // itemDistance: 50
              },
              plotOptions: {
                pie: {
                  allowPointSelect: true,
                  cursor: "pointer",
                  dataLabels: {
                    enabled: p_chartData.dataLable
                      ? p_chartData.dataLable
                      : false,
                    format: "<b>{point.name}</b>: {point.percentage:.1f} %",
                    style: {
                      width: "100px"
                    }
                  },
                  showInLegend: false
                }
              },
              exporting: {
                enabled: false,
                sourceWidth: 800
              },
              credits: {
                enabled: false
              },
              series: p_chartData.data,
              labels: p_chartData.labels
            }
          : {
              chart: {
                type:
                  p_chartData.type === "stacked" ? "column" : p_chartData.type,
                zoomType: "x",
                events: {}
              },
              title: {
                text: ""
              },
              xAxis: {
                categories: p_chartData.categories,
                crosshair: true,
                title: {
                  text: p_chartData.xTitle
                },
                max: p_chartData.max,
                scrollbar: {
      enabled: true,
      width: 100,
      barBorderRadius: 7,
      barBorderWidth: 0,
      buttonBorderWidth: 0,
      buttonArrowColor: '#2f2e46',
      buttonBorderRadius: 7,
      rifleColor: '#98989896',
      trackBackgroundColor: '#2f2e46',
      trackBorderWidth: 0,
      trackBorderColor: 'silver',
      trackBorderRadius: 7,
      minWidth: 1,
      barBackgroundColor: '#12122a',
      buttonBackgroundColor: '#12122a'
    }
              },
              yAxis: {
                min: 0,
                title: {
                  text: p_chartData.yTitle
                },
                plotLines: []
              },
              legend: {
                // maxHeight: 60,
                // backgroundColor: '#FCFFC5',
                // backgroundColor: '#71b5cd33',
                backgroundColor: "transparent",
                // borderColor: '#C98657',
                // borderColor: '#00000080',
                borderColor: "#a7a7a7",
                borderWidth: 1,
                borderRadius: 5
                // itemDistance: 50
              },
              plotOptions:
                p_chartData.type === "stacked"
                  ? {
                      series: {
                        stacking: "normal",
                        dataLabels: {
                          enabled: false
                        }
                      }
                    }
                  : {
                      series: {
                        connectNulls: true
                      }
                    },
              exporting: {
                enabled: false
              },
              credits: {
                enabled: false
              },
              series: p_chartData.data
            };
      //console.log(this.chartdata.title)
      if (this.chartComp == "repotingRate") {
        chartNewData.yAxis.plotLines = [
          {
            color: "#b3b3b3",
            width: 2,
            value: 80,
            zIndex: 5,
            label: {
              text: "80%",
              align: "right",
              style: {
                color: "black",
                fontWeight: "bold"
              }
            }
          }
        ];
      }
      // if (this.chartdata.title == "Comparing EMU to mCPR (public sector)") {
      //   chartNewData.chart.events = {
      //     ...chartNewData.chart.events,
      //     load: function() {
      //       if (this.series.length && this.series[0].data.length) {
      //         let catLen = this.series[0].data.length - 1;
      //         this.xAxis[0].setExtremes(catLen - 11, catLen);
      //       }
      //     }
      //   };
      // }
      let min1 = 0,
        max1 = 0;
      //console.log(chartNewData.series)
      if (chartNewData.series && chartNewData.series.length > 0) {
        chartNewData.series.forEach(d => {
          // let innerDataArr = d.data.map(dInner => dInner.y)
          let innerMin = Math.min(...d.data);
          let innerMax = Math.max(...d.data);
          if (innerMin < min1) {
            min1 = innerMin;
          }
          if (innerMax > max1) {
            max1 = innerMax;
          }
        });
      }

      if (
        chartNewData.chart.type != "pie" &&
        chartNewData.plotOptions &&
        chartNewData.plotOptions.series &&
        chartNewData.plotOptions.series.stacking !== "normal"
      ) {
        chartNewData.yAxis.min = min1 > 0 ? 0 : min1;
        chartNewData.yAxis.max = max1;
      }
      return chartNewData;
    },
    sortData(p_val, sort = null) {
      if (sort) {
        this.sortType = sort;
      }
      let aTemp = this.chartdata.categories;
      if (aTemp.length > 1) {
        //console.log(aTemp[0], aTemp[1], p_val)
        if (
          (aTemp[0] < aTemp[1] && p_val === "asc") ||
          (aTemp[0] > aTemp[1] && p_val === "desc")
        ) {
          //console.log(p_val, sort)
          let i,
            aData = this.chartdata.data,
            nLen = aData.length;
          for (i = 0; i < nLen; i++) {
            aData[i].data.reverse();
          }
          //console.log(aData)
        }else{
          return
        }
        aTemp.reverse()
      }
    },
    exportChart(type) {
      var chart = this.$refs.inputCharts.chart;
      let max = chart.options.xAxis[0].max ? chart.options.xAxis[0].max :  chart.options.series[0].data.length;
      let catLen = chart.options.series[0].data.length - 1;

      //chart.xAxis[0].setExtremes(0, catLen);
      setTimeout(() => {
        chart.options.xAxis[0].max = max;
        if(max >= 11){
          chart.xAxis[0].setExtremes(catLen - 11, catLen);
        }
      }, 100);
      if (type == "jpg") {
        chart.exportChart({
          type: "image/jpeg",
          filename: "overview-chart"
        });
      } else if (type == "png") {
        chart.exportChart({
          type: "image/png",
          filename: "overview-chart"
        });
      } else if (type == "pdf") {
        chart.exportChart({
          type: "application/pdf",
          filename: "overview-chart"
        });
      }
    }
  },
  watch: {
    chartdata(newVal) {
      this.chartOptions = this.reInitilaizeData(newVal);
      this.chartPlotType = "column"
    },
    chartPlotType(newValue) {
      this.chartOptions.chart.type = newValue.toLowerCase();
    },
    // activeIcon(newVal){
    //   document.body.addEventListener("click", function (evt) {
    //     if(newVal == 'comment'){
    //       this.activeIcon = 'chart'
    //     }
    //     console.log(this.activeIcon)
    //   });
    // }
  }
};
</script>
<style scoped lang="scss">
.card-comp-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dd-holder {
  position: absolute;
  z-index: 10;
  right: 1.25rem;
  width: 100%;
}
.typeDropdown {
  font-size: 0.75rem;
  padding: 2px 25px 2px 5px;
  height: auto;
  margin-top: 4px;
}
.b-table-sticky-header {
  overflow-y: auto;
  max-height: 400px;
}
.fa-custom-sort-date-asc,
.fa-custom-sort-date-desc {
  position: relative;
  width: 35px;
}

.fa-custom-sort-date-asc::before,
.fa-custom-sort-date-desc::before {
  content: "\f175";
  position: relative;
  right: 14px;
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
</style>
