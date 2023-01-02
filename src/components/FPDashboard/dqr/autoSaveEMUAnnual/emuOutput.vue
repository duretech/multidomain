<template>
    <div>
        <div class="row" v-bind:style="getSourceClass()"> 
            <div class="col-lg-12">
                <div class="btn condom-filter">
                    <span v-for="(option, i) in options" :key="i" class="pointer-events-none color-white fs-17-1920">
                        {{option.label}}
                    </span>
                </div>
                <div class="top-date-page-div">
                    <span class="btn pointer-events-none color-white">
                    {{startYear }} - {{endYear}}
                    </span>
                </div>
            </div>
        </div>
        
        <div class="row dashboardchart-container">

            <div v-bind:class="getClass()" v-if="emuMcprComparisionChart">
                <card-component
                    :chartdata="emuMcprComparisionChart" :canComment="canComment" :loggedInUserId="loggedInUserId"
                    defaultSort="JAN-DEC" sorting="['JAN-DEC','DEC-JAN']"
                />
            </div>

            <div v-bind:class="getClass()" v-if="annualAvgComparisionChart">
                <card-component
                    :chartdata="annualAvgComparisionChart" :canComment="canComment" :loggedInUserId="loggedInUserId"
                    defaultSort="A-Z" sorting="['0-1','1-0', 'A-Z','Z-A']"
                />
            </div>
        </div>

        <div class="row dashboardchart-container">

            <div v-bind:class="getClass()" v-if="annualComparisionOfMethods">
                <card-component
                    :chartdata="annualComparisionOfMethods" :canComment="canComment" :loggedInUserId="loggedInUserId"
                    defaultSort="A-Z" sorting="['0-1','1-0', 'A-Z','Z-A']"
                />
            </div>
            <div v-bind:class="getClass()" v-if="annualuserTrendsDataByMethods">
                <card-component
                    :chartdata="annualuserTrendsDataByMethods"
                    :ddOptions="userMethodList"
                    :handleFilterChange="handleUserMthdChange"
                    :canComment="canComment" :loggedInUserId="loggedInUserId"
                    defaultSort="JAN-DEC" sorting="['JAN-DEC','DEC-JAN']"
                />
            </div>
            <loader v-else />
        </div>
        <div class="row dashboardchart-container">
            <div class="col-lg-12 col-xl-12 m-b-40px">
                <div class="card">
                <div class="card-header p-10px text-decoration-none">
                    <div class="row no-gutters">
                    <div
                        class="col-lg-12 col-md-12 p-t-4px"
                    >{{$t('emu_output_1')}}</div>
                    </div>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead>
                        <th>{{$t('emu_output_2')}}</th>
                        <th>{{$t('emu_output_3')}}</th>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{{$t('emu_output_4')}}</td>
                            <td>
                            <div class="form-group mb-0">
                                <select class="form-control" id="exampleFormControlSelect1">
                                <option>{{$t('emu_output_5')}}</option>
                                <option>{{$t('emu_output_6')}}</option>
                                <option>{{$t('emu_output_7')}}</option>
                                <option>{{$t('emu_output_8')}}</option>
                                </select>
                            </div>
                            </td>
                        </tr>
                        <tr>
                            <td>{{$t('emu_output_9')}}</td>
                            <td>
                            <div class="form-group mb-0">
                                <select class="form-control" id="exampleFormControlSelect1">
                                <option>{{$t('emu_output_5')}}</option>
                                <option>{{$t('emu_output_6')}}</option>
                                <option>{{$t('emu_output_7')}}</option>
                                <option>{{$t('emu_output_8')}}</option>
                                </select>
                            </div>
                            </td>
                        </tr>
                        <tr>
                            <td>{{$t('emu_output_10')}}</td>
                            <td>
                            <div class="form-group mb-0">
                                <select class="form-control" id="exampleFormControlSelect1">
                                <option>{{$t('emu_output_5')}}</option>
                                <option>{{$t('emu_output_6')}}</option>
                                <option>{{$t('emu_output_7')}}</option>
                                <option>{{$t('emu_output_8')}}</option>
                                </select>
                            </div>
                            </td>
                        </tr>
                        <tr>
                            <td>{{$t('emu_output_11')}}</td>
                            <td>
                            <div class="form-group mb-0">
                                <select class="form-control" id="exampleFormControlSelect1" @change="getMethodData" v-model="category">
                                <option :value="$t('emu_output_5')">{{$t('emu_output_5')}}</option>
                                <option :value="$t('emu_output_6')">{{$t('emu_output_6')}}</option>
                                <option :value="$t('emu_output_7')">{{$t('emu_output_7')}}</option>
                                <option :value="$t('emu_output_8')">{{$t('emu_output_8')}}</option>
                                </select>
                            </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                </div>
                </div>
            </div>
        </div>
        <div class="row dashboardchart-container">
            <div class="col-lg-12 col-xl-12 m-b-40px">
                <div class="card">
                <div class="card-header p-10px text-decoration-none">
                    <div class="row no-gutters">
                    <div class="col-lg-11 col-md-11 p-t-4px">{{$t('emu_output_12')}}</div>
                    <div class="col-lg-1 col-md-1">
                        <download-csv class="btn color-white cursor-pointer w-100 p-0" :data="items">
                            <a href="#" class="color-white">
                                <div class="row no-gutters">
                                  <div class="col text-right">
                                    <p class="m-0px"><i class="fa fa-download mr-2"></i>CSV</p>
                                  </div>
                                </div>
                            </a>
                        </download-csv>
                    </div>
                    </div>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                    <b-table striped sticky-header hover :items="items" :fields="fields"></b-table>
                    </div>
                </div>
                </div>
            </div>
        </div>

        <a class="btn black-btn pointer-events-none color-white" @click="saveFinalEMU" style="margin-bottom: 30px;">
            {{$t('save-EMU')}}
        </a> 
    </div>
</template>
<script>
    import dataM from './dataMassaging';
    import cardComponent from './cardComponent';
    import selectDD from './selectDD';
    import service from '@/service';
    export default{
        props:[
            'outputData',
            'slopeData',
            'surveyData',
            'finalMethodArr',
            'bgData',
            'bAllWomen',
            'userTrendsData',
            'userTrendsDataByMethods',
            'startYear',
            'endYear',
            'location',
            'data',
            'filter',
            'boolVal',
            'year',
            'signOffActive',
            'defaultLevelID',
            'filterYear',
            'userDetails',
            'defaultEMU',
            'emuOuputFinalEMu',
            'initialYear'
        ],
        components:{
            cardComponent,
            selectDD
        },
        data(){
            ////console.log(this.outputData)
            return{
                emuMcprComparisionChart:null,
                annualAvgComparisionChart:null,
                annualComparisionOfMethods:null,
                annualuserTrendsDataByMethods:null,
                saveEmuMcprComp:{},
                saveAnnualAvgComp:{},
                saveCompareMethods:{},
                saveuserTrendsByMethods:{},
                /* PMS:this.bAllWomen ? this.bgData['PMS']['AW'] : this.bgData['PMS']['MW'],
                MICS:this.bAllWomen ? this.bgData['MICS']['AW'] : this.bgData['MICS']['MW'], */
                PMS: this.bgData['PMS'],
                MICS:this.bgData['MICS'],
                bgIndColor : this.bgData['bgIndColor'],
                selectedUserMethod:0,
                userMethodList:null,
                items: [],
                //category: this.sourcecategory,
                category: this.defaultEMU,
                includeCondoms:false,
                //curentYear:this.endYear,
                curentYear:this.year,
                yearFilterList:this.getYearList(),
                options: [],
                canComment: false,
                loggedInUserId: '',
                fields: [],
                sYearArray :[]
            }
        },
        mounted(){
           
        },
        created(){
            let sYear = dataM.getYearFormated(this.initialYear, this.endYear)
            this.sYearArray = sYear.split(";")
            this.getUser()
            this.drawComparisionofEmuMcpr();
            this.drawAnnualAvgComparision();
            this.drawComparisionofUsersByMethods();
            this.drawUserBymethods(true);
            this.getMethodData();
            this.saveFinalEMU();
        },
        methods:{getClass(){
                if(this.signOffActive){
                    return 'col-lg-12 col-xl-12 mb-4'
                }else{
                    return 'col-lg-6 col-xl-6 mb-4'
                }
            },
            getSourceClass(){
                if(this.signOffActive){
                    return 'position: relative;margin-bottom: 7%;'
                }else{
                    return 'position: relative;margin-bottom: 5%;'
                }
            },
            getUser() {
                this.loggedInUserId = this.userDetails.id
                this.canComment = this.$store.getters.getIsAdmin ||
									this.$store.getters.getUserPermissions.canComment
            },
            drawComparisionofEmuMcpr(){
                this.options = []
                let obj = {commoditiesToClients: this.$i18n.t('Commodities_Client'),
                commoditiesToFacilities: this.$i18n.t('Commodities_Facilities'),
                fp_visits: this.$i18n.t('visits'),
                fp_users: this.$i18n.t('users')}

                Object.keys(this.filter).forEach(key=>{
                    if(this.filter[key] == 'inc'){
                        this.options.push({val:this.filter[key],label:obj[key]+' '+this.$i18n.t('inc_condoms')})
                    }else{
                        this.options.push({val:this.filter[key],label:obj[key]+' '+this.$i18n.t('ex_condoms')})
                    }
                })
                
                let aMICS =[]
                aMICS = [{name:this.bAllWomen ? this.$i18n.t('mCPR_AW_MICS') : this.$i18n.t('mCPR_MW_MICS') ,data:[],color:this.bgIndColor['MICS'],keyVal:{}}];
                if(this.MICS){
                    for(let yearInd in this.sYearArray){
                        let year = this.sYearArray[yearInd]
                        aMICS[0].data.push(this.MICS[year] ? this.MICS[year] : null);
                        aMICS[0].keyVal[year] = this.MICS[year] ? this.MICS[year] : null
                    }
                }
                 let unpdData={},unpdtext='';
                if (this.defaultLevelID == this.location.split("/")[0]) {
                    unpdData = this.bgData.UNPD;
                    unpdtext = 'unpd';
                } else {
                    unpdData = this.bgData.FPET;
                    unpdtext = 'fpet';
                }
                let dhsData = this.bgData.DHS ? this.bgData.DHS : {};
                let pmaData = this.bgData.PMA ? this.bgData.PMA : {};
                let bgSureyData = dataM.getUserTrendsDatafromSurvey(this.sYearArray,unpdData,dhsData,pmaData,this.bAllWomen,this.bgData['bgIndColor'],unpdtext);
                let oResponse = dataM.getemuComparisonData(bgSureyData,this.outputData,this.filter)
               // let oResponse =  dataM.getEMUOPCompChart(this.outputData, this.filter);
                //oResponse.title = this.bAllWomen ? "Comparing EMUs and mCPR (AWRA)" : 'Comparing EMUs and mCPR (MWRA)';
                oResponse.source = this.category;
                oResponse.xTitle = this.data['Output']['derivedCharts'][0]['chartOptions']['xAxis']['text'];
                oResponse.yTitle = this.data['Output']['derivedCharts'][0]['chartOptions']['yAxis']['text'];
                oResponse.type = "line";
                oResponse.title = this.data['Output']['derivedCharts'][0]['chartOptions']['chartName']
                oResponse.disable = this.data['Output']['derivedCharts'][0]['chartOptions']['disableChart']
                oResponse.chartInfo = this.data['Output']['derivedCharts'][0]['chartOptions']['chartInfo']
                oResponse.cid = this.data['Output']['derivedCharts'][0]['chartOptions']['cid']
                //oResponse.data = [...oResponse.data,...aPMC,...aMICS];
                oResponse.data = [...oResponse.data,...aMICS];
                oResponse.fields = []
                oResponse.tableData = []
                oResponse.fields.push({key: this.$i18n.t('period'), sortable: true})
                oResponse.categories.forEach((cat, i)=>{
                    let row = {}
                    row[this.$i18n.t('period')] = cat
                    oResponse.data.forEach(d=>{
                        if(oResponse.fields.indexOf(d.name) == -1){
                            oResponse.fields.push(d.name)
                        }
                        row[d.name] = d.data[i]
                    })
                    oResponse.tableData.push(row)
                })
                this.emuMcprComparisionChart = oResponse;
                this.saveEmuMcprComp.categories = oResponse.categories
                this.saveEmuMcprComp.data = this.emuMcprComparisionChart.data
                this.saveEmuMcprComp.cid = oResponse.cid
                this.saveEmuMcprComp.tableData = this.emuMcprComparisionChart.tableData
                this.saveEmuMcprComp.type = oResponse.type
                this.saveEmuMcprComp.reportChartType = oResponse.type
                this.saveEmuMcprComp.isPeriodChart = true
               // this.getMethodData();
            },
            drawAnnualAvgComparision(){
                ////console.log(this.slopeData)
                let oResponse = dataM.getSlopData(this.emuMcprComparisionChart);
                oResponse.title = this.data['Output']['derivedCharts'][1]['chartOptions']['chartName']
                oResponse.source = this.category;
                oResponse.xTitle = this.data['Output']['derivedCharts'][1]['chartOptions']['xAxis']['text'];
                oResponse.yTitle = this.data['Output']['derivedCharts'][1]['chartOptions']['yAxis']['text'];
                oResponse.disable = this.data['Output']['derivedCharts'][1]['chartOptions']['disableChart']
                oResponse.chartInfo = this.data['Output']['derivedCharts'][1]['chartOptions']['chartInfo']
                oResponse.cid = this.data['Output']['derivedCharts'][1]['chartOptions']['cid']
                oResponse.type = "bar";
                this.annualAvgComparisionChart = oResponse;
                this.saveAnnualAvgComp.categories = oResponse.categories
                this.saveAnnualAvgComp.data = oResponse.data
                this.saveAnnualAvgComp.cid = oResponse.cid
                this.saveAnnualAvgComp.tableData = oResponse.tableData
                this.saveAnnualAvgComp.type = oResponse.type
                this.saveAnnualAvgComp.reportChartType = oResponse.type
                this.saveAnnualAvgComp.isPeriodChart = false
            },
            drawComparisionofUsersByMethods(){
                let oRet = dataM.emuOutputCompByMethod(this.curentYear,this.sYearArray,this.userTrendsData,this.surveyData,this.finalMethodArr,this.emuOuputFinalEMu)
                let retData = oRet.data ? oRet.data.reverse() : []
                this.saveCompareMethods = {}
                let oResponse = {
                    data:retData,
                    title : this.data['Output']['derivedCharts'][2]['chartOptions']['chartName'],
                    source : this.category,
                    xTitle : this.data['Output']['derivedCharts'][2]['chartOptions']['xAxis']['text'],
                    yTitle : this.data['Output']['derivedCharts'][2]['chartOptions']['yAxis']['text'],
                    type:'bar',
                    categories:oRet.categories,
                    disable: this.data['Output']['derivedCharts'][2]['chartOptions']['disableChart'],
                    chartInfo: this.data['Output']['derivedCharts'][2]['chartOptions']['chartInfo'],
                    cid: this.data['Output']['derivedCharts'][2]['chartOptions']['cid'],
                    tableData: oRet.tableData,
                    fields: oRet.fields
                }
                this.annualComparisionOfMethods = oResponse;
                this.saveCompareMethods.categories = oResponse.categories
                this.saveCompareMethods.data = oResponse.data
                this.saveCompareMethods.cid = oResponse.cid
                this.saveCompareMethods.tableData = oResponse.tableData
                this.saveCompareMethods.type = oResponse.type
                this.saveCompareMethods.reportChartType = oResponse.type
                this.saveCompareMethods.isPeriodChart = false
            },
            drawUserBymethods(p_bFlag){
                let oRet = dataM.emuOutputUserByMethod(this.sYearArray,this.userTrendsData,this.finalMethodArr,this.emuOuputFinalEMu),aCategories = Object.keys(oRet),sMethod;
                this.saveuserTrendsByMethods = oRet;
                this.saveuserTrendsByMethods.type = 'line'
                this.saveuserTrendsByMethods.reportChartType ='line'
                this.saveuserTrendsByMethods.isPeriodChart = true
                this.userMethodList = aCategories;
                if(p_bFlag){
                    this.selectedUserMethod = 0;
                }
                sMethod = this.userMethodList[this.selectedUserMethod];
                ////console.log(oRet[sMethod], 'emuOutputData')
                let newMdata = oRet[sMethod] && oRet[sMethod].data ? oRet[sMethod].data : []
                if(sMethod){
                this.annualuserTrendsDataByMethods = {
                    data:newMdata,
                    title : this.data['Output']['derivedCharts'][3]['chartOptions']['chartName'],
                    source : this.category,
                    xTitle : this.data['Output']['derivedCharts'][3]['chartOptions']['xAxis']['text'],
                    yTitle : this.data['Output']['derivedCharts'][3]['chartOptions']['yAxis']['text'],
                    type:'line',
                    disable: this.data['Output']['derivedCharts'][3]['chartOptions']['disableChart'],
                    chartInfo: this.data['Output']['derivedCharts'][3]['chartOptions']['chartInfo'],
                    cid: this.data['Output']['derivedCharts'][3]['chartOptions']['cid'],
                    categories:oRet[sMethod].categories,
                    tableData: oRet[sMethod].tableData,
                    fields: oRet[sMethod].fields
                };
                
                }
            },
            getMethodData(){
                localStorage.setItem("methodCategory", this.category);
                this.items = []
                let data = this.emuMcprComparisionChart.data.filter(d => d.name == this.category)
                this.emuMcprComparisionChart.categories.forEach((res, i)=>{
                    if(data[0].data[i]){
                        this.items.push({[this.$i18n.t('year')]: res, [this.$i18n.t('EMU')]: Number(data[0].data[i]).toFixed(2), [this.$i18n.t('service_type')]: data[0].name})
                    }
                })
            },
            handleUserMthdChange(e){
                this.selectedUserMethod = e.target.value;
                this.drawUserBymethods()
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
                return aFinalList;
            },
            saveFinalEMU(){ 
                console.log("saveFinalEMU method is called");
                this.saveEmuMcprComp.source = this.category
                this.saveAnnualAvgComp.source = this.category
                this.saveCompareMethods.source = this.category
                //this.saveuserTrendsByMethods.source = this.category
                ////console.log(this.$store.state.methodTable)
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
                            if (oResponse['compEMU']) {
                                oResponse['compEMU'] = JSON.parse(oResponse['compEMU'])
                                oResponse['compEMU'][this.location.split('/')[1]] = this.saveEmuMcprComp;
                            } else {
                                oResponse['compEMU'] = {
                                    [this.location.split('/')[1]]: this.saveEmuMcprComp
                                }
                            }

                            if (oResponse['compAvgAnuual']) {
                                oResponse['compAvgAnuual'] =JSON.parse(oResponse['compAvgAnuual'])
                                oResponse['compAvgAnuual'][this.location.split('/')[1]] = this.saveAnnualAvgComp;
                            } else {
                                oResponse['compAvgAnuual'] = {
                                    [this.location.split('/')[1]]: this.saveAnnualAvgComp
                                }
                            }

                            if (oResponse['compUsers']) {
                                oResponse['compUsers'] = JSON.parse(oResponse['compUsers'])
                                oResponse['compUsers'][this.location.split('/')[1]] = this.saveCompareMethods;
                            } else {
                                oResponse['compUsers'] = {
                                    [this.location.split('/')[1]]: this.saveCompareMethods
                                }
                            }
                            if (oResponse['usersTrend']) {
                                oResponse['usersTrend'] = JSON.parse(oResponse['usersTrend'])
                                oResponse['usersTrend'][this.location.split('/')[1]] = this.saveuserTrendsByMethods;
                            } else {
                                oResponse['usersTrend'] = {
                                    [this.location.split('/')[1]]: this.saveuserTrendsByMethods
                                }
                            }
                                if (oResponse['methodTable']) {
                                    oResponse['methodTable'] = JSON.parse(oResponse['methodTable'])
                                    oResponse['methodTable'][this.location.split('/')[1]] = this.$store.state.methodTable ? this.$store.state.methodTable[this.location.split('/')[1]] :null
                                } else {
                                    oResponse['methodTable'] = {
                                        [this.location.split('/')[1]]:  this.$store.state.methodTable ? this.$store.state.methodTable[this.location.split('/')[1]] :null
                                    }
                                }
                            oResponse['emuColors'] = JSON.parse(localStorage.getItem('emuColors'))
                            oResponse['compEMU'] = JSON.stringify(oResponse['compEMU'])
                            oResponse['compAvgAnuual'] = JSON.stringify(oResponse['compAvgAnuual'])
                            oResponse['compUsers'] = JSON.stringify(oResponse['compUsers'])
                            oResponse['usersTrend'] = JSON.stringify(oResponse['usersTrend'])
                            oResponse['methodTable'] = JSON.stringify(oResponse['methodTable'])
                            service.updateConfig(oResponse, key).then((RES) => {
                                this.$store.commit('setEMUMethodTable', null)
                                this.$store.commit('setEMUColors', null)
                                this.$emit("saveEMUAuto",this.location)
                               
                            })
                            
                        });
                    }else{
                        let compEMUObj = {[this.location.split('/')[1]]: this.saveEmuMcprComp},
                        compAvgAnuualObj = {[this.location.split('/')[1]]: this.saveAnnualAvgComp},
                        compUsersObj = {[this.location.split('/')[1]]: this.saveCompareMethods},
                        usersTrendObj = {[this.location.split('/')[1]]: this.saveuserTrendsByMethods},
                        methodTable = {[this.location.split('/')[1]]:this.$store.state.methodTable ? this.$store.state.methodTable[this.location.split('/')[1]] :null}


                       dataStore = {'compEMU': JSON.stringify(compEMUObj),
                       'compAvgAnuual': JSON.stringify(compAvgAnuualObj),
                       'compUsers': JSON.stringify(compUsersObj),
                       'usersTrend': JSON.stringify(usersTrendObj),
                       'methodTable': JSON.stringify(methodTable),
                       'emuColors': JSON.parse(localStorage.getItem('emuColors'))}
                       service.saveConfig(dataStore, key).then((RES) => {
                           // //console.log(JSON.parse(RES));
                            this.$store.commit('setEMUMethodTable', null)
                            this.$store.commit('setEMUColors', null)
                            this.$emit("saveEMUAuto",this.location)     
                        //    this.$swal({
                        //         title: this.$i18n.t('data_saved_successfully'),
                        //         confirmButtonText: this.$i18n.t('ok'),
                        //         type: 'success'
                        //     })
                        })

                    //    this.saveLocalStorage(key, this.emuMcprComparisionChart, 'compEMU')
                    //    this.saveLocalStorage(key, this.annualAvgComparisionChart, 'compAvgAnuual')
                    //    this.saveLocalStorage(key, this.annualComparisionOfMethods, 'compUsers')
                    //    this.saveLocalStorage(key, this.userTrendsDataByMethods, 'usersTrend')
                    }
                })
            },
            saveLocalStorage(key, emuData, chart){
                let metaConfigData = localStorage.getItem("metaConfig");
                // //console.log("metaConfigData", metaConfigData);
                if (metaConfigData) {
                    metaConfigData = JSON.parse(localStorage.getItem("metaConfig"));
                    ////console.log(metaConfigData)
                    if (metaConfigData[key]) {
                        if (metaConfigData[key][chart]) {
                            metaConfigData[key][chart][this.location.split('/')[1]] = emuData;
                        } else {
                            metaConfigData[key][chart] = {
                            [this.location.split('/')[1]]: emuData
                            }
                        }
                    } else {
                    metaConfigData[key] = {
                            [chart]: {
                            [this.location.split('/')[1]]: emuData
                            }
                        }
                    }
                } else {
                    metaConfigData = {
                        [key]: {
                            [chart]: {
                            [this.location.split('/')[1]]: emuData
                            }
                        }
                    }
                }
                localStorage.setItem("metaConfig", JSON.stringify(metaConfigData));
                 this.$swal({
                    title: this.$i18n.t('data_saved_successfully'),
                    confirmButtonText: this.$i18n.t('ok'),
                    type: 'success'
                })
            },
        },
        watch:{
            year(newVal){
                if(newVal){
                    this.curentYear = newVal;
                    this.drawComparisionofUsersByMethods();
                }
            },
            userTrendsDataByMethods(newval){
                this.drawComparisionofEmuMcpr();
                this.drawAnnualAvgComparision();
                this.drawComparisionofUsersByMethods();
                this.drawUserBymethods(true);
                this.getMethodData();
                this.saveFinalEMU();
            }
            // boolVal(newV){
            //     //console.log(newV)
            //     this.options = []
            //     this.drawComparisionofEmuMcpr()
            //     this.drawAnnualAvgComparision()
            // },
            // bgData(newVal){
            //    // //console.log(newVal)
            //     this.PMS = newVal['PMS']
            //     this.MICS = newVal['MICS']
            //     this.drawComparisionofEmuMcpr()
            //     this.drawAnnualAvgComparision()
            // }
        }
    }
</script>
<style scoped lang="scss">
 .condom-filter{
    position: absolute;
    /* top: -25px; */
    right: 110px;
    width: auto;
    font-size: 0.875rem;
    padding: 12px 12px;
    background-color: #2e2e48;
    border-color: #2e2e48;

    span{
        padding: 0;
        background-color: #2e2e48;
        border-color: #2e2e48;
        border-right: 1px solid #fff;
        margin-right: 14px;
        padding-right: 12px;
    }
    span:last-child{
        border-right: 0px solid #fff;
    }
 }

 .newGreen-theme .condom-filter{
    position: absolute;
    /* top: -25px; */
    right: 110px;
    width: auto;
    font-size: 0.875rem;
    padding: 12px 12px;
    background-color: #0c5327;
    border-color: #0c5327;

    span{
        padding: 0;
        background-color: #0c5327;
        border-color: #0c5327;
        border-right: 1px solid #fff;
        margin-right: 14px;
        padding-right: 12px;
    }
    span:last-child{
        border-right: 0px solid #fff;
    }
 }

 .newBlack-theme .condom-filter{
    position: absolute;
    /* top: -25px; */
    right: 114px;
    width: auto;
    font-size: 0.75rem;
    padding: 12px 12px;
    background-color: #0b0c10;
    border-color: #0b0c10;

    span{
        padding: 0;
        background-color: #0b0c10;
        border-color: #0b0c10;
        border-right: 1px solid #fff;
        margin-right: 14px;
        padding-right: 12px;
    }
    span:last-child{
        border-right: 0px solid #fff;
    }
 }
 
 .top-date-page-div {
  position: absolute;
  top: 0;
  right: 15px;

  span {
    background-color: #2e2e48;
    border-color: #2e2e48;
    font-size: 0.875rem;
    padding: 12px 12px;
  }
  span:hover {
    background-color: #2e2e48;
    border-color: #2e2e48;
  }
}
.newGreen-theme .top-date-page-div {
  position: absolute;
  top: 0;
  right: 15px;

  span {
    background-color: #0c5327;
    border-color: #0c5327;
    font-size: 0.875rem;
    padding: 12px 12px;
  }
  span:hover {
    background-color: #0c5327;
    border-color: #0c5327;
  }
}

.newBlack-theme .top-date-page-div {
  position: absolute;
  top: 0px;
  right: 15px;

  span {
    background-color: #0b0c10;
    border-color: #0b0c10;
    font-size: 0.75rem;
    padding: 12px;
  }
  span:hover {
    background-color: #0b0c10;
    border-color: #0b0c10;
  }
}
</style>


</style>
