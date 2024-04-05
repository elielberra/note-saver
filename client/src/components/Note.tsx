import NoteButtons from "./NoteButtons";
import "./Note.css";

export type NoteProps = {
  content: string;
  tags: string[];
};

export default function Note({ content, tags }: NoteProps) {
  return (
    <div className="note">
      <textarea className="note-content" defaultValue={content} maxLength={500} />
      <NoteButtons tags={tags}/>
    </div>
  );
}
