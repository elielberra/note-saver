import Button from "./Button";
import CrossIcon from "./icons/CrossIcon";
import "./Tag.css";
import { useCallback, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import { NoteT } from "../types/types";
import {
  getHeadersWithAuthAndContentType,
  getNewSortedNotes,
  getNoteToBeUpdated,
  handleErrorInResponse,
  handleLogging
} from "../lib/utils";
import { useConfig } from "./ConfigContext";

type TagProps = {
  tag: NoteT["tags"][number];
  setNotes: (value: React.SetStateAction<NoteT[]>) => void;
  noteId: NoteT["noteId"];
};

export default function Tag({ tag, setNotes, noteId }: TagProps) {
  const config = useConfig();
  const [tagContent, setTagContent] = useState(tag.tagContent);
  async function deleteTag() {
    try {
      const response = await fetch(`${config.SERVER_URL}/delete-tag`, {
        method: "DELETE",
        headers: getHeadersWithAuthAndContentType(),
        body: JSON.stringify({ id: tag.tagId })
      });
      if (!response.ok) {
        handleErrorInResponse(config.SERVER_URL, response);
        return;
      }
      setNotes((prevNotes) => {
        const oldNote = getNoteToBeUpdated(prevNotes, noteId);
        if (!oldNote) {
          throw new Error(`No corresponding note was found for the note id ${noteId}`);
        }
        const filteredTags = oldNote.tags.filter((oldTag) => oldTag.tagId !== tag.tagId);
        const newNote: NoteT = {
          ...oldNote,
          tags: filteredTags
        };
        return getNewSortedNotes(prevNotes, noteId, newNote);
      });
    } catch (error) {
      handleLogging(config.SERVER_URL, "error", "Error while updating note content", error);
    }
  }

  const saveTagOnDB = useCallback(
    async (newContent: string) => {
      try {
        const response = await fetch(`${config.SERVER_URL}/update-tag-content`, {
          method: "POST",
          headers: getHeadersWithAuthAndContentType(),
          body: JSON.stringify({ id: tag.tagId, newContent })
        });
        if (!response.ok) {
          handleErrorInResponse(config.SERVER_URL, response);
        }
      } catch (error) {
        handleLogging(config.SERVER_URL, "error", "Error while updating tag content", error);
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
        // maxLength must match the value of tag max chars on init.sql
        maxLength={20}
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
