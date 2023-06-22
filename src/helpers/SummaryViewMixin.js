import i18n from "@/i18n";
export default {
  data() {
    return {
      showMore: "",
    };
  },
  methods: {
    showMoreText(id) {
      this.showMore = this.showMore === id ? "" : id;
    },
    getSummaryText(text) {
      return text && text.length
        ? text
        : `<strong>${i18n.t("noSummary")}</strong>`;
    },
    getIcon(type, cardHeader = null) {
      if (type === "High") {
        return cardHeader === "Stock-out"
          ? "redUparrow.png"
          : "greenUparrow.png";
      }
      if (type === "Low") {
        return cardHeader === "Stock-out"
          ? "greenDownarrow.png"
          : "redDownarrow.png";
      }
      if (type === "Equal") {
        return "orangeEqualsign.png";
      }
      return null;
    },
  },
};
