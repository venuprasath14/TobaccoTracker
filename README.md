# TobaccoFree App

A pure React frontend application for tracking your tobacco-free journey with local device storage and Android APK support.

## Features

- Daily tobacco usage tracking with local storage
- 30-day progress visualization calendar
- Streak tracking and statistics
- Money saved calculations
- Motivational messages and health benefits
- Mobile-optimized responsive design
- Android APK generation via Capacitor

## Development

### Prerequisites

- Node.js 18+ and npm
- Android Studio (for APK building)
- Java 17+ (for Android builds)

### Running the App

1. **Development Server:**
   ```bash
   cd client
   npm install
   npm run dev
   ```

2. **Build for Production:**
   ```bash
   cd client
   npm run build
   ```

## Building Android APK

### Setup Android Development

1. **Install Android Studio:**
   - Download from https://developer.android.com/studio
   - Install Android SDK and build tools
   - Set up environment variables (ANDROID_HOME, etc.)

2. **Build the APK:**
   ```bash
   # Build the React app
   cd client && npm run build && cd ..
   
   # Sync with Capacitor
   npx cap sync
   
   # Open in Android Studio
   npx cap open android
   ```

3. **In Android Studio:**
   - Wait for Gradle sync to complete
   - Build > Generate Signed Bundle/APK
   - Choose APK and follow the signing process
   - Or use Build > Build Bundle(s)/APK(s) > Build APK(s) for debug build

### Alternative Command Line Build

```bash
# Build debug APK
cd android
./gradlew assembleDebug

# Build release APK (requires signing)
./gradlew assembleRelease
```

The APK files will be located in:
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release.apk`

## App Structure

```
├── client/src/
│   ├── App.tsx          # Main React component
│   ├── App.css          # Mobile-first styles
│   └── main.tsx         # React entry point
├── android/             # Capacitor Android project
├── dist/                # Built React app
└── capacitor.config.ts  # Capacitor configuration
```

## Data Storage

All user data is stored locally on the device using localStorage:
- Daily entries with tobacco usage status
- User statistics and streaks
- No server required - completely offline

## Customization

### Colors and Branding
Edit `client/src/App.css` to customize:
- Gradient backgrounds
- Button colors
- Card styling
- Mobile responsive breakpoints

### App Configuration
Edit `capacitor.config.ts` for:
- App ID and name
- Splash screen settings
- Status bar configuration
- Plugin settings

## Deployment

### Web Deployment
Deploy the `dist/` folder to any static hosting service:
- Netlify, Vercel, GitHub Pages
- AWS S3, Firebase Hosting
- Any web server

### Android Store
1. Generate a signed APK using Android Studio
2. Follow Google Play Store publishing guidelines
3. Upload to Google Play Console

## Troubleshooting

### Build Issues
- Ensure Node.js 18+ is installed
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

### Android Build Issues
- Ensure Android Studio and SDK are properly installed
- Check Java version: `java -version` (should be 17+)
- Sync Capacitor: `npx cap sync`
- Clean Gradle: `cd android && ./gradlew clean`

### Storage Issues
- Data persists in browser localStorage
- Clear app data in Android settings to reset
- Data is device-specific and not synced

## License

MIT License - feel free to customize and distribute.