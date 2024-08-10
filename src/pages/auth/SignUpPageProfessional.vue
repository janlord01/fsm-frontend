<!-- src/pages/SignUp.vue -->
<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md shadow-1">
      <q-card-section>
        <img
          alt="Quasar logo"
          src="~assets/images/logo.png"
          style="width: 300px"
        />
      </q-card-section>
      <q-card-section>
        <div class="text-h6">Sign Up As Doctor</div>
      </q-card-section>
      <q-card-section>
        <q-input
          filled
          outlined
          v-model="name"
          label="Name"
          type="text"
          class="q-mb-sm"
        >
          <template v-slot:prepend>
            <q-icon name="eva-person-outline" />
          </template>
        </q-input>
        <q-input
          filled
          outlined
          v-model="email"
          label="Email"
          type="email"
          class="q-mb-sm"
        >
          <template v-slot:prepend>
            <q-icon name="eva-email-outline" />
          </template>
        </q-input>
        <q-input
          filled
          outlined
          v-model="password"
          label="Password"
          :type="isPwd ? 'password' : 'text'"
          class="q-mb-sm"
        >
          <template v-slot:prepend>
            <q-icon name="password" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <q-input
          filled
          outlined
          v-model="password_confirmation"
          label="Password Confimation"
          :type="isPwdCon ? 'password' : 'text'"
        >
          <template v-slot:prepend>
            <q-icon name="password" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="isPwdCon ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwdCon = !isPwdCon"
              @keyup.enter="signUp"
            />
          </template>
        </q-input>
      </q-card-section>
      <q-card-actions align="left" class="q-mb-md">
        <q-btn
          label="Sign Up"
          color="primary"
          class="full-width"
          @click="signUp"
        />
      </q-card-actions>

      <q-separator />

      <q-card-actions align="center">
        <p class="text-body">Or sign up with</p>
      </q-card-actions>
      <q-card-actions align="center">
        <q-btn
          icon="mdi-google"
          label="Google"
          color="red-5"
          @click="signUpWithGoogle"
        />
        <q-btn
          icon="mdi-facebook"
          label="Facebook"
          color="blue-5"
          @click="signUpWithFacebook"
        />
      </q-card-actions>
      <q-card-actions align="center">
        <q-btn flat label="Login" color="primary" to="/login" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { auth, googleProvider, facebookProvider } from "src/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useRouter } from "vue-router";
import { useUserData } from "src/stores/users/userStore";
import { reactive, ref, onMounted } from "vue";
import { api, appUrl } from "src/boot/axios";

import { LocalStorage, useQuasar } from "quasar";

const $q = useQuasar();
const router = useRouter();
const userStore = useUserData();
const name = ref("");
const email = ref("");
const password = ref("");
const password_confirmation = ref("");
const isPwd = ref(true);
const isPwdCon = ref(true);

const signUp = () => {
  userStore.registerUser([
    name.value,
    email.value,
    password.value,
    password_confirmation.value,
    "professional",
  ]);
  // try {
  //   await createUserWithEmailAndPassword(auth, this.email, this.password);
  //   router.push("/");
  // } catch (error) {
  //   console.error(error);
  // }
};

const signUpWithGoogle = async () => {
  const clientId =
    "60490450875-cgial7iausra5fm6di3h88d35prf6pc5.apps.googleusercontent.com";
  /**
   * this run @ port :9002 if you run
   * other port make sure you change redirect to google API
   */
  const redirectUri = appUrl + "/register-professional"; // google auth redirect
  // console.log(redirectUri);
  const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email profile`;

  window.location.href = authUrl;
};

const signUpWithFacebook = async () => {
  const clientId = "1478417299708606"; // Your actual Facebook App ID
  const redirectUri = appUrl + "/register-professional"; // Must match the URI in your Facebook app settings
  const authUrl = `https://www.facebook.com/v10.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=email,public_profile`;

  window.location.href = authUrl;
};

const handleFacebookCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");

  // Local
  const redirectUri = appUrl + "/register-professional";

  if (code) {
    $q.loading.show({ message: "Please wait..." });

    await api
      .get("/api/auth/facebook/register/professional", {
        params: {
          code,
          state,
          redirectUri,
        },
      })
      .then((response) => {
        console.log(response);
        if (response.data.status == 200) {
          setTimeout(() => {
            LocalStorage.set("jwt", response.data.token);
            window.location = "/dashboard";
            $q.loading.hide();
          }, 500);
        } else {
          setTimeout(() => {
            $q.notify({
              position: "top",
              type: "negative",
              timeout: 5000,
              message: "Failed to authenticate with Facebook",
            });

            $q.loading.hide();

            window.location.href = appUrl;
          }, 3000);
        }
      })
      .catch((error) => {
        console.log(error);
        setTimeout(() => {
          $q.notify({
            position: "top",
            type: "negative",
            timeout: 5000,
            message:
              "Something went wrong, please contact your software engineers!",
          });

          $q.loading.hide();

          // window.location.href = appUrl;
        }, 3000);
      });
  }
};

const handleGoogleCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");
  const scope = urlParams.get("scope");
  const authuser = urlParams.get("authuser");
  const prompt = urlParams.get("prompt");

  /**
   * this run @ port :9002 if you run
   * other port make sure you change redirect to google API
   */
  // local

  const redirectUri = appUrl + "/register-professional";

  // production
  // const redirectUri = "http://localhost:9002/register";

  // console.log(role);
  if (code) {
    $q.loading.show({ message: "Please wait..." });
    await api
      .get("/api/auth/google/register/professional", {
        params: {
          code,
          state,
          scope,
          authuser,
          prompt,
          redirectUri,
          // role,
        },
      })
      .then((response) => {
        console.log(response);
        if (response.data.status == 200) {
          setTimeout(() => {
            LocalStorage.set("jwt", response.data.token);
            window.location = "/dashboard";
            $q.loading.hide();
          }, 500);
        } else {
          setTimeout(() => {
            $q.notify({
              position: "top",
              type: "negative",
              timeout: 5000,
              message: "Failed to authenticate with Google",
            });

            $q.loading.hide();
            window.location.href = appUrl;
          }, 3000);
        }
      })
      .catch((error) => {
        console.log(error);
        setTimeout(() => {
          $q.notify({
            position: "top",
            type: "negative",
            timeout: 5000,
            message:
              "Something went wrong, pleae contact your software engineers!",
          });

          $q.loading.hide();
        }, 3000);
      });
  }
};

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);

  const code = urlParams.get("code");
  const scope = urlParams.get("scope");

  // Check if 'scope' includes Google-specific scopes
  const isGoogle = scope && scope.includes("googleapis.com");

  // If there's a 'code' parameter and no Google-specific scope, it's likely Facebook
  const isFacebook = code && !isGoogle;

  if (isGoogle) {
    handleGoogleCallback();
  } else if (isFacebook) {
    handleFacebookCallback();
  }
});
</script>
