/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VISITS_API?: string
  readonly VITE_NOW_PLAYING_API?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
