{
  accuracy: 100,
  basePower: 30,
  category: "Special",
  name: "Sixfold Volley",
  pp: 10,
  priority: 0,
  flags: {protect:1,mirror:1,metronome:1},
  volatileStatus: "sixfoldvolley",
  condition: {
    name: "sixfoldvolley",
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
