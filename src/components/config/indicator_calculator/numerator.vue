<template>
  <div class="accordion" role="tablist">
    <div v-if="tabType === 'Information'">
      <!-- <b-button id="show-btn-loc" @click="openLoc()">
        Select Location for Scheduler</b-button
      > -->
      <div class="d-flex justify-content-end">
        <b-button
          class="btn btn-primary black-btn mr-2"
          id="show-btn"
          @click="openLoc()"
          >{{ $t("selectLocationScheduler") }}</b-button
        >
        <b-button
          class="btn btn-primary black-btn mr-2"
          id="show-btn-start"
          @click="startProcess"
          >{{ $t("startCalc") }}</b-button
        >
      </div>

      <b-modal
        ref="my-modal"
        hide-footer
        centered
        :title="$t('selectLocation')"
        no-close-on-backdrop
      >
        <div class="d-block text-left default-btn">
          <h5>{{ $t("selectLocation") }}</h5>

          <treeselect
            :multiple="true"
            class=""
            :options="computedLocList"
            :show-count="true"
            :placeholder="$t('search')"
            v-model="selectedNode"
            :flat="true"
            :default-expand-level="1"
          />
          <!--             value-format="object"
 -->
        </div>
        <b-row>
          <b-col class="mx-5">
            <b-button
              class="btn btn-primary black-btn greycolor-btn mt-2 w-75"
              variant="outline-danger"
              block
              @click="hideModal"
              >{{ $t("close") }}</b-button
            >
          </b-col>
          <b-col>
            <b-button
              class="btn btn-primary black-btn mt-2 blue-btn w-75"
              variant="outline-warning"
              block
              @click="closeLoc"
              >{{ $t("saveChanges") }}</b-button
            >
          </b-col>
        </b-row>
      </b-modal>
      <h6>{{ $t("ind1") }}</h6>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vulputate
        dignissim pretium. Maecenas ac nulla risus. Cras pellentesque odio eget
        ligula porta commodo. Ut pharetra, erat sit amet bibendum pellentesque,
        turpis ipsum viverra sapien, id ornare neque nulla in sapien. Phasellus
        et faucibus metus. Vivamus in eleifend ligula, nec scelerisque leo.
        Vestibulum maximus porta metus vel aliquet. Nullam et auctor justo. Cras
        urna urna, imperdiet eu tellus a, finibus rhoncus mauris. Aenean et
        neque dignissim, fermentum erat sit amet, commodo nulla. Donec aliquet
        massa id tincidunt euismod. Mauris pulvinar mi odio, eget congue lorem
        tempor nec.
      </p>
    </div>
    <b-card no-body class="mb-1" v-if="tabType === 'Numerator'">
      <b-card-header header-tag="header" class="p-1 method-header" role="tab">
        <b-button
          class="text-left"
          block
          v-b-toggle.methodmapping
          variant="info"
          >{{ $t("categoryMapping") }}</b-button
        >
      </b-card-header>
      <b-collapse
        id="methodmapping"
        visible
        accordion="methodmapping"
        role="tabpanel"
      >
        <b-card-body>
          <div class="accordion" role="tablist">
            <b-form
              no-body
              class="mb-2"
              :key="index"
              v-for="(obj, index) in config['stockOut'][this.indKey]['methods']"
            >
              <b-card-header
                header-tag="header"
                class="p-1 method-header"
                role="tab"
              >
                <b-button
                  class="text-left"
                  block
                  v-b-toggle="'accordion-' + index"
                  variant="info"
                >
                  {{ obj.name }}
                  <!-- <i
                    class="fa fa-trash delButton float-right"
                  
                  ></i> -->

                  <img
                    src="@/assets/images/icons/admindelete-icon.svg"
                    :style="{ filter: filterColor }"
                    class="delButton float-right w-auto mx-4 mt-1"
                    @click="deleteMethod(index)"
                  />
                </b-button>
              </b-card-header>
              <b-collapse
                :id="'accordion-' + index"
                visible
                accordion="my-accordion"
                role="tabpanel"
              >
                <b-card-body>
                  <b-form>
                    <div class="d-flex align-items-center">
                      <div class="">{{ $t("methodName") }}</div>
                      <b-form-input
                        class="w-75 mx-4"
                        id="input-1"
                        v-model="obj.name"
                        type="text"
                        placeholder="Enter method name"
                        required
                      ></b-form-input>
                    </div>

                    <div class="my-3">
                      <b-form-group
                        label="Mapping"
                        v-slot="{ ariaDescribedby }"
                      >
                        <div class="d-flex">
                          <b-form-radio
                            v-model="obj.type"
                            :aria-describedby="ariaDescribedby"
                            name="some-radios"
                            value="indicator"
                            >{{ $t("indicator") }}</b-form-radio
                          >
                          <b-form-radio
                            v-model="obj.type"
                            :aria-describedby="ariaDescribedby"
                            name="some-radios"
                            value="data_element"
                            class="mx-3"
                            >{{ $t("dataElement") }}</b-form-radio
                          >
                          <b-form-radio
                            v-model="obj.type"
                            :aria-describedby="ariaDescribedby"
                            name="some-radios"
                            value="data_sets"
                            class="mx-2"
                            >{{ $t("dataSets") }}</b-form-radio
                          >
                        </div>
                      </b-form-group>
                      <!-- <b-form-group label="Mapping">
                        <b-form-checkbox-group
                          v-model="obj.type"
                          id="checkboxes-2"
                        >
                          <b-form-checkbox value="indicator"
                            >Indicator</b-form-checkbox
                          >
                          <b-form-checkbox value="data_element"
                            >Data Element</b-form-checkbox
                          >
                          <b-form-checkbox value="datasets"
                            >Data Sets</b-form-checkbox
                          >
                        </b-form-checkbox-group>
                      </b-form-group> -->
                    </div>
                    <div class="d-flex">
                      <!-- <b-button class="mr-2">Indicator</b-button>
                      <b-button class="mx-2">Data Element</b-button>
                      <b-button class="ml-2">Data Sets</b-button> -->
                      <div variant="btn btn-light">
                        <!-- <ModalPopupStockOut title="Data Element"
                          deList={props.dataElementList.dataElements}
                          matrixList={props.matrixList} indIndex={index}
                          keyType={"methods"} getAllDEs={getAllDEs}
                          insideOf="stockOut" /> -->
                        <ModalPopup
                          title="Indicator"
                          :deList="indicatorList"
                          :matrixList="matrixList"
                          :indIndex="index"
                          keyType="methods"
                          @getAllDEs="getAllDEs"
                          insideOf="stockOut"
                        />
                      </div>
                      <div variant="btn btn-light">
                        <ModalPopup
                          title="Data Element"
                          :deList="dataElementList"
                          :matrixList="matrixList"
                          :indIndex="index"
                          keyType="methods"
                          @getAllDEs="getAllDEs"
                          insideOf="stockOut"
                        />
                      </div>
                      <div variant="btn btn-light">
                        <ModalPopup
                          title="Data Sets"
                          :deList="dataSetList"
                          :matrixList="matrixList"
                          :indIndex="index"
                          keyType="methods"
                          @getAllDEs="getAllDEs"
                          insideOf="stockOut"
                        />
                      </div>
                    </div>
                    <div>
                      <template v-for="(innObj, subind) in obj.selectedDE">
                        <div :key="subind" class="mt-3">
                          <label>{{ innObj.displayName }}</label>
                          &nbsp;&nbsp;&nbsp;&nbsp;
                          <!-- <i
                            class="fa fa-trash delButton"
                            @click="deleteDe(index, innObj.id)"
                          ></i> -->

                          <img
                            src="@/assets/images/icons/admindelete-icon.svg"
                            class="delButton w-auto"
                            :style="{ filter: filterColor }"
                            @click="deleteDe(index, innObj.id)"
                          />
                          <br />
                        </div>
                      </template>
                    </div>
                  </b-form>
                </b-card-body>
              </b-collapse>
            </b-form>
          </div>
          <div class="float-right mt-2 mb-2">
            <b-button
              class="btn btn-primary black-btn"
              @click="addMethod('methods')"
              >+&nbsp;{{ $t("method") }}</b-button
            >
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card no-body class="mb-1" v-if="tabType === 'Denominator'">
      <div class="accordion" role="tablist">
        <b-form
          no-body
          class="mb-2"
          :key="index"
          v-for="(obj, index) in config['stockOut'][this.indKey]['repoRate']"
        >
          <b-card-header
            header-tag="header"
            class="p-1 method-header"
            role="tab"
          >
            <b-button
              class="text-left"
              block
              v-b-toggle="'accordion-' + index"
              variant="info"
              >{{ obj.name }}
              <!-- <i
                class="fa fa-trash delButton float-right"
                @click="deleteMethod(index)"
              ></i> -->
              <img
                src="@/assets/images/icons/admindelete-icon.svg"
                :style="{ filter: filterColor }"
                class="delButton float-right w-auto mx-4 mt-sm-1"
                @click="deleteMethod(index)"
              />
            </b-button>
          </b-card-header>
          <b-collapse
            :id="'accordion-' + index"
            visible
            accordion="my-accordion"
            role="tabpanel"
          >
            <b-card-body>
              <b-form>
                <div class="d-flex align-items-center">
                  <div class="">{{ $t("methodName") }}</div>
                  <b-form-input
                    class="w-75 mx-4"
                    id="input-1"
                    v-model="obj.name"
                    type="text"
                    placeholder="Enter method name"
                    required
                  ></b-form-input>
                </div>

                <div class="my-3">
                  <b-form-group label="Mapping" v-slot="{ ariaDescribedby }">
                    <div class="d-flex">
                      <b-form-radio
                        v-model="obj.type"
                        :aria-describedby="ariaDescribedby"
                        name="some-radios"
                        value="indicator"
                        >{{ $t("indicator") }}</b-form-radio
                      >
                      <b-form-radio
                        v-model="obj.type"
                        :aria-describedby="ariaDescribedby"
                        name="some-radios"
                        value="data_element"
                        class="mx-3"
                        >{{ $t("dataElement") }}</b-form-radio
                      >
                      <b-form-radio
                        v-model="obj.type"
                        :aria-describedby="ariaDescribedby"
                        name="some-radios"
                        value="data_sets"
                        class="mx-2"
                        >{{ $t("dataSets") }}</b-form-radio
                      >
                    </div>
                  </b-form-group>
                  <!-- <b-form-group label="Mapping">
                    <b-form-checkbox-group v-model="obj.type" id="checkboxes-2">
                      <b-form-checkbox value="indicator"
                        >Indicator</b-form-checkbox
                      >
                      <b-form-checkbox value="data_element"
                        >Data Element</b-form-checkbox
                      >
                      <b-form-checkbox value="datasets"
                        >Data Sets</b-form-checkbox
                      >
                    </b-form-checkbox-group>
                  </b-form-group> -->
                </div>
                <div class="d-flex">
                  <div variant="btn btn-light">
                    <!-- <ModalPopupStockOut title="Data Element"
                          deList={props.dataElementList.dataElements}
                          matrixList={props.matrixList} indIndex={index}
                          keyType={"methods"} getAllDEs={getAllDEs}
                          insideOf="stockOut" /> -->
                    <ModalPopup
                      title="Indicator"
                      :deList="indicatorList"
                      :matrixList="matrixList"
                      :indIndex="index"
                      keyType="methods"
                      @getAllDEs="getAllDEs"
                      insideOf="stockOut"
                    />
                  </div>
                  <div variant="btn btn-light">
                    <ModalPopup
                      title="Data Element"
                      :deList="dataElementList"
                      :matrixList="matrixList"
                      :indIndex="index"
                      keyType="methods"
                      @getAllDEs="getAllDEs"
                      insideOf="stockOut"
                    />
                  </div>
                  <div variant="btn btn-light">
                    <ModalPopup
                      title="Data Sets"
                      :deList="dataSetList"
                      :matrixList="matrixList"
                      :indIndex="index"
                      keyType="methods"
                      @getAllDEs="getAllDEs"
                      insideOf="stockOut"
                    />
                  </div>
                </div>
                <div>
                  <template v-for="(innObj, subind) in obj.selectedDE">
                    <div :key="subind" class="mt-3">
                      <label>{{ innObj.displayName }}</label>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <!-- <i
                        class="fa fa-trash delButton"
                        @click="deleteDe(index, innObj.id)"
                      ></i> -->
                      <img
                        src="@/assets/images/icons/admindelete-icon.svg"
                        :style="{ filter: filterColor }"
                        class="delButton w-auto"
                        @click="deleteDe(index, innObj.id)"
                      />
                      <br />
                    </div>
                  </template>
                </div>
              </b-form>
            </b-card-body>
          </b-collapse>
        </b-form>
      </div>
    </b-card>
    <b-card no-body class="mb-1 basic-header" v-if="tabType === 'Basic'">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button
          class="text-left"
          block
          v-b-toggle.methodmapping
          variant="info"
          >Period Settings</b-button
        >
      </b-card-header>
      <b-collapse
        id="methodmapping"
        visible
        accordion="methodmapping"
        role="tabpanel"
      >
        <b-card-body>
          <b-form class="accordion" role="tablist">
            <div>
              <div
                class="d-flex justify-content-between align-items-center my-3"
              >
                <div class="w-50">{{ $t("emu_initial_year_quest") }}</div>
                <b-form-input
                  class="w-50"
                  id="input-1"
                  v-model="config['stockOut'][indKey]['initialYear']"
                  type="number"
                  placeholder="Enter year"
                  required
                ></b-form-input>
              </div>
              <div
                class="d-flex justify-content-between align-items-center my-3"
              >
                <div class="w-50">{{ $t("periodFrequency") }}</div>
                <b-form-select
                  multiple
                  class="w-50"
                  v-model="config['stockOut'][indKey]['frequency']"
                  :options="periodOptions"
                  :select-size="4"
                ></b-form-select>
              </div>
              <div
                class="d-flex justify-content-between align-items-center my-3"
              >
                <div class="w-50">{{ $t("mostRecentYear") }}</div>
                <b-form-input
                  class="w-50"
                  id="input-1"
                  v-model="config['stockOut'][indKey]['finalYear']"
                  type="number"
                  placeholder="Enter year"
                  required
                ></b-form-input>
              </div>
              <div
                class="d-flex justify-content-between align-items-center my-3"
              >
                <div class="w-50">{{ $t("mostRecentYearMonth") }}</div>
                <b-form-input
                  class="w-50"
                  id="input-1"
                  v-model="config['stockOut'][indKey]['backTrackedYearMonth']"
                  type="text"
                  placeholder=""
                  required
                ></b-form-input>
              </div>
              <div
                class="d-flex justify-content-between align-items-center my-3"
              >
                <div class="w-50">{{ $t("backtrackingMonth") }}</div>
                <b-form-input
                  class="w-50"
                  id="input-1"
                  v-model="config['stockOut'][indKey]['backTrackingMonth']"
                  type="number"
                  required
                ></b-form-input>
              </div>
            </div>
          </b-form>
        </b-card-body>
      </b-collapse>
    </b-card>
    <b-card no-body class="mb-1 basic-header" v-if="tabType === 'Basic'">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button
          class="text-left"
          block
          v-b-toggle.outputdata
          variant="info"
          >{{ $t("outputDataSettings") }}</b-button
        >
      </b-card-header>
      <b-collapse id="outputdata" accordion="outputdata" role="tabpanel">
        <b-card-body>
          <div>
            <b-card no-body class="mb-1">
              <b-card-header
                header-tag="header"
                class="p-1 method-header"
                role="tab"
              >
                <b-button
                  class="text-left"
                  block
                  v-b-toggle.outputdatainner
                  variant="info"
                  >{{ $t("outputData") }}
                </b-button>
              </b-card-header>
              <b-collapse
                id="outputdatainner"
                visible
                accordion="outputdatainner"
                role="tabpanel"
              >
                <b-card-body>
                  <div
                    class="d-flex justify-content-between align-items-center my-3"
                  >
                    <div class="w-50">{{ $t("dataElementName") }}</div>
                    <div class="w-50 d-flex justify-content-between">
                      <b-form-input
                        class=""
                        id="input-1"
                        v-model="config.stockOut[indKey]['opDE']"
                        type="text"
                        placeholder="Enter Data Element Name"
                        required
                      ></b-form-input>
                      <b-button
                        class="btn btn-primary black-btn ml-2"
                        @click="saveDE('', false, 'opDE', 'Num')"
                        ><i class="fa fa-save delButton"></i
                      ></b-button>
                    </div>
                  </div>
                  <div
                    class="d-flex justify-content-between align-items-center my-3"
                  >
                    <div class="">{{ $t("displayName") }}</div>
                    <b-form-input
                      class="w-50"
                      id="input-1"
                      v-model="config.stockOut[indKey]['opDE_name']"
                      type="text"
                      placeholder="Enter Name"
                      required
                    ></b-form-input>
                  </div> </b-card-body></b-collapse
            ></b-card>
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">
                <b-button
                  class="text-left"
                  block
                  v-b-toggle.numerator
                  variant="info"
                  >{{ $t("numerator") }}
                </b-button>
              </b-card-header>
              <b-collapse
                id="numerator"
                visible
                accordion="numerator"
                role="tabpanel"
              >
                <b-card-body>
                  <div
                    class="d-flex justify-content-between align-items-center my-3"
                  >
                    <div class="w-50">{{ $t("dataElementName") }}</div>
                    <div class="w-50 d-flex justify-content-between">
                      <b-form-input
                        class=""
                        id="input-1"
                        v-model="config.stockOut[indKey]['numNameCount']"
                        type="text"
                        placeholder="Enter Data Element Name"
                        required
                      ></b-form-input>
                      <b-button
                        class="btn btn-primary black-btn ml-2"
                        @click="saveDE('', false, 'numNameCount', 'Num')"
                        ><i class="fa fa-save delButton"></i
                      ></b-button>
                    </div>
                  </div>
                  <div
                    class="d-flex justify-content-between align-items-center my-3"
                  >
                    <div class="">{{ $t("displayName") }}</div>
                    <b-form-input
                      class="w-50"
                      id="input-1"
                      v-model="config.stockOut[indKey]['numNameCount_name']"
                      type="text"
                      placeholder="Enter Name"
                      required
                    ></b-form-input>
                  </div> </b-card-body></b-collapse
            ></b-card>
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">
                <b-button
                  class="text-left"
                  block
                  v-b-toggle.denominator
                  variant="info"
                  >{{ $t("denominator") }}
                </b-button>
              </b-card-header>
              <b-collapse
                id="denominator"
                visible
                accordion="denominator"
                role="tabpanel"
              >
                <b-card-body>
                  <div
                    class="d-flex justify-content-between align-items-center my-3"
                  >
                    <div class="w-50">{{ $t("dataElementName") }}</div>
                    <div class="w-50 d-flex justify-content-between">
                      <b-form-input
                        class=""
                        id="input-1"
                        v-model="config.stockOut[indKey]['denomNameCount']"
                        type="text"
                        placeholder="Enter Data Element Name"
                        required
                      ></b-form-input>
                      <b-button
                        class="btn btn-primary black-btn ml-2"
                        @click="saveDE('', false, 'denomNameCount', 'Denom')"
                        ><i class="fa fa-save delButton"></i
                      ></b-button>
                    </div>
                  </div>
                  <div
                    class="d-flex justify-content-between align-items-center my-3"
                  >
                    <div class="">{{ $t("displayName") }}</div>
                    <b-form-input
                      class="w-50"
                      id="input-1"
                      v-model="config.stockOut[indKey]['denomNameCount_name']"
                      type="text"
                      placeholder="Enter Name"
                      required
                    ></b-form-input>
                  </div> </b-card-body></b-collapse
            ></b-card>
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1" role="tab">
                <b-button
                  class="text-left"
                  block
                  v-b-toggle.method
                  variant="info"
                  >{{ $t("methodData") }}
                </b-button>
              </b-card-header>
              <b-collapse
                id="method"
                visible
                accordion="method"
                role="tabpanel"
              >
                <b-card-body>
                  <div
                    class="d-flex justify-content-between align-items-center my-3"
                  >
                    <div class="w-50">{{ $t("KeywordMethodDataElement") }}</div>
                    <div class="w-50 d-flex justify-content-between">
                      <b-form-input
                        class=""
                        id="input-1"
                        v-model="config.stockOut[indKey]['methodKey']"
                        type="text"
                        placeholder="Enter keyword"
                        required
                      ></b-form-input>
                      <b-button
                        class="btn btn-primary black-btn ml-2"
                        @click="saveKey('methodKey')"
                        ><i class="fa fa-save delButton"></i
                      ></b-button>
                    </div>
                  </div> </b-card-body></b-collapse
            ></b-card>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>
    <b-button
      class="btn btn-primary black-btn float-right blue-btn mr-3 mt-3"
      id="show-btn"
      @click="saveJson"
      v-if="tabType !== 'Information'"
    >
      {{ $t("saveChanges") }}</b-button
    >
  </div>
</template>
<script>
import dataM from "./DataMassaging.js";
import ModalPopup from "./ModalPopup";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import service from "@/service";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
export default {
  props: [
    "config",
    "indKey",
    "dataElementList",
    "dataSetList",
    "matrixList",
    "indicatorList",
    "tabType",
    "categoryOptionID",
    "locOrgList",
  ],
  mixins: [DynamicImageMixin],
  components: { ModalPopup, Treeselect },
  data() {
    // console.log(this.orgList);

    return {
      periodOptions: [
        { value: "annual", text: "Annual" },
        { value: "monthly", text: "Monthly" },
      ],
      backTrackingMonth: 1,
      selectedNode: [],
      period: "",
      stockOutLoc: [],
      level: null,
      stPr: false,
      locIndex: -1,
      selectedLoc: null,
      repoRate: {},
      cocId: null,
      uploadDEJson: { dataValues: [] },
      modInput: null,
      updatedArr: null,
      countData: null,
      perCentArr: null,
    };
  },
  methods: {
    createDataElement(arr) {
      console.log(arr, "in createDataElement");
      if (arr && arr.length) {
        let yearArr = this.period.split(";");
        let actData = this.config,
          indKey = this.indKey;
        actData.stockOut[indKey]["methods"].map(async (ind, index) => {
          yearArr.forEach((yr) => {
            let indName = ind.static_name;
            // let deName = ind.deName;
            let deID = ind.dataElementId;
            this.makeJson(deID, yr, this.cocId, arr, this.selectedLoc, indName);
          });
        });

        this.stopProcessing();
      }
    },
    async startStockOut(eachLoc) {
      this.$store.commit("setLoading", true);
      let actData = this.config,
        indKey = this.indKey;
      let fnObj = {},
        repoObj = {};
      let firstN = 0,
        secondN = 0;
      //let finalArr = [];
      let DECount = 0;
      if (actData.stockOut[indKey]["methods"].length > 0) {
        actData.stockOut[indKey]["methods"].map(async (ind, index) => {
          let deArr = [],
            dName = [];
          DECount = DECount + ind["selectedDE"].length;
          ind["selectedDE"].forEach((sde) => {
            deArr.push(sde["id"]);
            dName.push({
              [sde["id"]]: sde["displayName"],
            });
          });
          let sdes = deArr.join(";");
          let indName = ind.name;
          let st_name = ind.static_name;
          //   console.log(indName, sdes);
          if (deArr.length) {
            firstN++;
            await service
              .getIndicatorData(sdes, [5], eachLoc.split("/")[1], this.period)
              .then((response) => {
                this.$store.commit("setLoading", true);
                console.log("period wise response", response);
                secondN++;
                if (response.data.rows.length > 0) {
                  Object.keys(dName).forEach((d) => {
                    response.data.rows.forEach((row) => {
                      let oRow = dName[d][row[0]];
                      //   console.log(oRow);
                      if (oRow) {
                        // finalData['Province'] = loc.split("/")[1]
                        //finalData["Facility"] = row[2];
                        if (!fnObj[row[2]]) fnObj[row[2]] = {};

                        if (!fnObj[row[2]][st_name])
                          fnObj[row[2]][st_name] = {};
                        fnObj[row[2]][st_name][row[1]] =
                          (fnObj[row[2]][st_name][row[1]] || 0) + row[3] * 1;
                      }
                    });
                  });
                } else {
                  console.log("Data is empty for method " + indName);
                }
                this.$store.commit("setLoading", false);
              });

            if (firstN === secondN) {
              console.log("fnObj ", JSON.parse(JSON.stringify(fnObj)));
              this.modInput = JSON.parse(JSON.stringify(fnObj));
              this.calcUpdatedArr();
              // this.$set(this.modInput, fnObj);
            }
          } else {
            console.log("Mapping is not found for method " + indName);
          }
        });
        if (DECount === 0) {
          this.$store.commit("setLoading", false);
          this.sweetAlert({
            title: this.$i18n.t("error5"),
          });
        }
      } else {
        this.$store.commit("setLoading", false);
        this.sweetAlert({
          title: this.$i18n.t("error6"),
        });
      }
      let firstN1 = 0,
        secondN1 = 0;
      if (actData.stockOut[indKey]["repoRate"].length > 0) {
        actData.stockOut[indKey]["repoRate"].map(async (ind, index) => {
          let deArr = [],
            dName = [];
          ind["selectedDE"].forEach((sde) => {
            deArr.push(sde["id"]);
            dName.push({
              [sde["id"]]: sde["displayName"],
            });
          });
          let sdes = deArr.join(";");
          let indName = ind.name;
          let st_name = ind.static_name;
          //   console.log(indName, sdes);
          if (deArr.length) {
            firstN1++;
            await service
              .getIndicatorData(sdes, [5], eachLoc.split("/")[1], this.period)
              .then((response) => {
                this.$store.commit("setLoading", true);
                secondN1++;
                if (response.data.rows.length > 0) {
                  Object.keys(dName).forEach((d) => {
                    response.data.rows.forEach((row) => {
                      let oRow = dName[d][row[0]];
                      //   console.log(oRow);
                      if (oRow) {
                        // finalData['Province'] = loc.split("/")[1]
                        //finalData["Facility"] = row[2];
                        if (!repoObj[row[2]]) repoObj[row[2]] = {};
                        if (!repoObj[row[2]][st_name])
                          repoObj[row[2]][st_name] = {};
                        repoObj[row[2]][st_name][row[1]] =
                          (repoObj[row[2]][st_name][row[1]] || 0) + row[3] * 1;
                      }
                    });
                  });
                } else {
                  console.log("Data is empty for method " + indName);
                }
                this.$store.commit("setLoading", false);
              });

            if (firstN1 === secondN1) {
              //   console.log("fnObj ", JSON.parse(JSON.stringify(fnObj)));
              this.repoRate = JSON.parse(JSON.stringify(repoObj));
            }
          } else {
            console.log("Mapping is not found for method " + indName);
            this.repoRate = {};
          }
        });
      } else {
        this.$store.commit("setLoading", false);
        this.sweetAlert({
          title: this.$i18n.t("error7"),
        });
      }
    },
    startProcess() {
      console.log("calling startProess", this.locIndex, this.stPr);
      this.stPr = true;
      let index = this.locIndex * 1 + 1;
      this.locIndex = index;
    },
    closeLoc() {
      if (this.selectedNode && this.selectedNode.length) {
        let arr = [];
        this.selectedNode.forEach((id) => {
          this.level = null;
          this.getLevel(this.computedLocList, id);
          console.log("level", this.level);
          if (this.level) arr.push(this.level + "/" + id);
        });
        this.config.stockOut[this.indKey]["locArr"] = arr;
        this.stockOutLoc = arr;
        this.saveJson();
      }
      this.$refs["my-modal"].hide();
    },
    openLoc() {
      this.$refs["my-modal"].show();
    },
    hideModal() {
      this.$refs["my-modal"].hide();
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
    assignChecked(mainObj, obj, remObj) {
      return mainObj.map((root) => {
        if (root.id === remObj.id) {
          ////console.log(root.checked, remObj.checked)
          root.checked = remObj.checked;
        }
        if (root.id === obj.id) {
          root.checked = true;
        }
        if (root.children) {
          root.children = this.assignChecked(root.children, obj, remObj);
          // for (var k in root.children) {
          //     if (root.children[k].id === remObj.id) {
          //         ////console.log("in children", root.checked, remObj.checked)
          //         root.children[k].checked = remObj.checked
          //     }
          //     if (root.children[k].id === obj.id) {
          //         root.children[k].checked = true
          //     }
          //     if (root.children[k].length) {
          //         root.children[k] = assignChecked(root.children[k], obj, remObj);
          //     }
          // }
        }
        return root;
      });
    },
    saveKey(keyName) {
      // setIsLoading(true);

      let getData = this.config;
      let mKey = getData.stockOut[indKey][keyName];
      if (getData.stockOut[indKey]["methods"].length) {
        getData.stockOut[indKey]["methods"].map((ind, index) => {
          let newKey = ind.static_name + "_" + mKey;
          getData.stockOut[indKey]["methods"][index]["deName"] = newKey;
        });
      }
      this.config = getData;
      this.updateDataIds();
      this.saveJson();
    },
    async updateDataIds() {
      let actData = this.config;
      let indKey = this.indKey;
      let methodName = "",
        deID = "",
        deName = "";
      // let IDKey = deKey + "_ID";

      let deList = this.dataElementList;
      actData.stockOut[indKey]["methods"].map(async (ind, index) => {
        methodName = ind.name;
        deID = ind.dataElementId;
        deName = ind.deName;
        console.log(deName, deID, "Data Element Name");
        if (!deName || deName === "") {
          // setIsLoading(false);

          this.sweetAlert({
            title: this.$i18n.t("error8"),
          });
        } else {
          let isExistDEArId = deList.filter((obj) => {
            return obj["id"] === deID;
          });
          console.log(isExistDEArId, "isExistDEArId");
          if (isExistDEArId.length) {
            await service.getOrgLevels().then((orgResp) => {
              this.$store.commit("setLoading", true);
              if (orgResp.data && orgResp.data.organisationUnitLevels.length) {
                let orgLevels = [];
                orgResp.data.organisationUnitLevels.forEach((oj) => {
                  if (!orgLevels.includes(oj.level)) orgLevels.push(oj.level);
                });
                //console.log("create ID");
                let createJson = {
                  aggregationType: "SUM",
                  domainType: "AGGREGATE",
                  valueType: "NUMBER",
                  name: deName,
                  shortName: deName,
                  categoryCombo: { id: this.categoryOptionID },
                  legendSets: [],
                  aggregationLevels: orgLevels,
                  id: isExistDEArId[0]["id"],
                };
                service.updateDE(createJson).then((resp) => {
                  this.$store.commit("setLoading", true);
                  if (
                    resp.data.status === "OK" &&
                    resp.data.httpStatus === "OK"
                  ) {
                    // actData.stockOut[indKey]["methods"][index]["dataElementId"] =
                    //   resp.data.response["uid"];

                    this.config = actData;
                    //saveJson();
                  }
                  this.$store.commit("setLoading", false);
                });
              }
              this.$store.commit("setLoading", false);
            });
          } else {
            let isExistDEAr = deList.filter((obj) => {
              return obj["displayName"] === deName;
            });
            console.log(isExistDEAr, "isExistDEAr");
            if (isExistDEAr.length) {
              //console.log("Data Element already exist", isExistDEAr);
              actData.stockOut[indKey]["methods"][index]["dataElementId"] =
                isExistDEAr[0]["id"];

              // actData.stockOut[indKey]["methods"][index]["dataElementId"] =
              // isExistDEAr[0]["id"];
              this.config = actData;
              //saveJson();
            } else {
              await service.getOrgLevels().then((orgResp) => {
                this.$store.commit("setLoading", true);
                if (
                  orgResp.data &&
                  orgResp.data.organisationUnitLevels.length
                ) {
                  let orgLevels = [];
                  orgResp.data.organisationUnitLevels.forEach((oj) => {
                    if (!orgLevels.includes(oj.level)) orgLevels.push(oj.level);
                  });
                  //console.log("create ID");
                  let createJson = {
                    aggregationType: "SUM",
                    domainType: "AGGREGATE",
                    valueType: "NUMBER",
                    name: deName,
                    shortName: deName,
                    categoryCombo: { id: this.categoryOptionID },
                    legendSets: [],
                    aggregationLevels: orgLevels,
                  };
                  service.createDE(createJson).then((resp) => {
                    this.$store.commit("setLoading", true);
                    if (
                      resp.data.status === "OK" &&
                      resp.data.httpStatus === "Created"
                    ) {
                      actData.stockOut[indKey]["methods"][index][
                        "dataElementId"
                      ] = resp.data.response["uid"];

                      this.config = actData;
                      // saveJson();
                    }
                    this.$store.commit("setLoading", false);
                  });
                }
                this.$store.commit("setLoading", false);
              });
            }
          }
        }
      });
    },
    async saveDE(index, methodDE = true, deKey, deType) {
      let _this = this;
      console.log("saveDE called", index, index, methodDE, deKey, deType);
      this.$store.commit("setLoading", true);
      let actData = _this.config;
      let indKey = _this.indKey;
      let methodName = "",
        deID = "",
        deName = "";
      let IDKey = deKey + "_ID";

      let deList = this.dataElementList;

      if (methodDE) {
        let ind = actData.stockOut[indKey]["methods"][index];
        methodName = ind.name;
        deID = ind.dataElementId;
        deName = ind.deName;
      } else {
        deID = actData.stockOut[indKey][IDKey];
        deName = actData.stockOut[indKey][deKey];
      }
      console.log(deName, deID, "Data Element Name");
      if (!deName || deName === "") {
        // setIsLoading(false);

        this.sweetAlert({
          title: this.$i18n.t("error8"),
        });
      } else {
        let isExistDEArId = deList.filter((obj) => {
          return obj["id"] === deID;
        });
        console.log(isExistDEArId, "isExistDEArId");
        if (isExistDEArId.length) {
          await service.getOrgLevels().then((orgResp) => {
            this.$store.commit("setLoading", true);
            if (orgResp.data && orgResp.data.organisationUnitLevels.length) {
              let orgLevels = [];
              orgResp.data.organisationUnitLevels.forEach((oj) => {
                if (!orgLevels.includes(oj.level)) orgLevels.push(oj.level);
              });
              //console.log("create ID");
              let createJson = {
                aggregationType: "SUM",
                domainType: "AGGREGATE",
                valueType: "NUMBER",
                name: deName,
                shortName: deName,
                categoryCombo: { id: this.categoryOptionID },
                legendSets: [],
                aggregationLevels: orgLevels,
                id: isExistDEArId[0]["id"],
              };
              service.updateDE(createJson).then((resp) => {
                this.$store.commit("setLoading", true);
                if (
                  resp.data.status === "OK" &&
                  resp.data.httpStatus === "OK"
                ) {
                  if (methodDE) {
                    actData.stockOut[indKey]["methods"][index][
                      "dataElementId"
                    ] = resp.data.response["uid"];
                  } else {
                    actData.stockOut[indKey][IDKey] = isExistDEArId[0]["id"];
                  }
                  _this.config = actData;
                  _this.saveJson();
                }
              });
              this.$store.commit("setLoading", false);
            }
            this.$store.commit("setLoading", false);
          });
        } else {
          let isExistDEAr = deList.filter((obj) => {
            return obj["displayName"] === deName;
          });
          console.log(isExistDEAr, "isExistDEAr");
          if (isExistDEAr.length) {
            //console.log("Data Element already exist", isExistDEAr);
            if (methodDE) {
              actData.stockOut[indKey]["methods"][index]["dataElementId"] =
                isExistDEAr[0]["id"];
            } else {
              actData.stockOut[indKey][IDKey] = isExistDEAr[0]["id"];
            }
            // actData.stockOut[indKey]["methods"][index]["dataElementId"] =
            // isExistDEAr[0]["id"];
            _this.config = actData;
            _this.saveJson();
          } else {
            await service.getOrgLevels().then((orgResp) => {
              this.$store.commit("setLoading", true);
              if (orgResp.data && orgResp.data.organisationUnitLevels.length) {
                let orgLevels = [];
                orgResp.data.organisationUnitLevels.forEach((oj) => {
                  if (!orgLevels.includes(oj.level)) orgLevels.push(oj.level);
                });
                //console.log("create ID");
                let createJson = {
                  aggregationType: "SUM",
                  domainType: "AGGREGATE",
                  valueType: "NUMBER",
                  name: deName,
                  shortName: deName,
                  categoryCombo: { id: this.categoryOptionID },
                  legendSets: [],
                  aggregationLevels: orgLevels,
                };
                service.createDE(createJson).then((resp) => {
                  this.$store.commit("setLoading", true);
                  if (
                    resp.data.status === "OK" &&
                    resp.data.httpStatus === "Created"
                  ) {
                    if (methodDE) {
                      actData.stockOut[indKey]["methods"][index][
                        "dataElementId"
                      ] = resp.data.response["uid"];
                    } else {
                      actData.stockOut[indKey][IDKey] =
                        resp.data.response["uid"];
                    }
                    _this.config = actData;
                    _this.saveJson();
                  }
                  this.$store.commit("setLoading", false);
                });
              }
              this.$store.commit("setLoading", false);
            });
          }
        }
      }
      // }
      // });
    },
    updateConfigValues($event, key) {
      console.log($event, key);
      let actD = config;
      actD["stockOut"][this.indKey][key] = $event.target.value;
      this.config = actD;
    },
    saveJson() {
      this.$store.commit("setLoading", true);
      let key = this.generateKey("stockOut");
      service
        .updateConfig({
          data: this.config,
          tableKey: key,
          namespace: "fp-dashboard",
        })
        .then((resp) => {
          if (resp.data.status === "OK") {
            this.$store.commit("setLoading", false);
            this.sweetAlert({
              title: this.$i18n.t("updateSuccessful"),
            });
          }
        })
        .catch((err) => {
          service
            .saveConfig({
              data: this.config,
              tableKey: key,
              namespace: "fp-dashboard",
            })
            .then((resp) => {
              if (resp.data.status === "OK") {
                this.$store.commit("setLoading", false);
                this.sweetAlert({
                  title: this.$i18n.t("data_saved_successfully"),
                });
              }
            })
            .catch((er) => {
              this.$store.commit("setLoading", false);
              this.sweetAlert({
                title: this.$i18n.t("error2"),
              });
            });
        });
    },
    deleteDe(index, id) {
      let getData = this.config;
      let arr = getData.stockOut[this.indKey]["methods"][index]["selectedDE"];
      arr.forEach((de, ind) => {
        if (de["id"] === id) {
          arr.splice(ind, 1);
        }
      });
      getData.stockOut[this.indKey]["methods"][index]["selectedDE"] = arr;
      this.config = getData;
    },
    addMethod(typeKey) {
      // e.preventDefault();
      console.log("added Method");
      let mainData = this.config;
      mainData.stockOut[this.indKey][typeKey].push({
        de: [],
        name: "IND Method",
        deName: this.indKey + "_IND Method",
        selectedDE: [],
        type: "data_element",
        static_name: "IND Method",
      });
      this.config = mainData;
    },
    deleteMethod(methodIndex) {
      let actData = this.config;
      // console.log(methodIndex, "methodIndex");
      let arr = actData.stockOut[this.indKey]["methods"];
      arr.splice(methodIndex, 1); //to remove method
      actData.stockOut[this.indKey]["methods"] = arr;
      this.config = actData;
    },
    stopProcessing() {
      this.stPr = false;
      this.modInput = null;
      this.updatedArr = null;
      this.countData = null;
      this.perCentArr = null;
      //setSelectedLoc();
      this.startProcess();
      // let index = locIndex * 1 + 1;
      // // console.log("startpROCESS", locIndex, index);
      // setLocIndex(index);
    },
    makeJson(actDEID, yr, cocId, finalArr, selectedLoc, indName) {
      // console.log("Calling makeJson", finalArr);
      //console.log(actDEID, period, cocId, finalArr, selectedLoc, indName);
      let finalJson = this.uploadDEJson;

      let innerObj = {
        dataElement: actDEID,
        period: yr,
        orgUnit: selectedLoc.split("/")[1],
        categoryOptionCombo: cocId, //"HllvX50cXC0"
        attributeOptionCombo: cocId,
        value: finalArr[0]["percent"][indName][yr],
      };
      finalJson["dataValues"].push(innerObj);
      this.uploadDEJson = finalJson;
    },
    getAllDEs(val, index, keyType, title, insideOf) {
      console.log("getAlldes", val, index, keyType, title, insideOf);
      // updateDEs(val, index, keyType);
      // updateSubInd(index, subindex, "selectedDE", val);
      //setElementType([index, title, insideOf]);
      let actData = this.config;
      let ar = actData.stockOut[this.indKey][keyType][index]["selectedDE"];
      actData.stockOut[this.indKey][keyType][index]["selectedDE"] = [
        ...ar,
        val,
      ];
      if (title === "Indicator") {
        actData[insideOf][this.indKey]["methods"][index]["type"] = "indicator";
      } else if (title === "Data Element") {
        actData[insideOf][this.indKey]["methods"][index]["type"] =
          "data_element";
      } else if (title === "Data Sets") {
        actData[insideOf][this.indKey]["methods"][index]["type"] = "data_sets";
      }

      this.config = actData;
    },
    async DEUpdate(json) {
      console.log("calling DEUpdate");
      if (json && json["dataValues"].length > 0) {
        await service
          .uploadJson(json)
          .then((resp) => {
            ////console.log(resp);
            if (resp.data.status === "OK") {
              return resp;
            } else {
              // this.sweetAlert({
              //   title: "Include condom Data not imported successfully. Please try again later.",
              // }).then(() => {
              //   //handleClose()
              // });
            }
          })
          .then((resp) => {
            this.$store.commit("setLoading", true);
            let uploadID = resp.data.response["id"];
            service
              .showTask(uploadID)
              .then((tResp) => {
                return tResp;
              })
              .then(() => {
                service.showTaskSumm(uploadID).then((taskResp) => {
                  ////console.log(taskResp);
                  if (
                    taskResp.data.status === "SUCCESS" ||
                    taskResp.data.status === "WARNING"
                  ) {
                    this.stopProcessing();
                    this.uploadDEJson = { dataValues: [] };
                    this.sweetAlert({
                      title: this.$i18n.t("success1"),
                    });
                  } else {
                    this.stopProcessing();
                    this.uploadDEJson = { dataValues: [] };
                    this.sweetAlert({
                      title: this.$i18n.t("error4"),
                    });
                  }
                });
              });
            this.$store.commit("setLoading", false);
          })
          .catch((err) => {
            this.$store.commit("setLoading", false);
            //console.log(err);
          });
      }
    },
    calcPercentArr() {
      let arr3 = this.countData;
      if (arr3 && this.stPr) {
        let yearArr = this.period.split(";");
        arr3.forEach((obj) => {
          const proPerCent = {};
          Object.keys(obj).forEach((method) => {
            // console.log(obj, "percentarr obj");
            yearArr.forEach((yr) => {
              if (
                method !== "TotalFacilitiesReported" &&
                method !== "Province" &&
                method !== "AnyOfferFP"
              ) {
                if (!proPerCent[`${method}`]) proPerCent[`${method}`] = {};
                let per = (
                  (obj[method][yr] / obj["TotalFacilitiesReported"][yr]) *
                  100
                ).toFixed(2);
                proPerCent[`${method}`][yr] = per;
              }
              if (method === "AnyOfferFP") {
                if (!proPerCent[`${"AnyOfferFP"}`])
                  proPerCent[`${"AnyOfferFP"}`] = {};
                let per = (
                  (obj["AnyOfferFP"][yr] / obj["TotalFacilitiesReported"][yr]) *
                  100
                ).toFixed(2);
                proPerCent[`${"AnyOfferFP"}`][yr] = per;
              }
            });
            //if (!obj["percent"]) obj["percent"] = {};
          });
          obj["percent"] = proPerCent;
        });
      }
      this.percentArr = arr3;
      this.createDataElement(arr3);
      // this.stopProcessing();
    },
    calcCountData() {
      console.log("calling countdata");
      let arr2 = this.updatedArr;
      let countArr = [];
      let provinceObj = {};
      if (this.selectedLoc && this.updatedArr && this.stPr) {
        let prName = this.selectedLoc.split("/")[1];
        let yearArr = this.period.split(";");
        yearArr.forEach((yr) => {
          this.config.stockOut[this.indKey]["methods"].forEach((ind) => {
            let method = ind["static_name"];
            if (!provinceObj[method]) provinceObj[method] = {};
            let sumVal = Object.keys(arr2).reduce((accumulator, key) => {
              return (
                accumulator * 1 +
                (arr2[key][method] && arr2[key][method][yr]
                  ? arr2[key][method][yr] * 1
                  : 0)
              );
            }, 0);
            provinceObj[method][yr] = sumVal;
          });
          let sumOfOfferFp = Object.keys(arr2).reduce((accumulator, key) => {
            return (
              accumulator * 1 +
              (arr2[key]["AnyOfferFP"] && arr2[key]["AnyOfferFP"][yr]
                ? arr2[key]["AnyOfferFP"][yr] * 1
                : 0)
            );
          }, 0);
          let sumAnyReports = Object.keys(arr2).reduce((accumulator, key) => {
            return (
              accumulator * 1 +
              (arr2[key]["AnyReports"] && arr2[key]["AnyReports"][yr]
                ? arr2[key]["AnyReports"][yr] * 1
                : 0)
            );
          }, 0);
          provinceObj["Province"] = prName;
          if (!provinceObj["AnyOfferFP"]) provinceObj["AnyOfferFP"] = {};
          provinceObj["AnyOfferFP"][yr] = sumOfOfferFp;
          if (!provinceObj["TotalFacilitiesReported"])
            provinceObj["TotalFacilitiesReported"] = {};
          provinceObj["TotalFacilitiesReported"][yr] = sumAnyReports;
        });
      }
      countArr.push(provinceObj);
      // console.log("in countArr", countArr);
      // return countArr;
      this.countData = countArr;
      this.calcPercentArr();
    },
    calcUpdatedArr() {
      console.log("calling this.modInput in computed", this.modInput);
      if (this.modInput && this.stPr) {
        let arr = this.modInput;
        let config = this.config,
          indKey = this.indKey;
        Object.keys(arr).map((obj) => {
          let calculatedVal = {};
          let innerObj = arr[obj];
          let yearArr = this.period.split(";");
          yearArr.forEach((yr) => {
            calculatedVal[yr] = 0;
            config.stockOut[indKey]["methods"].forEach((method) => {
              let methodName = method["static_name"];
              // console.log(innerObj, methodName, yr);
              if (!innerObj[methodName]) innerObj[methodName] = {};
              let actval =
                innerObj[methodName] && innerObj[methodName][yr]
                  ? innerObj[methodName][yr]
                  : 0;
              calculatedVal[yr] = calculatedVal[yr] + actval * 1;
              innerObj[methodName][yr] = actval < 1 ? 0 : 1;
            });
            if (!innerObj["AnyFPServices"]) innerObj["AnyFPServices"] = {};
            if (!innerObj["AnyReports"]) innerObj["AnyReports"] = {};
            if (!innerObj["AnyOfferFP"]) innerObj["AnyOfferFP"] = {};
            innerObj["AnyFPServices"][yr] = calculatedVal[yr] < 1 ? 0 : 1;
            innerObj["AnyReports"][yr] = 0;
            //innerObj["AnyReports"] = Math.floor(Math.random() * (max - min + 1)) + min; //mapping is notthere so random number between 0 and 1
            config.stockOut[indKey]["repoRate"].forEach((method) => {
              innerObj["AnyReports"][yr] =
                this.repoRate[method] && this.repoRate[method][yr] < 1 ? 0 : 1;
            });
            // innerObj["AnyReports"] = 1; //as we have data for all methods it will be 1
            innerObj["AnyOfferFP"][yr] =
              innerObj["AnyReports"][yr] !== 0 &&
              innerObj["AnyFPServices"][yr] !== 0
                ? 1
                : 0;
          });
          //   let max = 1,
          //     min = 0;

          return innerObj;
        });
        console.log("updaedArr", arr);
        this.updatedArr = arr;
        this.calcCountData();
      }
    },
  },
  computed: {
    computedLocList() {
      console.log(this.locOrgList);
      return this.locOrgList;
    },
  },
  created() {
    this.$store.commit("setLoading", false);
    this.selectedNode = this.config["stockOut"][this.indKey]["locArr"].map(
      (obj) => {
        if (obj.split("/").length > 0) return obj.split("/")[1];
        // else return obj;
      }
    );
    this.stockOutLoc = this.config.stockOut[this.indKey]["locArr"];
    let curr_date = this.$moment().format("YYYY-MM");
    let iYear = this.config.stockOut[this.indKey]["initialYear"] * 1;
    let months = this.config.stockOut[this.indKey]["backTrackingMonth"] * 1;
    let fYear1 = this.$moment(curr_date, "YYYY-MM")
      .subtract(months, "months")
      .format("YYYY");
    let yearStr = dataM.getYearFormated(iYear, fYear1);
    this.period = yearStr;
    service.getCategoryOptionCombo("default").then((resp) => {
      if (resp.data) {
        let catIdArr = resp.data.categoryOptionCombos.filter((obj) => {
          return obj["displayName"] === "default";
        });
        if (catIdArr.length) {
          let cocId_t = catIdArr[0]["id"];
          this.cocId = cocId_t;
        }
      }
    });
  },
  mounted() {},
  watch: {
    selectedLoc(loc) {
      if (loc != "") {
        console.log("location for stockout ", loc);
        this.startStockOut(loc);
      }
    },
    locIndex(newVal) {
      console.log("in locIndex watch", newVal, this.stockOutLoc);
      if (this.stPr && this.stockOutLoc && this.stockOutLoc.length === 0) {
        this.sweetAlert({
          title: this.$i18n.t("error3"),
        });
      } else if (
        newVal > -1 &&
        newVal < this.stockOutLoc.length &&
        this.stockOutLoc
      ) {
        this.selectedLoc = "";
        let eachLoc = this.stockOutLoc[newVal];
        this.selectedLoc = eachLoc;
        //console.log(eachLoc, locIndex, stockOutLoc, "location for stockOut");
      } else if (this.stockOutLoc && newVal >= this.stockOutLoc.length) {
        //this.locIndex = -1;
        this.selectedLoc = "";
        // setIsLoading(false);
        console.log(this.uploadDEJson, "in locIndex watch");
        let json = this.uploadDEJson;
        this.DEUpdate(json);
        //setUploadDEJson()
      }
    },
    backTrackingMonth(newVal) {
      console.log(newVal);
      if (newVal) {
        this.config["stockOut"][this.indKey]["backTrackingMonth"] = newVal;
      }
    },
    // updatedLocArr(arr) {
    //   console.log(this.updatedLocArr, arr, "in watcher");
    //   if (arr && arr.length)
    //     this.config["stockOut"][this.indKey]["locArr"] = arr;
    //   console.log("in comuted", arr);
    // },
  },
};
</script>
