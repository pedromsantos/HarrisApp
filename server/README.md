# HarrisApp Backend Proxy Server

This is a secure backend proxy server for HarrisApp that handles API key authentication with the Harris Jazz Lines API.

## Purpose

The backend proxy server solves the security issue of exposing API keys in the frontend by:

- Keeping the API key secure on the server side
- Proxying requests from the frontend to the Harris Jazz Lines API
- Adding proper authentication headers to all requests

## Setup

1. **Install dependencies**:

   ```bash
   cd server
   npm install
   ```

2. **Configure environment variables**:

   ```bash
   cp env.example .env
   ```

   Edit `.env` and add your actual API key:

   ```
   WES_API_KEY=your-actual-api-key-here
   WES_API_BASE_URL=https://api.harrisjazzlines.com
   PORT=3001
   ```

3. **Start the server**:

   For development:

   ```bash
   npm run dev
   ```

   For production:

   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Health Check

- **GET** `/health`
- Returns server status and API key configuration status

### Lines Generation

- **POST** `/api/lines`
- Proxies requests to the Harris Jazz Lines API `/lines` endpoint
- Automatically includes authentication headers

### Generic Proxy

- **ALL** `/api/*`
- Proxies any request to the corresponding Harris Jazz Lines API endpoint
- Automatically includes authentication headers

## Security Features

- ✅ API key stored securely in environment variables
- ✅ CORS configured for frontend requests
- ✅ Error handling without exposing sensitive information
- ✅ Input validation and sanitization
- ✅ No API key exposure to client-side code

## Development Notes

- The server runs on port 3001 by default
- CORS is configured to allow requests from the frontend
- The server automatically adds the `X-API-Key` header to all requests
- Error responses are sanitized to avoid exposing internal details

## Environment Variables

| Variable           | Description               | Default                           |
| ------------------ | ------------------------- | --------------------------------- |
| `WES_API_KEY`      | Harris Jazz Lines API key | _Required_                        |
| `WES_API_BASE_URL` | Base URL for the API      | `https://api.harrisjazzlines.com` |
| `PORT`             | Port for the proxy server | `3001`                            |
