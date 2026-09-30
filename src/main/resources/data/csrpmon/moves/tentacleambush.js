{
  accuracy: 100,
  basePower: 85,
  category: "Physical",
  name: "Tentacle Ambush",
  pp: 10,
  priority: 1,
  flags: {contact:1,protect:1,mirror:1,metronome:1},
  volatileStatus: "tentacleambush",
  condition: {
    name: "tentacleambush",
    noCopy: true,
    onResidualOrder: 8,
    onResidual(pokemon) {
    },
    onTrapPokemon(pokemon) {
      pokemon.tryTrap();
    },
  },
  secondary: {chance: 100, boosts: {spe: -1}},
  target: "normal",
  type: "Water",
  contestType: "Clever",
}
