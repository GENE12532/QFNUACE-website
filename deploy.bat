@echo off
chcp 65001 >nul
echo ==========================================
echo QFNUACE网站部署脚本 (Windows)
echo ==========================================

REM 检查Docker是否安装
echo 检查Docker依赖...
docker --version >nul 2>&1
if errorlevel 1 (
    echo 错误: Docker未安装
    echo 请先安装Docker Desktop: https://docs.docker.com/desktop/install/windows-install/
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo 警告: docker-compose未安装，尝试使用docker compose插件...
    docker compose version >nul 2>&1
    if errorlevel 1 (
        echo 错误: docker compose插件也未安装
        echo 请安装docker-compose或docker compose插件
        pause
        exit /b 1
    )
    set COMPOSE_CMD=docker compose
) else (
    set COMPOSE_CMD=docker-compose
)

echo ✓ Docker和Docker Compose已安装

REM 检查端口占用（简化版）
echo.
echo 检查端口占用情况...
echo 注意：Windows端口检查较复杂，请手动确认以下端口是否可用：
echo   8080 - Nginx HTTP端口
echo   8443 - Nginx HTTPS端口  
echo   3000 - 后端API端口
echo   5173 - 前端开发端口
echo   27017 - MongoDB端口
echo.
set /p CONTINUE="确认端口无冲突后继续? (y/n): "
if /i not "%CONTINUE%"=="y" (
    echo 部署取消
    pause
    exit /b 0
)

REM 部署服务
echo.
echo 开始部署服务...
echo 使用docker-compose.production.yml配置...

REM 停止并删除旧容器
echo 清理旧容器...
%COMPOSE_CMD% -f docker-compose.production.yml down

REM 构建镜像
echo 构建Docker镜像...
%COMPOSE_CMD% -f docker-compose.production.yml build

REM 启动服务
echo 启动服务...
%COMPOSE_CMD% -f docker-compose.production.yml up -d

echo 等待服务启动...
timeout /t 10 /nobreak >nul

REM 检查服务状态
echo 检查服务状态...
%COMPOSE_CMD% -f docker-compose.production.yml ps

echo.
echo ==========================================
echo 部署完成!
echo ==========================================
echo.
echo 服务访问信息:
echo 1. 前端应用: http://localhost:8080
echo 2. 后端API: http://localhost:3000/api
echo 3. MongoDB数据库: localhost:27017
echo.
echo 容器状态检查:
echo   %COMPOSE_CMD% -f docker-compose.production.yml ps
echo.
echo 查看日志:
echo   %COMPOSE_CMD% -f docker-compose.production.yml logs
echo   %COMPOSE_CMD% -f docker-compose.production.yml logs -f ^(实时^)
echo.
echo 停止服务:
echo   %COMPOSE_CMD% -f docker-compose.production.yml down
echo.
echo 重启服务:
echo   %COMPOSE_CMD% -f docker-compose.production.yml restart
echo.
echo ==========================================
pause