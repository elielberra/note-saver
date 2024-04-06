import Note from "./Note";
import "./Notes.css";
import {NoteT} from "@backend/types"

const notes: NoteT[] = [
  {
    content: "Hi! I am a note :)",
    tags: ["Tag", "Interna"],
    active: true
  }
];
export default function Notes() {
  return <div id="notes-section">
    {notes.map((note, index) => <Note key={index} content={note.content} tags={note.tags}/>)}
  </div>;
}
