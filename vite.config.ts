import { fileURLToPath, URL } from 'node:url';
import { resolve } from 'path';
import { defineConfig } from 'vite';


// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [

  ],
  server: {
    port: 5784,
    cors: {
      "origin": "*",
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": false,
      "optionsSuccessStatus": 204
    }
  },
    build: {
    outDir: './dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        Paint: resolve(__dirname, 'Paint.html'),
        Credits: resolve(__dirname, 'Credits.html'),
        About: resolve(__dirname, 'About.html'),
        FractileGenerator: resolve(__dirname, 'FractileGenerator.html'),
        ZXY: resolve(__dirname, 'ZXY.html'),
        


      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url))
    }
  }
})
