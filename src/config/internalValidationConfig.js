const dqrConfig = {
  "dqrModule": {
    "internal_validations": {
      "Background_Data": {
        "data_source": "Visits",
        "standardDeviation": "2"
      },
      "Commodities_Client": {
        "categoryInfo": {
          "Aggregate": "",
          "Method": ""
        },
        "derivedCharts": [{
          "chartOptions": {
            "cid": "",
            "disableChart": false,
            "chartName": "Aggregate",
            "chartInfo": "",
            "title": {
              "text": "",
              "visible": false
            },
            "subTitle": {
              "text": "",
              "visible": false
            },
            "xAxis": {
              "text": "",
              "visible": false
            },
            "yAxis": {
              "text": "",
              "visible": true
            },
            "color": "#00FF00",
          }
        },{
          "chartOptions": {
            "cid": "",
            "disableChart": false,
            "chartName": "Total Couple Years of Protection by Region",
            "chartInfo": "",
            "title": {
              "text": "",
              "visible": false
            },
            "subTitle": {
              "text": "",
              "visible": false
            },
            "xAxis": {
              "text": "",
              "visible": false
            },
            "yAxis": {
              "text": "",
              "visible": true
            },
            "color": "#00FF00",
          }
        },{
          "chartOptions": {
            "cid": "",
            "disableChart": false,
            "chartName": "Method Wise",
            "chartInfo": "",
            "title": {
              "text": "",
              "visible": false
            },
            "subTitle": {
              "text": "",
              "visible": false
            },
            "xAxis": {
              "text": "",
              "visible": false
            },
            "yAxis": {
              "text": "",
              "visible": true
            },
            "color": "#00FF00",
          }
        },{
          "chartOptions": {
            "cid": "",
            "disableChart": false,
            "chartName": "Method Wise Regional",
            "chartInfo": "",
            "title": {
              "text": "",
              "visible": false
            },
            "subTitle": {
              "text": "",
              "visible": false
            },
            "xAxis": {
              "text": "",
              "visible": false
            },
            "yAxis": {
              "text": "",
              "visible": true
            },
            "color": "#00FF00",
          }
        }],
        "chartData": [{
            "indicator": {
              "name": "Sterilization",
              "source": "Commodities distributed to client",
              "color": "#c87776",
              "visible": true,
              "subIndicator": [{
                  "de": [],
                  "name": [
                    "Tubal Ligation (F)"
                  ],
                  "selectedDE": [],
                  "color": "#c87776",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Sterilization",
                  "cyp": "10",
                  "static_name": [
                    "Tubal Ligation (F)"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Vasectomy (M)"
                  ],
                  "selectedDE": [],
                  "color": "#c87776",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Sterilization",
                  "cyp": "10",
                  "static_name": [
                    "Vasectomy (M)"
                  ]
                }
              ],
              "static_name": "Sterilization",
              "methodType": "Long Term"
            }
          },
          {
            "indicator": {
              "name": "IUD",
              "source": "Commodities distributed to client",
              "visible": false,
              "subIndicator": [{
                  "de": [],
                  "name": [
                    "Copper- T 380-A IUD"
                  ],
                  "selectedDE": [],
                  "color": "#47c49a",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "IUD",
                  "cyp": "4.6",
                  "static_name": [
                    "Copper- T 380-A IUD"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "LNG-IUS"
                  ],
                  "selectedDE": [],
                  "color": "#47c49a",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "IUD",
                  "cyp": "3.3",
                  "static_name": [
                    "LNG-IUS"
                  ]
                }
              ],
              "color": "#47c49a",
              "static_name": "IUD",
              "methodType": "Long Term"
            }
          },
          {
            "indicator": {
              "name": "Implant",
              "source": "Commodities distributed to client",
              "visible": false,
              "subIndicator": [{
                  "de": [],
                  "name": [
                    "Implanon"
                  ],
                  "selectedDE": [],
                  "color": "#8DC645",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Implant",
                  "cyp": "2.5",
                  "static_name": [
                    "Implanon"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Jadelle"
                  ],
                  "selectedDE": [],
                  "color": "#8DC645",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Implant",
                  "cyp": "3.8",
                  "static_name": [
                    "Jadelle"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Sino-Implant"
                  ],
                  "selectedDE": [],
                  "color": "#8DC645",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Implant",
                  "cyp": "3.2",
                  "static_name": [
                    "Sino-Implant"
                  ]
                }
              ],
              "static_name": "Implant",
              "methodType": "Long Term"
            }
          },
          {
            "indicator": {
              "name": "Injectable",
              "source": "Commodities distributed to client",
              "visible": false,
              "subIndicator": [{
                  "de": [],
                  "name": [
                    "Depo Provera (DMPA)"
                  ],
                  "selectedDE": [],
                  "color": "#5287cd",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Injectable",
                  "cyp": "0.25",
                  "static_name": [
                    "Depo Provera (DMPA)"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Noristerat (NET-En)"
                  ],
                  "selectedDE": [],
                  "color": "#5287cd",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Injectable",
                  "cyp": "0.1666666667",
                  "static_name": [
                    "Noristerat (NET-En)"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Lunelle"
                  ],
                  "selectedDE": [],
                  "color": "#5287cd",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Injectable",
                  "cyp": "0.07692307692",
                  "static_name": [
                    "Lunelle"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Sayana Press"
                  ],
                  "selectedDE": [],
                  "color": "#5287cd",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Injectable",
                  "cyp": "0.25",
                  "static_name": [
                    "Sayana Press"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Other Injectable"
                  ],
                  "selectedDE": [],
                  "color": "#5287cd",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Injectable",
                  "cyp": "0.25",
                  "static_name": [
                    "Other Injectable"
                  ]
                }
              ],
              "static_name": "Injectable",
              "methodType": "Short Term"
            }
          },
          {
            "indicator": {
              "name": "Pill",
              "source": "Commodities distributed to client",
              "visible": false,
              "subIndicator": [{
                  "de": [],
                  "name": [
                    "Combined Oral"
                  ],
                  "selectedDE": [],
                  "color": "#70aedf",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Pill",
                  "cyp": "0.06666666667",
                  "static_name": [
                    "Combined Oral"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Progestin only"
                  ],
                  "selectedDE": [],
                  "color": "#70aedf",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Pill",
                  "cyp": "0.06666666667",
                  "static_name": [
                    "Progestin only"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Other OC Pill"
                  ],
                  "selectedDE": [],
                  "color": "#70aedf",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Pill",
                  "cyp": "0.06666666667",
                  "static_name": [
                    "Other OC Pill"
                  ]
                }
              ],
              "static_name": "Pill",
              "methodType": "Short Term"
            }
          },
          {
            "indicator": {
              "name": "Condom",
              "source": "Commodities distributed to client",
              "visible": false,
              "subIndicator": [{
                  "de": [],
                  "name": [
                    "Male Condom"
                  ],
                  "selectedDE": [],
                  "color": "#fcb241",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Condom",
                  "cyp": "0.008333333333",
                  "static_name": [
                    "Male Condom"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Female Condom"
                  ],
                  "selectedDE": [],
                  "color": "#fcb241",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Condom",
                  "cyp": "0.008333333333",
                  "static_name": [
                    "Female Condom"
                  ]
                }
              ],
              "static_name": "Condom",
              "methodType": "Short Term"
            }
          },
          {
            "indicator": {
              "name": "Other Modern Methods",
              "source": "Commodities distributed to client",
              "visible": false,
              "subIndicator": [{
                  "de": [],
                  "name": [
                    "LAM"
                  ],
                  "selectedDE": [],
                  "color": "#78a095",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Other Modern Methods",
                  "cyp": "0.25",
                  "static_name": [
                    "LAM"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "SDM (Standard Days)"
                  ],
                  "selectedDE": [],
                  "color": "#78a095",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Other Modern Methods",
                  "cyp": "1.5",
                  "static_name": [
                    "SDM (Standard Days)"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Vaginal barrier"
                  ],
                  "selectedDE": [],
                  "color": "#78a095",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Other Modern Methods",
                  "cyp": "1",
                  "static_name": [
                    "Vaginal barrier"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Spermicides"
                  ],
                  "selectedDE": [],
                  "color": "#78a095",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Other Modern Methods",
                  "cyp": "0.008333333333",
                  "static_name": [
                    "Spermicides"
                  ]
                }
              ],
              "static_name": "Other Modern Methods",
              "methodType": "Short Term"
            }
          },
          {
            "indicator": {
              "name": "Emergency contraception",
              "source": "Commodities distributed to client",
              "visible": false,
              "subIndicator": [{
                "de": [],
                "name": [
                  "EC"
                ],
                "selectedDE": [],
                "color": "#dd8ab8",
                "type": "data_element",
                "benchmarkingLogic": false,
                "key": "Emergency contraception",
                "cyp": "0.05",
                "static_name": [
                  "EC"
                ]
              }],
              "static_name": "Emergency contraception",
              "methodType": "Short Term"
            }
          }
        ]
      },
      "Commodities_Facilities": {
        "categoryInfo": {
          "Aggregate": "",
          "Method": ""
        },
        "derivedCharts": [{
          "chartOptions": {
            "cid": "",
            "disableChart": false,
            "chartName": "Aggregate",
            "chartInfo": "",
            "title": {
              "text": "",
              "visible": false
            },
            "subTitle": {
              "text": "",
              "visible": false
            },
            "xAxis": {
              "text": "",
              "visible": false
            },
            "yAxis": {
              "text": "",
              "visible": true
            },
            "color": "#00FF00",
          }
        },{
          "chartOptions": {
            "cid": "",
            "disableChart": false,
            "chartName": "Total Couple Years of Protection by Region",
            "chartInfo": "",
            "title": {
              "text": "",
              "visible": false
            },
            "subTitle": {
              "text": "",
              "visible": false
            },
            "xAxis": {
              "text": "",
              "visible": false
            },
            "yAxis": {
              "text": "",
              "visible": true
            },
            "color": "#00FF00",
          }
        },{
          "chartOptions": {
            "cid": "",
            "disableChart": false,
            "chartName": "Method Wise",
            "chartInfo": "",
            "title": {
              "text": "",
              "visible": false
            },
            "subTitle": {
              "text": "",
              "visible": false
            },
            "xAxis": {
              "text": "",
              "visible": false
            },
            "yAxis": {
              "text": "",
              "visible": true
            },
            "color": "#00FF00",
          }
        },{
          "chartOptions": {
            "cid": "",
            "disableChart": false,
            "chartName": "Method Wise Regional",
            "chartInfo": "",
            "title": {
              "text": "",
              "visible": false
            },
            "subTitle": {
              "text": "",
              "visible": false
            },
            "xAxis": {
              "text": "",
              "visible": false
            },
            "yAxis": {
              "text": "",
              "visible": true
            },
            "color": "#00FF00",
          }
        }],
        "chartData": [{
            "indicator": {
              "name": "Sterilization",
              "source": "Commodities distributed to facilities",
              "color": "#c87776",
              "visible": true,
              "subIndicator": [{
                  "de": [],
                  "name": [
                    "Tubal Ligation (F)"
                  ],
                  "selectedDE": [],
                  "color": "#c87776",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Sterilization",
                  "cyp": "10",
                  "static_name": [
                    "Tubal Ligation (F)"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Vasectomy (M)"
                  ],
                  "selectedDE": [],
                  "color": "#c87776",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Sterilization",
                  "cyp": "10",
                  "static_name": [
                    "Vasectomy (M)"
                  ]
                }
              ],
              "static_name": "Sterilization",
              "methodType": "Long Term"
            }
          },
          {
            "indicator": {
              "name": "IUD",
              "source": "Commodities distributed to facilities",
              "visible": false,
              "subIndicator": [{
                  "de": [],
                  "name": [
                    "Copper- T 380-A IUD"
                  ],
                  "selectedDE": [],
                  "color": "#47c49a",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "IUD",
                  "cyp": "4.6",
                  "static_name": [
                    "Copper- T 380-A IUD"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "LNG-IUS"
                  ],
                  "selectedDE": [],
                  "color": "#47c49a",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "IUD",
                  "cyp": "3.3",
                  "static_name": [
                    "LNG-IUS"
                  ]
                }
              ],
              "static_name": "IUD",
              "methodType": "Long Term"
            }
          },
          {
            "indicator": {
              "name": "Implant",
              "source": "Commodities distributed to facilities",
              "visible": false,
              "subIndicator": [{
                  "de": [],
                  "name": [
                    "Implanon"
                  ],
                  "selectedDE": [],
                  "color": "#8DC645",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Implant",
                  "cyp": "2.5",
                  "static_name": [
                    "Implanon"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Jadelle"
                  ],
                  "selectedDE": [],
                  "color": "#8DC645",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Implant",
                  "cyp": "3.8",
                  "static_name": [
                    "Jadelle"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Sino-Implant"
                  ],
                  "selectedDE": [],
                  "color": "#8DC645",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Implant",
                  "cyp": "3.2",
                  "static_name": [
                    "Sino-Implant"
                  ]
                }
              ],
              "static_name": "Implant",
              "methodType": "Long Term"
            }
          },
          {
            "indicator": {
              "name": "Injectable",
              "source": "Commodities distributed to facilities",
              "visible": false,
              "subIndicator": [{
                  "de": [],
                  "name": [
                    "Depo Provera (DMPA)"
                  ],
                  "selectedDE": [],
                  "color": "#5287cd",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Injectable",
                  "cyp": "0.25",
                  "static_name": [
                    "Depo Provera (DMPA)"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Noristerat (NET-En)"
                  ],
                  "selectedDE": [],
                  "color": "#5287cd",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Injectable",
                  "cyp": "0.1666666667",
                  "static_name": [
                    "Noristerat (NET-En)"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Lunelle"
                  ],
                  "selectedDE": [],
                  "color": "#5287cd",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Injectable",
                  "cyp": "0.07692307692",
                  "static_name": [
                    "Lunelle"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Sayana Press"
                  ],
                  "selectedDE": [],
                  "color": "#5287cd",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Injectable",
                  "cyp": "0.25",
                  "static_name": [
                    "Sayana Press"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Other Injectable"
                  ],
                  "selectedDE": [],
                  "color": "#5287cd",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Injectable",
                  "cyp": "0.25",
                  "static_name": [
                    "Other Injectable"
                  ]
                }
              ],
              "static_name": "Injectable",
              "methodType": "Short Term"
            }
          },
          {
            "indicator": {
              "name": "Pill",
              "source": "Commodities distributed to facilities",
              "visible": false,
              "subIndicator": [{
                  "de": [],
                  "name": [
                    "Combined Oral"
                  ],
                  "selectedDE": [],
                  "color": "#70aedf",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Pill",
                  "cyp": "0.06666666667",
                  "static_name": [
                    "Combined Oral"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Progestin only"
                  ],
                  "selectedDE": [],
                  "color": "#70aedf",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Pill",
                  "cyp": "0.06666666667",
                  "static_name": [
                    "Progestin only"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Other OC Pill"
                  ],
                  "selectedDE": [],
                  "color": "#70aedf",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Pill",
                  "cyp": "0.06666666667",
                  "static_name": [
                    "Other OC Pill"
                  ]
                }
              ],
              "static_name": "Pill",
              "methodType": "Short Term"
            }
          },
          {
            "indicator": {
              "name": "Condom",
              "source": "Commodities distributed to facilities",
              "visible": false,
              "subIndicator": [{
                  "de": [],
                  "name": [
                    "Male Condom"
                  ],
                  "selectedDE": [],
                  "color": "#fcb241",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Condom",
                  "cyp": "0.008333333333",
                  "static_name": [
                    "Male Condom"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Female Condom"
                  ],
                  "selectedDE": [],
                  "color": "#fcb241",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Condom",
                  "cyp": "0.008333333333",
                  "static_name": [
                    "Female Condom"
                  ]
                }
              ],
              "static_name": "Condom",
              "methodType": "Short Term"
            }
          },
          {
            "indicator": {
              "name": "Other Modern Methods",
              "source": "Commodities distributed to facilities",
              "visible": false,
              "subIndicator": [{
                  "de": [],
                  "name": [
                    "LAM"
                  ],
                  "selectedDE": [],
                  "color": "#78a095",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Other Modern Methods",
                  "cyp": "0.25",
                  "static_name": [
                    "LAM"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "SDM (Standard Days)"
                  ],
                  "selectedDE": [],
                  "color": "#78a095",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Other Modern Methods",
                  "cyp": "1.5",
                  "static_name": [
                    "SDM (Standard Days)"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Vaginal barrier"
                  ],
                  "selectedDE": [],
                  "color": "#78a095",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Other Modern Methods",
                  "cyp": "1",
                  "static_name": [
                    "Vaginal barrier"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Spermicides"
                  ],
                  "selectedDE": [],
                  "color": "#78a095",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Other Modern Methods",
                  "cyp": "0.008333333333",
                  "static_name": [
                    "Spermicides"
                  ]
                }
              ],
              "static_name": "Other Modern Methods",
              "methodType": "Short Term"
            }
          },
          {
            "indicator": {
              "name": "Emergency contraception",
              "source": "Commodities distributed to facilities",
              "visible": false,
              "subIndicator": [{
                "de": [],
                "name": [
                  "EC"
                ],
                "selectedDE": [],
                "color": "#dd8ab8",
                "type": "data_element",
                "benchmarkingLogic": false,
                "key": "Emergency contraception",
                "cyp": "0.05",
                "static_name": [
                  "EC"
                ]
              }],
              "static_name": "Emergency contraception",
              "methodType": "Short Term"
            }
          }
        ]
      },
      "Visits": {
        "categoryInfo": {
          "Aggregate": "",
          "Method": ""
        },
        "derivedCharts": [{
          "chartOptions": {
            "cid": "",
            "disableChart": false,
            "chartName": "Aggregate",
            "chartInfo": "",
            "title": {
              "text": "",
              "visible": false
            },
            "subTitle": {
              "text": "",
              "visible": false
            },
            "xAxis": {
              "text": "",
              "visible": false
            },
            "yAxis": {
              "text": "",
              "visible": true
            },
            "color": "#00FF00",
          }
        },{
          "chartOptions": {
            "cid": "",
            "disableChart": false,
            "chartName": "Total Couple Years of Protection by Region",
            "chartInfo": "",
            "title": {
              "text": "",
              "visible": false
            },
            "subTitle": {
              "text": "",
              "visible": false
            },
            "xAxis": {
              "text": "",
              "visible": false
            },
            "yAxis": {
              "text": "",
              "visible": true
            },
            "color": "#00FF00",
          }
        },{
          "chartOptions": {
            "cid": "",
            "disableChart": false,
            "chartName": "Method Wise",
            "chartInfo": "",
            "title": {
              "text": "",
              "visible": false
            },
            "subTitle": {
              "text": "",
              "visible": false
            },
            "xAxis": {
              "text": "",
              "visible": false
            },
            "yAxis": {
              "text": "",
              "visible": true
            },
            "color": "#00FF00",
          }
        },{
          "chartOptions": {
            "cid": "",
            "disableChart": false,
            "chartName": "Method Wise Regional",
            "chartInfo": "",
            "title": {
              "text": "",
              "visible": false
            },
            "subTitle": {
              "text": "",
              "visible": false
            },
            "xAxis": {
              "text": "",
              "visible": false
            },
            "yAxis": {
              "text": "",
              "visible": true
            },
            "color": "#00FF00",
          }
        }],
        "chartData": [{
            "indicator": {
              "name": "Sterilization",
              "source": "FP Visits",
              "color": "#c87776",
              "visible": true,
              "subIndicator": [{
                  "de": [],
                  "name": [
                    "Tubal Ligation (F)"
                  ],
                  "selectedDE": [],
                  "color": "#c87776",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Sterilization",
                  "cyp": "10",
                  "static_name": [
                    "Tubal Ligation (F)"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Vasectomy (M)"
                  ],
                  "selectedDE": [],
                  "color": "#c87776",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Sterilization",
                  "cyp": "10",
                  "static_name": [
                    "Vasectomy (M)"
                  ]
                }
              ],
              "static_name": "Sterilization",
              "methodType": "Long Term"
            }
          },
          {
            "indicator": {
              "name": "IUD",
              "source": "FP Visits",
              "visible": false,
              "subIndicator": [{
                  "de": [],
                  "name": [
                    "Copper- T 380-A IUD"
                  ],
                  "selectedDE": [],
                  "color": "#47c49a",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "IUD",
                  "cyp": "4.6",
                  "static_name": [
                    "Copper- T 380-A IUD"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "LNG-IUS"
                  ],
                  "selectedDE": [],
                  "color": "#47c49a",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "IUD",
                  "cyp": "3.3",
                  "static_name": [
                    "LNG-IUS"
                  ]
                }
              ],
              "static_name": "IUD",
              "methodType": "Long Term"
            }
          },
          {
            "indicator": {
              "name": "Implant",
              "source": "FP Visits",
              "visible": false,
              "subIndicator": [{
                  "de": [],
                  "name": [
                    "Implanon"
                  ],
                  "selectedDE": [],
                  "color": "#8DC645",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Implant",
                  "cyp": "2.5",
                  "static_name": [
                    "Implanon"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Jadelle"
                  ],
                  "selectedDE": [],
                  "color": "#8DC645",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Implant",
                  "cyp": "3.8",
                  "static_name": [
                    "Jadelle"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Sino-Implant"
                  ],
                  "selectedDE": [],
                  "color": "#8DC645",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Implant",
                  "cyp": "3.2",
                  "static_name": [
                    "Sino-Implant"
                  ]
                }
              ],
              "static_name": "Implant",
              "methodType": "Long Term"
            }
          },
          {
            "indicator": {
              "name": "Injectable",
              "source": "FP Visits",
              "visible": false,
              "subIndicator": [{
                  "de": [],
                  "name": [
                    "Depo Provera (DMPA)"
                  ],
                  "selectedDE": [],
                  "color": "#5287cd",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Injectable",
                  "cyp": "0.25",
                  "static_name": [
                    "Depo Provera (DMPA)"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Noristerat (NET-En)"
                  ],
                  "selectedDE": [],
                  "color": "#5287cd",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Injectable",
                  "cyp": "0.1666666667",
                  "static_name": [
                    "Noristerat (NET-En)"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Lunelle"
                  ],
                  "selectedDE": [],
                  "color": "#5287cd",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Injectable",
                  "cyp": "0.07692307692",
                  "static_name": [
                    "Lunelle"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Sayana Press"
                  ],
                  "selectedDE": [],
                  "color": "#5287cd",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Injectable",
                  "cyp": "0.25",
                  "static_name": [
                    "Sayana Press"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Other Injectable"
                  ],
                  "selectedDE": [],
                  "color": "#5287cd",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Injectable",
                  "cyp": "0.25",
                  "static_name": [
                    "Other Injectable"
                  ]
                }
              ],
              "static_name": "Injectable",
              "methodType": "Short Term"
            }
          },
          {
            "indicator": {
              "name": "Pill",
              "source": "FP Visits",
              "visible": false,
              "subIndicator": [{
                  "de": [],
                  "name": [
                    "Combined Oral"
                  ],
                  "selectedDE": [],
                  "color": "#70aedf",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Pill",
                  "cyp": "0.25",
                  "static_name": [
                    "Combined Oral"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Progestin only"
                  ],
                  "selectedDE": [],
                  "color": "#70aedf",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Pill",
                  "cyp": "0.066666667",
                  "static_name": [
                    "Progestin only"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Other OC Pill"
                  ],
                  "selectedDE": [],
                  "color": "#70aedf",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Pill",
                  "cyp": "0.25",
                  "static_name": [
                    "Other OC Pill"
                  ]
                }
              ],
              "static_name": "Pill",
              "methodType": "Short Term"
            }
          },
          {
            "indicator": {
              "name": "Condom",
              "source": "FP Visits",
              "visible": false,
              "subIndicator": [{
                  "de": [],
                  "name": [
                    "Male Condom"
                  ],
                  "selectedDE": [],
                  "color": "#fcb241",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Condom",
                  "cyp": "0.008333333",
                  "static_name": [
                    "Male Condom"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Female Condom"
                  ],
                  "selectedDE": [],
                  "color": "#fcb241",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Condom",
                  "cyp": "0.25",
                  "static_name": [
                    "Female Condom"
                  ]
                }
              ],
              "static_name": "Condom",
              "methodType": "Short Term"
            }
          },
          {
            "indicator": {
              "name": "Other Modern Methods",
              "source": "FP Visits",
              "visible": false,
              "subIndicator": [{
                  "de": [],
                  "name": [
                    "LAM"
                  ],
                  "selectedDE": [],
                  "color": "#78a095",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Other Modern Methods",
                  "cyp": "1",
                  "static_name": [
                    "LAM"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "SDM (Standard Days)"
                  ],
                  "selectedDE": [],
                  "color": "#78a095",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Other Modern Methods",
                  "cyp": "1",
                  "static_name": [
                    "SDM (Standard Days)"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Vaginal barrier"
                  ],
                  "selectedDE": [],
                  "color": "#78a095",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Other Modern Methods",
                  "cyp": "1",
                  "static_name": [
                    "Vaginal barrier"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Spermicides"
                  ],
                  "selectedDE": [],
                  "color": "#78a095",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Other Modern Methods",
                  "cyp": "0.25",
                  "static_name": [
                    "Spermicides"
                  ]
                }
              ],
              "static_name": "Other Modern Methods",
              "methodType": "Short Term"
            }
          },
          {
            "indicator": {
              "name": "Emergency contraception",
              "source": "FP Visits",
              "visible": false,
              "subIndicator": [{
                "de": [],
                "name": [
                  "EC"
                ],
                "selectedDE": [],
                "color": "#dd8ab8",
                "type": "data_element",
                "benchmarkingLogic": false,
                "key": "Emergency contraception",
                "cyp": "0.05",
                "static_name": [
                  "EC"
                ]
              }],
              "static_name": "Emergency contraception",
              "methodType": "Short Term"
            }
          }
        ]
      },
      "User": {
        "categoryInfo": {
          "Aggregate": "",
          "Method": ""
        },
        "derivedCharts": [{
          "chartOptions": {
            "cid": "",
            "disableChart": false,
            "chartName": "Aggregate",
            "chartInfo": "",
            "title": {
              "text": "",
              "visible": false
            },
            "subTitle": {
              "text": "",
              "visible": false
            },
            "xAxis": {
              "text": "",
              "visible": false
            },
            "yAxis": {
              "text": "",
              "visible": true
            },
            "color": "#00FF00",
          }
        },{
          "chartOptions": {
            "cid": "",
            "disableChart": false,
            "chartName": "Total Couple Years of Protection by Region",
            "chartInfo": "",
            "title": {
              "text": "",
              "visible": false
            },
            "subTitle": {
              "text": "",
              "visible": false
            },
            "xAxis": {
              "text": "",
              "visible": false
            },
            "yAxis": {
              "text": "",
              "visible": true
            },
            "color": "#00FF00",
          }
        },{
          "chartOptions": {
            "cid": "",
            "disableChart": false,
            "chartName": "Method Wise",
            "chartInfo": "",
            "title": {
              "text": "",
              "visible": false
            },
            "subTitle": {
              "text": "",
              "visible": false
            },
            "xAxis": {
              "text": "",
              "visible": false
            },
            "yAxis": {
              "text": "",
              "visible": true
            },
            "color": "#00FF00",
          }
        },{
          "chartOptions": {
            "cid": "",
            "disableChart": false,
            "chartName": "Method Wise Regional",
            "chartInfo": "",
            "title": {
              "text": "",
              "visible": false
            },
            "subTitle": {
              "text": "",
              "visible": false
            },
            "xAxis": {
              "text": "",
              "visible": false
            },
            "yAxis": {
              "text": "",
              "visible": true
            },
            "color": "#00FF00",
          }
        }],
        "chartData": [{
            "indicator": {
              "name": "Sterilization",
              "source": "Users",
              "color": "#c87776",
              "visible": true,
              "subIndicator": [{
                  "de": [],
                  "name": [
                    "Tubal Ligation (F)"
                  ],
                  "selectedDE": [],
                  "color": "#c87776",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Sterilization",
                  "cyp": "10",
                  "static_name": [
                    "Tubal Ligation (F)"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Vasectomy (M)"
                  ],
                  "selectedDE": [],
                  "color": "#c87776",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Sterilization",
                  "cyp": "10",
                  "static_name": [
                    "Vasectomy (M)"
                  ]
                }
              ],
              "static_name": "Sterilization",
              "methodType": "Long Term"
            }
          },
          {
            "indicator": {
              "name": "IUD",
              "source": "Users",
              "visible": false,
              "subIndicator": [{
                  "de": [],
                  "name": [
                    "Copper- T 380-A IUD"
                  ],
                  "selectedDE": [],
                  "color": "#47c49a",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "IUD",
                  "cyp": "4.6",
                  "static_name": [
                    "Copper- T 380-A IUD"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "LNG-IUS"
                  ],
                  "selectedDE": [],
                  "color": "#47c49a",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "IUD",
                  "cyp": "3.3",
                  "static_name": [
                    "LNG-IUS"
                  ]
                }
              ],
              "static_name": "IUD",
              "methodType": "Long Term"
            }
          },
          {
            "indicator": {
              "name": "Implant",
              "source": "Users",
              "visible": false,
              "subIndicator": [{
                  "de": [],
                  "name": [
                    "Implanon"
                  ],
                  "selectedDE": [],
                  "color": "#8DC645",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Implant",
                  "cyp": "2.5",
                  "static_name": [
                    "Implanon"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Jadelle"
                  ],
                  "selectedDE": [],
                  "color": "#8DC645",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Implant",
                  "cyp": "3.8",
                  "static_name": [
                    "Jadelle"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Sino-Implant"
                  ],
                  "selectedDE": [],
                  "color": "#8DC645",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Implant",
                  "cyp": "3.2",
                  "static_name": [
                    "Sino-Implant"
                  ]
                }
              ],
              "static_name": "Implant",
              "methodType": "Long Term"
            }
          },
          {
            "indicator": {
              "name": "Injectable",
              "source": "Users",
              "visible": false,
              "subIndicator": [{
                  "de": [],
                  "name": [
                    "Depo Provera (DMPA)"
                  ],
                  "selectedDE": [],
                  "color": "#5287cd",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Injectable",
                  "cyp": "0.25",
                  "static_name": [
                    "Depo Provera (DMPA)"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Noristerat (NET-En)"
                  ],
                  "selectedDE": [],
                  "color": "#5287cd",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Injectable",
                  "cyp": "0.1666666667",
                  "static_name": [
                    "Noristerat (NET-En)"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Lunelle"
                  ],
                  "selectedDE": [],
                  "color": "#5287cd",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Injectable",
                  "cyp": "0.07692307692",
                  "static_name": [
                    "Lunelle"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Sayana Press"
                  ],
                  "selectedDE": [],
                  "color": "#5287cd",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Injectable",
                  "cyp": "0.25",
                  "static_name": [
                    "Sayana Press"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Other Injectable"
                  ],
                  "selectedDE": [],
                  "color": "#5287cd",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Injectable",
                  "cyp": "0.25",
                  "static_name": [
                    "Other Injectable"
                  ]
                }
              ],
              "static_name": "Injectable",
              "methodType": "Short Term"
            }
          },
          {
            "indicator": {
              "name": "Pill",
              "source": "Users",
              "visible": false,
              "subIndicator": [{
                  "de": [],
                  "name": [
                    "Combined Oral"
                  ],
                  "selectedDE": [],
                  "color": "#70aedf",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Pill",
                  "cyp": "0.06666666667",
                  "static_name": [
                    "Combined Oral"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Progestin only"
                  ],
                  "selectedDE": [],
                  "color": "#70aedf",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Pill",
                  "cyp": "0.06666666667",
                  "static_name": [
                    "Progestin only"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Other OC Pill"
                  ],
                  "selectedDE": [],
                  "color": "#70aedf",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Pill",
                  "cyp": "0.06666666667",
                  "static_name": [
                    "Other OC Pill"
                  ]
                }
              ],
              "static_name": "Pill",
              "methodType": "Short Term"
            }
          },
          {
            "indicator": {
              "name": "Condom",
              "source": "Users",
              "visible": false,
              "subIndicator": [{
                  "de": [],
                  "name": [
                    "Male Condom"
                  ],
                  "selectedDE": [],
                  "color": "#fcb241",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Condom",
                  "cyp": "0.008333333333",
                  "static_name": [
                    "Male Condom"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Female Condom"
                  ],
                  "selectedDE": [],
                  "color": "#fcb241",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Condom",
                  "cyp": "0.008333333333",
                  "static_name": [
                    "Female Condom"
                  ]
                }
              ],
              "static_name": "Condom",
              "methodType": "Short Term"
            }
          },
          {
            "indicator": {
              "name": "Other Modern Methods",
              "source": "Users",
              "visible": false,
              "subIndicator": [{
                  "de": [],
                  "name": [
                    "LAM"
                  ],
                  "selectedDE": [],
                  "color": "#78a095",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Other Modern Methods",
                  "cyp": "0.25",
                  "static_name": [
                    "LAM"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "SDM (Standard Days)"
                  ],
                  "selectedDE": [],
                  "color": "#78a095",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Other Modern Methods",
                  "cyp": "1.5",
                  "static_name": [
                    "SDM (Standard Days)"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Vaginal barrier"
                  ],
                  "selectedDE": [],
                  "color": "#78a095",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Other Modern Methods",
                  "cyp": "1",
                  "static_name": [
                    "Vaginal barrier"
                  ]
                },
                {
                  "de": [],
                  "name": [
                    "Spermicides"
                  ],
                  "selectedDE": [],
                  "color": "#78a095",
                  "type": "data_element",
                  "benchmarkingLogic": false,
                  "key": "Other Modern Methods",
                  "cyp": "0.008333333333",
                  "static_name": [
                    "Spermicides"
                  ]
                }
              ],
              "static_name": "Other Modern Methods",
              "methodType": "Short Term"
            }
          },
          {
            "indicator": {
              "name": "Emergency contraception",
              "source": "Users",
              "visible": false,
              "subIndicator": [{
                "de": [],
                "name": [
                  "EC"
                ],
                "selectedDE": [],
                "color": "#dd8ab8",
                "type": "data_element",
                "benchmarkingLogic": false,
                "key": "Emergency contraception",
                "cyp": "0.05",
                "static_name": [
                  "EC"
                ]
              }],
              "static_name": "Emergency contraception",
              "methodType": "Short Term"
            }
          }
        ]
      }
    }
  }
}

export default dqrConfig
