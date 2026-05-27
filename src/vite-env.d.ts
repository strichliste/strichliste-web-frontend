/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the strichliste backend API, e.g. `https://demo.strichliste.org/api/`. */
  readonly VITE_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
