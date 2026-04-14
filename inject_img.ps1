$imgBytes = [System.IO.File]::ReadAllBytes("d:\chinu bhai website\assets\instructor_profile.png")
$base64 = [System.Convert]::ToBase64String($imgBytes)
$htmlFile = "d:\chinu bhai website\index.html"
$content = Get-Content $htmlFile -Raw
$newSrc = "data:image/png;base64,$base64"
$pattern = 'src="assets/instructor_profile\.png[^"]*"'
$replacement = "src=`"$newSrc`""
$content -replace $pattern, $replacement | Set-Content $htmlFile -Encoding UTF8
Write-Host "Image successfully embedded as Base64 in index.html"
