import Button from "./Button";
import AddIcon from "./icons/AddIcon";
import ArchivedIcon from "./icons/ArchivedIcon";
import UnarchivedIcon from "./icons/UnarchivedIcon";
import SearchBar from "./SearchBar";
import "./NotesActions.css";
import { NoteT } from "../types/types";
import { fetchNotes, getHeadersWithAuth, handleErrorInResponse, handleLogging } from "../lib/utils";
import { useConfig } from "./ConfigContext";

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
  const config = useConfig();
  const iconProps = { height: 20, fill: "#D9D9D9" };

  async function addNote() {
    try {
      const response = await fetch(`${config.SERVER_URL}/create-note`, {
        method: "POST",
        headers: getHeadersWithAuth()
      });
      if (!response.ok) {
        handleErrorInResponse(config.SERVER_URL, response);
        return;
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
      handleLogging(config.SERVER_URL, "error", "Error while creating a new note", error);
    }
  }

  async function getNotesAccordingToStatus(notesStatus: boolean) {
    try {
      await fetchNotes(config.SERVER_URL, setNotes, notesStatus);
      setIsShowingActiveNotes(notesStatus);
      setSearchText("");
    } catch (error) {
      handleLogging(config.SERVER_URL, "error", "Error while creating a new note", error);
    }
  }
  return (
    <div id="note-actions">
      <SearchBar
        setNotes={setNotes}
        isShowingActiveNotes={isShowingActiveNotes}
        searchText={searchText}
        setSearchText={setSearchText}
      />
      <div id="note-btns">
        <Button
          text={isShowingActiveNotes ? "Archived" : "Active"}
          className="note-actions-btn"
          Icon={isShowingActiveNotes ? ArchivedIcon : UnarchivedIcon}
          iconProps={iconProps}
          onClick={() => getNotesAccordingToStatus(!isShowingActiveNotes)}
        />
        {isShowingActiveNotes && (
          <Button
            text="Add"
            className="note-actions-btn"
            Icon={AddIcon}
            iconProps={iconProps}
            onClick={addNote}
          />
        )}
      </div>
    </div>
  );
}
