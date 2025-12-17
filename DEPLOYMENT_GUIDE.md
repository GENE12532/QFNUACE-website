# QFNUACE网站部署指南

## 概述

本指南介绍如何在Linux服务器上部署QFNUACE网站，解决以下问题：
1. 服务器上已有其他网站占用了80和443端口
2. 服务器上没有安装MongoDB数据库

## 解决方案

### 1. 端口冲突解决方案
- 将Nginx的HTTP端口从80改为8080
- 将Nginx的HTTPS端口从443改为8443
- 其他服务端口保持不变

### 2. MongoDB数据库部署
- 使用Docker容器部署MongoDB 6.0
- 数据持久化到Docker卷
- 自动初始化数据库和集合

## 部署前准备

### 系统要求
- Linux服务器（Ubuntu/CentOS等）
- Docker 20.10+
- Docker Compose 2.0+
- 至少2GB可用内存
- 至少10GB可用磁盘空间

### 端口要求
确保以下端口可用（或可修改）：
- 8080: Nginx HTTP服务
- 8443: Nginx HTTPS服务（可选）
- 3000: 后端API服务
- 5173: 前端开发服务（内部）
- 27017: MongoDB数据库

## 快速部署

### 方法一：使用部署脚本（推荐）

#### Linux服务器
```bash
# 1. 给脚本执行权限
chmod +x deploy.sh

# 2. 运行部署脚本
./deploy.sh
```

#### Windows服务器
```bash
# 双击运行
deploy.bat
```

### 方法二：手动部署

1. **克隆或上传项目文件**
   ```bash
   # 将项目文件上传到服务器
   scp -r ./qfnuace-website user@server:/opt/
   ```

2. **进入项目目录**
   ```bash
   cd /opt/qfnuace-website
   ```

3. **使用Docker Compose部署**
   ```bash
   # 使用生产环境配置
   docker-compose -f docker-compose.production.yml up -d
   ```

4. **检查服务状态**
   ```bash
   docker-compose -f docker-compose.production.yml ps
   ```

## 服务架构

```
用户访问 → 服务器IP:8080 → Nginx容器 → 前端容器(5173) → 后端容器(3000) → MongoDB容器(27017)
```

### 服务详情

| 服务 | 容器名称 | 内部端口 | 外部端口 | 说明 |
|------|----------|----------|----------|------|
| MongoDB | qfnuace-mongodb | 27017 | 27017 | 数据库服务 |
| 后端API | qfnuace-backend | 3000 | 3000 | Node.js后端服务 |
| 前端应用 | qfnuace-frontend | 5173 | 5173 | Vue.js前端应用 |
| Nginx | qfnuace-nginx | 80/443 | 8080/8443 | 反向代理和负载均衡 |

## 访问应用

### 1. 前端应用
- URL: `http://服务器IP:8080`
- 默认页面：电脑维修工单管理系统

### 2. 后端API
- URL: `http://服务器IP:3000/api`
- 健康检查: `http://服务器IP:3000/health`
- API文档: 查看后端代码中的路由定义

### 3. MongoDB数据库
- 连接地址: `mongodb://服务器IP:27017`
- 数据库名: `Work_order`
- 集合名: `order`

## 管理命令

### 查看服务状态
```bash
docker-compose -f docker-compose.production.yml ps
```

### 查看日志
```bash
# 查看所有服务日志
docker-compose -f docker-compose.production.yml logs

# 实时查看日志
docker-compose -f docker-compose.production.yml logs -f

# 查看特定服务日志
docker-compose -f docker-compose.production.yml logs backend
```

### 停止服务
```bash
docker-compose -f docker-compose.production.yml down
```

### 重启服务
```bash
docker-compose -f docker-compose.production.yml restart
```

### 更新服务（代码更新后）
```bash
# 重新构建并启动
docker-compose -f docker-compose.production.yml up -d --build
```

## 数据持久化

### MongoDB数据
- 数据存储在Docker卷 `qfnuace-website_mongodb_data`
- 位置: `/var/lib/docker/volumes/qfnuace-website_mongodb_data`

### 备份数据库
```bash
# 进入MongoDB容器
docker exec -it qfnuace-mongodb bash

# 执行备份
mongodump --db Work_order --out /backup/$(date +%Y%m%d)

# 或从宿主机执行
docker exec qfnuace-mongodb sh -c 'mongodump --db Work_order --archive' > backup_$(date +%Y%m%d).archive
```

### 恢复数据库
```bash
docker exec -i qfnuace-mongodb sh -c 'mongorestore --db Work_order --archive' < backup_file.archive
```

## 故障排除

### 1. 端口冲突
如果端口已被占用，修改 `docker-compose.production.yml` 中的端口映射：
```yaml
nginx:
  ports:
    - "新的HTTP端口:80"
    - "新的HTTPS端口:443"
```

### 2. 服务启动失败
检查日志：
```bash
docker-compose -f docker-compose.production.yml logs
```

常见问题：
- MongoDB启动失败：检查磁盘空间和权限
- 后端启动失败：检查MongoDB连接
- 前端启动失败：检查Node.js依赖

### 3. 无法访问应用
检查防火墙：
```bash
# Ubuntu/Debian
sudo ufw allow 8080/tcp
sudo ufw allow 3000/tcp

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

## 自定义配置

### 修改端口
编辑 `docker-compose.production.yml`，修改 `ports` 部分：
```yaml
services:
  nginx:
    ports:
      - "自定义端口:80"
```

### 修改环境变量
编辑 `docker-compose.production.yml`，修改 `environment` 部分：
```yaml
services:
  backend:
    environment:
      - DEFAULT_ORDER_STATUS=新的状态
      - DEFAULT_CONTACT_METHOD=新的联系方式
```

### 启用HTTPS
1. 准备SSL证书（cert.pem和key.pem）
2. 修改 `nginx.production.conf`，取消HTTPS服务器配置的注释
3. 将证书文件挂载到Nginx容器

## 性能优化

### 1. 资源限制
在 `docker-compose.production.yml` 中添加资源限制：
```yaml
services:
  mongodb:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
```

### 2. 数据库索引
为提高查询性能，可以在MongoDB中创建索引：
```javascript
// 在MongoDB中执行
db.order.createIndex({ "被诊者": 1 })
db.order.createIndex({ "号码": 1 })
db.order.createIndex({ "状态": 1 })
```

## 监控和维护

### 1. 健康检查
- 后端健康检查: `http://服务器IP:3000/health`
- Nginx状态: 检查容器日志

### 2. 定期备份
建议每天备份数据库：
```bash
# 创建备份脚本
vim /opt/backup.sh
chmod +x /opt/backup.sh

# 添加到crontab
crontab -e
# 添加：0 2 * * * /opt/backup.sh
```

### 3. 日志轮转
配置Docker日志轮转：
```json
// /etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

## 联系支持

如有问题，请检查：
1. 查看日志文件
2. 检查端口占用
3. 验证Docker服务状态

如需进一步帮助，请联系项目维护者。