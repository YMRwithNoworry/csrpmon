{
  accuracy: 100,
  basePower: 0,
  category: "Status",
  name: "Dominion Order",
  pp: 15,
  priority: 0,
  flags: {snatch:1,metronome:1},
  boosts: {atk: 1},
  volatileStatus: "dominionorder",
  condition: {
    name: "dominionorder",
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
  target: "self",
  type: "Psychic",
  contestType: "Clever",
}
