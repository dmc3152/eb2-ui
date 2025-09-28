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
  DateTime: { input: any; output: any; }
};

export enum AppointmentCode {
  Baptism = 'BAPTISM',
  EcclesiasticalEndorsement = 'ECCLESIASTICAL_ENDORSEMENT',
  Mission = 'MISSION',
  Other = 'OTHER',
  PatriarchalBlessing = 'PATRIARCHAL_BLESSING',
  PersonalMatterLong = 'PERSONAL_MATTER_LONG',
  PersonalMatterShort = 'PERSONAL_MATTER_SHORT',
  TempleRecommend = 'TEMPLE_RECOMMEND',
  TempleRecommendRenewal = 'TEMPLE_RECOMMEND_RENEWAL',
  TempleWorker = 'TEMPLE_WORKER',
  TithingDeclaration = 'TITHING_DECLARATION'
}

export type AppointmentDetails = {
  bishopricMember: BishopricMember;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  timeSlot: AppointmentTimeSlot;
  type: AppointmentCode;
};

export type AppointmentError = GenericError & {
  __typename?: 'AppointmentError';
  code?: Maybe<AppointmentErrorCodes>;
  message?: Maybe<Scalars['String']['output']>;
};

export enum AppointmentErrorCodes {
  AppointmentConflict = 'APPOINTMENT_CONFLICT',
  InvalidTimeSlot = 'INVALID_TIME_SLOT',
  UnknownError = 'UNKNOWN_ERROR'
}

export type AppointmentPayload = {
  __typename?: 'AppointmentPayload';
  bishopricMember?: Maybe<BishopricMember>;
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
  code: AppointmentCode;
  description?: Maybe<Scalars['String']['output']>;
  durationInMinutes: Scalars['Int']['output'];
  interviewers: Array<BishopricMember>;
  name: Scalars['String']['output'];
};

export type AvailabilityBlock = {
  __typename?: 'AvailabilityBlock';
  availableSlot?: Maybe<TimeSlot>;
  bishopricMember?: Maybe<BishopricMember>;
  end?: Maybe<Scalars['DateTime']['output']>;
  priorityDirection?: Maybe<PriorityDirection>;
  start?: Maybe<Scalars['DateTime']['output']>;
};


export type AvailabilityBlockAvailableSlotArgs = {
  durationInMinutes: Scalars['Int']['input'];
};

export enum BishopricMember {
  Bishop = 'BISHOP',
  FirstCounselor = 'FIRST_COUNSELOR',
  SecondCounselor = 'SECOND_COUNSELOR'
}

export type GenericError = {
  message?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createAppointment: AppointmentPayload;
};


export type MutationCreateAppointmentArgs = {
  input: AppointmentDetails;
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
  user?: Maybe<User>;
};


export type QueryAvailabilityBlocksArgs = {
  bishopricMember: BishopricMember;
};


export type QueryAvailableTimeSlotsArgs = {
  bishopricMember: BishopricMember;
  durationInMinutes: Scalars['Int']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type TimeSlot = {
  __typename?: 'TimeSlot';
  end?: Maybe<Scalars['DateTime']['output']>;
  start?: Maybe<Scalars['DateTime']['output']>;
};

export type User = {
  __typename?: 'User';
  fullName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isAdmin: Scalars['Boolean']['output'];
};

export type AvailabilityBlocksQueryVariables = Exact<{
  durationInMinutes: Scalars['Int']['input'];
}>;


export type AvailabilityBlocksQuery = { __typename?: 'Query', allAvailabilityBlocks: Array<{ __typename?: 'AvailabilityBlock', start?: any | null, end?: any | null, bishopricMember?: BishopricMember | null, availableSlot?: { __typename?: 'TimeSlot', start?: any | null, end?: any | null } | null }> };

export type CreateAppointmentMutationVariables = Exact<{
  input: AppointmentDetails;
}>;


export type CreateAppointmentMutation = { __typename?: 'Mutation', createAppointment: { __typename?: 'AppointmentPayload', success: boolean, error?: { __typename?: 'AppointmentError', code?: AppointmentErrorCodes | null, message?: string | null } | null } };

export type AllAppointmentTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type AllAppointmentTypesQuery = { __typename?: 'Query', allAppointmentTypes: Array<{ __typename?: 'AppointmentType', code: AppointmentCode, name: string, description?: string | null, durationInMinutes: number, interviewers: Array<BishopricMember> }> };

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
    code
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