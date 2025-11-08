import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@core/auth';
import { Utilities } from '@core/utilities';
import { ResendEmailVerificationErrorCodes, SignUpDetails, SignUpErrorCodes } from '@graphql';
import { FormValidators } from '@core/formValidators';

@Component({
  selector: 'app-signup',
  imports: [MatCardModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatButtonModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class SignupPage {
  private _auth = inject(AuthService);
  private _snackBar = inject(MatSnackBar);

  readonly minPasswordLength = 8;

  signUpForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(this.minPasswordLength),
      FormValidators.hasCapitalLetter,
      FormValidators.hasLowercaseLetter,
      FormValidators.hasNumber,
      FormValidators.noSpecialCharacters
    ]),
  });

  isSignedUp = signal<boolean>(false);

  signUp = async () => {
    if (this.signUpForm.invalid) return;

    const input: SignUpDetails = {
      firstName: this.signUpForm.controls.firstName.value!,
      lastName: this.signUpForm.controls.lastName.value!,
      email: this.signUpForm.controls.email.value!,
      password: this.signUpForm.controls.password.value!
    };

    const [error, result] = await Utilities.safeAsync(this._auth.signUp(input));

    if (result?.success) {
      const message = result.code === SignUpErrorCodes.EmailError ? "There was a problem sending your verification email" : "Signed up successfully!";
      this._snackBar.open(message, "Dismiss", { duration: 2500 });
      this.isSignedUp.set(true);
    }
    else {
      const errorMessage = this._signUpErrorMessage(result?.code || error?.message);
      this._snackBar.open(errorMessage, "Dismiss", { duration: 5000 });
    }
  }

  private _signUpErrorMessage = (code?: string | null) => {
    const defaultErrorMessage = "An unknown error occurred. Please try again later";
    if (!code) return defaultErrorMessage;

    switch (code) {
      case SignUpErrorCodes.InvalidPasswordCharacter:
        return "Your password has an invalid character"
      case SignUpErrorCodes.InvalidPasswordLength:
        return `Your password must have at least ${this.minPasswordLength} characters`;
      case SignUpErrorCodes.MissingCapitalLetter:
        return "Your password must have at least 1 capital letter";
      case SignUpErrorCodes.MissingLowercaseLetter:
        return "Your password must have at least 1 lowercase letter";
      case SignUpErrorCodes.MissingNumber:
        return "Your password must have at least 1 number";
      case SignUpErrorCodes.EmailError:
        return "There was a problem sending your verification email";
      case SignUpErrorCodes.InvalidCredentials:
        return `This account already exists. Go back to login and choose "Forgot Password" to reset your password.`;
      case SignUpErrorCodes.EmailVerifierAuthenticationFailed:
      case SignUpErrorCodes.NotFound:
      case SignUpErrorCodes.UnknownError:
      default:
        return defaultErrorMessage;
    }
  }

  resendEmailVerification = async () => {
    if (this.signUpForm.invalid) return;

    const email = this.signUpForm.controls.email.value;
    const [error, success] = await Utilities.safeAsync(this._auth.resendEmailVerification(email!));
    if (success) {
      this._snackBar.open("New email code sent successfully!", "Dismiss", { duration: 2500 });
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
