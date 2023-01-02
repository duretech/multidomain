<template>
  <div>
    <div class="row m-0 mt-2 mb-2 mr-2 ml-2">
      <div class="col-lg-4 card-header text-muted">
        {{ $t("public_sector") }}
      </div>
      <div class="col-lg-4 card-header text-muted">
        {{ $t("public_medical_sector") }}
      </div>
      <div class="col-lg-4 card-header text-muted">
        {{ $t("other_source") }}
      </div>
    </div>
    <div class="row m-0 mt-4 mb-2">
      <div class="col-lg-4">
        <div class="form-group row">
          <label class="col-sm-12 col-form-label">{{
            $t("gov_health_facilities")
          }}</label>
          <div class="col-sm-12">
            <select class="form-control" v-model="FPSource.governmentHealth">
              <option value="Yes">{{ $t("yes") }}</option>
              <option value="No">{{ $t("no") }}</option>
              <option value="Partially">
                {{ $t("partially") }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="form-group row">
          <label class="col-sm-12 col-form-label">{{
            $t("ngo")
          }}</label>
          <div class="col-sm-12">
            <select class="form-control" v-model="FPSource.ngo">
              <option value="Yes">{{ $t("yes") }}</option>
              <option value="No">{{ $t("no") }}</option>
              <option value="Partially">
                {{ $t("partially") }}
              </option>
            </select>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-sm-12 col-form-label">{{
            $t("private_hospital")
          }}</label>
          <div class="col-sm-12">
            <select class="form-control" v-model="FPSource.privateHospital">
              <option value="Yes">{{ $t("yes") }}</option>
              <option value="No">{{ $t("no") }}</option>
              <option value="Partially">
                {{ $t("partially") }}
              </option>
            </select>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-sm-12 col-form-label">{{
            $t("pharmacy")
          }}</label>
          <div class="col-sm-12">
            <select class="form-control" v-model="FPSource.pharmacy">
              <option value="Yes">{{ $t("yes") }}</option>
              <option value="No">{{ $t("no") }}</option>
              <option value="Partially">
                {{ $t("partially") }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="form-group row">
          <label class="col-sm-12 col-form-label">
            {{ $t("shop_church_friend") }}</label
          >
          <div class="col-sm-12">
            <select class="form-control" v-model="FPSource.shopChurchFriend">
              <option value="Yes">{{ $t("yes") }}</option>
              <option value="No">{{ $t("no") }}</option>
              <option value="Partially">
                {{ $t("partially") }}
              </option>
            </select>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-sm-12 col-form-label">{{
            $t("other")
          }}</label>
          <div class="col-sm-12">
            <select class="form-control" v-model="FPSource.otherSector">
              <option value="Yes">{{ $t("yes") }}</option>
              <option value="No">{{ $t("no") }}</option>
              <option value="Partially">
                {{ $t("partially") }}
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
  props: ["FPSource", "indicatorsList", "dataElementsList"],
  components: {},
  data() {
    return {};
  },
  methods: {
    resetDE(i, j, type) {
      this.FPSource[type][i].subIndicators[j].selectedDE = [];
    },
    addDE(i, j, type, elem) {
      this.FPSource[type][i].subIndicators[j].selectedDE.push(elem);
      //console.log('added',this.FPSource);
    },
  },
};
</script>
