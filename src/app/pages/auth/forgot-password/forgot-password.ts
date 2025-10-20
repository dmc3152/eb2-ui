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
import { RequestPasswordResetErrorCodes } from '@graphql';

@Component({
  selector: 'app-forgot-password',
  imports: [MatCardModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatButtonModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPasswordPage {
  private _auth = inject(AuthService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _snackBar = inject(MatSnackBar);

  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  requestPasswordCode = async () => {
    const [error, success] = await Utilities.safeAsync(this._auth.requestPasswordReset(this.forgotPasswordForm.controls.email.value!));
    if (success || error?.message === RequestPasswordResetErrorCodes.NotFound) {
      this._snackBar.open("Code emailed successfully!", "Dismiss", { duration: 2500 });
      this._router.navigate(["../resetPassword"], { relativeTo: this._route, queryParams: { email: this.forgotPasswordForm.controls.email.value } });
    }
    else {
      const errorMessage = this._requestPasswordCodeError(error);
      this._snackBar.open(errorMessage, "Dismiss", { duration: 5000 });
    }
  }

  private _requestPasswordCodeError = (error?: Error) => {
    const defaultErrorMessage = "There was a problem creating the code. Please try again later";
    if (!error) return defaultErrorMessage;

    switch (error.message) {
      case RequestPasswordResetErrorCodes.EmailError:
        return "There was a problem sending the email. Please try again later";
      case RequestPasswordResetErrorCodes.PasswordResetAgentAuthenticationFailed:
      case RequestPasswordResetErrorCodes.NotFound:
      case RequestPasswordResetErrorCodes.CouldNotCreate:
      case RequestPasswordResetErrorCodes.CouldNotUpdate:
      case RequestPasswordResetErrorCodes.UnknownError:
      default:
        return defaultErrorMessage;
    }
  }
}
