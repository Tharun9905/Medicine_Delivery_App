# MediQuick GitHub Setup Script
# This script will create a GitHub repository and push your code

Write-Host "🚀 MediQuick GitHub Setup Starting..." -ForegroundColor Green

# Navigate to project directory
Set-Location "c:\Users\THARUN\Downloads\mediquick-complete-fullstack\mediquick"

Write-Host "📁 Current directory: $(Get-Location)" -ForegroundColor Blue

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "❌ Not a git repository. Please run 'git init' first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Git repository detected" -ForegroundColor Green

# Set git config (you may need to change the email)
Write-Host "🔧 Setting up git configuration..." -ForegroundColor Blue
git config user.name "Tharun9905"
git config user.email "tharun@example.com"  # Change this to your actual email

# Check git status
Write-Host "📋 Checking git status..." -ForegroundColor Blue
git status

# Create README with project information
$readmeContent = @"
# MediQuick - Medicine Delivery Platform

A full-stack medicine delivery application built with Next.js (Frontend) and Node.js/Express (Backend).

## 🏗️ Project Structure

```
mediquick/
├── frontend/          # Next.js React application
├── backend/           # Node.js Express API
├── docker-compose.yml # Docker configuration
└── README.md         # This file
```

## 🚀 Features

- User authentication and authorization
- Medicine catalog with search and filtering
- Shopping cart functionality
- Order management system
- Prescription upload and management
- Address management
- Payment integration (Stripe)
- Real-time notifications (Socket.io)
- Admin panel for medicine and order management

## 🛠️ Technology Stack

### Frontend
- **Next.js** - React framework for production
- **React** - JavaScript library for building user interfaces
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - Promise-based HTTP client

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **Stripe** - Payment processing
- **Socket.io** - Real-time communication
- **Multer** - File upload handling
- **Redis** - Caching and session storage
- **Bull** - Queue management

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Redis (optional, for caching)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tharun9905/mediquick.git
   cd mediquick
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   
   **Backend (.env in backend/ directory):**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mediquick
   JWT_SECRET=your_jwt_secret_here
   STRIPE_SECRET_KEY=your_stripe_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```
   
   **Frontend (.env.local in frontend/ directory):**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Run the application**
   
   **Using Docker (Recommended):**
   ```bash
   docker-compose up
   ```
   
   **Manual setup:**
   ```bash
   # Terminal 1: Start backend
   cd backend
   npm run dev
   
   # Terminal 2: Start frontend
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 📚 API Documentation

The backend API includes the following main endpoints:

- **Authentication:** `/api/auth/*`
- **Users:** `/api/users/*`
- **Medicines:** `/api/medicines/*`
- **Orders:** `/api/orders/*`
- **Cart:** `/api/cart/*`
- **Addresses:** `/api/addresses/*`
- **Prescriptions:** `/api/prescriptions/*`
- **Payments:** `/api/payments/*`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Tharun9905**
- GitHub: [@Tharun9905](https://github.com/Tharun9905)

## 🙏 Acknowledgments

- Thanks to all the open-source libraries that made this project possible
- Special thanks to the healthcare workers who inspired this project

---

⭐ Star this repository if you found it helpful!
"@

Write-Host "📝 Creating comprehensive README.md..." -ForegroundColor Blue
$readmeContent | Out-File -FilePath "README.md" -Encoding UTF8

# Add and commit the updated README
git add README.md
git commit -m "docs: Add comprehensive README with project documentation"

Write-Host "📄 README.md created and committed" -ForegroundColor Green

# Show the final status
Write-Host "📊 Final git status:" -ForegroundColor Blue
git status

Write-Host "🎉 Project is ready for GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to https://github.com/new" -ForegroundColor White
Write-Host "2. Repository name: mediquick" -ForegroundColor White
Write-Host "3. Description: Medicine delivery platform built with Next.js and Node.js" -ForegroundColor White
Write-Host "4. Make it Public" -ForegroundColor White
Write-Host "5. DON'T initialize with README (we already have one)" -ForegroundColor White
Write-Host "6. Click 'Create repository'" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Then run these commands:" -ForegroundColor Yellow
Write-Host "git remote add origin https://github.com/Tharun9905/mediquick.git" -ForegroundColor Cyan
Write-Host "git branch -M main" -ForegroundColor Cyan
Write-Host "git push -u origin main" -ForegroundColor Cyan