import { Component, ChangeDetectionStrategy, computed, effect, input, output, signal, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, ValidatorFn } from '@angular/forms';
import { MatFormFieldModule, MatError } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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

  // Output event fired when a new option is added (so caller can persist it)
  readonly added = output<Option>();

  // Local form control and signals for state
  readonly control = new FormControl<string>('');
  readonly internalValue = signal('');
  // mirror FormControl errors into a signal so computed values react to status changes
  readonly controlErrors = signal<Record<string, any> | null>(this.control.errors);
  // detect whether a <mat-error> is projected into the component
  readonly hasProjectedError = signal(false);

  @ContentChild(MatError) set _projectedError(v: MatError | undefined) { this.hasProjectedError.set(!!v); }

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
      const ctrl = this.selectedControl?.();
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
  }

  readonly filteredOptions = computed(() => {
    const v = (this.control.value || '').trim().toLowerCase();
    if (!v) return this.optionsSignal();
    return this.optionsSignal().filter(o => o.text.toLowerCase().includes(v));
  });

  readonly canAdd = computed(() => {
    if (!this.allowAdd()) return false;

    const v = (this.control.value || '').trim();
    if (!v) return false;

    // don't allow adding when the control is invalid according to provided validators
    if (this.controlErrors()) return false;

    const exists = this.optionsSignal().some(o => o.text.toLowerCase() === v.toLowerCase());
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

