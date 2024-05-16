// interface NoteBase {
//   id: number;
//   content: string;
//   tags: string[];
// };

// export interface NotePSQL extends NoteBase {
//   is_active: boolean;
// }

// export interface NoteT extends NoteBase {
//   isActive: boolean;
// }

export interface TagT {
  tagId: number;
  tagContent: string;
}

export interface NoteT {
  noteId: number;
  noteContent: string;
  tags: TagT[];
  isActive: boolean;
};

export interface UpdateRequestBody {
  id: number;
  newContent: string;
}

export interface DeleteRequestBody {
  id: number;
}
