import { inject, Injectable } from '@angular/core';
import { UsersSearchGQL } from '@graphql';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly userSearchGql = inject(UsersSearchGQL);

  async searchUsers() {
    return this.userSearchGql
      .watch()
      .valueChanges
      .pipe(map(result => result.data.users));
  }
}
