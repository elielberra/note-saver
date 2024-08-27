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

// TODO: Define as two separate types
export type IsAuthenticatedResponse =
  | {
      isAuthenticated: true;
      username: string;
    }
  | {
      isAuthenticated: false;
      username?: never;
    };
