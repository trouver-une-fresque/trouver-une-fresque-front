<template>
  <v-footer app>
    <div class="footer-content d-flex justify-space-between">
      <div class="d-flex align-center">
        <span>Trouver Une Fresque</span>
      </div>
      <div>
        <v-btn
          elevation="0"
          variant="text"
        >
          Mentions légales
        </v-btn>
        <v-btn
          elevation="0"
          href="mailto:contact@trouverunefresque.org"
          variant="text"
        >
          Contact
        </v-btn>
        <v-btn
          elevation="0"
          icon
          @click="toggleTheme"
        >
          <v-icon>mdi-theme-light-dark</v-icon>
        </v-btn>
      </div>
    </div>
  </v-footer>
</template>

<script setup lang="ts">
  import { useTheme } from 'vuetify'

  const theme = useTheme()

  function toggleTheme() {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  }
</script>

<style scoped lang="sass">
  .footer-content
    max-width: 1200px
    width: 100%
    height: 100%
    margin: 0 auto
</style>
