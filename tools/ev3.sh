#!/bin/sh
cd "D:/code/MC模组/csrp/src/main/java/alku/csrp"
echo "=== summoner tables in config ==="
grep -n -E "summoner.*(MobTable|Summon|summon)" config/MobsConfig.java | head -12
echo "=== defaults ==="
grep -n -A 6 "summonerMobTable|summonerSummonList|SummonerMobTable" config/MobsConfig.java | head -20
echo "=== SummonerEntity summon source ==="
grep -n -E "MobsConfig\.|spawnTable|SUMMON|summon" entity/SummonerEntity.java | head -20