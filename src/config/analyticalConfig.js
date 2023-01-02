const metaConfig = {
  "adBenchmarkModule": {
    "Background_Data": {
      "SStoEMUType": "Yearly",
      "FPWomenPopulation": "MWRA",
      "SSDataRecentYear": "2018",
      "backgroundIndicators": [{
        "name": "Background Data Setup",
        "subIndicators": [{
          "name": "Population",
          "color": "#073c40",
          "selectedDE": [],
          "type": "data_element"
        }]
      }, {
        "name": "Prevalence Data",
        "subIndicators": [{
          "name": "DHS",
          "color": "#eec549",
          "selectedDE": [],
          "type": "data_element"
        }, {
          "name": "MICS",
          "color": "#b472d6",
          "selectedDE": [],
          "type": "data_element"
        }, {
          "name": "PMA/FPET",
          "color": "#df93ae",
          "selectedDE": [],
          "type": "data_element"
        }, {
          "name": "UNPD",
          "color": "#54c96d",
          "selectedDE": [],
          "type": "data_element"
        }]
      }, {
        "name": "Method Mix",
        "subIndicators": [{
          "name": "Most Recent Method Mix",
          "color": "#64c268",
          "selectedDE": [],
          "type": "data_element"
        }]
      }],
      "modernContraceptives": [{
        "name": "Public Sector",
        "subIndicators": [{
          "name": "Government Health facilities and home",
          "color": "#0000bb",
          "selectedDE": [],
          "type": "data_element"
        }]
      }, {
        "name": "Private Medical Sector",
        "subIndicators": [{
          "name": "NGO",
          "color": "#0000bb",
          "selectedDE": [],
          "type": "data_element"
        }, {
          "name": "Private Hospital/ Clinic Delivery",
          "color": "#0000bb",
          "selectedDE": [],
          "type": "data_indicator"
        }, {
          "name": "Pharmacy",
          "color": "#0000bb",
          "selectedDE": [],
          "type": "data_element"
        }]
      }, {
        "name": "Other Source",
        "subIndicators": [{
          "name": "Shop/ Church/ Friend",
          "color": "#0000bb",
          "selectedDE": [],
          "type": "data_element"
        }, {
          "name": "Other",
          "color": "#0000bb",
          "selectedDE": [],
          "type": "data_element"
        }]
      }],
      "fpSourceIndicators": [{
        "name": "Sterilization",
        "key": "Sterilization",
        "subIndicators": [{
          "name": "Tubal Ligation (F)",
          "selectedDE": [],
          "type": "data_element"
        }, {
          "name": "Vasectomy (M)",
          "selectedDE": [],
          "type": "data_element"
        }]
      }, {
        "name": "IUD",
        "key": "IUD",
        "subIndicators": [{
          "name": "Copper- T 380-A IUD",
          "selectedDE": [],
          "type": "data_element"
        }, {
          "name": "LNG-IUS",
          "selectedDE": [],
          "type": "data_element"
        }]
      }, {
        "name": "Implant",
        "key": "Implant",
        "subIndicators": [{
          "name": "Implanon",
          "selectedDE": [],
          "type": "data_element"
        }, {
          "name": "Jadelle",
          "selectedDE": [],
          "type": "data_element"
        }, {
          "name": "Sino-Implant",
          "selectedDE": [],
          "type": "data_element"
        }]
      }, {
        "name": "Injectable",
        "key": "Injectable",
        "subIndicators": [{
          "name": "Depo Provera (DMPA)",
          "selectedDE": [],
          "type": "data_element"
        }, {
          "name": "Noristerat (NET-En)",
          "selectedDE": [],
          "type": "data_element"
        }, {
          "name": "Lunelle",
          "selectedDE": [],
          "type": "data_element"
        }, {
          "name": "Sayana Press",
          "selectedDE": [],
          "type": "data_element"
        }, {
          "name": "Other Injectable",
          "selectedDE": [],
          "type": "data_element"
        }]
      }, {
        "name": "Pill",
        "key": "Pill",
        "subIndicators": [{
          "name": "Combined Oral",
          "selectedDE": [],
          "type": "data_element"
        }, {
          "name": "Progestin only",
          "selectedDE": [],
          "type": "data_element"
        }, {
          "name": "Other OC Pill",
          "selectedDE": [],
          "type": "data_element"
        }]
      }, {
        "name": "Condom",
        "key": "Condom",
        "subIndicators": [{
          "name": "Male Condom",
          "selectedDE": [],
          "type": "data_element"
        }, {
          "name": "Female Condom",
          "selectedDE": [],
          "type": "data_element"
        }]
      }, {
        "name": "Other Modern Methods",
        "key": "Other Modern Methods",
        "subIndicators": [{
          "name": "LAM",
          "selectedDE": [],
          "type": "data_element"
        }, {
          "name": "SDM (Standard Days)",
          "selectedDE": [],
          "type": "data_element"
        }, {
          "name": "Vaginal barrier",
          "selectedDE": [],
          "type": "data_element"
        }, {
          "name": "Spermicides",
          "selectedDE": [],
          "type": "data_element"
        }]
      }, {
        "name": "Emergency contraception",
        "key": "Emergency contraception",
        "subIndicators": [{
          "name": "EC",
          "selectedDE": [],
          "type": "data_element"
        }]
      }],
      "continuation": {
        "Tubal Ligation (F)": {
          "0": 1,
          "1": 1,
          "2": 1,
          "3": 1,
          "4": 1,
          "5": 1,
          "6": 1,
          "7": 1,
          "8": 1,
          "9": 1,
          "10": 0
        },
        "Vasectomy (M)": {
          "0": 1,
          "1": 1,
          "2": 1,
          "3": 1,
          "4": 1,
          "5": 1,
          "6": 1,
          "7": 1,
          "8": 1,
          "9": 1,
          "10": 0
        },
        "Copper- T 380-A IUD": {
          "0": 1,
          "1": 0.839788868,
          "2": 0.705245343,
          "3": 0.592257188,
          "4": 0.497370994,
          "5": 0.417686624,
          "6": 0.350768577,
          "7": 0.294571546,
          "8": 0.247377905,
          "9": 0.207745211,
          "10": 0.16735418915405
        },
        "LNG-IUS": {
          "0": 1,
          "1": 0.839788868,
          "2": 0.705245343,
          "3": 0.592257188,
          "4": 0.497370994,
          "5": 0.417686624,
          "6": 0,
          "7": 0,
          "8": 0,
          "9": 0,
          "10": 0
        },
        "Implanon": {
          "0": 1,
          "1": 0.873266293487834,
          "2": 0.762594019341979,
          "3": 0.66594765270676,
          "4": 0,
          "5": 0,
          "6": 0,
          "7": 0,
          "8": 0,
          "9": 0,
          "10": 0
        },
        "Sino-Implant": {
          "0": 1,
          "1": 0.873266293487834,
          "2": 0.762594019341979,
          "3": 0.66594765270676,
          "4": 0.581549638336155,
          "5": 0,
          "6": 0,
          "7": 0,
          "8": 0,
          "9": 0,
          "10": 0
        },
        "Jadelle": {
          "0": 1,
          "1": 0.873266293487834,
          "2": 0.762594019341979,
          "3": 0.66594765270676,
          "4": 0.581549638336155,
          "5": 0.507847697149004,
          "6": 0,
          "7": 0,
          "8": 0,
          "9": 0,
          "10": 0
        }
      }
    },
    "Commodities_Client": {
      "chartOptions": {
        "chart": {
          "type": "Column",
          "container": "chartContainer1"
        },
        "title": {
          "text": "",
          "title": "Commodities",
          "visible": false
        },
        "subTitle": {
          "text": "",
          "subTitle": "",
          "visible": false
        },
        "xAxis": {
          "title": {
            "text": ""
          },
          "visible": false
        },
        "yAxis": {
          "title": {
            "text": "Value(s)"
          },
          "visible": true
        }
      },
      "dataLabels": {
        "enabled": false
      },
      "trend": {
        "type": "Linear",
        "target": ""
      },
      "range": {
        "min": "",
        "max": "",
        "decimal": ""
      },
      "alert": {
        "name": "",
        "definition": "Average"
      },
      "sortOptions": "Asc",
      "chartData": [{
        "indicator": {
          "name": "Sterilization",
          "source": "Commodities distributed to client",
          "color": "#c87776",
          "visible": true,
          "subIndicator": [{
            "de": [],
            "name": ["Tubal Ligation (F)"],
            "selectedDE": [],
            "color": "#c87776",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Sterilization",
            "cyp": "10",
            "static_name": ["Tubal Ligation (F)"]
          }, {
            "de": [],
            "name": ["Vasectomy (M)"],
            "selectedDE": [],
            "color": "#c87776",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Sterilization",
            "cyp": "10",
            "static_name": ["Vasectomy (M)"]
          }],
          "static_name": "Sterilization",
          "methodType": "Long Term"
        }
      }, {
        "indicator": {
          "name": "IUD",
          "source": "Commodities distributed to client",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Copper- T 380-A IUD"],
            "selectedDE": [],
            "color": "#47c49a",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "IUD",
            "cyp": "4.6",
            "static_name": ["Copper- T 380-A IUD"]
          }, {
            "de": [],
            "name": ["LNG-IUS"],
            "selectedDE": [],
            "color": "#47c49a",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "IUD",
            "cyp": "3.3",
            "static_name": ["LNG-IUS"]
          }],
          "color": "#47c49a",
          "static_name": "IUD",
          "methodType": "Long Term"
        }
      }, {
        "indicator": {
          "name": "Implant",
          "source": "Commodities distributed to client",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Implanon"],
            "selectedDE": [],
            "color": "#8DC645",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Implant",
            "cyp": "2.5",
            "static_name": ["Implanon"]
          }, {
            "de": [],
            "name": ["Jadelle"],
            "selectedDE": [],
            "color": "#8DC645",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Implant",
            "cyp": "3.8",
            "static_name": ["Jadelle"]
          }, {
            "de": [],
            "name": ["Sino-Implant"],
            "selectedDE": [],
            "color": "#8DC645",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Implant",
            "cyp": "3.2",
            "static_name": ["Sino-Implant"]
          }],
          "static_name": "Implant",
          "methodType": "Long Term"
        }
      }, {
        "indicator": {
          "name": "Injectable",
          "source": "Commodities distributed to client",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Depo Provera (DMPA)"],
            "selectedDE": [],
            "color": "#5287cd",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Injectable",
            "cyp": "0.25",
            "static_name": ["Depo Provera (DMPA)"]
          }, {
            "de": [],
            "name": ["Noristerat (NET-En)"],
            "selectedDE": [],
            "color": "#5287cd",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Injectable",
            "cyp": "0.1666666667",
            "static_name": ["Noristerat (NET-En)"]
          }, {
            "de": [],
            "name": ["Lunelle"],
            "selectedDE": [],
            "color": "#5287cd",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Injectable",
            "cyp": "0.07692307692",
            "static_name": ["Lunelle"]
          }, {
            "de": [],
            "name": ["Sayana Press"],
            "selectedDE": [],
            "color": "#5287cd",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Injectable",
            "cyp": "0.25",
            "static_name": ["Sayana Press"]
          }, {
            "de": [],
            "name": ["Other Injectable"],
            "selectedDE": [],
            "color": "#5287cd",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Injectable",
            "cyp": "0.25",
            "static_name": ["Other Injectable"]
          }],
          "static_name": "Injectable",
          "methodType": "Short Term"
        }
      }, {
        "indicator": {
          "name": "Pill",
          "source": "Commodities distributed to client",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Combined Oral"],
            "selectedDE": [],
            "color": "#70aedf",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Pill",
            "cyp": "0.06666666667",
            "static_name": ["Combined Oral"]
          }, {
            "de": [],
            "name": ["Progestin only"],
            "selectedDE": [],
            "color": "#70aedf",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Pill",
            "cyp": "0.06666666667",
            "static_name": ["Progestin only"]
          }, {
            "de": [],
            "name": ["Other OC Pill"],
            "selectedDE": [],
            "color": "#70aedf",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Pill",
            "cyp": "0.06666666667",
            "static_name": ["Other OC Pill"]
          }],
          "static_name": "Pill",
          "methodType": "Short Term"
        }
      }, {
        "indicator": {
          "name": "Condom",
          "source": "Commodities distributed to client",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Male Condom"],
            "selectedDE": [],
            "color": "#fcb241",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Condom",
            "cyp": "0.008333333333",
            "static_name": ["Male Condom"]
          }, {
            "de": [],
            "name": ["Female Condom"],
            "selectedDE": [],
            "color": "#fcb241",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Condom",
            "cyp": "0.008333333333",
            "static_name": ["Female Condom"]
          }],
          "static_name": "Condom",
          "methodType": "Short Term"
        }
      }, {
        "indicator": {
          "name": "Other Modern Methods",
          "source": "Commodities distributed to client",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["LAM"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Other Modern Methods",
            "cyp": "0.25",
            "static_name": ["LAM"]
          }, {
            "de": [],
            "name": ["SDM (Standard Days)"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Other Modern Methods",
            "cyp": "1.5",
            "static_name": ["SDM (Standard Days)"]
          }, {
            "de": [],
            "name": ["Vaginal barrier"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Other Modern Methods",
            "cyp": "1",
            "static_name": ["Vaginal barrier"]
          }, {
            "de": [],
            "name": ["Spermicides"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Other Modern Methods",
            "cyp": "0.008333333333",
            "static_name": ["Spermicides"]
          }],
          "static_name": "Other Modern Methods",
          "methodType": "Short Term"
        }
      }, {
        "indicator": {
          "name": "Emergency contraception",
          "source": "Commodities distributed to client",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["EC"],
            "selectedDE": [],
            "color": "#dd8ab8",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Emergency contraception",
            "cyp": "0.05",
            "static_name": ["EC"]
          }],
          "static_name": "Emergency contraception",
          "methodType": "Short Term"
        }
      }, {
        "indicator": {
          "name": "Total CYP",
          "source": "Commodities distributed to client",
          "static_name": "Total CYP",
          "methodType": "Short Term",
          "subIndicator": [],
          "color": "#439aa3"
        }
      }],
      "dataOnContraceptive": "Yes",
      "source": "",
      "reportingSector": "Public Only",
      "FPSource": {
        "governmentHealth": "Yes",
        "ngo": "Yes",
        "privateHospital": "No",
        "pharmacy": "Yes",
        "shopChurchFriend": "Yes",
        "otherSector": "No"
      }
    },
    "Commodities_Facilities": {
      "chartOptions": {
        "chart": {
          "type": "Column",
          "container": "chartContainer1"
        },
        "title": {
          "text": "",
          "title": "Commodities",
          "visible": false
        },
        "subTitle": {
          "text": "",
          "subTitle": "",
          "visible": false
        },
        "xAxis": {
          "title": {
            "text": ""
          },
          "visible": false
        },
        "yAxis": {
          "title": {
            "text": "Value(s)"
          },
          "visible": true
        }
      },
      "dataLabels": {
        "enabled": false
      },
      "trend": {
        "type": "Linear",
        "target": ""
      },
      "range": {
        "min": "",
        "max": "",
        "decimal": ""
      },
      "alert": {
        "name": "",
        "definition": "Average"
      },
      "sortOptions": "Asc",
      "chartData": [{
        "indicator": {
          "name": "Sterilization",
          "source": "Commodities distributed to facilities",
          "color": "#c87776",
          "visible": true,
          "subIndicator": [{
            "de": [],
            "name": ["Tubal Ligation (F)"],
            "selectedDE": [],
            "color": "#c87776",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Sterilization",
            "cyp": "10",
            "static_name": ["Tubal Ligation (F)"]
          }, {
            "de": [],
            "name": ["Vasectomy (M)"],
            "selectedDE": [],
            "color": "#c87776",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Sterilization",
            "cyp": "10",
            "static_name": ["Vasectomy (M)"]
          }],
          "static_name": "Sterilization",
          "methodType": "Long Term"
        }
      }, {
        "indicator": {
          "name": "IUD",
          "source": "Commodities distributed to facilities",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Copper- T 380-A IUD"],
            "selectedDE": [],
            "color": "#47c49a",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "IUD",
            "cyp": "4.6",
            "static_name": ["Copper- T 380-A IUD"]
          }, {
            "de": [],
            "name": ["LNG-IUS"],
            "selectedDE": [],
            "color": "#47c49a",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "IUD",
            "cyp": "3.3",
            "static_name": ["LNG-IUS"]
          }],
          "static_name": "IUD",
          "methodType": "Long Term"
        }
      }, {
        "indicator": {
          "name": "Implant",
          "source": "Commodities distributed to facilities",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Implanon"],
            "selectedDE": [],
            "color": "#8DC645",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Implant",
            "cyp": "2.5",
            "static_name": ["Implanon"]
          }, {
            "de": [],
            "name": ["Jadelle"],
            "selectedDE": [],
            "color": "#8DC645",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Implant",
            "cyp": "3.8",
            "static_name": ["Jadelle"]
          }, {
            "de": [],
            "name": ["Sino-Implant"],
            "selectedDE": [],
            "color": "#8DC645",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Implant",
            "cyp": "3.2",
            "static_name": ["Sino-Implant"]
          }],
          "static_name": "Implant",
          "methodType": "Long Term"
        }
      }, {
        "indicator": {
          "name": "Injectable",
          "source": "Commodities distributed to facilities",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Depo Provera (DMPA)"],
            "selectedDE": [],
            "color": "#5287cd",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Injectable",
            "cyp": "0.25",
            "static_name": ["Depo Provera (DMPA)"]
          }, {
            "de": [],
            "name": ["Noristerat (NET-En)"],
            "selectedDE": [],
            "color": "#5287cd",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Injectable",
            "cyp": "0.1666666667",
            "static_name": ["Noristerat (NET-En)"]
          }, {
            "de": [],
            "name": ["Lunelle"],
            "selectedDE": [],
            "color": "#5287cd",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Injectable",
            "cyp": "0.07692307692",
            "static_name": ["Lunelle"]
          }, {
            "de": [],
            "name": ["Sayana Press"],
            "selectedDE": [],
            "color": "#5287cd",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Injectable",
            "cyp": "0.25",
            "static_name": ["Sayana Press"]
          }, {
            "de": [],
            "name": ["Other Injectable"],
            "selectedDE": [],
            "color": "#5287cd",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Injectable",
            "cyp": "0.25",
            "static_name": ["Other Injectable"]
          }],
          "static_name": "Injectable",
          "methodType": "Short Term"
        }
      }, {
        "indicator": {
          "name": "Pill",
          "source": "Commodities distributed to facilities",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Combined Oral"],
            "selectedDE": [],
            "color": "#70aedf",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Pill",
            "cyp": "0.06666666667",
            "static_name": ["Combined Oral"]
          }, {
            "de": [],
            "name": ["Progestin only"],
            "selectedDE": [],
            "color": "#70aedf",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Pill",
            "cyp": "0.06666666667",
            "static_name": ["Progestin only"]
          }, {
            "de": [],
            "name": ["Other OC Pill"],
            "selectedDE": [],
            "color": "#70aedf",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Pill",
            "cyp": "0.06666666667",
            "static_name": ["Other OC Pill"]
          }],
          "static_name": "Pill",
          "methodType": "Short Term"
        }
      }, {
        "indicator": {
          "name": "Condom",
          "source": "Commodities distributed to facilities",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Male Condom"],
            "selectedDE": [],
            "color": "#fcb241",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Condom",
            "cyp": "0.008333333333",
            "static_name": ["Male Condom"]
          }, {
            "de": [],
            "name": ["Female Condom"],
            "selectedDE": [],
            "color": "#fcb241",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Condom",
            "cyp": "0.008333333333",
            "static_name": ["Female Condom"]
          }],
          "static_name": "Condom",
          "methodType": "Short Term"
        }
      }, {
        "indicator": {
          "name": "Other Modern Methods",
          "source": "Commodities distributed to facilities",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["LAM"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Other Modern Methods",
            "cyp": "0.25",
            "static_name": ["LAM"]
          }, {
            "de": [],
            "name": ["SDM (Standard Days)"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Other Modern Methods",
            "cyp": "1.5",
            "static_name": ["SDM (Standard Days)"]
          }, {
            "de": [],
            "name": ["Vaginal barrier"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Other Modern Methods",
            "cyp": "1",
            "static_name": ["Vaginal barrier"]
          }, {
            "de": [],
            "name": ["Spermicides"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Other Modern Methods",
            "cyp": "0.008333333333",
            "static_name": ["Spermicides"]
          }],
          "static_name": "Other Modern Methods",
          "methodType": "Short Term"
        }
      }, {
        "indicator": {
          "name": "Emergency contraception",
          "source": "Commodities distributed to facilities",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["EC"],
            "selectedDE": [],
            "color": "#dd8ab8",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Emergency contraception",
            "cyp": "0.05",
            "static_name": ["EC"]
          }],
          "static_name": "Emergency contraception",
          "methodType": "Short Term"
        }
      }, {
        "indicator": {
          "name": "Total CYP",
          "source": "Commodities distributed to facilities",
          "static_name": "Total CYP",
          "methodType": "Short Term",
          "subIndicator": [],
          "color": "#439aa3"
        }
      }],
      "dataOnContraceptive": "Yes",
      "source": "",
      "reportingSector": "Public Only",
      "FPSource": {
        "governmentHealth": "Yes",
        "ngo": "Yes",
        "privateHospital": "No",
        "pharmacy": "Yes",
        "shopChurchFriend": "Yes",
        "otherSector": "No"
      }
    },
    "Visits": {
      "chartOptions": {
        "chart": {
          "type": "Column",
          "container": "chartContainer1"
        },
        "title": {
          "text": "",
          "title": "Visits",
          "visible": false
        },
        "subTitle": {
          "text": "",
          "subTitle": "",
          "visible": false
        },
        "xAxis": {
          "title": {
            "text": ""
          },
          "visible": false
        },
        "yAxis": {
          "title": {
            "text": "Value(s)"
          },
          "visible": true
        }
      },
      "dataLabels": {
        "enabled": false
      },
      "trend": {
        "type": "Linear",
        "target": ""
      },
      "range": {
        "min": "",
        "max": "",
        "decimal": ""
      },
      "alert": {
        "name": "",
        "definition": "Average"
      },
      "sortOptions": "Asc",
      "chartData": [{
        "indicator": {
          "name": "Sterilization",
          "source": "FP Visits",
          "color": "#c87776",
          "visible": true,
          "subIndicator": [{
            "de": [],
            "name": ["Tubal Ligation (F)"],
            "selectedDE": [],
            "color": "#c87776",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Sterilization",
            "cyp": "10",
            "static_name": ["Tubal Ligation (F)"]
          }, {
            "de": [],
            "name": ["Vasectomy (M)"],
            "selectedDE": [],
            "color": "#c87776",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Sterilization",
            "cyp": "10",
            "static_name": ["Vasectomy (M)"]
          }],
          "static_name": "Sterilization",
          "methodType": "Long Term"
        }
      }, {
        "indicator": {
          "name": "IUD",
          "source": "FP Visits",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Copper- T 380-A IUD"],
            "selectedDE": [],
            "color": "#47c49a",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "IUD",
            "cyp": "4.6",
            "static_name": ["Copper- T 380-A IUD"]
          }, {
            "de": [],
            "name": ["LNG-IUS"],
            "selectedDE": [],
            "color": "#47c49a",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "IUD",
            "cyp": "3.3",
            "static_name": ["LNG-IUS"]
          }],
          "static_name": "IUD",
          "methodType": "Long Term"
        }
      }, {
        "indicator": {
          "name": "Implant",
          "source": "FP Visits",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Implanon"],
            "selectedDE": [],
            "color": "#8DC645",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Implant",
            "cyp": "2.5",
            "static_name": ["Implanon"]
          }, {
            "de": [],
            "name": ["Jadelle"],
            "selectedDE": [],
            "color": "#8DC645",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Implant",
            "cyp": "3.8",
            "static_name": ["Jadelle"]
          }, {
            "de": [],
            "name": ["Sino-Implant"],
            "selectedDE": [],
            "color": "#8DC645",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Implant",
            "cyp": "3.2",
            "static_name": ["Sino-Implant"]
          }],
          "static_name": "Implant",
          "methodType": "Long Term"
        }
      }, {
        "indicator": {
          "name": "Injectable",
          "source": "FP Visits",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Depo Provera (DMPA)"],
            "selectedDE": [],
            "color": "#5287cd",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Injectable",
            "cyp": "0.25",
            "static_name": ["Depo Provera (DMPA)"]
          }, {
            "de": [],
            "name": ["Noristerat (NET-En)"],
            "selectedDE": [],
            "color": "#5287cd",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Injectable",
            "cyp": "0.1666666667",
            "static_name": ["Noristerat (NET-En)"]
          }, {
            "de": [],
            "name": ["Lunelle"],
            "selectedDE": [],
            "color": "#5287cd",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Injectable",
            "cyp": "0.07692307692",
            "static_name": ["Lunelle"]
          }, {
            "de": [],
            "name": ["Sayana Press"],
            "selectedDE": [],
            "color": "#5287cd",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Injectable",
            "cyp": "0.25",
            "static_name": ["Sayana Press"]
          }, {
            "de": [],
            "name": ["Other Injectable"],
            "selectedDE": [],
            "color": "#5287cd",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Injectable",
            "cyp": "0.25",
            "static_name": ["Other Injectable"]
          }],
          "static_name": "Injectable",
          "methodType": "Short Term"
        }
      }, {
        "indicator": {
          "name": "Pill",
          "source": "FP Visits",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Combined Oral"],
            "selectedDE": [],
            "color": "#70aedf",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Pill",
            "cyp": "0.25",
            "static_name": ["Combined Oral"]
          }, {
            "de": [],
            "name": ["Progestin only"],
            "selectedDE": [],
            "color": "#70aedf",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Pill",
            "cyp": "0.066666667",
            "static_name": ["Progestin only"]
          }, {
            "de": [],
            "name": ["Other OC Pill"],
            "selectedDE": [],
            "color": "#70aedf",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Pill",
            "cyp": "0.25",
            "static_name": ["Other OC Pill"]
          }],
          "static_name": "Pill",
          "methodType": "Short Term"
        }
      }, {
        "indicator": {
          "name": "Condom",
          "source": "FP Visits",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Male Condom"],
            "selectedDE": [],
            "color": "#fcb241",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Condom",
            "cyp": "0.008333333",
            "static_name": ["Male Condom"]
          }, {
            "de": [],
            "name": ["Female Condom"],
            "selectedDE": [],
            "color": "#fcb241",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Condom",
            "cyp": "0.25",
            "static_name": ["Female Condom"]
          }],
          "static_name": "Condom",
          "methodType": "Short Term"
        }
      }, {
        "indicator": {
          "name": "Other Modern Methods",
          "source": "FP Visits",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["LAM"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Other Modern Methods",
            "cyp": "1",
            "static_name": ["LAM"]
          }, {
            "de": [],
            "name": ["SDM (Standard Days)"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Other Modern Methods",
            "cyp": "1",
            "static_name": ["SDM (Standard Days)"]
          }, {
            "de": [],
            "name": ["Vaginal barrier"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Other Modern Methods",
            "cyp": "1",
            "static_name": ["Vaginal barrier"]
          }, {
            "de": [],
            "name": ["Spermicides"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Other Modern Methods",
            "cyp": "0.25",
            "static_name": ["Spermicides"]
          }],
          "static_name": "Other Modern Methods",
          "methodType": "Short Term"
        }
      }, {
        "indicator": {
          "name": "Emergency contraception",
          "source": "FP Visits",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["EC"],
            "selectedDE": [],
            "color": "#dd8ab8",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Emergency contraception",
            "cyp": "0.05",
            "static_name": ["EC"]
          }],
          "static_name": "Emergency contraception",
          "methodType": "Short Term"
        }
      }, {
        "indicator": {
          "name": "Total CYP",
          "source": "FP Visits",
          "static_name": "Total CYP",
          "methodType": "Short Term",
          "subIndicator": [],
          "color": "#439aa3"
        }
      }],
      "dataOnContraceptive": "Yes",
      "source": "",
      "reportingSector": "Public Only",
      "FPSource": {
        "governmentHealth": "Partially",
        "ngo": "Yes",
        "privateHospital": "No",
        "pharmacy": "Yes",
        "shopChurchFriend": "Yes",
        "otherSector": "No"
      }
    },
    "User": {
      "chartOptions": {
        "chart": {
          "type": "Column",
          "container": "chartContainer1"
        },
        "title": {
          "text": "",
          "title": "Visits",
          "visible": false
        },
        "subTitle": {
          "text": "",
          "subTitle": "",
          "visible": false
        },
        "xAxis": {
          "title": {
            "text": ""
          },
          "visible": false
        },
        "yAxis": {
          "title": {
            "text": "Value(s)"
          },
          "visible": true
        }
      },
      "dataLabels": {
        "enabled": false
      },
      "trend": {
        "type": "Linear",
        "target": ""
      },
      "range": {
        "min": "",
        "max": "",
        "decimal": ""
      },
      "alert": {
        "name": "",
        "definition": "Average"
      },
      "sortOptions": "Asc",
      "chartData": [{
        "indicator": {
          "name": "Sterilization",
          "source": "Users",
          "color": "#c87776",
          "visible": true,
          "subIndicator": [{
            "de": [],
            "name": ["Tubal Ligation (F)"],
            "selectedDE": [],
            "color": "#c87776",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Sterilization",
            "cyp": "10",
            "static_name": ["Tubal Ligation (F)"]
          }, {
            "de": [],
            "name": ["Vasectomy (M)"],
            "selectedDE": [],
            "color": "#c87776",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Sterilization",
            "cyp": "10",
            "static_name": ["Vasectomy (M)"]
          }],
          "static_name": "Sterilization",
          "methodType": "Long Term"
        }
      }, {
        "indicator": {
          "name": "IUD",
          "source": "Users",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Copper- T 380-A IUD"],
            "selectedDE": [],
            "color": "#47c49a",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "IUD",
            "cyp": "4.6",
            "static_name": ["Copper- T 380-A IUD"]
          }, {
            "de": [],
            "name": ["LNG-IUS"],
            "selectedDE": [],
            "color": "#47c49a",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "IUD",
            "cyp": "3.3",
            "static_name": ["LNG-IUS"]
          }],
          "static_name": "IUD",
          "methodType": "Long Term"
        }
      }, {
        "indicator": {
          "name": "Implant",
          "source": "Users",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Implanon"],
            "selectedDE": [],
            "color": "#8DC645",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Implant",
            "cyp": "2.5",
            "static_name": ["Implanon"]
          }, {
            "de": [],
            "name": ["Jadelle"],
            "selectedDE": [],
            "color": "#8DC645",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Implant",
            "cyp": "3.8",
            "static_name": ["Jadelle"]
          }, {
            "de": [],
            "name": ["Sino-Implant"],
            "selectedDE": [],
            "color": "#8DC645",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Implant",
            "cyp": "3.2",
            "static_name": ["Sino-Implant"]
          }],
          "static_name": "Implant",
          "methodType": "Long Term"
        }
      }, {
        "indicator": {
          "name": "Injectable",
          "source": "Users",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Depo Provera (DMPA)"],
            "selectedDE": [],
            "color": "#5287cd",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Injectable",
            "cyp": "0.25",
            "static_name": ["Depo Provera (DMPA)"]
          }, {
            "de": [],
            "name": ["Noristerat (NET-En)"],
            "selectedDE": [],
            "color": "#5287cd",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Injectable",
            "cyp": "0.1666666667",
            "static_name": ["Noristerat (NET-En)"]
          }, {
            "de": [],
            "name": ["Lunelle"],
            "selectedDE": [],
            "color": "#5287cd",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Injectable",
            "cyp": "0.07692307692",
            "static_name": ["Lunelle"]
          }, {
            "de": [],
            "name": ["Sayana Press"],
            "selectedDE": [],
            "color": "#5287cd",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Injectable",
            "cyp": "0.25",
            "static_name": ["Sayana Press"]
          }, {
            "de": [],
            "name": ["Other Injectable"],
            "selectedDE": [],
            "color": "#5287cd",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Injectable",
            "cyp": "0.25",
            "static_name": ["Other Injectable"]
          }],
          "static_name": "Injectable",
          "methodType": "Short Term"
        }
      }, {
        "indicator": {
          "name": "Pill",
          "source": "Users",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Combined Oral"],
            "selectedDE": [],
            "color": "#70aedf",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Pill",
            "cyp": "0.06666666667",
            "static_name": ["Combined Oral"]
          }, {
            "de": [],
            "name": ["Progestin only"],
            "selectedDE": [],
            "color": "#70aedf",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Pill",
            "cyp": "0.06666666667",
            "static_name": ["Progestin only"]
          }, {
            "de": [],
            "name": ["Other OC Pill"],
            "selectedDE": [],
            "color": "#70aedf",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Pill",
            "cyp": "0.06666666667",
            "static_name": ["Other OC Pill"]
          }],
          "static_name": "Pill",
          "methodType": "Short Term"
        }
      }, {
        "indicator": {
          "name": "Condom",
          "source": "Users",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["Male Condom"],
            "selectedDE": [],
            "color": "#fcb241",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Condom",
            "cyp": "0.008333333333",
            "static_name": ["Male Condom"]
          }, {
            "de": [],
            "name": ["Female Condom"],
            "selectedDE": [],
            "color": "#fcb241",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Condom",
            "cyp": "0.008333333333",
            "static_name": ["Female Condom"]
          }],
          "static_name": "Condom",
          "methodType": "Short Term"
        }
      }, {
        "indicator": {
          "name": "Other Modern Methods",
          "source": "Users",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["LAM"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Other Modern Methods",
            "cyp": "0.25",
            "static_name": ["LAM"]
          }, {
            "de": [],
            "name": ["SDM (Standard Days)"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Other Modern Methods",
            "cyp": "1.5",
            "static_name": ["SDM (Standard Days)"]
          }, {
            "de": [],
            "name": ["Vaginal barrier"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Other Modern Methods",
            "cyp": "1",
            "static_name": ["Vaginal barrier"]
          }, {
            "de": [],
            "name": ["Spermicides"],
            "selectedDE": [],
            "color": "#78a095",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Other Modern Methods",
            "cyp": "0.008333333333",
            "static_name": ["Spermicides"]
          }],
          "static_name": "Other Modern Methods",
          "methodType": "Short Term"
        }
      }, {
        "indicator": {
          "name": "Emergency contraception",
          "source": "Users",
          "visible": false,
          "subIndicator": [{
            "de": [],
            "name": ["EC"],
            "selectedDE": [],
            "color": "#dd8ab8",
            "type": "data_element",
            "benchmarkingLogic": false,
            "key": "Emergency contraception",
            "cyp": "0.05",
            "static_name": ["EC"]
          }],
          "static_name": "Emergency contraception",
          "methodType": "Short Term"
        }
      }, {
        "indicator": {
          "name": "Total CYP",
          "source": "Users",
          "static_name": "Total CYP",
          "methodType": "Short Term",
          "subIndicator": [],
          "color": "#439aa3"
        }
      }],
      "dataOnContraceptive": "Yes",
      "source": "",
      "reportingSector": "Public Only",
      "FPSource": {
        "governmentHealth": "Yes",
        "ngo": "Yes",
        "privateHospital": "No",
        "pharmacy": "Yes",
        "shopChurchFriend": "Yes",
        "otherSector": "No"
      }
    }
  }
}

export default metaConfig
