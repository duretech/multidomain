/*global settings*/
/*eslint no-undef: "error"*/

//Import required packages
import Vue from "vue";
import App from "./App.vue";
//eslint-disable-next-line
import bootstrap from "bootstrap";
import { BootstrapVue } from "bootstrap-vue";
import router from "./router";
//eslint-disable-next-line
import GlobalMixin from "./helpers/GlobalMixin";
import VueSweetalert2 from "vue-sweetalert2";
import i18n from "./i18n";
import store from "./store.js";
import VueFullscreen from "vue-fullscreen";
import VueGtag from "vue-gtag";
import moment from "moment";
import Highcharts from "highcharts";
import HighchartsVue from "highcharts-vue";
import highchartsMore from "highcharts/highcharts-more";
import solidGauge from "highcharts/modules/solid-gauge";
import noData from "highcharts/modules/no-data-to-display.js";
import * as Exporting from "highcharts/modules/exporting";
import loadGantt from "highcharts/modules/gantt.js"; //Used for the scrollbar on the chart
import loadDrilldown from "highcharts/modules/drilldown.js";
import loader from "@/components/Common/Loader"; //please keep the Loader L capital as per project guidelines
import VueTour from "vue-tour";
import sidebar from "@/components/Common/Sidebar";
import header from "@/components/Common/Header";
import D2Header from "@/components/Common/D2Header";
import footer from "@/components/Common/Footer";
import JsonCSV from "vue-json-csv";
import service from "@/service";
import VuePapaParse from "vue-papa-parse";

//Import required CSS
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "sweetalert2/dist/sweetalert2.min.css";
require("vue-tour/dist/vue-tour.css");
require("@/assets/scss/custom.scss"); //Don't change this position, this should be at last only.

//Add packages to Highcharts
Exporting(Highcharts);
loadGantt(Highcharts);
loadDrilldown(Highcharts);
highchartsMore(Highcharts);
solidGauge(Highcharts);
noData(Highcharts);

//Global component registration
Vue.component("Loader", loader);
Vue.component("sidebar", sidebar);
Vue.component("Header", header);
Vue.component("D2Header", D2Header);
Vue.component("Footer", footer);
Vue.component("downloadCsv", JsonCSV);

//Global mixin registration
Vue.mixin(GlobalMixin);

//Global plugin registration
Vue.use(VueFullscreen);
Vue.use(BootstrapVue);
Vue.use(HighchartsVue);
Vue.use(VuePapaParse);
Vue.use(VueTour);

// Google Analytics. Tracking ID is coming from the 'index.html' file.
// The analytics will be auto captured for all the pages using the 'router'.
// For other events we need to add respective code.
Vue.use(
  VueGtag,
  {
    bootstrap: false,
  },
  router
);

// This is used in the Internal Consistency - Correlation chart.
Highcharts.seriesType(
  "lowmedhigh",
  "boxplot",
  {
    keys: ["low", "median", "high"],
  },
  {
    // Change point shape to a line with three crossing lines for low/median/high
    // Stroke width is hardcoded to 1 for simplicity
    drawPoints: function () {
      var series = this;
      // Highcharts.each(this.points, function(point) {
      this.points.forEach(function (point) {
        var graphic = point.graphic,
          verb = graphic ? "animate" : "attr",
          shapeArgs = point.shapeArgs,
          width = shapeArgs.width,
          left = Math.floor(shapeArgs.x) + 0.5,
          right = left + width,
          crispX = left + Math.round(width / 2) + 0.5,
          highPlot = Math.floor(point.highPlot) + 0.5,
          medianPlot = Math.floor(point.medianPlot) + 0.5,
          lowPlot = Math.floor(point.lowPlot) + 0.5 - (point.low === 0 ? 1 : 0); // Sneakily draw low marker even if 0

        if (point.isNull) {
          return;
        }

        if (!graphic) {
          point.graphic = graphic = series.chart.renderer
            .path("point")
            .add(series.group);
        }

        graphic.attr({
          stroke: point.color || series.color,
          "stroke-width": 1,
        });

        graphic[verb]({
          d: [
            "M",
            left,
            highPlot,
            "H",
            right,
            "M",
            left,
            medianPlot,
            "H",
            right,
            "M",
            left,
            lowPlot,
            "H",
            right,
            "M",
            crispX,
            highPlot,
            "V",
            lowPlot,
          ],
        });
      });
    },
  }
);

Vue.prototype.$moment = moment;
Vue.config.productionTip = false;

//Set default options for Highcharts
Highcharts.setOptions({
  lang: {
    thousandsSep: ",",
  },
});

//Sweetalert2 global options
const options = {
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  allowOutsideClick: false,
};
Vue.use(VueSweetalert2, options);

// Create instance of the Vue and rendering it to the 'index.html' page
const app = new Vue({
  i18n, // Inject the localization [i18n] library for the translations
  store, // Inject the vuex store to manage the state values
  router, // Inject router
  render: (h) => h(App), // Render the app
}).$mount("#app");

// Executes before entering to the actual route [page], to check the required permissions and allowed modules
router.beforeEach((to, from, next) => {
  store.commit("setLoading", true);
  // Check if user accidentally clears the sessionStorage which contains the store needed for the project
  if (store.getters.getIsClearCache) {
    next();
  } else {
    //Check for the base url
    if (!store.getters.getBaseURL) {
      next("/");
      store.commit("setLoading", false);
      app.$swal({
        title: i18n.t("noBaseURL"),
        confirmButtonText: i18n.t("ok"),
      });
    } else {
      // Check for the user details
      if (!store.getters.getUserDetails) {
        next("/");
        store.commit("setLoading", false);
        app.$swal({
          title: i18n.t("noUserDetails"),
          confirmButtonText: i18n.t("ok"),
        });
      } else {
        // Check for the user role
        if (store.getters.getIsAdmin) {
          // For the Admin users
          next();
        } else {
          // For the Non-admin users, we need to check the allowed routes from the 'store'.
          if (
            (store.getters.getAppSettings.bypassUser && to.name !== "admin") ||
            store.getters.getUserPermissions.routes.includes(to.name)
          ) {
            next();
          } else {
            next("/");
            store.commit("setLoading", false);
            app.$swal({
              title: i18n.t("noModules"),
              confirmButtonText: i18n.t("ok"),
            });
          }
        }
      }
    } //end of else
  }
});

// Executes after entering to the actual route [page], just to close the loader
router.afterEach((to) => {
  if (to.name === "Dashboard") {
    store.commit(
      "setNamespace",
      store.getters.getAppSettings.tableName || settings.tableName
    );
  }
  service.applyTheme();
  store.commit("setLoading", false);
});
