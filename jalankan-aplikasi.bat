@echo off
title SIKAS SISWA - Server Keuangan Sekolah
cd /d "%~dp0"
set "PATH=C:\Program Files\nodejs;%PATH%"

echo ========================================================
echo      MEMULAI SIKAS SISWA - SISTEM KEUANGAN SEKOLAH
echo ========================================================
echo.
echo Server sedang dijalankan...
echo Browser akan otomatis terbuka ke http://localhost:3000
echo.
echo (Jangan tutup jendela hitam ini selama menggunakan aplikasi)
echo ========================================================
echo.

start http://localhost:3000
npm run dev
pause
