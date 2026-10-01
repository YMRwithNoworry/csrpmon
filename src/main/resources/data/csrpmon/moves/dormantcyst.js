{
  accuracy: true,
  basePower: 0,
  category: "Status",
  name: "Dormant Cyst",
  pp: 15,
  priority: 0,
  flags: {snatch:1,metronome:1},
  volatileStatus: "dormantcyst",
  condition: {
    name: "dormantcyst",
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
  type: "Ground",
  contestType: "Clever",
}
