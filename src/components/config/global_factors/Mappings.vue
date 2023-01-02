<template>
	<b-card>
		<b-row>
			<b-col sm="12">
				<div class="accordion" role="tablist">
					<b-card
						no-body
						class="mb-1"
						v-for="(map, m) in mappings"
						:key="'indicator-' + map.indicator.id"
					>
						<div class="p-2" role="tab">
							<i
								class="fa fa-trash mr-2 cursor-pointer f-s-0-875rem"
								v-b-tooltip.hover
								:title="$t('deletebtn')"
								@click.prevent.stop="
									deleteElement({ type: 'method', tInd, dInd: m })
								"
							></i>
							<b-button
								v-b-toggle="'accordion-' + map.indicator.id"
								class="btn-link p-0 text-uppercase color-grey f-s-0-875rem bg-transparent border-0"
								><i
									class="fa fa-cog mr-2 f-s-0-875rem"
									v-b-tooltip.hover
									:title="$t('settings')"
								></i
								>{{ map.indicator.name }}</b-button
							>
						</div>
						<b-collapse
							:id="'accordion-' + map.indicator.id"
							accordion="my-accordion"
							role="tabpanel"
							class="border"
						>
							<b-card-body>
								<b-row class="mb-3">
									<b-col sm="5">
										<label :for="`displayName-${map.indicator.id}-${m}`">{{
											$t("displayName")
										}}</label>
									</b-col>
									<b-col sm="7">
										<b-form-input
											:id="`displayName-${map.indicator.id}-${m}`"
											type="text"
											v-model="map.indicator.name"
										></b-form-input>
									</b-col>
								</b-row>
								<b-row class="mb-3">
									<b-col sm="5">
										<label :for="`color-${map.indicator.id}-${m}`">{{
											$t("color")
										}}</label>
									</b-col>
									<b-col sm="7">
										<b-input-group :id="`color-${map.indicator.id}-${m}`">
											<b-form-input
												type="text"
												v-model="map.indicator.color"
											></b-form-input>
											<b-input-group-append>
												<b-form-input
													type="color"
													class="w-40px"
													v-model="map.indicator.color"
												></b-form-input>
											</b-input-group-append>
										</b-input-group>
									</b-col>
								</b-row>
								<b-row class="mb-3">
									<b-col sm="5">
										<label :for="`visible-${map.indicator.id}-${m}`">{{
											$t("disable")
										}}</label>
									</b-col>
									<b-col sm="7">
										<b-form-checkbox
											:id="`visible-${map.indicator.id}-${m}`"
											class="mr-n2 mb-n1"
											switch
											v-model="map.indicator.disable"
										>
										</b-form-checkbox>
									</b-col>
								</b-row>
								<SubIndicatorMapping
									:m="m"
									:tInd="tInd"
									:addDE="addDE"
									:resetDE="resetDE"
									:deleteDE="deleteDE"
									:moveItem="moveItem"
									:addElement="addElement"
									:metrixList="metrixList"
									:dataSetsList="dataSetsList"
									:deleteElement="deleteElement"
									:isDataFetched="isDataFetched"
									:indicatorId="map.indicator.id"
									:indicatorsList="indicatorsList"
									:dataElementsList="dataElementsList"
									:subIndicators="map.indicator.subIndicator"
									v-bind.sync="map.indicator.subIndicator"
								/>
							</b-card-body>
						</b-collapse>
					</b-card>
				</div>
			</b-col>
			<b-col sm="12" class="text-center" v-if="mappings.length === 0">
				Please add mapping using
				<code>Add</code> button below.
			</b-col>
			<b-col sm="12" class="text-right pt-3">
				<b-button
					class="black-btn btn-sm"
					@click="addElement({ type: 'method', tInd })"
					>{{ $t("addbtn") }}</b-button
				>
			</b-col>
		</b-row>
	</b-card>
</template>
<script>
export default {
	props: [
		"tInd",
		"moveItem",
		"mappings",
		"addElement",
		"metrixList",
		"dataSetsList",
		"deleteElement",
		"isDataFetched",
		"indicatorsList",
		"dataElementsList",
	],
	components: {
		SubIndicatorMapping: () =>
			import(
				/* webpackChunkName: "admin_SubIndicatorMapping"*/ "./SubIndicatorMapping"
			),
	},
	methods: {
		//Delete specific mapping
		deleteDE({ index, ind, deIndex, dataKey }) {
			this.mappings[index].indicator[dataKey][ind].selectedDE.splice(
				deIndex,
				1
			);
		},
		//Reset the mapping
		resetDE({ index, ind, dataKey }) {
			this.mappings[index].indicator[dataKey][ind].selectedDE = [];
		},
		//Store the selected mapping in configuration object
		addDE({ index, ind, type, selectedDataSource, dataKey }) {
			this.mappings[index].indicator[dataKey][ind].type = type;
			this.mappings[index].indicator[dataKey][ind].selectedDE.push(
				selectedDataSource
			);
		},
	},
};
</script>
