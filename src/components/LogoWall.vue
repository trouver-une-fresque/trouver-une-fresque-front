<template>
  <div class="lw-container d-flex flex-wrap justify-space-around mx-10">
    <div
      v-for="workshop in workshops"
      :key="workshop.id"
    >
      <v-tooltip
        :text="workshop.name"
        location="bottom"
      >
        <template v-slot:activator="{ props }">
          <a
            :href="workshop.website"
            target="_blank"
          >
            <v-img
              class="workshop-logo ma-5"
              v-bind="props"
              :src="workshop.logo"
              :alt="workshop.name"
              min-height="100px"
              min-width="100px"
            />
          </a>
        </template>
      </v-tooltip>
    </div>
  </div>
</template>

<script setup>
  import { ATELIERS } from '@/common/Conf'
  import { onMounted, ref } from 'vue'

  const workshops = ref([])

  onMounted(() => {
    for (const atelier of Object.values(ATELIERS)) {
      if (atelier.promoted) workshops.value.push(atelier)
    }
  })
</script>

<style scoped>
  .workshop-logo {
    transition: transform 0.3s ease;
  }

  .workshop-logo:hover {
    transform: scale(1.5);
  }
</style>
