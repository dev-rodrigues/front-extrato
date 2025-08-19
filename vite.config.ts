import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import constants from "./vite.constants"

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: constants.basepath,
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})
