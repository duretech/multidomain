<template>
  <div>
    <b-button
      class="btn btn-primary black-btn mr-2"
      id="show-btn"
      @click="showModal"
      >{{ title }}</b-button
    >
    <b-modal ref="my-modal" hide-footer :title="`Select ${title}`">
      <div class="d-block text-left modaladmin-heading">
        <h5 v-if="title == 'Data Sets'">{{$t("selectMatrix")}}</h5>
        <b-form-select
          v-if="title == 'Data Sets'"
          v-model="matrixSelected"
          :options="matrixOptionList"
        ></b-form-select>
        <h5>{{$t("select")}} {{ title }}</h5>
        <b-form-select
          v-model="optionSelected"
          :options="optionList"
        ></b-form-select>
        <h5 v-if="title === 'Data Element' && categoryCombo.length > 0" class="mt-3">
          {{$t("selectCategoryCombo")}}
        </h5>
        <b-form-select
          v-if="title === 'Data Element' && categoryCombo.length > 0"
          v-model="categoryComboSelected"
          :options="categoryCombo"
        ></b-form-select>
      </div>
      <div class="d-flex justify-content-end">
      <b-button
        class="btn btn-primary black-btn mt-3 blue-btn w-30"
        variant="outline-warning"
        block
        @click="emitData"
        >{{$t("saveChanges")}}</b-button
      >
    </div>
    </b-modal>
  </div>
</template>
<script>
import service from "@/service";

export default {
  props: ["title", "indIndex", "subIndIndex" ,"keyType", "insideOf", "deList", "matrixList" , "emuType"],
  data() {
    return {
      optionSelected: "",
      matrixSelected: "",
      actDeList: this.deList,
      categoryCombo: [],
      categoryComboSelected: "",
    };
  },
  computed: {
    optionList() {
      // console.log(this.actDeList, "in computed modalpopup");
      let arr = [];
      this.actDeList.forEach((obj) => {
        let innerObj = {
          value: obj.id + "/" + obj.displayName,
          text: obj.displayName,
        };
        arr.push(innerObj);
      });
      // console.log(arr, "in coumputed return");
      return arr;
    },
    matrixOptionList() {
      let arr = [];
      this.matrixList.forEach((obj) => {
        let innerObj = {
          value: obj.id,
          text: obj.id,
        };
        arr.push(innerObj);
      });
      return arr;
    },
  },
  methods: {
    showModal() {
      this.$refs["my-modal"].show();
    },
    hideModal() {
      this.$refs["my-modal"].hide();
    },
    emitData() {
      // We pass the ID of the button that we want to return focus to
      // when the modal has hidden
      this.$refs["my-modal"].toggle("#toggle-btn");
      let obj = {};
      obj.id =
        this.optionSelected.split("/")[0] +
        (this.categoryComboSelected
          ? "." + this.categoryComboSelected.split("/")[0]
          : "");
      obj.displayName =
        this.optionSelected.split("/")[1] +
        (this.categoryComboSelected
          ? " " + this.categoryComboSelected.split("/")[1]
          : "");
      this.$emit(
        "getAllDEs",
        obj,
        this.indIndex,
        this.subIndIndex,
        this.keyType,
        this.title,
        this.insideOf,
        this.emuType
      );
    },
  },
  watch: {
    matrixSelected(val) {
      let dataSetList = this.deList;
      let newList = [];
      console.log(this.deList, val);
      if (val === "[All metrics]") {
        newList = dataSetList;
      } else {
        newList = dataSetList.filter((d) => d.dataSourceGroup === val);
      }
      if (this.title === "Data Sets") {
        this.actDeList = newList;
      }
    },
    optionSelected(val) {
      if (this.title === "Data Element" && val) {
        let des = val.split("/")[0];
        service.getCategoryCombo(des).then((resp) => {
          if (resp && resp.data) {
            let categoryCombo = resp.data.categoryCombo.categoryOptionCombos;
            let arr = [];
            categoryCombo.forEach((obj) => {
              let innerObj = {
                value: obj.id + "/" + obj.displayName,
                text: obj.displayName,
              };
              arr.push(innerObj);
            });
            this.categoryCombo = arr;
          }
        });
      }
    },
  },
};
</script>
