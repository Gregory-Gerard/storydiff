import { ApolloClient, ApolloLink, concat, HttpLink, InMemoryCache } from '@apollo/client';
import invariant from 'ts-invariant';

invariant(process.env.NEXT_PUBLIC_CHROMATIC_GRAPHQL);

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_CHROMATIC_GRAPHQL,
});

export function getClient(token?: string | undefined) {
  const withAuthorizationToken = new ApolloLink((operation, forward) => {
    if (token) {
      operation.setContext({
        ...operation.getContext(),
        headers: {
          ...operation.getContext().headers,
          authorization: `Bearer ${token}`,
        },
      });
    }

    return forward(operation).map((response) => {
      const context = operation.getContext();
      const authHeader: string | undefined = context.response.headers.get('Authorization');

      if (authHeader) {
        return {
          ...response,
          data: {
            ...response.data,
            authorization: authHeader.replace('Bearer ', ''),
          },
        };
      }

      return response;
    });
  });

  return new ApolloClient({
    link: concat(withAuthorizationToken, httpLink),
    cache: new InMemoryCache(),
  });
}
