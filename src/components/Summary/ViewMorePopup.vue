<template>
	<div class="anc-modal">
		<b-modal
			class="anc-modalpopup"
			id="modal-anc"
			size="xl"
			:title="summaryObj.tabName"
			v-model="modalShow"
			@hidden="$emit('visibleChange')"
			no-close-on-backdrop
		>
			<b-container>
				<DynamicSummary
					@getGeoJson="getGeoJson"
					:allGeoJson="allGeoJson"
					:summaryObj="summaryObj"
					:locationPeriod="locationPeriod"
				/>
			</b-container>
		</b-modal>
	</div>
</template>
<script>
import DynamicSummary from "@/components/Summary/DynamicSummary.vue";
export default {
	props: ["summaryObj", "allGeoJson", "locationPeriod"],
	components: {
		DynamicSummary,
	},
	data() {
		return {
			modalShow: true,
		};
	},
	methods: {
		getGeoJson(loc, obj) {
			this.$emit("getGeoJson", loc, obj);
		},
	},
};
</script>

<style scoped></style>