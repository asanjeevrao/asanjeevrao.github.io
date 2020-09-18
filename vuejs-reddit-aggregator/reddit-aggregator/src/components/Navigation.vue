<template>
  <div>
    <div class="header">
      <h2 id="page-title">Reddit Aggregator</h2>
      <!--<div class="logo">
        <img src="../assets/Reddit Aggregator.png" alt="" />
      </div>
-->
      <div v-if="!authenticated" @click="login" class="login-button">
        <!--
        <img
          src="https://icon-library.net//images/sign-in-with-google-icon/sign-in-with-google-icon-3.jpg"
          width="150"
        />
        -->
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="18px"
          height="18px"
          viewBox="0 0 48 48"
          class="abcRioButtonSvg"
          style="padding:1px"
        >
          <g>
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            ></path>
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            ></path>
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            ></path>
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            ></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </g>
        </svg>
        <div id="sign-in-with-google">
          <span class="full-text">Sign In with Google</span>
          <span class="short-text">Sign In</span>
        </div>
      </div>
      <div v-if="authenticated" class="logged-in">
        <p class="user-name">Hi, {{ user.data.displayName.split(" ")[0] }}</p>
        <div @click="logout" class="logout-button"><span>Logout</span></div>
        <button v-if="!user.emailSub" @click="toggleSub">email sub</button>
        <button v-else @click="toggleSub">email unsub</button>
      </div>
    </div>
  </div>
</template>

<script>
import { firebaseLogin } from "../firebaseConfig.js";

export default {
  props: ["user"],
  computed: {
    authenticated() {
      return this.user.loggedIn;
    },
  },
  methods: {
    login() {
      firebaseLogin.login();
    },

    logout() {
      firebaseLogin.logout();
    },
    toggleSub() {
      this.$emit("toggle-email-setting");
      console.log("toggle event emitted");
    },
  },
};
</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.logged-in {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logout-button {
  box-shadow: inset 0 0 0 1px #ddd;
  height: 30px;
  width: 100px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9em;
}

.user-name {
  margin-bottom: 0px;
  margin-right: 10px;
}

.login-button {
  cursor: pointer;
  display: flex;
  height: 30px;
  width: 100px;
  box-shadow: inset 0 0 0 1px #ddd;
  align-items: center;
  justify-content: center;
}

#sign-in-with-google {
  font-size: 0.9em;
  padding-left: 5px;
}

h2 {
  font-weight: 400 !important;
}

img {
  max-width: 100%;
  height: auto;
}

.logo {
  max-width: 30%;
}

#page-title {
  font-size: 1.4em;
}

.full-text {
  display: none;
}

@media only screen and (min-width: 600px) {
  .login-button {
    height: 50px;
    width: 180px;
  }

  #page-title {
    font-size: 2em;
  }
  .full-text {
    display: inline-block;
  }
  .short-text {
    display: none;
  }
}

/*.login-logout-button {
}
*/
</style>
