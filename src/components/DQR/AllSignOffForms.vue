<template>
  <section>
    <div
      class="card mb-3"
      v-for="(form, i) in responseForms"
      :key="'form-' + i"
    >
      <b-row class="">
        <b-col class="">
          <h6 class="userName mb-0 ml-3 pt-1">
            <i
              class="fa fa-user mr-2"
              :class="form.iconColorClass"
              aria-hidden="true"
            ></i>
            {{ form.userDetails.firstName }}
            {{ form.userDetails.surname }}
          </h6>
        </b-col>
        <b-col class="">
          <div>
            <p class="location mr-2 mb-0">
              {{ form.location }},
              {{
                getDate({
                  rawDate: form.period,
                  periodType: form.periodType,
                })
              }}
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row class="">
        <b-col class="">
          <div class="actionBtn d-flex mr-2">
            <button
              class="btn ml-2"
              v-if="editOpt"
              @click="updateSignOffForm({ form: form, isEdit: true })"
            >
              <!-- <i class="fa fa-pencil-square-o" aria-hidden="true"></i> -->
              <img
              :src="require('@/assets/images/icons/editActive.svg')"
              class="img-fluid w-24"
              :style="{ filter: filterColor }" 
            /> 
            <span class="mx-1">  {{ $t("edit") }} </span>
            </button>
            <button
              class="btn ml-2"
              v-if="viewOpt"
              @click="updateSignOffForm({ form: form, isView: true })"
            >
              <!-- <i class="fa fa-eye" aria-hidden="true"></i> -->
              <img
              :src="require('@/assets/images/icons/previewActive.svg')"
              class="img-fluid w-24 mb-1"
              :style="{ filter: filterColor }"
            /> 
            <span class="mx-1"> {{ $t("View") }} </span> 
            </button>
            <button
              class="btn ml-2"
              @click.prevent.stop="deleteForm(form.formID)"
              v-if="deleteOpt && userDetails.id === form.userDetails.id"
            >
              <!-- <i class="fa fa-trash-o" aria-hidden="true"></i> -->
              <img
              :src="require('@/assets/images/icons/deleteActive.svg')"
              class="img-fluid w-24 mb-1"
              :style="{ filter: filterColor }"
            /> 
              {{ $t("deletebtn") }}
            </button>
          </div>
        </b-col>
      </b-row>
    </div>
    <div class="text-center text-white" v-if="responseForms.length === 0">
      {{ $t("noForms") }}
    </div>
  </section>
</template>
<script>
import { translateDate } from "@/components/Common/commonFunctions";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
export default {

  props: ["responseForms", "userDetails", "editOpt", "deleteOpt", "viewOpt"],
   mixins: [DynamicImageMixin],
  methods: {
    getDate(obj) {
      return translateDate(obj);
    },
    updateSignOffForm(formObj) {
      this.$emit("updateSignOffForm", formObj);
    },
    deleteForm(formID) {
      this.$emit("deleteForm", formID);
    },
  },
};
</script>
