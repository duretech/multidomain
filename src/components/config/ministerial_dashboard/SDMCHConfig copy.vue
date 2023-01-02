<template>
	<div class="footer-buttons" v-if="isDataFetched">
		<b-card no-body>
			<b-tabs
				vertical
				card
				lazy
				nav-class="p-0"
				nav-wrapper-class="adminConfig"
			>
				<!-- Render Tabs, supply a unique `key` to each tab -->
				<b-tab
					v-for="(tab, i) in tabs"
					:key="'dyn-tab-' + tab.id"
					class="pl-2 pb-2 pt-0 pr-0"
				>
					<template #title>
						<i
							class="fa fa-arrow-up mr-2 cursor-pointer f-s-0-875rem"
							v-b-tooltip.hover
							title="Move Up"
							@click.prevent.stop="
								moveItem({ type: 'tab', tInd: i, places: -1 })
							"
						></i>
						<i
							class="fa fa-arrow-down mr-2 cursor-pointer f-s-0-875rem"
							v-b-tooltip.hover
							title="Move Down"
							@click.prevent.stop="
								moveItem({ type: 'tab', tInd: i, places: 1 })
							"
						></i>
						<i
							class="fa fa-edit mr-2 f-s-0-875rem"
							v-b-tooltip.hover
							:title="$t('edit')"
							@click="
								updateTab({
									type: 'type11',
									tabName: tab.tabName,
									tInd: i,
									group: tab.group,
									showGroups: tab.showGroups,
								})
							"
						></i>
						<i
							class="fa fa-trash mr-2 f-s-0-875rem"
							v-b-tooltip.hover
							:title="$t('deletebtn')"
							@click="deleteElement({ type: 'tab', tInd: i })"
						></i>
						{{ tab.tabName }}
					</template>
					<div>
						<b-card no-body>
							<b-tabs
								card
								lazy
								nav-class="p-0 m-0"
								nav-wrapper-class="adminConfigInner p-0"
							>
								<!-- Render Tabs, supply a unique `key` to each tab -->
								<b-tab
									v-for="(subTab, j) in tab.subTabs"
									:key="'dyn-sub-tab-' + subTab.id"
									class="border"
								>
									<template #title>
										<i
											class="fa fa-arrow-left mr-2 cursor-pointer f-s-0-875rem"
											v-b-tooltip.hover
											title="Move Left"
											@click.prevent.stop="
												moveItem({
													type: 'subTab',
													tInd: i,
													stInd: j,
													places: -1,
												})
											"
										></i>
										<i
											class="fa fa-arrow-right mr-2 cursor-pointer f-s-0-875rem"
											v-b-tooltip.hover
											title="Move Right"
											@click.prevent.stop="
												moveItem({
													type: 'subTab',
													tInd: i,
													stInd: j,
													places: 1,
												})
											"
										></i>
										<i
											class="fa fa-edit mr-2 f-s-0-875rem"
											v-b-tooltip.hover
											:title="$t('edit')"
											@click="
												updateTab({
													type: 'type21',
													tabName: subTab.tabName,
													tInd: i,
													stInd: j,
												})
											"
										></i>
										<i
											class="fa fa-trash mr-2 f-s-0-875rem"
											v-b-tooltip.hover
											:title="$t('deletebtn')"
											@click="
												deleteElement({ type: 'subTab', tInd: i, stInd: j })
											"
										></i>
										{{ subTab.tabName }}
									</template>
									<b-row v-if="tab.group">
										<b-col sm="12">
											<b-row class="mb-3">
												<b-col sm="5">
													<label :for="`type-tabGroup-${i}-${j}`">Group</label>
												</b-col>
												<b-col sm="7">
													<b-form-select
														:id="`type-tabGroup-${i}-${j}`"
														v-model="subTab.group"
														:options="subGroups(tab.group)"
														@change="
															updatedBGData({
																tInd: i,
																stInd: j,
																group: subTab.group,
															})
														"
													></b-form-select>
												</b-col>
											</b-row>
										</b-col>
										<b-col sm="12">
											<b-row class="mb-3">
												<b-col sm="5">
													<label :for="`type-tabSummary-${i}-${j}`">{{
														$t("catInformation")
													}}</label>
												</b-col>
												<b-col sm="7">
													<vue-editor
														:id="`type-tabSummary-${i}-${j}`"
														v-model="subTab.categoryInfo"
														:state="
															subTab.categoryInfo &&
															subTab.categoryInfo.length !== 0
														"
														:editorToolbar="customToolbar"
														:placeholder="$t('enter_category_information')"
													></vue-editor>
												</b-col>
											</b-row>
										</b-col>
										<b-col sm="12" v-if="subTab.group.includes('ICC')">
											<b-row class="mb-3">
												<b-col sm="5">
													<label :for="`type-singleSource-${i}-${j}`"
														>Single Source</label
													>
												</b-col>
												<b-col sm="7">
													<b-form-checkbox
														:id="`type-singleSource-${i}-${j}`"
														class="mr-n2 mb-n1 mt-1"
														switch
														v-model="subTab.isSingleSource"
													>
													</b-form-checkbox>
												</b-col>
											</b-row>
										</b-col>
										<b-col sm="12" v-if="moduleKey === 'summaryDashboard'">
											<b-row class="mb-3">
												<b-col sm="5">
													<label :for="`type-linkToIntegrated-${i}-${j}`"
														>Link to Integrated Dashboard</label
													>
												</b-col>
												<b-col sm="7">
													<b-form-checkbox
														:id="`type-linkToIntegrated-${i}-${j}`"
														class="mr-n2 mb-n1 mt-1"
														switch
														v-model="subTab.integrated.linked"
													>
													</b-form-checkbox>
												</b-col>
											</b-row>
										</b-col>
									</b-row>
									<template v-if="moduleKey === 'summaryDashboard'">
										<transition name="slide-fade">
											<b-row v-if="subTab.integrated.linked">
												<b-col sm="12" lg="12">
													<b-row class="mb-3">
														<b-col sm="5">
															<label :for="`displayName-${i}-${j}`">{{
																$t("displayName")
															}}</label>
														</b-col>
														<b-col sm="7">
															<b-form-input
																:id="`displayName-${i}-${j}`"
																type="text"
																v-model="subTab.integrated.displayName"
															></b-form-input>
														</b-col>
													</b-row>
												</b-col>
												<b-col sm="12" lg="12">
													<b-row class="mb-3">
														<b-col sm="5">
															<label :for="`color-${i}-${j}`">{{
																$t("color")
															}}</label>
														</b-col>
														<b-col sm="7">
															<b-input-group :id="`color-${i}-${j}`">
																<b-form-input
																	type="text"
																	v-model="subTab.integrated.color"
																></b-form-input>
																<b-input-group-append>
																	<b-form-input
																		type="color"
																		class="w-40px"
																		v-model="subTab.integrated.color"
																	></b-form-input>
																</b-input-group-append>
															</b-input-group>
														</b-col>
													</b-row>
												</b-col>
												<!-- <b-col sm="12" lg="12">
												<b-row class="mb-3">
													<b-col sm="5">
														<label :for="`minThreshold-${i}-${j}`"
															>Min Threshold</label
														>
													</b-col>
													<b-col sm="7">
														<b-input-group :id="`minThreshold-${i}-${j}`">
															<b-form-input
																min="0"
																max="100"
																step="0.01"
																type="number"
																v-model="subTab.integrated.minThreshold"
															></b-form-input>
															<!--UI not loading properly due to _signoff.scss file css -->
												<!-- <b-input-group-append is-text>
																<b-form-input
																	v-model="subTab.integrated.minThreshold"
																	type="range"
																	min="0"
																	max="100"
																	step="0.01"
																></b-form-input>
															</b-input-group-append>
														</b-input-group>
													</b-col>
												</b-row>
											</b-col> -->
												<!-- <b-col sm="12" lg="12">
												<b-row class="mb-3">
													<b-col sm="5">
														<label :for="`maxThreshold-${i}-${j}`"
															>Max Threshold</label
														>
													</b-col>
													<b-col sm="7">
														<b-input-group :id="`maxThreshold-${i}-${j}`">
															<b-form-input
																min="0"
															max="100"
																step="0.01"
																type="number"
																v-model="subTab.integrated.maxThreshold"
															></b-form-input>
															<b-input-group-append is-text>
																<b-form-input
																	v-model="subTab.integrated.maxThreshold"
																	type="range"
																	min="0"
																	max="100"
																	step="0.01"
																></b-form-input>
															</b-input-group-append>
														</b-input-group>
													</b-col>
												</b-row>
											</b-col> -->
												<b-col sm="12" lg="12">
													<b-row class="mb-3">
														<b-col sm="5">
															<label :for="`benchmarkLabel-${i}-${j}`"
																>{{ $t("benchmark") }} {{ $t("label") }}</label
															>
														</b-col>
														<b-col sm="7">
															<b-form-input
																:id="`benchmarkLabel-${i}-${j}`"
																type="text"
																v-model="subTab.integrated.benchmarkLabel"
															></b-form-input>
														</b-col>
													</b-row>
												</b-col>
												<b-col sm="12" lg="12">
													<b-row class="mb-3">
														<b-col sm="5">
															<label :for="`benchmarkColor-${i}-${j}`"
																>{{ $t("benchmark") }} {{ $t("color") }}</label
															>
														</b-col>
														<b-col sm="7">
															<b-input-group :id="`benchmarkColor-${i}-${j}`">
																<b-form-input
																	type="text"
																	v-model="subTab.integrated.benchmarkColor"
																></b-form-input>
																<b-input-group-append>
																	<b-form-input
																		type="color"
																		class="w-40px"
																		v-model="subTab.integrated.benchmarkColor"
																	></b-form-input>
																</b-input-group-append>
															</b-input-group>
														</b-col>
													</b-row>
												</b-col>
												<b-col sm="12" lg="12">
													<b-row class="mb-3">
														<b-col sm="5">
															<label :for="`benchmarkValue-${i}-${j}`">{{
																$t("placeholderBenchmarkValue")
															}}</label>
														</b-col>
														<b-col sm="7">
															<b-button
																class="black-btn btn-sm"
																v-on:click="
																	dataEntry(
																		`benchmark-${tab.group}-${tab.id}-${subTab.id}`
																	)
																"
																>{{ $t("dataEntry") }}</b-button
															>
														</b-col>
													</b-row>
												</b-col>
											</b-row>
										</transition>
									</template>
									<div
										class="card-header color-black text-uppercase f-s-0-875rem font-weight-bold"
									>
										{{ $t("mapping") }}
									</div>
									<div>
										<div class="p-2 border mb-3" v-if="subTab.isSingleSource">
											<b-row
												class="mb-3"
												v-for="(map, m) in subTab.mapping"
												:key="'mapping-' + i + j + m"
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
																	<label :for="`color-${i}-${j}-${m}`">{{
																		$t("color")
																	}}</label>
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
																<template
																	v-if="map.indicator.subIndicator.length"
																>
																	<b-col
																		sm="12"
																		class="mb-3"
																		v-for="(subIndicator, ind) in map.indicator
																			.subIndicator"
																		:key="'subIndicator' + i + j + m + ind"
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
																				'additionalSettingsCollapse' +
																				i +
																				j +
																				m +
																				ind
																			"
																		>
																			<i
																				class="fa fa-link mr-2 f-s-0-875rem"
																				v-b-tooltip.hover
																				:title="
																					$t('link_IndicatorsData_Elements')
																				"
																			></i>
																			<span class="color-grey">{{
																				subIndicator.name
																			}}</span>
																		</b-button>
																		<b-collapse
																			class="border border-b-l-radius-10px border-b-r-radius-10px p-2"
																			:id="
																				'additionalSettingsCollapse' +
																				i +
																				j +
																				m +
																				ind
																			"
																		>
																			<b-row class="mb-3">
																				<b-col sm="5">
																					<label
																						:for="`displayName-${i}-${j}-${m}-${ind}`"
																						>{{ $t("displayName") }}</label
																					>
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
																					<label
																						:for="`color-${i}-${j}-${m}-${ind}`"
																						>{{ $t("color") }}</label
																					>
																				</b-col>
																				<b-col sm="7">
																					<b-input-group
																						:id="`color-${i}-${j}-${m}-${ind}`"
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
																						{{
																							$t(
																								"indicators_Data_Elements_Mapping"
																							)
																						}}
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
																						:chartByType="
																							'chartByType' + i + j + m + ind
																						"
																						:dataSetsList="dataSetsList"
																						:chartBySubtype="
																							'chartBySubtype' + i + j + m + ind
																						"
																						:indicatorsList="indicatorsList"
																						:dataElementsList="dataElementsList"
																						:key="
																							'add-mapping' + i + j + m + ind
																						"
																						:mappingType="subIndicator.type"
																						:selectedDE="
																							subIndicator.selectedDE
																						"
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
											<b-row v-if="subTab.mapping.length === 0">
												<b-col sm="12" class="text-center">
													Please add mapping using <code>Add</code> button
													below.
												</b-col>
											</b-row>
											<div class="text-right pt-2">
												<b-button
													class="black-btn btn-sm"
													v-on:click="
														addElement({ type: 'method', tInd: i, stInd: j })
													"
													>{{ $t("addbtn") }}</b-button
												>
											</div>
										</div>
										<div class="p-2 border mb-3" v-else>
											<b-card no-body>
												<b-tabs card>
													<!-- Render Tabs, supply a unique `key` to each tab -->
													<b-tab
														v-for="(source, s) in subTab.sourceMapping"
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
															:key="'mapping-' + i + j + s + m"
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
																		v-b-toggle="
																			'collapseMappingSettings' + i + j + s + m
																		"
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
																		:id="
																			'collapseMappingSettings' + i + j + s + m
																		"
																	>
																		<b-row class="mb-3">
																			<b-col sm="5">
																				<label
																					:for="`displayName-${i}-${j}-${s}-${m}`"
																					>{{ $t("displayName") }}</label
																				>
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
																				<label
																					:for="`color-${i}-${j}-${s}-${m}`"
																					>{{ $t("color") }}</label
																				>
																			</b-col>
																			<b-col sm="7">
																				<b-input-group
																					:id="`color-${i}-${j}-${s}-${m}`"
																				>
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
																				<label
																					:for="`visible-${i}-${j}-${s}-${m}`"
																					>{{ $t("disable") }}</label
																				>
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
																			<template
																				v-if="map.indicator.subIndicator.length"
																			>
																				<b-col
																					sm="12"
																					class="mb-3"
																					v-for="(subIndicator, ind) in map
																						.indicator.subIndicator"
																					:key="i + j + s + m + ind"
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
																							'additionalSettingsCollapse' +
																							i +
																							j +
																							m +
																							ind +
																							s
																						"
																					>
																						<i
																							class="fa fa-link mr-2 f-s-0-875rem"
																							v-b-tooltip.hover
																							:title="
																								$t(
																									'link_IndicatorsData_Elements'
																								)
																							"
																						></i>
																						<span class="color-grey">{{
																							subIndicator.name
																						}}</span>
																					</b-button>
																					<b-collapse
																						class="border border-b-l-radius-10px border-b-r-radius-10px p-2"
																						:id="
																							'additionalSettingsCollapse' +
																							i +
																							j +
																							m +
																							ind +
																							s
																						"
																					>
																						<b-row class="mb-3">
																							<b-col sm="5">
																								<label
																									:for="`displayName-${i}-${j}-${s}-${m}-${ind}`"
																									>{{
																										$t("displayName")
																									}}</label
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
																											v-model="
																												subIndicator.color
																											"
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
																									{{
																										$t(
																											"indicators_Data_Elements_Mapping"
																										)
																									}}
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
																										'chartByType' +
																										i +
																										j +
																										m +
																										ind +
																										s
																									"
																									:dataSetsList="dataSetsList"
																									:chartBySubtype="
																										'chartBySubtype' +
																										i +
																										j +
																										m +
																										ind +
																										s
																									"
																									:indicatorsList="
																										indicatorsList
																									"
																									:dataElementsList="
																										dataElementsList
																									"
																									:key="
																										'add-mapping' +
																										i +
																										j +
																										m +
																										ind +
																										s
																									"
																									:mappingType="
																										subIndicator.type
																									"
																									:selectedDE="
																										subIndicator.selectedDE
																									"
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
																				v-if="
																					map.indicator.subIndicator.length ===
																					0
																				"
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
																Please add mapping using <code>Add</code> button
																below.
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
																updateTab({ type: 'type3', tInd: i, stInd: j })
															"
															href="#"
															class="text-center"
															v-b-tooltip.hover
															:title="$t('addbtn')"
															v-if="subTab.sourceMapping.length < 2"
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
									<template v-if="subTab.backgroundData">
										<div
											class="card-header color-black text-uppercase f-s-0-875rem font-weight-bold"
										>
											Background Factors
										</div>
										<div
											class="p-2 border"
											:class="{ 'mb-3': moduleKey === 'dqrDashboard' }"
										>
											<template v-if="subTab.group.includes('-IC-')">
												<b-row>
													<b-col sm="12" lg="6">
														<b-row>
															<b-col sm="5"
																><label :for="`bgData-sd-${i}-${j}`">{{
																	$t("standardDeviation")
																}}</label></b-col
															>
															<b-col sm="7">
																<b-input-group :id="`bgData-sd-${i}-${j}`">
																	<b-form-input
																		min="1"
																		max="5"
																		step="1"
																		type="number"
																		v-model="
																			subTab.backgroundData.standardDeviation
																		"
																	></b-form-input>
																	<b-input-group-append is-text>
																		<b-form-input
																			v-model="
																				subTab.backgroundData.standardDeviation
																			"
																			type="range"
																			min="1"
																			max="5"
																			step="1"
																		></b-form-input>
																	</b-input-group-append>
																</b-input-group>
															</b-col>
														</b-row>
													</b-col>
												</b-row>
											</template>
											<template v-if="subTab.group.includes('-CC-')">
												<b-row>
													<b-col sm="12" lg="6" class="mb-3">
														<b-row>
															<b-col sm="5"
																><label
																	:for="`bgData-r2-${i}-${j}`"
																	v-html="
																		$t('dqrtext', { num: '<sup>2</sup>' })
																	"
																></label
															></b-col>
															<b-col sm="7">
																<b-input-group :id="`bgData-r2-${i}-${j}`">
																	<b-form-input
																		min="0.01"
																		max="1"
																		step="0.01"
																		type="number"
																		v-model="subTab.backgroundData.r2Max"
																	></b-form-input>
																	<b-input-group-append is-text>
																		<b-form-input
																			v-model="subTab.backgroundData.r2Max"
																			type="range"
																			min="0.01"
																			max="1"
																			step="0.01"
																		></b-form-input>
																	</b-input-group-append>
																</b-input-group>
															</b-col>
														</b-row>
													</b-col>
													<b-col
														sm="12"
														lg="6"
														class="mb-,3"
														v-if="!subTab.isSingleSource"
													>
														<b-row>
															<b-col sm="5"
																><label :for="`bgData-minOutlier-${i}-${j}`">{{
																	$t("min_outlier")
																}}</label></b-col
															>
															<b-col sm="7">
																<b-input-group
																	:id="`bgData-minOutlier-${i}-${j}`"
																>
																	<b-form-input
																		min="1"
																		max="100"
																		step="1"
																		type="number"
																		v-model="subTab.backgroundData.minOutlier"
																	></b-form-input>
																	<b-input-group-append is-text>
																		<b-form-input
																			v-model="subTab.backgroundData.minOutlier"
																			type="range"
																			min="1"
																			max="100"
																			step="1"
																		></b-form-input>
																	</b-input-group-append>
																</b-input-group>
															</b-col>
														</b-row>
													</b-col>
													<b-col
														sm="12"
														lg="6"
														class="mb-3"
														v-if="!subTab.isSingleSource"
													>
														<b-row>
															<b-col sm="5"
																><label
																	:for="`bgData-wastageFactor-${i}-${j}`"
																	>{{ $t("wastageFactor") }}</label
																></b-col
															>
															<b-col sm="7">
																<b-input-group
																	:id="`bgData-wastageFactor-${i}-${j}`"
																>
																	<b-form-input
																		min="1"
																		max="100"
																		step="1"
																		type="number"
																		v-model="
																			subTab.backgroundData.wastageFactor
																		"
																	></b-form-input>
																	<b-input-group-append is-text>
																		<b-form-input
																			v-model="
																				subTab.backgroundData.wastageFactor
																			"
																			type="range"
																			min="1"
																			max="100"
																			step="1"
																		></b-form-input>
																	</b-input-group-append>
																</b-input-group>
															</b-col>
														</b-row>
													</b-col>
													<b-col sm="12" lg="6" class="mb-3">
														<b-row>
															<b-col sm="5"
																><label
																	:for="`bgData-outliersColor-${i}-${j}`"
																	>{{ $t("outliers_color") }}</label
																></b-col
															>
															<b-col sm="7">
																<b-input-group
																	:id="`bgData-outliersColor-${i}-${j}`"
																>
																	<b-form-input
																		type="text"
																		v-model="
																			subTab.backgroundData.outliersColor
																		"
																	></b-form-input>
																	<b-input-group-append>
																		<b-form-input
																			type="color"
																			class="w-40px"
																			v-model="
																				subTab.backgroundData.outliersColor
																			"
																		></b-form-input>
																	</b-input-group-append>
																</b-input-group>
															</b-col>
														</b-row>
													</b-col>
													<b-col sm="12" lg="6" class="mb-3">
														<b-row>
															<b-col sm="5"
																><label
																	:for="`bgData-idleTrendColor-${i}-${j}`"
																	>{{ $t("idle_trend_color") }}</label
																></b-col
															>
															<b-col sm="7">
																<b-input-group
																	:id="`bgData-idleTrendColor-${i}-${j}`"
																>
																	<b-form-input
																		type="text"
																		v-model="
																			subTab.backgroundData.idleTrendColor
																		"
																	></b-form-input>
																	<b-input-group-append>
																		<b-form-input
																			type="color"
																			class="w-40px"
																			v-model="
																				subTab.backgroundData.idleTrendColor
																			"
																		></b-form-input>
																	</b-input-group-append>
																</b-input-group>
															</b-col>
														</b-row>
													</b-col>
													<b-col sm="12" lg="6" class="mb-3">
														<b-row>
															<b-col sm="5"
																><label
																	:for="`bgData-linearTrendColor-${i}-${j}`"
																	>{{ $t("linear_trend_color") }}</label
																></b-col
															>
															<b-col sm="7">
																<b-input-group
																	:id="`bgData-linearTrendColor-${i}-${j}`"
																>
																	<b-form-input
																		type="text"
																		v-model="
																			subTab.backgroundData.linearTrendColor
																		"
																	></b-form-input>
																	<b-input-group-append>
																		<b-form-input
																			type="color"
																			class="w-40px"
																			v-model="
																				subTab.backgroundData.linearTrendColor
																			"
																		></b-form-input>
																	</b-input-group-append>
																</b-input-group>
															</b-col>
														</b-row>
													</b-col>
													<b-col
														sm="12"
														lg="6"
														class="mb-3"
														v-if="subTab.isSingleSource"
													>
														<b-row>
															<b-col sm="5"
																><label
																	:for="`bgData-qualityThreshold-${i}-${j}`"
																	>{{ $t("qualityThreshold") }}</label
																></b-col
															>
															<b-col sm="7">
																<b-input-group
																	:id="`bgData-qualityThreshold-${i}-${j}`"
																>
																	<b-form-input
																		min="1"
																		max="100"
																		step="1"
																		type="number"
																		v-model="
																			subTab.backgroundData.qualityThreshold
																		"
																	></b-form-input>
																	<b-input-group-append is-text>
																		<b-form-input
																			v-model="
																				subTab.backgroundData.qualityThreshold
																			"
																			type="range"
																			min="1"
																			max="100"
																			step="1"
																		></b-form-input>
																	</b-input-group-append>
																</b-input-group>
															</b-col>
														</b-row>
													</b-col>
													<b-col
														sm="12"
														lg="6"
														class="mb-3"
														v-if="subTab.isSingleSource"
													>
														<b-row>
															<b-col sm="5"
																><label
																	:for="`bgData-qualityThresholdColor-${i}-${j}`"
																	>{{ $t("threshold_color") }}</label
																></b-col
															>
															<b-col sm="7">
																<b-input-group
																	:id="`bgData-qualityThresholdColor-${i}-${j}`"
																>
																	<b-form-input
																		type="text"
																		v-model="
																			subTab.backgroundData
																				.qualityThresholdColor
																		"
																	></b-form-input>
																	<b-input-group-append>
																		<b-form-input
																			type="color"
																			class="w-40px"
																			v-model="
																				subTab.backgroundData
																					.qualityThresholdColor
																			"
																		></b-form-input>
																	</b-input-group-append>
																</b-input-group>
															</b-col>
														</b-row>
													</b-col>
												</b-row>
											</template>
										</div>
									</template>
									<template v-if="moduleKey === 'dqrDashboard'">
										<div
											class="card-header color-black text-uppercase f-s-0-875rem font-weight-bold"
										>
											Sign Off Questions
										</div>
										<div class="p-2 border mb-3">
											<div class="text-right">
												<b-button
													class="black-btn btn-sm"
													@click="
														actionOnQuestion({ type: 'add', tInd: i, stInd: j })
													"
													>{{ $t("addNewQuest") }}</b-button
												>
											</div>
											<template v-if="subTab.questions.length">
												<div>{{ $t("questSet") }}</div>
												<b-row
													class="my-1 mx-0"
													v-for="(question, index) in subTab.questions"
													:key="i + j + index"
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
															<b-form-radio-group
																:options="question.options"
																plain
																disabled
															>
															</b-form-radio-group>
														</div>
													</b-col>
												</b-row>
											</template>
											<div
												class="text-center text-muted"
												v-if="subTab.questions.length === 0"
											>
												There are no questions<br />
												Add a new question using the
												<b>Add New Question</b> button.
											</div>
										</div>
									</template>
									<template
										v-if="
											moduleKey === 'analyticalDashboard' && subTab.mapSetting
										"
									>
										<div
											class="card-header color-black text-uppercase f-s-0-875rem font-weight-bold"
										>
											Map Settings
										</div>
										<div class="p-2 border mb-3">
											<b-row
												class="mb-3"
												v-for="(chart, c) in subTab.mapSetting"
												:key="'mapSetting-' + i + j + c"
											>
												<b-col sm="12">
													<div>
														<i
															class="fa fa-arrow-up mr-2 cursor-pointer f-s-0-875rem"
															v-b-tooltip.hover
															title="Move Up"
															@click.prevent.stop="
																moveItem({
																	type: 'mapSetting',
																	tInd: i,
																	stInd: j,
																	cInd: c,
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
																	type: 'mapSetting',
																	tInd: i,
																	stInd: j,
																	cInd: c,
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
																	type: 'mapSetting',
																	tInd: i,
																	stInd: j,
																	delInd: c,
																})
															"
														></i>
														<b-button
															class="btn-link p-0 text-uppercase color-grey f-s-0-875rem bg-transparent border-0"
															v-b-toggle="'collapseMapSettings' + i + j + c"
														>
															<i
																class="fa fa-cog mr-2 f-s-0-875rem"
																v-b-tooltip.hover
																title="Map Settings"
															></i>
															{{ chart.chartOptions.chartName }}
														</b-button>
														<b-collapse
															class="border border-b-l-radius-10px border-b-r-radius-10px p-2"
															:id="'collapseMapSettings' + i + j + c"
														>
															<b-row class="mb-3">
																<b-col sm="6">
																	<label
																		:for="`mapSetting-visible-${i}-${j}-${c}`"
																		>{{ $t("disable") }}</label
																	>
																</b-col>
																<b-col sm="6">
																	<b-form-checkbox
																		:id="`mapSetting-visible-${i}-${j}-${c}`"
																		class="mr-n2 mb-n1"
																		switch
																		v-model="chart.chartOptions.disable"
																	>
																	</b-form-checkbox>
																</b-col>
															</b-row>
															<transition name="slide-fade">
																<div v-if="!chart.chartOptions.disable">
																	<b-row>
																		<b-col sm="12" class="mb-3">
																			<b-row>
																				<b-col sm="6">
																					<label
																						:for="`mapSetting-chartHeading-${i}-${j}-${c}`"
																						>{{ $t("chartHeading") }}</label
																					>
																				</b-col>
																				<b-col sm="6">
																					<b-form-textarea
																						:id="`mapSetting-chartHeading-${i}-${j}-${c}`"
																						v-model="
																							chart.chartOptions.chartName
																						"
																						:state="
																							chart.chartOptions.chartName
																								.length !== 0 &&
																							chart.chartOptions.chartName
																								.length <= chartTitleMaxLength
																						"
																						placeholder=""
																						rows="3"
																						:maxlength="chartTitleMaxLength"
																					></b-form-textarea>
																					<span class="small"
																						>{{
																							chart.chartOptions.chartName
																								.length
																						}}/{{ chartTitleMaxLength }}</span
																					>
																				</b-col>
																			</b-row>
																		</b-col>
																		<b-col sm="12" class="mb-3">
																			<b-row>
																				<b-col sm="6">
																					<label
																						:for="`mapSetting-chartInformation-${i}-${j}-${c}`"
																						>{{ $t("chartInformation") }}</label
																					>
																				</b-col>
																				<b-col sm="6">
																					<b-form-textarea
																						:id="`mapSetting-chartInformation-${i}-${j}-${c}`"
																						v-model="
																							chart.chartOptions.chartInfo
																						"
																						:state="
																							chart.chartOptions.chartInfo
																								.length !== 0 &&
																							chart.chartOptions.chartInfo
																								.length <= chartInfoMaxLength
																						"
																						placeholder=""
																						rows="3"
																						:maxlength="chartInfoMaxLength"
																					></b-form-textarea>
																					<span class="small"
																						>{{
																							chart.chartOptions.chartInfo
																								.length
																						}}/{{ chartInfoMaxLength }}</span
																					>
																				</b-col>
																			</b-row>
																		</b-col>
																		<b-col sm="12" class="mb-3">
																			<b-row>
																				<b-col sm="6"
																					><label
																						:for="`mapSetting-mapDataMapping-${i}-${j}-${c}`"
																						>{{ $t("dataMapping") }}</label
																					></b-col
																				>
																				<b-col sm="6">
																					<treeselect
																						:id="`mapSetting-mapDataMapping-${i}-${j}-${c}`"
																						:flat="true"
																						:multiple="true"
																						:show-count="true"
																						sort-value-by="INDEX"
																						:default-expand-level="1"
																						:placeholder="$t('search')"
																						:auto-load-root-options="false"
																						v-model="
																							chart.chartOptions.dataMapping
																						"
																						:options="
																							allMappings(tab.id, subTab.id)
																						"
																					/>
																				</b-col>
																			</b-row>
																		</b-col>
																		<b-col sm="12" lg="6" class="mb-3">
																			<b-row>
																				<b-col sm="5">
																					<label
																						:for="`mapSetting-chartType-${i}-${j}-${c}`"
																						>{{ $t("chart") }}
																						{{ $t("type") }}</label
																					>
																				</b-col>
																				<b-col sm="7">
																					<b-form-select
																						:id="`mapSetting-chartType-${i}-${j}-${c}`"
																						:disabled="
																							chart.chartOptions.type === 'map'
																						"
																						v-model="chart.chartOptions.type"
																						:options="
																							chartTypeOptions(
																								chart.chartOptions.type,
																								subTab.group
																							)
																						"
																					>
																						<!-- <b-form-select-option
																						:value="null"
																						disabled
																						>Please select an
																						option</b-form-select-option
																					>
																					<b-form-select-option
																						value="column"
																						>{{
																							$t("column")
																						}}</b-form-select-option
																					>
																					<b-form-select-option value="line">{{
																						$t("line")
																					}}</b-form-select-option>
																					<b-form-select-option value="area">{{
																						$t("area")
																					}}</b-form-select-option>
																					<b-form-select-option value="stack">{{
																						$t("stack")
																					}}</b-form-select-option> -->
																					</b-form-select>
																				</b-col>
																			</b-row>
																		</b-col>
																		<b-col sm="12" lg="6" class="mb-3">
																			<b-row>
																				<b-col sm="5">
																					<label
																						:for="`mapSetting-chartSource-${i}-${j}-${c}`"
																						>{{ $t("source") }}</label
																					>
																				</b-col>
																				<b-col sm="7">
																					<b-form-input
																						type="text"
																						:id="`mapSetting-chartSource-${i}-${j}-${c}`"
																						v-model="chart.chartOptions.source"
																					></b-form-input>
																				</b-col>
																			</b-row>
																		</b-col>
																		<b-col sm="12" lg="12" class="mb-3">
																			<b-row>
																				<b-col sm="3" class="mb-3">
																					{{ $t("scales") }}
																				</b-col>
																				<b-col sm="9" class="mb-3">
																					<b-tabs>
																						<!-- content-class="mt-3" -->
																						<b-tab
																							v-for="(
																								levelScale, levelIndex
																							) in chart.chartOptions.levels"
																							:key="
																								'mapSetting-levels' +
																								i +
																								j +
																								c +
																								levelIndex
																							"
																							:title="levelScale.levelName"
																						>
																							<b-row class="mt-3">
																								<b-col sm="5" class="mb-3">
																									<b-input-group>
																										<b-form-input
																											type="text"
																											v-model="paletteColor"
																										></b-form-input>
																										<b-input-group-append>
																											<b-form-input
																												type="color"
																												class="w-40px"
																												v-model="paletteColor"
																											></b-form-input>
																										</b-input-group-append>
																									</b-input-group>
																								</b-col>
																								<b-col sm="7" class="mb-3">
																									<b-row>
																										<b-col sm="7" class="pr-1">
																											<b-input-group>
																												<b-input-group-prepend>
																													<div
																														class="input-group-text p-1 px-2 cursor-pointer"
																														v-b-tooltip.hover
																														:title="
																															$t(
																																'percentageInfo'
																															)
																														"
																													>
																														<i
																															class="fa fa-info f-s-0-875rem"
																														></i>
																													</div>
																												</b-input-group-prepend>
																												<b-form-input
																													type="number"
																													min="-99"
																													max="99"
																													v-model="
																														percentageLight
																													"
																												></b-form-input>
																												<b-input-group-append
																													is-text
																													class="w-50"
																												>
																													<b-form-input
																														v-model="
																															percentageLight
																														"
																														type="range"
																														min="-99"
																														max="99"
																														step="1"
																													></b-form-input>
																												</b-input-group-append>
																											</b-input-group>
																										</b-col>
																										<b-col sm="5" class="pl-1">
																											<b-input-group>
																												<b-input-group-prepend>
																													<div
																														class="input-group-text p-1 px-2 cursor-pointer"
																														v-b-tooltip.hover
																														:title="
																															$t('shadesInfo')
																														"
																													>
																														<i
																															class="fa fa-info f-s-0-875rem"
																														></i>
																													</div>
																												</b-input-group-prepend>
																												<b-form-input
																													type="number"
																													min="4"
																													max="9"
																													v-model="shadesNumber"
																												></b-form-input>
																												<b-input-group-append
																													is-text
																													class="w-50"
																												>
																													<b-form-input
																														v-model="
																															shadesNumber
																														"
																														type="range"
																														min="4"
																														max="9"
																														step="1"
																													></b-form-input>
																												</b-input-group-append>
																											</b-input-group>
																										</b-col>
																									</b-row>
																								</b-col>
																							</b-row>
																							<b-row>
																								<b-col sm="5" class="mb-3">
																									<b-row class="mx-0">
																										<b-col
																											class="p-3 border"
																											v-for="(
																												shade, sh
																											) in shades"
																											:key="
																												'mapSetting-shades-' +
																												i +
																												j +
																												c +
																												levelIndex +
																												sh
																											"
																											:style="{
																												'background-color':
																													shade,
																											}"
																										></b-col>
																									</b-row>
																								</b-col>
																								<b-col
																									sm="7"
																									class="text-right mb-3"
																								>
																									<b-button
																										class="black-btn btn-sm ml-2"
																										v-on:click.prevent.stop="
																											applyPalette({
																												tInd: i,
																												stInd: j,
																												cmInd: c,
																												levelInd: levelIndex,
																												key: 'mapSetting',
																											})
																										"
																										>{{ $t("apply") }}</b-button
																									>
																									<b-button
																										class="black-btn btn-sm ml-2"
																										v-on:click.prevent.stop="
																											applyPalette({
																												tInd: i,
																												stInd: j,
																												cmInd: c,
																												key: 'mapSetting',
																											})
																										"
																										>{{
																											$t("applyAll")
																										}}</b-button
																									>
																								</b-col>
																							</b-row>
																							<b-row>
																								<b-col sm="12" class="mb-3">
																									<div
																										class="cursor-pointer small"
																									>
																										<span
																											@click="
																												showShades = !showShades
																											"
																											><u>{{
																												$t("predefinedColors")
																											}}</u></span
																										>
																									</div>
																									<transition name="slide-fade">
																										<div
																											v-if="showShades"
																											class="border p-2 border-radius-4px"
																										>
																											<b-row
																												class="mx-0"
																												v-for="(
																													predefinedShade, psi
																												) in predefinedShades"
																												:key="
																													'mapSetting-predefinedShades' +
																													i +
																													j +
																													c +
																													levelIndex +
																													psi
																												"
																												:class="
																													predefinedShades.length -
																														1 ===
																													psi
																														? ''
																														: 'pb-2'
																												"
																											>
																												<b-col sm="5">
																													<b-row
																														class="row mx-0"
																													>
																														<b-col
																															class="p-3 border"
																															v-for="(
																																shade, si
																															) in predefinedShade"
																															:key="
																																'mapSetting-predefinedShade' +
																																i +
																																j +
																																c +
																																levelIndex +
																																psi +
																																si
																															"
																															:style="{
																																'background-color':
																																	shade,
																															}"
																														></b-col>
																													</b-row>
																												</b-col>
																												<b-col sm="7">
																													<b-button
																														class="black-btn btn-sm mx-1"
																														@click.prevent.stop="
																															applyPalette({
																																tInd: i,
																																stInd: j,
																																cmInd: c,
																																levelInd:
																																	levelIndex,
																																key: 'mapSetting',
																																shades:
																																	predefinedShade,
																															})
																														"
																														>{{
																															$t("apply")
																														}}</b-button
																													>
																													<b-button
																														class="black-btn btn-sm mx-1"
																														@click.prevent.stop="
																															applyPalette({
																																tInd: i,
																																stInd: j,
																																cmInd: c,
																																key: 'mapSetting',
																																shades:
																																	predefinedShade,
																															})
																														"
																														>{{
																															$t("applyAll")
																														}}</b-button
																													>
																												</b-col>
																											</b-row>
																										</div>
																									</transition>
																								</b-col>
																							</b-row>
																							<b-row>
																								<b-col sm="5" class="mb-3">
																									<label
																										:for="`mapSetting-autoScaling-${i}-${j}-${c}-${levelIndex}`"
																										>{{
																											$t("autoScaling")
																										}}</label
																									>
																								</b-col>
																								<b-col sm="7" class="mb-3">
																									<b-form-checkbox
																										:id="`mapSetting-autoScaling-${i}-${j}-${c}-${levelIndex}`"
																										class="mr-n2 mb-n1"
																										v-model="
																											levelScale.isAutoRange
																										"
																										switch
																										size="lg"
																									></b-form-checkbox>
																								</b-col>
																							</b-row>
																							<b-row
																								v-for="(
																									scaleRow, scaleIndex
																								) in levelScale.scales"
																								:key="
																									'mapSetting-scales-' +
																									i +
																									j +
																									c +
																									levelIndex +
																									scaleIndex
																								"
																							>
																								<b-col
																									sm="4"
																									class="mb-3"
																									:class="{
																										'col-sm-6':
																											levelScale.isAutoRange,
																									}"
																								>
																									<b-form-input
																										:id="`mapSetting-scaleLabel-${i}-${j}-${c}-${levelIndex}-${scaleIndex}`"
																										type="text"
																										:placeholder="$t('label')"
																										v-model="
																											levelScale.scales[
																												scaleIndex
																											].scaleLabel
																										"
																									></b-form-input>
																								</b-col>
																								<b-col
																									sm="2"
																									class="mb-3"
																									:class="{
																										hide: levelScale.isAutoRange,
																									}"
																								>
																									<b-form-input
																										:id="`mapSetting-lowScale-${i}-${j}-${c}-${levelIndex}-${scaleIndex}`"
																										type="number"
																										:placeholder="
																											$t('placeholderLowRange')
																										"
																										v-model="
																											levelScale.scales[
																												scaleIndex
																											].lowScale
																										"
																										:disabled="
																											scaleIndex === 0 &&
																											!levelScale.isAutoRange
																												? false
																												: true
																										"
																									></b-form-input>
																								</b-col>
																								<b-col
																									sm="2"
																									class="mb-3"
																									:class="{
																										hide: levelScale.isAutoRange,
																									}"
																								>
																									<b-form-input
																										:id="`mapSetting-highScale-${i}-${j}-${c}-${levelIndex}-${scaleIndex}`"
																										type="number"
																										:placeholder="
																											$t('placeholderHighRange')
																										"
																										v-model="
																											levelScale.scales[
																												scaleIndex
																											].highScale
																										"
																										:disabled="
																											levelScale.isAutoRange
																										"
																										@change="
																											scaleIndex <
																											levelScale.scales.length -
																												1
																												? (levelScale.scales[
																														scaleIndex + 1
																												  ].lowScale =
																														levelScale.scales[
																															scaleIndex
																														].highScale)
																												: ''
																										"
																									></b-form-input>
																								</b-col>
																								<b-col
																									sm="4"
																									class="mb-3"
																									:class="{
																										'col-sm-6':
																											levelScale.isAutoRange,
																									}"
																								>
																									<b-input-group
																										:id="`mapSetting-scaleColor-${i}-${j}-${c}-${levelIndex}-${scaleIndex}`"
																									>
																										<b-form-input
																											type="text"
																											v-model="
																												levelScale.scales[
																													scaleIndex
																												].scaleColor
																											"
																										></b-form-input>
																										<b-input-group-append>
																											<b-form-input
																												type="color"
																												class="w-40px"
																												v-model="
																													levelScale.scales[
																														scaleIndex
																													].scaleColor
																												"
																											></b-form-input>
																										</b-input-group-append>
																									</b-input-group>
																								</b-col>
																							</b-row>
																						</b-tab>
																					</b-tabs>
																				</b-col>
																				<b-col sm="12" class="text-right">
																					<b-button
																						class="black-btn btn-sm"
																						@click.prevent.stop="
																							copyTo({
																								tInd: i,
																								stInd: j,
																								cmInd: c,
																								key: 'mapSetting',
																							})
																						"
																						>{{ $t("copyTobtn") }}</b-button
																					>
																				</b-col>
																			</b-row>
																		</b-col>
																	</b-row>
																</div>
															</transition>
														</b-collapse>
													</div>
												</b-col>
											</b-row>
											<b-row v-if="subTab.mapSetting.length === 0">
												<b-col sm="12" class="text-center">
													Settings not available.
												</b-col>
											</b-row>
										</div>
									</template>
									<div
										class="card-header color-black text-uppercase f-s-0-875rem font-weight-bold"
									>
										Chart Settings
									</div>
									<div
										class="p-2 border"
										:class="{ 'mb-3': moduleKey === 'summaryDashboard' }"
									>
										<b-row
											class="mb-3"
											v-for="(chart, c) in subTab.chartSetting"
											:key="'chartSetting-' + i + j + c"
										>
											<b-col sm="12">
												<div>
													<i
														class="fa fa-arrow-up mr-2 cursor-pointer f-s-0-875rem"
														v-b-tooltip.hover
														title="Move Up"
														@click.prevent.stop="
															moveItem({
																type: 'chartSetting',
																tInd: i,
																stInd: j,
																cInd: c,
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
																type: 'chartSetting',
																tInd: i,
																stInd: j,
																cInd: c,
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
																type: 'chartSetting',
																tInd: i,
																stInd: j,
																delInd: c,
															})
														"
													></i>
													<b-button
														class="btn-link p-0 text-uppercase color-grey f-s-0-875rem bg-transparent border-0"
														v-b-toggle="'collapseChartSettings' + i + j + c"
													>
														<i
															class="fa fa-cog mr-2 f-s-0-875rem"
															v-b-tooltip.hover
															:title="$t('chartSettings')"
														></i>
														{{ chart.chartOptions.chartName }}
													</b-button>
													<b-collapse
														class="border border-b-l-radius-10px border-b-r-radius-10px p-2"
														:id="'collapseChartSettings' + i + j + c"
													>
														<b-row class="mb-3">
															<b-col sm="6">
																<label :for="`visible-${i}-${j}-${c}`">{{
																	$t("disable")
																}}</label>
															</b-col>
															<b-col sm="6">
																<b-form-checkbox
																	:id="`visible-${i}-${j}-${c}`"
																	class="mr-n2 mb-n1"
																	switch
																	v-model="chart.chartOptions.disable"
																>
																</b-form-checkbox>
															</b-col>
														</b-row>
														<transition name="slide-fade">
															<div v-if="!chart.chartOptions.disable">
																<b-row>
																	<b-col sm="12" class="mb-3">
																		<b-row>
																			<b-col sm="6">
																				<label
																					:for="`chartHeading-${i}-${j}-${c}`"
																					>{{ $t("chartHeading") }}</label
																				>
																			</b-col>
																			<b-col sm="6">
																				<b-form-textarea
																					:id="`chartHeading-${i}-${j}-${c}`"
																					v-model="chart.chartOptions.chartName"
																					:state="
																						chart.chartOptions.chartName
																							.length !== 0 &&
																						chart.chartOptions.chartName
																							.length <= chartTitleMaxLength
																					"
																					placeholder=""
																					rows="3"
																					:maxlength="chartTitleMaxLength"
																				></b-form-textarea>
																				<span class="small"
																					>{{
																						chart.chartOptions.chartName.length
																					}}/{{ chartTitleMaxLength }}</span
																				>
																			</b-col>
																		</b-row>
																	</b-col>
																	<b-col sm="12" class="mb-3">
																		<b-row>
																			<b-col sm="6">
																				<label
																					:for="`chartInformation-${i}-${j}-${c}`"
																					>{{ $t("chartInformation") }}</label
																				>
																			</b-col>
																			<b-col sm="6">
																				<b-form-textarea
																					:id="`chartInformation-${i}-${j}-${c}`"
																					v-model="chart.chartOptions.chartInfo"
																					:state="
																						chart.chartOptions.chartInfo
																							.length !== 0 &&
																						chart.chartOptions.chartInfo
																							.length <= chartInfoMaxLength
																					"
																					placeholder=""
																					rows="3"
																					:maxlength="chartInfoMaxLength"
																				></b-form-textarea>
																				<span class="small"
																					>{{
																						chart.chartOptions.chartInfo.length
																					}}/{{ chartInfoMaxLength }}</span
																				>
																			</b-col>
																		</b-row>
																	</b-col>
																	<b-col sm="12" class="mb-3">
																		<b-row>
																			<b-col sm="6"
																				><label
																					:for="`chartDataMapping-${i}-${j}-${c}`"
																					>{{ $t("dataMapping") }}</label
																				></b-col
																			>
																			<b-col sm="6">
																				<treeselect
																					:id="`chartDataMapping-${i}-${j}-${c}`"
																					:flat="true"
																					:multiple="true"
																					:show-count="true"
																					sort-value-by="INDEX"
																					:default-expand-level="1"
																					:placeholder="$t('search')"
																					:auto-load-root-options="false"
																					v-model="
																						chart.chartOptions.dataMapping
																					"
																					:options="
																						allMappings(tab.id, subTab.id)
																					"
																					@input="
																						updateBenchmarks({
																							tInd: i,
																							stInd: j,
																							cInd: c,
																							dataMapping:
																								chart.chartOptions.dataMapping,
																							chartCategory:
																								chart.chartOptions
																									.chartCategory,
																							chartDataSum:
																								chart.chartOptions.chartDataSum,
																						})
																					"
																				/>
																			</b-col>
																		</b-row>
																	</b-col>
																	<b-col
																		sm="12"
																		lg="6"
																		class="mb-3"
																		v-if="chart.chartOptions.type !== 'map'"
																	>
																		<b-row>
																			<b-col sm="5"
																				><label
																					:for="`chartCategory-${i}-${j}-${c}`"
																					>{{ $t("category") }}</label
																				>
																			</b-col>
																			<b-col sm="7">
																				<b-form-select
																					:id="`chartCategory-${i}-${j}-${c}`"
																					v-model="
																						chart.chartOptions.chartCategory
																					"
																					:options="chartCategory()"
																					@change="
																						updateBenchmarks({
																							tInd: i,
																							stInd: j,
																							cInd: c,
																							dataMapping:
																								chart.chartOptions.dataMapping,
																							chartCategory:
																								chart.chartOptions
																									.chartCategory,
																							chartDataSum:
																								chart.chartOptions.chartDataSum,
																						})
																					"
																				></b-form-select>
																			</b-col>
																		</b-row>
																	</b-col>
																	<b-col
																		sm="12"
																		lg="6"
																		class="mb-3"
																		v-if="chart.chartOptions.type !== 'map'"
																	>
																		<b-row>
																			<b-col sm="5"
																				><label
																					:for="`chartCalculation-${i}-${j}-${c}`"
																					>{{ $t("calculationType") }}</label
																				>
																			</b-col>
																			<b-col sm="7">
																				<b-form-select
																					:id="`chartCalculation-${i}-${j}-${c}`"
																					v-model="
																						chart.chartOptions.chartCalculation
																					"
																					:options="
																						chartCalculations(
																							chart.chartOptions.chartCategory
																						)
																					"
																				></b-form-select>
																			</b-col>
																		</b-row>
																	</b-col>
																	<b-col
																		sm="12"
																		lg="6"
																		class="mb-3"
																		v-if="
																			chart.chartOptions.type !== 'map' &&
																			chart.chartOptions.chartCategory ===
																				'seasonal'
																		"
																	>
																		<b-row>
																			<b-col sm="5"
																				><label
																					:for="`seasonalPeriod-${i}-${j}-${c}`"
																					>Compare Years</label
																				>
																			</b-col>
																			<b-col sm="7">
																				<b-form-select
																					:id="`seasonalPeriod-${i}-${j}-${c}`"
																					v-model.number="
																						chart.chartOptions.seasonalPeriod
																					"
																					:options="seasonalPeriod()"
																				></b-form-select>
																			</b-col>
																		</b-row>
																	</b-col>

																	<b-col
																		sm="12"
																		lg="6"
																		class="mb-3"
																		v-if="chart.chartOptions.type !== 'map'"
																	>
																		<b-row>
																			<b-col sm="5">
																				<label
																					:for="`percentIndicator-${i}-${j}-${c}`"
																					>{{
																						$t("percentageIndicator")
																					}}</label
																				>
																			</b-col>
																			<b-col sm="7">
																				<b-input-group
																					:id="`percentIndicator-${i}-${j}-${c}`"
																				>
																					<b-input-group-prepend is-text>
																						<b-form-checkbox
																							switch
																							class="mr-n2"
																							v-model="
																								chart.chartOptions
																									.percentageIndicator
																							"
																						>
																						</b-form-checkbox>
																					</b-input-group-prepend>
																				</b-input-group>
																			</b-col>
																		</b-row>
																	</b-col>
																	<b-col
																		sm="12"
																		lg="6"
																		class="mb-3"
																		v-if="
																			chart.chartOptions.type !== 'map' &&
																			chart.chartOptions.chartCategory !==
																				'regional'
																		"
																	>
																		<b-row>
																			<b-col sm="5">
																				<label
																					:for="`chartDrillDown-${i}-${j}-${c}`"
																					>{{ $t("drilldown") }}</label
																				>
																			</b-col>
																			<b-col sm="7">
																				<b-input-group
																					:id="`chartDrillDown-${i}-${j}-${c}`"
																				>
																					<b-input-group-prepend is-text>
																						<b-form-checkbox
																							switch
																							class="mr-n2"
																							v-model="
																								chart.chartOptions
																									.chartDrillDown
																							"
																						>
																						</b-form-checkbox>
																					</b-input-group-prepend>
																					<transition name="slide-fade">
																						<template
																							v-if="
																								chart.chartOptions
																									.chartDrillDown
																							"
																						>
																							<b-form-textarea
																								v-model="
																									chart.chartOptions.drillYTitle
																								"
																								:placeholder="$t('y-axis')"
																							></b-form-textarea>
																						</template>
																					</transition>
																				</b-input-group>
																			</b-col>
																		</b-row>
																	</b-col>
																	<b-col
																		sm="12"
																		lg="6"
																		class="mb-3"
																		v-if="chart.chartOptions.type !== 'map'"
																	>
																		<b-row>
																			<b-col sm="5">
																				<label
																					:for="`chartDataSum-${i}-${j}-${c}`"
																					>{{ $t("dataSum") }}</label
																				>
																			</b-col>
																			<b-col sm="7">
																				<b-input-group
																					:id="`chartDataSum-${i}-${j}-${c}`"
																				>
																					<b-input-group-prepend is-text>
																						<b-form-checkbox
																							switch
																							class="mr-n2"
																							v-model="
																								chart.chartOptions.chartDataSum
																							"
																							@change="
																								updateBenchmarks({
																									tInd: i,
																									stInd: j,
																									cInd: c,
																									dataMapping:
																										chart.chartOptions
																											.dataMapping,
																									chartCategory:
																										chart.chartOptions
																											.chartCategory,
																									chartDataSum:
																										chart.chartOptions
																											.chartDataSum,
																								})
																							"
																						>
																						</b-form-checkbox>
																					</b-input-group-prepend>
																					<transition name="slide-fade">
																						<template
																							v-if="
																								chart.chartOptions.chartDataSum
																							"
																						>
																							<b-form-textarea
																								v-model="
																									chart.chartOptions.sumLegend
																								"
																								:placeholder="$t('legend')"
																							></b-form-textarea>
																						</template>
																					</transition>
																				</b-input-group>
																			</b-col>
																		</b-row>
																	</b-col>
																	<b-col
																		sm="12"
																		lg="6"
																		class="mb-3"
																		v-if="chart.chartOptions.type !== 'map'"
																	>
																		<b-row>
																			<b-col sm="5"
																				><label
																					:for="`benchmarks-${i}-${j}-${c}`"
																					>{{ $t("benchmark") }}</label
																				>
																			</b-col>
																			<b-col sm="7">
																				<treeselect
																					:id="`benchmarks-${i}-${j}-${c}`"
																					:flat="true"
																					:multiple="true"
																					:show-count="true"
																					sort-value-by="INDEX"
																					:default-expand-level="1"
																					:placeholder="$t('search')"
																					:auto-load-root-options="false"
																					v-model="
																						chart.chartOptions.benchmarks
																					"
																					:options="
																						benchmarks(
																							chart.chartOptions.dataMapping,
																							chart.chartOptions.chartCategory,
																							chart.chartOptions
																								.chartCalculation,
																							chart.chartOptions.chartDataSum
																						)
																					"
																				/>
																			</b-col>
																		</b-row>
																	</b-col>
																	<b-col
																		sm="12"
																		lg="6"
																		class="mb-3"
																		v-if="
																			chart.chartOptions.type !== 'map' &&
																			chart.chartOptions.benchmarks &&
																			chart.chartOptions.benchmarks.length
																		"
																	>
																		<b-row>
																			<b-col sm="5">
																				<label
																					:for="`benchmarkInLegend-${i}-${j}-${c}`"
																					>{{ $t("benchmark") }} in
																					{{ $t("legend") }}</label
																				>
																			</b-col>
																			<b-col sm="7">
																				<b-input-group
																					:id="`benchmarkInLegend-${i}-${j}-${c}`"
																				>
																					<b-input-group-prepend is-text>
																						<b-form-checkbox
																							switch
																							class="mr-n2"
																							v-model="
																								chart.chartOptions
																									.benchmarkInLegend
																							"
																						>
																						</b-form-checkbox>
																					</b-input-group-prepend>
																				</b-input-group>
																			</b-col>
																		</b-row>
																	</b-col>
																	<b-col sm="12" lg="6" class="mb-3">
																		<b-row>
																			<b-col sm="5">
																				<label :for="`chartType-${i}-${j}-${c}`"
																					>{{ $t("chart") }}
																					{{ $t("type") }}</label
																				>
																			</b-col>
																			<b-col sm="7">
																				<b-form-select
																					:id="`chartType-${i}-${j}-${c}`"
																					:disabled="
																						chart.chartOptions.type === 'map'
																					"
																					v-model="chart.chartOptions.type"
																					:options="
																						chartTypeOptions(
																							chart.chartOptions.type,
																							subTab.group
																						)
																					"
																				>
																					<!-- <b-form-select-option
																						:value="null"
																						disabled
																						>Please select an
																						option</b-form-select-option
																					>
																					<b-form-select-option
																						value="column"
																						>{{
																							$t("column")
																						}}</b-form-select-option
																					>
																					<b-form-select-option value="line">{{
																						$t("line")
																					}}</b-form-select-option>
																					<b-form-select-option value="area">{{
																						$t("area")
																					}}</b-form-select-option>
																					<b-form-select-option value="stack">{{
																						$t("stack")
																					}}</b-form-select-option> -->
																				</b-form-select>
																			</b-col>
																		</b-row>
																	</b-col>
																	<b-col
																		sm="12"
																		lg="6"
																		class="mb-3"
																		v-if="
																			chart.chartOptions.type !== 'map' &&
																			chart.chartOptions.chartDataSum
																		"
																	>
																		<b-row>
																			<b-col sm="5"
																				><label
																					:for="`chartColor-${i}-${j}-${c}`"
																					>{{ $t("color") }}</label
																				></b-col
																			>
																			<b-col sm="7">
																				<b-input-group
																					:id="`chartColor-${i}-${j}-${c}`"
																				>
																					<b-form-input
																						type="text"
																						v-model="chart.chartOptions.color"
																					></b-form-input>
																					<b-input-group-append>
																						<b-form-input
																							type="color"
																							class="w-40px"
																							v-model="chart.chartOptions.color"
																						></b-form-input>
																					</b-input-group-append>
																				</b-input-group>
																			</b-col>
																		</b-row>
																	</b-col>
																	<template
																		v-if="
																			chart.chartOptions.type !== 'map' &&
																			chart.chartOptions.chartCategory ===
																				'seasonal'
																		"
																	>
																		<b-col
																			sm="12"
																			lg="6"
																			class="mb-3"
																			v-for="n in chart.chartOptions
																				.seasonalPeriod"
																			:key="`seasonalChartColors-${i}-${j}-${c}-${n}`"
																		>
																			<b-row>
																				<b-col sm="5"
																					><label
																						:for="`seasonalChartColor-${i}-${j}-${c}-${n}`"
																						>{{ $t("color") }} {{ n }}</label
																					></b-col
																				>
																				<b-col sm="7">
																					<b-input-group
																						:id="`seasonalChartColor-${i}-${j}-${c}-${n}`"
																					>
																						<b-form-input
																							type="text"
																							v-model="
																								chart.chartOptions
																									.seasonalColors[n - 1]
																							"
																						></b-form-input>
																						<b-input-group-append>
																							<b-form-input
																								type="color"
																								class="w-40px"
																								v-model="
																									chart.chartOptions
																										.seasonalColors[n - 1]
																								"
																							></b-form-input>
																						</b-input-group-append>
																					</b-input-group>
																				</b-col>
																			</b-row>
																		</b-col>
																	</template>
																	<b-col
																		sm="12"
																		lg="6"
																		class="mb-3"
																		v-if="chart.chartOptions.type !== 'map'"
																	>
																		<b-row>
																			<b-col sm="5"
																				><label
																					:for="`chartTitle-${i}-${j}-${c}`"
																					>{{ $t("chart_title") }}</label
																				></b-col
																			>
																			<b-col sm="7">
																				<b-input-group
																					:id="`chartTitle-${i}-${j}-${c}`"
																				>
																					<b-input-group-prepend is-text>
																						<b-form-checkbox
																							switch
																							class="mr-n2"
																							v-model="
																								chart.chartOptions.title.visible
																							"
																						>
																						</b-form-checkbox>
																					</b-input-group-prepend>
																					<transition name="slide-fade">
																						<template
																							v-if="
																								chart.chartOptions.title.visible
																							"
																						>
																							<b-form-textarea
																								v-model="
																									chart.chartOptions.title.text
																								"
																							></b-form-textarea>
																						</template>
																					</transition>
																				</b-input-group>
																			</b-col>
																		</b-row>
																	</b-col>
																	<b-col
																		sm="12"
																		lg="6"
																		class="mb-3"
																		v-if="chart.chartOptions.type !== 'map'"
																	>
																		<b-row>
																			<b-col sm="5"
																				><label
																					:for="`chartSubTitle-${i}-${j}-${c}`"
																					>{{ $t("chart_subtitle") }}</label
																				></b-col
																			>
																			<b-col sm="7">
																				<b-input-group
																					:id="`chartSubTitle-${i}-${j}-${c}`"
																				>
																					<b-input-group-prepend is-text>
																						<b-form-checkbox
																							switch
																							class="mr-n2"
																							v-model="
																								chart.chartOptions.subTitle
																									.visible
																							"
																						>
																						</b-form-checkbox>
																					</b-input-group-prepend>
																					<transition name="slide-fade">
																						<template
																							v-if="
																								chart.chartOptions.subTitle
																									.visible
																							"
																						>
																							<b-form-textarea
																								v-model="
																									chart.chartOptions.subTitle
																										.text
																								"
																							></b-form-textarea>
																						</template>
																					</transition>
																				</b-input-group>
																			</b-col>
																		</b-row>
																	</b-col>
																	<b-col
																		sm="12"
																		lg="6"
																		class="mb-3"
																		v-if="chart.chartOptions.type !== 'map'"
																	>
																		<b-row>
																			<b-col sm="5"
																				><label
																					:for="`chartXAxis-${i}-${j}-${c}`"
																					>{{ $t("x-axis") }}</label
																				></b-col
																			>
																			<b-col sm="7">
																				<b-input-group
																					:id="`chartXAxis-${i}-${j}-${c}`"
																				>
																					<b-input-group-prepend is-text>
																						<b-form-checkbox
																							switch
																							class="mr-n2"
																							v-model="
																								chart.chartOptions.xAxis.visible
																							"
																						>
																						</b-form-checkbox>
																					</b-input-group-prepend>
																					<transition name="slide-fade">
																						<template
																							v-if="
																								chart.chartOptions.xAxis.visible
																							"
																						>
																							<b-form-textarea
																								v-model="
																									chart.chartOptions.xAxis.text
																								"
																							></b-form-textarea>
																						</template>
																					</transition>
																				</b-input-group>
																			</b-col>
																		</b-row>
																	</b-col>
																	<b-col
																		sm="12"
																		lg="6"
																		class="mb-3"
																		v-if="chart.chartOptions.type !== 'map'"
																	>
																		<b-row>
																			<b-col sm="5"
																				><label
																					:for="`chartYAxis-${i}-${j}-${c}`"
																					>{{ $t("y-axis") }}</label
																				></b-col
																			>
																			<b-col sm="7">
																				<b-input-group
																					:id="`chartYAxis-${i}-${j}-${c}`"
																				>
																					<b-input-group-prepend is-text>
																						<b-form-checkbox
																							switch
																							class="mr-n2"
																							v-model="
																								chart.chartOptions.yAxis.visible
																							"
																						>
																						</b-form-checkbox>
																					</b-input-group-prepend>
																					<transition name="slide-fade">
																						<template
																							v-if="
																								chart.chartOptions.yAxis.visible
																							"
																						>
																							<b-form-textarea
																								v-model="
																									chart.chartOptions.yAxis.text
																								"
																							></b-form-textarea>
																						</template>
																					</transition>
																				</b-input-group>
																			</b-col>
																		</b-row>
																	</b-col>
																	<b-col sm="12" lg="6" class="mb-3">
																		<b-row>
																			<b-col sm="5">
																				<label
																					:for="`chartSource-${i}-${j}-${c}`"
																					>{{ $t("source") }}</label
																				>
																			</b-col>
																			<b-col sm="7">
																				<b-form-input
																					type="text"
																					:id="`chartSource-${i}-${j}-${c}`"
																					v-model="chart.chartOptions.source"
																				></b-form-input>
																			</b-col>
																		</b-row>
																	</b-col>
																	<b-col
																		sm="12"
																		lg="6"
																		class="mb-3"
																		v-if="chart.chartOptions.type !== 'map'"
																	>
																		<b-row>
																			<b-col sm="5">
																				<label
																					:for="`chartDataLabel-${i}-${j}-${c}`"
																					>{{ $t("dataLabels") }}</label
																				>
																			</b-col>
																			<b-col sm="7">
																				<b-input-group
																					:id="`chartDataLabel-${i}-${j}-${c}`"
																				>
																					<b-input-group-prepend is-text>
																						<b-form-checkbox
																							class="mr-n2"
																							switch
																							v-model="
																								chart.chartOptions.dataLabels
																							"
																						>
																						</b-form-checkbox>
																					</b-input-group-prepend>
																				</b-input-group>
																			</b-col>
																		</b-row>
																	</b-col>
																	<b-col
																		sm="12"
																		lg="6"
																		class="mb-3"
																		v-if="
																			chart.chartOptions.type !== 'map' &&
																			(['seasonal', 'trend'].includes(
																				chart.chartOptions.chartCategory
																			) ||
																				chart.chartOptions.chartCalculation ===
																					'PERIOD_DIFF')
																		"
																	>
																		<b-row>
																			<b-col sm="5">
																				<label
																					:for="`chartNarrations-${i}-${j}-${c}`"
																					>Generate Summary</label
																				>
																			</b-col>
																			<b-col sm="7">
																				<b-input-group
																					:id="`chartNarrations-${i}-${j}-${c}`"
																				>
																					<b-input-group-prepend is-text>
																						<b-form-checkbox
																							class="mr-n2"
																							switch
																							v-model="
																								chart.chartOptions
																									.generateSummary
																							"
																						>
																						</b-form-checkbox>
																					</b-input-group-prepend>
																				</b-input-group>
																			</b-col>
																		</b-row>
																	</b-col>
																	<b-col
																		sm="12"
																		lg="6"
																		class="mb-3"
																		v-if="
																			chart.chartOptions.type !== 'map' && subTab.group === 'SUMMARY'
																		"
																	>
																		<b-row>
																			<b-col sm="5">
																				<label
																					:for="`chartPriorityIndicator-${i}-${j}-${c}`"
																					>Priority Indicator</label
																				>
																			</b-col>
																			<b-col sm="7">
																				<b-input-group
																					:id="`chartPriorityIndicator-${i}-${j}-${c}`"
																				>
																					<b-input-group-prepend is-text>
																						<b-form-checkbox
																							class="mr-n2"
																							switch
																							v-model="
																								chart.chartOptions
																									.priorityIndicator
																							"
																						>
																						</b-form-checkbox>
																					</b-input-group-prepend>
																				</b-input-group>
																			</b-col>
																		</b-row>
																	</b-col>
																	<b-col
																		sm="12"
																		lg="12"
																		class="mb-3"
																		v-if="chart.chartOptions.type === 'map'"
																	>
																		<b-row>
																			<b-col sm="3" class="mb-3">
																				{{ $t("scales") }}
																			</b-col>
																			<b-col sm="9" class="mb-3">
																				<b-tabs>
																					<!-- content-class="mt-3" -->
																					<b-tab
																						v-for="(
																							levelScale, levelIndex
																						) in chart.chartOptions.levels"
																						:key="
																							'levels-' + i + j + c + levelIndex
																						"
																						:title="levelScale.levelName"
																					>
																						<b-row class="mt-3">
																							<b-col sm="5" class="mb-3">
																								<b-input-group>
																									<b-form-input
																										type="text"
																										v-model="paletteColor"
																									></b-form-input>
																									<b-input-group-append>
																										<b-form-input
																											type="color"
																											class="w-40px"
																											v-model="paletteColor"
																										></b-form-input>
																									</b-input-group-append>
																								</b-input-group>
																							</b-col>
																							<b-col sm="7" class="mb-3">
																								<b-row>
																									<b-col sm="7" class="pr-1">
																										<b-input-group>
																											<b-input-group-prepend>
																												<div
																													class="input-group-text p-1 px-2 cursor-pointer"
																													v-b-tooltip.hover
																													:title="
																														$t('percentageInfo')
																													"
																												>
																													<i
																														class="fa fa-info f-s-0-875rem"
																													></i>
																												</div>
																											</b-input-group-prepend>
																											<b-form-input
																												type="number"
																												min="-99"
																												max="99"
																												v-model="
																													percentageLight
																												"
																											></b-form-input>
																											<b-input-group-append
																												is-text
																												class="w-50"
																											>
																												<b-form-input
																													v-model="
																														percentageLight
																													"
																													type="range"
																													min="-99"
																													max="99"
																													step="1"
																												></b-form-input>
																											</b-input-group-append>
																										</b-input-group>
																									</b-col>
																									<b-col sm="5" class="pl-1">
																										<b-input-group>
																											<b-input-group-prepend>
																												<div
																													class="input-group-text p-1 px-2 cursor-pointer"
																													v-b-tooltip.hover
																													:title="
																														$t('shadesInfo')
																													"
																												>
																													<i
																														class="fa fa-info f-s-0-875rem"
																													></i>
																												</div>
																											</b-input-group-prepend>
																											<b-form-input
																												type="number"
																												min="4"
																												max="9"
																												v-model="shadesNumber"
																											></b-form-input>
																											<b-input-group-append
																												is-text
																												class="w-50"
																											>
																												<b-form-input
																													v-model="shadesNumber"
																													type="range"
																													min="4"
																													max="9"
																													step="1"
																												></b-form-input>
																											</b-input-group-append>
																										</b-input-group>
																									</b-col>
																								</b-row>
																							</b-col>
																						</b-row>
																						<b-row>
																							<b-col sm="5" class="mb-3">
																								<b-row class="mx-0">
																									<b-col
																										class="p-3 border"
																										v-for="(
																											shade, sh
																										) in shades"
																										:key="
																											'shades-' +
																											i +
																											j +
																											c +
																											levelIndex +
																											sh
																										"
																										:style="{
																											'background-color': shade,
																										}"
																									></b-col>
																								</b-row>
																							</b-col>
																							<b-col
																								sm="7"
																								class="text-right mb-3"
																							>
																								<b-button
																									class="black-btn btn-sm ml-2"
																									v-on:click.prevent.stop="
																										applyPalette({
																											tInd: i,
																											stInd: j,
																											cmInd: c,
																											levelInd: levelIndex,
																										})
																									"
																									>{{ $t("apply") }}</b-button
																								>
																								<b-button
																									class="black-btn btn-sm ml-2"
																									v-on:click.prevent.stop="
																										applyPalette({
																											tInd: i,
																											stInd: j,
																											cmInd: c,
																										})
																									"
																									>{{
																										$t("applyAll")
																									}}</b-button
																								>
																							</b-col>
																						</b-row>
																						<b-row>
																							<b-col sm="12" class="mb-3">
																								<div
																									class="cursor-pointer small"
																								>
																									<span
																										@click="
																											showShades = !showShades
																										"
																										><u>{{
																											$t("predefinedColors")
																										}}</u></span
																									>
																								</div>
																								<transition name="slide-fade">
																									<div
																										v-if="showShades"
																										class="border p-2 border-radius-4px"
																									>
																										<b-row
																											class="mx-0"
																											v-for="(
																												predefinedShade, psi
																											) in predefinedShades"
																											:key="
																												'predefinedShades' +
																												i +
																												j +
																												c +
																												levelIndex +
																												psi
																											"
																											:class="
																												predefinedShades.length -
																													1 ===
																												psi
																													? ''
																													: 'pb-2'
																											"
																										>
																											<b-col sm="5">
																												<b-row class="row mx-0">
																													<b-col
																														class="p-3 border"
																														v-for="(
																															shade, si
																														) in predefinedShade"
																														:key="
																															'predefinedShade' +
																															i +
																															j +
																															c +
																															levelIndex +
																															psi +
																															si
																														"
																														:style="{
																															'background-color':
																																shade,
																														}"
																													></b-col>
																												</b-row>
																											</b-col>
																											<b-col sm="7">
																												<b-button
																													class="black-btn btn-sm mx-1"
																													@click.prevent.stop="
																														applyPalette({
																															tInd: i,
																															stInd: j,
																															cmInd: c,
																															levelInd:
																																levelIndex,
																															shades:
																																predefinedShade,
																														})
																													"
																													>{{
																														$t("apply")
																													}}</b-button
																												>
																												<b-button
																													class="black-btn btn-sm mx-1"
																													@click.prevent.stop="
																														applyPalette({
																															tInd: i,
																															stInd: j,
																															cmInd: c,
																															shades:
																																predefinedShade,
																														})
																													"
																													>{{
																														$t("applyAll")
																													}}</b-button
																												>
																											</b-col>
																										</b-row>
																									</div>
																								</transition>
																							</b-col>
																						</b-row>
																						<b-row>
																							<b-col sm="5" class="mb-3">
																								<label
																									:for="`autoScaling-${i}-${j}-${c}-${levelIndex}`"
																									>{{
																										$t("autoScaling")
																									}}</label
																								>
																							</b-col>
																							<b-col sm="7" class="mb-3">
																								<b-form-checkbox
																									:id="`autoScaling-${i}-${j}-${c}-${levelIndex}`"
																									class="mr-n2 mb-n1"
																									v-model="
																										levelScale.isAutoRange
																									"
																									switch
																									size="lg"
																								></b-form-checkbox>
																							</b-col>
																						</b-row>
																						<b-row
																							v-for="(
																								scaleRow, scaleIndex
																							) in levelScale.scales"
																							:key="
																								'scales-' +
																								i +
																								j +
																								c +
																								levelIndex +
																								scaleIndex
																							"
																						>
																							<b-col
																								sm="4"
																								class="mb-3"
																								:class="{
																									'col-sm-6':
																										levelScale.isAutoRange,
																								}"
																							>
																								<b-form-input
																									:id="`scaleLabel-${i}-${j}-${c}-${levelIndex}-${scaleIndex}`"
																									type="text"
																									:placeholder="$t('label')"
																									v-model="
																										levelScale.scales[
																											scaleIndex
																										].scaleLabel
																									"
																								></b-form-input>
																							</b-col>
																							<b-col
																								sm="2"
																								class="mb-3"
																								:class="{
																									hide: levelScale.isAutoRange,
																								}"
																							>
																								<b-form-input
																									:id="`lowScale-${i}-${j}-${c}-${levelIndex}-${scaleIndex}`"
																									type="number"
																									:placeholder="
																										$t('placeholderLowRange')
																									"
																									v-model="
																										levelScale.scales[
																											scaleIndex
																										].lowScale
																									"
																									:disabled="
																										scaleIndex === 0 &&
																										!levelScale.isAutoRange
																											? false
																											: true
																									"
																								></b-form-input>
																							</b-col>
																							<b-col
																								sm="2"
																								class="mb-3"
																								:class="{
																									hide: levelScale.isAutoRange,
																								}"
																							>
																								<b-form-input
																									:id="`highScale-${i}-${j}-${c}-${levelIndex}-${scaleIndex}`"
																									type="number"
																									:placeholder="
																										$t('placeholderHighRange')
																									"
																									v-model="
																										levelScale.scales[
																											scaleIndex
																										].highScale
																									"
																									:disabled="
																										levelScale.isAutoRange
																									"
																									@change="
																										scaleIndex <
																										levelScale.scales.length - 1
																											? (levelScale.scales[
																													scaleIndex + 1
																											  ].lowScale =
																													levelScale.scales[
																														scaleIndex
																													].highScale)
																											: ''
																									"
																								></b-form-input>
																							</b-col>
																							<b-col
																								sm="4"
																								class="mb-3"
																								:class="{
																									'col-sm-6':
																										levelScale.isAutoRange,
																								}"
																							>
																								<b-input-group>
																									<b-form-input
																										:id="`scaleColor-${i}-${j}-${c}-${levelIndex}-${scaleIndex}`"
																										type="text"
																										v-model="
																											levelScale.scales[
																												scaleIndex
																											].scaleColor
																										"
																									></b-form-input>
																									<b-input-group-append>
																										<b-form-input
																											type="color"
																											class="w-40px"
																											v-model="
																												levelScale.scales[
																													scaleIndex
																												].scaleColor
																											"
																										></b-form-input>
																									</b-input-group-append>
																								</b-input-group>
																							</b-col>
																						</b-row>
																					</b-tab>
																				</b-tabs>
																			</b-col>
																			<b-col sm="12" class="text-right">
																				<b-button
																					class="black-btn btn-sm"
																					@click.prevent.stop="
																						copyTo({
																							tInd: i,
																							stInd: j,
																							cmInd: c,
																						})
																					"
																					>{{ $t("copyTobtn") }}</b-button
																				>
																				<b-modal
																					:id="'copyToModal' + i + j + c"
																					hide-footer
																					:title="$t('copyTobtn')"
																					no-close-on-backdrop
																				>
																					<div
																						class="my-2"
																						v-if="
																							levelsSelect.length > 0 &&
																							levelsTreeSelect.length > 0
																						"
																					>
																						<div class="from-levels mb-2">
																							<span class="small">{{
																								$t("from")
																							}}</span>
																							<b-form-select
																								v-model="selectedLevel"
																								size="sm"
																								:options="levelsSelect"
																							>
																								<template v-slot:first>
																									<b-form-select-option
																										:value="null"
																										disabled
																										>{{
																											$t("selectPlaceholder")
																										}}</b-form-select-option
																									>
																								</template>
																							</b-form-select>
																						</div>
																						<div class="to-levels mb-2">
																							<span class="small">{{
																								$t("to")
																							}}</span>
																							<b-form-select
																								v-model="selectedTreeLevel"
																								size="sm"
																								:options="levelsTreeSelect"
																								multiple
																								:select-size="4"
																							>
																								<template v-slot:first>
																									<b-form-select-option
																										:value="null"
																										disabled
																										>{{
																											$t("selectPlaceholder")
																										}}</b-form-select-option
																									>
																								</template>
																							</b-form-select>
																							<div
																								class="mt-1"
																								style="font-size: 0.6875rem"
																							>
																								<strong
																									>{{ $t("note") }}:
																								</strong>
																								{{ $t("multiSelectNote") }}
																							</div>
																						</div>
																						<div class="copy-options small">
																							<b-form-group>
																								<b-form-checkbox-group
																									id="checkbox-copy-options"
																									v-model="selectedCopyOption"
																									name="copy-options"
																								>
																									<b-form-checkbox
																										value="labels"
																										>{{
																											$t("labels")
																										}}</b-form-checkbox
																									>
																									<b-form-checkbox
																										value="range"
																										>{{
																											$t("range")
																										}}</b-form-checkbox
																									>
																									<b-form-checkbox
																										value="colors"
																										>{{
																											$t("colors")
																										}}</b-form-checkbox
																									>
																								</b-form-checkbox-group>
																							</b-form-group>
																						</div>
																						<div class="text-right">
																							<b-button
																								class="black-btn btn-sm"
																								@click.prevent.stop="
																									copy({
																										tInd: i,
																										stInd: j,
																										cmInd: c,
																									})
																								"
																								>{{ $t("copybtn") }}</b-button
																							>
																						</div>
																					</div>
																				</b-modal>
																			</b-col>
																		</b-row>
																	</b-col>
																</b-row>
															</div>
														</transition>
													</b-collapse>
												</div>
											</b-col>
										</b-row>
										<b-row v-if="subTab.chartSetting.length === 0">
											<b-col sm="12" class="text-center">
												Please add chart setting using <code>Add</code> button
												below.
											</b-col>
										</b-row>
										<div class="text-right pt-2">
											<b-button
												class="black-btn btn-sm ml-2"
												v-on:click="
													addElement({
														type: 'chartSetting',
														tInd: i,
														stInd: j,
													})
												"
												>{{ $t("addbtn") }}</b-button
											>
											<b-button
												class="black-btn btn-sm ml-2 d-none"
												v-on:click="
													addElement({ type: 'mapSetting', tInd: i, stInd: j })
												"
												>{{ $t("addbtn") }} Map</b-button
											>
										</div>
									</div>
									<template
										v-if="moduleKey === 'summaryDashboard' && subTab.summary"
									>
										<div
											class="card-header color-black text-uppercase f-s-0-875rem font-weight-bold"
										>
											Summary
										</div>
										<div class="p-2 border mb-3">
											<b-row class="mb-3">
												<b-col sm="6">
													<label :for="`summary-visible-${i}-${j}`">{{
														$t("disable")
													}}</label>
												</b-col>
												<b-col sm="6">
													<b-form-checkbox
														:id="`summary-visible-${i}-${j}`"
														class="mr-n2 mb-n1"
														switch
														v-model="subTab.summary.disable"
													>
													</b-form-checkbox>
												</b-col>
											</b-row>
											<transition name="slide-fade">
												<div v-if="!subTab.summary.disable">
													<b-row>
														<b-col sm="12" lg="6" class="mb-3">
															<b-row>
																<b-col sm="5">
																	<label
																		:for="`summary-percentageIndicator-${i}-${j}`"
																		>{{ $t("percentageIndicator") }}</label
																	>
																</b-col>
																<b-col sm="7">
																	<b-form-checkbox
																		:id="`summary-percentageIndicator-${i}-${j}`"
																		class="mr-n2 mb-n1"
																		switch
																		v-model="subTab.summary.percentageIndicator"
																	>
																	</b-form-checkbox>
																</b-col>
															</b-row>
														</b-col>
														<b-col sm="12" lg="6" class="mb-3">
															<b-row>
																<b-col sm="5">
																	<label :for="`summary-benchmark-${i}-${j}`">{{
																		$t("benchmark")
																	}}</label>
																</b-col>
																<b-col sm="7">
																	<b-input
																		type="number"
																		:id="`summary-benchmark-${i}-${j}`"
																		v-model="subTab.summary.benchmarkValue"
																	>
																	</b-input>
																</b-col>
															</b-row>
														</b-col>
														<DynamicNarration
															:i="i"
															:j="j"
															:summaryText.sync="subTab.summary.summaryText"
														/>
													</b-row>
												</div>
											</transition>
										</div>
									</template>
								</b-tab>

								<!-- New Tab Button (Using tabs-start slot) -->
								<template #tabs-start>
									<b-nav-item
										role="presentation"
										@click.prevent="updateTab({ type: 'type2', tInd: i })"
										href="#"
										class="text-center"
										v-b-tooltip.hover
										:title="$t('addbtn')"
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
						<div class="text-right pt-2">
							<b-button class="black-btn" @click.prevent="updateConfig">{{
								$t("savebtn")
							}}</b-button>
						</div>
					</div>
				</b-tab>

				<!-- New Tab Button (Using tabs-start slot) -->
				<template #tabs-start>
					<b-nav-item
						role="presentation"
						@click.prevent="updateTab({ type: 'type1' })"
						href="#"
						class="text-center"
						v-b-tooltip.hover
						:title="$t('addbtn')"
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
		<b-modal
			v-model="tabNameModal"
			title="Tab Name"
			@ok="handleOk"
			@hidden="resetModal('tab')"
			no-close-on-backdrop
		>
			<div>
				<b-row>
					<b-col sm="4">
						<label for="type-tabName">Name</label>
					</b-col>
					<b-col sm="8">
						<b-form-input
							id="type-tabName"
							type="text"
							v-model="updatedTabName"
						></b-form-input>
					</b-col>
				</b-row>
				<b-row
					v-if="updateType === 'type1' || updateType === 'type11'"
					class="pt-3"
				>
					<b-col sm="4">
						<label for="type-tabGroup">Group</label>
					</b-col>
					<b-col sm="8">
						<b-form-select
							id="type-tabGroup"
							v-model="groupName"
							:options="groups"
						></b-form-select>
					</b-col>
				</b-row>
				<b-row
					v-if="updateType === 'type1' || updateType === 'type11'"
					class="pt-3"
				>
					<b-col sm="4">
						<label for="type-tabShowGroups">Show Groups</label>
					</b-col>
					<b-col sm="8">
						<b-form-checkbox
							id="type-tabShowGroups"
							class="mr-n2 mb-n1"
							switch
							v-model="showGroups"
						>
						</b-form-checkbox>
					</b-col>
				</b-row>
			</div>
		</b-modal>
		<b-modal
			v-model="questionModel"
			:title="$t('addQuest')"
			@ok="actionOnQuestion({ type: 'update' })"
			no-close-on-backdrop
		>
			<template v-if="signOffQuestion">
				<div class="mb-3">
					{{ $t("quest") }}
					<b-form-textarea
						id="textarea"
						v-model="signOffQuestion.question"
						:placeholder="$t('enter_question')"
						rows="3"
					></b-form-textarea>
				</div>
				<div>
					<b-form-group :label="$t('options')">
						<b-row
							class="my-1"
							v-for="(opt, i) in signOffQuestion.options"
							:key="opt.value"
						>
							<b-col sm="1">
								<label :for="'input-option' + opt.value"
									><i
										class="fa fa-trash mr-2 cursor-pointer f-s-0-875rem"
										@click="actionOnOption({ type: 'delete', qInd: i })"
										v-b-tooltip.hover
										:title="$t('deletebtn')"
									></i
								></label>
							</b-col>
							<b-col sm="11">
								<b-form-input
									:id="'input-option' + opt.value"
									size="sm"
									placeholder=""
									v-model="opt.text"
								></b-form-input>
							</b-col>
						</b-row>
						<div
							class="text-center"
							v-if="signOffQuestion.options.length === 0"
						>
							There are no options<br />
							Add a new option using the <b>+</b> button.
						</div>
					</b-form-group>
				</div>
				<div class="pt-2">
					<b-button
						size="sm"
						class="black-btn"
						@click="actionOnOption({ type: 'add' })"
						>+</b-button
					>
				</div>
			</template>
		</b-modal>
		<dataEntryForm
			v-if="isDataEntry"
			:isDataEntry="isDataEntry"
			:dataEntryID="dataEntryID"
			@hideModal="hideModal"
		/>
	</div>
</template>
<script>
import service from "@/service";
import { VueEditor } from "vue2-editor";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import dataEntryForm from "@/components/config/dqr/dataEntryForm";
import VueEditorOptionMixin from "@/helpers/VueEditorOptionMixin";
import { randomString } from "@/components/Common/commonFunctions";
import DynamicConfigOptionsMixin from "@/helpers/DynamicConfigOptionsMixin";
export default {
	props: [
		"indicatorsList",
		"dataElementsList",
		"dataSetsList",
		"metrixList",
		"supportedLanguages",
		"globalMapping",
		"moduleKey",
		"orgList",
	],
	mixins: [VueEditorOptionMixin, DynamicConfigOptionsMixin],
	components: {
		VueEditor,
		Treeselect,
		dataEntryForm,
		AddMapping: () =>
			import(
				/* webpackChunkName: "admin_AddMapping"*/ "@/components/config/AddMapping"
			),
		DynamicNarration: () =>
			import(
				/* webpackChunkName: "admin_DynamicNarration"*/ "@/components/config/DynamicNarration"
			),
	},
	data() {
		let levelID = this.$store.getters.getApplicationModule().defaultLevelID;
		let levels = this.orgList
			.filter((item) => {
				if (item.level === levelID && item.level === this.orgList.length) {
					return item;
				}
				if (item.level >= levelID) {
					return item;
				}
			})
			.map((o) => ({
				level: o.level,
				levelName: o.name,
				isAutoRange: true,
				scales: [
					{
						lowScale: "0",
						highScale: "25",
						scaleColor: "#0000ff",
						scaleLabel: "Low",
					},
					{
						lowScale: "25",
						highScale: "50",
						scaleColor: "#0000ff",
						scaleLabel: "Medium",
					},
					{
						lowScale: "50",
						highScale: "75",
						scaleColor: "#0000ff",
						scaleLabel: "High",
					},
					{
						lowScale: "75",
						highScale: "100",
						scaleColor: "#0000ff",
						scaleLabel: "Very High",
					},
				],
			}))
			.sort((a, b) => {
				return a.level < b.level ? -1 : a.level == b.level ? 0 : 1;
			});
		return {
			tabs: [],
			groups: [],
			groupName: "",
			signOffTab: 0,
			levels: levels,
			dataEntryID: "",
			signOffSubTab: 0,
			updateType: null,
			updateIndex: null,
			showGroups: false,
			isDataEntry: false,
			updatedTabName: "",
			tabNameModal: false,
			questionModel: false,
			updateSubIndex: null,
			isDataFetched: false,
			updateSubSubIndex: null,
			chartTitleMaxLength: 100,
			chartInfoMaxLength: 200,
			integrated: {
				color: "#000",
				linked: false,
				displayName: "",
				minThreshold: 0,
				maxThreshold: 100,
			},
			summary: {
				disable: false,
				percentageIndicator: false,
				benchmarkValue: "",
				summaryText: "",
			},
			signOff: {
				question: "",
				options: [
					{ text: "Yes", value: "Yes" },
					{ text: "No", value: "No" },
				],
				comment: "",
				answer: "",
			},
			signOffQuestion: null,
			paletteColor: "#00ff80",
			percentageLight: 40,
			shadesNumber: 4,
			showShades: false,
			predefinedShades: [
				["#d4ffff", "#acefff", "#84c7ff", "#5c9fef"],
				["#ffffac", "#ffdd84", "#ffb55c", "#ed8d34"],
				["#ffd9d3", "#ffb1ab", "#ff8983", "#e2615b"],
				["#eaffce", "#c2ffa6", "#9ade7e", "#72b656"],
			],
			levelsSelect: [],
			selectedLevel: null,
			selectedTreeLevel: [],
			copyLevels: [],
			selectedCopyOption: [],
			copyToKey: "",
		};
	},
	computed: {
		shades: function () {
			let shades = [this.paletteColor],
				color = this.paletteColor;
			for (let i = 1; i < this.shadesNumber; i++) {
				color = this.adjust({ color: color, amount: this.percentageLight * 1 });
				shades.push(color);
			}
			shades = this.percentageLight * 1 < 0 ? shades : shades.reverse();
			return shades;
		},
		subGroups: function () {
			const vm = this;
			return function (group) {
				let subGroups = [];
				let g = vm.groups.find((g) => g.value === group);
				if (g) {
					subGroups = g.subGroups;
				}
				return subGroups;
			};
		},
		allMappings: function () {
			return function (i, j) {
				let mapping = [];
				let tabs = JSON.parse(JSON.stringify(this.tabs));
				let isTab = tabs.find((tab) => tab.id === i);
				if (isTab) {
					let isSubTab = isTab.subTabs.find((subTab) => subTab.id === j);
					if (isSubTab) {
						isSubTab.mapping.forEach((m) => {
							let isMapping = m.indicator.subIndicator.find(
								(s) => s.selectedDE.length
							);
							if (isMapping) {
								mapping.push({
									label: m.indicator.name,
									id: m.indicator.static_name,
								});
							}
						});
					}
				}
				return mapping;
			};
		},
		levelsTreeSelect: function () {
			return this.levelsSelect.filter((l) => l.value !== this.selectedLevel);
		},
		chartTypeOptions: function () {
			return function (type, group) {
				let option = [];
				option.push({
					value: null,
					text: "Please select chart type",
					disabled: true,
				});
				if (type === "map") {
					option.push({
						value: "map",
						text: this.$i18n.t("map"),
					});
				} else {
					option.push({
						value: "column",
						text: this.$i18n.t("column"),
					});
					option.push({
						value: "bar",
						text: this.$i18n.t("bar"),
					});
					option.push({
						value: "line",
						text: this.$i18n.t("line"),
					});
					option.push({
						value: "spline",
						text: this.$i18n.t("spline"),
					});
					option.push({
						value: "area",
						text: this.$i18n.t("area"),
					});
					option.push({
						value: "stack",
						text: this.$i18n.t("stack"),
					});
					if (group.includes("-CC-")) {
						option.push({
							value: "scatter",
							text: this.$i18n.t("scatter"),
						});
					}
				}
				return option;
			};
		},
		chartCalculations: function () {
			return function (category) {
				let calc = [];
				if (category === "regional") {
					calc.push({
						text: "% Pt Change (prior month to current month)",
						value: "PERIOD_DIFF",
					});
				}
				calc.push({
					text: "Default",
					value: "DEFAULT",
				});
				return calc;
			};
		},
		benchmarks: function () {
			return function (mapping, category, calc, dataSum) {
				let arr = [];
				let gSetting = this.$store.getters.getGlobalFactors();
				if (
					gSetting.allBenchmarks &&
					gSetting.allBenchmarks.benchmarks &&
					gSetting.allBenchmarks.benchmarks.length
				) {
					gSetting.allBenchmarks.benchmarks.forEach((b) => {
						let addBenchmark = true;
						if (
							(category !== "regional" && b.plotLineType === "national") ||
							(category === "regional" &&
								calc === "PERIOD_DIFF" &&
								b.plotLineType === "national") ||
							(mapping &&
								mapping.length > 1 &&
								!dataSum &&
								b.plotLineType === "national")
						) {
							addBenchmark = false;
						}
						if (addBenchmark) {
							arr.push({
								label: b.displayName,
								id: `${b.id}_${b.plotLineType}`,
							});
						}
					});
				}
				return arr;
			};
		},
		seasonalPeriod: function () {
			return function () {
				let yrs = [
					{
						text: "1",
						value: 1,
					},
					{
						text: "2",
						value: 2,
					},
					{
						text: "3",
						value: 3,
					},
					{
						text: "4",
						value: 4,
					},
					{
						text: "5",
						value: 5,
					},
				];
				return yrs;
			};
		},
		chartCategory: function () {
			return function () {
				let category = [
					{
						text: "Trend",
						value: "trend",
					},
					{
						text: "Regional",
						value: "regional",
					},
					{
						text: "Seasonal Trend",
						value: "seasonal",
					},
				];
				return category;
			};
		},
	},
	methods: {
		updateBenchmarks({
			tInd,
			stInd,
			cInd,
			dataMapping,
			chartCategory,
			chartDataSum,
		}) {
			let remove = false;
			if (
				chartCategory !== "regional" ||
				(dataMapping.length > 1 &&
					chartCategory === "regional" &&
					!chartDataSum) ||
				(dataMapping.length > 1 && chartCategory !== "regional") ||
				(chartCategory !== "regional" && !chartDataSum)
			) {
				remove = true;
			}
			if (remove) {
				let b =
					this.tabs[tInd].subTabs[stInd].chartSetting[cInd].chartOptions
						.benchmarks;
				this.tabs[tInd].subTabs[stInd].chartSetting[
					cInd
				].chartOptions.benchmarks = b.filter((c) => !c.includes("national"));
			}
		},
		copyTo({ tInd, stInd, cmInd, key = "chartSetting" }) {
			this.copyToKey = key;
			this.levelsSelect = this.tabs[tInd].subTabs[stInd][key][
				cmInd
			].chartOptions.levels.map((l) => ({
				text: l.levelName,
				value: l.level,
			}));
			this.copyLevels =
				this.tabs[tInd].subTabs[stInd][key][cmInd].chartOptions.levels;
			this.selectedLevel = null;
			this.selectedTreeLevel = [];
			this.selectedCopyOption = [];
			this.$nextTick(() => {
				this.$bvModal.show("copyToModal" + tInd + stInd + cmInd);
			});
		},
		copy({ tInd, stInd, cmInd }) {
			let mData = JSON.parse(
				JSON.stringify(this.tabs[tInd].subTabs[stInd][this.copyToKey][cmInd])
			);
			let levels = mData.chartOptions.levels,
				sourceLevel = levels.filter((l) => l.level === this.selectedLevel),
				targetLevel = levels.filter((l) =>
					this.selectedTreeLevel.includes(l.level)
				),
				updatedTargetLevels = [],
				pendingLevel = levels.filter(
					(l) => !this.selectedTreeLevel.includes(l.level)
				);
			targetLevel.forEach((t) => {
				let updatedScale = [];
				t.scales.forEach((s, j) => {
					if (this.selectedCopyOption.includes("labels")) {
						s = { ...s, scaleLabel: sourceLevel[0].scales[j].scaleLabel };
					}
					if (this.selectedCopyOption.includes("range")) {
						s = {
							...s,
							highScale: sourceLevel[0].scales[j].highScale,
							lowScale: sourceLevel[0].scales[j].lowScale,
						};
					}
					if (this.selectedCopyOption.includes("colors")) {
						s = { ...s, scaleColor: sourceLevel[0].scales[j].scaleColor };
					}
					updatedScale[j] = s;
				});
				updatedTargetLevels.push({ ...t, scales: updatedScale });
			});
			let finalLevels = [...pendingLevel, ...updatedTargetLevels].sort(
				(a, b) => {
					return a.level < b.level ? -1 : a.level == b.level ? 0 : 1;
				}
			);
			this.tabs[tInd].subTabs[stInd][this.copyToKey][
				cmInd
			].chartOptions.levels = finalLevels;
			this.$nextTick(() => {
				this.$bvModal.hide("copyToModal" + tInd + stInd + cmInd);
			});
		},
		adjust({ color, amount }) {
			return (
				"#" +
				color
					.replace(/^#/, "")
					.replace(/../g, (color) =>
						(
							"0" +
							Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(
								16
							)
						).substr(-2)
					)
			);
		},
		applyPalette({
			tInd,
			stInd,
			cmInd,
			key = "chartSetting",
			levelInd = "all",
			shades = null,
		}) {
			let colors = shades ? shades : this.shades;
			let updatedChart = {
				chartOptions: {
					...this.tabs[tInd].subTabs[stInd][key][cmInd].chartOptions,
					levels: this.tabs[tInd].subTabs[stInd][key][
						cmInd
					].chartOptions.levels.map((level, lInd) => {
						if (levelInd !== "all") {
							if (lInd === levelInd) {
								return {
									...level,
									scales: level.scales.map((scale, k) => ({
										...scale,
										scaleColor: colors[k],
									})),
								};
							} else {
								return level;
							}
						} else {
							return {
								...level,
								scales: level.scales.map((scale, k) => ({
									...scale,
									scaleColor: colors[k],
								})),
							};
						}
					}),
				},
			};
			this.$set(this.tabs[tInd].subTabs[stInd][key], cmInd, updatedChart);
		},
		hideModal() {
			this.dataEntryID = "";
			this.isDataEntry = false;
		},
		dataEntry(id) {
			this.dataEntryID = id;
			this.isDataEntry = true;
		},
		getConfigData() {
			this.$store.state.loading = true;
			let key = this.generateKey(this.moduleKey);

			service
				.getSavedConfig(key)
				.then((response) => {
					this.tabs = response.data;
					this.originalTabs = JSON.parse(JSON.stringify(response.data));
					this.isDataFetched = true;
					this.$store.state.loading = false;
				})
				.catch(() => {
					console.log("Config not found...");
					this.isDataFetched = true;
					this.$store.state.loading = false;
				});
		},
		async updateConfig() {
			this.$store.state.loading = true;
			let tabs = [];
			if (this.tabs.length) {
				tabs = this.tabs.map(async (t) => {
					let subTabs = t.subTabs.map(async (st) => {
						let chartSetting = st.chartSetting.map(async (d) => {
							let cid = "";
							if (d.chartOptions && !d.chartOptions.cid) {
								try {
									let resp = await service.createDHISChart(
										`${randomString(16)} ${d.chartOptions.chartName}`
									);
									if (resp.data.status === "OK") {
										cid = resp.data.response.uid;
									}
								} catch (err) {
									console.log(err);
								}
							} else {
								return d;
							}
							return {
								chartOptions: {
									...d.chartOptions,
									cid,
								},
							};
						});
						chartSetting = await Promise.all(chartSetting);
						return {
							...st,
							chartSetting: chartSetting,
						};
					});
					subTabs = await Promise.all(subTabs);
					return {
						...t,
						subTabs: subTabs,
					};
				});
				tabs = await Promise.all(tabs);
			}
			let key = this.generateKey(this.moduleKey);
			service
				.getSavedConfig(key)
				.then((res) => {
					// let configData = assign(res.data, tabs);
					let configData = tabs;
					let response = service.updateConfig(configData, key);
					response
						.then((response) => {
							if (response.data.status === "OK") {
								this.$swal({
									title: this.$i18n.t("data_saved_successfully"),
								}).then(() => {
									// if (Object.keys(configChanges).length) {
									// 	audit.processAudit(
									// 		"process2",
									// 		key,
									// 		configChanges,
									// 		this.chartByType,
									// 		this.chartBySubtype
									// 	);
									// }
								});
								this.$store.state.loading = false;
							} else {
								this.$swal({
									title: this.$i18n.t("error"),
									text: `${response.data.message}`,
								});
								this.$store.state.loading = false;
								return;
							}
						})
						.catch(() => {
							this.$swal({
								title: this.$i18n.t("error"),
							});
							this.$store.state.loading = false;
							return;
						});
				})
				.catch(() => {
					let response = service.saveConfig(tabs, key);
					response.then((response) => {
						if (response.data.status === "OK") {
							this.$swal({
								title: this.$i18n.t("data_saved_successfully"),
							});
							this.$store.state.loading = false;
						} else {
							this.$swal({
								title: this.$i18n.t("error"),
								text: `${response.data.message}`,
							});
							this.$store.state.loading = false;
							return;
						}
					});
				});
		},
		moveItem({ type, places, tInd, stInd, mInd, siInd, smInd, cInd, qInd }) {
			let target = null,
				updateInd = null;
			if (type === "tab") {
				target = this.tabs;
				updateInd = tInd;
			}
			if (type === "subTab") {
				target = this.tabs[tInd].subTabs;
				updateInd = stInd;
			}

			if (type === "method") {
				target = this.tabs[tInd].subTabs[stInd].mapping;
				updateInd = mInd;
			}
			if (type === "sourceMethod") {
				target = this.tabs[tInd].subTabs[stInd].sourceMapping[smInd].mapping;
				updateInd = mInd;
			}
			if (type === "subMethod") {
				target =
					this.tabs[tInd].subTabs[stInd].mapping[mInd].indicator.subIndicator;
				updateInd = siInd;
			}
			if (type === "sourceSubMethod") {
				target =
					this.tabs[tInd].subTabs[stInd].sourceMapping[smInd].mapping[mInd]
						.indicator.subIndicator;
				updateInd = siInd;
			}
			if (type === "chartSetting") {
				target = this.tabs[tInd].subTabs[stInd].chartSetting;
				updateInd = cInd;
			}
			if (type === "mapSetting") {
				target = this.tabs[tInd].subTabs[stInd].mapSetting;
				updateInd = cInd;
			}
			if (type === "question") {
				target = this.tabs[tInd].subTabs[stInd].questions;
				updateInd = qInd;
			}

			if (
				(updateInd === 0 && places === -1) ||
				(updateInd === target.length - 1 && places === 1)
			) {
				this.$swal({
					title: "Can't Move",
				});
			} else {
				let oTemp = target[updateInd];
				let nTemp = target[updateInd * 1 + places];
				this.$set(target, updateInd * 1 + places, oTemp);
				this.$set(target, updateInd, nTemp);
			}
		},
		resetModal(type) {
			if (type === "tab") {
				this.groupName = "";
				this.updateIndex = "";
				this.updateType = null;
				this.showGroups = false;
				this.updateSubIndex = "";
				this.updatedTabName = "";
			}
		},
		deleteElement({ type, tInd, stInd, smInd, mInd, delInd }) {
			if (type === "mapSetting") {
				this.$swal({
					title: "Can't delete the default setting. Please try disabling it.",
				});
			} else {
				this.$swal({
					title: this.$i18n.t("areyousure"),
					text: this.$i18n.t("youablerevertthis"),
					showCancelButton: true,
					confirmButtonText: this.$i18n.t("yes_delete_it"),
				}).then((result) => {
					if (result.value) {
						if (type === "tab") {
							this.tabs.splice(tInd, 1);
						}
						if (type === "subTab") {
							this.tabs[tInd].subTabs.splice(stInd, 1);
						}
						if (type === "sourceMapping") {
							this.tabs[tInd].subTabs[stInd].sourceMapping.splice(smInd, 1);
						}
						if (type === "method") {
							this.tabs[tInd].subTabs[stInd].mapping.splice(delInd, 1);
						}
						if (type === "sourceMethod") {
							this.tabs[tInd].subTabs[stInd].sourceMapping[
								smInd
							].mapping.splice(delInd, 1);
						}
						if (type === "subMethod") {
							this.tabs[tInd].subTabs[stInd].mapping[
								mInd
							].indicator.subIndicator.splice(delInd, 1);
						}
						if (type === "sourceSubMethod") {
							this.tabs[tInd].subTabs[stInd].sourceMapping[smInd].mapping[
								mInd
							].indicator.subIndicator.splice(delInd, 1);
						}
						if (type === "chartSetting") {
							this.tabs[tInd].subTabs[stInd].chartSetting.splice(delInd, 1);
						}
					}
				});
			}
		},
		addElement({ type, tInd, stInd, mInd, smInd, mKey = "chartSetting" }) {
			let randomStr = randomString(16);
			if (type === "method") {
				let config = JSON.parse(JSON.stringify(this.indicatorConfig));
				this.tabs[tInd].subTabs[stInd].mapping.push({
					...config,
					indicator: {
						...config.indicator,
						static_name: randomStr,
					},
				});
			}
			if (type === "sourceMethod") {
				let config = JSON.parse(JSON.stringify(this.indicatorConfig));
				this.tabs[tInd].subTabs[stInd].sourceMapping[smInd].mapping.push({
					...config,
					indicator: {
						...config.indicator,
						static_name: randomStr,
					},
				});
			}
			if (type === "subMethod") {
				let config = JSON.parse(JSON.stringify(this.subIndicatorConfig));
				this.tabs[tInd].subTabs[stInd].mapping[
					mInd
				].indicator.subIndicator.push({
					...config,
					static_name: randomStr,
				});
			}
			if (type === "sourceSubMethod") {
				let config = JSON.parse(JSON.stringify(this.subIndicatorConfig));
				this.tabs[tInd].subTabs[stInd].sourceMapping[smInd].mapping[
					mInd
				].indicator.subIndicator.push({
					...config,
					static_name: randomStr,
				});
			}
			if (type === "chartSetting") {
				this.tabs[tInd].subTabs[stInd].chartSetting.push(
					JSON.parse(JSON.stringify(this.chartSettingConfig))
				);
			}
			if (type === "mapSetting") {
				let map = this.getMapConfig();
				this.tabs[tInd].subTabs[stInd][mKey].push(map);
			}
		},
		getMapConfig() {
			let map = JSON.parse(JSON.stringify(this.mapSettingConfig));
			map = {
				chartOptions: {
					...map.chartOptions,
					levels: JSON.parse(JSON.stringify(this.levels)),
				},
			};
			return map;
		},
		actionOnQuestion({ type, tInd, stInd, qInd }) {
			if (type === "add") {
				this.signOffTab = tInd;
				this.signOffSubTab = stInd;
				let signOff = JSON.parse(JSON.stringify(this.signOff));
				this.signOffQuestion = {
					...signOff,
					id: randomString(16),
				};
				this.$nextTick(() => {
					this.questionModel = true;
				});
			}
			if (type === "edit") {
				this.signOffTab = tInd;
				this.signOffSubTab = stInd;
				this.signOffQuestion = JSON.parse(
					JSON.stringify(
						this.tabs[this.signOffTab].subTabs[this.signOffSubTab].questions[
							qInd
						]
					)
				);
				this.$nextTick(() => {
					this.questionModel = true;
				});
			}
			if (type === "delete") {
				this.$swal({
					title: this.$i18n.t("areyousure"),
					text: this.$i18n.t("youablerevertthis"),
					showCancelButton: true,
					confirmButtonText: this.$i18n.t("yes_delete_it"),
				}).then((result) => {
					if (result.value) {
						this.tabs[this.signOffTab].subTabs[
							this.signOffSubTab
						].questions.splice(qInd, 1);
					}
				});
			}
			if (type === "update") {
				let que =
					this.tabs[this.signOffTab].subTabs[this.signOffSubTab].questions;
				let isFound = que.findIndex((q) => q.id === this.signOffQuestion.id);
				if (isFound >= 0) {
					que[isFound] = this.signOffQuestion;
				} else {
					que.push(this.signOffQuestion);
				}
			}
		},
		actionOnOption({ type, qInd }) {
			if (type === "add") {
				this.signOffQuestion.options.push({
					value: randomString(16),
					text: this.$i18n.t("default"),
				});
			}
			if (type === "delete") {
				this.$swal({
					title: this.$i18n.t("areyousure"),
					text: this.$i18n.t("youablerevertthis"),
					showCancelButton: true,
					confirmButtonText: this.$i18n.t("yes_delete_it"),
				}).then((result) => {
					if (result.value) {
						this.signOffQuestion.options.splice(qInd, 1);
					}
				});
			}
		},
		handleOk() {
			if (this.updateType === "type1") {
				let mapSetting = [];
				if (this.moduleKey === "analyticalDashboard") {
					let map = this.getMapConfig();
					mapSetting.push(map);
				}
				this.tabs.push({
					tabName: this.updatedTabName,
					id: randomString(16),
					group: this.groupName,
					showGroups: this.showGroups,
					subTabs: [
						{
							group: "",
							mapSetting,
							mapping: [],
							signOff: [],
							questions: [],
							chartSetting: [],
							sourceMapping: [],
							id: randomString(16),
							isSingleSource: true,
							backgroundData: null,
							tabName: this.$i18n.t("default"),
							summary:
								this.moduleKey === "summaryDashboard"
									? JSON.parse(JSON.stringify(this.summary))
									: null,
							integrated:
								this.moduleKey === "summaryDashboard"
									? JSON.parse(JSON.stringify(this.integrated))
									: null,
						},
					],
				});
			}
			if (this.updateType === "type11") {
				this.tabs[this.updateIndex].tabName = this.updatedTabName;
				this.tabs[this.updateIndex].group = this.groupName;
				this.tabs[this.updateIndex].showGroups = this.showGroups;
			}
			if (this.updateType === "type2") {
				let mapSetting = [];
				if (this.moduleKey === "analyticalDashboard") {
					let map = this.getMapConfig();
					mapSetting.push(map);
				}
				this.tabs[this.updateIndex].subTabs.push({
					group: "",
					mapSetting,
					mapping: [],
					signOff: [],
					questions: [],
					chartSetting: [],
					sourceMapping: [],
					id: randomString(16),
					backgroundData: null,
					isSingleSource: true,
					tabName: this.updatedTabName,
					summary:
						this.moduleKey === "summaryDashboard"
							? JSON.parse(JSON.stringify(this.summary))
							: null,
					integrated:
						this.moduleKey === "summaryDashboard"
							? JSON.parse(JSON.stringify(this.integrated))
							: null,
				});
			}
			if (this.updateType === "type21") {
				this.tabs[this.updateIndex].subTabs[this.updateSubIndex].tabName =
					this.updatedTabName;
			}
			if (this.updateType === "type3") {
				this.tabs[this.updateIndex].subTabs[
					this.updateSubIndex
				].sourceMapping.push({
					mapping: [],
					id: randomString(16),
					tabName: this.updatedTabName,
				});
			}
			if (this.updateType === "type31") {
				this.tabs[this.updateIndex].subTabs[this.updateSubIndex].sourceMapping[
					this.updateSubSubIndex
				].tabName = this.updatedTabName;
			}
		},
		updatedBGData({ tInd, stInd, group }) {
			let bgData = JSON.parse(JSON.stringify(this.backgroundData));
			if (group.includes("-IC-")) {
				this.tabs[tInd].subTabs[stInd].backgroundData = bgData.IC;
			} else if (group.includes("-CC-")) {
				this.tabs[tInd].subTabs[stInd].backgroundData = bgData.CC;
			} else {
				this.tabs[tInd].subTabs[stInd].backgroundData = null;
			}
			if (group === "SUMMARY") {
				if (this.tabs[tInd].subTabs[stInd].mapSetting.length === 0) {
					this.addElement({
						type: "mapSetting",
						tInd: tInd,
						stInd: stInd,
						mKey: "mapSetting",
					});
				}
			}
		},
		updateTab({
			type,
			tabName = "",
			tInd = null,
			stInd = null,
			smInd = null,
			group = null,
			showGroups = null,
		}) {
			this.updateIndex = tInd;
			this.groupName = group;
			this.updateType = type;
			this.updateSubIndex = stInd;
			this.updatedTabName = tabName;
			this.updateSubSubIndex = smInd;
			this.showGroups = showGroups;
			this.$nextTick(() => {
				this.tabNameModal = true;
			});
		},
		//Delete specific mapping
		deleteDE({
			index,
			ind,
			mapIndex,
			sourceIndex,
			subTabIndex,
			deIndex,
			dataKey,
		}) {
			if (sourceIndex >= 0) {
				this.tabs[index].subTabs[subTabIndex].sourceMapping[
					sourceIndex
				].mapping[mapIndex].indicator[dataKey][ind].selectedDE.splice(
					deIndex,
					1
				);
			} else {
				this.tabs[index].subTabs[subTabIndex].mapping[mapIndex].indicator[
					dataKey
				][ind].selectedDE.splice(deIndex, 1);
			}
		},
		//Reset the mapping
		resetDE({ index, ind, mapIndex, sourceIndex, subTabIndex, dataKey }) {
			if (sourceIndex >= 0) {
				this.tabs[index].subTabs[subTabIndex].sourceMapping[
					sourceIndex
				].mapping[mapIndex].indicator[dataKey][ind].selectedDE = [];
			} else {
				this.tabs[index].subTabs[subTabIndex].mapping[mapIndex].indicator[
					dataKey
				][ind].selectedDE = [];
			}
		},
		//Store the selected mapping in configuration object
		addDE({
			index,
			ind,
			type,
			mapIndex,
			sourceIndex,
			subTabIndex,
			selectedDataSource,
			dataKey,
		}) {
			if (sourceIndex >= 0) {
				this.tabs[index].subTabs[subTabIndex].sourceMapping[
					sourceIndex
				].mapping[mapIndex].indicator[dataKey][ind].type = type;
				this.tabs[index].subTabs[subTabIndex].sourceMapping[
					sourceIndex
				].mapping[mapIndex].indicator[dataKey][ind].selectedDE.push(
					selectedDataSource
				);
			} else {
				this.tabs[index].subTabs[subTabIndex].mapping[mapIndex].indicator[
					dataKey
				][ind].type = type;
				this.tabs[index].subTabs[subTabIndex].mapping[mapIndex].indicator[
					dataKey
				][ind].selectedDE.push(selectedDataSource);
			}
		},
	},
	created() {
		let gList = [
			{
				id: "ANC",

				text: "ANC",
			},
			{
				id: "PNC",

				text: "PNC",
			},
			{
				id: "DELIVERY_CARE",

				text: "Delivery Care",
			},
			{
				id: "MAT_DEATHS",

				text: "Maternal Deaths",
			},
			{
				id: "SBN_DEATHS",

				text: "Stillbirth and Neonatal Deaths",
			},
			{
				id: "INF_HEALTH",

				text: "Infant Health Secondary",
			},
			{
				id: "DEFAULT",

				text: "Default",
			},
		];
		let groups = [];
		gList.forEach((g) => {
			let obj = {
				value: g.id,
				text: g.text,
			};
			let subGroups =
				this.moduleKey === "analyticalDashboard"
					? [
							{
								value: `GEO`,
								text: "Geographic Variation",
							},
							{
								value: `COMP`,
								text: "Key Components",
							},
							{
								value: `TIMING`,
								text: "By Timing",
							},
							{
								value: `AGE`,
								text: "By Age",
							},
							{
								value: "SUMMARY",

								text: "Summary",
							},
							{
								value: "DEFAULT",

								text: "Default",
							},
					  ]
					: this.moduleKey === "dqrDashboard"
					? [
							{
								label: "Completeness and Timeliness",
								options: [
									{
										value: `${g.id}-CT-actualRR`,
										text: "Reporting Rate (Actual)",
									},
									{
										value: `${g.id}-CT-onTimeRR`,
										text: "Reporting Rate (On Time)",
									},
								],
							},
							{
								label: "Internal Consistency",
								options: [
									{
										value: `${g.id}-IC-total`,
										text: "Totals",
									},
									{
										value: `${g.id}-IC-aggregate`,
										text: "Aggregate",
									},
								],
							},
							{
								label: "Internal Consistency Correlation",
								options: [
									{
										value: `${g.id}-CC-method1ICC`,
										text: "Method 1",
									},
									{
										value: `${g.id}-CC-method2ICC`,
										text: "Method 2",
									},
									{
										value: `${g.id}-CC-method3ICC`,
										text: "Method 3",
									},
								],
							},
							{
								label: "Default",
								options: [
									{
										value: "DEFAULT",

										text: "Default",
									},
								],
							},
					  ]
					: [
							{
								value: g.id,
								text: g.text,
							},
					  ];
			if (g.id) {
				obj.subGroups = subGroups;
			}
			groups.push(obj);
		});
		this.groups = groups;
		this.getConfigData();
	},
};
</script>
<style lang="scss">
.vue-treeselect__label {
	white-space: inherit !important;
}
</style>
