# 🐳 Docker Deployment Guide

## ✅ Docker Compose - УСПЕШНО ПРОТЕСТИРОВАНО

Проект A2A UI успешно настроен для production deployment с Docker Compose!

## 🚀 Quick Start

### Запуск с Docker Compose
```bash
# Сборка и запуск
docker-compose up -d

# Проверка статуса
docker-compose ps

# Просмотр логов
docker-compose logs -f a2a-ui

# Остановка
docker-compose down
```

### Доступ к приложению
- **URL**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## 📊 Результаты тестирования

### ✅ Сборка Docker образа
```
✓ Multi-stage build успешно
✓ Размер образа оптимизирован
✓ Standalone Next.js сборка
✓ Production dependencies only
✓ Security: non-root user (nextjs:nodejs)
```

### ✅ Запуск контейнера
```
✓ Контейнер запускается за ~45ms
✓ Next.js 15.3.3 в production режиме
✓ Порт 3000 (внутри) -> 3001 (хост)
✓ Environment variables загружены
✓ Health check endpoint работает
```

### ✅ Health Check
```json
{
  "status": "healthy",
  "timestamp": "2025-06-13T22:08:40.837Z",
  "version": "1.0.0",
  "environment": "production"
}
```

## 🏗️ Архитектура Docker

### Multi-stage Dockerfile
1. **Base**: Node.js 18 Alpine
2. **Deps**: Установка зависимостей
3. **Builder**: Сборка приложения
4. **Runner**: Production образ

### Оптимизации
- ✅ Alpine Linux (минимальный размер)
- ✅ Multi-stage build (безопасность)
- ✅ Non-root user (безопасность)
- ✅ .dockerignore (быстрая сборка)
- ✅ Standalone output (оптимизация)

## ⚙️ Конфигурация

### Environment Variables
```yaml
environment:
  - NODE_ENV=production
  - NEXT_PUBLIC_APP_NAME=A2A UI
  - NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Health Check
```yaml
healthcheck:
  test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### Ports
- **Host**: 3001
- **Container**: 3000

## 🔧 Команды для разработки

### Локальная разработка
```bash
# Обычная разработка
npm run dev

# Тестирование production сборки
npm run build && npm start
```

### Docker разработка
```bash
# Пересборка образа
docker-compose build --no-cache

# Запуск с логами
docker-compose up

# Только сборка
docker-compose build
```

### Отладка
```bash
# Вход в контейнер
docker-compose exec a2a-ui sh

# Просмотр логов
docker-compose logs a2a-ui --tail 50 -f

# Проверка health check
curl http://localhost:3001/api/health
```

## 🚀 Production Deployment

### Готовые команды
```bash
# Клонирование и запуск
git clone <repository>
cd a2a-ui
docker-compose up -d

# Проверка
curl http://localhost:3001/api/health
```

### Для production серверов
```bash
# С custom environment
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# С внешним reverse proxy
# Настройте nginx/traefik для проксирования на порт 3001
```

## 📈 Метрики производительности

- **Время сборки**: ~55 секунд
- **Время запуска**: ~45ms
- **Размер образа**: Оптимизирован (Alpine + multi-stage)
- **Memory usage**: Минимальный (Node.js standalone)
- **Security**: Non-root user, minimal attack surface

## 🎯 Статус готовности

**✅ DOCKER DEPLOYMENT - ПОЛНОСТЬЮ ГОТОВ**

- ✅ Production-ready Dockerfile
- ✅ Оптимизированный docker-compose.yaml
- ✅ Health check настроен
- ✅ Security best practices
- ✅ Протестировано и работает
- ✅ Документация готова

**Готов к deployment в любой Docker-совместимой среде!** 🚀 