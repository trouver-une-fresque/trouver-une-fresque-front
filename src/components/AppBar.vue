<template>
  <v-toolbar class="d-flex justify-center align-center">
    <div class="toolbar-content d-flex flex-row align-center">
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

      <!-- navigation links (for md devices and bigger) -->
      <v-tabs
        class="d-none d-sm-flex"
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
          variant="text"
        >
          {{ link.text }}
        </v-tab>
      </v-tabs>

      <!-- navigation links (for small devices) -->
      <v-menu v-model="menu">
        <template #activator="{ props }">
          <v-btn
            class="d-flex d-sm-none"
            v-bind="props"
            icon
          >
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="link in links"
            :key="link.id"
            :to="link.to"
            @click="menu = false"
            :append-icon="link.icon"
            color="primary"
            :title="link.text"
          >
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-toolbar>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useTheme } from 'vuetify'
  import { useRoute } from 'vue-router'

  const activeTab = ref(0)
  const route = useRoute()
  const menu = ref(false)

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

<style scoped lang="sass">
  .toolbar-content
    max-width: 1200px
    width: 100%
    height: 100%
    margin: 0 auto
</style>
