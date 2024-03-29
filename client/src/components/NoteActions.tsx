import Button from "./Button";
import AddIcon from "./icons/AddIcon";
import ArchivedIcon from "./icons/ArchivedIcon";
import SearchBar from "./SearchBar";
import "./NoteActions.css";

export default function NoteActions() {
  const iconProps = { height: 20, fill: "#D9D9D9" }
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
      />
    </div>
  );
}
