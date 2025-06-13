import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import { createRequire } from 'module';
import path from 'path';

const require = createRequire(import.meta.url);

// Create and start Vite dev server with proper configuration
async function startServer() {
  console.log('Starting React development server...');
  
  const server = await createServer({
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "client", "src"),
        "@shared": path.resolve(process.cwd(), "shared"),
        "@assets": path.resolve(process.cwd(), "attached_assets"),
      },
    },
    root: path.resolve(process.cwd(), "client"),
    css: {
      postcss: path.resolve(process.cwd(), "client", "postcss.config.js"),
    },
    server: {
      host: true,
      port: 5000,
      strictPort: true
    },
    define: {
      global: 'globalThis',
    }
  });

  await server.listen();
  server.printUrls();
}

startServer().catch((error) => {
  console.error('Failed to start React app:', error);
  process.exit(1);
});