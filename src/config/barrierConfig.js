const barriers = {
  "adBarrierModule": {
    "access": {
      "Accessibility": {
        "cid": "",
        "disableChart": false,
        "indicatorsType": "",
        "chartName": "Comparing Method Access",
        "chartInfo": "",
        "categoryInfo": "",
        "chartOptions": {
          "chart": {
            "type": "Column"
          },
          "title": {
            "text": "",
            "title": "Comparing Method Access",
            "visible": false
          },
          "subTitle": {
            "text": "",
            "subTitle": "",
            "visible": false
          },
          "chartDataSource": {
            "text": ""
          },
          "xAxis": {
            "title": {
              "text": ""
            },
            "visible": false
          },
          "yAxis": {
            "title": {
              "text": ""
            },
            "visible": true
          },
          "color": "#80ffff"
        },
        "dataLabels": {
          "enabled": false
        },
        "derivedCharts": [{
          "chartOptions": {
            "cid": "",
            "disableChart": false,
            "chartName": "Trends in Method Accessibility",
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
            "static_name": "Sterilization",
            "methodType": "Long Term",
            "source": "",
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
              "key": "Sterilization"
            }, {
              "de": [],
              "name": ["Vasectomy (M)"],
              "static_name": ["Vasectomy (M)"],
              "selectedDE": [],
              "color": "#c87776",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Sterilization"
            }]
          }
        }, {
          "indicator": {
            "name": "IUD",
            "static_name": "IUD",
            "methodType": "Long Term",
            "source": "",
            "visible": false,
            "subIndicator": [{
              "de": [],
              "name": ["Copper- T 380-A IUD"],
              "static_name": ["Copper- T 380-A IUD"],
              "selectedDE": [],
              "color": "#47c49a",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "IUD"
            }, {
              "de": [],
              "name": ["LNG-IUS"],
              "static_name": ["LNG-IUS"],
              "selectedDE": [],
              "color": "#47c49a",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "IUD"
            }],
            "color": "#47c49a"
          }
        }, {
          "indicator": {
            "name": "Implant",
            "static_name": "Implant",
            "methodType": "Long Term",
            "source": "",
            "visible": false,
            "subIndicator": [{
              "de": [],
              "name": ["Implanon"],
              "static_name": ["Implanon"],
              "selectedDE": [],
              "color": "#8DC645",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Implant"
            }, {
              "de": [],
              "name": ["Jadelle"],
              "static_name": ["Jadelle"],
              "selectedDE": [],
              "color": "#8DC645",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Implant"
            }, {
              "de": [],
              "name": ["Sino-Implant"],
              "static_name": ["Sino-Implant"],
              "selectedDE": [],
              "color": "#8DC645",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Implant"
            }],
            "color": "#8DC645"
          }
        }, {
          "indicator": {
            "name": "Injectable",
            "static_name": "Injectable",
            "methodType": "Short Term",
            "source": "",
            "visible": false,
            "subIndicator": [{
              "de": [],
              "name": ["Depo Provera (DMPA)"],
              "static_name": ["Depo Provera (DMPA)"],
              "selectedDE": [],
              "color": "#5287cd",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Injectable"
            }, {
              "de": [],
              "name": ["Noristerat (NET-En)"],
              "static_name": ["Noristerat (NET-En)"],
              "selectedDE": [],
              "color": "#5287cd",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Injectable"
            }, {
              "de": [],
              "name": ["Lunelle"],
              "static_name": ["Lunelle"],
              "selectedDE": [],
              "color": "#5287cd",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Injectable"
            }, {
              "de": [],
              "name": ["Sayana Press"],
              "static_name": ["Sayana Press"],
              "selectedDE": [],
              "color": "#5287cd",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Injectable"
            }, {
              "de": [],
              "name": ["Other Injectable"],
              "static_name": ["Other Injectable"],
              "selectedDE": [],
              "color": "#5287cd",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Injectable"
            }],
            "color": "#5287cd"
          }
        }, {
          "indicator": {
            "name": "Pill",
            "static_name": "Pill",
            "methodType": "Short Term",
            "source": "",
            "visible": false,
            "subIndicator": [{
              "de": [],
              "name": ["Combined Oral"],
              "static_name": ["Combined Oral"],
              "selectedDE": [],
              "color": "#70aedf",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Pill"
            }, {
              "de": [],
              "name": ["Progestin only"],
              "static_name": ["Progestin only"],
              "selectedDE": [],
              "color": "#70aedf",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Pill"
            }, {
              "de": [],
              "name": ["Other OC Pill"],
              "static_name": ["Other OC Pill"],
              "selectedDE": [],
              "color": "#70aedf",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Pill"
            }],
            "color": "#70aedf"
          }
        }, {
          "indicator": {
            "name": "Condom (m+f)",
            "static_name": "Condom",
            "methodType": "Short Term",
            "source": "",
            "visible": false,
            "subIndicator": [{
              "de": [],
              "name": ["Male Condom"],
              "static_name": ["Male Condom"],
              "selectedDE": [],
              "color": "#fcb241",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Condom"
            }, {
              "de": [],
              "name": ["Female Condom"],
              "static_name": ["Female Condom"],
              "selectedDE": [],
              "color": "#fcb241",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Condom"
            }],
            "color": "#fcb241"
          }
        }, {
          "indicator": {
            "name": "Other Modern Methods",
            "static_name": "Other Modern Methods",
            "methodType": "Short Term",
            "source": "",
            "visible": false,
            "subIndicator": [{
              "de": [],
              "name": ["LAM"],
              "static_name": ["LAM"],
              "selectedDE": [],
              "color": "#78a095",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Other Modern Methods"
            }, {
              "de": [],
              "name": ["SDM (Standard Days)"],
              "static_name": ["SDM (Standard Days)"],
              "selectedDE": [],
              "color": "#78a095",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Other Modern Methods"
            }, {
              "de": [],
              "name": ["Vaginal barrier"],
              "static_name": ["Vaginal barrier"],
              "selectedDE": [],
              "color": "#78a095",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Other Modern Methods"
            }, {
              "de": [],
              "name": ["Spermicides"],
              "static_name": ["Spermicides"],
              "selectedDE": [],
              "color": "#78a095",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Other Modern Methods"
            }],
            "color": "#78a095"
          }
        }, {
          "indicator": {
            "name": "Emergency contraception",
            "static_name": "Emergency contraception",
            "methodType": "Short Term",
            "source": "",
            "visible": false,
            "subIndicator": [{
              "de": [],
              "name": ["EC"],
              "static_name": ["EC"],
              "selectedDE": [],
              "color": "#dd8ab8",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Emergency contraception"
            }],
            "color": "#dd8ab8"
          }
        }]
      },
      "Services": {
        "cid": "",
        "disableChart": false,
        "chartName": "No.of Services - Insertion vs Removal",
        "chartInfo": "",
        "categoryInfo": "",
        "chartOptions": {
          "chart": {
            "type": "Column"
          },
          "title": {
            "text": "",
            "title": "Comparing Method Access",
            "visible": false
          },
          "subTitle": {
            "text": "",
            "subTitle": "",
            "visible": false
          },
          "chartDataSource": {
            "text": ""
          },
          "xAxis": {
            "title": {
              "text": ""
            },
            "visible": false
          },
          "yAxis": {
            "title": {
              "text": ""
            },
            "visible": true
          },
          "color": "#e6a182"
        },
        "dataLabels": {
          "enabled": false
        },
        "derivedCharts": [{
          "chartOptions": {
            "cid": "",
            "disableChart": false,
            "chartName": "% Providing Removal vs % Providing Insertion",
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
            "color": "#e6a182",
          }
        }],
        "selectedSource": ['IUD', 'Implant'],
        "IUD": {
          "static_name": "IUD",
          "name": "IUD",
          "color": "#e6a182",
          "chartData": [{
            "indicator": {
              "name": "Insertion",
              "static_name": "Insertion",
              "methodType": "Long Term",
              "source": "IUD",
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
          },{
            "indicator": {
              "name": "Removal",
              "static_name": "Removal",
              "methodType": "Long Term",
              "source": "IUD",
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
          }]
        },
        "Implant": {
          "static_name": "Implant",
          "name": "Implant",
          "color": "#e6a182",
          "chartData": [{
            "indicator": {
              "name": "Insertion",
              "static_name": "Insertion",
              "methodType": "Long Term",
              "source": "Implant",
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
          },{
            "indicator": {
              "name": "Removal",
              "static_name": "Removal",
              "methodType": "Long Term",
              "source": "Implant",
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
    },
    "stock": {
      "Stock": {
        "cid": "",
        "disableChart": false,
        "indicatorsType": "",
        "chartName": "Comparative Stockout",
        "chartInfo": "",
        "categoryInfo": "",
        "chartOptions": {
          "chart": {
            "type": "Column"
          },
          "title": {
            "text": "",
            "title": "",
            "visible": false
          },
          "subTitle": {
            "text": "",
            "subTitle": "",
            "visible": false
          },
          "chartDataSource": {
            "text": ""
          },
          "xAxis": {
            "title": {
              "text": ""
            },
            "visible": false
          },
          "yAxis": {
            "title": {
              "text": ""
            },
            "visible": true
          },
          "color": "#80ffff"
        },
        "dataLabels": {
          "enabled": false
        },
        "derivedCharts": [{
          "chartOptions": {
            "cid": "",
            "disableChart": false,
            "chartName": "Trends in Stockouts",
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
            "static_name": "Sterilization",
            "methodType": "Long Term",
            "source": "",
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
              "key": "Sterilization"
            }, {
              "de": [],
              "name": ["Vasectomy (M)"],
              "static_name": ["Vasectomy (M)"],
              "selectedDE": [],
              "color": "#c87776",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Sterilization"
            }]
          }
        }, {
          "indicator": {
            "name": "IUD",
            "static_name": "IUD",
            "methodType": "Long Term",
            "source": "",
            "visible": false,
            "subIndicator": [{
              "de": [],
              "name": ["Copper- T 380-A IUD"],
              "static_name": ["Copper- T 380-A IUD"],
              "selectedDE": [],
              "color": "#47c49a",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "IUD"
            }, {
              "de": [],
              "name": ["LNG-IUS"],
              "static_name": ["LNG-IUS"],
              "selectedDE": [],
              "color": "#47c49a",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "IUD"
            }],
            "color": "#47c49a"
          }
        }, {
          "indicator": {
            "name": "Implant",
            "static_name": "Implant",
            "methodType": "Long Term",
            "source": "",
            "visible": false,
            "subIndicator": [{
              "de": [],
              "name": ["Implanon"],
              "static_name": ["Implanon"],
              "selectedDE": [],
              "color": "#8DC645",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Implant"
            }, {
              "de": [],
              "name": ["Jadelle"],
              "static_name": ["Jadelle"],
              "selectedDE": [],
              "color": "#8DC645",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Implant"
            }, {
              "de": [],
              "name": ["Sino-Implant"],
              "static_name": ["Sino-Implant"],
              "selectedDE": [],
              "color": "#8DC645",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Implant"
            }],
            "color": "#8DC645"
          }
        }, {
          "indicator": {
            "name": "Injectable",
            "static_name": "Injectable",
            "methodType": "Short Term",
            "source": "",
            "visible": false,
            "subIndicator": [{
              "de": [],
              "name": ["Depo Provera (DMPA)"],
              "static_name": ["Depo Provera (DMPA)"],
              "selectedDE": [],
              "color": "#5287cd",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Injectable"
            }, {
              "de": [],
              "name": ["Noristerat (NET-En)"],
              "static_name": ["Noristerat (NET-En)"],
              "selectedDE": [],
              "color": "#5287cd",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Injectable"
            }, {
              "de": [],
              "name": ["Lunelle"],
              "static_name": ["Lunelle"],
              "selectedDE": [],
              "color": "#5287cd",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Injectable"
            }, {
              "de": [],
              "name": ["Sayana Press"],
              "static_name": ["Sayana Press"],
              "selectedDE": [],
              "color": "#5287cd",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Injectable"
            }, {
              "de": [],
              "name": ["Other Injectable"],
              "static_name": ["Other Injectable"],
              "selectedDE": [],
              "color": "#5287cd",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Injectable"
            }],
            "color": "#5287cd"
          }
        }, {
          "indicator": {
            "name": "Pill",
            "static_name": "Pill",
            "methodType": "Short Term",
            "source": "",
            "visible": false,
            "subIndicator": [{
              "de": [],
              "name": ["Combined Oral"],
              "static_name": ["Combined Oral"],
              "selectedDE": [],
              "color": "#70aedf",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Pill"
            }, {
              "de": [],
              "name": ["Progestin only"],
              "static_name": ["Progestin only"],
              "selectedDE": [],
              "color": "#70aedf",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Pill"
            }, {
              "de": [],
              "name": ["Other OC Pill"],
              "static_name": ["Other OC Pill"],
              "selectedDE": [],
              "color": "#70aedf",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Pill"
            }],
            "color": "#70aedf"
          }
        }, {
          "indicator": {
            "name": "Condom (m+f)",
            "static_name": "Condom",
            "methodType": "Short Term",
            "source": "",
            "visible": false,
            "subIndicator": [{
              "de": [],
              "name": ["Male Condom"],
              "static_name": ["Male Condom"],
              "selectedDE": [],
              "color": "#8080ff",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Condom"
            }, {
              "de": [],
              "name": ["Female Condom"],
              "static_name": ["Female Condom"],
              "selectedDE": [],
              "color": "#800040",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Condom"
            }],
            "color": "#ff8000"
          }
        }, {
          "indicator": {
            "name": "Other Modern Methods",
            "static_name": "Other Modern Methods",
            "methodType": "Short Term",
            "source": "",
            "visible": false,
            "subIndicator": [{
              "de": [],
              "name": ["LAM"],
              "static_name": ["LAM"],
              "selectedDE": [],
              "color": "#78a095",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Other Modern Methods"
            }, {
              "de": [],
              "name": ["SDM (Standard Days)"],
              "static_name": ["SDM (Standard Days)"],
              "selectedDE": [],
              "color": "#78a095",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Other Modern Methods"
            }, {
              "de": [],
              "name": ["Vaginal barrier"],
              "static_name": ["Vaginal barrier"],
              "selectedDE": [],
              "color": "#78a095",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Other Modern Methods"
            }, {
              "de": [],
              "name": ["Spermicides"],
              "static_name": ["Spermicides"],
              "selectedDE": [],
              "color": "#78a095",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Other Modern Methods"
            }],
            "color": "#78a095"
          }
        }, {
          "indicator": {
            "name": "Emergency contraception",
            "static_name": "Emergency contraception",
            "methodType": "Short Term",
            "source": "",
            "visible": false,
            "subIndicator": [{
              "de": [],
              "name": ["EC"],
              "static_name": ["EC"],
              "selectedDE": [],
              "color": "#dd8ab8",
              "type": "data_element",
              "benchmarkingLogic": true,
              "key": "Emergency contraception"
            }],
            "color": "#dd8ab8"
          }
        }]
      }
    }
  }
}

export default barriers
