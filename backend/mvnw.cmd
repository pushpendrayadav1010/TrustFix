@REM ----------------------------------------------------------------------------
@REM Apache Maven Wrapper startup batch script, version 3.3.2
@REM ----------------------------------------------------------------------------

@ECHO OFF
@setlocal EnableExtensions EnableDelayedExpansion

set MAVEN_PROJECTBASEDIR=%~dp0
if "%MAVEN_PROJECTBASEDIR:~-1%"=="\" set MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%

set "WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
set "WRAPPER_PROPERTIES=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties"

if exist "%WRAPPER_JAR%" goto :run

set "WRAPPER_URL="
if exist "%WRAPPER_PROPERTIES%" (
    for /F "usebackq delims== tokens=1,2" %%G in ("%WRAPPER_PROPERTIES%") do (
        if "%%G"=="wrapperUrl" set "WRAPPER_URL=%%H"
    )
)
if "%WRAPPER_URL%"=="" (
    set "WRAPPER_URL=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar"
)

powershell -NoProfile -ExecutionPolicy Bypass -Command "& { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('%WRAPPER_URL%', '%WRAPPER_JAR%') }"

:run
if not exist "%WRAPPER_JAR%" (
    echo Error: Could not download maven-wrapper.jar
    exit /b 1
)

java -Dmaven.multiModuleProjectDirectory="%MAVEN_PROJECTBASEDIR%" -cp "%WRAPPER_JAR%" org.apache.maven.wrapper.MavenWrapperMain %*
@endlocal
