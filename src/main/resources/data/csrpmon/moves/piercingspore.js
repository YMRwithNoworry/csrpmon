{
  accuracy: 100,
  basePower: 45,
  category: "Special",
  name: "Piercing Spore",
  pp: 20,
  priority: 0,
  flags: {protect:1,mirror:1,metronome:1},
  volatileStatus: "piercingspore",
  condition: {
    name: "piercingspore",
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
  secondary: null,
  target: "normal",
  type: "Grass",
  contestType: "Clever",
}
