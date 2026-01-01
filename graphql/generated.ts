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

export type Calling = {
  __typename?: 'Calling';
  assignedTo: Array<User>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  permissions: Array<Permission>;
};

export type CallingConnection = {
  __typename?: 'CallingConnection';
  edges: Array<CallingEdge>;
  pageInfo: PageInfo;
};

export type CallingEdge = {
  __typename?: 'CallingEdge';
  node: Calling;
};

export type CallingFilters = {
  isAssigned?: InputMaybe<Scalars['Boolean']['input']>;
  nameContains?: InputMaybe<Scalars['String']['input']>;
};

export type CallingSearch = {
  filters?: InputMaybe<CallingFilters>;
  paging?: InputMaybe<OffsetPaging>;
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
  addCallingsToPermission: PermissionAssociateCallingsPayload;
  changeMyTriviaPlayerName: TriviaGamePayload;
  closeTriviaGame: TriviaGamePayload;
  createAppointment: AppointmentPayload;
  createPermission: PermissionPayload;
  createTriviaGame: TriviaGamePayload;
  deletePermission: PermissionDeletePayload;
  login: LoginPayload;
  logout: LogoutPayload;
  nextTriviaQuestion: TriviaGamePayload;
  pauseTriviaGame: TriviaGamePayload;
  removeCallingsFromPermission: PermissionRemoveCallingsPayload;
  requestPasswordReset: RequestPasswordResetPayload;
  resendEmailVerification: ResendEmailVerificationPayload;
  resetPassword: ResetPasswordPayload;
  resumeTriviaGame: TriviaGamePayload;
  showScoreAfterQuestion: TriviaGamePayload;
  showScoreImmediately: TriviaGamePayload;
  signUp: SignUpPayload;
  startTriviaGame: TriviaGamePayload;
  stopTriviaGame: TriviaGamePayload;
  submitTriviaAnswer: TriviaGamePayload;
  verifyEmail: VerifyEmailPayload;
};


export type MutationAddCallingsToPermissionArgs = {
  input: PermissionCallings;
};


export type MutationChangeMyTriviaPlayerNameArgs = {
  newName: Scalars['String']['input'];
};


export type MutationCreateAppointmentArgs = {
  input: AppointmentDetails;
};


export type MutationCreatePermissionArgs = {
  input: PermissionCreate;
};


export type MutationCreateTriviaGameArgs = {
  gameId: Scalars['ID']['input'];
};


export type MutationDeletePermissionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  input: Credentials;
};


export type MutationRemoveCallingsFromPermissionArgs = {
  input: PermissionCallings;
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


export type MutationStartTriviaGameArgs = {
  gameId: Scalars['ID']['input'];
};


export type MutationSubmitTriviaAnswerArgs = {
  answer: TriviaAnswer;
};


export type MutationVerifyEmailArgs = {
  code: Scalars['Int']['input'];
  email: Scalars['EmailAddress']['input'];
};

export type OffsetPaging = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  hasNextPage: Scalars['Boolean']['output'];
  pageOffset: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
};

export type Permission = {
  __typename?: 'Permission';
  callings: Array<Calling>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type PermissionAssociateCallingsError = {
  __typename?: 'PermissionAssociateCallingsError';
  code: PermissionAssociateCallingsErrorCode;
  message: Scalars['String']['output'];
};

export enum PermissionAssociateCallingsErrorCode {
  CallingNotFound = 'CALLING_NOT_FOUND',
  PermissionNotFound = 'PERMISSION_NOT_FOUND',
  UnexpectedError = 'UNEXPECTED_ERROR'
}

export type PermissionAssociateCallingsPayload = {
  __typename?: 'PermissionAssociateCallingsPayload';
  callings: Array<Calling>;
  error?: Maybe<PermissionAssociateCallingsError>;
  success: Scalars['Boolean']['output'];
};

export type PermissionCallings = {
  callingIds: Array<Scalars['ID']['input']>;
  permissionId: Scalars['ID']['input'];
};

export type PermissionConnection = {
  __typename?: 'PermissionConnection';
  edges: Array<PermissionEdge>;
  pageInfo: PageInfo;
};

export type PermissionCreate = {
  callings?: InputMaybe<Array<Scalars['ID']['input']>>;
  name: Scalars['String']['input'];
};

export type PermissionDeleteError = {
  __typename?: 'PermissionDeleteError';
  code: PermissionDeleteErrorCode;
  message: Scalars['String']['output'];
};

export enum PermissionDeleteErrorCode {
  PermissionNotFound = 'PERMISSION_NOT_FOUND',
  UnexpectedError = 'UNEXPECTED_ERROR'
}

export type PermissionDeletePayload = {
  __typename?: 'PermissionDeletePayload';
  error?: Maybe<PermissionDeleteError>;
  success: Scalars['Boolean']['output'];
};

export type PermissionEdge = {
  __typename?: 'PermissionEdge';
  node: Permission;
};

export type PermissionError = {
  __typename?: 'PermissionError';
  code: PermissionErrorCode;
  message: Scalars['String']['output'];
};

export enum PermissionErrorCode {
  InvalidPermissionName = 'INVALID_PERMISSION_NAME',
  PermissionAlreadyExists = 'PERMISSION_ALREADY_EXISTS',
  UnexpectedError = 'UNEXPECTED_ERROR'
}

export type PermissionFilters = {
  callingIsNotOneOf?: InputMaybe<Array<Scalars['ID']['input']>>;
  callingIsOneOf?: InputMaybe<Array<Scalars['ID']['input']>>;
  nameContains?: InputMaybe<Scalars['String']['input']>;
};

export type PermissionPayload = {
  __typename?: 'PermissionPayload';
  error?: Maybe<PermissionError>;
  permission?: Maybe<Permission>;
  success: Scalars['Boolean']['output'];
};

export type PermissionRemoveCallingsPayload = {
  __typename?: 'PermissionRemoveCallingsPayload';
  error?: Maybe<PermissionAssociateCallingsError>;
  success: Scalars['Boolean']['output'];
};

export type PermissionSearch = {
  filters?: InputMaybe<PermissionFilters>;
  paging?: InputMaybe<OffsetPaging>;
};

export type PlayerScore = {
  __typename?: 'PlayerScore';
  playerName: Scalars['String']['output'];
  score: Scalars['Int']['output'];
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
  callings?: Maybe<CallingConnection>;
  currentGame?: Maybe<TriviaGame>;
  myTriviaScore: Array<TriviaPlayerScore>;
  permissions?: Maybe<PermissionConnection>;
  self?: Maybe<User>;
  users?: Maybe<UserConnection>;
};


export type QueryAvailabilityBlocksArgs = {
  bishopricMember: Scalars['ID']['input'];
};


export type QueryAvailableTimeSlotsArgs = {
  bishopricMember: Scalars['ID']['input'];
  durationInMinutes: Scalars['Int']['input'];
};


export type QueryCallingsArgs = {
  input?: InputMaybe<CallingSearch>;
};


export type QueryPermissionsArgs = {
  input?: InputMaybe<PermissionSearch>;
};


export type QueryUsersArgs = {
  input?: InputMaybe<UserSearch>;
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
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
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

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Subscription = {
  __typename?: 'Subscription';
  joinTriviaGameAsAdmin: TriviaGameUpdateForAdmin;
  joinTriviaGameAsBoard: TriviaGameUpdateForBoard;
  joinTriviaGameAsPlayer: TriviaGameUpdateForPlayer;
};

export type TimeSlot = {
  __typename?: 'TimeSlot';
  end?: Maybe<Scalars['DateTime']['output']>;
  start?: Maybe<Scalars['DateTime']['output']>;
};

export enum TriviaAnswer {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D'
}

export type TriviaGame = {
  __typename?: 'TriviaGame';
  id: Scalars['ID']['output'];
};

export type TriviaGameError = GenericError & {
  __typename?: 'TriviaGameError';
  code?: Maybe<TriviaGameErrorCodes>;
  message?: Maybe<Scalars['String']['output']>;
};

export enum TriviaGameErrorCodes {
  GameAlreadyExists = 'GAME_ALREADY_EXISTS',
  GameNotFound = 'GAME_NOT_FOUND',
  InsufficientPermissions = 'INSUFFICIENT_PERMISSIONS',
  UnknownError = 'UNKNOWN_ERROR'
}

export type TriviaGamePayload = {
  __typename?: 'TriviaGamePayload';
  error?: Maybe<TriviaGameError>;
  success: Scalars['Boolean']['output'];
};

export type TriviaGameScore = {
  __typename?: 'TriviaGameScore';
  category: Scalars['String']['output'];
  scores: Array<PlayerScore>;
};

export enum TriviaGameState {
  Answer = 'ANSWER',
  Closed = 'CLOSED',
  Paused = 'PAUSED',
  Question = 'QUESTION',
  Score = 'SCORE',
  Splash = 'SPLASH',
  Stopped = 'STOPPED'
}

export type TriviaGameUpdateForAdmin = {
  __typename?: 'TriviaGameUpdateForAdmin';
  question?: Maybe<TriviaQuestion>;
  state: TriviaGameState;
  time?: Maybe<Scalars['Int']['output']>;
};

export type TriviaGameUpdateForBoard = {
  __typename?: 'TriviaGameUpdateForBoard';
  question?: Maybe<TriviaQuestion>;
  scores?: Maybe<Array<TriviaGameScore>>;
  state: TriviaGameState;
  time?: Maybe<Scalars['Int']['output']>;
};

export type TriviaGameUpdateForPlayer = {
  __typename?: 'TriviaGameUpdateForPlayer';
  question?: Maybe<TriviaQuestion>;
  state: TriviaGameState;
  time?: Maybe<Scalars['Int']['output']>;
};

export type TriviaOption = {
  __typename?: 'TriviaOption';
  option: TriviaAnswer;
  text: Scalars['String']['output'];
};

export type TriviaPlayerScore = {
  __typename?: 'TriviaPlayerScore';
  category: Scalars['String']['output'];
  score: Scalars['Int']['output'];
};

export type TriviaQuestion = {
  __typename?: 'TriviaQuestion';
  category: Scalars['String']['output'];
  correctAnswer?: Maybe<TriviaAnswer>;
  options: Array<TriviaOption>;
  question: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  callings: Array<Calling>;
  email: Scalars['EmailAddress']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isSiteAdmin?: Maybe<Scalars['Boolean']['output']>;
  lastName: Scalars['String']['output'];
};

export type UserConnection = {
  __typename?: 'UserConnection';
  edges: Array<UserEdge>;
  pageInfo: PageInfo;
};

export type UserEdge = {
  __typename?: 'UserEdge';
  node: User;
};

export type UserFilters = {
  callingIsOneOf?: InputMaybe<Array<Scalars['ID']['input']>>;
  emailContains?: InputMaybe<Scalars['String']['input']>;
  firstNameContains?: InputMaybe<Scalars['String']['input']>;
  hasCalling?: InputMaybe<Scalars['Boolean']['input']>;
  isEmailVerified?: InputMaybe<Scalars['Boolean']['input']>;
  isSiteAdmin?: InputMaybe<Scalars['Boolean']['input']>;
  lastNameContains?: InputMaybe<Scalars['String']['input']>;
};

export type UserSearch = {
  filters?: InputMaybe<UserFilters>;
  paging?: InputMaybe<OffsetPaging>;
  sorting?: InputMaybe<Array<UserSorting>>;
};

export enum UserSortField {
  Email = 'EMAIL',
  FirstName = 'FIRST_NAME',
  IsEmailVerified = 'IS_EMAIL_VERIFIED',
  IsSiteAdmin = 'IS_SITE_ADMIN',
  LastName = 'LAST_NAME'
}

export type UserSorting = {
  direction: SortDirection;
  field: UserSortField;
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

export type UserDetailsFragment = { __typename?: 'User', id: string, firstName: string, lastName: string, email: any, isSiteAdmin?: boolean | null, callings: Array<{ __typename?: 'Calling', id: string, name: string }> };

export type SelfQueryVariables = Exact<{ [key: string]: never; }>;


export type SelfQuery = { __typename?: 'Query', self?: { __typename?: 'User', id: string, firstName: string, lastName: string, email: any, isSiteAdmin?: boolean | null, callings: Array<{ __typename?: 'Calling', id: string, name: string }> } | null };

export type SignUpMutationVariables = Exact<{
  input: SignUpDetails;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp: { __typename?: 'SignUpPayload', success: boolean, error?: { __typename?: 'SignUpError', code?: SignUpErrorCodes | null, message?: string | null } | null } };

export type LoginMutationVariables = Exact<{
  input: Credentials;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginPayload', success: boolean, user?: { __typename?: 'User', id: string, firstName: string, lastName: string, email: any, callings: Array<{ __typename?: 'Calling', id: string, name: string }> } | null, error?: { __typename?: 'LoginError', code?: LoginErrorCodes | null, message?: string | null } | null } };

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

export type SubmitTriviaAnswerMutationVariables = Exact<{
  answer: TriviaAnswer;
}>;


export type SubmitTriviaAnswerMutation = { __typename?: 'Mutation', submitTriviaAnswer: { __typename?: 'TriviaGamePayload', success: boolean, error?: { __typename?: 'TriviaGameError', code?: TriviaGameErrorCodes | null, message?: string | null } | null } };

export type JoinTriviaGameAsPlayerSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type JoinTriviaGameAsPlayerSubscription = { __typename?: 'Subscription', joinTriviaGameAsPlayer: { __typename?: 'TriviaGameUpdateForPlayer', state: TriviaGameState, time?: number | null, question?: { __typename?: 'TriviaQuestion', question: string, correctAnswer?: TriviaAnswer | null, category: string, options: Array<{ __typename?: 'TriviaOption', option: TriviaAnswer, text: string }> } | null } };

export type CurrentGameQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentGameQuery = { __typename?: 'Query', currentGame?: { __typename?: 'TriviaGame', id: string } | null };

export type ChangeMyTriviaPlayerNameMutationVariables = Exact<{
  newName: Scalars['String']['input'];
}>;


export type ChangeMyTriviaPlayerNameMutation = { __typename?: 'Mutation', changeMyTriviaPlayerName: { __typename?: 'TriviaGamePayload', success: boolean, error?: { __typename?: 'TriviaGameError', code?: TriviaGameErrorCodes | null, message?: string | null } | null } };

export type CreateTriviaGameMutationVariables = Exact<{
  gameId: Scalars['ID']['input'];
}>;


export type CreateTriviaGameMutation = { __typename?: 'Mutation', createTriviaGame: { __typename?: 'TriviaGamePayload', success: boolean, error?: { __typename?: 'TriviaGameError', code?: TriviaGameErrorCodes | null, message?: string | null } | null } };

export type StartTriviaGameMutationVariables = Exact<{
  gameId: Scalars['ID']['input'];
}>;


export type StartTriviaGameMutation = { __typename?: 'Mutation', startTriviaGame: { __typename?: 'TriviaGamePayload', success: boolean, error?: { __typename?: 'TriviaGameError', code?: TriviaGameErrorCodes | null, message?: string | null } | null } };

export type NextTriviaQuestionMutationVariables = Exact<{ [key: string]: never; }>;


export type NextTriviaQuestionMutation = { __typename?: 'Mutation', nextTriviaQuestion: { __typename?: 'TriviaGamePayload', success: boolean, error?: { __typename?: 'TriviaGameError', code?: TriviaGameErrorCodes | null, message?: string | null } | null } };

export type PauseTriviaGameMutationVariables = Exact<{ [key: string]: never; }>;


export type PauseTriviaGameMutation = { __typename?: 'Mutation', pauseTriviaGame: { __typename?: 'TriviaGamePayload', success: boolean, error?: { __typename?: 'TriviaGameError', code?: TriviaGameErrorCodes | null, message?: string | null } | null } };

export type ResumeTriviaGameMutationVariables = Exact<{ [key: string]: never; }>;


export type ResumeTriviaGameMutation = { __typename?: 'Mutation', resumeTriviaGame: { __typename?: 'TriviaGamePayload', success: boolean, error?: { __typename?: 'TriviaGameError', code?: TriviaGameErrorCodes | null, message?: string | null } | null } };

export type CloseTriviaGameMutationVariables = Exact<{ [key: string]: never; }>;


export type CloseTriviaGameMutation = { __typename?: 'Mutation', closeTriviaGame: { __typename?: 'TriviaGamePayload', success: boolean, error?: { __typename?: 'TriviaGameError', code?: TriviaGameErrorCodes | null, message?: string | null } | null } };

export type StopTriviaGameMutationVariables = Exact<{ [key: string]: never; }>;


export type StopTriviaGameMutation = { __typename?: 'Mutation', stopTriviaGame: { __typename?: 'TriviaGamePayload', success: boolean, error?: { __typename?: 'TriviaGameError', code?: TriviaGameErrorCodes | null, message?: string | null } | null } };

export type ShowScoreAfterQuestionMutationVariables = Exact<{ [key: string]: never; }>;


export type ShowScoreAfterQuestionMutation = { __typename?: 'Mutation', showScoreAfterQuestion: { __typename?: 'TriviaGamePayload', success: boolean, error?: { __typename?: 'TriviaGameError', code?: TriviaGameErrorCodes | null, message?: string | null } | null } };

export type ShowScoreImmediatelyMutationVariables = Exact<{ [key: string]: never; }>;


export type ShowScoreImmediatelyMutation = { __typename?: 'Mutation', showScoreImmediately: { __typename?: 'TriviaGamePayload', success: boolean, error?: { __typename?: 'TriviaGameError', code?: TriviaGameErrorCodes | null, message?: string | null } | null } };

export type JoinTriviaGameAsAdminSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type JoinTriviaGameAsAdminSubscription = { __typename?: 'Subscription', joinTriviaGameAsAdmin: { __typename?: 'TriviaGameUpdateForAdmin', state: TriviaGameState, time?: number | null, question?: { __typename?: 'TriviaQuestion', question: string, correctAnswer?: TriviaAnswer | null, category: string, options: Array<{ __typename?: 'TriviaOption', option: TriviaAnswer, text: string }> } | null } };

export type JoinTriviaGameAsBoardSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type JoinTriviaGameAsBoardSubscription = { __typename?: 'Subscription', joinTriviaGameAsBoard: { __typename?: 'TriviaGameUpdateForBoard', state: TriviaGameState, time?: number | null, question?: { __typename?: 'TriviaQuestion', question: string, correctAnswer?: TriviaAnswer | null, category: string, options: Array<{ __typename?: 'TriviaOption', option: TriviaAnswer, text: string }> } | null, scores?: Array<{ __typename?: 'TriviaGameScore', category: string, scores: Array<{ __typename?: 'PlayerScore', playerName: string, score: number }> }> | null } };

export type MyTriviaScoreQueryVariables = Exact<{ [key: string]: never; }>;


export type MyTriviaScoreQuery = { __typename?: 'Query', myTriviaScore: Array<{ __typename?: 'TriviaPlayerScore', category: string, score: number }> };

export type CallingListItemFragment = { __typename?: 'Calling', id: string, name: string, assignedTo: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string }> };

export type CallingsSearchQueryVariables = Exact<{
  input?: InputMaybe<CallingSearch>;
}>;


export type CallingsSearchQuery = { __typename?: 'Query', callings?: { __typename?: 'CallingConnection', edges: Array<{ __typename?: 'CallingEdge', node: { __typename?: 'Calling', id: string, name: string, assignedTo: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string }> } }>, pageInfo: { __typename?: 'PageInfo', pageSize: number, pageOffset: number, hasNextPage: boolean, totalCount: number } } | null };

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

export type UserListItemFragment = { __typename?: 'User', id: string, firstName: string, lastName: string, callings: Array<{ __typename?: 'Calling', id: string, name: string }> };

export type UsersSearchQueryVariables = Exact<{
  input?: InputMaybe<UserSearch>;
}>;


export type UsersSearchQuery = { __typename?: 'Query', users?: { __typename?: 'UserConnection', edges: Array<{ __typename?: 'UserEdge', node: { __typename?: 'User', id: string, firstName: string, lastName: string, callings: Array<{ __typename?: 'Calling', id: string, name: string }> } }>, pageInfo: { __typename?: 'PageInfo', pageSize: number, pageOffset: number, hasNextPage: boolean, totalCount: number } } | null };

export const UserDetailsFragmentDoc = gql`
    fragment UserDetails on User {
  id
  firstName
  lastName
  email
  isSiteAdmin
  callings {
    id
    name
  }
}
    `;
export const CallingListItemFragmentDoc = gql`
    fragment CallingListItem on Calling {
  id
  name
  assignedTo {
    id
    firstName
    lastName
  }
}
    `;
export const UserListItemFragmentDoc = gql`
    fragment UserListItem on User {
  id
  firstName
  lastName
  callings {
    id
    name
  }
}
    `;
export const SelfDocument = gql`
    query Self {
  self {
    ...UserDetails
  }
}
    ${UserDetailsFragmentDoc}`;

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
      firstName
      lastName
      email
      callings {
        id
        name
      }
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
export const SubmitTriviaAnswerDocument = gql`
    mutation SubmitTriviaAnswer($answer: TriviaAnswer!) {
  submitTriviaAnswer(answer: $answer) {
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
  export class SubmitTriviaAnswerGQL extends Apollo.Mutation<SubmitTriviaAnswerMutation, SubmitTriviaAnswerMutationVariables> {
    document = SubmitTriviaAnswerDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const JoinTriviaGameAsPlayerDocument = gql`
    subscription JoinTriviaGameAsPlayer {
  joinTriviaGameAsPlayer {
    state
    question {
      question
      options {
        option
        text
      }
      correctAnswer
      category
    }
    time
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class JoinTriviaGameAsPlayerGQL extends Apollo.Subscription<JoinTriviaGameAsPlayerSubscription, JoinTriviaGameAsPlayerSubscriptionVariables> {
    document = JoinTriviaGameAsPlayerDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CurrentGameDocument = gql`
    query CurrentGame {
  currentGame {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CurrentGameGQL extends Apollo.Query<CurrentGameQuery, CurrentGameQueryVariables> {
    document = CurrentGameDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ChangeMyTriviaPlayerNameDocument = gql`
    mutation ChangeMyTriviaPlayerName($newName: String!) {
  changeMyTriviaPlayerName(newName: $newName) {
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
  export class ChangeMyTriviaPlayerNameGQL extends Apollo.Mutation<ChangeMyTriviaPlayerNameMutation, ChangeMyTriviaPlayerNameMutationVariables> {
    document = ChangeMyTriviaPlayerNameDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateTriviaGameDocument = gql`
    mutation CreateTriviaGame($gameId: ID!) {
  createTriviaGame(gameId: $gameId) {
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
  export class CreateTriviaGameGQL extends Apollo.Mutation<CreateTriviaGameMutation, CreateTriviaGameMutationVariables> {
    document = CreateTriviaGameDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const StartTriviaGameDocument = gql`
    mutation StartTriviaGame($gameId: ID!) {
  startTriviaGame(gameId: $gameId) {
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
  export class StartTriviaGameGQL extends Apollo.Mutation<StartTriviaGameMutation, StartTriviaGameMutationVariables> {
    document = StartTriviaGameDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const NextTriviaQuestionDocument = gql`
    mutation NextTriviaQuestion {
  nextTriviaQuestion {
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
  export class NextTriviaQuestionGQL extends Apollo.Mutation<NextTriviaQuestionMutation, NextTriviaQuestionMutationVariables> {
    document = NextTriviaQuestionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const PauseTriviaGameDocument = gql`
    mutation PauseTriviaGame {
  pauseTriviaGame {
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
  export class PauseTriviaGameGQL extends Apollo.Mutation<PauseTriviaGameMutation, PauseTriviaGameMutationVariables> {
    document = PauseTriviaGameDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ResumeTriviaGameDocument = gql`
    mutation ResumeTriviaGame {
  resumeTriviaGame {
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
  export class ResumeTriviaGameGQL extends Apollo.Mutation<ResumeTriviaGameMutation, ResumeTriviaGameMutationVariables> {
    document = ResumeTriviaGameDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CloseTriviaGameDocument = gql`
    mutation CloseTriviaGame {
  closeTriviaGame {
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
  export class CloseTriviaGameGQL extends Apollo.Mutation<CloseTriviaGameMutation, CloseTriviaGameMutationVariables> {
    document = CloseTriviaGameDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const StopTriviaGameDocument = gql`
    mutation StopTriviaGame {
  stopTriviaGame {
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
  export class StopTriviaGameGQL extends Apollo.Mutation<StopTriviaGameMutation, StopTriviaGameMutationVariables> {
    document = StopTriviaGameDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ShowScoreAfterQuestionDocument = gql`
    mutation ShowScoreAfterQuestion {
  showScoreAfterQuestion {
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
  export class ShowScoreAfterQuestionGQL extends Apollo.Mutation<ShowScoreAfterQuestionMutation, ShowScoreAfterQuestionMutationVariables> {
    document = ShowScoreAfterQuestionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ShowScoreImmediatelyDocument = gql`
    mutation ShowScoreImmediately {
  showScoreImmediately {
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
  export class ShowScoreImmediatelyGQL extends Apollo.Mutation<ShowScoreImmediatelyMutation, ShowScoreImmediatelyMutationVariables> {
    document = ShowScoreImmediatelyDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const JoinTriviaGameAsAdminDocument = gql`
    subscription JoinTriviaGameAsAdmin {
  joinTriviaGameAsAdmin {
    state
    question {
      question
      options {
        option
        text
      }
      correctAnswer
      category
    }
    time
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class JoinTriviaGameAsAdminGQL extends Apollo.Subscription<JoinTriviaGameAsAdminSubscription, JoinTriviaGameAsAdminSubscriptionVariables> {
    document = JoinTriviaGameAsAdminDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const JoinTriviaGameAsBoardDocument = gql`
    subscription JoinTriviaGameAsBoard {
  joinTriviaGameAsBoard {
    state
    question {
      question
      options {
        option
        text
      }
      correctAnswer
      category
    }
    scores {
      category
      scores {
        playerName
        score
      }
    }
    time
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class JoinTriviaGameAsBoardGQL extends Apollo.Subscription<JoinTriviaGameAsBoardSubscription, JoinTriviaGameAsBoardSubscriptionVariables> {
    document = JoinTriviaGameAsBoardDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const MyTriviaScoreDocument = gql`
    query MyTriviaScore {
  myTriviaScore {
    category
    score
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class MyTriviaScoreGQL extends Apollo.Query<MyTriviaScoreQuery, MyTriviaScoreQueryVariables> {
    document = MyTriviaScoreDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CallingsSearchDocument = gql`
    query CallingsSearch($input: CallingSearch) {
  callings(input: $input) {
    edges {
      node {
        ...CallingListItem
      }
    }
    pageInfo {
      pageSize
      pageOffset
      hasNextPage
      totalCount
    }
  }
}
    ${CallingListItemFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CallingsSearchGQL extends Apollo.Query<CallingsSearchQuery, CallingsSearchQueryVariables> {
    document = CallingsSearchDocument;
    
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
export const UsersSearchDocument = gql`
    query UsersSearch($input: UserSearch) {
  users(input: $input) {
    edges {
      node {
        ...UserListItem
      }
    }
    pageInfo {
      pageSize
      pageOffset
      hasNextPage
      totalCount
    }
  }
}
    ${UserListItemFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class UsersSearchGQL extends Apollo.Query<UsersSearchQuery, UsersSearchQueryVariables> {
    document = UsersSearchDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }