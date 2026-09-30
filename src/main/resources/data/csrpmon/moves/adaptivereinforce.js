{
  accuracy: true,
  basePower: 0,
  category: "Status",
  name: "Adaptive Reinforce",
  pp: 10,
  priority: 0,
  flags: {snatch:1,metronome:1},
  boosts: {def: 1},
  volatileStatus: "adaptivereinforce",
  condition: {
    name: "adaptivereinforce",
    noCopy: true,
    onResidualOrder: 8,
    onResidual(pokemon) {
      this.effectState.turns = (this.effectState.turns || 0) + 1;
    },
    onSourceModifyDamage(damage, source, target, move) {
      const turns = this.effectState.turns || 0;
      if (turns > 0) this.debug("adaptation reduces damage");
      if (turns >= 1) return this.chainModify(0.8);
    },
  },
  secondary: null,
  target: "self",
  type: "Bug",
  contestType: "Clever",
}
