<template>
  <q-card style="max-width: 800px; width: 800px; overflow: visible">
    <q-toolbar class="text-white bg-red-5">
      <q-toolbar-title>Search Clinic Google Map</q-toolbar-title>
      <q-btn icon="close" round flat v-close-popup />
    </q-toolbar>

    <q-card-section>
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
            <strong>Rating:</strong> {{ selectedPlace.rating }} / 5
          </p>
          <p v-if="selectedPlace.website">
            <strong>Website:</strong>
            <a :href="selectedPlace.website" target="_blank">{{
              selectedPlace.website
            }}</a>
          </p>
          <p v-if="selectedPlace.opening_hours">
            <strong>Opening Hours:</strong>
            {{ formatOpeningHours(selectedPlace.opening_hours) }}
          </p>
          <div v-if="selectedPlace.photos">
            <strong>Photos:</strong>
            <div
              v-for="photo in selectedPlace.photos"
              :key="photo.photo_reference"
            >
              <img
                :src="getPhotoUrl(photo.photo_reference)"
                alt="Place photo"
                class="place-photo"
              />
            </div>
          </div>
          <div v-if="selectedPlace.reviews">
            <strong>Reviews:</strong>
            <!-- <pre>{{ selectedPlace.reviews }}</pre> -->
            <ul>
              <li
                v-for="review in selectedPlace.reviews"
                :key="review.author_name"
              >
                <strong>{{ review.author_name }}:</strong> {{ review.text }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { ref, onMounted } from "vue";

const map = ref(null);
const searchInput = ref(null);
const mapContainer = ref(null);
const autocomplete = ref(null);
const marker = ref(null);
const selectedPlace = ref(null);

onMounted(() => {
  initMap();
  initAutocomplete();
});

function initMap() {
  const defaultLocation = { lat: 37.0902, lng: -95.7129 }; // Center of the US
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
</style>
