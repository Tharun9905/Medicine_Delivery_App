# 🚀 MediQuick Platform - Vercel Deployment Guide

This guide will help you deploy your MediQuick platform to Vercel with proper frontend-backend connectivity.

## 📋 Prerequisites

- [Vercel Account](https://vercel.com)
- [Vercel CLI](https://vercel.com/cli) installed globally: `npm i -g vercel`
- MongoDB Atlas account (for production database)
- All necessary API keys (Stripe, Google Maps, etc.)

## 🏗️ Project Structure

```
mediquick-platform/
├── frontend/          # Next.js frontend
├── backend/           # Node.js/Express backend
├── vercel.json        # Main Vercel configuration
├── deploy.js          # Deployment script
└── DEPLOYMENT.md      # This guide
```

## 🚀 Step-by-Step Deployment

### 1. Prepare Your Environment

First, run the deployment preparation script:

```bash
node deploy.js
```

### 2. Deploy Backend (API)

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy backend:
   ```bash
   vercel
   ```

4. When prompted:
   - Set up and deploy: `Y`
   - Which scope: Choose your account
   - Project name: `mediquick-backend` (or your preferred name)
   - Directory: `./` (current directory)
   - Want to override settings: `N`

5. Note the deployment URL (e.g., `https://mediquick-backend.vercel.app`)

### 3. Configure Environment Variables for Backend

In the Vercel dashboard for your backend project, add these environment variables:

#### Required Variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mediquick
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
```

#### Optional API Keys:
```
SMS_ACCOUNT_SID=your-twilio-account-sid
SMS_AUTH_TOKEN=your-twilio-auth-token
SMS_FROM_PHONE=+1234567890
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
STRIPE_SECRET_KEY=your-stripe-secret-key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
```

### 4. Deploy Frontend

1. Navigate to frontend directory:
   ```bash
   cd ../frontend
   ```

2. Update the Next.js config with your backend URL:
   - Open `next.config.js`
   - Replace `your-backend-url.vercel.app` with your actual backend URL

3. Deploy frontend:
   ```bash
   vercel
   ```

4. When prompted:
   - Set up and deploy: `Y`
   - Which scope: Choose your account
   - Project name: `mediquick-frontend` (or your preferred name)
   - Directory: `./` (current directory)
   - Want to override settings: `N`

### 5. Configure Environment Variables for Frontend

In the Vercel dashboard for your frontend project, add these environment variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.vercel.app/api
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.vercel.app
NEXT_PUBLIC_APP_NAME=MediQuick
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your-google-analytics-id
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NODE_ENV=production
```

### 6. Update Backend CORS Configuration

After frontend deployment, update your backend's CORS configuration:

1. Go to your backend's Vercel dashboard
2. Update the `FRONTEND_URL` environment variable with your frontend's URL
3. Redeploy the backend

## 🔧 Production Optimizations

### Database (MongoDB Atlas)

1. Create a MongoDB Atlas cluster
2. Add your Vercel IP ranges to the whitelist (or use 0.0.0.0/0 for all IPs)
3. Update the `MONGODB_URI` in your backend environment variables

### File Upload (Cloudinary)

1. Create a Cloudinary account
2. Get your cloud name, API key, and secret
3. Add them to your backend environment variables

### Payment Gateway

#### Stripe:
```
# Backend
STRIPE_SECRET_KEY=sk_live_...

# Frontend
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

#### Razorpay:
```
# Backend
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=your_secret_key

# Frontend
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_...
```

## 🔍 Testing Your Deployment

1. Visit your frontend URL
2. Test user registration/login
3. Test medicine browsing
4. Test cart functionality
5. Test order placement (with test payment)
6. Check real-time features (order tracking)

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors**: 
   - Ensure `FRONTEND_URL` in backend matches your frontend deployment URL
   - Check that both URLs are HTTPS

2. **Database Connection Errors**:
   - Verify MongoDB URI is correct
   - Check if IP whitelist includes Vercel IPs

3. **API Not Found (404)**:
   - Ensure API routes exist in backend
   - Check that backend deployment was successful

4. **Environment Variables Not Working**:
   - Ensure variables start with `NEXT_PUBLIC_` for frontend
   - Redeploy after adding environment variables

### Debug Tools:

1. **Check Vercel Functions Logs**:
   ```bash
   vercel logs [deployment-url]
   ```

2. **Local Testing with Production Env**:
   ```bash
   # Frontend
   npm run build
   npm start

   # Backend
   NODE_ENV=production npm start
   ```

## 🔄 Continuous Deployment

### Auto-deploy from Git:

1. Connect your Vercel projects to your Git repository
2. Enable auto-deployment on push to main branch
3. Set up preview deployments for feature branches

### GitHub Actions (Optional):

Create `.github/workflows/deploy.yml` for automated testing and deployment.

## 📱 Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] Backend health check passes (`/health` endpoint)
- [ ] User authentication works
- [ ] Medicine search and filtering work
- [ ] Cart and checkout process work
- [ ] Order tracking works
- [ ] Payment integration works (test mode first)
- [ ] File uploads work (prescriptions)
- [ ] Real-time notifications work
- [ ] Mobile responsiveness is good
- [ ] SEO meta tags are proper
- [ ] Analytics tracking works

## 🎉 Success!

Your MediQuick platform should now be live and fully functional on Vercel!

**Frontend URL**: https://your-frontend-url.vercel.app
**Backend URL**: https://your-backend-url.vercel.app

## 📞 Support

If you encounter any issues:
1. Check Vercel dashboard logs
2. Verify environment variables
3. Test locally with production settings
4. Check database connectivity

Good luck with your deployment! 🚀