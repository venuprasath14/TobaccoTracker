// Simple frontend-only server that redirects to Vite dev server
import { spawn } from 'child_process';

console.log('Starting TobaccoFree frontend-only React app...');

// Start Vite development server
const vite = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '5173'], {
  stdio: 'inherit',
  cwd: process.cwd()
});

vite.on('error', (err) => {
  console.error('Failed to start Vite server:', err);
  process.exit(1);
});

vite.on('close', (code) => {
  console.log(`Vite server exited with code ${code}`);
  process.exit(code || 0);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down...');
  vite.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Shutting down...');
  vite.kill('SIGTERM');
});