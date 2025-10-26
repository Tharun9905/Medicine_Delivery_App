#!/usr/bin/env node

/**
 * Deployment script for MediQuick Platform
 * This script helps deploy both frontend and backend to Vercel
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 MediQuick Platform Deployment Script');
console.log('========================================\n');

// Check if we're in the right directory
const currentDir = process.cwd();
const frontendPath = path.join(currentDir, 'frontend');
const backendPath = path.join(currentDir, 'backend');

if (!fs.existsSync(frontendPath) || !fs.existsSync(backendPath)) {
  console.error('❌ Error: Please run this script from the root directory of your project');
  process.exit(1);
}

// Function to execute commands
const execCommand = (command, options = {}) => {
  try {
    console.log(`📦 Executing: ${command}`);
    const result = execSync(command, { 
      stdio: 'inherit', 
      cwd: options.cwd || currentDir 
    });
    return result;
  } catch (error) {
    console.error(`❌ Error executing: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
};

// Step 1: Install dependencies
console.log('📦 Installing dependencies...\n');
execCommand('npm install', { cwd: frontendPath });
execCommand('npm install', { cwd: backendPath });

// Step 2: Run tests (if they exist)
console.log('\n🧪 Running tests...\n');
try {
  execCommand('npm test', { cwd: frontendPath });
} catch (error) {
  console.log('ℹ️  Frontend tests skipped (no test command or tests failed)');
}

try {
  execCommand('npm test', { cwd: backendPath });
} catch (error) {
  console.log('ℹ️  Backend tests skipped (no test command or tests failed)');
}

// Step 3: Build frontend
console.log('\n🔧 Building frontend...\n');
execCommand('npm run build', { cwd: frontendPath });

// Step 4: Deployment instructions
console.log('\n✅ Pre-deployment checks complete!');
console.log('\n📋 Next steps for Vercel deployment:');
console.log('=====================================');
console.log('1. Install Vercel CLI: npm i -g vercel');
console.log('2. Login to Vercel: vercel login');
console.log('3. Deploy backend: cd backend && vercel');
console.log('4. Deploy frontend: cd frontend && vercel');
console.log('5. Set environment variables in Vercel dashboard');
console.log('\n💡 Important: Update the backend URL in your frontend environment variables!');
console.log('\n🎉 Ready for deployment!');