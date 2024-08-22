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

export interface UpdateTagBody {
  id: number;
  newContent: string;
}

export interface DelenteEntityBody {
  id: number;
}

export interface CreateTagBody {
  noteId: number;
}

export interface SetNoteStatusBody {
  noteId: number;
  isActive: boolean;
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

declare global {
  namespace Express {
    interface User extends UserT {}
  }
}
