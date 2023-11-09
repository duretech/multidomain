<template>
  <div
    class="sidebar-newbody"
    :class="{
      'fav-newsidebar': ['SavedFavorites', 'report'].includes($route.name),
    }"
    v-if="
      [
        'DQRDashboard',
        'dqr-dashboard',
        'SummaryDashboard',
        'summary-dashboard',
        'AnalyticalDashboard',
        'analytical-dashboard',
        'SavedFavorites',
        'report',
      ].includes($route.name)
    "
  >
    <!-- Add the conditions above to show the sidebar only on specific pages -->
    <div>
      <b-sidebar id="sidebar-2" class="accordion" backdrop>
        <div
          class="sidebar"
          v-if="
            [
              'DQRDashboard',
              'SummaryDashboard',
              'summary-dashboard',
              'AnalyticalDashboard',
            ].includes($route.name)
          "
        >
          <div
            v-if="
              [
                'SummaryDashboard',
                'summary-dashboard',
                'AnalyticalDashboard',
              ].includes($route.name)
            "
          >
            <b-button
              v-if="
                ['SummaryDashboard', 'summary-dashboard'].includes($route.name)
              "
              class="sidebar-item my-3 fs-17-1920"
              :class="{
                'sidebar-item-active':
                  $store.getters.getActiveTab === 'sd-summary' &&
                  ['SummaryDashboard', 'summary-dashboard'].includes(
                    $route.name
                  ),
              }"
              @click="updateActiveTab('sd-summary')"
            >
              <div class="fs-17-1920">{{ $t("key_insights") }}</div>
            </b-button>
          </div>
          <div v-for="tab in configDataFormatted" :key="'tab-' + tab.id">
            <b-button
              class="sidebar-item my-3 collapse-delivery fs-17-1920"
              :class="{
                'sidebar-item-active': $store.getters.getActiveTab.includes(
                  `${tab.group}-${tab.id}`
                ),
              }"
              v-b-toggle="'sd-accordion' + tab.id"
            >
              {{ tab.tabName }}</b-button
            >
            <b-collapse
              :id="'sd-accordion' + tab.id"
              accordion="my-accordion"
              :visible="
                $store.getters.getActiveTab.includes(
                  `${tab.group}-${tab.id}`
                ) ||
                ($route.name === 'DQRDashboard' &&
                  ['emuMonthlyTab', 'emuAnnualTab'].includes(
                    $store.getters.getActiveTab
                  ))
              "
            >
              <div v-if="$route.name === 'DQRDashboard'">
                <b-button
                  class="sidebar-sub-menu-option fs-16-1920 my-3"
                  :class="{
                    'sidebar-item-active-option':
                      $store.getters.getActiveTab ===
                      `${tab.group}-${tab.id}-dqr-summary`,
                  }"
                  @click="updateActiveTab(`${tab.group}-${tab.id}-dqr-summary`)"
                >
                  <div class="ml-10px fs-16-1920">{{ $t("Summary") }}</div>
                </b-button>
              </div>
              <template v-if="tab.showGroups">
                <div
                  v-for="(subTab, i) in tab.subTabs"
                  :key="'subTabGroups-' + subTab.id"
                >
                  <b-button
                    class="sidebar-item my-3 collapse-delivery subgroups fs-17-1920"
                    :class="{
                      'sidebar-item-active':
                        $store.getters.getActiveTab.includes(
                          `${tab.group}-${tab.id}-${subTab.id}`
                        ),
                    }"
                    v-b-toggle="'sd-accordion' + tab.id + subTab.id + i"
                  >
                    {{ subTab.tabName }}</b-button
                  >
                  <b-collapse
                    :id="'sd-accordion' + tab.id + subTab.id + i"
                    :visible="
                      $store.getters.getActiveTab.includes(
                        `${tab.group}-${tab.id}-${subTab.id}`
                      )
                    "
                    :accordion="'my-accordion' + tab.id"
                  >
                    <b-button
                      v-for="innerSubTab in subTab.subTabs"
                      :key="'innerSubTab-' + subTab.id + innerSubTab.id"
                      class="sidebar-sub-menu-option subgroups-menu fs-16-1920 my-3"
                      :class="{
                        'sidebar-item-active-option':
                          $store.getters.getActiveTab.includes(
                            `${tab.group}-${tab.id}-${subTab.id}-${innerSubTab.id}`
                          ),
                      }"
                      @click.stop.prevent="
                        updateActiveTab(
                          `${tab.group}-${tab.id}-${subTab.id}-${innerSubTab.id}`
                        )
                      "
                    >
                      <div class="ml-10px fs-16-1920">
                        {{ innerSubTab.tabName }}
                      </div></b-button
                    >
                  </b-collapse>
                </div>
              </template>
              <template v-else>
                <b-button
                  v-for="subTab in tab.subTabs"
                  :key="'subTab-' + subTab.id"
                  class="sidebar-sub-menu-option fs-16-1920 my-3"
                  :class="{
                    'sidebar-item-active-option':
                      $store.getters.getActiveTab.includes(
                        `${tab.group}-${tab.id}-${subTab.id}`
                      ),
                  }"
                  @click.stop.prevent="
                    updateActiveTab(`${tab.group}-${tab.id}-${subTab.id}`)
                  "
                >
                  <div class="ml-10px fs-16-1920">
                    <template v-if="subTab.showFlag">
                      <b-spinner
                        type="grow"
                        small
                        v-if="!subTab.flagDetails.value"
                      ></b-spinner>
                      <template v-else>
                        <i
                          class="fa fa-circle mr-1"
                          :style="{
                            color:
                              subTab.flagDetails.value === 'error'
                                ? '#b5b3a7'
                                : subTab.flagDetails.value === 'flag'
                                ? '#d97276'
                                : '#5ab276',
                          }"
                          :id="'popover-target-' + subTab.id"
                        ></i>
                        <b-popover
                          :target="'popover-target-' + subTab.id"
                          triggers="hover"
                          placement="rightbottom"
                        >
                          <template #title>{{ $t("status") }}</template>
                          <div
                            v-for="(message, index) in subTab.flagDetails
                              .messages"
                            :key="'flag' + subTab.id + index"
                            v-html="message"
                          ></div>
                          <div
                            class="text-center"
                            v-if="subTab.flagDetails.messages.length === 0"
                          >
                            {{ $t("noMessage") }}
                          </div>
                        </b-popover>
                      </template>
                    </template>
                    {{ subTab.tabName }}
                  </div></b-button
                >
              </template>
              <template
                v-if="
                  $route.name === 'DQRDashboard' &&
                  $store.getters.getNamespace !== `${$store.getters.getAppSettings.tableName}_mnch-dashboard`
                "
              >
                <div v-if="isMonthlyTab">
                  <b-button
                    class="sidebar-sub-menu-option fs-16-1920 my-3"
                    :class="{
                      'sidebar-item-active-option':
                        $store.getters.getActiveTab === 'emuMonthlyTab',
                    }"
                    @click="updateActiveTab('emuMonthlyTab')"
                  >
                    <div class="ml-10px fs-16-1920">
                      {{ $t("emu_monthly") }}
                    </div>
                  </b-button>
                </div>
                <div v-if="isAnnualTab">
                  <b-button
                    class="sidebar-sub-menu-option fs-16-1920 my-3"
                    :class="{
                      'sidebar-item-active-option':
                        $store.getters.getActiveTab === 'emuAnnualTab',
                    }"
                    @click="updateActiveTab('emuAnnualTab')"
                  >
                    <div class="ml-10px fs-16-1920">{{ $t("emu_annual") }}</div>
                  </b-button>
                </div>
              </template>
            </b-collapse>
          </div>
          <template
            v-if="
              $route.name === 'AnalyticalDashboard' &&
              $store.getters.getNamespace !== `${$store.getters.getAppSettings.tableName}_mnch-dashboard`

            "
          >
            <div>
              <b-button
                class="sidebar-item my-3 collapse-delivery fs-17-1920"
                :class="{
                  'sidebar-item-active': [
                    'emuMonthlyTab',
                    'emuAnnualTab',
                  ].includes($store.getters.getActiveTab),
                }"
                v-b-toggle="'sd-accordion-benchmarking'"
              >
                {{ $t("benchmarking") }}</b-button
              >
              <b-collapse
                :id="'sd-accordion-benchmarking'"
                accordion="my-accordion"
                :visible="
                  ['emuMonthlyTab', 'emuAnnualTab'].includes(
                    $store.getters.getActiveTab
                  )
                "
              >
                <div>
                  <b-button
                    class="sidebar-sub-menu-option fs-16-1920 my-3"
                    :class="{
                      'sidebar-item-active-option':
                        $store.getters.getActiveTab === 'emuMonthlyTab',
                    }"
                    @click="updateActiveTab('emuMonthlyTab')"
                  >
                    <div class="ml-10px fs-16-1920">
                      {{ $t("emu_monthly") }}
                    </div>
                  </b-button>
                </div>
                <div>
                  <b-button
                    class="sidebar-sub-menu-option fs-16-1920 my-3"
                    :class="{
                      'sidebar-item-active-option':
                        $store.getters.getActiveTab === 'emuAnnualTab',
                    }"
                    @click="updateActiveTab('emuAnnualTab')"
                  >
                    <div class="ml-10px fs-16-1920">{{ $t("emu_annual") }}</div>
                  </b-button>
                </div>
              </b-collapse>
            </div>
          </template>
        </div>
        <div class="sidebar" v-if="$route.name === 'dqr-dashboard'">
          <div class="link-container">
            <div class="link">
              <b-button
                class="sidebar-item my-3 fs-17-1920"
                :class="{
                  'sidebar-item-active':
                    $store.getters.getActiveTab === 'emuMonthlyTab',
                }"
                @click="updateActiveTab('emuMonthlyTab')"
              >
                <div class="fs-17-1920">{{ $t("emu_monthly") }}</div>
              </b-button>
            </div>
            <div class="link d-none">
              <b-button
                class="sidebar-item my-3 collapse-delivery fs-17-1920"
                :class="{
                  'sidebar-item-active':
                    $store.getters.getActiveTab.includes('emuMonthlyTab-'),
                }"
                v-b-toggle="'sd-accordion-emuMonthlyTab'"
              >
                {{ $t("emu_monthly") }}</b-button
              >
              <b-collapse
                :id="'sd-accordion-emuMonthlyTab'"
                accordion="my-accordion"
                :visible="
                  $store.getters.getActiveTab.includes('emuMonthlyTab-')
                "
              >
                <template v-if="monthlyClient">
                  <b-button
                    class="sidebar-item my-3 collapse-delivery fs-17-1920"
                    :class="{
                      'sidebar-item-active':
                        $store.getters.getActiveTab.includes(
                          'emuMonthlyTab-client-'
                        ),
                    }"
                    v-b-toggle="'sd-accordion1-emuMonthlyTab-client'"
                  >
                    {{ $t("commodities_Distributed_to_Clients") }}</b-button
                  >
                  <b-collapse
                    :id="'sd-accordion1-emuMonthlyTab-client'"
                    accordion="my-accordion1"
                    :visible="
                      $store.getters.getActiveTab.includes(
                        'emuMonthlyTab-client-'
                      )
                    "
                  >
                    <b-button
                      class="sidebar-sub-menu-option fs-16-1920 my-3"
                      :class="{
                        'sidebar-item-active-option':
                          $store.getters.getActiveTab.includes(
                            'emuMonthlyTab-client-inputData'
                          ),
                      }"
                      @click.stop.prevent="
                        updateActiveTab('emuMonthlyTab-client-inputData')
                      "
                    >
                      <div class="ml-10px fs-16-1920">
                        {{ $t("inputData") }}
                      </div></b-button
                    >
                    <b-button
                      class="sidebar-sub-menu-option fs-16-1920 my-3"
                      :class="{
                        'sidebar-item-active-option':
                          $store.getters.getActiveTab.includes(
                            'emuMonthlyTab-client-totalEMU'
                          ),
                      }"
                      @click.stop.prevent="
                        updateActiveTab('emuMonthlyTab-client-totalEMU')
                      "
                    >
                      <div class="ml-10px fs-16-1920">
                        {{ $t("total-EMU") }}
                      </div></b-button
                    >
                  </b-collapse>
                </template>
                <template v-if="monthlyFacilities">
                  <b-button
                    class="sidebar-item my-3 collapse-delivery fs-17-1920"
                    :class="{
                      'sidebar-item-active':
                        $store.getters.getActiveTab.includes(
                          'emuMonthlyTab-facilities-'
                        ),
                    }"
                    v-b-toggle="'sd-accordion1-emuMonthlyTab-facilities'"
                  >
                    {{ $t("commodities_Distributed_to_Facilities") }}</b-button
                  >
                  <b-collapse
                    :id="'sd-accordion1-emuMonthlyTab-facilities'"
                    accordion="my-accordion1"
                    :visible="
                      $store.getters.getActiveTab.includes(
                        'emuMonthlyTab-facilities-'
                      )
                    "
                  >
                    <b-button
                      class="sidebar-sub-menu-option fs-16-1920 my-3"
                      :class="{
                        'sidebar-item-active-option':
                          $store.getters.getActiveTab.includes(
                            'emuMonthlyTab-facilities-inputData'
                          ),
                      }"
                      @click.stop.prevent="
                        updateActiveTab('emuMonthlyTab-facilities-inputData')
                      "
                    >
                      <div class="ml-10px fs-16-1920">
                        {{ $t("inputData") }}
                      </div></b-button
                    >
                    <b-button
                      class="sidebar-sub-menu-option fs-16-1920 my-3"
                      :class="{
                        'sidebar-item-active-option':
                          $store.getters.getActiveTab.includes(
                            'emuMonthlyTab-facilities-totalEMU'
                          ),
                      }"
                      @click.stop.prevent="
                        updateActiveTab('emuMonthlyTab-facilities-totalEMU')
                      "
                    >
                      <div class="ml-10px fs-16-1920">
                        {{ $t("total-EMU") }}
                      </div></b-button
                    >
                  </b-collapse>
                </template>
                <template v-if="monthlyVisits">
                  <b-button
                    class="sidebar-item my-3 collapse-delivery fs-17-1920"
                    :class="{
                      'sidebar-item-active':
                        $store.getters.getActiveTab.includes(
                          'emuMonthlyTab-visits-'
                        ),
                    }"
                    v-b-toggle="'sd-accordion1-emuMonthlyTab-visits'"
                  >
                    {{ $t("fp_visits") }}</b-button
                  >
                  <b-collapse
                    :id="'sd-accordion1-emuMonthlyTab-visits'"
                    accordion="my-accordion1"
                    :visible="
                      $store.getters.getActiveTab.includes(
                        'emuMonthlyTab-visits-'
                      )
                    "
                  >
                    <b-button
                      class="sidebar-sub-menu-option fs-16-1920 my-3"
                      :class="{
                        'sidebar-item-active-option':
                          $store.getters.getActiveTab.includes(
                            'emuMonthlyTab-visits-inputData'
                          ),
                      }"
                      @click.stop.prevent="
                        updateActiveTab('emuMonthlyTab-visits-inputData')
                      "
                    >
                      <div class="ml-10px fs-16-1920">
                        {{ $t("inputData") }}
                      </div></b-button
                    >
                    <b-button
                      class="sidebar-sub-menu-option fs-16-1920 my-3"
                      :class="{
                        'sidebar-item-active-option':
                          $store.getters.getActiveTab.includes(
                            'emuMonthlyTab-visits-totalEMU'
                          ),
                      }"
                      @click.stop.prevent="
                        updateActiveTab('emuMonthlyTab-visits-totalEMU')
                      "
                    >
                      <div class="ml-10px fs-16-1920">
                        {{ $t("total-EMU") }}
                      </div></b-button
                    >
                  </b-collapse>
                </template>
                <template v-if="monthlyUsers">
                  <b-button
                    class="sidebar-item my-3 collapse-delivery fs-17-1920"
                    :class="{
                      'sidebar-item-active':
                        $store.getters.getActiveTab.includes(
                          'emuMonthlyTab-users-'
                        ),
                    }"
                    v-b-toggle="'sd-accordion1-emuMonthlyTab-users'"
                  >
                    {{ $t("fp_users") }}</b-button
                  >
                  <b-collapse
                    :id="'sd-accordion1-emuMonthlyTab-users'"
                    accordion="my-accordion1"
                    :visible="
                      $store.getters.getActiveTab.includes(
                        'emuMonthlyTab-users-'
                      )
                    "
                  >
                    <b-button
                      class="sidebar-sub-menu-option fs-16-1920 my-3"
                      :class="{
                        'sidebar-item-active-option':
                          $store.getters.getActiveTab.includes(
                            'emuMonthlyTab-users-inputData'
                          ),
                      }"
                      @click.stop.prevent="
                        updateActiveTab('emuMonthlyTab-users-inputData')
                      "
                    >
                      <div class="ml-10px fs-16-1920">
                        {{ $t("inputData") }}
                      </div></b-button
                    >
                    <b-button
                      class="sidebar-sub-menu-option fs-16-1920 my-3"
                      :class="{
                        'sidebar-item-active-option':
                          $store.getters.getActiveTab.includes(
                            'emuMonthlyTab-users-totalEMU'
                          ),
                      }"
                      @click.stop.prevent="
                        updateActiveTab('emuMonthlyTab-users-totalEMU')
                      "
                    >
                      <div class="ml-10px fs-16-1920">
                        {{ $t("total-EMU") }}
                      </div></b-button
                    >
                  </b-collapse>
                </template>
              </b-collapse>
            </div>
            <div class="link">
              <b-button
                class="sidebar-item my-3 fs-17-1920"
                :class="{
                  'sidebar-item-active':
                    $store.getters.getActiveTab === 'emuAnnualTab',
                }"
                @click="updateActiveTab('emuAnnualTab')"
              >
                <div class="fs-17-1920">{{ $t("emu_annual") }}</div>
              </b-button>
            </div>
            <div class="link d-none">
              <b-button
                class="sidebar-item my-3 collapse-delivery fs-17-1920"
                :class="{
                  'sidebar-item-active':
                    $store.getters.getActiveTab.includes('emuAnnualTab-'),
                }"
                v-b-toggle="'sd-accordion-emuAnnualTab'"
              >
                {{ $t("emu_annual") }}</b-button
              >
              <b-collapse
                :id="'sd-accordion-emuAnnualTab'"
                accordion="my-accordion"
                :visible="$store.getters.getActiveTab.includes('emuAnnualTab-')"
              >
                <template v-if="annualClient">
                  <b-button
                    class="sidebar-item my-3 collapse-delivery fs-17-1920"
                    :class="{
                      'sidebar-item-active':
                        $store.getters.getActiveTab.includes(
                          'emuAnnualTab-client-'
                        ),
                    }"
                    v-b-toggle="'sd-accordion1-emuAnnualTab-client'"
                  >
                    {{ $t("commodities_Distributed_to_Clients") }}</b-button
                  >
                  <b-collapse
                    :id="'sd-accordion1-emuAnnualTab-client'"
                    accordion="my-accordion1"
                    :visible="
                      $store.getters.getActiveTab.includes(
                        'emuAnnualTab-client-'
                      )
                    "
                  >
                    <b-button
                      class="sidebar-sub-menu-option fs-16-1920 my-3"
                      :class="{
                        'sidebar-item-active-option':
                          $store.getters.getActiveTab.includes(
                            'emuAnnualTab-client-reportingRates'
                          ),
                      }"
                      @click.stop.prevent="
                        updateActiveTab('emuAnnualTab-client-reportingRates')
                      "
                    >
                      <div class="ml-10px fs-16-1920">
                        {{ $t("reportingRates") }}
                      </div></b-button
                    >
                    <b-button
                      class="sidebar-sub-menu-option fs-16-1920 my-3"
                      :class="{
                        'sidebar-item-active-option':
                          $store.getters.getActiveTab.includes(
                            'emuAnnualTab-client-inputData'
                          ),
                      }"
                      @click.stop.prevent="
                        updateActiveTab('emuAnnualTab-client-inputData')
                      "
                    >
                      <div class="ml-10px fs-16-1920">
                        {{ $t("inputData") }}
                      </div></b-button
                    >
                    <b-button
                      class="sidebar-sub-menu-option fs-16-1920 my-3"
                      :class="{
                        'sidebar-item-active-option':
                          $store.getters.getActiveTab.includes(
                            'emuAnnualTab-client-outputs'
                          ),
                      }"
                      @click.stop.prevent="
                        updateActiveTab('emuAnnualTab-client-outputs')
                      "
                    >
                      <div class="ml-10px fs-16-1920">
                        {{ $t("outputs") }}
                      </div></b-button
                    >
                  </b-collapse>
                </template>
                <template v-if="annualFacilities">
                  <b-button
                    class="sidebar-item my-3 collapse-delivery fs-17-1920"
                    :class="{
                      'sidebar-item-active':
                        $store.getters.getActiveTab.includes(
                          'emuAnnualTab-facilities-'
                        ),
                    }"
                    v-b-toggle="'sd-accordion1-emuAnnualTab-facilities'"
                  >
                    {{ $t("commodities_Distributed_to_Facilities") }}</b-button
                  >
                  <b-collapse
                    :id="'sd-accordion1-emuAnnualTab-facilities'"
                    accordion="my-accordion1"
                    :visible="
                      $store.getters.getActiveTab.includes(
                        'emuAnnualTab-facilities-'
                      )
                    "
                  >
                    <b-button
                      class="sidebar-sub-menu-option fs-16-1920 my-3"
                      :class="{
                        'sidebar-item-active-option':
                          $store.getters.getActiveTab.includes(
                            'emuAnnualTab-facilities-reportingRates'
                          ),
                      }"
                      @click.stop.prevent="
                        updateActiveTab(
                          'emuAnnualTab-facilities-reportingRates'
                        )
                      "
                    >
                      <div class="ml-10px fs-16-1920">
                        {{ $t("reportingRates") }}
                      </div></b-button
                    >
                    <b-button
                      class="sidebar-sub-menu-option fs-16-1920 my-3"
                      :class="{
                        'sidebar-item-active-option':
                          $store.getters.getActiveTab.includes(
                            'emuAnnualTab-facilities-inputData'
                          ),
                      }"
                      @click.stop.prevent="
                        updateActiveTab('emuAnnualTab-facilities-inputData')
                      "
                    >
                      <div class="ml-10px fs-16-1920">
                        {{ $t("inputData") }}
                      </div></b-button
                    >
                    <b-button
                      class="sidebar-sub-menu-option fs-16-1920 my-3"
                      :class="{
                        'sidebar-item-active-option':
                          $store.getters.getActiveTab.includes(
                            'emuAnnualTab-facilities-outputs'
                          ),
                      }"
                      @click.stop.prevent="
                        updateActiveTab('emuAnnualTab-facilities-outputs')
                      "
                    >
                      <div class="ml-10px fs-16-1920">
                        {{ $t("outputs") }}
                      </div></b-button
                    >
                  </b-collapse>
                </template>
                <template v-if="annualVisits">
                  <b-button
                    class="sidebar-item my-3 collapse-delivery fs-17-1920"
                    :class="{
                      'sidebar-item-active':
                        $store.getters.getActiveTab.includes(
                          'emuAnnualTab-visits-'
                        ),
                    }"
                    v-b-toggle="'sd-accordion1-emuAnnualTab-visits'"
                  >
                    {{ $t("fp_visits") }}</b-button
                  >
                  <b-collapse
                    :id="'sd-accordion1-emuAnnualTab-visits'"
                    accordion="my-accordion1"
                    :visible="
                      $store.getters.getActiveTab.includes(
                        'emuAnnualTab-visits-'
                      )
                    "
                  >
                    <b-button
                      class="sidebar-sub-menu-option fs-16-1920 my-3"
                      :class="{
                        'sidebar-item-active-option':
                          $store.getters.getActiveTab.includes(
                            'emuAnnualTab-visits-reportingRates'
                          ),
                      }"
                      @click.stop.prevent="
                        updateActiveTab('emuAnnualTab-visits-reportingRates')
                      "
                    >
                      <div class="ml-10px fs-16-1920">
                        {{ $t("reportingRates") }}
                      </div></b-button
                    >
                    <b-button
                      class="sidebar-sub-menu-option fs-16-1920 my-3"
                      :class="{
                        'sidebar-item-active-option':
                          $store.getters.getActiveTab.includes(
                            'emuAnnualTab-visits-inputData'
                          ),
                      }"
                      @click.stop.prevent="
                        updateActiveTab('emuAnnualTab-visits-inputData')
                      "
                    >
                      <div class="ml-10px fs-16-1920">
                        {{ $t("inputData") }}
                      </div></b-button
                    >
                    <b-button
                      class="sidebar-sub-menu-option fs-16-1920 my-3"
                      :class="{
                        'sidebar-item-active-option':
                          $store.getters.getActiveTab.includes(
                            'emuAnnualTab-visits-outputs'
                          ),
                      }"
                      @click.stop.prevent="
                        updateActiveTab('emuAnnualTab-visits-outputs')
                      "
                    >
                      <div class="ml-10px fs-16-1920">
                        {{ $t("outputs") }}
                      </div></b-button
                    >
                  </b-collapse>
                </template>
                <template v-if="annualUsers">
                  <b-button
                    class="sidebar-item my-3 collapse-delivery fs-17-1920"
                    :class="{
                      'sidebar-item-active':
                        $store.getters.getActiveTab.includes(
                          'emuAnnualTab-users-'
                        ),
                    }"
                    v-b-toggle="'sd-accordion1-emuAnnualTab-users'"
                  >
                    {{ $t("fp_users") }}</b-button
                  >
                  <b-collapse
                    :id="'sd-accordion1-emuAnnualTab-users'"
                    accordion="my-accordion1"
                    :visible="
                      $store.getters.getActiveTab.includes(
                        'emuAnnualTab-users-'
                      )
                    "
                  >
                    <b-button
                      class="sidebar-sub-menu-option fs-16-1920 my-3"
                      :class="{
                        'sidebar-item-active-option':
                          $store.getters.getActiveTab.includes(
                            'emuAnnualTab-users-reportingRates'
                          ),
                      }"
                      @click.stop.prevent="
                        updateActiveTab('emuAnnualTab-users-reportingRates')
                      "
                    >
                      <div class="ml-10px fs-16-1920">
                        {{ $t("reportingRates") }}
                      </div></b-button
                    >
                    <b-button
                      class="sidebar-sub-menu-option fs-16-1920 my-3"
                      :class="{
                        'sidebar-item-active-option':
                          $store.getters.getActiveTab.includes(
                            'emuAnnualTab-users-inputData'
                          ),
                      }"
                      @click.stop.prevent="
                        updateActiveTab('emuAnnualTab-users-inputData')
                      "
                    >
                      <div class="ml-10px fs-16-1920">
                        {{ $t("inputData") }}
                      </div></b-button
                    >
                    <b-button
                      class="sidebar-sub-menu-option fs-16-1920 my-3"
                      :class="{
                        'sidebar-item-active-option':
                          $store.getters.getActiveTab.includes(
                            'emuAnnualTab-users-outputs'
                          ),
                      }"
                      @click.stop.prevent="
                        updateActiveTab('emuAnnualTab-users-outputs')
                      "
                    >
                      <div class="ml-10px fs-16-1920">
                        {{ $t("outputs") }}
                      </div></b-button
                    >
                  </b-collapse>
                </template>
                <b-button
                  v-if="
                    annualClient ||
                    annualFacilities ||
                    annualVisits ||
                    annualUsers
                  "
                  class="sidebar-item my-3 fs-17-1920"
                  :class="{
                    'sidebar-item-active':
                      $store.getters.getActiveTab === 'emuAnnualTab-output',
                  }"
                  @click="updateActiveTab('emuAnnualTab-output')"
                >
                  <div class="fs-17-1920">{{ $t("emu_Output") }}</div>
                </b-button>
              </b-collapse>
            </div>
          </div>
        </div>
        <div class="sidebar" v-if="$route.name === 'analytical-dashboard'">
          <div class="link-container">
            <div class="link">
              <b-button
                class="sidebar-item my-3 collapse-delivery fs-17-1920"
                :class="{
                  'sidebar-item-active':
                    $store.getters.getActiveTab.includes('benchMarkingTab-'),
                }"
                v-b-toggle="'sd-accordion-benchMarkingTab'"
              >
                {{ $t("benchmarking") }}</b-button
              >
              <b-collapse
                :id="'sd-accordion-benchMarkingTab'"
                accordion="my-accordion"
                :visible="
                  $store.getters.getActiveTab.includes('benchMarkingTab-')
                "
              >
                <b-button
                  class="sidebar-sub-menu-option fs-16-1920 my-3"
                  :class="{
                    'sidebar-item-active-option':
                      $store.getters.getActiveTab.includes('-monthly'),
                  }"
                  @click.stop.prevent="
                    updateActiveTab('benchMarkingTab-monthly')
                  "
                >
                  <div class="ml-10px fs-16-1920">
                    {{ $t("emu_monthly") }}
                  </div></b-button
                >
                <b-button
                  class="sidebar-sub-menu-option fs-16-1920 my-3"
                  :class="{
                    'sidebar-item-active-option':
                      $store.getters.getActiveTab.includes('-annual'),
                  }"
                  @click.stop.prevent="
                    updateActiveTab('benchMarkingTab-annual')
                  "
                >
                  <div class="ml-10px fs-16-1920">
                    {{ $t("emu_annual") }}
                  </div></b-button
                >
              </b-collapse>
            </div>
          </div>
        </div>
        <div
          class="sidebar"
          :class="{ 'fav-sidebar': $route.name === 'SavedFavorites' }"
          v-if="$route.name === 'SavedFavorites'"
        >
          <div class="link-container fav-sideicons">
            <div
              class="link"
              v-if="
                $store.getters.getIsAdmin ||
                $store.getters.getAppSettings.bypassUser
              "
            >
              <div>
                <b-button
                  class="sidebar-item my-3 fs-17-1920"
                  :class="{
                    'sidebar-item-active':
                      $store.getters.getActiveTab === 'create-new-module',
                  }"
                  @click="updateActiveTab('create-new-module')"
                >
                  <div class="fav-img"></div>
                  <div class="text-line">
                    {{ $t("subMenu_1") }}
                  </div>
                </b-button>
              </div>
            </div>
            <div class="link">
              <div>
                <b-button
                  class="sidebar-item my-3 fs-17-1920"
                  :class="{
                    'sidebar-item-active':
                      $store.getters.getActiveTab === 'view-module',
                  }"
                  @click="updateActiveTab('view-module')"
                >
                  <div class="fav-img"></div>
                  <div class="text-line">
                    {{ $t("view_modules") }}
                  </div>
                </b-button>
              </div>
            </div>
          </div>
        </div>
        <div
          class="sidebar"
          :class="{ 'report-sidebar': $route.name === 'report' }"
          v-if="$route.name === 'report'"
        >
          <div class="link-container fav-sideicons">
            <div class="link">
              <div>
                <b-button
                  class="sidebar-item my-3 fs-17-1920"
                  :class="{
                    'sidebar-item-active':
                      $store.getters.getActiveTab === 'generate-new-report',
                  }"
                  @click="updateActiveTab('generate-new-report')"
                >
                  <div class="fav-img"></div>
                  <div class="text-line pt-1">
                    {{ $t("exportbtn") }}
                  </div>
                </b-button>
              </div>
            </div>
            <div
              class="link"
              v-if="
                $store.getters.getIsAdmin ||
                $store.getters.getAppSettings.bypassUser ||
                $store.getters.getUserPermissions.canGenerateReport
              "
            >
              <div>
                <b-button
                  class="sidebar-item my-3 fs-17-1920"
                  :class="{
                    'sidebar-item-active':
                      $store.getters.getActiveTab === 'create-new-report',
                  }"
                  @click="updateActiveTab('create-new-report')"
                >
                  <div class="fav-img"></div>
                  <div class="text-line pt-1">
                    {{ $t("createReport") }}
                  </div>
                </b-button>
              </div>
            </div>
            <div
              class="link"
              v-if="
                $store.getters.getIsAdmin ||
                $store.getters.getAppSettings.bypassUser ||
                $store.getters.getUserPermissions.canGenerateReport
              "
            >
              <div>
                <b-button
                  class="sidebar-item my-3 fs-17-1920"
                  :class="{
                    'sidebar-item-active':
                      $store.getters.getActiveTab === 'view-report',
                  }"
                  @click="updateActiveTab('view-report')"
                >
                  <div class="fav-img"></div>
                  <div class="text-line pt-1">
                    {{ $t("viewReports") }}
                  </div>
                </b-button>
              </div>
            </div>
          </div>
        </div>
        <div class="social-icons py-2">
          <p class="follow-us fs-15-1920 text-center mb-0">
            {{ $t("follow_us") }}:
            <img
              :src="require('@/assets/images/icons/facebook.png')"
              class="fb-icon ml-4 mr-2"
            />
            <img
              :src="require('@/assets/images/icons/tweeter.png')"
              class="tweet-icon"
            />
          </p>
        </div>
      </b-sidebar>
    </div>
  </div>
</template>
<script>
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
export default {
  props: ["configData", "configDataFP", "flagData", "updateKey"],
  mixins: [DynamicImageMixin],
  data() {
    return {
      monthlyClient: true,
      monthlyFacilities: true,
      monthlyVisits: true,
      monthlyUsers: true,
      annualClient: true,
      annualFacilities: true,
      annualVisits: true,
      annualUsers: true,
      isMonthlyTab: false,
      isAnnualTab: false,
    };
  },
  computed: {
    configDataFormatted() {
      let menu = [];
      if (this.configData && this.configData.length) {
        this.configData.forEach((c) => {
          let innerObj = {
            id: c.id,
            tabName: c.tabName[this.$i18n.locale],
            group: c.group,
            showGroups: c.showGroups,
            subTabs: [],
          };
          c.subTabs.forEach((t) => {
            let isMapping = t.chartSetting.find(
              (c) =>
                (c.chartOptions.isSavedData ||
                  (c.chartOptions.dataMapping &&
                    c.chartOptions.dataMapping.length)) &&
                !c.chartOptions.disable
            );
            if (!isMapping && this.$route.name === "AnalyticalDashboard") {
              isMapping = t.mapSetting.find(
                (c) =>
                  (c.chartOptions.isSavedData ||
                    (c.chartOptions.dataMapping &&
                      c.chartOptions.dataMapping.length)) &&
                  !c.chartOptions.disable
              );
            }
            let isSummary = false,
              len = t.chartSetting.length;
            for (let i = 0; i < len; i++) {
              if (
                t.chartSetting[i].chartOptions.generateSummary &&
                !t.chartSetting[i].chartOptions.disable
              ) {
                isSummary = true;
                break;
              }
            }
            if (isMapping) {
              if (c.showGroups) {
                let group = t.group.split("-")[1];
                let isFound = innerObj.subTabs.findIndex((s) => s.id === group);
                if (isFound >= 0) {
                  innerObj.subTabs[isFound].subTabs.push({
                    id: t.id,
                    tabName: t.tabName[this.$i18n.locale],
                    group: t.group,
                    isSummary,
                  });
                } else {
                  let gName = this.$i18n.t("default");
                  if (group === "CT") {
                    gName = this.$i18n.t("compTime");
                  }
                  if (group === "IC") {
                    gName = this.$i18n.t("Internal_Consistency");
                  }
                  if (group === "CC") {
                    gName = this.$i18n.t("icc");
                  }
                  if (group === "EC") {
                    gName = this.$i18n.t("eConsistency");
                  }
                  if (group === "FAC") {
                    gName = this.$i18n.t("byFacility");
                  }
                  if (group === "BENCH") {
                    gName = this.$i18n.t("eConsistency");
                  }

                  innerObj.subTabs.push({
                    id: group,
                    tabName: gName,
                    subTabs: [
                      {
                        id: t.id,
                        tabName: t.tabName[this.$i18n.locale],
                        group: t.group,
                        isSummary,
                      },
                    ],
                  });
                }
              } else {
                let obj = {
                  id: t.id,
                  tabName: t.tabName[this.$i18n.locale],
                  group: t.group,
                };
                if (this.$route.name === "AnalyticalDashboard") {
                  let isFlag = t.chartSetting.find(
                    (c) =>
                      c.chartOptions.generateSummary &&
                      c.chartOptions.generateFlag
                  );
                  obj["showFlag"] = isFlag ? true : false;
                  obj["flagDetails"] = this.flagData[t.id]
                    ? this.flagData[t.id]
                    : {
                        value: null,
                        messages: [],
                      };
                }
                innerObj.subTabs.push(obj);
              }
            }
          });
          if (innerObj.subTabs.length) {
            menu.push(innerObj);
          }
        });
      }
      this.$emit("getMenu", menu);
      return menu;
    },
  },
  watch: {
    configDataFP: {
      handler(newValue) {
        if (newValue.module === "dqr") {
          let emuMonthly = newValue.data.emu_monthly;
          if (emuMonthly) {
            this.isMonthlyTab = true;
            this.monthlyClient = !emuMonthly.Commodities_Client.disableChart;
            this.monthlyFacilities =
              !emuMonthly.Commodities_Facilities.disableChart;
            this.monthlyVisits = !emuMonthly.Visits.disableChart;
            this.monthlyUsers = !emuMonthly.User.disableChart;
          }

          let emuAnnual = newValue.data.emu;
          if (emuAnnual) {
            this.isAnnualTab = true;
            this.annualClient =
              emuAnnual.Commodities_Client.dataOnContraceptive == "Yes";
            this.annualFacilities =
              emuAnnual.Commodities_Facilities.dataOnContraceptive == "Yes";
            this.annualVisits = emuAnnual.Visits.dataOnContraceptive == "Yes";
            this.annualUsers = emuAnnual.User.dataOnContraceptive == "Yes";
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    updateActiveTab(tab) {
      if (
        tab === "view-module" ||
        tab === "view-report" ||
        tab === "generate-new-report"
      ) {
        this.$store.commit("setActiveTab", "");
      }
      this.$nextTick(() => {
        this.$store.commit("setActiveTab", tab);
      });
    },
  },
};
</script>
