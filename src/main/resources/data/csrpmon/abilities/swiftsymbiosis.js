{
  onBasePowerPriority: 7,
  onBasePower(basePower, attacker, defender, move) {
    if (move.category === "Physical" && attacker.getStat("spe") > defender.getStat("spe")) {
      return this.chainModify(1.2);
    }
  },
  onSourceDamagingHit(damage, target, source, move) {
    if (target.hasAbility("shielddust")) return;
    if (this.randomChance(3, 10)) target.trySetStatus("psn", source);
  },
  flags: {},
  name: "Swift Symbiosis",
  rating: 3
}
