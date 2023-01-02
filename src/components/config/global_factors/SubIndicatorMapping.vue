<template>
	<b-row class="mb-3">
		<b-col sm="12" class="pb-2">
			<div class="card-header text-uppercase f-s-0-875rem font-weight-bold">
				{{ $t("dataMapping") }}
			</div>
		</b-col>
		<template v-if="subIndicators.length">
			<b-col
				sm="12"
				class="mb-3"
				v-for="(subIndicator, ind) in subIndicators"
				:key="'subIndicator' + subIndicator.id"
			>
				<i
					class="fa fa-arrow-up mr-2 cursor-pointer f-s-0-875rem"
					v-b-tooltip.hover
					title="Move Up"
					@click.prevent.stop="
						moveItem({
							tInd,
							type: 'subMethod',
							mInd: m,
							siInd: ind,
							places: -1,
						})
					"
				></i>
				<i
					class="fa fa-arrow-down mr-2 cursor-pointer f-s-0-875rem"
					v-b-tooltip.hover
					title="Move Down"
					@click.prevent.stop="
						moveItem({
							tInd,
							type: 'subMethod',
							mInd: m,
							siInd: ind,
							places: 1,
						})
					"
				></i>
				<i
					class="fa fa-trash mr-2 cursor-pointer f-s-0-875rem"
					v-b-tooltip.hover
					:title="$t('deletebtn')"
					@click.prevent.stop="
						deleteElement({
							type: 'subMethod',
							tInd,
							mInd: m,
							dInd: ind,
						})
					"
				></i>
				<b-button
					class="btn-link p-0 text-uppercase color-grey f-s-0-875rem bg-transparent border-0"
					v-b-toggle="'additionalSettingsCollapse' + subIndicator.id"
				>
					<i
						class="fa fa-link mr-2 f-s-0-875rem"
						v-b-tooltip.hover
						:title="$t('link_IndicatorsData_Elements')"
					></i>
					<span class="color-grey">{{ subIndicator.name }}</span>
				</b-button>
				<b-collapse
					class="border border-b-l-radius-10px border-b-r-radius-10px p-2"
					:id="'additionalSettingsCollapse' + subIndicator.id"
				>
					<b-row class="mb-3">
						<b-col sm="5">
							<label :for="`displayName-${subIndicator.id}-${ind}`">{{
								$t("displayName")
							}}</label>
						</b-col>
						<b-col sm="7">
							<b-form-input
								:id="`displayName-${subIndicator.id}-${ind}`"
								type="text"
								v-model="subIndicator.name"
							></b-form-input>
						</b-col>
					</b-row>
					<b-row class="mb-3">
						<b-col sm="5">
							<label :for="`color-${subIndicator.id}-${ind}`">{{
								$t("color")
							}}</label>
						</b-col>
						<b-col sm="7">
							<b-input-group :id="`color-${subIndicator.id}-${ind}`">
								<b-form-input
									type="text"
									v-model="subIndicator.color"
								></b-form-input>
								<b-input-group-append>
									<b-form-input
										type="color"
										class="w-40px"
										v-model="subIndicator.color"
									></b-form-input>
								</b-input-group-append>
							</b-input-group>
						</b-col>
					</b-row>
					<b-row
						class="mb-3"
						v-if="
							$store.getters.getNamespace !== 'multi_program_mnch-dashboard'
						"
					>
						<b-col sm="5">
							<label :for="`cyp-${subIndicator.id}-${ind}`">{{
								$t("cyp")
							}}</label>
						</b-col>
						<b-col sm="7">
							<b-form-input
								:id="`cyp-${subIndicator.id}-${ind}`"
								type="number"
								v-model.number="subIndicator.cyp"
							></b-form-input>
						</b-col>
					</b-row>
					<div class="row">
						<div class="col-12">
							<div
								class="card-header color-black border-radius-0 text-uppercase f-s-0-875rem font-weight-bold"
							>
								{{ $t("indicators_Data_Elements_Mapping") }}
							</div>
						</div>
						<div class="col-12">
							<AddMapping
								:ind="ind"
								:index="m"
								:subTabIndex="0"
								:mapIndex="0"
								dataKey="subIndicator"
								:metrixList="metrixList"
								:chartByType="'chartByType' + indicatorId + subIndicator.id"
								:dataSetsList="dataSetsList"
								:chartBySubtype="
									'chartBySubtype' + indicatorId + subIndicator.id
								"
								:indicatorsList="indicatorsList"
								:dataElementsList="dataElementsList"
								:key="'add-mapping' + indicatorId + subIndicator.id"
								:mappingType="subIndicator.type"
								:selectedDE="subIndicator.selectedDE"
								@addDE="addDE"
								@resetDE="resetDE"
								@deleteDE="deleteDE"
								v-if="isDataFetched"
							/>
						</div>
					</div>
				</b-collapse>
			</b-col>
		</template>
		<b-col sm="12" class="text-center" v-if="subIndicators.length === 0">
			Please add mapping using
			<code>Add</code> button below.
		</b-col>
		<b-col sm="12" class="text-right">
			<b-button
				class="black-btn btn-sm"
				v-on:click="
					addElement({
						type: 'subMethod',
						mInd: m,
						tInd,
					})
				"
				>{{ $t("addbtn") }}</b-button
			>
		</b-col>
	</b-row>
</template>
<script>
export default {
	props: [
		"m",
		"tInd",
		"addDE",
		"resetDE",
		"deleteDE",
		"moveItem",
		"addElement",
		"metrixList",
		"indicatorId",
		"dataSetsList",
		"isDataFetched",
		"subIndicators",
		"deleteElement",
		"indicatorsList",
		"dataElementsList",
	],
	components: {
		AddMapping: () =>
			import(
				/* webpackChunkName: "admin_AddMapping"*/ "@/components/config/AddMapping"
			),
	},
};
</script>
