#!/usr/bin/env bash
# Usage: ./scripts/create-mvp.sh <slug> "<Korean title>"
# Example: ./scripts/create-mvp.sh my-app "내 앱"

set -e

SLUG="$1"
TITLE="$2"

if [[ -z "$SLUG" || -z "$TITLE" ]]; then
  echo "Usage: $0 <slug> \"<title>\""
  echo "Example: $0 my-app \"내 앱\""
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP_DIR="$ROOT/src/app/($SLUG)/$SLUG"
MIDDLEWARE="$ROOT/src/middleware.ts"

# PascalCase: my-app → MyApp (compatible with bash 3 / macOS)
PASCAL=$(python3 -c "
s = '$SLUG'
print(''.join(w.capitalize() for w in s.replace('-', ' ').split()))
")

# ── 1. Create directory ──────────────────────────────────────────────────────
echo "→ Creating $APP_DIR"
mkdir -p "$APP_DIR"

# ── 2. layout.tsx ─────────────────────────────────────────────────────────
cat > "$APP_DIR/layout.tsx" << TSXEOF
export default function ${PASCAL}Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
TSXEOF
echo "→ Created layout.tsx"

# ── 3. page.tsx ──────────────────────────────────────────────────────────────
cat > "$APP_DIR/page.tsx" << TSXEOF
export const dynamic = 'force-dynamic'

export default function ${PASCAL}Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-2xl font-bold text-foreground mb-2">${TITLE}</h1>
      <p className="text-muted-foreground text-sm">
        이 파일을 수정하여 ${TITLE}를 시작하세요.
      </p>
    </div>
  )
}
TSXEOF
echo "→ Created page.tsx"

# ── 4. Patch middleware.ts ─────────────────────────────────────────────────
ROUTE="    '/$SLUG/:path*',"
MARKER="    // 새 MVP 추가 시 아래에 한 줄 추가:"

if grep -qF "/$SLUG/:path*" "$MIDDLEWARE"; then
  echo "→ middleware.ts already contains /$SLUG/:path* — skipping"
else
  sed -i '' "s|$MARKER|$ROUTE\n$MARKER|" "$MIDDLEWARE"
  echo "→ Patched middleware.ts"
fi

# ── Done ─────────────────────────────────────────────────────────────────────
echo ""
echo "✓ Done! Next steps:"
echo "  1. Add a card to src/app/page.tsx mvps array"
echo "  2. Run: npm run dev"
echo "  3. Visit: http://localhost:3000/$SLUG"
