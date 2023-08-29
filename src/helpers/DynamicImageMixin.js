import CssFilterConverter from "css-filter-converter";
export default {
  props: ["path", "title", "imgClass"],
  data() {
    return {
      filterColor: "",
    };
  },
  computed: {
    currentTheme() {
      return this.$store.getters.getTheme;
    },
  },
  watch: {
    currentTheme(newValue) {
      if (newValue) {
        // console.log("theme", newValue);
        this.setFilter();
      }
    },
  },
  methods: {
    setFilter() {
      let style = getComputedStyle(document.body),
        color = "--icon-fill-color";
      // console.log(style.getPropertyValue(color));
      const result = CssFilterConverter.hexToFilter(
        style.getPropertyValue(color)
      );
      // console.log("result", result);
      this.filterColor = result.color;
    },
  },
  mounted() {
    this.setFilter();
  },
};
