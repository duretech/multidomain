<template>
  <div class="modal-dialog modal-dialog-scrollable modal-xl" role="document">
    <div class="modal-content">
      <div class="modal-header" style="background-color: rgb(33, 33, 33); color: rgb(255, 255, 255); padding: 12px;">
        <h5 class="modal-title" id="exampleModalScrollableTitle" style="font-size: 16px;">{{$t('fpSource')}}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true" class="color-white">&times;</span>
        </button>
      </div>
      <div class="modal-body">


            <download-csv :data="fpItems">
              <a class="btn black-btn pointer-events-none color-white float-right">
                  {{$t('exportbtn')}}
              </a>
            </download-csv>

        <div class="row">
          <div class="col-12">
            <b-table :items="fpItems" :fields="fields" responsive="sm"></b-table>
          </div>
        </div>

        <div class="card">
          <div class="card-header p-10px text-decoration-none">
              <div class="row no-gutters">
                  <div class="col-lg-7 col-md-7 p-t-4px card-comp-title">
                      {{$t('fpSourceSubTitile4')}}
                  </div>
              </div>
          </div>
          <div class="card-body pb-0">
              <div class="row">
                  <div class="col-12" v-if="chartOptions !=  null">
                      <highcharts  :options="chartOptions" ref="inputCharts"></highcharts>
                  </div>
              </div>
          </div>
      </div>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/service/service.js";
export default {
  data() {
    return {
      fpItems: [],
      fields: [],
      chartOptions: null,
      columns: {}
    };
  },
  methods: {
    getFPSourceData() {
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
      service.getSavedConfig(key).then(appres => {
        service.getSavedConfig(key1).then(minres => {
          let startYear = appres.data.startingYear;

          let locationID = appres.data.defaultLocationID
          if(response.data.dataViewOrganisationUnits[0].level > appres.data.defaultLevelID) {
            locationID = [response.data.dataViewOrganisationUnits[0].id]
          }
          this.categoryData = minres.data.emu;
          let lastYear = this.categoryData["Background_Data"][
            "SSDataRecentYear"
          ];
          let years = [];
          for (let year = startYear; year <= lastYear; year++) {
            years.push(Number(year));
          }
          this.fields = [
            "method",
            "submethod",
            { key: "Hospital", label: "Private Hospital/ Clinic Delivery(%)" },
            { key: "NGO", label: "NGO(%)" },
            { key: "Other", label: "Other(%)" },
            { key: "Pharmacy", label: "Pharmacy(%)" },
            { key: "Sector",label: "Government Health Facilities and Home/Community Delivery(%)" },
            { key: "Shop", label: "Shop/ Church/ Friend(%)" }
          ];

          let fpData = this.categoryData.Background_Data.fpSourceIndicators;

          let count = 0,nCount = 0;
          fpData.forEach(res => {
            res.subIndicators.forEach(r => {
              count++;
              let indId = [];
              r.selectedDE.forEach(de => {
                indId.push(de.id);
              });
              if(indId.length > 0){
                nCount++
                service
                  .getAnalyticalIndicatorData(
                    indId.join(";"),
                    locationID,
                    years.join(";")
                  )
                  .then(response => {
                    let data = response.data;
                    let oData = {},
                      aRows = data.rows,
                      i,
                      nLen = aRows.length,
                      aDimensions = data.metaData.dimensions.dx,
                      nDimenLen = aDimensions.length,
                      oDataElements = {};
                    for (i = 0; i < nLen; i++) {
                      let sYear = aRows[i][1],
                        sDx = aRows[i][0],
                        nVal = aRows[i][3],
                        j;
                      oDataElements[sDx] = data.metaData.items[sDx];
                      if (!oData[sYear]) {
                        oData[sYear] = {};
                      }
                      for (j = 0; j < nDimenLen; j++) {
                        let sTemp = aDimensions[j];
                        if (oData[sYear][sTemp] === undefined) {
                          oData[sYear][sTemp] = 0;
                          oDataElements[sTemp] = data.metaData.items[sTemp];
                        }
                      }
                      oData[sYear][sDx] = nVal * 1;
                    }

                    if (Object.keys(oData).length > 0) {
                      let obj = {};
                      Object.keys(oData).forEach(resp => {
                        obj["method"] = res.name;
                        obj["submethod"] = r.name;
                        Object.keys(oData[resp]).forEach(data => {
                          var n = oDataElements[data].name.split(" ");
                          obj[n[n.length - 1]] = oData[resp][data];
                        });
                      });
                      //console.log(obj)
                      this.fpItems.push(obj);
                    } else {
                      let obj = {};
                      obj["method"] = res.name;
                      obj["submethod"] = r.name;
                      obj["Hospital"] = null;
                      obj["NGO"] = null;
                      obj["Other"] = null;
                      obj["Pharmacy"] = null;
                      obj["Sector"] = null;
                      obj["Shop"] = null;
                      this.fpItems.push(obj);
                    }
                    //console.log(this.fpItems, nCount)
                    if(this.fpItems.length == nCount){
                        this.drawChart(this.fpItems);
                    }
                  });
              }
            });
            /* if(count == 22){
                console.clear();
                console.log(this.fpItems.length);
                this.drawChart(this.fpItems)
            } */
          });


        }).catch(res=>{
            this.$emit("fpSource", 'false')
        });

      }).catch(res=>{

            this.$emit("fpSource", 'false')
        });
      }).catch(res=>{

            this.$emit("fpSource", 'false')
        });
    },
    getFpSourceVals(p_modified,p_fpItems){

      let i,aTypes = [],aData = [];
      for(let j=0;j < p_fpItems.length;j++ ){
          let nSum = 0;
          for(let k in p_modified){
            if(p_modified[k] === 'Yes'){
              nSum += p_fpItems[j][k];
            }else if(p_modified[k] === 'No'){
              nSum += 0;
            }else{
              nSum += p_fpItems[j][k] / 2;
            }
          }
          if(nSum === 0 || nSum >= 100){
            nSum = 100;
          }
           aData.push(nSum/100);

        }

      return aData;
    },
    drawChart(fpItems){
      let categories = []
      let series = [],objFpNames = {
            'governmentHealth':'Sector',
            'ngo':'NGO',
            'privateHospital':'Hospital',
            'pharmacy':'Pharmacy',
            'shopChurchFriend':'Shop',
            'otherSector':'Other'
          },nFPItems = fpItems.length,c,catName={
            'Visits': 'FP Visits',
            'User': 'FP users',
            'Commodities_Client': 'Commodities distributed to clients',
            'Commodities_Facilities': 'Commodities distributed to facilities'
          };
      for(c = 0; c < nFPItems;c++){
        categories.push(fpItems[c].submethod);
      }

      for(let i in this.categoryData){
        if(i !== 'Background_Data' && i !== 'Output'){
          let ofpSource = this.categoryData[i].FPSource,oTemp = {name:catName[i],data:[],_i:i},
              oModified = {};
          for(let j in ofpSource){
            oModified[objFpNames[j]] = ofpSource[j]
          }
          let sData = this.getFpSourceVals(oModified,fpItems);

          sData.forEach(d=>{
            oTemp.data.push(d*100)
          })
          series.push(oTemp);
        }
      }
      let metaConfigData = JSON.parse(localStorage.getItem("metaConfig"));
      let locale = this.$i18n.locale, key = `ssToEMUBgData_${locale}`
      if(!settings.country){
        let appId = this.$store.state.appId ? this.$store.state.appId : "", appUserId = this.$store.state.appUserId ? this.$store.state.appUserId : ""
        if(appId && appUserId) {
          key = `${appUserId}_${appId}_ssToEMUBgData_${locale}`
        } else {
            this.showLocalStorageError()
            return;
        }
      }
      service.getSavedConfig(key).then(res=>{
          let configData = res.data;
          if (configData['adjustments'].length == 0) {
            configData['adjustments'] = {data: series, cat: categories}
          }

          if (metaConfigData) {
            if(metaConfigData[key]){
              metaConfigData[key]['adjustments'] = {data: series, cat: categories}
            }else{
              metaConfigData[key] = {['adjustments']: {data: series, cat: categories}}
            }
          } else {
            metaConfigData = {
              [key]: {['adjustments']: {data: series, cat: categories}}
            }
          }
          //metaConfigData.ssToEMUBgData['adjustments'] = {data: series, cat: categories}
            service.updateConfig(metaConfigData[key], key).then(response=>{
              if (response.data.status === "OK") {
                localStorage.setItem("metaConfig", JSON.stringify(metaConfigData));
              }
            })
      });
      this.$emit("fpSource", true)

      this.chartOptions = {
          chart: {
              type: 'column',
              zoomType:'x'
          },
          title: {
              text: ''
          },
          xAxis: {
              categories: categories
          },
          tooltip: {
              pointFormat: '{series.name}: <b>{point.y:.1f}%</b>' ,
              shared: true,
              useHTML: true,
          },
          yAxis: {
              min: 0,
              title: {
                  text: 'Review your Adjustment Factor'
              }
          },
          legend: {
              reversed: true,
              // backgroundColor: '#FCFFC5',
              // backgroundColor: '#71b5cd33',
              backgroundColor: 'transparent',
              // borderColor: '#C98657',
              // borderColor: '#00000080',
              borderColor: '#a7a7a7',
              borderWidth: 1,
              borderRadius: 5,
              // maxHeight: 60,
              // itemDistance: 50,
          },
          plotOptions: {
              series: {
                  stacking: ''
              }
          },
          exporting: {
              enabled: false
          },
          credits: {
              enabled: false
          },
          series: series
      }

    }
  },
  mounted() {
    this.getFPSourceData();
  }
};
</script>
