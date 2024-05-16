import Button from "./Button";
import ArchivedIcon from "./icons/ArchivedIcon";
import DeleteIcon from "./icons/DeleteIcon";
import Tag from "./Tag";
import "./NoteButtons.css";
import { NoteProps } from "./Note";
import AddIcon from "./icons/AddIcon";
import { NoteT } from "@backend/types";

export type NoteButtonsProps = {
  noteTags: NoteProps["tags"];
  setNotes: (value: React.SetStateAction<NoteT[]>) => void;
  noteId: NoteT["noteId"];
};

export default function NoteButtons({ noteTags, setNotes, noteId }: NoteButtonsProps) {
  return (
    <div className="note-btns">
      <div id="del-arch-btns">
        <Button
          id="delete-btn"
          className="note-btn del-arch-btn"
          Icon={DeleteIcon}
          iconProps={{ height: 17, fill: "white" }}
        />
        <Button
          id="archive-btn"
          className="note-btn del-arch-btn"
          Icon={ArchivedIcon}
          iconProps={{ height: 17 }}
        />
      </div>
      <div id="tags">
        {noteTags.map((tag) => (
          <Tag key={tag.tagId} tag={tag} setNotes={setNotes} noteId={noteId}/>
        ))}
        <Button
          id="add-tag-btn"
          className="note-btn"
          Icon={AddIcon}
          iconProps={{ height: 22, addBackgroundCircle: true }}
        />
      </div>
    </div>
  );
}
