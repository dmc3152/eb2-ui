import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AllAppointmentTypesGQL, AppointmentDetails, AvailabilityBlocksGQL, CreateAppointmentGQL } from '@graphql';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map, of, tap } from 'rxjs';
import { DatePipe, KeyValuePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { DateTime } from 'luxon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { onlyCompleteData } from 'apollo-angular';

export interface AvailabilityBlockDisplay {
  start: string;
  end: string;
  timeSlots: {
    bishopricMember: string;
    start: string;
    end: string;
  }[];
}

export interface ConfirmedAppointmentDetails {
  bishopricMember: string
  type: string
  start: string
  end: string
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
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);

  private sortStringFactory = <T extends object>(field: keyof T): (a: T, b: T) => number => (a, b) => (a[field] as string || '').localeCompare(b[field] as string || '', undefined, { sensitivity: 'base', numeric: true })
  interviewForm = new FormGroup({
    name: new FormControl('', Validators.required),
    interviewType: new FormControl<string | null>(null, Validators.required),
    description: new FormControl(''),
  });
  timeSlotFormControl = new FormControl<[{ bishopricMember: string; start: string; end: string; }]>([] as any, Validators.required);
  interviewType = toSignal(this.interviewForm.controls.interviewType.valueChanges.pipe(tap(x => this.timeSlotFormControl.reset())), { initialValue: this.interviewForm.controls.interviewType.value });
  showDescriptionBox = computed(() => {
    const type = this.interviewType();
    if (!type) return false;
    const appointmentCodes: string[] = ['appointment_type:personal_matter_short', 'appointment_type:personal_matter_long', 'appointment_type:other'];
    return appointmentCodes.includes(type);
  });
  isSubmitting = signal(false);
  interviewOptions = toSignal(this.allAppointmentTypesGQL.fetch().pipe(
    map(response => Array.from(response.data?.allAppointmentTypes || []).sort(this.sortStringFactory("name"))),
    map(options => {
      const tithingDeclarationOptionIndex = options.findIndex(item => item.id === 'appointment_type:tithing_declaration');
      if (tithingDeclarationOptionIndex > -1) {
        const [tithingDeclarationOption] = options.splice(tithingDeclarationOptionIndex, 1);
        // options.unshift(tithingDeclarationOption);
      }
      return options;
    })
  ), { initialValue: [] });
  selectedAppointmentType = computed(() => this.findInterviewOption(this.interviewType()));
  availabilityResource = rxResource({
    params: () => ({ duration: this.selectedAppointmentType()?.durationInMinutes }),
    stream: ({ params }) =>
      !params.duration ?
        of(undefined) :
        this.availabilityBlocksGQL.watch({
          variables: { durationInMinutes: params.duration },
          fetchPolicy: 'cache-and-network',
          notifyOnNetworkStatusChange: false
        })
          .valueChanges
          .pipe(onlyCompleteData()),
  });

  private bishopricMemberMap = {
    ['calling:bishop']: 'Bishop',
    ['calling:bishopric_first_counselor']: 'Bro Naidu',
    ['calling:bishopric_second_counselor']: 'Bro Komatsu',
  }

  availabilityBlocks = computed(() => {
    const availabilityMap = new Map<string, AvailabilityBlockDisplay>();
    if (!this.availabilityResource.hasValue() || !this.selectedAppointmentType()) return availabilityMap;

    const availabilities = (this.availabilityResource.value().data?.allAvailabilityBlocks || []).reduce((acc, block) => {
      if (!block.bishopricMember || !block.availableSlot?.start || !block.availableSlot.end) return acc;

      const isValidBishopricMember = this.selectedAppointmentType()!.interviewers.includes(block.bishopricMember);
      if (!isValidBishopricMember) return acc;

      if (!block.start || !block.end) return acc;

      const blockKey = DateTime.fromISO(block.start).startOf('day').toISO();
      if (!blockKey) return acc;

      const existingBlock = acc.get(blockKey);
      if (!existingBlock) {
        acc.set(blockKey, {
          start: block.start,
          end: block.end,
          timeSlots: [{
            bishopricMember: this.bishopricMemberMap[block.bishopricMember as keyof typeof this.bishopricMemberMap],
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
          bishopricMember: this.bishopricMemberMap[block.bishopricMember as keyof typeof this.bishopricMemberMap],
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

  findInterviewOption = (id: string | null) => {
    if (id === null) return undefined;
    return this.interviewOptions().find(option => option.id === id);
  }

  submit = async () => {
    this.isSubmitting.set(true);
    if (this.interviewForm.invalid || this.timeSlotFormControl.invalid) {
      this.interviewForm.markAllAsTouched();
      this.timeSlotFormControl.markAsTouched();
      this.isSubmitting.set(false);
      return;
    }

    const bishopricMember = Object.entries(this.bishopricMemberMap).find(([_, name]) => name === this.timeSlotFormControl.value?.[0].bishopricMember)?.[0];
    if (!bishopricMember) {
      this.isSubmitting.set(false);
      return;
    }

    const input: AppointmentDetails = {
      bishopricMember,
      name: this.interviewForm.controls.name.value!,
      id: this.interviewForm.controls.interviewType.value!,
      description: this.showDescriptionBox() ? this.interviewForm.controls.description.value : '',
      timeSlot: {
        start: this.timeSlotFormControl.value![0].start,
        end: this.timeSlotFormControl.value![0].end,
      }
    };

    this.createAppointmentGQL.mutate({ variables: { input } }).subscribe({
      next: (result) => {
        if (result.data?.createAppointment.success) {
          this._snackBar.open('Appointment created successfully!', 'Close', { duration: 5000 });
          const queryParams: ConfirmedAppointmentDetails = {
            bishopricMember: this.bishopricMemberMap[input.bishopricMember as keyof typeof this.bishopricMemberMap],
            type: this.findInterviewOption(input.id)?.name || "",
            start: input.timeSlot.start,
            end: input.timeSlot.end
          }
          this._router.navigate(['../interviewSuccess'], { relativeTo: this._route, queryParams });
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
