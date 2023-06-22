<template>
  <div>
    <b-row class="subheading">
      <b-col class="username">
        <i class="fa fa-user mr-2" :class="formColor" aria-hidden="true"></i
        >{{ userDetails.firstName }} {{ userDetails.surname }}
      </b-col>
      <b-col class="text-right">
        <div class="location">
          {{ locationName }},
          {{ formSubmitDate ? formSubmitDate : selectedDate }}
        </div>
      </b-col>
    </b-row>
    <b-row class="mt-1 mb-2 subsubheading">
      <b-col sm="8" class="sectionName">
        <i
          class="fa fa-arrow-left mr-2 cursor-pointer"
          v-if="showForms"
          @click="backToForm"
        ></i
        >{{ tabName }}
      </b-col>
      <b-col sm="4" class="" v-if="isViewForms" @click="viewForms">
        <div class="comment">
          {{ $t("commentsIcon") }}-<span class="commentCount">{{
            responseForms.length
          }}</span>
        </div>
      </b-col>
    </b-row>
  </div>
</template>
<script>
export default {
  props: [
    "tabName",
    "showForms",
    "formColor",
    "isViewForms",
    "userDetails",
    "locationName",
    "selectedDate",
    "responseForms",
    "formSubmitDate",
  ],
  methods: {
    viewForms() {
      this.$emit("viewForms");
    },
    backToForm() {
      this.$emit("backToForm");
    },
  },
};
</script>
