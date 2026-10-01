{
  accuracy: true,
  basePower: 0,
  category: "Status",
  name: "Drop Anchor",
  pp: 15,
  priority: 0,
  heal: [1, 2],
  flags: {snatch:1,metronome:1},
  boosts: {spd: 1},
  volatileStatus: "dropanchor",
  condition: {
    name: "dropanchor",
    noCopy: true,
    onResidualOrder: 8,
    onResidual(pokemon) {
      this.damage(pokemon.maxhp / 16, pokemon, this.effectState.source);
    },
  },
  secondary: null,
  target: "self",
  type: "Bug",
  contestType: "Clever",
}
