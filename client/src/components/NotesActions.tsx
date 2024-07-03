import Button from "./Button";
import AddIcon from "./icons/AddIcon";
import ArchivedIcon from "./icons/ArchivedIcon";
import UnarchivedIcon from "./icons/UnarchivedIcon";
import SearchBar from "./SearchBar";
import "./NotesActions.css";
import { NoteT } from "@backend/types";
import { fetchNotes, handleErrorLogging } from "../lib/utils";

type NoteActionsProps = {
  setNotes: (value: React.SetStateAction<NoteT[]>) => void;
  isShowingActiveNotes: boolean;
  setIsShowingActiveNotes: React.Dispatch<React.SetStateAction<boolean>>;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
};
export default function NoteActions({
  setNotes,
  isShowingActiveNotes,
  setIsShowingActiveNotes,
  searchText,
  setSearchText
}: NoteActionsProps) {
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
        const responseBody = await response.text();
        throw new Error(
          `Response body: ${responseBody} - Status code: ${response.status} - Server error: ${response.statusText}`
        );
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
      handleErrorLogging(error, "Error while creating a new note");
    }
  }

  async function getNotesAccordingToStatus(notesStatus: boolean) {
    try {
      fetchNotes(setNotes, notesStatus);
      setIsShowingActiveNotes(notesStatus);
      setSearchText("");
    } catch (error) {
      handleErrorLogging(error, "Error while creating a new note");
    }
  }
  return (
    <div id="note-actions">
      <Button
        text={isShowingActiveNotes ? "Archived" : "Active"}
        className="note-actions-btn"
        id="toggle-notes-show"
        Icon={isShowingActiveNotes ? ArchivedIcon : UnarchivedIcon}
        iconProps={iconProps}
        onClick={() => getNotesAccordingToStatus(!isShowingActiveNotes)}
      />
      <SearchBar
        setNotes={setNotes}
        isShowingActiveNotes={isShowingActiveNotes}
        searchText={searchText}
        setSearchText={setSearchText}
      />
      {isShowingActiveNotes && (
        <Button
          text="Add"
          className="note-actions-btn"
          id="add-note"
          Icon={AddIcon}
          iconProps={iconProps}
          onClick={addNote}
        />
      )}
    </div>
  );
}
