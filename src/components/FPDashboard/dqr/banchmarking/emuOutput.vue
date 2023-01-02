<template>
    <div>
        <div class="row">
            <!-- <div class="col-3 my-3">
                <selectDD
                    :ddVal="includeCondoms"
                    :ddoptions="[{val:true,label:'EMU: Commodities inc. Condoms'},{val:false,label:'EMU: Commodities ex. Condoms'}]"
                    :onChangeFn="onConChange"
                />
            </div> -->

            <!-- <div class="col-3 my-3">
                <selectDD
                    :ddVal="curentYear"
                    :ddoptions="yearFilterList"
                    :onChangeFn="onYearChange"
                />
            </div> -->
        </div>
        <div class="row" v-bind:style="getSourceClass()">
            <div class="col-lg-12">
                <div class="btn condom-filter">
                    <span v-for="(option, i) in options" :key="i" class="pointer-events-none color-white fs-17-1920">
                        {{option.label}}
                    </span>
                </div>
            </div>
        </div>
        <div class="row dashboardchart-container">

            <div v-bind:class="getClass()" v-if="emuMcprComparisionChart">
                <card-component
                    :chartdata="emuMcprComparisionChart" :canComment="canComment" :loggedInUserId="loggedInUserId"
                />
            </div>

            <div v-bind:class="getClass()" v-if="annualAvgComparisionChart">
                <card-component
                    :chartdata="annualAvgComparisionChart" :canComment="canComment" :loggedInUserId="loggedInUserId"
                />
            </div>
        </div>

        <div class="row dashboardchart-container">

            <div v-bind:class="getClass()" v-if="annualComparisionOfMethods">
                <card-component
                    :chartdata="annualComparisionOfMethods" :canComment="canComment" :loggedInUserId="loggedInUserId"
                />
            </div>


            <div v-bind:class="getClass()" v-if="annualuserTrendsDataByMethods">
                <card-component
                    :chartdata="annualuserTrendsDataByMethods"
                    :ddOptions="userMethodList"
                    :handleFilterChange="handleUserMthdChange"
                    :canComment="canComment" :loggedInUserId="loggedInUserId"
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
                    <!-- <div class="col-lg-5 col-md-5"></div> -->
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
                                <option value="EMU :Commodities to clients">{{$t('emu_output_5')}}</option>
                                <option value="EMU :Commodities to facilitlity">{{$t('emu_output_6')}}</option>
                                <option value="EMU :FP visits">{{$t('emu_output_7')}}</option>
                                <option value="EMU :FP users">{{$t('emu_output_8')}}</option>
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
            <div class="col-lg-12 col-xl-12 mb-4">
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
                    <b-table striped sticky-header hover :items="items"></b-table>
                    </div>
                </div>
                </div>
            </div>
        </div>

        <a class="btn black-btn pointer-events-none color-white float-right" @click="saveFinalEMU" style="margin-bottom: 30px;">
            {{$t('save-EMU')}}
        </a>
    </div>
</template>
<script>
    import dataM from './dataMassaging';
    import cardComponent from './cardComponent';
    import selectDD from './selectDD';
    import service from '@/service/service.js';
    export default{
        props:[
            'outputData',
            'slopeData',
            'bgData',
            'bAllWomen',
            'userTrendsData',
            'userTrendsDataByMethods',
            'startYear',
            'endYear',
            'locationVal',
            'sourcecategory',
            'data',
            'filter',
            'boolVal',
            'year',
            'signOffActive',
            'defaultLevelID'
        ],
        components:{
            cardComponent,
            selectDD
        },
        // watch:{
        //     boolVal(newV){
        //         this.options = []
        //         this.drawComparisionofEmuMcpr()
        //         this.drawAnnualAvgComparision()
        //     }
        // },
        data(){
            console.log(this.bgData)
            return{
                emuMcprComparisionChart:null,
                annualAvgComparisionChart:null,
                annualComparisionOfMethods:null,
                annualuserTrendsDataByMethods:null,
                /* PMS:this.bAllWomen ? this.bgData['PMS']['AW'] : this.bgData['PMS']['MW'],
                MICS:this.bAllWomen ? this.bgData['MICS']['AW'] : this.bgData['MICS']['MW'], */
                PMS: this.bgData['PMS'],
                MICS:this.bgData['MICS'],
                selectedUserMethod:0,
                userMethodList:null,
                items: [],
                category: this.sourcecategory,
                includeCondoms:false,
                curentYear:this.endYear,
                yearFilterList:this.getYearList(),
                options: [],
                canComment: false,
                loggedInUserId: '',
                sourceName: ''
            }
        },
        mounted(){
            this.getUser()
            this.drawComparisionofEmuMcpr();
            this.drawAnnualAvgComparision();
            this.drawComparisionofUsersByMethods();
            this.drawUserBymethods(true);
            this.getMethodData();
            //this.saveFinalEMU();
        },
        methods:{
            getClass(){
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
            drawComparisionofEmuMcpr(){
                let obj = {commoditiesToClients: 'Commodities Distributed to Clients',
                commoditiesToFacilities: 'Commodities Distributed to Facilities',
                fp_visits: 'FP Visits',
                fp_users: 'FP Users'}
                Object.keys(this.filter).forEach(key=>{
                    if(this.filter[key] == 'inc'){
                        this.options.push({val:this.filter[key],label:obj[key]+' inc. Condoms'})
                    }else{
                        this.options.push({val:this.filter[key],label:obj[key]+ ' ex. Condoms'})
                    }
                })

                //Commented for now once admin is built can be redevelope
                let //aPMC = [{name:this.bAllWomen ? 'mCPR (AW) : PMA' : 'mCPR (MW) : PMA',data:[]}],
                    aMICS = [{name:this.bAllWomen ? 'mCPR (AW) : MICS' : 'mCPR (MW) : MICS' ,data:[]}];
                // for(let k in this.PMS){
                //     aPMC[0].data.push(this.PMS[k] ? this.PMS[k] : null);
                // }
                for(let l in this.MICS){
                    aMICS[0].data.push(this.MICS[l] ? this.MICS[l] : null);
                }
                let oResponse =  dataM.getEMUOPCompChart(this.outputData,this.includeCondoms, this.filter);
                //console.log(oResponse)
                //oResponse.title = this.bAllWomen ? "Comparing EMUs and mCPR (AWRA)" : 'Comparing EMUs and mCPR (MWRA)';
                oResponse.source = "";
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
                oResponse.fields.push({key: 'Period', sortable: true})
                oResponse.categories.forEach((cat, i)=>{
                    let row = {}
                    row['Period'] = cat
                    oResponse.data.forEach(d=>{
                        if(oResponse.fields.indexOf(d.name) == -1){
                            oResponse.fields.push(d.name)
                        }
                        row[d.name] = d.data[i]
                    })
                    oResponse.tableData.push(row)
                })

                this.emuMcprComparisionChart = oResponse;
                this.getMethodData();
            },
            drawAnnualAvgComparision(){
                let oResponse = dataM.getComparisionofEmuMcpr(this.slopeData,this.includeCondoms,this.MICS,this.PMS,this.bAllWomen, this.filter, this.locationVal.split('/')[0], this.defaultLevelID);
                oResponse.title = this.data['Output']['derivedCharts'][1]['chartOptions']['chartName']
                oResponse.source = "";
                oResponse.xTitle = this.data['Output']['derivedCharts'][1]['chartOptions']['xAxis']['text'];
                oResponse.yTitle = this.data['Output']['derivedCharts'][1]['chartOptions']['yAxis']['text'];
                oResponse.disable = this.data['Output']['derivedCharts'][1]['chartOptions']['disableChart']
                oResponse.chartInfo = this.data['Output']['derivedCharts'][1]['chartOptions']['chartInfo']
                oResponse.cid = this.data['Output']['derivedCharts'][1]['chartOptions']['cid']
                oResponse.type = "bar";
                this.annualAvgComparisionChart = oResponse;
            },
            drawComparisionofUsersByMethods(){
                let oRet = dataM.getComparisionofUsersByMethods(this.userTrendsData,this.curentYear),
                oResponse = {
                    data:oRet.data,
                    title : this.data['Output']['derivedCharts'][2]['chartOptions']['chartName'],
                    source : "",
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
            },
            drawUserBymethods(p_bFlag){
                let oRet = dataM.drawEMUUserbyMethods(this.userTrendsDataByMethods),
                    aCategories = Object.keys(oRet),sMethod;
                this.userMethodList = aCategories;
                if(p_bFlag){
                    this.selectedUserMethod = 0;
                }
                sMethod = this.userMethodList[this.selectedUserMethod];
                if(sMethod){
                this.annualuserTrendsDataByMethods = {
                    data:oRet[sMethod].data,
                    title : this.data['Output']['derivedCharts'][3]['chartOptions']['chartName'],
                    source : "",
                    xTitle : this.data['Output']['derivedCharts'][3]['chartOptions']['xAxis']['text'],
                    yTitle : this.data['Output']['derivedCharts'][3]['chartOptions']['yAxis']['text'],
                    type:'line',
                    disable: this.data['Output']['derivedCharts'][3]['chartOptions']['disableChart'],
                    chartInfo: this.data['Output']['derivedCharts'][3]['chartOptions']['chartInfo'],
                    cid: this.data['Output']['derivedCharts'][3]['chartOptions']['cid'],
                    categories:oRet[sMethod].categories,
                    tableData: oRet[sMethod].tableData,
                    fields: oRet[sMethod].fields
                };}
            },
            getMethodData(){
                this.items = []
                let data = this.emuMcprComparisionChart.data.filter(d => d.name === this.category)
                //console.log(data)
                this.emuMcprComparisionChart['source'] = data[0].name
                this.sourceName = data[0].name
                this.emuMcprComparisionChart.categories.forEach((res, i)=>{
                    this.items.push({"Year": res, "EMU": Number(data[0].data[i]).toFixed(2), "Service Statistics Type": data[0].name})
                })
            },
            handleUserMthdChange(e){
                this.selectedUserMethod = e.target.value;
                this.drawUserBymethods()
            },
            onConChange(p_val){
                this.includeCondoms = p_val === 'true';
                this.drawComparisionofEmuMcpr();
                this.drawAnnualAvgComparision();
            },
            onYearChange(p_val){
                this.curentYear = p_val;
                this.drawComparisionofUsersByMethods();
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
                this.annualAvgComparisionChart['source'] = this.sourceName
                this.annualComparisionOfMethods['source'] = this.sourceName
                this.userTrendsDataByMethods['source'] = this.sourceName
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
                this.bshowLoader = true;
                let allKeys = service.getAllKeys()
                allKeys.then(keys => {
                    if (keys.data.includes(key)) {
                        let oConfig = service.getSavedConfig(key);
                        oConfig.then((response) => {
                            let oResponse = response.data;

                            if (oResponse['compEMU']) {
                                if (oResponse['compEMU'][this.locationVal.split('/')[1]]) {
                                    oResponse['compEMU'][this.locationVal.split('/')[1]] = this.emuMcprComparisionChart;
                                } else {
                                    oResponse['compEMU'] = {
                                        ...oResponse['compEMU'],
                                    [this.locationVal.split('/')[1]]: this.emuMcprComparisionChart
                                    }
                                }
                            } else {
                                oResponse['compEMU'] = {
                                    [this.locationVal.split('/')[1]]: this.emuMcprComparisionChart
                                }
                            }

                            if (oResponse['compAvgAnuual']) {
                                if (oResponse['compAvgAnuual'][this.locationVal.split('/')[1]]) {
                                    oResponse['compAvgAnuual'][this.locationVal.split('/')[1]] = this.annualAvgComparisionChart;
                                } else {
                                    oResponse['compAvgAnuual'] = {
                                        ...oResponse['compAvgAnuual'],
                                    [this.locationVal.split('/')[1]]: this.annualAvgComparisionChart
                                    }
                                }
                            } else {
                                oResponse['compAvgAnuual'] = {
                                    [this.locationVal.split('/')[1]]: this.annualAvgComparisionChart
                                }
                            }

                            if (oResponse['compUsers']) {
                                if (oResponse['compUsers'][this.locationVal.split('/')[1]]) {
                                    oResponse['compUsers'][this.locationVal.split('/')[1]] = this.annualComparisionOfMethods;
                                } else {
                                    oResponse['compUsers'] = {
                                        ...oResponse['compUsers'],
                                    [this.locationVal.split('/')[1]]: this.annualComparisionOfMethods
                                    }
                                }
                            } else {
                                oResponse['compUsers'] = {
                                    [this.locationVal.split('/')[1]]: this.annualComparisionOfMethods
                                }
                            }

                            if (oResponse['usersTrend']) {
                                if (oResponse['usersTrend'][this.locationVal.split('/')[1]]) {
                                    oResponse['usersTrend'][this.locationVal.split('/')[1]] = this.userTrendsDataByMethods;
                                } else {
                                    oResponse['usersTrend'] = {
                                        ...oResponse['usersTrend'],
                                    [this.locationVal.split('/')[1]]: this.userTrendsDataByMethods
                                    }
                                }
                            } else {
                                oResponse['usersTrend'] = {
                                    [this.locationVal.split('/')[1]]: this.userTrendsDataByMethods
                                }
                            }

                            service.updateConfig(oResponse, key)
                            this.saveLocalStorage(key, this.emuMcprComparisionChart, 'compEMU')
                            this.saveLocalStorage(key, this.annualAvgComparisionChart, 'compAvgAnuual')
                            this.saveLocalStorage(key, this.annualComparisionOfMethods, 'compUsers')
                            this.saveLocalStorage(key, this.userTrendsDataByMethods, 'usersTrend')
                        });
                    }else{
                       dataStore = {'compEMU': {[this.locationVal.split('/')[1]]: this.emuMcprComparisionChart},
                       'compAvgAnuual': {[this.locationVal.split('/')[1]]: this.annualAvgComparisionChart},
                       'compUsers': {[this.locationVal.split('/')[1]]: this.annualComparisionOfMethods},
                       'usersTrend': {[this.locationVal.split('/')[1]]: this.userTrendsDataByMethods}}
                       service.saveConfig(dataStore, key)
                       this.saveLocalStorage(key, this.emuMcprComparisionChart, 'compEMU')
                       this.saveLocalStorage(key, this.annualAvgComparisionChart, 'compAvgAnuual')
                       this.saveLocalStorage(key, this.annualComparisionOfMethods, 'compUsers')
                       this.saveLocalStorage(key, this.userTrendsDataByMethods, 'usersTrend')
                    }
                })
            },
            saveLocalStorage(key, emuData, chart){
                let metaConfigData = localStorage.getItem("metaConfig");
                // console.log("metaConfigData", metaConfigData);
                if (metaConfigData) {
                    metaConfigData = JSON.parse(localStorage.getItem("metaConfig"));
                    //console.log(metaConfigData)
                    if (metaConfigData[key]) {
                        if (metaConfigData[key][chart]) {
                            metaConfigData[key][chart][this.locationVal.split('/')[1]] = emuData;
                        } else {
                            metaConfigData[key][chart] = {
                            [this.locationVal.split('/')[1]]: emuData
                            }
                        }
                    } else {
                    metaConfigData[key] = {
                            [chart]: {
                            [this.locationVal.split('/')[1]]: emuData
                            }
                        }
                    }
                } else {
                    metaConfigData = {
                        [key]: {
                            [chart]: {
                            [this.locationVal.split('/')[1]]: emuData
                            }
                        }
                    }
                }
                localStorage.setItem("metaConfig", JSON.stringify(metaConfigData));
                 this.$swal({
                   title: this.$i18n.t('data_saved_successfully')
                })
                this.bshowLoader =false;
            },
        },
        watch:{
            year(newVal){
                if(newVal){
                    this.curentYear = newVal.toString();
                    this.drawComparisionofUsersByMethods();
                }
            },
            locationVal(newVal){
                console.log(newVal)
            },
            boolVal(newV){
                this.options = []
                this.drawComparisionofEmuMcpr()
                this.drawAnnualAvgComparision()
            },
            bgData(newVal){
                //console.log(newVal)
                this.PMS = newVal['PMS']
                this.MICS = newVal['MICS']
                this.drawComparisionofEmuMcpr()
                this.drawAnnualAvgComparision()
            }
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
    right: 110px;
    width: auto;
    font-size: 0.875rem;
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


</style>
