<template>
  <div class="container-fluid bottom-tabbar" :class="{'active': showToolbarOnTablet}">
    <div class="bottom-tabbar-close" @click="closeToolbar"><i class="far fa-times-circle"></i></div>
      <div class="bottom_toolbar_wrap">
        <form class="input-select-items">
          <div class="form-group pr-3">
            <label class="text-center">{{$t('location')}}</label>
            <treeselect class="form-control" :options="options" :show-count="true" :placeholder="$t('search')" v-model="value" :flat="false" :default-expand-level="defaultExpandLevel" :load-options="loadOptions"/>
          </div>

          <div class="form-group pr-3" v-if="recentActiveTab == 'input'">
            <label class="text-capitalize">{{$t('methods')}}</label>
            <treeselect class="form-control" :options="emuMethods" :disable-branch-nodes="true" size="sm" :show-count="true" placeholder="Search.." v-model="selected" :flat="false"/>
          </div>
          <div class="form-group pr-3" v-if="recentActiveTab != 'input'">
              <label class="text-capitalize">{{$t('methods')}}</label>
              <div class="select-wrapper">
                  <select class="form-control tabbarselect" v-model="calsType" >
                      <option v-for="filter in calTypeOptions" :key="filter.value" :value="filter.value">{{filter.text}}</option>
                  </select>
              </div>
          </div>
        </form>
      </div>
  </div>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import loadLocChildMixin from "@/helpers/LoadLocationChildMixin";
export default {
  props: ["locationValue", "methods", "defaultMethod", 'showToolbarOnTablet', 'recentActiveTab', 'locKey', 'calType'],
  components: {
    Treeselect
  },
  mixins: [loadLocChildMixin],
  data() {
    //console.log(this.calType)
    return {
      multiple: false,
      clearable: true,
      searchable: false,
      disabled: false,
      openOnClick: true,
      openOnFocus: false,
      clearOnSelect: true,
      closeOnSelect: false,
      alwaysOpen: true,
      appendToBody: false,
      defaultExpandLevel: 1,
      options: [],
      value: null,
      firstTime: true,
      selected: this.defaultMethod,
      emuMethods: this.methods,
      calsType: this.calType,
      calTypeOptions: [
        {
          value: "aggregate",
          text: this.$i18n.t("method_aggregate")
        },
        {
          value: "method",
          text: this.$i18n.t("method_detial")
        }
      ],
    }
  },
  watch: {
    recentActiveTab(vale){
      //console.log(vale)
    },
    locationValue(newValue) {
      if (newValue) {
        this.value = newValue
      }
      this.selected = this.defaultMethod
    },
    value(newValue) {
      if (!this.firstTime) {
          this.$emit('location', newValue)
      } else {
          this.firstTime = false
      }
    },
    selected(newValue) {
      if(newValue){
        this.selected = newValue
        this.$emit('emuMethod', newValue)
      }
      console.log(this.selected)
    },
    methods(newValue) {
      this.emuMethods = newValue
      this.selected = this.emuMethods[0]['children'][0]['id']
    },
    calsType(newValue){
        this.$emit('calsType', newValue)
    },
    calType(newVal){
      this.calsType = newVal
    }
  },
  methods: {
    closeToolbar() {
      this.$emit("closeToolbar")
    },
    getConfigAccess() {
      this.options = JSON.parse(JSON.stringify(this.$store.getters.getLocationList))
      this.value = this.locationValue
    }
  },
  mounted() {
    this.getConfigAccess()
  }
}

</script>
<style lang="scss" scoped>

.form-control:disabled {
  opacity: 0.8 !important;
}
.indicatortext{
  display:flex;
}
</style>
