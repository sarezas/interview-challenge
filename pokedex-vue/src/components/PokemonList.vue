<template>
  <div class="list">
    <router-link
      v-for="po in pokemons"
      :key="po.name"
      :to="{ name: 'pokemon', params: { name: po.name } }"
    >
      <div class="card" @click="updateSelectedPokemon(po)">
        <img v-if="po.sprites" class="image" :src="getFrontDefaultSprite(po.sprites)" />
        <h2 class="name">{{ po.name }}</h2>
          <svg
            @click.stop="setFavouritePokemon(po.name, $event)"
            viewBox="0 0 300 275"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            class="star"
          >
            <polygon :fill="po.isFavourite ? '#fff' : 'none'" stroke="#eee"
            stroke-width="20" points="150,25 179,111 269,111 197,165 223,251
            150,200 77,251 103,165 31,111 121,111" />
          </svg>
      </div>
    </router-link>
  </div>
</template>

<script>
import axios from 'axios';
import pokemon from '@/components/Pokemon';
import { appState } from '@/global-app-state';

export default {
  components: {
    pokemon,
  },
  name: 'pokemon-list',
  data() {
    return {
      pokemons: [],
    };
  },
  methods: {
    updateSelectedPokemon(pokemon) {
      appState.selectedPokemon = pokemon;
      appState.clear('selectedPokemon');
      appState.persist(pokemon, 'selectedPokemon');
    },
    getPokemons() {
      const url = 'https://pokeapi.co/api/v2/pokemon?limit=10';
    
      return axios
        .get(url)
        .then((res) => {
          const { results: pokemonsFromApi } = res.data;
          
          this.pokemons = (pokemonsFromApi).map((p) => {
            return {
              name: p.name,
              metadaUrl: p.url,
              isFavourite: p.isFavourite || false,
              sprites: p.sprites || {},
              types: [],
              stats: [],
            };
          });
        })
        .catch(e => console.log(e));
    },
    getMetaData() {
      const metadataPromises = this.pokemons.map((p) => axios.get(p.metadaUrl));

      return Promise.all(metadataPromises)
        .then((res) => {
          this.metadata = res.map((r) => r.data);
        })
        .catch((e) => console.log(e));
    },
    getSprites: (metadata, pokemon) => {
      return metadata
        .filter((data) => data.forms.find((f) => f.name === pokemon.name))
        .map((d) => d.sprites)[0];
    },
    getTypes: (metadata, pokemon) => {
      return metadata.filter(data => data.forms.find(f => f.name === pokemon.name)).map(d => d.types);
    },
    getStats: (metadata, pokemon) => {
      return metadata.filter(data => data.forms.find(f => f.name === pokemon.name)).map(d => d.stats);
    },
    getFrontDefaultSprite(sprites) {
      return sprites.front_default;
    },
    setFavouritePokemon(name, event) {
      event.preventDefault();

      const targetPokemon = this.pokemons.find(p => p.name === name);
      targetPokemon.isFavourite = !targetPokemon.isFavourite;

      appState.persist(this.pokemons, 'pokemons');
    },
  },
  // Quest 1 - Fetch pokemon data
  created() {
    const pokemonsFromAppState = appState.retrieve('pokemons');

    if (pokemonsFromAppState) {
      this.pokemons = pokemonsFromAppState;
    } else {
      this.getPokemons()
        .then(() => {
          return this.getMetaData();
        })
        .then(() => {
          this.pokemons = this.pokemons.map((p) => {
            return {
              name: p.name,
              metadaUrl: p.url,
              isFavourite: p.isFavourite,
              sprites: this.getSprites(this.metadata, p),
              types: this.getTypes(this.metadata, p),
              stats: this.getStats(this.metadata, p),
            };
          }).sort();

          appState.persist(this.pokemons, 'pokemons');
        });
    }
  },
};
</script>

<style lang='scss' scoped>
.list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  grid-gap: 20px;
  justify-items: stretch;
  max-width: 1000px;
  margin: 0 auto;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #dc6464;
  border-radius: 32px;
  box-shadow: 6px 6px 10px rgba(160, 73, 73, 0.5),
    -6px -6px 10px rgba(230, 146, 146, 0.5);
}

.image {
  max-width: 150px;
}

.name {
  margin-bottom: 10px;
  color: #eee;
  text-align: center;
  text-transform: capitalize;
}

.star {
  width: 40px;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 40px;
  box-shadow: 6px 6px 10px rgba(160, 73, 73, 0.5),
    -6px -6px 10px rgba(230, 146, 146, 0.5);

  &:active {
    box-shadow: 3px 3px 7px rgba(160, 73, 73, 0.5) inset,
      -3px -3px 7px rgba(230, 146, 146, 0.5) inset;
  }
}
</style>
