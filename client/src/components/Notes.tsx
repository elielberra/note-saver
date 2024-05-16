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

  if (idNoteSelected) {
    const selectedNoteData = notes.find((note) => note.noteId === idNoteSelected);
    return (
      <NoteModal
        notes={notes}
        idNoteSelected={idNoteSelected}
        setIdNoteSelected={setIdNoteSelected}
        setNotes={setNotes}
      >
        <Note
          key={selectedNoteData!.noteId}
          id={selectedNoteData!.noteId}
          content={selectedNoteData!.noteContent}
          tags={selectedNoteData!.tags}
          isActive={selectedNoteData!.isActive}
          setNotes={setNotes}
        />
      </NoteModal>
    );
  }
  console.debug("notes", notes)
  return (
    <div id="notes-section">
      {notes.map((note) => (
        <Note
          key={note.noteId}
          id={note.noteId}
          content={note.noteContent}
          tags={note.tags}
          isActive={note.isActive}
          setIdNoteSelected={setIdNoteSelected}
          setNotes={setNotes}
        />
      ))}
    </div>
  );
}
