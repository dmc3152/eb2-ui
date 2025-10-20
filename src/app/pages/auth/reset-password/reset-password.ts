import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AuthService } from '@core/auth';
import { Utilities } from '@core/utilities';
import { ResetPasswordDetails } from '@graphql';

@Component({
  selector: 'app-reset-password',
  imports: [MatCardModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatButtonModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPasswordPage {
  private _route = inject(ActivatedRoute);
  private _auth = inject(AuthService);
  private _router = inject(Router);
  private _snackBar = inject(MatSnackBar);

  params = toSignal(this._route.queryParamMap.pipe(map(params => {
    const codeParam = params.get('code');
    return {
      code: codeParam ? parseInt(codeParam) : null,
      email: params.get('email')
    };
  })), { initialValue: { code: null, email: null } });

  resetPasswordForm = new FormGroup({
    code: new FormControl(this.params().code, [Validators.required]),
    email: new FormControl(this.params().email, [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  resetPassword = async () => {
    if (this.resetPasswordForm.invalid) return;

    const formValue = this.resetPasswordForm.value;
    const input: ResetPasswordDetails = {
      code: formValue.code!,
      email: formValue.email!,
      password: formValue.password!
    }
    const [error, success] = await Utilities.safeAsync(this._auth.resetPassword(input));
    if (success) {
      this._snackBar.open("Reset password successfully!", "Dismiss", { duration: 2500 });
      this._router.navigate(["../login"], { relativeTo: this._route });
    }
    else {
      if (error) console.error(error);
      this._snackBar.open("Failed to reset password", "Dismiss", { duration: 5000 });
    }
  }
}
