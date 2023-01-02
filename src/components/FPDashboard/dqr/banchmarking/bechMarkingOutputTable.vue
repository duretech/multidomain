<template>
    <div class="card">
        <div class="card-header p-10px text-decoration-none">
            <div class="row no-gutters">
                <div class="col-lg-11 col-md-7 p-t-4px">
                  <i class="fa fa-info-circle color-white cursor-pointer chart-info p-t-5px mr-2" aria-hidden="true" v-b-popover.hover.rightbottom="{ variant: 'info',  content: chartInfo, title: tableHeading, html: true }"></i>
                    {{tableHeading}}</div>
                <div class="col-lg-1 col-md-5 text-right">
                    <div class="row no-gutters">
                        <div class="col-lg-11 col-md-11 text-right">
                            <download-csv v-if="rows" :data="rows">
                                <img :src="require('../../../assets/img/icons/export.png')" class="img" />
                            </download-csv>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-body pb-0 ">
            <b-table hover v-if="fields && rows" :items="rows" bordered
                :fields="fields" responsive
            />
        </div>
        <div class="card-footer text-right">
            <p class="m-0">
                {{$t('source')}}:
                <span>DHIS2</span>
            </p>
        </div>
    </div>
</template>
<script>
    import dataM from '../banchmarking/dataMassaging';
    export default {
        props:['data', 'tableHeading', 'chartInfo'],
        data(){
            return{
                fields:null,
                rows:null,
                newData: this.data
            }
        },
        mounted(){
            this.getDesiredDataFormat();
        },
        watch:{
            data(newVal){
                console.log(newVal)
                this.newData = newVal
                this.getDesiredDataFormat();
            }
        },
        methods:{
            getDesiredDataFormat(){

                /* let i = 0, nLen = this.data.length,
                    oFinalData = {},aFinalCats = [];
                for(i = 0; i < nLen;i++){
                    let sProp = this.data[i].title;
                    if(sProp.toLowerCase() === 'total cyp'){
                        aFinalCats = this.data[i].categories;
                    }else{
                        oFinalData[sProp] = {data:this.data[i].data,cats:this.data[i].categories};
                    }
                } */

                let i, oData = this.newData,aFinalCats = undefined,oFinalData = {};
                for(i in oData){
                    let sMethod = i.split('__')[0],
                        sSubMethod = i.split('__')[1],
                        oTemp = {name:sSubMethod, data:[]},
                        aCats = Object.keys(oData[i]);
                    if(!oFinalData[sMethod]){
                        oFinalData[sMethod] = {cats:aCats,data:[]};
                    }
                    if(!aFinalCats){
                        aFinalCats = aCats;
                    }
                    for(let j in oData[i]){
                        oTemp.data.push(oData[i][j]);
                    }
                    oFinalData[sMethod].data.push(oTemp);
                }

                let oAllMethods = {},oLongTerm = {},oShortTerm = {};
                for(let j in oFinalData){
                    oAllMethods[j] = dataM.getTableFormatedData(oFinalData[j],aFinalCats);
                }
                this.fields = ['Methods','Sub-Methods',...aFinalCats];
                this.rows = [];
                let oSumModernUsers = {},oSumModernUsersexCon = {};
                for(let k in oAllMethods){
                    let bFlag = true;
                    for(let l in oAllMethods[k]){
                        let oRow = {Methods:bFlag ? k.toUpperCase() : '','Sub-Methods':l},bIsCon = k.toLowerCase() === 'condom';
                        for(let m in oAllMethods[k][l]){
                            oAllMethods[k][l][m] = oAllMethods[k][l][m] ? oAllMethods[k][l][m] : 0;
                            oRow[m] = oAllMethods[k][l][m].toLocaleString();
                            oSumModernUsers[m] = (oSumModernUsers[m] || 0) + oAllMethods[k][l][m];
                            if(!bIsCon){
                                oSumModernUsersexCon[m] = (oSumModernUsersexCon[m] || 0) + oAllMethods[k][l][m];
                            }
                        }
                        bFlag = false;
                        this.rows.push(oRow);
                    }
                }
                let oRows1 = {Methods:'Estimated Modern Users','Sub-Methods':'',_rowVariant:'customclass'},
                    oRows2 = {Methods:'Estimated Modern Users ex Condoms**','Sub-Methods':'',_rowVariant:'customclass'};
                for(let x in oSumModernUsersexCon){
                    oRows1[x] = oSumModernUsers[x].toLocaleString();
                    oRows2[x] = oSumModernUsersexCon[x].toLocaleString();
                }

                this.rows.push(oRows1);
                this.rows.push(oRows2);

            }
        }
    }
</script>
<style >
    .table-customclass{
        background-color: #e0e0e0;
        font-weight: bold;
    }
    .table-bordered th, .table-bordered td {
        border: 1px solid #dee2e6;
    }
</style>
