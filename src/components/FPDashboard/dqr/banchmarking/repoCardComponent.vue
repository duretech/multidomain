<template>
    <div class="card">
        <div class="card-header p-10px text-decoration-none">
            <div class="row no-gutters">
                <div class="col-lg-10 col-md-9 p-t-4px">
                    <i class="fa fa-info-circle color-white cursor-pointer chart-info p-t-5px mr-2" aria-hidden="true" v-b-popover.hover.rightbottom="{ variant: 'info',  content: chartdata.chartInfo, title: chartdata.title, html: true }"></i>
                    {{chartdata.title}}
                </div>
                <div class="col-lg-2 col-md-3">
                    <div class="row no-gutters">
                        <div class="col-12 text-right align-items-center d-flex justify-content-end">
                        <!-- <div class="col-lg-4 col-md-4 text-center"> -->
                            <b-dropdown toggle-class="text-decoration-none bg-transparent border-0 dropdown-toggle" no-caret menu-class="chart-dd-menu no-hover">
                                <template v-slot:button-content>
                                    <img :src="require('../../../assets/img/icons/narration.png')" class="img" />
                                </template>
                                <b-dropdown-item class="list-group-item bg-transparent px-0">
                                    <div class="card bg-dark-grey">
                                        <div class="card-body">
                                            <div class="row no-gutters border-bottom-black">
                                                <div class="col-lg-6">
                                                    <div class="row no-gutters">
                                                        <div class="col-lg-2">
                                                            <p class="m-0px">
                                                                <i class="fa fa-desktop"></i>
                                                            </p>
                                                        </div>
                                                        <div class="col-lg-10">
                                                            <p class="m-0px">Narration</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-6">
                                                    <p class="m-0px">Time - Period: May 19</p>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-12">
                                                    <p class="m-t-10px">
                                                        Location "R2" by "Implant" method is 47% less than National EMU Percentage.
                                                    </p>
                                                    <p class="m-t-10px">
                                                        Location "R6" by "Implant" method is 28% more than National EMU Percentage.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </b-dropdown-item>
                            </b-dropdown>
                        <!-- </div> -->
                       <!--  <div class="col-lg-4 col-md-4 text-center"> -->
                            <b-dropdown toggle-class="text-decoration-none bg-transparent border-0 dropdown-toggle" no-caret menu-class="chart-dd-menu">
                                <template v-slot:button-content>
                                    <img :src="require('../../../assets/img/icons/sort.png')" class="img" />
                                </template>
                                <b-dropdown-group class="chart-dd-options">
                                    <b-dropdown-item v-for="option in dataOptions"
                                        :key="option.value"
                                        :value="option.value"
                                        @click="sortData(option.value)"
                                        class="list-group-item bg-transparent px-0">
                                        <div class="row no-gutters color-white">
                                            <div class="col-lg-10">
                                                <p class="m-0px">Sort by</p>
                                            </div>
                                            <div class="col-lg-2">
                                                <p class="m-0px">
                                                    <i :class="[`fa fa-sort-numeric-${option.value}`]"></i>
                                                </p>
                                            </div>
                                        </div>
                                    </b-dropdown-item>
                                </b-dropdown-group>
                            </b-dropdown>
                       <!--  </div> -->
                        <!-- <div class="col-lg-4 col-md-4 text-center"> -->

                            <b-dropdown toggle-class="text-decoration-none bg-transparent border-0 dropdown-toggle" no-caret menu-class="chart-dd-menu">
                                <template v-slot:button-content>
                                    <img :src="require('../../../assets/img/icons/export.png')" class="img" />
                                </template>
                                <b-dropdown-group class="chart-dd-options">
                                    <b-dropdown-item class="list-group-item bg-transparent px-0">
                                       <div class="row no-gutters color-white">
                                            <div class="col-lg-10">
                                                <download-csv :data="chartdata.tableData">CSV</download-csv>
                                            </div>
                                            <div class="col-lg-2">
                                                <p class="m-0px">
                                                    <i class="fa fa-file-image-o"></i>
                                                </p>
                                            </div>
                                        </div>
                                    </b-dropdown-item>
                                    <b-dropdown-item class="list-group-item bg-transparent px-0" @click="exportChart('jpg')">
                                         <div class="row no-gutters color-white">
                                            <div class="col-lg-10 text-left">
                                                <p class="m-0px">JPG</p>
                                            </div>
                                            <div class="col-lg-2">
                                                <p class="m-0px">
                                                    <i class="fa fa-file-image-o"></i>
                                                </p>
                                            </div>
                                        </div>
                                    </b-dropdown-item>
                                    <b-dropdown-item class="list-group-item bg-transparent color-white px-0" @click="exportChart('pdf')">
                                        <div class="row no-gutters color-white">
                                            <div class="col-lg-10 text-left">
                                                <p class="m-0px">PDF</p>
                                            </div>
                                            <div class="col-lg-2">
                                                <p class="m-0px">
                                                    <i class="fa fa-file-pdf-o"></i>
                                                </p>
                                            </div>
                                        </div>
                                    </b-dropdown-item>
                                </b-dropdown-group>
                            </b-dropdown>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-body pb-0">
            <p class="m-0 text-right">
            <a class=" btn btn-primary black-btn color-white" @click="handleChartViewBtn()" id="switch-chartview">
                <i class="fa fa-bar-chart"></i>
            </a>
            <a class=" btn btn-primary black-btn color-white" @click="handleTableViewBtn()" id="switch-tableview">
                <i class="fa fa-table"></i>
            </a>
            </p>
            <div class="chartview">
                <highcharts  :options="chartOptions" ref="inputCharts"></highcharts>
            </div>
            <div class="tableview hide">
                <div class="card m-t-10px">
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <b-table striped hover :items="chartdata.tableData"></b-table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-footer text-right">
            <p class="m-0">Source: <span>{{chartdata.source}}</span></p>
        </div>
    </div>
</template>

<script>
    import Highcharts from 'highcharts';
    import exportingInit from "highcharts/modules/exporting";

    exportingInit(Highcharts);
    export default{
        props:['chartdata'],
         components: {
        },
        mounted(){
            //console.log(this.chartdata)
        },
        data(){
            return {
                dataOptions:[
                    {
                        "value": "asc"
                    },
                    {
                        "value": "desc"
                    }
                ],
                chartOptions: {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: ''
                    },
                    xAxis: {
                        categories: this.chartdata.categories
                    },
                    yAxis: {
                        min: 0,
                        labels: {
                            overflow: 'justify',
                            enabled: true,
                            formatter: function () {
                                return this.value + '%';
                            }
                        },
                        title: {
                            //text: 'Reporting Rates ( % )',
                            text: this.chartdata.yTitle,
                            style:{
                                fontSize: 15
                            }
                        },
                        plotLines: [{
                                    color: '#b3b3b3',
                                    width: 2,
                                    value: 80,
                                    zIndex: 5,
                                    label: {
                                    text: '80%',
                                    align: 'right',
                                    style: {
                                        color: 'black',
                                        fontWeight: 'bold'
                                }
                            }
                        }],
                    },
                    tooltip: {
                        valueSuffix: ' %' ,
                        shared: true,
                        useHTML: true,
                    },
                    legend: {
                        reversed: true
                    },
                    plotOptions: {
                        series: {
                            stacking: 'normal'
                        }
                    },
                    exporting: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    },
                    series: this.chartdata.data
                }
            }
        },
        methods:{
            sortData(p_val){
                let aTemp = this.chartdata.categories;
                if(aTemp.length > 1){
                    if(aTemp[0] > aTemp[1] && p_val === 'asc' || aTemp[0] < aTemp[1] && p_val === 'desc'){
                        let aCats = this.chartdata.categories.reverse(),
                            i,aData = this.chartdata.data,nLen = aData.length;
                        for(i = 0; i < nLen; i++){
                            aData[i].data.reverse();
                        }
                    }
                }
            },
            exportChart(type){
                var chart = this.$refs.inputCharts.chart;
                if(type == 'jpg'){
                    chart.exportChart({
                        type: 'image/jpeg',
                        filename: 'overview-chart'
                    });
                }else if(type == 'png'){
                    chart.exportChart({
                        type: 'image/png',
                        filename: 'overview-chart'
                    });
                }else if(type == 'pdf'){
                    chart.exportChart({
                        type: 'application/pdf',
                        filename: 'overview-chart'
                    });
                }
            },
            handleChartViewBtn(){
                $(".chartview").removeClass('hide');
                $(".tableview").addClass('hide');
            },
            handleTableViewBtn(){
            $(".tableview").removeClass('hide');
                $(".chartview").addClass('hide');
            }
        }
    }
</script>
