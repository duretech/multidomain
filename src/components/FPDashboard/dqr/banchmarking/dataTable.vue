<template>
  <div class="card">
    <div class="card-header p-10px text-decoration-none">
      <div class="clearfix">
        <div
          class="float-left p-t-4px"
        >
        <i class="fa fa-info-circle color-white cursor-pointer chart-info p-t-5px mr-2" aria-hidden="true" v-b-popover.hover.rightbottom="{ variant: 'info',  content: chartInfo, title: tableHeading, html: true }"></i>
        {{tableHeading}}</div>
        <div class="float-right">
          <div class="row no-gutters d-flex">
            <div class="pr-3">
              <select class="form-control typeDropdown" v-model="conFilter" @change="drawTable" id="exampleFormControlSelect1" >
                <option value="inc">{{$t('includeCondoms')}}</option>
                <option value="ex">{{$t('excludeCondoms')}}</option>
              </select>
            </div>
            <div class="p-t-4px">
              <download-csv :data="items"><img :src="require('../../../assets/img/icons/export.png')" class="img" /></download-csv>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-body pb-0">
      <div class="table-responsive">
        <!-- <div class="row mx-0 pb-3">
          <div class="col-3 offset-9">
            <select class="form-control" v-model="conFilter" @change="drawTable" id="exampleFormControlSelect1" >
              <option value="inc">Include Condoms</option>
              <option value="ex">Exclude Condoms</option>
            </select>
          </div>
        </div> -->
        <b-table striped bordered hover :items="items" :sticky-header="true"></b-table>
      </div>
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
export default {
    props:['chartdata', 'tableName', 'tableHeading', 'chartInfo'],
    data(){
        return {
            tabData: JSON.stringify(this.chartdata),
            items: [],
            conFilter: "inc"
        }
    },
    watch:{
      conFilter(newV){
        this.$emit('filter', newV)
      },
      chartdata(newVal){
        this.tabData= JSON.stringify(newVal)
        this.drawTable()
      }
    },
    methods:{
        drawTable(){
            let dataObj = JSON.parse(this.tabData);
            let incObj = {}
            let exObj = {}
            this.items = []
            dataObj.categories.forEach((res, i)=>{
                incObj[res] = Number(dataObj.data[2].data[i]).toFixed(2)
                exObj[res] = Number(dataObj.data[3].data[i]).toFixed(2)
            })
            if(this.conFilter == 'inc'){
              this.items.push(incObj)
            }else{
              this.items.push(exObj)
            }

        }
    },
    mounted(){
        this.drawTable()
    }
};
</script>
<style lang="scss" scoped>
.mdgridviewpage-bg {
  background-size: cover;
  background-position: center;
  /*min-height: 100vh;*/
  // padding: 20px 40px;
  // padding-bottom: 50px;
  overflow-y: hidden;
}
.typeDropdown{
  font-size: 0.75rem;
  padding: 4px 25px 4px 5px;
  height: auto;
  margin-top: 4px;
}
</style>
