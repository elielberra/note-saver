import Button from "./Button";
import CrossIcon from "./icons/CrossIcon";
import "./Tag.css"
import { NoteProps } from "./Note";

type TagProps = {
    index: number;
    tag: NoteProps['tags'][number];
}

export default function Tag({index, tag}: TagProps) {
    return (
        <div key={index} className="note-btn tag">
          <input
            className="tag-text"
            type="text"
            style={{ width: (tag.length) + "ch" }}
            maxLength={20}
            defaultValue={tag}
          />
          <Button
            className="delete-tag-icon"
            Icon={CrossIcon}
            iconProps={{ fill: "white", height: 19 }}
          />
        </div>
      );
}