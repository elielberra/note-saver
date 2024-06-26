import Button from "./Button";
import AddIcon from "./icons/AddIcon";
import ArchivedIcon from "./icons/ArchivedIcon";
import UnarchivedIcon from "./icons/UnarchivedIcon";
import SearchBar from "./SearchBar";
import "./NotesActions.css";
import { NoteT } from "@backend/types";
import { fetchNotes } from "../lib/utils";
import { useState } from "react";

type NoteActionsProps = {
  setNotes: (value: React.SetStateAction<NoteT[]>) => void;
  isShowingActiveNotes: boolean;
  setIsShowingActiveNotes: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function NoteActions({
  setNotes,
  isShowingActiveNotes,
  setIsShowingActiveNotes
}: NoteActionsProps) {
  const [searchText, setSearchText] = useState("");
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
        throw new Error(`Error while adding a note. Response Status Code: ${response.status}`);
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
      fetchNotes(setNotes, notesStatus);
      setIsShowingActiveNotes(notesStatus);
      setSearchText("");
    } catch (error) {
      console.error("Error while creating a new note:", error);
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
