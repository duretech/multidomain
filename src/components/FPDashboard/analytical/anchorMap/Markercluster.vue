<template>
  <l-layer-group ref="serviceObj" layer-type="overlay" name="Health Facilities">
    <v-marker-cluster :options="clusterOptions">
      <v-marker
        v-for="l in servicelist"
        :key="l.serviceid"
        :lat-lng="[l.latitude, l.longitude]"
        :icon="icon"
      >
        <v-popup>
          <b-container fluid>
            <b-row>
              <b-col lg="12">
                <span class=""
                  ><i class="fa fa-university"></i>&nbsp;<b>Name: </b></span
                >
                <span>{{ l.servicename }}</span>
              </b-col>
            </b-row>
            <hr style="border-top: 1px solid #eee; margin-top: 6px" />
            <b-row v-for="(value, name, index) in l.extList" :key="index">
              <b-col lg="12" v-if="name != 'N/A'">
                <span class=""><i class="fa fa-info-circle"></i>&nbsp;</span>
                <span
                  ><b>{{ name }}: </b> {{ value }}</span
                >
              </b-col>
            </b-row>
          </b-container>
        </v-popup>
      </v-marker>
    </v-marker-cluster>
  </l-layer-group>
</template>

<script>
import Vue2LeafletMarkercluster from "vue2-leaflet-markercluster";
import { latLng, Icon, icon } from "leaflet";
import { LMarker, LPopup, LLayerGroup } from "vue2-leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

function rand(n) {
  let max = n + 0.1;
  let min = n - 0.1;
  return Math.random() * (max - min) + min;
}

export default {
  name: "Markercluster",
  props: {
    mapInstance: Object,
    servicedata: Object,
  },
  components: {
    "v-marker": LMarker,
    "v-popup": LPopup,
    "v-marker-cluster": Vue2LeafletMarkercluster,
    LLayerGroup,
  },
  methods: {},
  data() {
    let locations = [];
    for (let i = 0; i < 5; i++) {
      locations.push({
        id: i,
        latlng: latLng(rand(-34.9205), rand(-57.953646)),
        text: "Hola " + i,
      });
    }
    let customicon = icon(
      Object.assign({}, Icon.Default.prototype.options, { iconUrl, shadowUrl })
    );
    return {
      servicelist: this.servicedata.servicetypelist[0].servicelist,
      locations,
      icon: customicon,
      clusterOptions: {},
      initialLocation: latLng(-34.9205, -57.953646),
    };
  },
  created() {
    // console.log(this)
    this.lmap = this.mapInstance;
    //      this.$nextTick(() => {
    //        this.addSourcesOverlay();
    //      });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
/*@import "~leaflet.markercluster/dist/MarkerCluster.css";
  @import "~leaflet.markercluster/dist/MarkerCluster.Default.css";*/
</style>
