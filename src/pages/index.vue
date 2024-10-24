<template>
  <v-container max-width="1200px">
    <v-card class="search-card">
      <v-card-title
        class="d-flex justify-center"
        max-width="900px"
      >
        <h1>Trouvez une Fresque près de chez vous</h1>
      </v-card-title>
      <v-card-text class="d-flex justify-center">
        <v-text-field
          class="search-bar"
          label="Localisation"
          max-width="900px"
          variant="solo"
        ></v-text-field>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
  //
</script>

<style lang="scss" scoped>
  .search-card {
    background: linear-gradient(
      45deg,
      rgba(var(--v-theme-secondary), 0.6),
      rgba(var(--v-theme-primary), 0.6)
    );
  }
</style>
