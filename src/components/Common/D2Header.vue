<template>
  <div class="" id="d2-header">
    <div class="header-with-logotext">
      <div class="header-with-logolink">
        <a @click="goToDashboard" class="ui_defaults_reset_fe0yv">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 182"
            class="jsx-3467673193"
            data-test="dhis2-uicore-logoiconwhite"
          >
            <defs></defs>
            <path
              fill="#ffffff"
              d="M191.73,60,109,6.34a19.73,19.73,0,0,0-20.32,0L8.31,58.43a12,12,0,0,0-.25,20.63L88.6,134a19.37,19.37,0,0,0,20.37.25l82.76-53.65a11.88,11.88,0,0,0,0-20.59Zm-91,61.45a4.29,4.29,0,0,1-3.49-.05l-77-52.49L97,19.13a4.76,4.76,0,0,1,3.74,0L179.6,70.28Z"
            ></path>
            <path
              fill="#ffffff"
              d="M88.66,47.82,45.1,76.06l13.61,9.33L97,60.61a4.76,4.76,0,0,1,3.74,0l39.37,25.52,14-9.06L109,47.82A19.76,19.76,0,0,0,88.66,47.82Z"
            ></path>
            <path
              fill="#ffffff"
              d="M191.73,101.46l-8.62-5.59-14.05,9.06,10.53,6.83-78.91,51.15a4.37,4.37,0,0,1-3.49,0l-77-52.5,10-6.47L16.55,94.57,8.31,99.91a12,12,0,0,0-.25,20.63L88.6,175.46a19.34,19.34,0,0,0,20.37.24l82.75-53.65a11.88,11.88,0,0,0,0-20.59Z"
            ></path>
          </svg>
        </a>
      </div>
    </div>
    <div class="header-heading">{{ heading }}</div>
    <div class="header-with-rightbarlinks">
      <div class="rightbarlinks-inner">
        <div class="rightbarlinks" @click="goToInterpretations">
          <svg
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            color="#ffffff"
          >
            <path
              d="M20 5a2 2 0 012 2v8a2 2 0 01-2 2h-1v3.826a1 1 0 01-1.65.759L12 17H7a2 2 0 01-2-2V7a2 2 0 012-2zm0 2H7v8h5.74L17 18.652V15h3zm-6-5v2H5a1 1 0 00-.993.883L4 5v7H2V5a3 3 0 012.824-2.995L5 2z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <div class="rightbarlinks" @click="goToMessages">
          <svg
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            color="#ffffff"
          >
            <path
              d="M19 5a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2zm0 3.414L13.414 14a2 2 0 01-2.701.117L10.586 14 5 8.415V17h14zM17.584 7H6.415L12 12.586z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <b-dropdown toggle-class="btn-bg-transparent" no-caret>
          <template #button-content>
            <svg
              height="24"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
              color="#ffffff"
            >
              <path
                d="M7 16a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2a1 1 0 011-1zm6 0a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2a1 1 0 011-1zm6 0a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2a1 1 0 011-1zM7 10a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2a1 1 0 011-1zm6 0a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2a1 1 0 011-1zm6 0a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2a1 1 0 011-1zM7 4a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1zm6 0a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V5a1 1 0 011-1zm6 0a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V5a1 1 0 011-1z"
                fill="currentColor"
                fill-rule="evenodd"
              ></path>
            </svg>
          </template>
          <b-dropdown-text
            class="text-center color-white font-14"
            style="width: 450px; max-height: 465px; height: 465px"
          >
            <div class="menubox-search">
              <div class="menubox-search-outer">
                <div class="menubox-search-inner">
                  <input
                    class="menubox-search-textbox"
                    v-model="searchme"
                    type="text"
                    @click="addSearchClass = !addSearchClass"
                    placeholder="Search apps"
                  />
                </div>
              </div>
              <span @click="goToAppManagement" class="pt-2 cursor-pointer">
                <svg
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                  color="#4a5768"
                >
                  <path
                    d="M13 2a2 2 0 012 2v1.674l.295.149c.103.055.204.112.304.172l.287.182 1.346-.775a2 2 0 012.649.6l.083.132 1 1.732a2 2 0 01-.732 2.732l-1.265.731.024.318L19 12c0 .223-.01.444-.031.664l-.027.225 1.29.745a2 2 0 01.805 2.594l-.073.138-1 1.732a2 2 0 01-2.732.732l-1.535-.886-.222.134c-.09.052-.182.102-.275.15l-.2.096V20a2 2 0 01-1.85 1.995L13 22h-2a2 2 0 01-2-2l-.001-1.676-.199-.097a6.986 6.986 0 01-.275-.15l-.223-.133-1.534.886a2 2 0 01-2.649-.6l-.083-.132-1-1.732a2 2 0 01.732-2.732l1.289-.745-.026-.225a7.05 7.05 0 01-.023-.331L5 12a7.1 7.1 0 01.009-.354l.023-.318-1.264-.73a2 2 0 01-.805-2.594l.073-.138 1-1.732a2 2 0 012.732-.732l1.344.776.288-.183c.1-.06.202-.117.305-.172l.294-.149L9 4a2 2 0 011.85-1.995L11 2zm0 2h-2v3.049l-.667.235a4.991 4.991 0 00-1.515.86l-.536.442-2.514-1.452-1 1.732 2.475 1.429L7.1 11a5.028 5.028 0 00.038 2.172l.174.726-2.544 1.468 1 1.732 2.66-1.536.53.407c.417.32.88.572 1.375.747l.667.235V20h2v-3.049l.667-.235a4.987 4.987 0 001.374-.747l.53-.407 2.661 1.536 1-1.732-2.544-1.468.174-.726A5.016 5.016 0 0016.9 11l-.142-.705 2.474-1.43-1-1.732-2.515 1.45-.535-.441a4.991 4.991 0 00-1.515-.859L13 7.05zm-1 5a3 3 0 110 6 3 3 0 010-6zm0 2a1 1 0 100 2 1 1 0 000-2z"
                    fill="currentColor"
                  ></path>
                </svg>
              </span>
            </div>
            <div
              class="menubox-appsbox"
              style="height: 400px; overflow-x: hidden; overflow-y: auto"
            >
              <div
                class="row menubox-appsbox-rows"
                v-for="i in Math.ceil(menuArray.length / 3)"
                :value="i"
                :key="i"
              >
                <a
                  :href="menu.defaultAction"
                  class="menubox-app-link"
                  v-for="menu in menuArray.slice((i - 1) * 3, i * 3)"
                  :value="menu"
                  :key="menu"
                >
                  <img
                    :src="getImgUrl(menu.icon)"
                    alt="app logo"
                    class="menubox-app-logo"
                  />
                  <div class="menubox-app-label">
                    {{ menu.displayName != "" ? menu.displayName : menu.name }}
                  </div>
                </a>
              </div>
            </div>
          </b-dropdown-text>
        </b-dropdown>
        <b-dropdown
          id="icon-profile"
          class="header-profile"
          no-caret
          menu-class="p-0"
          toggle-class="btn-bg-transparent p-0"
        >
          <template #button-content>
            {{ profileInitials }}
          </template>
          <b-dropdown-text
            class="text-center color-white font-14"
            style="width: 340px"
          >
            <div class="profilebox-upper d-flex">
              <div class="profilebox-upper-left">
                <div class>{{ profileInitials }}</div>
              </div>
              <div class="profilebox-upper-right">
                <div class="profilename">{{ profileName }}</div>
                <div class="profilemail">{{ profieEmail }}</div>
                <a
                  class="editprofile"
                  href="../../../dhis-web-user-profile/#/profile"
                  >{{ $t("editProfile") }}</a
                >
              </div>
            </div>
            <div
              class
              style="margin: 13px 0px 7px; border-top: 1px solid lightgrey"
            ></div>
            <ul class="profile-links">
              <li class="profile-links-list">
                <svg
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                  color="#4a5768"
                >
                  <path
                    d="M13 2a2 2 0 012 2v1.674l.295.149c.103.055.204.112.304.172l.287.182 1.346-.775a2 2 0 012.649.6l.083.132 1 1.732a2 2 0 01-.732 2.732l-1.265.731.024.318L19 12c0 .223-.01.444-.031.664l-.027.225 1.29.745a2 2 0 01.805 2.594l-.073.138-1 1.732a2 2 0 01-2.732.732l-1.535-.886-.222.134c-.09.052-.182.102-.275.15l-.2.096V20a2 2 0 01-1.85 1.995L13 22h-2a2 2 0 01-2-2l-.001-1.676-.199-.097a6.986 6.986 0 01-.275-.15l-.223-.133-1.534.886a2 2 0 01-2.649-.6l-.083-.132-1-1.732a2 2 0 01.732-2.732l1.289-.745-.026-.225a7.05 7.05 0 01-.023-.331L5 12a7.1 7.1 0 01.009-.354l.023-.318-1.264-.73a2 2 0 01-.805-2.594l.073-.138 1-1.732a2 2 0 012.732-.732l1.344.776.288-.183c.1-.06.202-.117.305-.172l.294-.149L9 4a2 2 0 011.85-1.995L11 2zm0 2h-2v3.049l-.667.235a4.991 4.991 0 00-1.515.86l-.536.442-2.514-1.452-1 1.732 2.475 1.429L7.1 11a5.028 5.028 0 00.038 2.172l.174.726-2.544 1.468 1 1.732 2.66-1.536.53.407c.417.32.88.572 1.375.747l.667.235V20h2v-3.049l.667-.235a4.987 4.987 0 001.374-.747l.53-.407 2.661 1.536 1-1.732-2.544-1.468.174-.726A5.016 5.016 0 0016.9 11l-.142-.705 2.474-1.43-1-1.732-2.515 1.45-.535-.441a4.991 4.991 0 00-1.515-.859L13 7.05zm-1 5a3 3 0 110 6 3 3 0 010-6zm0 2a1 1 0 100 2 1 1 0 000-2z"
                    fill="currentColor"
                  >
                    settings
                  </path>
                </svg>
                <a
                  class="profile-links-list-content"
                  href="../../../dhis-web-user-profile/#/settings"
                  >{{ $t("settings") }}</a
                >
              </li>
              <li class="profile-links-list">
                <svg
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                  color="#4a5768"
                >
                  <path
                    d="M14 12a6 6 0 016 6v3H4v-3a6 6 0 016-6zm0 2h-4a4 4 0 00-3.995 3.8L6 18v1h12v-1a4 4 0 00-3.8-3.995zM12 3a4 4 0 110 8 4 4 0 010-8zm0 2a2 2 0 100 4 2 2 0 000-4z"
                    fill="currentColor"
                  >
                    account_box
                  </path>
                </svg>
                <a
                  class="profile-links-list-content"
                  href="../../../dhis-web-user-profile/#/account"
                  >{{ $t("acc") }}</a
                >
              </li>
              <li class="profile-links-list">
                <svg
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                  color="#4a5768"
                >
                  <path
                    d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16zm0 12a1 1 0 110 2 1 1 0 010-2zm0-10a4 4 0 011.155 7.83l-.155.043V15h-2v-3h1a2 2 0 10-1.995-2.15L10 10H8a4 4 0 014-4z"
                    fill="currentColor"
                  >
                    help
                  </path>
                </svg>
                <a
                  class="profile-links-list-content"
                  href="https://docs.dhis2.org/master/en/user/html/dhis2_user_manual_en.html"
                  >{{ $t("help") }}</a
                >
              </li>
              <li class="profile-links-list mx-1">
                <svg
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                  color="#4a5768"
                >
                  <path
                    d="M10 12c1.777 0 3.374.773 4.472 2H8a4 4 0 00-3.995 3.8L4 18v2h12v2H2v-4a6 6 0 016-6zm8.613 1.21l.094.083 3 3a1 1 0 01.083 1.32l-.083.094-3 3a1 1 0 01-1.497-1.32l.083-.094L18.585 18H12a1 1 0 01-.117-1.993L12 16h6.585l-1.292-1.293a1 1 0 01-.083-1.32l.083-.094a1 1 0 011.32-.083zM9 3a4 4 0 110 8 4 4 0 010-8zm0 2a2 2 0 100 4 2 2 0 000-4z"
                    fill="currentColor"
                  >
                    exit_to_app
                  </path>
                </svg>
                <a
                  class="profile-links-list-content mx-2"
                  href="../../../dhis-web-commons/security/login.action"
                  >{{ $t("logout") }}</a
                >
              </li>
            </ul>
          </b-dropdown-text>
        </b-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "d2headerBar",
  data() {
    return {
      heading: "",
      profileApi: "me",
      dashboard: "dhis-web-dashboard",
      interpretations: "dhis-web-interpretation",
      messages: "dhis-web-messaging",
      systemSettings: "systemSettings",
      installedApps: "dhis-web-commons/menu/getModules.action",
      appManagement: "",
      hidden: true,
      menuHidden: true,
      profileName: "",
      profieEmail: "",
      profileInitials: "",
      menuArray: [],
      tempArray: [],
      searchme: "",
      addSearchClass: false,
    };
  },
  watch: {
    searchme: function (v) {
      //   this.temp = [...this.menuArray];
      this.menuArray = this.tempArray.filter(function (menu) {
        if (menu.displayName != "") {
          if (menu.displayName.toLowerCase().includes(v)) return menu;
        } else {
          if (menu.name.toLowerCase().includes(v)) return menu;
        }
      });
    },
  },
  methods: {
    findApplicationTitle: function () {
      axios
        .get("../../" + this.systemSettings + ".json?key=applicationTitle")
        .then((response) => {
          this.heading = response.data.applicationTitle;
        });
    },
    findProfileDetails: function () {
      axios.get("../../" + this.profileApi + ".json").then((response) => {
        this.profileName = response.data.displayName;
        response.data.email !== undefined
          ? (this.profieEmail = response.data.email)
          : (this.profieEmail = "Email not provided");
        this.profileInitials =
          this.profileName.split(" ")[0].substring(0, 1).toUpperCase() +
          this.profileName.split(" ")[1].substring(0, 1).toUpperCase();
      });
    },
    findApps: function () {
      // axios
      //   .get(
      //     "https://avenirtraining.duredemos.com/multidomain_service/" +
      //       this.installedApps,
      //     {
      //       headers: {
      //         "Cache-Control": "no-cache",
      //         Authorization: process.env.VUE_APP_BASIC_AUTH,
      //       },
      //     }
      //   )
      //   .then((response) => {
      axios.get("../../../" + this.installedApps).then((response) => {
        var vm = this;
        for (let i = 0; i < response.data.modules.length; i++) {
          if (response.data.modules[i].name != "dhis-web-menu-management") {
            let path = response.data.modules[i].defaultAction;
            vm.menuArray.push({
              displayName: response.data.modules[i].displayName,
              name: response.data.modules[i].name,
              icon: response.data.modules[i].icon,
              defaultAction: path.includes("https://") || path.includes("http://") ? path : "../../" + path,
            });
            vm.tempArray = [...vm.menuArray];
          } else {
            this.appManagement = response.data.modules[i].defaultAction;
          }
        }
      });
    },
    getImgUrl: function (path) {
      return path.includes("https://") || path.includes("http://")
        ? path
        : "../../" + path;
    },
    goToDashboard: function () {
      window.location.href = "../../../" + this.dashboard;
    },
    goToInterpretations: function () {
      window.location.href = "../../../" + this.interpretations;
    },
    goToMessages: function () {
      window.location.href = "../../../" + this.messages;
    },
    goToAppManagement: function () {
      window.location.href = "../../" + this.appManagement;
    },
  },
  mounted() {
    if (process.env.NODE_ENV === "production") {
      this.findApplicationTitle();
      this.findProfileDetails();
      this.findApps();
    }
  },
};
</script>
<style scoped>
#d2-header {
  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
  background-color: rgb(44, 102, 147);
  height: 50px;
  top: 0px;
  left: 0px;
  right: 0;
  width: 100%;
  z-index: 1000;
  max-height: 60px;
  position: fixed;
}
#d2-header a {
  color: rgb(33, 41, 52) !important;
  font-size: 15px;
  padding-top: 1%;
  cursor: pointer;
}

.profile-box a {
  color: rgba(0, 0, 0, 0.87) !important;
  font-size: 12px !important;
  line-height: 14px !important;
  text-decoration: underline !important;
  cursor: pointer;
}
#icon-profile {
  padding: 1px !important;
  text-align: center;
}
.profile-links a {
  display: inline-flex;
  -webkit-box-flex: 1;
  flex-grow: 1;
  -webkit-box-align: center;
  align-items: center;
  text-decoration: none !important;
  color: inherit !important;
  font-size: 14px !important;
  line-height: 16px !important;
  padding-top: 0% !important;
  font-weight: 400 !important;
}
.header-with-logolink {
  padding: 4px;
  min-width: 48px;
  max-width: 250px;
  height: 48px;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  overflow: hidden;
}
.header-with-logotext {
  box-sizing: border-box;
  min-width: 49px;
  max-height: 48px;
  margin: 0px 12px 0px 0px;
  border-right: 1px solid rgba(32, 32, 32, 0.15);
}
.logo {
  width: 35px;
  height: 35px;
}
.header-heading {
  padding: 8px;
  color: var(--main-theme-white-color);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.01em;
  white-space: nowrap;
}
.header-with-rightbarlinks {
  width: 50%;
}
.header-profile {
  border-radius: 50%;
  width: 35px;
  color: var(--main-theme-white-color);
  height: 35px;
  padding: 5px 6px !important;
  background-color: rgba(0, 0, 0, 0.3);
}
.rightbarlinks {
  margin: auto 0.8rem;
  color: var(--main-theme-white-color);
  display: inline-block;
  vertical-align: -webkit-baseline-middle;
  text-align: -webkit-center;
  cursor: pointer;
}
.rightbarlinkss {
  margin-right: 15px;
  display: inline-block;
  margin-left: 15px;
  cursor: pointer;
  vertical-align: -webkit-baseline-middle;
}
.rightbarlinks-inner {
  width: fit-content;
  float: right;
  /* margin: 0 20px; */

  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  padding: 18px;
}
i {
  font-size: 26px !important;
}
.profile-box {
  z-index: 1000;
  position: relative;
  top: 45px;
}
.profile-box-inner {
  width: 50%;
  right: 6px !important;
  position: absolute;
  background: var(--main-theme-white-color);
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.14), 0 2px 2px 0 rgba(0, 0, 0, 0.12),
    0 1px 3px 0 rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  transition: all 1s;
}
.profilebox-upper {
  color: var(--color-black) !important;
  text-align: left;
}
.profilebox-upper-right {
  display: inline-block;
  margin: 10px 15px;
}
.profilebox-upper-left {
  display: inline-block;
  margin: 15px 20px;
  vertical-align: top;
  width: 50px;
  font-size: 20px;
  padding: 10px 12px;
  height: 50px;
  background: var(--text-subfont-color);
  border-radius: 50%;
}
.editprofile {
  color: rgba(0, 0, 0, 0.87) !important;
  font-size: 12px !important;
  line-height: 14px !important;
  text-decoration: underline !important;
  cursor: pointer !important;
}

.profilemail {
  font-size: 14px;
}
.profilename {
  font-weight: 300;
}

ul.profile-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

ul.profile-links li {
  display: flex;
  padding: 12px;
  align-items: center;
  justify-content: center;
  -webkit-box-align: stretch;
  align-items: stretch;
  cursor: pointer;
  list-style: none;
  background-color: rgb(255, 255, 255);
  color: rgb(33, 41, 52);
  fill: rgb(33, 41, 52);
  font-size: 14px;
  line-height: 16px;
  user-select: none;
}

ul.profile-links li:hover {
  background: var(--text-nine-color);
  cursor: pointer;
}
.profile-links-list-content {
  margin: 0 10px;
}
.menubox-outer {
  width: 100%;
  position: relative;
  top: 45px;
}
.menubox-inner {
  background: var(--main-theme-white-color);
  position: absolute;
  z-index: 9999;
  float: right;
  width: 65%;
  max-height: 380px;
  right: 100px;
  overflow: auto;
  user-select: text;
  color: rgb(33, 41, 52);
  background-color: var(--main-theme-white-color);
  padding: 12px 11px 10px;
  outline: 0px;
  border: 1px solid rgb(160, 173, 186);
  border-radius: 3px;
  box-shadow: rgb(48 54 60 / 10%) 0px 0px 1px 0px inset;
  text-overflow: ellipsis;
}
.row.menubox-appsbox-rows {
  margin: 0;
  padding: 10px;
  text-align: center;
}
a.menubox-app-link {
  display: inline-block;
  width: 33%;
  padding: 7px;
  color: var(--text-color);
  font-size: 14px;
  font-family: roboto;
}
a.menubox-app-link:hover {
  background-color: var(--text-nine-color);
  text-decoration: none;
}
.menubox-app-logo {
  vertical-align: middle;
  width: 50px;
  height: 50px;
  border-style: none;
}
.menubox-app-label {
  margin-top: 8px;
  line-height: 20px;
}
.menubox-search {
  display: inline-flex;
  /* width: 100%; */
  width: 95%;
  /* padding-top: 10px; */
}
.settings-icon {
  color: var(--text-subfont-color);
  margin: 7px 4px;
  cursor: pointer;
}
.menubox-search-textbox {
  box-sizing: border-box;
  font-size: 14px;
  line-height: 16px;
  user-select: text;
  color: rgb(33, 41, 52);
  background-color: var(--main-theme-white-color);
  padding: 12px 11px 10px;
  outline: 0px;
  border: 1px solid rgb(160, 173, 186);
  border-radius: 3px;
  box-shadow: rgb(48 54 60 / 10%) 0px 0px 1px 0px inset;
  text-overflow: ellipsis;
  width: 100%;
}
.menubox-search-outer {
  /* width: 94%; */
  width: 95%;
}
.menubox-search-inner {
  /* display: flex; */
  width: 95%;
  /* padding: 5px; */
  /* border-radius: 7px; */
  /* margin: 0 10px; */
  /* background: #f7f7f7; */
  /* border-bottom: 2px solid lightgray; */
}
.searchlabeltranslate {
  transform: translate(-5px, -10px) scale(0.75);
}
.menubox-search-label {
  color: var(--text-subfont-color);
}
.menubox-search-cancel {
  position: relative;
  left: 70%;
  cursor: pointer;
}
input.menubox-search-textbox:focus {
  outline: none;
}
svg.jsx-3467673193 {
  height: 25px;
  width: 27px;
}
</style>