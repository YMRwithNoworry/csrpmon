{
  onStart(pokemon) {
    this.add("-ability", pokemon, "Parasitic Nest");
  },
  onResidualOrder: 28,
  onResidualSubOrder: 1,
  onResidual(pokemon) {
    for (const foe of pokemon.foes()) {
      if (foe.hp > 0) this.damage(foe.maxhp / 16, foe, pokemon);
    }
  },
  flags: {},
  name: "Parasitic Nest",
  rating: 4
}
