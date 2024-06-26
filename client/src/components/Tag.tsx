import Button from "./Button";
import CrossIcon from "./icons/CrossIcon";
import "./Tag.css";
import { useCallback, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import { NoteT } from "@backend/types";
import { handleErrorLogging } from "../lib/utils";

type TagProps = {
  tag: NoteT["tags"][number];
  setNotes: (value: React.SetStateAction<NoteT[]>) => void;
  noteId: NoteT["noteId"];
};

export default function Tag({ tag, setNotes, noteId }: TagProps) {
  const [tagContent, setTagContent] = useState(tag.tagContent);
  async function deleteTag() {
    try {
      const response = await fetch("/delete-tag", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: tag.tagId })
      });
      if (!response.ok) {
        throw new Error(`Error while updating the notes. Response Status Code: ${response.status}`);
      }
      // TODO: setNotes logic is repeated, evaluate ways to DRY
      setNotes((prevNotes) => {
        const oldNote = prevNotes.find((note) => note.noteId === noteId);
        if (!oldNote) {
          throw new Error(`No corresponding note was found for the note id ${noteId}`);
        }
        const filteredTags = oldNote.tags.filter((oldTag) => oldTag.tagId !== tag.tagId);
        const newNote: NoteT = {
          ...oldNote,
          tags: filteredTags
        };
        const newNotes = [...prevNotes.filter((note) => note.noteId !== noteId), newNote];
        const sortedNewNotes = newNotes.sort((a, b) => a.noteId - b.noteId);
        return sortedNewNotes;
      });
    } catch (error) {
      handleErrorLogging(error, "Error while updating note content");
    }
  }

  const saveTagOnDB = useCallback(
    async (newContent: string) => {
      try {
        await fetch("/update-tag-content", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ id: tag.tagId, newContent })
        });
      } catch (error) {
        handleErrorLogging(error, "Error while updating tag content");
      }
    },
    [tag.tagId]
  );
  const delayedTagSave = useMemo(() => debounce(saveTagOnDB, 500), [saveTagOnDB]);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newTagContent = event.target.value || "";
    setTagContent(newTagContent);
    delayedTagSave(newTagContent);
  }

  return (
    <div className="note-btn tag">
      <label id="edit-tag-label" hidden>
        Edit tag:
      </label>
      <input
        className="tag-text"
        type="text"
        maxLength={25}
        onChange={handleInputChange}
        value={tagContent ?? ""}
      />
      <Button
        className="delete-tag-icon"
        Icon={CrossIcon}
        iconProps={{ fill: "white", height: 30 }}
        onClick={deleteTag}
      />
    </div>
  );
}
