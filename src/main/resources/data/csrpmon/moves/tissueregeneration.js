{
  accuracy: true,
  basePower: 0,
  category: "Status",
  name: "Tissue Regeneration",
  pp: 20,
  priority: 0,
  heal: [1, 2],
  flags: {snatch:1,metronome:1},
  boosts: {atk: 1},
  volatileStatus: "tissueregeneration",
  condition: {
    name: "tissueregeneration",
    noCopy: true,
    onResidualOrder: 8,
    onResidual(pokemon) {
      this.damage(pokemon.maxhp / 16, pokemon, this.effectState.source);
    },
  },
  secondary: null,
  target: "self",
  type: "Grass",
  contestType: "Clever",
}
