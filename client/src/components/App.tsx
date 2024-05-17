import { useState, useEffect } from "react";
import Header from "./Header";
import NoteActions from "./NoteActions";
import Notes from "./Notes";
import { GetNotesParams, NoteT } from "@backend/types";

export default function App() {
  const [notes, setNotes] = useState<NoteT[]>([]);
  useEffect(() => {
    async function fetchNotes() {
      const queryParams: GetNotesParams = "areActive=true";
      const response = await fetch(`/notes?${queryParams}`);
      const notes: NoteT[] = await response.json();
      setNotes(notes);
    }
    fetchNotes();
  }, []);
  return (
    <>
      <Header />
      <NoteActions setNotes={setNotes} />
      <Notes notes={notes} setNotes={setNotes} />
    </>
  );
}
