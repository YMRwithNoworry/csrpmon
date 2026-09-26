{
  onSourceAfterFaint(length, target, source, effect) {
    if (!effect || effect.effectType !== "Move") return;
    const roll = this.random(5);
    if (roll === 0) this.boost({ atk: 1 }, source);
    else if (roll === 1) this.boost({ def: 1 }, source);
    else if (roll === 2) this.boost({ spa: 1 }, source);
    else if (roll === 3) this.boost({ spd: 1 }, source);
    else this.boost({ spe: 1 }, source);
  },
  flags: {},
  name: "Adaptive Mutation",
  rating: 4
}
