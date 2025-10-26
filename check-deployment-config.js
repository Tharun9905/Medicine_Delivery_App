#!/usr/bin/env node

/**
 * Configuration Checker for MediQuick Platform Deployment
 * This script checks if your project is properly configured for Vercel deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 MediQuick Platform - Deployment Configuration Check');
console.log('====================================================\n');

let errors = [];
let warnings = [];
let success = [];

// Check file existence
const checkFile = (filePath, description, required = true) => {
  if (fs.existsSync(filePath)) {
    success.push(`✅ ${description}: Found`);
    return true;
  } else {
    if (required) {
      errors.push(`❌ ${description}: Missing (${filePath})`);
    } else {
      warnings.push(`⚠️  ${description}: Missing (${filePath})`);
    }
    return false;
  }
};

// Check directory structure
console.log('📁 Checking Directory Structure...\n');
checkFile('./frontend', 'Frontend directory');
checkFile('./backend', 'Backend directory');
checkFile('./frontend/package.json', 'Frontend package.json');
checkFile('./backend/package.json', 'Backend package.json');
checkFile('./frontend/next.config.js', 'Next.js configuration');
checkFile('./vercel.json', 'Main Vercel configuration');
checkFile('./backend/vercel.json', 'Backend Vercel configuration');
checkFile('./DEPLOYMENT.md', 'Deployment guide');

// Check configuration files
console.log('\n⚙️  Checking Configuration Files...\n');
checkFile('./frontend/.env.production', 'Frontend production environment', false);
checkFile('./frontend/.vercelignore', 'Frontend Vercel ignore file');
checkFile('./backend/.vercelignore', 'Backend Vercel ignore file');
checkFile('./backend/.env.example', 'Backend environment example');
checkFile('./frontend/.env.example', 'Frontend environment example');

// Check package.json scripts
console.log('\n📦 Checking Package.json Scripts...\n');
try {
  const rootPackage = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const frontendPackage = JSON.parse(fs.readFileSync('./frontend/package.json', 'utf8'));
  const backendPackage = JSON.parse(fs.readFileSync('./backend/package.json', 'utf8'));

  // Check root scripts
  if (rootPackage.scripts.deploy) {
    success.push('✅ Root deployment script: Found');
  } else {
    warnings.push('⚠️  Root deployment script: Missing');
  }

  // Check frontend scripts
  if (frontendPackage.scripts.build) {
    success.push('✅ Frontend build script: Found');
  } else {
    errors.push('❌ Frontend build script: Missing');
  }

  // Check backend scripts
  if (backendPackage.scripts.start) {
    success.push('✅ Backend start script: Found');
  } else {
    errors.push('❌ Backend start script: Missing');
  }

} catch (error) {
  errors.push('❌ Error reading package.json files');
}

// Check Next.js configuration
console.log('\n⚙️  Checking Next.js Configuration...\n');
try {
  const nextConfigPath = './frontend/next.config.js';
  if (fs.existsSync(nextConfigPath)) {
    const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
    
    if (nextConfigContent.includes('output: \'standalone\'')) {
      success.push('✅ Next.js standalone output: Configured');
    } else {
      warnings.push('⚠️  Next.js standalone output: Not configured');
    }

    if (nextConfigContent.includes('NEXT_PUBLIC_API_URL')) {
      success.push('✅ API URL configuration: Found');
    } else {
      warnings.push('⚠️  API URL configuration: Not found in next.config.js');
    }
  }
} catch (error) {
  warnings.push('⚠️  Could not analyze Next.js configuration');
}

// Check Vercel configuration
console.log('\n🔧 Checking Vercel Configuration...\n');
try {
  const vercelConfig = JSON.parse(fs.readFileSync('./vercel.json', 'utf8'));
  
  if (vercelConfig.builds && vercelConfig.builds.length > 0) {
    success.push('✅ Vercel builds configuration: Found');
  } else {
    errors.push('❌ Vercel builds configuration: Missing');
  }

  if (vercelConfig.routes && vercelConfig.routes.length > 0) {
    success.push('✅ Vercel routes configuration: Found');
  } else {
    warnings.push('⚠️  Vercel routes configuration: Missing');
  }
} catch (error) {
  errors.push('❌ Error reading Vercel configuration');
}

// Print results
console.log('\n📊 Configuration Check Results');
console.log('==============================\n');

if (success.length > 0) {
  console.log('✅ Successful Checks:');
  success.forEach(item => console.log(`   ${item}`));
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  Warnings:');
  warnings.forEach(item => console.log(`   ${item}`));
  console.log('');
}

if (errors.length > 0) {
  console.log('❌ Errors (Must Fix Before Deployment):');
  errors.forEach(item => console.log(`   ${item}`));
  console.log('');
}

// Final assessment
console.log('📋 Final Assessment:');
console.log('===================');

if (errors.length === 0) {
  if (warnings.length === 0) {
    console.log('🎉 Perfect! Your project is ready for Vercel deployment!');
    console.log('💡 Run: npm run deploy');
  } else {
    console.log('✅ Good! Your project can be deployed, but consider fixing warnings.');
    console.log('💡 Run: npm run deploy');
  }
} else {
  console.log('❌ Your project has configuration errors that must be fixed before deployment.');
  console.log('💡 Fix the errors above and run this check again.');
  process.exit(1);
}

console.log('\n📖 For detailed deployment instructions, see DEPLOYMENT.md');
console.log('🔗 Vercel Dashboard: https://vercel.com/dashboard');