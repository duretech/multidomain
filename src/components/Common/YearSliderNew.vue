<template>
	<div class="row no-gutters" style="width: 350px">
		<div class="col-lg-12 d-flex justify-content-end">
			<div class="btn-group btn-group-sm">
				<button
					:disabled="disablePrevious"
					@click="previous()"
					type="button"
					class="btn btn-secondary"
					v-b-tooltip.hover
					:title="$t('previous')"
				>
					<i class="fa fa-angle-double-left" aria-hidden="true"></i>
				</button>
				<button
					v-if="playButton"
					@click="play()"
					type="button"
					class="btn btn-secondary"
					v-b-tooltip.hover
					:title="$t('play')"
				>
					<i class="fa fa-play" aria-hidden="true"></i>
				</button>
				<button
					v-else
					@click="pause()"
					type="button"
					class="btn btn-secondary"
					v-b-tooltip.hover
					:title="$t('pause')"
				>
					<i class="fa fa-stop" aria-hidden="true"></i>
				</button>
				<button
					:disabled="disableNext"
					@click="next()"
					type="button"
					class="btn btn-secondary"
					v-b-tooltip.hover
					:title="$t('next')"
				>
					<i class="fa fa-angle-double-right" aria-hidden="true"></i>
				</button>
				<div class="form-group btn btn-secondary mb-0">
					<div class="select-wrapper">
						<select class="form-control" id="selectYear" v-model="currentYear">
							<option
								:value="year.value"
								v-for="year in ddOptions"
								:key="year.value"
							>
								{{ year.text }}
							</option>
						</select>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "YearSlider",
	props: ["yearArr", "pType", "updatedYearSliderValue"],
	data() {
		let curYear = this.updatedYearSliderValue
			? this.updatedYearSliderValue
			: this.yearArr[this.yearArr.length - 1];
		return {
			disablePrevious: false,
			disableNext: false,
			ddOptions: [],
			yearSliderIntance: {},
			isFirstIndex: true,
			rangeContainer: this.yearArr,
			currentTimePeriodIndex: 0,
			currentTimePeriod: 0,
			periodInterval: 0,
			previousCurrentIndex: 1,
			nextCurrentIndex: 1,
			currentYear: curYear,
			current: "",
			currentIndex: 0,
			minIndex: 0,
			maxIndex: 0,
			currentIndexSetter: 0,
			currentIndexGetter: 0,
			playButton: true,
			pauseButton: false,
		};
	},
	watch: {
		currentYear(newVal) {
			this.$emit("currentYearChange", newVal);
		},
		updatedYearSliderValue(newVal) {
			let curYear = newVal ? newVal : this.yearArr[this.yearArr.length - 1];
			this.currentYear = curYear;
		},
		pType(newVal) {
			if (newVal) this.generatePeriodDropdown();
		},
	},
	methods: {
		generatePeriodDropdown() {
			if (this.pType === "financialYear") {
				this.yearArr.forEach((a) => {
					var nextYear = parseInt(a.split("A")[0]) + 1;
					this.ddOptions.push({
						value: a,
						text: a.split("A")[0] + "-" + nextYear,
					});
				});
			} else if (this.pType === "financialYearJuly") {
				this.yearArr.forEach((a) => {
					var nextYear = parseInt(a.split("J")[0]) + 1;
					this.ddOptions.push({
						value: a,
						text: a.split("J")[0] + "-" + nextYear,
					});
				});
			} else if (this.pType === "yearly") {
				this.yearArr.forEach((a) => {
					var nextYear = parseInt(a) + 1;
					this.ddOptions.push({
						value: a,
						text: a,
					});
				});
			} else if (this.pType === "monthly") {
				//console.log(this.yearArr)
				this.yearArr.forEach((a) => {
					var year = a.substring(0, 4);
					var month = a.substring(4, 6);
					this.ddOptions.push({
						value: a,
						text: year + "-" + month,
					});
				});
			} else if (this.pType === "quarterly") {
				this.yearArr.forEach((a) => {
					var year = parseInt(a.split("Q")[0]);
					var quater = parseInt(a.split("Q")[1]);
					this.ddOptions.push({
						value: a,
						text: year + "- Q" + quater,
					});
				});
			}
		},
		getNextYear(year) {
			return parseInt(year) + 1;
		},
		getSelectedValue(event) {
			//this.currentYear = event.target.value;
			this.$emit("currentYearChange", event.target.value);
		},
		play() {
			let index = this.rangeContainer.indexOf(this.currentYear);
			this.pauseButton = true;
			this.playButton = false;
			this.disablePrevious = true;
			this.disableNext = true;
			var _this = this;
			if (this.currentTimePeriodIndex != this.rangeContainer.length) {
				this.periodInterval = setInterval(function () {
					if (index == 0) {
						_this.currentTimePeriodIndex = _this.isFirstIndex
							? 1
							: _this.currentTimePeriodIndex + 1;
					} else {
						_this.currentTimePeriodIndex = _this.isFirstIndex
							? 0
							: _this.currentTimePeriodIndex + 1;
					}

					_this.currentYear =
						_this.rangeContainer[_this.currentTimePeriodIndex];
					_this.playYearInterval(_this.currentTimePeriodIndex);
				}, 2000);
			}
		},
		playYearInterval(index) {
			this.isFirstIndex = false;
			// document.getElementById("selectYear").value = this.currentYear;
			this.$emit("currentYearChange", this.currentYear);
			if (index == this.rangeContainer.length - 1) {
				this.isFirstIndex = true;
				this.currentTimePeriodIndex = 0;
				this.pause();
				this.$emit(
					"currentYearChange",
					this.rangeContainer[this.rangeContainer.length - 1]
				);
			}
		},
		pause() {
			this.pauseButton = false;
			this.playButton = true;
			this.disablePrevious = false;
			this.disableNext = false;
			clearInterval(this.periodInterval);
		},
		previous() {
			this.currentIndex = this.rangeContainer.indexOf(this.currentYear);
			if (this.currentIndex == this.minIndex) {
				this.currentSetter(this.rangeContainer[this.currentIndex]);
			} else {
				this.currentSetter(this.rangeContainer[--this.currentIndex]);
			}
		},
		next() {
			this.currentIndex = this.rangeContainer.indexOf(this.currentYear);
			if (this.currentIndex == this.maxIndex) {
				this.currentSetter(this.rangeContainer[this.currentIndex]);
			} else {
				this.currentSetter(this.rangeContainer[++this.currentIndex]);
			}
		},
		currentSetter(param) {
			this.currentYear =
				param || this.rangeContainer[this.rangeContainer.length - 1];
		},
	},
	created() {
		this.minIndex = 0;
		this.maxIndex = this.rangeContainer.length - 1;
		this.generatePeriodDropdown();
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.btn-group > .btn:not(:last-child):not(.dropdown-toggle),
.btn-group > .btn-group:not(:last-child) > .btn {
	width: 78px;
}
.btn-group {
	height: 35px;
	select {
		height: 24px;
		padding: 0px 22px 0 7px;
		font-size: 0.75rem;
	}
}
.select-wrapper:after {
	font-family: FontAwesome;
	content: "\F0D7";
	font-size: 0.875rem;
	position: absolute;
	top: 2px;
	right: 6px;
	color: var(--text-font-color);
	pointer-events: none;
}
</style>