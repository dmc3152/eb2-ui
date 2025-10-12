import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Utilities } from '../../core/utilities';

@Component({
  selector: 'app-resend-email',
  imports: [MatCardModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatButtonModule, RouterLink],
  templateUrl: './resend-email.html',
  styleUrl: './resend-email.scss'
})
export class ResendEmailPage {
  private _auth = inject(AuthService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _snackBar = inject(MatSnackBar);

  resendEmailForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
  });

  resendEmail = async () => {
    if (this.resendEmailForm.invalid) return;

    const { email } = this.resendEmailForm.value;
    const [error, success] = await Utilities.safeAsync(this._auth.resendEmailVerification(email!));
    if (success) {
      this._snackBar.open("Email code sent successfully!", "Dismiss", { duration: 2500 });
      this._router.navigate(["../verifyEmail"], { relativeTo: this._route, queryParams: { email } });
    }
    else {
      if (error) console.error(error);
      this._snackBar.open("Failed to send the code", "Dismiss", { duration: 5000 });
    }
  }
}
