{
  onModifySpePriority: 5,
  onModifySpe(spe, pokemon) {
    if (pokemon.hp <= pokemon.maxhp / 2) return this.chainModify(1.5);
  },
  onSetStatus(status, target, source, effect) {
    if (status.id !== "slp" && status.id !== "par") return;
    if (effect && effect.status) this.add("-immune", target, "[from] ability: Primitive Wildness");
    return false;
  },
  flags: {},
  name: "Primitive Wildness",
  rating: 4
}
