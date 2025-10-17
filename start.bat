@echo off
chcp 65001 >nul
title 电脑维修工单管理系统 - 一键启动

echo.
echo 🚀 启动电脑维修工单管理系统...
echo ==================================
echo.

REM 检查 Node.js 是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未检测到 Node.js，请先安装 Node.js (^>=16.0.0^)
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查 npm 是否安装
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未检测到 npm，请先安装 npm (^>=8.0.0^)
    pause
    exit /b 1
)

REM 显示版本信息
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ Node.js 版本: %NODE_VERSION%
echo ✅ npm 版本: %NPM_VERSION%
echo.

REM 检查环境变量文件
if not exist ".env" (
    echo ❌ 错误: 未找到 .env 文件
    echo 请确保项目根目录存在 .env 文件
    pause
    exit /b 1
)

REM 安装依赖
echo 📦 安装项目依赖...
call npm run install-all

if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)

echo ✅ 依赖安装完成
echo.

REM 检查 MongoDB
echo ⚠️  请确保 MongoDB 服务正在运行...
echo 如果未安装 MongoDB，请先安装并启动
echo 下载地址: https://www.mongodb.com/try/download/community
echo.
echo 或者使用 Docker 方式部署（推荐）:
echo   npm run docker:up
echo.

REM 启动服务
echo 🎯 启动服务...
echo 后端服务: http://localhost:3000
echo 前端应用: http://localhost:5173
echo.
echo 按 Ctrl+C 停止所有服务
echo ==================================
echo.

REM 启动开发服务器
npm run dev

pause