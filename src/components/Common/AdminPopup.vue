<template>
  <div class="">
    <b-button
      class="bg-transparent border-0 mx-2 bg-fav"
      size="sm"
      v-b-modal.modal-admin
      v-if="$store.getters.getIsAdmin"
      >{{ $t("admin") }}
    </b-button>
    <b-modal
      id="modal-admin"
      centered
      :title="$t('admin')"
      :ok-title="$t('ok')"
    >
      <b-row>
        <b-col sm="4" class="sub-head">{{ $t("selectDashboard") }}</b-col>
        <b-col sm="8">
          <b-dropdown id="dropdownnav">
            <template slot="button-content" class="header">
              <p>{{ adminNamespaceTitle }}</p>
            </template>
            <b-dropdown-item
              v-for="dash in dashboards"
              :key="'dashboard' + dash.text"
              class="text-uppercase"
              @click.prevent.stop="changeAdmin(dash.route, dash.text)"
            >
              {{ dash.text }}</b-dropdown-item
            >
          </b-dropdown>
        </b-col>
      </b-row>
      <div id="footer-admin" class="mt-3">
        <b-button class="footer-ok blue-btn" @click.prevent.stop="toAdmin">{{
          $t("ok")
        }}</b-button>
      </div>
    </b-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      adminNamespace: "",
      adminNamespaceTitle: "",
    };
  },
  computed: {
    dashboards() {
      let dash = [];
      if (
        this.$store.getters.getAppSettings &&
        this.$store.getters.getAppSettings.modulesList
      ) {
        if (this.$store.getters.getAppSettings.modulesList.length > 1) {
          dash.push({
            route: "",
            text: this.$i18n.t("default"),
          });
        }
        this.$store.getters.getAppSettings.modulesList.forEach((p) => {
          let text = "";

          if (p.includes("mnch")) {
            text = this.$i18n.t("maternalHealth");
          }
          if (p.includes("fp")) {
            text = this.$i18n.t("family_planning");
          }
          dash.push({
            route: `_${p}-dashboard`,
            text,
          });
        });
      }
      return dash;
    },
  },
  watch: {
    dashboards(newValue) {
      if (newValue && newValue.length) {
        this.adminNamespaceTitle = newValue[0]?.text || "";
        this.adminNamespace = newValue[0]?.route || "";
      }
    },
  },
  methods: {
    reload() {
      this.getUserDetails();
    },
    toAdmin() {
      this.$store.commit(
        "setNamespace",
        `${this.$store.getters.getAppSettings.tableName}${this.adminNamespace}`
      );
      this.$router.push("/admin");
    },
    changeAdmin(value, title) {
      this.adminNamespaceTitle = title;
      this.adminNamespace = value;
    },
  },
  created() {
    this.adminNamespaceTitle = this.dashboards[0]?.text || "";
    this.adminNamespace = this.dashboards[0]?.route || "";
  },
};
</script>
