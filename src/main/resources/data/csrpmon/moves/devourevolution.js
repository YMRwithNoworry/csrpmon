{
  accuracy: 100,
  basePower: 75,
  category: "Physical",
  name: "Devour Evolution",
  pp: 10,
  priority: 0,
  flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
  onAfterMoveSecondarySelf(source, target, move) {
    if (!target || !target.fainted) return;
    const roll = this.random(5);
    if (roll === 0) this.boost({ atk: 1 }, source);
    else if (roll === 1) this.boost({ def: 1 }, source);
    else if (roll === 2) this.boost({ spa: 1 }, source);
    else if (roll === 3) this.boost({ spd: 1 }, source);
    else this.boost({ spe: 1 }, source);
  },
  secondary: null,
  target: "normal",
  type: "Dark",
  contestType: "Cool"
}
