{
  accuracy: true,
  basePower: 0,
  category: "Status",
  name: "Tether Shot",
  pp: 15,
  priority: 0,
  flags: {snatch:1,metronome:1},
  volatileStatus: "tethershot",
  condition: {
    name: "tethershot",
    noCopy: true,
    onResidualOrder: 8,
    onResidual(pokemon) {
    },
    onTrapPokemon(pokemon) {
      pokemon.tryTrap();
    },
  },
  secondary: null,
  target: "self",
  type: "Bug",
  contestType: "Clever",
}
