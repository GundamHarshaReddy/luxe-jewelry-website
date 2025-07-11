/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CASHFREE_APP_ID: string
  readonly VITE_CASHFREE_SECRET_KEY: string
  readonly VITE_CASHFREE_ENVIRONMENT: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_SUPABASE_SERVICE_ROLE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
