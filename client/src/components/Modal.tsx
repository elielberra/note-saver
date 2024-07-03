import { useRef, useEffect } from "react";
import "./Modal.css";

type ModalProps = {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
};

export default function Modal({ isOpen, children, onClose }: ModalProps) {
  const modalRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const modalElement = modalRef.current;
    if (modalElement) {
      isOpen ? modalElement.showModal() : modalElement.close();
    }
  }, [isOpen]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "Escape") {
      onClose();
    }
  }

  return (
    <dialog ref={modalRef} className="modal" onKeyDown={handleKeyDown}>
      {children}
    </dialog>
  );
}
