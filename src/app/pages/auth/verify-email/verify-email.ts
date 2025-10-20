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
    const [error, success] = await Utilities.safeAsync(this._auth.verifyEmail(email!, code!));
    if (success) {
      this._snackBar.open("Email verified successfully!", "Dismiss", { duration: 2500 });
      this._router.navigateByUrl("/home");
    }
    else {
      if (error) console.error(error);
      this._snackBar.open("Failed to verify the email", "Dismiss", { duration: 5000 });
    }
  }
}
