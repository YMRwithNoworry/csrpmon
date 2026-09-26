【资料冲突】本对关系未被源码确认。

- 版本 A（命名约定）：`pri_devourer` 与 `ada_devourer` 成对存在，暗示同一物种的两个成熟度。
- 版本 B（`ParasiteTransformation.java`）：`evolutionType()` 中明确写着
  `if (type == ModEntities.PRI_BURROWER.get() || type == ModEntities.PRI_DEVOURER.get()`
  `    || type == ModEntities.PRI_TOZOON.get()) { return null; }`
  —— 也就是说，**这三个原生体被显式排除在 pri_ -> ada_ 的转化路径之外**，
  `devolutionType()` 同样排除了对应的三个适应形态。
- 本次采用：**不承认二者之间存在转化关系**。两只实体都真实存在、都可以设计，
  但它们之间的关系标注为【待核实】。

同样受影响：`pri_burrower` / `ada_burrower`、`pri_tozoon` / `ada_tozoon`。
（其余 9 组 pri_/ada_ 配对不受影响，转化路径在代码中成立。）
