import Button from "./Button";
import AddIcon from "./icons/AddIcon";
import ArchivedIcon from "./icons/ArchivedIcon";
import SearchBar from "./SearchBar";
import "./NoteActions.css";
import { NoteT } from "@backend/types";

type NoteActionsProps = {
  setNotes: (value: React.SetStateAction<NoteT[]>) => void;
};
export default function NoteActions({ setNotes }: NoteActionsProps) {
  const iconProps = { height: 20, fill: "#D9D9D9" };

  async function addNote() {
    try {
      const response = await fetch("/create-note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const { newNoteId } = await response.json();
      setNotes((prevNotes) => [
        ...prevNotes,
        {
          noteId: newNoteId,
          noteContent: "",
          tags: [],
          isActive: true
        }
      ]);
    } catch (error) {
      console.error("Error while creating a new note:", error);
    }
  }
  return (
    <div id="note-actions">
      <Button
        text="Archived"
        className="note-actions-btn"
        id="toggle-notes-show"
        Icon={ArchivedIcon}
        iconProps={iconProps}
      />
      <SearchBar />
      <Button
        text="Add"
        className="note-actions-btn"
        id="add-note"
        Icon={AddIcon}
        iconProps={iconProps}
        onClick={addNote}
      />
    </div>
  );
}
