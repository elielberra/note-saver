import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NoteButtons from "../components/NoteButtons";
import { NoteT } from "../types/types";

jest.mock("../lib/utils", () => ({
  getHeadersWithAuthAndContentType: jest.fn(),
  getNewSortedNotes: jest.fn(),
  getNoteToBeUpdated: jest.fn(),
  handleErrorInResponse: jest.fn(),
  handleErrorLogging: jest.fn()
}));

describe("NoteButtons Component", () => {
  it("deletes a note when 'Delete' button is clicked", async () => {

		const portalRoot = document.createElement("div");
    portalRoot.setAttribute("id", "root");
    document.body.appendChild(portalRoot);

    global.HTMLDialogElement.prototype.showModal = jest.fn();
    global.HTMLDialogElement.prototype.close = jest.fn();

    const mockFetch = jest.fn().mockResolvedValue({
      ok: true
    });
    global.fetch = mockFetch;

    const mockSetNotes = jest.fn();

    const note: NoteT = {
      noteId: 1,
      noteContent: "Test note",
      tags: [{ tagId: 1, tagContent: "Test Tag" }],
      isActive: true
    };

    const defaultProps = {
      note,
      setNotes: mockSetNotes,
      isShowingActiveNotes: true
    };

    render(<NoteButtons {...defaultProps} />);

    const deleteButton = screen.getByTestId("delete-btn");
    fireEvent.click(deleteButton);

    await waitFor(() => expect(global.HTMLDialogElement.prototype.showModal).toHaveBeenCalled());

    const yesButton = screen.getByText("Yes");
    fireEvent.click(yesButton);

    await waitFor(() => {
      expect(mockSetNotes).toHaveBeenCalledTimes(1);
    });

    const updaterFn = mockSetNotes.mock.calls[0][0];
    const updatedNotes = updaterFn([note]);

    expect(updatedNotes).toEqual([]);
  });
});
