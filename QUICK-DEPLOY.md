# 🚀 Quick Deployment Guide for MediQuick Platform

## Current Status: ✅ Ready for Deployment!

Your project has been fully configured and is ready for Vercel deployment. Follow these simple steps:

## Step 1: Login to Vercel
```powershell
vercel login
```
This will open your browser to log in to Vercel.

## Step 2: Deploy Backend First
```powershell
cd backend
vercel
```

When prompted:
- Set up and deploy: `Y`
- Project name: `mediquick-backend` (or your choice)
- Directory: `./` (current directory)
- Want to override settings: `N`

**📝 Important:** Save the backend URL (e.g., `https://mediquick-backend.vercel.app`)

## Step 3: Update Frontend Configuration
Before deploying the frontend, update the backend URL in:
- `frontend/next.config.js` (replace `your-backend-url.vercel.app` with your actual URL)

## Step 4: Deploy Frontend
```powershell
cd ../frontend
vercel
```

When prompted:
- Set up and deploy: `Y`
- Project name: `mediquick-frontend` (or your choice)
- Directory: `./` (current directory)
- Want to override settings: `N`

## Step 5: Configure Environment Variables

### In Vercel Dashboard for Backend:
1. Go to your backend project settings
2. Add Environment Variables:

**Essential Variables:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mediquick
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
```

**Optional API Keys:**
```
STRIPE_SECRET_KEY=sk_test_... (or sk_live_...)
RAZORPAY_KEY_ID=rzp_test_... (or rzp_live_...)
RAZORPAY_KEY_SECRET=your_secret_key
SMS_ACCOUNT_SID=your-twilio-account-sid
SMS_AUTH_TOKEN=your-twilio-auth-token
GOOGLE_MAPS_API_KEY=your-google-maps-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
```

### In Vercel Dashboard for Frontend:
1. Go to your frontend project settings
2. Add Environment Variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.vercel.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_...)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_... (or rzp_live_...)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
NODE_ENV=production
```

## Step 6: Test Your Deployment

1. Visit your frontend URL
2. Test user registration/login
3. Browse medicines
4. Test cart functionality
5. Try placing an order

## 🎯 What You Need Before Deployment:

### Database:
- **MongoDB Atlas** account (free tier available)
- Create a cluster and get connection string
- Whitelist Vercel IPs: `0.0.0.0/0` (or Vercel's IP ranges)

### Payment Processing:
- **Stripe**: Get API keys from dashboard.stripe.com
- **Razorpay**: Get API keys from dashboard.razorpay.com

### File Uploads:
- **Cloudinary**: Get credentials from cloudinary.com

### SMS/Notifications:
- **Twilio**: Get credentials from console.twilio.com

## 🔧 Troubleshooting:

### If you get CORS errors:
1. Ensure `FRONTEND_URL` in backend matches your frontend URL
2. Both URLs should be HTTPS

### If API calls fail:
1. Check environment variables are set correctly
2. Verify API URLs don't have trailing slashes
3. Check Vercel function logs

### If database connection fails:
1. Verify MongoDB URI is correct
2. Check IP whitelist in MongoDB Atlas
3. Ensure database user has correct permissions

## 🎉 You're All Set!

Your MediQuick platform will be live and fully functional once deployed!

**Need more details?** Check `DEPLOYMENT.md` for comprehensive instructions.