<template>
  <section>
    <div v-if="signOffForm.length">
      <div class="refresh" v-if="!hideRefresh">
        <button class="refresh-btn" @click.prevent.stop="refreshForm">
          <!-- <i class="fa fa-refresh" aria-hidden="true"></i> -->
          <img
          :src="require('@/assets/images/icons/icon-refresh.svg')"
          class="img-fluid w-16px"
          :style="{ filter: filterColor }"
        /> 
          <span class="pl-2">{{ $t("refreshBtn") }}</span>
        </button>
      </div>
      <form>
        <div
          class="question-answer"
          :class="{ 'mt-3': hideRefresh }"
          v-for="(question, i) in signOffForm"
          :key="`question-${i}`"
        >
          <label
            ><span>Q.{{ i + 1 }})&nbsp;</span>
            <span>{{ question.question[$i18n.locale] }} </span></label
          >
          <b-row class="px-3">
            <b-col class="form-check-inline">
              <label class="pt-1 mr-3">Ans:</label>
              <b-form-radio-group
                :disabled="isViewForm"
                v-model="question.answer"
                plain
              >
                <b-form-radio
                  :value="opt.value"
                  v-for="opt in question.options"
                  :key="'opt' + opt.value"
                  >{{ opt.text[$i18n.locale] }}</b-form-radio
                >
               
               
              </b-form-radio-group>
             
            
     
            </b-col>
            <div class="editIcon float-right pt-1 d-none">
              <i
                class="fa fa-pencil-square-o cursor-pointer"
                aria-hidden="true"
              ></i>
            </div>
          </b-row>
          <textarea
            placeholder="Comment (Optional)"
            class="form-control"
            v-model="question.comment[$i18n.locale]"
            :disabled="isViewForm"
          ></textarea>
        </div>
      </form>
    </div>
    <div class="text-center text-white" v-else>{{ $t("noForms") }}</div>
  </section>
</template>
<script>
import DynamicImageMixin from "@/helpers/DynamicImageMixin";

export default {
  props: ["signOffForm", "hideRefresh", "isViewForm"],
  mixins: [DynamicImageMixin],
  methods: {
    refreshForm() {
      this.$emit("refreshForm");
    },
  },
};
</script>
