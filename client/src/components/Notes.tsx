import { useState, useEffect } from "react";
import Note from "./Note";
import NoteModal from "./NoteModal";
import "./Notes.css";
import { NoteT } from "@backend/types";

export type SelectedNoteT = number | null;

export default function Notes() {
  const [notes, setNotes] = useState<NoteT[]>([]);
  const [noteSelected, setNoteSelected] = useState<SelectedNoteT>(null);
  useEffect(() => {
    async function fetchNotes() {
      const response = await fetch("/notes");
      const notes: NoteT[] = await response.json();
      setNotes(notes);
    }
    fetchNotes();
  }, []);

  if (noteSelected) {
    const selectedNoteData = notes.find((note) => note.id === noteSelected);
    return (
      <NoteModal setNoteSelected={setNoteSelected}>
        <Note
          key={selectedNoteData!.id}
          id={selectedNoteData!.id}
          content={selectedNoteData!.content}
          tags={selectedNoteData!.tags}
        />
      </NoteModal>
    );
  }
  return (
    <div id="notes-section">
      {notes.map((note) => (
        <Note
          key={note.id}
          id={note.id}
          content={note.content}
          tags={note.tags}
          setNoteSelected={setNoteSelected}
        />
      ))}
    </div>
  );
}
