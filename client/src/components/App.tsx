import { useState, useEffect } from "react";
import Header from "./Header";
import NoteActions from "./NotesActions";
import Notes from "./Notes";
import { NoteT } from "@backend/types";
import { fetchNotes } from "../lib/utils";

export default function App() {
  const [notes, setNotes] = useState<NoteT[]>([]);
  const [isShowingActiveNotes, setIsShowingActiveNotes] = useState(true);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    fetchNotes(setNotes, isShowingActiveNotes);
  }, [isShowingActiveNotes]);
  return (
    <>
      <Header />
      <NoteActions
        setNotes={setNotes}
        isShowingActiveNotes={isShowingActiveNotes}
        setIsShowingActiveNotes={setIsShowingActiveNotes}
        searchText={searchText}
        setSearchText={setSearchText}
      />
      <Notes notes={notes} setNotes={setNotes} isShowingActiveNotes={isShowingActiveNotes} searchText={searchText} />
    </>
  );
}
