/// <reference types="vite/client" />

// (Optional) narrow the types you actually use:
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
