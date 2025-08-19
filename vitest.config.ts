/// <reference types="vitest" />
import {defineConfig} from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import constants from "./vite.constants";

export default defineConfig({
    plugins: [react()],
    base: constants.basepath,
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        css: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'src/test/',
                '**/*.d.ts',
                '**/*.config.*',
                '**/coverage/**'
            ]
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})
