<#
.SYNOPSIS
  Installs your headshot and resume into public/ with the names the site expects.

.DESCRIPTION
  The site looks for exactly public/avatar.jpg and public/resume.pdf, and hides
  the hero photo and Resume buttons until they exist. This copies your originals
  into place, converting a PNG or WebP headshot to JPEG if needed.

  With no arguments it searches Downloads, Desktop, Pictures, and Documents for
  likely candidates and asks you to pick.

  NOTE: this file is intentionally ASCII-only. Windows PowerShell 5.1 reads .ps1
  files as ANSI when there is no BOM, which corrupts non-ASCII characters and
  breaks string parsing.

.EXAMPLE
  .\scripts\add-assets.ps1 -Photo "$HOME\Downloads\headshot.jpg" -Resume "$HOME\Downloads\Brooke_A_Mendez.pdf"

.EXAMPLE
  .\scripts\add-assets.ps1
#>
[CmdletBinding()]
param(
  [string]$Photo,
  [string]$Resume
)

$ErrorActionPreference = 'Stop'

$publicDir = Join-Path (Split-Path $PSScriptRoot -Parent) 'public'
if (-not (Test-Path $publicDir)) {
  throw "public/ not found at $publicDir. Run this from inside the portfolio repo."
}

# Verify by magic bytes rather than extension. A mislabelled file would produce
# a broken <img> or an unopenable download that only surfaces in a browser.
# FileStream is used directly because Get-Content's byte parameter differs
# between Windows PowerShell 5.1 (-Encoding Byte) and PowerShell 7 (-AsByteStream).
function Get-FileKind {
  param([string]$Path)

  $stream = [System.IO.File]::OpenRead($Path)
  try {
    $buffer = New-Object byte[] 8
    $read = $stream.Read($buffer, 0, 8)
  } finally {
    $stream.Dispose()
  }

  if ($read -ge 3 -and $buffer[0] -eq 0xFF -and $buffer[1] -eq 0xD8) { return 'jpeg' }
  if ($read -ge 8 -and $buffer[0] -eq 0x89 -and $buffer[1] -eq 0x50 -and
      $buffer[2] -eq 0x4E -and $buffer[3] -eq 0x47) { return 'png' }
  if ($read -ge 4 -and $buffer[0] -eq 0x25 -and $buffer[1] -eq 0x50 -and
      $buffer[2] -eq 0x44 -and $buffer[3] -eq 0x46) { return 'pdf' }
  if ($read -ge 4 -and $buffer[0] -eq 0x52 -and $buffer[1] -eq 0x49 -and
      $buffer[2] -eq 0x46 -and $buffer[3] -eq 0x46) { return 'webp' }
  return 'unknown'
}

function Find-Candidates {
  param([string[]]$Extensions, [int]$MinKB)

  $searchDirs = @(
    (Join-Path $HOME 'Downloads'),
    (Join-Path $HOME 'Desktop'),
    (Join-Path $HOME 'Pictures'),
    (Join-Path $HOME 'Documents')
  ) | Where-Object { Test-Path $_ }

  if (-not $searchDirs) { return @() }

  @(Get-ChildItem -Path $searchDirs -File -Include $Extensions -Recurse -Depth 2 -ErrorAction SilentlyContinue |
    Where-Object { $_.Length -gt ($MinKB * 1KB) } |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 10)
}

function Resolve-Asset {
  param([string]$Given, [string]$Label, [string[]]$Extensions, [int]$MinKB)

  if ($Given) {
    if (-not (Test-Path $Given)) { throw "$Label not found: $Given" }
    return (Resolve-Path $Given).Path
  }

  Write-Host ""
  Write-Host "Looking for your $Label..." -ForegroundColor Cyan
  $candidates = Find-Candidates -Extensions $Extensions -MinKB $MinKB

  if ($candidates.Count -eq 0) {
    Write-Host "  No candidates found. Re-run with an explicit path:" -ForegroundColor Yellow
    Write-Host "    .\scripts\add-assets.ps1 -$Label '<full path>'" -ForegroundColor Yellow
    return $null
  }

  for ($i = 0; $i -lt $candidates.Count; $i++) {
    $line = '  [{0}] {1}' -f $i, $candidates[$i].Name.PadRight(45)
    $line += '{0,8:N0} KB  {1}' -f ($candidates[$i].Length / 1KB), $candidates[$i].LastWriteTime.ToString('yyyy-MM-dd HH:mm')
    Write-Host $line
  }

  $answer = Read-Host "  Which one is your $Label`? (number, or blank to skip)"
  if ([string]::IsNullOrWhiteSpace($answer)) { return $null }

  $index = 0
  if (-not [int]::TryParse($answer.Trim(), [ref]$index) -or $index -lt 0 -or $index -ge $candidates.Count) {
    Write-Host "  Not a valid choice. Skipping." -ForegroundColor Yellow
    return $null
  }
  return $candidates[$index].FullName
}

# --- Headshot ---------------------------------------------------------------
$photoPath = Resolve-Asset -Given $Photo -Label 'Photo' -Extensions @('*.jpg', '*.jpeg', '*.png', '*.webp') -MinKB 20

if ($photoPath) {
  $kind = Get-FileKind $photoPath
  $dest = Join-Path $publicDir 'avatar.jpg'
  $name = Split-Path $photoPath -Leaf

  if ($kind -eq 'jpeg') {
    Copy-Item -Path $photoPath -Destination $dest -Force
    Write-Host "  OK   avatar.jpg  <- $name" -ForegroundColor Green
  }
  elseif ($kind -eq 'png' -or $kind -eq 'webp') {
    Add-Type -AssemblyName System.Drawing
    $img = [System.Drawing.Image]::FromFile($photoPath)
    try {
      $img.Save($dest, [System.Drawing.Imaging.ImageFormat]::Jpeg)
      Write-Host "  OK   avatar.jpg  <- $name (converted $kind to JPEG)" -ForegroundColor Green
    } finally {
      $img.Dispose()
    }
  }
  else {
    Write-Host "  SKIP '$name' is not an image (detected: $kind)" -ForegroundColor Red
  }
}

# --- Resume -----------------------------------------------------------------
$resumePath = Resolve-Asset -Given $Resume -Label 'Resume' -Extensions @('*.pdf') -MinKB 5

if ($resumePath) {
  $name = Split-Path $resumePath -Leaf
  if ((Get-FileKind $resumePath) -eq 'pdf') {
    Copy-Item -Path $resumePath -Destination (Join-Path $publicDir 'resume.pdf') -Force
    Write-Host "  OK   resume.pdf  <- $name" -ForegroundColor Green
  }
  else {
    Write-Host "  SKIP '$name' is not a PDF" -ForegroundColor Red
  }
}

# --- Result -----------------------------------------------------------------
Write-Host ""
Write-Host "public/ now contains:" -ForegroundColor Cyan
foreach ($assetName in @('avatar.jpg', 'resume.pdf')) {
  $path = Join-Path $publicDir $assetName
  if (Test-Path $path) {
    Write-Host ('  {0} {1,8:N0} KB' -f $assetName.PadRight(12), ((Get-Item $path).Length / 1KB)) -ForegroundColor Green
  }
  else {
    Write-Host ('  {0} still missing' -f $assetName.PadRight(12)) -ForegroundColor Yellow
  }
}
Write-Host ""
Write-Host "The dev server picks these up on refresh. Run 'npm run build' for production." -ForegroundColor Cyan
