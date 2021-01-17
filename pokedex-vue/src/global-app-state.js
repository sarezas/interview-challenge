export const appState = {
  pokemons: undefined,
  metadata: undefined,
  selectedPokemon: undefined,
  persist: (target, targetName) => {
    localStorage.setItem(targetName, JSON.stringify(target));
  },
  retrieve: (targetName) => {
    return JSON.parse(localStorage.getItem(targetName));
  },
  clear: (targetName) => {
    localStorage.removeItem(targetName);
  },
};
