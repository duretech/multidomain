import service from "@/service";
export default {
  data() {
    return {
      commentList: [],
      commentText: "",
      loadComment: false,
      commentTextMaxLength: 100,
    };
  },
  computed: {
    commentPlaceholder: function () {
      return this.$i18n.t("placeholderMaxValue", {
        number: this.commentTextMaxLength,
      });
    },
  },
  methods: {
    getComments() {
      this.loadComment = true;
      this.getActive("comment");
      service
        .getComments(this.cID)
        .then((response) => {
          // console.log("comments", response)
          this.commentList = response?.data?.interpretations.length
            ? response.data.interpretations
                .sort((a, b) => {
                  let valueA = new Date(a.created).getTime();
                  let valueB = new Date(b.created).getTime();
                  return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
                })
                .map((d) => ({
                  ...d,
                  created: this.$moment(d.created).format("lll"),
                }))
            : [];
          this.loadComment = false;
        })
        .catch(() => {
          this.commentList = [];
          this.loadComment = false;
        });
    },
    addComment() {
      this.loadComment = true;
      service
        .addComments(this.cID, this.commentText)
        .then((response) => {
          // console.log(response)
          this.commentText = "";
          if (response.data.status === "OK") {
            this.getComments();
          } else {
            this.errorAlert();
          }
        })
        .catch(() => {
          this.commentText = "";
          this.errorAlert();
        });
    },
    errorAlert() {
      this.loadComment = false;
      this.sweetAlert({
        title: this.$i18n.t("error"),
      });
    },
    cancelComment() {
      this.commentText = "";
    },
  },
};
