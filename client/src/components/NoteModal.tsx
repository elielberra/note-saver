import { useRef, useState, useEffect } from "react";
import Button from "./Button";
import { SelectedNoteIdT } from "./Notes";
import { NoteT } from "@backend/types";

type NoteModalProps = {
  notes: NoteT[];
  idNoteSelected: SelectedNoteIdT;
  setIdNoteSelected: React.Dispatch<React.SetStateAction<SelectedNoteIdT>>;
  setNotes: (value: React.SetStateAction<NoteT[]>) => void;
};

export default function NoteModal({
  notes,
  setIdNoteSelected,
  setNotes,
  children
}: React.PropsWithChildren<NoteModalProps>) {
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  useEffect(() => {
    const modalElement = modalRef.current;
    modalElement && (isOpen ? modalElement.showModal() : modalElement.close());
  }, [isOpen]);

  function closeModal() {
    setIsOpen(false);
    setIdNoteSelected(null);
    
  }
  return (
    <dialog ref={modalRef}>
      {children}
      <Button
        text="Close"
        onClick={() => {
          closeModal();
        }}
      />
    </dialog>
  );
}
