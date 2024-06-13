import service from "@/service";
export default {
  data() {
    return {
      commentList: [],
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
        .addComments(this.cID, this.textWithComment)
        .then(async(response) => {
          this.textWithComment = "";
          if (response.data.status === "OK") {
            await this.getComments();
          } else {
            this.errorAlert();
          }
        })
        .catch(() => {
          this.textWithComment = "";
          this.errorAlert();
        });

      let obj = {
        addedBy: this.$store.getters.getUserDetails.surname,
        addedOn: this.$store.getters.getAppSettings.calendar === "nepali" ? 
        adToBs(
            `${new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate()}`
          ).split("-")[0]
        : this.$moment(new Date()).format("lll"),
        chartName: this.titleComment,
        chartCID: this.cID,
        text: this.textWithComment,
        newMessage: true,
      }
      try {
        service.getSavedConfig({ tableKey: "commentNotification", isDefault: true }).then((resp)=>{
          service.updateConfig({ data: [obj,...resp.data], tableKey: "commentNotification", isDefault: true }).then(()=>{
            this.$store.commit("setCommentNotification" , [obj,...resp.data])
            // console.log(this.$store.getters.getCommentNotification);
          })
        }).catch(()=>{
          service.saveConfig({data: [obj? obj : {}], tableKey: "commentNotification", isDefault: true }).then(()=>{
            this.$store.commit("setCommentNotification" , [obj])
            // console.log(this.$store.getters.getCommentNotification);
          })
        });
      } 
      catch (error) {
        console.log("error", error);
      }
    },
    errorAlert() {
      this.loadComment = false;
      this.sweetAlert({
        title: this.$i18n.t("error"),
      });
    },
    cancelComment() {
      this.textWithComment = "";
    },
  },
};
