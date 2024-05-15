import NoteButtons from "./NoteButtons";
import "./Note.css";
import { SelectedNoteIdT } from "./Notes";
import { NoteT } from "@backend/types";
import { useState, useCallback } from "react";
import debounce from "lodash/debounce";

export type NoteProps = {
  id: number;
  content: string;
  tags: string[];
  isActive: boolean;
  setIdNoteSelected?: React.Dispatch<React.SetStateAction<SelectedNoteIdT>>;
  setNotes: (value: React.SetStateAction<NoteT[]>) => void;
};

export default function Note({ id, content, tags, setIdNoteSelected, setNotes }: NoteProps) {
  const [noteContent, setNoteContent] = useState(content);
  async function saveNote(newContent: string) {
    try {
      await fetch('/update-note-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, newContent })
      });
    } catch (error) {
      console.error('Error while updating note content:', error);
    }
  }

  // TODO: This trows a warning, for better understanding and solution read https://kyleshevlin.com/debounce-and-throttle-callbacks-with-react-hooks/
  const delayedNoteSave = useCallback(debounce(saveNote, 1500), [])

  function handleNoteChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const newContent = event.target.value;
    setNoteContent(newContent);
    setNotes((prevNotes) => [
      ...prevNotes.filter((note) => note.id !== id),
        {
          id: id,
          content: newContent,
          tags: tags,
          isActive: true
        }
    ])
    delayedNoteSave(event.target.value);
  }

  return (
    <div className="note" onClick={setIdNoteSelected ? () => setIdNoteSelected(id) : undefined}> 
      <textarea className="note-content" value={noteContent} maxLength={500} onChange={handleNoteChange}/>
      <NoteButtons tags={tags} />
    </div>
  );
}