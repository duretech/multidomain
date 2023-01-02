const metaConfig = {
	userManagement: {
		grouping: [
			{
				label: "A",
				modules: [
					"interactive-default",
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
					"interactive-default",
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
					"interactive-default",
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
		appName: "",
		appDesc: "",
		appLogo: " ",
		defaultLanguage: "en",
		defaultLanguageLocale: "en",
		defaultColorTheme: "#3471CE",
		landingPageLogo: "",
		leaderIcon: "",
		leaderDesignation: "Director for the Centre of M&E and Advocacy",
		leaderDesc:
			"Dr. Xyz Jorge joined Avenir Health in 2009. She currently leads activities that focus on monitoring of health programs...",
		landingPageBGImg: "",
		landingPageTitle: "",
		landingPageDesc: "",
		fbLink: "",
		instaLink: "",
		twitterLink: "",
		youTubeLink: "",
		defaultLevelID: "",
		subLevelID: "",
		defaultLocationID: [],
		startingYear: "2007",
		debugging: false,
		debuggingLevel: "API",
	},
};

export default metaConfig;
