<template>
<div class="row">
  <div class="col-12" v-for="(subInd,_j) in subIndicators" :key="_j">
    <div class="row">
      <div class="col">
        <a data-toggle="collapse" :href="'#sub_indicator0'+_i+_j" role="button" aria-expanded="false" :aria-controls="'sub_indicator0'+_i+_j" class="pr-2"><i class="fa fa-link f-s-20px" v-b-tooltip.hover
            :title="$t('link_IndicatorsData_Elements')">
          </i>
        </a>
        <span>{{Array.isArray(subInd.static_name) ? $t(`${subInd.static_name[0]}`) : $t(`${subInd.static_name}`)}}</span> <template v-if="typeof subInd.adjusted !== 'undefined'"><select class="form-control form-control-sm m-l-20px w-auto" style="display:inline-block" v-model="subInd.adjusted">
          <option :value="true">{{$t('adjusted')}}</option>
          <option :value="false">{{$t('unadjusted')}}</option>
        </select></template>
      </div>
    </div>
    <div class="row my-3">
      <div class="col-lg-12">
        <div class="collapse border-grey" :id="'sub_indicator0'+_i+_j">
          <div class="card-header bg-faint-grey default-card-border-radius color-black f-s-0-875rem">
            {{$t('indicators_Data_Elements_Mapping')}}
          </div>
          <div class="card card-body">
            <div class="row">
              <div class="col-12">
                <div class="card">
                  <div class="p-t-15px" v-if="bgDataSource !== 'Datastore'">
                    <div class="form-check form-check-inline pure-checkbox">
                      <input class="form-check-input" type="radio" :id="'dqrInlineRadio1'+_i+_j" value="indicator" v-model="subInd.type" :checked="subInd.type === 'indicator'" @change="reset(_j)" />
                      <label class="form-check-label" :for="'dqrInlineRadio1'+_i+_j">{{$t('indicators')}}</label>
                    </div>
                    <div class="form-check form-check-inline pure-checkbox">
                      <input class="form-check-input" type="radio" :id="'dqrInlineRadio2'+_i+_j" value="data_element" v-model="subInd.type" :checked="subInd.type === 'data_element'" @change="reset(_j)" />
                      <label class="form-check-label" :for="'dqrInlineRadio2'+_i+_j">{{$t('dataElements')}}</label>
                    </div>
                    <div class="form-check form-check-inline pure-checkbox">
                      <input class="form-check-input" type="radio" :id="'dqrInlineRadio3'+_i+_j" value="data_sets" v-model="subInd.type" :checked="subInd.type === 'data_sets'" @change="reset(_j)" />
                      <label class="form-check-label" :for="'dqrInlineRadio3'+_i+_j">{{$t('dataSets')}}</label>
                    </div>
                  </div>
                  <div class="card-body">
                    <div class="row" v-if="bgDataSource !== 'Datastore'">
                      <div class="col-12" v-show="subInd.type === 'indicator'">
                        <div class="row">
                          <div class="col-12">
                            <b-button class="black-btn mx-1" v-b-modal="'dqrModal_indicator'+_i+_j">{{$t('addIndicator')}}</b-button>

                            <b-button class="black-btn mx-1" @click="reset(_j)">{{$t('resetbtn')}}</b-button>

                            <b-modal :id="'dqrModal_indicator'+_i+_j" hide-footer :title="$t('selectIndicator')" no-close-on-backdrop>
                              <div>
                                {{$t('selectIndicator')}}
                                <multiselect v-model="selectedIndicator" select-label="" track-by="id" label="displayName" :placeholder="$t('search_data_element')" :hide-selected="true" :options="indicatorsList"
                                  :searchable="true" :allow-empty="false">
                                  <template slot="singleLabel" slot-scope="{ option }">{{ option.displayName }}</template>
                                </multiselect>
                              </div>
                              <div class="text-right pt-3">
                                <b-button :disabled="!selectedIndicator" class="black-btn" @click="add(_j,subInd.type)">
                                  {{$t('addbtn')}}
                                </b-button>
                              </div>
                            </b-modal>
                          </div>
                          <div class="col-12 pt-3" v-if="subInd.selectedDE.length > 0">
                            {{$t('selectedIndicators')}}
                            <ul class="list-unstyled">
                              <template v-for="(de,deIndex) in subInd.selectedDE">
                                <li :key="deIndex">
                                  <i class="fa fa-trash cursor-pointer mx-3" v-b-tooltip.hover :title="$t('deletebtn')" @click="deleteSelectedDE(_j, deIndex)"></i>
                                  {{de.displayName}}
                                  <div class="form-group row py-2 px-4 ml-2">
                                    <div class="col-sm-5">
                                      <input type="text" class="form-control form-control-sm" :placeholder="$t('displayName')" v-model="de.updatedName" @change="updateName(_j, deIndex, de)" />
                                    </div>
                                  </div>
                                </li>
                              </template>
                            </ul>
                          </div>
                          <div class="col-12 pt-3" v-else>
                            {{$t('noIndicatorsSelected')}}
                          </div>
                        </div>
                      </div>
                      <div class="col-12" v-show="subInd.type === 'data_element'">
                        <div class="row">
                          <div class="col-12">
                            <b-button class="black-btn mx-1" v-b-modal="'dqrModal_data_element'+_i+_j">{{$t('addDataElement')}}</b-button>

                            <b-button class="black-btn mx-1" @click="reset(_j)">{{$t('resetbtn')}}</b-button>

                            <b-modal :id="'dqrModal_data_element'+_i+_j" hide-footer :title="$t('selectDataElement')" no-close-on-backdrop>
                              <div>
                                {{$t('selectDataElement')}}
                                <multiselect v-model="selectedDataelement" select-label="" track-by="id" label="displayName" :placeholder="$t('search_data_element')" :options="dataElementsList" :searchable="true"
                                  :allow-empty="false">
                                  <template slot="singleLabel" slot-scope="{ option }">{{ option.displayName }}</template>
                                </multiselect>
                              </div>
                              <div v-if="selectedDataelement" class="pt-3">
                                {{$t('selectCategoryCombo')}}
                                <multiselect v-model="selectedCategoryCombo" select-label="" track-by="id" label="displayName" :placeholder="$t('search_category_combo')"
                                  :options="selectedDataelement.categoryCombo.categoryOptionCombos" :searchable="true" :allow-empty="false">
                                  <template slot="singleLabel" slot-scope="{ option }">{{ option.displayName }}</template>
                                </multiselect>
                              </div>
                              <div class="text-right pt-3">
                                <b-button :disabled="!selectedDataelement" class="black-btn" @click="add(_j,subInd.type)">{{$t('addbtn')}}</b-button>
                              </div>
                            </b-modal>
                          </div>
                          <div class="col-12 pt-3" v-if="subInd.selectedDE.length > 0">
                            {{$t('selectedDataElements')}}
                            <ul class="list-unstyled">
                              <template v-for="(de,deIndex) in subInd.selectedDE">
                                <li :key="deIndex">
                                  <i class="fa fa-trash cursor-pointer mx-3" v-b-tooltip.hover :title="$t('deletebtn')" @click="deleteSelectedDE(_j, deIndex)"></i>
                                  {{de.displayName}}
                                  <div class="form-group row py-2 px-4 ml-2">
                                    <div class="col-sm-5">
                                      <input type="text" class="form-control form-control-sm" :placeholder="$t('displayName')" v-model="de.updatedName" @change="updateName(_j, deIndex, de)" />
                                    </div>
                                  </div>
                                </li>
                              </template>
                            </ul>
                          </div>
                          <div class="col-12 pt-3" v-else>
                            {{$t('no_Data_Elements_selected')}}
                          </div>
                        </div>
                      </div>
                      <div class="col-12" v-if="subInd.type === 'data_sets'">
                        <div class="row">
                          <div class="col-12">
                            <b-button class="black-btn mx-1" v-b-modal="'dqrModal_indicator'+_i+_j">{{$t('addDataSets')}}</b-button>
                            <b-button class="black-btn mx-1" @click="reset(_j)">{{$t('resetbtn')}}</b-button>
                            <b-modal :id="'dqrModal_indicator'+_i+_j" hide-footer :title="$t('selectDataSets')" no-close-on-backdrop>
                              <div>
                                {{$t('selectMetrics')}}
                                <multiselect v-model="dataSourceMetrix" select-label="" track-by="id" label="name" :placeholder="$t('search_data_metrix')" :hide-selected="true"
                                  :options="metrixList" :searchable="true" :allow-empty="false">
                                  <template slot="singleLabel" slot-scope="{ option }">{{ option.name }}</template>
                                </multiselect>
                              </div>
                              <div>
                                {{$t('selectDataSets')}}
                                <multiselect v-model="selectedDataSet" select-label="" track-by="id" label="displayName" :placeholder="$t('search_data_sets')" :hide-selected="true"
                                  :options="dataSetsOriginalList" :searchable="true" :allow-empty="false">
                                  <template slot="singleLabel" slot-scope="{ option }">{{ option.displayName }}</template>
                                </multiselect>
                              </div>
                              <div class="text-right pt-3">
                                <b-button :disabled="!selectedDataSet" class="black-btn" @click="add(_j,subInd.type)">{{$t('addbtn')}}</b-button>
                              </div>
                            </b-modal>
                          </div>
                          <div class="col-12 pt-3" v-if="subInd.selectedDE.length > 0">
                            {{$t('selectedDataSets')}}
                            <ul class="list-unstyled">
                              <template v-for="(de,deIndex) in subInd.selectedDE">
                                <!-- {{de}} -->
                                <li :key="deIndex">
                                  <i class="fa fa-trash cursor-pointer mx-3" v-b-tooltip.hover :title="$t('deletebtn')" @click="deleteSelectedDE(_j,deIndex)"></i>
                                  {{de.displayName}}
                                  <div class="form-group row py-2 px-4 ml-2">
                                    <div class="col-sm-5">
                                      <input type="text" class="form-control form-control-sm" :placeholder="$t('displayName')" v-model="de.updatedName" @change="updateName(_j, deIndex, de)" />
                                    </div>
                                  </div>
                                </li>
                              </template>
                            </ul>
                          </div>
                          <div class="col-12 pt-3" v-else>
                            {{$t('no_Data_Sets_selected')}}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row" v-else>
                      <div class="col-12" v-if="subInd.selectedDatastoreDE.length > 0">
                        {{$t('selectedDataElements')}}
                        <ul class="list-unstyled">
                          <template v-for="(de,deIndex) in subInd.selectedDatastoreDE">
                            <li :key="deIndex">
                              <i class="fa fa fa-circle mx-3"></i>
                              {{de.displayName}}
                              <div class="form-group row py-2 px-4 ml-2">
                                <div class="col-sm-5">
                                  <input type="text" class="form-control form-control-sm" :placeholder="$t('displayName')" v-model="de.static_displayName" @change="updateName(_j, deIndex, de)" />
                                </div>
                                <div class="col-sm-7 text-right">
                                  <b-button class="black-btn mx-1 btn-sm" @click="dataEntry(de.id)">{{$t('dataEntry')}}</b-button>
                                </div>
                              </div>
                            </li>
                          </template>
                        </ul>
                      </div>
                      <div class="col-12 pt-3" v-else>
                        {{$t('no_Data_Elements_selected')}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <dataEntryForm v-if="isDataEntry" :isDataEntry="isDataEntry" :dataEntryID="dataEntryID" :bgDataType="bgDataType" @hideModal="hideModal"/>
</div>
</template>
<script>
import dataEntryForm from './dataEntryForm'
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
export default {
  props: [
    'subIndicators',
    'resetDE',
    'addDE',
    '_i',
    'index',
    'type',
    'indicatorsList',
    'dataElementsList',
    'updateDEName',
    'deleteDE',
    'dataSetsList',
    'metrixList',
    'bgDataSource',
    'bgDataType'
  ],
  components: {
    dataEntryForm,
    Multiselect,
  },
  data() {
    return {
      selectedIndicator: "",
      selectedCategoryCombo: "",
      selectedDataelement: "",
      selectedDataSet: "",
      dataSourceMetrix: {
        "id": "Reporting rates",
        "name": "Reporting rates",
        "alias": "REPORTING_RATE"
      },
      isDataEntry: false,
      dataEntryID: "",
      dataSetsOriginalList: this.dataSetsList.filter(d => d.dataSourceGroup === 'Reporting rates')

    }
  },
  watch: {
    dataSourceMetrix(newValue) {
      if(newValue.id === "[All metrics]") {
        this.dataSetsOriginalList = this.dataSetsList
      } else {
        this.dataSetsOriginalList = this.dataSetsList.filter(d => d.dataSourceGroup === newValue.id)
      }
    }
  },
  updated() {
    // console.log(this.selectedIndicator);
  },
  created() {
    //console.log(this.dataElementsList);
    //console.log(this.indicatorsList);
    if(this.$i18n.locale === 'fr') {
      this.dataSourceMetrix = {
        "id": "Reporting rates",
        "name": this.$i18n.t('reportingRates'),
        "alias": "REPORTING_RATE"
      }
    }
  },
  methods: {
    reset(_j) {
      this.selectedIndicator = ""
      this.selectedDataelement = ""
      this.hideModals(_j);
      this.resetDE(this.index, _j, this.type);
    },
    add(_j, type) {
      this.hideModals(_j);
      if (type == "indicator") {
        this.addDE(this.index, _j, this.type, this.selectedIndicator);
        this.selectedIndicator = "";
      } else if(type == "data_sets"){
          this.addDE(this.index,_j,this.type,this.selectedDataSet);
          this.selectedDataSet = "";
      } else {
        let selectedDE = {};
        if (this.selectedCategoryCombo) {
          selectedDE["id"] = this.selectedDataelement.id + "." + this.selectedCategoryCombo.id;
          selectedDE["displayName"] = this.selectedDataelement.displayName + " " + this.selectedCategoryCombo.displayName;
          selectedDE["updatedName"] = this.selectedDataelement.displayName + " " + this.selectedCategoryCombo.displayName;
        } else {
          selectedDE["id"] = this.selectedDataelement.id;
          selectedDE["displayName"] = this.selectedDataelement.displayName;
          selectedDE["updatedName"] = this.selectedDataelement.displayName;
        }

        this.addDE(this.index, _j, this.type, selectedDE);
        this.selectedCategoryCombo = "";
        this.selectedDataelement = "";
      }
    },
    updateName(_j, k, de) {
      this.updateDEName(this.index, _j, k, this.type, de);
    },
    deleteSelectedDE(_j, k) {
      this.deleteDE(this.index, _j, k, this.type);
    },
    hideModals(j) {
      this.$bvModal.hide('dqrModal_data_element' + this._i + j);
      this.$bvModal.hide('dqrModal_indicator' + this._i + j);
    },
    dataEntry(id) {
      // console.log("clicked", id)
      this.dataEntryID = id
      this.isDataEntry = true
    },
    hideModal() {
      this.dataEntryID = ""
      this.isDataEntry = false
    }
  }

}
</script>
