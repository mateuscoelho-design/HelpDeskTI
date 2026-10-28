import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

//Configuração do Vite
export default defineConfig({
    plugins: [react()],

    //Comunicação com a API do HelpDeskTI
    server: {
        proxy: {
            '/users': {
                target: 'http://localhost:3030',
                changeOrigin: true
            },
            '/demandas': {
                target: 'http://localhost:3030',
                changeOrigin: true
            }
        }
    }
})