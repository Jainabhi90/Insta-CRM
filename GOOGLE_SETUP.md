# Google OAuth Setup Guide

## Problem
Google login fails because the backend cannot find credentials, or redirect URIs don't match between frontend and backend.

## ⚠️ Critical: Redirect URI Must Match Exactly

The redirect URI must be set in THREE places and must be IDENTICAL in all:

1. **Google Cloud Console** - Authorized redirect URIs
2. **Frontend `.env.local`** - `VITE_GOOGLE_REDIRECT_URI`
3. **Backend `.env.local`** - `GOOGLE_REDIRECT_URI`

If any one is different, Google login will fail.

## Solution

### Step 1: Get Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new OAuth 2.0 Client ID for Web Application
3. Add authorized redirect URI: `http://localhost:3000/auth/google/callback`
4. Copy your:
   - Client ID
   - Client Secret

### Step 2: Update `.env.local`
Edit `/Users/akashsharma/Desktop/Instagram/Insta-CRM/.env.local` and set BOTH variables to the SAME value:

```
VITE_GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com
VITE_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-1234567890abcdefghij
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

**IMPORTANT:** Both `VITE_GOOGLE_REDIRECT_URI` and `GOOGLE_REDIRECT_URI` must have identical values.

### Step 3: Verify Your Configuration
Check these match:
- Google Console: `http://localhost:3000/auth/google/callback`
- Frontend env: `VITE_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback`
- Backend env: `GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback`

### Step 4: Restart Your App
1. Stop `npm run dev` if running
2. Start it again: `npm run dev`
3. The backend will now read from `.env.local`

### Step 5: Test
- Go to `http://localhost:3000/google-auth`
- Click "Sign Up with Google"
- You should be redirected to Google login (not error page)

## For Production (Vercel)
Use `.env.production.example` as reference and set environment variables in Vercel Dashboard:
- Settings → Environment Variables
- Set both variables to the SAME value:
  - `VITE_GOOGLE_REDIRECT_URI=https://insta-crm.vercel.app/auth/google/callback`
  - `GOOGLE_REDIRECT_URI=https://insta-crm.vercel.app/auth/google/callback`
- Also register this URL in Google Cloud Console authorized redirect URIs

## Troubleshooting

### Error: "Google redirect URI is required"
- Frontend `VITE_GOOGLE_REDIRECT_URI` is empty or not set in `.env.local`
- Backend `GOOGLE_REDIRECT_URI` is empty or not set in `.env.local`

### Error: "Google code exchange failed"
- Frontend and backend redirect URIs don't match
- Redirect URI doesn't match what's registered in Google Cloud Console
- Check all three locations are identical
