import { inject, Injectable } from '@angular/core';
import { UsersSearchGQL } from '@graphql';
import { onlyCompleteData } from 'apollo-angular';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly userSearchGql = inject(UsersSearchGQL);

  async searchUsers() {
    return this.userSearchGql
      .watch({
        notifyOnNetworkStatusChange: false
      })
      .valueChanges
      .pipe(
        onlyCompleteData(),
        map(result => result.data.users)
      );
  }
}
