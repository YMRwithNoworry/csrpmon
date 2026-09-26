{
  onBasePowerPriority: 7,
  onBasePower(basePower, attacker, defender, move) {
    if (defender.volatiles["leechseed"]) return this.chainModify(1.3);
  },
  flags: {},
  name: "Hive Swarm",
  rating: 3
}
