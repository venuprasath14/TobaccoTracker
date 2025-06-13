import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tobaccofree.app',
  appName: 'TobaccoFree',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#4F46E5",
      showSpinner: false
    },
    StatusBar: {
      style: "dark"
    }
  }
};

export default config;
