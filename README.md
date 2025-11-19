# Transaction Flow Calculator PWA

Transaction Flow Calculator is a React (PWA) application designed to capture quick micro-transactions across multiple accounts and aggregate them into clear, actionable cash-flow instructions. By surfacing only the net transfers that need to be executed, it drastically reduces the number of individual bank transfers and simplifies day-to-day money movement between accounts.

## Getting Started

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

### Google Analytics Configuration

To enable Google Analytics tracking, create a `.env` file in the root directory:

```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your Google Analytics Measurement ID (GA4). You can find it in your [Google Analytics](https://analytics.google.com/) account under Admin → Data Streams.

**Note:** The `.env` file is committed to the repository, so the same configuration will be used for both local development and production builds.

**Important:** Google Analytics is **only enabled in production builds** (`npm run build`). During development (`npm run dev`), tracking is disabled to avoid polluting your analytics data with test traffic. The application will automatically initialize Google Analytics in production when the `VITE_GA_MEASUREMENT_ID` environment variable is set.

The GitHub Actions workflow automatically sets `NODE_ENV=production` during the build process and uses the `VITE_GA_MEASUREMENT_ID` secret, so Google Analytics will be enabled in production deployments.

**Debugging:** Check the browser console for `[GA Debug]` messages to verify that Google Analytics is loading correctly.

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

