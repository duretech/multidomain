<template>
<div>
  <div class="container-fluid m-t-20px px-0">
    <loader v-if="bShowLoader" />
    <div class="filter-btn" @click.prevent="showToolbarOnTablet = true"><a href="#" id="tabbar-expand"><i class="fas fa-filter"></i></a></div>
    <div class="row">
      <div class="col-lg-12">
        <ul class="nav nav-pills mb-3" id="benchmarking-sub-tab" role="tablist">
          <li class="nav-item fs-19-1920" v-if="categoryData['Commodities_Client'] && categoryData['Commodities_Client']['disableChart'] == false">
            <a :class="{active : activeTab === 'Commodities_Client'}" class="nav-link analytical-method-link" id="benchmarking-comclient-tab" data-toggle="pill" href="#benchmarking-comclient" role="tab" aria-controls="benchmarking-comclient" aria-selected="true"
             @click="getRecentActiveTab('client')">{{$t('commodities_Distributed_to_Clients')}}</a>
          </li>
          <li class="nav-item fs-19-1920" v-if="categoryData['Commodities_Facilities'] && categoryData['Commodities_Facilities']['disableChart'] == false">
            <a :class="{active : activeTab === 'Commodities_Facilities'}" class="nav-link analytical-method-link" id="benchmarking-comfacilities-tab" data-toggle="pill" href="#benchmarking-comfacilities" role="tab" aria-controls="benchmarking-comfacilities" aria-selected="false"
             @click="getRecentActiveTab('facilities')">{{$t('commodities_Distributed_to_Facilities')}}</a>
          </li>
          <li class="nav-item fs-19-1920" v-if="categoryData['Visits'] && categoryData['Visits']['disableChart'] == false">
            <a :class="{active : activeTab === 'Visits'}" class="nav-link analytical-method-link" id="benchmarking-fpvisits-tab" data-toggle="pill" href="#benchmarking-fpvisits" role="tab" aria-controls="benchmarking-fpvisits" aria-selected="false"
             @click="getRecentActiveTab('visits')">{{$t('fp_visits')}}</a>
          </li>
          <li class="nav-item fs-19-1920" v-if="categoryData['User'] && categoryData['User']['disableChart'] == false">
            <a :class="{active : activeTab === 'User'}" class="nav-link analytical-method-link" id="benchmarking-fpusers-tab" data-toggle="pill" href="#benchmarking-fpusers" role="tab" aria-controls="benchmarking-fpusers" aria-selected="false"
              @click="getRecentActiveTab('users')">{{$t('fp_users')}}</a>
          </li>
          <!-- <li class="nav-item">
                        <a class="nav-link analytical-method-link" id="benchmarking-fpemuoutput-tab" data-toggle="pill" href="#benchmarking-fpemuoutput" role="tab" aria-controls="benchmarking-fpemuoutput" aria-selected="false">EMU Output</a>
                    </li> -->
        </ul>
      </div>
      <div class="col-lg-12">
        <div class="tab-content" id="benchmarking-sub-tabContent">
          <div :class="{active : activeTab === 'Commodities_Client', show: activeTab === 'Commodities_Client'}"  class="tab-pane fade" id="benchmarking-comclient" role="tabpanel" aria-labelledby="benchmarking-comclient-tab">
            <div
              class="summaryTabSection fs-17-1920"
              v-if="categoryData['Commodities_Client'] && categoryData['Commodities_Client']['categoryInfo']"
            >
              <div class="row">
                <div class="col-12">
                  <button
                    class="btn text-white summaryBtn fs-19-1920"
                    data-toggle="collapse"
                    data-target="#clientSummaryTab"
                    @click="activeSummary('client')"
                    :class="{active: clientActive}"
                  >
                   Summary
                    <i class="fa fa-angle-double-right" aria-hidden="true"></i>
                  </button>
                  <div
                    id="clientSummaryTab"
                    class="collapse card px-3 pt-3 mb-3 summary_Card fs-17-1920"
                    v-html="
                      categoryData['Commodities_Client']['categoryInfo']
                    "
                  ></div>
                </div>
              </div>
            </div>
            <benchMarkingInpOutp v-if="categoryData['Commodities_Client'] && population &&
            categoryData['Commodities_Client']['disableChart'] == false"
            :data="categoryData['Commodities_Client']" :bAllWomen="bAllWomen" key="Commodities_Client"
            tabName="commoditiesToClients" tableName="Commodities Client"
              :source="$i18n.t('commodities_Distributed_to_Clients')"
              :startYear="sStartYear" :endYear="sRecentYear" :population="population"
              :location="value[0]" :locationName="locationName" :setData="getDataFromChild"
              @methodFilter="methodFilterVal" :method="methodSelected"
              @activeTabName="getActiveTab" ref="comclientref" :signOffActive="signOffActive"
              exportPosition=1 @sendEMUCharts="getEMUCharts" contName="Commodities_Client"
              :userDetails="userDetails" :dqrResponse="dqrResponse" :appResponse="appResponse"
              :globalResponse="globalResponse" @dataUpdated="updatedFlag" :caltype="caltype"
              @saveEMUFinal="saveEMUFinal" />
          </div>
          <div :class="{active : activeTab === 'Commodities_Facilities', show: activeTab === 'Commodities_Facilities'}" class="tab-pane fade" id="benchmarking-comfacilities" role="tabpanel" aria-labelledby="benchmarking-comfacilities-tab">
            <div
              class="summaryTabSection fs-17-1920"
              v-if="categoryData['Commodities_Facilities'] && categoryData['Commodities_Facilities']['categoryInfo']"
            >
              <div class="row">
                <div class="col-12">
                  <button
                    class="btn text-white summaryBtn"
                    data-toggle="collapse"
                    data-target="#facSummaryTab"
                    @click="activeSummary('fac')"
                    :class="{active: facActive}"
                  >
                   Summary
                    <i class="fa fa-angle-double-right" aria-hidden="true"></i>
                  </button>
                  <div
                    id="facSummaryTab"
                    class="collapse card px-3 pt-3 mb-3 summary_Card fs-17-1920"
                    v-html="
                      categoryData['Commodities_Facilities']['categoryInfo']
                    "
                  ></div>
                </div>
              </div>
            </div>
            <benchMarkingInpOutp v-if="categoryData['Commodities_Facilities'] && population &&
            categoryData['Commodities_Facilities']['disableChart'] == false"
            :data="categoryData['Commodities_Facilities']" :bAllWomen="bAllWomen" key="Commodities_Facilities"
            tabName="commoditiesToFacilities" tableName="Commodities Facilities"
              :source="$i18n.t('commodities_Distributed_to_Facilities')"
              :startYear="sStartYear" :endYear="sRecentYear" :population="population"
              :location="value[0]" :locationName="locationName" :setData="getDataFromChild"
              @methodFilter="methodFilterVal" :method="methodSelected"
              @activeTabName="getActiveTab" ref="comfacilityref" :signOffActive="signOffActive"
              exportPosition=2 @sendEMUCharts="getEMUCharts" contName="Commodities_Facilities"
              :userDetails="userDetails" :dqrResponse="dqrResponse" :appResponse="appResponse"
              :globalResponse="globalResponse" @dataUpdated="updatedFlag" :caltype="caltype"
              @saveEMUFinal="saveEMUFinal" />
          </div>
          <div :class="{active : activeTab === 'Visits', show: activeTab === 'Visits'}" class="tab-pane fade" id="benchmarking-fpvisits" role="tabpanel" aria-labelledby="benchmarking-fpvisits-tab">
            <div
              class="summaryTabSection fs-17-1920"
              v-if="categoryData['Visits'] && categoryData['Visits']['categoryInfo']"
            >
              <div class="row">
                <div class="col-12">
                  <button
                    class="btn text-white summaryBtn fs-19-1920"
                    data-toggle="collapse"
                    data-target="#visitsSummaryTab"
                    @click="activeSummary('visit')"
                    :class="{active: visitsActive}"
                  >
                   Summary
                    <i class="fa fa-angle-double-right" aria-hidden="true"></i>
                  </button>
                  <div
                    id="visitsSummaryTab"
                    class="collapse card px-3 pt-3 mb-3 summary_Card fs-17-1920"
                    v-html="categoryData['Visits']['categoryInfo']"
                  ></div>
                </div>
              </div>
            </div>
            <benchMarkingInpOutp v-if="categoryData['Visits'] && population &&
            categoryData['Visits']['disableChart'] == false" :data="categoryData['Visits']"
            :bAllWomen="bAllWomen" tabName="fp_visits" tableName="Visits" key="Visits"
            :source="$i18n.t('fp_visits')" :startYear="sStartYear" :endYear="sRecentYear"
              :population="population" :location="value[0]" :locationName="locationName"
              :setData="getDataFromChild" @methodFilter="methodFilterVal" :method="methodSelected"
              @activeTabName="getActiveTab" ref="visitsref" :signOffActive="signOffActive"
              exportPosition=3 @sendEMUCharts="getEMUCharts" contName="Visits"
              :userDetails="userDetails" :dqrResponse="dqrResponse" :appResponse="appResponse"
              :globalResponse="globalResponse" @dataUpdated="updatedFlag" :caltype="caltype"
              @saveEMUFinal="saveEMUFinal" />
          </div>
          <div :class="{active : activeTab === 'User', show: activeTab === 'User'}" class="tab-pane fade" id="benchmarking-fpusers" role="tabpanel" aria-labelledby="benchmarking-fpusers-tab">
            <div
              class="summaryTabSection fs-17-1920"
              v-if="categoryData['User'] && categoryData['User']['categoryInfo']"
            >
              <div class="row">
                <div class="col-12">
                  <button
                    class="btn text-white summaryBtn fs-19-1920"
                    data-toggle="collapse"
                    data-target="#userSummaryTab"
                    @click="activeSummary('user')"
                    :class="{active: userActive}"
                  >
                   Summary
                    <i class="fa fa-angle-double-right" aria-hidden="true"></i>
                  </button>
                  <div
                    id="userSummaryTab"
                    class="collapse card px-3 pt-3 mb-3 summary_Card fs-17-1920"
                    v-html="categoryData['User']['categoryInfo']"
                  ></div>
                </div>
              </div>
            </div>
            <benchMarkingInpOutp v-if="categoryData['User'] && population &&
            categoryData['User']['disableChart'] == false" :data="categoryData['User']"
            :bAllWomen="bAllWomen" tabName="fp_users" tableName="Users" :source="$i18n.t('fp_users')"
            :startYear="sStartYear" :endYear="sRecentYear" key="User"
              :population="population" :location="value[0]" :locationName="locationName"
              :setData="getDataFromChild" @methodFilter="methodFilterVal" :method="methodSelected"
              @activeTabName="getActiveTab" ref="usersref" :signOffActive="signOffActive"
              exportPosition=4 @sendEMUCharts="getEMUCharts" contName="User"
              :userDetails="userDetails" :dqrResponse="dqrResponse" :appResponse="appResponse"
              :globalResponse="globalResponse" @dataUpdated="updatedFlag" :caltype="caltype"
              @saveEMUFinal="saveEMUFinal"
              />
          </div>
        </div>
      </div>
    </div>
  </div>
  <autoSaveEMU v-if="getEMULocations.length" 
  :locationVal="emuLoc"
  :userDetails="userDetails"
  :dqrResponse="dqrResponse"
  :appResponse="appResponse"
  :globalResponse="globalResponse"
  @saveEMUAuto="saveEMUAuto"
  @errorOccured="errorOccured"
  :method="methodSelected"
  @popError="popError"
  />
  <toolbarComponent v-if="value && emuMethods && defaultMethod" :locKey="locKey"
  :recentActiveTab="recentActiveTab" :defaultMethod="defaultMethod" :locationValue="value[0]"
  @location="getLocation" @emuMethod="getMethod" :methods="emuMethods"  @closeToolbar="closeToolbar"
  :showToolbarOnTablet="showToolbarOnTablet"  @calsType="getCalType" :calType="caltype" 
  @emuLocations="generateEMU" :generateFlag="generateFlag" :autoSaveSource="autoSaveSource" :getActiveTab="activeTab"/>
</div>
</template>

<script>
import benchMarkingInpOutp from './benchMarkingInpOutp';
import autoSaveEMU from '../autoSaveEMU/benchmarkTab.vue';
import service from '@/service';
import dataM from './dataMassaging';
import toolbarComponent from './toolbarComponent.vue';
import { decompress } from "compress-json";
export default {
  components: {
    benchMarkingInpOutp,
    autoSaveEMU,
    toolbarComponent
  },
  props: ['locationVal', 'signOffActive', 'userDetails', 'dqrResponse', 'appResponse', 'globalResponse', 'tabName'],
  mounted() {
    this.getActiveTab('input')
    this.$gtag.event('tab_view', {
      'value': this.tabName
    })
  },
  created(){
    this.getConfigAccess(false);
  },
  updated() {
  },
  methods: {
    generateEMU(locations){
      this.$store.state.loading = true;
      this.generateAutoEMU = true
      this.getEMULocations = locations;
      this.locIndex =  this.locIndex * 1 + 1
      if (this.locIndex < this.getEMULocations.length && this.getEMULocations.length > 0) {
        this.emuLoc = this.getEMULocations[this.locIndex];
      }
    },
    getCalType(val){
      this.caltype = val
    },
    activeSummary(tab){
      if(tab == 'client'){
        this.clientActive = !this.clientActive
      }else if(tab == 'fac'){
        this.facActive = !this.facActive
      }else if(tab == 'visit'){
        this.visitsActive = !this.visitsActive
      }else if(tab == 'user'){
        this.userActive = !this.userActive
      }else{
        this.emuActive = !this.emuActive
      }

    },
    updatedFlag(data){
      if(data == true){
         this.bshowLoader = false;
      }
    },
    getEMUCharts(exportArr = []){

      let newExport = JSON.parse(JSON.stringify(exportArr))
      newExport = newExport.map(obj=>{
        if(obj.cardKey === 'key1' || obj.cardKey === 'key2' || obj.cardKey === 'key8' || obj.cardKey === 'key9' || obj.cardKey === 'key15' || obj.cardKey === 'key16' || obj.cardKey === 'key22' || obj.cardKey === 'key23'){
          return {...obj, data: obj.data.filter(ele => ele.name.includes(this.methodSelected))}
        }else{
          return obj
        }
      })
      newExport.forEach(obj => {
        let isObj = this.exportArr.find(e => e.cardKey === obj.cardKey)
        if(isObj) {
          let foundIndex = this.exportArr.findIndex(e => e.cardKey === obj.cardKey);
          this.exportArr[foundIndex] = obj
        } else {
          this.exportArr.push(obj)
        }
      })
    },
    saveEMUFinal(val){
      if(val){
        this.generateFlag = false;
        let currentTime = this.$moment(new Date()).format('DD/MM/YYYY h:mm:ss');
        let locale = this.$i18n.locale,
          key = `autoSaveEMU_${locale}`;
        service.getIndividualOrganisation(val.split('/')[1]).then(keyOrg => {
          if (!settings.country) {
            let appId = this.$store.state.appId ? this.$store.state.appId : "",
              appUserId = this.$store.state.appUserId
                ? this.$store.state.appUserId
                : "";
            if (appId && appUserId) {
              key = `${appUserId}_${appId}_autoSaveEMU_${locale}`;
            } else {
              this.showLocalStorageError();
              return;
            }
          }
          service.getSavedConfig(key).then((res) => {
            let resp = res.data
            if(!resp[this.activeTab])
              resp[this.activeTab]={}
            resp[this.activeTab][val] = {"name":keyOrg.data.displayName ,"time":currentTime}
            let response = service.updateConfig(resp, key)
            response.then(response => {
              this.generateFlag = true;
            })
          })
        });
      }
    },
    saveEMUAuto(val){
      this.generateFlag = false;
      let currentTime = this.$moment(new Date()).format('DD/MM/YYYY h:mm:ss');
      if(val){
        console.log(val);
        service.getIndividualOrganisation(val.split('/')[1]).then(key => {
          // console.log(key)
          let isObj = this.emuFetched.find(d => d === val)
          if(!this.saveObj[this.activeTab]){
            this.saveObj[this.activeTab]={}
          }
          if(isObj) {
            let foundIndex = this.emuFetched.findIndex(d => d === val);
            this.emuFetched[foundIndex] = val
            this.saveObj[this.activeTab][val]= {"name":key.data.displayName ,"time":currentTime}
          } else {
            this.emuFetched.push(val)
            this.saveObj[this.activeTab][val]= {"name":key.data.displayName ,"time":currentTime}
          }
          if(this.emuFetched.length == this.getEMULocations.length){
            this.updateEMU(this.saveObj);
          }
        })
      }
    },
    errorOccured(val){
      let currentTime = this.$moment(new Date()).format('DD/MM/YYYY h:mm:ss');
      this.generateFlag = false;
      if(val){
        service.getIndividualOrganisation(val.split('/')[1]).then(key => {
          // console.log(key)
          let isObj = this.emuFetched.find(d => d === val)
          if(!this.saveObj[this.activeTab]){
            this.saveObj[this.activeTab]={}
          }
          if(isObj) {
            let foundIndex = this.emuFetched.findIndex(d => d === val);
            this.emuFetched[foundIndex] = val
            this.saveObj[this.activeTab][val]= {"name":key.data.displayName ,"time":"Some error occured - "+currentTime}
          } else {
            this.emuFetched.push(val)
            this.saveObj[this.activeTab][val]= {"name":key.data.displayName ,"time":"Some error occured - "+currentTime}
          }
          if(this.emuFetched.length == this.getEMULocations.length){
            this.updateEMU(this.saveObj);
          }
        })
      }
    },
    popError(val){
      this.generateFlag = false;
      if(val){
        service.getIndividualOrganisation(val.split('/')[1]).then(key => {
          // console.log(key)
          let isObj = this.emuFetched.find(d => d === val)
          if(!this.saveObj[this.activeTab]){
            this.saveObj[this.activeTab]={}
          }
          if(isObj) {
            let foundIndex = this.emuFetched.findIndex(d => d === val);
            this.emuFetched[foundIndex] = val
            this.saveObj[this.activeTab][val]= {"name":key.data.displayName ,"time":"Population data not found - "+currentTime}
          } else {
            this.emuFetched.push(val)
            this.saveObj[this.activeTab][val]= {"name":key.data.displayName ,"time":"Population data not found - "+currentTime}
          }
          if(this.emuFetched.length == this.getEMULocations.length){
            this.updateEMU(this.saveObj);
          }
        })
      }
    },
    updateEMU(saveObj){
      let locale = this.$i18n.locale,
        key = `autoSaveEMU_${locale}`;
      if (!settings.country) {
        let appId = this.$store.state.appId ? this.$store.state.appId : "",
          appUserId = this.$store.state.appUserId
            ? this.$store.state.appUserId
            : "";
        if (appId && appUserId) {
          key = `${appUserId}_${appId}_autoSaveEMU_${locale}`;
        } else {
          this.showLocalStorageError();
          return;
        }
      }
      service.getSavedConfig(key).then((res) => {
        let resp = res.data
        Object.keys(saveObj).forEach((methods)=>{ 
          Object.keys(saveObj[methods]).forEach(keys => {
            resp[methods][keys] = saveObj[methods][keys]
          })
        })
          let response = service.updateConfig(resp, key)
        response.then(response => {
          this.resetAutoSaveEMU()
          this.generateFlag = true;
          this.$store.state.loading = false;
        
        })
      }).catch(() => {
        let response = service.saveConfig(saveObj, key)
        response.then(response => {
          if (response.data.status === "OK") {
            this.resetAutoSaveEMU()
            this.generateFlag = true;
            this.$store.state.loading = false;
          } else {
            console.log("AutosaveEMU Failed!")
            return;
          }
        });
      })
    },
    resetAutoSaveEMU(){
      this.getEMULocations = []
      this.emuFetched  = []
       this.locIndex = -1
      this.generateAutoEMU =  false
      this.emuLoc = ''
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
          title: this.$i18n.t('export_options'),
          html: '<div><input id="fileName" class="swal2-input" placeholder="'+this.$i18n.t('fileName_placeholder')+'" value="EMU Monthly" tabindex="-1"/></div>' +
            '<div class="pt-3"><div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="showLegends" value="show"><label class="custom-control-label" for="showLegends">'+this.$i18n.t('legends')+'</label></div>' +
            '<div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="showValues" value="show"><label class="custom-control-label" for="showValues">'+this.$i18n.t('values')+'</label></div>' +
            '<div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="showXAxis" checked value="show"><label class="custom-control-label" for="showXAxis">'+this.$i18n.t('x-axis')+'</label></div>' +
            '<div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="showYAxis" checked value="show"><label class="custom-control-label" for="showYAxis">'+this.$i18n.t('y-axis')+'</label></div></div>',
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
          let period = this.$moment(this.period, 'YYYYMM').format("MMM YYYY")
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
                    text: this.$i18n.t('period') + " :- " + period,
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

              for (let index = 0; index < this.exportArr.length; index++) {
                const element = this.exportArr[index];

                slide = pptx.addSlide('MASTER_SLIDE');
                slide.addText(element.source+' - '+element.title, {
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

                if(element.cardKey != 'key7' && element.cardKey != 'key14' && element.cardKey != 'key21' && element.cardKey != 'key28'){
                  if(element.data.length > 0){
                    element.data.forEach(e => {
                      if (e.color) {
                        chartColors.push(e.color.split('#')[1])
                      } else {
                        chartColors.push((0xFFFFFFFF - Math.random() * 0xFFFFFFFF).toString(16).substr(0, 6))
                      }
                      let name = e.name,
                        labels = element.categories,
                        values = e.data

                        chartData.push({
                          name,
                          labels,
                          values
                        })

                    })

                    let type = element.type

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
                    } else {
                      type = pptx.ChartType.bar
                      if (element.plotOptions && element.plotOptions.series && element.plotOptions.series.stacking === 'normal') {
                        options['barDir'] = 'col'
                        options['barGrouping'] = 'stacked'
                      }
                    }
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

                }else{

                  let tableHeader = element.headers, rows = []

                  rows.push(tableHeader)
                  if(element.data.length > 0){
                    element.data.forEach((item) => {

                      let innerRow = []
                      item.forEach((itemInner) => {
                        innerRow.push({text: itemInner})
                      });
                      rows.push(innerRow)
                    });
                  }else{
                    let innerRow = [{text: this.$i18n.t('no_data_to_display'), align: 'center'}]
                    rows.push(innerRow)
                  }
                  pptx.addSection({ title: 'Tables: Auto-Paging' });
                  slide.addTable( rows, { x:0.5, y: 1, w:12.3, rowH:0.5, fill:'F5F5F5', border:{pt:1, color:'FFFFFF'}, align:'center', valign:'middle', fontSize: 16, bold: true, autoPage:true, newSlideStartY:1 } );
                }

              }
            }
            pptx.writeFile({fileName: formValues[0]});
            console.log("File exported...")
          })
        } else {
          //this.isExport = false
        }
    },
    getActiveTab (value) {
      this.recentActiveTab = value
    },
    getRecentActiveTab(tab){
      if(tab == 'client'){
        this.recentActiveTab = this.$refs.comclientref.activetab
        this.activeTab = 'Commodities_Client'
      }else if(tab == 'facilities'){
        this.recentActiveTab = this.$refs.comfacilityref.activetab
        this.activeTab = 'Commodities_Facilities'
      }else if(tab == 'visits'){
        this.recentActiveTab = this.$refs.visitsref.activetab
        this.activeTab = 'Visits'
      }else if(tab == 'users'){
        this.recentActiveTab = this.$refs.usersref.activetab
        this.activeTab = 'User'
      }else{
        this.recentActiveTab = tab
      }
      let obj = this.sourceFilter.find(o => o.name === this.activeTab);
      if(obj){
      this.emuMethods = obj.value
      this.defaultMethod = obj.value[0]['children'][0]['id']
      this.methodSelected = obj.value[0]['children'][0]['id']
      }
      this.autoSaveSource = this.dqrResponse.emu_monthly.Background_Data['autoSaveEMU'] == this.activeTab
    },
    closeToolbar() {
      this.showToolbarOnTablet = false
    },
    getLocation(newLocation) {
      this.caltype='method'
      this.value = [newLocation]
      this.newLocVal = newLocation
      let obj = this.sourceFilter.find(o => o.name === this.activeTab);
      this.emuMethods = obj.value
      this.defaultMethod = obj.value[0]['children'][0]['id']
      this.methodSelected = obj.value[0]['children'][0]['id']
      this.locKey++;
      this.getConfigAccess(true)
    },
    methodFilterVal (value) {
      this.sourceFilter.push(value)
      let obj = this.sourceFilter.find(o => o.name === this.activeTab);
      if(obj){
        this.emuMethods = obj.value
        this.defaultMethod = obj.value[0]['children'][0]['id']
        this.methodSelected = obj.value[0]['children'][0]['id']
        this.locKey++;
      }
    },
    getMethod(value){
      this.locKey++;
      this.methodSelected = value
    },
    /**
     * This is get banchmarking configuration.
     * Usage: `getConfigAccess()`
     * @param 'adBenchmarkModule' which is key for benchmarking config
     * @return {Object} categoryData
     */
    async getConfigAccess(locChange) {
      let locationID = this.newLocVal.split('/')[1]
      if (this.userDetails.dataViewOrganisationUnits[0].level > this.appResponse.defaultLevelID) {
        locationID = this.userDetails.dataViewOrganisationUnits[0].id
      }
      console.log("this.dqrResponse", this.dqrResponse)
      let sStartYear = this.appResponse.startingYear ? this.appResponse.startingYear : '2007';
      this.categoryData = this.dqrResponse.emu_monthly;
      let lYear = this.categoryData['Background_Data']['SSDataRecentYear']? this.categoryData['Background_Data']['SSDataRecentYear']:(sStartYear * 1) + 13;
      let sYear = dataM.getYearFormated(sStartYear, (lYear*1)+1);
      this.value = [this.newLocVal]
      this.locationValue = this.newLocVal

      let aBackgorundIndicators = this.categoryData['Background_Data']['backgroundIndicators'] ? this.categoryData['Background_Data']['backgroundIndicators'] : [];
      let aSelectedDEs = [],
        sSelectedDEs = '';
      aBackgorundIndicators[0].subIndicators.forEach(ind => {
        ind.selectedDE.forEach(de => {
          aSelectedDEs.push(de.id)
        });
      });
      sSelectedDEs = aSelectedDEs.join(';')
      if(!locChange){
        this.switchCategory(this.categoryData)
      }

       this.autoSaveSource = this.dqrResponse.emu_monthly.Background_Data['autoSaveEMU'] == this.activeTab
      let fromDataStore  = this.categoryData['Background_Data']['bgDataSource']? this.categoryData['Background_Data']['bgDataSource']:false;    
      let innerDataStore = this.categoryData['Background_Data']['backgroundIndicators'][0]['bgDataSource'] ? this.categoryData['Background_Data']['backgroundIndicators'][0]['bgDataSource'] : fromDataStore;
      if(innerDataStore == "Datastore")
      {
        let levelid =  this.newLocVal.split("/")[0];
        let popType = this.categoryData["Background_Data"]["FPWomenPopulation"]?this.categoryData["Background_Data"]["FPWomenPopulation"]:"MWRA";
        popType = popType.toLowerCase();
        let key = `population_${popType}_${levelid}`;
        if (!settings.country) {
          let appId = this.$store.state.appId ? this.$store.state.appId : "",
            appUserId = this.$store.state.appUserId
              ? this.$store.state.appUserId
              : "";
          if (appId && appUserId) {
            key = `population_${popType}_${levelid}`;
          } else {
            this.showLocalStorageError();
            return;
          }
        }
        await service.getSavedConfig(key) .then(async popResp => {
          this.population = {}
          let popResponse = popResp && typeof popResp.data.rows == "string"
              ? {
                  ...popResp.data,
                  rows: decompress(JSON.parse(popResp.data.rows)),
                }
              : popResp.data;
          let newpopResponse = popResponse.rows.filter(arr => arr[2] === locationID)
          newpopResponse.forEach(data => {
            this.population[data[1]] = data[3] * 1
          })
          this.bShowLoader = false;
        })
        .catch(res => {
          console.log(res);
          this.showAlert();
          this.bShowLoader = false;
        })

      } 
      else{
        await service.getAnalyticalIndicatorData(sSelectedDEs, locationID, sYear).then((response) => {
          this.population = {}
          if(response.data.rows.length){
            response.data.rows.forEach(data => {
              this.population[data[1]] = data[3] * 1
            })
          }
          else
          {
            this.$swal({
              text: this.$i18n.t('populationdatanotfound')
            });
            this.bshowLoader = false;
          }
          this.bShowLoader = false;
        }).catch(res => {
          console.log(res)
          this.showAlert();
          this.bShowLoader = false;
        })
      }
      this.sStartYear = sStartYear;
      this.sRecentYear = this.categoryData['Background_Data']['SSDataRecentYear'];
      this.bAllWomen = this.categoryData['Background_Data']['FPWomenPopulation'] === "WRA";
      console.log("Population data from ",innerDataStore);
      console.log(this.population);
    },
    showAlert() {
      console.trace();
      this.$swal({
        text: this.$i18n.t('somethingwentwrong')
      });
      this.bshowLoader = false;
    },
    switchCategory(data) {
      let aSource = {
        Commodities_Client: "EMU :Commodities to clients",
        Visits: "EMU :FP visits",
        Commodities_Facilities: "EMU :Commodities to facilitlity",
        User: "EMU :FP users"
      }
      let preVal = '',
        preValFlag = false
      Object.keys(aSource).forEach(source => {
        if (data[source]['disableChart'] == false && preValFlag == false) {
          preVal = source
          preValFlag = true
        }
      })
      this.activeTab = preVal

    },

    getDataFromChild(p_data) {
      let sTab = p_data.tab,
        sLoc = p_data.loc,
        sType = p_data.type;
      if (!this.dataStore) {
        this.dataStore = {};
      }
      this.dataStore[sTab] = {
        [sLoc]: {
          [sType]: p_data.data
        }
      }
      this.bEMUFlag = !this.bEMUFlag;
    }
  },
  data() {
    return {
      autoSaveSource :'',
      generateFlag : false,
      saveObj:{},
      emuFetched:[],
      locIndex:-1,
      generateAutoEMU: false,
      getEMULocations: [],
      emuLoc:'',
      caltype: 'method',
      categoryData: {},
      bAllWomen: false,
      sStartYear: 2007,
      sRecentYear: '',
      bShowLoader: true,
      population: null,
      locationName: null,
      multiple: false,
      clearable: true,
      searchable: false,
      disabled: false,
      openOnClick: true,
      openOnFocus: false,
      clearOnSelect: true,
      closeOnSelect: false,
      alwaysOpen: true,
      appendToBody: false,
      defaultExpandLevel: 1,
      options: [],
      value: null,
      dataStore: null,
      bEMUFlag: false,
      locationValue: '',
      period: new Date('2017-12'),
      activeTab: '',
      methodSelected: '',
      emuMethods: [],
      defaultMethod: '',
      showToolbarOnTablet: false,
      recentActiveTab: '',
      exportArr: [],
      emuM: [],
      newLocVal: this.locationVal,
      defaultLevelID: '',
      sourceFilter: [],
      clientActive: false,
      facActive: false,
      visitsActive: false,
      userActive: false,
      locKey: 0
    }
  },
  watch: {
    emuFetched: {
      handler(val) {
        if(val.length){
        this.locIndex = this.locIndex * 1 + 1;
        if (this.locIndex < this.getEMULocations.length && this.getEMULocations.length > 0) {
          this.emuLoc = this.getEMULocations[this.locIndex];
        }
        }
      },
    deep: true
    },
    locationVal(newVal){
      let val = newVal.split("/")
      this.value = val[1]
      this.bshowLoader = true;
    },
    methodSelected(newVal){
      this.methodSelected = newVal
    }
  }
};
</script>
<style>
.vue-treeselect__placeholder,
.vue-treeselect__single-value {
  line-height: 1.5;
}
</style>
