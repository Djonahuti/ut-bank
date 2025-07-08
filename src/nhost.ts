import { createAuthClient } from '@nhost/nhost-js';

export const nhost = createAuthClient({
  subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN!,
  region: import.meta.env.VITE_NHOST_REGION!,
});
