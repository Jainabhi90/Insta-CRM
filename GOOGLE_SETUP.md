# Google OAuth Setup Guide

## Problem
Google login fails because the backend cannot find credentials. The `.env.example` is a template only - you must create `.env.local` with **actual** values.

## Solution

### Step 1: Get Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new OAuth 2.0 Client ID for Web Application
3. Add authorized redirect URI: `http://localhost:3000/auth/google/callback`
4. Copy your:
   - Client ID
   - Client Secret

### Step 2: Update `.env.local`
Edit `/Users/akashsharma/Desktop/Instagram/Insta-CRM/.env.local` and replace:
- `YOUR_GOOGLE_CLIENT_ID_HERE` → your actual Google Client ID
- `YOUR_GOOGLE_CLIENT_SECRET_HERE` → your actual Google Client Secret

Example:
```
VITE_GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com
GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-1234567890abcdefghij
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

### Step 3: Restart Your App
1. Stop `npm run dev` if running
2. Start it again: `npm run dev`
3. The backend will now read from `.env.local`

### Step 4: Test
- Go to `http://localhost:3000/google-auth`
- Click "Sign Up with Google"
- You should be redirected to Google login (not error page)

## For Production (Vercel)
Use `.env.production.example` as reference and set environment variables in Vercel Dashboard:
- Settings → Environment Variables
- Set the same `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- Redirect URI: `https://insta-crm.vercel.app/auth/google/callback`
