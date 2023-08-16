/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_OFFLINE_MODE: string|undefined
    readonly VITE_API_KEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
