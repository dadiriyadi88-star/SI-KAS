@echo off
title Upload SIKAS SISWA ke GitHub
cd /d "%~dp0"
set "PATH=C:\Program Files\Git\bin;%PATH%"

echo ========================================================
echo         UPLOAD SIKAS SISWA KE REPOSITORI GITHUB
echo ========================================================
echo.
echo Pastikan Anda SUDAH membuat repositori kosong di GitHub.
echo.
set /p REPO_URL="Tempel (Paste) Link Repositori GitHub Anda di sini: "

if "%REPO_URL%"=="" (
    echo.
    echo [ERROR] Link repositori tidak boleh kosong!
    echo Silakan jalankan ulang file ini.
    echo.
    pause
    exit /b
)

echo.
echo [1/3] Menyetel branch utama (main)...
git branch -M main

echo.
echo [2/3] Menghubungkan ke repositori GitHub...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo.
echo [3/3] Mengunggah (Push) file ke GitHub...
echo (Jika muncul jendela browser untuk login GitHub, silakan klik 'Sign in with your browser')
echo.
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo      BERHASIL! KODE SUDAH TERUPLOAD KE GITHUB ANDA
    echo ========================================================
    echo Sekarang Anda bisa langsung menghubungkannya ke Vercel!
    echo.
) else (
    echo.
    echo ========================================================
    echo      UPLOAD GAGAL ATAU DIBATALKAN
    echo ========================================================
    echo Periksa koneksi internet atau izin login akun GitHub Anda.
    echo.
)

pause
