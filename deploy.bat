@echo off
setlocal enabledelayedexpansion

echo.
echo  ng build github ===
CALL ng build --output-path docsTemp --base-href /word-stuffing-brain/

if %ERRORLEVEL% neq 0 (
    echo [ERREUR] ng build a échoué.
    goto fin
)

echo  ng build 

CALL ng build 
if %ERRORLEVEL% neq 0 (
    echo [ERREUR] ng build a échoué.
    goto fin
)

xcopy "src\*.html" "docs\" /S /E /H /R /K /C /Y /V /F
xcopy "src\*.ico" "docs\" /S /E /H /R /K /C /Y /V /F
xcopy "src\*.png" "docs\" /S /E /H /R /K /C /Y /V /F
xcopy "src\*.html" "public\" /S /E /H /R /K /C /Y /V /F
xcopy "src\*.ico" "public\" /S /E /H /R /K /C /Y /V /F
xcopy "src\*.png" "public\" /S /E /H /R /K /C /Y /V /F
if %ERRORLEVEL% neq 0 (
    echo [ERREUR] xcopy FILE a échoué.
    goto fin
)
echo  xcopy done 
echo  xcopy github
CALL xcopy "" 
CALL xcopy "docsTemp\browser" "docs" /E /I /H /Y
if %ERRORLEVEL% neq 0 (
    echo [ERREUR] xcopy a échoué.
    goto fin
)

CALL xcopy "dist\words-english-brain-stuffing\browser" "public" /E /I /H /Y
if %ERRORLEVEL% neq 0 (
    echo [ERREUR] xcopy a échoué.
    goto fin
)
echo.
echo ===  git add . ===
git add .
if %ERRORLEVEL% neq 0 (
    echo [ERREUR] git add a échoué.
    goto fin
)

echo.
echo  git commit ===
git commit -m "save"
if %ERRORLEVEL% neq 0 (
    echo [ERREUR] git commit a échoué.
    goto fin
)

echo.
echo  git push ===
git push
if %ERRORLEVEL% neq 0 (
    echo [ERREUR] git push a échoué.
    goto fin
)

echo.
echo  firebase deploy ===
CALL firebase deploy
if %ERRORLEVEL% neq 0 (
    echo [ERREUR] firebase deploy a échoué.
    goto fin
)

echo.

echo.
echo === YES It is deployed   ===

:fin
endlocal
echo https://memorybooster-8275c.web.app/home.html
echo https://bertrand82.github.io/word-stuffing-brain/home.html
pause
