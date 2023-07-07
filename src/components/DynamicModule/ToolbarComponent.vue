<template>
  <div
    class="container-fluid bottom-tabbar new-toolbar"
    :class="{ active: showToolbarOnTablet }"
  >
    <div class="bottom-tabbar-close" @click="closeToolbar">ne</div>
    <div class="bottom_toolbar_wrap">
      <form class="input-select-items">
        <div class="form-group pr-3">
          <label class="text-center">{{ $t("location") }}</label>
          <treeselect
            class="form-control"
            :multiple="true"
            :options="options"
            :show-count="true"
            :placeholder="$t('search')"
            v-model="value"
            :flat="true"
            :default-expand-level="defaultExpandLevel"
            :limit="1"
            :load-options="loadOptions"
          
          />
        </div>
        <div class="form-group pr-3 d-none">
          <label class="text-center">{{ $t("period") }} {{ $t("type") }}</label>
          <div class="select-wrapper">
            <select class="form-control tabbarselect" v-model="pType">
              <option value="monthly">{{ $t("monthly") }}</option>
              <option value="quarterly">{{ $t("quarterly") }}</option>
              <option value="yearly">{{ $t("yearly") }}</option>
              <option
                value="financialYear"
                v-if="$store.state.financialYear.includes('April')"
              >
                {{ $t("financialYear") }}
              </option>
              <option
                value="financialYearJuly"
                v-if="$store.state.financialYear.includes('July')"
              >
                {{ $t("financialYearJuly") }}
              </option>
            </select>
          </div>
        </div>
        <div class="form-group pr-3 period-dropdown">
          <label class="text-center">{{ $t("periodType") }}</label>
          <treeselect
            class="form-control"
            :multiple="false"
            :options="pTypeOptions"
            :show-count="true"
            :placeholder="$t('search')"
            v-model="pType"
            :flat="false"
            :default-expand-level="defaultExpandLevel"
            :load-options="loadOptions"
          />
        </div>
        <div class="form-group pr-3 toolbarDropdown">
          <label class="text-center">{{ $t("period") }}</label>
          <date-picker
            v-model="period"
            :range="true"
            type="month"
            value-type="format"
            format="YYYY-MM"
            class="form-control"
            :lang="lang"
            v-if="pType === 'monthly'"
            :disabled-date="disableDate"
          ></date-picker>
          <date-picker
            v-model="period"
            :range="true"
            type="year"
            value-type="format"
            format="YYYY"
            class="form-control"
            :lang="lang"
            v-else-if="pType === 'yearly'"
            :disabled-date="disableDate"
          ></date-picker>
          <b-dropdown
            id="dropdown-dropup"
            dropup
            :text="periodText"
            class="form-control p-0"
            variant="link"
            toggle-class="color-white"
            v-else
          >
            <b-dropdown-form>
              <b-form-group>
                <b-form-checkbox-group
                  v-model="period"
                  :options="periodOptions"
                  name="period"
                  stacked
                ></b-form-checkbox-group>
              </b-form-group>
            </b-dropdown-form>
          </b-dropdown>
        </div>
        <div class="pr-3 justify-content-center align-items-end d-none">
          <b-button
            v-if="$store.state.financialYear.includes('April')"
            class="views-btn-footer mx-2 fs-17-1920"
            :class="{ 'onclick-btn-footer': pType === 'financialYear' }"
            @click="pType = 'financialYear'"
            v-b-tooltip.hover
            :title="$t('financialYear')"
            ><div v-if="pType === 'financialYear'">
              {{ $t("financialYear") }}
            </div>
            <div v-else>{{ $t("FY_Apr") }}</div></b-button
          >
          <b-button
            v-if="$store.state.financialYear.includes('July')"
            class="views-btn-footer mx-2 fs-17-1920"
            :class="{ 'onclick-btn-footer': pType === 'financialYearJuly' }"
            @click="pType = 'financialYearJuly'"
            v-b-tooltip.hover
            :title="$t('financialYearJuly')"
            ><div v-if="pType === 'financialYearJuly'">
              {{ $t("financialYearJuly") }}
            </div>
            <div v-else>{{ $t("FY_Jul") }}</div></b-button
          >
          <b-button
            class="views-btn-footer mx-2 fs-17-1920"
            :class="{ 'onclick-btn-footer': pType === 'yearly' }"
            @click="pType = 'yearly'"
            v-b-tooltip.hover
            :title="$t('Yearly_view')"
            ><div v-if="pType === 'yearly'">
              {{ $t("Yearly_view") }}
            </div>
            <div v-else>{{ $t("Y") }}</div></b-button
          >
          <b-button
            class="views-btn-footer mx-2 fs-17-1920"
            :class="{ 'onclick-btn-footer': pType === 'quarterly' }"
            @click="pType = 'quarterly'"
            v-b-tooltip.hover
            :title="$t('Quaterly_view')"
            ><div v-if="pType === 'quarterly'">
              {{ $t("Quaterly_view") }}
            </div>
            <div v-else>{{ $t("Q") }}</div></b-button
          >
          <b-button
            class="views-btn-footer mx-2 fs-17-1920"
            :class="{ 'onclick-btn-footer': pType === 'monthly' }"
            @click="pType = 'monthly'"
            v-b-tooltip.hover
            :title="$t('Monthly_view')"
            ><div v-if="pType === 'monthly'">
              {{ $t("Monthly_view") }}
            </div>
            <div v-else>{{ $t("M") }}</div></b-button
          >
        </div>
        <div class="form-group pr-3 d-none">
          <label class="text-capitalize">{{ $t("period") }} </label>
          <date-picker
            v-model="monthYear"
            type="month"
            value-type="format"
            format="YYYY-MM"
            class="form-control"
            :lang="lang"
          ></date-picker>
        </div>
        <b-button
          class="applyBtn blue-btn btn btn-sm"
          style="
            height: 38px;
            margin-top: 21px;
            border: none;
          "
          @click.prevent.stop="sendDetails"
          :disabled="value.length === 0 || period.length === 0"
          >{{ $t("apply") }}</b-button
        >
      </form>
    </div>
  </div>
</template>
<script>
import service from "@/service";
import loadLocChildMixin from "@/helpers/LoadLocationChildMixin";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
export default {
  props: ["globalPeriodData", "showToolbarOnTablet"],
  components: {
    Treeselect,
    DatePicker,
  },
  mixins: [loadLocChildMixin],
  data() {
    // console.log(this.globalPeriodData)
    let period = this.globalPeriodData;
    return {
      source: "NA",
      monthYear: this.$moment(
        new Date(period.backtrackedDate),
        "YYYYMM"
      ).format("YYYY-MM"),
      allowedStartDate: period ? new Date(period.backtrackedDate) : null,
      allowedFinalDate: period ? new Date(period.backtrackedLimitedDate) : null,
      locationList: [],
      location: "",
      label: "",
      yearString: "",
      year: "",
      month: "",
      monthName: "",
      defaultExpandLevel: 1,
      period: [],
      level: "",
      multiple: false,
      clearable: true,
      searchable: false,
      disabled: false,
      openOnClick: true,
      openOnFocus: false,
      clearOnSelect: true,
      closeOnSelect: false,
      alwaysOpen: true,
      appendToBody: false,
      options: [],
      value: [],
      isEmit: true,
      lang: {
        formatLocale: {
          monthsShort: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
        },
      },
      periodOptions: [],
      pType: "financialYear",
    };
  },
  computed: {
    periodText() {
      return this.period.length + " Selected";
	  },
	pTypeOptions() {
      let pType = [
        { id: "monthly", label: this.$i18n.t("monthly") },
        { id: "quarterly", label: this.$i18n.t("quarterly") },
        { id: "yearly", label: this.$i18n.t("yearly") },
      ];
      if (this.$store.state.financialYear.includes("July")) {
        pType.push({
          id: "financialYearJuly",
          label: this.$i18n.t("financialYearJuly"),
        });
      }
      if (this.$store.state.financialYear.includes("April")) {
        pType.push({
          id: "financialYear",
          label: this.$i18n.t("financialYear"),
        });
      }
      return pType;
    },
  },
  watch: {
    drilldownLocation(newValue) {
      if (newValue) {
        this.value = newValue;
      }
    },
    pType(newValue) {
      this.periodOptions = [];
      this.period = [];
      if (newValue === "financialYear") {
        this.setCurrentPeriod("financialYear");
      } else if (newValue === "financialYearJuly") {
        this.setCurrentPeriod("financialYearJuly");
      } else if (newValue === "quarterly") {
        this.setCurrentPeriod("quarterly");
      }
    },
  },
  methods: {
    disableDate(date) {
      let format = this.pType == "yearly" ? "YYYY" : "YYYYMM";
      let dStart = this.$moment(new Date(), format).format(format);
      let d1 = this.$moment(date, format).format(format);
      return d1 > dStart;
    },
    sendDetails() {
      let locations =
        this.value.length > 0 ? this.value.map((n) => n.split("/")[1]) : [];
      this.$emit("location", this.period, this.pType, locations, this.options);
    },
    closeToolbar() {
      this.$emit("closeToolbar");
    },
    getConfigAccess() {
      let { locationID, levelID } = service.getAllowedLocation();
      this.$emit("lowerOrg", locationID);
      this.location = locationID;
      this.level = levelID;
      this.options = JSON.parse(
        JSON.stringify(this.$store.getters.getLocationList)
      );
      this.value = [this.level + "/" + this.location];
    },
    setCurrentPeriod(type, initialSelect = false) {
      let currentYear = new Date().getFullYear(),
        currentMonth = new Date().getMonth() + 1;
      let currentQuarter = Math.ceil(currentMonth / 3);
      if (type === "financialYear" || type === "financialYearJuly") {
        if (currentMonth <= 4) {
          currentYear = currentYear * 1 - 1;
        }
      }

      for (let i = currentYear - 20; i <= currentYear; i++) {
        if (type === "financialYear") {
          let months =
            this.$i18n.locale === "fr" ? ["avril", "mars"] : ["Apr", "Mar"];
          this.periodOptions.push({
            text: `${months[0]} ${i} - ${months[1]} ${i + 1}`,
            value: `${i}April`,
          });
          if (initialSelect && i >= currentYear - 11) {
            this.period.push(`${i}April`);
          }
        }

        if (type === "financialYearJuly") {
          let months =
            this.$i18n.locale === "fr" ? ["juin", "juil."] : ["Jun", "Jul"];
          this.periodOptions.push({
            text: `${months[0]} ${i} - ${months[1]} ${i + 1}`,
            value: `${i}July`,
          });
          if (initialSelect && i >= currentYear - 11) {
            this.period.push(`${i}July`);
          }
        }

        if (type === "quarterly") {
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

          if (i === currentYear) {
            for (let j = currentQuarter; j >= 1; j--) {
              this.periodOptions.push({
                value: `${i}Q${j}`,
                text: years[`Q${j}`][0] + " - " + years[`Q${j}`][1] + " " + i,
              });
            }
          } else {
            for (let j = 4; j >= 1; j--) {
              this.periodOptions.push({
                value: `${i}Q${j}`,
                text: years[`Q${j}`][0] + " - " + years[`Q${j}`][1] + " " + i,
              });
            }
          }
        }
      }
      this.periodOptions.reverse();
    },
  },
  created() {
    if (
      this.$store.state.financialYear.length === 1 &&
      this.$store.state.financialYear.includes("July")
    ) {
      this.pType = "financialYearJuly";
    }
    if (this.$i18n.locale === "fr") {
      this.lang = {
        formatLocale: {
          monthsShort: [
            "janv.",
            "févr.",
            "mars",
            "avril",
            "mai",
            "juin",
            "juil.",
            "août",
            "sept.",
            "oct.",
            "nov.",
            "déc.",
          ],
          // janv.	févr.	mars	avril	mai	juin	juil.	août	sept.	oct.	nov.	déc.
          //https://web.library.yale.edu/cataloging/months get abbrevation from here for othe locales
        },
      };
    }

    this.setCurrentPeriod(this.pType, true);
    this.getConfigAccess();
    this.sendDetails();
  },
};
</script>
<style lang="scss" scoped>
.bottom-tabbar {
  z-index: 999;
}
</style>