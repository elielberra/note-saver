import Button from "./Button";
import AddIcon from "./icons/AddIcon";
import ArchivedIcon from "./icons/ArchivedIcon";
import SearchBar from "./SearchBar";
import "./NotesActions.css";
import { GetNotesParams, NoteT } from "@backend/types";

type NoteActionsProps = {
  setNotes: (value: React.SetStateAction<NoteT[]>) => void;
  isShowingActiveNotes: boolean;
  setIsShowingActiveNotes: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function NoteActions({ setNotes, isShowingActiveNotes, setIsShowingActiveNotes }: NoteActionsProps) {
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
        // TODO: Review Error messages on this component
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

  async function getNotesAccordingToStatus(notesStatus: boolean) {
    try {
      const queryParams: GetNotesParams = `areActive=${notesStatus}`;
      const response = await fetch(`/notes?${queryParams}`);
      if (!response.ok) {
        // TODO: Review Error messages on this component
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const notes: NoteT[] = await response.json();
      setNotes(notes);
      setIsShowingActiveNotes(notesStatus);
    } catch (error) {
      console.error("Error while creating a new note:", error);
    }
  }
  return (
    <div id="note-actions">
      <Button
        text={isShowingActiveNotes  ? "Archived" : "Active"}
        className="note-actions-btn"
        id="toggle-notes-show"
        Icon={ArchivedIcon}
        iconProps={iconProps}
        onClick={() => getNotesAccordingToStatus(!isShowingActiveNotes) }
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
