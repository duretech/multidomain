<template>
    <div class="card">
        <div class="card-header p-10px text-decoration-none">
            <div class="row no-gutters">
                <div class="col-lg-10 col-md-10 p-t-4px">
                    <i class="fa fa-info-circle color-white cursor-pointer chart-info p-t-5px mr-2" aria-hidden="true" v-b-popover.hover.rightbottom="{ variant: 'info',  content: chartInfo, title: title +': '+data.source, html: true }"></i>{{title}}: {{data.source}}
                </div>
                <div class="col-lg-2 col-md-2" v-if="periodType == 'monthly' && tableChartMethods && Object.keys(tableChartMethods).length > 0">
                    <dropdown
                        :ddVal="timerequency"
                        :ddoptions="dropdownoptions"
                        :onChangeFn="getMonthsVal"
                    />
                </div>
            </div>
        </div>
        <div class="card-body pb-0">
            <div class="table-responsive h-300px">
                <table class="table table-striped table-bordered" v-if="tableChartMethods && Object.keys(tableChartMethods).length > 0">
                    <thead>
                        <th>{{$t('location')}}/{{$t('method')}}</th>
                        <th v-for="(sTh,ind) in tableChartMethods" :key="ind">{{sTh}}</th>
                    </thead>
                    <tbody>
                        <tr v-for="(oTr,rowInd) in tableChartData" :key="rowInd">
                            <template v-for="(oTd,cellInd) in oTr">
                                <td v-if="typeof oTd === 'string'" :key="cellInd">{{oTd}}</td>
                                <td v-else :key="cellInd"><i :class="['fa',getClass(oTd)]" aria-hidden="true" :style={color:getColor(oTd)}></i></td>
                            </template>
                        </tr>
                    </tbody>
                </table>
                <!-- <b-alert show v-else class="m-t-40px">{{$t('no_data_to_display')}}</b-alert> -->
                <div class="m-t-40px text-center" v-else>{{$t('no_data_to_display')}}</div>
            </div>
        </div>
        <div class="card-footer legends" style="visibility: visible" v-if="tableChartMethods && Object.keys(tableChartMethods).length > 0">
          <div style="background-color: 'transparent';padding: 10px;text-align: center;border-radius: 5px;border: 1px solid #a7a7a7;width: fit-content;margin: auto;">
            <div><span><i class="fa fa-arrow-down mr-2" :style="{color:'#ef5350'}"></i> {{$t('highchartmsg_footer1')}} </span>
            <span><i class="fa fa-arrow-up mr-2" :style="{color:'#66bb6a'}"></i> {{$t('highchartmsg_footer2')}}</span>
          </div>
          <div><span><i class="fa fa-circle mr-2" :style="{color:'#ffa726'}"></i> {{$t('highchartmsg_footer3')}}</span>
          </div>
          </div>
        </div>
    </div>
</template>
<script>
import dropdown from './dropdown';
import geoCalc from './geoCalc';
export default {
    props:[
        'data',
        'min',
        'max',
        'title',
        'period', 
        'type', 
        'chartInfo', 
        'methodSeq', 
        'periodType', 
        'matrixData'
    ],
    components:{
        dropdown
    },
    watch: {
        matrixData(newVal){
            // console.log(newVal)

            this.matrixPData = this.data
            this.computeMonthsData()
        },
        methodSeq(newVal){
            if(newVal){
                this.matrixPData = this.data
                this.computeMonthsData()
            }
        }
    },
    data(){
        // console.log(this.data)
        return{
            dropdownoptions:[
                {val:1,label:'1 Months'},
                {val:3,label:'3 Months'},
                {val:6,label:'6 Months'},
                {val:12,label:'12 Months'}
            ],
            tableChartMethods:null,
            tableChartData:null,
            timerequency:1,
            matrixPData: this.data
        }
    },
    methods:{
        getClass(p_val){
            //console.log(p_val, this.min, this.max)
            let mark = ((p_val * 100) < this.min) ? 'fa-arrow-down' : ((p_val * 100) > this.max) ? 'fa-arrow-up' : 'fa-circle';

            return mark;
        },
        getColor(p_val){
            return ((p_val * 100) < this.min) ? '#ef5350' : ((p_val * 100) > this.max) ? '#66bb6a' : '#ffa726';
        },
        getMonthsVal(p_val){
            this.tableChartMethods = null;
            this.tableChartData = null;
            this.timerequency = p_val;
            this.computeMonthsData();
        },
        computeMonthsData(){
        //    console.log("data", this.matrixPData)
           // console.log("type", this.type)
           // console.log("this.period", this.period)
            if(this.type == 'Source'){
               //console.log("in if", this.methodSeq)
                let oChartTable = geoCalc.calculateAvgMethodMix(this.matrixPData,this.period,this.timerequency,false,this.$i18n.locale,this.$i18n.t('Total CYP'),this.$i18n.t('method'), this.methodSeq, this.periodType, this.$moment),
                aHighChartTable = geoCalc.calculateHighChartTable(oChartTable,this.matrixPData.categories);
                this.tableChartMethods = oChartTable.methods;
                this.tableChartData = aHighChartTable;
                // console.log("oChartTable",oChartTable)
            }else{
                // console.log(this.matrixPData, this.period, this.timerequency, this.$i18n.t('method'), this.periodType)
                let oChartTable = geoCalc.calculateAvgEMUMethodMix(this.matrixPData,this.period,this.timerequency,this.$i18n.t('method'), this.periodType, this.$i18n.locale, this.$moment),
                aHighChartTable = geoCalc.calculateHighChartTable(oChartTable,this.matrixPData.categories);

                this.tableChartMethods = oChartTable.methods;
                this.tableChartData = aHighChartTable;
                // console.log("oChartTable",oChartTable)
            }
        },
        getTableData() {
          return {header: this.tableChartMethods, data: this.tableChartData}
        }
    },
    created(){
        this.computeMonthsData();
        if(this.$i18n.locale === 'fr') {
          this.dropdownoptions = [
              {val:1,label:this.$i18n.t('month1')},
              {val:3,label:this.$i18n.t('month3')},
              {val:6,label:this.$i18n.t('month6')},
              {val:12,label:this.$i18n.t('month12')}
          ]
        }
    }
}
</script>
<style scoped lang="scss">
thead th,td{
    width: 100px;
    text-align:center;
}
.card-footer.legends{
    font-size: 0.8125rem;
    background-color: #f8f8f9;
    padding: 10px !important;
}
.legends {
        font-weight: bold !important;
        font-size: 0.75rem !important;
        font-family: "Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif !important;
        color: #4c4c4c !important;
    span {
        margin-right: 7px;
    }
}
</style>
