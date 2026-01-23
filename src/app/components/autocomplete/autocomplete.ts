import { Component, ChangeDetectionStrategy, computed, effect, input, output, signal, ContentChild } from '@angular/core';
import { from, of, Observable, Subscriber } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, ValidatorFn } from '@angular/forms';
import { MatFormFieldModule, MatError } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { toSignal } from '@angular/core/rxjs-interop';

// Option type used by the component
export type Option = { text: string; value: string };

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.html',
  styleUrls: ['./autocomplete.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Autocomplete {
  // Inputs using the recommended function-based API
  readonly options = input<Option[] | undefined>();
  readonly placeholder = input<string | undefined>();
  readonly allowAdd = input<boolean | undefined>();

  // hint/error and validation support
  readonly errorMessages = input<Record<string,string> | undefined>();
  readonly validators = input<ValidatorFn[] | undefined>();

  // Selected value integration (single select)
  readonly selected = input<Option | undefined>();
  readonly selectedControl = input<FormControl<Option | null> | undefined>();
  readonly selectedChange = output<Option | null>();

  // Remote paging inputs (optional)
  // Note: remoteFetcher can optionally accept an AbortSignal as the last argument for cancellation
  readonly remoteFetcher = input<((q: string, page: number, pageSize: number, extra?: Record<string, unknown>, signal?: AbortSignal) => Promise<{ items: Option[]; hasMore: boolean }>) | undefined>();
  readonly pageSize = input<number | undefined>();
  readonly debounceMs = input<number | undefined>();
  readonly remoteMode = input<'load-more' | 'infinite' | undefined>();
  readonly remoteParams = input<Record<string, unknown> | undefined>();
  // retry behavior
  readonly retryAttempts = input<number | undefined>();
  readonly retryDelayMs = input<number | undefined>();

  // Remote outputs
  readonly loading = output<boolean>();
  readonly loadError = output<string | null>();
  readonly remotePageLoaded = output<{ page: number; items: Option[] }>();
  // Output event fired when a new option is added (so caller can persist it)
  readonly added = output<Option>();

  // Local form control and signals for state
  readonly control = new FormControl<string>('');
  readonly controlValue = toSignal(this.control.valueChanges);
  readonly internalValue = signal('');
  // mirror FormControl errors into a signal so computed values react to status changes
  readonly controlErrors = signal<Record<string, any> | null>(this.control.errors);
  // detect whether a <mat-error> is projected into the component
  readonly hasProjectedError = signal(false);

  @ContentChild(MatError) set _projectedError(v: MatError | undefined) { this.hasProjectedError.set(!!v); }

  // remote state
  readonly remoteOptions = signal<Option[]>([]);
  readonly remoteHasMore = signal(false);
  readonly remotePage = signal(0);
  readonly isRemoteLoading = signal(false);

  // panel scroll handler token
  private _panelScrollRemover: { panel: Element; handler: EventListener } | null = null;
  private readonly optionsSignal = computed(() => this.options() ?? []);

  constructor() {
    // sync when parent passes a `selected` input value
    effect(() => {
      const s = this.selected();
      if (s) {
        this.control.setValue(s.text);
        const ctrl = this.selectedControl();
        if (ctrl) ctrl.setValue(s);
      }
    });

    // subscribe to external form control if one is provided (cleanup handled by effect)
    effect((onCleanup) => {
      const ctrl = this.selectedControl();
      if (!ctrl) return;
      const sub = ctrl.valueChanges.subscribe(v => {
        if (v) this.control.setValue(v.text);
        else this.control.setValue('');
        this.selectedChange.emit(v ?? null);
      });
      const initial = ctrl.value;
      if (initial) this.control.setValue(initial.text);
      onCleanup(() => sub.unsubscribe());
    });

    // apply validators to the input control whenever the `validators` input changes
    effect(() => {
      const v = this.validators();
      this.control.setValidators(v ?? []);
      this.control.updateValueAndValidity();
    });

    // update controlErrors signal whenever the control status changes (validity/errors)
    effect((onCleanup) => {
      const sub = this.control.statusChanges.subscribe(() => {
        this.controlErrors.set(this.control.errors);
      });
      onCleanup(() => sub.unsubscribe());
    });

    // remote search flow using RxJS + switchMap; set up whenever the `remoteFetcher` input is present
    effect((onCleanup) => {
      const fetcher = this.remoteFetcher?.();
      if (!fetcher) return;

      const sub = (this.control.valueChanges as any).pipe(
        debounceTime(this.debounceMs() ?? 300),
        distinctUntilChanged(),
        tap(() => {
          this.isRemoteLoading.set(true);
          this.loading.emit(true);
          this.loadError.emit(null);
          this.remoteOptions.set([]);
          this.remotePage.set(0);
          this.remoteHasMore.set(false);
        }),
        switchMap((q: string) => new Observable<{ items: Option[]; hasMore: boolean }>((subscriber) => {
          const ac = new AbortController();
          // call attemptFetch with the controller's signal, and pipe the promise into the observable
          this.attemptFetch(fetcher, q ?? '', 1, this.pageSize() ?? 25, this.remoteParams() ?? {}, ac.signal)
            .then((res: { items: Option[]; hasMore: boolean }) => {
              if (!ac.signal.aborted) {
                subscriber.next(res);
                subscriber.complete();
              }
            })
            .catch((err: any) => {
              if (ac.signal.aborted) {
                // If aborted, just complete without error so upstream switchMap quietly cancels
                subscriber.complete();
              } else {
                subscriber.error(err);
              }
            });

          // teardown: abort the controller when unsubscribed
          return () => ac.abort();
        }).pipe(
          tap((res) => {
            this.remoteOptions.set(res.items);
            this.remoteHasMore.set(res.hasMore);
            this.remotePage.set(1);
            this.remotePageLoaded.emit({ page: 1, items: res.items });
            this.isRemoteLoading.set(false);
            this.loading.emit(false);
          }),
          catchError((err) => {
            // if abort, swallow; otherwise report
            if ((err && (err as any).name) === 'AbortError' || (err && (err as any).message === 'Aborted')) {
              this.isRemoteLoading.set(false);
              this.loading.emit(false);
              return of({ items: [], hasMore: false });
            }
            this.loadError.emit(err?.message ?? 'Remote load failed');
            this.isRemoteLoading.set(false);
            this.loading.emit(false);
            return of({ items: [], hasMore: false });
          })
        ))
      ).subscribe();

      onCleanup(() => sub.unsubscribe());
    });
  }

  readonly filteredOptions = computed(() => {
    const v = (this.controlValue() || '').trim().toLowerCase();
    const merged = [...this.optionsSignal(), ...this.remoteOptions()];
    if (!v) return merged;
    return merged.filter(o => o.text.toLowerCase().includes(v));
  });

  readonly canAdd = computed(() => {
    if (!this.allowAdd()) return false;

    const v = (this.control.value || '').trim();
    if (!v) return false;

    // don't allow adding when the control is invalid according to provided validators
    if (this.controlErrors()) return false;

    const exists = this.optionsSignal().some(o => o.text.toLowerCase() === v.toLowerCase()) || this.remoteOptions().some(o => o.text.toLowerCase() === v.toLowerCase());
    return !exists;
  });

  /** Returns the active error message to display */
  readonly errorMessage = computed((): string | null => {
    const e = this.controlErrors();
    if (!e) return null;
    const keys = Object.keys(e);
    const mapping = this.errorMessages() ?? {};
    for (const k of keys) {
      if (mapping[k]) return mapping[k];
      if (k === 'required') return 'This field is required';
      if (k === 'minlength') return `Minimum length ${(e as any)[k]?.requiredLength ?? ''}`;
      if (k === 'pattern') return 'Invalid format';
    }
    return 'Invalid value';
  });

  /** Generate a simple slug value based on the display text */
  private generateValue(text: string) {
    return text.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '');
  }

  // display helper for mat-autocomplete (safe for nulls and mixed values)
  readonly displayOption = (v: Option | string | null) => {
    if (!v) return '';
    return typeof v === 'string' ? v : v.text;
  }

  private setSelected(opt: Option | null) {
    // emit and write to external form control if present
    this.selectedChange.emit(opt);
    const ctrl = this.selectedControl();
    if (ctrl) ctrl.setValue(opt);
  }

  selectOption(event: MatAutocompleteSelectedEvent) {
    const value = event.option?.value as Option | undefined;
    if (value) {
      this.control.setValue(value.text);
      this.setSelected(value);
    }
  }

  async loadMore() {
    if (this.isRemoteLoading()) return;
    const fetcher = this.remoteFetcher?.();
    if (!fetcher) return;
    const next = (this.remotePage() || 0) + 1;
    this.isRemoteLoading.set(true);
    this.loading.emit(true);
    const ac = new AbortController();
    try {
      const res = await this.attemptFetch(fetcher, this.control.value ?? '', next, this.pageSize() ?? 25, this.remoteParams() ?? {}, ac.signal);
      this.remoteOptions.set([...this.remoteOptions(), ...res.items]);
      this.remoteHasMore.set(res.hasMore);
      this.remotePage.set(next);
      this.remotePageLoaded.emit({ page: next, items: res.items });
    } catch (err: any) {
      if ((err && (err as any).name) === 'AbortError' || err?.message === 'Aborted') {
        // aborted: silently ignore
        return;
      }
      this.loadError.emit(err?.message ?? 'Remote load failed');
    } finally {
      this.isRemoteLoading.set(false);
      this.loading.emit(false);
    }
  }

  onPanelOpened() {
    if (this.remoteMode() !== 'infinite') return;
    // attach a scroll listener to the autocomplete panel
    setTimeout(() => {
      const panel = document.querySelector('.mat-autocomplete-panel');
      if (!panel) return;
      const handler = () => {
        try {
          if (panel.scrollHeight - panel.scrollTop - panel.clientHeight < 100) {
            if (this.remoteHasMore() && !this.isRemoteLoading()) this.loadMore();
          }
        } catch (_) {}
      };
      panel.addEventListener('scroll', handler);
      this._panelScrollRemover = { panel, handler } as any;
    }, 0);
  }

  onPanelClosed() {
    if (!this._panelScrollRemover) return;
    try {
      this._panelScrollRemover.panel.removeEventListener('scroll', this._panelScrollRemover.handler);
    } catch (_) {}
    this._panelScrollRemover = null;
  }

  private async attemptFetch(fetcher: (q: string, page: number, pageSize: number, extra?: Record<string, unknown>, signal?: AbortSignal) => Promise<{ items: Option[]; hasMore: boolean }>, q: string, page: number, pageSize: number, extra: Record<string, unknown>, signal?: AbortSignal) {
    const attempts = this.retryAttempts() ?? 2;
    const baseDelay = this.retryDelayMs() ?? 200;
    let lastErr: any = null;
    for (let i = 0; i < attempts; i++) {
      // bail early if aborted
      if (signal?.aborted) {
        const err: any = new Error('Aborted');
        err.name = 'AbortError';
        throw err;
      }
      try {
        return await fetcher(q, page, pageSize, extra, signal);
      } catch (err: any) {
        // if the fetcher signalled abort propagate as AbortError
        if ((err && (err as any).name) === 'AbortError' || err?.message === 'Aborted') throw err;
        lastErr = err;
        if (i < attempts - 1) {
          const wait = baseDelay * Math.pow(2, i); // exponential backoff
          await new Promise((r) => setTimeout(r, wait));
        }
      }
    }
    throw lastErr;
  }

  tryAdd() {
    const v = (this.control.value || '').trim();
    if (!v || !this.canAdd()) return;

    const newOption: Option = { text: v, value: this.generateValue(v) };
    this.added.emit(newOption);
    // set as selected for convenience and update external control
    this.setSelected(newOption);
    // clear input after adding to keep UX simple
    this.control.setValue('');
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.tryAdd();
    }
  }
}

