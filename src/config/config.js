const metaConfig = {
  userManagement: {
    grouping: [
      {
        label: "A",
        modules: [
          "interactive_dashboard-default",
          "summary_dashboard-fp",
          "analytical_dashboard-fp",
          "DQR-fp",
          "mapVisualization-fp",
        ],
        deletable: false,
      },
      {
        label: "B",
        modules: [
          "interactive_dashboard-default",
          "summary_dashboard-mnch",
          "analytical_dashboard-mnch",
          "DQR-mnch",
          "mapVisualization-mnch",
        ],
        deletable: false,
      },
      {
        label: "C",
        modules: [
          "interactive_dashboard-default",
          "summary_dashboard-fp",
          "analytical_dashboard-fp",
          "DQR-fp",
          "mapVisualization-fp",
          "summary_dashboard-mnch",
          "analytical_dashboard-mnch",
          "DQR-mnch",
          "mapVisualization-mnch",
        ],
        deletable: false,
      },
    ],
  },
  applicationModule: {
    defaultLanguageLocale: "en",
    defaultColorTheme: "grey",
    landingPageLogo: "",
    landingPageBGImg: "",
    landingPageTitle: {},
    landingPageDesc: {},
    defaultLevelID: "",
    subLevelID: "",
    defaultLocationID: [],
    debugging: false,
    debuggingLevel: "API",
    footerLogo: false,
    // dureLogo: false,
    // trackLogo: false,
  },
};

export default metaConfig;
