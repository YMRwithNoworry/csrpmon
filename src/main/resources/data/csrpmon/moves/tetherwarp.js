{
  accuracy: 100,
  basePower: 125,
  category: "Physical",
  name: "Tether Warp",
  pp: 15,
  priority: 1,
  flags: {contact:1,protect:1,mirror:1,metronome:1},
  volatileStatus: "tetherwarp",
  condition: {
    name: "tetherwarp",
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
