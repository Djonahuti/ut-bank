import { nhost } from '@/nhost';
import { GraphQLClient } from 'graphql-request';

const NHOST_SUBDOMAIN = import.meta.env.VITE_NHOST_SUBDOMAIN!;
const NHOST_REGION = import.meta.env.VITE_NHOST_REGION!;

const graphqlUrl = `https://${NHOST_SUBDOMAIN}.graphql.${NHOST_REGION}.nhost.run/v1`;

export const gqlClient = new GraphQLClient(graphqlUrl, {
  headers: () => ({
    Authorization: `Bearer ${nhost.getSession()?.accessToken}`,
  }),
});