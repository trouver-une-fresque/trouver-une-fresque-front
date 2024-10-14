<template>
  <v-toolbar height="90px">
    <!-- main logo -->

    <v-img
      contain
      max-width="250"
      src="/assets/images/svg/tuf-logo-landscape.webp"
      to="/"
    />
    <v-spacer />

    <!-- navigation links -->
    <v-tabs
      v-model="activeTab"
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
import { ref } from "vue";
import { useRoute } from "vue-router";

const activeTab = ref(0);
const route = useRoute();

const links = [
  { id: 1, to: "/carte", text: "carte", icon: "mdi-map" },
  { id: 2, to: "/apropos", text: "About", icon: "mdi-information" },
  { id: 3, to: "/contact", text: "Contact", icon: "mdi-email" },
];
</script>

<style scoped lang="sass"></style>
