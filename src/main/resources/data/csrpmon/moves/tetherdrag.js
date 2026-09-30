{
  accuracy: true,
  basePower: 0,
  category: "Status",
  name: "Tether Drag",
  pp: 10,
  priority: 0,
  flags: {snatch:1,metronome:1},
  volatileStatus: "tetherdrag",
  condition: {
    name: "tetherdrag",
    noCopy: true,
    onResidualOrder: 8,
    onResidual(pokemon) {
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
