import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'



// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
        vue: 'vue/dist/vue.esm-bundler.js'
    }
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ['iconify-icon'].includes(tag),
        }
      }
    }),
    Components({
      dts: true,
      resolvers: [
        IconsResolver(),
      ],
    }),
    AutoImport({ 
      dts: true,
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/, /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      imports: [
        // presets
        'vue',
        'vue-router',
        {
          '@vueuse/core': ['useTimestamp', 'useDateFormat']
        }
      ]
     }),
     Icons({
      // experimental
      autoInstall: true,
      compiler: 'vue3'
    })
  ],
})
