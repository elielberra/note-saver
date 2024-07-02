import Modal from "./Modal";

export default function DeleteNoteModal({
  isOpen,
  handleCloseDeleteNoteModal,
  deleteNote
}: {
  isOpen: boolean;
  handleCloseDeleteNoteModal: () => void;
  deleteNote: () => void;
}) {
  function handleCloseModal() {
    handleCloseDeleteNoteModal();
  }
  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal}>
      <p>Are you sure that you want to delete this note?</p>
      <button className="modal-close-btn" onClick={handleCloseModal}>
        No
      </button>
      <button className="modal-close-btn" onClick={deleteNote}>
        Yes
      </button>
    </Modal>
  );
}
