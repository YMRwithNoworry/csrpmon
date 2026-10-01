{
  accuracy: 100,
  basePower: 105,
  category: "Physical",
  name: "Aerial Drop",
  pp: 15,
  priority: 1,
  flags: {contact:1,protect:1,mirror:1,metronome:1},
  volatileStatus: "aerialdrop",
  condition: {
    name: "aerialdrop",
    noCopy: true,
    onStart(target) {
      this.effectState.layers = Math.min(3, (this.effectState.layers || 0) + 1);
      this.add("-start", target, "Infection", "[layers] " + this.effectState.layers);
    },
    onRestart(target) {
      this.effectState.layers = Math.min(3, (this.effectState.layers || 0) + 1);
      this.add("-start", target, "Infection", "[up]");
    },
    onResidualOrder: 8,
    onResidual(pokemon) {
      const layers = this.effectState.layers || 1;
      this.damage(pokemon.maxhp * layers / 12, pokemon, this.effectState.source);
    },
    onTrapPokemon(pokemon) {
      if ((this.effectState.layers || 1) >= 3) pokemon.tryTrap();
    },
  },
  secondary: {chance: 100, boosts: {spe: -1}},
  target: "normal",
  type: "Flying",
  contestType: "Clever",
}
