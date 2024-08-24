<template>
  <q-page class="">
    <div
      class="shadow-0 rounded-borders text-black bg-white"
      :class="$q.screen.gt.sm ? 'q-pa-lg' : 'q-pa-sm'"
    >
      <q-card class="full-width">
        <!-- <q-toolbar class="bg-primary text-white">
          <q-toolbar-title> Profile </q-toolbar-title>
        </q-toolbar> -->
        <q-tabs
          v-model="tab"
          inline-label
          indicator-color="primary"
          align="left"
          class="bg-grey-2 text-black shadow-2"
          active-color="white"
          active-bg-color="primary"
          no-caps
        >
          <q-tab
            name="profile"
            label="Update Profile"
            v-if="
              userStore.userDetails.roles.some(
                (permis) => ['client'].indexOf(permis) !== -1
              )
            "
          />
          <q-tab
            name="profile"
            label="Profile"
            v-if="
              userStore.userDetails.roles.some(
                (permis) => ['professional'].indexOf(permis) !== -1
              )
            "
          />
          <q-separator vertical />
          <q-tab
            name="biography"
            label="Biography"
            @click="getBio"
            v-if="
              userStore.userDetails.roles.some(
                (permis) => ['professional'].indexOf(permis) !== -1
              )
            "
          />
          <q-separator vertical />
          <q-tab
            name="experience"
            label="Experience"
            @click="getExperiences"
            v-if="
              userStore.userDetails.roles.some(
                (permis) => ['professional'].indexOf(permis) !== -1
              )
            "
          />
          <q-separator vertical />
          <q-tab
            name="locations"
            label="Locations"
            @click="locationFunc"
            v-if="
              userStore.userDetails.roles.some(
                (permis) => ['professional'].indexOf(permis) !== -1
              )
            "
          />

          <q-separator vertical />
          <!-- <q-tab
            name="hospital"
            label="Hospitals"
            v-if="
              userStore.userDetails.roles.some(
                (permis) => ['professional'].indexOf(permis) !== -1
              )
            "
          />
          <q-separator vertical /> -->
          <q-tab
            name="education"
            label="Education"
            @click="getEducations"
            v-if="
              userStore.userDetails.roles.some(
                (permis) => ['professional'].indexOf(permis) !== -1
              )
            "
          />
          <q-separator vertical />
        </q-tabs>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="profile">
            <q-card-section>
              <q-form
                class="column q-pa-md shawdow full-width block"
                ref="formName"
                @submit="onSubmit"
              >
                <div class="row q-col-gutter-none relative-position">
                  <div
                    :class="
                      $q.screen.gt.md
                        ? 'row col-4 q-col-gutter-none q-mr-md'
                        : 'full-width'
                    "
                  >
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
                        class="text-center q-mb-lg"
                        color="primary"
                        size="md"
                        @click="changeImageDialog(0)"
                      />
                    </div>
                  </div>
                  <div
                    :class="
                      $q.screen.gt.sm
                        ? 'row col q-col-gutter-none relative-position q-mr-md'
                        : 'full-width'
                    "
                  >
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
                      <q-popup-proxy
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
                      <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer"> </q-icon>
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
              </q-form>
            </q-card-section>
          </q-tab-panel>

          <!-- Biography -->
          <q-tab-panel name="biography">
            <q-card-section>
              <q-form
                class="column q-pa-md shawdow full-width block"
                ref="formName"
              >
                <div class="row q-col-gutter-none relative-position">
                  <div
                    :class="
                      $q.screen.gt.sm
                        ? 'row col q-col-gutter-none relative-position q-mr-md'
                        : 'full-width'
                    "
                  >
                    <p>Biography</p>
                    <q-input
                      filled
                      class="full-width q-mb-md"
                      label="Biography should start with honorifics or courtesy titles
                      follow by your name ex. Dr. Janlord Luga, DDS is a
                      prosthodontics practitioner in Irving, TX...
                    </p>"
                      type="textarea"
                      v-model="formData.bio"
                    >
                      <template v-slot:prepend>
                        <q-icon name="account_box" />
                      </template>
                    </q-input>
                    <q-btn
                      unelevated
                      label="Save"
                      class="text-center full-width"
                      color="primary"
                      size="md"
                      type="button"
                      @click="onSubmitBio"
                    />
                  </div>
                </div>
              </q-form>
            </q-card-section>
          </q-tab-panel>

          <!-- Experience Panel -->
          <q-tab-panel name="experience">
            <q-card-section>
              <q-form class="column q-pa-md shawdow full-width block">
                <div
                  v-for="(exp, index) in experiences"
                  :key="index"
                  class="q-mb-md"
                >
                  <q-input
                    v-model="exp.jobTitle"
                    label="Job Title"
                    filled
                    class="q-mb-sm"
                  >
                    <template v-slot:prepend>
                      <q-icon name="title" />
                    </template>
                  </q-input>
                  <q-input
                    v-model="exp.company"
                    label="Company"
                    filled
                    class="q-mb-sm"
                  >
                    <template v-slot:prepend>
                      <q-icon name="apartment" />
                    </template>
                  </q-input>
                  <q-input
                    v-model="exp.location"
                    label="Location"
                    filled
                    class="q-mb-sm"
                  >
                    <template v-slot:prepend>
                      <q-icon name="location_on" /> </template
                  ></q-input>
                  <q-input
                    v-model="exp.years"
                    label="Years"
                    filled
                    class="q-mb-sm"
                  >
                    <template v-slot:prepend>
                      <q-icon name="numbers" />
                    </template>
                  </q-input>
                  <q-btn
                    color="negative"
                    icon="delete"
                    flat
                    @click="removeExperience(index)"
                    class="q-mb-lg"
                    label="Remove Experience"
                  />
                </div>
                <q-btn
                  unelevated
                  label="Add Experience"
                  color="primary"
                  flat
                  icon="add"
                  class="q-mb-md"
                  @click="addExperience"
                />
                <q-btn
                  unelevated
                  label="Save "
                  color="primary"
                  class="full-width"
                  @click="saveExperiences"
                />
              </q-form>
            </q-card-section>
          </q-tab-panel>

          <!-- Education Panel -->
          <q-tab-panel name="education">
            <q-card-section>
              <q-form class="column q-pa-md shawdow full-width block">
                <div
                  v-for="(edu, index) in educations"
                  :key="index"
                  class="q-mb-md"
                >
                  <q-input
                    v-model="edu.institution_name"
                    label="Institution Name"
                    filled
                    class="q-mb-sm"
                  >
                    <template v-slot:prepend>
                      <q-icon name="apartment" />
                    </template>
                  </q-input>
                  <q-input
                    v-model="edu.degree"
                    label="Degree"
                    filled
                    class="q-mb-sm"
                  >
                    <template v-slot:prepend>
                      <q-icon name="school" />
                    </template>
                  </q-input>
                  <q-input
                    v-model="edu.location"
                    label="Location"
                    filled
                    class="q-mb-sm"
                  >
                    <template v-slot:prepend>
                      <q-icon name="location_on" /> </template
                  ></q-input>
                  <q-input
                    v-model="edu.years"
                    label="Years"
                    filled
                    class="q-mb-sm"
                  >
                    <template v-slot:prepend>
                      <q-icon name="numbers" />
                    </template>
                  </q-input>
                  <q-btn
                    color="negative"
                    icon="delete"
                    flat
                    @click="removeEducation(index)"
                    class="q-mb-lg"
                    label="Remove Education"
                  />
                </div>
                <q-btn
                  unelevated
                  label="Add Education"
                  color="primary"
                  flat
                  icon="add"
                  class="q-mb-md"
                  @click="addEducation"
                />
                <q-btn
                  unelevated
                  label="Save "
                  color="primary"
                  class="full-width"
                  @click="saveEducations"
                />
              </q-form>
            </q-card-section>
          </q-tab-panel>

          <q-tab-panel name="locations">
            <q-card-section>
              <q-form class="column q-pa-md shawdow full-width block">
                <q-toolbar>
                  <q-toolbar-title></q-toolbar-title>
                  <q-btn
                    color="red-5"
                    label="Search Clinic in Google Map"
                    to="/profile/map"
                    icon="search"
                  />
                </q-toolbar>
                <q-select
                  filled
                  v-model="locationSelected"
                  use-input
                  input-debounce="0"
                  label="Search Clinic"
                  :options="Locationoptions"
                  @filter="filterFn"
                  class="full-width"
                  behavior="menu"
                  @update:model-value="selectedLocFunc"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <q-btn
                  unelevated
                  label="Add"
                  color="primary"
                  class="full-width"
                  @click="AddLocation"
                />
                <q-table
                  flat
                  :pagination="pagination"
                  class="q-pa-sm"
                  :rows="clinicStore.doctorRowDatas"
                  :loading="clinicStore.loading"
                  :columns="columns"
                  row-key="id"
                  separator="none"
                  :visible-columns="['name', 'address', 'action']"
                >
                  <template v-slot:loading>
                    <q-inner-loading showing color="primary" />
                  </template>
                  <template #body="props">
                    <q-tr :props="props">
                      <q-td key="id" :props="props">
                        {{ props.row.id }}
                      </q-td>

                      <q-td key="name" :props="props">
                        {{ props.row.name }}
                      </q-td>
                      <q-td key="address" :props="props">
                        {{ props.row.address }}
                      </q-td>
                      <q-td key="action" :props="props">
                        <q-btn
                          color="blue"
                          icon="edit"
                          size="sm"
                          label="edit"
                        />
                        <q-btn
                          color="negative"
                          icon="delete"
                          label="remove"
                          size="sm"
                        />
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-form>
            </q-card-section>
          </q-tab-panel>
        </q-tab-panels>
        <q-inner-loading :showing="visible" />
      </q-card>
      <!-- <userList /> -->

      <!-- <q-dialog v-model="showCreateDialog">
        <CreateUser
          @hide-create-dialog="showCreateDialog = !showCreateDialog"
        />
      </q-dialog> -->
    </div>
  </q-page>

  <q-dialog
    v-model="googleMapDialog"
    persistent
    style="overflow: visible; z-index: 10000"
  >
    <searchGoogleMap @hide-image-dialog="googleMapDialog = !googleMapDialog" />
  </q-dialog>
</template>

<script setup>
import userList from "components/users/UserList.vue";
import { ref, reactive, onMounted } from "vue";
import { useUserData } from "src/stores/users/userStore";
import CreateUser from "components/users/CreateUser.vue";

import searchGoogleMap from "components/clinic/AddClinicMap.vue";
import { Country, State, City } from "country-state-city";
import { api } from "src/boot/axios";
import { LocalStorage, useQuasar } from "quasar";
import { useClinicData } from "src/stores/clinic/clinicStore";
// User State Management
const userStore = useUserData();

// show Dialog variable(bolean)
const showCreateDialog = ref(false);
// Create Dialog Functions
const CreateDialogFunc = () => {
  showCreateDialog.value = true;
};

const tab = ref("profile");
const visible = ref(true);

const $q = useQuasar();

const showCaptureImg = ref(false);
const userId = ref("");

/**
 *
 * Location Functions and variables,datas
 *
 */
const clinicStore = useClinicData();

const LocationStringOptions = ref("");
const Locationoptions = ref("");
const locationSelected = ref("");

const pagination = reactive({
  sortBy: "id",
  rowsPerPage: 10,
});
const columns = reactive([
  {
    name: "id",
    label: "ID",
    field: "id",
    align: "left",
    sortable: true,
    classes: "bg-grey-4",
  },
  {
    name: "name",
    label: "Name",
    field: "name",
    align: "left",
    sortable: true,
  },

  {
    name: "address",
    label: "address",
    field: "address",
    align: "left",
    sortable: true,
  },
  {
    name: "number",
    label: "Number",
    field: "number",
    align: "left",
    sortable: true,
  },
  {
    name: "action",
    label: "Action",
    field: "action",
    align: "left",
  },
]);

const selectedLocFunc = () => {
  console.log(locationSelected.value);
};

const locationFunc = () => {
  visible.value = true;
  clinicStore.getAllClinics();
  clinicStore.getDoctorClinics();
  setTimeout(() => {
    // LocationStringOptions.value = clinicStore.rowDatas;
    // Locationoptions.value = LocationStringOptions.value;
    // console.log(clinicStore.rowDatas);
    visible.value = false;
  }, 500);
};

const filterFn = (val, update) => {
  if (val === "") {
    update(() => {
      Locationoptions.value = clinicStore.rowDatas;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    Locationoptions.value = clinicStore.rowDatas.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};

const AddLocation = () => {
  visible.value = true;
  api
    .post(
      "/api/clinic/doctors",
      {
        id: locationSelected.value.value,
      },
      {
        headers: {
          Authorization: "Bearer " + newToken.value,
        },
      }
    )
    .then((response) => {
      console.log(response);

      if (response.data.status == 200) {
        setTimeout(() => {
          $q.notify({
            type: "positive",
            position: "top",
            message: response.data.message,
            timeout: 3000,
          });
          clinicStore.getDoctorClinics();
          visible.value = false;
        }, 500);
      } else {
        setTimeout(() => {
          $q.notify({
            type: "negative",
            position: "top",
            message: response.data.message,
            timeout: 3000,
          });
          visible.value = false;
        }, 3000);
      }
    })
    .catch((error) => {
      console.log(error);
      setTimeout(() => {
        $q.notify({
          type: "negative",
          position: "top",
          message: "Something went wrong, kindly contact the support!",
          timeout: 3000,
        });
        visible.value = false;
      }, 3000);
    });
};

/**
 * Google map search properties
 */

const googleMapDialog = ref(false);
// Google map pop up functions
const searchClinicFunc = () => {
  googleMapDialog.value = true;
};

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
  bio: null,
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
      formData.bio = response.data.data.biography;
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

// Load biography
const getBio = () => {
  visible.value = true;

  setTimeout(() => {
    visible.value = false;
  }, 1000);
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

const onSubmitBio = () => {
  console.log("bio");
  var newToken = LocalStorage.getItem("jwt");
  $q.loading.show();
  api
    .patch(
      "/api/users/biography/update",
      {
        bio: formData.bio,
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

// Update profile of the user
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

/**
 *
 * Experience functions
 * */
// Initial experiences data
const experiences = reactive([
  // {
  //   id:'',
  //   jobTitle: "",
  //   company: "",
  //   years: "",
  //   location: ''
  // },
]);

// Function to add a new experience field
const addExperience = () => {
  experiences.push({
    id: "",
    jobTitle: "",
    company: "",
    years: "",
    location: "",
  });
};

// Function to remove an experience field
const removeExperience = (index) => {
  experiences.splice(index, 1);
};

// Function to save the experiences
const saveExperiences = async () => {
  let a = 0;
  experiences.forEach((item, index) => {
    if (!item.jobTitle) {
      $q.notify({
        position: "top",
        type: "negative",
        timeout: 3000,
        message: `The Job title is empty in object at index ${
          index + 1
        }, Please fill the necessary details!`,
      });
      a++;
    }
  });

  if (a == 0) {
    var newToken = LocalStorage.getItem("jwt");
    $q.loading.show();
    api
      .post(
        "/api/users/experience/save",
        {
          experiences: experiences,
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
  }
};

// Get All user experience
const getExperiences = async () => {
  experiences.length = 0;
  visible.value = true;
  var newToken = LocalStorage.getItem("jwt");
  // $q.loading.show();
  await api
    .get("/api/users/experience/all", {
      headers: {
        Authorization: "Bearer " + newToken,
      },
    })
    .then((response) => {
      console.log(response);
      if (response.data.status == 200) {
        setTimeout(() => {
          Object.entries(response.data.data).map(([key, val]) => {
            experiences.push({
              id: val.id,
              jobTitle: val.job_title,
              company: val.company_name,
              years: val.years,
              location: val.location,
            });
          });
          visible.value = false;
        }, 1000);
      } else {
        setTimeout(() => {
          // $q.loading.hide();
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
        // $q.loading.hide();
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

/**
 *
 * Experience functions
 * */
// Initial experiences data
const educations = reactive([
  // {
  //   id:'',
  //   jobTitle: "",
  //   company: "",
  //   years: "",
  //   location: ''
  // },
]);

// Function to add a new Education field
const addEducation = () => {
  educations.push({
    id: "",
    institution_name: "",
    degree: "",
    years: "",
    location: "",
  });
};

// Function to remove an Education field
const removeEducation = (index) => {
  educations.splice(index, 1);
};

// Function to save the Educations
const saveEducations = async () => {
  let a = 0;
  educations.forEach((item, index) => {
    if (!item.institution_name) {
      $q.notify({
        position: "top",
        type: "negative",
        timeout: 3000,
        message: `The Institution Name is empty in object at index ${
          index + 1
        }, Please fill the necessary details!`,
      });
      a++;
    }
  });

  if (a == 0) {
    var newToken = LocalStorage.getItem("jwt");
    $q.loading.show();
    api
      .post(
        "/api/users/education/save",
        {
          educations: educations,
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
  }
};

// Get All user experience
const getEducations = async () => {
  educations.length = 0;
  visible.value = true;
  var newToken = LocalStorage.getItem("jwt");
  // $q.loading.show();
  await api
    .get("/api/users/education/all", {
      headers: {
        Authorization: "Bearer " + newToken,
      },
    })
    .then((response) => {
      console.log(response);
      if (response.data.status == 200) {
        setTimeout(() => {
          Object.entries(response.data.data).map(([key, val]) => {
            educations.push({
              id: val.id,
              institution_name: val.institution_name,
              degree: val.degree,
              years: val.years,
              location: val.location,
            });
          });
          visible.value = false;
        }, 1000);
      } else {
        setTimeout(() => {
          // $q.loading.hide();
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
        // $q.loading.hide();
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
  // getExperiences();
  // userStore.getAllUsers();
  countryFunc();
  setTimeout(() => {
    visible.value = false;
  }, 1000);
});
</script>
