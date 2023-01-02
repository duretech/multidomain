<template>
  <div class="card position-relative placeholderchart">
    <loader class="cardLoader" />
    <div class="card-header px-2 py-1">
      <div class="row no-gutters">
        <div class="col-lg-8 p-t-4px">
          <div class="cardTitleSection text-wrap">
            <p class="title_p m-0 fs-19-1920">
              {{ $t("chartHeading") }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="card-body text-center" style="height: 450px;"></div>
  </div>
</template>