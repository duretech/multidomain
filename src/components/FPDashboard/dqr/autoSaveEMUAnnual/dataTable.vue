<template>
  <div class="card">
    <div class="card-header p-10px text-decoration-none" style="position: relative">
      <div class="clearfix">
        <div
          class="float-left p-t-4px"
        >
        <i class="fa fa-info-circle color-white cursor-pointer chart-info p-t-5px mr-2" aria-hidden="true" v-b-popover.hover.rightbottom="{ variant: 'info',  content: chartInfo, title: tableHeading, html: true }"></i>
        {{tableHeading}}</div>
        <div class="float-right">
          <div class="row no-gutters d-flex">
            <p class="condom-text">{{$t('inc_ex_condom_text')}}</p>
            <div class="pr-3">
              <select class="form-control typeDropdown" v-model="conFilter" @change="drawTable" id="exampleFormControlSelect1" >
                <option value="inc">{{$t('includeCondoms')}}</option>
                <option value="ex">{{$t('excludeCondoms')}}</option>
              </select>
            </div>
            <div class="p-t-4px">
              <download-csv :data="items"><img :src="require('@/assets/img/icons/download_new.png')" class="img cursor-pointer" v-b-tooltip.hover :title="$t('downloadIcon')" /></download-csv>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-body pb-0">
      <div class="table-responsive">
        <table class="table table-bordered table-hover">
              <thead style="background-color:#d4d4d4">
                <tr>
                  <th scope="col" v-for="f in fields" :key="f">{{f}}</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="items[0]">
                  <tr v-if="conFilter == 'inc'" style="background-color: rgb(255 243 205)">
                    <td v-for="f in fields" :key="f">{{items[0][f]}}</td>
                  </tr>
                  <tr v-else>
                    <td v-for="f in fields" :key="f">{{items[0][f]}}</td>
                  </tr>
                </template>
                <template v-if="items[1]">
                  <tr v-if="conFilter == 'ex'" style="background-color: rgb(255 243 205)">
                    <td v-for="f in fields" :key="f">{{items[1][f]}}</td>
                  </tr>
                  <tr v-else>
                    <td v-for="f in fields" :key="f">{{items[1][f]}}</td>
                  </tr>
                </template>
              </tbody>
            </table>
        <!-- <div class="row mx-0 pb-3">
          <div class="col-3 offset-9">
            <select class="form-control" v-model="conFilter" @change="drawTable" id="exampleFormControlSelect1" >
              <option value="inc">Include Condoms</option>
              <option value="ex">Exclude Condoms</option>
            </select>
          </div>
        </div> -->
        <!-- <b-table striped bordered hover :items="items" :fields="fields" :sticky-header="true">

        </b-table> -->


          <!-- <b-table
            ref="selectableTable"
            selectable
            :select-mode="selectMode"
            :items="items"
            :fields="fields"
            @row-selected="onRowSelected"
            responsive="sm"
            striped bordered
            :sticky-header="true"
            hover
          >

          </b-table> -->

          <!-- <p>
            Selected Rows:<br>
            {{ selected }}
          </p> -->
      </div>
    </div>
    <div class="card-footer text-right">
      <!-- <p class="m-0">
        {{$t('source')}}:
        <span>DHIS2</span>
      </p> -->
      <!-- <p class="m-0 condom-text">*Choose whether to include or exclude condoms in the final EMU value. </p> -->
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
            conFilter: "inc",
            //fields: ['selected', 'filter'],
            fields: [this.$i18n.t('inc_ex_condome')],
            selectMode: 'single',
            selected: []
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
        onRowSelected(items) {
          this.selected = items
          if(items && items[0]){
            if(items[0]['filter'] == 'Includes Condom'){
              this.conFilter = 'inc'
            }else{
              this.conFilter = 'ex'
            }
          }
        },
        drawTable(){
            let dataObj = JSON.parse(this.tabData);
            //console.log(dataObj)
            let incObj = {[this.$i18n.t('inc_ex_condome')]: this.$i18n.t('includeCondoms')}
            let exObj = {[this.$i18n.t('inc_ex_condome')]: this.$i18n.t('excludeCondoms')}
            this.items = []
            dataObj.data[3].data.forEach((d, i)=>{
              if(d){
                if(this.fields.indexOf(dataObj.categories[i]) == -1){
                    this.fields.push(dataObj.categories[i])
                }
                incObj[dataObj.categories[i]] = Number(dataObj.data[3].data[i]).toFixed(2)
                exObj[dataObj.categories[i]] = Number(dataObj.data[4].data[i]).toFixed(2)
              }
            })
            // dataObj.categories.forEach((res, i)=>{
            //   if(this.fields.indexOf(res) == -1){
            //       this.fields.push(res)
            //   }
            //     //this.fields.push(res)
            //     incObj[res] = Number(dataObj.data[3].data[i]).toFixed(2)
            //     exObj[res] = Number(dataObj.data[4].data[i]).toFixed(2)
            // })


            this.items.push(incObj)
            this.items.push(exObj)

        }
    },
    mounted(){
        this.drawTable()
        this.selected = [this.items[0]]
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
  background: #d4d4d4;
  color: #000;
}
.condom-text{
  font-size: 0.75rem;
  margin-top: 8px ;
  margin-bottom: 0;
  margin-right: 5px;
}
.table-bordered thead th{
  font-weight: 100;
}

</style>
