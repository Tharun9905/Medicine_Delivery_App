# 🔄 Update Backend URL After Deployment

After you deploy your backend to Vercel, you'll get a URL like:
`https://mediquick-backend-xyz123.vercel.app`

## Update Frontend Configuration:

1. Open `frontend/next.config.js`
2. Find lines 25 and 32:
   - Line 25: `? 'https://your-backend-url.vercel.app/api'`
   - Line 32: `? 'https://your-backend-url.vercel.app'`

3. Replace `your-backend-url.vercel.app` with your actual backend URL

4. Example:
```javascript
// Before:
? 'https://your-backend-url.vercel.app/api'

// After:
? 'https://mediquick-backend-xyz123.vercel.app/api'
```

## Or Use Environment Variables (Recommended):

Instead of hardcoding URLs, you can set them as environment variables in Vercel:

1. In your frontend Vercel project dashboard:
2. Go to Settings > Environment Variables
3. Add:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend-url.vercel.app/api`
   - `NEXT_PUBLIC_SOCKET_URL` = `https://your-backend-url.vercel.app`

This way, you don't need to modify the code!