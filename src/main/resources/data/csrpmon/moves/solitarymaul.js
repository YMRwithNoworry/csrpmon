{
  accuracy: 100,
  basePower: 110,
  category: "Physical",
  name: "Solitary Maul",
  pp: 10,
  priority: 0,
  recoil: [1, 4],
  flags: {contact:1,protect:1,mirror:1,metronome:1},
  volatileStatus: "solitarymaul",
  condition: {
    name: "solitarymaul",
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
  type: "Fighting",
  contestType: "Clever",
}
