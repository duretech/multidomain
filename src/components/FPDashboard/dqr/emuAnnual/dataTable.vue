<template>
  <div class="mb-25px mt-25px">
    <div
      class="card-header p-10px text-decoration-none"
      style="position: relative"
    >
      <div class="clearfix">
        <div class="float-left p-t-4px">
          <i
            class="fa fa-info-circle color-white cursor-pointer chart-info p-t-5px mr-2"
            aria-hidden="true"
            v-b-popover.hover.rightbottom="{
              variant: 'info',
              content: chartInfo,
              title: tableHeading,
              html: true,
            }"
          ></i>
          {{ tableHeading }}
        </div>
        <div class="float-right">
          <div class="row no-gutters d-flex">
            <p class="condom-text">{{ $t("inc_ex_condom_text") }}</p>
            <div class="pr-3">
              <select
                class="form-control typeDropdown"
                v-model="conFilter"
                @change="drawTable"
                id="exampleFormControlSelect1"
              >
                <option value="inc">{{ $t("includeCondoms") }}</option>
                <option value="ex">{{ $t("excludeCondoms") }}</option>
              </select>
            </div>
            <div class="p-t-4px">
              <download-csv :fields="fields" :data="items"
                ><img
                  :src="require('@/assets/images/icons/downloadActive.svg')"
                  class="img cursor-pointer me-15"
                  :style="{ filter: filterColor }"
                  v-b-tooltip.hover
                  :title="$t('downloadIcon')"
              /></download-csv>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-body pb-0">
      <div class="table-responsive">
        <table class="table table-bordered table-hover">
          <thead style="background-color: #d4d4d4">
            <tr>
              <th scope="col" v-for="f in fields" :key="f">{{ f }}</th>
            </tr>
          </thead>
          <tbody class="emu-tablehighlight">
            <template v-if="items[0]">
              <tr
                v-if="conFilter == 'inc'"
                style="background-color: rgb(255 243 205)"
              >
                <td v-for="f in fields" :key="f" class="emu-tablehighlight">
                  {{ items[0][f] }}
                </td>
              </tr>
              <tr v-else>
                <td v-for="f in fields" :key="f">{{ items[0][f] }}</td>
              </tr>
            </template>
            <template v-if="items[1]">
              <tr
                v-if="conFilter == 'ex'"
                style="background-color: rgb(255 243 205)"
              >
                <td v-for="f in fields" :key="f" class="emu-tablehighlight">
                  {{ items[1][f] }}
                </td>
              </tr>
              <tr v-else>
                <td v-for="f in fields" :key="f">{{ items[1][f] }}</td>
              </tr>
            </template>
            <tr v-if="items[2]">
              <td v-for="f in fields" :key="f">{{ items[2][f] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="card-footer text-right">
      <!-- <p class="m-0">
        {{$t('source')}}:
        <span>DHIS2</span>
      </p> -->
      <!-- <p class="m-0 condom-text">*Choose whether to include or exclude condoms in the final EMU value. </p> -->
    </div>
  </div>
</template>
<script>
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
export default {
  props: ["chartdata", "tableName", "tableHeading", "chartInfo", "popData"],
  mixins: [DynamicImageMixin],
  data() {
    return {
      tabData: JSON.stringify(this.chartdata),
      items: [],
      conFilter: "inc",
      //fields: ['selected', 'filter'],
      fields: [" " + this.$i18n.t("inc_ex_condome") + " "],
      selectMode: "single",
      selected: [],
    };
  },
  watch: {
    conFilter(newV) {
      this.$emit("filter", newV);
    },
    chartdata(newVal) {
      this.tabData = JSON.stringify(newVal);
      this.drawTable();
    },
  },
  methods: {
    onRowSelected(items) {
      this.selected = items;
      if (items && items[0]) {
        if (items[0]["filter"] == "Includes Condom") {
          this.conFilter = "inc";
        } else {
          this.conFilter = "ex";
        }
      }
    },
    drawTable() {
      let dataObj = JSON.parse(this.tabData);

      let incObj = {};

      incObj[" " + this.$i18n.t("inc_ex_condome") + " "] =
        this.$i18n.t("includeCondoms");
      let exObj = {
        [" " + this.$i18n.t("inc_ex_condome") + " "]:
          this.$i18n.t("excludeCondoms"),
      };
      let popObj = {
        [" " + this.$i18n.t("inc_ex_condome") + " "]:
          this.$i18n.t("Population"),
      };
      this.items = [];
      let reqDataInc = dataObj.data.find((obj) =>
        obj.name.includes(this.$i18n.t("includeCondoms"))
      );
      reqDataInc.data.forEach((innerObj, ind) => {
        // obj.data.forEach((innerObj,ind) =>{
        if (this.fields.indexOf(" " + dataObj.categories[ind] + " ") == -1) {
          this.fields.push(" " + dataObj.categories[ind] + " ");
        }
        incObj[" " + dataObj.categories[ind] + " "] =
          Number(innerObj).toFixed(2);
        // })
      });
      let reqDataExc = dataObj.data.find((obj) =>
        obj.name.includes(this.$i18n.t("excludeCondoms"))
      );
      reqDataExc.data.forEach((innerObj, ind) => {
        // obj.data.forEach((innerObj,ind) =>{

        exObj[" " + dataObj.categories[ind] + " "] =
          Number(innerObj).toFixed(2);
        popObj[" " + dataObj.categories[ind] + " "] = Number(
          this.popData[dataObj.categories[ind]]
        ).toLocaleString();
      });

      this.items.push(incObj);
      this.items.push(exObj);
      this.items.push(popObj);
    },
  },
  mounted() {
    this.drawTable();
    this.selected = [this.items[0]];
  },
};
</script>
<style lang="scss" scoped>
.mdgridviewpage-bg {
  background-size: cover;
  background-position: center;
  overflow-y: hidden;
}
.typeDropdown {
  font-size: 0.75rem;
  padding: 4px 25px 4px 5px;
  height: auto;
  margin-top: 4px;
  background: var(--text-subfont-color);
  color: var(--color-black);
}
.condom-text {
  font-size: 0.75rem;
  margin-top: 8px;
  margin-bottom: 0;
  margin-right: 5px;
}
.table-bordered thead th {
  font-weight: 100;
}
</style>
