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
                                <img :src="require('@/assets/img/icons/download_new.png')" class="img cursor-pointer" v-b-tooltip.hover :title="$t('downloadIcon')"/>
                            </download-csv>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-body pb-0 ">
            <b-table hover v-if="fields && rows" :items="rows" bordered
                :fields="fields" responsive class="methodsTable"
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
    import dataM from "./dataMassaging.js";
    export default {
        props:['data', 'tableHeading', 'chartInfo', 'methodSeq', 'source', 'location'],
        data(){
            //console.log(this.source, this.location)
            return{
                fields:null,
                rows:null,
                newData: this.data,
            }
        },
        watch:{
            data(newVal){
                this.newData = newVal
                this.getDesiredDataFormat();
            }
        },
        mounted(){
            this.getDesiredDataFormat();
        },
        methods:{
            getDesiredDataFormat(){
                
                 let methodSeq = this.methodSeq
                let i, oData = this.newData,aFinalCats = undefined,oFinalData = {},newData={};
                methodSeq.forEach((v, i)=>{
                    Object.keys(oData).forEach(m=>{
                        if(m == v){
                            newData[methodSeq[i]] = oData[m]
                        }
                    })
                })
                let oAllMethods = dataM.getTableFormatedData(newData,this.methodSeq);

                for(i in newData){
                        let aCats = Object.keys(newData[i]);
                    if(!aFinalCats){
                        aFinalCats = aCats;
                    }
                }
                if(aFinalCats && aFinalCats.length){
                    this.fields = [this.$i18n.t('methods'),this.$i18n.t('sub_method'),...aFinalCats];
                }else{
                    this.fields = [this.$i18n.t('methods'),this.$i18n.t('sub_method')];
                }
                this.rows = [];
                let oSumModernUsers = {},oSumModernUsersexCon = {};
                if(Object.keys(oAllMethods).length > 0){
                    for(let k in oAllMethods){
                        // let bFlag = true;
                        for(let l in oAllMethods[k]){
                            let oRow = {[this.$i18n.t('methods')]: k.toUpperCase(),[this.$i18n.t('sub_method')]:l},bIsCon = k.toLowerCase() === 'condom' || k.toLowerCase === 'préservatifs';
                            //let oRow = {[this.$i18n.t('methods')]:bFlag ? k.toUpperCase() : '',[this.$i18n.t('sub_method')]:l},bIsCon = k.toLowerCase() === 'condom';
                            for(let m in oAllMethods[k][l]){
                                oAllMethods[k][l][m] = oAllMethods[k][l][m] ? oAllMethods[k][l][m] : 0;
                                oRow[m] = Math.round(oAllMethods[k][l][m]).toLocaleString();
                                oSumModernUsers[m] = (oSumModernUsers[m] || 0) + oAllMethods[k][l][m];
                                //if(!bIsCon){
                                if(k.toLowerCase() != this.$i18n.t('condom').toLowerCase()){
                                    oSumModernUsersexCon[m] = (oSumModernUsersexCon[m] || 0) + oAllMethods[k][l][m];
                                }
                            }
                            // bFlag = false;
                            this.rows.push(oRow);
                        }
                    }
                }
                let oRows1 = {[this.$i18n.t('methods')]:this.$i18n.t('estimated_modern_users'),[this.$i18n.t('sub_method')]:'',_rowVariant:'customclass'},
                    oRows2 = {[this.$i18n.t('methods')]:this.$i18n.t('estimated_modern_users_excon'),[this.$i18n.t('sub_method')]:'',_rowVariant:'customclass'};
                for(let x in oSumModernUsersexCon){
                    oRows1[x] = Math.round(oSumModernUsers[x]).toLocaleString();
                    oRows2[x] = Math.round(oSumModernUsersexCon[x]).toLocaleString();
                }

                this.rows.push(oRows1);
                this.rows.push(oRows2);
                let aSource = {
                    [this.$i18n.t(
                    "emu_output_5"
                    )]: 'Commodities_Client',
                    [this.$i18n.t("emu_output_7")]: 'Visits',
                    [this.$i18n.t(
                    "emu_output_6"
                    )]: 'Commodities_Facilities',
                    [this.$i18n.t("emu_output_8")]: 'User'
                };
                let cat = localStorage.getItem("methodCategory");
                if(this.source == aSource[cat]){
                    this.saveFinalTable()
                }
            },
            saveFinalTable(){
                let oResponse = {'methodTable' : {[this.location.split('/')[1]]: this.rows}};
                this.$store.commit('setEMUMethodTable', oResponse['methodTable'])
            },
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
