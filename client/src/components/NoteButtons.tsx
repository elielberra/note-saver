import Button from "./Button";
import ArchivedIcon from "./icons/ArchivedIcon";
import DeleteIcon from "./icons/DeleteIcon";

import "./NoteButtons.css";
import { NoteProps } from "./Note";

export default function NoteButtons({ tags }: { tags: NoteProps["tags"] }) {
  return (
    <div className="note-btns">
      {tags.map((tag) => {
        return <Button className="note-btn" text={tag} />;
      })}
      <Button className="note-btn" Icon={ArchivedIcon} />
      <Button id="delete-btn" className="note-btn" Icon={DeleteIcon} />
    </div>
  );
}
