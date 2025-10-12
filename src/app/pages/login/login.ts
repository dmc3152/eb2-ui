import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { Credentials, LoginErrorCodes } from '../../../../graphql/generated';
import { AuthService } from '../../core/auth';
import { Utilities } from '../../core/utilities';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  imports: [MatCardModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatButtonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginPage {
  private _auth = inject(AuthService);
  private _router = inject(Router);
  private _snackBar = inject(MatSnackBar);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  login = async () => {
    if (!this.loginForm.valid) return;

    const input: Credentials = {
      email: this.loginForm.controls.email.value!,
      password: this.loginForm.controls.password.value!
    };
    const [error, success] = await Utilities.safeAsync(this._auth.login(input));
    if (success) {
      this._snackBar.open("Logged in successfully!", "Dismiss", { duration: 2500 });
      this._router.navigateByUrl("/nav/home");
    }
    else {
      const errorMessage = this._loginErrorMessage(error);
      this._snackBar.open(errorMessage, "Dismiss", { duration: 5000 });
    }
  }

  private _loginErrorMessage = (error?: Error) => {
    const defaultErrorMessage = "An unknown error occurred. Please try again later";
    if (!error) return defaultErrorMessage;

    switch (error.message) {
      case LoginErrorCodes.InvalidCredentials:
        return "Invalid credentials or your email may not be verified";
      case LoginErrorCodes.UserNotFound:
        return defaultErrorMessage;
      case LoginErrorCodes.UnknownError:
      default:
        return defaultErrorMessage;
    }
  }
}
