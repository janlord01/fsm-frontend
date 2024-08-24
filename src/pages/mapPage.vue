<template>
  <q-btn
    label="Back"
    icon="arrow_back"
    size="sm"
    class="text-black q-ma-lg"
    flat
    @click="router.go(-1)"
  />
  <div class="map-container">
    <input
      ref="searchInput"
      type="text"
      placeholder="Search for dental clinics"
      class="search-input"
    />
    <div ref="mapContainer" class="map"></div>
    <div v-if="selectedPlace" class="place-details">
      <h2>{{ selectedPlace.name }}</h2>
      <p><strong>Address:</strong> {{ selectedPlace.formatted_address }}</p>
      <p v-if="selectedPlace.formatted_phone_number">
        <strong>Phone:</strong> {{ selectedPlace.formatted_phone_number }}
      </p>
      <p v-if="selectedPlace.international_phone_number">
        <strong>International Phone:</strong>
        {{ selectedPlace.international_phone_number }}
      </p>
      <p v-if="selectedPlace.rating">
        <strong>Rating:</strong>
        <StarRating :rating="selectedPlace.rating" />
        {{ selectedPlace.rating }} / 5
      </p>
      <p v-if="selectedPlace.website">
        <strong>Website:</strong>
        <a :href="selectedPlace.website" target="_blank">{{
          selectedPlace.website
        }}</a>
      </p>
      <q-btn
        label="Save"
        icon="save"
        color="primary"
        @click="saveClinicSubmit"
      />
    </div>

    <q-inner-loading :showing="visible" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import StarRating from "components/StarRating.vue"; // Import the StarRating component
import { LocalStorage, useQuasar } from "quasar";
import { api } from "src/boot/axios";

const $q = useQuasar();
const visible = ref(true);
const route = useRoute();
const router = useRouter();
const map = ref(null);
const searchInput = ref(null);
const mapContainer = ref(null);
const autocomplete = ref(null);
const marker = ref(null);
const selectedPlace = ref(null);

const newToken = ref(LocalStorage.getItem("jwt"));

// Save Clinic
const saveClinicSubmit = () => {
  // <h2>{{ selectedPlace.name }}</h2>
  //     <p><strong>Address:</strong> {{ selectedPlace.formatted_address }}</p>
  //     <p v-if="selectedPlace.formatted_phone_number">
  //       <strong>Phone:</strong> {{ selectedPlace.formatted_phone_number }}
  //     </p>
  //     <p v-if="selectedPlace.international_phone_number">
  //       <strong>International Phone:</strong>
  //       {{ selectedPlace.international_phone_number }}
  //     </p>
  //     <p v-if="selectedPlace.rating">
  //       <strong>Rating:</strong>
  //       <StarRating :rating="selectedPlace.rating" />
  //       {{ selectedPlace.rating }} / 5
  //     </p>
  //     <p v-if="selectedPlace.website">
  //       <strong>Website:</strong>
  //       <a :href="selectedPlace.website" target="_blank">{{
  //         selectedPlace.website
  //       }}</a>
  //     </p>
  visible.value = true;
  console.log(selectedPlace.value.name);
  api
    .post(
      "/api/clinic",
      {
        name: selectedPlace.value.name,
        address: selectedPlace.value.formatted_address,
        phone: selectedPlace.value.formatted_phone_number,
        rating: selectedPlace.value.rating,
        website: selectedPlace.value.website,
      },
      {
        headers: {
          Authorization: "Bearer " + newToken.value,
        },
      }
    )
    .then((response) => {
      console.log(response);
      if (response.data.status === 200) {
        setTimeout(() => {
          $q.notify({
            position: "top",
            type: "positive",
            timeout: 3000,
            message: response.data.message,
          });
          visible.value = false;
        }, 500);
      } else {
        setTimeout(() => {
          $q.notify({
            position: "top",
            type: "negative",
            timeout: 3000,
            message: response.data.message,
          });
          visible.value = false;
        }, 3000);
      }
    })
    .catch((error) => {
      console.log(error);
      setTimeout(() => {
        $q.notify({
          position: "top",
          type: "negative",
          timeout: 3000,
          message: "Something went wrong, please contact the support!",
        });
        visible.value = false;
      }, 3000);
    });
};

onMounted(() => {
  setTimeout(() => {
    initMap();
    initAutocomplete();
    visible.value = false;
  }, 500);
});

function initMap() {
  const defaultLocation = { lat: 37.0902, lng: -95.7129 };
  map.value = new google.maps.Map(mapContainer.value, {
    center: defaultLocation,
    zoom: 4,
  });
  marker.value = new google.maps.Marker({
    map: map.value,
  });
}

function initAutocomplete() {
  autocomplete.value = new google.maps.places.Autocomplete(searchInput.value, {
    types: ["establishment"],
    fields: [
      "address_components",
      "adr_address",
      "formatted_address",
      "geometry",
      "icon",
      "name",
      "photos",
      "place_id",
      "plus_code",
      "type",
      "url",
      "utc_offset_minutes",
      "vicinity",
      "formatted_phone_number",
      "international_phone_number",
      "opening_hours",
      "rating",
      "reviews",
      "user_ratings_total",
      "website",
    ],
  });
  autocomplete.value.addListener("place_changed", onPlaceChanged);
}

function onPlaceChanged() {
  const place = autocomplete.value.getPlace();

  if (!place.geometry) {
    alert("No details available for input: '" + place.name + "'");
    return;
  }

  map.value.setCenter(place.geometry.location);
  map.value.setZoom(15);

  marker.value.setPosition(place.geometry.location);
  marker.value.setVisible(true);

  selectedPlace.value = {
    name: place.name,
    formatted_address: place.formatted_address,
    formatted_phone_number: place.formatted_phone_number,
    international_phone_number: place.international_phone_number,
    rating: place.rating,
    website: place.website,
    opening_hours: place.opening_hours,
    photos: place.photos,
    reviews: place.reviews,
  };
}

function formatOpeningHours(opening_hours) {
  if (!opening_hours || !opening_hours.weekday_text) return "N/A";
  return opening_hours.weekday_text.join(", ");
}

function getPhotoUrl(photoReference) {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=YOUR_API_KEY`;
}
</script>

<style scoped>
.map-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.search-input {
  width: 80%;
  padding: 10px;
  margin: 20px 0;
  font-size: 16px;
}

.map {
  width: 80%;
  height: 500px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.place-details {
  width: 80%;
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #fafafa;
}
</style>
