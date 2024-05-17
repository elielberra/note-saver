import { useState, useEffect } from "react";
import Header from "./Header";
import NoteActions from "./NotesActions";
import Notes from "./Notes";
import { GetNotesParams, NoteT } from "@backend/types";

export default function App() {
  const [notes, setNotes] = useState<NoteT[]>([]);
  const [isShowingActiveNotes, setIsShowingActiveNotes] = useState(true);
  useEffect(() => {
    async function getActiveNotes() {
      const queryParams: GetNotesParams = `areActive=${isShowingActiveNotes}`;
      const response = await fetch(`/notes?${queryParams}`);
      const activeNotes: NoteT[] = await response.json();
      setNotes(activeNotes);
    }
    getActiveNotes();
  }, []);
  return (
    <>
      <Header />
      <NoteActions setNotes={setNotes} isShowingActiveNotes={isShowingActiveNotes} setIsShowingActiveNotes={setIsShowingActiveNotes} />
      <Notes notes={notes} setNotes={setNotes} />
    </>
  );
}
