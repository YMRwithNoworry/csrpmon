{
  accuracy: true,
  basePower: 0,
  category: "Status",
  name: "Corrosion Mark",
  pp: 25,
  priority: 0,
  flags: {snatch:1,metronome:1},
  volatileStatus: "corrosionmark",
  condition: {
    name: "corrosionmark",
    noCopy: true,
    onResidualOrder: 8,
    onResidual(pokemon) {
      this.effectState.turns = (this.effectState.turns || 0) + 1;
    },
    onSourceModifyDamage(damage, source, target, move) {
      const turns = this.effectState.turns || 0;
      if (turns > 0) this.debug("adaptation reduces damage");
      if (turns >= 1) return this.chainModify(0.75);
    },
  },
  secondary: null,
  target: "self",
  type: "Poison",
  contestType: "Clever",
}
