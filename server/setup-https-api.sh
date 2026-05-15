#!/usr/bin/env bash
# HTTPS для api.ermakcentr.ru → Node на :5055. Запуск на VPS от root после DNS A-записи.
# DNS: api.ermakcentr.ru → IP этого сервера (например 147.45.147.90)
set -euo pipefail

DOMAIN="${LEADS_API_DOMAIN:-api.ermakcentr.ru}"
EMAIL="${LEADS_SSL_EMAIL:-}"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Запустите от root: sudo bash setup-https-api.sh"
  exit 1
fi

apt-get update -qq
apt-get install -y -qq nginx certbot python3-certbot-nginx

cat > "/etc/nginx/sites-available/${DOMAIN}" <<EOF
server {
    listen 80;
    server_name ${DOMAIN};
    location / {
        proxy_pass http://127.0.0.1:5055;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

ln -sf "/etc/nginx/sites-available/${DOMAIN}" "/etc/nginx/sites-enabled/${DOMAIN}"
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true
nginx -t
systemctl enable nginx
systemctl reload nginx

if [[ -z "${EMAIL}" ]]; then
  echo "Укажите email для Let's Encrypt:"
  read -r EMAIL
fi

certbot --nginx -d "${DOMAIN}" --non-interactive --agree-tos -m "${EMAIL}" --redirect

echo ""
echo "Готово. Проверка:"
echo "  curl -sS -X POST https://${DOMAIN}/vk-lead -H 'Content-Type: application/json' -d '{\"course\":\"Т\",\"name\":\"Т\",\"phone\":\"+79990000000\"}'"
echo ""
echo "В App Platform (Ermak2.0):"
echo "  VITE_LEADS_SERVER_URL=https://${DOMAIN}"
echo "  и пересоберите сайт."
