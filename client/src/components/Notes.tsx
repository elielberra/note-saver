import Note from "./Note";
import "./Notes.css";

export type Note = {
    content: string;
    tags: string[];
}
const notes: Note[] = [
  {
    content: "Hi! I am a note :)",
    tags: ["Tag1", "Tag2aaaaaaaaaa"]
  }
];
export default function Notes() {
  return <div id="notes-section">
    {notes.map(note => {
        return <Note content={note.content} tags={note.tags}/>
    })}
  </div>;
}

