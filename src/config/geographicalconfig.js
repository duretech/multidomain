const geographicalConfig = {
  "sourceType": {
    "Visits": {
      "derivedCharts": [{
        "chartOptions": {
          "cid": "",
          "disableChart": false,
          "chartName": "Comparing Total CYP - By Province",
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
            "text": "Value by Method",
            "visible": true
          }
        }
      }, {
        "chartOptions": {
          "cid": "",
          "disableChart": false,
          "chartName": "Trends",
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
            "text": "Value by Method",
            "visible": true
          }
        }
      }, {
        "chartOptions": {
          "cid": "",
          "disableChart": false,
          "chartName": "Average Annual Growth",
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
            "text": "Value by Method",
            "visible": true
          }
        }
      }, {
        "chartOptions": {
          "cid": "",
          "disableChart": false,
          "chartName": "Most Common Method Used",
          "chartInfo": "",
          "title": {
            "text": "",
            "visible": false
          },
          "subTitle": {
            "text": "",
            "visible": false
          }
        }
      }, {
        "chartOptions": {
          "cid": "",
          "disableChart": false,
          "chartName": "Comparing Method Mix",
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
            "text": "Value by Method",
            "visible": true
          }
        }
      },  {
        "chartOptions": {
          "cid": "",
          "disableChart": false,
          "chartName": "Method Trend Matrix",
          "chartInfo": "",
          "title": {
            "text": "",
            "visible": false
          },
          "subTitle": {
            "text": "",
            "visible": false
          },
        }
      }],
      "chartData": [{
        "indicator": {
          "name": "Sterilization",
          "static_name": "Sterilization",
          "methodType": "Long Term",
          "source": "FP Visits",
          "color": "#c87776",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Tubal Ligation (F)"],
            "static_name": ["Tubal Ligation (F)"],
            "selectedDE": [],
            "color": "#c87776",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Sterilization",
            "cyp": "10"
          }, {
            "de": [],
            "name": ["Vasectomy (M)"],
            "static_name": ["Vasectomy (M)"],
            "selectedDE": [],
            "color": "#c87776",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Sterilization",
            "cyp": "10"
          }]
        }
      }, {
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
          "color": "#47c49a"
        }
      }, {
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
      }, {
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
      }, {
        "indicator": {
          "name": "Pill",
          "static_name": "Pill",
          "methodType": "Short Term",
          "source": "FP Visits",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Combined Oral"],
            "static_name": ["Combined Oral"],
            "selectedDE": [],
            "color": "#70aedf",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Pill",
            "cyp": "0.06666666667"
          }, {
            "de": [],
            "name": ["Progestin only"],
            "static_name": ["Progestin only"],
            "selectedDE": [],
            "color": "#70aedf",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Pill",
            "cyp": "0.06666666667"
          }, {
            "de": [],
            "name": ["Other OC Pill"],
            "static_name": ["Other OC Pill"],
            "selectedDE": [],
            "color": "#70aedf",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Pill",
            "cyp": "0.06666666667"
          }],
          "color": "#70aedf"
        }
      }, {
        "indicator": {
          "name": "Condom (m+f)",
          "static_name": "Condom",
          "methodType": "Short Term",
          "source": "FP Visits",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Male Condom"],
            "static_name": ["Male Condom"],
            "selectedDE": [],
            "color": "#fcb241",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Condom",
            "cyp": "0.008333333333"
          }, {
            "de": [],
            "name": ["Female Condom"],
            "static_name": ["Female Condom"],
            "selectedDE": [],
            "color": "#fcb241",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Condom",
            "cyp": "0.008333333333"
          }],
          "color": "#fcb241"
        }
      }, {
        "indicator": {
          "name": "Other Modern Methods",
          "static_name": "Other Modern Methods",
          "methodType": "Short Term",
          "source": "FP Visits",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["LAM"],
            "static_name": ["LAM"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Other Modern Methods",
            "cyp": "0.25"
          }, {
            "de": [],
            "name": ["SDM (Standard Days)"],
            "static_name": ["SDM (Standard Days)"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Other Modern Methods",
            "cyp": "1.5"
          }, {
            "de": [],
            "name": ["Vaginal barrier"],
            "static_name": ["Vaginal barrier"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Other Modern Methods",
            "cyp": "1"
          }, {
            "de": [],
            "name": ["Spermicides"],
            "static_name": ["Spermicides"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Other Modern Methods",
            "cyp": "0.008333333333"
          }],
          "color": "#78a095"
        }
      }, {
        "indicator": {
          "name": "Emergency contraception",
          "static_name": "Emergency contraception",
          "methodType": "Short Term",
          "source": "FP Visits",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["EC"],
            "static_name": ["EC"],
            "selectedDE": [],
            "color": "#dd8ab8",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Emergency contraception",
            "cyp": "0.05"
          }],
          "color": "#dd8ab8"
        }
      }]
    },
    "Commodities_Client": {
      "derivedCharts": [{
        "chartOptions": {
          "cid": "",
          "disableChart": false,
          "chartName": "Comparing Total CYP - By Province",
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
            "text": "Value by Method",
            "visible": true
          }
        }
      }, {
        "chartOptions": {
          "cid": "",
          "disableChart": false,
          "chartName": "Trends",
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
            "text": "Value by Method",
            "visible": true
          }
        }
      }, {
        "chartOptions": {
          "cid": "",
          "disableChart": false,
          "chartName": "Average Annual Growth",
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
            "text": "Value by Method",
            "visible": true
          }
        }
      }, {
        "chartOptions": {
          "cid": "",
          "disableChart": false,
          "chartName": "Most Common Method Used",
          "chartInfo": "",
          "title": {
            "text": "",
            "visible": false
          },
          "subTitle": {
            "text": "",
            "visible": false
          }
        }
      }, {
        "chartOptions": {
          "cid": "",
          "disableChart": false,
          "chartName": "Comparing Method Mix",
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
            "text": "Value by Method",
            "visible": true
          }
        }
      }, {
        "chartOptions": {
          "cid": "",
          "disableChart": false,
          "chartName": "Method Trend Matrix",
          "chartInfo": "",
          "title": {
            "text": "",
            "visible": false
          },
          "subTitle": {
            "text": "",
            "visible": false
          },
        }
      }],
      "chartData": [{
        "indicator": {
          "name": "Sterilization",
          "static_name": "Sterilization",
          "methodType": "Long Term",
          "source": "Commodities distributed to client",
          "color": "#c87776",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Tubal Ligation (F)"],
            "static_name": ["Tubal Ligation (F)"],
            "selectedDE": [],
            "color": "#c87776",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Sterilization",
            "cyp": "10"
          }, {
            "de": [],
            "name": ["Vasectomy (M)"],
            "static_name": ["Vasectomy (M)"],
            "selectedDE": [],
            "color": "#c87776",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Sterilization",
            "cyp": "10"
          }]
        }
      }, {
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
          "color": "#47c49a"
        }
      }, {
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
      }, {
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
      }, {
        "indicator": {
          "name": "Pill",
          "static_name": "Pill",
          "methodType": "Short Term",
          "source": "Commodities distributed to client",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Combined Oral"],
            "static_name": ["Combined Oral"],
            "selectedDE": [],
            "color": "#70aedf",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Pill",
            "cyp": "0.06666666667"
          }, {
            "de": [],
            "name": ["Progestin only"],
            "static_name": ["Progestin only"],
            "selectedDE": [],
            "color": "#70aedf",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Pill",
            "cyp": "0.06666666667"
          }, {
            "de": [],
            "name": ["Other OC Pill"],
            "static_name": ["Other OC Pill"],
            "selectedDE": [],
            "color": "#70aedf",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Pill",
            "cyp": "0.06666666667"
          }],
          "color": "#70aedf"
        }
      }, {
        "indicator": {
          "name": "Condom (m+f)",
          "static_name": "Condom",
          "methodType": "Short Term",
          "source": "Commodities distributed to client",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Male Condom"],
            "static_name": ["Male Condom"],
            "selectedDE": [],
            "color": "#fcb241",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Condom",
            "cyp": "0.008333333333"
          }, {
            "de": [],
            "name": ["Female Condom"],
            "static_name": ["Female Condom"],
            "selectedDE": [],
            "color": "#fcb241",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Condom",
            "cyp": "0.008333333333"
          }],
          "color": "#fcb241"
        }
      }, {
        "indicator": {
          "name": "Other Modern Methods",
          "static_name": "Other Modern Methods",
          "methodType": "Short Term",
          "source": "Commodities distributed to client",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["LAM"],
            "static_name": ["LAM"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Other Modern Methods",
            "cyp": "0.25"
          }, {
            "de": [],
            "name": ["SDM (Standard Days)"],
            "static_name": ["SDM (Standard Days)"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Other Modern Methods",
            "cyp": "1.5"
          }, {
            "de": [],
            "name": ["Vaginal barrier"],
            "static_name": ["Vaginal barrier"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Other Modern Methods",
            "cyp": "1"
          }, {
            "de": [],
            "name": ["Spermicides"],
            "static_name": ["Spermicides"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Other Modern Methods",
            "cyp": "0.008333333333"
          }],
          "color": "#78a095"
        }
      }, {
        "indicator": {
          "name": "Emergency contraception",
          "static_name": "Emergency contraception",
          "methodType": "Short Term",
          "source": "Commodities distributed to client",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["EC"],
            "static_name": ["EC"],
            "selectedDE": [],
            "color": "#dd8ab8",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Emergency contraception",
            "cyp": "0.05"
          }],
          "color": "#dd8ab8"
        }
      }]
    },
    "Commodities_Facilities": {
      "derivedCharts": [{
        "chartOptions": {
          "cid": "",
          "disableChart": false,
          "chartName": "Comparing Total CYP - By Province",
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
            "text": "Value by Method",
            "visible": true
          }
        }
      }, {
        "chartOptions": {
          "cid": "",
          "disableChart": false,
          "chartName": "Trends",
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
            "text": "Value by Method",
            "visible": true
          }
        }
      }, {
        "chartOptions": {
          "cid": "",
          "disableChart": false,
          "chartName": "Average Annual Growth",
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
            "text": "Value by Method",
            "visible": true
          }
        }
      }, {
        "chartOptions": {
          "cid": "",
          "disableChart": false,
          "chartName": "Most Common Method Used",
          "chartInfo": "",
          "title": {
            "text": "",
            "visible": false
          },
          "subTitle": {
            "text": "",
            "visible": false
          }
        }
      }, {
        "chartOptions": {
          "cid": "",
          "disableChart": false,
          "chartName": "Comparing Method Mix",
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
            "text": "Value by Method",
            "visible": true
          }
        }
      }, {
        "chartOptions": {
          "cid": "",
          "disableChart": false,
          "chartName": "Method Trend Matrix",
          "chartInfo": "",
          "title": {
            "text": "",
            "visible": false
          },
          "subTitle": {
            "text": "",
            "visible": false
          },
        }
      }],
      "chartData": [{
        "indicator": {
          "name": "Sterilization",
          "static_name": "Sterilization",
          "methodType": "Long Term",
          "source": "Commodities distributed to facilities",
          "color": "#c87776",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Tubal Ligation (F)"],
            "static_name": ["Tubal Ligation (F)"],
            "selectedDE": [],
            "color": "#c87776",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Sterilization",
            "cyp": "10"
          }, {
            "de": [],
            "name": ["Vasectomy (M)"],
            "static_name": ["Vasectomy (M)"],
            "selectedDE": [],
            "color": "#c87776",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Sterilization",
            "cyp": "10"
          }]
        }
      }, {
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
          "color": "#47c49a"
        }
      }, {
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
      }, {
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
      }, {
        "indicator": {
          "name": "Pill",
          "static_name": "Pill",
          "methodType": "Short Term",
          "source": "Commodities distributed to facilities",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Combined Oral"],
            "static_name": ["Combined Oral"],
            "selectedDE": [],
            "color": "#70aedf",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Pill",
            "cyp": "0.06666666667"
          }, {
            "de": [],
            "name": ["Progestin only"],
            "static_name": ["Progestin only"],
            "selectedDE": [],
            "color": "#70aedf",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Pill",
            "cyp": "0.06666666667"
          }, {
            "de": [],
            "name": ["Other OC Pill"],
            "static_name": ["Other OC Pill"],
            "selectedDE": [],
            "color": "#70aedf",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Pill",
            "cyp": "0.06666666667"
          }],
          "color": "#70aedf"
        }
      }, {
        "indicator": {
          "name": "Condom (m+f)",
          "static_name": "Condom",
          "methodType": "Short Term",
          "source": "Commodities distributed to facilities",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Male Condom"],
            "static_name": ["Male Condom"],
            "selectedDE": [],
            "color": "#fcb241",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Condom",
            "cyp": "0.008333333333"
          }, {
            "de": [],
            "name": ["Female Condom"],
            "static_name": ["Female Condom"],
            "selectedDE": [],
            "color": "#fcb241",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Condom",
            "cyp": "0.008333333333"
          }],
          "color": "#fcb241"
        }
      }, {
        "indicator": {
          "name": "Other Modern Methods",
          "static_name": "Other Modern Methods",
          "methodType": "Short Term",
          "source": "Commodities distributed to facilities",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["LAM"],
            "static_name": ["LAM"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Other Modern Methods",
            "cyp": "0.25"
          }, {
            "de": [],
            "name": ["SDM (Standard Days)"],
            "static_name": ["SDM (Standard Days)"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Other Modern Methods",
            "cyp": "1.5"
          }, {
            "de": [],
            "name": ["Vaginal barrier"],
            "static_name": ["Vaginal barrier"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Other Modern Methods",
            "cyp": "1"
          }, {
            "de": [],
            "name": ["Spermicides"],
            "static_name": ["Spermicides"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Other Modern Methods",
            "cyp": "0.008333333333"
          }],
          "color": "#78a095"
        }
      }, {
        "indicator": {
          "name": "Emergency contraception",
          "static_name": "Emergency contraception",
          "methodType": "Short Term",
          "source": "Commodities distributed to facilities",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["EC"],
            "static_name": ["EC"],
            "selectedDE": [],
            "color": "#dd8ab8",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Emergency contraception",
            "cyp": "0.05"
          }],
          "color": "#dd8ab8"
        }
      }]
    },
    "User": {
      "derivedCharts": [{
        "chartOptions": {
          "cid": "",
          "disableChart": false,
          "chartName": "Comparing Total CYP - By Province",
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
            "text": "Value by Method",
            "visible": true
          }
        }
      }, {
        "chartOptions": {
          "cid": "",
          "disableChart": false,
          "chartName": "Trends",
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
            "text": "Value by Method",
            "visible": true
          }
        }
      }, {
        "chartOptions": {
          "cid": "",
          "disableChart": false,
          "chartName": "Average Annual Growth",
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
            "text": "Value by Method",
            "visible": true
          }
        }
      }, {
        "chartOptions": {
          "cid": "",
          "disableChart": false,
          "chartName": "Most Common Method Used",
          "chartInfo": "",
          "title": {
            "text": "",
            "visible": false
          },
          "subTitle": {
            "text": "",
            "visible": false
          }
        }
      }, {
        "chartOptions": {
          "cid": "",
          "disableChart": false,
          "chartName": "Comparing Method Mix",
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
            "text": "Value by Method",
            "visible": true
          }
        }
      }, {
        "chartOptions": {
          "cid": "",
          "disableChart": false,
          "chartName": "Method Trend Matrix",
          "chartInfo": "",
          "title": {
            "text": "",
            "visible": false
          },
          "subTitle": {
            "text": "",
            "visible": false
          },
        }
      }],
      "chartData": [{
        "indicator": {
          "name": "Sterilization",
          "static_name": "Sterilization",
          "methodType": "Long Term",
          "source": "Users",
          "color": "#c87776",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Tubal Ligation (F)"],
            "static_name": ["Tubal Ligation (F)"],
            "selectedDE": [],
            "color": "#c87776",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Sterilization",
            "cyp": "1"
          }, {
            "de": [],
            "name": ["Vasectomy (M)"],
            "static_name": ["Vasectomy (M)"],
            "selectedDE": [],
            "color": "#c87776",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Sterilization",
            "cyp": "1"
          }]
        }
      }, {
        "indicator": {
          "name": "IUD",
          "static_name": "IUD",
          "methodType": "Long Term",
          "source": "Users",
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
            "cyp": "1"
          }, {
            "de": [],
            "name": ["LNG-IUS"],
            "static_name": ["LNG-IUS"],
            "selectedDE": [],
            "color": "#47c49a",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "IUD",
            "cyp": "1"
          }],
          "color": "#47c49a"
        }
      }, {
        "indicator": {
          "name": "Implant",
          "static_name": "Implant",
          "methodType": "Long Term",
          "source": "Users",
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
            "cyp": "1"
          }, {
            "de": [],
            "name": ["Jadelle"],
            "static_name": ["Jadelle"],
            "selectedDE": [],
            "color": "#8DC645",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Implant",
            "cyp": "1"
          }, {
            "de": [],
            "name": ["Sino-Implant"],
            "static_name": ["Sino-Implant"],
            "selectedDE": [],
            "color": "#8DC645",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Implant",
            "cyp": "1"
          }],
          "color": "#8DC645"
        }
      }, {
        "indicator": {
          "name": "Injectable",
          "static_name": "Injectable",
          "methodType": "Short Term",
          "source": "Users",
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
            "cyp": "1"
          }, {
            "de": [],
            "name": ["Noristerat (NET-En)"],
            "static_name": ["Noristerat (NET-En)"],
            "selectedDE": [],
            "color": "#5287cd",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Injectable",
            "cyp": "1"
          }, {
            "de": [],
            "name": ["Lunelle"],
            "static_name": ["Lunelle"],
            "selectedDE": [],
            "color": "#5287cd",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Injectable",
            "cyp": "1"
          }, {
            "de": [],
            "name": ["Sayana Press"],
            "static_name": ["Sayana Press"],
            "selectedDE": [],
            "color": "#5287cd",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Injectable",
            "cyp": "1"
          }, {
            "de": [],
            "name": ["Other Injectable"],
            "static_name": ["Other Injectable"],
            "selectedDE": [],
            "color": "#5287cd",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Injectable",
            "cyp": "1"
          }],
          "color": "#5287cd"
        }
      }, {
        "indicator": {
          "name": "Pill",
          "static_name": "Pill",
          "methodType": "Short Term",
          "source": "Users",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Combined Oral"],
            "static_name": ["Combined Oral"],
            "selectedDE": [],
            "color": "#70aedf",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Pill",
            "cyp": "1"
          }, {
            "de": [],
            "name": ["Progestin only"],
            "static_name": ["Progestin only"],
            "selectedDE": [],
            "color": "#70aedf",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Pill",
            "cyp": "1"
          }, {
            "de": [],
            "name": ["Other OC Pill"],
            "static_name": ["Other OC Pill"],
            "selectedDE": [],
            "color": "#70aedf",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Pill",
            "cyp": "1"
          }],
          "color": "#70aedf"
        }
      }, {
        "indicator": {
          "name": "Condom (m+f)",
          "static_name": "Condom",
          "methodType": "Short Term",
          "source": "Users",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Male Condom"],
            "static_name": ["Male Condom"],
            "selectedDE": [],
            "color": "#fcb241",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Condom",
            "cyp": "1"
          }, {
            "de": [],
            "name": ["Female Condom"],
            "static_name": ["Female Condom"],
            "selectedDE": [],
            "color": "#fcb241",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Condom",
            "cyp": "1"
          }],
          "color": "#fcb241"
        }
      }, {
        "indicator": {
          "name": "Other Modern Methods",
          "static_name": "Other Modern Methods",
          "methodType": "Short Term",
          "source": "Users",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["LAM"],
            "static_name": ["LAM"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Other Modern Methods",
            "cyp": "1"
          }, {
            "de": [],
            "name": ["SDM (Standard Days)"],
            "static_name": ["SDM (Standard Days)"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Other Modern Methods",
            "cyp": "1"
          }, {
            "de": [],
            "name": ["Vaginal barrier"],
            "static_name": ["Vaginal barrier"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Other Modern Methods",
            "cyp": "1"
          }, {
            "de": [],
            "name": ["Spermicides"],
            "static_name": ["Spermicides"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Other Modern Methods",
            "cyp": "1"
          }],
          "color": "#78a095"
        }
      }, {
        "indicator": {
          "name": "Emergency contraception",
          "static_name": "Emergency contraception",
          "methodType": "Short Term",
          "source": "Users",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["EC"],
            "static_name": ["EC"],
            "selectedDE": [],
            "color": "#dd8ab8",
            "type": "data_element",
            "benchmarkingLogic": true,
            "key": "Emergency contraception",
            "cyp": "1"
          }],
          "color": "#dd8ab8"
        }
      }]
    },
    "EMU": {
      "derivedCharts": [{
        "chartOptions": {
          "cid": "",
          "disableChart": false,
          "chartName": "Comparing Total EMU",
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
            "text": "Value by Method",
            "visible": true
          }
        }
      }, {
        "chartOptions": {
          "cid": "",
          "disableChart": false,
          "chartName": "Trends in EMU",
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
            "text": "Value by Method",
            "visible": true
          }
        }
      }, {
        "chartOptions": {
          "cid": "",
          "disableChart": false,
          "chartName": "Average Monthly Growth",
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
            "text": "Value by Method",
            "visible": true
          }
        }
      }, {
        "chartOptions": {
          "cid": "",
          "disableChart": false,
          "chartName": "Most Common Method Used - EMU",
          "chartInfo": "",
          "title": {
            "text": "",
            "visible": false
          },
          "subTitle": {
            "text": "",
            "visible": false
          }
        }
      }, {
        "chartOptions": {
          "cid": "",
          "disableChart": false,
          "chartName": "Comparing Method Mix - EMU",
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
            "text": "Value by Method",
            "visible": true
          }
        }
      },  {
        "chartOptions": {
          "cid": "",
          "disableChart": false,
          "chartName": "Method Trend Matrix - EMU",
          "chartInfo": "",
          "title": {
            "text": "",
            "visible": false
          },
          "subTitle": {
            "text": "",
            "visible": false
          },
        }
      }]
    }
  }
}
export default geographicalConfig;
