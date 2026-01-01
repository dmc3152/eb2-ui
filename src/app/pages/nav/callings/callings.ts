import { Component, inject, OnInit, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { OffsetPaging } from '@graphql';
import { firstValueFrom, map, Observable, tap } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { CallingsService } from './callingsService';
import { RouterLink } from '@angular/router';

type UnwrapObservable<T> = T extends Observable<infer U> ? U : T;

@Component({
  selector: 'app-callings',
  imports: [InfiniteScrollDirective, MatListModule, MatCardModule, MatButton, RouterLink],
  templateUrl: './callings.html',
  styleUrl: './callings.scss'
})
export class CallingsPage implements OnInit {
  private readonly _callingsService = inject(CallingsService);

  private callingsPaging = signal<OffsetPaging>({
    limit: Math.ceil(window.innerHeight / 64 + 5),
    offset: 0
  });
  public hasMorePages = signal<Boolean>(true);
  private searchSubscription = (paging: OffsetPaging) => this._callingsService.searchCallings({ input: { paging } }).pipe(
    tap(result => this.hasMorePages.set(result?.pageInfo.hasNextPage ?? false)),
    map(result => result?.edges.map(x => ({ ...x.node, assignedTo: x.node.assignedTo.map(y => `${y.firstName} ${y.lastName}`).join() }))),
  );
  callingSearchSignal = signal<UnwrapObservable<ReturnType<typeof this.searchSubscription>>>([]);

  ngOnInit() {
    this.searchSubscription(this.callingsPaging()).subscribe(result => this.callingSearchSignal.set(result));
  }

  async onScroll() {
    if (!this.hasMorePages()) return;

    this.callingsPaging.update(value => {
      const oldLimit = value.limit || 20;
      const oldOffset = value.offset || 0;
      return {
        limit: oldLimit,
        offset: oldOffset + oldLimit
      }
    });

    const nextPage = await firstValueFrom(this.searchSubscription(this.callingsPaging()));
    this.callingSearchSignal.update(value => {
      const previousValue = value || [];
      const nextValue = nextPage || [];
      return [...previousValue, ...nextValue];
    });
  }
}
