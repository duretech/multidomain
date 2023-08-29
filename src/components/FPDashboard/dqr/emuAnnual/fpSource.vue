<template>
  <div
    class="modal-dialog modal-dialog-scrollable modal-xl fpsource-modal"
    role="document"
  >
    <div class="modal-content">
      <div
        class="modal-header"
        style="
          background-color: rgb(33, 33, 33);
          color: rgb(255, 255, 255);
          padding: 12px;
        "
      >
        <h5
          class="modal-title"
          id="exampleModalScrollableTitle"
          style="font-size: 1rem"
        >
          {{ $t("fpSource") }}
        </h5>
        <button
          type="button"
          class="close"
          data-dismiss="modal"
          aria-label="Close"
        >
          <span aria-hidden="true" class="color-white">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="row mb-2">
          <div class="col-12">
            <download-csv :data="fpItems">
              <a
                class="btn black-btn pointer-events-none color-white float-right blue-btn"
              >
                <span class="">
                  <img
                    :src="require('@/assets/images/icons/generateReport.svg')"
                    class="img-fluid mt-xl-n1"
                  />
                </span>
                <span class="mx-1"> {{ $t("exportbtn") }} </span></a
              >
            </download-csv>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <h5>{{ $t("fpSourceTitile1") }}</h5>
            <p class="font-italic" style="font-size: 0.8em">
              {{ $t("fpSourceSubTitile1") }}
            </p>
            <p style="font-size: 0.8em">{{ $t("fpSourceSubTitile2") }}</p>
            <b-table
              stripped
              bordered
              hover
              class="tableCss"
              :items="seqFpItems"
              :fields="fields"
              responsive="sm"
              show-empty
              :empty-text="$t('no_data_to_display')"
            >
              <template #cell(method)="row">
                <div style="position: relative">
                  <b
                    v-if="row.item.children"
                    size="sm"
                    @click="row.toggleDetails"
                    class="mr-2 dropClass"
                    style=""
                    >{{ row.value }}</b
                  >

                  <b v-else>{{ row.value }}</b>
                </div>
              </template>
              <template #row-details="row">
                <b-card>
                  <b-table
                    stripped
                    bordered
                    hover
                    class="tableCss"
                    :items="row.item.children"
                    :fields="subTablefields"
                    responsive="sm"
                    show-empty
                    :empty-text="$t('no_data_to_display')"
                  />
                  <!-- <b-button size="sm" @click="row.toggleDetails">Hide Details</b-button> -->
                </b-card>
              </template>
            </b-table>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-12">
            <h5>{{ $t("fpSourceSubTitile3") }}</h5>
            <p
              v-if="this.defaultLevel != this.selectedLevel.split('/')[0]"
              class="font-italic"
              style="font-size: 0.8em"
            >
              Based on above data, review the table below and select from the
              dropdown to indicate which sectors are included in the service
              statistics data you have on hand.
            </p>
            <p v-else class="font-italic" style="font-size: 0.8em">
              Based on above data, review the table below and select from the
              dropdown in the Admin module to indicate which sectors are
              included in the service statistics data you have on hand.
            </p>
          </div>
        </div>
        <div
          class="sectionReportDiv mb-3"
          v-if="this.defaultLevel != this.selectedLevel.split('/')[0]"
        >
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-header">{{ $t("sectorReporting") }}</div>
                <div class="card-body">
                  <div class="col-12 px-0">
                    <ul class="nav nav-tabs" id="myTab" role="tablist">
                      <li class="nav-item">
                        <a
                          class="nav-link active"
                          id="visit-tab"
                          data-toggle="tab"
                          href="#visit"
                          role="tab"
                          aria-controls="visit"
                          aria-selected="true"
                          v-if="FPSource['Visits']"
                          >{{ this.$i18n.t("visits") }}</a
                        >
                      </li>
                      <li class="nav-item">
                        <a
                          class="nav-link"
                          id="cc-tab"
                          data-toggle="tab"
                          href="#cc"
                          role="tab"
                          aria-controls="cc"
                          aria-selected="false"
                          v-if="FPSource['Commodities_Client']"
                          >{{ this.$i18n.t("Commodities_Client") }}</a
                        >
                      </li>
                      <li class="nav-item">
                        <a
                          class="nav-link"
                          id="cf-tab"
                          data-toggle="tab"
                          href="#cf"
                          role="tab"
                          aria-controls="cf"
                          aria-selected="false"
                          v-if="FPSource['Commodities_Facilities']"
                          >{{ this.$i18n.t("Commodities_Facilities") }}</a
                        >
                      </li>
                      <li class="nav-item">
                        <a
                          class="nav-link"
                          id="user-tab"
                          data-toggle="tab"
                          href="#user"
                          role="tab"
                          aria-controls="user"
                          aria-selected="false"
                          v-if="FPSource['User']"
                          >{{ this.$i18n.t("users") }}</a
                        >
                      </li>
                    </ul>
                    <div class="tab-content py-2 px-3" id="myTabContent">
                      <div
                        id="visit"
                        role="tabpanel"
                        aria-labelledby="visit-tab"
                        :class="
                          defaultEMU == 'Visits'
                            ? 'tab-pane fade show active'
                            : 'tab-pane fade hide'
                        "
                        v-if="FPSource['Visits']"
                      >
                        <div class="insideWrapSec">
                          <div class="row px-3">
                            <div class="col-4 alert alert-secondary">
                              <p class="topSRDiv">
                                {{ this.$i18n.t("public_sector") }}
                              </p>
                            </div>
                            <div class="col-4 alert alert-secondary">
                              <p class="topSRDiv">
                                {{ this.$i18n.t("public_medical_sector") }}
                              </p>
                            </div>
                            <div class="col-4 alert alert-secondary">
                              <p class="topSRDiv">
                                {{ this.$i18n.t("other_source") }}
                              </p>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-4">
                              <div class="form-group">
                                <label for
                                  >{{ this.$i18n.t("gov_health_facilities") }}
                                </label>
                                <div class="select-wrapper">
                                  <select
                                    class="form-control"
                                    v-model="
                                      FPSource['Visits']['governmentHealth']
                                    "
                                    :disabled="!$store.getters.getIsAdmin"
                                  >
                                    <!-- :disabled="isAdmin" -->

                                    <option value="Yes">
                                      {{ this.$i18n.t("yes") }}
                                    </option>
                                    <option value="No">
                                      {{ this.$i18n.t("no") }}
                                    </option>
                                    <option value="Partially">
                                      {{ this.$i18n.t("partially") }}
                                    </option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div class="col-4">
                              <div class="form-group">
                                <label for>{{ this.$i18n.t("ngo") }}</label>
                                <div class="select-wrapper">
                                  <select
                                    class="form-control"
                                    v-model="FPSource['Visits']['ngo']"
                                    :disabled="!$store.getters.getIsAdmin"
                                  >
                                    <option value="Yes">
                                      {{ this.$i18n.t("yes") }}
                                    </option>
                                    <option value="No">
                                      {{ this.$i18n.t("no") }}
                                    </option>
                                    <option value="Partially">
                                      {{ this.$i18n.t("partially") }}
                                    </option>
                                  </select>
                                </div>
                              </div>
                              <div class="form-group">
                                <label for>{{
                                  this.$i18n.t(
                                    "private_hospital_clinic_delivery"
                                  )
                                }}</label>
                                <div class="select-wrapper">
                                  <select
                                    class="form-control"
                                    v-model="
                                      FPSource['Visits']['privateHospital']
                                    "
                                    :disabled="!$store.getters.getIsAdmin"
                                  >
                                    <option value="Yes">
                                      {{ this.$i18n.t("yes") }}
                                    </option>
                                    <option value="No">
                                      {{ this.$i18n.t("no") }}
                                    </option>
                                    <option value="Partially">
                                      {{ this.$i18n.t("partially") }}
                                    </option>
                                  </select>
                                </div>
                              </div>
                              <div class="form-group">
                                <label for>{{
                                  this.$i18n.t("pharmacy")
                                }}</label>
                                <div class="select-wrapper">
                                  <select
                                    class="form-control"
                                    v-model="FPSource['Visits']['pharmacy']"
                                    :disabled="!$store.getters.getIsAdmin"
                                  >
                                    <option value="Yes">
                                      {{ this.$i18n.t("yes") }}
                                    </option>
                                    <option value="No">
                                      {{ this.$i18n.t("no") }}
                                    </option>
                                    <option value="Partially">
                                      {{ this.$i18n.t("partially") }}
                                    </option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div class="col-4">
                              <div class="form-group">
                                <label for>{{
                                  this.$i18n.t("shop_church_friend")
                                }}</label>
                                <div class="select-wrapper">
                                  <select
                                    class="form-control"
                                    v-model="
                                      FPSource['Visits']['shopChurchFriend']
                                    "
                                    :disabled="!$store.getters.getIsAdmin"
                                  >
                                    <option value="Yes">
                                      {{ this.$i18n.t("yes") }}
                                    </option>
                                    <option value="No">
                                      {{ this.$i18n.t("no") }}
                                    </option>
                                    <option value="Partially">
                                      {{ this.$i18n.t("partially") }}
                                    </option>
                                  </select>
                                </div>
                              </div>
                              <div class="form-group">
                                <label for>{{ this.$i18n.t("other") }}</label>
                                <div class="select-wrapper">
                                  <select
                                    class="form-control"
                                    v-model="FPSource['Visits']['otherSector']"
                                    :disabled="!$store.getters.getIsAdmin"
                                  >
                                    <option value="Yes">
                                      {{ this.$i18n.t("yes") }}
                                    </option>
                                    <option value="No">
                                      {{ this.$i18n.t("no") }}
                                    </option>
                                    <option value="Partially">
                                      {{ this.$i18n.t("partially") }}
                                    </option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        class="tab-pane fade"
                        id="cc"
                        role="tabpanel"
                        :class="
                          defaultEMU == 'Commodities_Client'
                            ? 'show active'
                            : 'hide'
                        "
                        aria-labelledby="cc-tab"
                        v-if="FPSource['Commodities_Client']"
                      >
                        <div class="insideWrapSec">
                          <div class="row px-3">
                            <div class="col-4 alert alert-secondary">
                              <p class="topSRDiv">
                                {{ this.$i18n.t("public_sector") }}
                              </p>
                            </div>
                            <div class="col-4 alert alert-secondary">
                              <p class="topSRDiv">
                                {{ this.$i18n.t("public_medical_sector") }}
                              </p>
                            </div>
                            <div class="col-4 alert alert-secondary">
                              <p class="topSRDiv">
                                {{ this.$i18n.t("other_source") }}
                              </p>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-4">
                              <div class="form-group">
                                <label for>{{
                                  this.$i18n.t("gov_health_facilities")
                                }}</label>
                                <div class="select-wrapper">
                                  <select
                                    class="form-control"
                                    v-model="
                                      FPSource['Commodities_Client'][
                                        'governmentHealth'
                                      ]
                                    "
                                    :disabled="!$store.getters.getIsAdmin"
                                  >
                                    <option value="Yes">
                                      {{ this.$i18n.t("yes") }}
                                    </option>
                                    <option value="No">
                                      {{ this.$i18n.t("no") }}
                                    </option>
                                    <option value="Partially">
                                      {{ this.$i18n.t("partially") }}
                                    </option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div class="col-4">
                              <div class="form-group">
                                <label for>{{ this.$i18n.t("ngo") }}</label>
                                <div class="select-wrapper">
                                  <select
                                    class="form-control"
                                    v-model="
                                      FPSource['Commodities_Client']['ngo']
                                    "
                                    :disabled="!$store.getters.getIsAdmin"
                                  >
                                    <option value="Yes">
                                      {{ this.$i18n.t("yes") }}
                                    </option>
                                    <option value="No">
                                      {{ this.$i18n.t("no") }}
                                    </option>
                                    <option value="Partially">
                                      {{ this.$i18n.t("partially") }}
                                    </option>
                                  </select>
                                </div>
                              </div>
                              <div class="form-group">
                                <label for>{{
                                  this.$i18n.t(
                                    "private_hospital_clinic_delivery"
                                  )
                                }}</label>
                                <div class="select-wrapper">
                                  <select
                                    class="form-control"
                                    v-model="
                                      FPSource['Commodities_Client'][
                                        'privateHospital'
                                      ]
                                    "
                                    :disabled="!$store.getters.getIsAdmin"
                                  >
                                    <option value="Yes">
                                      {{ this.$i18n.t("yes") }}
                                    </option>
                                    <option value="No">
                                      {{ this.$i18n.t("no") }}
                                    </option>
                                    <option value="Partially">
                                      {{ this.$i18n.t("partially") }}
                                    </option>
                                  </select>
                                </div>
                              </div>
                              <div class="form-group">
                                <label for>{{
                                  this.$i18n.t("pharmacy")
                                }}</label>
                                <div class="select-wrapper">
                                  <select
                                    class="form-control"
                                    v-model="
                                      FPSource['Commodities_Client']['pharmacy']
                                    "
                                    :disabled="!$store.getters.getIsAdmin"
                                  >
                                    <option value="Yes">
                                      {{ this.$i18n.t("yes") }}
                                    </option>
                                    <option value="No">
                                      {{ this.$i18n.t("no") }}
                                    </option>
                                    <option value="Partially">
                                      {{ this.$i18n.t("partially") }}
                                    </option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div class="col-4">
                              <div class="form-group">
                                <label for>{{
                                  this.$i18n.t("shop_church_friend")
                                }}</label>
                                <div class="select-wrapper">
                                  <select
                                    class="form-control"
                                    v-model="
                                      FPSource['Commodities_Client'][
                                        'shopChurchFriend'
                                      ]
                                    "
                                    :disabled="!$store.getters.getIsAdmin"
                                  >
                                    <option value="Yes">
                                      {{ this.$i18n.t("yes") }}
                                    </option>
                                    <option value="No">
                                      {{ this.$i18n.t("no") }}
                                    </option>
                                    <option value="Partially">
                                      {{ this.$i18n.t("partially") }}
                                    </option>
                                  </select>
                                </div>
                              </div>
                              <div class="form-group">
                                <label for>{{ this.$i18n.t("other") }}</label>
                                <div class="select-wrapper">
                                  <select
                                    class="form-control"
                                    v-model="
                                      FPSource['Commodities_Client'][
                                        'otherSector'
                                      ]
                                    "
                                    :disabled="!$store.getters.getIsAdmin"
                                  >
                                    <option value="Yes">
                                      {{ this.$i18n.t("yes") }}
                                    </option>
                                    <option value="No">
                                      {{ this.$i18n.t("no") }}
                                    </option>
                                    <option value="Partially">
                                      {{ this.$i18n.t("partially") }}
                                    </option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        class="tab-pane fade"
                        id="cf"
                        role="tabpanel"
                        aria-labelledby="cf-tab"
                        :class="
                          defaultEMU == 'Commodities_Facilities'
                            ? 'show active'
                            : 'hide'
                        "
                        v-if="FPSource['Commodities_Facilities']"
                      >
                        <div class="insideWrapSec">
                          <div class="row px-3">
                            <div class="col-4 alert alert-secondary">
                              <p class="topSRDiv">
                                {{ this.$i18n.t("public_sector") }}
                              </p>
                            </div>
                            <div class="col-4 alert alert-secondary">
                              <p class="topSRDiv">
                                {{ this.$i18n.t("public_medical_sector") }}
                              </p>
                            </div>
                            <div class="col-4 alert alert-secondary">
                              <p class="topSRDiv">
                                {{ this.$i18n.t("other_source") }}
                              </p>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-4">
                              <div class="form-group">
                                <label for>{{
                                  this.$i18n.t("gov_health_facilities")
                                }}</label>
                                <div class="select-wrapper">
                                  <select
                                    class="form-control"
                                    v-model="
                                      FPSource['Commodities_Facilities'][
                                        'governmentHealth'
                                      ]
                                    "
                                    :disabled="!$store.getters.getIsAdmin"
                                  >
                                    <option value="Yes">
                                      {{ this.$i18n.t("yes") }}
                                    </option>
                                    <option value="No">
                                      {{ this.$i18n.t("no") }}
                                    </option>
                                    <option value="Partially">
                                      {{ this.$i18n.t("partially") }}
                                    </option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div class="col-4">
                              <div class="form-group">
                                <label for>{{ this.$i18n.t("ngo") }}</label>
                                <div class="select-wrapper">
                                  <select
                                    class="form-control"
                                    v-model="
                                      FPSource['Commodities_Facilities']['ngo']
                                    "
                                    :disabled="!$store.getters.getIsAdmin"
                                  >
                                    <option value="Yes">
                                      {{ this.$i18n.t("yes") }}
                                    </option>
                                    <option value="No">
                                      {{ this.$i18n.t("no") }}
                                    </option>
                                    <option value="Partially">
                                      {{ this.$i18n.t("partially") }}
                                    </option>
                                  </select>
                                </div>
                              </div>
                              <div class="form-group">
                                <label for>{{
                                  this.$i18n.t(
                                    "private_hospital_clinic_delivery"
                                  )
                                }}</label>
                                <div class="select-wrapper">
                                  <select
                                    class="form-control"
                                    v-model="
                                      FPSource['Commodities_Facilities'][
                                        'privateHospital'
                                      ]
                                    "
                                    :disabled="!$store.getters.getIsAdmin"
                                  >
                                    <option value="Yes">
                                      {{ this.$i18n.t("yes") }}
                                    </option>
                                    <option value="No">
                                      {{ this.$i18n.t("no") }}
                                    </option>
                                    <option value="Partially">
                                      {{ this.$i18n.t("partially") }}
                                    </option>
                                  </select>
                                </div>
                              </div>
                              <div class="form-group">
                                <label for>{{
                                  this.$i18n.t("pharmacy")
                                }}</label>
                                <div class="select-wrapper">
                                  <select
                                    class="form-control"
                                    v-model="
                                      FPSource['Commodities_Facilities'][
                                        'pharmacy'
                                      ]
                                    "
                                    :disabled="!$store.getters.getIsAdmin"
                                  >
                                    <option value="Yes">
                                      {{ this.$i18n.t("yes") }}
                                    </option>
                                    <option value="No">
                                      {{ this.$i18n.t("no") }}
                                    </option>
                                    <option value="Partially">
                                      {{ this.$i18n.t("partially") }}
                                    </option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div class="col-4">
                              <div class="form-group">
                                <label for>{{
                                  this.$i18n.t("shop_church_friend")
                                }}</label>
                                <div class="select-wrapper">
                                  <select
                                    class="form-control"
                                    v-model="
                                      FPSource['Commodities_Facilities'][
                                        'shopChurchFriend'
                                      ]
                                    "
                                    :disabled="!$store.getters.getIsAdmin"
                                  >
                                    <option value="Yes">
                                      {{ this.$i18n.t("yes") }}
                                    </option>
                                    <option value="No">
                                      {{ this.$i18n.t("no") }}
                                    </option>
                                    <option value="Partially">
                                      {{ this.$i18n.t("partially") }}
                                    </option>
                                  </select>
                                </div>
                              </div>
                              <div class="form-group">
                                <label for>{{ this.$i18n.t("other") }}</label>
                                <div class="select-wrapper">
                                  <select
                                    class="form-control"
                                    v-model="
                                      FPSource['Commodities_Facilities'][
                                        'otherSector'
                                      ]
                                    "
                                    :disabled="!$store.getters.getIsAdmin"
                                  >
                                    <option value="Yes">
                                      {{ this.$i18n.t("yes") }}
                                    </option>
                                    <option value="No">
                                      {{ this.$i18n.t("no") }}
                                    </option>
                                    <option value="Partially">
                                      {{ this.$i18n.t("partially") }}
                                    </option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        class="tab-pane fade"
                        id="user"
                        role="tabpanel"
                        aria-labelledby="user-tab"
                        :class="defaultEMU == 'User' ? 'show active' : 'hide'"
                        v-if="FPSource['User']"
                      >
                        <div class="insideWrapSec">
                          <div class="row px-3">
                            <div class="col-4 alert alert-secondary">
                              <p class="topSRDiv">
                                {{ this.$i18n.t("public_sector") }}
                              </p>
                            </div>
                            <div class="col-4 alert alert-secondary">
                              <p class="topSRDiv">
                                {{ this.$i18n.t("public_medical_sector") }}
                              </p>
                            </div>
                            <div class="col-4 alert alert-secondary">
                              <p class="topSRDiv">
                                {{ this.$i18n.t("other_source") }}
                              </p>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-4">
                              <div class="form-group">
                                <label for>{{
                                  this.$i18n.t("gov_health_facilities")
                                }}</label>
                                <div class="select-wrapper">
                                  <select
                                    class="form-control"
                                    v-model="
                                      FPSource['User']['governmentHealth']
                                    "
                                    :disabled="!$store.getters.getIsAdmin"
                                  >
                                    <option value="Yes">
                                      {{ this.$i18n.t("yes") }}
                                    </option>
                                    <option value="No">
                                      {{ this.$i18n.t("no") }}
                                    </option>
                                    <option value="Partially">
                                      {{ this.$i18n.t("partially") }}
                                    </option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div class="col-4">
                              <div class="form-group">
                                <label for>{{ this.$i18n.t("ngo") }}</label>
                                <div class="select-wrapper">
                                  <select
                                    class="form-control"
                                    v-model="FPSource['User']['ngo']"
                                    :disabled="!$store.getters.getIsAdmin"
                                  >
                                    <option value="Yes">
                                      {{ this.$i18n.t("yes") }}
                                    </option>
                                    <option value="No">
                                      {{ this.$i18n.t("no") }}
                                    </option>
                                    <option value="Partially">
                                      {{ this.$i18n.t("partially") }}
                                    </option>
                                  </select>
                                </div>
                              </div>
                              <div class="form-group">
                                <label for>{{
                                  this.$i18n.t(
                                    "private_hospital_clinic_delivery"
                                  )
                                }}</label>
                                <div class="select-wrapper">
                                  <select
                                    class="form-control"
                                    v-model="
                                      FPSource['User']['privateHospital']
                                    "
                                    :disabled="!$store.getters.getIsAdmin"
                                  >
                                    <option value="Yes">
                                      {{ this.$i18n.t("yes") }}
                                    </option>
                                    <option value="No">
                                      {{ this.$i18n.t("no") }}
                                    </option>
                                    <option value="Partially">
                                      {{ this.$i18n.t("partially") }}
                                    </option>
                                  </select>
                                </div>
                              </div>
                              <div class="form-group">
                                <label for>{{
                                  this.$i18n.t("pharmacy")
                                }}</label>
                                <div class="select-wrapper">
                                  <select
                                    class="form-control"
                                    v-model="FPSource['User']['pharmacy']"
                                    :disabled="!$store.getters.getIsAdmin"
                                  >
                                    <option value="Yes">
                                      {{ this.$i18n.t("yes") }}
                                    </option>
                                    <option value="No">
                                      {{ this.$i18n.t("no") }}
                                    </option>
                                    <option value="Partially">
                                      {{ this.$i18n.t("partially") }}
                                    </option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div class="col-4">
                              <div class="form-group">
                                <label for>{{
                                  this.$i18n.t("shop_church_friend")
                                }}</label>
                                <div class="select-wrapper">
                                  <select
                                    class="form-control"
                                    v-model="
                                      FPSource['User']['shopChurchFriend']
                                    "
                                    :disabled="!$store.getters.getIsAdmin"
                                  >
                                    <option value="Yes">
                                      {{ this.$i18n.t("yes") }}
                                    </option>
                                    <option value="No">
                                      {{ this.$i18n.t("no") }}
                                    </option>
                                    <option value="Partially">
                                      {{ this.$i18n.t("partially") }}
                                    </option>
                                  </select>
                                </div>
                              </div>
                              <div class="form-group">
                                <label for>{{ this.$i18n.t("other") }}</label>
                                <div class="select-wrapper">
                                  <select
                                    class="form-control"
                                    v-model="FPSource['User']['otherSector']"
                                    :disabled="!$store.getters.getIsAdmin"
                                  >
                                    <option value="Yes">
                                      {{ this.$i18n.t("yes") }}
                                    </option>
                                    <option value="No">
                                      {{ this.$i18n.t("no") }}
                                    </option>
                                    <option value="Partially">
                                      {{ this.$i18n.t("partially") }}
                                    </option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <a
                        @click="updateReporting"
                        style="margin-top: 3%"
                        class="btn black-btn pointer-events-none color-white float-right blue-btn"
                        >{{ $t("update") }}</a
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-12">
            <b-table
              responsive
              stripped
              bordered
              hover
              class="tableCss"
              :items="reportingItems"
              :fields="reportingFields"
              show-empty
              :empty-text="$t('no_data_to_display')"
            ></b-table>
          </div>
        </div>
        <div class="card my-3">
          <div class="p-10px text-decoration-none">
            <div class="row no-gutters">
              <!-- <div
                class="col-lg-7 col-md-7 p-t-4px card-comp-title"
              >{{$t('fpSourceSubTitile4')}}</div>
              </div>-->
              <div class="col-lg-8 col-md-8 p-t-4px card-comp-title">
                % of Modern Users(by Method) Represented in Your Data - Based on
                DHS and Table Above
              </div>
            </div>
          </div>
          <div class="card-body pb-0">
            <div class="row">
              <div class="col-12" v-if="chartOptions != null">
                <highcharts
                  :options="chartOptions"
                  ref="inputCharts"
                ></highcharts>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-12">
            <h5>{{ $t("fpSourceSubTitile4") }}</h5>
            <p style="font-size: 0.8em">
              {{ $t("fpSourceSubTitile5") }}
            </p>
            <b-table
              stripped
              bordered
              hover
              class="tableCss"
              :items="fpTableItems"
              :fields="fpFields"
              responsive="sm"
              show-empty
              :empty-text="$t('no_data_to_display')"
            >
              <template #cell(method)="row">
                <div style="position: relative">
                  <b
                    v-if="row.item.children"
                    size="sm"
                    @click="row.toggleDetails"
                    class="mr-2 dropClass1"
                    style=""
                    >{{ row.value }}</b
                  >

                  <b v-else>{{ row.value }}</b>
                </div>
              </template>
              <template #row-details="row">
                <b-card>
                  <b-table
                    stripped
                    bordered
                    hover
                    class="tableCss"
                    :items="row.item.children"
                    :fields="fpsubtableFields"
                    responsive="sm"
                    show-empty
                    :empty-text="$t('no_data_to_display')"
                  />
                  <!-- <b-button size="sm" @click="row.toggleDetails">Hide Details</b-button> -->
                </b-card>
              </template>
            </b-table>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <p class="textbottom mb-2" style="font-size: 0.75rem">
              <i
                class="fa fa-2x fa-square-o mr-2 px-2"
                style="background-color: #abdde5; color: #abdde5"
              />{{ $t("fpSourceStrip1", { factor: 2 }) }}
            </p>
            <p class="textbottom" style="font-size: 0.75rem">
              <i
                class="fa fa-2x fa-square-o mr-2 px-2"
                style="background-color: #ffe8a1; color: #ffe8a1"
              />{{ $t("fpSourceStrip1", { factor: 10 }) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/service";
import { decompress } from "compress-json";
export default {
  data() {
    return {
      excludeAF: null,
      sectors: {
        "Public Only": "public_only",
        "Public and Some Private": "psp",
        "All Public and Private": "app",
      },
      // isAdmin: true,
      fpItems: [],
      fields: [],
      subTablefields: [],
      chartOptions: null,
      columns: {},
      // fpFields: [this.$i18n.t('method')],
      fpFields: [
        {
          key: "Method",
          label: this.$i18n.t("method"),
        },
      ],
      fpsubtableFields: [
        {
          key: "Method",
          label: this.$i18n.t("method"),
        },
        {
          key: "Submethod",
          label: this.$i18n.t("submethod"),
        },
      ],
      fpTableItems: [],
      // defaultLevel: this.appResponse.defaultLevelID,
      methodSeq: [],
      seqFpItems: [],
      reportingFields: [],
      reportingItems: [],
      defaultEMU: null,
      FPSource: {
        Commodities_Client: {
          governmentHealth: "Yes",
          ngo: "Yes",
          otherSector: "Yes",
          pharmacy: "Yes",
          privateHospital: "Yes",
          shopChurchFriend: "Yes",
        },
        Commodities_Facilities: {
          governmentHealth: "Yes",
          ngo: "Yes",
          otherSector: "Yes",
          pharmacy: "Yes",
          privateHospital: "Yes",
          shopChurchFriend: "Yes",
        },
        User: {
          governmentHealth: "Yes",
          ngo: "Yes",
          otherSector: "Yes",
          pharmacy: "Yes",
          privateHospital: "Yes",
          shopChurchFriend: "Yes",
        },
        Visits: {
          governmentHealth: "Yes",
          ngo: "Yes",
          otherSector: "Yes",
          pharmacy: "Yes",
          privateHospital: "Yes",
          shopChurchFriend: "Yes",
        },
      },
    };
  },
  props: [
    "selectedLevel",
    "dqrResponse",
    "appResponse",
    "userDetails",
    "defaultLevel",
  ],
  components: {},
  watch: {
    selectedLevel(newVal) {
      this.fpItems = [];
      this.fields = [];
      this.subTablefields = [];
      this.columns = {};
      this.fpTableItems = [];
      this.methodSeq = [];
      this.seqFpItems = [];
      this.reportingFields = [];
      this.reportingItems = [];
      this.$nextTick(() => {
        this.getUserAccess();
        this.getFPSourceData();
      });
    },
  },
  methods: {
    getUserAccess() {
      let key = this.generateKey("annualSectorReporting");
      let allKeys = service.getAllKeys({});
      allKeys
        .then((keys) => {
          service
            .getSavedConfig({ tableKey: key })
            .then((appRes) => {
              let FPSource = {
                Commodities_Client: {
                  governmentHealth: "Yes",
                  ngo: "Yes",
                  otherSector: "Yes",
                  pharmacy: "Yes",
                  privateHospital: "Yes",
                  shopChurchFriend: "Yes",
                },
                Commodities_Facilities: {
                  governmentHealth: "Yes",
                  ngo: "Yes",
                  otherSector: "Yes",
                  pharmacy: "Yes",
                  privateHospital: "Yes",
                  shopChurchFriend: "Yes",
                },
                User: {
                  governmentHealth: "Yes",
                  ngo: "Yes",
                  otherSector: "Yes",
                  pharmacy: "Yes",
                  privateHospital: "Yes",
                  shopChurchFriend: "Yes",
                },
                Visits: {
                  governmentHealth: "Yes",
                  ngo: "Yes",
                  otherSector: "Yes",
                  pharmacy: "Yes",
                  privateHospital: "Yes",
                  shopChurchFriend: "Yes",
                },
              };
              this.FPSource = appRes.data.sectorReporting[
                this.selectedLevel.split("/")[1]
              ]
                ? appRes.data.sectorReporting[this.selectedLevel.split("/")[1]]
                : FPSource;
              this.drawChart(this.fpItems);
            })
            .catch((res) => {
              // this.bShowLoader = false;
              console.log(res);
            });
        })
        .catch((res) => {
          // this.bShowLoader = false;
          console.log(res);
        });
    },
    updateReporting() {
      this.drawChart(this.fpItems);
      this.sweetAlert({
        title: this.$i18n.t("data_saved_successfully"),
      });
    },
    async getFPSourceData() {
      let periodData = this.$store.getters.getGlobalFactors().period.Period;
      let d = new Date();
      if (this.$store.getters.getAppSettings.calendar === "nepali") {
        d = new NepaliDate(
          new Date(d.getFullYear(), d.getMonth() + 1, d.getDate())
        ).getBS();
        let nplMonth = d.month;
        let nplYear = d.year;
        let zeroForMonth = nplMonth < 10 ? "0" + nplMonth : nplMonth;
        d = d.year + "" + zeroForMonth;
      }
      let lastYear = "";
      let recentYearMonth = this.$moment(d, "YYYYMM")
        .subtract(periodData.backtrackedMonth * 1, "months")
        .format("YYYY-MM");
      if (recentYearMonth.split("-")[1] == 12)
        lastYear = recentYearMonth.split("-")[0];
      else lastYear = recentYearMonth.split("-")[0] * 1 - 1;

      let startYear = this.$moment(recentYearMonth, "YYYY-MM")
        .subtract(periodData.backtrackedYearLimit * 1, "years")
        .format("YYYY");
      this.excludeAF = this.dqrResponse.emu["Background_Data"][
        "adjustmentFactor"
      ]
        ? this.dqrResponse.emu["Background_Data"]["adjustmentFactor"]
        : "No";
      let locationID = this.selectedLevel.split("/")[1];
      this.categoryData = this.dqrResponse.emu;
      let fromDataStore =
        this.dqrResponse.emu["Background_Data"]["bgDataSource"];
      //  fromDataStore=  false;
      let years = [];
      for (let year = startYear; year <= lastYear; year++) {
        years.push(Number(year));
      }
      this.fields = [
        //"method",
        //"submethod",
        {
          key: "method",
          label: this.$i18n.t("method"),
        },
        {
          key: "Sector",
          label: this.$i18n.t("gov_health_facilities"),
        },
        { key: "NGO", label: this.$i18n.t("ngo") },
        {
          key: "Hospital",
          label: this.$i18n.t("private_hospital_clinic_delivery"),
        },
        { key: "Pharmacy", label: this.$i18n.t("pharmacy") },
        { key: "Shop", label: this.$i18n.t("shop_church_friend") },
        { key: "Other", label: this.$i18n.t("other") },
      ];
      this.subTablefields = [
        {
          key: "method",
          label: this.$i18n.t("method"),
        },
        {
          key: "submethod",
          label: this.$i18n.t("submethod"),
        },
        {
          key: "Sector",
          label: this.$i18n.t("gov_health_facilities"),
        },
        { key: "NGO", label: this.$i18n.t("ngo") },
        {
          key: "Hospital",
          label: this.$i18n.t("private_hospital_clinic_delivery"),
        },
        { key: "Pharmacy", label: this.$i18n.t("pharmacy") },
        { key: "Shop", label: this.$i18n.t("shop_church_friend") },
        { key: "Other", label: this.$i18n.t("other") },
      ];
      let fpData = this.categoryData.Background_Data.fpSourceIndicators;
      this.defaultEMU = this.categoryData.Background_Data.defaultEMU
        ? this.categoryData.Background_Data.defaultEMU
        : "Commodities_Client";
      let count = 0,
        nCount = 0,
        existMethod = [];
      let response = null;
      if (fromDataStore == "Datastore") {
        let levelid = this.selectedLevel.split("/")[0];
        let key = `psa_${levelid}`;
        if (!this.$store.getters.getAppSettings.country) {
          let appId = this.$store.getters.getAppId
              ? this.$store.getters.getAppId
              : "",
            appUserId = this.$store.getters.getAppUserId
              ? this.$store.getters.getAppUserId
              : "";
          if (appId && appUserId) {
            key = `psa_${levelid}`;
          } else {
            this.showLocalStorageError();
            return;
          }
        }
        await service.getSavedConfig({ tableKey: key }).then((fpRes) => {
          //response = fpResponse
          let fpResponse =
            fpRes && typeof fpRes.data.rows == "string"
              ? {
                  ...fpRes.data,
                  rows: decompress(JSON.parse(fpRes.data.rows)),
                }
              : fpRes.data;
          response = fpResponse.rows.filter((arr) => arr[2] === locationID);
        });
        fpData.forEach((res) => {
          res.subIndicators.forEach((r) => {
            let static_name = res.static_name ? res.static_name : res.key;
            // if(static_name == 'Sterilization' || static_name == 'Condom'){
            //   this.methodSeq.push(r.name)
            // }else
            if (!existMethod.includes(static_name)) {
              existMethod.push(static_name);
              this.methodSeq.push(static_name);
            }

            //count++;
            let indId = [];
            let oData = [];
            oData["method"] = res.name;
            if (r.static_name == "Tubal Ligation (F)") {
              oData["method"] = res.name + " (F)";
            }
            if (r.static_name == "Vasectomy (M)") {
              oData["method"] = res.name + " (M)";
            }
            if (r.static_name == "Male Condom") {
              oData["method"] = res.name + " (M)";
            }
            if (r.static_name == "Female Condom") {
              oData["method"] = res.name + " (F)";
            }
            oData["submethod"] = r.name + "/" + r.static_name;
            if (r.static_name == "Male Condom") {
              oData["adjusted"] = r.adjusted ? r.adjusted : false;
            }
            r.selectedDatastoreDE.forEach((de) => {
              indId.push(de.id);

              let val = response.find((obj) => {
                if (obj[0] == de.id) return obj;
              });
              var n = de.id.split(" ");
              if (val) {
                oData[n[n.length - 1]] = val[3] * 1;
              } else {
                oData[n[n.length - 1]] = null;
              }
            });
            this.fpItems.push(oData);
          });
        });
        this.drawChart(this.fpItems);
      } else {
        fpData.forEach((res) => {
          res.subIndicators.forEach((r) => {
            let static_name = res.static_name ? res.static_name : res.key;
            // if(static_name == 'Sterilization' || static_name == 'Condom'){
            //   this.methodSeq.push(static_name)
            // }else
            if (!existMethod.includes(static_name)) {
              existMethod.push(static_name);
              this.methodSeq.push(static_name);
            }

            count++;
            let indId = [];
            r.selectedDE.forEach((de) => {
              indId.push(de.id);
            });
            if (indId.length > 0) {
              nCount++;
              service
                .getAnalyticalIndicatorData(
                  indId.join(";"),
                  locationID,
                  years.join(";")
                )
                .then((response) => {
                  let data = response.data;
                  let oData = {},
                    aRows = data.rows,
                    i,
                    nLen = aRows.length,
                    aDimensions = data.metaData.dimensions.dx,
                    nDimenLen = aDimensions.length,
                    oDataElements = {};
                  for (i = 0; i < nLen; i++) {
                    let sYear = aRows[i][1],
                      sDx = aRows[i][0],
                      nVal = aRows[i][3],
                      j;
                    oDataElements[sDx] = data.metaData.items[sDx];
                    if (!oData[sYear]) {
                      oData[sYear] = {};
                    }
                    for (j = 0; j < nDimenLen; j++) {
                      let sTemp = aDimensions[j];
                      if (oData[sYear][sTemp] === undefined) {
                        oData[sYear][sTemp] = 0;
                        oDataElements[sTemp] = data.metaData.items[sTemp];
                      }
                    }
                    oData[sYear][sDx] = nVal * 1;
                  }

                  if (Object.keys(oData).length > 0) {
                    let obj = {};
                    Object.keys(oData).forEach((resp) => {
                      obj["method"] = res.name;
                      if (r.static_name == "Tubal Ligation (F)") {
                        obj["method"] = res.name + " (F)";
                      }
                      if (r.static_name == "Vasectomy (M)") {
                        obj["method"] = res.name + " (M)";
                      }
                      if (r.static_name == "Male Condom") {
                        obj["method"] = res.name + " (M)";
                      }
                      if (r.static_name == "Female Condom") {
                        obj["method"] = res.name + " (F)";
                      }
                      obj["submethod"] = r.name + "/" + r.static_name;
                      if (
                        r.static_name == "Male Condom" ||
                        r.static_name == "Female Condom"
                      ) {
                        obj["adjusted"] = r.adjusted;
                      }
                      Object.keys(oData[resp]).forEach((data) => {
                        var n = oDataElements[data].name.split(" ");
                        obj[n[n.length - 1]] = oData[resp][data];
                      });
                    });

                    this.fpItems.push(obj);
                  } else {
                    let obj = {};

                    if (
                      r.static_name == "Male Condom" ||
                      r.static_name == "Female Condom"
                    ) {
                      obj["adjusted"] = r.adjusted;
                    }
                    obj["method"] = res.name;

                    if (r.static_name == "Tubal Ligation (F)") {
                      obj["method"] = res.name + " (F)";
                    }
                    if (r.static_name == "Vasectomy (M)") {
                      obj["method"] = res.name + " (M)";
                    }
                    if (r.static_name == "Male Condom") {
                      obj["method"] = res.name + " (M)";
                    }
                    if (r.static_name == "Female Condom") {
                      obj["method"] = res.name + " (F)";
                    }

                    obj["submethod"] = r.name + "/" + r.static_name;
                    obj["Hospital"] = null;
                    obj["NGO"] = null;
                    obj["Other"] = null;
                    obj["Pharmacy"] = null;
                    obj["Sector"] = null;
                    obj["Shop"] = null;
                    this.fpItems.push(obj);
                  }
                  if (this.fpItems.length == nCount) {
                    this.drawChart(this.fpItems);
                  }
                });
            }
          });
        });
      }
    },
    /**
     * This function is to calculated method wise adjustment factor
     * Usage: ` getFpSourceVals(p_modified, p_fpItems)`
     * @param 'p_modified'as sector reproting data, 'p_fpItems' as adjustment data method and submethos wose
     * @return {object} return object of aData as series ,combinedObj as key:value pair
     *
     */
    /**Note:  need to use return object "combinedObj" in other methods  */
    getFpSourceVals(p_modified, p_fpItems, excludeAF) {
      let aData = [];
      let combinedObj = {};
      for (let j = 0; j < p_fpItems.length; j++) {
        let nSum = 0;
        if (excludeAF === "No") {
          for (let k in p_modified) {
            if (p_modified[k] === "Yes") {
              nSum += p_fpItems[j][k];
            } else if (p_modified[k] === "No") {
              nSum += 0;
            } else {
              nSum += p_fpItems[j][k] / 2;
            }
          }
          if (nSum === 0 || nSum >= 100) {
            nSum = 1;
          } else {
            nSum = (1 / nSum) * 100;
          }
          if (
            p_fpItems[j]["submethod"].split("/")[1] == "Male Condom" &&
            p_fpItems[j]["adjusted"] == false
          ) {
            nSum = 1;
          }
        } else {
          nSum = 1;
        }

        aData.push(nSum);
        combinedObj[p_fpItems[j]["submethod"].split("/")[1]] = nSum;
      }
      return { aData, combinedObj };
    },
    drawTable(series, fpItems, combinedObj) {
      let catName = {
        Visits: this.$i18n.t("fp_visits"),
        User: this.$i18n.t("fp_users"),
        Commodities_Client: this.$i18n.t("commodities_Distributed_to_Clients"),
        Commodities_Facilities: this.$i18n.t(
          "commodities_Distributed_to_Facilities"
        ),
      };
      this.seqFpItems = [];
      this.methodSeq.forEach((method) => {
        let methodFound = fpItems.filter((obj) =>
          obj["method"].includes(method)
        );
        if (methodFound.length) {
          let mainObj = methodFound[0];
          if (
            mainObj["method"].includes("Sterilization") ||
            mainObj["method"].includes("Condom")
          ) {
            methodFound.forEach((subObj) => {
              this.seqFpItems.push(subObj);
            });
          } else {
            methodFound.forEach((obj) => {
              if (obj && obj.children) {
                obj.children.forEach((subObj) => {
                  subObj.submethod = subObj.submethod.split("/")[0];
                });
              }
              obj.submethod = obj.submethod.split("/")[0];
            });
            mainObj["children"] = methodFound.map((o, i) => ({ ...o, id: i })); //Note: added id to alter object
            this.seqFpItems.push(mainObj);
          }
        }
      });
      let valObj = {};
      series.forEach((val) => {
        if (this.fpFields.indexOf(val.name) == -1) {
          this.fpFields.push(val.name);
          this.fpsubtableFields.push(val.name);
        }

        valObj[val.name] = [];
        val.data.forEach((v) => {
          valObj[val.name].push(v);
        });
      });
      let fpTableItems = [];
      valObj[Object.keys(valObj)[0]].forEach((v, i) => {
        let tempObj = { _cellVariants: {} };
        if (this.fpItems[i]["submethod"].split("/")[1] == "Male Condom") {
          let variable = fpItems[i]["adjusted"]
            ? this.$i18n.t("adjusted")
            : this.$i18n.t("unadjusted");
          tempObj["Method"] = this.fpItems[i]["method"] + " (" + variable + ")";
        } else {
          tempObj["Method"] = this.fpItems[i]["method"];
        }
        Object.keys(valObj).forEach((tab) => {
          tempObj["Submethod"] = this.fpItems[i]["submethod"].split("/")[0];

          if (
            valObj[tab][i].toFixed(2) * 1 > 2 &&
            valObj[tab][i].toFixed(2) * 1 <= 10
          ) {
            tempObj["_cellVariants"][tab] = "info";
            tempObj[tab] = valObj[tab][i].toFixed(2) * 1;
          } else if (valObj[tab][i].toFixed(2) * 1 > 10) {
            tempObj["_cellVariants"][tab] = "warning";
            tempObj[tab] = valObj[tab][i].toFixed(2) * 1;
          } else {
            tempObj[tab] = valObj[tab][i].toFixed(2) * 1;
          }
        });

        fpTableItems.push(tempObj);
      });

      this.fpTableItems = [];
      this.methodSeq.forEach((method) => {
        let methodFound = fpTableItems.filter((obj) => {
          if (obj["Method"].includes(method)) return obj;
        });
        if (methodFound != undefined && methodFound.length) {
          let mainObj = methodFound[0];
          if (
            mainObj["Method"].includes("Sterilization") ||
            mainObj["Method"].includes("Condom")
          ) {
            methodFound.forEach((subObj) => {
              this.fpTableItems.push(subObj);
            });
          } else {
            mainObj["children"] = methodFound.map((o, i) => ({ ...o, id: i })); //Note: added id to alter object
            this.fpTableItems.push(mainObj);
          }
          //index++;
          //})
        }
      });
    },
    drawChart(fpItems) {
      let categories = [];
      let series = [],
        combinedObj = {},
        objFpNames = {
          governmentHealth: "Sector",
          ngo: "NGO",
          privateHospital: "Hospital",
          pharmacy: "Pharmacy",
          shopChurchFriend: "Shop",
          otherSector: "Other",
        },
        nFPItems = fpItems.length,
        c,
        catName = {
          Visits: this.$i18n.t("fp_visits"),
          User: this.$i18n.t("fp_users"),
          Commodities_Client: this.$i18n.t(
            "commodities_Distributed_to_Clients"
          ),
          Commodities_Facilities: this.$i18n.t(
            "commodities_Distributed_to_Facilities"
          ),
        };
      for (c = 0; c < nFPItems; c++) {
        categories.push(fpItems[c].submethod.split("/")[0]);
      }
      this.reportingFields = [
        { key: "type", label: this.$i18n.t("dataType") },
        { key: "reporting", label: this.$i18n.t("sectorReporting") },
        {
          key: "governmentHealth",
          label: this.$i18n.t("gov_health_facilities"),
        },
        { key: "ngo", label: this.$i18n.t("ngo") },
        {
          key: "privateHospital",
          label: this.$i18n.t("private_hospital_clinic_delivery"),
        },
        { key: "pharmacy", label: this.$i18n.t("pharmacy") },
        { key: "shopChurchFriend", label: this.$i18n.t("shop_church_friend") },
        { key: "otherSector", label: this.$i18n.t("other") },
      ];
      this.reportingItems = [];
      let oSectorReporting = {};
      for (let i in this.categoryData) {
        if (
          i !== "Background_Data" &&
          i !== "Output" &&
          this.categoryData[i]["dataOnContraceptive"] != "No"
        ) {
          let ofpSource = {},
            oTemp = { name: catName[i], data: [], _i: i },
            oModified = {},
            tempObj = {};

          if (i == "Commodities_Client") {
            tempObj["type"] = this.$i18n.t(
              "commodities_Distributed_to_Clients"
            );
          } else if (i == "Commodities_Facilities") {
            tempObj["type"] = this.$i18n.t(
              "commodities_Distributed_to_Facilities"
            );
          } else if (i == "User") {
            tempObj["type"] = this.$i18n.t("fp_users");
          } else if (i == "Visits") {
            tempObj["type"] = this.$i18n.t("fp_visits");
          }

          tempObj["reporting"] = this.$i18n.t(
            "" + this.sectors[this.categoryData[i]["reportingSector"]]
          );
          if (this.defaultLevel == this.selectedLevel.split("/")[0]) {
            ofpSource = JSON.parse(
              JSON.stringify(this.categoryData[i].FPSource)
            );
          } else {
            ofpSource = this.FPSource[i];
          }
          for (let j in ofpSource) {
            if (this.defaultLevel == this.selectedLevel.split("/")[0]) {
              if (j != "reporting" && j != "type") {
                oModified[objFpNames[j]] = ofpSource[j];
              }
              tempObj[j] = this.$i18n.t(ofpSource[j].toLowerCase());
            } else {
              if (j != "reporting" && j != "type") {
                oModified[objFpNames[j]] = ofpSource[j];
              }
              tempObj[j] = this.$i18n.t(ofpSource[j].toLowerCase());
            }
          }
          this.reportingItems.push(tempObj);
          oSectorReporting[i] = tempObj;
          let sData = this.getFpSourceVals(oModified, fpItems, this.excludeAF);
          sData["aData"].forEach((d) => {
            oTemp.data.push(d);
          });
          series.push(oTemp);
          combinedObj[i] = sData["combinedObj"];
        }
      }
      this.saveFinalEMU(oSectorReporting);
      this.drawTable(series, fpItems, combinedObj);
      let configData = {
        adjustments: { data: series, cat: categories },
        combinedObj: combinedObj,
      };
      this.$emit("adjustmentData", configData);
      this.$emit("fpSource", true);
      this.chartOptions = {
        chart: {
          type: "column",
          zoomType: "x",
        },
        title: {
          text: "",
        },
        xAxis: {
          categories: categories,
        },
        tooltip: {
          pointFormat: "{series.name}: <b>{point.y:.2f}</b>",
          shared: true,
          useHTML: true,
        },
        yAxis: {
          min: 0,
          title: {
            text: "",
          },
        },
        legend: {
          reversed: true,
          // backgroundColor: '#FCFFC5',
          // backgroundColor: '#71b5cd33',
          backgroundColor: "transparent",
          // borderColor: '#C98657',
          // borderColor: '#00000080',
          borderColor: "#a7a7a7",
          borderWidth: 1,
          borderRadius: 5,
          // maxHeight: 60,
          // itemDistance: 50,
        },
        plotOptions: {
          series: {
            stacking: "",
          },
        },
        exporting: {
          enabled: false,
        },
        credits: {
          enabled: false,
        },
        series: series,
      };
    },
    saveFinalEMU(oSectorReporting) {
      let dataStore = {};
      let key = this.generateKey("annualSectorReporting");
      //this.bshowLoader = true;
      let allKeys = service.getAllKeys({});
      allKeys.then((keys) => {
        if (keys.data.includes(key)) {
          let oConfig = service.getSavedConfig({ tableKey: key });
          oConfig.then((response) => {
            let oResponse = response.data;
            if (oResponse["sectorReporting"]) {
              if (
                oResponse["sectorReporting"][this.selectedLevel.split("/")[1]]
              ) {
                oResponse["sectorReporting"][this.selectedLevel.split("/")[1]] =
                  oSectorReporting;
              } else {
                oResponse["sectorReporting"] = {
                  ...oResponse["sectorReporting"],
                  [this.selectedLevel.split("/")[1]]: oSectorReporting,
                };
              }
            } else {
              oResponse["sectorReporting"] = {
                [this.selectedLevel.split("/")[1]]: oSectorReporting,
              };
            }
            //.log(oResponse)
            service
              .updateConfig({ data: oResponse, tableKey: key })
              .then(console.log("updated"));
          });
        } else {
          dataStore = {
            sectorReporting: {
              [this.selectedLevel.split("/")[1]]: oSectorReporting,
            },
          };
          service
            .saveConfig({ data: dataStore, tableKey: key })
            .then(console.log("saved"));
        }
      });
    },
  },
  mounted() {},
  created() {
    this.getFPSourceData();
  },
};
</script>
<style scoped lang="scss">
.sectionReportDiv .card-body .nav-link {
  font-size: 0.875rem;
  font-size: 0.875rem;
  color: var(--text-color);
}
// .sectionReportDiv #myTabContent {
// }
.sectionReportDiv .topSRDiv {
  font-size: 0.9375rem;
  margin-bottom: 0;
  color: var(--text-color);
}
.sectionReportDiv .form-group label {
  font-size: 0.875rem;
}
.sectionReportDiv .alert-secondary {
  border: 0;
  border-radius: 0;
  background: var(--signoff-top-card) !important;
}
.sectionReportDiv .form-control {
  font-size: 0.75rem;
}
.dropClass::after {
  cursor: pointer;
  content: "\f107";
  font-family: "FontAwesome";
  position: absolute;
  left: 125px;
  transition: all 0.5s;
}
.dropClass1::after {
  cursor: pointer;
  content: "\f107";
  font-family: "FontAwesome";
  position: absolute;
  left: 160px;
  transition: all 0.5s;
}

.sectionReportDiv .nav-tabs {
  border-bottom: 1px solid var(--border-grey-color) !important;
}

.sectionReportDiv .card-header {
  background-color: transparent !important;
  border-color: transparent !important;
}
</style>
