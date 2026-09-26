{
  accuracy: 90,
  basePower: 25,
  category: "Physical",
  name: "Rending Claws",
  pp: 10,
  priority: 0,
  flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
  multihit: [2, 5],
  onModifyMove(move, pokemon, target) {
    if (target && (target.status === "psn" || target.status === "tox")) {
      move.multihit = 5;
      move.drain = [1, 5];
    }
  },
  secondary: null,
  target: "normal",
  type: "Fighting",
  contestType: "Tough"
}
