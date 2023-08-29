<template>
  <section>
    <div
      class="card mb-3"
      v-for="(form, i) in responseForms"
      :key="'form-' + i"
    >
      <b-row class="">
        <b-col class="">
          <h6 class="userName mb-0 pt-1">
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
            <p class="location mb-0">
              {{ form.location }},
              {{ form.periodText }}
            </p>
          </div>
        </b-col>
      </b-row>
      <b-row class="small">
        <b-col class="d-flex align-items-end justify-content-between">
          <div class="location">
            <strong>{{ $t("lastUpdated") }}:</strong> {{ form.updatedAt }}
          </div>
          <div class="actionBtn d-flex">
            <button
              class="btn ml-2"
              v-if="editOpt"
              @click="updateSignOffForm({ form: form, isEdit: true })"
            >
              <img
                :src="require('@/assets/images/icons/editActive.svg')"
                class="img-fluid w-24"
                :style="{ filter: filterColor }"
              />
              <span class="mx-1 small"> {{ $t("edit") }} </span>
            </button>
            <button
              class="btn ml-2"
              v-if="viewOpt"
              @click="updateSignOffForm({ form: form, isView: true })"
            >
              <img
                :src="require('@/assets/images/icons/previewActive.svg')"
                class="img-fluid w-24 mb-1"
                :style="{ filter: filterColor }"
              />
              <span class="mx-1 small"> {{ $t("View") }} </span>
            </button>
            <button
              class="btn ml-2"
              @click.prevent.stop="deleteForm(form.formID)"
              v-if="deleteOpt && userDetails.id === form.userDetails.id"
            >
              <img
                :src="require('@/assets/images/icons/deleteActive.svg')"
                class="img-fluid w-24 mb-1"
                :style="{ filter: filterColor }"
              />
              <span class="mx-1 small">{{ $t("deletebtn") }}</span>
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
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
export default {
  props: ["responseForms", "userDetails", "editOpt", "deleteOpt", "viewOpt"],
  mixins: [DynamicImageMixin],
  methods: {
    getDate(obj) {
      return obj.periodText;
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
