import { useState, useEffect } from "react";
import NoteActions from "./NotesActions";
import Notes from "./Notes";
import { NoteT } from "../types/types";
import { fetchNotes } from "../lib/utils";
import { useConfig } from "./ConfigContext";

export default function MainPage() {
  const config = useConfig();
  const [notes, setNotes] = useState<NoteT[]>([]);
  const [isFetchingNotes, setIsFecthingNotes] = useState(false);
  const [isShowingActiveNotes, setIsShowingActiveNotes] = useState(true);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    async function getNotes() {
      setIsFecthingNotes(true);
      await fetchNotes(config.SERVER_URL, setNotes, isShowingActiveNotes);
      setIsFecthingNotes(false);
    }
    getNotes();
  }, [isShowingActiveNotes]);
  return (
    <>
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
