<template>
	<div>
		<div class="card-body">
			<div class="row">
				<div class="col">
					<div class="card">
						<div
							class="card-header bg-faint-grey color-black border-radius-0 text-uppercase f-s-0-875rem font-weight-bold"
						>
							{{ $t("mapping") }}
						</div>
						<div class="card-body border">
							<div class="row" v-for="(value, index) in summary" :key="index">
								<div class="col-12">
									<div
										class="default-card-border-radius"
										:id="'headingChartSettings' + index"
									>
										<h2 class="">
											<button
												class="btn btn-link p-0 w-100 text-left text-uppercase color-grey f-s-0-875rem"
												type="button"
												data-toggle="collapse"
												:data-target="'#collapseChartSettings' + index"
												aria-expanded="false"
												:aria-controls="'collapseChartSettings' + index"
											>
												<i
													class="fa fa-cog f-s-20px pr-2"
													v-b-tooltip.hover
													:title="$t('dataMapping')"
												></i>
												{{ $t(`${value.name}`) }}
											</button>
										</h2>
									</div>
									<div
										:id="'collapseChartSettings' + index"
										class="collapse collapse-section-border"
										:aria-labelledby="'headingChartSettings' + index"
									>
										<div class="row m-0 my-2">
											<div
												class="col-12 mb-2"
												v-if="value.name === 'Stock-out'"
											>
												<strong>{{ $t("note") }}:</strong>
												{{ $t("note_tittle1") }}
											</div>
											<div
												class="col-12 mb-2"
												v-if="value.name === 'Reporting Rate'"
											>
												<strong>{{ $t("note") }}:</strong>
												{{ $t("note_tittle2") }}
												<strong
													>{{ $t("globalSettings") }}
													->
													{{ $t("reportingRateBenchmarking") }}</strong
												>
											</div>
											<div
												class="col-12"
												v-for="(v, ind) in value.methods"
												:key="v.name + index + ind"
											>
												<div class="form-check form-check-inline pure-checkbox">
													<input
														class="form-check-input"
														type="radio"
														:id="'inlineRadio1' + ind + index"
														:value="v"
														v-model="value.selected"
														:checked="value.selected.name === v.name"
													/>
													<label
														class="form-check-label"
														:for="'inlineRadio1' + ind + index"
														>{{ $t(`${v.name}`) }}</label
													>
												</div>
												<div class="p-3" v-if="value.selected.name === v.name">
													<div class="row">
														<div class="col-12">
															<div class="form-group row">
																<label class="col-sm-5 col-form-label"
																	>{{ $t("percentageIndicator") }}
																</label>
																<div class="col-sm-7">
																	<b-form-checkbox
																		switch
																		size="sm"
																		v-model="value.selected.percentage"
																	/>
																</div>
															</div>
															<div
																class="form-group row"
																v-if="value.name === 'EMU'"
															>
																<label class="col-sm-5 col-form-label"
																	>{{ $t("comparePriorityIndicator") }}
																</label>
																<div class="col-sm-7">
																	<b-form-checkbox
																		switch
																		size="sm"
																		v-model="
																			value.selected.comparePriorityIndicator
																		"
																	/>
																</div>
															</div>
															<div
																class="form-group row"
																v-if="value.name !== 'Reporting Rate'"
															>
																<label class="col-sm-5 col-form-label"
																	>{{ $t("benchmark") }}
																</label>
																<div class="col-sm-7">
																	<input
																		type="number"
																		class="form-control"
																		:placeholder="
																			$t('placeholderBenchmarkValue')
																		"
																		v-model="value.selected.benchmark"
																	/>
																</div>
															</div>
															<!-- <div
																class="row"
																v-if="
																	value.selected.prdSettings &&
																	Object.keys(value.selected.prdSettings).length
																"
															>
																<div class="col-12">
																	<b-tabs>
																		<template
																			v-for="(prdValue, prdKey, prdInd) in value
																				.selected.prdSettings"
																		>
																			<b-tab
																				:title="getPrdTitle(prdKey)"
																				:key="
																					'prdSettings' + index + ind + prdInd
																				"
																				v-if="
																					value.name !== 'EMU' ||
																					(value.name === 'EMU' &&
																						prdKey !== 'quarterly')
																				"
																			>
																				<div class="p-2">
																					<div
																						class="form-group row"
																						v-if="
																							value.name !== 'Reporting Rate'
																						"
																					>
																						<label
																							class="col-sm-5 col-form-label"
																							>{{ $t("benchmark") }}
																						</label>
																						<div class="col-sm-7">
																							<input
																								type="number"
																								class="form-control"
																								:placeholder="
																									$t(
																										'placeholderBenchmarkValue'
																									)
																								"
																								v-model="prdValue.benchmark"
																							/>
																						</div>
																					</div>
																					<div class="row">
																						<DynamicNarration
																							:i="index"
																							:j="ind"
																							:summaryText.sync="
																								prdValue.summaryText
																							"
																						/>
																					</div>
																				</div>
																			</b-tab>
																		</template>
																	</b-tabs>
																</div>
															</div> -->
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
			<div class="row pt-4">
				<div class="col text-right">
					<button
						type="button"
						class="btn btn-primary black-btn"
						v-on:click="updateConfigData"
					>
						{{ $t("savebtn") }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import config from "@/config/ministerialConfig.js";
import service from "@/service";
import merge from "lodash/merge";
import assign from "lodash/assign";
import audit from "../audit.js";

export default {
	data() {
		return {
			summary: config.ministrialModule.summary,
			originalData: null,
		};
	},
	components: {
		// DynamicNarration: () =>
		// 	import(
		// 		/* webpackChunkName: "admin_DynamicNarration"*/ "@/components/config/DynamicNarration"
		// 	),
	},
	methods: {
		getPrdTitle(val) {
			let txt = "";
			if (val === "monthly") {
				txt = this.$i18n.t("monthly");
			}
			if (val === "quarterly") {
				txt = this.$i18n.t("quarterly");
			}
			if (val === "yearly") {
				txt = this.$i18n.t("yearly");
			}
			return txt;
		},
		//This is to fetch config data on page load
		getConfigData() {
			this.$store.state.loading = true;
			let key = this.generateKey("ministrialModule");

			let response = service.getSavedConfig(key);
			response
				.then((response) => {
					if (response.data.summary) {
						this.summary = merge(this.summary, response.data.summary);
						this.originalData = JSON.parse(
							JSON.stringify(response.data.summary)
						);
					}
					this.$store.state.loading = false;
				})
				.catch((res) => {
					console.log("Config not found...");
					this.$store.state.loading = false;
				});
		},
		//This is to update config data on click of save button
		updateConfigData() {
			this.$store.state.loading = true;
			let key = this.generateKey("ministrialModule");

			let allKeys = service.getAllKeys();
			allKeys
				.then((keys) => {
					if (keys.data.includes(key)) {
						let saveConfig = service.getSavedConfig(key);
						saveConfig.then((res) => {
							let configData = res.data;
							configData.summary = assign(configData.summary, this.summary);
							configData.summary = configData.summary.map((s) => {
								return {
									...s,
									methods: s.methods.map((m) => {
										if (m.name === s.selected.name) {
											return s.selected;
										} else {
											return m;
										}
									}),
								};
							});
							let configChanges = audit.configAudit(
								this.originalData,
								configData.summary
							);
							let response = service.updateConfig(configData, key);
							response
								.then((response) => {
									if (response.data.status === "OK") {
										this.$swal({
											title: this.$i18n.t("data_saved_successfully"),
										}).then(() => {
											if (Object.keys(configChanges).length) {
												audit.processAudit(
													"process3",
													key,
													configChanges,
													"summary"
												);
											}
										});
										this.getConfigData();
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
									this.$swal({
										title: this.$i18n.t("error"),
									});
									this.$store.state.loading = false;
									return;
								});
						});
					} else {
						let ministrial = {
							summary: this.summary,
						};
						let response = service.saveConfig(ministrial, key);
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
					}
				})
				.catch(() => {
					this.$store.state.loading = false;
				});
		},
	},
	created() {
		this.getConfigData(); //Remove / add $store.state.loading in updated when you enable / disable this call
	},
	updated() {
		// this.$store.state.loading = false
	},
};
</script>
