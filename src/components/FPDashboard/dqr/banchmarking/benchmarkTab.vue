<template>
<div class="container-fluid m-t-20px">
  <loader v-if="bShowLoader" />
  <div class="filter-btn" @click.prevent="showToolbarOnTablet = true"><a href="#" id="tabbar-expand"><i class="fas fa-filter"></i></a></div>
  <div class="row float-button">
    <div class="map-collapse-btndiv benchmarkmap-toggle" style="top:1vh;left: -71px; padding-left: 10px;">
      <a href="#" class="color-white" id="benchmarkmap-toggle2" data-toggle="modal" data-target="#exampleModalScrollable">
        {{$t('introduction')}}
        <span class="hide">
          <i class="fa fa-close"></i>
        </span>
      </a>
    </div>
    <div class="map-collapse-btndiv benchmarkbgdata-toggle" style="top:23vh;left: -89px;padding-left: 10px;">
      <a href="#" class="color-white" id="benchmarkbgdata-toggle2" data-toggle="modal" data-target="#exampleModalScrollable2">
        {{$t('backgroundData')}}
        <span class="hide">
          <i class="fa fa-close"></i>
        </span>
      </a>
    </div>
    <div class="map-collapse-btndiv benchmarkbgdata-toggle" style="top:44vh;left: -65px;padding-left: 10px;">
      <a href="#" class="color-white" id="benchmarkbgdata-toggle2" data-toggle="modal" data-target="#exampleModalScrollable3">
        {{$t('fpSource')}}
        <span class="hide">
          <i class="fa fa-close"></i>
        </span>
      </a>
    </div>
  </div>
  <div class="row">
    <div class="modal fade" id="exampleModalScrollable" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
      <introduction />
    </div>
    <div class="modal fade" id="exampleModalScrollable2" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
      <backgroundgData v-if="bgData && methodMixData" :bgData="bgData" :methodMixData="methodMixData"/>
    </div>
    <div class="modal fade" id="exampleModalScrollable3" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
      <fpSource @fpSource="getFPSource" />
    </div>
  </div>
  <div class="row">
    <div class="col-12 px-0">
      <div class="row">
    <div class="col-lg-12">
      <ul class="nav nav-pills mb-3" id="benchmarking-sub-tab" role="tablist"
        v-if="categoryData && categoryData.emu['Commodities_Client']['dataOnContraceptive'] == 'No' && categoryData.emu['Commodities_Facilities']['dataOnContraceptive'] == 'No' && categoryData.emu['Visits']['dataOnContraceptive'] == 'No' && categoryData.emu['User']['dataOnContraceptive'] == 'No'">
        <li class="nav-item">
          <a class="nav-link analytical-method-link" id="benchmarking-nooutput-tab" data-toggle="pill" href="#benchmarking-nooutput" role="tab" aria-controls="benchmarking-nooutput" aria-selected="false" ></a>
        </li>
      </ul>
      <ul class="nav nav-pills mb-3" id="benchmarking-sub-tab" role="tablist" v-else>
        <li class="nav-item" v-if="categoryData && categoryData.emu['Commodities_Client']['dataOnContraceptive'] == 'Yes'">
          <a :class="{active : activeTab === 'Commodities_Client'}" class="nav-link analytical-method-link" id="benchmarking-comclient-tab" data-toggle="pill" href="#benchmarking-comclient" role="tab" aria-controls="benchmarking-comclient"
            aria-selected="true"  @click="getRecentActiveTab('client')">Commodities Distributed to Clients</a>
        </li>
        <li class="nav-item" v-if="categoryData && categoryData.emu['Commodities_Facilities']['dataOnContraceptive'] == 'Yes'">
          <a :class="{active : activeTab === 'Commodities_Facilities'}" class="nav-link  analytical-method-link" id="benchmarking-comfacilities-tab" data-toggle="pill" href="#benchmarking-comfacilities" role="tab"
            aria-controls="benchmarking-comfacilities" aria-selected="false" @click="getRecentActiveTab('facilities')">Commodities Distributed to Facilities</a>
        </li>
        <li class="nav-item" v-if="categoryData && categoryData.emu['Visits']['dataOnContraceptive'] == 'Yes'">
          <a :class="{active : activeTab === 'Visits'}" class="nav-link  analytical-method-link" id="benchmarking-fpvisits-tab" data-toggle="pill" href="#benchmarking-fpvisits" role="tab" aria-controls="benchmarking-fpvisits" aria-selected="false" @click="getRecentActiveTab('visits')">FP
            Visits</a>
        </li>
        <li class="nav-item" v-if="categoryData && categoryData.emu['User']['dataOnContraceptive'] == 'Yes'">
          <a :class="{active : activeTab === 'User'}" class="nav-link  analytical-method-link" id="benchmarking-fpusers-tab" data-toggle="pill" href="#benchmarking-fpusers" role="tab" aria-controls="benchmarking-fpusers" aria-selected="false" @click="getRecentActiveTab('users')">FP
            Users</a>
        </li>
        <li class="nav-item">
          <a class="nav-link analytical-method-link" id="benchmarking-fpemuoutput-tab" data-toggle="pill" href="#benchmarking-fpemuoutput" role="tab" aria-controls="benchmarking-fpemuoutput" aria-selected="false" @click="getRecentActiveTab('emu')">EMU Output</a>
        </li>
      </ul>
    </div>

  </div>
</div>
    <div class="col-lg-12 px-0" style="position:relative;">
      <div class="tab-content" id="benchmarking-sub-tabContent"
        v-if="categoryData && categoryData.emu['Commodities_Client']['dataOnContraceptive'] == 'No' && categoryData.emu['Commodities_Facilities']['dataOnContraceptive'] == 'No' && categoryData.emu['Visits']['dataOnContraceptive'] == 'No' && categoryData.emu['User']['dataOnContraceptive'] == 'No'">
        <div class="tab-pane fade active show" id="benchmarking-nooutput" role="tabpanel" aria-labelledby="benchmarking-nooutput-tab">
          <b-alert show class="m-t-40px">Contraceptive Commodities data not Available</b-alert>
        </div>
      </div>
      <div class="tab-content" id="benchmarking-sub-tabContent" v-else>
        <div :class="{active : activeTab === 'Commodities_Client', show: activeTab === 'Commodities_Client'}" class="tab-pane fade" id="benchmarking-comclient" role="tabpanel" aria-labelledby="benchmarking-comclient-tab"
          v-if="categoryData && categoryData.emu['Commodities_Client']['dataOnContraceptive'] == 'Yes'">
          <benchMarkingInpOutp v-if="categoryData.emu['Commodities_Client'] && bgData" exportPosition=1 :data="categoryData.emu['Commodities_Client']" :bgData="bgData" :bAllWomen="bAllWomen"
            :repoId="categoryData['emu']['Commodities_Client']['reportingRate'][0]['indicator']['subIndicator'][0]['de'][0]" tabName="commoditiesToClients" :getData="getDatafromChild" tableName="Commodities Client" :startYear="sStartYear"
            :repoColor="categoryData['emu']['Commodities_Client']['reportingRate'][0]['indicator']['chartOptions']['color']"
            :endYear="sRecentYear" contName="Commodities_Client" :locationVal="value" @filter="getFilter" @yearFilterList="yearVal" :year="filterYear"
            @activeTabName="getActiveTab" ref="comclientref" @methodMixChart="getMethodMixData" :signOffActive="signOffActive" @sendEMUCharts="getEMUCharts"/>
        </div>
        <!-- :repoId="repoIds['Commodities_Client']" -->
        <div :class="{active : activeTab === 'Commodities_Facilities', show: activeTab === 'Commodities_Facilities'}" class="tab-pane fade" id="benchmarking-comfacilities" role="tabpanel" aria-labelledby="benchmarking-comfacilities-tab"
          v-if="categoryData && categoryData.emu['Commodities_Facilities']['dataOnContraceptive'] == 'Yes'">
          <benchMarkingInpOutp v-if="categoryData.emu['Commodities_Facilities'] && bgData" exportPosition=2 :data="categoryData.emu['Commodities_Facilities']" :bgData="bgData" :bAllWomen="bAllWomen"
            :repoId="categoryData['emu']['Commodities_Facilities']['reportingRate'][0]['indicator']['subIndicator'][0]['de'][0]" tabName="commoditiesToFacilities" :getData="getDatafromChild" tableName="Commodities Facilities" :startYear="sStartYear"
            :repoColor="categoryData['emu']['Commodities_Facilities']['reportingRate'][0]['indicator']['chartOptions']['color']"
            :endYear="sRecentYear" contName="Commodities_Facilities" :locationVal="value" @yearFilterList="yearVal"
            :year="filterYear" @activeTabName="getActiveTab" ref="comfacilityref" @methodMixChart="getMethodMixData" :signOffActive="signOffActive" @sendEMUCharts="getEMUCharts"/>
        </div>
        <div :class="{active : activeTab === 'Visits', show: activeTab === 'Visits'}" class="tab-pane fade" id="benchmarking-fpvisits" role="tabpanel" aria-labelledby="benchmarking-fpvisits-tab"
          v-if="categoryData && categoryData.emu['Visits']['dataOnContraceptive'] == 'Yes'">
          <benchMarkingInpOutp v-if="categoryData.emu['Visits'] && bgData" exportPosition=3 :data="categoryData.emu['Visits']" :bgData="bgData" :bAllWomen="bAllWomen" :repoId="categoryData['emu']['Visits']['reportingRate'][0]['indicator']['subIndicator'][0]['de'][0]"
            :repoColor="categoryData['emu']['Visits']['reportingRate'][0]['indicator']['chartOptions']['color']"
            tabName="fp_visits" :getData="getDatafromChild" tableName="Visits" :startYear="sStartYear" :endYear="sRecentYear" contName="Visits"
            :locationVal="value" @yearFilterList="yearVal" :year="filterYear" @activeTabName="getActiveTab" ref="visitsref" @methodMixChart="getMethodMixData" :signOffActive="signOffActive" @sendEMUCharts="getEMUCharts"/>
        </div>
        <div :class="{active : activeTab === 'User', show: activeTab === 'User'}" class="tab-pane fade" id="benchmarking-fpusers" role="tabpanel" aria-labelledby="benchmarking-fpusers-tab"
          v-if="categoryData && categoryData.emu['User']['dataOnContraceptive'] == 'Yes'">
          <benchMarkingInpOutp v-if="categoryData.emu['User'] && bgData" exportPosition=4 :data="categoryData.emu['User']" :bgData="bgData" :bAllWomen="bAllWomen" :repoId="categoryData['emu']['User']['reportingRate'][0]['indicator']['subIndicator'][0]['de'][0]"
            :repoColor="categoryData['emu']['User']['reportingRate'][0]['indicator']['chartOptions']['color']"
            tabName="fp_users" :getData="getDatafromChild" tableName="Users" :startYear="sStartYear" :endYear="sRecentYear" contName="User"
            :locationVal="value" @yearFilterList="yearVal" :year="filterYear" @activeTabName="getActiveTab" ref="usersref" @methodMixChart="getMethodMixData" :signOffActive="signOffActive" @sendEMUCharts="getEMUCharts"/>
        </div>

        <div class="tab-pane fade" id="benchmarking-fpemuoutput" role="tabpanel" aria-labelledby="benchmarking-fpemuoutput-tab">
          <emuOutput v-if="bShowEmu && outputData && slopeData" exportPosition=5 :outputData="outputData" :filter="filter" :bgData="bgData" :bAllWomen="bAllWomen" :slopeData="slopeData" :userTrendsData="userTrendsData" :userTrendsDataByMethods="userTrendsDataByMethods" :startYear="sStartYear"
            :endYear="sRecentYear" :boolVal="boolVal" :locationVal="value" :sourcecategory="category" :data="categoryData.emu" @yearFilterList="yearVal" :year="filterYear" :signOffActive="signOffActive" :defaultLevelID="defaultLevelID"/>
        </div>
      </div>
      <div class="top-date-page-div">
        <span class="btn pointer-events-none color-white">
          {{sStartYear}} - {{sRecentYear}}
        </span>
      </div>

    </div>
  </div>

  <toolbarComponent v-if="value && emuYears" :recentActiveTab="recentActiveTab" :locationValue="value" @location="getLocation" :emuYears="emuYears" @emuYear="getEmuYear" @closeToolbar="closeToolbar" :showToolbarOnTablet="showToolbarOnTablet"/>
</div>
</template>

<script>
import benchMarkingInpOutp from './benchMarkingInpOutp';
import emuOutput from './emuOutput';
import service from '@/service/service.js';
import backgroundgData from "./bgData";
import fpSource from "./fpSource";
import introduction from "./introduction";
import dataM from './dataMassaging';
import toolbarComponent from './toolbarComponent.vue';
import html2canvas from 'html2canvas';
export default {
  components: {
    emuOutput,
    benchMarkingInpOutp,
    backgroundgData,
    fpSource,
    introduction,
    toolbarComponent
  },
  props: ['locationVal', 'signOffActive'],
  mounted() {

  },
  updated() {

  },
  methods: {
    getEMUCharts(exportArr = []){
      exportArr.forEach(obj => {
        let isObj = this.exportArr.find(e => e.cardKey === obj.cardKey)
        if(isObj) {
          let foundIndex = this.exportArr.findIndex(e => e.cardKey === obj.cardKey);
          this.exportArr[foundIndex] = obj
        } else {
          this.exportArr.push(obj)
        }
      })
      //console.log(this.exportArr)
    },
    async exportPPT(){
      this.showLoader = true
        let locationName = null
        await service.getIndividualOrganisation(this.locationVal.split('/')[1]).then(key => {
          locationName = key.data.name;
        })
        this.showLoader = false
        const {
          value: formValues
        } = await this.$swal({
          title: 'Export Options',
          html: '<div><input id="fileName" class="swal2-input" placeholder="File Name" value="EMU Monthly" tabindex="-1"/></div>' +
            '<div class="pt-3"><div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="showLegends" value="show"><label class="custom-control-label" for="showLegends">Legends</label></div>' +
            '<div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="showValues" value="show"><label class="custom-control-label" for="showValues">Values</label></div>' +
            '<div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="showXAxis" checked value="show"><label class="custom-control-label" for="showXAxis">X-Axis Title</label></div>' +
            '<div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="showYAxis" checked value="show"><label class="custom-control-label" for="showYAxis">Y-Axis Title</label></div></div>',
          focusConfirm: true,
          showCancelButton: true,
          confirmButtonText: 'Export',
          preConfirm: () => {
            return [
              document.getElementById('fileName').value,
              document.getElementById('showLegends').checked ? document.getElementById('showLegends').value : "",
              document.getElementById('showValues').checked ? document.getElementById('showValues').value : "",
              document.getElementById('showXAxis').checked ? document.getElementById('showXAxis').value : "",
              document.getElementById('showYAxis').checked ? document.getElementById('showYAxis').value : "",
            ]
          }
        })
        if (formValues) {
          let period = this.emuYears[this.emuYears.length - 1]
          // console.log(period, locationName)
          import(/* webpackChunkName: "pptxgenjs"*/"pptxgenjs").then((pptxgen) => {
            let pptx = new pptxgen.default();
            pptx.layout = 'LAYOUT_WIDE';
            pptx.author = 'Avenir Generic Tool';
            pptx.company = 'Dure Technologies';
            pptx.subject = this.$i18n.t('emu_monthly');
            pptx.title = this.$i18n.t('emu_monthly');

            pptx.defineSlideMaster({
              title: 'MASTER_SLIDE',
              bkgd: 'FFFFFF',
              objects: [{
                  'text': {
                    text: this.$i18n.t('emu_monthly'),
                    options: {
                      y: '2%',
                      fontSize: 30,
                      align: 'center',
                      w: '100%',
                      underline: true
                    }
                  }
                },
                {
                  'line': {
                    align: 'center',
                    x: 4.2,
                    y: '94%',
                    w: 5,
                    h: 0,
                    line: '0088CC',
                    lineSize: 1
                  }
                },
                {
                  'line': {
                    align: 'center',
                    x: 5.2,
                    y: '95%',
                    w: 3,
                    h: 0,
                    line: '0088CC',
                    lineSize: 1
                  }
                },
                {
                  'text': {
                    text: this.$i18n.t('location') + " :- " + locationName,
                    options: {
                      x: 0.5,
                      y: '95%',
                      w: '60%',
                      bold: true,
                      fontSize: 12
                    }
                  }
                },
                {
                  'text': {
                    text: this.$i18n.t('period') + " :- " + period.val,
                    options: {
                      x: 0.5,
                      y: '97%',
                      w: '60%',
                      bold: true,
                      fontSize: 12
                    }
                  }
                },
                {
                  'text': {
                    text: this.$i18n.t('method') + " :- " + this.methodSelected,
                    options: {
                      x: 0.5,
                      y: '99%',
                      w: '60%',
                      bold: true,
                      fontSize: 12
                    }
                  }
                },
                {
                  'text': {
                    text: this.$moment(new Date()).format('llll'),
                    options: {
                      x: 8.5,
                      y: '99%',
                      w: '30%',
                      align: 'right',
                      fontSize: 12,
                      bold: true
                    }
                  }
                }
              ],
              // slideNumber: { x:0.5, y:'1%'}
            });

            let slide = null;

            if (this.exportArr && this.exportArr.length) {
              let reA = /[^a-zA-Z]/g;
              let reN = /[^0-9]/g;

              this.exportArr.sort((a, b) => {
                let aA = a.cardKey.replace(reA, ""),
                  bA = b.cardKey.replace(reA, "")
                if (aA === bA) {
                  let aN = parseInt(a.cardKey.replace(reN, ""), 10);
                  let bN = parseInt(b.cardKey.replace(reN, ""), 10);
                  return aN === bN ? 0 : aN > bN ? 1 : -1;
                } else {
                  return aA > bA ? 1 : -1;
                }
              })
              // console.log(this.exportArr)

              for (let index = 0; index < this.exportArr.length; index++) {
                const element = this.exportArr[index];

                slide = pptx.addSlide('MASTER_SLIDE');
                slide.addText(element.ppttitle, {
                  x: 0.5,
                  y: 0.6,
                  w: '90%',
                  fontSize: 18,
                  bold: true,
                  underline: true,
                  breakLine: true
                });
                let chartData = [],
                  chartColors = []

                //console.log(element.data)

                if(element.data.length > 0){
                  element.data.forEach(e => {
                    if (e.color) {
                      chartColors.push(e.color.split('#')[1])
                    } else {
                      chartColors.push((0xFFFFFFFF - Math.random() * 0xFFFFFFFF).toString(16).substr(0, 6))
                    }
                    // console.log(e.name)
                    let name = e.name,
                      labels = element.categories,
                      values = e.data

                      chartData.push({
                        name,
                        labels,
                        values
                      })

                  })

                  let type = element.type,
                    barDir = 'col'

                  let options = {
                    x: 0.5,
                    y: 1,
                    w: '90%',
                    h: '75%',
                    showValue: formValues[2] === 'show' ? true : false,
                    showLegend: formValues[1] === 'show' ? true : false,
                    legendPos: 'b',
                    barGapWidthPct: 50,
                    chartColors,
                    showCatAxisTitle: formValues[3] !== 'show' ? false : element.xTitle  ? true : false,
                    catAxisTitle: element.xTitle ? element.xTitle : "",
                    showValAxisTitle: formValues[4] !== 'show' ? false : element.yTitle  ? true : false,
                    valAxisTitle: element.yTitle ? element.yTitle : ""
                  }


                  if (type == "line") {
                    type = pptx.ChartType.line
                  } else if (type == "area") {
                    type = pptx.ChartType.area
                  } else if (type == "scatter") {
                    type = pptx.ChartType.scatter
                    options['lineSize'] = 0
                  } else if (type == "stacked") {
                    type = pptx.ChartType.bar
                    options['barDir'] = 'col'
                    options['barGrouping'] = 'stacked'
                  } else if (type == "bar") {
                    type = pptx.ChartType.bar
                    options['barDir'] = 'col'
                    options['barGrouping'] = 'stacked'
                  } else {
                    type = pptx.ChartType.bar
                    // options['barDir'] = 'col'
                    if (element.plotOptions && element.plotOptions.series && element.plotOptions.series.stacking === 'normal') {
                      options['barDir'] = 'col'
                      options['barGrouping'] = 'stacked'
                    }
                  }
                  //console.log(type, chartData,options)
                  slide.addChart(type, chartData, options);
                }else{
                  slide.addText(this.$i18n.t('no_data_to_display'), {
                    x: 5.5,
                    y: 3.6,
                    w: '90%',
                    fontSize: 18,
                    bold: true,
                    underline: false,
                    breakLine: true
                  });
                }
              }
            }
            pptx.writeFile({fileName: formValues[0]});
            //this.isExport = false
            console.log("File exported...")
          })
        } else {
          //this.isExport = false
        }
    },
    getMethodMixData(data){
      this.methodMixData = data
    },
    getActiveTab (value) {
      //console.log(value) // someValue
      this.recentActiveTab = value
    },
    getRecentActiveTab(tab){
      if(tab == 'client'){
        this.recentActiveTab = this.$refs.comclientref.activetab
      }else if(tab == 'facilities'){
        this.recentActiveTab = this.$refs.comfacilityref.activetab
      }else if(tab == 'visits'){
        this.recentActiveTab = this.$refs.visitsref.activetab
      }else if(tab == 'users'){
        this.recentActiveTab = this.$refs.usersref.activetab
      }else{
        this.recentActiveTab = tab
      }
      //console.log(this.recentActiveTab)

    },
    closeToolbar() {
      this.showToolbarOnTablet = false
    },
    getLocation(newLocation) {
      //let val = newLocation.split("/")
      this.value = newLocation
      this.newLocVal = newLocation
      this.getConfigAccess()
    },
    yearVal (value) {
      this.emuYears = value
    },
    getFilter(p){
        console.log(p)
    },
    getEmuYear(p){
      this.filterYear = p
    },
    /**
     * This is get banchmarking configuration.
     * Usage: `getConfigAccess()`
     * @param 'dqrModule' which is key for benchmarking config
     * @return {Object} categoryData
     */
    getFPSource(newVal) {

      if (newVal === 'false') {
        this.bShowLoader = false
        return
      }
      if (newVal) {
        this.getConfigAccess();
      }
    },
    getConfigAccess() {
      let locale = this.$i18n.locale, key = `applicationModule_${locale}`, key2 = `dqrModule_${locale}`, key3 = `ssToEMUBgData_${locale}`, key4 = `ministrialModule_${locale}`, key5 = `globalFactors_${locale}`;
      if (!settings.country) {
        let appId = this.$store.state.appId ? this.$store.state.appId : "", appUserId = this.$store.state.appUserId ? this.$store.state.appUserId : ""
        if(appId && appUserId) {
          key = `${appUserId}_${appId}_applicationModule_${locale}`
          key2 = `${appUserId}_${appId}_dqrModule_${locale}`
          key3 = `${appUserId}_${appId}_ssToEMUBgData_${locale}`
          key4 = `${appUserId}_${appId}_ministrialModule_${locale}`
          key5 = `${appUserId}_${appId}_globalFactors_${locale}`
        } else {
            this.showLocalStorageError()
            return;
        }
      }
      service.getLoggedInUser().then(response => {
        service.getSavedConfig(key).then(appres => {
          service.getSavedConfig(key2).then(minres => {
            this.categoryData = minres.data;

            let oBechMarkModule = minres.data,
              aBackgorundIndicators = oBechMarkModule.emu['Background_Data']['backgroundIndicators'] ? oBechMarkModule.emu['Background_Data']['backgroundIndicators'] : [],
              i, nLen = aBackgorundIndicators.length,
              oBackground = {},
              locationID = this.newLocVal.split('/')[1],
              aSelectedDEs = [],
              sSelectedDEs = '',
              levelID = this.newLocVal.split('/')[0]
              this.defaultLevelID = appres.data.defaultLevelID
            //   console.log(response)
            // console.log(response.data.dataViewOrganisationUnits[0].id, response.data.dataViewOrganisationUnits[0].level)
            if(response.data.dataViewOrganisationUnits[0].level > appres.data.defaultLevelID) {
              locationID = response.data.dataViewOrganisationUnits[0].id
              levelID = response.data.dataViewOrganisationUnits[0].level
            }

           // this.value = levelID+'/'+locationID
            this.value = this.newLocVal
            console.log(this.value)
            for (i = 0; i < nLen; i++) {
              let aSubInd = aBackgorundIndicators[i].subIndicators,
                j, nSubLen = aSubInd.length;

              for (j = 0; j < nSubLen; j++) {
                let sName = aSubInd[j].name,
                  aSelectedDE = aSubInd[j].selectedDE;
                oBackground[sName] = aSelectedDE.map((ele, index) => {
                  aSelectedDEs.push(ele.id);
                  return ele.id
                });
              }
            }
            sSelectedDEs = aSelectedDEs.join(';');

            // SWITCH CASE START
            this.switchCategory(this.categoryData.emu)
            // SWITCH CASE END
            // console.log(this.category)
            // Object.keys(this.categoryData['reportingRate']).forEach(ind => {
            //   this.categoryData['reportingRate'][ind].chartData.forEach((ids, index) => {
            //     ids['indicator']['subIndicator'].forEach((ele, jndex) => {
            //       if (ele.de[0] && ((Array.isArray(ele.static_name) && ele.static_name[0].toLowerCase() === "reporting rate (actual)") || (typeof ele.static_name === 'string' && ele.static_name.toLowerCase() ===
            //           "reporting rate (actual)"))) {
            //         this.repoIds[ind] = ele.de[0];
            //       }
            //     })
            //   })
            // });


            //console.log(this.repoIds)
            this.sStartYear = appres.data.startingYear ? appres.data.startingYear : '2007'
            this.sRecentYear = this.categoryData.emu['Background_Data']['SSDataRecentYear'];
            this.bAllWomen = this.categoryData.emu['Background_Data']['FPWomenPopulation'] === "WRA";
            let sYear = dataM.getYearFormated(this.sStartYear, this.sRecentYear),
              aYear = sYear.split(';');
            service.getSavedConfig(key3).then(bdData => {
              service.getSavedConfig(key5).then(pCont => {
                let oAdjsData = bdData.data.adjustments,
                  aAdjCats = oAdjsData.cat,
                  aAdjTypes = oAdjsData.data,
                  oFinalAdjTypes = {};
                aAdjTypes.forEach((ele, ind) => {
                  let {
                    _i,
                    data
                  } = ele;
                  oFinalAdjTypes[_i] = {}
                  aAdjCats.forEach((categ, jndex) => {
                    oFinalAdjTypes[_i][categ] = data[jndex] ? (data[jndex]).toFixed(3) * 1 : 0;
                  })
                });
                /*  */
                service.getAnalyticalIndicatorData(sSelectedDEs, locationID, sYear).then((response) => {
                  let oFinalData = dataM.getFormatedBackGroundData(response.data, oBackground, aYear, this.bAllWomen)

                    let oTemp = oFinalData.final,
                    odata = bdData.data,
                    ocontdata = dataM.getComputedContFact(pCont.data.continuation),
                    oBgdata = {
                      population: oTemp['Population (MWRA)'] || oTemp.Population,
                      UNPD: oTemp.UNPD,
                      PMS: oTemp['PMA'],
                      FPET: oTemp['FPET'],
                      MICS: oTemp.MICS,
                      DHS: oTemp.DHS,
                      methodMix: oFinalData.methodMix,
                      continuation: ocontdata,
                      adjustmentFactor: odata.adjustmentFactor,
                      adjustmentFactorTypeWise: oFinalAdjTypes,
                      recentYear: oFinalData.recentYear
                    };
                  //console.log(oBgdata)

                  this.bgData = oBgdata;
                }).catch(res => {
                  console.log(res);
                  this.showAlert();
                });
              });
              /*  */

            }).catch(res => {
              console.log(res);
              this.showAlert();
            });
          }).catch(res => {
            console.log(res);
            if(this.$store.state.isAdmin) {
              // Popup message to set the configurations
              this.$swal({
                title: this.$i18n.t(
                  "configurationnotavailable"
                ),
                text: this.$i18n.t(
                  "pleasesetyourconfiguration"
                ),
                showCancelButton: true,
                confirmButtonText: this.$i18n.t(
                  "configurenow"
                ),
              }).then((result) => {
                if (result.value) {
                  this.$router.push("/config");
                }
              });
            } else {
              // Popup message to contact admin for the configurations
              this.$swal({
                title: this.$i18n.t(
                  "configurationnotavailable"
                ),
                text: this.$i18n.t(
                  "error_text_2"
                )
              })
            }
            this.bShowLoader = false;
          });
        }).catch(res => {
          this.showAlert();
        });
      }).catch(res => {
        this.showAlert();
      });
    },
    switchCategory(data) {
      let aSource = {
        Commodities_Client: "EMU :Commodities to clients",
        Visits: "EMU :FP visits",
        Commodities_Facilities: "EMU :Commodities to facilitlity",
        User: "EMU :FP users"
      }
      let preVal = '',
        preValFlag = false,
        cat = ''
      Object.keys(aSource).forEach(source => {
        if (data[source]['dataOnContraceptive'] == 'Yes' && preValFlag == false) {
          preVal = source
          cat = aSource[source]
          preValFlag = true
        }
        //console.log(this.category, this.activeTab)
      })
      this.category = cat;
      this.activeTab = preVal

    },
    getDatafromChild(p_tabName, p_data, p_type, filter) {
      // if()
      this.boolVal = !this.boolVal

      p_data = JSON.parse(JSON.stringify(p_data));
      let sProp = p_type === 'slope' ? 'slopeData' :
        p_type === 'output' ? 'outputData' :
        p_type === 'userT' ? 'userTrendsData' : 'userTrendsDataByMethods';

      if (!this[sProp]) {
        this[sProp] = {};
      }

      if (!this['filter']) {
        this['filter'] = {};
      }
      this[sProp][p_tabName] = p_data;
      this['filter'][p_tabName] = filter;

      if (p_type === 'whole_data_empty') {
        this['slopeData'] = this['slopeData'] ? {
          ...this['slopeData'],
          [p_tabName]: {}
        } : {
          [p_tabName]: {}
        };
        this['outputData'] = this['outputData'] ? {
          ...this['outputData'],
          [p_tabName]: {}
        } : {
          [p_tabName]: {}
        };
        this['userTrendsData'] = this['userTrendsData'] ? {
          ...this['userTrendsData'],
          [p_tabName]: {}
        } : {
          [p_tabName]: {}
        };
        this['userTrendsDataByMethods'] = this['userTrendsDataByMethods'] ? {
          ...this['userTrendsDataByMethods'],
          [p_tabName]: {}
        } : {
          [p_tabName]: {}
        };
        this['filter'] = this['filter'] ? {
          ...this['filter'],
          [p_tabName]: filter
        } : {
          [p_tabName]: filter
        };

      }
     // console.log(this.outputData)
      let count = (this.categoryData.emu['Commodities_Client']['dataOnContraceptive'] == 'Yes' || 0) +
        (this.categoryData.emu['Commodities_Facilities']['dataOnContraceptive'] == 'Yes' || 0) +
        (this.categoryData.emu['Visits']['dataOnContraceptive'] == 'Yes' || 0) +
        (this.categoryData.emu['User']['dataOnContraceptive'] == 'Yes' || 0)

      if (Object.keys(this[sProp]).length === count) {
        this.bShowEmu = true;
      }
    },
    showAlert() {
      this.$swal({
        text: this.$i18n.t('somethingwentwrong')
      });
      this.bShowLoader = false;
    }
  },
  data() {
    console.log(this.locationVal)
    return {
      categoryData: null,
      bgData: null,
      reportingRate: {
        "YEbU8pISCrn": "User",
        "kCOYPAFAiQf": "Visits",
        "Ps3V9QcwenT": "Commodities_Facilities",
        "hSrYxoXJCNV": "Commodities_Client"
      },
      repoIds: {

      },
      bAllWomen: false,
      outputData: null,
      bShowEmu: false,
      slopeData: null,
      userTrendsData: null,
      userTrendsDataByMethods: null,
      sStartYear: 2007,
      sRecentYear: '',
      bShowLoader: true,
      location: '',
      options: [],
      value: [],
      defaultExpandLevel: 1,
      category: '',
      activeTab: '',
      filter: null,
      boolVal: true,
      filterYear: '',
      emuYears: null,
      showToolbarOnTablet: false,
      recentActiveTab: '',
      methodMixData: null,
      exportArr: [],
      newLocVal: this.locationVal,
      defaultLevelID: ''
    }
  },
  watch: {
    // locationVal(newVal){
    //   let val = newVal.split("/")
    //   this.value = val[1]
    //   console.log(newVal)
    // },
    filterYear(newVal){
      this.bShowEmu = false;
      this.outputData = null;
      this.slopeData = null;
      this.userTrendsData = null
      this.userTrendsDataByMethods = null;
    },
    bgData(newVal) {
      this.bShowLoader = false;
    },
    value(newVal) {
      this.bShowEmu = false;
      this.outputData = null;
      this.slopeData = null;
      this.userTrendsData = null
      this.userTrendsDataByMethods = null;
    },
    signOffActive(newVal){
      this.bShowEmu = false;
      // this.newSignOff = newVal
      // console.log(this.newSignOff)
      this.outputData = null;
      this.slopeData = null;
      this.userTrendsData = null
      this.userTrendsDataByMethods = null;
    }
  }
};
</script>
<style scoped lang="scss">
.top-date-page-div{
    position: absolute;
    top: 0;
    right: 0;

    span{
          background-color: #2e2e48;
          border-color: #2e2e48;
          font-size: 0.875rem;
          padding: 12px 12px;
        }
    span:hover{
          background-color: #2e2e48;
          border-color: #2e2e48;


        }

}
.newGreen-theme .top-date-page-div{
    position: absolute;
    top: 0;
    right: 0;

    span{
          background-color: #0c5327;
          border-color: #0c5327;
          font-size: 0.875rem;
          padding: 12px 12px;
        }
    span:hover{
          background-color: #0c5327;
          border-color: #0c5327;


        }

}

.newBlack-theme .top-date-page-div{
    position: absolute;
    top: 0;
    right: 0;

    span{
          background-color: #0b0c10;
          border-color: #0b0c10;
          font-size: 0.875rem;
          padding: 12px 12px;
        }
    span:hover{
          background-color: #0b0c10;
          border-color: #0b0c10;


        }

}
</style>
