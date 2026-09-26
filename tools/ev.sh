#!/bin/sh
cd "D:/code/MC模组/csrp/src/main/java/alku/csrp/entity"
wc -l PrimitiveVariantEntity.java
echo "=== per-type branch hints ==="
grep -n -E 'case "|getType\(\) ==|ModEntities\.[A-Z_]+\.get\(\)' PrimitiveVariantEntity.java | head -40