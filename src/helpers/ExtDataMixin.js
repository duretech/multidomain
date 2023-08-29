import service from "@/service";
export default {
  data() {
    return {
      allExtData: {},
    };
  },
  methods: {
    getExtData(level) {
      if (!this.allExtData[level]) {
        service
          .getSavedConfig({ tableKey: `externalData_${level}` })
          .then((response) => {
            this.$set(this.allExtData, level, response.data);
          })
          .catch(() => {
            this.$set(this.allExtData, level, "error");
          });
      }
    },
  },
};
