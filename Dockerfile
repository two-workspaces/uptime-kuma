# Official Uptime Kuma (slim: SQLite, no bundled Chromium/MariaDB) plus a
# first-boot step that creates the admin account, so a fresh deploy never
# shows the open "create your admin" page on a public URL.
FROM louislam/uptime-kuma:2.5.8-slim
COPY railway-setup.js /app/extra/railway-setup.js
CMD ["sh", "-c", "node extra/railway-setup.js & exec node server/server.js"]
