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

interface MessageResponse extends Response {
  message: string;
}

interface UserResponse extends Response {
  userId: number;
  username: string;
}

export type ResigterUserResponse = MessageResponse | UserResponse;

export interface IsUserAuthenticatedResponse {
  isAuthenticated: boolean;
  message?: string;
}
