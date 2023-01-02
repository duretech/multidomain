<template>
	<div class="interactive-page">
		<Header
			:headerConditions="{
				home: true,
				profile: false,
				pageTitle: true,
				dashboardLogo: true,
			}"
			@langChange="langChange"
			@activateTour="activateTour"
		/>
		<div class="interactive">
			<b-container fluid>
				<b-row>
					<b-col sm="12">
						<InteractiveComponent />
					</b-col>
				</b-row>
			</b-container>
		</div>
	</div>
</template>
<script>
/*global settings*/
import DocumentTitleMixin from "@/helpers/DocumentTitleMixin";
import LanguageChangeMixin from "@/helpers/LanguageChangeMixin";
import EmitTourCallbackMixin from "@/helpers/EmitTourCallbackMixin";
import InteractiveComponent from "@/components/Interactive/InteractiveComponent";

export default {
	components: {
		InteractiveComponent,
	},
	mixins: [DocumentTitleMixin, LanguageChangeMixin, EmitTourCallbackMixin],
	data() {
		return {};
	},
	created() {
		this.$store.commit("setNamespace", `${settings.tableName}`);
	},
};
</script>

<style lang="scss" scoped>
.mdgridviewpage-bg {
	// padding: 0px 0 20px !important;
}
</style>