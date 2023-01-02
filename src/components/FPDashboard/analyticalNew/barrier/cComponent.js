import merge from 'lodash/merge'
import i18n from '@/i18n.js'
import {
  translateDate,
  subtractNDate,
} from "@/components/Common/commonFunctions";

export default {
    dxTotalOUData: (response, countryID, catArray, items, fields, sourceConfig, cypArray, chartComponent, total, totalColor, derivedChart, locale, tablePeriodHeader, periodType, moment) => {
      // console.log("response",response)
      // console.log("locale",locale)
    let pe = response.data.metaData.dimensions.pe
    // console.log("period",pe)
    let categories = []
    pe.forEach(p => {
      if (response.data.metaData.items[p]) {
        let formattedPeriod = translateDate({
          rawDate: p,
          periodType: periodType,
        });
        categories.push(formattedPeriod)
        items.push({
          [tablePeriodHeader]: formattedPeriod,
          "_cellVariants": {[tablePeriodHeader]: 'light'}
        })
      }
    })

    // console.log("categories", categories)
    let valueIndex = 0,
      ouIndex = 0,
      peIndex = 0,
      dxIndex = 0
    response.data.headers.forEach((h, i) => {
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
    })

    let obj = {},
      series = [],
      rData1 = {}

    // console.log(catArray)

    catArray.forEach((dx, dxI) => {
      // console.log(dx)
      let rData = {};
      // if (cypArray.length === 0) {
      response.data.rows.forEach((r, i) => {
        if (dx.dx.includes(r[dxIndex])) {
          if (Object.keys(rData).includes(r[peIndex])) {
            if(r[ouIndex] == countryID[0]){
              if (Object.keys(rData[r[peIndex]]).includes(r[ouIndex])) {
                rData[r[peIndex]][r[ouIndex]] = Number(rData[r[peIndex]][r[ouIndex]]) + Number(r[valueIndex])
              } else {
                rData[r[peIndex]][r[ouIndex]] = Number(r[valueIndex])
              }
            }
          } else {
            if(r[ouIndex] == countryID[0]){
              rData[r[peIndex]] = {
                [r[ouIndex]]: Number(r[valueIndex])
              }
            }
          }

        }
      })
      // }

       // console.log("rData", rData)
      // console.log("rData1", rData1)

      Object.keys(rData).forEach((d, j) => {
          let name = null,
            color = null,
            visible = null

          // console.log(dx)
          Object.keys(response.data.metaData.items).forEach(k => {
            if (dx.dx.includes(k)) {
              // name = response.data.metaData.items[k].name
              name = dx.name
              color = dx.color
              //visible = dx.visible
            }
          })
          fields.push({key:name, sortable: true})
          obj = {
            name,
            visible,
            data: [],
            color: color ? color : '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
            // color: cData.indicator.subIndicator[j] ? cData.indicator.subIndicator[j].color : '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
          }
          if(name == 'Removal'){
            obj['dashStyle'] = 'longdash'
          }

          pe.forEach((o, i) => {
            if(rData[o]) {
              if(rData[o][countryID[0]]) {
                obj.data.push({
                  name: categories[i],
                  y: (rData[o][countryID[0]] * 1).toFixed(2) * 1,
                  pe: o
                })

                items[i] = {
                  ...items[i],
                  [name]: (rData[o][countryID[0]] * 1).toFixed(2) * 1
                }
              } else {
                obj.data.push({
                  name: categories[i],
                  y: null,
                  pe: o
                })

                items[i] = {
                  ...items[i],
                  [name]: ""
                }
              }
            } else {
              obj.data.push({
                name: categories[i],
                y: null,
                pe: o
              })

              items[i] = {
                ...items[i],
                [name]: ""
              }
            }
          })
      })

      series.push(obj)

    })

    // console.log(rData1)
    if (total && Object.keys(rData1).length) {
      Object.keys(rData1).forEach((d, j) => {

        // console.log(rData1[d])
        // console.log("rData1",rData1)
        // console.log("rData1[d]", d)
        // console.log("rData1[d]", countryID[0])
        // if (!Object.keys(rData1[d]).includes(countryID[0])) {

        //console.log(rData1[d])
        //console.log("rData1[d]", d)

        let name = cypArray.length !== 0 ? "Total CYP" : `Total ${chartComponent}`,
          color = null,
          visible = true

        // console.log(dx)
        // Object.keys(response.data.metaData.items).forEach(k => {
        //   if (dx.dx.includes(k)) {
        //     // name = response.data.metaData.items[k].name
        //     name = dx.name
        //     color = dx.color
        //     visible = dx.visible
        //   }
        // })
        fields.push({key:name, sortable: true})
        obj = {
          name,
          visible,
          data: [],
          color: totalColor ? totalColor : '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
          // color: cData.indicator.subIndicator[j] ? cData.indicator.subIndicator[j].color : '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
        }
        let outlier = [],
          narration = []
        ou.forEach((o, i) => {

          if (Object.keys(rData1[d]).includes(o)) {

            // check for double sum of indicator

            obj.data.push({
              name: categories[i],
              y: (rData1[d][o] * 1).toFixed(2) * 1
            })

            items[i] = {
              ...items[i],
              [name]: (rData1[d][o] * 1).toFixed(2) * 1
            }

          } else {

            if (sourceConfig.chart.type === 'line') {

              obj.data.push({
                name: categories[i],
                y: 0
              })
            } else {

              obj.data.push({
                name: categories[i],
                y: null
              })
              items[i] = {
                ...items[i],
                [name]: 0
              }
            }
          }
        })
        // console.log(obj)
        series.push(obj)
        // }
      })
    }
    // console.log(series)

    return {
      series,
      categories,
      items,
      fields
    }
    },
    // Access - Compare chart: Across selected location and period with method as series.
    dxTotalOUDataAccessNew: (response, countryID, catArray, items, fields, derivedChart, chartType, isRegionalChart, periodType, locale, tablePeriodHeader, tableLocationHeader, moment) => {
      // console.log("response",response)
      // console.log("chartType",chartType)
      // console.log("catArray",catArray)
        let ou = response.data.metaData.dimensions.ou.filter(o => o !== countryID[0]), pe = response.data.metaData.dimensions.pe
        // console.log("Locations",ou)

        // console.log("period",pe)
        let categories = [],
            count = 0
      if(chartType === 'period') {
        pe.forEach((p) => {
          if (response.data.metaData.items[p]) {
            let formattedPeriod = translateDate({
              rawDate: p,
              periodType: periodType,
            });
            categories.push(formattedPeriod)

            items.push({
              [tablePeriodHeader]: formattedPeriod,
              "_cellVariants": {
                [tablePeriodHeader]: 'light'
              }
            })
          }
        });
      } else {
        categories.push(response.data.metaData.items[countryID[0]].name)
        items.push({
          [tableLocationHeader]: response.data.metaData.items[countryID[0]].name,
          "_cellVariants": {
            [tableLocationHeader]: 'light'
          }
        })
      }


        // console.log(items)
        // console.log("categories", categories)

        let valueIndex = 0,
            ouIndex = 0,
            peIndex = 0,
            dxIndex = 0
        response.data.headers.forEach((h, i) => {
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
        })

        let obj = {},
            series = [],
            rData1 = {}


        let rows = response.data.rows.filter(r => r[ouIndex] !== countryID[0])
        // console.log("rows without higher region",rows)
        let uniqueOU = {}
        response.data.metaData.dimensions.ou.forEach((ou, i) => {
          if(ou !== countryID[0]) {
            uniqueOU[ou] = "IA"
          }
        });
        let pData = {}
        pe.forEach((p, pI) => {
          let rCatData = {}
          catArray.forEach((item, itemI) => {
            let catData = {name: item.name, methods: []}
            item.forEach((m, mI) => {
              let methodData = {name: m.name, de: []}
              m.dx.forEach((dx, dxI) => {
                let innerDX = {deID: dx, count: {}}
                rows.forEach((r, i) => {
                  if(dx === r[dxIndex] && p === r[peIndex]){
                    innerDX['count'][r[ouIndex]] = r[valueIndex] * 1 === 0 ? 'T' : 'F'
                  }
                })
                let uniqueOU_Temp = JSON.parse(JSON.stringify(uniqueOU))
                let combinedOU = merge(uniqueOU_Temp, innerDX.count)
                innerDX.count = combinedOU
                methodData['de'].push(innerDX)
              });
              catData.push(methodData)
            });
            rCatData[item.name] = catData
          });
          pData[p] = rCatData
        });

        // console.log("pData",pData)
        // console.log("uniqueOU",uniqueOU)

        let peDECompare = {}
        Object.keys(pData).forEach((pd, pdI) => {
          let deCompare = {}
          Object.keys(pData[pd]).forEach(rData => {
            let catData = {name: rData, methods: []}
            pData[pd][rData].forEach(m => {
              let methodData = {name: m.name, deCompare: {}};

              Object.keys(uniqueOU).forEach((ou, i) => {
                let finalStatus = null
                m.de.forEach((de, j) => {
                  if(j === 0) {
                      finalStatus = de.count[ou]
                  } else {
                    if( (finalStatus === "T" && de.count[ou] === "T") || (finalStatus === "T" && de.count[ou] === "IA") || (finalStatus === "IA" && de.count[ou] === "T") ) {
                      finalStatus = "T"
                    } else if(finalStatus === "IA" && de.count[ou] === "IA") {
                      finalStatus = "IA"
                    } else {
                      finalStatus = "F"
                    }
                  }
                });
                methodData.deCompare[ou] = finalStatus
              });
              // console.log("methodData", methodData)
              catData.push(methodData)
            })
            deCompare[rData] = catData
          })
          peDECompare[pd] = deCompare
        });



        // console.log("peDECompare",peDECompare)
        // console.log("uniqueOU",uniqueOU)

        let peMethodCompare = {}
        Object.keys(peDECompare).forEach((pd, pdI) => {
          let methodCompare = {}
          Object.keys(peDECompare[pd]).forEach(deData => {
            let catData = {name: deData, methodCompare: {}};
            Object.keys(uniqueOU).forEach((ou, i) => {
              let finalStatus = null
              peDECompare[pd][deData].forEach((de, j) => {
                if(j === 0) {
                    finalStatus = de.deCompare[ou]
                } else {
                  if( (finalStatus === "T" && de.deCompare[ou] === "T") || (finalStatus === "T" && de.deCompare[ou] === "IA") || (finalStatus === "IA" && de.deCompare[ou] === "T") ) {
                    finalStatus = "T"
                  } else if(finalStatus === "IA" && de.deCompare[ou] === "IA") {
                    finalStatus = "IA"
                  } else {
                    finalStatus = "F"
                  }
                }
              });
              catData.methodCompare[ou] = finalStatus
            });
            methodCompare[deData] = catData
          })
          peMethodCompare[pd] = methodCompare
        });



        // console.log(peMethodCompare)

        let peFinalCount = {}
        Object.keys(peMethodCompare).forEach(pm => {
          let finalCount = {}
          Object.keys(peMethodCompare[pm]).forEach(deData => {
            let methodData = peMethodCompare[pm][deData].methodCompare, numerator = Object.keys(methodData).filter(d => methodData[d] === "F").length, denominator = Object.keys(methodData).filter(d => methodData[d] === "T").length
            finalCount[deData] = {numerator, denominator: numerator+denominator}
          })
          peFinalCount[pm] = finalCount
        });


        // console.log("peFinalCount",peFinalCount)

        let name = null,
        color = null,
        visible = null
        if(chartType === 'period') {
          catArray.forEach((cat, catI) => {
            name = cat.name
            color = cat.color
            visible = cat.visible

            fields.push({
                key: name,
                sortable: true
            })

            obj = {
                name,
                visible,
                data: [],
                color: color ? color : '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
            }

            Object.keys(peFinalCount).forEach((d, j) => {
                // console.log(d)
                //console.log(j)
                //console.log(rData[d])
                // Object.keys(peFinalCount[d]).forEach(m => {
                
                let formattedPeriod = translateDate({
                  rawDate: d,
                  periodType: periodType,
                });
                  obj.data.push({
                      name: formattedPeriod,
                      y: peFinalCount[d][name].denominator * 1 !== 0 ? ((peFinalCount[d][name].numerator / peFinalCount[d][name].denominator) * 100).toFixed(2) * 1 : null,
                      pe: d
                  })
                  // console.log(items[j])
                  // console.log(name)

                  items[j] = {
                      ...items[j],
                      [name]: peFinalCount[d][name].denominator * 1 !== 0 ? ((peFinalCount[d][name].numerator / peFinalCount[d][name].denominator) * 100).toFixed(2) * 1 : i18n.t('inactive')
                  }
                // });
            })
            series.push(obj)
          });


        } else {
          Object.keys(peFinalCount).forEach((d, j) => {
              // console.log(d)
              //console.log(j)
              //console.log(rData[d])
              Object.keys(peFinalCount[d]).forEach(m => {
                let catData = catArray.find(c => c.name == m)
                name = catData.name
                color = catData.color
                visible = catData.visible

                fields.push({
                    key: name,
                    sortable: true
                })

                obj = {
                    name,
                    visible,
                    data: [],
                    color: color ? color : '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
                }

                obj.data.push({
                    name: response.data.metaData.items[countryID[0]].name,
                    y: peFinalCount[d][name].denominator * 1 !== 0 ? ((peFinalCount[d][m].numerator / peFinalCount[d][m].denominator) * 100).toFixed(2) * 1 : null,
                    color: catData.color
                })
                // console.log(items[j])
                // console.log(name)

                items[0] = {
                    ...items[0],
                    [name]: peFinalCount[d][name].denominator * 1 !== 0 ? ((peFinalCount[d][m].numerator / peFinalCount[d][m].denominator) * 100).toFixed(2) * 1 : i18n.t('inactive')
                }
                series.push(obj)
              });
          })
        }


        // console.log(items)
        // console.log(fields)

        return {
            series,
            categories,
            items,
            fields
        }
    },
    dxTotalOUDataAccessNewCalculated: (response, countryID, catArray, items, fields, derivedChart, chartType, isRegionalChart, periodType, locale, tablePeriodHeader, tableLocationHeader, moment) => {
      // console.log("response",response)
      // console.log("locale",locale)
      let valueIndex = 0,
        ouIndex = 0,
        peIndex = 0,
        dxIndex = 0
      response.data.headers.forEach((h, i) => {
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
      })

      let obj = {}, series = [], categories = [],
      drilldown = {
        drillUpButton: {
          position: {
            align: "left",
            x: 0,
            y: 0
          }
        },
        // allowPointDrilldown: false,
        series: []
      }


      if(chartType === 'period') {
        // console.log("period",pe)
        let pe = response.data.metaData.dimensions.pe
        pe.forEach(p => {
          if (response.data.metaData.items[p]) {
            let formattedPeriod = translateDate({
              rawDate: p,
              periodType: periodType,
            });
            categories.push(formattedPeriod)
            items.push({
              [tablePeriodHeader]: formattedPeriod,
              "_cellVariants": {[tablePeriodHeader]: 'light'}
            })
          }
        })

        // console.log("categories", categories)

        // console.log(catArray)
        // response.data.metaData.dimensions.dx.forEach((dx, dxI) => {
        catArray.forEach((dx, dxI) => {
          let rData = {};
          response.data.rows.forEach((r, i) => {
            if (dx.dx.includes(r[dxIndex])) {
              if (Object.keys(rData).includes(r[ouIndex])) {
                // rData[r[ouIndex]][r[peIndex]] = Number(r[valueIndex])
                if (Object.keys(rData[r[ouIndex]]).includes(r[peIndex])) {
                  rData[r[ouIndex]][r[peIndex]] = Number(rData[r[ouIndex]][r[peIndex]]) + Number(r[valueIndex])
                } else {
                  rData[r[ouIndex]][r[peIndex]] = Number(r[valueIndex])
                }
              } else {
                rData[r[ouIndex]] = {
                  [r[peIndex]]: Number(r[valueIndex])
                }
              }

            }
          })

          // console.log("rData", rData)
          let bFlag = false
          Object.keys(rData).forEach((d, j) => {

            //console.log(rData[d])
            //console.log("rData[d]", d)
            // console.log("rData[d]", countryID[0])
            if (d === countryID[0]) {

              //console.log(rData[d])
              //console.log("rData[d]", d)

              let name = null,
                color = null,
                visible = null

              //console.log(dx)
              Object.keys(response.data.metaData.items).forEach(k => {
                if (dx.dx.includes(k)) {
                  // name = response.data.metaData.items[k].name
                  name = dx.name
                  color = dx.color
                  visible = dx.visible
                }
              })
              fields.push({key:name, sortable: true})
              obj = {
                name,
                visible,
                data: [],
                color: color ? color : '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
                // color: cData.indicator.subIndicator[j] ? cData.indicator.subIndicator[j].color : '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
              }
              let outlier = [],
                narration = []
              pe.forEach((p, i) => {

                let prevPeriod = subtractNDate({
                  rawDate: p,
                  periodType: periodType,
                });
                if (Object.keys(rData[d]).includes(p)) {

                  // check for double sum of indicator


                  obj.data.push({
                    name: categories[i],
                    pe: p,
                    pePrev: i === 0 ? 0 : prevPeriod,
                    y: (rData[d][p] * 1).toFixed(2) * 1,
                    drilldown: i === 0 ? `${name} ( ${categories[i]} )` : `${name} ( ${categories[i]} - ${categories[i-1]} )`
                  })

                  items[i] = {
                    ...items[i],
                    [name]: (rData[d][p] * 1).toFixed(2) * 1
                  }

                } else {

                  obj.data.push({
                    name: categories[i],
                    pe: p,
                    pePrev: i === 0 ? 0 : prevPeriod,
                    y: null,
                    drilldown: null
                  })
                  items[i] = {
                    ...items[i],
                    [name]: ""
                  }
                }
              })
              series.push(obj)
            }
            if (j === Object.keys(rData).length - 1) {
              bFlag = true
            }
          })
          if (bFlag) {
            // console.log("series", series)
            series[dxI].data.forEach((rt, k) => {
              // console.log(rt)
              obj = {
                id: rt.drilldown,
                type: 'column',
                name: rt.drilldown,
                data: []
              }
              // let regions = []
              Object.keys(rData).forEach((d, j) => {
                let name = null
                Object.keys(response.data.metaData.items).forEach(k => {
                  if (d === k) {
                    name = response.data.metaData.items[k].name
                  }
                })
                if (d !== countryID[0]) {
                  if (Object.keys(rData[d]).includes(rt.pe)) {
                    let y = null,
                      color = null
                    if (k === 0) {
                      y = rData[d][rt.pe] * 1 ? (((rData[d][rt.pe] * 1).toFixed(2) * 1) - 0).toFixed(2) * 1 : null
                      color = y > 0 ? '#5BD282' : '#FE8081'
                      obj.data.push({
                        name,
                        y,
                        color,
                        "locationID": d
                      })
                    } else {
                      if(rData[d][rt.pePrev] * 1){
                        if(rData[d][rt.pe] * 1) {
                          y = (((rData[d][rt.pe] * 1).toFixed(2) * 1) - ((rData[d][rt.pePrev] * 1).toFixed(2) * 1)).toFixed(2) * 1
                        } else {
                          y = (0 - ((rData[d][rt.pePrev] * 1).toFixed(2) * 1)).toFixed(2) * 1
                        }
                      } else if(rData[d][rt.pe] * 1) {
                        y = (((rData[d][rt.pe] * 1).toFixed(2) * 1) - 0 ).toFixed(2) * 1
                      } else {
                        y = null
                      }
                      color = y > 0 ? '#5BD282' : '#FE8081'
                      obj.data.push({
                        name,
                        y,
                        color,
                        "locationID": d
                      })
                    }
                  }
                }
              })
              drilldown.series.push(obj)
            })
          }
        })
      } else {
        // console.log("isRegionalChart",isRegionalChart)
        let ou = isRegionalChart ? response.data.metaData.dimensions.ou.filter(o => o !== countryID[0]) : response.data.metaData.dimensions.ou.filter(o => o === countryID[0])
        // console.log("ou",ou)
        ou.forEach(o => {
          Object.keys(response.data.metaData.items).forEach(k => {
            if (o === k) {
              categories.push(response.data.metaData.items[k].name)
              items.push({
                [tableLocationHeader]: response.data.metaData.items[k].name,
                "_cellVariants": {[tableLocationHeader]: 'light'}
              })
            }
          })
        })

        // console.log("categories", categories)
        // console.log("catArray",catArray)
        // console.log("countryID[0]",countryID[0])
        let rows = isRegionalChart ? response.data.rows.filter(o => o[ouIndex] !== countryID[0]) : response.data.rows.filter(o => o[ouIndex] === countryID[0])
        // console.log("rows",rows)
        catArray.forEach((dx, dxI) => {
          // console.log(dx)
          let rData = {};
          // if (cypArray.length === 0) {
          rows.forEach((r, i) => {
            if (dx.dx.includes(r[dxIndex])) {
              if (Object.keys(rData).includes(r[peIndex])) {
                // if(r[ouIndex] !== countryID[0]){
                  if (Object.keys(rData[r[peIndex]]).includes(r[ouIndex])) {
                    rData[r[peIndex]][r[ouIndex]] = Number(rData[r[peIndex]][r[ouIndex]]) + Number(r[valueIndex])
                  } else {
                    rData[r[peIndex]][r[ouIndex]] = Number(r[valueIndex])
                  }
                // }
              } else {
                // if(r[ouIndex] !== countryID[0]){
                  rData[r[peIndex]] = {
                    [r[ouIndex]]: Number(r[valueIndex])
                  }
                // }
              }

            }
          })
          // }
          // console.log("rData", rData)
          // console.log("rData1", rData1)

          Object.keys(rData).forEach((d, j) => {

            // console.log(rData[d])
            // console.log("rData[d]", d)
            // console.log("rData[d]", countryID[0])
            // if (!Object.keys(rData[d]).includes(countryID[0])) {

              //console.log(rData[d])
              //console.log("rData[d]", d)

              let name = null,
                color = null,
                visible = null

              // console.log(dx)
              Object.keys(response.data.metaData.items).forEach(k => {
                if (dx.dx.includes(k)) {
                  // name = response.data.metaData.items[k].name
                  name = dx.name
                  color = dx.color
                  visible = dx.visible
                }
              })
              fields.push({key:name, sortable: true})
              obj = {
                name,
                visible,
                data: [],
                color: color ? color : '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
                // color: cData.indicator.subIndicator[j] ? cData.indicator.subIndicator[j].color : '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
              }
              let outlier = [],
                narration = []
              ou.forEach((o, i) => {

                if (Object.keys(rData[d]).includes(o)) {

                  // check for double sum of indicator

                  obj.data.push({
                    name: categories[i],
                    y: (rData[d][o] * 1).toFixed(2) * 1
                  })

                  items[i] = {
                    ...items[i],
                    [name]: (rData[d][o] * 1).toFixed(2) * 1
                  }

                } else {
                  // console.log(sourceConfig)
                  obj.data.push({
                    name: categories[i],
                    y: null
                  })
                  items[i] = {
                    ...items[i],
                    [name]: ""
                  }
                }
              })
              // console.log(obj)
              series.push(obj)
            // }
          })


        })
      }

      // console.log("series",series)
      // console.log("categories",categories)
      // console.log(items)
      // console.log(fields)
      return {
          series,
          categories,
          drilldown,
          items,
          fields
      }
    },
    // Stock - Compare chart: Across selected location and period with method as series.
    dxTotalOUDataStockNew: (response, countryID, catArray, items, fields, derivedChart, chartType, isRegionalChart, periodType, locale, tablePeriodHeader, tableLocationHeader, moment) => {
      // console.log("response",response)
      // console.log("chartType",chartType)
        let ou = response.data.metaData.dimensions.ou.filter(o => o !== countryID[0]), pe = response.data.metaData.dimensions.pe
        // console.log("Locations",ou)

        // console.log("period",pe)
        let categories = [],
            count = 0
      if(chartType === 'period') {
        pe.forEach((p, i) => {
          if (response.data.metaData.items[p]) {
            let formattedPeriod = translateDate({
              rawDate: p,
              periodType: periodType,
            });
            categories.push(formattedPeriod)
  
            items.push({
              [tablePeriodHeader]: formattedPeriod,
              "_cellVariants": {
                [tablePeriodHeader]: 'light'
              }
            })
          }
        });
      } else {
        categories.push(response.data.metaData.items[countryID[0]].name)
        items.push({
          [tableLocationHeader]: response.data.metaData.items[countryID[0]].name,
          "_cellVariants": {
            [tableLocationHeader]: 'light'
          }
        })
      }


        // console.log(items)
        // console.log("categories", categories)

        let valueIndex = 0,
            ouIndex = 0,
            peIndex = 0,
            dxIndex = 0
        response.data.headers.forEach((h, i) => {
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
        })

        let obj = {},
            series = [],
            rData1 = {}


        let rows = response.data.rows.filter(r => r[ouIndex] !== countryID[0])
        // console.log("rows without higher region",rows)
        let uniqueOU = {}
        response.data.metaData.dimensions.ou.forEach((ou, i) => {
          if(ou !== countryID[0]) {
            uniqueOU[ou] = "IA"
          }
        });
        let pData = {}
        pe.forEach((p, pI) => {
          let rCatData = {}
          catArray.forEach((item, itemI) => {
            let catData = {name: item.name, methods: []}
            item.forEach((m, mI) => {
              let methodData = {name: m.name, de: []}
              m.dx.forEach((dx, dxI) => {
                let innerDX = {deID: dx, count: {}}
                rows.forEach((r, i) => {
                  if(dx === r[dxIndex] && p === r[peIndex]){
                    innerDX['count'][r[ouIndex]] = r[valueIndex] * 1 === 0 ? 'T' : 'F'
                  }
                })
                let uniqueOU_Temp = JSON.parse(JSON.stringify(uniqueOU))
                let combinedOU = merge(uniqueOU_Temp, innerDX.count)
                innerDX.count = combinedOU
                methodData['de'].push(innerDX)
              });
              catData.push(methodData)
            });
            rCatData[item.name] = catData
          });
          pData[p] = rCatData
        });

        // console.log("pData",pData)
        // console.log("uniqueOU",uniqueOU)

        let peDECompare = {}
        Object.keys(pData).forEach((pd, pdI) => {
          let deCompare = {}
          Object.keys(pData[pd]).forEach(rData => {
            let catData = {name: rData, methods: []}
            pData[pd][rData].methods.forEach(m => {
              let methodData = {name: m.name, deCompare: {}};

              Object.keys(uniqueOU).forEach((ou, i) => {
                let finalStatus = null
                m.de.forEach((de, j) => {
                  if(j === 0) {
                      finalStatus = de.count[ou]
                  } else {
                    if( (finalStatus === "T" && de.count[ou] === "T") || (finalStatus === "T" && de.count[ou] === "IA") || (finalStatus === "IA" && de.count[ou] === "T") ) {
                      finalStatus = "T"
                    } else if(finalStatus === "IA" && de.count[ou] === "IA") {
                      finalStatus = "IA"
                    } else {
                      finalStatus = "F"
                    }
                  }
                });
                methodData.deCompare[ou] = finalStatus
              });
              // console.log("methodData", methodData)
              catData.methods.push(methodData)
            })
            deCompare[rData] = catData
          })
          peDECompare[pd] = deCompare
        });



        // console.log("peDECompare",peDECompare)
        // console.log("uniqueOU",uniqueOU)

        let peMethodCompare = {}
        Object.keys(peDECompare).forEach((pd, pdI) => {
          let methodCompare = {}
          Object.keys(peDECompare[pd]).forEach(deData => {
            let catData = {name: deData, methodCompare: {}};
            Object.keys(uniqueOU).forEach((ou, i) => {
              let finalStatus = null
              peDECompare[pd][deData].methods.forEach((de, j) => {
                if(j === 0) {
                    finalStatus = de.deCompare[ou]
                } else {
                  if( (finalStatus === "T" && de.deCompare[ou] === "T") || (finalStatus === "T" && de.deCompare[ou] === "IA") || (finalStatus === "IA" && de.deCompare[ou] === "T") ) {
                    finalStatus = "T"
                  } else if(finalStatus === "IA" && de.deCompare[ou] === "IA") {
                    finalStatus = "IA"
                  } else {
                    finalStatus = "F"
                  }
                }
              });
              catData.methodCompare[ou] = finalStatus
            });
            methodCompare[deData] = catData
          })
          peMethodCompare[pd] = methodCompare
        });



        // console.log(peMethodCompare)

        let peFinalCount = {}
        Object.keys(peMethodCompare).forEach(pm => {
          let finalCount = {}
          Object.keys(peMethodCompare[pm]).forEach(deData => {
            let methodData = peMethodCompare[pm][deData].methodCompare, numerator = Object.keys(methodData).filter(d => methodData[d] === "T").length, denominator = Object.keys(methodData).filter(d => methodData[d] === "F").length
            finalCount[deData] = {numerator, denominator: numerator+denominator}
          })
          peFinalCount[pm] = finalCount
        });


        // console.log("peFinalCount",peFinalCount)

        let name = null,
        color = null,
        visible = null
        if(chartType === 'period') {
          catArray.forEach((cat, catI) => {
            name = cat.name
            color = cat.color
            visible = cat.visible

            fields.push({
                key: name,
                sortable: true
            })

            obj = {
                name,
                visible,
                data: [],
                color: color ? color : '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
            }

            Object.keys(peFinalCount).forEach((d, j) => {
                // console.log(d)
                //console.log(j)
                //console.log(rData[d])
                // Object.keys(peFinalCount[d]).forEach(m => {
                
                let formattedPeriod = translateDate({
                  rawDate: d,
                  periodType: periodType,
                });

                  obj.data.push({
                      name: formattedPeriod,
                      y: peFinalCount[d][name].denominator * 1 !== 0 ? ((peFinalCount[d][name].numerator / peFinalCount[d][name].denominator) * 100).toFixed(2) * 1 : null,
                      pe: d
                  })
                  // console.log(items[j])
                  // console.log(name)

                  items[j] = {
                      ...items[j],
                      [name]: peFinalCount[d][name].denominator * 1 !== 0 ? ((peFinalCount[d][name].numerator / peFinalCount[d][name].denominator) * 100).toFixed(2) * 1 : i18n.t('inactive')
                  }
                // });
            })
            series.push(obj)
          });


        } else {
          Object.keys(peFinalCount).forEach((d, j) => {
              // console.log(d)
              //console.log(j)
              //console.log(rData[d])
              Object.keys(peFinalCount[d]).forEach(m => {
                let catData = catArray.find(c => c.name == m)
                name = catData.name
                color = catData.color
                visible = catData.visible
                let loc = fields.find(f => f.key === name)
                if(!loc) {
                  fields.push({
                      key: name,
                      sortable: true
                  })
                }

                obj = {
                    name,
                    visible,
                    data: [],
                    color: color ? color : '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
                }

                obj.data.push({
                    name: response.data.metaData.items[countryID[0]].name,
                    y: peFinalCount[d][name].denominator * 1 !== 0 ? ((peFinalCount[d][m].numerator / peFinalCount[d][m].denominator) * 100).toFixed(2) * 1 : null,
                    color: catData.color
                })
                // console.log(items[j])
                // console.log(name)

                items[0] = {
                    ...items[0],
                    [name]: peFinalCount[d][name].denominator * 1 !== 0 ? ((peFinalCount[d][m].numerator / peFinalCount[d][m].denominator) * 100).toFixed(2) * 1 : i18n.t('inactive')
                }
                series.push(obj)
              });
          })
        }


        // console.log(items)
        // console.log(fields)

        return {
            series,
            categories,
            items,
            fields
        }
    },
    dxTotalOUDataStockNewCalculated: (response, countryID, catArray, items, fields, derivedChart, chartType, isRegionalChart, periodType, locale, tablePeriodHeader, tableLocationHeader, moment) => {
      // console.log("response",response)
      // console.log("locale",locale)
      let valueIndex = 0,
        ouIndex = 0,
        peIndex = 0,
        dxIndex = 0
      response.data.headers.forEach((h, i) => {
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
      })

      let obj = {}, series = [], categories = [],
      drilldown = {
        drillUpButton: {
          position: {
            align: "left",
            x: 0,
            y: 0
          }
        },
        // allowPointDrilldown: false,
        series: []
      }


      if(chartType === 'period') {
        // console.log("period",pe)
        let pe = response.data.metaData.dimensions.pe
        pe.forEach(p => {
          if (response.data.metaData.items[p]) {
            let formattedPeriod = translateDate({
              rawDate: p,
              periodType: periodType,
            });
            categories.push(formattedPeriod)
            items.push({
              [tablePeriodHeader]: formattedPeriod,
              "_cellVariants": {[tablePeriodHeader]: 'light'}
            })
          }
        })

        // console.log("categories", categories)

        // console.log(catArray)
        // response.data.metaData.dimensions.dx.forEach((dx, dxI) => {
        catArray.forEach((dx, dxI) => {
          let rData = {};
          response.data.rows.forEach((r, i) => {
            if (dx.dx.includes(r[dxIndex])) {
              if (Object.keys(rData).includes(r[ouIndex])) {
                // rData[r[ouIndex]][r[peIndex]] = Number(r[valueIndex])
                if (Object.keys(rData[r[ouIndex]]).includes(r[peIndex])) {
                  rData[r[ouIndex]][r[peIndex]] = Number(rData[r[ouIndex]][r[peIndex]]) + Number(r[valueIndex])
                } else {
                  rData[r[ouIndex]][r[peIndex]] = Number(r[valueIndex])
                }
              } else {
                rData[r[ouIndex]] = {
                  [r[peIndex]]: Number(r[valueIndex])
                }
              }

            }
          })

          // console.log("rData", rData)
          let bFlag = false
          Object.keys(rData).forEach((d, j) => {

            //console.log(rData[d])
            //console.log("rData[d]", d)
            // console.log("rData[d]", countryID[0])
            if (d === countryID[0]) {

              // console.log(rData[d])
              // console.log("rData[d]", d)

              let name = null,
                color = null,
                visible = null

              //console.log(dx)
              Object.keys(response.data.metaData.items).forEach(k => {
                if (dx.dx.includes(k)) {
                  // name = response.data.metaData.items[k].name
                  name = dx.name
                  color = dx.color
                  visible = dx.visible
                }
              })
              fields.push({key:name, sortable: true})
              obj = {
                name,
                visible,
                data: [],
                color: color ? color : '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
                // color: cData.indicator.subIndicator[j] ? cData.indicator.subIndicator[j].color : '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
              }
              let outlier = [],
                narration = []
              pe.forEach((p, i) => {
                // console.log("p",p)
                let prevPeriod = subtractNDate({
                  rawDate: p,
                  periodType: periodType,
                });

                // console.log("periodType",periodType)
                // console.log("prevPeriod",prevPeriod)
                // console.log("prevPeriod",categories[i])
                if (Object.keys(rData[d]).includes(p)) {
                  // console.log("rData[d]",rData[d])
                  // check for double sum of indicator
                  obj.data.push({
                    name: categories[i],
                    pe: p,
                    pePrev: i === 0 ? 0 : prevPeriod,
                    y: (rData[d][p] * 1).toFixed(2) * 1,
                    drilldown: i === 0 ? `${name} ( ${categories[i]} )` : `${name} ( ${categories[i]} - ${categories[i-1]} )`
                  })
                  // console.log("obj",obj)
                  items[i] = {
                    ...items[i],
                    [name]: (rData[d][p] * 1).toFixed(2) * 1
                  }

                } else {

                  obj.data.push({
                    name: categories[i],
                    pe: p,
                    pePrev: i === 0 ? 0 : prevPeriod,
                    y: null,
                    drilldown: null
                  })
                  items[i] = {
                    ...items[i],
                    [name]: ""
                  }
                }
              })
              // console.log("obj",obj)
              series.push(obj)
            }
            if (j === Object.keys(rData).length - 1) {
              bFlag = true
            }
          })
          if (bFlag) {
            // console.log("series", series)
            series[dxI].data.forEach((rt, k) => {
              // console.log(rt)
              obj = {
                id: rt.drilldown,
                type: 'column',
                name: rt.drilldown,
                data: []
              }
              // let regions = []
              Object.keys(rData).forEach((d, j) => {
                let name = null
                Object.keys(response.data.metaData.items).forEach(k => {
                  if (d === k) {
                    name = response.data.metaData.items[k].name
                  }
                })
                if (d !== countryID[0]) {
                  if (Object.keys(rData[d]).includes(rt.pe)) {
                    let y = null,
                      color = null
                    if (k === 0) {
                      y = rData[d][rt.pe] * 1 ? (((rData[d][rt.pe] * 1).toFixed(2) * 1) - 0).toFixed(2) * 1 : null
                      color = y > 0 ? '#5BD282' : '#FE8081'
                      obj.data.push({
                        name,
                        y,
                        color,
                        "locationID": d
                      })
                    } else {
                      if(rData[d][rt.pePrev] * 1){
                        if(rData[d][rt.pe] * 1) {
                          y = (((rData[d][rt.pe] * 1).toFixed(2) * 1) - ((rData[d][rt.pePrev] * 1).toFixed(2) * 1)).toFixed(2) * 1
                        } else {
                          y = (0 - ((rData[d][rt.pePrev] * 1).toFixed(2) * 1)).toFixed(2) * 1
                        }
                      } else if(rData[d][rt.pe] * 1) {
                        y = (((rData[d][rt.pe] * 1).toFixed(2) * 1) - 0 ).toFixed(2) * 1
                      } else {
                        y = null
                      }
                      color = y > 0 ? '#5BD282' : '#FE8081'
                      obj.data.push({
                        name,
                        y,
                        color,
                        "locationID": d
                      })
                    }
                  }
                }
              })
              drilldown.series.push(obj)
            })
          }
        })
      } else {
        // console.log("isRegionalChart",isRegionalChart)
        let ou = isRegionalChart ? response.data.metaData.dimensions.ou.filter(o => o !== countryID[0]) : response.data.metaData.dimensions.ou.filter(o => o === countryID[0])
        // console.log("ou",ou)
        if(ou.length) {
          ou.forEach(o => {
            Object.keys(response.data.metaData.items).forEach(k => {
              if (o === k) {
                categories.push(response.data.metaData.items[k].name)
                items.push({
                  [tableLocationHeader]: response.data.metaData.items[k].name,
                  "_cellVariants": {[tableLocationHeader]: 'light'}
                })
              }
            })
          })

          // console.log("categories", categories)
          // console.log("catArray",catArray)
          // console.log("countryID[0]",countryID[0])
          let rows = isRegionalChart ? response.data.rows.filter(o => o[ouIndex] !== countryID[0]) : response.data.rows.filter(o => o[ouIndex] === countryID[0])
          // console.log("rows",rows)
          catArray.forEach((dx, dxI) => {
            // console.log(dx)
            let rData = {};
            // if (cypArray.length === 0) {
            rows.forEach((r, i) => {
              if (dx.dx.includes(r[dxIndex])) {
                if (Object.keys(rData).includes(r[peIndex])) {
                  // if(r[ouIndex] !== countryID[0]){
                    if (Object.keys(rData[r[peIndex]]).includes(r[ouIndex])) {
                      rData[r[peIndex]][r[ouIndex]] = Number(rData[r[peIndex]][r[ouIndex]]) + Number(r[valueIndex])
                    } else {
                      rData[r[peIndex]][r[ouIndex]] = Number(r[valueIndex])
                    }
                  // }
                } else {
                  // if(r[ouIndex] !== countryID[0]){
                    rData[r[peIndex]] = {
                      [r[ouIndex]]: Number(r[valueIndex])
                    }
                  // }
                }

              }
            })
            // }
            // console.log("rData", rData)
            // console.log("rData1", rData1)

            Object.keys(rData).forEach((d, j) => {

              // console.log(rData[d])
              // console.log("rData[d]", d)
              // console.log("rData[d]", countryID[0])
              // if (!Object.keys(rData[d]).includes(countryID[0])) {

                //console.log(rData[d])
                //console.log("rData[d]", d)

                let name = null,
                  color = null,
                  visible = null

                // console.log(dx)
                Object.keys(response.data.metaData.items).forEach(k => {
                  if (dx.dx.includes(k)) {
                    // name = response.data.metaData.items[k].name
                    name = dx.name
                    color = dx.color
                    visible = dx.visible
                  }
                })
                fields.push({key:name, sortable: true})
                obj = {
                  name,
                  visible,
                  data: [],
                  color: color ? color : '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
                  // color: cData.indicator.subIndicator[j] ? cData.indicator.subIndicator[j].color : '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
                }
                let outlier = [],
                  narration = []
                ou.forEach((o, i) => {

                  if (Object.keys(rData[d]).includes(o)) {

                    // check for double sum of indicator

                    obj.data.push({
                      name: categories[i],
                      y: (rData[d][o] * 1).toFixed(2) * 1
                    })

                    items[i] = {
                      ...items[i],
                      [name]: (rData[d][o] * 1).toFixed(2) * 1
                    }

                  } else {
                    // console.log(sourceConfig)
                    obj.data.push({
                      name: categories[i],
                      y: null
                    })
                    items[i] = {
                      ...items[i],
                      [name]: ""
                    }
                  }
                })
                // console.log(obj)
                series.push(obj)
              // }
            })
          })
        }
      }

      // console.log(series)
      // console.log(categories)
      // console.log(items)
      // console.log(fields)
      return {
          series,
          categories,
          drilldown,
          items,
          fields
      }
    },
    // Stock - Trends chart: Across no. of months, with methods as series. Summation of all facility locations per method for respective period.
    dxTotalOUScatterData: (response, countryID, catArray, items, fields, chartType, periodValue, locationHeader, color) => {

      // console.log("Scatter response", response)
      // console.log("Scatter catArray", catArray)
      let ou = response.data.metaData.dimensions.ou;
      let valueIndex = 0,
        ouIndex = 0,
        peIndex = 0,
        dxIndex = 0
      response.data.headers.forEach((h, i) => {
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
      })
      let sData = {}, series = [], exceptionTable = []
      catArray.forEach((cat, i) => {
        let rData = {};
        fields.push({key: cat.name})
        response.data.rows.forEach((r, i) => {
          if(r[ouIndex] !== countryID[0] && cat.dx.includes(r[dxIndex]) ) {
            if (Object.keys(rData).includes(r[ouIndex])) {
              if (Object.keys(rData[r[ouIndex]]).includes(r[peIndex])) {
                rData[r[ouIndex]][r[peIndex]] = Number(rData[r[ouIndex]][r[peIndex]]) + Number(r[valueIndex])
              } else {
                rData[r[ouIndex]][r[peIndex]] = Number(r[valueIndex])
              }
            } else {
              rData[r[ouIndex]] = {
                [r[peIndex]]: Number(r[valueIndex])
              }
            }
          }
        })
        sData[cat.name] = rData
        // console.log("rData",rData)
        // console.log("sData",sData)

        if (Object.keys(sData).length === catArray.length) {
          // console.log("sData",sData)
          let method1 = catArray[0].name
          let method2 = catArray[1].name

          // console.log("method1",method1)
          // console.log("method2",method2)
          let obj = {
            name: `${method1} vs ${method2}`,
            data: [],
            color: color
          }

          let xException = Object.keys(sData[method1]).filter(val => !Object.keys(sData[method2]).includes(val));
          // console.log("xException",xException)
          let yException = Object.keys(sData[method2]).filter(val => !Object.keys(sData[method1]).includes(val));
          // console.log("yException",yException)

          let sameRegions = Object.keys(sData[method1]).filter(val => Object.keys(sData[method2]).includes(val))
          // console.log("sameRegions",sameRegions)
          let noDataRegions = ou.filter(val => !sameRegions.includes(val))
          // console.log("noDataRegions",noDataRegions)

          noDataRegions.forEach(val => {
            if(val !== countryID[0]) {
              let name = null
              Object.keys(response.data.metaData.items).forEach(k => {
                if (val === k) {
                  name = response.data.metaData.items[k].name
                }
              })
              if(xException.includes(val)) {
                Object.keys(sData[method1]).forEach(x => {
                  if(x === val) {
                    exceptionTable.push({
                      [i18n.t('location')]: name,
                      [method2]: "",
                      [method1]: sData[method1][x][periodValue] * 1
                    })
                  }
                })
              } else if (yException.includes(val)) {
                Object.keys(sData[method2]).forEach(x => {
                  if(x === val) {
                    exceptionTable.push({
                      [i18n.t('location')]: name,
                      [method2]: sData[method2][x][periodValue] * 1,
                      [method1]: ""
                    })
                  }
                })
              } else {
                exceptionTable.push({
                  [i18n.t('location')]: name,
                  [method2]: "",
                  [method1]: ""
                })
              }
            }
          })
          // console.log("exceptionTable", exceptionTable)

          Object.keys(sData[method1]).forEach((x,i) => {
            Object.keys(sData[method2]).forEach(y => {
              if (x === y) {
                let name = response.data.metaData.items[x].name
                // console.log(sData[method1][x][periodValue])
                // console.log(sData[method2][y][periodValue])
                obj.data.push({
                  name,
                  x: sData[method1][x][periodValue] * 1,
                  y: sData[method2][y][periodValue] * 1
                })
                items[i] = {
                  ...items[i],
                  [locationHeader]: name,
                  [method1]: sData[method1][x][periodValue] * 1,
                  [method2]: sData[method2][y][periodValue] * 1,
                }
              }
            })
          })
          series.push(obj)
        }
      });
      // console.log("series",series)

      return {
        series,
        items,
        fields,
        exceptionTable
      }
    }
}
