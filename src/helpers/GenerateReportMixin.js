import html2pdf from "html2pdf.js";
import domtoimage from "dom-to-image";
import NepaliDate from "nepali-date-converter";

export default {
  data() {
    return {
      fileName: "",
      isGenerating: false,
      mapValue: [],
      bubbleChart: "",
      exportArrAll: [],
      mapArr: [],
      dqrSec1: "",
      currentViewMore: "N/A",
      textUpdate: false,
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
          '"/>'
          +
          '<div class="custom-control custom-checkbox custom-control-inline" id="displatPDFOpt" ><input type="checkbox" class="custom-control-input" id="filePDF" value="filePDF"><label class="custom-control-label" for="filePDF">' +
          this.$i18n.t("PDF") +
          "</label></div>"
          +
          '<div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="filePPT" value="filePPT"><label class="custom-control-label" for="filePPT">' +
          this.$i18n.t("PPT") +
          "</label></div>"
        ,
        focusConfirm: true,
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: this.$i18n.t("submitbtn"),
        cancelButtonText: this.$i18n.t("cancelbtn"),
        didOpen: () => {
          const filePDFCheckbox = document.getElementById("filePDF");
          const filePPTCheckbox = document.getElementById("filePPT");
          const pdfOpt = document.getElementById("displatPDFOpt");
          const submitButton = this.$swal.getConfirmButton();

          if (this.currentViewMore != "N/A") {
            pdfOpt.style.display = "none"
          }

          const updateSubmitButtonState = () => {
            if (filePDFCheckbox.checked || filePPTCheckbox.checked) {
              submitButton.disabled = false;
            } else {
              submitButton.disabled = true;
            }
          };

          filePDFCheckbox.addEventListener("change", updateSubmitButtonState);
          filePPTCheckbox.addEventListener("change", updateSubmitButtonState);

          updateSubmitButtonState();
        },
        preConfirm: () => {
          return [document.getElementById("fileName").value,
          document.getElementById("filePDF").checked
            ? document.getElementById("filePDF").value
            : "",
          document.getElementById("filePPT").checked
            ? document.getElementById("filePPT").value
            : "",
          ];
        },
      });
      if (formValues && formValues[2]) {

        const { value: PPTValues } = await this.$swal({
          title: this.$i18n.t("optionsPPT"),
          html:
            '<div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="legends" value="show"><label class="custom-control-label" for="legends">' +
            this.$i18n.t("legends") +
            '</label></div>' +
            '<div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="values" value="show"><label class="custom-control-label" for="values">' +
            this.$i18n.t("values") +
            "</label></div>"
            +
            '<div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="showXAxis" value="show"><label class="custom-control-label" for="showXAxis">' +
            this.$i18n.t("x_axis") +
            "</label></div>"
            +
            '<div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="showYAxis" value="show"><label class="custom-control-label" for="showYAxis">' +
            this.$i18n.t("y_axis") +
            "</label></div>"
          ,
          confirmButtonText: this.$i18n.t("submitbtn"),
          reverseButtons: true,
          cancelButtonText: this.$i18n.t("cancelbtn"),
          preConfirm: () => {
            return [
              document.getElementById("legends").checked
                ? document.getElementById("legends").value
                : "",
              document.getElementById("values").checked
                ? document.getElementById("values").value
                : "",
              document.getElementById("showXAxis").checked
                ? document.getElementById("showXAxis").value
                : "",
              document.getElementById("showYAxis").checked
                ? document.getElementById("showYAxis").value
                : "",
            ];
          },
        })

        let summary = null;
        let title = null;
        let exportArr = [];

        // let png = await domtoimage.toPng(myDiv);
        import(/* webpackChunkName: "pptxgenjs"*/"pptxgenjs").then(async (pptxgen) => {
          let pptx = new pptxgen.default();
          pptx.layout = "LAYOUT_WIDE";
          pptx.author = "Avenir Generic Tool";
          pptx.company = "Dure Technologies";
          pptx.subject = this.$i18n.t("summary_dashboard");
          pptx.title = this.$i18n.t("summary_dashboard");

          if (this.$store.getters.getActiveTab.includes("sd-summary")) {
            title = this.$i18n.t("summary_dashboard")
            if (this.$refs['printPPT']) {
              this.textUpdate = true
              await domtoimage.toPng(this.$refs['printPPT']).then(function (dataUrl) {
                summary = dataUrl;
              }).catch((error) => {
                console.error('Error converting DOM to PNG:', error);
              });
              this.textUpdate = false;
            }

            if (this.showTrend) {
              this.exportArrAll.map(item => {
                if (item.chartCategory === "trend" && item.path == "sd-summary" && !item.viewMore && this.currentViewMore == "N/A") {
                  exportArr.push(item);
                }
              });
            }

            if (this.showSeasonal) {
              this.exportArrAll.map(item => {
                if (item.chartCategory === "seasonal" && item.path == "sd-summary" && !item.viewMore && this.currentViewMore == "N/A") {
                  exportArr.push(item);
                }
              });
            }

            if (this.showRegional) {
              this.exportArrAll.map(item => {
                if (item.chartCategory === "regional" && item.path == "sd-summary" && !item.viewMore && this.currentViewMore == "N/A") {
                  exportArr.push(item);
                }
              });
            }

            this.exportArrAll.map(item => {
              if (item.viewMore && this.currentViewMore != "N/A") {
                exportArr.push(item);
              }
            })
          }
          else {
            title = this.$store.getters.getModuleName
            exportArr = this.exportArrAll.filter((item) => item.path === this.$store.getters.getActiveTab
            );
          }

          this.mapArr = this.mapValue.filter((item) =>
            item.url == this.$store.getters.getActiveTab
          )

          // console.log("exportArr", exportArr);
          // console.log("mapPic" , this.mapArr);
          // console.log("bubblePic", this.bubbleChart);
          // console.log("dqrPic", this.dqrSec1);
          // console.log("summaryPic",summary)
          // console.log("locationPeriod", this.locationPeriod)


          pptx.defineSlideMaster({
            title: "MASTER_SLIDE",
            background: { color: "FFFFFF" },
            objects: [
              {
                text: {
                  text: title,
                  options: {
                    y: "2%",
                    fontSize: 30,
                    align: "center",
                    w: "100%",
                    underline: true,
                  },
                },
              },
              {
                line: {
                  align: "center",
                  x: 4.2,
                  y: "94%",
                  w: 5,
                  h: 0,
                  line: "0088CC",
                  lineSize: 1,
                },
              },
              {
                line: {
                  align: "center",
                  x: 5.2,
                  y: "95%",
                  w: 3,
                  h: 0,
                  line: "0088CC",
                  lineSize: 1,
                },
              },
              {
                text: {
                  text:
                    this.$i18n.t("locationName") +
                    " :- "
                    + this.locationPeriod.locationName
                  ,
                  options: {
                    x: 0.5,
                    y: "95%",
                    w: "60%",
                    bold: true,
                    fontSize: 12,
                  },
                },
              },
              {
                text: {
                  text:
                    this.$i18n.t("period") + " :- "
                    + `${typeof this.locationPeriod.periodText === "object" ? this.locationPeriod.periodText.name : this.locationPeriod.periodText}`
                  ,
                  options: {
                    x: 0.5,
                    y: "98%",
                    w: "60%",
                    bold: true,
                    fontSize: 12,
                  },
                },
              },
              {
                text: {
                  text: this.$store.getters.getAppSettings.calendar !== "nepali" ? this.$moment(new Date()).format("llll") : getNepaliDate(),
                  options: {
                    x: 8.5,
                    y: "98%",
                    w: "30%",
                    align: "right",
                    fontSize: 12,
                    bold: true,
                  },
                },
              },
            ],
          });

          if (summary) {
            this.addSlideWithImage(pptx, summary)
          }
          if (this.mapArr) {
            // console.log("mapArr",this.mapArr)
            this.addSlideWithImage(pptx, this.mapArr, '' , PPTValues)
          }
          if (this.bubbleChart) {
            this.addSlideWithImage(pptx, this.bubbleChart, 'bubble')
          }
          if (this.dqrSec1 && this.$store.getters.getActiveTab.includes("dqr-summary")) {
            this.addSlideWithImage(pptx, this.dqrSec1)
          }

          for (let index = 0; index < exportArr.length; index++) {
            const element = exportArr[index];
            if (element?.series && element.series.length) {
              let slide = pptx.addSlide("MASTER_SLIDE");
              slide.addText(!this.$store.getters.getActiveTab.includes('emuMonthlyTab') && !this.$store.getters.getActiveTab.includes('emuAnnualTab') ? element.title.title ? element.title.title : element.chartName[this.$i18n.locale] ? element.chartName[this.$i18n.locale] : element.title ? element.title : "" : "", {
                x: 0.5,
                y: 0.6,
                w: "90%",
                fontSize: 18,
                bold: true,
                underline: true,
                breakLine: true,
              });
              let type = element?.type ? element.type : element.chart.type;
              let options = {
                x: 0.5,
                y: 1,
                w: "90%",
                h: "75%",
                showValue: PPTValues[1] === "show" ? true : false,
                showLegend: PPTValues[0] === "show" ? true : false,
                legendPos: "b",
                barGapWidthPct: 50,
                showCatAxisTitle:
                  PPTValues[2] !== "show"
                    ? false
                    : element.xAxis &&
                      element.xAxis.text &&
                      element.xAxis.text[this.$i18n.locale]
                      ? true
                      : false,
                catAxisTitle:
                  element.xAxis &&
                    element.xAxis.text &&
                    element.xAxis.text[this.$i18n.locale]
                    ? element.xAxis.text[this.$i18n.locale]
                    : "",

                showValAxisTitle:
                  PPTValues[3] !== "show"
                    ? false
                    : element.yAxis &&
                      element.yAxis.text &&
                      element.yAxis.text[this.$i18n.locale]
                      ? true
                      : false,
                valAxisTitle:
                  element.yAxis &&
                    element.yAxis.text &&
                    element.yAxis.text[this.$i18n.locale]
                    ? element.yAxis.text[this.$i18n.locale]
                    : "",
                // dataLabelFormatCode: "0.#0",
              };

              if (type == "line" || type == "spline") {
                type = pptx.ChartType.line;
              } else if (type == "area") {
                type = pptx.ChartType.area;
              } else if (type == "scatter") {
                type = pptx.ChartType.scatter;
                options["lineSize"] = 0;
              } else if (type == "packedbubble") {
                type = pptx.ChartType.doughnut
              } else {
                type = pptx.ChartType.bar;
                options["barDir"] = "col";
                if (
                  element.plotOptions &&
                  element.plotOptions.series &&
                  element.plotOptions.series.stacking === "normal"
                ) {
                  options["barGrouping"] = "stacked";
                }
              }
              if (!element.diffSeries && type !== "scatter") {
                let name, chartData = [], color, tooSmall = false, verySmall = false;
                element.series.forEach((e) => {
                  let labels = [],
                    values = [];
                  if (e.data && e.data.length) {
                    name = e.name
                    color = e?.color ? e.color.split("#")[1] : ((Math.random() * 0xffffff) << 0).toString(16)
                    e.data.forEach((ed, ind) => {
                      if (ed?.name || ed?.y) {
                        element?.categories ? labels.push(element.categories[ind]) : ed?.x ? labels.push(ed.x) : labels.push(ed.name);
                        values.push(ed.y);
                        if (ed.y%1 !== 0 && (ed.y*100)%1 == 0){
                          tooSmall = true;
                        }
                        else if(ed.y%1 !== 0 && (ed.y*100)%1 !== 0 && !tooSmall){
                          verySmall = true
                        }
                      }
                      else {
                        element?.categories ? labels.push(element.categories[ind]) : labels.push(ed.name);
                        values.push(ed)
                      }
                    });
                  }
                  if (!e?.isHighLow && !e?.isBenchmark) {
                    chartData.push({
                      data: [{
                        name,
                        labels,
                        values,
                      }],
                      type: e?.type ? e.type : type,
                      options: {
                        chartColors: [`${color}`]
                      }
                    });
                    // if (!values.length && !labels.length) {
                    //   slide.addText(`No Data to Display`, {
                    //     x: 5.5,
                    //     y: 4,
                    //     w: "90%",
                    //     fontSize: 18,
                    //     bold: true,
                    //     underline: true,
                    //     breakLine: true,
                    //   });
                    // }
                  }
                });
                if (tooSmall) {
                  options.dataLabelFormatCode = "0.#0"
                }
                if (verySmall) {
                  options.dataLabelFormatCode = "0.#00000"
                }
                slide.addChart(chartData, options);
              }
              else if (element.diffSeries && type !== "scatter") {
                let chartData = [],
                  chartColors = []
                element.series.forEach((e) => {
                  e.data.forEach((ed) => {
                    let name, labels = [],
                      values = [];
                    if (ed.color) {
                      chartColors.push(ed.color.split("#")[1]);
                    }
                    else {
                      chartColors.push(
                        ((Math.random() * 0xffffff) << 0).toString(16)
                      );
                    }
                    name = e?.name ? `${ed.name}-${e.name}` : ed.name;
                    ed.data.forEach((da) => {
                      element?.categories ? labels.push(element.categories[ind]) : labels.push(da.name);
                      values.push(da.y)
                      if (da.y != 0 && da.y < 0.01) {
                        tooSmall = true;
                      }
                    })
                    chartData.push({
                      name,
                      labels,
                      values,
                    });
                  })
                })
                options.chartColors = chartColors
                slide.addChart(type, chartData, options);
              }
              else if (type === "scatter") {
                let chartData = [], chartColors = [];
                if (element.r2) {
                  slide.addText(`R2 : ${element.r2}`, {
                    x: 10,
                    y: 0.6,
                    w: "90%",
                    fontSize: 18,
                    bold: false,
                    underline: false,
                    breakLine: true,
                  });
                }
                element.series.forEach((e) => {
                  // console.log("THESE ARE THE SCATTERED CHARTS" , e)
                  if (e.type !== "line") {
                    let x = [],
                      y = [];
                    if (e.color) {
                      chartColors.push(e.color.split("#")[1]);
                    }
                    let labels = []
                    if (e.data && e.data.length) {
                      e.data.forEach((ed) => {
                        x.push(ed.x);
                        y.push(ed.y);
                        labels.push(`${ed.name}(${ed.x},${ed.y})`);
                      });
                    }
                    chartData.push({
                      name: "X-Axis",
                      values: x,
                    });
                    chartData.push({
                      name: e.yMethod,
                      labels,
                      values: y,
                    });
                  }
                });
                options.chartColors = chartColors
                options.showLabel =  PPTValues[1] === "show" ? true : false,
                options.dataLabelPosition = "bestFit",
                  options.dataLabelFormatScatter = "custom",
                  slide.addChart(type, chartData, options);
              }
            }
          }
          if (exportArr?.length || this.mapArr?.length || this.bubbleChart || (this.dqrSec1 && this.$store.getters.getActiveTab.includes("dqr-summary")) || summary) {
            pptx.writeFile({ fileName: formValues[0] });
            console.log("File exported...");
          }
          else {
            this.$swal.fire({
              icon: 'error',
              title: this.$i18n.t("no_data_to_display"),
            })
          }
        })
      }
      if (formValues && formValues[1]) {
        this.isGenerating = true;
        this.$store.commit("setLoading", true);
        let e;
        setTimeout(() => {
          if (!this.$store.getters.getActiveTab.includes('dqr-summary') && this.currentViewMore != "N/A") {
            e = document.getElementsByClassName("dqr-section")
          }
          if (e || this.$refs[divName]) {
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
              console.log(divName)
              const elementToCapture = this.currentViewMore != "N/A" ? this.$refs[divName] : !this.$store.getters.getActiveTab.includes('dqr-summary') ? this.$refs["printDQR"] ? this.$refs["printDQR"] : this.$refs[divName] : this.$refs[divName];
              console.log(elementToCapture)
              await html2pdf()
                .set(options)
                .from(elementToCapture)
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
            this.$store.commit("setLoading", false);
          }
        }, 1200)
      }
    },
    addSlideWithImage(pptx, imageData, type, PPTValues) {
      if (type == "bubble") {
        const slide = pptx.addSlide("MASTER_SLIDE");
        slide.addText(`${imageData.name}`, {
          x: 0.5,
          y: 0.6,
          w: "90%",
          fontSize: 18,
          bold: true,
          underline: true,
          breakLine: true,
        });
        slide.addImage({
          data: imageData.pic,
          x: 0.5,
          y: 0.5,
          w: "50%",
          h: "80%",
        });
        let i = 1
        // if (showValues) {
        //   imageData.data.map((items, inds) => {
        //     let n = items.name;
        //     items.data.map((item, ind) => {
        //       slide.addText(`${item.name} -> ${n} -> ${item.value}`, {
        //         x: 8,
        //         y: `${i}`,
        //         w: "50%",
        //         h: "80%",
        //         fontSize: 18,
        //         bold: false,
        //         underline: false,
        //         breakLine: true,
        //       });
        //       i = i + 0.5;
        //     })
        //   })
        // }
      }
      else if (typeof imageData === "object") {
        imageData.map(item => {
          let title = !item.locVal ? item.title ? `${item.title}` : `${item.location}` : PPTValues[1] === "show" ? `${item.location} : ${item.locVal}` : `${item.location}`
          const slide = pptx.addSlide("MASTER_SLIDE");
          if(!item?.summaryContainer){
            slide.addImage({
              data: item.pic,
              x: 1.5,
              y: 0.5,
              w: "90%",
              h: "80%",
            });
          }else{
            slide.addImage({
              data: item.pic,
              x: 2.7,
              y: 0.5,
              w: "60%",
              h: "80%",
            });
          }
          if(!item?.summaryContainer){
            slide.addText(title, {
              x: 0.5,
              y: 0.6,
              w: "90%",
              fontSize: 18,
              bold: true,
              underline: true,
              breakLine: true,
            });
          }
          if (item?.selectedInd) {
            slide.addText(item.selectedInd, {
              x: 0.5,
              y: 1.2,
              w: "90%",
              fontSize: 18,
              bold: false,
              underline: false,
              breakLine: true,
            });
          }
        })
      }
      else {
        const slide = pptx.addSlide("MASTER_SLIDE");
        slide.addImage({
          data: imageData,
          x: 0.9,
          y: 0.5,
          w: "90%",
          h: "80%",
        });

      }
    },
    updateChartData(chartData, series = undefined) {
      if (series) {
        if (series?.methodSeries) {
          chartData['diffSeries'] = true;
          chartData['series'] = series.methodSeries;
        }
        else {
          chartData['diffSeries'] = false;
          chartData['series'] = series.series;
        }
        if(series?.r2){
          chartData['r2'] = series.r2;
        }
      }
      else {
        chartData['series'] = chartData.data;
      }
      if (chartData.length) {
        chartData.map(chart => {
          if (!series) {
            chart['series'] = chart.data;
          }
          if (!chart?.path) {
            chart['path'] = this.$store.getters.getActiveTab;
          }
          this.exportArrAll.push(chart)
        })
      }
      if (!chartData?.path) {
        chartData['path'] = chartData.viewMore ? this.$store.getters.getActiveTab + "_" + chartData.tabName[this.$i18n.locale] : this.$store.getters.getActiveTab;
      }
      this.exportArrAll.push(chartData);
      const uniqueObjects = new Set();
      const filteredArray = [];
      this.exportArrAll.forEach(item => {
        if (!item.viewMore) {
          let combination1 = `${item.id}-${item.cid}`;
          if (!uniqueObjects.has(combination1)) {
            uniqueObjects.add(combination1);
            item.viewMore = false
            filteredArray.push(item);
          }
        }
        else if (item.viewMore && item?.id) {
          let combination2, combination3
          if (item.trend) {
            combination2 = `${item.id}-${item.trend.title.title}-TREND`;
          }
          if (item.regional != null) {
            combination3 = `${item.id}-${item.regional.title.title}-REGIONAL`;
          }
          if (combination2 && !uniqueObjects.has(combination2)) {
            uniqueObjects.add(combination2);
            item.trend['viewMore'] = true;
            filteredArray.push(item.trend);
          }
          if (combination3 && !uniqueObjects.has(combination3)) {
            uniqueObjects.add(combination3);
            item.regional['viewMore'] = true;
            filteredArray.push(item.regional);
          }
        }
      });
      this.exportArrAll = filteredArray;
    },
    getBubbleChart(data) {
      this.bubbleChart = data
    },
    mapPic(data) {
      this.mapValue.push(data)
      const uniqueObjects = new Set();
      const filteredArray = [];

      this.mapValue.forEach(item => {
        let combination = `${item.pic}-${item.url}`;
        if (!uniqueObjects.has(combination)) {
          uniqueObjects.add(combination);
          filteredArray.push(item);
        }
      });
      this.mapValue = filteredArray;
    },
    async getDQRImg() {
      this.textUpdate = true;
      if (this.$refs?.printPDF) {
        await domtoimage.toPng(this.$refs.printPDF).then((dataUrl) => {
          this.dqrSec1 = dataUrl;
        })
          .catch((error) => {
            console.error('Error converting DOM to PNG:', error);
          });
      }
      this.textUpdate = false;
    },
    getNepaliDate() {
      let d = new Date();
      d = new NepaliDate(
        new Date(d.getFullYear(), d.getMonth() + 1, d.getDate())
      ).getBS();
      return d;
    },
    deleteMapPic(dataCurr) {
      this.mapValue = this.mapValue.filter(item =>
        item.title !== dataCurr)
    },
    deleteBubbleChart() {
      this.bubbleChart = ""
    }
  },
  created() {
    this.fileName = this.$i18n.t("reports");
  },
};
