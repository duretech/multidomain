<template>
  <div class="md_tabs py-3">
    <b-card no-body class="p-3">
      <b-card v-if="this.type === 'BackgroundData'">
        <div>
          <h4>Background Indicators Set-up</h4>
        </div>
        <div class="accordion" role="tablist">
          <b-form
            no-body
            class="mb-1"
            :key="index1"
            v-for="(obj, index1) in this.dqrConfig.emu.Background_Data
              .backgroundIndicators"
          >
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button
                block
                v-b-toggle="'accordion-' + index1"
                variant="info"
                >{{ obj.static_name }}</b-button
              >
            </b-card-header>
            <b-collapse
              :id="'accordion-' + index1"
              visible
              accordion="accordian-backgroundData"
              role="tabpanel"
            >
              <b-card-body>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="w-50">Data Source</div>
                  <b-form-select
                    class="w-50"
                    v-model="obj.bgDataSource"
                    :options="form.dataSource"
                  ></b-form-select>
                </div>
                <div
                  no-body
                  class="mb-1"
                  :key="index2"
                  v-for="(ele, index2) in obj.subIndicators"
                >
                  <div v-if="obj.bgDataSource === 'Datasets'">
                    <div class="my-3">
                      <b-form-group
                        label="Mapping"
                        :v-slot="`ariaDescribedby_${index2} `"
                      >
                        <div class="d-flex">
                          <b-form-radio
                            readOnly
                            v-model="ele.type"
                            :aria-describedby="`ariaDescribedby_${index2} `"
                            :name="`secondRadio_${index2}`"
                            value="indicator"
                            class="mr-3"
                            
                            >Indicator</b-form-radio
                          >
                          <b-form-radio
                            readOnly
                            v-model="ele.type"
                            :aria-describedby="`ariaDescribedby_${index2} `"
                            :name="`secondRadio_${index2}`"
                            value="data_element"
                            class="mx-3"
                            
                            >Data Element</b-form-radio
                          >
                          <b-form-radio
                            readOnly
                            v-model="ele.type"
                            :aria-describedby="`ariaDescribedby_${index2} `"
                            :name="`secondRadio_${index2}`"
                            value="data_sets"
                            class="mx-3"
                            
                            >Data Sets</b-form-radio
                          >
                        </div>
                      </b-form-group>
                    </div>
                    <div class="d-flex">
                      <div>
                        <ModalPopup
                          title="Indicator"
                          :deList="indicatorList"
                          :matrixList="matrixList"
                          :indIndex="index1"
                          :subIndIndex="index2"
                          keyType="methods"
                          @getAllDEs="getAllDEs"
                          insideOf="backgroundIndicators"
                          emuType="emu"
                        />
                      </div>
                      <div>
                        <ModalPopup
                          title="Data Element"
                          :deList="dataElementList"
                          :matrixList="matrixList"
                          :indIndex="index1"
                          :subIndIndex="index2"
                          keyType="methods"
                          @getAllDEs="getAllDEs"
                          insideOf="backgroundIndicators"
                          emuType="emu"
                        />
                      </div>
                      <div>
                        <ModalPopup
                          title="Data Sets"
                          :deList="dataSetList"
                          :matrixList="matrixList"
                          :indIndex="index1"
                          :subIndIndex="index2"
                          keyType="methods"
                          @getAllDEs="getAllDEs"
                          insideOf="backgroundIndicators"
                          emuType="emu"
                        />
                      </div>
                    </div>
                    <div :key="index4" v-for="(dE, index4) in ele.selectedDE">
                      <div>
                        {{ dE.displayName }}
                        <i
                          class="fa fa-trash delButton"
                          @click="deleteDe( `emu` , `backgroundIndicators` , index1, index2, dE.id)"
                        ></i>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="obj.bgDataSource === 'Datastore'">
                    <div
                      :key="index4"
                      v-for="(dE, index4) in ele.selectedDatastoreDE"
                    >
                      <div>{{ dE.displayName }}</div>
                      <DataEntry
                        :dataEntryId="dE.id"
                        :orgList="orgList"
                        :bgDataType="
                          dqrConfig.emu.Background_Data.FPWomenPopulation
                        "
                        type="this.type"
                      />
                    </div>
                  </div>
                </div>
              </b-card-body>
            </b-collapse>
          </b-form>
        </div>
        <div class="accordion" role="tablist">
          <b-form no-body class="mb-1">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button block v-b-toggle.accordion-annualFpSource variant="info"
                >ANNUAL - FP SOURCE OF MODERN CONTRACEPTIVE</b-button
              >
            </b-card-header>
            <b-collapse
              id="accordion-annualFpSource"
              accordion="accordian-backgroundData"
              role="tabpanel"
            >
              <b-card-body>
                <b-form>
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <div class="w-50">Data Source:</div>
                    <b-form-select
                      class="w-50"
                      v-model="dqrConfig.emu.Background_Data.bgDataSource"
                      :options="form.dataSource"
                    ></b-form-select>
                  </div>

                  <div
                    :key="index2"
                    v-for="(obj, mName1, index2) in this.dqrConfig.emu
                      .Background_Data.fpSourceIndicators"
                  >
                    <h6>{{ obj.static_name }}</h6>
                    <b-form
                      no-body
                      class="mb-1"
                      :key="index3"
                      v-for="(ele, mName2, index3) in obj.subIndicators"
                    >
                      <b-card-header header-tag="header" class="p-1" role="tab">
                        <b-button
                          block
                          v-b-toggle="'accordion-annual' + mName1 + mName2"
                          variant="info"
                          >{{ ele.name }}</b-button
                        >
                      </b-card-header>
                      <b-collapse
                        :id="'accordion-annual' + mName1 + mName2"
                        accordion="my-accordion-fpSourceIndicators"
                        role="tabpanel"
                      >
                        <div
                          v-if="
                            dqrConfig.emu.Background_Data.bgDataSource ===
                            'Datasets'
                          "
                        >
                          <div class="my-3">
                            <b-form-group
                              label="Mapping"
                              v-slot="{ ariaDescribedby }"
                            >
                              <div class="d-flex">
                                <b-form-radio
                                  readOnly
                                  v-model="ele.type"
                                  :aria-describedby="ariaDescribedby"
                                  name="some-radios"
                                  value="indicator"
                                  class="mr-3"
                                  
                                  >Indicator</b-form-radio
                                >
                                <b-form-radio
                                  readOnly
                                  v-model="ele.type"
                                  :aria-describedby="ariaDescribedby"
                                  name="some-radios"
                                  value="data_element"
                                  class="mx-3"
                                  
                                  >Data Element</b-form-radio
                                >
                                <b-form-radio
                                  readOnly
                                  v-model="ele.type"
                                  :aria-describedby="ariaDescribedby"
                                  name="some-radios"
                                  value="data_sets"
                                  class="mx-3"
                                  
                                  >Data Sets</b-form-radio
                                >
                              </div>
                            </b-form-group>
                          </div>
                          <div class="d-flex">
                            <div>
                              <ModalPopup
                                title="Indicator"
                                :deList="indicatorList"
                                :matrixList="matrixList"
                                :indIndex="mName1"
                                :subIndIndex="mName2"
                                keyType="methods"
                                @getAllDEs="getAllDEs"
                                insideOf="fpSourceIndicators"
                                emuType="emu"
                              />
                            </div>
                            <div>
                              <ModalPopup
                                title="Data Element"
                                :deList="dataElementList"
                                :matrixList="matrixList"
                                :indIndex="mName1"
                                :subIndIndex="mName2"
                                keyType="methods"
                                @getAllDEs="getAllDEs"
                                insideOf="fpSourceIndicators"
                                emuType="emu"
                              />
                            </div>
                            <div>
                              <ModalPopup
                                title="Data Sets"
                                :deList="dataSetList"
                                :matrixList="matrixList"
                                :indIndex="mName1"
                                :subIndIndex="mName2"
                                keyType="methods"
                                @getAllDEs="getAllDEs"
                                insideOf="fpSourceIndicators"
                                emuType="emu"
                              />
                            </div>
                          </div>
                          <div
                            :key="index4"
                            v-for="(dE, index4) in ele.selectedDE"
                          >
                            <div>
                              {{ dE.displayName }}
                              <i
                                class="fa fa-trash delButton"
                                @click="deleteDe( `emu` , `fpSourceIndicators` , mName1, mName2, dE.id)"
                              ></i>
                            </div>
                          </div>
                        </div>
                        <div
                          v-else-if="
                            dqrConfig.emu.Background_Data.bgDataSource ===
                            'Datastore'
                          "
                        >
                          <b-form
                            :key="index"
                            v-for="(item, index) in ele.selectedDatastoreDE"
                          >
                            <div>{{ item.displayName }}</div>
                            <DataEntry
                              :dataEntryId="item.id"
                              :orgList="orgList"
                              :bgDataType="
                                dqrConfig.emu.Background_Data.FPWomenPopulation
                              "
                              type="this.type"
                            />
                          </b-form>
                        </div>
                      </b-collapse>
                    </b-form>
                  </div>
                </b-form>
              </b-card-body>
            </b-collapse>
          </b-form>
        </div>
        <div class="accordion" role="tablist">
          <b-form no-body class="mb-1">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button
                block
                v-b-toggle.accordion-monthlyFpSource
                variant="info"
                >MONTHLY - FP SOURCE OF MODERN CONTRACEPTIVE</b-button
              >
            </b-card-header>
            <b-collapse
              id="accordion-monthlyFpSource"
              accordion="accordian-backgroundData"
              role="tabpanel"
            >
              <b-card-body>
                <b-form>
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <div class="w-50">Data Source:</div>
                    <b-form-select
                      class="w-50"
                      v-model="
                        dqrConfig.emu_monthly.Background_Data.bgDataSource
                      "
                      :options="form.dataSource"
                    ></b-form-select>
                  </div>

                  <div
                    :key="index2"
                    v-for="(obj, mName1, index2) in this.dqrConfig.emu_monthly
                      .Background_Data.fpSourceIndicators"
                  >
                    <h6>{{ obj.static_name }}</h6>
                    <b-form
                      no-body
                      class="mb-1"
                      :key="index3"
                      v-for="(ele, mName2, index3) in obj.subIndicators"
                    >
                      <b-card-header header-tag="header" class="p-1" role="tab">
                        <b-button
                          block
                          v-b-toggle="'accordion-monthly' + mName1 + mName2"
                          variant="info"
                          >{{ ele.name }}</b-button
                        >
                      </b-card-header>
                      <b-collapse
                        :id="'accordion-monthly' + mName1 + mName2"
                        visible
                        accordion="my-accordion-fpSourceIndicators"
                        role="tabpanel"
                      >
                        <div
                          v-if="
                            dqrConfig.emu_monthly.Background_Data
                              .bgDataSource === 'Datasets'
                          "
                        >
                          <div class="my-3">
                            <b-form-group
                              label="Mapping"
                              v-slot="{ ariaDescribedby }"
                            >
                              <div class="d-flex">
                                <b-form-radio
                                  readOnly
                                  v-model="ele.type"
                                  :aria-describedby="ariaDescribedby"
                                  name="some-radios"
                                  value="indicator"
                                  class="mr-3"
                                  
                                  >Indicator</b-form-radio
                                >
                                <b-form-radio
                                  readOnly
                                  v-model="ele.type"
                                  :aria-describedby="ariaDescribedby"
                                  name="some-radios"
                                  value="data_element"
                                  class="mx-3"
                                  
                                  >Data Element</b-form-radio
                                >
                                <b-form-radio
                                  readOnly
                                  v-model="ele.type"
                                  :aria-describedby="ariaDescribedby"
                                  name="some-radios"
                                  value="data_sets"
                                  class="mx-3"
                                  
                                  >Data Sets</b-form-radio
                                >
                              </div>
                            </b-form-group>
                          </div>
                          <div class="d-flex">
                            <div>
                              <ModalPopup
                                title="Indicator"
                                :deList="indicatorList"
                                :matrixList="matrixList"
                                :indIndex="mName1"
                                :subIndIndex="mName2"
                                keyType="methods"
                                @getAllDEs="getAllDEs"
                                insideOf="fpSourceIndicators"
                                emuType="emu_monthly"
                              />
                            </div>
                            <div>
                              <ModalPopup
                                title="Data Element"
                                :deList="dataElementList"
                                :matrixList="matrixList"
                                :indIndex="mName1"
                                :subIndIndex="mName2"
                                keyType="methods"
                                @getAllDEs="getAllDEs"
                                insideOf="fpSourceIndicators"
                                emuType="emu_monthly"
                              />
                            </div>
                            <div>
                              <ModalPopup
                                title="Data Sets"
                                :deList="dataSetList"
                                :matrixList="matrixList"
                                :indIndex="mName1"
                                :subIndIndex="mName2"
                                keyType="methods"
                                @getAllDEs="getAllDEs"
                                insideOf="fpSourceIndicators"
                                emuType="emu_monthly"
                              />
                            </div>
                          </div>
                          <div
                            :key="index4"
                            v-for="(dE, index4) in ele.selectedDE"
                          >
                            <div>
                              {{ dE.displayName }}
                              <i
                                class="fa fa-trash delButton"
                                @click="deleteDe(`emu_monthly` ,`fpSourceIndicators` , mName1, mName2, dE.id)"
                              ></i>
                            </div>
                          </div>
                        </div>
                        <div
                          v-else-if="
                            dqrConfig.emu_monthly.Background_Data
                              .bgDataSource === 'Datastore'
                          "
                        >
                          <b-form
                            :key="index"
                            v-for="(item, index) in ele.selectedDatastoreDE"
                          >
                            <div>{{ item.displayName }}</div>
                            <DataEntry
                              :dataEntryId="item.id"
                              :orgList="orgList"
                              :bgDataType="
                                dqrConfig.emu.Background_Data.FPWomenPopulation
                              "
                              type="this.type"
                            />
                          </b-form>
                        </div>
                      </b-collapse>
                    </b-form>
                  </div>
                </b-form>
              </b-card-body>
            </b-collapse>
          </b-form>
        </div>
        <div class="d-flex justify-content-end">
          <b-button class="btn btn-primary black-btn mr-2" @click="saveBtnDQRConfig()">Save</b-button>
        </div>
        <b-modal v-if="this.openPopup == true" size="lg" title="Data Entry">
        </b-modal>
      </b-card>
      <b-card v-if="this.type === 'cyp'">
        <div class="d-flex justify-content-between">
          <div class="d-flex align-items-center">
            <div>Method Name:</div>
            <b-form-select
              class="w-50 mx-2"
              v-model="form.selectedCyp"
              :options="form.options"
            ></b-form-select>
          </div>
        </div>
        <div class="accordion" role="tablist">
          <b-form
            no-body
            class="mb-1"
            :key="index"
            v-for="(obj, index) in this.bgDataConfig.cyp[this.form.selectedCyp]
              .chartData"
          >
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button
                class="text-left"
                block
                v-b-toggle="'accordion-' + index"
                variant="info"
                ><i>{{ obj.indicator.name }}</i>
                <i
                  class="fa fa-trash delButton float-right"
                  @click="deleteMethod(index)"
                ></i>
              </b-button>
            </b-card-header>
            <b-collapse
              :id="'accordion-' + index"
              accordion="accordian-cyp"
              role="tabpanel"
            >
              <b-card>
                <div
                  :key="index"
                  v-for="(item, index) in obj.indicator.subIndicator"
                >
                  <div
                    class="d-flex justify-content-between align-items-center my-3"
                  >
                    <div class="w-50">{{ item.name }}</div>
                    <b-form-input
                      class="w-50"
                      id="input-1"
                      v-model="item.cyp"
                      type="number"
                      required
                    ></b-form-input>
                  </div>
                </div>
              </b-card>
            </b-collapse>
          </b-form>
        </div>
        <div class="d-flex justify-content-end">
          <b-button class="btn btn-primary black-btn mr-2" @click="saveBtnCYP()">Save</b-button>
        </div>
      </b-card>
      <b-card v-if="this.type === 'continuation'">
        <div class="d-flex justify-content-between">
          <div class="d-flex align-items-center">
            <div>Method Name:</div>
            <b-form-select
              class="w-50 mx-2"
              v-model="form.selectedContination"
              :options="form.options"
            ></b-form-select>
          </div>
        </div>
        <div class="accordion" role="tablist">
          <b-card
            no-body
            class="mb-1"
            :key="index"
            v-for="(obj, mName, index) in bgDataConfig.continuation[
              this.form.selectedContination
            ]"
          >
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button
                class="text-left"
                block
                v-b-toggle="'contAccordion-' + index"
                variant="info"
                >{{ mName }}</b-button
              >
            </b-card-header>
            <b-collapse
              :id="'contAccordion-' + index"
              accordion="accordian-cont"
              role="tabpanel"
            >
              <!-- <b-card-body> -->
              <!-- <div class="accordion" role="tablist"> -->
              <!-- <b-card
                    no-body
                    class="mb-1"
                    :key="index"
                    v-for="(ele, index) in obj"
                  > -->
              <!-- <b-card-header header-tag="header" class="p-1" role="tab">
                      <b-button block v-b-toggle.index variant="info">{{
                        index
                      }}</b-button>
                    </b-card-header>
                    <b-collapse
                      id="index"
                      accordion="accordian-subContinuation"
                      role="tabpanel"
                    > -->
              <b-form>
                <div
                  class="d-flex justify-content-between align-items-center my-2"
                >
                  <div class="w-50">Scaling Factor</div>
                  <b-form-input
                    class="w-50"
                    v-model="obj.scalingFactor"
                    type="number"
                    required
                  ></b-form-input>
                </div>
                <div
                  class="d-flex justify-content-between align-items-center my-2"
                >
                  <div class="w-50">Method Name</div>
                  <b-form-select
                    class="w-50"
                    v-model="obj.type"
                    :options="form.methodName"
                  ></b-form-select>
                </div>
                <div class="d-flex flex-wrap">
                  <div
                    class="w-50 px-2"
                    :key="innerIndex"
                    v-for="(innerItem, innerIndex) in obj.continuation"
                  >
                    <!-- <div></div> -->
                    <div
                      class="d-flex justify-content-between align-items-center my-2"
                    >
                      <div class="w-50">Yr{{ innerIndex }}</div>
                      <b-form-input
                        class="w-50"
                        id="input-1"
                        v-model="obj.continuation[innerIndex]"
                        type="number"
                        required
                      >
                      </b-form-input>
                    </div>
                  </div>
                </div>
              </b-form>
              <!-- </b-collapse> -->
              <!-- </b-card> -->
              <!-- </div> -->
              <!-- </b-card-body> -->
            </b-collapse>
          </b-card>
        </div>
        <div class="d-flex justify-content-end">
          <b-button class="btn btn-primary black-btn mr-2" @click="saveBtnContinuation()"
            >Save</b-button
          >
        </div>
      </b-card>
    </b-card>
  </div>
</template>
<script>
import ModalPopup from "./ModalPopup";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import DataEntry from "./DataEntry.vue";

export default {
  props: [
    "type",
    "bgDataConfig",
    "dqrConfig",
    "indicatorList",
    "matrixList",
    "dataElementList",
    "dataSetList",
    "orgList",
  ],
  components: { ModalPopup, Treeselect, DataEntry },
  data() {
    return {
      form: {
        selectedCyp: "Visits",
        selectedContination: "Visits",
        selectedmethodName: "",
        options: [
          { value: "Visits", text: "Visits" },
          { value: "Commodities_Clients", text: "Commodities Clients" },
          { value: "Commodities_Facilities", text: "Commodities Facilities" },
          { value: "User", text: "User" },
        ],
        methodName: [
          { value: "Long Term", text: "Long Term" },
          { value: "Short Term", text: "Short Term" },
        ],
        dataSource: [
          { value: "Datastore", text: "Datastore" },
          { value: "Datasets", text: "Data Sets" },
        ],
      },
      openPopup: false,
    };
  },
  computed: {
    computedLocList() {
      return this.orgList;
    },
  },
  methods: {
    saveBtnDQRConfig() {
      this.$emit('saveJson', this.dqrConfig, "dqrModule_en")
    },
    saveBtnContinuation(){
      this.$emit('saveJson', this.bgDataConfig, "globalFactors_en")
    },
    saveBtnCYP(){
      this.$emit('saveJson', this.bgDataConfig, "globalFactors_en")
    },
    getAllDEs(val, index, subIndex, keyType, title, insideOf, emuType) {
      console.log("getAlldes", this.dqrConfig);
      console.log("val", val);
      console.log("index", index);
      console.log("subIndex", subIndex);
      console.log("keyType", keyType);
      console.log("title", title);
      console.log("insideOf", insideOf);
      console.log("emuType", emuType);

      let actData = this.dqrConfig;

      if (title === "Indicator") {
        actData[emuType]["Background_Data"][insideOf][index]["subIndicators"][
          subIndex
        ]["type"] = "indicator";
      } else if (title === "Data Element") {
        actData[emuType]["Background_Data"][insideOf][index]["subIndicators"][
          subIndex
        ]["type"] = "data_element";
      } else if (title === "Data Sets") {
        actData[emuType]["Background_Data"][insideOf][index]["subIndicators"][
          subIndex
        ]["type"] = "data_sets";
      }
      this.dqrConfig = actData;
      this.updateSubInd(index, subIndex, "selectedDE", val, insideOf, emuType);
    },
    updateSubInd(index, subIndex, key, val, insideOf, emuType) {
      console.log(this.dqrConfig)
      let getData = this.dqrConfig;
      if (key === "selectedDE") {
        let ar =
          getData[emuType]["Background_Data"][insideOf][index]["subIndicators"][
            subIndex
          ]["selectedDE"];
        getData[emuType]["Background_Data"][insideOf][index]["subIndicators"][
          subIndex
        ]["selectedDE"] = [...ar, val];
      } else {
        getData[emuType]["Background_Data"][insideOf][index]["subIndicators"][
          subIndex
        ][key] = val;
      }
      this.dqrConfig = getData;
    },
    deleteDe(emuType, insideOf, index, subIndex, id) {
      let getData = this.dqrConfig;
      let arr =
        getData[emuType]["Background_Data"][insideOf][index][
          "subIndicators"
        ][subIndex]["selectedDE"];

      arr.forEach((de, ind) => {
        if (de["id"] == id) {
          // arr.splice(ind, 1);
          console.log(arr.splice(ind, 1));
        }
      });
      getData[emuType]["Background_Data"][insideOf][index][
        "subIndicators"
      ][subIndex]["selectedDE"] = arr;
      this.configdata = getData;
    },
    deleteMethod(index){
      let getData = this.bgDataConfig;
      let arr = getData.cyp[this.form.selectedCyp].chartData
      arr.forEach((de, ind) => {
        if (ind == index) {
          arr.splice(ind, 1);
        }
      });
      getData.cyp[this.form.selectedCyp].chartData = arr;
      this.configdata = getData;
    }
  },
};
</script>
