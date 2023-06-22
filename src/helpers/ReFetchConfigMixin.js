export default {
  methods: {
    reFetchConfig(err = null) {
      console.log("err", err);
      if (err === null || !err.message.includes("404")) {
        this.$swal({
          title: this.$i18n.t("errorInData"),
          confirmButtonText: this.$i18n.t("refreshBtn"),
          cancelButtonText: this.$i18n.t("ok"),
          showCancelButton: true,
          reverseButtons: true,
        }).then((result) => {
          if (result.value) {
            this.getConfigData();
          }
        });
      }
    },
  },
};
