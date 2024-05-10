<template>
  <b-modal
    v-model="isFlash"
    size="xl"
    class="modal-fullscreen1 home-popup"
    :ok-title="isDisableFlash ? $t('ok') : $t('disablePerm')"
    :cancel-title="$t('ok')"
    :ok-only="isDisableFlash"
    @ok="disablePopup"
    hide-header
    centered
    no-close-on-backdrop
  >
    <div class="" :class="{ 'text-center': !isFetched }">
      <h3 class="text-center">{{ $t("welcome") }}</h3>
      <h5 class="mt-4 text-center" v-if="flashData.length">
        {{ $t("flashMsg") }}
      </h5>
      <template v-if="isFetched">
        <div v-if="flashData.length">
          <b-carousel
            id="carousel-1"
            v-model="slide"
            :interval="9000"
            :controls="true"
            indicators
            img-width="1024"
            img-height="480"
          >
            <b-carousel-slide
              v-for="(slide, i) in flashData"
              :key="'slide' + i"
            >
              <div>
                <b-media right-align vertical-align="center">
                  <b-row>
                    <b-col
                      sm="5"
                      class="d-flex justify-content-center align-items-center"
                    >
                      <p class="mb-0">
                        {{ slide.text }}
                      </p>
                    </b-col>
                    <b-col
                      sm="7"
                      class="d-flex justify-content-center align-items-center"
                    >
                      <img
                        v-if="slide.image"
                        alt="img"
                        :src="
                          slide.isURL
                            ? slide.image
                            : require(`@/assets/images/popup-logos/${slide.image}`)
                        "
                        class="pr-2 cursor-pointer f-s-20px mb-lg-1 popup-img img-fluid"
                      />
                    </b-col>
                  </b-row>
                </b-media>
              </div>
            </b-carousel-slide>
          </b-carousel>
        </div>
        <div class="mt-4 text-center" v-else>
          <!-- {{ $t("no_data_to_display") }} -->
          {{ $t("noUpdates") }}
        </div>
      </template>
      <template v-else>
        <b-spinner type="grow" label="Spinning"></b-spinner>
      </template>
    </div>
  </b-modal>
</template>
<script>
import service from "@/service";
export default {
  props: ["showModal", "allFlashData", "isDisableFlash"],
  data() {
    return {
      slide: 0,
      isFlash: true,
      flashData: [],
      isFetched: false,
    };
  },
  watch: {
    showModal(newValue) {
      this.isFlash = newValue;
    },
    isFlash(newValue) {
      if (!newValue) {
        this.$emit("hideModal");
      }
    },
  },
  methods: {
    disablePopup() {
      if (!this.isDisableFlash) {
        let key = this.generateKey("appSettings");
        service
          .getSavedConfig({ tableKey: key, isDefault: true })
          .then((response) => {
            let res = {
              ...response.data,
              disableFlash:
                response.data.disableFlash && response.data.disableFlash.length
                  ? [
                      ...response.data.disableFlash,
                      this.$store.getters.getLoggedInUserId,
                    ]
                  : [this.$store.getters.getLoggedInUserId],
            };
            service
              .updateConfig({ data: res, tableKey: key, isDefault: true })
              .then((r) => {
                console.log("flashScreen disabled permanently", r);
                this.$store.commit("setAppSettings", res);
              });
          });
      }
    },
    getConfigData() {
      let key = this.generateKey("flashData");
      service
        .getSavedConfig({ tableKey: key, isDefault: true })
        .then((response) => {
          this.flashData = response.data;
          this.$emit("getFlashData", response.data);
          this.isFetched = true;
        })
        .catch(() => {
          this.isFetched = true;
        });
    },
  },
  created() {
    if (this.allFlashData.length) {
      this.flashData = this.allFlashData;
      this.isFetched = true;
    } else {
      this.getConfigData();
    }
  },
};
</script>

<style>
::v-deep #full-screen-modal > .modal-dialog {
  max-width: 100%;
}
::v-deep .modal-fullscreen1 .modal {
  padding: 0 !important;
}
::v-deep .modal-fullscreen1 .modal-dialog {
  max-width: 100%;
  height: 100%;
  margin: 0;
}
::v-deep .modal-fullscreen1 .modal-content {
  border: 0;
  border-radius: 0;
  min-height: 100%;
  height: auto;
}

.carousel-caption {
  position: static !important;
  text-align: left !important;
  color: var(--home-main-color) !important;
}

.carousel-indicators li {
  background-color: var(--home-main-color) !important;
}

.carousel-indicators {
  bottom: -30px !important;
}

.carousel-control-next {
  right: -69px !important;
}

.carousel-control-prev {
  left: -69px !important;
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  width: 15px !important;
  height: 15px !important;
}

.carousel-indicators li {
  width: 7px !important;
  height: 6px !important;
  border-radius: 50% !important;
}

.media-body p {
  margin-left: 11%;
}

.modal-xl .modal-footer {
  border-top: 0px solid transparent !important;
}
</style>
