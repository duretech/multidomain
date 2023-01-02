const dqrConfig = {
  "dqrModule": {
    "external_validation": {
      "Background_Data": {
        "selectedMethod": "IUD",
        "dataLevel": "",
        "r2Max": '0.95'
      },
      "Injectable": {
        "cid": '',
        "disableChart": false,
        "selectedSource": ['Visits', 'Commodities_Client'],
        "chartOptions": {
          "chartName": "Correlation between Data Types for Injectable",
          "chartInfo": "",
          "categoryInfo": "",
          "outlierChartName": "Outliers for Injectable",
          "title": {
            "text": "",
            "visible": false
          },
          "subTitle": {
            "text": "",
            "visible": false
          },
          "chartDataSource": {
  					"text": ""
  				},
          "xAxis": {
            "text": "",
            "visible": false
          },
          "yAxis": {
            "text": "",
            "visible": true
          },
          "color": "#5287cd",
          "trendlineColor": "#0000FF",
          "outliersColor": "#FF0000",
          "XAxisSource": "Visits",
          "YAxisSource": "Commodities_Client",
          "minOutlier": '20',
          "wastageFactor": '20'
        },
        "derivedCharts": [{
          "chartOptions": {
            "cid": "",
            "disableChart": false,
            "chartName": "Assessing Outliers in Difference between",
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
            "color": "#5287cd",
          }
        }, {
          "chartOptions": {
            "cid": "",
            "disableChart": false,
            "chartName": "Implications - Average # of",
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
            "color": "#5287cd",
          }
        }],
        "Visits": {
          "static_name": "Visits",
          "chartData": [{
            "indicator": {
              "name": "Injectable",
              "static_name": "Injectable",
              "methodType": "Short Term",
              "source": "FP Visits",
              "visible": false,
              "subIndicator": [{
                "de": [],
                "name": ["Depo Provera (DMPA)"],
                "static_name": ["Depo Provera (DMPA)"],
                "selectedDE": [],
                "color": "#5287cd",
                "type": "data_element",
                "benchmarkingLogic": true,
                "key": "Injectable",
                "cyp": "0.25"
              }, {
                "de": [],
                "name": ["Noristerat (NET-En)"],
                "static_name": ["Noristerat (NET-En)"],
                "selectedDE": [],
                "color": "#5287cd",
                "type": "data_element",
                "benchmarkingLogic": true,
                "key": "Injectable",
                "cyp": "0.1666666667"
              }, {
                "de": [],
                "name": ["Lunelle"],
                "static_name": ["Lunelle"],
                "selectedDE": [],
                "color": "#5287cd",
                "type": "data_element",
                "benchmarkingLogic": true,
                "key": "Injectable",
                "cyp": "0.07692307692"
              }, {
                "de": [],
                "name": ["Sayana Press"],
                "static_name": ["Sayana Press"],
                "selectedDE": [],
                "color": "#5287cd",
                "type": "data_element",
                "benchmarkingLogic": true,
                "key": "Injectable",
                "cyp": "0.25"
              }, {
                "de": [],
                "name": ["Other Injectable"],
                "static_name": ["Other Injectable"],
                "selectedDE": [],
                "color": "#5287cd",
                "type": "data_element",
                "benchmarkingLogic": true,
                "key": "Injectable",
                "cyp": "0.25"
              }],
              "color": "#5287cd"
            }
          }]
        },
        "Commodities_Client": {
          "static_name": "Commodities (Client)",
          "chartData": [{
            "indicator": {
              "name": "Injectable",
              "static_name": "Injectable",
              "methodType": "Short Term",
              "source": "Commodities distributed to client",
              "visible": false,
              "subIndicator": [{
                "de": [],
                "name": ["Depo Provera (DMPA)"],
                "static_name": ["Depo Provera (DMPA)"],
                "selectedDE": [],
                "color": "#5287cd",
                "type": "data_element",
                "benchmarkingLogic": true,
                "key": "Injectable",
                "cyp": "0.25"
              }, {
                "de": [],
                "name": ["Noristerat (NET-En)"],
                "static_name": ["Noristerat (NET-En)"],
                "selectedDE": [],
                "color": "#5287cd",
                "type": "data_element",
                "benchmarkingLogic": true,
                "key": "Injectable",
                "cyp": "0.1666666667"
              }, {
                "de": [],
                "name": ["Lunelle"],
                "static_name": ["Lunelle"],
                "selectedDE": [],
                "color": "#5287cd",
                "type": "data_element",
                "benchmarkingLogic": true,
                "key": "Injectable",
                "cyp": "0.07692307692"
              }, {
                "de": [],
                "name": ["Sayana Press"],
                "static_name": ["Sayana Press"],
                "selectedDE": [],
                "color": "#5287cd",
                "type": "data_element",
                "benchmarkingLogic": true,
                "key": "Injectable",
                "cyp": "0.25"
              }, {
                "de": [],
                "name": ["Other Injectable"],
                "static_name": ["Other Injectable"],
                "selectedDE": [],
                "color": "#5287cd",
                "type": "data_element",
                "benchmarkingLogic": true,
                "key": "Injectable",
                "cyp": "0.25"
              }],
              "color": "#5287cd"
            }
          }]
        },
        "Commodities_Facilities": {
          "static_name": "Commodities (Facilities)",
          "chartData": [{
            "indicator": {
              "name": "Injectable",
              "static_name": "Injectable",
              "methodType": "Short Term",
              "source": "Commodities distributed to facilities",
              "visible": false,
              "subIndicator": [{
                "de": [],
                "name": ["Depo Provera (DMPA)"],
                "static_name": ["Depo Provera (DMPA)"],
                "selectedDE": [],
                "color": "#5287cd",
                "type": "data_element",
                "benchmarkingLogic": true,
                "key": "Injectable",
                "cyp": "0.25"
              }, {
                "de": [],
                "name": ["Noristerat (NET-En)"],
                "static_name": ["Noristerat (NET-En)"],
                "selectedDE": [],
                "color": "#5287cd",
                "type": "data_element",
                "benchmarkingLogic": true,
                "key": "Injectable",
                "cyp": "0.1666666667"
              }, {
                "de": [],
                "name": ["Lunelle"],
                "static_name": ["Lunelle"],
                "selectedDE": [],
                "color": "#5287cd",
                "type": "data_element",
                "benchmarkingLogic": true,
                "key": "Injectable",
                "cyp": "0.07692307692"
              }, {
                "de": [],
                "name": ["Sayana Press"],
                "static_name": ["Sayana Press"],
                "selectedDE": [],
                "color": "#5287cd",
                "type": "data_element",
                "benchmarkingLogic": true,
                "key": "Injectable",
                "cyp": "0.25"
              }, {
                "de": [],
                "name": ["Other Injectable"],
                "static_name": ["Other Injectable"],
                "selectedDE": [],
                "color": "#5287cd",
                "type": "data_element",
                "benchmarkingLogic": true,
                "key": "Injectable",
                "cyp": "0.25"
              }],
              "color": "#5287cd"
            }
          }]
        }
      },
      "IUD": {
        "cid": '',
        "disableChart": false,
        "selectedSource": ['Visits', 'Commodities_Client'],
        "chartOptions": {
          "chartName": "Correlation between Data Types for IUD",
          "chartInfo": "",
          "categoryInfo": "",
          "outlierChartName": "Outliers for IUD",
          "title": {
            "text": "",
            "visible": false
          },
          "subTitle": {
            "text": "",
            "visible": false
          },
          "chartDataSource": {
  					"text": ""
  				},
          "xAxis": {
            "text": "",
            "visible": false
          },
          "yAxis": {
            "text": "",
            "visible": true
          },
          "color": "#47c49a",
          "trendlineColor": "#0000FF",
          "outliersColor": "#FF0000",
          "XAxisSource": "Visits",
          "YAxisSource": "Commodities_Client",
          "minOutlier": '20',
          "wastageFactor": '20'
        },
        "derivedCharts": [{
          "chartOptions": {
            "cid": "",
            "disableChart": false,
            "chartName": "Assessing Outliers in Difference between",
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
            "color": "#47c49a",
          }
        }, {
          "chartOptions": {
            "cid": "",
            "disableChart": false,
            "chartName": "Implications - Average # of",
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
            "color": "#47c49a",
          }
        }],
        "Visits": {
          "static_name": "Visits",
          "chartData": [{
            "indicator": {
              "name": "IUD",
              "static_name": "IUD",
              "methodType": "Long Term",
              "source": "FP Visits",
              "visible": false,
              "subIndicator": [{
                "de": [],
                "name": ["Copper- T 380-A IUD"],
                "static_name": ["Copper- T 380-A IUD"],
                "selectedDE": [],
                "color": "#47c49a",
                "type": "data_element",
                "benchmarkingLogic": true,
                "key": "IUD",
                "cyp": "4.6"
              }, {
                "de": [],
                "name": ["LNG-IUS"],
                "static_name": ["LNG-IUS"],
                "selectedDE": [],
                "color": "#47c49a",
                "type": "data_element",
                "benchmarkingLogic": true,
                "key": "IUD",
                "cyp": "3.3"
              }],
              "color": "#00ff80"
            }
          }]
        },
        "Commodities_Client": {
          "static_name": "Commodities (Client)",
          "chartData": [{
            "indicator": {
              "name": "IUD",
              "static_name": "IUD",
              "methodType": "Long Term",
              "source": "Commodities distributed to client",
              "visible": false,
              "subIndicator": [{
                "de": [],
                "name": ["Copper- T 380-A IUD"],
                "static_name": ["Copper- T 380-A IUD"],
                "selectedDE": [],
                "color": "#47c49a",
                "type": "data_element",
                "benchmarkingLogic": true,
                "key": "IUD",
                "cyp": "4.6"
              }, {
                "de": [],
                "name": ["LNG-IUS"],
                "static_name": ["LNG-IUS"],
                "selectedDE": [],
                "color": "#47c49a",
                "type": "data_element",
                "benchmarkingLogic": true,
                "key": "IUD",
                "cyp": "3.3"
              }],
              "color": "#00ff80"
            }
          }]
        },
        "Commodities_Facilities": {
          "static_name": "Commodities (Facilities)",
          "chartData": [{
            "indicator": {
              "name": "IUD",
              "static_name": "IUD",
              "methodType": "Long Term",
              "source": "Commodities distributed to facilities",
              "visible": false,
              "subIndicator": [{
                "de": [],
                "name": ["Copper- T 380-A IUD"],
                "static_name": ["Copper- T 380-A IUD"],
                "selectedDE": [],
                "color": "#47c49a",
                "type": "data_element",
                "benchmarkingLogic": true,
                "key": "IUD",
                "cyp": "4.6"
              }, {
                "de": [],
                "name": ["LNG-IUS"],
                "static_name": ["LNG-IUS"],
                "selectedDE": [],
                "color": "#47c49a",
                "type": "data_element",
                "benchmarkingLogic": true,
                "key": "IUD",
                "cyp": "3.3"
              }],
              "color": "#80ffff"
            }
          }]
        }
      },
      "Implant": {
        "cid": '',
        "disableChart": false,
        "selectedSource": ['Visits', 'Commodities_Client'],
        "chartOptions": {
          "chartName": "Correlation between Data Types for Implant",
          "chartInfo": "",
          "categoryInfo": "",
          "outlierChartName": "Outliers for Implant",
          "title": {
            "text": "",
            "visible": false
          },
          "subTitle": {
            "text": "",
            "visible": false
          },
          "chartDataSource": {
  					"text": ""
  				},
          "xAxis": {
            "text": "",
            "visible": false
          },
          "yAxis": {
            "text": "",
            "visible": true
          },
          "color": "#8DC645",
          "trendlineColor": "#0000FF",
          "outliersColor": "#FF0000",
          "XAxisSource": "Visits",
          "YAxisSource": "Commodities_Client",
          "minOutlier": '20',
          "wastageFactor": '20'
        },
        "derivedCharts": [{
          "chartOptions": {
            "cid": "",
            "disableChart": false,
            "chartName": "Assessing Outliers in Difference between",
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
            "color": "#8DC645",
          }
        }, {
          "chartOptions": {
            "cid": "",
            "disableChart": false,
            "chartName": "Implications - Average # of",
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
            "color": "#8DC645",
          }
        }],
        "Visits": {
          "static_name": "Visits",
          "chartData": [{
            "indicator": {
              "name": "Implant",
              "static_name": "Implant",
              "methodType": "Long Term",
              "source": "FP Visits",
              "visible": false,
              "subIndicator": [{
                "de": [],
                "name": ["Implanon"],
                "static_name": ["Implanon"],
                "selectedDE": [],
                "color": "#8DC645",
                "type": "data_element",
                "benchmarkingLogic": true,
                "key": "Implant",
                "cyp": "2.5"
              }, {
                "de": [],
                "name": ["Jadelle"],
                "static_name": ["Jadelle"],
                "selectedDE": [],
                "color": "#8DC645",
                "type": "data_element",
                "benchmarkingLogic": true,
                "key": "Implant",
                "cyp": "3.8"
              }, {
                "de": [],
                "name": ["Sino-Implant"],
                "static_name": ["Sino-Implant"],
                "selectedDE": [],
                "color": "#8DC645",
                "type": "data_element",
                "benchmarkingLogic": true,
                "key": "Implant",
                "cyp": "3.2"
              }],
              "color": "#8DC645"
            }
          }]
        },
        "Commodities_Client": {
          "static_name": "Commodities (Client)",
          "chartData": [{
            "indicator": {
              "name": "Implant",
              "static_name": "Implant",
              "methodType": "Long Term",
              "source": "Commodities distributed to client",
              "visible": false,
              "subIndicator": [{
                "de": [],
                "name": ["Implanon"],
                "static_name": ["Implanon"],
                "selectedDE": [],
                "color": "#8DC645",
                "type": "data_element",
                "benchmarkingLogic": true,
                "key": "Implant",
                "cyp": "2.5"
              }, {
                "de": [],
                "name": ["Jadelle"],
                "static_name": ["Jadelle"],
                "selectedDE": [],
                "color": "#8DC645",
                "type": "data_element",
                "benchmarkingLogic": true,
                "key": "Implant",
                "cyp": "3.8"
              }, {
                "de": [],
                "name": ["Sino-Implant"],
                "static_name": ["Sino-Implant"],
                "selectedDE": [],
                "color": "#8DC645",
                "type": "data_element",
                "benchmarkingLogic": true,
                "key": "Implant",
                "cyp": "3.2"
              }],
              "color": "#8DC645"
            }
          }]
        },
        "Commodities_Facilities": {
          "static_name": "Commodities (Facilities)",
          "chartData": [{
            "indicator": {
              "name": "Implant",
              "static_name": "Implant",
              "methodType": "Long Term",
              "source": "Commodities distributed to facilities",
              "visible": false,
              "subIndicator": [{
                "de": [],
                "name": ["Implanon"],
                "static_name": ["Implanon"],
                "selectedDE": [],
                "color": "#8DC645",
                "type": "data_element",
                "benchmarkingLogic": true,
                "key": "Implant",
                "cyp": "2.5"
              }, {
                "de": [],
                "name": ["Jadelle"],
                "static_name": ["Jadelle"],
                "selectedDE": [],
                "color": "#8DC645",
                "type": "data_element",
                "benchmarkingLogic": true,
                "key": "Implant",
                "cyp": "3.8"
              }, {
                "de": [],
                "name": ["Sino-Implant"],
                "static_name": ["Sino-Implant"],
                "selectedDE": [],
                "color": "#8DC645",
                "type": "data_element",
                "benchmarkingLogic": true,
                "key": "Implant",
                "cyp": "3.2"
              }],
              "color": "#8DC645"
            }
          }]
        }
      }
    }
  }
}

export default dqrConfig
