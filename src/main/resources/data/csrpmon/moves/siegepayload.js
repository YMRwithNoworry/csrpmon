{
  accuracy: 100,
  basePower: 150,
  category: "Physical",
  name: "Siege Payload",
  pp: 10,
  priority: 0,
  flags: {contact:1,protect:1,mirror:1,metronome:1},
  volatileStatus: "siegepayload",
  condition: {
    name: "siegepayload",
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
  secondary: {chance: 100, boosts: {def: -1}},
  target: "normal",
  type: "Flying",
  contestType: "Clever",
}
