<template>
	<div
		class="rightSidebarWrapper_inside rightSidebarWrapper fpsignOff"
		id="slide"
		style="position: fixed"
	>
		<!-- right sidebar -->
		<div class="card">
			<!-- main header -->
			<div class="card-header">
				<h5 class="mb-0 text-white">
					<img
						alt="img"
						:src="require('@/assets/img/sign_off_icon.png')"
						style="width: 6%"
					/>
					{{ tabName }}
				</h5>
				<button type="button" class="close" @click.prevent.stop="signOff">
					&times;
				</button>
			</div>
			<!-- main header ends -->
			<!-- question fill -->
			<div class="" v-if="isForm">
				<div class="card-body question_fill">
					<section class="header">
						<div class="row mb-2">
							<div class="col-6">
								<h6 class="userName truncateTwoLines mb-0">
									<i class="fa fa-user pr-2" aria-hidden="true"></i
									>{{ userDetails.firstName }} {{ userDetails.surname }}
								</h6>
							</div>
							<div class="col-6">
								<p class="location_date mb-0">
									{{ location }}, {{ formattedPeriod }}
								</p>
							</div>
						</div>
						<div class="row pb-2">
							<div class="col-lg-8 col-sm-6">
								<div class="selectionName">
									<p class="mb-0 truncateTwoLines">
										{{ tabNameMapping[activeTab] }} -
										{{ tabNameMapping[activateSubTabs] }}
									</p>
								</div>
							</div>
							<div class="col-lg-4 col-sm-6">
								<div class="comments_btn" @click.prevent.stop="viewAllForms">
									<a class="cursor-pointer"
										>{{ $t("commentsIcon") }}-<span class="commentCount">{{
											responseForms.length
										}}</span></a
									>
								</div>
							</div>
						</div>
					</section>
					<section class="question_section pt-2">
						<div class="question_sect_wrap">
							<form v-if="signOffForm.length" ref="signOffForm">
								<div class="actionBtn d-flex">
									<button class="btn" @click.prevent.stop="refreshForm()">
										<i class="fa fa-refresh" aria-hidden="true"></i>
										{{ $t("refresh") }}
									</button>
								</div>
								<div
									class="sect_quest"
									v-for="(question, i) in signOffForm"
									:key="i"
								>
									<label class="question_div"
										><span>Q.{{ i + 1 }}.</span>
										<span>{{ question.questionText }}</span></label
									>
									<div class="option-selectionDiv row px-3">
										<div
											class="form-check-inline col"
											v-for="(option, oi) in question.options"
											:key="i + oi"
										>
											<label class="pt-2 mr-3" v-if="oi === 0"
												>{{ $t("ans") }}:</label
											>
											<div class="custom-control custom-radio">
												<input
													type="radio"
													:id="'customRadio' + i + oi"
													:name="'customRadio' + i + oi"
													class="custom-control-input"
													v-model="question.answer"
													:value="option.value"
													:checked="question.answer === option.value"
												/>
												<label
													class="custom-control-label"
													:for="'customRadio' + i + oi"
													>{{ option.text }}</label
												>
											</div>
										</div>
										<div
											class="editIcon float-right"
											@click.prevent.stop="toggleComment('comment' + i)"
										>
											<i class="fa fa-pencil-square-o" aria-hidden="true"></i>
										</div>
									</div>
									<textarea
										class="form-control"
										v-if="commentIndex.includes('comment' + i)"
										v-model="question.comment"
									></textarea>
								</div>
							</form>
							<div class="text-center" v-else>
								{{ $t("error_text_1") }}<br />{{ $t("error_text_2") }}
							</div>
						</div>
					</section>
					<section class="footer"></section>
				</div>
				<div
					class="card-footer bottomSect question_fill_submit"
					v-if="signOffForm.length"
				>
					<div class="level_selection">
						<label style="font-size: 0.875rem; font-weight: 500">{{
							$t("text_info")
						}}</label>
						<div class="mainDivSelectionBox">
							<!-- <div id="range"></div> -->
							<div class="rangeSlider">
								<b-form-input
									id="range-1"
									v-model="dataSatisfaction"
									type="range"
									min="0"
									max="5"
									step="0.1"
								></b-form-input>
								<div class="rangeClass">
									<div class="low nDiv">
										{{ $t("low") }}
									</div>
									<div class="mediumLow nDiv">
										{{ $t("medium_low") }}
									</div>
									<div class="medium nDiv">
										{{ $t("medium") }}
									</div>
									<div class="mediumHigh nDiv">
										{{ $t("medium_high") }}
									</div>
									<div class="high nDiv">
										{{ $t("high") }}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="form-check">
						<label class="form-check-label" for="check1" style="line-height: 1">
							<input
								type="checkbox"
								class="form-check-input"
								id="check1"
								name="option1"
								value="something"
								v-model="declaration"
								style="margin-top: 0.2rem"
							/>
							<span style="font-size: 0.75rem; line-height: 1">{{
								$t("text_info_1")
							}}</span>
						</label>
					</div>
					<button
						class="btn btn-sm btn-secondary float-right mt-2"
						:disabled="!declaration"
						@click.prevent.stop="submitSignOff"
					>
						{{ isUpdate ? $t("update") : $t("submitbtn") }}
					</button>
				</div>
			</div>
			<!-- question fill ends -->

			<!-- details view on submit -->
			<div class="card-body question_view" v-if="submittedForm">
				<section class="header">
					<div class="row pb-2">
						<div class="col-lg-8 col-sm-6">
							<div class="selectionName d-flex">
								<a @click.prevent.stop="backToForm" class="cursor-pointer"
									><i class="fa fa-long-arrow-left" aria-hidden="true"></i
								></a>
								<p class="pl-3 mb-0 truncateTwoLines">
									{{ tabNameMapping[activeTab] }} -
									{{ tabNameMapping[activateSubTabs] }}
								</p>
							</div>
						</div>
						<div class="col-lg-4 col-sm-6">
							<div class="comments_btn">
								<a
									>{{ $t("commentsIcon") }}-<span class="commentCount">{{
										responseForms.length
									}}</span></a
								>
							</div>
						</div>
					</div>
				</section>
				<section class="question_section pt-2">
					<div class="level_selection lien_borderbottom">
						<label style="font-size: 0.875rem; font-weight: 500">{{
							$t("dsl")
						}}</label>
						<div class="mainDivSelectionBox">
							<div class="rangeSlider">
								<b-form-input
									id="range-1"
									type="range"
									min="0"
									max="5"
									step="0.1"
									style="visibility: hidden"
								></b-form-input>
								<div class="rangeClass">
									<div class="low nDiv">
										{{ $t("low") }}
									</div>
									<div class="mediumLow nDiv">
										{{ $t("medium_low") }}
									</div>
									<div class="medium nDiv">
										{{ $t("medium") }}
									</div>
									<div class="mediumHigh nDiv">
										{{ $t("medium_high") }}
									</div>
									<div class="high nDiv">
										{{ $t("high") }}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="question_sect_wrap">
						<div class="details_cmd_card">
							<template v-for="(form, index) in responseForms">
								<div
									class="card bg-white mt-4 mb-4 rounded-sm"
									v-if="form.formID === currentFormID"
									:key="index"
								>
									<div class="card-body pb-2">
										<div class="row">
											<div class="col">
												<div class="personNameDiv">
													<h6 class="userName truncateTwoLines mb-0">
														<i
															class="fa fa-user pr-2"
															:class="form.iconColorClass"
															aria-hidden="true"
														></i>
														{{ form.userDetails.firstName }}
														{{ form.userDetails.surname }}
													</h6>
												</div>
											</div>
											<div class="col">
												<div>
													<p class="location_date mb-0">
														{{ form.location }}, {{ form.period }}
													</p>
												</div>
											</div>
										</div>
										<div class="row">
											<div class="col">
												<div class="actionBtn d-flex">
													<button
														class="btn ml-3"
														@click.prevent.stop="editForm(form)"
													>
														<i
															class="fa fa-pencil-square-o"
															aria-hidden="true"
														></i>
														{{ $t("edit") }}
													</button>
													<button
														class="btn ml-3"
														@click.prevent.stop="deleteForm(form.formID)"
													>
														<i class="fa fa-trash-o" aria-hidden="true"></i>
														{{ $t("deletebtn") }}
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</template>
							<template v-for="(form, index) in responseForms">
								<div
									class="card mt-4 mb-4 rounded-sm"
									:style="{ 'background-color': '#ffffff' }"
									:key="index"
									v-if="
										form.formID !== currentFormID &&
										form.userDetails.id === userDetails.id
									"
								>
									<div class="card-body pb-2">
										<div class="row">
											<div class="col">
												<div class="personNameDiv">
													<h6 class="userName truncateTwoLines mb-0">
														<i
															class="fa fa-user pr-2"
															:class="form.iconColorClass"
															aria-hidden="true"
														></i>
														{{ form.userDetails.firstName }}
														{{ form.userDetails.surname }}
													</h6>
												</div>
											</div>
											<div class="col">
												<div>
													<p class="location_date mb-0">
														{{ form.location }}, {{ form.period }}
													</p>
												</div>
											</div>
										</div>
										<div class="row">
											<div class="col">
												<!-- {{form.formID}} -->
												<div class="actionBtn d-flex">
													<button
														class="btn ml-3"
														@click.prevent.stop="editForm(form)"
														v-if="userDetails.id === form.userDetails.id"
													>
														<i
															class="fa fa-pencil-square-o"
															aria-hidden="true"
														></i>
														{{ $t("edit") }}
													</button>
													<button
														class="btn ml-3"
														@click.prevent.stop="viewForm(form)"
														v-if="userDetails.id !== form.userDetails.id"
													>
														<img
															alt="img"
															:src="require('@/assets/img/view.png')"
															class="viewIcon"
														/>
														{{ $t("view") }}
													</button>
													<button
														class="btn ml-3"
														@click.prevent.stop="deleteForm(form.formID)"
														v-if="userDetails.id === form.userDetails.id"
													>
														<i class="fa fa-trash-o" aria-hidden="true"></i>
														{{ $t("deletebtn") }}
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</template>
							<template v-for="(form, index) in responseForms">
								<div
									class="card mt-4 mb-4 rounded-sm"
									:style="{ 'background-color': '#e9e9e9' }"
									:key="index"
									v-if="
										form.formID !== currentFormID &&
										form.userDetails.id !== userDetails.id
									"
								>
									<div class="card-body pb-2">
										<div class="row">
											<div class="col">
												<div class="personNameDiv">
													<h6 class="userName truncateTwoLines mb-0">
														<i
															class="fa fa-user pr-2"
															:class="form.iconColorClass"
															aria-hidden="true"
														></i>
														{{ form.userDetails.firstName }}
														{{ form.userDetails.surname }}
													</h6>
												</div>
											</div>
											<div class="col">
												<div>
													<p class="location_date mb-0">
														{{ form.location }}, {{ form.period }}
													</p>
												</div>
											</div>
										</div>
										<div class="row">
											<div class="col">
												<!-- {{form.formID}} -->
												<div class="actionBtn d-flex">
													<button
														class="btn ml-3"
														@click.prevent.stop="editForm(form)"
														v-if="userDetails.id === form.userDetails.id"
													>
														<i
															class="fa fa-pencil-square-o"
															aria-hidden="true"
														></i>
														{{ $t("edit") }}
													</button>
													<button
														class="btn ml-3"
														@click.prevent.stop="viewForm(form)"
														v-if="userDetails.id !== form.userDetails.id"
													>
														<img
															alt="img"
															:src="require('@/assets/img/view.png')"
															class="viewIcon"
														/>
														{{ $t("view") }}
													</button>
													<button
														class="btn ml-3"
														@click.prevent.stop="deleteForm(form.formID)"
														v-if="userDetails.id === form.userDetails.id"
													>
														<i class="fa fa-trash-o" aria-hidden="true"></i>
														{{ $t("deletebtn") }}
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</template>
							<div class="text-center" v-if="responseForms.length === 0">
								{{ $t("no_data_to_display") }}
							</div>
						</div>
					</div>
				</section>
				<section class="footer"></section>
			</div>
			<!-- details view on submit ends -->
			<!-- question view section -->

			<div class="card-body question_view" v-if="formView">
				<section class="header">
					<div class="row pb-2">
						<div class="col-8">
							<div class="selectionName">
								<div class="d-flex mb-1">
									<a
										><i
											class="fa fa-long-arrow-left pr-2 cursor-pointer"
											aria-hidden="true"
											@click="backToComment"
										></i
									></a>
									<h6 class="userName truncateTwoLines mb-0">
										<i
											class="fa fa-user pr-2"
											:class="viewFormResponse.iconColorClass"
											aria-hidden="true"
										></i>
										{{ viewFormResponse.userDetails.firstName }}
										{{ viewFormResponse.userDetails.surname }}
									</h6>
								</div>
								<p class="pl-3 mb-0 pl-4">
									{{ tabNameMapping[viewFormResponse.signOffTab] }} -
									{{ tabNameMapping[viewFormResponse.signOffSubTab] }}
								</p>
							</div>
						</div>
						<div class="col-4">
							<div>
								<p class="location_date mb-0">
									{{ viewFormResponse.location }}, {{ viewFormResponse.period }}
								</p>
							</div>
						</div>
					</div>
				</section>
				<section class="question_section pt-2">
					<div class="level_selection lien_borderbottom">
						<label
							class="levelname"
							style="font-size: 0.875rem; font-weight: 500"
							>{{ $t("dsl") }}</label
						>
						<div class="mainDivSelectionBox fpmainselection">
							<div class="rangeSlider">
								<b-form-input
									id="range-1"
									v-model="viewFormResponse.dataSatisfaction"
									type="range"
									min="0"
									max="5"
									step="0.1"
									disabled
								></b-form-input>
								<div class="rangeClass">
									<div class="low nDiv">
										{{ $t("low") }}
									</div>
									<div class="mediumLow nDiv">
										{{ $t("medium_low") }}
									</div>
									<div class="medium nDiv">
										{{ $t("medium") }}
									</div>
									<div class="mediumHigh nDiv">
										{{ $t("medium_high") }}
									</div>
									<div class="high nDiv">
										{{ $t("high") }}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="question_sect_wrap">
						<form v-if="viewFormResponse" ref="viewFormResponse">
							<div
								class="sect_quest"
								v-for="(question, i) in viewFormResponse.signOffForm"
								:key="i"
							>
								<label class="question_div"
									><span>Q.{{ i + 1 }}.</span>
									<span>{{ question.questionText }}</span></label
								>
								<div class="option-selectionDiv row px-3">
									<div
										class="form-check-inline col"
										v-for="(option, oi) in question.options"
										:key="i + oi"
									>
										<label class="pt-2 mr-3" v-if="oi === 0"
											>{{ $t("ans") }}:</label
										>
										<div class="custom-control custom-radio">
											<input
												type="radio"
												:id="'customRadio' + i + oi"
												:name="'customRadio' + i + oi"
												class="custom-control-input"
												v-model="question.answer"
												:value="option.value"
												:checked="question.answer === option.value"
												disabled
											/>
											<label
												class="custom-control-label"
												:for="'customRadio' + i + oi"
												>{{ option.text }}</label
											>
										</div>
									</div>
									<div class="editIcon float-right">
										<i class="fa fa-pencil-square-o" aria-hidden="true"></i>
									</div>
								</div>
								<textarea
									class="form-control"
									disabled
									v-if="commentIndex.includes('comment' + i)"
									v-model="question.comment"
								></textarea>
							</div>
						</form>
						<div class="text-center" v-else>
							{{ $t("no_data_to_display") }}
						</div>
					</div>
				</section>
				<section class="footer"></section>
			</div>
			<!-- question view section ends-->
			<!-- emu annual section-->
			<div class="card-body question_view" v-if="emuSection">
				<section class="header">
					<div class="row pb-2">
						<div class="col-lg-8 col-sm-6">
							<div class="selectionName d-flex">
								<!-- <a><i class="fa fa-long-arrow-left" aria-hidden="true"></i></a> -->
								<p class="mb-0 truncateTwoLines">
									{{ tabNameMapping[activeTab] }}
								</p>
							</div>
						</div>
						<div class="col-lg-4 col-sm-6">
							<div class="comments_btn">
								<a
									>{{ $t("commentsIcon") }}-<span class="commentCount">{{
										responseFormsEMU.length
									}}</span></a
								>
							</div>
						</div>
					</div>
				</section>
				<section class="question_section pt-2 treeSelect-minFont">
					<div class="row pb-3">
						<div class="col-12">
							<treeselect
								:multiple="true"
								:options="userListEMU"
								value-consists-of="LEAF_PRIORITY"
								:default-expand-level="1"
								:limit="1"
								:zIndex="999999"
								v-model="userSelected"
								:placeholder="$t('pickUser')"
							/>
						</div>
						<div class="col-12">
							<treeselect
								:multiple="true"
								:options="tabListEMU"
								value-consists-of="LEAF_PRIORITY"
								:default-expand-level="1"
								:limit="1"
								:zIndex="999999"
								v-model="tabSelected"
								:placeholder="$t('pickCategory')"
							/>
						</div>
					</div>
					<div class="level_selection lien_borderbottom">
						<label style="font-size: 0.875rem; font-weight: 500,color:#fff"
							>{{ $t("dsl") }}
						</label>
						<div class="mainDivSelectionBox">
							<div class="rangeSlider">
								<b-form-input
									id="range-1"
									type="range"
									min="0"
									max="5"
									step="0.1"
									style="visibility: hidden"
								></b-form-input>
								<div class="rangeClass">
									<div class="low nDiv">
										{{ $t("low") }}
									</div>
									<div class="mediumLow nDiv">
										{{ $t("medium_low") }}
									</div>
									<div class="medium nDiv">
										{{ $t("medium") }}
									</div>
									<div class="mediumHigh nDiv">
										{{ $t("medium_high") }}
									</div>
									<div class="high nDiv">
										{{ $t("high") }}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="question_sect_wrap emuSection">
						<div class="details_cmd_card">
							<template v-for="(form, index) in responseFormsEMU">
								<div
									class="card mt-4 mb-4 rounded-sm"
									:key="index"
									:style="{ 'background-color': '#12122a', color: '#fff' }"
									v-if="form.userDetails.id === userDetails.id"
								>
									<div class="card-body pb-2">
										<div class="row">
											<div class="col">
												<h5 class="tabs_name userName truncateTwoLines">
													{{ tabNameMapping[form.signOffTab] }} -
													{{ tabNameMapping[form.signOffSubTab] }}
												</h5>
											</div>
										</div>
										<div class="row">
											<div class="col">
												<div class="personNameDiv">
													<h6 class="userName truncateTwoLines mb-0">
														<i
															class="fa fa-user pr-2"
															:class="form.iconColorClass"
															aria-hidden="true"
														></i>
														{{ form.userDetails.firstName }}
														{{ form.userDetails.surname }}
													</h6>
												</div>
											</div>
											<div class="col">
												<div>
													<p class="location_date mb-0">
														{{ form.location }}, {{ form.period }}
													</p>
												</div>
											</div>
										</div>
										<div class="row">
											<div class="col">
												<div class="actionBtn d-flex">
													<button
														class="btn ml-3"
														@click.prevent.stop="viewForm(form, true)"
													>
														<img
															alt="img"
															:src="require('@/assets/img/view.png')"
															class="viewIcon"
														/>
														{{ $t("view") }}
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</template>
							<template v-for="(form, index) in responseFormsEMU">
								<div
									class="card mt-4 mb-4 rounded-sm"
									:key="index"
									:style="{ 'background-color': '#12122a', color: '#d9d6d6' }"
									v-if="form.userDetails.id !== userDetails.id"
								>
									<div class="card-body pb-2">
										<div class="row">
											<div class="col">
												<h5 class="tabs_name userName">
													{{ tabNameMapping[form.signOffTab] }} -
													{{ tabNameMapping[form.signOffSubTab] }}
												</h5>
											</div>
										</div>
										<div class="row">
											<div class="col">
												<div class="personNameDiv">
													<h6 class="userName truncateTwoLines mb-0">
														<i
															class="fa fa-user pr-2"
															:class="form.iconColorClass"
															aria-hidden="true"
														></i>
														{{ form.userDetails.firstName }}
														{{ form.userDetails.surname }}
													</h6>
												</div>
											</div>
											<div class="col">
												<div>
													<p class="location_date mb-0">
														{{ form.location }}, {{ form.period }}
													</p>
												</div>
											</div>
										</div>
										<div class="row">
											<div class="col">
												<div class="actionBtn d-flex">
													<button
														class="btn ml-3"
														@click.prevent.stop="viewForm(form, true)"
													>
														<img
															alt="img"
															:src="require('@/assets/img/view.png')"
															class="viewIcon"
														/>
														{{ $t("view") }}
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</template>
							<div class="text-center" v-if="responseFormsEMU.length === 0">
								{{ $t("no_data_to_display") }}
							</div>
						</div>
					</div>
				</section>
				<section class="footer"></section>
			</div>
			<!-- emu annual section ends-->
		</div>
	</div>
</template>
<script>
import service from "@/service";
import { translateDate, randomString } from "@/components/Common/commonFunctions";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
	props: [
		"activeTab",
		"activateSubTabs",
		"tabNameMapping",
		"locationName",
		"period",
		"userDetails",
		"periodType",
		"tabName",
	],
	components: {
		Treeselect,
	},
	data() {
		// console.log(this.locationName)
		// console.log(this.period)
		// console.log(this.userDetails)
		return {
			formattedPeriod: this.$moment(this.period, "YYYYMM").format("MMM YYYY"),
			location: this.locationName,
			commentIndex: [],
			declaration: false,
			dataSatisfaction: 0,
			signOffResponse: null,
			signOffForm: [],
			responseForms: [],
			responseFormsEMU: [],
			responseFormsEMUOriginal: [],
			currentFormID: null,
			isForm: true,
			submittedForm: false,
			formView: false,
			viewFormResponse: null,
			emuSection: false,
			isUpdate: false,
			createdAt: null,
			fromEMU: false,
			tabSelected: [],
			userSelected: [],
			userListEMU: [],
			tabListEMU: [],
			updateForm: null,
		};
	},
	watch: {
		period(newValue) {
			// this.formattedPeriod = this.$moment(newValue, 'YYYYMM').format('MMM YYYY')
			this.setPeriod();
			this.commentIndex = [];
		},
		locationName(newValue) {
			this.location = newValue;
			this.commentIndex = [];
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
		activateSubTabs(newValue) {
			// console.log("Tab change", newValue)
			// console.log(this.signOffResponse)
			if (
				this.activeTab === "reportingRate" ||
				this.activeTab === "internal_validations" ||
				this.activeTab === "external_validation"
			) {
				this.responseFormsEMU = [];
				this.responseFormsEMUOriginal = [];
				this.commentIndex = [];
				let forms = this.signOffResponse[this.activeTab][newValue];
				this.signOffForm =
					forms && forms.questions
						? JSON.parse(JSON.stringify(forms.questions))
						: [];
				this.responseForms =
					forms && forms.signOff && forms.signOff.length
						? JSON.parse(JSON.stringify(forms.signOff))
						: [];
				this.submittedForm = false;
				this.formView = false;
				this.emuSection = false;
				this.isForm = true;
			} else {
				this.signOffForm = [];
				this.commentIndex = [];
				this.responseForms = [];
				let allForms = [];
				Object.keys(this.signOffResponse).forEach((f) => {
					Object.keys(this.signOffResponse[f]).forEach((fInner) => {
						if (this.signOffResponse[f][fInner].signOff) {
							this.signOffResponse[f][fInner].signOff.forEach((s) => {
								allForms.push(s);
								let newUser = this.userListEMU.find(
									(u) => u.value === s.userDetails.id
								);
								if (!newUser) {
									this.userListEMU.push({
										label: `${s.userDetails.firstName} ${s.userDetails.surname}`,
										id: s.userDetails.id,
									});
								}
							});
						}
					});
				});
				// console.log(allForms)
				this.responseFormsEMU = allForms;
				this.responseFormsEMUOriginal = allForms;
				this.isForm = false;
				this.formView = false;
				this.submittedForm = false;
				this.emuSection = true;
			}
		},
	},
	methods: {
		backToComment() {
			this.viewFormResponse = null;
			this.dataSatisfaction = 0;
			if (
				this.activeTab === "reportingRate" ||
				this.activeTab === "internal_validations" ||
				this.activeTab === "external_validation"
			) {
				this.fromEMU = false;
			}
			if (this.fromEMU) {
				// console.log(this.userSelected)
				this.emuSection = true;
				this.submittedForm = false;
			} else {
				this.emuSection = false;
				this.submittedForm = true;
			}
			this.isForm = false;
			this.formView = false;
		},
		toggleComment(formIndex) {
			let foundIndex = this.commentIndex.findIndex((c) => c === formIndex);
			if (foundIndex >= 0) {
				this.commentIndex.splice(foundIndex, 1);
			} else {
				this.commentIndex.push(formIndex);
			}
		},
		refreshForm() {
			this.currentFormID = null;
			this.commentIndex = [];
			this.isUpdate = false;
			this.createdAt = null;
			// this.formattedPeriod = this.$moment(this.period, 'YYYYMM').format('MMM YYYY')
			this.setPeriod();
			this.location = this.locationName;
			this.signOffForm = JSON.parse(
				JSON.stringify(
					this.signOffResponse[this.activeTab][this.activateSubTabs].questions
				)
			);
			this.dataSatisfaction = 0;
		},
		viewAllForms() {
			this.currentFormID = null;
			this.isForm = false;
			this.submittedForm = true;
			this.isUpdate = false;
			this.signOffForm = [];
			this.commentIndex = [];
			this.updateForm = null;
			this.dataSatisfaction = 0;
		},
		editForm(form) {
			this.commentIndex = [];
			this.updateForm = form;
			this.signOffForm = form.signOffForm;
			this.formattedPeriod = form.period;
			this.location = form.location;
			// console.log(form)
			// console.log(form.period)
			// console.log(this.formattedPeriod)
			// console.log(form.signOffForm)
			this.signOffForm.forEach((form, i) => {
				// console.log(form)
				if (form.comment !== "") {
					this.commentIndex.push("comment" + i);
				}
			});
			this.currentFormID = form.formID;
			this.dataSatisfaction = form.dataSatisfaction;
			this.isUpdate = true;
			this.submittedForm = false;
			this.emuSection = false;
			this.formView = false;
			this.isForm = true;
		},
		deleteForm(formID) {
			let key = this.generateKey("signOffModule");

			this.$swal({
				title: this.$i18n.t("areyousure"),
				text: this.$i18n.t("youablerevertthis"),
				showCancelButton: true,
				confirmButtonText: this.$i18n.t("yes_delete_it"),
			}).then((result) => {
				if (result.value) {
					this.$store.state.loading = true;
					this.responseForms = this.responseForms.filter(
						(d) => d.formID !== formID
					);
					let updatedData = {
						...this.signOffResponse,
						[this.activeTab]: {
							...this.signOffResponse[this.activeTab],
							[this.activateSubTabs]: {
								...this.signOffResponse[this.activeTab][this.activateSubTabs],
								signOff: this.responseForms,
							},
						},
					};
					let response = service.updateConfig(updatedData, key);
					response.then((response) => {
						if (response.data.status === "OK") {
							this.getForms(false, true); // Send extra (first) parameter, getForms(submitted, deleted)
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
		viewForm(signOffForm, fromEMU = false) {
			this.viewFormResponse = signOffForm;
			this.dataSatisfaction = signOffForm.dataSatisfaction;
			// console.log(signOffForm)
			signOffForm.signOffForm.forEach((formView, i) => {
				// console.log(formView)
				if (formView.comment !== "") {
					this.commentIndex.push("comment" + i);
				}
			});
			if (fromEMU) {
				// console.log(this.userSelected)
				this.fromEMU = true;
			}
			this.submittedForm = false;
			this.isForm = false;
			this.formView = true;
			this.emuSection = false;
		},
		backToForm() {
			this.submittedForm = false;
			this.isForm = true;
			this.signOffForm = JSON.parse(
				JSON.stringify(
					this.signOffResponse[this.activeTab][this.activateSubTabs].questions
				)
			);
		},
		signOff() {
			this.$emit("signOff");
		},
		submitSignOff() {
			this.$store.state.loading = true;

			let index = null;
			if (this.responseForms && this.responseForms.length && !this.isUpdate) {
				index = this.responseForms.find(
					(f) =>
						f.period === this.formattedPeriod &&
						f.location === this.locationName
				);
			}
			// console.log(index)
			if (index) {
				this.$store.state.loading = false;
				this.currentFormID = null;
				this.isUpdate = false;
				this.createdAt = null;
				this.signOffForm = JSON.parse(
					JSON.stringify(
						this.signOffResponse[this.activeTab][this.activateSubTabs].questions
					)
				);
				this.dataSatisfaction = 0;
				this.declaration = false;
				this.$swal({
					title: this.$i18n.t("duplicate"),
					text: this.$i18n.t("form_present"),
				});
			} else {
				if (!this.isUpdate) {
					this.currentFormID = randomString(16);
				}
				let iconColorClass = "text-red-new";
				if (this.dataSatisfaction >= 1.1 && this.dataSatisfaction <= 2) {
					iconColorClass = "text-orange-new";
				} else if (this.dataSatisfaction >= 2.1 && this.dataSatisfaction <= 3) {
					iconColorClass = "text-yellow-new";
				} else if (this.dataSatisfaction >= 3.1 && this.dataSatisfaction <= 4) {
					iconColorClass = "text-green-new";
				} else if (this.dataSatisfaction >= 4.1 && this.dataSatisfaction <= 5) {
					iconColorClass = "text-blue-new";
				} else {
					iconColorClass = "text-red-new";
				}

				let signOff = {
					formID: this.isUpdate
						? this.updateForm.currentFormID
						: this.currentFormID,
					userDetails: {
						firstName: this.isUpdate
							? this.updateForm.userDetails.firstName
							: this.userDetails.firstName,
						surname: this.isUpdate
							? this.updateForm.userDetails.surname
							: this.userDetails.surname,
						id: this.isUpdate
							? this.updateForm.userDetails.id
							: this.userDetails.id,
					},
					location: this.isUpdate
						? this.updateForm.location
						: this.locationName,
					period: this.isUpdate ? this.updateForm.period : this.formattedPeriod,
					signOffTab: this.isUpdate
						? this.updateForm.signOffTab
						: this.activeTab,
					signOffSubTab: this.isUpdate
						? this.updateForm.signOffSubTab
						: this.activateSubTabs,
					signOffForm: this.signOffForm,
					dataSatisfaction: this.dataSatisfaction,
					iconColorClass: iconColorClass,
					declaration: this.declaration,
					createdAt: this.isUpdate
						? this.updateForm.createdAt
						: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
					updatedAt: this.$moment().format("MMMM Do YYYY, h:mm:ss a"),
				};
				// console.log(signOff)

				let key = this.generateKey("signOffModule");

				let saveConfig = service.getSavedConfig(key);
				saveConfig
					.then((res) => {
						let configData = res.data;
						// console.log("configData",configData);

						if (configData[this.activeTab][this.activateSubTabs].signOff) {
							if (this.isUpdate) {
								let foundIndex = configData[this.activeTab][
									this.activateSubTabs
								].signOff.findIndex((f) => f.formID == this.currentFormID);
								configData[this.activeTab][this.activateSubTabs].signOff[
									foundIndex
								] = signOff;
							} else {
								configData[this.activeTab][this.activateSubTabs].signOff.push(
									signOff
								);
							}
						} else {
							configData[this.activeTab][this.activateSubTabs] = {
								...configData[this.activeTab][this.activateSubTabs],
								signOff: [signOff],
							};
						}

						let response = service.updateConfig(configData, key);
						response
							.then((response) => {
								if (response.data.status === "OK") {
									// console.log("response update ", response.data)
									// localStorage.setItem("metaConfig", JSON.stringify(metaConfigData));
									this.getForms(true);
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
					})
					.catch((res) => {
						this.$swal({
							title: this.$i18n.t("error"),
						});

						this.$store.state.loading = false;
						return;
					});
			}
		},
		setPeriod() {
			translateDate({ rawDate: this.period, periodType: this.periodType });
		},
		getForms(submitted = false, deleted = false) {
			// console.log(submitted)
			// console.log(deleted)
			let key = this.generateKey("signOffModule");

			service
				.getSavedConfig(key)
				.then((response) => {
					// console.log(response)
					this.signOffResponse = response.data;
					// console.log(this.activeTab)
					// console.log(this.activateSubTabs)
					if (
						this.activeTab === "reportingRate" ||
						this.activeTab === "internal_validations" ||
						this.activeTab === "external_validation"
					) {
						let resData = response.data[this.activeTab][this.activateSubTabs];
						// console.log(response)
						this.signOffForm = resData.questions
							? JSON.parse(JSON.stringify(resData.questions))
							: [];
						this.responseForms =
							resData.signOff && resData.signOff.length
								? JSON.parse(JSON.stringify(resData.signOff))
								: [];
					} else {
						// console.log("else", response)
						this.signOffForm = [];
						this.responseForms = [];
						let allForms = [];
						Object.keys(response.data).forEach((f) => {
							// console.log(f)
							Object.keys(response.data[f]).forEach((fInner) => {
								// console.log(fInner)
								if (response.data[f][fInner].signOff) {
									// console.log(response.data[f][fInner], 'signOff found')
									response.data[f][fInner].signOff.forEach((s) => {
										// console.log(s)
										allForms.push(s);
										let newUser = this.userListEMU.find(
											(u) => u.value === s.userDetails.id
										);
										if (!newUser) {
											this.userListEMU.push({
												label: `${s.userDetails.firstName} ${s.userDetails.surname}`,
												id: s.userDetails.id,
											});
										}
									});
								}
							});
						});
						// console.log(allForms)
						this.responseFormsEMU = allForms;
						this.responseFormsEMUOriginal = allForms;
						this.isForm = false;
						this.emuSection = true;
					}
					if (submitted) {
						this.$swal({
							title: this.$i18n.t("data_saved_successfully"),
						});
						this.declaration = false;
						this.currentFormID = null;
						this.commentIndex = [];
						// this.formattedPeriod = this.$moment(this.period, 'YYYYMM').format('MMM YYYY')
						this.setPeriod();
						this.location = this.locationName;
						this.dataSatisfaction = 0;
						this.isForm = false;
						this.submittedForm = true;
						this.createdAt = null;
						this.$store.state.loading = false;
					} else if (deleted) {
						this.$swal({
							title: this.$i18n.t("deleted"),
							text: this.$i18n.t("signOff_form_deleted"),
						});
						this.currentFormID = null;
						this.$store.state.loading = false;
					} else {
						this.$store.state.loading = false;
					}
				})
				.catch((res) => {
					this.signOffResponse = null;
					this.$store.state.loading = false;
					console.log("SignOff response failed...");
				});
		},
	},
	created() {
		this.$gtag.event("tab_view", {
			value: this.tabName,
		});
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
		this.getForms();
		this.setPeriod();
	},
};
</script>
<style scoped lang="scss">
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
	color: #fff;
	text-transform: capitalize;
}
.location_date {
	float: right;
	font-size: 0.8125rem;
	color: #fff;
}
.selectionName {
	font-size: 0.8125rem;
	color: #fff;
}
.comments_btn {
	font-size: 0.8125rem;
	float: right;
	color: #fff;
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
	color: #fff;
	border-bottom: 1px solid #ddd;
}
.sect_quest {
	padding-bottom: 2%;
	border-bottom: 1px solid #ddd;
	padding-top: 5%;
	color: #fff;
}
.question_sect_wrap {
	// max-height: 280px;
	overflow: hidden;
	overflow-y: scroll;
	padding-right: 2.5%;
	height: calc(100vh - 400px);
	padding-bottom: 10%;
}
.question_sect_wrap {
	scrollbar-color: 0 0 1px rgba(255, 255, 255, 0.5) rgba(0, 0, 0, 0.5);
	scrollbar-width: thin;
}
.bottomSect {
	border: 0;
	// background-color: rgba(167, 167, 167, 0.6784313725490196) !important;
	background-color: #cfcfcf !important;
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
	// padding: 2.5% 4%;
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
		// max-height: 100vh;
		padding-right: 0;
		padding-bottom: 45%;
		height: calc(100vh - 150px);
		overflow: hidden;
		overflow-y: scroll;
	}
	.personNameDiv {
		.userName {
			font-size: 0.875rem;
			font-weight: 500;
			// color: #353535;
		}
	}
}
.actionBtn {
	justify-content: flex-end;
	button {
		/* text-decoration: underline; */
		font-size: 0.8125rem;
		border-bottom: 2px solid #9a9899;
		border-radius: 0;
		padding: 6px 1px 0;
		margin-bottom: 3%;
		color: #9a9899;
	}
	button:hover {
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
	//background-color: #ddd !important; -->
	//   outline: 1px solid slategrey;
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
	height: 52px;
	cursor: pointer;
}
.faActive {
	color: #353535;
}
.details_cmd_card .card-body {
	padding: 10px;
	color: #fff;
}
.viewIcon {
	opacity: 0.5;
	width: 10px;
}
.actionBtn .btn:hover .viewIcon {
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
</style>
