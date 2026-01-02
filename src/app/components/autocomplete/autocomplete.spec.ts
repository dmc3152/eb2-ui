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
