import { useState, useEffect, useRef } from "react";
import Note from "./Note";
import NoteModal from "./NoteModal";
import "./Notes.css";
import { NoteT } from "@backend/types";

export type SelectedNoteIdT = number | null;

export default function Notes() {
  const [notes, setNotes] = useState<NoteT[]>([]);
  const [idNoteSelected, setIdNoteSelected] = useState<SelectedNoteIdT>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function getNoteContent() {
    if (textareaRef.current) {
      return textareaRef.current.value;
    }
    // Evaluate if I can use non nullish operator instead
    return '';
  }

  useEffect(() => {
    async function fetchNotes() {
      const response = await fetch("/notes");
      const notes: NoteT[] = await response.json();
      setNotes(notes);
    }
    fetchNotes();
  }, []);

  if (idNoteSelected) {
    const selectedNoteData = notes.find((note) => note.id === idNoteSelected);
    return (
      <NoteModal
        notes={notes}
        idNoteSelected={idNoteSelected}
        setIdNoteSelected={setIdNoteSelected}
        getNoteContent={getNoteContent}
        setNotes={setNotes}
      >
        <Note
          key={selectedNoteData!.id}
          id={selectedNoteData!.id}
          content={selectedNoteData!.content}
          tags={selectedNoteData!.tags}
          textareaRef={textareaRef}
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
          setIdNoteSelected={setIdNoteSelected}
          textareaRef={textareaRef}
        />
      ))}
    </div>
  );
}
