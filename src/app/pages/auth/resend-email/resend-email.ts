import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@core/auth';
import { Utilities } from '@core/utilities';
import { ResendEmailVerificationErrorCodes } from '@graphql';

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
      const errorMessage = this._resendEmailVerificationErrorMessage(error);
      this._snackBar.open(errorMessage, "Dismiss", { duration: 5000 });
    }
  }

  private _resendEmailVerificationErrorMessage = (error?: Error) => {
    const defaultErrorMessage = "An unknown error occurred. Please try again later";
    if (!error) return defaultErrorMessage;

    switch (error.message) {
      case ResendEmailVerificationErrorCodes.EmailAlreadyVerified:
        return "Your email has already been verified. No email will be sent";
      case ResendEmailVerificationErrorCodes.CouldNotUpdate:
      case ResendEmailVerificationErrorCodes.CouldNotCreate:
      case ResendEmailVerificationErrorCodes.EmailError:
      case ResendEmailVerificationErrorCodes.EmailVerifierAuthenticationFailed:
      case ResendEmailVerificationErrorCodes.NotFound:
      case ResendEmailVerificationErrorCodes.UnknownError:
      default:
        return defaultErrorMessage;
    }
  }
}
