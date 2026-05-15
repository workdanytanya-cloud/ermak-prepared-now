#!/usr/bin/env bash
# Первичная настройка VPS (Ubuntu) под шлюз ВК. Запуск на сервере: bash deploy-vk-gateway.sh
# Перед запуском: export VK_GROUP_TOKEN='ваш_токен'  (или вставьте ниже в файл .env рядом со скриптом)
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GATEWAY_JS="${ROOT_DIR}/vk-gateway.mjs"
PORT="${PORT:-5055}"

if [[ ! -f "$GATEWAY_JS" ]]; then
  echo "Не найден $GATEWAY_JS — скопируйте в эту папку файл vk-gateway.mjs из репозитория (server/)."
  exit 1
fi

if [[ -z "${VK_GROUP_TOKEN:-}" ]]; then
  if [[ -f "${ROOT_DIR}/.env" ]] && grep -q '^VK_GROUP_TOKEN=' "${ROOT_DIR}/.env"; then
    set -a
    # shellcheck disable=SC1090
    source "${ROOT_DIR}/.env"
    set +a
  fi
fi

if [[ -z "${VK_GROUP_TOKEN:-}" ]]; then
  echo "Задайте VK_GROUP_TOKEN: export VK_GROUP_TOKEN='...' и снова запустите скрипт"
  echo "Или создайте ${ROOT_DIR}/.env со строкой VK_GROUP_TOKEN=..."
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq curl ca-certificates

if ! command -v node >/dev/null 2>&1; then
  echo "Установка Node.js LTS..."
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y -qq nodejs
fi

node -v

if ! command -v pm2 >/dev/null 2>&1; then
  npm install -g pm2
fi

export PORT
pm2 delete vk-gateway 2>/dev/null || true
VK_GROUP_TOKEN="$VK_GROUP_TOKEN" PORT="$PORT" pm2 start "$GATEWAY_JS" --name vk-gateway
pm2 save

echo ""
echo "Готово. Шлюз слушает порт ${PORT} (POST /vk-lead)."
echo "Проверка: curl -sS -X POST http://127.0.0.1:${PORT}/vk-lead -H 'Content-Type: application/json' -d '{\"course\":\"Тест\",\"name\":\"Тест\",\"phone\":\"+79990000000\"}' | head -c 200"
echo ""
echo "Дальше: откройте TCP ${PORT} в файрволе Timeweb (если нужен доступ с интернета),"
echo "настройте Nginx+SSL (см. server/nginx-vk-gateway.example.conf),"
echo "в App Platform задайте VITE_VK_LEAD_GATEWAY_URL=https://ваш-поддомен/vk-lead"
