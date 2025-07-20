@echo off
setlocal enabledelayedexpansion

echo.
echo  ng build github ===
CALL ng build --output-path docsTemp --base-href /word-stuffing-brain/
pause
if %ERRORLEVEL% neq 0 (
    echo [ERREUR] ng build a échoué.
    goto fin
)

echo  ng build 
pause
CALL ng build 
if %ERRORLEVEL% neq 0 (
    echo [ERREUR] ng build a échoué.
    goto fin
)
echo  xcopy github
pause 
CALL xcopy "docsTemp\browser" "docs" /E /I /H /Y
if %ERRORLEVEL% neq 0 (
    echo [ERREUR] ng build a échoué.
    goto fin
)
echo  xcopy firebase 
pause
CALL xcopy "dist\words-english-brain-stuffing\browser" "public" /E /I /H /Y
if %ERRORLEVEL% neq 0 (
    echo [ERREUR] ng build a échoué.
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
echo  ng build ===
ng build --output-path docs --base-href /word-stuffing-brain/
if %ERRORLEVEL% neq 0 (
    echo [ERREUR] ng build a échoué.
    goto fin
)

echo.
echo === Déploiement terminé avec succès ===

:fin
endlocal
pause
