<template>
	<div class="p-2 border mb-3">
		<div class="text-right">
			<b-button
				class="black-btn btn-sm"
				@click="actionOnQuestion({ type: 'add', tInd: i, stInd: j })"
				>{{ $t("addNewQuest") }}</b-button
			>
		</div>
		<template v-if="questions.length">
			<div>{{ $t("questSet") }}</div>
			<b-row
				class="my-1 mx-0"
				v-for="(question, index) in questions"
				:key="'question' + question.id"
			>
				<b-col sm="1" class="p-0">
					<span
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
					></span>
					<span
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
					></span>
					<span
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
					></span>
					<span
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
					></span>
				</b-col>
				<b-col sm="11" class="pl-0">
					<div>{{ question.question }}</div>
					<div>
						<b-form-radio-group :options="question.options" plain disabled>
						</b-form-radio-group>
					</div>
				</b-col>
			</b-row>
		</template>
		<div class="text-center text-muted" v-if="questions.length === 0">
			There are no questions<br />
			Add a new question using the
			<b>Add New Question</b> button.
		</div>
	</div>
</template>
<script>
export default {
	props: ["i", "j", "questions", "moveItem", "actionOnQuestion"],
};
</script>
