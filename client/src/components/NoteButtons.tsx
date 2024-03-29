import Button from "./Button";
import CrossIcon from "./icons/CrossIcon";
import ArchivedIcon from "./icons/ArchivedIcon";
import DeleteIcon from "./icons/DeleteIcon";
import "./NoteButtons.css";
import { NoteProps } from "./Note";
import AddIcon from "./icons/AddIcon";

export default function NoteButtons({ tags }: { tags: NoteProps["tags"] }) {
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
      {tags.map((tag) => {
        return (
          <div className="note-btn tag">
            <span className="tag-text">{tag}</span>
            <Button
              className="delete-tag-icon"
              Icon={CrossIcon}
              iconProps={{ fill: "white", height: 19 }}
            />
          </div>
        );
      })}
      <Button id="add-tag-btn" className="note-btn" Icon={AddIcon} iconProps={{ height: 22 }} />
    </div>
  );
}
