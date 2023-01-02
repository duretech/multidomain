<template>
	<!-- <div class="md_tabs py-3"> -->
	<div>
		<b-card no-body>
			<b-tabs card vertical nav-class="p-0" nav-wrapper-class="adminConfig">
				<b-tab
					:title="$t('moduleSetting')"
					active
					@click="updateActiveTab('summary')"
					class="pl-2 pb-0 pt-0 pr-0"
				>
					<b-card-text v-if="activeTab === 'summary'">
						<div class="md_nested_tabs">
							<b-card no-body>
								<b-tabs
									card
									class="border"
									nav-class="p-0 m-0"
									nav-wrapper-class="adminConfigInner p-0"
								>
									<b-tab
										:title="$t('moduleSetting')"
										active
										@click="updateActiveSubTab('summary')"
										class="p-0"
									>
										<!-- <b-card-text> -->
										<b-card-text v-if="activeSubTab === 'summary'">
											<div class="card-body">
												<div
													class="card-header p-5px bg-faint-grey default-card-border-radius"
													id="summary"
												>
													<h2 class="mb-0">
														<button
															class="btn btn-link w-100 text-left text-uppercase color-grey f-s-0-875rem"
															type="button"
															data-toggle="collapse"
															data-target="#summaryTarget"
															aria-expanded="true"
															aria-controls="summaryTarget"
														>
															{{ $t("Summary") }}
														</button>
													</h2>
												</div>
												<div
													id="summaryTarget"
													class="collapse collapse-section-border border show"
													aria-labelledby="summary"
												>
													<div class="px-3 py-2">
														<div class="form-group row mb-0">
															<label class="col-sm-6 col-form-label">{{
																$t("disable_module")
															}}</label>
															<div class="col-sm-6 pr-0">
																<b-form-checkbox
																	checked="modules.geoSummary.disable"
																	v-model="modules.geoSummary.disable"
																	name="disableModule"
																	switch
																	size="lg"
																	class="mt-1"
																/>
															</div>
														</div>
													</div>
												</div>
												<div
													class="card-header p-5px bg-faint-grey default-card-border-radius mt-3"
													id="geographicalSummary"
												>
													<h2 class="mb-0">
														<button
															class="btn btn-link w-100 text-left text-uppercase color-grey f-s-0-875rem"
															type="button"
															data-toggle="collapse"
															data-target="#geographicalSummaryTarget"
															aria-expanded="true"
															aria-controls="geographicalSummaryTarget"
														>
															{{ $t("gPro_tab") }}
														</button>
													</h2>
												</div>
												<div
													id="geographicalSummaryTarget"
													class="collapse collapse-section-border border show"
													aria-labelledby="geographicalSummary"
												>
													<div class="px-3 py-2">
														<div class="form-group row mb-0">
															<label class="col-sm-6 col-form-label">{{
																$t("disable_module")
															}}</label>
															<div class="col-sm-6 pr-0">
																<b-form-checkbox
																	checked="modules.geographical.disable"
																	v-model="modules.geographical.disable"
																	name="disableModule"
																	switch
																	size="lg"
																	class="mt-1"
																/>
															</div>
														</div>
													</div>
												</div>
												<div
													class="card-header p-5px bg-faint-grey default-card-border-radius mt-3"
													id="benchmarkingSummary"
												>
													<h2 class="mb-0">
														<button
															class="btn btn-link w-100 text-left text-uppercase color-grey f-s-0-875rem"
															type="button"
															data-toggle="collapse"
															data-target="#benchmarkingSummaryTarget"
															aria-expanded="true"
															aria-controls="benchmarkingSummaryTarget"
														>
															{{ $t("benchmarking") }}
														</button>
													</h2>
												</div>
												<div
													id="benchmarkingSummaryTarget"
													class="collapse collapse-section-border border show"
													aria-labelledby="benchmarkingSummary"
												>
													<div class="px-3 py-2">
														<div class="form-group row mb-0">
															<label class="col-sm-6 col-form-label">{{
																$t("disable_module")
															}}</label>
															<div class="col-sm-6 pr-0">
																<b-form-checkbox
																	checked="modules.benchmarking.disable"
																	v-model="modules.benchmarking.disable"
																	name="disableModule"
																	switch
																	size="lg"
																	class="mt-1"
																/>
															</div>
														</div>
													</div>
												</div>
												<div
													class="card-header p-5px bg-faint-grey default-card-border-radius mt-3"
													id="barrierSummary"
												>
													<h2 class="mb-0">
														<button
															class="btn btn-link w-100 text-left text-uppercase color-grey f-s-0-875rem"
															type="button"
															data-toggle="collapse"
															data-target="#barrierSummaryTarget"
															aria-expanded="true"
															aria-controls="barrierSummaryTarget"
														>
															{{ $t("barriers_enablers_tab") }}
														</button>
													</h2>
												</div>
												<div
													id="barrierSummaryTarget"
													class="collapse collapse-section-border border show"
													aria-labelledby="barrierSummary"
												>
													<div class="px-3 py-2">
														<div class="form-group row mb-0">
															<label class="col-sm-6 col-form-label">{{
																$t("disable_module")
															}}</label>
															<div class="col-sm-6 pr-0">
																<b-form-checkbox
																	checked="modules.barrier.disable"
																	v-model="modules.barrier.disable"
																	name="disableModule"
																	switch
																	size="lg"
																	class="mt-1"
																/>
															</div>
														</div>
													</div>
												</div>
												<div
													class="card-header p-5px bg-faint-grey default-card-border-radius mt-3"
													id="programSummary"
												>
													<h2 class="mb-0">
														<button
															class="btn btn-link w-100 text-left text-uppercase color-grey f-s-0-875rem"
															type="button"
															data-toggle="collapse"
															data-target="#programSummaryTarget"
															aria-expanded="true"
															aria-controls="programSummaryTarget"
														>
															{{ $t("proPrio") }}
														</button>
													</h2>
												</div>
												<div
													id="programSummaryTarget"
													class="collapse collapse-section-border border show"
													aria-labelledby="programSummary"
												>
													<div class="px-3 py-2">
														<div class="form-group row mb-0">
															<label class="col-sm-6 col-form-label">{{
																$t("disable_module")
															}}</label>
															<div class="col-sm-6 pr-0">
																<b-form-checkbox
																	checked="modules.program.disable"
																	v-model="modules.program.disable"
																	name="disableModule"
																	switch
																	size="lg"
																	class="mt-1"
																/>
															</div>
														</div>
													</div>
												</div>
												<div class="row mt-4">
													<div class="col-12 text-right">
														<button
															type="button"
															class="btn btn-primary black-btn"
															@click="saveModules()"
														>
															{{ $t("savebtn") }}
														</button>
													</div>
												</div>
											</div>
										</b-card-text>
									</b-tab>
								</b-tabs>
							</b-card>
						</div>
					</b-card-text>
				</b-tab>
				<b-tab
					v-if="!modules.geographical.disable"
					:title="$t('geoPro')"
					@click="updateActiveTab('adGeographicalModule')"
					class="pl-2 pb-0 pt-0 pr-0"
				>
					<b-card-text v-if="activeTab === 'adGeographicalModule'">
						<div class="md_nested_tabs">
							<b-card no-body>
								<transition name="slide-fade">
									<b-tabs
										card
										class="border"
										nav-class="p-0 m-0"
										nav-wrapper-class="adminConfigInner p-0"
									>
										<b-tab
											:title="$t('visits')"
											@click="updateActiveSubTab('visits')"
											class="p-0"
										>
											<!-- <b-card-text> -->
											<b-card-text v-if="activeSubTab === 'visits'">
												<geoConfigComp
													chartByModule="adGeographicalModule"
													chartByType="sourceType"
													chartBySubtype="Visits"
													:indicatorsList="indicatorsList"
													:dataElementsList="dataElementsList"
													:dataSetsList="dataSetsList"
													:metrixList="metrixList"
													:globalMapping="globalMapping"
												/>
											</b-card-text>
										</b-tab>
										<b-tab
											:title="$t('Commodities_Client')"
											@click="updateActiveSubTab('c_client')"
											class="p-0"
										>
											<!-- <b-card-text> -->
											<b-card-text v-if="activeSubTab === 'c_client'">
												<geoConfigComp
													chartByModule="adGeographicalModule"
													chartByType="sourceType"
													chartBySubtype="Commodities_Client"
													:indicatorsList="indicatorsList"
													:dataElementsList="dataElementsList"
													:dataSetsList="dataSetsList"
													:metrixList="metrixList"
													:globalMapping="globalMapping"
												/>
											</b-card-text>
										</b-tab>
										<b-tab
											:title="$t('Commodities_Facilities')"
											@click="updateActiveSubTab('c_facilities')"
											class="p-0"
										>
											<!-- <b-card-text> -->
											<b-card-text v-if="activeSubTab === 'c_facilities'">
												<geoConfigComp
													chartByModule="adGeographicalModule"
													chartByType="sourceType"
													chartBySubtype="Commodities_Facilities"
													:indicatorsList="indicatorsList"
													:dataElementsList="dataElementsList"
													:dataSetsList="dataSetsList"
													:metrixList="metrixList"
													:globalMapping="globalMapping"
												/>
											</b-card-text>
										</b-tab>
										<b-tab
											:title="$t('users')"
											@click="updateActiveSubTab('users')"
											class="p-0"
										>
											<!-- <b-card-text> -->
											<b-card-text v-if="activeSubTab === 'users'">
												<geoConfigComp
													chartByModule="adGeographicalModule"
													chartByType="sourceType"
													chartBySubtype="User"
													:indicatorsList="indicatorsList"
													:dataElementsList="dataElementsList"
													:dataSetsList="dataSetsList"
													:metrixList="metrixList"
													:globalMapping="globalMapping"
												/>
											</b-card-text>
										</b-tab>
										<b-tab
											:title="$t('EMU')"
											@click="updateActiveSubTab('emu')"
											class="p-0"
										>
											<!-- <b-card-text> -->
											<b-card-text v-if="activeSubTab === 'emu'">
												<geoConfigComp
													chartByModule="adGeographicalModule"
													chartByType="sourceType"
													chartBySubtype="EMU"
													:indicatorsList="indicatorsList"
													:dataElementsList="dataElementsList"
													:dataSetsList="dataSetsList"
													:metrixList="metrixList"
												/>
											</b-card-text>
										</b-tab>
									</b-tabs>
								</transition>
							</b-card>
						</div>
					</b-card-text>
				</b-tab>
				<b-tab
					v-if="!modules.barrier.disable"
					:title="$t('barriersEnablersAccess')"
					@click="updateActiveTab('adBarrierAccessModule')"
					class="pl-2 pb-0 pt-0 pr-0"
				>
					<b-card-text v-if="activeTab === 'adBarrierAccessModule'">
						<div class="md_nested_tabs">
							<b-card no-body>
								<b-tabs
									card
									class="border"
									nav-class="p-0 m-0"
									nav-wrapper-class="adminConfigInner p-0"
								>
									<b-tab
										:title="$t('access')"
										@click="updateActiveSubTab('access')"
										class="p-0"
									>
										<b-card-text v-if="activeSubTab === 'access'">
											<accessibilityConfigComponent
												chartByModule="adBarrierModule"
												chartByType="access"
												chartBySubtype="Accessibility"
												:indicatorsList="indicatorsList"
												:dataElementsList="dataElementsList"
												:dataSetsList="dataSetsList"
												:metrixList="metrixList"
												:globalMapping="globalMapping"
											/>
										</b-card-text>
									</b-tab>
									<b-tab
										:title="$t('insertion_Removal')"
										@click="updateActiveSubTab('services')"
										class="p-0"
									>
										<b-card-text v-if="activeSubTab === 'services'">
											<servicesConfigComponent
												chartByModule="adBarrierModule"
												chartByType="access"
												chartBySubtype="Services"
												:indicatorsList="indicatorsList"
												:dataElementsList="dataElementsList"
												:dataSetsList="dataSetsList"
												:metrixList="metrixList"
											/>
										</b-card-text>
									</b-tab>
								</b-tabs>
							</b-card>
						</div>
					</b-card-text>
				</b-tab>
				<b-tab
					v-if="!modules.barrier.disable"
					:title="$t('barriersEnablers_Stock')"
					@click="updateActiveTab('adBarrierStockModule')"
					class="pl-2 pb-0 pt-0 pr-0"
				>
					<b-card-text v-if="activeTab === 'adBarrierStockModule'">
						<div class="md_nested_tabs">
							<b-card no-body>
								<b-tabs
									card
									class="border"
									nav-class="p-0 m-0"
									nav-wrapper-class="adminConfigInner p-0"
								>
									<b-tab
										:title="$t('stock')"
										@click="updateActiveSubTab('stock')"
										class="p-0"
									>
										<b-card-text v-if="activeSubTab === 'stock'">
											<stockConfigComponent
												chartByModule="adBarrierModule"
												chartByType="stock"
												chartBySubtype="Stock"
												:indicatorsList="indicatorsList"
												:dataElementsList="dataElementsList"
												:dataSetsList="dataSetsList"
												:metrixList="metrixList"
												:globalMapping="globalMapping"
											/>
										</b-card-text>
									</b-tab>
								</b-tabs>
							</b-card>
						</div>
					</b-card-text>
				</b-tab>
				<b-tab
					v-if="!modules.program.disable"
					:title="$t('proPrio')"
					@click="updateActiveTab('adProgramModule')"
					class="pl-2 pb-0 pt-0 pr-0"
				>
					<b-card-text v-if="activeTab === 'adProgramModule'">
						<div class="md_nested_tabs">
							<div class="row mb-4">
								<div class="col-lg-12">
									<div class="card">
										<div class="card-body">
											<div class="row">
												<div class="col-lg-12">
													<div class="form-group row">
														<label
															for="finalYear"
															class="col-sm-5 col-form-label"
															>{{ $t("catInformation") }}</label
														>
														<div class="col-sm-7">
															<vue-editor
																v-model="programCategoryInfo"
																:state="programCategoryInfo.length !== 0"
																:editorToolbar="customToolbar"
																:placeholder="$t('enter_category_information')"
															></vue-editor>
														</div>
													</div>
												</div>
												<div class="col-12 text-center">
													<button
														type="button"
														class="btn btn-primary black-btn"
														@click="saveBgData('programPriorities')"
													>
														{{ $t("savebtn") }}
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<b-card no-body>
								<b-tabs
									card
									class="border"
									nav-class="p-0 m-0"
									nav-wrapper-class="adminConfigInner p-0"
								>
									<b-tab
										:title="$t('Comparing PPFP Uptake')"
										active
										@click="updateActiveSubTab('Comparing_PPFP_Uptake')"
										class="p-0"
									>
										<!-- <b-card-text> -->
										<b-card-text
											v-if="activeSubTab === 'Comparing_PPFP_Uptake'"
										>
											<pp-config-component
												chartByModule="adProgramModule"
												chartByType="programPriorities"
												chartBySubtype="Comparing_PPFP_Uptake"
												:indicatorsList="indicatorsList"
												:dataElementsList="dataElementsList"
												:dataSetsList="dataSetsList"
												:metrixList="metrixList"
												@getBGInfo="getBGInfo"
											/>
										</b-card-text>
									</b-tab>
									<b-tab
										:title="$t('Trends in PPFP Uptake')"
										@click="updateActiveSubTab('Trends_in_PPFP_Uptake')"
										class="p-0"
									>
										<!-- <b-card-text> -->
										<b-card-text
											v-if="activeSubTab === 'Trends_in_PPFP_Uptake'"
										>
											<pp-config-component
												chartByModule="adProgramModule"
												chartByType="programPriorities"
												chartBySubtype="Trends_in_PPFP_Uptake"
												:indicatorsList="indicatorsList"
												:dataElementsList="dataElementsList"
												:dataSetsList="dataSetsList"
												:metrixList="metrixList"
												@getBGInfo="getBGInfo"
											/>
										</b-card-text>
									</b-tab>
									<b-tab
										:title="$t('PPFP_Conti')"
										@click="updateActiveSubTab('PPFP_Continuum')"
										class="p-0"
									>
										<!-- <b-card-text> -->
										<b-card-text v-if="activeSubTab === 'PPFP_Continuum'">
											<pp-config-component
												chartByModule="adProgramModule"
												chartByType="programPriorities"
												chartBySubtype="PPFP_Continuum"
												:indicatorsList="indicatorsList"
												:dataElementsList="dataElementsList"
												:dataSetsList="dataSetsList"
												:metrixList="metrixList"
												@getBGInfo="getBGInfo"
											/>
										</b-card-text>
									</b-tab>
									<b-tab
										:title="$t('overall_PPFP_use')"
										@click="updateActiveSubTab('Overall_PPFP_Use')"
										class="p-0"
									>
										<!-- <b-card-text> -->
										<b-card-text v-if="activeSubTab === 'Overall_PPFP_Use'">
											<pp-config-component
												chartByModule="adProgramModule"
												chartByType="programPriorities"
												chartBySubtype="Overall_PPFP_Use"
												:indicatorsList="indicatorsList"
												:dataElementsList="dataElementsList"
												:dataSetsList="dataSetsList"
												:metrixList="metrixList"
												@getBGInfo="getBGInfo"
											/>
										</b-card-text>
									</b-tab>
									<b-tab
										:title="$t('comparing_PPFP_Method')"
										@click="updateActiveSubTab('Comparing_PPFP_Method')"
										class="p-0"
									>
										<!-- <b-card-text> -->
										<b-card-text
											v-if="activeSubTab === 'Comparing_PPFP_Method'"
										>
											<pp-config-component
												chartByModule="adProgramModule"
												chartByType="programPriorities"
												chartBySubtype="Comparing_PPFP_Method"
												:indicatorsList="indicatorsList"
												:dataElementsList="dataElementsList"
												:dataSetsList="dataSetsList"
												:metrixList="metrixList"
												@getBGInfo="getBGInfo"
											/>
										</b-card-text>
									</b-tab>
									<!-- <b-tab :title="$t('PPFP_ServiceProvider')" @click="updateActiveSubTab('PPFP_Service_Provider')" class="p-0">
                  <b-card-text v-if="activeSubTab === 'PPFP_Service_Provider'" class="p-3">
                    <anchor-map-config-component
                      chartByModule="adProgramModule"
                      chartByType="programPriorities"
                      chartBySubtype="PPFP_Service_Provider"
                      :indicatorsList="indicatorsList"
                      :dataElementsList="dataElementsList"
                      :dataSetsList="dataSetsList"
                      :metrixList="metrixList"
                      :bProgramPriority="true"
                      :orgList="orgList"
                      :defaultLevelID="defaultLevelID"
                      v-if="defaultLevelID"
                    />
                  </b-card-text>
                </b-tab> -->
								</b-tabs>
							</b-card>
						</div>
					</b-card-text>
				</b-tab>
				<b-tab
					v-if="!modules.program.disable"
					:title="$t('proPrio_youth')"
					@click="updateActiveTab('adProgramYouthModule')"
					class="pl-2 pb-0 pt-0 pr-0"
				>
					<b-card-text v-if="activeTab === 'adProgramYouthModule'">
						<div class="md_nested_tabs">
							<div class="row mb-4">
								<div class="col-lg-12">
									<div class="card">
										<div class="card-body">
											<div class="row">
												<div class="col-lg-12">
													<div class="form-group row">
														<label
															for="finalYear"
															class="col-sm-5 col-form-label"
															>{{ $t("catInformation") }}</label
														>
														<div class="col-sm-7">
															<vue-editor
																v-model="youthCategoryInfo"
																:state="youthCategoryInfo.length !== 0"
																:editorToolbar="customToolbar"
																:placeholder="$t('enter_category_information')"
															></vue-editor>
														</div>
													</div>
												</div>
												<div class="col-12 text-center">
													<button
														type="button"
														class="btn btn-primary black-btn"
														@click="saveBgData('youth')"
													>
														{{ $t("savebtn") }}
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<b-card no-body>
								<b-tabs
									card
									class="border"
									nav-class="p-0 m-0"
									nav-wrapper-class="adminConfigInner p-0"
								>
									<b-tab
										:title="$t('youth')"
										@click="updateActiveSubTab('youth')"
										class="p-0"
									>
										<b-card-text v-if="activeSubTab === 'youth'">
											<youthConfigComponent
												chartByModule="adProgramModule"
												chartByType="youth"
												chartBySubtype="Youth"
												:indicatorsList="indicatorsList"
												:dataElementsList="dataElementsList"
												:dataSetsList="dataSetsList"
												:metrixList="metrixList"
												:globalMapping="globalMapping"
												@getBGInfo="getBGInfo"
											/>
										</b-card-text>
									</b-tab>
									<b-tab
										:title="$t('adolescentPregnancy')"
										@click="updateActiveSubTab('adolescentPregnancy')"
										class="p-0"
									>
										<b-card-text v-if="activeSubTab === 'adolescentPregnancy'">
											<youthConfigComponent
												chartByModule="adProgramModule"
												chartByType="youth"
												chartBySubtype="Adolescent_Pregnancy"
												:indicatorsList="indicatorsList"
												:dataElementsList="dataElementsList"
												:dataSetsList="dataSetsList"
												:metrixList="metrixList"
												:hideIndicatorsType="true"
												:hideIdentifiers="true"
												@getBGInfo="getBGInfo"
											/>
										</b-card-text>
									</b-tab>
									<b-tab
										:title="$t('youthNoMethod')"
										@click="updateActiveSubTab('youthNoMethod')"
										class="p-0"
									>
										<b-card-text v-if="activeSubTab === 'youthNoMethod'">
											<youthConfigComponent
												chartByModule="adProgramModule"
												chartByType="youth"
												chartBySubtype="Youth_NoMethod"
												:indicatorsList="indicatorsList"
												:dataElementsList="dataElementsList"
												:dataSetsList="dataSetsList"
												:metrixList="metrixList"
												:hideIndicatorsType="true"
												:hideIdentifiers="true"
												@getBGInfo="getBGInfo"
											/>
										</b-card-text>
									</b-tab>
									<b-tab
										:title="$t('youthAvailability')"
										@click="updateActiveSubTab('youthAvailability')"
										class="p-0"
									>
										<b-card-text v-if="activeSubTab === 'youthAvailability'">
											<youthConfigComponent
												chartByModule="adProgramModule"
												chartByType="youth"
												chartBySubtype="Youth_Availability"
												:indicatorsList="indicatorsList"
												:dataElementsList="dataElementsList"
												:dataSetsList="dataSetsList"
												:metrixList="metrixList"
												:disableIndicatorsType="true"
												:hideIdentifiers="true"
												@getBGInfo="getBGInfo"
											/>
										</b-card-text>
									</b-tab>
								</b-tabs>
							</b-card>
						</div>
					</b-card-text>
				</b-tab>
				<b-tab
					v-if="
						!modules.geographical.disable ||
						!modules.barrier.disable ||
						!modules.program.disable
					"
					:title="$t('anchorMap')"
					@click="updateActiveTab('adAnchorMapModule')"
					class="pl-2 pb-0 pt-0 pr-0"
				>
					<b-card-text v-if="activeTab === 'adAnchorMapModule'">
						<div class="container-fluid px-0">
							<!-- <div class="row dashboardchart-container globalconfigcontainer"> -->
							<div class="row dashboardchart-container">
								<div class="col-lg-12">
									<anchor-map-config-component
										chartByModule="adAnchorMapModule"
										chartByType="anchorMap"
										chartBySubtype="anchorMap"
										:indicatorsList="indicatorsList"
										:dataElementsList="dataElementsList"
										:dataSetsList="dataSetsList"
										:metrixList="metrixList"
										:orgList="orgList"
										:defaultLevelID="defaultLevelID"
										v-if="defaultLevelID"
									/>
								</div>
							</div>
						</div>
					</b-card-text>
				</b-tab>
			</b-tabs>
		</b-card>
	</div>
</template>
<script>
/*global settings*/
/*eslint no-undef: "error"*/
import service from "@/service";
import ppConfig from "@/config/programPrioritiesConfig.js";
import modules from "@/config/modules.js";
import { VueEditor } from "vue2-editor";
import assign from "lodash/assign";
import VueEditorOptionMixin from "@/helpers/VueEditorOptionMixin";
export default {
	props: [
		"indicatorsList",
		"dataElementsList",
		"dataSetsList",
		"metrixList",
		"orgList",
		"globalMapping",
	],
	mixins: [VueEditorOptionMixin],
	components: {
		ppConfigComponent: () =>
			import(
				/* webpackChunkName: "admin_ad_program_priorities" */ "./program_priorities/configComponent"
			),
		youthConfigComponent: () =>
			import(
				/* webpackChunkName: "admin_ad_program_priorities_youth" */ "./program_priorities/youthConfigComponent"
			),
		anchorMapConfigComponent: () =>
			import(
				/* webpackChunkName: "admin_ad_anchorMap"*/ "./anchor_map/mapConfigComponent"
			),
		geoConfigComp: () =>
			import(
				/* webpackChunkName: "admin_ad_geographical"*/ "./geographical/geoconfigcomp.vue"
			),
		accessibilityConfigComponent: () =>
			import(
				/* webpackChunkName: "admin_ad_barriers_availability"*/ "./barriers/accessibilityConfigComponent"
			),
		servicesConfigComponent: () =>
			import(
				/* webpackChunkName: "admin_ad_barriers_insertionRemoval"*/ "./barriers/servicesConfigComponent"
			),
		stockConfigComponent: () =>
			import(
				/* webpackChunkName: "admin_ad_barriers_stock"*/ "./barriers/stockConfigComponent"
			),
		VueEditor,
	},
	data() {
		// console.log(this.dataElementsList);
		return {
			activeTab: "summary",
			activeSubTab: "summary",
			activeChartSection: "Average_visits_by_facility",
			defaultLevelID: "",
			programCategoryInfo: "",
			youthCategoryInfo: "",
			modules: modules.module,
		};
	},
	methods: {
		/**
		 * This is to update active tab name, On the base of the active tab we will render the component.
		 * Usage: `updateActiveTab(tab_name)`
		 * @param {String} tab_name required options
		 * @return {String} updateActiveTab name
		 */
		updateActiveTab(tab_name) {
			this.activeTab = tab_name;
			if (tab_name === "adGeographicalModule") {
				this.activeSubTab = "visits";
			} else if (tab_name === "adProgramModule") {
				this.activeSubTab = "Comparing_PPFP_Uptake";
			} else if (tab_name === "adProgramYouthModule") {
				this.activeSubTab = "youth";
			} else if (tab_name == "adBarrierModule") {
				this.activeSubTab = "system";
			} else if (tab_name === "adBarrierAccessModule") {
				this.activeSubTab = "access";
			} else if (tab_name === "adBarrierStockModule") {
				this.activeSubTab = "stock";
			} else if (tab_name === "summary") {
				this.activeSubTab = "summary";
			} else {
				this.activeSubTab = "visits";
			}
		},

		/**
		 * This is to update active sub tab name.
		 * Usage: `updateActiveSubTab(tab_name)`
		 * @param {String} tab_name required options
		 * @return {String} updateActiveSubTab name
		 */
		updateActiveSubTab(tab_name) {
			this.activeSubTab = tab_name;
			if (this.activeSubTab == "system") {
				this.activeChartSection = "Average_visits_by_facility";
			} else if (this.activeSubTab == "access") {
				this.activeChartSection = "Comparing_method_access";
			}
		},

		updateActiveChartSection(tab_name) {
			this.activeChartSection = tab_name;
		},
		getModules() {
			let key = this.generateKey("modules", false);

			service.getSavedConfig(key).then((response) => {
				this.modules = assign(this.modules, response.data);
			});
		},
		getBGInfo(response) {
			let programCategoryInfo =
					response["programPriorities"]["Category_Data"]["categoryInformation"],
				youthCategoryInfo =
					response["youth"]["Category_Data"]["categoryInformation"];
			this.programCategoryInfo = programCategoryInfo
				? programCategoryInfo
				: this.programCategoryInfo;
			this.youthCategoryInfo = youthCategoryInfo
				? youthCategoryInfo
				: this.youthCategoryInfo;
		},
		saveBgData(p_type) {
			// console.log(p_type)
			// console.log(this.backgroundData)
			// console.log(this.backgroundDataMonthly)
			this.$store.state.loading = true;

			let key = this.generateKey("adProgramModule");

			// console.log("key", key)
			let allKeys = service.getAllKeys();
			allKeys.then((keys) => {
				if (keys.data.includes(key)) {
					let saveConfig = service.getSavedConfig(key);
					saveConfig.then((res) => {
						let configData = res.data;
						// console.log(configData)
						// console.log("configData",configData);
						if (p_type === "programPriorities") {
							if (!configData[p_type]) {
								configData[p_type] = {
									Category_Data: {
										categoryInformation: this.programCategoryInfo,
									},
								};
							} else {
								configData[p_type] = {
									...configData[p_type],
									Category_Data: {
										categoryInformation: this.programCategoryInfo,
									},
								};
							}
						}

						if (p_type === "youth") {
							if (!configData[p_type]) {
								configData[p_type] = {
									Category_Data: {
										categoryInformation: this.youthCategoryInfo,
									},
								};
							} else {
								configData[p_type] = {
									...configData[p_type],
									Category_Data: {
										categoryInformation: this.youthCategoryInfo,
									},
								};
							}
						}

						let response = service.updateConfig(configData, key);
						response
							.then((response) => {
								if (response.data.status === "OK") {
									// console.log("response update ", response.data)
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
							.catch(() => {
								this.$swal({
									title: this.$i18n.t("error"),
								});

								this.$store.state.loading = false;
								return;
							});
					});
				} else {
					let dqr = {};
					if (p_type === "programPriorities") {
						let oConfig = ppConfig.adProgramModule[p_type];
						oConfig.Category_Data.categoryInformation =
							this.programCategoryInfo;
						dqr = oConfig;
					}
					if (p_type === "youth") {
						let oConfig = ppConfig.adProgramModule[p_type];
						oConfig.Category_Data.categoryInformation = this.youthCategoryInfo;
						dqr = oConfig;
					}

					let response = service.saveConfig(dqr, key);
					response.then((response) => {
						if (response.data.status === "OK") {
							// console.log("response save ", response.data)
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
				}
			});
		},
		saveModules() {
			// console.log(p_type)
			// console.log(this.backgroundData)
			// console.log(this.backgroundDataMonthly)
			this.$store.state.loading = true;
			let key = this.generateKey("modules", false);

			// console.log("key", key)
			let allKeys = service.getAllKeys();
			allKeys.then((keys) => {
				if (keys.data.includes(key)) {
					let saveConfig = service.getSavedConfig(key);
					saveConfig.then((res) => {
						let configData = assign(res.data, this.modules);
						// console.log(configData)
						// console.log("configData",configData);

						let response = service.updateConfig(configData, key);
						response
							.then((response) => {
								if (response.data.status === "OK") {
									// console.log("response update ", response.data)
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
							.catch(() => {
								this.$swal({
									title: this.$i18n.t("error"),
								});
								this.$store.state.loading = false;
								return;
							});
					});
				} else {
					let data = this.modules;
					let response = service.saveConfig(data, key);
					response.then((response) => {
						if (response.data.status === "OK") {
							// console.log("response save ", response.data)
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
				}
			});
		},
	},
	created() {
		let { levelID } = service.getAllowedLocation();
		this.defaultLevelID = levelID;
		this.getModules();
	},
};
</script>
