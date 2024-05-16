import { useState, useEffect } from "react";
import Note from "./Note";
import "./Notes.css";
import { NoteT } from "@backend/types";

export type SelectedNoteIdT = number | null;

export default function Notes() {
  const [notes, setNotes] = useState<NoteT[]>([]);
  useEffect(() => {
    async function fetchNotes() {
      const response = await fetch("/notes");
      const notes: NoteT[] = await response.json();
      setNotes(notes);
    }
    fetchNotes();
  }, []);

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
        />
      ))}
    </div>
  );
}
