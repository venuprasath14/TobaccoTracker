import { execSync } from 'child_process';
import path from 'path';

// Start the React app from client directory
const clientPath = path.join(process.cwd(), 'client');
console.log('Starting React development server...');

try {
  execSync('npx vite --host 0.0.0.0 --port 3000', { 
    cwd: clientPath, 
    stdio: 'inherit' 
  });
} catch (error) {
  console.error('Failed to start React app:', error);
  process.exit(1);
}