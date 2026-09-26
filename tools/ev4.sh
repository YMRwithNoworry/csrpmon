#!/bin/sh
cd "D:/code/MC模组/csrp/src/main/java/alku/csrp"
echo "=== biomass registration ==="
grep -n "biomass" registry/ModEntities.java | head -4
echo "=== summonBiomass body ==="
sed -n "124,145p" entity/SummonerEntity.java
echo "=== canon tier for biomass ==="
cd "D:/code/MC模组/csrppokemon" && node -e 'const c=require("./encyclopedia/canon/srp-creatures.json");const b=c.creatures.find(x=>x.id==="biomass");console.log("as creature:",b?b.tier+" / "+b.entityCategory:"NOT a creature");console.log("in nonCreatures:", c.nonCreatures.some(x=>x.sourceId==="csrp:biomass"))'