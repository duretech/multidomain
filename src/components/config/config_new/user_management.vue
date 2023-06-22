<template>
  <div class="admin-active mt-4 pt-3 user-management">
    <b-card no-body>
      <b-tabs card vertical nav-class="p-0" nav-wrapper-class="adminConfig">
        <b-tab :title="$t('groupCreation')" class="pl-2 pb-0 pt-0 pr-2">
          <b-card-text>
            <div class="md_nested_tabs m-3">
              <b-card no-body class="">
                <b-tabs
                  card
                  class=""
                  nav-class="p-0 m-0 mb-3"
                  nav-wrapper-class="adminConfigInner p-0 mb-3 main-border user-management"
                >
                  <b-tab
                    :title="$t('groupCreation')"
                    class="pl-2 pb-0 pt-0 pr-0 border-adminmain b-5"
                    style="margin-top: 2px"
                  >
                    <b-card-text>
                      <div class="card m-t-40px m-b-20px mx-3 pr-2">
                        <!-- <div
                          class="card-header map-header accordion p-5px"
                          id="headingTwo"
                        >
                          <h2 class="mb-0">
                            <button
                              class="btn btn-link w-100 text-left color-white"
                              type="button"
                              data-toggle="collapse"
                              data-target="#collapseTwo"
                              aria-expanded="true"
                              aria-controls="collapseTwo"
                            >
                              {{ $t("groupCreation") }}
                              <span class="float-right">
                              
                              </span>
                            </button>
                          </h2>
                        </div>
                        <div
                          id="collapseTwo"
                          class="collapse show user-module"
                          aria-labelledby="headingTwo"
                        >
                          <div class="card-body">
                            <div class="form-group row mb-0">
                              <div class="col-lg-6">
                                <b-form-input
                                  v-model="searchGroup"
                                  :placeholder="$t('search')"
                                  class="search-control"
                                ></b-form-input>
                              </div>
                              <div class="col-sm-6 text-right mb-3">
                                <b-button
                                  variant="dark"
                                  class="bluetheme-btn"
                                  v-if="!addGroupSection"
                                  @click="addGroupSection = true"
                                >
                                  <img
                                    class="w-14 mt-xl-n2"
                                    src="@/assets/images/icons/plusicon.png"
                                  />
                                  <span class="px-1">
                                    {{ $t("addNewGroup") }}
                                  </span>
                                </b-button>
                              </div>
                            </div>
                            <template v-if="addGroupSection">
                              <div
                                class="col-lg-12 m-b-20px pl-0 pr-0 border-blue mt-4"
                              >
                                <div class="card d-none">
                                  <div
                                    class="card-header border-radius-0 f-s-0-875rem"
                                  >
                                    {{ $t("createNewGroup") }}
                                  </div>
                                </div>
                              </div>
                              <div class="row mb-4">
                                <div class="col-lg-6">
                                  <div class="form-group row">
                                    <label
                                      for="inputDefaultLevelID"
                                      class="col-sm-5 col-form-label"
                                      >{{ $t("group") }}</label
                                    >
                                    <div class="col-sm-7">
                                      <div class="select-wrapper">
                                        <select
                                          class="form-control"
                                          id="createGroupName"
                                          v-model="createdGroup"
                                        >
                                          <option
                                            v-for="(
                                              group, index
                                            ) in groupLabels"
                                            :key="index"
                                          >
                                            {{ group }}
                                          </option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div class="col-lg-6">
                                  <div class="form-group row">
                                    <label
                                      for="inputDefaultLevelID"
                                      class="col-sm-5 col-form-label"
                                      >{{ $t("modules") }}</label
                                    >
                                    <div class="col-sm-7">
                                   
                                      <treeselect
                                        :flat="true"
                                        name="modules"
                                        :multiple="true"
                                        sort-value-by="INDEX"
                                        :options="modulesList"
                                        v-model="selectedModules"
                                        :default-expand-level="1"
                                        :placeholder="$t('select')"
                                        :disable-branch-nodes="true"
                                      >
                                        <div
                                          slot="value-label"
                                          slot-scope="{ node }"
                                        >
                                          <span
                                            :title="getAlias(node.raw.id, true)"
                                            >{{ node.raw.label
                                            }}{{ getAlias(node.raw.id) }}</span
                                          >
                                        </div>
                                      </treeselect>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                class="form-group row mb-0"
                                style="display: contents"
                              >
                                <div class="text-right mt-3 mb-4">
                                  <b-button
                                    @click="
                                      addGroupSection = false;
                                      createdGroup = '';
                                      selectedModules = null;
                                    "
                                    class="black-btn mr-3"
                                  >
                                    {{ $t("cancelbtn") }}
                                  </b-button>
                                  <b-button
                                    variant="dark"
                                    :disabled="
                                      createdGroup === '' ||
                                      selectedModules.length === 0
                                    "
                                    @click="addGroup"
                                    class="blue-btn"
                                  >
                                    {{ $t("savebtn") }}
                                  </b-button>
                                </div>
                              </div>
                            </template>
                            <div
                              class="table-responsive table-striped groupCreationtable"
                            >
                              <table class="table">
                                <thead class="thead-dark">
                                  <tr>
                                    <th
                                      scope="col"
                                      style="width: 10%; text-align: center"
                                    >
                                      {{ $t("group") }}
                                    </th>
                                    <th scope="col" style="width: 80%">
                                      {{ $t("modules") }}
                                    </th>
                                    <th scope="col" style="width: 10%">
                                      {{ $t("action") }}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr
                                    v-for="(group, index) in filteredGroups"
                                    :key="index"
                                  >
                                    <td class="text-center">
                                      {{ group.label }}
                                    </td>
                                    <td>
                                      <span
                                        class="cursor-pointer"
                                        v-for="(modules, ind) in group.modules"
                                        :title="getAlias(modules, true)"
                                        :key="ind"
                                      >
                                        {{ $t(`${modules.split("-")[0]}`)
                                        }}<sub>{{ getAlias(modules) }}</sub>
                                        <template
                                          v-if="
                                            ind !== group.modules.length - 1
                                          "
                                          >&nbsp;+&nbsp;</template
                                        >
                                      </span>
                                    </td>
                                    <td>
                                      <template v-if="group.deletable">
                                        <b-button
                                          size="sm"
                                          variant="dark"
                                          class="d-flex admindelete-icon"
                                          @click="deleteGroup(group.label)"
                                        >
                                         
                                          <img
                                            src="@/assets/images/icons/admindelete-icon.svg"
                                            :style="{ filter: filterColor }"
                                          />

                                          <span class="px-1">
                                            {{ $t("deletebtn") }}
                                          </span>
                                        </b-button>
                                      </template>
                                      <template v-else>
                                        <span
                                          :id="'btn-d' + index"
                                          class="d-inline-block"
                                          :tabindex="index"
                                        >
                                          <b-button
                                            size="sm"
                                            variant="dark"
                                            disabled
                                            style="pointer-events: none"
                                            class="d-flex admindelete-icon"
                                          >
                                          
                                            <img
                                              src="@/assets/images/icons/admindelete-icon.svg"
                                              :style="{ filter: filterColor }"
                                            />
                                            <span class="px-1">
                                              {{ $t("deletebtn") }}
                                            </span>
                                          </b-button>
                                        </span>
                                        <b-tooltip
                                          :target="'btn-d' + index"
                                          :title="
                                            $t('can_t_delete_default_group')
                                          "
                                        ></b-tooltip>
                                      </template>
                                    </td>
                                  </tr>
                                  <tr v-if="filteredGroups.length === 0">
                                    <td colspan="3" class="text-center">
                                      {{ $t("no_data_to_display") }}!
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div> -->
                        <template>
                          <div class="accordion" role="tablist">
                            <b-card no-body class="mb-1">
                              <b-card-header header-tag="header" class="p-1 map-header f-s-0-875rem font-weight-bold" role="tab">
                                <b-button block v-b-toggle.accordion-1 variant="info">  {{ $t("groupCreation") }}</b-button>
                              </b-card-header>
                              <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel" class="border-module">
                                <b-card-body>
                                  <b-card-text>
                                    
                                            <div class="">
                                              <div class="form-group row mb-0">
                                                <div class="col-lg-6">
                                                  <b-form-input
                                                    v-model="searchGroup"
                                                    :placeholder="$t('search')"
                                                    class="search-control"
                                                  ></b-form-input>
                                                </div>
                                                <div class="col-sm-6 text-right mb-3">
                                                  <b-button
                                                    variant="dark"
                                                    class="bluetheme-btn"
                                                    v-if="!addGroupSection"
                                                    @click="addGroupSection = true"
                                                  >
                                                    <img
                                                      class="w-14 mt-xl-n2"
                                                      src="@/assets/images/icons/plusicon.png"
                                                    />
                                                    <span class="px-1">
                                                      {{ $t("addNewGroup") }}
                                                    </span>
                                                  </b-button>
                                                </div>
                                              </div>
                                              <template v-if="addGroupSection">
                                                <div
                                                  class="col-lg-12 m-b-20px pl-0 pr-0 border-blue mt-4"
                                                >
                                                  <div class="card d-none">
                                                    <div
                                                      class="card-header border-radius-0 f-s-0-875rem"
                                                    >
                                                      {{ $t("createNewGroup") }}
                                                    </div>
                                                  </div>
                                                </div>
                                                <div class="row mb-4">
                                                  <div class="col-lg-6">
                                                    <div class="form-group row">
                                                      <label
                                                        for="inputDefaultLevelID"
                                                        class="col-sm-5 col-form-label"
                                                        >{{ $t("group") }}</label
                                                      >
                                                      <div class="col-sm-7">
                                                        <div class="select-wrapper">
                                                          <select
                                                            class="form-control"
                                                            id="createGroupName"
                                                            v-model="createdGroup"
                                                          >
                                                            <option
                                                              v-for="(
                                                                group, index
                                                              ) in groupLabels"
                                                              :key="index"
                                                            >
                                                              {{ group }}
                                                            </option>
                                                          </select>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div class="col-lg-6">
                                                    <div class="form-group row">
                                                      <label
                                                        for="inputDefaultLevelID"
                                                        class="col-sm-5 col-form-label"
                                                        >{{ $t("modules") }}</label
                                                      >
                                                      <div class="col-sm-7">
                                                        <!-- :limit="3" -->
                                                        <treeselect
                                                          :flat="true"
                                                          name="modules"
                                                          :multiple="true"
                                                          sort-value-by="INDEX"
                                                          :options="modulesList"
                                                          v-model="selectedModules"
                                                          :default-expand-level="1"
                                                          :placeholder="$t('select')"
                                                          :disable-branch-nodes="true"
                                                        >
                                                          <div
                                                            slot="value-label"
                                                            slot-scope="{ node }"
                                                          >
                                                            <span
                                                              :title="getAlias(node.raw.id, true)"
                                                              >{{ node.raw.label
                                                              }}{{ getAlias(node.raw.id) }}</span
                                                            >
                                                          </div>
                                                        </treeselect>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div
                                                  class="form-group row mb-0"
                                                  style="display: contents"
                                                >
                                                  <div class="text-right mt-3 mb-4">
                                                    <b-button
                                                      @click="
                                                        addGroupSection = false;
                                                        createdGroup = '';
                                                        selectedModules = null;
                                                      "
                                                      class="black-btn mr-3"
                                                    >
                                                      {{ $t("cancelbtn") }}
                                                    </b-button>
                                                    <b-button
                                                      variant="dark"
                                                      :disabled="
                                                        createdGroup === '' ||
                                                        selectedModules.length === 0
                                                      "
                                                      @click="addGroup"
                                                      class="blue-btn"
                                                    >
                                                      {{ $t("savebtn") }}
                                                    </b-button>
                                                  </div>
                                                </div>
                                              </template>
                                              <div
                                                class="table-responsive table-striped groupCreationtable"
                                              >
                                                <table class="table">
                                                  <thead class="thead-dark">
                                                    <tr>
                                                      <th
                                                        scope="col"
                                                        style="width: 10%; text-align: center"
                                                      >
                                                        {{ $t("group") }}
                                                      </th>
                                                      <th scope="col" style="width: 80%">
                                                        {{ $t("modules") }}
                                                      </th>
                                                      <th scope="col" style="width: 10%">
                                                        {{ $t("action") }}
                                                      </th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    <tr
                                                      v-for="(group, index) in filteredGroups"
                                                      :key="index"
                                                    >
                                                      <td class="text-center">
                                                        {{ group.label }}
                                                      </td>
                                                      <td>
                                                        <span
                                                          class="cursor-pointer"
                                                          v-for="(modules, ind) in group.modules"
                                                          :title="getAlias(modules, true)"
                                                          :key="ind"
                                                        >
                                                          {{ $t(`${modules.split("-")[0]}`)
                                                          }}<sub>{{ getAlias(modules) }}</sub>
                                                          <template
                                                            v-if="
                                                              ind !== group.modules.length - 1
                                                            "
                                                            >&nbsp;+&nbsp;</template
                                                          >
                                                        </span>
                                                      </td>
                                                      <td>
                                                        <template v-if="group.deletable">
                                                          <b-button
                                                            size="sm"
                                                            variant="dark"
                                                            class="d-flex admindelete-icon"
                                                            @click="deleteGroup(group.label)"
                                                          >
                                                            <!-- <i class="fa fa-trash"></i> -->
                                                            <img
                                                              src="@/assets/images/icons/admindelete-icon.svg"
                                                              :style="{ filter: filterColor }"
                                                            />

                                                            <span class="px-1">
                                                              {{ $t("deletebtn") }}
                                                            </span>
                                                          </b-button>
                                                        </template>
                                                        <template v-else>
                                                          <span
                                                            :id="'btn-d' + index"
                                                            class="d-inline-block"
                                                            :tabindex="index"
                                                          >
                                                            <b-button
                                                              size="sm"
                                                              variant="dark"
                                                              disabled
                                                              style="pointer-events: none"
                                                              class="d-flex admindelete-icon"
                                                            >
                                                              <!-- <i class="fa fa-trash"></i> -->
                                                              <img
                                                                src="@/assets/images/icons/admindelete-icon.svg"
                                                                :style="{ filter: filterColor }"
                                                              />
                                                              <span class="px-1">
                                                                {{ $t("deletebtn") }}
                                                              </span>
                                                            </b-button>
                                                          </span>
                                                          <b-tooltip
                                                            :target="'btn-d' + index"
                                                            :title="
                                                              $t('can_t_delete_default_group')
                                                            "
                                                          ></b-tooltip>
                                                        </template>
                                                      </td>
                                                    </tr>
                                                    <tr v-if="filteredGroups.length === 0">
                                                      <td colspan="3" class="text-center">
                                                        {{ $t("no_data_to_display") }}!
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </div>
                                            </div>
                                   
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
              </b-card>
            </div>
          </b-card-text>
        </b-tab>
        <b-tab :title="$t('userMapping')" class="pl-2 pb-0 pt-0 pr-2">
          <b-card-text>
            <div class="md_nested_tabs m-3">
              <b-card no-body>
                <b-tabs
                  card
                  class=""
                  nav-class="p-0 m-0 mb-3"
                  nav-wrapper-class="adminConfigInner p-0 mb-3 main-border"
                >
                  <b-tab
                    :title="$t('userMapping')"
                    class="pl-2 pb-0 pt-0 pr-0 border-adminmain b-5"
                    style="margin-top: 2px"
                  >
                    <b-card-text>
                      <div class="card m-t-40px m-b-20px mx-3 pr-2">
                        <!-- <div
                          class="card-header map-header p-5px"
                          id="headingFour"
                        >
                          <h2 class="mb-0">
                            <button
                              class="btn btn-link w-100 text-left color-white"
                              type="button"
                              data-toggle="collapse"
                              data-target="#collapseFour"
                              aria-expanded="true"
                              aria-controls="collapseFour"
                            >
                              {{ $t("userMapping") }}
                              <span class="float-right">
                                <i class="fa fa-minus"></i>
                              </span>
                            </button>
                          </h2>
                        </div>
                        <div
                          id="collapseFour"
                          class="collapse show user-module"
                          aria-labelledby="headingFour"
                        >
                          <div class="card-body">
                            <form class="mb-0">
                              <div class="row">
                                <div class="col-6 mb-4">
                                  <b-form-input
                                    v-model="searchName"
                                    :placeholder="
                                      $t('placeholderSearchUserName')
                                    "
                                    class="search-control"
                                  ></b-form-input>
                                </div>

                                <div class="col-sm-6 text-right mb-3">
                                  <b-button
                                    variant="dark"
                                    class="bluetheme-btn"
                                    v-if="!addUserSection"
                                    @click="addUserSection = true"
                                  >
                                    <img
                                      class="w-14 mt-xl-n2"
                                      src="@/assets/images/icons/plusicon.png"
                                    />
                                    <span class="px-1">
                                      {{ $t("addNewUser") }}
                                    </span>
                                  </b-button>
                                </div>
                                <template v-if="addUserSection">
                                  <div class="col-lg-12 border-blue mt-md-0">
                                    <div class="card d-none">
                                      <div
                                        class="card-header border-radius-0 f-s-0-875rem"
                                      >
                                        {{ $t("user_Mapping_Table") }}
                                      </div>
                                    </div>
                                  </div>
                                  <div class="row p-0-15px mt-4">
                                    <div class="col-lg-6">
                                      <div class="form-group row">
                                        <label
                                          for="selectUsername"
                                          class="col-sm-5 col-form-label"
                                          >{{ $t("selectUsername") }}</label
                                        >
                                        <div class="col-sm-7">
                                          <div>
                                            :limit="3"
                                            <treeselect
                                              name="demo2"
                                              :flat="true"
                                              :multiple="true"
                                              :options="usersList"
                                              v-model="selectedUsers"
                                              :placeholder="$t('select')"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div class="col-lg-6">
                                      <div class="form-group row">
                                        <label
                                          for="selectGroupName"
                                          class="col-sm-5 col-form-label"
                                          >{{ $t("selectGroup") }}</label
                                        >
                                        <div class="col-sm-7">
                                          <div class="select-wrapper">
                                            <select
                                              class="form-control"
                                              id="selectGroupName"
                                              v-model="selectedGroup"
                                            >
                                              <option
                                                v-for="(
                                                  group, index
                                                ) in filteredGroups"
                                                :key="index"
                                                :value="group"
                                              >
                                                {{ group.label }}
                                              </option>
                                            </select>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div class="col-lg-6">
                                      <div class="form-group row">
                                        <label
                                          for=""
                                          class="col-sm-5 col-form-label"
                                          >{{ $t("commentsIcon") }}</label
                                        >
                                        <div class="col-sm-7 mt-1">
                                          <div
                                            class="form-check form-check-inline"
                                          >
                                            <div class="pure-checkbox">
                                              <input
                                                id="commentPermission1"
                                                name="commentPermission"
                                                type="radio"
                                                value="Read"
                                                v-model="canComment"
                                              />
                                              <label for="commentPermission1">{{
                                                $t("read")
                                              }}</label>
                                            </div>
                                          </div>
                                          <div
                                            class="form-check form-check-inline"
                                          >
                                            <div class="pure-checkbox">
                                              <input
                                                id="commentPermission2"
                                                name="commentPermission"
                                                type="radio"
                                                value="Read_and_Write"
                                                v-model="canComment"
                                              />
                                              <label for="commentPermission2">{{
                                                $t("read_and_Write")
                                              }}</label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div class="col-lg-6">
                                      <div class="form-group row">
                                        <label
                                          for=""
                                          class="col-sm-5 col-form-label"
                                          >{{ $t("data_sign_off") }}</label
                                        >
                                        <div class="col-sm-7">
                                          <b-form-checkbox
                                            checked="canSignOff"
                                            v-model="canSignOff"
                                            name="canSignOff"
                                            switch
                                            size="lg"
                                            class="mt-1"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div class="col-lg-6">
                                      <div class="form-group row">
                                        <label
                                          for=""
                                          class="col-sm-5 col-form-label"
                                          >{{ $t("reports") }}</label
                                        >
                                        <div class="col-sm-7">
                                          <b-form-checkbox
                                            checked="canGenerateReport"
                                            v-model="canGenerateReport"
                                            name="canGenerateReport"
                                            switch
                                            size="lg"
                                            class="mt-1"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    class="form-group row mb-0 p-0-15px"
                                    style="display: contents"
                                  >
                                    <div class="col-sm-12 text-right mt-3 mb-3">
                                      <b-button
                                        @click="
                                          addUserSection = false;
                                          selectedGroup = '';
                                          selectedUsers = null;
                                        "
                                        class="black-btn mr-3"
                                      >
                                        {{ $t("cancelbtn") }}
                                      </b-button>
                                      <b-button
                                        variant="dark"
                                        :disabled="
                                          selectedGroup === '' ||
                                          selectedUsers.length === 0
                                        "
                                        @click="save"
                                        class="blue-btn"
                                      >
                                        {{ $t("savebtn") }}
                                      </b-button>
                                    </div>
                                  </div>
                                </template>
                                <div class="col-12 m-t-20px">
                                  <div
                                    class="table-responsive table-striped userMappingTable"
                                  >
                                    <table class="table">
                                      <thead class="thead-dark">
                                        <tr>
                                          <th scope="col" style="width: 20%">
                                            {{ $t("userName") }}
                                          </th>
                                          <th scope="col" style="width: 5%">
                                            {{ $t("group") }}
                                          </th>
                                          <th scope="col" style="width: 25%">
                                            {{ $t("modules") }}
                                          </th>
                                          <th scope="col" style="width: 15%">
                                            {{ $t("commentsIcon") }}
                                          </th>
                                          <th scope="col" style="width: 15%">
                                            {{ $t("data_sign_off") }}
                                          </th>
                                          <th scope="col" style="width: 10%">
                                            {{ $t("reports") }}
                                          </th>
                                          <th scope="col" style="width: 10%">
                                            {{ $t("action") }}
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr
                                          v-for="(
                                            group, index
                                          ) in filteredPermission"
                                          :key="index"
                                        >
                                          <td
                                            style="text-transform: capitalize"
                                          >
                                            {{ group.name }}
                                            <span class="small color-green">{{
                                              group.isAdmin
                                                ? `(${group.isAdmin})`
                                                : ""
                                            }}</span>
                                          </td>
                                          <td>{{ group.group }}</td>
                                          <td>
                                            <span
                                              class="cursor-pointer"
                                              v-for="(
                                                modules, ind
                                              ) in group.modules"
                                              :title="getAlias(modules, true)"
                                              :key="ind"
                                            >
                                              {{ $t(`${modules.split("-")[0]}`)
                                              }}<sub>{{
                                                getAlias(modules)
                                              }}</sub>
                                              <template
                                                v-if="
                                                  ind !==
                                                  group.modules.length - 1
                                                "
                                                >&nbsp;+&nbsp;</template
                                              >
                                            </span>
                                          </td>
                                          <td>
                                            {{
                                              group.canComment
                                                ? $t("read_and_Write")
                                                : $t("read")
                                            }}
                                          </td>
                                          <td>
                                            {{
                                              group.canSignOff
                                                ? $t("yes")
                                                : $t("no")
                                            }}
                                          </td>
                                          <td>
                                            {{
                                              group.canGenerateReport
                                                ? $t("yes")
                                                : $t("no")
                                            }}
                                          </td>
                                          <td>
                                            <a class="btn btn-primary black-btn color-white" @click="deleteUser(group.id)">Delete</a>
                                            <b-button
                                              size="sm"
                                              variant="dark"
                                              @click="deleteUser(group.id)"
                                              class="d-flex admindelete-icon"
                                            >
                                              <i class="fa fa-trash"></i>
                                              <img
                                                src="@/assets/images/icons/admindelete-icon.svg"
                                                :style="{ filter: filterColor }"
                                              />
                                              <span class="px-1">
                                                {{ $t("deletebtn") }}
                                              </span>
                                            </b-button>
                                          </td>
                                        </tr>
                                        <tr
                                          v-if="filteredPermission.length === 0"
                                        >
                                          <td colspan="7" class="text-center">
                                            {{ $t("no_data_to_display") }}!
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div> -->

                        <template>
                          <div class="accordion" role="tablist">
                            <b-card no-body class="mb-1">
                              <b-card-header header-tag="header" class="p-1 map-header f-s-0-875rem font-weight-bold" role="tab">
                                <b-button block v-b-toggle.accordion-1 variant="info">     {{ $t("userMapping") }}</b-button>
                              </b-card-header>
                              <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel" class="border-module">
                                <b-card-body>
                                  <b-card-text>
                                    
                                   
                                    <div class="">
                                      <form class="mb-0">
                                        <div class="row">
                                          <div class="col-6 mb-4">
                                            <b-form-input
                                              v-model="searchName"
                                              :placeholder="
                                                $t('placeholderSearchUserName')
                                              "
                                              class="search-control"
                                            ></b-form-input>
                                          </div>
          
                                          <div class="col-sm-6 text-right mb-3">
                                            <b-button
                                              variant="dark"
                                              class="bluetheme-btn"
                                              v-if="!addUserSection"
                                              @click="addUserSection = true"
                                            >
                                              <img
                                                class="w-14 mt-xl-n2"
                                                src="@/assets/images/icons/plusicon.png"
                                              />
                                              <span class="px-1">
                                                {{ $t("addNewUser") }}
                                              </span>
                                            </b-button>
                                          </div>
                                          <template v-if="addUserSection">
                                            <div class="col-lg-12 border-blue mt-md-0">
                                              <div class="card d-none">
                                                <div
                                                  class="card-header border-radius-0 f-s-0-875rem"
                                                >
                                                  {{ $t("user_Mapping_Table") }}
                                                </div>
                                              </div>
                                            </div>
                                            <div class="row p-0-15px mt-4">
                                              <div class="col-lg-6">
                                                <div class="form-group row">
                                                  <label
                                                    for="selectUsername"
                                                    class="col-sm-5 col-form-label"
                                                    >{{ $t("selectUsername") }}</label
                                                  >
                                                  <div class="col-sm-7">
                                                    <div>
                                                      <!-- :limit="3" -->
                                                      <treeselect
                                                        name="demo2"
                                                        :flat="true"
                                                        :multiple="true"
                                                        :options="usersList"
                                                        v-model="selectedUsers"
                                                        :placeholder="$t('select')"
                                                      />
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div class="col-lg-6">
                                                <div class="form-group row">
                                                  <label
                                                    for="selectGroupName"
                                                    class="col-sm-5 col-form-label"
                                                    >{{ $t("selectGroup") }}</label
                                                  >
                                                  <div class="col-sm-7">
                                                    <div class="select-wrapper">
                                                      <select
                                                        class="form-control"
                                                        id="selectGroupName"
                                                        v-model="selectedGroup"
                                                      >
                                                        <option
                                                          v-for="(
                                                            group, index
                                                          ) in filteredGroups"
                                                          :key="index"
                                                          :value="group"
                                                        >
                                                          {{ group.label }}
                                                        </option>
                                                      </select>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div class="col-lg-6">
                                                <div class="form-group row">
                                                  <label
                                                    for=""
                                                    class="col-sm-5 col-form-label"
                                                    >{{ $t("commentsIcon") }}</label
                                                  >
                                                  <div class="col-sm-7 mt-1">
                                                    <div
                                                      class="form-check form-check-inline"
                                                    >
                                                      <div class="pure-checkbox">
                                                        <input
                                                          id="commentPermission1"
                                                          name="commentPermission"
                                                          type="radio"
                                                          value="Read"
                                                          v-model="canComment"
                                                        />
                                                        <label for="commentPermission1">{{
                                                          $t("read")
                                                        }}</label>
                                                      </div>
                                                    </div>
                                                    <div
                                                      class="form-check form-check-inline"
                                                    >
                                                      <div class="pure-checkbox">
                                                        <input
                                                          id="commentPermission2"
                                                          name="commentPermission"
                                                          type="radio"
                                                          value="Read_and_Write"
                                                          v-model="canComment"
                                                        />
                                                        <label for="commentPermission2">{{
                                                          $t("read_and_Write")
                                                        }}</label>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div class="col-lg-6">
                                                <div class="form-group row">
                                                  <label
                                                    for=""
                                                    class="col-sm-5 col-form-label"
                                                    >{{ $t("data_sign_off") }}</label
                                                  >
                                                  <div class="col-sm-7">
                                                    <b-form-checkbox
                                                      checked="canSignOff"
                                                      v-model="canSignOff"
                                                      name="canSignOff"
                                                      switch
                                                      size="lg"
                                                      class="mt-1"
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                              <div class="col-lg-6">
                                                <div class="form-group row">
                                                  <label
                                                    for=""
                                                    class="col-sm-5 col-form-label"
                                                    >{{ $t("reports") }}</label
                                                  >
                                                  <div class="col-sm-7">
                                                    <b-form-checkbox
                                                      checked="canGenerateReport"
                                                      v-model="canGenerateReport"
                                                      name="canGenerateReport"
                                                      switch
                                                      size="lg"
                                                      class="mt-1"
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            <div
                                              class="form-group row mb-0 p-0-15px"
                                              style="display: contents"
                                            >
                                              <div class="col-sm-12 text-right mt-3 mb-3">
                                                <b-button
                                                  @click="
                                                    addUserSection = false;
                                                    selectedGroup = '';
                                                    selectedUsers = null;
                                                  "
                                                  class="black-btn mr-3"
                                                >
                                                  {{ $t("cancelbtn") }}
                                                </b-button>
                                                <b-button
                                                  variant="dark"
                                                  :disabled="
                                                    selectedGroup === '' ||
                                                    selectedUsers.length === 0
                                                  "
                                                  @click="save"
                                                  class="blue-btn"
                                                >
                                                  {{ $t("savebtn") }}
                                                </b-button>
                                              </div>
                                            </div>
                                          </template>
                                          <div class="col-12 m-t-20px">
                                            <div
                                              class="table-responsive table-striped userMappingTable"
                                            >
                                              <table class="table">
                                                <thead class="thead-dark">
                                                  <tr>
                                                    <th scope="col" style="width: 20%">
                                                      {{ $t("userName") }}
                                                    </th>
                                                    <th scope="col" style="width: 5%">
                                                      {{ $t("group") }}
                                                    </th>
                                                    <th scope="col" style="width: 25%">
                                                      {{ $t("modules") }}
                                                    </th>
                                                    <th scope="col" style="width: 15%">
                                                      {{ $t("commentsIcon") }}
                                                    </th>
                                                    <th scope="col" style="width: 15%">
                                                      {{ $t("data_sign_off") }}
                                                    </th>
                                                    <th scope="col" style="width: 10%">
                                                      {{ $t("reports") }}
                                                    </th>
                                                    <th scope="col" style="width: 10%">
                                                      {{ $t("action") }}
                                                    </th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  <tr
                                                    v-for="(
                                                      group, index
                                                    ) in filteredPermission"
                                                    :key="index"
                                                  >
                                                    <td
                                                      style="text-transform: capitalize"
                                                    >
                                                      {{ group.name }}
                                                      <span class="small color-green">{{
                                                        group.isAdmin
                                                          ? `(${group.isAdmin})`
                                                          : ""
                                                      }}</span>
                                                    </td>
                                                    <td>{{ group.group }}</td>
                                                    <td>
                                                      <span
                                                        class="cursor-pointer"
                                                        v-for="(
                                                          modules, ind
                                                        ) in group.modules"
                                                        :title="getAlias(modules, true)"
                                                        :key="ind"
                                                      >
                                                        {{ $t(`${modules.split("-")[0]}`)
                                                        }}<sub>{{
                                                          getAlias(modules)
                                                        }}</sub>
                                                        <template
                                                          v-if="
                                                            ind !==
                                                            group.modules.length - 1
                                                          "
                                                          >&nbsp;+&nbsp;</template
                                                        >
                                                      </span>
                                                    </td>
                                                    <td>
                                                      {{
                                                        group.canComment
                                                          ? $t("read_and_Write")
                                                          : $t("read")
                                                      }}
                                                    </td>
                                                    <td>
                                                      {{
                                                        group.canSignOff
                                                          ? $t("yes")
                                                          : $t("no")
                                                      }}
                                                    </td>
                                                    <td>
                                                      {{
                                                        group.canGenerateReport
                                                          ? $t("yes")
                                                          : $t("no")
                                                      }}
                                                    </td>
                                                    <td>
                                                      <!-- <a class="btn btn-primary black-btn color-white" @click="deleteUser(group.id)">Delete</a> -->
                                                      <b-button
                                                        size="sm"
                                                        variant="dark"
                                                        @click="deleteUser(group.id)"
                                                        class="d-flex admindelete-icon"
                                                      >
                                                        <!-- <i class="fa fa-trash"></i> -->
                                                        <img
                                                          src="@/assets/images/icons/admindelete-icon.svg"
                                                          :style="{ filter: filterColor }"
                                                        />
                                                        <span class="px-1">
                                                          {{ $t("deletebtn") }}
                                                        </span>
                                                      </b-button>
                                                    </td>
                                                  </tr>
                                                  <tr
                                                    v-if="filteredPermission.length === 0"
                                                  >
                                                    <td colspan="7" class="text-center">
                                                      {{ $t("no_data_to_display") }}!
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </div>
                                          </div>
                                        </div>
                                      </form>
                                    </div>
                                 
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
              </b-card>
            </div>
          </b-card-text>
        </b-tab>
        <div></div>
      </b-tabs>
    </b-card>
  </div>
</template>
<script>
/*global settings*/
import config from "@/config/config.js";
import service from "@/service";
import merge from "lodash/merge";
import values from "lodash/values";
import keyBy from "lodash/keyBy";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import DynamicImageMixin from "@/helpers/DynamicImageMixin";
export default {
  props: ["langList"],
  mixins: [DynamicImageMixin],
  data() {
    return {
      groups: config.userManagement.grouping,
      selectedGroup: "",
      createdGroup: "",
      multiple: true,
      clearable: true,
      searchable: true,
      disabled: false,
      openOnClick: true,
      openOnFocus: false,
      clearOnSelect: true,
      closeOnSelect: false,
      alwaysOpen: true,
      appendToBody: false,
      usersList: [],
      selectedUsers: null,
      modulesList: [],
      selectedModules: null,
      permission: [],
      searchName: "",
      searchGroup: "",
      canComment: "Read",
      canSignOff: false,
      canGenerateReport: false,
      dataLoaded: false,
      addGroupSection: false,
      addUserSection: false,
    };
  },
  components: {
    Treeselect,
  },
  computed: {
    groupLabels() {
      let g = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
      ];
      let gUsed = this.groups.map((g) => g.label);
      let gLabels = g.filter((x) => !gUsed.includes(x));
      return gLabels;
    },
    filteredPermission() {
      let mList = this.modulesList.map((m) => m.id);
      let isGroup = [];
      this.permission.forEach((per) => {
        let mCount = per.modules.length,
          count = 0;
        per.modules.forEach((m) => {
          let txt = m.split("-");
          if (mList.includes(txt[1].toLowerCase())) {
            count++;
          }
        });
        if (mCount === count) {
          isGroup.push(per);
        }
      });
      return isGroup.filter((post) => {
        return (
          post.name &&
          post.name.toLowerCase().includes(this.searchName.toLowerCase())
        );
      });
    },
    filteredGroups() {
      if (this.$store.state.appId && this.$store.state.appUserId) {
        let isGroup = [];
        this.groups.forEach((grp) => {
          let mCount = grp.modules.length,
            count = 0;
          grp.modules.forEach((m) => {
            if (this.modules.includes(m.toLowerCase())) {
              count++;
            } else {
              if (m.toLowerCase() === "dynamic") {
                count++;
              }
            }
          });
          if (mCount === count) {
            isGroup.push(grp);
          }
        });
        return isGroup;
      } else {
        let mList = this.modulesList.map((m) => m.id);
        let isGroup = [];
        this.groups.forEach((grp) => {
          let mCount = grp.modules.length,
            count = 0;
          grp.modules.forEach((m) => {
            let txt = m.split("-");
            if (mList.includes(txt[1].toLowerCase())) {
              count++;
            }
          });
          if (mCount === count) {
            isGroup.push(grp);
          }
        });
        return isGroup.filter((post) => {
          return (
            post.label &&
            post.label.toLowerCase().includes(this.searchGroup.toLowerCase())
          );
        });
      }
    },
  },
  methods: {
    getAlias(value, isTitle = false) {
      let v = value.split("-"),
        label = "";
      if (v[1] === "default") {
        label = isTitle
          ? this.$i18n.t("default")
          : `(${this.$i18n.t("default")})`;
      }
      if (v[1] === "fp") {
        label = isTitle
          ? this.$i18n.t("family_planning")
          : `(${this.$i18n.t("fp")})`;
      }
      if (v[1] === "mnch") {
        label = isTitle
          ? this.$i18n.t("maternalHealth")
          : `(${this.$i18n.t("mnch")})`;
      }
      return label;
    },
    save() {
      // service.deleteSavedConfig("userManagement")
      // return
      this.$store.state.loading = true;
      let users = [],
        dashboards = [],
        r = [
          "Dashboard",
          "dashboard",
          "report",
          "integrated-dashboard",
        ];

      this.selectedGroup.modules.forEach((module) => {
        let m = module.split("-");
        if (m[1] !== "default" && dashboards.indexOf(m[1]) === -1) {
          dashboards.push(m[1]);
        }
        if (m[0] === "summary_dashboard") {
          let route = m[1] === "fp" ? "summary-dashboard" : "SummaryDashboard";
          r.push(route);
        }
        if (m[0] === "interactive_dashboard") {
          r.push("InteractiveDashboard");
          r.push("SavedFavorites");
        }
        if (m[0] === "DQR") {
          let route = m[1] === "fp" ? "dqr-dashboard" : "DQRDashboard";
          r.push(route);
        }
        if (m[0] === "analytical_dashboard") {
          let route =
            m[1] === "fp" ? "analytical-dashboard" : "AnalyticalDashboard";
          r.push(route);
          if (m[1] === "fp") {
            r.push("new-analytical-dashboard");
          }
        }
        if (m[0] === "mapVisualization") {
          r.push("map");
        }
        if (m[0] === "linked_modules") {
          r.push("dynamicDashboard");
        }
      });

      let isAdmin = [];
      this.selectedUsers.forEach((user) => {
        let isUser = this.usersList.find((ul) => ul.id === user);
        if (isUser) {
          isUser.userCredentials.userRoles.forEach((u) => {
            if (
              this.$store.getters.getAppSettings.adminUserRole.includes(u.name)
            ) {
              isAdmin.push(user);
            }
          });
        }
      });

      if (this.permission.length) {
        users = this.permission.map((u) => {
          if (this.selectedUsers.includes(u.id)) {
            this.selectedUsers = this.selectedUsers.filter((su) => su !== u.id);

            return {
              id: u.id,
              routes: r,
              dashboards: dashboards,
              canSignOff: this.canSignOff,
              group: this.selectedGroup.label,
              modules: this.selectedGroup.modules,
              canGenerateReport: this.canGenerateReport,
              canComment: this.canComment === "Read" ? false : true,
              name: this.usersList.find((ul) => ul.id === u.id).label,
              isAdmin: isAdmin.includes(u) ? this.$i18n.t("admin") : "",
            };
          } else {
            return u;
          }
        });
        if (this.selectedUsers.length) {
          this.selectedUsers.map((u) => {
            users.push({
              id: u,
              routes: r,
              dashboards: dashboards,
              canSignOff: this.canSignOff,
              group: this.selectedGroup.label,
              modules: this.selectedGroup.modules,
              canGenerateReport: this.canGenerateReport,
              name: this.usersList.find((ul) => ul.id === u).label,
              canComment: this.canComment === "Read" ? false : true,
              isAdmin: isAdmin.includes(u) ? this.$i18n.t("admin") : "",
            });
          });
        }
      } else {
        users = this.selectedUsers.map((u) => ({
          id: u,
          routes: r,
          dashboards: dashboards,
          canSignOff: this.canSignOff,
          group: this.selectedGroup.label,
          modules: this.selectedGroup.modules,
          canGenerateReport: this.canGenerateReport,
          name: this.usersList.find((ul) => ul.id === u).label,
          canComment: this.canComment === "Read" ? false : true,
          isAdmin: isAdmin.includes(u) ? this.$i18n.t("admin") : "",
        }));
      }

      let key = this.generateKey("userManagement");

      let allKeys = service.getAllKeys();
      allKeys.then((keys) => {
        if (keys.data.includes(key)) {
          let saveConfig = service.getSavedConfig(key);
          saveConfig
            .then((res) => {
              let usersPermission = {
                permission: users,
                grouping: this.groups,
              };

              let response = service.updateConfig(usersPermission, key);
              response
                .then((response) => {
                  if (response.data.status === "OK") {
                    this.sweetAlert({
                      title: this.$i18n.t("data_saved_successfully"),
                    });
                    this.getGroups();
                    this.selectedGroup = "";
                    this.canComment = "Read";
                    this.canSignOff = false;
                    this.canGenerateReport = false;
                    this.selectedUsers = [];
                    this.$store.state.loading = false;
                  } else {
                    this.sweetAlert({
                      title: this.$i18n.t("error"),
                      text: `${response.data.message}`,
                    });
                    this.selectedGroup = "";
                    this.canComment = "Read";
                    this.canSignOff = false;
                    this.canGenerateReport = false;
                    this.selectedUsers = [];
                    this.$store.state.loading = false;
                    return;
                  }
                })
                .catch((error) => {
                  this.sweetAlert({
                    title: this.$i18n.t("error"),
                  });
                  this.selectedGroup = "";
                  this.canComment = "Read";
                  this.canSignOff = false;
                  this.canGenerateReport = false;
                  this.selectedUsers = [];
                  this.$store.state.loading = false;
                  return;
                });
            })
            .catch((error) => {
              this.sweetAlert({
                title: this.$i18n.t("error"),
              });
              this.selectedGroup = "";
              this.canComment = "Read";
              this.canSignOff = false;
              this.canGenerateReport = false;
              this.selectedUsers = [];
              this.$store.state.loading = false;
              return;
            });
        } else {
          let usersPermission = {
            permission: users,
            grouping: this.groups,
          };

          let response = service.saveConfig(usersPermission, key);
          response
            .then((response) => {
              if (response.data.status === "OK") {
                this.sweetAlert({
                  title: this.$i18n.t("data_saved_successfully"),
                });
                this.getGroups();

                this.selectedGroup = "";
                this.canComment = "Read";
                this.canSignOff = false;
                this.canGenerateReport = false;
                this.selectedUsers = [];
                this.$store.state.loading = false;
              } else {
                this.sweetAlert({
                  title: this.$i18n.t("error"),
                  text: `${response.data.message}`,
                });
                this.selectedGroup = "";
                this.canComment = "Read";
                this.canSignOff = false;
                this.canGenerateReport = false;
                this.selectedUsers = [];
                this.$store.state.loading = false;
                return;
              }
            })
            .catch(() => (this.$store.state.loading = false));
        }
      });
    },
    getUsersList() {
      this.$store.state.loading = true;
      service
        .getUsersList()
        .then((res) => {
          let r = res.data;
          // this.usersList = r.users.map((u,i) => ({...u, id: u.userCredentials.id}))
          let user = [];
          r.users.forEach((us) => {
            us.userCredentials.userRoles.forEach((u) => {
              if (
                this.$store.getters.getAppSettings.nonAdminUserRole.includes(
                  u.name
                )
              ) {
                user.push(us);
              }
            });
          });
          this.usersList = user.map((u, i) => ({
            ...u,
            id: u.userCredentials.id,
          }));
          if (!this.dataLoaded) {
            this.dataLoaded = true;
            this.getGroups();
          }
          this.$store.state.loading = false;
        })
        .catch(() => {
          this.$store.state.loading = false;
          console.log("User list not found...");
        });
    },
    getGroups() {
      // service.deleteSavedConfig("userManagement")
      // return
      let key = this.generateKey("userManagement");
      let response = service.getSavedConfig(key);
      response
        .then((response) => {
          this.groups =
            response.data.grouping && response.data.grouping.length > 0
              ? values(
                  merge(
                    keyBy(this.groups, "label"),
                    keyBy(response.data.grouping, "label")
                  )
                )
              : this.groups;

          this.permission = response.data.permission;
        })
        .catch(() => console.log("User management data not found..."));
    },
    addGroup() {
      let newGroup = {
        label: this.createdGroup,
        modules: this.selectedModules,
        deletable: true,
      };
      this.groups.push(newGroup);
      this.createdGroup = "";
      this.selectedModules = [];
      this.$store.state.loading = true;
      let key = this.generateKey("userManagement");

      let response = service.getSavedConfig(key);
      response
        .then((response) => {
          let data = response.data;
          let usersPermission = {
            ...data,
            grouping: this.groups,
          };
          service
            .updateConfig(usersPermission, key)
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
              this.addGroupSection = false;
            })
            .catch((error) => {
              this.sweetAlert({
                title: this.$i18n.t("error"),
              });

              this.$store.state.loading = false;
              this.addGroupSection = false;
              return;
            });
        })
        .catch(() => {
          let usersPermission = {
            permission: [],
            grouping: this.groups,
          };

          let response = service.saveConfig(usersPermission, key);
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
              this.addGroupSection = false;
            })
            .catch(() => {
              this.sweetAlert({
                title: this.$i18n.t("error"),
              });
              this.$store.state.loading = false;
              this.addGroupSection = false;
            });
        });
    },
    deleteGroup(label) {
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
          this.groups = this.groups.filter((g) => g.label !== label);
          let key = this.generateKey("userManagement");

          let response = service.getSavedConfig(key);
          response
            .then((response) => {
              let data = response.data;
              let usersPermission = {
                ...data,
                grouping: this.groups,
              };
              service
                .updateConfig(usersPermission, key)
                .then((response) => {
                  if (response.data.status === "OK") {
                    this.sweetAlert({
                      title: this.$i18n.t("groupDeleted"),
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
                .catch((error) => {
                  this.sweetAlert({
                    title: this.$i18n.t("error"),
                  });

                  this.$store.state.loading = false;
                  return;
                });
            })
            .catch(() => {
              this.$store.state.loading = false;
              this.sweetAlert({
                title: this.$i18n.t("error"),
              });
            });
        }
      });
    },
    deleteUser(id) {
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
          let key = this.generateKey("userManagement");

          let response = service.getSavedConfig(key);
          response
            .then((response) => {
              let data = response.data;
              let usersPermission = {
                ...data,
                permission: response.data.permission.filter((p) => p.id !== id),
              };
              service
                .updateConfig(usersPermission, key)
                .then((response) => {
                  if (response.data.status === "OK") {
                    this.sweetAlert({
                      title: this.$i18n.t("usersPermissionDeleteSuccess"),
                    });
                    this.getGroups();
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
                .catch((error) => {
                  this.sweetAlert({
                    title: this.$i18n.t("error"),
                  });

                  this.$store.state.loading = false;
                  return;
                });
            })
            .catch(() => {
              this.$store.state.loading = false;
              this.sweetAlert({
                title: this.$i18n.t("error"),
              });
            });
        }
      });
    },
  },
  created() {
    let list = [
      {
        id: "summary_dashboard",
        label: this.$i18n.t("summary_dashboard"),
      },
      {
        id: "analytical_dashboard",
        label: this.$i18n.t("analytical_dashboard"),
      },
      {
        id: "DQR",
        label: this.$i18n.t("DQR"),
      },
      {
        id: "mapVisualization",
        label: this.$i18n.t("mapVisualization"),
      },
      {
        id: "linked_modules",
        label: this.$i18n.t("linked_modules"),
      },
    ];
    let defaultList = [
      {
        id: "interactive_dashboard",
        label: this.$i18n.t("interactive_dashboard"),
      },
    ];
    let program = [];
    if (this.$store.getters.getAppSettings.modulesList.length > 1) {
      program.push({
        id: "default",
        label: this.$i18n.t("default"),
      });
    }
    this.$store.getters.getAppSettings.modulesList.forEach((m) => {
      let text = "";
      if (m === "fp") {
        text = this.$i18n.t("family_planning");
      }
      if (m === "mnch") {
        text = this.$i18n.t("maternalHealth");
      }
      program.push({
        id: m,
        label: text,
      });
    });
    let mList = [];
    program.forEach((p) => {
      let ls = p.id === "default" ? defaultList : list;
      mList.push({
        ...p,
        children: ls.map((l) => ({
          ...l,
          id: `${l.id}-${p.id}`,
        })),
      });
    });
    this.modulesList = mList;
    this.getUsersList();
  },
};
</script>

<style scoped lang="scss">
.userMappingTable {
  overflow-y: auto;
  max-height: 300px;
}
.userMappingTable .table thead tr th {
  position: sticky;
  top: -1px;
  z-index: 2;
}
.vue-treeselect--searchable.vue-treeselect--open-below,
.vue-treeselect.vue-treeselect--multi.vue-treeselect--searchable.vue-treeselect--open-above {
  display: block;
  width: 100%;
  /* height: calc(1.5em + 0.75rem + 2px); */
  padding: 0.266rem 0.2rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--text-color);
  background-color: transparent;
  background-clip: padding-box;

  border-radius: 0.25rem;
  -webkit-transition: border-color 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
  transition: border-color 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
}
.vue-treeselect__placeholder,
.vue-treeselect__single-value {
  line-height: 26px !important;
}
</style>
