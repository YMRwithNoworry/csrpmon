{
  accuracy: true,
  basePower: 0,
  category: "Status",
  name: "Parasitic Mimicry",
  pp: 20,
  priority: 0,
  flags: {snatch:1,metronome:1},
  volatileStatus: "parasiticmimicry",
  condition: {
    name: "parasiticmimicry",
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
  type: "Normal",
  contestType: "Clever",
}
