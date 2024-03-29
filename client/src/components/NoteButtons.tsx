import Button from "./Button";
import CrossIcon from "./icons/CrossIcon";
import ArchivedIcon from "./icons/ArchivedIcon";
import DeleteIcon from "./icons/DeleteIcon";
import "./NoteButtons.css";
import { NoteProps } from "./Note";

export default function NoteButtons({ tags }: { tags: NoteProps["tags"] }) {
  return (
    <div className="note-btns">
      {tags.map((tag) => {
        return (
          <Button
            className="note-btn tag-btn"
            text={tag}
            Icon={CrossIcon}
            iconProps={{ fill: "white", height: 17 }}
          />
        );
      })}
      <Button
        id="archive-btn"
        className="note-btn del-arch-btn"
        Icon={ArchivedIcon}
        iconProps={{ height: 17 }}
      />
      <Button
        id="delete-btn"
        className="note-btn del-arch-btn"
        Icon={DeleteIcon}
        iconProps={{ height: 17, fill: "white" }}
      />
    </div>
  );
}
