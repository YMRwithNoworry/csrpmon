{
  accuracy: 95,
  basePower: 25,
  category: "Physical",
  name: "Hive Bite",
  pp: 15,
  priority: 0,
  flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
  multihit: [2, 3],
  onBasePowerPriority: 7,
  onBasePower(basePower, attacker, defender, move) {
    if (defender.status) return this.chainModify(1.5);
  },
  secondary: null,
  target: "normal",
  type: "Bug",
  contestType: "Tough"
}
