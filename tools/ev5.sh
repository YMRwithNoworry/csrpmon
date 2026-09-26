#!/bin/sh
cd "D:/code/MC模组/csrp/src/main/java/alku/csrp/entity"
echo "=== reeker skin constants ==="
grep -n -E "REEKER_SKIN_[A-Z]+ =|REEKER_CHARGE_[A-Z]+ =|BOLSTER_SKIN_[A-Z]+ =|DEVOURER_SKIN_[A-Z]+ =" PrimitiveVariantEntity.java | head -20
echo "=== reeker charge goal ==="
grep -n -B2 -A 12 "class ReekerRecruitFollowersGoal" PrimitiveVariantEntity.java | head -20
echo "=== longarms shockwave ==="
grep -n -E "SHOCKWAVE|shockwave|SCARY|scary|geneSpecialmove|ParasiteSkillGoal" LongarmsEntity.java | head -16