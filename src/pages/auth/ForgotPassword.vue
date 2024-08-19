<!-- src/pages/ForgotPassword.vue -->
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
        <div class="text-h6">Forgot Password</div>
      </q-card-section>
      <q-card-section>
        <q-input filled outlined v-model="email" label="Email" class="q-mb-sm">
          <template v-slot:prepend>
            <q-icon name="eva-email-outline" />
          </template>
        </q-input>
      </q-card-section>
      <q-card-actions align="left">
        <q-btn
          label="Send Reset Link"
          color="primary"
          class="full-width"
          @click="sendResetLink"
        />
      </q-card-actions>
      <q-card-actions align="center">
        <q-btn label="Back to Login" flat @click="goToLogin" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useUserData } from "src/stores/users/userStore";
import { useQuasar } from "quasar";

import { api } from "src/boot/axios";
const email = ref("");
const router = useRouter();
const userStore = useUserData();
const $q = useQuasar();

const sendResetLink = async () => {
  await api
    .post("/api/password/email", {
      email: email.value,
    })
    .then((response) => {
      console.log(response);
      $q.notify({
        type: "positive",
        message: "Reset link sent! Please check your email.",
      });
    })
    .catch((error) => {
      $q.notify({
        type: "negative",
        message: "Failed to send reset link.",
      });
    });
};

const goToLogin = () => {
  router.push("/login");
};
</script>
