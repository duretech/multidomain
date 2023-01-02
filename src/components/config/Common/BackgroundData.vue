<template>
  <div class="p-2 border" :class="{ 'mb-3': moduleKey === 'dqrDashboard' }">
    <template v-if="subTabGroup.includes('-IC-')">
      <b-row>
        <b-col sm="12" lg="6">
          <b-row>
            <b-col sm="5"
              ><label :for="`bgData-sd-${i}-${j}`">{{
                $t("standardDeviation")
              }}</label></b-col
            >
            <b-col sm="7">
              <b-input-group :id="`bgData-sd-${i}-${j}`">
                <b-form-input
                  min="1"
                  max="5"
                  step="1"
                  type="number"
                  v-model="backgroundData.standardDeviation"
                ></b-form-input>
                <b-input-group-append is-text>
                  <b-form-input
                    v-model="backgroundData.standardDeviation"
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                  ></b-form-input>
                </b-input-group-append>
              </b-input-group>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </template>
    <template v-if="subTabGroup.includes('-CC-')">
      <b-row>
        <b-col sm="12" class="text-right small pb-3">
          <span class="mr-4">
            <strong>*Info 1: </strong> Used for charts with 2 source
          </span>
          <span>
            <strong>*Info 2: </strong> Used for charts with single source
          </span>
        </b-col>
        <b-col sm="12" lg="6" class="mb-3">
          <b-row>
            <b-col sm="5"
              ><label
                :for="`bgData-r2-${i}-${j}`"
                v-html="$t('dqrtext', { num: '<sup>2</sup>' })"
              ></label
            ></b-col>
            <b-col sm="7">
              <b-input-group :id="`bgData-r2-${i}-${j}`">
                <b-form-input
                  min="0.01"
                  max="1"
                  step="0.01"
                  type="number"
                  v-model="backgroundData.r2Max"
                ></b-form-input>
                <b-input-group-append is-text>
                  <b-form-input
                    v-model="backgroundData.r2Max"
                    type="range"
                    min="0.01"
                    max="1"
                    step="0.01"
                  ></b-form-input>
                </b-input-group-append>
              </b-input-group>
            </b-col>
          </b-row>
        </b-col>
        <b-col sm="12" lg="6" class="mb-3">
          <b-row>
            <b-col sm="5"
              ><label :for="`bgData-minOutlier-${i}-${j}`"
                >{{ $t("min_outlier")
                }}<sub><strong>&nbsp;(*Info 1)</strong></sub></label
              ></b-col
            >
            <b-col sm="7">
              <b-input-group :id="`bgData-minOutlier-${i}-${j}`">
                <b-form-input
                  min="1"
                  max="100"
                  step="1"
                  type="number"
                  v-model="backgroundData.minOutlier"
                ></b-form-input>
                <b-input-group-append is-text>
                  <b-form-input
                    v-model="backgroundData.minOutlier"
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                  ></b-form-input>
                </b-input-group-append>
              </b-input-group>
            </b-col>
          </b-row>
        </b-col>
        <b-col sm="12" lg="6" class="mb-3">
          <b-row>
            <b-col sm="5"
              ><label :for="`bgData-wastageFactor-${i}-${j}`"
                >{{ $t("wastageFactor")
                }}<sub><strong>&nbsp;(*Info 1)</strong></sub></label
              ></b-col
            >
            <b-col sm="7">
              <b-input-group :id="`bgData-wastageFactor-${i}-${j}`">
                <b-form-input
                  min="1"
                  max="100"
                  step="1"
                  type="number"
                  v-model="backgroundData.wastageFactor"
                ></b-form-input>
                <b-input-group-append is-text>
                  <b-form-input
                    v-model="backgroundData.wastageFactor"
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                  ></b-form-input>
                </b-input-group-append>
              </b-input-group>
            </b-col>
          </b-row>
        </b-col>
        <b-col sm="12" lg="6" class="mb-3">
          <b-row>
            <b-col sm="5"
              ><label :for="`bgData-outliersColor-${i}-${j}`">{{
                $t("outliers_color")
              }}</label></b-col
            >
            <b-col sm="7">
              <b-input-group :id="`bgData-outliersColor-${i}-${j}`">
                <b-form-input
                  type="text"
                  v-model="backgroundData.outliersColor"
                ></b-form-input>
                <b-input-group-append>
                  <b-form-input
                    type="color"
                    class="w-40px"
                    v-model="backgroundData.outliersColor"
                  ></b-form-input>
                </b-input-group-append>
              </b-input-group>
            </b-col>
          </b-row>
        </b-col>
        <b-col sm="12" lg="6" class="mb-3">
          <b-row>
            <b-col sm="5"
              ><label :for="`bgData-idleTrendColor-${i}-${j}`">{{
                $t("idle_trend_color")
              }}</label></b-col
            >
            <b-col sm="7">
              <b-input-group :id="`bgData-idleTrendColor-${i}-${j}`">
                <b-form-input
                  type="text"
                  v-model="backgroundData.idleTrendColor"
                ></b-form-input>
                <b-input-group-append>
                  <b-form-input
                    type="color"
                    class="w-40px"
                    v-model="backgroundData.idleTrendColor"
                  ></b-form-input>
                </b-input-group-append>
              </b-input-group>
            </b-col>
          </b-row>
        </b-col>
        <b-col sm="12" lg="6" class="mb-3">
          <b-row>
            <b-col sm="5"
              ><label :for="`bgData-linearTrendColor-${i}-${j}`">{{
                $t("linear_trend_color")
              }}</label></b-col
            >
            <b-col sm="7">
              <b-input-group :id="`bgData-linearTrendColor-${i}-${j}`">
                <b-form-input
                  type="text"
                  v-model="backgroundData.linearTrendColor"
                ></b-form-input>
                <b-input-group-append>
                  <b-form-input
                    type="color"
                    class="w-40px"
                    v-model="backgroundData.linearTrendColor"
                  ></b-form-input>
                </b-input-group-append>
              </b-input-group>
            </b-col>
          </b-row>
        </b-col>
        <b-col sm="12" lg="6" class="mb-3">
          <b-row>
            <b-col sm="5"
              ><label :for="`bgData-qualityThreshold-${i}-${j}`"
                >{{ $t("qualityThreshold")
                }}<sub><strong>&nbsp;(*Info 2)</strong></sub></label
              ></b-col
            >
            <b-col sm="7">
              <b-input-group :id="`bgData-qualityThreshold-${i}-${j}`">
                <b-form-input
                  min="1"
                  max="100"
                  step="1"
                  type="number"
                  v-model="backgroundData.qualityThreshold"
                ></b-form-input>
                <b-input-group-append is-text>
                  <b-form-input
                    v-model="backgroundData.qualityThreshold"
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                  ></b-form-input>
                </b-input-group-append>
              </b-input-group>
            </b-col>
          </b-row>
        </b-col>
        <b-col sm="12" lg="6" class="mb-3">
          <b-row>
            <b-col sm="5"
              ><label :for="`bgData-qualityThresholdColor-${i}-${j}`"
                >{{ $t("threshold_color")
                }}<sub><strong>&nbsp;(*Info 2)</strong></sub></label
              ></b-col
            >
            <b-col sm="7">
              <b-input-group :id="`bgData-qualityThresholdColor-${i}-${j}`">
                <b-form-input
                  type="text"
                  v-model="backgroundData.qualityThresholdColor"
                ></b-form-input>
                <b-input-group-append>
                  <b-form-input
                    type="color"
                    class="w-40px"
                    v-model="backgroundData.qualityThresholdColor"
                  ></b-form-input>
                </b-input-group-append>
              </b-input-group>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </template>
  </div>
</template>
<script>
export default {
  props: ["i", "j", "moduleKey", "subTabGroup", "backgroundData"],
};
</script>
