{
  accuracy: 100,
  basePower: 25,
  category: "Physical",
  name: "Incomplete Adhesion",
  pp: 15,
  priority: 0,
  flags: {contact:1,protect:1,mirror:1,metronome:1},
  volatileStatus: "incompleteadhesion",
  condition: {
    name: "incompleteadhesion",
    noCopy: true,
    onResidualOrder: 8,
    onResidual(pokemon) {
      this.damage(pokemon.maxhp / 16, pokemon, this.effectState.source);
    },
  },
  secondary: null,
  target: "normal",
  type: "Bug",
  contestType: "Clever",
}
