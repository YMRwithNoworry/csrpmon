{
  accuracy: true,
  basePower: 0,
  category: "Status",
  name: "Nest Establishment",
  pp: 25,
  priority: 0,
  heal: [1, 2],
  flags: {snatch:1,metronome:1},
  volatileStatus: "nestestablishment",
  condition: {
    name: "nestestablishment",
    noCopy: true,
    onResidualOrder: 8,
    onResidual(pokemon) {
      this.damage(pokemon.maxhp / 8, pokemon, this.effectState.source);
    },
  },
  secondary: null,
  target: "self",
  type: "Grass",
  contestType: "Clever",
}
