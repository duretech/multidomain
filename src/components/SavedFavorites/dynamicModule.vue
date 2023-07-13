<template>
  <div>
    <div class="">
      <b-collapse
        id="accordion-1"
        v-model="savedVisible"
        class="report-mainsection"
      >
        <div class="row">
          <div class="col-12">
            <div class="color-white f-w-100 mt-4 pt-5 px-4 save-heading">
              {{ $t("savedModules") }}
            </div>
          </div>
        </div>
        <template v-if="filteredDynamicModules.length > 0">
          <div class="row my-3 px-4">
            <div
              class="col-md-4 mb-3"
              v-for="module in filteredDynamicModules"
              :key="'module' + module.id"
            >
              <div class="secondDivCard commonCardDiv">
                <div class="card secCard">
                  <div class="card-body secCardBody">
                    <div class="row" style="height: 100%">
                      <div class="col-8">
                        <div
                          style="
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100%;
                          "
                        >
                          <h6
                            class="color-white f-w-500 text-uppercase mb-0"
                            style="border-bottom: 0"
                          >
                            {{ module.moduleName }}
                          </h6>
                        </div>
                      </div>
                      <div class="col-4">
                        <div
                          style="
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100%;
                          "
                        >
                          <template v-if="module.moduleLogoURL">
                            <img
                              alt="img"
                              :src="module.moduleLogoURL"
                              class="align-self-center mr-3 img img-responsive w-40px d-block m-auto"
                            />
                          </template>
                          <template v-else>
                            <img
                              alt="img"
                              :src="
                                require(`@/assets/images/home/${module.moduleLogoName}`)
                              "
                              class="align-self-center mr-3 img img-responsive w-40px d-block m-auto"
                            />
                          </template>
                        </div>
                      </div>
                    </div>
                    <div class="middle">
                      <div class="text">
                        <div class="row">
                          <div class="col-12">
                            <!-- <h6
                              class="color-white f-w-100 text-uppercase text-center"
                              style=""
                            >
                              {{ module.moduleName }}
                            </h6> -->
                          </div>
                        </div>
                        <div
                          class="row"
                          v-if="
                            ($store.getters.getIsAdmin ||
                              $store.getters.getAppSettings.bypassUser) &&
                            module.user === $store.state.loggedInUserId
                          "
                        >
                          <div class="col-4">
                            <a
                              class="actionButtons"
                              href="javascript:void(0)"
                              @click.prevent.stop="viewModule(module.id)"
                            >
                              <!-- <i class="fa fa-eye mr-1" aria-hidden="true"></i> -->
                              <img
                                alt="img"
                                :src="
                                  require('@/assets/images/icons/previewActive.svg')
                                "
                                :style="{ filter: filterColor }"
                                class="img"
                              />
                              <p>{{ $t("View") }}</p>
                            </a>
                          </div>
                          <div class="col-4">
                            <a
                              class="actionButtons"
                              href="javascript:void(0)"
                              @click.prevent.stop="editModule(module.id)"
                            >
                              <!-- <i class="fa fa-pencil-square-o mr-1" aria-hidden="true"></i> -->
                              <img
                                alt="img"
                                :src="
                                  require('@/assets/images/icons/editActive.svg')
                                "
                                :style="{ filter: filterColor }"
                                class="img"
                              />
                              <p>{{ $t("edit") }}</p>
                            </a>
                          </div>
                          <div class="col-4">
                            <a
                              class="actionButtons"
                              href="javascript:void(0)"
                              @click.prevent.stop="deleteModule(module.id)"
                            >
                              <!-- <i class="fa fa-trash mr-1" aria-hidden="true"></i> -->
                              <img
                                alt="img"
                                :src="
                                  require('@/assets/images/icons/deleteActive.svg')
                                "
                                :style="{ filter: filterColor }"
                                class="img"
                              />
                              <p>
                                {{ $t("deletebtn") }}
                              </p>
                            </a>
                          </div>
                        </div>
                        <div class="row" v-else>
                          <div class="col">{{ $t("notOwner") }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div class="col-12 text-center mt-4" v-else>
          <b-alert variant="info" show>{{ $t("noModulesAvailable") }}</b-alert>
        </div>
      </b-collapse>
    </div>
    <b-modal
      v-model="createModule"
      id="createModuleModal"
      class="createmodal"
      hide-footer
      size="xl"
      :title="isEdit ? $t('editModule') : $t('subMenu_1')"
      no-close-on-backdrop
    >
      <div class="row">
        <div class="col-10 m-auto">
          <form>
            <div class="row my-3">
              <div class="col-4">
                <label for="moduleName">{{ $t("name") }}</label>
              </div>
              <div class="col-8">
                <input
                  type="text"
                  class="form-control"
                  :placeholder="$t('moduleName')"
                  name="moduleName"
                  v-model="moduleName"
                />
              </div>
            </div>
            <div class="row my-3">
              <div class="col-4">
                <label for="moduleDescription">{{ $t("description") }}</label>
              </div>
              <div class="col-8">
                <input
                  type="text"
                  class="form-control"
                  :placeholder="$t('moduleDescription')"
                  name="moduleDescription"
                  v-model="moduleDescription"
                />
              </div>
            </div>
            <div class="row mt-3 mb-0">
              <div class="col-4">
                <label for="logo">{{ $t("logo") }}</label>
              </div>
              <div class="col-8 upload-logo">
                <div class="input-group">
                  <input
                    type="text"
                    class="form-control"
                    id="validationDefaultUsername"
                    :placeholder="$t('chooseLogo')"
                    aria-describedby="inputGroupPrepend2"
                    v-model="moduleLogoName"
                    required
                    readonly
                  />
                  <div class="input-group-prepend upload-btn cursor-pointer">
                    <!-- <div class="dropdown logoSelect-dropdown">
                      <button
                        type="button"
                        class="btn bg-white btn-block blue-btn form-control"
                      >
                        {{ $t("browse") }}
                        <i class="fa fa-caret-down pl-2" aria-hidden="true"></i>
                      </button>
                    </div> -->
                    <a
                      class="dropdown-item upload-item"
                      href="javascript:void(0)"
                    >
                      <div
                        class="file btn uploadIcondiv cursor-pointer"
                        v-b-tooltip.hover
                        :title="$t('uploadImage')"
                      >
                        <img
                          alt="img"
                          :src="require('@/assets/images/icons/plus.svg')"
                          style="width: 10px"
                          class="cursor-pointer"
                          :style="{ filter: filterColor }"
                        />
                        <input
                          type="file"
                          name="file"
                          class="uploadIconinput cursor-pointer"
                          @change="addImage"
                        />
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="row mt-0 mb-3">
              <div class="col-4"></div>
              <div class="col-8">
                <div class="dropdown-menu-wrap p-3 selectItemsDiv form-control">
                  <div class="d-flex row">
                    <div
                      class="col-4"
                      @click.prevent.stop="selectImage('home/branding.png')"
                    >
                      <a class="dropdown-item" href="javascript:void(0)"
                        ><img
                          alt="img"
                          :src="require('@/assets/images/home/branding.png')"
                      /></a>
                    </div>
                    <div
                      class="col-4"
                      @click.prevent.stop="selectImage('home/color-wheel.png')"
                    >
                      <a class="dropdown-item" href="javascript:void(0)"
                        ><img
                          alt="img"
                          :src="
                            require('@/assets/images/home/color-wheel.png')
                          "
                      /></a>
                    </div>
                    <div
                      class="col-4"
                      @click.prevent.stop="selectImage('home/drug.png')"
                    >
                      <a class="dropdown-item" href="javascript:void(0)"
                        ><img
                          alt="img"
                          :src="require('@/assets/images/home/drug.png')"
                      /></a>
                    </div>
                    <div
                      class="col-4"
                      @click.prevent.stop="selectImage('home/transform.png')"
                    >
                      <a class="dropdown-item" href="javascript:void(0)"
                        ><img
                          alt="img"
                          :src="require('@/assets/images/home/transform.png')"
                      /></a>
                    </div>
                    <div
                      class="col-4"
                      @click.prevent.stop="selectImage('home/drug.png')"
                    >
                      <a class="dropdown-item" href="javascript:void(0)"
                        ><img
                          alt="img"
                          :src="require('@/assets/images/home/drug.png')"
                      /></a>
                    </div>
                    <div class="col-4"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row my-3">
              <div class="col-4">
                <label for="logo">{{ $t("color") }}</label>
              </div>
              <div class="col-8">
                <div class="form-check">
                  <label class="form-check-label col-3">
                    <input
                      class="form-check-input radio-inline"
                      type="radio"
                      name="gridRadios"
                      id="gridRadios1"
                      value="#f8775a"
                      checked
                      v-model="moduleColor"
                    />
                    <div class="colorDiv orangeDiv"></div>
                  </label>
                  <label class="form-check-label col-3">
                    <input
                      class="form-check-input radio-inline"
                      type="radio"
                      name="gridRadios"
                      id="gridRadios2"
                      value="#23af8a"
                      v-model="moduleColor"
                    />
                    <div class="colorDiv darkGreenDiv"></div>
                  </label>
                  <label class="form-check-label col-3">
                    <input
                      class="form-check-input radio-inline"
                      type="radio"
                      name="gridRadios"
                      id="gridRadios3"
                      value="#299ac2"
                      v-model="moduleColor"
                    />
                    <div class="colorDiv blueDiv"></div>
                  </label>
                  <label class="form-check-label col-3">
                    <input
                      class="form-check-input radio-inline"
                      type="radio"
                      name="gridRadios"
                      id="gridRadios4"
                      value="#3cc06a"
                      v-model="moduleColor"
                    />
                    <div class="colorDiv greenDiv"></div>
                  </label>
                </div>
              </div>
            </div>
            <div class="row my-3">
              <div class="col-4">
                <label for="module_element">{{ $t("moduleElements") }}</label>
              </div>
              <div class="col-8">
                <div class="">
                  <treeselect
                    name="demo"
                    :multiple="treeselect.multiple"
                    :clearable="treeselect.clearable"
                    :searchable="treeselect.searchable"
                    :disabled="treeselect.disabled"
                    :open-on-click="treeselect.openOnClick"
                    :open-on-focus="treeselect.openOnFocus"
                    :clear-on-select="treeselect.clearOnSelect"
                    :close-on-select="treeselect.closeOnSelect"
                    :always-open="treeselect.alwaysOpen"
                    :append-to-body="treeselect.appendToBody"
                    :options="treeselect.moduleElementsList"
                    :show-count="true"
                    :default-expand-level="1"
                    :limit="3"
                    :flat="true"
                    v-model="treeselect.moduleElements"
                    :placeholder="$t('search')"
                  />
                </div>
                <transition name="slide-fade">
                  <div
                    class="selectItemsDiv form-control"
                    v-if="selectedElements && selectedElements.length > 0"
                  >
                    <div class="row">
                      <div
                        class="col-3 px-1 mb-2"
                        v-for="element in selectedElements"
                        :key="element.id"
                      >
                        <div class="selectItemInnerDiv">
                          <div class="clearfix">
                            <div
                              class="float-left selectInnerDivText elementlabel"
                            >
                              {{ element.label }}
                            </div>
                            <div
                              class="float-right selectInnerDivText cursor-pointer"
                              @click.prevent.stop="
                                deleteSelectedElement(element.id)
                              "
                            >
                              &times;
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
            <div class="row my-3">
              <div class="col-4">
                <label for="module_linkTo">{{ $t("linkTo") }}</label>
              </div>
              <div class="col-8">
                <b-form-select
                  size="sm"
                  id="module_linkTo"
                  v-model="selectedModule"
                  :options="modules"
                ></b-form-select>
              </div>
            </div>
          </form>
        </div>
      </div>
      <hr />
      <div class="row my-2 modal-dynamic">
        <div class="col-10 m-auto">
          <div class="row">
            <div class="col-4"></div>
            <div class="col-8">
              <button
                type="button"
                class="btn btn-secondary resetbtn submitbtn reset-create"
                @click.prevent.stop="reset"
              >
                {{ $t("resetbtn") }}
              </button>
              <button
                type="button"
                class="btn btn-primary blue-btn"
                :disabled="submitDisabled"
                @click.prevent.stop="createEditModule"
              >
                {{ isEdit ? $t("update") : $t("submitbtn") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </b-modal>

    <!-- Interactive Module 2 starts -->
    <!-- The Modal -->
    <b-modal
      v-model="editModulePopup"
      id="myModalEdit"
      hide-footer
      hide-header
      size="xl"
      content-class="bg-faint-grey"
      no-close-on-backdrop
    >
      <div class="row" v-if="draftModule">
        <div class="col-6">
          <div class="d-flex">
            <h4 class="modal-title text-uppercase">
              {{ draftModule.moduleName }}
            </h4>
          </div>
        </div>
        <div class="col-6">
          <div class="d-flex rightButtons" style="justify-content: flex-end">
            <a
              href="javascript:void(0)"
              @click.prevent.stop="isEdit = !isEdit"
              class="text-decoration-none mx-3 aBtnactive sideRightTopBtn"
            >
              <h6 class="f-w-100 text-dark pt-2 mr-3">
                <span class="border-bottom-dark">
                  <!-- <i class="fa fa-pencil-square-o mr-1" aria-hidden="true"></i> -->
                  <img
                    :src="require('@/assets/images/icons/editActive.svg')"
                    :style="{ filter: filterColor }"
                    class="img-fluid w-24 mb-1"
                  />
                  <span class="mx-1"> {{ $t("edit") }} </span></span
                >
              </h6>
            </a>
            <a
              href="javascript:void(0)"
              class="text-decoration-none mx-3 aBtnactive sideRightTopBtn"
              @click.prevent.stop="liveSubmit(draftModule.id)"
            >
              <h6 class="f-w-100 text-dark pt-2 mr-3">
                <span class="border-bottom-dark">
                  {{
                    draftModule.isLive ? $t("removeLive") : $t("liveSubmit")
                  }}</span
                >
              </h6>
            </a>
            <a
              href="javascript:void(0)"
              class="text-decoration-none mx-3 aBtnactive sideRightTopBtn"
              @click.prevent.stop="saveDraft"
            >
              <h6 class="f-w-100 text-dark pt-2 mr-3">
                <span class="border-bottom-dark">
                  {{
                    draftModule.isLive ? $t("savebtn") : $t("saveDraft")
                  }}</span
                >
              </h6>
            </a>
            <button
              type="button"
              class="close"
              @click.prevent.stop="editModulePopup = false"
            >
              &times;
            </button>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12 p-0">
          <form v-if="draftModule">
            <transition name="slide-fade">
              <template v-if="isEdit">
                <div class="row my-3 mx-0" :class="[isEdit ? '' : 'hide']">
                  <div class="col-6">
                    <div class="input-group">
                      <input
                        type="text"
                        class="form-control border border-right-0"
                        :placeholder="$t('description')"
                        v-model="draftModule.moduleDescription"
                      />
                      <div class="input-group-append">
                        <span class="input-group-text form-control"
                          ><i class="fa fa-pencil" aria-hidden="true"></i
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="">
                      <treeselect
                        name="demo"
                        :multiple="treeselect.multiple"
                        :clearable="treeselect.clearable"
                        :searchable="treeselect.searchable"
                        :disabled="treeselect.disabled"
                        :open-on-click="treeselect.openOnClick"
                        :open-on-focus="treeselect.openOnFocus"
                        :clear-on-select="treeselect.clearOnSelect"
                        :close-on-select="treeselect.closeOnSelect"
                        :always-open="treeselect.alwaysOpen"
                        :append-to-body="treeselect.appendToBody"
                        :options="treeselect.moduleElementsList"
                        :show-count="true"
                        :default-expand-level="1"
                        :limit="3"
                        :flat="true"
                        v-model="addedCharts"
                        :placeholder="$t('search')"
                      />
                    </div>
                  </div>
                  <div class="col-12 py-2 mt-2 border-top border-bottom">
                    <div class="text-right">
                      <b-button
                        @click.prevent.stop="showAddTextPopup(null)"
                        size="sm"
                        class="blue-btn"
                        >{{ $t("addbtn") }} {{ $t("text") }}</b-button
                      >
                    </div>
                  </div>
                </div>
              </template>
            </transition>
            <div
              class="row mx-0 mt-3 grid-layout-section"
              v-if="draftModule && draftModule.moduleElements"
            >
              <div class="col-12" style="padding: 0 30px">
                <gridLayout
                  :excludedHeight="120"
                  :isStaticCharts="true"
                  @syncChart="syncChart"
                  @removeChart="removeChart"
                  @showAddTextPopup="showAddTextPopup"
                  configKey="moduleElements"
                  :layout.sync="draftModule"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </b-modal>
    <b-modal
      v-model="addTextPopup"
      id="addTextPopup"
      :title="`${editChartText ? $t('update') : $t('addbtn')} ${$t('text')}`"
      hide-footer
    >
      <vue-editor
        id="inputTextarea"
        v-model="chartText"
        :state="chartText !== ''"
        placeholder=""
        :editorToolbar="customToolbar"
      ></vue-editor>
      <div class="text-right pt-3">
        <button class="btn btn-sm blue-btn" @click.stop.prevent="addTextarea">
          {{ editChartText ? $t("update") : $t("addbtn") }}
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script>
/*global settings*/
import service from "@/service";
import { VueEditor } from "vue2-editor";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import VueEditorOptionMixin from "@/helpers/VueEditorOptionMixin";
import { randomString } from "@/components/Common/commonFunctions";

export default {
  props: ["bookmarks", "savedModules", "savedModulesVisible"],
  components: {
    VueEditor,
    Treeselect,
    gridLayout: () =>
      import(
        /*webpackChunkName: 'GridLayoutComponent'*/ "@/components/ReportTemplate/GridLayoutComponent"
      ),
  },
  mixins: [DynamicImageMixin, VueEditorOptionMixin],
  data() {
    return {
      chartText: "",
      editChartText: false,
      addTextPopup: false,
      editTextID: null,
      moduleName: "",
      moduleDescription: "",
      moduleLogoURL: "",
      moduleLogoName: "",
      moduleColor: "",
      modulePeriod: "",
      treeselect: {
        multiple: true,
        clearable: true,
        searchable: true,
        disabled: false,
        openOnClick: true,
        openOnFocus: false,
        clearOnSelect: true,
        closeOnSelect: true,
        alwaysOpen: false,
        appendToBody: false,
        moduleElementsList: [],
        moduleElements: null,
      },
      dynamicModules: this.savedModules,
      savedVisible: this.savedModulesVisible,
      isEdit: false,
      updateModule: null,
      draftModule: null,
      addedCharts: null,
      prevOffsetX: 0,
      prevOffsetY: 0,
      windowWidth: 0,
      createModule: false,
      editModulePopup: false,
      modules: [],
      selectedModule: null,
    };
  },
  computed: {
    selectedElements() {
      return this.treeselect.moduleElementsList.filter(
        (e) =>
          this.treeselect.moduleElements &&
          this.treeselect.moduleElements.length > 0 &&
          this.treeselect.moduleElements.includes(e.id)
      );
    },
    submitDisabled() {
      return (
        this.moduleName &&
        this.moduleDescription &&
        (this.moduleLogoURL || this.moduleLogoName) &&
        this.moduleColor &&
        !this.treeselect.moduleElements
      );
    },
    filteredDynamicModules() {
      return this.dynamicModules.filter((d) => d.locale === this.$i18n.locale);
    },
  },
  watch: {
    bookmarks: {
      handler() {
        this.getModuleList();
      },
      deep: true,
    },
    createModule(newValue) {
      if (!newValue) {
        this.updateModule = null;
        this.isEdit = false;
        this.reset();
        this.$store.commit("setActiveTab", "");
      }
    },
    savedModules(newValue) {
      this.dynamicModules = newValue;
    },
    savedModulesVisible(newValue) {
      this.savedVisible = newValue;
    },
    addedCharts(newValue) {
      let charts = this.draftModule.moduleElements.map((m) => m.id);
      let newAddition = newValue.filter((val) => !charts.includes(val));
      if (newAddition && newAddition.length) {
        let newChart = this.bookmarks.filter((b) => newAddition.includes(b.id));
        let findY = this.findY();
        newChart = newChart.map((m) => ({
          ...m,
          chartData: {
            ...m.chartData,
            chart: {
              ...m.chartData.chart,
              type: m.chartData.chart.type,
              width: this.windowWidth,
              height: 375,
            },
          },
          x: 0,
          y: findY,
          w: 12,
          h: 13, // The grid-item height is calculated using this formula => Math.round(rowheight * h + Math.max(0, h - 1) * margin[1])
        }));
        let allCharts = [...this.draftModule.moduleElements, ...newChart];
        this.draftModule.moduleElements = [];
        this.$nextTick(() => {
          this.draftModule.moduleElements = allCharts;
        });
      } else {
        let existingChart = this.draftModule.moduleElements.filter((val) =>
          newValue.includes(val.id)
        );
        this.draftModule.moduleElements = existingChart;
      }
    },
  },
  methods: {
    findY() {
      let findY = 0;
      if (this.draftModule && this.draftModule.moduleElements.length) {
        let item = null;
        this.draftModule.moduleElements.forEach((m) => {
          if (item) {
            if (item.y < m.y) {
              item = m;
            }
          } else {
            item = m;
          }
        });
        findY = item.y + item.h;
      }
      return findY;
    },
    showAddTextPopup(chart = null) {
      if (chart) {
        this.chartText = chart.text;
        this.editTextID = chart.id;
        this.editChartText = true;
      } else {
        this.chartText = "";
      }
      this.addTextPopup = true;
    },
    addTextarea() {
      if (this.editChartText) {
        let foundIndex = this.draftModule.moduleElements.findIndex(
          (m) => m.id === this.editTextID
        );
        if (foundIndex >= 0) {
          this.draftModule.moduleElements[foundIndex] = {
            ...this.draftModule.moduleElements[foundIndex],
            text: this.chartText,
          };
        }
        this.editTextID = null;
        this.editChartText = false;
      } else {
        let findY = this.findY();
        let randomString = randomString(16);
        let newItem = {
          id: randomString,
          i: randomString,
          x: 0,
          y: findY,
          w: 12,
          h: 13, // The grid-item height is calculated using this formula => Math.round(rowheight * h + Math.max(0, h - 1) * margin[1])
          text: this.chartText,
          type: "Textarea",
          showInCard: false,
        };
        let allCharts = [...this.draftModule.moduleElements, newItem];
        this.draftModule.moduleElements = [];
        this.$nextTick(() => {
          this.draftModule.moduleElements = allCharts;
        });
      }
      this.addTextPopup = false;
    },
    liveSubmit(id) {
      this.$store.state.loading = true;
      let key = this.generateKey("dynamicModules");

      let saveConfig = service.getSavedConfig(key);
      saveConfig.then((res) => {
        let dynamicModules = res.data.map((d) => {
          if (d.id === id) {
            return {
              ...d,
              isLive: !d.isLive,
            };
          } else {
            return d;
          }
        });

        let response = service.updateConfig(dynamicModules, key);
        response.then((response) => {
          this.$emit("updateModules", dynamicModules);
          this.reset();
          this.sweetAlert({
            title: this.$i18n.t("moduleUpdated"),
          });
          this.draftModule = {
            ...this.draftModule,
            isLive: !this.draftModule.isLive,
          };
          this.$store.state.loading = false;
        });
      });
    },
    getModuleList() {
      this.treeselect.moduleElementsList = [];
      this.bookmarks.forEach((b, i) => {
        if (b.locale === this.$i18n.locale) {
          this.treeselect.moduleElementsList.push({
            label: b.name,
            id: b.id,
          });
        }
      });
    },
    selectImage(imageName) {
      this.moduleLogoURL = "";
      let image = imageName.split("/");
      this.moduleLogoName = image[image.length - 1];
    },
    addImage(e) {
      let file = e.target.files;
      if (file[0].type.includes("image")) {
        this.moduleLogoName = file[0].name;
        if (file.length > 0) {
          this.getBase64(file[0]).then((data) => {
            if (data) {
              this.moduleLogoURL = data;
            }
          });
        }
      } else {
        this.sweetAlert({
          title: this.$i18n.t("fileTypeMismatch"),
          text: this.$i18n.t("selectValidImage"),
        });
      }
    },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },
    deleteSelectedElement(id) {
      this.treeselect.moduleElements = this.treeselect.moduleElements.filter(
        (m) => m !== id
      );
    },
    reset() {
      this.moduleName = "";
      this.moduleDescription = "";
      this.moduleLogoURL = "";
      this.moduleLogoName = "";
      this.moduleColor = "";
      this.treeselect.moduleElements = null;
      this.modulePeriod = "";
    },
    showAlert(response) {
      if (response.data.status === "OK") {
        this.sweetAlert({
          title: this.isEdit
            ? this.$i18n.t("moduleUpdated")
            : this.$i18n.t("moduleCreated"),
        });
        this.$store.commit("setLoading", false);
      } else {
        this.sweetAlert({
          title: this.$i18n.t("error"),
          text: `${response.data.message}`,
        });
        this.$store.commit("setLoading", false);
        return;
      }
      if (this.isEdit) {
        this.isEdit = false;
        this.updateModule = null;
      }
      this.createModule = false;
    },
    createEditModule() {
      this.$store.commit("setLoading", true);
      let moduleElements = this.bookmarks.filter((b) =>
        this.treeselect.moduleElements.includes(b.id)
      );
      if (!this.isEdit) {
        let x = 0,
          y = 0;
        moduleElements = moduleElements.map((m, i) => {
          if (i !== 0) {
            y += 13;
          }
          return {
            ...m,
            chartData: {
              ...m.chartData,
              chart: {
                ...m.chartData.chart,
                type: m.chartData.chart.type,
                width: this.windowWidth,
                height: 375,
              },
            },
            x: x,
            y: y,
            w: 12,
            h: 13, // The grid-item height is calculated using this formula => Math.round(rowheight * h + Math.max(0, h - 1) * margin[1])
          };
        });
      } else {
        let charts = this.updateModule.moduleElements.map((m) => m.id),
          newValue = moduleElements.map((m) => m.id),
          existingCharts = this.updateModule.moduleElements.filter((b) =>
            this.treeselect.moduleElements.includes(b.id)
          );
        let newAddition = newValue.filter((val) => !charts.includes(val));
        let newChart = this.bookmarks.filter((b) => newAddition.includes(b.id));
        let findY = this.updateModule.moduleElements.map((m) =>
          m.y ? m.y : 0
        );
        let newY = Math.max(...findY) * 1;
        newChart = newChart.map((m) => {
          newY += 13;
          return {
            ...m,
            chartData: {
              ...m.chartData,
              chart: {
                ...m.chartData.chart,
                type: m.chartData.chart.type,
                width: this.windowWidth,
                height: 375,
              },
            },
            x: 0,
            y: newY,
            w: 12,
            h: 13, // The grid-item height is calculated using this formula => Math.round(rowheight * h + Math.max(0, h - 1) * margin[1])
          };
        });
        moduleElements = [...existingCharts, ...newChart];
      }
      let dynamicModule = {
        id: this.isEdit ? this.updateModule.id : randomString(16),
        user: this.isEdit
          ? this.updateModule.user
          : this.$store.getters.getUserDetails.userCredentials.id,
        userName: this.isEdit
          ? this.updateModule.userName
          : this.$store.getters.getUserDetails.firstName +
            " " +
            this.$store.getters.getUserDetails.surname,
        moduleName: this.moduleName,
        moduleDescription: this.moduleDescription,
        moduleLogoURL: this.moduleLogoURL,
        moduleLogoName: this.moduleLogoName,
        moduleColor: this.moduleColor,
        moduleElements: moduleElements,
        modulePeriod: this.modulePeriod,
        selectedModule: this.selectedModule,
        createdAt: this.isEdit
          ? this.updateModule.createdAt
          : this.$moment(new Date()).format("DD/MM/YYYY, h:mm:ss a"),
        updatedAt: this.$moment(new Date()).format("DD/MM/YYYY, h:mm:ss a"),
        isLive: this.isEdit ? this.updateModule.isLive : false,
        locale: this.$i18n.locale,
      };

      let key = this.generateKey("dynamicModules");

      let allKeys = service.getAllKeys();
      allKeys
        .then((keys) => {
          if (keys.data.includes(key)) {
            let saveConfig = service.getSavedConfig(key);
            saveConfig.then((res) => {
              let dynamicModules = res.data;
              if (this.isEdit) {
                let moduleIndex = dynamicModules.findIndex(
                  (m) => m.id === dynamicModule.id
                );
                dynamicModules[moduleIndex] = dynamicModule;
                moduleIndex = this.dynamicModules.findIndex(
                  (m) => m.id === dynamicModule.id
                );
                this.dynamicModules[moduleIndex] = dynamicModule;
              } else {
                dynamicModules.push(dynamicModule);
              }
              let response = service.updateConfig(dynamicModules, key);
              response.then((response) => {
                this.$emit("updateModules", dynamicModules);
                this.reset();
                this.showAlert(response);
              });
            });
          } else {
            let response = service.saveConfig([dynamicModule], key);
            response.then((response) => {
              this.$emit("updateModules", [dynamicModule]);
              this.reset();
              this.showAlert(response);
            });
          }
        })
        .catch(() => {
          this.$store.commit("setLoading", false);
        });
    },
    deleteModule(id) {
      let key = this.generateKey("dynamicModules");

      this.$swal({
        title: this.$i18n.t("areyousure"),
        text: this.$i18n.t("youablerevertthis"),
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: this.$i18n.t("yes_delete_it"),
        cancelButtonText: this.$i18n.t("cancelbtn"),
      }).then((result) => {
        if (result.value) {
          this.$store.state.loading = true;
          this.dynamicModules = this.dynamicModules.filter((d) => d.id !== id);
          let response = service.updateConfig(this.dynamicModules, key);
          response.then((response) => {
            this.$emit("updateModules", this.dynamicModules, true);
            this.showDeleteAlert(response);
          });
        }
      });
    },
    openCreateModal() {
      this.createModule = true;
    },
    editModule(id) {
      let module = this.dynamicModules.find((d) => d.id === id);
      if (module) {
        this.updateModule = module;
        this.isEdit = true;
        this.moduleName = module.moduleName;
        this.moduleDescription = module.moduleDescription;
        this.moduleLogoURL = module.moduleLogoURL;
        this.moduleLogoName = module.moduleLogoName;
        this.moduleColor = module.moduleColor;
        this.treeselect.moduleElements = module.moduleElements.map((m) => m.id);
        this.modulePeriod = module.modulePeriod;
        this.selectedModule = module.selectedModule;

        this.$nextTick(() => {
          this.createModule = true;
        });
      }
    },
    viewModule(id) {
      let module = this.dynamicModules.find((d) => d.id === id);
      if (module) {
        this.editModulePopup = true;
        this.$nextTick(() => {
          this.draftModule = module;
          this.addedCharts = module.moduleElements.map((m) => m.id);
        });
      }
    },
    syncChart(id) {
      let updatedChartData = this.bookmarks.find((b) => b.id === id);
      let oldChartData = this.draftModule.moduleElements.find(
        (m) => m.id === id
      );
      let findIndex = this.draftModule.moduleElements.findIndex(
        (m) => m.id === id
      );
      this.draftModule.moduleElements = this.draftModule.moduleElements.map(
        (m, i) => {
          if (i === findIndex) {
            return {
              ...updatedChartData,
              chartData: {
                ...updatedChartData.chartData,
                chart: {
                  ...updatedChartData.chartData.chart,
                  width: oldChartData.chartData.chart.width,
                  height: oldChartData.chartData.chart.height,
                },
              },
              h: oldChartData.h,
              w: oldChartData.w,
              x: oldChartData.x,
              y: oldChartData.y,
            };
          } else {
            return m;
          }
        }
      );
      this.$nextTick(() => {
        this.sweetAlert({
          title: this.$i18n.t("synced"),
          text: this.$i18n.t("chartSynced"),
        });
      });
    },
    removeChart(id) {
      this.$swal({
        title: this.$i18n.t("areyousure"),
        text: this.$i18n.t("youablerevertthis"),
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: this.$i18n.t("yes_delete_it"),
        cancelButtonText: this.$i18n.t("cancelbtn"),
      }).then((result) => {
        if (result.value) {
          this.draftModule.moduleElements =
            this.draftModule.moduleElements.filter((d) => d.id !== id);
          this.addedCharts = this.addedCharts.filter((val) => val !== id);
        }
      });
    },
    saveDraft() {
      this.$store.commit("setLoading", true);
      let key = this.generateKey("dynamicModules");

      let saveConfig = service.getSavedConfig(key);
      saveConfig.then((res) => {
        let dynamicModules = res.data;
        let moduleIndex = dynamicModules.findIndex(
          (m) => m.id === this.draftModule.id
        );
        dynamicModules[moduleIndex] = this.draftModule;

        let response = service.updateConfig(dynamicModules, key);
        response.then((response) => {
          this.sweetAlert({
            title: this.$i18n.t("moduleUpdated"),
          });
          this.isEdit = false;
          this.$store.commit("setLoading", false);
        });
      });
    },
    showDeleteAlert(response) {
      if (response.data.status === "OK") {
        this.sweetAlert({
          title: this.$i18n.t("deleted"),
          text: this.$i18n.t("moduleDeleted"),
        });
        this.$store.state.loading = false;
      } else {
        this.sweetAlert({
          title: this.$i18n.t("error"),
          text: `${response.data.message}`,
        });
        this.$store.state.loading = false;
        return;
      }
    },
  },
  created() {
    this.windowWidth = window.innerWidth - 60;
    this.getModuleList();
    let programs = [];
    if (
      this.$store.getters.getIsAdmin ||
      this.$store.getters.getAppSettings.bypassUser
    ) {
      programs = this.$store.getters.getAppSettings.modulesList;
    } else {
      programs = this.$store.getters.getUserPermissions?.dashboards || [];
    }
    programs.forEach((p) => {
      let text = "";

      if (p.includes("mnch")) {
        text = this.$i18n.t("maternalHealth");
      }
      if (p.includes("fp")) {
        text = this.$i18n.t("family_planning");
      }
      this.modules.push({
        text,
        value: `${this.$store.getters.getAppSettings.tableName}_${p}-dashboard`,
      });
    });
    this.selectedModule = `${this.$store.getters.getAppSettings.tableName}_${programs[0]}-dashboard`;
  },
};
</script>

<style lang="scss" scoped>
.input-group-text {
  background-color: var(--color-white);
  border: 1px solid var(--border-grey-color);
  .fa {
    color: var(--fa-sub-color);
    font-size: 0.875rem;
  }
}
.rightButtons {
  .sideRightTopBtn {
    opacity: 0.7;
    transition: all 0.5s;
    cursor: pointer;
    &:hover {
      opacity: 1;
    }
  }
  .aBtnactive {
    opacity: 1;
  }
}
.form-control {
  border: 1px solid var(--border-grey-color);
}

.firstDivCard {
  .card {
    background-color: var(--orange-bg-color) !important;
  }
}
.secondDivCard {
  h6 {
    border-bottom: 1px solid var(--border-grey-color);
    padding-bottom: 3%;
  }
}
.thirdDivCard {
  .card {
    background-color: var(--blue-bg-color) !important;
  }
}
.commonCardDiv {
  .card {
    height: 115px;
  }
}
#collapse-1 {
  border-bottom: 2px solid var(--border-grey-color);
  padding-bottom: 1%;
}
.actionButtons {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 4%;
  cursor: pointer;
  .fa {
    color: var(--text-color);
  }

  p {
    color: var(--text-color);
    margin-bottom: 0;
    margin-top: 5%;
    font-size: 0.875rem;
  }
}
.actionButtons:hover {
  color: var(--text-color);
}
.form-check {
  display: flex;
}
.colorDiv {
  width: 35px;
  height: 35px;
  border-radius: 4px;
  margin-left: 10%;
}
.orangeDiv {
  background: var(-orange-bg-color);
}
.darkGreenDiv {
  background: var(--green-darkbg-color);
}
.blueDiv {
  background: var(--blue-bg-color);
}
.greenDiv {
  background: var(--green-bg-color);
}
.form-check {
  padding-left: 6px;
}
.form-check-input {
  margin-top: 8.5%;
}
.selectItemInnerDiv {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50px;
  padding: 4px 12px;
  background-color: var(--primary-color-button) !important;
  color: var(--text-color) !important;
}
.selectItemsDiv {
  height: 110px;
  padding: 12px 24px;
  overflow: hidden;
  overflow-y: scroll;
  margin-top: 1px;
}
label,
#createModuleModal label {
  font-size: 0.875rem;
  font-weight: 200;
  color: var(--text-color) !important;
}
.topFaIcon {
  float: right;
  font-size: 2em;
  line-height: 1.2;
}
.modal-title {
  color: var(--text-color);
  font-weight: 400;
  font-size: var(--font-size-sub-heading);
}
.border-bottom-dark {
  border-bottom: 1px solid var(--border-grey-color);
}
.selectInnerDivText {
  color: var(--text-color);
  font-size: 0.875rem;
  font-weight: 200;
  cursor: pointer;
}
.float-left.selectInnerDivText {
  width: calc(100% - 20px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.form-control {
  border-radius: 0;
  font-size: 0.875rem;
  font-weight: 200;
  border: 1px solid var(--border-grey-color);
}
select:invalid {
  color: var(--text-color);
}
.periodRadio {
  margin-top: 4%;
}
.modal .submitbtn {
  font-size: 0.875rem;
  margin-right: 2%;
}
.uploadIcondiv {
  position: relative;
  overflow: hidden;
}

.upload-btn {
  height: 34px;
}

.upload-item,
.upload-item:hover {
  background-color: transparent !important;
  border-color: transparent !important;
  cursor: pointer;
}

.uploadIconinput {
  position: absolute;
  font-size: 3.125rem;
  opacity: 0;
  right: 0;
  top: 0;
}
.textTitleHeading {
  font-size: 0.875rem;
  font-weight: 500;
}
.bottomBtn {
  display: flex;
  justify-content: center;
}
.mainCardBodyWrap {
  height: calc(100vh - 154px);
  overflow: hidden;
  overflow-y: scroll;
}
.bottomLabel .border-bottom-dark {
  border-width: 2px;
}
.bottomLabel h6 {
  font-size: 0.875rem;
}
.sideRightTopBtn h6 {
  font-size: 0.875rem;
}

.secCard {
  position: relative;
}

.secCardBody {
  opacity: 1;
  display: block;
  width: 100%;
  height: auto;
  transition: 0.5s ease;
  backface-visibility: hidden;
}

.middle {
  transition: 0.5s ease;
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
  width: 100%;
}

.secCard:hover .secCardBody {
  opacity: 1;
}

.secCard:hover .middle {
  opacity: 0.97;
}

.text {
  background-color: var(--signoff-bottom-card);
  color: var(--text-color);
  font-size: 1rem;
  padding: 12px 10px;
}
#myModalEdit i.fa {
  color: var(--text-color);
}
.disabled {
  opacity: 0.5;
}

.actionButtons:hover {
  text-decoration: none;
}
.actionButtons:hover p {
  text-decoration: underline;
}
.dropdown-menu-wrap {
  height: 250px;
}
.dropdown-item img {
  width: 100px;

  display: block;
  margin: 8% auto;
}
.dropdown-item {
  margin-bottom: 6%;
  background-color: var(--font-text-color);
  border-radius: 4px;
  border: 1px solid transparent;
  transition: all 0.5s;
}
.dropdown-item:active,
.dropdown-item:hover {
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.bg_lightshadegrey {
  background-color: var(--font-text-color);
}
.topCardChartName {
  border-bottom: 1px solid var(--text-subfont-color) !important;
  background-color: var(--loader-bg-color) !important;
  height: 55px;
}
.chartIconsDiv {
  height: 45px;
  padding: 12px;
}

.modalscreenPreview .modal-content {
  background-color: var(--bg-newdefault);
}
/* .newBlack-theme .modalscreenPreview .modal-content {
  background-color: #212832 !important;
} */
/* .newGreen-theme .modalscreenPreview .modal-content {
  background-color: #25984b !important;
}*/
@media (min-width: 1200px) {
  .modalEdit .modal-xl {
    max-width: 100%;
    margin: 0;
  }
}
</style>
<style lang="scss">
#createModuleModal {
  .modal-header {
    background: transparent;

    padding: 1rem;
    .close {
    }
  }
}
#myModalEdit {
  padding-left: 0px !important;
  i.fa {
    color: var(--text-color);
  }
}
@media (min-width: 1200px) {
  #myModalEdit .modal-xl {
    max-width: 100%;
    margin: 0;
  }
}
</style>
