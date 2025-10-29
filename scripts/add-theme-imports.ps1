# Script to add themeColors import and update color classes in multiple files

$files = @(
    "CandidateSearchPage.jsx",
    "JobPostingForm.jsx",
    "JobSearchPage.jsx",
    "VideoUpload.jsx",
    "VideosPage.jsx",
    "CompanyVideos.jsx",
    "JobsListingPage.jsx",
    "EmployerProfilePage.jsx",
    "JobSeekerProfile.jsx",
    "ResumeBuilderPage.jsx",
    "SavedVideosPage.jsx",
    "InterviewPage.jsx"
)

foreach ($file in $files) {
    $filePath = "d:\oba\_wrk\_codeBa\_frontend\src\pages\$file"
    
    if (Test-Path $filePath) {
        Write-Host "Processing $file..." -ForegroundColor Green
        
        # Read the file
        $content = Get-Content $filePath -Raw
        
        # Check if themeColors is already imported
        if ($content -notmatch "import themeColors from") {
            # Find the last import statement
            $lastImportIndex = [regex]::Matches($content, "import .+ from .+;").Value | Select-Object -Last 1
            
            if ($lastImportIndex) {
                # Add themeColors import after the last import
                $content = $content -replace "($lastImportIndex)", "`$1`nimport themeColors from '@/config/theme-colors';"
            }
        }
        
        # Save the updated content
        Set-Content -Path $filePath -Value $content -NoNewline
        
        Write-Host "Updated $file" -ForegroundColor Cyan
    }
}

Write-Host "All files processed!" -ForegroundColor Yellow
