interface ImportMetaEnv {
  readonly PUBLIC_POLAR_CHECKOUT_PERSONAL?: string;
  readonly PUBLIC_POLAR_CHECKOUT_PRO?: string;
  readonly PUBLIC_EARLY_BIRD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
