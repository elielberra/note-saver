import Button from "./Button";
import ArchivedIcon from "./icons/ArchivedIcon";
import DeleteIcon from "./icons/DeleteIcon";
import Tag from "./Tag";
import "./NoteButtons.css";
import { NoteProps } from "./Note";
import AddIcon from "./icons/AddIcon";

export default function NoteButtons({ tags }: { tags: NoteProps["tags"] }) {
  // TODO adjust input size as user submits tag https://stackoverflow.com/questions/3392493/adjust-width-of-input-field-to-its-input
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
        {tags.map((tag, index) => (
          <Tag key={index} tag={tag} />
        ))}
        <Button id="add-tag-btn" className="note-btn" Icon={AddIcon} iconProps={{ height: 22, addBackgroundCircle: true  }} />
      </div>
    </div>
  );
}
