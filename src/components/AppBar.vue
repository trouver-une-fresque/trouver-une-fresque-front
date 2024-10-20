<template>
  <v-toolbar class="d-flex">
    <!-- main logo -->
    <router-link
      class="h-100"
      to="/"
    >
      <v-img
        alt="TUF logo"
        :src="currentLogo"
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
  import { ref, computed } from 'vue'
  import { useTheme } from 'vuetify'
  import { useRoute } from 'vue-router'

  const activeTab = ref(0)
  const route = useRoute()

  const links = [
    { id: 1, to: '/carte', text: 'carte', icon: 'mdi-map' },
    { id: 2, to: '/apropos', text: 'About', icon: 'mdi-information' },
  ]

  const theme = useTheme()

  const currentLogo = computed(() => {
    return theme.global.current.value.dark
      ? '/assets/images/svg/tuf-logo-landscape-white-font.webp'
      : '/assets/images/svg/tuf-logo-landscape.webp'
  })
</script>

<style scoped lang="sass"></style>
