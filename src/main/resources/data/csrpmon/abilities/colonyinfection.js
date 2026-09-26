{
  onModifySpePriority: 5,
  onModifySpe(spe, pokemon) {
    const others = pokemon.side.active.concat(pokemon.side.foe.active);
    for (const ally of others) {
      if (ally && ally !== pokemon && !ally.fainted && ally.hasType("Bug")) return this.chainModify(1.5);
    }
  },
  flags: {},
  name: "Colony Infection",
  rating: 3
}
