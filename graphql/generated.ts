import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: string; output: string; }
  /** A field whose value conforms to the standard internet email address format as specified in HTML Spec: https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address. */
  EmailAddress: { input: any; output: any; }
};

export type AppointmentDetails = {
  bishopricMember: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  timeSlot: AppointmentTimeSlot;
};

export type AppointmentError = GenericError & {
  __typename?: 'AppointmentError';
  code?: Maybe<AppointmentErrorCodes>;
  message?: Maybe<Scalars['String']['output']>;
};

export enum AppointmentErrorCodes {
  AppointmentConflict = 'APPOINTMENT_CONFLICT',
  AppointmentTypeNotFound = 'APPOINTMENT_TYPE_NOT_FOUND',
  InvalidTimeSlot = 'INVALID_TIME_SLOT',
  UnknownError = 'UNKNOWN_ERROR'
}

export type AppointmentPayload = {
  __typename?: 'AppointmentPayload';
  bishopricMember?: Maybe<Scalars['ID']['output']>;
  error?: Maybe<AppointmentError>;
  success: Scalars['Boolean']['output'];
  timeSlot?: Maybe<TimeSlot>;
};

export type AppointmentTimeSlot = {
  end: Scalars['DateTime']['input'];
  start: Scalars['DateTime']['input'];
};

export type AppointmentType = {
  __typename?: 'AppointmentType';
  description?: Maybe<Scalars['String']['output']>;
  durationInMinutes: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  interviewers: Array<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
};

export type AvailabilityBlock = {
  __typename?: 'AvailabilityBlock';
  availableSlot?: Maybe<TimeSlot>;
  bishopricMember?: Maybe<Scalars['ID']['output']>;
  end?: Maybe<Scalars['DateTime']['output']>;
  priorityDirection?: Maybe<PriorityDirection>;
  start?: Maybe<Scalars['DateTime']['output']>;
};


export type AvailabilityBlockAvailableSlotArgs = {
  durationInMinutes: Scalars['Int']['input'];
};

export type Credentials = {
  email: Scalars['EmailAddress']['input'];
  password: Scalars['String']['input'];
};

export type GenericError = {
  message?: Maybe<Scalars['String']['output']>;
};

export type LoginError = GenericError & {
  __typename?: 'LoginError';
  code?: Maybe<LoginErrorCodes>;
  message?: Maybe<Scalars['String']['output']>;
};

export enum LoginErrorCodes {
  InvalidCredentials = 'INVALID_CREDENTIALS',
  UnknownError = 'UNKNOWN_ERROR',
  UserNotFound = 'USER_NOT_FOUND'
}

export type LoginPayload = {
  __typename?: 'LoginPayload';
  error?: Maybe<LoginError>;
  success: Scalars['Boolean']['output'];
  user?: Maybe<User>;
};

export type LogoutPayload = {
  __typename?: 'LogoutPayload';
  success: Scalars['Boolean']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createAppointment: AppointmentPayload;
  login: LoginPayload;
  logout: LogoutPayload;
  requestPasswordReset: RequestPasswordResetPayload;
  resendEmailVerification: ResendEmailVerificationPayload;
  resetPassword: ResetPasswordPayload;
  signUp: SignUpPayload;
  verifyEmail: VerifyEmailPayload;
};


export type MutationCreateAppointmentArgs = {
  input: AppointmentDetails;
};


export type MutationLoginArgs = {
  input: Credentials;
};


export type MutationRequestPasswordResetArgs = {
  email: Scalars['EmailAddress']['input'];
};


export type MutationResendEmailVerificationArgs = {
  email: Scalars['EmailAddress']['input'];
};


export type MutationResetPasswordArgs = {
  input: ResetPasswordDetails;
};


export type MutationSignUpArgs = {
  input: SignUpDetails;
};


export type MutationVerifyEmailArgs = {
  code: Scalars['Int']['input'];
  email: Scalars['EmailAddress']['input'];
};

export enum PriorityDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Query = {
  __typename?: 'Query';
  allAppointmentTypes: Array<AppointmentType>;
  allAvailabilityBlocks: Array<AvailabilityBlock>;
  availabilityBlocks: Array<AvailabilityBlock>;
  availableTimeSlots: Array<Maybe<TimeSlot>>;
  self?: Maybe<User>;
};


export type QueryAvailabilityBlocksArgs = {
  bishopricMember: Scalars['ID']['input'];
};


export type QueryAvailableTimeSlotsArgs = {
  bishopricMember: Scalars['ID']['input'];
  durationInMinutes: Scalars['Int']['input'];
};

export type RequestPasswordResetError = GenericError & {
  __typename?: 'RequestPasswordResetError';
  code?: Maybe<RequestPasswordResetErrorCodes>;
  message?: Maybe<Scalars['String']['output']>;
};

export enum RequestPasswordResetErrorCodes {
  CouldNotCreate = 'COULD_NOT_CREATE',
  CouldNotUpdate = 'COULD_NOT_UPDATE',
  EmailError = 'EMAIL_ERROR',
  NotFound = 'NOT_FOUND',
  PasswordResetAgentAuthenticationFailed = 'PASSWORD_RESET_AGENT_AUTHENTICATION_FAILED',
  UnknownError = 'UNKNOWN_ERROR'
}

export type RequestPasswordResetPayload = {
  __typename?: 'RequestPasswordResetPayload';
  error?: Maybe<RequestPasswordResetError>;
  success: Scalars['Boolean']['output'];
};

export type ResendEmailVerificationError = GenericError & {
  __typename?: 'ResendEmailVerificationError';
  code?: Maybe<ResendEmailVerificationErrorCodes>;
  message?: Maybe<Scalars['String']['output']>;
};

export enum ResendEmailVerificationErrorCodes {
  CouldNotCreate = 'COULD_NOT_CREATE',
  CouldNotUpdate = 'COULD_NOT_UPDATE',
  EmailAlreadyVerified = 'EMAIL_ALREADY_VERIFIED',
  EmailError = 'EMAIL_ERROR',
  EmailVerifierAuthenticationFailed = 'EMAIL_VERIFIER_AUTHENTICATION_FAILED',
  NotFound = 'NOT_FOUND',
  UnknownError = 'UNKNOWN_ERROR'
}

export type ResendEmailVerificationPayload = {
  __typename?: 'ResendEmailVerificationPayload';
  error?: Maybe<ResendEmailVerificationError>;
  success: Scalars['Boolean']['output'];
};

export type ResetPasswordDetails = {
  code: Scalars['Int']['input'];
  email: Scalars['EmailAddress']['input'];
  password: Scalars['String']['input'];
};

export type ResetPasswordError = GenericError & {
  __typename?: 'ResetPasswordError';
  code?: Maybe<ResetPasswordErrorCodes>;
  message?: Maybe<Scalars['String']['output']>;
};

export enum ResetPasswordErrorCodes {
  CodeExpired = 'CODE_EXPIRED',
  CodeInvalid = 'CODE_INVALID',
  DeleteError = 'DELETE_ERROR',
  NotFound = 'NOT_FOUND',
  PasswordResetAgentAuthenticationFailed = 'PASSWORD_RESET_AGENT_AUTHENTICATION_FAILED',
  ResetError = 'RESET_ERROR',
  UnknownError = 'UNKNOWN_ERROR'
}

export type ResetPasswordPayload = {
  __typename?: 'ResetPasswordPayload';
  error?: Maybe<ResetPasswordError>;
  success: Scalars['Boolean']['output'];
};

export type SignUpDetails = {
  email: Scalars['EmailAddress']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SignUpError = GenericError & {
  __typename?: 'SignUpError';
  code?: Maybe<SignUpErrorCodes>;
  message?: Maybe<Scalars['String']['output']>;
};

export enum SignUpErrorCodes {
  EmailError = 'EMAIL_ERROR',
  EmailVerifierAuthenticationFailed = 'EMAIL_VERIFIER_AUTHENTICATION_FAILED',
  InvalidCredentials = 'INVALID_CREDENTIALS',
  InvalidPasswordCharacter = 'INVALID_PASSWORD_CHARACTER',
  InvalidPasswordLength = 'INVALID_PASSWORD_LENGTH',
  MissingCapitalLetter = 'MISSING_CAPITAL_LETTER',
  MissingLowercaseLetter = 'MISSING_LOWERCASE_LETTER',
  MissingNumber = 'MISSING_NUMBER',
  NotFound = 'NOT_FOUND',
  UnknownError = 'UNKNOWN_ERROR'
}

export type SignUpPayload = {
  __typename?: 'SignUpPayload';
  error?: Maybe<SignUpError>;
  success: Scalars['Boolean']['output'];
};

export type TimeSlot = {
  __typename?: 'TimeSlot';
  end?: Maybe<Scalars['DateTime']['output']>;
  start?: Maybe<Scalars['DateTime']['output']>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['EmailAddress']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type VerifyEmailError = GenericError & {
  __typename?: 'VerifyEmailError';
  code?: Maybe<VerifyEmailErrorCodes>;
  message?: Maybe<Scalars['String']['output']>;
};

export enum VerifyEmailErrorCodes {
  CodeExpired = 'CODE_EXPIRED',
  CodeInvalid = 'CODE_INVALID',
  DeleteError = 'DELETE_ERROR',
  EmailVerifierAuthenticationFailed = 'EMAIL_VERIFIER_AUTHENTICATION_FAILED',
  NotFound = 'NOT_FOUND',
  UnknownError = 'UNKNOWN_ERROR'
}

export type VerifyEmailPayload = {
  __typename?: 'VerifyEmailPayload';
  error?: Maybe<VerifyEmailError>;
  success: Scalars['Boolean']['output'];
};

export type SelfQueryVariables = Exact<{ [key: string]: never; }>;


export type SelfQuery = { __typename?: 'Query', self?: { __typename?: 'User', id: string, name: string, email: any } | null };

export type SignUpMutationVariables = Exact<{
  input: SignUpDetails;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp: { __typename?: 'SignUpPayload', success: boolean, error?: { __typename?: 'SignUpError', code?: SignUpErrorCodes | null, message?: string | null } | null } };

export type LoginMutationVariables = Exact<{
  input: Credentials;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginPayload', success: boolean, user?: { __typename?: 'User', id: string, name: string, email: any } | null, error?: { __typename?: 'LoginError', code?: LoginErrorCodes | null, message?: string | null } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: { __typename?: 'LogoutPayload', success: boolean } };

export type RequestPasswordResetMutationVariables = Exact<{
  email: Scalars['EmailAddress']['input'];
}>;


export type RequestPasswordResetMutation = { __typename?: 'Mutation', requestPasswordReset: { __typename?: 'RequestPasswordResetPayload', success: boolean, error?: { __typename?: 'RequestPasswordResetError', code?: RequestPasswordResetErrorCodes | null, message?: string | null } | null } };

export type ResetPasswordMutationVariables = Exact<{
  input: ResetPasswordDetails;
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: { __typename?: 'ResetPasswordPayload', success: boolean, error?: { __typename?: 'ResetPasswordError', code?: ResetPasswordErrorCodes | null, message?: string | null } | null } };

export type VerifyEmailMutationVariables = Exact<{
  email: Scalars['EmailAddress']['input'];
  code: Scalars['Int']['input'];
}>;


export type VerifyEmailMutation = { __typename?: 'Mutation', verifyEmail: { __typename?: 'VerifyEmailPayload', success: boolean, error?: { __typename?: 'VerifyEmailError', code?: VerifyEmailErrorCodes | null, message?: string | null } | null } };

export type ResendEmailVerificationMutationVariables = Exact<{
  email: Scalars['EmailAddress']['input'];
}>;


export type ResendEmailVerificationMutation = { __typename?: 'Mutation', resendEmailVerification: { __typename?: 'ResendEmailVerificationPayload', success: boolean, error?: { __typename?: 'ResendEmailVerificationError', code?: ResendEmailVerificationErrorCodes | null, message?: string | null } | null } };

export type AvailabilityBlocksQueryVariables = Exact<{
  durationInMinutes: Scalars['Int']['input'];
}>;


export type AvailabilityBlocksQuery = { __typename?: 'Query', allAvailabilityBlocks: Array<{ __typename?: 'AvailabilityBlock', start?: string | null, end?: string | null, bishopricMember?: string | null, availableSlot?: { __typename?: 'TimeSlot', start?: string | null, end?: string | null } | null }> };

export type CreateAppointmentMutationVariables = Exact<{
  input: AppointmentDetails;
}>;


export type CreateAppointmentMutation = { __typename?: 'Mutation', createAppointment: { __typename?: 'AppointmentPayload', success: boolean, error?: { __typename?: 'AppointmentError', code?: AppointmentErrorCodes | null, message?: string | null } | null } };

export type AllAppointmentTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type AllAppointmentTypesQuery = { __typename?: 'Query', allAppointmentTypes: Array<{ __typename?: 'AppointmentType', id: string, name: string, description?: string | null, durationInMinutes: number, interviewers: Array<string> }> };

export const SelfDocument = gql`
    query Self {
  self {
    id
    name
    email
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SelfGQL extends Apollo.Query<SelfQuery, SelfQueryVariables> {
    document = SelfDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SignUpDocument = gql`
    mutation SignUp($input: SignUpDetails!) {
  signUp(input: $input) {
    success
    error {
      code
      message
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SignUpGQL extends Apollo.Mutation<SignUpMutation, SignUpMutationVariables> {
    document = SignUpDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LoginDocument = gql`
    mutation Login($input: Credentials!) {
  login(input: $input) {
    user {
      id
      name
      email
    }
    success
    error {
      code
      message
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LoginGQL extends Apollo.Mutation<LoginMutation, LoginMutationVariables> {
    document = LoginDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LogoutDocument = gql`
    mutation Logout {
  logout {
    success
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LogoutGQL extends Apollo.Mutation<LogoutMutation, LogoutMutationVariables> {
    document = LogoutDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RequestPasswordResetDocument = gql`
    mutation RequestPasswordReset($email: EmailAddress!) {
  requestPasswordReset(email: $email) {
    success
    error {
      code
      message
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RequestPasswordResetGQL extends Apollo.Mutation<RequestPasswordResetMutation, RequestPasswordResetMutationVariables> {
    document = RequestPasswordResetDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ResetPasswordDocument = gql`
    mutation ResetPassword($input: ResetPasswordDetails!) {
  resetPassword(input: $input) {
    success
    error {
      code
      message
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ResetPasswordGQL extends Apollo.Mutation<ResetPasswordMutation, ResetPasswordMutationVariables> {
    document = ResetPasswordDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const VerifyEmailDocument = gql`
    mutation VerifyEmail($email: EmailAddress!, $code: Int!) {
  verifyEmail(email: $email, code: $code) {
    success
    error {
      code
      message
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class VerifyEmailGQL extends Apollo.Mutation<VerifyEmailMutation, VerifyEmailMutationVariables> {
    document = VerifyEmailDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ResendEmailVerificationDocument = gql`
    mutation ResendEmailVerification($email: EmailAddress!) {
  resendEmailVerification(email: $email) {
    success
    error {
      code
      message
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ResendEmailVerificationGQL extends Apollo.Mutation<ResendEmailVerificationMutation, ResendEmailVerificationMutationVariables> {
    document = ResendEmailVerificationDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AvailabilityBlocksDocument = gql`
    query AvailabilityBlocks($durationInMinutes: Int!) {
  allAvailabilityBlocks {
    start
    end
    bishopricMember
    availableSlot(durationInMinutes: $durationInMinutes) {
      start
      end
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AvailabilityBlocksGQL extends Apollo.Query<AvailabilityBlocksQuery, AvailabilityBlocksQueryVariables> {
    document = AvailabilityBlocksDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateAppointmentDocument = gql`
    mutation CreateAppointment($input: AppointmentDetails!) {
  createAppointment(input: $input) {
    success
    error {
      code
      message
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateAppointmentGQL extends Apollo.Mutation<CreateAppointmentMutation, CreateAppointmentMutationVariables> {
    document = CreateAppointmentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AllAppointmentTypesDocument = gql`
    query AllAppointmentTypes {
  allAppointmentTypes {
    id
    name
    description
    durationInMinutes
    interviewers
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AllAppointmentTypesGQL extends Apollo.Query<AllAppointmentTypesQuery, AllAppointmentTypesQueryVariables> {
    document = AllAppointmentTypesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }