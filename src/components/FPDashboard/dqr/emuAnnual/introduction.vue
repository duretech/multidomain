<template>
  <div class="modal-dialog modal-dialog-scrollable modal-xl" role="document">
    <div class="modal-content">
      <div
        class="modal-header"
        style="background-color: #212121; color: #fff; padding: 12px"
      >
        <h5
          class="modal-title"
          id="exampleModalScrollableTitle"
          style="font-size: 1rem"
        >
          {{ $t("introduction") }}
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
        <h5 class="m-0 color-dark-blue font-weight-bold">
          {{ $t("intro_1") }}
        </h5>
        <p class="m-0 color-dark-blue font-weight-bold">
          {{ $t("intro_2") }}
        </p>
        <p class="m-0 m-t-20px">
          {{ $t("intro_3") }}
        </p>
        <p class="m-0 m-t-20px">
          {{ $t("intro_4") }}
        </p>
        <p class="m-0 m-t-20px">
          {{ $t("intro_5") }}
        </p>
        <p class="m-0 m-t-20px">
          {{ $t("intro_6") }}
        </p>
        <p class="m-0">{{ $t("intro_7") }}</p>
        <p class="m-0 m-t-20px">
          {{ $t("intro_8") }}
        </p>
        <p class="m-0 m-t-20px color-dark-blue font-weight-bold">
          {{ $t("intro_9") }}
        </p>
        <p class="m-0 m-t-20px">
          {{ $t("intro_10") }}
        </p>
        <p class="m-0 m-t-20px">
          {{ $t("intro_11") }}
        </p>
        <p class="m-0 m-t-20px">
          {{ $t("intro_12") }}
        </p>
        <p class="m-0 m-t-20px">
          {{ $t("intro_13") }}
        </p>
        <p class="m-0">
          {{ $t("intro_14") }}
        </p>
        <p class="m-0 m-l-20px">
          {{ $t("intro_15") }}
        </p>
        <p class="m-0">
          {{ $t("intro_16") }}
        </p>
        <p class="m-0 m-l-20px m-b-40px">
          {{ $t("intro_17") }}
        </p>
      </div>
    </div>
  </div>
</template>