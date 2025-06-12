import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.leixin.xtok', // 这里填你自己的唯一包名
  appName: 'Tikshop', // 这里填你的应用名称
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'http',
    cleartext: true
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#ffffff',
    preferredContentMode: 'mobile'
  }
}

export default config
