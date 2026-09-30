{
  accuracy: 100,
  basePower: 85,
  category: "Physical",
  name: "Detach Tendril",
  pp: 10,
  priority: 0,
  flags: {contact:1,protect:1,mirror:1,metronome:1},
  volatileStatus: "detachtendril",
  condition: {
    name: "detachtendril",
    noCopy: true,
    onResidualOrder: 8,
    onResidual(pokemon) {
      this.damage(pokemon.maxhp / 4, pokemon, this.effectState.source);
    },
  },
  secondary: null,
  target: "normal",
  type: "Dark",
  contestType: "Clever",
}
