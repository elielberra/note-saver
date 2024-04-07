import { useRef, useState, useEffect } from "react";
import Button from "./Button";
import { SelectedNoteT } from "./Notes";

type NoteModalProps = {
  setNoteSelected: React.Dispatch<React.SetStateAction<SelectedNoteT>>;
};

export default function NoteModal({
  setNoteSelected,
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
    setNoteSelected(null);
  }
  return (
    <dialog ref={modalRef}>
      {children}
      <Button text="Close" onClick={() => {closeModal()}} />
    </dialog>
  );
}
