import { Component, inject, OnInit, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { OffsetPaging, UsersSearchGQL } from '@graphql';
import { firstValueFrom, map, Observable, tap } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';

type UnwrapObservable<T> = T extends Observable<infer U> ? U : T;

@Component({
  selector: 'app-users',
  imports: [InfiniteScrollDirective, MatListModule, MatCardModule, MatButton],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class UsersPage implements OnInit {
  private readonly userSearch = inject(UsersSearchGQL);

  private userPaging = signal<OffsetPaging>({
    limit: Math.ceil(window.innerHeight / 64 + 5),
    offset: 0
  });
  public hasMorePages = signal<Boolean>(true);
  private searchSubscription = (paging: OffsetPaging) => this.userSearch.fetch({ input: { paging } }).pipe(
    tap(result => this.hasMorePages.set(result.data.users?.pageInfo.hasNextPage ?? false)),
    map(result => result.data.users?.edges.map(x => ({ node: { ...x.node, callings: x.node.callings.map(y => y.name).join() } }))),
  );
  userSearchSignal = signal<UnwrapObservable<ReturnType<typeof this.searchSubscription>>>([]);

  ngOnInit() {
    this.searchSubscription(this.userPaging()).subscribe(result => this.userSearchSignal.set(result));
  }

  async onScroll() {
    if (!this.hasMorePages()) return;

    this.userPaging.update(value => {
      const oldLimit = value.limit || 20;
      const oldOffset = value.offset || 0;
      return {
        limit: oldLimit,
        offset: oldOffset + oldLimit
      }
    });

    const nextPage = await firstValueFrom(this.searchSubscription(this.userPaging()));
    this.userSearchSignal.update(value => {
      const previousValue = value || [];
      const nextValue = nextPage || [];
      return [...previousValue, ...nextValue];
    });
  }
}
