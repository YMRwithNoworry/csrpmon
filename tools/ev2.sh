#!/bin/sh
cd "D:/code/MC模组/csrp/src/main/java/alku/csrp/entity"
echo "=== kind enum ==="
grep -n -E "enum Kind|ARACHNIDA,|applyScaryOrbEffect" AdaptedVariantEntity.java | head -8
echo "=== per-kind effect switch ==="
sed -n "/switch (activeKind())/,/^        }/p" AdaptedVariantEntity.java | head -70