<template>
	<b-row v-if="integrated.linked">
		<b-col sm="12" lg="12">
			<b-row class="mb-3">
				<b-col sm="5">
					<label :for="`displayName-${i}-${j}`">{{ $t("displayName") }}</label>
				</b-col>
				<b-col sm="7">
					<b-form-input
						:id="`displayName-${i}-${j}`"
						type="text"
						v-model="integrated.displayName"
					></b-form-input>
				</b-col>
			</b-row>
		</b-col>
		<b-col sm="12" lg="12">
			<b-row class="mb-3">
				<b-col sm="5">
					<label :for="`color-${i}-${j}`">{{ $t("color") }}</label>
				</b-col>
				<b-col sm="7">
					<b-input-group :id="`color-${i}-${j}`">
						<b-form-input
							type="text"
							v-model="integrated.color"
						></b-form-input>
						<b-input-group-append>
							<b-form-input
								type="color"
								class="w-40px"
								v-model="integrated.color"
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
																v-model="integrated.minThreshold"
															></b-form-input>
															<!--UI not loading properly due to _signoff.scss file css -->
		<!-- <b-input-group-append is-text>
																<b-form-input
																	v-model="integrated.minThreshold"
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
																v-model="integrated.maxThreshold"
															></b-form-input>
															<b-input-group-append is-text>
																<b-form-input
																	v-model="integrated.maxThreshold"
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
						v-model="integrated.benchmarkLabel"
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
							v-model="integrated.benchmarkColor"
						></b-form-input>
						<b-input-group-append>
							<b-form-input
								type="color"
								class="w-40px"
								v-model="integrated.benchmarkColor"
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
							dataEntry(`benchmark-${tabGroup}-${tabId}-${subTabId}`)
						"
						>{{ $t("dataEntry") }}</b-button
					>
				</b-col>
			</b-row>
		</b-col>
	</b-row>
</template>
<script>
export default {
	props: ["i", "j", "tabGroup", "tabId", "subTabId", "dataEntry", "integrated"]
}
</script>