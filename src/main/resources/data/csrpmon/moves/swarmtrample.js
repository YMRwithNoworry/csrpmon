{
  accuracy: 100,
  basePower: 60,
  category: "Physical",
  name: "Swarm Trample",
  pp: 10,
  priority: 1,
  flags: {contact:1,protect:1,mirror:1,metronome:1},
  volatileStatus: "swarmtrample",
  condition: {
    name: "swarmtrample",
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
      this.damage(pokemon.maxhp * layers / 16, pokemon, this.effectState.source);
    },
    onTrapPokemon(pokemon) {
      if ((this.effectState.layers || 1) >= 3) pokemon.tryTrap();
    },
  },
  secondary: {chance: 100, boosts: {def: -1}},
  target: "normal",
  type: "Normal",
  contestType: "Clever",
}
