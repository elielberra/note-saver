import { useState, useEffect } from "react";
import Note from "./Note";
import NoteModal from "./NoteModal";
import "./Notes.css";
import { NoteT } from "@backend/types";

export type SelectedNoteIdT = number | null;

export default function Notes() {
  const [notes, setNotes] = useState<NoteT[]>([]);
  
  const [idNoteSelected, setIdNoteSelected] = useState<SelectedNoteIdT>(null);

  useEffect(() => {
    async function fetchNotes() {
      const response = await fetch("/notes");
      const notes: NoteT[] = await response.json();
      setNotes(notes);
    }
    fetchNotes();
  }, []);
  console.debug("notes", notes[0])

  if (idNoteSelected) {
    const selectedNoteData = notes.find((note) => note.id === idNoteSelected);
    return (
      <NoteModal
        notes={notes}
        idNoteSelected={idNoteSelected}
        setIdNoteSelected={setIdNoteSelected}
        setNotes={setNotes}
      >
        <Note
          key={selectedNoteData!.id}
          id={selectedNoteData!.id}
          content={selectedNoteData!.content}
          tags={selectedNoteData!.tags}
          isActive={selectedNoteData!.isActive}
          setNotes={setNotes}
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
          isActive={note.isActive}
          setIdNoteSelected={setIdNoteSelected}
          setNotes={setNotes}
        />
      ))}
    </div>
  );
}
