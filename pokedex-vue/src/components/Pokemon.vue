<template>
  <div v-if="selectedPokemon" class="info">
    <div v-if="selectedPokemon.sprites" class="images">
      <img class="image" :src="selectedPokemon.sprites.front_default" />
      <img class="image" :src="selectedPokemon.sprites.back_default" />
    </div>
    <h2 class="name">
      {{ selectedPokemon.name }}
    </h2>
    <div class="types">
      <div class="type" />
    </div>
    <table border="1" class="stats">
      <tbody>
        <tr>
          <th>stat</th>
          <th v-for="s in selectedPokemon.stats" :key="s.stat.name">
            {{ s.stat.name }}
          </th>
        </tr>
        <tr>
          <th>base</th>
          <td v-for="s in selectedPokemon.stats" :key="s.stat.name">
            {{ s.base_stat }}
          </td>
        </tr>
        <tr>
          <th>effort</th>
          <td v-for="s in selectedPokemon.stats" :key="s.stat.name">
            {{ s.effort }}
          </td>
        </tr>
      </tbody>
    </table>

    <router-link :to="{ name: 'home' }">Back</router-link>
  </div>
</template>

<script>
import { appState } from "@/global-app-state";

export default {
  name: "pokemon",
  // data prop must be a function with a return statement
  data() {
    return {
      selectedPokemon: {},
    };
  },
  mounted() {
    const isSamePokemon = window.location.href.includes(
      this.$route.params.name
    );

    this.selectedPokemon =
      appState.selectedPokemon || appState.retrieve('selectedPokemon');
  },
};
</script>

<style lang="scss" scoped>
.info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.images {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

.image {
  flex-grow: 1;
  max-width: 200px;
  margin: 20px;
  border-radius: 200px;
  box-shadow: 6px 6px 10px rgba(160, 73, 73, 0.5),
    -6px -6px 10px rgba(230, 146, 146, 0.5);
}

.name {
  margin-bottom: 20px;
  text-transform: capitalize;
}

.types {
  display: flex;
  margin-bottom: 20px;
}

.type {
  padding: 10px;
  margin: 10px;
  font-weight: 500;
  border-radius: 10px;
  box-shadow: 6px 6px 10px rgba(160, 73, 73, 0.5),
    -6px -6px 10px rgba(230, 146, 146, 0.5);
}

.stats {
  margin-bottom: 2rem;

  th, td {
    padding: 1rem;

    text-align: center;
    text-justify: center;
    text-transform: capitalize;
  }
}
</style>
