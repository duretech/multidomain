/*global settings*/
/*eslint no-undef: "error"*/

export default {
  methods: {
    goTo({
      module,
      moduleId = "",
      activeTab = "",
      routeName = "",
      setNamespace = false,
      redirectDetails = "",
      IDLocationPeriod = {},
    }) {
      if (setNamespace) {
        let namespace = module
          ? `${this.$store.getters.getAppSettings.tableName}_${module}`
          : this.$store.getters.getAppSettings.tableName;
        this.$store.commit("setNamespace", namespace);
      }
      if (this.$route.name !== routeName) {
        let queryObj = moduleId ? { moduleId } : {};
        this.$nextTick(() => {
          this.$router.push({
            name: routeName,
            params: {
              activeTab: activeTab,
              redirectDetails: redirectDetails,
              IDLocationPeriod: IDLocationPeriod,
            },
            query: queryObj,
          });
        });
      }
    },
  },
};
