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

// TODO: Replace Req for Note or Tag
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

export interface SetNoteStatusBody {
  noteId: number;
  isActive: boolean;
}

export type GetNotesParams = "areActive=true" | "areActive=false";
