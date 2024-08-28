import Button from "./Button";
import ArchivedIcon from "./icons/ArchivedIcon";
import UnarchivedIcon from "./icons/UnarchivedIcon";
import DeleteIcon from "./icons/DeleteIcon";
import Tag from "./Tag";
import DeleteNoteModal from "./DeleteNoteModal";
import "./NoteButtons.css";
import AddIcon from "./icons/AddIcon";
import { NoteT } from "../types/types";
import { getNewSortedNotes, getNoteToBeUpdated, handleErrorLogging } from "../lib/utils";
import { useState } from "react";

export type NoteButtonsProps = {
  note: NoteT;
  setNotes: (value: React.SetStateAction<NoteT[]>) => void;
  isShowingActiveNotes: boolean;
};

export default function NoteButtons({ note, setNotes, isShowingActiveNotes }: NoteButtonsProps) {
  const { noteId, tags, isActive } = note;
  const [isDeleteNoteModalOpen, setIsDeleteNoteModalOpen] = useState(false);

  async function deleteNote() {
    try {
      const response = await fetch("http://localhost:3333/delete-note", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: noteId })
      });
      if (!response.ok) {
        const responseBody = await response.text();
        throw new Error(
          `Response body: ${responseBody} - Status code: ${response.status} - Server error: ${response.statusText}`
        );
      }
      setNotes((prevNotes) => [...prevNotes.filter((note) => note.noteId !== noteId)]);
    } catch (error) {
      handleErrorLogging(error, "Error while deleting a note");
    }
  }

  async function addTag() {
    try {
      const response = await fetch("http://localhost:3333/create-tag", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: noteId })
      });
      if (!response.ok) {
        const responseBody = await response.text();
        throw new Error(
          `Response body: ${responseBody} - Status code: ${response.status} - Server error: ${response.statusText}`
        );
      }
      const { newTagId } = await response.json();
      setNotes((prevNotes) => {
        const oldNote = getNoteToBeUpdated(prevNotes, noteId);
        const newNote: NoteT = {
          ...oldNote,
          tags: [
            ...oldNote.tags,
            {
              tagId: newTagId,
              tagContent: ""
            }
          ]
        };
        return getNewSortedNotes(prevNotes, noteId, newNote);
      });
    } catch (error) {
      handleErrorLogging(error, "Error while creating a new tag");
    }
  }

  async function changeNoteStatus(noteStatus: boolean) {
    try {
      const response = await fetch("http://localhost:3333/set-note-status", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: noteId, isActive: noteStatus })
      });
      if (!response.ok) {
        const responseBody = await response.text();
        throw new Error(
          `Response body: ${responseBody} - Status code: ${response.status} - Server error: ${response.statusText}`
        );
      }
      setNotes((prevNotes) => [...prevNotes.filter((note) => note.noteId !== noteId)]);
    } catch (error) {
      handleErrorLogging(error, "Error while updating the note status");
    }
  }

  function handleOpenDeleteNoteModal() {
    setIsDeleteNoteModalOpen(true);
  }

  function handleCloseDeleteNoteModal() {
    setIsDeleteNoteModalOpen(false);
  }

  return (
    <div className="note-btns">
      <div id="del-status-btns">
        <Button
          id="delete-btn"
          className="note-btn del-status-btn"
          Icon={DeleteIcon}
          iconProps={{ height: 27, fill: "white" }}
          onClick={handleOpenDeleteNoteModal}
        />
        <Button
          id="status-btn"
          className="note-btn del-status-btn"
          Icon={isShowingActiveNotes ? ArchivedIcon : UnarchivedIcon}
          iconProps={{ height: 27 }}
          onClick={() => changeNoteStatus(!isActive)}
        />
      </div>
      <div id="tags">
        {tags.map((tag) => (
          <Tag key={tag.tagId} tag={tag} setNotes={setNotes} noteId={noteId} />
        ))}
        {tags.length < 2 && (
          <Button
            id="add-tag-btn"
            className="note-btn"
            Icon={AddIcon}
            iconProps={{ height: 37.5, addBackgroundCircle: true }}
            onClick={addTag}
          />
        )}
        <DeleteNoteModal
          isOpen={isDeleteNoteModalOpen}
          handleCloseDeleteNoteModal={handleCloseDeleteNoteModal}
          deleteNote={deleteNote}
        />
      </div>
    </div>
  );
}
