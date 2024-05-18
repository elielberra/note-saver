import Button from "./Button";
import ArchivedIcon from "./icons/ArchivedIcon";
import UnarchivedIcon from "./icons/UnarchivedIcon";
import DeleteIcon from "./icons/DeleteIcon";
import Tag from "./Tag";
import "./NoteButtons.css";
import { NoteProps } from "./Note";
import AddIcon from "./icons/AddIcon";
import { NoteT } from "@backend/types";

export type NoteButtonsProps = {
  note: NoteT;
  setNotes: (value: React.SetStateAction<NoteT[]>) => void;
  isShowingActiveNotes: boolean;
};

export default function NoteButtons({ note, setNotes, isShowingActiveNotes }: NoteButtonsProps) {
  const { noteId, tags, isActive } = note;
  async function deleteNote() {
    setNotes((prevNotes) => [...prevNotes.filter((note) => note.noteId !== noteId)]);
    try {
      await fetch("/delete-note", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: noteId })
      });
    } catch (error) {
      console.error("Error while deleting a note:", error);
    }
  }

  async function addTag() {
    try {
      // TODO: Review logic of optimistic updates
      const response = await fetch("/create-tag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        // TODO?: Add typing to this body
        body: JSON.stringify({ noteId })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const { newTagId } = await response.json();
      setNotes((prevNotes) => {
        const oldNote = prevNotes.find((note) => note.noteId === noteId);
        if (!oldNote) {
          throw new Error(`No corresponding note was found for the note id ${noteId}`);
        }
        const newNote: NoteT = {
          ...oldNote,
          tags: [
            ...oldNote.tags,
            {
              tagId: newTagId,
              tagContent: ""
            }
          ]
        };
        const newNotes = [...prevNotes.filter((note) => note.noteId !== noteId), newNote];
        const sortedNewNotes = newNotes.sort((a, b) => a.noteId - b.noteId);
        return sortedNewNotes;
      });
    } catch (error) {
      console.error("Error while creating a new tag:", error);
    }
  }

  async function changeNoteStatus(noteStatus: boolean) {
    try {
      const response = await fetch("/set-note-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ noteId, isActive: noteStatus })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setNotes((prevNotes) => [...prevNotes.filter((note) => note.noteId !== noteId)]);
    } catch (error) {
      console.error("Error while creating a new tag:", error);
    }
  }

  return (
    <div className="note-btns">
      <div id="del-arch-btns">
        <Button
          id="delete-btn"
          className="note-btn del-arch-btn"
          Icon={DeleteIcon}
          iconProps={{ height: 17, fill: "white" }}
          onClick={deleteNote}
        />
        <Button
        // TODO: Change id name and classes
          id="archive-btn"
          className="note-btn del-arch-btn"
          Icon={isShowingActiveNotes ? ArchivedIcon : UnarchivedIcon}
          iconProps={{ height: 17 }}
          onClick={() => changeNoteStatus(!isActive)}
        />
      </div>
      <div id="tags">
        {tags.map((tag) => (
          <Tag key={tag.tagId} tag={tag} setNotes={setNotes} noteId={noteId} />
        ))}
        <Button
          id="add-tag-btn"
          className="note-btn"
          Icon={AddIcon}
          iconProps={{ height: 22, addBackgroundCircle: true }}
          onClick={addTag}
        />
      </div>
    </div>
  );
}
