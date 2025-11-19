# Transaction Flow Calculator PWA

A React (Vite) PWA template with service worker and manifest preconfigured for an account flow calculation application.

## Getting Started

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

For Docker development:

```bash
docker compose up -d
docker compose exec web npm start
```

## Production Build

```bash
npm run build
npm run preview
```

## Quality & Testing

- Lint: `npm run lint`
- Format: `npx prettier --check .`
- Unit tests: `npm test`

## Offline Support

The service worker pre-caches the app shell (`index.html`, manifest, icons) and caches GET requests for offline functionality.

## PWA Installation

On iOS (Safari): `Share` → `Add to Home Screen`.

On desktop (Chrome/Edge): `Install` icon in the address bar.

## Testing on Mobile with LocalTunnel

LocalTunnel allows you to expose your local server on the internet with a public URL, to test on your mobile device.

### Installing LocalTunnel

```bash
npm install -g localtunnel
```

### Usage

1. **Start the development server** (in a first terminal):
   ```bash
   npm run start
   ```
   The server will be accessible on `http://localhost:5173`

2. **Create the tunnel** (in a second terminal):
   ```bash
   npm run tunnel
   ```
   
   Or manually:
   ```bash
   lt --port 5173 --print-requests
   ```

3. **Get your public URL**:
   - LocalTunnel will give you a URL like `https://xxxxx.loca.lt`
   - This URL will be accessible from any device connected to the internet

4. **Test on your mobile**:
   - Open this URL in your mobile device's browser
   - Make sure your mobile and your computer are on the same Wi-Fi network (or use mobile data)

### Useful Options

- **Custom URL** (if available):
  ```bash
  lt --port 5173 --subdomain my-app
  ```

- **With Docker**:
  If you're using Docker, you can also create the tunnel from your host machine:
  ```bash
  lt --port 5173
  ```

### Important Notes

- The LocalTunnel URL changes every time (unless you use `--subdomain`)
- The tunnel remains active as long as the process is running
- HTTP/HTTPS requests are displayed in the terminal with `--print-requests`
- For production use, use a service like ngrok (paid) or a VPS

## Using Your Hostinger Subdomain (transaction-flow-calculator.javid-m.pro)

You can use your own Hostinger subdomain without LocalTunnel. Two options:

### Option 1: Cloudflare Tunnel (free, recommended for development)

Cloudflare Tunnel allows you to expose your local server with your own domain, for free.

1. **Install cloudflared**:
   ```bash
   # macOS
   brew install cloudflare/cloudflare/cloudflared
   
   # Or via npm
   npm install -g cloudflared
   ```

2. **Authenticate with Cloudflare**:
   ```bash
   cloudflared tunnel login
   ```
   This will open your browser to connect to Cloudflare.

3. **Create a tunnel**:
   ```bash
   cloudflared tunnel create transaction-flow-calculator
   ```
   Note the tunnel ID that will be displayed (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).

4. **Configure DNS in Hostinger**:
   - Log in to your Hostinger panel
   - Go to **Domains** → **DNS Management** for `javid-m.pro`
   - Add a CNAME record:
     - **Type**: CNAME
     - **Name**: `transaction-flow-calculator`
     - **Value**: `[tunnel-id].cfargotunnel.com` (replace `[tunnel-id]` with the ID obtained in step 3)
     - **TTL**: Auto or 3600

5. **Create the configuration file**:
   ```bash
   mkdir -p ~/.cloudflared
   ```
   
   Create `~/.cloudflared/config.yml`:
   ```yaml
   tunnel: [your-tunnel-id]
   credentials-file: /Users/Javid/.cloudflared/[tunnel-id].json
   
   ingress:
     - hostname: transaction-flow-calculator.javid-m.pro
       service: http://localhost:5173
     - service: http_status:404
   ```
   Replace `[your-tunnel-id]` with the ID obtained in step 3.

6. **Start the development server** (terminal 1):
   ```bash
   npm run start
   ```

7. **Start the tunnel** (terminal 2):
   ```bash
   cloudflared tunnel run transaction-flow-calculator
   ```

Your application will be accessible at `https://transaction-flow-calculator.javid-m.pro`!

### Option 2: Deploy to Hostinger (for production)

If you have web hosting with Hostinger, you can deploy the application directly.

1. **Build the application**:
   ```bash
   npm run build
   ```
   Production files will be in the `dist/` folder.

2. **Upload the files**:
   - Log in to your Hostinger panel (hPanel)
   - Go to **Files** → **File Manager**
   - Create a `transaction-flow-calculator` folder (or use an existing subfolder)
   - Upload **all files** from the `dist/` folder into this folder

3. **Configure DNS in Hostinger**:
   - Go to **Domains** → **DNS Management** for `javid-m.pro`
   - Add a record:
     - **Type**: A (if you have a fixed IP) or CNAME (if you're using a hosting subdomain)
     - **Name**: `transaction-flow-calculator`
     - **Value**: 
       - For A: your Hostinger server IP
       - For CNAME: the hosting domain provided by Hostinger (e.g., `your-site.hosting.hostinger.com`)
     - **TTL**: 3600

4. **Configure the web server**:
   - If Hostinger uses Apache/Nginx, make sure the configuration points to the `dist/` folder
   - For a React SPA, configure the server to redirect all routes to `index.html`

5. **Enable HTTPS**:
   - In Hostinger, enable the free SSL certificate (Let's Encrypt) for the subdomain

### npm Script for Cloudflare Tunnel

Add this script to `package.json` to make it easier to use:

```json
"tunnel:cloudflare": "cloudflared tunnel run transaction-flow-calculator"
```

Then use:
```bash
npm run tunnel:cloudflare
```

### Important Notes

- **Cloudflare Tunnel**: Ideal for development and testing. The tunnel must remain active.
- **Hostinger Deployment**: Ideal for production. The application will always be accessible.
- DNS propagation can take a few minutes to a few hours.
- For HTTPS with Cloudflare Tunnel, it's automatic and free.
- For HTTPS with Hostinger, enable the SSL certificate in the panel.
