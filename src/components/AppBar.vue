<template>
  <v-toolbar>
    <!-- main logo -->
    <router-link to="/">
      <v-img
        contain
        src="/assets/images/svg/tuf-logo-landscape.webp"
        width="200"
      />
    </router-link>
    <v-spacer />

    <!-- navigation links -->
    <v-tabs
      v-model="activeTab"
      color="primary"
      hide-slider
    >
      <v-tab
        v-for="link in links"
        :key="link.id"
        :append-icon="link.icon"
        exact
        :ripple="false"
        :to="link.to"
        variant="plain"
      >
        {{ link.text }}
      </v-tab>
    </v-tabs>
  </v-toolbar>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'

  const activeTab = ref(0)
  const route = useRoute()

  const links = [
    { id: 1, to: '/carte', text: 'carte', icon: 'mdi-map' },
    { id: 2, to: '/apropos', text: 'About', icon: 'mdi-information' },
  ]
</script>

<style scoped lang="sass"></style>
