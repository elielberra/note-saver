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

export interface SuccessfulAuthResponse extends Response, UserT {}

export interface UnsuccessfulAuthResponse extends Response {
  message: string;
}

export type AuthenticateUserResponse = SuccessfulAuthResponse | UnsuccessfulAuthResponse;

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
