# Starts the FinBERT + archive service (127.0.0.1:8791) in a minimized window. The n8n schedule needs it running.
#   powershell -ExecutionPolicy Bypass -File scripts\start-service.ps1
$root = Split-Path -Parent $PSScriptRoot
Start-Process -WindowStyle Minimized -WorkingDirectory $root python -ArgumentList "service\server.py"
