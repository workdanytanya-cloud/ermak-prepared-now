#!/usr/bin/env bash
# Полная настройка шлюза заявок на VPS Timeweb (Intelligent Pheasant, 147.45.147.90)
# Запуск от root после входа в консоль: bash bootstrap-leads.sh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${ROOT_DIR}/.env"
DOMAIN="${LEADS_API_DOMAIN:-api.ermakcentr.ru}"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Запустите от root: sudo bash bootstrap-leads.sh"
  exit 1
fi

echo "=== 1/4 Проверка .env ==="
if [[ ! -f "$ENV_FILE" ]]; then
  cat >"$ENV_FILE" <<'EOF'
# Скопируйте и заполните (nano .env):
VK_GROUP_TOKEN=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=489781325
PORT=5055
EOF
  echo "Создан ${ENV_FILE}"
  echo "Откройте: nano ${ENV_FILE}"
  echo "  VK_GROUP_TOKEN — ключ сообщества ВК (настройки группы → Работа с API)"
  echo "  TELEGRAM_BOT_TOKEN — токен бота из @BotFather"
  echo "  TELEGRAM_CHAT_ID — ваш chat_id (число)"
  echo ""
  read -r -p "Нажмите Enter после сохранения .env (Ctrl+O, Enter, Ctrl+X в nano)..."
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

if [[ -z "${VK_GROUP_TOKEN:-}" ]]; then
  echo "Ошибка: в .env нет VK_GROUP_TOKEN"
  exit 1
fi

echo "=== 2/4 Установка Node и запуск шлюза (pm2) ==="
bash "${ROOT_DIR}/deploy-vk-gateway.sh"

echo ""
echo "=== 3/4 DNS ==="
echo "В Timeweb → Домены и SSL → ermakcentr.ru добавьте запись:"
echo "  Тип A, имя: api, значение: $(curl -sS ifconfig.me 2>/dev/null || echo '147.45.147.90')"
echo ""
read -r -p "DNS для ${DOMAIN} уже указывает на этот сервер? (y/n) " dns_ok
if [[ "${dns_ok,,}" != "y" && "${dns_ok,,}" != "д" ]]; then
  echo "Сначала настройте DNS, затем снова: LEADS_SSL_EMAIL=ваш@email.ru bash setup-https-api.sh"
  exit 0
fi

echo "=== 4/4 HTTPS (Let's Encrypt) ==="
if [[ -z "${LEADS_SSL_EMAIL:-}" ]]; then
  read -r -p "Email для SSL-сертификата: " LEADS_SSL_EMAIL
  export LEADS_SSL_EMAIL
fi
bash "${ROOT_DIR}/setup-https-api.sh"

echo ""
echo "=============================================="
echo "Готово на сервере."
echo "Проверка:"
echo "  curl -sS https://${DOMAIN}/health"
echo ""
echo "В Timeweb → Ermak2.0 → Настройки → переменные:"
echo "  VITE_LEADS_SERVER_URL=https://${DOMAIN}"
echo "  VITE_WEB3FORMS_ACCESS_KEY=ключ с web3forms.com (почта ermakcentrnsk@gmail.com)"
echo "Затем вкладка Деплой → пересобрать сайт."
echo "=============================================="
