$htmlFile = "d:\chinu bhai website\index.html"
$content = Get-Content $htmlFile -Raw
$pattern = '<img src="data:image/png;base64,[^"]*"'
$replacement = '<img src="assets/instructor_profile.png?v=3"'
$content -replace $pattern, $replacement | Set-Content $htmlFile -Encoding UTF8
Write-Host "Image successfully reverted to external file path in index.html"
