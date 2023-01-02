<template>
    <div class="modal-dialog modal-dialog-scrollable modal-xl" role="document">
          <div class="modal-content">
            <div
              class="modal-header"
              style="background-color: rgb(33, 33, 33);
                color: rgb(255, 255, 255);
                padding: 12px;"
            >
              <h5
                class="modal-title"
                id="exampleModalScrollableTitle"
                style="font-size: 1rem;"
              >Background Data</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true" class="color-white">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <download-csv :data="items">
                <a class="btn black-btn pointer-events-none color-white float-right">
                    Export
                </a>
              </download-csv>

              <b-table
                    :items="items"
                    :fields="fields"
                    responsive="sm"
                    >
                    <template v-slot:thead-top="data">
                        <b-tr>
                        <b-th colspan="2"></b-th>
                        <b-th class="text-center">DHS</b-th>
                        <b-th class="text-center">MICS</b-th>
                        <b-th class="text-center">FPET</b-th>
                        <b-th class="text-center">PMA</b-th>
                        <b-th class="text-center">UNPD</b-th>
                        </b-tr>
                    </template>
                </b-table>
                <div class="row dashboardchart-container">
                  <div class="col-lg-12 col-xl-12">
                    <cardComponent
                      v-if="methodMixPieChart"
                      :chartdata="methodMixPieChart"
                      :bShowIcons="true"
                    />
                  </div>
                </div>

                <download-csv :data="bgItems" v-if="bgItems.length > 0">
                  <a class="btn black-btn pointer-events-none color-white float-right m-t-40px">
                      Export
                  </a>
                </download-csv>
                <b-table striped hover :items="bgItems"></b-table>
            </div>
          </div>
        </div>
</template>
<script>
import service from "@/service/service.js";
import dataM from './dataMassaging';
import cardComponent from './cardComponent';
  export default {
    data() {
      return {
        items: [],
        bgItems: [],
        fpItems: [],
        fields: [],
        methodMixPieChart:null,
        methodMixTable: null,
      }
    },
    components:{
      cardComponent
    },
    props: ["bgData", "methodMixData"],
    methods: {
        getBackgroundData() {
                let self = this;
                let locale = this.$i18n.locale, key = `applicationModule_${locale}`, key1=`dqrModule_${locale}`
                if(!settings.country){
                  let appId = this.$store.state.appId ? this.$store.state.appId : "", appUserId = this.$store.state.appUserId ? this.$store.state.appUserId : ""
                  if(appId && appUserId) {
                    key = `${appUserId}_${appId}_applicationModule_${locale}`
                    key1 = `${appUserId}_${appId}_dqrModule_${locale}`
                  } else {
                      this.showLocalStorageError()
                      return;
                  }
                }
                service.getLoggedInUser().then(response => {
                service.getSavedConfig(key).then(appres=>{
                  service.getSavedConfig(key1).then(minres=>{
                    let startYear = appres.data.startingYear;
                    let locationID = appres.data.defaultLocationID;

                    if(response.data.dataViewOrganisationUnits[0].level > appres.data.defaultLevelID) {
                      locationID = [response.data.dataViewOrganisationUnits[0].id]
                    }
                    this.categoryData = minres.data.emu;
                    let womenPop = this.categoryData['Background_Data']['FPWomenPopulation']

                    if(womenPop == 'WRA'){
                      /* this.fields = [
                        'year',
                        { key: "avenir_population AVENIR WRA", label: 'Population : Married Women of Reproductive Age' },
                        { key: "avenir_mcpr_dhs AVENIR WRA", label: "mCPR (AW): DHS" },
                        { key: "avenir_mcpr_mics AVENIR WRA", label: "mCPR (AW): MICS" },
                        { key: "avenir_mcpr_fpet AVENIR WRA", label: "mCPR (AW): FPET" },
                        { key: 'avenir_mcpr_unpd AVENIR WRA', label: "mCPR (AW): UNPD" }
                      ] */
                      this.fields = [
                        'year',
                        { key: "avenir_population avenir wra", label: 'Population : Women of Reproductive Age' },
                        { key: "avenir_mcpr_dhs avenir wra", label: "mCPR (AW): DHS" },
                        { key: "avenir_mcpr_mics avenir wra", label: "mCPR (AW): MICS" },
                        { key: "avenir_mcpr_fpet avenir wra", label: "mCPR (AW): FPET" },
                        { key: "avenir_mcpr_pma avenir wra", label: "mCPR (AW): PMA" },
                        { key: 'avenir_mcpr_unpd avenir wra', label: "mCPR (AW): UNPD" }
                      ]
                    }else if(womenPop == 'MWRA'){
                      this.fields = [
                        'year',
                        { key: "avenir_population avenir mwra", label: 'Population : Married Women of Reproductive Age' },
                        { key: "avenir_mcpr_dhs avenir mwra", label: "mCPR (MW): DHS" },
                        { key: "avenir_mcpr_mics avenir mwra", label: "mCPR (MW): MICS" },
                        { key: "avenir_mcpr_fpet avenir mwra", label: "mCPR (MW): FPET" },
                        { key: "avenir_mcpr_pma avenir mwra", label: "mCPR (MW): PMA" },
                        { key: 'avenir_mcpr_unpd avenir mwra', label: "mCPR (MW): UNPD" }
                      ]
                    }

                    let lastYear = this.categoryData['Background_Data']['SSDataRecentYear'];
                    let years = [];
                    let indId = [];
                    for(let year = startYear; year <= lastYear; year++ ){
                      years.push(Number(year))
                    }
                    this.categoryData['Background_Data']['backgroundIndicators'].forEach((res, i)=>{
                      if(res['name'] != "Method Mix"){
                        res['subIndicators'].forEach(sub=>{
                          if(sub['selectedDE'][0]){
                            indId.push(sub['selectedDE'][0].id);
                          }
                        })
                      }
                    })

                    service.getAnalyticalIndicatorData(indId.join(';'), locationID, years.join(';')).then(response=>{
                      let data = response.data;

                      let oData = {},
                          aRows = data.rows,i,nLen = aRows.length,
                          aDimensions = data.metaData.dimensions.dx,nDimenLen = aDimensions.length,
                          oDataElements = {};
                      for(i = 0 ; i < nLen;i++){
                        let sYear = aRows[i][1],
                            sDx = aRows[i][0],
                            nVal = aRows[i][3],j;
                            oDataElements[sDx] = data.metaData.items[sDx]
                          if(!oData[sYear]){
                            oData[sYear] = {}
                          }
                          for(j = 0; j < nDimenLen;j++){
                            let sTemp = aDimensions[j];
                            if(oData[sYear][sTemp] === undefined){
                              oData[sYear][sTemp] = '';
                              oDataElements[sTemp] = data.metaData.items[sTemp]
                            }
                          }
                            oData[sYear][sDx] =  nVal * 1;
                      }
                      Object.keys(oData).forEach(res=>{
                        let obj = {}
                        obj['year'] = res
                        Object.keys(oData[res]).forEach(data=>{
                          if(oDataElements[data].name.toLowerCase() === "avenir_population avenir wra" || oDataElements[data].name.toLowerCase() === "avenir_population avenir mwra"){
                            obj[oDataElements[data].name.toLowerCase()] = oData[res][data]
                          }else{
                            obj[oDataElements[data].name.toLowerCase()] = oData[res][data] ? oData[res][data]+'%' : '';
                          }
                        });
                        this.items.push(obj);
                      });
                      //console.log(this.items);
                    })
                  })
                }).catch(res=>{
                    console.log(res)
                });
              }).catch(res=>{
                  console.log(res)
              });
            },
            getMethodMixData(){
                let oResponse = {
                    data : [{name:'Methods',colorByPoint: true,data:this.methodMixData}],
                    title : "Comparing Method Mix [ Service Statistics & Survey " + this.bgData.recentYear + "]",
                    source : "",
                    xTitle : "",
                    yTitle : "",
                    type:'pie',
                    dataLable: true,
                    labels: {}
                };
                this.methodMixPieChart = oResponse;

                oResponse.data[0].data.forEach(res=>{
                  this.bgItems.push({method: res.name, percentage: res.y+'%'})
                })
            },

    },
    mounted(){
        this.getBackgroundData()
        this.getMethodMixData()
    }
  }
</script>
