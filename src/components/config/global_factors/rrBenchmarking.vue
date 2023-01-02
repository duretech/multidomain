<template>
  <div>
    <div class="card">
      <div class="card-body">
        <div class="row" v-for="(plotline,i) in rrBenchmarking" :key="'benchmark'+i">
          <div class="col-12">
            <div class="row">
              <div class="col-6">
                <div class="form-group row">
                  <label class="col-sm-5 col-form-label">{{$t('benchmarking')}}</label>
                  <div class="col-sm-7">
                    <b-form-checkbox :checked="plotline.enabled" v-model="plotline.enabled" name="someSwitchOptionBenchmarking" switch size="lg" class="mt-1" />
                  </div>
                </div>
              </div>
            </div>
            <transition name="fade">
            <div class="row mx-0" v-if="plotline.enabled">
              <div class="col-12 border pt-3">
                <div class="row">
                  <div class="col-6">
                  <div class="form-group row">
                    <label class="col-sm-5 col-form-label">{{$t('line_type')}} </label>
                    <div class="col-sm-7">
                    <div class="select-wrapper">
                      <select class="form-control" v-model="plotline.dashStyle">
                        <option v-for="(op,j) in benchmarkLineStyleOptions" :key="'styleOption'+j" :value="op.value">{{op.text}}</option>
                      </select>
                      </div>
                    </div>
                  </div>
                  <div class="form-group row">
                    <label class="col-sm-5 col-form-label">{{$t('line_color')}}</label>
                    <div class="col-sm-2">
                      <input type="color" class="form-control" placeholder="" v-model="plotline.color" />
                    </div>
                    <div class="col-sm-5">
                      <input type="text" class="form-control" placeholder="" v-model="plotline.color">
                    </div>
                  </div>
                  </div>
                  <div class="col-6">
                    <div class="form-group row">
                      <label class="col-sm-5 col-form-label">{{$t('line_value')}} (%)</label>
                      <div class="col-sm-7">
                        <input type="text" class="form-control" placeholder="" v-model="plotline.value" />
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-sm-5 col-form-label">{{$t('line_width')}}</label>
                      <div class="col-sm-7">
                        <input type="text" class="form-control" placeholder="" v-model="plotline.width" />
                      </div>
                    </div>
                  </div>
                  <div class="col-12 pb-3">
                    <div class="row">
                      <div class="col-6">
                        <div class="form-group row">
                          <label class="col-sm-5 col-form-label">{{$t('line_label')}}</label>
                          <div class="col-sm-7">
                            <b-form-checkbox :checked="plotline.label.enabled" v-model="plotline.label.enabled" name="someSwitchOptionXAxis" switch size="lg" class="mt-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <transition name="fade">
                    <div class="row mx-0" v-if="plotline.label.enabled">
                      <div class="col-12 border pt-3">
                        <div class="form-group row">
                          <label class="col-sm-5 col-form-label">{{$t('label_text')}}</label>
                          <div class="col-sm-7">
                            <input type="text" class="form-control" placeholder="" v-model="plotline.label.text" />
                          </div>
                        </div>
                        <div class="form-group row">
                          <label class="col-sm-5 col-form-label">{{$t('label_position')}}</label>
                          <div class="col-sm-7">
                          <div class="select-wrapper">
                            <select class="form-control" v-model="plotline.label.align">
                              <option v-for="(op,j) in benchmarkLabelAlignOptions" :key="'styleOption'+j" :value="op.value">{{op.text}}</option>
                            </select>
                          </div>
                          </div>
                        </div>
                        <div class="form-group row">
                          <label class="col-sm-5 col-form-label">{{$t('label_color')}}</label>
                          <div class="col-sm-2">
                            <input type="color" class="form-control" placeholder="" v-model="plotline.label.style.color" />
                          </div>
                          <div class="col-sm-5">
                            <input type="text" class="form-control" placeholder="" v-model="plotline.label.style.color">
                          </div>
                        </div>
                      </div>
                    </div>
                    </transition>
                  </div>
                </div>
              </div>
            </div>
            </transition>
          </div>
        </div>
        <div class="row pt-4">
          <div class="col text-right">
            <button type="button" class="btn btn-primary black-btn" v-on:click="updateConfigData">{{$t('savebtn')}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import globalFactorsConfig from '../../../config/globalFactorsConfig.js'
import service from '../../../service'
import audit from "../audit.js"
import merge from 'lodash/merge'
import assign from 'lodash/assign'
export default {
  props: ['module', 'type', 'subType'],
  data() {
    return {
      rrBenchmarking: globalFactorsConfig[this.type][this.subType].plotLines,
      benchmarkLineValueType: [
        { value: 'percentage', text: "Percentage (%)" },
        { value: 'numeric', text: "Numeric" }
      ],
      benchmarkLabelAlignOptions: [
        { value: 'left', text: 'Left' },
        { value: 'center', text: 'Center' },
        { value: 'right', text: 'Right' },
      ],
      benchmarkLineStyleOptions: [
        { value: 'solid', text: 'Solid' },
        { value: 'shortdash', text: 'Short Dash' },
        { value: 'shortdot', text: 'Short Dot' },
        { value: 'shortdashdot', text: 'Short Dash Dot' },
        { value: 'shortdashdotdot', text: 'Short Dash Dot Dot' },
        { value: 'dot', text: 'Dot' },
        { value: 'dash', text: 'Dash' },
        { value: 'longdash', text: 'Long Dash' },
        { value: 'dashdot', text: 'Dash Dot' },
        { value: 'longdashdot', text: 'Long Dash Dot' },
        { value: 'longdashdotdot', text: 'Long Dash Dot Dot' }
      ],
      originalRRBenchmarking: null
    }
  },
  methods: {
    //This is to fetch config data on page load
    getConfigData() {
      this.$store.state.loading = true;
      // console.log("data initial",[this.chartBySubtype],JSON.stringify(config))
      let key = this.generateKey(this.module);

      let response = service.getSavedConfig(key);
      response.then(response => {
        // console.log(response)

          if (response.data[this.type][this.subType]) {
            this.rrBenchmarking = response.data[this.type][this.subType].plotLines ? merge(this.rrBenchmarking, response.data[this.type][this.subType].plotLines) : this.rrBenchmarking
            this.originalRRBenchmarking = JSON.parse(JSON.stringify(this.rrBenchmarking))
          }
          this.$store.state.loading = false;
        })
        .catch(res => {
          console.log("Config not found...");
          this.$store.state.loading = false;
        })
    },
    updateConfigData() {
      this.$store.state.loading = true;
      let rrBenchmarking = {
        "plotLines": this.rrBenchmarking
      }

      let key = this.generateKey(this.module);

      let allKeys = service.getAllKeys();
      allKeys.then(keys => {
        if (keys.data.includes(key)) {
          let saveConfig = service.getSavedConfig(key);
          saveConfig.then(res => {
            let configData = res.data;
            // console.log("configData", configData);
            if (configData[this.type]) {
              configData[this.type][this.subType] = configData[this.type][this.subType] ? assign(configData[this.type][this.subType], rrBenchmarking) : rrBenchmarking
            } else {
              configData[this.type] = {
                [this.subType]: rrBenchmarking
              }
            }
            // console.log("originalRRBenchmarking",this.originalRRBenchmarking)
            // console.log("configData[this.type][this.subType].plotLines",configData[this.type][this.subType].plotLines)
            let configChanges = audit.configAudit(this.originalRRBenchmarking, configData[this.type][this.subType].plotLines)
            // console.log("configChanges", configChanges)
            let response = service.updateConfig(configData, key)
            response.then(response => {
              if (response.data.status === "OK") {
                // console.log("response update ", response.data)
                this.$swal({
                  title: this.$i18n.t('data_saved_successfully')
                }).then(() => {
                  if(Object.keys(configChanges).length) {
                    audit.processAudit('process2', key, configChanges, this.type, this.subType)
                  }
                })
                this.$store.commit("setGlobalFactors", {
                    payload: configData,
                  });
                this.originalRRBenchmarking = JSON.parse(JSON.stringify(this.rrBenchmarking))
                this.$store.state.loading = false;
              } else {
                this.$swal({
                  title: this.$i18n.t('error'),
                  text: `${response.data.message}`
                })

                this.$store.state.loading = false;
                return;
              }
            }).catch(error => {
              this.$swal({
                title: this.$i18n.t('error')
              })

              this.$store.state.loading = false;
              return;
            })
          })
        } else {
          let configData = {
            [this.type]: {
              [this.subType]: rrBenchmarking
            }
          }
          let response = service.saveConfig(configData, key)
          response.then(response => {
            if (response.data.status === "OK") {
              // console.log("response save ", response.data)
              this.$swal({
                title: this.$i18n.t('data_saved_successfully')
              })
              this.$store.commit("setGlobalFactors", {
                    payload: configData,
                  });
              this.originalRRBenchmarking = JSON.parse(JSON.stringify(this.rrBenchmarking))
              this.$store.state.loading = false;
            } else {
              this.$swal({
                title: this.$i18n.t('error'),
                text: `${response.data.message}`
              })
              this.$store.state.loading = false;
              return;
            }
          });
        }

      })
    }
  },
  created() {
    // console.log("created")
    if(this.$i18n.locale === 'fr') {
      this.benchmarkLabelAlignOptions = [
        { value: 'left', text: this.$i18n.t('left') },
        { value: 'center', text: this.$i18n.t('center') },
        { value: 'right', text: this.$i18n.t('right') },
      ]
      this.benchmarkLineStyleOptions = [
        { value: 'solid', text: this.$i18n.t('solid') },
        { value: 'shortdash', text: this.$i18n.t('shortdash') },
        { value: 'shortdot', text: this.$i18n.t('shortdot') },
        { value: 'shortdashdot', text: this.$i18n.t('shortdashdot') },
        { value: 'shortdashdotdot', text: this.$i18n.t('shortdashdotdot') },
        { value: 'dot', text: this.$i18n.t('dot') },
        { value: 'dash', text: this.$i18n.t('dash') },
        { value: 'longdash', text: this.$i18n.t('longdash') },
        { value: 'dashdot', text: this.$i18n.t('dashdot') },
        { value: 'longdashdot', text: this.$i18n.t('longdashdot') },
        { value: 'longdashdotdot', text: this.$i18n.t('longdashdotdot') }
      ]
    }
    this.getConfigData(); //Remove / add $store.state.loading in updated when you enable / disable this call
  },
  updated() {

    // this.$store.state.loading = false
  }
}

</script>
