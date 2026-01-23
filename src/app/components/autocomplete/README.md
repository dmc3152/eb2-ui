# Autocomplete Component

A small, standalone Angular 21 Autocomplete component built on Angular Material that supports:

- Local options (array of `{ text, value }`) ✅
- Adding new options (emits `added`) ✅
- Hint projection using `<mat-hint>` (preferred) ✅
- Error projection using `<mat-error>` (preferred) ✅
- Validators and mapped error messages ✅
- Remote, paged searching (infinite scroll or "load more") with debounce, retries, and AbortSignal cancellation ✅

---

## Key features

- Standalone, OnPush component using signals and function-based `input()`/`output()` APIs.
- Works with Reactive Forms and supports an optional `selectedControl` to sync selection.
- Remote fetching uses RxJS + `switchMap` for cancellation on rapid typing and provides `loadMore()` and infinite scroll hooks.

---

## Quick usage

Basic local usage (with projected hint):

```html
<app-autocomplete
  [options]="options"
  [allowAdd]="true"
  (added)="saveOption($event)"
>
  <mat-hint>Type a label and press Enter to add</mat-hint>
</app-autocomplete>
```

```ts
options: { text: string; value: string }[] = [ { text: 'Consult', value: 'consult' } ];

saveOption(opt) { /* persist to backend */ }
```

---

## Validators & error mapping

- Use `[validators]` to pass `ValidatorFn[]` (from `@angular/forms`).
- Use `[errorMessages]` to map validator keys to friendly messages.
- Project `<mat-error>` inside `<app-autocomplete>` to override computed messages.

```html
<app-autocomplete
  [validators]="[Validators.required, Validators.minLength(3)]"
  [errorMessages]="{ required: 'Please enter a value', minlength: 'Too short' }"
>
  <mat-hint>At least 3 characters</mat-hint>
</app-autocomplete>
```

---

## Remote search (infinite mode) — recommended

- Provide a `remoteFetcher` input. The function signature optionally accepts an `AbortSignal` as the last argument:

```ts
async function fetchPage(q: string, page: number, pageSize: number, extra?: any, signal?: AbortSignal) {
  const url = `/api/options?q=${encodeURIComponent(q)}&page=${page}&size=${pageSize}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error('fetch failed');
  const data = await res.json();
  return { items: data.items, hasMore: data.hasMore };
}
```

- Usage:

```html
<app-autocomplete
  [remoteFetcher]="fetchPage"
  remoteMode="infinite"
  [pageSize]="20"
  [debounceMs]="250"
  [retryAttempts]="3"
  [retryDelayMs]="200"
  (loading)="onLoading($event)"
  (loadError)="onLoadError($event)"
  (remotePageLoaded)="onPageLoaded($event)"
>
  <mat-hint>Type to search the server (results load as you scroll)</mat-hint>
  <mat-error *ngIf="serverError">{{ serverError }}</mat-error>
</app-autocomplete>
```

Notes:
- The component passes an `AbortSignal` to your `remoteFetcher` (if it accepts one). Use it to cancel `fetch()` calls.
- `retryAttempts` and `retryDelayMs` control exponential backoff retries for transient failures.

---

## Remote search (load-more mode)

- If you prefer a keyboard/explicit action, set `remoteMode="load-more"`. The component shows a selectable `Load more…` option at the bottom of the dropdown which calls `loadMore()`.

---

## Inputs & outputs (short)

- Inputs: `options`, `placeholder`, `allowAdd`, `validators`, `errorMessages`, `selected`, `selectedControl`, `remoteFetcher`, `pageSize`, `debounceMs`, `remoteMode`, `remoteParams`, `retryAttempts`, `retryDelayMs`
- Outputs: `added`, `selectedChange`, `loading`, `loadError`, `remotePageLoaded`

---

## Notes & best practices

- Project hints/errors with `<mat-hint>` and `<mat-error>` to control layout and content.
- Use a cancellable `remoteFetcher` (support `AbortSignal`) to avoid unnecessary network work.
- Increase `retryAttempts`/`retryDelayMs` for flaky networks.
- The component is designed for Angular 21 and uses signals and OnPush change detection.

---

If you'd like, I can add a demo page in the app (mock server) showing infinite vs load-more modes and include an accessibility checklist/sample tests.
