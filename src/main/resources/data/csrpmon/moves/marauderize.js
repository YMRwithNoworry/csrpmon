{
  accuracy: true,
  basePower: 0,
  category: "Status",
  name: "Marauderize",
  pp: 10,
  priority: 0,
  flags: {snatch:1,metronome:1},
  boosts: {atk: 1},
  volatileStatus: "marauderize",
  condition: {
    name: "marauderize",
    noCopy: true,
    onResidualOrder: 8,
    onResidual(pokemon) {
      this.damage(pokemon.maxhp / 8, pokemon, this.effectState.source);
    },
    onTrapPokemon(pokemon) {
      pokemon.tryTrap();
    },
  },
  secondary: null,
  target: "self",
  type: "Bug",
  contestType: "Clever",
}
