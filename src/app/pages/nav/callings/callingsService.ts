import { inject, Injectable } from '@angular/core';
import { CallingsSearchGQL, CallingsSearchQueryVariables } from '@graphql';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CallingsService {
  private readonly callingsSearchGql = inject(CallingsSearchGQL);

  searchCallings(variables: CallingsSearchQueryVariables) {
    return this.callingsSearchGql
      .watch({ ...variables })
      .valueChanges
      .pipe(map(result => result.data.callings));
  }
}
