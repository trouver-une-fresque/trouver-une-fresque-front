<template>
  <v-footer app>
    <v-btn
      icon
      elevation="0"
      @click="toggleTheme"
    >
      <v-icon>mdi-theme-light-dark</v-icon>
    </v-btn>
  </v-footer>
</template>

<script setup lang="ts">
  import { useTheme } from 'vuetify'

  const theme = useTheme()

  function toggleTheme() {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  }
</script>

<style scoped lang="sass"></style>
