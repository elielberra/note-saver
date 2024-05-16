import Button from "./Button";
import CrossIcon from "./icons/CrossIcon";
import "./Tag.css";
import { NoteProps } from "./Note";
import { useRef, useCallback } from "react";
import debounce from "lodash/debounce";
import { NoteT } from "@backend/types";

type TagProps = {
  tag: NoteProps["tags"][number];
  setNotes: (value: React.SetStateAction<NoteT[]>) => void;
  noteId: NoteT["noteId"];
};

export default function Tag({ tag, setNotes, noteId }: TagProps) {
  const spanRef = useRef<HTMLSpanElement | null>(null);

  async function saveTagOnDB(newContent: string) {
    try {
      await fetch('/update-tag-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: tag.tagId, newContent })
      });
    } catch (error) {
      console.error('Error while updating tag content:', error);
    }
  }

  // TODO: This trows a warning, for better understanding and solution read https://kyleshevlin.com/debounce-and-throttle-callbacks-with-react-hooks/
  const delayedTagSave = useCallback(debounce(saveTagOnDB, 500), [])

  function handleNoteTagChange(event: React.KeyboardEvent<HTMLSpanElement>) {
    const newTagContent = spanRef.current?.innerText + event.key ?? "";
    setNotes((prevNotes) => {
      // Review if throwing an Error is the best course of action
      const oldNote = prevNotes.find((note) => note.noteId === noteId);
      if (!oldNote) {
        throw new Error(`No corresponding note was found for the note id ${noteId}`)
      }
      const oldTags = oldNote.tags.filter((oldTag) => oldTag.tagId !== tag.tagId )
      const tagsUnsorted = [...oldTags, { tagId: tag.tagId, tagContent: newTagContent} ]
      const tagsSortedAsc = tagsUnsorted.sort((a, b) => a.tagId - b.tagId)
      const newNote: NoteT = {
        ...oldNote,
        tags: tagsSortedAsc
      }
      return ([
      ...prevNotes.filter((note) => note.noteId !== noteId),
      newNote
    ])});
    delayedTagSave(newTagContent)
  }

  return (
    <div className="note-btn tag">
      <label id="edit-tag-label" hidden>
        Edit tag:
      </label>
      {/* TODO: Add maximum length of 25 */}
      {/* TODO: Instead the best idea would be to migrate to an input for better state control */}
      <span
        role="textbox"
        aria-multiline="false"
        aria-labelledby="edit-tag-label"
        contentEditable="true"
        suppressContentEditableWarning={true}
        className="tag-text"
        // TODO: change to onChange
        onKeyDown={handleNoteTagChange}
        ref={spanRef}
      >
        {tag.tagContent}
      </span>
      <Button
        className="delete-tag-icon"
        Icon={CrossIcon}
        iconProps={{ fill: "white", height: 19 }}
      />
    </div>
  );
}
