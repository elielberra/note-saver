import { NoteT } from "@backend/types";
import Note from "./Note";
import "./Notes.css";

type NotesProps = {
  notes: NoteT[];
  setNotes: (value: React.SetStateAction<NoteT[]>) => void;
  isShowingActiveNotes: boolean;
}

export default function Notes({notes, setNotes, isShowingActiveNotes}: NotesProps) {
  return (
    <div id="notes-section">
      {notes.map((note) => (
        <Note
          key={note.noteId}
          id={note.noteId}
          content={note.noteContent}
          tags={note.tags}
          isActive={note.isActive}
          setNotes={setNotes}
          isShowingActiveNotes={isShowingActiveNotes}
        />
      ))}
    </div>
  );
}
