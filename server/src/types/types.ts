interface NoteBase {
  id: number;
  content: string;
  tags: string[];
};

export interface NotePSQL extends NoteBase {
  is_active: boolean;
}

export interface NoteT extends NoteBase {
  isActive: boolean;
}
