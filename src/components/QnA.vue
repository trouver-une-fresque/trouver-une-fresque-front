<template>
  <div class="qa-container">
    <!-- title -->
    <div class="qa-title">
      <h2 class="text-primary">Qu'est-ce que Trouver une Fresque ?</h2>
      <p>
        Trouver une Fresque est un moteur de recherche recensant les ateliers de
        type Fresque en France.
      </p>
      <v-divider></v-divider>
    </div>

    <!-- items -->
    <div class="qa-items">
      <h3>Quel est l'intérêt de Trouver une Fresque ?</h3>
      <p>
        Trouver une Fresque est une plateforme qui permet de trouver un atelier
        de type Fresque dans son département. Sont actuellement recensés les
        ateliers suivants : Fresque du Climat, Atelier 2tonnes, Fresque de la
        Diversité, Fresque Océane, Fresque de la Construction, Fresque
        Agri'Alim, Fresque des Nouveaux Récits, Fresque de la Mobilité, Fresque
        de l'Alimentation, Atelier Inventons Nos Vies Bas Carbone, Atelier OGRE,
        Fresque de l'Eau, Fresque de l'Économie Circulaire, Ateliers Futurs
        Proches, Fresque du Textile, Fresque des Déchets, Fresque des frontières
        planétaires, Atelier Horizons Décarbonés, Ateliers 2030 Glorieuses,
        Fresque de la Biodiversité, Fresque du Sexisme, Fresque du Numérique,
        Puzzle Climat, Fresque de la finance, Fresque de la RSE. La réservation
        d'un atelier s'effectue via les plateformes de billetique associées.
        Nous ne sommes affiliés avec aucune de ces structures.
      </p>
      <v-divider></v-divider>

      <h3>Comment fonctionne Trouver une Fresque ?</h3>
      <p>
        Les algorithmes de Trouver une Fresque analysent les différentes
        plateformes de réservation d'ateliers Fresque (Billetweb.fr,
        Eventbrite.fr, Fresqueduclimat.org, Lafresquedeleconomiecirculaire.com)
        afin de les agréger, et rendre leur recherche plus accessible. La liste
        des ateliers recensés sur notre plateforme n'est PAS exhaustive.
      </p>
      <v-divider></v-divider>

      <h3>Trouver une Fresque est-il à but non lucratif ?</h3>
      <p>
        Oui, Trouver une Fresque est à but non lucratif. La plateforme est
        gratuite, sans pub et il n'est pas nécessaire de s'inscrire pour
        l'utiliser. Nous sommes conformes au RGPD en ne stockant aucune donnée
        personnelle, et conformes à la directive européenne sur les cookies en
        ne stockant pas de cookies. Les
        <a href="https://github.com/trouver-une-fresque/trouver-une-fresque"
          >sources sont disponibles librement</a
        >.
      </p>
      <v-divider></v-divider>

      <h3>Comment puis-je soutenir le développement de la plateforme ?</h3>
      <p>
        Construire des logiciels libres prend du temps et coûte de l'argent, non
        seulement pour effectuer le travail initial, mais aussi pour le
        maintenir dans le temps. Si vous souhaitez soutenir le développement de
        cette plateforme, vous pouvez
        <a href="https://fr.liberapay.com/trouver-une-fresque/"
          >contribuer financièrement via Liberapay</a
        >
        (le paiement se fait via PayPal). Vous pouvez aussi parler de notre
        plateforme sur les réseaux sociaux. Merci !
      </p>
      <v-divider></v-divider>

      <h3>
        Au secours, j'ai publié un évènement Fresque, qui n'apparaît pas sur
        Trouver une Fresque !
      </h3>
      <p>
        Votre évènement ne rassemble pas toutes les conditions pour être
        récupéré de manière automatique. Merci de le modifier sur la plateforme
        originale après avoir lu notre
        <a
          href="https://github.com/trouver-une-fresque/trouver-une-fresque/blob/main/TUTORIAL.md"
          >guide à l'attention des organisateurs de fresques</a
        >.
      </p>
      <v-divider></v-divider>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
  .qa-container {
    padding: 20px;
  }

  .qa-item {
    margin-bottom: 10px;
  }

  .qa-item h3 {
    cursor: pointer;
    color: #42b983;
  }

  .qa-item p {
    margin: 0;
    padding: 0 10px;
  }
</style>
