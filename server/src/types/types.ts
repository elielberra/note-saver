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
