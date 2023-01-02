<template>
    <div class="row">
        <loader v-if="bshowLoader"/>
        <div class="col-lg-12">
            <ul class="nav nav-pills mb-3" role="tablist">
                <li class="nav-item">
                    <a class="nav-link active analytical-tab-links fs-19-1920" :id="'reporting_tab_link_'+tabName" data-toggle="pill"
                        :href="'#reporting_tab_content_'+tabName" role="tab"
                        :aria-controls="'reporting_tab_content_'+tabName" aria-selected="false" @click="getActiveTab('repo')">
                        {{$t('reportingRates')}}
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link analytical-tab-links fs-19-1920" :id="'input_tab_link_'+tabName" data-toggle="pill"
                        :href="'#input_tab_content_'+tabName" role="tab" :aria-controls="'input_tab_content_'+tabName"
                        aria-selected="true" @click="getActiveTab('input')">
                        {{$t('inputData')}}
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link analytical-tab-links fs-19-1920" :id="'output_tab_link_'+tabName" data-toggle="pill"
                        :href="'#output_tab_content_'+tabName" role="tab"
                        :aria-controls="'output_tab_content_'+tabName" aria-selected="false" @click="getActiveTab('output')">
                        {{$t('outputs')}}
                    </a>
                </li>
            </ul>
        </div>
        <div class="col-lg-12">
            <div class="tab-content">
                <div class="tab-pane fade" :id="'input_tab_content_'+tabName" role="tabpanel" :aria-labelledby="'input_tab_link_'+tabName">
                    <div class="row dashboardchart-container">
                        <div class="col-lg-12 col-xl-12">
                            <b-alert v-if="!aFinalInputData" show variant="danger">{{$t('no_data_to_display')}}</b-alert>
                            <div class="row" v-if="aFinalInputData">
                                <div v-bind:class="getClass()" v-for="chart in aFinalInputData.filter(obj => obj.disableChart != true)" :key="chart.title">
                                    <card-component :signOffActive="signOffActive" :chartdata="chart" :period="true" :canComment="canComment" :loggedInUserId="loggedInUserId"></card-component>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- <a class="btn black-btn pointer-events-none color-white float-right" :id="'output_tab_link_'+tabName" data-toggle="pill"
                        :href="'#output_tab_content_'+tabName" role="tab" style="margin-bottom: 30px;"
                        :aria-controls="'output_tab_content_'+tabName" aria-selected="false" @click="removeActiveClass">
                        Output
                    </a> -->
                </div>
                <div class="tab-pane fade" :id="'output_tab_content_'+tabName" role="tabpanel" :aria-labelledby="'output_tab_link_'+tabName">
                    <!-- <div class="row">
                        <div class="col-3 my-3">
                            <selectDD
                                :ddVal="currentYear"
                                :ddoptions="yearFilterList"
                                :onChangeFn="onYearChange"
                            />
                        </div>
                    </div> -->
                    <div class="row dashboardchart-container">
                        <div class="col-lg-12 col-xl-12">
                            <div class="row">
                                <div v-bind:class="getClass()"  v-if="outPutTrendsChart && outPutTrendsChart.disable == false">
                                    <card-component :chartdata="outPutTrendsChart" :canComment="canComment" :loggedInUserId="loggedInUserId"></card-component>
                                </div>
                                <div v-bind:class="getClass()" v-if="comparisionEstimateData && comparisionEstimateData.disable == false">
                                    <card-component
                                        :chartdata="comparisionEstimateData" :canComment="canComment" :loggedInUserId="loggedInUserId"
                                    />
                                </div>
                                <div class="col-lg-12 col-xl-12 mb-4 pieChart-col" v-if="MordernUsersByMethodsData && MordernUsersByMethodsData.disable == false && signOffActive">
                                    <card-component
                                        :chartdata="MordernUsersByMethodsData" :canComment="canComment" :loggedInUserId="loggedInUserId"
                                    />
                                </div>
                                <div class="col-lg-4 col-xl-4 mb-4" v-else-if="MordernUsersByMethodsData && MordernUsersByMethodsData.disable == false">
                                    <card-component
                                        :chartdata="MordernUsersByMethodsData" :canComment="canComment" :loggedInUserId="loggedInUserId"
                                    />
                                </div>

                                <div class="col-lg-12 col-xl-12 mb-4 pieChart-col" v-if="MixComparisionData && MixComparisionData.disable == false && signOffActive">
                                    <card-component
                                        :chartdata="MixComparisionData" :canComment="canComment" :loggedInUserId="loggedInUserId"
                                    />
                                </div>
                                <div class="col-lg-8 col-xl-8 mb-4 pieChart-col" v-else-if="MixComparisionData && MixComparisionData.disable == false">
                                    <card-component
                                        :chartdata="MixComparisionData" :canComment="canComment" :loggedInUserId="loggedInUserId"
                                    />
                                </div>

                                <!-- <div class="col-lg-6 col-xl-4 m-b-40px" v-if="methodMixPieChart">
                                    <card-component
                                        :chartdata="methodMixPieChart"
                                    />
                                </div> -->

                                <div v-bind:class="getClass()" v-if="userTrendsByMethod && userTrendsByMethod.disable == false">
                                    <card-component
                                        :chartdata="userTrendsByMethod" :canComment="canComment" :loggedInUserId="loggedInUserId"
                                    />
                                </div>

                                <div v-bind:class="getClass()" v-if="comparisionSlope && comparisionSlope.disable == false">
                                    <card-component
                                        :chartdata="comparisionSlope" :canComment="canComment" :loggedInUserId="loggedInUserId"
                                    />
                                </div>
                                <div class="col-lg-12">
                                    <div class="row dashboardchart-container">
                                        <div class="col-lg-12 col-xl-12 mb-4">
                                            <dataTable v-if="userTrendsByMethod"  :chartdata="userTrendsByMethod" :tableName="tableName" :tableHeading="firstTableName" :chartInfo="firstTableInfo" @filter="getFilter"/>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 mb-4">
                                   <!--  <bechMarkingOutputTable v-if="aFinalInputData"
                                        :data="aFinalInputData"
                                    /> -->
                                    <bechMarkingOutputTable v-if="AdjudtedValues"
                                        :data="AdjudtedValues" :tableHeading = "secondTableName" :chartInfo="secondTableInfo"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                    <!-- <div class="row mt-4 float-right">
                        <div class="col-lg-12 col-xl-12">
                            <a class="btn black-btn color-white" :id="'input_tab_link_'+tabName" data-toggle="pill"
                                :href="'#input_tab_content_'+tabName" role="tab" :aria-controls="'input_tab_content_'+tabName"
                                aria-selected="true" @click="removeActiveClass" style="margin-bottom: 30px;">
                                Prev
                            </a>

                            <a class="btn black-btn color-white" id="benchmarking-fpemuoutput-tabemu"
                            data-toggle="pill" href="#benchmarking-fpemuoutput"
                            role="tab" aria-controls="benchmarking-fpemuoutput"
                            aria-selected="false" @click="removeActiveClass" style="margin-bottom: 30px;">EMU Output</a>
                        </div>
                    </div> -->
                </div>
                <div class="tab-pane fade show active" :id="'reporting_tab_content_'+tabName" role="tabpanel" :aria-labelledby="'reporting_tab_link_'+tabName">
                   <div class="row dashboardchart-container">
                        <div class="col-lg-12 col-xl-12 m-b-40px" v-if="reportinRateChart">
                            <!-- <repoCardComponent v-if="reportinRateChart"
                                    :chartdata="reportinRateChart"
                                /> -->
                                <card-component
                                    :chartdata="reportinRateChart" :canComment="canComment" :loggedInUserId="loggedInUserId" chartComp= 'repotingRate'
                                />
                        </div>
                   </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import cardComponent from './cardComponent';
    import repoCardComponent from './repoCardComponent';
    import dataTable from './dataTable';
    import service from '@/service/service.js';
    import dataM from './dataMassaging.js';
    import bechMarkingOutputTable from './bechMarkingOutputTable';
    import selectDD from './selectDD';
    export default {
        props:[
            'data',
            'bgData',
            'bAllWomen',
            'tabName',
            'repoId',
            'getData',
            'tableName',
            'startYear',
            'endYear',
            'contName',
            'locationVal',
            'year',
            'repoColor',
            'signOffActive',
            'exportPosition'
        ],
        components:{
            cardComponent,
            repoCardComponent,
            dataTable,
            bechMarkingOutputTable,
            selectDD
        },
        destroyed(){

        },
        methods:{
            getClass(){
                if(this.signOffActive){
                    return 'col-lg-12 col-xl-12 mb-4'
                }else{
                    return 'col-lg-6 col-xl-6 mb-4'
                }
            },
            getActiveTab(tab){
                this.activetab = tab
                this.$emit('activeTabName', tab)
            },
            getUser() {
                service.getLoggedInUser().then(response => {
                    // console.log(response)
                    this.loggedInUserId = response.data.id
                    let role = ""
                    response.data.userCredentials.userRoles.forEach(u => {
                    if (settings.userRole.includes(u.name)) {
                        role = u.name
                    }
                    })
                    let locale = this.$i18n.locale, key = `userManagement_${locale}`
                    if (!settings.country) {
                      let appId = this.$store.state.appId ? this.$store.state.appId : "", appUserId = this.$store.state.appUserId ? this.$store.state.appUserId : ""
                      if(appId && appUserId) {
                        key = `${appUserId}_${appId}_userManagement_${locale}`
                      } else {
                          this.showLocalStorageError()
                          return;
                      }
                    }
                    // console.log("role", role)
                    if (role === "") {
                    let saveConfig = service.getSavedConfig(key);
                    saveConfig.then(res => {
                        // console.log("userManagement", res.data);
                        let favorites = res.data.permission.filter(d => d.id === response.data.userCredentials.id)
                        // let favorites = res.data.permission.filter(d => d.id === 'WoJ8hn2C6aQ' )

                        // console.log("favorites", favorites);
                        if (favorites[0].canComment) {
                        this.canComment = true
                        } else {
                        this.canComment = false
                        }
                    }).catch(() => {
                        this.canComment = false
                    })
                    } else {
                    this.canComment = true
                    }
                })
            },
            getFilter(p){
                this.filter = p
            },
            removeActiveClass(e){
                window.scroll({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                });
                $(e.target).removeClass('active');
                if(e.target.id === 'benchmarking-fpemuoutput-tabemu'){
                    $('.analytical-method-link').removeClass('active');
                    $('#benchmarking-fpemuoutput-tab').addClass('active');
                }
            },
            /**
                * This fnc is to get applicationModule.
                * Usage: `getGlobalConfig()`
                * @param 'applicationModule' which is key for global application config
                * @return {Object} globalConfig
            */
            getGlobalConfig(){
                let locale = this.$i18n.locale, key = `applicationModule_${locale}`
                if(!settings.country){
                  let appId = this.$store.state.appId ? this.$store.state.appId : "", appUserId = this.$store.state.appUserId ? this.$store.state.appUserId : ""
                  if(appId && appUserId) {
                    key = `${appUserId}_${appId}_applicationModule_${locale}`
                  } else {
                      this.showLocalStorageError()
                      return;
                  }
                }
                service.getLoggedInUser().then(response => {
                service.getSavedConfig(key).then(oGlobal=>{
                  let locationID = oGlobal.data.defaultLocationID[0]
                  this.defaultLevelID = oGlobal.data.defaultLevelID
                  if(response.data.dataViewOrganisationUnits[0].level > oGlobal.data.defaultLevelID) {
                    locationID = response.data.dataViewOrganisationUnits[0].id
                  }
                  oGlobal.data.defaultLocationID = [locationID]
                    let oRet = dataM.getFormatedData(this.data,oGlobal.data, this.tabName);
                    this.globalConfig = oRet.data;

                    this.totalCyp = oRet.totalCYP;
                    if(this.globalConfig.chartArr.length){
                        this.getAllDataelemsData();
                    }else{
                        //this.bshowLoader = false;
                        if(this.getData){
                            this.getData(this.tabName,null,'whole_data_empty', this.filter);
                        }
                    }
                }).catch(res=>{
                    console.log(res)
                    this.showAlert();
                });
              }).catch(res=>{
                  console.log(res)
                  this.showAlert();
              });
            },
            /**
                * This fnc is to get fetch all data of data elements.
                * Usage: `getAllDataelemsData()`
            */
            getAllDataelemsData(){
                let i ,aChart = this.globalConfig.chartArr,ncLen = aChart.length,
                    //sLocId = this.globalConfig.locationId,
                    sLocId = this.locationVal.split('/')[1],
                    sYear = dataM.getYearFormated(this.startYear,this.endYear),
                    nFlag1 = 0,nFlag2 = 0;

                this.getReportingRate(sLocId,sYear);
                for(i = 0; i < ncLen;i++){
                    let j,aDe = aChart[i].dataElems,
                        nLen = aDe.length;
                    for(j in aDe){
                        let sdes = aDe[j].de.join(';'),
                            nI = i,nJ = j;
                            if(!aDe[j].de.length){
                                continue;
                            }
                        nFlag1++;
                        service.getAnalyticalIndicatorData(sdes,sLocId,sYear).then((response) => {
                            nFlag2++;
                            if(!aChart[nI].charts){
                                aChart[nI].charts = {}
                            }

                            aChart[nI].charts = dataM.getChartFormatedData(response.data.rows,aChart[nI].dataElems[nJ],aChart[nI].charts);

                            if(nFlag1 === nFlag2){
                                this.bRequestFlag = true;
                            }
                        }).catch(res=>{
                            console.log(res)
                            this.showAlert();
                        });
                    }

                }
            },
            /**
             * This fn is for getting reporting rate
             * Using De
             *
             */
            getReportingRate(p_loc,p_pe){
                service.getAnalyticalIndicatorData(this.reportingRateDe,p_loc,p_pe).then(response => {
                    let i,aRows = response.data.rows,nLength = aRows.length,
                        oRepoRate = {};
                    for(i = 0;i < nLength;i++){
                        let sYr = aRows[i][1];
                        oRepoRate[sYr] = isFinite(aRows[i][3]) ? Number(aRows[i][3]) : 0
                    }
                    this.repoRate = oRepoRate;
                    this.reportingRateChart(this.repoRate);
                }).catch(res => {
                    console.log(res)
                    this.showAlert()
                });
            },
            /**
                * This fnc is to compute reporting chart data.
            */
            reportingRateChart(data){
                //console.log(this.data['reportingRate'][0]['indicator']['chartOptions']['title']['text'], 'jvhnvhgvng')
                let categories = []
                let seriesData = []
                let catData = []
                Object.keys(data).forEach(res=>{
                    categories.push(res)
                    seriesData.push(data[res])
                    catData.push({"Year": res, "Reporting Rates (%)": data[res]})
                })

                let repoData = {categories: categories, data: [{name:'Reporting Rate',data:seriesData, color: this.repoColor}]};
                repoData.title = this.data['reportingRate'][0]['indicator']['chartName'];
                repoData.ppttitle = this.sources[this.tabName] + ' - ' +this.data['reportingRate'][0]['indicator']['chartName'];
                repoData.chartInfo = this.data['reportingRate'][0]['indicator']['chartInfo'];
                repoData.source = "";
                repoData.xTitle = this.data['reportingRate'][0]['indicator']['chartOptions']['xAxis']['text'];
                repoData.yTitle = this.data['reportingRate'][0]['indicator']['chartOptions']['yAxis']['text'];
                repoData.type = "column";
                repoData.tableData = catData;
                repoData.cid = this.data['reportingRate'][0]['indicator']['cid'];
                this.reportinRateChart = repoData;
            },
            /**
                * This fnc is to compute final chart data.
                * Usage: `getFinalChartsdata()`
                * @param 'globalConfig' which is used in the function
                * @return {Array} 'aFinalInputData'
            */
            getFinalChartsdata(){
                let aChartArr = this.globalConfig.chartArr,i,nLen = aChartArr.length,
                    aFinalCharts = [],
                    ochartConfig = {
                        type:this.globalConfig.type,xTitle:this.globalConfig.xTitle,
                        yTitle:this.globalConfig.yTitle
                        //visible:this.globalConfig.visible,
                    };

                for(i = 0; i < nLen;i++){
                    aFinalCharts.push(dataM.getFinalChartData(aChartArr[i],ochartConfig));
                }

                //console.log(dataM.getFinalTotalCYP(dataM.getTotalCYP(aChartArr),ochartConfig,this.totalCyp, this.tabName))
                aFinalCharts.push(dataM.getFinalTotalCYP(dataM.getTotalCYP(aChartArr),ochartConfig,this.totalCyp, this.tabName));
                this.aFinalInputData = aFinalCharts;
                dataM.saveChartColors(aFinalCharts,this.tabName)
            },
            /**
             * This function is to calculate commodities adjustment for output
             * Usage: ``
            */
            getOutComAdjustment(){
                // console.log(this.bgData.continuation, this.contName);
                //console.log(this.tabName);
                let oAdjustmentFactors = this.bgData.adjustmentFactorTypeWise[this.contName] || this.bgData.adjustmentFactor,
                    oRet = dataM.calculateCA(this.globalConfig.chartArr,oAdjustmentFactors),
                    aSumOfCont = dataM.getSumOfCont(this.bgData.continuation[this.contName]),
                    bIsUser = this.tabName === "fp_users";
                this.CommAdjustment = oRet.data;
                this.cypFactors = oRet.cyp;
                this.baseLineUsers = dataM.calculateBU(this.CommAdjustment,aSumOfCont);
                this.AdjudtedValues = dataM.calculateAdjustedVals(this.baseLineUsers,this.CommAdjustment,
                        this.repoRate,this.cypFactors,bIsUser,this.bgData.continuation[this.contName]);
                /*  */
                let oUserTrends = dataM.getFinalOutPutChart(this.AdjudtedValues,this.tabName);

                oUserTrends.title = this.data['derivedCharts'][0]['chartOptions']['chartName'];
                oUserTrends.ppttitle = this.sources[this.tabName] + ' - ' +this.data['derivedCharts'][0]['chartOptions']['chartName'];
                oUserTrends.source = "";
                oUserTrends.xTitle = this.data['derivedCharts'][0]['chartOptions']['xAxis']['text'];
                oUserTrends.yTitle = this.data['derivedCharts'][0]['chartOptions']['yAxis']['text'];
                oUserTrends.disable = this.data['derivedCharts'][0]['chartOptions']['disableChart'];
                oUserTrends.chartInfo = this.data['derivedCharts'][0]['chartOptions']['chartInfo'];
                oUserTrends.cid = this.data['derivedCharts'][0]['chartOptions']['cid'];
                this.outPutTrendsChart = oUserTrends;

                let comparisionEstimate = dataM.getComparingEstimateModernUsers(this.AdjudtedValues,this.tabName);
                /*  */
                console.log(comparisionEstimate)
                this.drawComparingEstimate(comparisionEstimate);
                this.drawMordernUsersByMethods(comparisionEstimate);
                this.drawMethodMixComparision(comparisionEstimate);
                this.drawMethodMixPie();
                this.drawUserTrendsByMethods(comparisionEstimate);
                this.drawComparingSlopes();
                if(this.getData){
                    this.getData(this.tabName,this.outPutTrendsChart,'userTrendsBymethods', this.filter);
                }
            },
            drawComparingEstimate(p_data){
                let unpd = {}
                if(this.defaultLevelID == this.locationVal.split('/')[0]){
                    unpd = this.bgData.UNPD
                }else{
                    unpd = this.bgData.FPET
                }
                let oMethodMix = this.bgData.methodMix,
                    oFinalMix = {},
                    oPopulation = this.bgData.population,
                    // oUnpd = this.bAllWomen ? this.bgData.UNPD.AW : this.bgData.UNPD.MW,
                    //oUnpd = this.defaultLevelID == this.locationVal.split('/')[0] ? this.bgData.UNPD : this.bgData.FPET,
                    oUnpd = unpd,
                    oData = p_data.data;

                for(let m in oMethodMix){
                    // oFinalMix[m.toLowerCase()] = oMethodMix[m];
                    oFinalMix[m] = oMethodMix[m];
                }

                for(let x in oData){
                    let aMethods =  oData[x].map((ele,ind) => {
                        return ele.name
                    });

                    for(let p in oFinalMix){
                        //if(aMethods.indexOf(p) === -1 && !p.includes('Tubal Ligation (F)') && !p.includes('Vasectomy (M)') &&  !p.includes('OC Pills') &&  !p.includes('Condom(m+f)')){
                        if(aMethods.indexOf(p) === -1 && !p.includes('OC Pills') &&  !p.includes('Condom(m+f)')){
                            let oTemp = {name:p,data:[0]};
                            oData[x].push(oTemp);
                        }
                    }

                    let nPopulation = oPopulation[x] ? oPopulation[x] : 0,
                        nmcpr = oUnpd[x] ? oUnpd[x] : 0,
                        nMm = 0,nLen = oData[x].length,y = 0;

                    for(y = 0; y < nLen ;y++){
                        let sName = oData[x][y].name;

                        nMm = oFinalMix[sName] ? oFinalMix[sName] : 0;
                        if(sName.includes('Vasectomy (M)') && oFinalMix['Vasectomy (M)']){
                            nMm = oFinalMix['Vasectomy (M)'];
                        }
                        if(sName.includes('Tubal Ligation (F)') && oFinalMix['Tubal Ligation (F)']){
                            nMm = oFinalMix['Tubal Ligation (F)'];
                        }
                        if(sName.includes('Pill') && oFinalMix['OC Pills']){
                            nMm = oFinalMix['OC Pills'];
                        }
                        if(sName.includes('Condom') && oFinalMix['Condom(m+f)']){
                            nMm = oFinalMix['Condom(m+f)'];
                        }

                        let Val = nPopulation * (nmcpr / 100) * (nMm / 100);

                        // console.log(nPopulation, (nmcpr / 100), (nMm / 100))
                        // console.log(Val)
                        // oData[x][y].data.push(Math.round(Val));
                        oData[x][y].data.push(dataM.RoundTo(Val,100));
                    }
                }
                /*  */


                let newFields = [{key: 'Method'}, {key: 'User by Method (Service Statistics)'}, {key: 'User by Method (Survey)'}],
                tableData = []
                Object.keys(oData).forEach(key=>{
                    tableData = []
                    oData[key].forEach(m=>{
                        let newRow= {}
                        newRow['Method'] = m.name
                        newRow['User by Method (Service Statistics)'] = m.data[0]
                        newRow['User by Method (Survey)'] = m.data[1]

                        tableData.push(newRow)
                    })
                })
                this.statData = tableData
                this.statFields = newFields
                p_data.data = oData;

                this.comparisionEstimateData = {
                    data:p_data.data[this.currentYear],
                    title : this.data['derivedCharts'][1]['chartOptions']['chartName'],
                    ppttitle : this.sources[this.tabName] +' - '+ this.data['derivedCharts'][1]['chartOptions']['chartName'],
                    source : "",
                    xTitle : this.data['derivedCharts'][1]['chartOptions']['xAxis']['text'],
                    yTitle : this.data['derivedCharts'][1]['chartOptions']['yAxis']['text'],
                    type:'bar',
                    categories:['User by Methods(Service Statistics)','User by Methods(Survey)'],
                    disable : this.data['derivedCharts'][1]['chartOptions']['disableChart'],
                    cid : this.data['derivedCharts'][1]['chartOptions']['cid'],
                    fields: newFields,
                    tableData: tableData
                }

                if(this.getData){
                    this.getData(this.tabName,p_data,'userT', this.filter);
                }

            },
            drawMordernUsersByMethods(p_data){
                //console.log(p_data.data)
                let aCats = p_data.cats,
                    oData = p_data.data,
                    atypes = ['User by Methods(Service Statistics)','User by Methods(Survey)'],
                    aFinalData = {},nCatLen = aCats.length;
                for(let i in oData){
                    aFinalData[i] = [];
                    let nLen = oData[i].length,j;
                    for(j = 0;j < nLen;j++){
                        let aTemp = oData[i][j].data,k,nkLen = aTemp.length;
                        for(k = 0; k < nkLen;k++){
                            if(!aFinalData[i][k]){
                                aFinalData[i][k] = {name:atypes[k],data:[]}
                            }
                            if(aFinalData[i][k].data.length !== nCatLen){
                                aFinalData[i][k].data.push(aTemp[k]);
                            }
                        }
                    }
                }

                this.MordernUsersByMethodsData = {
                    data:aFinalData[this.currentYear],
                    title : this.data['derivedCharts'][2]['chartOptions']['chartName'],
                    ppttitle : this.sources[this.tabName]+' - '+this.data['derivedCharts'][2]['chartOptions']['chartName'],
                    source : "",
                    xTitle : this.data['derivedCharts'][2]['chartOptions']['xAxis']['text'],
                    yTitle : this.data['derivedCharts'][2]['chartOptions']['yAxis']['text'],
                    categories:aCats,
                    disable : this.data['derivedCharts'][2]['chartOptions']['disableChart'],
                    chartInfo : this.data['derivedCharts'][2]['chartOptions']['chartInfo'],
                    type: 'column',
                    cid : this.data['derivedCharts'][2]['chartOptions']['cid'],
                    fields: this.statFields,
                    tableData: this.statData
                }
            },
            drawMethodMixComparision(p_data){
                let oRet = dataM.getMethodMixComparision(p_data.data),
                    oData = oRet.series,
                    aFields = ['Method', 'Estimated Modern Method Mix', 'Modern Contraceptive Method Mix'],
                    tableData = [],
                    aMethodMixPie = dataM.getMethodMixPie(this.bgData.methodMix,oRet.color);
                    this.$emit('methodMixChart', aMethodMixPie)
                let index = Object.keys(oData)[Object.keys(oData).length-1]
                if(oData[index] != undefined){
                    oData[index].forEach((key, i)=>{
                        let newVal = aMethodMixPie.filter(obj=>obj.name == key.name)
                        let row = {}
                        if(newVal.length > 0){
                            row['Method'] = key.name
                            row['Estimated Modern Method Mix'] = key.y.toFixed(2)*1
                            row['Modern Contraceptive Method Mix'] = newVal[0].y
                        }
                        tableData.push(row)
                    })
                }

               let pieData = [
                    {
                        size: 200,
                        center: [180, 180],
                        name:'Methods',colorByPoint: true,
                        data:oData[this.currentYear]
                    },
                    {
                        size: 200,
                        center: [580, 180],
                        name:'Methods',colorByPoint: true,
                        data:aMethodMixPie
                    }
                ],
                chartStyle = [{
                    // html: 'Estimated Modern Method Mix',
                    html: this.data['derivedCharts'][3]['chartOptions']['subTitle']['text'],
                    style: {
                        left: '100px',
                        top: '0px',
                        color: 'black',
                        display: 'flex'
                    }
                },
                {
                    // html: 'Modern Contraceptive Method Mix',
                    html: this.data['derivedCharts'][3]['chartOptions']['subTitle1']['text'],
                    style: {
                        left: '450px',
                        top: '0px',
                        color: 'black',
                        display: 'flex'
                    }
                }]

                let oResponse = {
                        data : pieData,
                        title : this.data['derivedCharts'][3]['chartOptions']['chartName'],
                        source : this.sources[this.contName],
                        xTitle : "",
                        yTitle : "",
                        type:'pie',
                        disable : this.data['derivedCharts'][3]['chartOptions']['disableChart'],
                        dataLable: true,
                        chartInfo : this.data['derivedCharts'][3]['chartOptions']['chartInfo'],
                        cid : this.data['derivedCharts'][3]['chartOptions']['cid'],
                        tableData:tableData,
                        fields:aFields,
                        labels: {
                            items: chartStyle
                        }
                    };
                    //console.log(oResponse, this.tabName, this.location)
                this.MixComparisionData = oResponse;

                let dataStore = {}
                let locale = this.$i18n.locale, key = `annualEMU_${locale}`
                if(!settings.country){
                  let appId = this.$store.state.appId ? this.$store.state.appId : "", appUserId = this.$store.state.appUserId ? this.$store.state.appUserId : ""
                  if(appId && appUserId) {
                    key = `${appUserId}_${appId}_annualEMU_${locale}`
                  } else {
                      this.showLocalStorageError()
                      return;
                  }
                }
                let allKeys = service.getAllKeys()
                allKeys.then(keys => {
                    if (keys.data.includes(key)) {
                        let oConfig = service.getSavedConfig(key);
                        oConfig.then((response) => {
                            let oResponse = response.data;

                            if (oResponse['methodMix']) {
                                if (oResponse['methodMix'][this.tabName]) {
                                    if(oResponse['methodMix'][this.tabName][this.currentYear]){
                                        oResponse['methodMix'][this.tabName][this.currentYear] = {
                                            [this.locationVal.split('/')[1]]: this.MixComparisionData
                                        }
                                    }else{
                                        oResponse['methodMix'][this.tabName] = {
                                            ...oResponse['methodMix'][this.tabName],
                                            [this.currentYear]: {
                                                [this.locationVal.split('/')[1]]: this.MixComparisionData
                                            }
                                        }
                                    }

                                } else {
                                    oResponse['methodMix'] = {
                                        ...oResponse['methodMix'],
                                    [this.tabName]: {
                                           [this.currentYear] : {
                                                [this.locationVal.split('/')[1]]: this.MixComparisionData
                                            }
                                        }
                                    }
                                }
                            } else {
                                oResponse['methodMix'] = {
                                    [this.tabName]: {
                                        [this.currentYear]: {
                                            [this.locationVal.split('/')[1]]: this.MixComparisionData
                                        }
                                    }
                                }
                            }

                            service.updateConfig(oResponse, key)
                            this.saveLocalStorage(key, this.MixComparisionData, 'methodMix')
                        });
                    }else{
                       dataStore = {'methodMix': {
                           [this.tabName]: {
                                [this.currentYear]: {
                                    [this.locationVal.split('/')[1]]: this.MixComparisionData
                                }
                            }
                        }}
                       service.saveConfig(dataStore, key)
                       this.saveLocalStorage(key, this.MixComparisionData, 'methodMix')
                    }
                })
            },
            saveLocalStorage(key, emuData, chart){
                let metaConfigData = localStorage.getItem("metaConfig");
                if (metaConfigData) {
                    metaConfigData = JSON.parse(localStorage.getItem("metaConfig"));
                    if (metaConfigData[key]) {
                        if (metaConfigData[key][chart][this.tabName]) {
                            if(metaConfigData[key][chart][this.tabName][this.currentYear]){
                                metaConfigData[key][chart][this.tabName][this.currentYear] = {
                                    [this.locationVal.split('/')[1]]: this.MixComparisionData
                                }
                            }else{
                                metaConfigData[key][chart][this.tabName] = {
                                    ...metaConfigData[key][chart][this.tabName],
                                    [this.currentYear]: {
                                        [this.locationVal.split('/')[1]]: this.MixComparisionData
                                    }
                                }
                            }

                            //metaConfigData[key][chart][this.currentYear][this.tabName][this.location] = emuData;
                        } else {
                            metaConfigData[key][chart][this.tabName] = {
                                [this.currentYear]: {
                                    [this.locationVal.split('/')[1]]: emuData
                                }
                            }
                        }
                    } else {
                    metaConfigData[key] = {
                            [chart]: {
                                [this.tabName]:{
                                    [this.currentYear]: {
                                        [this.locationVal.split('/')[1]]: emuData
                                    }
                                }
                            }
                        }
                    }
                } else {
                    metaConfigData = {
                        [key]: {
                            [chart]: {
                                [this.tabName]:{
                                    [this.currentYear]: {
                                        [this.locationVal.split('/')[1]]: emuData
                                    }
                                }
                            }
                        }
                    }
                }
                localStorage.setItem("metaConfig", JSON.stringify(metaConfigData));

            },
            drawMethodMixPie(){
                let oResponse = {
                    data : [{name:'Methods',colorByPoint: true,data:dataM.getMethodMixPie(this.bgData.methodMix)}],
                    title : "Comparing Method Mix [ Service Statistics & Survey]",
                    source : "",
                    xTitle : "",
                    yTitle : "",
                    type:'pie'
                };
                this.methodMixPieChart = oResponse;
            },
            drawUserTrendsByMethods(p_data){
                this.userTData = p_data
                let {DHS,UNPD,population,FPET} = this.bgData;
                let aKeys = Object.keys(population);
                let oUserTrends = dataM.getUserTrendsByMethods(aKeys,DHS,UNPD,p_data,population,this.bAllWomen, this.contName, FPET,this.defaultLevelID, this.locationVal.split('/')[0]);
                oUserTrends.title = this.data['derivedCharts'][4]['chartOptions']['chartName'];
                oUserTrends.source = "";
                oUserTrends.xTitle = this.data['derivedCharts'][4]['chartOptions']['xAxis']['text'];
                oUserTrends.yTitle = this.data['derivedCharts'][4]['chartOptions']['yAxis']['text'];
                oUserTrends.disable = this.data['derivedCharts'][2]['chartOptions']['disableChart'];
                oUserTrends.type = 'line';
                oUserTrends.filter = this.filter;
                oUserTrends.chartInfo = this.data['derivedCharts'][4]['chartOptions']['chartInfo'];
                oUserTrends.cid = this.data['derivedCharts'][4]['chartOptions']['cid'];
                this.userTrendsByMethod = oUserTrends;

                if(this.getData){
                    this.getData(this.tabName,this.userTrendsByMethod,'output', this.filter);
                }
            },
            drawComparingSlopes(){
                let oResponse = dataM.getComparingSlopesData(this.userTrendsByMethod,this.currentYear);
                this.comparisionSlope = {
                    data:oResponse.data,
                    title : this.data['derivedCharts'][5]['chartOptions']['chartName'],
                    source : "",
                    xTitle : this.data['derivedCharts'][5]['chartOptions']['xAxis']['text'],
                    yTitle : this.data['derivedCharts'][5]['chartOptions']['yAxis']['text'],
                    disable : this.data['derivedCharts'][5]['chartOptions']['disableChart'],
                    type:'bar',
                    categories:oResponse.categories,
                    chartInfo: this.data['derivedCharts'][5]['chartOptions']['chartInfo'],
                    cid: this.data['derivedCharts'][5]['chartOptions']['cid'],
                    tableData: oResponse.tableData,
                    fields: oResponse.fields
                };

                if(this.getData){
                    this.getData(this.tabName,this.comparisionSlope,'slope', this.filter);
                }
            },
            allDataFetched(){
                if(this.globalConfig != null){
                    this.getFinalChartsdata();
                    this.getOutComAdjustment();
                    //let count = 1
                    setTimeout( () => {
                    if(this.exportPosition == 1){
                        //console.log(this.aFinalInputData)
                        if(!this.reportinRateChart.disable) {
                            this.exportArr.push({'cardKey': 'key1', ...this.reportinRateChart})
                        }
                        this.aFinalInputData = this.aFinalInputData.filter(obj => obj.disableChart != true)
                        let count = 2
                        this.aFinalInputData.forEach(obj=>{
                            this.exportArr.push({'cardKey': 'key' + count, ...obj})
                            count++;
                        })
                        if(!this.outPutTrendsChart.disable) {
                            this.exportArr.push({'cardKey': 'key11', ...this.outPutTrendsChart})
                        }
                        if(!this.comparisionEstimateData.disable) {
                            this.exportArr.push({'cardKey': 'key12', ...this.comparisionEstimateData})
                        }
                        if(!this.MordernUsersByMethodsData.disable) {
                            this.exportArr.push({'cardKey': 'key13', ...this.MordernUsersByMethodsData})
                        }
                    }else if(this.exportPosition == 2){
                        if(!this.reportinRateChart.disable) {
                            this.exportArr.push({'cardKey': 'key23', ...this.reportinRateChart})
                        }
                        this.aFinalInputData = this.aFinalInputData.filter(obj => obj.disableChart != true)
                        let count = 24
                        this.aFinalInputData.forEach(obj=>{
                            this.exportArr.push({'cardKey': 'key' + count, ...obj})
                            count++;
                        })
                        if(!this.outPutTrendsChart.disable) {
                            this.exportArr.push({'cardKey': 'key34', ...this.outPutTrendsChart})
                        }
                        if(!this.comparisionEstimateData.disable) {
                            this.exportArr.push({'cardKey': 'key35', ...this.comparisionEstimateData})
                        }
                        if(!this.MordernUsersByMethodsData.disable) {
                            this.exportArr.push({'cardKey': 'key36', ...this.MordernUsersByMethodsData})
                        }
                    }else if(this.exportPosition == 3){
                        if(!this.reportinRateChart.disable) {
                            this.exportArr.push({'cardKey': 'key37', ...this.reportinRateChart})
                        }
                        this.aFinalInputData = this.aFinalInputData.filter(obj => obj.disableChart != true)
                        let count = 38
                        this.aFinalInputData.forEach(obj=>{
                            this.exportArr.push({'cardKey': 'key' + count, ...obj})
                            count++;
                        })
                        if(!this.outPutTrendsChart.disable) {
                            this.exportArr.push({'cardKey': 'key48', ...this.outPutTrendsChart})
                        }
                        if(!this.comparisionEstimateData.disable) {
                            this.exportArr.push({'cardKey': 'key49', ...this.comparisionEstimateData})
                        }
                        if(!this.MordernUsersByMethodsData.disable) {
                            this.exportArr.push({'cardKey': 'key50', ...this.MordernUsersByMethodsData})
                        }
                    }else if(this.exportPosition == 4){
                        if(!this.reportinRateChart.disable) {
                            this.exportArr.push({'cardKey': 'key51', ...this.reportinRateChart})
                        }
                        this.aFinalInputData = this.aFinalInputData.filter(obj => obj.disableChart != true)
                        let count = 52
                        this.aFinalInputData.forEach(obj=>{
                            this.exportArr.push({'cardKey': 'key' + count, ...obj})
                            count++;
                        })
                        if(!this.outPutTrendsChart.disable) {
                            this.exportArr.push({'cardKey': 'key62', ...this.outPutTrendsChart})
                        }
                        if(!this.comparisionEstimateData.disable) {
                            this.exportArr.push({'cardKey': 'key63', ...this.comparisionEstimateData})
                        }
                        if(!this.MordernUsersByMethodsData.disable) {
                            this.exportArr.push({'cardKey': 'key64', ...this.MordernUsersByMethodsData})
                        }
                    }
                        this.emitPPTData()
                    }, 5000)
                }
                this.bshowLoader = false;
            },
            emitPPTData(){
                this.$emit('sendEMUCharts', this.exportArr);
            },
            /**
                * This function is to alert when something goes wrong with API.
                * Usage: `showAlert()`
            */
            showAlert(){
                // console.trace();
                this.$swal({
                    text: this.$i18n.t('somethingwentwrong')
                });
                this.bshowLoader = false;
            },
            onYearChange(p_val){
                this.currentYear = p_val;
                this.allDataFetched();
            },
            getYearList(){
                let aKeys = [],nStart = this.startYear * 1,nEnd = this.endYear * 1;
                if(!(isNaN(nStart) || isNaN(nEnd))){
                    while(nStart <= nEnd){
                        aKeys.push(nStart);
                        nStart++;
                    }
                }
                let i,nLen = aKeys.length,aFinalList = [];
                for(i = 0; i < nLen;i++){
                    let oTemp = {val:aKeys[i],label:aKeys[i]};
                    aFinalList.push(oTemp);
                }
                this.$emit('yearFilterList', aFinalList)
                return aFinalList;
            }
        },
        mounted() {
          this.getGlobalConfig();
          this.getUser()
          this.getActiveTab('repo')
        },
        updated(){

        },
        data() {
            //console.log(this.bgData)
            return{
                globalConfig:null,
                bRequestFlag:false,
                aFinalInputData : null,
                bshowLoader:true,
                totalCyp:null,
                reportingRateDe:this.repoId,
                CommAdjustment:null,
                repoRate:null,
                baseLineUsers:null,
                cypFactors:null,
                AdjudtedValues:null,
                outPutTrendsChart:null,
                comparisionEstimateData:null,
                MordernUsersByMethodsData:null,
                MixComparisionData: null,
                methodMixPieChart:null,
                userTrendsByMethod:null,
                comparisionSlope:null,
                reportinRateChart: null,
                currentYear:this.endYear,
                yearFilterList:this.getYearList(),
                sources: {commoditiesToClients: 'Commodities Distributed to Clients',
                    commoditiesToFacilities: 'Commodities Distributed to Facilities',
                    fp_visits: 'FP Visits',
                    fp_users: 'FP Users'},
                firstTableName: this.data['derivedCharts'][6]['chartOptions']['chartName'],
                secondTableName: this.data['derivedCharts'][7]['chartOptions']['chartName'],
                firstTableInfo: this.data['derivedCharts'][6]['chartOptions']['chartInfo'],
                secondTableInfo: this.data['derivedCharts'][7]['chartOptions']['chartInfo'],
                filter: 'inc',
                userTData: null,
                canComment: false,
                loggedInUserId: '',
                statData: [],
                statFields: [],
                activetab: '',
                exportArr: [],
                defaultLevelID: ''
            }
        },
        watch:{
            bgData(newVal){
                this.bgData = newVal
               console.log(this.bgData)
                this.bshowLoader = true;
                this.allDataFetched();
            },
            bRequestFlag(newVal){
                if(newVal && this.repoRate){
                    this.allDataFetched();
                }

            },
            repoRate(newVal){
                //console.log(newVal)
                if(newVal && this.bRequestFlag){
                    this.allDataFetched();
                }
            },
            locationVal(newVal){
                if(newVal){
                    this.bRequestFlag = false;
                    this.bshowLoader = true;
                    this.getGlobalConfig();
                }
            },
            year(newVal){
                if(newVal){
                    this.currentYear = newVal;
                    this.allDataFetched();
                }
            },
            filter(nev){
                this.drawUserTrendsByMethods(this.userTData)
            },
            signOffActive(newVal){
                //console.log(this.newUsersChartData)
                this.signOffActive = newVal
                this.aFinalInputData = null
                this.reportinRateChart = null

                this.outPutTrendsChart = null
                this.comparisionEstimateData = null
                this.MordernUsersByMethodsData = null
                this.MixComparisionData =  null
                this.methodMixPieChart = null
                this.userTrendsByMethod = null
                this.comparisionSlope = null

                this.bRequestFlag = false;
                this.bshowLoader = true;
                this.getGlobalConfig();
            }
        }
    };
</script>
