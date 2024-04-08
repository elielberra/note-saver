import NoteButtons from "./NoteButtons";
import "./Note.css";
import { SelectedNoteIdT } from "./Notes";

export type NoteProps = {
  id: number;
  content: string;
  tags: string[];
  setIdNoteSelected?: React.Dispatch<React.SetStateAction<SelectedNoteIdT>>;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
};

export default function Note({ id, content, tags, setIdNoteSelected, textareaRef }: NoteProps) {
  return (
    <div className="note" onClick={setIdNoteSelected ? () => setIdNoteSelected(id) : undefined}> 
      <textarea className="note-content" defaultValue={content} maxLength={500} ref={textareaRef}/>
      <NoteButtons tags={tags} />
    </div>
  );
}