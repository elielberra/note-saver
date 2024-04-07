import { useState, useEffect } from "react";
import Note from "./Note";
import "./Notes.css";
import { NoteT } from "@backend/types";

export default function Notes() {
  const [notes, setNotes] = useState<NoteT[]>([]);
  useEffect(() => {
    async function fetchNotes() {
      const response = await fetch("/notes");
      const notes: NoteT[] = await response.json();
      setNotes(notes)
    }
    fetchNotes();
  }, []);

  return (
    <div id="notes-section">
      {notes.map((note, index) => (
        <Note key={index} content={note.content} tags={note.tags} />
      ))}
    </div>
  );
}
