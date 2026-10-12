#!/usr/bin/env bash
# Builds src/fonts/display-{light,bold}.woff2 from GmarketSans (SIL OFL 1.1, © 2019 eBay Korea Co., Ltd.).
# Subset: KS X 1001 Hangul (2,350 syllables) + Latin/punctuation. Renamed to "Elipair Display" because the
# OFL forbids the Reserved Font Name on modified fonts. Needs fonttools + brotli:
#   python3 -m venv /tmp/fontenv && /tmp/fontenv/bin/pip install fonttools brotli && PATH=/tmp/fontenv/bin:$PATH ./scripts/subset-display-font.sh
set -euo pipefail
OUT="$(cd "$(dirname "$0")/.." && pwd)/src/fonts"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$OUT"

python3 - "$TMP/hangul.txt" <<'PY'
import sys
chars = [chr(c) for c in range(0xAC00, 0xD7A4) if len(chr(c).encode("euc_kr", "ignore")) == 2]
assert len(chars) == 2350, len(chars)
open(sys.argv[1], "w").write("".join(chars))
PY

for weight in Light Bold; do
  lower=$(printf '%s' "$weight" | tr '[:upper:]' '[:lower:]')
  curl -fsSL "https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSans$weight.woff" -o "$TMP/$weight.woff"
  pyftsubset "$TMP/$weight.woff" \
    --text-file="$TMP/hangul.txt" \
    --unicodes="U+0020-007E,U+00A0-00FF,U+2010-2027,U+2030-205E,U+2190-21FF,U+3000-303F,U+3131-318E" \
    --layout-features='*' --flavor=woff2 --output-file="$TMP/$lower.woff2"
  python3 - "$TMP/$lower.woff2" "$OUT/display-$lower.woff2" "$weight" <<'PY'
import sys
from fontTools.ttLib import TTFont
src, dst, weight = sys.argv[1:]
names = {1: "Elipair Display", 3: f"Elipair Display {weight} subset", 4: f"Elipair Display {weight}",
         6: f"ElipairDisplay-{weight}", 16: "Elipair Display"}
font = TTFont(src)
table = font["name"]
# The source lacks some IDs (e.g. family) and embeds the original name in others: drop those, then set ours.
for record in list(table.names):
    if record.nameID in names or "gmarket" in record.toUnicode().lower():
        table.removeNames(nameID=record.nameID)
for name_id, value in names.items():
    table.setName(value, name_id, 3, 1, 0x409)
    table.setName(value, name_id, 1, 0, 0)
font.flavor = "woff2"
font.save(dst)
PY
done

curl -fsSL https://openfontlicense.org/documents/OFL.txt | tail -n +6 > "$TMP/ofl-body.txt"
{
  echo "Copyright (c) 2019, eBay Korea Co., Ltd., with Reserved Font Name Gmarket Sans Font."
  echo "Modified (subset, renamed to \"Elipair Display\") for em-h20.github.io."
  cat "$TMP/ofl-body.txt"
} > "$OUT/OFL.txt"
ls -la "$OUT"
