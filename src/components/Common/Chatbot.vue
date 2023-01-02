<template>
  <div>
    <div class="chatbot-floating-icon" v-b-modal.chatbot-modal>
      <div class="chatbot-icon-div">
        <img
          :src="require('@/assets/images/bot.png')"
          class="img-fluid logo-img"
        />
      </div>
    </div>
    <div class="chatbot-modal-popup">
      <b-modal id="chatbot-modal" title="">
        <div class="chatbot-modal-content">
          <div class="chatbot-modal-header">
            <b-row>
              <b-col sm="4">
                <div class="chatbot-icon-div">
                  <img
                    :src="require('@/assets/images/bot.png')"
                    class="img-fluid logo-img"
                  />
                </div>
              </b-col>
              <b-col sm="8">
                <h4 class="chatbot-heading">Hi! welcome.</h4>
                <p class="chatbot-heading-text">
                  Hi! I'm Enbo :), at your service to introduce the Best in
                  Class Customer Experience platform
                </p>
              </b-col>
            </b-row>
            <div class="close-btn">
              <a @click="$bvModal.hide('chatbot-modal')"
                ><i class="fa fa-times" aria-hidden="true"></i
              ></a>
            </div>
          </div>
          <div class="chatbot-modal-body">
            <b-container fluid>
              <b-row class="mb-3">
                <b-col>
                  <div class="chat-user-div">
                    <p>Lorem Ipsum is simply dummy text</p>
                  </div>
                  <span class="date-time-span d-block float-right mt-1">
                    <small>{{ currentDate }}</small>
                  </span>
                </b-col>
              </b-row>
              <b-row class="mb-3">
                <b-col class="d-flex">
                  <div class="chatbot-icon-div mr-2">
                    <img
                      :src="require('@/assets/images/bot.png')"
                      class="img-fluid logo-img"
                    />
                  </div>
                  <div>
                    <div class="chat-receiver-div">
                      <p>
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry.
                      </p>
                    </div>
                    <span class="date-time-span d-block float-left mt-1">
                      <small>{{ currentDate }}</small>
                    </span>
                  </div>
                </b-col>
              </b-row>
            </b-container>
          </div>
          <div class="chatbot-modal-footer">
            <div class="chatbot-modal-footer-wrap">
              <b-container fluid>
                <b-row>
                  <b-col
                    sm="1"
                    class="d-flex justify-content-center align-items-center"
                  >
                    <a
                      ><i
                        class="fa fa-bars chatbot-modal-footer-icon"
                        aria-hidden="true"
                      ></i
                    ></a>
                  </b-col>
                  <b-col sm="11" class="">
                    <div>
                      <b-input-group>
                        <b-form-input
                          placeholder="Type your message here"
                        ></b-form-input>
                        <b-input-group-append>
                          <b-button size="sm" text="Button" variant="success"
                            ><i class="fa fa-paper-plane" aria-hidden="true"></i
                          ></b-button>
                        </b-input-group-append>
                      </b-input-group>
                    </div>
                  </b-col>
                  <b-col
                    sm="1"
                    class="d-none justify-content-center align-items-center"
                  >
                    <a
                      ><i
                        class="fa fa-microphone chatbot-modal-footer-icon"
                        aria-hidden="true"
                      ></i
                    ></a>
                  </b-col>
                </b-row>
              </b-container>
            </div>
          </div>
        </div>
      </b-modal>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentDate: this.$moment(new Date()).format("lll"),
    };
  },
};
</script>
