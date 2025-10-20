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
import { SignUpDetails } from '@graphql';
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
    name: new FormControl('', Validators.required),
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
      name: this.signUpForm.controls.name.value!,
      email: this.signUpForm.controls.email.value!,
      password: this.signUpForm.controls.password.value!
    };

    this.isSignedUp.set(await this._auth.signUp(input));
  }

  resendEmailVerification = async () => {
    if (this.signUpForm.invalid) return;

    const email = this.signUpForm.controls.email.value;
    const [error, success] = await Utilities.safeAsync(this._auth.resendEmailVerification(email!));
    if (success) {
      this._snackBar.open("New email code sent successfully!", "Dismiss", { duration: 2500 });
    }
    else {
      if (error) console.error(error);
      this._snackBar.open("There was a problem sending the new code", "Dismiss", { duration: 5000 });
    }
  }
}
