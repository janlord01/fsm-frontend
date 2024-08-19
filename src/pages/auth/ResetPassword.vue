<!-- src/pages/ResetPassword.vue -->
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
        <div class="text-h6">Reset Password</div>
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
          label="New Password"
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
          v-model="passwordConfirmation"
          label="Confirm Password"
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
      </q-card-section>
      <q-card-actions align="left">
        <q-btn
          label="Reset Password"
          color="primary"
          class="full-width"
          @click="resetPassword"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import { useQuasar } from "quasar";

import { api } from "src/boot/axios";

const email = ref("");
const password = ref("");
const passwordConfirmation = ref("");
const isPwd = ref(true);
const $q = useQuasar();
const router = useRouter();
const route = useRoute();

const resetPassword = async () => {
  try {
    const token = route.query.token;

    if (!token) {
      throw new Error("Invalid or missing reset token.");
    }

    await api.post("/api/password/reset", {
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
      token: token,
    });

    $q.notify({
      type: "positive",
      message:
        "Password has been reset successfully. You can now log in with your new password.",
    });

    router.push("/login");
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Failed to reset password. Please try again.",
    });
  }
};
</script>
