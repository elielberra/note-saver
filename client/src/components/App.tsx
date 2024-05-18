import { useState, useEffect } from "react";
import Header from "./Header";
import NoteActions from "./NotesActions";
import Notes from "./Notes";
import { NoteT } from "@backend/types";
import { getNotes } from "../lib/utils";

export default function App() {
  const [notes, setNotes] = useState<NoteT[]>([]);
  const [isShowingActiveNotes, setIsShowingActiveNotes] = useState(true);
  useEffect(() => {
    getNotes(setNotes, isShowingActiveNotes);
  }, []);
  return (
    <>
      <Header />
      <NoteActions setNotes={setNotes} isShowingActiveNotes={isShowingActiveNotes} setIsShowingActiveNotes={setIsShowingActiveNotes} />
      <Notes notes={notes} setNotes={setNotes} isShowingActiveNotes={isShowingActiveNotes}/>
    </>
  );
}
function getActiveNotes() {
  throw new Error("Function not implemented.");
}

