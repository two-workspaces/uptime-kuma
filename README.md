# Deploy and Host Uptime Kuma on Railway

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/uptime-kuma-monitor?referralCode=sLjDXb&utm_medium=integration&utm_source=button&utm_campaign=uptime-kuma-monitor)

[Uptime Kuma](https://uptime.kuma.pet/) is an open-source, self-hosted monitoring tool. It checks your websites, APIs, TCP ports, DNS records, databases and more every few seconds, alerts you through 90+ notification services (Telegram, Discord, Slack, webhooks, email and others) when something goes down, and publishes public status pages for your users. This template runs Uptime Kuma 2.5.8 on SQLite with the data on a Railway volume and creates your admin account on first boot.

## About Hosting Uptime Kuma

The stack is one service with one volume.

- **Upstream's image, pinned.** Uptime Kuma runs the official `louislam/uptime-kuma:2.5.8-slim` image (SQLite, no bundled Chromium or MariaDB), not `latest`. The wrapper ([source](https://github.com/two-workspaces/uptime-kuma)) only adds a first-boot step.
- **No open setup pages.** A fresh Uptime Kuma asks the first visitor to pick a database and create the admin. This template picks SQLite and creates the admin from `KUMA_ADMIN_USERNAME` and the generated `KUMA_ADMIN_PASSWORD` before the URL goes live.
- **Ready for Railway's proxy.** First boot turns on "trust proxy", so logins and logs show your visitors' real IPs, and sets the primary base URL to your Railway domain, so links in notifications point to your dashboard.
- **Data on the volume.** Monitors, heartbeat history, status pages and settings live in `/app/data` and survive redeploys and upgrades.
- **Small footprint.** Uptime Kuma idles at about 150 MB of RAM with a few monitors, so it fits the Free plan for small setups.

## Common Use Cases

- Uptime and response-time monitoring for websites, APIs and SSL certificate expiry
- Watching your other Railway services over the private network (`http://<service>.railway.internal:<port>`)
- Public status pages for your product or team, on your own domain
- Heartbeat (push) monitors for cron jobs and background workers that call a URL when they run
- Alerting a Slack, Discord or Telegram channel, or a webhook, when something goes down

## Dependencies for Uptime Kuma Hosting

- A Railway volume at `/app/data` (included)

### Deployment Dependencies

- [Uptime Kuma wiki](https://github.com/louislam/uptime-kuma/wiki)
- [Environment variables](https://github.com/louislam/uptime-kuma/wiki/Environment-Variables)
- [Uptime Kuma on GitHub](https://github.com/louislam/uptime-kuma)
- [Template source on GitHub](https://github.com/two-workspaces/uptime-kuma)

### Implementation Details

**Sign in.** When the deploy is green, open your Railway domain and sign in as `admin` with the password in the Uptime Kuma service's `KUMA_ADMIN_PASSWORD` variable. The variables are only used on the first boot: change the password in Settings, Security, where you can also turn on two-factor authentication.

**Monitors on Railway.** HTTP, keyword, JSON query, TCP port, DNS, database and push monitors all work. ICMP ping monitors don't, because Railway containers can't send raw packets: use a TCP port or HTTP monitor instead. To watch another service in the same project without going over the internet, point the monitor at its private address, for example `http://api.railway.internal:8080/health`.

**Notifications.** Webhooks, Slack, Discord, Telegram and the other HTTP-based services work on every plan. Email over SMTP needs Railway's Pro plan, which is the only plan that allows outbound SMTP.

**Status pages on your domain.** Add the domain to the Uptime Kuma service in Railway, then add it to the status page's Domain Names list (Edit Status Page). Update Settings, General, Primary Base URL if you move the dashboard to a custom domain too.

**Browser monitors.** The slim image has no Chromium. To use "HTTP(s) - Browser Engine" monitors, add a remote browser (for example a Browserless service) under Settings, Remote Browsers.

**Back up.** Everything is in `/app/data`. Use Railway's volume backups; Uptime Kuma's own JSON backup was removed in 2.0.

**Upgrading.** Bump the image tag in the Dockerfile of your fork and redeploy. Uptime Kuma migrates its database on start, so take a volume backup first.

## Why Deploy Uptime Kuma on Railway?

Railway is a singular platform to deploy your infrastructure stack. Railway will host your infrastructure so you don't have to deal with configuration, while allowing you to vertically and horizontally scale it.

By deploying Uptime Kuma on Railway, you are one step closer to supporting a complete full-stack application with minimal burden. Host your servers, databases, AI agents, and more on Railway.
