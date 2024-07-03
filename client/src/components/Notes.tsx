import { NoteT } from "@backend/types";
import Note from "./Note";
import "./Notes.css";
import FallbackText from "./FallbackText";

type NotesProps = {
  notes: NoteT[];
  setNotes: (value: React.SetStateAction<NoteT[]>) => void;
  isShowingActiveNotes: boolean;
  searchText: string;
};

export default function Notes({ notes, setNotes, isShowingActiveNotes, searchText }: NotesProps) {
  if (notes.length === 0) {
    if (searchText !== ""){
      return <FallbackText text="There are no notes with that tag" />;
    }
    else if (isShowingActiveNotes) {
      return <FallbackText text="You have no notes. Create a new one" />;
    } else {
      return <FallbackText text="There are no archived notes" />;
    }
  }
  return (
    <div id="notes-section">
      {notes.map((note) => (
        <Note
          key={note.noteId}
          note={note}
          setNotes={setNotes}
          isShowingActiveNotes={isShowingActiveNotes}
        />
      ))}
    </div>
  );
}
