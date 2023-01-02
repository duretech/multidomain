<template>
	<section>
		<div v-if="signOffForm.length">
			<div class="refresh" v-if="!hideRefresh">
				<button class="refresh-btn" @click.prevent.stop="refreshForm">
					<i class="fa fa-refresh" aria-hidden="true"></i
					><span class="pl-2">Refresh</span>
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
						<span>{{ question.question }} </span></label
					>
					<b-row class="px-3">
						<b-col class="form-check-inline">
							<label class="pt-1 mr-3">Ans:</label>
							<b-form-radio-group
								:disabled="isViewForm"
								v-model="question.answer"
								:options="question.options"
								plain
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
						v-model="question.comment"
						:disabled="isViewForm"
					></textarea>
				</div>
			</form>
		</div>
		<div class="text-center text-white" v-else>No form available</div>
	</section>
</template>
<script>
export default {
	props: ["signOffForm", "hideRefresh", "isViewForm"],
	methods: {
		refreshForm() {
			this.$emit("refreshForm");
		},
	},
};
</script>
