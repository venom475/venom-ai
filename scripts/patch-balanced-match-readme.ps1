# PowerShell script to patch balanced-match README.md to disable Liquid processing by adding YAML front matter

$readmePath = "backend\\node_modules\\balanced-match\\README.md"

if (Test-Path $readmePath) {
    $content = Get-Content $readmePath -Raw
    if ($content -notmatch "^---\s*`r?`n# This file is excluded from Jekyll processing") {
        $yamlFrontMatter = "---`r`n# This file is excluded from Jekyll processing to avoid Liquid syntax errors`r`n---`r`n"
        $newContent = $yamlFrontMatter + $content
        Set-Content -Path $readmePath -Value $newContent -Encoding UTF8
        Write-Output "Patch applied successfully to $readmePath"
    }
    else {
        Write-Output "YAML front matter already present in $readmePath. No changes made."
    }
}
else {
    Write-Output "File $readmePath not found."
}
