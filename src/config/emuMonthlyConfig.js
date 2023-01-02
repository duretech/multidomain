const dqrConfig = {
  dqrModule: {
    emu_monthly: {
      Background_Data: {
        SStoEMUType: "Yearly",
        FPWomenPopulation: "MWRA",
        SSDataRecentYear: "2018",
        autoSaveEMU: "Commodities_Client",
        emuSaveType: "Custom",
        bgDataSource: "Datastore",
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
                name: "RMNCH",
                color: "#e373c9",
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "mcpr_rmnch",
                    displayName: "mcpr_rmnch",
                    static_displayName: "",
                  },
                ],
                type: "data_element",
                static_name: "RMNCH",
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
                name: "Government Health facilities and home",
                color: "#0000bb",
                selectedDE: [],
                type: "data_element",
                static_name: "Government Health facilities and home",
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
                    id: "prevalence_sterilization_female Public Sector",
                    displayName:
                      "prevalence_sterilization_female Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_sterilization_female Private Sector NGO",
                    displayName:
                      "prevalence_sterilization_female Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_sterilization_female Private Sector Pharmacy",
                    displayName:
                      "prevalence_sterilization_female Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_sterilization_female Private Sector Hospital",
                    displayName:
                      "prevalence_sterilization_female Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_sterilization_female Other Sector Other",
                    displayName:
                      "prevalence_sterilization_female Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_sterilization_female Other Sector Shop",
                    displayName:
                      "prevalence_sterilization_female Other Sector Shop",
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
                    id: "prevalence_sterilization_male Public Sector",
                    displayName: "prevalence_sterilization_male Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_sterilization_male Private Sector NGO",
                    displayName:
                      "prevalence_sterilization_male Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_sterilization_male Private Sector Pharmacy",
                    displayName:
                      "prevalence_sterilization_male Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_sterilization_male Private Sector Hospital",
                    displayName:
                      "prevalence_sterilization_male Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_sterilization_male Other Sector Other",
                    displayName:
                      "prevalence_sterilization_male Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_sterilization_male Other Sector Shop",
                    displayName:
                      "prevalence_sterilization_male Other Sector Shop",
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
            key: "IUD",
            static_name: "IUD",
            subIndicators: [
              {
                name: "Copper- T 380-A IUD",
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "prevalence_iud_coppert Public Sector",
                    displayName: "prevalence_iud_coppert Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_iud_coppert Private Sector NGO",
                    displayName: "prevalence_iud_coppert Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_iud_coppert Private Sector Pharmacy",
                    displayName:
                      "prevalence_iud_coppert Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_iud_coppert Private Sector Hospital",
                    displayName:
                      "prevalence_iud_coppert Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_iud_coppert Other Sector Other",
                    displayName: "prevalence_iud_coppert Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_iud_coppert Other Sector Shop",
                    displayName: "prevalence_iud_coppert Other Sector Shop",
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
                    id: "prevalence_iud_lng_ius Public Sector",
                    displayName: "prevalence_iud_lng_ius Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_iud_lng_ius Private Sector NGO",
                    displayName: "prevalence_iud_lng_ius Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_iud_lng_ius Private Sector Pharmacy",
                    displayName:
                      "prevalence_iud_lng_ius Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_iud_lng_ius Private Sector Hospital",
                    displayName:
                      "prevalence_iud_lng_ius Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_iud_lng_ius Other Sector Other",
                    displayName: "prevalence_iud_lng_ius Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_iud_lng_ius Other Sector Shop",
                    displayName: "prevalence_iud_lng_ius Other Sector Shop",
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
                    id: "prevalence_implant_implanon Public Sector",
                    displayName: "prevalence_implant_implanon Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_implant_implanon Private Sector NGO",
                    displayName:
                      "prevalence_implant_implanon Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_implant_implanon Private Sector Pharmacy",
                    displayName:
                      "prevalence_implant_implanon Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_implant_implanon Private Sector Hospital",
                    displayName:
                      "prevalence_implant_implanon Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_implant_implanon Other Sector Other",
                    displayName:
                      "prevalence_implant_implanon Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_implant_implanon Other Sector Shop",
                    displayName:
                      "prevalence_implant_implanon Other Sector Shop",
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
                    id: "prevalence_implant_jadelle Public Sector",
                    displayName: "prevalence_implant_jadelle Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_implant_jadelle Private Sector NGO",
                    displayName:
                      "prevalence_implant_jadelle Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_implant_jadelle Private Sector Pharmacy",
                    displayName:
                      "prevalence_implant_jadelle Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_implant_jadelle Private Sector Hospital",
                    displayName:
                      "prevalence_implant_jadelle Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_implant_jadelle Other Sector Other",
                    displayName:
                      "prevalence_implant_jadelle Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_implant_jadelle Other Sector Shop",
                    displayName: "prevalence_implant_jadelle Other Sector Shop",
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
                    id: "prevalence_implant_sino Public Sector",
                    displayName: "prevalence_implant_sino Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_implant_sino Private Sector NGO",
                    displayName: "prevalence_implant_sino Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_implant_sino Private Sector Pharmacy",
                    displayName:
                      "prevalence_implant_sino Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_implant_sino Private Sector Hospital",
                    displayName:
                      "prevalence_implant_sino Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_implant_sino Other Sector Other",
                    displayName: "prevalence_implant_sino Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_implant_sino Other Sector Shop",
                    displayName: "prevalence_implant_sino Other Sector Shop",
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
                    id: "prevalence_injectable_dmpa Public Sector",
                    displayName: "prevalence_injectable_dmpa Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_injectable_dmpa Private Sector NGO",
                    displayName:
                      "prevalence_injectable_dmpa Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_injectable_dmpa Private Sector Pharmacy",
                    displayName:
                      "prevalence_injectable_dmpa Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_injectable_dmpa Private Sector Hospital",
                    displayName:
                      "prevalence_injectable_dmpa Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_injectable_dmpa Other Sector Other",
                    displayName:
                      "prevalence_injectable_dmpa Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_injectable_dmpa Other Sector Shop",
                    displayName: "prevalence_injectable_dmpa Other Sector Shop",
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
                    id: "prevalence_injectable_neten Public Sector",
                    displayName: "prevalence_injectable_neten Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_injectable_neten Private Sector NGO",
                    displayName:
                      "prevalence_injectable_neten Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_injectable_neten Private Sector Pharmacy",
                    displayName:
                      "prevalence_injectable_neten Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_injectable_neten Private Sector Hospital",
                    displayName:
                      "prevalence_injectable_neten Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_injectable_neten Other Sector Other",
                    displayName:
                      "prevalence_injectable_neten Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_injectable_neten Other Sector Shop",
                    displayName:
                      "prevalence_injectable_neten Other Sector Shop",
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
                    id: "prevalence_injectable_lunelle Public Sector",
                    displayName: "prevalence_injectable_lunelle Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_injectable_lunelle Private Sector NGO",
                    displayName:
                      "prevalence_injectable_lunelle Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_injectable_lunelle Private Sector Pharmacy",
                    displayName:
                      "prevalence_injectable_lunelle Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_injectable_lunelle Private Sector Hospital",
                    displayName:
                      "prevalence_injectable_lunelle Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_injectable_lunelle Other Sector Other",
                    displayName:
                      "prevalence_injectable_lunelle Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_injectable_lunelle Other Sector Shop",
                    displayName:
                      "prevalence_injectable_lunelle Other Sector Shop",
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
                    id: "prevalence_injectable_sayana_press Public Sector",
                    displayName:
                      "prevalence_injectable_sayana_press Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_injectable_sayana_press Private Sector NGO",
                    displayName:
                      "prevalence_injectable_sayana_press Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_injectable_sayana_press Private Sector Pharmacy",
                    displayName:
                      "prevalence_injectable_sayana_press Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_injectable_sayana_press Private Sector Hospital",
                    displayName:
                      "prevalence_injectable_sayana_press Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_injectable_sayana_press Other Sector Other",
                    displayName:
                      "prevalence_injectable_sayana_press Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_injectable_sayana_press Other Sector Shop",
                    displayName:
                      "prevalence_injectable_sayana_press Other Sector Shop",
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
                    id: "prevalence_injectable_other Public Sector",
                    displayName: "prevalence_injectable_other Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_injectable_other Private Sector NGO",
                    displayName:
                      "prevalence_injectable_other Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_injectable_other Private Sector Pharmacy",
                    displayName:
                      "prevalence_injectable_other Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_injectable_other Private Sector Hospital",
                    displayName:
                      "prevalence_injectable_other Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_injectable_other Other Sector Other",
                    displayName:
                      "prevalence_injectable_other Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_injectable_other Other Sector Shop",
                    displayName:
                      "prevalence_injectable_other Other Sector Shop",
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
                    id: "prevalence_pill_coc Public Sector",
                    displayName: "prevalence_pill_coc Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_pill_coc Private Sector NGO",
                    displayName: "prevalence_pill_coc Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_pill_coc Private Sector Pharmacy",
                    displayName: "prevalence_pill_coc Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_pill_coc Private Sector Hospital",
                    displayName: "prevalence_pill_coc Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_pill_coc Other Sector Other",
                    displayName: "prevalence_pill_coc Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_pill_coc Other Sector Shop",
                    displayName: "prevalence_pill_coc Other Sector Shop",
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
                    id: "prevalence_pill_pop Public Sector",
                    displayName: "prevalence_pill_pop Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_pill_pop Private Sector NGO",
                    displayName: "prevalence_pill_pop Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_pill_pop Private Sector Pharmacy",
                    displayName: "prevalence_pill_pop Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_pill_pop Private Sector Hospital",
                    displayName: "prevalence_pill_pop Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_pill_pop Other Sector Other",
                    displayName: "prevalence_pill_pop Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_pill_pop Other Sector Shop",
                    displayName: "prevalence_pill_pop Other Sector Shop",
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
                    id: "prevalence_pill_other Public Sector",
                    displayName: "prevalence_pill_other Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_pill_other Private Sector NGO",
                    displayName: "prevalence_pill_other Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_pill_other Private Sector Pharmacy",
                    displayName:
                      "prevalence_pill_other Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_pill_other Private Sector Hospital",
                    displayName:
                      "prevalence_pill_other Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_pill_other Other Sector Other",
                    displayName: "prevalence_pill_other Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_pill_other Other Sector Shop",
                    displayName: "prevalence_pill_other Other Sector Shop",
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
                selectedDE: [],
                selectedDatastoreDE: [
                  {
                    id: "prevalence_condom_male Public Sector",
                    displayName: "prevalence_condom_male Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_condom_male Private Sector NGO",
                    displayName: "prevalence_condom_male Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_condom_male Private Sector Pharmacy",
                    displayName:
                      "prevalence_condom_male Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_condom_male Private Sector Hospital",
                    displayName:
                      "prevalence_condom_male Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_condom_male Other Sector Other",
                    displayName: "prevalence_condom_male Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_condom_male Other Sector Shop",
                    displayName: "prevalence_condom_male Other Sector Shop",
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
                    id: "prevalence_condom_female Public Sector",
                    displayName: "prevalence_condom_female Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_condom_female Private Sector NGO",
                    displayName: "prevalence_condom_female Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_condom_female Private Sector Pharmacy",
                    displayName:
                      "prevalence_condom_female Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_condom_female Private Sector Hospital",
                    displayName:
                      "prevalence_condom_female Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_condom_female Other Sector Other",
                    displayName: "prevalence_condom_female Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_condom_female Other Sector Shop",
                    displayName: "prevalence_condom_female Other Sector Shop",
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
                    id: "prevalence_omm_lam Public Sector",
                    displayName: "prevalence_omm_lam Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_omm_lam Private Sector NGO",
                    displayName: "prevalence_omm_lam Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_omm_lam Private Sector Pharmacy",
                    displayName: "prevalence_omm_lam Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_omm_lam Private Sector Hospital",
                    displayName: "prevalence_omm_lam Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_omm_lam Other Sector Other",
                    displayName: "prevalence_omm_lam Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_omm_lam Other Sector Shop",
                    displayName: "prevalence_omm_lam Other Sector Shop",
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
                    id: "prevalence_omm_sdm Public Sector",
                    displayName: "prevalence_omm_sdm Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_omm_sdm Private Sector NGO",
                    displayName: "prevalence_omm_sdm Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_omm_sdm Private Sector Pharmacy",
                    displayName: "prevalence_omm_sdm Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_omm_sdm Private Sector Hospital",
                    displayName: "prevalence_omm_sdm Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_omm_sdm Other Sector Other",
                    displayName: "prevalence_omm_sdm Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_omm_sdm Other Sector Shop",
                    displayName: "prevalence_omm_sdm Other Sector Shop",
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
                    id: "prevalence_omm_vb Public Sector",
                    displayName: "prevalence_omm_vb Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_omm_vb Private Sector NGO",
                    displayName: "prevalence_omm_vb Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_omm_vb Private Sector Pharmacy",
                    displayName: "prevalence_omm_vb Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_omm_vb Private Sector Hospital",
                    displayName: "prevalence_omm_vb Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_omm_vb Other Sector Other",
                    displayName: "prevalence_omm_vb Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_omm_vb Other Sector Shop",
                    displayName: "prevalence_omm_vb Other Sector Shop",
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
                    id: "prevalence_omm_spermicides Public Sector",
                    displayName: "prevalence_omm_spermicides Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_omm_spermicides Private Sector NGO",
                    displayName:
                      "prevalence_omm_spermicides Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_omm_spermicides Private Sector Pharmacy",
                    displayName:
                      "prevalence_omm_spermicides Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_omm_spermicides Private Sector Hospital",
                    displayName:
                      "prevalence_omm_spermicides Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_omm_spermicides Other Sector Other",
                    displayName:
                      "prevalence_omm_spermicides Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_omm_spermicides Other Sector Shop",
                    displayName: "prevalence_omm_spermicides Other Sector Shop",
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
                    id: "prevalence_ec Public Sector",
                    displayName: "prevalence_ec Public Sector",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_ec Private Sector NGO",
                    displayName: "prevalence_ec Private Sector NGO",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_ec Private Sector Pharmacy",
                    displayName: "prevalence_ec Private Sector Pharmacy",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_ec Private Sector Hospital",
                    displayName: "prevalence_ec Private Sector Hospital",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_ec Other Sector Other",
                    displayName: "prevalence_ec Other Sector Other",
                    static_displayName: "",
                  },
                  {
                    id: "prevalence_ec Other Sector Shop",
                    displayName: "prevalence_ec Other Sector Shop",
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
      Commodities_Client: {
        disableChart: false,
        initialYear: "",
        finalYear: "",
        derivedCharts: [
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "EMU vs CYPs/Pop",
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
                text: "Value by Method",
                visible: true,
              },
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "New Users",
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
                text: "Value by Method",
                visible: true,
              },
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "New Users/Total Users/Total CYP",
              chartInfo: "",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Comparing EMU to mCPR",
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
                text: "Value by Method",
                visible: true,
              },
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Trends in EMU by Method",
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
                text: "Value by Method",
                visible: true,
              },
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Method-Specific EMU Trend",
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
                text: "Value by Method",
                visible: true,
              },
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Month EMU by Method",
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
                text: "Value by Method",
                visible: true,
              },
            },
          },
        ],
        chartData: [
          {
            indicator: {
              name: "Sterilization",
              source: "Commodities distributed to client",
              color: "#c87776",
              visible: true,
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
              name: "IUD",
              source: "Commodities distributed to client",
              visible: false,
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
              color: "#47c49a",
              static_name: "IUD",
              methodType: "Long Term",
            },
          },
          {
            indicator: {
              name: "Implant",
              source: "Commodities distributed to client",
              visible: false,
              color: "#8DC645",
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
              name: "Injectable",
              source: "Commodities distributed to client",
              visible: false,
              color: "#5287cd",
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
              name: "Pill",
              source: "Commodities distributed to client",
              visible: false,
              color: "#70aedf",
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
              name: "Condom",
              source: "Commodities distributed to client",
              visible: false,
              color: "#fcb241",
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
              name: "Other Modern Methods",
              source: "Commodities distributed to client",
              visible: false,
              color: "#78a095",
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
              name: "Emergency contraception",
              source: "Commodities distributed to client",
              visible: false,
              color: "#dd8ab8",
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
              name: "Total CYP",
              source: "Commodities distributed to client",
              static_name: "Total CYP",
              methodType: "Short Term",
              subIndicator: [],
              color: "#439aa3",
            },
          },
        ],
      },
      Commodities_Facilities: {
        disableChart: false,
        initialYear: "",
        finalYear: "",
        derivedCharts: [
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "EMU vs CYPs/Pop",
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
                text: "Value by Method",
                visible: true,
              },
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "New Users",
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
                text: "Value by Method",
                visible: true,
              },
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "New Users/Total Users/Total CYP",
              chartInfo: "",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Comparing EMU to mCPR",
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
                text: "Value by Method",
                visible: true,
              },
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Trends in EMU by Method",
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
                text: "Value by Method",
                visible: true,
              },
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Method-Specific EMU Trend",
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
                text: "Value by Method",
                visible: true,
              },
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Month EMU by Method",
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
                text: "Value by Method",
                visible: true,
              },
            },
          },
        ],
        chartData: [
          {
            indicator: {
              name: "Sterilization",
              source: "Commodities distributed to facilities",
              color: "#c87776",
              visible: true,
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
              name: "IUD",
              source: "Commodities distributed to facilities",
              visible: false,
              color: "#47c49a",
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
              name: "Implant",
              source: "Commodities distributed to facilities",
              visible: false,
              color: "#8DC645",
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
              name: "Injectable",
              source: "Commodities distributed to facilities",
              visible: false,
              color: "#5287cd",
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
              name: "Pill",
              source: "Commodities distributed to facilities",
              visible: false,
              color: "#70aedf",
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
              name: "Condom",
              source: "Commodities distributed to facilities",
              visible: false,
              color: "#fcb241",
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
              name: "Other Modern Methods",
              source: "Commodities distributed to facilities",
              visible: false,
              color: "#78a095",
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
              name: "Emergency contraception",
              source: "Commodities distributed to facilities",
              visible: false,
              color: "#dd8ab8",
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
              name: "Total CYP",
              source: "Commodities distributed to facilities",
              static_name: "Total CYP",
              methodType: "Short Term",
              subIndicator: [],
              color: "#439aa3",
            },
          },
        ],
      },
      Visits: {
        disableChart: false,
        initialYear: "",
        finalYear: "",
        derivedCharts: [
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "EMU vs CYPs/Pop",
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
                text: "Value by Method",
                visible: true,
              },
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "New Users",
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
                text: "Value by Method",
                visible: true,
              },
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "New Users/Total Users/Total CYP",
              chartInfo: "",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Comparing EMU to mCPR",
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
                text: "Value by Method",
                visible: true,
              },
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Trends in EMU by Method",
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
                text: "Value by Method",
                visible: true,
              },
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Method-Specific EMU Trend",
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
                text: "Value by Method",
                visible: true,
              },
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Month EMU by Method",
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
                text: "Value by Method",
                visible: true,
              },
            },
          },
        ],
        chartData: [
          {
            indicator: {
              name: "Sterilization",
              source: "FP Visits",
              color: "#c87776",
              visible: true,
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
              name: "IUD",
              source: "FP Visits",
              visible: false,
              color: "#47c49a",
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
              name: "Implant",
              source: "FP Visits",
              visible: false,
              color: "#8DC645",
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
              name: "Injectable",
              source: "FP Visits",
              visible: false,
              color: "#5287cd",
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
              name: "Pill",
              source: "FP Visits",
              visible: false,
              color: "#70aedf",
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
                  cyp: "0.066666667",
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
              name: "Condom",
              source: "FP Visits",
              visible: false,
              color: "#fcb241",
              subIndicator: [
                {
                  de: [],
                  name: ["Male Condom"],
                  selectedDE: [],
                  color: "#fcb241",
                  type: "data_element",
                  benchmarkingLogic: false,
                  key: "Condom",
                  cyp: "0.008333333",
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
              name: "Other Modern Methods",
              source: "FP Visits",
              visible: false,
              color: "#78a095",
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
              name: "Emergency contraception",
              source: "FP Visits",
              visible: false,
              color: "#dd8ab8",
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
              name: "Total CYP",
              source: "FP Visits",
              static_name: "Total CYP",
              methodType: "Short Term",
              subIndicator: [],
              color: "#439aa3",
            },
          },
        ],
      },
      User: {
        disableChart: false,
        initialYear: "",
        finalYear: "",
        derivedCharts: [
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "EMU vs CYPs/Pop",
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
                text: "Value by Method",
                visible: true,
              },
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "New Users",
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
                text: "Value by Method",
                visible: true,
              },
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "New Users/Total Users/Total CYP",
              chartInfo: "",
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Comparing EMU to mCPR",
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
                text: "Value by Method",
                visible: true,
              },
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Trends in EMU by Method",
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
                text: "Value by Method",
                visible: true,
              },
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Method-Specific EMU Trend",
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
                text: "Value by Method",
                visible: true,
              },
            },
          },
          {
            chartOptions: {
              cid: "",
              disableChart: false,
              chartName: "Month EMU by Method",
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
                text: "Value by Method",
                visible: true,
              },
            },
          },
        ],
        chartData: [
          {
            indicator: {
              name: "Sterilization",
              source: "Users",
              color: "#c87776",
              visible: true,
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
              name: "IUD",
              source: "Users",
              visible: false,
              color: "#47c49a",
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
              name: "Implant",
              source: "Users",
              visible: false,
              color: "#8DC645",
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
              name: "Injectable",
              source: "Users",
              visible: false,
              color: "#5287cd",
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
              name: "Pill",
              source: "Users",
              visible: false,
              color: "#70aedf",
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
              name: "Condom",
              source: "Users",
              visible: false,
              color: "#fcb241",
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
              name: "Other Modern Methods",
              source: "Users",
              visible: false,
              color: "#78a095",
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
              name: "Emergency contraception",
              source: "Users",
              visible: false,
              color: "#dd8ab8",
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
              name: "Total CYP",
              source: "Users",
              static_name: "Total CYP",
              methodType: "Short Term",
              subIndicator: [],
              color: "#439aa3",
            },
          },
        ],
      },
    },
  },
};

export default dqrConfig;
