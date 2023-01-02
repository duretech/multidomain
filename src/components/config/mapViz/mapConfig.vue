<template>
	<div class="">
		<div class="card">
			<div class="card-header p-5px" id="headingTwo">
				<h2 class="mb-0">
					<button
						class="btn btn-link w-100 text-left color-white"
						type="button"
						data-toggle="collapse"
						data-target="#groupDiv"
						aria-expanded="true"
						aria-controls="groupDiv"
					>
						{{ $t("groupCreation") }}
						<span class="float-right"><i class="fa fa-minus"></i></span>
					</button>
				</h2>
			</div>
			<div id="groupDiv" class="collapse show border" aria-labelledby="headingTwo">
				<div class="card-body ">
					<div class="clearfix pb-3">
						<span class="float-left">
							<input
								type="text"
								class="form-control"
								:placeholder="$t('search')"
								v-model="searchGroupName"
								style="border-left: 0"
							/>
						</span>
						<b-button
							class="float-right addgrpBtn"
							@click="edittableGroup"
							v-if="$root.defaultLanguageLocale === $i18n.locale"
							>{{ $t("addGroup") }}</b-button
						>
						<div
							class="text-right"
							v-if="$root.defaultLanguageLocale !== $i18n.locale"
						>
							<SyncMapping ref="syncMapping" @syncMapping="syncMapping" />
						</div>
					</div>
					<div class="table-responsive table-striped groupCreationtable">
						<table class="table" style="border: 1px solid #181736">
							<thead class="thead-dark">
								<tr>
									<th scope="col" style="width: 80%">
										{{ $t("group") }}
									</th>
									<th scope="col" style="width: 20%">
										{{ $t("action") }}
									</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="group in filteredGroups" :key="group.id">
									<td>{{ group.name }}</td>
									<td>
										<div class="d-flex">
											<b-button
												size="sm"
												class="mr-4 cursor-pointer editBtn"
												variant="dark"
												@click="editGroup('mapGroups', group.id)"
											>
												<i class="fa fa-pencil-square-o"></i>
												{{ $t("edit") }}
											</b-button>
											<b-button
												size="sm"
												variant="secondary"
												class="cursor-pointer deleteBtn"
												@click="deleteGroup('mapGroups', group.id)"
												v-if="$root.defaultLanguageLocale === $i18n.locale"
											>
												<i class="fa fa-trash"></i>
												{{ $t("deletebtn") }}
											</b-button>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="mt-3" v-if="groupsLen > perPage">
						<b-pagination
							v-model="currentPage"
							:total-rows="groupsLen"
							:per-page="perPage"
							align="center"
						></b-pagination>
					</div>
					<div id="collapse-1" v-if="showGrpForm">
						<div class="row">
							<div class="col-lg-12 m-b-20px m-t-20px">
								<div class="card">
									<div
										v-if="!updatetableflag"
										class="card-header border-radius-0 text-uppercase f-s-0-875rem cursor-pointer"
									>
										{{ $t("addGroup") }}
									</div>
									<div
										v-else
										class="card-header border-radius-0 text-uppercase f-s-0-875rem cursor-pointer"
									>
										{{ $t("editGroup") }}
									</div>
									<div class="card-body p-0" style="border: 1px solid #2f2d55">
										<div class="col-12">
											<div class="row m-0 mt-4 mb-2">
												<div class="col-sm-6">
													<div class="form-group row">
														<label class="col-sm-4 col-form-label">{{
															$t("groupName")
														}}</label>
														<div class="col-sm-8">
															<b-form-input
																id="input-live"
																v-model="groupDetails.name"
																:state="nameState"
																aria-describedby="input-live-help input-live-feedback"
																:placeholder="$t('enterGroupName')"
																trim
															></b-form-input>
														</div>
													</div>
												</div>
												<div class="col-sm-6">
													<div class="form-group row">
														<label class="col-sm-4 col-form-label">{{
															$t("groupDesc")
														}}</label>
														<div class="col-sm-8">
															<b-form-textarea
																id="textarea"
																v-model="groupDetails.description"
																:state="descState"
																:placeholder="$t('enterGroupDesc')"
																rows="3"
																max-rows="6"
															></b-form-textarea>
														</div>
													</div>
												</div>
												<div class="col-sm-6">
													<div class="form-group row">
														<label class="col-sm-3 col-form-label">{{
															$t("visible")
														}}</label>
														<div class="col-sm-9">
															<b-form-checkbox
																checked="groupDetails.visible"
																v-model="groupDetails.visible"
																name="check-button"
																switch
																size="lg"
															>
															</b-form-checkbox>
														</div>
													</div>
												</div>
												<div class="col-sm-12">
													<div class="form-group row float-right">
														<b-button
															v-if="updatetableflag"
															@click="updateMapGroups('mapGroups')"
															class="btn-dark"
															>{{ $t("update") }}</b-button
														>
														<b-button
															v-else
															@click="saveMapGroups('mapGroups')"
															class="btn-dark"
															>{{ $t("savebtn") }}</b-button
														>
														<b-button
															@click="showGrpForm = false"
															class="btn-dark ml-4"
															>{{ $t("cancelbtn") }}</b-button
														>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="card my-3" v-if="groups.length > 0">
			<div class="card-header p-5px" id="headingTwo">
				<h2 class="mb-0">
					<button
						class="btn btn-link w-100 text-left color-white"
						type="button"
						data-toggle="collapse"
						data-target="#subGroupDiv"
						aria-expanded="true"
						aria-controls="subGroupDiv"
					>
						{{ $t("subGroupCreation") }}
						<span class="float-right"><i class="fa fa-minus"></i></span>
					</button>
				</h2>
			</div>
			<div id="subGroupDiv" class="collapse show border" aria-labelledby="headingTwo">
				<div class="card-body">
					<div class="clearfix pb-3">
						<span class="float-left">
							<input
								type="text"
								class="form-control"
								:placeholder="$t('search')"
								v-model="searchSubGroupName"
								style="border-left: 0"
							/>
						</span>
						<b-button
							class="float-right subgrpBtn"
							@click="editableSubGroup"
							v-if="$root.defaultLanguageLocale === $i18n.locale"
							>{{ $t("addSubGroup") }}</b-button
						>
					</div>
					<div class="table-responsive table-striped groupCreationtable">
						<table class="table" style="border: 1px solid #181736">
							<thead class="thead-dark">
								<tr>
									<th scope="col" style="width: 50%">
										{{ $t("subGroup") }}
									</th>
									<th scope="col" style="width: 30%">
										{{ $t("group") }}
									</th>
									<th scope="col" style="width: 20%">
										{{ $t("action") }}
									</th>
								</tr>
							</thead>
							<tbody>
								<template v-for="group in filteredSubGroups">
									<tr :key="group.id">
										<td>{{ group.subName }}</td>
										<td>{{ group.groupName }}</td>
										<td>
											<div class="d-flex">
												<b-button
													size="sm"
													class="mr-4 cursor-pointer editBtn"
													variant="dark"
													@click="editGroup('subGroups', group.id)"
												>
													<i class="fa fa-pencil-square-o"></i>
													{{ $t("edit") }}
												</b-button>
												<b-button
													size="sm"
													variant="secondary"
													class="cursor-pointer deleteBtn"
													@click="deleteGroup('subGroups', group.id)"
													v-if="$root.defaultLanguageLocale === $i18n.locale"
												>
													<i class="fa fa-trash"></i>
													{{ $t("deletebtn") }}
												</b-button>
											</div>
										</td>
									</tr>
								</template>
							</tbody>
						</table>
					</div>
					<div class="mt-3" v-if="subGroupsLen > subperPage">
						<b-pagination
							v-model="subcurrentPage"
							:total-rows="subGroupsLen"
							:per-page="subperPage"
							align="center"
						></b-pagination>
					</div>
					<div id="collapse-2" v-if="showSubForm">
						<div class="row">
							<div class="col-lg-12 m-b-20px m-t-20px">
								<div class="card">
									<div
										v-if="!updatetablesubGroup"
										class="card-header border-radius-0 text-uppercase f-s-0-875rem cursor-pointer"
									>
										{{ $t("addSubGroup") }}
									</div>
									<div
										v-else
										class="card-header border-radius-0 text-uppercase f-s-0-875rem cursor-pointer"
									>
										{{ $t("editSubGroup") }}
									</div>
									<div class="card-body admin-indicator p-0" style="border: 1px solid #ddd">
										<div class="col-12">
											<div class="row m-0 mt-4 mb-2">
												<div class="col-sm-6">
													<div class="form-group row">
														<label class="col-sm-4 col-form-label">{{
															$t("subGroupName")
														}}</label>
														<div class="col-sm-8">
															<b-form-input
																id="input-live"
																v-model="subGroupDetails.name"
																:state="subnameState"
																aria-describedby="input-live-help input-live-feedback"
																:placeholder="$t('enterName')"
																trim
															></b-form-input>
														</div>
													</div>
												</div>
												<div class="col-sm-6">
													<div class="form-group row">
														<label class="col-sm-4 col-form-label">{{
															$t("selectGroup")
														}}</label>
														<div class="col-sm-8">
															<select
																class="form-control"
																v-model="subGroupDetails.groupId"
																:disabled="
																	$root.defaultLanguageLocale !== $i18n.locale
																"
															>
																<option
																	v-for="group in groups"
																	:key="group.id"
																	:value="group.id"
																>
																	{{ group.name }}
																</option>
															</select>
														</div>
													</div>
												</div>
												<div class="col-sm-6">
													<div class="form-group row">
														<label class="col-sm-4 col-form-label">{{
															$t("groupDesc")
														}}</label>
														<div class="col-sm-8">
															<b-form-textarea
																id="textarea"
																v-model="subGroupDetails.description"
																:state="subdescState"
																:placeholder="$t('enterDesc')"
																rows="3"
																max-rows="6"
															></b-form-textarea>
														</div>
													</div>
												</div>
												<div class="col-sm-6">
													<div class="form-group row">
														<label class="col-sm-3 col-form-label">{{
															$t("visible")
														}}</label>
														<div class="col-sm-9">
															<b-form-checkbox
																checked="subGroupDetails.visible"
																v-model="subGroupDetails.visible"
																name="check-button"
																switch
																size="lg"
															>
															</b-form-checkbox>
														</div>
													</div>
												</div>
												<div class="col-sm-12">
													<div class="form-group row float-right">
														<b-button
															v-if="updatetablesubGroup"
															@click="updateMapGroups('subGroups')"
															class="btn-dark"
															>{{ $t("update") }}</b-button
														>
														<b-button
															v-else
															@click="saveMapGroups('subGroups')"
															class="btn-dark"
															>{{ $t("savebtn") }}</b-button
														>
														<b-button
															@click="showSubForm = false"
															class="btn-dark ml-4"
															>{{ $t("cancelbtn") }}</b-button
														>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div
			class="card"
			v-if="groups.length > 0 && groups[0].subGroups.length > 0"
		>
			<div class="card-header p-5px" id="headingOne">
				<h2 class="mb-0">
					<button
						class="btn btn-link w-100 text-left color-white"
						type="button"
						data-toggle="collapse"
						data-target="#indicatorDiv"
						aria-expanded="true"
						aria-controls="indicatorDiv"
					>
						{{ $t("indicatorCreation") }}
						<span class="float-right"><i class="fa fa-minus"></i></span>
					</button>
				</h2>
			</div>
			<div id="indicatorDiv" class="collapse show border" aria-labelledby="headingOne">
				<div class="card-body">
					<div class="clearfix pb-3">
						<span class="float-left">
							<input
								type="text"
								class="form-control"
								:placeholder="$t('search')"
								v-model="searchIndicatorName"
								style="border-left: 0"
							/>
						</span>
						<b-button
							class="float-right indiBtn"
							@click="editableIndicator"
							v-if="$root.defaultLanguageLocale === $i18n.locale"
							>{{ $t("addIndicator") }}</b-button
						>
					</div>
					<div class="table-responsive table-striped groupCreationtable">
						<table class="table" style="border: 1px solid #181736">
							<thead class="thead-dark">
								<tr>
									<th scope="col" style="width: 40%">
										{{ $t("Indicator") }}
									</th>
									<th scope="col" style="width: 20%">
										{{ $t("group") }}
									</th>
									<th scope="col" style="width: 20%">
										{{ $t("subGroup") }}
									</th>
									<th scope="col" style="width: 20%">
										{{ $t("action") }}
									</th>
								</tr>
							</thead>
							<tbody>
								<template v-for="group in filteredIndicators">
									<tr :key="group.id">
										<td>{{ group.indName }}</td>
										<td>{{ group.groupName }}</td>
										<td>{{ group.subName }}</td>
										<td>
											<div class="d-flex">
												<b-button
													size="sm"
													class="mr-4 cursor-pointer editBtn"
													variant="dark"
													@click="editGroup('indicator', group.id)"
												>
													<i class="fa fa-pencil-square-o"></i>
													{{ $t("edit") }}
												</b-button>
												<b-button
													size="sm"
													variant="secondary"
													class="cursor-pointer deleteBtn"
													@click="deleteGroup('indicator', group.id)"
													v-if="$root.defaultLanguageLocale === $i18n.locale"
												>
													<i class="fa fa-trash"></i>
													{{ $t("deletebtn") }}
												</b-button>
											</div>
										</td>
									</tr>
								</template>
							</tbody>
						</table>
					</div>
					<div class="mt-3" v-if="indGroupsLen > indperPage">
						<b-pagination
							v-model="indcurrentPage"
							:total-rows="indGroupsLen"
							:per-page="indperPage"
							align="center"
						></b-pagination>
					</div>
					<div id="collapseChartSettings" v-if="showIndForm">
						<div class="row">
							<div class="col-lg-12 m-b-20px m-t-20px">
								<div class="card">
									<div
										v-if="!updatetableIndicator"
										class="card-header border-radius-0 text-uppercase f-s-0-875rem cursor-pointer"
									>
										{{ $t("addIndicator") }}
									</div>
									<div
										v-else
										class="card-header border-radius-0 text-uppercase f-s-0-875rem cursor-pointer"
									>
										{{ $t("editIndicator") }}
									</div>
									<div class="card-body indicator-main" style="border: 1px solid #ddd">
										<div class="row mt-2">
											<div class="col-lg-12">
												<div class="row">
													<div class="col-sm-6">
														<div class="form-group row">
															<label class="col-sm-3 col-form-label">{{
																$t("displayName")
															}}</label>
															<div class="col-sm-9">
																<input
																	type="text"
																	class="form-control"
																	placeholder=""
																	v-model="indicator.name"
																/>
															</div>
														</div>
													</div>
													<!-- <div class="col-sm-6" v-if="!updatetableIndicator"> -->
													<div class="col-sm-6">
														<div class="form-group row">
															<label class="col-sm-3 col-form-label">{{
																$t("group")
															}}</label>
															<div class="col-sm-9">
																<select
																	class="form-control"
																	v-model="indicator.groupId"
																	:disabled="
																		$root.defaultLanguageLocale !== $i18n.locale
																	"
																>
																	<option
																		v-for="group in groups"
																		:key="group.id"
																		:value="group.id"
																	>
																		{{ group.name }}
																	</option>
																</select>
															</div>
														</div>
													</div>
												</div>
												<div class="row">
													<!-- <div class="col-sm-6" v-if="!updatetableIndicator"> -->
													<div class="col-sm-6">
														<div class="form-group row">
															<label class="col-sm-3 col-form-label">{{
																$t("subGroup")
															}}</label>
															<div class="col-sm-9">
																<select
																	class="form-control"
																	v-model="indicator.subGroupId"
																	:disabled="
																		$root.defaultLanguageLocale !== $i18n.locale
																	"
																>
																	<template v-for="group in groups">
																		<template
																			v-for="subgroup in group.subGroups"
																		>
																			<option
																				v-if="group.id == indicator.groupId"
																				:key="subgroup.id"
																				:value="subgroup.id"
																			>
																				{{ subgroup.name }}
																			</option>
																		</template>
																	</template>
																</select>
															</div>
														</div>
													</div>
													<div class="col-sm-6">
														<div class="form-group row">
															<label class="col-sm-3 col-form-label">{{
																$t("source")
															}}</label>
															<div class="col-sm-9">
																<input
																	type="text"
																	class="form-control"
																	placeholder=""
																	v-model="indicator.source"
																/>
															</div>
														</div>
													</div>
												</div>
												<div class="row">
													<div class="col-sm-12">
														<div class="form-group row mb-0">
															<label class="col-sm-1 col-form-label">{{
																$t("scales")
															}}</label>
															<div class="col-sm-11 scalesTabSection">
																<b-tabs content-class="mt-3">
																	<b-tab
																		v-for="(
																			levelScale, levelIndex
																		) in indicator.levels"
																		:key="levelIndex"
																		:title="levelScale.levelName"
																	>
																		<div
																			class="card-body"
																			style="border: 1px solid #ddd"
																		>
																			<p></p>
																			<div class="row pb-2 pt-2">
																				<div class="col-5">
																					<div class="input-group">
																						<div class="input-group-prepend">
																							<div class="input-group-text p-1">
																								<input
																									type="color"
																									class=""
																									placeholder=""
																									v-model="paletteColor"
																								/>
																							</div>
																						</div>
																						<input
																							type="text"
																							class="form-control"
																							placeholder=""
																							v-model="paletteColor"
																						/>
																					</div>
																				</div>
																				<div class="col-7">
																					<div class="row">
																						<div class="col-7 pr-1">
																							<div class="input-group">
																								<div
																									class="input-group-prepend"
																								>
																									<div
																										class="input-group-text p-1 px-3 cursor-pointer"
																										v-b-tooltip.hover
																										:title="
																											$t('percentageInfo')
																										"
																									>
																										<i class="fa fa-info"></i>
																									</div>
																								</div>
																								<input
																									type="number"
																									min="-99"
																									max="99"
																									class="form-control col-4"
																									placeholder=""
																									v-model="percentageLight"
																								/>
																								<b-form-input
																									id="percentageLight-range-1"
																									v-model="percentageLight"
																									class="form-control"
																									type="range"
																									min="-99"
																									max="99"
																									step="1"
																								></b-form-input>
																							</div>
																						</div>
																						<div class="col-5 pl-1">
																							<div class="input-group">
																								<div
																									class="input-group-prepend"
																								>
																									<div
																										class="input-group-text p-1 px-3 cursor-pointer"
																										v-b-tooltip.hover
																										:title="$t('shadesInfo')"
																									>
																										<i class="fa fa-info"></i>
																									</div>
																								</div>
																								<input
																									type="number"
																									min="4"
																									max="9"
																									class="form-control"
																									placeholder=""
																									v-model="shadesNumber"
																								/>
																								<b-form-input
																									id="shadesNumber-range-1"
																									v-model="shadesNumber"
																									class="form-control"
																									type="range"
																									min="4"
																									max="9"
																									step="1"
																								></b-form-input>
																							</div>
																						</div>
																					</div>
																				</div>
																			</div>
																			<div class="row pb-4">
																				<div class="col-5">
																					<div class="row mx-0">
																						<div
																							class="p-3 border col"
																							v-for="(shade, i) in shades"
																							:key="i"
																							:style="{
																								'background-color': shade,
																							}"
																						></div>
																					</div>
																				</div>
																				<div class="col-7 text-right">
																					<b-button
																						class="black-btn btn-sm mx-1"
																						@click.prevent.stop="
																							applyPalette(levelIndex)
																						"
																						>{{ $t("apply") }}</b-button
																					>
																					<b-button
																						class="black-btn btn-sm mx-1"
																						@click.prevent.stop="
																							applyPalette('all')
																						"
																						>{{ $t("applyAll") }}</b-button
																					>
																				</div>
																			</div>
																			<div class="row pb-4">
																				<div class="col-12">
																					<div
																						class="cursor-pointer text-primary small"
																					>
																						<span
																							@click="showShades = !showShades"
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
																							<div
																								class="row mx-0"
																								v-for="(
																									predefinedShade, i
																								) in predefinedShades"
																								:key="i"
																								:class="
																									predefinedShades.length -
																										1 ===
																									i
																										? ''
																										: 'pb-2'
																								"
																							>
																								<div class="col-5">
																									<div class="row mx-0">
																										<div
																											class="p-3 border col"
																											v-for="(
																												shade, i
																											) in predefinedShade"
																											:key="i"
																											:style="{
																												'background-color':
																													shade,
																											}"
																										></div>
																									</div>
																								</div>
																								<div class="col-7">
																									<b-button
																										class="black-btn btn-sm mx-1"
																										@click.prevent.stop="
																											applyPalette(
																												levelIndex,
																												predefinedShade
																											)
																										"
																										>{{ $t("apply") }}</b-button
																									>
																									<b-button
																										class="black-btn btn-sm mx-1"
																										@click.prevent.stop="
																											applyPalette(
																												'all',
																												predefinedShade
																											)
																										"
																										>{{
																											$t("applyAll")
																										}}</b-button
																									>
																								</div>
																							</div>
																						</div>
																					</transition>
																				</div>
																			</div>
																			<div class="row pb-2">
																				<div class="col-5">
																					{{ $t("autoScaling") }}
																				</div>
																				<div class="col-7">
																					<b-form-checkbox
																						checked="levelScale.isAutoRange"
																						v-model="levelScale.isAutoRange"
																						name="check-button"
																						switch
																						size="lg"
																						@change="
																							autoScaling(
																								levelIndex,
																								indicator.name,
																								levelScale.isAutoRange
																							)
																						"
																					>
																					</b-form-checkbox>
																				</div>
																			</div>
																			<div
																				class="row pb-2"
																				v-for="(
																					scaleRow, scaleIndex
																				) in levelScale.scales"
																				:key="scaleIndex"
																			>
																				<div
																					class="col-sm-4"
																					:class="{
																						'col-sm-6': levelScale.isAutoRange,
																					}"
																				>
																					<input
																						type="text"
																						class="form-control"
																						:placeholder="$t('label')"
																						v-model="
																							levelScale.scales[scaleIndex]
																								.scaleLabel
																						"
																					/>
																				</div>
																				<div
																					class="col-sm-2"
																					:class="{
																						hide: levelScale.isAutoRange,
																					}"
																				>
																					<input
																						type="text"
																						class="form-control"
																						:placeholder="
																							$t('placeholderLowRange')
																						"
																						v-model="
																							levelScale.scales[scaleIndex]
																								.lowScale
																						"
																						:disabled="
																							scaleIndex === 0 &&
																							!levelScale.isAutoRange
																								? false
																								: true
																						"
																						:class="{
																							'border-danger':
																								errorIndex.includes(
																									`low${levelIndex}${scaleIndex}`
																								),
																						}"
																						@change="
																							validateInput(
																								levelIndex,
																								scaleIndex,
																								'low',
																								levelScale.scales[scaleIndex]
																									.lowScale,
																								indicator.name
																							)
																						"
																					/>
																				</div>
																				<div
																					class="col-sm-2"
																					:class="{
																						hide: levelScale.isAutoRange,
																					}"
																				>
																					<input
																						type="text"
																						class="form-control"
																						:placeholder="
																							$t('placeholderHighRange')
																						"
																						v-model="
																							levelScale.scales[scaleIndex]
																								.highScale
																						"
																						:class="{
																							'border-danger':
																								errorIndex.includes(
																									`high${levelIndex}${scaleIndex}`
																								),
																						}"
																						:disabled="levelScale.isAutoRange"
																						@change="
																							validateInput(
																								levelIndex,
																								scaleIndex,
																								'high',
																								levelScale.scales[scaleIndex]
																									.highScale,
																								indicator.name
																							)
																						"
																					/>
																				</div>
																				<div
																					class="input-group col-sm-4"
																					:class="{
																						'col-sm-6': levelScale.isAutoRange,
																					}"
																				>
																					<div class="input-group-prepend">
																						<div class="input-group-text p-1">
																							<input
																								type="color"
																								class=""
																								placeholder=""
																								v-model="
																									levelScale.scales[scaleIndex]
																										.scaleColor
																								"
																							/>
																						</div>
																					</div>
																					<input
																						type="text"
																						class="form-control"
																						placeholder=""
																						v-model="
																							levelScale.scales[scaleIndex]
																								.scaleColor
																						"
																					/>
																				</div>
																			</div>
																			<!-- </p> -->
																			<button
																				@click="addScale(levelIndex)"
																				class="btn black-btn btn-sm btn-secondary mr-2"
																			>
																				{{ $t("addbtn") }}
																			</button>
																			<button
																				v-if="levelScale.scales.length > 4"
																				@click="removeScale(levelIndex)"
																				class="btn black-btn btn-sm btn-secondary"
																			>
																				{{ $t("deletebtn") }}
																			</button>
																		</div>
																	</b-tab>
																</b-tabs>
															</div>
														</div>
													</div>
												</div>
												<div class="text-right mb-3">
													<b-button
														class="black-btn btn-sm"
														@click.prevent.stop="copyTo()"
														>{{ $t("copyTobtn") }}</b-button
													>
													<b-modal
														:id="'copyToModal'"
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
																<span class="small">{{ $t("from") }}</span>
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
																<span class="small">{{ $t("to") }}</span>
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
																<div class="mt-1" style="font-size: 0.6875rem">
																	<strong>{{ $t("note") }}: </strong>
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
																		<b-form-checkbox value="labels">{{
																			$t("labels")
																		}}</b-form-checkbox>
																		<b-form-checkbox value="range">{{
																			$t("range")
																		}}</b-form-checkbox>
																		<b-form-checkbox value="colors">{{
																			$t("colors")
																		}}</b-form-checkbox>
																	</b-form-checkbox-group>
																</b-form-group>
															</div>
															<div class="text-right">
																<b-button
																	class="black-btn btn-sm"
																	@click.prevent.stop="copy()"
																	>{{ $t("copybtn") }}</b-button
																>
															</div>
														</div>
													</b-modal>
												</div>
												<div class="row">
													<div class="col-sm-6">
														<div class="form-group row">
															<label
																for="inputChartSource"
																class="col-sm-3 col-form-label"
																>{{ $t("chartInformation") }}</label
															>
															<div class="col-sm-9" v-if="indicator.chartInfo">
																<b-form-textarea
																	id="inputChartInfo"
																	v-model="indicator.chartInfo"
																	:state="
																		indicator.chartInfo.length !== 0 &&
																		indicator.chartInfo.length <=
																			chartInfoMaxLength
																	"
																	:placeholder="chartInfoPlaceholder"
																	rows="3"
																	:maxlength="chartInfoMaxLength"
																></b-form-textarea>
																<span
																	>{{ indicator.chartInfo.length }}/{{
																		chartInfoMaxLength
																	}}</span
																>
															</div>
															<div class="col-sm-9" v-else>
																<b-form-textarea
																	id="inputChartInfo"
																	v-model="indicator.chartInfo"
																	:placeholder="chartInfoPlaceholder"
																	rows="3"
																	:maxlength="chartInfoMaxLength"
																></b-form-textarea>
															</div>
														</div>
													</div>
													<div class="col-sm-6">
														<div class="form-group row">
															<label class="col-sm-3 col-form-label">{{
																$t("visible")
															}}</label>
															<div class="col-sm-9">
																<b-form-checkbox
																	checked="indicator.visible"
																	v-model="indicator.visible"
																	name="check-button"
																	switch
																	size="lg"
																>
																</b-form-checkbox>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<!--Sub Indicators Mapping-->
										<div class="row m-0 mt-4 mb-2" v-if="indicator.dataMapping">
											<div class="col-12 p-b-15px px-0">
												<div
													class="card-header bg-faint-grey color-black border-radius-0 text-uppercase f-s-0-875rem font-weight-bold"
												>
													{{ $t("dataMapping") }}
												</div>
											</div>
											<!-- <template v-if="false"> -->
											<div
												class="col-12"
												v-for="(subIndicator, ind) in indicator.subIndicator"
												:key="ind"
											>
												<div class="row">
													<div class="col">
														<div class="form-check form-check-inline mr-0 hide">
															<div class="pure-checkbox">
																<input
																	name="checkbox"
																	type="checkbox"
																	:id="'checkbox1' + chartBySubtype + ind"
																/>
																<label
																	:for="'checkbox1' + chartBySubtype + ind"
																></label>
															</div>
														</div>
													</div>
												</div>
												<div class="row my-3">
													<div class="col-lg-12">
														<div>
															<div
																class="card-header bg-faint-grey default-card-border-radius color-black f-s-0-875rem"
															>
																{{ $t("settings") }}
															</div>
															<div
																class="card card-body border-radius-0 indicator-item indicator-bordermain"
																style="
																	border: 1px solid #2f2d55 !important;
																	border-top: 0 !important;
																"
															>
																<div class="row">
																	<div class="col-12">
																		<div
																			class="card-header bg-faint-grey color-black border-radius-0 text-uppercase f-s-0-875rem font-weight-bold"
																			style="border: 1px solid #2f2d55 !important;"
																		>
																			{{
																				$t("indicators_Data_Elements_Mapping")
																			}}
																		</div>
																	</div>
																	
																	<div class="col-12">
																		<div
																class="card-body border-radius-0 indicator-item indicator-bordermain"
																style="
																	border: 1px solid #2f2d55 !important;
																	border-top: 0 !important;
																"
															>
																		<AddMapping
																			:ind="ind"
																			:index="0"
																			dataKey="subIndicator"
																			:metrixList="metrixList"
																			:chartByType="chartByType"
																			:dataSetsList="dataSetsList"
																			:chartBySubtype="chartBySubtype"
																			:indicatorsList="indicatorsList"
																			:dataElementsList="dataElementsList"
																			:key="
																				'add-mapping' +
																				chartBySubtype +
																				ind +
																				chartByType +
																				0
																			"
																			:mappingType="
																				indicator.subIndicator[ind].type
																			"
																			:selectedDE="
																				indicator.subIndicator[ind].selectedDE
																			"
																			@addDE="addDE"
																			@resetDE="resetDE"
																			@deleteDE="deleteDE"
																			v-if="isDataFetched"
																		/>
																	</div>
													</div>				
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
											<!-- </template> -->
										</div>
										<div class="col-sm-12 clearfix">
											<div class="form-group row float-right">
												<b-button
													v-if="updatetableIndicator"
													@click="updateMapGroups('indicator')"
													class="btn-dark"
													>{{ $t("update") }}</b-button
												>
												<b-button
													v-else
													@click="saveMapGroups('indicator')"
													class="btn-dark"
													>{{ $t("savebtn") }}</b-button
												>
												<b-button
													@click="showIndForm = false"
													class="btn-dark ml-4"
													>{{ $t("cancelbtn") }}</b-button
												>
											</div>
										</div>
										<!--Sub Indicators Mapping End-->
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import service from "@/service";
import audit from "../audit.js";
import { randomString } from "@/components/Common/commonFunctions";

export default {
	props: [
		"chartByModule",
		"chartByType",
		"chartBySubtype",
		"defaultLevelID",
		"indicatorsList",
		"dataElementsList",
		"dataSetsList",
		"metrixList",
		"orgList",
		"supportedLanguages",
	],
	data() {
		//console.log(this.orgList)
		let levels = this.orgList
			.filter((item) => {
				if (
					item.level === this.defaultLevelID &&
					item.level === this.orgList.length
				) {
					return item;
				}
				if (item.level >= this.defaultLevelID) {
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
						scaleLabel: this.$i18n.t("low"),
					},
					{
						lowScale: "25",
						highScale: "50",
						scaleColor: "#0000ff",
						scaleLabel: this.$i18n.t("medium"),
					},
					{
						lowScale: "50",
						highScale: "75",
						scaleColor: "#0000ff",
						scaleLabel: this.$i18n.t("high"),
					},
					{
						lowScale: "75",
						highScale: "100",
						scaleColor: "#0000ff",
						scaleLabel: this.$i18n.t("veryHigh"),
					},
				],
			}))
			.sort((a, b) => {
				return a.level < b.level ? -1 : a.level == b.level ? 0 : 1;
			});
		// console.log(levels)
		return {
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
			showIndForm: false,
			showGrpForm: false,
			showSubForm: false,
			chartInfoMaxLength: 200,
			indicators: [],
			indicator: {
				id: randomString(16),
				groupId: "",
				subGroupId: "",
				name: "Indicator 1",
				key: "anchorMap",
				source: "",
				levels: levels,
				visible: true,
				chartInfo: "",
				dataMapping: true,
				subIndicator: [
					{
						de: [],
						name: [],
						selectedDE: [],
						color: "#0000ff",
						type: "indicator",
						key: "anchorMap",
						static_name: ["Indicator 1"],
					},
				],
				static_name: "Indicator 1",
				methodType: "Short Term",
			},
			updatetableflag: false,
			updatetablesubGroup: false,
			updatetableIndicator: false,
			updatetableflagfor1entry: false,
			searchGroupName: "",
			searchSubGroupName: "",
			searchIndicatorName: "",
			levels: levels,
			errorIndex: [],
			perPage: 2,
			currentPage: 1,
			groupsLen: "",
			subperPage: 2,
			subcurrentPage: 1,
			subGroupsLen: "",
			indperPage: 10,
			indcurrentPage: 1,
			indGroupsLen: "",
			subGroups: [],
			groups: [],
			groupDetails: {
				id: randomString(16),
				name: "",
				description: "",
				subGroups: [],
				visible: true,
			},
			subGroupDetails: {
				id: randomString(16),
				name: "",
				description: "",
				groupId: "",
				indicators: [],
				visible: true,
			},
			levelsSelect: [],
			selectedLevel: null,
			selectedTreeLevel: [],
			copyLevels: [],
			selectedCopyOption: [],
			oSubgroupData: null,
			oIndicatorData: null,
			errorIndicator: [],
			originalData: null,
			isDataFetched: false,
		};
	},
	components: {
		SyncMapping: () =>
			import(
				/* webpackChunkName: "admin_SyncMapping"*/ "@/components/config/SyncMapping"
			),
		AddMapping: () =>
			import(
				/* webpackChunkName: "admin_AddMapping"*/ "@/components/config/AddMapping"
			),
	},
	watch: {},
	computed: {
		nameState() {
			return this.groupDetails.name.length > 2 ? true : false;
		},
		descState() {
			return this.groupDetails.description.length > 5 ? true : false;
		},
		subnameState() {
			return this.subGroupDetails.name.length > 2 ? true : false;
		},
		subdescState() {
			return this.subGroupDetails.description.length > 5 ? true : false;
		},
		chartInfoPlaceholder: function () {
			return this.$i18n.t("placeholderMaxValue", {
				number: this.chartInfoMaxLength,
			});
		},
		levelsTreeSelect: function () {
			return this.levelsSelect.filter((l) => l.value !== this.selectedLevel);
		},
		filteredGroups() {
			let filteredGroups = this.groups.filter((group) => {
				return group.name
					.toLowerCase()
					.includes(this.searchGroupName.toLowerCase());
			});
			this.groupsLen = filteredGroups.length;
			return filteredGroups.slice(
				(this.currentPage - 1) * this.perPage,
				this.currentPage * this.perPage
			);
		},
		filteredSubGroups() {
			let filteredSub;
			let subArr = [];
			this.groups.forEach((g) => {
				g.subGroups.forEach((sub) => {
					let obj = {
						groupName: g.name,
						subName: sub.name,
						id: sub.id,
					};
					subArr.push(obj);
				});
			});

			filteredSub = subArr.filter(
				(a) =>
					(a.groupName &&
						a.groupName
							.toLowerCase()
							.includes(this.searchSubGroupName.toLowerCase())) ||
					(a.subName &&
						a.subName
							.toLowerCase()
							.includes(this.searchSubGroupName.toLowerCase()))
			);
			this.subGroupsLen = filteredSub.length;
			return filteredSub.slice(
				(this.subcurrentPage - 1) * this.subperPage,
				this.subcurrentPage * this.subperPage
			);
		},
		filteredIndicators() {
			let filteredInd;
			let subArr = [];
			this.groups.forEach((g) => {
				g.subGroups.forEach((sub) => {
					sub.indicators.forEach((ind) => {
						let obj = {
							groupName: g.name,
							subName: sub.name,
							indName: ind.name,
							id: ind.id,
						};
						subArr.push(obj);
					});
				});
			});

			filteredInd = subArr.filter(
				(a) =>
					(a.groupName &&
						a.groupName
							.toLowerCase()
							.includes(this.searchIndicatorName.toLowerCase())) ||
					(a.subName &&
						a.subName
							.toLowerCase()
							.includes(this.searchIndicatorName.toLowerCase())) ||
					(a.indName &&
						a.indName
							.toLowerCase()
							.includes(this.searchIndicatorName.toLowerCase()))
			);
			this.indGroupsLen = filteredInd.length;
			return filteredInd.slice(
				(this.indcurrentPage - 1) * this.indperPage,
				this.indcurrentPage * this.indperPage
			);
		},
		shades: function () {
			let shades = [this.paletteColor],
				color = this.paletteColor;
			for (let i = 1; i < this.shadesNumber; i++) {
				color = this.adjust(color, this.percentageLight * 1);
				// console.log("color", i, color)
				shades.push(color);
			}
			shades = this.percentageLight * 1 < 0 ? shades : shades.reverse();
			return shades;
		},
	},
	methods: {
		syncMapping(selectedLocaleToCopy) {
			// console.log(selectedLocaleToCopy)
			this.$store.state.loading = true;
			let key = this.generateKey(
				"mapVisualization",
				true,
				true,
				selectedLocaleToCopy
			);

			let response = service.getSavedConfig(key);
			response
				.then((response) => {
					let data = response.data.mapGroups,
						updatedData = [];

					// console.log("this.groups", this.groups)
					// console.log("data", data)
					data.forEach((d) => {
						let isGroup = this.groups.find((g) => g.id === d.id);
						if (!isGroup) {
							updatedData.push(d);
						} else {
							// console.log("isGroup", isGroup)
							// console.log("d", d)
							let updatedGroup = {
								...isGroup,
								subGroups: [],
								visible: d.visible,
							};
							d.subGroups.forEach((ds) => {
								let isSubGroup = isGroup.subGroups.find(
									(sg) => sg.id === ds.id
								);
								if (!isSubGroup) {
									updatedGroup.subGroups.push(ds);
								} else {
									let updatedSubGroup = {
										...isSubGroup,
										indicators: [],
										visible: ds.visible,
									};
									ds.indicators.forEach((di) => {
										let isIndicator = isSubGroup.indicators.find(
											(si) => si.id === di.id
										);
										if (!isIndicator) {
											updatedSubGroup.indicators.push(di);
										} else {
											let updatedIndicator = {
												...isIndicator,
												levels: [],
												subIndicator: [],
												visible: di.visible,
											};
											di.levels.forEach((dl) => {
												let isLevel = isIndicator.levels.find(
													(ssl) => ssl.level === dl.level
												);
												if (!isLevel) {
													updatedIndicator.levels.push(dl);
												} else {
													let updatedLevel = {
														...isLevel,
														scales: [],
														isAutoRange: dl.isAutoRange,
													};
													dl.scales.forEach((sds, i) => {
														if (isLevel.scales[i]) {
															updatedLevel.scales.push({
																lowScale: sds.lowScale,
																highScale: sds.highScale,
																scaleColor: sds.scaleColor,
																scaleLabel: isLevel.scales[i].scaleLabel,
															});
														} else {
															updatedLevel.scales.push(sds);
														}
													});
													updatedIndicator.levels.push(updatedLevel);
												}
											});
											di.subIndicator.forEach((dsi) => {
												let isSubIndicator = isIndicator.subIndicator.find(
													(ssi) => ssi.id === dsi.id
												);
												if (!isSubIndicator) {
													updatedIndicator.subIndicator.push(dsi);
												} else {
													let updatedSubIndicator = {
														...isSubIndicator,
														color: dsi.color,
														de: dsi.de,
														selectedDE: dsi.selectedDE,
														type: dsi.type,
													};
													updatedIndicator.subIndicator.push(
														updatedSubIndicator
													);
												}
											});
											updatedSubGroup.indicators.push(updatedIndicator);
										}
									});
									updatedGroup.subGroups.push(updatedSubGroup);
								}
							});
							updatedData.push(updatedGroup);
						}
					});
					// console.log("updatedData", updatedData)
					this.groups = updatedData;
					this.$store.state.loading = false;
					if (this.$refs.syncMapping) {
						this.$refs.syncMapping.syncMappingModal();
					}
					this.$nextTick(() => {
						this.updateConfigData();
					});
				})
				.catch(() => {
					this.$store.state.loading = false;
					if (this.$refs.syncMapping) {
						this.$refs.syncMapping.syncMappingModal();
					}
					this.$swal({
						title: this.$i18n.t("error"),
						text: this.$i18n.t("somethingwentwrong"),
					});
				});
		},
		adjust(color, amount) {
			// console.log("color :: ",color," & amount :: ",amount)
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
		applyPalette(levelIndex = "all", predefinedShade = null) {
			let colors = predefinedShade ? predefinedShade : this.shades;
			// console.log("this.shades",this.shades)
			this.indicator = {
				...this.indicator,
				levels: this.indicator.levels.map((level, j) => {
					if (levelIndex !== "all") {
						if (j === levelIndex) {
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
			};
		},
		addScale(levelIndex) {
			this.indicator.levels.forEach((level, i) => {
				let scale = level.scales[level.scales.length - 1];
				if (levelIndex == i) {
					level.scales.push({
						highScale: Number(scale.highScale) + 25,
						lowScale: Number(scale.highScale),
						scaleColor: "#0000ff",
						scaleLabel: this.$i18n.t("veryHigh"),
					});
				}
			});
		},
		removeScale(levelIndex) {
			this.indicator.levels.forEach((level, i) => {
				if (levelIndex == i) {
					level.scales.splice(-1, 1);
				}
			});
		},
		copyTo() {
			// console.log(this.mapData[index])
			this.levelsSelect = this.indicator.levels.map((l) => ({
				text: l.levelName,
				value: l.level,
			}));
			this.copyLevels = this.indicator.levels;
			this.selectedLevel = null;
			this.selectedTreeLevel = [];
			this.selectedCopyOption = [];
			this.$nextTick(() => {
				this.$bvModal.show("copyToModal");
			});
		},
		copy() {
			// console.log(this.mapData[index])
			let mData = JSON.parse(JSON.stringify(this.indicator));
			let levels = mData.levels,
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
						s = {
							...s,
							scaleLabel: sourceLevel[0].scales[j].scaleLabel,
						};
					}
					if (this.selectedCopyOption.includes("range")) {
						s = {
							...s,
							highScale: sourceLevel[0].scales[j].highScale,
							lowScale: sourceLevel[0].scales[j].lowScale,
						};
					}
					if (this.selectedCopyOption.includes("colors")) {
						s = {
							...s,
							scaleColor: sourceLevel[0].scales[j].scaleColor,
						};
					}
					updatedScale[j] = s;
				});
				updatedTargetLevels.push({
					...t,
					scales: updatedScale,
				});
			});
			let finalLevels = [...pendingLevel, ...updatedTargetLevels].sort(
				(a, b) => {
					return a.level < b.level ? -1 : a.level == b.level ? 0 : 1;
				}
			);
			this.indicator.levels = finalLevels;
			this.$nextTick(() => {
				this.$bvModal.hide("copyToModal");
			});
		},
		edittableGroup() {
			this.updatetableflag = false;
			this.showGrpForm = true;
			this.groupDetails = {
				id: randomString(16),
				name: "",
				description: "",
				subGroups: [],
				visible: true,
			};
		},
		editableSubGroup() {
			this.updatetablesubGroup = false;
			this.showSubForm = true;
			this.subGroupDetails = {
				id: randomString(16),
				name: "",
				description: "",
				groupId: "",
				indicators: [],
				visible: true,
			};
		},
		editableIndicator() {
			this.updatetableIndicator = false;
			this.showIndForm = true;
			this.indicator = {
				id: randomString(16),
				groupId: "",
				subGroupId: "",
				name: "Indicator 1",
				key: "anchorMap",
				source: "",
				levels: this.levels,
				visible: true,
				chartInfo: "",
				dataMapping: true,
				subIndicator: [
					{
						de: [],
						name: [],
						selectedDE: [],
						color: "#0000ff",
						type: "indicator",
						key: "anchorMap",
						static_name: ["Indicator 1"],
					},
				],
				static_name: "Indicator 1",
				methodType: "Short Term",
			};
			// console.log(this.levels)
		},
		editGroup(type, id) {
			if (type == "mapGroups") {
				this.showGrpForm = true;
				this.updatetableflag = true;
				this.groups.forEach((ele) => {
					if (ele.id == id) {
						// console.log(ele)
						this.groupDetails = JSON.parse(JSON.stringify(ele));
					}
				});
			} else if (type == "subGroups") {
				this.showSubForm = true;
				this.updatetablesubGroup = true;
				this.groups.forEach((ele) => {
					ele.subGroups.forEach((sub) => {
						if (sub.id == id) {
							// console.log(sub)
							this.subGroupDetails = JSON.parse(JSON.stringify(sub));
							this.oSubgroupData = JSON.parse(JSON.stringify(sub));
						}
					});
				});
			} else if (type == "indicator") {
				this.showIndForm = false;
				this.updatetableIndicator = true;
				this.groups.forEach((ele) => {
					ele.subGroups.forEach((sub) => {
						sub.indicators.forEach((ind) => {
							if (ind.id == id) {
								this.indicator = JSON.parse(JSON.stringify(ind));
								this.oIndicatorData = JSON.parse(JSON.stringify(ind));
							}
						});
					});
				});
				this.$nextTick(() => {
					this.showIndForm = true;
				});
			}
		},
		deleteGroup(type, id) {
			this.$store.state.loading = true;
			let dataStore = {};
			let key = this.generateKey("mapVisualization");

			let allKeys = service.getAllKeys();
			allKeys.then((keys) => {
				if (keys.data.includes(key)) {
					let oConfig = service.getSavedConfig(key);
					oConfig.then((response) => {
						this.$store.state.loading = false;
						let oResponse = response.data;
						if (type == "mapGroups") {
							this.$swal({
								title: this.$i18n.t("areyousure"),
								text: this.$i18n.t("youablerevertthis"),
								showCancelButton: true,
								confirmButtonText: this.$i18n.t("yes_delete_it"),
							}).then((result) => {
								// <--
								if (result.value) {
									// <-- if confirmed
									oResponse["mapGroups"].forEach((ele, i) => {
										if (ele.id == id) {
											// console.log(ele.id, i)
											if (i > -1) {
												oResponse["mapGroups"].splice(i, 1);
											}
										}
									});
									let newresponse = service.updateConfig(oResponse, key);
									newresponse
										.then((response) => {
											if (response.data.status === "OK") {
												//console.log(response.data)
												this.$swal({
													title: this.$i18n.t("groupDeleted"),
												});
												this.getSavedConfig();
											} else {
												this.$swal({
													title: this.$i18n.t("error"),
													text: `${response.data.message}`,
												});
												return;
											}
										})
										.catch((error) => {
											console.log(error);
											this.$swal({
												title: this.$i18n.t("error"),
											});
											return;
										});
								}
							});
						} else if (type == "subGroups") {
							this.$swal({
								title: this.$i18n.t("areyousure"),
								text: this.$i18n.t("youablerevertthis"),
								showCancelButton: true,
								confirmButtonText: this.$i18n.t("yes_delete_it"),
							}).then((result) => {
								// <--
								if (result.value) {
									oResponse["mapGroups"].forEach((ele) => {
										ele.subGroups.forEach((sub, i) => {
											if (sub.id == id) {
												if (i > -1) {
													ele.subGroups.splice(i, 1);
												}
											}
										});
									});
									let newresponse = service.updateConfig(oResponse, key);
									newresponse
										.then((response) => {
											if (response.data.status === "OK") {
												//console.log(response.data)
												this.$swal({
													title: this.$i18n.t("subGroupDeleted"),
												});
												this.getSavedConfig();
											} else {
												this.$swal({
													title: this.$i18n.t("error"),
													text: `${response.data.message}`,
												});
												return;
											}
										})
										.catch((error) => {
											console.log(error);
											this.$swal({
												title: this.$i18n.t("error"),
											});
											return;
										});
								}
							});
						} else if (type == "indicator") {
							this.$swal({
								title: this.$i18n.t("areyousure"),
								text: this.$i18n.t("youablerevertthis"),
								showCancelButton: true,
								confirmButtonText: this.$i18n.t("yes_delete_it"),
							}).then((result) => {
								// <--
								if (result.value) {
									oResponse["mapGroups"].forEach((ele) => {
										ele.subGroups.forEach((sub) => {
											sub.indicators.forEach((ind, i) => {
												if (ind.id == id) {
													if (i > -1) {
														sub.indicators.splice(i, 1);
													}
												}
											});
										});
									});
									let newresponse = service.updateConfig(oResponse, key);
									newresponse
										.then((response) => {
											if (response.data.status === "OK") {
												//console.log(response.data)
												this.$swal({
													title: this.$i18n.t("indicatorDeleted"),
												});
												this.getSavedConfig();
											} else {
												this.$swal({
													title: this.$i18n.t("error"),
													text: `${response.data.message}`,
												});
												return;
											}
										})
										.catch((error) => {
											console.log(error);
											this.$swal({
												title: this.$i18n.t("error"),
											});
											return;
										});
								}
							});
						}
					});
				}
			});
		},
		getSavedConfig() {
			let key = this.generateKey("mapVisualization");

			let oConfig = service.getSavedConfig(key);
			oConfig
				.then((response) => {
					let oResponse = response.data;
					if (oResponse.mapGroups) {
						this.groups = oResponse.mapGroups;
						this.originalData = JSON.parse(JSON.stringify(oResponse.mapGroups));
					} else {
						oResponse.mapGroups = [];
					}
					this.isDataFetched = true;
					this.$store.state.loading = false;
				})
				.catch(() => {
					this.isDataFetched = true;
					this.$store.state.loading = false;
				});
		},
		updateMapGroups(type) {
			this.$store.state.loading = true;
			let dataStore = {};
			let key = this.generateKey("mapVisualization");

			let allKeys = service.getAllKeys();
			allKeys.then((keys) => {
				if (keys.data.includes(key)) {
					let oConfig = service.getSavedConfig(key);
					oConfig.then((response) => {
						let oResponse = response.data;
						if (type == "mapGroups") {
							oResponse["mapGroups"].forEach((ele) => {
								if (ele.id == this.groupDetails.id) {
									ele.name = this.groupDetails.name;
									ele.description = this.groupDetails.description;
									ele.visible = this.groupDetails.visible;
								}
							});
						} else if (type == "subGroups") {
							// console.log(this.oSubgroupData)
							oResponse["mapGroups"].forEach((ele) => {
								ele.subGroups.forEach((sub, i) => {
									if (sub.id == this.oSubgroupData.id) {
										if (i > -1) {
											ele.subGroups.splice(i, 1);
										}
									}
								});
							});
							oResponse["mapGroups"].forEach((ele) => {
								if (ele.id == this.subGroupDetails.groupId) {
									ele.subGroups.push(this.subGroupDetails);
								}
							});
						} else if (type == "indicator") {
							// console.log(this.oIndicatorData)
							// console.log(this.indicator)
							oResponse["mapGroups"].forEach((ele) => {
								ele.subGroups.forEach((sub) => {
									sub.indicators.forEach((ind, i) => {
										if (ind.id == this.oIndicatorData.id) {
											if (i > -1) {
												sub.indicators.splice(i, 1);
											}
										}
									});
								});
							});
							oResponse["mapGroups"].forEach((ele) => {
								if (ele.id == this.indicator.groupId) {
									ele.subGroups.forEach((sub) => {
										if (sub.id == this.indicator.subGroupId) {
											sub.indicators.push(this.indicator);
										}
									});
								}
							});
						}
						//console.log(oResponse)

						let configChanges = audit.configAudit(
							this.originalData,
							oResponse.mapGroups
						);
						// console.log("configChanges", configChanges)
						let newresponse = service.updateConfig(oResponse, key);
						newresponse
							.then((response) => {
								if (response.data.status === "OK") {
									//console.log(response.data)
									this.showIndForm = false;
									this.showGrpForm = false;
									this.showSubForm = false;
									this.$swal({
										title: this.$i18n.t("data_saved_successfully"),
									}).then(() => {
										if (Object.keys(configChanges).length) {
											audit.processAudit("process1", key, configChanges);
										}
									});
									this.getSavedConfig();
									this.groupDetails = {
										id: randomString(16),
										name: "",
										description: "",
										subGroups: [],
									};
									this.subGroupDetails = {
										id: randomString(16),
										name: "",
										description: "",
										groupId: "",
										indicators: [],
									};
									this.indicator = {
										id: randomString(16),
										groupId: "",
										subGroupId: "",
										name: "Indicator 1",
										key: "anchorMap",
										source: "",
										levels: this.levels,
										visible: true,
										chartInfo: "",
										dataMapping: true,
										subIndicator: [
											{
												de: [],
												name: [],
												selectedDE: [],
												color: "#0000ff",
												type: "indicator",
												key: "anchorMap",
												static_name: ["Indicator 1"],
											},
										],
										static_name: "Indicator 1",
										methodType: "Short Term",
									};
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
							.catch((error) => {
								// console.log(error)
								this.$swal({
									title: this.$i18n.t("error"),
								});

								this.$store.state.loading = false;
								return;
							});
					});
				} else {
					if (type == "mapGroups") {
						dataStore = {
							mapGroups: this.groups,
						};
					}
					service.saveConfig(dataStore, key);
					this.$store.state.loading = false;
				}
			});
		},
		updateConfigData() {
			this.$store.state.loading = true;
			let dataStore = {
				mapGroups: this.groups,
			};
			let key = this.generateKey("mapVisualization");

			let newresponse = service.updateConfig(dataStore, key);
			newresponse
				.then((response) => {
					if (response.data.status === "OK") {
						//console.log(response.data)
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
				})
				.catch((error) => {
					// console.log(error)
					this.$swal({
						title: this.$i18n.t("error"),
					});
					this.$store.state.loading = false;
					return;
				});
		},
		saveMapGroups(type) {
			this.$store.state.loading = true;
			let dataStore = {};
			let key = this.generateKey("mapVisualization");

			let allKeys = service.getAllKeys();
			allKeys.then((keys) => {
				if (keys.data.includes(key)) {
					let oConfig = service.getSavedConfig(key);
					oConfig.then((response) => {
						let oResponse = response.data;
						if (type == "mapGroups") {
							this.groups.push(this.groupDetails);
							oResponse[type] = this.groups;
						} else if (type == "subGroups") {
							let groupId = this.subGroupDetails.groupId;
							oResponse["mapGroups"].forEach((ele) => {
								if (ele.id == groupId) {
									if (typeof ele["subGroups"] !== "undefined") {
										ele["subGroups"].push(this.subGroupDetails);
									} else {
										ele["subGroups"] = [this.subGroupDetails];
									}
								}
							});
						} else if (type == "indicator") {
							let groupId = this.indicator.groupId;
							//console.log(this.indicator)
							oResponse["mapGroups"].forEach((ele) => {
								if (ele.id == groupId) {
									ele.subGroups.forEach((ind) => {
										if (ind.id == this.indicator.subGroupId) {
											if (typeof ind["indicators"] !== "undefined") {
												ind["indicators"].push(this.indicator);
											} else {
												ind["indicators"] = [this.indicator];
											}
										}
									});
								}
							});
						}
						let newresponse = service.updateConfig(oResponse, key);
						newresponse
							.then((response) => {
								if (response.data.status === "OK") {
									//console.log(response.data)
									this.showIndForm = false;
									this.showGrpForm = false;
									this.showSubForm = false;
									this.$swal({
										title: this.$i18n.t("data_saved_successfully"),
									});
									this.getSavedConfig();
									this.groupDetails = {
										id: randomString(16),
										name: "",
										description: "",
										subGroups: [],
									};
									this.subGroupDetails = {
										id: randomString(16),
										name: "",
										description: "",
										groupId: "",
										indicators: [],
									};
									this.indicator = {
										id: randomString(16),
										groupId: "",
										subGroupId: "",
										name: "Indicator 1",
										key: "anchorMap",
										source: "",
										levels: this.levels,
										visible: true,
										chartInfo: "",
										dataMapping: true,
										subIndicator: [
											{
												de: [],
												name: [],
												selectedDE: [],
												color: "#0000ff",
												type: "indicator",
												key: "anchorMap",
												static_name: ["Indicator 1"],
											},
										],
										static_name: "Indicator 1",
										methodType: "Short Term",
									};
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
							.catch((error) => {
								// console.log(error)
								this.$swal({
									title: this.$i18n.t("error"),
								});

								this.$store.state.loading = false;
								return;
							});
					});
				} else {
					if (type == "mapGroups") {
						dataStore = {
							mapGroups: this.groups,
						};
					}
					service.saveConfig(dataStore, key);
					this.$store.state.loading = false;
				}
			});
		},
		autoScaling(levelIndex, indicatorName, isAutoRange) {
			if (!isAutoRange) {
				let originalScale = [
					{
						lowScale: "0",
						highScale: "25",
					},
					{
						lowScale: "25",
						highScale: "50",
					},
					{
						lowScale: "50",
						highScale: "75",
					},
					{
						lowScale: "75",
						highScale: "100",
					},
				];
				this.indicator.levels[levelIndex].scales = this.indicator.levels[
					levelIndex
				].scales.map((s, i) => {
					this.removeIndexes(levelIndex, i, "low", indicatorName);
					this.removeIndexes(levelIndex, i, "high", indicatorName);
					// console.log({...s, ...originalScale[i]})
					return {
						...s,
						...originalScale[i],
					};
				});
			}
		},
		addIndexes(levelIndex, scaleIndex, scaleType, indicatorName) {
			this.errorIndex.push(`${scaleType}${levelIndex}${scaleIndex}`);
			this.errorIndicator.push(indicatorName);
		},
		removeIndexes(levelIndex, scaleIndex, scaleType, indicatorName) {
			let ind = this.errorIndex.indexOf(
				`${scaleType}${levelIndex}${scaleIndex}`
			);
			if (ind > -1) {
				this.errorIndex.splice(ind, 1);
			}

			let ind1 = this.errorIndicator.indexOf(indicatorName);
			if (ind1 > -1) {
				this.errorIndicator.splice(ind1, 1);
			}
			// console.log(this.errorIndex)
		},
		validateInput(levelIndex, scaleIndex, scaleType, value, indicatorName) {
			if (value) {
				let scaleObj = this.indicator.levels[levelIndex].scales[scaleIndex];
				let len = this.indicator.levels[levelIndex].scales.length;
				let indName = Array.isArray(indicatorName)
					? indicatorName[0]
					: indicatorName;
				if (scaleType === "low") {
					if (value > scaleObj.highScale) {
						this.addIndexes(levelIndex, scaleIndex, scaleType, indName);
					} else {
						this.removeIndexes(levelIndex, scaleIndex, scaleType, indName);
					}
				} else {
					if (value < scaleObj.lowScale * 1) {
						this.addIndexes(levelIndex, scaleIndex, scaleType, indName);
					} else {
						this.removeIndexes(levelIndex, scaleIndex, scaleType, indName);
						if (scaleIndex !== len - 1) {
							this.indicator.levels[levelIndex].scales[
								`${scaleIndex + 1}`
							].lowScale = value;
							if (
								this.indicator.levels[levelIndex].scales[`${scaleIndex + 1}`]
									.highScale *
									1 <
								value * 1
							) {
								this.addIndexes(
									levelIndex,
									`${scaleIndex + 1}`,
									scaleType,
									indName
								);
							} else {
								this.removeIndexes(
									levelIndex,
									`${scaleIndex + 1}`,
									scaleType,
									indName
								);
							}
						}
					}
				}
			}
		},
		//Delete specific mapping
		deleteDE({ ind, deIndex, dataKey }) {
			this.indicator[dataKey][ind].selectedDE.splice(deIndex, 1);
			this.indicator[dataKey][ind].de.splice(deIndex, 1);
		},
		//Reset the mapping
		resetDE({ ind, dataKey }) {
			this.indicator[dataKey][ind].de = [];
			this.indicator[dataKey][ind].selectedDE = [];
		},
		//Store the selected mapping in configuration object
		addDE({ ind, type, selectedDataSource, dataKey }) {
			this.indicator[dataKey][ind].type = type;
			this.indicator[dataKey][ind].selectedDE.push(selectedDataSource);
			this.indicator[dataKey][ind].de.push(selectedDataSource.id);
		},
	},
	created() {
		this.$store.state.loading = true;
		this.getSavedConfig();
	},
};
</script>
<style lang="scss" scoped>
.table thead tr th {
	position: sticky;
	top: -1px;
	z-index: 2;
}
</style>
