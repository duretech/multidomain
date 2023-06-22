<template>
  <div>
    <div class="home-modules-div select-admin">
      <b-row>
        <b-col
          class="px-0"
          v-for="(module, i) in moduleList"
          :key="'module' + i"
        >
          <a
            class="module-link"
            @click.prevent="goTo(module.route, module.popup)"
          >
            <div class="module-div-sect" :class="module.divClass">
              <div class="module-div" :class="module.innerDivClass">
                <img
                  :src="require(`@/assets/${module.img}`)"
                  class="img-fluid module-icon"
                />
              </div>
              <div class="semi-circle"></div>
            </div>
            <h4 class="module-name fs-17-1920">
              {{ module.name }}
            </h4>
          </a>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
/*global settings*/
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
export default {
  props: ["isFromAdmin"],
  mixins: [DynamicImageMixin],
  computed: {
    moduleList() {
      let permission = this.$store.getters.getUserPermissions;
      let dashboards = this.$store.getters.getIsAdmin
        ? ["fp", "mnch"]
        : permission.dashboards || [];
      let dashboard = dashboards.find((d) =>
        this.$store.getters.getNamespace.includes(`_${d}-`)
      );
      let m = this.$store.getters.getIsAdmin
        ? [
            `summary_dashboard-${dashboard}`,
            `analytical_dashboard-${dashboard}`,
            `DQR-${dashboard}`,
            `mapVisualization-${dashboard}`,
          ]
        : permission.modules || [];
      let modules = [];
      if (m.includes(`summary_dashboard-${dashboard}`)) {
        modules.push({
          route: "SummaryDashboard",
          divClass: "summary-module",
          innerDivClass: "summary-module-div",
          img: "images/summary-dash.png",
          name: this.$i18n.t("summary_dashboard"),
        });
      }
      if (m.includes(`analytical_dashboard-${dashboard}`)) {
        modules.push({
          route: "AnalyticalDashboard",
          divClass: "analytical-module",
          innerDivClass: "analytical-module-div",
          img: "images/analytical-dash.png",
          name: this.$i18n.t("analytical_dashboard"),
          popup:
            this.$store.getters.getNamespace ===
            `${settings.tableName}_fp-dashboard`
              ? false
              : false, //Kept for reference
        });
      }
      if (m.includes(`DQR-${dashboard}`)) {
        modules.push({
          route: "DQRDashboard",
          divClass: "saved-fav-module",
          innerDivClass: "saved-fav-module-div",
          img: "images/data-quilty-dash.png",
          name: this.$i18n.t("DQR"),
        });
      }
      if (m.includes(`mapVisualization-${dashboard}`)) {
        modules.push({
          route: "map",
          divClass: "rmnch-module",
          innerDivClass: "rmnch-module-div",
          img: "images/map-dash.png",
          name: this.$i18n.t("mapVisualization"),
        });
      }
      return modules;
    },
  },
  methods: {
    goTo(route, popup) {
      if (!this.isFromAdmin) {
        if (popup) {
          this.$swal({
            title: "Select Dashboard Type",
            input: "select",
            inputOptions: {
              old: "Old",
              new: "New",
            },
            type: "question",
            showCancelButton: true,
            reverseButtons: true,
            confirmButtonText: this.$i18n.t("submitbtn"),
            cancelButtonText: this.$i18n.t("cancelbtn"),
            inputValidator: (value) => {
              return new Promise((resolve) => {
                if (value) {
                  resolve();
                } else {
                  resolve(this.$i18n.t("warnMessage"));
                }
              });
            },
          }).then((result) => {
            if (result.isConfirmed) {
              let type = result.value === "old" ? "" : "new-";
              this.$router.push({ path: `/${type}${route}` });
            }
          });
        } else {
          this.$router.push({ path: `/${route}` });
        }
      }
    },
  },
};
</script>
