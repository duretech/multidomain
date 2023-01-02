<template>
  <div class="container-fluid bottom-tabbar" :class="{'active': showToolbarOnTablet}">
    <div class="bottom-tabbar-close" @click="closeToolbar"><i class="far fa-times-circle"></i></div>
      <div class="bottom_toolbar_wrap">
        <form class="input-select-items">
          <div class="form-group pr-3">
            <label class="text-center">{{$t('location')}}</label>
            <treeselect class="form-control" :options="options" :show-count="true" :placeholder="$t('search')" v-model="value" :flat="false" :default-expand-level="defaultExpandLevel" :load-options="loadOptions"/>
          </div>

          <div class="form-group pr-3" v-if="recentActiveTab == 'input'">
            <label class="text-capitalize">{{$t('methods')}}</label>
            <treeselect class="form-control" :options="emuMethods" :disable-branch-nodes="true" size="sm" :show-count="true" placeholder="Search.." v-model="selected" :flat="false"/>
          </div>
          <div class="form-group pr-3" v-if="recentActiveTab != 'input'">
              <label class="text-capitalize">{{$t('methods')}}</label>
              <div class="select-wrapper">
                  <select class="form-control tabbarselect" v-model="calsType" >
                      <option v-for="filter in calTypeOptions" :key="filter.value" :value="filter.value">{{filter.text}}</option>
                  </select>
              </div>
          </div>
          <div  class="form-group pr-3" v-if="autoSaveSource">
             <!-- <label class="text-uppercase"></label> -->
            <b-button v-if="showAutoButton && autoSaveSource" small @click.prevent.stop="generateEmuButtonClick" class="position-relative mt-3" >
              <span class="small" >Generate EMU</span>
                          <!-- <span class="small" v-if="scorecardDataFetching">{{locationFetchedPercent}}%</span>
                          <div class="loaderBackground" v-if="scorecardDataFetching"></div>
                          <span class="small" :class="{ 'ml-2' : scorecardDataFetching }">{{scorecardDataFetching ? $t('scorecardGenerating') : $t('scorecardGenerate')}}</span> -->
             </b-button>
               <b-button small @click.prevent.stop="viewEMU" class="position-relative mt-3 viewemuBtn" v-else-if="autoSaveSource">
                <span class="small"> {{$t('viewEmu')}}</span>
              </b-button>
          </div>
        </form>
      </div>
      <b-modal v-model="generateEMUPopup" hide-footer centered size="sm" :title="$t('location')" no-close-on-backdrop>
        <div class="row">
          <div class="col-12">
            <treeselect
              name="Locations"
              :multiple="true"
              :options="options"
              :limit="3"
              :flat="true"
              :load-options="loadOptions"
              v-model="selectedEMULocation"
              sort-value-by="INDEX"
              :placeholder="$t('select')"
            />
          </div>
          <div class="col-12 mt-4">
            <div class="text-right">
              <b-button small @click.prevent.stop="generateEMU" class="" :disabled="selectedEMULocation.length === 0">
                <span class="small">{{$t('ok')}}</span>
              </b-button>
            
            </div>
          </div>
        </div>
      </b-modal>
       <b-modal v-model="viewEMUPopup" hide-footer centered size="xl" :title="EMU" no-close-on-backdrop>
        <div class="row">
          <!-- <div class="col-4"> -->
            <!-- <div v-if="scorecardLocation" class="mr-4 small">
              <strong>{{$t('location')}}: </strong><strong>{{scorecardLocation}}</strong>
            </div>
            <div v-if="scorecardPeriod" class="mr-4 small">
              <strong>{{$t('period')}}: </strong><strong>{{scorecardPeriod}}</strong>
            </div> -->
          <!-- </div> -->
          <!-- <div class="col-4">

          </div> -->
          <div class="col-8">
            <div class="d-flex justify-content-end pb-3 text-right">
              <div class="small w-50">
                <treeselect
                  name="Locations"
                  :multiple="true"
                  :options="options"
                  :limit="3"
                  :flat="true"
                  :load-options="loadOptions"
                  v-model="selectedEMULocation"
                  sort-value-by="INDEX"
                  :placeholder="$t('select')"
                />
              </div>
              <b-button small @click.prevent.stop="generateEMU" class="position-relative mx-4" :disabled="selectedEMULocation.length === 0">
                <span class="small">Regenerate EMU</span>
              </b-button>
              <!-- <download-csv class="btn btn-secondary" :data="scorecardItemsDownload">
                <span class="small">
                  <i class="fa fa-download mr-2"></i>
                  CSV
                </span>
              </download-csv> -->
            </div>
          </div>
          <div class="col-3 offset-9">
            <div class="text-right small pb-3">
              <input type="text" class="form-control" id="inputScorecardSearch"
              :placeholder="$t('search')" v-model="emuSearch">
            </div>
          </div>
          <div class="col-12">
            <b-table head-variant="light" responsive sticky-header bordered hover :items="emuDataFiltered" :fields="emuFields" show-empty :empty-text="$t('no_data_to_display')">
              <!-- <template v-slot:cell(show_details)="row">
                <b-form-checkbox v-model="row.detailsShowing" @change="row.toggleDetails">
                </b-form-checkbox>
              </template> -->
              <template >
                <b-card>
                  <b-table head-variant="light" responsive hover bordered :items="emuItems"></b-table>
                </b-card>
              </template>
              <!-- <template #table-caption>
                <span v-if="scorecardLocation" class="mr-4 small">
                  <strong>{{$t('location')}}:: </strong><strong>{{scorecardLocation}}</strong>
                </span>
                <span v-if="scorecardPeriod" class="mr-4 small">
                  <strong>{{$t('period')}}:: </strong><strong>{{scorecardPeriod}}</strong>
                </span>
              </template> -->
            </b-table>
          </div>
        </div>
      </b-modal>
  </div>
</template>
<script>
import service from '@/service'
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import loadLocChildMixin from "@/helpers/LoadLocationChildMixin";
export default {
  props: ["generateFlag","locationValue", "methods", "defaultMethod", 'showToolbarOnTablet', 'recentActiveTab', 'locKey', 'calType','autoSaveSource','getActiveTab'],
  components: {
    Treeselect
  },
  mixins: [loadLocChildMixin],
  data() {
    return {
      showAutoButton:false,
      EMU:"EMU",
      emuTableData:'',
      emuSearch:'',
      viewEMUPopup:false,
      generateEMUPopup :false,
      emuFields : [],
      emuItems : [],
      selectedEMULocation: [],
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
      firstTime: true,
      selected: this.defaultMethod,
      emuMethods: this.methods,
      calsType: this.calType,
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
    }
  },
  watch: {
    getActiveTab(tab){
      if(tab)
       this.showTable();
    },
    generateFlag(newVal){
      if(newVal){
      this.generateEMUTable();
      console.log("generateFlag",newVal);
      this.selectedEMULocation=[];
      this.showAutoButton = false;
      this.generateEMUPopup = false;
      }
    },
    recentActiveTab(vale){
      //console.log(vale)
    },
    locationValue(newValue) {
      if (newValue) {
        this.value = newValue
      }
      this.selected = this.defaultMethod
    },
    value(newValue) {
      if (!this.firstTime) {
          this.$emit('location', newValue)
      } else {
          this.firstTime = false
      }
    },
    selected(newValue) {
      if(newValue){
        this.selected = newValue
        this.$emit('emuMethod', newValue)
      }
      console.log(this.selected)
    },
    methods(newValue) {
      this.emuMethods = newValue
      this.selected = this.emuMethods[0]['children'][0]['id']
    },
    calsType(newValue){
        this.$emit('calsType', newValue)
    },
    calType(newVal){
      this.calsType = newVal
    }
  },
  methods: {
    generateEmuButtonClick(){
      this.generateEMUPopup  = true
    },
    viewEMU(){
      this.viewEMUPopup = true
    },
    generateEMU(){
      this.$emit("emuLocations",this.selectedEMULocation)
    },
    closeToolbar() {
      this.$emit("closeToolbar")
    },
    getConfigAccess() {
      this.options = JSON.parse(JSON.stringify(this.$store.getters.getLocationList))
      this.value = this.locationValue
    },
    showTable(){
       if(this.emuTableData && this.emuTableData[this.getActiveTab]){
          let innerdata = this.emuTableData[this.getActiveTab];
          Object.keys(innerdata).forEach(locId => {
            let item= {
              [this.$i18n.t('location')]:innerdata[locId]['name'],
              "EMU Generated on": innerdata[locId]['time'] ? innerdata[locId]['time'] :"Some error occured"
            }
            this.emuItems.push(item);
          })
        }
    },
    generateEMUTable(){
      this.emuFields = []
      this.emuItems = []

      this.emuFields = [
        {
          key: this.$i18n.t('location'),
          sortable: true,
          isRowHeader: true,
          variant: 'secondary'
        },
        {
          key: 'EMU Generated on',
          sortable: true,
          isRowHeader: true
        }
      ]
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
        let emuData = res.data
        this.emuTableData = emuData;
        this.showTable();
       
        //console.log(emuData,this.getActiveTab,emuData[this.getActiveTab]);
      }).catch(res =>{
        this.showAutoButton=true;
      })
    }
  },
  computed: {
    emuDataFiltered : function () {
      let filterdData = this.emuItems.filter(s => s[this.$i18n.t('location')].toLowerCase().includes(this.emuSearch))
      return filterdData;
    }
  },
  mounted() {
    this.getConfigAccess()
    this.generateEMUTable();
  }
}

</script>
<style lang="scss" scoped>

.form-control:disabled {
  opacity: 0.8 !important;
}
.indicatortext{
  display:flex;
}
</style>
