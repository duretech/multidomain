<template>
	<div>
		<div class="p-2 border mb-3" v-if="isSingleSource">
			<b-row
				class="mb-3"
				v-for="(map, m) in mapping"
				:key="'mapping-' + map.indicator.static_name"
			>
				<b-col sm="12">
					<div>
						<i
							class="fa fa-arrow-up mr-2 cursor-pointer f-s-0-875rem"
							v-b-tooltip.hover
							title="Move Up"
							@click.prevent.stop="
								moveItem({
									type: 'method',
									tInd: i,
									stInd: j,
									mInd: m,
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
									type: 'method',
									tInd: i,
									stInd: j,
									mInd: m,
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
									type: 'method',
									tInd: i,
									stInd: j,
									delInd: m,
								})
							"
						></i>
						<b-button
							class="btn-link p-0 text-uppercase color-grey f-s-0-875rem bg-transparent border-0"
							v-b-toggle="'collapseMappingSettings' + i + j + m"
						>
							<i
								class="fa fa-cog mr-2 f-s-0-875rem"
								v-b-tooltip.hover
								:title="$t('dataMapping')"
							></i>
							{{ map.indicator.name }}
						</b-button>
						<b-collapse
							class="border border-b-l-radius-10px border-b-r-radius-10px p-2"
							:id="'collapseMappingSettings' + i + j + m"
						>
							<b-row class="mb-3">
								<b-col sm="5">
									<label :for="`displayName-${i}-${j}-${m}`">{{
										$t("displayName")
									}}</label>
								</b-col>
								<b-col sm="7">
									<b-form-input
										:id="`displayName-${i}-${j}-${m}`"
										type="text"
										v-model="map.indicator.name"
									></b-form-input>
								</b-col>
							</b-row>
							<b-row class="mb-3">
								<b-col sm="5">
									<label :for="`color-${i}-${j}-${m}`">{{ $t("color") }}</label>
								</b-col>
								<b-col sm="7">
									<b-input-group :id="`color-${i}-${j}-${m}`">
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
									<label :for="`visible-${i}-${j}-${m}`">{{
										$t("disable")
									}}</label>
								</b-col>
								<b-col sm="7">
									<b-form-checkbox
										:id="`visible-${i}-${j}-${m}`"
										class="mr-n2 mb-n1"
										switch
										v-model="map.indicator.disable"
									>
									</b-form-checkbox>
								</b-col>
							</b-row>
							<b-row class="mb-3">
								<b-col sm="12" class="pb-2">
									<div
										class="card-header text-uppercase f-s-0-875rem font-weight-bold"
									>
										{{ $t("dataMapping") }}
									</div>
								</b-col>
								<template v-if="map.indicator.subIndicator.length">
									<b-col
										sm="12"
										class="mb-3"
										v-for="(subIndicator, ind) in map.indicator.subIndicator"
										:key="'subIndicator' + subIndicator.static_name"
									>
										<i
											class="fa fa-arrow-up mr-2 cursor-pointer f-s-0-875rem"
											v-b-tooltip.hover
											title="Move Up"
											@click.prevent.stop="
												moveItem({
													type: 'subMethod',
													tInd: i,
													stInd: j,
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
													type: 'subMethod',
													tInd: i,
													stInd: j,
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
													tInd: i,
													stInd: j,
													mInd: m,
													delInd: ind,
												})
											"
										></i>
										<b-button
											class="btn-link p-0 text-uppercase color-grey f-s-0-875rem bg-transparent border-0"
											v-b-toggle="
												'additionalSettingsCollapse' + i + j + m + ind
											"
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
											:id="'additionalSettingsCollapse' + i + j + m + ind"
										>
											<b-row class="mb-3">
												<b-col sm="5">
													<label :for="`displayName-${i}-${j}-${m}-${ind}`">{{
														$t("displayName")
													}}</label>
												</b-col>
												<b-col sm="7">
													<b-form-input
														:id="`displayName-${i}-${j}-${m}-${ind}`"
														type="text"
														v-model="subIndicator.name"
													></b-form-input>
												</b-col>
											</b-row>
											<b-row class="mb-3">
												<b-col sm="5">
													<label :for="`color-${i}-${j}-${m}-${ind}`">{{
														$t("color")
													}}</label>
												</b-col>
												<b-col sm="7">
													<b-input-group :id="`color-${i}-${j}-${m}-${ind}`">
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
														:index="i"
														:subTabIndex="j"
														:mapIndex="m"
														dataKey="subIndicator"
														:metrixList="metrixList"
														:chartByType="'chartByType' + i + j + m + ind"
														:dataSetsList="dataSetsList"
														:chartBySubtype="'chartBySubtype' + i + j + m + ind"
														:indicatorsList="indicatorsList"
														:dataElementsList="dataElementsList"
														:key="'add-mapping' + i + j + m + ind"
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
								<b-col
									sm="12"
									class="text-center"
									v-if="map.indicator.subIndicator.length === 0"
								>
									Please add mapping using
									<code>Add</code> button below.
								</b-col>
								<b-col sm="12" class="text-right">
									<b-button
										class="black-btn btn-sm"
										v-on:click="
											addElement({
												type: 'subMethod',
												tInd: i,
												stInd: j,
												mInd: m,
											})
										"
										>{{ $t("addbtn") }}</b-button
									>
								</b-col>
							</b-row>
						</b-collapse>
					</div>
				</b-col>
			</b-row>
			<b-row v-if="mapping.length === 0">
				<b-col sm="12" class="text-center">
					Please add mapping using <code>Add</code> button below.
				</b-col>
			</b-row>
			<div class="text-right pt-2">
				<b-button
					class="black-btn btn-sm"
					v-on:click="addElement({ type: 'method', tInd: i, stInd: j })"
					>{{ $t("addbtn") }}</b-button
				>
			</div>
		</div>
		<div class="p-2 border mb-3" v-else>
			<b-card no-body>
				<b-tabs card>
					<!-- Render Tabs, supply a unique `key` to each tab -->
					<b-tab
						v-for="(source, s) in sourceMapping"
						:key="'source-' + i + j + s"
						class="border"
					>
						<template #title>
							<i
								class="fa fa-edit mr-2 f-s-0-875rem"
								v-b-tooltip.hover
								:title="$t('edit')"
								@click="
									updateTab({
										type: 'type31',
										tabName: source.tabName,
										tInd: i,
										stInd: j,
										smInd: s,
									})
								"
							></i>
							<i
								class="fa fa-trash mr-2 f-s-0-875rem"
								v-b-tooltip.hover
								:title="$t('deletebtn')"
								@click="
									deleteElement({
										type: 'sourceMapping',
										tInd: i,
										stInd: j,
										smInd: s,
									})
								"
							></i>
							{{ source.tabName }}
						</template>
						<b-row
							class="mb-3"
							v-for="(map, m) in source.mapping"
							:key="'mapping-' + map.indicator.static_name"
						>
							<b-col sm="12">
								<div>
									<i
										class="fa fa-arrow-up mr-2 cursor-pointer f-s-0-875rem"
										v-b-tooltip.hover
										title="Move Up"
										@click.prevent.stop="
											moveItem({
												type: 'sourceMethod',
												tInd: i,
												stInd: j,
												smInd: s,
												mInd: m,
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
												type: 'sourceMethod',
												tInd: i,
												stInd: j,
												smInd: s,
												mInd: m,
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
												type: 'sourceMethod',
												tInd: i,
												stInd: j,
												smInd: s,
												delInd: m,
											})
										"
									></i>
									<b-button
										class="btn-link p-0 text-uppercase color-grey f-s-0-875rem bg-transparent border-0"
										v-b-toggle="'collapseMappingSettings' + i + j + s + m"
									>
										<i
											class="fa fa-cog mr-2 f-s-0-875rem"
											v-b-tooltip.hover
											:title="$t('dataMapping')"
										></i>
										{{ map.indicator.name }}
									</b-button>
									<b-collapse
										class="border border-b-l-radius-10px border-b-r-radius-10px p-2"
										:id="'collapseMappingSettings' + i + j + s + m"
									>
										<b-row class="mb-3">
											<b-col sm="5">
												<label :for="`displayName-${i}-${j}-${s}-${m}`">{{
													$t("displayName")
												}}</label>
											</b-col>
											<b-col sm="7">
												<b-form-input
													:id="`displayName-${i}-${j}-${s}-${m}`"
													type="text"
													v-model="map.indicator.name"
												></b-form-input>
											</b-col>
										</b-row>
										<b-row class="mb-3">
											<b-col sm="5">
												<label :for="`color-${i}-${j}-${s}-${m}`">{{
													$t("color")
												}}</label>
											</b-col>
											<b-col sm="7">
												<b-input-group :id="`color-${i}-${j}-${s}-${m}`">
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
												<label :for="`visible-${i}-${j}-${s}-${m}`">{{
													$t("disable")
												}}</label>
											</b-col>
											<b-col sm="7">
												<b-form-checkbox
													:id="`visible-${i}-${j}-${s}-${m}`"
													class="mr-n2 mb-n1"
													switch
													v-model="map.indicator.disable"
												>
												</b-form-checkbox>
											</b-col>
										</b-row>
										<b-row class="mb-3">
											<b-col sm="12" class="pb-2">
												<div
													class="card-header color-black text-uppercase f-s-0-875rem font-weight-bold"
												>
													{{ $t("dataMapping") }}
												</div>
											</b-col>
											<template v-if="map.indicator.subIndicator.length">
												<b-col
													sm="12"
													class="mb-3"
													v-for="(subIndicator, ind) in map.indicator
														.subIndicator"
													:key="subIndicator.static_name"
												>
													<i
														class="fa fa-arrow-up mr-2 cursor-pointer f-s-0-875rem"
														v-b-tooltip.hover
														title="Move Up"
														@click.prevent.stop="
															moveItem({
																type: 'sourceSubMethod',
																tInd: i,
																stInd: j,
																smInd: s,
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
																type: 'sourceSubMethod',
																tInd: i,
																stInd: j,
																smInd: s,
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
																type: 'sourceSubMethod',
																tInd: i,
																stInd: j,
																smInd: s,
																mInd: m,
																delInd: ind,
															})
														"
													></i>
													<b-button
														class="btn-link p-0 text-uppercase color-grey f-s-0-875rem bg-transparent border-0"
														v-b-toggle="
															'additionalSettingsCollapse' + i + j + m + ind + s
														"
													>
														<i
															class="fa fa-link mr-2 f-s-0-875rem"
															v-b-tooltip.hover
															:title="$t('link_IndicatorsData_Elements')"
														></i>
														<span class="color-grey">{{
															subIndicator.name
														}}</span>
													</b-button>
													<b-collapse
														class="border border-b-l-radius-10px border-b-r-radius-10px p-2"
														:id="
															'additionalSettingsCollapse' + i + j + m + ind + s
														"
													>
														<b-row class="mb-3">
															<b-col sm="5">
																<label
																	:for="`displayName-${i}-${j}-${s}-${m}-${ind}`"
																	>{{ $t("displayName") }}</label
																>
															</b-col>
															<b-col sm="7">
																<b-form-input
																	:id="`displayName-${i}-${j}-${s}-${m}-${ind}`"
																	type="text"
																	v-model="subIndicator.name"
																></b-form-input>
															</b-col>
														</b-row>
														<b-row class="mb-3">
															<b-col sm="5">
																<label
																	:for="`color-${i}-${j}-${s}-${m}-${ind}`"
																	>{{ $t("color") }}</label
																>
															</b-col>
															<b-col sm="7">
																<b-input-group
																	:id="`color-${i}-${j}-${s}-${m}-${ind}`"
																>
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
																	:index="i"
																	:subTabIndex="j"
																	:mapIndex="m"
																	:sourceIndex="s"
																	dataKey="subIndicator"
																	:metrixList="metrixList"
																	:chartByType="
																		'chartByType' + i + j + m + ind + s
																	"
																	:dataSetsList="dataSetsList"
																	:chartBySubtype="
																		'chartBySubtype' + i + j + m + ind + s
																	"
																	:indicatorsList="indicatorsList"
																	:dataElementsList="dataElementsList"
																	:key="'add-mapping' + i + j + m + ind + s"
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
											<b-col
												sm="12"
												class="text-center"
												v-if="map.indicator.subIndicator.length === 0"
											>
												Please add mapping using
												<code>Add</code> button below.
											</b-col>
											<b-col sm="12" class="text-right">
												<b-button
													class="black-btn btn-sm"
													v-on:click="
														addElement({
															type: 'sourceSubMethod',
															tInd: i,
															stInd: j,
															mInd: m,
															smInd: s,
														})
													"
													>{{ $t("addbtn") }}</b-button
												>
											</b-col>
										</b-row>
									</b-collapse>
								</div>
							</b-col>
						</b-row>
						<b-row v-if="source.mapping.length === 0">
							<b-col sm="12" class="text-center">
								Please add mapping using
								<code>Add</code> button below.
							</b-col>
						</b-row>
						<div class="text-right pt-2">
							<b-button
								class="black-btn btn-sm"
								v-on:click="
									addElement({
										type: 'sourceMethod',
										tInd: i,
										stInd: j,
										smInd: s,
									})
								"
								>{{ $t("addbtn") }}</b-button
							>
						</div>
					</b-tab>
					<!-- New Tab Button (Using tabs-start slot) -->
					<template #tabs-start>
						<b-nav-item
							role="presentation"
							@click.prevent="
								updateTab({
									type: 'type3',
									tInd: i,
									stInd: j,
								})
							"
							href="#"
							class="text-center"
							v-b-tooltip.hover
							:title="$t('addbtn')"
							v-if="sourceMapping.length < 2"
							><b>+</b></b-nav-item
						>
					</template>

					<!-- Render this if no tabs -->
					<template #empty>
						<div class="text-center text-muted">
							There are no open tabs<br />
							Open a new tab using the <b>+</b> button.
						</div>
					</template>
				</b-tabs>
			</b-card>
		</div>
	</div>
</template>
<script>
export default {
	props: [
		"i",
		"j",
		"isSingleSource",
		"mapping",
		"sourceMapping",
		"addElement",
		"moveItem",
		"deleteElement",
		"metrixList",
		"dataSetsList",
		"indicatorsList",
		"dataElementsList",
		"isDataFetched",
		"addDE",
		"resetDE",
		"deleteDE",
	],
	components: {
		AddMapping: () =>
			import(
				/* webpackChunkName: "admin_AddMapping"*/ "@/components/config/AddMapping"
			),
	},
};
</script>
