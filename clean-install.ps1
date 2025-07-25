# ניקוי קבצים
if (Test-Path "node_modules") {
  Remove-Item -Recurse -Force "node_modules"
  Write-Host "🗑️ Removed node_modules" -ForegroundColor DarkYellow
} else {
  Write-Host "📂 node_modules not found → skipping" -ForegroundColor DarkGray
}

if (Test-Path "dist") {
  Remove-Item -Recurse -Force "dist"
  Write-Host "🗑️ Removed dist" -ForegroundColor DarkYellow
} else {
  Write-Host "📂 dist not found → skipping" -ForegroundColor DarkGray
}

if (Test-Path "package-lock.json") {
  Remove-Item -Force "package-lock.json"
  Write-Host "🗑️ Removed package-lock.json" -ForegroundColor DarkYellow
} else {
  Write-Host "📦 package-lock.json not found → skipping" -ForegroundColor DarkGray
}

# התקנה
Write-Host "`n📦 Running npm install..." -ForegroundColor Cyan
npm install

# בנייה
Write-Host "`n🛠️ Running build via npx vite..." -ForegroundColor Cyan
npx vite build

# סיום
Write-Host "`n✅ Done!" -ForegroundColor Green
