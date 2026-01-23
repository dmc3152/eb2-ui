import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { vi } from 'vitest';

import { Autocomplete } from './autocomplete';

describe('Autocomplete', () => {
  let component: Autocomplete;
  let fixture: ComponentFixture<Autocomplete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Autocomplete],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Autocomplete);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filters options by text', () => {
    const ops = [
      { text: 'Consultation', value: 'consultation' },
      { text: 'Checkup', value: 'checkup' },
    ];
    fixture.componentRef.setInput('options', ops);
    component.control.setValue('con');
    const filtered = component.filteredOptions();
    expect(filtered.length).toBe(1);
    expect(filtered[0].text).toBe('Consultation');
  });

  it('canAdd returns true when allowed and unique', () => {
    fixture.componentRef.setInput('allowAdd', true);
    fixture.componentRef.setInput('options', [{ text: 'A', value: 'a' }]);
    component.control.setValue('Unique Option');
    expect(component.canAdd()).toBe(true);
  });

  it('tryAdd emits added and clears input and selects option', () => {
    const addedSpy = vi.spyOn(component.added, 'emit');
    const selSpy = vi.spyOn(component.selectedChange, 'emit');
    fixture.componentRef.setInput('allowAdd', true);
    component.control.setValue('NewOption');

    component.tryAdd();

    expect(addedSpy).toHaveBeenCalledTimes(1);
    const emitted = (addedSpy as any).mock.calls[0][0];
    expect(emitted.text).toBe('NewOption');
    expect(emitted.value).toBe('newoption');
    expect(component.control.value).toBe('');
    expect(selSpy).toHaveBeenCalledWith(emitted);
  });

  it('selectOption selects provided option and updates control', () => {
    const setSpy = vi.spyOn(component as any, 'setSelected');
    const opt = { text: 'One', value: 'one' };
    component.selectOption({ option: { value: opt } } as any);
    expect(component.control.value).toBe('One');
    expect(setSpy).toHaveBeenCalledWith(opt);
  });

  it('subscribes to external FormControl value changes', async () => {
    const ctrl = new FormControl<{text:string,value:string} | null>(null);
    const selSpy = vi.spyOn(component.selectedChange, 'emit');
    fixture.componentRef.setInput('selectedControl', ctrl as any);
    // initial set via effect runs synchronously; wait for stability to be safe
    await fixture.whenStable();

    const opt = { text: 'X', value: 'x' };
    ctrl.setValue(opt);
    // allow effects to run and TestBed to stabilize after value change
    await fixture.whenStable();
    expect(component.control.value).toBe('X');
    expect(selSpy).toHaveBeenCalledWith(opt);
  });

  it('uses projected hint when provided', async () => {
    // Host component to project a <mat-hint>
    const { Component } = await import('@angular/core');
    @Component({
      template: `<app-autocomplete><mat-hint>Projected Hint</mat-hint></app-autocomplete>`,
      standalone: true,
      imports: [Autocomplete],
    })
    class HostComp {}

    await TestBed.configureTestingModule({ imports: [HostComp] }).compileComponents();
    const hostFixture = TestBed.createComponent(HostComp);
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    const hintEl = hostFixture.nativeElement.querySelector('mat-hint');
    expect(hintEl).toBeTruthy();
    expect(hintEl.textContent.trim()).toBe('Projected Hint');
  });

  it('prefers projected mat-error when provided', async () => {
    const { Component } = await import('@angular/core');
    @Component({
      template: `<app-autocomplete [validators]="[v]"><mat-error>Projected Error</mat-error></app-autocomplete>`,
      standalone: true,
      imports: [Autocomplete],
    })
    class HostComp { v = Validators.required; }

    await TestBed.configureTestingModule({ imports: [HostComp] }).compileComponents();
    const hostFixture = TestBed.createComponent(HostComp);
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    const errEl = hostFixture.nativeElement.querySelector('mat-error');
    expect(errEl).toBeTruthy();
    expect(errEl.textContent.trim()).toBe('Projected Error');
  });

  it('performs remote search and loads more (infinite) via programmatic loadMore', async () => {
    const fetcher = vi.fn().mockImplementation(async (q: string, page: number) => {
      return { items: [{ text: `Item ${page}`, value: `item-${page}` }], hasMore: page < 2 };
    });

    fixture.componentRef.setInput('remoteFetcher', fetcher as any);
    fixture.componentRef.setInput('remoteMode', 'infinite');
    fixture.componentRef.setInput('pageSize', 1);
    fixture.componentRef.setInput('debounceMs', 50);
    fixture.detectChanges();
    await fixture.whenStable();

    component.control.setValue('x');
    // allow debounceTime to elapse
    await new Promise((r) => setTimeout(r, 80));
    await fixture.whenStable();

    expect(fetcher).toHaveBeenCalled();
    expect(component.remoteOptions().length).toBe(1);

    // load more
    await component.loadMore();
    await fixture.whenStable();

    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(component.remoteOptions().length).toBe(2);
  });

  it('retries failed initial remote fetch and succeeds on retry', async () => {
    let calls = 0;
    const fetcher = vi.fn().mockImplementation(async (q: string, page: number) => {
      calls++;
      if (calls === 1) throw new Error('network');
      return { items: [{ text: 'RetryItem', value: 'retry-1' }], hasMore: false };
    });

    fixture.componentRef.setInput('remoteFetcher', fetcher as any);
    fixture.componentRef.setInput('remoteMode', 'infinite');
    fixture.componentRef.setInput('pageSize', 1);
    fixture.componentRef.setInput('debounceMs', 50);
    fixture.componentRef.setInput('retryAttempts', 2);
    fixture.componentRef.setInput('retryDelayMs', 10);
    fixture.detectChanges();
    await fixture.whenStable();

    component.control.setValue('y');
    // allow debounce and retryDelay to elapse
    await new Promise((r) => setTimeout(r, 200));
    await fixture.whenStable();

    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(component.remoteOptions().length).toBe(1);
  });

  it('retries failed loadMore and succeeds on retry', async () => {
    let calls = 0;
    const fetcher = vi.fn().mockImplementation(async (q: string, page: number, pageSize?: number, extra?: any, signal?: AbortSignal) => {
      calls++;
      // fail the first attempt of page 2
      if (page === 2 && calls <= 2) throw new Error('load');
      return { items: [{ text: `LoadItem ${page}`, value: `li-${page}` }], hasMore: page < 3 };
    });

    fixture.componentRef.setInput('remoteFetcher', fetcher as any);
    fixture.componentRef.setInput('remoteMode', 'infinite');
    fixture.componentRef.setInput('pageSize', 1);
    fixture.componentRef.setInput('debounceMs', 50);
    fixture.componentRef.setInput('retryAttempts', 2);
    fixture.componentRef.setInput('retryDelayMs', 10);
    fixture.detectChanges();
    await fixture.whenStable();

    // initial search
    component.control.setValue('z');
    await new Promise((r) => setTimeout(r, 80));
    await fixture.whenStable();
    expect(component.remoteOptions().length).toBe(1);

    // load more: page 2 will fail once then succeed on retry
    await component.loadMore();
    // wait for retry to complete
    await new Promise((r) => setTimeout(r, 200));
    await fixture.whenStable();

    expect(fetcher).toHaveBeenCalled();
    expect(component.remoteOptions().length).toBe(2);
  });

  it('aborts previous fetch when query changes', async () => {
    const captured: AbortSignal[] = [];
    const fetcher = vi.fn().mockImplementation(async (q: string, page: number, pageSize?: number, extra?: any, signal?: AbortSignal) => {
      captured.push(signal as AbortSignal);
      // simulate a fetch that takes some time
      await new Promise((r) => setTimeout(r, 100));
      if (signal?.aborted) {
        const err: any = new Error('Aborted');
        err.name = 'AbortError';
        throw err;
      }
      return { items: [{ text: `Item ${page}`, value: `item-${page}` }], hasMore: false };
    });

    fixture.componentRef.setInput('remoteFetcher', fetcher as any);
    fixture.componentRef.setInput('debounceMs', 10);
    fixture.detectChanges();
    await fixture.whenStable();

    component.control.setValue('first');
    // allow first request to start
    await new Promise((r) => setTimeout(r, 20));
    component.control.setValue('second');
    // allow debounce and for second request to complete
    await new Promise((r) => setTimeout(r, 200));
    await fixture.whenStable();

    expect(captured.length).toBeGreaterThanOrEqual(2);
    expect(captured[0].aborted).toBe(true);
  });

  it('applies validators and shows mapped error messages; prevents add while invalid', async () => {
    const map = { required: 'Please enter a value', minlength: 'Too short' } as Record<string,string>;
    fixture.componentRef.setInput('validators', [Validators.required, Validators.minLength(3)]);
    fixture.componentRef.setInput('errorMessages', map);
    fixture.componentRef.setInput('allowAdd', true);
    // ensure validators applied
    await fixture.whenStable();

    // empty value -> required
    component.control.setValue('');
    await fixture.whenStable();
    expect(component.canAdd()).toBe(false);
    expect(component.errorMessage()).toBe('Please enter a value');

    // short value -> minlength
    component.control.setValue('ab');
    await fixture.whenStable();
    expect(component.canAdd()).toBe(false);
    expect(component.errorMessage()).toBe('Too short');
    fixture.detectChanges();
    const errEl = fixture.nativeElement.querySelector('mat-error');
    expect(errEl).toBeTruthy();
    expect(errEl.textContent.trim()).toBe('Too short');

    // valid value -> can add
    component.control.setValue('abcd');
    await fixture.whenStable();
    expect(component.canAdd()).toBe(true);
  });
});
