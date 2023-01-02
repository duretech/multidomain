<template>
	<div>
		<div class="row mb-5" id="dqreporting">
			<div class="col-lg-12">
				<TabSummary :content="categoryInfo" :contKey="contName" />
				<fullscreen
					v-model="nationalReportingTrendFull"
					ref="fullscreen"
					class="fullContainer"
				>
					<div
						class="card bg-transparent border-none fullContent"
						v-if="nationalReportingTrendDisable"
					>
						<loader class="cardLoader" v-if="showLoader1" />
						<div
							class="card-header px-2 py-1 text-decoration-none border-t-l-radius-10px border-t-r-radius-10px"
						>
							<div class="row no-gutters">
								<div
									class="col-lg-9 col-md-9 p-t-4px"
									:class="{ 'col-lg-12 col-md-12': nationalReportingTrendFull }"
								>
									<div class="cardTitleSection text-wrap fs-19-1920">
										<i
											class="fa fa-info-circle color-white cursor-pointer chart-info mx-2"
											aria-hidden="true"
											v-b-popover.hover.rightbottom="{
												variant: 'info',
												content: nationalReportingTrendChartInfo,
												title: nationalReportingTrendChartName,
												html: true,
											}"
										></i>
										<p class="title_p fs-19-1920 m-0">
											{{ nationalReportingTrendChartName }}
										</p>
									</div>
								</div>
								<div
									class="col-lg-3 col-md-3 position-relative"
									v-if="!nationalReportingTrendFull"
								>
									<ChartOptions
										sorting="type3"
										@dataSort="dataSort"
										defaultSort="JAN-DEC"
										:drillDown="drillDown"
										@showTable="showTable"
										@exportChart="exportChart"
										:cID="nationalReportingTrendCID"
										chartKey="nationalReportingTrend"
										@toggleFullscreen="toggleFullscreen"
										:trendTable="nationalReportingTrendTable"
										v-if="nationalReportingTrend.series.length && !isHideOption"
									/>
								</div>
							</div>
						</div>
						<div
							class="card-body p-0 offwhite-bg border-b-l-radius-10px border-b-r-radius-10px"
						>
							<div class="row m-0">
								<div
									class="position-relative"
									:class="
										nationalReportingTrend.series.length
											? signOffActive
												? 'col-12'
												: 'col-lg-9'
											: 'col-12'
									"
								>
									<div
										class="row mb-3"
										:class="{ hidden: nationalReportingTrendType === 'table' }"
										v-if="nationalReportingTrend.series.length > 0"
									>
										<div class="col-lg-12 col-md-12">
											<ChartFilters
												chartRef="nationalReportingTrend"
												:plotOptions="plotOptions"
												:plotType="nationalReportingTrend.chart.type"
												@changePlotType="getChartPlotType"
											/>
										</div>
									</div>
									<template v-if="nationalReportingTrendType !== 'table'">
										<highcharts
											ref="nationalReportingTrend"
											class="chartHeight m-t-10px"
											:options="nationalReportingTrend"
											v-if="nationalReportingTrend.series.length"
										></highcharts>
										<div class="my-4 text-center" v-else style="height: 410px">
											{{ $t("no_data_to_display") }}
										</div>
									</template>
									<template v-else>
										<div class="chartHeight text-center mb-2">
											<b-table
												head-variant="light"
												sticky-header
												class="mb-0"
												v-if="nationalReportingTrend.series.length"
												:bordered="true"
												hover
												:items="nationalReportingTrendTable.items"
												:fields="nationalReportingTrendTable.fields"
												ref="nationalReportingTrend"
											>
												<template v-slot:cell(show_regions)="row">
													<b-form-checkbox
														v-model="row.detailsShowing"
														@change="row.toggleDetails"
													>
													</b-form-checkbox>
												</template>
												<template v-slot:row-details="row">
													<b-card>
														<b-table
															head-variant="light"
															hover
															:items="row.item.regions"
														></b-table>
													</b-card>
												</template>
											</b-table>
											<div
												class="my-4 text-center"
												v-else
												style="height: 410px"
											>
												{{ $t("no_data_to_display") }}
											</div>
										</div>
									</template>
								</div>
								<div
									class="bg-warm-grey outlier_wrapper_scrollbar first_outlier"
									:class="signOffActive ? 'col-12' : 'col-lg-3'"
									v-if="nationalReportingTrend.series.length > 0"
								>
									<template
										v-if="
											nationalReportingTrend.yAxis.plotLines.length > 0 &&
											nationalReportingTrend.yAxis.plotLines[0].enabled
										"
									>
										<div class="regionselectioncontainer m-t-10px">
											<p class="mb-0">
												<span class="border-bottom-black font-weight-bold"
													>{{
														$t("rr_text1", {
															option:
																filters === "Reporting Rate (On Time)"
																	? $t("rr_text1_opt2")
																	: $t("rr_text1_opt1"),
														})
													}}
													{{
														nationalReportingTrend.yAxis.plotLines[0].value
													}}%</span
												>
											</p>
										</div>
										<div
											class="pillcontainer m-t-10px border-bottom-0 outlier_scrollbar"
											v-if="nationalReportingTrendOutlier.length > 0"
										>
											<div
												v-for="(o, i) in nationalReportingTrendOutlier"
												:key="i"
											>
												<div>
													<strong>{{ o.name }}</strong>
												</div>
												<h6 class="d-inline-block" v-if="o.outlier.length > 0">
													<b-badge
														variant="secondary"
														class="m-1 shadow-sm selection-pills"
														v-for="(o, i) in o.outlier"
														:key="i"
														>{{ o }}</b-badge
													>
												</h6>
												<div class="my-3 text-center" v-else>NA</div>
											</div>
										</div>
										<div class="text-center m-t-20px" v-else>NA</div>
									</template>
									<template>
										<div class="regionselectioncontainer m-t-10px">
											<p class="mb-0">
												<span class="border-bottom-black font-weight-bold">{{
													$t("rr_text2", {
														substantialChange: substantialChange,
														substantialChangeAvg: substantialChangeAvg
															? `(${substantialChangeAvg})%`
															: "",
													})
												}}</span>
											</p>
										</div>
										<div
											class="pillcontainer m-t-10px border-bottom-0"
											v-if="substantialChangeOutlier.length > 0"
										>
											<div
												class="text-center"
												v-if="
													substantialChangeOutlier[0] === $t('noRegionsFound')
												"
											>
												{{ substantialChangeOutlier[0] }}
											</div>
											<h6 class="d-inline-block outlier_scrollbar" v-else>
												<b-badge
													variant="secondary"
													class="m-1 shadow-sm selection-pills"
													v-for="(o, i) in substantialChangeOutlier"
													:key="i"
													>{{ o }}</b-badge
												>
											</h6>
										</div>
										<div class="text-center m-t-20px" v-else>NA</div>
									</template>
									<template v-if="nationalReportingTrendType !== 'table'">
										<div class="regionselectioncontainer m-t-10px">
											<p class="mb-0">
												<span class="border-bottom-black font-weight-bold">{{
													$t("rr_text3")
												}}</span>
											</p>
										</div>
										<div
											class="pillcontainer m-t-10px border-bottom-0"
											v-if="nationalRegionReportingTrendOutlier.length > 0"
										>
											<div
												class="text-center"
												v-if="
													nationalRegionReportingTrendOutlier[0] ===
													$t('noRegionsFound')
												"
											>
												{{ nationalRegionReportingTrendOutlier[0] }}
											</div>
											<h6 class="d-inline-block outlier_scrollbar" v-else>
												<b-badge
													variant="secondary"
													class="m-1 shadow-sm selection-pills"
													v-for="(o, i) in nationalRegionReportingTrendOutlier"
													:key="i"
													>{{ o }}</b-badge
												>
											</h6>
										</div>
										<div class="text-center m-t-20px" v-else>
											<i class="mr-2 fa fa-arrow-left"></i
											>{{
												$t("rr_text4", {
													lineType: $t(`${nationalReportingTrend.chart.type}`),
												})
											}}
										</div>
									</template>
								</div>
							</div>
						</div>
					</div>
				</fullscreen>
				<div class="m-t-20px text-center" v-if="failedText">
					<b-alert variant="info" show class="m-0">
						<h5 class="m-0">{{ failedText }}</h5>
					</b-alert>
				</div>
				<fullscreen
					v-model="compareRegionalReportingTrendFull"
					ref="fullscreen"
					class="fullContainer"
				>
					<div
						class="card bg-transparent border-none fullContent"
						v-if="
							nationalReportingTrendDisable &&
							compareRegionalReportingTrendDisable
						"
					>
						<loader class="cardLoader" v-if="showLoader2" />
						<div
							class="card-header px-2 py-1 text-decoration-none border-t-l-radius-10px border-t-r-radius-10px"
						>
							<div class="row no-gutters">
								<div
									class="col-lg-9 col-md-9 p-t-4px"
									:class="{
										'col-lg-12 col-md-12': compareRegionalReportingTrendFull,
									}"
								>
									<div class="cardTitleSection text-wrap fs-19-1920">
										<i
											class="fa fa-info-circle color-white cursor-pointer chart-info mx-2"
											aria-hidden="true"
											v-b-popover.hover.rightbottom="{
												variant: 'info',
												content: compareRegionalReportingTrendChartInfo,
												title: compareRegionalReportingTrendChartName,
												html: true,
											}"
										></i>
										<p class="title_p fs-19-1920 m-0">
											{{ compareRegionalReportingTrendChartName }}
										</p>
									</div>
								</div>
								<div
									class="col-lg-3 col-md-3 position-relative"
									v-if="!compareRegionalReportingTrendFull"
								>
									<ChartOptions
										sorting="type1"
										@dataSort="dataSort"
										@showTable="showTable"
										@exportChart="exportChart"
										@toggleFullscreen="toggleFullscreen"
										:cID="compareRegionalReportingTrendCID"
										chartKey="compareRegionalReportingTrend"
										:trendTable="compareRegionalReportingTrendTable"
										v-if="
											compareRegionalReportingTrend.series.length &&
											!isHideOption
										"
									/>
								</div>
							</div>
						</div>
						<div
							class="card-body p-0 offwhite-bg border-b-l-radius-10px border-b-r-radius-10px"
						>
							<div class="row m-0">
								<div
									class="position-relative"
									:class="
										compareRegionalReportingTrendOutlier.length > 0
											? 'col-lg-12'
											: 'col-12'
									"
								>
									<div
										class="row mb-3"
										:class="{
											hidden: compareRegionalReportingTrendType === 'table',
										}"
										v-if="compareRegionalReportingTrend.series.length > 0"
									>
										<div class="col-lg-12 col-md-12">
											<ChartFilters
												chartRef="compareRegionalReportingTrend"
												@changePlotType="getChartPlotType"
											/>
										</div>
									</div>
									<template
										v-if="compareRegionalReportingTrendType !== 'table'"
									>
										<highcharts
											ref="compareRegionalReportingTrend"
											class="chartHeight m-t-10px"
											:options="compareRegionalReportingTrend"
											v-if="compareRegionalReportingTrend.series.length"
										></highcharts>
										<div class="my-4 text-center" v-else style="height: 410px">
											{{ $t("no_data_to_display") }}
										</div>
									</template>
									<template v-else>
										<div class="chartHeight text-center mb-2">
											<b-table
												head-variant="light"
												sticky-header
												class="mb-0"
												v-if="compareRegionalReportingTrend.series.length"
												:bordered="true"
												hover
												:items="compareRegionalReportingTrendTable.items"
												:fields="compareRegionalReportingTrendTable.fields"
												ref="compareRegionalReportingTrend"
											>
											</b-table>
											<div
												class="my-4 text-center"
												v-else
												style="height: 410px"
											>
												{{ $t("no_data_to_display") }}
											</div>
										</div>
									</template>
								</div>
								<div
									class="col-lg-3 bg-warm-grey"
									v-if="
										compareRegionalReportingTrend.yAxis.plotLines.length > 0 &&
										compareRegionalReportingTrend.yAxis.plotLines[0].enabled &&
										compareRegionalReportingTrend.series.length > 0
									"
								>
									<div class="regionselectioncontainer m-t-10px">
										<p class="mb-0">
											<span class="border-bottom-black font-weight-bold"
												>{{
													$t("rr_text12", {
														option:
															filters === "Reporting Rate (On Time)"
																? $t("rr_text1_opt2")
																: $t("rr_text1_opt1"),
													})
												}}
												{{
													compareRegionalReportingTrend.yAxis.plotLines[0]
														.value
												}}%</span
											>
										</p>
									</div>
									<div
										class="pillcontainer m-t-10px outlier_wrapper_scrollbar border-bottom-0"
										v-if="compareRegionalReportingTrendOutlier.length > 0"
									>
										<div
											v-for="(o, i) in compareRegionalReportingTrendOutlier"
											:key="i"
										>
											<div>
												<strong>{{ o.name }}</strong>
											</div>
											<h6 class="d-inline-block" v-if="o.outlier.length > 0">
												<b-badge
													variant="secondary"
													class="m-1 shadow-sm selection-pills"
													v-for="(o, i) in o.outlier"
													:key="i"
													>{{ o }}</b-badge
												>
											</h6>
											<div class="my-3 text-center" v-else>NA</div>
										</div>
									</div>
									<div class="text-center m-t-20px" v-else>NA</div>
								</div>
							</div>
						</div>
					</div>
				</fullscreen>
				<fullscreen
					v-model="regionalReportingTrendFull"
					ref="fullscreen"
					class="fullContainer"
				>
					<div
						class="card bg-transparent border-none fullContent"
						v-if="
							nationalReportingTrendDisable && regionalReportingTrendDisable
						"
					>
						<loader class="cardLoader" v-if="showLoader3" />
						<div
							class="card-header px-2 py-1 text-decoration-none border-t-l-radius-10px border-t-r-radius-10px"
						>
							<div class="row no-gutters">
								<div
									class="col-lg-9 col-md-9 p-t-4px"
									:class="{ 'col-lg-12 col-md-12': regionalReportingTrendFull }"
								>
									<div class="cardTitleSection text-wrap fs-19-1920">
										<i
											class="fa fa-info-circle color-white cursor-pointer chart-info mx-2"
											aria-hidden="true"
											v-b-popover.hover.rightbottom="{
												variant: 'info',
												content: regionalReportingTrendChartInfo,
												title: regionalReportingTrendChartName,
												html: true,
											}"
										></i>
										<p class="title_p fs-19-1920 m-0">
											{{ regionalReportingTrendChartName }}
										</p>
									</div>
								</div>
								<div
									class="col-lg-3 col-md-3 position-relative"
									v-if="!regionalReportingTrendFull"
								>
									<ChartOptions
										sorting="type3"
										@dataSort="dataSort"
										defaultSort="JAN-DEC"
										@showTable="showTable"
										@exportChart="exportChart"
										:cID="regionalReportingTrendCID"
										chartKey="regionalReportingTrend"
										@toggleFullscreen="toggleFullscreen"
										:trendType="regionalReportingTrendType"
										:trendTable="regionalReportingTrendTable"
										v-if="regionalReportingTrend.series.length && !isHideOption"
									/>
								</div>
							</div>
						</div>
						<div
							class="card-body p-0 offwhite-bg border-b-l-radius-10px border-b-r-radius-10px"
						>
							<div class="row m-0">
								<div
									class="position-relative"
									:class="
										regionalReportingTrendOutlier.length > 0 &&
										regionalReportingTrend.series.length > 0
											? signOffActive
												? 'col-12'
												: 'col-lg-9'
											: 'col-12'
									"
								>
									<div
										class="row mb-3"
										:class="{
											hidden: regionalReportingTrendType === 'table',
										}"
										v-if="regionalReportingTrend.series.length > 0"
									>
										<div class="col-lg-12 col-md-12">
											<ChartFilters
												chartRef="regionalReportingTrend"
												:plotOptions="plotOptions"
												:plotType="regionalReportingTrend.chart.type"
												@changePlotType="getChartPlotType"
											/>
										</div>
									</div>
									<div
										class="my-2 text-right row mx-0"
										v-if="regionalReportingTrendType !== 'table'"
									>
										<b-form-select
											class="col-3 offset-9"
											v-model="benchmarkWiseData"
											:options="[
												{ value: 'all', text: $t('all') },
												{
													value: 'below',
													text: $t('below_benchmark'),
												},
												{
													value: 'above',
													text: $t('above_benchmark'),
												},
											]"
										></b-form-select>
									</div>
									<template v-if="regionalReportingTrendType !== 'table'">
										<highcharts
											ref="regionalReportingTrend"
											class="chartHeight m-t-10px"
											:options="regionalReportingTrend"
											v-if="regionalReportingTrend.series.length"
										></highcharts>
										<div class="my-4 text-center" v-else style="height: 410px">
											{{ $t("no_data_to_display") }}
										</div>
									</template>
									<template v-else>
										<div class="text-center my-2">
											<template v-if="regionalReportingTrend.series.length">
												<b-table
													head-variant="light"
													sticky-header
													class="mb-0"
													:bordered="true"
													hover
													:items="regionalReportingTrendTable.items"
													:fields="regionalReportingTrendTable.fields"
													ref="regionalReportingTrend"
												>
												</b-table>

												<div
													class="mt-3"
													style="
														background-color: 'transparent';
														padding: 10px;
														text-align: center;
														border-radius: 5px;
														border: 1px solid #a7a7a7;
														width: fit-content;
														margin: auto;
														font-size: 0.75rem;
														font-weight: 700;
														font-family: 'Lucida Grande', 'Lucida Sans Unicode',
															Arial, Helvetica, sans-serif;
														color: #d6d6d6;
													"
												>
													<div class="text-left row">
														<div class="col">
															<i
																class="fa fa-circle mr-1"
																style="color: #b8daff; font-size: 0.9375rem"
															></i>
															{{ $t("rr_text6") }}
														</div>
														<div class="col">
															<i
																class="fa fa-circle mr-1"
																style="color: #d6d8db; font-size: 0.9375rem"
															></i>
															{{ $t("rr_text7") }}
														</div>
													</div>
													<div class="text-left row">
														<div class="col">
															<i
																class="fa fa-circle mr-1"
																style="color: #c3e6cb; font-size: 0.9375rem"
															></i>
															{{ $t("rr_text8") }} ({{ benchmarkValue }}%)
														</div>
														<div class="col">
															<i
																class="fa fa-circle mr-1"
																style="color: #f5c6cb; font-size: 0.9375rem"
															></i>
															{{ $t("rr_text9") }} ({{ benchmarkValue }}%)
														</div>
													</div>
													<div class="text-left row">
														<div class="col">
															<i
																class="fa fa-circle mr-1"
																style="color: #ffeeba; font-size: 0.9375rem"
															></i>
															{{ $t("rr_text8") }} ({{ benchmarkValue }}%)
															{{ $t("rr_text11") }} ({{ substantialChange }}%)
														</div>
													</div>
												</div>
											</template>
											<template v-else>
												<div class="my-4 text-center" style="height: 410px">
													{{ $t("no_data_to_display") }}
												</div>
											</template>
										</div>
									</template>
								</div>
								<div
									class="bg-warm-grey"
									:class="signOffActive ? 'col-12' : 'col-lg-3'"
									v-if="
										regionalReportingTrend.yAxis.plotLines.length > 0 &&
										regionalReportingTrend.yAxis.plotLines[0].enabled &&
										regionalReportingTrend.series.length > 0
									"
								>
									<div class="regionselectioncontainer m-t-10px">
										<p class="mb-0">
											<span class="border-bottom-black font-weight-bold"
												>{{
													$t("rr_text12", {
														option:
															filters === "Reporting Rate (On Time)"
																? $t("rr_text1_opt2")
																: $t("rr_text1_opt1"),
													})
												}}
												{{
													regionalReportingTrend.yAxis.plotLines[0].value
												}}%</span
											>
										</p>
									</div>
									<div
										class="pillcontainer m-t-10px outlier_wrapper_scrollbar border-bottom-0"
										v-if="regionalReportingTrendOutlier.length > 0"
									>
										<div
											v-for="(o, i) in regionalReportingTrendOutlier"
											:key="i"
										>
											<div v-if="o.outlier.length > 0">
												<div>
													<strong>{{ o.name }}</strong>
												</div>
												<h6 class="d-inline-block" v-if="o.outlier.length > 0">
													<b-badge
														variant="secondary"
														class="m-1 shadow-sm selection-pills"
														v-for="(o, i) in o.outlier"
														:key="i"
														>{{ o }}</b-badge
													>
												</h6>
												<div class="my-3 text-center" v-else>NA</div>
											</div>
										</div>
									</div>
									<div class="text-center m-t-20px" v-else>NA</div>
								</div>
							</div>
						</div>
					</div>
				</fullscreen>
				<fullscreen
					v-model="regionalReportingRateFull"
					ref="fullscreen"
					class="fullContainer"
				>
					<div
						class="card bg-transparent border-none fullContent"
						v-if="
							nationalReportingTrendDisable && reportingFormsOptions.length > 0
						"
					>
						<loader class="cardLoader" v-if="showLoader4" />
						<div
							class="card-header px-2 py-1 text-decoration-none border-t-l-radius-10px border-t-r-radius-10px"
						>
							<div class="row no-gutters">
								<div class="col-lg-9 col-md-9 p-t-4px">
									<div
										class="cardTitleSection text-wrap fs-19-1920"
										:class="{
											'col-lg-12 col-md-12': regionalReportingRateFull,
										}"
									>
										<i
											class="fa fa-info-circle color-white cursor-pointer chart-info mx-2"
											aria-hidden="true"
											v-b-popover.hover.rightbottom="{
												variant: 'info',
												content: regionalReportingRateChartInfo,
												title: regionalReportingRateChartName,
												html: true,
											}"
										></i>
										<p class="title_p fs-19-1920 m-0">
											{{ regionalReportingRateChartName }}
										</p>
									</div>
								</div>
								<div
									class="col-lg-3 col-md-3 position-relative"
									v-if="!regionalReportingRateFull"
								>
									<ChartOptions
										sorting="type3"
										@dataSort="dataSort"
										defaultSort="JAN-DEC"
										@showTable="showTable"
										@exportChart="exportChart"
										:cID="regionalReportingRateCID"
										chartRef="regionalReportingRate"
										@toggleFullscreen="toggleFullscreen"
										:trendTable="regionalReportingRateTable"
										v-if="regionalReportingRate.series.length && !isHideOption"
									/>
								</div>
							</div>
						</div>
						<div
							class="card-body p-0 offwhite-bg border-b-l-radius-10px border-b-r-radius-10px"
						>
							<div class="row m-0">
								<div
									class="position-relative"
									:class="
										regionalReportingRateOutlier.length > 0
											? signOffActive
												? 'col-12'
												: 'col-lg-9'
											: 'col-12'
									"
								>
									<div
										class="row mb-3"
										:class="{
											hidden: regionalReportingRateType === 'table',
										}"
										v-if="
											regionalReportingRate.series.length > 0 &&
											selectedReportingForm &&
											reportingFormsOptions.length > 0
										"
									>
										<div class="col-lg-12 col-md-12">
											<ChartFilters
												chartRef="regionalReportingRate"
												:plotOptions="plotOptions"
												:plotType="regionalReportingRate.chart.type"
												:reportingFormsOptions="reportingFormsOptions"
												:selectedReportingForm="selectedReportingForm"
												@changePlotType="getChartPlotType"
												@changeReportingForm="changeReportingForm"
											/>
										</div>
									</div>
									<template v-if="regionalReportingRateType !== 'table'">
										<highcharts
											ref="regionalReportingRate"
											class="chartHeight m-t-10px"
											:options="regionalReportingRate"
											v-if="regionalReportingRate.series.length"
										></highcharts>
										<div class="my-4 text-center" v-else style="height: 410px">
											{{ $t("no_data_to_display") }}
										</div>
									</template>
									<template v-else>
										<div class="chartHeight text-center mb-2">
											<b-table
												head-variant="light"
												sticky-header
												class="mb-0"
												v-if="regionalReportingRate.series.length"
												:bordered="true"
												hover
												:items="regionalReportingRateTable.items"
												:fields="regionalReportingRateTable.fields"
												ref="regionalReportingRate"
											>
											</b-table>
											<div
												class="my-4 text-center"
												v-else
												style="height: 410px"
											>
												{{ $t("no_data_to_display") }}
											</div>
										</div>
									</template>
									<div class="small mb-2">
										<strong>{{ $t("note") }}: </strong>{{ $t("alert_msg") }}
									</div>
								</div>
								<div
									class="bg-warm-grey"
									:class="signOffActive ? 'col-12' : 'col-lg-3'"
									v-if="
										regionalReportingRate.yAxis.plotLines.length > 0 &&
										regionalReportingRate.yAxis.plotLines[0].enabled &&
										regionalReportingRate.series.length > 0
									"
								>
									<div class="regionselectioncontainer m-t-10px">
										<p class="mb-0">
											<span class="border-bottom-black font-weight-bold"
												>{{
													$t("rr_text12", {
														option:
															filters === "Reporting Rate (On Time)"
																? $t("rr_text1_opt2")
																: $t("rr_text1_opt1"),
													})
												}}
												{{
													regionalReportingRate.yAxis.plotLines[0].value
												}}%</span
											>
										</p>
									</div>
									<div
										class="pillcontainer m-t-10px outlier_wrapper_scrollbar border-bottom-0"
										v-if="regionalReportingRateOutlier.length > 0"
									>
										<div
											v-for="(o, i) in regionalReportingRateOutlier"
											:key="i"
										>
											<div>
												<strong>{{ o.name }}</strong>
											</div>
											<h6 class="d-inline-block" v-if="o.outlier.length > 0">
												<b-badge
													variant="secondary"
													class="m-1 shadow-sm selection-pills"
													v-for="(o, i) in o.outlier"
													:key="i"
													>{{ o }}</b-badge
												>
											</h6>
											<div class="my-3 text-center" v-else>NA</div>
										</div>
									</div>
									<div class="text-center m-t-20px" v-else>NA</div>
								</div>
							</div>
						</div>
					</div>
				</fullscreen>
			</div>
		</div>
	</div>
</template>
<script>
/*eslint no-undef: "error"*/
import service from "@/service";
import reportingChartconfig from "./reportingChartConfig";
import {
	getDateRange,
	translateDate,
	formatSingleDate,
	subtractNDate,
	chartExport,
} from "@/components/Common/commonFunctions";
import getCIDMixin from "@/helpers/GetCIDMixin";
import FullScreenMixin from "@/helpers/FullScreenMixin";

export default {
	props: [
		"contName",
		"activeTab",
		"filters",
		"locations",
		"periodValue",
		"isHideOption",
		"periodScorecard",
		"sourceValue",
		"scoreKey",
		"defaultLevelID",
		"defaultLocationID",
		"scorecardDefaultLocationID",
		"subLevelID",
		"exportPosition",
		"dqrResponse",
		"globalResponse",
		"debugging",
		"debuggingLevel",
		"signOffActive",
		"periodType",
		"applicationFinalYear",
		"reportChartData",
	],
	mixins: [getCIDMixin, FullScreenMixin],
	components: {
		TabSummary: () =>
			import(
				/* webpackChunkName: "TabSummary"*/ "@/components/Common/TabSummary"
			),
		ChartOptions: () =>
			import(
				/* webpackChunkName: "ChartOptions"*/ "@/components/Common/ChartOptions.vue"
			),
		ChartFilters: () =>
			import(
				/* webpackChunkName: "ChartFilters"*/ "@/components/Common/ChartFilters.vue"
			),
	},
	data() {
		return {
			activityLogArr: [],
			chartType: "column",
			showLoader1: false,
			showLoader2: false,
			showLoader3: false,
			showLoader4: false,
			source: this.sourceValue,
			period: this.periodValue,
			periodLength: 36,
			dataType: this.filters,
			reportingForm: "HIV",
			locationValue: this.locations,
			plotOptions: [],
			nationalReportingTrend: JSON.parse(JSON.stringify(reportingChartconfig)),
			nationalReportingTrendOutlier: [],
			nationalRegionReportingTrendOutlier: [],
			nationalReportingTrendTable: {
				items: [],
				fields: [],
			},
			nationalReportingTrendType: "chart",
			nationalReportingTrendChartInfo: "",
			nationalReportingTrendChartName: "National Reporting Rate Trend",
			nationalReportingTrendDisable: true,
			nationalReportingTrendCID: "",
			nationalReportingTrendComment: false,
			substantialChangeOutlier: [],
			substantialChangeAvg: "0",
			drillDown: false,
			nationalReportingTrendDownload: false,

			compareRegionalReportingTrend: JSON.parse(
				JSON.stringify(reportingChartconfig)
			),
			compareRegionalReportingTrendOutlier: [],
			compareRegionalReportingTrendTable: {
				items: [],
				fields: [],
			},
			compareRegionalReportingTrendType: "chart",
			compareRegionalReportingTrendChartInfo: "",
			compareRegionalReportingTrendChartName:
				"Comparing Regional Reporting Rate Trends",
			compareRegionalReportingTrendDisable: true,
			compareRegionalReportingTrendCID: "",
			compareRegionalReportingTrendComment: false,
			compareRegionalReportingTrendDownload: false,

			regionalReportingTrend: JSON.parse(JSON.stringify(reportingChartconfig)),
			regionalReportingTrendOutlier: [],
			regionalReportingTrendTable: {
				items: [],
				fields: [],
			},
			regionalReportingTrendType: "table",
			defaultViewType: "table",
			regionalReportingTrendChartInfo: "",
			regionalReportingTrendChartName: "Comparing Regional Reporting Rates",
			regionalReportingTrendDisable: true,
			regionalReportingTrendCID: "",
			regionalReportingTrendComment: false,
			benchmarkWiseData: "all",
			originalData: [],
			benchmarkValue: "",
			regionalReportingTrendDownload: false,

			regionalReportingRate: JSON.parse(JSON.stringify(reportingChartconfig)),
			regionalReportingRateOutlier: [],
			regionalReportingRateTable: {
				items: [],
				fields: [],
			},
			regionalReportingRateType: "chart",
			regionalReportingRateChartInfo: "",
			regionalReportingRateChartName: "Comparing Regional Reporting Rates",
			regionalReportingRateCID: "",
			regionalReportingRateComment: false,
			regionalReportingRateDownload: false,

			chartComments: [],
			selectedReportingForm: "",
			reportingFormsOptions: [],
			substantialChange: 5,
			categoryInfo: "",
			failedText: "",
			nationalReportingTrendFull: false,
			compareRegionalReportingTrendFull: false,
			regionalReportingTrendFull: false,
			regionalReportingRateFull: false,
		};
	},
	watch: {
		scorecardDefaultLocationID(newValue) {
			if (newValue) {
				this.calculateNationalTrendBackground(
					this.globalResponse.rrBenchmarking[this.source].plotLines
				);
			}
		},
		locations(newValue) {
			this.locationValue = newValue;
			if (newValue) {
				if (this.activeTab === "reportingRate") {
					this.$store.state.loading = true;
				}
				this.originalData = [];
				this.benchmarkWiseData = "all";
				this.getPlotLines();
			}
		},
		sourceValue(newValue) {
			this.source = newValue;
			if (newValue) {
				if (this.activeTab === "reportingRate") {
					this.$store.state.loading = true;
				}
				this.originalData = [];
				this.benchmarkWiseData = "all";
				this.getPlotLines();
			}
		},
		periodValue(newValue) {
			this.period = newValue;
			if (newValue) {
				if (this.activeTab === "reportingRate") {
					this.$store.state.loading = true;
				}
				this.originalData = [];
				this.benchmarkWiseData = "all";
				this.getPlotLines();
			}
		},
		benchmarkWiseData(newValue) {
			let period = this.$moment(this.period, "YYYYMM").format("YYYYMM");
			if (newValue === "below") {
				let seriesData = [];
				this.originalData.forEach((oData) => {
					oData.data.forEach((d) => {
						if (this.$moment(d.pe, "YYYYMM").format("YYYYMM") === period) {
							if (d.y - this.benchmarkValue < 0) {
								seriesData.push(oData);
							}
						}
					});
				});
				this.regionalReportingTrend.series = seriesData.map((s, i) => ({
					...s,
					visible: i > 4 ? false : true,
				}));
			} else if (newValue === "above") {
				let seriesData = [];
				this.originalData.forEach((oData) => {
					oData.data.forEach((d) => {
						if (this.$moment(d.pe, "YYYYMM").format("YYYYMM") === period) {
							if (d.y - this.benchmarkValue > 0) {
								seriesData.push(oData);
							}
						}
					});
				});
				this.regionalReportingTrend.series = seriesData.map((s, i) => ({
					...s,
					visible: i > 4 ? false : true,
				}));
			} else {
				this.regionalReportingTrend.series = this.originalData;
			}
		},
	},
	methods: {
		resetDrilldown() {
			this.drillDown = false;
		},
		changeLocation(locationID) {
			this.drillDown = false;
			this.$emit("drilldownLocation", locationID, this.subLevelID);
		},
		showTable(val, key) {
			this[`${key}Type`] = val;
		},
		dataSort(sort, key) {
			this[key].series.map((d) => ({
				...d,
				data: d.data.sort((a, b) => {
					let valueA = 0,
						valueB = 0;

					if (sort === "0-1" || sort === "1-0") {
						valueA = a.y;
						valueB = b.y;
					}

					if (sort === "JAN-DEC" || sort === "DEC-JAN") {
						valueA = new Date(a.pe).getTime();
						valueB = new Date(b.pe).getTime();
					}

					if (sort === "A-Z" || sort === "Z-A") {
						valueA = a.name;
						valueB = b.name;
					}

					let comparison = 0;
					if (sort == "0-1" || sort === "A-Z" || sort === "JAN-DEC") {
						if (valueA > valueB) {
							comparison = 1;
						} else if (valueA < valueB) {
							comparison = -1;
						}
					} else if (sort == "1-0" || sort === "Z-A" || sort === "DEC-JAN") {
						if (valueA > valueB) {
							comparison = -1;
						} else if (valueA < valueB) {
							comparison = 1;
						}
					}
					return comparison;
				}),
			}));
		},
		getChartPlotType(plotValue, chartName) {
			this[chartName].chart.type = plotValue.toLowerCase();
		},
		chartViewType(chartViewType, key, chartRef) {
			this[key] = chartViewType;
			if (chartRef === "regionalReportingTrend") {
				this.defaultViewType = chartViewType;
			}
			setTimeout(() => {
				if (chartViewType === "table") {
					this[`${chartRef}Download`] = false;
				}
			}, 100);
		},
		changeReportingForm(newValue) {
			this.selectedReportingForm = newValue;
			if (this.activeTab === "reportingRate") {
				this.$store.state.loading = true;
			}
			this.nationalReportingTrendType = "chart";
			this.regionalReportingRateType = "chart";
			this.regionalReportingTrendType = "table";
			this.compareRegionalReportingTrendType = "chart";
			if (
				this.globalResponse.rrBenchmarking[this.source].plotLines[0].enabled
			) {
				this.calculateNationalTrend(
					this.globalResponse.rrBenchmarking[this.source].plotLines
				);
			} else {
				this.calculateNationalTrend();
			}
		},
		changeChartType(newValue, chart) {
			this.nationalRegionReportingTrendOutlier = [];
			this[chart].chart.type = newValue.toLowerCase();
		},
		exportChart(type, chartRef, loader) {
			this[loader] = true;
			let chart = this.$refs[chartRef].chart;
			let max = chart.options.xAxis[0].max,
				yMin = chart.yAxis[0].min,
				yMax = chart.yAxis[0].max;
			let catLen = chart.options.series[0].data.length - 1;

			if (!this.drillDown) {
				if (chartRef !== "compareRegionalReportingTrend") {
					chart.options.xAxis[0].min = 0;
					chart.options.xAxis[0].max = null;
					chart.xAxis[0].setExtremes(0, catLen);
				}
			} else {
				chart.yAxis[0].setExtremes(yMin, yMax);
			}
			chartExport(type, chart);
			setTimeout(() => {
				if (chartRef !== "compareRegionalReportingTrend" && !this.drillDown) {
					chart.options.xAxis[0].max = max;
					chart.xAxis[0].setExtremes(catLen - 11, catLen);
				}
			}, 100);
			setTimeout(() => {
				this[loader] = false;
			}, 2000);
		},
		getConfig() {
			if (this.dqrResponse.reportingRate) {
				if (this.dqrResponse.reportingRate[this.source]) {
					this.getPlotLines();
				} else {
					if (this.activeTab === "reportingRate") {
						this.$store.state.loading = false;
					}
				}
			} else {
				if (this.activeTab === "reportingRate") {
					this.$store.state.loading = false;
				}
			}
		},
		getPlotLines() {
			if (
				this.globalResponse.rrBenchmarking[this.source].plotLines[0].enabled
			) {
				this.calculateNationalTrend(
					this.globalResponse.rrBenchmarking[this.source].plotLines
				);
			} else {
				this.calculateNationalTrend();
			}
		},
		calculateNationalTrend(plotLines = []) {
			let sourceConfig = JSON.parse(
				JSON.stringify(this.dqrResponse.reportingRate[this.source])
			);
			let _this = this;
			sourceConfig = sourceConfig.chartData.find(
				(c) =>
					c.indicator.static_name.toLowerCase() === this.dataType.toLowerCase()
			).indicator;
			this.substantialChangeOutlier = [];
			this.substantialChangeAvg = "";
			if (sourceConfig) {
				if (sourceConfig.disableChart) {
					if (this.activeTab === "reportingRate") {
						this.$store.state.loading = false;
					}
					this.failedText = this.$i18n.t("rr_text5");
					this.$emit("sendScore", this.scoreKey, false, []);
					return;
				}

				this.categoryInfo = sourceConfig.categoryInfo || "";
				this.nationalReportingTrendChartInfo = sourceConfig.chartInfo || "";
				this.nationalReportingTrendChartName =
					sourceConfig.chartName || this.nationalReportingTrendChartName;
				this.nationalReportingTrendDisable = !sourceConfig.disableChart;
				this.nationalReportingTrendComment = sourceConfig.cid ? true : false;
				this.nationalReportingTrendCID = sourceConfig.cid || "";
				this.substantialChange = sourceConfig.chartOptions.substantialChange
					? sourceConfig.chartOptions.substantialChange
					: 5;

				let derivedCharts = sourceConfig.derivedCharts
					? sourceConfig.derivedCharts
					: [];

				if (derivedCharts && derivedCharts.length) {
					derivedCharts.forEach((d, index) => {
						if (index === 0) {
							this.compareRegionalReportingTrendComment = d.chartOptions.cid
								? true
								: false;
							this.compareRegionalReportingTrendCID = d.chartOptions.cid || "";
							this.compareRegionalReportingTrendChartInfo =
								d.chartOptions.chartInfo;
							this.compareRegionalReportingTrendChartName =
								d.chartOptions.chartName;
							this.compareRegionalReportingTrendDisable =
								!d.chartOptions.disableChart;

							// Comparing Regional Reporting Rate Trends
							this.compareRegionalReportingTrend.chart.type = "bar"; //sourceConfig.chartOptions.chart.type.toLowerCase()
							this.compareRegionalReportingTrend.title.text = d.chartOptions
								.title.visible
								? d.chartOptions.title.text
								: "";
							this.compareRegionalReportingTrend.title.title =
								this.$i18n.t("compTime") +
								" - " +
								this.filters +
								" - " +
								d.chartOptions.chartName;
							this.compareRegionalReportingTrend.subtitle.text = d.chartOptions
								.subTitle.visible
								? d.chartOptions.subTitle.text
								: "";
							this.compareRegionalReportingTrend.xAxis.title.text = d
								.chartOptions.yAxis.visible
								? d.chartOptions.yAxis.text
								: "";
							this.compareRegionalReportingTrend.xAxis.type = "category";
							// this.compareRegionalReportingTrend.yAxis = {}
							this.compareRegionalReportingTrend.yAxis = {
								title: {
									text: d.chartOptions.xAxis.visible
										? d.chartOptions.xAxis.text
										: "",
								},
							};
							this.compareRegionalReportingTrend.yAxis.plotLines = [];

							this.compareRegionalReportingTrend.legend.enabled = true;

							this.compareRegionalReportingTrend.plotOptions.series = {
								borderWidth: 0,
								dataLabels: {
									enabled: false,
									format: "{point.y:.1f}%",
								},
							};

							this.compareRegionalReportingTrend.tooltip = {
								headerFormat:
									'<span style="font-size:0.6875rem">{series.name}</span><br>',
								pointFormat:
									'<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b><br/>',
							};

							this.compareRegionalReportingTrend.series = [];
							//this.compareRegionalReportingTrend.xAxis.categories = []
							this.compareRegionalReportingTrendOutlier = [];
						}
						if (index === 1) {
							this.regionalReportingTrendComment = d.chartOptions.cid
								? true
								: false;
							this.regionalReportingTrendCID = d.chartOptions.cid || "";
							this.regionalReportingTrendChartInfo = d.chartOptions.chartInfo;
							this.regionalReportingTrendChartName = d.chartOptions.chartName;
							this.regionalReportingTrendDisable = !d.chartOptions.disableChart;

							// Comparing Regional Reporting Rates
							this.regionalReportingTrend.chart.type = "line";
							this.regionalReportingTrend.title.text = d.chartOptions.title
								.visible
								? d.chartOptions.title.text
								: "";
							this.regionalReportingTrend.title.title =
								this.$i18n.t("compTime") +
								" - " +
								this.filters +
								" - " +
								d.chartOptions.chartName;
							this.regionalReportingTrend.subtitle.text = d.chartOptions
								.subTitle.visible
								? d.chartOptions.subTitle.text
								: "";
							this.regionalReportingTrend.xAxis.title.text = d.chartOptions
								.xAxis.visible
								? d.chartOptions.xAxis.text
								: "";
							this.regionalReportingTrend.yAxis.title.text = d.chartOptions
								.yAxis.visible
								? d.chartOptions.yAxis.text
								: "";
							this.regionalReportingTrend.yAxis.plotLines =
								plotLines.length > 0
									? plotLines.map((p) => {
											if (p.value) {
												return {
													...p,
													label: {
														...p.label,
														text: p.label.enabled
															? `${p.label.text} (${p.value}%)`
															: "",
													},
												};
											} else {
												return {};
											}
									  })
									: [];

							this.regionalReportingTrend.plotOptions = {
								..._this.regionalReportingTrend.plotOptions,
								series: {
									..._this.regionalReportingTrend.plotOptions.series,
									events: {
										legendItemClick: function () {
											if (!_this.drillDown) {
												let index =
													_this.regionalReportingTrend.series.findIndex(
														(s) => s.name === this.name
													);
												if (index >= 0) {
													_this.regionalReportingTrend.series[index] = {
														..._this.regionalReportingTrend.series[index],
														visible:
															_this.regionalReportingTrend.series[index]
																.visible !== undefined
																? !_this.regionalReportingTrend.series[index]
																		.visible
																: false,
													};
												}
											}
										},
									},
									showInLegend: true,
								},
							};

							// this.regionalReportingTrend.plotOptions[d.chartOptions.chart.type.toLowerCase()].dataLabels.enabled = d.dataLabels.enabled
							this.regionalReportingTrend.series = [];
							// this.regionalReportingTrend.xAxis.categories = []
							this.regionalReportingTrendOutlier = [];
						}
					});
				}

				this.nationalReportingTrend.chart.type =
					sourceConfig.chartOptions.chart.type.toLowerCase();
				this.nationalReportingTrend.title.text = sourceConfig.chartOptions.title
					.visible
					? sourceConfig.chartOptions.title.text
					: "";
				this.nationalReportingTrend.title.title =
					this.$i18n.t("compTime") +
					" - " +
					this.filters +
					" - " +
					sourceConfig.chartName;
				this.nationalReportingTrend.subtitle.text = sourceConfig.chartOptions
					.subTitle.visible
					? sourceConfig.chartOptions.subTitle.text
					: "";
				this.nationalReportingTrend.xAxis.title.text = sourceConfig.chartOptions
					.xAxis.visible
					? sourceConfig.chartOptions.xAxis.text
					: "";
				this.nationalReportingTrend.yAxis.title.text = sourceConfig.chartOptions
					.yAxis.visible
					? sourceConfig.chartOptions.yAxis.text
					: "";
				this.nationalReportingTrend.yAxis.plotLines =
					plotLines.length > 0
						? plotLines.map((p) => {
								if (p.value) {
									return {
										...p,
										label: {
											...p.label,
											text: p.label.enabled
												? `${p.label.text} (${p.value}%)`
												: "",
										},
									};
								} else {
									return {};
								}
						  })
						: [];

				this.nationalReportingTrend.plotOptions = {
					..._this.nationalReportingTrend.plotOptions,
					series: {
						..._this.nationalReportingTrend.plotOptions.series,
						dataLabels: {
							enabled: sourceConfig.dataLabels.enabled,
						},
						events: {
							legendItemClick: function () {
								if (!_this.drillDown) {
									let index = _this.nationalReportingTrend.series.findIndex(
										(s) => s.name === this.name
									);
									if (index >= 0) {
										_this.nationalReportingTrend.series[index] = {
											..._this.nationalReportingTrend.series[index],
											visible:
												_this.nationalReportingTrend.series[index].visible !==
												undefined
													? !_this.nationalReportingTrend.series[index].visible
													: false,
										};
									}
								}
							},
						},
						showInLegend: true,
						cursor: "pointer",
					},
				};
				this.nationalReportingTrend.series = [];
				this.nationalReportingTrendOutlier = [];
				this.nationalRegionReportingTrendOutlier = [];

				let items = [];
				let fields = [this.$i18n.t("period")];

				this.nationalReportingTrendTable = {
					items: items,
					fields: fields,
				};

				this.nationalReportingTrend.chart.events = {
					selection: function (e) {
						if (!e.xAxis) {
							let catLen = this.options?.series[0]?.data?.length - 1;
							if (catLen > 11 && !_this.reportChartData) {
								setTimeout(() => {
									this.xAxis[0].setExtremes(catLen - 11, catLen);
								}, 0);
							}
							_this.nationalReportingTrendDownload = false;
						} else {
							_this.nationalReportingTrendDownload = true;
						}
					},
					load: function () {
						if (
							this.options.series.length &&
							this.options.series[0].data.length &&
							!_this.reportChartData
						) {
							let catLen = this.options.series[0].data.length - 1;
							if (catLen > 11) {
								this.xAxis[0].setExtremes(catLen - 11, catLen);
							}
						}
					},
					drillup: function (e) {
						_this.drillDown = false;
						this.yAxis[0].removePlotLine("p1");
						this.xAxis[0].options.max =
							e.seriesOptions.data.length - 1 > 11
								? !_this.reportChartData
									? 11
									: e.seriesOptions.data.length - 1
								: e.seriesOptions.data.length - 1;
						_this.nationalRegionReportingTrendOutlier = [];
						this.options.chart.zoomType = "x";
						delete e.target.options.plotOptions.point;
					},
					drilldown: function (e) {
						_this.drillDown = true;
						e.target.options.plotOptions = {
							...e.target.options.plotOptions,
							series: {
								...e.target.options.plotOptions.series,
								point: {
									events: {
										click: function () {
											if (this.series && !_this.reportChartData) {
												_this.changeLocation(this.locationID);
											}
										},
									},
								},
							},
						};
						this.options.chart.zoomType = "";
						let y = 0;
						this.options.series[0].data.forEach((d) => {
							if (d.name === e.seriesOptions.name) {
								y = d.y;
							}
						});
						let outlier = [];
						e.seriesOptions.data.forEach((s) => {
							if (s.y < y) {
								outlier.push(`${s.name} (${s.y}%)`);
							}
						});
						if (outlier.length) {
							_this.nationalRegionReportingTrendOutlier = outlier;
						} else {
							_this.nationalRegionReportingTrendOutlier = [
								_this.$i18n.t("noRegionsFound"),
							];
						}

						this.xAxis[0].options.max =
							e.seriesOptions.data.length - 1 > 11
								? !_this.reportChartData
									? 11
									: e.seriesOptions.data.length - 1
								: e.seriesOptions.data.length - 1;
						this.yAxis[0].addPlotLine({
							id: "p1",
							value: y,
							percValue: undefined,
							valueType: "percentage",
							color: "#0000ff",
							width: 2,
							zIndex: 5,
							dashStyle: "solid",
							label: {
								enabled: true,
								text: `${this.options.series[0].name} (${e.seriesOptions.name}): ${y}%`,
								textVisible: "",
								align: "center",
								style: {
									color: "#f6f6f6",
									fontWeight: 700,
									fontSize: "16px",
								},
							},
						});
					},
				};

				this.regionalReportingTrend.chart.events = {
					selection: function (e) {
						if (!e.xAxis) {
							let catLen = this.options.series[0].data.length - 1;
							if (catLen > 11 && !_this.reportChartData) {
								setTimeout(() => {
									this.xAxis[0].setExtremes(catLen - 11, catLen);
								}, 0);
							}
							_this.regionalReportingTrendDownload = false;
						} else {
							_this.regionalReportingTrendDownload = true;
						}
					},
					load: function () {
						if (
							this.options.series.length &&
							this.options.series[0].data.length &&
							!_this.reportChartData
						) {
							var catLen = this.options.series[0].data.length - 1;
							if (catLen > 11) {
								this.xAxis[0].setExtremes(catLen - 11, catLen);
							}
						}
					},
				};

				this.regionalReportingRate.chart.events = {
					selection: function (e) {
						if (!e.xAxis) {
							let catLen = this.options.series[0].data.length - 1;
							if (catLen > 11) {
								setTimeout(() => {
									this.xAxis[0].setExtremes(catLen - 11, catLen);
								}, 0);
							}
							_this.regionalReportingRateDownload = false;
						} else {
							_this.regionalReportingRateDownload = true;
						}
					},
					load: function () {
						if (
							this.options.series.length &&
							this.options.series[0].data.length
						) {
							var catLen = this.options.series[0].data.length - 1;
							if (catLen > 11) {
								this.xAxis[0].setExtremes(catLen - 11, catLen);
							}
						}
					},
				};

				this.compareRegionalReportingTrend.chart.events = {
					selection: function (e) {
						if (!e.xAxis) {
							_this.compareRegionalReportingTrendDownload = false;
						} else {
							_this.compareRegionalReportingTrendDownload = true;
						}
					},
				};

				let items1 = [];
				let fields1 = [
					{
						key: this.$i18n.t("location"),
						stickyColumn: true,
						sortable: true,
						isRowHeader: true,
						// variant: "primary",
					},
				];

				this.regionalReportingTrendTable = {
					items: items1,
					fields: fields1,
				};

				let items3 = [];
				let fields3 = [this.$i18n.t("period")];

				this.compareRegionalReportingTrendTable = {
					items: items3,
					fields: fields3,
				};

				let items2 = [];
				let fields2 = [this.$i18n.t("period")];

				this.regionalReportingRateTable = {
					items: items2,
					fields: fields2,
				};

				// let cData = sourceConfig.chartData.find(c => c.indicator.name === this.dataType)
				let cData = sourceConfig;
				this.reportingFormsOptions = [];

				cData.externalForms.forEach((s) => {
					if (!s.disableChart && s.de.length) {
						this.reportingFormsOptions.push(s.name[0]);
					}
				});
				this.selectedReportingForm = this.selectedReportingForm
					? this.selectedReportingForm
					: this.reportingFormsOptions[0];

				if (cData) {
					let sSelectedDE = "",
						aSelectedDE = [];
					let sSelectedDEReportingForm = "",
						aSelectedDEReportingFormName = [],
						aSelectedDEReportingForm = [];
					cData.subIndicator.forEach((s) => {
						let name = Array.isArray(s.name) ? s.name[0] : s.name;
						s.de.forEach((sd) => {
							aSelectedDE.push(sd);
							aSelectedDEReportingForm.push(sd);
							aSelectedDEReportingFormName.push(name);
						});
					});
					sSelectedDE = aSelectedDE.join(";");

					cData.externalForms.forEach((s) => {
						if (this.selectedReportingForm === s.name[0]) {
							this.regionalReportingRateChartInfo = s.chartInfo;
							this.regionalReportingRateChartName = s.chartName;
							this.regionalReportingRateComment = s.cid ? true : false;
							this.regionalReportingRateCID = s.cid || "";
							this.regionalReportingRate.chart.type = "line";
							this.regionalReportingRate.title.text = s.title.visible
								? s.title.text
								: "";
							this.regionalReportingRate.title.title =
								this.$i18n.t("compTime") +
								" - " +
								this.filters +
								" - " +
								s.chartName;
							this.regionalReportingRate.subtitle.text = s.subTitle.visible
								? s.subTitle.text
								: "";
							this.regionalReportingRate.xAxis.title.text = s.xAxis.visible
								? s.xAxis.text
								: "";
							this.regionalReportingRate.yAxis.title.text = s.yAxis.visible
								? s.yAxis.text
								: "";
							this.regionalReportingRate.yAxis.plotLines =
								plotLines.length > 0
									? plotLines.map((p) => {
											if (p.value) {
												return {
													...p,
													label: {
														...p.label,
														text: p.label.enabled
															? `${p.label.text} (${p.value}%)`
															: "",
													},
												};
											} else {
												return {};
											}
									  })
									: [];
							this.regionalReportingRate.plotOptions = {
								..._this.regionalReportingRate.plotOptions,
								series: {
									..._this.regionalReportingRate.plotOptions.series,
									events: {
										legendItemClick: function () {
											if (!_this.drillDown) {
												let index =
													_this.regionalReportingRate.series.findIndex(
														(s) => s.name === this.name
													);
												if (index >= 0) {
													_this.regionalReportingRate.series[index] = {
														..._this.regionalReportingRate.series[index],
														visible:
															_this.regionalReportingRate.series[index]
																.visible !== undefined
																? !_this.regionalReportingRate.series[index]
																		.visible
																: false,
													};
												}
											}
										},
									},
									showInLegend: true,
								},
							};
							// this.regionalReportingRate.plotOptions[s.chartOptions.chart.type.toLowerCase()].dataLabels.enabled = sourceConfig.dataLabels.enabled
							this.regionalReportingRate.series = [];
							// this.regionalReportingRate.xAxis.categories = []
							// this.regionalReportingRate.xAxis.type = ''
							this.regionalReportingRateOutlier = [];
							let name = Array.isArray(s.name) ? s.name[0] : s.name;
							s.de.forEach((sd) => {
								aSelectedDEReportingForm.push(sd);
								aSelectedDEReportingFormName.push(name);
							});
						}
					});
					sSelectedDEReportingForm = aSelectedDEReportingForm.join(";");

					let level = [this.defaultLevelID, this.subLevelID];
					let period = getDateRange({
						sendPeriod: this.period,
						periodType: this.periodType,
						periodLength: this.periodLength,
						applicationFinalYear: this.applicationFinalYear,
					});

					period = period.reverse().join(";");

					if (sSelectedDE) {
						if (this.debugging) {
							console.log(
								this.filters +
									" - reportingRate - Calling API getIndicatorData() with params selected DE = '" +
									sSelectedDE +
									"', Level = '" +
									level +
									"', Country ID = '" +
									this.defaultLocationID +
									"', Period = '" +
									period +
									"' @",
								this.$moment().format("MMMM Do YYYY, h:mm:ss a")
							);
							if (this.activityLogArr) {
								var obj_log = {
									name: this.filters,
									time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
									content:
										"- reportingRate - Calling API getIndicatorData() with params selected DE = '" +
										sSelectedDE +
										"', Level = '" +
										level +
										"', Country ID = '" +
										this.defaultLocationID +
										"', Period = '" +
										period,
								};
								this.activityLogArr.push(obj_log);
							}
						}
						service
							.getIndicatorData(
								sSelectedDE,
								level,
								this.defaultLocationID,
								period
							)
							.then((response) => {
								if (this.debugging) {
									console.log(
										this.filters +
											" - reportingRate - getIndicatorData() API response received @",
										this.$moment().format("MMMM Do YYYY, h:mm:ss a")
									);
									if (this.activityLogArr) {
										var obj_log = {
											name: this.filters,
											time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
											content:
												"- reportingRate - Calling API getIndicatorData() with params selected DE = '" +
												sSelectedDE +
												"', Level = '" +
												level +
												"', Country ID = '" +
												this.defaultLocationID +
												"', Period = '" +
												period,
										};
										this.activityLogArr.push(obj_log);
									}
								}
								if (response.data.rows.length) {
									let pe = response.data.metaData.dimensions.pe;
									// let ou = response.data.metaData.dimensions.ou
									let categories = [];

									pe.forEach((p) => {
										if (response.data.metaData.items[p]) {
											let formattedPeriod = translateDate({
												rawDate: p,
												periodType: this.periodType,
											});

											categories.push(formattedPeriod);
											this.nationalReportingTrendTable.items.push({
												[this.$i18n.t("period")]: formattedPeriod,
											});
											fields1.push({ key: formattedPeriod, sortable: true });
											this.compareRegionalReportingTrendTable.items.push({
												[this.$i18n.t("period")]: formattedPeriod,
											});
											this.regionalReportingRateTable.items.push({
												[this.$i18n.t("period")]: formattedPeriod,
											});
										}
									});
									fields1.push("Average");

									let valueIndex = 0,
										ouIndex = 0,
										peIndex = 0;
									response.data.headers.forEach((h, i) => {
										if (h.name === "value") {
											valueIndex = i;
										}
										if (h.name === "ou") {
											ouIndex = i;
										}

										if (h.name === "pe") {
											peIndex = i;
										}
									});

									let rData = {};
									response.data.rows.forEach((r) => {
										if (Object.keys(rData).includes(r[ouIndex])) {
											if (Object.keys(rData[r[ouIndex]]).includes(r[peIndex])) {
												rData[r[ouIndex]][r[peIndex]] =
													Number(rData[r[ouIndex]][r[peIndex]]) +
													Number(r[valueIndex]);
											} else {
												rData[r[ouIndex]][r[peIndex]] = r[valueIndex];
											}
										} else {
											rData[r[ouIndex]] = {
												[r[peIndex]]: r[valueIndex],
											};
										}
									});

									let obj = {},
										bFlag = false,
										series = [],
										drilldown = {
											drillUpButton: {
												position: {
													align: "left",
													x: 0,
													y: 0,
												},
											},
											series: [],
										};

									// Comparing Regional Reporting Rate Trends
									let subtractedSingleDate1 = subtractNDate({
										rawDate: this.period,
										periodType: this.periodType,
									});
									let headerPeriod =
										translateDate({
											rawDate: this.period,
											periodType: this.periodType,
										}) +
										" - " +
										translateDate({
											rawDate: subtractedSingleDate1,
											periodType: this.periodType,
										});

									let series1 = [
										{
											name: `${this.$i18n.t("changeIn")} ${this.$i18n.t(
												"Reporting Rate"
											)} ( ${headerPeriod} )`,
											color: cData.subIndicator[0]
												? cData.subIndicator[0].color
												: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
											data: [],
										},
									];

									Object.keys(rData).forEach((d, j) => {
										if (d === this.defaultLocationID) {
											let name = response.data.metaData.items[d].name || null;
											fields.push(name);

											let avg = 0,
												sum = 0,
												len = Object.keys(rData[d]).length;

											Object.keys(rData[d]).forEach((s) => {
												sum = sum + rData[d][s] * 1;
											});

											avg = sum / len;
											this.substantialChangeAvg = avg.toFixed(2);

											obj = {
												name,
												data: [],
												visible: true,
												// color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
												color: cData.subIndicator[0]
													? cData.subIndicator[0].color
													: "#" +
													  ((Math.random() * 0xffffff) << 0).toString(16),
											};
											let outlier = [],
												narration = [];
											pe.forEach((p, i) => {
												if (Object.keys(rData[d]).includes(p)) {
													obj.data.push({
														name: categories[i],
														pe: p,
														y: rData[d][p] * 1,
														drilldown: categories[i],
													});
													items[i] = {
														...items[i],
														[name]: rData[d][p] * 1,
													};

													// if((avg - (rData[d][p] * 1)) > this.substantialChange || (avg - (rData[d][p] * 1)) < -this.substantialChange){
													if (avg - rData[d][p] * 1 < -this.substantialChange) {
														this.substantialChangeOutlier.push(
															`${categories[i]} (${(
																avg -
																rData[d][p] * 1
															).toFixed(2)}%)`
														);
													}

													if (plotLines.length > 0) {
														if (rData[d][p] * 1 < plotLines[0].value * 1) {
															let diff =
																rData[d][p] * 1 - plotLines[0].value * 1;
															let range = "";
															if (diff < 0) {
																range = "lower";
															} else {
																range = "greater";
															}
															narration.push(
																`<strong>${name}</strong> in <strong>${
																	categories[i]
																}</strong> (${
																	rData[d][p] * 1
																}%) is <strong><span class="text-danger">${Math.abs(
																	diff.toFixed(2)
																)}% ${range}</span></strong> than Threshold value (${
																	plotLines[0].value * 1
																}%)`
															);

															outlier.push(
																`${categories[i]} (${rData[d][p] * 1}%)`
															);

															items[i] = {
																...items[i],
																_rowVariant: "danger",
															};
														}
													}
												} else {
													obj.data.push({
														name: categories[i],
														pe: p,
														y: null,
														drilldown: null,
													});
													items[i] = {
														...items[i],
														[name]: "",
													};
												}
											});
											this.substantialChangeOutlier.reverse();
											if (plotLines.length > 0) {
												this.nationalReportingTrendOutlier.push({
													name: name,
													outlier: outlier.reverse(),
													narration: narration,
												});
											}
											series.push(obj);
										} else {
											// Comparing Regional Reporting Rate Trends
											let currentPeriod = formatSingleDate({
												rawDate: this.period,
												periodType: this.periodType,
											});
											let currentPeriodPreviousMonth = subtractNDate({
												rawDate: this.period,
												periodType: this.periodType,
											});
											//updated chart value by subtracting current period value with previus period value
											let name = response.data.metaData.items[d].name || null,
												chartValue =
													rData[d][currentPeriod] -
													rData[d][currentPeriodPreviousMonth],
												colorValue = null;
											if (chartValue > 0) {
												colorValue = "#55BF3B";
											}
											if (chartValue < 0) {
												colorValue = "#DF5353";
											}
											fields3.push(name);

											obj = {
												name: name,
												color: colorValue,
												//data: [],
												y: chartValue.toFixed(2) * 1,
												//drilldown: name.replace(/\s/g, '')
											};

											let outlier = [],
												narration = [];

											this.compareRegionalReportingTrendOutlier.push({
												name: name,
												outlier: outlier.reverse(),
												narration: narration,
											});
											series1[0].data.push(obj);
										}

										if (j === Object.keys(rData).length - 1) {
											bFlag = true;
										}
									});

									let subtractedSingleDate = subtractNDate({
										rawDate: this.period,
										periodType: this.periodType,
									});
									let currentPeriod = translateDate({
										rawDate: this.period,
										periodType: this.periodType,
									});
									let currentPeriodPreviousMonth = translateDate({
										rawDate: subtractedSingleDate,
										periodType: this.periodType,
									});

									this.compareRegionalReportingTrendChartName =
										this.compareRegionalReportingTrendChartName +
										" " +
										currentPeriod +
										" - " +
										currentPeriodPreviousMonth;
									this.compareRegionalReportingTrend.title.title =
										this.compareRegionalReportingTrend.title.title +
										" " +
										currentPeriod +
										" - " +
										currentPeriodPreviousMonth;

									if (bFlag && series.length) {
										series[0].data.forEach((rt, k) => {
											obj = {
												id: rt.name,
												name: rt.name,
												type: "column",
												data: [],
											};
											let regions = [];
											Object.keys(rData).forEach((d) => {
												let name = response.data.metaData.items[d].name || null;
												if (d !== this.defaultLocationID) {
													if (Object.keys(rData[d]).includes(rt.pe)) {
														obj.data.push({
															name,
															y: rData[d][rt.pe] * 1,
															locationID: d,
														});
														if (rData[d][rt.pe] * 1 < rt.y) {
															regions.push({
																[this.$i18n.t("location")]: name,
																[this.$i18n.t("perValue")]: rData[d][rt.pe] * 1,
																_rowVariant: "danger",
															});
														} else {
															regions.push({
																[this.$i18n.t("location")]: name,
																[this.$i18n.t("perValue")]: rData[d][rt.pe] * 1,
															});
														}
													} else {
														obj.data.push({
															name,
															y: null,
															locationID: d,
														});
														regions.push({
															[this.$i18n.t("location")]: name,
															[this.$i18n.t("perValue")]: "",
														});
													}
												}
											});
											items[k] = {
												...items[k],
												regions: regions,
											};
											drilldown.series.push(obj);
										});
									}
									if (series.length) {
										let fDataSeries = series;
										fDataSeries = [
											{
												...fDataSeries[0],
												data: fDataSeries[0].data.map((a) => {
													if (a.y < plotLines[0].value * 1) {
														return {
															...a,
															color: "red",
														};
													} else {
														return a;
													}
												}),
											},
										];

										let min = 0,
											max = 0;
										fDataSeries.forEach((d) => {
											let innerDataArr = d.data.map((dInner) => dInner.y);
											let innerMin = Math.min(...innerDataArr);
											let innerMax = Math.max(...innerDataArr);
											if (innerMin < min) {
												min = innerMin;
											}
											if (innerMax > max) {
												max = innerMax;
											}
										});
										this.nationalReportingTrend.yAxis.min = min > 0 ? 0 : min;
										this.nationalReportingTrend.yAxis.max =
											max > plotLines[0].value * 1
												? max
												: plotLines[0].value * 1 + 5;
										// this.yMax = max
										this.nationalReportingTrend.series = fDataSeries;
										this.nationalReportingTrend.xAxis.max =
											fDataSeries[0].data.length - 1;
									} else {
										this.nationalReportingTrend.series = series;
										if (!series.length && !series[0].data.length) {
											this.nationalReportingTrendDisable = false;
										}
										if (this.debugging) {
											if (this.activityLogArr) {
												var obj_log = {
													name: this.filters,
													time: this.$moment().format(
														"MMMM Do YYYY, h:mm:ss a"
													),
													content: "Series not generated",
												};
												this.activityLogArr.push(obj_log);
											}
										}
									}

									this.nationalReportingTrend.drilldown = drilldown;

									this.compareRegionalReportingTrend.xAxis.max =
										series1[0].data.length - 1;
									this.compareRegionalReportingTrend.series = series1;
									if (!series1[0].data.length) {
										this.compareRegionalReportingTrendDisable = false;
									}

									if (
										(this.reportChartData &&
											this.reportChartData.cid.split("/")[1] ===
												this.compareRegionalReportingTrendCID) ||
										(this.reportChartData &&
											this.reportChartData.linkedCharts.find((c) =>
												c.includes(this.compareRegionalReportingTrendCID)
											))
									) {
										let cid = this.getCID(
											this.reportChartData,
											this.compareRegionalReportingTrendCID
										);
										this.$emit("setReportChart", {
											chartObj: this.compareRegionalReportingTrend,
											chartName: this.compareRegionalReportingTrendChartName,
											cid: [cid],
										});
										// return;
									}
									//this.compareRegionalReportingTrend.drilldown = drilldown1

									fields.push({
										key: "show_regions",
										label: this.$i18n.t("show_regions"),
									});
									this.nationalReportingTrendTable = {
										items: items,
										fields: fields,
									};
									let compareRegionalReportingTrendTableFields = [];
									let compareRegionalReportingTrendTableItems = [];
									this.compareRegionalReportingTrend.series[0].data.forEach(
										(value) => {
											compareRegionalReportingTrendTableFields.push(value.name);
											compareRegionalReportingTrendTableItems.push({
												[this.$i18n.t("location")]: value.name,
												[this.$i18n.t("value")]: value.y.toFixed(2) + " %",
											});
										}
									);
									this.compareRegionalReportingTrendTable = {
										items: compareRegionalReportingTrendTableItems,
										fields: [this.$i18n.t("location"), this.$i18n.t("value")],
									};

									let formatedPeriod = formatSingleDate({
										rawDate: this.period,
										periodType: this.periodType,
									});
									let s =
										this.nationalReportingTrend.series.length &&
										this.nationalReportingTrend.series[0].data.find(
											(obj) => obj.pe == formatedPeriod
										);
									let exportArr = [];
									if (this.exportPosition === "1") {
										if (
											this.nationalReportingTrendDisable &&
											this.nationalReportingTrend.series.length
										) {
											exportArr.push({
												cardKey: "key2",
												...this.nationalReportingTrend,
											});
										}

										if (
											this.compareRegionalReportingTrendDisable &&
											this.compareRegionalReportingTrend.series.length
										) {
											exportArr.push({
												cardKey: "key3",
												...this.compareRegionalReportingTrend,
											});
										}

										if (
											this.regionalReportingTrendDisable &&
											this.regionalReportingTrend.series.length
										) {
											exportArr.push({
												cardKey: "key4",
												...this.regionalReportingTrend,
											});
										}

										if (this.reportingFormsOptions.length > 0) {
											exportArr.push({
												cardKey: "key5",
												...this.regionalReportingRate,
											});
										}
									} else {
										if (
											this.nationalReportingTrendDisable &&
											this.nationalReportingTrend.series.length
										) {
											exportArr.push({
												cardKey: "key6",
												...this.nationalReportingTrend,
											});
										}

										if (
											this.compareRegionalReportingTrendDisable &&
											this.compareRegionalReportingTrend.series.length
										) {
											exportArr.push({
												cardKey: "key7",
												...this.compareRegionalReportingTrend,
											});
										}

										if (
											this.regionalReportingTrendDisable &&
											this.regionalReportingTrend.series.length
										) {
											exportArr.push({
												cardKey: "key8",
												...this.regionalReportingTrend,
											});
										}

										if (this.reportingFormsOptions.length > 0) {
											exportArr.push({
												cardKey: "key9",
												...this.regionalReportingRate,
											});
										}
									}
									if (s && s.y > plotLines[0].value * 1) {
										this.$emit("sendScore", this.scoreKey, true, exportArr);
									} else {
										this.$emit("sendScore", this.scoreKey, false, exportArr);
									}

									Object.keys(rData).forEach((o) => {
										this.regionalReportingTrendTable.items.push({
											[this.$i18n.t("location")]:
												response.data.metaData.items[o].name || null,
											_cellVariants: {
												[this.$i18n.t("location")]:
													o === this.defaultLocationID
														? "primary"
														: "secondary",
											},
										});
									});

									let locID = Object.keys(rData).filter(
										(o) => o !== this.defaultLocationID
									);
									if (locID.length) {
										Object.keys(rData).forEach((d, j) => {
											let name = response.data.metaData.items[d].name || null;

											// fields1.push(name)

											let avg = 0,
												sum = 0,
												len = Object.keys(rData[d]).length;

											Object.keys(rData[d]).forEach((s) => {
												sum = sum + rData[d][s] * 1;
											});

											avg = sum / len;
											items1[j] = {
												...items1[j],
												Average: avg.toFixed(2),
												_cellVariants: {
													...items1[j]["_cellVariants"],
													Average: "info",
												},
											};
											obj = {
												name,
												data: [],
												visible: j > 4 ? false : true,
												color:
													d === this.defaultLocationID
														? cData.subIndicator[0].color
														: "#" +
														  ((Math.random() * 0xffffff) << 0).toString(16),
											};
											let outlier = [],
												narration = [];
											pe.forEach((p, i) => {
												if (Object.keys(rData[d]).includes(p)) {
													obj.data.push({
														name: categories[i],
														pe: p,
														y: rData[d][p] * 1,
													});
													items1[j] = {
														...items1[j],
														[categories[i]]: rData[d][p] * 1,
													};

													// if(d === this.defaultLocationID){
													if (plotLines.length > 0) {
														if (rData[d][p] * 1 < plotLines[0].value * 1) {
															items1[j] = {
																...items1[j],
																_cellVariants: {
																	...items1[j]["_cellVariants"],
																	[categories[i]]: "danger",
																},
															};

															if (plotLines[0].value !== "") {
																let diff =
																	rData[d][p] * 1 - plotLines[0].value * 1;
																let range = "";
																if (diff < 0) {
																	range = "lower";
																} else {
																	range = "greater";
																}
																narration.push(
																	`<strong>${name}</strong> in <strong>${
																		categories[i]
																	}</strong> (${
																		rData[d][p] * 1
																	}%) is <strong><span class="text-danger">${Math.abs(
																		diff.toFixed(2)
																	)}% ${range}</span></strong> than Threshold value (${
																		plotLines[0].value * 1
																	}%)`
																);

																outlier.push(
																	`${categories[i]} (${rData[d][p] * 1}%)`
																);
															}
														}

														if (rData[d][p] * 1 >= plotLines[0].value * 1) {
															if (
																avg - rData[d][p] * 1 >
																this.substantialChange
															) {
																items1[j] = {
																	...items1[j],
																	_cellVariants: {
																		...items1[j]["_cellVariants"],
																		[categories[i]]: "warning",
																	},
																};
															} else {
																items1[j] = {
																	...items1[j],
																	_cellVariants: {
																		...items1[j]["_cellVariants"],
																		[categories[i]]: "success",
																	},
																};
															}
														}
													}
													// } else {
													//   if( (rData[d][p] * 1) < series[0].data[i].y) {
													//     items1[i] = {
													//       ...items1[i],
													//       _cellVariants: {...items1[i]['_cellVariants'],[name] : 'danger'}
													//     }
													//     if (plotLines[0].value !== "") {
													//         outlier.push(`${categories[i]} (${rData[d][p] * 1}%)`)
													//     }
													//   }
													// }
												} else {
													obj.data.push({
														name: categories[i],
														pe: p,
														y: null,
													});
													items1[j] = {
														...items1[j],
														[categories[i]]: "",
													};
												}
											});
											if (plotLines.length > 0) {
												this.regionalReportingTrendOutlier.push({
													name: name,
													outlier: outlier.reverse(),
													narration: narration,
												});
											}
											this.regionalReportingTrend.series.push(obj);
										});

										let min1 = 0,
											max1 = 0,
											xMax = 0;
										this.regionalReportingTrend.series.forEach((d) => {
											let innerDataArr = d.data.map((dInner) => dInner.y);
											let innerMin = Math.min(...innerDataArr);
											let innerMax = Math.max(...innerDataArr);
											if (innerMin < min1) {
												min1 = innerMin;
											}
											if (innerMax > max1) {
												max1 = innerMax;
											}
											let xM = d.data.length;
											if (xMax < xM) {
												xMax = xM;
											}
										});
										this.regionalReportingTrend.yAxis.min = min1 > 0 ? 0 : min1;
										this.regionalReportingTrend.yAxis.max = max1;
										this.regionalReportingTrend.xAxis.max =
											xMax > 11
												? this.reportChartData
													? xMax - 1
													: 11
												: xMax - 1;

										this.originalData = this.regionalReportingTrend.series;
										this.regionalReportingTrendTable = {
											items: items1,
											fields: fields1,
										};
									} else {
										this.regionalReportingTrendDisable = false;
									}

									this.benchmarkValue = plotLines[0].value * 1;
									if (this.activeTab === "reportingRate") {
										this.$store.state.loading = false;
									}

									if (
										(this.reportChartData &&
											this.reportChartData.cid.split("/")[1] ===
												this.nationalReportingTrendCID) ||
										(this.reportChartData &&
											this.reportChartData.linkedCharts.find((c) =>
												c.includes(this.nationalReportingTrendCID)
											))
									) {
										let cid = this.getCID(
											this.reportChartData,
											this.nationalReportingTrendCID
										);
										this.$emit("setReportChart", {
											chartObj: this.nationalReportingTrend,
											chartName: this.nationalReportingTrendChartName,
											cid: [cid],
										});
										// return;
									}
									if (
										(this.reportChartData &&
											this.reportChartData.cid.split("/")[1] ===
												this.regionalReportingTrendCID) ||
										(this.reportChartData &&
											this.reportChartData.linkedCharts.find((c) =>
												c.includes(this.regionalReportingTrendCID)
											))
									) {
										let cid = this.getCID(
											this.reportChartData,
											this.regionalReportingTrendCID
										);
										this.$emit("setReportChart", {
											chartObj: this.regionalReportingTrend,
											chartName: this.regionalReportingTrendChartName,
											cid: [cid],
										});
										// return;
									}

									if (aSelectedDEReportingForm.length > 1) {
										if (this.debugging) {
											console.log(
												this.filters +
													" - reportingRate - Calling API getIndicatorData() for external forms with params selected DE = '" +
													sSelectedDEReportingForm +
													"', Level = '" +
													[level[0]] +
													"', Country ID = '" +
													this.defaultLocationID +
													"', Period = '" +
													period +
													"' @",
												this.$moment().format("MMMM Do YYYY, h:mm:ss a")
											);
											if (this.activityLogArr) {
												var obj_log = {
													name: this.filters,
													time: this.$moment().format(
														"MMMM Do YYYY, h:mm:ss a"
													),
													content:
														"reportingRate - Calling API getIndicatorData() for external forms with params selected DE = '" +
														sSelectedDEReportingForm +
														"', Level = '" +
														[level[0]] +
														"', Country ID = '" +
														this.defaultLocationID +
														"', Period = '" +
														period,
												};
												this.activityLogArr.push(obj_log);
											}
										}
										service
											.getIndicatorData(
												sSelectedDEReportingForm,
												[level[0]],
												this.defaultLocationID,
												period
											)
											.then((response) => {
												if (this.debugging) {
													console.log(
														this.filters +
															" - reportingRate - getIndicatorData() API response for external forms received @",
														this.$moment().format("MMMM Do YYYY, h:mm:ss a")
													);
													if (this.activityLogArr) {
														var obj_log = {
															name: this.filters,
															time: this.$moment().format(
																"MMMM Do YYYY, h:mm:ss a"
															),
															content:
																"reportingRate - getIndicatorData() API response for external forms received",
														};
														this.activityLogArr.push(obj_log);
													}
												}
												let pe = response.data.metaData.dimensions.pe;
												let valueIndex = 0,
													dxIndex = 0,
													peIndex = 0;
												response.data.headers.forEach((h, i) => {
													if (h.name === "value") {
														valueIndex = i;
													}
													if (h.name === "dx") {
														dxIndex = i;
													}

													if (h.name === "pe") {
														peIndex = i;
													}
												});

												let rData = {};
												response.data.rows.forEach((r) => {
													if (Object.keys(rData).includes(r[dxIndex])) {
														if (
															Object.keys(rData[r[dxIndex]]).includes(
																r[peIndex]
															)
														) {
															rData[r[dxIndex]][r[peIndex]] =
																Number(rData[r[dxIndex]][r[peIndex]]) +
																Number(r[valueIndex]);
														} else {
															rData[r[dxIndex]][r[peIndex]] = r[valueIndex];
														}
													} else {
														rData[r[dxIndex]] = {
															[r[peIndex]]: r[valueIndex],
														};
													}
												});

												Object.keys(rData).forEach((d, j) => {
													let name = aSelectedDEReportingFormName[j];
													let color = "#DF5353";
													cData.subIndicator.forEach((sI) => {
														if (sI.de.includes(d)) {
															color = sI.color;
														}
													});

													cData.externalForms.forEach((eF) => {
														if (eF.de.includes(d)) {
															color = eF.color;
														}
													});
													fields2.push(name);
													obj = {
														name,
														data: [],
														visible: true,
														color,
													};
													let outlier = [],
														narration = [];
													pe.forEach((p, i) => {
														if (Object.keys(rData[d]).includes(p)) {
															obj.data.push({
																name: categories[i],
																pe: p,
																y: rData[d][p] * 1,
															});
															items2[i] = {
																...items2[i],
																[name]: rData[d][p] * 1,
															};
															if (plotLines.length > 0) {
																if (rData[d][p] * 1 < plotLines[0].value * 1) {
																	items2[i] = {
																		...items2[i],
																		_cellVariants: {
																			...items2[i]["_cellVariants"],
																			[name]: "danger",
																		},
																	};

																	let diff =
																		rData[d][p] * 1 - plotLines[0].value * 1;
																	let range = "";
																	if (diff < 0) {
																		range = "lower";
																	} else {
																		range = "greater";
																	}

																	narration.push(
																		`<strong>${name}</strong> in <strong>${
																			categories[i]
																		}</strong> (${
																			rData[d][p] * 1
																		}%) is <strong><span class="text-danger">${Math.abs(
																			diff.toFixed(2)
																		)}% ${range}</span></strong> than Threshold value (${
																			plotLines[0].value * 1
																		}%)`
																	);

																	outlier.push(
																		`${categories[i]} (${rData[d][p] * 1}%)`
																	);
																}
															}
														} else {
															obj.data.push({
																name: categories[i],
																pe: p,
																y: null,
															});
															items2[i] = {
																...items2[i],
																[name]: "",
															};
														}
													});
													if (plotLines.length > 0) {
														this.regionalReportingRateOutlier.push({
															name: name,
															outlier: outlier.reverse(),
															narration: narration,
														});
													}
													this.regionalReportingRate.series.push(obj);
												});

												let min2 = 0,
													max2 = 0;
												this.regionalReportingRate.series.forEach((d) => {
													let innerDataArr = d.data.map((dInner) => dInner.y);
													let innerMin = Math.min(...innerDataArr);
													let innerMax = Math.max(...innerDataArr);
													if (innerMin < min2) {
														min2 = innerMin;
													}
													if (innerMax > max2) {
														max2 = innerMax;
													}
												});
												this.regionalReportingRate.yAxis.min =
													min2 > 0 ? 0 : min2;
												this.regionalReportingRate.yAxis.max = max2;

												this.regionalReportingRateTable = {
													items: items2,
													fields: fields2,
												};

												if (this.activeTab === "reportingRate") {
													this.$store.state.loading = false;
												}

												if (this.debugging && this.activityLogArr) {
													this.$emit("sendlog", this.activityLogArr);
												}
											})
											.catch(() => {
												// this.$emit('sendScore', this.scoreKey, false, [])
												if (this.debugging) {
													console.log(
														this.filters +
															" - reportingRate - getIndicatorData() API response for external forms  failed @",
														this.$moment().format("MMMM Do YYYY, h:mm:ss a")
													);
													if (this.activityLogArr) {
														var obj_log = {
															name: this.filters,
															time: this.$moment().format(
																"MMMM Do YYYY, h:mm:ss a"
															),
															content:
																"reportingRate - getIndicatorData() API response for external forms  failed ",
														};
														this.activityLogArr.push(obj_log);
														this.$emit("sendlog", this.activityLogArr);
													}
												}
												if (this.activeTab === "reportingRate") {
													this.$store.state.loading = false;
												}
											});
									} else {
										if (this.debugging) {
											if (this.activityLogArr) {
												var obj_log = {
													name: this.filters,
													time: this.$moment().format(
														"MMMM Do YYYY, h:mm:ss a"
													),
													content:
														"aSelectedDEReportingForm length is not greater than zero",
												};
												this.activityLogArr.push(obj_log);
												this.$emit("sendlog", this.activityLogArr);
											}
										}
										// this.$emit('sendScore', this.scoreKey, false, [])
										if (this.activeTab === "reportingRate") {
											this.$store.state.loading = false;
										}
									}
									this.failedText = "";
								} else {
									if (this.debugging) {
										if (this.activityLogArr) {
											var obj_log = {
												name: this.filters,
												time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
												content: "API response data not available",
											};
											this.activityLogArr.push(obj_log);
											this.$emit("sendlog", this.activityLogArr);
										}
									}
									this.$emit("sendScore", this.scoreKey, false, []);
									if (this.activeTab === "reportingRate") {
										this.$store.state.loading = false;
									}
									this.nationalReportingTrendDisable = false;
									this.failedText = this.$i18n.t("no_data_to_display");
									if (this.reportChartData) {
										this.$emit("setReportChart", {
											chartObj: null,
											chartName: null,
											cid: [
												this.reportChartData.cid,
												...this.reportChartData.linkedCharts,
											],
										});
									}
								}
							})
							.catch(() => {
								this.$emit("sendScore", this.scoreKey, false, []);
								if (this.activeTab === "reportingRate") {
									this.$store.state.loading = false;
								}
								this.nationalReportingTrendDisable = false;
								this.failedText = this.$i18n.t("no_data_to_display");
								if (this.debugging) {
									console.log(
										this.filters +
											" - reportingRate - getIndicatorData() API response failed @",
										this.$moment().format("MMMM Do YYYY, h:mm:ss a")
									);
									if (this.activityLogArr) {
										var obj_log = {
											name: this.filters,
											time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
											content:
												"reportingRate - getIndicatorData() API response failed",
										};
										this.activityLogArr.push(obj_log);
										this.$emit("sendlog", this.activityLogArr);
									}
								}
								if (this.reportChartData) {
									this.$emit("setReportChart", {
										chartObj: null,
										chartName: null,
										cid: [
											this.reportChartData.cid,
											...this.reportChartData.linkedCharts,
										],
									});
								}
							});
					} else {
						if (this.debugging) {
							if (this.activityLogArr) {
								var obj_log = {
									name: this.filters,
									time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
									content: "Data Mapping not available",
								};
								this.activityLogArr.push(obj_log);
								this.$emit("sendlog", this.activityLogArr);
							}
						}
						this.$emit("sendScore", this.scoreKey, false, []);
						if (this.activeTab === "reportingRate") {
							this.$store.state.loading = false;
						}
						this.nationalReportingTrendDisable = false;
						this.failedText = this.$i18n.t("maperror_msg");
						if (this.reportChartData) {
							this.$emit("setReportChart", {
								chartObj: null,
								chartName: null,
								cid: [
									this.reportChartData.cid,
									...this.reportChartData.linkedCharts,
								],
							});
						}
					}
				} else {
					if (this.debugging) {
						if (this.activityLogArr) {
							var obj_log = {
								name: this.filters,
								time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
								content: "Configuration cData not available",
							};
							this.activityLogArr.push(obj_log);
							this.$emit("sendlog", this.activityLogArr);
						}
					}
					this.$emit("sendScore", this.scoreKey, false, []);
					this.nationalReportingTrendDisable = false;
					this.failedText = this.$i18n.t("maperror_msg");
					if (this.activeTab === "reportingRate") {
						this.$store.state.loading = false;
					}
				}
			} else {
				if (this.debugging) {
					if (this.activityLogArr) {
						var obj_log = {
							name: this.filters,
							time: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
							content: "sourceConfig is not defined",
						};
						this.activityLogArr.push(obj_log);
						this.$emit("sendlog", this.activityLogArr);
					}
				}
				this.nationalReportingTrendDisable = false;
				this.$emit("sendScore", this.scoreKey, false, []);
				if (this.activeTab === "reportingRate") {
					this.$store.state.loading = false;
				}
				this.failedText = this.$i18n.t("maperror_msg");
				if (this.reportChartData) {
					this.$emit("setReportChart", {
						chartObj: null,
						chartName: null,
						cid: [
							this.reportChartData.cid,
							...this.reportChartData.linkedCharts,
						],
					});
				}
			}
		},
		calculateNationalTrendBackground(plotLines = []) {
			let sourceConfig = JSON.parse(
				JSON.stringify(this.dqrResponse.reportingRate[this.source])
			);
			sourceConfig = sourceConfig.chartData.find(
				(c) =>
					c.indicator.static_name.toLowerCase() === this.dataType.toLowerCase()
			).indicator;
			// return
			if (sourceConfig) {
				if (sourceConfig.disableChart) {
					this.$emit("sendScoreBackground", this.scoreKey, false);
					return;
				}
				// let cData = sourceConfig.chartData.find(c => c.indicator.name === this.dataType)
				let cData = sourceConfig;

				if (cData) {
					let sSelectedDE = "",
						aSelectedDE = [];
					cData.subIndicator.forEach((s) => {
						s.de.forEach((sd) => {
							aSelectedDE.push(sd);
						});
					});
					sSelectedDE = aSelectedDE.join(";");

					// let level = [this.subLevelID];
					let level = [this.scorecardDefaultLocationID.split("/")[0]];
					let period = getDateRange({
						sendPeriod: this.periodScorecard,
						periodType: this.periodType,
					});
					period = period.reverse().join(";");

					if (sSelectedDE) {
						service
							.getIndicatorData(
								sSelectedDE,
								level,
								this.scorecardDefaultLocationID.split("/")[1],
								period
							)
							.then((response) => {
								if (response.data.rows.length) {
									let pe = response.data.metaData.dimensions.pe;

									let valueIndex = 0,
										ouIndex = 0,
										peIndex = 0;
									response.data.headers.forEach((h, i) => {
										if (h.name === "value") {
											valueIndex = i;
										}
										if (h.name === "ou") {
											ouIndex = i;
										}

										if (h.name === "pe") {
											peIndex = i;
										}
									});

									let rData = {};
									response.data.rows.forEach((r) => {
										if (Object.keys(rData).includes(r[ouIndex])) {
											if (Object.keys(rData[r[ouIndex]]).includes(r[peIndex])) {
												rData[r[ouIndex]][r[peIndex]] =
													Number(rData[r[ouIndex]][r[peIndex]]) +
													Number(r[valueIndex]);
											} else {
												rData[r[ouIndex]][r[peIndex]] = r[valueIndex];
											}
										} else {
											rData[r[ouIndex]] = {
												[r[peIndex]]: r[valueIndex],
											};
										}
									});

									let obj = {},
										series = [];

									Object.keys(rData).forEach((d, j) => {
										obj = {
											name: this.scorecardDefaultLocationID,
											data: [],
										};
										pe.forEach((p, i) => {
											if (Object.keys(rData[d]).includes(p)) {
												obj.data.push({
													name: p,
													pe: p,
													y: rData[d][p] * 1,
												});
											} else {
												obj.data.push({
													name: p,
													pe: p,
													y: null,
												});
											}
										});
										series.push(obj);
									});

									if (series.length) {
										let formatedPeriod = formatSingleDate({
											rawDate: this.periodScorecard,
											periodType: this.periodType,
										});
										let s =
											series.length &&
											series[0].data.find((obj) => obj.pe == formatedPeriod);

										if (s && s.y > plotLines[0].value * 1) {
											this.$emit("sendScoreBackground", this.scoreKey, true);
										} else {
											this.$emit("sendScoreBackground", this.scoreKey, false);
										}
									} else {
										this.$emit("sendScoreBackground", this.scoreKey, false);
									}
								} else {
									this.$emit("sendScoreBackground", this.scoreKey, false);
								}
							})
							.catch(() => {
								this.$emit("sendScoreBackground", this.scoreKey, false);
							});
					} else {
						this.$emit("sendScoreBackground", this.scoreKey, false);
					}
				} else {
					this.$emit("sendScoreBackground", this.scoreKey, false);
				}
			} else {
				this.$emit("sendScoreBackground", this.scoreKey, false);
			}
		},
	},
	created() {
		if (!this.reportChartData) {
			this.$store.state.loading = true;
		}
		this.nationalReportingTrendChartName = this.$i18n.t("chartHeading");
		this.compareRegionalReportingTrendChartName = this.$i18n.t("chartHeading");
		this.regionalReportingTrendChartName = this.$i18n.t("chartHeading");
		this.regionalReportingRateChartName = this.$i18n.t("chartHeading");
		if (
			!this.reportChartData ||
			(this.reportChartData &&
				this.reportChartData.selectedType === this.filters)
		) {
			this.getConfig();
		}
		this.plotOptions = [
			{
				value: "column",
				text: this.$i18n.t("column"),
			},
			{
				value: "line",
				text: this.$i18n.t("line"),
			},
		];
	},
};
</script>
<style scoped lang="scss">
.outlier_scrollbar {
	max-height: 150px;
	overflow-y: auto;
}

.outlier_wrapper_scrollbar {
	max-height: 350px;
	overflow-y: auto;
	&.first_outlier {
		max-height: 410px;
	}
}

.b-table-sticky-header {
	max-height: 400px;
}

.chartType {
	padding: 5px;

	&.active {
		background-color: #000;
		color: #fff;
	}
}

.chart_types {
	&:focus {
		outline: none;
	}
}
</style>
