{
  accuracy: 100,
  basePower: 45,
  category: "Special",
  name: "Web Volley",
  pp: 10,
  priority: 0,
  flags: {protect:1,mirror:1,metronome:1},
  volatileStatus: "webvolley",
  condition: {
    name: "webvolley",
    noCopy: true,
    onResidualOrder: 8,
    onResidual(pokemon) {
    },
    onTrapPokemon(pokemon) {
      pokemon.tryTrap();
    },
  },
  secondary: {chance: 100, boosts: {spe: -1}},
  target: "normal",
  type: "Bug",
  contestType: "Clever",
}
