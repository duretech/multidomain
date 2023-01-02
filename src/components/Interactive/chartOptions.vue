<template>
  <div class="col-6">
    <div class="row no-gutters">
      <div class="col text-center">
        <a
          class="cursor-pointer"
          @click="bookmark"
          data-toggle="tooltip"
          data-placement="top"
          :title="$t('saveChartAsFav')"
          v-b-tooltip.hover
        >
          <!-- <img alt="img" :src="require('@/assets/img/icons/bookmark-tag.svg')" class="img bookmarktag-img"> -->
          <img
            alt="img"
            :src="require('@/assets/img/icons/bookmark_new.png')"
            class="img imgWidth_20px"
          />
          <img
            alt="img"
            :src="
              require('@/assets/img/icons/bookmark_new_active_white.png')
            "
            class="img imgWidth_20px d-none"
          />
        </a>
      </div>
      <div class="col text-center">
        <div class="dropdown">
          <a
            class="dropdown-toggle"
            href="#"
            role="button"
            id="dropdownChartExportOptionsLink"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            :title="$t('downloadIcon')"
            v-b-tooltip.hover
          >
            <!-- <img :src="require('@/assets/img/icons/export.png')" class="img"> -->
            <img
              alt="img"
              :src="require('@/assets/img/icons/download_new.png')"
              class="img imgWidth_15px"
            />
            <img
              alt="img"
              :src="require('@/assets/img/icons/download_new_active.png')"
              class="img d-none"
            />
          </a>
          <div
            class="dropdown-menu dropdown-menu-right"
            id="dropdownChartExportOptions"
            aria-labelledby="dropdownChartExportOptionsLink"
          >
            <div class="card bg-transparent">
              <div class="card-body p-0px">
                <ul class="list-group">
                  <li
                    v-if="chartType !== 'table'"
                    class="list-group-item bg-transparent color-white"
                    @click.prevent.stop="exportChart('png')"
                  >
                    <a href="#" class="color-white">
                      <div class="row no-gutters">
                        <div class="col-lg-10">
                          <p class="m-0px">PNG</p>
                        </div>
                        <div class="col-lg-2">
                          <p class="m-0px">
                            <i class="fa fa-file-powerpoint-o"></i>
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li
                    v-if="chartType !== 'table'"
                    class="list-group-item bg-transparent color-white"
                    @click.prevent.stop="exportChart('jpg')"
                  >
                    <a href="#" class="color-white">
                      <div class="row no-gutters">
                        <div class="col-lg-10 text-left">
                          <p class="m-0px">JPG</p>
                        </div>
                        <div class="col-lg-2">
                          <p class="m-0px">
                            <i class="fa fa-file-image-o"></i>
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li
                    v-if="chartType !== 'table'"
                    class="list-group-item bg-transparent color-white"
                    @click.prevent.stop="exportChart('pdf')"
                  >
                    <a href="#" class="color-white">
                      <div class="row no-gutters">
                        <div class="col-lg-10 text-left">
                          <p class="m-0px">PDF</p>
                        </div>
                        <div class="col-lg-2">
                          <p class="m-0px">
                            <i class="fa fa-file-pdf-o"></i>
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li
                    v-if="chartType === 'table'"
                    class="list-group-item bg-transparent color-white"
                  >
                    <download-csv
                      class="btn color-white cursor-pointer w-100 p-0"
                      :data="table.items"
                    >
                      <a href="#" class="color-white">
                        <div class="row no-gutters">
                          <div class="col-lg-10 text-left">
                            <p class="m-0px">CSV</p>
                          </div>
                          <div class="col-lg-2">
                            <p class="m-0px">
                              <i class="fa fa-file"></i>
                            </p>
                          </div>
                        </div>
                      </a>
                    </download-csv>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["chartOptions", "table", "chartType"],
  methods: {
    //This is to eport chart
    exportChart(type) {
      this.$emit("exportChart", type);
    },
    //This is to sort chart data
    sortData(type) {
      this.$emit("sortData", type);
    },
    //This is to make chart bookmark
    bookmark() {
      this.$emit("bookmark");
    },
  },
};
</script>
