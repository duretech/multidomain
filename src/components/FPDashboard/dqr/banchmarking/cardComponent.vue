<template>
  <div>
    <loader v-if="showLoader"/>
    <div class="card">
      <div class="card-header p-10px text-decoration-none">
        <div class="row no-gutters">
          <div class="col-lg-5 col-md-3 p-t-4px" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
            <i class="fa fa-info-circle color-white cursor-pointer chart-info p-t-5px mr-2" aria-hidden="true" v-b-popover.hover.rightbottom="{ variant: 'info',  content: chartdata.chartInfo, title: showSource ? cardTitle ? `${cardTitle}: ${chartdata.source}` : `${chartdata.title}: ${chartdata.source}` : cardTitle ? cardTitle : chartdata.title, html: true }"></i>
            {{cardTitle ? cardTitle : chartdata.title}}{{showSource ? `: ${chartdata.source}` : ''}}
          </div>
          <div class="col-lg-7 col-md-9" v-if="!bShowIcons">
            <div class="row">
              <div class="col-12 text-right">
                <div class="dropdown float-right ml-2">
                  <a class="dropdown-toggle f-s-1-25rem" href="#" role="button" id="dropdownChartExportOptionsLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-b-tooltip.hover :title="$t('downloadIcon')">
                    <img :src="require('../../../assets/img/icons/export.png')" class="img">
                  </a>
                  <div class="dropdown-menu dropdown-menu-right" id="dropdownChartExportOptions" aria-labelledby="dropdownChartExportOptionsLink">
                    <div class="card bg-transparent">
                      <div class="card-body p-0px">
                        <ul class="list-group" v-if="viewType=='table_viewType'">
                          <li class="list-group-item bg-transparent color-white">
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
                          </li>
                        </ul>
                        <ul class="list-group" v-if="viewType=='chart_viewType'">
                          <li class="list-group-item bg-transparent color-white">
                            <a class="color-white" @click="exportChart('png')">
                              <div class="row no-gutters">
                                <div class="col-lg-10 text-left">
                                  <p class="m-0px">PNG </p>
                                </div>
                                <div class="col-lg-2">
                                  <p class="m-0px">
                                    <i class="fa fa-file-powerpoint-o"></i>
                                  </p>
                                </div>
                              </div>
                            </a>
                          </li>
                          <li class="list-group-item bg-transparent color-white">
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
                          </li>
                          <li class="list-group-item bg-transparent color-white">
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
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="float-right ml-2">
                  <i class="fa fa-table chartType viewType" ref='table_viewType' @click="changeViewType('table_viewType')" :title="$t('tableViewIcon')" v-b-tooltip>
                  </i>
                </div>
                <div class="float-right ml-2">
                  <i class="fa fa-bar-chart chartType viewType active" ref="chart_viewType" @click="changeViewType('chart_viewType')" :title="$t('chartViewIcon')" v-b-tooltip>
                  </i>
                </div>
                <div class="float-right ml-2" v-if="viewType !== 'table_viewType'">
                  <b-dropdown right toggle-class="text-decoration-none bg-transparent border-0 dropdown-toggle p-1" no-caret menu-class="chart-dd-menu">
                    <template v-slot:button-content>
                      <img :src="require('../../../assets/img/icons/sort.png')" class="img"  v-b-tooltip.hover :title="$t('sorting')"/>
                    </template>
                    <b-dropdown-group class="chart-dd-options">
                      <b-dropdown-item v-for="option in dataOptions" :key="option.value" :value="option.value" @click="sortData(option.value)" class="list-group-item bg-transparent px-0">
                        <div class="row no-gutters color-white">
                          <div class="col-lg-10">
                            <p class="m-0px">{{$t('sortBy')}}</p>
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

                <div v-if="chartdata.cid" class="dropdown float-right  ml-2">
                  <a class="dropdown-toggle f-s-1-25rem" href="#" role="button" id="dropdownCommentsLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" :title="$t('commentsIcon')" v-b-tooltip>
                    <i class="fa fa-comments color-white" aria-hidden="true"></i>
                  </a>
                  <div class="dropdown-menu dropdown-menu-right" id="dropdownComments" aria-labelledby="dropdownCommentsLink" @click.stop.prevent>
                    <div class="card bg-dark-grey">
                      <div class="card-body h-300px overflow-auto">
                        <div class="row mx-0">
                          {{canComment}}
                          <div class="col-lg-12 m-t-20px" v-if="canComment">
                            <div class="form-group border-bottom-black row" style="padding-bottom: 10px;">
                              <div class="col-sm-12">
                                <!-- <textarea class="form-control f-s-0-875rem" id="exampleFormControlTextarea1" rows="3" placeholder="Enter Comments" v-model="commentText"></textarea> -->
                                <b-form-textarea id="textarea-state" v-model="commentText" :state="commentText.length !== 0 && commentText.length <= commentTextMaxLength" :placeholder='commentPlaceholder' rows="3"></b-form-textarea>
                                <span>{{commentText.length}}/{{commentTextMaxLength}}</span>
                              </div>
                              <div class="col-sm-12 m-t-20px text-center">
                                <b-button class="black-btn" @click.stop.prevent="addComment" :disabled="commentText.length === 0 || commentText.length > commentTextMaxLength">{{$t('submitbtn')}}</b-button>
                                <b-button :disabled="!commentText" @click.stop.prevent="cancelComment" variant="danger">{{$t('cancelbtn')}}</b-button>
                              </div>
                            </div>
                          </div>
                          <div class="col-lg-12 px-0">
                            <template v-if="commentList.length > 0">
                              <div class="media " :class="{ 'm-t-10px': index!==0 }" v-for="(comment,index) in commentList" :key="comment.id">
                                <div class="row border-bottom-black mx-0 w-100" style="padding-bottom: 10px;">
                                  <div class="col-md-2">
                                    <i class="fa fa-user fa-2x img-thumbnail" aria-hidden="true"></i>
                                  </div>
                                  <div class="col-md-10">
                                    <div class="media-body">
                                      <h6 class="mt-0">{{comment.user.displayName}}</h6>
                                      <h6 class="font-weight-normal f-s-0-875rem w-100">{{comment.text}}</h6>
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
                                          <p class="f-w-500 commentsdate mb-0">
                                            <i class="fa fa-calendar"></i> {{comment.created}}
                                          </p>
                                        </div>
                                      </div>
                                      <div class="media mt-3 hide">
                                        <div class="row" style="padding-bottom: 10px;">
                                          <div class="col-md-2">
                                            <i class="fa fa-user fa-2x img-thumbnail" aria-hidden="true"></i>
                                          </div>
                                          <div class="col-md-10">
                                            <div class="media-body">
                                              <h6 class="mt-0">John Doe</h6>
                                              <h6 class="font-weight-normal f-s-0-875rem">Location "R6" by "Implant" method is 28% more than National EMU Percentage.</h6>
                                              <div class="row">
                                                <div class="col commentsactionlinkcontainer">
                                                  <a href="#">
                                                    <i class="fa fa-thumbs-up"></i>
                                                  </a>
                                                  <a href="#">
                                                    <i class="fa fa-reply"></i>
                                                  </a>
                                                  <a href="#">
                                                    <i class="fa fa-pencil"></i>
                                                  </a>
                                                  <a href="#">
                                                    <i class="fa fa-trash"></i>
                                                  </a>
                                                </div>
                                                <div class="col text-right">
                                                  <p class="f-w-500 commentsdate mb-0">
                                                    <i class="fa fa-calendar"></i> Feb 17,2020
                                                  </p>
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
                                {{$t('no_data_to_display')}}
                              </div>
                            </template>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <span class="fa fa-eye cursor-pointer ml-2 float-right mt-2" v-if="viewType == 'chart_viewType'" v-b-tooltip.hover :title="$t('preview')" @click.stop.prevent="fullScreen"></span>
                <div class="float-right ml-2 dave2d" v-if="period && viewType == 'chart_viewType'">
                  <b-form-select class="typeDropdown" v-model="chartPlotType" :options="chartTypeOptions"></b-form-select>
                </div>
                <div class="float-right ml-2 dave2d" v-if="ddOptions">
                  <select class="form-control typeDropdown" style="width: 110px; padding: 2px 2px 2px 5px;" v-model="ddValue" @change="handleFilterChange">
                    <option v-for="(option,ind) in ddOptions"
                    :value="ind" :key="ind">
                    {{option.charAt(0).toUpperCase() + option.slice(1)}}
                  </option>
                </select>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card-body pb-0 h-410px">
      <!-- <div class="row dd-holder" v-if="ddOptions">
      <div class="col-md-4 ml-auto">
      <div class="form-group">
      <select class="form-control" v-model="ddValue" @change="handleFilterChange">
      <option v-for="(option,ind) in ddOptions"
      :value="ind" :key="ind">
      {{option.toUpperCase()}}
    </option>
  </select>
</div>
</div>
</div> -->
<div class="row">
  <div class="col-12" v-if="viewType == 'chart_viewType'">
    <highcharts  :options="chartOptions" ref="inputCharts"></highcharts>
  </div>

  <div class="col-12" v-else>
    <!-- <b-table hover :items="items" :fields="fields" head-variant="light" sticky-header :bordered=true style="max-height: 400px !important"></b-table> -->
    <div v-if="chartdata.tableData" >
      <b-table v-if="ddOptions" sticky-header striped hover :fields="chartdata.fields" :items="chartdata.tableData" style="margin-top: 40px;" :sort-compare="sortDate"></b-table>
      <b-table v-else sticky-header striped hover :fields="chartdata.fields" :items="chartdata.tableData" style="margin-top: 40px;" :sort-compare="sortDate"></b-table>
    </div>
  </div>
</div>
</div>
<div class="card-footer text-right" v-if="!bShowIcons">
  <!-- <p class="m-0">Source: <span>{{chartdata.source}}</span></p> -->
  <p class="m-0">{{$t('source')}}: <span>DHIS2</span></p>
</div>

<b-modal v-model = "modalShow" hide-footer centered size="xl" :title="chartdata.title" no-close-on-backdrop>
  <highcharts class="chartHeight h-100 align-items-center justify-content-center d-flex" :options="chartOptions"></highcharts>
</b-modal>
</div>
</div>
</template>

<script>
import service from '@/service/service.js';
import Highcharts from 'highcharts';
import exportingInit from "highcharts/modules/exporting";
exportingInit(Highcharts);
export default {
  props:['chartdata', 'cardTitle', 'ddOptions','handleFilterChange', 'bShowIcons', 'period', "canComment", 'loggedInUserId', 'chartComp', 'showSource'],
  components: {
  },
  mounted(){
    //this.formatTableData()
    //console.log(this.fields)
  },
  data(){
    return {
      ddValue:this.ddOptions ? 0 : null,
      dataOptions:[
        {
          "value": "asc"
        },
        {
          "value": "desc"
        }
      ],
      chartOptions:this.reInitilaizeData(this.chartdata),
      chartPlotType: 'column',
      modalShow: false,
      viewType: 'chart_viewType',
      fields: [],
      items: [],
      commentText: '',
      commentTextMaxLength: 100,
      commentList: [],
      cID: '',
      showLoader: false,
      chartTypeOptions: [{
        value: 'column',
        text: 'Column'
      },
      {
        value: 'area',
        text: 'Area'
      },
      {
        value: 'line',
        text: 'Line'
      }
    ],
    exportData: this.chartdata.tableData,
  }
},
computed: {
  commentPlaceholder: function() {
    return this.$i18n.t('placeholderMaxValue', {number: this.commentTextMaxLength})
  }
},
methods:{
  sortDate(a, b, key) {
    if (key !== 'Period') {
      // `key` is not the field that is a date.
      // Let b-table handle the sorting for other columns
      // returning null or false will tell b-table to fall back to it's
      // internal sort compare routine for fields keys other than `myDateField`
      return null // or false
    }
    let aDate = this.$moment(a[key], 'MMM YYYY')
    let bDate = this.$moment(b[key], 'MMM YYYY')
    if (aDate.isValid && bDate.isValid) {
      if (aDate < bDate) {
        return -1
      }
      else if (aDate > bDate) {
        return 1
      }
      else {
        return 0
      }
    }
    return null
  },
  errorAlert() {
    this.$swal({
      title: this.$i18n.t('error')
    });
  },
  addComment() {
    this.showLoader = true
    service.addComments(this.cID, this.commentText).then(response => {
      // console.log(response)
      if (response.data.status === "OK") {
        this.commentText = ""
        this.getComments(this.cID, true)
        // this.successAlert()
      } else {
        this.showLoader = false
        this.errorAlert()
      }
    }).catch(() => {
      this.showLoader = false
      this.errorAlert()
    })
  },
  cancelComment() {
    this.commentText = ""
  },
  getComments(cid, stopLoader = false) {

    service.getComments(cid).then(response => {
      this.cID = cid
      this.commentList = response.data.interpretations.length ? response.data.interpretations.map(d => ({
        ...d,
        created: this.$moment(d.created).format('lll')
      })).sort((a, b) => {
        let valueA = new Date(a.created).getTime(),
        valueB = new Date(b.created).getTime();

        let comparison = 0;
        if (valueA > valueB) {
          comparison = -1;
        } else if (valueA < valueB) {
          comparison = 1;
        }
        return comparison;
      }) : []

      if (stopLoader) {
        this.showLoader = false
      }
    }).catch(() => {
      this.commentList = []
    })
  },
  formatTableData(){
    if(this.chartdata.tableData != undefined){
      this.fields.push('Period')
      this.chartdata.tableData.forEach((data, i)=>{
        // console.log(data)
        Object.keys(data).forEach(key=>{
          if(key == 'Method' && this.fields.indexOf(key) == -1){
            this.fields.push(data[key])
          }
          if(key != 'Method'){
            // console.log(this.fields[i+1], i+1)
            this.items.push({'Period': key, [this.fields[i+1]]: data[key]})
          }

        })
      })
      // console.log(this.fields, this.items)
    }
  },
  changeViewType(type) {
    this.$refs[`chart_viewType`].classList.remove('active');
    this.$refs[`table_viewType`].classList.remove('active');
    this.$refs[`${type}`].classList.add('active');
    this.viewType = type
  },
  fullScreen() {
    setTimeout(() => {
      this.modalShow = true
    }, 100)
  },
  reInitilaizeData(p_chartData){
    //    if (p_chartData.tableData) {
    //     this.exportData = p_chartData.tableData
    //    }
    if(p_chartData.cid != undefined){
      this.cID = p_chartData.cid
      this.getComments(p_chartData.cid)
    }
    let chartNewData = p_chartData.type === 'bar' ? {
      chart: {
        type: p_chartData.type ? p_chartData.type : 'bar',
        zoomType:'x',
        events: {}
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: p_chartData.categories,
        max: p_chartData.max,
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
    },
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
        backgroundColor: 'transparent',
        // borderColor: '#C98657',
        // borderColor: '#00000080',
        borderColor: '#a7a7a7',
        borderWidth: 1,
        borderRadius: 5,
        // itemDistance: 50
      },
      plotOptions: {
        series: {
          stacking: 'normal'
        }
      },
      exporting: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      series: p_chartData.data
    } : p_chartData.type === 'pie' ? {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: p_chartData.xTitle
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' ,
        shared: true,

        useHTML: true,
      },
      legend: {
        // maxHeight: 60,
        // backgroundColor: '#FCFFC5',
        // backgroundColor: '#71b5cd33',
        backgroundColor: 'transparent',
        // borderColor: '#C98657',
        // borderColor: '#00000080',
        borderColor: '#a7a7a7',
        borderWidth: 1,
        borderRadius: 5,
        // itemDistance: 50
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: p_chartData.dataLable ? p_chartData.dataLable : false,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style:{
              width: '100px'
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
    }:{
      chart: {
        type: p_chartData.type === "stacked" ? 'column' : p_chartData.type,
        zoomType:'x',
        events: {}
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: p_chartData.categories,
        crosshair: true,
        labels: {
          rotation: -45
        },
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
    },
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
        backgroundColor: 'transparent',
        // borderColor: '#C98657',
        // borderColor: '#00000080',
        borderColor: '#a7a7a7',
        borderWidth: 1,
        borderRadius: 5,
        // itemDistance: 50
      },
      plotOptions: p_chartData.type === "stacked" ? {
        series: {
          stacking: 'normal',
          dataLabels: {
            enabled: false
          }
        }
      }:{
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
    }
    //console.log(this.chartdata.title)


    if(this.chartComp == 'repotingRate'){
      chartNewData.yAxis.plotLines = [{
        color: '#b3b3b3',
        width: 2,
        value: 80,
        zIndex: 5,
        label: {
          text: '80%',
          align: 'right',
          style: {
            color: 'black',
            fontWeight: 'bold'
          }
        }
      }]
    }
    if(this.chartdata.title == 'Comparing EMU to mCPR (public sector)' || this.chartdata.title == 'Comparing EMU to mCPR'){
      chartNewData.chart.events = {
        ...chartNewData.chart.events,
        load: function (e) {
          if(this.series.length && this.series[0].data.length){
            let catLen = this.series[0].data.length - 1;
            this.xAxis[0].setExtremes(catLen - 11, catLen);
          }
        }
      }
    }

    let min1 = 0, max1 = 0
    if(chartNewData.series && chartNewData.series.length > 0){
      chartNewData.series.forEach(d => {
        // let innerDataArr = d.data.map(dInner => dInner.y)
        let innerMin = Math.min(...d.data)
        let innerMax = Math.max(...d.data)
        if(innerMin < min1) {
          min1 = innerMin
        }
        if(innerMax > max1) {
          max1 = innerMax
        }
      })
    }

    if(chartNewData.chart.type != 'pie'  && (chartNewData.plotOptions && chartNewData.plotOptions.series && chartNewData.plotOptions.series.stacking !== "normal")){
      chartNewData.yAxis.min = min1 > 0 ? 0 : min1
      chartNewData.yAxis.max = max1
    }
    return chartNewData
  },
  sortData(p_val){
    let aTemp = this.chartdata.categories;
    if(aTemp.length > 1){
      if(aTemp[0] > aTemp[1] && p_val === 'asc' || aTemp[0] < aTemp[1] && p_val === 'desc'){
        let aCats = this.chartdata.categories.reverse(),
        i,aData = this.chartdata.data,nLen = aData.length;
        for(i = 0; i < nLen; i++){
          aData[i].data.reverse();
        }
      }
    }
  },
  exportChart(type){
    var chart = this.$refs.inputCharts.chart;
    let max = chart.options.xAxis[0].max
    let catLen = chart.options.series[0].data.length - 1;
    chart.xAxis[0].setExtremes(0, catLen);
    setTimeout(() => {
      chart.options.xAxis[0].max = max
      chart.xAxis[0].setExtremes(catLen - 11, catLen);
    }, 100)
    if(type == 'jpg'){
      chart.exportChart({
        type: 'image/jpeg',
        filename: 'overview-chart'
      });
    }else if(type == 'png'){
      chart.exportChart({
        type: 'image/png',
        filename: 'overview-chart'
      });
    }else if(type == 'pdf'){
      chart.exportChart({
        type: 'application/pdf',
        filename: 'overview-chart'
      });
    }
  }
},
watch:{
  chartdata(newVal){
    this.chartOptions = this.reInitilaizeData(newVal);
  }
  ,chartPlotType (newValue) {
    this.chartOptions.chart.type = newValue.toLowerCase()
  }
}
}
</script>
<style scoped>
.card-comp-title{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dd-holder{
  position: absolute;
  z-index: 10;
  right: 1.25rem;
  width: 100%;
}
.typeDropdown{
  font-size: 0.75rem;
  padding: 2px 25px 2px 5px;
  height: auto;
  margin-top: 4px;
}
.b-table-sticky-header {
  overflow-y: auto;
  max-height: 400px;
}
</style>
