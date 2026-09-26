{
  onSourceDamagingHit(damage, target, source, move) {
    if (target.hasAbility("shielddust")) return;
    if (target.volatiles["leechseed"]) return;
    if (this.randomChance(3, 10)) target.addVolatile("leechseed", source);
  },
  flags: {},
  name: "Parasitic Instinct",
  rating: 3
}
