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

export interface UserT {
  username: string;
}

export interface SuccessfulAuthResponse extends Response, UserT {
  authToken: string;
}

export interface UnsuccessfulAuthResponse extends Response {
  message: string;
}

export type AuthenticateUserResponse = SuccessfulAuthResponse | UnsuccessfulAuthResponse;

export interface IsAuthenticatedSuccessfulResponse {
  isAuthenticated: true;
  username: string;
}

export interface IsAuthenticatedUnsuccessfulResponse {
  isAuthenticated: false;
  username?: never;
}

export type IsAuthenticatedResponse =
  | IsAuthenticatedSuccessfulResponse
  | IsAuthenticatedUnsuccessfulResponse;

export type AuthorizationTokenT = string | null;

export const UNSPECIFIED_ERROR = "UnspecifiedError" as const;

export interface ErrorLogData {
  errorName?: Error["name"] | typeof UNSPECIFIED_ERROR;
  errorMessage?: Error["message"];
  errorStack?: Error["stack"];
}

type Services = "client" | "server";

export type LogLevels = "error" | "warn" | "info" | "debug";

export interface LogData extends ErrorLogData {
  logLevel: LogLevels;
  logMessage: string;
  service: Services;
}
