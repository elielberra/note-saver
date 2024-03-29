import NoteButtons from "./NoteButtons";
import "./Note.css";

export type NoteProps = {
  content: string;
  tags: string[];
};

export default function Note({ content, tags }: NoteProps) {
  return (
    <div className="note">
      <span className="note-content">{content}</span>
      <NoteButtons tags={tags}/>
    </div>
  );
}
