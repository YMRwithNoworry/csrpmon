{
  accuracy: 100,
  basePower: 120,
  category: "Special",
  name: "Overlord Homing",
  pp: 15,
  priority: 0,
  flags: {protect:1,mirror:1,metronome:1},
  volatileStatus: "overlordhoming",
  condition: {
    name: "overlordhoming",
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
  type: "Psychic",
  contestType: "Clever",
}
