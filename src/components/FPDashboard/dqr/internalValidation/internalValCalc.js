import standardDeviation from 'ml-array-standard-deviation';
import i18n from "@/i18n.js"
import { translateDate } from "@/components/Common/commonFunctions";

export default{
    calculateCypFactors:({chartData},p_conf) =>{
        // console.log("chartData", chartData)
        // console.log("p_conf", p_conf)
        let oData = {};
        chartData.forEach((ele,ind) => {
            let {name,subIndicator} = ele.indicator,
                oIndicators = {};
            subIndicator.forEach(indic => {
                let name = Array.isArray(indic.name) ? indic.name[0] : indic.name
                oIndicators[name] = indic.cyp;
            });
            if(p_conf[name]){
                for(let u in p_conf[name]){
                    p_conf[name][u].forEach(mId => {
                        oData[mId] = oIndicators[u];
                    })
                }
            }
        });
        // console.log("oData", oData)
        return oData;
    },
    getTotalData:(data,p_loc,p_cyp,p_isCom, locale, periodType, moment) =>{
        /* categories */
        let aCategories = [],
            aPe = data.metaData.dimensions.pe;

        aPe.forEach(p => {
            if(data.metaData.items[p]){
              let formattedPeriod = translateDate({ rawDate: p, periodType: periodType });
                aCategories.push(formattedPeriod);
            }
        });
        /* indices */
        let valueIndex = 0,ouIndex = 0,peIndex = 0,dxIndex = 0,oFinalData = {},
            aSeries = [],oAggregateSeries = {},oDrillDownSeries = {},
            aSeriesNumbers = [],aWholeSeriesNum = [],
            oDevSeries = {},aTableData = [];
        data.headers.forEach((h, i) => {
            if (h.name === 'value') {
                valueIndex = i
            }

            if (h.name === 'ou') {
                ouIndex = i
            }

            if (h.name === 'dx') {
                dxIndex = i
            }

            if (h.name === 'pe') {
                peIndex = i
            }
        });
        data.rows.forEach((r, i) => {
            let nFact = p_isCom ? p_cyp[r[dxIndex]] || 1 : 1;
            if(!oFinalData[r[ouIndex]]){
                oFinalData[r[ouIndex]] = {}
            }
            oFinalData[r[ouIndex]][r[peIndex]] =  (oFinalData[r[ouIndex]][r[peIndex]] || 0) + r[valueIndex] * 1 * nFact;

        });
        for(let reg in oFinalData){
            let sName = data.metaData.items[reg].name,
                oRegion = {name:sName, id: reg, data : [], visible: true},
                oRegData = {name:sName, id: reg, data : [], visible: true};
            oAggregateSeries[reg] = [];
            aPe.forEach((p,ind) => {
              let sMonth = translateDate({ rawDate: p, periodType: periodType });
                oRegion.data.push({y:oFinalData[reg][p] || 0,pe:p,name:sMonth});
                oRegData.data.push(oFinalData[reg][p] || 0);
                oAggregateSeries[reg].push({y:oFinalData[reg][p] || 0,pe:p,name:sMonth,drilldown:sMonth});
                if(reg !== p_loc){
                    if(!oDrillDownSeries[sMonth]){
                        oDrillDownSeries[sMonth] = {};
                    }
                    oDrillDownSeries[sMonth][sName] = {id: reg, value: oFinalData[reg][p]};
                    /*  */
                    if(!oDevSeries[sMonth]){
                      oDevSeries[sMonth] = [];
                    }
                    oDevSeries[sMonth].push({val:oFinalData[reg][p],name:sName});
                    /*  */
                }

            });
            if(reg !== p_loc){
                aSeries.push(oRegion);
                aSeriesNumbers.push(oRegData);
            }
            aWholeSeriesNum.push(oRegData);
        }
        /*  */

        let aDrillDownSeries = []
        for(let i in oDrillDownSeries){
            let _obj = {id:i,name:i,type:'column', visible: true,data:[]/* , colorByPoint: true */};
            for(let j in oDrillDownSeries[i]){
                // _obj.data.push([j,oDrillDownSeries[i][j]]);
                _obj.data.push({name:j,y:oDrillDownSeries[i][j].value,locationID:oDrillDownSeries[i][j].id});
            }
            aDrillDownSeries.push(_obj);
        }
        /*  */
        return{
            categories:aCategories,
            series:aSeries,
            seriesNum:aSeriesNumbers,
            wholeSeriesNum:aWholeSeriesNum,
            devSeries:oDevSeries,
            aggregate:[
                {
                    name:data.metaData.items[p_loc] ? data.metaData.items[p_loc].name : '',
                    id: p_loc,
                    data:oAggregateSeries[p_loc] || [],
                    visible: true
                }
            ],
            drillDown:aDrillDownSeries
        }
    },
    getStdDevForCypregion:(p_series, standardDeviationValue)=>{
        let aData = [];
        p_series.forEach(ele => {
            let {name,data,id} = ele,
                nLen = data.length,
                nSum = data.reduce((a, b) => a + b, 0),
                nAvg = nLen ? nSum / nLen : 0,
                nStdDev = standardDeviation(data);
                aData.push({
                  name,
                  id,
                  dev:nStdDev,
                  low:nAvg * 1 - (standardDeviationValue * nStdDev),
                  high:nAvg * 1 + (standardDeviationValue * nStdDev),
                  avg:nAvg
                })
        });
        return aData;
    },
    getStdSeviatedVals:(p_series)=>{
        let oData = {};
        for(let j in p_series){
            let data = p_series[j],
                nLen = data.length,
                nSum = data.reduce((a, b) => a + b, 0),
                nAvg = nLen ? nSum / nLen : 0,
                nStdDev = standardDeviation(data);
            oData[j] = {
                dev:nStdDev,
                low:nAvg * 1 - (2 * nStdDev),
                high:nAvg * 1 + (2 * nStdDev),
                avg:nAvg
            };
        }
        /* p_series.forEach(ele => {
            let {name,data} = ele,
                nLen = data.length,
                nSum = data.reduce((a, b) => a + b, 0),
                nAvg = nLen ? nSum / nLen : 0,
                nStdDev = standardDeviation(data);
            oData[name] = {
                dev:nStdDev,
                low:nAvg * 1 - (2 * nStdDev),
                high:nAvg * 1 + (2 * nStdDev),
                avg:nAvg
            };
        }); */
        return oData;
    },
    addRangeLabel:(p_series,p_threshold, highText, lowText)=>{
        let oCypRange = {},oMonthsOutliers = {};
        p_series.forEach((element)=>{
            let {name} = element,oCompare = p_threshold.find(p => p.name === element.name && p.id === element.id);
            element.data.forEach((oMonth)=>{
                oMonth.y = oMonth.y.toFixed(2) * 1;
                let sLabel = (oMonth.y > oCompare.high) ? highText : (oMonth.y < oCompare.low) ? lowText : '';
                oMonth.label = sLabel;
                /*  */
                if(sLabel){
                    if(!oCypRange[sLabel]){
                        oCypRange[sLabel] = {};
                    }
                    oCypRange[sLabel][oMonth.name] = (oCypRange[sLabel][oMonth.name] || [])
                    oCypRange[sLabel][oMonth.name].push(name);
                    oMonthsOutliers[oMonth.name] = undefined;
                }
                /*  */
            });
        });
        return {
            series:p_series,
            cypRange:oCypRange,
            outliers:Object.keys(oMonthsOutliers)
        }
    },
    addRangeLabelWithColor:(p_series,p_threshold, highText, lowText) => {

        let aMonth = [];
        p_series.forEach((element)=>{
            let {name} = element,oCompare = p_threshold.find(p => p.name === element.name && p.id === element.id);
            element.data.forEach((oMonth)=>{
                oMonth.y = oMonth.y.toFixed(2) * 1;
                let sLabel = (oMonth.y > oCompare.high) ? highText : (oMonth.y < oCompare.low) ? lowText : '';
                oMonth.label = sLabel;
                oMonth.color = (oMonth.y > oCompare.high) ? '#55BF3B' : (oMonth.y < oCompare.low) ? '#DF5353' : '';
                if(sLabel){
                    aMonth.push(oMonth.name);
                }
            });
        });
        return {
            series:p_series,
            outliers:aMonth
        };
    },
    addMarkers:(p_dev) =>{
        let oSeries = [{
            marker: {
              symbol: 'c-rect',
              lineWidth: 3,
              lineColor: '#ef8843',
              radius: 10
            },
            type: 'scatter',
            name: 'MIN (-2 SDs)',
            color: '#ef8843',
            data: []
          },
          {
            marker: {
              symbol: 'c-rect',
              lineWidth: 3,
              lineColor: '#70ad47',
              radius: 10
            },
            type: 'scatter',
            name: 'MAX (+2 SDs)',
            color: '#70ad47',
            data: []
          }
        ];
        for(let k in p_dev){
            oSeries[0].data.push(p_dev[k].low);
            oSeries[1].data.push(p_dev[k].high);
        }
        return oSeries;
    },
    calcCypTable:(p_table, tableKey)=>{
        let aTable = [];
        for(let i in p_table){
            let oRow = {[tableKey]:i};
            p_table[i].forEach((td,ind) => {
                let {name,val} = td;
                oRow[name] = val ? val.toFixed(2) * 1 : '';
            });
            aTable.push(oRow);
        }
        return aTable;
    },
    calcAggTable:(p_table, tableKey)=>{
        let aTable = [];
        p_table.forEach((element,i)=>{
            let {data,name} = element;
            data.forEach((ele) => {
                let oRow = {[tableKey]:ele.name,[name]:ele.y.toFixed(2) * 1};
                aTable.push(oRow);
            });
        });
        return aTable;
    },
    addLowAndHighInDrillDownSeries:(p_series,p_dev)=>{
        let oMonthOutliers = {}
        p_series.forEach((element,index)=>{
            let {data,name} = element,sName = name;
            oMonthOutliers[sName] = (oMonthOutliers[sName] || []);
            data.forEach(ele => {
                let {name,y} = ele, oCompare = p_dev.find(p => p.name === ele.name && p.id === ele.locationID);
                ele.lowd = oCompare.low
                ele.highd = oCompare.high
                ele.color = y < oCompare.low ? '#DF5353' : y > oCompare.high ? '#DF5353' : '';
                // ele.color = y < oCompare.low ? '#DF5353' : y > oCompare.high ? '#DF5353' : '#55BF3B';
                if(y < oCompare.low || y > oCompare.high){
                    oMonthOutliers[sName].push(name);
                }
            });
        });
        return {
            series:p_series,
            outliers : oMonthOutliers
        };
    },
    avgChartData:(p_series,p_dev) =>{
        let oAvgData = {};
        p_series.forEach(ele => {
            let {name,data} = ele, oCompare = p_dev.find(p => p.name === ele.name && p.id === ele.id),
                nAvg = oCompare.avg;
            oAvgData[name] = [];
            data.forEach(rec => {
                oAvgData[name].push((nAvg - rec).toFixed(2) * 1);
            });
        });
        return oAvgData;
    },
    getcypRegionSeries:(p_avg,p_index)=>{
        let aSeries=[{name:'Trends',data:[]}];
        for(let i in p_avg){
            let oBar = {
                name:i,
                color:p_avg[i][p_index] > 0 ? '#55BF3B':'#DF5353',
                y:p_avg[i][p_index]
            }
            aSeries[0].data.push(oBar);
        }
        return aSeries;
    }
}
