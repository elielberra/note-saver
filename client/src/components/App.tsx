import { useState, useEffect } from "react";
import Header from "./Header";
import NoteActions from "./NotesActions";
import Notes from "./Notes";
import { NoteT } from "../types/types";
import { fetchNotes } from "../lib/utils";

export default function App() {
  const [notes, setNotes] = useState<NoteT[]>([]);
  const [isFetchingNotes, setIsFecthingNotes] = useState(false);
  const [isShowingActiveNotes, setIsShowingActiveNotes] = useState(true);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    async function getNotes() {
      setIsFecthingNotes(true);
      await fetchNotes(setNotes, isShowingActiveNotes);
      setIsFecthingNotes(false);
    }
    getNotes();
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
      <Notes
        notes={notes}
        setNotes={setNotes}
        isShowingActiveNotes={isShowingActiveNotes}
        searchText={searchText}
        isFetchingNotes={isFetchingNotes}
      />
    </>
  );
}
