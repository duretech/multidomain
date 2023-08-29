const dqrConfig = {
  dqrModule: {
    emu: {
      Background_Data: {
        SStoEMUType: "Yearly",
        FPWomenPopulation: "MWRA",
        startingYear: "2013",
        SSDataRecentYear: "2023",
        defaultEMU: "Commodities_Client",
        bgDataSource: "Datastore",
        defaultDataType: [],
        emuSaveType: "Custom",
        adjustmentFactor: "No",
        locArr: [],
        backgroundIndicators: [
          {
            name: "Background Data Setup",
            static_name: "Background Data Setup",
            subIndicators: [
              {
                name: "Population",
                color: "#073c40",
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "population",
                    displayName: "population",
                    static_displayName: "",
                  },
                ],
                type: "data_element",
                static_name: "Population",
              },
            ],
          },
          {
            name: "Prevalence Data",
            static_name: "Prevalence Data",
            subIndicators: [
              {
                name: "DHS",
                color: "#eec549",
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "mcpr_dhs",
                    displayName: "mcpr_dhs",
                    static_displayName: "",
                  },
                ],
                type: "data_element",
                static_name: "DHS",
              },
              {
                name: "MICS",
                color: "#b472d6",
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "mcpr_mics",
                    displayName: "mcpr_mics",
                    static_displayName: "",
                  },
                ],
                type: "data_element",
                static_name: "MICS",
              },
              {
                name: "FPET",
                color: "#df93ae",
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "mcpr_fpet",
                    displayName: "mcpr_fpet",
                    static_displayName: "",
                  },
                ],
                type: "data_element",
                static_name: "FPET",
              },
              {
                name: "UNPD",
                color: "#54c96d",
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "mcpr_unpd",
                    displayName: "mcpr_unpd",
                    static_displayName: "",
                  },
                ],
                type: "data_element",
                static_name: "UNPD",
              },
              {
                name: "PMA",
                color: "#ff896a",
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "mcpr_pma",
                    displayName: "mcpr_pma",
                    static_displayName: "",
                  },
                ],
                type: "data_element",
                static_name: "PMA",
              },
            ],
          },
          {
            name: "Method Mix",
            static_name: "Method Mix",
            subIndicators: [
              {
                name: "Most Recent Method Mix",
                static_name: "Most Recent Method Mix",
                color: "#64c268",
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "mcmm_sterilization_male",
                    displayName: "mcmm_sterilization_male",
                    static_displayName: "",
                  },
                  {
                    id: "mcmm_sterilization_female",
                    displayName: "mcmm_sterilization_female",
                    static_displayName: "",
                  },
                  {
                    id: "mcmm_iud",
                    displayName: "mcmm_iud",
                    static_displayName: "",
                  },
                  {
                    id: "mcmm_implant",
                    displayName: "mcmm_implant",
                    static_displayName: "",
                  },
                  {
                    id: "mcmm_injectable",
                    displayName: "mcmm_injectable",
                    static_displayName: "",
                  },
                  {
                    id: "mcmm_oc_pills",
                    displayName: "mcmm_oc_pills",
                    static_displayName: "",
                  },
                  {
                    id: "mcmm_condom_m_f",
                    displayName: "mcmm_condom_m_f",
                    static_displayName: "",
                  },
                  {
                    id: "mcmm_other_modern_method",
                    displayName: "mcmm_other_modern_method",
                    static_displayName: "",
                  },
                  {
                    id: "mcmm_lam",
                    displayName: "mcmm_lam",
                    static_displayName: "",
                  },
                ],
                type: "data_element",
              },
            ],
          },
        ],
        modernContraceptives: [
          {
            name: "Public Sector",
            static_name: "Public Sector",
            subIndicators: [
              {
                name: "Government Health facilities and Home",
                color: "#0000bb",
                selectedDE: [],
                type: "data_element",
                static_name: "Government Health facilities and Home",
              },
            ],
          },
          {
            name: "Private Medical Sector",
            static_name: "Private Medical Sector",
            subIndicators: [
              {
                name: "NGO",
                color: "#0000bb",
                selectedDE: [],
                type: "data_element",
                static_name: "NGO",
              },
              {
                name: "Private Hospital/ Clinic Delivery",
                color: "#0000bb",
                selectedDE: [],
                type: "data_indicator",
                static_name: "Private Hospital/ Clinic Delivery",
              },
              {
                name: "Pharmacy",
                color: "#0000bb",
                selectedDE: [],
                type: "data_element",
                static_name: "Pharmacy",
              },
            ],
          },
          {
            name: "Other Source",
            static_name: "Other Source",
            subIndicators: [
              {
                name: "Shop/ Church/ Friend",
                color: "#0000bb",
                selectedDE: [],
                type: "data_element",
                static_name: "Shop/ Church/ Friend",
              },
              {
                name: "Other",
                color: "#0000bb",
                selectedDE: [],
                type: "data_element",
                static_name: "Other",
              },
            ],
          },
        ],
        fpSourceIndicators: [
          {
            name: "Sterilization",
            static_name: "Sterilization",
            key: "Sterilization",
            subIndicators: [
              {
                name: "Tubal Ligation (F)",
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "psa_sterilization_female Public Sector",
                    displayName: "psa_sterilization_female Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "psa_sterilization_female Private Sector NGO",
                    displayName: "psa_sterilization_female Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "psa_sterilization_female Private Sector Pharmacy",
                    displayName:
                      "psa_sterilization_female Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "psa_sterilization_female Private Sector Hospital",
                    displayName:
                      "psa_sterilization_female Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "psa_sterilization_female Other Sector Other",
                    displayName: "psa_sterilization_female Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "psa_sterilization_female Other Sector Shop",
                    displayName: "psa_sterilization_female Other Sector Shop",
                    static_displayName: "",
                  },
                ],
                type: "data_element",
                static_name: "Tubal Ligation (F)",
              },
              {
                name: "Vasectomy (M)",
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "psa_sterilization_male Public Sector",
                    displayName: "psa_sterilization_male Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "psa_sterilization_male Private Sector NGO",
                    displayName: "psa_sterilization_male Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "psa_sterilization_male Private Sector Pharmacy",
                    displayName:
                      "psa_sterilization_male Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "psa_sterilization_male Private Sector Hospital",
                    displayName:
                      "psa_sterilization_male Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "psa_sterilization_male Other Sector Other",
                    displayName: "psa_sterilization_male Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "psa_sterilization_male Other Sector Shop",
                    displayName: "psa_sterilization_male Other Sector Shop",
                    static_displayName: "",
                  },
                ],
                type: "data_element",
                static_name: "Vasectomy (M)",
              },
            ],
          },
          {
            name: "IUD",
            static_name: "IUD",
            key: "IUD",
            subIndicators: [
              {
                name: "Copper- T 380-A IUD",
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "psa_iud_coppert Public Sector",
                    displayName: "psa_iud_coppert Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "psa_iud_coppert Private Sector NGO",
                    displayName: "psa_iud_coppert Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "psa_iud_coppert Private Sector Pharmacy",
                    displayName: "psa_iud_coppert Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "psa_iud_coppert Private Sector Hospital",
                    displayName: "psa_iud_coppert Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "psa_iud_coppert Other Sector Other",
                    displayName: "psa_iud_coppert Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "psa_iud_coppert Other Sector Shop",
                    displayName: "psa_iud_coppert Other Sector Shop",
                    static_displayName: "",
                  },
                ],
                type: "data_element",
                static_name: "Copper- T 380-A IUD",
              },
              {
                name: "LNG-IUS",
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "psa_iud_lng_ius Public Sector",
                    displayName: "psa_iud_lng_ius Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "psa_iud_lng_ius Private Sector NGO",
                    displayName: "psa_iud_lng_ius Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "psa_iud_lng_ius Private Sector Pharmacy",
                    displayName: "psa_iud_lng_ius Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "psa_iud_lng_ius Private Sector Hospital",
                    displayName: "psa_iud_lng_ius Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "psa_iud_lng_ius Other Sector Other",
                    displayName: "psa_iud_lng_ius Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "psa_iud_lng_ius Other Sector Shop",
                    displayName: "psa_iud_lng_ius Other Sector Shop",
                    static_displayName: "",
                  },
                ],
                type: "data_element",
                static_name: "LNG-IUS",
              },
            ],
          },
          {
            name: "Implant",
            static_name: "Implant",
            key: "Implant",
            subIndicators: [
              {
                name: "Implanon",
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "psa_implant_implanon Public Sector",
                    displayName: "psa_implant_implanon Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "psa_implant_implanon Private Sector NGO",
                    displayName: "psa_implant_implanon Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "psa_implant_implanon Private Sector Pharmacy",
                    displayName: "psa_implant_implanon Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "psa_implant_implanon Private Sector Hospital",
                    displayName: "psa_implant_implanon Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "psa_implant_implanon Other Sector Other",
                    displayName: "psa_implant_implanon Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "psa_implant_implanon Other Sector Shop",
                    displayName: "psa_implant_implanon Other Sector Shop",
                    static_displayName: "",
                  },
                ],
                type: "data_element",
                static_name: "Implanon",
              },
              {
                name: "Jadelle",
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "psa_implant_jadelle Public Sector",
                    displayName: "psa_implant_jadelle Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "psa_implant_jadelle Private Sector NGO",
                    displayName: "psa_implant_jadelle Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "psa_implant_jadelle Private Sector Pharmacy",
                    displayName: "psa_implant_jadelle Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "psa_implant_jadelle Private Sector Hospital",
                    displayName: "psa_implant_jadelle Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "psa_implant_jadelle Other Sector Other",
                    displayName: "psa_implant_jadelle Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "psa_implant_jadelle Other Sector Shop",
                    displayName: "psa_implant_jadelle Other Sector Shop",
                    static_displayName: "",
                  },
                ],
                type: "data_element",
                static_name: "Jadelle",
              },
              {
                name: "Sino-Implant",
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "psa_implant_sino Public Sector",
                    displayName: "psa_implant_sino Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "psa_implant_sino Private Sector NGO",
                    displayName: "psa_implant_sino Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "psa_implant_sino Private Sector Pharmacy",
                    displayName: "psa_implant_sino Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "psa_implant_sino Private Sector Hospital",
                    displayName: "psa_implant_sino Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "psa_implant_sino Other Sector Other",
                    displayName: "psa_implant_sino Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "psa_implant_sino Other Sector Shop",
                    displayName: "psa_implant_sino Other Sector Shop",
                    static_displayName: "",
                  },
                ],
                type: "data_element",
                static_name: "Sino-Implant",
              },
            ],
          },
          {
            name: "Injectable",
            static_name: "Injectable",
            key: "Injectable",
            subIndicators: [
              {
                name: "Depo Provera (DMPA)",
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "psa_injectable_dmpa Public Sector",
                    displayName: "psa_injectable_dmpa Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "psa_injectable_dmpa Private Sector NGO",
                    displayName: "psa_injectable_dmpa Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "psa_injectable_dmpa Private Sector Pharmacy",
                    displayName: "psa_injectable_dmpa Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "psa_injectable_dmpa Private Sector Hospital",
                    displayName: "psa_injectable_dmpa Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "psa_injectable_dmpa Other Sector Other",
                    displayName: "psa_injectable_dmpa Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "psa_injectable_dmpa Other Sector Shop",
                    displayName: "psa_injectable_dmpa Other Sector Shop",
                    static_displayName: "",
                  },
                ],
                type: "data_element",
                static_name: "Depo Provera (DMPA)",
              },
              {
                name: "Noristerat (NET-En)",
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "psa_injectable_neten Public Sector",
                    displayName: "psa_injectable_neten Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "psa_injectable_neten Private Sector NGO",
                    displayName: "psa_injectable_neten Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "psa_injectable_neten Private Sector Pharmacy",
                    displayName: "psa_injectable_neten Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "psa_injectable_neten Private Sector Hospital",
                    displayName: "psa_injectable_neten Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "psa_injectable_neten Other Sector Other",
                    displayName: "psa_injectable_neten Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "psa_injectable_neten Other Sector Shop",
                    displayName: "psa_injectable_neten Other Sector Shop",
                    static_displayName: "",
                  },
                ],
                type: "data_element",
                static_name: "Noristerat (NET-En)",
              },
              {
                name: "Lunelle",
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "psa_injectable_lunelle Public Sector",
                    displayName: "psa_injectable_lunelle Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "psa_injectable_lunelle Private Sector NGO",
                    displayName: "psa_injectable_lunelle Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "psa_injectable_lunelle Private Sector Pharmacy",
                    displayName:
                      "psa_injectable_lunelle Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "psa_injectable_lunelle Private Sector Hospital",
                    displayName:
                      "psa_injectable_lunelle Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "psa_injectable_lunelle Other Sector Other",
                    displayName: "psa_injectable_lunelle Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "psa_injectable_lunelle Other Sector Shop",
                    displayName: "psa_injectable_lunelle Other Sector Shop",
                    static_displayName: "",
                  },
                ],
                type: "data_element",
                static_name: "Lunelle",
              },
              {
                name: "Sayana Press",
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "psa_injectable_sayana_press Public Sector",
                    displayName: "psa_injectable_sayana_press Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "psa_injectable_sayana_press Private Sector NGO",
                    displayName:
                      "psa_injectable_sayana_press Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "psa_injectable_sayana_press Private Sector Pharmacy",
                    displayName:
                      "psa_injectable_sayana_press Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "psa_injectable_sayana_press Private Sector Hospital",
                    displayName:
                      "psa_injectable_sayana_press Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "psa_injectable_sayana_press Other Sector Other",
                    displayName:
                      "psa_injectable_sayana_press Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "psa_injectable_sayana_press Other Sector Shop",
                    displayName:
                      "psa_injectable_sayana_press Other Sector Shop",
                    static_displayName: "",
                  },
                ],
                type: "data_element",
                static_name: "Sayana Press",
              },
              {
                name: "Other Injectable",
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "psa_injectable_other Public Sector",
                    displayName: "psa_injectable_other Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "psa_injectable_other Private Sector NGO",
                    displayName: "psa_injectable_other Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "psa_injectable_other Private Sector Pharmacy",
                    displayName: "psa_injectable_other Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "psa_injectable_other Private Sector Hospital",
                    displayName: "psa_injectable_other Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "psa_injectable_other Other Sector Other",
                    displayName: "psa_injectable_other Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "psa_injectable_other Other Sector Shop",
                    displayName: "psa_injectable_other Other Sector Shop",
                    static_displayName: "",
                  },
                ],
                type: "data_element",
                static_name: "Other Injectable",
              },
            ],
          },
          {
            name: "Pill",
            static_name: "Pill",
            key: "Pill",
            subIndicators: [
              {
                name: "Combined Oral",
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "psa_pill_coc Public Sector",
                    displayName: "psa_pill_coc Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "psa_pill_coc Private Sector NGO",
                    displayName: "psa_pill_coc Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "psa_pill_coc Private Sector Pharmacy",
                    displayName: "psa_pill_coc Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "psa_pill_coc Private Sector Hospital",
                    displayName: "psa_pill_coc Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "psa_pill_coc Other Sector Other",
                    displayName: "psa_pill_coc Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "psa_pill_coc Other Sector Shop",
                    displayName: "psa_pill_coc Other Sector Shop",
                    static_displayName: "",
                  },
                ],
                type: "data_element",
                static_name: "Combined Oral",
              },
              {
                name: "Progestin only",
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "psa_pill_pop Public Sector",
                    displayName: "psa_pill_pop Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "psa_pill_pop Private Sector NGO",
                    displayName: "psa_pill_pop Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "psa_pill_pop Private Sector Pharmacy",
                    displayName: "psa_pill_pop Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "psa_pill_pop Private Sector Hospital",
                    displayName: "psa_pill_pop Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "psa_pill_pop Other Sector Other",
                    displayName: "psa_pill_pop Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "psa_pill_pop Other Sector Shop",
                    displayName: "psa_pill_pop Other Sector Shop",
                    static_displayName: "",
                  },
                ],
                type: "data_element",
                static_name: "Progestin only",
              },
              {
                name: "Other OC Pill",
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "psa_pill_other Public Sector",
                    displayName: "psa_pill_other Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "psa_pill_other Private Sector NGO",
                    displayName: "psa_pill_other Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "psa_pill_other Private Sector Pharmacy",
                    displayName: "psa_pill_other Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "psa_pill_other Private Sector Hospital",
                    displayName: "psa_pill_other Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "psa_pill_other Other Sector Other",
                    displayName: "psa_pill_other Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "psa_pill_other Other Sector Shop",
                    displayName: "psa_pill_other Other Sector Shop",
                    static_displayName: "",
                  },
                ],
                type: "data_element",
                static_name: "Other OC Pill",
              },
            ],
          },
          {
            name: "Condom",
            static_name: "Condom",
            key: "Condom",
            subIndicators: [
              {
                name: "Male Condom",
                adjusted: false,
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "psa_condom_male Public Sector",
                    displayName: "psa_condom_male Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "psa_condom_male Private Sector NGO",
                    displayName: "psa_condom_male Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "psa_condom_male Private Sector Pharmacy",
                    displayName: "psa_condom_male Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "psa_condom_male Private Sector Hospital",
                    displayName: "psa_condom_male Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "psa_condom_male Other Sector Other",
                    displayName: "psa_condom_male Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "psa_condom_male Other Sector Shop",
                    displayName: "psa_condom_male Other Sector Shop",
                    static_displayName: "",
                  },
                ],
                type: "data_element",
                static_name: "Male Condom",
              },
              {
                name: "Female Condom",
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "psa_condom_female Public Sector",
                    displayName: "psa_condom_female Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "psa_condom_female Private Sector NGO",
                    displayName: "psa_condom_female Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "psa_condom_female Private Sector Pharmacy",
                    displayName: "psa_condom_female Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "psa_condom_female Private Sector Hospital",
                    displayName: "psa_condom_female Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "psa_condom_female Other Sector Other",
                    displayName: "psa_condom_female Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "psa_condom_female Other Sector Shop",
                    displayName: "psa_condom_female Other Sector Shop",
                    static_displayName: "",
                  },
                ],
                type: "data_element",
                static_name: "Female Condom",
              },
            ],
          },
          {
            name: "Other Modern Methods",
            static_name: "Other Modern Methods",
            key: "Other Modern Methods",
            subIndicators: [
              {
                name: "LAM",
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "psa_omm_lam Public Sector",
                    displayName: "psa_omm_lam Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "psa_omm_lam Private Sector NGO",
                    displayName: "psa_omm_lam Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "psa_omm_lam Private Sector Pharmacy",
                    displayName: "psa_omm_lam Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "psa_omm_lam Private Sector Hospital",
                    displayName: "psa_omm_lam Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "psa_omm_lam Other Sector Other",
                    displayName: "psa_omm_lam Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "psa_omm_lam Other Sector Shop",
                    displayName: "psa_omm_lam Other Sector Shop",
                    static_displayName: "",
                  },
                ],
                type: "data_element",
                static_name: "LAM",
              },
              {
                name: "SDM (Standard Days)",
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "psa_omm_sdm Public Sector",
                    displayName: "psa_omm_sdm Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "psa_omm_sdm Private Sector NGO",
                    displayName: "psa_omm_sdm Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "psa_omm_sdm Private Sector Pharmacy",
                    displayName: "psa_omm_sdm Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "psa_omm_sdm Private Sector Hospital",
                    displayName: "psa_omm_sdm Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "psa_omm_sdm Other Sector Other",
                    displayName: "psa_omm_sdm Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "psa_omm_sdm Other Sector Shop",
                    displayName: "psa_omm_sdm Other Sector Shop",
                    static_displayName: "",
                  },
                ],
                type: "data_element",
                static_name: "SDM (Standard Days)",
              },
              {
                name: "Vaginal barrier",
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "psa_omm_vb Public Sector",
                    displayName: "psa_omm_vb Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "psa_omm_vb Private Sector NGO",
                    displayName: "psa_omm_vb Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "psa_omm_vb Private Sector Pharmacy",
                    displayName: "psa_omm_vb Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "psa_omm_vb Private Sector Hospital",
                    displayName: "psa_omm_vb Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "psa_omm_vb Other Sector Other",
                    displayName: "psa_omm_vb Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "psa_omm_vb Other Sector Shop",
                    displayName: "psa_omm_vb Other Sector Shop",
                    static_displayName: "",
                  },
                ],
                type: "data_element",
                static_name: "Vaginal barrier",
              },
              {
                name: "Spermicides",
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "psa_omm_spermicides Public Sector",
                    displayName: "psa_omm_spermicides Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "psa_omm_spermicides Private Sector NGO",
                    displayName: "psa_omm_spermicides Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "psa_omm_spermicides Private Sector Pharmacy",
                    displayName: "psa_omm_spermicides Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "psa_omm_spermicides Private Sector Hospital",
                    displayName: "psa_omm_spermicides Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "psa_omm_spermicides Other Sector Other",
                    displayName: "psa_omm_spermicides Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "psa_omm_spermicides Other Sector Shop",
                    displayName: "psa_omm_spermicides Other Sector Shop",
                    static_displayName: "",
                  },
                ],
                type: "data_element",
                static_name: "Spermicides",
              },
            ],
          },
          {
            name: "Emergency contraception",
            static_name: "Emergency contraception",
            key: "Emergency contraception",
            subIndicators: [
              {
                name: "EC",
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "psa_ec Public Sector",
                    displayName: "psa_ec Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "psa_ec Private Sector NGO",
                    displayName: "psa_ec Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "psa_ec Private Sector Pharmacy",
                    displayName: "psa_ec Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "psa_ec Private Sector Hospital",
                    displayName: "psa_ec Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "psa_ec Other Sector Other",
                    displayName: "psa_ec Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "psa_ec Other Sector Shop",
                    displayName: "psa_ec Other Sector Shop",
                    static_displayName: "",
                  },
                ],
                type: "data_element",
                static_name: "EC",
              },
            ],
          },
        ],
      },
      Visits: {
        derivedCharts: [
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName:
                "User Trends by Method (Service Statistics), Source of Data",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName:
                "Comparing Estimated Total FP Users by (Service Statistics) & Survey, Source of Data",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName:
                "Comparing Estimate of Modern Users by Method Total FP Users by (Service Statistics) & Survey, Source of Data",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Comparing Method Mix [ Service Statistics & Survey]",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              title1: {
                text: "",
                visible: false,
              },
              subTitle1: {
                text: "",
                visible: false,
              },
              color: "#00FF00",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Comparing User Trends: EMU",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Comparing Slopes: EMU",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Estimated Modern Use (%)",
              chartInfo: "",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName:
                "Estimated Modern Users: Adjusted for the Private Sector",
              chartInfo: "",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName:
                "Total Users Trends, UNPD Estimates vs. Service Statistics Estimates (Adjusted and Unadjusted)",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName:
                "Comparing Estimated Total FP Users, Survey/UNPD vs Service Statistics (Adjusted and Unadjusted)",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
        ],
        chartData: [
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Sterilization",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#c87776",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Sterilization",
              subIndicator: [
                {
                  de: [],
                  name: ["Tubal Ligation (F)"],
                  selectedDE: [],
                  color: "#c87776",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Sterilization",
                  cyp: "10",
                  scalingFactor: 1,
                  static_name: ["Tubal Ligation (F)"],
                },
                {
                  de: [],
                  name: ["Vasectomy (M)"],
                  selectedDE: [],
                  color: "#c87776",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Sterilization",
                  cyp: "10",
                  scalingFactor: 1,
                  static_name: ["Vasectomy (M)"],
                },
              ],
              static_name: "Sterilization",
              methodType: "Long Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "IUD",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#47c49a",
              },
              dataLabels: {
                enabled: true,
              },
              name: "IUD",
              subIndicator: [
                {
                  de: [],
                  name: ["Copper- T 380-A IUD"],
                  selectedDE: [],
                  color: "#47c49a",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "IUD",
                  cyp: "4.6",
                  scalingFactor: 1,
                  static_name: ["Copper- T 380-A IUD"],
                },
                {
                  de: [],
                  name: ["LNG-IUS"],
                  selectedDE: [],
                  color: "#47c49a",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "IUD",
                  cyp: "3.3",
                  scalingFactor: 1,
                  static_name: ["LNG-IUS"],
                },
              ],
              static_name: "IUD",
              methodType: "Long Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Implant",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#8DC645",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Implant",
              subIndicator: [
                {
                  de: [],
                  name: ["Implanon"],
                  selectedDE: [],
                  color: "#8DC645",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Implant",
                  cyp: "2.5",
                  scalingFactor: 1,
                  static_name: ["Implanon"],
                },
                {
                  de: [],
                  name: ["Jadelle"],
                  selectedDE: [],
                  color: "#8DC645",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Implant",
                  cyp: "3.8",
                  scalingFactor: 1,
                  static_name: ["Jadelle"],
                },
                {
                  de: [],
                  name: ["Sino-Implant"],
                  selectedDE: [],
                  color: "#8DC645",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Implant",
                  cyp: "3.2",
                  scalingFactor: 1,
                  static_name: ["Sino-Implant"],
                },
              ],
              static_name: "Implant",
              methodType: "Long Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Injectable",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#5287cd",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Injectable",
              subIndicator: [
                {
                  de: [],
                  name: ["Depo Provera (DMPA)"],
                  selectedDE: [],
                  color: "#5287cd",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Injectable",
                  cyp: "0.25",
                  static_name: ["Depo Provera (DMPA)"],
                },
                {
                  de: [],
                  name: ["Noristerat (NET-En)"],
                  selectedDE: [],
                  color: "#5287cd",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Injectable",
                  cyp: "0.1666666667",
                  static_name: ["Noristerat (NET-En)"],
                },
                {
                  de: [],
                  name: ["Lunelle"],
                  selectedDE: [],
                  color: "#5287cd",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Injectable",
                  cyp: "0.07692307692",
                  static_name: ["Lunelle"],
                },
                {
                  de: [],
                  name: ["Sayana Press"],
                  selectedDE: [],
                  color: "#5287cd",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Injectable",
                  cyp: "0.25",
                  static_name: ["Sayana Press"],
                },
                {
                  de: [],
                  name: ["Other Injectable"],
                  selectedDE: [],
                  color: "#5287cd",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Injectable",
                  cyp: "0.25",
                  static_name: ["Other Injectable"],
                },
              ],
              static_name: "Injectable",
              methodType: "Short Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Pill",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#70aedf",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Pill",
              subIndicator: [
                {
                  de: [],
                  name: ["Combined Oral"],
                  selectedDE: [],
                  color: "#70aedf",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Pill",
                  cyp: "0.25",
                  static_name: ["Combined Oral"],
                },
                {
                  de: [],
                  name: ["Progestin only"],
                  selectedDE: [],
                  color: "#70aedf",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Pill",
                  cyp: "0.25",
                  static_name: ["Progestin only"],
                },
                {
                  de: [],
                  name: ["Other OC Pill"],
                  selectedDE: [],
                  color: "#70aedf",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Pill",
                  cyp: "0.25",
                  static_name: ["Other OC Pill"],
                },
              ],
              static_name: "Pill",
              methodType: "Short Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Condom",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#fcb241",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Condom",
              subIndicator: [
                {
                  de: [],
                  name: ["Male Condom"],
                  selectedDE: [],
                  color: "#fcb241",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Condom",
                  cyp: "0.25",
                  static_name: ["Male Condom"],
                },
                {
                  de: [],
                  name: ["Female Condom"],
                  selectedDE: [],
                  color: "#fcb241",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Condom",
                  cyp: "0.25",
                  static_name: ["Female Condom"],
                },
              ],
              static_name: "Condom",
              methodType: "Short Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Other Modern Methods",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#78a095",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Other Modern Methods",
              subIndicator: [
                {
                  de: [],
                  name: ["LAM"],
                  selectedDE: [],
                  color: "#78a095",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Other Modern Methods",
                  cyp: "1",
                  static_name: ["LAM"],
                },
                {
                  de: [],
                  name: ["SDM (Standard Days)"],
                  selectedDE: [],
                  color: "#78a095",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Other Modern Methods",
                  cyp: "1",
                  static_name: ["SDM (Standard Days)"],
                },
                {
                  de: [],
                  name: ["Vaginal barrier"],
                  selectedDE: [],
                  color: "#78a095",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Other Modern Methods",
                  cyp: "1",
                  static_name: ["Vaginal barrier"],
                },
                {
                  de: [],
                  name: ["Spermicides"],
                  selectedDE: [],
                  color: "#78a095",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Other Modern Methods",
                  cyp: "0.25",
                  static_name: ["Spermicides"],
                },
              ],
              static_name: "Other Modern Methods",
              methodType: "Short Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Emergency contraception",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#dd8ab8",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Emergency contraception",
              subIndicator: [
                {
                  de: [],
                  name: ["EC"],
                  selectedDE: [],
                  color: "#dd8ab8",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Emergency contraception",
                  cyp: "0.05",
                  static_name: ["EC"],
                },
              ],
              static_name: "Emergency contraception",
              methodType: "Short Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Total CYP",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#439aa3",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Total CYP",
              static_name: "Total CYP",
              methodType: "Short Term",
              subIndicator: [],
            },
          },
        ],
        reportingRate: [
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Reporting Rate (Actual)",
              chartInfo: "",
              categoryInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#3bc2bb",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Reporting Rate (Actual)",
              subIndicator: [
                {
                  de: [],
                  name: ["Reporting Rate (Actual)"],
                  selectedDE: [],
                  type: "indicator",
                  static_name: ["Reporting Rate (Actual)"],
                },
              ],
            },
          },
        ],
        dataOnContraceptive: "Yes",
        source: "",
        initialYear: "",
        finalYear: "",
        reportingSector: "Public Only",
        incAnnualEMU: "",
        excAnnualEMU: "",
        monthlyEMU: "",
        FPSource: {
          governmentHealth: "Yes",
          ngo: "Yes",
          privateHospital: "Yes",
          pharmacy: "Yes",
          shopChurchFriend: "Yes",
          otherSector: "Yes",
        },
      },
      Commodities_Client: {
        derivedCharts: [
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName:
                "User Trends by Method (Service Statistics), Source of Data",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName:
                "Comparing Estimated Total FP Users by (Service Statistics) & Survey, Source of Data",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName:
                "Comparing Estimate of Modern Users by Method Total FP Users by (Service Statistics) & Survey, Source of Data",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Comparing Method Mix [ Service Statistics & Survey]",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              title1: {
                text: "",
                visible: false,
              },
              subTitle1: {
                text: "",
                visible: false,
              },
              color: "#00FF00",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Comparing User Trends: EMU",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Comparing Slopes: EMU",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Estimated Modern Use (%)",
              chartInfo: "",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName:
                "Estimated Modern Users: Adjusted for the Private Sector",
              chartInfo: "",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName:
                "Total Users Trends, UNPD Estimates vs. Service Statistics Estimates (Adjusted and Unadjusted)",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName:
                "Comparing Estimated Total FP Users, Survey/UNPD vs Service Statistics (Adjusted and Unadjusted)",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
        ],
        chartData: [
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Sterilization",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#c87776",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Sterilization",
              subIndicator: [
                {
                  de: [],
                  name: ["Tubal Ligation (F)"],
                  selectedDE: [],
                  color: "#c87776",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Sterilization",
                  cyp: "10",
                  scalingFactor: 1,
                  static_name: ["Tubal Ligation (F)"],
                },
                {
                  de: [],
                  name: ["Vasectomy (M)"],
                  selectedDE: [],
                  color: "#c87776",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Sterilization",
                  cyp: "10",
                  scalingFactor: 1,
                  static_name: ["Vasectomy (M)"],
                },
              ],
              static_name: "Sterilization",
              methodType: "Long Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "IUD",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#47c49a",
              },
              dataLabels: {
                enabled: true,
              },
              name: "IUD",
              subIndicator: [
                {
                  de: [],
                  name: ["Copper- T 380-A IUD"],
                  selectedDE: [],
                  color: "#47c49a",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "IUD",
                  cyp: "4.6",
                  scalingFactor: 1,
                  static_name: ["Copper- T 380-A IUD"],
                },
                {
                  de: [],
                  name: ["LNG-IUS"],
                  selectedDE: [],
                  color: "#47c49a",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "IUD",
                  cyp: "3.3",
                  scalingFactor: 1,
                  static_name: ["LNG-IUS"],
                },
              ],
              static_name: "IUD",
              methodType: "Long Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Implant",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#8DC645",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Implant",
              subIndicator: [
                {
                  de: [],
                  name: ["Implanon"],
                  selectedDE: [],
                  color: "#8DC645",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Implant",
                  cyp: "2.5",
                  scalingFactor: 1,
                  static_name: ["Implanon"],
                },
                {
                  de: [],
                  name: ["Jadelle"],
                  selectedDE: [],
                  color: "#8DC645",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Implant",
                  cyp: "3.8",
                  scalingFactor: 1,
                  static_name: ["Jadelle"],
                },
                {
                  de: [],
                  name: ["Sino-Implant"],
                  selectedDE: [],
                  color: "#8DC645",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Implant",
                  cyp: "3.2",
                  scalingFactor: 1,
                  static_name: ["Sino-Implant"],
                },
              ],
              static_name: "Implant",
              methodType: "Long Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Injectable",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#5287cd",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Injectable",
              subIndicator: [
                {
                  de: [],
                  name: ["Depo Provera (DMPA)"],
                  selectedDE: [],
                  color: "#5287cd",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Injectable",
                  cyp: "0.25",
                  static_name: ["Depo Provera (DMPA)"],
                },
                {
                  de: [],
                  name: ["Noristerat (NET-En)"],
                  selectedDE: [],
                  color: "#5287cd",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Injectable",
                  cyp: "0.1666666667",
                  static_name: ["Noristerat (NET-En)"],
                },
                {
                  de: [],
                  name: ["Lunelle"],
                  selectedDE: [],
                  color: "#5287cd",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Injectable",
                  cyp: "0.07692307692",
                  static_name: ["Lunelle"],
                },
                {
                  de: [],
                  name: ["Sayana Press"],
                  selectedDE: [],
                  color: "#5287cd",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Injectable",
                  cyp: "0.25",
                  static_name: ["Sayana Press"],
                },
                {
                  de: [],
                  name: ["Other Injectable"],
                  selectedDE: [],
                  color: "#5287cd",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Injectable",
                  cyp: "0.25",
                  static_name: ["Other Injectable"],
                },
              ],
              static_name: "Injectable",
              methodType: "Short Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Pill",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#70aedf",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Pill",
              subIndicator: [
                {
                  de: [],
                  name: ["Combined Oral"],
                  selectedDE: [],
                  color: "#70aedf",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Pill",
                  cyp: "0.06666666667",
                  static_name: ["Combined Oral"],
                },
                {
                  de: [],
                  name: ["Progestin only"],
                  selectedDE: [],
                  color: "#70aedf",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Pill",
                  cyp: "0.06666666667",
                  static_name: ["Progestin only"],
                },
                {
                  de: [],
                  name: ["Other OC Pill"],
                  selectedDE: [],
                  color: "#70aedf",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Pill",
                  cyp: "0.06666666667",
                  static_name: ["Other OC Pill"],
                },
              ],
              static_name: "Pill",
              methodType: "Short Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Condom",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#fcb241",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Condom",
              subIndicator: [
                {
                  de: [],
                  name: ["Male Condom"],
                  selectedDE: [],
                  color: "#fcb241",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Condom",
                  cyp: "0.008333333333",
                  static_name: ["Male Condom"],
                },
                {
                  de: [],
                  name: ["Female Condom"],
                  selectedDE: [],
                  color: "#fcb241",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Condom",
                  cyp: "0.008333333333",
                  static_name: ["Female Condom"],
                },
              ],
              static_name: "Condom",
              methodType: "Short Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Other Modern Methods",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#78a095",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Other Modern Methods",
              subIndicator: [
                {
                  de: [],
                  name: ["LAM"],
                  selectedDE: [],
                  color: "#78a095",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Other Modern Methods",
                  cyp: "0.25",
                  static_name: ["LAM"],
                },
                {
                  de: [],
                  name: ["SDM (Standard Days)"],
                  selectedDE: [],
                  color: "#78a095",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Other Modern Methods",
                  cyp: "1.5",
                  static_name: ["SDM (Standard Days)"],
                },
                {
                  de: [],
                  name: ["Vaginal barrier"],
                  selectedDE: [],
                  color: "#78a095",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Other Modern Methods",
                  cyp: "1",
                  static_name: ["Vaginal barrier"],
                },
                {
                  de: [],
                  name: ["Spermicides"],
                  selectedDE: [],
                  color: "#78a095",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Other Modern Methods",
                  cyp: "0.008333333333",
                  static_name: ["Spermicides"],
                },
              ],
              static_name: "Other Modern Methods",
              methodType: "Short Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Emergency contraception",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#dd8ab8",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Emergency contraception",
              subIndicator: [
                {
                  de: [],
                  name: ["EC"],
                  selectedDE: [],
                  color: "#dd8ab8",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Emergency contraception",
                  cyp: "0.05",
                  static_name: ["EC"],
                },
              ],
              static_name: "Emergency contraception",
              methodType: "Short Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Total CYP",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#439aa3",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Total CYP",
              static_name: "Total CYP",
              methodType: "Short Term",
              subIndicator: [],
            },
          },
        ],
        reportingRate: [
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Reporting Rate (Actual)",
              chartInfo: "",
              categoryInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#3bc2bb",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Reporting Rate (Actual)",
              subIndicator: [
                {
                  de: [],
                  name: ["Reporting Rate (Actual)"],
                  selectedDE: [],
                  type: "indicator",
                  static_name: ["Reporting Rate (Actual)"],
                },
              ],
            },
          },
        ],
        dataOnContraceptive: "Yes",
        source: "",
        initialYear: "",
        finalYear: "",
        reportingSector: "Public Only",
        incAnnualEMU: "",
        excAnnualEMU: "",
        monthlyEMU: "",
        FPSource: {
          governmentHealth: "Yes",
          ngo: "Yes",
          privateHospital: "No",
          pharmacy: "Yes",
          shopChurchFriend: "Yes",
          otherSector: "No",
        },
      },
      Commodities_Facilities: {
        derivedCharts: [
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName:
                "User Trends by Method (Service Statistics), Source of Data",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName:
                "Comparing Estimated Total FP Users by (Service Statistics) & Survey, Source of Data",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName:
                "Comparing Estimate of Modern Users by Method Total FP Users by (Service Statistics) & Survey, Source of Data",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Comparing Method Mix [ Service Statistics & Survey]",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              title1: {
                text: "",
                visible: false,
              },
              subTitle1: {
                text: "",
                visible: false,
              },
              color: "#00FF00",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Comparing User Trends: EMU",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Comparing Slopes: EMU",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Estimated Modern Use (%)",
              chartInfo: "",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName:
                "Estimated Modern Users: Adjusted for the Private Sector",
              chartInfo: "",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName:
                "Total Users Trends, UNPD Estimates vs. Service Statistics Estimates (Adjusted and Unadjusted)",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName:
                "Comparing Estimated Total FP Users, Survey/UNPD vs Service Statistics (Adjusted and Unadjusted)",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
        ],
        chartData: [
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Sterilization",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#c87776",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Sterilization",
              subIndicator: [
                {
                  de: [],
                  name: ["Tubal Ligation (F)"],
                  selectedDE: [],
                  color: "#c87776",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Sterilization",
                  cyp: "10",
                  scalingFactor: 1,
                  static_name: ["Tubal Ligation (F)"],
                },
                {
                  de: [],
                  name: ["Vasectomy (M)"],
                  selectedDE: [],
                  color: "#c87776",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Sterilization",
                  cyp: "10",
                  scalingFactor: 1,
                  static_name: ["Vasectomy (M)"],
                },
              ],
              static_name: "Sterilization",
              methodType: "Long Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "IUD",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#47c49a",
              },
              dataLabels: {
                enabled: true,
              },
              name: "IUD",
              subIndicator: [
                {
                  de: [],
                  name: ["Copper- T 380-A IUD"],
                  selectedDE: [],
                  color: "#47c49a",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "IUD",
                  cyp: "4.6",
                  scalingFactor: 1,
                  static_name: ["Copper- T 380-A IUD"],
                },
                {
                  de: [],
                  name: ["LNG-IUS"],
                  selectedDE: [],
                  color: "#47c49a",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "IUD",
                  cyp: "3.3",
                  scalingFactor: 1,
                  static_name: ["LNG-IUS"],
                },
              ],
              static_name: "IUD",
              methodType: "Long Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Implant",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#8DC645",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Implant",
              subIndicator: [
                {
                  de: [],
                  name: ["Implanon"],
                  selectedDE: [],
                  color: "#8DC645",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Implant",
                  cyp: "2.5",
                  scalingFactor: 1,
                  static_name: ["Implanon"],
                },
                {
                  de: [],
                  name: ["Jadelle"],
                  selectedDE: [],
                  color: "#8DC645",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Implant",
                  cyp: "3.8",
                  scalingFactor: 1,
                  static_name: ["Jadelle"],
                },
                {
                  de: [],
                  name: ["Sino-Implant"],
                  selectedDE: [],
                  color: "#8DC645",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Implant",
                  cyp: "3.2",
                  scalingFactor: 1,
                  static_name: ["Sino-Implant"],
                },
              ],
              static_name: "Implant",
              methodType: "Long Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Injectable",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#5287cd",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Injectable",
              subIndicator: [
                {
                  de: [],
                  name: ["Depo Provera (DMPA)"],
                  selectedDE: [],
                  color: "#5287cd",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Injectable",
                  cyp: "0.25",
                  static_name: ["Depo Provera (DMPA)"],
                },
                {
                  de: [],
                  name: ["Noristerat (NET-En)"],
                  selectedDE: [],
                  color: "#5287cd",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Injectable",
                  cyp: "0.1666666667",
                  static_name: ["Noristerat (NET-En)"],
                },
                {
                  de: [],
                  name: ["Lunelle"],
                  selectedDE: [],
                  color: "#5287cd",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Injectable",
                  cyp: "0.07692307692",
                  static_name: ["Lunelle"],
                },
                {
                  de: [],
                  name: ["Sayana Press"],
                  selectedDE: [],
                  color: "#5287cd",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Injectable",
                  cyp: "0.25",
                  static_name: ["Sayana Press"],
                },
                {
                  de: [],
                  name: ["Other Injectable"],
                  selectedDE: [],
                  color: "#5287cd",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Injectable",
                  cyp: "0.25",
                  static_name: ["Other Injectable"],
                },
              ],
              static_name: "Injectable",
              methodType: "Short Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Pill",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#70aedf",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Pill",
              subIndicator: [
                {
                  de: [],
                  name: ["Combined Oral"],
                  selectedDE: [],
                  color: "#70aedf",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Pill",
                  cyp: "0.06666666667",
                  static_name: ["Combined Oral"],
                },
                {
                  de: [],
                  name: ["Progestin only"],
                  selectedDE: [],
                  color: "#70aedf",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Pill",
                  cyp: "0.06666666667",
                  static_name: ["Progestin only"],
                },
                {
                  de: [],
                  name: ["Other OC Pill"],
                  selectedDE: [],
                  color: "#70aedf",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Pill",
                  cyp: "0.06666666667",
                  static_name: ["Other OC Pill"],
                },
              ],
              static_name: "Pill",
              methodType: "Short Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Condom",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#fcb241",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Condom",
              subIndicator: [
                {
                  de: [],
                  name: ["Male Condom"],
                  selectedDE: [],
                  color: "#fcb241",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Condom",
                  cyp: "0.008333333333",
                  static_name: ["Male Condom"],
                },
                {
                  de: [],
                  name: ["Female Condom"],
                  selectedDE: [],
                  color: "#fcb241",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Condom",
                  cyp: "0.008333333333",
                  static_name: ["Female Condom"],
                },
              ],
              static_name: "Condom",
              methodType: "Short Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Other Modern Methods",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#78a095",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Other Modern Methods",
              subIndicator: [
                {
                  de: [],
                  name: ["LAM"],
                  selectedDE: [],
                  color: "#78a095",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Other Modern Methods",
                  cyp: "0.25",
                  static_name: ["LAM"],
                },
                {
                  de: [],
                  name: ["SDM (Standard Days)"],
                  selectedDE: [],
                  color: "#78a095",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Other Modern Methods",
                  cyp: "1.5",
                  static_name: ["SDM (Standard Days)"],
                },
                {
                  de: [],
                  name: ["Vaginal barrier"],
                  selectedDE: [],
                  color: "#78a095",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Other Modern Methods",
                  cyp: "1",
                  static_name: ["Vaginal barrier"],
                },
                {
                  de: [],
                  name: ["Spermicides"],
                  selectedDE: [],
                  color: "#78a095",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Other Modern Methods",
                  cyp: "0.008333333333",
                  static_name: ["Spermicides"],
                },
              ],
              static_name: "Other Modern Methods",
              methodType: "Short Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Emergency contraception",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#dd8ab8",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Emergency contraception",
              subIndicator: [
                {
                  de: [],
                  name: ["EC"],
                  selectedDE: [],
                  color: "#dd8ab8",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Emergency contraception",
                  cyp: "0.05",
                  static_name: ["EC"],
                },
              ],
              static_name: "Emergency contraception",
              methodType: "Short Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Total CYP",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#439aa3",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Total CYP",
              static_name: "Total CYP",
              methodType: "Short Term",
              subIndicator: [],
            },
          },
        ],
        reportingRate: [
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Reporting Rate (Actual)",
              chartInfo: "",
              categoryInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#3bc2bb",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Reporting Rate (Actual)",
              subIndicator: [
                {
                  de: [],
                  name: ["Reporting Rate (Actual)"],
                  selectedDE: [],
                  type: "indicator",
                  static_name: ["Reporting Rate (Actual)"],
                },
              ],
            },
          },
        ],
        dataOnContraceptive: "Yes",
        source: "",
        initialYear: "",
        finalYear: "",
        reportingSector: "Public Only",
        incAnnualEMU: "",
        excAnnualEMU: "",
        monthlyEMU: "",
        FPSource: {
          governmentHealth: "Yes",
          ngo: "Yes",
          privateHospital: "No",
          pharmacy: "Yes",
          shopChurchFriend: "Yes",
          otherSector: "No",
        },
      },
      User: {
        derivedCharts: [
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName:
                "User Trends by Method (Service Statistics), Source of Data",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName:
                "Comparing Estimated Total FP Users by (Service Statistics) & Survey, Source of Data",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName:
                "Comparing Estimate of Modern Users by Method Total FP Users by (Service Statistics) & Survey, Source of Data",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Comparing Method Mix [ Service Statistics & Survey]",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              title1: {
                text: "",
                visible: false,
              },
              subTitle1: {
                text: "",
                visible: false,
              },
              color: "#00FF00",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Comparing User Trends: EMU",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Comparing Slopes: EMU",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Estimated Modern Use (%)",
              chartInfo: "",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName:
                "Estimated Modern Users: Adjusted for the Private Sector",
              chartInfo: "",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName:
                "Total Users Trends, UNPD Estimates vs. Service Statistics Estimates (Adjusted and Unadjusted)",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName:
                "Comparing Estimated Total FP Users, Survey/UNPD vs Service Statistics (Adjusted and Unadjusted)",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
        ],
        chartData: [
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Sterilization",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#c87776",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Sterilization",
              subIndicator: [
                {
                  de: [],
                  name: ["Tubal Ligation (F)"],
                  selectedDE: [],
                  color: "#c87776",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Sterilization",
                  cyp: "10",
                  scalingFactor: 1,
                  static_name: ["Tubal Ligation (F)"],
                },
                {
                  de: [],
                  name: ["Vasectomy (M)"],
                  selectedDE: [],
                  color: "#c87776",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Sterilization",
                  cyp: "10",
                  scalingFactor: 1,
                  static_name: ["Vasectomy (M)"],
                },
              ],
              static_name: "Sterilization",
              methodType: "Long Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "IUD",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#47c49a",
              },
              dataLabels: {
                enabled: true,
              },
              name: "IUD",
              subIndicator: [
                {
                  de: [],
                  name: ["Copper- T 380-A IUD"],
                  selectedDE: [],
                  color: "#47c49a",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "IUD",
                  cyp: "4.6",
                  scalingFactor: 1,
                  static_name: ["Copper- T 380-A IUD"],
                },
                {
                  de: [],
                  name: ["LNG-IUS"],
                  selectedDE: [],
                  color: "#47c49a",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "IUD",
                  cyp: "3.3",
                  scalingFactor: 1,
                  static_name: ["LNG-IUS"],
                },
              ],
              static_name: "IUD",
              methodType: "Long Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Implant",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#8DC645",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Implant",
              subIndicator: [
                {
                  de: [],
                  name: ["Implanon"],
                  selectedDE: [],
                  color: "#8DC645",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Implant",
                  cyp: "2.5",
                  scalingFactor: 1,
                  static_name: ["Implanon"],
                },
                {
                  de: [],
                  name: ["Jadelle"],
                  selectedDE: [],
                  color: "#8DC645",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Implant",
                  cyp: "3.8",
                  scalingFactor: 1,
                  static_name: ["Jadelle"],
                },
                {
                  de: [],
                  name: ["Sino-Implant"],
                  selectedDE: [],
                  color: "#8DC645",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Implant",
                  cyp: "3.2",
                  scalingFactor: 1,
                  static_name: ["Sino-Implant"],
                },
              ],
              static_name: "Implant",
              methodType: "Long Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Injectable",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#5287cd",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Injectable",
              subIndicator: [
                {
                  de: [],
                  name: ["Depo Provera (DMPA)"],
                  selectedDE: [],
                  color: "#5287cd",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Injectable",
                  cyp: "0.25",
                  static_name: ["Depo Provera (DMPA)"],
                },
                {
                  de: [],
                  name: ["Noristerat (NET-En)"],
                  selectedDE: [],
                  color: "#5287cd",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Injectable",
                  cyp: "0.1666666667",
                  static_name: ["Noristerat (NET-En)"],
                },
                {
                  de: [],
                  name: ["Lunelle"],
                  selectedDE: [],
                  color: "#5287cd",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Injectable",
                  cyp: "0.07692307692",
                  static_name: ["Lunelle"],
                },
                {
                  de: [],
                  name: ["Sayana Press"],
                  selectedDE: [],
                  color: "#5287cd",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Injectable",
                  cyp: "0.25",
                  static_name: ["Sayana Press"],
                },
                {
                  de: [],
                  name: ["Other Injectable"],
                  selectedDE: [],
                  color: "#5287cd",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Injectable",
                  cyp: "0.25",
                  static_name: ["Other Injectable"],
                },
              ],
              static_name: "Injectable",
              methodType: "Short Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Pill",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#70aedf",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Pill",
              subIndicator: [
                {
                  de: [],
                  name: ["Combined Oral"],
                  selectedDE: [],
                  color: "#70aedf",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Pill",
                  cyp: "0.06666666667",
                  static_name: ["Combined Oral"],
                },
                {
                  de: [],
                  name: ["Progestin only"],
                  selectedDE: [],
                  color: "#70aedf",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Pill",
                  cyp: "0.06666666667",
                  static_name: ["Progestin only"],
                },
                {
                  de: [],
                  name: ["Other OC Pill"],
                  selectedDE: [],
                  color: "#70aedf",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Pill",
                  cyp: "0.06666666667",
                  static_name: ["Other OC Pill"],
                },
              ],
              static_name: "Pill",
              methodType: "Short Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Condom",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#fcb241",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Condom",
              subIndicator: [
                {
                  de: [],
                  name: ["Male Condom"],
                  selectedDE: [],
                  color: "#fcb241",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Condom",
                  cyp: "0.008333333333",
                  static_name: ["Male Condom"],
                },
                {
                  de: [],
                  name: ["Female Condom"],
                  selectedDE: [],
                  color: "#fcb241",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Condom",
                  cyp: "0.008333333333",
                  static_name: ["Female Condom"],
                },
              ],
              static_name: "Condom",
              methodType: "Short Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Other Modern Methods",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#78a095",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Other Modern Methods",
              subIndicator: [
                {
                  de: [],
                  name: ["LAM"],
                  selectedDE: [],
                  color: "#78a095",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Other Modern Methods",
                  cyp: "0.25",
                  static_name: ["LAM"],
                },
                {
                  de: [],
                  name: ["SDM (Standard Days)"],
                  selectedDE: [],
                  color: "#78a095",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Other Modern Methods",
                  cyp: "1.5",
                  static_name: ["SDM (Standard Days)"],
                },
                {
                  de: [],
                  name: ["Vaginal barrier"],
                  selectedDE: [],
                  color: "#78a095",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Other Modern Methods",
                  cyp: "1",
                  static_name: ["Vaginal barrier"],
                },
                {
                  de: [],
                  name: ["Spermicides"],
                  selectedDE: [],
                  color: "#78a095",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Other Modern Methods",
                  cyp: "0.008333333333",
                  static_name: ["Spermicides"],
                },
              ],
              static_name: "Other Modern Methods",
              methodType: "Short Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Emergency contraception",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#dd8ab8",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Emergency contraception",
              subIndicator: [
                {
                  de: [],
                  name: ["EC"],
                  selectedDE: [],
                  color: "#dd8ab8",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Emergency contraception",
                  cyp: "0.05",
                  static_name: ["EC"],
                },
              ],
              static_name: "Emergency contraception",
              methodType: "Short Term",
            },
          },
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Total CYP",
              chartInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#439aa3",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Total CYP",
              static_name: "Total CYP",
              methodType: "Short Term",
              subIndicator: [],
            },
          },
        ],
        reportingRate: [
          {
            indicator: {
              cid: "",
              disableChart: false,
              chartName: "Reporting Rate (Actual)",
              chartInfo: "",
              categoryInfo: "",
              chartOptions: {
                title: {
                  text: "",
                  title: "",
                  visible: false,
                },
                subTitle: {
                  text: "",
                  subTitle: "",
                  visible: false,
                },
                chartDataSource: {
                  text: "",
                },
                xAxis: {
                  title: {
                    text: "",
                  },
                  visible: false,
                },
                yAxis: {
                  title: {
                    text: "",
                  },
                  visible: true,
                },
                color: "#3bc2bb",
              },
              dataLabels: {
                enabled: true,
              },
              name: "Reporting Rate (Actual)",
              subIndicator: [
                {
                  de: [],
                  name: ["Reporting Rate (Actual)"],
                  selectedDE: [],
                  type: "indicator",
                  static_name: ["Reporting Rate (Actual)"],
                },
              ],
            },
          },
        ],
        dataOnContraceptive: "Yes",
        source: "",
        initialYear: "",
        finalYear: "",
        reportingSector: "Public Only",
        incAnnualEMU: "",
        excAnnualEMU: "",
        monthlyEMU: "",
        FPSource: {
          governmentHealth: "Yes",
          ngo: "Yes",
          privateHospital: "No",
          pharmacy: "Yes",
          shopChurchFriend: "Yes",
          otherSector: "No",
        },
      },
      Output: {
        derivedCharts: [
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Comparing EMUs and mCPR (MWRA)",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Comparing Avg Annual % pt Growth in mCPR/EMU",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Comparing Modern Users by Methods",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Trends in Users by Method",
              chartInfo: "",
              title: {
                text: "",
                visible: false,
              },
              subTitle: {
                text: "",
                visible: false,
              },
              xAxis: {
                text: "",
                visible: false,
              },
              yAxis: {
                text: "",
                visible: true,
              },
              color: "#00FF00",
            },
          },
        ],
      },
    },
  },
};

export default dqrConfig;
