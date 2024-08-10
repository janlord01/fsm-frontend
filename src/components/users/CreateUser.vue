<template>
  <q-card style="max-width: 400px; width: 800px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title> Create User </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none relative-position">
          <div class="full-width q-mb-md">
            <q-input filled label=" Name*" type="text" v-model="formData.name">
              <template v-slot:prepend>
                <q-icon name="account_circle" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="row q-col-gutter-none relative-position">
          <div class="full-width q-mb-md">
            <q-input filled v-model="formData.dob" mask="date" label="Birthday">
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
          </div>
          <div class="full-width q-mb-md">
            <q-select
              filled
              :options="['Male', 'Female']"
              label="Gender*"
              v-model="formData.gender"
            >
              <template v-slot:prepend>
                <q-icon name="wc" />
              </template>
            </q-select>
          </div>
          <div class="full-width q-mb-md">
            <q-input
              filled
              label="Phone #"
              type="text"
              v-model="formData.phone"
            >
              <template v-slot:prepend>
                <q-icon name="local_phone" />
              </template>
            </q-input>
          </div>
          <div class="full-width q-mb-md">
            <q-select
              filled
              :options="['client', 'professional']"
              label="Role*"
              v-model="formData.role"
            >
              <template v-slot:prepend>
                <q-icon name="groups_3" />
              </template>
            </q-select>
          </div>
        </div>
        <div class="row q-col-gutter-none relative-position">
          <div class="full-width q-mb-md">
            <q-select
              filled
              v-model="formData.country"
              use-input
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
          </div>
        </div>
        <div class="row q-col-gutter-none relative-position">
          <div class="full-width q-mb-md">
            <q-select
              filled
              v-model="formData.state"
              use-input
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
          </div>
        </div>
        <div class="row q-col-gutter-none relative-position">
          <div class="full-width q-mb-md">
            <q-select
              filled
              v-model="formData.city"
              use-input
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
          </div>
        </div>
        <div class="row q-col-gutter-none relative-position">
          <div class="full-width q-mb-md">
            <q-input
              filled
              label="Street"
              type="text"
              v-model="formData.street"
            >
              <template v-slot:prepend>
                <q-icon name="place" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="row q-col-gutter-none relative-position">
          <div class="full-width q-mb-md">
            <q-input
              filled
              label="Email Address"
              type="email"
              v-model="formData.email"
            >
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>
          </div>
        </div>

        <div class="row q-col-gutter-none relative-position">
          <div class="full-width q-mb-md">
            <q-input
              filled
              label="Password"
              :type="isPwd ? 'password' : 'text'"
              v-model="formData.password"
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
          </div>
        </div>

        <div class="row align-center">
          <q-btn
            unelevated
            label="Create"
            class="text-center full-width"
            color="primary"
            size="md"
            type="submit"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
// import { useUserData } from "src/stores/users/store";
import { useUserData } from "stores/users/userStore";
import { useRoute, useRouter } from "vue-router";
import { Country, State, City } from "country-state-city";

const emit = defineEmits(["hideCreateDialog"]);
const route = useRoute();
// const userStore = useUserData();

const $q = useQuasar();

// UserStore Statement Management
const userStore = useUserData();

// password to text
const isPwd = ref(true);

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
    .post(
      "/api/users",
      {
        name: formData.name,
        email: formData.email,
        dob: formData.dob,
        gender: formData.gender,
        role: formData.role,
        phone: formData.phone,
        country: formData.country,
        state: formData.state,
        city: formData.city ? formData.city.label : "",
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
          userStore.addNewMember(response.data.data);
          emit("hideCreateDialog");
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
onMounted(() => {
  // console.log(Country.getAllCountries());
  // console.log(State.getStatesOfCountry("IN"));
  // console.log(City.getAllCities());
  // getCodesFunc();
  // console.log(codes);
  countryFunc();
});

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
  password: null,
});
</script>
<style scoped></style>
