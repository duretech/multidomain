import service from "@/service";
export default {
  data() {
    return {
      allGeoJson: {},
    };
  },
  methods: {
    getGeoJson(location) {
      if (!this.allGeoJson[location]) {
        let loc = location.split("/");
        service
          .getGeoJson(loc[1], loc[0] * 1 + 1)
          .then((response) => {
            this.$set(this.allGeoJson, location, response.data);
          })
          .catch(() => {
            this.$set(this.allGeoJson, location, "error");
          });
      }
    },
  },
};
