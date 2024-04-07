import NoteButtons from "./NoteButtons";
import "./Note.css";
import { SelectedNoteT } from "./Notes";

export type NoteProps = {
  content: string;
  tags: string[];
  setNoteSelected?: React.Dispatch<React.SetStateAction<SelectedNoteT>>;
};

export default function Note({ content, tags, setNoteSelected }: NoteProps) {
  return (
    <div className="note" onClick={setNoteSelected ? () => setNoteSelected(1) : undefined}> 
      <textarea className="note-content" defaultValue={content} maxLength={500} />
      <NoteButtons tags={tags} />
    </div>
  );
}