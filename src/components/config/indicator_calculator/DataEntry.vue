<template>
  <div>
    <b-button class="btn btn-primary black-btn" @click="showModal"
      >Data Entry</b-button
    >
    <b-modal
      ref="my-modal"
      effect="fade/zoom"
      id="dataEntry"
      size="lg"
      title="Data Entry"
      ok-only
      @ok="updateDataStore"
    >
      <div class="row">
        <div class="col-6">
          <div class="d-block text-left">
            <div>Select Organisation</div>
            <treeselect
              :multiple="false"
              :options="computedLocList"
              :show-count="true"
              :placeholder="$t('search')"
              v-model="selectedOrg"
              :default-expand-level="1"
            />
          </div>
          <div class="my-3">
            Period
            <span class="float-right" v-if="dataEntryId.includes('prevalence')">
              <b-button class="black-btn btn-sm ml-3" @click="nextYear">
                Next Year
              </b-button>
              <b-button class="black-btn btn-sm ml-3" @click="prevYear">
                Perv Year
              </b-button>
            </span>
          </div>
          <div class="d-block text-left">
            <treeselect
              :multiple="true"
              :show-count="true"
              :placeholder="$t('search')"
              :default-expand-level="1"
              :options="periodList"
              v-model="selectedPeriod"
            />
          </div>
        </div>
        <div class="col-6">
          <div class="mt-3" :key="index" v-for="(per, index) in selectedPE">
            <div
              class="d-flex justify-content-around align-items-center"
              :key="index + dataEntryId + type"
            >
              <div class="mr-2">{{ per }} :</div>
              <b-form-input
                type="number"
                :id="`period+${per}`"
                :value="
                  finalHtmlPE.filter((inObj) => Number(inObj[1]) == per).length > 0
                ? finalHtmlPE.filter((Obj) => Obj[1] * 1 == per)[0][3]
                    : ''
                "
                @input="(e) => updateValues(per, e)"
                style="width: 50%"
              ></b-form-input>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script>
import Treeselect from "@riophae/vue-treeselect";
import service from "../../../service/index.js";
import { compress, decompress } from "compress-json";
export default {
  props: ["dataEntryId", "orgList", "bgDataType", "type"],
  components: { Treeselect },
  data() {
    return {
      selectedNodeDataEntry: [{}],
      selectedPeriod: [],
      selectedPE: [],
      periodList: [],
      currentYear: new Date().getFullYear(),
      finalHtmlPE: [],
      selectedOrg: null,
      level: null,
    };
  },
  computed: {
    computedLocList() {
      return this.orgList;
    },
  },
  watch: {
    selectedPeriod: function (newVal, oldVal) {
      let type = {};
      if (oldVal.length > newVal.length) {
        type.action = "remove-value";
        type.property = oldVal.filter((x) => newVal.indexOf(x) === -1)[0];
      } else if (oldVal.length < newVal.length) {
        type.action = "select-option";
        type.property = newVal.filter((x) => oldVal.indexOf(x) === -1)[0];
      }

      this.onPeriodChange(newVal, type);
    },
    selectedOrg: function (newVal) {
      if (newVal != null && newVal != "") this.getDataonlocation();
    },
  },
  methods: {
    showModal() {
      this.selectedOrg = this.orgList[0].id;
      this.level = this.orgList[0].level;
      this.$refs["my-modal"].show();
    },
    nextYear() {
      this.currentYear = this.currentYear * 1 + 1;
      this.periodList = [];
      this.$nextTick(() => {
        this.getPeriodList();
      });
    },
    prevYear() {
      this.currentYear = this.currentYear * 1 - 1;
      this.periodList = [];
      this.$nextTick(() => {
        this.getPeriodList();
      });
    },
    getPeriodList() {
      if (this.dataEntryId.includes("prevalence")) {
        let pList = [];
        for (let i = 0; i < 12; i++) {
          let month = i < 9 ? `0${i + 1}` : i + 1;
          let months = [
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
          ];

          pList.push({
            id: `${this.currentYear}${month}`,
            label: `${months[i]} ${this.currentYear}`,
          });
        }
        if (pList.length) {
          this.periodList = pList;
        }
      } else {
        let pList = [];
        for (let i = this.currentYear; i > this.currentYear * 1 - 10; i--) {
          pList.push({ id: i, label: i });
        }
        if (pList.length) {
          this.periodList = pList;
        }
      }
    },
    onPeriodChange(currentNode, type) {
      if (type.action !== "remove-value") {
        currentNode.forEach((obj) => {
          if (this.selectedPE && !this.selectedPE.includes(obj))
            this.selectedPE = [...this.selectedPE, obj];
        });
      } else {
        let val = type.property;
        if (this.selectedPE.includes(val)) {
          let prArr = this.selectedPE;
          let ind = prArr.indexOf(val);
          prArr.splice(ind, 1);
          this.selectedPE = [...prArr];
        }
      }
    },
    getDataonlocation() {
      this.finalHtmlPE = [];
      this.getLevel(this.computedLocList, this.selectedOrg);
      let newKey = this.dataEntryId;
      if (this.dataEntryId.includes("population")) {
        newKey = `population_${this.bgDataType.toLowerCase()}_${this.level}`;
      }
      if (this.dataEntryId.includes("mcpr")) {
        newKey = `mcpr_${this.bgDataType.toLowerCase()}_${this.level}`;
      }
      if (this.dataEntryId.includes("mcmm")) {
        newKey = `mcmm_${this.bgDataType.toLowerCase()}_${this.level}`;
      }
      if (this.dataEntryId.includes("psa")) {
        newKey = `psa_${this.level}`;
      }
      if (this.dataEntryId.includes("prevalence")) {
        newKey = `prevalence_${this.level}`;
      }
      service.getSavedConfig(newKey, false, "fp-dashboard").then((resp) => {
        let pes =
          typeof resp.data.rows == "string"
            ? {
                ...resp.data,
                rows: decompress(JSON.parse(resp.data.rows)),
              }
            : resp.data;
        pes = pes.rows.filter(
          (obj) => obj[2] == this.selectedOrg && obj[0] === this.dataEntryId
        );
        this.finalHtmlPE = [...pes];
      });
    },
    updateValues(period, val) {
      let dt = this.finalHtmlPE;
      let isFound = dt.filter((obj) => obj[1].toString() == period.toString());
      console.log(isFound)
      if (isFound.length > 0) {
        let index = dt.findIndex(
          (obj) => obj[1].toString() == period.toString()
        );
        if (index >= 0) {
          dt[index][3] = val;
        }
      } else {
        dt.push([this.dataEntryId, period.toString(), this.selectedOrg, val]);
      }
      this.finalHtmlPE = [...dt];
    },
    assignChecked(mainObj, obj) {
      return mainObj.map((root) => {
        if (root.id === obj.id) {
          this.selectedOrg = obj;
        } else {
          root.checked = false;
        }
        if (root.children) {
          root.children = this.assignChecked(root.children, obj);
        }
        return root;
      });
    },
    updateDataStore() {
      console.log('HI')
      this.$refs["my-modal"].hide();
      this.getLevel(this.computedLocList, this.selectedOrg);
      let newKey = this.dataEntryId;
      let updatedData = this.finalHtmlPE;
      if (this.dataEntryId.includes("population")) {
        newKey = `population_${this.bgDataType.toLowerCase()}_${this.level}`;
      }
      if (this.dataEntryId.includes("mcpr")) {
        newKey = `mcpr_${this.bgDataType.toLowerCase()}_${this.level}`;
      }
      if (this.dataEntryId.includes("mcmm")) {
        newKey = `mcmm_${this.bgDataType.toLowerCase()}_${this.level}`;
      }
      if (this.dataEntryId.includes("psa")) {
        newKey = `psa_${this.level}`;
      }
      if (this.dataEntryId.includes("prevalence")) {
        newKey = `prevalence_${this.level}`;
      }
      service.getSavedConfig(newKey, false, "fp-dashboard").then((res) => {
        let upData =
          typeof res.data.rows == "string"
            ? {
                ...res.data,
                rows: decompress(JSON.parse(res.data.rows)),
              }
            : res.data;

        upData.rows = JSON.stringify(compress(updatedData));
        service
          .updateConfig(upData, newKey, false, "fp-dashboard")
          .then((response) => {
            if (response.data.status === "OK") {
              this.$swal({
                title: "Data saved successfully",
                icon: "success",
              });
            }
          });
      });
    },
    getLevel(mainObj, id) {
      mainObj.map((root) => {
        if (root.id === id) {
          this.level = root.level;
        } else if (root.children) {
          this.getLevel(root.children, id);
        }
      });
      // return level;
    },
  },
  created() {
    this.getPeriodList();
    // this.computedLocList;
    //this.getDataonlocation();
  },
};
</script>
