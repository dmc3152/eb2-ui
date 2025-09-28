import { Component, computed, inject, resource, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AllAppointmentTypesGQL, AppointmentCode, AvailabilityBlocksGQL, BishopricMember, CreateAppointmentGQL } from '../../../graphql/generated';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom, map, of, tap } from 'rxjs';
import { DatePipe, KeyValuePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { DateTime } from 'luxon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface AvailabilityBlockDisplay {
  start: string;
  end: string;
  timeSlots: {
    bishopricMember: string;
    start: string;
    end: string;
  }[];
}

@Component({
  selector: 'app-interviews',
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    DatePipe,
    MatListModule,
    KeyValuePipe,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  templateUrl: './interviews.html',
  styleUrl: './interviews.scss'
})
export class InterviewsPage {
  private allAppointmentTypesGQL = inject(AllAppointmentTypesGQL);
  private availabilityBlocksGQL = inject(AvailabilityBlocksGQL);
  private createAppointmentGQL = inject(CreateAppointmentGQL);
  private _snackBar = inject(MatSnackBar);
  private sortStringFactory = <T extends object>(field: keyof T): (a: T, b: T) => number => (a, b) => (a[field] as string || '').localeCompare(b[field] as string || '', undefined, { sensitivity: 'base', numeric: true })
  interviewForm = new FormGroup({
    name: new FormControl('', Validators.required),
    interviewType: new FormControl<AppointmentCode | null>(null, Validators.required),
    description: new FormControl(''),
  });
  timeSlotFormControl = new FormControl<[{ bishopricMember: string; start: string; end: string; }]>([] as any, Validators.required);
  interviewType = toSignal(this.interviewForm.controls.interviewType.valueChanges.pipe(tap(x => this.timeSlotFormControl.reset())), { initialValue: this.interviewForm.controls.interviewType.value });
  showDescriptionBox = computed(() => {
    const type = this.interviewType();
    if (!type) return false;
    const appointmentCodes: AppointmentCode[] = [AppointmentCode.PersonalMatterShort, AppointmentCode.PersonalMatterLong, AppointmentCode.Other];
    return appointmentCodes.includes(type);
  });
  isSubmitting = signal(false);
  interviewOptions = toSignal(this.allAppointmentTypesGQL.fetch().pipe(
    map(response => Array.from(response.data.allAppointmentTypes).sort(this.sortStringFactory("name")))
  ), { initialValue: [] });
  selectedAppointmentType = computed(() => this.interviewOptions().find(option => option.code === this.interviewType()));

  // private availabilityBlockApiCall = this.availabilityBlocksGQL.watch({ durationInMinutes: duration }).valueChanges;

  // getAvailabilityBlocks = (interviewType: string | null) => {
  //   if (!interviewType) return Promise.resolve(undefined);
  //   const duration = this.interviewOptions().find(option => option.code === interviewType)?.durationInMinutes;
  //   if (!duration) return Promise.resolve(undefined);
  //   return this.availabilityBlocksGQL.fetch({ durationInMinutes: duration });
  // }
  
  availabilityResource = rxResource({
    params: () => ({ duration: this.selectedAppointmentType()?.durationInMinutes }),
    stream: ({ params }) => !params.duration ? of(undefined) : this.availabilityBlocksGQL.watch({ durationInMinutes: params.duration }, { fetchPolicy: 'cache-and-network' }).valueChanges,
  });

  private bishopricMemberMap = {
    [BishopricMember.Bishop]: 'Bishop',
    [BishopricMember.FirstCounselor]: 'Bro Naidu',
    [BishopricMember.SecondCounselor]: 'Bro Komatsu',
  }

  availabilityBlocks = computed(() => {
    const availabilityMap = new Map<string, AvailabilityBlockDisplay>();
    if (!this.availabilityResource.hasValue() || !this.selectedAppointmentType()) return availabilityMap;

    const availabilities = this.availabilityResource.value().data.allAvailabilityBlocks.reduce((acc, block) => {
      if (!block.bishopricMember || !block.availableSlot?.start || !block.availableSlot.end) return acc;
      const isValidBishopricMember = this.selectedAppointmentType()!.interviewers.includes(block.bishopricMember);
      if (!isValidBishopricMember) return acc;

      const blockKey = DateTime.fromISO(block.start).toFormat('EEEE, MMMM d');
      const existingBlock = acc.get(blockKey);
      if (!existingBlock) {
        acc.set(blockKey, {
          start: block.start,
          end: block.end,
          timeSlots: [{
            bishopricMember: this.bishopricMemberMap[block.bishopricMember],
            start: block.availableSlot.start,
            end: block.availableSlot.end
          }]
        });
      }
      else {
        const existingStart = DateTime.fromISO(existingBlock.start);
        const existingEnd = DateTime.fromISO(existingBlock.end);
        const newStart = DateTime.fromISO(block.start);
        const newEnd = DateTime.fromISO(block.end);
        if (newStart < existingStart && newEnd >= existingStart) {
          existingBlock.start = block.start;
        }
        if (newEnd > existingEnd && newStart <= existingEnd) {
          existingBlock.end = block.end;
        }
        existingBlock.timeSlots.push({
          bishopricMember: this.bishopricMemberMap[block.bishopricMember],
          start: block.availableSlot.start,
          end: block.availableSlot.end
        });
      }
      return acc;
    }, availabilityMap);

    availabilities.forEach(block => {
      block.timeSlots.sort((a, b) => {
        const aStart = DateTime.fromISO(a.start);
        const bStart = DateTime.fromISO(b.start);
        return aStart.toMillis() - bStart.toMillis();
      });
    });

    return availabilities;
  });

  submit = async () => {
    this.isSubmitting.set(true);
    if (this.interviewForm.invalid || this.timeSlotFormControl.invalid) {
      this.interviewForm.markAllAsTouched();
      this.timeSlotFormControl.markAsTouched();
      this.isSubmitting.set(false);
      return;
    }

    const bishopricMember = Object.entries(this.bishopricMemberMap).find(([_, name]) => name === this.timeSlotFormControl.value?.[0].bishopricMember)?.[0] as BishopricMember;
    if (!bishopricMember) {
      this.isSubmitting.set(false);
      return;
    }
    
    this.createAppointmentGQL.mutate({
      input: {
        bishopricMember,
        name: this.interviewForm.controls.name.value!,
        type: this.interviewForm.controls.interviewType.value!,
        description: this.showDescriptionBox() ? this.interviewForm.controls.description.value : '',
        timeSlot: {
          start: this.timeSlotFormControl.value![0].start,
          end: this.timeSlotFormControl.value![0].end,
        }
      }
    }).subscribe({
      next: (result) => {
        if (result.data?.createAppointment.success) {
          this._snackBar.open('Appointment created successfully!', 'Close', { duration: 5000 });
          this.interviewForm.reset();
          this.timeSlotFormControl.reset();
          this.availabilityResource.reload();
        }
        else {
          const defaultErrorMessage = 'There was a problem setting your appointment. Please try again or contact the executive secretary.';
          switch (result.data?.createAppointment.error?.code) {
            case "INVALID_TIME_SLOT":
            case "APPOINTMENT_CONFLICT":
            case "UNKNOWN_ERROR":
              this.timeSlotFormControl.reset();
              this.availabilityResource.reload();
              this._snackBar.open(result.data.createAppointment.error.message || defaultErrorMessage, 'Close', { duration: 5000 });
              break;
            default:
              console.error('Error creating appointment:', result.data?.createAppointment.error?.message);
              this._snackBar.open(defaultErrorMessage, 'Close', { duration: 5000 });
          }
        }
        this.isSubmitting.set(false);
      },
      error: (error) => {
        console.error('Error creating appointment:', error);
        this._snackBar.open('There was a problem setting your appointment. Please try again or contact the executive secretary.', 'Close', { duration: 5000 });
        this.isSubmitting.set(false);
      }
    });
  }
}
