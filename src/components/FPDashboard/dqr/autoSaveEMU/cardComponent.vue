<template>
  <div class="position-relative">
    <loader v-if="showLoader" />
    <div class="card" v-if="chartdata">
      <div class="card-header px-2 py-1 text-decoration-none" :class="{ 'bg-transparent color-black border': noOptions }">
        <div class="row no-gutters" :class="{ 'text-center': noOptions }">
          <div class="col-lg-12 col-md-12 p-t-4px" :class="{ 'col-lg-12 col-md-12': noOptions }" >
            <div class="cardTitleSection text-wrap  fs-19-1920">
              <i class="fa fa-info-circle color-white cursor-pointer chart-info mr-2 ml-2" aria-hidden="true" v-b-popover.hover.rightbottom="{
                variant: 'info', content: chartdata.chartInfo, title: showSource
                ? cardTitle ? `${cardTitle}: ${chartdata.source}` : `${chartdata.title}: ${chartdata.source}` : cardTitle
                ? cardTitle : chartdata.title, html: true}"></i>
              <p class="title_p fs-19-1920 m-0"> {{ cardTitle ? cardTitle : chartdata.title}}{{ showSource ? `: ${chartdata.source}` : "" }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="row px-3 pt-2">
        <div class="col-lg-12 col-md-12" v-if="!noOptions">
          <div class="row">
            <div class="col-12 text-right">
              <div class="dropdown float-right ml-2" v-if="!drilldown">
                <b-dropdown right toggle-class="text-decoration-none bg-transparent border-0 dropdown-toggle p-0"
                  no-caret menu-class="chart-dd-menu" @hide="hideClass" @show="getActive('download')">
                  <template v-slot:button-content>
                    <img v-if="activeIcon == 'download'" :src="require('@/assets/img/icons/download_new_active.png')" class="img" v-b-tooltip.hover :title="$t('downloadIcon')"/>
                    <img v-else :src="require('@/assets/img/icons/download_new.png')" class="img imgWidth_15px" v-b-tooltip.hover :title="$t('downloadIcon')"/>
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
              <div class="float-right ml-2" v-if="!drilldown">
                  <a ref="table_viewType" @click="changeViewType('table_viewType'); getActive('table')" :title="$t('tableViewIcon')" v-b-tooltip>
                  <img v-if="viewType == 'table_viewType'" :src="require('@/assets/img/icons/table_new_active.png')" class="img cursor-pointer imgWidth_20px"/>
                  <img v-else :src="require('@/assets/img/icons/table_new.png')" class="img cursor-pointer imgWidth_20px viewType"/>
                </a>
              </div>
              <div class="float-right ml-2"  v-if="!drilldown">
                  <a ref="chart_viewType" @click="changeViewType('chart_viewType'); getActive('chart')" :title="$t('chartViewIcon')" v-b-tooltip>
                    <img v-if="viewType == 'chart_viewType'" :src="require('@/assets/img/icons/chart_new_active.png')" class="img cursor-pointer imgWidth_20px"/>
                    <img v-else :src="require('@/assets/img/icons/chart_new.png')" class="img cursor-pointer imgWidth_20px chartType viewType"/>
                  </a>
              </div>
              <div class="float-right ml-2 hide" v-if="viewType !== 'table_viewType' && !drilldown && !inMD">
                <b-dropdown right toggle-class="text-decoration-none bg-transparent border-0 dropdown-toggle p-0" no-caret menu-class="chart-dd-menu"
                @hide="hideClass" @show="getActive('sort')">
                  <template v-slot:button-content>
                    <!-- <img :src="require('@/assets/img/icons/sort.png')" class="img imgWidth_20px" /> -->
                    <img v-if="activeIcon == 'sort'" :src="require('@/assets/img/icons/sort_new_active.png')" class="img imgWidth_20px" v-b-tooltip.hover :title="$t('sorting')" />
                    <img v-else :src="require('@/assets/img/icons/sort_new.png')" class="img imgWidth_20px" v-b-tooltip.hover :title="$t('sorting')" />
                  </template>
                  <b-dropdown-group class="chart-dd-options">
                    <b-dropdown-item v-for="option in dataOptions" :key="option.value" :value="option.value" @click="sortData(option.value)" class="list-group-item bg-transparent px-0">
                      <div class="row no-gutters color-white">
                        <div class="col-lg-10">
                          <p class="m-0px">{{ $t("sortBy") }}</p>
                        </div>
                        <div class="col-lg-2">
                          <p class="m-0px">
                            <i :class="[ `fa fa-custom-sort-date-${option.value}` ]" ></i>
                            <i :class="[`fa fa-sort-numeric-${option.value}`]"></i>
                          </p>
                        </div>
                      </div>
                    </b-dropdown-item>
                  </b-dropdown-group>
                </b-dropdown>
              </div>
              <!-- Used in Ministerial Dashboard -->
              <div class="dropdown float-right ml-2" v-if="viewType !== 'table_viewType' && sorting && !drilldown && !inMD">
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
              <div class="dropdown float-right ml-2" v-if="viewType !== 'table_viewType' && sorting && !drilldown && inMD">
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
                          v-if="sorting.includes('JAN-DEC') && sortType != 'JAN-DEC'"
                          @click.prevent="dataSort('JAN-DEC')"
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
                          v-if="sorting.includes('DEC-JAN') && sortType != 'DEC-JAN'"
                          @click.prevent="dataSort('DEC-JAN')"
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
                          @click.prevent="dataSort('Z-A')"
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
                          @click.prevent="dataSort('A-Z')"
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
                        <li
                          class="list-group-item bg-transparent color-white"
                          v-if="sorting.includes('1-0') && sortType != '1-0'"
                          @click.prevent="dataSort('1-0')"
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
                                  <i class="fa fa-sort-numeric-desc fa-fw"></i>
                                </p>
                              </div>
                            </div>
                          </a>
                        </li>
                        <li
                          class="list-group-item bg-transparent color-white"
                          v-if="sorting.includes('0-1') && sortType != '0-1'"
                          @click.prevent="dataSort('0-1')"
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
                                  <i class="fa fa-sort-numeric-asc fa-fw"></i>
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
              <!-- <span class="fa fa-eye cursor-pointer ml-2 float-right mt-2" v-if="viewType !== 'table_viewType' && !drilldown" v-b-tooltip.hover :title="$t('preview')" @click.stop.prevent="fullScreen"></span> -->
              <a v-if="viewType !== 'table_viewType' && !drilldown" @click.stop.prevent="fullScreen" @click="getActive('preview')">
                <img v-if="activeIcon == 'preview'" :src="require('@/assets/img/icons/preview_new_active.png')" class="img cursor-pointer imgWidth_20px ml-3 float-right mt-1"  v-b-tooltip.hover :title="$t('preview')"/>
                <img v-else :src="require('@/assets/img/icons/preview_new.png')" class="img cursor-pointer imgWidth_20px float-right mt-1 ml-3"  v-b-tooltip.hover :title="$t('preview')"/>
              </a>
              <div class="float-right ml-2 dave2d" v-if="period && !drilldown && viewType == 'chart_viewType'">
                <b-form-select class="typeDropdown" v-model="chartPlotType" :options="chartTypeOptions"></b-form-select>
              </div>
              <!-- <div class="float-right ml-2 dave2d" v-if="!drilldown && viewType == 'chart_viewType' && aggregate && chartdata.agreData">
                <b-form-select class="typeDropdown" v-model="calsType" :options="calTypeOptions"></b-form-select>
              </div> -->
            </div>

          </div>
        </div>
      </div>
      <div class="card-body pb-0 h-410px">
        <template v-if="chartOptions && viewType == 'chart_viewType'">
          <highcharts v-if="chartOptions.series && chartOptions.series.length" :options="chartOptions" ref="inputCharts" :redraw="true"></highcharts>
          <div class="text-center no-data" v-else>{{ $t("no_data_to_display") }}</div>
        </template>

        <div class="row" v-else>
          <div class="col-12">
            <b-table hover :items="items" :fields="fields" head-variant="light" sticky-header :bordered="true" style="max-height: 400px !important" :sort-compare="sortDate"></b-table>
          </div>
        </div>
      </div>
      <div class="card-footer text-right" v-if="!bShowIcons">
        <!-- <p class="m-0">Source: <span>{{chartdata.source}}</span></p> -->
        <p class="m-0">{{ $t("source") }}: <span>DHIS2</span></p>
      </div>
    </div>
    <b-modal @hide="getActive('chart')" v-model="modalShow" hide-footer centered size="xl" :title="showSource ? cardTitle ? `${cardTitle}: ${chartdata.source}` : `${chartdata.title}: ${chartdata.source}` : cardTitle ? cardTitle : chartdata.title" modal-class="preview-modal-up" no-close-on-backdrop>
      <highcharts class="chartHeight h-100 align-items-center justify-content-center d-flex" :options="cData" :redraw="true"></highcharts>
    </b-modal>
  </div>
</template>

<script>
import service from "@/service";
import Highcharts from "highcharts";
import exportingInit from "highcharts/modules/exporting";
exportingInit(Highcharts);
export default {
  props: [
    "caltype",
    "signOffActive",
    "chartdata",
    "ddOptions",
    "handleFilterChange",
    "bShowIcons",
    "period",
    "filter",
    "methodSelected",
    "cardTitle",
    "yAxis",
    "noOptions",
    "canComment",
    "loggedInUserId",
    "showSource",
    "inMD",
    "defaultSort",
    "sorting",
    "layoutChanged",
    "aggregate",
    "chartName",
    "setExtreme"
  ],

  components: {
  },

  data() {
    //console.log(this.caltype, this.sorting)
    return {
      activeIcon: 'chart',
      methodFilter: this.filter,
      //selected: this.methodSelected,
      selected: this.methodSelected,
      options: this.chartdata.filter,
      ddValue: this.ddOptions ? 0 : null,
      dataOptions: [
        {
          value: "asc"
        },
        {
          value: "desc"
        }
      ],
      chartOptions: {},
      chartPlotType: "column",
      chartTypeOptions: [
        {
          value: "column",
          text: this.$i18n.t("column")
        },
        {
          value: "area",
          text: this.$i18n.t("area")
        }
      ],
      calsType: this.caltype,
      calTypeOptions: [
        {
          value: "aggregate",
          text: this.$i18n.t("method_aggregate")
        },
        {
          value: "method",
          text: this.$i18n.t("method_detial")
        }
      ],
      viewType: "chart_viewType",
      fields: [],
      items: [],
      exportData: [],
      modalShow: false,
      newFields: [],
      commentText: "",
      commentTextMaxLength: 100,
      commentList: [],
      cID: "",
      showLoader: false,
      yMax: "",
      drilldown: false,
      download: false,
      sortType: this.defaultSort,
      cData: "",
    };
  },
  computed: {
    commentPlaceholder: function() {
      return this.$i18n.t('placeholderMaxValue', {number: this.commentTextMaxLength})
    }
  },

  watch: {
    modalShow(newVal) {
      if(!newVal) {
        this.drilldown = false
      }
    },
    caltype(newVal){
      this.calsType = newVal
    },
    chartdata(newVal) {
      this.chartOptions = this.reInitilaizeData(newVal);
    },
    chartPlotType(newValue) {
      this.chartOptions.chart.type = newValue.toLowerCase();
    },
    calsType(newValue) {
      this.chartOptions.series = []
      this.chartdata.tableData = []
      this.items = []
      this.fields = []
      if(newValue == 'method' && this.chartName){
        //console.log('in method')
        if(this.chartName == 'monthSpecific'){
          // this.chartdata.max = this.chartdata.methodCategories.length - 1
          // this.chartdata.categories = this.chartdata.methodCategories
        }
        this.chartOptions = this.reInitilaizeData(this.chartdata);
        // this.chartdata.data = this.chartdata.methodData
        // this.chartdata.tableData = this.chartdata.methodTableData
      }else if(newValue == 'aggregate' && this.chartName){
        // console.log('in agee')
        if(this.chartName == 'monthSpecific'){
          // this.chartdata.max = this.chartdata.agreCategories.length - 1
          // this.chartdata.categories = this.chartdata.agreCategories
        }
        // this.chartdata.data = this.chartdata.agreData
        // this.chartdata.tableData = this.chartdata.agreTableData
        this.chartOptions = this.reInitilaizeData(this.chartdata,"agreData","agreTableData","agreCategories");   
      }
      //console.log(this.chartdata)
      //this.chartOptions = this.reInitilaizeData(this.chartdata);
      if(this.chartName == 'monthSpecific'){
        var chart = this.$refs.inputCharts.chart;
        let max = chart.options.xAxis[0].max;
        let catLen = chart.options.series[0].data.length - 1;
        chart.options.xAxis[0].max = null
        chart.options.xAxis[0].min = 0
        if (catLen > 11 && this.setExtreme) {
          chart.xAxis[0].setExtremes(0, catLen);
        }
       // console.log(this.$refs.inputCharts)
       // this.$refs.inputCharts.chart.redraw();
      // console.log(this.chartOptions)
        //  var chart = this.$refs.inputCharts.chart;
        //   let max = chart.options.xAxis[0].max;
        //   let catLen = chart.options.series[0].data.length - 1;
        //   if (catLen > 11) {
        //     chart.xAxis[0].setExtremes(0, catLen);
        //   }
      }
    },
    methodSelected(newV) {
      this.selected = newV;
    },
    selected() {
      this.items = [];
      this.chartOptions = this.reInitilaizeData(this.chartdata);
    },
    layoutChanged() {
      let ser = this.chartOptions.series;
      this.showLoader = true;
      this.chartOptions.series = [];
      setTimeout(() => {
        this.chartOptions.series = ser;
        this.showLoader = false;
      }, 100);
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
      this.activeIcon = icon
    },
    errorAlert() {
      this.$swal({
        title: this.$i18n.t('error')
      });
    },
    addComment() {
      this.showLoader = true;
      service
        .addComments(this.cID, this.commentText)
        .then(response => {
          // console.log(response)
          if (response.data.status === "OK") {
            this.commentText = "";
            this.getComments(this.cID, true);
            // this.successAlert()
            this.showLoader = false;
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
      service
        .getComments(cid)
        .then(response => {
          // console.log(response)
          this.cID = cid;
          this.commentList = response.data.interpretations.length
            ? response.data.interpretations
                .map(d => ({
                  ...d,
                  created: this.$moment(d.created).format("lll")
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
    sortDate(a, b, key) {
      if (key !== "Period") {
        // `key` is not the field that is a date.
        // Let b-table handle the sorting for other columns
        // returning null or false will tell b-table to fall back to it's
        // internal sort compare routine for fields keys other than `myDateField`
        return null; // or false
      }
      let aDate = this.$moment(a[key], "MMM YYYY");
      let bDate = this.$moment(b[key], "MMM YYYY");
      if (aDate.isValid && bDate.isValid) {
        if (aDate < bDate) {
          return -1;
        } else if (aDate > bDate) {
          return 1;
        } else {
          return 0;
        }
      }
      return null;
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
    changeViewType(type) {
      this.$refs[`chart_viewType`].classList.remove("active");
      this.$refs[`table_viewType`].classList.remove("active");
      this.$refs[`${type}`].classList.add("active");
      this.viewType = type;
    },
    reInitilaizeData(p_chartData,dataKey="data",dataTableKey="tableData",categories="categories") {
      if (p_chartData.cid) {
        this.cID = p_chartData.cid;
        //this.getComments(p_chartData.cid);
      }
      let aData = p_chartData[dataKey],
        drilldown = p_chartData.drilldown
          ? {
              ...p_chartData.drilldown,
              drillUpButton: {
                position: {
                  align: "left",
                  x: 0,
                  y: 0
                }
              }
            }
          : { series: [] },
        tableData =  p_chartData[dataTableKey];
      if (this.filter) {
        aData = aData.filter(ele => {
          if (ele["name"]) {
            return ele["name"].indexOf(this.selected) > -1;
          }
        });
        tableData = tableData.filter(ele => {
          if (ele["trans_name"]) {
            return ele["trans_name"].indexOf(this.selected) > -1;
          } else {
            return ele["name"].indexOf(this.selected) > -1;
          }
        });

        if (tableData[0]) {
          this.newFields=[];
          this.exportData = tableData[0]["data"];
          //console.log(this.exportData)
          tableData[0]["data"].forEach(key => {
            Object.keys(key).forEach(field => {
              if (this.newFields.indexOf(field) == -1) {
                this.newFields.push(field);
                if (field == this.$i18n.t('period') || field == this.$i18n.t('value')) {
                  this.fields.push({ key: field, sortable: true });
                } else {
                  this.fields.push(field);
                }
              }
            });
            this.items.push(key);
          });
        }

        // if(p_chartData.title == 'New vs Continuing Users'){
        //     aData.forEach((ele,ind) => {
        //         if(ele.type === 'line'){
        //             ele['yAxis'] = 1;
        //         }
        //     })
        //     console.log(JSON.stringifyaData)
        // }
      } else {
        if (tableData != undefined) {
           this.newFields=[]
          if (tableData[0] != undefined) {
            this.exportData = tableData[0]["data"];
            tableData[0]["data"].forEach(key => {
              Object.keys(key).forEach(field => {
                if (this.newFields.indexOf(field) == -1) {
                  this.newFields.push(field);
                  if (
                    field == this.$i18n.t('period') ||
                    field == this.$i18n.t('location')  ||
                    field == this.$i18n.t('value')
                  ) {
                    this.fields.push({ key: field, sortable: true });
                  } else {
                    this.fields.push(field);
                  }
                }
              });
              this.items.push(key);
            });
          }
        }
      }
      let maxLen = null;
      if (
        aData.length > 0 &&
        aData[0] != undefined &&
        aData[0].data.length > 11
      ) {
        maxLen = p_chartData.max ? p_chartData.max : 11;
      } else if (aData.length > 0 && aData[0] != undefined) {
        maxLen = aData[0].data.length - 1;
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
                // categories: p_chartData.categories,
                max: maxLen,
                labels: {
                  rotation: -45
                },
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
                }
              },
              legend: {
                reversed: true,
                // maxHeight: 100,
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
                enabled: false,
                sourceWidth: 1200,
                sourceHeight: 500,
                chartOptions: {
                  plotOptions: {
                    series: {
                      dataLabels: {
                        enabled: true
                      }
                    }
                  }
                }
              },
              credits: {
                enabled: false
              },
              series: aData
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
                // maxHeight: 100,
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
                    enabled: false,
                    format: "<b>{point.name}</b>: {point.percentage:.1f} %"
                  },
                  showInLegend: true
                }
              },
              exporting: {
                enabled: false,
                sourceWidth: 1200,
                sourceHeight: 500,
                chartOptions: {
                  plotOptions: {
                    series: {
                      dataLabels: {
                        enabled: true
                      }
                    }
                  }
                }
              },
              credits: {
                enabled: false
              },
              series: aData
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
                // categories: p_chartData.categories,
                crosshair: true,
                title: {
                  text: p_chartData.xTitle
                },
                labels: {
                  rotation: -45
                },
                max: maxLen,
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
                }
                // stackLabels: {
                //     style: {
                //         color: 'black'
                //     },
                //     enabled: true,
                //     y: -10,
                //     format: '{total}%'
                // },
              },

              legend: {
                // maxHeight: 100,
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
                      column: {
                        stacking: "normal",
                        dataLabels: {
                          enabled: false
                        }
                      }
                    }
                  : {
                      series: {
                        stacking: "",
                        pointWidth: 20
                      }
                    },
              exporting: {
                enabled: false,
                sourceWidth: 1200,
                sourceHeight: 500,
                chartOptions: {
                  plotOptions: {
                    series: {
                      dataLabels: {
                        enabled: true
                      }
                    }
                  }
                }
              },
              credits: {
                enabled: false
              },
              series: aData
            };

      if (drilldown.series.length) {
        chartNewData.drilldown = drilldown;
        chartNewData.xAxis.type = "category";

        chartNewData.plotOptions = {
          series: {
            ...chartNewData.plotOptions.series,
            cursor: "pointer"
          }
        };
      }

      if(!this.inMD) {
        //console.log(p_chartData.categories)
        chartNewData.xAxis.categories = p_chartData[categories];
      } else {
        chartNewData.xAxis.type = "category"
      }

      //console.log(chartNewData)
      let _this = this;
      //if(this.chartdata.title != 'Month EMU by Method'){
      if (this.inMD) {
        chartNewData.chart.events = {
          ...chartNewData.chart.events,
          load: function() {
            // console.log(this.yAxis)
            if ( this.series.length && this.series[0].data.length && _this.setExtreme ) {
              let catLen = this.series[0].data.length - 1;
              if (catLen > 11) {
                this.xAxis[0].setExtremes(catLen - 11, catLen);
              }
            }
          },
          selection: function(e) {
            if (!e.xAxis) {
              if (_this.setExtreme) {
                let catLen = this.options.series[0].data.length - 1;
                if (catLen > 11) {
                  setTimeout(() => {
                    this.xAxis[0].setExtremes(catLen - 11, catLen);
                  }, 0);
                }
              }
              _this.download = false;
            } else {
              _this.download = true;
            }
          },
          drillup: function(e) {
            _this.drilldown = false;
            // this.yAxis[0].options.min = 0;
            // this.yAxis[0].options.max = this.yMax;
            this.xAxis[0].options.max = p_chartData.max;
            this.options.chart.zoomType = "x";
            this.yAxis[0].update({
              min: 0,
              max: this.ymax
            })
            this.yAxis[0].setTitle({
              text: _this.$i18n.t("EMU") + " (%)"
            });
            delete e.target.options.plotOptions.point;
          },
          drilldown: function(e) {
            _this.drilldown = true;
            this.xAxis[0].options.max = e.seriesOptions.data.length - 1 > 11 ? 11 : e.seriesOptions.data.length - 1;
            this.yAxis[0].update({
              min: null,
              max: null,
            })
            this.yAxis[0].setTitle({
              text:
                _this.$i18n.t("changeIn") +
                " " +
                _this.$i18n.t("EMU") +
                " (%)"
            });

            this.options.chart.zoomType = "";
            e.target.options.plotOptions = {
              ...e.target.options.plotOptions,
              series: {
                ...e.target.options.plotOptions.series,
                point: {
                  events: {
                    click: function() {
                      // console.log(this)
                      if (this.series) {
                        _this.changeLocation(this.locationID);
                      }
                    }
                  }
                }
              }
            };
            // console.log(this.yAxis)
          }
        };
        let min1 = 0,
          max1 = 0;
        chartNewData.series.forEach(d => {
          let innerDataArr = this.inMD
            ? d.data.map(dInner => dInner.y)
            : d.data;
          let innerMin = Math.min(...innerDataArr);
          let innerMax = Math.max(...innerDataArr);
          if (innerMin < min1) {
            min1 = innerMin;
          }
          if (innerMax > max1) {
            max1 = innerMax;
          }
        });
        if ( chartNewData.plotOptions && chartNewData.plotOptions.series && chartNewData.plotOptions.series.stacking !== "normal" ) {
          chartNewData.yAxis.min = min1 > 0 ? 0 : min1;
          chartNewData.yAxis.max = max1;
          this.yMax = max1;
        }
      } else {
        let min1 = 0,
          max1 = 0;
        chartNewData.series.forEach(d => {
          let innerDataArr = this.inMD
            ? d.data.map(dInner => dInner.y)
            : d.data;
          let innerMin = Math.min(...innerDataArr);
          let innerMax = Math.max(...innerDataArr);
          if (innerMin < min1) {
            min1 = innerMin;
          }
          if (innerMax > max1) {
            max1 = innerMax;
          }
        });
        //console.log(chartNewData)
        if (
          chartNewData.plotOptions &&
          chartNewData.plotOptions.series &&
          chartNewData.plotOptions.series.stacking !== "normal"
        ) {
          chartNewData.yAxis.min = min1 > 0 ? 0 : min1;
          chartNewData.yAxis.max = max1;
          this.yMax = max1;
          //console.log(min1, max1)
        }

        chartNewData.chart.events = {
          ...chartNewData.chart.events,
          load: function() {
            // if(_this.chartName == 'monthSpecific'){
            //   console.log(this.series)
            // }

            if (
              this.series.length &&
              this.series[0].data.length &&
              this.series[0].data.length > 11
            ) {
              let catLen = this.series[0].data.length - 1;
              if (catLen > 11) {
                this.xAxis[0].setExtremes(catLen - 11, catLen);
              }
            }
          },
          selection: function(e) {
            if (!e.xAxis) {
              if (this.series[0].data.length > 11) {
                let catLen = this.options.series[0].data.length - 1;
                setTimeout(() => {
                  this.xAxis[0].setExtremes(catLen - 11, catLen);
                }, 0);
              }
              _this.download = false;
            } else {
              _this.download = true;
            }
          }
        };
      }
      // console.log("chartNewData",chartNewData)
      return chartNewData;
    },
    changeLocation(locationID) {
      this.drilldown = false;
      this.$emit("drilldownLocation", locationID);
    },
    updateChartData() {
      this.items = [];
      this.chartOptions = this.reInitilaizeData(this.chartdata);
    },
    sortData(p_val, sort = null) {
      //console.log(p_val, sort)
      if (sort) {
        this.sortType = sort;
      }
      let aTemp = this.chartdata.categories;
      if (aTemp.length > 1) {
        let aDate = null, bDate = null

        if(sort == "JAN-DEC" || sort == "DEC-JAN"){
          aDate = this.$moment(aTemp[0], "MMM YYYY").format("MMYYYY")
          bDate = this.$moment(aTemp[1], "MMM YYYY").format("MMYYYY")
        }else{
          aDate = aTemp[0]
          bDate = aTemp[1]
        }
        // let aDate = this.$moment(aTemp[0], "MMM YYYY").format("MMYYYY")
        // console.log(aDate)
        //console.log(aDate, bDate, p_val)
        if (
          (aDate < bDate && p_val === "asc") ||
          (aDate > bDate && p_val === "desc")
        ) {
          let i,
            aData = this.chartdata.data,
            nLen = aData.length;
          for (i = 0; i < nLen; i++) {
            aData[i].data.reverse();
          }
          aTemp.reverse()
        }
      }
    },
    dataSort(sort) {
      this.sortType = sort
      // console.log("chartOptions", this.chartOptions)
      this.chartOptions.series.map((d) => ({
        ...d,
        "data": d.data.sort((a, b) => {
          let valueA = 0,
            valueB = 0

          if (sort === "0-1" || sort === '1-0') {
            valueA = a.y;
            valueB = b.y;
          }

          if (sort === "JAN-DEC" || sort === 'DEC-JAN') {
            valueA = new Date(a.pe).getTime();
            valueB = new Date(b.pe).getTime();
          }

          if (sort === "A-Z" || sort === 'Z-A') {
            valueA = a.name
            valueB = b.name
          }

          let comparison = 0;
          if (sort == "0-1" || sort === 'A-Z' || sort === "JAN-DEC") {
            if (valueA > valueB) {
              comparison = 1;
            } else if (valueA < valueB) {
              comparison = -1;
            }
          } else if (sort == "1-0" || sort === 'Z-A' || sort === 'DEC-JAN') {
            if (valueA > valueB) {
              comparison = -1;
            } else if (valueA < valueB) {
              comparison = 1;
            }
          }
          return comparison;
        })
      }))
    },
    exportChart(type) {
      var chart = this.$refs.inputCharts.chart;
      let max = chart.options.xAxis[0].max;
      let catLen = chart.options.series[0].data.length - 1;
      chart.options.xAxis[0].max = null
      chart.options.xAxis[0].min = 0
      if (catLen > 11 && this.setExtreme) {
        chart.xAxis[0].setExtremes(0, catLen);
      }
      //console.log(chart.xAxis)
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

      setTimeout(() => {
        chart.options.xAxis[0].max = max;
        if (catLen > 11 && this.setExtreme) {
          chart.xAxis[0].setExtremes(catLen - 11, catLen);
        }
      }, 100);
    }
  },
  mounted() {
    if (this.yAxis) {
      this.chartdata.yTitle = this.yAxis;
    }
    this.chartOptions = this.reInitilaizeData(this.chartdata);
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
.no-data {
  height: 410px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
