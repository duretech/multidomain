<template>
  <div>
    <div class="not-emu">
      <b-overlay
        :show="
          !locationPeriod && !signOffData && !locationName && !selectedDate
        "
        rounded="sm"
      >
        <div class="signoff-floating-icon">
          <div class="signoff-icon-div">
            <button
              type="button"
              class="btn linked-btn btn-secondary btn-sm logo-img blue-btn"
              v-b-toggle.sidebar-backdrop
            >
              <span class="">
                <img
                  :src="require('@/assets/images/icons/sign_off_icon2.svg')"
                  class="img-fluid w-14 mb-1"
                />
              </span>
              <span class="mx-1"> {{ $t("data_sign_off") }} </span>
            </button>
          </div>
        </div>
      </b-overlay>
      <div>
        <b-sidebar
          id="sidebar-backdrop"
          v-model="visible"
          title=""
          backdrop
          right
          no-header
          no-footer
          width="380px"
        >
          <b-overlay :show="formSubmitted" rounded="sm">
            <div class="signoff-modal-content">
              <div class="signoff-modal-header">
                <b-row class="heading p-2 pt-3">
                  <b-col sm="1" class="">
                    <img
                      class="signoff-icon"
                      :src="require('@/assets/images/icons/sign_off_icon.svg')"
                      :style="{ filter: filterColor }"
                    />
                  </b-col>
                  <b-col am="10" class="signoff-heading">
                    <h5>{{ $t("data_sign_off") }}</h5>
                  </b-col>
                  <b-col sm="1">
                    <button
                      class="close pr-2 pt-1"
                      type="button"
                      @click.prevent.stop="close"
                    >
                      &times;
                    </button>
                  </b-col>
                </b-row>
                <SignOffHeader
                  :tabName="tabName"
                  :isViewForms="true"
                  @viewForms="viewForms"
                  :showForms="showForms"
                  :formColor="formColor"
                  :userDetails="formUser"
                  :selectedDate="formDate"
                  @backToForm="backToForm"
                  :locationName="formLocation"
                  :responseForms="responseForms"
                />
              </div>
              <div class="list-of-questions" v-if="!showForms">
                <SignOffForm
                  :isViewForm="isViewForm"
                  :signOffForm="signOffForm"
                  @refreshForm="refreshForm"
                />
              </div>
              <div class="dsl" v-if="!showForms && signOffForm.length">
                <div class="title">
                  {{ $t("text_info") }}
                </div>
                <div>
                  <div id="range border"></div>
                  <div class="rangeSlider">
                    <b-form-input
                      id="range-1"
                      type="range"
                      min="0"
                      max="5"
                      step="0.1"
                      v-model="dataSatisfaction"
                      :disabled="isViewForm"
                    ></b-form-input>
                    <SignOffDSL :dsl="dsl" />
                  </div>
                </div>

                <b-form-checkbox
                  class="decleration"
                  id="checkbox-1"
                  name="checkbox-1"
                  :value="true"
                  :unchecked-value="false"
                  v-model="declaration"
                  :disabled="isViewForm"
                >
                  {{ $t("text_info_1") }}
                </b-form-checkbox>
                <div class="bottom-declare">
                  <b-button
                    type="button"
                    class="btn btn-primary sub-btn blue-btn"
                    :disabled="!declaration || (declaration && isViewForm)"
                    @click.prevent.stop="submitSignOff"
                  >
                    {{ isUpdate ? $t("update") : $t("submitbtn") }}
                  </b-button>
                </div>
              </div>
              <div class="list-of-cards" v-if="showForms">
                <AllSignOffForms
                  :editOpt="true"
                  :viewOpt="true"
                  :deleteOpt="true"
                  @deleteForm="deleteForm"
                  :userDetails="userDetails"
                  :responseForms="responseForms"
                  @updateSignOffForm="updateSignOffForm"
                />
              </div>
            </div>
          </b-overlay>
        </b-sidebar>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/service";
import { randomString } from "@/components/Common/commonFunctions";
import SignOffMixin from "@/helpers/SignOffMixin";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";

export default {
  props: [
    "configData",
    "userDetails",
    "signOffData",
    "selectedDate",
    "locationName",
    "locationPeriod",
  ],
  mixins: [SignOffMixin, DynamicImageMixin],
  components: {},
  data() {
    return {
      visible: false,
      isUpdate: false,
      showForms: false,
      isViewForm: false,
      responseForms: [],
      declaration: false,
      currentFormID: null,
      dataSatisfaction: 0,
      formSubmitted: false,
    };
  },
  watch: {
    signOffData: {
      handler(newValue) {
        this.getForms();
      },
      deep: true,
    },
  },
  computed: {},
  methods: {
    close() {
      this.refreshForm();
      this.visible = false;
    },
    viewForms() {
      this.refreshForm();
      this.showForms = true;
    },
    updateSignOffForm({ form, isEdit = false, isView = false }) {
      this.showForms = false;
      this.currentFormID = form.formID;
      this.declaration = form.declaration;
      this.signOffForm = form.signOffForm;
      this.dataSatisfaction = form.dataSatisfaction;
      this.updateForm = JSON.parse(JSON.stringify(form));
      if (isEdit) {
        this.isUpdate = true;
      }
      if (isView) {
        this.isViewForm = true;
      }
    },
    deleteForm(formID) {
      let key = this.generateKey("dqrDashboard");

      this.$swal({
        title: this.$i18n.t("areyousure"),
        text: this.$i18n.t("youablerevertthis"),
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: this.$i18n.t("yes_delete_it"),
        cancelButtonText: this.$i18n.t("cancelbtn"),
      }).then((result) => {
        if (result.value) {
          this.formSubmitted = true;
          let saveConfig = service.getSavedConfig({ tableKey: key });
          saveConfig
            .then((res) => {
              let configData = res.data;
              let id = this.$store.getters.getActiveTab.split("-");
              configData = configData.map((c) => {
                if (c.id === id[1]) {
                  return {
                    ...c,
                    subTabs: c.subTabs.map((st) => {
                      if (st.id === id[3]) {
                        return {
                          ...st,
                          signOff: st.signOff.filter(
                            (s) => s.formID !== formID
                          ),
                        };
                      } else {
                        return st;
                      }
                    }),
                  };
                } else {
                  return c;
                }
              });

              let response = service.updateConfig({
                data: configData,
                tableKey: key,
              });
              response
                .then((response) => {
                  if (response.data.status === "OK") {
                    this.sweetAlert({
                      title: this.$i18n.t("deleted"),
                      text: this.$i18n.t("signOff_form_deleted"),
                    });
                    this.$emit("updatedConfig", configData);
                  } else {
                    this.sweetAlert({
                      title: this.$i18n.t("error"),
                      text: `${response.data.message}`,
                    });
                    return;
                  }
                  this.formSubmitted = false;
                })
                .catch(() => {
                  this.sweetAlert({
                    title: this.$i18n.t("error"),
                  });
                  this.formSubmitted = false;
                  return;
                });
            })
            .catch(() => {
              this.sweetAlert({
                title: this.$i18n.t("error"),
              });
              this.formSubmitted = false;
              return;
            });
        }
      });
    },
    backToForm() {
      this.formSubmitted = false;
      this.showForms = false;
      this.refreshForm();
    },
    submitSignOff() {
      this.formSubmitted = true;
      let index = null;
      if (this.responseForms && this.responseForms.length && !this.isUpdate) {
        index = this.responseForms.find(
          (f) =>
            f.periodText === this.selectedDate &&
            f.location === this.locationName
        );
      }
      if (index) {
        this.currentFormID = null;
        this.isUpdate = false;
        this.signOffForm = JSON.parse(
          JSON.stringify(this.signOffData.questions)
        );
        this.dataSatisfaction = 0;
        this.declaration = false;
        this.sweetAlert({
          title: this.$i18n.t("duplicate"),
          text: this.$i18n.t("form_present"),
        });
        this.formSubmitted = false;
      } else {
        if (!this.isUpdate) {
          this.currentFormID = randomString(16);
        }
        let iconColorClass = "low-text";
        if (this.dataSatisfaction >= 1.1 && this.dataSatisfaction <= 2) {
          iconColorClass = "mediumLow-text";
        } else if (this.dataSatisfaction >= 2.1 && this.dataSatisfaction <= 3) {
          iconColorClass = "medium-text";
        } else if (this.dataSatisfaction >= 3.1 && this.dataSatisfaction <= 4) {
          iconColorClass = "mediumHigh-text";
        } else if (this.dataSatisfaction >= 4.1 && this.dataSatisfaction <= 5) {
          iconColorClass = "high-text";
        } else {
          iconColorClass = "low-text";
        }

        let signOff = {
          formID: this.isUpdate
            ? this.updateForm.currentFormID
            : this.currentFormID,
          userDetails: {
            firstName: this.isUpdate
              ? this.updateForm.userDetails.firstName
              : this.userDetails.firstName,
            surname: this.isUpdate
              ? this.updateForm.userDetails.surname
              : this.userDetails.surname,
            id: this.isUpdate
              ? this.updateForm.userDetails.id
              : this.userDetails.id,
          },
          location: this.isUpdate
            ? this.updateForm.location
            : this.locationName,
          period: this.isUpdate
            ? this.updateForm.period
            : this.locationPeriod.period,
          periodType: this.isUpdate
            ? this.updateForm.periodType
            : this.locationPeriod.periodType,
          periodText: this.isUpdate
            ? this.updateForm.periodText
            : this.locationPeriod.periodText,
          signOffTab: this.isUpdate
            ? this.updateForm.signOffTab
            : this.tabNameID,
          signOffForm: this.signOffForm,
          dataSatisfaction: this.dataSatisfaction,
          iconColorClass: iconColorClass,
          declaration: this.declaration,
          createdAt: this.isUpdate
            ? this.updateForm.createdAt
            : this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
          updatedAt: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
        };
        let key = this.generateKey("dqrDashboard");

        let saveConfig = service.getSavedConfig({ tableKey: key });
        saveConfig
          .then((res) => {
            let configData = res.data;
            let id = this.$store.getters.getActiveTab.split("-");
            configData = configData.map((c) => {
              if (c.id === id[1]) {
                return {
                  ...c,
                  subTabs: c.subTabs.map((st) => {
                    if (st.id === id[3]) {
                      if (st.signOff) {
                        if (this.isUpdate) {
                          let foundIndex = st.signOff.findIndex(
                            (f) => f.formID == this.currentFormID
                          );
                          st.signOff[foundIndex] = signOff;
                        } else {
                          st.signOff.push(signOff);
                        }
                        return st;
                      } else {
                        return {
                          ...st,
                          signOff: [signOff],
                        };
                      }
                    } else {
                      return st;
                    }
                  }),
                };
              } else {
                return c;
              }
            });

            let response = service.updateConfig({
              data: configData,
              tableKey: key,
            });
            response
              .then((response) => {
                if (response.data.status === "OK") {
                  this.sweetAlert({
                    title: this.$i18n.t("data_saved_successfully"),
                  });
                  this.refreshForm();
                  this.$emit("updatedConfig", configData);
                } else {
                  this.sweetAlert({
                    title: this.$i18n.t("error"),
                    text: `${response.data.message}`,
                  });
                  return;
                }
                this.formSubmitted = false;
              })
              .catch(() => {
                this.sweetAlert({
                  title: this.$i18n.t("error"),
                });
                this.formSubmitted = false;
                return;
              });
          })
          .catch(() => {
            this.sweetAlert({
              title: this.$i18n.t("error"),
            });
            this.formSubmitted = false;
            return;
          });
      }
    },
    getForms() {
      this.signOffForm = this.signOffData.questions
        ? JSON.parse(JSON.stringify(this.signOffData.questions))
        : [];
      let responseForms = this.signOffData?.signOff?.length
        ? JSON.parse(JSON.stringify(this.signOffData.signOff))
        : [];
      this.responseForms = responseForms.sort((a, b) => {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return (
          this.$moment(b.updatedAt, "MMMM Do YYYY, h:mm:ss a").valueOf() -
          this.$moment(a.updatedAt, "MMMM Do YYYY, h:mm:ss a").valueOf()
        );
      });
    },
    refreshForm() {
      this.isUpdate = false;
      this.showForms = false;
      this.updateForm = null;
      this.isViewForm = false;
      this.declaration = false;
      this.currentFormID = null;
      this.dataSatisfaction = 0;
      if (this.signOffData && this.signOffData.questions) {
        this.signOffForm = JSON.parse(
          JSON.stringify(this.signOffData.questions)
        );
      }
    },
  },
  created() {
    this.getForms();
  },
};
</script>
