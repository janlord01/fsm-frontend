<template>
  <div class="star-rating">
    <q-icon
      v-for="n in 5"
      :key="n"
      class="q-mr-xs"
      name="star"
      :class="n <= Math.round(rating) ? 'star-filled' : 'star-empty'"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  rating: {
    type: Number,
    required: true,
  },
});
</script>

<style scoped>
.star-rating {
  display: flex;
}

.star-filled {
  color: gold;
}

.star-empty {
  color: #ccc;
}

.q-icon {
  font-size: 20px;
}
</style>
