<template>
  <q-page class="">
    <div class="shadow-0 q-pa-md rounded-borders text-black bg-white q-pa-lg">
      <q-card class="full-width">
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title> Password </q-toolbar-title>
        </q-toolbar>
        <q-card-section>
          <q-form
            class="row q-pa-md shadow flex flex-center justify-center"
            ref="formName"
            @submit="onSubmit"
            v-if="formData.provider == null"
          >
            <div class="col-4 text-center">
              <q-input
                filled
                label="Old Password*"
                class="q-mb-md full-width"
                :type="isOldPwd ? 'password' : 'text'"
                style="min-width: 300px"
                v-model="oldpassword"
              >
                <template v-slot:prepend>
                  <q-icon name="password" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isOldPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isOldPwd = !isOldPwd"
                  />
                </template>
              </q-input>
              <q-input
                filled
                outlined
                v-model="password"
                label="Password"
                :type="isPwd ? 'password' : 'text'"
                class="q-mb-md full-width"
                style="min-width: 300px"
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
                label="Password Confirmation"
                :type="isPwdCon ? 'password' : 'text'"
                class="q-mb-md full-width"
                style="min-width: 300px"
              >
                <template v-slot:prepend>
                  <q-icon name="password" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isPwdCon ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwdCon = !isPwdCon"
                  />
                </template>
              </q-input>
              <q-btn
                unelevated
                label="Change"
                class="text-center full-width"
                color="primary"
                size="md"
                type="submit"
              />
            </div>
          </q-form>
          <p v-else>
            You use google or facebook for login, you can't change your password
            here.
          </p>
        </q-card-section>
        <q-inner-loading :showing="visible" />
        <!-- <q-spinner-gears size="50px" color="primary" /> -->
        <!-- </q-inner-loading> -->
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import userList from "components/users/UserList.vue";
import { ref, reactive, onMounted } from "vue";
import { useUserData } from "src/stores/users/userStore";
import CreateUser from "components/users/CreateUser.vue";

import ChangeImage from "components/users/ChangeImage.vue";
import { Country, State, City } from "country-state-city";
import { api } from "src/boot/axios";
import { LocalStorage, useQuasar } from "quasar";
// User State Management
const userStore = useUserData();

const visible = ref(true);

const oldpassword = ref("");
const password = ref("");
const password_confirmation = ref("");
const isOldPwd = ref(true);
const isPwd = ref(true);
const isPwdCon = ref(true);
// show Dialog variable(bolean)
const showCreateDialog = ref(false);
// Create Dialog Functions
const CreateDialogFunc = () => {
  showCreateDialog.value = true;
};

const $q = useQuasar();

const showCaptureImg = ref(false);
const userId = ref("");

const changeImageDialog = (id) => {
  showCaptureImg.value = true;
  userId.value = id;
};
// get jwt token
const newToken = ref(LocalStorage.getItem("jwt"));

const formData = reactive({
  name: null,
  email: null,
  gender: null,
  dob: null,
  phone: null,
  profile_pic: null,
  country: null,
  state: null,
  city: null,
  zipcode: null,
  street: null,
  role: null,
  provider: "",
});

/**
 *
 * Getting the user data
 *
 */

const getUserData = async () => {
  await api
    .get("/api/users/" + 0 + "/edit", {
      headers: {
        Authorization: "Bearer " + newToken.value,
      },
    })
    .then((response) => {
      console.log(response);
      formData.name = response.data.data.name;
      formData.email = response.data.data.email;
      formData.dob = response.data.data.dob;
      formData.gender = response.data.data.gender;
      formData.phone = response.data.data.phone;
      // formData.role = response.data.data.roles[0]
      //   ? response.data.data.roles[0].name
      //   : "";
      formData.country = JSON.parse(response.data.data.country);
      formData.state = JSON.parse(response.data.data.state);
      formData.city = JSON.parse(response.data.data.city);
      formData.zipcode = response.data.data.zipcode;
      formData.street = response.data.data.street;

      formData.provider = response.data.data.provider;

      console.log(formData.provider);
      // formData.profession = response.data.data.profession;
      // formData.code = response.data.data.code;
      // formData.from = response.data.data.know_beefit;
    })
    .catch((error) => {
      console.log(error);
    });
};

/**
 *
 * Country variables and functions
 */
const countries = reactive([]);
const CountryOptions = ref("");
// get all countries
const countryFunc = () => {
  Object.entries(Country.getAllCountries()).map(([key, val]) => {
    countries.push({
      label: val.name,
      value: val.isoCode,
    });
  });
  CountryOptions.value = countries;
};
// filter country
const CountryfilterFn = (val, update) => {
  if (val === "") {
    update(() => {
      CountryOptions.value = countries;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    CountryOptions.value = countries.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};

// Clear State City Func
const clearStateCityFunc = () => {
  states.splice(0, states.length);
  formData.state = "";
  formData.city = "";
};

/**
 *
 * State variables and functions
 */

const states = reactive([]);
const stateOptions = ref("");
// get states function based on country code or isoCode/value
const getStateFunc = () => {
  states.splice(0, states.length);
  formData.state = "";
  formData.city = "";
  Object.entries(State.getStatesOfCountry(formData.country.value)).map(
    ([key, val]) => {
      states.push({
        label: val.name,
        value: val.isoCode,
        isoCode: val.isoCode,
        countryCode: val.countryCode,
      });
    }
  );
  stateOptions.value = states;
};
// filter state
const StatefilterFn = (val, update) => {
  if (val === "") {
    update(() => {
      stateOptions.value = states;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    stateOptions.value = states.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};

/**
 *
 * City variables and functions
 */
const cities = reactive([]);
const cityOptions = ref("");
// get cities function based on country code and statecode
const getCityFunc = () => {
  cities.splice(0, cities.length);
  console.log(
    City.getCitiesOfState(formData.state.countryCode, formData.state.isoCode)
  );
  Object.entries(
    City.getCitiesOfState(formData.state.countryCode, formData.state.isoCode)
  ).map(([key, val]) => {
    cities.push({
      label: val.name,
    });
  });
  cityOptions.value = cities;
};
// filter cities
const CityfilterFn = (val, update) => {
  if (val === "") {
    update(() => {
      cityOptions.value = cities;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    cityOptions.value = cities.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};

// Submit or create an account for client and professional doctors
const onSubmit = () => {
  var newToken = LocalStorage.getItem("jwt");
  $q.loading.show();
  api
    .patch(
      "/api/change/password",
      {
        oldpassword: oldpassword.value,
        password: password.value,
        password_confirmation: password_confirmation.value,
      },
      {
        headers: {
          Authorization: "Bearer " + newToken,
        },
      }
    )
    .then((response) => {
      console.log(response);
      if (response.data.status == 200) {
        setTimeout(() => {
          $q.notify({
            type: "positive",
            icon: "save",
            timeout: 3000,
            position: "top",
            message: response.data.message,
          });
          $q.loading.hide();
          oldpassword.value = "";
          password.value = "";
          password_confirmation.value = "";
          // userStore.addNewMember(response.data.data);
          // emit("hideImageDialog");
        }, 500);
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
        }, 3000);
      }
    })
    .catch((error) => {
      console.log(error);
      setTimeout(() => {
        $q.loading.hide();
        $q.notify({
          type: "negative",
          icon: "error",
          timeout: 3000,
          position: "top",
          message: "Error! Please report to software engineer",
        });
      }, 5000);
    });
};
// load data
onMounted(() => {
  getUserData();
  // userStore.getAllUsers();
  countryFunc();
  // $q.loading.show();
  setTimeout(() => {
    // $q.loading.hide();
    visible.value = false;
  }, 1000);
});
</script>
