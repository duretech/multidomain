import Vue from "vue";
import VueRouter from "vue-router";
import DashboardNew from "@/pages/DashboardNew";
import Dashboard from "@/pages/Dashboard";
import i18n from "../i18n";

Vue.use(VueRouter);
/**
 * @author Ravindra Bagul
 * @description Application routes.
 * ! Except Dashboard route, all other routes are lazy loaded
 * ! meta: used to add the browser title for each route
 * @param null
 * @returns null
 */
const router = new VueRouter({
  routes: [
    {
      path: "/",
      name: "Dashboard",
      component: DashboardNew, //! Do not add lazy loading for this route
      meta: () => ({ title: i18n.t("dashboard") }),
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard, //! Do not add lazy loading for this route
      // component: () =>
      // import(/*webpackChunkName: 'FPMNCHDashboard'*/ "@/pages/Dashboard"),
      meta: () => ({ title: i18n.t("dashboard") }),
      props: true,
    },
    {
      path: "/dynamicDashboard",
      name: "dynamicDashboard",
      component: () =>
        import(
          /*webpackChunkName: 'DynamicDashboard'*/ "@/pages/DynamicDashboard"
        ),
    },
    {
      path: "/integrated-dashboard",
      name: "integrated-dashboard",
      component: () =>
        import(
          /*webpackChunkName: 'IntegratedDashboard'*/ "@/pages/IntegratedDashboard"
        ),
      meta: () => ({ title: i18n.t("integratedDashboard") }),
    },
    {
      path: "/report",
      name: "report",
      component: () => import(/*webpackChunkName: 'Report'*/ "@/pages/Report"),
      meta: () => ({ title: i18n.t("reportTitle") }),
    },
    {
      path: "/admin",
      name: "admin",
      component: () =>
        import(/*webpackChunkName: 'admin'*/ "@/pages/configNew"),
      meta: () => ({ title: i18n.t("adminTitle") }),
    },
    {
      path: "/map",
      name: "map",
      component: () =>
        import(/*webpackChunkName: 'MapIndicator'*/ "@/pages/MapIndicator"),
      meta: () => ({ title: i18n.t("mapVisualization") }),
    },
    {
      path: "/SummaryDashboard",
      name: "SummaryDashboard",
      component: () =>
        import(
          /*webpackChunkName: 'SummaryDashboard'*/ "@/pages/SummaryDashboard"
        ),
      meta: () => ({ title: i18n.t("summary_dashboard") }),
      props: true,
    },
    {
      path: "/InteractiveDashboard",
      name: "InteractiveDashboard",
      component: () =>
        import(
          /*webpackChunkName: 'InteractiveDashboard'*/ "@/pages/InteractiveDashboard"
        ),
      meta: () => ({ title: i18n.t("interactive_dashboard") }),
    },
    {
      path: "/AnalyticalDashboard",
      name: "AnalyticalDashboard",
      component: () =>
        import(
          /*webpackChunkName: 'AnalyticalDashboard'*/ "@/pages/Analytical"
        ),
      meta: () => ({ title: i18n.t("analytical_dashboard") }),
    },
    {
      path: "/DQRDashboard",
      name: "DQRDashboard",
      component: () =>
        import(/*webpackChunkName: 'DQRDashboard'*/ "@/pages/Dqr"),
      meta: () => ({ title: i18n.t("DQR") }),
      props: true,
    },
    {
      path: "/SavedFavorites",
      name: "SavedFavorites",
      component: () =>
        import(/*webpackChunkName: 'SavedFav'*/ "@/pages/SavedFav"),
      meta: () => ({ title: i18n.t("saved") }),
    },
  ],
});

export default router;
