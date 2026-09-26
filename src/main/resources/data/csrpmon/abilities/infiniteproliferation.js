{
  onModifyAtkPriority: 5,
  onModifyAtk(atk, attacker, defender, move) {
    if (attacker.hp <= attacker.maxhp * 0.3) return this.chainModify(1.5);
  },
  onModifySpePriority: 5,
  onModifySpe(spe, pokemon) {
    if (pokemon.hp <= pokemon.maxhp * 0.3) return this.chainModify(1.5);
  },
  flags: {},
  name: "Infinite Proliferation",
  rating: 4
}
