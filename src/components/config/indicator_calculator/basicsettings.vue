<template>
  <b-form class="accordion" role="tablist">
    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block v-b-toggle.periodsettings variant="info"
          >{{$t("actualReports")}}</b-button
        >
      </b-card-header>
      <b-collapse
        id="periodsettings"
        visible
        accordion="periodsettings"
        role="tabpanel"
      >
        <b-card-body>
          <div>
            <div class="d-flex justify-content-between align-items-center my-3">
              <div class="w-50">{{$t("methodName")}}</div>
              <b-form-input
                class="w-50"
                id="input-1"
                v-model="form.email"
                type="email"
                placeholder="Enter email"
                required
              ></b-form-input>
            </div>
            <div class="d-flex justify-content-between align-items-center my-3">
              <div class="w-50">{{$t("methodName")}}</div>
              <b-form-select
                class="w-50"
                v-model="form.selected2"
                :options="form.options2"
                :select-size="4"
              ></b-form-select>
            </div>
            <div class="d-flex justify-content-between align-items-center my-3">
              <div class="w-50">{{$t("methodName")}}</div>
              <b-form-input
                class="w-50"
                id="input-1"
                v-model="form.email"
                type="email"
                placeholder="Enter email"
                required
              ></b-form-input>
            </div>
            <div class="d-flex justify-content-between align-items-center my-3">
              <div class="w-50">{{$t("methodName")}}</div>
              <b-form-input
                class="w-50"
                id="input-1"
                v-model="form.email"
                type="email"
                placeholder="Enter email"
                required
              ></b-form-input>
            </div>
            <div class="d-flex justify-content-between align-items-center my-3">
              <div class="w-50">{{$t("methodName")}}</div>
              <b-form-select
                class="w-50"
                v-model="form.selected1"
                :options="form.options1"
              ></b-form-select>
            </div>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>
    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block v-b-toggle.outputdata variant="info"
          >{{$t("actualReports")}}</b-button
        >
      </b-card-header>
      <b-collapse
        id="outputdata"
        visible
        accordion="outputdata"
        role="tabpanel"
      >
        <b-card-body>
          <div>
            <div class="d-flex justify-content-between align-items-center my-3">
              <div class="">{{$t("methodName")}}</div>
              <b-form-input
                class="w-50"
                id="input-1"
                v-model="form.email"
                type="email"
                placeholder="Enter email"
                required
              ></b-form-input>
            </div>
            <div class="d-flex justify-content-between align-items-center my-3">
              <div class="w-50">{{$t("methodName")}}</div>
              <div class="w-50 d-flex justify-content-between">
                <b-form-input
                  class=""
                  id="input-1"
                  v-model="form.email"
                  type="email"
                  placeholder="Enter email"
                  required
                ></b-form-input>
                <b-button class="ml-2"
                  ><i class="fa fa-save delButton"></i
                ></b-button>
              </div>
            </div>
            <div class="d-flex justify-content-between align-items-center my-3">
              <div class="">{{$t("methodName")}}</div>
              <b-form-input
                class="w-50"
                id="input-1"
                v-model="form.email"
                type="email"
                placeholder="Enter email"
                required
              ></b-form-input>
            </div>
            <div class="d-flex justify-content-between align-items-center my-3">
              <div class="w-50">{{$t("methodName")}}</div>
              <div class="w-50 d-flex justify-content-between">
                <b-form-input
                  class=""
                  id="input-1"
                  v-model="form.email"
                  type="email"
                  placeholder="Enter email"
                  required
                ></b-form-input>
                <b-button class="ml-2"
                  ><i class="fa fa-save delButton"></i
                ></b-button>
              </div>
            </div>
            <div class="d-flex justify-content-between align-items-center my-3">
              <div class="">{{$t("methodName")}}</div>
              <b-form-input
                class="w-50"
                id="input-1"
                v-model="form.email"
                type="email"
                placeholder="Enter email"
                required
              ></b-form-input>
            </div>
            <div class="d-flex justify-content-between align-items-center my-3">
              <div class="w-50">{{$t("methodName")}}</div>
              <div class="w-50 d-flex justify-content-between">
                <b-form-input
                  class=""
                  id="input-1"
                  v-model="form.email"
                  type="email"
                  placeholder="Enter email"
                  required
                ></b-form-input>
                <b-button class="ml-2"
                  ><i class="fa fa-save delButton"></i
                ></b-button>
              </div>
            </div>
            <div class="d-flex justify-content-between align-items-center my-3">
              <div class="w-50">{{$t("methodName")}}</div>
              <div class="w-50 d-flex justify-content-between">
                <b-form-input
                  class=""
                  id="input-1"
                  v-model="form.email"
                  type="email"
                  placeholder="Enter email"
                  required
                ></b-form-input>
                <b-button class="ml-2"
                  ><i class="fa fa-save delButton"></i
                ></b-button>
              </div>
            </div>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>
  </b-form>
</template>
<script>
export default {
  props: [
    "config",
    "indKey",
    "dataElementList",
    "dataSetList",
    "matrixList",
    "indicatorList",
  ],
  data() {
    return {
      form: {
        email: "",
        checked: "",
        selected1: "",
        selected2: "",
        options2: [
          { value: null, text: "Please select some item" },
          { value: "a", text: "This is option a" },
          { value: "b", text: "Default Selected Option b" },
          { value: "c", text: "This is option c" },
          { value: "d", text: "This one is disabled", disabled: true },
          { value: "e", text: "This is option e" },
          { value: "e", text: "This is option f" },
        ],
        options1: [
          { value: null, text: "Please select some item" },
          { value: "a", text: "This is First option" },
          { value: "b", text: "Default Selected Option" },
          { value: "c", text: "This is another option" },
          { value: "d", text: "This one is disabled", disabled: true },
        ],
      },
    };
  },
  methods: {},
};
</script>
