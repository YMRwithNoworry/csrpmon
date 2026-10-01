{
  accuracy: 100,
  basePower: 90,
  category: "Physical",
  name: "Mount Claw",
  pp: 15,
  priority: 0,
  recoil: [1, 4],
  flags: {contact:1,protect:1,mirror:1,metronome:1},
  volatileStatus: "mountclaw",
  condition: {
    name: "mountclaw",
    noCopy: true,
    onResidualOrder: 8,
    onResidual(pokemon) {
      this.damage(pokemon.maxhp / 16, pokemon, this.effectState.source);
    },
    onTrapPokemon(pokemon) {
      pokemon.tryTrap();
    },
  },
  secondary: null,
  target: "normal",
  type: "Fighting",
  contestType: "Clever",
}
