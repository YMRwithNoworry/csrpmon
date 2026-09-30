{
  accuracy: 100,
  basePower: 70,
  category: "Physical",
  name: "Tendril Drag",
  pp: 10,
  priority: 0,
  flags: {contact:1,protect:1,mirror:1,metronome:1},
  volatileStatus: "tendrildrag",
  condition: {
    name: "tendrildrag",
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
