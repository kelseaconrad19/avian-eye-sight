import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.2e8bd201dd454d8e92c1780dade02e54',
  appName: 'avian-eye-sight',
  webDir: 'dist',
  server: {
    url: 'https://2e8bd201-dd45-4d8e-92c1-780dade02e54.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera']
    }
  }
};

export default config;