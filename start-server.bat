@echo off
ipconfig | findstr IPv4
python -m http.server 8000 --bind 0.0.0.0
pause