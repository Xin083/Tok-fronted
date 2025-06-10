declare module '@dcloudio/vite-plugin-uni' {
  import type { Plugin } from 'vite'
  export default function uni(options?: {
    vueOptions?: {
      compilerOptions?: {
        isCustomElement?: (tag: string) => boolean
      }
    }
  }): Plugin
} 