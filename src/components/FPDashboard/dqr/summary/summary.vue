<template>
	<div class="row">
		<div class="col-lg-12">
			<div class="tab-content" id="myTabContent">
				<div
					class="tab-pane fade show active"
					id="dqrSummary"
					role="tabpanel"
					aria-labelledby="dqrSummary-tab"
				>
					<div class="row dqrSummaryrow" ref="dqrSummary">
						<div class="col-12 px-4">
							<div
								class="card px-4 position-relative dqrsummarycard shadow-sm border-t-l-radius-10px border-t-r-radius-10px border-none summarysubcardqr"
							>
								<loader class="cardLoader" v-if="showLoader" />
								<div
									class="card-header pb-4 pl-0  text-decoration-none border-t-l-radius-10px border-t-r-radius-10px"
								>
									<div class="row no-gutters">
										<div class="col p-t-4px">
											<div class="dqr-title truncate fs-19-1920">
												{{ $t("dqr_overView") }}
												{{ selectedDate ? `, ${selectedDate}` : "" }}
											</div>
										</div>
									</div>
								</div>
								<div
									class="card-body dqurcard-body1 border-b-l-radius-10px border-b-r-radius-10px dqrSummaryContainer mt-0"
									style="background: rgb(255, 255, 255)"
								>
									<div>
										<div class="row no-gutters">
											<div class="col-12 text-right small">
												<span
													v-if="scorecardDataFetching"
													class="mr-3 fs-19-1920"
													><strong>{{ $t("note") }}:</strong>
													{{ $t("scorecardInfo") }}</span
												>
												<b-button
													small
													@click.prevent.stop="generateScore"
													class="position-relative"
													v-if="!scorecardGenerated"
												>
													<span
														class="small fs-19-1920"
														v-if="scorecardDataFetching"
														>{{ locationFetchedPercent }}%</span
													>
													<div
														class="loaderBackground"
														v-if="scorecardDataFetching"
													></div>
													<span
														class="small fs-25-1920"
														:class="{ 'ml-2': scorecardDataFetching }"
														>{{
															scorecardDataFetching
																? $t("scorecardGenerating")
																: $t("scorecardGenerate")
														}}</span
													>
												</b-button>
												<b-button
													small
													@click.prevent.stop="viewScorecard"
													class="position-relative scoreBtn"
													v-else
												>
													<span class="small">{{ $t("viewScorecard") }}</span>
												</b-button>
												<b-button
													small
													@click.prevent.stop="cancelScorecard"
													class="position-relative ml-3"
													v-if="scorecardDataFetching"
												>
													<span class="small">{{ $t("cancelbtn") }}</span>
												</b-button>
											</div>
											<div class="col-6">
												<div class="quality-text py-4 fs-17-1920">
													{{
														$t("dqr_summary", {
															date: `${selectedDate}`,
														})
													}}
												</div>
											</div>
											<div class="col-4">
												<div class="mt-4">
													<highcharts
														class="m-auto speedometer-eg"
														:options="chartconfig"
														style="height: 150px"
													></highcharts>
												</div>
											</div>
											<div
												class="col-2 text-center"
												style="
													display: flex;
													justify-content: start;
													align-items: center;
													flex-direction: column;
													padding-top:20px;
												"
											>
												<h4
													class="mb-0 scoretitle"
												>
													{{ $t("dqrScore") }}
												</h4>
												<p
													class="mb-0 totalscore fs-25-1920"
													style="font-size: 2rem"
												>
													{{ chartValue }}/{{ chartMaxLimit }}
												</p>
											</div>
										</div>
										<div class="row dashboardchart-container dqr-maincard p-b-20px">
											<div class="col-4">
												<div
													class="m-t-20px bg-transparent border-none shadow-sm border-t-l-radius-10px border-t-r-radius-10px summarysubcardqr"
												>
													<div
														class="p-10px text-decoration-none border-t-l-radius-10px border-t-r-radius-10px"
													>
														<div class="row no-gutters">
															<div class="col p-t-4px">
																<div class="dqr-title truncate fs-19-1920">
																	{{ $t("compTime") }}
																</div>
															</div>
														</div>
													</div>
													<div
														class="card-body colBoxtext border-b-l-radius-10px border-b-r-radius-10px px-2 py-3"
													>
														<div
															class="row mx-0 dqr-card1"
															:style="{ height: matchHeight + 'px' }"
														>
															<div class="col-12 p-0">
																<i
																	class="fa fa-circle mr-3"
																	:class="[
																		rrCompleteness.value
																			? 'color-green'
																			: 'color-red',
																	]"
																	v-b-popover.hover="{
																		variant: 'info',
																		content: $t('rr_hover', {
																			date: selectedDate
																				? '(' + selectedDate + ')'
																				: '',
																			plotLines: plotLines
																				? '(' + plotLines + '%)'
																				: '',
																		}),
																		title: $t('completenessfp_rr'),
																		html: true,
																	}"
																></i>
																<span
																	class="cursor-pointer fs-17-1920"
																	@click.stop.prevent="
																		goto('reportingRate', 'reportingActual')
																	"
																	>{{ $t("completenessfp_rr") }}</span
																>
															</div>
															<div class="col-12 p-0">
																<i
																	class="fa fa-circle mr-3"
																	:class="[
																		rrTimeliness.value
																			? 'color-green'
																			: 'color-red',
																	]"
																	v-b-popover.hover="{
																		variant: 'info',
																		content: $t('rr_hover', {
																			date: selectedDate
																				? '(' + selectedDate + ')'
																				: '',
																			plotLines: plotLines
																				? '(' + plotLines + '%)'
																				: '',
																		}),
																		title: $t('timelines_rr'),
																		html: true,
																	}"
																></i>
																<span
																	class="cursor-pointer fs-17-1920"
																	@click.stop.prevent="
																		goto('reportingRate', 'reportingOnTime')
																	"
																	>{{ $t("timelines_rr") }}</span
																>
															</div>
														</div>
													</div>
												</div>
											</div>
											<div class="col-4">
												<div
													class="card m-t-20px shadow-sm border-t-l-radius-10px border-t-r-radius-10px border-none summarysubcardqr"
												>
													<div
														class="p-10px text-decoration-none border-t-l-radius-10px border-t-r-radius-10px"
													>
														<div class="row no-gutters">
															<div class="col p-t-4px">
																<div class="dqr-title truncate fs-19-1920">
																	{{ $t("in_Consistency") }}
																</div>
															</div>
														</div>
													</div>
													<div
														class="card-body colBoxtext border-b-l-radius-10px border-b-r-radius-10px px-2 py-3"
													>
														<div
															class="row mx-0 dqr-card2"
															:style="{ height: matchHeight + 'px' }"
														>
															<div class="col-12 p-0" v-if="!disabledTabs.IC1">
																<i
																	class="fa fa-circle mr-3"
																	:class="[
																		icAggregate.value
																			? 'color-green'
																			: 'color-red',
																	]"
																	v-b-popover.hover="{
																		variant: 'info',
																		content: $t('ic_hover', {
																			date: selectedDate
																				? '(' + selectedDate + ')'
																				: '',
																			standardDeviation: standardDeviation,
																		}),
																		title: $t('internalConsistency_tab1'),
																		html: true,
																	}"
																></i>
																<span
																	class="cursor-pointer fs-17-1920"
																	@click.stop.prevent="
																		goto('internal_validations', 'Aggregate')
																	"
																	>{{ $t("internalConsistency_tab1") }}</span
																>
															</div>
															<div class="col-12 p-0" v-if="!disabledTabs.IC2">
																<i
																	class="fa fa-circle mr-3"
																	:class="[
																		icMethod.value
																			? 'color-green'
																			: 'color-red',
																	]"
																	v-b-popover.hover="{
																		variant: 'info',
																		content: $t('ic_hover', {
																			date: selectedDate
																				? '(' + selectedDate + ')'
																				: '',
																			standardDeviation: standardDeviation,
																		}),
																		title: $t('internalConsistency_tab2'),
																		html: true,
																	}"
																></i>
																<span
																	class="cursor-pointer fs-17-1920"
																	@click.stop.prevent="
																		goto('internal_validations', 'Method')
																	"
																	>{{ $t("internalConsistency_tab2") }}</span
																>
															</div>
														</div>
													</div>
												</div>
											</div>
											<div class="col-4">
												<div
													class="m-t-20px bg-transparent border-none shadow-sm border-t-l-radius-10px border-t-r-radius-10px summarysubcardqr"
												>
													<div
														class="p-10px text-decoration-none border-t-l-radius-10px border-t-r-radius-10px"
													>
														<div class="row no-gutters">
															<div class="col p-t-4px">
																<div class="dqr-title truncate fs-19-1920">
																	{{ $t("internalConsistencyCorrelation_tab") }}
																</div>
															</div>
														</div>
													</div>
													<div
														class="card-body colBoxtext border-b-l-radius-10px border-b-r-radius-10px px-2 py-3"
													>
														<div
															class="row mx-0 dqr-card3"
															ref="heightInput"
															:style="{ height: matchHeight + 'px' }"
														>
															<div
																class="col-12 p-0"
																v-if="!disabledTabs.Injectable"
															>
																<i
																	class="fa fa-circle mr-3"
																	:class="[
																		evInjectables.value
																			? 'color-green'
																			: 'color-red',
																	]"
																	v-b-popover.hover="{
																		variant: 'info',
																		content: $t('icc_hover', {
																			r2Max: r2Max,
																		}),
																		title: $t(
																			'internalConsistencyCorrelation_tab1_1',
																			{
																				method: $t('Injectable'),
																			}
																		),
																		html: true,
																	}"
																></i>
																<span
																	class="cursor-pointer fs-17-1920"
																	@click.stop.prevent="
																		goto('external_validation', 'Injectable')
																	"
																	>{{
																		$t(
																			"internalConsistencyCorrelation_tab1_1",
																			{
																				method: $t("Injectable"),
																			}
																		)
																	}}</span
																>
															</div>
															<div class="col-12 p-0" v-if="!disabledTabs.IUD">
																<i
																	class="fa fa-circle mr-3"
																	:class="[
																		evIUD.value ? 'color-green' : 'color-red',
																	]"
																	v-b-popover.hover="{
																		variant: 'info',
																		content: $t('icc_hover', {
																			r2Max: r2Max,
																		}),
																		title: $t(
																			'internalConsistencyCorrelation_tab1_1',
																			{
																				method: $t('IUD'),
																			}
																		),
																		html: true,
																	}"
																></i>
																<span
																	class="cursor-pointer fs-17-1920"
																	@click.stop.prevent="
																		goto('external_validation', 'IUD')
																	"
																	>{{
																		$t(
																			"internalConsistencyCorrelation_tab1_1",
																			{
																				method: $t("IUD"),
																			}
																		)
																	}}</span
																>
															</div>
															<div
																class="col-12 p-0"
																v-if="!disabledTabs.Implant"
															>
																<i
																	class="fa fa-circle mr-3"
																	:class="[
																		evImplant.value
																			? 'color-green'
																			: 'color-red',
																	]"
																	v-b-popover.hover="{
																		variant: 'info',
																		content: $t('icc_hover', {
																			r2Max: r2Max,
																		}),
																		title: $t(
																			'internalConsistencyCorrelation_tab1_1',
																			{
																				method: $t('Implant'),
																			}
																		),
																		html: true,
																	}"
																></i>
																<span
																	class="cursor-pointer fs-17-1920"
																	@click.stop.prevent="
																		goto('external_validation', 'Implant')
																	"
																	>{{
																		$t(
																			"internalConsistencyCorrelation_tab1_1",
																			{
																				method: $t("Implant"),
																			}
																		)
																	}}</span
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
							<div
								class="card position-relative  dqrsummarycard shadow-sm border-t-l-radius-10px border-t-r-radius-10px border-none summarysubcardqr"
							>
							
								<div
									class="card-body pt-0 dqurcard-body border-b-l-radius-10px border-b-r-radius-10px dqrSummaryContainer mt-0"
									style="background: rgb(255, 255, 255)"
								>
								
										<div class="row dashboardchart-container p-b-20px">
											
											<div
												class="col-12"
												v-if="
													!isExport &&
													(monthlyEmuData || annualEmuData) &&
													annualDataFetched &&
													monthlyDataFetched
												"
											>
												<div
													class="m-t-20px bg-transparent border-none shadow-sm border-t-l-radius-10px border-t-r-radius-10px summarysubcardqr"
												>
													<div
														class="p-10px text-decoration-none border-t-l-radius-10px border-t-r-radius-10px"
													>
														<div class="row no-gutter">
															<div class="col p-t-4px">
																<div class="dqr-title truncate fs-19-1920">
																	{{ $t("externalConsistency") }}
																</div>
															</div>
														</div>
													</div>
													<div
														class="border-b-l-radius-10px border-b-r-radius-10px"
													>
														<div class="row">
															<div
																class="emuchart"
																v-if="monthlyEmuData && annualDataFetched"
																:class="[
																	!annualEmuData ? 'col-lg-12' : 'col-lg-6',
																]"
															>
																<annualcard-component
																	:chartdata="monthlyEmuData"
																	:cardTitle="$t('externalConsistency_chart1')"
																	:inDQR="true"
																	:noOptions="true"
																	:bShowIcons="true"
																	emuType="monthly"
																	:canComment="canComment"
																	key="monthly"
																/>
															</div>
															
															<div
																class="emuchart"
																v-if="annualEmuData && monthlyDataFetched"
																:class="[
																	!monthlyEmuData ? 'col-lg-12' : 'col-lg-6',
																]"
															>
																<annualcard-component
																	:chartdata="annualEmuData"
																	:cardTitle="$t('externalConsistency_chart2')"
																	:noOptions="true"
																	:bShowIcons="true"
																	emuType="annual"
																	:canComment="canComment"
																	key="annual"
																/>
																<!-- Once method mix implemented add => cardTitle="EMU Method Mix vs Survey" -->
															</div>
															
														</div>
													</div>
												</div>
											</div>
											
										</div>
									
								</div>
							</div>
							<div
								class="card position-relative dqrsummarycard shadow-sm border-t-l-radius-10px border-t-r-radius-10px border-none summarysubcardqr"
							>
								
								<div
									class="card-body pt-0 dqurcard-body3 border-b-l-radius-10px border-b-r-radius-10px dqrSummaryContainer mt-0"
									style="background: rgb(255, 255, 255)"
								>
									<div>
										
										<div class="row dashboardchart-container p-b-20px">
											
											<div
												class="col-12"
												v-if="
													!isExport &&
													responseFormsEMUOriginal &&
													responseFormsEMUOriginal.length > 0
												"
											>
												<div
													class="m-t-20px bg-transparent border-none shadow-sm border-t-l-radius-10px border-t-r-radius-10px summarysubcardqr"
												>
													<div
														class="pl-0 pb-4 text-decoration-none border-t-l-radius-10px border-t-r-radius-10px"
													>
														<div class="row no-gutters">
															<div class="col p-t-4px">
																<div class="dqr-title truncate fs-19-1920">
																	{{ $t("dataSignOff") }}
																</div>
															</div>
														</div>
													</div>
													<div
														class="border-b-l-radius-10px border-b-r-radius-10px"
													>
														<div class="row">
															<div class="col-lg-6 col-xl-6">
																<div class="card" style="border-radius: 5px">
																	<div class="card-body cardFullHeight">
																		<div class="level_selection fs-17-1920">
																			<label style="font-weight: 400">{{
																				$t("dsl")
																			}}</label>
																			<div
																				class="mainDivSelectionBox range-main"
																				style="
																					background-color: transparent;
																					margin: 0;
																				"
																			>
																				<div class="rangeSlider">
																					<b-form-input
																						id="range-1"
																						type="range"
																						min="0"
																						max="5"
																						step="0.1"
																						disabled
																						style="visibility: hidden"
																					></b-form-input>
																					<div
																						class="rangeClass px-0"
																						style="top: 0"
																					>
																						<div class="low nDiv fs-17-1920 new-lowrange">
																							<span class="mr-2">{{
																								$t("low")
																							}}</span>
																							<b-badge variant="light">{{
																								lowCount
																							}}</b-badge>
																						</div>
																						<div
																							class="mediumLow nDiv fs-17-1920"
																						>
																							<span class="mr-2">{{
																								$t("medium_low")
																							}}</span>
																							<b-badge variant="light">{{
																								mediumLowCount
																							}}</b-badge>
																						</div>
																						<div class="medium nDiv fs-17-1920">
																							<span class="mr-2">{{
																								$t("medium")
																							}}</span>
																							<b-badge variant="light">{{
																								mediumCount
																							}}</b-badge>
																						</div>
																						<div
																							class="mediumHigh nDiv fs-17-1920"
																						>
																							<span class="mr-2">{{
																								$t("medium_high")
																							}}</span>
																							<b-badge variant="light">{{
																								mediumHighCount
																							}}</b-badge>
																						</div>
																						<div class="high nDiv fs-17-1920 new-highrange">
																							<span class="mr-2">{{
																								$t("high")
																							}}</span
																							><b-badge variant="light">{{
																								highCount
																							}}</b-badge>
																						</div>
																					</div>
																				</div>
																			</div>
																		</div>
																		<div class="pb-3">
																			<div
																				class="text-right cursor-pointer small"
																				@click="
																					showCountTable = !showCountTable
																				"
																			>
																				<i
																					class="fa mr-1"
																					:class="[
																						showCountTable
																							? 'fa-eye-slash'
																							: 'fa-eye',
																					]"
																					aria-hidden="true"
																				></i>
																				<u
																					><span
																						v-b-tooltip.hover.right
																						class="fs-17-1920"
																						:title="$t('countDetails_hover')"
																						>{{ $t("countDetails") }}</span
																					></u
																				>
																			</div>
																			<transition name="slide-fade">
																				<div
																					class="mt-3 table-responsive"
																					v-if="showCountTable"
																					style="font-size: 0.7rem"
																				>
																					<table class="table table-bordered">
																						<thead class="thead-light">
																							<tr>
																								<th
																									:colspan="[
																										i === 2 ? '3' : '2',
																									]"
																									v-for="(
																										value, name, i
																									) in countDistribution"
																									:key="'name' + i"
																								>
																									{{ name }}
																								</th>
																							</tr>
																							<tr>
																								<template
																									v-for="(
																										value, name, i
																									) in countDistribution"
																								>
																									<th
																										v-for="(
																											vInner, nInner, j
																										) in value"
																										:key="'name' + i + j"
																									>
																										{{ nInner }}
																									</th>
																								</template>
																							</tr>
																						</thead>
																						<tbody>
																							<tr>
																								<template
																									v-for="(
																										value, name, i
																									) in countDistribution"
																								>
																									<th
																										v-for="(
																											vInner, nInner, j
																										) in value"
																										:key="'name' + j + i"
																									>
																										<template
																											v-if="vInner.length > 0"
																										>
																											<i
																												class="fa fa-user mr-2 cursor-pointer"
																												v-b-tooltip.hover
																												:title="
																													dot.title +
																													' (' +
																													dot.count +
																													')'
																												"
																												v-for="(
																													dot, k
																												) in vInner"
																												:key="
																													'name' + j + i + k
																												"
																												:style="{
																													color: dot.color,
																												}"
																												><span class="ml-1">{{
																													dot.count
																												}}</span></i
																											>
																										</template>
																										<template v-else>
																											<i
																												class="fa fa-user mr-2 cursor-pointer"
																												v-b-tooltip.hover
																												:title="$t('no_forms')"
																												><span class="ml-1"
																													>0</span
																												></i
																											>
																										</template>
																									</th>
																								</template>
																							</tr>
																						</tbody>
																					</table>
																				</div>
																			</transition>
																		</div>
																		<div class="row pb-3 treeSelect-minFont">
																			<div class="col-6">
																				<treeselect
																					:multiple="true"
																					:options="userListEMU"
																					value-consists-of="LEAF_PRIORITY"
																					:default-expand-level="1"
																					:limit="1"
																					:zIndex="999999"
																					v-model="userSelected"
																					:placeholder="$t('pickUser')"
																					class="fs-17-1920"
																				/>
																			</div>
																			<div class="col-6">
																				<treeselect
																					:multiple="true"
																					:options="tabListEMU"
																					value-consists-of="LEAF_PRIORITY"
																					:default-expand-level="1"
																					:limit="1"
																					:zIndex="999999"
																					v-model="tabSelected"
																					:placeholder="$t('pickCategory')"
																					class="fs-17-1920"
																				/>
																			</div>
																			<div
																				class="col-12 mt-1 text-right small"
																				:style="{
																					opacity:
																						userSelected.length ||
																						tabSelected.length
																							? '1'
																							: '0.5',
																					cursor:
																						userSelected.length ||
																						tabSelected.length
																							? 'pointer'
																							: 'default',
																				}"
																			>
																				<i
																					class="fa fa-refresh mr-1"
																					aria-hidden="true"
																				></i>
																				<u
																					@click="
																						userSelected = [];
																						tabSelected = [];
																					"
																					class="fs-17-1920 resetcolr"
																					>{{ $t("resetbtn") }}</u
																				>
																			</div>
																		</div>

																		<div class="question_sect_wrap1">
																			<div
																				class="list-of-cards"
																				v-if="
																					responseFormsEMU &&
																					responseFormsEMU.length > 0
																				"
																			>
																				<div
																					class="card listcards mt-4 mb-4 rounded-sm"
																					v-for="(
																						form, index
																					) in responseFormsEMU"
																					:key="index"
																					:class="{
																						cardActive: viewIndex === index,
																					}"
																					:style="{
																						'background-color':
																							viewIndex === index
																								? ''
																								: '#2a2951',
																					}"
																				>
																					<div class="card-body pt-3 pb-2 px-3">
																						<div class="row">
																							<div class="col">
																								<div>
																									<h5
																										class="tabs_name userName truncateTwoLines"
																									>
																										{{
																											tabNameMapping[
																												form.signOffTab
																											]
																										}}
																										-
																										{{
																											tabNameMapping[
																												form.signOffSubTab
																											]
																										}}
																									</h5>
																								</div>
																							</div>
																						</div>
																						<div class="row">
																							<div class="col">
																								<div class="personNameDiv">
																									<h6
																										class="userName truncateTwoLines mb-0"
																									>
																										<i
																											class="fa fa-user pr-2 fs-17-1920"
																											:class="
																												form.iconColorClass
																											"
																											aria-hidden="true"
																										></i>
																										{{
																											form.userDetails.firstName
																										}}
																										{{
																											form.userDetails.surname
																										}}
																									</h6>
																								</div>
																							</div>
																							<div class="col">
																								<div>
																									<p
																										class="location_date mb-0 fs-17-1920"
																									>
																										{{ form.location }},
																										{{ form.period }}
																									</p>
																								</div>
																							</div>
																						</div>
																						<div class="row">
																							<div class="col">
																								<div class="actionBtn d-flex">
																									<button
																										class="btn ml-3"
																										:class="{
																											active:
																												viewIndex === index,
																										}"
																										@click.prevent.stop="
																											viewForm(index)
																										"
																									>
																										<img
																											alt="img"
																											:src="
																												require('@/assets/img/view-profile.png')
																											"
																											class="viewIcon fs-17-1920"
																										/>
																										{{ $t("view") }}
																									</button>
																								</div>
																							</div>
																						</div>
																					</div>
																				</div>
																			</div>
																			<div
																				class="text-center pt-3 fs-17-1920"
																				v-else
																			>
																				{{ $t("no_sign-off_forms_submitted") }}.
																			</div>
																		</div>
																	</div>
																</div>
															</div>
															<div
																class="col-lg-6 col-xl-6 question_view"
																v-if="
																	responseFormsEMU &&
																	responseFormsEMU.length > 0
																"
															>
																<div class="card" style="border-radius: 5px">
																	<div class="card-body cardFullHeight">
																		<div class="" v-if="viewFormResponse">
																			<div class="row pb-2">
																				<div class="col-8">
																					<div class="selectionName">
																						<div class="d-flex mb-1">
																							<!-- <a><i class="fa fa-long-arrow-left pr-2 cursor-pointer" aria-hidden="true" @click="backToComment"></i></a> -->
																							<h6
																								class="userName truncateTwoLines mb-0"
																							>
																								<i
																									class="fa fa-user pr-2 fs-19-1920"
																									:class="
																										viewFormResponse.iconColorClass
																									"
																									aria-hidden="true"
																								></i>
																								{{
																									viewFormResponse.userDetails
																										.firstName
																								}}
																								{{
																									viewFormResponse.userDetails
																										.surname
																								}}
																							</h6>
																						</div>
																						<p
																							class="pl-3 mb-0 pl-4 fs-18-1920"
																						>
																							{{
																								tabNameMapping[
																									viewFormResponse.signOffTab
																								]
																							}}
																							-
																							{{
																								tabNameMapping[
																									viewFormResponse.signOffSubTab
																								]
																							}}
																						</p>
																					</div>
																				</div>
																				<div class="col-4">
																					<div>
																						<p
																							class="location_date mb-0 fs-17-1920"
																						>
																							{{ viewFormResponse.location }},
																							{{ viewFormResponse.period }}
																						</p>
																					</div>
																				</div>
																			</div>
																			<div class="question_sect_wrap">
																				<form ref="viewFormResponse">
																					<div
																						class="sect_quest"
																						v-for="(
																							question, i
																						) in viewFormResponse.signOffForm"
																						:key="i"
																					>
																						<label
																							class="question_div fs-17-1920"
																							><span>Q.{{ i + 1 }}.</span>
																							<span>{{
																								question.questionText
																							}}</span></label
																						>
																						<div
																							class="option-selectionDiv row px-3"
																						>
																							<div
																								class="form-check-inline col"
																								v-for="(
																									option, oi
																								) in question.options"
																								:key="i + oi"
																							>
																								<label
																									class="pt-2 mr-3 fs-17-1920"
																									v-if="oi === 0"
																									>Ans:</label
																								>
																								<div
																									class="custom-control custom-radio"
																								>
																									<input
																										type="radio"
																										:id="
																											'customRadioSummary' +
																											i +
																											oi
																										"
																										:name="
																											'customRadioSummary' +
																											i +
																											oi
																										"
																										class="custom-control-input"
																										v-model="question.answer"
																										:value="option.value"
																										:checked="
																											question.answer ===
																											option.value
																										"
																										disabled
																									/>
																									<label
																										class="custom-control-label fs-17-1920"
																										:for="
																											'customRadioSummary' +
																											i +
																											oi
																										"
																										>{{ option.text }}</label
																									>
																								</div>
																							</div>
																							<div class="editIcon float-right">
																								<i
																									class="fa fa-pencil-square-o"
																									aria-hidden="true"
																								></i>
																							</div>
																						</div>
																						<textarea
																							class="form-control"
																							disabled
																							v-if="
																								commentIndex.includes(
																									'comment' + i
																								)
																							"
																							v-model="question.comment"
																						></textarea>
																					</div>
																				</form>
																			</div>
																		</div>
																		<div class="text-center fs-17-1920" v-else>
																			{{ $t("no_data_to_display") }}
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
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
/*global settings*/
/*eslint no-undef: "error"*/
import service from "@/service";
import summaryChartconfig from "./summaryChartConfig";
import annualcardComponent from "../emuAnnual/cardComponent";
// import pptxgen from "pptxgenjs";
import html2canvas from "html2canvas";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
	props: [
		"evInjectables",
		"evIUD",
		"evImplant",
		"rrCompleteness",
		"rrTimeliness",
		"icAggregate",
		"icMethod",
		"summaryLocation",
		"summaryPeriodValue",
		"exportArr",
		"dqrResponse",
		"period",
		"defaultLevelID",
		"defaultLocationID",
		"subLevelID",
		"locationValue",
		"plotLines",
		"isFilterChange",
		"signOffResponse",
		"tabNameMapping",
		"userListEMU",
		"periodType",
		"standardDeviation",
		"locationFetchedPercent",
		"scorecardDataFetching",
		"scorecardGenerated",
		"tabName",
		"disabledTabs",
	],
	components: {
		annualcardComponent,
		Treeselect,
	},
	data() {
		// console.log("DQR module - summary initialized")
		return {
			exportOptionList: ["Aggregated State"],
			chartconfig: JSON.parse(JSON.stringify(summaryChartconfig)),
			chartMaxLimit: 0,
			chartValue: 0,
			selectedDate: null,
			defaultLocationId: null,
			defaultLevelId: null,
			locations: null,
			locationName: "",
			locationChild: null,
			seletedLocationName: "Afghanistan",
			monthlyEmuData: null,
			annualEmuData: null,
			showLoader: true,
			monthYear: new Date(),
			options: [],
			value: "",
			defaultExpandLevel: 1,
			r2Max: "",
			// plotLines: '',
			// plotLinesList: [],
			source: "commoditiesToClients",
			year: "",
			sources: {
				commoditiesToClients: "Commodities Distributed to Clients",
				commoditiesToFacilities: "Commodities Distributed to Facilities",
				fp_visits: "FP Visits",
				fp_users: "FP Users",
			},
			dataFetched: [],
			isExport: false,
			viewFormResponse: null,
			commentIndex: [],
			viewIndex: null,
			tabSelected: [],
			userSelected: [],
			items: [],
			fields: [],
			newFields: [],
			tabListEMU: [],
			countDistributionOriginal: {
				"Completeness and Timeliness": {
					"Reporting Rate (Actual)": [],
					"Reporting Rate (On Time)": [],
				},
				"Internal Consistency": { Aggregate: [], Method: [] },
				"Internal Consistency - Correlation": {
					Injectable: [],
					IUD: [],
					Implant: [],
				},
			},
			countDistribution: {
				"Completeness and Timeliness": {
					"Reporting Rate (Actual)": [],
					"Reporting Rate (On Time)": [],
				},
				"Internal Consistency": { Aggregate: [], Method: [] },
				"Internal Consistency - Correlation": {
					Injectable: [],
					IUD: [],
					Implant: [],
				},
			},
			showCountTable: false,
			responseFormsEMU: this.signOffResponse,
			responseFormsEMUOriginal: JSON.parse(
				JSON.stringify(this.signOffResponse)
			),
			lowCount: 0,
			mediumLowCount: 0,
			mediumCount: 0,
			mediumHighCount: 0,
			highCount: 0,
			canComment: false,
			annualDataFetched: false,
			monthlyDataFetched: false,
			matchHeight: null,
		};
	},
	watch: {
		signOffResponse(newValue) {
			if (newValue) {
				this.responseFormsEMU = newValue;
				this.responseFormsEMUOriginal = JSON.parse(JSON.stringify(newValue));
				this.getFormResponse();
			}
		},
		userSelected(newValue) {
			// console.log(newValue)
			if (newValue.length === 0) {
				if (this.tabSelected.length === 0) {
					this.responseFormsEMU = this.responseFormsEMUOriginal;
				} else {
					this.responseFormsEMU = this.responseFormsEMUOriginal.filter((f) =>
						this.tabSelected.includes(`${f.signOffTab}-${f.signOffSubTab}`)
					);
				}
			} else {
				if (this.tabSelected.length === 0) {
					this.responseFormsEMU = this.responseFormsEMUOriginal.filter((f) =>
						newValue.includes(f.userDetails.id)
					);
				} else {
					this.responseFormsEMU = this.responseFormsEMUOriginal.filter(
						(f) =>
							this.tabSelected.includes(`${f.signOffTab}-${f.signOffSubTab}`) &&
							newValue.includes(f.userDetails.id)
					);
				}
			}
		},
		tabSelected(newValue) {
			// console.log(newValue)
			// console.log(this.responseFormsEMUOriginal)
			if (newValue.length === 0) {
				if (this.userSelected.length === 0) {
					this.responseFormsEMU = this.responseFormsEMUOriginal;
				} else {
					this.responseFormsEMU = this.responseFormsEMUOriginal.filter((f) =>
						this.userSelected.includes(f.userDetails.id)
					);
				}
			} else {
				if (this.userSelected.length === 0) {
					this.responseFormsEMU = this.responseFormsEMUOriginal.filter((f) =>
						newValue.includes(`${f.signOffTab}-${f.signOffSubTab}`)
					);
				} else {
					this.responseFormsEMU = this.responseFormsEMUOriginal.filter(
						(f) =>
							newValue.includes(`${f.signOffTab}-${f.signOffSubTab}`) &&
							this.userSelected.includes(f.userDetails.id)
					);
				}
			}
		},
		responseFormsEMU(newValue) {
			this.viewFormResponse = newValue[0];
			this.getCount();
			if (newValue[0] && newValue[0].signOffForm) {
				newValue[0].signOffForm.forEach((formView, i) => {
					// console.log(formView)
					if (formView.comment !== "") {
						this.commentIndex.push("comment" + i);
					}
				});
			}
		},
		isFilterChange() {
			// if(newValue) {
			// this.dataFetched = []
			// } else {
			this.dataFetched = [];
			this.showLoader = true;
			// }
		},
		defaultLocationID(newValue) {
			if (newValue) {
				this.showLoader = true;
				this.monthlyEmuData = null;
				this.annualEmuData = null;
				this.monthlyDataFetched = false;
				this.annualDataFetched = false;
				this.getEmuCharts();
			}
		},
		period(newValue) {
			if (newValue) {
				if (this.periodType === "monthly") {
					this.selectedDate = this.$moment(newValue, "YYYYMM").format(
						"MMM YYYY"
					);
				}
				if (this.periodType === "financialYear") {
					let currentYear = newValue * 1,
						toText = this.$i18n.t("toSmall");
					this.selectedDate =
						this.$i18n.locale === "fr"
							? `avril ${currentYear} ${toText} mars ${currentYear + 1}`
							: `Apr ${currentYear} ${toText} Mar ${currentYear + 1}`;
				}
				if (this.periodType === "financialYearJuly") {
					let currentYear = newValue.split("July")[0] * 1,
						toText = this.$i18n.t("toSmall");
					this.selectedDate =
						this.$i18n.locale === "fr"
							? `juil. ${currentYear} ${toText} juin ${currentYear + 1}`
							: `Jul ${currentYear} ${toText} Jun ${currentYear + 1}`;
				}
				if (this.periodType === "quarterly") {
					let toText = this.$i18n.t("toSmall");
					let years = {
						Q1: ["Jan", "Mar"],
						Q2: ["Apr", "Jun"],
						Q3: ["Jul", "Sep"],
						Q4: ["Oct", "Dec"],
					};
					if (this.$i18n.locale === "fr") {
						years = {
							Q1: ["janv.", "mars"],
							Q2: ["avril", "juin"],
							Q3: ["juil.", "sept."],
							Q4: ["oct.", "déc."],
						};
					}
					let currQ = this.period;
					let splittedCurrQ = currQ.split("Q");
					this.selectedDate = `${years["Q" + splittedCurrQ[1]][0]} ${toText} ${
						years["Q" + splittedCurrQ[1]][1]
					} ${splittedCurrQ[0]}`;
				}
				if (this.periodType === "yearly") {
					this.selectedDate = newValue;
				}
				this.showLoader = true;
				this.getEmuCharts();
			}
		},
		dataFetched(newValue) {
			// console.log(newValue)
			this.chartValue = newValue.filter((x) => x.value).length;
			this.chartconfig.series[0].data[0].y = this.chartValue;
			if (newValue.length === this.chartMaxLimit) {
				// console.log(newValue)
				// console.log(this.isFilterChange)
				this.showLoader = false;
				this.$emit("resetIsFilterChange");
			}
		},
		evInjectables(newValue) {
			let foundIndex = this.dataFetched.findIndex(
				(d) => d.key === "evInjectables"
			);
			if (foundIndex >= 0) {
				this.dataFetched[foundIndex] = newValue;
			} else {
				this.dataFetched.push(newValue);
			}
		},
		evIUD(newValue) {
			// console.log("evIUD watch", newValue);
			let foundIndex = this.dataFetched.findIndex((d) => d.key === "evIUD");
			if (foundIndex >= 0) {
				this.dataFetched[foundIndex] = newValue;
			} else {
				this.dataFetched.push(newValue);
			}
		},
		evImplant(newValue) {
			// console.log("evImplant watch", newValue);
			let foundIndex = this.dataFetched.findIndex((d) => d.key === "evImplant");
			if (foundIndex >= 0) {
				this.dataFetched[foundIndex] = newValue;
			} else {
				this.dataFetched.push(newValue);
			}
		},
		rrCompleteness(newValue) {
			// console.log("rrCompleteness watch", newValue);
			// console.log(newValue)
			let foundIndex = this.dataFetched.findIndex(
				(d) => d.key === "rrCompleteness"
			);
			if (foundIndex >= 0) {
				this.dataFetched[foundIndex] = newValue;
			} else {
				this.dataFetched.push(newValue);
			}
		},
		rrTimeliness(newValue) {
			// console.log(newValue)
			let foundIndex = this.dataFetched.findIndex(
				(d) => d.key === "rrTimeliness"
			);
			if (foundIndex >= 0) {
				this.dataFetched[foundIndex] = newValue;
			} else {
				this.dataFetched.push(newValue);
			}
		},
		icAggregate(newValue) {
			let foundIndex = this.dataFetched.findIndex(
				(d) => d.key === "icAggregate"
			);
			if (foundIndex >= 0) {
				this.dataFetched[foundIndex] = newValue;
			} else {
				this.dataFetched.push(newValue);
			}
		},
		icMethod(newValue) {
			let foundIndex = this.dataFetched.findIndex((d) => d.key === "icMethod");
			if (foundIndex >= 0) {
				this.dataFetched[foundIndex] = newValue;
			} else {
				this.dataFetched.push(newValue);
			}
		},
		disabledTabs: {
			handler: function (newValue) {
				// console.log("disabledTabs", newValue);
				// console.log("this.chartMaxLimit", this.chartMaxLimit);
				let disabledCount = Object.keys(newValue).filter(
					(x) => newValue[x]
				).length;
				if (disabledCount > 0) {
					this.chartMaxLimit = 7 - disabledCount;
				}
				this.$emit("chartMaxLimit", this.chartMaxLimit);
			},
			deep: true,
		},
		chartMaxLimit(newValue) {
			this.matchHeight = newValue === 7 ? 104 : 64;
			this.chartconfig.yAxis.max = newValue * 1;
			this.chartconfig.yAxis.tickPositioner = function () {
				return [this.min, this.max];
			};
		},
	},
	methods: {
		generateScore() {
			this.$emit("generateScore");
		},
		viewScorecard() {
			this.$emit("viewScorecard");
		},
		cancelScorecard() {
			this.$emit("cancelScorecard");
		},
		viewForm(index) {
			// console.log(index)
			this.commentIndex = [];
			this.viewFormResponse = null;
			this.$nextTick(function () {
				this.viewFormResponse = this.responseFormsEMU[index];

				this.responseFormsEMU[index].signOffForm.forEach((formView, i) => {
					// console.log(formView)
					if (formView.comment !== "") {
						this.commentIndex.push("comment" + i);
					}
				});
				this.viewIndex = index;
			});
		},
		getFormResponse() {
			this.commentIndex = [];
			this.viewFormResponse = this.responseFormsEMU[0];
			this.getCount();
			if (this.responseFormsEMU[0] && this.responseFormsEMU[0].signOffForm) {
				this.responseFormsEMU[0].signOffForm.forEach((formView, i) => {
					// console.log(formView)
					if (formView.comment !== "") {
						this.commentIndex.push("comment" + i);
					}
				});
			}
			this.viewIndex = 0;
		},
		getCount() {
			this.countDistribution = JSON.parse(
				JSON.stringify(this.countDistributionOriginal)
			);
			// console.log(this.countDistribution)
			// console.log(this.countDistributionOriginal)
			let colors = {
				"text-red-new": "#f4665c",
				"text-orange-new": "#f5904c",
				"text-yellow-new": "#f5e367",
				"text-green-new": "#80b853",
				"text-blue-new": "#528fc5",
			};
			if (this.responseFormsEMU && this.responseFormsEMU.length) {
				let lowCount = 0,
					mediumLowCount = 0,
					mediumCount = 0,
					mediumHighCount = 0,
					highCount = 0;
				this.responseFormsEMU.forEach((form) => {
					// console.log(form)
					let tooltipName = null;
					if (form.dataSatisfaction >= 1.1 && form.dataSatisfaction <= 2) {
						mediumLowCount += 1;
						tooltipName = this.$i18n.t("medium_low");
					} else if (
						form.dataSatisfaction >= 2.1 &&
						form.dataSatisfaction <= 3
					) {
						mediumCount += 1;
						tooltipName = this.$i18n.t("medium");
					} else if (
						form.dataSatisfaction >= 3.1 &&
						form.dataSatisfaction <= 4
					) {
						mediumHighCount += 1;
						tooltipName = this.$i18n.t("medium_high");
					} else if (
						form.dataSatisfaction >= 4.1 &&
						form.dataSatisfaction <= 5
					) {
						highCount += 1;
						tooltipName = this.$i18n.t("high");
					} else {
						lowCount += 1;
						tooltipName = this.$i18n.t("low");
					}
					// let dot = `<i class="fa fa-circle mr-1" v-b-tooltip.hover title="${tooltipName}" style="color: ${colors[form.iconColorClass]}"></i>`
					let dotDetails = {
						title: tooltipName,
						color: colors[form.iconColorClass],
						count: 1,
					};
					let catDetails =
						this.countDistribution[this.tabNameMapping[form.signOffTab]][
							this.tabNameMapping[form.signOffSubTab]
						];

					let foundIndex = catDetails.findIndex((c) => c.title === tooltipName);
					if (foundIndex >= 0) {
						let updatedDotDetails = {
							...catDetails[foundIndex],
							count: catDetails[foundIndex].count * 1 + 1,
						};
						catDetails[foundIndex] = updatedDotDetails;
					} else {
						catDetails.push(dotDetails);
					}
				});
				// console.log(this.countDistribution)
				this.lowCount = lowCount;
				this.mediumLowCount = mediumLowCount;
				this.mediumCount = mediumCount;
				this.mediumHighCount = mediumHighCount;
				this.highCount = highCount;
			} else {
				this.lowCount = 0;
				this.mediumLowCount = 0;
				this.mediumCount = 0;
				this.mediumHighCount = 0;
				this.highCount = 0;
			}
		},
		async exportPPT() {
			this.$store.state.loading = true;
			this.isExport = true;
			// console.log("export from child")
			let locationName = null;
			await service
				.getIndividualOrganisation(this.defaultLocationID)
				.then((key) => {
					locationName = key.data.name;
				});
			let summary = null;
			await html2canvas(this.$refs.dqrSummary, {
				logging: true,
				letterRendering: true,
				allowTaint: true,
				useCORS: true,
				scale: (1920 * 2) / window.innerWidth,
				backgroundColor: null,
			})
				.then((canvas) => {
					summary = canvas.toDataURL();
				})
				.catch((error) => {
					console.log("Erorr in screenshot capture...", error);
				});
			// console.log(summary)
			this.$store.state.loading = false;
			const { value: formValues } = await this.$swal({
				title: this.$i18n.t("export_options"),
				html:
					'<div><input id="fileName" class="swal2-input" placeholder="' +
					this.$i18n.t("fileName_placeholder") +
					'" value="Data Quality Review" tabindex="-1"/></div>' +
					'<div class="pt-3"><div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="showLegends" value="show"><label class="custom-control-label" for="showLegends">' +
					this.$i18n.t("legends") +
					"</label></div>" +
					'<div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="showValues" value="show"><label class="custom-control-label" for="showValues">' +
					this.$i18n.t("values") +
					"</label></div>" +
					'<div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="showXAxis" checked value="show"><label class="custom-control-label" for="showXAxis">' +
					this.$i18n.t("x-axis") +
					"</label></div>" +
					'<div class="custom-control custom-checkbox custom-control-inline"><input type="checkbox" class="custom-control-input" id="showYAxis" checked value="show"><label class="custom-control-label" for="showYAxis">' +
					this.$i18n.t("y-axis") +
					"</label></div></div>",
				focusConfirm: true,
				showCancelButton: true,
				confirmButtonText: this.$i18n.t("exportbtn"),
				preConfirm: () => {
					return [
						document.getElementById("fileName").value,
						document.getElementById("showLegends").checked
							? document.getElementById("showLegends").value
							: "",
						document.getElementById("showValues").checked
							? document.getElementById("showValues").value
							: "",
						document.getElementById("showXAxis").checked
							? document.getElementById("showXAxis").value
							: "",
						document.getElementById("showYAxis").checked
							? document.getElementById("showYAxis").value
							: "",
					];
				},
			});

			if (formValues) {
				// console.log(formValues)
				import(/* webpackChunkName: "pptxgenjs"*/ "pptxgenjs").then(
					(pptxgen) => {
						let pptx = new pptxgen.default();
						pptx.layout = "LAYOUT_WIDE";
						pptx.author = "Avenir Generic Tool";
						pptx.company = "Dure Technologies";
						pptx.subject = this.$i18n.t("dataQuality");
						pptx.title = this.$i18n.t("dataQuality");

						pptx.defineSlideMaster({
							title: "MASTER_SLIDE",
							bkgd: "FFFFFF",
							objects: [
								{
									text: {
										text: this.$i18n.t("dataQuality"),
										options: {
											y: "2%",
											fontSize: 30,
											align: "center",
											w: "100%",
											underline: true,
										},
									},
								},
								{
									line: {
										align: "center",
										x: 4.2,
										y: "94%",
										w: 5,
										h: 0,
										line: "0088CC",
										lineSize: 1,
									},
								},
								{
									line: {
										align: "center",
										x: 5.2,
										y: "95%",
										w: 3,
										h: 0,
										line: "0088CC",
										lineSize: 1,
									},
								},
								{
									text: {
										text: this.$i18n.t("location") + " :- " + locationName,
										options: {
											x: 0.5,
											y: "95%",
											w: "60%",
											bold: true,
											fontSize: 12,
										},
									},
								},
								{
									text: {
										text: this.$i18n.t("period") + " :- " + this.selectedDate,
										options: {
											x: 0.5,
											y: "98%",
											w: "60%",
											bold: true,
											fontSize: 12,
										},
									},
								},
								{
									text: {
										text: this.$moment(new Date()).format("llll"),
										options: {
											x: 8.5,
											y: "98%",
											w: "30%",
											align: "right",
											fontSize: 12,
											bold: true,
										},
									},
								},
							],
							// slideNumber: { x:0.5, y:'1%'}
						});

						let slide = pptx.addSlide("MASTER_SLIDE");
						slide.addText(`${this.$i18n.t("Summary")} ::`, {
							x: 0.5,
							y: 0.6,
							w: "90%",
							fontSize: 18,
							bold: true,
							underline: true,
							breakLine: true,
						});
						if (summary) {
							slide.addImage({
								data: summary,
								x: 0.5,
								y: 1,
								w: "90%",
								h: "80%",
							});
						}
						if (this.exportArr && this.exportArr.length) {
							let reA = /[^a-zA-Z]/g;
							let reN = /[^0-9]/g;

							this.exportArr.sort((a, b) => {
								let aA = a.cardKey.replace(reA, ""),
									bA = b.cardKey.replace(reA, "");
								if (aA === bA) {
									let aN = parseInt(a.cardKey.replace(reN, ""), 10);
									let bN = parseInt(b.cardKey.replace(reN, ""), 10);
									return aN === bN ? 0 : aN > bN ? 1 : -1;
								} else {
									return aA > bA ? 1 : -1;
								}
							});
							// console.log(this.exportArr)

							for (let index = 0; index < this.exportArr.length; index++) {
								const element = this.exportArr[index];
								slide = pptx.addSlide("MASTER_SLIDE");
								slide.addText(element.title.title, {
									x: 0.5,
									y: 0.6,
									w: "90%",
									fontSize: 18,
									bold: true,
									underline: true,
									breakLine: true,
								});
								let chartData = [],
									chartColors = [];
								if (element.chart.type === "scatter") {
									element.series.forEach((e) => {
										if (e.type !== "line") {
											let x = [],
												y = [];
											if (e.color) {
												chartColors.push(e.color.split("#")[1]);
											} else {
												chartColors.push(
													(0xffffffff - Math.random() * 0xffffffff)
														.toString(16)
														.substr(0, 6)
												);
											}
											// console.log(chartColors)
											let name = e.name;
											if (e.data && e.data.length) {
												e.data.forEach((ed) => {
													x.push(ed.x);
													y.push(ed.y);
												});
											}
											chartData.push({
												name: "X-Axis",
												values: x,
											});
											chartData.push({
												name,
												values: y,
											});
										}
									});
								} else {
									element.series.forEach((e) => {
										if (e.color) {
											chartColors.push(e.color.split("#")[1]);
										} else {
											chartColors.push(
												(0xffffffff - Math.random() * 0xffffffff)
													.toString(16)
													.substr(0, 6)
											);
										}
										// console.log(chartColors)
										let name = e.name,
											labels = [],
											values = [];
										if (e.data && e.data.length) {
											e.data.forEach((ed) => {
												labels.push(ed.name);
												values.push(ed.y);
											});
										}
										chartData.push({
											name,
											labels,
											values,
										});
									});
								}

								// console.log(element.cardKey, element.chart.type,chartData)
								let type = element.chart.type;

								let options = {
									x: 0.5,
									y: 1,
									w: "90%",
									h: "75%",
									showValue: formValues[2] === "show" ? true : false,
									showLegend: formValues[1] === "show" ? true : false,
									legendPos: "b",
									barGapWidthPct: 50,
									showCatAxisTitle:
										formValues[3] !== "show"
											? false
											: element.xAxis &&
											  element.xAxis.title &&
											  element.xAxis.title.text
											? true
											: false,
									catAxisTitle:
										element.xAxis &&
										element.xAxis.title &&
										element.xAxis.title.text
											? element.xAxis.title.text
											: "",
									showValAxisTitle:
										formValues[4] !== "show"
											? false
											: element.yAxis &&
											  element.yAxis.title &&
											  element.yAxis.title.text
											? true
											: false,
									valAxisTitle:
										element.yAxis &&
										element.yAxis.title &&
										element.yAxis.title.text
											? element.yAxis.title.text
											: "",
								};

								if (type == "line") {
									type = pptx.ChartType.line;
								} else if (type == "area") {
									type = pptx.ChartType.area;
								} else if (type == "scatter") {
									type = pptx.ChartType.scatter;
									options["lineSize"] = 0;
								} else {
									type = pptx.ChartType.bar;
									// options['barDir'] = 'col'
									if (
										element.plotOptions &&
										element.plotOptions.series &&
										element.plotOptions.series.stacking === "normal"
									) {
										options["barDir"] = "col";
										options["barGrouping"] = "stacked";
									}
								}
								// console.log(chartData)
								slide.addChart(type, chartData, options);
							}
						}
						pptx.writeFile({ fileName: formValues[0] });
						this.isExport = false;
						console.log("File exported...");
					}
				);
			} else {
				this.isExport = false;
			}
		},
		goto(tab, subTab = "") {
			this.$emit("activateTab", tab, subTab);
		},
		updateChartValue() {
			this.chartMaxLimit = 7;
			this.chartValue = 0;
			if (
				this.evInjectables.value ||
				this.evIUD.value ||
				this.evImplant.value ||
				this.rrCompleteness.value ||
				this.rrTimeliness.value ||
				this.icAggregate.value ||
				this.icMethod.value
			) {
				this.chartValue += 1;
			}
			this.chartconfig.yAxis.max = this.chartMaxLimit * 1;
			this.chartconfig.yAxis.tickPositioner = function () {
				return [this.min, this.max];
			};
			this.chartconfig.series[0].data[0].y = this.chartValue;
		},
		getConfig() {
			this.r2Max = this.dqrResponse.external_validation.Background_Data.r2Max
				? this.dqrResponse.external_validation.Background_Data.r2Max
				: 0.9;
			this.selectedDate = this.$moment(this.period, "YYYYMM").format(
				"MMM YYYY"
			);
			this.getEmuCharts();
		},
		getEmuCharts() {
			// console.log("DQR module - getConfig() - getEmuCharts() called with location = ", this.defaultLocationID)
			let key = this.generateKey("monthlyEMU"),
				key2 = this.generateKey("annualEMU");
			let savedEMU = this.dqrResponse.emu_monthly.Background_Data.autoSaveEMU;
			let dqrData = this.dqrResponse.emu_monthly[savedEMU].derivedCharts;
			let dqrDataAnnual = this.dqrResponse.emu.Output.derivedCharts;
			this.monthlyEmuData = {};
			service
				.getSavedConfig(key)
				.then((oGlobal) => {
					// console.log("DQR module - getConfig() - monthlyEMU response received")
					let eData =
						typeof oGlobal.data["totalEMU"] === "string"
							? JSON.parse(oGlobal.data["totalEMU"])
							: oGlobal.data["totalEMU"];
					let monthlyData = (this.monthlyEmuData = eData[this.defaultLocationID]
						? eData[this.defaultLocationID]
						: null);
					//let monthlyData = eData[this.defaultLocationID] ? eData[this.defaultLocationID] : null
					// console.log(monthlyData);
					if (monthlyData) {
						let data = dqrData.find(
							(d) => d.chartOptions.cid === monthlyData.cid
						);
						// console.log("data", data);
						if (data) {
							data = data.chartOptions;
							this.monthlyEmuData.chartInfo = data.chartInfo;
							this.monthlyEmuData.title = data.chartName;
							this.monthlyEmuData.xTitle =
								data.xAxis && data.xAxis.visible ? data.xAxis.text : "";
							this.monthlyEmuData.yTitle =
								data.yAxis && data.yAxis.visible ? data.yAxis.text : "";
							this.monthlyEmuData.disable = data.disableChart
								? data.disableChart
								: "";
							(this.monthlyEmuData.type = "line"),
								(this.monthlyEmuData["categories"] = []);
							this.monthlyEmuData["data"] = [];
							this.monthlyEmuData.tableData = monthlyData.tableData;
							let pe = [],
								formatedCatArray = [];
							for (let i = 23; i >= 0; i--) {
								if (i === 0) {
									pe.push(
										this.$moment(this.selectedDate, "MMM YYYY").format("YYYYMM")
									);
								} else {
									pe.push(
										this.$moment(this.selectedDate, "MMM YYYY")
											.subtract(i, "months")
											.format("YYYYMM")
									);
								}
							}
							monthlyData.saveCategories.forEach((c) =>
								formatedCatArray.push(
									this.$moment(c, "MMM YYYY").format("YYYYMM")
								)
							);
							let reqData = monthlyData.saveData[0].data;
							let obj = {
								name: monthlyData.saveData[0].name,
								data: [],
							};
							let items = [],
								fields = [];
							fields.push(
								{ key: "Period", value: this.$i18n.t("period") },
								{
									key: "Value",
									value: this.$i18n.t("value"),
								}
							);
							// console.log("pe", pe)
							// console.log("formatedCatArray", formatedCatArray)
							let count = 0;
							pe.forEach((p, i) => {
								let formatedDate = this.$moment(p, "YYYYMM").format(
									"MMM YYYY"
								);
								if (formatedCatArray.includes(p)) {
									count++;
									let catIndex = formatedCatArray.indexOf(p);
									obj.data.push(reqData[catIndex]);
									this.monthlyEmuData.categories.push(formatedDate);
									items.push({
										Period: formatedDate,
										Value: reqData[catIndex],
									});
								}
							});
							(this.monthlyEmuData.max = count > 11 ? 11 : count - 1),
								(this.monthlyEmuData["fields"] = fields);
							this.monthlyEmuData["tableData"] = items;
							this.monthlyEmuData["data"].push(obj);
							// console.log(this.monthlyEmuData);
							this.updateExportArr(this.monthlyEmuData, "key0");
						}
						this.monthlyDataFetched = true;
					}
					// console.log(this.monthlyEmuData)
					// this.showLoader = false
					this.$store.state.loading = false;
				})
				.catch((res) => {
					console.log(res);
					this.monthlyDataFetched = true;
					this.monthlyEmuData = null;
					console.log("DQR module - getConfig() - monthlyEMU response failed");
					this.$store.state.loading = false;
					// console.log("Config not found...");
					// this.showLoader = false;
				});

			service
				.getSavedConfig(key2)
				.then((annual) => {
					// console.log("DQR module - getConfig() - annualEMU response received")
					let eData =
						typeof annual.data["compEMU"] === "string"
							? JSON.parse(annual.data["compEMU"])
							: annual.data["compEMU"];
					this.annualEmuData = eData[this.defaultLocationID]
						? eData[this.defaultLocationID]
						: null;
					let data = dqrDataAnnual.find(
						(d) => d.chartOptions.cid === this.annualEmuData.cid
					);
					if (this.annualEmuData && data) {
						data = data.chartOptions;
						this.annualEmuData.chartInfo = data.chartInfo;
						this.annualEmuData.title = data.chartName;
						this.annualEmuData.xTitle =
							data.xAxis && data.xAxis.visible ? data.xAxis.text : "";
						this.annualEmuData.yTitle =
							data.yAxis && data.yAxis.visible ? data.yAxis.text : "";
					}
					this.updateExportArr(this.annualEmuData, "key1");
					this.annualEmuData.source = this.annualEmuData.source
						? this.sources[this.annualEmuData.source]
						: "";
					this.annualDataFetched = true;
				})
				.catch(() => {
					this.annualDataFetched = true;
					console.log("DQR module - getConfig() - annualEMU response failed");
					this.annualEmuData = null;
					// console.log("Config not found...");
					// this.showLoader = false;
				});
		},
		updateExportArr(data, key) {
			// console.log("DQR module - getConfig() - getEmuCharts() - updateExportArr () called")
			let exportEMU = {
				cardKey: key,
				chart: {
					type: data.type,
				},
				title: {
					title: `${this.$i18n.t("summaryExternalConsistency")} - ${
						data.title
					}`,
				},
				xAxis: {
					title: {
						text: data.xTitle,
					},
				},
				yAxis: {
					title: {
						text: data.yTitle,
					},
				},
				series: [],
			};
			data.data.forEach((e) => {
				let obj = {
					name: e.name,
					color: "",
					data: [],
				};
				e.data.forEach((d, i) => {
					obj.data.push({
						name: data.categories[i],
						y: d,
					});
				});
				exportEMU.series.push(obj);
			});

			let foundIndex = this.exportArr.findIndex(
				(e) => e.cardKey === exportEMU.cardKey
			);
			if (foundIndex >= 0) {
				this.exportArr[foundIndex] = exportEMU;
			} else {
				this.exportArr.push(exportEMU);
			}
			// console.log("DQR module - getConfig() - getEmuCharts() - updateExportArr () exportArr updated")
		},
	},
	created() {
		this.$gtag.event("tab_view", {
			value: this.tabName,
		});
		this.canComment =
			this.$store.getters.getIsAdmin ||
			this.$store.getters.getUserPermissions.canComment;
		// console.log("DQR module - summary created")

		this.tabListEMU = [
			{
				id: this.$i18n.t("compTime"),
				label: this.$i18n.t("compTime"),
				children: [
					{
						id: "reportingRate-reportingActual",
						label: this.$i18n.t("Reporting Rate (Actual)"),
					},
					{
						id: "reportingRate-reportingOnTime",
						label: this.$i18n.t("Reporting Rate (On Time)"),
					},
				],
			},
			{
				id: this.$i18n.t("in_Consistency"),
				label: this.$i18n.t("in_Consistency"),
				children: [
					{
						id: "internal_validations-Aggregate",
						label: this.$i18n.t("aggregate"),
					},
					{
						id: "internal_validations-Method",
						label: this.$i18n.t("method"),
					},
				],
			},
			{
				id: this.$i18n.t("internalConsistencyCorrelation_tab"),
				label: this.$i18n.t("internalConsistencyCorrelation_tab"),
				children: [
					{
						id: "external_validation-Injectable",
						label: this.$i18n.t("Injectable"),
					},
					{
						id: "external_validation-IUD",
						label: this.$i18n.t("IUD"),
					},
					{
						id: "external_validation-Implant",
						label: this.$i18n.t("Implant"),
					},
				],
			},
		];

		this.countDistributionOriginal = {
			[this.$i18n.t("compTime")]: {
				[this.$i18n.t("Reporting Rate (Actual)")]: [],
				[this.$i18n.t("Reporting Rate (On Time)")]: [],
			},
			[this.$i18n.t("in_Consistency")]: {
				[this.$i18n.t("aggregate")]: [],
				[this.$i18n.t("method")]: [],
			},
			[this.$i18n.t("internalConsistencyCorrelation_tab")]: {
				[this.$i18n.t("Injectable")]: [],
				[this.$i18n.t("IUD")]: [],
				[this.$i18n.t("Implant")]: [],
			},
		};

		this.countDistribution = {
			[this.$i18n.t("compTime")]: {
				[this.$i18n.t("Reporting Rate (Actual)")]: [],
				[this.$i18n.t("Reporting Rate (On Time)")]: [],
			},
			[this.$i18n.t("in_Consistency")]: {
				[this.$i18n.t("aggregate")]: [],
				[this.$i18n.t("method")]: [],
			},
			[this.$i18n.t("internalConsistencyCorrelation_tab")]: {
				[this.$i18n.t("Injectable")]: [],
				[this.$i18n.t("IUD")]: [],
				[this.$i18n.t("Implant")]: [],
			},
		};

		this.updateChartValue();
		this.getConfig();
		if (this.signOffResponse) {
			this.getFormResponse();
		}

		//console.log(this.chartconfig)
	},
	mounted() {},
};
</script>
<style lang="scss" scoped>
.emuchart .card {
	border-top-left-radius: 10px !important;
	border-top-right-radius: 10px !important;
	box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
}
.newGreen-theme {
	.dqrSummaryContainer {
		background-color: #f4f4f4 !important;
	}
	.ext_const {
		background-color: #dbdbdb !important;
	}
}

.close {
	position: absolute;
	right: 10px;
	top: 11px;
	color: #fff;
	opacity: 1;
	font-weight: 400;
}

.card-header {
	h5 {
		font-weight: 300;
	}
}
.userName {
	font-size: 1rem;
	font-weight: 400;
	color: #6e6e70;
	text-transform: capitalize;
}
.location_date {
	float: right;
	font-size: 0.8125rem;
	// color: #aeaeb0;
	color: #717171;
}
.selectionName {
	font-size: 0.8125rem;
	color: #6e6e70;
}
.comments_btn {
	font-size: 0.8125rem;
	float: right;
	color: #6e6e70;
	border-bottom: 1px solid #6e6e70;
}
.header {
	border-bottom: 3px solid #ddd;
}
.question_div {
	font-size: 0.75rem;
}
.answer_div {
}
.option-selectionDiv {
	font-size: 0.75rem;
}
.editIcon {
	display: inline;
	padding-top: 10px;
	.fa {
		font-size: 0.875rem;
		color: #a7a7a7;
	}
}
.lien_borderbottom {
	border-bottom: 1px solid #ddd;
}
.sect_quest {
	padding-bottom: 2%;
	border-bottom: 1px solid #ddd;
	padding-top: 5%;
	color: #6e6e70;
}
.question_sect_wrap {
	overflow: hidden;
	overflow-y: scroll;
	padding-right: 2.5%;
	height: calc(100vh - 200px);
	 //border-top: 1px solid #cccccc;
	padding-bottom: 10%;
}
.question_sect_wrap {
	scrollbar-color: 0 0 1px rgba(255, 255, 255, 0.5) rgba(0, 0, 0, 0.5);
	scrollbar-width: thin;
}
.bottomSect {
	border: 0;
	background-color: rgba(167, 167, 167, 0.6784313725490196) !important;
	border-radius: 0;
	padding-bottom: 20px;
	position: fixed;
	bottom: 0;
}
.mainDivSelectionBox {
	display: flex;
	align-items: center;
	justify-content: center;
	background: #fff;
	padding: 3px 0px 8px 0px;
	margin-bottom: 4%;
	border-radius: 2px;
	position: relative;
}
.nDiv {
	font-size: 0.74em;
	padding: 6px 8px;
	text-align: center;
	color: #fff;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}
.low {
	background-color: #f4665c;
}
.text-red-new {
	color: #f4665c;
}
.mediumLow {
	background-color: #f5904c;
}
.text-orange-new {
	color: #f5904c;
}
.medium {
	background-color: #f5e367;
}
.text-yellow-new {
	color: #f5e367;
}
.mediumHigh {
	background-color: #80b853;
}
.text-green-new {
	color: #80b853;
}
.high {
	background-color: #528fc5;
}
.text-blue-new {
	color: #528fc5;
}
.question_view {
	.question_sect_wrap {
		padding-right: 0;
		padding-bottom: 5%;
		overflow: hidden;
		overflow-y: scroll;
		padding-right: 2.5%;
		height: calc(100vh - 115px);
		//border-top: 1px solid #cccccc;
	}
	.personNameDiv {
		.userName {
			font-size: 0.875rem;
			font-weight: 500;
		}
	}
}
.actionBtn {
	justify-content: flex-end;
	button {
		font-size: 0.8125rem;
		border-bottom: 2px solid #9a9899;
		border-radius: 0;
		padding: 6px 1px 0;
		margin-bottom: 3%;
		color: #9a9899;
	}
	button:hover,
	button.active {
		color: #171a22;
		border-bottom: 2px solid #171a22;
	}
}
.form-control {
	font-size: 0.75rem;
}
.tabs_name {
	font-size: 0.875rem;
}
.padding-push-right {
	padding-right: 25%;
}

.custom-control-label {
	padding-top: 4px;
}
.custom-control-input:checked ~ .custom-control-label::before {
	color: #fff;
	border-color: #6e6e70;
	background-color: transparent;
}
.custom-radio .custom-control-input:checked ~ .custom-control-label::after {
	background-image: none;
	background-color: #6e6e70;
	width: 10px;
	height: 10px;
	border-radius: 50px;
	margin-left: 3px;
	margin-top: 3px;
}
.question_sect_wrap::-webkit-scrollbar {
	width: 4px;
}

.question_sect_wrap::-webkit-scrollbar-thumb {
	//background-color: #ddd !important;
}

/* Special styling for WebKit/Blink */
input[type="range"]::-webkit-slider-thumb {
	-webkit-appearance: none;
	border-radius: 0px;
	background: transparent;
	cursor: pointer;
	width: 0;
	height: 0;
	border-left: 10px solid transparent;
	border-right: 10px solid transparent;
	border-top: 15px solid #353535;
	margin-top: -25px;
}
input[type="range"]:focus::-webkit-slider-thumb {
	box-shadow: none !important;
	outline: none !important;
}
/* All the same stuff for Firefox */
input[type="range"]::-moz-range-thumb {
	// -webkit-appearance: none;
	// -moz-appearance: none;
	border-radius: 0px;
	background: transparent;
	cursor: pointer;
	width: 0;
	height: 0;
	border-left: 10px solid transparent;
	border-right: 10px solid transparent;
	border-top: 15px solid #353535;
	padding-bottom: 45px !important;
}
input[type="range"]:focus::-moz-range-thumb {
	box-shadow: none !important;
	outline: none !important;
}
/* All the same stuff for IE */
input[type="range"]::-ms-thumb {
	// -webkit-appearance: none;
	border-radius: 0px;
	background: transparent;
	cursor: pointer;
	width: 0;
	height: 0;
	border-left: 10px solid transparent;
	border-right: 10px solid transparent;
	border-top: 15px solid #353535;
	margin-top: -25px;
}

input[type="range"]::-webkit-slider-runnable-track {
	cursor: pointer;
	background: transparent;
}

input[type="range"]:focus::-webkit-slider-runnable-track {
	background: transparent;
}

input[type="range"]::-moz-range-track {
	cursor: pointer;
	background: transparent;
}

input[type="range"]::-ms-track {
	cursor: pointer;
	background: transparent;
}
input[type="range"]::-ms-fill-lower {
	background: transparent;
	// border: 0.2px solid #010101;
	border-radius: 2.6px;
	// box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
}
input[type="range"]:focus::-ms-fill-lower {
	background: transparent;
}
input[type="range"]::-ms-fill-upper {
	background: transparent;
	// border: 0.2px solid #010101;
	border-radius: 2.6px;
	// box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
}
input[type="range"]:focus::-ms-fill-upper {
	background: transparent;
}
.rangeSlider {
	display: block;
	width: 100%;
}
.rangeClass {
	display: flex;
	position: absolute;
	top: 16px;
	padding: 0 10px;
	width: 100%;
}
.custom-range {
	position: relative;
	z-index: 999;
	height: 45px;
	cursor: pointer;
}
.faActive {
	color: #353535;
}
.details_cmd_card .card-body {
	padding: 10px;
}
.viewIcon {
	opacity: 0.5;
	width: 10px;
}
.actionBtn .btn:hover .viewIcon,
.actionBtn .btn.active .viewIcon {
	opacity: 1;
}
.select-wrapper:after {
	font-family: FontAwesome;
	content: "\F0D7";
	font-size: 1rem;
	position: absolute;
	top: 3px;
	right: 10px;
	color: #d9d9d9;
	pointer-events: none;
}
.select-wrapper select {
	padding-right: 25px;
}
.truncateTwoLines {
	display: block;
	display: -webkit-box;
	// max-width: 200px;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
}

.cardFullHeight {
	height: 100vh;
	overflow: hidden;
}
.badge-light {
	border-radius: 50px;
}
.newGreen-theme {
	.cardActive {
		//background-color: #f4f4f4 !important;
	}
}
.table .thead-light th {
	color: #495057;
	background-color: #dedede;
	border-color: #d4d4d4;
}
.table-bordered thead th,
.table-bordered thead td {
	border-bottom-width: 1px;
}
.summarysubcardqr .colBoxtext span {
	font-size: 0.87em;
}

.loaderBackground {
	position: absolute;
	top: 2px;
	left: 7px;
	border: 16px solid rgba(255, 255, 255, 0.2); /* Light grey */
	border-top: 16px solid rgba(255, 255, 255, 0.53); /* Blue */
	border-radius: 50%;
	width: 10px;
	height: 10px;
	animation: spin 2s linear infinite;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>
