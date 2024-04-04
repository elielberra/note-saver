import Button from "./Button";
import CrossIcon from "./icons/CrossIcon";
import "./Tag.css";
import { NoteProps } from "./Note";

type TagProps = {
  tag: NoteProps["tags"][number];
};

export default function Tag({ tag }: TagProps) {
  const handleKeyPress = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === "Enter") {
      console.log("Pressed Enter");
      event.preventDefault();
    }
  };
  const handleBlur = (event: React.FocusEvent<HTMLSpanElement>) => console.log("Left focus")
  return (
    <div className="note-btn tag">
      <label id="edit-tag-label" hidden>Edit tag:</label>
      <span
        role="textbox"
        aria-multiline="false"
        aria-labelledby="edit-tag-label"
        contentEditable="true"
        suppressContentEditableWarning={true}
        className="tag-text"
        onKeyDown={handleKeyPress}
        onBlur={handleBlur}
      >
        {tag}
      </span>
      <Button
        className="delete-tag-icon"
        Icon={CrossIcon}
        iconProps={{ fill: "white", height: 19 }}
      />
    </div>
  );
}
