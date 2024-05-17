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

export interface UpdateReqBody {
  id: number;
  newContent: string;
}

export interface DeleteReqBody {
  id: number;
}

export interface CreateReqBody {
  noteId: number;
}
