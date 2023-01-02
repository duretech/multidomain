// import pptxgen from "pptxgenjs";
import i18n from "@/i18n.js"
import {
  translateDate
} from "@/components/Common/commonFunctions";
const getMostUsedMethod = (p_obj,p_met,p_ind,p_val) =>{
    let bFlag = false;
    for(let i in p_obj){
        if(i === p_met){
            continue;
        }
        bFlag = p_obj[i].data[p_ind].value > p_val
        if(bFlag)
            break;
    }
    return bFlag ? 0 : p_val;
}

const getRegionalCYPChart = (data, p_conf, p_isCom, p_cyp, periodValue, totalCYPText, valueIndex, peIndex, dxIndex, ouIndex,methodTableHeaderName) => {
  let newTotalSeries = [], finalMethodData = {}, finalCYPMethodData = {}, newTotalSeriesTable= []
  let filteredData = JSON.parse(JSON.stringify(data.rows)).filter(r => r[peIndex] === periodValue)
   //console.log("filteredData", filteredData)
  // console.log("p_conf", p_conf)
  p_conf.forEach((p) => {
    if(p.de.length > 0) {
      let rData = {}, rData1 = {}
      filteredData.forEach((r) => {
        let nFact = p_isCom ? p_cyp[r[dxIndex]] || 1 : 1;
        if (p.de.includes(r[dxIndex])) {
          if (Object.keys(rData).includes(r[ouIndex])) {
            // rData[r[ouIndex]][r[peIndex]] = Number(r[valueIndex])

            rData[r[ouIndex]] = Number(rData[r[ouIndex]]) + Number(r[valueIndex]) * Number(nFact) /*Added  * Number(nFact) to get method wise cyp data */
            rData1[r[ouIndex]] = Number(rData1[r[ouIndex]]) + Number(r[valueIndex]) * Number(nFact)
            // if (Object.keys(rData[r[ouIndex]]).includes(r[peIndex])) {
              // rData[r[ouIndex]][r[peIndex]] = Number(rData[r[ouIndex]][r[peIndex]]) + Number(r[valueIndex]) * Number(nFact)
            // } else {
              // rData[r[ouIndex]][r[peIndex]] = Number(r[valueIndex]) * Number(nFact)
            // }
          } else {
            rData[r[ouIndex]] = Number(r[valueIndex]) * Number(nFact) /*Added  * Number(nFact) to get method wise cyp data */
            rData1[r[ouIndex]] = Number(r[valueIndex]) * Number(nFact)
          }

        }
      })
      finalMethodData[p.name] = rData
      finalCYPMethodData[p.name] = rData1
    }
  });

  // console.log("finalMethodData", finalMethodData)
  // console.log("finalCYPMethodData", finalCYPMethodData)

  Object.keys(finalMethodData).forEach((m) => {
    let obj = {name:m,data:[],visible:false}
    data.metaData.dimensions.ou.forEach((o) => {
      if(finalMethodData[m][o]) {
        obj.data.push({name: data.metaData.items[o].name, y : finalMethodData[m][o] ? Math.round(finalMethodData[m][o]) : null})
      }
    });
    newTotalSeries.push(obj)
  });
  // console.log("newTotalSeries", newTotalSeries)
  let totalObj = {name:totalCYPText,data:[],visible:true}, innerObj = {}

  Object.keys(finalCYPMethodData).forEach((m) => {
    data.metaData.dimensions.ou.forEach((o) => {
      if(!innerObj[o]) {
        innerObj[o] = finalCYPMethodData[m][o] ? finalCYPMethodData[m][o] : null
      } else {
        innerObj[o] += finalCYPMethodData[m][o] ? finalCYPMethodData[m][o] : null
      }
    });
  });

  data.metaData.dimensions.ou.forEach((o) => {
    if(innerObj[o]) {
      totalObj.data.push({name: data.metaData.items[o].name, y : innerObj[o] ? Math.round(innerObj[o]) : null})
    }
  })
  // console.log("totalObj", totalObj)
  newTotalSeries.unshift(totalObj)
  newTotalSeries.forEach((t) => {
    let tableObj = {[methodTableHeaderName]: t.name}
    data.metaData.dimensions.ou.forEach((o, j) => {
      if(t.data[j] && t.data[j].y) {
        tableObj[data.metaData.items[o].name] = t.data[j].y
      } else {
        tableObj[data.metaData.items[o].name] = ""
      }
    })
    newTotalSeriesTable.unshift(tableObj)
  });
  // console.log("newTotalSeries", newTotalSeries)
  // console.log("newTotalSeriesTable", newTotalSeriesTable)

  return {
    newTotalSeries,
    newTotalSeriesTable
  }
}

const getRegionalTrendCYPChart = (data, p_conf, p_isCom, p_cyp, periodValue, totalCYPText, valueIndex, peIndex, dxIndex, ouIndex, defaultLocationID, locale, methodTableHeaderName, periodType, moment) => {
  let newTotalTrendSeries = [], finalMethodData = {}, finalCYPMethodData = {}, newTotalTrendSeriesTable= []
  let filteredData = JSON.parse(JSON.stringify(data.rows)).filter(r => r[ouIndex] === defaultLocationID)
  // console.log("filteredData", filteredData)
  p_conf.forEach((p) => {
    if(p.de.length > 0) {
      let rData = {}, rData1 = {}
      filteredData.forEach((r) => {
        let nFact = p_isCom ? p_cyp[r[dxIndex]] || 1 : 1;
        if (p.de.includes(r[dxIndex])) {
          if (Object.keys(rData).includes(r[peIndex])) {
            rData[r[peIndex]] = Number(rData[r[peIndex]]) + Number(r[valueIndex])
            rData1[r[peIndex]] = Number(rData1[r[peIndex]]) + Number(r[valueIndex]) * Number(nFact)
          } else {
            rData[r[peIndex]] = Number(r[valueIndex])
            rData1[r[peIndex]] = Number(r[valueIndex])  * Number(nFact)
          }
        }
      })
      finalMethodData[p.name] = rData
      finalCYPMethodData[p.name] = rData1
    }
  });

  // console.log("finalMethodData", finalMethodData)
  // console.log("finalCYPMethodData", finalCYPMethodData)
  Object.keys(finalMethodData).forEach((m) => {
    let obj = {name:m,data:[],visible:false}
    data.metaData.dimensions.pe.forEach((p) => {
      let formattedPeriod = translateDate({
        rawDate: p,
        periodType: periodType,
      });
      if(finalMethodData[m][p]) {
        obj.data.push({name: formattedPeriod, pe: p, y : finalMethodData[m][p] ? Math.round(finalMethodData[m][p]) : null})
      }
    });
    newTotalTrendSeries.push(obj)
  });
  // console.log("newTotalTrendSeries", newTotalTrendSeries)
  let totalObj = {name:totalCYPText,data:[],visible:true}, innerObj = {}

  Object.keys(finalCYPMethodData).forEach((m) => {
    data.metaData.dimensions.pe.forEach((p) => {
      if(!innerObj[p]) {
        innerObj[p] = finalCYPMethodData[m][p] ? finalCYPMethodData[m][p] : null
      } else {
        innerObj[p] += finalCYPMethodData[m][p] ? finalCYPMethodData[m][p] : null
      }
    });
  });

  data.metaData.dimensions.pe.forEach((p) => {
    let formattedPeriod = translateDate({
      rawDate: p,
      periodType: periodType,
    });
    if(innerObj[p]) {
      totalObj.data.push({name: formattedPeriod, pe: p, y : innerObj[p] ? Math.round(innerObj[p]) : null})
    }
  })
  newTotalTrendSeries.unshift(totalObj)
  // console.log("newTotalTrendSeries", newTotalTrendSeries)

  newTotalTrendSeries.forEach((t) => {
    let tableObj = {[methodTableHeaderName]: t.name}
    data.metaData.dimensions.pe.forEach((p, j) => {
      let formattedPeriod = translateDate({
        rawDate: p,
        periodType: periodType,
      });
      if(t.data[j] && t.data[j].y) {
        tableObj[formattedPeriod] = t.data[j].y
      } else {
        tableObj[formattedPeriod] = ""
      }
    })
    newTotalTrendSeriesTable.unshift(tableObj)
  });
  // console.log("newTotalTrendSeriesTable", newTotalTrendSeriesTable)

  return {
    newTotalTrendSeries,
    newTotalTrendSeriesTable
  }
}

export default{
    exportPPT: (exportArr, formValues, map, bubbleChart, locationName, selectedDate, source, moment) => {
      // console.log(exportArr, formValues, map, bubbleChart, locationName, selectedDate, source)
      import(/* webpackChunkName: "pptxgenjs"*/"pptxgenjs").then((pptxgen) => {
        let pptx = new pptxgen.default();
        pptx.layout = 'LAYOUT_WIDE';
        pptx.author = 'Avenir Generic Tool';
        pptx.company = 'Dure Technologies';
        pptx.subject = i18n.t('geoPro');
        pptx.title = i18n.t('geoPro');
        let mapHeader = map.header.split(':')[1] ? map.header.split(':')[0] : map.header
        pptx.defineSlideMaster({
          title: 'MASTER_SLIDE',
          bkgd: 'FFFFFF',
          objects: [{
              'text': {
                text: i18n.t('geoPro'),
                options: {
                  y: '2%',
                  fontSize: 30,
                  align: 'center',
                  w: '100%',
                  underline: true
                }
              }
            },
            {
              'line': {
                align: 'center',
                x: 4.2,
                y: '90%',
                w: 5,
                h: 0,
                line: '0088CC',
                lineSize: 1
              }
            },
            {
              'line': {
                align: 'center',
                x: 5.2,
                y: '91%',
                w: 3,
                h: 0,
                line: '0088CC',
                lineSize: 1
              }
            },
            {
              'text': {
                // text: i18n.t('mapIndicator') + " :- " + map.header.split(':')[1] ? map.header.split(':')[0] : map.header + "      " + i18n.t('location') + " :- " + locationName,
                text: i18n.t('location') + " :- " + locationName + "      " + i18n.t('mapIndicator') + " :- " + mapHeader,
                options: {
                  x: 0.5,
                  y: '95%',
                  w: '60%',
                  bold: true,
                  fontSize: 12
                }
              }
            },
            {
              'text': {
                text:  i18n.t('period') + " :- " + selectedDate + "      " + i18n.t('dashboardIndicator') + " :- " + source,
                options: {
                  x: 0.5,
                  y: '98%',
                  w: '60%',
                  bold: true,
                  fontSize: 12
                }
              }
            },
            {
              'text': {
                text: moment(new Date()).format('llll'),
                options: {
                  x: 8.5,
                  y: '98%',
                  w: '30%',
                  align: 'right',
                  fontSize: 12,
                  bold: true
                }
              }
            }
          ],
          // slideNumber: { x:0.5, y:'1%'}
        });
  
        let slide = null
  
  
        if (exportArr && exportArr.length) {
          let reA = /[^a-zA-Z]/g;
          let reN = /[^0-9]/g;
  
          exportArr.sort((a, b) => {
            let aA = a.cardKey.replace(reA, ""),
              bA = b.cardKey.replace(reA, "")
            if (aA === bA) {
              let aN = parseInt(a.cardKey.replace(reN, ""), 10);
              let bN = parseInt(b.cardKey.replace(reN, ""), 10);
              return aN === bN ? 0 : aN > bN ? 1 : -1;
            } else {
              return aA > bA ? 1 : -1;
            }
          })
          // console.log(exportArr)
  
          for (let index = 0; index < exportArr.length; index++) {
            const element = exportArr[index];
            slide = pptx.addSlide('MASTER_SLIDE');
            if(element.cardKey !== 'key4') {
              slide.addText(element.title.title, {
                x: 0.5,
                y: 0.6,
                w: '90%',
                fontSize: 18,
                bold: true,
                underline: true,
                breakLine: true
              });
            }
  
            let options = {
              x: 0.5,
              y: 1,
              w: '90%',
              h: '75%',
              showValue: formValues[2] === 'show' ? true : false,
              showLegend: formValues[1] === 'show' ? true : false,
              legendPos: 'b',
              barGapWidthPct: 50,
              showCatAxisTitle: formValues[3] !== 'show' ? false : element.xAxis && element.xAxis.title && element.xAxis.title.text ? true : false,
              catAxisTitle: element.xAxis && element.xAxis.title && element.xAxis.title.text ? element.xAxis.title.text : "",
              showValAxisTitle: formValues[4] !== 'show' ? false : element.yAxis && element.yAxis.title && element.yAxis.title.text ? true : false,
              valAxisTitle: element.yAxis && element.yAxis.title && element.yAxis.title.text ? element.yAxis.title.text : ""
            }
            if(element.cardKey === 'key1'){
              let colChartData = [], lineChartData = [], chartColors = []
  
              element.series.forEach(e => {
                if (e.color) {
                  chartColors.push(e.color.split('#')[1])
                } else {
                  chartColors.push((0xFFFFFFFF - Math.random() * 0xFFFFFFFF).toString(16).substr(0, 6))
                }
                // console.log(chartColors)
                let name = e.name,
                  labels = [],
                  values = []
                if (e.data && e.data.length) {
                  e.data.forEach(ed => {
                    labels.push(ed.name)
                    values.push(ed.y)
                  })
                }
                if(typeof e.type !== 'undefined') {
                  lineChartData.push({
                    name,
                    labels,
                    values
                  })
                } else {
                  colChartData.push({
                    name,
                    labels,
                    values
                  })
                }
              })
              options.chartColors = chartColors
              let chartTypes = [{
                type: pptx.charts.BAR,
                data: colChartData,
                options: {
                  barGrouping: 'standard'
                }
              },
              {
                type: pptx.charts.LINE,
                data: lineChartData,
                options: {
                  barGrouping: 'standard'
                }
              }
            ];
            slide.addChart(chartTypes, options);
          } else if(element.cardKey === 'key6') {
            let tableHeader = JSON.parse(JSON.stringify(element.header)), valueUp = { text:'↑', options:{ color:'66bb6a'} }, valueDown = { text:'↓', options:{ color:'ef5350'} }, valueSame = { text:'•', options:{ color:'ffa726', fontSize: 36, valign:'middle'} }, rows = []
  
            tableHeader.unshift(`${i18n.t('location')}/${i18n.t('method')}`)
            rows.push(tableHeader)
  
            element.data.forEach((item) => {
              let innerRow = []
              item.forEach((itemInner, i) => {
                if(i === 0) {
                  innerRow.push({text: itemInner, options: {bold: true}})
                } else {
                  let rowValue = ((itemInner * 100) < element.min) ? valueDown : ((itemInner * 100) > element.max) ? valueUp : valueSame;
                  innerRow.push(rowValue)
                }
              });
              rows.push(innerRow)
            });
            // console.log(rows)
            let tableY = 1;
            if(formValues[1] === 'show') {
              tableY = 2.5
              slide.addText([
                { text:'↓', options:{ color:'ef5350', breakLine: false} },
                { text:`   ${i18n.t('highchartmsg_footer1')}   `, options:{breakLine: false} },
                { text:'↑', options:{ color:'66bb6a', breakLine: false} },
                { text:`   ${i18n.t('highchartmsg_footer2')}   `, options:{breakLine: false} },
                { text:'•', options:{ color:'ffa726', fontSize: 25, breakLine: false} },
                { text:`   ${i18n.t('highchartmsg_footer3')}`, options:{} }],
                { x:0.5, y:1, w:'90%', h:1.25, fontSize:14, bold: true, valign: 'middle'}
              );
            }
  
            pptx.addSection({ title: 'Tables: Auto-Paging' });
            slide.addTable( rows, { x:0.5, y: tableY, w:12.3, rowH:0.5, fill:'F5F5F5', border:{pt:1, color:'FFFFFF'}, align:'center', valign:'middle', fontSize: 16, bold: true, autoPage:true, newSlideStartY:1 } );
  
          } else {
              let chartData = [],
                chartColors = []
  
              element.series.forEach(e => {
                if (e.color) {
                  chartColors.push(e.color.split('#')[1])
                } else {
                  chartColors.push((0xFFFFFFFF - Math.random() * 0xFFFFFFFF).toString(16).substr(0, 6))
                }
                // console.log(chartColors)
                let name = e.name,
                  labels = [],
                  values = []
                if (e.data && e.data.length) {
                  e.data.forEach(ed => {
                    labels.push(ed.name)
                    values.push(ed.y)
                  })
                }
                chartData.push({
                  name,
                  labels,
                  values
                })
              })
              options.chartColors = chartColors
              // console.log(element.cardKey, element.chart.type,chartData)
              let type = element.chart.type
  
              if (type == "line") {
                type = pptx.ChartType.line
              } else if (type == "area") {
                type = pptx.ChartType.area
              } else if (type == "scatter") {
                type = pptx.ChartType.scatter
                options['lineSize'] = 0
              } else {
                type = pptx.ChartType.bar
                // options['barDir'] = 'col'
                if (element.plotOptions && element.plotOptions.series && element.plotOptions.series.stacking === 'normal') {
                  options['barDir'] = 'bar'
                  options['barGrouping'] = 'stacked'
                }
                if (element.plotOptions && element.plotOptions.series && element.plotOptions.series.stacking === 'percent') {
                  options['barDir'] = 'bar'
                  options['barGrouping'] = 'percentStacked'
                  options['catAxisMaxVal'] = 100
                  options['valAxisMaxVal'] = 100
                }
              }
              slide.addChart(type, chartData, options);
              if(element.cardKey === 'key3' && bubbleChart.screenShot) {
                slide = pptx.addSlide('MASTER_SLIDE');
                slide.addText(bubbleChart.header, {
                  x: 0.5,
                  y: 0.6,
                  w: '90%',
                  fontSize: 18,
                  bold: true,
                  underline: true,
                  breakLine: true
                });
                  slide.addImage({
                    data: bubbleChart.screenShot,
                    x: 0.5,
                    y: 1,
                    w: '90%',
                    h: '75%'
                  });
              }
            }
            // console.log("index",index)
            // console.log("exportArr len",exportArr.length)
            // console.log("exportArr len",exportArr.length-1)
            // console.log(map.screenShot)
            if(index === (exportArr.length - 1) && map.screenShot) {
              // console.log(map.screenShot, "found")
                slide = pptx.addSlide('MASTER_SLIDE');
                slide.addText(map.header, {
                  x: 0.5,
                  y: 0.6,
                  w: '90%',
                  fontSize: 18,
                  bold: true,
                  underline: true,
                  breakLine: true
                });
                slide.addImage({
                  data: map.screenShot,
                  x: 2.5,
                  y: 1,
                  w: '60%',
                  h: '70%',
                  sizing: { type:'cover'}
                });
            }
          }
        }
        pptx.writeFile({fileName: formValues[0]});
        console.log("File exported...")
      })
    },
    getTotalData:(data, p_conf, p_cyp, p_method, periodValue, defaultLocationID, locale, totalCYPText, methodTableHeaderName, periodType, calsType, moment) =>{
      //console.log(calsType, p_conf)
      // console.log("data",data)
      // console.log("p_conf",p_conf)
      // console.log("p_cyp",p_cyp)
      // console.log("p_method",p_method)
      // console.log("periodValue",periodValue)
      // console.log("defaultLocationID",defaultLocationID)
      // console.log("locale",locale)
      // console.log("totalCYPText",totalCYPText)
      // console.log("methodTableHeaderName",methodTableHeaderName)
      // console.log("periodType",periodType)
        /* categories */
        let aCategories = [],
            aPe = data.metaData.dimensions.pe,
            p_isCom = (p_method === 'Commodities_Client' || p_method === 'Commodities_Facilities');

            // console.log("aPe",aPe)
            // console.log("p_isCom",p_isCom)
            // console.log("totalCYPText",totalCYPText)
        aPe.forEach(p => {
            if(data.metaData.items[p]){
              let formattedPeriod = translateDate({
                rawDate: p,
                periodType: periodType,
              });
              aCategories.push(formattedPeriod);
            }
        });
        // console.log("aCategories",aCategories)
        /* indices */
        let valueIndex = 0,ouIndex = 0,peIndex = 0,dxIndex = 0,
            oFinalData = {},oMethodLocData = {},oMethodPeData = {},
            aRegionsCat = [],aMethodsCat = [],
            aTotalCypSeries = [], aTotalCypSeriesLine = [],aBubbleseries = [],
            aTotalCypCats = [],oMethodRegPeriod = {};
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
        data.rows.forEach((r) => {
            let nFact = p_isCom ? p_cyp[r[dxIndex]] || 1 : 1;
            if(!oFinalData[r[ouIndex]]){
                oFinalData[r[ouIndex]] = {};
                aRegionsCat.push(data.metaData.items[r[ouIndex]].name);
                aTotalCypCats.push(data.metaData.items[r[ouIndex]].name);
            }
            if(!oMethodLocData[r[dxIndex]]){
                oMethodLocData[r[dxIndex]] = {}
                aMethodsCat.push(data.metaData.items[r[dxIndex]].name);
            }
            if(!oMethodPeData[r[dxIndex]]){
                oMethodPeData[r[dxIndex]] = {};
            }
            oFinalData[r[ouIndex]][r[peIndex]] =  (oFinalData[r[ouIndex]][r[peIndex]] || 0) + r[valueIndex] * 1 * nFact;

             oMethodLocData[r[dxIndex]][r[ouIndex]] =  (oMethodLocData[r[dxIndex]][r[ouIndex]] || 0) + r[valueIndex] * 1 * nFact;
            //oMethodLocData[r[dxIndex]][r[ouIndex]] =  (oMethodLocData[r[dxIndex]][r[ouIndex]] || 0) + r[valueIndex] * 1;
             oMethodPeData[r[dxIndex]][r[peIndex]] =  (oMethodPeData[r[dxIndex]][r[peIndex]] || 0) + r[valueIndex] * 1 * nFact;
            //oMethodPeData[r[dxIndex]][r[peIndex]] =  (oMethodPeData[r[dxIndex]][r[peIndex]] || 0) + r[valueIndex] * 1 ;
            /*  */
            if(!oMethodRegPeriod[r[dxIndex]]){
                oMethodRegPeriod[r[dxIndex]] = {};
            }
            if(!oMethodRegPeriod[r[dxIndex]][r[ouIndex]]){
                oMethodRegPeriod[r[dxIndex]][r[ouIndex]] = {}
            }
             oMethodRegPeriod[r[dxIndex]][r[ouIndex]][r[peIndex]] = (oMethodRegPeriod[r[dxIndex]][r[ouIndex]][r[peIndex]] || 0) + r[valueIndex] * 1 * nFact;
            //oMethodRegPeriod[r[dxIndex]][r[ouIndex]][r[peIndex]] = (oMethodRegPeriod[r[dxIndex]][r[ouIndex]][r[peIndex]] || 0) + r[valueIndex] * 1 ;
            /*  */
        });
        // console.log("oFinalData",oFinalData)
        // console.log("aRegionsCat",aRegionsCat)
        // console.log("aTotalCypCats",aTotalCypCats)
        // console.log("oMethodLocData",oMethodLocData)
        // console.log("aMethodsCat",aMethodsCat)
        // console.log("oMethodPeData",oMethodPeData)
        // console.log("oMethodRegPeriod",oMethodRegPeriod)


        let oMethodRef = {};
        for(let j in oMethodLocData){
            let nLen = p_conf.length;
            for(let k = 0; k < nLen;k++){
                p_conf[k].de.forEach((ele) => {
                    if(ele === j){
                        oMethodRef[ele] = p_conf[k].name
                    }
                })
            }
        }

        let regionalCharts = getRegionalCYPChart(data, p_conf, p_isCom, p_cyp, periodValue, totalCYPText, valueIndex, peIndex, dxIndex, ouIndex,methodTableHeaderName, periodType),
        newTotalSeries = regionalCharts.newTotalSeries,
        newTotalSeriesTable = regionalCharts.newTotalSeriesTable

        let regionalTrendCharts = getRegionalTrendCYPChart(data, p_conf, p_isCom, p_cyp, periodValue, totalCYPText, valueIndex, peIndex, dxIndex, ouIndex, defaultLocationID, locale,methodTableHeaderName, periodType, moment),
        newTotalTrendSeries = regionalTrendCharts.newTotalTrendSeries,
        newTotalTrendSeriesTable = regionalTrendCharts.newTotalTrendSeriesTable


        // console.log("oMethodRef",oMethodRef)
        let oMethodCyp = {},aRegCat = Object.keys(oFinalData),aTotalCyp = [],oBubbleMethods = {};
          for(let l in oMethodLocData){
            let sName = oMethodRef[l],
                nCypFact = p_isCom ? p_cyp[l] || 1 : 1;

            if(!oMethodCyp[sName]){
                oMethodCyp[sName] = {name:sName,data:[],visible:false};
                oBubbleMethods[sName] = {name:sName,data:[]};
            }
            aRegCat.forEach((ele,ind) => {
                oMethodCyp[sName].data[ind] = (oMethodCyp[sName].data[ind] || 0) + (oMethodLocData[l][ele] ? oMethodLocData[l][ele] : 0);
                oMethodCyp[sName].data[ind] = oMethodCyp[sName].data[ind].toFixed(2) * 1;
                aTotalCyp[ind] = (aTotalCyp[ind] || 0) + oMethodCyp[sName].data[ind] * nCypFact;
                if(!oBubbleMethods[sName].data[ind]){
                    oBubbleMethods[sName].data[ind] = {name:data.metaData.items[ele].name,value:0, id: ele};
                }
                oBubbleMethods[sName].data[ind].value += oMethodCyp[sName].data[ind] * nCypFact;
                oBubbleMethods[sName].data[ind].value = oBubbleMethods[sName].data[ind].value.toFixed(2) * 1;
            });
          }

        // console.log("oMethodCyp",oMethodCyp)
        // console.log("aRegCat",aRegCat)
        // console.log("aTotalCyp",aTotalCyp)
        // console.log("oBubbleMethods",oBubbleMethods)

        oMethodCyp.totalcyp = {name:totalCYPText,data:aTotalCyp.map(ele => Math.round(ele)),visible:true};
        let aCypTable = [];
        for(let j in oMethodCyp){
            aTotalCypSeries.push(oMethodCyp[j]);
            let oRow = {[methodTableHeaderName]:j};
            aTotalCypCats.forEach((ele, ind)=> {
                oRow[ele] = oMethodCyp[j].data[ind];
            });
            aCypTable.push(oRow);
        }
        // console.log("oMethodCyp",oMethodCyp)
        // console.log("aTotalCypSeries",aTotalCypSeries)
        // console.log("aCypTable",aCypTable)
        let aBubbleTable = [];
        for(let t in oBubbleMethods){
            let oRow = {[methodTableHeaderName]:t},
            oTemp = {name:t,data:[]};
            // aBubbleseries.push(oBubbleMethods[t]);
            aTotalCypCats.forEach((ele, ind )=> {
                oRow[ele] = Math.round(oBubbleMethods[t].data[ind].value);
                let nVal = getMostUsedMethod(oBubbleMethods,t,ind,oRow[ele]);
                nVal= Math.round(nVal)
                if(nVal){
                    oTemp.data.push({name:ele,value:nVal, id:oBubbleMethods[t].data[ind].id});
                }
            });
            if(oTemp.data.length){
                aBubbleseries.push(oTemp);
            }
            aBubbleTable.push(oRow);
        }
        // console.log("aBubbleTable",aBubbleTable)
        // console.log("aBubbleseries",aBubbleseries)
        /*   */
        let oMethodCypPe = {},aTotalCypLine = [],aTrendsTable = [];
        for(let k in oMethodPeData){
            let sName = oMethodRef[k],
                nCypFact = p_isCom ? p_cyp[k] || 1 : 1;
            if(!oMethodCypPe[sName]){
                oMethodCypPe[sName] = {name:sName,data:[],visible:false};
            }
            aPe.forEach((ele,ind) => {
                oMethodCypPe[sName].data[ind] = ((oMethodCypPe[sName].data[ind] || 0) + (oMethodPeData[k][ele] ? oMethodPeData[k][ele] : 0)).toFixed(2) * 1;
                aTotalCypLine[ind] = ((aTotalCypLine[ind] || 0) + oMethodCypPe[sName].data[ind] * nCypFact);
            });
        }
        // console.log("oMethodCypPe",oMethodCypPe)
        // console.log("aTotalCypLine",aTotalCypLine)
        // console.log("aTrendsTable",aTrendsTable)
        oMethodCypPe.totalcyp = {name:totalCYPText,data:aTotalCypLine.map(ele => Math.round(ele)),visible:true};
        for(let j in oMethodCypPe){
            let oRow = {[methodTableHeaderName]:j};
            aTotalCypSeriesLine.push(oMethodCypPe[j]);
            aCategories.forEach((ele,ind) => {
                oRow[ele] = oMethodCypPe[j].data[ind];
            });
            aTrendsTable.push(oRow);
        }
        // console.log("oMethodCypPe",oMethodCypPe)
        // console.log("aTotalCypSeriesLine",aTotalCypSeriesLine)
        // console.log("aTrendsTable",aTrendsTable)
        /*  */
        let oMethodFinalRegPeriod = {},aAvgTotalCyp = [],
            oAvgTotalCyp = {};
        for(let m in oMethodRegPeriod){
            // data.metaData.items[r[ouIndex]].name
            // let sMethod = data.metaData.items[m].name;
            let sMethod = oMethodRef[m],
                nCypFact = p_isCom ? p_cyp[m] || 1 : 1;
            if(!oMethodFinalRegPeriod[sMethod]){
                oMethodFinalRegPeriod[sMethod] = {};
            }
            for(let n in oMethodRegPeriod[m]){
                let sRegion = data.metaData.items[n].name;
                if(!oMethodFinalRegPeriod[sMethod][sRegion]){
                    oMethodFinalRegPeriod[sMethod][sRegion] = {}
                }
                /* for(let l in oMethodRegPeriod[m][n]){
                    let sMonth = data.metaData.items[l].name;
                    oMethodFinalRegPeriod[sMethod][sRegion][sMonth] = oMethodRegPeriod[m][n][l];
                } */

                aPe.forEach((p,ind) =>{
                  let sMonth = translateDate({
                    rawDate: p,
                    periodType: periodType,
                  });
                    oMethodFinalRegPeriod[sMethod][sRegion][sMonth] = oMethodRegPeriod[m][n][p] || 0;
                    aAvgTotalCyp[ind] = (aAvgTotalCyp[ind] || 0) + oMethodFinalRegPeriod[sMethod][sRegion][sMonth] * 1 * nCypFact ;
                    if(!oAvgTotalCyp[sRegion]){
                        oAvgTotalCyp[sRegion] = {};
                    }
                    oAvgTotalCyp[sRegion][sMonth] = (oAvgTotalCyp[sRegion][sMonth] || 0) + oMethodFinalRegPeriod[sMethod][sRegion][sMonth] * 1 * nCypFact;
                });
            }
        }
        // console.log("oMethodFinalRegPeriod",oMethodFinalRegPeriod)
        // console.log("aAvgTotalCyp",aAvgTotalCyp)
        // console.log("oAvgTotalCyp",oAvgTotalCyp)
        /*  */
        //console.log(aBubbleseries)
        return{
            categories:aTotalCypCats,
            series:newTotalSeries,
            cypTable:newTotalSeriesTable,
            totalcyp:aTotalCyp,

            lineCats:aCategories,
            lineSeries : newTotalTrendSeries,
            trendTable:newTotalTrendSeriesTable,
            bubbleSeries:aBubbleseries,
            bubbleTable:aBubbleTable,
            /*  */
            avgAnnualGrowthData:oMethodFinalRegPeriod,
            avgTotalCypData:oAvgTotalCyp
            /*  */
        }
    },
    getMethodMixChartDataNew:({series},methodTableHeaderName)=>{
      let aFinalData = [], aTable = [], total = {}, mSeries = JSON.parse(JSON.stringify(series)).filter(s => s.name.toLowerCase().indexOf('total') === -1)

      mSeries.forEach((item) => {
        item.data.forEach((data) => {
          if(total[data.name]) {
            total[data.name] += data.y * 1
          } else {
            total[data.name] = data.y * 1
          }
        });
      });
      // console.log("total", total)
      // console.log("mSeries", mSeries)
      mSeries.forEach((item) => {
        let tableData = {[methodTableHeaderName]: item.name}
        aFinalData.push({
          ...item,
          visible: true,
          data: item.data.length ? item.data.map(d => {
            tableData[d.name] = ((d.y / total[d.name]) * 100).toFixed(2) * 1
            return {...d, y: ((d.y / total[d.name]) * 100).toFixed(2) * 1 }
          }) : []
        })
        if(item.data.length === 0) {
          Object.keys(total).forEach(l => {
            tableData[l] = ""
          })
        }
        aTable.push(tableData)
      });

      // console.log("aFinalData", JSON.stringify(aFinalData))
      // console.log("aTable", aTable)

      return {
          finalData:aFinalData,
          table:aTable,
      };
    },
    getMethodMixChartData:({series,totalcyp,categories})=>{
      // console.log(series)
      // console.log(totalcyp)
      // console.log(categories)
        let aFinalData = [],aTotalVal = [],aTable = [];
        series.forEach((ele) => {
            let {data,name} = ele;
            if(name.toLowerCase().indexOf('total') === -1){
                let oTemp = {name:name,data:[]},
                    oRow = {Method:name};

                data.forEach((d,j) => {
                    let nVal = ((d/totalcyp[j]) * 100).toFixed(2) * 1;
                    oTemp.data[j] = nVal;
                    aTotalVal[j] = (aTotalVal[j] || 0) + nVal;
                    oRow[categories[j]] = nVal;
                });
                aTable.push(oRow);
                aFinalData.push(oTemp);
            }
        });

        /*  */
        let aAggregate = [],aCatValue = [],aAggregateTable = [];
        aFinalData.forEach((ele) => {
            ele.data.forEach((val, index) => {
                aCatValue[index] = (aCatValue[index] || 0) + val;
            });
        });
        aFinalData.forEach((ele,ind) => {
            let data = [],oRow = {Method:ele.name};
            aAggregate[ind] = {name:ele.name,data:[]};
            ele.data.forEach((val, index) => {
                data[index] = aCatValue[index] ? ((val / aCatValue[index]) * 100).toFixed(2) * 1 : 0;
                oRow[categories[index]] = data[index];
            });
            aAggregate[ind].data = data;
            aAggregateTable.push(oRow);
        });
        return {
            finalData:aFinalData,
            table:aTable,
            aggTable:aAggregateTable,
            aggData:aAggregate
        };
    },
    calculateAvgMethodMix:({avgAnnualGrowthData,avgTotalCypData,categories},p_period,p_months,p_flag, locale, totalCYPText, methodTableHeaderName, methodSeq, periodType, moment)=>{
        // console.log(avgAnnualGrowthData,avgTotalCypData,moment(p_period, 'YYYYMM').subtract(12, 'months').format('MMM YYYY'));
        // console.log(avgAnnualGrowthData,avgTotalCypData,categories,p_period,p_months,p_flag, locale, totalCYPText,methodTableHeaderName, methodSeq, periodType)
        let aSeries = [],aTable = [],aMethodCats = [],
            sPrevPer = null,
            sNextPer = null;
            let quarters = {
              "Q1": ["Jan", "Mar"],
              "Q2": ["Apr", "Jun"],
              "Q3": ["Jul", "Sep"],
              "Q4": ["Oct", "Dec"],
            }, years = ["Mar", "Apr"], yearsJuly = ["Jun", "Jul"]
            if(locale === 'fr'){
              quarters = {
                "Q1": ['janv.', 'mars'],
                "Q2": ['avril', 'juin'],
                "Q3": ['juil.', 'sept.'],
                "Q4": ['oct.', 'déc.'],
              }
              years = ['mars', 'avril'], yearsJuly = ["juin", "juil."]
            }
            if(periodType === 'monthly') {
              sPrevPer = moment(p_period, 'YYYYMM').format('MMM YYYY')
              sNextPer = moment(p_period, 'YYYYMM').subtract(p_months, 'months').format('MMM YYYY');
            }
            if(periodType === 'yearly') {
              sPrevPer = moment(p_period, 'YYYY').format('YYYY')
              sNextPer = moment(p_period, 'YYYY').subtract(p_months, 'year').format('YYYY');
            }
            if(periodType === 'financialYear') {
              // sPrevPer = `${p_period}April`
              // sNextPer = `${p_period*1-1}April`;
              let q1 = p_period.split('April')
              sPrevPer = `${years[1]} ${q1[0]} ${i18n.t('toSmall')} ${years[0]} ${q1[0]*1+1}`
              sNextPer = `${years[1]} ${q1[0]*1-1} ${i18n.t('toSmall')} ${years[0]} ${q1[0]}`
            }
            // console.log("p_period", p_period)
            if(periodType === 'financialYearJuly') {
              let q1 = p_period.split('July')
              // sPrevPer = `${p}July`
              // sNextPer = `${p*1-1}July`;
              sPrevPer = `${yearsJuly[1]} ${q1[0]} ${i18n.t('toSmall')} ${yearsJuly[0]} ${q1[0]*1+1}`
              sNextPer = `${yearsJuly[1]} ${q1[0]*1-1} ${i18n.t('toSmall')} ${yearsJuly[0]} ${q1[0]}`
            }
            if(periodType === 'quarterly') {
              sPrevPer = p_period
              sNextPer = moment(p_period, 'YYYY[Q]Q').subtract(p_months, 'Q').format('YYYY[Q]Q');
            }
            // console.log("sPrevPer",sPrevPer)
            // console.log("sNextPer",sNextPer)
            //console.log("aSeries",aSeries)
        for(let i in avgAnnualGrowthData){
            let oTemp = {name:i,data:[],visible:false},
                oRow = {[methodTableHeaderName]:i};
            aMethodCats.push(i);
            // console.log("avgAnnualGrowthData[i]",avgAnnualGrowthData[i])
            categories.forEach((ele,ind) => {
                let nInt = 0;
                if(avgAnnualGrowthData[i][ele]){
                  // console.log("ele",ele)
                  // console.log("avgAnnualGrowthData[i][ele]",avgAnnualGrowthData[i][ele])
                  if(p_flag){
                      nInt = (((avgAnnualGrowthData[i][ele][sNextPer] || 0) - (avgAnnualGrowthData[i][ele][sPrevPer] || 0)) / 12).toFixed(2) * 1;
                  }else{
                    // console.log("avgAnnualGrowthData[i][ele][sNextPer]", avgAnnualGrowthData[i][ele][sNextPer])
                    // console.log("avgAnnualGrowthData[i][ele][sPrevPer]", avgAnnualGrowthData[i][ele][sPrevPer])
                      nInt = (((avgAnnualGrowthData[i][ele][sNextPer] || 0) - (avgAnnualGrowthData[i][ele][sPrevPer] || 0)) / (avgAnnualGrowthData[i][ele][sPrevPer] || 1)).toFixed(2) * 1;
                  }
                }

                oTemp.data[ind] = nInt;
                oRow[ele] = nInt;
            });
            aSeries.push(oTemp);
            aTable.push(oRow);
        }

        if(p_flag){
            let oCypBar = {name:totalCYPText,data:[],visible:true},
                oTableRow = {[methodTableHeaderName]:totalCYPText};
            categories.forEach((ele) => {
                let nInt = (((avgTotalCypData[ele][sNextPer] || 0) - (avgTotalCypData[ele][sPrevPer] || 0)) / 12 ).toFixed(1) * 1;
                oCypBar.data.push(nInt);
                oTableRow[ele] = nInt
            });
            aSeries.unshift(oCypBar)
            aTable.unshift(oTableRow);
        }
         let compData = [],
         existArray = [], newCats = [];
         if (aSeries && methodSeq) {
          aSeries.forEach((m, i) => {
             if (existArray.includes(m["name"]) == false) {
               existArray.push(m["name"]);
                methodSeq.forEach((v, i) => {
                 if (m["name"] == v.name) {
                   compData[i] = m;
                   newCats[i] = m["name"]
                 }
                });
             }else{
              aSeries.splice(i, 1);
             }

             if(m["name"] == totalCYPText){
               compData.push(m)
             }
           });
         }
         compData = compData.filter(function(el) { return el != null && el != "";});
         newCats = newCats.filter(function(el) { return el != null && el != "";});

         // console.log("aSeries", aSeries)
         // console.log("aTable", aTable)
         // console.log("newCats", newCats)
         // console.log("compData", compData)
        return {
          series : aSeries,
          table:aTable,
          methods:newCats,
          data: compData
        };
    },
    calculateAvgEMUMethodMix:({categories, avgAnnualGrowthData},p_period,p_months,methodTableHeaderName, periodType, locale, moment)=>{
        let aSeries = [],aTable = [],aMethodCats = [],
            sPrevPer = null,
            sNextPer = null;
            let quarters = {
              "Q1": ["Jan", "Mar"],
              "Q2": ["Apr", "Jun"],
              "Q3": ["Jul", "Sep"],
              "Q4": ["Oct", "Dec"],
            }, years = ["Mar", "Apr"], yearsJuly = ["Jun", "Jul"]
            if(locale === 'fr'){
              quarters = {
                "Q1": ['janv.', 'mars'],
                "Q2": ['avril', 'juin'],
                "Q3": ['juil.', 'sept.'],
                "Q4": ['oct.', 'déc.'],
              }
              years = ['mars', 'avril'], yearsJuly = ["juin", "juil."]
            }
            if(periodType === 'monthly') {
              sPrevPer = moment(p_period, 'YYYYMM').format('MMM YYYY')
              sNextPer = moment(p_period, 'YYYYMM').subtract(p_months, 'months').format('MMM YYYY');
            }
            if(periodType === 'yearly') {
              sPrevPer = moment(p_period, 'YYYY').format('YYYY')
              sNextPer = moment(p_period, 'YYYY').subtract(p_months, 'year').format('YYYY');
            }
            if(periodType === 'financialYear') {
              // sPrevPer = `${p_period}April`
              // sNextPer = `${p_period*1-1}April`;
              let q1 = p_period.split('April')
              sPrevPer = `${years[1]} ${q1[0]} ${i18n.t('toSmall')} ${years[0]} ${q1[0]*1+1}`
              sNextPer = `${years[1]} ${q1[0]*1-1} ${i18n.t('toSmall')} ${years[0]} ${q1[0]}`
            }
            // console.log("p_period", p_period)
            if(periodType === 'financialYearJuly') {
              let q1 = p_period.split('July')
              // sPrevPer = `${p}July`
              // sNextPer = `${p*1-1}July`;
              sPrevPer = `${yearsJuly[1]} ${q1[0]} ${i18n.t('toSmall')} ${yearsJuly[0]} ${q1[0]*1+1}`
              sNextPer = `${yearsJuly[1]} ${q1[0]*1-1} ${i18n.t('toSmall')} ${yearsJuly[0]} ${q1[0]}`
            }
            if(periodType === 'quarterly') {
              sPrevPer = p_period
              sNextPer = moment(p_period, 'YYYY[Q]Q').subtract(p_months, 'Q').format('YYYY[Q]Q');
            }

        for(let i in avgAnnualGrowthData){
            let oTemp = {name:i,data:[]},
                oRow = {[methodTableHeaderName]:i};
            aMethodCats.push(i);
            categories.forEach((ele,ind) => {
                let nInt;
                if(i, avgAnnualGrowthData[i][ele]){
                  nInt = (((avgAnnualGrowthData[i][ele][sNextPer] || 0) - (avgAnnualGrowthData[i][ele][sPrevPer] || 0)) / (avgAnnualGrowthData[i][ele][sPrevPer] || 0)).toFixed(2) * 1;
                }

                oTemp.data[ind] = nInt;
                oRow[ele] = nInt;
            });
            aSeries.push(oTemp);
            aTable.push(oRow);
        }

        return {
            series : aSeries,
            table:aTable,
            methods:aMethodCats,
            data: aSeries
        };
    },
    calculateHighChartTable: ({data},p_cats) => {
      // console.log("calculateHighChartTable data",data)
      // console.log("calculateHighChartTable p_cats", p_cats)
        let aChartTable = []
        p_cats.forEach((ele,i) => {
            let aRow = [ele];
            data.forEach((ser) =>{
                aRow.push(ser.data[i]);
            })
            aChartTable.push(aRow);
        });
        return aChartTable;
    },
    calculateCypFactors:({chartData},p_conf) =>{
        // console.log("chartData", chartData)
        // console.log("p_conf", p_conf)
        let oData = {};
        chartData.forEach((ele) => {
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
    }
}
