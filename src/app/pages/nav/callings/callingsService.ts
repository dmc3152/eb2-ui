import { inject, Injectable } from '@angular/core';
import { CallingByIdGQL, CallingsSearchGQL, CallingsSearchQueryVariables } from '@graphql';
import { onlyCompleteData } from 'apollo-angular';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CallingsService {
  private readonly callingsSearchGql = inject(CallingsSearchGQL);
  private readonly callingByIdGql = inject(CallingByIdGQL);

  searchCallings(variables: CallingsSearchQueryVariables) {
    return this.callingsSearchGql
      .watch({ variables, notifyOnNetworkStatusChange: false })
      .valueChanges
      .pipe(
        onlyCompleteData(),
        map(result => result.data.callings)
      );
  }

  callingById(id: string) {
    return this.callingByIdGql
      .watch({ variables: { callingId: id }, notifyOnNetworkStatusChange: false })
      .valueChanges
      .pipe(
        onlyCompleteData(),
        map(result => result.data.callingById || null)
      );
  }
}
