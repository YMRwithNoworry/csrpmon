{
  accuracy: true,
  basePower: 0,
  category: "Status",
  name: "Berserk Infection",
  pp: 25,
  priority: 0,
  flags: {snatch:1,metronome:1},
  boosts: {atk: 1},
  volatileStatus: "berserkinfection",
  condition: {
    name: "berserkinfection",
    noCopy: true,
    onResidualOrder: 8,
    onResidual(pokemon) {
      this.damage(pokemon.maxhp / 8, pokemon, this.effectState.source);
    },
  },
  secondary: null,
  target: "self",
  type: "Dark",
  contestType: "Clever",
}
