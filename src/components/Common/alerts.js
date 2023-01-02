import Vue from "vue";

const genericAlert = (title = null, text = null) => {
  let alertObj = {};
  if (title) {
    alertObj.title = title;
  }
  if (text) {
    alertObj.text = text;
  }
  Vue.swal(alertObj);
};

export { genericAlert };
