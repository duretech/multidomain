<template>
  <b-card-text>
    <div class="md_nested_tabs module-spacing p-4 mapviz-section">
      <b-tabs
        card
        class=""
        nav-class="p-0 m-0 mb-3"
        nav-wrapper-class="adminConfigInner p-0 mb-3 main-border mt-lg-n2"
      >
        <b-tab
          :title="tabName"
          class="pl-2 pb-0 pt-0 pr-0 border-adminmain b-5"
        >
          <b-card-text>
            <div class="card mt-4 pt-2 m-b-20px mx-3 pr-2">
              <!-- <div
                class="card-header map-header p-5px accordion"
                :id="'headingThree' + type"
              >
                <h2 class="mb-0">
                  <button
                    class="btn btn-link w-100 text-left color-white"
                    type="button"
                    data-toggle="collapse"
                    :data-target="'#groupDiv' + type"
                    aria-expanded="true"
                    :aria-controls="'groupDiv' + type"
                  >
                  
                  </button>
                </h2>
              </div>
              <div
                :id="'#groupDiv' + type"
                class="collapse show border-module"
                :aria-labelledby="'headingThree' + type"
              >
                <div class="card-body">
                
                </div>
              </div> -->
              <template>
                <div class="accordion" role="tablist">
                  <b-card no-body class="mb-1">
                    <b-card-header
                      header-tag="header"
                      class="p-1 map-header f-s-0-875rem font-weight-bold"
                      role="tab"
                    >
                      <b-button block v-b-toggle.accordion-1 variant="info">
                        {{ tabName }}</b-button
                      >
                    </b-card-header>
                    <b-collapse
                      id="accordion-1"
                      visible
                      accordion="my-accordion"
                      role="tabpanel"
                      class="border-module"
                    >
                      <b-card-body>
                        <b-card-text>
                          <b-row>
                            <b-col sm="6">
                              <div v-if="filteredData.length && !showForm">
                                <input
                                  type="text"
                                  class="form-control search-control w-50"
                                  :placeholder="$t('search')"
                                  v-model="searchName"
                                />
                              </div>
                            </b-col>
                            <b-col sm="6" class="text-right">
                              <b-button
                                class="addgrpBtn"
                                @click="addData"
                                v-if="!showForm"
                              >
                                <img
                                  class="w-14 mt-xl-n2"
                                  src="@/assets/images/icons/plusicon.png"
                                />
                                <span class="px-1"> {{ addBtnTxt }} </span>
                              </b-button>
                            </b-col>
                            <b-col sm="12" v-if="showForm">
                              <b-card
                                header-tag="header"
                                body-class="border-module"
                                header-class="p-0"
                              >
                                <template #header>
                                  <h6 class="card-header map-header">
                                    {{ editData ? editFrmTxt : addFrmTxt }}
                                  </h6>
                                </template>
                                <b-card-text>
                                  <b-row>
                                    <b-col sm="6">
                                      <div class="form-group row">
                                        <label class="col-sm-4 col-form-label"
                                          >{{ $t("displayName")
                                          }}<sup
                                            ><span class="text-danger"
                                              >*</span
                                            ></sup
                                          ></label
                                        >
                                        <div class="col-sm-8 translate-height">
                                          <b-input-group>
                                            <input
                                              type="text"
                                              class="form-control"
                                              placeholder=""
                                              v-model="
                                                formData.name[$i18n.locale]
                                              "
                                              disabled
                                            />
                                            <b-input-group-append is-text>
                                              <Translations
                                                :transText.sync="formData.name"
                                              />
                                            </b-input-group-append>
                                          </b-input-group>
                                        </div>
                                      </div>
                                    </b-col>
                                    <b-col sm="6" v-if="type !== 'indicators'">
                                      <div class="form-group row">
                                        <label
                                          class="col-sm-4 col-form-label"
                                          >{{ $t("groupDesc") }}</label
                                        >
                                        <div class="col-sm-8">
                                          <b-input-group>
                                            <b-form-textarea
                                              id="textarea"
                                              v-model="
                                                formData.description[
                                                  $i18n.locale
                                                ]
                                              "
                                              :placeholder="
                                                $t('enterGroupDesc')
                                              "
                                              rows="3"
                                              max-rows="6"
                                              disabled
                                            ></b-form-textarea>
                                            <b-input-group-append is-text>
                                              <Translations
                                                :transText.sync="
                                                  formData.description
                                                "
                                              />
                                            </b-input-group-append>
                                          </b-input-group>
                                        </div>
                                      </div>
                                    </b-col>
                                    <b-col sm="6" v-if="type !== 'groups'">
                                      <div class="form-group row">
                                        <label class="col-sm-4 col-form-label"
                                          >{{ $t("group")
                                          }}<sup
                                            ><span class="text-danger"
                                              >*</span
                                            ></sup
                                          ></label
                                        >
                                        <div class="col-sm-8">
                                          <select
                                            class="form-control"
                                            v-model="formData.groupId"
                                          >
                                            <option
                                              v-for="group in getOpt(
                                                this.groups
                                              )"
                                              :key="group.id"
                                              :value="group.id"
                                            >
                                              {{ group.name[$i18n.locale] }}
                                            </option>
                                          </select>
                                        </div>
                                      </div>
                                    </b-col>
                                    <b-col
                                      sm="6"
                                      v-if="
                                        type === 'indicators' &&
                                        formData.groupId
                                      "
                                    >
                                      <div class="form-group row">
                                        <label class="col-sm-4 col-form-label"
                                          >{{ $t("subGroup")
                                          }}<sup
                                            ><span class="text-danger"
                                              >*</span
                                            ></sup
                                          ></label
                                        >
                                        <div class="col-sm-8">
                                          <select
                                            class="form-control"
                                            v-model="formData.subGroupId"
                                          >
                                            <option
                                              v-for="subgroup in getOpt(
                                                this.groups,
                                                formData.groupId
                                              )"
                                              :key="subgroup.id"
                                              :value="subgroup.id"
                                            >
                                              {{ subgroup.name[$i18n.locale] }}
                                            </option>
                                          </select>
                                        </div>
                                      </div>
                                    </b-col>
                                    <b-col sm="6" v-if="type === 'indicators'">
                                      <div class="form-group row">
                                        <label
                                          class="col-sm-4 col-form-label"
                                          >{{ $t("source") }}</label
                                        >
                                        <div
                                          class="col-sm-8 translate-adminheight"
                                        >
                                          <b-input-group>
                                            <input
                                              type="text"
                                              class="form-control"
                                              placeholder=""
                                              v-model="
                                                formData.source[$i18n.locale]
                                              "
                                              disabled
                                            />
                                            <b-input-group-append is-text>
                                              <Translations
                                                :transText.sync="
                                                  formData.source
                                                "
                                              />
                                            </b-input-group-append>
                                          </b-input-group>
                                        </div>
                                      </div>
                                    </b-col>
                                    <b-col sm="12" v-if="type === 'indicators'">
                                      <div class="form-group row mb-0">
                                        <label
                                          class="col-sm-2 col-form-label"
                                          >{{ $t("scales") }}</label
                                        >
                                        <div class="col-sm-10">
                                          <b-tabs
                                            content-class="mt-3"
                                            class="charts-tabs"
                                          >
                                            <b-tab
                                              v-for="(
                                                levelScale, levelIndex
                                              ) in formData.levels"
                                              :key="levelIndex"
                                              :title="levelScale.levelName"
                                            >
                                              <div
                                                class="card-body border-adminmain border-adminradius mt-3 mb-3"
                                              >
                                                <p></p>
                                                <div class="row pb-2 pt-2">
                                                  <div class="col-4 mb-3">
                                                    <div class="input-group">
                                                      <div
                                                        class="input-group-prepend"
                                                      >
                                                        <div
                                                          class="input-group-text p-1"
                                                        >
                                                          <input
                                                            type="color"
                                                            class="form-control w-40px mt-lg-n1"
                                                            placeholder=""
                                                            v-model="
                                                              paletteColor
                                                            "
                                                            style="
                                                              border-top-right-radius: 0px;
                                                              border-bottom-right-radius: 0px;
                                                            "
                                                          />
                                                        </div>
                                                      </div>
                                                      <input
                                                        type="text"
                                                        class="form-control"
                                                        placeholder=""
                                                        v-model="paletteColor"
                                                        style="
                                                          margin-left: -4px;
                                                        "
                                                      />
                                                    </div>
                                                  </div>
                                                  <div class="col-8">
                                                    <div
                                                      class="row color-admingroup"
                                                    >
                                                      <div class="col-6">
                                                        <div
                                                          class="input-group p-0-5px"
                                                        >
                                                          <div
                                                            class="input-group-prepend"
                                                          >
                                                            <div
                                                              class="input-group-text p-1 px-2 cursor-pointer"
                                                              v-b-tooltip.hover
                                                              :title="
                                                                $t(
                                                                  'percentageInfo'
                                                                )
                                                              "
                                                            >
                                                              <i
                                                                class="fa fa-info f-s-0-875rem"
                                                              ></i>
                                                            </div>
                                                          </div>
                                                          <input
                                                            type="number"
                                                            min="-99"
                                                            max="99"
                                                            class="form-control col-4"
                                                            placeholder=""
                                                            v-model="
                                                              percentageLight
                                                            "
                                                          />
                                                          <b-form-input
                                                            id="percentageLight-range-1"
                                                            v-model="
                                                              percentageLight
                                                            "
                                                            class="form-control"
                                                            type="range"
                                                            min="-99"
                                                            max="99"
                                                            step="1"
                                                          ></b-form-input>
                                                        </div>
                                                      </div>
                                                      <div class="col-6">
                                                        <div
                                                          class="input-group p-0-5px"
                                                        >
                                                          <div
                                                            class="input-group-prepend mx-0"
                                                          >
                                                            <div
                                                              class="input-group-text p-1 px-2 cursor-pointer"
                                                              v-b-tooltip.hover
                                                              :title="
                                                                $t('shadesInfo')
                                                              "
                                                            >
                                                              <i
                                                                class="fa fa-info f-s-0-875rem"
                                                              ></i>
                                                            </div>
                                                          </div>
                                                          <input
                                                            type="number"
                                                            min="4"
                                                            max="9"
                                                            class="form-control col-4"
                                                            placeholder=""
                                                            v-model="
                                                              shadesNumber
                                                            "
                                                          />
                                                          <b-form-input
                                                            id="shadesNumber-range-1"
                                                            v-model="
                                                              shadesNumber
                                                            "
                                                            class="form-control mx-1"
                                                            type="range"
                                                            min="4"
                                                            max="9"
                                                            step="1"
                                                          ></b-form-input>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div
                                                  class="row pb-4 color-shades"
                                                >
                                                  <div class="col-7">
                                                    <div
                                                      class="row mx-0 palettee1"
                                                    >
                                                      <div
                                                        class="p-3 border"
                                                        v-for="(
                                                          shade, i
                                                        ) in shades"
                                                        :key="i"
                                                        :style="{
                                                          'background-color':
                                                            shade,
                                                        }"
                                                      ></div>
                                                    </div>
                                                  </div>
                                                  <div class="col-5 text-right">
                                                    <b-button
                                                      class="black-btn btn-sm mx-1 admin-greybtn"
                                                      @click.prevent.stop="
                                                        applyPalette(levelIndex)
                                                      "
                                                      >{{
                                                        $t("apply")
                                                      }}</b-button
                                                    >
                                                    <b-button
                                                      class="black-btn blue-btn btn-sm"
                                                      @click.prevent.stop="
                                                        applyPalette('all')
                                                      "
                                                      >{{
                                                        $t("applyAll")
                                                      }}</b-button
                                                    >
                                                  </div>
                                                </div>
                                                <div class="row pb-4">
                                                  <div class="col-12">
                                                    <div
                                                      class="cursor-pointer small"
                                                    >
                                                      <span
                                                        @click="
                                                          showShades =
                                                            !showShades
                                                        "
                                                        ><u>{{
                                                          $t("predefinedColors")
                                                        }}</u></span
                                                      >
                                                    </div>
                                                    <transition
                                                      name="slide-fade"
                                                    >
                                                      <div
                                                        v-if="showShades"
                                                        class="border p-2 border-radius-4px"
                                                      >
                                                        <div
                                                          class="row mx-0"
                                                          v-for="(
                                                            predefinedShade, i
                                                          ) in predefinedShades"
                                                          :key="i"
                                                          :class="
                                                            predefinedShades.length -
                                                              1 ===
                                                            i
                                                              ? ''
                                                              : 'pb-2'
                                                          "
                                                        >
                                                          <div class="col-5">
                                                            <div
                                                              class="row mx-0"
                                                            >
                                                              <div
                                                                class="p-3 border col"
                                                                v-for="(
                                                                  shade, i
                                                                ) in predefinedShade"
                                                                :key="i"
                                                                :style="{
                                                                  'background-color':
                                                                    shade,
                                                                }"
                                                              ></div>
                                                            </div>
                                                          </div>
                                                          <div
                                                            class="col-7 text-right"
                                                          >
                                                            <b-button
                                                              class="black-btn btn-sm mx-1"
                                                              @click.prevent.stop="
                                                                applyPalette(
                                                                  levelIndex,
                                                                  predefinedShade
                                                                )
                                                              "
                                                              >{{
                                                                $t("apply")
                                                              }}</b-button
                                                            >
                                                            <b-button
                                                              class="black-btn blue-btn btn-sm mx-1"
                                                              @click.prevent.stop="
                                                                applyPalette(
                                                                  'all',
                                                                  predefinedShade
                                                                )
                                                              "
                                                              >{{
                                                                $t("applyAll")
                                                              }}</b-button
                                                            >
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </transition>
                                                  </div>
                                                </div>
                                                <div class="row pb-2">
                                                  <div class="col-5">
                                                    {{ $t("autoScaling") }}
                                                  </div>
                                                  <div class="col-7">
                                                    <b-form-checkbox
                                                      checked="levelScale.isAutoRange"
                                                      v-model="
                                                        levelScale.isAutoRange
                                                      "
                                                      name="check-button"
                                                      switch
                                                      size="lg"
                                                      @change="
                                                        autoScaling(
                                                          levelIndex,
                                                          formData.name[
                                                            $i18n.locale
                                                          ],
                                                          levelScale.isAutoRange
                                                        )
                                                      "
                                                    >
                                                    </b-form-checkbox>
                                                  </div>
                                                </div>
                                                <div
                                                  class="row pb-2"
                                                  v-for="(
                                                    scaleRow, scaleIndex
                                                  ) in levelScale.scales"
                                                  :key="scaleIndex"
                                                >
                                                  <div
                                                    class="col-sm-4 translate-adminheight"
                                                    :class="{
                                                      'col-sm-6':
                                                        levelScale.isAutoRange,
                                                    }"
                                                  >
                                                    <b-input-group>
                                                      <input
                                                        type="text"
                                                        class="form-control"
                                                        :placeholder="
                                                          $t('label')
                                                        "
                                                        v-model="
                                                          levelScale.scales[
                                                            scaleIndex
                                                          ].scaleLabel[
                                                            $i18n.locale
                                                          ]
                                                        "
                                                        disabled
                                                      />
                                                      <b-input-group-append
                                                        is-text
                                                      >
                                                        <Translations
                                                          :transText.sync="
                                                            levelScale.scales[
                                                              scaleIndex
                                                            ].scaleLabel
                                                          "
                                                        />
                                                      </b-input-group-append>
                                                    </b-input-group>
                                                  </div>
                                                  <div
                                                    class="col-sm-2"
                                                    :class="{
                                                      hide: levelScale.isAutoRange,
                                                    }"
                                                  >
                                                    <input
                                                      type="text"
                                                      class="form-control"
                                                      :placeholder="
                                                        $t(
                                                          'placeholderLowRange'
                                                        )
                                                      "
                                                      v-model="
                                                        levelScale.scales[
                                                          scaleIndex
                                                        ].lowScale
                                                      "
                                                      :disabled="
                                                        scaleIndex === 0 &&
                                                        !levelScale.isAutoRange
                                                          ? false
                                                          : true
                                                      "
                                                      :class="{
                                                        'border-danger':
                                                          errorIndex.includes(
                                                            `low${levelIndex}${scaleIndex}`
                                                          ),
                                                      }"
                                                      @change="
                                                        validateInput(
                                                          levelIndex,
                                                          scaleIndex,
                                                          'low',
                                                          levelScale.scales[
                                                            scaleIndex
                                                          ].lowScale,
                                                          formData.name[
                                                            $i18n.locale
                                                          ]
                                                        )
                                                      "
                                                    />
                                                  </div>
                                                  <div
                                                    class="col-sm-2"
                                                    :class="{
                                                      hide: levelScale.isAutoRange,
                                                    }"
                                                  >
                                                    <input
                                                      type="text"
                                                      class="form-control"
                                                      :placeholder="
                                                        $t(
                                                          'placeholderHighRange'
                                                        )
                                                      "
                                                      v-model="
                                                        levelScale.scales[
                                                          scaleIndex
                                                        ].highScale
                                                      "
                                                      :class="{
                                                        'border-danger':
                                                          errorIndex.includes(
                                                            `high${levelIndex}${scaleIndex}`
                                                          ),
                                                      }"
                                                      :disabled="
                                                        levelScale.isAutoRange
                                                      "
                                                      @change="
                                                        validateInput(
                                                          levelIndex,
                                                          scaleIndex,
                                                          'high',
                                                          levelScale.scales[
                                                            scaleIndex
                                                          ].highScale,
                                                          formData.name[
                                                            $i18n.locale
                                                          ]
                                                        )
                                                      "
                                                    />
                                                  </div>
                                                  <div
                                                    class="input-group col-sm-4"
                                                    :class="{
                                                      'col-sm-6':
                                                        levelScale.isAutoRange,
                                                    }"
                                                  >
                                                    <div
                                                      class="input-group-prepend"
                                                    >
                                                      <div
                                                        class="input-group-text p-1"
                                                      >
                                                        <input
                                                          type="color"
                                                          class="form-control w-40px mt-lg-n1"
                                                          placeholder=""
                                                          v-model="
                                                            levelScale.scales[
                                                              scaleIndex
                                                            ].scaleColor
                                                          "
                                                          style="
                                                            border-top-right-radius: 0px;
                                                            border-bottom-right-radius: 0px;
                                                          "
                                                        />
                                                      </div>
                                                    </div>
                                                    <input
                                                      type="text"
                                                      class="form-control"
                                                      placeholder=""
                                                      v-model="
                                                        levelScale.scales[
                                                          scaleIndex
                                                        ].scaleColor
                                                      "
                                                      style="margin-left: -4px"
                                                    />
                                                  </div>
                                                </div>
                                                <button
                                                  @click="addScale(levelIndex)"
                                                  class="btn black-btn btn-sm btn-secondary mr-2 blue-btn"
                                                >
                                                  {{ $t("addbtn") }}
                                                </button>
                                                <button
                                                  v-if="
                                                    levelScale.scales.length > 4
                                                  "
                                                  @click="
                                                    removeScale(levelIndex)
                                                  "
                                                  class="btn black-btn btn-sm btn-secondary"
                                                >
                                                  {{ $t("deletebtn") }}
                                                </button>
                                              </div>
                                            </b-tab>
                                          </b-tabs>
                                        </div>
                                      </div>
                                    </b-col>
                                    <b-col sm="12" v-if="type === 'indicators'">
                                      <div class="text-right mb-3">
                                        <b-button
                                          class="black-btn blue-btn btn-sm"
                                          @click.prevent.stop="copyTo()"
                                          >{{ $t("copyTobtn") }}</b-button
                                        >
                                        <b-modal
                                          :id="'copyToModal'"
                                          hide-footer
                                          centered
                                          :title="$t('copyTobtn')"
                                          no-close-on-backdrop
                                        >
                                          <div
                                            class="my-2"
                                            v-if="
                                              levelsSelect.length > 0 &&
                                              levelsTreeSelect.length > 0
                                            "
                                          >
                                            <div class="from-levels mb-2">
                                              <span class="small">{{
                                                $t("from")
                                              }}</span>
                                              <b-form-select
                                                v-model="selectedLevel"
                                                size="sm"
                                                :options="levelsSelect"
                                              >
                                                <template v-slot:first>
                                                  <b-form-select-option
                                                    :value="null"
                                                    disabled
                                                    >{{
                                                      $t("selectPlaceholder")
                                                    }}</b-form-select-option
                                                  >
                                                </template>
                                              </b-form-select>
                                            </div>
                                            <div class="to-levels mb-2">
                                              <span class="small">{{
                                                $t("to")
                                              }}</span>
                                              <b-form-select
                                                v-model="selectedTreeLevel"
                                                size="sm"
                                                :options="levelsTreeSelect"
                                                multiple
                                                :select-size="4"
                                              >
                                                <template v-slot:first>
                                                  <b-form-select-option
                                                    :value="null"
                                                    disabled
                                                    >{{
                                                      $t("selectPlaceholder")
                                                    }}</b-form-select-option
                                                  >
                                                </template>
                                              </b-form-select>
                                              <div
                                                class="mt-1"
                                                style="font-size: 0.6875rem"
                                              >
                                                <strong
                                                  >{{ $t("note") }}:
                                                </strong>
                                                {{ $t("multiSelectNote") }}
                                              </div>
                                            </div>
                                            <div class="copy-options small">
                                              <b-form-group>
                                                <b-form-checkbox-group
                                                  id="checkbox-copy-options"
                                                  v-model="selectedCopyOption"
                                                  name="copy-options"
                                                >
                                                  <b-form-checkbox
                                                    value="labels"
                                                    >{{
                                                      $t("labels")
                                                    }}</b-form-checkbox
                                                  >
                                                  <b-form-checkbox
                                                    value="range"
                                                    >{{
                                                      $t("range")
                                                    }}</b-form-checkbox
                                                  >
                                                  <b-form-checkbox
                                                    value="colors"
                                                    >{{
                                                      $t("colors")
                                                    }}</b-form-checkbox
                                                  >
                                                </b-form-checkbox-group>
                                              </b-form-group>
                                            </div>
                                            <div class="text-right">
                                              <b-button
                                                class="black-btn blue-btn btn-sm"
                                                @click.prevent.stop="copy()"
                                                >{{ $t("copybtn") }}</b-button
                                              >
                                            </div>
                                          </div>
                                        </b-modal>
                                      </div>
                                    </b-col>
                                    <b-col sm="6" v-if="type === 'indicators'">
                                      <div class="form-group row">
                                        <label
                                          for="inputChartSource"
                                          class="col-sm-4 col-form-label"
                                          >{{ $t("chartInformation") }}</label
                                        >
                                        <div class="col-sm-8">
                                          <b-input-group>
                                            <b-form-textarea
                                              id="inputChartInfo"
                                              v-model="
                                                formData.chartInfo[$i18n.locale]
                                              "
                                              :state="
                                                formData.chartInfo &&
                                                formData.chartInfo[
                                                  $i18n.locale
                                                ] &&
                                                formData.chartInfo[$i18n.locale]
                                                  .length !== 0 &&
                                                formData.chartInfo[$i18n.locale]
                                                  .length <= chartInfoMaxLength
                                              "
                                              :placeholder="
                                                chartInfoPlaceholder
                                              "
                                              rows="3"
                                              :maxlength="chartInfoMaxLength"
                                              disabled
                                            ></b-form-textarea>
                                            <b-input-group-append is-text>
                                              <Translations
                                                :transText.sync="
                                                  formData.chartInfo
                                                "
                                              />
                                            </b-input-group-append>
                                          </b-input-group>
                                          <span
                                            >{{
                                              formData.chartInfo[$i18n.locale]
                                                ? formData.chartInfo[
                                                    $i18n.locale
                                                  ].length
                                                : 0
                                            }}/{{ chartInfoMaxLength }}</span
                                          >
                                        </div>
                                      </div>
                                    </b-col>
                                    <b-col sm="6">
                                      <div class="form-group row">
                                        <label
                                          class="col-sm-4 col-form-label"
                                          >{{ $t("visible") }}</label
                                        >
                                        <div class="col-sm-8">
                                          <b-form-checkbox
                                            checked="formData.visible"
                                            v-model="formData.visible"
                                            name="check-button"
                                            switch
                                            size="lg"
                                          >
                                          </b-form-checkbox>
                                        </div>
                                      </div>
                                    </b-col>
                                    <b-col
                                      class="col-sm-6"
                                      v-if="
                                        $store.getters.getNamespace.includes(
                                          '_fp-dashboard'
                                        ) && type === 'indicators'
                                      "
                                    >
                                      <div class="form-group row">
                                        <label
                                          class="col-sm-4 col-form-label"
                                          >{{ $t("useSavedEMU") }}</label
                                        >
                                        <div class="col-sm-8">
                                          <b-form-checkbox
                                            v-model="formData.isSavedData"
                                            name="check-button"
                                            switch
                                            size="lg"
                                          >
                                          </b-form-checkbox>
                                        </div>
                                      </div>
                                    </b-col>
                                    <b-col
                                      sm="12"
                                      v-if="
                                        !formData.isSavedData &&
                                        type === 'indicators'
                                      "
                                    >
                                      <div class="form-group row">
                                        <div class="col-12">
                                          <div
                                            class="card-header map-header f-s-0-875rem p-10px accordion-header1 f-s-0-875rem font-weight-bold bt-10"
                                          >
                                            {{
                                              $t(
                                                "indicators_Data_Elements_Mapping"
                                              )
                                            }}
                                          </div>
                                        </div>
                                        <div
                                          class="col-12"
                                          v-for="(
                                            subIndicator, ind
                                          ) in formData.subIndicator"
                                          :key="ind"
                                        >
                                          <div
                                            class="card card-body admin-emucard"
                                          >
                                            <AddMapping
                                              :matrixList="matrixList"
                                              :dataSetsList="dataSetsList"
                                              :indicatorsList="indicatorsList"
                                              :dataElementsList="
                                                dataElementsList
                                              "
                                              :modalKey="
                                                'add-mapping' +
                                                ('chartBySubtype' + type) +
                                                ind +
                                                ('chartByType' + type)
                                              "
                                              :mappingType.sync="
                                                formData.subIndicator[ind].type
                                              "
                                              :selectedDE.sync="
                                                formData.subIndicator[ind]
                                                  .selectedDE
                                              "
                                              v-if="isDataFetched"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </b-col>
                                    <b-col sm="12">
                                      <div class="text-right">
                                        <b-button
                                          @click="showForm = !showForm"
                                          class="btn-dark ml-4 mx-3"
                                          >{{ $t("cancelbtn") }}</b-button
                                        >
                                        <b-button
                                          @click="processData"
                                          class="btn-dark blue-btn"
                                          :disabled="disableBtn"
                                          >{{
                                            editData
                                              ? $t("update")
                                              : $t("savebtn")
                                          }}</b-button
                                        >
                                      </div>
                                    </b-col>
                                  </b-row>
                                </b-card-text>
                              </b-card>
                            </b-col>
                            <b-col sm="12">
                              <div
                                v-if="filteredData.length"
                                class="mt-3 table-responsive"
                              >
                                <table class="table table-bordered">
                                  <thead class="thead-dark">
                                    <tr>
                                      <th
                                        scope="col"
                                        v-if="type === 'indicators'"
                                      >
                                        {{ $t("indicator") }}
                                      </th>
                                      <th scope="col" v-if="type !== 'groups'">
                                        {{ $t("subGroup") }}
                                      </th>
                                      <th scope="col">
                                        {{ $t("group") }}
                                      </th>
                                      <th scope="col" style="width: 25%">
                                        {{ $t("action") }}
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <template v-for="data in filteredData">
                                      <tr :key="data.id">
                                        <td v-if="type === 'indicators'">
                                          {{ data.indName[$i18n.locale] }}
                                        </td>
                                        <td v-if="type !== 'groups'">
                                          {{ data.sgName[$i18n.locale] }}
                                        </td>
                                        <td>
                                          {{ data.gName[$i18n.locale] }}
                                        </td>
                                        <td>
                                          <div class="">
                                            <b-button
                                              size="sm"
                                              class="cursor-pointer editBtn"
                                              variant="dark"
                                              @click="editEntry(data.formData)"
                                            >
                                              <img
                                                src="@/assets/images/icons/editActive.svg"
                                                :style="{ filter: filterColor }"
                                                class="mt-lg-n1 w-14"
                                                v-b-tooltip.hover
                                                title="Edit"
                                              />
                                              <!-- <span class="px-1">
                                                {{ $t("edit") }}
                                              </span> -->
                                            </b-button>
                                            <b-button
                                              size="sm"
                                              variant="secondary"
                                              class="cursor-pointer deleteBtn mx-3"
                                              @click="
                                                deleteEntry(data.formData)
                                              "
                                            >
                                              <img
                                                src="@/assets/images/icons/admindelete-icon.svg"
                                                :style="{ filter: filterColor }"
                                                v-b-tooltip.hover
                                                title="Delete"
                                              />
                                              <!-- <span class="px-1">
                                                {{ $t("deletebtn") }}
                                              </span> -->
                                            </b-button>
                                          </div>
                                        </td>
                                      </tr>
                                    </template>
                                  </tbody>
                                </table>
                              </div>
                              <div class="text-center py-4" v-else>
                                {{ $t("no_data_to_display") }}
                              </div>
                            </b-col>
                            <b-col sm="12" v-if="dLen > perPage">
                              <div class="mt-3 pagination-map">
                                <b-pagination
                                  v-model="currentPage"
                                  :total-rows="dLen"
                                  :per-page="perPage"
                                  :align="'center'"
                                ></b-pagination>
                              </div>
                            </b-col>
                          </b-row>
                        </b-card-text>
                      </b-card-body>
                    </b-collapse>
                  </b-card>
                </div>
              </template>
            </div>
          </b-card-text>
        </b-tab>
      </b-tabs>
    </div>
  </b-card-text>
</template>
<script>
import service from "@/service";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import { randomString } from "@/components/Common/commonFunctions";
export default {
  props: [
    "type",
    "levels",
    "groups",
    "tabName",
    "orgList",
    "langList",
    "addBtnTxt",
    "addFrmTxt",
    "editFrmTxt",
    "matrixList",
    "dataSetsList",
    "isDataFetched",
    "indicatorsList",
    "dataElementsList",
  ],
  mixins: [DynamicImageMixin],
  components: {
    AddMapping: () =>
      import(
        /* webpackChunkName: "admin_AddMapping"*/ "@/components/config/AddMapping"
      ),
    Translations: () =>
      import(
        /*webpackChunkName: 'translations'*/ "@/components/config/Common/Translations"
      ),
  },
  data() {
    return {
      perPage: 5,
      formData: {},
      copyLevels: [],
      currentPage: 1,
      searchName: "",
      errorIndex: [],
      showForm: false,
      editData: false,
      shadesNumber: 4,
      levelsSelect: [],
      deleteData: false,
      showShades: false,
      errorIndicator: [],
      percentageLight: 40,
      selectedLevel: null,
      selectedTreeLevel: [],
      selectedCopyOption: [],
      paletteColor: "#00ff80",
      chartInfoMaxLength: 200,
      predefinedShades: [
        ["#d4ffff", "#acefff", "#84c7ff", "#5c9fef"],
        ["#ffffac", "#ffdd84", "#ffb55c", "#ed8d34"],
        ["#ffd9d3", "#ffb1ab", "#ff8983", "#e2615b"],
        ["#eaffce", "#c2ffa6", "#9ade7e", "#72b656"],
      ],
    };
  },
  computed: {
    disableBtn() {
      let d = false;
      if (
        !this.formData.name[this.$i18n.locale] ||
        (this.type === "subGroups" && !this.formData.groupId) ||
        (this.type === "indicators" &&
          (!this.formData.groupId || !this.formData.subGroupId))
      ) {
        d = true;
      }
      return d;
    },
    shades: function () {
      let shades = [this.paletteColor],
        color = this.paletteColor;
      for (let i = 1; i < this.shadesNumber; i++) {
        color = this.adjust(color, this.percentageLight * 1);
        shades.push(color);
      }
      shades = this.percentageLight * 1 < 0 ? shades : shades.reverse();
      return shades;
    },
    chartInfoPlaceholder: function () {
      return this.$i18n.t("placeholderMaxValue", {
        number: this.chartInfoMaxLength,
      });
    },
    levelsTreeSelect: function () {
      return this.levelsSelect.filter((l) => l.value !== this.selectedLevel);
    },
    groupedData() {
      let gData = [];
      if (this.type === "groups") {
        this.groups.forEach((g) => {
          gData.push({
            id: g.id,
            gName: g.name,
            formData: g, //used for edit/delete operations
          });
        });
      }
      if (this.type === "subGroups") {
        this.groups.forEach((g) => {
          g.subGroups.forEach((sub) => {
            gData.push({
              id: sub.id,
              gName: g.name,
              formData: sub, //used for edit/delete operations
              sgName: sub.name,
            });
          });
        });
      }
      if (this.type === "indicators") {
        this.groups.forEach((g) => {
          g.subGroups.forEach((sub) => {
            sub.indicators.forEach((ind) => {
              gData.push({
                id: ind.id,
                gName: g.name,
                formData: ind, //used for edit/delete operations
                sgName: sub.name,
                indName: ind.name,
              });
            });
          });
        });
      }
      return gData;
    },
    dLen() {
      return this.groupedData.length;
    },
    filteredData() {
      let filteredD = [];
      if (this.type === "groups") {
        filteredD = this.groupedData.filter(
          (a) =>
            a.gName?.[this.$i18n.locale]
              ?.toLowerCase()
              .includes(this.searchName.toLowerCase()) ||
            !a.gName?.[this.$i18n.locale]
        );
      }
      if (this.type === "subGroups") {
        filteredD = this.groupedData.filter(
          (a) =>
            a.sgName?.[this.$i18n.locale]
              ?.toLowerCase()
              .includes(this.searchName.toLowerCase()) ||
            !a.sgName?.[this.$i18n.locale] ||
            a.gName?.[this.$i18n.locale]
              ?.toLowerCase()
              .includes(this.searchName.toLowerCase())
        );
      }
      if (this.type === "indicators") {
        filteredD = this.groupedData.filter(
          (a) =>
            a.indName?.[this.$i18n.locale]
              ?.toLowerCase()
              .includes(this.searchName.toLowerCase()) ||
            !a.indName?.[this.$i18n.locale] ||
            a.gName?.[this.$i18n.locale]
              ?.toLowerCase()
              .includes(this.searchName.toLowerCase()) ||
            a.sgName?.[this.$i18n.locale]
              ?.toLowerCase()
              .includes(this.searchName.toLowerCase())
        );
      }
      return filteredD.slice(
        (this.currentPage - 1) * this.perPage,
        this.currentPage * this.perPage
      );
    },
    getOpt: function () {
      return function (groups, gId = null) {
        let grp = [];
        if (gId) {
          let isFound = groups.find((g) => g.id === gId);
          if (isFound) {
            isFound.subGroups.forEach((sub) => {
              if (sub.name?.[this.$i18n.locale]) {
                grp.push({ id: sub.id, name: sub.name });
              }
            });
          }
        } else {
          groups.forEach((g) => {
            if (g.name?.[this.$i18n.locale]) {
              grp.push({ id: g.id, name: g.name });
            }
          });
        }
        return grp;
      };
    },
  },
  methods: {
    adjust(color, amount) {
      return (
        "#" +
        color
          .replace(/^#/, "")
          .replace(/../g, (color) =>
            (
              "0" +
              Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(
                16
              )
            ).substr(-2)
          )
      );
    },
    applyPalette(levelIndex = "all", predefinedShade = null) {
      let colors = predefinedShade ? predefinedShade : this.shades;
      let updatedLevels = this.formData.levels.map((level, j) => {
        if (levelIndex !== "all") {
          if (j === levelIndex) {
            return {
              ...level,
              scales: level.scales.map((scale, k) => ({
                ...scale,
                scaleColor: colors[k],
              })),
            };
          } else {
            return level;
          }
        } else {
          return {
            ...level,
            scales: level.scales.map((scale, k) => ({
              ...scale,
              scaleColor: colors[k],
            })),
          };
        }
      });
      this.$set(this.formData, "levels", updatedLevels);
    },
    addScale(levelIndex) {
      this.formData.levels.forEach((level, i) => {
        let scale = level.scales[level.scales.length - 1];
        if (levelIndex == i) {
          level.scales.push({
            highScale: Number(scale.highScale) + 25,
            lowScale: Number(scale.highScale),
            scaleColor: "#0000ff",
            scaleLabel: this.$i18n.t("veryHigh"),
          });
        }
      });
    },
    removeScale(levelIndex) {
      this.formData.levels.forEach((level, i) => {
        if (levelIndex == i) {
          level.scales.splice(-1, 1);
        }
      });
    },
    copyTo() {
      this.levelsSelect = this.formData.levels.map((l) => ({
        text: l.levelName,
        value: l.level,
      }));
      this.copyLevels = this.formData.levels;
      this.selectedLevel = null;
      this.selectedTreeLevel = [];
      this.selectedCopyOption = [];
      this.$nextTick(() => {
        this.$bvModal.show("copyToModal");
      });
    },
    copy() {
      let mData = JSON.parse(JSON.stringify(this.formData));
      let levels = mData.levels,
        sourceLevel = levels.filter((l) => l.level === this.selectedLevel),
        targetLevel = levels.filter((l) =>
          this.selectedTreeLevel.includes(l.level)
        ),
        updatedTargetLevels = [],
        pendingLevel = levels.filter(
          (l) => !this.selectedTreeLevel.includes(l.level)
        );
      targetLevel.forEach((t) => {
        let updatedScale = [];
        t.scales.forEach((s, j) => {
          if (this.selectedCopyOption.includes("labels")) {
            s = {
              ...s,
              scaleLabel: sourceLevel[0].scales[j].scaleLabel,
            };
          }
          if (this.selectedCopyOption.includes("range")) {
            s = {
              ...s,
              highScale: sourceLevel[0].scales[j].highScale,
              lowScale: sourceLevel[0].scales[j].lowScale,
            };
          }
          if (this.selectedCopyOption.includes("colors")) {
            s = {
              ...s,
              scaleColor: sourceLevel[0].scales[j].scaleColor,
            };
          }
          updatedScale[j] = s;
        });
        updatedTargetLevels.push({
          ...t,
          scales: updatedScale,
        });
      });
      let finalLevels = [...pendingLevel, ...updatedTargetLevels].sort(
        (a, b) => {
          return a.level < b.level ? -1 : a.level == b.level ? 0 : 1;
        }
      );
      this.formData.levels = finalLevels;
      this.$nextTick(() => {
        this.$bvModal.hide("copyToModal");
      });
    },
    addData() {
      if (this.type === "groups") {
        this.formData = {
          subGroups: [],
          visible: true,
          description: "",
          id: randomString(16),
          name: { [this.$i18n.locale]: this.$i18n.t("default") },
        };
      }
      if (this.type === "subGroups") {
        this.formData = {
          groupId: null,
          visible: true,
          indicators: [],
          description: "",
          id: randomString(16),
          name: { [this.$i18n.locale]: this.$i18n.t("default") },
        };
      }
      if (this.type === "indicators") {
        this.formData = {
          source: "",
          groupId: null,
          visible: true,
          chartInfo: "",
          subGroupId: null,
          isSavedData: false,
          levels: this.levels,
          id: randomString(16),
          subIndicator: [
            {
              selectedDE: [],
              type: "indicator",
            },
          ],
          name: { [this.$i18n.locale]: this.$i18n.t("default") },
        };
      }
      this.$nextTick(() => {
        this.showForm = true;
        this.editData = false
      });
    },
    autoScaling(levelIndex, indicatorName, isAutoRange) {
      if (!isAutoRange) {
        let originalScale = [
          {
            lowScale: "0",
            highScale: "25",
          },
          {
            lowScale: "25",
            highScale: "50",
          },
          {
            lowScale: "50",
            highScale: "75",
          },
          {
            lowScale: "75",
            highScale: "100",
          },
        ];
        this.formData.levels[levelIndex].scales = this.formData.levels[
          levelIndex
        ].scales.map((s, i) => {
          this.removeIndexes(levelIndex, i, "low", indicatorName);
          this.removeIndexes(levelIndex, i, "high", indicatorName);
          return {
            ...s,
            ...originalScale[i],
          };
        });
      }
    },
    addIndexes(levelIndex, scaleIndex, scaleType, indicatorName) {
      this.errorIndex.push(`${scaleType}${levelIndex}${scaleIndex}`);
      this.errorIndicator.push(indicatorName);
    },
    removeIndexes(levelIndex, scaleIndex, scaleType, indicatorName) {
      let ind = this.errorIndex.indexOf(
        `${scaleType}${levelIndex}${scaleIndex}`
      );
      if (ind > -1) {
        this.errorIndex.splice(ind, 1);
      }

      let ind1 = this.errorIndicator.indexOf(indicatorName);
      if (ind1 > -1) {
        this.errorIndicator.splice(ind1, 1);
      }
    },
    validateInput(levelIndex, scaleIndex, scaleType, value, indicatorName) {
      if (value) {
        let scaleObj = this.formData.levels[levelIndex].scales[scaleIndex];
        let len = this.formData.levels[levelIndex].scales.length;
        let indName = Array.isArray(indicatorName)
          ? indicatorName[0]
          : indicatorName;
        if (scaleType === "low") {
          if (value > scaleObj.highScale) {
            this.addIndexes(levelIndex, scaleIndex, scaleType, indName);
          } else {
            this.removeIndexes(levelIndex, scaleIndex, scaleType, indName);
          }
        } else {
          if (value < scaleObj.lowScale * 1) {
            this.addIndexes(levelIndex, scaleIndex, scaleType, indName);
          } else {
            this.removeIndexes(levelIndex, scaleIndex, scaleType, indName);
            if (scaleIndex !== len - 1) {
              this.formData.levels[levelIndex].scales[
                `${scaleIndex + 1}`
              ].lowScale = value;
              if (
                this.formData.levels[levelIndex].scales[`${scaleIndex + 1}`]
                  .highScale *
                  1 <
                value * 1
              ) {
                this.addIndexes(
                  levelIndex,
                  `${scaleIndex + 1}`,
                  scaleType,
                  indName
                );
              } else {
                this.removeIndexes(
                  levelIndex,
                  `${scaleIndex + 1}`,
                  scaleType,
                  indName
                );
              }
            }
          }
        }
      }
    },
    processData() {
      this.$store.commit("setLoading", true);
      let key = this.generateKey("mapVisualization");
      let pData = this.formData;
      let oConfig = service.getSavedConfig({ tableKey: key });
      oConfig
        .then((response) => {
          let data = response.data;
          if (this.type == "groups") {
            let isFound = data.findIndex((o) => o.id === pData.id);
            if (this.deleteData) {
              if (isFound >= 0) {
                data.splice(isFound, 1);
              }
            } else {
              if (isFound >= 0) {
                data[isFound] = pData;
              } else {
                data.push(pData);
              }
            }
          } else if (this.type == "subGroups") {
            data.forEach((ele) => {
              if (ele.id == pData.groupId) {
                let isFound = ele.subGroups.findIndex((s) => s.id === pData.id);
                if (this.deleteData) {
                  if (isFound >= 0) {
                    ele.subGroups.splice(isFound, 1);
                  }
                } else {
                  if (isFound >= 0) {
                    ele.subGroups[isFound] = pData;
                  } else {
                    ele.subGroups.push(pData);
                  }
                }
              }
            });
          } else if (this.type == "indicators") {
            data.forEach((ele) => {
              if (ele.id == pData.groupId) {
                ele.subGroups.forEach((ind) => {
                  if (ind.id == pData.subGroupId) {
                    let isFound = ind.indicators.findIndex(
                      (s) => s.id === pData.id
                    );
                    if (this.deleteData) {
                      if (isFound >= 0) {
                        ind.indicators.splice(isFound, 1);
                      }
                    } else {
                      if (isFound >= 0) {
                        ind.indicators[isFound] = pData;
                      } else {
                        ind.indicators.push(pData);
                      }
                    }
                  }
                });
              }
            });
          }
          service
            .updateConfig({ data: data, tableKey: key })
            .then((response) => {
              if (response.data.status === "OK") {
                this.sweetAlert({
                  title: this.$i18n.t("data_saved_successfully"),
                });
                this.$emit("updateData", data);
                this.resetValues();
              } else {
                this.sweetAlert({
                  title: this.$i18n.t("error"),
                  text: `${response.data.message}`,
                });
              }
              this.$store.commit("setLoading", false);
            })
            .catch((error) => {
              console.log("error", error);
              this.sweetAlert({
                title: this.$i18n.t("error"),
              });
              this.$store.commit("setLoading", false);
            });
        })
        .catch((error) => {
          console.log("error", error);
          if (this.type == "groups") {
            let data = [this.formData];
            service
              .saveConfig({ data: data, tableKey: key })
              .then((res) => {
                if (res.data.status === "OK") {
                  this.sweetAlert({
                    title: this.$i18n.t("data_saved_successfully"),
                  });
                  this.$emit("updateData", data);
                  this.resetValues();
                } else {
                  this.sweetAlert({
                    title: this.$i18n.t("error"),
                    text: `${res.data.message}`,
                  });
                }
                this.$store.commit("setLoading", false);
              })
              .catch((err) => {
                this.sweetAlert({
                  title: this.$i18n.t("somethingwentwrong"),
                  text: `${err.message}`,
                });
                this.$store.commit("setLoading", false);
              });
          }
          this.$store.commit("setLoading", false);
        });
    },
    resetValues() {
      this.showForm = false;
      this.editData = false;
      this.deleteData = false;
    },
    editEntry(data) {
      this.formData = JSON.parse(JSON.stringify(data));
      this.editData = true;
      this.$nextTick(() => {
        this.showForm = true;
      });
    },
    deleteEntry(data) {
      this.$swal({
        title: this.$i18n.t("areyousure"),
        text: this.$i18n.t("youablerevertthis"),
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: this.$i18n.t("yes_delete_it"),
        cancelButtonText: this.$i18n.t("cancelbtn"),
      }).then((result) => {
        if (result.value) {
          this.formData = JSON.parse(JSON.stringify(data));
          this.deleteData = true;
          this.$nextTick(() => {
            this.processData();
          });
        }
      });
    },
  },
  created() {},
};
</script>