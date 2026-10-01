{
  accuracy: 100,
  basePower: 70,
  category: "Physical",
  name: "Laceration",
  pp: 25,
  priority: 0,
  flags: {contact:1,protect:1,mirror:1,metronome:1},
  volatileStatus: "laceration",
  condition: {
    name: "laceration",
    noCopy: true,
    onResidualOrder: 8,
    onResidual(pokemon) {
      this.damage(pokemon.maxhp / 16, pokemon, this.effectState.source);
    },
  },
  secondary: null,
  target: "normal",
  type: "Normal",
  contestType: "Clever",
}
