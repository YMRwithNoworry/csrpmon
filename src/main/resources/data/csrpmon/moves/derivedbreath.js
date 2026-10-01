{
  accuracy: 100,
  basePower: 225,
  category: "Special",
  name: "Derived Breath",
  pp: 15,
  priority: 0,
  flags: {protect:1,mirror:1,metronome:1},
  volatileStatus: "derivedbreath",
  condition: {
    name: "derivedbreath",
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
  secondary: null,
  target: "allAdjacentFoes",
  type: "Dragon",
  contestType: "Clever",
}
