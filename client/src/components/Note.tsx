import NoteButtons from "./NoteButtons";
import "./Note.css";
import { SelectedNoteT } from "./Notes";

export type NoteProps = {
  id: number;
  content: string;
  tags: string[];
  setNoteSelected?: React.Dispatch<React.SetStateAction<SelectedNoteT>>;
};

export default function Note({ id, content, tags, setNoteSelected }: NoteProps) {
  return (
    <div className="note" onClick={setNoteSelected ? () => setNoteSelected(id) : undefined}> 
      <textarea className="note-content" defaultValue={content} maxLength={500} />
      <NoteButtons tags={tags} />
    </div>
  );
}