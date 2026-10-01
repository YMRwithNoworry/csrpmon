{
  accuracy: 100,
  basePower: 150,
  category: "Physical",
  name: "Wind-Up Smash",
  pp: 15,
  priority: 0,
  flags: {contact:1,protect:1,mirror:1,metronome:1},
  volatileStatus: "windupsmash",
  condition: {
    name: "windupsmash",
    noCopy: true,
    onResidualOrder: 8,
    onResidual(pokemon) {
    },
    onTrapPokemon(pokemon) {
      pokemon.tryTrap();
    },
  },
  secondary: null,
  target: "normal",
  type: "Steel",
  contestType: "Clever",
}
