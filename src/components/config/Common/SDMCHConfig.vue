<template>
  <div class="footer-buttons" v-if="isDataFetched">
    <b-card no-body>
      <b-tabs
        vertical
        card
        lazy
        nav-class="p-0"
        nav-wrapper-class="adminConfig admin-fptheme"
      >
        <!-- Render Tabs, supply a unique `key` to each tab -->
        <b-tab
          v-for="(tab, i) in tabs"
          :key="'dyn-tab-' + tab.id"
          class="pl-2 pb-2 pt-0 pr-0 submodule-spacing"
        >
          <template #title>
            <span class="main-tabs" style="display: none">
              <!-- <i
              class="fa fa-arrow-up mr-2 cursor-pointer f-s-0-875rem"
              v-b-tooltip.hover
              title="Move Up"
              @click.prevent.stop="
                moveItem({ type: 'tab', tInd: i, places: -1 })
              "
            ></i> -->
              <img
                src="@/assets/images/icons/up-adminarrow.svg"
                class="mx-1 mr-2 cursor-pointer f-s-0-875rem w-auto"
                v-b-tooltip.hover
                :title="$t('moveUp')"
                @click.prevent.stop="
                  moveItem({ type: 'tab', tInd: i, places: -1 })
                "
                :style="{ filter: filterColor }"
              />
              <!-- <i
              class="fa fa-arrow-down mr-2 cursor-pointer f-s-0-875rem"
              v-b-tooltip.hover
              title="Move Down"
              @click.prevent.stop="
                moveItem({ type: 'tab', tInd: i, places: 1 })
              "
            ></i> -->
              <img
                src="@/assets/images/icons/down-adminarrow.svg"
                class="mr-2 cursor-pointer f-s-0-875rem w-auto"
                :style="{ filter: filterColor }"
                v-b-tooltip.hover
                :title="$t('moveDown')"
                @click.prevent.stop="
                  moveItem({ type: 'tab', tInd: i, places: 1 })
                "
              />

              <!-- <i
              class="fa fa-edit mr-2 f-s-0-875rem"
              v-b-tooltip.hover
              :title="$t('edit')"
              @click="
                updateTab({
                  type: 'type11',
                  tabName: tab.tabName,
                  tInd: i,
                  group: tab.group,
                  showGroups: tab.showGroups,
                })
              "
            ></i> -->
              <img
                src="@/assets/images/icons/edit-adminicon.svg"
                class="mr-2 cursor-pointer f-s-0-875rem w-14"
                :style="{ filter: filterColor }"
                v-b-tooltip.hover
                :title="$t('edit')"
                @click="
                  updateTab({
                    type: 'type11',
                    tabName: tab.tabName[$i18n.locale],
                    tInd: i,
                    group: tab.group,
                    showGroups: tab.showGroups,
                  })
                "
              />
              <span class="mr-2 translate-icon">
                <Translations :transText.sync="tab.tabName" />
              </span>
              <!-- <i
              class="fa fa-trash mr-2 f-s-0-875rem"
              v-b-tooltip.hover
              :title="$t('deletebtn')"
              @click="deleteElement({ type: 'tab', tInd: i })"
            ></i> -->
              <img
                src="@/assets/images/icons/admindelete-icon.svg"
                class="mr-2 cursor-pointer f-s-0-875rem w-auto"
                :style="{ filter: filterColor }"
                v-b-tooltip.hover
                :title="$t('deletebtn')"
                @click="deleteElement({ type: 'tab', tInd: i })"
              />
            </span>
            <span class=""> {{ tab.tabName[$i18n.locale] }} </span>
          </template>

          <div>
            <b-card no-body class="border-adminmodule">
              <b-tabs
                card
                lazy
                :nav-class="[isOpenTabs ? 'p-0 m-0' : 'p-0 m-0 hideTabs']"
                nav-wrapper-class="adminConfigInner main-tabsection p-0 mb-3 mt-11px"
              >
                <div class="add-tabs" :class="{ rotateArrow: isOpenTabs }">
                  <img
                    src="@/assets/images/icons/icon-collapse.svg"
                    :style="{ filter: filterColor }"
                    class="mr-2 cursor-pointer f-s-0-875rem w-auto"
                    @click="isOpenTabs = !isOpenTabs"
                  />
                </div>
                <div class="border-main"></div>
                <!-- Render Tabs, supply a unique `key` to each tab -->
                <b-tab
                  v-for="(subTab, j) in tab.subTabs"
                  :key="'dyn-sub-tab-' + subTab.id"
                  class="border mt-3"
                >
                  <template #title>
                    <span class="main-tabs">
                      <!-- <i
                      class="fa fa-arrow-left mr-2 cursor-pointer f-s-0-875rem"
                      v-b-tooltip.hover
                      title="Move Left"
                      @click.prevent.stop="
                        moveItem({
                          type: 'subTab',
                          tInd: i,
                          stInd: j,
                          places: -1,
                        })
                      "
                    ></i> -->
                      <img
                        src="@/assets/images/icons/admin-leftarrow.svg"
                        class="mr-2 cursor-pointer f-s-0-875rem w-auto"
                        :style="{ filter: filterColor }"
                        v-b-tooltip.hover
                        :title="$t('moveLeft')"
                        @click.prevent.stop="
                          moveItem({
                            type: 'subTab',
                            tInd: i,
                            stInd: j,
                            places: -1,
                          })
                        "
                      />
                      <!-- <i
                      class="fa fa-arrow-right mr-2 cursor-pointer f-s-0-875rem"
                      v-b-tooltip.hover
                      title="Move Right"
                      @click.prevent.stop="
                        moveItem({
                          type: 'subTab',
                          tInd: i,
                          stInd: j,
                          places: 1,
                        })
                      "
                    ></i> -->
                      <img
                        src="@/assets/images/icons/right-adminarrow.svg"
                        :style="{ filter: filterColor }"
                        class="mr-2 cursor-pointer f-s-0-875rem w-auto"
                        v-b-tooltip.hover
                        :title="$t('moveRight')"
                        @click.prevent.stop="
                          moveItem({
                            type: 'subTab',
                            tInd: i,
                            stInd: j,
                            places: 1,
                          })
                        "
                      />
                      <!-- <i
                      class="fa fa-edit mr-2 f-s-0-875rem"
                      v-b-tooltip.hover
                      :title="$t('edit')"
                      @click="
                        updateTab({
                          type: 'type21',
                          tabName: subTab.tabName,
                          tInd: i,
                          stInd: j,
                        })
                      "
                    ></i> -->
                      <img
                        src="@/assets/images/icons/edit-adminicon.svg"
                        :style="{ filter: filterColor }"
                        class="mr-2 cursor-pointer f-s-0-875rem w-14"
                        v-b-tooltip.hover
                        :title="$t('edit')"
                        @click="
                          updateTab({
                            type: 'type21',
                            tabName: subTab.tabName[$i18n.locale],
                            tInd: i,
                            stInd: j,
                          })
                        "
                      />
                      <span class="mr-1 translate-icon">
                        <Translations :transText.sync="subTab.tabName" />
                      </span>
                      <!-- <i
                      class="fa fa-trash mr-2 f-s-0-875rem"
                      v-b-tooltip.hover
                      :title="$t('deletebtn')"
                      @click="
                        deleteElement({ type: 'subTab', tInd: i, stInd: j })
                      "
                    ></i> -->
                      <img
                        src="@/assets/images/icons/admindelete-icon.svg"
                        :style="{ filter: filterColor }"
                        class="mr-2 cursor-pointer f-s-0-875rem w-14 mx-1"
                        v-b-tooltip.hover
                        :title="$t('deletebtn')"
                        @click="
                          deleteElement({ type: 'subTab', tInd: i, stInd: j })
                        "
                      />
                    </span>
                    <span class="">{{ subTab.tabName[$i18n.locale] }}</span>
                  </template>

                  <b-row v-if="tab.group">
                    <b-col sm="12">
                      <b-row class="mb-3">
                        <b-col sm="4">
                          <label :for="`type-tabGroup-${i}-${j}`">{{
                            $t("group")
                          }}</label>
                        </b-col>
                        <b-col sm="8">
                          <b-form-select
                            :id="`type-tabGroup-${i}-${j}`"
                            v-model="subTab.group"
                            :options="subGroups(tab.group)"
                            @change="
                              updatedBGData({
                                tInd: i,
                                stInd: j,
                                group: subTab.group,
                              })
                            "
                          ></b-form-select>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col sm="12">
                      <b-row class="mb-3">
                        <b-col sm="4">
                          <label :for="`type-tabSummary-${i}-${j}`">{{
                            $t("catInformation")
                          }}</label>
                        </b-col>
                        <b-col sm="8" class="input-lang">
                          <b-input-group :id="`type-tabSummary-${i}-${j}`">
                            <vue-editor
                              v-model="subTab.categoryInfo[$i18n.locale]"
                              :state="
                                subTab.categoryInfo &&
                                subTab.categoryInfo[$i18n.locale] &&
                                subTab.categoryInfo[$i18n.locale].length !== 0
                              "
                              :editorToolbar="customToolbar"
                              disabled
                            ></vue-editor>
                            <b-input-group-append is-text>
                              <Translations
                                :transText.sync="subTab.categoryInfo"
                                type="editor"
                              />
                            </b-input-group-append>
                          </b-input-group>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col
                      sm="12"
                      v-if="
                        moduleKey === 'summaryDashboard' &&
                        $store.getters.getNamespace ===
                          'multi_program_mnch-dashboard'
                      "
                    >
                      <b-row class="mb-3">
                        <b-col sm="4">
                          <label :for="`type-linkToIntegrated-${i}-${j}`">{{
                            $t("LinkIC")
                          }}</label>
                        </b-col>
                        <b-col sm="8">
                          <b-form-checkbox
                            :id="`type-linkToIntegrated-${i}-${j}`"
                            class="mr-n2 mb-n1 mt-1"
                            switch
                            v-model="subTab.integrated.linked"
                          >
                          </b-form-checkbox>
                        </b-col>
                      </b-row>
                    </b-col>
                  </b-row>
                  <template
                    v-if="
                      moduleKey === 'summaryDashboard' &&
                      $store.getters.getNamespace ===
                        'multi_program_mnch-dashboard'
                    "
                  >
                    <transition name="slide-fade">
                      <SDIntegratedBenchmark
                        :i="i"
                        :j="j"
                        :tabId="tab.id"
                        :tabGroup="tab.group"
                        :subTabId="subTab.id"
                        :dataEntry="dataEntry"
                        :integrated="subTab.integrated"
                        v-bind.sync="subTab.integrated"
                      />
                    </transition>
                  </template>

                  <template v-if="subTab.backgroundData">
                    <div class="accordion mb-2" role="tablist">
                      <b-card no-body class="mb-1">
                        <b-card-header
                          header-tag="header"
                          class="p-1 map-header f-s-0-875rem font-weight-bold"
                          role="tab"
                        >
                          <b-button
                            block
                            v-b-toggle.accordion-bg1
                            variant="info"
                          >
                            {{ $t("backgroundFactors") }}</b-button
                          >
                        </b-card-header>
                        <b-collapse
                          id="accordion-bg1"
                          accordion="my-accordion"
                          role="tabpanel"
                          class="border-module"
                        >
                          <b-card-body>
                            <b-card-text>
                              <BackgroundData
                                :i="i"
                                :j="j"
                                :moduleKey="moduleKey"
                                :subTabGroup="subTab.group"
                                :charts="subTab.chartSetting"
                                :backgroundData="subTab.backgroundData"
                                v-bind.sync="subTab.backgroundData"
                              />
                            </b-card-text>
                          </b-card-body>
                        </b-collapse>
                      </b-card>
                    </div>
                  </template>
                  <template v-if="moduleKey === 'dqrDashboard'">
                    <div class="accordion" role="tablist">
                      <b-card no-body class="mb-1">
                        <b-card-header
                          header-tag="header"
                          class="p-1 map-header f-s-0-875rem font-weight-bold"
                          role="tab"
                        >
                          <b-button
                            block
                            v-b-toggle.accordion-sq1
                            variant="info"
                          >
                            {{ $t("signOffQ") }}</b-button
                          >
                        </b-card-header>
                        <b-collapse
                          id="accordion-sq1"
                          accordion="my-accordion"
                          role="tabpanel"
                          class="border-module"
                        >
                          <b-card-body class="mb-lg-n3">
                            <b-card-text>
                              <SignOff
                                :i="i"
                                :j="j"
                                :moveItem="moveItem"
                                :questions="subTab.questions"
                                v-bind.sync="subTab.questions"
                                :actionOnQuestion="actionOnQuestion"
                              />
                            </b-card-text>
                          </b-card-body>
                        </b-collapse>
                      </b-card>
                    </div>
                  </template>
                  <template
                    v-if="
                      moduleKey === 'analyticalDashboard' && subTab.mapSetting
                    "
                  >
                    <div class="accordion mt-2" role="tablist">
                      <b-card no-body class="mb-1">
                        <b-card-header
                          header-tag="header"
                          class="p-1 map-header f-s-0-875rem font-weight-bold"
                          role="tab"
                        >
                          <b-button block v-b-toggle.accordion-1 variant="info">
                            {{ $t("mapSettings") }}</b-button
                          >
                        </b-card-header>
                        <b-collapse
                          id="accordion-1"
                          accordion="my-accordion"
                          role="tabpanel"
                          class="border-module"
                        >
                          <b-card-body>
                            <b-card-text>
                              <div class="p-2 pb-lg-0">
                                <ChartMapSettings
                                  :i="i"
                                  :j="j"
                                  :tabs="tabs"
                                  :copy="copy"
                                  :tabId="tab.id"
                                  :copyTo="copyTo"
                                  :moveItem="moveItem"
                                  :subTabId="subTab.id"
                                  :moduleKey="moduleKey"
                                  configKey="mapSetting"
                                  :subTabGroup="subTab.group"
                                  :applyPalette="applyPalette"
                                  :levelsSelect="levelsSelect"
                                  :settings="subTab.mapSetting"
                                  :deleteElement="deleteElement"
                                  v-bind.sync="subTab.mapSetting"
                                  :updateBenchmarks="updateBenchmarks"
                                />
                                <b-row v-if="subTab.mapSetting.length === 0">
                                  <b-col sm="12" class="text-center">
                                    {{ $t("noAvailable") }}
                                  </b-col>
                                </b-row>
                              </div>
                            </b-card-text>
                            <!-- <b-card-text>{{ text }}</b-card-text> -->
                          </b-card-body>
                        </b-collapse>
                      </b-card>
                    </div>
                  </template>

                  <template>
                    <div class="accordion mt-2" role="tablist">
                      <b-card no-body class="mb-1">
                        <b-card-header
                          header-tag="header"
                          class="p-1 map-header f-s-0-875rem font-weight-bold"
                          role="tab"
                        >
                          <b-button
                            block
                            v-b-toggle.accordion-ch1
                            variant="info"
                          >
                            {{ $t("chartSettings") }}</b-button
                          >
                        </b-card-header>
                        <b-collapse
                          id="accordion-ch1"
                          accordion="my-accordion"
                          role="tabpanel"
                          class="border-module"
                        >
                          <b-card-body class="mb-lg-n3">
                            <b-card-text>
                              <div
                                class="p-2"
                                :class="{
                                  'mb-3': moduleKey === 'summaryDashboard',
                                }"
                              >
                                <ChartMapSettings
                                  :i="i"
                                  :j="j"
                                  :tabs="tabs"
                                  :copy="copy"
                                  :tabId="tab.id"
                                  :copyTo="copyTo"
                                  :moveItem="moveItem"
                                  :subTabId="subTab.id"
                                  :moduleKey="moduleKey"
                                  configKey="chartSetting"
                                  :subTabGroup="subTab.group"
                                  :applyPalette="applyPalette"
                                  :levelsSelect="levelsSelect"
                                  @updatedBGData="updatedBGData"
                                  :deleteElement="deleteElement"
                                  :settings="subTab.chartSetting"
                                  v-bind.sync="subTab.chartSetting"
                                  :updateBenchmarks="updateBenchmarks"
                                />
                                <b-row v-if="subTab.chartSetting.length === 0">
                                  <b-col sm="12" class="text-center">
                                    {{ $t("addChart") }}
                                    <code>{{ $t("addbtn") }}</code>
                                    {{ $t("btn") }}
                                    below.
                                  </b-col>
                                </b-row>
                                <div class="text-right pt-2">
                                  <b-button
                                    class="blue-btn btn-sm ml-2"
                                    v-on:click="
                                      addElement({
                                        type: 'chartSetting',
                                        tInd: i,
                                        stInd: j,
                                      })
                                    "
                                    >{{ $t("addbtn") }}</b-button
                                  >
                                  <b-button
                                    class="black-btn btn-sm ml-2 d-none"
                                    v-on:click="
                                      addElement({
                                        type: 'mapSetting',
                                        tInd: i,
                                        stInd: j,
                                      })
                                    "
                                    >{{ $t("addbtn") }}
                                    {{ $t("map") }}</b-button
                                  >
                                </div>
                              </div>
                            </b-card-text>
                          </b-card-body>
                        </b-collapse>
                      </b-card>
                    </div>
                  </template>

                  <template
                    v-if="moduleKey === 'summaryDashboard' && subTab.summary"
                  >
                    <div class="accordion mt-2" role="tablist">
                      <b-card no-body class="mb-1">
                        <b-card-header
                          header-tag="header"
                          class="p-1 map-header f-s-0-875rem font-weight-bold"
                          role="tab"
                        >
                          <b-button
                            block
                            v-b-toggle.accordion-sum1
                            variant="info"
                          >
                            {{ $t("Summary") }}</b-button
                          >
                        </b-card-header>
                        <b-collapse
                          id="accordion-sum1"
                          accordion="my-accordion"
                          role="tabpanel"
                          class="border-module"
                        >
                          <b-card-body>
                            <b-card-text>
                              <SDNarrations
                                :i="i"
                                :j="j"
                                :tabs="tabs"
                                :subTabId="subTab.id"
                                :summary="subTab.summary"
                                :subTabGroup="subTab.group"
                                v-bind.sync="subTab.summary"
                                :allCharts="subTab.chartSetting"
                              />
                            </b-card-text>
                            <!-- <b-card-text>{{ text }}</b-card-text> -->
                          </b-card-body>
                        </b-collapse>
                      </b-card>
                    </div>
                  </template>
                </b-tab>

                <!-- New Tab Button (Using tabs-start slot) -->
                <template #tabs-start>
                  <b-nav-item
                    role="presentation"
                    @click.prevent="updateTab({ type: 'type2', tInd: i })"
                    href="#"
                    class="text-center add-adminbtn me-15 mb-2"
                    v-b-tooltip.hover
                    :title="$t('addbtn')"
                  >
                    <b>+</b>
                    <span class="mx-1"> {{ $t("addbtn") }} </span>
                  </b-nav-item>
                </template>

                <!-- Render this if no tabs -->
                <template #empty>
                  <div class="text-center text-muted">
                    {{ $t("noOpenTabs") }}<br />
                    {{ $t("openTab") }} <b>+</b> {{ $t("btn") }}.
                  </div>
                </template>
              </b-tabs>
            </b-card>
            <div class="text-right pt-2">
              <b-button
                class="black-btn save-btn"
                @click.prevent="updateConfig"
                >{{ $t("savebtn") }}</b-button
              >
            </div>
          </div>
        </b-tab>

        <!-- New Tab Button (Using tabs-start slot) -->
        <template #tabs-start>
          <b-nav-item
            role="presentation"
            @click.prevent="updateTab({ type: 'type1' })"
            href="#"
            class="text-center add-adminbtn w-50 mx-3"
            v-b-tooltip.hover
            :title="$t('addbtn')"
            ><b>+</b>
            <span class=""> {{ $t("addbtn") }} </span>
          </b-nav-item>
        </template>

        <!-- Render this if no tabs -->
        <template #empty>
          <div class="text-center text-muted">
            {{ $t("noOpenTabs") }}<br />
            {{ $t("openTab") }} <b>+</b> {{ $t("btn") }}.
          </div>
        </template>
      </b-tabs>
    </b-card>
    <b-modal
      v-model="tabNameModal"
      :title="$t('tabName')"
      @ok="handleOk"
      :ok-title="$t('ok')"
      :cancel-title="$t('cancelbtn')"
      no-close-on-backdrop
      centered
    >
      <div>
        <b-row>
          <b-col sm="4">
            <label for="type-tabName">{{ $t("name") }}</label>
          </b-col>
          <b-col sm="8">
            <b-form-input
              id="type-tabName"
              type="text"
              v-model="updatedTabName"
            ></b-form-input>
          </b-col>
        </b-row>
        <b-row
          v-if="updateType === 'type1' || updateType === 'type11'"
          class="pt-3"
        >
          <b-col sm="4">
            <label for="type-tabGroup">{{ $t("group") }}</label>
          </b-col>
          <b-col sm="8">
            <b-form-select
              id="type-tabGroup"
              v-model="groupName"
              :options="groups"
            ></b-form-select>
          </b-col>
        </b-row>
        <b-row
          v-if="
            (updateType === 'type1' || updateType === 'type11') &&
            moduleKey === 'dqrDashboard'
          "
          class="pt-3"
        >
          <b-col sm="4">
            <label for="type-tabShowGroups">{{ $t("showGroups") }}</label>
          </b-col>
          <b-col sm="8">
            <b-form-checkbox
              id="type-tabShowGroups"
              class="mr-n2 mb-n1"
              switch
              v-model="showGroups"
            >
            </b-form-checkbox>
          </b-col>
        </b-row>
      </div>
    </b-modal>
    <b-modal
      v-model="questionModel"
      centered
      :title="$t('addQuest')"
      @ok="actionOnQuestion({ type: 'update' })"
      :ok-title="$t('ok')"
      :cancel-title="$t('cancelbtn')"
      no-close-on-backdrop
    >
      <template v-if="signOffQuestion">
        <div class="mb-3">
          {{ $t("quest") }}
          <b-input-group>
            <b-form-textarea
              id="textarea"
              v-model="signOffQuestion.question[$i18n.locale]"
              :placeholder="$t('enter_question')"
              rows="3"
              disabled
            ></b-form-textarea>
            <b-input-group-append is-text>
              <Translations :transText.sync="signOffQuestion.question" />
            </b-input-group-append>
          </b-input-group>
        </div>
        <div>
          <b-form-group :label="$t('options')">
            <b-row
              class="my-1"
              v-for="(opt, i) in signOffQuestion.options"
              :key="opt.value"
            >
              <b-col sm="1">
                <label :for="'input-option' + opt.value">
                  <!-- <i
                    class="fa fa-trash mr-2 cursor-pointer f-s-0-875rem"
                    @click="actionOnOption({ type: 'delete', qInd: i })"
                    v-b-tooltip.hover
                    :title="$t('deletebtn')"
                  ></i> -->

                  <img
                    src="@/assets/images/icons/admindelete-icon.svg"
                    :style="{ filter: filterColor }"
                    class="cursor-pointer f-s-0-875rem w-auto mr-2"
                    @click="actionOnOption({ type: 'delete', qInd: i })"
                    v-b-tooltip.hover
                    :title="$t('deletebtn')"
                  />
                </label>
              </b-col>
              <b-col sm="11" class="sign-ques">
                <b-input-group :id="'input-option' + opt.value">
                  <b-form-input
                    size="sm"
                    placeholder=""
                    v-model="opt.text[$i18n.locale]"
                    disabled
                  ></b-form-input>
                  <b-input-group-append is-text>
                    <Translations :transText.sync="opt.text" />
                  </b-input-group-append>
                </b-input-group>
              </b-col>
            </b-row>
            <div
              class="text-center"
              v-if="signOffQuestion.options.length === 0"
            >
              {{ $t("noOpt") }}<br />
              {{ $t("addOpt") }} <b>+</b> {{ $t("btn") }}
            </div>
          </b-form-group>
        </div>
        <div class="pt-2">
          <b-button
            size="sm"
            class="black-btn"
            @click="actionOnOption({ type: 'add' })"
            >+</b-button
          >
        </div>
      </template>
    </b-modal>
    <dataEntryForm
      v-if="isDataEntry"
      :isDataEntry="isDataEntry"
      :dataEntryID="dataEntryID"
      @hideModal="hideModal"
    />
  </div>
</template>
<script>
import service from "@/service";
import { VueEditor } from "vue2-editor";
import SignOff from "@/components/config/Common/SignOff";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
import ReFetchConfigMixin from "@/helpers/ReFetchConfigMixin";
import VueEditorOptionMixin from "@/helpers/VueEditorOptionMixin";
import { randomString } from "@/components/Common/commonFunctions";
import SDNarrations from "@/components/config/Common/SDNarrations";
import BackgroundData from "@/components/config/Common/BackgroundData";
import ChartMapSettings from "@/components/config/Common/ChartMapSettings";
import DynamicConfigOptionsMixin from "@/helpers/DynamicConfigOptionsMixin";
import SDIntegratedBenchmark from "@/components/config/Common/SDIntegratedBenchmark";
export default {
  props: [
    "indicatorsList",
    "dataElementsList",
    "dataSetsList",
    "metrixList",
    "langList",
    "moduleKey",
    "orgList",
  ],
  mixins: [
    DynamicImageMixin,
    ReFetchConfigMixin,
    VueEditorOptionMixin,
    DynamicConfigOptionsMixin,
  ],
  components: {
    SignOff,
    VueEditor,
    SDNarrations,
    dataEntryForm: () =>
      import(
        /*webpackChunkName: 'dataEntryForm'*/ "@/components/config/dqr/dataEntryForm"
      ),
    BackgroundData,
    ChartMapSettings,
    SDIntegratedBenchmark,
    Translations: () =>
      import(
        /*webpackChunkName: 'translations'*/ "@/components/config/Common/Translations"
      ),
  },
  data() {
    let levelID = this.$store.getters.getApplicationModule(
      this.$store.getters.getIsMultiProgram
    ).defaultLevelID;
    let levels = this.orgList
      .filter((item) => {
        if (item.level === levelID && item.level === this.orgList.length) {
          return item;
        }
        if (item.level >= levelID) {
          return item;
        }
      })
      .map((o) => ({
        level: o.level,
        levelName: o.name,
        isAutoRange: true,
        scales: [
          {
            lowScale: "0",
            highScale: "25",
            scaleColor: "#90CAF9",
            scaleLabel: { [this.$i18n.locale]: this.$i18n.t("low") },
          },
          {
            lowScale: "25",
            highScale: "50",
            scaleColor: "#2BAE8D",
            scaleLabel: { [this.$i18n.locale]: this.$i18n.t("medium") },
          },
          {
            lowScale: "50",
            highScale: "75",
            scaleColor: "#FFE082",
            scaleLabel: { [this.$i18n.locale]: this.$i18n.t("high") },
          },
          {
            lowScale: "75",
            highScale: "100",
            scaleColor: "#F06868",
            scaleLabel: { [this.$i18n.locale]: this.$i18n.t("veryHigh") },
          },
        ],
      }))
      .sort((a, b) => {
        return a.level < b.level ? -1 : a.level == b.level ? 0 : 1;
      });
    return {
      tabs: [],
      groups: [],
      signOffTab: 0,
      levels: levels,
      dataEntryID: "",
      groupName: null,
      signOffSubTab: 0,
      updateType: null,
      updateIndex: null,
      showGroups: false,
      isOpenTabs: false,
      isDataEntry: false,
      updatedTabName: "",
      tabNameModal: false,
      questionModel: false,
      updateSubIndex: null,
      isDataFetched: false,
      integrated: {
        color: "#000",
        linked: false,
        dataMapping: [],
        displayName: "",
        minThreshold: 0,
        maxThreshold: 100,
        benchmarkLabel: "",
        percentIndicator: true,
        benchmarkColor: "#000",
      },
      summary: {
        disable: false,
        percentageIndicator: false,
        benchmarkValue: "",
        summaryText: "",
        compareWith: null,
        primaryChart: null,
        secondaryChart: null,
        priorityIndicator: null,
      },
      signOff: {
        question: {},
        options: [
          { text: this.$i18n.t("yes"), value: "Yes" },
          { text: this.$i18n.t("no"), value: "No" },
        ],
        comment: {},
        answer: "",
      },
      signOffQuestion: null,
      paletteColor: "#00ff80",
      levelsSelect: [],
      selectedLevel: null,
      selectedTreeLevel: [],
      copyLevels: [],
      selectedCopyOption: [],
      copyToKey: "",
    };
  },
  computed: {
    subGroups: function () {
      return function (group) {
        let subGroups = [];
        if (this.moduleKey === "summaryDashboard") {
          if (
            this.$store.getters.getNamespace !== "multi_program_mnch-dashboard"
          ) {
            if (group === "DEFAULT") {
              subGroups = [
                {
                  value: "EMU",
                  text: this.$i18n.t("EMU"),
                },
                {
                  value: "PPFP",
                  text: this.$i18n.t("PPFP"),
                },
                {
                  value: "RMNCH",
                  text: this.$i18n.t("RMNCH"),
                },
                {
                  value: "STOCK_OUT",
                  text: this.$i18n.t("stockOut"),
                },
                {
                  value: "ADOL_YOUTH",
                  text: this.$i18n.t("adolYouth"),
                },
                {
                  value: "DEFAULT",
                  text: this.$i18n.t("default"),
                },
              ];
            } else {
              subGroups = [
                {
                  value: "VOLUME",
                  text: this.$i18n.t("Volume"),
                },
                {
                  value: "REPORTING_RATE",
                  text: this.$i18n.t("Reporting Rate"),
                },
                {
                  value: "DEFAULT",
                  text: this.$i18n.t("default"),
                },
              ];
            }
          } else {
            subGroups = [
              {
                value: "DEFAULT",
                text: this.$i18n.t("default"),
              },
            ];
          }
        }
        if (this.moduleKey === "analyticalDashboard") {
          if (
            this.$store.getters.getNamespace !== "multi_program_mnch-dashboard"
          ) {
            if (group === "DEFAULT") {
              subGroups = [
                {
                  value: "EMU",
                  text: this.$i18n.t("EMU"),
                },
                {
                  value: "PPFP",
                  text: this.$i18n.t("PPFP"),
                },
                {
                  value: "DEFAULT",
                  text: this.$i18n.t("default"),
                },
                {
                  value: "SUMMARY",

                  text: this.$i18n.t("Summary"),
                },
                {
                  value: "STOCK_OUT",
                  text: this.$i18n.t("stockOut"),
                },
                {
                  value: "AVAILABILITY",
                  text: this.$i18n.t("access"),
                },
                {
                  value: "INS_REMOVAL",
                  text: this.$i18n.t("insertion_Removal"),
                },
                {
                  value: "ADOL_YOUTH",
                  text: this.$i18n.t("adolYouth"),
                },
              ];
            } else {
              subGroups = [
                {
                  value: `GEO`,
                  text: this.$i18n.t("geoVar"),
                },
                {
                  value: "SUMMARY",

                  text: this.$i18n.t("Summary"),
                },
                {
                  value: "DEFAULT",
                  text: this.$i18n.t("default"),
                },
              ];
            }
          } else {
            subGroups = [
              {
                value: `GEO`,
                text: this.$i18n.t("geoVar"),
              },
              {
                value: `COMP`,
                text: this.$i18n.t("keyComp"),
              },
              {
                value: `TIMING`,
                text: this.$i18n.t("byTiming"),
              },
              {
                value: `AGE`,
                text: this.$i18n.t("byAge"),
              },
              {
                value: "SUMMARY",

                text: this.$i18n.t("Summary"),
              },
              {
                value: "DEFAULT",

                text: this.$i18n.t("default"),
              },
            ];
          }
        }
        if (this.moduleKey === "dqrDashboard") {
          // if (
          // 	this.$store.getters.getNamespace !== "multi_program_mnch-dashboard"
          // ) {
          // 	subGroups = [
          // 		{
          // 			value: "DEFAULT",
          // 			text: this.$i18n.t("default"),
          // 		},
          // 	];
          // } else {
          subGroups = [
            {
              label: this.$i18n.t("compTime"),
              options: [
                {
                  value: `${group}-CT-actualRR`,
                  text: this.$i18n.t("Reporting Rate (Actual)"),
                },
                {
                  value: `${group}-CT-onTimeRR`,
                  text: this.$i18n.t("Reporting Rate (On Time)"),
                },
              ],
            },
            {
              label: this.$i18n.t("Internal_Consistency"),
              options: [
                {
                  value: `${group}-IC-aggregate`,
                  text: this.$i18n.t("aggregate"),
                },
                {
                  value: `${group}-IC-method`,
                  text: this.$i18n.t("method"),
                },
              ],
            },
            {
              label: this.$i18n.t("icc"),
              options: [
                {
                  value: `${group}-CC-method`,
                  text: this.$i18n.t("method"),
                },
              ],
            },
            // {
            //   label: this.$i18n.t("eConsistency"),
            //   options: [
            //     {
            //       value: `${group}-EC-survey`,
            //       text: this.$i18n.t("survey"),
            //     },
            //     {
            //       value: `${group}-EC-method`,
            //       text: this.$i18n.t("method"),
            //     },
            //   ],
            // },
            {
              label: this.$i18n.t("default"),
              options: [
                {
                  value: "DEFAULT",
                  text: this.$i18n.t("default"),
                },
              ],
            },
          ];
          // }
        }
        return subGroups;
      };
    },
  },
  methods: {
    updateBenchmarks({
      tInd,
      stInd,
      cInd,
      dataMapping,
      chartCategory,
      chartDataSum,
    }) {
      let remove = false;
      if (
        chartCategory !== "regional" ||
        (dataMapping.length > 1 &&
          chartCategory === "regional" &&
          !chartDataSum) ||
        (dataMapping.length > 1 && chartCategory !== "regional") ||
        (chartCategory !== "regional" && !chartDataSum)
      ) {
        remove = true;
      }
      if (remove) {
        let b =
          this.tabs[tInd].subTabs[stInd].chartSetting[cInd].chartOptions
            .benchmarks;
        this.tabs[tInd].subTabs[stInd].chartSetting[
          cInd
        ].chartOptions.benchmarks = b.filter((c) => !c.includes("national"));
      }
    },
    copyTo({ tInd, stInd, cmInd, key = "chartSetting" }) {
      this.copyToKey = key;
      this.levelsSelect = this.tabs[tInd].subTabs[stInd][key][
        cmInd
      ].chartOptions.levels.map((l) => ({
        text: l.levelName,
        value: l.level,
      }));
      this.copyLevels =
        this.tabs[tInd].subTabs[stInd][key][cmInd].chartOptions.levels;
      this.selectedLevel = null;
      this.selectedTreeLevel = [];
      this.selectedCopyOption = [];
      this.$nextTick(() => {
        this.$bvModal.show("copyToModal" + tInd + stInd + cmInd);
      });
    },
    copy({ tInd, stInd, cmInd }) {
      let mData = JSON.parse(
        JSON.stringify(this.tabs[tInd].subTabs[stInd][this.copyToKey][cmInd])
      );
      let levels = mData.chartOptions.levels,
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
            s = { ...s, scaleLabel: sourceLevel[0].scales[j].scaleLabel };
          }
          if (this.selectedCopyOption.includes("range")) {
            s = {
              ...s,
              highScale: sourceLevel[0].scales[j].highScale,
              lowScale: sourceLevel[0].scales[j].lowScale,
            };
          }
          if (this.selectedCopyOption.includes("colors")) {
            s = { ...s, scaleColor: sourceLevel[0].scales[j].scaleColor };
          }
          updatedScale[j] = s;
        });
        updatedTargetLevels.push({ ...t, scales: updatedScale });
      });
      let finalLevels = [...pendingLevel, ...updatedTargetLevels].sort(
        (a, b) => {
          return a.level < b.level ? -1 : a.level == b.level ? 0 : 1;
        }
      );
      this.tabs[tInd].subTabs[stInd][this.copyToKey][
        cmInd
      ].chartOptions.levels = finalLevels;
      this.$nextTick(() => {
        this.$bvModal.hide("copyToModal" + tInd + stInd + cmInd);
      });
    },
    applyPalette({
      tInd,
      stInd,
      cmInd,
      shades,
      levelInd = "all",
      key = "chartSetting",
    }) {
      let updatedChart = {
        chartOptions: {
          ...this.tabs[tInd].subTabs[stInd][key][cmInd].chartOptions,
          levels: this.tabs[tInd].subTabs[stInd][key][
            cmInd
          ].chartOptions.levels.map((level, lInd) => {
            if (levelInd !== "all") {
              if (lInd === levelInd) {
                return {
                  ...level,
                  scales: level.scales.map((scale, k) => ({
                    ...scale,
                    scaleColor: shades[k],
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
                  scaleColor: shades[k],
                })),
              };
            }
          }),
        },
      };
      this.$set(this.tabs[tInd].subTabs[stInd][key], cmInd, updatedChart);
    },
    hideModal() {
      this.dataEntryID = "";
      this.isDataEntry = false;
    },
    dataEntry(id) {
      this.dataEntryID = id;
      this.isDataEntry = true;
    },
    getConfigData() {
      this.$store.state.loading = true;
      let key = this.generateKey(this.moduleKey);

      service
        .getSavedConfig(key)
        .then((response) => {
          let d = response.data.map((d) => {
            return {
              ...d,
              subTabs: d.subTabs.map((s) => {
                if (s.mapSetting && s.mapSetting.length) {
                  return {
                    ...s,
                    mapSetting: s.mapSetting.map((m) => {
                      return {
                        chartOptions: {
                          ...m.chartOptions,
                          levels: this.levels.map((l) => {
                            let isFound = m.chartOptions.levels.find(
                              (ml) => ml.level === l.level
                            );
                            if (isFound) {
                              return { ...isFound, levelName: l.levelName };
                            } else {
                              return l;
                            }
                          }),
                        },
                      };
                    }),
                  };
                } else {
                  return s;
                }
              }),
            };
          });
          this.tabs = d;
          this.originalTabs = JSON.parse(JSON.stringify(d));
          this.isDataFetched = true;
          this.$store.state.loading = false;
        })
        .catch((err) => {
          console.log("Config not found...");
          this.isDataFetched = true;
          this.$store.state.loading = false;
          this.reFetchConfig(err);
        });
    },
    async updateConfig() {
      this.$store.state.loading = true;
      let tabs = [];
      if (this.tabs.length) {
        tabs = this.tabs.map(async (t) => {
          let subTabs = t.subTabs.map(async (st) => {
            let chartSetting = st.chartSetting.map(async (d) => {
              let cid = "";
              if (d.chartOptions && !d.chartOptions.cid) {
                try {
                  let resp = await service.createDHISChart(
                    `${randomString(16)} ${d.chartOptions.chartName}`
                  );
                  if (resp.data.status === "OK") {
                    cid = resp.data.response.uid;
                  }
                } catch (err) {
                  console.log(err);
                }
              } else {
                return d;
              }
              return {
                chartOptions: {
                  ...d.chartOptions,
                  cid,
                },
              };
            });
            chartSetting = await Promise.all(chartSetting);
            return {
              ...st,
              chartSetting: chartSetting,
            };
          });
          subTabs = await Promise.all(subTabs);
          return {
            ...t,
            subTabs: subTabs,
          };
        });
        tabs = await Promise.all(tabs);
      }
      let key = this.generateKey(this.moduleKey);
      service
        .getSavedConfig(key)
        .then((res) => {
          // let configData = assign(res.data, tabs);
          let configData = tabs;
          let response = service.updateConfig(configData, key);
          response
            .then((response) => {
              if (response.data.status === "OK") {
                this.sweetAlert({
                  title: this.$i18n.t("data_saved_successfully"),
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
            })
            .catch(() => {
              this.sweetAlert({
                title: this.$i18n.t("error"),
              });
              this.$store.state.loading = false;
              return;
            });
        })
        .catch(() => {
          let response = service.saveConfig(tabs, key);
          response.then((response) => {
            if (response.data.status === "OK") {
              this.sweetAlert({
                title: this.$i18n.t("data_saved_successfully"),
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
          });
        });
    },
    moveItem({ type, places, tInd, stInd, cInd, qInd }) {
      let target = null,
        updateInd = null;
      if (type === "tab") {
        target = this.tabs;
        updateInd = tInd;
      }
      if (type === "subTab") {
        target = this.tabs[tInd].subTabs;
        updateInd = stInd;
      }
      if (type === "chartSetting") {
        target = this.tabs[tInd].subTabs[stInd].chartSetting;
        updateInd = cInd;
      }
      if (type === "mapSetting") {
        target = this.tabs[tInd].subTabs[stInd].mapSetting;
        updateInd = cInd;
      }
      if (type === "question") {
        target = this.tabs[tInd].subTabs[stInd].questions;
        updateInd = qInd;
      }

      if (
        (updateInd === 0 && places === -1) ||
        (updateInd === target.length - 1 && places === 1)
      ) {
        this.sweetAlert({
          title: this.$i18n.t("CantMove"),
        });
      } else {
        let oTemp = target[updateInd];
        let nTemp = target[updateInd * 1 + places];
        this.$set(target, updateInd * 1 + places, oTemp);
        this.$set(target, updateInd, nTemp);
      }
    },
    resetModal({ type }) {
      if (type === "tab") {
        this.groupName = null;
        this.updateIndex = null;
        this.updateType = null;
        this.showGroups = false;
        this.updateSubIndex = null;
        this.updatedTabName = "";
      }
    },
    deleteElement({ type, tInd, stInd, delInd }) {
      if (type === "mapSetting") {
        this.sweetAlert({
          title: this.$i18n.t("mapDelErr"),
        });
      } else {
        this.$swal({
          title: this.$i18n.t("areyousure"),
          text: this.$i18n.t("youablerevertthis"),
          showCancelButton: true,
          reverseButtons: true,
          confirmButtonText: this.$i18n.t("yes_delete_it"),
          cancelButtonText: this.$i18n.t("cancelbtn"),
        }).then((result) => {
          if (result.value) {
            if (type === "tab") {
              this.tabs.splice(tInd, 1);
            }
            if (type === "subTab") {
              this.tabs[tInd].subTabs.splice(stInd, 1);
            }
            if (type === "chartSetting") {
              this.tabs[tInd].subTabs[stInd].chartSetting.splice(delInd, 1);
            }
          }
        });
      }
    },
    addElement({ type, tInd, stInd, mKey = "chartSetting" }) {
      let randomStr = randomString(16);
      if (type === "chartSetting") {
        let config = JSON.parse(JSON.stringify(this.chartSettingConfig));
        this.tabs[tInd].subTabs[stInd].chartSetting.push({
          ...config,
          chartOptions: {
            ...config.chartOptions,
            id: randomStr,
            chartName: { [this.$i18n.locale]: this.$i18n.t("default") },
          },
        });
      }
      if (type === "mapSetting") {
        let map = this.getMapConfig(randomStr);
        this.tabs[tInd].subTabs[stInd][mKey].push(map);
      }
    },
    getMapConfig(randomStr) {
      let map = JSON.parse(JSON.stringify(this.mapSettingConfig));
      map = {
        chartOptions: {
          ...map.chartOptions,
          levels: JSON.parse(JSON.stringify(this.levels)),
          id: randomStr,
          chartName: { [this.$i18n.locale]: this.$i18n.t("default") },
        },
      };
      return map;
    },
    actionOnQuestion({ type, tInd, stInd, qInd }) {
      if (type === "add") {
        this.signOffTab = tInd;
        this.signOffSubTab = stInd;
        let signOff = JSON.parse(JSON.stringify(this.signOff));
        this.signOffQuestion = {
          ...signOff,
          id: randomString(16),
        };
        this.$nextTick(() => {
          this.questionModel = true;
        });
      }
      if (type === "edit") {
        this.signOffTab = tInd;
        this.signOffSubTab = stInd;
        this.signOffQuestion = JSON.parse(
          JSON.stringify(
            this.tabs[this.signOffTab].subTabs[this.signOffSubTab].questions[
              qInd
            ]
          )
        );
        this.$nextTick(() => {
          this.questionModel = true;
        });
      }
      if (type === "delete") {
        this.$swal({
          title: this.$i18n.t("areyousure"),
          text: this.$i18n.t("youablerevertthis"),
          showCancelButton: true,
          reverseButtons: true,
          confirmButtonText: this.$i18n.t("yes_delete_it"),
          cancelButtonText: this.$i18n.t("cancelbtn"),
        }).then((result) => {
          if (result.value) {
            this.tabs[this.signOffTab].subTabs[
              this.signOffSubTab
            ].questions.splice(qInd, 1);
          }
        });
      }
      if (type === "update") {
        if (
          this.signOffQuestion.question &&
          this.signOffQuestion.question[this.$i18n.locale]
        ) {
          let que =
            this.tabs[this.signOffTab].subTabs[this.signOffSubTab].questions;
          let isFound = que.findIndex((q) => q.id === this.signOffQuestion.id);
          if (isFound >= 0) {
            que[isFound] = this.signOffQuestion;
          } else {
            que.push(this.signOffQuestion);
          }
        } else {
          this.sweetAlert({ title: this.$i18n.t("enter_question") });
        }
      }
    },
    actionOnOption({ type, qInd }) {
      if (type === "add") {
        this.signOffQuestion.options.push({
          value: randomString(16),
          text: { [this.$i18n.locale]: this.$i18n.t("default") },
        });
      }
      if (type === "delete") {
        this.$swal({
          title: this.$i18n.t("areyousure"),
          text: this.$i18n.t("youablerevertthis"),
          showCancelButton: true,
          reverseButtons: true,
          confirmButtonText: this.$i18n.t("yes_delete_it"),
          cancelButtonText: this.$i18n.t("cancelbtn"),
        }).then((result) => {
          if (result.value) {
            this.signOffQuestion.options.splice(qInd, 1);
          }
        });
      }
    },
    handleOk() {
      if (this.updatedTabName.length === 0) {
        this.sweetAlert({
          title: this.$i18n.t("enterName"),
        });
        return;
      }
      if (this.updateType === "type1" && this.groupName === null) {
        this.sweetAlert({
          title: this.$i18n.t("selectGroupWarn"),
        });
        return;
      }
      if (this.updateType === "type1") {
        let mapSetting = [];
        if (this.moduleKey === "analyticalDashboard") {
          let map = this.getMapConfig(randomString(16));
          mapSetting.push(map);
        }
        this.tabs.push({
          tabName: { [this.$i18n.locale]: this.updatedTabName },
          id: randomString(16),
          group: this.groupName,
          showGroups: this.showGroups,
          subTabs: [
            {
              group: null,
              mapSetting,
              signOff: [],
              questions: [],
              chartSetting: [],
              categoryInfo: {},
              id: randomString(16),
              backgroundData: null,
              tabName: { [this.$i18n.locale]: this.$i18n.t("default") },
              summary:
                this.moduleKey === "summaryDashboard"
                  ? JSON.parse(JSON.stringify(this.summary))
                  : null,
              integrated:
                this.moduleKey === "summaryDashboard" &&
                this.$store.getters.getNamespace ===
                  "multi_program_mnch-dashboard"
                  ? JSON.parse(JSON.stringify(this.integrated))
                  : null,
            },
          ],
        });
      }
      if (this.updateType === "type11") {
        this.tabs[this.updateIndex].tabName[this.$i18n.locale] =
          this.updatedTabName;
        this.tabs[this.updateIndex].group = this.groupName;
        this.tabs[this.updateIndex].showGroups = this.showGroups;
      }
      if (this.updateType === "type2") {
        let mapSetting = [];
        if (this.moduleKey === "analyticalDashboard") {
          let map = this.getMapConfig(randomString(16));
          mapSetting.push(map);
        }
        this.tabs[this.updateIndex].subTabs.push({
          mapSetting,
          group: null,
          signOff: [],
          questions: [],
          chartSetting: [],
          categoryInfo: {},
          id: randomString(16),
          backgroundData: null,
          tabName: { [this.$i18n.locale]: this.updatedTabName },
          summary:
            this.moduleKey === "summaryDashboard"
              ? JSON.parse(JSON.stringify(this.summary))
              : null,
          integrated:
            this.moduleKey === "summaryDashboard" &&
            this.$store.getters.getNamespace === "multi_program_mnch-dashboard"
              ? JSON.parse(JSON.stringify(this.integrated))
              : null,
        });
      }
      if (this.updateType === "type21") {
        this.tabs[this.updateIndex].subTabs[this.updateSubIndex].tabName[
          this.$i18n.locale
        ] = this.updatedTabName;
      }
      //To reset modal values
      this.resetModal({ type: "tab" });
    },
    updatedBGData({
      tInd,
      stInd,
      group = "",
      type = "",
      chartCalculation = "",
    }) {
      let bgData = JSON.parse(JSON.stringify(this.backgroundData));
      if (group.includes("-IC-")) {
        this.tabs[tInd].subTabs[stInd].backgroundData = bgData.IC;
      } else if (group.includes("-CT-")) {
        this.tabs[tInd].subTabs[stInd].backgroundData = bgData.CT;
      } else if (
        group.includes("-CC-") ||
        type === "scatter" ||
        chartCalculation === "SOURCE_DIFF"
      ) {
        this.tabs[tInd].subTabs[stInd].backgroundData = bgData.CC;
      } else {
        this.tabs[tInd].subTabs[stInd].backgroundData = null;
      }
      if (group === "SUMMARY") {
        if (this.tabs[tInd].subTabs[stInd].mapSetting.length === 0) {
          this.addElement({
            type: "mapSetting",
            tInd: tInd,
            stInd: stInd,
            mKey: "mapSetting",
          });
        }
      }
    },
    updateTab({
      type,
      tInd = null,
      group = null,
      stInd = null,
      tabName = "",
      showGroups = false,
    }) {
      let n = tabName;
      this.updateIndex = tInd;
      this.groupName = group;
      this.updateType = type;
      this.updateSubIndex = stInd;
      this.updatedTabName = n;
      this.showGroups = showGroups;
      this.$nextTick(() => {
        this.tabNameModal = true;
      });
    },
    getGroupList() {
      let gList = [
        {
          value: "ANC",
          text: this.$i18n.t("ANC"),
        },
        {
          value: "PNC",
          text: this.$i18n.t("PNC"),
        },
        {
          value: "DELIVERY_CARE",
          text: this.$i18n.t("Delivery_Care"),
        },
        {
          value: "MAT_DEATHS",
          text: this.$i18n.t("Maternal_Deaths"),
        },
        {
          value: "SBN_DEATHS",
          text: this.$i18n.t("Still_Birth"),
        },
        {
          value: "INF_HEALTH",
          text: this.$i18n.t("Infant_Health"),
        },
        {
          value: "DEFAULT",
          text: this.$i18n.t("default"),
        },
      ];
      if (this.$store.getters.getNamespace !== "multi_program_mnch-dashboard") {
        gList = [
          {
            value: "User",
            text: this.$i18n.t("users"),
          },
          {
            value: "Visits",
            text: this.$i18n.t("visits"),
          },
          {
            value: "Commodities_Client",
            text: this.$i18n.t("Commodities_Client"),
          },
          {
            value: "Commodities_Facilities",
            text: this.$i18n.t("Commodities_Facilities"),
          },
          {
            value: "DEFAULT",
            text: this.$i18n.t("default"),
          },
        ];
      }
      return gList;
    },
  },
  created() {
    this.groups = this.getGroupList();
    this.getConfigData();
  },
};
</script>
