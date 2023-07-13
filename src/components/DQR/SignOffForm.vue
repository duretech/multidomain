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
            ><span>{{ $t("Q") }}.{{ i + 1 }})&nbsp;</span>
            <span>{{ question.question[$i18n.locale] }} </span></label
          >
          <b-row class="px-3">
            <b-col class="form-check-inline">
              <label class="pt-2 mr-3">{{ $t("ans") }}:</label>
              <b-form-radio-group
                :disabled="isViewForm"
                v-model="question.answer"
                plain
                class="d-flex align-item-center"
              >
                <b-form-radio
                  :value="opt.value"
                  v-for="opt in question.options"
                  :key="'opt' + opt.value"
                  :data-selected="opt.value === question.answer"
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
            :placeholder="$t('comOptional')"
            class="form-control comment-area"
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
