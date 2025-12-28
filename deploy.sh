#!/bin/bash

# QFNUACE网站部署脚本
# 适用于Linux服务器部署，解决端口冲突问题

set -e

echo "=========================================="
echo "QFNUACE网站部署脚本"
echo "=========================================="

# 检查Docker和Docker Compose是否安装
check_dependencies() {
    echo "检查依赖..."
    if ! command -v docker > /dev/null 2>&1; then
        echo "错误: Docker未安装"
        echo "请先安装Docker: https://docs.docker.com/engine/install/"
        exit 1
    fi
    
    if ! command -v docker-compose > /dev/null 2>&1; then
        echo "警告: docker-compose未安装，尝试使用docker compose插件..."
        if ! docker compose version > /dev/null 2>&1; then
            echo "错误: docker compose插件也未安装"
            echo "请安装docker-compose或docker compose插件"
            exit 1
        fi
        COMPOSE_CMD="docker compose"
    else
        COMPOSE_CMD="docker-compose"
    fi
    
    echo "✓ Docker和Docker Compose已安装"
}

# 检查端口占用
check_ports() {
    echo "检查端口占用情况..."
    
    ports="8081 8443 3000 5173 27017"
    occupied=""
    
    for port in $ports; do
        if ss -tuln | grep ":$port " > /dev/null; then
            if [ -z "$occupied" ]; then
                occupied="$port"
            else
                occupied="$occupied $port"
            fi
            echo "警告: 端口 $port 已被占用"
        else
            echo "✓ 端口 $port 可用"
        fi
    done
    
    if [ ! -z "$occupied" ]; then
        echo "注意: 以下端口已被占用: $occupied"
        echo "如果这些端口被本应用使用，请修改docker-compose.production.yml中的端口映射"
        printf "是否继续? (y/n): "
        read answer
        case "$answer" in
            [Yy]*) ;;
            *) exit 1 ;;
        esac
    fi
}

# 构建和启动服务
deploy_services() {
    echo "开始部署服务..."
    
    # 使用生产环境配置
    echo "使用docker-compose.production.yml配置..."
    
    # 停止并删除旧容器（如果存在）
    echo "清理旧容器..."
    $COMPOSE_CMD -f docker-compose.production.yml down || true
    
    # 构建镜像
    echo "构建Docker镜像..."
    $COMPOSE_CMD -f docker-compose.production.yml build
    
    # 启动服务
    echo "启动服务..."
    $COMPOSE_CMD -f docker-compose.production.yml up -d
    
    echo "等待服务启动..."
    sleep 10
    
    # 检查服务状态
    echo "检查服务状态..."
    $COMPOSE_CMD -f docker-compose.production.yml ps
    
    echo "服务部署完成!"
}

# 显示访问信息
show_access_info() {
    echo ""
    echo "=========================================="
    echo "部署完成!"
    echo "=========================================="
    echo ""
    echo "服务访问信息:"
    echo "1. 前端应用: http://服务器IP:8081"
    echo "2. 后端API: http://服务器IP:3000/api"
    echo "3. MongoDB数据库: 服务器IP:27017"
    echo ""
    echo "容器状态检查:"
    echo "  $COMPOSE_CMD -f docker-compose.production.yml ps"
    echo ""
    echo "查看日志:"
    echo "  $COMPOSE_CMD -f docker-compose.production.yml logs"
    echo "  $COMPOSE_CMD -f docker-compose.production.yml logs -f (实时)"
    echo ""
    echo "停止服务:"
    echo "  $COMPOSE_CMD -f docker-compose.production.yml down"
    echo ""
    echo "重启服务:"
    echo "  $COMPOSE_CMD -f docker-compose.production.yml restart"
    echo ""
    echo "=========================================="
}

# 主函数
main() {
    check_dependencies
    check_ports
    deploy_services
    show_access_info
}

# 执行主函数
main "$@"