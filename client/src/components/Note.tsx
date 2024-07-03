import NoteButtons from "./NoteButtons";
import "./Note.css";
import { NoteT } from "@backend/types";
import { useState, useCallback, useRef, useMemo } from "react";
import debounce from "lodash/debounce";
import { handleErrorLogging } from "../lib/utils";

export type NoteProps = {
  note: NoteT;
  setNotes: (value: React.SetStateAction<NoteT[]>) => void;
  isShowingActiveNotes: boolean;
};

export default function Note({ note, setNotes, isShowingActiveNotes }: NoteProps) {
  const { noteId, noteContent, tags } = note;
  const [noteText, setNoteText] = useState(noteContent);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveNoteOnDB = useCallback(
    async (newContent: string) => {
      try {
        await fetch("/update-note-content", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ id: noteId, newContent })
        });
      } catch (error) {
        handleErrorLogging(error, "Error while updating note content");
      }
    },
    [noteId]
  );
  const delayedNoteSave = useMemo(() => debounce(saveNoteOnDB, 500), [saveNoteOnDB]);

  function handleNoteContentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    console.log("note content changing")
    const newContent = event.target.value;
    setNoteText(newContent);
    delayedNoteSave(event.target.value);
  }

  return (
    <div className="note">
      <textarea
        className="note-content"
        value={noteText}
        // maxLength must match the value of content max chars on seed.ts
        maxLength={2500}
        onChange={handleNoteContentChange}
        ref={textareaRef}
      />
      <NoteButtons note={note} setNotes={setNotes} isShowingActiveNotes={isShowingActiveNotes} />
    </div>
  );
}
