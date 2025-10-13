import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ConfirmedAppointmentDetails } from '../interviews/interviews';
import { DateTime } from 'luxon';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-interview-success',
  imports: [MatCardModule, MatButton, RouterLink],
  templateUrl: './interview-success.html',
  styleUrl: './interview-success.scss'
})
export class InterviewSuccessPage {
  private _route = inject(ActivatedRoute);

  interviewData = toSignal(
    this._route.queryParams.pipe(
      map(params => {
        const startDateTime = params['start'] ? DateTime.fromISO(params['start']) : undefined;
        const endDateTime = params['end'] ? DateTime.fromISO(params['end']) : undefined;
        const start = startDateTime && startDateTime.isValid ? `${startDateTime.toFormat("EEEE, MMM d")} at ${startDateTime.toFormat("h:mm") }` : '';
        const end = endDateTime && endDateTime.isValid ? endDateTime.toFormat("h:mm a") : "";
        return {
          ...params,
          start,
          end
        } as ConfirmedAppointmentDetails;
      })
    ),
    {
      initialValue: {
        bishopricMember: "",
        type: "",
        start: "",
        end: ""
      }
    });
}
