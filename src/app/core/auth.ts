import { inject, Injectable, signal } from '@angular/core';
import { Credentials, LoginErrorCodes, LoginGQL, LogoutGQL, RequestPasswordResetErrorCodes, RequestPasswordResetGQL, RequestPasswordResetMutation, ResendEmailVerificationGQL, ResetPasswordDetails, ResetPasswordErrorCodes, ResetPasswordGQL, ResetPasswordMutationVariables, SelfGQL, SignUpDetails, SignUpErrorCodes, SignUpGQL, User, VerifyEmailErrorCodes, VerifyEmailGQL } from '../../../graphql/generated';
import { catchError, firstValueFrom, of } from 'rxjs';
import { Utilities } from './utilities';
import { MutationResult } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _logoutGql = inject(LogoutGQL);
  private _loginGql = inject(LoginGQL);
  private _selfGql = inject(SelfGQL);
  private _signUpGql = inject(SignUpGQL);
  private _requestPasswordResetGql = inject(RequestPasswordResetGQL);
  private _resetPasswordGql = inject(ResetPasswordGQL);
  private _verifyEmailGql = inject(VerifyEmailGQL);
  private _resendEmailVerificationGql = inject(ResendEmailVerificationGQL);

  private _authenticatedUser = signal<User | null>(null);
  private _isAuthenticated = signal<boolean>(false);
  
  isAuthenticated = this._isAuthenticated.asReadonly();
  authenticatedUser = this._authenticatedUser.asReadonly();

  login = async (input: Credentials): Promise<boolean> => {
    const result = await firstValueFrom(this._loginGql.mutate({ input }).pipe(
      catchError(error => of({
        data: {
          login: {
            user: null,
            success: false,
            error: {
              code: LoginErrorCodes.UnknownError,
              message: Utilities.parseError(error).message
            }
          }
        }
      }))
    ));

    if (result.data?.login.success) {
      this._isAuthenticated.set(true);
      this._authenticatedUser.set(result.data.login.user || null);
      return true;
    }

    if (result.data?.login.error?.code) {
      console.error(result.data.login.error.message);
      throw new Error(result.data.login.error.code);
    }

    return false;
  }

  logout = async (): Promise<boolean> => {
    const response = await firstValueFrom(this._logoutGql.mutate());
    if (response.data?.logout.success) {
      this._isAuthenticated.set(false);
      this._authenticatedUser.set(null);
      return true;
    }

    if (!response.data?.logout.success) {
      console.error("Failed to logout");
    }

    return false;
  }

  self = async (): Promise<User | null> => {
    const response = await firstValueFrom(this._selfGql.fetch());
    if (!response.data.self?.id) {
      return null;
    }

    this._isAuthenticated.set(true);
    this._authenticatedUser.set(response.data.self);

    return response.data.self;
  }

  signUp = async (input: SignUpDetails): Promise<{ success: boolean, code: SignUpErrorCodes | null }> => {
    const response = await firstValueFrom(this._signUpGql.mutate({ input }));

    if (response.data?.signUp.error?.code) {
      console.error(response.data.signUp.error.message);
    }

    return {
      success: !!response.data?.signUp.success,
      code: response.data?.signUp.error?.code || null
    };
  }

  requestPasswordReset = async (email: String): Promise<boolean> => {
    const response = await firstValueFrom(this._requestPasswordResetGql.mutate({ email }).pipe(
      catchError(error => of({
        data: {
          requestPasswordReset: {
            success: false,
            error: {
              code: RequestPasswordResetErrorCodes.UnknownError,
              message: Utilities.parseError(error).message
            }
          }
        }
      } as MutationResult<RequestPasswordResetMutation>))
    ));

    if (response.data?.requestPasswordReset.success) return true;

    if (response.data?.requestPasswordReset.error?.code) {
      console.error(response.data.requestPasswordReset.error.message);
      throw new Error(response.data.requestPasswordReset.error.code);
    }

    return false;
  }

  resetPassword = async (input: ResetPasswordDetails): Promise<{ success: boolean, code: ResetPasswordErrorCodes | null }> => {
    const response = await firstValueFrom(this._resetPasswordGql.mutate({ input }));

    if (response.data?.resetPassword.error?.code) {
      console.error(response.data.resetPassword.error.message);
    }

    return {
      success: !!response.data?.resetPassword.success,
      code: response.data?.resetPassword.error?.code || null
    };
  }

  verifyEmail = async (email: string, code: number): Promise<{ success: boolean, code: VerifyEmailErrorCodes | null }> => {
    const response = await firstValueFrom(this._verifyEmailGql.mutate({ email, code }));

    if (response.data?.verifyEmail.error?.code) {
      console.error(response.data.verifyEmail.error.message);
    }

    return {
      success: !!response.data?.verifyEmail.success,
      code: response.data?.verifyEmail.error?.code || null
    };
  }

  resendEmailVerification = async (email: string) => {
    const response = await firstValueFrom(this._resendEmailVerificationGql.mutate({ email }));
    if (response.data?.resendEmailVerification.success) return true;

    if (response.data?.resendEmailVerification.error?.code) {
      console.error(response.data.resendEmailVerification.error.message);
      throw new Error(response.data.resendEmailVerification.error.code);
    }

    return false;
  }
}
