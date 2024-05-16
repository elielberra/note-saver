import NoteButtons from "./NoteButtons";
import "./Note.css";
import { NoteT } from "@backend/types";
import { useState, useCallback, useRef, useEffect } from "react";
import debounce from "lodash/debounce";

export type NoteProps = {
  id: NoteT["noteId"];
  content: NoteT["noteContent"];
  tags: NoteT["tags"];
  isActive: NoteT["isActive"];
  setNotes: (value: React.SetStateAction<NoteT[]>) => void;
};

export default function Note({ id, content, tags, setNotes }: NoteProps) {
  const [noteContent, setNoteContent] = useState(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function saveNoteOnDB(newContent: string) {
    try {
      await fetch("/update-note-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id, newContent })
      });
    } catch (error) {
      console.error("Error while updating note content:", error);
    }
  }

  // TODO: This trows a warning, for better understanding and solution read https://kyleshevlin.com/debounce-and-throttle-callbacks-with-react-hooks/
  const delayedNoteSave = useCallback(debounce(saveNoteOnDB, 500), []);

  function handleNoteContentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const newContent = event.target.value;
    setNoteContent(newContent);
    setNotes((prevNotes) => [
      ...prevNotes.filter((note) => note.noteId !== id),
      {
        noteId: id,
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
        value={noteContent}
        maxLength={500}
        onChange={handleNoteContentChange}
        ref={textareaRef}
      />
      <NoteButtons noteTags={tags} setNotes={setNotes} noteId={id} />
    </div>
  );
}
