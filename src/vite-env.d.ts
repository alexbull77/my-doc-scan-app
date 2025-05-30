/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HASURA_GRAPHQL_ENDPOINT: string;
  readonly VITE_HASURA_ADMIN_SECRET: string;
  readonly VITE_PUBLIC_VAPID_KEY: string;
  readonly VITE_PUSH_SERVICE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
