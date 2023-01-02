<template>
  <div>
    <div class="insideWrapSec">
      <div class="row px-3">
        <div class="col-4 alert alert-secondary">
          <p class="topSRDiv">Public Sector</p>
        </div>
        <div class="col-4 alert alert-secondary">
          <p class="topSRDiv">Private Medical Sector</p>
        </div>
        <div class="col-4 alert alert-secondary">
          <p class="topSRDiv">Other Source</p>
        </div>
      </div>
      <div class="row">
        <div class="col-4">
          <div class="form-group">
            <label for>Government Health facilities and home</label>
            <div class="select-wrapper">
              <select class="form-control" v-model="data['governmentHealth']">
                <option>Yes</option>
                <option>No</option>
                <option>Partially</option>
              </select>
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="form-group">
            <label for>NGO</label>
            <div class="select-wrapper">
              <select class="form-control" v-model="data['ngo']">
                <option>Yes</option>
                <option>No</option>
                <option>Partially</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for>Private Hospital</label>
            <div class="select-wrapper">
              <select class="form-control" v-model="data['privateHospital']">
                <option>No</option>
                <option>Yes</option>
                <option>Partially</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for>Pharmacy</label>
            <div class="select-wrapper">
              <select class="form-control" v-model="data['pharmacy']">
                <option>Yes</option>
                <option>No</option>
                <option>Partially</option>
              </select>
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="form-group">
            <label for>Shop/Church/Friend</label>
            <div class="select-wrapper">
              <select class="form-control" v-model="data['shopChurchFriend']">
                <option>Yes</option>
                <option>No</option>
                <option>Partially</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for>Other</label>
            <div class="select-wrapper">
              <select class="form-control" v-model="data['otherSector']">
                <option>No</option>
                <option>Yes</option>
                <option>Partially</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
    props: ['data'],
    data(){
        return {
            FPSource: {Commodities_Client: {governmentHealth: "Yes",ngo: "Yes",otherSector: "Yes",pharmacy: "Yes",privateHospital: "Yes",shopChurchFriend: "Yes"},
            Commodities_Facilities: {governmentHealth: "Yes",ngo: "Yes",otherSector: "Yes",pharmacy: "Yes",privateHospital: "Yes",shopChurchFriend: "Yes"},
            User: {governmentHealth: "Yes",ngo: "Yes",otherSector: "Yes",pharmacy: "Yes",privateHospital: "Yes",shopChurchFriend: "Yes"},
            Visits: {governmentHealth: "Yes",ngo: "Yes",otherSector: "Yes",pharmacy: "Yes",privateHospital: "Yes",shopChurchFriend: "Yes"}}
        }
    }
}
</script>
<style scoped lang="scss">
.sectionReportDiv .card-body .nav-link{
  font-size: 0.875rem;
  font-size: 0.875rem;
  color: #000;
}
.sectionReportDiv .topSRDiv {
    font-size: 0.9375rem;
    margin-bottom: 0;
}
.sectionReportDiv .form-group label{
  font-size: 0.875rem;
}
.sectionReportDiv .alert-secondary{
  border: 0;
  border-radius: 0;
}
.sectionReportDiv .form-control{
  font-size: 0.75rem;
}
</style>
