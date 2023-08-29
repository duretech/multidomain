import html2pdf from "html2pdf.js";

export default {
  data() {
    return {
      fileName: "",
      isGenerating: false,
    };
  },
  methods: {
    async downloadReport(divName = "printPDF") {
      const { value: formValues } = await this.$swal({
        title: this.$i18n.t("export_options"),
        html:
          '<input id="fileName" class="form-control" placeholder="' +
          this.$i18n.t("fileName_placeholder") +
          '" value="' +
          this.fileName +
          '"/>',
        focusConfirm: true,
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: this.$i18n.t("exportbtn"),
        cancelButtonText: this.$i18n.t("cancelbtn"),
        preConfirm: () => {
          return [document.getElementById("fileName").value];
        },
      });
      if (formValues) {
        this.isGenerating = true;
        this.$store.commit("setLoading", true);
        if (this.$refs[divName]) {
          setTimeout(async () => {
            let options = {
              filename:
                formValues[0] +
                "_" +
                this.$moment(new Date()).format("lll") +
                ".pdf",
              pagebreak: {
                mode: "avoid-all",
                before: ".before",
                avoid: ".after",
              },
              image: { type: "jpeg", quality: 0.98 },
              html2canvas: {
                scale: 2,
                useCORS: true,
                allowTaint: true,
              },
              jsPDF: {
                unit: "mm",
                format: "a4",
                orientation: "l",
              },
            };
            await html2pdf()
              .set(options)
              .from(this.$refs[divName])
              .toPdf()
              .get("pdf")
              .then((pdf) => {
                const totalPages = pdf.internal.getNumberOfPages();
                for (let i = 1; i <= totalPages; i++) {
                  if (i === totalPages) {
                    this.isGenerating = false;
                    this.$store.commit("setLoading", false);
                  }
                }
              })
              .save();
          }, 50);
        } else {
          console.log("printing div not found...");
        }
      }
    },
  },
  created() {
    this.fileName = this.$i18n.t("reports");
  },
};
