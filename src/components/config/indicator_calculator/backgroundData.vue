<template>
  <div class="md_tabs py-3">
    <b-card no-body class="">
      <b-card v-if="this.type === 'BackgroundData'">
        <div>
          <!-- <h4>{{$t("bgIndSetUp")}}</h4> -->
        </div>
        <div class="accordion mt-2" role="tablist">
          <b-form
            no-body
            class="mb-2"
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
                  <div class="w-50">{{ $t("dataSource") }}</div>
                  <b-form-select
                    class="w-50"
                    v-model="obj.bgDataSource"
                    :options="form.dataSource"
                  ></b-form-select>
                </div>
                <div class="card-body">
                  <subIndicatorComponent
                    :_i="'_background_' + index1"
                    type="backgroundIndicators"
                    :index="index1"
                    :subIndicators="obj.subIndicators"
                    :indicatorsList="indicatorList"
                    :dataElementsList="dataElementList"
                    :dataSetsList="dataSetList"
                    :matrixList="matrixList"
                    :updateDEName="updateDEName"
                    :bgDataSource="obj.bgDataSource"
                    :bgDataType="
                      dqrConfig.emu.Background_Data.FPWomenPopulation
                      
                    "
                    :isFromIC="isFromIC"
                  />
                </div>
                <div
                  no-body
                  class="mb-1"
                  :key="index2"
                  v-for="(ele, index2) in obj.subIndicators"
                >
                  <!-- <div v-if="obj.bgDataSource === 'Datasets'">
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
                            >{{ $t("indicator") }}</b-form-radio
                          >
                          <b-form-radio
                            readOnly
                            v-model="ele.type"
                            :aria-describedby="`ariaDescribedby_${index2} `"
                            :name="`secondRadio_${index2}`"
                            value="data_element"
                            class="mx-3"
                            >{{ $t("dataElement") }}</b-form-radio
                          >
                          <b-form-radio
                            readOnly
                            v-model="ele.type"
                            :aria-describedby="`ariaDescribedby_${index2} `"
                            :name="`secondRadio_${index2}`"
                            value="data_sets"
                            class="mx-3"
                            >{{ $t("dataSets") }}</b-form-radio
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
                      <div class="mt-3">
                        {{ dE.displayName }}
                        <i
                          class="fa fa-trash delButton"
                          @click="deleteDe( `emu` , `backgroundIndicators` , index1, index2, dE.id)"
                        ></i>
                        <img
                          src="@/assets/images/icons/admindelete-icon.svg"
                          class="delButton f-s-0-875rem w-auto mb-1 mx-2"
                          :style="{ filter: filterColor }"
                          @click="
                            deleteDe(
                              `emu`,
                              `backgroundIndicators`,
                              index1,
                              index2,
                              dE.id
                            )
                          "
                        />
                      </div>
                    </div>
                  </div> -->
                  <!-- <div v-else-if="obj.bgDataSource === 'Datastore'">
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
                  </div> -->
                </div>
              </b-card-body>
            </b-collapse>
          </b-form>
        </div>
        <div class="accordion mt-2" role="tablist">
          <b-form no-body class="mb-2">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button
                block
                v-b-toggle.accordion-annualFpSource
                variant="info"
                >{{ $t("annualFp") }}</b-button
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
                    class="d-flex justify-content-between align-items-center mb-3"
                  >
                    <div class="w-50">{{ $t("dataSource") }}:</div>
                    <b-form-select
                      class="w-50"
                      v-model="dqrConfig.emu.Background_Data.bgDataSource"
                      :options="form.dataSource"
                    ></b-form-select>
                  </div>

                  <div
                     class="card"
                    :key="index2"
                    v-for="(obj, mName1, index2) in this.dqrConfig.emu
                      .Background_Data.fpSourceIndicators"
                  >
                    <div
              class="card-header f-s-0-875rem p-b-10px accordion-header1 f-s-0-875rem font-weight-bold bt-10"
            >
                   {{ obj.static_name }}
                   </div>
                    <div class="card card-body admin-emucard mb-4">
                    <indicatorMappingComponent
                      :_i="'accordion-annual' + mName1"
                      type="fpSourceIndicators"
                      :index="index2"
                      :subIndicators="obj.subIndicators"
                      :updateDEName="updateDEName"
                      :indicatorsList="indicatorList"
                      :dataElementsList="dataElementList"
                      :dataSetsList="dataSetList"
                      :matrixList="matrixList"
                      :bgDataSource="dqrConfig.emu.Background_Data.bgDataSource"
                      :bgDataType="dqrConfig.emu.Background_Data.FPWomenPopulation"
                      :isFromIC="isFromIC"
                    />
                  </div>
                     <!-- <b-form
                      no-body
                      class="mb-2"
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
                                  >{{ $t("indicator") }}</b-form-radio
                                >
                                <b-form-radio
                                  readOnly
                                  v-model="ele.type"
                                  :aria-describedby="ariaDescribedby"
                                  name="some-radios"
                                  value="data_element"
                                  class="mx-3"
                                  >{{ $t("dataElement") }}</b-form-radio
                                >
                                <b-form-radio
                                  readOnly
                                  v-model="ele.type"
                                  :aria-describedby="ariaDescribedby"
                                  name="some-radios"
                                  value="data_sets"
                                  class="mx-3"
                                  >{{ $t("dataSets") }}</b-form-radio
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
                            <div class="mt-3">
                              {{ dE.displayName }}
                              <i
                                class="fa fa-trash delButton"
                                @click="deleteDe( `emu` , `fpSourceIndicators` , mName1, mName2, dE.id)"
                              ></i>
                              <img
                                src="@/assets/images/icons/admindelete-icon.svg"
                                :style="{ filter: filterColor }"
                                class="delButton f-s-0-875rem w-auto mb-1 mx-2"
                                @click="
                                  deleteDe(
                                    `emu`,
                                    `fpSourceIndicators`,
                                    mName1,
                                    mName2,
                                    dE.id
                                  )
                                "
                              />
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
                    </b-form> -->
                  </div>
                </b-form>
              </b-card-body>
            </b-collapse>
          </b-form>
        </div>
        <div class="accordion mt-2" role="tablist">
          <b-form no-body class="mb-1">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button
                block
                v-b-toggle.accordion-monthlyFpSource
                variant="info"
                >{{ $t("monthlyFp") }}</b-button
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
                    class="d-flex justify-content-between align-items-center mb-3"
                  >
                    <div class="w-50">{{ $t("dataSource") }}:</div>
                    <b-form-select
                      class="w-50"
                      v-model="
                        dqrConfig.emu_monthly.Background_Data.bgDataSource
                      "
                      :options="form.dataSource"
                    ></b-form-select>
                  </div>

                  <div
                    class="card"
                    :key="index2"
                    v-for="(obj, mName1, index2) in this.dqrConfig.emu_monthly
                      .Background_Data.fpSourceIndicators"
                  >
                   <div
              class="card-header f-s-0-875rem p-b-10px accordion-header1 f-s-0-875rem font-weight-bold bt-10"
            >  
                  {{ obj.static_name }}
                </div>
                    
                    <div class="card card-body admin-emucard mb-4">

                    <indicatorMappingComponent
                      :_i="'accordion-Monthly' + mName1"
                      type="fpSourceIndicators"
                      :index="index2"
                      :subIndicators="obj.subIndicators"
                      :updateDEName="updateDEName"
                      :indicatorsList="indicatorList"
                      :dataElementsList="dataElementList"
                      :dataSetsList="dataSetList"
                      :matrixList="matrixList"
                      :bgDataSource="dqrConfig.emu_monthly.Background_Data.bgDataSource"
                      :bgDataType="dqrConfig.emu_monthly.Background_Data.FPWomenPopulation"
                      :isFromIC="isFromIC"
                    />
                  </div>
                      <!--                    <b-form
                      no-body
                      class="mb-2"
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
                                  >{{ $t("indicator") }}</b-form-radio
                                >
                                <b-form-radio
                                  readOnly
                                  v-model="ele.type"
                                  :aria-describedby="ariaDescribedby"
                                  name="some-radios"
                                  value="data_element"
                                  class="mx-3"
                                  >{{ $t("dataElement") }}</b-form-radio
                                >
                                <b-form-radio
                                  readOnly
                                  v-model="ele.type"
                                  :aria-describedby="ariaDescribedby"
                                  name="some-radios"
                                  value="data_sets"
                                  class="mx-3"
                                  >{{ $t("dataSets") }}</b-form-radio
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
                                @click="
                                  deleteDe(
                                    `emu_monthly`,
                                    `fpSourceIndicators`,
                                    mName1,
                                    mName2,
                                    dE.id
                                  )
                                "
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
                    </b-form> -->
                  </div>
                </b-form>
              </b-card-body>
            </b-collapse>
          </b-form>
        </div>
        <div class="d-flex justify-content-end mt-4">
          <b-button
            class="btn btn-primary black-btn save-btn mr-0"
            @click="saveBtnDQRConfig()"
            >{{ $t("savebtn") }}</b-button
          >
        </div>
        <b-modal
          v-if="this.openPopup == true"
          size="lg"
          :ok-title="$t('ok')"
          :cancel-title="$t('cancelbtn')"
          :title="$t('dataEntry')"
          centered
          no-close-on-backdrop
        >
        </b-modal>
      </b-card>
      <b-card v-if="this.type === 'cyp'">
        <div class="">
          <div class="d-flex align-items-center mb-3">
            <div>{{ $t("methodName") }}</div>
            <b-form-select
              class="w-25 mx-2"
              v-model="form.selectedCyp"
              :options="form.options"
            ></b-form-select>
          </div>
        </div>
        <div class="accordion mt-2" role="tablist">
          <b-form
            no-body
            class="mb-1 mt-2"
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
                >{{ obj.indicator.name }}
                <!-- <i
                  class="fa fa-trash delButton float-right mx-4"
                  @click="deleteMethod(index)"
                ></i> -->
                <!-- <img
                  src="@/assets/images/icons/admindelete-icon.svg"
                  :style="{ filter: filterColor }"
                  class="delButton float-right f-s-0-875rem w-auto mx-4 mt-sm-1 pt-0"
                  @click="deleteMethod(index)"
                /> -->
              </b-button>
            </b-card-header>
            <b-collapse
              :id="'accordion-' + index"
              visible
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
        <div class="d-flex justify-content-end mt-4">
          <b-button
            class="btn btn-primary black-btn save-btn mr-0"
            @click="saveBtnCYP()"
            >{{ $t("savebtn") }}</b-button
          >
        </div>
      </b-card>
      <b-card v-if="this.type === 'continuation'">
        <div class="">
          <div class="d-flex align-items-center mb-3">
            <div>{{ $t("methodName") }}</div>
            <b-form-select
              class="w-25 mx-2"
              v-model="form.selectedContination"
              :options="form.options"
            ></b-form-select>
          </div>
        </div>
        <div class="accordion contin-acc" role="tablist">
          <b-card
            no-body
            class="mb-1 mt-2"
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
              visible
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
                <div class="m-3">
                  <div
                    class="d-flex justify-content-between align-items-center my-2"
                  >
                    <div class="w-50">{{ $t("scalingFactor") }}</div>
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
                    <div class="w-50">{{ $t("methodName") }}</div>
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
                        <div class="w-50">{{
                            obj.type === "Long Term" ? $t("yr") : $t("month")
                          }} {{ innerIndex }}</div>
                        <b-form-input
                          class="w-50"
                          id="input-1"
                          v-model="obj.continuation[innerIndex]"
                          required
                          disabled
                        >
                        </b-form-input>
                      </div>
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
        <div class="d-flex justify-content-end mt-4">
          <b-button
            class="btn btn-primary black-btn save-btn mr-0"
            @click="saveBtnContinuation()"
            >{{ $t("savebtn") }}</b-button
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
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import subIndicatorComponent from "../dqr/subIndicatorComponent";
import indicatorMappingComponent from "../dqr/indicatorMappingComponent";
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
    "isFromIC"
  ],
  mixins: [DynamicImageMixin],
  components: {
    ModalPopup,
    Treeselect,
    DataEntry,
    subIndicatorComponent,
    indicatorMappingComponent,
  },
  data() {
    return {
      form: {
        selectedCyp: "Visits",
        selectedContination: "Visits",
        selectedmethodName: "",
        options: [
          { value: "Visits", text: "Visits" },
          { value: "Commodities_Client", text: "Commodities Clients" },
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
      this.dqrConfig.emu_monthly.Background_Data.backgroundIndicators.forEach(
        (itemMon) => {
          this.dqrConfig.emu.Background_Data.backgroundIndicators.forEach(
            (itemAnn) => {
              if (itemAnn.static_name === itemMon.static_name) {
                itemMon.bgDataSource = itemAnn.bgDataSource;
                itemMon.subIndicators = itemAnn.subIndicators;
              }
            }
          );
        }
      );
      // this.dqrConfig.emu_monthly.Background_Data.backgroundIndicators[0] = [0]
      let key = this.generateKey("dqrModule");
      this.$emit("saveJson", this.dqrConfig, key);
    },

    updateDEName(i, j, k, type, elem) {
      this.moduleConfig[type][i].subIndicators[j].selectedDE[k] = elem;
    },

    saveBtnContinuation() {
      console.log('this.bgDataConfig',this.bgDataConfig);
      let key = this.generateKey("globalFactors");
      this.$emit("saveJson", this.bgDataConfig, key);
    },
    saveBtnCYP() {
      let key = this.generateKey("globalFactors");
      this.$emit("saveJson", this.bgDataConfig, key);
    },
    getAllDEs(val, index, subIndex, keyType, title, insideOf, emuType) {
      // console.log("getAlldes", this.dqrConfig);
      // console.log("val", val);
      // console.log("index", index);
      // console.log("subIndex", subIndex);
      // console.log("keyType", keyType);
      // console.log("title", title);
      // console.log("insideOf", insideOf);
      // console.log("emuType", emuType);

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
      // console.log(this.dqrConfig);
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
        getData[emuType]["Background_Data"][insideOf][index]["subIndicators"][
          subIndex
        ]["selectedDE"];

      arr.forEach((de, ind) => {
        if (de["id"] == id) {
          // arr.splice(ind, 1);
        }
      });
      getData[emuType]["Background_Data"][insideOf][index]["subIndicators"][
        subIndex
      ]["selectedDE"] = arr;
      this.configdata = getData;
    },
    deleteMethod(index) {
      let getData = this.bgDataConfig;
      let arr = getData.cyp[this.form.selectedCyp].chartData;
      arr.forEach((de, ind) => {
        if (ind == index) {
          arr.splice(ind, 1);
        }
      });
      getData.cyp[this.form.selectedCyp].chartData = arr;
      this.configdata = getData;
    },
  },
};
</script>
