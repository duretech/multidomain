<template>
  <div>
    <div class="card-body">
      <div class="row mt-3 mb-4 mx-0">
        <div class="col-12 px-0">
          <button
            type="button"
            class="btn btn-primary black-btn"
            @click="$bvModal.show(chartBySubtype)"
          >
            {{ $t("addNewQuest") }}
          </button>
          <b-modal
            :id="chartBySubtype"
            hide-footer
            :title="$t('addQuest')"
            no-close-on-backdrop
          >
            <div class="mb-3">
              {{ $t("quest") }}
              <b-form-textarea
                id="textarea"
                v-model="questionText"
                :placeholder="$t('enter_question')"
                rows="3"
                max-rows="6"
              ></b-form-textarea>
            </div>
            <div>
              <b-form-group :label="$t('options')">
                <b-form-radio-group
                  :options="options"
                  plain
                  stacked
                  name="plain-stacked"
                  disabled
                >
                </b-form-radio-group>
              </b-form-group>
            </div>
            <div class="text-right pt-3">
              <b-button
                :disabled="!questionText"
                class="black-btn"
                @click="addQuestion"
                >{{ $t("addbtn") }}</b-button
              >
            </div>
          </b-modal>
        </div>
        <div
          class="col-12 mt-4 border-top pt-2 px-0"
          v-if="questions.length > 0"
        >
          {{ $t("questSet") }}
          <ol class="mt-2" type="1">
            <li v-for="(question, index) in questions" :key="index">
              <b-form-textarea
                id="textarea"
                v-model="question.questionText"
                :placeholder="$t('enter_question')"
                rows="3"
                max-rows="6"
                v-if="editIndex === index"
              ></b-form-textarea>
              <span v-else>{{ question.questionText }}</span>
              <span
                class="fa fa-save ml-4 cursor-pointer"
                @click="editIndex = null"
                v-if="editIndex === index"
                v-b-tooltip.hover
                :title="$t('savebtn')"
              ></span>
              <span v-else>
                <span
                  class="fa fa-edit ml-4 cursor-pointer"
                  @click="editIndex = index"
                  v-b-tooltip.hover
                  :title="$t('edit')"
                ></span>
                <span
                  class="fa fa-trash ml-4 cursor-pointer"
                  @click="deleteQuestion(index)"
                  v-b-tooltip.hover
                  :title="$t('deletebtn')"
                ></span
              ></span>
              <div class="">
                <b-form-radio-group :options="question.options" plain disabled>
                </b-form-radio-group>
              </div>
            </li>
          </ol>
        </div>
      </div>
      <div class="row pt-4">
        <div class="col text-right">
          <button
            type="button"
            class="btn btn-primary black-btn"
            v-on:click="updateConfigData"
          >
            {{ $t("savebtn") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from "../../../service";
import assign from "lodash/assign";
import audit from "../audit.js";

export default {
  props: ["chartByModule", "chartByType", "chartBySubtype"],
  components: {},
  data() {
    return {
      questionText: "",
      comment: "",
      answer: "",
      options: [
        { text: "Yes", value: "Yes" },
        { text: "No", value: "No" },
      ],
      questions: [],
      originalQSet: [],
      editIndex: null,
      originalData: null,
    };
  },
  methods: {
    addQuestion() {
      let defaultQSet = {
        questionText: this.questionText,
        options: this.options,
        comment: this.comment,
        answer: this.answer,
      };
      this.questions.push(defaultQSet);
      this.$bvModal.hide(this.chartBySubtype);
      setTimeout(() => {
        this.questionText = "";
      }, 100);
    },
    deleteQuestion(index) {
      this.$swal({
        title: this.$i18n.t("areyousure"),
        text: this.$i18n.t("youablerevertthis"),
        showCancelButton: true,
        confirmButtonText: this.$i18n.t(
          "yes_delete_it"
        ),
      }).then((result) => {
        if (result.value) {
          this.questions = this.questions.filter((q, i) => i !== index);
        }
      });
    },
    //This is to fetch config data on page load
    getConfigData() {
      // console.log("data initial",[this.chartBySubtype],JSON.stringify(config))
      let key = this.generateKey(this.chartByModule);

      let response = service.getSavedConfig(key);
      response
        .then((response) => {
          // console.log(response)

          if (
            response.data[this.chartByType] &&
            response.data[this.chartByType][this.chartBySubtype]
          ) {
            let data = response.data[this.chartByType][this.chartBySubtype];
            // console.log(data)

            this.questions = data.questions ? data.questions : this.questions;
            this.originalQSet = data.questions
              ? data.questions
              : this.questions;

            this.originalData = JSON.parse(JSON.stringify(data));
          }
          this.$store.state.loading = false;
        })
        .catch((res) => {
          console.log("Config not found...");
          this.$store.state.loading = false;
        });
    },
    //This is to update config data on click of save button
    updateConfigData() {
      this.$store.state.loading = true;
      let key = this.generateKey(this.chartByModule);

      let allKeys = service.getAllKeys();
      allKeys.then((keys) => {
        if (keys.data.includes(key)) {
          let saveConfig = service.getSavedConfig(key);
          saveConfig.then((res) => {
            let configData = res.data;
            // console.log("configData", configData);
            // console.log("this.chartByType", this.chartByType);
            // console.log("this.chartBySubtype", this.chartBySubtype);
            // console.log("this.questions", this.questions);
            if (configData[this.chartByType]) {
              if (configData[this.chartByType][this.chartBySubtype]) {
                configData[this.chartByType][this.chartBySubtype] = {
                  ...configData[this.chartByType][this.chartBySubtype],
                  questions: configData[this.chartByType][this.chartBySubtype]
                    .questions
                    ? assign(
                        configData[this.chartByType][this.chartBySubtype]
                          .questions,
                        this.questions
                      )
                    : this.questions,
                };
              } else {
                configData[this.chartByType] = {
                  ...configData[this.chartByType],
                  [this.chartBySubtype]: {
                    questions: this.questions,
                  },
                };
              }
            } else {
              configData[this.chartByType] = {
                [this.chartBySubtype]: {
                  questions: this.questions,
                },
              };
            }
            let configChanges = audit.configAudit(
              this.originalData,
              configData[this.chartByType][this.chartBySubtype]
            );
            // console.log("configChanges", configChanges);
            let response = service.updateConfig(configData, key);
            response
              .then((response) => {
                if (response.data.status === "OK") {
                  // console.log("response update ", response.data)
                  this.$swal({
                    title: this.$i18n.t("data_saved_successfully"),
                  }).then(() => {
                    if (Object.keys(configChanges).length) {
                      audit.processAudit(
                        "process2",
                        key,
                        configChanges,
                        this.chartByType,
                        this.chartBySubtype
                      );
                    }
                  });
                  this.getConfigData();
                  this.$store.state.loading = false;
                } else {
                  this.$swal({
                    title: this.$i18n.t("error"),
                    text: `${response.data.message}`,
                  });

                  this.$store.state.loading = false;
                  return;
                }
              })
              .catch((error) => {
                this.$swal({
                  title: this.$i18n.t("error"),
                });

                this.$store.state.loading = false;
                return;
              });
          });
        } else {
          let signOff = {
            [this.chartByType]: {
              [this.chartBySubtype]: {
                questions: this.questions,
              },
            },
          };
          let response = service.saveConfig(signOff, key);
          response.then((response) => {
            if (response.data.status === "OK") {
              // console.log("response save ", response.data)
              this.$swal({
                title: this.$i18n.t("data_saved_successfully"),
              });
              this.getConfigData();
              this.$store.state.loading = false;
            } else {
              this.$swal({
                title: this.$i18n.t("error"),
                text: `${response.data.message}`,
              });
              this.$store.state.loading = false;
              return;
            }
          });
        }
      });
    },
  },
  created() {
    this.$store.state.loading = true;
    if (this.$i18n.locale === "fr") {
      this.options = [
        { text: this.$i18n.t("yes"), value: "Yes" },
        { text: this.$i18n.t("no"), value: "No" },
      ];
    }
    this.getConfigData();
  },
};
</script>
