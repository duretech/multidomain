import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "@/pages/DashboardNew";
import i18n from "../i18n";

Vue.use(VueRouter);

const router = new VueRouter({
	routes: [
		{
			path: "/",
			name: "Dashboard",
			component: Dashboard,
			meta: () => ({ title: i18n.t("dashboard") }),
		},
		{
			path: "/fp-dashboard",
			name: "fp-dashboard",
			component: () =>
				import(/*webpackChunkName: 'FPMNCHDashboard'*/ "@/pages/Dashboard"),
			meta: () => ({ title: i18n.t("family_planning") }),
			props: true,
		},
		{
			path: "/mnch-dashboard",
			name: "mnch-dashboard",
			component: () =>
				import(/*webpackChunkName: 'FPMNCHDashboard'*/ "@/pages/Dashboard"),
			meta: () => ({ title: i18n.t("maternal_newborn_and_child_health") }),
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
				import(
					/*webpackChunkName: 'MapIndicator'*/ "@/pages/FPDashboard/MapIndicator"
				),
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
		// {
		// 	path: "/summary-dashboard",
		// 	name: "summary-dashboard",
		// 	component: () =>
		// 		import(
		// 			/*webpackChunkName: 'summary-dashboard'*/ "@/pages/FPDashboard/MinisterialPage"
		// 		),
		// 	meta: () => ({ title: i18n.t("summary_dashboard") }),
		// },
		{
			path: "/InteractiveDashboard",
			name: "InteractiveDashboard",
			component: () =>
				import(
					/*webpackChunkName: 'InteractiveDashboard'*/ "@/pages/InteractiveDashboard"
				),
			meta: () => ({ title: i18n.t("interactive") }),
		},
		{
			path: "/AnalyticalDashboard",
			name: "AnalyticalDashboard",
			component: () =>
				import(
					/*webpackChunkName: 'AnalyticalDashboard'*/ "@/pages/Analytical"
				),
			meta: () => ({ title: i18n.t("analytical") }),
		},
		// {
		// 	path: "/analytical-dashboard",
		// 	name: "analytical-dashboard",
		// 	component: () =>
		// 		import(
		// 			/*webpackChunkName: 'analytical-dashboard'*/ "@/pages/FPDashboard/AnalyticalDashboard"
		// 		),
		// 	meta: () => ({ title: i18n.t("analytical") }),
		// },
		// {
		// 	path: "/new-analytical-dashboard",
		// 	name: "new-analytical-dashboard",
		// 	component: () =>
		// 		import(
		// 			/*webpackChunkName: 'new-analytical-dashboard'*/ "@/pages/FPDashboard/AnalyticalDashboardNew"
		// 		),
		// 	meta: () => ({ title: i18n.t("analytical") }),
		// },
		{
			path: "/DQRDashboard",
			name: "DQRDashboard",
			component: () =>
				import(/*webpackChunkName: 'DQRDashboard'*/ "@/pages/Dqr"),
			meta: () => ({ title: i18n.t("dataQuality") }),
			props: true,
		},
		// {
		// 	path: "/dqr-dashboard",
		// 	name: "dqr-dashboard",
		// 	component: () =>
		// 		import(
		// 			/*webpackChunkName: 'dqr-dashboard'*/ "@/pages/FPDashboard/DQRDashboard"
		// 		),
		// 	meta: () => ({ title: i18n.t("dataQuality") }),
		// 	props: true,
		// },
		{
			path: "/SavedFavorites",
			name: "SavedFavorites",
			component: () =>
				import(/*webpackChunkName: 'SavedFavorites'*/ "@/pages/SavedFav"),
			meta: () => ({ title: i18n.t("favoritesTitle") }),
		},
	],
});

export default router;
