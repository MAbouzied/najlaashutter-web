/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_STAGING?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
