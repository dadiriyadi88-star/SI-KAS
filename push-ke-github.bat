@echo off
title Mengunggah SIKAS SISWA ke GitHub
cd /d "%~dp0"
set "PATH=C:\Program Files\Git\bin;%PATH%"

echo ===================================================================
echo             MENGUNGGAH SIKAS KE GITHUB (SI-KAS)
echo ===================================================================
echo.
echo Repositori Tujuan: https://github.com/dadiriyadi88-star/SI-KAS.git
echo.
echo Sedang mengirim file...
echo.
echo CATATAN PENTING:
echo Jika muncul pop-up browser untuk login ke GitHub, silakan klik:
echo "Sign in with your browser" lalu klik "Authorize git-ecosystem"
echo ===================================================================
echo.

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ===================================================================
    echo   SELAMAT! KODE BERHASIL TERUPLOAD KE GITHUB!
    echo ===================================================================
    echo Silakan refresh halaman GitHub Anda di browser untuk melihat file.
    echo Selanjutnya, Anda tinggal menghubungkannya ke Vercel!
    echo.
) else (
    echo.
    echo ===================================================================
    echo   UPLOAD GAGAL ATAU BUTUH LOGIN
    echo ===================================================================
    echo Pastikan komputer terhubung ke internet dan Anda mengizinkan login
    echo GitHub saat diminta.
    echo.
)

pause
