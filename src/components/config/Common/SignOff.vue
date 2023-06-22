<template>
  <div class="p-2 mb-3 sign-off">
    <div class="text-right">
      <b-button
        class="black-btn blue-btn btn-sm"
        @click="actionOnQuestion({ type: 'add', tInd: i, stInd: j })"
        >{{ $t("addNewQuest") }}</b-button
      >
    </div>
    <template v-if="questions.length">
      <div class="question-head mb-3">{{ $t("questSet") }}</div>
      <div class="row-div">
      <b-row
        class="my-1 mx-0 pt-1"
        v-for="(question, index) in questions"
        :key="'question' + question.id"
      >
        <b-col sm="2" class="me-15">
          <!-- <span
						class="fa fa-arrow-up mr-2 cursor-pointer f-s-0-875rem"
						v-b-tooltip.hover
						title="Move Up"
						@click.prevent.stop="
							moveItem({
								type: 'question',
								tInd: i,
								stInd: j,
								qInd: index,
								places: -1,
							})
						"
					></span> -->
          <img
            v-b-tooltip.hover
            :title="$t('moveUp')"
            src="@/assets/images/icons/up-adminarrow.svg"
            :style="{ filter: filterColor }"
            class="mr-2 cursor-pointer f-s-0-875rem w-8px"
            @click.prevent.stop="
              moveItem({
                type: 'question',
                tInd: i,
                stInd: j,
                qInd: index,
                places: -1,
              })
            "
          />
          <!-- <span
						class="fa fa-arrow-down mr-2 cursor-pointer f-s-0-875rem"
						v-b-tooltip.hover
						title="Move Down"
						@click.prevent.stop="
							moveItem({
								type: 'question',
								tInd: i,
								stInd: j,
								qInd: index,
								places: 1,
							})
						"
					></span> -->
          <img
            src="@/assets/images/icons/down-adminarrow.svg"
            :style="{ filter: filterColor }"
            class="mr-2 cursor-pointer f-s-0-875rem w-8px"
            v-b-tooltip.hover
            :title="$t('moveDown')"
            @click.prevent.stop="
              moveItem({
                type: 'question',
                tInd: i,
                stInd: j,
                qInd: index,
                places: 1,
              })
            "
          />
          <!-- <span
						class="fa fa-edit mr-2 cursor-pointer color-black f-s-0-875rem"
						@click="
							actionOnQuestion({
								type: 'edit',
								tInd: i,
								stInd: j,
								qInd: index,
							})
						"
						v-b-tooltip.hover
						:title="$t('edit')"
					></span> -->
          <img
            src="@/assets/images/icons/edit-adminicon.svg"
            :style="{ filter: filterColor }"
            class="mr-2 cursor-pointer f-s-0-875rem w-14"
            @click="
              actionOnQuestion({
                type: 'edit',
                tInd: i,
                stInd: j,
                qInd: index,
              })
            "
            v-b-tooltip.hover
            :title="$t('edit')"
          />
          <!-- <span
						class="fa fa-trash mr-2 cursor-pointer color-black f-s-0-875rem"
						@click="
							actionOnQuestion({
								type: 'delete',
								tInd: i,
								stInd: j,
								qInd: index,
							})
						"
						v-b-tooltip.hover
						:title="$t('deletebtn')"
					></span> -->
          <img
            src="@/assets/images/icons/admindelete-icon.svg"
            :style="{ filter: filterColor }"
            class="mr-2 cursor-pointer f-s-0-875rem w-13"
            @click="
              actionOnQuestion({
                type: 'delete',
                tInd: i,
                stInd: j,
                qInd: index,
              })
            "
            v-b-tooltip.hover
            :title="$t('deletebtn')"
          />
        </b-col>
        <b-col sm="10" class="pl-0 ml-45px mb-2">
          <div>{{ question.question[$i18n.locale] }}</div>
          <div>
            <b-form-radio-group plain disabled>
              <b-form-radio
                :value="opt.value"
                v-for="opt in question.options"
                :key="'opt' + opt.value"
                >{{ opt.text[$i18n.locale] }}</b-form-radio
              >
            </b-form-radio-group>
          </div>
        </b-col>
      </b-row>
    </div>
      <!-- <div class="border-bottomgrey"></div> -->
    </template>
    <div class="text-center text-muted" v-if="questions.length === 0">
      {{ $t("noQuestions") }}<br />
      {{ $t("newQuestion") }}
      <b>{{ $t("addNewQuest") }}</b>
      {{ $t("btn") }}
    </div>
  </div>
</template>
<script>
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
export default {
  props: ["i", "j", "questions", "moveItem", "actionOnQuestion"],
  mixins: [DynamicImageMixin],
};
</script>
