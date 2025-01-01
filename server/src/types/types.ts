export interface UserT {
  userId: number;
  username: string;
  password: string;
}

export interface TagT {
  tagId: number;
  tagContent: string;
}

export interface NoteT {
  noteId: number;
  noteContent: string;
  tags: TagT[];
  isActive: boolean;
}

export interface GetNotesQueryParams {
  areActive?: "true" | "false";
  filteringText?: string | undefined;
}

export interface UpdateEntityBody {
  id?: number | string;
  newContent?: string;
}

export interface RequestBodyWithId {
  id?: number | string;
}

export interface SetNoteStatusBody extends RequestBodyWithId {
  isActive?: boolean;
}

export type SignInBody = Omit<UserT, "userId">;

export interface ClientObject {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string | undefined;
}

export interface AuthResponseBody {
  isAuthenticated: boolean;
  message?: string;
}

export type AuthTokenUserInfo = Pick<UserT, "userId" | "username">;

export interface AuthTokenPayload extends AuthTokenUserInfo {
  iat: number;
  exp: number;
}

// Augment the Express module to add the User interface
declare module "express-serve-static-core" {
  interface Request {
    user: AuthTokenUserInfo;
  }
}

export interface AuthPostBody {
  username: string;
  password: string;
}

export const ALREADY_REGISTERED_USER = "AlreadyRegisteredUser" as const;
export const USER_NOT_FOUND = "UserNotFound" as const;
export const PASSWORD_NOT_VALID = "PasswordNotValid" as const;

const authErrors = [ALREADY_REGISTERED_USER, USER_NOT_FOUND, PASSWORD_NOT_VALID];

export type AuthErrors = null | Error | (typeof authErrors)[number];

declare module "passport-local" {
  interface VerifyFunction {
    (
      username: string,
      password: string,
      done: (error: AuthErrors, user?: UserT | false) => void
    ): void;
  }
}

export interface SuccessfulAuthResponse {
  username: UserT["username"];
}

export interface UnsuccessfulAuthResponse {
  message: string;
}

interface IsAuthenticatedSuccessfulResponse {
  isAuthenticated: true;
  username: string;
}

interface IsAuthenticatedUnsuccessfulResponse {
  isAuthenticated: false;
  username?: never;
}

export type IsAuthenticatedResponse =
  | IsAuthenticatedSuccessfulResponse
  | IsAuthenticatedUnsuccessfulResponse;

export type UserFieldName = "id" | "username";

export type FieldValue = number | string;

export const UNSPECIFIED_ERROR = "UnspecifiedError" as const;

export interface ErrorLogData {
  errorName?: Error["name"] | typeof UNSPECIFIED_ERROR;
  errorMessage?: Error["message"];
  errorStack?: Error["stack"];
}

type LogLevels = "error" | "warning" | "info" | "debug";

type Services = "client" | "server";

export interface LogData extends ErrorLogData {
  logLevel: LogLevels;
  logMessage: string;
  service: Services;
}
