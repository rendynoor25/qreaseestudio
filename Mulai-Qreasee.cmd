@echo off
setlocal
cd /d "%~dp0"
set "QREASEE_ADDR=127.0.0.1:8941"
set "QREASEE_DATA=%LOCALAPPDATA%\QreaseeStudio\data"
if not exist "%~dp0qreasee-studio.exe" (
  echo qreasee-studio.exe harus berada di folder yang sama dengan launcher.
  pause
  exit /b 1
)
start "" /b powershell.exe -NoProfile -Command "$url='http://127.0.0.1:8941/'; for($i=0;$i -lt 20;$i++){try{Invoke-WebRequest -UseBasicParsing -Uri $url -TimeoutSec 1 | Out-Null; Start-Process $url; exit}catch{Start-Sleep -Milliseconds 200}}"
"%~dp0qreasee-studio.exe"
pause
