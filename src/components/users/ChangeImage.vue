<template>
  <q-card style="max-width: 500px; width: 500px" class="z-top">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar
      :class="
        $q.dark.isActive ? 'text-white bg-blue-grey-10' : 'bg-blue text-white'
      "
    >
      <q-toolbar-title> Upload Profile Picture </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none relative-position">
          <q-file
            filled
            bottom-slots
            v-model="img"
            label="Upload Image"
            counter
            max-files="12"
            class="full-width"
          >
            <template v-slot:before>
              <q-avatar>
                <img :src="imageSrc" />
              </q-avatar>
            </template>

            <template v-slot:append>
              <q-icon
                v-if="img !== null"
                name="close"
                @click.stop.prevent="img = null"
                class="cursor-pointer"
                color="blue"
              />
              <q-icon name="image" @click.stop.prevent />
            </template>

            <template v-slot:hint> Field hint </template>

            <template v-slot:after>
              <q-btn
                round
                dense
                flat
                color="blue"
                type="submit"
                @click="onSubmit"
                icon="send"
              />
            </template>
          </q-file>
        </div>
        <!-- <div>
            <img :src="imageSrc" />
          </div> -->
        <!-- <div class="row align-center">
            <q-btn
              unelevated
              label="Upload"
              class="text-center"
              color="primary"
              size="md"
              type="submit"
            />
          </div> -->
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
import { ref, defineEmits, onMounted, reactive } from "vue";
// import snapPicture from "./viewImage.vue";
import { useUserData } from "src/stores/users/userStore";

import { LocalStorage, useQuasar } from "quasar";
import { api } from "src/boot/axios";

import { useRoute } from "vue-router";
// import { useCompanyData } from "stores/company/store";

// import { saveAs } from "file-saver";

export default {
  emits: ["hideImageDialog", "captureImg"],
  props: ["userId"],
  setup(props, { emit }) {
    // const companyStore = useCompanyData();
    const route = useRoute();

    const $q = useQuasar();
    const imageSrc = ref("");
    const showCaptureImg = ref(false);
    const img = ref(null);
    const userStore = useUserData();

    const formData = reactive({
      code: null,
    });
    const newToken = ref(LocalStorage.getItem("jwt"));

    const getMemberData = async () => {
      await api
        .get("/api/users/" + props.userId + "/edit", {
          headers: {
            Authorization: "Bearer " + newToken.value,
          },
        })
        .then((response) => {
          console.log(response);
          imageSrc.value = response.data.data.profile_pic;
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const getUserData = async () => {
      await api
        .get("/api/users/" + props.userId + "/edit", {
          headers: {
            Authorization: "Bearer " + newToken.value,
          },
        })
        .then((response) => {
          console.log(response);

          // formData.profession = response.data.data.profession;
          // formData.code = response.data.data.code;
          // formData.from = response.data.data.know_beefit;
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const onSubmit = async () => {
      $q.loading.show();

      // this.file_path = file[0];

      var newToken = LocalStorage.getItem("jwt");

      var fileData = new FormData();

      fileData.append("file_path", img.value);

      await api
        .post("/api/users/" + props.userId + "/upload-image", fileData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          console.log(response);
          if (response.data.status == 200) {
            setTimeout(() => {
              $q.loading.hide();
              $q.notify({
                type: "positive",
                icon: "save",
                timeout: 3000,
                position: "top",
                message: response.data.message,
              });
              emit("hideImageDialog");
              if (props.userId == 0) {
                userStore.getUserDetails();
              } else {
                userStore.getAllUsers();
              }
            }, 1000);
          } else {
            setTimeout(() => {
              $q.loading.hide();
              $q.notify({
                type: "negative",
                icon: "error",
                timeout: 3000,
                position: "top",
                message: response.data.message,
              });
              // userStore.getAllMembers();
              // emit("hideCreateDialog");
            }, 3000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    onMounted(() => {
      getMemberData();
      // getUserData();
      // console.log(codes);
    });

    return {
      img,
      onSubmit,
      imageSrc,
      getMemberData,
      getUserData,
    };
  },
  data() {
    return {
      //   imageSrc: null,
    };
  },

  components() {
    snapPicture;
  },
};
</script>
