import Button from "./Button";
import CrossIcon from "./icons/CrossIcon";
import "./Tag.css";
import { useCallback, useState } from "react";
import debounce from "lodash/debounce";
import { NoteT } from "@backend/types";

type TagProps = {
  tag: NoteT["tags"][number];
  setNotes: (value: React.SetStateAction<NoteT[]>) => void;
  noteId: NoteT["noteId"];
};

export default function Tag({ tag, setNotes, noteId }: TagProps) {
  const [tagContent, setTagContent] = useState(tag.tagContent);
  async function saveTagOnDB(newContent: string) {
    try {
      await fetch("/update-tag-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: tag.tagId, newContent })
      });
    } catch (error) {
      console.error("Error while updating tag content:", error);
    }
  }

  async function deleteTag() {
    // TODO: setNotes logic is repeated, evaluate ways to DRY
    setNotes((prevNotes) => {
      // Review if throwing an Error is the best course of action
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
    try {
      await fetch("/delete-tag", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: tag.tagId })
      });
    } catch (error) {
      console.error("Error while updating note content:", error);
    }
  }

  // TODO: This trows a warning, for better understanding and solution read https://kyleshevlin.com/debounce-and-throttle-callbacks-with-react-hooks/
  const delayedTagSave = useCallback(debounce(saveTagOnDB, 500), []);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newTagContent = event.target.value || "";
    setTagContent(newTagContent);
    setNotes((prevNotes) => {
      // Review if throwing an Error is the best course of action
      const oldNote = prevNotes.find((note) => note.noteId === noteId);
      if (!oldNote) {
        throw new Error(`No corresponding note was found for the note id ${noteId}`);
      }
      const oldTags = oldNote.tags.filter((oldTag) => oldTag.tagId !== tag.tagId);
      const tagsUnsorted = [...oldTags, { tagId: tag.tagId, tagContent: newTagContent }];
      const tagsSortedAsc = tagsUnsorted.sort((a, b) => a.tagId - b.tagId);
      const newNote: NoteT = {
        ...oldNote,
        tags: tagsSortedAsc
      };
      const newNotes = [...prevNotes.filter((note) => note.noteId !== noteId), newNote];
      const sortedNewNotes = newNotes.sort((a, b) => a.noteId - b.noteId);
      return sortedNewNotes;
    });
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
        value={tagContent ?? ''}
      />
      <Button
        className="delete-tag-icon"
        Icon={CrossIcon}
        iconProps={{ fill: "white", height: 19 }}
        onClick={deleteTag}
      />
    </div>
  );
}
