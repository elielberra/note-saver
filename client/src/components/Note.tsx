import NoteButtons from "./NoteButtons";
import "./Note.css";
import { NoteT } from "../types/types";
import { useState, useCallback, useRef, useMemo } from "react";
import debounce from "lodash/debounce";
import { getHeadersWithAuthAndContentType, handleErrorInResponse, handleErrorLogging } from "../lib/utils";

export type NoteProps = {
  note: NoteT;
  setNotes: (value: React.SetStateAction<NoteT[]>) => void;
  isShowingActiveNotes: boolean;
};

export default function Note({ note, setNotes, isShowingActiveNotes }: NoteProps) {
  const { noteId, noteContent } = note;
  const [noteText, setNoteText] = useState(noteContent);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveNoteOnDB = useCallback(
    async (newContent: string) => {
      try {
        const response = await fetch("https://server.notesaver:8080/update-note-content", {
          method: "POST",
          headers: getHeadersWithAuthAndContentType(),
          body: JSON.stringify({ id: noteId, newContent })
        });
        if (!response.ok) {
          handleErrorInResponse(response);
        }
      } catch (error) {
        handleErrorLogging(error, "Error while updating note content");
      }
    },
    [noteId]
  );
  const delayedNoteSave = useMemo(() => debounce(saveNoteOnDB, 500), [saveNoteOnDB]);

  function handleNoteContentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const newContent = event.target.value;
    setNoteText(newContent);
    delayedNoteSave(event.target.value);
  }

  return (
    <div className="note">
      <textarea
        className="note-content"
        value={noteText}
        // maxLength must match the value of content max chars on init.sql
        maxLength={2500}
        onChange={handleNoteContentChange}
        ref={textareaRef}
      />
      <NoteButtons note={note} setNotes={setNotes} isShowingActiveNotes={isShowingActiveNotes} />
    </div>
  );
}
