# Cloudflare Deployment Guide

This guide walks you through deploying both the React frontend and Express.js backend to Cloudflare infrastructure.

## Architecture Overview

- **Frontend**: React app deployed to **Cloudflare Pages**
- **Backend**: Express.js server converted to **Cloudflare Worker**
- **Domain**: Both can share the same domain with subdirectories or use subdomains

## Prerequisites

1. **Cloudflare Account**: [Sign up for free](https://dash.cloudflare.com/sign-up)
2. **Wrangler CLI**: Cloudflare's CLI tool

   ```bash
   npm install -g wrangler
   ```

3. **GitHub Repository**: Your code should be in a GitHub repository
4. **Harris Jazz Lines API Key**: Your API key for the backend

## Step 1: Deploy Backend (Cloudflare Worker)

### 1.1 Install Worker Dependencies

```bash
cd server
npm install
```

### 1.2 Authenticate with Cloudflare

```bash
wrangler login
```

### 1.3 Set Up Environment Variables

Set your API key as a secret:

```bash
cd server
wrangler secret put WES_API_KEY
# Enter your Harris Jazz Lines API key when prompted
```

### 1.4 Deploy the Worker

For development:

```bash
npm run deploy:worker
```

For production:

```bash
npm run deploy:worker:prod
```

After deployment, you'll see output like:

```
Published harrisapp-backend (4.2 sec)
  https://harrisapp-backend.your-subdomain.workers.dev
```

**Important**: Copy this Worker URL - you'll need it for the frontend configuration.

### 1.5 Test the Worker

Test the health endpoint:

```bash
curl https://harrisapp-backend.your-subdomain.workers.dev/health
```

Should return:

```json
{
  "status": "ok",
  "hasApiKey": true,
  "apiBaseUrl": "https://api.harrisjazzlines.com"
}
```

## Step 2: Deploy Frontend (Cloudflare Pages)

### 2.1 Configure Environment Variables

Create a `.env.production.local` file in the root directory:

```bash
# Production Environment Variables
VITE_API_URL=https://harrisapp-backend.your-subdomain.workers.dev
```

Replace `your-subdomain` with your actual Worker subdomain from Step 1.4.

### 2.2 Build the Frontend

```bash
npm run build
```

### 2.3 Deploy to Cloudflare Pages

#### Option A: Connect GitHub Repository (Recommended)

1. Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/pages)
2. Click **"Create a project"**
3. Connect your GitHub account and select your repository
4. Configure build settings:
   - **Framework preset**: React
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Environment variables**:
     - `VITE_API_URL`: `https://harrisapp-backend.your-subdomain.workers.dev`

#### Option B: Direct Upload

```bash
# Install Pages CLI
npm install -g @cloudflare/pages-cli

# Deploy directly
npx pages deploy dist --project-name=harrisapp
```

### 2.4 Configure Custom Domain (Optional)

1. In Pages dashboard, go to your project
2. Click **"Custom domains"**
3. Add your domain (e.g., `app.yourdomain.com`)
4. Follow DNS instructions

## Step 3: Update API URL in Frontend

After deployment, update your production environment:

1. In Cloudflare Pages dashboard, go to your project
2. Go to **Settings** → **Environment variables**
3. Add production variable:
   - **Variable name**: `VITE_API_URL`
   - **Value**: `https://harrisapp-backend.your-subdomain.workers.dev`

## Step 4: Test the Full Deployment

1. Visit your Cloudflare Pages URL
2. Test the Barry Harris Line Generator
3. Check the browser network tab to confirm API calls go to your Worker

## Development vs Production URLs

### Development (Local)

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001` (Express server)
- API calls: `/api/*` (proxied through Vite)

### Production (Cloudflare)

- Frontend: `https://your-app.pages.dev` or custom domain
- Backend: `https://harrisapp-backend.your-subdomain.workers.dev`
- API calls: `https://harrisapp-backend.your-subdomain.workers.dev/api/*`

## Useful Commands

### Development

```bash
# Start both frontend and backend locally
npm run dev

# Start worker development server
npm run worker:dev
```

### Deployment

```bash
# Deploy worker
npm run worker:deploy

# Deploy worker to production environment
npm run worker:deploy:prod

# Update worker secrets
npm run worker:secret
```

### Monitoring

```bash
# View worker logs
wrangler tail harrisapp-backend

# View worker analytics
wrangler pages deployment list --project-name=harrisapp
```

## Environment Variables Reference

### Worker (Cloudflare Dashboard → Workers → harrisapp-backend → Settings → Variables)

- `WES_API_KEY`: Your Harris Jazz Lines API key (Secret)
- `WES_API_BASE_URL`: `https://api.harrisjazzlines.com` (Variable)

### Pages (Cloudflare Dashboard → Pages → harrisapp → Settings → Environment variables)

- `VITE_API_URL`: Your worker URL (e.g., `https://harrisapp-backend.your-subdomain.workers.dev`)

## Custom Domain Setup (Optional)

### Option 1: Subdomains

- Frontend: `app.yourdomain.com` (Pages)
- Backend: `api.yourdomain.com` (Worker with custom route)

### Option 2: Same Domain with Paths

- Frontend: `yourdomain.com/*` (Pages)
- Backend: `yourdomain.com/api/*` (Worker route)

## Troubleshooting

### Common Issues

1. **CORS Errors**

   - Check that your Worker includes CORS headers
   - Verify the Worker URL in frontend environment variables

2. **API Key Not Working**

   - Ensure the secret is set: `wrangler secret put WES_API_KEY`
   - Check worker logs: `wrangler tail harrisapp-backend`

3. **Build Failures**

   - Verify all dependencies are installed
   - Check build command matches your framework

4. **404 Errors on Refresh**
   - Ensure `_redirects` file is in the build output
   - Configure SPA redirects in Pages settings

### Viewing Logs

```bash
# Worker logs
wrangler tail harrisapp-backend

# Pages deployment logs
wrangler pages deployment list --project-name=harrisapp
```

## Cost Considerations

### Cloudflare Free Tier Limits

- **Workers**: 100,000 requests/day
- **Pages**: Unlimited static requests, 20,000 builds/month
- **KV Storage**: 10GB storage, 100,000 reads/day

These limits are generous for most applications. Paid plans are available for higher usage.

## Security Features

✅ **API Key Protection**: API key stored securely in Worker environment
✅ **CORS Configuration**: Proper CORS headers for cross-origin requests
✅ **HTTPS Everywhere**: Both frontend and backend served over HTTPS
✅ **Environment Separation**: Separate dev/prod Worker environments
✅ **No Client-Side Secrets**: API keys never exposed to browser

## Next Steps

1. Set up monitoring with Cloudflare Analytics
2. Configure error tracking (e.g., Sentry)
3. Set up automated deployments via GitHub Actions
4. Consider implementing caching strategies
5. Set up custom domains for better branding

For more advanced configurations, see the [Cloudflare Workers](https://developers.cloudflare.com/workers/) and [Cloudflare Pages](https://developers.cloudflare.com/pages/) documentation.
