
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b66357bda4fb4874abbaaa926b780afa',
  appName: 'YourCalendar',
  webDir: 'dist',
  server: {
    url: 'https://b66357bd-a4fb-4874-abba-aa926b780afa.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'always',
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
