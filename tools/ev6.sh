#!/bin/sh
cd "D:/code/MC模组/csrp/src/main/java/alku/csrp/entity"
echo "=== adapted longarms: orb or not? ==="
grep -n -E "ParasiteSkillGoal|ScaryOrb|scaryOrb" AdaptedVariantEntity.java | head -10
echo "=== LONGARMS constants usage ==="
grep -n -E "LONGARMS_MELEE_RANGE_SQR|LONGARMS_ATTACK_INTERVAL_TICKS" AdaptedVariantEntity.java | head -8
echo "=== LongarmsMeleeGoal ==="
grep -n -A 14 "class LongarmsMeleeGoal" AdaptedVariantEntity.java | head -20