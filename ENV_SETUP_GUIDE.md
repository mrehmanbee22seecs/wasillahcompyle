# Environment Variables Setup Guide

This guide explains how to configure the required environment variables for the Wasillah platform after removing hardcoded API keys.

## 🔐 Security Changes

We've removed all hardcoded API keys and sensitive credentials from the codebase. You now need to set up environment variables to run the application.

## 📋 Required Environment Variables

### 1. Create Local Environment File

Copy the example file and fill in your actual values:

```bash
cp .env.example .env.local
```

### 2. Configure Environment Variables

Edit `.env.local` with your actual values:

#### **Resend Configuration** (Email Service)

Get your API key from [Resend Dashboard](https://resend.com/api-keys):

```env
VITE_RESEND_API_KEY=re_your_actual_api_key_here
RESEND_API_KEY=re_your_actual_api_key_here
VITE_RESEND_SENDER_EMAIL=noreply@wasillah.live
RESEND_SENDER_EMAIL=noreply@wasillah.live
```

#### **Firebase Client Configuration** (Web App)

Get these from [Firebase Console](https://console.firebase.google.com/):
1. Go to Project Settings > General
2. Scroll to "Your apps" section
3. Select your web app (or create one)
4. Copy the config values:

```env
VITE_FIREBASE_API_KEY=AIzaSy...your_actual_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

#### **Firebase Admin Configuration** (Server/Functions)

Get these from [Firebase Console](https://console.firebase.google.com/):
1. Go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Extract the values:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nPrivate\nKey\nHere\n-----END PRIVATE KEY-----\n"
```

**Important:** Keep the quotes around `FIREBASE_PRIVATE_KEY` and preserve the `\n` characters.

#### **Firebase Cloud Messaging VAPID Key** (Push Notifications)

Generate in [Firebase Console](https://console.firebase.google.com/):
1. Go to Project Settings > Cloud Messaging
2. Scroll to "Web Push certificates"
3. Click "Generate key pair"
4. Copy the key:

```env
VITE_FIREBASE_VAPID_KEY=BH...your_vapid_key_here
```

#### **Google Analytics 4** (Optional - Analytics)

Get from [Google Analytics](https://analytics.google.com):

```env
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 🚀 Deployment Configuration

### Vercel Deployment

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add all variables from your `.env.local` file
4. Make sure to add them for all environments (Production, Preview, Development)

### Firebase Functions Deployment

For Firebase Cloud Functions, set the config variables:

```bash
# Resend configuration
firebase functions:config:set resend.api_key="re_your_api_key_here"
firebase functions:config:set resend.sender="noreply@wasillah.live"

# Or for Firebase Functions v2 with .env
# Create functions/.env file with:
RESEND_API_KEY=re_your_api_key_here
RESEND_SENDER=noreply@wasillah.live
```

## ✅ Verification

After setting up environment variables, verify the setup:

### 1. Check Build

```bash
npm run build
```

You should see:
- ✅ Firebase config injected into service worker
- No errors about missing environment variables

### 2. Check Runtime

Start the dev server:

```bash
npm run dev
```

Open browser console and verify:
- No errors about undefined Firebase config
- Authentication works properly
- Database operations work

### 3. Check Service Worker

After building, check `dist/firebase-messaging-sw.js`:
- Should NOT contain `__VITE_` placeholders
- Should contain your actual Firebase config values

## 🔒 Security Best Practices

1. **Never commit `.env.local` or `.env` files** - They are in `.gitignore`
2. **Rotate API keys regularly** - Every 90 days recommended
3. **Use different keys for development and production**
4. **Review Firebase Security Rules** - Ensure they're properly configured
5. **Monitor API usage** - Set up alerts in Resend and Firebase consoles

## 🆘 Troubleshooting

### Error: "RESEND_API_KEY environment variable is required"

- Make sure you've created `.env.local` file
- Verify `RESEND_API_KEY` is set in the file
- Restart your dev server after adding the variable

### Error: "Firebase: Error (auth/invalid-api-key)"

- Check that all `VITE_FIREBASE_*` variables are set correctly
- Verify the values match your Firebase project
- Make sure there are no extra spaces or quotes

### Service Worker Not Working

- Build the project: `npm run build`
- Check that placeholders were replaced in `dist/firebase-messaging-sw.js`
- Verify environment variables are available during build time

### Vercel Deployment Fails

- Ensure all environment variables are added in Vercel dashboard
- Check that variable names match exactly (case-sensitive)
- Redeploy after adding variables

## 📚 Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Firebase Setup Guide](https://firebase.google.com/docs/web/setup)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## 🔄 Migration from Old Setup

If you were using the old hardcoded values:

1. **URGENT**: The old Resend API key `re_TWHg3zaz_7KQnXVULcpgG57GtJxohNxve` should be **revoked immediately** from your Resend dashboard
2. Generate a new Resend API key
3. Set up all environment variables as described above
4. Test thoroughly before deploying

---

**Need Help?** Contact the development team or open an issue in the repository.
