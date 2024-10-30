<template>
  <div class="lw-container">
    <div
      v-for="workshop in workshops"
      :key="workshop.id"
    >
      <img
        class="workshop-logo"
        v-if="workshop.promoted"
        :src="workshop.logo"
        :alt="workshop.name"
      />
    </div>
  </div>
</template>

<script setup>
  import { ATELIERS } from '@/common/Conf'

  const workshops = ref(ATELIERS)
</script>

<style scoped></style>
