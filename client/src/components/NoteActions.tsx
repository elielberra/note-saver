import Button from "./Button";
import AddIcon from "./icons/AddIcon";
import ArchivedIcon from "./icons/ArchivedIcon";
import "./NoteActions.css";

export default function NoteActions() {
  return (
    <div id="note-actions">
      <Button
        text="Archived"
        className="note-actions-btn"
        id="toggle-notes-show"
        Icon={ArchivedIcon}
        iconProps={{ height: 20 }}
      />
      <Button
        text="Add"
        className="note-actions-btn"
        id="add-note"
        Icon={AddIcon}
        iconProps={{ height: 20 }}
      />
    </div>
  );
}
