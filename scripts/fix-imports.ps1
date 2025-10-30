# Fix relative imports to use @ alias
# This script converts relative imports to use the Vite @ alias

Write-Host "Fixing relative imports to use @ alias..." -ForegroundColor Cyan

$srcPath = "D:\oba\_wrk\_codeBa\_frontend\src"
$filesChanged = 0

# Get all JSX and JS files
$files = Get-ChildItem -Path $srcPath -Recurse -Include "*.jsx","*.js" | Where-Object { $_.FullName -notmatch 'node_modules' }

Write-Host "Found $($files.Count) files to check" -ForegroundColor Yellow

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    $changed = $false
    
    # Fix ../services/api imports
    if ($content -match 'from [''"]\.\.\/services\/api[''"]') {
        $content = $content -replace 'from [''"]\.\.\/services\/api[''"]', "from '@/services/api'"
        $changed = $true
        Write-Host "  Fixed API imports in $($file.Name)" -ForegroundColor Green
    }
    
    # Fix ../contexts/AuthContext imports
    if ($content -match 'from [''"]\.\.\/contexts\/AuthContext[''"]') {
        $content = $content -replace 'from [''"]\.\.\/contexts\/AuthContext[''"]', "from '@/contexts/AuthContext'"
        $changed = $true
        Write-Host "  Fixed AuthContext imports in $($file.Name)" -ForegroundColor Green
    }
    
    # Fix ../contexts/VideoContext imports
    if ($content -match 'from [''"]\.\.\/contexts\/VideoContext[''"]') {
        $content = $content -replace 'from [''"]\.\.\/contexts\/VideoContext[''"]', "from '@/contexts/VideoContext'"
        $changed = $true
        Write-Host "  Fixed VideoContext imports in $($file.Name)" -ForegroundColor Green
    }
    
    # Fix ../services/videoService imports
    if ($content -match 'from [''"]\.\.\/services\/videoService[''"]') {
        $content = $content -replace 'from [''"]\.\.\/services\/videoService[''"]', "from '@/services/videoService'"
        $changed = $true
        Write-Host "  Fixed videoService imports in $($file.Name)" -ForegroundColor Green
    }
    
    # Fix import api from '../services/api'
    if ($content -match 'import api from [''"]\.\.\/services\/api[''"]') {
        $content = $content -replace 'import api from [''"]\.\.\/services\/api[''"]', "import api from '@/services/api'"
        $changed = $true
        Write-Host "  Fixed default API imports in $($file.Name)" -ForegroundColor Green
    }
    
    # Fix ../lib/utils imports
    if ($content -match 'from [''"]\.\.\/lib\/utils[''"]') {
        $content = $content -replace 'from [''"]\.\.\/lib\/utils[''"]', "from '@/lib/utils'"
        $changed = $true
        Write-Host "  Fixed utils imports in $($file.Name)" -ForegroundColor Green
    }
    
    # Fix UI component imports to use uppercase UI and add .jsx extension
    if ($content -match 'from [''"]@\/components\/ui\/([^''"]+)[''"]') {
        $originalContent2 = $content
        $content = $content -replace "from (['\`"])@/components/UI/([a-zA-Z0-9-]+)(['\`"])", "from `$1@/components/UI/`$2.jsx`$3"
        if ($content -ne $originalContent2) {
            $changed = $true
            Write-Host "  Fixed UI component imports to uppercase in $($file.Name)" -ForegroundColor Green
        }
    }
    
    # Fix ../../lib/utils imports in UI components
    if ($content -match 'from [''"]\.\.\/\.\.\/lib\/utils[''"]') {
        $content = $content -replace 'from [''"]\.\.\/\.\.\/lib\/utils[''"]', "from '@/lib/utils'"
        $changed = $true
        Write-Host "  Fixed lib/utils imports in $($file.Name)" -ForegroundColor Green
    }
    
    # Fix ../../contexts/ imports in UI components
    if ($content -match 'from [''"]\.\.\/\.\.\/contexts\/') {
        $content = $content -replace 'from [''"]\.\.\/\.\.\/contexts\/([^''"]+)[''"]', "from '@/contexts/`$1'"
        $changed = $true
        Write-Host "  Fixed contexts imports in $($file.Name)" -ForegroundColor Green
    }
    
    # Save if changes were made
    if ($changed) {
        Set-Content -Path $file.FullName -Value $content -NoNewline -Encoding UTF8
        $filesChanged++
        Write-Host "Updated: $($file.Name)" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "Complete!" -ForegroundColor Green
Write-Host "Files changed: $filesChanged" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Review: git diff" -ForegroundColor White
Write-Host "  2. Test: npm run build" -ForegroundColor White
Write-Host "  3. Commit: git add . ; git commit -m 'fix: convert imports'" -ForegroundColor White
