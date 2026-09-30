{
  accuracy: true,
  basePower: 0,
  category: "Status",
  name: "Call Reinforcement",
  pp: 20,
  priority: 0,
  flags: {snatch:1,metronome:1},
  volatileStatus: "callreinforcement",
  condition: {
    name: "callreinforcement",
    noCopy: true,
    onResidualOrder: 8,
    onResidual(pokemon) {
      this.damage(pokemon.maxhp / 8, pokemon, this.effectState.source);
    },
  },
  secondary: null,
  target: "self",
  type: "Bug",
  contestType: "Clever",
}
