# 🗄️ Quick MongoDB Atlas Setup for MediQuick

## Option 1: Full Setup (Recommended)

### Create MongoDB Atlas Account:
1. Go to https://mongodb.com/atlas
2. Sign up with email (free forever)
3. Verify email

### Create Free Cluster:
1. "Create a deployment" → Choose "M0 FREE"
2. Provider: AWS, Region: Closest to you
3. Cluster Name: `MediQuick`
4. Click "Create Deployment"

### Security Setup:
1. **Database User**:
   - Username: `mediquick-user`
   - Password: `MediQuick2024!` (save this)
   - Click "Create User"

2. **Network Access**:
   - "Add IP Address" → "Allow Access from Anywhere"
   - IP: `0.0.0.0/0` (for Railway deployment)
   - Click "Confirm"

### Get Connection String:
1. Click "Connect" on your cluster
2. "Connect your application"
3. Copy the connection string:
```
mongodb+srv://mediquick-user:MediQuick2024!@mediquick.xxxxx.mongodb.net/mediquick?retryWrites=true&w=majority
```

## Option 2: Use Railway's MongoDB Plugin

1. In Railway dashboard, click "Add Plugin"
2. Select "MongoDB"
3. Use the provided `MONGO_URL` environment variable

## Option 3: Temporary Free Database

Use MongoDB's free cloud database:
```
MONGODB_URI=mongodb+srv://public:public@cluster0.xxxxx.mongodb.net/mediquick?retryWrites=true&w=majority
```

## 🚀 After Database Setup:

Add to Railway environment variables:
```env
NODE_ENV=production
PORT=$PORT
MONGODB_URI=your-mongodb-connection-string-here
JWT_SECRET=mediquick-super-secure-jwt-secret-key-minimum-32-characters-2024
```

Then redeploy in Railway!

## ✅ Test Your Deployment:

After successful deployment, you'll get a URL like:
`https://your-app-name.railway.app`

Test endpoints:
- `https://your-app-name.railway.app/health` ✅
- `https://your-app-name.railway.app/api/medicines` ✅

Your MediQuick platform will be live! 🎉