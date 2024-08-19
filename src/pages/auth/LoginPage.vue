<!-- src/pages/Login.vue -->
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
        <div class="text-h6">Login</div>
      </q-card-section>
      <q-card-section>
        <q-input filled outlined v-model="email" label="Email" class="q-mb-sm">
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
          @keyup.enter="login"
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
      </q-card-section>
      <q-card-actions align="right" style="margin-top: -25px">
        <q-btn
          dense
          label="Forgot Password"
          no-caps
          flat
          @click="forgotPasswordFunc"
        />
      </q-card-actions>
      <q-card-actions align="left">
        <q-btn
          label="Login"
          color="primary"
          class="full-width"
          @click="login"
        />
      </q-card-actions>
      <!-- <q-card-actions align="center">
        <q-btn label="Sign Up" flat @click="goToSignUp" />
      </q-card-actions> -->
      <q-separator />
      <q-card-actions align="center">
        <p class="text-body">Or Login with</p>
      </q-card-actions>
      <q-card-actions align="center">
        <q-btn
          icon="mdi-google"
          label="Google"
          color="red-5"
          @click="loginWithGoogle"
        />
        <q-btn
          icon="mdi-facebook"
          label="Facebook"
          color="blue-5"
          @click="loginWithFacebook"
        />
      </q-card-actions>
      <q-card-actions class="q-mt-md">
        <q-btn label="Sign Up as Client" @click="goToSignUp" class="q-ml-sm" />
        <q-btn label="Sign Up as Doctor" @click="goToSignUpProf" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { auth, googleProvider, facebookProvider } from "src/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useRouter } from "vue-router";
import { useUserData } from "src/stores/users/userStore";
import { onMounted, reactive, ref } from "vue";
import { api, appUrl } from "src/boot/axios";
import { LocalStorage, useQuasar } from "quasar";

const userStore = useUserData();
const email = ref("");
const password = ref("");
const isPwd = ref(true);
const router = useRouter();

const $q = useQuasar();

const forgotPasswordFunc = () => {
  window.location = api.getUri() + "/v1/forgot-password";
};

const login = () => {
  userStore.loginUser([email.value, password.value]);
  // try {
  //   await signInWithEmailAndPassword(auth, this.email, this.password);
  //   router.push("/");
  // } catch (error) {
  //   console.error(error);
  // }
};

const loginWithGoogle = () => {
  // window.location.href = `${api.getUri()}/auth/google`;
  // const role = "professional";
  const clientId =
    "60490450875-cgial7iausra5fm6di3h88d35prf6pc5.apps.googleusercontent.com";

  const redirectUri = appUrl + "/login"; // google auth redirect
  const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email profile`;
  // console.log(redirectUri);

  window.location.href = authUrl;
};
const loginWithFacebook = () => {
  const clientId = "1478417299708606"; // Your actual Facebook App ID
  const redirectUri = appUrl + "/login"; // Must match the URI in your Facebook app settings
  const authUrl = `https://www.facebook.com/v10.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=email,public_profile`;

  window.location.href = authUrl;
};
const goToSignUp = () => {
  router.push("/register");
};

const goToSignUpProf = () => {
  router.push("/register-professional");

  // router.push("/register-professional");
};
const handleGoogleCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");
  const scope = urlParams.get("scope");
  const authuser = urlParams.get("authuser");
  const prompt = urlParams.get("prompt");
  const role = urlParams.get("role");
  // console.log(role);

  // local
  const redirectUri = appUrl + "/login";
  if (code) {
    $q.loading.show({ message: "Please wait..." });
    await api
      .get("/api/auth/google/login", {
        params: {
          code,
          state,
          scope,
          authuser,
          prompt,
          role,
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

          // window.location.href = appUrl;
        }, 3000);
      });
  }
};

const handleFacebookCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");

  // Local
  const redirectUri = appUrl + "/login";

  if (code) {
    $q.loading.show({ message: "Please wait..." });

    await api
      .get("/api/auth/facebook/login", {
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
