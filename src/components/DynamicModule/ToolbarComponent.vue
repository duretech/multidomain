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
        <b-button
          class="applyBtn blue-btn btn btn-sm"
          style="height: 38px; margin-top: 21px; border: none"
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
import "vue2-datepicker/index.css";
import DatePicker from "vue2-datepicker";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { pTypeList } from "@/components/Common/commonFunctions";
import loadLocChildMixin from "@/helpers/LoadLocationChildMixin";
import NepaliDate from "nepali-date-converter";
export default {
  props: ["globalPeriodData", "showToolbarOnTablet"],
  components: {
    Treeselect,
    DatePicker,
  },
  mixins: [loadLocChildMixin],
  data() {
    let period = this.globalPeriodData;
    console.log(this.globalPeriodData)
    let d,e;
    if (this.$store.getters.getAppSettings.calendar === "nepali") {
      let a = period.backtrackedDate.split("-")
      let b = period.backtrackedLimitedDate.split("-")
        d = new NepaliDate(new Date(a[0] , a[1] + 1, 16)).getBS()
        e = new NepaliDate(new Date(b[0] , b[1] + 1, 16)).getBS()
        let nplMonth = d.month;
        let nplYear = d.year;
        let nplLimitedDateMonth = e.month;
        let nplLimitedDateYear = e.year;
        let zeroForMonth = nplMonth < 10 ? "0" + nplMonth : nplMonth;
        let zeroForMonthLimitedDate = nplLimitedDateMonth < 10 ? "0" + nplLimitedDateMonth : nplLimitedDateMonth;
        d = nplYear + "" + zeroForMonth;
        e = nplLimitedDateYear + "" + zeroForMonthLimitedDate;
      }
    return {
      source: "NA",
      monthYear: this.$store.getters.getAppSettings.calendar === "nepali" ? d : this.$moment(
        new Date(period.backtrackedDate),
        "YYYYMM"
      ).format("YYYY-MM"),
      allowedStartDate: this.$store.getters.getAppSettings.calendar === "nepali" ? d : period ? new Date(period.backtrackedDate) : null,
      allowedFinalDate: this.$store.getters.getAppSettings.calendar === "nepali" ? e : period ? new Date(period.backtrackedLimitedDate) : null,
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
      } else if(newValue === "monthly"){
        this.period = ['2070-07','2080-07']
      } else if(newValue === "yearly"){
        this.period = ['2070','2080']
      }
    },
  },
  methods: {
    disableDate(date) {
      let format = this.pType == "yearly" ? "YYYY" : "YYYYMM";
      let dStart,d1;
      d1 = this.$moment(date, format).format(format);
      console.log("d1", d1)
      if (this.$store.getters.getAppSettings.calendar === "nepali") {
        let d = new Date();
        d = new NepaliDate(new Date(d.getFullYear() , d.getMonth() + 1, d.getDate())).getBS()
        let zeroForMonth = d.month < 10 ? "0" + d.month : d.month;
        d = d.year + "" + zeroForMonth 
        dStart = this.$moment(d, format).format(format)
      }
      else{
        dStart = this.$moment(new Date(), format).format(format);
      }
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
      let d = new NepaliDate(
        new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
      ).getBS();

      let currentYear = new Date().getFullYear(),
        currentMonth = new Date().getMonth() + 1;
      if (this.$store.getters.getAppSettings.calendar === "nepali") {
        currentYear = d.year;
        currentMonth = d.month;
      }
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
            if (this.$store.getters.getAppSettings.calendar === "nepali") {
            months = ["Shr", "Asa"];
          }
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
          if (this.$store.getters.getAppSettings.calendar === "nepali") {
            years = {
              Q1: ["Asa", "Shr"],
              Q2: ["Bhd", "Asw"],
              Q3: ["Kar", "Man"],
              Q4: ["Bai", "Jes"],
            };

            if (currentMonth > 1 && currentMonth <= 3) {
            currentQuarter = 3;
          } else if (currentMonth > 4 && currentMonth <= 6) {
            currentQuarter = 4;
          } else if (currentMonth > 7 && currentMonth <= 9) {
            currentQuarter = 1;
          } else if (currentMonth > 10 && currentMonth <= 12) {
            currentQuarter = 2;
          } else {
            currentQuarter = "Invalid quarter";
          }
          }
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
    this.pTypeOptions = pTypeList({});
    if (
      this.$store.getters.getFinancialYear.length === 1 &&
      this.$store.getters.getFinancialYear.includes("July")
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

    if(this.$store.getters.getAppSettings.calendar === "nepali"){
      this.lang = {
        formatLocale: {
          monthsShort: [
            "Bai",
            "Jes",
            "Asa",
            "Shr", 
            "Bhd",
            "Asw",
            "Kar",
            "Man",
            "Pou",
            "Mag",
            "Fal",
            "Cha",
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