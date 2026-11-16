$ErrorActionPreference = 'Stop'
$repoPath = Split-Path -Parent $PSScriptRoot
$distPath = Join-Path $repoPath 'dist'
if (-not (Test-Path -LiteralPath (Join-Path $distPath 'index.html'))) { throw 'Run npm run build first.' }
$stagePath = Join-Path $repoPath ('.task/package-web-' + [guid]::NewGuid().ToString('N'))
$releasePath = Join-Path $repoPath 'release'
New-Item -ItemType Directory -Force -Path $stagePath, $releasePath | Out-Null
Get-ChildItem -LiteralPath $distPath -Force | Copy-Item -Destination $stagePath -Recurse
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'serve-web.mjs') -Destination (Join-Path $stagePath 'serve-web.mjs')
Copy-Item -LiteralPath (Join-Path $repoPath 'docs/WEB-ZIP.txt') -Destination (Join-Path $stagePath 'HUONG-DAN.txt')
$launcher = "@echo off`r`ncd /d `"%~dp0`"`r`nnode serve-web.mjs .`r`npause`r`n"
[System.IO.File]::WriteAllText((Join-Path $stagePath 'Chay-Web.cmd'), $launcher, [System.Text.UTF8Encoding]::new($false))
$archivePath = Join-Path $releasePath 'NhanVan-web.zip'
Add-Type -AssemblyName System.IO.Compression
$output = [System.IO.File]::Open($archivePath, [System.IO.FileMode]::Create)
$archive = [System.IO.Compression.ZipArchive]::new($output, [System.IO.Compression.ZipArchiveMode]::Create)
try {
    foreach ($file in Get-ChildItem -LiteralPath $stagePath -Force -File -Recurse) {
        $name = $file.FullName.Substring($stagePath.Length + 1).Replace('\', '/')
        $entry = $archive.CreateEntry($name, [System.IO.Compression.CompressionLevel]::Optimal)
        $target = $entry.Open()
        $source = [System.IO.File]::OpenRead($file.FullName)
        try { $source.CopyTo($target) } finally { $source.Dispose(); $target.Dispose() }
    }
} finally { $archive.Dispose(); $output.Dispose() }
$hash = (Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash.ToLowerInvariant()
[System.IO.File]::WriteAllText(($archivePath + '.sha256'), $hash + '  NhanVan-web.zip' + "`n", [System.Text.UTF8Encoding]::new($false))
Write-Output $archivePath
Write-Output ('SHA256: ' + $hash)
