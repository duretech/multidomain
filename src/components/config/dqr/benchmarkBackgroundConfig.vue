<template>
  <div class="card">
    <div class="card-header border-radius-0 text-uppercase f-s-0-875rem">
      {{ $t("initialSetup") }}
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-lg-12">
          <div class="form-group row">
            <label for="selectFPPopulation" class="col-sm-7 col-form-label">{{
              $t("family_Planning_Women_Population")
            }}</label>
            <div class="col-sm-5">
              <select
                class="form-control"
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
          <div class="form-group row">
            <label for="yearPopulation" class="col-sm-7 col-form-label">{{
              $t("most_recent_year_which_have_complete_service_statistics_data")
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
                class="form-control"
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
                class="form-control"
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
          <div class="form-group row">
            <label for="emuSaveType" class="col-sm-7 col-form-label">{{
              $t("emuSaveType")
            }}</label>
            <div class="col-sm-5">
              <select
                class="form-control"
                id="emuSaveType"
                v-model="moduleConfig.emuSaveType"
              >
                <option value="Custom">
                  EMU source
                </option>
                <option value="Indicator_Calculator">
                  Data element- Indicator calculator
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="card-header p-5px bg-faint-grey default-card-border-radius"
      :id="'adBMBackgroundSettings'"
    >
      <h2 class="mb-0">
        <button
          class="btn btn-link w-100 text-left text-uppercase color-grey f-s-0-875rem"
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
      class="collapse collapse-section-border"
      :aria-labelledby="'adBMBackgroundSettings'"
    >
      <div class="col-12 card-body">
        <div
          class="text-right"
          v-if="$root.defaultLanguageLocale !== $i18n.locale"
        >
          <button
            type="button"
            class="btn btn-primary black-btn btn-sm"
            v-b-tooltip.hover
            :title="$t('syncInfo')"
            v-on:click="syncMappingModal('backgroundIndicators')"
          >
            {{ $t("sync_mapping") }}
          </button>
        </div>
        <div
          class="card"
          v-for="(method, _i) in moduleConfig.backgroundIndicators"
          :key="_i"
        >
          <div
            class="card-header bg-faint-grey color-black border-radius-0 text-uppercase f-s-0-875rem"
          >
            {{ $t(`${method.name}`) }}
          </div>
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
              :resetDE="resetDE"
              :addDE="addDE"
              :deleteDE="deleteDE"
              :indicatorsList="indicatorsList"
              :dataElementsList="dataElementsList"
              :dataSetsList="dataSetsList"
              :metrixList="metrixList"
              :updateDEName="updateDEName"
              :bgDataSource="moduleConfig.bgDataSource"
              :bgDataType="moduleConfig.FPWomenPopulation"
            />
          </div>
        </div>
      </div>
    </div>
    <p>&nbsp;</p>
    <div
      class="card-header p-5px bg-faint-grey default-card-border-radius"
      :id="'adBMMordernConterseptiveSettings'"
    >
      <h2 class="mb-0">
        <button
          class="btn btn-link w-100 text-left text-uppercase color-grey f-s-0-875rem"
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
      class="collapse collapse-section-border"
      :aria-labelledby="'adBMMordernConterseptiveSettings'"
    >
      <div class="col-12 card-body">
        <div
          class="text-right"
          v-if="$root.defaultLanguageLocale !== $i18n.locale"
        >
          <button
            type="button"
            class="btn btn-primary black-btn btn-sm"
            v-b-tooltip.hover
            :title="$t('syncInfo')"
            v-on:click="syncMappingModal('fpSourceIndicators')"
          >
            {{ $t("sync_mapping") }}
          </button>
        </div>
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
            class="card-header bg-faint-grey color-black border-radius-0 text-uppercase f-s-0-875rem"
          >
            {{
              Array.isArray(method.static_name)
                ? $t(`${method.static_name[0]}`)
                : $t(`${method.static_name}`)
            }}
          </div>
          <div class="card-body">
            <indicatorMappingComponent
              :_i="'_fpsourceindicators_' + _i"
              type="fpSourceIndicators"
              :index="_i"
              :subIndicators="method.subIndicators"
              :resetDE="resetDE"
              :addDE="addDE"
              :updateDEName="updateDEName"
              :deleteDE="deleteDE"
              :indicatorsList="indicatorsList"
              :dataElementsList="dataElementsList"
              :dataSetsList="dataSetsList"
              :metrixList="metrixList"
              :bgDataSource="moduleConfig.bgDataSource"
              :bgDataType="moduleConfig.FPWomenPopulation"
            />
          </div>
        </div>
      </div>
    </div>

    <p>&nbsp;</p>
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
    "metrixList",
    "autoSaveOption",
    "originalSyncKey",
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
    syncMappingModal(key) {
      this.$emit("syncMapping", key, this.originalSyncKey);
    },
    resetDE(i, j, type) {
      this.moduleConfig[type][i].subIndicators[j].selectedDE = [];
    },
    addDE(i, j, type, elem) {
      this.moduleConfig[type][i].subIndicators[j].selectedDE.push(elem);
    },
    updateDEName(i, j, k, type, elem) {
      this.moduleConfig[type][i].subIndicators[j].selectedDE[k] = elem;
    },
    deleteDE(i, j, deIndex, type) {
      this.moduleConfig[type][i].subIndicators[j].selectedDE.splice(deIndex, 1);
      if (this.moduleConfig[type][i].subIndicators[j].de) {
        this.moduleConfig[type][i].subIndicators[j].de.splice(deIndex, 1);
      }
    },
  },
};
</script>
