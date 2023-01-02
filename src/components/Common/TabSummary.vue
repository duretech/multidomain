<template>
	<div v-if="content" class="summary-dqr py-2">
		<!-- <b-container fluid> -->
		<b-row class="mx-0">
			<b-col sm="12">
				<div>
					<b-button
						class="summary-btn dqr-summary-btn"
						v-b-toggle="'tabCollapse' + contKey"
						>{{ $t("Summary")
						}}<span
							class="fa fa-angle-double-right summary-arrow ml-2"
							aria-hidden="true"
						></span
					></b-button>
					<b-collapse
						visible
						:id="'tabCollapse' + contKey"
						class="chart-body dqr-summary-collapse p-3"
					>
						<div class="dqr-summary-text-collapse" v-html="content"></div>
					</b-collapse>
				</div>
			</b-col>
		</b-row>
		<!-- </b-container> -->
	</div>
</template>

<script>
export default {
	props: ["content", "contKey"],
};
</script>
