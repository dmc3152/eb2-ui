import { inject, Injectable } from '@angular/core';
import { CallingsSearchGQL, CallingsSearchQueryVariables } from '@graphql';
import { onlyCompleteData } from 'apollo-angular';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CallingsService {
  private readonly callingsSearchGql = inject(CallingsSearchGQL);

  searchCallings(variables: CallingsSearchQueryVariables) {
    return this.callingsSearchGql
      .watch({ variables, notifyOnNetworkStatusChange: false })
      .valueChanges
      .pipe(
        onlyCompleteData(),
        map(result => result.data.callings)
      );
  }
}
