import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { resolve } from 'path';
import mkcert from 'vite-plugin-mkcert'
import crossOriginIsolation from 'vite-plugin-cross-origin-isolation'
import postcssImport from 'postcss-import';


// https://vitejs.dev/config/
export default defineConfig({
  //base: '/odascourses/',
  server:{
    https: true
  },
  optimizeDeps: {
    exclude: ['vue-demi']
  },
  resolve: {
    alias: {
        vue: 'vue/dist/vue.esm-bundler.js'
    }
  },
  plugins: [
    postcssImport(),
    mkcert(),
    crossOriginIsolation(),
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
        },
        {
          'howler': ['Howl', 'Howler']
        },
        {
          'lodash': ['_']
        },
        {
          'deepdash': ['deepdash-es']
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
