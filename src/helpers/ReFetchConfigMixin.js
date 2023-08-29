export default {
  data() {
    return {
      errCount: 0,
    };
  },
  methods: {
    reFetchConfig(err = null) {
      if (
        err?.response?.status >= 500 &&
        err?.response?.status < 600 &&
        this.errCount < 3
      ) {
        this.$swal({
          title: this.$i18n.t("errorInData"),
          confirmButtonText: this.$i18n.t("refreshBtn"),
          cancelButtonText: this.$i18n.t("ok"),
          showCancelButton: true,
          reverseButtons: true,
        }).then((result) => {
          if (result.value) {
            this.errCount++;
            this.getConfigData();
          }
        });
      }
    },
  },
};
