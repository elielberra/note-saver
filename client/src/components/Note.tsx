import NoteButtons from "./NoteButtons";
import "./Note.css";
import { NoteT } from "@backend/types";
import { useState, useCallback, useRef, useEffect } from "react";
import debounce from "lodash/debounce";

export type NoteProps = {
  note: NoteT;
  setNotes: (value: React.SetStateAction<NoteT[]>) => void;
  isShowingActiveNotes: boolean;
};

export default function Note({ note , setNotes, isShowingActiveNotes }: NoteProps) {
  const { noteId, noteContent, tags } = note;
  const [noteText, setNoteText] = useState(noteContent);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function saveNoteOnDB(newContent: string) {
    try {
      await fetch("/update-note-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: noteId, newContent })
      });
    } catch (error) {
      console.error("Error while updating note content:", error);
    }
  }

  // TODO: This trows a warning, for better understanding and solution read https://kyleshevlin.com/debounce-and-throttle-callbacks-with-react-hooks/
  const delayedNoteSave = useCallback(debounce(saveNoteOnDB, 500), []);

  function handleNoteContentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const newContent = event.target.value;
    setNoteText(newContent);
    setNotes((prevNotes) => [
      ...prevNotes.filter((note) => note.noteId !== noteId),
      {
        noteId: noteId,
        noteContent: newContent,
        tags: tags,
        isActive: true
      }
    ]);
    delayedNoteSave(event.target.value);
  }

  return (
    <div className="note">
      <textarea
        className="note-content"
        value={noteText}
        maxLength={500}
        onChange={handleNoteContentChange}
        ref={textareaRef}
      />
      <NoteButtons
        note={note}
        setNotes={setNotes}
        isShowingActiveNotes={isShowingActiveNotes}
      />
    </div>
  );
}
