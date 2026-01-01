import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, inject, provideAppInitializer, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloClient, ApolloLink, InMemoryCache, Observable } from '@apollo/client/core';
import { createClient, ClientOptions, Client, ExecutionResult } from 'graphql-sse';
import { Kind, OperationTypeNode, print } from 'graphql';
import { environment } from '../environments/environment';
import { AuthService } from './core/auth';
import { Utilities } from './core/utilities';
import { provideServiceWorker } from '@angular/service-worker';
import { getMainDefinition } from '@apollo/client/utilities';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

declare global {
  interface Window {
    __APOLLO_CLIENT__: ApolloClient;
  }
}

class SSELink extends ApolloLink {
  private client: Client;

  constructor(options: ClientOptions) {
    super();
    this.client = createClient(options);
  }

  public override request(operation: ApolloLink.Operation): Observable<ExecutionResult> {
    return new Observable((sink) => {
      return this.client.subscribe<ExecutionResult>(
        { ...operation, query: print(operation.query) },
        {
          next: sink.next.bind(sink),
          complete: sink.complete.bind(sink),
          error: sink.error.bind(sink),
        },
      );
    });
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), provideHttpClient(), provideApollo(() => {
      const httpLink = inject(HttpLink);

      const http = httpLink.create({
        uri: environment.apiUrl,
        withCredentials: true,
      });

      const sse = new SSELink({
        url: environment.apiUrl,
        credentials: 'include',
      });

      const link = ApolloLink.split(
        // Split based on operation type
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === Kind.OPERATION_DEFINITION &&
            definition.operation === OperationTypeNode.SUBSCRIPTION
          );
        },
        sse,
        http,
      );

      const client: ApolloClient.Options = {
        link,
        cache: new InMemoryCache(),
        // other options...
      };

      return client;
    }),
    provideAppInitializer(async () => {
      const auth = inject(AuthService);
      await Utilities.safeAsync(auth.self());
    }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    provideCharts(withDefaultRegisterables()),
  ]
};
