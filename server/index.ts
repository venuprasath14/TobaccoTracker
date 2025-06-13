import { execSync } from 'child_process';

// Start the React app using the root vite config on port 5000
console.log('Starting React development server...');

try {
  execSync('npx vite --host 0.0.0.0 --port 5000', { 
    stdio: 'inherit' 
  });
} catch (error) {
  console.error('Failed to start React app:', error);
  process.exit(1);
}