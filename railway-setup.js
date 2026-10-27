// First boot only: if Uptime Kuma has no user yet, create the admin from
// KUMA_ADMIN_USERNAME / KUMA_ADMIN_PASSWORD (the same "setup" call the UI
// makes), then trust Railway's proxy headers and set the primary base URL.
const { io } = require("socket.io-client");

const { KUMA_ADMIN_USERNAME: username, KUMA_ADMIN_PASSWORD: password, KUMA_BASE_URL: baseURL } = process.env;
const port = process.env.UPTIME_KUMA_PORT || process.env.PORT || 3001;
if (!username || !password) process.exit(0);

const socket = io(`http://127.0.0.1:${port}`, { reconnectionDelay: 2000, transports: ["websocket"] });
const call = (...args) => new Promise((resolve) => socket.emit(...args, resolve));
const done = (msg) => { console.log(`[railway-setup] ${msg}`); socket.close(); };

// The server registers its handlers only after sending "info", so an emit
// right on "connect" would be dropped.
socket.once("info", () => setTimeout(run, 500));

async function run() {
    if (!(await call("needSetup"))) return done("admin already exists, skipping");
    const setup = await call("setup", username, password);
    if (!setup.ok) return done(`setup failed: ${setup.msg}`);
    const login = await call("login", { username, password, token: "" });
    if (!login.ok) return done(`login failed: ${login.msg}`);
    const { data } = await call("getSettings");
    // Same defaults the Settings page fills in before its first save.
    const defaults = { checkUpdate: true, searchEngineIndex: false, entryPage: "dashboard", nscd: true,
        keepDataPeriodDays: 180, tlsExpiryNotifyDays: [7, 14, 21], domainExpiryNotifyDays: [7, 14, 21] };
    const saved = await call("setSettings", { ...defaults, ...data, trustProxy: true, primaryBaseURL: baseURL || data.primaryBaseURL }, password);
    done(`admin "${username}" created${saved.ok ? "" : `, settings not saved: ${saved.msg}`}`);
}
