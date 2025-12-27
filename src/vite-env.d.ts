/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_API_URL: string;
  readonly VITE_WS_URL: string;
  readonly VITE_CONVAI_API_KEY: string;
  readonly VITE_CONVAI_ROBERT_ID: string;
  readonly VITE_CONVAI_LINDA_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
