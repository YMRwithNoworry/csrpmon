{
  accuracy: 100,
  basePower: 120,
  category: "Physical",
  name: "Warden Grasp",
  pp: 15,
  priority: 0,
  flags: {contact:1,protect:1,mirror:1,metronome:1},
  volatileStatus: "wardengrasp",
  condition: {
    name: "wardengrasp",
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
  type: "Ground",
  contestType: "Clever",
}
