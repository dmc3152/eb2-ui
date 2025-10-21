import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@core/auth';
import { Utilities } from '@core/utilities';
import { VerifyEmailErrorCodes } from '@graphql';

@Component({
  selector: 'app-verify-email',
  imports: [MatCardModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatButtonModule, RouterLink],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.scss'
})
export class VerifyEmailPage {
  private _auth = inject(AuthService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _snackBar = inject(MatSnackBar);

  params = toSignal(this._route.queryParamMap.pipe(map(params => {
    const codeParam = params.get('code');
    return {
      code: codeParam ? parseInt(codeParam) : null,
      email: params.get('email')
    };
  })), { initialValue: { code: null, email: null } });

  verifyEmailForm = new FormGroup({
    code: new FormControl(this.params().code, [Validators.required]),
    email: new FormControl(this.params().email, [Validators.required, Validators.email]),
  });

  verifyEmail = async () => {
    if (this.verifyEmailForm.invalid) return;

    const { email, code } = this.verifyEmailForm.value;
    const [error, result] = await Utilities.safeAsync(this._auth.verifyEmail(email!, code!));
    if (result?.success) {
      this._snackBar.open("Email verified successfully!", "Dismiss", { duration: 2500 });
      this._router.navigate(["../login"], { relativeTo: this._route });
    }
    else {
      const errorMessage = this._verifyEmailErrorMessage(result?.code || error?.message);
      this._snackBar.open(errorMessage, "Dismiss", { duration: 5000 });
    }
  }

  private _verifyEmailErrorMessage = (code?: string | null) => {
    const defaultErrorMessage = "An unknown error occurred. Please try again later";
    if (!code) return defaultErrorMessage;

    switch (code) {
      case VerifyEmailErrorCodes.CodeExpired:
        return "Your code has expired. Please request another code.";
      case VerifyEmailErrorCodes.CodeInvalid:
        return "Your code is invalid. Please try again or request another code.";
      case VerifyEmailErrorCodes.DeleteError:
      case VerifyEmailErrorCodes.EmailVerifierAuthenticationFailed:
      case VerifyEmailErrorCodes.NotFound:
      case VerifyEmailErrorCodes.UnknownError:
      default:
        return defaultErrorMessage;
    }
  }
}
