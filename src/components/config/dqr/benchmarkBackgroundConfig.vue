<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-lg-12">
          <div class="form-group row">
            <label for="selectFPPopulation" class="col-sm-7 col-form-label">{{
              $t("family_Planning_Women_Population")
            }}</label>
            <div class="col-sm-5">
              <select
                class="form-control auto-admin"
                id="selectFPPopulation"
                v-model="moduleConfig.FPWomenPopulation"
              >
                <option value="" disabled>
                  {{ $t("select_One") }}
                </option>
                <option value="WRA">
                  {{ $t("all_women") }}
                </option>
                <option value="MWRA">
                  {{ $t("married_women") }}
                </option>
              </select>
            </div>
          </div>
          <div class="form-group row hide">
            <label for="startYearPopulation" class="col-sm-7 col-form-label">{{
              $t("initialYearOfData")
            }}</label>
            <div class="col-sm-5">
              <input
                type="number"
                class="form-control"
                id="startYearPopulation"
                placeholder=""
                v-model="moduleConfig.startingYear"
              />
            </div>
          </div>
          <div class="form-group row hide">
            <label for="yearPopulation" class="col-sm-7 col-form-label">{{
              $t("completeService")
            }}</label>
            <div class="col-sm-5">
              <input
                type="number"
                class="form-control"
                id="yearPopulation"
                placeholder=""
                v-model="moduleConfig.SSDataRecentYear"
              />
            </div>
          </div>
          <div class="form-group row" v-if="autoSaveOption">
            <label for="autoSaveEMU" class="col-sm-7 col-form-label">{{
              $t("autoSaveEMU")
            }}</label>
            <div class="col-sm-5">
              <select
                class="form-control auto-admin"
                id="autoSaveEMU"
                v-model="moduleConfig.autoSaveEMU"
              >
                <option value="Visits">
                  {{ $t("visits") }}
                </option>
                <option value="Commodities_Client">
                  {{ $t("Commodities_Client") }}
                </option>
                <option value="Commodities_Facilities">
                  {{ $t("Commodities_Facilities") }}
                </option>
                <option value="User">
                  {{ $t("users") }}
                </option>
              </select>
            </div>
          </div>
          <div class="form-group row" v-if="defaultEMUOption">
            <label for="defaultEMU" class="col-sm-7 col-form-label">{{
              $t("defaultEMU")
            }}</label>
            <div class="col-sm-5">
              <select
                class="form-control custom-select"
                id="defaultEMU"
                v-model="moduleConfig.defaultEMU"
              >
                <option value="Visits">
                  {{ $t("visits") }}
                </option>
                <option value="Commodities_Client">
                  {{ $t("Commodities_Client") }}
                </option>
                <option value="Commodities_Facilities">
                  {{ $t("Commodities_Facilities") }}
                </option>
                <option value="User">
                  {{ $t("users") }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group row" v-if="defaultEMUOption">
            <label for="adjustmentFactor" class="col-sm-7 col-form-label">{{
              $t("adjustmentFactor")
            }}</label>
            <div class="col-sm-5">
              <select
                class="form-control custom-select"
                id="adjustmentFactor"
                v-model="moduleConfig.adjustmentFactor"
              >
                <option value="Yes">
                  {{ $t("yes") }}
                </option>
                <option value="No">
                  {{ $t("no") }}
                </option>
              </select>
            </div>
          </div>
          <div class="form-group row" v-if="$store.getters.getAppSettings.isIC">
            <label for="emuSaveType" class="col-sm-7 col-form-label">{{
              $t("emuSaveType")
            }}</label>
            <div class="col-sm-5">
              <select
                class="form-control auto-admin"
                id="emuSaveType"
                v-model="moduleConfig.emuSaveType"
              >
                <option value="Custom">
                  {{ $t("EMUSource") }}
                </option>
                <option value="Indicator_Calculator">
                  {{ $t("dataElementIC") }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="p-1 accordion-header f-s-0-875rem font-weight-bold bt-10"
      :id="'adBMBackgroundSettings'"
    >
      <h2 class="mb-0 mt-lg-n1">
        <button
          class="btn btn-link w-100 text-left f-s-0-875rem"
          type="button"
          data-toggle="collapse"
          :data-target="'#dqrBMBackgroundCollapseSettings'"
          aria-expanded="false"
          aria-controls="dqrBMBackgroundCollapseSettings"
        >
          {{ $t("Background Data Setup") }}
        </button>
      </h2>
    </div>

    <div
      :id="'dqrBMBackgroundCollapseSettings'"
      class="collapse border-module"
      :aria-labelledby="'adBMBackgroundSettings'"
    >
      <div class="col-12">
        <div
          class="card"
          v-for="(method, _i) in moduleConfig.backgroundIndicators"
          :key="_i"
        >
          <!-- <div class="card-header">
            {{ $t(`${method.name}`) }}
          </div> -->
          <div class="card-body">
            <div class="form-group row">
              <label for="selectBGSource" class="col-sm-7 col-form-label">{{
                $t("dataSource")
              }}</label>
              <div class="col-sm-5">
                <select
                  class="form-control"
                  id="selectBGSource"
                  v-model="method.bgDataSource"
                >
                  <option value="" disabled>
                    {{ $t("select_One") }}
                  </option>
                  <option value="Datastore">
                    {{ $t("datastore") }}
                  </option>
                  <option value="Datasets">
                    {{ $t("dataSets") }}
                  </option>
                </select>
              </div>
            </div>
            <subIndicatorComponent
              :_i="'_background_' + _i"
              type="backgroundIndicators"
              :index="_i"
              :subIndicators="method.subIndicators"
              :indicatorsList="indicatorsList"
              :dataElementsList="dataElementsList"
              :dataSetsList="dataSetsList"
              :matrixList="matrixList"
              :updateDEName="updateDEName"
              :bgDataSource="method.bgDataSource"
              :bgDataType="moduleConfig.FPWomenPopulation"
            />
          </div>
        </div>
      </div>
    </div>
    <p>&nbsp;</p>
    <div
      class="p-1 accordion-header f-s-0-875rem font-weight-bold bt-10 mt-25px mt-lg-n4"
      :id="'adBMMordernConterseptiveSettings'"
    >
      <h2 class="mb-0 mt-lg-n1">
        <button
          class="btn btn-link w-100 text-left f-s-0-875rem"
          type="button"
          data-toggle="collapse"
          :data-target="'#dqrBMMordernConterceptivesCollapseSettings'"
          aria-expanded="false"
          aria-controls="dqrBMMordernConterceptivesCollapseSettings"
        >
          {{ $t("fP_Source_of_Modern_Contraceptive") }}
        </button>
      </h2>
    </div>
    <div
      :id="'dqrBMMordernConterceptivesCollapseSettings'"
      class="collapse border-module"
      :aria-labelledby="'adBMMordernConterseptiveSettings'"
    >
      <div class="col-12 card-body">
        <div class="form-group row">
          <label for="selectBGSourceFP" class="col-sm-7 col-form-label">{{
            $t("dataSource")
          }}</label>
          <div class="col-sm-5">
            <select
              class="form-control"
              id="selectBGSourceFP"
              v-model="moduleConfig.bgDataSource"
            >
              <option value="" disabled>
                {{ $t("select_One") }}
              </option>
              <option value="Datastore">
                {{ $t("datastore") }}
              </option>
              <option value="Datasets">
                {{ $t("dataSets") }}
              </option>
            </select>
          </div>
        </div>
        <div
          class="card"
          v-for="(method, _i) in moduleConfig.fpSourceIndicators"
          :key="_i"
        >
          <div
            class="card-header f-s-0-875rem p-b-10px accordion-header1 f-s-0-875rem font-weight-bold bt-10"
          >
            {{
              Array.isArray(method.static_name)
                ? $t(`${method.static_name[0]}`)
                : $t(`${method.static_name}`)
            }}
          </div>
          <div class="card card-body admin-emucard mb-4">
            <indicatorMappingComponent
              :_i="'_fpsourceindicators_' + _i"
              type="fpSourceIndicators"
              :index="_i"
              :subIndicators="method.subIndicators"
              :updateDEName="updateDEName"
              :indicatorsList="indicatorsList"
              :dataElementsList="dataElementsList"
              :dataSetsList="dataSetsList"
              :matrixList="matrixList"
              :bgDataSource="moduleConfig.bgDataSource"
              :bgDataType="moduleConfig.FPWomenPopulation"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import subIndicatorComponent from "./subIndicatorComponent";
import indicatorMappingComponent from "./indicatorMappingComponent";

export default {
  props: [
    "moduleConfig",
    "indicatorsList",
    "dataElementsList",
    "dataSetsList",
    "matrixList",
    "autoSaveOption",
    "defaultEMUOption",
  ],
  components: {
    subIndicatorComponent,
    indicatorMappingComponent,
  },
  data() {
    return {};
  },
  methods: {
    updateDEName(i, j, k, type, elem) {
      this.moduleConfig[type][i].subIndicators[j].selectedDE[k] = elem;
    },
  },
};
</script>
