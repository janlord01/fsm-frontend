<template>
  <q-page class="">
    <div class="shadow-0 q-pa-md rounded-borders text-black bg-white q-pa-lg">
      <q-card class="full-width">
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title> Profile </q-toolbar-title>
          <!-- <q-btn flat icon="close" round v-close-popup></q-btn> -->
        </q-toolbar>
        <q-card-section>
          <q-form
            class="column q-pa-md shawdow full-width block"
            ref="formName"
            @submit="onSubmit"
          >
            <div class="row q-col-gutter-none relative-position">
              <div class="row col-4 q-col-gutter-none q-mr-md">
                <div
                  class="full-width center"
                  style="
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    gap: 10px; /* Optional: Add space between the avatar and button */
                  "
                >
                  <!-- <q-input
                    filled
                    label=" Name*"
                    type="text"
                    v-model="formData.name"
                  >
                    <template v-slot:prepend>
                      <q-icon name="account_circle" />
                    </template>
                  </q-input> -->
                  <q-avatar size="200px" class="border">
                    <img
                      v-if="
                        userStore.userDetails.user &&
                        userStore.userDetails.user.profile_pic
                      "
                      :src="userStore.userDetails.user.profile_pic"
                    />
                  </q-avatar>
                  <q-btn
                    unelevated
                    label="Change"
                    class="text-center"
                    color="primary"
                    size="md"
                    @click="changeImageDialog(0)"
                  />
                </div>
              </div>
              <div class="row col q-col-gutter-none relative-position q-mr-md">
                <q-input
                  filled
                  label="Name*"
                  class="full-width q-mb-md"
                  type="text"
                  v-model="formData.name"
                >
                  <template v-slot:prepend>
                    <q-icon name="account_circle" />
                  </template>
                </q-input>
                <q-input
                  filled
                  v-model="formData.dob"
                  mask="date"
                  class="full-width q-mb-md"
                  label="Birthday"
                >
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="formData.dob">
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-select
                  filled
                  class="full-width q-mb-md"
                  :options="['Male', 'Female']"
                  label="Gender*"
                  v-model="formData.gender"
                >
                  <template v-slot:prepend>
                    <q-icon name="wc" />
                  </template>
                </q-select>
                <q-input
                  filled
                  label="Phone #"
                  type="text"
                  class="full-width q-mb-md"
                  v-model="formData.phone"
                >
                  <template v-slot:prepend>
                    <q-icon name="local_phone" />
                  </template>
                </q-input>
                <!-- <q-select
                  filled
                  class="full-width q-mb-md"
                  :options="['client', 'professional']"
                  label="Role*"
                  v-model="formData.role"
                >
                  <template v-slot:prepend>
                    <q-icon name="groups_3" />
                  </template>
                </q-select> -->
                <q-select
                  filled
                  v-model="formData.country"
                  use-input
                  class="full-width q-mb-md"
                  input-debounce="0"
                  label="Select Country"
                  :options="CountryOptions"
                  @filter="CountryfilterFn"
                  @update:model-value="getStateFunc"
                  behavior="menu"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:append>
                    <q-icon
                      v-if="formData.country !== null"
                      class="cursor-pointer"
                      name="clear"
                      @click.stop.prevent="formData.country = null"
                      @click="clearStateCityFunc"
                    />
                  </template>
                  <template v-slot:prepend>
                    <q-icon name="language" />
                  </template>
                </q-select>
                <q-select
                  filled
                  v-model="formData.state"
                  use-input
                  class="full-width q-mb-md"
                  input-debounce="0"
                  label="Select State"
                  :options="stateOptions"
                  @filter="StatefilterFn"
                  @update:model-value="getCityFunc"
                  behavior="menu"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:append>
                    <q-icon
                      v-if="formData.state !== null"
                      class="cursor-pointer"
                      name="clear"
                      @click.stop.prevent="formData.state = null"
                    />
                  </template>
                  <template v-slot:prepend>
                    <q-icon name="emoji_transportation" />
                  </template>
                </q-select>
                <q-select
                  filled
                  v-model="formData.city"
                  use-input
                  class="full-width q-mb-md"
                  input-debounce="0"
                  label="Select City"
                  :options="cityOptions"
                  @filter="CityfilterFn"
                  behavior="menu"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:append>
                    <q-icon
                      v-if="formData.city !== null"
                      class="cursor-pointer"
                      name="clear"
                      @click.stop.prevent="formData.city = null"
                    />
                  </template>
                  <template v-slot:prepend>
                    <q-icon name="location_city" />
                  </template>
                </q-select>
                <q-input
                  filled
                  class="full-width q-mb-md"
                  label="Street"
                  type="text"
                  v-model="formData.street"
                >
                  <template v-slot:prepend>
                    <q-icon name="place" />
                  </template>
                </q-input>
                <!-- <q-input
                  filled
                  class="full-width q-mb-md"
                  label="Email Address"
                  type="email"
                  v-model="formData.email"
                >
                  <template v-slot:prepend>
                    <q-icon name="email" />
                  </template>
                </q-input> -->
                <q-btn
                  unelevated
                  label="Update"
                  class="text-center full-width"
                  color="primary"
                  size="md"
                  type="submit"
                />
              </div>
            </div>

            <!-- <div class="row align-center">
              <q-btn
                unelevated
                label="Update"
                class="text-center full-width"
                color="primary"
                size="md"
                type="submit"
              />
            </div> -->
          </q-form>
        </q-card-section>
      </q-card>
      <!-- <userList /> -->

      <!-- <q-dialog v-model="showCreateDialog">
        <CreateUser
          @hide-create-dialog="showCreateDialog = !showCreateDialog"
        />
      </q-dialog> -->
    </div>
  </q-page>

  <q-dialog v-model="showCaptureImg" persistent>
    <ChangeImage
      :user-id="userId"
      @hide-image-dialog="showCaptureImg = !showCaptureImg"
    />
  </q-dialog>
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
      "/api/users/" + 0,
      {
        name: formData.name,
        email: formData.email,
        dob: formData.dob,
        gender: formData.gender,
        role: formData.role,
        phone: formData.phone,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        street: formData.street,
        zipcode: formData.zipcode,
      },
      {
        headers: {
          Authorization: "Bearer " + newToken,
        },
      }
    )
    .then((response) => {
      // console.log(response);
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
});
</script>
