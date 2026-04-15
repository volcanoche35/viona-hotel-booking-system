/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_ADMIN_USER: string
    readonly VITE_ADMIN_PASS: string
    readonly VITE_EMAILJS_SERVICE_ID: string
    readonly VITE_EMAILJS_TEMPLATE_ID: string
    readonly VITE_EMAILJS_PUBLIC_KEY: string
    readonly VITE_WHATSAPP_NUMBER: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
