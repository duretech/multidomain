export default {
  methods: {
    setDocumentTitle(dTitle = null) {
      let title =
        typeof this.$route.meta === "function"
          ? this.$route.meta().title
          : this.$i18n.t("dashboard");
      document.title = dTitle ? dTitle : title;
    },
  },
  created() {
    this.setDocumentTitle();
  },
};
