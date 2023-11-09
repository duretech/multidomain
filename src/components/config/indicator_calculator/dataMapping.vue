<template>
  <div class="md_tabs py-3">
    <b-card no-body class="p-4">
      <div class="accordion no-header" role="tablist">
        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block v-b-toggle.accordion-1 variant="info">
              {{ $t("dataMapping") }}</b-button
            >
          </b-card-header>
          <b-collapse
            id="accordion-1"
            visible
            accordion="my-accordion"
            role="tabpanel"
          >
            <b-card-body>
              <b-card-text>
                <div class="d-flex justify-content-end">
                  <div class="mb-3">
                    <b-button
                      class="mr-2 btn btn btn-primary black-btn save-btn"
                      @click="saveJson"
                      >{{ $t("savebtn") }}</b-button
                    >
                    <!-- <b-button
                      class="mx-2 btn btn btn-primary black-btn"
                      @click="showViewEMUPopup"
                      >{{ $t("viewAnnualEmu") }}</b-button
                    >
                    <b-button
                      class="ml-2 btn btn btn-primary black-btn"
                      @click="showViewEMUPopupMonthly"
                      >{{ $t("viewMonthlyEmu") }}</b-button
                    > -->
                  </div>
                </div>
                <b-form class="mb-3">
                  <div
                    class="d-flex justify-content-between align-items-center my-2"
                  >
                    <div class="w-50">
                      {{ $t("emu_mon_quest") }}
                    </div>
                    <b-form-select
                      class="w-50"
                      v-model="dqrConfig.emu[type]['dataOnContraceptive']"
                      :options="dataOnContraceptiveOption"
                    ></b-form-select>
                  </div>
                  <!-- @change="updateDDT(type , $e.target.value)" -->
                  <!-- removed d-flex  card for 'hide' class prperty css to be get applied for -->
                  <div
                    v-if="dqrConfig.emu[type]['dataOnContraceptive'] === 'Yes'"
                    class="justify-content-between align-items-center my-2 hide"
                  >
                    <div class="w-50">{{ $t("emu_initial_year_quest") }}</div>
                    <b-form-input
                      class="w-50"
                      id="input-1"
                      v-model="dqrConfig.emu[type]['initialYear']"
                      type="number"
                      placeholder="Enter Year"
                      required
                      disabled
                    ></b-form-input>
                  </div>
                  <div
                    v-if="dqrConfig.emu[type]['dataOnContraceptive'] === 'Yes'"
                    class="justify-content-between align-items-center my-2 hide"
                  >
                    <div class="w-50">{{ $t("emu_final_year_quest") }}</div>
                    <b-form-input
                      class="w-50"
                      id="input-1"
                      v-model="dqrConfig.emu[type]['finalYear']"
                      type="text"
                      required
                      disabled
                    ></b-form-input>
                  </div>
                  <div
                    v-if="dqrConfig.emu[type]['dataOnContraceptive'] === 'Yes'"
                    class="justify-content-between align-items-center my-2 hide"
                  >
                    <div class="w-50">
                      {{ $t("mostRecentYearMonth") }}
                    </div>
                    <b-form-input
                      class="w-50"
                      id="input-1"
                      v-model="dqrConfig.emu[type]['backTrackedYearMonth']"
                      type="text"
                      required
                      disabled
                    ></b-form-input>
                  </div>
                  <!-- Hided above three year fields as global period setting is getting used -->
                  <div
                    v-if="dqrConfig.emu[type]['dataOnContraceptive'] === 'Yes'"
                    class="justify-content-between align-items-center my-2 hide"
                  >
                    <div class="w-50">{{ $t("backtrackingMonth") }}</div>
                    <b-form-select
                      class="w-50"
                      v-bind:value="computedBackTrackMonth"
                      :options="backTrackMonth"
                      @change="updateTrackingYear($event)"
                    ></b-form-select>
                  </div>
                </b-form>
              </b-card-text>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>

      <b-card-body
        v-if="dqrConfig.emu[type]['dataOnContraceptive'] === 'Yes'"
        class="mapping-section mt-2"
      >
        <div class="accordion no-header" role="tablist">
          <b-card
            no-body
            class="mb-2"
            :key="index"
            v-for="(chart, index) in dqrConfig.emu[type]['chartData']"
          >
            <div
              v-if="
                typeof chart.indicator.name == 'object'
                  ? chart.indicator.name[$i18n.locale] !== `Total CYP`
                  : chart.indicator.name !== `Total CYP`
              "
            >
              <b-card-header header-tag="header" class="p-1" role="tab">
                <b-button
                  block
                  v-b-toggle="`accordion-${index}`"
                  variant="info"
                  >{{
                    typeof chart.indicator.name == "object"
                      ? chart.indicator.name[$i18n.locale]
                      : chart.indicator.name
                  }}</b-button
                >
              </b-card-header>
              <b-collapse
                :id="`accordion-${index}`"
                accordion="my-accordion1"
                role="tabpanel"
              >
                <div class="mx-4 pt-2 pb-3">
                  <div class="accordion no-header" role="tablist">
                    <div class="py-2 heading-card">
                      {{ $t("dataMapping") }}
                    </div>
                    <div className="p-4 disable-chart">
                      <b-form-checkbox
                        :id="`checkbox-${chart.indicator.name}`"
                        v-model="chart.indicator.disableChart"
                        :name="`checkbox-${chart.indicator.name}`"
                      >
                        {{ $t("disable") }} &nbsp;
                      </b-form-checkbox>
                      <!-- <input type="checkbox" name="disableChart" onChange={(e)
                        => updateInd( index, "disableChart", e.target.value,
                        "chartData" ) } checked={chart.indicator.disableChart} /> -->
                    </div>
                    <div v-if="!chart.indicator.disableChart">
                      <b-card
                        no-body
                        class="mb-1 mt-2"
                        :key="subindex"
                        v-for="(subi, subindex) in chart.indicator.subIndicator"
                      >
                        <b-card-header
                          header-tag="header"
                          class="p-1"
                          role="tab"
                        >
                          <b-button
                            block
                            v-b-toggle="`accordion-${index}${subindex}`"
                            variant="info"
                          >
                            {{
                              typeof subi.name == "object"
                                ? subi.name[$i18n.locale]
                                : subi.name
                            }}</b-button
                          >
                        </b-card-header>
                        <b-collapse
                          :id="`accordion-${index}${subindex}`"
                          accordion="my-accordion11"
                          role="tabpanel"
                        >
                          <div class="mx-4 pt-2 pb-3">
                            <b-form>
                              <div
                                class="d-flex justify-content-between align-items-center"
                              >
                                <div>{{ $t("name") }}</div>
                                <div
                                  class="d-flex justify-content-end w-50 align-items-center"
                                >
                                  <b-form-input
                                    v-model="subi.name[$i18n.locale]"
                                    disabled
                                  ></b-form-input>
                                  <b-input-group-append is-text class="mx-1">
                                    <Translations :transText.sync="subi.name" />
                                  </b-input-group-append>
                                </div>
                              </div>
                              <div class="my-3">
                                <b-form-group
                                  label="Mapping"
                                  v-slot="{ ariaDescribedby }"
                                >
                                  <b-form-radio
                                    inline
                                    v-model="subi['type']"
                                    :aria-describedby="ariaDescribedby"
                                    name="some-radios"
                                    value="indicator"
                                    >{{ $t("indicator") }}</b-form-radio
                                  >
                                  <b-form-radio
                                    inline
                                    v-model="subi['type']"
                                    :aria-describedby="ariaDescribedby"
                                    name="some-radios"
                                    value="data_element"
                                    >{{ $t("dataElement") }}</b-form-radio
                                  >
                                  <b-form-radio
                                    inline
                                    v-model="subi['type']"
                                    :aria-describedby="ariaDescribedby"
                                    name="some-radios"
                                    value="data_sets"
                                    >{{ $t("dataSets") }}</b-form-radio
                                  >
                                </b-form-group>
                              </div>
                              <div class="d-flex">
                                <div>
                                  <ModalPopup
                                    title="Indicator"
                                    :deList="indicatorList"
                                    :matrixList="matrixList"
                                    :indIndex="index"
                                    :subIndIndex="subindex"
                                    keyType="methods"
                                    @getAllDEs="getAllDEs"
                                    insideOf="chartData"
                                    emuType="emu"
                                  />
                                </div>
                                <div>
                                  <ModalPopup
                                    title="Data Element"
                                    :deList="dataElementList"
                                    :matrixList="matrixList"
                                    :indIndex="index"
                                    :subIndIndex="subindex"
                                    keyType="methods"
                                    @getAllDEs="getAllDEs"
                                    insideOf="chartData"
                                    emuType="emu"
                                  />
                                </div>
                                <div>
                                  <ModalPopup
                                    title="Data Sets"
                                    :deList="dataSetList"
                                    :matrixList="matrixList"
                                    :indIndex="index"
                                    :subIndIndex="subindex"
                                    keyType="methods"
                                    @getAllDEs="getAllDEs"
                                    insideOf="chartData"
                                    emuType="emu"
                                  />
                                </div>
                              </div>
                              <div>
                                <template>
                                  <div
                                    class="mt-3"
                                    v-for="(innObj, subind2) in subi.selectedDE"
                                    :key="subind2"
                                  >
                                    <label>{{ innObj.displayName }}</label>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <!-- <i
                                      class="fa fa-trash delButton"
                                      @click="
                                        deleteDe(
                                          index,
                                          subindex,
                                          innObj.id,
                                          'chartData'
                                        )
                                      "
                                    ></i> -->
                                    <img
                                      src="@/assets/images/icons/admindelete-icon.svg"
                                      class="delButton f-s-0-875rem w-auto"
                                      :style="{ filter: filterColor }"
                                      @click="
                                        deleteDe(
                                          index,
                                          subindex,
                                          innObj.id,
                                          'chartData'
                                        )
                                      "
                                    />
                                    <br />
                                  </div>
                                </template>
                              </div>
                            </b-form>
                          </div>
                        </b-collapse>
                      </b-card>
                    </div>
                  </div>
                </div>
              </b-collapse>
            </div>
          </b-card>
        </div>
        <div class="accordion no-header" role="tablist">
          <b-card
            no-body
            class="mb-2"
            :key="repoIndex"
            v-for="(repoInd, repoIndex) in dqrConfig.emu[type]['reportingRate']"
          >
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button
                block
                v-b-toggle="`accordionRepo-${repoIndex}`"
                variant="info"
                >{{
                  typeof repoInd.indicator.name == "object"
                    ? repoInd.indicator.name[$i18n.locale]
                    : repoInd.indicator.name
                }}</b-button
              >
            </b-card-header>
            <b-collapse
              :id="`accordionRepo-${repoIndex}`"
              accordion="my-accordion2"
              role="tabpanel"
            >
              <div class="mx-4">
                <div class="accordion" role="tablist">
                  <!-- <div class="px-3 py-2 heading-card">Data Mapping</div> -->
                  <div className="p-4 disable-chart">
                    <b-form-checkbox
                      :id="`checkbox-${
                        typeof repoInd.indicator.name == 'object'
                          ? repoInd.indicator.name[$i18n.locale]
                          : repoInd.indicator.name
                      }`"
                      v-model="repoInd.indicator.disableChart"
                      :name="`checkbox-${
                        typeof repoInd.indicator.name == 'object'
                          ? repoInd.indicator.name[$i18n.locale]
                          : repoInd.indicator.name
                      }`"
                    >
                      {{ $t("excRr") }} &nbsp;
                    </b-form-checkbox>
                    <!-- <input type="checkbox" name="disableChart" onChange={(e)
                      => updateInd( index, "disableChart", e.target.value,
                      "chartData" ) } checked={chart.indicator.disableChart} /> -->
                    <div
                      class="d-flex justify-content-between align-items-center"
                    >
                      <div>{{ $t("name") }}</div>
                      <div
                        class="d-flex justify-content-end w-50 align-items-center"
                      >
                        <b-form-input
                          v-model="repoInd.indicator.name[$i18n.locale]"
                          disabled
                        ></b-form-input>
                        <b-input-group-append is-text class="mx-1">
                          <Translations
                            :transText.sync="repoInd.indicator.name"
                          />
                        </b-input-group-append>
                      </div>
                    </div>
                  </div>
                  <div v-if="!repoInd.indicator.disableChart">
                    <b-card
                      no-body
                      class="mb-1"
                      :key="subrepoIndex"
                      v-for="(subrepoId, subrepoIndex) in repoInd.indicator
                        .subIndicator"
                    >
                      <b-card-body>
                        <b-form>
                          <div class="my-3">
                            <b-form-group
                              label="Mapping"
                              v-slot="{ ariaDescribedby }"
                            >
                              <b-form-radio
                                inline
                                v-model="subrepoId['type']"
                                :aria-describedby="ariaDescribedby"
                                name="some-radios"
                                value="indicator"
                                >{{ $t("indicator") }}</b-form-radio
                              >
                              <b-form-radio
                                inline
                                v-model="subrepoId['type']"
                                :aria-describedby="ariaDescribedby"
                                name="some-radios"
                                value="data_element"
                                >{{ $t("dataElement") }}</b-form-radio
                              >
                              <b-form-radio
                                inline
                                v-model="subrepoId['type']"
                                :aria-describedby="ariaDescribedby"
                                name="some-radios"
                                value="data_sets"
                                >{{ $t("dataSets") }}</b-form-radio
                              >
                            </b-form-group>
                          </div>
                          <div class="d-flex">
                            <div variant="btn btn-light">
                              <ModalPopup
                                title="Indicator"
                                :deList="indicatorList"
                                :matrixList="matrixList"
                                :indIndex="repoIndex"
                                :subIndIndex="subrepoIndex"
                                keyType="methods"
                                @getAllDEs="getAllDEs"
                                insideOf="reportingRate"
                                emuType="emu"
                              />
                            </div>
                            <div variant="btn btn-light">
                              <ModalPopup
                                title="Data Element"
                                :deList="dataElementList"
                                :matrixList="matrixList"
                                :indIndex="repoIndex"
                                :subIndIndex="subrepoIndex"
                                keyType="methods"
                                @getAllDEs="getAllDEs"
                                insideOf="reportingRate"
                                emuType="emu"
                              />
                            </div>
                            <div variant="btn btn-light">
                              <ModalPopup
                                title="Data Sets"
                                :deList="dataSetList"
                                :matrixList="matrixList"
                                :indIndex="repoIndex"
                                :subIndIndex="subrepoIndex"
                                keyType="methods"
                                @getAllDEs="getAllDEs"
                                insideOf="reportingRate"
                                emuType="emu"
                              />
                            </div>
                          </div>
                          <div>
                            <template>
                              <div
                                class="mt-3"
                                v-for="(
                                  innObj, subind2
                                ) in subrepoId.selectedDE"
                                :key="subind2"
                              >
                                <label>{{ innObj.displayName }}</label>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <!-- <i
                                  class="fa fa-trash delButton"
                                  @click="
                                    deleteDe(
                                      repoIndex,
                                      subrepoIndex,
                                      innObj.id,
                                      'reportingRate'
                                    )
                                  "
                                ></i> -->
                                <img
                                  src="@/assets/images/icons/admindelete-icon.svg"
                                  class="delButton f-s-0-875rem w-auto"
                                  @click="
                                    deleteDe(
                                      repoIndex,
                                      subrepoIndex,
                                      innObj.id,
                                      'reportingRate'
                                    )
                                  "
                                />
                                <br />
                              </div>
                            </template>
                          </div>
                        </b-form>
                      </b-card-body>
                      <!-- </b-collapse> -->
                    </b-card>
                  </div>
                </div>
              </div>
            </b-collapse>
          </b-card>
        </div>
        <div class="accordion no-header" role="tablist">
          <b-card no-body class="mb-2">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button
                block
                v-b-toggle="`accordionfp-fpIndex`"
                variant="info"
                >{{ $t("fpSource") }}</b-button
              >
            </b-card-header>
            <b-collapse
              :id="`accordionfp-fpIndex`"
              accordion="my-accordion3"
              role="tabpanel"
            >
              <b-card-body>
                <div class="d-block text-left">
                  <treeselect
                    :multiple="false"
                    :options="computedLocList"
                    :show-count="true"
                    :placeholder="$t('search')"
                    v-model="selectedNodeFpIndex"
                    :default-expand-level="2"
                  />
                </div>
                <div class="my-3 text-center">
                  <b-button
                    class="btn btn btn-primary black-btn"
                    @click="saveSectorRepo()"
                    >{{ $t("saveFpData") }}</b-button
                  >
                </div>
                <div class="d-flex justify-content-around my-2">
                  <h6 class="py-2 accordianFp">{{ $t("public_sector") }}</h6>
                  <h6 class="py-2 accordianFp">
                    {{ $t("public_medical_sector") }}
                  </h6>
                  <h6 class="py-2 accordianFp">{{ $t("other_source") }}</h6>
                </div>
                <div class="d-flex justify-content-around">
                  <div class="text-center mx-3" style="flex: 1 1 30%">
                    <p>
                      {{ $t("gov_health_facilities") }}
                    </p>
                    <b-form-select
                      v-model="sectorObj['governmentHealth']"
                      :options="form.optionsInFp"
                      size="sm"
                    ></b-form-select>
                  </div>
                  <div class="text-center mx-3" style="flex: 1 1 30%">
                    <div>
                      <p>{{ $t("ngo") }}</p>
                      <b-form-select
                        v-model="sectorObj['ngo']"
                        :options="form.optionsInFp"
                        size="sm"
                      ></b-form-select>
                    </div>
                    <div>
                      <p>{{ $t("private_hospital") }}</p>
                      <b-form-select
                        v-model="sectorObj['privateHospital']"
                        :options="form.optionsInFp"
                        size="sm"
                      ></b-form-select>
                    </div>
                    <div>
                      <p>{{ $t("pharmacy") }}</p>
                      <b-form-select
                        v-model="sectorObj['pharmacy']"
                        :options="form.optionsInFp"
                        size="sm"
                      ></b-form-select>
                    </div>
                  </div>
                  <div class="text-center mx-3" style="flex: 1 1 30%">
                    <div>
                      <p>{{ $t("shop_church_friend") }}</p>
                      <b-form-select
                        v-model="sectorObj['shopChurchFriend']"
                        :options="form.optionsInFp"
                        size="sm"
                      ></b-form-select>
                    </div>
                    <div>
                      <p>{{ $t("other") }}</p>
                      <b-form-select
                        v-model="sectorObj['otherSector']"
                        :options="form.optionsInFp"
                        size="sm"
                      ></b-form-select>
                    </div>
                  </div>
                </div>
              </b-card-body>
            </b-collapse>
          </b-card>
        </div>
      </b-card-body>
    </b-card>
    <b-modal
      ref="viewEMUAnnual"
      hide-footer
      centered
      :title="$t('selectLocation')"
      no-close-on-backdrop
    >
      <div class="d-block text-left">
        <treeselect
          :multiple="true"
          :options="computedLocList"
          :show-count="true"
          :placeholder="$t('search')"
          v-model="selectedNode"
          :flat="true"
          :default-expand-level="1"
        />
      </div>
      <div class="d-flex justify-content-end">
        <b-button
          class="btn btn-primary black-btn mt-2 w-25 blue-btn"
          variant="outline-warning"
          block
          @click="fetchEMUData"
          >{{ $t("apply") }}</b-button
        >
      </div>
      <div class="col-12" v-if="items && items.length > 0">
        <b-table
          head-variant="light"
          responsive
          sticky-header
          bordered
          hover
          :items="items"
          :fields="fields"
          show-empty
          :empty-text="$t('no_data_to_display')"
        >
        </b-table>
      </div>
    </b-modal>
    <b-modal
      ref="viewEMUMonthly"
      hide-footer
      centered
      :title="$t('selectLocation')"
      no-close-on-backdrop
    >
      <div class="d-block text-left default-button modaladmin-heading">
        <h5>{{ $t("selectLocation") }}</h5>
        <treeselect
          :multiple="true"
          :options="computedLocList"
          :show-count="true"
          :placeholder="$t('search')"
          v-model="selectedNode"
          :flat="true"
          :default-expand-level="1"
        />
      </div>
      <div class="d-flex justify-content-end">
        <b-button
          class="btn btn-primary black-btn blue-btn mt-2 w-25"
          variant="outline-warning"
          block
          @click="fetchEMUDataMonthly"
          >{{ $t("apply") }}</b-button
        >
      </div>

      <div class="col-12" v-if="monthlyItems && monthlyItems.length > 0">
        <b-table
          head-variant="light"
          responsive
          sticky-header
          bordered
          hover
          :items="monthlyItems"
          :fields="monthlyFields"
          show-empty
          :empty-text="$t('no_data_to_display')"
        >
        </b-table>
      </div>
    </b-modal>
  </div>
</template>
<script>
import dataM from "./DataMassaging.js";
import service from "@/service";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import ModalPopup from "./ModalPopup";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";

export default {
  props: [
    "type",
    "dqrConfig",
    "orgList",
    "indicatorList",
    "matrixList",
    "dataElementList",
    "dataSetList",
    "sectorRepo",
  ],
  mixins: [DynamicImageMixin],
  components: {
    ModalPopup,
    Treeselect,
    Translations: () =>
      import(
        /*webpackChunkName: 'translations'*/ "@/components/config/Common/Translations"
      ),
  },
  data() {
    return {
      viewEMUPopup: false,
      viewEMUPopupMonthly: false,
      EMUResponse: null,
      EMUResponseMonthly: null,
      selectedND: [],
      selectedNode: [],
      selectedNodeFpIndex: [],
      dataOnContraceptiveOption: [
        { value: "Yes", text: "Yes" },
        { value: "No", text: "No" },
      ],
      backTrackMonth: [],
      form: {
        email: "",
        email2: "",
        checked: "",
        selected1: "",
        options1: [
          { value: null, text: "Please select some item" },
          { value: "a", text: "This is First option" },
          { value: "b", text: "Default Selected Option" },
          { value: "c", text: "This is another option" },
          { value: "d", text: "This one is disabled", disabled: true },
        ],
        optionsInFp: [
          { value: "Yes", text: "Yes" },
          { value: "No", text: "No" },
          { value: "Partially", text: "Partially" },
        ],
      },
      sectorObj: {},
      fields: "",
      monthlyFields: "",
      items: "",
      monthlyItems: "",
    };
  },
  watch: {
    computedBackTrackMonth(newVal) {
      console.log(newVal);
    },
    EMUResponse() {
      let itemsn = [],
        flds = [];
      if (this.EMUResponse) {
        let pes = dataM.getYearFormated(
          this.dqrConfig.emu[this.type]["initialYear"],
          this.dqrConfig.emu[this.type]["finalYear"]
        );
        let peArr = pes.split(";");
        let EMUData = this.EMUResponse;
        let index = 1;
        flds.push(
          { name: "Location", selector: (row) => row.location },
          { name: "Period", selector: (row) => row.period },
          { name: "EMU - inc condom", selector: (row) => row.emuIncondom },
          { name: "EMU - ex condom", selector: (row) => row.emuExcondom }
        );
        peArr.forEach((pe) => {
          this.selectedNode.forEach((loc) => {
            let row = EMUData.rows.filter((obj) => {
              return obj[1] === pe && obj[2] === loc;
            });
            if (row.length) {
              let loc = EMUData.metaData.items[row[0][2]]["name"];
              let emuInc = EMUData.metaData.items[row[0][0]]["name"].includes(
                "Inc"
              )
                ? row[0][3]
                : row[1][3];
              let emuEx = EMUData.metaData.items[row[1][0]]["name"].includes(
                "Exc"
              )
                ? row[1][3]
                : row[0][3];
              let obj = {
                id: index++,
                location: loc,
                period: row[0][1],
                emuIncondom: emuInc,
                emuExcondom: emuEx,
              };
              // itemsn.push([rowIndex + 1, loc, row[1], emuInc, emuEx])
              itemsn.push(obj);
            }
          });
        });
      }
      this.fields = flds;
      this.items = itemsn;
      console.log(this.items);

      // const tbData = {
      //     flds,
      //     itemsn
      // };
      // setTableData(tbData);
    },
    EMUResponseMonthly() {
      let itemsn = [],
        flds = [];
      if (this.EMUResponseMonthly && this.EMUResponseMonthly.rows.length > 0) {
        let startDate = this.$moment(
            this.dqrConfig.emu_monthly[this.type]["initialYear"]
          ),
          endDate = this.$moment(
            this.dqrConfig.emu_monthly[this.type]["finalYear"]
          ).add(1, "year"),
          months = [];

        while (startDate.isBefore(endDate)) {
          months.push(startDate.format("YYYYMM"));
          startDate.add(1, "month");
        }
        //let sYear = months.join(";")
        let EMUData = this.EMUResponseMonthly;
        let index = 1;
        flds.push(
          { name: "Location", selector: (row) => row.location },
          { name: "Period", selector: (row) => row.period },
          { name: "Monthly EMU ", selector: (row) => row.emu }
        );
        months.forEach((pe, rowIndex) => {
          this.selectedNode.forEach((loc, locindex) => {
            let row = EMUData.rows.filter((obj) => {
              return obj[1] === pe && obj[2] === loc;
            });
            if (row.length) {
              let loc = EMUData.metaData.items[row[0][2]]["name"];
              let emuVal = row[0][3];
              let periodString = this.$moment(row[0][1]).format("MMMM YY");
              let obj = {
                id: index++,
                location: loc,
                period: periodString,
                emu: emuVal,
              };
              itemsn.push(obj);
            }
          });
        });
      }
      this.monthlyFields = flds;
      this.monthlyItems = itemsn;
      console.log(this.monthlyItems);
    },
  },
  methods: {
    updateDDT(type, value) {
      let findKey = this.dqrConfig.emu.Background_Data.defaultDataType.find(
        (find) => find === key
      );
      if (!findKey && value === "Yes") {
        this.dqrConfig.emu.Background_Data.defaultDataType.push(key);
      } else if (findKey && value === "No") {
        this.dqrConfig.emu.Background_Data.defaultDataType.filter(
          (remove) => remove === key
        );
      }
    },
    deleteDe(index, subIndex, id, mainKey) {
      let getData = this.dqrConfig,
        type = this.type;
      let arr =
        getData.emu[type][mainKey][index]["indicator"]["subIndicator"][
          subIndex
        ]["selectedDE"];
      arr.forEach((de, ind) => {
        if (de["id"] === id) {
          arr.splice(ind, 1);
        }
      });
      getData.emu[type][mainKey][index]["indicator"]["subIndicator"][subIndex][
        "selectedDE"
      ] = arr;
      this.$set(this.dqrConfig, "emu", getData.emu);
    },
    getAllDEs(val, index, subIndex, keyType, title, insideOf, emuType) {
      console.log(val, index, subIndex, keyType, title, insideOf, emuType);
      let data = this.dqrConfig;
      if (title === "Indicator") {
        console.log("opt1");
        data[emuType][this.type][insideOf][index]["indicator"]["subIndicator"][
          subIndex
        ]["type"] = "indicator";
      } else if (title === "Data Element") {
        console.log("opt2");
        data[emuType][this.type][insideOf][index]["indicator"]["subIndicator"][
          subIndex
        ]["type"] = "data_element";
      } else if (title === "Data Sets") {
        console.log("opt3");
        data[emuType][this.type][insideOf][index]["indicator"]["subIndicator"][
          subIndex
        ]["type"] = "data_sets";
      }

      // let innerKeyTyppe = "selectedDE";
      // let ar =
      //   data.emu[type][insideOf][index]["indicator"]["subIndicator"][subindex][
      //     innerKeyTyppe
      //   ];
      // data.emu[type][insideOf][index]["indicator"]["subIndicator"][subindex][
      //   innerKeyTyppe
      // ] = [...ar, val];
      // updateDEs(val, index, keyType);
      this.updateSubInd(index, subIndex, "selectedDE", val, insideOf, emuType);
      //setElementType([index, title, insideOf]);
      // let actData = this.config;
      // let ar = actData.stockOut[this.indKey][keyType][index]["selectedDE"];
      // actData.stockOut[this.indKey][keyType][index]["selectedDE"] = [
      //   ...ar,
      //   val,
      // ];
      // if (title === "Indicator") {
      //   actData[insideOf][this.indKey]["methods"][index]["type"] = "indicator";
      // } else if (title === "Data Element") {
      //   actData[insideOf][this.indKey]["methods"][index]["type"] =
      //     "data_element";
      // } else if (title === "Data Sets") {
      //   actData[insideOf][this.indKey]["methods"][index]["type"] = "data_sets";
      // }

      this.$set(this.dqrConfig, "emu", data.emu);
    },
    updateSubInd(index, subIndex, key, val, insideOf, emuType) {
      console.log(this.dqrConfig, index, subIndex, key, val, insideOf, emuType);
      let getData = this.dqrConfig;
      if (key === "selectedDE") {
        let ar =
          getData[emuType][this.type][insideOf][index]["indicator"][
            "subIndicator"
          ][subIndex]["selectedDE"];
        getData[emuType][this.type][insideOf][index]["indicator"][
          "subIndicator"
        ][subIndex]["selectedDE"] = [...ar, val];
      } else {
        getData[emuType][this.type][insideOf][index]["indicator"][
          "subIndicator"
        ][subIndex][key] = val;
      }
      this.dqrConfig = getData;
    },
    updateTrackingYear(val) {
      console.log(val);
      let getData = this.dqrConfig,
        type = this.type;
      getData["emu"][type]["backTrackingMonth"] = val;
      getData["emu_monthly"][type]["backTrackingMonth"] = val;
      let curr_date = this.$moment().format("YYYY-MM");
      let bYearMonth1 = this.$moment(curr_date, "YYYY-MM")
        .subtract(val, "months")
        .format("YYYY-MM");
      getData["emu"][type]["backTrackedYearMonth"] = bYearMonth1;
      let fYear1 = this.$moment(curr_date, "YYYY-MM")
        .subtract(val, "months")
        .format("YYYY");
      console.log(bYearMonth1, fYear1);
      getData["emu"][type]["finalYear"] = fYear1;
      this.$set(this.dqrConfig, "emu", getData["emu"]);

      // this.dqrConfig = getData;
    },
    saveJson() {
      // this.dqrConfig.emu_monthly[this.type]["chartData"] =
      //   this.dqrConfig.emu[this.type]["chartData"];

      this.dqrConfig.emu_monthly[this.type]["chartData"].forEach((obj) => {
        this.dqrConfig.emu[this.type]["chartData"].forEach((emuObj) => {
          let subIndArray = obj.indicator.subIndicator;
          subIndArray.forEach((subObj) => {
            let statName = subObj.static_name;
            let findInAnnual = emuObj.indicator.subIndicator.filter((obj) => {
              return obj.static_name == statName;
            });
            if (findInAnnual.length > 0) {
              subObj["selectedDE"] = findInAnnual[0]["selectedDE"];
              subObj["de"] = findInAnnual[0]["de"];
            }
          });
        });
      });
      this.dqrConfig.emu_monthly.Background_Data.SSDataRecentYear =
        this.dqrConfig.emu.Background_Data.SSDataRecentYear;
      this.dqrConfig.emu_monthly[this.type]["finalYear"] =
        this.dqrConfig.emu[this.type]["finalYear"];
      this.dqrConfig.emu_monthly[this.type]["initialYear"] =
        this.dqrConfig.emu[this.type]["initialYear"];
      this.dqrConfig.emu_monthly[this.type]["dataOnContraceptive"] =
        this.dqrConfig.emu[this.type]["dataOnContraceptive"];
      this.$store.commit("setLoading", true);
      let key = this.generateKey("dqrModule");
      service
        .updateConfig({
          data: this.dqrConfig,
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
              data: this.dqrConfig,
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
    showViewEMUPopup() {
      this.$refs["viewEMUAnnual"].show();
    },
    showViewEMUPopupMonthly() {
      this.$refs["viewEMUMonthly"].show();
    },
    fetchEMUData() {
      console.log(this.selectedNode, this.dqrConfig, this.type, "selectedNode");
      if (this.selectedNode && this.selectedNode.length) {
        this.$store.commit("setLoading", true);
        this.EMUResponse = null;
        this.setItems = [];
        let locs = this.selectedNode.join(";");
        let periodData = this.$store.getters.getGlobalFactors(
          "fp-dashboard",
          false
        ).period.Period;
        let d = new Date();
        if (this.$store.getters.getAppSettings.calendar === "nepali") {
          const { adToBs } = require("@sbmdkl/nepali-date-converter");
        const bsDate = adToBs(
          `${d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()}`
        );
        d = bsDate.split("-")[0] + bsDate.split("-")[1];
        }
        let recentYearMonth = this.$moment(d, "YYYYMM")
          .subtract(periodData.backtrackedMonth * 1, "months")
          .format("YYYY-MM");
        let recentYear =
          recentYearMonth.split("-")[1] != 12
            ? recentYearMonth.split("-")[0] * 1 - 1
            : recentYearMonth.split("-")[0];
        let startYear = this.$moment(recentYearMonth, "YYYY-MM")
          .subtract(periodData.backtrackedYearLimit * 1, "years")
          .format("YYYY");

        let pes = dataM.getYearFormated(startYear, recentYear);
        let tp =
          this.type === "Commodities_Client"
            ? "Commodities Client"
            : this.type === "Commodities_Facilities"
            ? "Commodities Facilities"
            : this.type;

        let deNameInc = "EMU: " + tp + " - Inc. Condom";
        let deNameEx = "EMU: " + tp + " - Exc. Condom";
        let isExistDEAr = this.dataElementList.filter((obj) => {
          return (
            obj["displayName"] === deNameInc || obj["displayName"] === deNameEx
          );
        });
        console.log(this.dataElementList, isExistDEAr, "check de");
        if (isExistDEAr.length) {
          //console.log("Data Element already exist", isExistDEAr)
          let actDEID = isExistDEAr[0]["id"];
          let actDEID1 = isExistDEAr[1] ? isExistDEAr[1]["id"] : null;
          let des = actDEID && actDEID1 ? actDEID + ";" + actDEID1 : actDEID;
          service
            .getAnalyticalIndicatorData(des, locs, pes)
            .then((response) => {
              this.$store.commit("setLoading", false);
              if (response.data.rows.length > 0) {
                this.EMUResponse = response.data;
              } else {
                this.$store.commit("setLoading", false);
                this.sweetAlert({
                  title: this.$i18n.t("emuNotForLocation"),
                });
              }
            });
        } else {
          this.$store.commit("setLoading", false);
          this.sweetAlert({
            title: this.$i18n.t("DataNotExists"),
          });
        }
      }
    },
    fetchEMUDataMonthly() {
      if (this.selectedNode && this.selectedNode.length) {
        this.$store.commit("setLoading", true);
        this.EMUResponse = null;
        this.setItems = [];
        let locs = this.selectedNode.join(";");
        // let startDate = this.$moment(
        //     this.dqrConfig.emu_monthly[this.type]["initialYear"]
        //   ),
        //   endDate = this.$moment(
        //     this.dqrConfig.emu_monthly[this.type]["finalYear"]
        //   ).add(1, "year"),
        let periodData = this.$store.getters.getGlobalFactors(
          "fp-dashboard",
          false
        ).period.Period;
        let d = new Date();
        if (this.$store.getters.getAppSettings.calendar === "nepali") {
          const { adToBs } = require("@sbmdkl/nepali-date-converter");
        const bsDate = adToBs(
          `${d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()}`
        );
        d = bsDate.split("-")[0] + bsDate.split("-")[1];
        }
        let recentYearMonth = this.$moment(d, "YYYYMM")
          .subtract(periodData.backtrackedMonth * 1, "months")
          .format("YYYYMM");

        let startYear = this.$moment(recentYearMonth, "YYYYMM")
          .subtract(periodData.backtrackedYearLimit * 1, "years")
          .format("YYYYMM");
        let startDate = this.$moment(startYear),
          recentYear = this.$moment(recentYearMonth).add(1, "month"),
          months = [];
        console.log(startYear, recentYearMonth);
        while (startDate.isBefore(recentYear)) {
          months.push(startDate.format("YYYYMM"));
          startDate.add(1, "month");
        }
        console.log(months, "months array");
        let sYear = months.join(";");
        let tp =
          this.type === "Commodities_Client"
            ? "Commodities Client"
            : this.type === "Commodities_Facilities"
            ? "Commodities Facilities"
            : this.type;
        let deName = "Monthly EMU : " + tp;

        let isExistDEAr = this.dataElementList.filter((obj) => {
          return obj["displayName"] === deName;
        });
        if (isExistDEAr.length) {
          let actDEID = isExistDEAr[0]["id"];
          service
            .getAnalyticalIndicatorData(actDEID, locs, sYear)
            .then((response) => {
              this.$store.commit("setLoading", false);
              if (response.data.rows.length > 0) {
                this.EMUResponseMonthly = response.data;
              } else {
                this.$store.commit("setLoading", false);
                this.sweetAlert({
                  title: this.$i18n.t("emuNotForLocation"),
                });
              }
            });
        } else {
          this.$store.commit("setLoading", false);
          this.sweetAlert({
            title: this.$i18n.t("DataNotExists"),
          });
        }
      }
    },
    saveSectorRepo() {
      let repoData = this.sectorRepo ? this.sectorRepo : {};
      console.log(repoData, this.selectedNodeFpIndex, this.type);
      let loc = this.sectorRepo[this.selectedNodeFpIndex];
      if (!repoData[this.selectedNodeFpIndex]) {
        repoData[this.selectedNodeFpIndex] = {};
      }
      if (!repoData[this.selectedNodeFpIndex][this.type]) {
        repoData[this.selectedNodeFpIndex][this.type] = {};
      }
      console.log(repoData[this.selectedNodeFpIndex]);
      console.log(this.sectorObj);
      repoData[this.selectedNodeFpIndex][this.type] = this.sectorObj;
      this.SectorRepo = repoData;
      let newObj = {};
      newObj["sectorReporting"] = repoData;
      console.log(newObj);
      console.log(repoData);
      let key = this.generateKey("annualSectorReporting");
      service
        .updateConfig({
          data: newObj,
          tableKey: key,
          namespace: "fp-dashboard",
        })
        .then((resp) => {
          this.$store.commit("setLoading", true);
          if (resp.data.status === "OK") {
            this.$store.commit("setLoading", false);
            this.sweetAlert({
              title: this.$i18n.t("updateSuccessful"),
            });
          }
        })
        .catch((err) => {
          this.$store.commit("setLoading", false);
          // //console.log(err)
          // //console.log("Something went wrong");
          this.sweetAlert({
            title: this.$i18n.t("error2"),
          });
        });
    },
    updateLocation() {
      let repoData = this.sectorRepo;
      if (
        repoData &&
        repoData[this.selectedNodeFpIndex] &&
        repoData[this.selectedNodeFpIndex][this.type]
      ) {
        this.sectorObj = repoData[this.selectedNodeFpIndex][this.type];
        console.log(this.sectorObj);
      } else {
        let obj = {};
        obj["governmentHealth"] = "Yes";
        obj["ngo"] = "Yes";
        obj["otherSector"] = "Yes";
        obj["pharmacy"] = "Yes";
        obj["privateHospital"] = "Yes";
        obj["reporting"] = "Yes";
        obj["shopChurchFriend"] = "Yes";
        obj["type"] = this.type;
        this.sectorObj = obj;
      }
    },
  },
  computed: {
    computedBackTrackMonth() {
      let mnt = this.dqrConfig.emu[this.type]["backTrackingMonth"]
        ? this.dqrConfig.emu[this.type]["backTrackingMonth"]
        : 1;
      return mnt;
    },
    computedLocList() {
      this.updateLocation();
      return this.orgList;
    },
  },
  created() {
    console.log("sectorRepo in emuDataMapping", this.dqrConfig);
    const arr = [];
    for (let i = 1; i <= 60; i++) {
      arr.push({ value: i, text: i });
    }
    this.backTrackMonth = arr;
    let getData = this.dqrConfig,
      type = this.type;
    let val = this.computedBackTrackMonth;
    getData["emu"][type]["backTrackingMonth"] = val;
    getData["emu_monthly"][type]["backTrackingMonth"] = val;
    let curr_date = this.$moment().format("YYYY-MM");
    let bYearMonth1 = this.$moment(curr_date, "YYYY-MM")
      .subtract(val, "months")
      .format("YYYY-MM");
    getData["emu"][type]["backTrackedYearMonth"] = bYearMonth1;
    let fYear1 = this.$moment(curr_date, "YYYY-MM")
      .subtract(val, "months")
      .format("YYYY");
    getData["emu"][type]["finalYear"] = fYear1;
    this.dqrConfig = getData;
  },
};
</script>
