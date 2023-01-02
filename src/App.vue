<template>
  <!-- <div id="mainbody" :class="$store.state.currentTheme"> Should be used once themes implemented-->
  <div>
    
    <Loader v-if="$store.state.loading" />
    <sidebar
      @getMenu="getMenu"
      :flagData="flagData"
      :configData="configData"
      :configDataFP="configDataFP"
    ></sidebar>
    <!-- :key="$route.path" -->
    <router-view
      @flag="flag"
      :key="computedDOM"
      :sideMenu="sideMenu"
      @langChange="langChange"
      @activateTour="activateTour"
      :dataElements="dataElements"
      @getConfigData="getConfigData"
      @getConfigDataFP="getConfigDataFP"
    ></router-view>
    <v-tour name="myTour" :steps="steps"></v-tour>
    <!-- <Chatbot /> -->
  </div>
</template>
<script>
// import service from "@/service"
import { loadLanguage } from "@/i18n";
export default {
  name: "App",
  data() {
    return {
      dataElements: [],
      configData: null,
      configDataFP: null,
      sideMenu: [],
      flagData: {},
      appTour: {},
      steps: [],
      langChangeDOM: 0,
    };
  },
  // provide() {
  // 	const appTourData = {};

  // 	Object.defineProperty(appTourData, "tour", {
  // 		enumerable: true,
  // 		get: () => this.appTour,
  // 	});

  // 	return {
  // 		appTourData,
  // 	};
  // },
  computed: {
    computedDOM() {
      return `${this.$route.path}-${this.langChangeDOM}`;
    },
  },
  methods: {
    async langChange(lang) {
      await loadLanguage(lang);
      this.$store.commit("setLangChanged", true);
      this.langChangeDOM++;
    },
    activateTour() {
      this.steps = this.appTour[this.$route.name];
      if (this.appTour[this.$route.name]) {
        this.$nextTick(() => {
          this.$tours["myTour"].start();
        });
      } else {
        this.genericAlert("Oops...", "No Tour Available");
      }
    },
    getConfigDataFP(data) {
      this.configDataFP = data;
    },
    getConfigData(data) {
      // console.log("in app", data)
      this.configData = data;
    },
    getMenu(menu) {
      this.sideMenu = menu;
    },
    flag(flagDetails) {
      // console.log("in app", JSON.parse(JSON.stringify(flagDetails)));
      this.flagData = JSON.parse(JSON.stringify(flagDetails)); //refer https://v2.vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats
    },
  },
  created() {
    let fontSize = 16;
    document.getElementById("mainHTML").style.fontSize = `${fontSize}px`;
    this.$store.commit("setBaseFontSize", fontSize);
    this.$store.commit("setDefaultFontSize", fontSize);
  },
  mounted() {
    // let dataElementsList = service.getDataElements();
    // dataElementsList.then((dataElementsList) => {
    //   console.log("dataElementsList", dataElementsList);
    //   this.dataElements = dataElementsList.data.dataElements
    // });
    this.appTour = {
      Dashboard: [
        {
          target: '[data-v-step="2"]',
          header: {
            title: "Get Started",
          },
          content: "Application description can be edited from Admin panel.",
          params: {
            placement: "top", // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
          },
        },
        {
          target: "#dropdown-1", // We're using document.querySelector() under the hood
          content: `Select your Dashboard`,
          params: {
            placement: "right", // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
          },
        },
        {
          target: ".v-step-1",
          content:
            "This is Integrated Family Planning and Maternal Health Dashboard!",
        },
      ],
      "mnch-dashboard": [
        {
          target: ".modules-wrap",
          content: "These are the common modules!",
        },
        {
          target: ".linked-btn",
          content:
            "This section shows linked modules created from the Interactive Dashboard!",
        },
      ],
    };
  },
};
</script>
