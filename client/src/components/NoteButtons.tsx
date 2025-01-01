import Button from "./Button";
import ArchivedIcon from "./icons/ArchivedIcon";
import UnarchivedIcon from "./icons/UnarchivedIcon";
import DeleteIcon from "./icons/DeleteIcon";
import Tag from "./Tag";
import DeleteNoteModal from "./DeleteNoteModal";
import "./NoteButtons.css";
import AddIcon from "./icons/AddIcon";
import { NoteT } from "../types/types";
import {
  getHeadersWithAuthAndContentType,
  getNewSortedNotes,
  getNoteToBeUpdated,
  handleErrorInResponse,
  handleLogging
} from "../lib/utils";
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
      const response = await fetch("https://server.notesaver:8080/delete-note", {
        method: "DELETE",
        headers: getHeadersWithAuthAndContentType(),
        body: JSON.stringify({ id: noteId })
      });
      if (!response.ok) {
        handleErrorInResponse(response);
        return;
      }
      setNotes((prevNotes) => [...prevNotes.filter((note) => note.noteId !== noteId)]);
    } catch (error) {
      handleLogging("error", "Error while deleting a note", error);
    }
  }

  async function addTag() {
    try {
      const response = await fetch("https://server.notesaver:8080/create-tag", {
        method: "POST",
        headers: getHeadersWithAuthAndContentType(),
        body: JSON.stringify({ id: noteId })
      });
      if (!response.ok) {
        handleErrorInResponse(response);
        return;
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
      handleLogging("error", "Error while creating a new tag", error);
    }
  }

  async function changeNoteStatus(noteStatus: boolean) {
    try {
      const response = await fetch("https://server.notesaver:8080/set-note-status", {
        method: "POST",
        headers: getHeadersWithAuthAndContentType(),
        body: JSON.stringify({ id: noteId, isActive: noteStatus })
      });
      if (!response.ok) {
        handleErrorInResponse(response);
        return;
      }
      setNotes((prevNotes) => [...prevNotes.filter((note) => note.noteId !== noteId)]);
    } catch (error) {
      handleLogging("error", "Error while updating the note status", error);
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
          data-testid="delete-btn"
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
